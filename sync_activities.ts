import fs from 'fs';
import { getActivities } from './constants';

const dbPath = './db.json';
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

// Get all activities from constants (which now has the 41 new ones)
const allActivities = getActivities('pt');

// Just replace the activities array in db.json to ensure it has everything
// Any existing reservations inside activities? Activities might not have reservations in this simple mock,
// but just in case, we preserve them.
const dbActivities = db.activities || [];

const mergedActivities = allActivities.map(newAct => {
  const existingAct = dbActivities.find((a: any) => a.id === newAct.id);
  if (existingAct) {
    return { ...newAct, reservations: existingAct.reservations || [] };
  }
  return { ...newAct, reservations: [] };
});

db.activities = mergedActivities;
fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));

console.log(`Synced ${mergedActivities.length} activities to db.json successfully!`);
