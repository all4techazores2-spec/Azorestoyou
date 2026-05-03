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
const PORT = process.env.PORT || 3001;

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
        return { restaurants: [], flights: [], hotels: [], cars: [], activities: [], busSchedules: [], itineraries: [], shops: [], beauty: [], services: [], offices: [] };
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
const syncBusinessUsers = (db) => {
    if (!db.users) db.users = [];
    
    const businesses = [
        ...(db.restaurants || []), 
        ...(db.shops || []), 
        ...(db.beauty || []), 
        ...(db.services || []),
        ...(db.offices || [])
    ];
    
    businesses.forEach(rest => {
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
        // 3. Sync Suppliers
        if (rest.suppliers && Array.isArray(rest.suppliers)) {
            rest.suppliers.forEach(sup => {
                if (sup.email) {
                    const normSupEmail = normalizeEmail(sup.email);
                    const supIdx = db.users.findIndex(u => normalizeEmail(u.email) === normSupEmail);
                    
                    if (supIdx > -1) {
                        if (sup.password) db.users[supIdx].password = sup.password;
                        db.users[supIdx].role = 'supplier';
                    } else {
                        db.users.push({
                            email: sup.email,
                            password: sup.password || "admin",
                            name: sup.name,
                            role: 'supplier',
                            credits: 0,
                            profile: { phone: sup.phone || "", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=" + sup.id },
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
    syncBusinessUsers(db);
    writeDB(db);
    res.status(200).json({ message: "Restaurants and Admin Users updated in bulk" });
});

// GET All Restaurants and Businesses
app.get('/api/restaurants', (req, res) => {
    const db = readDB();
    // Return a consolidated list so the frontend can filter by businessType
    const allBusinesses = [
        ...(db.restaurants || []),
        ...(db.beauty || []),
        ...(db.shops || []),
        ...(db.services || []),
        ...(db.offices || [])
    ];
    res.json(allBusinesses);
});

// UPDATE Business (Tables, Kitchen, reservations, etc)
app.put('/api/restaurants/:id', (req, res) => {
    const { id } = req.params;
    const db = readDB();
    
    // Find which array contains the business
    let targetArray = null;
    let index = -1;
    
    if (db.restaurants) {
        index = db.restaurants.findIndex(r => r.id === id);
        if (index !== -1) targetArray = db.restaurants;
    }
    
    if (index === -1 && db.beauty) {
        index = db.beauty.findIndex(b => b.id === id);
        if (index !== -1) targetArray = db.beauty;
    }
    
    if (index === -1 && db.shops) {
        index = db.shops.findIndex(s => s.id === id);
        if (index !== -1) targetArray = db.shops;
    }

    if (targetArray && index !== -1) {
        const oldBusiness = targetArray[index];
        const newBusiness = { ...oldBusiness, ...req.body };
        targetArray[index] = newBusiness;

        // SYNC RESERVATIONS WITH USERS
        if (req.body.reservations) {
            req.body.reservations.forEach((res) => {
                if (res.customerEmail) {
                    const email = normalizeEmail(res.customerEmail);
                    const user = db.users?.find(u => normalizeEmail(u.email) === email);
                    if (user && user.reservations) {
                        const userResIndex = user.reservations.findIndex((r) => r.id === res.id);
                        if (userResIndex !== -1) {
                            user.reservations[userResIndex] = {
                                ...user.reservations[userResIndex],
                                status: res.status,
                                tableId: res.tableId
                            };
                        }
                    }
                }
            });
        }

        writeDB(db);
        res.json(db.restaurants[index]);
    } else {
        res.status(404).send("Restaurant not found");
    }
});

// POST New Restaurant Reservation (from RestaurantModal)
app.post('/api/restaurants/:id/reservations', (req, res) => {
    const { id } = req.params;
    const customerEmail = normalizeEmail(req.body.customerEmail);
    const reservation = { ...req.body, customerEmail, id: `RES_${Date.now()}`, businessId: id, status: 'pending', createdAt: new Date().toISOString() };
    const db = readDB();
    
    const restaurant = db.restaurants?.find(r => r.id === id);
    if (restaurant) {
        if (!restaurant.reservations) restaurant.reservations = [];
        restaurant.reservations.push(reservation);
        
        // Sincronizar com perfil do utilizador
        if (customerEmail) {
            const user = db.users?.find(u => normalizeEmail(u.email) === customerEmail);
            if (user) {
                if (!user.reservations) user.reservations = [];
                user.reservations.push({
                    ...reservation,
                    restaurantName: restaurant.name,
                    businessName: restaurant.name
                });
            }
        }
        
        writeDB(db);
        res.status(201).json(reservation);
    } else {
        res.status(404).send("Restaurant not found for reservation");
    }
});

// POST New Beauty Reservation
app.post('/api/beauty/:id/reservations', (req, res) => {
    const { id } = req.params;
    const customerEmail = normalizeEmail(req.body.customerEmail);
    const reservation = { ...req.body, customerEmail, id: `RES_${Date.now()}`, businessId: id, status: 'pending', createdAt: new Date().toISOString() };
    const db = readDB();
    
    // Procura especificamente no array de beleza (seguindo a lógica do restaurante)
    const beauty = db.beauty?.find(b => b.id === id);
    if (beauty) {
        if (!beauty.reservations) beauty.reservations = [];
        beauty.reservations.push(reservation);
        
        if (customerEmail) {
            const user = db.users?.find(u => normalizeEmail(u.email) === customerEmail);
            if (user) {
                if (!user.reservations) user.reservations = [];
                user.reservations.push({
                    ...reservation,
                    businessName: beauty.name,
                    restaurantName: beauty.name 
                });
            }
        }
        writeDB(db);
        res.status(201).json(reservation);
    } else {
        // Se não encontrou em beauty, tentar em restaurants por segurança (caso esteja migrado)
        const altBusiness = db.restaurants?.find(r => r.id === id);
        if (altBusiness) {
            if (!altBusiness.reservations) altBusiness.reservations = [];
            altBusiness.reservations.push(reservation);
            writeDB(db);
            res.status(201).json(reservation);
        } else {
            res.status(404).send("Beauty business not found");
        }
    }
});

// POST New Shop Reservation/Order
app.post('/api/shops/:id/reservations', (req, res) => {
    const { id } = req.params;
    const customerEmail = normalizeEmail(req.body.customerEmail);
    const reservation = { ...req.body, customerEmail, id: `RES_${Date.now()}`, businessId: id, status: 'pending', createdAt: new Date().toISOString() };
    const db = readDB();
    
    const shop = db.shops?.find(s => s.id === id);
    if (shop) {
        if (!shop.reservations) shop.reservations = [];
        shop.reservations.push(reservation);
        
        if (customerEmail) {
            const user = db.users?.find(u => normalizeEmail(u.email) === customerEmail);
            if (user) {
                if (!user.reservations) user.reservations = [];
                user.reservations.push({
                    ...reservation,
                    businessName: shop.name,
                    restaurantName: shop.name
                });
            }
        }
        writeDB(db);
        res.status(201).json(reservation);
    } else {
        // Se não encontrou em shops, tentar em restaurants por segurança
        const altBusiness = db.restaurants?.find(r => r.id === id);
        if (altBusiness) {
            if (!altBusiness.reservations) altBusiness.reservations = [];
            altBusiness.reservations.push(reservation);
            writeDB(db);
            res.status(201).json(reservation);
        } else {
            res.status(404).send("Shop not found");
        }
    }
});

// SHOPS
app.get('/api/shops', (req, res) => {
    const db = readDB();
    res.json(db.shops || []);
});

app.put('/api/shops/:id', (req, res) => {
    const { id } = req.params;
    const db = readDB();
    const index = db.shops?.findIndex(s => s.id === id);
    if (index !== -1) {
        db.shops[index] = { ...db.shops[index], ...req.body };
        writeDB(db);
        res.json(db.shops[index]);
    } else {
        res.status(404).send("Shop not found");
    }
});

// OFFICES
app.get('/api/offices', (req, res) => {
    const db = readDB();
    res.json(db.offices || []);
});

app.post('/api/offices/:id/reservations', (req, res) => {
    const { id } = req.params;
    const customerEmail = normalizeEmail(req.body.customerEmail);
    const reservation = { 
        ...req.body, 
        customerEmail, 
        id: `RES_${Date.now()}`, 
        businessId: id, 
        status: 'pending', 
        createdAt: new Date().toISOString() 
    };
    const db = readDB();
    
    if (!db.offices) db.offices = [];
    let office = db.offices.find(o => o.id === id);
    
    // Fallback: Se o escritório ainda não existir no DB, criamo-lo
    if (!office) {
        office = { id, name: req.body.officeName || "Escritório", reservations: [] };
        db.offices.push(office);
    }
    
    if (!office.reservations) office.reservations = [];
    office.reservations.push(reservation);
    
    // Sync with user
    if (customerEmail) {
        const user = db.users?.find(u => normalizeEmail(u.email) === customerEmail);
        if (user) {
            if (!user.reservations) user.reservations = [];
            user.reservations.push({
                ...reservation,
                businessName: office.name,
                restaurantName: office.name
            });
        }
    }
    
    writeDB(db);
    res.status(201).json(reservation);
});

app.put('/api/offices/:id', (req, res) => {
    const { id } = req.params;
    const db = readDB();
    const index = db.offices?.findIndex(o => o.id === id);
    if (index !== -1) {
        db.offices[index] = { ...db.offices[index], ...req.body };
        writeDB(db);
        res.json(db.offices[index]);
    } else {
        res.status(404).send("Office not found");
    }
});

// BEAUTY SERVICES
app.get('/api/beauty', (req, res) => {
    const db = readDB();
    res.json(db.beauty || []);
});

app.get('/api/services', (req, res) => {
    const db = readDB();
    res.json(db.services || []);
});

app.post('/api/services', (req, res) => {
    const db = readDB();
    const newService = { id: 'S' + Date.now(), ...req.body };
    if (!db.services) db.services = [];
    db.services.push(newService);
    writeDB(db);
    res.status(201).json(newService);
});

app.put('/api/services/:id', (req, res) => {
    const { id } = req.params;
    const db = readDB();
    const index = db.services.findIndex(s => s.id === id);
    if (index > -1) {
        db.services[index] = { ...db.services[index], ...req.body };
        writeDB(db);
        res.json(db.services[index]);
    } else {
        res.status(404).json({ error: "Service not found" });
    }
});

app.put('/api/beauty/:id', (req, res) => {
    const { id } = req.params;
    const db = readDB();
    const index = db.beauty?.findIndex(b => b.id === id);
    if (index !== -1) {
        db.beauty[index] = { ...db.beauty[index], ...req.body };
        writeDB(db);
        res.json(db.beauty[index]);
    } else {
        res.status(404).send("Beauty service not found");
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
    res.json(db.busSchedules || []);
});

// ACTIVITIES
app.get('/api/activities', (req, res) => {
    const db = readDB();
    res.json(db.activities || []);
});

// POST New Activity / Landscape Reservation
app.post('/api/activities/:id/reservations', (req, res) => {
    const { id } = req.params;
    const customerEmail = normalizeEmail(req.body.customerEmail);
    const reservation = { ...req.body, customerEmail, id: `RES_${Date.now()}`, businessId: id, status: 'pending', createdAt: new Date().toISOString() };
    const db = readDB();

    // Tentar adicionar ao array de activities (se existir no DB)
    if (!db.activities) db.activities = [];
    const activity = db.activities.find(a => a.id === id);
    if (activity) {
        if (!activity.reservations) activity.reservations = [];
        activity.reservations.push(reservation);
    }
    // Mesmo sem encontrar a atividade (dados estáticos), guardar no user
    if (customerEmail) {
        if (!db.users) db.users = [];
        const user = db.users.find(u => normalizeEmail(u.email) === customerEmail);
        if (user) {
            if (!user.reservations) user.reservations = [];
            // Evitar duplicados
            const existingIdx = user.reservations.findIndex(r => r.id === reservation.id);
            if (existingIdx === -1) {
                user.reservations.push(reservation);
            }
        }
    }
    writeDB(db);
    console.log(`✅ Reserva de Paisagem/Atividade gravada: ${reservation.id} para ${customerEmail}`);
    res.status(201).json(reservation);
});

// Endpoint dedicado para persistir reservas no perfil do utilizador (fallback geral)
app.post('/api/user-reservations', (req, res) => {
    const { email, reservation } = req.body;
    if (!email || !reservation) return res.status(400).json({ error: 'Email e reserva são obrigatórios' });

    const normalEmail = normalizeEmail(email);
    const db = readDB();
    if (!db.users) db.users = [];
    
    let user = db.users.find(u => normalizeEmail(u.email) === normalEmail);
    if (!user) {
        user = { email: normalEmail, credits: 100, reservations: [], profile: { avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + normalEmail } };
        db.users.push(user);
    }
    if (!user.reservations) user.reservations = [];
    
    // Evitar duplicados pelo ID
    const existingIdx = user.reservations.findIndex(r => r.id === reservation.id);
    if (existingIdx === -1) {
        user.reservations.push(reservation);
        writeDB(db);
        console.log(`✅ Reserva gravada via endpoint dedicado: ${reservation.id} para ${normalEmail}`);
        res.status(201).json({ success: true, reservation });
    } else {
        res.json({ success: true, message: 'Reserva já existe', reservation });
    }
});

// FLIGHTS
app.get('/api/flights', (req, res) => {
    const db = readDB();
    res.json(db.flights || []);
});

// HOTELS
app.get('/api/hotels', (req, res) => {
    const db = readDB();
    res.json(db.hotels || []);
});

// CARS
app.get('/api/cars', (req, res) => {
    const db = readDB();
    res.json(db.cars || []);
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

        // MARK RESERVATION AS REVIEWED
        const { reservationId, customerEmail } = req.body;
        console.log(`[Review] Processing review for Res: ${reservationId}, User: ${customerEmail}`);
        
        if (reservationId) {
            // Update in restaurant array
            const resIndex = restaurant.reservations?.findIndex((r) => r.id === reservationId);
            console.log(`[Review] Found in restaurant at index: ${resIndex}`);
            
            if (resIndex !== -1 && restaurant.reservations) {
                restaurant.reservations[resIndex].reviewed = true;
                restaurant.reservations[resIndex].rating = rating;
                restaurant.reservations[resIndex].reviewNote = comment;
            }

            // Update in user array
            if (customerEmail) {
                const email = normalizeEmail(customerEmail);
                const user = db.users?.find((u) => normalizeEmail(u.email) === email);
                if (user && user.reservations) {
                    const userResIndex = user.reservations.findIndex((r) => r.id === reservationId);
                    console.log(`[Review] Found in user ${email} at index: ${userResIndex}`);
                    if (userResIndex !== -1) {
                        user.reservations[userResIndex].reviewed = true;
                        user.reservations[userResIndex].rating = rating;
                        user.reservations[userResIndex].reviewNote = comment;
                    }
                } else {
                    console.log(`[Review] User ${email} not found or has no reservations`);
                }
            }
        }

        writeDB(db);
        console.log(`[Review] Success!`);
        res.json({ success: true, review: newReview });
    } else {
        res.status(404).send("Restaurant not found");
    }
});

// PAYMENT CONFIRMATION — Attributes credits to user after restaurant confirms payment
app.post('/api/payment-confirm', (req, res) => {
    const { restaurantId, reservationId, customerEmail, tableId } = req.body;
    const db = readDB();

    const restaurant = db.restaurants.find(r => r.id === restaurantId);
    if (!restaurant) return res.status(404).json({ error: 'Restaurant not found' });

    const reservation = restaurant.reservations?.find(r => r.id === reservationId);
    const table = restaurant.tables?.find(t => t.id === tableId);

    // Helper: sum credits from items array
    const sumItemCredits = (items = []) =>
        items.reduce((acc, item) => {
            const credits = item?.dish?.credits ?? item?.product?.credits ?? 0;
            return acc + credits * (item.quantity || 1);
        }, 0);

    const preOrderCredits = sumItemCredits(reservation?.preOrder || []);
    const tabCredits = sumItemCredits(table?.currentTab || []);
    const baseCredits = restaurant.creditsPerReservation ?? 0;

    // If the customer already paid online and received pre-order credits at booking time,
    // don't count them again — only count new table items + base bonus
    const alreadyPaidPreOrder = reservation?.preOrderCreditsPaid === true;
    const earnedCredits = (alreadyPaidPreOrder ? 0 : preOrderCredits) + tabCredits + baseCredits;

    console.log(`[Payment] Res: ${reservationId}, Credits: ${earnedCredits} (preOrder:${alreadyPaidPreOrder ? 'skipped(already paid)' : preOrderCredits} tab:${tabCredits} base:${baseCredits})`);

    // Mark reservation as paid + store earnedCredits
    if (reservation) {
        reservation.status = 'finished';
        reservation.paymentConfirmed = true;
        reservation.earnedCredits = earnedCredits;
    }

    // Clear the table
    if (table) {
        table.status = 'available';
        table.alertStatus = 'none';
        table.currentTab = [];
        delete table.customerName;
        delete table.reservationTime;
    }

    // Attribute credits to the user
    if (customerEmail && earnedCredits > 0) {
        const email = normalizeEmail(customerEmail);
        const user = db.users?.find(u => normalizeEmail(u.email) === email);
        if (user) {
            user.credits = (user.credits || 0) + earnedCredits;
            if (user.reservations) {
                const userResIdx = user.reservations.findIndex(r => r.id === reservationId);
                if (userResIdx !== -1) {
                    user.reservations[userResIdx].status = 'finished';
                    user.reservations[userResIdx].paymentConfirmed = true;
                    user.reservations[userResIdx].earnedCredits = earnedCredits;
                }
            }
        }
    }

    writeDB(db);
    res.json({ success: true, earnedCredits });
});

// Full Sync Endpoint
app.post('/api/full-sync', (req, res) => {
    const { restaurants, activities, flights, hotels, cars, busSchedules, shops, beauty } = req.body;
    const db = readDB();
    
    if (restaurants) db.restaurants = restaurants;
    if (activities) db.activities = activities;
    if (flights) db.flights = flights;
    if (hotels) db.hotels = hotels;
    if (cars) db.cars = cars;
    if (busSchedules) db.busSchedules = busSchedules;
    if (shops) db.shops = shops;
    if (beauty) db.beauty = beauty;
    
    syncBusinessUsers(db);
    writeDB(db);
    res.json({ success: true, message: "Sincronização completa realizada com sucesso!" });
});

// Sync All (specifically for Restaurants bulk)
app.post('/api/sync-all', (req, res) => {
    const { restaurants } = req.body;
    const db = readDB();
    if (restaurants) {
        db.restaurants = restaurants;
        syncBusinessUsers(db);
        writeDB(db);
        res.json({ success: true });
    } else {
        res.status(400).json({ error: "No restaurants provided" });
    }
});

// Serve Frontend Static Files (Vite Build)
const distPath = path.join(__dirname, 'dist');
if (fs.existsSync(distPath)) {
    app.use(express.static(distPath));
    // Catch-all route for React Router (SPA)
    app.get(/^(?!\/api).+/, (req, res) => {
        res.sendFile(path.join(distPath, 'index.html'));
    });
}

app.listen(PORT, () => {
    console.log(`AzoresToyou Server v1.0.1 running at port ${PORT}`);
    console.log(`API Base URL: https://azorestoyou-1.onrender.com`);
    
    // Sincronizar utilizadores no arranque para garantir logins
    const db = readDB();
    syncBusinessUsers(db);
    writeDB(db);
    console.log("✅ Utilizadores de negócio sincronizados com sucesso.");
});
