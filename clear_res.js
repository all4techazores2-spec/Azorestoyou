import { readDB, writeDB, connectDB } from './db.js';

const clearReservations = async () => {
    if (process.env.NODE_ENV === 'production') {
        console.error("🚨 Erro: Esta operação de limpeza não é permitida em ambiente de produção!");
        process.exit(1);
    }
    console.log("🧹 Iniciando limpeza manual...");
    await connectDB();
    // Esperar um pouco para a ligação à BD ser estabelecida
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    try {
        const db = await readDB();
        let totalCleared = 0;
        
        const ALL_BUSINESS_COLLECTIONS = [
            'restaurants', 'beauty', 'shops', 'services', 'offices', 
            'hotels', 'cars', 'it_services', 'perfumes', 'animals', 
            'real_estate', 'gyms', 'stands', 'auto_repairs', 
            'auto_electronics', 'used_market', 'activities', 'flights', 'bus-schedules', 'marketplace_ads', 'marketplace_chats',
            'bars', 'events', 'municipal'
        ];

        ALL_BUSINESS_COLLECTIONS.forEach(key => {
            if (db[key] && Array.isArray(db[key])) {
                db[key].forEach(biz => {
                    if (biz.reservations && biz.reservations.length > 0) {
                        totalCleared += biz.reservations.length;
                        biz.reservations = [];
                    }
                    if (biz.orders && biz.orders.length > 0) {
                        totalCleared += biz.orders.length;
                        biz.orders = [];
                    }
                    if (biz.tables && Array.isArray(biz.tables)) {
                        biz.tables.forEach(table => {
                            if (table.reservations && table.reservations.length > 0) {
                                totalCleared += table.reservations.length;
                                table.reservations = [];
                            }
                            if (table.orders && table.orders.length > 0) {
                                totalCleared += table.orders.length;
                                table.orders = [];
                            }
                            if (table.currentOrder) {
                                totalCleared += 1;
                                table.currentOrder = null;
                            }
                            table.status = 'available';
                            table.customerName = undefined;
                            table.reservationTime = undefined;
                            table.occupiedBy = null;
                            table.occupiedSince = null;
                            table.currentTab = [];
                        });
                    }
                    if (biz.chats && biz.chats.length > 0) {
                        totalCleared += biz.chats.length;
                        biz.chats = [];
                    }
                    if (biz.rooms && Array.isArray(biz.rooms)) {
                        biz.rooms.forEach(room => {
                            room.status = 'available';
                            room.customerName = undefined;
                            room.reservationTime = undefined;
                        });
                    }
                    if (biz.housekeeping && Array.isArray(biz.housekeeping)) {
                        totalCleared += biz.housekeeping.length;
                        biz.housekeeping = [];
                    }
                });
            }
        });

        if (db.users && Array.isArray(db.users)) {
            db.users.forEach(user => {
                if (user.reservations && user.reservations.length > 0) {
                    totalCleared += user.reservations.length;
                    user.reservations = [];
                }
                if (user.orders && user.orders.length > 0) {
                    totalCleared += user.orders.length;
                    user.orders = [];
                }
            });
        }

        if (db.marketplace_chats && db.marketplace_chats.length > 0) {
            totalCleared += db.marketplace_chats.length;
            db.marketplace_chats = [];
        }

        if (db.chairBlocks && db.chairBlocks.length > 0) {
            totalCleared += db.chairBlocks.length;
            db.chairBlocks = [];
        }

        if (db.sales && db.sales.length > 0) {
            totalCleared += db.sales.length;
            db.sales = [];
        }

        await writeDB(db);
        console.log(`✅ Limpeza concluída com sucesso! Total de items limpos: ${totalCleared}`);
        process.exit(0);
    } catch (err) {
        console.error("🚨 Erro durante a limpeza manual:", err);
        process.exit(1);
    }
};

clearReservations();
