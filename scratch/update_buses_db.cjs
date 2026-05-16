
const fs = require('fs');
const path = require('path');

// Path to db.json
const dbPath = path.join(process.cwd(), 'db.json');

// Combined Data
const allBuses = [
  // Varela (Previously added)
  {
    id: 'VAR_PDL_FAJA_BAIXO', company: 'Varela', island: 'PDL', origin: 'Ponta Delgada', destination: 'Fajã de Baixo',
    schedule: {
      weekdays: ['08:00', '08:15', '09:10', '10:10', '11:10', '12:10', '12:40', '13:10', '14:00', '16:10', '17:05', '18:15', '19:10', '20:00', '21:00', '22:15'],
      saturdays: ['08:00', '08:45', '09:10', '10:10', '11:10', '12:10', '13:10', '16:00', '18:00'],
      sundays: ['09:30', '16:00', '18:00']
    },
    price: 1.5, duration: '15m'
  },
  {
    id: 'VAR_FAJA_BAIXO_PDL', company: 'Varela', island: 'PDL', origin: 'Fajã de Baixo', destination: 'Ponta Delgada',
    schedule: {
      weekdays: ['07:00', '08:00', '08:25', '09:05', '09:35', '10:35', '11:35', '12:35', '13:00', '13:30', '14:25', '16:35', '17:30', '18:40', '20:30', '21:30'],
      saturdays: ['07:00', '08:00', '08:25', '09:05', '09:35', '10:35', '11:35', '12:35', '13:30', '16:30'],
      sundays: ['08:00', '13:00', '16:30']
    },
    price: 1.5, duration: '15m'
  },
  {
    id: 'VAR_PDL_FAJA_CIMA', company: 'Varela', island: 'PDL', origin: 'Ponta Delgada', destination: 'Fajã de Cima',
    schedule: {
      weekdays: ['07:05', '07:30', '08:05', '08:40', '09:05', '10:05', '11:05', '12:00', '12:35', '13:10', '14:00', '15:00', '16:00', '16:55', '17:10', '17:55', '18:10', '18:45', '19:10', '20:00', '21:00', '22:15'],
      saturdays: ['07:40', '08:05', '09:05', '10:05', '11:05', '12:10', '13:00', '14:10', '17:10', '18:45'],
      sundays: ['13:00', '14:15']
    },
    price: 1.5, duration: '20m'
  },
  {
    id: 'VAR_FAJA_CIMA_PDL', company: 'Varela', island: 'PDL', origin: 'Fajã de Cima', destination: 'Ponta Delgada',
    schedule: {
      weekdays: ['06:55', '07:25', '07:50', '08:25', '09:10', '09:25', '10:25', '11:25', '12:20', '13:00', '13:30', '14:20', '15:20', '16:20', '17:15', '17:30', '18:30', '19:30'],
      saturdays: ['06:55', '07:25', '08:00', '08:25', '09:25', '10:25', '11:25', '12:30', '13:20', '14:30', '17:30'],
      sundays: ['13:20', '14:30']
    },
    price: 1.5, duration: '20m'
  },
  {
    id: 'VAR_PDL_POPULO', company: 'Varela', island: 'PDL', origin: 'Ponta Delgada', destination: 'Praia do Pópulo',
    schedule: {
      weekdays: ['07:00', '07:40', '09:30', '10:30', '12:10', '12:35', '13:45', '14:45', '16:00', '17:40', '17:50', '19:00', '19:10'],
      saturdays: ['07:35', '09:30', '10:30', '12:35', '14:00', '17:50'],
      sundays: ['09:00', '10:30', '16:00', '16:45(A)', '17:45(A)']
    },
    price: 1.8, duration: '25m'
  },
  {
    id: 'VAR_POPULO_PDL', company: 'Varela', island: 'PDL', origin: 'Praia do Pópulo', destination: 'Ponta Delgada',
    schedule: {
      weekdays: ['07:10', '07:20', '07:40', '08:00', '08:05', '08:10', '08:20', '09:40', '10:10', '10:30', '10:45', '12:10', '13:40', '15:05', '17:00', '17:20', '17:35', '18:20', '18:45'],
      saturdays: ['07:20', '07:55', '08:40', '09:40', '10:45', '11:55', '12:55', '14:00', '15:40', '18:10', '18:50(A)'],
      sundays: ['09:00', '10:35', '10:45', '12:55', '17:00(A)', '18:00(A)', '18:20(B)', '18:50(A)']
    },
    price: 1.8, duration: '25m'
  },
  {
    id: 'VAR_PDL_LAGOA', company: 'Varela', island: 'PDL', origin: 'Ponta Delgada', destination: 'Lagoa',
    schedule: {
      weekdays: ['07:00', '07:25', '07:50', '08:25', '09:00', '09:30', '10:00', '11:00', '11:30', '12:10', '12:35', '13:00', '13:30', '13:45', '14:15', '15:00', '15:30', '15:50', '16:00', '16:15', '16:45', '17:00', '17:20', '17:30', '17:50', '18:05', '18:30', '18:45', '19:10', '19:30', '20:40'],
      saturdays: ['07:25', '07:35', '07:50', '09:00', '09:30', '10:15', '11:00', '11:30', '12:35', '13:15', '14:00', '15:00', '16:00', '17:30', '17:50', '19:30'],
      sundays: ['09:00', '10:00', '12:15', '15:00', '16:00', '17:15', '18:00', '19:10', '20:30']
    },
    price: 2.2, duration: '35m'
  },
  {
    id: 'VAR_LAGOA_PDL', company: 'Varela', island: 'PDL', origin: 'Lagoa', destination: 'Ponta Delgada',
    schedule: {
      weekdays: ['06:25', '06:50', '07:00', '07:10', '07:20', '07:30', '07:45', '07:50', '08:00', '08:25', '08:45', '09:15', '09:30', '10:00', '10:05', '10:20', '11:00', '11:45', '12:00', '12:25', '12:50', '13:05', '13:30', '14:30', '14:50', '15:15', '16:05', '16:50', '17:10', '17:25', '17:40', '18:10', '18:40', '19:15', '20:05'],
      saturdays: ['07:00', '07:10', '07:30', '07:45', '07:50', '08:25', '08:30', '08:40', '09:30', '10:00', '11:00', '11:45', '12:25', '12:45', '13:45', '14:15', '15:30', '17:00', '18:00', '18:40'],
      sundays: ['07:25', '08:20', '08:50', '10:25', '12:45', '12:50', '15:40', '17:45', '18:10(B)', '18:40']
    },
    price: 2.2, duration: '35m'
  },

  // CRP (Caetano Raposo & Pereira)
  {
    id: 'CRP_PDL_RG', company: 'CRP', island: 'PDL', origin: 'Ponta Delgada', destination: 'Ribeira Grande',
    schedule: {
      weekdays: ['06:15', '07:15', '08:25', '11:00', '12:00', '15:15', '16:15', '17:15', '17:45', '18:15', '19:15'],
      saturdays: ['06:45', '07:15', '08:25', '11:00', '12:00', '15:15', '17:30', '18:15', '19:15'],
      sundays: ['06:15', '07:15', '15:15']
    },
    price: 2.5, duration: '45m'
  },
  {
    id: 'CRP_RG_PDL', company: 'CRP', island: 'PDL', origin: 'Ribeira Grande', destination: 'Ponta Delgada',
    schedule: {
      weekdays: ['07:15', '08:15', '08:45', '10:15', '12:15', '13:30', '14:30', '17:45', '18:30(B)', '19:15(B)'],
      saturdays: ['07:15', '08:15', '08:45', '10:15', '12:15', '13:30', '14:30', '18:30(B)'],
      sundays: ['08:45', '10:15', '12:15', '18:30(B)', '19:15(B)']
    },
    price: 2.5, duration: '45m'
  },
  {
    id: 'CRP_PDL_RP', company: 'CRP', island: 'PDL', origin: 'Ponta Delgada', destination: 'Rabo de Peixe',
    schedule: {
      weekdays: ['07:35', '08:15', '09:15', '11:30', '12:30', '13:30', '14:30', '15:30', '16:30', '17:30', '19:15'],
      saturdays: ['07:35', '08:15', '09:15', '11:30', '12:30', '13:30', '14:30', '15:30', '16:30', '17:30', '19:15'],
      sundays: ['08:30', '10:30', '12:30', '14:30', '16:30', '18:30', '20:30']
    },
    price: 2.0, duration: '35m'
  },
  {
    id: 'CRP_RP_PDL', company: 'CRP', island: 'PDL', origin: 'Rabo de Peixe', destination: 'Ponta Delgada',
    schedule: {
      weekdays: ['07:45', '10:00', '11:15', '12:45', '13:45', '14:45', '15:45', '16:45', '17:45'],
      saturdays: ['07:45', '10:00', '11:15', '12:45', '13:45', '15:45', '16:45', '17:45'],
      sundays: ['06:00(F)', '07:00( )', '07:45', '10:00', '12:45', '14:45', '16:45', '18:45']
    },
    price: 2.0, duration: '35m'
  },
  {
    id: 'CRP_PDL_FURNAS', company: 'CRP', island: 'PDL', origin: 'Ponta Delgada', destination: 'Furnas',
    schedule: {
      weekdays: ['07:15', '15:15'],
      saturdays: ['07:15', '15:15'],
      sundays: ['07:15', '15:15']
    },
    price: 4.0, duration: '1h 20m'
  },
  {
    id: 'CRP_FURNAS_PDL', company: 'CRP', island: 'PDL', origin: 'Furnas', destination: 'Ponta Delgada',
    schedule: {
      weekdays: ['09:10', '17:10(E)', '18:10(B)'],
      saturdays: ['09:10', '17:10(E)', '18:10(B)'],
      sundays: ['09:10', '17:10(E)', '18:10(B)']
    },
    price: 4.0, duration: '1h 20m'
  },
  {
    id: 'CRP_PDL_NORDESTE', company: 'CRP', island: 'PDL', origin: 'Ponta Delgada', destination: 'Nordeste',
    schedule: {
      weekdays: ['06:45', '11:00', '16:15', '18:30(D)'],
      saturdays: ['06:45', '14:15'],
      sundays: ['06:45', '14:15( )', '16:15(F)']
    },
    price: 5.0, duration: '1h 45m'
  },
  {
    id: 'CRP_NORDESTE_PDL', company: 'CRP', island: 'PDL', origin: 'Nordeste', destination: 'Ponta Delgada',
    schedule: {
      weekdays: ['06:45', '11:30', '16:00'],
      saturdays: ['06:45', '14:30'],
      sundays: ['06:45', '14:30( )', '16:00(F)']
    },
    price: 5.0, duration: '1h 45m'
  }
];

// Read current DB
let db = {};
if (fs.existsSync(dbPath)) {
    db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
}

// Handle both root and 'data' wrapped structure
let target = db.data || db;

// Ensure busSchedules exists
if (!target['busSchedules']) target['busSchedules'] = [];

// Merge all buses
allBuses.forEach(v => {
    // Fill 'times' for backward compatibility
    v.times = v.schedule.weekdays;
    
    const idx = target['busSchedules'].findIndex(s => s.id === v.id);
    if (idx !== -1) {
        target['busSchedules'][idx] = v;
    } else {
        target['busSchedules'].push(v);
    }
});

// Save back
fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
console.log("Successfully injected Varela and CRP bus schedules into db.json");
