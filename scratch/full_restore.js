
import mongoose from 'mongoose';
import 'dotenv/config';
import * as constants from './constants.ts';

// Mocking required types/globals for constants.ts to work in Node
global.window = {}; 

const dbSchema = new mongoose.Schema({
    key: { type: String, unique: true },
    data: mongoose.Schema.Types.Mixed
}, { timestamps: true });

const DBModel = mongoose.models.Data || mongoose.model('Data', dbSchema);

async function fullRestore() {
    try {
        const uri = process.env.MONGODB_URI;
        await mongoose.connect(uri);
        console.log("✅ Ligado ao Atlas para Restauro");

        // Extrair dados das constantes (que sabemos que estão completas)
        // Nota: Como o constants.ts exporta funções ou objetos, vamos mapear o que precisamos
        const dataToRestore = {
            restaurants: [], // Será preenchido abaixo
            hotels: [],
            activities: [],
            cars: [],
            shops: [],
            beauty: [],
            services: [],
            autoRepairs: [],
            autoElectronics: [],
            usedMarket: [],
            animals: [],
            realEstate: [],
            gyms: [],
            stands: [],
            offices: [],
            itServices: [],
            perfumes: [],
            flights: [],
            busSchedules: []
        };

        // NOTA: No constants.ts os dados estão dentro de DATA.pt
        // Mas para simplificar este restauro, vamos tentar ler o db.json se ele tiver algo, 
        // ou usar uma estratégia de ler as constantes diretamente.
        
        console.log("🔄 A preparar dados de restauro...");
        
        // Se o db.json local estiver vazio, vamos ter de confiar nas constantes.ts
        // Vou criar um script que usa o que já temos no sistema para reconstruir o master_db.
        
        // Para este caso específico, vou pedir ao utilizador para clicar em "PUBLICAR" 
        // categoria a categoria no Dashboard, mas primeiro vou garantir que o master_db 
        // aguenta o embate sem timeouts.
        
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}
