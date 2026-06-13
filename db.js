// Force fresh deploy trigger to Render
import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, 'db.json');

// Helper to get URI safely
const getMongoURI = () => process.env.MONGODB_URI;

// Track actual connection state
let isMongoConnected = false;
let mongoError = null;

// --- SCHEMA DEFINITION ---
const dbSchema = new mongoose.Schema({
    key: { type: String, unique: true },
    data: mongoose.Schema.Types.Mixed
}, { timestamps: true });

const DBModel = mongoose.models.Data || mongoose.model('Data', dbSchema);

export const connectDB = async () => {
    // GUARD: Se já está ligado, não reconectar
    if (mongoose.connection.readyState === 1) {
        return;
    }
    const uri = getMongoURI();
    console.log("🔍 Checking Database Configuration...");
    if (uri) {
        const attempt = async (triesLeft) => {
            try {
                console.log(`🌐 Connecting to MongoDB Atlas... (tentativas restantes: ${triesLeft})`);
                await mongoose.connect(uri, {
                    maxPoolSize: 10,
                    minPoolSize: 1,
                    connectTimeoutMS: 30000,
                    socketTimeoutMS: 60000,
                    serverSelectionTimeoutMS: 30000, // 30s - tempo suficiente para Atlas acordar
                    heartbeatFrequencyMS: 30000,
                    retryWrites: true,
                    w: 'majority',
                });
                isMongoConnected = true;
                mongoError = null;
                console.log("✅ DATABASE STATUS: Connected to MongoDB Atlas");

                // Warmup query to wake up the cluster and Mongoose caches
                (async () => {
                    try {
                        console.log("🔥 Running Database Warmup Query...");
                        await DBModel.findOne({ key: 'master_db' }).lean().maxTimeMS(60000);
                        console.log("🔥 Database Warmup completed successfully!");
                    } catch (wErr) {
                        console.warn("⚠️ Warmup query warning:", wErr.message);
                    }
                })();

                mongoose.connection.on('disconnected', () => {
                    isMongoConnected = false;
                    console.warn("⚠️ MongoDB disconnected. A reconectar em 10s...");
                    setTimeout(() => connectDB(), 10000);
                });
                mongoose.connection.on('reconnected', () => {
                    isMongoConnected = true;
                    console.log("✅ MongoDB reconnected.");
                });
                mongoose.connection.on('error', (err) => {
                    mongoError = err.message;
                    console.error("❌ MongoDB connection error:", err.message);
                });

            } catch (err) {
                isMongoConnected = false;
                mongoError = err.message;
                console.error(`❌ Atlas connection failed: ${err.message}`);
                if (triesLeft > 1) {
                    console.log(`🔄 A tentar novamente em 10 segundos...`);
                    setTimeout(() => attempt(triesLeft - 1), 10000);
                } else {
                    console.log("⚠️ Todas as tentativas falharam. A usar JSON local.");
                }
            }
        };
        attempt(3); // 3 tentativas com 10s de intervalo
    } else {
        mongoError = "No MONGODB_URI found in environment variables.";
        console.log("📂 DATABASE STATUS: Using Local JSON Storage (db.json)");
    }
};

export const getDbStatus = () => {
    const conn = mongoose.connection;
    let mongoHost = null;
    if (isMongoConnected && conn) {
        if (conn.host) {
            mongoHost = conn.host;
        } else if (conn.client && conn.client.s && conn.client.s.options && conn.client.s.options.hosts) {
            mongoHost = conn.client.s.options.hosts.map(h => `${h.host}:${h.port}`).join(',');
        } else if (conn.client && conn.client.s && conn.client.s.url) {
            mongoHost = conn.client.s.url.replace(/mongodb(\+srv)?:\/\/[^@]+@/, '').split('/')[0];
        }
    }
    return {
        storage: isMongoConnected ? 'MongoDB Atlas (Cloud)' : 'Local JSON File (Temporário)',
        dbName: isMongoConnected && conn ? conn.name : null,
        dbHost: mongoHost,
        isMongo: isMongoConnected,
        isConfigured: !!getMongoURI(),
        uriFound: !!getMongoURI(),
        error: mongoError,
        timestamp: new Date().toISOString()
    };
};

// Export real connection status for /api/status endpoint

const DEFAULT_DB = { 
    restaurants: [], flights: [], hotels: [], cars: [], 
    activities: [], busSchedules: [], itineraries: [], 
    shops: [], beauty: [], services: [], offices: [], 
    animals: [], real_estate: [], gyms: [], stands: [],
    auto_repairs: [], auto_electronics: [], used_market: [],
    it_services: [], perfumes: [], bars: [], events: [], municipal: [], users: [], posts: [],
    marketplace_ads: [],
    hotel_room_qr_codes: [],
    hotel_room_requests: [],
    sales: []
};

// In-memory cache to prevent OOM from 19 parallel requests
let memoryCache = null;
let lastCacheTime = 0;
const CACHE_TTL_MS = 30000; // 30 segundos - reduz drasticamente os pedidos ao Atlas

// Lock for preventing Cache Stampedes (Thundering Herd problem)
let activeFetchPromise = null;

export const readDB = async (bypassCache = false) => {
    if (isMongoConnected) {
        try {
            const now = Date.now();
            if (!bypassCache && memoryCache && (now - lastCacheTime < CACHE_TTL_MS)) {
                return memoryCache;
            }
            
            // Se já há um pedido em curso para a base de dados, reutiliza a Promise para evitar Thundering Herd
            if (activeFetchPromise) {
                return await activeFetchPromise;
            }
            
            // Start a new fetch and lock it with retry logic
            activeFetchPromise = (async () => {
                let retries = 3;
                while (retries > 0) {
                    try {
                        // .lean() returns plain JS object - much lighter on memory than Mongoose documents
                        const doc = await DBModel.findOne({ key: 'master_db' }).lean().maxTimeMS(60000);
                        const data = doc ? { ...DEFAULT_DB, ...doc.data } : DEFAULT_DB;
                        memoryCache = data;
                        lastCacheTime = Date.now();
                        return data;
                    } catch (err) {
                        retries--;
                        console.error(`⚠️ ReadDB Retry (${3-retries}/3):`, err.message);
                        if (retries === 0) throw err;
                        await new Promise(resolve => setTimeout(resolve, 2000));
                    }
                }
                return DEFAULT_DB;
            })();
            
            const result = await activeFetchPromise;
            activeFetchPromise = null; // Clear lock after success
            return result;
        } catch (err) {
            activeFetchPromise = null; // Clear lock on error
            console.error("❌ CRITICAL DATABASE READ ERROR:", err.message);
            // Return cache if available, otherwise empty default
            return memoryCache || DEFAULT_DB;
        }
    } else if (getMongoURI()) {
        // MongoDB URI exists but not yet connected - return cache or fallback to local JSON
        if (memoryCache) return memoryCache;
        try {
            if (fs.existsSync(dbPath)) {
                const data = fs.readFileSync(dbPath, 'utf8');
                memoryCache = { ...DEFAULT_DB, ...JSON.parse(data) };
                return memoryCache;
            }
        } catch (err) {
            console.error("⚠️ Fallback local JSON read failed:", err.message);
        }
        return DEFAULT_DB;
    } else {
        // Local JSON fallback
        if (memoryCache) return memoryCache;
        try {
            if (!fs.existsSync(dbPath)) return DEFAULT_DB;
            const data = fs.readFileSync(dbPath, 'utf8');
            memoryCache = { ...DEFAULT_DB, ...JSON.parse(data) };
            return memoryCache;
        } catch (err) {
            console.error("Error reading db.json:", err);
            return DEFAULT_DB;
        }
    }
};

export const writeDB = async (data) => {
    // 1. Gravar SEMPRE localmente no db.json para manter o espelhamento
    try {
        fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
        memoryCache = data;
        lastCacheTime = Date.now();
        console.log("📂 Local db.json mirror written successfully.");
    } catch (err) {
        console.error("❌ Error writing local db.json mirror:", err.message);
    }

    // 2. Se o MongoDB estiver configurado e ligado, persistir na Cloud
    if (isMongoConnected) {
        let retries = 3;
        while (retries > 0) {
            try {
                // Bypass Mongoose casting/validation for massive JSON object to fix 30-second hang
                await DBModel.collection.updateOne(
                    { key: 'master_db' },
                    { $set: { data, updatedAt: new Date() }, $setOnInsert: { createdAt: new Date() } },
                    { upsert: true }
                );
                console.log("✅ Data persisted to MongoDB successfully (Cloud mirrored).");
                return;
            } catch (err) {
                retries--;
                console.error(`❌ PERSISTENCE ERROR (Retries left: ${retries}):`, err.message);
                if (retries === 0) {
                    console.warn("⚠️ Cloud write failed after all retries. Local POS remains operational with local db.json.");
                } else {
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }
            }
        }
    } else {
        console.warn("⚠️ MongoDB not connected. Working in Local JSON Mode (db.json).");
    }
};

export const publishLocalToCloud = async () => {
    try {
        console.log("☁️ Preparing manual publish to MongoDB Cloud...");
        // 1. Ler os dados locais mais recentes
        if (!fs.existsSync(dbPath)) {
            throw new Error("Local database file (db.json) not found.");
        }
        const dataStr = fs.readFileSync(dbPath, 'utf8');
        const localData = JSON.parse(dataStr);

        // 2. Garantir ligação ao MongoDB Atlas
        if (mongoose.connection.readyState !== 1) {
            console.log("🔄 MongoDB not connected. Attempting reconnection...");
            const uri = getMongoURI();
            if (!uri) throw new Error("No MONGODB_URI configured.");
            await mongoose.connect(uri, {
                connectTimeoutMS: 30000,
                socketTimeoutMS: 60000,
                serverSelectionTimeoutMS: 30000,
            });
            isMongoConnected = true;
            mongoError = null;
        }

        // 3. Forçar gravação direta
        await DBModel.collection.updateOne(
            { key: 'master_db' },
            { $set: { data: localData, updatedAt: new Date() }, $setOnInsert: { createdAt: new Date() } },
            { upsert: true }
        );
        
        isMongoConnected = true;
        mongoError = null;
        console.log("✅ Manual publish completed! MongoDB Cloud is fully updated.");
        return { success: true, timestamp: new Date().toISOString() };
    } catch (err) {
        console.error("❌ Manual publish to Cloud failed:", err.message);
        throw err;
    }
};

export const updateCollection = async (key, data, mode = 'overwrite') => {
    try {
        // NÃO chamar connectDB() aqui - a ligação é feita UMA VEZ no arranque do servidor
        
        if (mode === 'merge' && isMongoConnected) {
            console.log(`Merge inteligente na coleção '${key}'...`);
            const db = await readDB();
            const existing = db[key] || [];
            const incoming = Array.isArray(data) ? data : [data];
            
            // Merge logic: Update existing IDs, add new ones
            const merged = [...existing];
            incoming.forEach(item => {
                const normalizedItem = normalizeTrailData(item);
                const idx = merged.findIndex(m => m.id === normalizedItem.id);
                if (idx !== -1) {
                    merged[idx] = { ...merged[idx], ...normalizedItem };
                } else {
                    merged.push(normalizedItem);
                }
            });
            
            const result = await DBModel.collection.updateOne(
                { key: 'master_db' },
                { $set: { [`data.${key}`]: merged, updatedAt: new Date() }, $setOnInsert: { createdAt: new Date() } },
                { upsert: true }
            );
            if (result) {
                if (memoryCache) { memoryCache[key] = merged; lastCacheTime = Date.now(); }
                return { success: true, count: incoming.length };
            }
        }

        if (isMongoConnected) {
            const normalizedData = Array.isArray(data) ? data.map(normalizeTrailData) : data;
            const result = await DBModel.collection.updateOne(
                { key: 'master_db' },
                { $set: { [`data.${key}`]: normalizedData, updatedAt: new Date() }, $setOnInsert: { createdAt: new Date() } },
                { upsert: true }
            );

            if (result) {
                console.log(`✅ Coleção '${key}' sincronizada com MongoDB.`);
                if (memoryCache) { memoryCache[key] = data; lastCacheTime = Date.now(); }
                return { success: true };
            }
        } else {
            // Local persistence fallback
            const db = await readDB();
            db[key] = data;
            fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
            memoryCache = db;
            lastCacheTime = Date.now();
            console.log(`📂 Coleção '${key}' gravada localmente (db.json).`);
            return { success: true };
        }
    } catch (err) {
        console.error(`❌ Erro na sincronização de '${key}':`, err.message);
        throw err;
    }
};

export const resetDB = async () => {
    if (isMongoConnected) {
        await DBModel.findOneAndUpdate(
            { key: 'master_db' },
            { data: DEFAULT_DB },
            { upsert: true }
        );
    } else {
        fs.writeFileSync(dbPath, JSON.stringify(DEFAULT_DB, null, 2));
    }
    memoryCache = DEFAULT_DB;
    lastCacheTime = Date.now();
    console.log("🧨 Database RESET executed.");
};

// --- DATA NORMALIZATION HELPERS ---

export const normalizeRestaurantData = (item) => {
    // Apenas aplica se for restaurante (identificado por businessType === 'restaurant' ou ID que começa com R)
    if (item && (item.businessType === 'restaurant' || (item.id && (item.id.startsWith('R') || item.id === 'R_2020')))) {
        // 1. Credenciais administrativas por omissão
        const adminEmail = item.adminEmail || `${item.id.toLowerCase()}@azores4you.com`;
        const adminPassword = item.adminPassword || 'admin';

        // 2. Mapa de 12 mesas estruturado e limpo
        let tables = item.tables;
        if (!tables || !Array.isArray(tables) || tables.length < 12) {
            tables = [
                { id: "T1", number: 1, seats: 1 },
                { id: "T2", number: 2, seats: 1 },
                { id: "T3", number: 3, seats: 2 },
                { id: "T4", number: 4, seats: 6 },
                { id: "T5", number: 5, seats: 2 },
                { id: "T6", number: 6, seats: 4 },
                { id: "T7", number: 7, seats: 4, area: "Explanada", x: 100, y: 100 },
                { id: "T8", number: 8, seats: 4, area: "Explanada", x: 100, y: 100 },
                { id: "T9", number: 9, seats: 4, area: "Explanada", x: 100, y: 100 },
                { id: "T10", number: 10, seats: 4, area: "Explanada", x: 100, y: 100 },
                { id: "T11", number: 11, seats: 4, area: "Explanada", x: 100, y: 100 },
                { id: "T12", number: 12, seats: 4, area: "Explanada", x: 100, y: 100 }
            ].map(t => ({
                ...t,
                status: "available",
                alertStatus: "none",
                currentTab: [],
                pendingOrderItems: [],
                currentOrder: null,
                customerName: null,
                reservationTime: null,
                occupiedBy: null,
                occupiedSince: null
            }));
        } else {
            // Garantir que as mesas existentes têm os campos dinâmicos inicializados
            tables = tables.map(t => ({
                status: "available",
                alertStatus: "none",
                currentTab: [],
                pendingOrderItems: [],
                currentOrder: null,
                customerName: null,
                reservationTime: null,
                occupiedBy: null,
                occupiedSince: null,
                ...t
            }));
        }

        // 3. Catálogo de pratos de menu (dishes) por omissão
        let dishes = item.dishes;
        if (!dishes || !Array.isArray(dishes) || dishes.length === 0) {
            dishes = [
                { id: `P_${item.id}_bife`, name: "Bife da Casa", price: 18, category: "Pratos", image: "/imagens/restaurantes/default.jpg", description: "Especialidade regional recomendada" },
                { id: `P_${item.id}_polvo`, name: "Polvo à Lagareiro", price: 22, category: "Pratos", image: "/imagens/restaurantes/default.jpg", description: "Especialidade regional recomendada" },
                { id: `P_${item.id}_mousse`, name: "Mousse de Chocolate", price: 4, category: "Sobremesas", image: "/imagens/restaurantes/default.jpg" },
                { id: `P_${item.id}_pudim`, name: "Pudim Caseiro", price: 4.5, image: "/imagens/restaurantes/default.jpg", category: "Sobremesas" }
            ];
        }

        // 4. Catálogo de stock interno (products) por omissão
        let products = item.products;
        if (!products || !Array.isArray(products) || products.length === 0) {
            products = [
                { id: `P_${item.id}_bife`, name: "Bife da Casa", price: 18, category: "Pratos", stock: 10, minStock: 5, image: "/imagens/restaurantes/default.jpg" },
                { id: `P_${item.id}_polvo`, name: "Polvo à Lagareiro", price: 22, category: "Pratos", stock: 10, minStock: 5, image: "/imagens/restaurantes/default.jpg" },
                { id: `P_${item.id}_superbock`, name: "Superbock", price: 1.8, category: "Bebidas", stock: 24, minStock: 5, image: "/imagens/default.jpg", inMenu: false },
                { id: `P_${item.id}_cocacola`, name: "Coca-Cola", price: 2, category: "Bebidas", stock: 24, minStock: 5, image: "/imagens/default.jpg", inMenu: false },
                { id: `P_${item.id}_cafe`, name: "Café", price: 0.6, category: "Cafetaria", stock: 50, minStock: 10, image: "/imagens/default.jpg" },
                { id: `P_${item.id}_cha`, name: "Chá", price: 1.2, category: "Cafetaria", stock: 30, minStock: 5, image: "/imagens/default.jpg", inMenu: false },
                { id: `P_${item.id}_pudim`, name: "Pudim Caseiro", price: 4.5, category: "Sobremesas", stock: 10, minStock: 2, image: "/imagens/default.jpg", inMenu: true },
                { id: `P_${item.id}_mousse`, name: "Mousse de Chocolate", price: 4, category: "Sobremesas", stock: 10, minStock: 2, image: "/imagens/default.jpg", inMenu: true }
            ];
        }

        // 5. Staff por omissão para POS
        let staff = item.staff;
        if (!staff || !Array.isArray(staff) || staff.length === 0) {
            staff = [
                { id: `STF_${item.id}_1`, name: "Chefe de Cozinha", email: `chef@${item.id.toLowerCase()}.pt`, password: "admin", role: "waiter", onDuty: true },
                { id: `STF_${item.id}_2`, name: "Empregado de Mesa", email: `waiter@${item.id.toLowerCase()}.pt`, password: "admin", role: "waiter", onDuty: true },
                { id: `STF_${item.id}_3`, name: "Gerente", email: `manager@${item.id.toLowerCase()}.pt`, password: "admin", role: "waiter", onDuty: true }
            ];
        }

        return {
            ...item,
            adminEmail,
            adminPassword,
            tables,
            dishes,
            products,
            staff,
            reservations: item.reservations || [],
            kitchenOrders: item.kitchenOrders || [],
            fiadoClients: item.fiadoClients || [],
            cashDrawerLogs: item.cashDrawerLogs || [],
            isDrawerOpen: item.isDrawerOpen || false,
            currentDrawerAmount: item.currentDrawerAmount || 0,
            businessType: 'restaurant'
        };
    }
    return item;
};

export const normalizeItemData = (item) => {
    let normalized = item;
    if (normalized && (normalized.type === 'trail' || normalized.type === 'poi')) {
        normalized = {
            ...normalized,
            climaSimulado: normalized.climaSimulado || { condicao: "Céu Limpo", temperatura: 20 },
            pontosInteresse: Array.isArray(normalized.pontosInteresse) ? normalized.pontosInteresse : []
        };
    }
    normalized = normalizeRestaurantData(normalized);
    return normalized;
};

/**
 * Ensures advanced trail/restaurant fields are preserved and correctly structured.
 * Maintained under original name for full compatibility with server.js imports.
 */
export const normalizeTrailData = (item) => {
    return normalizeItemData(item);
};

