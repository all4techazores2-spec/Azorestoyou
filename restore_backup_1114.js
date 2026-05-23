import fs from 'fs';
import path from 'path';
import { MongoClient } from 'mongodb';

const mongoURI = 'mongodb://all4techazores2_db_user:azorestoyou@ac-3pnfstw-shard-00-00.5bkexpa.mongodb.net:27017,ac-3pnfstw-shard-00-01.5bkexpa.mongodb.net:27017,ac-3pnfstw-shard-00-02.5bkexpa.mongodb.net:27017/master_db?ssl=true&replicaSet=atlas-tidfjh-shard-0&authSource=admin&appName=Cluster0';

async function restoreBackup() {
  let client;
  try {
    const timestamp = '2026-05-23T11-14-17-546Z';
    const localBackupFile = `local_db_backup_${timestamp}.json`;
    const cloudBackupFile = `cloud_db_backup_${timestamp}.json`;

    const localBackupPath = path.join(process.cwd(), 'backups', localBackupFile);
    const cloudBackupPath = path.join(process.cwd(), 'backups', cloudBackupFile);
    const targetLocalDbPath = path.join(process.cwd(), 'db.json');

    console.log(`\n⏳ A iniciar restauro nativo dos backups de 11:14:17 (timestamp: ${timestamp})...`);

    // 1. Restauro da base de dados local db.json
    if (fs.existsSync(localBackupPath)) {
      console.log(`  💾 A restaurar base de dados local:`);
      console.log(`    Desde: ${localBackupPath}`);
      console.log(`    Para:  ${targetLocalDbPath}`);
      fs.copyFileSync(localBackupPath, targetLocalDbPath);
      console.log(`  ✅ Base de dados local restaurada com sucesso!`);
    } else {
      console.error(`  ❌ Ficheiro de backup local não encontrado em: ${localBackupPath}`);
    }

    // 2. Restauro da base de dados da Nuvem (MongoDB Atlas)
    if (fs.existsSync(cloudBackupPath)) {
      console.log(`  🌐 A ligar ao MongoDB Atlas via Driver Nativo...`);
      client = new MongoClient(mongoURI, {
        serverSelectionTimeoutMS: 10000,
        connectTimeoutMS: 10000
      });
      await client.connect();
      console.log(`  ✅ Ligação ao MongoDB Atlas estabelecida.`);

      const db = client.db('master_db');
      const collection = db.collection('datas');

      const cloudBackupContent = JSON.parse(fs.readFileSync(cloudBackupPath, 'utf8'));

      console.log(`  🌐 A gravar dados de 383 KB no MongoDB Atlas...`);
      const result = await collection.updateOne(
        { key: 'master_db' },
        { $set: { data: cloudBackupContent } },
        { upsert: true }
      );

      console.log(`  ✅ Base de dados MongoDB Atlas restaurada com sucesso!`);
      console.log(`     Matched: ${result.matchedCount}, Modified: ${result.modifiedCount}, UpsertedId: ${result.upsertedId || 'N/A'}`);
    } else {
      console.error(`  ❌ Ficheiro de backup da nuvem não encontrado em: ${cloudBackupPath}`);
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
