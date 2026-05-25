import { readDB, writeDB, connectDB } from './db.js';

const run = async () => {
    console.log("🧹 Iniciando a remoção de anúncios do Marketplace...");
    await connectDB();
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    try {
        const db = await readDB(true);
        const countBefore = db.marketplace_ads ? db.marketplace_ads.length : 0;
        console.log(`📖 Total de anúncios encontrados no momento: ${countBefore}`);
        
        // Limpar os anúncios do marketplace
        db.marketplace_ads = [];
        
        console.log("💾 A gravar as alterações localmente e no MongoDB Atlas...");
        await writeDB(db);
        
        console.log(`✅ Concluído! Todos os ${countBefore} anúncios de exemplo do Marketplace foram limpos com sucesso.`);
        process.exit(0);
    } catch (err) {
        console.error("🚨 Erro durante a limpeza do Marketplace:", err);
        process.exit(1);
    }
};

run();
