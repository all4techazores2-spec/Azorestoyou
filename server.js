import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';
import axios from 'axios';
import { exec } from 'child_process';
import { readDB, writeDB, connectDB, getDbStatus, updateCollection, normalizeTrailData, publishLocalToCloud } from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, 'db.json');

// --- HELPERS ---
const normalizeEmail = (email) => {
    if (!email) return email;
    return email.toLowerCase().trim();
};

const timeToMinutes = (t) => {
    if (!t || typeof t !== 'string') return 0;
    const [h, m] = t.split(':').map(Number);
    return h * 60 + (m || 0);
};

const minutesToTime = (min) => {
    const h = Math.floor(min / 60);
    const m = min % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
};

// Multer Memory Storage (For Base64 storage in MongoDB)
const storage = multer.memoryStorage();
const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 } // Limite de 5MB por foto
});

import { v2 as cloudinary } from 'cloudinary';

// Cloudinary Configuration
cloudinary.config({
    cloud_name: (process.env.CLOUDINARY_CLOUD_NAME || '').trim(),
    api_key: (process.env.CLOUDINARY_API_KEY || '').trim(),
    api_secret: (process.env.CLOUDINARY_API_SECRET || '').trim()
});

const app = express();
const PORT = process.env.PORT || 3001;

// Configuração de CORS ultra-robusta
const allowedOrigins = [
  'https://azorestoyou.pt',
  'https://www.azorestoyou.pt',
  'https://azorestoyou2.all4techazores2.workers.dev',
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:5173'
];

app.use(cors({
    origin: (origin, callback) => {
        callback(null, true);
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
    credentials: true,
    optionsSuccessStatus: 200
}));

// Middleware para processar JSON (Deve estar ANTES das rotas)
app.use(bodyParser.json({ limit: '100mb' }));
app.use(bodyParser.urlencoded({ limit: '100mb', extended: true }));

// Logger de requisições para diagnóstico
app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;
        console.log(`📡 [${new Date().toLocaleTimeString()}] ${req.method} ${req.url} - Status: ${res.statusCode} (${duration}ms) - Origin: ${req.get('origin') || 'Direct'}`);
    });
    next();
});

const ALL_BUSINESS_COLLECTIONS = [
    'restaurants', 'beauty', 'shops', 'services', 'offices', 
    'hotels', 'cars', 'it_services', 'perfumes', 'animals', 
    'real_estate', 'gyms', 'stands', 'auto_repairs', 
    'auto_electronics', 'used_market', 'activities', 'flights', 'bus-schedules', 'marketplace_ads', 'marketplace_chats',
    'marketplace_categories', 'bars', 'events', 'municipal', 'tattoo_projects', 'news'
];

const ALL_KEYS = [...ALL_BUSINESS_COLLECTIONS, 'users', 'posts', 'hotel_room_qr_codes', 'hotel_room_requests'];

// --- CORE API ROUTES (MANUAL REGISTRATION FOR GUARANTEED MATCH) ---
app.get('/api/health', async (req, res) => {
    try {
        // Query database (bypass cache) to keep MongoDB Atlas active
        await readDB(true);
        res.json({ status: 'ok', database: 'active', uptime: process.uptime(), timestamp: new Date().toISOString() });
    } catch (err) {
        console.warn("⚠️ Health check DB warning:", err.message);
        res.json({ status: 'degraded', database: 'error', error: err.message, uptime: process.uptime(), timestamp: new Date().toISOString() });
    }
});

app.get('/api/test', (req, res) => res.send("Backend API is ALIVE - Registered at top"));

app.get('/api/db-diagnostics', (req, res) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    try {
        const status = getDbStatus();
        res.json(status);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
app.post('/api/upload-cloudinary', async (req, res) => {
    try {
        const { image, businessId, folderType, clientId, projectId } = req.body;
        if (!image) {
            return res.status(400).json({ error: "Missing image data" });
        }

        const validFolders = [
            'client_photos', 'references', 'previews', 'completed',
            'signatures', 'invoices', 'consent_forms', 'attachments'
        ];
        const targetFolder = validFolders.includes(folderType) ? folderType : 'general';
        const cloudinaryFolder = `azorestoyou/tattoo/${businessId || 'default'}/${targetFolder}`;

        const uploadResult = await cloudinary.uploader.upload(image, {
            folder: cloudinaryFolder,
            resource_type: 'auto'
        });

        res.json({
            businessId: businessId || 'default',
            clientId: clientId || 'anonymous',
            projectId: projectId || 'temp',
            folder: targetFolder,
            public_id: uploadResult.public_id,
            secure_url: uploadResult.secure_url,
            createdAt: new Date().toISOString(),
            width: uploadResult.width,
            height: uploadResult.height,
            format: uploadResult.format,
            bytes: uploadResult.bytes,
            tags: uploadResult.tags || []
        });
    } catch (err) {
        console.error("❌ Cloudinary upload failed:", err.message);
        res.status(500).json({ error: err.message });
    }
});

// Debug endpoint to check DB contents
app.get('/api/debug-db', async (req, res) => {
    try {
        const db = await readDB();
        const stats = {};
        Object.keys(db).forEach(k => {
            if (Array.isArray(db[k])) stats[k] = db[k].length;
        });
        res.json({
            status: getDbStatus(),
            collections_summary: stats,
            // Only show a small preview to avoid crashing browser with massive JSON
            preview: {
                restaurants_count: db.restaurants?.length || 0,
                first_restaurant: db.restaurants?.[0]?.name || 'N/A'
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Generic Business Update Handler
const handleBusinessUpdate = async (req, res) => {
    const { id } = req.params;
    const clientBusinessId = req.headers['x-business-id'] || req.body.id;
    if (clientBusinessId && clientBusinessId !== id) {
        return res.status(403).json({ error: "Acesso negado: Não tem permissão para alterar este negócio." });
    }
    try {
        const db = await readDB();
        let targetArray = null;
        let index = -1;
        
        ALL_BUSINESS_COLLECTIONS.forEach(key => {
            if (db[key]) {
                const idx = db[key].findIndex(item => item.id === id);
                if (idx !== -1) { index = idx; targetArray = db[key]; }
            }
        });

        if (targetArray && index !== -1) {
            const existingItem = targetArray[index];
            const updatedItem = { ...existingItem, ...req.body };

            // Protect specific real-time server-side collections from being overwritten by stale frontend data
            if (existingItem.reservations !== undefined) {
                if (req.body.reservations && Array.isArray(req.body.reservations)) {
                    updatedItem.reservations = req.body.reservations;
                } else {
                    updatedItem.reservations = existingItem.reservations;
                }
            }
            if (existingItem.kitchenOrders !== undefined) {
                if (req.body.kitchenOrders && Array.isArray(req.body.kitchenOrders)) {
                    updatedItem.kitchenOrders = req.body.kitchenOrders;
                } else {
                    updatedItem.kitchenOrders = existingItem.kitchenOrders;
                }
            }
            if (existingItem.tables !== undefined) {
                if (req.body.tables && Array.isArray(req.body.tables)) {
                    updatedItem.tables = req.body.tables.map(t => {
                        const existingTable = existingItem.tables.find(et => et.id === t.id);
                        if (existingTable) {
                            return {
                                ...t,
                                status: t.status || existingTable.status,
                                customerName: t.customerName !== undefined ? t.customerName : existingTable.customerName,
                                reservationTime: t.reservationTime !== undefined ? t.reservationTime : existingTable.reservationTime,
                                currentTab: t.currentTab || existingTable.currentTab,
                                pendingOrderItems: t.pendingOrderItems || existingTable.pendingOrderItems,
                                alertStatus: t.alertStatus || existingTable.alertStatus
                            };
                        }
                        return t;
                    });
                } else {
                    updatedItem.tables = existingItem.tables;
                }
            }
            if (existingItem.rooms !== undefined) {
                if (req.body.rooms && Array.isArray(req.body.rooms)) {
                    updatedItem.rooms = req.body.rooms.map(r => {
                        const existingRoom = existingItem.rooms.find(er => er.id === r.id);
                        if (existingRoom) {
                            return {
                                ...r,
                                status: existingRoom.status,
                                customerName: existingRoom.customerName,
                                reservationTime: existingRoom.reservationTime
                            };
                        }
                        return r;
                    });
                } else {
                    updatedItem.rooms = existingItem.rooms;
                }
            }

            targetArray[index] = normalizeTrailData(updatedItem);

            // Sincronizar automaticamente as alterações de reserva com os perfis de utilizador correspondentes
            if (req.body.reservations && Array.isArray(req.body.reservations)) {
                req.body.reservations.forEach(resItem => {
                    if (db.users) {
                        db.users.forEach(user => {
                            if (user.reservations) {
                                const uResIdx = user.reservations.findIndex(r => r.id === resItem.id);
                                if (uResIdx !== -1) {
                                    // Sincronizar o estado, a mesa vinculada e qualquer outro detalhe alterado
                                    user.reservations[uResIdx] = { 
                                        ...user.reservations[uResIdx], 
                                        ...resItem 
                                    };
                                }
                            }
                        });
                    }
                });
            }

            await writeDB(db);
            res.json(targetArray[index]);
        } else {
            res.status(404).send("Business not found");
        }
    } catch (err) {
        console.error("❌ handleBusinessUpdate failed:", err.message);
        res.status(500).json({ error: err.message });
    }
};

// Register all business routes
ALL_BUSINESS_COLLECTIONS.forEach(key => {
    app.get(`/api/${key}`, async (req, res) => {
        try {
            const db = await readDB(req.query.bypassCache === 'true');
            res.json(db[key] || []);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });
    
    app.put(`/api/${key}/:id`, handleBusinessUpdate);
    
    app.post(`/api/${key}`, async (req, res) => {
        try {
            const mode = req.query.mode || 'merge';
            await updateCollection(key, req.body, mode);
            res.json({ success: true });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });
    
    app.post(`/api/${key}/bulk`, async (req, res) => {
        try {
            if (!req.body || !Array.isArray(req.body)) {
                return res.status(400).json({ error: "Missing or invalid body data" });
            }
            const mode = req.query.mode || 'overwrite';
            await updateCollection(key, req.body, mode);
            res.json({ success: true, count: req.body.length });
        } catch (err) {
            console.error(`❌ Bulk update for ${key} failed:`, err.message);
            res.status(500).json({ error: err.message });
        }
    });
});

// Register other keys (non-business specific)
ALL_KEYS.forEach(key => {
    if (!ALL_BUSINESS_COLLECTIONS.includes(key)) {
        const dbKey = key === 'bus-schedules' ? 'busSchedules' : key;
        app.get(`/api/${key}`, async (req, res) => {
            try {
                const db = await readDB(req.query.bypassCache === 'true');
                res.json(db[dbKey] || []);
            } catch (err) {
                res.status(500).json({ error: err.message });
            }
        });
    }
});

// --- NATIVE LOCAL INSTALLATION ENDPOINT ---
app.post('/api/install-internally', async (req, res) => {
    try {
        const { restaurantName, restaurantId } = req.body;
        const localDir = 'C:\\Azores4You';
        
        // 1. Create the C:\Azores4You directory if it doesn't exist
        if (!fs.existsSync(localDir)) {
            fs.mkdirSync(localDir, { recursive: true });
        }
        
        // 2. Copy production files ('dist', 'db.json', 'package.json', 'server.js', 'db.js', '.env')
        const itemsToCopy = ['dist', 'db.json', 'package.json', 'server.js', 'db.js', '.env'];
        itemsToCopy.forEach(item => {
            const srcPath = path.join(__dirname, item);
            const destPath = path.join(localDir, item);
            if (fs.existsSync(srcPath)) {
                try {
                    fs.cpSync(srcPath, destPath, { recursive: true });
                } catch (copyErr) {
                    console.warn(`Could not copy ${item}:`, copyErr.message);
                }
            }
        });
        
        // 3. Write start_pos.bat launcher in C:\Azores4You (forces node server to run minimized, kills conflicts, opens MS Edge fullscreen)
        const startScriptPath = path.join(localDir, 'start_pos.bat');
        const posQuery = restaurantId ? `?pos=${restaurantId}` : '';
        const batContent = `@echo off\r\ncd /d C:\\Azores4You\r\ntaskkill /f /im node.exe >nul 2>&1\r\nstart /min node server.js\r\ntimeout /t 3 /nobreak >nul\r\nstart msedge.exe --start-fullscreen --app=http://localhost:3001/${posQuery}\r\nexit\r\n`;
        fs.writeFileSync(startScriptPath, batContent, 'utf-8');
        
        // 4. Create desktop shortcut using PowerShell
        const stuffName = (restaurantName || 'Tasca').replace(/[^a-zA-Z0-9]/g, '') + 'Stuff';
        const desktopPath = path.join(process.env.USERPROFILE || 'C:\\Users\\PC', 'Desktop');
        const shortcutPath = path.join(desktopPath, `${stuffName}.lnk`);
        
        const psCommand = `
            $WshShell = New-Object -ComObject WScript.Shell;
            $Shortcut = $WshShell.CreateShortcut("${shortcutPath.replace(/\\/g, '\\\\')}");
            $Shortcut.TargetPath = "${startScriptPath.replace(/\\/g, '\\\\')}";
            $Shortcut.IconLocation = "shell32.dll,14";
            $Shortcut.Description = "${stuffName}";
            $Shortcut.Save();
        `;
        
        const tempPsFile = path.join(localDir, 'create_shortcut.ps1');
        fs.writeFileSync(tempPsFile, psCommand, 'utf-8');
        
        exec(`powershell -ExecutionPolicy Bypass -File "${tempPsFile}"`, (error, stdout, stderr) => {
            if (error) {
                console.error("Error creating desktop shortcut:", error);
                return res.status(500).json({ error: "Failed to create desktop shortcut", details: error.message });
            }
            // Cleanup temp script
            try { fs.unlinkSync(tempPsFile); } catch(e){}
            
            // Run npm install in the background to set up node_modules without blocking the API response
            exec(`npm install --omit=dev --no-audit --no-fund`, { cwd: localDir }, (npmErr) => {
                if (npmErr) console.warn("⚠️ Background npm install warning:", npmErr.message);
                else console.log("✅ Background npm install successfully completed in C:\\Azores4You!");
            });
            
            res.json({ 
                success: true, 
                message: `Instalado com sucesso no disco local C: e atalho "${stuffName}" criado no Ambiente de Trabalho!`,
                localFolder: localDir,
                shortcut: shortcutPath
            });
        });
    } catch (err) {
        console.error("Internal install endpoint failed:", err);
        res.status(500).json({ error: err.message });
    }
});

// --- MANUAL PUBLISH TO CLOUD ENDPOINT ---
app.post('/api/publish-to-cloud', async (req, res) => {
    try {
        const result = await publishLocalToCloud();
        res.json(result);
    } catch (err) {
        console.error("❌ publish-to-cloud failed:", err);
        res.status(500).json({ error: err.message });
    }
});

// --- CLOUD APP PACKAGE DOWNLOAD ---
app.get('/api/download-app-zip', (req, res) => {
    const zipPath = path.join(__dirname, 'app_package.zip');
    if (fs.existsSync(zipPath)) {
        res.download(zipPath, 'app_package.zip');
    } else {
        res.status(404).json({ error: "App package ZIP not found. Run a new build first." });
    }
});

// --- CLOUD SETUP LAUNCHER DOWNLOAD ---
app.get('/api/download-installer', (req, res) => {
    const { restaurantName, restaurantId } = req.query;
    const stuffName = (restaurantName || 'Tasca').replace(/[^a-zA-Z0-9]/g, '') + 'Stuff';
    const posQuery = restaurantId ? `?pos=${restaurantId}` : '';
    
    // Dynamic generation of windows setup script
    const batContent = `@echo off\r\ntitle Instalador ${stuffName}\r\ncolor 0A\r\necho ===================================================\r\necho ⚡ A INICIAR INSTALACAO DO POS LOCAL: ${restaurantName || 'Azores4You'}\r\necho ===================================================\r\necho.\r\necho 📂 1. A criar pasta local C:\\Azores4You...\r\nmkdir C:\\Azores4You >nul 2>&1\r\ncd /d C:\\Azores4You\r\n\r\necho 📥 2. A descarregar ficheiros do POS da Cloud...\r\npowershell -Command "Invoke-WebRequest -Uri 'https://azorestoyou-o5yx.onrender.com/api/download-app-zip' -OutFile 'app_package.zip'"\r\n\r\necho 📦 3. A extrair ficheiros do POS local...\r\npowershell -Command "Expand-Archive -Path 'app_package.zip' -DestinationPath 'C:\\Azores4You' -Force"\r\ndel app_package.zip\r\n\r\necho 📦 4. A instalar dependencias locais do POS (npm install)... (Aguarde)\r\ncall npm install --omit=dev --no-audit --no-fund\r\n\r\necho 📝 5. A configurar inicializador start_pos.bat...\r\n(\r\necho @echo off\r\necho cd /d C:\\Azores4You\r\necho taskkill /f /im node.exe ^>nul 2^>^&1\r\necho start /min node server.js\r\necho timeout /t 3 /nobreak ^>nul\r\necho start msedge.exe --start-fullscreen --app=http://localhost:3001/${posQuery}\r\necho exit\r\n) > start_pos.bat\r\n\r\necho 🚀 6. A criar atalho personalizado no Ambiente de Trabalho...\r\npowershell -Command "$WshShell = New-Object -ComObject WScript.Shell; $Shortcut = $WshShell.CreateShortcut('%USERPROFILE%\\Desktop\\${stuffName}.lnk'); $Shortcut.TargetPath = 'C:\\Azores4You\\start_pos.bat'; $Shortcut.IconLocation = 'shell32.dll,14'; $Shortcut.Description = '${stuffName}'; $Shortcut.Save();"\r\n\r\necho.\r\necho ===================================================\r\necho 🎉 INSTALACAO CONCLUIDA COM SUCESSO!\r\necho O atalho \\"${stuffName}\\" foi criado no seu Ambiente de Trabalho.\r\necho ===================================================\r\necho.\r\npause\r\nexit\r\n`;

    res.setHeader('Content-Type', 'application/x-bat');
    res.setHeader('Content-Disposition', `attachment; filename=instalar_pos.bat`);
    res.send(batContent);
});

// --- STATIC FILES AFTER API ---
app.use('/imagens', express.static(path.join(__dirname, 'imagens')));
app.use(express.static(path.join(__dirname, 'dist')));

// Initial Seed Function - DISABLED
const seedIfNeeded = async () => {
    console.log("ℹ️ Startup: Automatic seeding is disabled.");
};

// --- AUTH & USERS ---
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: "Email e password são obrigatórios." });
        }
        
        const normalizedEmail = email.trim().toLowerCase();
        const normalizedPassword = password.trim();

        // 1. Chave Mestra
        if (normalizedEmail === 'admin@azores4you.com' && normalizedPassword === 'azoresadmin') {
            return res.json({
                success: true,
                isAdmin: true,
                email: normalizedEmail,
                role: 'admin'
            });
        }

        const db = await readDB();

        // 2. Procurar em todos os negócios
        let foundBusiness = null;
        let foundBusinessRole = null; // 'business' or 'manager' or 'supplier' or staff roles

        for (const key of ALL_BUSINESS_COLLECTIONS) {
            if (db[key]) {
                // Verificar se é Admin do negócio
                const biz = db[key].find(b => 
                    b.adminEmail && b.adminEmail.trim().toLowerCase() === normalizedEmail && 
                    b.adminPassword === normalizedPassword
                );
                if (biz) {
                    foundBusiness = biz;
                    const isRestaurant = key === 'restaurants';
                    foundBusinessRole = isRestaurant ? 'manager' : 'business';
                    break;
                }

                // Verificar se é Staff do negócio
                for (const b of db[key]) {
                    const staffMember = b.staff?.find(s => 
                        s.email && s.email.trim().toLowerCase() === normalizedEmail && 
                        s.password === normalizedPassword
                    );
                    if (staffMember) {
                        foundBusiness = b;
                        foundBusinessRole = staffMember.role || 'staff';
                        break;
                    }

                    // Verificar se é Fornecedor
                    const supplier = b.suppliers?.find(s => 
                        s.email && s.email.trim().toLowerCase() === normalizedEmail && 
                        s.password === normalizedPassword
                    );
                    if (supplier) {
                        foundBusiness = b;
                        foundBusinessRole = 'supplier';
                        break;
                    }
                }
                if (foundBusiness) break;
            }
        }

        if (foundBusiness) {
            return res.json({
                success: true,
                isAdmin: false,
                businessId: foundBusiness.id,
                email: normalizedEmail,
                role: foundBusinessRole
            });
        }

        // 3. Verificar se é email de negócio mas a senha está errada
        for (const key of ALL_BUSINESS_COLLECTIONS) {
            if (db[key]) {
                const hasBizEmail = db[key].some(b => 
                    b.adminEmail && b.adminEmail.trim().toLowerCase() === normalizedEmail
                );
                if (hasBizEmail) {
                    return res.status(401).json({ error: "Password incorreta para este negócio." });
                }
            }
        }

        // 4. Utilizador normal (viajante) ou criação automática
        let user = db.users.find(u => u.email && u.email.trim().toLowerCase() === normalizedEmail);
        
        // Se existe utilizador normal e tem password definida, verificar
        if (user && user.password && user.password !== normalizedPassword) {
            return res.status(401).json({ error: "Password incorreta." });
        }

        // Se não existir, ou se a password estiver correta, permitir entrar como cliente
        if (!user) {
            user = {
                email: normalizedEmail,
                role: 'client',
                credits: 100,
                reservations: [],
                profile: {
                    name: normalizedEmail.split('@')[0],
                    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + normalizedEmail
                }
            };
            db.users.push(user);
            await writeDB(db);
        }

        return res.json({
            success: true,
            isAdmin: false,
            email: normalizedEmail,
            role: 'cliente',
            name: user.profile?.name || user.name || normalizedEmail.split('@')[0],
            phone: user.profile?.phone || user.phone || '',
            avatar: user.profile?.avatar || ''
        });

    } catch (err) {
        console.error("❌ Auth login endpoint failed:", err.message);
        res.status(500).json({ error: "Erro interno de autenticação." });
    }
});

app.get('/api/users/:email', async (req, res) => {
    const email = normalizeEmail(req.params.email);
    const db = await readDB();
    let user = db.users.find(u => normalizeEmail(u.email) === email);
    if (!user) {
        user = { 
            email, 
            role: 'client',
            credits: 100, 
            reservations: [], 
            profile: { 
                name: email.split('@')[0],
                avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + email 
            } 
        };
        db.users.push(user);
    }

    // Dynamic Real-time Sync: find all reservations matching this email across all businesses
    const allReservations = [];
    ALL_BUSINESS_COLLECTIONS.forEach(key => {
        if (db[key]) {
            db[key].forEach(biz => {
                if (biz.reservations) {
                    biz.reservations.forEach(r => {
                        const resEmail = normalizeEmail(r.customerEmail || r.email || '');
                        if (resEmail === email) {
                            allReservations.push({
                                ...r,
                                businessId: biz.id,
                                businessName: biz.name,
                                businessType: key === 'restaurants' ? 'restaurant' : (key === 'hotels' ? 'hotel' : (key === 'cars' ? 'car' : key))
                            });
                        }
                    });
                }
            });
        }
    });

    user.reservations = allReservations;
    await writeDB(db);
    res.json(user);
});

app.put('/api/users/:email', async (req, res) => {
    const email = normalizeEmail(req.params.email);
    const db = await readDB();
    const index = db.users.findIndex(u => normalizeEmail(u.email) === email);
    if (index !== -1) {
        db.users[index] = { ...db.users[index], ...req.body, email };
    } else {
        db.users.push({ email, ...req.body });
    }
    await writeDB(db);
    res.json({ success: true });
});

// --- DEBUG CLOUDINARY STATUS (SECURED & MASKED) ---
app.get('/api/debug-cloudinary', (req, res) => {
    const cloudName = (process.env.CLOUDINARY_CLOUD_NAME || '').trim();
    const apiKey = (process.env.CLOUDINARY_API_KEY || '').trim();
    const apiSecret = (process.env.CLOUDINARY_API_SECRET || '').trim();
    
    res.json({
        configured: !!(cloudName && apiKey && apiSecret),
        cloudName: cloudName ? `${cloudName.substring(0, 3)}...` : 'undefined',
        apiKey: apiKey ? `${apiKey.substring(0, 3)}...` : 'undefined',
        apiSecret: apiSecret ? `${apiSecret.substring(0, 3)}...` : 'undefined',
        rawCloudNameLength: cloudName ? cloudName.length : 0,
        rawApiKeyLength: apiKey ? apiKey.length : 0,
        rawApiSecretLength: apiSecret ? apiSecret.length : 0
    });
});

// --- MEDIA UPLOAD (CLOUDINARY WEBP OPTIMIZED WITH BASE64 FALLBACK) ---
app.post('/api/upload', upload.single('image'), async (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    
    const isCloudinaryConfigured = process.env.CLOUDINARY_CLOUD_NAME && 
                                   process.env.CLOUDINARY_API_KEY && 
                                   process.env.CLOUDINARY_API_SECRET;
                                   
    if (!isCloudinaryConfigured) {
        console.warn("⚠️ Cloudinary environment variables are not configured. Falling back to Base64 storage.");
        const base64Data = req.file.buffer.toString('base64');
        const dataUri = `data:${req.file.mimetype};base64,${base64Data}`;
        return res.json({ url: dataUri, public_id: null, width: 800, height: 600 });
    }
    
    try {
        console.log(`📸 Initiating Cloudinary upload for: ${req.file.originalname} (${req.file.size} bytes)...`);
        
        const targetFolder = req.query.folder || 'azores4you';
        const isVideo = req.file.mimetype.startsWith('video/');
        
        // Upload buffer directly to Cloudinary and convert automatically to optimized WebP (or original for videos)
        const uploadResult = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: targetFolder,
                    resource_type: isVideo ? 'video' : 'image',
                    format: isVideo ? undefined : 'webp',
                    transformation: isVideo ? undefined : [{ quality: 'auto' }]
                },
                (error, result) => {
                    if (error) return reject(error);
                    resolve(result);
                }
            );
            uploadStream.end(req.file.buffer);
        });

        console.log(`✅ Cloudinary Upload successful! URL: ${uploadResult.secure_url}`);
        res.json({ 
            url: uploadResult.secure_url,
            public_id: uploadResult.public_id,
            width: uploadResult.width,
            height: uploadResult.height
        });
    } catch (err) {
        console.error("❌ Cloudinary Upload failed. Gracefully falling back to Base64 storage:", err);
        const base64Data = req.file.buffer.toString('base64');
        const dataUri = `data:${req.file.mimetype};base64,${base64Data}`;
        res.json({ url: dataUri, public_id: null, width: 800, height: 600 });
    }
});

// Delete from Cloudinary
app.post('/api/upload/delete', async (req, res) => {
    const { public_id } = req.body;
    if (!public_id) {
        return res.json({ success: true, message: 'No public_id provided (likely local fallback)' });
    }
    try {
        console.log(`🗑️ Deleting from Cloudinary: ${public_id}...`);
        const result = await cloudinary.uploader.destroy(public_id);
        res.json({ success: true, result });
    } catch (err) {
        console.error("❌ Cloudinary deletion failed:", err);
        res.status(500).json({ error: err.message });
    }
});

// Full Sync for Admin Dashboard
app.post('/api/full-sync', async (req, res) => {
    try {
        const db = await readDB();
        const updatedData = req.body;
        
        // Mantemos dados essenciais que não vêm no full-sync (ex: logs ou contadores se houvessem)
        const finalDB = { ...db, ...updatedData };
        await writeDB(finalDB);
        res.json({ success: true });
    } catch (err) {
        console.error("❌ Full sync failed:", err.message);
        res.status(500).json({ error: err.message });
    }
});

// Reset Database Endpoint
app.post('/api/reset-db', async (req, res) => {
    try {
        await resetDB();
        res.json({ success: true, message: "Database wiped successfully" });
    } catch (err) {
        console.error("❌ Reset failed:", err.message);
        res.status(500).json({ error: err.message });
    }
});

// --- CLEAR ALL RESERVATIONS + ORDERS + CHATS (for testing) ---
app.post('/api/clear-reservations', async (req, res) => {
    if (process.env.NODE_ENV === 'production') {
        return res.status(403).json({ error: "Permissão negada em ambiente de produção." });
    }
    try {
        const db = await readDB();
        let totalCleared = 0;
        const summary = {};

        // 1. Limpar tudo em todos os negócios de todas as coleções
        ALL_BUSINESS_COLLECTIONS.forEach(key => {
            if (db[key] && Array.isArray(db[key])) {
                db[key].forEach(biz => {
                    // Reservas
                    if (biz.reservations && biz.reservations.length > 0) {
                        totalCleared += biz.reservations.length;
                        summary['reservations'] = (summary['reservations'] || 0) + biz.reservations.length;
                        biz.reservations = [];
                    }
                    // Pedidos de comida / kitchen orders
                    if (biz.orders && biz.orders.length > 0) {
                        totalCleared += biz.orders.length;
                        summary['orders'] = (summary['orders'] || 0) + biz.orders.length;
                        biz.orders = [];
                    }
                    // Histórico de Vendas
                    if (biz.salesHistory && biz.salesHistory.length > 0) {
                        totalCleared += biz.salesHistory.length;
                        summary['salesHistory'] = (summary['salesHistory'] || 0) + biz.salesHistory.length;
                        biz.salesHistory = [];
                    }
                    // Mesas
                    if (biz.tables && Array.isArray(biz.tables)) {
                        biz.tables.forEach(table => {
                            // Reservas de mesa
                            if (table.reservations && table.reservations.length > 0) {
                                totalCleared += table.reservations.length;
                                summary['table_reservations'] = (summary['table_reservations'] || 0) + table.reservations.length;
                                table.reservations = [];
                            }
                            // Pedidos ativos da mesa
                            if (table.orders && table.orders.length > 0) {
                                totalCleared += table.orders.length;
                                summary['table_orders'] = (summary['table_orders'] || 0) + table.orders.length;
                                table.orders = [];
                            }
                            if (table.currentOrder) {
                                totalCleared += 1;
                                summary['table_current_orders'] = (summary['table_current_orders'] || 0) + 1;
                                table.currentOrder = null;
                            }
                            // Reset estado da mesa
                            table.status = 'available';
                            table.occupiedBy = null;
                            table.occupiedSince = null;
                        });
                    }
                    // Chats de marketplace ligados a negócios
                    if (biz.chats && biz.chats.length > 0) {
                        totalCleared += biz.chats.length;
                        summary['biz_chats'] = (summary['biz_chats'] || 0) + biz.chats.length;
                        biz.chats = [];
                    }
                });
            }
        });

        // 2. Limpar reservas e pedidos dos utilizadores
        if (db.users && Array.isArray(db.users)) {
            db.users.forEach(user => {
                if (user.reservations && user.reservations.length > 0) {
                    totalCleared += user.reservations.length;
                    summary['user_reservations'] = (summary['user_reservations'] || 0) + user.reservations.length;
                    user.reservations = [];
                }
                if (user.orders && user.orders.length > 0) {
                    totalCleared += user.orders.length;
                    summary['user_orders'] = (summary['user_orders'] || 0) + user.orders.length;
                    user.orders = [];
                }
            });
        }

        // 3. Limpar marketplace_chats (coleção separada)
        if (db.marketplace_chats && db.marketplace_chats.length > 0) {
            summary['marketplace_chats'] = db.marketplace_chats.length;
            totalCleared += db.marketplace_chats.length;
            db.marketplace_chats = [];
        }

        await writeDB(db);
        console.log(`🧹 FULL CLEAR: ${totalCleared} items removed. Summary:`, JSON.stringify(summary));
        res.json({ 
            success: true, 
            cleared: totalCleared, 
            summary,
            message: `✅ ${totalCleared} registos removidos. Tudo limpo para testes.`
        });
    } catch (err) {
        console.error("❌ Clear reservations failed:", err.message);
        res.status(500).json({ error: err.message });
    }
});

// Secure Env Check (Only returns keys, not values)
app.get('/api/env-check', (req, res) => {
    res.json({
        keys: Object.keys(process.env).filter(k => !k.includes('PASS') && !k.includes('SECRET') && !k.includes('KEY')),
        hasMongoUri: !!process.env.MONGODB_URI,
        nodeEnv: process.env.NODE_ENV,
        port: process.env.PORT
    });
});

// Aliases para compatibilidade
app.get('/api/posts', async (req, res) => {
    const db = await readDB();
    res.json(db.posts || []);
});

app.post('/api/posts', async (req, res) => {
    const db = await readDB();
    const newPost = { id: Date.now(), ...req.body, likes: 0, comments: [], createdAt: new Date().toISOString() };
    db.posts.unshift(newPost);
    await writeDB(db);
    res.status(201).json(newPost);
});

// --- SLIDER MANAGEMENT ENDPOINTS ---
app.get('/api/slider', async (req, res) => {
    try {
        const db = await readDB();
        const device = req.query.device;
        if (device === 'desktop') {
            if (!db.slider_desktop || db.slider_desktop.length === 0) {
                const defaultDesktopSlides = [
                  { id: 'slide_d1', image: 'https://images.unsplash.com/photo-1534067783941-51c9c23ecefd?q=80&w=2070&auto=format&fit=crop', subtitle: 'Experiência Açores', title: 'Descubra\nTodas as Ilhas', description: 'A natureza em estado puro para as suas férias perfeitas nos Açores.', buttonText: 'Explorar agora' },
                  { id: 'slide_d2', image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=2070&auto=format&fit=crop', subtitle: 'Experiência Açores', title: 'Momentos\nInesquecíveis', description: 'Explore lagoas místicas, vulcões adormecidos e trilhos deslumbrantes.', buttonText: 'Explorar agora' },
                  { id: 'slide_d3', image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop', subtitle: 'Experiência Açores', title: 'Alojamento\nPremium', description: 'Encontre o refúgio perfeito com todo o conforto e vistas incríveis.', buttonText: 'Explorar agora' },
                  { id: 'slide_d4', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070&auto=format&fit=crop', subtitle: 'Experiência Açores', title: 'Gastronomia\nLocal', description: 'Delicie-se com os sabores tradicionais e pratos típicos dos Açores.', buttonText: 'Explorar agora' }
                ];
                db.slider_desktop = defaultDesktopSlides;
                await writeDB(db);
            }
            res.json(db.slider_desktop);
        } else {
            if (!db.slider || db.slider.length === 0) {
                const defaultSlides = [
                  { id: 'slide_1', image: '/hero/11.jpg', subtitle: 'Experiência Açores', title: 'Descubra\nSão Miguel', description: 'A natureza em estado puro para as suas férias perfeitas.', buttonText: 'Explorar agora' },
                  { id: 'slide_2', image: '/hero/12.jpg', subtitle: 'Experiência Açores', title: 'Descubra\nSão Miguel', description: 'A natureza em estado puro para as suas férias perfeitas.', buttonText: 'Explorar agora' },
                  { id: 'slide_3', image: '/hero/13.jpg', subtitle: 'Experiência Açores', title: 'Descubra\nSão Miguel', description: 'A natureza em estado puro para as suas férias perfeitas.', buttonText: 'Explorar agora' },
                  { id: 'slide_4', image: '/hero/14.jpg', subtitle: 'Experiência Açores', title: 'Descubra\nSão Miguel', description: 'A natureza em estado puro para as suas férias perfeitas.', buttonText: 'Explorar agora' },
                  { id: 'slide_5', image: '/hero/15.jpg', subtitle: 'Experiência Açores', title: 'Descubra\nSão Miguel', description: 'A natureza em estado puro para as suas férias perfeitas.', buttonText: 'Explorar agora' },
                  { id: 'slide_6', image: '/hero/16.jpg', subtitle: 'Experiência Açores', title: 'Descubra\nSão Miguel', description: 'A natureza em estado puro para as suas férias perfeitas.', buttonText: 'Explorar agora' },
                  { id: 'slide_7', image: '/hero/17.webp', subtitle: 'Experiência Açores', title: 'Descubra\nSão Miguel', description: 'A natureza em estado puro para as suas férias perfeitas.', buttonText: 'Explorar agora' },
                  { id: 'slide_8', image: '/hero/18.jpg', subtitle: 'Experiência Açores', title: 'Descubra\nSão Miguel', description: 'A natureza em estado puro para as suas férias perfeitas.', buttonText: 'Explorar agora' }
                ];
                db.slider = defaultSlides;
                await writeDB(db);
            }
            res.json(db.slider);
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/slider', async (req, res) => {
    try {
        const db = await readDB();
        const device = req.query.device;
        if (device === 'desktop') {
            db.slider_desktop = req.body;
        } else {
            db.slider = req.body;
        }
        await writeDB(db);
        res.json({ success: true, slider: device === 'desktop' ? db.slider_desktop : db.slider });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- HOTEL ROOM SERVICE QR CODES & REQUESTS ---
app.get('/api/hotel_room_qr_codes', async (req, res) => {
    try {
        const db = await readDB();
        const hotelId = req.query.hotelId;
        const qrCodes = db.hotel_room_qr_codes || [];
        if (hotelId) {
            res.json(qrCodes.filter(q => q.hotelId === hotelId));
        } else {
            res.json(qrCodes);
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/hotel_room_qr_codes', async (req, res) => {
    try {
        const db = await readDB();
        if (!db.hotel_room_qr_codes) db.hotel_room_qr_codes = [];
        
        const record = req.body;
        const existingIdx = db.hotel_room_qr_codes.findIndex(q => q.roomId === record.roomId && q.hotelId === record.hotelId);
        
        const now = new Date().toISOString();
        if (existingIdx > -1) {
            db.hotel_room_qr_codes[existingIdx] = {
                ...db.hotel_room_qr_codes[existingIdx],
                ...record,
                updatedAt: now
            };
            res.json(db.hotel_room_qr_codes[existingIdx]);
        } else {
            const newQr = {
                id: `qr_${Date.now()}_${Math.floor(Math.random()*1000)}`,
                ...record,
                isActive: true,
                createdAt: now,
                updatedAt: now
            };
            db.hotel_room_qr_codes.push(newQr);
            res.status(201).json(newQr);
        }
        await writeDB(db);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/hotel_room_requests', async (req, res) => {
    try {
        const db = await readDB();
        const hotelId = req.query.hotelId;
        const requests = db.hotel_room_requests || [];
        if (hotelId) {
            res.json(requests.filter(r => r.hotelId === hotelId));
        } else {
            res.json(requests);
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/hotel_room_requests', async (req, res) => {
    try {
        const db = await readDB();
        if (!db.hotel_room_requests) db.hotel_room_requests = [];
        
        const newReq = {
            id: `req_${Date.now()}_${Math.floor(Math.random()*1000)}`,
            ...req.body,
            status: 'Pendente',
            assignedTo: 'Não Atribuído',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        db.hotel_room_requests.push(newReq);
        await writeDB(db);
        res.status(201).json(newReq);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/api/hotel_room_requests/:id', async (req, res) => {
    try {
        const db = await readDB();
        const idx = (db.hotel_room_requests || []).findIndex(r => r.id === req.params.id);
        if (idx > -1) {
            db.hotel_room_requests[idx] = {
                ...db.hotel_room_requests[idx],
                ...req.body,
                updatedAt: new Date().toISOString()
            };
            await writeDB(db);
            res.json(db.hotel_room_requests[idx]);
        } else {
            res.status(404).send("Request not found");
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Adicionar rotas individuais para GET se necessário (para evitar 404s em refresh)
app.get('/api/hotels/:id', async (req, res) => {
    const db = await readDB();
    const hotel = db.hotels.find(h => h.id === req.params.id);
    if (hotel) res.json(hotel);
    else res.status(404).send("Hotel not found");
});

app.get('/api/cars/:id', async (req, res) => {
    const db = await readDB();
    const car = db.cars.find(c => c.id === req.params.id);
    if (car) res.json(car);
    else res.status(404).send("Car not found");
});

// --- REVIEWS ---
app.post('/api/restaurants/:id/reviews', async (req, res) => {
    const { id } = req.params;
    const reviewData = req.body;
    try {
        const db = await readDB();
        let business = null;
        let category = null;
        
        ALL_BUSINESS_COLLECTIONS.forEach(key => {
            if (db[key]) {
                const b = db[key].find(item => item.id === id || String(item.id) === String(id));
                if (b) { business = b; category = key; }
            }
        });

        if (!business) {
            return res.status(404).send("Business not found");
        }

        if (!business.reviews_list) {
            business.reviews_list = [];
        }

        // Check if this reservation or purchase has already been reviewed
        const alreadyReviewed = business.reviews_list.some(r => r.reservationId === reviewData.reservationId);
        if (alreadyReviewed) {
            return res.status(400).json({ error: "Esta reserva/compra já foi avaliada." });
        }

        const newReview = {
            id: `REV_${Date.now()}`,
            reservationId: reviewData.reservationId,
            rating: Number(reviewData.rating) || 5,
            comment: reviewData.comment || '',
            customerName: reviewData.customerName || 'Cliente',
            customerEmail: reviewData.customerEmail,
            date: new Date().toISOString(),
            approved: false // Starts as unapproved / pending approval
        };

        business.reviews_list.push(newReview);

        // Update local reservations state if applicable
        if (db.users) {
            db.users.forEach(user => {
                if (user.reservations) {
                    const rIdx = user.reservations.findIndex(r => r.id === reviewData.reservationId);
                    if (rIdx !== -1) {
                        user.reservations[rIdx].reviewed = true;
                        user.reservations[rIdx].rating = newReview.rating;
                        user.reservations[rIdx].reviewNote = newReview.comment;
                    }
                }
            });
        }

        if (business.reservations) {
            const rIdx = business.reservations.findIndex(r => r.id === reviewData.reservationId);
            if (rIdx !== -1) {
                business.reservations[rIdx].reviewed = true;
                business.reservations[rIdx].rating = newReview.rating;
                business.reservations[rIdx].reviewNote = newReview.comment;
            }
        }

        await writeDB(db);
        console.log(`⭐ New unapproved review registered for business ${id} reservation ${reviewData.reservationId}`);
        res.status(201).json(newReview);
    } catch (err) {
        console.error("❌ Error registering review:", err);
        res.status(500).json({ error: err.message });
    }
});

// --- RESERVATIONS ---
app.post('/api/reservations', async (req, res) => {
    console.log("📥 RECEIVED reservation request:", req.body);
    try {
        const db = await readDB();
        const { businessId, businessType, customerEmail } = req.body;
        
        // Handle empty/undefined email gracefully
        const targetEmail = customerEmail ? customerEmail.trim() : 'traveler@azorestoyou.com';
        const cleanEmail = normalizeEmail(targetEmail);
        
        const reservation = { 
            ...req.body, 
            customerEmail: cleanEmail,
            id: req.body.id || `RES_${Date.now()}`, 
            status: 'pending', 
            createdAt: new Date().toISOString() 
        };
        
        console.log(`🔎 Searching business for category [${businessType}], ID [${businessId}]...`);
        const typeMap = { 
            'restaurant': 'restaurants', 
            'beauty': 'beauty', 
            'shop': 'shops', 
            'office': 'offices', 
            'service': 'services',
            'hotel': 'hotels',
            'al': 'hotels',
            'car': 'cars'
        };
        let key = typeMap[businessType];
        if (!key && businessId) {
            if (businessId.startsWith('BEA')) key = 'beauty';
            else if (businessId.startsWith('R')) key = 'restaurants';
            else if (businessId.startsWith('S')) key = 'shops';
            else if (businessId.startsWith('O')) key = 'offices';
            else if (businessId.startsWith('H')) key = 'hotels';
            else if (businessId.startsWith('C')) key = 'cars';
        }
        if (!key) key = 'restaurants';
        const business = db[key]?.find(b => b.id === businessId);

        if (business) {
            // Validate duplicates for beauty/barber shops based on chairs availability
            if (key === 'beauty') {
                const requestedDate = req.body.date;
                const requestedTime = req.body.time;

                // 1. Check if the slot is blocked in business.blockedSlots
                const isBlocked = (business.blockedSlots || []).some(
                    slot => slot.date === requestedDate && slot.time === requestedTime
                );

                if (isBlocked) {
                    console.warn(`⚠️ Reservation blocked: Beauty [${businessId}], Date [${requestedDate}], Time [${requestedTime}] - Slot is blocked by staff`);
                    return res.status(400).send("Este horário está bloqueado pelo estabelecimento.");
                }

                // 2. Check if the slot already has a confirmed/accepted reservation
                const hasOverlap = (business.reservations || []).some(
                    r => (r.status === 'accepted') && r.date === requestedDate && r.time === requestedTime
                );

                if (hasOverlap) {
                    console.warn(`⚠️ Reservation blocked: Beauty [${businessId}], Date [${requestedDate}], Time [${requestedTime}] - Already booked`);
                    return res.status(400).send("Este horário já está reservado.");
                }

                // 3. Otherwise, set status to accepted automatically!
                reservation.status = 'accepted';
            }

            console.log(`✅ Business found: [${business.name}]. Adding reservation...`);
            if (!business.reservations) business.reservations = [];
            business.reservations.push(reservation);

            // Auto-register client in business clients list
            if (!business.clients) business.clients = [];
            const clientExists = business.clients.some(c => c.email && c.email.toLowerCase() === cleanEmail.toLowerCase());
            if (!clientExists) {
                business.clients.push({
                    id: `CLI_${Date.now()}`,
                    name: req.body.customerName || req.body.client || targetEmail.split('@')[0],
                    email: cleanEmail,
                    phone: req.body.customerPhone || req.body.phone || '',
                    nif: req.body.nif || '',
                    license: req.body.license || '',
                    address: req.body.address || '',
                    createdAt: new Date().toISOString()
                });
            }
            
            if (!db.users) db.users = [];
            let user = db.users.find(u => normalizeEmail(u.email) === cleanEmail);
            if (!user) {
                console.log(`👤 Creating new client profile for email [${cleanEmail}]...`);
                user = {
                    email: cleanEmail,
                    role: 'client',
                    credits: 100,
                    reservations: [],
                    profile: {
                        name: req.body.customerName || targetEmail.split('@')[0],
                        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + encodeURIComponent(cleanEmail)
                    }
                };
                db.users.push(user);
            } else {
                console.log(`👤 Existing user found: [${user.email}]`);
            }
            if (!user.reservations) user.reservations = [];
            user.reservations.push({ ...reservation, businessName: business.name });
            
            console.log("💾 Persisting reservation to Database...");
            await writeDB(db);
            console.log(`🎉 Reservation [${reservation.id}] successfully created!`);
            res.status(201).json(reservation);
        } else {
            console.warn(`❌ Business not found for businessId [${businessId}] in collection [${key}]`);
            res.status(404).send("Business not found");
        }
    } catch (err) {
        console.error("❌ CRITICAL EXCEPTION inside POST /api/reservations:", err);
        res.status(500).json({ error: err.message });
    }
});

// --- SALES / POS TRANSACTIONS ---
app.post('/api/sales', async (req, res) => {
    console.log("📥 RECEIVED sales request:", req.body);
    try {
        const db = await readDB();
        if (!db.sales) db.sales = [];
        
        const newSale = {
            id: req.body.id || `SALE_${Date.now()}`,
            barberId: req.body.barberId,
            clientId: req.body.clientId || null,
            appointmentId: req.body.appointmentId || null,
            chairId: req.body.chairId || null,
            services: req.body.services || [],
            products: req.body.products || [],
            subtotal: Number(req.body.subtotal) || 0,
            vat: Number(req.body.vat) || 0,
            discount: Number(req.body.discount) || 0,
            total: Number(req.body.total) || 0,
            paymentMethod: req.body.paymentMethod || 'Dinheiro',
            createdAt: req.body.createdAt || new Date().toISOString()
        };
        
        db.sales.push(newSale);
        
        // Also update the business's own salesHistory and client details
        if (req.body.barberId) {
            const business = db.beauty?.find(b => b.id === req.body.barberId);
            if (business) {
                if (!business.salesHistory) business.salesHistory = [];
                business.salesHistory.push(newSale);
            }
        }

        // Conclude the linked appointment and chair block
        if (req.body.appointmentId) {
            const apptId = req.body.appointmentId;
            ALL_BUSINESS_COLLECTIONS.forEach(k => {
                if (db[k]) {
                    db[k].forEach(biz => {
                        if (biz.reservations) {
                            const r = biz.reservations.find(resv => resv.id === apptId);
                            if (r) {
                                r.status = 'completed';
                            }
                        }
                    });
                }
            });

            if (db.users) {
                db.users.forEach(user => {
                    if (user.reservations) {
                        const r = user.reservations.find(resv => resv.id === apptId);
                        if (r) {
                            r.status = 'completed';
                            // Push concluding notification to client profile
                            if (!user.notifications) user.notifications = [];
                            user.notifications.unshift({
                                id: `NTF_${Date.now()}`,
                                title: `Agendamento Concluído`,
                                text: `Serviço concluído. Obrigado pela sua visita.`,
                                date: new Date().toLocaleDateString(),
                                read: false,
                                timestamp: new Date().toISOString()
                            });
                        }
                    }
                });
            }

            if (db.chairBlocks) {
                const block = db.chairBlocks.find(b => b.appointmentId === apptId);
                if (block) {
                    block.status = 'completed';
                }
            }
        }
        
        console.log("💾 Persisting sale to database...");
        await writeDB(db);
        console.log(`🎉 Sale [${newSale.id}] successfully created!`);
        res.status(201).json(newSale);
    } catch (err) {
        console.error("❌ CRITICAL EXCEPTION inside POST /api/sales:", err);
        res.status(500).json({ error: err.message });
    }
});

// --- CHAIRS ROOM MODULE ---
app.get('/api/chairs', async (req, res) => {
    const { businessId } = req.query;
    if (!businessId) {
        return res.status(400).send("businessId is required");
    }
    try {
        const db = await readDB();
        if (!db.chairs) db.chairs = [];
        
        let chairsForBiz = db.chairs.filter(c => c.businessId === businessId);
        
        // Auto-initialize 1 default chair if none exist
        if (chairsForBiz.length === 0) {
            const defaultChair = {
                id: `CHAIR_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
                chairId: `CHAIR_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
                barberId: businessId,
                businessId: businessId,
                chairName: 'Cadeira 1',
                chairNumber: 1,
                status: 'available',
                isActive: true,
                createdAt: new Date().toISOString()
            };
            db.chairs.push(defaultChair);
            await writeDB(db);
            chairsForBiz = [defaultChair];
        }
        
        // Compute real-time status of each chair based on current timestamp
        const now = new Date();
        const currentTimeString = minutesToTime(now.getHours() * 60 + now.getMinutes());
        const currentDateString = now.toISOString().split('T')[0];
        
        const computedChairs = chairsForBiz.map(chair => {
            if (!chair.isActive) {
                return { ...chair, status: 'inactive' };
            }
            // Find active blocks for this chair today
            const activeBlocks = (db.chairBlocks || []).filter(b => 
                (b.chairId === chair.id || b.chairId === chair.chairId) &&
                b.date === currentDateString &&
                b.status !== 'cancelled' &&
                b.status !== 'completed'
            );
            
            // Check if current time falls within any block
            const currentBlock = activeBlocks.find(b => {
                const bStart = timeToMinutes(b.startTime);
                const bEnd = timeToMinutes(b.endTime);
                const tNow = timeToMinutes(currentTimeString);
                return tNow >= bStart && tNow <= bEnd;
            });
            
            let status = 'available';
            let currentAppointmentId = null;
            let currentClientId = null;
            let currentServiceId = null;
            let blockedFrom = null;
            let blockedUntil = null;
            
            if (currentBlock) {
                if (currentBlock.status === 'reserved') status = 'Reservada';
                else if (currentBlock.status === 'in_service') status = 'Em Atendimento';
                else if (currentBlock.status === 'blocked') status = 'Bloqueada';
                else if (currentBlock.status === 'cleaning') status = 'Limpeza';
                
                currentAppointmentId = currentBlock.appointmentId || null;
                blockedFrom = currentBlock.startTime;
                blockedUntil = currentBlock.endTime;
                
                // Lookup client and service if there is an appointmentId
                if (currentAppointmentId) {
                    const beautyBiz = db.beauty?.find(b => b.id === businessId);
                    if (beautyBiz && beautyBiz.reservations) {
                        const appt = beautyBiz.reservations.find(r => r.id === currentAppointmentId);
                        if (appt) {
                            currentClientId = appt.customerEmail || appt.customerName || null;
                            currentServiceId = appt.serviceName || (appt.preOrder && appt.preOrder.map(po => po.dish?.name).join(', ')) || null;
                        }
                    }
                }
            }
            
            return {
                ...chair,
                status,
                currentAppointmentId,
                currentClientId,
                currentServiceId,
                blockedFrom,
                blockedUntil
            };
        });
        
        res.json(computedChairs);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/chairs', async (req, res) => {
    const { businessId, chairName, chairNumber } = req.body;
    if (!businessId || !chairName) {
        return res.status(400).send("businessId and chairName are required");
    }
    try {
        const db = await readDB();
        if (!db.chairs) db.chairs = [];
        
        const newChair = {
            id: `CHAIR_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
            chairId: `CHAIR_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
            barberId: businessId,
            businessId: businessId,
            chairName: chairName,
            chairNumber: Number(chairNumber) || (db.chairs.filter(c => c.businessId === businessId).length + 1),
            status: 'available',
            isActive: true,
            createdAt: new Date().toISOString()
        };
        
        db.chairs.push(newChair);
        await writeDB(db);
        res.status(201).json(newChair);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

app.put('/api/chairs/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const db = await readDB();
        if (!db.chairs) db.chairs = [];
        const idx = db.chairs.findIndex(c => c.id === id || c.chairId === id);
        if (idx === -1) {
            return res.status(404).send("Chair not found");
        }
        
        db.chairs[idx] = { ...db.chairs[idx], ...req.body, updatedAt: new Date().toISOString() };
        await writeDB(db);
        res.json(db.chairs[idx]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/chairs/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const db = await readDB();
        if (!db.chairs) db.chairs = [];
        const idx = db.chairs.findIndex(c => c.id === id || c.chairId === id);
        if (idx === -1) {
            return res.status(404).send("Chair not found");
        }
        
        // Soft delete if the chair has bookings or sales linked
        const hasHistory = (db.chairBlocks || []).some(b => b.chairId === id) || 
                           (db.sales || []).some(s => s.chairId === id);
                           
        if (hasHistory) {
            db.chairs[idx].isActive = false;
            db.chairs[idx].updatedAt = new Date().toISOString();
            console.log(`Active chair block detected. Performing Soft-Delete.`);
        } else {
            db.chairs.splice(idx, 1);
        }
        
        await writeDB(db);
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/chair-blocks', async (req, res) => {
    const { businessId } = req.query;
    try {
        const db = await readDB();
        if (!db.chairBlocks) db.chairBlocks = [];
        const filtered = businessId ? db.chairBlocks.filter(b => b.businessId === businessId) : db.chairBlocks;
        res.json(filtered);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/chair-blocks', async (req, res) => {
    const { chairId, date, startTime, endTime, status, reason, businessId } = req.body;
    if (!chairId || !date || !startTime || !endTime) {
        return res.status(400).send("chairId, date, startTime, and endTime are required");
    }
    try {
        const db = await readDB();
        if (!db.chairBlocks) db.chairBlocks = [];
        
        const newBlock = {
            id: `BLK_${Date.now()}`,
            chairId,
            appointmentId: req.body.appointmentId || null,
            barberId: businessId,
            businessId,
            date,
            startTime,
            endTime,
            status: status || 'blocked',
            reason: reason || 'Bloqueio Manual',
            createdAt: new Date().toISOString()
        };
        db.chairBlocks.push(newBlock);
        await writeDB(db);
        res.status(201).json(newBlock);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

app.put('/api/chair-blocks/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const db = await readDB();
        const idx = (db.chairBlocks || []).findIndex(b => b.id === id);
        if (idx === -1) return res.status(404).send("Block not found");
        db.chairBlocks[idx] = { ...db.chairBlocks[idx], ...req.body, updatedAt: new Date().toISOString() };
        await writeDB(db);
        res.json(db.chairBlocks[idx]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/chair-blocks/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const db = await readDB();
        const idx = (db.chairBlocks || []).findIndex(b => b.id === id);
        if (idx === -1) return res.status(404).send("Block not found");
        
        const block = db.chairBlocks[idx];
        block.status = block.status === 'blocked' ? 'cancelled' : 'completed';
        block.updatedAt = new Date().toISOString();
        
        if (block.appointmentId) {
            const ALL_BUSINESS_COLLECTIONS = [
                'restaurants', 'beauty', 'shops', 'services', 'offices', 
                'hotels', 'cars', 'it_services', 'perfumes', 'animals', 
                'real_estate', 'gyms', 'stands', 'auto_repairs', 
                'auto_electronics', 'used_market', 'activities', 'flights', 'bus-schedules', 'marketplace_ads', 'marketplace_chats',
                'bars', 'events', 'municipal'
            ];
            ALL_BUSINESS_COLLECTIONS.forEach(k => {
                if (db[k]) {
                    db[k].forEach(biz => {
                        if (biz.reservations) {
                            const r = biz.reservations.find(resv => resv.id === block.appointmentId);
                            if (r) {
                                r.status = r.status === 'in_service' ? 'completed' : 'cancelled';
                            }
                        }
                    });
                }
            });
            if (db.users) {
                db.users.forEach(u => {
                    if (u.reservations) {
                        const r = u.reservations.find(resv => resv.id === block.appointmentId);
                        if (r) {
                            r.status = r.status === 'in_service' ? 'completed' : 'cancelled';
                        }
                    }
                });
            }
        }
        
        await writeDB(db);
        res.json({ success: true, block });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- CLEAR ALL RESERVATIONS FOR TESTING ---
app.post('/api/admin/clear-reservations', async (req, res) => {
    if (process.env.NODE_ENV === 'production') {
        return res.status(403).json({ error: "Permissão negada em ambiente de produção." });
    }
    try {
        const db = await readDB();
        
        // 1. Limpar reservas em todos os negócios
        ALL_BUSINESS_COLLECTIONS.forEach(key => {
            if (db[key]) {
                db[key].forEach(biz => {
                    biz.reservations = [];
                    biz.kitchenOrders = [];
                    biz.salesHistory = [];
                    // Restaurar status das mesas / quartos
                    if (biz.tables) {
                        biz.tables.forEach(t => {
                            t.status = 'available';
                            t.customerName = undefined;
                            t.reservationTime = undefined;
                            t.currentTab = [];
                            t.pendingOrderItems = [];
                            t.alertStatus = 'none';
                        });
                    }
                    if (biz.rooms) {
                        biz.rooms.forEach(r => {
                            r.status = 'available';
                            r.customerName = undefined;
                            r.reservationTime = undefined;
                        });
                    }
                });
            }
        });
        
        // 2. Limpar reservas em todos os utilizadores
        if (db.users) {
            db.users.forEach(user => {
                user.reservations = [];
            });
        }
        
        await writeDB(db);
        console.log("🧹 DATABASE CLEANUP: All reservations successfully cleared.");
        res.json({ success: true, message: "Todas as reservas foram eliminadas com sucesso." });
    } catch (err) {
        console.error("Erro ao limpar reservas:", err);
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/reservations/:id', async (req, res) => {
    const { id } = req.params;
    const db = await readDB();
    let foundRes = null;

    const ALL_BUSINESS_COLLECTIONS = [
        'restaurants', 'beauty', 'shops', 'services', 'offices', 
        'hotels', 'cars', 'it_services', 'perfumes', 'animals', 
        'real_estate', 'gyms', 'stands', 'auto_repairs', 
        'auto_electronics', 'used_market', 'activities', 'flights', 'bus-schedules', 'marketplace_ads', 'marketplace_chats',
        'bars', 'events', 'municipal'
    ];

    ALL_BUSINESS_COLLECTIONS.forEach(key => {
        if (db[key]) {
            db[key].forEach(biz => {
                if (biz.reservations) {
                    const found = biz.reservations.find(r => r.id === id);
                    if (found) foundRes = found;
                }
            });
        }
    });

    if (foundRes) {
        res.json(foundRes);
    } else {
        res.status(404).json({ error: 'Reserva não encontrada' });
    }
});

app.put('/api/reservations/:id', async (req, res) => {
    const { id } = req.params;
    const db = await readDB();
    let found = false;

    let updatedReservation = null;

    // 1. Atualizar nos Negócios
    ALL_BUSINESS_COLLECTIONS.forEach(key => {
        if (db[key]) {
            db[key].forEach(biz => {
                if (biz.reservations) {
                    const idx = biz.reservations.findIndex(r => r.id === id);
                    if (idx !== -1) {
                        // Validate chair availability if confirming a beauty booking
                        if ((key === 'beauty' || biz.businessType === 'beauty') && req.body.status === 'accepted') {
                            let chairId = req.body.chairId || biz.reservations[idx].chairId;
                            let chairsForBiz = (db.chairs || []).filter(c => c.businessId === biz.id && c.isActive !== false);
                            
                            if (chairsForBiz.length === 0) {
                                const defaultChair = {
                                    id: `CHAIR_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
                                    chairId: `CHAIR_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
                                    barberId: biz.id,
                                    businessId: biz.id,
                                    chairName: 'Cadeira 1',
                                    chairNumber: 1,
                                    status: 'available',
                                    isActive: true,
                                    createdAt: new Date().toISOString()
                                };
                                if (!db.chairs) db.chairs = [];
                                db.chairs.push(defaultChair);
                                chairsForBiz = [defaultChair];
                            }

                            let duration = 30;
                            const items = req.body.preOrder || req.body.preorder || biz.reservations[idx].preOrder || biz.reservations[idx].preorder || [];
                            if (items.length > 0) {
                                duration = items.reduce((sum, item) => sum + ((item.dish?.duration || item.duration || 30) * (item.quantity || 1)), 0);
                            }
                            const slotStart = req.body.time || biz.reservations[idx].time;
                            const slotEnd = minutesToTime(timeToMinutes(slotStart) + duration);

                            let selectedChair = null;
                            const checkChairAvailability = (chair, date, start, end) => {
                                const blocks = (db.chairBlocks || []).filter(b => 
                                    (b.chairId === chair.id || b.chairId === chair.chairId) &&
                                    b.date === date &&
                                    b.status !== 'cancelled' &&
                                    b.status !== 'completed'
                                );
                                const hasOverlap = blocks.some(b => {
                                    const bStart = timeToMinutes(b.startTime);
                                    const bEnd = timeToMinutes(b.endTime);
                                    return timeToMinutes(start) < bEnd && timeToMinutes(end) > bStart;
                                });
                                return !hasOverlap;
                            };

                            const targetDate = req.body.date || biz.reservations[idx].date;
                            if (chairId) {
                                const chair = chairsForBiz.find(c => c.id === chairId || c.chairId === chairId);
                                if (chair && checkChairAvailability(chair, targetDate, slotStart, slotEnd)) {
                                    selectedChair = chair;
                                }
                            }

                            if (!selectedChair) {
                                // Find first available chair
                                const availableChairs = chairsForBiz.filter(chair => checkChairAvailability(chair, targetDate, slotStart, slotEnd));
                                if (availableChairs.length === 0) {
                                    return res.status(400).json({ error: "Nenhuma cadeira disponível para este horário." });
                                }
                                selectedChair = availableChairs[0];
                                chairId = selectedChair.id;
                            }

                            req.body.chairId = chairId;
                            req.body.chairName = selectedChair.chairName;

                            if (!db.chairBlocks) db.chairBlocks = [];
                            const existingBlockIdx = db.chairBlocks.findIndex(b => b.appointmentId === id);
                            const newBlock = {
                                id: `BLK_${Date.now()}`,
                                chairId: chairId,
                                appointmentId: id,
                                barberId: biz.id,
                                businessId: biz.id,
                                date: req.body.date || biz.reservations[idx].date,
                                startTime: slotStart,
                                endTime: slotEnd,
                                status: 'reserved',
                                reason: 'Marcação Confirmada',
                                createdAt: new Date().toISOString()
                            };
                            if (existingBlockIdx !== -1) {
                                db.chairBlocks[existingBlockIdx] = { ...db.chairBlocks[existingBlockIdx], ...newBlock, id: db.chairBlocks[existingBlockIdx].id };
                            } else {
                                db.chairBlocks.push(newBlock);
                            }
                        }

                        // Handle other transitions
                        if ((key === 'beauty' || biz.businessType === 'beauty')) {
                            if (req.body.status === 'in_service') {
                                if (db.chairBlocks) {
                                    const block = db.chairBlocks.find(b => b.appointmentId === id);
                                    if (block) block.status = 'in_service';
                                }
                            }
                            if (req.body.status === 'cancelled' || req.body.status === 'rejected') {
                                if (db.chairBlocks) {
                                    const block = db.chairBlocks.find(b => b.appointmentId === id);
                                    if (block) block.status = 'cancelled';
                                }
                            }
                            if (req.body.status === 'completed') {
                                if (db.chairBlocks) {
                                    const block = db.chairBlocks.find(b => b.appointmentId === id);
                                    if (block) block.status = 'completed';
                                }
                            }
                            if (req.body.status === 'rescheduled') {
                                let duration = 30;
                                const items = req.body.preOrder || req.body.preorder || biz.reservations[idx].preOrder || biz.reservations[idx].preorder || [];
                                if (items.length > 0) {
                                    duration = items.reduce((sum, item) => sum + ((item.dish?.duration || item.duration || 30) * (item.quantity || 1)), 0);
                                }
                                const slotStart = req.body.time || biz.reservations[idx].time;
                                const slotEnd = minutesToTime(timeToMinutes(slotStart) + duration);

                                if (db.chairBlocks) {
                                    const block = db.chairBlocks.find(b => b.appointmentId === id);
                                    if (block) {
                                        block.date = req.body.date || biz.reservations[idx].date;
                                        block.startTime = slotStart;
                                        block.endTime = slotEnd;
                                        block.status = 'reserved';
                                    }
                                }
                            }
                        }

                        biz.reservations[idx] = { ...biz.reservations[idx], ...req.body };
                        const updatedRes = biz.reservations[idx];
                        updatedReservation = updatedRes;
                        
                        // SE A RESERVA MUDOU PARA ACCEPTED (CONFIRMADA), ATUALIZAR MESA PARA RESERVED
                        if (updatedRes.status === 'accepted' && updatedRes.tableId && biz.tables) {
                            const tableIdx = biz.tables.findIndex(t => t.id === updatedRes.tableId);
                            if (tableIdx !== -1) {
                                biz.tables[tableIdx] = {
                                    ...biz.tables[tableIdx],
                                    status: 'reserved',
                                    customerName: updatedRes.customerName,
                                    reservationTime: updatedRes.time
                                };
                            }
                        }

                        // SE HOUVER PREORDER (COMIDA NO PEDIDO DE RESERVA), CRIAR KITCHEN ORDER AUTOMATICAMENTE
                        const foodItems = updatedRes.preOrder || updatedRes.preorder;
                        if (updatedRes.status === 'accepted' && foodItems && foodItems.length > 0) {
                            if (!biz.kitchenOrders) biz.kitchenOrders = [];
                            // Evitar duplicados
                            const hasOrder = biz.kitchenOrders.some(o => o.reservationId === id);
                            if (!hasOrder) {
                                biz.kitchenOrders.push({
                                    id: `ORD_${Date.now()}`,
                                    tableId: updatedRes.tableId,
                                    reservationId: id,
                                    items: foodItems,
                                    status: 'pending_admin',
                                    timestamp: new Date().toISOString()
                                });
                            }
                        }
                        
                        // SE A RESERVA MUDOU PARA OCCUPIED, ATUALIZAR MESA PARA OCCUPIED
                        if (updatedRes.status === 'occupied' && updatedRes.tableId && biz.tables) {
                            const tableIdx = biz.tables.findIndex(t => t.id === updatedRes.tableId || String(t.id) === String(updatedRes.tableId));
                            if (tableIdx !== -1) {
                                const foodItems = updatedRes.preOrder || updatedRes.preorder || [];
                                biz.tables[tableIdx] = {
                                    ...biz.tables[tableIdx],
                                    status: 'occupied',
                                    customerName: updatedRes.customerName,
                                    reservationTime: updatedRes.time,
                                    currentTab: foodItems.length > 0 ? [...(biz.tables[tableIdx].currentTab || []), ...foodItems] : (biz.tables[tableIdx].currentTab || [])
                                };

                                // Criar Kitchen Order se ainda não existir e se tiver itens
                                if (foodItems.length > 0) {
                                    if (!biz.kitchenOrders) biz.kitchenOrders = [];
                                    const hasOrder = biz.kitchenOrders.some(o => o.reservationId === id);
                                    if (!hasOrder) {
                                        biz.kitchenOrders.push({
                                            id: `ORD_${Date.now()}`,
                                            tableId: updatedRes.tableId,
                                            reservationId: id,
                                            items: foodItems,
                                            status: 'pending_admin',
                                            timestamp: new Date().toISOString()
                                        });
                                    }
                                }
                            }
                        }
                        
                        // SE A RESERVA MUDOU PARA FINISHED OU CANCELLED, LIBERTAR A MESA
                        if ((updatedRes.status === 'finished' || updatedRes.status === 'cancelled') && updatedRes.tableId && biz.tables) {
                            const tableIdx = biz.tables.findIndex(t => t.id === updatedRes.tableId);
                            if (tableIdx !== -1) {
                                biz.tables[tableIdx] = {
                                    ...biz.tables[tableIdx],
                                    status: 'available',
                                    customerName: undefined,
                                    reservationTime: undefined,
                                    currentTab: []
                                };
                            }
                        }
                        
                        found = true;
                    }
                }
            });
        }
    });

    // 2. Sincronizar com o Perfil do Utilizador
    if (db.users) {
        db.users.forEach(user => {
            if (user.reservations) {
                const idx = user.reservations.findIndex(r => r.id === id);
                if (idx !== -1) {
                    user.reservations[idx] = { ...user.reservations[idx], ...req.body };
                }
            }
        });
    }

    // 3. Adicionar Notificação ao Cliente se o estado foi alterado
    if (updatedReservation && req.body.status) {
        const clientEmail = updatedReservation.customerEmail ? updatedReservation.customerEmail.toLowerCase().trim() : '';
        const clientUser = db.users?.find(u => normalizeEmail(u.email) === clientEmail);
        
        if (clientUser) {
            if (!clientUser.notifications) clientUser.notifications = [];
            
            const statusMap = {
                'pending': 'Pendente',
                'accepted': 'Confirmado',
                'rejected': 'Recusado',
                'rescheduled': 'Reagendado',
                'cancelled': 'Cancelado',
                'finished': 'Concluído'
            };
            const statusLabel = statusMap[req.body.status] || req.body.status;
            
            let notifText = `O seu agendamento para o dia ${updatedReservation.date} às ${updatedReservation.time} foi alterado para: ${statusLabel}.`;
            if (updatedReservation.businessType === 'beauty' || updatedReservation.businessId?.startsWith('BEA')) {
                if (req.body.status === 'accepted') {
                    notifText = `Agendamento confirmado para ${updatedReservation.time} na ${updatedReservation.chairName || 'sua cadeira'}.`;
                } else if (req.body.status === 'in_service') {
                    notifText = `O seu atendimento começou.`;
                } else if (req.body.status === 'completed' || req.body.status === 'finished') {
                    notifText = `Serviço concluído. Obrigado pela sua visita.`;
                }
            }

            clientUser.notifications.unshift({
                id: `NTF_${Date.now()}`,
                title: `Agendamento ${statusLabel}`,
                text: notifText,
                date: new Date().toLocaleDateString(),
                read: false,
                timestamp: new Date().toISOString()
            });
            console.log(`🔔 Notificação de estado [${statusLabel}] adicionada para o utilizador ${clientEmail}`);
        }
    }

    if (found) {
        await writeDB(db);
        res.json(updatedReservation || { success: true });
    } else {
        res.status(404).json({ error: "Reservation not found" });
    }
});

app.post('/api/reservations/:id/append-order', async (req, res) => {
    const { id } = req.params;
    const { items } = req.body;
    const db = await readDB();
    let found = false;

    // 1. Procurar a reserva nos Negócios
    ALL_BUSINESS_COLLECTIONS.forEach(key => {
        if (db[key]) {
            db[key].forEach(biz => {
                if (biz.reservations) {
                    const reservation = biz.reservations.find(r => r.id === id);
                    if (reservation) {
                        found = true;
                        
                        // Atualizar a mesa correspondente no negócio
                        if (reservation.tableId && biz.tables) {
                            const tableIdx = biz.tables.findIndex(t => t.id === reservation.tableId || String(t.id) === String(reservation.tableId));
                            if (tableIdx !== -1) {
                                const currentTab = biz.tables[tableIdx].currentTab || [];
                                const pendingOrderItems = biz.tables[tableIdx].pendingOrderItems || [];
                                
                                biz.tables[tableIdx] = {
                                    ...biz.tables[tableIdx],
                                    currentTab: [...currentTab, ...items],
                                    pendingOrderItems: [...pendingOrderItems, ...items],
                                    alertStatus: 'new_order'
                                };
                            }
                        }

                        // Atualizar a lista de pré-pedidos/pedidos extras na reserva
                        if (!reservation.preOrder) {
                            reservation.preOrder = [];
                        }
                        reservation.preOrder = [...reservation.preOrder, ...items];
                    }
                }
            });
        }
    });

    // 2. Sincronizar com o Utilizador correspondente
    if (db.users) {
        db.users.forEach(user => {
            if (user.reservations) {
                const r = user.reservations.find(res => res.id === id);
                if (r) {
                    if (!r.preOrder) {
                        r.preOrder = [];
                    }
                    r.preOrder = [...r.preOrder, ...items];
                }
            }
        });
    }

    if (found) {
        await writeDB(db);
        res.json({ success: true });
    } else {
        res.status(404).json({ error: "Reservation not found" });
    }
});

app.delete('/api/reservations/:id', async (req, res) => {
    const { id } = req.params;
    const db = await readDB();
    let found = false;

    // 1. Remover dos Negócios (Todas as Categorias)
    ALL_BUSINESS_COLLECTIONS.forEach(key => {
        if (db[key]) {
            db[key].forEach(biz => {
                if (biz.reservations) {
                    const initialLen = biz.reservations.length;
                    biz.reservations = biz.reservations.filter(r => r.id !== id);
                    if (biz.reservations.length < initialLen) found = true;
                }
            });
        }
    });

    // 2. Remover do Perfil do Utilizador
    if (db.users) {
        db.users.forEach(user => {
            if (user.reservations) {
                user.reservations = user.reservations.filter(r => r.id !== id);
            }
        });
    }

    if (found) {
        await writeDB(db);
        res.json({ success: true, message: "Reservation deleted permanently" });
    } else {
        res.status(404).json({ error: "Reservation not found" });
    }
});

// --- COMMUNITY ---
app.get('/api/community/posts', async (req, res) => {
    const db = await readDB();
    res.json(db.posts || []);
});

app.post('/api/community/posts', async (req, res) => {
    const db = await readDB();
    const newPost = { id: Date.now(), ...req.body, likes: 0, comments: [], createdAt: new Date().toISOString() };
    db.posts.unshift(newPost);
    await writeDB(db);
    res.status(201).json(newPost);
});

// --- MISC ---
app.get('/api/bus-schedules', async (req, res) => {
    const db = await readDB();
    res.json(db.busSchedules || []);
});
app.get('/api/activities', async (req, res) => {
    const db = await readDB();
    res.json(db.activities || []);
});
app.get('/api/flights', async (req, res) => {
    const db = await readDB();
    res.json(db.flights || []);
});
app.get('/api/hotels', async (req, res) => {
    const db = await readDB();
    res.json(db.hotels || []);
});
app.get('/api/cars', async (req, res) => {
    const db = await readDB();
    res.json(db.cars || []);
});

// Start Server and then Database
const startServer = () => {
    console.log("🔍 Iniciando sequência de arranque...");
    
    const server = app.listen(PORT, () => {
        console.log(`🚀 Master Backend running on port ${PORT}`);
        
        // Initial Database Connection (don't await to not block server start)
        connectDB().then(() => {
            console.log("📡 Database connection attempt finished.");
        }).catch(err => {
            console.error("🚨 Critical database connection error:", err.message);
        });

        // Force fresh deploy trigger to Render: 2026-06-07T21:52:50Z active
        const selfPing = () => {
            const url = process.env.RENDER_EXTERNAL_URL || `http://localhost:${PORT}`;
            axios.get(`${url}/api/health?t=${Date.now()}`)
                .then(() => console.log('💓 Keep-alive ping enviado'))
                .catch(err => console.log('⚠️ Erro no self-ping (normal em startup)'));
        };
        
        setInterval(selfPing, 60000); 
        setTimeout(selfPing, 5000); 
    });

    server.keepAliveTimeout = 120000;
    server.headersTimeout = 125000;
};

// SPA Catch-all — DEVE estar antes do startServer() e depois de todas as rotas API
// Garante que rotas como /hotel-room-service/... servem o index.html (SPA routing)
app.use((req, res) => {
    // Não aplicar a rotas de API
    if (req.path.startsWith('/api/')) {
        return res.status(404).json({ error: 'API endpoint não encontrado' });
    }
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.sendFile(path.join(__dirname, 'dist', 'index.html'), (err) => {
        if (err) {
            console.error('❌ Erro ao enviar index.html:', err);
            res.status(500).send('Erro ao carregar a aplicação.');
        }
    });
});

startServer();
