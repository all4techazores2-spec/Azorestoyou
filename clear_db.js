import { readDB, writeDB, connectDB } from './db.js';

async function run() {
    await connectDB();
    await new Promise(r => setTimeout(r, 2000)); // allow mongo to connect
    const db = await readDB(true);
    Object.keys(db).forEach(k => {
        if(Array.isArray(db[k])) {
            db[k].forEach(b => {
                if(b.reservations) b.reservations = [];
                if(b.orders) b.orders = [];
                if(b.appointments) b.appointments = [];
                if(b.bookings) b.bookings = [];
            });
        }
    });
    if(db.users) {
        db.users.forEach(u => {
            if(u.reservations) u.reservations = [];
            if(u.orders) u.orders = [];
            if(u.appointments) u.appointments = [];
            if(u.bookings) u.bookings = [];
        });
    }
    await writeDB(db);
    console.log('All reservations cleared from MongoDB');
    process.exit(0);
}

run().catch(console.error);
