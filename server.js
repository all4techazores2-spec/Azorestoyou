import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';
import { readDB, writeDB, connectDB } from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, 'db.json');

// --- HELPERS ---
const normalizeEmail = (email) => {
    if (!email) return email;
    return email.toLowerCase().trim();
};

// Ensure directories
const imagesBaseDir = path.join(__dirname, 'imagens');
if (!fs.existsSync(imagesBaseDir)) fs.mkdirSync(imagesBaseDir);
const restDir = path.join(imagesBaseDir, 'restaurantes');
if (!fs.existsSync(restDir)) fs.mkdirSync(restDir);
const communityDir = path.join(imagesBaseDir, 'community');
if (!fs.existsSync(communityDir)) fs.mkdirSync(communityDir);

// Multer Storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const { restaurantId, type } = req.body;
        let targetDir = imagesBaseDir;
        
        if (type === 'community') {
            targetDir = communityDir;
        } else if (restaurantId) {
            targetDir = path.join(restDir, restaurantId);
            if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir);
        } else {
            targetDir = restDir;
        }
        cb(null, targetDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(bodyParser.json());
app.use('/imagens', express.static(path.join(__dirname, 'imagens')));
app.use(express.static(path.join(__dirname, 'dist')));

// Initial Seed Function
const seedIfNeeded = async () => {
    const db = await readDB();
    // Apenas faz o seed se a base de dados estiver ABSOLUTAMENTE vazia (zero restaurantes)
    // Isso evita que ele sobrescreva o teu trabalho se decidires ter poucos restaurantes.
    if (!db.restaurants || db.restaurants.length === 0) {
        console.log("🌱 Startup: Database is empty. Seeding from new_restaurants.json...");
        const seedPath = path.join(__dirname, 'new_restaurants.json');
        if (fs.existsSync(seedPath)) {
            try {
                const seedData = JSON.parse(fs.readFileSync(seedPath, 'utf8'));
                db.restaurants = seedData;
                await writeDB(db);
                console.log(`✅ Startup: Seeded ${seedData.length} restaurants successfully.`);
            } catch (seedErr) {
                console.error("Error during initial seeding", seedErr);
            }
        }
    } else {
        console.log(`📊 Startup: Database already has ${db.restaurants.length} restaurants. Skipping seed.`);
    }
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

// --- MEDIA UPLOAD ---
app.post('/api/upload', upload.single('image'), (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    const { restaurantId, type } = req.body;
    const protocol = req.protocol;
    const host = req.get('host');
    
    let relativePath = '';
    if (type === 'community') {
        relativePath = `imagens/community/${req.file.filename}`;
    } else if (restaurantId) {
        relativePath = `imagens/restaurantes/${restaurantId}/${req.file.filename}`;
    } else {
        relativePath = `imagens/restaurantes/${req.file.filename}`;
    }
    
    const imageUrl = `/${relativePath}`;
    res.json({ url: imageUrl });
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
};

ALL_BUSINESS_COLLECTIONS.forEach(key => {
    app.get(`/api/${key}`, async (req, res) => {
        const db = await readDB();
        res.json(db[key] || []);
    });
    app.put(`/api/${key}/:id`, handleBusinessUpdate);
    
    // Bulk update for Admin Dashboard
    app.post(`/api/${key}/bulk`, async (req, res) => {
        const db = await readDB();
        db[key] = req.body;
        await writeDB(db);
        res.json({ success: true, count: req.body.length });
    });
});

// Full Sync for Admin Dashboard
app.post('/api/full-sync', async (req, res) => {
    const db = await readDB();
    const updatedData = req.body;
    const finalDB = { ...db, ...updatedData };
    await writeDB(finalDB);
    res.json({ success: true });
});

// Adicionar rotas de bulk para outras coleções que não são "business" puras
['flights', 'busSchedules', 'activities', 'users', 'posts'].forEach(key => {
    app.post(`/api/${key}/bulk`, async (req, res) => {
        const db = await readDB();
        db[key] = req.body;
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

app.listen(PORT, async () => {
    console.log(`🚀 Master Backend running on port ${PORT}`);
    
    // Connect to external DB if available
    await connectDB();
    
    // Seed database if empty on startup
    await seedIfNeeded();
    
    // Truque para manter o Render sempre ativo (Self-Ping cada 10 min)
    const selfPing = () => {
        const url = process.env.RENDER_EXTERNAL_URL || `http://localhost:${PORT}`;
        fetch(`${url}/api/bus-schedules`)
            .then(() => console.log('💓 Keep-alive ping enviado com sucesso'))
            .catch(err => console.log('⚠️ Erro no self-ping (normal em startup):', err.message));
    };
    
    setInterval(selfPing, 600000); // 10 minutos
    setTimeout(selfPing, 5000); // Primeiro ping após 5 segundos
});

// SPA Catch-all (Deve ser a ÚLTIMA rota)
app.use((req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'), (err) => {
        if (err) {
            console.error("❌ Erro ao enviar index.html:", err);
            res.status(500).send("Erro ao carregar a aplicação.");
        }
    });
});
