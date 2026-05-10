// Force Restart to verify Persistence - 2026-05-10
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';
import axios from 'axios';
import { readDB, writeDB, connectDB, getDbStatus } from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, 'db.json');

// --- HELPERS ---
const normalizeEmail = (email) => {
    if (!email) return email;
    return email.toLowerCase().trim();
};

// Multer Memory Storage (For Base64 storage in MongoDB)
const storage = multer.memoryStorage();
const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 } // Limite de 5MB por foto
});

const app = express();
const PORT = process.env.PORT || 3001;

// Configuração robusta de CORS
app.use(cors({
    origin: [
        'https://azorestoyou.pt', 
        'https://www.azorestoyou.pt', 
        'http://localhost:5173', 
        'http://localhost:3000'
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use('/imagens', express.static(path.join(__dirname, 'imagens')));
app.use(express.static(path.join(__dirname, 'dist')));

// --- DATABASE STATUS ---
app.get('/api/status', async (req, res) => {
    // Returns REAL connection state, not just whether the env var exists
    res.json(getDbStatus());
});

// Initial Seed Function - DISABLED as requested by user to keep a clean slate
const seedIfNeeded = async () => {
    console.log("ℹ️ Startup: Automatic seeding is disabled.");
};

// --- AUTH & USERS ---
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
        await writeDB(db);
    }
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

// --- MEDIA UPLOAD (BASE64) ---
app.post('/api/upload', upload.single('image'), (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    
    try {
        // Converter buffer para Base64 Data URI
        const base64Image = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
        
        console.log(`📸 Image Uploaded: ${req.file.originalname} (${req.file.size} bytes) converted to Base64`);
        res.json({ url: base64Image });
    } catch (err) {
        console.error("❌ Error converting image to Base64:", err);
        res.status(500).json({ error: "Failed to process image" });
    }
});

// --- BUSINESSES (UNIFIED) ---

const ALL_BUSINESS_COLLECTIONS = [
    'restaurants', 'beauty', 'shops', 'services', 'offices', 
    'hotels', 'cars', 'it_services', 'perfumes', 'animals', 
    'real_estate', 'gyms', 'stands', 'auto_repairs', 
    'auto_electronics', 'used_market'
];

// Generic Business Update Handler
const handleBusinessUpdate = async (req, res) => {
    const { id } = req.params;
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
            targetArray[index] = { ...targetArray[index], ...req.body };
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

ALL_BUSINESS_COLLECTIONS.forEach(key => {
    app.get(`/api/${key}`, async (req, res) => {
        try {
            const db = await readDB();
            res.json(db[key] || []);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });
    app.put(`/api/${key}/:id`, handleBusinessUpdate);
    
    // Bulk update for Admin Dashboard
    app.post(`/api/${key}/bulk`, async (req, res) => {
        try {
            const db = await readDB();
            db[key] = req.body;
            await writeDB(db);
            res.json({ success: true, count: req.body.length });
        } catch (err) {
            console.error(`❌ Bulk update for ${key} failed:`, err.message);
            res.status(500).json({ error: err.message });
        }
    });
});

// Full Sync for Admin Dashboard
app.post('/api/full-sync', async (req, res) => {
    try {
        const db = await readDB();
        const updatedData = req.body;
        const finalDB = { ...db, ...updatedData };
        await writeDB(finalDB);
        res.json({ success: true });
    } catch (err) {
        console.error("❌ Full sync failed:", err.message);
        res.status(500).json({ error: err.message });
    }
});

// Adicionar rotas de bulk para outras coleções que não são "business" puras
['flights', 'bus-schedules', 'activities', 'users', 'posts'].forEach(key => {
    app.post(`/api/${key}/bulk`, async (req, res) => {
        const db = await readDB();
        const dbKey = key === 'bus-schedules' ? 'busSchedules' : key;
        db[dbKey] = req.body;
        await writeDB(db);
        res.json({ success: true, count: req.body.length });
    });
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

// --- RESERVATIONS ---
app.post('/api/reservations', async (req, res) => {
    const db = await readDB();
    const { businessId, businessType, customerEmail } = req.body;
    const reservation = { ...req.body, id: `RES_${Date.now()}`, status: 'pending', createdAt: new Date().toISOString() };
    
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
    const key = typeMap[businessType] || 'restaurants';
    const business = db[key]?.find(b => b.id === businessId);

    if (business) {
        if (!business.reservations) business.reservations = [];
        business.reservations.push(reservation);
        
        const user = db.users.find(u => normalizeEmail(u.email) === normalizeEmail(customerEmail));
        if (user) {
            if (!user.reservations) user.reservations = [];
            user.reservations.push({ ...reservation, businessName: business.name });
        }
        
        await writeDB(db);
        res.status(201).json(reservation);
    } else {
        res.status(404).send("Business not found");
    }
});

app.put('/api/reservations/:id', async (req, res) => {
    const { id } = req.params;
    const db = await readDB();
    let found = false;

    // 1. Atualizar nos Negócios
    ALL_BUSINESS_COLLECTIONS.forEach(key => {
        if (db[key]) {
            db[key].forEach(biz => {
                if (biz.reservations) {
                    const idx = biz.reservations.findIndex(r => r.id === id);
                    if (idx !== -1) {
                        biz.reservations[idx] = { ...biz.reservations[idx], ...req.body };
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

export const getDbStatus = () => ({
    storage: isMongoConnected ? 'MongoDB Atlas (Cloud)' : (IS_MONGODB ? 'MongoDB (Falha/Ligando...)' : 'Local JSON (Efémero)'),
    isMongo: isMongoConnected,
    isConfigured: IS_MONGODB,
    uriFound: !!MONGODB_URI,
    timestamp: new Date().toISOString()
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

// Start Database first, then Server
const startServer = async () => {
    console.log("🔍 Iniciando sequência de arranque...");
    
    // 1. Connect to Database
    await connectDB();
    
    // 2. Seed if needed
    await seedIfNeeded();
    
    // 3. Start Listening
    app.listen(PORT, () => {
        console.log(`🚀 Master Backend running on port ${PORT}`);
        
        // Self-Ping para manter o Render ativo
        const selfPing = () => {
            const url = process.env.RENDER_EXTERNAL_URL || `http://localhost:${PORT}`;
            axios.get(`${url}/api/status`)
                .then(() => console.log('💓 Keep-alive ping enviado'))
                .catch(err => console.log('⚠️ Erro no self-ping (normal em startup)'));
        };
        
        setInterval(selfPing, 60000); 
        setTimeout(selfPing, 5000); 
    });
};

startServer();

// SPA Catch-all (Deve ser a ÚLTIMA rota)
app.use((req, res) => {
    // Evitar cache agressivo do index.html para evitar erros 404 em assets (CSS/JS) novos após build
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    
    res.sendFile(path.join(__dirname, 'dist', 'index.html'), (err) => {
        if (err) {
            console.error("❌ Erro ao enviar index.html:", err);
            res.status(500).send("Erro ao carregar a aplicação.");
        }
    });
});
