import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, 'db.json');

const MONGODB_URI = process.env.MONGODB_URI;
const IS_MONGODB = !!MONGODB_URI;

// Track actual connection state (not just env var presence)
let isMongoConnected = false;

// --- SCHEMA DEFINITION ---
const dbSchema = new mongoose.Schema({
    key: { type: String, unique: true },
    data: mongoose.Schema.Types.Mixed
}, { timestamps: true });

const DBModel = mongoose.models.Data || mongoose.model('Data', dbSchema);

export const connectDB = async () => {
    console.log("🔍 Checking Database Configuration...");
    if (IS_MONGODB) {
        try {
            console.log("🌐 Attempting to connect to MongoDB Atlas...");
            await mongoose.connect(MONGODB_URI, {
                serverSelectionTimeoutMS: 10000,
                socketTimeoutMS: 45000,
            });
            isMongoConnected = true;
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
            console.error("❌ DATABASE ERROR: MongoDB Connection Failed:", err.message);
            console.log("⚠️ Running in local JSON fallback mode.");
        }
    } else {
        console.log("📂 DATABASE STATUS: Using Local JSON Storage (db.json)");
        console.log("ℹ️ To enable permanent storage, add MONGODB_URI to Render environment variables.");
    }
};

// Export real connection status for /api/status endpoint
export const getDbStatus = () => ({
    storage: isMongoConnected ? 'MongoDB Atlas (Cloud)' : (IS_MONGODB ? 'MongoDB (Connecting...)' : 'Local JSON (Ephemeral)'),
    isMongo: isMongoConnected,
    timestamp: new Date().toISOString()
});

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

export const readDB = async () => {
    if (isMongoConnected) {
        try {
            const now = Date.now();
            if (memoryCache && (now - lastCacheTime < CACHE_TTL_MS)) {
                return memoryCache;
            }
            // .lean() returns plain JS object - much lighter on memory than Mongoose documents
            const doc = await DBModel.findOne({ key: 'master_db' }).lean();
            const data = doc ? { ...DEFAULT_DB, ...doc.data } : DEFAULT_DB;
            memoryCache = data;
            lastCacheTime = now;
            return data;
        } catch (err) {
            console.error("Error reading from MongoDB:", err.message);
            // Return cache if available, otherwise empty default
            return memoryCache || DEFAULT_DB;
        }
    } else if (IS_MONGODB) {
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
        try {
            // Write to MongoDB FIRST - only update cache if successful
            await DBModel.findOneAndUpdate(
                { key: 'master_db' },
                { data },
                { upsert: true, new: true }
            );
            // Only update cache after confirmed write
            memoryCache = data;
            lastCacheTime = Date.now();
            console.log("✅ Data persisted to MongoDB successfully.");
        } catch (err) {
            console.error("❌ CRITICAL: Failed to write to MongoDB:", err.message);
            // DO NOT update cache - throw error so caller knows the write failed
            throw new Error(`MongoDB write failed: ${err.message}`);
        }
    } else if (IS_MONGODB) {
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
