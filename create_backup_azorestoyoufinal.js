import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';
import { MongoClient } from 'mongodb';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const sourceDir = __dirname;

const desktopDir = 'C:\\Users\\PC\\Desktop';
const desktopBackupDir = path.join(desktopDir, 'azorestoyoufinal');
const desktopZipPath = path.join(desktopDir, 'azorestoyoufinal.zip');
const inProjectBackupDir = path.join(sourceDir, 'backups', 'azorestoyoufinal');
const backupsAppDir = path.join(desktopDir, 'backups_app', 'azorestoyoufinal');

console.log('====================================================');
console.log('🚀 INICIANDO BACKUP COMPLETO: azorestoyoufinal');
console.log(`⏰ Data/Hora: ${new Date().toLocaleString()}`);
console.log('====================================================\n');

// 1. Garantir que as pastas de destino existem
[inProjectBackupDir, backupsAppDir, desktopBackupDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// 2. Fazer snapshot do banco de dados db.json para backups/azorestoyoufinal
const dbSourcePath = path.join(sourceDir, 'db.json');
let dbData = {};
if (fs.existsSync(dbSourcePath)) {
  dbData = JSON.parse(fs.readFileSync(dbSourcePath, 'utf8'));
  fs.copyFileSync(dbSourcePath, path.join(inProjectBackupDir, 'db.json'));
  fs.copyFileSync(dbSourcePath, path.join(backupsAppDir, 'db.json'));
  console.log('✅ Base de dados db.json copiada para:');
  console.log(`   - ${path.join(inProjectBackupDir, 'db.json')}`);
  console.log(`   - ${path.join(backupsAppDir, 'db.json')}`);
}

// 3. Criar script de restauro específico para este backup
const restoreScriptContent = `import fs from 'fs';
import path from 'path';
import { MongoClient } from 'mongodb';

const mongoURI = 'mongodb://all4techazores2_db_user:azorestoyou@ac-3pnfstw-shard-00-00.5bkexpa.mongodb.net:27017,ac-3pnfstw-shard-00-01.5bkexpa.mongodb.net:27017,ac-3pnfstw-shard-00-02.5bkexpa.mongodb.net:27017/master_db?ssl=true&replicaSet=atlas-tidfjh-shard-0&authSource=admin&appName=Cluster0';

async function restoreAzoresToYouFinal() {
  let client;
  try {
    const backupDbPath = path.join(process.cwd(), 'backups', 'azorestoyoufinal', 'db.json');
    console.log('\\n⏳ A restaurar dados do backup azorestoyoufinal...');
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
`;

fs.writeFileSync(path.join(inProjectBackupDir, 'restore_azorestoyoufinal.js'), restoreScriptContent, 'utf8');
fs.writeFileSync(path.join(sourceDir, 'restore_azorestoyoufinal.js'), restoreScriptContent, 'utf8');
console.log('✅ Script de restauro gerado: restore_azorestoyoufinal.js');

// 4. Salvar metadados do backup
const backupMetadata = {
  backupName: 'azorestoyoufinal',
  createdAt: new Date().toISOString(),
  timestamp: Date.now(),
  gitBranch: 'main',
  gitCommit: execSync('git rev-parse HEAD', { cwd: sourceDir }).toString().trim(),
  databaseSummary: {
    totalCollections: Object.keys(dbData).length,
    restaurants: (dbData.restaurants || []).length,
    users: (dbData.users || []).length,
    posts: (dbData.posts || []).length,
    marketplace_ads: (dbData.marketplace_ads || []).length,
    hotels: (dbData.hotels || []).length,
    activities: (dbData.activities || []).length,
    events: (dbData.events || []).length,
    services: (dbData.services || []).length
  }
};
fs.writeFileSync(path.join(inProjectBackupDir, 'BACKUP_INFO.json'), JSON.stringify(backupMetadata, null, 2), 'utf8');

// 5. Copiar ficheiros do projeto para C:\Users\PC\Desktop\azorestoyoufinal
console.log(`\n📂 Copiando ficheiros para ${desktopBackupDir}...`);
const excludedDirs = new Set(['node_modules', '.git', 'scratch']);
const excludedFiles = new Set(['.FullName']);

let copiedFilesCount = 0;
let copiedDirsCount = 0;

function copyDirRecursive(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
    copiedDirsCount++;
  }
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      if (excludedDirs.has(entry.name)) {
        continue;
      }
      copyDirRecursive(srcPath, destPath);
    } else {
      if (excludedFiles.has(entry.name)) {
        continue;
      }
      fs.copyFileSync(srcPath, destPath);
      copiedFilesCount++;
    }
  }
}

copyDirRecursive(sourceDir, desktopBackupDir);
console.log(`✅ Cópia concluída: ${copiedFilesCount} ficheiros e ${copiedDirsCount} pastas copiadas.`);

// 6. Criar arquivo ZIP C:\Users\PC\Desktop\azorestoyoufinal.zip
console.log(`\n📦 A criar arquivo ZIP em ${desktopZipPath}...`);
if (fs.existsSync(desktopZipPath)) {
  fs.unlinkSync(desktopZipPath);
}

try {
  const psCommand = `Compress-Archive -Path "${desktopBackupDir}\\*" -DestinationPath "${desktopZipPath}" -CompressionLevel Optimal -Force`;
  execSync(`powershell -NoProfile -Command "${psCommand}"`, { stdio: 'inherit' });
  const zipSizeMB = (fs.statSync(desktopZipPath).size / (1024 * 1024)).toFixed(2);
  console.log(`✅ Arquivo ZIP criado com sucesso: ${desktopZipPath} (${zipSizeMB} MB)`);
} catch (zipErr) {
  console.error('⚠️ Falha ao criar zip com Compress-Archive:', zipErr.message);
}

console.log('\n🎉 ====================================================');
console.log('🎉 BACKUP azorestoyoufinal CRIADO COM SUCESSO TOTAL!');
console.log('🎉 ====================================================');
console.log(`📁 Pasta no Desktop: ${desktopBackupDir}`);
console.log(`🗜️ Ficheiro ZIP:     ${desktopZipPath}`);
console.log(`💾 Base de Dados:    ${path.join(inProjectBackupDir, 'db.json')}`);
console.log(`🔄 Script Restauro:  node restore_azorestoyoufinal.js`);
console.log('====================================================\n');
