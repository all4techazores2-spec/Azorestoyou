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
    const uri = getMongoURI();
    console.log("🔍 Checking Database Configuration...");
    if (uri) {
        try {
            console.log("🌐 Attempting to connect to MongoDB Atlas...");
            await mongoose.connect(uri, {
                maxPoolSize: 50, // Aumentado para lidar com mais tráfego
                minPoolSize: 5,
                connectTimeoutMS: 120000, // 120 segundos (aguentar fotos grandes)
                socketTimeoutMS: 120000,
                serverSelectionTimeoutMS: 120000,
                heartbeatFrequencyMS: 10000,
            });
            isMongoConnected = true;
            mongoError = null;
            console.log("✅ DATABASE STATUS: Connected to MongoDB Atlas");

            // Listen for disconnection events
            mongoose.connection.on('disconnected', () => {
                isMongoConnected = false;
                console.warn("⚠️ MongoDB disconnected. Attempting to reconnect...");
            });
            mongoose.connection.on('reconnected', () => {
                isMongoConnected = true;
                console.log("✅ MongoDB reconnected.");
            });

        } catch (err) {
            isMongoConnected = false;
            mongoError = err.message;
            console.error("❌ DATABASE ERROR: MongoDB Connection Failed:", err.message);
            console.log("⚠️ Running in local JSON fallback mode.");
        }
    } else {
        mongoError = "No MONGODB_URI found in environment variables.";
        console.log("📂 DATABASE STATUS: Using Local JSON Storage (db.json)");
    }
};

export const getDbStatus = () => {
    return {
        storage: isMongoConnected ? 'MongoDB Atlas (Cloud)' : 'Local JSON File (Temporário)',
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
    it_services: [], perfumes: [], users: [], posts: [] 
};

// In-memory cache to prevent OOM from 19 parallel requests
let memoryCache = null;
let lastCacheTime = 0;
const CACHE_TTL_MS = 5000; // 5 seconds

// Lock for preventing Cache Stampedes (Thundering Herd problem)
let activeFetchPromise = null;

export const readDB = async () => {
    if (isMongoConnected) {
        try {
            const now = Date.now();
            if (memoryCache && (now - lastCacheTime < CACHE_TTL_MS)) {
                return memoryCache;
            }
            
            // If a fetch is already in progress, wait for it instead of firing another massive DB query
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
        // MongoDB URI exists but not yet connected - return cache or default
        return memoryCache || DEFAULT_DB;
    } else {
        // Local JSON fallback
        try {
            if (!fs.existsSync(dbPath)) return DEFAULT_DB;
            const data = fs.readFileSync(dbPath, 'utf8');
            return { ...DEFAULT_DB, ...JSON.parse(data) };
        } catch (err) {
            console.error("Error reading db.json:", err);
            return DEFAULT_DB;
        }
    }
};

export const writeDB = async (data) => {
    if (isMongoConnected) {
        let retries = 3;
        while (retries > 0) {
            try {
                await DBModel.findOneAndUpdate(
                    { key: 'master_db' },
                    { data },
                    { upsert: true, new: true, maxTimeMS: 30000 }
                );
                memoryCache = data;
                lastCacheTime = Date.now();
                console.log("✅ Data persisted to MongoDB successfully.");
                return;
            } catch (err) {
                retries--;
                console.error(`❌ PERSISTENCE ERROR (Retries left: ${retries}):`, err.message);
                if (retries === 0) {
                    throw new Error(`MongoDB write failed after multiple attempts: ${err.message}`);
                }
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }
    } else if (getMongoURI()) {
        console.error("❌ Cannot write: MongoDB is configured but not connected.");
        throw new Error("MongoDB not connected");
    } else {
        // Local JSON fallback
        try {
            fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
            memoryCache = data;
            lastCacheTime = Date.now();
        } catch (err) {
            console.error("Error writing db.json:", err);
            throw err;
        }
    }
};

export const updateCollection = async (key, data, mode = 'overwrite') => {
    try {
        await connectDB();
        
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
            
            const result = await DBModel.findOneAndUpdate(
                { key: 'master_db' },
                { $set: { [`data.${key}`]: merged } },
                { upsert: true, new: true, maxTimeMS: 60000 }
            );
            if (result) {
                if (memoryCache) { memoryCache[key] = merged; lastCacheTime = Date.now(); }
                return { success: true, count: incoming.length };
            }
        }

        // Default: Overwrite mode
        const normalizedData = Array.isArray(data) ? data.map(normalizeTrailData) : data;
            const result = await DBModel.findOneAndUpdate(
                { key: 'master_db' },
                { $set: { [`data.${key}`]: normalizedData } },
                { upsert: true, new: true, maxTimeMS: 120000 }
            );

        if (result) {
            console.log(`✅ Coleção '${key}' sincronizada com sucesso.`);
            if (memoryCache) { memoryCache[key] = data; lastCacheTime = Date.now(); }
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
/**
 * Ensures advanced trail fields are preserved and correctly structured.
 * Specifically handles 'climaSimulado' and 'pontosInteresse' for trails and POIs.
 */
export const normalizeTrailData = (item) => {
    if (item.type === 'trail' || item.type === 'poi') {
        return {
            ...item,
            climaSimulado: item.climaSimulado || { condicao: "Céu Limpo", temperatura: 20 },
            pontosInteresse: Array.isArray(item.pontosInteresse) ? item.pontosInteresse : []
        };
    }
    return item;
};
