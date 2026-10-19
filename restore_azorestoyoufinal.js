import fs from 'fs';
import path from 'path';
import { MongoClient } from 'mongodb';

const mongoURI = 'mongodb://all4techazores2_db_user:azorestoyou@ac-3pnfstw-shard-00-00.5bkexpa.mongodb.net:27017,ac-3pnfstw-shard-00-01.5bkexpa.mongodb.net:27017,ac-3pnfstw-shard-00-02.5bkexpa.mongodb.net:27017/master_db?ssl=true&replicaSet=atlas-tidfjh-shard-0&authSource=admin&appName=Cluster0';

async function restoreAzoresToYouFinal() {
  let client;
  try {
    const backupDbPath = path.join(process.cwd(), 'backups', 'azorestoyoufinal', 'db.json');
    console.log('\n⏳ A restaurar dados do backup azorestoyoufinal...');
    if (!fs.existsSync(backupDbPath)) {
      console.error('❌ Ficheiro db.json não encontrado em: ' + backupDbPath);
      process.exit(1);
    }
    const data = JSON.parse(fs.readFileSync(backupDbPath, 'utf8'));
    console.log('🌐 Ligando ao MongoDB Atlas...');
    client = new MongoClient(mongoURI, { serverSelectionTimeoutMS: 15000 });
    await client.connect();
    console.log('✅ Conexão estabelecida.');
    const db = client.db('master_db');
    const collection = db.collection('datas');
    console.log('💾 Gravando dados no MongoDB Atlas (master_db.datas)...');
    const result = await collection.updateOne(
      { key: 'master_db' },
      { $set: { data: data } },
      { upsert: true }
    );
    console.log('✅ Base de dados restaurada com sucesso!');
    console.log('   Matched: ' + result.matchedCount + ', Modified: ' + result.modifiedCount);
    process.exit(0);
  } catch (err) {
    console.error('❌ Erro no restauro:', err.message);
    process.exit(1);
  } finally {
    if (client) await client.close();
  }
}

restoreAzoresToYouFinal();
