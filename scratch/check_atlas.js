
import mongoose from 'mongoose';
import 'dotenv/config';

const dbSchema = new mongoose.Schema({
    key: { type: String, unique: true },
    data: mongoose.Schema.Types.Mixed
}, { timestamps: true });

const DBModel = mongoose.models.Data || mongoose.model('Data', dbSchema);

async function diagnostic() {
    try {
        const uri = process.env.MONGODB_URI;
        if (!uri) {
            console.error("❌ MONGODB_URI não encontrada.");
            process.exit(1);
        }

        await mongoose.connect(uri);
        console.log("✅ Ligado ao Atlas");

        const doc = await DBModel.findOne({ key: 'master_db' });
        if (!doc) {
            console.log("❌ master_db NÃO EXISTE no Atlas.");
        } else {
            const stats = {};
            for (const k in doc.data) {
                if (Array.isArray(doc.data[k])) {
                    stats[k] = doc.data[k].length;
                }
            }
            console.log("📊 Estatísticas do Atlas:", stats);
        }
        process.exit(0);
    } catch (err) {
        console.error("Erro:", err);
        process.exit(1);
    }
}

diagnostic();
