const fs = require('fs');

let content = fs.readFileSync('constants.ts', 'utf8');

const startIdx = content.indexOf('const VARELA_SCHEDULES');
const endIdx = content.indexOf('export const TOUR_GUIDES');

if (startIdx !== -1 && endIdx !== -1) {
  const correctChunk = "const VARELA_SCHEDULES: BusSchedule[] = [\n" +
  "  // Fajã de Baixo\n" +
  "  { id: 'v1', company: 'Varela (Dias Úteis)', island: 'PDL', origin: 'Ponta Delgada (Centro)', destination: 'Fajã de Baixo', duration: '15m', price: 1.50, times: ['08:00','08:15','09:10','10:10','11:10','12:10','12:40','13:10','14:00','16:10','17:05','18:15','19:10','20:00','21:00','22:15'] },\n" +
  "  { id: 'v2', company: 'Varela (Sábados)', island: 'PDL', origin: 'Ponta Delgada (Centro)', destination: 'Fajã de Baixo', duration: '15m', price: 1.50, times: ['08:00','08:45','09:10','10:10','11:10','12:10','13:10','16:00','18:00'] },\n" +
  "  { id: 'v3', company: 'Varela (Domingos)', island: 'PDL', origin: 'Ponta Delgada (Centro)', destination: 'Fajã de Baixo', duration: '15m', price: 1.50, times: ['09:30','16:00','18:00'] },\n" +
  "  { id: 'v4', company: 'Varela (Dias Úteis)', island: 'PDL', origin: 'Fajã de Baixo', destination: 'Ponta Delgada (Centro)', duration: '15m', price: 1.50, times: ['07:00','08:00','08:25','09:05','09:35','10:35','11:35','12:35','13:00','13:30','14:25','16:35','17:30','18:40','20:30','21:30'] },\n" +
  "  { id: 'v5', company: 'Varela (Sábados)', island: 'PDL', origin: 'Fajã de Baixo', destination: 'Ponta Delgada (Centro)', duration: '15m', price: 1.50, times: ['07:00','08:00','08:25','09:05','09:35','10:35','11:35','12:35','13:30','16:30'] },\n" +
  "  { id: 'v6', company: 'Varela (Domingos)', island: 'PDL', origin: 'Fajã de Baixo', destination: 'Ponta Delgada (Centro)', duration: '15m', price: 1.50, times: ['08:00','13:00','16:30'] },\n" +
  "  // Fajã de Cima\n" +
  "  { id: 'v7', company: 'Varela (Dias Úteis)', island: 'PDL', origin: 'Ponta Delgada (Centro)', destination: 'Fajã de Cima', duration: '15m', price: 1.50, times: ['07:05','07:30','08:05','08:40','09:05','10:05','11:05','12:00','12:35','13:10','14:00','15:00','16:00','16:55','17:10','17:55','18:10','18:45','19:10','20:00','21:00','22:15'] },\n" +
  "  { id: 'v8', company: 'Varela (Sábados)', island: 'PDL', origin: 'Ponta Delgada (Centro)', destination: 'Fajã de Cima', duration: '15m', price: 1.50, times: ['07:40','08:05','09:05','10:05','11:05','12:10','13:00','14:10','17:10','18:45'] },\n" +
  "  { id: 'v9', company: 'Varela (Domingos)', island: 'PDL', origin: 'Ponta Delgada (Centro)', destination: 'Fajã de Cima', duration: '15m', price: 1.50, times: ['13:00','14:15'] },\n" +
  "  { id: 'v10', company: 'Varela (Dias Úteis)', island: 'PDL', origin: 'Fajã de Cima', destination: 'Ponta Delgada (Centro)', duration: '15m', price: 1.50, times: ['06:55','07:25','07:50','08:25','09:10','09:25','10:25','11:25','12:20','13:00','13:30','14:20','15:20','16:20','17:15','17:30','18:30','19:30'] },\n" +
  "  { id: 'v11', company: 'Varela (Sábados)', island: 'PDL', origin: 'Fajã de Cima', destination: 'Ponta Delgada (Centro)', duration: '15m', price: 1.50, times: ['06:55','07:25','08:00','08:25','09:25','10:25','11:25','12:30','13:20','14:30','17:30'] },\n" +
  "  { id: 'v12', company: 'Varela (Domingos)', island: 'PDL', origin: 'Fajã de Cima', destination: 'Ponta Delgada (Centro)', duration: '15m', price: 1.50, times: ['13:20','14:30'] },\n" +
  "  // Praia do Pópulo\n" +
  "  { id: 'v13', company: 'Varela (Dias Úteis)', island: 'PDL', origin: 'Ponta Delgada (Centro)', destination: 'Rosto de Cão (São Roque)', duration: '20m', price: 1.80, times: ['07:00','07:40','09:30','10:30','12:10','12:35','13:45','14:45','16:00','17:40','17:50','19:00','19:10'] },\n" +
  "  { id: 'v14', company: 'Varela (Sábados)', island: 'PDL', origin: 'Ponta Delgada (Centro)', destination: 'Rosto de Cão (São Roque)', duration: '20m', price: 1.80, times: ['07:35','09:30','10:30','12:35','14:00','17:50'] },\n" +
  "  { id: 'v15', company: 'Varela (Domingos)', island: 'PDL', origin: 'Ponta Delgada (Centro)', destination: 'Rosto de Cão (São Roque)', duration: '20m', price: 1.80, times: ['09:00','10:30','16:00','16:45','17:45'] },\n" +
  "  { id: 'v16', company: 'Varela (Dias Úteis)', island: 'PDL', origin: 'Rosto de Cão (São Roque)', destination: 'Ponta Delgada (Centro)', duration: '20m', price: 1.80, times: ['07:10','07:20','07:40','08:00','08:05','08:10','08:20','09:40','10:10','10:30','10:45','12:10','13:40','15:05','17:00','17:20','17:35','18:20','18:45'] },\n" +
  "  { id: 'v17', company: 'Varela (Sábados)', island: 'PDL', origin: 'Rosto de Cão (São Roque)', destination: 'Ponta Delgada (Centro)', duration: '20m', price: 1.80, times: ['07:20','07:55','08:40','09:40','10:45','11:55','12:55','14:00','15:40','18:10','18:50'] },\n" +
  "  { id: 'v18', company: 'Varela (Domingos)', island: 'PDL', origin: 'Rosto de Cão (São Roque)', destination: 'Ponta Delgada (Centro)', duration: '20m', price: 1.80, times: ['09:00','10:35','10:45','12:55','17:00','18:00','18:20','18:50'] },\n" +
  "  // Lagoa\n" +
  "  { id: 'v19', company: 'Varela (Dias Úteis)', island: 'PDL', origin: 'Ponta Delgada (Centro)', destination: 'Lagoa', duration: '30m', price: 2.20, times: ['07:00','07:25','07:50','08:25','09:00','09:30','10:00','11:00','11:30','12:10','12:35','13:00','13:30','13:45','14:15','15:00','15:30','15:50','16:00','16:15','16:45','17:00','17:20','17:30','17:50','18:05','18:30','18:45','19:10','19:30','20:40'] },\n" +
  "  { id: 'v20', company: 'Varela (Sábados)', island: 'PDL', origin: 'Ponta Delgada (Centro)', destination: 'Lagoa', duration: '30m', price: 2.20, times: ['07:25','07:35','07:50','09:00','09:30','10:15','11:00','11:30','12:35','13:15','14:00','15:00','16:00','17:30','17:50','19:30'] },\n" +
  "  { id: 'v21', company: 'Varela (Domingos)', island: 'PDL', origin: 'Ponta Delgada (Centro)', destination: 'Lagoa', duration: '30m', price: 2.20, times: ['09:00','10:00','12:15','15:00','16:00','17:15','18:00','19:10','20:30'] },\n" +
  "  { id: 'v22', company: 'Varela (Dias Úteis)', island: 'PDL', origin: 'Lagoa', destination: 'Ponta Delgada (Centro)', duration: '30m', price: 2.20, times: ['06:25','06:50','07:00','07:10','07:20','07:30','07:45','07:50','08:00','08:25','08:45','09:15','09:30','10:00','10:05','10:20','11:00','11:45','12:00','12:25','12:50','13:05','13:30','14:30','14:50','15:15','16:05','16:50','17:10','17:25','17:40','18:10','18:40','19:15','20:05'] },\n" +
  "  { id: 'v23', company: 'Varela (Sábados)', island: 'PDL', origin: 'Lagoa', destination: 'Ponta Delgada (Centro)', duration: '30m', price: 2.20, times: ['07:00','07:10','07:30','07:45','07:50','08:25','08:30','08:40','09:30','10:00','11:00','11:45','12:25','12:45','13:45','14:15','15:30','17:00','18:00','18:40'] },\n" +
  "  { id: 'v24', company: 'Varela (Domingos)', island: 'PDL', origin: 'Lagoa', destination: 'Ponta Delgada (Centro)', duration: '30m', price: 2.20, times: ['07:25','08:20','08:50','10:25','12:45','12:50','15:40','17:45','18:10','18:40'] },\n" +
  "];\n\n" +
  "export const BUS_SCHEDULES: BusSchedule[] = [...VARELA_SCHEDULES, ...GENERATED_SCHEDULES.filter(s => !(s.origin.includes('Fajã de Baixo') || s.destination.includes('Fajã de Baixo') || s.origin.includes('Fajã de Cima') || s.destination.includes('Fajã de Cima') || s.origin.includes('Lagoa') || s.destination.includes('Lagoa')))];\n\n";
  
  content = content.substring(0, startIdx) + correctChunk + content.substring(endIdx);
  fs.writeFileSync('constants.ts', content, 'utf8');
  console.log("Rewrote VARELA_SCHEDULES successfully as pure JS strings.");
} else {
  console.log("Could not find chunk bounds");
}
