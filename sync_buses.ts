import fs from 'fs';
import { BUS_SCHEDULES } from './constants';

const dbPath = './db.json';
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

db.busSchedules = BUS_SCHEDULES;

fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));

console.log(`Synced ${BUS_SCHEDULES.length} bus schedules to db.json successfully!`);
