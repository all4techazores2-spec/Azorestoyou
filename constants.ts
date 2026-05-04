
import { Airport, Flight, Hotel, Car, Restaurant, Activity, Language, BusStop, BusSchedule, CarRentalCompany, TourGuide, Business } from './types';

export const COLORS = {
  primary: '#1A75BB', // Azul
  secondary: '#2C7A2E', // Verde
};

export const ISLAND_LOCALITIES: Record<string, string[]> = {
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
    ],
    'CAN': ['Toronto', 'Mississauga', 'Brampton', 'Oakville'],
    'USA': ['New Bedford', 'Fall River'],
    'BER': ['Hamilton', 'St. George\'s']
};

// Raw Data with localization maps
const DATA: Record<Language, {
  airports: Airport[];
  hotels: Hotel[];
  restaurants: Restaurant[];
  activities: Activity[];
  beauty: Business[];
  services: Business[];
  auto_repair: Business[];
  auto_electronics: Business[];
  used_market: Business[];
  animals: Business[];
  real_estate: Business[];
  gyms: Business[];
  stands: Business[];
  offices: Business[];
  it_services: Business[];
  perfumes: Business[];
}> = {
  pt: {
    airports: [
      { code: 'PDL', name: 'Aeroporto João Paulo II', location: 'São Miguel', isAzores: true },
      { code: 'SMA', name: 'Aeroporto de Santa Maria', location: 'Santa Maria', isAzores: true },
      { code: 'TER', name: 'Aeroporto das Lajes', location: 'Terceira', isAzores: true },
      { code: 'GRW', name: 'Aeroporto da Graciosa', location: 'Graciosa', isAzores: true },
      { code: 'SJZ', name: 'Aeroporto de São Jorge', location: 'São Jorge', isAzores: true },
      { code: 'PIX', name: 'Aeroporto do Pico', location: 'Pico', isAzores: true },
      { code: 'HOR', name: 'Aeroporto da Horta', location: 'Faial', isAzores: true },
      { code: 'FLW', name: 'Aeroporto das Flores', location: 'Flores', isAzores: true },
      { code: 'CVU', name: 'Aeródromo do Corvo', location: 'Corvo', isAzores: true },
      { code: 'CAN', name: 'Canadá', location: 'Canadá', isAzores: false },
      { code: 'USA', name: 'Estados Unidos', location: 'EUA', isAzores: false },
      { code: 'BER', name: 'Bermudas', location: 'Bermudas', isAzores: false },
    ],
    hotels: [
      { id: 'hotel-1', name: 'Azores Royal Garden', island: 'PDL', stars: 4, pricePerNight: 120, image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop', description: 'Hotel de luxo com jardim japonês e spa.', type: 'hotel', adminEmail: 'hotel@azores4you.com', adminPassword: 'admin', reservations: [], tables: [] },
      { id: 'H2', name: 'Terra Nostra Garden', island: 'PDL', stars: 5, pricePerNight: 200, image: 'https://picsum.photos/400/300?random=2', description: 'Localizado nas Furnas com piscinas termais.', type: 'hotel' },
    ],
    restaurants: [
      { id: 'R1', name: 'A Tasca', island: 'PDL', cuisine: 'Regional', rating: 4.8, reviews: 2450, image: 'https://picsum.photos/400/300?random=20', description: 'Cozinha tradicional açoriana.', adminEmail: 'atasca@azores4you.com', adminPassword: 'admin', phone: '+351 296 282 800', address: 'Rua do Aljube 16', latitude: '37.7412', longitude: '-25.6671', dishes: [], businessType: 'restaurant' },
      { id: 'R_CAN_1', name: 'Azores Toronto Grill', island: 'CAN', cuisine: 'Fusão', rating: 4.9, reviews: 320, image: 'https://picsum.photos/400/300?random=150', description: 'Autêntico sabor dos Açores no coração de Toronto.', latitude: '43.6532', longitude: '-79.3832', dishes: [], businessType: 'restaurant' }
    ],
    activities: [
      { id: 'A_CAN_1', title: 'Visita à CN Tower', type: 'activity', island: 'CAN', image: 'https://picsum.photos/400/300?random=156', description: 'Visite o ícone de Toronto.', latitude: '43.6426', longitude: '-79.3871' },
      { id: 'A_CAN_2', title: 'High Park Trail', type: 'trail', island: 'CAN', image: 'https://picsum.photos/400/300?random=157', description: 'Trilho natural no maior parque de Toronto.', latitude: '43.6465', longitude: '-79.4637' }
    ],
    beauty: [
      { id: 'B_CAN_1', name: 'Toronto Azores Spa', island: 'CAN', subcategory: 'beauty_salon', rating: 4.9, reviews: 85, image: 'https://picsum.photos/400/300?random=170', description: 'Tratamentos de luxo em Toronto.', latitude: '43.6550', longitude: '-79.3860' },
      { id: 'B_CAN_2', name: 'Luso Hairdresser', island: 'CAN', subcategory: 'hairdresser', rating: 4.7, reviews: 120, image: 'https://picsum.photos/400/300?random=171', description: 'Cortes modernos com toque português.', latitude: '43.6600', longitude: '-79.3900' }
    ],
    shops: [
      { 
        id: 'S_CAN_1', 
        name: 'Little Portugal Crafts', 
        island: 'CAN', 
        subcategory: 'crafts', 
        rating: 4.8, 
        reviews: 95, 
        image: 'https://picsum.photos/400/300?random=180', 
        description: 'Artesanato tradicional português em Toronto.', 
        latitude: '43.6470', 
        longitude: '-79.4250',
        businessType: 'shop',
        products: [
          { id: 'P1', name: 'Boneca de Milho', description: 'Artesanato tradicional feito à mão com palha de milho.', price: 15, image: 'https://picsum.photos/300/300?random=500', category: 'Artesanato' },
          { id: 'P2', name: 'Bordado dos Açores', description: 'Bordado certificado feito por artesãos locais.', price: 45, image: 'https://picsum.photos/300/300?random=501', category: 'Têxtil' }
        ]
      },
      { 
        id: 'S_CAN_2', 
        name: 'Azorean Food Market TO', 
        island: 'CAN', 
        subcategory: 'food', 
        rating: 4.9, 
        reviews: 210, 
        image: 'https://picsum.photos/400/300?random=181', 
        description: 'Produtos frescos dos Açores em Toronto.', 
        latitude: '43.6520', 
        longitude: '-79.4100',
        businessType: 'shop',
        products: [
          { id: 'P4', name: 'Queijo de São Jorge', description: 'Queijo curado de 7 meses, sabor intenso.', price: 18, image: 'https://picsum.photos/300/300?random=503', category: 'Alimentação' },
          { id: 'P5', name: 'Pimenta da Terra', description: 'O tempero essencial da cozinha açoriana.', price: 5, image: 'https://picsum.photos/300/300?random=504', category: 'Alimentação' }
        ]
      }
    ],
    services: [
      { id: 'SR_CAN_1', name: 'Ontario Electrician - Manuel', island: 'CAN', subcategory: 'electrician', rating: 4.9, reviews: 45, image: 'https://picsum.photos/400/300?random=190', description: 'Serviços elétricos em toda a GTA.', latitude: '43.7000', longitude: '-79.4000', phone: '+1 416-000-000', publicEmail: 'manuel@ontarioelec.ca' },
      { id: 'SR_CAN_2', name: 'Luso Construction', island: 'CAN', subcategory: 'bricklayer', rating: 4.7, reviews: 30, image: 'https://picsum.photos/400/300?random=191', description: 'Especialistas em alvenaria e renovações.', latitude: '43.7200', longitude: '-79.3500', phone: '+1 416-000-001', publicEmail: 'contact@lusoconstruction.ca' }
    ],
    auto_repair: [
      { id: 'AR_CAN_1', name: 'Peças Luso-Canadiana', island: 'CAN', subcategory: 'parts', rating: 4.8, reviews: 150, image: 'https://picsum.photos/400/300?random=200', description: 'Tudo o que precisa para o seu carro, peças originais e compatíveis.', latitude: '43.6500', longitude: '-79.4100' },
      { id: 'AR_CAN_2', name: 'Oficina do Manuel Toronto', island: 'CAN', subcategory: 'workshop', rating: 4.9, reviews: 320, image: 'https://picsum.photos/400/300?random=201', description: 'Mecânica geral, revisões e diagnóstico eletrónico.', latitude: '43.6600', longitude: '-79.4000' }
    ],
    auto_electronics: [
      { id: 'AE_CAN_1', name: 'Smart Auto Tech', island: 'CAN', subcategory: 'electronics', rating: 4.9, reviews: 42, image: 'https://picsum.photos/400/300?random=210', description: 'Especialistas em diagnóstico eletrónico e reprogramação.', latitude: '43.6500', longitude: '-79.4100', phone: '+1 416-555-0101', publicEmail: 'tech@smartauto.ca' },
      { id: 'AE_CAN_2', name: 'Luso Sound & Security', island: 'CAN', subcategory: 'electronics', rating: 4.7, reviews: 28, image: 'https://picsum.photos/400/300?random=211', description: 'Instalação de alarmes, GPS e sistemas de som.', latitude: '43.6600', longitude: '-79.4000', phone: '+1 416-555-0102', publicEmail: 'audio@lusoauto.ca' }
    ],
    used_market: [
      { id: 'UM_CAN_1', name: 'VW Golf 2018 - Manuel', island: 'CAN', subcategory: 'cars_motos', rating: 5.0, reviews: 1, image: 'https://picsum.photos/400/300?random=220', description: 'Excelente estado, apenas 60.000km. Todas as revisões na marca.', latitude: '43.6500', longitude: '-79.4100', phone: '+1 416-555-9001', publicEmail: 'manuel.vendas@gmail.com' },
      { id: 'UM_CAN_2', name: 'Honda CB500X - Carlos', island: 'CAN', subcategory: 'cars_motos', rating: 4.8, reviews: 3, image: 'https://picsum.photos/400/300?random=221', description: 'Mota impecável, guardada sempre em garagem.', latitude: '43.6600', longitude: '-79.4000', phone: '+1 416-555-9002', publicEmail: 'carlos.motos@outlook.com' }
    ],
    animals: [
      { id: 'PET_PDL_1', name: 'Pet Shop Açores', island: 'PDL', subcategory: 'pet_shop', rating: 4.9, reviews: 120, image: 'https://picsum.photos/400/300?random=230', description: 'Tudo para o seu animal de estimação em Ponta Delgada.', phone: '+351 296 000 000', publicEmail: 'geral@petshopacores.pt', latitude: '37.7412', longitude: '-25.6671' },
      { id: 'PET_CAN_1', name: 'Azores Pets Toronto', island: 'CAN', subcategory: 'pet_shop', rating: 4.8, reviews: 85, image: 'https://picsum.photos/400/300?random=231', description: 'Produtos de qualidade e atendimento personalizado em Toronto.', phone: '+1 416-555-0001', publicEmail: 'info@azorespets.ca', latitude: '43.6532', longitude: '-79.3832' }
    ],
    real_estate: [
      { 
        id: 'RE_1', 
        name: 'ERA Imobiliária PDL', 
        island: 'PDL', 
        rating: 4.7, 
        businessType: 'real_estate', 
        image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=800', 
        description: 'Líder em mediação imobiliária em São Miguel.', 
        phone: '+351 296 111 222', 
        publicEmail: 'pdl@era.pt', 
        latitude: '37.7400', 
        longitude: '-25.6600',
        products: [
          { id: 'H1', name: 'Moradia T3 Sete Cidades', description: 'Moradia tradicional com vista deslumbrante para a lagoa. Totalmente recuperada.', price: 285000, image: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?q=80&w=800', category: 'Moradia', panoramaUrl: '/tours/studio.jpg' },
          { id: 'H2', name: 'Apartamento T2 Centro PDL', description: 'Moderno, com acabamentos de luxo e varanda panorâmica.', price: 195000, image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=800', category: 'Apartamento' },
          { id: 'H3', name: 'Quinta com 5000m2', description: 'Vasta área de cultivo e casa principal em pedra vulcânica.', price: 420000, image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=800', category: 'Quinta' }
        ]
      },
      { 
        id: 'RE_2', 
        name: 'RE/MAX Expo Açores', 
        island: 'PDL', 
        rating: 4.8, 
        businessType: 'real_estate', 
        image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800', 
        description: 'Especialistas no mercado imobiliário açoriano.', 
        phone: '+351 296 333 444', 
        publicEmail: 'expo@remax.pt', 
        latitude: '37.7450', 
        longitude: '-25.6700',
        products: [
          { id: 'H4', name: 'Lote de Terreno Lagoa', description: 'Terreno urbano com viabilidade de construção para moradia unifamiliar.', price: 65000, image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=800', category: 'Terreno' },
          { id: 'H5', name: 'Vivenda T4 com Piscina', description: 'Excelente exposição solar e amplas áreas de lazer.', price: 550000, image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=800', category: 'Moradia' }
        ]
      }
    ],
    gyms: [
      { 
        id: 'GYM_1', 
        name: 'Elite Health Club', 
        island: 'PDL', 
        rating: 4.9, 
        businessType: 'gyms', 
        image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800', 
        description: 'O ginásio mais completo de Ponta Delgada.', 
        phone: '+351 296 555 666', 
        publicEmail: 'geral@eliteclub.pt', 
        latitude: '37.7420', 
        longitude: '-25.6650',
        products: [
          { id: 'G1', name: 'Passadeiras Matrix T75', description: 'Tecnologia de ponta com ecrã tátil e simulação de trilhos.', price: 0, image: 'https://images.unsplash.com/photo-1578608712688-469511b5003a?q=80&w=800', category: 'Cardio' },
          { id: 'G2', name: 'Zona de Pesos Livres', description: 'Halteres até 50kg e múltiplas bancadas de treino.', price: 0, image: 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?q=80&w=800', category: 'Musculação' }
        ]
      },
      { 
        id: 'GYM_2', 
        name: 'Crossfit PDL', 
        island: 'PDL', 
        rating: 4.8, 
        businessType: 'gyms', 
        image: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=800', 
        description: 'Treino funcional de alta intensidade.', 
        phone: '+351 296 777 888', 
        publicEmail: 'info@crossfitpdl.pt', 
        latitude: '37.7500', 
        longitude: '-25.6800',
        products: [
          { id: 'G4', name: 'Racks de Crossfit', description: 'Estrutura completa para pull-ups, squats e ginástica.', price: 0, image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=800', category: 'Equipamento' },
          { id: 'G5', name: 'Remo Concept2', description: 'A máquina de cardio padrão ouro para treino funcional.', price: 0, image: 'https://images.unsplash.com/photo-1590239098569-e5ac84065679?q=80&w=800', category: 'Cardio' }
        ]
      }
    ],
    stands: [
      { 
        id: 'ST_1', 
        name: 'Stand J. Canavarro', 
        island: 'PDL', 
        rating: 4.6, 
        businessType: 'stands', 
        image: 'https://images.unsplash.com/photo-1562141961-b5d1972b73c3?q=80&w=800', 
        description: 'Venda de viaturas novas e seminovas com garantia total.', 
        phone: '+351 296 999 000', 
        publicEmail: 'vendas@jcanavarro.pt', 
        latitude: '37.7380', 
        longitude: '-25.6580',
        featuredVehicles: [
          { id: 'C1', model: 'BMW M4 Competition', fuelType: 'Gasolina', seats: 4, image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?q=80&w=800', description: 'Performance pura e luxo inigualável.', features: ['450cv', 'Couro', 'Auto'], isAvailable: true, companyId: 'ST_1', type: 'SUV', pricePerDay: 0 },
          { id: 'C2', model: 'Mercedes-Benz A45 AMG', fuelType: 'Gasolina', seats: 5, image: 'https://images.unsplash.com/photo-1506469717960-433cebe3f181?q=80&w=800', description: 'O hatchback mais potente do mundo.', features: ['421cv', '4Matic', 'Buckets'], isAvailable: true, companyId: 'ST_1', type: 'SUV', pricePerDay: 0 }
        ],
        vehicles: [
          { id: 'C3', model: 'VW Golf VIII R', fuelType: 'Gasolina', seats: 5, image: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?q=80&w=800', description: 'Versatilidade e desportivismo.', features: ['320cv', 'Digital Cockpit'], isAvailable: true, companyId: 'ST_1', type: 'SUV', pricePerDay: 0 },
          { id: 'C4', model: 'Audi RS3 Sportback', fuelType: 'Gasolina', seats: 5, image: 'https://images.unsplash.com/photo-1606148632399-6868af6932f3?q=80&w=800', description: 'O som icónico do motor de 5 cilindros.', features: ['400cv', 'Quattro'], isAvailable: true, companyId: 'ST_1', type: 'SUV', pricePerDay: 0 }
        ]
      },
      { 
        id: 'ST_2', 
        name: 'Auto Stand Açores', 
        island: 'PDL', 
        rating: 4.5, 
        businessType: 'stands', 
        image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=800', 
        description: 'A maior frota de usados multimarca da ilha.', 
        phone: '+351 296 123 456', 
        publicEmail: 'geral@autostand.pt', 
        latitude: '37.7410', 
        longitude: '-25.6620',
        featuredVehicles: [
          { id: 'C6', model: 'Toyota Hilux Invincible', fuelType: 'Gasóleo', seats: 5, image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=800', description: 'Inquebrável e pronta para qualquer terreno.', features: ['4x4', 'Gancho de Reboque'], isAvailable: true, companyId: 'ST_2', type: 'SUV', pricePerDay: 0 }
        ],
        vehicles: [
          { id: 'C7', model: 'Dacia Duster 4x4', fuelType: 'Gasóleo', seats: 5, image: 'https://images.unsplash.com/photo-1594502184342-2e12f877aa73?q=80&w=800', description: 'O aventureiro económico.', features: ['Diesel', 'Ar Condicionado'], isAvailable: true, companyId: 'ST_2', type: 'SUV', pricePerDay: 0 },
          { id: 'C8', model: 'Fiat 500e', fuelType: 'Elétrico', seats: 4, image: 'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?q=80&w=800', description: 'Estilo icónico com zero emissões.', features: ['City Mode', 'Teto Panorâmico'], isAvailable: true, companyId: 'ST_2', type: 'SUV', pricePerDay: 0 }
        ]
      }
    ],
    offices: [
      { id: 'OFF_1', name: 'Escritório 296 Cowork', island: 'PDL', rating: 4.9, businessType: 'office', image: 'https://picsum.photos/400/300?random=330', description: 'Espaço de trabalho partilhado no centro da cidade.', phone: '+351 296 296 296', publicEmail: 'hello@cowork296.pt', latitude: '37.7395', longitude: '-25.6630' },
      { id: 'OFF_2', name: 'Serviços Jurídicos PDL', island: 'PDL', rating: 4.7, businessType: 'office', image: 'https://picsum.photos/400/300?random=331', description: 'Apoio jurídico e administrativo especializado.', phone: '+351 296 000 111', publicEmail: 'advogados@pdl.pt', latitude: '37.7405', longitude: '-25.6640' }
    ],
    it_services: [
      { id: 'IT_1', name: 'Chip7 Ponta Delgada', island: 'PDL', rating: 4.4, businessType: 'it_services', image: 'https://picsum.photos/400/300?random=340', description: 'A sua loja de informática de confiança.', phone: '+351 296 444 555', publicEmail: 'pdl@chip7.pt', latitude: '37.7430', longitude: '-25.6680' },
      { id: 'IT_2', name: 'PC Clinic Açores', island: 'PDL', rating: 4.8, businessType: 'it_services', image: 'https://picsum.photos/400/300?random=341', description: 'Reparação de computadores e smartphones.', phone: '+351 296 666 777', publicEmail: 'ajuda@pcclinic.pt', latitude: '37.7440', longitude: '-25.6690' }
    ],
    perfumes: [
      { id: 'PER_1', name: 'Perfumes & Companhia', island: 'PDL', rating: 4.7, businessType: 'perfumes', image: 'https://picsum.photos/400/300?random=350', description: 'As melhores fragrâncias internacionais.', phone: '+351 296 888 999', publicEmail: 'geral@perfumes.pt', latitude: '37.7415', longitude: '-25.6665' },
      { id: 'PER_2', name: 'Essência dos Açores', island: 'PDL', rating: 4.9, businessType: 'perfumes', image: 'https://picsum.photos/400/300?random=351', description: 'Perfumes artesanais inspirados na nossa terra.', phone: '+351 296 000 999', publicEmail: 'loja@essencia.pt', latitude: '37.7425', longitude: '-25.6675' }
    ]
  },
  en: {
    airports: [
      { code: 'PDL', name: 'João Paulo II Airport', location: 'São Miguel', isAzores: true },
      { code: 'SMA', name: 'Santa Maria Airport', location: 'Santa Maria', isAzores: true },
      { code: 'TER', name: 'Lajes Airport', location: 'Terceira', isAzores: true },
      { code: 'GRW', name: 'Graciosa Airport', location: 'Graciosa', isAzores: true },
      { code: 'SJZ', name: 'São Jorge Airport', location: 'São Jorge', isAzores: true },
      { code: 'PIX', name: 'Pico Airport', location: 'Pico', isAzores: true },
      { code: 'HOR', name: 'Horta Airport', location: 'Faial', isAzores: true },
      { code: 'FLW', name: 'Flores Airport', location: 'Flores', isAzores: true },
      { code: 'CVU', name: 'Corvo Airfield', location: 'Corvo', isAzores: true },
      { code: 'CAN', name: 'Canada', location: 'Canada', isAzores: false },
      { code: 'USA', name: 'United States', location: 'USA', isAzores: false },
      { code: 'BER', name: 'Bermuda', location: 'Bermuda', isAzores: false },
    ],
    hotels: [], restaurants: [], activities: [], beauty: [], shops: [], services: [], auto_repair: [], auto_electronics: [], used_market: [], animals: [], real_estate: [], gyms: [], stands: [], offices: [], it_services: [], perfumes: []
  }
};

export const getAirports = (lang: Language): Airport[] => DATA[lang]?.airports?.length ? DATA[lang].airports : DATA['pt'].airports;
export const getHotels = (lang: Language): Hotel[] => DATA[lang]?.hotels?.length ? DATA[lang].hotels : DATA['pt'].hotels;
export const getRestaurants = (lang: Language): Restaurant[] => DATA[lang]?.restaurants?.length ? DATA[lang].restaurants : DATA['pt'].restaurants;
export const getActivities = (lang: Language): Activity[] => DATA[lang]?.activities?.length ? DATA[lang].activities : DATA['pt'].activities;
export const getShops = (lang: Language): Business[] => DATA[lang]?.shops?.length ? DATA[lang].shops : DATA['pt'].shops;
export const getBeauty = (lang: Language): Business[] => DATA[lang]?.beauty?.length ? DATA[lang].beauty : DATA['pt'].beauty;
export const getServices = (lang: Language): Business[] => DATA[lang]?.services?.length ? DATA[lang].services : DATA['pt'].services;
export const getAutoRepairs = (lang: Language): Business[] => DATA[lang]?.auto_repair?.length ? DATA[lang].auto_repair : DATA['pt'].auto_repair;
export const getAutoElectronics = (lang: Language): Business[] => DATA[lang]?.auto_electronics?.length ? DATA[lang].auto_electronics : DATA['pt'].auto_electronics;
export const getUsedMarket = (lang: Language): Business[] => DATA[lang]?.used_market?.length ? DATA[lang].used_market : DATA['pt'].used_market;
export const getAnimals = (lang: Language): Business[] => DATA[lang]?.animals?.length ? DATA[lang].animals : DATA['pt'].animals;
export const getRealEstate = (lang: Language): Business[] => DATA[lang]?.real_estate?.length ? DATA[lang].real_estate : DATA['pt'].real_estate;
export const getGyms = (lang: Language): Business[] => DATA[lang]?.gyms?.length ? DATA[lang].gyms : DATA['pt'].gyms;
export const getStands = (lang: Language): Business[] => DATA[lang]?.stands?.length ? DATA[lang].stands : DATA['pt'].stands;
export const getOffices = (lang: Language): Business[] => DATA[lang]?.offices?.length ? DATA[lang].offices : DATA['pt'].offices;
export const getITServices = (lang: Language): Business[] => DATA[lang]?.it_services?.length ? DATA[lang].it_services : DATA['pt'].it_services;
export const getPerfumes = (lang: Language): Business[] => DATA[lang]?.perfumes?.length ? DATA[lang].perfumes : DATA['pt'].perfumes;

export const BUS_SCHEDULES: BusSchedule[] = [];
export const CAR_RENTAL_COMPANIES: CarRentalCompany[] = [];
export const CARS_BASE: Car[] = [];
export const FLIGHTS: Flight[] = [];
export const TOUR_GUIDES: TourGuide[] = [];

export const getCars = (lang: Language): Car[] => CARS_BASE;
export const getFlights = (lang: Language): Flight[] => FLIGHTS;
