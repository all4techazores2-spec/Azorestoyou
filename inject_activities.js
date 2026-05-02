import fs from 'fs';
import path from 'path';

const file = path.resolve('constants.ts');
let content = fs.readFileSync(file, 'utf8');

const newActivities = [
  // SAO MIGUEL (PDL)
  { id: "A_SM1", title: "Banhos férreos no Parque Terra Nostra", type: "activity", island: "PDL", image: "https://picsum.photos/400/300?random=101", description: "Banhos férreos no Parque Terra Nostra (Furnas)." },
  { id: "A_SM2", title: "Banho noturno na Poça da Dona Beija", type: "activity", island: "PDL", image: "https://picsum.photos/400/300?random=102", description: "Banho noturno na Poça da Dona Beija (Furnas)." },
  { id: "A_SM3", title: "Piscinas termais da Ponta da Ferraria", type: "landscape", island: "PDL", image: "https://picsum.photos/400/300?random=103", description: "Piscinas termais com vista mar na Ponta da Ferraria (Ginetes)." },
  { id: "A_SM4", title: "Cascata da Caldeira Velha", type: "landscape", island: "PDL", image: "https://picsum.photos/400/300?random=104", description: "Cascata de água quente na Caldeira Velha (Ribeira Grande)." },
  { id: "A_SM5", title: "Fumarolas e Caldeiras das Furnas", type: "landscape", island: "PDL", image: "https://picsum.photos/400/300?random=105", description: "Visita às Fumarolas e Caldeiras das Furnas." },
  { id: "A_SM6", title: "Cozido das Furnas", type: "tradition", island: "PDL", image: "https://picsum.photos/400/300?random=106", description: "Observação da confeção do Cozido das Furnas (buracos geotérmicos)." },
  { id: "A_SM7", title: "Trilho da Lagoa do Fogo", type: "trail", island: "PDL", image: "https://picsum.photos/400/300?random=107", description: "Trilho da Lagoa do Fogo (reserva natural)." },
  { id: "A_SM8", title: "Miradouro da Boca do Inferno", type: "landscape", island: "PDL", image: "https://picsum.photos/400/300?random=108", description: "Miradouro da Boca do Inferno (Vista sobre Sete Cidades)." },
  { id: "A_SM9", title: "Plantações de Chá Gorreana", type: "culture", island: "PDL", image: "https://picsum.photos/400/300?random=109", description: "Visita às plantações de Chá Gorreana e Porto Formoso." },
  { id: "A_SM10", title: "Estufas de Ananás", type: "culture", island: "PDL", image: "https://picsum.photos/400/300?random=110", description: "Tour pelas estufas de Ananás (Ponta Delgada)." },
  { id: "A_SM11", title: "Whale Watching", type: "activity", island: "PDL", image: "https://picsum.photos/400/300?random=111", description: "Whale Watching (Portas do Mar)." },
  { id: "A_SM12", title: "Snorkeling no Ilhéu", type: "activity", island: "PDL", image: "https://picsum.photos/400/300?random=112", description: "Snorkeling no Ilhéu de Vila Franca do Campo (cratera submersa)." },

  // SANTA MARIA (SMA)
  { id: "A_SM_1", title: "Barreiro da Faneca", type: "landscape", island: "SMA", image: "https://picsum.photos/400/300?random=113", description: "Safari fotográfico no Barreiro da Faneca (Deserto Vermelho)." },
  { id: "A_SM_2", title: "Fósseis na Pedreira do Campo", type: "landscape", island: "SMA", image: "https://picsum.photos/400/300?random=114", description: "Visita aos fósseis marinhos na Pedreira do Campo." },
  { id: "A_SM_3", title: "Colunas da Ribeira do Maloás", type: "landscape", island: "SMA", image: "https://picsum.photos/400/300?random=115", description: "Observação das colunas basálticas na Ribeira do Maloás." },
  { id: "A_SM_4", title: "Surf na Praia Formosa", type: "activity", island: "SMA", image: "https://picsum.photos/400/300?random=116", description: "Surf e relaxamento na Praia Formosa (areia clara)." },
  { id: "A_SM_5", title: "Mergulho com Jamantas", type: "activity", island: "SMA", image: "https://picsum.photos/400/300?random=117", description: "Mergulho com Jamantas (Reserva da Baixa do Ambrósio)." },

  // TERCEIRA (TER)
  { id: "A_TER1", title: "Descida ao Algar do Carvão", type: "landscape", island: "TER", image: "https://picsum.photos/400/300?random=118", description: "Descida ao Algar do Carvão (vulcão visitável)." },
  { id: "A_TER2", title: "Gruta do Natal", type: "trail", island: "TER", image: "https://picsum.photos/400/300?random=119", description: "Travessia da Gruta do Natal (tubo lávico)." },
  { id: "A_TER3", title: "Centro Histórico de Angra", type: "culture", island: "TER", image: "https://picsum.photos/400/300?random=120", description: "Walking tour pelo Centro Histórico de Angra do Heroísmo (UNESCO)." },
  { id: "A_TER4", title: "Impérios do Espírito Santo", type: "culture", island: "TER", image: "https://picsum.photos/400/300?random=121", description: "Visita às Impérios do Espírito Santo (arquitetura colorida típica)." },
  { id: "A_TER5", title: "Piscinas Naturais dos Biscoitos", type: "activity", island: "TER", image: "https://picsum.photos/400/300?random=122", description: "Banhos nas piscinas naturais de rocha vulcânica dos Biscoitos." },
  { id: "A_TER6", title: "Alcatra e Queijadas", type: "tradition", island: "TER", image: "https://picsum.photos/400/300?random=123", description: "Tour gastronómico: Prova de Alcatra de Carne e Queijadas da Dona Amélia." },

  // PICO (PIC)
  { id: "A_PIC1", title: "Subida à Montanha do Pico", type: "trail", island: "PIC", image: "https://picsum.photos/400/300?random=124", description: "Subida à Montanha do Pico (2351m) com pernoita ou subida diurna." },
  { id: "A_PIC2", title: "Cultura da Vinha", type: "culture", island: "PIC", image: "https://picsum.photos/400/300?random=125", description: "Caminhada pela Paisagem da Cultura da Vinha (Património Mundial)." },
  { id: "A_PIC3", title: "Prova de Verdelho", type: "tradition", island: "PIC", image: "https://picsum.photos/400/300?random=126", description: "Prova de vinhos Verdelho em adegas de pedra basáltica." },
  { id: "A_PIC4", title: "Museu da Indústria Baleeira", type: "culture", island: "PIC", image: "https://picsum.photos/400/300?random=127", description: "Visita ao Museu da Indústria Baleeira (São Roque)." },
  { id: "A_PIC5", title: "Sea Kayaking com Cetáceos", type: "activity", island: "PIC", image: "https://picsum.photos/400/300?random=128", description: "Saídas de Sea Kayaking para observação de cetáceos." },

  // FAIAL (FAI)
  { id: "A_FAI1", title: "Vulcão dos Capelinhos", type: "landscape", island: "FAI", image: "https://picsum.photos/400/300?random=129", description: "Exploração do vulcão dos Capelinhos (paisagem lunar/cinzas de 1957)." },
  { id: "A_FAI2", title: "Caldeira do Faial", type: "trail", island: "FAI", image: "https://picsum.photos/400/300?random=130", description: "Descida à Caldeira do Faial (trilho de 8km em redor da cratera)." },
  { id: "A_FAI3", title: "Murais na Marina da Horta", type: "tradition", island: "FAI", image: "https://picsum.photos/400/300?random=131", description: "Pintura de murais na Marina da Horta (tradição de velejadores)." },
  { id: "A_FAI4", title: "Peter Café Sport", type: "culture", island: "FAI", image: "https://picsum.photos/400/300?random=132", description: "Visita ao Peter Café Sport (museu de Scrimshaw e convívio)." },

  // SÃO JORGE (SJG)
  { id: "A_SJG1", title: "Fajã da Caldeira de Sto. Cristo", type: "trail", island: "SJG", image: "https://picsum.photos/400/300?random=133", description: "Descida à Fajã da Caldeira de Santo Cristo (Acesso apenas a pé ou moto 4)." },
  { id: "A_SJG2", title: "Surf na Fajã do Santo Cristo", type: "activity", island: "SJG", image: "https://picsum.photos/400/300?random=134", description: "Surf na Fajã do Santo Cristo (ondas de classe mundial)." },
  { id: "A_SJG3", title: "Degustação Queijo São Jorge", type: "tradition", island: "SJG", image: "https://picsum.photos/400/300?random=135", description: "Workshop de degustação de Queijo de São Jorge (DOP) na Cooperativa da Única." },
  { id: "A_SJG4", title: "Plantações de café (Fajã dos Vimes)", type: "culture", island: "SJG", image: "https://picsum.photos/400/300?random=136", description: "Visita às únicas plantações de café da Europa (Fajã dos Vimes)." },

  // GRACIOSA (GRW)
  { id: "A_GRW1", title: "Furna do Enxofre", type: "landscape", island: "GRW", image: "https://picsum.photos/400/300?random=137", description: "Descida à Furna do Enxofre (lago interior sob uma cúpula vulcânica gigante)." },
  { id: "A_GRW2", title: "Termas do Carapacho", type: "activity", island: "GRW", image: "https://picsum.photos/400/300?random=138", description: "Banhos nas Termas do Carapacho (vista mar)." },
  { id: "A_GRW3", title: "Rota dos Moinhos de Vento", type: "culture", island: "GRW", image: "https://picsum.photos/400/300?random=139", description: "Rota dos Moinhos de Vento de cúpula vermelha." },

  // FLORES (FLW)
  { id: "A_FLW1", title: "Canyoning nas Flores", type: "activity", island: "FLW", image: "https://picsum.photos/400/300?random=140", description: "Canyoning nas cascatas das Flores (considerado dos melhores do mundo)." },
  { id: "A_FLW2", title: "Poço da Alagoinha", type: "landscape", island: "FLW", image: "https://picsum.photos/400/300?random=141", description: "Fotografia no Poço da Alagoinha (Lagoa das Patas com dezenas de quedas d'água)." },
  { id: "A_FLW3", title: "Rocha dos Bordões", type: "landscape", island: "FLW", image: "https://picsum.photos/400/300?random=142", description: "Visita à Rocha dos Bordões (organização geológica prismática)." },
  { id: "A_FLW4", title: "Passeio à Gruta dos Enxaréus", type: "activity", island: "FLW", image: "https://picsum.photos/400/300?random=143", description: "Passeio de barco às grutas da costa (Gruta dos Enxaréus)." },

  // CORVO (CVU)
  { id: "A_CVU1", title: "Trilho do Caldeirão", type: "trail", island: "CVU", image: "https://picsum.photos/400/300?random=144", description: "Trilho pelo interior do Caldeirão (cratera de 2km com lagoas e ilhotas)." },
  { id: "A_CVU2", title: "Birdwatching no Corvo", type: "activity", island: "CVU", image: "https://picsum.photos/400/300?random=145", description: "Observação de aves raras migradas da América do Norte (outubro)." },
  { id: "A_CVU3", title: "Artesanato Local", type: "culture", island: "CVU", image: "https://picsum.photos/400/300?random=146", description: "Visita às oficinas de barretos de lã típicos e fechaduras de madeira." }
];

// Stringify array elements
const activitiesString = newActivities.map(a => `      ${JSON.stringify(a)},`).join('\n');

// For each language in DATA, we inject these activities into the activities array
// The target is: "activities: [" followed by some lines and "...LANDSCAPES"
const regex = /(activities:\s*\[[\s\S]*?)(...LANDSCAPES)/g;
content = content.replace(regex, `$1${activitiesString}\n      $2`);

fs.writeFileSync(file, content);
console.log('constants.ts updated successfully with 41 new activities.');
