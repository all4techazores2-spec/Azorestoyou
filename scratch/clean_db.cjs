
const fs = require('fs');
const path = 'c:/Users/PC/Desktop/Azores4you/db.json';

const db = JSON.parse(fs.readFileSync(path, 'utf8'));

const cleanCollection = (collection, subcategoryKey) => {
  if (!Array.isArray(collection)) return collection;
  
  const groups = {};
  collection.forEach(item => {
    const subcat = item[subcategoryKey] || 'default';
    if (!groups[subcat]) groups[subcat] = [];
    if (groups[subcat].length < 2) {
      groups[subcat].push(item);
    }
  });
  
  return Object.values(groups).flat();
};

// Process each category
if (db.restaurants) db.restaurants = cleanCollection(db.restaurants, 'cuisine');
if (db.shops) db.shops = cleanCollection(db.shops, 'subcategory');
if (db.hotels) db.hotels = cleanCollection(db.hotels, 'type');
if (db.cars) db.cars = cleanCollection(db.cars, 'type');
if (db.activities) db.activities = cleanCollection(db.activities, 'type');
if (db.flights) db.flights = db.flights.slice(0, 2);
if (db.beauty) db.beauty = cleanCollection(db.beauty, 'subcategory');
if (db.services) db.services = cleanCollection(db.services, 'subcategory');
if (db.auto_repair) db.auto_repair = cleanCollection(db.auto_repair, 'subcategory');
if (db.auto_electronics) db.auto_electronics = cleanCollection(db.auto_electronics, 'subcategory');
if (db.used_market) db.used_market = cleanCollection(db.used_market, 'subcategory');
if (db.animals) db.animals = cleanCollection(db.animals, 'subcategory');
if (db.gyms) db.gyms = cleanCollection(db.gyms, 'subcategory');
if (db.stands) db.stands = cleanCollection(db.stands, 'subcategory');
if (db.offices) db.offices = cleanCollection(db.offices, 'subcategory');
if (db.it_services) db.it_services = cleanCollection(db.it_services, 'subcategory');
if (db.perfumes) db.perfumes = cleanCollection(db.perfumes, 'subcategory');

// Do NOT touch real_estate / imobiliarias
// (Assuming real_estate is the key based on constants.ts)

fs.writeFileSync(path, JSON.stringify(db, null, 2), 'utf8');
console.log('db.json cleaned successfully.');
