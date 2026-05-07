const fs = require('fs');
const path = require('path');

const newRestaurants = JSON.parse(fs.readFileSync('new_restaurants.json', 'utf8'));

// Update db.json
const dbPath = path.join(__dirname, '..', 'db.json');
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
db.restaurants = [...db.restaurants, ...newRestaurants];
fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
console.log('Updated db.json');

// Update constants.ts
const constantsPath = path.join(__dirname, '..', 'constants.ts');
let constants = fs.readFileSync(constantsPath, 'utf8');

// This is tricky because it's a TS file.
// I'll try to find the restaurants array in pt object.
// const pt = { ... restaurants: [ ... ] }

// Find the line with "restaurants: [" inside the "pt:" block
const ptStart = constants.indexOf('pt: {');
const restaurantsStart = constants.indexOf('restaurants: [', ptStart);
const insertPos = constants.indexOf(']', restaurantsStart);

const newEntries = newRestaurants.map(r => `      ${JSON.stringify(r, null, 2)},`).join('\n');

const updatedConstants = constants.slice(0, insertPos) + '\n' + newEntries + '\n' + constants.slice(insertPos);

fs.writeFileSync(constantsPath, updatedConstants);
console.log('Updated constants.ts');
