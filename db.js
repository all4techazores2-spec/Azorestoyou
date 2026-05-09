import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, 'db.json');

const MONGODB_URI = process.env.MONGODB_URI;
const IS_MONGODB = !!MONGODB_URI;

// --- SCHEMA DEFINITION (Simplificada para o MongoDB) ---
const dbSchema = new mongoose.Schema({
    key: { type: String, unique: true },
    data: mongoose.Schema.Types.Mixed
}, { timestamps: true });

const DBModel = mongoose.models.Data || mongoose.model('Data', dbSchema);

export const connectDB = async () => {
    if (IS_MONGODB) {
        try {
            await mongoose.connect(MONGODB_URI);
            console.log("✅ Connected to MongoDB Atlas");
        } catch (err) {
            console.error("❌ MongoDB Connection Error:", err);
            process.exit(1);
        }
    } else {
        console.log("📂 Using Local JSON Storage (db.json)");
    }
};

const DEFAULT_DB = { 
    restaurants: [], flights: [], hotels: [], cars: [], 
    activities: [], busSchedules: [], itineraries: [], 
    shops: [], beauty: [], services: [], offices: [], 
    animals: [], real_estate: [], gyms: [], stands: [],
    auto_repairs: [], auto_electronics: [], used_market: [],
    it_services: [], perfumes: [], users: [], posts: [] 
};

export const readDB = async () => {
    if (IS_MONGODB) {
        try {
            const doc = await DBModel.findOne({ key: 'master_db' });
            return doc ? { ...DEFAULT_DB, ...doc.data } : DEFAULT_DB;
        } catch (err) {
            console.error("Error reading from MongoDB", err);
            return DEFAULT_DB;
        }
    } else {
        try {
            if (!fs.existsSync(dbPath)) return DEFAULT_DB;
            const data = fs.readFileSync(dbPath, 'utf8');
            return { ...DEFAULT_DB, ...JSON.parse(data) };
        } catch (err) {
            console.error("Error reading db.json", err);
            return DEFAULT_DB;
        }
    }
};

export const writeDB = async (data) => {
    if (IS_MONGODB) {
        try {
            await DBModel.findOneAndUpdate(
                { key: 'master_db' },
                { data },
                { upsert: true, new: true }
            );
        } catch (err) {
            console.error("Error writing to MongoDB", err);
        }
    } else {
        try {
            fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
        } catch (err) {
            console.error("Error writing db.json", err);
        }
    }
};
