import { readDB, writeDB, connectDB } from './db.js';

const run = async () => {
    console.log("🛠️ Iniciando correção da mesa T2 e pedido da cozinha...");
    await connectDB();
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    try {
        const db = await readDB(true);
        const tasca = db.restaurants.find(r => r.id === 'R1');
        
        if (!tasca) {
            console.error("❌ A Tasca não foi encontrada!");
            process.exit(1);
        }
        
        const reservation = tasca.reservations.find(r => r.id === 'RES_1779712743406');
        if (!reservation) {
            console.error("❌ Reserva RES_1779637410139 não encontrada!");
            process.exit(1);
        }
        
        console.log("📖 Reserva encontrada:", reservation.customerName, "Status:", reservation.status);
        
        // 1. Corrigir o estado da mesa T2
        if (!tasca.tables) tasca.tables = [];
        const table = tasca.tables.find(t => t.id === 'T2');
        if (table) {
            console.log("🧹 Atualizando mesa T2...");
            table.status = 'occupied';
            table.customerName = reservation.customerName;
            table.reservationTime = reservation.time;
            table.currentTab = reservation.preOrder || [];
        } else {
            console.warn("⚠️ Mesa T2 não encontrada na lista de mesas.");
        }
        
        // 2. Criar a Kitchen Order correspondente
        if (!tasca.kitchenOrders) tasca.kitchenOrders = [];
        const hasOrder = tasca.kitchenOrders.some(o => o.reservationId === reservation.id);
        if (!hasOrder) {
            console.log("🍳 Criando Kitchen Order...");
            tasca.kitchenOrders.push({
                id: `ORD_${Date.now()}`,
                tableId: 'T2',
                reservationId: reservation.id,
                items: reservation.preOrder || [],
                status: 'pending_admin',
                timestamp: new Date().toISOString()
            });
        } else {
            console.log("ℹ️ Kitchen Order já existia.");
        }
        
        await writeDB(db);
        console.log("✅ Sucesso! Mesa T2 e Pedidos da Cozinha corrigidos no Atlas e localmente.");
        process.exit(0);
    } catch (err) {
        console.error("🚨 Erro ao corrigir os dados:", err);
        process.exit(1);
    }
};

run();
