import fs from 'fs';

const dbPath = './db.json';
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

const requiredKeywords = [
  'Montanha do Pico', 'Algar do Carvão', 'Furna do Enxofre',
  'Whale Watching', 'Canyoning', 'Queijo', 'Verdelho'
];

const recommendedKeywords = [
  'Cozido das Furnas', 'Dona Beija', 'Caldeira Velha',
  'Jamantas', 'Peter Café Sport'
];

function applyRules(items) {
  if (!items) return;
  items.forEach(item => {
    // Check titles/names
    const searchableText = (item.title || item.name || '').toLowerCase();
    
    // Required
    if (requiredKeywords.some(kw => searchableText.includes(kw.toLowerCase()))) {
      item.bookingPolicy = 'required';
    }
    
    // Recommended
    if (recommendedKeywords.some(kw => searchableText.includes(kw.toLowerCase()))) {
      item.bookingPolicy = 'recommended';
    }
  });
}

applyRules(db.activities);
applyRules(db.restaurants);

fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));

// Also modify constants.ts via string replacement
let constantsContent = fs.readFileSync('constants.ts', 'utf8');

// For simplicity, we can do a naive regex or simple string replacement
requiredKeywords.forEach(kw => {
  const regex = new RegExp(`(title:\\s*["'](?:.*)?${kw}(?:.*)?["'].*?)}`, 'gi');
  constantsContent = constantsContent.replace(regex, `$1, bookingPolicy: "required" }`);
});

recommendedKeywords.forEach(kw => {
  const regex = new RegExp(`(title:\\s*["'](?:.*)?${kw}(?:.*)?["'].*?)}`, 'gi');
  constantsContent = constantsContent.replace(regex, `$1, bookingPolicy: "recommended" }`);
});

// For restaurants (name: "...")
recommendedKeywords.forEach(kw => {
  const regex = new RegExp(`(name:\\s*["'](?:.*)?${kw}(?:.*)?["'].*?)}`, 'gi');
  constantsContent = constantsContent.replace(regex, `$1, bookingPolicy: "recommended" }`);
});

fs.writeFileSync('constants.ts', constantsContent);

console.log('Booking rules applied to db.json and constants.ts');
