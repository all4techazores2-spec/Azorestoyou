
import { BusSchedule } from './types';

const crpBuses: BusSchedule[] = [
  // 1. P. Delgada <-> Ribeira Grande
  {
    id: 'CRP_PDL_RG',
    company: 'CRP',
    island: 'PDL',
    origin: 'Ponta Delgada',
    destination: 'Ribeira Grande',
    times: ['06:15', '07:15', '08:25', '11:00', '12:00', '15:15', '16:15', '17:15', '17:45', '18:15', '19:15'],
    schedule: {
      weekdays: ['06:15', '07:15', '08:25', '11:00', '12:00', '15:15', '16:15', '17:15', '17:45', '18:15', '19:15'],
      saturdays: ['06:45', '07:15', '08:25', '11:00', '12:00', '15:15', '17:30', '18:15', '19:15'],
      sundays: ['06:15', '07:15', '15:15']
    },
    price: 2.5,
    duration: '45m'
  },
  {
    id: 'CRP_RG_PDL',
    company: 'CRP',
    island: 'PDL',
    origin: 'Ribeira Grande',
    destination: 'Ponta Delgada',
    times: ['07:15', '08:15', '08:45', '10:15', '12:15', '13:30', '14:30', '17:45', '18:30(B)', '19:15(B)'],
    schedule: {
      weekdays: ['07:15', '08:15', '08:45', '10:15', '12:15', '13:30', '14:30', '17:45', '18:30(B)', '19:15(B)'],
      saturdays: ['07:15', '08:15', '08:45', '10:15', '12:15', '13:30', '14:30', '18:30(B)'],
      sundays: ['08:45', '10:15', '12:15', '18:30(B)', '19:15(B)']
    },
    price: 2.5,
    duration: '45m'
  },

  // 2. P. Delgada <-> Rabo de Peixe
  {
    id: 'CRP_PDL_RP',
    company: 'CRP',
    island: 'PDL',
    origin: 'Ponta Delgada',
    destination: 'Rabo de Peixe',
    times: ['07:35', '08:15', '09:15', '11:30', '12:30', '13:30', '14:30', '15:30', '16:30', '17:30', '19:15'],
    schedule: {
      weekdays: ['07:35', '08:15', '09:15', '11:30', '12:30', '13:30', '14:30', '15:30', '16:30', '17:30', '19:15'],
      saturdays: ['07:35', '08:15', '09:15', '11:30', '12:30', '13:30', '14:30', '15:30', '16:30', '17:30', '19:15'],
      sundays: ['08:30', '10:30', '12:30', '14:30', '16:30', '18:30', '20:30']
    },
    price: 2.0,
    duration: '35m'
  },
  {
    id: 'CRP_RP_PDL',
    company: 'CRP',
    island: 'PDL',
    origin: 'Rabo de Peixe',
    destination: 'Ponta Delgada',
    times: ['07:45', '10:00', '11:15', '12:45', '13:45', '14:45', '15:45', '16:45', '17:45'],
    schedule: {
      weekdays: ['07:45', '10:00', '11:15', '12:45', '13:45', '14:45', '15:45', '16:45', '17:45'],
      saturdays: ['07:45', '10:00', '11:15', '12:45', '13:45', '15:45', '16:45', '17:45'],
      sundays: ['06:00(F)', '07:00( )', '07:45', '10:00', '12:45', '14:45', '16:45', '18:45']
    },
    price: 2.0,
    duration: '35m'
  },

  // 3. P. Delgada <-> Fenais da Ajuda
  {
    id: 'CRP_PDL_FENAIS',
    company: 'CRP',
    island: 'PDL',
    origin: 'Ponta Delgada',
    destination: 'Fenais da Ajuda',
    times: ['06:45', '11:00', '16:15', '18:15'],
    schedule: {
      weekdays: ['06:45', '11:00', '16:15', '18:15'],
      saturdays: ['06:45', '11:00', '16:15', '18:15'],
      sundays: ['06:45', '14:15( )', '16:15(F)']
    },
    price: 3.5,
    duration: '1h 10m'
  },
  {
    id: 'CRP_FENAIS_PDL',
    company: 'CRP',
    island: 'PDL',
    origin: 'Fenais da Ajuda',
    destination: 'Ponta Delgada',
    times: ['06:50(E)', '07:55(B)', '09:40', '12:45', '17:10'],
    schedule: {
      weekdays: ['06:50(E)', '07:55(B)', '09:40', '12:45', '17:10'],
      saturdays: ['06:50(E)', '07:55(B)', '09:40', '12:45', '15:45'],
      sundays: ['07:55', '15:45( )', '17:10(F)']
    },
    price: 3.5,
    duration: '1h 10m'
  },

  // 4. P. Delgada <-> Maia
  {
    id: 'CRP_PDL_MAIA',
    company: 'CRP',
    island: 'PDL',
    origin: 'Ponta Delgada',
    destination: 'Maia',
    times: ['07:15', '11:00', '12:00', '16:15', '18:15'],
    schedule: {
      weekdays: ['07:15', '11:00', '12:00', '16:15', '18:15'],
      saturdays: ['07:15', '11:00', '12:00', '16:15'],
      sundays: ['14:15( )', '16:15(F)']
    },
    price: 3.0,
    duration: '1h 00m'
  },
  {
    id: 'CRP_MAIA_PDL',
    company: 'CRP',
    island: 'PDL',
    origin: 'Maia',
    destination: 'Ponta Delgada',
    times: ['07:05', '10:25', '13:50', '17:30'],
    schedule: {
      weekdays: ['07:05', '10:25', '13:50', '17:30'],
      saturdays: ['07:05', '10:25', '13:50', '16:00'],
      sundays: ['08:15', '16:00( )', '17:30(F)']
    },
    price: 3.0,
    duration: '1h 00m'
  },

  // 5. P. Delgada <-> Furnas
  {
    id: 'CRP_PDL_FURNAS',
    company: 'CRP',
    island: 'PDL',
    origin: 'Ponta Delgada',
    destination: 'Furnas',
    times: ['07:15', '15:15'],
    schedule: {
      weekdays: ['07:15', '15:15'],
      saturdays: ['07:15', '15:15'],
      sundays: ['07:15', '15:15']
    },
    price: 4.0,
    duration: '1h 20m'
  },
  {
    id: 'CRP_FURNAS_PDL',
    company: 'CRP',
    island: 'PDL',
    origin: 'Furnas',
    destination: 'Ponta Delgada',
    times: ['09:10', '17:10(E)', '18:10(B)'],
    schedule: {
      weekdays: ['09:10', '17:10(E)', '18:10(B)'],
      saturdays: ['09:10', '17:10(E)', '18:10(B)'],
      sundays: ['09:10', '17:10(E)', '18:10(B)']
    },
    price: 4.0,
    duration: '1h 20m'
  },

  // 6. P. Delgada <-> Nordeste
  {
    id: 'CRP_PDL_NORDESTE',
    company: 'CRP',
    island: 'PDL',
    origin: 'Ponta Delgada',
    destination: 'Nordeste',
    times: ['06:45', '11:00', '16:15', '18:30(D)'],
    schedule: {
      weekdays: ['06:45', '11:00', '16:15', '18:30(D)'],
      saturdays: ['06:45', '14:15'],
      sundays: ['06:45', '14:15( )', '16:15(F)']
    },
    price: 5.0,
    duration: '1h 45m'
  },
  {
    id: 'CRP_NORDESTE_PDL',
    company: 'CRP',
    island: 'PDL',
    origin: 'Nordeste',
    destination: 'Ponta Delgada',
    times: ['06:45', '11:30', '16:00'],
    schedule: {
      weekdays: ['06:45', '11:30', '16:00'],
      saturdays: ['06:45', '14:30'],
      sundays: ['06:45', '14:30( )', '16:00(F)']
    },
    price: 5.0,
    duration: '1h 45m'
  }
];

export { crpBuses };
