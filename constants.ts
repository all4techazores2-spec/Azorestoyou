
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
      { code: 'HOR', name: 'Aeroporto da Horta', location: 'Faial', isAzores: true },
      { code: 'PIX', name: 'Aeroporto do Pico', location: 'Pico', isAzores: true },
      { code: 'SJZ', name: 'Aeródromo de São Jorge', location: 'São Jorge', isAzores: true },
      { code: 'GRW', name: 'Aeródromo da Graciosa', location: 'Graciosa', isAzores: true },
      { code: 'FLW', name: 'Aeroporto das Flores', location: 'Flores', isAzores: true },
      { code: 'CVU', name: 'Aeródromo do Corvo', location: 'Corvo', isAzores: true },
      { code: 'SMA', name: 'Aeroporto de Santa Maria', location: 'Santa Maria', isAzores: true },
      { code: 'LIS', name: 'Humberto Delgado', location: 'Lisboa, Portugal', isAzores: false },
      { code: 'OPO', name: 'Francisco Sá Carneiro', location: 'Porto, Portugal', isAzores: false },
      { code: 'BOS', name: 'Logan International', location: 'Boston, EUA', isAzores: false },
      { code: 'YYZ', name: 'Pearson International', location: 'Toronto, Canadá', isAzores: false },
      { code: 'LHR', name: 'Heathrow', location: 'Londres, RU', isAzores: false },
      { code: 'JFK', name: 'John F. Kennedy', location: 'Nova Iorque, EUA', isAzores: false },
      { code: 'FRA', name: 'Frankfurt Airport', location: 'Frankfurt, Alemanha', isAzores: false },
    ],
    hotels: [
      { id: 'H1', name: 'Azores Royal Garden', island: 'PDL', stars: 4, pricePerNight: 120, image: 'https://picsum.photos/400/300?random=1', description: 'Hotel de luxo com jardim japonês e spa.' },
      { id: 'H2', name: 'Terra Nostra Garden', island: 'PDL', stars: 5, pricePerNight: 200, image: 'https://picsum.photos/400/300?random=2', description: 'Localizado nas Furnas com piscinas termais.' },
      { id: 'H3', name: 'Terceira Mar Hotel', island: 'TER', stars: 4, pricePerNight: 110, image: 'https://picsum.photos/400/300?random=3', description: 'Quartos com vista mar e piscina de água salgada.' },
      { id: 'H4', name: 'Faial Resort Hotel', island: 'HOR', stars: 4, pricePerNight: 130, image: 'https://picsum.photos/400/300?random=4', description: 'Com vista privilegiada para a montanha do Pico.' },
      { id: 'H5', name: 'Hotel São Jorge Garden', island: 'SJZ', stars: 3, pricePerNight: 90, image: 'https://picsum.photos/400/300?random=50', description: 'Situado sobre as falésias com vista para o Pico.' },
      { id: 'H6', name: 'Graciosa Resort', island: 'GRW', stars: 4, pricePerNight: 105, image: 'https://picsum.photos/400/300?random=51', description: 'Resort moderno numa ilha tranquila.' },
      { id: 'H7', name: 'Guest House Comodoro', island: 'CVU', stars: 3, pricePerNight: 75, image: 'https://picsum.photos/400/300?random=52', description: 'Alojamento acolhedor na ilha mais pequena.' },
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
        reservations: [
          { id: 'RES_TEST', customerName: 'Viajante', customerEmail: 'traveler@azores4you.com', customerPhone: '912345678', date: '2026-04-20', time: '13:00', guests: 2, status: 'finished', createdAt: '2026-04-10T10:00:00Z' }
        ],
        updates: [
          { id: 'UPD_1', type: 'news', title: 'Novo Prato!', description: 'Venha provar a nossa mais recente novidade: Bife de Atum com sésamo.' },
          { id: 'UPD_2', type: 'event', title: 'Fim de Semana Temático', description: 'Acompanhe-nos este sábado para um menu de degustação exclusivo.', date: '2026-05-15', image: 'https://picsum.photos/400/200?random=88', pricePerPerson: 40, pricePerCouple: 75 }
        ],
        dishes: [
          { name: 'Bife de Atum', description: 'Bife de atum fresco com sementes de sésamo.', price: 18, image: 'https://picsum.photos/300/200?random=21' },
          { name: 'Polvo à Lagareiro', description: 'Polvo assado com batatas a murro.', price: 22, image: 'https://picsum.photos/300/200?random=22' },
          { name: 'Ananás Caramelizado', description: 'Ananás local caramelizado.', price: 6, image: 'https://picsum.photos/300/200?random=23' }
        ]
      },
      {
        id: 'R2', name: 'O Pescador', island: 'TER', cuisine: 'Marisco', rating: 4.6, reviews: 890, image: 'https://picsum.photos/400/300?random=24',
        description: 'O melhor peixe fresco na Terceira, localizado junto ao porto.',
        dishes: [
          { name: 'Lapas Grelhadas', description: 'Lapas grelhadas com manteiga de alho.', price: 12, image: 'https://picsum.photos/300/200?random=25' },
          { name: 'Alcatra', description: 'Prato de carne cozinhado lentamente em alguidar de barro.', price: 19, image: 'https://picsum.photos/300/200?random=26' }
        ]
      },
      {
        id: 'R3', name: 'Peter Café Sport', island: 'HOR', cuisine: 'Bar/Pub', rating: 4.9, reviews: 5000, image: 'https://picsum.photos/400/300?random=27',
        description: 'Bar de marinheiros mundialmente famoso. Conhecido pelo Gin Tónico e bolo de chocolate.',
        dishes: [
          { name: 'Gin do Mar', description: 'Gin Tónico de assinatura.', price: 8, image: 'https://picsum.photos/300/200?random=28' },
          { name: 'Bolo de Chocolate do Peter', description: 'Bolo de chocolate denso e rico.', price: 5, image: 'https://picsum.photos/300/200?random=29' }
        ]
      },
      {
        id: 'R4', name: 'Restaurante Velas', island: 'SJZ', cuisine: 'Regional', rating: 4.5, reviews: 320, image: 'https://picsum.photos/400/300?random=60',
        description: 'Especialistas em Amêijoas da Caldeira e Queijo de São Jorge.',
        dishes: [
          { name: 'Amêijoas', description: 'Amêijoas frescas da Caldeira de Santo Cristo.', price: 25, image: 'https://picsum.photos/300/200?random=61' },
          { name: 'Tábua de Queijos', description: 'Seleção de queijos de São Jorge curados.', price: 15, image: 'https://picsum.photos/300/200?random=62' }
        ]
      }
    ],
    activities: [
      // SÃO MIGUEL (PDL)
      { id: 'A1', title: 'Trilho Sete Cidades', type: 'trail', island: 'PDL', image: 'https://picsum.photos/400/300?random=30', description: 'Caminhe à volta da cratera das lagoas azul e verde.', distance: '12km', duration: '4h', difficulty: 'Moderado' },
      { id: 'A1_2', title: 'Lagoa do Fogo', type: 'trail', island: 'PDL', image: 'https://picsum.photos/400/300?random=130', description: 'Trilho que desce até à praia da lagoa mais selvagem da ilha.', distance: '11km', duration: '4h 30m', difficulty: 'Difícil' },
      { id: 'A1_3', title: 'Salto do Cabrito', type: 'trail', island: 'PDL', image: 'https://picsum.photos/400/300?random=131', description: 'Caminhada circular que passa por uma cascata e central hidroelétrica.', distance: '8.5km', duration: '3h', difficulty: 'Fácil' },
      { id: 'A1_4', title: 'Janela do Inferno', type: 'trail', island: 'PDL', image: 'https://picsum.photos/400/300?random=132', description: 'Trilho místico que passa por túneis e aquedutos antigos.', distance: '7.6km', duration: '2h 30m', difficulty: 'Fácil' },
      { id: 'A1_5', title: 'Pico da Vara', type: 'trail', island: 'PDL', image: 'https://picsum.photos/400/300?random=133', description: 'Subida ao ponto mais alto da ilha de São Miguel.', distance: '7km', duration: '3h', difficulty: 'Difícil' },
      
      // TERCEIRA (TER)
      { id: 'A2', title: 'Algar do Carvão', type: 'landscape', island: 'TER', image: 'https://picsum.photos/400/300?random=31', description: 'Desça ao interior de uma antiga chaminé vulcânica.' },
      { id: 'A2_2', title: 'Mistérios Negros', type: 'trail', island: 'TER', image: 'https://picsum.photos/400/300?random=134', description: 'Trilho desafiante entre domos vulcânicos e vegetação densa.', distance: '5km', duration: '2h 30m', difficulty: 'Difícil' },
      { id: 'A2_3', title: 'Rocha do Chambre', type: 'trail', island: 'TER', image: 'https://picsum.photos/400/300?random=135', description: 'Vistas espetaculares sobre a caldeira e o interior da ilha.', distance: '8.8km', duration: '3h 30m', difficulty: 'Moderado' },
      { id: 'A2_4', title: 'Monte Brasil', type: 'trail', island: 'TER', image: 'https://picsum.photos/400/300?random=136', description: 'Caminhada histórica com vistas sobre Angra do Heroísmo.', distance: '7.5km', duration: '2h 30m', difficulty: 'Fácil' },
      { id: 'A2_5', title: 'Baía da Agualva', type: 'trail', island: 'TER', image: 'https://picsum.photos/400/300?random=137', description: 'Trilho costeiro com formações geológicas impressionantes.', distance: '3.8km', duration: '1h 30m', difficulty: 'Fácil' },

      // FAIAL (HOR)
      { id: 'A4_2', title: 'Caldeira do Faial', type: 'trail', island: 'HOR', image: 'https://picsum.photos/400/300?random=138', description: 'Caminhada circular em redor da enorme caldeira central.', distance: '7km', duration: '2h 30m', difficulty: 'Fácil' },
      { id: 'A4_3', title: 'Trilho dos Capelinhos', type: 'trail', island: 'HOR', image: 'https://picsum.photos/400/300?random=139', description: 'Caminhe sobre as cinzas do último vulcão dos Açores.', distance: '3.2km', duration: '1h 30m', difficulty: 'Fácil' },
      { id: 'A4_4', title: 'Levada do Faial', type: 'trail', island: 'HOR', image: 'https://picsum.photos/400/300?random=140', description: 'Um dos maiores trilhos de levada no arquipélago.', distance: '24km', duration: '7h', difficulty: 'Moderado' },
      { id: 'A4_5', title: 'Morro de Castelo Branco', type: 'trail', island: 'HOR', image: 'https://picsum.photos/400/300?random=141', description: 'Trilho costeiro até à icónica formação rochosa branca.', distance: '4km', duration: '1h 30m', difficulty: 'Fácil' },

      // PICO (PIX)
      { id: 'A7', title: 'Subida ao Pico', type: 'trail', island: 'PIX', image: 'https://picsum.photos/400/300?random=142', description: 'O maior desafio: subir ao ponto mais alto de Portugal.', distance: '8km', duration: '7h', difficulty: 'Difícil' },
      { id: 'A7_2', title: 'Caminho das Lagoas', type: 'trail', island: 'PIX', image: 'https://picsum.photos/400/300?random=143', description: 'Trilho pelo planalto central passando por várias lagoas.', distance: '22km', duration: '6h 30m', difficulty: 'Moderado' },
      { id: 'A7_3', title: 'Criação Velha', type: 'trail', island: 'PIX', image: 'https://picsum.photos/400/300?random=144', description: 'Caminhada pelas vinhas Património Mundial da UNESCO.', distance: '6.9km', duration: '2h', difficulty: 'Fácil' },
      { id: 'A7_4', title: 'Ponta da Ilha', type: 'trail', island: 'PIX', image: 'https://picsum.photos/400/300?random=145', description: 'Trilho costeiro na ponta leste da ilha do Pico.', distance: '10km', duration: '3h', difficulty: 'Fácil' },
      { id: 'A7_5', title: 'Calheta de Nesquim', type: 'trail', island: 'PIX', image: 'https://picsum.photos/400/300?random=146', description: 'Trilho histórico ligado à tradição baleeira.', distance: '12km', duration: '4h', difficulty: 'Moderado' },

      // SÃO JORGE (SJZ)
      { id: 'A4', title: 'Fajãs de São Jorge', type: 'landscape', island: 'SJZ', image: 'https://picsum.photos/400/300?random=33', description: 'Explore as icónicas planícies costeiras formadas por lava.' },
      { id: 'A4_6', title: 'Fajã dos Cubres', type: 'trail', island: 'SJZ', image: 'https://picsum.photos/400/300?random=147', description: 'Descida da Serra do Topo até à Fajã de Santo Cristo.', distance: '10km', duration: '3h 30m', difficulty: 'Moderado' },
      { id: 'A4_7', title: 'Pico da Esperança', type: 'trail', island: 'SJZ', image: 'https://picsum.photos/400/300?random=148', description: 'Caminhada pelo cume da ilha com vistas para as ilhas vizinhas.', distance: '17km', duration: '5h', difficulty: 'Moderado' },
      { id: 'A4_8', title: 'Serra do Topo', type: 'trail', island: 'SJZ', image: 'https://picsum.photos/400/300?random=149', description: 'Trilho de montanha com vistas deslumbrantes sobre as fajãs.', distance: '5km', duration: '2h', difficulty: 'Fácil' },
      { id: 'A4_9', title: 'Fajã de São João', type: 'trail', island: 'SJZ', image: 'https://picsum.photos/400/300?random=150', description: 'Trilho tradicional que liga várias fajãs isoladas.', distance: '10km', duration: '3h 30m', difficulty: 'Moderado' },

      // GRACIOSA (GRW)
      { id: 'A6', title: 'Furna do Enxofre', type: 'poi', island: 'GRW', image: 'https://picsum.photos/400/300?random=35', description: 'Uma caverna vulcânica única com um lago subterrâneo.' },
      { id: 'A6_2', title: 'Caldeira da Graciosa', type: 'trail', island: 'GRW', image: 'https://picsum.photos/400/300?random=151', description: 'Caminhada circular em redor da caldeira da ilha branca.', distance: '10km', duration: '3h', difficulty: 'Fácil' },
      { id: 'A6_3', title: 'Baía da Folga', type: 'trail', island: 'GRW', image: 'https://picsum.photos/400/300?random=152', description: 'Trilho costeiro com vistas para o mar e falésias.', distance: '4km', duration: '1h 30m', difficulty: 'Fácil' },
      { id: 'A6_4', title: 'Serra Branca', type: 'trail', island: 'GRW', image: 'https://picsum.photos/400/300?random=153', description: 'Caminhada pelo ponto mais alto da Graciosa.', distance: '8km', duration: '2h 30m', difficulty: 'Fácil' },
      { id: 'A6_5', title: 'Porto Afonso', type: 'trail', island: 'GRW', image: 'https://picsum.photos/400/300?random=154', description: 'Trilho que leva às antigas grutas de pescadores.', distance: '6km', duration: '2h', difficulty: 'Fácil' },

      // FLORES (FLW)
      { id: 'A8', title: 'Lagoas das Flores', type: 'trail', island: 'FLW', image: 'https://picsum.photos/400/300?random=155', description: 'Trilho que liga as sete lagoas da ilha das Flores.', distance: '7km', duration: '3h', difficulty: 'Moderado' },
      { id: 'A8_2', title: 'Fajã Grande a Ponta Delgada', type: 'trail', island: 'FLW', image: 'https://picsum.photos/400/300?random=156', description: 'Um dos trilhos mais bonitos e remotos dos Açores.', distance: '13km', duration: '5h', difficulty: 'Difícil' },
      { id: 'A8_3', title: 'Poço do Bacalhau', type: 'trail', island: 'FLW', image: 'https://picsum.photos/400/300?random=157', description: 'Caminhada curta até à impressionante cascata da Fajã Grande.', distance: '1km', duration: '30m', difficulty: 'Fácil' },
      { id: 'A8_4', title: 'Rocha dos Bordões', type: 'trail', island: 'FLW', image: 'https://picsum.photos/400/300?random=158', description: 'Trilho geológico junto à famosa formação de prismas basálticos.', distance: '4km', duration: '1h 30m', difficulty: 'Fácil' },
      { id: 'A8_5', title: 'Lajes das Flores', type: 'trail', island: 'FLW', image: 'https://picsum.photos/400/300?random=159', description: 'Trilho histórico pela costa sul da ilha.', distance: '8km', duration: '3h', difficulty: 'Moderado' },

      // CORVO (CVU)
      { id: 'A5', title: 'Caldeirão do Corvo', type: 'landscape', island: 'CVU', image: 'https://picsum.photos/400/300?random=34', description: 'A impressionante cratera vulcânica no coração do Corvo.' },
      { id: 'A5_2', title: 'Cara do Índio', type: 'trail', island: 'CVU', image: 'https://picsum.photos/400/300?random=160', description: 'Caminhada pela crista da caldeira com vistas incríveis.', distance: '10km', duration: '3h 30m', difficulty: 'Moderado' },
      { id: 'A5_3', title: 'Trilho da Vila', type: 'trail', island: 'CVU', image: 'https://picsum.photos/400/300?random=161', description: 'Caminhada pela única povoação da ilha mais pequena.', distance: '5km', duration: '1h 30m', difficulty: 'Fácil' },
      { id: 'A5_4', title: 'Farol do Canto', type: 'trail', island: 'CVU', image: 'https://picsum.photos/400/300?random=162', description: 'Trilho até ao farol isolado no norte da ilha.', distance: '8km', duration: '3h', difficulty: 'Moderado' },

      // SANTA MARIA (SMA)
      { id: 'A9', title: 'Pico Alto', type: 'trail', island: 'SMA', image: 'https://picsum.photos/400/300?random=163', description: 'Subida ao ponto mais alto da ilha amarela.', distance: '6km', duration: '2h 30m', difficulty: 'Moderado' },
      { id: 'A9_2', title: 'Barreiro da Faneca', type: 'trail', island: 'SMA', image: 'https://picsum.photos/400/300?random=164', description: 'Caminhada pelo deserto vermelho de Santa Maria.', distance: '9km', duration: '3h', difficulty: 'Fácil' },
      { id: 'A9_3', title: 'Baía dos Anjos', type: 'trail', island: 'SMA', image: 'https://picsum.photos/400/300?random=165', description: 'Trilho costeiro histórico onde Colombo desembarcou.', distance: '5km', duration: '1h 30m', difficulty: 'Fácil' },
      { id: 'A9_4', title: 'Cascata do Aveiro', type: 'trail', island: 'SMA', image: 'https://picsum.photos/400/300?random=166', description: 'Trilho até uma das maiores cascatas de Portugal.', distance: '2km', duration: '1h', difficulty: 'Fácil' },
      { id: 'A9_5', title: 'Praia Formosa', type: 'trail', island: 'SMA', image: 'https://picsum.photos/400/300?random=167', description: 'Trilho costeiro que liga a vila à praia de areia clara.', distance: '7km', duration: '2h 30m', difficulty: 'Fácil' },

      { id: 'A3', title: 'Plantações de Chá', type: 'culture', island: 'PDL', image: 'https://picsum.photos/400/300?random=32', description: 'Visite as únicas plantações de chá da Europa na Gorreana.' },
    ]
  },
  en: {
    airports: [
      { code: 'PDL', name: 'João Paulo II Airport', location: 'São Miguel', isAzores: true },
      { code: 'TER', name: 'Lajes Airport', location: 'Terceira', isAzores: true },
      { code: 'HOR', name: 'Horta Airport', location: 'Faial', isAzores: true },
      { code: 'PIX', name: 'Pico Airport', location: 'Pico', isAzores: true },
      { code: 'SJZ', name: 'São Jorge Airport', location: 'São Jorge', isAzores: true },
      { code: 'GRW', name: 'Graciosa Airport', location: 'Graciosa', isAzores: true },
      { code: 'FLW', name: 'Flores Airport', location: 'Flores', isAzores: true },
      { code: 'CVU', name: 'Corvo Airport', location: 'Corvo', isAzores: true },
      { code: 'SMA', name: 'Santa Maria Airport', location: 'Santa Maria', isAzores: true },
      { code: 'LIS', name: 'Humberto Delgado', location: 'Lisbon, Portugal', isAzores: false },
      { code: 'OPO', name: 'Francisco Sá Carneiro', location: 'Porto, Portugal', isAzores: false },
      { code: 'BOS', name: 'Logan International', location: 'Boston, USA', isAzores: false },
      { code: 'YYZ', name: 'Pearson International', location: 'Toronto, Canada', isAzores: false },
      { code: 'LHR', name: 'Heathrow', location: 'London, UK', isAzores: false },
      { code: 'JFK', name: 'John F. Kennedy', location: 'New York, USA', isAzores: false },
      { code: 'FRA', name: 'Frankfurt Airport', location: 'Frankfurt, Germany', isAzores: false },
    ],
    hotels: [
      { id: 'H1', name: 'Azores Royal Garden', island: 'PDL', stars: 4, pricePerNight: 120, image: 'https://picsum.photos/400/300?random=1', description: 'Luxury hotel with Japanese garden and spa.' },
      { id: 'H2', name: 'Terra Nostra Garden', island: 'PDL', stars: 5, pricePerNight: 200, image: 'https://picsum.photos/400/300?random=2', description: 'Located in Furnas with thermal pools.' },
      { id: 'H3', name: 'Terceira Mar Hotel', island: 'TER', stars: 4, pricePerNight: 110, image: 'https://picsum.photos/400/300?random=3', description: 'Ocean view rooms and saltwater pool.' },
      { id: 'H4', name: 'Faial Resort Hotel', island: 'HOR', stars: 4, pricePerNight: 130, image: 'https://picsum.photos/400/300?random=4', description: 'With privileged view to Pico mountain.' },
      { id: 'H5', name: 'Hotel São Jorge Garden', island: 'SJZ', stars: 3, pricePerNight: 90, image: 'https://picsum.photos/400/300?random=50', description: 'Situated on the cliffs overlooking Pico.' },
      { id: 'H6', name: 'Graciosa Resort', island: 'GRW', stars: 4, pricePerNight: 105, image: 'https://picsum.photos/400/300?random=51', description: 'Modern resort on a quiet island.' },
      { id: 'H7', name: 'Guest House Comodoro', island: 'CVU', stars: 3, pricePerNight: 75, image: 'https://picsum.photos/400/300?random=52', description: 'Cozy accommodation on the smallest island.' },
    ],
    restaurants: [
      {
        id: 'R1', name: 'A Tasca', island: 'PDL', cuisine: 'Regional', rating: 4.8, reviews: 2450, image: 'https://picsum.photos/400/300?random=20',
        description: 'Traditional Azorean cuisine in a rustic and lively atmosphere. Famous for tuna steak.',
        adminEmail: 'atasca@azores4you.com',
        adminPassword: 'tasca',
        dishes: [
          { name: 'Tuna Steak', description: 'Fresh tuna steak with sesame seeds.', price: 18, image: 'https://picsum.photos/300/200?random=21' },
          { name: 'Polvo à Lagareiro', description: 'Roasted octopus with punched potatoes.', price: 22, image: 'https://picsum.photos/300/200?random=22' },
          { name: 'Caramelized Pineapple', description: 'Local caramelized pineapple.', price: 6, image: 'https://picsum.photos/300/200?random=23' }
        ]
      },
      {
        id: 'R2', name: 'O Pescador', island: 'TER', cuisine: 'Seafood', rating: 4.6, reviews: 890, image: 'https://picsum.photos/400/300?random=24',
        description: 'The best fresh fish in Terceira, located by the harbor.',
        dishes: [
          { name: 'Grilled Limpets', description: 'Grilled limpets with garlic butter.', price: 12, image: 'https://picsum.photos/300/200?random=25' },
          { name: 'Alcatra', description: 'Meat dish slow-cooked in a clay pot.', price: 19, image: 'https://picsum.photos/300/200?random=26' }
        ]
      },
      {
        id: 'R3', name: 'Peter Café Sport', island: 'HOR', cuisine: 'Bar/Pub', rating: 4.9, reviews: 5000, image: 'https://picsum.photos/400/300?random=27',
        description: 'World famous sailors bar. Known for Gin Tonic and chocolate cake.',
        dishes: [
          { name: 'Sea Gin', description: 'Signature Gin Tonic.', price: 8, image: 'https://picsum.photos/300/200?random=28' },
          { name: 'Peter\'s Chocolate Cake', description: 'Dense and rich chocolate cake.', price: 5, image: 'https://picsum.photos/300/200?random=29' }
        ]
      },
      {
        id: 'R4', name: 'Restaurante Velas', island: 'SJZ', cuisine: 'Regional', rating: 4.5, reviews: 320, image: 'https://picsum.photos/400/300?random=60',
        description: 'Specialists in Caldeira Clams and São Jorge Cheese.',
        dishes: [
          { name: 'Clams', description: 'Fresh clams from Caldeira de Santo Cristo.', price: 25, image: 'https://picsum.photos/300/200?random=61' },
          { name: 'Cheese Board', description: 'Selection of cured São Jorge cheeses.', price: 15, image: 'https://picsum.photos/300/200?random=62' }
        ]
      }
    ],
    activities: [
      // SÃO MIGUEL (PDL)
      { id: 'A1', title: 'Sete Cidades Trail', type: 'trail', island: 'PDL', image: 'https://picsum.photos/400/300?random=30', description: 'Walk around the crater of the blue and green lakes.', distance: '12km', duration: '4h', difficulty: 'Moderado' },
      { id: 'A1_2', title: 'Lagoa do Fogo', type: 'trail', island: 'PDL', image: 'https://picsum.photos/400/300?random=130', description: 'Trail that descends to the beach of the wildest lagoon on the island.', distance: '11km', duration: '4h 30m', difficulty: 'Difícil' },
      { id: 'A1_3', title: 'Salto do Cabrito', type: 'trail', island: 'PDL', image: 'https://picsum.photos/400/300?random=131', description: 'Circular walk passing by a waterfall and old hydroelectric plant.', distance: '8.5km', duration: '3h', difficulty: 'Fácil' },
      { id: 'A1_4', title: 'Hell\'s Window', type: 'trail', island: 'PDL', image: 'https://picsum.photos/400/300?random=132', description: 'Mystical trail passing through old tunnels and aqueducts.', distance: '7.6km', duration: '2h 30m', difficulty: 'Fácil' },
      { id: 'A1_5', title: 'Pico da Vara', type: 'trail', island: 'PDL', image: 'https://picsum.photos/400/300?random=133', description: 'Climb to the highest point of São Miguel island.', distance: '7km', duration: '3h', difficulty: 'Difícil' },
      
      // TERCEIRA (TER)
      { id: 'A2', title: 'Algar do Carvão', type: 'landscape', island: 'TER', image: 'https://picsum.photos/400/300?random=31', description: 'Descend into an ancient volcanic chimney.' },
      { id: 'A2_2', title: 'Black Mysteries', type: 'trail', island: 'TER', image: 'https://picsum.photos/400/300?random=134', description: 'Challenging trail between volcanic domes and dense vegetation.', distance: '5km', duration: '2h 30m', difficulty: 'Difícil' },
      { id: 'A2_3', title: 'Rocha do Chambre', type: 'trail', island: 'TER', image: 'https://picsum.photos/400/300?random=135', description: 'Spectacular views over the caldera and the island interior.', distance: '8.8km', duration: '3h 30m', difficulty: 'Moderado' },
      { id: 'A2_4', title: 'Monte Brasil', type: 'trail', island: 'TER', image: 'https://picsum.photos/400/300?random=136', description: 'Historical walk with views over Angra do Heroísmo.', distance: '7.5km', duration: '2h 30m', difficulty: 'Fácil' },
      { id: 'A2_5', title: 'Agualva Bay', type: 'trail', island: 'TER', image: 'https://picsum.photos/400/300?random=137', description: 'Coastal trail with impressive geological formations.', distance: '3.8km', duration: '1h 30m', difficulty: 'Fácil' },

      // FAIAL (HOR)
      { id: 'A4_2', title: 'Faial Caldera', type: 'trail', island: 'HOR', image: 'https://picsum.photos/400/300?random=138', description: 'Circular walk around the massive central caldera.', distance: '7km', duration: '2h 30m', difficulty: 'Fácil' },
      { id: 'A4_3', title: 'Capelinhos Trail', type: 'trail', island: 'HOR', image: 'https://picsum.photos/400/300?random=139', description: 'Walk over the ashes of the last volcano in the Azores.', distance: '3.2km', duration: '1h 30m', difficulty: 'Fácil' },
      { id: 'A4_4', title: 'Faial Levada', type: 'trail', island: 'HOR', image: 'https://picsum.photos/400/300?random=140', description: 'One of the longest levada trails in the archipelago.', distance: '24km', duration: '7h', difficulty: 'Moderado' },
      { id: 'A4_5', title: 'Morro de Castelo Branco', type: 'trail', island: 'HOR', image: 'https://picsum.photos/400/300?random=141', description: 'Coastal trail to the iconic white rock formation.', distance: '4km', duration: '1h 30m', difficulty: 'Fácil' },

      // PICO (PIX)
      { id: 'A7', title: 'Pico Mountain Climb', type: 'trail', island: 'PIX', image: 'https://picsum.photos/400/300?random=142', description: 'The ultimate challenge: climbing the highest point in Portugal.', distance: '8km', duration: '7h', difficulty: 'Difícil' },
      { id: 'A7_2', title: 'Lagoons Path', type: 'trail', island: 'PIX', image: 'https://picsum.photos/400/300?random=143', description: 'Trail through the central plateau passing several lagoons.', distance: '22km', duration: '6h 30m', difficulty: 'Moderado' },
      { id: 'A7_3', title: 'Criação Velha', type: 'trail', island: 'PIX', image: 'https://picsum.photos/400/300?random=144', description: 'Walk through the UNESCO World Heritage vineyards.', distance: '6.9km', duration: '2h', difficulty: 'Fácil' },
      { id: 'A7_4', title: 'Ponta da Ilha', type: 'trail', island: 'PIX', image: 'https://picsum.photos/400/300?random=145', description: 'Coastal trail at the eastern tip of Pico island.', distance: '10km', duration: '3h', difficulty: 'Fácil' },
      { id: 'A7_5', title: 'Calheta de Nesquim', type: 'trail', island: 'PIX', image: 'https://picsum.photos/400/300?random=146', description: 'Historical trail linked to the whaling tradition.', distance: '12km', duration: '4h', difficulty: 'Moderado' },

      // SÃO JORGE (SJZ)
      { id: 'A4', title: 'Fajãs of São Jorge', type: 'landscape', island: 'SJZ', image: 'https://picsum.photos/400/300?random=33', description: 'Explore the iconic coastal plains formed by lava.' },
      { id: 'A4_6', title: 'Fajã dos Cubres', type: 'trail', island: 'SJZ', image: 'https://picsum.photos/400/300?random=147', description: 'Descent from Serra do Topo to Fajã de Santo Cristo.', distance: '10km', duration: '3h 30m', difficulty: 'Moderado' },
      { id: 'A4_7', title: 'Pico da Esperança', type: 'trail', island: 'SJZ', image: 'https://picsum.photos/400/300?random=148', description: 'Walk along the island ridge with views of neighboring islands.', distance: '17km', duration: '5h', difficulty: 'Moderado' },
      { id: 'A4_8', title: 'Serra do Topo', type: 'trail', island: 'SJZ', image: 'https://picsum.photos/400/300?random=149', description: 'Mountain trail with stunning views over the fajãs.', distance: '5km', duration: '2h', difficulty: 'Fácil' },
      { id: 'A4_9', title: 'Fajã de São João', type: 'trail', island: 'SJZ', image: 'https://picsum.photos/400/300?random=150', description: 'Traditional trail connecting several isolated fajãs.', distance: '10km', duration: '3h 30m', difficulty: 'Moderado' },

      // GRACIOSA (GRW)
      { id: 'A6', title: 'Sulphur Cavern', type: 'poi', island: 'GRW', image: 'https://picsum.photos/400/300?random=35', description: 'A unique volcanic cave with an underground lake.' },
      { id: 'A6_2', title: 'Graciosa Caldera', type: 'trail', island: 'GRW', image: 'https://picsum.photos/400/300?random=151', description: 'Circular walk around the caldera of the white island.', distance: '10km', duration: '3h', difficulty: 'Fácil' },
      { id: 'A6_3', title: 'Folga Bay', type: 'trail', island: 'GRW', image: 'https://picsum.photos/400/300?random=152', description: 'Coastal trail with views of the sea and cliffs.', distance: '4km', duration: '1h 30m', difficulty: 'Fácil' },
      { id: 'A6_4', title: 'Serra Branca', type: 'trail', island: 'GRW', image: 'https://picsum.photos/400/300?random=153', description: 'Walk through the highest point of Graciosa.', distance: '8km', duration: '2h 30m', difficulty: 'Fácil' },
      { id: 'A6_5', title: 'Porto Afonso', type: 'trail', island: 'GRW', image: 'https://picsum.photos/400/300?random=154', description: 'Trail leading to the old fishermen\'s caves.', distance: '6km', duration: '2h', difficulty: 'Fácil' },

      // FLORES (FLW)
      { id: 'A8', title: 'Flores Lagoons', type: 'trail', island: 'FLW', image: 'https://picsum.photos/400/300?random=155', description: 'Trail connecting the seven lagoons of Flores island.', distance: '7km', duration: '3h', difficulty: 'Moderado' },
      { id: 'A8_2', title: 'Fajã Grande to Ponta Delgada', type: 'trail', island: 'FLW', image: 'https://picsum.photos/400/300?random=156', description: 'One of the most beautiful and remote trails in the Azores.', distance: '13km', duration: '5h', difficulty: 'Difícil' },
      { id: 'A8_3', title: 'Poço do Bacalhau', type: 'trail', island: 'FLW', image: 'https://picsum.photos/400/300?random=157', description: 'Short walk to the impressive Fajã Grande waterfall.', distance: '1km', duration: '30m', difficulty: 'Fácil' },
      { id: 'A8_4', title: 'Rocha dos Bordões', type: 'trail', island: 'FLW', image: 'https://picsum.photos/400/300?random=158', description: 'Geological trail next to the famous basalt prism formation.', distance: '4km', duration: '1h 30m', difficulty: 'Fácil' },
      { id: 'A8_5', title: 'Lajes das Flores', type: 'trail', island: 'FLW', image: 'https://picsum.photos/400/300?random=159', description: 'Historical trail through the south coast of the island.', distance: '8km', duration: '3h', difficulty: 'Moderado' },

      // CORVO (CVU)
      { id: 'A5', title: 'Corvo Caldera', type: 'landscape', island: 'CVU', image: 'https://picsum.photos/400/300?random=34', description: 'The impressive volcanic crater in the heart of Corvo.' },
      { id: 'A5_2', title: 'Indian Face', type: 'trail', island: 'CVU', image: 'https://picsum.photos/400/300?random=160', description: 'Walk along the caldera ridge with incredible views.', distance: '10km', duration: '3h 30m', difficulty: 'Moderado' },
      { id: 'A5_3', title: 'Village Trail', type: 'trail', island: 'CVU', image: 'https://picsum.photos/400/300?random=161', description: 'Walk through the only settlement on the smallest island.', distance: '5km', duration: '1h 30m', difficulty: 'Fácil' },
      { id: 'A5_4', title: 'Canto Lighthouse', type: 'trail', island: 'CVU', image: 'https://picsum.photos/400/300?random=162', description: 'Trail to the isolated lighthouse in the north of the island.', distance: '8km', duration: '3h', difficulty: 'Moderado' },

      // SANTA MARIA (SMA)
      { id: 'A9', title: 'Pico Alto', type: 'trail', island: 'SMA', image: 'https://picsum.photos/400/300?random=163', description: 'Climb to the highest point of the yellow island.', distance: '6km', duration: '2h 30m', difficulty: 'Moderado' },
      { id: 'A9_2', title: 'Barreiro da Faneca', type: 'trail', island: 'SMA', image: 'https://picsum.photos/400/300?random=164', description: 'Walk through the red desert of Santa Maria.', distance: '9km', duration: '3h', difficulty: 'Fácil' },
      { id: 'A9_3', title: 'Anjos Bay', type: 'trail', island: 'SMA', image: 'https://picsum.photos/400/300?random=165', description: 'Historical coastal trail where Columbus landed.', distance: '5km', duration: '1h 30m', difficulty: 'Fácil' },
      { id: 'A9_4', title: 'Aveiro Waterfall', type: 'trail', island: 'SMA', image: 'https://picsum.photos/400/300?random=166', description: 'Trail to one of the largest waterfalls in Portugal.', distance: '2km', duration: '1h', difficulty: 'Fácil' },
      { id: 'A9_5', title: 'Praia Formosa', type: 'trail', island: 'SMA', image: 'https://picsum.photos/400/300?random=167', description: 'Coastal trail connecting the village to the light sand beach.', distance: '7km', duration: '2h 30m', difficulty: 'Fácil' },

      { id: 'A3', title: 'Tea Plantations', type: 'culture', island: 'PDL', image: 'https://picsum.photos/400/300?random=32', description: 'Visit the only tea plantations in Europe at Gorreana.' },
    ]
  },
  es: {
    airports: [
      { code: 'PDL', name: 'Aeropuerto João Paulo II', location: 'São Miguel', isAzores: true },
      { code: 'TER', name: 'Aeropuerto das Lajes', location: 'Terceira', isAzores: true },
      { code: 'HOR', name: 'Aeropuerto da Horta', location: 'Faial', isAzores: true },
      { code: 'PIX', name: 'Aeropuerto do Pico', location: 'Pico', isAzores: true },
      { code: 'SJZ', name: 'Aeródromo de São Jorge', location: 'São Jorge', isAzores: true },
      { code: 'GRW', name: 'Aeródromo de Graciosa', location: 'Graciosa', isAzores: true },
      { code: 'FLW', name: 'Aeropuerto das Flores', location: 'Flores', isAzores: true },
      { code: 'CVU', name: 'Aeródromo de Corvo', location: 'Corvo', isAzores: true },
      { code: 'SMA', name: 'Aeropuerto de Santa Maria', location: 'Santa Maria', isAzores: true },
      { code: 'LIS', name: 'Humberto Delgado', location: 'Lisboa, Portugal', isAzores: false },
      { code: 'OPO', name: 'Francisco Sá Carneiro', location: 'Oporto, Portugal', isAzores: false },
      { code: 'BOS', name: 'Logan International', location: 'Boston, EE. UU.', isAzores: false },
      { code: 'YYZ', name: 'Pearson International', location: 'Toronto, Canadá', isAzores: false },
      { code: 'LHR', name: 'Heathrow', location: 'Londres, Reino Unido', isAzores: false },
      { code: 'JFK', name: 'John F. Kennedy', location: 'Nueva York, EE. UU.', isAzores: false },
      { code: 'FRA', name: 'Aeropuerto de Frankfurt', location: 'Frankfurt, Alemania', isAzores: false },
    ],
    hotels: [
      { id: 'H1', name: 'Azores Royal Garden', island: 'PDL', stars: 4, pricePerNight: 120, image: 'https://picsum.photos/400/300?random=1', description: 'Hotel de lujo con jardín japonés y spa.' },
      { id: 'H2', name: 'Terra Nostra Garden', island: 'PDL', stars: 5, pricePerNight: 200, image: 'https://picsum.photos/400/300?random=2', description: 'Ubicado en Furnas con piscinas termales.' },
      { id: 'H3', name: 'Terceira Mar Hotel', island: 'TER', stars: 4, pricePerNight: 110, image: 'https://picsum.photos/400/300?random=3', description: 'Habitaciones con vista al mar y piscina de agua salada.' },
      { id: 'H4', name: 'Faial Resort Hotel', island: 'HOR', stars: 4, pricePerNight: 130, image: 'https://picsum.photos/400/300?random=4', description: 'Con vista privilegiada a la montaña del Pico.' },
      { id: 'H5', name: 'Hotel São Jorge Garden', island: 'SJZ', stars: 3, pricePerNight: 90, image: 'https://picsum.photos/400/300?random=50', description: 'Situado sobre los acantilados con vistas al Pico.' },
      { id: 'H6', name: 'Graciosa Resort', island: 'GRW', stars: 4, pricePerNight: 105, image: 'https://picsum.photos/400/300?random=51', description: 'Resort moderno en una isla tranquila.' },
      { id: 'H7', name: 'Guest House Comodoro', island: 'CVU', stars: 3, pricePerNight: 75, image: 'https://picsum.photos/400/300?random=52', description: 'Alojamiento acogedor en la isla más pequeña.' },
    ],
    restaurants: [
      {
        id: 'R1', name: 'A Tasca', island: 'PDL', cuisine: 'Regional', rating: 4.8, reviews: 2450, image: 'https://picsum.photos/400/300?random=20',
        description: 'Cocina tradicional azoriana en un ambiente rústico e animado. Famoso por el filete de atún.',
        dishes: [
          { name: 'Filete de Atún', description: 'Filete de atún fresco con semillas de sésamo.', price: 18, image: 'https://picsum.photos/300/200?random=21' },
          { name: 'Polvo à Lagareiro', description: 'Pulpo asado con patatas golpeadas.', price: 22, image: 'https://picsum.photos/300/200?random=22' },
          { name: 'Piña Caramelizada', description: 'Piña local caramelizada.', price: 6, image: 'https://picsum.photos/300/200?random=23' }
        ]
      },
      {
        id: 'R2', name: 'O Pescador', island: 'TER', cuisine: 'Marisco', rating: 4.6, reviews: 890, image: 'https://picsum.photos/400/300?random=24',
        description: 'El mejor pescado fresco en Terceira, ubicado junto al puerto.',
        dishes: [
          { name: 'Lapas a la Plancha', description: 'Lapas a la plancha con mantequilla de ajo.', price: 12, image: 'https://picsum.photos/300/200?random=25' },
          { name: 'Alcatra', description: 'Plato de carne cocinado lentamente en olla de barro.', price: 19, image: 'https://picsum.photos/300/200?random=26' }
        ]
      },
      {
        id: 'R3', name: 'Peter Café Sport', island: 'HOR', cuisine: 'Bar/Pub', rating: 4.9, reviews: 5000, image: 'https://picsum.photos/400/300?random=27',
        description: 'Bar de marineros mundialmente famoso. Conocido por el Gin Tonic y pastel de chocolate.',
        dishes: [
          { name: 'Gin del Mar', description: 'Gin Tonic de autor.', price: 8, image: 'https://picsum.photos/300/200?random=28' },
          { name: 'Pastel de Chocolate de Peter', description: 'Pastel de chocolate denso y rico.', price: 5, image: 'https://picsum.photos/300/200?random=29' }
        ]
      },
      {
        id: 'R4', name: 'Restaurante Velas', island: 'SJZ', cuisine: 'Regional', rating: 4.5, reviews: 320, image: 'https://picsum.photos/400/300?random=60',
        description: 'Especialistas en Almejas de Caldeira y Queso de São Jorge.',
        dishes: [
          { name: 'Almejas', description: 'Almejas frescas de Caldeira de Santo Cristo.', price: 25, image: 'https://picsum.photos/300/200?random=61' },
          { name: 'Tabla de Quesos', description: 'Selección de quesos curados de São Jorge.', price: 15, image: 'https://picsum.photos/300/200?random=62' }
        ]
      }
    ],
    activities: [
      // SÃO MIGUEL (PDL)
      { id: 'A1', title: 'Sendero Sete Cidades', type: 'trail', island: 'PDL', image: 'https://picsum.photos/400/300?random=30', description: 'Camine alrededor del cráter de los lagos azul y verde.', distance: '12km', duration: '4h', difficulty: 'Moderado' },
      { id: 'A1_2', title: 'Lagoa do Fogo', type: 'trail', island: 'PDL', image: 'https://picsum.photos/400/300?random=130', description: 'Sendero que desciende a la playa de la laguna más salvaje de la isla.', distance: '11km', duration: '4h 30m', difficulty: 'Difícil' },
      { id: 'A1_3', title: 'Salto do Cabrito', type: 'trail', island: 'PDL', image: 'https://picsum.photos/400/300?random=131', description: 'Caminata circular que pasa por una cascada y una antigua central hidroeléctrica.', distance: '8.5km', duration: '3h', difficulty: 'Fácil' },
      { id: 'A1_4', title: 'Ventana del Infierno', type: 'trail', island: 'PDL', image: 'https://picsum.photos/400/300?random=132', description: 'Sendero místico que pasa por antiguos túneles y acueductos.', distance: '7.6km', duration: '2h 30m', difficulty: 'Fácil' },
      { id: 'A1_5', title: 'Pico da Vara', type: 'trail', island: 'PDL', image: 'https://picsum.photos/400/300?random=133', description: 'Ascenso al punto más alto de la isla de São Miguel.', distance: '7km', duration: '3h', difficulty: 'Difícil' },
      
      // TERCEIRA (TER)
      { id: 'A2', title: 'Algar do Carvão', type: 'landscape', island: 'TER', image: 'https://picsum.photos/400/300?random=31', description: 'Descienda al interior de una antigua chimenea volcánica.' },
      { id: 'A2_2', title: 'Misterios Negros', type: 'trail', island: 'TER', image: 'https://picsum.photos/400/300?random=134', description: 'Sendero desafiante entre domos volcánicos y vegetación densa.', distance: '5km', duration: '2h 30m', difficulty: 'Difícil' },
      { id: 'A2_3', title: 'Rocha do Chambre', type: 'trail', island: 'TER', image: 'https://picsum.photos/400/300?random=135', description: 'Vistas espectaculares sobre la caldera y el interior de la isla.', distance: '8.8km', duration: '3h 30m', difficulty: 'Moderado' },
      { id: 'A2_4', title: 'Monte Brasil', type: 'trail', island: 'TER', image: 'https://picsum.photos/400/300?random=136', description: 'Caminata histórica con vistas sobre Angra do Heroísmo.', distance: '7.5km', duration: '2h 30m', difficulty: 'Fácil' },
      { id: 'A2_5', title: 'Bahía de Agualva', type: 'trail', island: 'TER', image: 'https://picsum.photos/400/300?random=137', description: 'Sendero costero con impresionantes formaciones geológicas.', distance: '3.8km', duration: '1h 30m', difficulty: 'Fácil' },

      // FAIAL (HOR)
      { id: 'A4_2', title: 'Caldera de Faial', type: 'trail', island: 'HOR', image: 'https://picsum.photos/400/300?random=138', description: 'Caminata circular alrededor de la enorme caldera central.', distance: '7km', duration: '2h 30m', difficulty: 'Fácil' },
      { id: 'A4_3', title: 'Sendero de Capelinhos', type: 'trail', island: 'HOR', image: 'https://picsum.photos/400/300?random=139', description: 'Caminata sobre las cenizas del último volcán de las Azores.', distance: '3.2km', duration: '1h 30m', difficulty: 'Fácil' },
      { id: 'A4_4', title: 'Levada de Faial', type: 'trail', island: 'HOR', image: 'https://picsum.photos/400/300?random=140', description: 'Uno de los senderos de levada más largos del archipiélago.', distance: '24km', duration: '7h', difficulty: 'Moderado' },
      { id: 'A4_5', title: 'Morro de Castelo Branco', type: 'trail', island: 'HOR', image: 'https://picsum.photos/400/300?random=141', description: 'Sendero costero hasta la icónica formación de roca blanca.', distance: '4km', duration: '1h 30m', difficulty: 'Fácil' },

      // PICO (PIX)
      { id: 'A7', title: 'Ascenso a la Montaña del Pico', type: 'trail', island: 'PIX', image: 'https://picsum.photos/400/300?random=142', description: 'El desafío definitivo: subir al punto más alto de Portugal.', distance: '8km', duration: '7h', difficulty: 'Difícil' },
      { id: 'A7_2', title: 'Camino de las Lagunas', type: 'trail', island: 'PIX', image: 'https://picsum.photos/400/300?random=143', description: 'Sendero por la meseta central pasando por varias lagunas.', distance: '22km', duration: '6h 30m', difficulty: 'Moderado' },
      { id: 'A7_3', title: 'Criação Velha', type: 'trail', island: 'PIX', image: 'https://picsum.photos/400/300?random=144', description: 'Caminata por los viñedos Patrimonio de la Humanidad de la UNESCO.', distance: '6.9km', duration: '2h', difficulty: 'Fácil' },
      { id: 'A7_4', title: 'Ponta da Ilha', type: 'trail', island: 'PIX', image: 'https://picsum.photos/400/300?random=145', description: 'Sendero costero en el extremo este de la isla del Pico.', distance: '10km', duration: '3h', difficulty: 'Fácil' },
      { id: 'A7_5', title: 'Calheta de Nesquim', type: 'trail', island: 'PIX', image: 'https://picsum.photos/400/300?random=146', description: 'Sendero histórico vinculado a la tradición ballenera.', distance: '12km', duration: '4h', difficulty: 'Moderado' },

      // SÃO JORGE (SJZ)
      { id: 'A4', title: 'Fajãs de São Jorge', type: 'landscape', island: 'SJZ', image: 'https://picsum.photos/400/300?random=33', description: 'Explora las icónicas llanuras costeras formadas por lava.' },
      { id: 'A4_6', title: 'Fajã dos Cubres', type: 'trail', island: 'SJZ', image: 'https://picsum.photos/400/300?random=147', description: 'Descenso desde Serra do Topo hasta Fajã de Santo Cristo.', distance: '10km', duration: '3h 30m', difficulty: 'Moderado' },
      { id: 'A4_7', title: 'Pico da Esperança', type: 'trail', island: 'SJZ', image: 'https://picsum.photos/400/300?random=148', description: 'Caminata por la cresta de la isla con vistas a las islas vecinas.', distance: '17km', duration: '5h', difficulty: 'Moderado' },
      { id: 'A4_8', title: 'Serra do Topo', type: 'trail', island: 'SJZ', image: 'https://picsum.photos/400/300?random=149', description: 'Sendero de montaña con impresionantes vistas sobre las fajãs.', distance: '5km', duration: '2h', difficulty: 'Fácil' },
      { id: 'A4_9', title: 'Fajã de São João', type: 'trail', island: 'SJZ', image: 'https://picsum.photos/400/300?random=150', description: 'Sendero tradicional que conecta varias fajãs aisladas.', distance: '10km', duration: '3h 30m', difficulty: 'Moderado' },

      // GRACIOSA (GRW)
      { id: 'A6', title: 'Furna do Enxofre', type: 'poi', island: 'GRW', image: 'https://picsum.photos/400/300?random=35', description: 'Una cueva volcánica única con un lago subterráneo.' },
      { id: 'A6_2', title: 'Caldera de Graciosa', type: 'trail', island: 'GRW', image: 'https://picsum.photos/400/300?random=151', description: 'Caminata circular alrededor de la caldera de la isla blanca.', distance: '10km', duration: '3h', difficulty: 'Fácil' },
      { id: 'A6_3', title: 'Bahía de Folga', type: 'trail', island: 'GRW', image: 'https://picsum.photos/400/300?random=152', description: 'Sendero costero con vistas al mar y acantilados.', distance: '4km', duration: '1h 30m', difficulty: 'Fácil' },
      { id: 'A6_4', title: 'Serra Branca', type: 'trail', island: 'GRW', image: 'https://picsum.photos/400/300?random=153', description: 'Caminata por el punto más alto de Graciosa.', distance: '8km', duration: '2h 30m', difficulty: 'Fácil' },
      { id: 'A6_5', title: 'Porto Afonso', type: 'trail', island: 'GRW', image: 'https://picsum.photos/400/300?random=154', description: 'Sendero que lleva a las antiguas cuevas de pescadores.', distance: '6km', duration: '2h', difficulty: 'Fácil' },

      // FLORES (FLW)
      { id: 'A8', title: 'Lagunas de Flores', type: 'trail', island: 'FLW', image: 'https://picsum.photos/400/300?random=155', description: 'Sendero que conecta las siete lagunas de la isla de Flores.', distance: '7km', duration: '3h', difficulty: 'Moderado' },
      { id: 'A8_2', title: 'Fajã Grande a Ponta Delgada', type: 'trail', island: 'FLW', image: 'https://picsum.photos/400/300?random=156', description: 'Uno de los senderos más bellos y remotos de las Azores.', distance: '13km', duration: '5h', difficulty: 'Difícil' },
      { id: 'A8_3', title: 'Poço do Bacalhau', type: 'trail', island: 'FLW', image: 'https://picsum.photos/400/300?random=157', description: 'Caminata corta hasta la impresionante cascada de Fajã Grande.', distance: '1km', duration: '30m', difficulty: 'Fácil' },
      { id: 'A8_4', title: 'Rocha dos Bordões', type: 'trail', island: 'FLW', image: 'https://picsum.photos/400/300?random=158', description: 'Sendero geológico junto a la famosa formación de prismas basálticos.', distance: '4km', duration: '1h 30m', difficulty: 'Fácil' },
      { id: 'A8_5', title: 'Lajes das Flores', type: 'trail', island: 'FLW', image: 'https://picsum.photos/400/300?random=159', description: 'Sendero histórico por la costa sur de la isla.', distance: '8km', duration: '3h', difficulty: 'Moderado' },

      // CORVO (CVU)
      { id: 'A5', title: 'Caldeirão do Corvo', type: 'landscape', island: 'CVU', image: 'https://picsum.photos/400/300?random=34', description: 'El impresionante cráter volcánico en el corazón de Corvo.' },
      { id: 'A5_2', title: 'Cara del Indio', type: 'trail', island: 'CVU', image: 'https://picsum.photos/400/300?random=160', description: 'Caminata por la cresta de la caldera con vistas increíbles.', distance: '10km', duration: '3h 30m', difficulty: 'Moderado' },
      { id: 'A5_3', title: 'Sendero del Pueblo', type: 'trail', island: 'CVU', image: 'https://picsum.photos/400/300?random=161', description: 'Caminata por el único asentamiento en la isla más pequeña.', distance: '5km', duration: '1h 30m', difficulty: 'Fácil' },
      { id: 'A5_4', title: 'Faro de Canto', type: 'trail', island: 'CVU', image: 'https://picsum.photos/400/300?random=162', description: 'Sendero hasta el faro aislado en el norte de la isla.', distance: '8km', duration: '3h', difficulty: 'Moderado' },

      // SANTA MARIA (SMA)
      { id: 'A9', title: 'Pico Alto', type: 'trail', island: 'SMA', image: 'https://picsum.photos/400/300?random=163', description: 'Ascenso al punto más alto de la isla amarilla.', distance: '6km', duration: '2h 30m', difficulty: 'Moderado' },
      { id: 'A9_2', title: 'Barreiro da Faneca', type: 'trail', island: 'SMA', image: 'https://picsum.photos/400/300?random=164', description: 'Caminata por el desierto rojo de Santa Maria.', distance: '9km', duration: '3h', difficulty: 'Fácil' },
      { id: 'A9_3', title: 'Bahía de los Ángeles', type: 'trail', island: 'SMA', image: 'https://picsum.photos/400/300?random=165', description: 'Sendero costero histórico donde desembarcó Colón.', distance: '5km', duration: '1h 30m', difficulty: 'Fácil' },
      { id: 'A9_4', title: 'Cascada de Aveiro', type: 'trail', island: 'SMA', image: 'https://picsum.photos/400/300?random=166', description: 'Sendero a una de las cascadas más grandes de Portugal.', distance: '2km', duration: '1h', difficulty: 'Fácil' },
      { id: 'A9_5', title: 'Praia Formosa', type: 'trail', island: 'SMA', image: 'https://picsum.photos/400/300?random=167', description: 'Sendero costero que conecta el pueblo con la playa de arena clara.', distance: '7km', duration: '2h 30m', difficulty: 'Fácil' },

      { id: 'A3', title: 'Plantaciones de Té', type: 'culture', island: 'PDL', image: 'https://picsum.photos/400/300?random=32', description: 'Visite las únicas plantaciones de té en Europa en Gorreana.' },
    ]
  },
  it: {
    airports: [
      { code: 'PDL', name: 'Aeroporto João Paulo II', location: 'São Miguel', isAzores: true },
      { code: 'TER', name: 'Aeroporto das Lajes', location: 'Terceira', isAzores: true },
      { code: 'HOR', name: 'Aeroporto da Horta', location: 'Faial', isAzores: true },
      { code: 'PIX', name: 'Aeroporto do Pico', location: 'Pico', isAzores: true },
      { code: 'SJZ', name: 'Aeroporto di São Jorge', location: 'São Jorge', isAzores: true },
      { code: 'GRW', name: 'Aeroporto di Graciosa', location: 'Graciosa', isAzores: true },
      { code: 'FLW', name: 'Aeroporto das Flores', location: 'Flores', isAzores: true },
      { code: 'CVU', name: 'Aeroporto di Corvo', location: 'Corvo', isAzores: true },
      { code: 'SMA', name: 'Aeroporto de Santa Maria', location: 'Santa Maria', isAzores: true },
      { code: 'LIS', name: 'Humberto Delgado', location: 'Lisbona, Portogallo', isAzores: false },
      { code: 'OPO', name: 'Francisco Sá Carneiro', location: 'Porto, Portogallo', isAzores: false },
      { code: 'BOS', name: 'Logan International', location: 'Boston, USA', isAzores: false },
      { code: 'YYZ', name: 'Pearson International', location: 'Toronto, Canada', isAzores: false },
      { code: 'LHR', name: 'Heathrow', location: 'Londra, Regno Unito', isAzores: false },
      { code: 'JFK', name: 'John F. Kennedy', location: 'New York, USA', isAzores: false },
      { code: 'FRA', name: 'Aeroporto di Francoforte', location: 'Francoforte, Germania', isAzores: false },
    ],
    hotels: [
      { id: 'H1', name: 'Azores Royal Garden', island: 'PDL', stars: 4, pricePerNight: 120, image: 'https://picsum.photos/400/300?random=1', description: 'Hotel di lusso con giardino giapponese e spa.' },
      { id: 'H2', name: 'Terra Nostra Garden', island: 'PDL', stars: 5, pricePerNight: 200, image: 'https://picsum.photos/400/300?random=2', description: 'Situato a Furnas con piscine termali.' },
      { id: 'H3', name: 'Terceira Mar Hotel', island: 'TER', stars: 4, pricePerNight: 110, image: 'https://picsum.photos/400/300?random=3', description: 'Camere con vista mare e piscina di acqua salata.' },
      { id: 'H4', name: 'Faial Resort Hotel', island: 'HOR', stars: 4, pricePerNight: 130, image: 'https://picsum.photos/400/300?random=4', description: 'Con vista privilegiada sulla montagna del Pico.' },
      { id: 'H5', name: 'Hotel São Jorge Garden', island: 'SJZ', stars: 3, pricePerNight: 90, image: 'https://picsum.photos/400/300?random=50', description: 'Situato sulle scogliere con vista su Pico.' },
      { id: 'H6', name: 'Graciosa Resort', island: 'GRW', stars: 4, pricePerNight: 105, image: 'https://picsum.photos/400/300?random=51', description: 'Resort moderno su un\'isola tranquilla.' },
      { id: 'H7', name: 'Guest House Comodoro', island: 'CVU', stars: 3, pricePerNight: 75, image: 'https://picsum.photos/400/300?random=52', description: 'Alloggio accogliente nell\'isola più piccola.' },
    ],
    restaurants: [
      {
        id: 'R1', name: 'A Tasca', island: 'PDL', cuisine: 'Regionale', rating: 4.8, reviews: 2450, image: 'https://picsum.photos/400/300?random=20',
        description: 'Cucina tradizionale delle Azzorre in un\'atmosfera rustica e vivace. Famoso per la bistecca di tonno.',
        dishes: [
          { name: 'Bistecca di Tonno', description: 'Bistecca di tonno fresco con semi di sesamo.', price: 18, image: 'https://picsum.photos/300/200?random=21' },
          { name: 'Polvo à Lagareiro', description: 'Polpo arrosto con patate al forno.', price: 22, image: 'https://picsum.photos/300/200?random=22' },
          { name: 'Ananas Caramellato', description: 'Ananas locale caramellato.', price: 6, image: 'https://picsum.photos/300/200?random=23' }
        ]
      },
      {
        id: 'R2', name: 'O Pescador', island: 'TER', cuisine: 'Frutti di Mare', rating: 4.6, reviews: 890, image: 'https://picsum.photos/400/300?random=24',
        description: 'Il miglior pesce fresco a Terceira, situato vicino al porto.',
        dishes: [
          { name: 'Patelle alla Griglia', description: 'Patelle alla griglia con burro all\'aglio.', price: 12, image: 'https://picsum.photos/300/200?random=25' },
          { name: 'Alcatra', description: 'Piatto di carne cotto lentamente in pentola di terracotta.', price: 19, image: 'https://picsum.photos/300/200?random=26' }
        ]
      },
      {
        id: 'R3', name: 'Peter Café Sport', island: 'HOR', cuisine: 'Bar/Pub', rating: 4.9, reviews: 5000, image: 'https://picsum.photos/400/300?random=27',
        description: 'Bar di marinai famoso in tutto il mondo. Noto per Gin Tonic e torta al cioccolato.',
        dishes: [
          { name: 'Gin del Mare', description: 'Gin Tonic d\'autore.', price: 8, image: 'https://picsum.photos/300/200?random=28' },
          { name: 'Torta al Cioccolato di Peter', description: 'Torta al cioccolato densa e ricca.', price: 5, image: 'https://picsum.photos/300/200?random=29' }
        ]
      },
      {
        id: 'R4', name: 'Restaurante Velas', island: 'SJZ', cuisine: 'Regionale', rating: 4.5, reviews: 320, image: 'https://picsum.photos/400/300?random=60',
        description: 'Specialisti in Vongole di Caldeira e Formaggio di São Jorge.',
        dishes: [
          { name: 'Vongole', description: 'Vongole fresche da Caldeira de Santo Cristo.', price: 25, image: 'https://picsum.photos/300/200?random=61' },
          { name: 'Tagliere di Formaggi', description: 'Selezione di formaggi stagionati di São Jorge.', price: 15, image: 'https://picsum.photos/300/200?random=62' }
        ]
      }
    ],
    activities: [
      // SÃO MIGUEL (PDL)
      { id: 'A1', title: 'Sentiero Sete Cidades', type: 'trail', island: 'PDL', image: 'https://picsum.photos/400/300?random=30', description: 'Cammina intorno al cratere dei laghi blu e verde.', distance: '12km', duration: '4h', difficulty: 'Moderado' },
      { id: 'A1_2', title: 'Lagoa do Fogo', type: 'trail', island: 'PDL', image: 'https://picsum.photos/400/300?random=130', description: 'Sentiero che scende alla spiaggia della laguna più selvaggia dell\'isola.', distance: '11km', duration: '4h 30m', difficulty: 'Difícil' },
      { id: 'A1_3', title: 'Salto do Cabrito', type: 'trail', island: 'PDL', image: 'https://picsum.photos/400/300?random=131', description: 'Passeggiata circolare che passa per una cascata e una vecchia centrale idroelettrica.', distance: '8.5km', duration: '3h', difficulty: 'Fácil' },
      { id: 'A1_4', title: 'Finestra dell\'Inferno', type: 'trail', island: 'PDL', image: 'https://picsum.photos/400/300?random=132', description: 'Sentiero mistico che attraversa vecchi tunnel e acquedotti.', distance: '7.6km', duration: '2h 30m', difficulty: 'Fácil' },
      { id: 'A1_5', title: 'Pico da Vara', type: 'trail', island: 'PDL', image: 'https://picsum.photos/400/300?random=133', description: 'Salita al punto più alto dell\'isola di São Miguel.', distance: '7km', duration: '3h', difficulty: 'Difícil' },
      
      // TERCEIRA (TER)
      { id: 'A2', title: 'Algar do Carvão', type: 'landscape', island: 'TER', image: 'https://picsum.photos/400/300?random=31', description: 'Scendi in un antico camino vulcanico.' },
      { id: 'A2_2', title: 'Misteri Neri', type: 'trail', island: 'TER', image: 'https://picsum.photos/400/300?random=134', description: 'Sentiero impegnativo tra cupole vulcaniche e fitta vegetazione.', distance: '5km', duration: '2h 30m', difficulty: 'Difícil' },
      { id: 'A2_3', title: 'Rocha do Chambre', type: 'trail', island: 'TER', image: 'https://picsum.photos/400/300?random=135', description: 'Viste spettacolari sulla caldera e l\'interno dell\'isola.', distance: '8.8km', duration: '3h 30m', difficulty: 'Moderado' },
      { id: 'A2_4', title: 'Monte Brasil', type: 'trail', island: 'TER', image: 'https://picsum.photos/400/300?random=136', description: 'Passeggiata storica con vista su Angra do Heroísmo.', distance: '7.5km', duration: '2h 30m', difficulty: 'Fácil' },
      { id: 'A2_5', title: 'Baia di Agualva', type: 'trail', island: 'TER', image: 'https://picsum.photos/400/300?random=137', description: 'Sentiero costiero con imponenti formazioni geologiche.', distance: '3.8km', duration: '1h 30m', difficulty: 'Fácil' },

      // FAIAL (HOR)
      { id: 'A4_2', title: 'Caldera di Faial', type: 'trail', island: 'HOR', image: 'https://picsum.photos/400/300?random=138', description: 'Passeggiata circolare intorno alla massiccia caldera centrale.', distance: '7km', duration: '2h 30m', difficulty: 'Fácil' },
      { id: 'A4_3', title: 'Sentiero di Capelinhos', type: 'trail', island: 'HOR', image: 'https://picsum.photos/400/300?random=139', description: 'Passeggiata sulle ceneri dell\'ultimo vulcano delle Azzorre.', distance: '3.2km', duration: '1h 30m', difficulty: 'Fácil' },
      { id: 'A4_4', title: 'Levada di Faial', type: 'trail', island: 'HOR', image: 'https://picsum.photos/400/300?random=140', description: 'Uno dei sentieri levada più lunghi dell\'arcipelago.', distance: '24km', duration: '7h', difficulty: 'Moderado' },
      { id: 'A4_5', title: 'Morro de Castelo Branco', type: 'trail', island: 'HOR', image: 'https://picsum.photos/400/300?random=141', description: 'Sentiero costiero verso l\'iconica formazione di roccia bianca.', distance: '4km', duration: '1h 30m', difficulty: 'Fácil' },

      // PICO (PIX)
      { id: 'A7', title: 'Salita al Monte Pico', type: 'trail', island: 'PIX', image: 'https://picsum.photos/400/300?random=142', description: 'La sfida definitiva: scalare il punto più alto del Portogallo.', distance: '8km', duration: '7h', difficulty: 'Difícil' },
      { id: 'A7_2', title: 'Sentiero delle Lagune', type: 'trail', island: 'PIX', image: 'https://picsum.photos/400/300?random=143', description: 'Sentiero attraverso l\'altopiano centrale passando per diverse lagune.', distance: '22km', duration: '6h 30m', difficulty: 'Moderado' },
      { id: 'A7_3', title: 'Criação Velha', type: 'trail', island: 'PIX', image: 'https://picsum.photos/400/300?random=144', description: 'Passeggiata tra i vigneti Patrimonio dell\'Umanità UNESCO.', distance: '6.9km', duration: '2h', difficulty: 'Fácil' },
      { id: 'A7_4', title: 'Ponta da Ilha', type: 'trail', island: 'PIX', image: 'https://picsum.photos/400/300?random=145', description: 'Sentiero costero all\'estremità orientale dell\'isola di Pico.', distance: '10km', duration: '3h', difficulty: 'Fácil' },
      { id: 'A7_5', title: 'Calheta de Nesquim', type: 'trail', island: 'PIX', image: 'https://picsum.photos/400/300?random=146', description: 'Sentiero storico legato alla tradizione baleniera.', distance: '12km', duration: '4h', difficulty: 'Moderado' },

      // SÃO JORGE (SJZ)
      { id: 'A4', title: 'Fajãs di São Jorge', type: 'landscape', island: 'SJZ', image: 'https://picsum.photos/400/300?random=33', description: 'Esplora le iconiche pianure costiere formate dalla lava.' },
      { id: 'A4_6', title: 'Fajã dos Cubres', type: 'trail', island: 'SJZ', image: 'https://picsum.photos/400/300?random=147', description: 'Discesa da Serra do Topo a Fajã de Santo Cristo.', distance: '10km', duration: '3h 30m', difficulty: 'Moderado' },
      { id: 'A4_7', title: 'Pico da Esperança', type: 'trail', island: 'SJZ', image: 'https://picsum.photos/400/300?random=148', description: 'Passeggiata lungo il crinale dell\'isola con vista sulle isole vicine.', distance: '17km', duration: '5h', difficulty: 'Moderado' },
      { id: 'A4_8', title: 'Serra do Topo', type: 'trail', island: 'SJZ', image: 'https://picsum.photos/400/300?random=149', description: 'Sentiero di montagna con viste mozzafiato sulle fajãs.', distance: '5km', duration: '2h', difficulty: 'Fácil' },
      { id: 'A4_9', title: 'Fajã de São João', type: 'trail', island: 'SJZ', image: 'https://picsum.photos/400/300?random=150', description: 'Sentiero tradizionale che collega diverse fajãs isolate.', distance: '10km', duration: '3h 30m', difficulty: 'Moderado' },

      // GRACIOSA (GRW)
      { id: 'A6', title: 'Furna do Enxofre', type: 'poi', island: 'GRW', image: 'https://picsum.photos/400/300?random=35', description: 'Una grotta vulcanica unica con un lago sotterraneo.' },
      { id: 'A6_2', title: 'Caldera di Graciosa', type: 'trail', island: 'GRW', image: 'https://picsum.photos/400/300?random=151', description: 'Passeggiata circolare intorno alla caldera dell\'isola bianca.', distance: '10km', duration: '3h', difficulty: 'Fácil' },
      { id: 'A6_3', title: 'Baia di Folga', type: 'trail', island: 'GRW', image: 'https://picsum.photos/400/300?random=152', description: 'Sentiero costiero con vista sul mare e sulle scogliere.', distance: '4km', duration: '1h 30m', difficulty: 'Fácil' },
      { id: 'A6_4', title: 'Serra Branca', type: 'trail', island: 'GRW', image: 'https://picsum.photos/400/300?random=153', description: 'Passeggiata attraverso il punto più alto di Graciosa.', distance: '8km', duration: '2h 30m', difficulty: 'Fácil' },
      { id: 'A6_5', title: 'Porto Afonso', type: 'trail', island: 'GRW', image: 'https://picsum.photos/400/300?random=154', description: 'Sentiero che porta alle antiche grotte dei pescatori.', distance: '6km', duration: '2h', difficulty: 'Fácil' },

      // FLORES (FLW)
      { id: 'A8', title: 'Lagune di Flores', type: 'trail', island: 'FLW', image: 'https://picsum.photos/400/300?random=155', description: 'Sentiero che collega le sette lagune dell\'isola di Flores.', distance: '7km', duration: '3h', difficulty: 'Moderado' },
      { id: 'A8_2', title: 'Fajã Grande a Ponta Delgada', type: 'trail', island: 'FLW', image: 'https://picsum.photos/400/300?random=156', description: 'Uno dei sentieri più belli e remoti delle Azzorre.', distance: '13km', duration: '5h', difficulty: 'Difícil' },
      { id: 'A8_3', title: 'Poço do Bacalhau', type: 'trail', island: 'FLW', image: 'https://picsum.photos/400/300?random=157', description: 'Breve passeggiata verso l\'imponente cascata di Fajã Grande.', distance: '1km', duration: '30m', difficulty: 'Fácil' },
      { id: 'A8_4', title: 'Rocha dos Bordões', type: 'trail', island: 'FLW', image: 'https://picsum.photos/400/300?random=158', description: 'Sentiero geologico accanto alla famosa formazione di prismi basaltici.', distance: '4km', duration: '1h 30m', difficulty: 'Fácil' },
      { id: 'A8_5', title: 'Lajes das Flores', type: 'trail', island: 'FLW', image: 'https://picsum.photos/400/300?random=159', description: 'Sentiero storico attraverso la costa sud dell\'isola.', distance: '8km', duration: '3h', difficulty: 'Moderado' },

      // CORVO (CVU)
      { id: 'A5', title: 'Caldeirão do Corvo', type: 'landscape', island: 'CVU', image: 'https://picsum.photos/400/300?random=34', description: 'L\'impressionante cratere vulcanico nel cuore di Corvo.' },
      { id: 'A5_2', title: 'Faccia dell\'Indiano', type: 'trail', island: 'CVU', image: 'https://picsum.photos/400/300?random=160', description: 'Passeggiata lungo il crinale della caldera con viste incredibili.', distance: '10km', duration: '3h 30m', difficulty: 'Moderado' },
      { id: 'A5_3', title: 'Sentiero del Villaggio', type: 'trail', island: 'CVU', image: 'https://picsum.photos/400/300?random=161', description: 'Passeggiata attraverso l\'unico insediamento sulla più piccola isola.', distance: '5km', duration: '1h 30m', difficulty: 'Fácil' },
      { id: 'A5_4', title: 'Faro di Canto', type: 'trail', island: 'CVU', image: 'https://picsum.photos/400/300?random=162', description: 'Sentiero verso il faro isolato nel nord dell\'isola.', distance: '8km', duration: '3h', difficulty: 'Moderado' },

      // SANTA MARIA (SMA)
      { id: 'A9', title: 'Pico Alto', type: 'trail', island: 'SMA', image: 'https://picsum.photos/400/300?random=163', description: 'Salita al punto più alto dell\'isola gialla.', distance: '6km', duration: '2h 30m', difficulty: 'Moderado' },
      { id: 'A9_2', title: 'Barreiro da Faneca', type: 'trail', island: 'SMA', image: 'https://picsum.photos/400/300?random=164', description: 'Passeggiata nel deserto rosso di Santa Maria.', distance: '9km', duration: '3h', difficulty: 'Fácil' },
      { id: 'A9_3', title: 'Baia degli Angeli', type: 'trail', island: 'SMA', image: 'https://picsum.photos/400/300?random=165', description: 'Sentiero costiero storico dove sbarcò Colombo.', distance: '5km', duration: '1h 30m', difficulty: 'Fácil' },
      { id: 'A9_4', title: 'Cascata di Aveiro', type: 'trail', island: 'SMA', image: 'https://picsum.photos/400/300?random=166', description: 'Sentiero verso una delle cascate più grandi del Portogallo.', distance: '2km', duration: '1h', difficulty: 'Fácil' },
      { id: 'A9_5', title: 'Praia Formosa', type: 'trail', island: 'SMA', image: 'https://picsum.photos/400/300?random=167', description: 'Sentiero costiero che collega il villaggio alla spiaggia di sabbia chiara.', distance: '7km', duration: '2h 30m', difficulty: 'Fácil' },

      { id: 'A3', title: 'Piantagioni di Tè', type: 'culture', island: 'PDL', image: 'https://picsum.photos/400/300?random=32', description: 'Visita le uniche piantagioni di tè in Europa a Gorreana.' },
    ]
  },
  de: {
    airports: [
      { code: 'PDL', name: 'Flughafen João Paulo II', location: 'São Miguel', isAzores: true },
      { code: 'TER', name: 'Flughafen Lajes', location: 'Terceira', isAzores: true },
      { code: 'HOR', name: 'Flughafen Horta', location: 'Faial', isAzores: true },
      { code: 'PIX', name: 'Flughafen Pico', location: 'Pico', isAzores: true },
      { code: 'SJZ', name: 'Flughafen São Jorge', location: 'São Jorge', isAzores: true },
      { code: 'GRW', name: 'Flughafen Graciosa', location: 'Graciosa', isAzores: true },
      { code: 'FLW', name: 'Flughafen Flores', location: 'Flores', isAzores: true },
      { code: 'CVU', name: 'Flughafen Corvo', location: 'Corvo', isAzores: true },
      { code: 'SMA', name: 'Flughafen Santa Maria', location: 'Santa Maria', isAzores: true },
      { code: 'LIS', name: 'Humberto Delgado', location: 'Lissabon, Portugal', isAzores: false },
      { code: 'OPO', name: 'Francisco Sá Carneiro', location: 'Porto, Portugal', isAzores: false },
      { code: 'BOS', name: 'Logan International', location: 'Boston, USA', isAzores: false },
      { code: 'YYZ', name: 'Pearson International', location: 'Toronto, Kanada', isAzores: false },
      { code: 'LHR', name: 'Heathrow', location: 'London, UK', isAzores: false },
      { code: 'JFK', name: 'John F. Kennedy', location: 'New York, USA', isAzores: false },
      { code: 'FRA', name: 'Flughafen Frankfurt', location: 'Frankfurt, Deutschland', isAzores: false },
    ],
    hotels: [
      { id: 'H1', name: 'Azores Royal Garden', island: 'PDL', stars: 4, pricePerNight: 120, image: 'https://picsum.photos/400/300?random=1', description: 'Luxushotel mit japanischem Garten und Spa.' },
      { id: 'H2', name: 'Terra Nostra Garden', island: 'PDL', stars: 5, pricePerNight: 200, image: 'https://picsum.photos/400/300?random=2', description: 'In Furnas gelegen mit Thermalbecken.' },
      { id: 'H3', name: 'Terceira Mar Hotel', island: 'TER', stars: 4, pricePerNight: 110, image: 'https://picsum.photos/400/300?random=3', description: 'Zimmer mit Meerblick und Salzwasserpool.' },
      { id: 'H4', name: 'Faial Resort Hotel', island: 'HOR', stars: 4, pricePerNight: 130, image: 'https://picsum.photos/400/300?random=4', description: 'Mit privilegiertem Blick auf den Berg Pico.' },
      { id: 'H5', name: 'Hotel São Jorge Garden', island: 'SJZ', stars: 3, pricePerNight: 90, image: 'https://picsum.photos/400/300?random=50', description: 'Gelegen auf den Klippen mit Blick auf Pico.' },
      { id: 'H6', name: 'Graciosa Resort', island: 'GRW', stars: 4, pricePerNight: 105, image: 'https://picsum.photos/400/300?random=51', description: 'Modernes Resort auf einer ruhigen Insel.' },
      { id: 'H7', name: 'Guest House Comodoro', island: 'CVU', stars: 3, pricePerNight: 75, image: 'https://picsum.photos/400/300?random=52', description: 'Gemütliche Unterkunft auf der kleinsten Insel.' },
    ],
    restaurants: [
      {
        id: 'R1', name: 'A Tasca', island: 'PDL', cuisine: 'Regional', rating: 4.8, reviews: 2450, image: 'https://picsum.photos/400/300?random=20',
        description: 'Traditionelle azoreanische Küche in rustikaler und lebhafter Atmosphäre. Berühmt für Thunfischsteak.',
        dishes: [
          { name: 'Thunfischsteak', description: 'Frisches Thunfischsteak mit Sesamsamen.', price: 18, image: 'https://picsum.photos/300/200?random=21' },
          { name: 'Polvo à Lagareiro', description: 'Gebratener Oktopus mit geschlagenen Kartoffeln.', price: 22, image: 'https://picsum.photos/300/200?random=22' },
          { name: 'Karamellisierte Ananas', description: 'Lokale karamellisierte Ananas.', price: 6, image: 'https://picsum.photos/300/200?random=23' }
        ]
      },
      {
        id: 'R2', name: 'O Pescador', island: 'TER', cuisine: 'Meeresfrüchte', rating: 4.6, reviews: 890, image: 'https://picsum.photos/400/300?random=24',
        description: 'Der beste frische Fisch auf Terceira, am Hafen gelegen.',
        dishes: [
          { name: 'Gegrillte Napfschnecken', description: 'Gegrillte Napfschnecken mit Knoblauchbutter.', price: 12, image: 'https://picsum.photos/300/200?random=25' },
          { name: 'Alcatra', description: 'Fleischgericht, langsam im Tontopf gegart.', price: 19, image: 'https://picsum.photos/300/200?random=26' }
        ]
      },
      {
        id: 'R3', name: 'Peter Café Sport', island: 'HOR', cuisine: 'Bar/Pub', rating: 4.9, reviews: 5000, image: 'https://picsum.photos/400/300?random=27',
        description: 'Weltberühmte Seemannsbar. Bekannt für Gin Tonic und Schokoladenkuchen.',
        dishes: [
          { name: 'Meer-Gin', description: 'Signatur Gin Tonic.', price: 8, image: 'https://picsum.photos/300/200?random=28' },
          { name: 'Peters Schokoladenkuchen', description: 'Dichter und reicher Schokoladenkuchen.', price: 5, image: 'https://picsum.photos/300/200?random=29' }
        ]
      },
      {
        id: 'R4', name: 'Restaurante Velas', island: 'SJZ', cuisine: 'Regional', rating: 4.5, reviews: 320, image: 'https://picsum.photos/400/300?random=60',
        description: 'Spezialisten für Caldeira-Muscheln und São-Jorge-Käse.',
        dishes: [
          { name: 'Muscheln', description: 'Frische Muscheln aus der Caldeira de Santo Cristo.', price: 25, image: 'https://picsum.photos/300/200?random=61' },
          { name: 'Käseplatte', description: 'Auswahl an gereiften Käsesorten von São Jorge.', price: 15, image: 'https://picsum.photos/300/200?random=62' }
        ]
      }
    ],
    activities: [
      // SÃO MIGUEL (PDL)
      { id: 'A1', title: 'Sete Cidades Wanderweg', type: 'trail', island: 'PDL', image: 'https://picsum.photos/400/300?random=30', description: 'Wandern Sie um den Krater der blauen und grünen Seen.', distance: '12km', duration: '4h', difficulty: 'Moderado' },
      { id: 'A1_2', title: 'Lagoa do Fogo', type: 'trail', island: 'PDL', image: 'https://picsum.photos/400/300?random=130', description: 'Weg, der zum Strand der wildesten Lagune der Insel hinabsteigt.', distance: '11km', duration: '4h 30m', difficulty: 'Difícil' },
      { id: 'A1_3', title: 'Salto do Cabrito', type: 'trail', island: 'PDL', image: 'https://picsum.photos/400/300?random=131', description: 'Rundwanderung vorbei an einem Wasserfall und einem alten Wasserkraftwerk.', distance: '8.5km', duration: '3h', difficulty: 'Fácil' },
      { id: 'A1_4', title: 'Höllenfenster', type: 'trail', island: 'PDL', image: 'https://picsum.photos/400/300?random=132', description: 'Mystischer Weg durch alte Tunnel und Aquädukte.', distance: '7.6km', duration: '2h 30m', difficulty: 'Fácil' },
      { id: 'A1_5', title: 'Pico da Vara', type: 'trail', island: 'PDL', image: 'https://picsum.photos/400/300?random=133', description: 'Aufstieg zum höchsten Punkt der Insel São Miguel.', distance: '7km', duration: '3h', difficulty: 'Difícil' },
      
      // TERCEIRA (TER)
      { id: 'A2', title: 'Algar do Carvão', type: 'landscape', island: 'TER', image: 'https://picsum.photos/400/300?random=31', description: 'Steigen Sie in einen alten Vulkanschornstein hinab.' },
      { id: 'A2_2', title: 'Schwarze Mysterien', type: 'trail', island: 'TER', image: 'https://picsum.photos/400/300?random=134', description: 'Herausfordernder Weg zwischen Vulkandomen und dichter Vegetation.', distance: '5km', duration: '2h 30m', difficulty: 'Difícil' },
      { id: 'A2_3', title: 'Rocha do Chambre', type: 'trail', island: 'TER', image: 'https://picsum.photos/400/300?random=135', description: 'Spektakuläre Ausblicke über die Caldera und das Inselinnere.', distance: '8.8km', duration: '3h 30m', difficulty: 'Moderado' },
      { id: 'A2_4', title: 'Monte Brasil', type: 'trail', island: 'TER', image: 'https://picsum.photos/400/300?random=136', description: 'Historischer Spaziergang mit Blick auf Angra do Heroísmo.', distance: '7.5km', duration: '2h 30m', difficulty: 'Fácil' },
      { id: 'A2_5', title: 'Bucht von Agualva', type: 'trail', island: 'TER', image: 'https://picsum.photos/400/300?random=137', description: 'Küstenweg mit beeindruckenden geologischen Formationen.', distance: '3.8km', duration: '1h 30m', difficulty: 'Fácil' },

      // FAIAL (HOR)
      { id: 'A4_2', title: 'Faial Caldera', type: 'trail', island: 'HOR', image: 'https://picsum.photos/400/300?random=138', description: 'Rundwanderung um die massive zentrale Caldera.', distance: '7km', duration: '2h 30m', difficulty: 'Fácil' },
      { id: 'A4_3', title: 'Capelinhos Weg', type: 'trail', island: 'HOR', image: 'https://picsum.photos/400/300?random=139', description: 'Spaziergang über die Asche des letzten Vulkans auf den Azoren.', distance: '3.2km', duration: '1h 30m', difficulty: 'Fácil' },
      { id: 'A4_4', title: 'Faial Levada', type: 'trail', island: 'HOR', image: 'https://picsum.photos/400/300?random=140', description: 'Einer der längsten Levada-Wanderwege im Archipel.', distance: '24km', duration: '7h', difficulty: 'Moderado' },
      { id: 'A4_5', title: 'Morro de Castelo Branco', type: 'trail', island: 'HOR', image: 'https://picsum.photos/400/300?random=141', description: 'Küstenweg zur ikonischen weißen Felsformation.', distance: '4km', duration: '1h 30m', difficulty: 'Fácil' },

      // PICO (PIX)
      { id: 'A7', title: 'Aufstieg zum Berg Pico', type: 'trail', island: 'PIX', image: 'https://picsum.photos/400/300?random=142', description: 'Die ultimative Herausforderung: Besteigung des höchsten Punktes Portugals.', distance: '8km', duration: '7h', difficulty: 'Difícil' },
      { id: 'A7_2', title: 'Weg der Lagunen', type: 'trail', island: 'PIX', image: 'https://picsum.photos/400/300?random=143', description: 'Weg durch das zentrale Plateau vorbei an mehreren Lagunen.', distance: '22km', duration: '6h 30m', difficulty: 'Moderado' },
      { id: 'A7_3', title: 'Criação Velha', type: 'trail', island: 'PIX', image: 'https://picsum.photos/400/300?random=144', description: 'Spaziergang durch die UNESCO-Welterbe-Weinberge.', distance: '6.9km', duration: '2h', difficulty: 'Fácil' },
      { id: 'A7_4', title: 'Ponta da Ilha', type: 'trail', island: 'PIX', image: 'https://picsum.photos/400/300?random=145', description: 'Küstenweg an der Ostspitze der Insel Pico.', distance: '10km', duration: '3h', difficulty: 'Fácil' },
      { id: 'A7_5', title: 'Calheta de Nesquim', type: 'trail', island: 'PIX', image: 'https://picsum.photos/400/300?random=146', description: 'Historischer Weg, der mit der Walfangtradition verbunden ist.', distance: '12km', duration: '4h', difficulty: 'Moderado' },

      // SÃO JORGE (SJZ)
      { id: 'A4', title: 'Fajãs von São Jorge', type: 'landscape', island: 'SJZ', image: 'https://picsum.photos/400/300?random=33', description: 'Erkunden Sie die ikonischen Küstenebenen, die durch Lava geformt wurden.' },
      { id: 'A4_6', title: 'Fajã dos Cubres', type: 'trail', island: 'SJZ', image: 'https://picsum.photos/400/300?random=147', description: 'Abstieg von Serra do Topo zur Fajã de Santo Cristo.', distance: '10km', duration: '3h 30m', difficulty: 'Moderado' },
      { id: 'A4_7', title: 'Pico da Esperança', type: 'trail', island: 'SJZ', image: 'https://picsum.photos/400/300?random=148', description: 'Wanderung entlang des Inselrückens mit Blick auf die Nachbarinseln.', distance: '17km', duration: '5h', difficulty: 'Moderado' },
      { id: 'A4_8', title: 'Serra do Topo', type: 'trail', island: 'SJZ', image: 'https://picsum.photos/400/300?random=149', description: 'Bergwanderweg mit atemberaubendem Blick über die Fajãs.', distance: '5km', duration: '2h', difficulty: 'Fácil' },
      { id: 'A4_9', title: 'Fajã de São João', type: 'trail', island: 'SJZ', image: 'https://picsum.photos/400/300?random=150', description: 'Traditioneller Weg, der mehrere isolierte Fajãs verbindet.', distance: '10km', duration: '3h 30m', difficulty: 'Moderado' },

      // GRACIOSA (GRW)
      { id: 'A6', title: 'Furna do Enxofre', type: 'poi', island: 'GRW', image: 'https://picsum.photos/400/300?random=35', description: 'Eine einzigartige Vulkanhöhle mit einem unterirdischen See.' },
      { id: 'A6_2', title: 'Graciosa Caldera', type: 'trail', island: 'GRW', image: 'https://picsum.photos/400/300?random=151', description: 'Rundwanderung um die Caldera der weißen Insel.', distance: '10km', duration: '3h', difficulty: 'Fácil' },
      { id: 'A6_3', title: 'Bucht von Folga', type: 'trail', island: 'GRW', image: 'https://picsum.photos/400/300?random=152', description: 'Küstenweg mit Blick auf das Meer und die Klippen.', distance: '4km', duration: '1h 30m', difficulty: 'Fácil' },
      { id: 'A6_4', title: 'Serra Branca', type: 'trail', island: 'GRW', image: 'https://picsum.photos/400/300?random=153', description: 'Wanderung durch den höchsten Punkt von Graciosa.', distance: '8km', duration: '2h 30m', difficulty: 'Fácil' },
      { id: 'A6_5', title: 'Porto Afonso', type: 'trail', island: 'GRW', image: 'https://picsum.photos/400/300?random=154', description: 'Weg, der zu den alten Fischerhöhlen führt.', distance: '6km', duration: '2h', difficulty: 'Fácil' },

      // FLORES (FLW)
      { id: 'A8', title: 'Lagunen von Flores', type: 'trail', island: 'FLW', image: 'https://picsum.photos/400/300?random=155', description: 'Weg, der die sieben Lagunen der Insel Flores verbindet.', distance: '7km', duration: '3h', difficulty: 'Moderado' },
      { id: 'A8_2', title: 'Fajã Grande nach Ponta Delgada', type: 'trail', island: 'FLW', image: 'https://picsum.photos/400/300?random=156', description: 'Einer der schönsten und abgelegensten Wege auf den Azoren.', distance: '13km', duration: '5h', difficulty: 'Difícil' },
      { id: 'A8_3', title: 'Poço do Bacalhau', type: 'trail', island: 'FLW', image: 'https://picsum.photos/400/300?random=157', description: 'Kurzer Spaziergang zum beeindruckenden Fajã Grande Wasserfall.', distance: '1km', duration: '30m', difficulty: 'Fácil' },
      { id: 'A8_4', title: 'Rocha dos Bordões', type: 'trail', island: 'FLW', image: 'https://picsum.photos/400/300?random=158', description: 'Geologischer Weg neben der berühmten Basaltprismenformation.', distance: '4km', duration: '1h 30m', difficulty: 'Fácil' },
      { id: 'A8_5', title: 'Lajes das Flores', type: 'trail', island: 'FLW', image: 'https://picsum.photos/400/300?random=159', description: 'Historischer Weg durch die Südküste der Insel.', distance: '8km', duration: '3h', difficulty: 'Moderado' },

      // CORVO (CVU)
      { id: 'A5', title: 'Caldeirão do Corvo', type: 'landscape', island: 'CVU', image: 'https://picsum.photos/400/300?random=34', description: 'Der beeindruckende Vulkankrater im Herzen von Corvo.' },
      { id: 'A5_2', title: 'Gesicht des Indianers', type: 'trail', island: 'CVU', image: 'https://picsum.photos/400/300?random=160', description: 'Wanderung entlang des Caldera-Rückens mit unglaublicher Aussicht.', distance: '10km', duration: '3h 30m', difficulty: 'Moderado' },
      { id: 'A5_3', title: 'Dorfweg', type: 'trail', island: 'CVU', image: 'https://picsum.photos/400/300?random=161', description: 'Spaziergang durch die einzige Siedlung auf der kleinsten Insel.', distance: '5km', duration: '1h 30m', difficulty: 'Fácil' },
      { id: 'A5_4', title: 'Canto Leuchtturm', type: 'trail', island: 'CVU', image: 'https://picsum.photos/400/300?random=162', description: 'Weg zum isolierten Leuchtturm im Norden der Insel.', distance: '8km', duration: '3h', difficulty: 'Moderado' },

      // SANTA MARIA (SMA)
      { id: 'A9', title: 'Pico Alto', type: 'trail', island: 'SMA', image: 'https://picsum.photos/400/300?random=163', description: 'Aufstieg zum höchsten Punkt der gelben Insel.', distance: '6km', duration: '2h 30m', difficulty: 'Moderado' },
      { id: 'A9_2', title: 'Barreiro da Faneca', type: 'trail', island: 'SMA', image: 'https://picsum.photos/400/300?random=164', description: 'Spaziergang durch die rote Wüste von Santa Maria.', distance: '9km', duration: '3h', difficulty: 'Fácil' },
      { id: 'A9_3', title: 'Bucht der Engel', type: 'trail', island: 'SMA', image: 'https://picsum.photos/400/300?random=165', description: 'Historischer Küstenweg, auf dem Kolumbus landete.', distance: '5km', duration: '1h 30m', difficulty: 'Fácil' },
      { id: 'A9_4', title: 'Aveiro Wasserfall', type: 'trail', island: 'SMA', image: 'https://picsum.photos/400/300?random=166', description: 'Weg zu einem der größten Wasserfälle Portugals.', distance: '2km', duration: '1h', difficulty: 'Fácil' },
      { id: 'A9_5', title: 'Praia Formosa', type: 'trail', island: 'SMA', image: 'https://picsum.photos/400/300?random=167', description: 'Küstenweg, der das Dorf mit dem hellen Sandstrand verbindet.', distance: '7km', duration: '2h 30m', difficulty: 'Fácil' },

      { id: 'A3', title: 'Teeplantagen', type: 'culture', island: 'PDL', image: 'https://picsum.photos/400/300?random=32', description: 'Besuchen Sie die einzigen Teeplantagen Europas in Gorreana.' },
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
