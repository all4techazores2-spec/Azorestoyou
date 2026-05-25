import { readDB, connectDB } from './db.js';

const run = async () => {
    await connectDB();
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    try {
        const db = await readDB(true);
        console.log("📖 Marketplace ads found in DB:");
        console.log(JSON.stringify(db.marketplace_ads || [], null, 2));
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

run();
