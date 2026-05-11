
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const dbSchema = new mongoose.Schema({
    key: String,
    data: mongoose.Schema.Types.Mixed
}, { timestamps: true });

const DBModel = mongoose.models.Data || mongoose.model('Data', dbSchema);

async function injectRooms() {
    try {
        const uri = process.env.MONGODB_URI;
        if (!uri) throw new Error("MONGODB_URI not found");

        await mongoose.connect(uri);
        console.log("✅ Connected to Atlas");

        const masterDoc = await DBModel.findOne({ key: 'master_db' });
        if (!masterDoc) throw new Error("Master doc not found");

        let hotels = masterDoc.data.hotels || [];
        let hotel = hotels.find(h => h.name.includes("Verde Mar"));

        if (!hotel) {
            console.log("❌ Hotel Verde Mar not found in Atlas. Make sure you created it first.");
            process.exit(1);
        }

        const rooms = [
            {
                id: "RM_VMS_001",
                name: "Duplo Standard",
                pricePerNight: hotel.pricePerNight || 150,
                capacity: 2,
                image: "",
                gallery: [],
                description: "Quarto de 28m² com Varanda, Vista cidade, Banheira, Ar condicionado, Casa de banho privativa, Televisão de ecrã plano, Insonorização, Máquina de café, Minibar e Wi-Fi gratuito."
            },
            {
                id: "RM_VMS_002",
                name: "Duplo com Vista Mar",
                pricePerNight: (hotel.pricePerNight || 150) + 30,
                capacity: 2,
                image: "",
                gallery: [],
                description: "Quarto de 28m² com 1 cama de casal grande, Varanda, Vista mar, Vista piscina, Banheira, Ar condicionado, Casa de banho privativa, Televisão de ecrã plano, Insonorização, Terraço, Máquina de café, Minibar e Wi-Fi gratuito."
            },
            {
                id: "RM_VMS_003",
                name: "Individual Standard",
                pricePerNight: (hotel.pricePerNight || 150) - 20,
                capacity: 1,
                image: "",
                gallery: [],
                description: "Quarto de 28m² com Varanda, Vista cidade, Banheira, Ar condicionado, Casa de banho privativa, Televisão de ecrã plano, Insonorização, Máquina de café, Minibar e Wi-Fi gratuito."
            }
        ];

        hotel.rooms = rooms;
        
        // Mark as modified and save
        masterDoc.markModified('data.hotels');
        await masterDoc.save();

        console.log("✨ SUCCESS: 3 Rooms injected into Verde Mar & SPA!");
        process.exit(0);

    } catch (err) {
        console.error("Error:", err);
        process.exit(1);
    }
}

injectRooms();
