import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';

const mongoURI = 'mongodb://all4techazores2_db_user:azorestoyou@ac-3pnfstw-shard-00-00.5bkexpa.mongodb.net:27017,ac-3pnfstw-shard-00-01.5bkexpa.mongodb.net:27017,ac-3pnfstw-shard-00-02.5bkexpa.mongodb.net:27017/master_db?ssl=true&replicaSet=atlas-tidfjh-shard-0&authSource=admin&appName=Cluster0';

async function performBackup() {
  try {
    const localBackupDir = path.join(process.cwd(), 'backups');
    const desktopBackupDir = 'c:\\Users\\PC\\Desktop\\bakups';

    // Garantir que as pastas existem
    if (!fs.existsSync(localBackupDir)) {
      fs.mkdirSync(localBackupDir, { recursive: true });
    }
    if (!fs.existsSync(desktopBackupDir)) {
      fs.mkdirSync(desktopBackupDir, { recursive: true });
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    console.log(`\n⏳ A iniciar backup automático [${new Date().toLocaleString()}]...`);

    // 1. Backup do ficheiro local db.json
    const localDbPath = path.join(process.cwd(), 'db.json');
    if (fs.existsSync(localDbPath)) {
      const localBackupPath = path.join(localBackupDir, `local_db_backup_${timestamp}.json`);
      fs.copyFileSync(localDbPath, localBackupPath);
      
      const desktopLocalBackupPath = path.join(desktopBackupDir, `local_db_backup_${timestamp}.json`);
      fs.copyFileSync(localDbPath, desktopLocalBackupPath);
      
      console.log(`  💾 Backup local guardado em:`);
      console.log(`    -> Azores4you/backups/local_db_backup_${timestamp}.json`);
      console.log(`    -> C:\\Users\\PC\\Desktop\\bakups\\local_db_backup_${timestamp}.json`);
    } else {
      console.log('  ⚠️ Ficheiro db.json local não encontrado para backup.');
    }

    // 2. Backup da base de dados da Nuvem (MongoDB Atlas)
    console.log('  🌐 A ligar ao MongoDB Atlas para extrair backup da nuvem...');
    await mongoose.connect(mongoURI);
    
    const dbSchema = new mongoose.Schema({
      key: { type: String, unique: true },
      data: mongoose.Schema.Types.Mixed
    });

    const DBModel = mongoose.models.Data || mongoose.model('Data', dbSchema);
    const cloudRecord = await DBModel.findOne({ key: 'master_db' });

    if (cloudRecord && cloudRecord.data) {
      const localCloudBackupPath = path.join(localBackupDir, `cloud_db_backup_${timestamp}.json`);
      fs.writeFileSync(localCloudBackupPath, JSON.stringify(cloudRecord.data, null, 2), 'utf8');

      const desktopCloudBackupPath = path.join(desktopBackupDir, `cloud_db_backup_${timestamp}.json`);
      fs.writeFileSync(desktopCloudBackupPath, JSON.stringify(cloudRecord.data, null, 2), 'utf8');

      console.log(`  ✅ Backup do MongoDB Atlas guardado em:`);
      console.log(`    -> Azores4you/backups/cloud_db_backup_${timestamp}.json`);
      console.log(`    -> C:\\Users\\PC\\Desktop\\bakups\\cloud_db_backup_${timestamp}.json`);
    } else {
      console.log('  ⚠️ Não foi encontrado o registo master_db no Atlas para backup da nuvem.');
    }

    console.log('🎉 Backup automático concluído com sucesso total!\n');
    process.exit(0);
  } catch (err) {
    console.error('❌ ERRO NO BACKUP AUTOMÁTICO:', err.message);
    process.exit(0); // Não bloqueia o processo de build se o backup falhar (ex: sem net), mas avisa.
  }
}

performBackup();
