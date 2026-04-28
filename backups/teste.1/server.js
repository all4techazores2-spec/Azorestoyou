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

// Helper to normalize emails across domains
const normalizeEmail = (email) => {
    if (!email) return email;
    return email.toLowerCase().trim();
};

// Ensure image directories exist
const imagesBaseDir = path.join(__dirname, 'imagens');
if (!fs.existsSync(imagesBaseDir)) fs.mkdirSync(imagesBaseDir);
const restDir = path.join(imagesBaseDir, 'restaurantes');
if (!fs.existsSync(restDir)) fs.mkdirSync(restDir);

// Configure Multer for storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const { restaurantId, type } = req.body;
        let targetDir = restDir;
        
        if (restaurantId) {
            targetDir = path.join(restDir, restaurantId);
            if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir);
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
const PORT = 3001;

app.use(cors());
app.use(bodyParser.json());
app.use('/imagens', express.static(path.join(__dirname, 'imagens')));

// Helper to read DB
const readDB = () => {
    try {
        const data = fs.readFileSync(dbPath, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error("Error reading db.json", err);
        return { restaurants: [], flights: [], hotels: [], cars: [], activities: [], busSchedules: [], itineraries: [] };
    }
};

// Helper to write DB
const writeDB = (data) => {
    try {
        fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
    } catch (err) {
        console.error("Error writing db.json", err);
    }
};

// Helper to sync restaurant admins and staff to users table
const syncRestaurantUsers = (db) => {
    if (!db.users) db.users = [];
    
    db.restaurants.forEach(rest => {
        // 1. Sync Admin
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

        // 2. Sync Staff
        if (rest.staff && Array.isArray(rest.staff)) {
            rest.staff.forEach(s => {
                if (s.email && s.password) {
                    const normalizedStaffEmail = normalizeEmail(s.email);
                    const staffIndex = db.users.findIndex(u => normalizeEmail(u.email) === normalizedStaffEmail);
                    
                    if (staffIndex > -1) {
                        db.users[staffIndex].password = s.password;
                    } else {
                        db.users.push({
                            email: s.email,
                            password: s.password,
                            name: s.name,
                            role: s.role,
                            credits: 0,
                            profile: { phone: "", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=" + s.id },
                            reservations: []
                        });
                    }
                }
            });
        }
    });
};

// --- ENDPOINTS ---
app.post('/api/upload', upload.single('image'), (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    
    const { restaurantId } = req.body;
    const protocol = req.protocol;
    const host = req.get('host');
    
    // Caminho relativo para a imagem
    const relativePath = restaurantId 
        ? `imagens/restaurantes/${restaurantId}/${req.file.filename}`
        : `imagens/restaurantes/${req.file.filename}`;
    
    const imageUrl = `${protocol}://${host}/${relativePath}`;
    res.json({ url: imageUrl });
});

// Bulk update restaurants (from Super Admin)
app.post('/api/restaurants/bulk', (req, res) => {
    const restaurants = req.body;
    const db = readDB();
    db.restaurants = restaurants;
    syncRestaurantUsers(db);
    writeDB(db);
    res.status(200).json({ message: "Restaurants and Admin Users updated in bulk" });
});

// GET All Restaurants
app.get('/api/restaurants', (req, res) => {
    const db = readDB();
    res.json(db.restaurants);
});

// UPDATE Restaurant (Tables, Kitchen, etc)
app.put('/api/restaurants/:id', (req, res) => {
    const { id } = req.params;
    const db = readDB();
    const index = db.restaurants.findIndex(r => r.id === id);
    if (index !== -1) {
        db.restaurants[index] = { ...db.restaurants[index], ...req.body };
        writeDB(db);
        res.json(db.restaurants[index]);
    } else {
        res.status(404).send("Restaurant not found");
    }
});

// POST New Reservation (from RestaurantModal)
app.post('/api/restaurants/:id/reservations', (req, res) => {
    const { id } = req.params;
    const customerEmail = normalizeEmail(req.body.customerEmail);
    const reservation = { ...req.body, customerEmail, id: `RES_${Date.now()}`, restaurantId: id, status: 'pending', createdAt: new Date().toISOString() };
    const db = readDB();
    
    const restaurant = db.restaurants.find(r => r.id === id);
    if (restaurant) {
        if (!restaurant.reservations) restaurant.reservations = [];
        restaurant.reservations.push(reservation);
        
        // SYNC WITH USER PROFILE if email matches
        if (customerEmail) {
            const user = db.users?.find(u => normalizeEmail(u.email) === customerEmail);
            if (user) {
                if (!user.reservations) user.reservations = [];
                user.reservations.push({
                    id: reservation.id,
                    restaurantId: id,
                    restaurantName: restaurant.name,
                    date: reservation.date,
                    time: reservation.time,
                    guests: reservation.guests,
                    status: 'pending',
                    preOrder: reservation.preOrder
                });
            }
        }

        writeDB(db);
        res.status(201).json(reservation);
    } else {
        res.status(404).send("Restaurant not found for reservation");
    }
});

// POST Orders (Pre-orders or table orders)
app.post('/api/restaurants/:id/orders', (req, res) => {
    const { id } = req.params;
    const order = { ...req.body, id: `ORD_${Date.now()}`, timestamp: new Date().toISOString(), status: 'sent_to_kitchen' };
    const db = readDB();
    
    const restaurant = db.restaurants.find(r => r.id === id);
    if (restaurant) {
        if (!restaurant.kitchenOrders) restaurant.kitchenOrders = [];
        restaurant.kitchenOrders.push(order);
        writeDB(db);
        res.status(201).json(order);
    } else {
        res.status(404).send("Restaurant not found for order");
    }
});

// BUS SCHEDULES
app.get('/api/bus-schedules', (req, res) => {
    const db = readDB();
    res.json(db.busSchedules);
});

// ITINERARIES (My Reservations)
app.get('/api/itineraries/:userId', (req, res) => {
    const db = readDB();
    const userItinerary = db.itineraries.find(i => i.userId === req.params.userId);
    res.json(userItinerary || { userId: req.params.userId, items: [] });
});

app.post('/api/itineraries', (req, res) => {
    const db = readDB();
    const { userId, item } = req.body;
    let itinerary = db.itineraries.find(i => i.userId === userId);
    if (!itinerary) {
        itinerary = { userId, items: [] };
        db.itineraries.push(itinerary);
    }
    itinerary.items.push(item);
    writeDB(db);
    res.json(itinerary);
});

// GET User (from App.tsx fetchData)
app.get('/api/users/:email', (req, res) => {
    const email = normalizeEmail(req.params.email);
    const db = readDB();
    if (!db.users) db.users = [];
    
    let user = db.users.find(u => normalizeEmail(u.email) === email);
    
    if (!user) {
        // Create user if doesn't exist to allow persistence
        user = { 
            email, 
            credits: 100, // Dar 100 créditos a novos utilizadores para teste
            reservations: [], 
            profile: {
                avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + email
            } 
        };
        db.users.push(user);
        writeDB(db);
    }
    
    res.json(user);
});

// UPDATE User Data
app.put('/api/users/:email', (req, res) => {
    const email = normalizeEmail(req.params.email);
    const db = readDB();
    if (!db.users) db.users = [];
    const index = db.users.findIndex(u => normalizeEmail(u.email) === email);
    if (index !== -1) {
        db.users[index] = { ...db.users[index], ...req.body, email }; // Keep normalized email
    } else {
        db.users.push({ email, ...req.body });
    }
    writeDB(db);
    res.json({ success: true });
});

// BULK UPDATE Restaurants (Admin)
app.post('/api/restaurants/bulk', (req, res) => {
    const db = readDB();
    db.restaurants = req.body;
    writeDB(db);
    res.json({ success: true });
});

// POST Review
app.post('/api/restaurants/:id/reviews', (req, res) => {
    const { id } = req.params;
    const { rating, comment, customerEmail, customerName } = req.body;
    const db = readDB();
    
    const restaurant = db.restaurants.find(r => r.id === id);
    if (restaurant) {
        if (!restaurant.reviews_list) restaurant.reviews_list = [];
        const newReview = {
            id: `REV_${Date.now()}`,
            rating,
            comment,
            customerName: customerName || 'Cliente',
            date: new Date().toISOString()
        };
        restaurant.reviews_list.push(newReview);
        
        // Update average rating
        const totalRating = restaurant.reviews_list.reduce((sum, r) => sum + r.rating, 0);
        restaurant.rating = Number((totalRating / restaurant.reviews_list.length).toFixed(1));
        restaurant.reviews = restaurant.reviews_list.length;

        writeDB(db);
        res.json({ success: true, review: newReview });
    } else {
        res.status(404).send("Restaurant not found");
    }
});

// Full Sync Endpoint
app.post('/api/full-sync', (req, res) => {
    const { restaurants, activities, flights, hotels, cars, busSchedules } = req.body;
    const db = readDB();
    
    if (restaurants) db.restaurants = restaurants;
    if (activities) db.activities = activities;
    if (flights) db.flights = flights;
    if (hotels) db.hotels = hotels;
    if (cars) db.cars = cars;
    if (busSchedules) db.busSchedules = busSchedules;
    
    syncRestaurantUsers(db);
    writeDB(db);
    res.json({ success: true, message: "Sincronização completa realizada com sucesso!" });
});

app.listen(PORT, () => {
    console.log(`AzoresToyou Server running at http://localhost:${PORT}`);
});
