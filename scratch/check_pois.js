import 'dotenv/config';
import mongoose from 'mongoose';

const uri = process.env.MONGODB_URI;
const dbSchema = new mongoose.Schema({ key: String, data: mongoose.Schema.Types.Mixed });
const DBModel = mongoose.model('Data', dbSchema);

async function check() {
    await mongoose.connect(uri);
    const doc = await DBModel.findOne({ key: 'master_db' });
    const activities = doc.data.activities || [];
    
    activities.forEach(act => {
        if (act.type === 'trail' && act.pontosInteresse && act.pontosInteresse.length > 0) {
            console.log(`Trail: ${act.title} (${act.id})`);
            act.pontosInteresse.forEach(p => {
                console.log(`  - POI: ${p.nome} (ID: ${p.id}) - Foto length: ${p.foto ? p.foto.length : 0}`);
                if (p.foto && p.foto.length < 50) {
                    console.log(`    Foto value: ${p.foto}`);
                }
            });
        }
    });
    process.exit(0);
}

check();
