import fs from 'fs';

const dbPath = './db.json';
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

const aTasca = {
  "id": "R1",
  "name": "A Tasca",
  "businessName": "A Tasca",
  "island": "PDL",
  "cuisine": "Regional",
  "rating": 4.8,
  "reviews": 2450,
  "image": "https://picsum.photos/400/300?random=20",
  "description": "Cozinha tradicional açoriana num ambiente rústico e animado. Famoso pelo bife de atum.",
  "adminEmail": "atasca@azores4you.com",
  "adminPassword": "tasca",
  "phone": "+351 296 282 800",
  "address": "Rua do Aljube 16, 9500-018 Ponta Delgada",
  "businessType": "restaurant",
  "tables": [
    { "id": "T1", "number": 1, "seats": 2, "status": "available" },
    { "id": "T2", "number": 2, "seats": 4, "status": "available" },
    { "id": "T3", "number": 3, "seats": 4, "status": "available" },
    { "id": "T4", "number": 4, "seats": 6, "status": "available" },
    { "id": "T5", "number": 5, "seats": 2, "status": "available" },
    { "id": "T6", "number": 6, "seats": 4, "status": "available" }
  ],
  "dishes": [
    { "id": "d1", "name": "Bife de Atum", "price": 18, "description": "Atum fresco com sementes de sésamo", "image": "https://picsum.photos/300/200?random=21", "category": "Pratos" },
    { "id": "d2", "name": "Polvo Assado", "price": 22, "description": "Polvo assado com batata a murro", "image": "https://picsum.photos/300/200?random=22", "category": "Pratos" }
  ],
  "staff": [
    { "id": "S1", "name": "João", "email": "joao@atasca.pt", "password": "123", "role": "waiter" }
  ]
};

if (!db.restaurants.find(r => r.id === 'R1')) {
  db.restaurants.unshift(aTasca);
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
  console.log('Restaurante A Tasca restaurado no db.json com sucesso!');
} else {
  console.log('Restaurante R1 já existe no db.json');
}
