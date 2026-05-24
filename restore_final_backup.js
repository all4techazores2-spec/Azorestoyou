import fs from 'fs';
import path from 'path';
import { MongoClient } from 'mongodb';

const mongoURI = 'mongodb://all4techazores2_db_user:azorestoyou@ac-3pnfstw-shard-00-00.5bkexpa.mongodb.net:27017,ac-3pnfstw-shard-00-01.5bkexpa.mongodb.net:27017,ac-3pnfstw-shard-00-02.5bkexpa.mongodb.net:27017/master_db?ssl=true&replicaSet=atlas-tidfjh-shard-0&authSource=admin&appName=Cluster0';

async function restoreBackup() {
  let client;
  try {
    const finalBackupPath = path.join(process.cwd(), 'backups', 'final1.0', 'db.json');

    console.log(`\n⏳ A iniciar restauro total do backup FINAL 1.0...`);

    if (fs.existsSync(finalBackupPath)) {
      console.log(`  🌐 A ligar ao MongoDB Atlas via Driver Nativo...`);
      client = new MongoClient(mongoURI, {
        serverSelectionTimeoutMS: 10000,
        connectTimeoutMS: 10000
      });
      await client.connect();
      console.log(`  ✅ Ligação ao MongoDB Atlas estabelecida.`);

      const db = client.db('master_db');
      const collection = db.collection('datas');

      const finalBackupContent = JSON.parse(fs.readFileSync(finalBackupPath, 'utf8'));

      console.log(`  🌐 A gravar dados no MongoDB Atlas (sobrescrevendo TUDO com a versão final1.0)...`);
      const result = await collection.updateOne(
        { key: 'master_db' },
        { $set: { data: finalBackupContent } },
        { upsert: true }
      );

      console.log(`  ✅ Base de dados MongoDB Atlas restaurada com sucesso!`);
      console.log(`     Matched: ${result.matchedCount}, Modified: ${result.modifiedCount}, UpsertedId: ${result.upsertedId || 'N/A'}`);
    } else {
      console.error(`  ❌ Ficheiro db.json não encontrado em: ${finalBackupPath}`);
      process.exit(1);
    }

    console.log('\n🎉 Processo de restauro concluído com sucesso total!\n');
    process.exit(0);
  } catch (err) {
    console.error('\n❌ ERRO NO PROCESSO DE RESTAURO:', err.message);
    process.exit(1);
  } finally {
    if (client) {
      await client.close();
    }
  }
}

restoreBackup();
