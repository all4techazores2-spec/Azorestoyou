
import { Airport, Flight, Hotel, Car, Restaurant, Activity, Language, BusStop, BusSchedule, CarRentalCompany, TourGuide } from './types';

export const COLORS = {
  primary: '#1A75BB', // Azul
  secondary: '#2C7A2E', // Verde
};

// Raw Data with localization maps
const DATA: Record<Language, {
  airports: Airport[];
  hotels: Hotel[];
  restaurants: Restaurant[];
  activities: Activity[];
}> = {
  pt: {
    airports: [
      { code: 'PDL', name: 'Aeroporto João Paulo II', location: 'São Miguel', isAzores: true },
      { code: 'TER', name: 'Aeroporto das Lajes', location: 'Terceira', isAzores: true },
    ],
    hotels: [
      { id: 'H1', name: 'Azores Royal Garden', island: 'PDL', stars: 4, pricePerNight: 120, image: 'https://picsum.photos/400/300?random=1', description: 'Hotel de luxo com jardim japonês e spa.' },
      { id: 'H2', name: 'Terra Nostra Garden', island: 'PDL', stars: 5, pricePerNight: 200, image: 'https://picsum.photos/400/300?random=2', description: 'Localizado nas Furnas com piscinas termais.' },
    ],
    restaurants: [
      {
        id: 'R1', name: 'A Tasca', island: 'PDL', cuisine: 'Regional', rating: 4.8, reviews: 2450, image: 'https://picsum.photos/400/300?random=20',
        description: 'Cozinha tradicional açoriana num ambiente rústico e animado. Famoso pelo bife de atum.',
        adminEmail: 'atasca@azores4you.com',
        adminPassword: 'tasca',
        phone: '+351 296 282 800',
        address: 'Rua do Aljube 16, 9500-018 Ponta Delgada',
        publicEmail: 'reservas@atasca.pt',
        mapsUrl: 'https://maps.app.goo.gl/A4d55T6KjYVjLqV98',
        latitude: '37.7408',
        longitude: '-25.6686',
        reservations: [],
        updates: [],
        dishes: [
          { name: 'Bife de Atum', description: 'Bife de atum fresco com sementes de sésamo.', price: 18, image: 'https://picsum.photos/300/200?random=21' },
          { name: 'Polvo à Lagareiro', description: 'Polvo assado com batatas a murro.', price: 22, image: 'https://picsum.photos/300/200?random=22' }
        ]
      },
      {
        id: 'R2', name: 'O Pescador', island: 'TER', cuisine: 'Marisco', rating: 4.6, reviews: 890, image: 'https://picsum.photos/400/300?random=24',
        description: 'O melhor peixe fresco na Terceira, localizado junto ao porto.',
        dishes: [
          { name: 'Lapas Grelhadas', description: 'Lapas grelhadas com manteiga de alho.', price: 12, image: 'https://picsum.photos/300/200?random=25' },
          { name: 'Alcatra', description: 'Prato de carne cozinhado lentamente em alguidar de barro.', price: 19, image: 'https://picsum.photos/300/200?random=26' }
        ]
      }
    ],
    activities: [
      { id: 'A1', title: 'Trilho Sete Cidades', type: 'trail', island: 'PDL', image: 'https://picsum.photos/400/300?random=30', description: 'Caminhe à volta da cratera das lagoas azul e verde.', distance: '12km', duration: '4h', difficulty: 'Moderado' },
      { id: 'A2', title: 'Algar do Carvão', type: 'landscape', island: 'TER', image: 'https://picsum.photos/400/300?random=31', description: 'Desça ao interior de uma antiga chaminé vulcânica.' },
    ]
  },
  en: {
    airports: [
      { code: 'PDL', name: 'João Paulo II Airport', location: 'São Miguel', isAzores: true },
      { code: 'TER', name: 'Lajes Airport', location: 'Terceira', isAzores: true },
    ],
    hotels: [
      { id: 'H1', name: 'Azores Royal Garden', island: 'PDL', stars: 4, pricePerNight: 120, image: 'https://picsum.photos/400/300?random=1', description: 'Luxury hotel with Japanese garden and spa.' },
      { id: 'H2', name: 'Terra Nostra Garden', island: 'PDL', stars: 5, pricePerNight: 200, image: 'https://picsum.photos/400/300?random=2', description: 'Located in Furnas with thermal pools.' },
    ],
    restaurants: [
      {
        id: 'R1', name: 'A Tasca', island: 'PDL', cuisine: 'Regional', rating: 4.8, reviews: 2450, image: 'https://picsum.photos/400/300?random=20',
        description: 'Traditional Azorean cuisine in a rustic and lively atmosphere. Famous for tuna steak.',
        adminEmail: 'atasca@azores4you.com',
        adminPassword: 'tasca',
        dishes: [
          { name: 'Tuna Steak', description: 'Fresh tuna steak with sesame seeds.', price: 18, image: 'https://picsum.photos/300/200?random=21' },
          { name: 'Polvo à Lagareiro', description: 'Roasted octopus with punched potatoes.', price: 22, image: 'https://picsum.photos/300/200?random=22' }
        ]
      },
      {
        id: 'R2', name: 'O Pescador', island: 'TER', cuisine: 'Seafood', rating: 4.6, reviews: 890, image: 'https://picsum.photos/400/300?random=24',
        description: 'The best fresh fish in Terceira, located by the harbor.',
        dishes: [
          { name: 'Grilled Limpets', description: 'Grilled limpets with garlic butter.', price: 12, image: 'https://picsum.photos/300/200?random=25' },
          { name: 'Alcatra', description: 'Meat dish slow-cooked in a clay pot.', price: 19, image: 'https://picsum.photos/300/200?random=26' }
        ]
      }
    ],
    activities: [
      { id: 'A1', title: 'Sete Cidades Trail', type: 'trail', island: 'PDL', image: 'https://picsum.photos/400/300?random=30', description: 'Walk around the crater of the blue and green lakes.', distance: '12km', duration: '4h', difficulty: 'Moderado' },
      { id: 'A2', title: 'Algar do Carvão', type: 'landscape', island: 'TER', image: 'https://picsum.photos/400/300?random=31', description: 'Descend into an ancient volcanic chimney.' },
    ]
  },
  es: {
    airports: [
      { code: 'PDL', name: 'Aeropuerto João Paulo II', location: 'São Miguel', isAzores: true },
      { code: 'TER', name: 'Aeropuerto das Lajes', location: 'Terceira', isAzores: true },
    ],
    hotels: [
      { id: 'H1', name: 'Azores Royal Garden', island: 'PDL', stars: 4, pricePerNight: 120, image: 'https://picsum.photos/400/300?random=1', description: 'Hotel de lujo con jardín japonés e spa.' },
      { id: 'H2', name: 'Terra Nostra Garden', island: 'PDL', stars: 5, pricePerNight: 200, image: 'https://picsum.photos/400/300?random=2', description: 'Ubicado en Furnas con piscinas termales.' },
    ],
    restaurants: [
      {
        id: 'R1', name: 'A Tasca', island: 'PDL', cuisine: 'Regional', rating: 4.8, reviews: 2450, image: 'https://picsum.photos/400/300?random=20',
        description: 'Cocina tradicional azoriana en un ambiente rústico e animado.',
        dishes: [
          { name: 'Filete de Atún', description: 'Filete de atún fresco con semillas de sésamo.', price: 18, image: 'https://picsum.photos/300/200?random=21' },
          { name: 'Polvo à Lagareiro', description: 'Pulpo asado con patatas golpeadas.', price: 22, image: 'https://picsum.photos/300/200?random=22' }
        ]
      },
      {
        id: 'R2', name: 'O Pescador', island: 'TER', cuisine: 'Marisco', rating: 4.6, reviews: 890, image: 'https://picsum.photos/400/300?random=24',
        description: 'El mejor pescado fresco en Terceira, ubicado junto al puerto.',
        dishes: [
          { name: 'Lapas a la Plancha', description: 'Lapas a la plancha con mantequilla de ajo.', price: 12, image: 'https://picsum.photos/300/200?random=25' },
          { name: 'Alcatra', description: 'Plato de carne cocinado lentamente en olla de barro.', price: 19, image: 'https://picsum.photos/300/200?random=26' }
        ]
      }
    ],
    activities: [
      { id: 'A1', title: 'Sendero Sete Cidades', type: 'trail', island: 'PDL', image: 'https://picsum.photos/400/300?random=30', description: 'Camine alrededor del cráter de los lagos azul e verde.' },
      { id: 'A2', title: 'Algar do Carvão', type: 'landscape', island: 'TER', image: 'https://picsum.photos/400/300?random=31', description: 'Descienda al interior de una antigua chimenea volcánica.' },
    ]
  },
  it: {
    airports: [
      { code: 'PDL', name: 'Aeroporto João Paulo II', location: 'São Miguel', isAzores: true },
      { code: 'TER', name: 'Aeroporto das Lajes', location: 'Terceira', isAzores: true },
    ],
    hotels: [
      { id: 'H1', name: 'Azores Royal Garden', island: 'PDL', stars: 4, pricePerNight: 120, image: 'https://picsum.photos/400/300?random=1', description: 'Hotel di lusso con giardino giapponese e spa.' },
      { id: 'H2', name: 'Terra Nostra Garden', island: 'PDL', stars: 5, pricePerNight: 200, image: 'https://picsum.photos/400/300?random=2', description: 'Situato a Furnas con piscine termali.' },
    ],
    restaurants: [
      {
        id: 'R1', name: 'A Tasca', island: 'PDL', cuisine: 'Regionale', rating: 4.8, reviews: 2450, image: 'https://picsum.photos/400/300?random=20',
        description: 'Cucina tradizionale delle Azzorre in un\'atmosfera rustica e vivace.',
        dishes: [
          { name: 'Bistecca di Tonno', description: 'Bistecca di tonno fresco con semi di sesamo.', price: 18, image: 'https://picsum.photos/300/200?random=21' },
          { name: 'Polvo à Lagareiro', description: 'Polpo arrosto con patate al forno.', price: 22, image: 'https://picsum.photos/300/200?random=22' }
        ]
      },
      {
        id: 'R2', name: 'O Pescador', island: 'TER', cuisine: 'Frutti di Mare', rating: 4.6, reviews: 890, image: 'https://picsum.photos/400/300?random=24',
        description: 'Il melhor pesce fresco a Terceira, situato vicino al porto.',
        dishes: [
          { name: 'Patelle alla Griglia', description: 'Patelle alla griglia con burro all\'aglio.', price: 12, image: 'https://picsum.photos/300/200?random=25' },
          { name: 'Alcatra', description: 'Piatto di carne cotto lentamente in pentola di terracotta.', price: 19, image: 'https://picsum.photos/300/200?random=26' }
        ]
      }
    ],
    activities: [
      { id: 'A1', title: 'Sentiero Sete Cidades', type: 'trail', island: 'PDL', image: 'https://picsum.photos/400/300?random=30', description: 'Cammina intorno al cratere dei laghi blu e verde.' },
      { id: 'A2', title: 'Algar do Carvão', type: 'landscape', island: 'TER', image: 'https://picsum.photos/400/300?random=31', description: 'Scendi in un antico camino vulcanico.' },
    ]
  },
  de: {
    airports: [
      { code: 'PDL', name: 'Flughafen João Paulo II', location: 'São Miguel', isAzores: true },
      { code: 'TER', name: 'Flughafen Lajes', location: 'Terceira', isAzores: true },
    ],
    hotels: [
      { id: 'H1', name: 'Azores Royal Garden', island: 'PDL', stars: 4, pricePerNight: 120, image: 'https://picsum.photos/400/300?random=1', description: 'Luxushotel mit japanischem Garten und Spa.' },
      { id: 'H2', name: 'Terra Nostra Garden', island: 'PDL', stars: 5, pricePerNight: 200, image: 'https://picsum.photos/400/300?random=2', description: 'In Furnas gelegen mit Thermalbecken.' },
    ],
    restaurants: [
      {
        id: 'R1', name: 'A Tasca', island: 'PDL', cuisine: 'Regional', rating: 4.8, reviews: 2450, image: 'https://picsum.photos/400/300?random=20',
        description: 'Traditionelle azoreanische Küche in rustikaler und lebhafter Atmosphäre.',
        dishes: [
          { name: 'Thunfischsteak', description: 'Frisches Thunfischsteak mit Sesamsamen.', price: 18, image: 'https://picsum.photos/300/200?random=21' },
          { name: 'Polvo à Lagareiro', description: 'Gebratener Oktopus mit geschlagenen Kartoffeln.', price: 22, image: 'https://picsum.photos/300/200?random=22' }
        ]
      },
      {
        id: 'R2', name: 'O Pescador', island: 'TER', cuisine: 'Meeresfrüchte', rating: 4.6, reviews: 890, image: 'https://picsum.photos/400/300?random=24',
        description: 'Der beste frische Fisch auf Terceira, am Hafen gelegen.',
        dishes: [
          { name: 'Gegrillte Napfschnecken', description: 'Gegrillte Napfschnecken mit Knoblauchbutter.', price: 12, image: 'https://picsum.photos/300/200?random=25' },
          { name: 'Alcatra', description: 'Fleischgericht, langsam im Tontopf gegart.', price: 19, image: 'https://picsum.photos/300/200?random=26' }
        ]
      }
    ],
    activities: [
      { id: 'A1', title: 'Sete Cidades Wanderweg', type: 'trail', island: 'PDL', image: 'https://picsum.photos/400/300?random=30', description: 'Wandern Sie um den Krater der blauen und grünen Seen.' },
      { id: 'A2', title: 'Algar do Carvão', type: 'landscape', island: 'TER', image: 'https://picsum.photos/400/300?random=31', description: 'Steigen Sie in einen alten Vulkanschornstein hinab.' },
    ]
  },
};

// Car data is static in structure but descriptions/types will be translated in UI or here
// We'll keep the base object and just assume the images/prices don't change
// Type will be translated in UI
export const CAR_RENTAL_COMPANIES: CarRentalCompany[] = [
  { 
    id: 'comp1', 
    name: 'Ilha Verde', 
    address: 'Campo de São Francisco, 9, 9500-153 Ponta Delgada', 
    email: 'info@ilhaverde.com', 
    contact: '+351 296 304 891',
    image: 'https://picsum.photos/400/300?random=100'
  },
  { 
    id: 'comp2', 
    name: 'Wayzor', 
    address: 'Rua de Lisboa, Edifício Solmar, 9500-216 Ponta Delgada', 
    email: 'reservations@wayzor.pt', 
    contact: '+351 296 301 818',
    image: 'https://picsum.photos/400/300?random=101'
  },
  { 
    id: 'comp3', 
    name: 'Autatlantis', 
    address: 'Rua dos Manajaneiros, 9, 9500-086 Ponta Delgada', 
    email: 'info@autatlantis.com', 
    contact: '+351 296 205 340',
    image: 'https://picsum.photos/400/300?random=102'
  },
];

const CARS_BASE: Car[] = [
  { 
    id: 'C1', 
    model: 'Renault Clio', 
    companyId: 'comp1', 
    type: 'Económico', 
    fuelType: 'Gasolina',
    pricePerDay: 45, 
    seats: 5, 
    image: 'https://picsum.photos/300/200?random=10', 
    isAvailable: true,
    description: 'car_desc_C1',
    features: ['feature_AC', 'feature_Bluetooth', 'feature_Económico', 'feature_Manual']
  },
  { 
    id: 'C2', 
    model: 'Nissan Qashqai', 
    companyId: 'comp2', 
    type: 'SUV', 
    fuelType: 'Gasóleo',
    pricePerDay: 75, 
    seats: 5, 
    image: 'https://picsum.photos/300/200?random=11', 
    isAvailable: true,
    description: 'car_desc_C2',
    features: ['feature_GPS', 'feature_Camera', 'feature_Espaço', 'feature_Automático']
  },
  { 
    id: 'C3', 
    model: 'Fiat 500c', 
    companyId: 'comp3', 
    type: 'Descapotável', 
    fuelType: 'Gasolina',
    pricePerDay: 90, 
    seats: 4, 
    image: 'https://picsum.photos/300/200?random=12', 
    isAvailable: true,
    description: 'car_desc_C3',
    features: ['feature_Teto', 'feature_Estilo', 'feature_Estacionar', 'feature_Manual']
  },
  { 
    id: 'C4', 
    model: 'Volkswagen Polo', 
    companyId: 'comp1', 
    type: 'Económico', 
    fuelType: 'Gasolina',
    pricePerDay: 48, 
    seats: 5, 
    image: 'https://picsum.photos/300/200?random=13', 
    isAvailable: false,
    description: 'car_desc_C4',
    features: ['feature_Sensores', 'feature_CarPlay', 'feature_Seguro', 'feature_Manual']
  },
  { 
    id: 'C5', 
    model: 'Toyota RAV4', 
    companyId: 'comp2', 
    type: 'SUV', 
    fuelType: 'Híbrido',
    pricePerDay: 85, 
    seats: 5, 
    image: 'https://picsum.photos/300/200?random=14', 
    isAvailable: false,
    description: 'car_desc_C5',
    features: ['feature_Híbrido', 'feature_4x4', 'feature_Cruise', 'feature_Automático']
  },
  { 
    id: 'C6', 
    model: 'Mini Cooper Cab', 
    companyId: 'comp3', 
    type: 'Descapotável', 
    fuelType: 'Gasolina',
    pricePerDay: 110, 
    seats: 4, 
    image: 'https://picsum.photos/300/200?random=15', 
    isAvailable: true,
    description: 'car_desc_C6',
    features: ['feature_Sport', 'feature_Sound', 'feature_Pele', 'feature_Automático']
  },
  { 
    id: 'C7', 
    model: 'Mercedes Vito', 
    companyId: 'comp1', 
    type: 'Carrinha', 
    fuelType: 'Gasóleo',
    pricePerDay: 120, 
    seats: 9, 
    image: 'https://picsum.photos/300/200?random=16', 
    isAvailable: true,
    description: 'car_desc_C7',
    features: ['feature_9Lugares', 'feature_Bagagem', 'feature_ACTraseiro', 'feature_Manual']
  },
  { 
    id: 'C8', 
    model: 'Dacia Duster', 
    companyId: 'comp2', 
    type: 'SUV', 
    fuelType: 'Gasóleo',
    pricePerDay: 60, 
    seats: 5, 
    image: 'https://picsum.photos/300/200?random=17', 
    isAvailable: true,
    description: 'car_desc_C8',
    features: ['feature_Económico', 'feature_Robusto', 'feature_Bluetooth', 'feature_Manual']
  },
  { 
    id: 'C9', 
    model: 'Opel Corsa', 
    companyId: 'comp3', 
    type: 'Económico', 
    fuelType: 'Gasolina',
    pricePerDay: 42, 
    seats: 5, 
    image: 'https://picsum.photos/300/200?random=18', 
    isAvailable: true,
    description: 'car_desc_C9',
    features: ['feature_AC', 'feature_USB', 'feature_Confortável', 'feature_Manual']
  },
  { 
    id: 'C10', 
    model: 'Ford Transit Custom', 
    companyId: 'comp2', 
    type: 'Carrinha', 
    fuelType: 'Gasóleo',
    pricePerDay: 135, 
    seats: 9, 
    image: 'https://picsum.photos/300/200?random=19', 
    isAvailable: true,
    description: 'car_desc_C10',
    features: ['feature_9Lugares', 'feature_Camera360', 'feature_Sync3', 'feature_Manual']
  }
];

export const FLIGHTS: Flight[] = [
  // LISBOA -> PONTA DELGADA (PDL)
  { 
    id: 'TP1869', airline: 'TAP Air Portugal', flightNumber: 'TP1869', 
    origin: 'LIS', destination: 'PDL', 
    departureTime: '08:00', arrivalTime: '10:25', 
    price: 120, status: 'A Horas', stops: 0, duration: '2h 25m' 
  },
  { 
    id: 'S4121', airline: 'SATA Azores Airlines', flightNumber: 'S4121', 
    origin: 'LIS', destination: 'PDL', 
    departureTime: '14:30', arrivalTime: '16:55', 
    price: 145, status: 'A Horas', stops: 0, duration: '2h 25m' 
  },
  { 
    id: 'FR2345', airline: 'Ryanair', flightNumber: 'FR2345', 
    origin: 'LIS', destination: 'PDL', 
    departureTime: '21:00', arrivalTime: '23:25', 
    price: 65, status: 'Atrasado', stops: 0, duration: '2h 25m' 
  },

  // PORTO -> PONTA DELGADA
  { 
    id: 'S4172', airline: 'SATA Azores Airlines', flightNumber: 'S4172', 
    origin: 'OPO', destination: 'PDL', 
    departureTime: '11:15', arrivalTime: '13:40', 
    price: 95, status: 'A Horas', stops: 0, duration: '2h 25m' 
  },
  { 
    id: 'FR7890', airline: 'Ryanair', flightNumber: 'FR7890', 
    origin: 'OPO', destination: 'PDL', 
    departureTime: '06:30', arrivalTime: '08:55', 
    price: 45, status: 'Embarque', stops: 0, duration: '2h 25m' 
  },

  // INTERNACIONAL DIRETO (EUA/CANADÁ)
  { 
    id: 'S4221', airline: 'SATA Azores Airlines', flightNumber: 'S4221', 
    origin: 'BOS', destination: 'PDL', 
    departureTime: '21:30', arrivalTime: '06:15', 
    price: 450, status: 'A Horas', stops: 0, duration: '4h 45m' 
  },
  { 
    id: 'S4333', airline: 'SATA Azores Airlines', flightNumber: 'S4333', 
    origin: 'YYZ', destination: 'TER', 
    departureTime: '20:45', arrivalTime: '07:00', 
    price: 480, status: 'A Horas', stops: 0, duration: '6h 15m' 
  },
  { 
    id: 'UA1234', airline: 'United Airlines', flightNumber: 'UA1234', 
    origin: 'JFK', destination: 'PDL', 
    departureTime: '22:10', arrivalTime: '07:20', 
    price: 520, status: 'Cancelado', stops: 0, duration: '5h 10m' 
  },

  // COM ESCALAS (EUROPA)
  { 
    id: 'BA556', airline: 'British Airways', flightNumber: 'BA556', 
    origin: 'LHR', destination: 'PDL', 
    departureTime: '07:30', arrivalTime: '13:45', 
    price: 210, status: 'A Horas', stops: 1, duration: '6h 15m',
    layover: 'Escala em LIS (1h 40m)'
  },
  { 
    id: 'LH987', airline: 'Lufthansa', flightNumber: 'LH987', 
    origin: 'FRA', destination: 'PDL', 
    departureTime: '09:00', arrivalTime: '15:30', 
    price: 290, status: 'A Horas', stops: 1, duration: '7h 30m',
    layover: 'Escala em LIS (2h 10m)'
  },

  // INTER-ILHAS (SATA AIR AÇORES)
  { 
    id: 'SP401', airline: 'SATA Air Açores', flightNumber: 'SP401', 
    origin: 'PDL', destination: 'HOR', 
    departureTime: '09:00', arrivalTime: '09:50', 
    price: 60, status: 'A Horas', stops: 0, duration: '0h 50m' 
  },
  { 
    id: 'SP405', airline: 'SATA Air Açores', flightNumber: 'SP405', 
    origin: 'PDL', destination: 'PIX', 
    departureTime: '15:00', arrivalTime: '15:50', 
    price: 65, status: 'A Horas', stops: 0, duration: '0h 50m' 
  },
  { 
    id: 'SP510', airline: 'SATA Air Açores', flightNumber: 'SP510', 
    origin: 'TER', destination: 'PDL', 
    departureTime: '18:30', arrivalTime: '19:15', 
    price: 55, status: 'Embarque', stops: 0, duration: '0h 45m' 
  },
  { 
    id: 'SP620', airline: 'SATA Air Açores', flightNumber: 'SP620', 
    origin: 'FLW', destination: 'PDL', 
    departureTime: '11:30', arrivalTime: '13:45', 
    price: 88, status: 'A Horas', stops: 1, duration: '2h 15m',
    layover: 'Escala na Horta (HOR)'
  },
  
  // VOOS EXTRA PARA ENCHER A LISTA
  { 
    id: 'TP1871', airline: 'TAP Air Portugal', flightNumber: 'TP1871', 
    origin: 'LIS', destination: 'TER', 
    departureTime: '16:00', arrivalTime: '18:35', 
    price: 135, status: 'A Horas', stops: 0, duration: '2h 35m' 
  },
  { 
    id: 'S4128', airline: 'SATA Azores Airlines', flightNumber: 'S4128', 
    origin: 'PDL', destination: 'BOS', 
    departureTime: '18:15', arrivalTime: '20:45', 
    price: 410, status: 'A Horas', stops: 0, duration: '5h 30m' 
  },
  { 
    id: 'FR555', airline: 'Ryanair', flightNumber: 'FR555', 
    origin: 'LIS', destination: 'TER', 
    departureTime: '06:15', arrivalTime: '08:50', 
    price: 55, status: 'A Horas', stops: 0, duration: '2h 35m' 
  },
];

// DATA FOR BUS SYSTEM - EXTENDED LIST OF FREGUESIAS AND LOCALITIES
export const ISLAND_LOCALITIES: Record<string, string[]> = {
  'PDL': [
    'Ponta Delgada (Centro)', 'São Sebastião', 'São Pedro', 'Santa Clara', 'Fajã de Baixo', 'Fajã de Cima', 'São Roque', 'Rosto de Cão (Livramento)', 'Rosto de Cão (São Roque)',
    'Ribeira Grande', 'Ribeira Seca', 'Ribeirinha', 'Conceição', 'Matriz', 'Santa Bárbara',
    'Lagoa', 'Nossa Senhora do Rosário', 'Santa Cruz', 'Água de Pau', 'Cabouco', 'Remédios',
    'Vila Franca do Campo', 'São Miguel', 'São Pedro', 'Ribeira das Tainhas', 'Ponta Garça', 'Água de Alto',
    'Povoação', 'Furnas', 'Nossa Senhora dos Remédios', 'Faial da Terra', 'Ribeira Quente', 'Água Retorta',
    'Nordeste', 'Achadinha', 'Achada', 'Salga', 'Lomba da Fazenda', 'Santana', 'Algarvia', 'São Pedro de Nordestinho', 'Santo António de Nordestinho',
    'Sete Cidades', 'Ginetes', 'Mosteiros', 'Candelária', 'Feteiras', 'Ajuda da Bretanha', 'Pilar da Bretanha', 'Remédios (Bretanha)', 'Santa Bárbara', 'Santo António',
    'Capelas', 'São Vicente Ferreira', 'Fenais da Luz', 'Rabo de Peixe', 'Calhetas', 'Pico da Pedra', 'Fenais da Ajuda', 'Lomba de São Pedro', 'Lomba da Maia', 'São Brás', 'Maia', 'Porto Formoso'
  ],
  'TER': [
    'Angra do Heroísmo (Centro)', 'Sé', 'Nossa Senhora da Conceição', 'São Pedro', 'Santa Luzia',
    'Praia da Vitória (Centro)', 'Santa Cruz', 'Cabo da Praia', 'Fonte do Bastardo', 'Fontinhas',
    'São Mateus da Calheta', 'São Bartolomeu de Regatos', 'Cinco Ribeiras', 'Santa Bárbara', 'Doze Ribeiras', 'Serreta', 'Raminho', 'Altares',
    'Biscoitos', 'Quatro Ribeiras', 'Agualva', 'Vila Nova', 'Lajes', 'São Brás', 'Porto Martins', 'Fonte do Bastardo',
    'São Sebastião', 'Porto Judeu', 'Feteira', 'Ribeirinha', 'Posto Santo', 'Terra Chã', 'São Bento'
  ],
  'HOR': [
    'Horta (Matriz)', 'Horta (Angústias)', 'Horta (Conceição)', 
    'Flamengos', 'Feteira', 'Castelo Branco', 'Capelo', 'Praia do Norte', 'Cedros', 'Salão', 'Ribeirinha', 'Pedro Miguel'
  ],
  'PIX': [
    'Madalena', 'Criação Velha', 'Candelária', 'São Mateus', 'São Caetano', 'Bandeiras',
    'São Roque do Pico', 'Santa Luzia', 'Santo António', 'Prainha', 'Santo Amaro',
    'Lajes do Pico', 'São João', 'Piedade', 'Ribeiras', 'Calheta de Nesquim'
  ],
  'SJZ': [
    'Velas', 'Santo Amaro', 'Urzelina', 'Manadas', 'Rosais', 'Beira',
    'Calheta', 'Ribeira Seca', 'Norte Pequeno', 'Norte Grande', 'Topo', 'Santo Antão'
  ],
  'GRW': [
    'Santa Cruz da Graciosa', 'Guadalupe', 'Praia (São Mateus)', 'Luz'
  ],
  'FLW': [
    'Santa Cruz das Flores', 'Caveira', 'Cedros', 'Ponta Delgada',
    'Lajes das Flores', 'Fazenda', 'Lajedo', 'Fajã Grande', 'Fajãzinha', 'Mosteiro', 'Lomba'
  ],
  'CVU': [
    'Vila do Corvo'
  ],
  'SMA': [
    'Vila do Porto', 'Almagreira', 'Santa Bárbara', 'Santo Espírito', 'São Pedro'
  ]
};

// --- BUS SCHEDULE GENERATOR ---
// Generate simulated bus data for ALL localities within each island
// This ensures "Simula com tudo" covers every possible From/To combination

const COMPANIES: Record<string, string[]> = {
    'PDL': ['Auto Viação Micaelense', 'Varela', 'CRP'],
    'TER': ['EVT'],
    'HOR': ['Farias'],
    'PIX': ['Cristiano'],
    'SJZ': ['Viação de São Jorge'],
    'GRW': ['ETG'],
    'FLW': ['UTC'],
    'SMA': ['TST'],
    'CVU': ['CM Corvo']
};

const HUB_TIMES_OUTBOUND = ['07:30', '09:15', '12:30', '14:00', '17:15', '18:45', '20:00'];
const HUB_TIMES_INBOUND = ['06:45', '08:30', '11:00', '13:15', '16:30', '18:00'];
const LOCAL_TIMES = ['08:00', '12:00', '17:00']; // For non-hub routes

const GENERATED_SCHEDULES: BusSchedule[] = [];

Object.entries(ISLAND_LOCALITIES).forEach(([island, locs]) => {
  const companies = COMPANIES[island] || ['Transportes Açores'];
  
  // Create a schedule between EVERY pair of locations
  // Note: O(N^2) generation, but N is small per island (~50 max for PDL), so ~2500 entries max per island.
  // This is acceptable for a client-side demo to ensure total coverage.
  
  locs.forEach(origin => {
    locs.forEach(destination => {
      if (origin === destination) return;
      
      const isHubRoute = origin.includes('(Centro)') || origin.includes('Velas') || origin.includes('Horta') || origin.includes('Madalena') || origin.includes('Santa Cruz') || origin.includes('Vila do Porto');
      const times = isHubRoute ? HUB_TIMES_OUTBOUND : LOCAL_TIMES;
      
      // Add slight randomness to times to make it feel real
      const adjustedTimes = times.map(t => {
         const [h, m] = t.split(':').map(Number);
         const variation = Math.floor(Math.random() * 15) - 7; // +/- 7 mins
         let newM = m + variation;
         let newH = h;
         if (newM < 0) { newM += 60; newH -= 1; }
         if (newM >= 60) { newM -= 60; newH += 1; }
         return `${String(newH).padStart(2, '0')}:${String(newM).padStart(2, '0')}`;
      }).sort();

      GENERATED_SCHEDULES.push({
         id: `gen-${island}-${origin.substring(0,3)}-${destination.substring(0,3)}-${Math.random().toString(36).substr(2,5)}`,
         company: companies[Math.floor(Math.random() * companies.length)],
         island: island,
         origin: origin,
         destination: destination,
         times: adjustedTimes,
         price: 1.50 + (Math.random() * 4.50), // Prices between 1.50 and 6.00
         duration: `${10 + Math.floor(Math.random() * 80)}m`
      });
    });
  });
});

export const BUS_SCHEDULES: BusSchedule[] = GENERATED_SCHEDULES;

export const TOUR_GUIDES: TourGuide[] = [
  { id: 'G1', name: 'João Silva', image: 'https://picsum.photos/200/200?random=201', rating: 4.9, price: 45, languages: ['PT', 'EN'], specialty: 'Geologia e Vulcões' },
  { id: 'G2', name: 'Maria Santos', image: 'https://picsum.photos/200/200?random=202', rating: 4.8, price: 40, languages: ['PT', 'ES', 'EN'], specialty: 'Flora e Fauna' },
  { id: 'G3', name: 'António Costa', image: 'https://picsum.photos/200/200?random=203', rating: 5.0, price: 55, languages: ['PT', 'EN', 'DE'], specialty: 'História e Cultura' },
  { id: 'G4', name: 'Sofia Pereira', image: 'https://picsum.photos/200/200?random=204', rating: 4.7, price: 35, languages: ['PT', 'FR', 'EN'], specialty: 'Fotografia de Natureza' },
  { id: 'G5', name: 'Ricardo Melo', image: 'https://picsum.photos/200/200?random=205', rating: 4.9, price: 50, languages: ['PT', 'IT', 'EN'], specialty: 'Trilhos de Montanha' },
];

export const getAirports = (lang: Language): Airport[] => {
  return (DATA[lang] && DATA[lang].airports) ? DATA[lang].airports : DATA['pt'].airports;
};

export const getHotels = (lang: Language): Hotel[] => {
  return (DATA[lang] && DATA[lang].hotels) ? DATA[lang].hotels : DATA['pt'].hotels;
};

export const getRestaurants = (lang: Language): Restaurant[] => {
  return (DATA[lang] && DATA[lang].restaurants) ? DATA[lang].restaurants : DATA['pt'].restaurants;
};

export const getActivities = (lang: Language): Activity[] => {
  return (DATA[lang] && DATA[lang].activities) ? DATA[lang].activities : DATA['pt'].activities;
};

export const getCars = (lang: Language): Car[] => {
  // Cars don't have descriptions in the data structure provided in types.ts (only type, model, company)
  // Type is a union string which we will translate in the UI layer using keys
  return CARS_BASE;
};

export const getFlights = (lang: Language): Flight[] => {
  // Flight data is mostly codes and numbers, except status which is handled in UI
  return FLIGHTS;
};
