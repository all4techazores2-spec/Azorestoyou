import { readDB, writeDB, connectDB } from './db.js';

const clearAll = async () => {
    console.log("🧹 Limpeza TOTAL a iniciar...");
    await connectDB();
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    try {
        const db = await readDB();
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

        // Limpar totalmente os clientes registados
        if (db.users && Array.isArray(db.users)) {
            totalCleared += db.users.length;
            db.users = [];
        }

        await writeDB(db);
        console.log(`✅ Limpeza total concluída! ${totalCleared} items removidos.`);
        console.log("   ✓ Reservas dos negócios limpas");
        console.log("   ✓ KitchenOrders limpas");
        console.log("   ✓ Mesas restauradas (available, sem pedidos, sem alertas)");
        console.log("   ✓ Reservas dos utilizadores limpas");
        process.exit(0);
    } catch (err) {
        console.error("🚨 Erro:", err);
        process.exit(1);
    }
};

clearAll();
