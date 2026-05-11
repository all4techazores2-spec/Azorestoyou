
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const dbSchema = new mongoose.Schema({
    key: String,
    data: mongoose.Schema.Types.Mixed
}, { timestamps: true });

const DBModel = mongoose.models.Data || mongoose.model('Data', dbSchema);

async function applyRoomsToAll() {
    try {
        const uri = process.env.MONGODB_URI;
        if (!uri) {
            console.error("❌ ERRO: MONGODB_URI não encontrada no .env");
            process.exit(1);
        }

        await mongoose.connect(uri);
        console.log("✅ Ligado ao MongoDB Atlas");

        const masterDoc = await DBModel.findOne({ key: 'master_db' });
        if (!masterDoc) {
            console.error("❌ Erro: Documento 'master_db' não encontrado");
            process.exit(1);
        }

        let hotels = masterDoc.data.hotels || [];
        console.log(`🏨 Encontrados ${hotels.length} hotéis/AL.`);

        hotels = hotels.map(hotel => {
            console.log(`   -> A processar: ${hotel.name}`);
            
            const basePrice = hotel.pricePerNight || 100;

            const rooms = [
                {
                    id: `RM_${hotel.id}_001`,
                    name: "Duplo Standard",
                    pricePerNight: basePrice,
                    capacity: 2,
                    image: "",
                    gallery: [],
                    description: "Quarto de 28m² com Varanda, Vista cidade, Banheira, Ar condicionado, Casa de banho privativa, Televisão de ecrã plano, Insonorização, Máquina de café, Minibar e Wi-Fi gratuito."
                },
                {
                    id: `RM_${hotel.id}_002`,
                    name: "Duplo com Vista Mar",
                    pricePerNight: Math.round(basePrice * 1.2),
                    capacity: 2,
                    image: "",
                    gallery: [],
                    description: "Quarto de 28m² com 1 cama de casal grande, Varanda, Vista mar, Vista piscina, Banheira, Ar condicionado, Casa de banho privativa, Televisão de ecrã plano, Insonorização, Terraço, Máquina de café, Minibar e Wi-Fi gratuito."
                },
                {
                    id: `RM_${hotel.id}_003`,
                    name: "Individual Standard",
                    pricePerNight: Math.round(basePrice * 0.85),
                    capacity: 1,
                    image: "",
                    gallery: [],
                    description: "Quarto de 28m² com Varanda, Vista cidade, Banheira, Ar condicionado, Casa de banho privativa, Televisão de ecrã plano, Insonorização, Máquina de café, Minibar e Wi-Fi gratuito."
                }
            ];

            return { ...hotel, rooms };
        });

        masterDoc.data.hotels = hotels;
        masterDoc.markModified('data.hotels');
        await masterDoc.save();

        console.log("✨ SUCESSO: Padrão de quartos aplicado a todos os hotéis!");
        process.exit(0);

    } catch (err) {
        console.error("❌ Erro fatal:", err);
        process.exit(1);
    }
}

applyRoomsToAll();
