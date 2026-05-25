import { readDB, connectDB } from './db.js';

const run = async () => {
    console.log("🔍 Conectando à base de dados para verificar as imagens...");
    await connectDB();
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    try {
        const db = await readDB(true);
        console.log("📖 Base de dados lida. Analisando URLs de imagens...");
        
        const ALL_BUSINESS_COLLECTIONS = [
            'restaurants', 'beauty', 'shops', 'services', 'offices', 
            'hotels', 'cars', 'it_services', 'perfumes', 'animals', 
            'real_estate', 'gyms', 'stands', 'auto_repairs', 
            'auto_electronics', 'used_market', 'activities', 'bars', 'events', 'municipal',
            'marketplace_ads'
        ];
        
        let foundImages = [];
        
        ALL_BUSINESS_COLLECTIONS.forEach(collection => {
            if (db[collection] && Array.isArray(db[collection])) {
                db[collection].forEach(biz => {
                    if (biz.image && biz.image !== '') {
                        foundImages.push({
                            collection,
                            name: biz.name || biz.title || "Sem nome",
                            field: 'image',
                            url: biz.image.substring(0, 100) + (biz.image.length > 100 ? '...' : '')
                        });
                    }
                    if (biz.logo && biz.logo !== '') {
                        foundImages.push({
                            collection,
                            name: biz.name || biz.title || "Sem nome",
                            field: 'logo',
                            url: biz.logo.substring(0, 100) + (biz.logo.length > 100 ? '...' : '')
                        });
                    }
                    if (Array.isArray(biz.gallery)) {
                        biz.gallery.forEach((img, idx) => {
                            if (img && img !== '') {
                                foundImages.push({
                                    collection,
                                    name: `${biz.name || biz.title || "Sem nome"} (Galeria [${idx}])`,
                                    field: 'gallery',
                                    url: img.substring(0, 100) + (img.length > 100 ? '...' : '')
                                });
                            }
                        });
                    }
                });
            }
        });
        
        if (foundImages.length === 0) {
            console.log("⚠️ Nenhuma imagem do Cloudinary foi encontrada na base de dados neste momento.");
        } else {
            console.log(`✅ Encontradas ${foundImages.length} imagens ativas no Cloudinary:`);
            console.log(JSON.stringify(foundImages, null, 2));
        }
        
        process.exit(0);
    } catch (err) {
        console.error("🚨 Erro:", err);
        process.exit(1);
    }
};

run();
