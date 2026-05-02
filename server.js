
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';

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

// DB Handlers
const readDB = () => {
    try {
        const data = fs.readFileSync(dbPath, 'utf8');
        const db = JSON.parse(data);
        // Initialize missing keys
        const defaults = { 
            restaurants: [], flights: [], hotels: [], cars: [], 
            activities: [], busSchedules: [], itineraries: [], 
            shops: [], beauty: [], services: [], offices: [], 
            users: [], posts: [] 
        };
        return { ...defaults, ...db };
    } catch (err) {
        console.error("Error reading db.json", err);
        return { restaurants: [], flights: [], hotels: [], cars: [], activities: [], busSchedules: [], itineraries: [], shops: [], beauty: [], services: [], offices: [], users: [], posts: [] };
    }
};

const writeDB = (data) => {
    try {
        fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
    } catch (err) {
        console.error("Error writing db.json", err);
    }
};

// User Sync
const syncBusinessUsers = (db) => {
    const businesses = [
        ...(db.restaurants || []), 
        ...(db.shops || []), 
        ...(db.beauty || []), 
        ...(db.services || []),
        ...(db.offices || [])
    ];
    
    businesses.forEach(rest => {
        if (rest.adminEmail && rest.adminPassword) {
            const normalizedEmail = normalizeEmail(rest.adminEmail);
            const userIndex = db.users.findIndex(u => normalizeEmail(u.email) === normalizedEmail);
            if (userIndex > -1) {
                db.users[userIndex].password = rest.adminPassword;
                if (!db.users[userIndex].credits) db.users[userIndex].credits = 100;
            } else {
                db.users.push({
                    email: rest.adminEmail,
                    password: rest.adminPassword,
                    credits: 100,
                    profile: { phone: rest.phone || "", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=" + rest.id },
                    reservations: []
                });
            }
        }
    });
};

// --- AUTH & USERS ---
app.get('/api/users/:email', (req, res) => {
    const email = normalizeEmail(req.params.email);
    const db = readDB();
    let user = db.users.find(u => normalizeEmail(u.email) === email);
    if (!user) {
        user = { email, credits: 100, reservations: [], profile: { avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + email } };
        db.users.push(user);
        writeDB(db);
    }
    res.json(user);
});

app.put('/api/users/:email', (req, res) => {
    const email = normalizeEmail(req.params.email);
    const db = readDB();
    const index = db.users.findIndex(u => normalizeEmail(u.email) === email);
    if (index !== -1) {
        db.users[index] = { ...db.users[index], ...req.body, email };
    } else {
        db.users.push({ email, ...req.body });
    }
    writeDB(db);
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
    
    const imageUrl = `${protocol}://${host}/${relativePath}`;
    res.json({ url: imageUrl });
});

// --- BUSINESSES ---
app.get('/api/restaurants', (req, res) => {
    const db = readDB();
    const allBusinesses = [
        ...(db.restaurants || []),
        ...(db.beauty || []),
        ...(db.shops || []),
        ...(db.services || []),
        ...(db.offices || [])
    ];
    res.json(allBusinesses);
});

app.put('/api/restaurants/:id', (req, res) => {
    const { id } = req.params;
    const db = readDB();
    let targetArray = null;
    let index = -1;
    
    ['restaurants', 'beauty', 'shops', 'services', 'offices'].forEach(key => {
        if (db[key]) {
            const idx = db[key].findIndex(item => item.id === id);
            if (idx !== -1) { index = idx; targetArray = db[key]; }
        }
    });

    if (targetArray && index !== -1) {
        targetArray[index] = { ...targetArray[index], ...req.body };
        writeDB(db);
        res.json(targetArray[index]);
    } else {
        res.status(404).send("Business not found");
    }
});

// --- RESERVATIONS ---
app.post('/api/reservations', (req, res) => {
    const { businessId, businessType, customerEmail } = req.body;
    const db = readDB();
    const normalEmail = normalizeEmail(customerEmail);
    const reservation = { ...req.body, customerEmail: normalEmail, id: `RES_${Date.now()}`, status: 'pending', createdAt: new Date().toISOString() };

    let business = null;
    const typeMap = { 'restaurant': 'restaurants', 'beauty': 'beauty', 'shop': 'shops', 'office': 'offices', 'service': 'services' };
    const key = typeMap[businessType] || 'restaurants';
    
    business = db[key]?.find(b => b.id === businessId);
    if (business) {
        if (!business.reservations) business.reservations = [];
        business.reservations.push(reservation);
        
        // Sync with User
        const user = db.users.find(u => normalizeEmail(u.email) === normalEmail);
        if (user) {
            if (!user.reservations) user.reservations = [];
            user.reservations.push({ ...reservation, businessName: business.name });
        }
        
        writeDB(db);
        res.status(201).json(reservation);
    } else {
        res.status(404).send("Business not found for reservation");
    }
});

// Backward compatibility aliases
app.post('/api/restaurants/:id/reservations', (req, res) => {
    req.body.businessId = req.params.id;
    req.body.businessType = 'restaurant';
    app._router.handle({ method: 'POST', url: '/api/reservations', body: req.body }, res);
});
app.post('/api/beauty/:id/reservations', (req, res) => {
    req.body.businessId = req.params.id;
    req.body.businessType = 'beauty';
    app._router.handle({ method: 'POST', url: '/api/reservations', body: req.body }, res);
});
app.post('/api/shops/:id/reservations', (req, res) => {
    req.body.businessId = req.params.id;
    req.body.businessType = 'shop';
    app._router.handle({ method: 'POST', url: '/api/reservations', body: req.body }, res);
});
app.post('/api/offices/:id/reservations', (req, res) => {
    req.body.businessId = req.params.id;
    req.body.businessType = 'office';
    app._router.handle({ method: 'POST', url: '/api/reservations', body: req.body }, res);
});
app.post('/api/activities/:id/reservations', (req, res) => {
    req.body.businessId = req.params.id;
    req.body.businessType = 'service';
    app._router.handle({ method: 'POST', url: '/api/reservations', body: req.body }, res);
});

// --- COMMUNITY (SOCIAL) ---
app.get('/api/community/posts', (req, res) => {
    const db = readDB();
    res.json(db.posts || []);
});

app.post('/api/community/posts', (req, res) => {
    const db = readDB();
    const newPost = {
        id: Date.now(),
        ...req.body,
        likes: 0,
        comments: [],
        createdAt: new Date().toISOString()
    };
    db.posts.unshift(newPost);
    writeDB(db);
    res.status(201).json(newPost);
});

app.post('/api/community/posts/:id/like', (req, res) => {
    const { id } = req.params;
    const { email } = req.body;
    const db = readDB();
    const post = db.posts.find(p => p.id == id);
    if (post) {
        if (!post.likedBy) post.likedBy = [];
        const normEmail = normalizeEmail(email);
        const idx = post.likedBy.indexOf(normEmail);
        if (idx > -1) {
            post.likedBy.splice(idx, 1);
            post.likes = Math.max(0, post.likes - 1);
        } else {
            post.likedBy.push(normEmail);
            post.likes += 1;
        }
        writeDB(db);
        res.json({ likes: post.likes, liked: idx === -1 });
    } else {
        res.status(404).send("Post not found");
    }
});

app.post('/api/community/posts/:id/comments', (req, res) => {
    const { id } = req.params;
    const db = readDB();
    const post = db.posts.find(p => p.id == id);
    if (post) {
        const comment = { id: Date.now(), ...req.body, createdAt: new Date().toISOString() };
        if (!post.comments) post.comments = [];
        post.comments.push(comment);
        writeDB(db);
        res.status(201).json(comment);
    } else {
        res.status(404).send("Post not found");
    }
});

// --- MISC ---
app.get('/api/bus-schedules', (req, res) => res.json(readDB().busSchedules || []));
app.get('/api/activities', (req, res) => res.json(readDB().activities || []));
app.get('/api/flights', (req, res) => res.json(readDB().flights || []));
app.get('/api/hotels', (req, res) => res.json(readDB().hotels || []));
app.get('/api/cars', (req, res) => res.json(readDB().cars || []));

app.post('/api/payment-confirm', (req, res) => {
    const { restaurantId, reservationId, customerEmail, tableId } = req.body;
    const db = readDB();
    // Simplified credit attribution logic (can be expanded)
    const user = db.users.find(u => normalizeEmail(u.email) === normalizeEmail(customerEmail));
    if (user) {
        user.credits = (user.credits || 0) + 10; // Default bonus
        writeDB(db);
    }
    res.json({ success: true });
});

app.listen(PORT, () => console.log(`🚀 Master Backend running on port ${PORT}`));
