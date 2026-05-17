import mongoose from 'mongoose';

const mongoURI = 'mongodb://all4techazores2_db_user:azorestoyou@ac-3pnfstw-shard-00-00.5bkexpa.mongodb.net:27017,ac-3pnfstw-shard-00-01.5bkexpa.mongodb.net:27017,ac-3pnfstw-shard-00-02.5bkexpa.mongodb.net:27017/master_db?ssl=true&replicaSet=atlas-tidfjh-shard-0&authSource=admin&appName=Cluster0';

const dbSchema = new mongoose.Schema({
    key: { type: String, unique: true },
    data: mongoose.Schema.Types.Mixed
}, { timestamps: true });

const DBModel = mongoose.models.Data || mongoose.model('Data', dbSchema);

async function checkAtlas() {
    try {
        console.log("🌐 A ligar ao MongoDB Atlas de Produção...");
        await mongoose.connect(mongoURI, {
            connectTimeoutMS: 30000,
            socketTimeoutMS: 60000,
            serverSelectionTimeoutMS: 30000,
        });
        console.log("✅ Ligado com sucesso ao Atlas!");

        console.log("🔍 A pesquisar pelo documento 'master_db'...");
        const doc = await DBModel.findOne({ key: 'master_db' }).lean();

        if (!doc) {
            console.log("❌ ERRO: O documento com a chave 'master_db' não existe na base de dados do Atlas!");
            process.exit(0);
        }

        console.log("✅ Documento 'master_db' encontrado!");
        console.log(`🕒 Última Atualização: ${doc.updatedAt || doc.createdAt || 'Desconhecida'}`);
        
        if (!doc.data) {
            console.log("⚠️ O campo 'data' está vazio ou inexistente!");
            process.exit(0);
        }

        console.log("\n📊 ESTATÍSTICAS DA BASE DE DADOS NA NUVEM (ATLAS):");
        Object.keys(doc.data).forEach(key => {
            const item = doc.data[key];
            if (Array.isArray(item)) {
                console.log(` - ${key}: ${item.length} itens`);
                if (item.length > 0) {
                    // Mostrar uma pequena amostra para sabermos o que é
                    const sampleNames = item.slice(0, 3).map(i => i.name || i.title || i.id || JSON.stringify(i));
                    console.log(`   └─ Exemplo: ${sampleNames.join(', ')}`);
                }
            } else {
                console.log(` - ${key}: ${typeof item}`);
            }
        });

        process.exit(0);
    } catch (err) {
        console.error("❌ ERRO AO ACEDER AO ATLAS:", err.message);
        process.exit(1);
    }
}

checkAtlas();
