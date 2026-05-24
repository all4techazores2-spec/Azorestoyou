import fs from 'fs';
import path from 'path';

async function performBackup() {
  try {
    const desktopBackupDir = 'c:\\Users\\PC\\Desktop\\backups_app';

    // Garantir que a pasta local no Desktop existe
    if (!fs.existsSync(desktopBackupDir)) {
      fs.mkdirSync(desktopBackupDir, { recursive: true });
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    console.log(`\n⏳ A iniciar backup automático local [${new Date().toLocaleString()}]...`);

    // 1. Backup do ficheiro local db.json
    const localDbPath = path.join(process.cwd(), 'db.json');
    if (fs.existsSync(localDbPath)) {
      const desktopLocalBackupPath = path.join(desktopBackupDir, `local_db_backup_${timestamp}.json`);
      fs.copyFileSync(localDbPath, desktopLocalBackupPath);
      
      console.log(`  💾 Backup local guardado exclusivamente em:`);
      console.log(`    -> C:\\Users\\PC\\Desktop\\backups_app\\local_db_backup_${timestamp}.json`);
    } else {
      console.log('  ⚠️ Ficheiro db.json local não encontrado para backup.');
    }

    // 2. Backup da pasta 'dist' se ela existir
    const distPath = path.join(process.cwd(), 'dist');
    if (fs.existsSync(distPath)) {
      const desktopDistBackupPath = path.join(desktopBackupDir, `dist_backup_${timestamp}`);
      
      try {
        if (typeof fs.cpSync === 'function') {
          fs.cpSync(distPath, desktopDistBackupPath, { recursive: true });
        } else {
          const copyDirRecursive = (src, dest) => {
            fs.mkdirSync(dest, { recursive: true });
            const entries = fs.readdirSync(src, { withFileTypes: true });
            for (let entry of entries) {
              const srcPath = path.join(src, entry.name);
              const destPath = path.join(dest, entry.name);
              if (entry.isDirectory()) {
                copyDirRecursive(srcPath, destPath);
              } else {
                fs.copyFileSync(srcPath, destPath);
              }
            }
          };
          copyDirRecursive(distPath, desktopDistBackupPath);
        }
        console.log(`  📦 Backup da pasta 'dist' guardado exclusivamente em:`);
        console.log(`    -> C:\\Users\\PC\\Desktop\\backups_app\\dist_backup_${timestamp}`);
      } catch (distErr) {
        console.log('  ⚠️ Falha ao copiar pasta dist:', distErr.message);
      }
    } else {
      console.log('  ℹ️ Pasta dist não existe ainda (será criada após o build).');
    }

    console.log('🎉 Backup automático concluído com sucesso total em C:\\Users\\PC\\Desktop\\backups_app!\n');
    process.exit(0);
  } catch (err) {
    console.error('❌ ERRO NO BACKUP AUTOMÁTICO:', err.message);
    process.exit(0); // Não bloqueia o processo de build se o backup falhar (ex: sem permissões), mas avisa.
  }
}

performBackup();
