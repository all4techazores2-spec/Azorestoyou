import { readDB, connectDB } from '../db.js';

async function check() {
  await connectDB();
  // Wait a bit for connection
  await new Promise(r => setTimeout(r, 2000));
  const db = await readDB();
  console.log(`Activities count: ${db.activities.length}`);
  const trails = db.activities.filter(a => a.type === 'trail');
  console.log(`Trails count: ${trails.length}`);
  process.exit();
}
check();
