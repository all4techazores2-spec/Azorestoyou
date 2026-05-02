import fs from 'fs';

const dbPath = './db.json';
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

function applyPaidRules(items) {
  if (!items) return;
  items.forEach(item => {
    if (item.bookingPolicy === 'required' || item.bookingPolicy === 'recommended') {
      item.isPaid = true;
      item.price = item.price || 25; // Add a default price if it doesn't have one
    }
  });
}

applyPaidRules(db.activities);
// Not modifying restaurants prices here because restaurants work differently (they have dishes), but setting isPaid just in case
applyPaidRules(db.restaurants);

fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));

// Also modify constants.ts via string replacement
let constantsContent = fs.readFileSync('constants.ts', 'utf8');

// The naive way: find all "bookingPolicy: "required"" and add "isPaid: true, price: 25"
constantsContent = constantsContent.replace(/bookingPolicy: "required"/g, 'bookingPolicy: "required", isPaid: true, price: 25');
constantsContent = constantsContent.replace(/bookingPolicy: "recommended"/g, 'bookingPolicy: "recommended", isPaid: true, price: 25');

fs.writeFileSync('constants.ts', constantsContent);

console.log('Added isPaid=true and price=25 to all activities that require or recommend booking.');
