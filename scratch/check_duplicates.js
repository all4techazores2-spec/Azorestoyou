
import mongoose from 'mongoose';
import 'dotenv/config';

const dbSchema = new mongoose.Schema({
    key: { type: String, unique: true },
    data: mongoose.Schema.Types.Mixed
}, { timestamps: true });

const DBModel = mongoose.models.Data || mongoose.model('Data', dbSchema);

async function checkDuplicates() {
    try {
        const uri = process.env.MONGODB_URI;
        if (!uri) {
            console.error("❌ MONGODB_URI não encontrada no .env");
            process.exit(1);
        }

        await mongoose.connect(uri);
        console.log("✅ Ligado ao Atlas para verificação de duplicados...");

        const doc = await DBModel.findOne({ key: 'master_db' });
        if (!doc) {
            console.log("❌ Documento master_db não encontrado.");
            process.exit(0);
        }

        const data = doc.data;
        const report = {};
        let totalDuplicates = 0;

        for (const category in data) {
            if (Array.isArray(data[category])) {
                const seenIds = new Set();
                const duplicates = [];
                
                data[category].forEach(item => {
                    const id = item.id || item._id;
                    if (id) {
                        if (seenIds.has(id)) {
                            duplicates.push({ id, name: item.name || item.title || 'Sem nome' });
                        } else {
                            seenIds.add(id);
                        }
                    }
                });

                if (duplicates.length > 0) {
                    report[category] = duplicates;
                    totalDuplicates += duplicates.length;
                }
            }
        }

        if (totalDuplicates === 0) {
            console.log("✅ Não foram encontrados IDs duplicados no Atlas! Tudo limpo.");
        } else {
            console.log(`⚠️ Foram encontrados ${totalDuplicates} IDs duplicados:`);
            console.log(JSON.stringify(report, null, 2));
        }

        process.exit(0);
    } catch (err) {
        console.error("❌ Erro durante a verificação:", err);
        process.exit(1);
    }
}

checkDuplicates();
