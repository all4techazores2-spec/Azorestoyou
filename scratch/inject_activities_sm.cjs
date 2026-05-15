const fs = require('fs');
const path = 'c:/Users/PC/Desktop/Azores4you/db.json';

const db = JSON.parse(fs.readFileSync(path, 'utf8'));

const newActivities = [
  {
    "id": "act_whale_watching",
    "title": "Whale Watching (Observação de Cetáceos)",
    "type": "activity",
    "island": "São Miguel",
    "image": "https://images.unsplash.com/photo-1568430462989-44163eb1752f?auto=format&fit=crop&q=80&w=800",
    "description": "Uma experiência inesquecível de observação de baleias e golfinhos nas águas cristalinas dos Açores, acompanhada por biólogos marinhos.",
    "isPaid": true,
    "price": 55,
    "duration": "3h00",
    "address": "Marina de Ponta Delgada",
    "gallery": [],
    "bookingPolicy": "required"
  },
  {
    "id": "act_canyoning_cabrito",
    "title": "Canyoning no Salto do Cabrito",
    "type": "activity",
    "island": "São Miguel",
    "image": "https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&q=80&w=800",
    "description": "Aventure-se a descer cascatas e a explorar ribeiras escondidas nesta experiência de canyoning cheia de adrenalina.",
    "isPaid": true,
    "price": 65,
    "duration": "4h00",
    "address": "Caldeiras da Ribeira Grande",
    "gallery": [],
    "bookingPolicy": "required"
  },
  {
    "id": "act_jeep_tour_setecidades",
    "title": "Passeio de Jipe Sete Cidades",
    "type": "activity",
    "island": "São Miguel",
    "image": "https://images.unsplash.com/photo-1533106497176-45ae19e68ba2?auto=format&fit=crop&q=80&w=800",
    "description": "Explore as crateras vulcânicas e as lagoas verde e azul das Sete Cidades num jipe 4x4, com acesso a miradouros exclusivos.",
    "isPaid": true,
    "price": 45,
    "duration": "4h00",
    "address": "Ponta Delgada (Pickup)",
    "gallery": [],
    "bookingPolicy": "recommended"
  },
  {
    "id": "act_kayak_furnas",
    "title": "Kayak na Lagoa das Furnas",
    "type": "activity",
    "island": "São Miguel",
    "image": "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&q=80&w=800",
    "description": "Remar tranquilamente na Lagoa das Furnas, observando as fumarolas e a exuberante vegetação das margens de uma perspetiva única.",
    "isPaid": true,
    "price": 25,
    "duration": "2h00",
    "address": "Margem da Lagoa das Furnas",
    "gallery": [],
    "bookingPolicy": "recommended"
  },
  {
    "id": "act_swim_dolphins",
    "title": "Natação com Golfinhos",
    "type": "activity",
    "island": "São Miguel",
    "image": "https://images.unsplash.com/photo-1544923246-77307dd654ca?auto=format&fit=crop&q=80&w=800",
    "description": "Sinta a magia de nadar com golfinhos no seu habitat natural, numa experiência respeitadora e inesquecível.",
    "isPaid": true,
    "price": 85,
    "duration": "3h00",
    "address": "Marina de Ponta Delgada",
    "gallery": [],
    "bookingPolicy": "required"
  },
  {
    "id": "act_cozido_experience",
    "title": "Workshop Cozido das Furnas",
    "type": "activity",
    "island": "São Miguel",
    "image": "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=800",
    "description": "Aprenda a preparar o famoso Cozido das Furnas, enterrando a panela nas caldeiras vulcânicas, seguido de um almoço tradicional.",
    "isPaid": true,
    "price": 40,
    "duration": "5h00",
    "address": "Caldeiras das Furnas",
    "gallery": [],
    "bookingPolicy": "required"
  }
];

// Combine and avoid duplicates
const existingIds = new Set(db.activities.map(a => a.id));
newActivities.forEach(act => {
  if (!existingIds.has(act.id)) {
    db.activities.push(act);
  }
});

fs.writeFileSync(path, JSON.stringify(db, null, 2));
console.log('Activities added successfully!');
