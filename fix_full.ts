import fs from 'fs';
import { getRestaurants } from './constants';

const dbPath = './db.json';
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

const originalRestaurants = getRestaurants('pt');
const r1Original = originalRestaurants.find(r => r.id === 'R1');
const r2Original = originalRestaurants.find(r => r.id === 'R2');

if (!r1Original || !r2Original) {
  console.log("Error: could not find R1 or R2 in constants.ts");
  process.exit(1);
}

// Ensure businessType is set
r1Original.businessType = 'restaurant';
r2Original.businessType = 'restaurant';

// Find them in db
const r1DbIndex = db.restaurants.findIndex((r: any) => r.id === 'R1');
const r2DbIndex = db.restaurants.findIndex((r: any) => r.id === 'R2');

if (r1DbIndex !== -1) {
  const existingReservations = db.restaurants[r1DbIndex].reservations || [];
  db.restaurants[r1DbIndex] = { ...r1Original, reservations: existingReservations };
} else {
  db.restaurants.unshift({ ...r1Original, reservations: [] });
}

if (r2DbIndex !== -1) {
  const existingReservations = db.restaurants[r2DbIndex].reservations || [];
  db.restaurants[r2DbIndex] = { ...r2Original, reservations: existingReservations };
} else {
  // Insert at position 1 (right after R1)
  db.restaurants.splice(1, 0, { ...r2Original, reservations: [] });
}

fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
console.log("Restored original rich data for A Tasca and O Pescador successfully!");
