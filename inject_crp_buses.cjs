const fs = require('fs');

let content = fs.readFileSync('constants.ts', 'utf8');

const startIdx = content.indexOf('export const BUS_SCHEDULES: BusSchedule[] = [');
const endIdx = content.indexOf('];', startIdx) + 2;

const crpSchedulesString = `
  // Ribeira Grande
  { id: 'c1', company: 'CRP (Dias Úteis)', island: 'PDL', origin: 'Ponta Delgada (Centro)', destination: 'Ribeira Grande', duration: '40m', price: 2.80, times: ['06:15','07:15','08:25','11:00','12:00','15:15','16:15','17:15','17:45','18:15','19:15'] },
  { id: 'c2', company: 'CRP (Sábados)', island: 'PDL', origin: 'Ponta Delgada (Centro)', destination: 'Ribeira Grande', duration: '40m', price: 2.80, times: ['06:45','07:15','08:25','11:00','12:00','15:15','17:30','18:15','19:15'] },
  { id: 'c3', company: 'CRP (Domingos)', island: 'PDL', origin: 'Ponta Delgada (Centro)', destination: 'Ribeira Grande', duration: '40m', price: 2.80, times: ['06:15','07:15','15:15'] },

  { id: 'c4', company: 'CRP (Dias Úteis)', island: 'PDL', origin: 'Ribeira Grande', destination: 'Ponta Delgada (Centro)', duration: '40m', price: 2.80, times: ['07:15','08:15','08:45','10:15','12:15','13:30','14:30','17:45','18:30','19:15'] },
  { id: 'c5', company: 'CRP (Sábados)', island: 'PDL', origin: 'Ribeira Grande', destination: 'Ponta Delgada (Centro)', duration: '40m', price: 2.80, times: ['07:15','08:15','08:45','10:15','12:15','13:30','14:30','18:30'] },
  { id: 'c6', company: 'CRP (Domingos)', island: 'PDL', origin: 'Ribeira Grande', destination: 'Ponta Delgada (Centro)', duration: '40m', price: 2.80, times: ['08:45','10:15','12:15','18:30','19:15'] },

  // Rabo de Peixe
  { id: 'c7', company: 'CRP (Dias Úteis)', island: 'PDL', origin: 'Ponta Delgada (Centro)', destination: 'Rabo de Peixe', duration: '35m', price: 2.50, times: ['07:35','08:15','09:15','11:30','12:30','13:30','14:30','15:30','16:30','17:30','19:15'] },
  { id: 'c8', company: 'CRP (Sábados)', island: 'PDL', origin: 'Ponta Delgada (Centro)', destination: 'Rabo de Peixe', duration: '35m', price: 2.50, times: ['07:35','08:15','09:15','11:30','12:30','13:30','14:30','15:30','16:30','17:30','19:15'] },
  { id: 'c9', company: 'CRP (Domingos)', island: 'PDL', origin: 'Ponta Delgada (Centro)', destination: 'Rabo de Peixe', duration: '35m', price: 2.50, times: ['08:30','10:30','12:30','14:30','16:30','18:30','20:30'] },

  { id: 'c10', company: 'CRP (Dias Úteis)', island: 'PDL', origin: 'Rabo de Peixe', destination: 'Ponta Delgada (Centro)', duration: '35m', price: 2.50, times: ['07:45','10:00','11:15','12:45','13:45','14:45','15:45','16:45','17:45'] },
  { id: 'c11', company: 'CRP (Sábados)', island: 'PDL', origin: 'Rabo de Peixe', destination: 'Ponta Delgada (Centro)', duration: '35m', price: 2.50, times: ['07:45','10:00','11:15','12:45','13:45','15:45','16:45','17:45'] },
  { id: 'c12', company: 'CRP (Domingos)', island: 'PDL', origin: 'Rabo de Peixe', destination: 'Ponta Delgada (Centro)', duration: '35m', price: 2.50, times: ['06:00','07:00','07:45','10:00','12:45','14:45','16:45','18:45'] },

  // Fenais da Ajuda
  { id: 'c13', company: 'CRP (Dias Úteis)', island: 'PDL', origin: 'Ponta Delgada (Centro)', destination: 'Fenais da Ajuda', duration: '50m', price: 3.50, times: ['06:45','11:00','16:15','18:15'] },
  { id: 'c14', company: 'CRP (Sábados)', island: 'PDL', origin: 'Ponta Delgada (Centro)', destination: 'Fenais da Ajuda', duration: '50m', price: 3.50, times: ['06:45','11:00','16:15','18:15'] },
  { id: 'c15', company: 'CRP (Domingos)', island: 'PDL', origin: 'Ponta Delgada (Centro)', destination: 'Fenais da Ajuda', duration: '50m', price: 3.50, times: ['06:45','14:15','16:15'] },

  { id: 'c16', company: 'CRP (Dias Úteis)', island: 'PDL', origin: 'Fenais da Ajuda', destination: 'Ponta Delgada (Centro)', duration: '50m', price: 3.50, times: ['06:50','07:55','09:40','12:45','17:10'] },
  { id: 'c17', company: 'CRP (Sábados)', island: 'PDL', origin: 'Fenais da Ajuda', destination: 'Ponta Delgada (Centro)', duration: '50m', price: 3.50, times: ['06:50','07:55','09:40','12:45','15:45'] },
  { id: 'c18', company: 'CRP (Domingos)', island: 'PDL', origin: 'Fenais da Ajuda', destination: 'Ponta Delgada (Centro)', duration: '50m', price: 3.50, times: ['07:55','15:45','17:10'] },

  // Maia
  { id: 'c19', company: 'CRP (Dias Úteis)', island: 'PDL', origin: 'Ponta Delgada (Centro)', destination: 'Maia', duration: '45m', price: 3.20, times: ['07:15','11:00','12:00','16:15','18:15'] },
  { id: 'c20', company: 'CRP (Sábados)', island: 'PDL', origin: 'Ponta Delgada (Centro)', destination: 'Maia', duration: '45m', price: 3.20, times: ['07:15','11:00','12:00','16:15'] },
  { id: 'c21', company: 'CRP (Domingos)', island: 'PDL', origin: 'Ponta Delgada (Centro)', destination: 'Maia', duration: '45m', price: 3.20, times: ['14:15','16:15'] },

  { id: 'c22', company: 'CRP (Dias Úteis)', island: 'PDL', origin: 'Maia', destination: 'Ponta Delgada (Centro)', duration: '45m', price: 3.20, times: ['07:05','10:25','13:50','17:30'] },
  { id: 'c23', company: 'CRP (Sábados)', island: 'PDL', origin: 'Maia', destination: 'Ponta Delgada (Centro)', duration: '45m', price: 3.20, times: ['07:05','10:25','13:50','16:00'] },
  { id: 'c24', company: 'CRP (Domingos)', island: 'PDL', origin: 'Maia', destination: 'Ponta Delgada (Centro)', duration: '45m', price: 3.20, times: ['08:15','16:00','17:30'] },

  // Furnas
  { id: 'c25', company: 'CRP (Dias Úteis)', island: 'PDL', origin: 'Ponta Delgada (Centro)', destination: 'Furnas', duration: '60m', price: 4.00, times: ['07:15','15:15'] },
  { id: 'c26', company: 'CRP (Sábados)', island: 'PDL', origin: 'Ponta Delgada (Centro)', destination: 'Furnas', duration: '60m', price: 4.00, times: ['07:15','15:15'] },
  { id: 'c27', company: 'CRP (Domingos)', island: 'PDL', origin: 'Ponta Delgada (Centro)', destination: 'Furnas', duration: '60m', price: 4.00, times: ['07:15','15:15'] },

  { id: 'c28', company: 'CRP (Dias Úteis)', island: 'PDL', origin: 'Furnas', destination: 'Ponta Delgada (Centro)', duration: '60m', price: 4.00, times: ['09:10','17:10','18:10'] },
  { id: 'c29', company: 'CRP (Sábados)', island: 'PDL', origin: 'Furnas', destination: 'Ponta Delgada (Centro)', duration: '60m', price: 4.00, times: ['09:10','17:10','18:10'] },
  { id: 'c30', company: 'CRP (Domingos)', island: 'PDL', origin: 'Furnas', destination: 'Ponta Delgada (Centro)', duration: '60m', price: 4.00, times: ['09:10','17:10','18:10'] },

  // Nordeste
  { id: 'c31', company: 'CRP (Dias Úteis)', island: 'PDL', origin: 'Ponta Delgada (Centro)', destination: 'Nordeste', duration: '90m', price: 5.50, times: ['06:45','11:00','16:15','18:30'] },
  { id: 'c32', company: 'CRP (Sábados)', island: 'PDL', origin: 'Ponta Delgada (Centro)', destination: 'Nordeste', duration: '90m', price: 5.50, times: ['06:45','14:15'] },
  { id: 'c33', company: 'CRP (Domingos)', island: 'PDL', origin: 'Ponta Delgada (Centro)', destination: 'Nordeste', duration: '90m', price: 5.50, times: ['06:45','14:15','16:15'] },

  { id: 'c34', company: 'CRP (Dias Úteis)', island: 'PDL', origin: 'Nordeste', destination: 'Ponta Delgada (Centro)', duration: '90m', price: 5.50, times: ['06:45','11:30','16:00'] },
  { id: 'c35', company: 'CRP (Sábados)', island: 'PDL', origin: 'Nordeste', destination: 'Ponta Delgada (Centro)', duration: '90m', price: 5.50, times: ['06:45','14:30'] },
  { id: 'c36', company: 'CRP (Domingos)', island: 'PDL', origin: 'Nordeste', destination: 'Ponta Delgada (Centro)', duration: '90m', price: 5.50, times: ['06:45','14:30','16:00'] },
`;

// Wait, I need to inject CRP schedules ALONGSIDE Varela schedules in constants.ts.
// I can just find "export const BUS_SCHEDULES: BusSchedule[] = [" 
// BUT wait, in constants.ts earlier, I wrote: 
// export const BUS_SCHEDULES: BusSchedule[] = [...VARELA_SCHEDULES, ...GENERATED_SCHEDULES.filter(...)]

const insertIdx = content.indexOf('export const BUS_SCHEDULES: BusSchedule[] = [...VARELA_SCHEDULES,');
if (insertIdx !== -1) {
  content = content.substring(0, insertIdx) + 
            'const CRP_SCHEDULES: BusSchedule[] = [\n' + crpSchedulesString + '\n];\n\n' + 
            content.substring(insertIdx).replace('...VARELA_SCHEDULES,', '...VARELA_SCHEDULES, ...CRP_SCHEDULES,').replace('.filter(s => !(', ".filter(s => !(s.origin.includes('Ribeira Grande') || s.destination.includes('Ribeira Grande') || s.origin.includes('Rabo de Peixe') || s.destination.includes('Rabo de Peixe') || s.origin.includes('Fenais da Ajuda') || s.destination.includes('Fenais da Ajuda') || s.origin.includes('Maia') || s.destination.includes('Maia') || s.origin.includes('Furnas') || s.destination.includes('Furnas') || s.origin.includes('Nordeste') || s.destination.includes('Nordeste') || ");
  fs.writeFileSync('constants.ts', content, 'utf8');
  console.log("Injected CRP_SCHEDULES successfully.");
} else {
  console.log("Could not find insertion point.");
}
