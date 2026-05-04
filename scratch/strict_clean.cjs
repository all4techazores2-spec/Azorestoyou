const fs = require('fs');
const db = JSON.parse(fs.readFileSync('db.json', 'utf8'));

const collectionsToClean = [
  'restaurants', 'shops', 'flights', 'hotels', 'cars', 'activities', 
  'beauty', 'services', 'offices', 'animals', 'gyms', 'stands', 
  'auto_repairs', 'auto_electronics', 'used_market', 'it_services', 'perfumes'
];

collectionsToClean.forEach(key => {
  if (Array.isArray(db[key])) {
    db[key] = db[key].slice(0, 2);
  }
});

// Especial para Services que pode ter subcategorias
if (db.services && db.services.length > 2) {
    db.services = db.services.slice(0, 2);
}

// Limpar busSchedules (manter 2 exemplos apenas)
if (db.busSchedules) {
    db.busSchedules = db.busSchedules.slice(0, 2);
}

fs.writeFileSync('db.json', JSON.stringify(db, null, 2));
console.log('DB Cleaned successfully!');
