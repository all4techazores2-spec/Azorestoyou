
import { BusSchedule } from '../types';

const avmBuses: BusSchedule[] = [
  // 1. P. Delgada <-> Sete Cidades
  {
    id: 'AVM_PDL_SC',
    company: 'Auto Viação Micaelense',
    island: 'PDL',
    origin: 'Ponta Delgada',
    destination: 'Sete Cidades',
    times: ['08:25', '18:25'],
    schedule: {
      weekdays: ['08:25', '18:25'],
      sundays: ['09:00', '16:10']
    },
    price: 3.0,
    duration: '1h 00m'
  },
  {
    id: 'AVM_SC_PDL',
    company: 'Auto Viação Micaelense',
    island: 'PDL',
    origin: 'Sete Cidades',
    destination: 'Ponta Delgada',
    times: ['07:00', '09:30', '16:25'],
    schedule: {
      weekdays: ['07:00', '09:30', '16:25'],
      saturdays: ['07:00', '09:00', '16:25'],
      sundays: ['10:45', '18:05']
    },
    price: 3.0,
    duration: '1h 00m'
  },

  // 2. P. Delgada <-> Mosteiros
  {
    id: 'AVM_PDL_MOSTEIROS',
    company: 'Auto Viação Micaelense',
    island: 'PDL',
    origin: 'Ponta Delgada',
    destination: 'Mosteiros',
    times: ['07:50', '10:40', '12:45', '15:00', '16:30', '17:30', '18:50'],
    schedule: {
      weekdays: ['07:50', '10:40', '12:45', '15:00', '16:30', '17:30', '18:50'],
      saturdays: ['07:50', '13:15', '15:00', '17:30', '19:00'],
      sundays: ['09:00', '12:30', '16:40', '19:45']
    },
    price: 3.5,
    duration: '1h 15m'
  },
  {
    id: 'AVM_MOSTEIROS_PDL',
    company: 'Auto Viação Micaelense',
    island: 'PDL',
    origin: 'Mosteiros',
    destination: 'Ponta Delgada',
    times: ['06:15', '07:05', '09:05', '12:05', '14:45', '16:35'],
    schedule: {
      weekdays: ['06:15', '07:05', '09:05', '12:05', '14:45', '16:35'],
      saturdays: ['06:15', '07:05', '09:05', '12:05', '14:45', '16:35'],
      sundays: ['07:00', '11:00', '15:15', '18:15']
    },
    price: 3.5,
    duration: '1h 15m'
  },

  // 3. P. Delgada <-> Ramal Mosteiros
  {
    id: 'AVM_PDL_RAMAL',
    company: 'Auto Viação Micaelense',
    island: 'PDL',
    origin: 'Ponta Delgada',
    destination: 'Ramal Mosteiros',
    times: ['07:15', '14:35'],
    schedule: {
      weekdays: ['07:15', '14:35'],
      saturdays: ['07:15', '14:35'],
      sundays: ['08:30', '16:15']
    },
    price: 3.0,
    duration: '1h 00m'
  },
  {
    id: 'AVM_RAMAL_PDL',
    company: 'Auto Viação Micaelense',
    island: 'PDL',
    origin: 'Ramal Mosteiros',
    destination: 'Ponta Delgada',
    times: ['09:15', '16:45'],
    schedule: {
      weekdays: ['09:15', '16:45'],
      saturdays: ['09:15', '16:45'],
      sundays: ['11:10', '18:25']
    },
    price: 3.0,
    duration: '1h 00m'
  },

  // 4. P. Delgada <-> João Bom
  {
    id: 'AVM_PDL_JOAO_BOM',
    company: 'Auto Viação Micaelense',
    island: 'PDL',
    origin: 'Ponta Delgada',
    destination: 'João Bom',
    times: ['09:30', '12:30', '16:00', '18:15', '19:00'],
    schedule: {
      weekdays: ['09:30', '12:30', '16:00', '18:15', '19:00'],
      saturdays: ['09:30(D)', '12:30', '16:00', '18:30'],
      sundays: ['13:00', '20:00']
    },
    price: 3.2,
    duration: '1h 10m'
  },
  {
    id: 'AVM_JOAO_BOM_PDL',
    company: 'Auto Viação Micaelense',
    island: 'PDL',
    origin: 'João Bom',
    destination: 'Ponta Delgada',
    times: ['06:00', '07:10', '09:25', '12:30', '15:00', '16:55'],
    schedule: {
      weekdays: ['06:00', '07:10', '09:25', '12:30', '15:00', '16:55'],
      saturdays: ['06:00', '07:10', '12:30'],
      sundays: ['07:05', '14:45']
    },
    price: 3.2,
    duration: '1h 10m'
  },

  // 5. P. Delgada <-> Fenais da Luz
  {
    id: 'AVM_PDL_FENAIS_LUZ',
    company: 'Auto Viação Micaelense',
    island: 'PDL',
    origin: 'Ponta Delgada',
    destination: 'Fenais da Luz',
    times: ['07:30', '08:45', '12:00', '15:15', '15:45', '17:00', '17:45', '18:50'],
    schedule: {
      weekdays: ['07:30', '08:45', '12:00', '15:15', '15:45', '17:00', '17:45', '18:50'],
      saturdays: ['07:30', '08:45', '12:00', '17:00'],
      sundays: ['09:45', '14:45', '18:05']
    },
    price: 2.5,
    duration: '45m'
  },
  {
    id: 'AVM_FENAIS_LUZ_PDL',
    company: 'Auto Viação Micaelense',
    island: 'PDL',
    origin: 'Fenais da Luz',
    destination: 'Ponta Delgada',
    times: ['06:50', '07:30', '08:10', '09:40', '12:45', '14:25', '15:55', '17:45'],
    schedule: {
      weekdays: ['06:50', '07:30', '08:10', '09:40', '12:45', '14:25', '15:55', '17:45'],
      saturdays: ['06:50', '07:30', '08:10', '09:40'],
      sundays: ['09:00', '12:45', '13:00', '17:15']
    },
    price: 2.5,
    duration: '45m'
  },

  // 6. P. Delgada <-> Capelas
  {
    id: 'AVM_PDL_CAPELAS',
    company: 'Auto Viação Micaelense',
    island: 'PDL',
    origin: 'Ponta Delgada',
    destination: 'Capelas',
    times: ['07:45', '10:15', '15:30', '18:00', '19:05'],
    schedule: {
      weekdays: ['07:45', '10:15', '15:30', '18:00', '19:05'],
      saturdays: ['07:55', '10:15', '15:30'],
      sundays: ['09:45', '14:45', '18:05']
    },
    price: 2.2,
    duration: '40m'
  },
  {
    id: 'AVM_CAPELAS_PDL',
    company: 'Auto Viação Micaelense',
    island: 'PDL',
    origin: 'Capelas',
    destination: 'Ponta Delgada',
    times: ['07:00', '08:55', '12:30', '18:00'],
    schedule: {
      weekdays: ['07:00', '08:55', '12:30', '18:00'],
      saturdays: ['07:00', '08:55', '12:30'],
      sundays: ['08:45', '12:45', '17:00']
    },
    price: 2.2,
    duration: '40m'
  },

  // 7. P. Delgada <-> Sto. António
  {
    id: 'AVM_PDL_STO_ANTONIO',
    company: 'Auto Viação Micaelense',
    island: 'PDL',
    origin: 'Ponta Delgada',
    destination: 'Santo António',
    times: ['07:45', '12:00', '14:00', '16:15', '18:20'],
    schedule: {
      weekdays: ['07:45', '12:00', '14:00', '16:15', '18:20'],
      saturdays: ['12:00', '14:00'],
      sundays: ['08:00']
    },
    price: 2.8,
    duration: '50m'
  },
  {
    id: 'AVM_STO_ANTONIO_PDL',
    company: 'Auto Viação Micaelense',
    island: 'PDL',
    origin: 'Santo António',
    destination: 'Ponta Delgada',
    times: ['06:15', '08:45', '13:45', '15:00', '17:15'],
    schedule: {
      weekdays: ['06:15', '08:45', '13:45', '15:00', '17:15'],
      saturdays: ['08:45', '15:00'],
      sundays: ['07:00']
    },
    price: 2.8,
    duration: '50m'
  }
];

export { avmBuses };
