import { readDB, writeDB, connectDB } from './db.js';

const clearImagesInObject = (obj) => {
    if (!obj || typeof obj !== 'object') return;
    
    for (let key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            if (key === 'image' || key === 'logo') {
                if (typeof obj[key] === 'string' && obj[key] !== '') {
                    console.log(`🧹 Limpando campo '${key}': "${obj[key]}" -> ""`);
                    obj[key] = "";
                }
            } else if (key === 'images' || key === 'gallery' || key === 'logos') {
                if (Array.isArray(obj[key]) && obj[key].length > 0) {
                    console.log(`🧹 Limpando array '${key}' com ${obj[key].length} itens.`);
                    obj[key] = [];
                }
            } else if (typeof obj[key] === 'object') {
                clearImagesInObject(obj[key]);
            }
        }
    }
};

const run = async () => {
    console.log("🚀 Iniciando limpeza de imagens na base de dados...");
    await connectDB();
    // Esperar a ligação ser devidamente estabelecida
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    try {
        const db = await readDB(true); // bypass cache para ler o estado mais fresco
        console.log("📖 Base de dados carregada com sucesso.");
        
        clearImagesInObject(db);
        
        console.log("💾 A gravar as alterações localmente e no MongoDB Atlas...");
        await writeDB(db);
        console.log("✅ Concluído! Todas as imagens foram limpas localmente e no Atlas.");
        process.exit(0);
    } catch (err) {
        console.error("🚨 Erro durante o processo de limpeza de imagens:", err);
        process.exit(1);
    }
};

run();
