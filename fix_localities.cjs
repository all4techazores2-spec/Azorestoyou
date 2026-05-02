const fs = require('fs');

let content = fs.readFileSync('constants.ts', 'utf8');

const localitiesStart = content.indexOf('export const ISLAND_LOCALITIES: Record<string, string[]> = {');
const localitiesEnd = content.indexOf('const GENERATED_SCHEDULES: BusSchedule[] = [];');

if (localitiesStart !== -1 && localitiesEnd !== -1) {
  const correctLocalities = `export const ISLAND_LOCALITIES: Record<string, string[]> = {
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
  };
  
`;
  content = content.substring(0, localitiesStart) + correctLocalities + content.substring(localitiesEnd);
  fs.writeFileSync('constants.ts', content, 'utf8');
  console.log("Fixed ISLAND_LOCALITIES encoding and added new localities.");
} else {
  console.log("Could not find ISLAND_LOCALITIES chunk");
}
