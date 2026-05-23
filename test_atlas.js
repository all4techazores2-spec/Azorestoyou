import { connectDB, DBModel } from './db.js';

async function run() {
    await connectDB();
    const start = Date.now();
    await DBModel.collection.updateOne({ key: 'master_db' }, { $set: { updatedAt: new Date() } });
    console.log('Atlas Write latency:', Date.now() - start, 'ms');
    process.exit(0);
}
run();
