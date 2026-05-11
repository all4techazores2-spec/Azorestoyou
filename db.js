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
                maxPoolSize: 10,
                minPoolSize: 2,
                connectTimeoutMS: 30000,
                socketTimeoutMS: 45000,
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
            if (activeFetchPromise) {
                return await activeFetchPromise;
            }
            
            // Start a new fetch and lock it
            activeFetchPromise = (async () => {
                // .lean() returns plain JS object - much lighter on memory than Mongoose documents
                const doc = await DBModel.findOne({ key: 'master_db' }).lean();
                const data = doc ? { ...DEFAULT_DB, ...doc.data } : DEFAULT_DB;
                memoryCache = data;
                lastCacheTime = Date.now();
                return data;
            })();
            
            const result = await activeFetchPromise;
            activeFetchPromise = null; // Clear lock after success
            return result;
        } catch (err) {
            activeFetchPromise = null; // Clear lock on error
            console.error("Error reading from MongoDB:", err.message);
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

export const updateCollection = async (key, data) => {
    if (isMongoConnected) {
        try {
            console.log(`🔄 [DB] Sincronizando apenas a coleção: ${key} (${data.length} itens)...`);
            
            const updateObj = {};
            updateObj[`data.${key}`] = data;
            
            // Tenta atualização atómica ($set) para performance
            const result = await DBModel.findOneAndUpdate(
                { key: 'master_db' },
                { $set: updateObj },
                { upsert: true, new: true, maxTimeMS: 30000 }
            );
            
            if (!result) {
                throw new Error("Falha ao encontrar ou criar o documento master_db");
            }

            if (memoryCache) {
                memoryCache[key] = data;
                lastCacheTime = Date.now();
            }
            
            console.log(`✅ [DB] Coleção ${key} atualizada com sucesso via $set.`);
            return { success: true, count: data.length };
        } catch (err) {
            console.error(`❌ [DB] Erro na atualização atómica de ${key}:`, err.message);
            
            // FALLBACK: Se o $set falhar, tenta gravar o DB completo para não perder dados
            console.log(`⚠️ [DB] Tentando fallback para gravação completa para ${key}...`);
            try {
                const fullDB = await readDB();
                fullDB[key] = data;
                await writeDB(fullDB);
                console.log(`✅ [DB] Fallback concluído com sucesso para ${key}.`);
                return { success: true, count: data.length, fallback: true };
            } catch (fallbackErr) {
                console.error(`🚨 [DB] Falha crítica no fallback de ${key}:`, fallbackErr.message);
                throw fallbackErr;
            }
        }
    } else {
        const db = await readDB();
        db[key] = data;
        await writeDB(db);
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
