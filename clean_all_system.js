import 'dotenv/config';
import { readDB, writeDB, connectDB } from './db.js';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
    cloud_name: (process.env.CLOUDINARY_CLOUD_NAME || '').trim(),
    api_key: (process.env.CLOUDINARY_API_KEY || '').trim(),
    api_secret: (process.env.CLOUDINARY_API_SECRET || '').trim()
});

const clearImagesInObject = (obj) => {
    if (!obj || typeof obj !== 'object') return;
    
    for (let key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            if (key === 'image' || key === 'logo') {
                if (typeof obj[key] === 'string' && obj[key] !== '') {
                    console.log(`🧹 Limpando campo '${key}' na base de dados...`);
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

const clearReservationsAndStatus = (db) => {
    let totalCleared = 0;
    
    const ALL_BUSINESS_COLLECTIONS = [
        'restaurants', 'beauty', 'shops', 'services', 'offices', 
        'hotels', 'cars', 'it_services', 'perfumes', 'animals', 
        'real_estate', 'gyms', 'stands', 'auto_repairs', 
        'auto_electronics', 'used_market', 'activities', 'bars', 'events', 'municipal'
    ];

    ALL_BUSINESS_COLLECTIONS.forEach(key => {
        if (db[key] && Array.isArray(db[key])) {
            db[key].forEach(biz => {
                // Limpar reservas do negócio
                if (biz.reservations && biz.reservations.length > 0) {
                    totalCleared += biz.reservations.length;
                    biz.reservations = [];
                }
                // Limpar kitchen orders
                if (biz.kitchenOrders && biz.kitchenOrders.length > 0) {
                    totalCleared += biz.kitchenOrders.length;
                    biz.kitchenOrders = [];
                }
                // Limpar orders
                if (biz.orders && biz.orders.length > 0) {
                    totalCleared += biz.orders.length;
                    biz.orders = [];
                }
                // Limpar salesHistory
                if (biz.salesHistory && biz.salesHistory.length > 0) {
                    totalCleared += biz.salesHistory.length;
                    biz.salesHistory = [];
                }
                // Restaurar mesas
                if (biz.tables && Array.isArray(biz.tables)) {
                    biz.tables.forEach(table => {
                        table.status = 'available';
                        table.customerName = undefined;
                        table.reservationTime = undefined;
                        table.occupiedBy = null;
                        table.occupiedSince = null;
                        table.currentTab = [];
                        table.pendingOrderItems = [];
                        table.alertStatus = 'none';
                        table.currentOrder = null;
                        if (table.reservations) { totalCleared += table.reservations.length; table.reservations = []; }
                        if (table.orders) { totalCleared += table.orders.length; table.orders = []; }
                    });
                }
                // Limpar quartos
                if (biz.rooms && Array.isArray(biz.rooms)) {
                    biz.rooms.forEach(room => {
                        room.status = 'available';
                        room.customerName = undefined;
                        room.reservationTime = undefined;
                    });
                }
            });
        }
    });

    // Limpar utilizadores registados
    if (db.users && Array.isArray(db.users)) {
        totalCleared += db.users.length;
        db.users = [];
    }
    
    // Limpar chats
    if (db.marketplace_chats && Array.isArray(db.marketplace_chats)) {
        totalCleared += db.marketplace_chats.length;
        db.marketplace_chats = [];
    }

    console.log(`✅ Reservas e dados limpos: ${totalCleared} itens.`);
};

const deleteCloudinaryFolder = async () => {
    console.log("☁️ A iniciar limpeza do Cloudinary...");
    if (!process.env.CLOUDINARY_CLOUD_NAME) {
        console.log("⚠️ Sem credenciais do Cloudinary no ficheiro .env. Ignorando esta etapa.");
        return;
    }
    try {
        console.log("🔍 Procurando e apagando ficheiros na pasta 'azores4you' do Cloudinary...");
        // Deletar recursos da pasta 'azores4you'
        const deleteResult = await cloudinary.api.delete_resources_by_prefix('azores4you/');
        console.log("✅ Resultados da limpeza de ficheiros Cloudinary:", deleteResult);
        
        // Também tentar apagar a pasta
        try {
            await cloudinary.api.delete_folder('azores4you');
            console.log("✅ Pasta 'azores4you' eliminada do Cloudinary.");
        } catch (e) {
            console.log("ℹ️ Nota sobre eliminação da pasta:", e.message);
        }
    } catch (err) {
        console.error("🚨 Falha ao limpar o Cloudinary:", err);
    }
};

const main = async () => {
    if (process.env.NODE_ENV === 'production') {
        console.error("🚨 Erro: Esta operação de limpeza não é permitida em ambiente de produção!");
        process.exit(1);
    }
    console.log("🚀 INICIANDO LIMPEZA COMPLETA (BASE DE DADOS + CLOUDINARY)...");
    await connectDB();
    // Esperar ligação estabelecer
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    try {
        // 1. Ler base de dados fresca
        const db = await readDB(true);
        console.log("📖 Base de dados carregada.");
        
        // 2. Limpar todas as imagens na base de dados
        clearImagesInObject(db);
        
        // 3. Limpar reservas, pedidos, utilizadores e mesas
        clearReservationsAndStatus(db);
        
        // 4. Limpar imagens fisicamente do Cloudinary CDN
        await deleteCloudinaryFolder();
        
        // 5. Gravar tudo de volta
        console.log("💾 A gravar alterações no MongoDB Atlas e localmente...");
        await writeDB(db);
        
        console.log("\n⭐️ LIMPEZA TOTAL REALIZADA COM SUCESSO TOTAL! ⭐️");
        process.exit(0);
    } catch (error) {
        console.error("🚨 Ocorreu um erro no processo de limpeza geral:", error);
        process.exit(1);
    }
};

main();
