const fs = require('fs');
const db = JSON.parse(fs.readFileSync('db.json', 'utf8'));

let changed = false;

if (db.beauty) {
    db.beauty.forEach(b => {
        if (b.businessType !== 'beauty') {
            console.log(`Fixing businessType for ${b.name} (${b.id}) -> beauty`);
            b.businessType = 'beauty';
            changed = true;
        }
    });
}

if (db.shops) {
    db.shops.forEach(s => {
        if (s.businessType !== 'shop') {
            console.log(`Fixing businessType for ${s.name} (${s.id}) -> shop`);
            s.businessType = 'shop';
            changed = true;
        }
    });
}

if (db.restaurants) {
    db.restaurants.forEach(r => {
        if (!r.businessType) {
            console.log(`Fixing businessType for ${r.name} (${r.id}) -> restaurant`);
            r.businessType = 'restaurant';
            changed = true;
        }
    });
}

if (changed) {
    fs.writeFileSync('db.json', JSON.stringify(db, null, 2));
    console.log('db.json updated.');
} else {
    console.log('All business types are correct in db.json.');
}
