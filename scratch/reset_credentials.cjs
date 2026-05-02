const fs = require('fs');
const path = 'c:/Users/PC/Desktop/Azores4you/db.json';

const db = JSON.parse(fs.readFileSync(path, 'utf8'));

// 1. Clean and reset users
db.users = [
  {
    email: 'adminadmin@gmail.com',
    password: 'admin',
    role: 'admin',
    credits: 9999,
    profile: {
      phone: '',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin'
    },
    reservations: []
  },
  {
    email: 'cliente@gmail.com',
    password: 'cliente',
    role: 'user',
    credits: 100,
    profile: {
      phone: '',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Cliente'
    },
    reservations: []
  }
];

// 2. Update business emails and passwords
const businessMap = {
  'R1': 'atasca@azores4you.com',
  'R2': 'pescador@azores4you.com',
  'SHOP1': 'artesanato@azores4you.com',
  'SHOP2': 'queijaria@azores4you.com',
  'B1': 'beleza@azores4you.com',
  'S101': 'servicos@azores4you.com'
};

if (db.restaurants) {
  db.restaurants.forEach(r => {
    r.adminEmail = businessMap[r.id] || `${r.name.toLowerCase().replace(/\s+/g, '')}@azores4you.com`;
    r.adminPassword = 'admin';
    
    // Also add these to users array to allow login
    db.users.push({
      email: r.adminEmail,
      password: r.adminPassword,
      role: 'business',
      businessId: r.id,
      credits: 0,
      profile: {
        phone: r.phone || '',
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${r.id}`
      },
      reservations: []
    });
  });
}

// 3. Update Shops
if (db.shops) {
  db.shops.forEach(s => {
    s.adminEmail = businessMap[s.id] || `${s.name.toLowerCase().replace(/\s+/g, '')}@azores4you.com`;
    s.adminPassword = 'admin';
    
    db.users.push({
      email: s.adminEmail,
      password: s.adminPassword,
      role: 'business',
      businessId: s.id,
      credits: 0,
      profile: {
        phone: '',
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${s.id}`
      },
      reservations: []
    });
  });
}

// 4. Update Beauty (if in restaurants or separate)
// In this db, beauty seems to be in restaurants but some might be separate
// Let's check other businesses in restaurants array that are not type 'restaurant'
db.restaurants.forEach(r => {
    if (r.businessType && r.businessType !== 'restaurant') {
        // already handled by the restaurants loop above
    }
});

fs.writeFileSync(path, JSON.stringify(db, null, 2));
console.log('Credentials reset successfully in db.json');
