const fs = require('fs');

const avmSchedules = [
  // Sete Cidades
  { id: 'a1', company: 'AVM (Dias Úteis)', island: 'PDL', origin: 'Ponta Delgada (Centro)', destination: 'Sete Cidades', duration: '50m', price: 3.50, times: ['08:25', '18:25'] },
  { id: 'a2', company: 'AVM (Domingos)', island: 'PDL', origin: 'Ponta Delgada (Centro)', destination: 'Sete Cidades', duration: '50m', price: 3.50, times: ['09:00', '16:10'] },
  { id: 'a3', company: 'AVM (Dias Úteis)', island: 'PDL', origin: 'Sete Cidades', destination: 'Ponta Delgada (Centro)', duration: '50m', price: 3.50, times: ['07:00', '09:30', '16:25'] },
  { id: 'a4', company: 'AVM (Sábados)', island: 'PDL', origin: 'Sete Cidades', destination: 'Ponta Delgada (Centro)', duration: '50m', price: 3.50, times: ['07:00', '09:00', '16:25'] },
  { id: 'a5', company: 'AVM (Domingos)', island: 'PDL', origin: 'Sete Cidades', destination: 'Ponta Delgada (Centro)', duration: '50m', price: 3.50, times: ['10:45', '18:05'] },

  // Mosteiros
  { id: 'a6', company: 'AVM (Dias Úteis)', island: 'PDL', origin: 'Ponta Delgada (Centro)', destination: 'Mosteiros', duration: '65m', price: 4.20, times: ['07:50', '10:40', '12:45', '15:00', '16:30', '17:30', '18:50'] },
  { id: 'a7', company: 'AVM (Sábados)', island: 'PDL', origin: 'Ponta Delgada (Centro)', destination: 'Mosteiros', duration: '65m', price: 4.20, times: ['07:50', '13:15', '15:00', '17:30', '19:00'] },
  { id: 'a8', company: 'AVM (Domingos)', island: 'PDL', origin: 'Ponta Delgada (Centro)', destination: 'Mosteiros', duration: '65m', price: 4.20, times: ['09:00', '12:30', '16:40', '19:45'] },
  { id: 'a9', company: 'AVM (Dias Úteis)', island: 'PDL', origin: 'Mosteiros', destination: 'Ponta Delgada (Centro)', duration: '65m', price: 4.20, times: ['06:15', '07:05', '09:05', '12:05', '14:45', '16:35'] },
  { id: 'a10', company: 'AVM (Sábados)', island: 'PDL', origin: 'Mosteiros', destination: 'Ponta Delgada (Centro)', duration: '65m', price: 4.20, times: ['06:15', '07:05', '09:05', '12:05', '14:45', '16:35'] },
  { id: 'a11', company: 'AVM (Domingos)', island: 'PDL', origin: 'Mosteiros', destination: 'Ponta Delgada (Centro)', duration: '65m', price: 4.20, times: ['07:00', '11:00', '15:15', '18:15'] },

  // Ramal Mosteiros
  { id: 'a12', company: 'AVM (Dias Úteis)', island: 'PDL', origin: 'Ponta Delgada (Centro)', destination: 'Ramal Mosteiros', duration: '60m', price: 4.00, times: ['07:15', '14:35'] },
  { id: 'a13', company: 'AVM (Sábados)', island: 'PDL', origin: 'Ponta Delgada (Centro)', destination: 'Ramal Mosteiros', duration: '60m', price: 4.00, times: ['07:15', '14:35'] },
  { id: 'a14', company: 'AVM (Domingos)', island: 'PDL', origin: 'Ponta Delgada (Centro)', destination: 'Ramal Mosteiros', duration: '60m', price: 4.00, times: ['08:30', '16:15'] },
  { id: 'a15', company: 'AVM (Dias Úteis)', island: 'PDL', origin: 'Ramal Mosteiros', destination: 'Ponta Delgada (Centro)', duration: '60m', price: 4.00, times: ['09:15', '16:45'] },
  { id: 'a16', company: 'AVM (Sábados)', island: 'PDL', origin: 'Ramal Mosteiros', destination: 'Ponta Delgada (Centro)', duration: '60m', price: 4.00, times: ['09:15', '16:45'] },
  { id: 'a17', company: 'AVM (Domingos)', island: 'PDL', origin: 'Ramal Mosteiros', destination: 'Ponta Delgada (Centro)', duration: '60m', price: 4.00, times: ['11:10', '18:25'] },

  // João Bom
  { id: 'a18', company: 'AVM (Dias Úteis)', island: 'PDL', origin: 'Ponta Delgada (Centro)', destination: 'João Bom', duration: '75m', price: 4.80, times: ['09:30', '12:30', '16:00', '18:15', '19:00'] },
  { id: 'a19', company: 'AVM (Sábados)', island: 'PDL', origin: 'Ponta Delgada (Centro)', destination: 'João Bom', duration: '75m', price: 4.80, times: ['09:30', '12:30', '16:00', '18:30'] },
  { id: 'a20', company: 'AVM (Domingos)', island: 'PDL', origin: 'Ponta Delgada (Centro)', destination: 'João Bom', duration: '75m', price: 4.80, times: ['13:00', '20:00'] },
  { id: 'a21', company: 'AVM (Dias Úteis)', island: 'PDL', origin: 'João Bom', destination: 'Ponta Delgada (Centro)', duration: '75m', price: 4.80, times: ['06:00', '07:10', '09:25', '12:30', '15:00', '16:55'] },
  { id: 'a22', company: 'AVM (Sábados)', island: 'PDL', origin: 'João Bom', destination: 'Ponta Delgada (Centro)', duration: '75m', price: 4.80, times: ['06:00', '07:10', '12:30'] },
  { id: 'a23', company: 'AVM (Domingos)', island: 'PDL', origin: 'João Bom', destination: 'Ponta Delgada (Centro)', duration: '75m', price: 4.80, times: ['07:05', '14:45'] },

  // Fenais da Luz
  { id: 'a24', company: 'AVM (Dias Úteis)', island: 'PDL', origin: 'Ponta Delgada (Centro)', destination: 'Fenais da Luz', duration: '30m', price: 2.20, times: ['07:30', '08:45', '12:00', '15:15', '15:45', '17:00', '17:45', '18:50'] },
  { id: 'a25', company: 'AVM (Sábados)', island: 'PDL', origin: 'Ponta Delgada (Centro)', destination: 'Fenais da Luz', duration: '30m', price: 2.20, times: ['07:30', '08:45', '12:00', '17:00'] },
  { id: 'a26', company: 'AVM (Domingos)', island: 'PDL', origin: 'Ponta Delgada (Centro)', destination: 'Fenais da Luz', duration: '30m', price: 2.20, times: ['09:45', '14:45', '18:05'] },
  { id: 'a27', company: 'AVM (Dias Úteis)', island: 'PDL', origin: 'Fenais da Luz', destination: 'Ponta Delgada (Centro)', duration: '30m', price: 2.20, times: ['06:50', '07:30', '08:10', '09:40', '12:45', '14:25', '15:55', '17:45'] },
  { id: 'a28', company: 'AVM (Sábados)', island: 'PDL', origin: 'Fenais da Luz', destination: 'Ponta Delgada (Centro)', duration: '30m', price: 2.20, times: ['06:50', '07:30', '08:10', '09:40'] },
  { id: 'a29', company: 'AVM (Domingos)', island: 'PDL', origin: 'Fenais da Luz', destination: 'Ponta Delgada (Centro)', duration: '30m', price: 2.20, times: ['09:00', '12:45', '13:00', '17:15'] },

  // Capelas
  { id: 'a30', company: 'AVM (Dias Úteis)', island: 'PDL', origin: 'Ponta Delgada (Centro)', destination: 'Capelas', duration: '35m', price: 2.50, times: ['07:45', '10:15', '15:30', '18:00', '19:05'] },
  { id: 'a31', company: 'AVM (Sábados)', island: 'PDL', origin: 'Ponta Delgada (Centro)', destination: 'Capelas', duration: '35m', price: 2.50, times: ['07:55', '10:15', '15:30'] },
  { id: 'a32', company: 'AVM (Domingos)', island: 'PDL', origin: 'Ponta Delgada (Centro)', destination: 'Capelas', duration: '35m', price: 2.50, times: ['09:45', '14:45', '18:05'] },
  { id: 'a33', company: 'AVM (Dias Úteis)', island: 'PDL', origin: 'Capelas', destination: 'Ponta Delgada (Centro)', duration: '35m', price: 2.50, times: ['07:00', '08:55', '12:30', '18:00'] },
  { id: 'a34', company: 'AVM (Sábados)', island: 'PDL', origin: 'Capelas', destination: 'Ponta Delgada (Centro)', duration: '35m', price: 2.50, times: ['07:00', '08:55', '12:30'] },
  { id: 'a35', company: 'AVM (Domingos)', island: 'PDL', origin: 'Capelas', destination: 'Ponta Delgada (Centro)', duration: '35m', price: 2.50, times: ['08:45', '12:45', '17:00'] },

  // Santo António
  { id: 'a36', company: 'AVM (Dias Úteis)', island: 'PDL', origin: 'Ponta Delgada (Centro)', destination: 'Santo António', duration: '45m', price: 3.20, times: ['07:45', '12:00', '14:00', '16:15', '18:20'] },
  { id: 'a37', company: 'AVM (Sábados)', island: 'PDL', origin: 'Ponta Delgada (Centro)', destination: 'Santo António', duration: '45m', price: 3.20, times: ['12:00', '14:00'] },
  { id: 'a38', company: 'AVM (Domingos)', island: 'PDL', origin: 'Ponta Delgada (Centro)', destination: 'Santo António', duration: '45m', price: 3.20, times: ['08:00'] },
  { id: 'a39', company: 'AVM (Dias Úteis)', island: 'PDL', origin: 'Santo António', destination: 'Ponta Delgada (Centro)', duration: '45m', price: 3.20, times: ['06:15', '08:45', '13:45', '15:00', '17:15'] },
  { id: 'a40', company: 'AVM (Sábados)', island: 'PDL', origin: 'Santo António', destination: 'Ponta Delgada (Centro)', duration: '45m', price: 3.20, times: ['08:45', '15:00'] },
  { id: 'a41', company: 'AVM (Domingos)', island: 'PDL', origin: 'Santo António', destination: 'Ponta Delgada (Centro)', duration: '45m', price: 3.20, times: ['07:00'] },
];

let content = fs.readFileSync('constants.ts', 'utf8');

// 1. Fix ISLAND_LOCALITIES
const locStart = content.indexOf('export const ISLAND_LOCALITIES: Record<string, string[]> = {');
const locEnd = content.indexOf('const COMPANIES: Record<string, string[]> = {');
if (locStart !== -1 && locEnd !== -1) {
    const locBlock = \`export const ISLAND_LOCALITIES: Record<string, string[]> = {
    'PDL': [
      'Ponta Delgada (Centro)', 'São Sebastião', 'São Pedro', 'Santa Clara', 'Fajã de Baixo', 'Fajã de Cima', 'São Roque', 'Rosto de Cão (Livramento)', 'Rosto de Cão (São Roque)',
      'Ribeira Grande', 'Ribeira Seca', 'Ribeirinha', 'Conceição', 'Matriz', 'Santa Bárbara',
      'Lagoa', 'Nossa Senhora do Rosário', 'Santa Cruz', 'Água de Pau', 'Cabouco', 'Remédios',
      'Vila Franca do Campo', 'São Miguel', 'São Pedro', 'Ribeira das Tainhas', 'Ponta Garça', 'Água de Alto',
      'Povoação', 'Furnas', 'Nossa Senhora dos Remédios', 'Faial da Terra', 'Ribeira Quente', 'Água Retorta',
      'Nordeste', 'Achadinha', 'Achada', 'Salga', 'Lomba da Fazenda', 'Santana', 'Algarvia', 'São Pedro de Nordestinho', 'Santo António de Nordestinho',
      'Sete Cidades', 'Ginetes', 'Mosteiros', 'Ramal Mosteiros', 'João Bom', 'Candelária', 'Feteiras', 'Ajuda da Bretanha', 'Pilar da Bretanha', 'Remédios (Bretanha)', 'Santa Bárbara', 'Santo António',
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
      'Madalena (Centro)', 'Bandeiras', 'Criação Velha', 'Candelária', 'São Mateus', 'São Caetano',
      'São Roque do Pico', 'Santa Luzia', 'Santo António', 'Prainha', 'Santo Amaro',
      'Lajes do Pico', 'São João', 'Piedade', 'Ribeiras', 'Calheta de Nesquim'
    ],
    'SJZ': [
      'Velas (Centro)', 'Santo Amaro', 'Rosais', 'Manadas', 'Urzelina', 'Norte Grande',
      'Calheta', 'Ribeira Seca', 'Norte Pequeno', 'Topo', 'Santo Antão'
    ],
    'SMA': [
      'Vila do Porto (Centro)', 'Almagreira', 'Santa Bárbara', 'Santo Espírito', 'São Pedro'
    ],
    'GRW': [
      'Santa Cruz da Graciosa', 'Guadalupe', 'Praia (São Mateus)', 'Luz'
    ],
    'FLW': [
      'Santa Cruz das Flores', 'Caveira', 'Cedros', 'Ponta Delgada',
      'Lajes das Flores', 'Fazenda', 'Fajã Grande', 'Fajãzinha', 'Lajedo', 'Mosteiro'
    ],
    'CVU': [
      'Vila do Corvo'
    ]
  };\n\n\`;
    content = content.substring(0, locStart) + locBlock + content.substring(locEnd);
}

// 2. Add AVM_SCHEDULES block and update BUS_SCHEDULES
const varelaStart = content.indexOf('const VARELA_SCHEDULES');
if (varelaStart !== -1) {
    const avmBlock = "const AVM_SCHEDULES: BusSchedule[] = " + JSON.stringify(avmSchedules, null, 2) + ";\n\n";
    content = content.substring(0, varelaStart) + avmBlock + content.substring(varelaStart);
}

// 3. Update BUS_SCHEDULES export
const exportStart = content.indexOf('export const BUS_SCHEDULES: BusSchedule[] = [');
const exportEnd = content.indexOf('];', exportStart) + 2;
if (exportStart !== -1) {
    const newExport = \`export const BUS_SCHEDULES: BusSchedule[] = [...VARELA_SCHEDULES, ...CRP_SCHEDULES, ...AVM_SCHEDULES, ...GENERATED_SCHEDULES.filter(s => !(
        s.origin.includes('Sete Cidades') || s.destination.includes('Sete Cidades') ||
        s.origin.includes('Mosteiros') || s.destination.includes('Mosteiros') ||
        s.origin.includes('João Bom') || s.destination.includes('João Bom') ||
        s.origin.includes('Fenais da Luz') || s.destination.includes('Fenais da Luz') ||
        s.origin.includes('Capelas') || s.destination.includes('Capelas') ||
        s.origin.includes('Santo António') || s.destination.includes('Santo António') ||
        s.origin.includes('Ribeira Grande') || s.destination.includes('Ribeira Grande') ||
        s.origin.includes('Rabo de Peixe') || s.destination.includes('Rabo de Peixe') ||
        s.origin.includes('Fenais da Ajuda') || s.destination.includes('Fenais da Ajuda') ||
        s.origin.includes('Maia') || s.destination.includes('Maia') ||
        s.origin.includes('Furnas') || s.destination.includes('Furnas') ||
        s.origin.includes('Nordeste') || s.destination.includes('Nordeste') ||
        s.origin.includes('Fajã de Baixo') || s.destination.includes('Fajã de Baixo') ||
        s.origin.includes('Fajã de Cima') || s.destination.includes('Fajã de Cima') ||
        s.origin.includes('Lagoa') || s.destination.includes('Lagoa')
    ))];\n\`;
    content = content.substring(0, exportStart) + newExport + content.substring(exportEnd);
}

fs.writeFileSync('constants.ts', content, 'utf8');
console.log("Master fix applied: Localities encoding, Varela/CRP encoding, AVM added, and BUS_SCHEDULES export updated.");
