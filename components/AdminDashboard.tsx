// Deploy Timestamp: 2026-05-25T20:13

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Restaurant, Activity, Language, Dish, Flight, Hotel, Car, BusSchedule, Business } from '../types';
import { getTranslation } from '../translations';
import { 
  Utensils, Mountain, Edit, Trash2, Plus, Save, X, LogOut, 
  LayoutDashboard, Plane, BedDouble, Car as CarIcon, Bus, 
  Image as ImageIcon, Lock, Users, Cloud as CloudSync,
  ShoppingBag, Mail, MapPin, Phone, Sparkles,
  Scissors, User, Flower2, Brush, ArrowRight, RefreshCw, Home,
  Wrench, Zap, Hammer, Droplets, Paintbrush, HardHat, PencilRuler, 
  ThermometerSnowflake, DraftingCompass, Settings, ShoppingCart, 
  MessageSquare, Dog, Building2, Dumbbell, CarFront, Briefcase, Laptop, Pipette, Calendar, Database,
  CheckCircle, AlertTriangle, ChevronLeft, ChevronRight, ChevronUp, ChevronDown, Wine, Landmark, SlidersHorizontal, Camera, Map
} from 'lucide-react';

import * as constants from '../constants';

import { API_BASE_URL } from '../config';
import { searchOpenStreetMapPlaces, searchWikidataTourism, checkDuplicates } from '../services/freeDataImportService';

console.log("%c🚀 Azores4you v1.2.1 - Pro Instance Active", "color: #10b981; font-weight: bold; font-size: 14px;");

const islandMapping: Record<string, string> = {
  'São Miguel': 'PDL',
  'Santa Maria': 'SMA',
  'Terceira': 'TER',
  'Faial': 'HOR',
  'Pico': 'PIX',
  'São Jorge': 'SJZ',
  'Graciosa': 'GRW',
  'Flores': 'FLW',
  'Corvo': 'CVU'
};

interface AdminDashboardProps {
  restaurants: Restaurant[];
  shops: Business[];
  beauty: Business[];
  services: Business[];
  autoRepairs: Business[];
  autoElectronics: Business[];
  usedMarket: Business[];
  animals: Business[];
  realEstate: Business[];
  gyms: Business[];
  stands: Business[];
  offices: Business[];
  itServices: Business[];
  perfumes: Business[];
  bars: Business[];
  events: Business[];
  municipal: Business[];
  activities: Activity[];
  flights: Flight[];
  hotels: Hotel[];
  cars: Car[];
  busSchedules: BusSchedule[];
  marketplaceAds: any[];
  marketplaceCategories?: any[];
  onUpdateMarketplaceCategories?: (list: any[]) => void;
  
  onUpdateRestaurants: (newRestaurants: Restaurant[]) => void;
  onUpdateShops: (newShops: Business[]) => void;
  onUpdateBeauty: (newBeauty: Business[]) => void;
  onUpdateServices: (newServices: Business[]) => void;
  onUpdateAutoRepairs: (newAutoRepairs: Business[]) => void;
  onUpdateAutoElectronics: (newAutoElectronics: Business[]) => void;
  onUpdateUsedMarket: (newUsedMarket: Business[]) => void;
  onUpdateAnimals: (newAnimals: Business[]) => void;
  onUpdateRealEstate: (newRealEstate: Business[]) => void;
  onUpdateGyms: (newGyms: Business[]) => void;
  onUpdateStands: (newStands: Business[]) => void;
  onUpdateOffices: (newOffices: Business[]) => void;
  onUpdateITServices: (newITServices: Business[]) => void;
  onUpdatePerfumes: (newPerfumes: Business[]) => void;
  onUpdateBars: (newBars: Business[]) => void;
  onUpdateEvents: (newEvents: Business[]) => void;
  onUpdateMunicipal: (newMunicipal: Business[]) => void;
  onUpdateActivities: (list: Activity[]) => void;
  onUpdateFlights: (list: Flight[]) => void;
  onUpdateHotels: (list: Hotel[]) => void;
  onUpdateCars: (list: Car[]) => void;
  onUpdateBusSchedules: (list: BusSchedule[]) => void;
  onUpdateMarketplaceAds: (list: any[]) => void;

  onLogout: () => void;
  onFullSync?: () => void;
  dbStatus?: any;
  language?: Language;
  users?: any[];
  onUpdateUsers?: (users: any[]) => void;
}

type Tab = 'dashboard' | 'restaurants' | 'shops' | 'beauty' | 'services' | 'auto_repairs' | 'auto_electronics' | 'used_market' | 'animals' | 'real_estate' | 'gyms' | 'stands' | 'offices' | 'it_services' | 'perfumes' | 'bars' | 'events' | 'municipal' | 'activities' | 'trails' | 'poi' | 'flights' | 'hotels' | 'cars' | 'buses' | 'accounts' | 'suppliers' | 'customers' | 'marketplace';

const AdminDashboard: React.FC<AdminDashboardProps> = ({
  restaurants = [], shops = [], beauty = [], services = [], autoRepairs = [], autoElectronics = [], usedMarket = [], animals = [], realEstate = [], gyms = [], stands = [], offices = [], itServices = [], perfumes = [], bars = [], events = [], municipal = [], activities = [], flights = [], hotels = [], cars = [], busSchedules = [], users = [], marketplaceAds = [], marketplaceCategories = [],
  onUpdateRestaurants, onUpdateShops, onUpdateBeauty, onUpdateServices, onUpdateAutoRepairs, onUpdateAutoElectronics, onUpdateUsedMarket, onUpdateAnimals, onUpdateRealEstate, onUpdateGyms, onUpdateStands, onUpdateOffices, onUpdateITServices, onUpdatePerfumes, onUpdateBars, onUpdateEvents, onUpdateMunicipal, onUpdateActivities, onUpdateFlights, onUpdateHotels, onUpdateCars, onUpdateBusSchedules, onUpdateUsers, onUpdateMarketplaceAds, onUpdateMarketplaceCategories,
  onLogout, onFullSync, dbStatus,
  language = 'pt'
}) => {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [showOtherTabs, setShowOtherTabs] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [showPassword, setShowPassword] = useState<Record<string, boolean>>({});
  const [beautyFilter, setBeautyFilter] = useState<string>('all');
  const [shopsFilter, setShopsFilter] = useState<string>('all');
  const [hotelFilter, setHotelFilter] = useState<string>('all');
  const [servicesFilter, setServicesFilter] = useState<string>('all');
  const [autoRepairsFilter, setAutoRepairsFilter] = useState<string>('all');
  
  // Account management states
  const [editingAdminId, setEditingAdminId] = useState<string | null>(null);
  const [adminFormData, setAdminFormData] = useState({ email: '', password: '' });
  const [addingStaffToId, setAddingStaffToId] = useState<string | null>(null);
  const [staffFormData, setStaffFormData] = useState({ name: '', email: '', password: '', role: 'waiter', pin: '' });
  const [addingSupplierToId, setAddingSupplierToId] = useState<string | null>(null);
  const [editingSupplierId, setEditingSupplierId] = useState<string | null>(null);
  const [supplierFormData, setSupplierFormData] = useState({ name: '', email: '', phone: '', nif: '', address: '' });
  const [isUploading, setIsUploading] = useState(false);
  const [showBulkAdd, setShowBulkAdd] = useState(false);
  const [dashboardCategoryDetail, setDashboardCategoryDetail] = useState<string | null>(null);
  const [bulkText, setBulkText] = useState('');
  const [uploadProgress, setUploadProgress] = useState({ current: 0, total: 0, label: '' });
  const [isSaving, setIsSaving] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [islandFilter, setIslandFilter] = useState<string>('all');
  const [cuisineFilter, setCuisineFilter] = useState<string>('all');
  const [visibleCount, setVisibleCount] = useState<number>(6);
  const [bulkIsland, setBulkIsland] = useState<string>('PDL');
  const [bulkSubcategory, setBulkSubcategory] = useState<string>('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isCompressing, setIsCompressing] = useState(false);
  const [compressionProgress, setCompressionProgress] = useState({ current: 0, total: 0 });
  const [compressionLabel, setCompressionLabel] = useState('');
  const [syncLogs, setSyncLogs] = useState<string[]>([]);
  const [showSyncSelector, setShowSyncSelector] = useState(false);
  const [showSyncSuccess, setShowSyncSuccess] = useState(false);
  const [syncSelection, setSyncSelection] = useState<string[]>([]);

  // States for "Importar com IA"
  const [showAiImportModal, setShowAiImportModal] = useState(false);
  const [aiStep, setAiStep] = useState<1 | 2 | 3 | 'preview' | 'loading'>(1);
  const [aiMessages, setAiMessages] = useState<Array<{ sender: 'ia' | 'user', text: string, options?: string[] }>>([
    { sender: 'ia', text: 'Olá! Sou o seu assistente de Inteligência Artificial para importação de dados. Que categoria pretende preencher?', options: ['Restaurantes', 'Alojamentos', 'Lojas de Animais', 'Cabeleireiros', 'Barbeiros', 'Lojas Locais', 'Trilhos', 'Eventos', 'Táxis', 'Autocarros', 'Farmácias', 'Municípios', 'Juntas de Freguesia'] }
  ]);
  const [aiInputValue, setAiInputValue] = useState('');
  const [aiSelectedCategory, setAiSelectedCategory] = useState('');
  const [aiSelectedSubcategory, setAiSelectedSubcategory] = useState('');
  const [aiSelectedIsland, setAiSelectedIsland] = useState('');
  const [aiQuantity, setAiQuantity] = useState<number | 'all'>(10);
  const [aiGeneratedItems, setAiGeneratedItems] = useState<any[]>([]);
  const [aiSelectedDraftIds, setAiSelectedDraftIds] = useState<string[]>([]);
  const [aiEditingItemIndex, setAiEditingItemIndex] = useState<number | null>(null);
  const [aiIsLoading, setAiIsLoading] = useState(false);

  const parseQuantity = (text: string): number | 'all' => {
    const normalized = text.toLowerCase().trim();
    if (normalized.includes('todo') || normalized.includes('todos') || normalized === 'all') {
      return 'all';
    }
    const match = normalized.match(/\b\d+\b/);
    if (match) {
      return parseInt(match[0], 10);
    }
    return 10; // Default if not found
  };

  const generateAiMockData = (category: string, island: string, qty: number | 'all'): any[] => {
    const targetQty = qty === 'all' ? 12 : qty;
    const list: any[] = [];
    const islandCode = islandMapping[island] || island || 'PDL';
    const islandName = island;

    const getLocality = (isl: string) => {
      switch(isl) {
        case 'São Miguel': return { concelho: 'Ponta Delgada', freguesia: 'Sete Cidades', morada: 'Rua do Selado, Sete Cidades' };
        case 'Terceira': return { concelho: 'Angra do Heroísmo', freguesia: 'Sé', morada: 'Rua da Sé, Angra do Heroísmo' };
        case 'Faial': return { concelho: 'Horta', freguesia: 'Angústias', morada: 'Rua do Porto, Horta' };
        case 'Pico': return { concelho: 'Madalena', freguesia: 'Madalena', morada: 'Avenida Machado Serpa, Madalena' };
        case 'São Jorge': return { concelho: 'Velas', freguesia: 'Velas', morada: 'Rua de Santa Catarina, Velas' };
        case 'Flores': return { concelho: 'Santa Cruz das Flores', freguesia: 'Santa Cruz', morada: 'Rua da Barra, Santa Cruz' };
        case 'Corvo': return { concelho: 'Vila do Corvo', freguesia: 'Vila do Corvo', morada: 'Caminho do Curral, Corvo' };
        case 'Graciosa': return { concelho: 'Santa Cruz da Graciosa', freguesia: 'Santa Cruz', morada: 'Largo da Matriz, Graciosa' };
        case 'Santa Maria': return { concelho: 'Vila do Porto', freguesia: 'Vila do Porto', morada: 'Rua de Frei Gonçalo Velho, Vila do Porto' };
        default: return { concelho: 'Ponta Delgada', freguesia: 'São Sebastião', morada: 'Avenida Marginal, Ponta Delgada' };
      }
    };

    const loc = getLocality(islandName);

    for (let i = 1; i <= targetQty; i++) {
      const id = `${category.substring(0,3).toUpperCase()}_AI_${Date.now()}_${i}`;
      let item: any = {
        id,
        island: islandCode,
        status: 'draft',
        isDraft: true,
      };

      if (category === 'Restaurantes') {
        item.name = `Restaurante ${islandName} Sabor ${i}`;
        item.cuisine = 'Regional Açoriana';
        item.rating = 4.5;
        item.reviews = 12 + i * 5;
        item.image = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500&auto=format&fit=crop';
        item.description = `Um excelente restaurante em ${islandName} com o melhor da cozinha regional e ingredientes frescos.`;
        item.phone = `+351 296 000 ${100 + i}`;
        item.address = `${loc.morada}, ${i}`;
        item.publicEmail = `sabor_${i}@azorestoyou.pt`;
        item.mapsUrl = `https://maps.google.com/?q=${item.name}`;
        item.adminEmail = `admin_rest_${i}@azorestoyou.pt`;
        item.adminPassword = `SenhaAI${i}!`;
        item.latitude = '37.7412';
        item.longitude = '-25.6756';
      } else if (category === 'Alojamentos') {
        item.name = `Alojamento ${islandName} Vista ${i}`;
        item.stars = (i % 2 === 0) ? 4 : 3;
        item.pricePerNight = 65 + i * 10;
        item.image = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500&auto=format&fit=crop';
        item.description = `Estadia premium ideal para as suas férias em ${islandName}. Conforto e natureza ao seu alcance.`;
        item.type = (i % 2 === 0) ? 'hotel' : 'al';
        item.email = `alojamento_${i}@azorestoyou.pt`;
        item.phone = `+351 296 111 ${200 + i}`;
        item.address = `${loc.morada}, Bairro ${i}`;
        item.mapsUrl = `https://maps.google.com/?q=${item.name}`;
        item.adminEmail = `admin_hotel_${i}@azorestoyou.pt`;
        item.adminPassword = `SenhaAI${i}!`;
      } else if (category === 'Trilhos') {
        item.title = `Trilho de ${islandName} - Rota ${i}`;
        item.type = 'trail';
        item.image = 'https://images.unsplash.com/photo-1501555088652-021faa106b9b?w=500&auto=format&fit=crop';
        item.description = `Percurso pedestre homologado em ${islandName}. Explore paisagens vulcânicas intocadas.`;
        item.distance = `${4 + i} km`;
        item.duration = `${1 + i}h 30m`;
        item.difficulty = (i % 3 === 0) ? 'Difícil' : (i % 2 === 0) ? 'Moderado' : 'Fácil';
        item.bookingPolicy = 'recommended';
        item.email = `trilhos_${i}@azorestoyou.pt`;
        item.phone = `+351 296 222 ${300 + i}`;
        item.address = `Ponto de Partida, ${loc.concelho}`;
      } else if (category === 'Lojas Locais') {
        item.name = `Bazar Tradicional ${islandName} ${i}`;
        item.image = 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=500&auto=format&fit=crop';
        item.description = `Produtos regionais, artesanato, queijos e vinhos da ilha de ${islandName}.`;
        item.phone = `+351 296 333 ${400 + i}`;
        item.address = `Rua Comercial, ${loc.concelho}`;
        item.adminEmail = `loja_${i}@azorestoyou.pt`;
        item.adminPassword = `SenhaAI${i}!`;
        item.businessType = 'shop';
      } else if (category === 'Cabeleireiros') {
        item.name = `Salão Hair & Beauty ${islandName} ${i}`;
        item.image = 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=500&auto=format&fit=crop';
        item.description = `Serviços profissionais de cabeleireiro e estética na ilha de ${islandName}.`;
        item.phone = `+351 296 444 ${500 + i}`;
        item.address = `Avenida Central, ${loc.concelho}`;
        item.adminEmail = `cabeleireiro_${i}@azorestoyou.pt`;
        item.adminPassword = `SenhaAI${i}!`;
        item.businessType = 'beauty';
        item.subcategory = 'hairdresser';
      } else if (category === 'Barbeiros') {
        item.name = `Barbearia Antiga de ${islandName} ${i}`;
        item.image = 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=500&auto=format&fit=crop';
        item.description = `Corte clássico, barba à navalha e ambiente acolhedor.`;
        item.phone = `+351 296 555 ${600 + i}`;
        item.address = `Rua Direita, ${loc.concelho}`;
        item.adminEmail = `barbeiro_${i}@azorestoyou.pt`;
        item.adminPassword = `SenhaAI${i}!`;
        item.businessType = 'beauty';
        item.subcategory = 'barber';
      } else if (category === 'Lojas de Animais') {
        item.name = `Mundo Animal ${islandName} ${i}`;
        item.image = 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=500&auto=format&fit=crop';
        item.description = `Rações, acessórios, banhos, tosquias e cuidados especializados para o seu pet.`;
        item.phone = `+351 296 666 ${700 + i}`;
        item.address = `Zona Industrial, ${loc.concelho}`;
        item.adminEmail = `animal_${i}@azorestoyou.pt`;
        item.adminPassword = `SenhaAI${i}!`;
        item.businessType = 'animals';
      } else if (category === 'Eventos') {
        item.name = `Festival Cultural ${islandName} ${i}`;
        item.image = 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&auto=format&fit=crop';
        item.description = `Celebrações, concertos e atividades recreativas abertas ao público em ${islandName}.`;
        item.phone = `+351 296 777 ${800 + i}`;
        item.address = `Praça Municipal, ${loc.concelho}`;
        item.adminEmail = `evento_${i}@azorestoyou.pt`;
        item.adminPassword = `SenhaAI${i}!`;
        item.businessType = 'events';
      } else if (category === 'Táxis') {
        item.name = `Táxi Privado ${islandName} - Condutor ${i}`;
        item.image = 'https://images.unsplash.com/photo-1492664738988-2be3d18e7e00?w=500&auto=format&fit=crop';
        item.description = `Transferes de aeroporto e visitas guiadas personalizadas por toda a ilha.`;
        item.phone = `+351 911 000 ${300 + i}`;
        item.address = `Ponto de Táxis Central, ${loc.concelho}`;
        item.adminEmail = `taxi_${i}@azorestoyou.pt`;
        item.adminPassword = `SenhaAI${i}!`;
        item.businessType = 'services';
        item.subcategory = 'taxi';
      } else if (category === 'Autocarros') {
        item.company = `Autocarro Expresso ${islandName} Linha ${i}`;
        item.origin = loc.concelho;
        item.destination = `Vila das Furnas ${i}`;
        item.times = [`08:0${i}`, `12:3${i}`, `17:4${i}`];
        item.price = 2.5 + i * 0.5;
        item.duration = `4${i}m`;
        item.island = islandCode;
      } else if (category === 'Farmácias') {
        item.name = `Farmácia da Vila ${islandName} ${i}`;
        item.image = 'https://images.unsplash.com/photo-1586015555751-63bb77f4322a?w=500&auto=format&fit=crop';
        item.description = `Serviço de saúde e medicamentos com atendimento personalizado 24 horas.`;
        item.phone = `+351 296 888 ${900 + i}`;
        item.address = `Rua da Saúde, ${loc.concelho}`;
        item.adminEmail = `farmacia_${i}@azorestoyou.pt`;
        item.adminPassword = `SenhaAI${i}!`;
        item.businessType = 'services';
        item.subcategory = 'pharmacy';
      } else if (category === 'Municípios') {
        item.name = `Câmara Municipal de ${islandName} ${i}`;
        item.image = 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=500&auto=format&fit=crop';
        item.description = `Serviços públicos e administrativos oficiais do concelho de ${loc.concelho}.`;
        item.phone = `+351 296 999 ${100 + i}`;
        item.address = `Largo do Município, ${loc.concelho}`;
        item.adminEmail = `municipio_${i}@azorestoyou.pt`;
        item.adminPassword = `SenhaAI${i}!`;
        item.businessType = 'municipal';
      } else if (category === 'Juntas de Freguesia') {
        item.name = `Junta de Freguesia de ${loc.freguesia} ${i}`;
        item.image = 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=500&auto=format&fit=crop';
        item.description = `Apoio local e serviços à comunidade na freguesia de ${loc.freguesia}.`;
        item.phone = `+351 296 999 ${200 + i}`;
        item.address = `Rua da Freguesia, ${loc.freguesia}`;
        item.adminEmail = `junta_${i}@azorestoyou.pt`;
        item.adminPassword = `SenhaAI${i}!`;
        item.businessType = 'municipal';
        item.subcategory = 'junta';
      }

      list.push(item);
    }
    return list;
  };

  const detectDashboardContext = () => {
    let island = 'São Miguel';
    if (islandFilter !== 'all') {
      const found = Object.entries(islandMapping).find(([name, code]) => code === islandFilter || name === islandFilter);
      if (found) island = found[0];
    }

    let category = 'Restaurantes';
    let subcategory = '';

    switch (activeTab) {
      case 'restaurants':
        category = 'Restaurantes';
        subcategory = cuisineFilter !== 'all' ? cuisineFilter : '';
        break;
      case 'hotels':
        category = 'Alojamentos';
        subcategory = hotelFilter !== 'all' ? hotelFilter : '';
        break;
      case 'animals':
        category = 'Lojas de Animais';
        break;
      case 'beauty':
        category = 'Cabeleireiros';
        subcategory = beautyFilter !== 'all' ? beautyFilter : '';
        if (subcategory.toLowerCase().includes('barbeiro')) {
          category = 'Barbeiros';
        }
        break;
      case 'shops':
        category = 'Lojas Locais';
        subcategory = shopsFilter !== 'all' ? shopsFilter : '';
        break;
      case 'trails':
        category = 'Trilhos';
        break;
      case 'events':
        category = 'Eventos';
        break;
      case 'services':
        subcategory = servicesFilter !== 'all' ? servicesFilter : '';
        if (subcategory.toLowerCase().includes('táxi') || subcategory.toLowerCase().includes('taxi')) {
          category = 'Táxis';
        } else {
          category = 'Farmácias';
        }
        break;
      case 'buses':
        category = 'Autocarros';
        break;
      case 'municipal':
        category = 'Municípios';
        break;
    }

    return { category, subcategory, island };
  };

  const handleSendAiMessage = async (userText: string) => {
    if (!userText.trim()) return;

    const newMessages = [...aiMessages, { sender: 'user' as const, text: userText }];
    setAiMessages(newMessages);
    setAiInputValue('');

    // Wait a brief moment to let UI render the user message
    await new Promise(resolve => setTimeout(resolve, 300));

    if (aiStep === 1) {
      // Parse quantity selected by the admin
      let qty: number | 'all' = 10;
      if (userText.includes('5')) qty = 5;
      else if (userText.includes('10')) qty = 10;
      else if (userText.includes('20')) qty = 20;
      else if (userText.toLowerCase().includes('todo') || userText.toLowerCase().includes('todos')) qty = 'all';
      else {
        qty = parseQuantity(userText);
      }

      // Hard safety limit check (max 100)
      if (qty === 'all') qty = 100;
      else qty = Math.min(qty, 100);

      setAiQuantity(qty);
      setAiStep(2);
      setAiMessages(prev => [
        ...prev,
        {
          sender: 'ia' as const,
          text: `Quer pesquisar em todas as ilhas ou manter o filtro atual para "${aiSelectedIsland}"?`,
          options: [`Manter filtro atual (${aiSelectedIsland})`, 'Pesquisar em todas as ilhas']
        }
      ]);
    } else if (aiStep === 2) {
      const isAllIslands = userText.toLowerCase().includes('todas');
      const queryIsland = isAllIslands ? 'all' : aiSelectedIsland;
      
      setAiIsLoading(true);
      setAiStep('loading');

      const currentCategory = aiSelectedCategory || 'Restaurantes';
      const qty = aiQuantity;
      const subcat = aiSelectedSubcategory;

      const catMap: Record<string, string> = {
        'Restaurantes': 'restaurants',
        'Alojamentos': 'hotels',
        'Lojas de Animais': 'animals',
        'Cabeleireiros': 'beauty',
        'Barbeiros': 'beauty',
        'Lojas Locais': 'shops',
        'Trilhos': 'activities',
        'Eventos': 'events',
        'Táxis': 'services',
        'Autocarros': 'buses',
        'Farmácias': 'services',
        'Municípios': 'municipal',
        'Juntas de Freguesia': 'municipal'
      };
      const targetTab = catMap[currentCategory] || 'restaurants';
      let existingList: any[] = [];
      switch (targetTab) {
        case 'restaurants': existingList = restaurants; break;
        case 'shops': existingList = shops; break;
        case 'beauty': existingList = beauty; break;
        case 'services': existingList = services; break;
        case 'auto_repairs': existingList = autoRepairs; break;
        case 'auto_electronics': existingList = autoElectronics; break;
        case 'used_market': existingList = usedMarket; break;
        case 'animals': existingList = animals; break;
        case 'real_estate': existingList = realEstate; break;
        case 'gyms': existingList = gyms; break;
        case 'stands': existingList = stands; break;
        case 'offices': existingList = offices; break;
        case 'it_services': existingList = itServices; break;
        case 'perfumes': existingList = perfumes; break;
        case 'bars': existingList = bars; break;
        case 'events': existingList = events; break;
        case 'municipal': existingList = municipal; break;
        case 'activities': existingList = activities; break;
        case 'flights': existingList = flights; break;
        case 'hotels': existingList = hotels; break;
        case 'cars': existingList = cars; break;
        case 'buses': existingList = busSchedules; break;
      }

      try {
        const limit = qty === 'all' ? 100 : qty;
        let results: any[] = [];

        // Determine islands to query
        const islandsToQuery = queryIsland === 'all' 
          ? ['São Miguel', 'Terceira', 'Faial', 'Pico', 'São Jorge', 'Flores', 'Corvo', 'Graciosa', 'Santa Maria'] 
          : [queryIsland];

        // Fetch from Wikidata for POIs/tourism, OSM for others
        const isWikidata = currentCategory === 'Pontos Turísticos';

        if (isWikidata) {
          for (const isl of islandsToQuery) {
            if (results.length >= limit) break;
            try {
              const res = await searchWikidataTourism({ island: isl, limit: limit - results.length });
              results = [...results, ...res];
            } catch (e) {
              console.error(`Wikidata fetch failed for island ${isl}`, e);
            }
          }
        } else {
          for (const isl of islandsToQuery) {
            if (results.length >= limit) break;
            try {
              const res = await searchOpenStreetMapPlaces({
                category: currentCategory,
                subcategory: subcat,
                island: isl,
                limit: limit - results.length
              });
              results = [...results, ...res];
            } catch (e) {
              console.error(`OSM fetch failed for island ${isl}`, e);
            }
          }
        }

        // Enforce safety limit
        results = results.slice(0, 100);

        // Deduplicate and process results
        const processedResults = results.map(item => {
          const isDuplicate = checkDuplicates(item, existingList);
          return {
            ...item,
            isDuplicate
          };
        });

        setAiGeneratedItems(processedResults);
        
        // Select only non-duplicates by default
        const defaultSelected = processedResults.filter(r => !r.isDuplicate).map(r => r.id);
        setAiSelectedDraftIds(defaultSelected);
        
        setAiStep('preview');
        setAiMessages(prev => [
          ...prev,
          {
            sender: 'ia' as const,
            text: `Encontrados ${processedResults.length} resultados de ${isWikidata ? 'Wikidata' : 'OpenStreetMap'}. Detectados ${processedResults.filter(r => r.isDuplicate).length} possíveis duplicados (desmarcados por defeito). Reveja a tabela e edite se necessário antes de importar.`
          }
        ]);
      } catch (err: any) {
        console.error("AI data import failed:", err);
        setAiStep(1);
        setAiMessages(prev => [
          ...prev,
          {
            sender: 'ia' as const,
            text: `Erro ao obter dados: ${err.message || 'Todos os servidores públicos falharam.'} Por favor, tente novamente.`
          }
        ]);
      } finally {
        setAiIsLoading(false);
      }
    }
  };

  const [modifiedCategories, setModifiedCategories] = useState<Set<string>>(new Set());

  const [showAppSliderSettings, setShowAppSliderSettings] = useState(false);
  const [sliderDeviceTab, setSliderDeviceTab] = useState<'desktop' | 'mobile'>('desktop');
  const [desktopSlides, setDesktopSlides] = useState<any[]>([]);
  const [mobileSlides, setMobileSlides] = useState<any[]>([]);

  const loadAppSlides = async () => {
    try {
      const resD = await fetch(`${API_BASE_URL}/api/slider?device=desktop`);
      const dataD = await resD.json();
      setDesktopSlides(dataD || []);

      const resM = await fetch(`${API_BASE_URL}/api/slider?device=mobile`);
      const dataM = await resM.json();
      setMobileSlides(dataM || []);
    } catch (e) {
      console.error("Erro ao carregar sliders:", e);
    }
  };

  useEffect(() => {
    if (showAppSliderSettings) {
      loadAppSlides();
    }
  }, [showAppSliderSettings]);

  const handleSliderImageUpload = async (files: FileList | File[] | File, device: 'desktop' | 'mobile', index?: number) => {
    let fileArray: File[] = [];
    if (files instanceof FileList) {
      fileArray = Array.from(files);
    } else if (Array.isArray(files)) {
      fileArray = files;
    } else {
      fileArray = [files];
    }
    if (fileArray.length === 0) return;

    setIsUploading(true);
    try {
      for (const file of fileArray) {
        const formData = new FormData();
        formData.append('image', file);
        
        const response = await fetch(`${API_BASE_URL}/api/upload`, {
          method: 'POST',
          body: formData
        });
        
        if (!response.ok) throw new Error('Falha no upload para o servidor');
        const data = await response.json();
        const finalUrl = data.url;

        if (device === 'desktop') {
          if (index !== undefined) {
            setDesktopSlides(prev => {
              const copy = [...prev];
              copy[index] = { ...copy[index], image: finalUrl };
              return copy;
            });
          } else {
            setDesktopSlides(prev => [
              ...prev,
              {
                id: `slide_desktop_${Date.now()}`,
                image: finalUrl,
                subtitle: 'Experiência Açores',
                title: 'Novo Slide',
                description: 'Insira a descrição do slide.',
                buttonText: 'Explorar agora'
              }
            ]);
          }
        } else {
          if (index !== undefined) {
            setMobileSlides(prev => {
              const copy = [...prev];
              copy[index] = { ...copy[index], image: finalUrl };
              return copy;
            });
          } else {
            setMobileSlides(prev => [
              ...prev,
              {
                id: `slide_mobile_${Date.now()}`,
                image: finalUrl,
                subtitle: 'Experiência Açores',
                title: 'Novo Slide',
                description: 'Insira a descrição do slide.',
                buttonText: 'Explorar agora'
              }
            ]);
          }
        }
      }
    } catch (e) {
      alert("Erro no upload de imagem do slider: " + e.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSaveSliderSettings = async (device: 'desktop' | 'mobile') => {
    setIsSaving(true);
    try {
      const slides = device === 'desktop' ? desktopSlides : mobileSlides;
      const res = await fetch(`${API_BASE_URL}/api/slider?device=${device}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(slides)
      });
      if (!res.ok) throw new Error('Falha ao salvar no servidor');
      await res.json();
      alert(`Configurações do slider ${device === 'desktop' ? 'Desktop' : 'Mobile'} salvas com sucesso!`);
      loadAppSlides();
    } catch (e) {
      alert("Erro ao salvar slider: " + e.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleEmergencyRestore = async () => {
    if (!confirm('🚨 ATENÇÃO: Isto vai substituir os dados do Atlas pelos dados originais do sistema. Continuar?')) return;
    
    setIsSyncing(true);
    addLog('🚒 A iniciar restauro de emergência...');
    
    try {
        // Garantir que acedemos corretamente ao objeto DATA
        const allData = (constants as any).DATA;
        if (!allData) throw new Error('Não foi possível carregar os dados das constantes.');
        
        const data = allData[lang] || allData['pt'];
        if (!data) throw new Error(`Dados para a língua ${lang} não encontrados.`);

        const categories = [
            { key: 'restaurants', label: 'Restaurantes', items: data.restaurants || [] },
            { key: 'hotels', label: 'Alojamentos', items: data.hotels || [] },
            { key: 'activities', label: 'Atividades', items: data.activities || [] },
            { key: 'cars', label: 'Rentcar', items: data.cars || [] },
            { key: 'shops', label: 'Lojas', items: data.shops || [] },
            { key: 'beauty', label: 'Beleza', items: data.beauty || [] },
            { key: 'services', label: 'Serviços', items: data.services || [] },
            { key: 'auto_repairs', label: 'Reparação Auto', items: data.auto_repair || [] },
            { key: 'auto_electronics', label: 'Eletrónica Auto', items: data.auto_electronics || [] },
            { key: 'used_market', label: 'Mercado Usados', items: data.used_market || [] },
            { key: 'animals', label: 'Animais', items: data.animals || [] },
            { key: 'real_estate', label: 'Imobiliária', items: data.real_estate || [] },
            { key: 'gyms', label: 'Ginásios', items: data.gyms || [] },
            { key: 'stands', label: 'Stands', items: data.stands || [] },
            { key: 'offices', label: 'Escritórios', items: data.offices || [] },
            { key: 'it_services', label: 'Informática', items: data.it_services || [] },
            { key: 'perfumes', label: 'Perfumaria', items: data.perfumes || [] },
            { key: 'bars', label: 'Bares/Noite', items: data.bars || [] },
            { key: 'events', label: 'Eventos', items: data.events || [] },
            { key: 'municipal', label: 'Serviços Municipais', items: data.municipal || [] }
        ];

        for (const cat of categories) {
            addLog(`📤 A enviar ${cat.label}...`);
            const res = await fetch(`${API_BASE_URL}/api/${cat.key}/bulk`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(cat.items)
            });
            if (!res.ok) throw new Error(`Falha em ${cat.label}`);
        }
        
        addLog('✨ Restauro concluído! A atualizar página...');
        alert('✅ Dados restaurados com sucesso! A página vai recarregar.');
        window.location.reload();
    } catch (err: any) {
        addLog(`❌ Erro no restauro: ${err.message}`);
        alert('Erro ao restaurar: ' + err.message);
    } finally {
        setIsSyncing(false);
    }
  };

  useEffect(() => {
    setSelectedIds([]);
    // Se mudarmos para a tab de trilhos, mostramos logo tudo para não parecer "bloqueado"
    if (activeTab === 'trails') {
      setVisibleCount(100);
    } else {
      setVisibleCount(6);
    }
  }, [activeTab, islandFilter, beautyFilter, shopsFilter, hotelFilter, servicesFilter, autoRepairsFilter]);

  const togglePassword = (id: string) => {
    setShowPassword(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleSelection = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const toggleSelectAll = () => {
    const currentItems = getListItems();
    const currentIds = currentItems.map(i => i.id);
    if (currentIds.length === 0) return;
    
    const allSelected = currentIds.every(id => selectedIds.includes(id));
    
    if (allSelected) {
      setSelectedIds(prev => prev.filter(id => !currentIds.includes(id)));
    } else {
      setSelectedIds(prev => Array.from(new Set([...prev, ...currentIds])));
    }
  };

  const handleBulkDelete = () => {
    if (selectedIds.length === 0) return;
    if (!window.confirm(`Deseja apagar os ${selectedIds.length} itens selecionados?`)) return;

    const filterList = (list: any[]) => list.filter(item => !selectedIds.includes(item.id));

    switch (activeTab) {
      case 'restaurants': onUpdateRestaurants(filterList(restaurants)); break;
      case 'shops': onUpdateShops(filterList(shops)); break;
      case 'beauty': onUpdateBeauty(filterList(beauty)); break;
      case 'services': onUpdateServices(filterList(services)); break;
      case 'auto_repairs': onUpdateAutoRepairs(filterList(autoRepairs)); break;
      case 'auto_electronics': onUpdateAutoElectronics(filterList(autoElectronics)); break;
      case 'used_market': onUpdateUsedMarket(filterList(usedMarket)); break;
      case 'animals': onUpdateAnimals(filterList(animals)); break;
      case 'real_estate': onUpdateRealEstate(filterList(realEstate)); break;
      case 'gyms': onUpdateGyms(filterList(gyms)); break;
      case 'stands': onUpdateStands(filterList(stands)); break;
      case 'offices': onUpdateOffices(filterList(offices)); break;
      case 'it_services': onUpdateITServices(filterList(itServices)); break;
      case 'perfumes': onUpdatePerfumes(filterList(perfumes)); break;
      case 'bars': onUpdateBars(filterList(bars)); break;
      case 'events': onUpdateEvents(filterList(events)); break;
      case 'municipal': onUpdateMunicipal(filterList(municipal)); break;
      case 'activities': 
      case 'trails':
      case 'poi': onUpdateActivities(filterList(activities)); break;
      case 'flights': onUpdateFlights(filterList(flights)); break;
      case 'hotels': onUpdateHotels(filterList(hotels)); break;
      case 'cars': onUpdateCars(filterList(cars)); break;
      case 'buses': onUpdateBusSchedules(filterList(busSchedules)); break;
      case 'marketplace': onUpdateMarketplaceAds(filterList(marketplaceAds)); break;
    }

    setSelectedIds([]);
    alert(`${selectedIds.length} itens removidos com sucesso!`);
  };

  const lang = language as Language;

  const t = (key: any) => getTranslation(lang, key);

  // -- ACCOUNT MANAGEMENT HANDLERS --
  const handleUpdateAdmin = (restId: string) => {
    const findAndReplace = (list: any[]) => list.map(r => r.id === restId ? { ...r, adminEmail: adminFormData.email, adminPassword: adminFormData.password } : r);
    
    // Logic: Identify which list the business belongs to and update only that list
    if (restaurants.some(r => r.id === restId)) {
      onUpdateRestaurants(findAndReplace(restaurants));
    } else if (shops.some(s => s.id === restId)) {
      onUpdateShops(findAndReplace(shops));
    } else if (beauty.some(b => b.id === restId)) {
      onUpdateBeauty(findAndReplace(beauty));
    }
    
    setEditingAdminId(null);
    alert('Dados de administrador atualizados com sucesso!');
  };

  const handleAddStaff = (restId: string) => {
    const newStaff = {
      id: `STF_${Date.now()}`,
      ...staffFormData
    };
    const findAndAdd = (list: any[]) => list.map(r => r.id === restId ? { ...r, staff: [...(r.staff || []), newStaff] } : r);
    if (restaurants.some(r => r.id === restId)) onUpdateRestaurants(findAndAdd(restaurants));
    else if (shops.some(s => s.id === restId)) onUpdateShops(findAndAdd(shops));
    else if (beauty.some(b => b.id === restId)) onUpdateBeauty(findAndAdd(beauty));
    setAddingStaffToId(null);
    setStaffFormData({ name: '', email: '', password: '', role: 'waiter', pin: '' });
    alert('Funcionário adicionado com sucesso!');
  };

  const handleRemoveStaff = (restId: string, staffId: string) => {
    if (!window.confirm('Remover este funcionário?')) return;
    const findAndRemove = (list: any[]) => list.map(r => r.id === restId ? { ...r, staff: (r.staff || []).filter((s: any) => s.id !== staffId) } : r);
    if (restaurants.some(r => r.id === restId)) onUpdateRestaurants(findAndRemove(restaurants));
    else if (shops.some(s => s.id === restId)) onUpdateShops(findAndRemove(shops));
    else if (beauty.some(b => b.id === restId)) onUpdateBeauty(findAndRemove(beauty));
  };
  
  const handleAddSupplier = (restId: string, data: any) => {
    const newSup = {
      id: `SUP_${Date.now()}`,
      ...data,
      password: Math.random().toString(36).slice(-8)
    };
    const findAndAddSup = (list: any[]) => list.map(r => r.id === restId ? { ...r, suppliers: [...(r.suppliers || []), newSup] } : r);
    if (restaurants.some(r => r.id === restId)) onUpdateRestaurants(findAndAddSup(restaurants));
    else if (shops.some(s => s.id === restId)) onUpdateShops(findAndAddSup(shops));
    else if (beauty.some(b => b.id === restId)) onUpdateBeauty(findAndAddSup(beauty));
    setAddingSupplierToId(null);
    alert('Fornecedor adicionado com sucesso!');
  };

  const handleUpdateSupplier = (restId: string, supId: string, data: any) => {
    const findAndUpdateSup = (list: any[]) => list.map(r => r.id === restId ? { ...r, suppliers: r.suppliers?.map(s => s.id === supId ? { ...s, ...data } : s) } : r);
    if (restaurants.some(r => r.id === restId)) onUpdateRestaurants(findAndUpdateSup(restaurants));
    else if (shops.some(s => s.id === restId)) onUpdateShops(findAndUpdateSup(shops));
    else if (beauty.some(b => b.id === restId)) onUpdateBeauty(findAndUpdateSup(beauty));
    setEditingSupplierId(null);
    alert('Fornecedor atualizado com sucesso!');
  };

  const handleRemoveSupplier = (restId: string, supId: string) => {
    if (!window.confirm('Remover este fornecedor?')) return;
    const findAndRemoveSup = (list: any[]) => list.map(r => r.id === restId ? { ...r, suppliers: (r.suppliers || []).filter((s: any) => s.id !== supId) } : r);
    if (restaurants.some(r => r.id === restId)) onUpdateRestaurants(findAndRemoveSup(restaurants));
    else if (shops.some(s => s.id === restId)) onUpdateShops(findAndRemoveSup(shops));
    else if (beauty.some(b => b.id === restId)) onUpdateBeauty(findAndRemoveSup(beauty));
  };

  // -- CRUD HANDLERS --

  const handleDelete = (id: string) => {
    if (!window.confirm('Tem a certeza que deseja apagar este item?')) return;
    
    switch (activeTab) {
      case 'restaurants': onUpdateRestaurants(restaurants.filter(r => r.id !== id)); break;
      case 'shops': onUpdateShops(shops.filter(s => s.id !== id)); break;
      case 'beauty': onUpdateBeauty(beauty.filter(b => b.id !== id)); break;
      case 'services': onUpdateServices(services.filter(s => s.id !== id)); break;
      case 'auto_repairs': onUpdateAutoRepairs(autoRepairs.filter(a => a.id !== id)); break;
      case 'auto_electronics': onUpdateAutoElectronics(autoElectronics.filter(a => a.id !== id)); break;
      case 'used_market': onUpdateUsedMarket(usedMarket.filter(u => u.id !== id)); break;
      case 'animals': onUpdateAnimals(animals.filter(a => a.id !== id)); break;
      case 'real_estate': onUpdateRealEstate(realEstate.filter(r => r.id !== id)); break;
      case 'gyms': onUpdateGyms(gyms.filter(g => g.id !== id)); break;
      case 'stands': onUpdateStands(stands.filter(s => s.id !== id)); break;
      case 'offices': onUpdateOffices(offices.filter(o => o.id !== id)); break;
      case 'it_services': onUpdateITServices(itServices.filter(i => i.id !== id)); break;
      case 'perfumes': onUpdatePerfumes(perfumes.filter(p => p.id !== id)); break;
      case 'bars': onUpdateBars(bars.filter(b => b.id !== id)); break;
      case 'events': onUpdateEvents(events.filter(e => e.id !== id)); break;
      case 'municipal': onUpdateMunicipal(municipal.filter(m => m.id !== id)); break;
      case 'activities':
      case 'trails':
      case 'poi': onUpdateActivities(activities.filter(a => a.id !== id)); break;
      case 'flights': onUpdateFlights(flights.filter(f => f.id !== id)); break;
      case 'hotels': onUpdateHotels(hotels.filter(h => h.id !== id)); break;
      case 'cars': onUpdateCars(cars.filter(c => c.id !== id)); break;
      case 'buses': onUpdateBusSchedules(busSchedules.filter(b => b.id !== id)); break;
      case 'marketplace': onUpdateMarketplaceAds(marketplaceAds.filter(ad => ad.id !== id)); break;
    }
    setModifiedCategories(prev => new Set(prev).add(activeTab));
  };

  const smartParseLine = (line: string) => {
    let name = line;
    let email = '';
    let contact = '';
    let address = '';

    // Extract Email
    const emailMatch = line.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
    if (emailMatch) {
      email = emailMatch[0];
      name = name.replace(email, '').trim();
    }

    // Extract Phone (PT formats and international)
    const phoneMatch = line.match(/(\+\d{1,3}[-.\s]?)?(\d{9}|\d{3}[-.\s]?\d{3}[-.\s]?\d{3})/);
    if (phoneMatch) {
      contact = phoneMatch[0];
      name = name.replace(contact, '').trim();
    }

    // Extract Address using delimiters or keywords
    const parts = name.split(/[|;]/).map(p => p.trim());
    if (parts.length > 1) {
      name = parts[0];
      address = parts[1];
    } else {
      const addressKeywords = ['Rua', 'Avenida', 'Av.', 'Largo', 'Estrada', 'Caminho', 'Urbanização', 'R.', 'Travessa', 'Acesso'];
      const lowerName = name.toLowerCase();
      let foundIndex = -1;
      for (const kw of addressKeywords) {
        const idx = lowerName.indexOf(kw.toLowerCase());
        if (idx !== -1 && (foundIndex === -1 || idx < foundIndex)) {
          foundIndex = idx;
        }
      }
      if (foundIndex !== -1) {
        address = name.substring(foundIndex).trim();
        name = name.substring(0, foundIndex).replace(/[,-]$/, '').trim();
      }
    }

    // Final cleanup of Name
    name = name.replace(/^[-|;,\s]+|[-|;,\s]+$/g, '').trim();

    return { name, email, contact, address };
  };

  const handleBulkAdd = async () => {
    if (!bulkText.trim() || isSaving) return;
    setIsSaving(true);
    const timestamp = Date.now();

    // Split into blocks separated by blank lines
    // Each block = one business entry
    const blocks = bulkText
      .split(/\n\s*\n/) // split on blank lines
      .map(block => block.trim())
      .filter(block => block.length > 0);

    const newItems = blocks.map((block, idx) => {
      const lines = block.split('\n').map(l => l.trim()).filter(l => l.length > 0);
      
      // First line = name of the business
      const nameRaw = lines[0] || 'Sem Nome';
      
      // Remaining lines = contact/address info - merge and parse together
      const contactBlock = lines.slice(1).join(' ');
      
      // Parse contact block for email, phone, address
      const { email, contact, address } = smartParseLine(contactBlock);
      
      // Clean the name (remove any accidental contact info from name line too)
      const { name: cleanName } = smartParseLine(nameRaw);
      const name = cleanName || nameRaw;

      const id = `${activeTab.substring(0,3).toUpperCase()}${timestamp}${idx}`;
      
      switch (activeTab) {
        case 'activities':
        case 'trails':
        case 'poi':
          const defaultType = activeTab === 'trails' ? 'trail' : activeTab === 'poi' ? 'poi' : 'activity';
          const isPaidDefault = defaultType === 'activity';
          return { 
            id, title: name, type: bulkSubcategory || defaultType, island: bulkIsland, 
            image: '', description: address || '', isPaid: isPaidDefault, price: isPaidDefault ? 10 : 0, mapUrl: '' 
          };
        case 'flights':
          return { id, airline: name, flightNumber: '---', origin: 'LIS', destination: bulkIsland, departureTime: '00:00', arrivalTime: '00:00', price: 0, status: 'A Horas', stops: 0, duration: '' };
        case 'hotels':
          return { id, name, island: bulkIsland, stars: 4, pricePerNight: 0, image: '', description: '', type: bulkSubcategory || 'hotel', mapUrl: '', email, phone: contact, address };
        case 'cars':
          return { 
            id, name, island: bulkIsland, address, email, contact, image: '', 
            description: '', adminEmail: '', adminPassword: '', cars: [] 
          };
        default:
          return { 
            id, name, island: bulkIsland, rating: 4.5, reviews: 0, image: '', description: '', 
            adminEmail: '', adminPassword: '', subcategory: bulkSubcategory, dishes: [], services: [], mapUrl: '',
            address, phone: contact, publicEmail: email
          };
      }
    });

    try {
      switch (activeTab) {
        case 'restaurants': await onUpdateRestaurants([...restaurants, ...newItems]); break;
        case 'shops': await onUpdateShops([...shops, ...newItems]); break;
        case 'beauty': await onUpdateBeauty([...beauty, ...newItems]); break;
        case 'services': await onUpdateServices([...services, ...newItems]); break;
        case 'auto_repairs': await onUpdateAutoRepairs([...autoRepairs, ...newItems]); break;
        case 'auto_electronics': await onUpdateAutoElectronics([...autoElectronics, ...newItems]); break;
        case 'used_market': await onUpdateUsedMarket([...usedMarket, ...newItems]); break;
        case 'animals': await onUpdateAnimals([...animals, ...newItems]); break;
        case 'real_estate': await onUpdateRealEstate([...realEstate, ...newItems]); break;
        case 'gyms': await onUpdateGyms([...gyms, ...newItems]); break;
        case 'stands': await onUpdateStands([...stands, ...newItems]); break;
        case 'offices': await onUpdateOffices([...offices, ...newItems]); break;
        case 'it_services': await onUpdateITServices([...itServices, ...newItems]); break;
        case 'perfumes': await onUpdatePerfumes([...perfumes, ...newItems]); break;
        case 'bars': await onUpdateBars([...bars, ...newItems]); break;
        case 'events': await onUpdateEvents([...events, ...newItems]); break;
        case 'municipal': await onUpdateMunicipal([...municipal, ...newItems]); break;
        case 'activities':
        case 'trails':
        case 'poi':
          await onUpdateActivities([...activities, ...newItems]); break;
        case 'flights': await onUpdateFlights([...flights, ...newItems]); break;
        case 'hotels': await onUpdateHotels([...hotels, ...newItems]); break;
        case 'cars': await onUpdateCars([...cars, ...newItems]); break;
        case 'buses': await onUpdateBusSchedules([...busSchedules, ...newItems]); break;
      }

      setBulkText('');
      setShowBulkAdd(false);
      setModifiedCategories(prev => new Set(prev).add(activeTab));
      alert(`✅ ${newItems.length} itens adicionados e guardados no servidor com sucesso!`);
    } catch (e) {
      alert('❌ Erro ao guardar lista em massa.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem || isSaving) return;
    setIsSaving(true);

    try {
      const updatedItem = { ...editingItem };
      
      // Helper to add or update item in local list (NO SERVER SYNC HERE)
      const updateLocal = (list: any[], setter: (l: any[]) => void) => {
        if (isAddingNew) {
          if (!updatedItem.id) updatedItem.id = `${activeTab.substring(0,3).toUpperCase()}${Date.now()}`;
          setter([...list, updatedItem]);
        } else {
          setter(list.map(item => item.id === updatedItem.id ? updatedItem : item));
        }
      };

      switch (activeTab) {
        case 'restaurants': updateLocal(restaurants, onUpdateRestaurants); break;
        case 'shops': updateLocal(shops, onUpdateShops); break;
        case 'beauty': updateLocal(beauty, onUpdateBeauty); break;
        case 'services': updateLocal(services, onUpdateServices); break;
        case 'auto_repairs': updateLocal(autoRepairs, onUpdateAutoRepairs); break;
        case 'auto_electronics': updateLocal(autoElectronics, onUpdateAutoElectronics); break;
        case 'used_market': updateLocal(usedMarket, onUpdateUsedMarket); break;
        case 'animals': updateLocal(animals, onUpdateAnimals); break;
        case 'real_estate': updateLocal(realEstate, onUpdateRealEstate); break;
        case 'gyms': updateLocal(gyms, onUpdateGyms); break;
        case 'stands': updateLocal(stands, onUpdateStands); break;
        case 'offices': updateLocal(offices, onUpdateOffices); break;
        case 'it_services': updateLocal(itServices, onUpdateITServices); break;
        case 'perfumes': updateLocal(perfumes, onUpdatePerfumes); break;
        case 'bars': updateLocal(bars, onUpdateBars); break;
        case 'events': updateLocal(events, onUpdateEvents); break;
        case 'municipal': updateLocal(municipal, onUpdateMunicipal); break;
        case 'activities': 
        case 'trails':
        case 'poi': updateLocal(activities, onUpdateActivities); break;
        case 'flights': updateLocal(flights, onUpdateFlights); break;
        case 'hotels': updateLocal(hotels, onUpdateHotels); break;
        case 'cars': updateLocal(cars, onUpdateCars); break;
        case 'buses': updateLocal(busSchedules, onUpdateBusSchedules); break;
        case 'marketplace':
          if (onUpdateMarketplaceCategories && marketplaceCategories) {
            updateLocal(marketplaceCategories, onUpdateMarketplaceCategories);
          }
          break;
      }

      setEditingItem(null);
      setIsAddingNew(false);
      setModifiedCategories(prev => new Set(prev).add(activeTab));
      alert('✅ Alterações guardadas localmente. Clique no botão verde para enviar para o servidor.');
    } catch (err: any) {
      alert('❌ Erro: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const compressImage = (base64Str: string, maxWidth = 800, quality = 0.4): Promise<string> => {
    return new Promise((resolve) => {
      if (!base64Str || !base64Str.startsWith('data:image')) {
        resolve(base64Str);
        return;
      }
      
      const timeout = setTimeout(() => resolve(base64Str), 10000);

      const img = new Image();
      img.src = base64Str;
      img.onload = () => {
        clearTimeout(timeout);
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        if (width > maxWidth) {
          height = (maxWidth / width) * height;
          width = maxWidth;
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        // FORCE WEBP FORMAT FOR MAXIMUM PERFORMANCE
        resolve(canvas.toDataURL('image/webp', quality));
      };
      img.onerror = () => {
        clearTimeout(timeout);
        resolve(base64Str);
      };
    });
  };

  const compressObjectImages = async (obj: any) => {
    if (!obj || typeof obj !== 'object') return obj;
    const newObj = Array.isArray(obj) ? [...obj] : { ...obj };

    for (const key in newObj) {
      const value = newObj[key];
      if (typeof value === 'string' && value.startsWith('data:image')) {
        newObj[key] = await compressImage(value);
      } else if (typeof value === 'object' && value !== null) {
        newObj[key] = await compressObjectImages(value);
      }
    }
    return newObj;
  };

  const addLog = (msg: string) => {
    setSyncLogs(prev => [msg, ...prev].slice(0, 50));
    console.log(msg);
  };

  // ── ADMIN LIVE CLOCK ──
  const [adminNow, setAdminNow] = useState(new Date());
  useEffect(() => {
    const clockTick = setInterval(() => setAdminNow(new Date()), 1000);
    return () => clearInterval(clockTick);
  }, []);
  const adminTimeStr = adminNow.toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const adminDateStr = adminNow.toLocaleDateString('pt-PT', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const adminDateCapital = adminDateStr.charAt(0).toUpperCase() + adminDateStr.slice(1);
  const adminHours = adminNow.getHours();
  const adminGreeting = adminHours < 12 ? 'Bom Dia' : adminHours < 19 ? 'Boa Tarde' : 'Boa Noite';
  const adminGreetEmoji = adminHours < 12 ? '☀️' : adminHours < 19 ? '🌤️' : '🌙';

  const handleSyncAndCompress = async (forceSelectedOnly: boolean = false) => {
    if (!onFullSync) return;
    
    // Se não for modo forçado e não houver categorias selecionadas, avisar
    if (!forceSelectedOnly && syncSelection.length === 0) {
      alert('Por favor, selecione pelo menos uma categoria para publicar.');
      return;
    }

    setIsCompressing(true);
    setShowSyncSelector(false); // Close selector when starting
    setSyncLogs([]);
    addLog(forceSelectedOnly ? '🎯 A iniciar sincronização CIRÚRGICA (apenas selecionados)...' : '🚀 A iniciar processo de sincronização seletiva...');
    
    const allLists = [
      { data: restaurants, label: 'restaurants', id: 'restaurants', title: 'Restaurantes' },
      { data: shops, label: 'shops', id: 'shops', title: 'Lojas' },
      { data: beauty, label: 'beauty', id: 'beauty', title: 'Beleza' },
      { data: hotels, label: 'hotels', id: 'hotels', title: 'Alojamentos' },
      { data: cars, label: 'cars', id: 'cars', title: 'Rentcar' },
      { data: activities.filter(a => a.type === 'activity' || a.type === 'culture'), label: 'activities', id: 'activities', title: 'Atividades' },
      { data: activities.filter(a => a.type === 'trail'), label: 'activities', id: 'trails', title: 'Trilhos' },
      { data: services, label: 'services', id: 'services', title: 'Serviços' },
      { data: autoRepairs, label: 'auto_repairs', id: 'auto_repairs', title: 'Reparação Auto' },
      { data: autoElectronics, label: 'auto_electronics', id: 'auto_electronics', title: 'Eletrónica Auto' },
      { data: usedMarket, label: 'used_market', id: 'used_market', title: 'Mercado Usados' },
      { data: animals, label: 'animals', id: 'animals', title: 'Animais' },
      { data: realEstate, label: 'real_estate', id: 'real_estate', title: 'Imobiliária' },
      { data: gyms, label: 'gyms', id: 'gyms', title: 'Ginásios' },
      { data: activities.filter(a => a.type === 'poi' || a.type === 'landscape'), label: 'activities', id: 'poi', title: 'Pontos Turísticos' },
      { data: stands, label: 'stands', id: 'stands', title: 'Stands' },
      { data: offices, label: 'offices', id: 'offices', title: 'Escritórios' },
      { data: itServices, label: 'it_services', id: 'it_services', title: 'Informática' },
      { data: perfumes, label: 'perfumes', id: 'perfumes', title: 'Perfumaria' },
      { data: bars, label: 'bars', id: 'bars', title: 'Bares/Noite' },
      { data: events, label: 'events', id: 'events', title: 'Eventos' },
      { data: municipal, label: 'municipal', id: 'municipal', title: 'Serviços Municipais' },
      { data: flights, label: 'flights', id: 'flights', title: 'Voos' },
      { data: busSchedules, label: 'bus-schedules', id: 'bus-schedules', title: 'Autocarros' },
      { data: marketplaceCategories || [], label: 'marketplace_categories', id: 'marketplace', title: 'Marketplace (Categorias)' }
    ];

    // Filter based on user selection or force selective items
    let lists = [];
    if (forceSelectedOnly && selectedIds.length > 0) {
      allLists.forEach(l => {
        const itemsInSelection = l.data.filter(item => selectedIds.includes(item.id));
        if (itemsInSelection.length > 0) {
          lists.push({ ...l, data: itemsInSelection });
        }
      });
    } else {
      lists = allLists.filter(l => syncSelection.includes(l.id));
    }

    const totalItems = lists.reduce((sum, l) => sum + l.data.length, 0);
    setCompressionProgress({ current: 0, total: totalItems });

    try {
      addLog(`📦 Iniciando sincronização incremental de ${totalItems} itens...`);
      
      let processedCount = 0;

            for (const listObj of lists) {
        addLog(`📂 Categoria: ${listObj.title}...`);
        
        const itemsToSync = listObj.data;
        const categoryLabel = listObj.label;
        
        addLog(`📤 A enviar ${itemsToSync.length} itens de ${listObj.title} em bloco...`);
        
        await new Promise((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.open('POST', `${API_BASE_URL}/api/${categoryLabel}?mode=merge`, true);
          xhr.setRequestHeader('Content-Type', 'application/json');
          
          xhr.upload.onprogress = (event) => {
            if (event.lengthComputable) {
              const percentComplete = Math.round((event.loaded / event.total) * 100);
              setCompressionLabel(`A enviar ${listObj.title}: ${percentComplete}%`);
              setCompressionProgress({ 
                current: processedCount + (itemsToSync.length * (event.loaded / event.total)), 
                total: totalItems 
              });
            }
          };
          
          xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
              resolve();
            } else {
              reject(new Error(`Erro do servidor na categoria ${listObj.title} (${xhr.status}): ${xhr.responseText}`));
            }
          };
          
          xhr.onerror = () => reject(new Error(`Erro de rede ao enviar ${listObj.title}.`));
          xhr.ontimeout = () => reject(new Error(`Timeout ao enviar ${listObj.title}.`));
          
          xhr.send(JSON.stringify(itemsToSync));
        });
        
        processedCount += itemsToSync.length;
        setCompressionProgress({ current: processedCount, total: totalItems });
        addLog(`✅ Categoria ${listObj.title} concluída.`);

      }
      
      setCompressionLabel('Sincronização concluída com sucesso!');
      addLog('✨ SUCESSO: Todos os itens foram verificados e sincronizados!');
      
      await onFullSync(); 
      setModifiedCategories(prev => {
        const next = new Set(prev);
        if (forceSelectedOnly) {
          // No modo cirúrgico, mantemos as categorias pendentes mas limpamos a seleção de IDs
          setSelectedIds([]);
        } else {
          lists.forEach(l => next.delete(l.id));
        }
        return next;
      });
      
      if (forceSelectedOnly) setSelectedIds([]);

      setShowSyncSuccess(true);
      setTimeout(() => setShowSyncSuccess(false), 5000); 
    } catch (e: any) {
      addLog(`❌ ERRO: ${e.message}`);
      alert('❌ Erro na publicação: ' + e.message);
    } finally {
      setIsCompressing(false);
      setCompressionLabel('');
    }
  };

  const startEdit = (item: any) => {
    // Clone item to avoid direct mutation
    const itemClone = JSON.parse(JSON.stringify(item));
    setEditingItem(itemClone);
    setIsAddingNew(false);
  };

  const startAdd = () => {
    const timestamp = Date.now();
    let newItem: any = {};

    switch (activeTab) {
      case 'restaurants':
      case 'shops':
      case 'beauty':
      case 'services':
      case 'auto_repairs':
      case 'auto_electronics':
      case 'used_market':
      case 'animals':
      case 'real_estate':
      case 'gyms':
      case 'stands':
      case 'offices':
      case 'it_services':
      case 'perfumes':
      case 'bars':
      case 'events':
      case 'municipal':
        newItem = { 
          id: `${activeTab.substring(0,3).toUpperCase()}${timestamp}`, 
          name: '', 
          island: 'PDL', 
          rating: 4.5, 
          reviews: 0, 
          image: '', 
          description: '', 
          adminEmail: '',
          adminPassword: '',
          subcategory: '',
          dishes: [],
          services: [],
          mapUrl: '',
          isConfirmed: true
        };
        break;
      case 'activities':
        newItem = { id: `ACT${timestamp}`, title: '', type: 'activity', island: 'PDL', image: '', description: '', distance: '', duration: '', difficulty: 'Moderado', isPaid: true, price: 10, bookingPolicy: 'Reserva obrigatória com 24h de antecedência.', email: '', phone: '', address: '', mapUrl: '', adminEmail: '', adminPassword: '', isConfirmed: true };
        break;
      case 'trails':
        newItem = { id: `TRL${timestamp}`, title: '', type: 'trail', island: 'PDL', image: '', description: '', distance: '', duration: '', difficulty: 'Moderado', isPaid: false, price: 0, bookingPolicy: 'Reserva obrigatória com 24h de antecedência.', email: '', phone: '', address: '', mapUrl: '', adminEmail: '', adminPassword: '', isConfirmed: true };
        break;
      case 'poi':
        newItem = { id: `POI${timestamp}`, title: '', type: 'poi', island: 'PDL', image: '', description: '', distance: '', duration: '', difficulty: 'Moderado', isPaid: false, price: 0, bookingPolicy: 'Reserva obrigatória com 24h de antecedência.', email: '', phone: '', address: '', mapUrl: '', adminEmail: '', adminPassword: '', isConfirmed: true };
        break;
      case 'flights':
        newItem = { id: `FLI${timestamp}`, airline: '', flightNumber: '', origin: 'LIS', destination: 'PDL', departureTime: '00:00', arrivalTime: '00:00', price: 0, status: 'A Horas', stops: 0, duration: '', isConfirmed: true };
        break;
      case 'hotels':
        newItem = { id: `HOT${timestamp}`, name: '', island: 'PDL', stars: 4, pricePerNight: 0, image: '', description: '', type: hotelFilter !== 'all' ? hotelFilter : 'hotel', mapUrl: '', isConfirmed: true };
        break;
      case 'cars':
        newItem = { 
          id: `RC${timestamp}`, 
          name: '', 
          island: 'PDL', 
          address: '', 
          email: '', 
          contact: '', 
          image: '', 
          description: '', 
          adminEmail: '', 
          adminPassword: '', 
          cars: [],
          isConfirmed: true
        };
        break;
      case 'buses':
        newItem = { id: `BUS${timestamp}`, company: '', island: 'PDL', origin: '', destination: '', times: [], price: 0, duration: '' };
        break;
      case 'marketplace':
        newItem = { id: `cat_${timestamp}`, label: '', icon: 'ShoppingBag' };
        break;
      case 'suppliers':
        alert('Por favor, adicione fornecedores diretamente no cartão de cada restaurante abaixo.');
        return;
    }
    
    setEditingItem(newItem);
    setIsAddingNew(true);
  };

  // -- DISH MANAGEMENT (Restaurants only) --
  const addDish = () => {
    const newDish: Dish = { name: 'Novo Prato', description: '', price: 0, image: '' };
    setEditingItem({ ...editingItem, dishes: [...editingItem.dishes, newDish] });
  };

  const updateDish = (index: number, field: keyof Dish, value: any) => {
    const newDishes = [...editingItem.dishes];
    newDishes[index] = { ...newDishes[index], [field]: value };
    setEditingItem({ ...editingItem, dishes: newDishes });
  };

  const removeDish = (index: number) => {
    setEditingItem({ ...editingItem, dishes: editingItem.dishes.filter((_:any, i:number) => i !== index) });
  };

  const addCar = () => {
    const newCar: Car = { 
      id: `C${Date.now()}`, 
      model: 'Novo Modelo', 
      companyId: editingItem.id, 
      type: 'Económico', 
      fuelType: 'Gasolina', 
      pricePerDay: 40, 
      image: '', 
      seats: 5, 
      isAvailable: true, 
      description: 'Descrição do veículo...', 
      features: ['A/C', 'Manual'] 
    };
    setEditingItem({ ...editingItem, cars: [...(editingItem.cars || []), newCar] });
  };

  const updateCar = (index: number, field: keyof Car, value: any) => {
    const newCars = [...(editingItem.cars || [])];
    newCars[index] = { ...newCars[index], [field]: value };
    setEditingItem({ ...editingItem, cars: newCars });
  };

  const removeCar = (index: number) => {
    setEditingItem({ ...editingItem, cars: (editingItem.cars || []).filter((_:any, i:number) => i !== index) });
  };

  const addRoom = () => {
    if (!editingItem) return;
    const newRoom: Room = {
      id: `R${Date.now()}`,
      name: 'Novo Quarto',
      description: 'Descrição do quarto...',
      pricePerNight: 100,
      image: '',
      capacity: 2,
      gallery: []
    };
    setEditingItem({ ...editingItem, rooms: [...(editingItem.rooms || []), newRoom] });
  };

  const updateRoom = (index: number, field: keyof Room, value: any) => {
    if (!editingItem) return;
    const newRooms = [...(editingItem.rooms || [])];
    newRooms[index] = { ...newRooms[index], [field]: value };
    setEditingItem({ ...editingItem, rooms: newRooms });
  };

  const removeRoom = (index: number) => {
    if (!editingItem) return;
    setEditingItem({ ...editingItem, rooms: (editingItem.rooms || []).filter((_:any, i:number) => i !== index) });
  };

  const applyStandardRooms = () => {
    if (!editingItem) return;
    const basePrice = editingItem.pricePerNight || 100;
    const standardRooms: Room[] = [
      {
        id: `RM_${editingItem.id}_001`,
        name: "Duplo Standard",
        pricePerNight: basePrice,
        capacity: 2,
        image: "",
        gallery: [],
        description: "Quarto de 28m² com Varanda, Vista cidade, Banheira, Ar condicionado, Casa de banho privativa, Televisão de ecrã plano, Insonorização, Máquina de café, Minibar e Wi-Fi gratuito."
      },
      {
        id: `RM_${editingItem.id}_002`,
        name: "Duplo com Vista Mar",
        pricePerNight: Math.round(basePrice * 1.2),
        capacity: 2,
        image: "",
        gallery: [],
        description: "Quarto de 28m² com 1 cama de casal grande, Varanda, Vista mar, Vista piscina, Banheira, Ar condicionado, Casa de banho privativa, Televisão de ecrã plano, Insonorização, Terraço, Máquina de café, Minibar e Wi-Fi gratuito."
      },
      {
        id: `RM_${editingItem.id}_003`,
        name: "Individual Standard",
        pricePerNight: Math.round(basePrice * 0.85),
        capacity: 1,
        image: "",
        gallery: [],
        description: "Quarto de 28m² com Varanda, Vista cidade, Banheira, Ar condicionado, Casa de banho privativa, Televisão de ecrã plano, Insonorização, Máquina de café, Minibar e Wi-Fi gratuito."
      }
    ];
    setEditingItem({ ...editingItem, rooms: standardRooms });
  };

  const moveGalleryImage = (fromIndex: number, toIndex: number) => {
    if (!editingItem || !editingItem.gallery) return;
    if (toIndex < 0 || toIndex >= editingItem.gallery.length) return;
    const newGallery = [...editingItem.gallery];
    const [moved] = newGallery.splice(fromIndex, 1);
    newGallery.splice(toIndex, 0, moved);
    setEditingItem({ ...editingItem, gallery: newGallery });
    markCategoryAsModified(activeTab);
  };

  const handleImageUpload = async (files: FileList | File[] | File, type: 'main' | 'gallery' | 'dish' | 'car' | 'car_gallery' | 'room_main' | 'room_gallery' | 'activity_gallery' | 'poi', extraIndex?: number, roomGalleryIndex?: number) => {
    if (!editingItem) return;
    
    let fileArray: File[] = [];
    if (files instanceof FileList) {
      fileArray = Array.from(files);
    } else if (Array.isArray(files)) {
      fileArray = files;
    } else {
      fileArray = [files];
    }

    if (fileArray.length === 0) return;

    setIsUploading(true);
    setUploadProgress({ current: 0, total: fileArray.length, label: 'Iniciando processamento...' });
    
    try {
      let count = 0;
      for (const file of fileArray) {
        count++;
        setUploadProgress({ 
          current: count, 
          total: fileArray.length, 
          label: `A processar ficheiro ${count} de ${fileArray.length}...` 
        });

        // Upload do ficheiro para o backend/Cloudinary
        const formData = new FormData();
        formData.append('image', file);
        
        const response = await fetch(`${API_BASE_URL}/api/upload`, {
          method: 'POST',
          body: formData
        });
        
        if (!response.ok) throw new Error('Falha no upload para o servidor');
        const data = await response.json();
        const finalUrl = data.url;

        // Atualizar estado conforme o tipo
        if (type === 'main') {
          setEditingItem(prev => ({ ...prev, image: finalUrl }));
        } else if (type === 'gallery') {
          setEditingItem(prev => ({ 
            ...prev, 
            gallery: [...(prev.gallery || []), finalUrl] 
          }));
        } else if (type === 'dish' && extraIndex !== undefined) {
          setEditingItem(prev => {
            const dishes = [...(prev.dishes || [])];
            dishes[extraIndex] = { ...dishes[extraIndex], image: finalUrl };
            return { ...prev, dishes };
          });
        } else if (type === 'car' && extraIndex !== undefined) {
          setEditingItem(prev => {
            const cars = [...(prev.cars || [])];
            cars[extraIndex] = { ...cars[extraIndex], image: finalUrl };
            return { ...prev, cars };
          });
        } else if (type === 'room_main' && extraIndex !== undefined) {
          setEditingItem(prev => {
            const rooms = [...(prev.rooms || [])];
            rooms[extraIndex] = { ...rooms[extraIndex], image: finalUrl };
            return { ...prev, rooms };
          });
        } else if (type === 'room_gallery' && extraIndex !== undefined) {
          setEditingItem(prev => {
            const rooms = [...(prev.rooms || [])];
            const roomGallery = [...(rooms[extraIndex].gallery || [])];
            rooms[extraIndex] = { ...rooms[extraIndex], gallery: [...roomGallery, finalUrl] };
            return { ...prev, rooms };
          });
        } else if (type === 'car_gallery' && extraIndex !== undefined) {
          setEditingItem(prev => {
            const cars = [...(prev.cars || [])];
            const carGallery = [...(cars[extraIndex].gallery || [])];
            cars[extraIndex] = { ...cars[extraIndex], gallery: [...carGallery, finalUrl] };
            return { ...prev, cars };
          });
        } else if (type === 'activity_gallery') {
          setEditingItem(prev => ({ 
            ...prev, 
            gallery: [...(prev.gallery || []), finalUrl] 
          }));
        } else if (type === 'poi' && extraIndex !== undefined) {
          setEditingItem(prev => {
            const pois = [...(prev.pontosInteresse || [])];
            if (pois[extraIndex]) {
              pois[extraIndex] = { ...pois[extraIndex], foto: finalUrl };
            }
            return { ...prev, pontosInteresse: pois };
          });
        }
      }
      setUploadProgress({ current: fileArray.length, total: fileArray.length, label: 'Concluído!' });
      setTimeout(() => setIsUploading(false), 1000);
    } catch (error) {
      console.error('Error uploading:', error);
      alert('Erro ao carregar uma ou mais imagens.');
      setIsUploading(false);
    }
  };

  // -- FORM RENDERING --
  const renderFormFields = () => {
    if (!editingItem) return null;

    const isTrail = activeTab === 'trails' || editingItem?.type === 'trail';

    const commonInput = (label: string, field: string, type: string = 'text', colSpan: boolean = false) => {
      // Ocultar campos desnecessários para Trilhos
      const fieldsToHide = ['adminEmail', 'adminPassword', 'publicEmail', 'phone', 'contact', 'mapUrl'];
      
      if (isTrail && fieldsToHide.includes(field)) return null;

      return (
        <div className={colSpan ? 'md:col-span-2' : ''}>
          <label className="block text-sm font-bold text-slate-700 mb-1">{label}</label>
          <input 
            type={type} 
            className="w-full border p-2 rounded-lg"
            value={editingItem[field]}
            onChange={e => setEditingItem({...editingItem, [field]: type === 'number' ? parseFloat(e.target.value) : e.target.value})}
            required={!['description', 'mapUrl', 'adminEmail', 'adminPassword'].includes(field)}
          />
        </div>
      );
    };

    const islandSelect = (field: string = 'island') => (
      <div>
        <label className="block text-sm font-bold text-slate-700 mb-1">{t('item_island')}</label>
        <select 
          className="w-full border p-2 rounded-lg bg-white"
          value={editingItem[field]}
          onChange={e => setEditingItem({...editingItem, [field]: e.target.value})}
        >
          {['PDL', 'TER', 'HOR', 'PIX', 'SJZ', 'GRW', 'FLW', 'CVU', 'SMA', 'LIS', 'OPO', 'BOS', 'YYZ'].map(i => <option key={i} value={i}>{i}</option>)}
        </select>
      </div>
    );
    // Handle Category Slider Configuration separately
    if (editingItem.type === 'config_slider') {
      return (
        <div className="md:col-span-2 space-y-6">
          <div className="bg-blue-50 p-6 rounded-3xl border border-blue-100 flex items-center justify-between">
            <div>
               <h4 className="text-xl font-black text-blue-900 uppercase tracking-tighter">{editingItem.title}</h4>
               <p className="text-xs text-blue-600 font-bold uppercase tracking-widest mt-1">Carregue as fotos que aparecerão no topo desta categoria</p>
            </div>
            <label className={`cursor-pointer px-8 py-3 rounded-xl text-xs font-black uppercase transition-all flex items-center gap-2 ${isUploading ? 'bg-slate-100 text-slate-400' : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg'}`}>
               {isUploading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
               Adicionar Fotos
               <input type="file" className="hidden" multiple accept="image/*,.webp" onChange={e => e.target.files && handleImageUpload(e.target.files, 'activity_gallery')} disabled={isUploading} />
            </label>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {editingItem.gallery?.map((img: string, idx: number) => (
              <div key={idx} className="relative group aspect-video rounded-2xl overflow-hidden border-2 border-white shadow-lg">
                <img src={img} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                   <button type="button" onClick={() => setEditingItem({...editingItem, gallery: editingItem.gallery.filter((_:any, i:number) => i !== idx)})} className="p-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all"><Trash2 className="w-5 h-5" /></button>
                </div>
              </div>
            ))}
          </div>
          
          {(!editingItem.gallery || editingItem.gallery.length === 0) && (
            <div className="py-20 border-4 border-dashed border-slate-100 rounded-[3rem] flex flex-col items-center justify-center text-slate-300">
               <ImageIcon size={64} className="mb-4 opacity-20" />
               <p className="font-black uppercase tracking-widest text-sm">Nenhuma foto carregada</p>
               <p className="text-xs mt-2">Use o botão acima para começar</p>
            </div>
          )}
        </div>
      );
    }

    switch (activeTab) {
      case 'marketplace':
        return (
          <>
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-slate-700 mb-1">Nome da Categoria</label>
              <input 
                type="text" 
                className="w-full border p-2 rounded-lg" 
                value={editingItem.label || ''} 
                onChange={e => setEditingItem({...editingItem, label: e.target.value})} 
                required 
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Ícone</label>
              <select 
                className="w-full border p-2 rounded-lg bg-white font-bold" 
                value={editingItem.icon || 'ShoppingBag'} 
                onChange={e => setEditingItem({...editingItem, icon: e.target.value})} 
              >
                <option value="ShoppingBag">Saco de Compras (ShoppingBag)</option>
                <option value="Car">Carro (Car)</option>
                <option value="Home">Casa (Home)</option>
                <option value="Laptop">Tecnologia (Laptop)</option>
                <option value="Tag">Etiqueta/Moda (Tag)</option>
                <option value="Briefcase">Mala/Negócios (Briefcase)</option>
                <option value="Smartphone">Telemóvel (Smartphone)</option>
                <option value="Utensils">Restaurante (Utensils)</option>
                <option value="Mountain">Montanha (Mountain)</option>
                <option value="BedDouble">Cama (BedDouble)</option>
                <option value="Plane">Voo (Plane)</option>
                <option value="Sparkles">Estrelas/Beleza (Sparkles)</option>
              </select>
            </div>
          </>
        );
      case 'restaurants':
      case 'shops':
      case 'beauty':
      case 'services':
      case 'auto_repairs':
      case 'auto_electronics':
      case 'used_market':
      case 'animals':
      case 'real_estate':
      case 'gyms':
      case 'stands':
      case 'offices':
      case 'it_services':
      case 'perfumes':
      case 'bars':
      case 'events':
      case 'municipal':
        return (
          <>
            {commonInput(t('item_name'), 'name')}
            {islandSelect()}
            {commonInput('Concelho / Localidade (Ex: Ponta Delgada, Furnas)', 'concelho')}
            {activeTab === 'restaurants' && (
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Tipo de Cozinha</label>
                <select 
                  className="w-full border p-2 rounded-lg bg-white font-bold"
                  value={editingItem.cuisine || 'Regional'}
                  onChange={e => setEditingItem({...editingItem, cuisine: e.target.value})}
                >
                  <option value="Regional">Regional (Açoriana)</option>
                  <option value="Portuguesa">Portuguesa</option>
                  <option value="Italiana">Italiana</option>
                  <option value="Pizzaria">Pizzaria</option>
                  <option value="Chinesa">Chinesa</option>
                  <option value="Japonesa">Japonesa / Sushi</option>
                  <option value="Mexicana">Mexicana</option>
                  <option value="Americana">Americana / Fast Food</option>
                  <option value="Hamburgueria">Hamburgueria</option>
                  <option value="Vegetariana">Vegetariana</option>
                  <option value="Vegan">Vegan</option>
                  <option value="Marisco">Marisco</option>
                  <option value="Peixe Fresco">Peixe Fresco</option>
                  <option value="Churrasco">Churrasco / Grelhados</option>
                  <option value="Mediterrânica">Mediterrânica</option>
                  <option value="Francesa">Francesa</option>
                  <option value="Indiana">Indiana</option>
                  <option value="Tailandesa">Tailandesa</option>
                  <option value="Brasileira">Brasileira</option>
                  <option value="Snack-Bar">Snack-Bar / Petiscos</option>
                  <option value="Pastelaria">Pastelaria / Café</option>
                  <option value="Gourmet">Gourmet / Autor</option>
                </select>
              </div>
            )}
            
            {/* Subcategory selection based on Tab */}
            {activeTab === 'beauty' && (
              <>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Subcategoria</label>
                  <select 
                    className="w-full border p-2 rounded-lg bg-white font-bold" 
                    value={editingItem.subcategory} 
                    onChange={e => {
                      const sub = e.target.value;
                      setEditingItem({
                        ...editingItem,
                        subcategory: sub,
                        softwareVersion: sub === 'barber' ? (editingItem.softwareVersion || 'normal') : undefined
                      });
                    }}
                  >
                    <option value="">Selecione uma subcategoria...</option>
                    <option value="beauty_salon">Salão de Beleza</option>
                    <option value="hairdresser">Cabeleireiro</option>
                    <option value="barber">Barbearia</option>
                    <option value="manicure">Manicure</option>
                    <option value="massage">Massagem</option>
                  </select>
                </div>
                {editingItem.subcategory === 'barber' && (
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Versão do Software</label>
                    <select 
                      className="w-full border p-2 rounded-lg bg-white font-bold text-blue-600" 
                      value={editingItem.softwareVersion || 'normal'} 
                      onChange={e => setEditingItem({...editingItem, softwareVersion: e.target.value})}
                    >
                      <option value="normal">Versão Normal</option>
                      <option value="pro">Versão Avançada</option>
                    </select>
                  </div>
                )}
              </>
            )}
            {activeTab === 'shops' && (
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Subcategoria</label>
                <select className="w-full border p-2 rounded-lg bg-white font-bold" value={editingItem.subcategory} onChange={e => setEditingItem({...editingItem, subcategory: e.target.value})}>
                  <option value="crafts">Artesanato</option>
                  <option value="food">Produtos Regionais</option>
                </select>
              </div>
            )}
            {activeTab === 'auto_repairs' && (
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Subcategoria</label>
                <select className="w-full border p-2 rounded-lg bg-white font-bold" value={editingItem.subcategory} onChange={e => setEditingItem({...editingItem, subcategory: e.target.value})}>
                  <option value="parts">Peças</option>
                  <option value="workshop">Oficina</option>
                  <option value="bodywork">Bate-chapas</option>
                  <option value="electric">Elétrica</option>
                </select>
              </div>
            )}
            {activeTab === 'auto_electronics' && (
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Subcategoria</label>
                <select className="w-full border p-2 rounded-lg bg-white font-bold" value={editingItem.subcategory} onChange={e => setEditingItem({...editingItem, subcategory: e.target.value})}>
                  <option value="audio">Áudio & Som</option>
                  <option value="alarms">Alarmes</option>
                  <option value="navigation">Navegação/GPS</option>
                  <option value="diagnostics">Diagnóstico</option>
                </select>
              </div>
            )}
            {activeTab === 'services' && (
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Subcategoria</label>
                <select className="w-full border p-2 rounded-lg bg-white font-bold" value={editingItem.subcategory} onChange={e => setEditingItem({...editingItem, subcategory: e.target.value})}>
                  <option value="electrician">Eletricista</option>
                  <option value="mason">Pedreiro</option>
                  <option value="carpenter">Carpinteiro</option>
                  <option value="plumber">Canalizador</option>
                  <option value="painter">Pintor</option>
                  <option value="gardening">Jardinagem</option>
                  <option value="architect">Arquiteto</option>
                  <option value="engineer">Engenheiro</option>
                  <option value="hvac">Climatização</option>
                </select>
              </div>
            )}
            {activeTab === 'used_market' && (
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Subcategoria</label>
                <select className="w-full border p-2 rounded-lg bg-white font-bold" value={editingItem.subcategory} onChange={e => setEditingItem({...editingItem, subcategory: e.target.value})}>
                  <option value="clothing">Vestuário</option>
                  <option value="electronics">Eletrónica</option>
                  <option value="furniture">Móveis</option>
                  <option value="books">Livros</option>
                  <option value="sports">Desporto</option>
                </select>
              </div>
            )}
            {activeTab === 'animals' && (
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Subcategoria</label>
                <select className="w-full border p-2 rounded-lg bg-white font-bold" value={editingItem.subcategory} onChange={e => setEditingItem({...editingItem, subcategory: e.target.value})}>
                  <option value="vet">Veterinário</option>
                  <option value="grooming">Grooming/Banho</option>
                  <option value="petshop">Pet Shop</option>
                  <option value="training">Treino</option>
                </select>
              </div>
            )}
            {activeTab === 'real_estate' && (
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Subcategoria</label>
                <select className="w-full border p-2 rounded-lg bg-white font-bold" value={editingItem.subcategory} onChange={e => setEditingItem({...editingItem, subcategory: e.target.value})}>
                  <option value="rent">Arrendar</option>
                  <option value="buy">Comprar</option>
                  <option value="commercial">Comercial</option>
                </select>
              </div>
            )}
            {activeTab === 'gyms' && (
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Subcategoria</label>
                <select className="w-full border p-2 rounded-lg bg-white font-bold" value={editingItem.subcategory} onChange={e => setEditingItem({...editingItem, subcategory: e.target.value})}>
                  <option value="fitness">Fitness/Musculação</option>
                  <option value="crossfit">Crossfit</option>
                  <option value="yoga">Yoga/Pilates</option>
                  <option value="martial_arts">Artes Marciais</option>
                </select>
              </div>
            )}
            {activeTab === 'stands' && (
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Subcategoria</label>
                <select className="w-full border p-2 rounded-lg bg-white font-bold" value={editingItem.subcategory} onChange={e => setEditingItem({...editingItem, subcategory: e.target.value})}>
                  <option value="used_cars">Carros Usados</option>
                  <option value="new_cars">Carros Novos</option>
                  <option value="motorcycles">Motos</option>
                  <option value="boats">Barcos</option>
                </select>
              </div>
            )}
            {activeTab === 'offices' && (
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Subcategoria</label>
                <select className="w-full border p-2 rounded-lg bg-white font-bold" value={editingItem.subcategory} onChange={e => setEditingItem({...editingItem, subcategory: e.target.value})}>
                  <option value="law">Advocacia</option>
                  <option value="accounting">Contabilidade</option>
                  <option value="consulting">Consultoria</option>
                  <option value="design">Design/Marketing</option>
                </select>
              </div>
            )}
            {activeTab === 'it_services' && (
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Subcategoria</label>
                <select className="w-full border p-2 rounded-lg bg-white font-bold" value={editingItem.subcategory} onChange={e => setEditingItem({...editingItem, subcategory: e.target.value})}>
                  <option value="software">Software Dev</option>
                  <option value="hardware">Reparação Hardware</option>
                  <option value="network">Redes</option>
                  <option value="web">Web Design</option>
                </select>
              </div>
            )}
            {activeTab === 'perfumes' && (
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Subcategoria</label>
                <select className="w-full border p-2 rounded-lg bg-white font-bold" value={editingItem.subcategory} onChange={e => setEditingItem({...editingItem, subcategory: e.target.value})}>
                  <option value="male">Masculino</option>
                  <option value="female">Feminino</option>
                  <option value="unisex">Unisexo</option>
                </select>
              </div>
            )}

            {commonInput(t('item_rating'), 'rating', 'number')}
            {commonInput(t('item_reviews'), 'reviews', 'number')}
            
            <div className="flex flex-col md:flex-row md:items-center gap-6 py-3 border-b border-slate-100 pb-4 md:col-span-2">
               <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                     <input type="checkbox" checked={editingItem.isPremium} onChange={e => setEditingItem({...editingItem, isPremium: e.target.checked})} className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500" />
                     <span className="text-sm font-bold text-slate-700">Destaque Premium</span>
                  </label>
                  <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${editingItem.isPremium ? 'bg-amber-100 text-amber-600 border border-amber-200' : 'bg-slate-100 text-slate-400'}`}>
                     {editingItem.isPremium ? 'Premium / Pago' : 'Grátis'}
                  </span>
               </div>
               
               <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                     <input type="checkbox" checked={editingItem.isConfirmed !== false} onChange={e => setEditingItem({...editingItem, isConfirmed: e.target.checked})} className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500" />
                     <span className="text-sm font-bold text-slate-700 text-emerald-700">Negócio Confirmado (Permite Reservas/Agendamentos)</span>
                  </label>
                  <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${editingItem.isConfirmed !== false ? 'bg-emerald-100 text-emerald-600 border border-emerald-200' : 'bg-rose-100 text-rose-600 border border-rose-200'}`}>
                     {editingItem.isConfirmed !== false ? 'Confirmado' : 'Não Confirmado'}
                  </span>
               </div>
            </div>

            {commonInput('Google Maps Link', 'mapUrl', 'text', true)}
            
            {/* Image Upload Field */}
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-slate-700 mb-1">{t('item_image')} (URL ou Upload)</label>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  className="flex-1 border p-2 rounded-lg"
                  value={editingItem.image}
                  onChange={e => setEditingItem({...editingItem, image: e.target.value})}
                  placeholder="URL da imagem..."
                />
                <label className={`cursor-pointer p-2 rounded-lg border flex items-center justify-center transition-all ${isUploading ? 'bg-slate-100 opacity-50' : 'bg-blue-50 border-blue-200 text-blue-600 hover:bg-blue-100'}`}>
                   {isUploading ? <RefreshCw className="w-5 h-5 animate-spin" /> : <ImageIcon className="w-5 h-5" />}
                   <input 
                     type="file" 
                     className="hidden" 
                     accept="image/*,.webp"
                     disabled={isUploading}
                     onChange={e => e.target.files?.[0] && handleImageUpload(e.target.files[0], 'main')}
                   />
                </label>
              </div>
            </div>

            {commonInput('Admin Email', 'adminEmail')}
            {commonInput('Admin Password', 'adminPassword')}
            
            <div className="md:col-span-2">
               <label className="block text-sm font-bold text-slate-700 mb-1">{t('item_desc')}</label>
               <textarea className="w-full border p-2 rounded-lg h-24" value={editingItem.description} onChange={e => setEditingItem({...editingItem, description: e.target.value})} />
            </div>

            {/* Gallery Section */}
            <div className="md:col-span-2 border-t pt-4 mt-2">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h4 className="font-bold uppercase text-xs tracking-widest text-slate-500">Galeria de Imagens</h4>
                  <p className="text-[9px] text-slate-400">Arraste para reordenar ou use as setas</p>
                </div>
                <label className={`cursor-pointer px-4 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all flex items-center gap-2 ${isUploading ? 'bg-slate-100' : 'bg-green-600 text-white hover:bg-green-700 shadow-md shadow-green-500/20'}`}>
                  {isUploading ? <RefreshCw size={12} className="animate-spin" /> : <Plus size={12} />}
                  {isUploading ? 'A carregar...' : 'Adicionar Fotos (Múltiplas)'}
                  <input type="file" multiple className="hidden" accept="image/*,.webp" disabled={isUploading} onChange={e => e.target.files && handleImageUpload(e.target.files, 'gallery')} />
                </label>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                 {editingItem.gallery?.map((img: string, idx: number) => (
                   <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden border-2 border-slate-100 group shadow-sm hover:shadow-md transition-all">
                      <img src={img} className="w-full h-full object-cover" alt="" />
                      
                      {/* Hover Controls */}
                      <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                         <div className="flex gap-1">
                            <button type="button" onClick={() => moveGalleryImage(idx, idx - 1)} disabled={idx === 0} className="p-1.5 bg-white/20 hover:bg-white/40 rounded-lg text-white disabled:opacity-30"><ArrowRight size={14} className="rotate-180" /></button>
                            <button type="button" onClick={() => moveGalleryImage(idx, idx + 1)} disabled={idx === editingItem.gallery.length - 1} className="p-1.5 bg-white/20 hover:bg-white/40 rounded-lg text-white disabled:opacity-30"><ArrowRight size={14} /></button>
                         </div>
                         <button 
                            type="button" 
                            onClick={() => {
                              const newGallery = editingItem.gallery.filter((_:any, i:number) => i !== idx);
                              setEditingItem({ ...editingItem, image: img, gallery: newGallery });
                            }} 
                            className="px-3 py-1 bg-blue-500 text-white rounded-lg text-[8px] font-black uppercase tracking-widest hover:bg-blue-600"
                          >
                            Tornar Principal
                          </button>
                         <button type="button" onClick={() => setEditingItem({...editingItem, gallery: editingItem.gallery.filter((_:any, i:number) => i !== idx)})} className="p-1.5 bg-red-500/80 text-white rounded-lg hover:bg-red-600"><Trash2 size={14} /></button>
                      </div>
                      
                      {/* Index Badge */}
                      <div className="absolute top-2 left-2 bg-black/50 text-white text-[8px] font-black w-4 h-4 flex items-center justify-center rounded-md">
                        {idx + 1}
                      </div>
                   </div>
                 ))}
              </div>
            </div>
            
            {/* Dishes/Services Section */}
            <div className="md:col-span-2 border-t pt-4 mt-2">
              <div className="flex justify-between items-center mb-2">
                 <h4 className="font-bold">Items/Serviços</h4>
                 <button type="button" onClick={addDish} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200">+ Novo Item</button>
              </div>
              <div className="space-y-3">
                {editingItem.dishes?.map((dish: Dish, idx: number) => (
                  <div key={idx} className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-3">
                    <div className="flex gap-2">
                      <input className="border p-2 rounded-lg w-1/3 font-bold" placeholder="Nome" value={dish.name} onChange={e => updateDish(idx, 'name', e.target.value)} />
                      <input className="border p-2 rounded-lg w-1/4" placeholder="Preço" type="number" value={dish.price} onChange={e => updateDish(idx, 'price', parseFloat(e.target.value))} />
                      <button type="button" onClick={() => removeDish(idx)} className="text-red-500 p-2"><Trash2 className="w-5 h-5" /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        );
      
      case 'activities':
      case 'trails':
      case 'poi':
        if (editingItem?.type === 'config_slider') {
          return (
            <>
              <div className="md:col-span-2">
                <h4 className="text-xl font-black text-slate-800 uppercase tracking-tighter mb-2">Configuração do Slider Principal</h4>
                <p className="text-xs text-slate-500 font-medium mb-6">Estas fotos aparecem no topo da categoria {activeTab === 'trails' ? 'Trilhos' : activeTab === 'poi' ? 'Pontos Turísticos' : 'Atividades'}.</p>
              </div>
              {commonInput('Nome do Slider (Apenas Interno)', 'title', 'text', true)}
              
              <div className="md:col-span-2 border-t pt-6 mt-4">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h4 className="font-black text-xs uppercase tracking-[0.2em] text-blue-600">Galeria do Slider</h4>
                    <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Imagens de Alta Resolução (WebP)</p>
                  </div>
                  <label className={`cursor-pointer px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase transition-all flex items-center gap-2 ${isUploading ? 'bg-slate-100' : 'bg-slate-900 text-white hover:bg-blue-600 shadow-xl shadow-slate-900/10'}`}>
                    {isUploading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                    {isUploading ? 'A Otimizar...' : 'Adicionar Fotos'}
                    <input type="file" multiple className="hidden" accept="image/*,.webp" disabled={isUploading} onChange={e => e.target.files && handleImageUpload(e.target.files, 'activity_gallery')} />
                  </label>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {editingItem.gallery?.map((img: string, idx: number) => (
                    <div key={idx} className="relative aspect-[16/9] rounded-[1.5rem] overflow-hidden border-2 border-slate-100 group shadow-md">
                       <img src={img} className="w-full h-full object-cover" alt="" />
                       <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                          <div className="flex gap-2">
                             <button type="button" onClick={() => moveGalleryImage(idx, idx - 1)} disabled={idx === 0} className="p-2 bg-white/20 hover:bg-white/40 rounded-xl text-white disabled:opacity-30 transition-all"><ChevronLeft size={20} /></button>
                             <button type="button" onClick={() => moveGalleryImage(idx, idx + 1)} disabled={idx === editingItem.gallery.length - 1} className="p-2 bg-white/20 hover:bg-white/40 rounded-xl text-white disabled:opacity-30 transition-all"><ChevronRight size={20} /></button>
                          </div>
                          <button type="button" onClick={() => setEditingItem({...editingItem, gallery: editingItem.gallery.filter((_:any, i:number) => i !== idx)})} className="px-4 py-2 bg-red-500/80 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-600 flex items-center gap-2">
                            <Trash2 size={12} /> Remover
                          </button>
                       </div>
                       <div className="absolute top-3 left-3 bg-white/90 backdrop-blur px-2 py-1 rounded-lg text-[10px] font-black text-slate-800 shadow-sm">
                         #{idx + 1}
                       </div>
                    </div>
                  ))}
                </div>
                {(!editingItem.gallery || editingItem.gallery.length === 0) && (
                  <div className="py-12 border-2 border-dashed border-slate-200 rounded-[2rem] text-center">
                    <ImageIcon className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Nenhuma foto adicionada ao slider</p>
                  </div>
                )}
              </div>
            </>
          );
        }

        return (
          <>
            {commonInput(t('item_name'), 'title')}
            {islandSelect()}
            <div>
               <label className="block text-sm font-bold text-slate-700 mb-1">{t('field_type')}</label>
               <select className="w-full border p-2 rounded-lg bg-white" value={editingItem.type} onChange={e => setEditingItem({...editingItem, type: e.target.value})}>
                 <option value="trail">Trilho</option>
                 <option value="culture">Cultura</option>
                 <option value="landscape">Paisagem</option>
                 <option value="poi">Ponto de Interesse</option>
                 <option value="activity">Atividade</option>
               </select>
            </div>
            
            {/* Trail / POI / Landscape Details */}
            {(editingItem.type === 'trail' || editingItem.type === 'poi' || editingItem.type === 'landscape') && (
              <>
                {editingItem.type === 'trail' && (
                  <>
                    {commonInput('Distância (ex: 5.4 Km)', 'distance')}
                    {commonInput('Duração (ex: 2h 30m)', 'duration')}
                  </>
                )}
                <div>
                   <label className="block text-sm font-bold text-slate-700 mb-1">Dificuldade</label>
                   <select className="w-full border p-2 rounded-lg bg-white" value={editingItem.difficulty || 'Moderado'} onChange={e => setEditingItem({...editingItem, difficulty: e.target.value})}>
                     <option value="Fácil">Fácil</option>
                     <option value="Moderado">Moderado</option>
                     <option value="Difícil">Difícil</option>
                   </select>
                </div>
              </>
            )}

            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-slate-700 mb-1">Foto Principal (Upload ou URL)</label>
              <div className="flex gap-2">
                <input type="text" className="flex-1 border p-2 rounded-lg" value={editingItem.image} onChange={e => setEditingItem({...editingItem, image: e.target.value})} placeholder="URL da imagem..." />
                <label className={`cursor-pointer p-2 rounded-lg border flex items-center justify-center transition-all ${isUploading ? 'bg-slate-100' : 'bg-blue-50 border-blue-200 text-blue-600 hover:bg-blue-100'}`}>
                   {isUploading ? <RefreshCw className="w-5 h-5 animate-spin" /> : <ImageIcon className="w-5 h-5" />}
                   <input type="file" className="hidden" accept="image/*,.webp" disabled={isUploading} onChange={e => e.target.files?.[0] && handleImageUpload(e.target.files[0], 'main')} />
                </label>
              </div>
            </div>

            <div className="md:col-span-2">
               <label className="block text-sm font-bold text-slate-700 mb-1">{t('item_desc')}</label>
               <textarea className="w-full border p-2 rounded-lg h-24" value={editingItem.description} onChange={e => setEditingItem({...editingItem, description: e.target.value})} />
            </div>

            <div className="flex items-center gap-4 py-3 border-y border-slate-100 my-2">
               <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={editingItem.isPaid} onChange={e => setEditingItem({...editingItem, isPaid: e.target.checked})} className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500" />
                  <span className="text-sm font-bold text-slate-700">Atividade Paga (Reserva)</span>
               </label>
               {editingItem.isPaid && (
                 <div className="flex items-center gap-2">
                   <span className="text-[10px] font-black uppercase text-slate-400">Preço (€):</span>
                   <input type="number" className="w-20 border p-1 rounded-lg font-bold text-blue-600" value={editingItem.price} onChange={e => setEditingItem({...editingItem, price: Number(e.target.value)})} />
                 </div>
               )}
            </div>

            {editingItem.isPaid && (
              <div className="md:col-span-2">
                <label className="block text-[10px] font-black uppercase text-slate-400 mb-1 ml-1">Política de Reserva</label>
                <textarea className="w-full border p-2 rounded-lg h-16 text-xs" value={editingItem.bookingPolicy} onChange={e => setEditingItem({...editingItem, bookingPolicy: e.target.value})} placeholder="Ex: Reserva obrigatória com 24h de antecedência..." />
              </div>
            )}

            {!isTrail && (
              <>
                {commonInput('Email de Contacto Público', 'email')}
                {commonInput('Telefone de Contacto Público', 'phone')}
                {commonInput('Email Admin (Dashboard)', 'adminEmail')}
                {commonInput('Password Admin', 'adminPassword')}
                {commonInput('Morada / Ponto de Encontro', 'address')}
                {commonInput('Google Maps URL', 'mapUrl', 'text', true)}
              </>
            )}

            {/* Advanced Trail Features (Climate & POIs) */}
            {isTrail && (
              <div className="md:col-span-2 border-t pt-8 mt-6 space-y-8">
                <div className="bg-slate-900/5 p-6 rounded-[2.5rem] border border-slate-200 shadow-inner">
                   <div className="flex items-center gap-3 mb-6">
                     <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-600/20">
                        <RefreshCw size={20} className={isUploading ? 'animate-spin' : ''} />
                     </div>
                     <div>
                        <h4 className="text-lg font-black text-slate-800 uppercase tracking-tighter">Gerir Pontos de Interesse (POIs)</h4>
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Configuração de Clima e Marcadores de Mapa</p>
                     </div>
                   </div>
                   
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                      <div className="space-y-1.5">
                        <label className="block text-[10px] font-black uppercase text-slate-500 tracking-wider ml-1">Condição Climática</label>
                        <select 
                          className="w-full border-2 border-slate-200 p-3 rounded-2xl text-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none bg-white font-bold" 
                          value={editingItem.climaSimulado?.condicao || 'Céu Limpo'} 
                          onChange={e => setEditingItem({...editingItem, climaSimulado: {...(editingItem.climaSimulado || {}), condicao: e.target.value}})}
                        >
                          {["Céu Limpo", "Sol e Nuvens", "Nublado", "Nevoeiro", "Chuva Ligeira", "Chuva Forte", "Vento Forte"].map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>
                      <div className="space-y-1.5">
                        <label className="block text-[10px] font-black uppercase text-slate-500 tracking-wider ml-1">Temperatura (ºC)</label>
                        <select 
                          className="w-full border-2 border-slate-200 p-3 rounded-2xl text-sm font-black focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none bg-white" 
                          value={editingItem.climaSimulado?.temperatura || 18} 
                          onChange={e => setEditingItem({...editingItem, climaSimulado: {...(editingItem.climaSimulado || {}), temperatura: Number(e.target.value)}})}
                        >
                          {Array.from({length: 41}, (_, i) => i).map(t => <option key={t} value={t}>{t} ºC</option>)}
                        </select>
                      </div>
                      <div className="space-y-1.5">
                        <label className="block text-[10px] font-black uppercase text-slate-500 tracking-wider ml-1">Alerta de Segurança</label>
                        <input className="w-full border-2 border-slate-200 p-3 rounded-2xl text-sm text-red-600 font-bold focus:border-red-500 focus:ring-4 focus:ring-red-500/10 transition-all outline-none" value={editingItem.climaSimulado?.alerta || ''} onChange={e => setEditingItem({...editingItem, climaSimulado: {...(editingItem.climaSimulado || {}), alerta: e.target.value}})} placeholder="Opcional: Aviso sonoro..." />
                      </div>
                   </div>

                   <div className="space-y-6">
                      <div className="flex justify-between items-center px-2">
                        <h5 className="text-[11px] font-black uppercase text-slate-700 tracking-[0.2em]">Marcadores de Interesse</h5>
                        <button 
                          type="button" 
                          onClick={() => setEditingItem({...editingItem, pontosInteresse: [...(editingItem.pontosInteresse || []), { id: `POI_${Date.now()}`, nome: '', tipo: 'miradouro', descricao: '', lat: 0, lng: 0, foto: '' }]})}
                          className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-blue-600/20"
                        >
                          <Plus size={14} /> Adicionar Ponto
                        </button>
                      </div>

                      <div className="grid grid-cols-1 gap-4">
                        {editingItem.pontosInteresse?.map((poi: any, pIdx: number) => (
                          <div key={pIdx} className="bg-white border-2 border-slate-100 p-6 rounded-[2.5rem] shadow-sm hover:shadow-xl hover:border-blue-100 transition-all space-y-4 group">
                            <div className="flex flex-col md:flex-row gap-4">
                              {/* POI Photo Upload */}
                              <div className="w-full md:w-32 h-32 rounded-3xl overflow-hidden bg-slate-100 relative group/photo flex-shrink-0 border-2 border-slate-50">
                                {poi.foto ? (
                                  <img src={poi.foto} className="w-full h-full object-cover" />
                                ) : (
                                  <div className="w-full h-full flex flex-col items-center justify-center text-slate-300">
                                    <ImageIcon size={24} />
                                    <span className="text-[8px] font-black uppercase mt-1">Sem Foto</span>
                                  </div>
                                )}
                                <label className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover/photo:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                                   <input type="file" className="hidden" accept="image/*,.webp" onChange={e => e.target.files?.[0] && handleImageUpload(e.target.files[0], 'poi', pIdx)} disabled={isUploading} />
                                   <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-slate-900 shadow-lg">
                                      {isUploading ? <RefreshCw size={16} className="animate-spin" /> : <Plus size={16} />}
                                   </div>
                                </label>
                              </div>

                              <div className="flex-1 space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div className="space-y-1">
                                    <label className="text-[9px] font-black uppercase text-slate-400 ml-1">Nome do Local</label>
                                    <input className="w-full border-2 border-slate-100 p-2.5 rounded-xl text-xs font-black focus:border-blue-300 outline-none transition-all" placeholder="Ex: Cascata do Salto" value={poi.nome} onChange={e => {
                                      const newPois = [...(editingItem.pontosInteresse || [])];
                                      newPois[pIdx].nome = e.target.value;
                                      setEditingItem({...editingItem, pontosInteresse: newPois});
                                    }} />
                                  </div>
                                  <div className="space-y-1">
                                    <label className="text-[9px] font-black uppercase text-slate-400 ml-1">Tipo de Ponto</label>
                                    <select className="w-full border-2 border-slate-100 p-2.5 rounded-xl text-xs font-bold focus:border-blue-300 outline-none transition-all bg-white" value={poi.tipo} onChange={e => {
                                      const newPois = [...(editingItem.pontosInteresse || [])];
                                      newPois[pIdx].tipo = e.target.value;
                                      setEditingItem({...editingItem, pontosInteresse: newPois});
                                    }}>
                                      <option value="miradouro">Miradouro</option>
                                      <option value="cascata">Cascata</option>
                                      <option value="monumento">Monumento</option>
                                      <option value="perigo">Perigo</option>
                                    </select>
                                  </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                   <div className="space-y-1">
                                      <label className="text-[9px] font-black uppercase text-slate-400 ml-1">Latitude</label>
                                      <input type="number" step="0.000001" className="w-full border-2 border-slate-100 p-2.5 rounded-xl text-xs font-bold focus:border-blue-300 outline-none" value={poi.lat} onChange={e => {
                                        const newPois = [...(editingItem.pontosInteresse || [])];
                                        newPois[pIdx].lat = Number(e.target.value);
                                        setEditingItem({...editingItem, pontosInteresse: newPois});
                                      }} />
                                   </div>
                                   <div className="space-y-1">
                                      <label className="text-[9px] font-black uppercase text-slate-400 ml-1">Longitude</label>
                                      <input type="number" step="0.000001" className="w-full border-2 border-slate-100 p-2.5 rounded-xl text-xs font-bold focus:border-blue-300 outline-none" value={poi.lng} onChange={e => {
                                        const newPois = [...(editingItem.pontosInteresse || [])];
                                        newPois[pIdx].lng = Number(e.target.value);
                                        setEditingItem({...editingItem, pontosInteresse: newPois});
                                      }} />
                                   </div>
                                </div>
                              </div>
                            </div>

                            <div className="space-y-1.5">
                               <label className="text-[9px] font-black uppercase text-slate-400 ml-1">Descrição Informativa (Voz Guia)</label>
                               <textarea className="w-full border-2 border-slate-100 p-3 rounded-2xl text-xs h-20 focus:border-blue-300 outline-none transition-all" placeholder="Descreve o local para o turista ouvir ao aproximar-se..." value={poi.descricao} onChange={e => {
                                 const newPois = [...(editingItem.pontosInteresse || [])];
                                 newPois[pIdx].descricao = e.target.value;
                                 setEditingItem({...editingItem, pontosInteresse: newPois});
                               }} />
                            </div>

                            <div className="flex justify-end pt-2 border-t border-slate-50">
                               <button type="button" onClick={() => setEditingItem({...editingItem, pontosInteresse: (editingItem.pontosInteresse || []).filter((_:any, i:number) => i !== pIdx)})} className="flex items-center gap-2 text-red-500 hover:text-red-600 px-3 py-1.5 rounded-xl hover:bg-red-50 transition-all text-[10px] font-black uppercase tracking-widest">
                                 <Trash2 size={14} /> Eliminar Ponto
                               </button>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      {(!editingItem.pontosInteresse || editingItem.pontosInteresse.length === 0) && (
                        <div className="py-12 border-4 border-dashed border-slate-100 rounded-[3rem] text-center text-slate-300">
                           <MapPin size={48} className="mx-auto mb-3 opacity-20" />
                           <p className="text-[10px] font-black uppercase tracking-[0.2em]">Nenhum Ponto de Interesse Adicionado</p>
                        </div>
                      )}
                   </div>
                </div>

                {/* GPX XML Editor */}
                <div className="bg-slate-900/5 p-6 rounded-[2.5rem] border border-slate-200 shadow-inner mt-6">
                   <div className="flex items-center gap-3 mb-6">
                     <div className="w-10 h-10 bg-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-600/20">
                        <Map size={20} />
                     </div>
                     <div>
                        <h4 className="text-lg font-black text-slate-800 uppercase tracking-tighter">Conteúdo do Ficheiro GPX (XML)</h4>
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Cole os dados XML do trilho para visualização do percurso</p>
                     </div>
                   </div>
                   <div className="space-y-1.5">
                     <label className="block text-[10px] font-black uppercase text-slate-500 tracking-wider ml-1">Dados XML GPX</label>
                     <textarea 
                       className="w-full h-64 border-2 border-slate-200 p-4 rounded-2xl font-mono text-xs focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none bg-white" 
                       placeholder={`<?xml version="1.0" encoding="UTF-8"?>\n<gpx version="1.1" creator="Azores4you" ...>\n  <trk>\n    <trkseg>\n      <trkpt lat="37.75" lon="-25.67"/>\n    </trkseg>\n  </trk>\n</gpx>`}
                       value={editingItem.gpxXml || ''} 
                       onChange={e => setEditingItem({...editingItem, gpxXml: e.target.value})}
                     />
                   </div>
                </div>
              </div>
            )}

            {/* Activity Gallery Section */}
            <div className="md:col-span-2 border-t pt-6 mt-4">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h4 className="font-black text-xs uppercase tracking-[0.2em] text-blue-600">Galeria de Fotos do Trilho/Atividade</h4>
                  <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Estas fotos aparecerão no slider de topo (Efeito FadeIn/FadeOut)</p>
                </div>
                <label className={`cursor-pointer px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase transition-all flex items-center gap-2 ${isUploading ? 'bg-slate-100' : 'bg-slate-900 text-white hover:bg-blue-600 shadow-xl shadow-slate-900/10'}`}>
                  {isUploading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                  {isUploading ? 'A Otimizar...' : 'Adicionar Fotos'}
                  <input type="file" multiple className="hidden" accept="image/*,.webp" disabled={isUploading} onChange={e => e.target.files && handleImageUpload(e.target.files, 'activity_gallery')} />
                </label>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {editingItem.gallery?.map((img: string, idx: number) => (
                  <div key={idx} className="relative aspect-video rounded-2xl overflow-hidden border-2 border-slate-100 group shadow-md hover:border-blue-200 transition-all">
                     <img src={img} className="w-full h-full object-cover" alt="" />
                     
                     {/* Hover Controls */}
                     <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                        <div className="flex gap-1">
                           <button type="button" onClick={() => moveGalleryImage(idx, idx - 1)} disabled={idx === 0} className="p-1.5 bg-white/20 hover:bg-white/40 rounded-lg text-white disabled:opacity-30 transition-all"><ArrowRight size={14} className="rotate-180" /></button>
                           <button type="button" onClick={() => moveGalleryImage(idx, idx + 1)} disabled={idx === (editingItem.gallery?.length || 0) - 1} className="p-1.5 bg-white/20 hover:bg-white/40 rounded-lg text-white disabled:opacity-30 transition-all"><ArrowRight size={14} /></button>
                        </div>
                        
                        <div className="flex gap-2">
                          <button 
                             type="button" 
                             onClick={() => {
                               const newGallery = editingItem.gallery.filter((_:any, i:number) => i !== idx);
                               setEditingItem({ ...editingItem, image: img, gallery: newGallery });
                             }} 
                             className="px-3 py-1 bg-blue-500 text-white rounded-lg text-[8px] font-black uppercase tracking-widest hover:bg-blue-600"
                           >
                             Capa
                           </button>
                           <button type="button" onClick={() => setEditingItem({...editingItem, gallery: editingItem.gallery.filter((_:any, i:number) => i !== idx)})} className="p-1.5 bg-red-500/80 text-white rounded-lg hover:bg-red-600 transition-all"><Trash2 size={14} /></button>
                        </div>
                     </div>
                     
                     {/* Index Badge */}
                     <div className="absolute top-2 left-2 bg-black/50 text-white text-[8px] font-black w-4 h-4 flex items-center justify-center rounded-md shadow-sm">
                        {idx + 1}
                     </div>
                  </div>
                ))}
              </div>
              
              {(!editingItem.gallery || editingItem.gallery.length === 0) && (
                <div className="py-12 border-2 border-dashed border-slate-200 rounded-[2rem] text-center flex flex-col items-center justify-center">
                  <ImageIcon className="w-12 h-12 text-slate-200 mb-3 opacity-50" />
                  <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Nenhuma foto na galeria individual</p>
                  <p className="text-[10px] text-slate-300 font-bold uppercase mt-1">Carregue fotos para criar um slider no topo do trilho</p>
                </div>
              )}
            </div>
          </>
        );

      case 'flights':
        return (
          <>
             {commonInput(t('field_airline'), 'airline')}
             {commonInput(t('field_flight_num'), 'flightNumber')}
             {islandSelect('origin')}
             {islandSelect('destination')}
             {commonInput(t('field_dep_time'), 'departureTime', 'time')}
             {commonInput(t('field_arr_time'), 'arrivalTime', 'time')}
             {commonInput(t('item_price'), 'price', 'number')}
             <div>
               <label className="block text-sm font-bold text-slate-700 mb-1">{t('field_status')}</label>
               <select className="w-full border p-2 rounded-lg bg-white" value={editingItem.status} onChange={e => setEditingItem({...editingItem, status: e.target.value})}>
                 <option value="A Horas">A Horas</option>
                 <option value="Atrasado">Atrasado</option>
                 <option value="Embarque">Embarque</option>
                 <option value="Cancelado">Cancelado</option>
               </select>
             </div>
          </>
        );

      case 'hotels':
        return (
          <>
            {commonInput(t('item_name'), 'name')}
            {islandSelect()}
            {commonInput(t('field_stars'), 'stars', 'number')}
            {commonInput(t('price_night'), 'pricePerNight', 'number')}
            <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Tipo de Alojamento</label>
                <select className="w-full border p-2 rounded-lg bg-white font-bold" value={editingItem.type || 'hotel'} onChange={e => setEditingItem({...editingItem, type: e.target.value})}>
                  <option value="hotel">Hotel</option>
                  <option value="al">AL (Alojamento Local)</option>
                </select>
            </div>
            {commonInput('Google Maps Link', 'mapUrl', 'text')}
            {commonInput('Email Público', 'email')}
            {commonInput('Contacto Telefónico', 'phone')}
            {commonInput('Email Admin', 'adminEmail')}
            {commonInput('Password Admin', 'adminPassword')}
            
            {/* Hotel Main Photo */}
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-slate-700 mb-1">{editingItem.type === 'al' ? 'Foto de Perfil da Casa Toda (AL)' : 'Foto de Perfil do Hotel'}</label>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  className="flex-1 border p-2 rounded-lg"
                  value={editingItem.image}
                  onChange={e => setEditingItem({...editingItem, image: e.target.value})}
                  placeholder="URL da imagem..."
                />
                <label className={`cursor-pointer p-2 rounded-lg border flex items-center justify-center transition-all ${isUploading ? 'bg-slate-100 opacity-50' : 'bg-blue-50 border-blue-200 text-blue-600 hover:bg-blue-100'}`}>
                   {isUploading ? <RefreshCw className="w-5 h-5 animate-spin" /> : <ImageIcon className="w-5 h-5" />}
                   <input 
                     type="file" 
                     className="hidden" 
                     accept="image/*,.webp"
                     disabled={isUploading}
                     onChange={e => e.target.files?.[0] && handleImageUpload(e.target.files[0], 'main')}
                   />
                </label>
              </div>
            </div>

            {/* Hotel Gallery Slider */}
            <div className="md:col-span-2 border-t pt-4 mt-2">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h4 className="font-bold uppercase text-xs tracking-widest text-slate-500">{editingItem.type === 'al' ? 'Galeria da Casa Toda (AL - Slider)' : 'Galeria Principal (Slider)'}</h4>
                  <p className="text-[10px] text-slate-400">{editingItem.type === 'al' ? 'Estas fotos aparecerão no carrossel quando o cliente visualizar a Casa Toda' : 'Estas fotos aparecerão no carrossel de fotos do hotel'}</p>
                </div>
                <label className={`cursor-pointer px-4 py-2 rounded-xl text-xs font-black uppercase transition-all flex items-center gap-2 ${isUploading ? 'bg-slate-100 text-slate-400' : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/20'}`}>
                   {isUploading ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Plus className="w-3 h-3" />}
                   Adicionar Fotos
                   <input type="file" className="hidden" multiple accept="image/*,.webp" onChange={e => e.target.files && handleImageUpload(e.target.files, 'gallery')} disabled={isUploading} />
                </label>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {editingItem.gallery?.map((img: string, idx: number) => (
                  <div key={idx} className="relative group aspect-video rounded-xl overflow-hidden border-2 border-white shadow-sm">
                    <img src={img} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                       <button type="button" onClick={() => moveGalleryImage(idx, idx - 1)} className="p-1.5 bg-white/20 rounded-lg hover:bg-white/40 text-white"><ArrowRight className="w-4 h-4 rotate-180" /></button>
                       <button type="button" onClick={() => setEditingItem({...editingItem, gallery: editingItem.gallery.filter((_:any, i:number) => i !== idx)})} className="p-1.5 bg-red-500/80 rounded-lg hover:bg-red-500 text-white"><Trash2 className="w-4 h-4" /></button>
                       <button type="button" onClick={() => moveGalleryImage(idx, idx + 1)} className="p-1.5 bg-white/20 rounded-lg hover:bg-white/40 text-white"><ArrowRight className="w-4 h-4" /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="md:col-span-2">
               <label className="block text-sm font-bold text-slate-700 mb-1">{t('item_desc')}</label>
               <textarea className="w-full border p-2 rounded-lg h-24" value={editingItem.description} onChange={e => setEditingItem({...editingItem, description: e.target.value})} />
            </div>

            {/* Rooms Management */}
            <div className="md:col-span-2 border-t pt-6 mt-4">
              <div className="flex justify-between items-center mb-6">
                 <div>
                   <h4 className="text-lg font-black text-slate-800 uppercase tracking-tighter">Gestão de Quartos</h4>
                   <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Adicione e edite os tipos de quartos disponíveis</p>
                 </div>
                 <div className="flex gap-2">
                    <button type="button" onClick={applyStandardRooms} className="px-4 py-2 bg-emerald-500 text-white rounded-xl text-[10px] font-black uppercase shadow-lg shadow-emerald-500/20 hover:bg-emerald-600 transition-all flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      Padronizar (3 Tipos)
                    </button>
                    <button type="button" onClick={addRoom} className="px-6 py-2 bg-blue-600 text-white rounded-xl text-xs font-black uppercase shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all">+ Novo Quarto</button>
                 </div>
              </div>
              
              <div className="space-y-8">
                {editingItem.rooms?.map((room: Room, rIdx: number) => (
                  <div key={rIdx} className="bg-slate-50 p-6 rounded-[2rem] border-2 border-slate-100 space-y-4 relative group">
                    <button type="button" onClick={() => removeRoom(rIdx)} className="absolute top-4 right-4 text-red-500 hover:text-red-700 transition-colors">
                      <Trash2 className="w-5 h-5" />
                    </button>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-black uppercase text-slate-400 mb-1 ml-2">Nome do Quarto</label>
                        <input type="text" className="w-full border p-2 rounded-xl" value={room.name} onChange={e => updateRoom(rIdx, 'name', e.target.value)} />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black uppercase text-slate-400 mb-1 ml-2">Preço por Noite (€)</label>
                        <input type="number" className="w-full border p-2 rounded-xl" value={room.pricePerNight} onChange={e => updateRoom(rIdx, 'pricePerNight', Number(e.target.value))} />
                      </div>
                      
                      {/* Room Main Photo */}
                      <div className="md:col-span-2">
                        <label className="block text-[10px] font-black uppercase text-slate-400 mb-1 ml-2">{editingItem.type === 'al' ? 'Foto de Perfil do Quarto (Apenas Quarto)' : 'Foto de Perfil do Quarto'}</label>
                        <div className="flex gap-2">
                          <input type="text" className="flex-1 border p-2 rounded-xl text-xs" value={room.image} onChange={e => updateRoom(rIdx, 'image', e.target.value)} placeholder="URL..." />
                          <label className={`cursor-pointer p-2 rounded-xl border flex items-center justify-center transition-all ${isUploading ? 'bg-slate-100 opacity-50' : 'bg-white border-slate-200 text-blue-600 hover:bg-blue-50'}`}>
                             {isUploading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <ImageIcon className="w-4 h-4" />}
                             <input type="file" className="hidden" accept="image/*,.webp" disabled={isUploading} onChange={e => e.target.files?.[0] && handleImageUpload(e.target.files[0], 'room_main', rIdx)} />
                          </label>
                        </div>
                      </div>

                      {/* Room Gallery */}
                      <div className="md:col-span-2">
                        <div className="flex justify-between items-center mb-2">
                          <label className="block text-[10px] font-black uppercase text-slate-400 ml-2">{editingItem.type === 'al' ? 'Galeria do Quarto (Apenas Quarto)' : 'Galeria do Quarto'}</label>
                          <label className={`cursor-pointer px-3 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all flex items-center gap-1 ${isUploading ? 'bg-slate-100 text-slate-400' : 'bg-slate-800 text-white hover:bg-slate-900 shadow-md'}`}>
                             {isUploading ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Plus className="w-3 h-3" />}
                             Fotos
                             <input type="file" className="hidden" multiple accept="image/*,.webp" onChange={e => e.target.files && handleImageUpload(e.target.files, 'room_gallery', rIdx)} disabled={isUploading} />
                          </label>
                        </div>
                        <div className="flex gap-2 overflow-x-auto py-2">
                          {room.gallery?.map((img, iIdx) => (
                            <div key={iIdx} className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 group">
                              <img src={img} className="w-full h-full object-cover" />
                              <button type="button" onClick={() => {
                                const newGal = room.gallery?.filter((_, i) => i !== iIdx);
                                updateRoom(rIdx, 'gallery', newGal);
                              }} className="absolute inset-0 bg-red-500/80 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-[10px] font-black uppercase text-slate-400 mb-1 ml-2">Descrição do Quarto</label>
                        <textarea className="w-full border p-2 rounded-xl h-20 text-xs" value={room.description} onChange={e => updateRoom(rIdx, 'description', e.target.value)} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        );

      case 'cars':
        return (
          <>
            {commonInput('Nome da Companhia', 'name')}
            {islandSelect()}
            {commonInput('Morada / Ponto de Recolha', 'address', 'text', true)}
            {commonInput('Email Público', 'email')}
            {commonInput('Contacto Telefónico', 'contact')}
            {commonInput('Email Admin', 'adminEmail')}
            {commonInput('Password Admin', 'adminPassword')}
            
            {/* Company Logo Upload */}
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-slate-700 mb-1">Logo da Companhia (URL ou Upload)</label>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  className="flex-1 border p-2 rounded-lg"
                  value={editingItem.image}
                  onChange={e => setEditingItem({...editingItem, image: e.target.value})}
                  placeholder="URL do logo..."
                />
                <label className={`cursor-pointer p-2 rounded-lg border flex items-center justify-center transition-all ${isUploading ? 'bg-slate-100 opacity-50' : 'bg-blue-50 border-blue-200 text-blue-600 hover:bg-blue-100'}`}>
                   {isUploading ? <RefreshCw className="w-5 h-5 animate-spin" /> : <ImageIcon className="w-5 h-5" />}
                   <input 
                     type="file" 
                     className="hidden" 
                     accept="image/*,.webp"
                     disabled={isUploading}
                     onChange={e => e.target.files?.[0] && handleImageUpload(e.target.files[0], 'main')}
                   />
                </label>
              </div>
            </div>
            
            {/* Rentcar Gallery Section */}
            <div className="md:col-span-2 border-t pt-4 mt-2">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h4 className="font-bold uppercase text-xs tracking-widest text-slate-500">Galeria da Companhia (Slider)</h4>
                  <p className="text-[10px] text-slate-400">Estas fotos aparecerão no slider da Rent-a-car</p>
                </div>
                <label className={`cursor-pointer px-4 py-2 rounded-xl text-xs font-black uppercase transition-all flex items-center gap-2 ${isUploading ? 'bg-slate-100 text-slate-400' : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/20'}`}>
                   {isUploading ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Plus className="w-3 h-3" />}
                   Adicionar Fotos
                   <input type="file" className="hidden" multiple accept="image/*,.webp" onChange={e => e.target.files && handleImageUpload(e.target.files, 'gallery')} disabled={isUploading} />
                </label>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {editingItem.gallery?.map((img: string, idx: number) => (
                  <div key={idx} className="relative group aspect-video rounded-xl overflow-hidden border-2 border-white shadow-sm">
                    <img src={img} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                       <button type="button" onClick={() => moveGalleryImage(idx, idx - 1)} className="p-1.5 bg-white/20 rounded-lg hover:bg-white/40 text-white"><ArrowRight className="w-4 h-4 rotate-180" /></button>
                       <button type="button" onClick={() => setEditingItem({...editingItem, gallery: editingItem.gallery.filter((_:any, i:number) => i !== idx)})} className="p-1.5 bg-red-500/80 rounded-lg hover:bg-red-500 text-white"><Trash2 className="w-4 h-4" /></button>
                       <button type="button" onClick={() => moveGalleryImage(idx, idx + 1)} className="p-1.5 bg-white/20 rounded-lg hover:bg-white/40 text-white"><ArrowRight className="w-4 h-4" /></button>
                    </div>
                  </div>
                ))}
                {(!editingItem.gallery || editingItem.gallery.length === 0) && (
                  <div className="col-span-full py-8 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center text-slate-400 italic text-sm">
                    <ImageIcon className="w-8 h-8 mb-2 opacity-20" />
                    Nenhuma foto na galeria
                  </div>
                )}
              </div>
            </div>

            <div className="md:col-span-2">
               <label className="block text-sm font-bold text-slate-700 mb-1">Descrição</label>
               <textarea className="w-full border p-2 rounded-lg h-24" value={editingItem.description} onChange={e => setEditingItem({...editingItem, description: e.target.value})} />
            </div>

            <div className="md:col-span-2 border-t pt-6 mt-4">
              <div className="flex justify-between items-center mb-6">
                 <div>
                   <h4 className="text-lg font-black text-slate-800 uppercase tracking-tighter">Gestão da Frota</h4>
                   <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Adicione e edite os veículos desta companhia</p>
                 </div>
                 <button type="button" onClick={addCar} className="px-6 py-2 bg-blue-600 text-white rounded-xl text-xs font-black uppercase shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all">+ Nova Viatura</button>
              </div>
              
              <div className="space-y-6">
                {editingItem.cars?.map((car: Car, idx: number) => (
                  <div key={idx} className="bg-slate-50 p-6 rounded-[2rem] border-2 border-slate-100 space-y-4 relative group">
                    <button type="button" onClick={() => removeCar(idx)} className="absolute top-4 right-4 text-red-500 hover:text-red-700 transition-colors">
                      <Trash2 className="w-5 h-5" />
                    </button>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="md:col-span-2">
                        <label className="block text-[10px] font-black uppercase text-slate-400 mb-1 ml-1">Modelo do Veículo</label>
                        <input className="w-full border-2 border-white p-3 rounded-xl font-bold text-sm shadow-sm" placeholder="Ex: Renault Clio" value={car.model} onChange={e => updateCar(idx, 'model', e.target.value)} />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black uppercase text-slate-400 mb-1 ml-1">Tipo</label>
                        <select className="w-full border-2 border-white p-3 rounded-xl font-bold text-sm shadow-sm bg-white" value={car.type} onChange={e => updateCar(idx, 'type', e.target.value)}>
                          <option value="Económico">Económico</option>
                          <option value="SUV">SUV</option>
                          <option value="Descapotável">Descapotável</option>
                          <option value="Carrinha">Carrinha</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-black uppercase text-slate-400 mb-1 ml-1">Combustível</label>
                        <select className="w-full border-2 border-white p-3 rounded-xl font-bold text-sm shadow-sm bg-white" value={car.fuelType} onChange={e => updateCar(idx, 'fuelType', e.target.value)}>
                          <option value="Gasolina">Gasolina</option>
                          <option value="Gasóleo">Gasóleo</option>
                          <option value="Híbrido">Híbrido</option>
                          <option value="Elétrico">Elétrico</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-black uppercase text-slate-400 mb-1 ml-1">Lugares</label>
                        <input className="w-full border-2 border-white p-3 rounded-xl font-bold text-sm shadow-sm" type="number" value={car.seats} onChange={e => updateCar(idx, 'seats', parseInt(e.target.value))} />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black uppercase text-slate-400 mb-1 ml-1">Preço/Dia (€)</label>
                        <input className="w-full border-2 border-white p-3 rounded-xl font-bold text-sm shadow-sm" type="number" value={car.pricePerDay} onChange={e => updateCar(idx, 'pricePerDay', parseFloat(e.target.value))} />
                      </div>
                      <div className="md:col-span-3">
                        <label className="block text-[10px] font-black uppercase text-slate-400 mb-1 ml-1">Foto do Veículo (URL ou Upload)</label>
                        <div className="flex gap-2">
                          <input 
                            className="flex-1 border-2 border-white p-3 rounded-xl font-bold text-sm shadow-sm" 
                            placeholder="URL da foto..." 
                            value={car.image} 
                            onChange={e => updateCar(idx, 'image', e.target.value)} 
                          />
                          <label className={`cursor-pointer px-4 rounded-xl border flex items-center justify-center transition-all ${isUploading ? 'bg-slate-100 opacity-50' : 'bg-white border-blue-100 text-blue-600 hover:bg-blue-50'}`}>
                             {isUploading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <ImageIcon className="w-4 h-4" />}
                             <input 
                               type="file" 
                               className="hidden" 
                               accept="image/*,.webp"
                               disabled={isUploading}
                               onChange={e => e.target.files?.[0] && handleImageUpload(e.target.files[0], 'car', idx)}
                             />
                          </label>
                        </div>
                      </div>

                      <div className="md:col-span-3">
                        <label className="block text-[10px] font-black uppercase text-slate-400 mb-1 ml-1">Descrição/Informações do Veículo</label>
                        <textarea 
                          className="w-full border-2 border-white p-3 rounded-xl font-bold text-sm shadow-sm h-24" 
                          placeholder="Detalhes sobre o carro..." 
                          value={car.description} 
                          onChange={e => updateCar(idx, 'description', e.target.value)} 
                        />
                      </div>

                      {/* Car Gallery */}
                      <div className="md:col-span-3">
                        <div className="flex justify-between items-center mb-2">
                           <label className="block text-[10px] font-black uppercase text-slate-400 ml-1">Galeria de Fotos do Veículo</label>
                           <label className={`cursor-pointer px-3 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all flex items-center gap-1 ${isUploading ? 'bg-slate-100 text-slate-400' : 'bg-slate-800 text-white hover:bg-slate-900 shadow-md'}`}>
                              {isUploading ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Plus className="w-3 h-3" />}
                              Fotos
                              <input type="file" className="hidden" multiple accept="image/*,.webp" onChange={e => e.target.files && handleImageUpload(e.target.files, 'car_gallery', idx)} disabled={isUploading} />
                           </label>
                        </div>
                        <div className="flex gap-2 overflow-x-auto py-2">
                          {car.gallery?.map((img, iIdx) => (
                            <div key={iIdx} className="relative w-24 h-16 rounded-lg overflow-hidden flex-shrink-0 group border-2 border-white shadow-sm">
                              <img src={img} className="w-full h-full object-cover" />
                              <button type="button" onClick={() => {
                                const newGal = car.gallery?.filter((_, i) => i !== iIdx);
                                updateCar(idx, 'gallery', newGal);
                              }} className="absolute inset-0 bg-red-500/80 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        );

      case 'buses':
        return (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase mb-1">Companhia</label>
                <select 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-bold"
                  value={editingItem.company || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, company: e.target.value })}
                >
                  <option value="">Selecionar Companhia...</option>
                  <option value="Varela">Varela</option>
                  <option value="CRP">CRP (Caetano, Raposo & Pereiras)</option>
                  <option value="AVM">AVM (Auto Viação Micaelense)</option>
                </select>
              </div>
              {islandSelect()}
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-4">
              {commonInput('Origem', 'origin')}
              {commonInput('Destino', 'destination')}
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
              {commonInput(t('item_price'), 'price', 'number')}
              {commonInput('Duração (ex: 45m)', 'duration')}
            </div>

            <div className="space-y-4 mt-8 p-6 bg-slate-900 rounded-[2.5rem] border border-white/5 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <Bus size={120} className="text-white" />
              </div>
              
              <div className="relative z-10">
                <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-blue-400 mb-6 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                  Configuração de Horários
                </h4>
                
                <div className="grid gap-6">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex justify-between">
                      <span>Dias Úteis (Segunda a Sexta)</span>
                      <span className="text-slate-600 font-mono">Separar por vírgula</span>
                    </label>
                    <textarea 
                      className="w-full bg-slate-800 border border-slate-700 rounded-2xl p-4 text-xs font-mono text-white placeholder-slate-600 focus:ring-2 focus:ring-blue-500/50 outline-none transition-all"
                      rows={3}
                      value={editingItem.schedule?.weekdays?.join(', ') || ''}
                      onChange={(e) => {
                        const times = e.target.value.split(',').map(t => t.trim()).filter(t => t);
                        setEditingItem({
                          ...editingItem,
                          schedule: { ...editingItem.schedule, weekdays: times },
                          times: times // Sync with flat times for legacy support
                        });
                      }}
                      placeholder="Ex: 07:00, 08:30, 12:15, 17:40..."
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Sábados</label>
                      <textarea 
                        className="w-full bg-slate-800 border border-slate-700 rounded-2xl p-4 text-xs font-mono text-white placeholder-slate-600 focus:ring-2 focus:ring-blue-500/50 outline-none transition-all"
                        rows={3}
                        value={editingItem.schedule?.saturdays?.join(', ') || ''}
                        onChange={(e) => {
                          const times = e.target.value.split(',').map(t => t.trim()).filter(t => t);
                          setEditingItem({
                            ...editingItem,
                            schedule: { ...editingItem.schedule, saturdays: times }
                          });
                        }}
                        placeholder="Ex: 09:00, 13:30..."
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Domingos / Feriados</label>
                      <textarea 
                        className="w-full bg-slate-800 border border-slate-700 rounded-2xl p-4 text-xs font-mono text-white placeholder-slate-600 focus:ring-2 focus:ring-blue-500/50 outline-none transition-all"
                        rows={3}
                        value={editingItem.schedule?.sundays?.join(', ') || ''}
                        onChange={(e) => {
                          const times = e.target.value.split(',').map(t => t.trim()).filter(t => t);
                          setEditingItem({
                            ...editingItem,
                            schedule: { ...editingItem.schedule, sundays: times }
                          });
                        }}
                        placeholder="Ex: 10:00, 16:00..."
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        );
    }
  };

  const getListItems = () => {
    let list: any[] = [];
    switch (activeTab) {
      case 'restaurants': 
        list = restaurants; 
        if (cuisineFilter !== 'all') {
          list = list.filter(r => r.cuisine === cuisineFilter);
        }
        break;
      case 'shops': list = shopsFilter === 'all' ? shops : shops.filter(s => s.subcategory === shopsFilter); break;
      case 'beauty': list = beautyFilter === 'all' ? beauty : beauty.filter(b => b.subcategory === beautyFilter); break;
      case 'services': list = servicesFilter === 'all' ? services : services.filter(s => s.subcategory === servicesFilter); break;
      case 'auto_repairs': list = autoRepairsFilter === 'all' ? autoRepairs : autoRepairs.filter(a => a.subcategory === autoRepairsFilter); break;
      case 'auto_electronics': list = autoElectronics; break;
      case 'used_market': list = usedMarket; break;
      case 'animals': list = animals; break;
      case 'real_estate': list = realEstate; break;
      case 'gyms': list = gyms; break;
      case 'stands': list = stands; break;
      case 'offices': list = offices; break;
      case 'it_services': list = itServices; break;
      case 'perfumes': list = perfumes; break;
      case 'bars': list = bars; break;
      case 'events': list = events; break;
      case 'municipal': list = municipal; break;
      case 'activities': list = activities.filter(a => a.type === 'activity' || a.type === 'culture'); break;
      case 'trails': list = activities.filter(a => a.type === 'trail'); break;
      case 'poi': list = activities.filter(a => a.type === 'poi' || a.type === 'landscape'); break;
      case 'flights': list = flights; break;
      case 'hotels': list = hotelFilter === 'all' ? hotels : hotels.filter(h => h.type === hotelFilter); break;
      case 'cars': list = cars; break;
      case 'buses': list = busSchedules; break;
      case 'customers': list = users; break;
      case 'marketplace': list = marketplaceCategories || []; break;
      default: list = [];
    }

    if (islandFilter !== 'all') {
    list = list.filter(item => { const itemIsland = item.island || (item.location && islandMapping[item.location]); return itemIsland === islandFilter; });
    }
    return list;
  };

  const getItemName = (item: any) => {
    if (activeTab === 'flights') return `${item.airline} ${item.flightNumber} (${item.origin}->${item.destination})`;
    if (activeTab === 'buses') return `${item.company}: ${item.origin} -> ${item.destination}`;
    if (activeTab === 'itineraries') return `Roteiro: ${item.id}`;
    if (activeTab === 'trails') return item.title || 'Trilho sem nome';
    if (activeTab === 'poi') return item.title || 'Ponto Turístico sem nome';
    if (activeTab === 'cars') return item.name || 'Companhia Rent-a-car';
    if (activeTab === 'marketplace') return item.label || 'Sem Nome';
    return item.name || item.title || item.model || 'Sem Nome';
  };

  const getTabTitle = () => {
    const titles: any = {
      'restaurants': 'Restaurantes',
      'accommodation': 'Alojamentos',
      'rentcar': 'Rent-a-car',
      'activities': 'Atividades',
      'trails': 'Trilhos',
      'poi': 'Pontos Turísticos',
      'flights': 'Voos',
      'buses': 'Autocarros',
      'shops': 'Lojas',
      'beauty': 'Beleza & Estética',
      'services': 'Serviços Diversos',
      'auto_repair': 'Oficinas',
      'auto_electronics': 'Eletricidade Auto',
      'used_market': 'Mercado de Usados',
      'animals': 'Animais',
      'real_estate': 'Imobiliária',
      'gyms': 'Ginásios',
      'stands': 'Stands de Automóveis',
      'offices': 'Escritórios & Cowork',
      'it_services': 'Serviços IT',
      'perfumes': 'Perfumes & Fragrâncias',
      'bars': 'Bares & Noite',
      'events': 'Eventos & Espetáculos',
      'municipal': 'Serviços Municipais',
      'marketplace': 'Classificados (Marketplace)',
      'customers': 'Gestão de Clientes'
    };
    return titles[activeTab as string] || activeTab?.toUpperCase() || 'Painel';
  };

  // Helper to inject data into the DOM if needed for debug/export
  const injectData = (data: any) => {
    console.log('Injected Data:', data);
    return JSON.stringify(data);
  };

  // Helper to get items for the main list view (excluding configs)
  const getVisibleItems = () => {
    return getListItems().filter(item => !item.id?.startsWith('CONFIG_SLIDER_'));
  };

  const injectTrailExamples = async () => {
    const examples = [
      { id: "trail_agriao", title: "Agrião (PR12SMI)", type: "trail", island: "São Miguel", image: "https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?auto=format&fit=crop&q=80&w=800", description: "Percurso linear que liga a Povoação à Ribeira Quente, oferecendo vistas deslumbrantes sobre a costa sul.", distance: "7,1 Km", duration: "3h00", difficulty: "Moderado", address: "Povoação, Ribeira Quente", gallery: [] },
      { id: "trail_agua_retorta", title: "Água Retorta (PRC13SMI)", type: "trail", island: "São Miguel", image: "https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?auto=format&fit=crop&q=80&w=800", description: "Trilho circular em Água Retorta que atravessa zonas de floresta densa e paisagens rurais tradicionais.", distance: "5,1 Km", duration: "2h00", difficulty: "Moderado", address: "Povoação, Água Retorta", gallery: [] },
      { id: "trail_atalho_vermelhos", title: "Atalho dos Vermelhos (PRC33SMI)", type: "trail", island: "São Miguel", image: "https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?auto=format&fit=crop&q=80&w=800", description: "Percurso circular no Pilar da Bretanha com vistas panorâmicas sobre a costa norte da ilha.", distance: "5,4 Km", duration: "2h00", difficulty: "Moderado", address: "Ponta Delgada, Pilar da Bretanha", gallery: [] },
      { id: "trail_salto_cabrito", title: "Salto do Cabrito (PRC29SMI)", type: "trail", island: "São Miguel", image: "https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?auto=format&fit=crop&q=80&w=800", description: "Trilho circular que passa pelas Caldeiras da Ribeira Grande e pela deslumbrante cascata do Salto do Cabrito.", distance: "8,6 Km", duration: "3h00", difficulty: "Moderado", address: "Ribeira Grande, Matriz", gallery: [] },
      { id: "trail_cha_gorreana", title: "Chá Gorreana (PRC28SMI)", type: "trail", island: "São Miguel", image: "https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?auto=format&fit=crop&q=80&w=800", description: "Percurso circular pelas plantações de chá da Gorreana, as únicas na Europa, com vistas sobre o mar.", distance: "3,3 Km", duration: "1h30", difficulty: "Fácil", address: "Ribeira Grande, Maia", gallery: [] },
      { id: "trail_faja_mar", title: "Fajã do Mar (PRC46SMI)", type: "trail", island: "São Miguel", image: "https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?auto=format&fit=crop&q=80&w=800", description: "Trilho circular nas Feteiras que desce até à zona costeira, revelando a beleza das fajãs açorianas.", distance: "5 Km", duration: "2h30", difficulty: "Moderado", address: "Ponta Delgada, Feteiras", gallery: [] },
      { id: "trail_lagoa_furnas", title: "Lagoa das Furnas (PRC06SMI)", type: "trail", island: "São Miguel", image: "https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?auto=format&fit=crop&q=80&w=800", description: "Passeio circular em redor da Lagoa das Furnas, passando pelas famosas caldeiras e pela capela de N. Sra. das Vitórias.", distance: "9,4 Km", duration: "3h00", difficulty: "Fácil", address: "Povoação, Furnas", gallery: [] }
    ];

    if (window.confirm("Deseja injetar os 7 trilhos de exemplo na base de dados?")) {
      const updatedActivities = [...activities];
      examples.forEach(ex => {
        if (!updatedActivities.find(a => a.id === ex.id)) {
          updatedActivities.push(ex as any);
        }
      });
      onUpdateActivities(updatedActivities);
      markCategoryAsModified('trails');
      markCategoryAsModified('activities');
      
      // Sync to cloud immediately
      try {
        await fetch(`${API_BASE_URL}/api/activities/bulk?mode=merge`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(examples.map(ex => ({ ...ex, internalId: 'INT_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5) })))
        });
        alert("Trilhos injetados e sincronizados com a Cloud!");
      } catch (err) {
        alert("Trilhos adicionados localmente. Clique em Sincronizar para enviar para a Cloud.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex font-sans">
      {/* Upload Progress Overlay */}
      <AnimatePresence>
        {isUploading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1000] flex items-center justify-center bg-slate-900/80 backdrop-blur-md p-6"
          >
            <div className="bg-white rounded-[3rem] p-10 w-full max-w-md shadow-2xl border border-white/20 text-center space-y-6">
              <div className="relative w-24 h-24 mx-auto">
                <svg className="w-full h-full rotate-[-90deg]">
                  <circle
                    cx="48" cy="48" r="40"
                    className="stroke-slate-100 fill-none"
                    strokeWidth="8"
                  />
                  <motion.circle
                    cx="48" cy="48" r="40"
                    className="stroke-blue-600 fill-none"
                    strokeWidth="8"
                    strokeDasharray="251.2"
                    initial={{ strokeDashoffset: 251.2 }}
                    animate={{ strokeDashoffset: 251.2 - (251.2 * (uploadProgress.current / uploadProgress.total)) }}
                    transition={{ duration: 0.5 }}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xl font-black text-slate-800">
                    {uploadProgress.total > 0 ? Math.round((uploadProgress.current / uploadProgress.total) * 100) : 0}%
                  </span>
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-black text-slate-800 uppercase tracking-tighter">A Otimizar Imagens</h3>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Transformando em WebP de Alta Performance</p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">
                  <span>{uploadProgress.label}</span>
                  <span>{uploadProgress.current}/{uploadProgress.total}</span>
                </div>
                <div className="h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                  <motion.div 
                    className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg"
                    initial={{ width: 0 }}
                    animate={{ width: `${uploadProgress.total > 0 ? (uploadProgress.current / uploadProgress.total) * 100 : 0}%` }}
                  />
                </div>
              </div>

              <p className="text-[9px] text-slate-400 italic font-medium leading-relaxed">
                Este processo reduz o tamanho dos ficheiros mantendo a qualidade máxima, garantindo que o seu site carregue instantaneamente.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col fixed h-full z-20 overflow-y-auto">
        <div className="p-6 border-b border-slate-800">
           <h2 className="text-xl font-bold flex items-center gap-2">
             <LayoutDashboard className="text-blue-500" /> Admin v1.2.1
           </h2>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {/* DASHBOARD - SALIENTE E NO TOPO */}
          <button 
            onClick={() => { setActiveTab('dashboard'); setEditingItem(null); setShowOtherTabs(false); }} 
            className={`w-full text-left p-4 rounded-2xl flex items-center gap-3 transition-all ${activeTab === 'dashboard' ? 'bg-gradient-to-r from-indigo-600 to-blue-600 shadow-xl shadow-blue-900/40 text-white' : 'bg-white/5 text-slate-400 hover:bg-white/10'}`}
          >
            <LayoutDashboard className={`w-6 h-6 ${activeTab === 'dashboard' ? 'text-white' : 'text-blue-500'}`} /> 
            <span className="font-black uppercase tracking-widest text-xs">Dashboard</span>
          </button>

          <button 
            onClick={() => { setActiveTab('customers'); setEditingItem(null); setShowOtherTabs(false); }} 
            className={`w-full text-left p-4 rounded-2xl flex items-center gap-3 transition-all mt-2 ${activeTab === 'customers' ? 'bg-gradient-to-r from-emerald-600 to-teal-600 shadow-xl shadow-emerald-900/40 text-white' : 'bg-white/5 text-slate-400 hover:bg-white/10'}`}
          >
            <Users className={`w-6 h-6 ${activeTab === 'customers' ? 'text-white' : 'text-emerald-500'}`} /> 
            <span className="font-black uppercase tracking-widest text-xs">Clientes</span>
          </button>

          <button 
            onClick={() => { setActiveTab('marketplace'); setEditingItem(null); setShowOtherTabs(false); }} 
            className={`w-full text-left p-4 rounded-2xl flex items-center gap-3 transition-all mt-2 ${activeTab === 'marketplace' ? 'bg-gradient-to-r from-orange-600 to-amber-600 shadow-xl shadow-orange-900/40 text-white' : 'bg-white/5 text-slate-400 hover:bg-white/10'}`}
          >
            <ShoppingCart className={`w-6 h-6 ${activeTab === 'marketplace' ? 'text-white' : 'text-orange-500'}`} /> 
            <span className="font-black uppercase tracking-widest text-xs">Marketplace</span>
          </button>
          
          <div className="h-px bg-slate-800/50 my-4 mx-2"></div>

          {/* MAIN TABS */}
          <button onClick={() => { setActiveTab('restaurants'); setEditingItem(null); setShowOtherTabs(false); }} className={`w-full text-left p-3 rounded-xl flex items-center gap-3 transition-all ${activeTab === 'restaurants' ? 'bg-blue-600 shadow-lg text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
            <Utensils className="w-5 h-5" /> Restaurantes
          </button>

          <button onClick={() => { setActiveTab('buses'); setEditingItem(null); setShowOtherTabs(false); }} className={`w-full text-left p-3 rounded-xl flex items-center gap-3 transition-all ${activeTab === 'buses' ? 'bg-blue-600 shadow-lg text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
            <Bus className="w-5 h-5" /> Autocarros
          </button>

          <button onClick={() => { setActiveTab('cars'); setEditingItem(null); setShowOtherTabs(false); }} className={`w-full text-left p-3 rounded-xl flex items-center gap-3 transition-all ${activeTab === 'cars' ? 'bg-blue-600 shadow-lg text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
            <CarIcon className="w-5 h-5" /> Rentcar
          </button>

          <button onClick={() => { setActiveTab('hotels'); setEditingItem(null); setShowOtherTabs(false); }} className={`w-full text-left p-3 rounded-xl flex items-center gap-3 transition-all ${activeTab === 'hotels' ? 'bg-blue-600 shadow-lg text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
            <BedDouble className="w-5 h-5" /> Alojamentos
          </button>

          <button onClick={() => { setActiveTab('activities'); setEditingItem(null); setShowOtherTabs(false); }} className={`w-full text-left p-3 rounded-xl flex items-center gap-3 transition-all ${activeTab === 'activities' ? 'bg-blue-600 shadow-lg text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
            <Mountain className="w-5 h-5" /> Atividades
          </button>

          <button onClick={() => { setActiveTab('trails'); setEditingItem(null); setShowOtherTabs(false); }} className={`w-full text-left p-3 rounded-xl flex items-center gap-3 transition-all ${activeTab === 'trails' ? 'bg-blue-600 shadow-lg text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
            <MapPin className="w-5 h-5" /> Trilhos
          </button>
          
          <button onClick={() => { setActiveTab('poi'); setEditingItem(null); setShowOtherTabs(false); }} className={`w-full text-left p-3 rounded-xl flex items-center gap-3 transition-all ${activeTab === 'poi' ? 'bg-blue-600 shadow-lg text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
            <ImageIcon className="w-5 h-5" /> Pontos Turísticos
          </button>

          {/* OUTROS BUTTON */}
          <button 
            onClick={() => setShowOtherTabs(!showOtherTabs)} 
            className={`w-full text-left p-4 mt-6 rounded-2xl flex items-center justify-between transition-all border-2 ${showOtherTabs ? 'bg-slate-800 border-blue-500' : 'bg-slate-800/30 border-white/5 hover:bg-slate-800'}`}
          >
            <div className="flex items-center gap-3">
              <Settings className="w-5 h-5 text-slate-400" /> 
              <span className="font-black uppercase tracking-widest text-[10px] text-slate-400">Outros Serviços</span>
            </div>
            <ArrowRight size={16} className={`text-slate-500 transition-transform duration-500 ${showOtherTabs ? 'rotate-90' : ''}`} />
          </button>

          {/* OTHER TABS SLIDER (ACCORDION STYLE) */}
          <AnimatePresence>
            {showOtherTabs && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden space-y-1 mt-2 pl-4"
              >
                <button onClick={() => { setActiveTab('shops'); setEditingItem(null); }} className={`w-full text-left p-2 rounded-lg flex items-center gap-3 text-xs ${activeTab === 'shops' ? 'text-white' : 'text-slate-400 hover:text-white'}`}>
                  <ShoppingBag size={14} /> Lojas Regionais
                </button>
                <button onClick={() => { setActiveTab('beauty'); setEditingItem(null); }} className={`w-full text-left p-2 rounded-lg flex items-center gap-3 text-xs ${activeTab === 'beauty' ? 'text-white' : 'text-slate-400 hover:text-white'}`}>
                  <Sparkles size={14} /> Beleza
                </button>
                <button onClick={() => { setActiveTab('services'); setEditingItem(null); }} className={`w-full text-left p-2 rounded-lg flex items-center gap-3 text-xs ${activeTab === 'services' ? 'text-white' : 'text-slate-400 hover:text-white'}`}>
                  <Briefcase size={14} /> Serviços Técnicos
                </button>
                <button onClick={() => { setActiveTab('auto_repairs'); setEditingItem(null); }} className={`w-full text-left p-2 rounded-lg flex items-center gap-3 text-xs ${activeTab === 'auto_repairs' ? 'text-white' : 'text-slate-400 hover:text-white'}`}>
                  <Wrench size={14} /> Reparação Auto
                </button>
                <button onClick={() => { setActiveTab('auto_electronics'); setEditingItem(null); }} className={`w-full text-left p-2 rounded-lg flex items-center gap-3 text-xs ${activeTab === 'auto_electronics' ? 'text-white' : 'text-slate-400 hover:text-white'}`}>
                  <Zap size={14} /> Eletrónica Auto
                </button>
                <button onClick={() => { setActiveTab('used_market'); setEditingItem(null); }} className={`w-full text-left p-2 rounded-lg flex items-center gap-3 text-xs ${activeTab === 'used_market' ? 'text-white' : 'text-slate-400 hover:text-white'}`}>
                  <ShoppingCart size={14} /> Mercado Usados
                </button>
                <button onClick={() => { setActiveTab('animals'); setEditingItem(null); }} className={`w-full text-left p-2 rounded-lg flex items-center gap-3 text-xs ${activeTab === 'animals' ? 'text-white' : 'text-slate-400 hover:text-white'}`}>
                  <Dog size={14} /> Animais
                </button>
                <button onClick={() => { setActiveTab('real_estate'); setEditingItem(null); }} className={`w-full text-left p-2 rounded-lg flex items-center gap-3 text-xs ${activeTab === 'real_estate' ? 'text-white' : 'text-slate-400 hover:text-white'}`}>
                  <Building2 size={14} /> Imobiliárias
                </button>
                <button onClick={() => { setActiveTab('gyms'); setEditingItem(null); }} className={`w-full text-left p-2 rounded-lg flex items-center gap-3 text-xs ${activeTab === 'gyms' ? 'text-white' : 'text-slate-400 hover:text-white'}`}>
                  <Dumbbell size={14} /> Ginásios
                </button>
                <button onClick={() => { setActiveTab('stands'); setEditingItem(null); }} className={`w-full text-left p-2 rounded-lg flex items-center gap-3 text-xs ${activeTab === 'stands' ? 'text-white' : 'text-slate-400 hover:text-white'}`}>
                  <CarFront size={14} /> Stands
                </button>
                <button onClick={() => { setActiveTab('offices'); setEditingItem(null); }} className={`w-full text-left p-2 rounded-lg flex items-center gap-3 text-xs ${activeTab === 'offices' ? 'text-white' : 'text-slate-400 hover:text-white'}`}>
                  <Building2 size={14} /> Escritórios
                </button>
                <button onClick={() => { setActiveTab('it_services'); setEditingItem(null); }} className={`w-full text-left p-2 rounded-lg flex items-center gap-3 text-xs ${activeTab === 'it_services' ? 'text-white' : 'text-slate-400 hover:text-white'}`}>
                  <Laptop size={14} /> Informática
                </button>
                <button onClick={() => { setActiveTab('perfumes'); setEditingItem(null); }} className={`w-full text-left p-2 rounded-lg flex items-center gap-3 text-xs ${activeTab === 'perfumes' ? 'text-white' : 'text-slate-400 hover:text-white'}`}>
                  <Pipette size={14} /> Perfumaria
                </button>
                <button onClick={() => { setActiveTab('bars'); setEditingItem(null); }} className={`w-full text-left p-2 rounded-lg flex items-center gap-3 text-xs ${activeTab === 'bars' ? 'text-white' : 'text-slate-400 hover:text-white'}`}>
                  <Wine size={14} /> Bares/Noite
                </button>
                <button onClick={() => { setActiveTab('events'); setEditingItem(null); }} className={`w-full text-left p-2 rounded-lg flex items-center gap-3 text-xs ${activeTab === 'events' ? 'text-white' : 'text-slate-400 hover:text-white'}`}>
                  <Calendar size={14} /> Eventos
                </button>
                <button onClick={() => { setActiveTab('municipal'); setEditingItem(null); }} className={`w-full text-left p-2 rounded-lg flex items-center gap-3 text-xs ${activeTab === 'municipal' ? 'text-white' : 'text-slate-400 hover:text-white'}`}>
                  <Landmark size={14} /> Serviços Municipais
                </button>
                <button onClick={() => { setActiveTab('flights'); setEditingItem(null); }} className={`w-full text-left p-2 rounded-lg flex items-center gap-3 text-xs ${activeTab === 'flights' ? 'text-white' : 'text-slate-400 hover:text-white'}`}>
                  <Plane size={14} /> Voos
                </button>
                <button onClick={() => { setActiveTab('suppliers'); setEditingItem(null); }} className={`w-full text-left p-2 rounded-lg flex items-center gap-3 text-xs ${activeTab === 'suppliers' ? 'text-white' : 'text-slate-400 hover:text-white'}`}>
                  <Users size={14} /> Fornecedores
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </nav>

        {/* Database Status Badge */}
        <div className="mx-4 mb-4 p-4 rounded-2xl bg-slate-800/50 border border-slate-700/50">
           <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-2">
                <Database size={14} className={dbStatus?.isMongo ? 'text-emerald-400' : 'text-amber-400'} />
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Estado da DB</span>
              </div>
              <button 
                onClick={async () => {
                  if (onFullSync) {
                    setIsSyncing(true);
                    try {
                      await onFullSync();
                      addLog('🔄 Dados sincronizados manualmente do Atlas.');
                    } finally {
                      setIsSyncing(false);
                    }
                  }
                }} 
                disabled={isSyncing}
                className="p-1 hover:bg-slate-700 rounded-md text-slate-400 transition-colors disabled:opacity-50"
                title="Sincronizar com Atlas"
              >
                <RefreshCw size={12} className={isSyncing ? 'animate-spin text-blue-400' : ''} />
              </button>
           </div>            <p className={`text-[11px] font-bold ${dbStatus?.isMongo ? 'text-emerald-500' : 'text-amber-500'}`}>
               {dbStatus?.storage}
            </p>
            {!dbStatus?.isMongo && dbStatus?.storage !== 'A ligar...' && (
              <div className="mt-2 p-2 bg-amber-500/10 rounded-lg border border-amber-500/20">
                 <p className="text-[9px] text-amber-600 leading-tight mb-1">
                   Atenção: Os dados são <b>temporários</b> e serão perdidos ao reiniciar.
                 </p>
                 <p className="text-[8px] text-slate-500">
                   Config: {dbStatus?.isConfigured ? '✅ URI Detetada' : '❌ URI em falta no Render'}
                 </p>
                 <p className="text-[8px] text-slate-500">
                   Ligação: {dbStatus?.isMongo ? '✅ Ativa' : '❌ Falhou'}
                 </p>
                 {dbStatus?.error && (
                   <p className="text-[7px] text-red-400 mt-1 font-mono break-all leading-tight">
                     Erro: {dbStatus.error}
                   </p>
                 )}
                 <p className="text-[7px] text-slate-600 mt-1 opacity-50">
                   Srv Time: {dbStatus?.timestamp ? new Date(dbStatus.timestamp).toLocaleTimeString() : 'N/A'}
                 </p>
              </div>
            )}
            {dbStatus?.storage === 'A ligar...' && (
              <div className="mt-2 p-2 bg-blue-500/5 rounded-lg border border-blue-500/20 flex items-center gap-2 animate-pulse">
                <RefreshCw size={10} className="animate-spin text-blue-400" />
                <span className="text-[9px] text-blue-400 font-bold uppercase tracking-wider">A ligar ao MongoDB Atlas...</span>
              </div>
            )}
        </div>

        <div className="p-4 border-t border-slate-800 space-y-2">
          {onFullSync && (
            <>
               {/* BUTTON 1: COMPRESS & SYNC */}
               <button 
                 onClick={() => {
                   if (selectedIds.length > 0) {
                     handleSyncAndCompress(true);
                   } else {
                     const currentCategory = activeTab;
                     const allCategories = [
                       'restaurants', 'shops', 'beauty', 'hotels', 'cars', 'activities', 'trails', 'services', 
                       'auto_repairs', 'auto_electronics', 'used_market', 'animals', 'real_estate', 
                       'gyms', 'stands', 'offices', 'it_services', 'perfumes', 'flights', 'bus-schedules', 'marketplace'
                     ];
                     if (allCategories.includes(currentCategory)) {
                       setSyncSelection([currentCategory]);
                     } else {
                       setSyncSelection([]);
                     }
                     setShowSyncSelector(true);
                   }
                 }} 
                 disabled={isSyncing || isCompressing}
                 className={`w-full flex flex-col items-center gap-1 p-4 rounded-2xl transition-all border shadow-lg relative ${isCompressing ? 'bg-amber-600/40 text-white border-amber-500' : 'bg-emerald-600 text-white hover:bg-emerald-500 border-emerald-400'}`}
               >
                 <div className="flex items-center gap-3 w-full justify-center">
                    {isCompressing ? <RefreshCw className="w-6 h-6 animate-spin" /> : <Zap className="w-6 h-6" />}
                    <span className="font-black uppercase tracking-tighter text-sm">
                      {isCompressing ? 'A Publicar...' : selectedIds.length > 0 ? `Publicar Seleção (${selectedIds.length})` : 'Publicar no Frontend'}
                    </span>
                    {modifiedCategories.size > 0 && !isCompressing && selectedIds.length === 0 && (
                       <span className="absolute -top-2 -right-2 bg-amber-500 text-white text-[10px] px-2 py-1 rounded-full animate-bounce shadow-lg border-2 border-slate-900">
                         {modifiedCategories.size}
                       </span>
                     )}
                 </div>
                 {isCompressing && (
                   <div className="w-full mt-2">
                      <div className="flex justify-between text-[10px] uppercase font-black mb-1">
                         <span>Progresso</span>
                         <span>{compressionProgress.total > 0 ? Math.round((compressionProgress.current / compressionProgress.total) * 100) : 0}%</span>
                      </div>
                      <div className="w-full h-2 bg-slate-900/50 rounded-full overflow-hidden border border-white/10">
                         <div 
                           className="h-full bg-white transition-all duration-300" 
                           style={{ width: `${compressionProgress.total > 0 ? (compressionProgress.current / compressionProgress.total) * 100 : 0}%` }}
                         />
                      </div>
                      <p className="text-[9px] mt-1 text-center font-bold text-white/90 truncate">
                        {compressionLabel}
                      </p>
                      <p className="text-[8px] mt-0.5 text-center font-black text-amber-300">
                        {compressionProgress.current} / {compressionProgress.total} itens processados
                      </p>
                   </div>
                 )}
              </button>

              {/* BUTTON 3: DANGER ZONE - WIPE ALL */}
              <button 
                onClick={async () => {
                  if (window.confirm('⚠️ AVISO CRÍTICO: Isto vai apagar TODOS os restaurantes, lojas, hotéis, etc. de uma só vez! Deseja recomeçar do zero?')) {
                    if (window.confirm('TEM A CERTEZA ABSOLUTA? Esta ação não pode ser revertida.')) {
                       setIsCompressing(true);
                       setSyncLogs([]);
                       addLog('🧨 A iniciar limpeza total da base de dados...');
                       
                       setTimeout(async () => {
                          try {
                            const res = await fetch(`${API_BASE_URL}/api/reset-db`, {
                              method: 'POST'
                            });
                            if (res.ok) {
                              addLog('✅ Base de dados limpa com sucesso!');
                              alert('✅ Base de dados LIMPA!');
                            } else {
                              addLog('❌ Falha ao limpar servidor.');
                            }
                          } catch (err) {
                            addLog('❌ Erro de ligação ao limpar.');
                          } finally {
                            setIsCompressing(false);
                          }
                        }, 1000);
                    }
                  }
                }} 
                disabled={isSyncing || isCompressing}
                className="w-full flex items-center gap-3 p-2 rounded-xl transition-all border border-red-500/20 bg-red-500/5 text-red-500 hover:bg-red-500/10"
              >
                 <Trash2 size={16} /> Limpar Tudo (RESET)
              </button>
            </>
          )}
          <button onClick={onLogout} className="w-full flex items-center gap-3 text-slate-500 hover:text-red-400 p-3 rounded-xl hover:bg-red-400/5 transition-colors">
             <LogOut className="w-5 h-5" /> <span className="font-bold uppercase text-[10px] tracking-widest">{t('logout_admin')}</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8">
         <div className="flex justify-between items-center mb-8">
            <div className="flex flex-col">
              <h1 className="text-3xl font-black text-slate-800 uppercase tracking-tighter leading-none mb-1">
                {activeTab === 'dashboard' ? 'Panorama Geral' : `${getTabTitle()} (${getListItems().length})`}
              </h1>
              {activeTab !== 'dashboard' && <p className="text-slate-400 text-xs font-bold italic">Gestão de conteúdos e registos da plataforma</p>}
            </div>
            
            {activeTab === 'dashboard' && (
              <button 
                onClick={handleEmergencyRestore}
                disabled={isSyncing}
                className="group relative px-6 py-3 bg-red-50 border-2 border-red-100 text-red-600 rounded-2xl text-xs font-black uppercase flex items-center gap-3 hover:bg-red-600 hover:text-white hover:border-red-600 transition-all shadow-xl shadow-red-500/5 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-red-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <AlertTriangle className="w-4 h-4" />
                <span>Repovoar Atlas (Emergência)</span>
              </button>
            )}
         </div>

          {/* DASHBOARD VIEW */}
          {activeTab === 'dashboard' && !showAppSliderSettings && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">

               {/* ── LIVE CLOCK BANNER ── */}
               <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-[3rem] p-7 overflow-hidden shadow-2xl shadow-slate-900/30">
                 <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
                 <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-600/10 rounded-full blur-3xl -ml-16 -mb-16 pointer-events-none" />
                 <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6">
                   <div className="flex-1">
                     <div className="flex items-center gap-3 mb-2">
                       <span className="text-2xl">{adminGreetEmoji}</span>
                       <p className="text-white/60 text-sm font-black uppercase tracking-[0.2em]">{adminGreeting}, Admin</p>
                     </div>
                     <p className="text-white/40 text-xs font-bold">{adminDateCapital}</p>
                     <div className="flex items-center gap-3 mt-3">
                       <span className="bg-white/10 border border-white/10 text-white/60 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">📍 Açores</span>
                       <span className="bg-white/10 border border-white/10 text-white/60 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">🛡️ Super Admin</span>
                     </div>
                   </div>
                   <div className="text-center flex flex-col items-center">
                     <p className="font-mono font-black text-white" style={{ fontSize: 'clamp(2.5rem, 5vw, 3.8rem)', letterSpacing: '0.05em', textShadow: '0 0 40px rgba(59,130,246,0.4)' }}>{adminTimeStr}</p>
                     <div className="flex items-center justify-center gap-2 mt-2">
                       <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                       <p className="text-emerald-400 text-[10px] font-black uppercase tracking-widest">Ao Vivo</p>
                     </div>
                   </div>
                   <div className="flex-1 flex justify-end">
                     <div className="grid grid-cols-2 gap-3">
                       {[
                         { label: 'Dia', value: adminNow.toLocaleDateString('pt-PT', { weekday: 'short' }).toUpperCase(), color: 'text-blue-400' },
                         { label: 'Semana', value: `Nº ${Math.ceil(adminNow.getDate()/7)}`, color: 'text-emerald-400' },
                         { label: 'Mês', value: adminNow.toLocaleDateString('pt-PT', { month: 'short' }).toUpperCase(), color: 'text-amber-400' },
                         { label: 'Ano', value: String(adminNow.getFullYear()), color: 'text-purple-400' },
                       ].map((s, i) => (
                         <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-3 text-center">
                           <p className={`font-black text-sm ${s.color}`}>{s.value}</p>
                           <p className="text-white/30 text-[9px] font-bold uppercase tracking-widest mt-0.5">{s.label}</p>
                         </div>
                       ))}
                     </div>
                   </div>
                 </div>
               </div>

               {/* Stats Grid */}
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Cartão 1: Reservas — sincroniza com todas as categorias */}
                  <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm relative overflow-hidden group">
                     <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Calendar size={64} className="text-blue-600" />
                     </div>
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Total de Reservas</p>
                     <p className="text-4xl font-black text-slate-800 tracking-tighter">
                        {[...restaurants, ...hotels, ...cars, ...activities, ...beauty, ...shops, ...services].reduce((acc, biz) => acc + (biz.reservations?.length || 0), 0)}
                     </p>
                     <div className="flex items-center gap-2 mt-4 text-[10px] font-bold text-slate-400 uppercase">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" /> Sincronizado em tempo real
                     </div>
                  </div>
                  {/* Cartão 2: Produtos Vendidos — apenas dados reais */}
                  <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm relative overflow-hidden group">
                     <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <ShoppingBag size={64} className="text-emerald-600" />
                     </div>
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Produtos Vendidos</p>
                     <p className="text-4xl font-black text-slate-800 tracking-tighter">
                        {[...restaurants, ...shops, ...beauty, ...services].reduce((acc, biz) => acc + ((biz as any).salesHistory?.length || (biz as any).orders?.length || 0), 0)}
                     </p>
                     <div className="flex items-center gap-2 mt-4 text-[10px] font-bold text-slate-400 uppercase">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Vendas reais acumuladas
                     </div>
                  </div>
                  {/* Cartão 3: Clientes — dados reais da API */}
                  <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm relative overflow-hidden group">
                     <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Users size={64} className="text-amber-600" />
                     </div>
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Clientes Registados</p>
                     <p className="text-4xl font-black text-slate-800 tracking-tighter">{users.length}</p>
                     <div className="flex items-center gap-2 mt-4 text-[10px] font-bold text-slate-400 uppercase">
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                        {users.filter(u => { try { return new Date(u.createdAt || 0).getMonth() === new Date().getMonth(); } catch { return false; } }).length} novos este mês
                     </div>
                  </div>
                  {/* Cartão 4: Receita — apenas preços reais */}
                  <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm relative overflow-hidden group">
                     <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Zap size={64} className="text-purple-600" />
                     </div>
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Receita Total Estimada</p>
                     <p className="text-4xl font-black text-slate-800 tracking-tighter">
                        {[...restaurants, ...hotels, ...cars, ...activities, ...beauty, ...shops, ...services].reduce((acc, biz) => {
                          const resRev = (biz.reservations || []).reduce((s: number, r: any) => s + (parseFloat(r.totalPrice) || 0), 0);
                          const saleRev = ((biz as any).salesHistory || []).reduce((s: number, sale: any) => s + (parseFloat(sale.total) || 0), 0);
                          return acc + resRev + saleRev;
                        }, 0).toLocaleString('pt-PT', { style: 'currency', currency: 'EUR' })}
                     </p>
                     <div className="w-full h-1.5 bg-slate-100 rounded-full mt-4 overflow-hidden">
                        <div className="h-full bg-purple-600 rounded-full" style={{ width: '65%' }}></div>
                     </div>
                  </div>
               </div>

                {/* Secondary Row (Settings / Config) */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-2">
                  <div 
                    onClick={() => setShowAppSliderSettings(true)}
                    className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm relative overflow-hidden group cursor-pointer hover:shadow-md transition-all active:scale-[0.98]"
                  >
                     <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <SlidersHorizontal size={64} className="text-blue-600" />
                     </div>
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Configurações app</p>
                     <p className="text-2xl font-black text-slate-800 tracking-tighter">Slider Principal</p>
                     <div className="flex items-center gap-2 mt-4 text-[10px] font-bold text-blue-600 uppercase">
                        Gerir Desktop & Mobile
                     </div>
                  </div>
                </div>

                {/* Categories Breakdown */}
               <div className="bg-white p-10 rounded-[4rem] border border-slate-100 shadow-xl shadow-slate-200/20">
                  <div className="flex justify-between items-center mb-10">
                    <h3 className="text-xl font-black text-slate-800 uppercase tracking-tighter">Performance por Categoria</h3>
                    {dashboardCategoryDetail && (
                      <button 
                        onClick={() => setDashboardCategoryDetail(null)}
                        className="text-xs font-black text-blue-600 uppercase tracking-widest hover:underline"
                      >
                        ← Voltar ao Panorama
                      </button>
                    )}
                  </div>

                  <AnimatePresence mode="wait">
                    {!dashboardCategoryDetail ? (
                      <motion.div 
                        key="grid"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8"
                      >
                         {[
                           { id: 'restaurants', label: 'Restaurantes', count: restaurants.length, reservations: restaurants.reduce((acc, r) => acc + (r.reservations?.length || 0), 0), revenue: restaurants.reduce((acc, r) => acc + (r.reservations || []).reduce((s: number, res: any) => s + (parseFloat(res.totalPrice) || 0), 0) + ((r as any).salesHistory || []).reduce((s: number, sale: any) => s + (parseFloat(sale.total) || 0), 0), 0), icon: Utensils, color: 'bg-blue-50 text-blue-600' },
                           { id: 'hotels', label: 'Alojamentos', count: hotels.length, reservations: hotels.reduce((acc, r) => acc + (r.reservations?.length || 0), 0), revenue: hotels.reduce((acc, r) => acc + (r.reservations || []).reduce((s: number, res: any) => s + (parseFloat(res.totalPrice) || 0), 0), 0), icon: BedDouble, color: 'bg-indigo-50 text-indigo-600' },
                           { id: 'cars', label: 'Rentcar', count: cars.length, reservations: cars.reduce((acc, r) => acc + (r.reservations?.length || 0), 0), revenue: cars.reduce((acc, r) => acc + (r.reservations || []).reduce((s: number, res: any) => s + (parseFloat(res.totalPrice) || 0), 0), 0), icon: CarIcon, color: 'bg-emerald-50 text-emerald-600' },
                           { id: 'activities', label: 'Atividades', count: activities.length, reservations: activities.reduce((acc, r) => acc + (r.reservations?.length || 0), 0), revenue: activities.reduce((acc, r) => acc + (r.reservations || []).reduce((s: number, res: any) => s + (parseFloat(res.totalPrice) || 0), 0), 0), icon: Mountain, color: 'bg-amber-50 text-amber-600' },
                           { id: 'shops', label: 'Lojas', count: shops.length, reservations: shops.reduce((acc, r) => acc + ((r as any).orders?.length || 0), 0), revenue: shops.reduce((acc, s) => acc + ((s as any).salesHistory || []).reduce((sv: number, sale: any) => sv + (parseFloat(sale.total) || 0), 0), 0), icon: ShoppingBag, color: 'bg-rose-50 text-rose-600' },
                           { id: 'beauty', label: 'Beleza', count: beauty.length, reservations: beauty.reduce((acc, r) => acc + (r.reservations?.length || 0), 0), revenue: beauty.reduce((acc, b) => acc + (b.reservations || []).reduce((s: number, res: any) => s + (parseFloat(res.totalPrice) || 0), 0) + ((b as any).salesHistory || []).reduce((s: number, sale: any) => s + (parseFloat(sale.total) || 0), 0), 0), icon: Sparkles, color: 'bg-pink-50 text-pink-600' },
                         ].map((cat) => (
                           <motion.div 
                              key={cat.id} 
                              whileHover={{ scale: 1.05 }}
                              onClick={() => setDashboardCategoryDetail(cat.id)}
                              className="flex flex-col items-center text-center group cursor-pointer"
                           >
                              <div className={`w-20 h-20 ${cat.color} rounded-[2rem] flex items-center justify-center mb-4 shadow-sm group-hover:shadow-xl transition-all relative`}>
                                 <cat.icon size={32} />
                                 {cat.reservations > 0 && (
                                   <div className="absolute -top-2 -right-2 bg-slate-900 text-white text-[10px] font-black w-6 h-6 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                                      {cat.reservations}
                                   </div>
                                 )}
                              </div>
                              <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">{cat.label}</p>
                              <p className="text-xl font-black text-slate-800">{cat.count}</p>
                              <p className="text-[10px] font-bold text-emerald-600 mt-1">{cat.revenue.toLocaleString('pt-PT', { style: 'currency', currency: 'EUR' })}</p>
                           </motion.div>
                         ))}
                      </motion.div>
                    ) : (
                      <motion.div 
                        key="detail"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-6"
                      >
                        <div className="flex items-center gap-4 border-b border-slate-100 pb-6">
                           <div className="w-16 h-16 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-lg">
                              {dashboardCategoryDetail === 'restaurants' && <Utensils size={28} />}
                              {dashboardCategoryDetail === 'hotels' && <BedDouble size={28} />}
                              {dashboardCategoryDetail === 'cars' && <CarIcon size={28} />}
                              {dashboardCategoryDetail === 'activities' && <Mountain size={28} />}
                              {dashboardCategoryDetail === 'shops' && <ShoppingBag size={28} />}
                              {dashboardCategoryDetail === 'beauty' && <Sparkles size={28} />}
                           </div>
                           <div>
                              <h4 className="text-2xl font-black text-slate-800 uppercase tracking-tighter">{dashboardCategoryDetail.toUpperCase()}</h4>
                              <p className="text-xs font-bold text-slate-400">Dados detalhados e análise de rendimentos</p>
                           </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                           <div className="space-y-4">
                              <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Top Entidades por Reservas</h5>
                              <div className="space-y-3">
                                 {((dashboardCategoryDetail === 'restaurants' ? restaurants : 
                                    dashboardCategoryDetail === 'hotels' ? hotels :
                                    dashboardCategoryDetail === 'cars' ? cars :
                                    dashboardCategoryDetail === 'activities' ? activities : []) as any[])
                                    .sort((a, b) => (b.reservations?.length || 0) - (a.reservations?.length || 0))
                                    .slice(0, 5)
                                    .map((item, idx) => (
                                      <div key={item.id} className="flex justify-between items-center bg-slate-50 p-4 rounded-2xl">
                                         <div className="flex items-center gap-3">
                                            <span className="text-xs font-black text-slate-300 w-4">#{idx+1}</span>
                                            <span className="text-xs font-bold text-slate-700">{item.name || item.title}</span>
                                         </div>
                                         <span className="text-xs font-black text-blue-600">{item.reservations?.length || 0} res.</span>
                                      </div>
                                   ))}
                              </div>
                           </div>

                           <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white">
                              <h5 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Volume de Negócios</h5>
                              <div className="space-y-6">
                                 <div>
                                    <p className="text-3xl font-black text-white">
                                       {(((dashboardCategoryDetail === 'restaurants' ? restaurants : 
                                          dashboardCategoryDetail === 'hotels' ? hotels :
                                          dashboardCategoryDetail === 'cars' ? cars :
                                          dashboardCategoryDetail === 'activities' ? activities : []) as any[])
                                          .reduce((acc, biz) => acc + (biz.reservations?.reduce((sum: number, r: any) => sum + (parseFloat(r.totalPrice) || 0), 0) || 0), 0) + (dashboardCategoryDetail === 'hotels' ? 8200 : 2500))
                                          .toLocaleString('pt-PT', { style: 'currency', currency: 'EUR' })}
                                    </p>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">Acumulado Total</p>
                                 </div>
                                 <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-white/5 p-4 rounded-2xl">
                                       <p className="text-lg font-black text-emerald-400">+ €450</p>
                                       <p className="text-[8px] font-bold text-slate-500 uppercase mt-1">Hoje</p>
                                    </div>
                                    <div className="bg-white/5 p-4 rounded-2xl">
                                       <p className="text-lg font-black text-blue-400">+ €2,840</p>
                                       <p className="text-[8px] font-bold text-slate-500 uppercase mt-1">Este Mês</p>
                                    </div>
                                 </div>
                              </div>
                           </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
               </div>
            </div>
          )}

          {/* CUSTOMERS VIEW */}
          {activeTab === 'customers' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
               <div className="flex justify-between items-center bg-white p-8 rounded-[3rem] shadow-sm border border-slate-100">
                  <div>
                    <h2 className="text-3xl font-black text-slate-800 uppercase tracking-tighter">Gestão de Clientes</h2>
                    <p className="text-slate-400 font-medium italic">Monitorização de utilizadores e recuperação de credenciais</p>
                  </div>
                  <div className="bg-blue-50 px-6 py-3 rounded-2xl border border-blue-100">
                     <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Total Registados</p>
                     <p className="text-2xl font-black text-blue-600">{users.length || 0}</p>
                  </div>
               </div>

               <div className="bg-white rounded-[3rem] shadow-sm border border-slate-100 overflow-hidden">
                  <table className="w-full text-left border-collapse">
                     <thead>
                        <tr className="bg-slate-50 border-b border-slate-100">
                           <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Cliente</th>
                           <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Email</th>
                           <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Password</th>
                           <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Telemóvel</th>
                           <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Créditos</th>
                           <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Ações</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-50">
                        {users.map((u: any) => (
                          <tr key={u.email} className="hover:bg-slate-50/50 transition-colors group">
                             <td className="px-8 py-6">
                                <div className="flex items-center gap-3">
                                   <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                                      <img src={u.profile?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.email}`} className="w-full h-full object-cover" />
                                   </div>
                                   <div>
                                      <p className="font-black text-slate-800 text-sm">{u.name || 'Cliente Azores'}</p>
                                      <p className="text-[9px] font-bold text-slate-400 uppercase">Aderiu em {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'Setembro 2024'}</p>
                                   </div>
                                </div>
                             </td>
                             <td className="px-8 py-6">
                                <p className="text-xs font-mono text-slate-600">{u.email}</p>
                             </td>
                             <td className="px-8 py-6">
                                <p className="text-xs font-mono text-blue-600 font-bold">{u.password || '••••••'}</p>
                             </td>
                             <td className="px-8 py-6">
                                <p className="text-xs font-bold text-slate-600">{u.phone || 'N/A'}</p>
                             </td>
                             <td className="px-8 py-6">
                                <div className="flex items-center gap-2">
                                   <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                                   <span className="text-xs font-black text-slate-700">{u.credits || 0} <span className="text-[10px] text-slate-400">C</span></span>
                                </div>
                             </td>
                             <td className="px-8 py-6 text-right">
                                <button 
                                  onClick={() => {
                                    const newPass = prompt(`Repor password para ${u.email}:`, 'Azores123!');
                                    if (newPass && onUpdateUsers) {
                                      const updatedUsers = users.map(user => user.email === u.email ? { ...user, password: newPass } : user);
                                      onUpdateUsers(updatedUsers);
                                      alert(`Password de ${u.email} atualizada com sucesso!`);
                                    }
                                  }}
                                  className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                                >
                                   Repor Password
                                </button>
                             </td>
                          </tr>
                        ))}
                        {users.length === 0 && (
                          <tr>
                            <td colSpan={6} className="px-8 py-20 text-center">
                               <p className="text-xs font-black text-slate-400 uppercase tracking-widest italic">Nenhum cliente encontrado na base de dados.</p>
                            </td>
                          </tr>
                        )}
                     </tbody>
                  </table>
               </div>
            </div>
          )}

          {activeTab === 'dashboard' && showAppSliderSettings && (
             <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                {/* Header with back button */}
                <div className="flex items-center justify-between">
                   <div className="flex items-center gap-4">
                      <button 
                        onClick={() => setShowAppSliderSettings(false)}
                        className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-slate-800 shadow-sm border border-slate-100 hover:bg-slate-50 transition-all active:scale-90"
                      >
                         <ChevronLeft className="w-6 h-6" />
                      </button>
                      <div>
                         <h2 className="text-3xl font-black text-slate-800 uppercase tracking-tighter">Configurações app</h2>
                         <p className="text-xs font-bold text-slate-400">Configure as fotos e descrições do slider principal</p>
                      </div>
                   </div>
                   
                   <div className="flex items-center gap-3">
                      <button 
                        onClick={() => handleSaveSliderSettings(sliderDeviceTab)}
                        disabled={isSaving}
                        className="px-8 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-2xl text-xs font-black uppercase tracking-wider shadow-lg shadow-blue-500/20 flex items-center gap-2 active:scale-95 transition-all"
                      >
                         {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                         Salvar Configurações
                      </button>
                   </div>
                </div>

                {/* Tabs / Switcher */}
                <div className="flex gap-2 p-1.5 bg-slate-100/80 rounded-2xl w-fit border border-slate-200/50">
                   <button 
                     onClick={() => setSliderDeviceTab('desktop')}
                     className={`px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${sliderDeviceTab === 'desktop' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                   >
                      Versão Desktop
                   </button>
                   <button 
                     onClick={() => setSliderDeviceTab('mobile')}
                     className={`px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${sliderDeviceTab === 'mobile' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                   >
                      Versão Mobile
                   </button>
                </div>

                {/* Add new slide button */}
                <div className="flex justify-between items-center bg-slate-50 border border-slate-200/50 p-6 rounded-3xl">
                   <div>
                      <h4 className="font-black text-slate-800 uppercase tracking-tight text-sm">Gerir Imagens do Slider ({sliderDeviceTab === 'desktop' ? 'Desktop' : 'Mobile'})</h4>
                      <p className="text-xs text-slate-400 mt-1">Carregue ou defina as imagens e textos que aparecem no topo.</p>
                   </div>
                   <label className={`cursor-pointer px-6 py-3 rounded-xl text-xs font-black uppercase transition-all flex items-center gap-2 ${isUploading ? 'bg-slate-100 text-slate-400' : 'bg-slate-800 text-white hover:bg-slate-900 shadow-md'}`}>
                      {isUploading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                      Adicionar Slide
                      <input 
                        type="file" 
                        className="hidden" 
                        accept="image/*,.webp" 
                        onChange={e => e.target.files?.[0] && handleSliderImageUpload(e.target.files[0], sliderDeviceTab)} 
                        disabled={isUploading} 
                      />
                   </label>
                </div>

                {/* Slides List Grid */}
                <div className="grid grid-cols-1 gap-6">
                   {(sliderDeviceTab === 'desktop' ? desktopSlides : mobileSlides).map((slide, idx) => (
                     <div key={slide.id || idx} className="bg-white rounded-[2.5rem] border border-slate-200 p-8 shadow-sm hover:shadow-md transition-all flex flex-col xl:flex-row gap-8 items-start relative group">
                        {/* Slide Image Preview with Replace Button */}
                        <div className="w-full xl:w-80 h-48 rounded-[2rem] overflow-hidden bg-slate-50 border border-slate-100 relative group/img shrink-0">
                           <img src={slide.image || '/placeholder.png'} className="w-full h-full object-cover" />
                           <label className="absolute inset-0 bg-black/60 opacity-0 group-hover/img:opacity-100 transition-opacity flex flex-col items-center justify-center text-white cursor-pointer gap-2 font-bold text-xs uppercase tracking-wider">
                              <Camera className="w-6 h-6" />
                              Alterar Foto
                              <input 
                                type="file" 
                                className="hidden" 
                                accept="image/*,.webp" 
                                onChange={e => e.target.files?.[0] && handleSliderImageUpload(e.target.files[0], sliderDeviceTab, idx)} 
                                disabled={isUploading} 
                              />
                           </label>
                        </div>

                        {/* Slide Fields */}
                        <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-2 gap-4">
                           <div>
                              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Subtítulo (Opcional)</label>
                              <input 
                                type="text"
                                className="w-full border border-slate-200 p-3 rounded-2xl text-xs font-semibold focus:outline-none focus:border-blue-500 bg-slate-50/50"
                                value={slide.subtitle || ''}
                                onChange={e => {
                                  const val = e.target.value;
                                  if (sliderDeviceTab === 'desktop') {
                                    setDesktopSlides(prev => {
                                      const copy = [...prev];
                                      copy[idx] = { ...copy[idx], subtitle: val };
                                      return copy;
                                    });
                                  } else {
                                    setMobileSlides(prev => {
                                      const copy = [...prev];
                                      copy[idx] = { ...copy[idx], subtitle: val };
                                      return copy;
                                    });
                                  }
                                }}
                              />
                           </div>
                           <div>
                              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Título</label>
                              <input 
                                type="text"
                                className="w-full border border-slate-200 p-3 rounded-2xl text-xs font-semibold focus:outline-none focus:border-blue-500 bg-slate-50/50"
                                value={slide.title || ''}
                                onChange={e => {
                                  const val = e.target.value;
                                  if (sliderDeviceTab === 'desktop') {
                                    setDesktopSlides(prev => {
                                      const copy = [...prev];
                                      copy[idx] = { ...copy[idx], title: val };
                                      return copy;
                                    });
                                  } else {
                                    setMobileSlides(prev => {
                                      const copy = [...prev];
                                      copy[idx] = { ...copy[idx], title: val };
                                      return copy;
                                    });
                                  }
                                }}
                              />
                           </div>
                           <div className="md:col-span-2">
                              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Descrição</label>
                              <textarea 
                                rows={2}
                                className="w-full border border-slate-200 p-3 rounded-2xl text-xs font-semibold focus:outline-none focus:border-blue-500 bg-slate-50/50 resize-none"
                                value={slide.description || ''}
                                onChange={e => {
                                  const val = e.target.value;
                                  if (sliderDeviceTab === 'desktop') {
                                    setDesktopSlides(prev => {
                                      const copy = [...prev];
                                      copy[idx] = { ...copy[idx], description: val };
                                      return copy;
                                    });
                                  } else {
                                    setMobileSlides(prev => {
                                      const copy = [...prev];
                                      copy[idx] = { ...copy[idx], description: val };
                                      return copy;
                                    });
                                  }
                                }}
                              />
                           </div>
                           <div>
                              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Texto do Botão (Opcional)</label>
                              <input 
                                type="text"
                                className="w-full border border-slate-200 p-3 rounded-2xl text-xs font-semibold focus:outline-none focus:border-blue-500 bg-slate-50/50"
                                value={slide.buttonText || ''}
                                onChange={e => {
                                  const val = e.target.value;
                                  if (sliderDeviceTab === 'desktop') {
                                    setDesktopSlides(prev => {
                                      const copy = [...prev];
                                      copy[idx] = { ...copy[idx], buttonText: val };
                                      return copy;
                                    });
                                  } else {
                                    setMobileSlides(prev => {
                                      const copy = [...prev];
                                      copy[idx] = { ...copy[idx], buttonText: val };
                                      return copy;
                                    });
                                  }
                                }}
                              />
                           </div>
                           <div>
                              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Opacidade da Foto ({slide.opacity ?? 100}%)</label>
                              <div className="flex items-center gap-3 h-12">
                                 <input 
                                   type="range"
                                   min="10"
                                   max="100"
                                   step="5"
                                   className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                                   value={slide.opacity ?? 100}
                                   onChange={e => {
                                     const val = parseInt(e.target.value);
                                     if (sliderDeviceTab === 'desktop') {
                                       setDesktopSlides(prev => {
                                         const copy = [...prev];
                                         copy[idx] = { ...copy[idx], opacity: val };
                                         return copy;
                                       });
                                     } else {
                                       setMobileSlides(prev => {
                                         const copy = [...prev];
                                         copy[idx] = { ...copy[idx], opacity: val };
                                         return copy;
                                        });
                                      }
                                    }}
                                  />
                                 <span className="text-xs font-mono font-bold text-slate-500 w-10 text-right">{slide.opacity ?? 100}%</span>
                              </div>
                           </div>
                           <div className="flex items-end justify-end gap-2">
                              <button 
                                onClick={() => {
                                  if (idx === 0) return;
                                  const setSlidesFn = sliderDeviceTab === 'desktop' ? setDesktopSlides : setMobileSlides;
                                  setSlidesFn(prev => {
                                    const copy = [...prev];
                                    const temp = copy[idx];
                                    copy[idx] = copy[idx - 1];
                                    copy[idx - 1] = temp;
                                    return copy;
                                  });
                                }}
                                disabled={idx === 0}
                                className="p-3 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 transition-all disabled:opacity-40"
                              >
                                 <ChevronUp className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => {
                                  const slides = sliderDeviceTab === 'desktop' ? desktopSlides : mobileSlides;
                                  if (idx === slides.length - 1) return;
                                  const setSlidesFn = sliderDeviceTab === 'desktop' ? setDesktopSlides : setMobileSlides;
                                  setSlidesFn(prev => {
                                    const copy = [...prev];
                                    const temp = copy[idx];
                                    copy[idx] = copy[idx + 1];
                                    copy[idx + 1] = temp;
                                    return copy;
                                  });
                                }}
                                disabled={idx === (sliderDeviceTab === 'desktop' ? desktopSlides.length : mobileSlides.length) - 1}
                                className="p-3 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 transition-all disabled:opacity-40"
                              >
                                 <ChevronDown className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => {
                                  if (!confirm("Tem a certeza que deseja remover este slide?")) return;
                                  const setSlidesFn = sliderDeviceTab === 'desktop' ? setDesktopSlides : setMobileSlides;
                                  setSlidesFn(prev => prev.filter((_, i) => i !== idx));
                                }}
                                className="px-5 py-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all text-xs font-black uppercase tracking-wider flex items-center gap-1.5"
                              >
                                 <Trash2 className="w-4 h-4" />
                                 Eliminar
                              </button>
                           </div>
                        </div>
                     </div>
                   ))}
                   {(sliderDeviceTab === 'desktop' ? desktopSlides : mobileSlides).length === 0 && (
                     <div className="bg-slate-50 rounded-[2.5rem] border border-dashed border-slate-300 p-20 text-center">
                        <SlidersHorizontal className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                        <p className="font-black text-slate-500 uppercase tracking-widest text-sm">Sem slides configurados</p>
                        <p className="text-xs text-slate-400 mt-2">Carregue ou adicione novas fotos para começar.</p>
                     </div>
                   )}
                </div>
             </div>
          )}

          {/* ACCOUNTS VIEW */}
          {activeTab === 'accounts' && !editingItem && (
            <div className="space-y-12">
               {/* Restaurants Section */}
               <section>
                 <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                       <Utensils size={20} />
                    </div>
                    <h2 className="text-2xl font-black text-slate-800 tracking-tight uppercase">Contas Restaurantes</h2>
                 </div>
                 
                 <div className="grid grid-cols-1 gap-6">
                    {restaurants.map(rest => (
                      <div key={rest.id} className="bg-white rounded-[2rem] border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500">
                         <div className="p-8">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-6 border-b border-slate-100">
                               <div className="flex items-center gap-4">
                                  <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center overflow-hidden border border-slate-100">
                                     {rest.image ? <img src={rest.image} className="w-full h-full object-cover" /> : <Utensils className="text-slate-300" />}
                                  </div>
                                  <div>
                                     <h3 className="text-xl font-black text-slate-800">{rest.name}</h3>
                                     <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">{rest.island}</p>
                                  </div>
                               </div>
                               
                               <div className="flex gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100 items-center">
                                  {editingAdminId === rest.id ? (
                                    <div className="flex gap-2">
                                       <input 
                                         className="border p-1 rounded text-xs w-32" 
                                         value={adminFormData.email} 
                                         onChange={e => setAdminFormData({...adminFormData, email: e.target.value})}
                                         placeholder="Email Admin"
                                       />
                                       <input 
                                         className="border p-1 rounded text-xs w-24" 
                                         value={adminFormData.password} 
                                         onChange={e => setAdminFormData({...adminFormData, password: e.target.value})}
                                         placeholder="Password"
                                       />
                                       <button onClick={() => handleUpdateAdmin(rest.id)} className="bg-blue-600 text-white p-1 rounded"><Save size={14}/></button>
                                       <button onClick={() => setEditingAdminId(null)} className="bg-slate-200 text-slate-600 p-1 rounded"><X size={14}/></button>
                                    </div>
                                  ) : (
                                    <>
                                      <div>
                                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Admin Email</p>
                                         <p className="font-bold text-slate-700">{rest.adminEmail || 'N/A'}</p>
                                      </div>
                                      <div className="border-l border-slate-200 pl-4">
                                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Password</p>
                                         <div className="flex items-center gap-2">
                                            <p className="font-mono font-bold text-blue-600">
                                               {showPassword[rest.id] ? rest.adminPassword : '••••••••'}
                                            </p>
                                            <button 
                                              onClick={() => togglePassword(rest.id)}
                                              className="text-slate-400 hover:text-blue-500 transition-colors"
                                            >
                                               <ImageIcon size={14} />
                                            </button>
                                            <button 
                                              onClick={() => {
                                                setEditingAdminId(rest.id);
                                                setAdminFormData({ email: rest.adminEmail || '', password: rest.adminPassword || '' });
                                              }}
                                              className="text-slate-400 hover:text-blue-500 ml-2"
                                            >
                                               <Edit size={14} />
                                            </button>
                                         </div>
                                      </div>
                                    </>
                                  )}
                               </div>
                            </div>
                            
                            <div className="mt-6">
                               <div className="flex items-center justify-between mb-4">
                                  <div className="flex items-center gap-2">
                                     <Users size={16} className="text-slate-400" />
                                     <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest">Funcionários ({rest.staff?.length || 0})</h4>
                                  </div>
                                  <button 
                                    onClick={() => setAddingStaffToId(rest.id)}
                                    className="bg-blue-100 text-blue-700 px-3 py-1 rounded-lg text-[10px] font-black uppercase hover:bg-blue-200 transition-colors"
                                  >
                                    + Adicionar Funcionário
                                  </button>
                               </div>

                               {addingStaffToId === rest.id && (
                                 <div className="bg-blue-50/50 p-6 rounded-2xl border border-blue-100 mb-6 animate-in fade-in slide-in-from-top-2">
                                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                                       <input className="bg-white border-none p-3 rounded-xl text-xs shadow-sm" placeholder="Nome" value={staffFormData.name} onChange={e => setStaffFormData({...staffFormData, name: e.target.value})} />
                                       <input className="bg-white border-none p-3 rounded-xl text-xs shadow-sm" placeholder="Email" value={staffFormData.email} onChange={e => setStaffFormData({...staffFormData, email: e.target.value})} />
                                       <input className="bg-white border-none p-3 rounded-xl text-xs shadow-sm" placeholder="Password" value={staffFormData.password} onChange={e => setStaffFormData({...staffFormData, password: e.target.value})} />
                                       <select className="bg-white border-none p-3 rounded-xl text-xs shadow-sm" value={staffFormData.role} onChange={e => setStaffFormData({...staffFormData, role: e.target.value as any})}>
                                          <option value="waiter">Empregado</option>
                                          <option value="chef">Cozinheiro</option>
                                          <option value="manager">Gerente</option>
                                       </select>
                                       <input className="bg-white border-none p-3 rounded-xl text-xs shadow-sm" placeholder="PIN Tablet (4 dígitos)" maxLength={4} value={staffFormData.pin || ''} onChange={e => setStaffFormData({...staffFormData, pin: e.target.value.replace(/\D/g, '')})} />
                                    </div>
                                    <div className="flex justify-end gap-3 mt-4">
                                       <button onClick={() => setAddingStaffToId(null)} className="px-4 py-2 text-xs font-black uppercase text-slate-400 hover:text-slate-600">Cancelar</button>
                                       <button onClick={() => handleAddStaff(rest.id)} className="px-6 py-2 bg-blue-600 text-white rounded-xl text-xs font-black uppercase shadow-lg shadow-blue-500/20">Guardar Funcionário</button>
                                    </div>
                                 </div>
                               )}
                               
                               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                  {rest.staff && rest.staff.length > 0 ? rest.staff.map((s: any) => (
                                    <div key={s.id} className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex justify-between items-center group hover:border-blue-200 transition-all">
                                       <div>
                                          <p className="font-bold text-slate-800 text-sm">{s.name}</p>
                                          <p className="text-[10px] font-black text-slate-400 uppercase">{s.role}</p>
                                       </div>
                                       <div className="text-right flex items-center gap-3">
                                          <div>
                                             <p className="text-[9px] font-mono text-slate-500">{s.email}</p>
                                             <p className="text-[9px] font-mono text-blue-600 font-bold">
                                                {showPassword[s.id] ? s.password : '••••••'} {s.pin ? `| PIN: ${s.pin}` : ''}
                                             </p>
                                          </div>
                                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                             <button onClick={() => togglePassword(s.id)} className="p-1 text-slate-400 hover:text-blue-500"><ImageIcon size={12}/></button>
                                             <button onClick={() => handleRemoveStaff(rest.id, s.id)} className="p-1 text-slate-400 hover:text-red-500"><Trash2 size={12}/></button>
                                          </div>
                                       </div>
                                    </div>
                                  )) : (
                                    <p className="text-xs text-slate-400 italic">Nenhum funcionário registado.</p>
                                  )}
                               </div>
                            </div>
                         </div>
                      </div>
                    ))}
                 </div>
               </section>
             </div>
           )}

           {activeTab === 'suppliers' && (
             <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 mb-20">
                <div className="flex justify-between items-center bg-white p-8 rounded-[3rem] shadow-sm border border-slate-100">
                   <div>
                     <h2 className="text-3xl font-black text-slate-800 uppercase tracking-tighter">Gestão de Fornecedores</h2>
                     <p className="text-slate-400 font-medium italic">Administração de contas de acesso para fornecedores externos</p>
                   </div>
                </div>
 
                <div className="grid grid-cols-1 gap-6">
                   {[...restaurants, ...shops, ...beauty].map(rest => (
                     <div key={rest.id} className="bg-white p-8 rounded-[3rem] shadow-sm space-y-6 border border-slate-100">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-slate-100">
                            <div className="flex items-center gap-4">
                               <div className="w-14 h-14 bg-blue-600 text-white rounded-2xl flex items-center justify-center font-black text-xl shadow-lg">
                                  {rest.name.charAt(0)}
                               </div>
                               <div>
                                  <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tighter">{rest.name}</h3>
                                  <div className="flex items-center gap-2 mt-1">
                                     <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-[9px] font-black uppercase tracking-widest border border-blue-100">
                                        {rest.suppliers?.length || 0} Fornecedores
                                     </span>
                                     <button 
                                       onClick={() => {
                                         setAddingSupplierToId(rest.id);
                                       }}
                                       className="px-4 py-1.5 bg-slate-900 text-white rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all flex items-center gap-1"
                                     >
                                       <Plus size={10} /> Adicionar Fornecedor
                                     </button>
                                  </div>
                               </div>
                            </div>
                         </div>

                        {addingSupplierToId === rest.id && (
                          <motion.form 
                            initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                            onSubmit={(e) => {
                              e.preventDefault();
                              const fd = new FormData(e.currentTarget);
                              const data = {
                                name: fd.get('name') as string,
                                email: fd.get('email') as string,
                                phone: fd.get('phone') as string,
                                nif: fd.get('nif') as string,
                                address: fd.get('address') as string,
                              };
                              handleAddSupplier(rest.id, data);
                            }}
                            className="bg-blue-50/50 p-6 rounded-[2rem] border border-blue-100 mb-6 overflow-hidden"
                          >
                             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
                                <div className="space-y-1">
                                  <label className="text-[9px] font-black text-blue-400 uppercase ml-2">Nome Empresa</label>
                                  <input name="name" className="w-full bg-white border-none p-3 rounded-xl text-xs shadow-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Ex: Peixe Fresco Lda" required />
                                </div>
                                <div className="space-y-1">
                                  <label className="text-[9px] font-black text-blue-400 uppercase ml-2">Email</label>
                                  <input name="email" type="email" className="w-full bg-white border-none p-3 rounded-xl text-xs shadow-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none" placeholder="email@fornecedor.com" required />
                                </div>
                                <div className="space-y-1">
                                  <label className="text-[9px] font-black text-blue-400 uppercase ml-2">Telemóvel</label>
                                  <input name="phone" className="w-full bg-white border-none p-3 rounded-xl text-xs shadow-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none" placeholder="+351 ..." required />
                                </div>
                                <div className="space-y-1">
                                  <label className="text-[9px] font-black text-blue-400 uppercase ml-2">NIF</label>
                                  <input name="nif" maxLength={9} className="w-full bg-white border-none p-3 rounded-xl text-xs shadow-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none" placeholder="123456789" required />
                                </div>
                                <div className="space-y-1">
                                  <label className="text-[9px] font-black text-blue-400 uppercase ml-2">Morada</label>
                                  <input name="address" className="w-full bg-white border-none p-3 rounded-xl text-xs shadow-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Rua ..." required />
                                </div>
                             </div>
                             <div className="flex justify-end gap-3 mt-6">
                                <button type="button" onClick={() => setAddingSupplierToId(null)} className="px-6 py-2.5 text-xs font-black uppercase text-slate-400 hover:text-slate-600 transition-colors">Cancelar</button>
                                <button type="submit" className="px-8 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-black uppercase shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all">Criar Fornecedor</button>
                             </div>
                          </motion.form>
                        )}
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                           {rest.suppliers && rest.suppliers.length > 0 ? rest.suppliers.map(sup => (
                             <div key={sup.id} className="bg-slate-50 p-6 rounded-[2.5rem] border border-slate-100 relative group hover:border-blue-200 transition-all">
                                <div className="flex justify-between items-start mb-4">
                                   <div>
                                      <p className="font-black text-slate-800">{sup.name}</p>
                                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">NIF: {sup.nif}</p>
                                   </div>
                                 {editingSupplierId === sup.id ? (
                                   <form 
                                     onSubmit={(e) => {
                                       e.preventDefault();
                                       const fd = new FormData(e.currentTarget);
                                       handleUpdateSupplier(rest.id, sup.id, {
                                         email: fd.get('email') as string,
                                         password: fd.get('password') as string
                                       });
                                       setEditingSupplierId(null);
                                     }}
                                     className="space-y-3 w-full mt-4"
                                   >
                                      <div>
                                        <label className="text-[9px] font-black text-blue-400 uppercase">Email de Acesso</label>
                                        <input name="email" defaultValue={sup.email} className="w-full bg-white border border-blue-100 p-2.5 rounded-xl text-xs font-bold focus:ring-2 focus:ring-blue-500 outline-none" required />
                                      </div>
                                      <div>
                                        <label className="text-[9px] font-black text-blue-400 uppercase">Password</label>
                                        <input name="password" defaultValue={sup.password} className="w-full bg-white border border-blue-100 p-2.5 rounded-xl text-xs font-bold focus:ring-2 focus:ring-blue-500 outline-none" required />
                                      </div>
                                      <div className="flex gap-2 pt-2">
                                         <button type="button" onClick={() => setEditingSupplierId(null)} className="flex-1 py-2 text-[10px] font-black uppercase text-slate-400">Cancelar</button>
                                         <button type="submit" className="flex-1 py-2 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase shadow-lg shadow-blue-500/20">Guardar</button>
                                      </div>
                                   </form>
                                 ) : (
                                   <>
                                      <div className="space-y-2 mb-6">
                                         <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                                           <Mail size={14} className="text-slate-300" /> {sup.email}
                                         </div>
                                         <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                                           <Lock size={14} className="text-slate-300" /> 
                                           {showPassword[sup.id] ? sup.password || '---' : '••••••••'}
                                         </div>
                                      </div>
                                      <div className="flex gap-2">
                                        <button 
                                         onClick={() => setEditingSupplierId(sup.id)}
                                         className="flex-1 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-blue-600 hover:text-white transition-all"
                                        >
                                          Editar Dados de Acesso
                                        </button>
                                      </div>
                                   </>
                                 )}
                               </div>
                               <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity absolute top-4 right-4">
                                  <button onClick={() => setEditingSupplierId(sup.id)} className="p-1 text-slate-400 hover:text-blue-500"><Edit size={14}/></button>
                                  <button onClick={() => togglePassword(sup.id)} className="p-1 text-slate-400 hover:text-blue-500"><ImageIcon size={14}/></button>
                                  <button onClick={() => handleRemoveSupplier(rest.id, sup.id)} className="p-1 text-slate-400 hover:text-red-500"><Trash2 size={14}/></button>
                               </div>
                             </div>
                           )) : (
                             <div className="col-span-full py-8 text-center bg-slate-100/50 rounded-[2rem] border border-dashed border-slate-200">
                                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest italic">Sem fornecedores registados.</p>
                             </div>
                           )}
                        </div>
                     </div>
                   ))}
                </div>
             </div>
           )}

          {activeTab === 'slider' && (
             <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 mb-20">
                <div className="flex justify-between items-center bg-white p-8 rounded-[3rem] shadow-sm border border-slate-100">
                   <div>
                     <h2 className="text-3xl font-black text-slate-800 uppercase tracking-tighter">Homepage Slider</h2>
                     <p className="text-slate-400 font-medium italic">Gerir fotos, títulos, subtítulos, descrições e botões do slider principal</p>
                   </div>
                   <button
                     onClick={async () => {
                       setIsSavingSlider(true);
                       try {
                         const res = await fetch(`${API_BASE_URL}/api/slider`, {
                           method: 'POST',
                           headers: { 'Content-Type': 'application/json' },
                           body: JSON.stringify(sliderData)
                         });
                         if (!res.ok) throw new Error("Erro ao guardar");
                         alert("✅ Slider guardado com sucesso!");
                       } catch (err) {
                         alert("❌ Erro ao guardar: " + err.message);
                       } finally {
                         setIsSavingSlider(false);
                       }
                     }}
                     disabled={isSavingSlider}
                     className="px-8 py-4 bg-emerald-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg shadow-emerald-500/20 hover:bg-emerald-700 transition-all disabled:opacity-50 flex items-center gap-2"
                   >
                     {isSavingSlider ? <span className="animate-spin">🔄</span> : <span className="text-xs">💾</span>}
                     Guardar Alterações
                   </button>
                </div>

                <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm space-y-6">
                   <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                      <h3 className="text-xl font-black text-slate-800 uppercase">Slides ({sliderData.length})</h3>
                      <button
                        onClick={() => {
                          const newSlide = {
                            image: 'https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?auto=format&fit=crop&q=80&w=1200',
                            tag: 'EXPERIÊNCIA AÇORES',
                            title: 'Descubra São Miguel',
                            subtitle: 'A natureza em estado puro para as suas férias perfeitas.',
                            buttonText: 'EXPLORAR AGORA',
                            buttonLink: '/explorar'
                          };
                          setSliderData([...sliderData, newSlide]);
                        }}
                        className="px-6 py-2.5 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all flex items-center gap-1"
                      >
                        <Plus size={12} /> Adicionar Slide
                      </button>
                   </div>

                   <div className="grid grid-cols-1 gap-6">
                      {sliderData.map((slide, idx) => (
                        <div key={idx} className="bg-slate-50 p-6 rounded-[2.5rem] border border-slate-200 relative group flex flex-col lg:flex-row gap-6">
                           <div className="w-full lg:w-1/3 space-y-3">
                              <div className="aspect-[16/9] rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 relative">
                                 <img src={slide.image} className="w-full h-full object-cover" alt="" />
                                 <div className="absolute top-2 left-2 bg-slate-900/80 text-white text-[10px] font-black px-2 py-0.5 rounded">
                                   Slide #{idx + 1}
                                 </div>
                              </div>
                              <div className="flex gap-2">
                                 <label className={`flex-1 cursor-pointer py-2 px-3 bg-white border border-slate-200 hover:bg-slate-100 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-600 transition-all flex items-center justify-center gap-1 ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}>
                                    {isUploading ? <span className="animate-spin">🔄</span> : <span className="text-xs">➕</span>}
                                    Upload Foto
                                    <input
                                      type="file"
                                      className="hidden"
                                      accept="image/*,.webp"
                                      disabled={isUploading}
                                      onChange={async (e) => {
                                        if (e.target.files?.[0]) {
                                          setIsUploading(true);
                                          try {
                                            const fd = new FormData();
                                            fd.append('image', e.target.files[0]);
                                            const res = await fetch(`${API_BASE_URL}/api/upload`, {
                                              method: 'POST',
                                              body: fd
                                            });
                                            if (!res.ok) throw new Error("Erro no upload");
                                            const rdata = await res.json();
                                            const updated = [...sliderData];
                                            updated[idx] = { ...updated[idx], image: rdata.url };
                                            setSliderData(updated);
                                          } catch (err) {
                                            alert(err.message);
                                          } finally {
                                            setIsUploading(false);
                                          }
                                        }
                                      }}
                                    />
                                 </label>
                              </div>
                           </div>

                           <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                 <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-2">Tag/Etiqueta Superior</label>
                                 <input
                                   value={slide.tag || ''}
                                   onChange={e => {
                                     const updated = [...sliderData];
                                     updated[idx] = { ...updated[idx], tag: e.target.value };
                                     setSliderData(updated);
                                   }}
                                   className="w-full bg-white border border-slate-200 p-3 rounded-xl text-xs font-bold focus:ring-2 focus:ring-blue-500 outline-none mt-1"
                                   placeholder="EXPERIÊNCIA AÇORES"
                                 />
                              </div>

                              <div>
                                 <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-2">Título (Nome do Slide)</label>
                                 <input
                                   value={slide.title || ''}
                                   onChange={e => {
                                     const updated = [...sliderData];
                                     updated[idx] = { ...updated[idx], title: e.target.value };
                                     setSliderData(updated);
                                   }}
                                   className="w-full bg-white border border-slate-200 p-3 rounded-xl text-xs font-bold focus:ring-2 focus:ring-blue-500 outline-none mt-1"
                                   placeholder="Descubra São Miguel"
                                 />
                              </div>

                              <div className="md:col-span-2">
                                 <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-2">Subtítulo/Descrição</label>
                                 <textarea
                                   value={slide.subtitle || ''}
                                   onChange={e => {
                                     const updated = [...sliderData];
                                     updated[idx] = { ...updated[idx], subtitle: e.target.value };
                                     setSliderData(updated);
                                   }}
                                   rows={2}
                                   className="w-full bg-white border border-slate-200 p-3 rounded-xl text-xs font-bold focus:ring-2 focus:ring-blue-500 outline-none mt-1"
                                   placeholder="A natureza em estado puro para as suas férias perfeitas."
                                 />
                              </div>

                              <div>
                                 <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-2">Texto do Botão</label>
                                 <input
                                   value={slide.buttonText || ''}
                                   onChange={e => {
                                     const updated = [...sliderData];
                                     updated[idx] = { ...updated[idx], buttonText: e.target.value };
                                     setSliderData(updated);
                                   }}
                                   className="w-full bg-white border border-slate-200 p-3 rounded-xl text-xs font-bold focus:ring-2 focus:ring-blue-500 outline-none mt-1"
                                   placeholder="EXPLORAR AGORA"
                                 />
                              </div>

                              <div>
                                 <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-2">Link do Botão</label>
                                 <input
                                   value={slide.buttonLink || ''}
                                   onChange={e => {
                                     const updated = [...sliderData];
                                     updated[idx] = { ...updated[idx], buttonLink: e.target.value };
                                     setSliderData(updated);
                                   }}
                                   className="w-full bg-white border border-slate-200 p-3 rounded-xl text-xs font-bold focus:ring-2 focus:ring-blue-500 outline-none mt-1"
                                   placeholder="/explorar"
                                 />
                              </div>
                           </div>

                           {/* Slide Actions (Absolute Position on Hover/Visible on Mobile) */}
                           <div className="absolute top-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => {
                                  if (idx > 0) {
                                    const updated = [...sliderData];
                                    const temp = updated[idx];
                                    updated[idx] = updated[idx - 1];
                                    updated[idx - 1] = temp;
                                    setSliderData(updated);
                                  }
                                }}
                                disabled={idx === 0}
                                className="p-1.5 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-100 disabled:opacity-30"
                              >
                                <span>⬅️</span>
                              </button>
                              <button
                                onClick={() => {
                                  if (idx < sliderData.length - 1) {
                                    const updated = [...sliderData];
                                    const temp = updated[idx];
                                    updated[idx] = updated[idx + 1];
                                    updated[idx + 1] = temp;
                                    setSliderData(updated);
                                  }
                                }}
                                disabled={idx === sliderData.length - 1}
                                className="p-1.5 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-100 disabled:opacity-30"
                              >
                                <span>➡️</span>
                              </button>
                              <button
                                onClick={() => {
                                  if (confirm("Tem a certeza que deseja remover este slide?")) {
                                    setSliderData(sliderData.filter((_, i) => i !== idx));
                                  }
                                }}
                                className="p-1.5 bg-red-50 text-red-600 border border-red-100 rounded-lg hover:bg-red-100"
                              >
                                <span>🗑️</span>
                              </button>
                           </div>
                        </div>
                      ))}

                      {sliderData.length === 0 && (
                        <div className="py-12 border-2 border-dashed border-slate-200 rounded-[2rem] text-center">
                           <span className="text-4xl">🖼️</span>
                           <p className="text-xs font-black text-slate-400 uppercase tracking-widest mt-4">Nenhum slide disponível. Adicione um slide para começar.</p>
                        </div>
                      )}
                   </div>
                </div>
             </div>
           )}

          {/* LIST VIEW */}
          {activeTab !== 'dashboard' && activeTab !== 'suppliers' && activeTab !== 'slider' && !editingItem && (
            <div className="space-y-6">
                
                <div className="flex justify-between items-center bg-white p-8 rounded-[3rem] shadow-sm mb-8 border border-slate-100">
                   <div className="flex gap-4 items-center">
                     <select 
                       className="border-2 border-slate-100 p-2 rounded-xl bg-white text-[10px] font-black uppercase tracking-wider text-slate-500 focus:border-blue-500 outline-none transition-all"
                       value={islandFilter}
                       onChange={e => setIslandFilter(e.target.value)}
                     >
                        <option value="all">Todas as Ilhas</option>
                        {['PDL', 'TER', 'HOR', 'PIX', 'SJZ', 'GRW', 'FLW', 'CVU', 'SMA'].map(i => <option key={i} value={i}>{i}</option>)}
                     </select>

                     {activeTab === 'restaurants' && (
                       <select 
                         className="border-2 border-slate-100 p-2 rounded-xl bg-white text-[10px] font-black uppercase tracking-wider text-slate-500 focus:border-blue-500 outline-none transition-all"
                         value={cuisineFilter}
                         onChange={e => setCuisineFilter(e.target.value)}
                       >
                         <option value="all">Todos os Tipos de Cozinha</option>
                         {Array.from(new Set(restaurants.map(r => r.cuisine).filter(Boolean))).sort().map(c => (
                           <option key={c} value={c}>{c}</option>
                         ))}
                       </select>
                     )}
                   </div>

                   <div className="flex items-center gap-6">
                     <div className="flex items-center gap-3 bg-slate-50 px-4 py-2 rounded-2xl border border-slate-100">
                        <input 
                          type="checkbox" 
                          className="w-5 h-5 rounded-lg text-blue-600 focus:ring-blue-500"
                          checked={getListItems().length > 0 && getListItems().every(i => selectedIds.includes(i.id))}
                          onChange={toggleSelectAll}
                        />
                        <span className="text-xs font-black text-slate-500 uppercase tracking-widest">Selecionar Tudo</span>
                     </div>
                     <div>
                       <h1 className="text-4xl font-black text-slate-800 uppercase tracking-tighter">{activeTab.replace('_', ' ')} ({getListItems().length})</h1>
                       <p className="text-slate-400 font-medium italic">Gestão de conteúdos e registos da plataforma</p>
                     </div>
                   </div>
                   <div className="flex gap-3">
                     {selectedIds.length > 0 && (
                       <motion.button 
                         initial={{ opacity: 0, x: 20 }}
                         animate={{ opacity: 1, x: 0 }}
                         onClick={handleBulkDelete}
                         className="px-8 py-4 bg-red-500 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg shadow-red-500/20 hover:bg-red-600 transition-all flex items-center gap-2"
                       >
                         <Trash2 size={16} /> Apagar Selecionados ({selectedIds.length})
                       </motion.button>
                     )}
                     <button 
                       onClick={() => {
                         const ctx = detectDashboardContext();
                          setAiSelectedCategory(ctx.category);
                          setAiSelectedSubcategory(ctx.subcategory);
                          setAiSelectedIsland(ctx.island);
                          setAiStep(1);
                          setAiMessages([
                            {
                              sender: 'ia',
                              text: `Olá! Detetei que está na secção de "${ctx.category}" ${ctx.subcategory ? `(${ctx.subcategory})` : ''} na ilha "${ctx.island}".\n\nQuantos resultados pretende importar?`,
                              options: ['5 resultados', '10 resultados', '20 resultados', 'Todos os disponíveis', 'Quantidade personalizada']
                            }
                          ]);
                          setShowAiImportModal(true);
                       }}
                       className="px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg shadow-indigo-500/20 hover:from-purple-700 hover:to-indigo-700 transition-all flex items-center gap-2"
                     >
                       <Sparkles size={16} /> Importar com IA
                     </button>
                    <button 
                      onClick={() => setShowBulkAdd(!showBulkAdd)} 
                      className={`px-8 py-4 ${showBulkAdd ? 'bg-amber-500' : 'bg-slate-800'} text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg transition-all flex items-center gap-2`}
                    >
                      <Plus size={16} /> Lançamento Rápido (Lista)
                    </button>
                    {activeTab === 'trails' && (
                      <button 
                        onClick={injectTrailExamples}
                        className="px-6 py-4 bg-emerald-100 text-emerald-700 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-emerald-200 hover:bg-emerald-200 transition-all flex items-center gap-2"
                      >
                        <Plus size={14} /> Injetar Exemplos
                      </button>
                    )}
                    <button 
                      onClick={startAdd} 
                      className="px-8 py-4 bg-blue-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all flex items-center gap-2"
                    >
                      <Plus size={16} /> {activeTab === 'marketplace' ? 'Nova Categoria' : 'Novo Registo'}
                    </button>
                  </div>
                </div>

                {showBulkAdd && (
                  <motion.div 
                    initial={{ opacity: 0, y: -20 }} 
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white p-8 rounded-[3rem] shadow-xl mb-8 border-2 border-amber-200"
                  >
                    <h3 className="text-lg font-black text-slate-800 uppercase mb-2">Lançamento Rápido em Massa</h3>
                    <p className="text-xs text-slate-500 mb-4 font-bold">Cole uma lista de nomes (um por linha). Selecione a Ilha e Subcategoria antes de publicar.</p>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-[10px] font-black uppercase text-slate-400 mb-1 ml-2">Ilha</label>
                        <select className="w-full border-2 border-slate-100 p-3 rounded-xl font-bold text-sm" value={bulkIsland} onChange={e => setBulkIsland(e.target.value)}>
                          {['PDL', 'TER', 'HOR', 'PIX', 'SJZ', 'GRW', 'FLW', 'CVU', 'SMA'].map(i => <option key={i} value={i}>{i}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-black uppercase text-slate-400 mb-1 ml-2">Subcategoria (Opcional)</label>
                        <input className="w-full border-2 border-slate-100 p-3 rounded-xl font-bold text-sm" value={bulkSubcategory} onChange={e => setBulkSubcategory(e.target.value)} placeholder="Ex: beauty_salon" />
                      </div>
                    </div>

                    <textarea 
                      className="w-full h-72 border-2 border-slate-100 p-4 rounded-2xl font-mono text-sm focus:border-amber-400 outline-none transition-colors"
                      placeholder={`Exemplo (separe cada negócio com uma linha em branco):

Restaurante A Tasca
Rua de Lisboa 12, Ponta Delgada
(+351) 296 111 222  info@atasca.pt

Cella Bar
Av. do Mar, Madalena, Pico
(+351) 292 555 888  cellbar@pico.pt`}
                      value={bulkText}
                      onChange={e => setBulkText(e.target.value)}
                    />
                    <div className="flex justify-end gap-3 mt-4">
                      <button onClick={() => setShowBulkAdd(false)} className="px-6 py-3 text-xs font-black uppercase text-slate-400 hover:text-slate-600">Cancelar</button>
                      <button onClick={handleBulkAdd} className="px-10 py-3 bg-amber-500 text-white rounded-xl text-xs font-black uppercase shadow-lg shadow-amber-500/20 hover:bg-amber-600 transition-all">Publicar Lista Agora</button>
                    </div>
                  </motion.div>
                )}

                {/* ISLAND FILTER BAR */}
                <div className="flex flex-wrap gap-2 mb-8 bg-slate-50 p-4 rounded-[2rem] border border-slate-100">
                   <button 
                     onClick={() => { setIslandFilter('all'); setVisibleCount(6); }}
                     className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${islandFilter === 'all' ? 'bg-blue-600 text-white shadow-lg' : 'bg-white text-slate-400 hover:bg-slate-100'}`}
                   >
                     Todas as Ilhas
                   </button>
                   {['PDL', 'TER', 'HOR', 'PIX', 'SJZ', 'GRW', 'FLW', 'CVU', 'SMA'].map(isl => (
                     <button 
                       key={isl}
                       onClick={() => { setIslandFilter(isl); setVisibleCount(6); }}
                       className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${islandFilter === isl ? 'bg-blue-600 text-white shadow-lg' : 'bg-white text-slate-400 hover:bg-slate-100'}`}
                     >
                       {isl}
                     </button>
                   ))}
                </div>
              
              {/* SUBCATEGORY FILTER BAR for Beauty/Shops */}
              {activeTab === 'beauty' && (
                <div className="flex gap-4 mb-6 overflow-x-auto pb-2">
                  {[
                    { id: 'all', label: 'Todos', icon: <LayoutDashboard size={18} />, color: '#1A75BB' },
                    { id: 'beauty_salon', label: 'Salões', icon: <Sparkles size={18} />, color: '#FF2D78' },
                    { id: 'hairdresser', label: 'Cabeleireiros', icon: <Scissors size={18} />, color: '#8B5CF6' },
                    { id: 'barber', label: 'Barbeiros', icon: <User size={18} />, color: '#10B981' },
                    { id: 'manicure', label: 'Manicure', icon: <Brush size={18} />, color: '#F59E0B' },
                    { id: 'massage', label: 'Massagens', icon: <Flower2 size={18} />, color: '#EC4899' },
                  ].map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => setBeautyFilter(cat.id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all border
                        ${beautyFilter === cat.id ? 'bg-white text-slate-900 border-slate-200 shadow-md' : 'text-slate-400 border-transparent hover:text-slate-600'}`}
                      style={{ borderBottom: beautyFilter === cat.id ? `3px solid ${cat.color}` : undefined }}
                    >
                      <span style={{ color: cat.color }}>{cat.icon}</span> {cat.label}
                    </button>
                  ))}
                </div>
              )}

              {activeTab === 'shops' && (
                <div className="flex gap-4 mb-6 overflow-x-auto pb-2">
                  {[
                    { id: 'all', label: 'Todas as Lojas', icon: <LayoutDashboard size={18} />, color: '#1A75BB' },
                    { id: 'crafts', label: 'Artesanato', icon: <ShoppingBag size={18} />, color: '#F59E0B' },
                    { id: 'food', label: 'Gastronomia', icon: <Utensils size={18} />, color: '#10B981' },
                  ].map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => setShopsFilter(cat.id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all border
                        ${shopsFilter === cat.id ? 'bg-white text-slate-900 border-slate-200 shadow-md' : 'text-slate-400 border-transparent hover:text-slate-600'}`}
                      style={{ borderBottom: shopsFilter === cat.id ? `3px solid ${cat.color}` : undefined }}
                    >
                      <span style={{ color: cat.color }}>{cat.icon}</span> {cat.label}
                    </button>
                  ))}
                </div>
              )}

              {activeTab === 'services' && (
                <div className="flex gap-4 mb-6 overflow-x-auto pb-2">
                  {[
                    { id: 'all', label: 'Todos', icon: <LayoutDashboard size={18} />, color: '#1A75BB' },
                    { id: 'electrician', label: 'Eletricista', icon: <Zap size={18} />, color: '#F59E0B' },
                    { id: 'mason', label: 'Pedreiro', icon: <HardHat size={18} />, color: '#D97706' },
                    { id: 'carpenter', label: 'Carpinteiro', icon: <Hammer size={18} />, color: '#8B4513' },
                    { id: 'plumber', label: 'Canalizador', icon: <Droplets size={18} />, color: '#3B82F6' },
                    { id: 'painter', label: 'Pintor', icon: <Paintbrush size={18} />, color: '#EC4899' },
                    { id: 'gardening', label: 'Jardinagem', icon: <Flower2 size={18} />, color: '#10B981' },
                    { id: 'architect', label: 'Arquiteto', icon: <DraftingCompass size={18} />, color: '#8B5CF6' },
                    { id: 'engineer', label: 'Engenheiro', icon: <Settings size={18} />, color: '#4B5563' },
                    { id: 'hvac', label: 'Climatização', icon: <ThermometerSnowflake size={18} />, color: '#06B6D4' },
                  ].map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => setServicesFilter(cat.id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all border whitespace-nowrap
                        ${servicesFilter === cat.id ? 'bg-white text-slate-900 border-slate-200 shadow-md' : 'text-slate-400 border-transparent hover:text-slate-600'}`}
                      style={{ borderBottom: servicesFilter === cat.id ? `3px solid ${cat.color}` : undefined }}
                    >
                      <span style={{ color: cat.color }}>{cat.icon}</span> {cat.label}
                    </button>
                  ))}
                </div>
              )}

              {activeTab === 'auto_repairs' && (
                <div className="flex gap-4 mb-6 overflow-x-auto pb-2">
                  {[
                    { id: 'all', label: 'Todos', icon: <LayoutDashboard size={18} />, color: '#1A75BB' },
                    { id: 'parts', label: 'Compra de Peças', icon: <Settings size={18} />, color: '#EF4444' },
                    { id: 'workshop', label: 'Oficinas', icon: <Wrench size={18} />, color: '#3B82F6' },
                    { id: 'bodywork', label: 'Bate Chapa e Pintura', icon: <Paintbrush size={18} />, color: '#F59E0B' },
                    { id: 'electric', label: 'Eletrónica Auto', icon: <Zap size={18} />, color: '#EAB308' },
                  ].map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => setAutoRepairsFilter(cat.id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all border whitespace-nowrap
                        ${autoRepairsFilter === cat.id ? 'bg-white text-slate-900 border-slate-200 shadow-md' : 'text-slate-400 border-transparent hover:text-slate-600'}`}
                      style={{ borderBottom: autoRepairsFilter === cat.id ? `3px solid ${cat.color}` : undefined }}
                    >
                      <span style={{ color: cat.color }}>{cat.icon}</span> {cat.label}
                    </button>
                  ))}
                </div>
              )}

              {activeTab === 'hotels' && (
                <div className="flex gap-4 mb-6 overflow-x-auto pb-2">
                  {[
                    { id: 'all', label: 'Todos', icon: <LayoutDashboard size={18} />, color: '#1A75BB' },
                    { id: 'hotel', label: 'Hotéis', icon: <BedDouble size={18} />, color: '#1A75BB' },
                    { id: 'al', label: 'AL (Local)', icon: <Home size={18} />, color: '#F59E0B' },
                  ].map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => setHotelFilter(cat.id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all border
                        ${hotelFilter === cat.id ? 'bg-white text-slate-900 border-slate-200 shadow-md' : 'text-slate-400 border-transparent hover:text-slate-600'}`}
                      style={{ borderBottom: hotelFilter === cat.id ? `3px solid ${cat.color}` : undefined }}
                    >
                      <span style={{ color: cat.color }}>{cat.icon}</span> {cat.label}
                    </button>
                  ))}
                </div>
              )}

              {/* Category Slider Management Section */}
              {(activeTab === 'trails' || activeTab === 'activities' || activeTab === 'poi') && (
                <div className="mb-10 bg-gradient-to-br from-green-600 via-emerald-600 to-teal-700 p-8 rounded-[3rem] text-white shadow-2xl shadow-green-900/20 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32 group-hover:bg-white/20 transition-all duration-700"></div>
                  <div className="flex items-center gap-6 relative z-10">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-xl rounded-[1.5rem] flex items-center justify-center border border-white/30 shadow-inner group-hover:rotate-12 transition-transform duration-500">
                      <Mountain className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black uppercase tracking-tighter leading-none mb-2">Slider Principal: {activeTab === 'trails' ? 'Trilhos' : activeTab === 'poi' ? 'Pontos Turísticos' : 'Atividades'}</h3>
                      <p className="text-xs font-bold text-white/70 uppercase tracking-widest max-w-md">Personalize as fotos de grande formato que os utilizadores veem no topo desta categoria.</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => {
                      const sliderId = `CONFIG_SLIDER_${activeTab.toUpperCase()}`;
                      // Use getListItems() directly here to find the config even if filtered from visible list
                      const sliderItem = getListItems().find(i => i.id === sliderId) || {
                        id: sliderId,
                        title: `Slider Destaque ${activeTab}`,
                        type: 'config_slider',
                        gallery: []
                      };
                      startEdit(sliderItem);
                    }}
                    className="relative z-10 px-10 py-4 bg-white text-emerald-700 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-emerald-50 transition-all shadow-xl hover:-translate-y-1 active:scale-95"
                  >
                    Gerir Fotos do Slider
                  </button>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {getVisibleItems()
                .slice(0, visibleCount).map((item: any) => (
                <div key={item.id} className={`group relative bg-white rounded-[2rem] border overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col ${selectedIds.includes(item.id) ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-slate-100'}`}>
                   
                   {/* Selection Checkbox */}
                   <div className="absolute top-4 left-4 z-10">
                      <input 
                        type="checkbox" 
                        checked={selectedIds.includes(item.id)}
                        onChange={() => toggleSelection(item.id)}
                        className="w-5 h-5 rounded-lg border-white shadow-md text-blue-600 focus:ring-blue-500 transition-all cursor-pointer"
                      />
                   </div>

                 {/* Image or Icon Placeholder */}
                 <div className="h-32 relative bg-slate-100 flex items-center justify-center">
                   {(item.image || (item.images && item.images[0])) ? (
                     <img src={item.image || item.images[0]} className="w-full h-full object-cover" alt="" />
                   ) : (
                     <ImageIcon className="w-10 h-10 text-slate-300" />
                   )}
                   
                   {/* Action Buttons Overlay */}
                   <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button onClick={() => startEdit(item)} className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"><Edit className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(item.id)} className="p-2 bg-red-500 text-white rounded hover:bg-red-600"><Trash2 className="w-4 h-4" /></button>
                   </div>

                   {/* Badges */}
                   <div className="absolute bottom-2 left-2 flex gap-1">
                      {(item.isDraft || item.status === 'draft') && <span className="bg-amber-500 text-white px-2 py-1 rounded text-xs font-bold uppercase tracking-wider">Rascunho</span>}
                      {(item.island || (item.location && islandMapping[item.location])) && <span className="bg-black/60 text-white px-2 py-1 rounded text-xs font-bold">{item.island || islandMapping[item.location]}</span>}
                      {item.status && item.status !== 'draft' && <span className="bg-white/90 text-slate-800 px-2 py-1 rounded text-xs font-bold">{item.status}</span>}
                      {(item.price > 0 || item.isPaid) && <span className="bg-blue-600 text-white px-2 py-1 rounded text-xs font-bold">€{item.price}</span>}
                      {activeTab === 'activities' && !item.isPaid && item.type !== 'trail' && <span className="bg-emerald-500 text-white px-2 py-1 rounded text-xs font-bold uppercase tracking-widest text-[8px]">Grátis</span>}
                   </div>
                </div>

                <div className="p-4 flex-1">
                  <h3 className="font-bold text-slate-800 leading-tight">{getItemName(item)}</h3>
                  {activeTab === 'cars' && (
                    <div className="flex items-center gap-2 mt-1">
                       <span className="bg-blue-100 text-blue-600 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest">
                          {item.cars?.length || 0} Veículos na Frota
                       </span>
                    </div>
                  )}
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                    {activeTab === 'marketplace' ? `Ícone: ${item.icon || 'ShoppingBag'}` : (item.description || item.type || item.company || item.address)}
                  </p>
                  {activeTab === 'hotels' && item.type && (
                    <span className={`inline-block mt-2 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest ${item.type === 'al' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'}`}>
                       {item.type === 'al' ? 'AL (Local)' : 'Hotel'}
                    </span>
                  )}
                  
                  {/* Credentials Preview for Businesses (Hidden for Trails as requested) */}
                  {['restaurants', 'shops', 'beauty', 'activities', 'poi'].includes(activeTab) && activeTab !== 'trails' && (
                    <div className="mt-3 pt-3 border-t border-slate-100 space-y-1">
                      <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                        <Mail size={12} className="text-blue-500" /> {item.adminEmail || 'Sem email'}
                      </div>
                      <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                        <Lock size={12} className="text-blue-500" /> {showPassword[item.id] ? item.adminPassword || '---' : '••••••••'}
                        <button onClick={() => togglePassword(item.id)} className="ml-auto text-blue-500 hover:underline">Ver</button>
                      </div>
                    </div>
                  )}

                  {/* Marketplace Verification Actions (Aprovar / Rejeitar) */}
                  {activeTab === 'marketplace' && !item.id?.startsWith('cat_') && !['vehicles', 'real_estate', 'electronics', 'home', 'fashion', 'services', 'fashion_beauty', 'jobs'].includes(item.id) && (
                    <div className="mt-3 pt-3 border-t border-slate-100 flex flex-col gap-2">
                      <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                        <span>Anunciante: {item.userName || 'Cliente'}</span>
                        <span>{item.userPhone || ''}</span>
                      </div>
                      
                      {item.status === 'pending' || item.status === 'pendingApproval' || item.status === 'localPending' || !item.status ? (
                        <div className="flex gap-2 mt-1">
                          <button
                            onClick={async () => {
                              const newList = marketplaceAds.map(ad => ad.id === item.id ? { ...ad, status: 'active' } : ad);
                              await onUpdateMarketplaceAds(newList); alert("✅ Classificado confirmado com sucesso!");
                            }}
                            className="flex-1 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-[10px] font-black uppercase shadow-lg shadow-emerald-500/20 transition-all text-center"
                          >
                            Aprovar
                          </button>
                          <button
                            onClick={async () => {
                              const newList = marketplaceAds.filter(ad => ad.id !== item.id);
                              await onUpdateMarketplaceAds(newList); alert("❌ Classificado rejeitado com sucesso!");
                            }}
                            className="flex-1 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl text-[10px] font-black uppercase shadow-lg shadow-red-500/20 transition-all text-center"
                          >
                            Rejeitar
                          </button>
                        </div>
                      ) : (
                        <div className="flex justify-between items-center mt-1">
                          <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${item.status === 'active' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
                            {item.status === 'active' ? 'Aprovado' : 'Rejeitado'}
                          </span>
                          <button
                            onClick={() => {
                              const newList = marketplaceAds.map(ad => ad.id === item.id ? { ...ad, status: 'pending' } : ad);
                              onUpdateMarketplaceAds(newList);
                            }}
                            className="text-[9px] font-bold text-blue-600 hover:underline uppercase"
                          >
                            Recarregar
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                  {/* Draft Item Actions (Publish / Reject / Edit) */}
                  {(item.isDraft || item.status === 'draft') && (
                    <div className="mt-3 pt-3 border-t border-slate-100 flex flex-col gap-2">
                      <div className="flex gap-2 mt-1">
                        <button
                          onClick={async () => {
                            const publishItem = (list: any[]) => list.map(i => i.id === item.id ? { ...i, status: 'published', isDraft: false } : i);
                            switch (activeTab) {
                              case 'restaurants': onUpdateRestaurants(publishItem(restaurants)); break;
                              case 'shops': onUpdateShops(publishItem(shops)); break;
                              case 'beauty': onUpdateBeauty(publishItem(beauty)); break;
                              case 'services': onUpdateServices(publishItem(services)); break;
                              case 'auto_repairs': onUpdateAutoRepairs(publishItem(autoRepairs)); break;
                              case 'auto_electronics': onUpdateAutoElectronics(publishItem(autoElectronics)); break;
                              case 'used_market': onUpdateUsedMarket(publishItem(usedMarket)); break;
                              case 'animals': onUpdateAnimals(publishItem(animals)); break;
                              case 'real_estate': onUpdateRealEstate(publishItem(realEstate)); break;
                              case 'gyms': onUpdateGyms(publishItem(gyms)); break;
                              case 'stands': onUpdateStands(publishItem(stands)); break;
                              case 'offices': onUpdateOffices(publishItem(offices)); break;
                              case 'it_services': onUpdateITServices(publishItem(itServices)); break;
                              case 'perfumes': onUpdatePerfumes(publishItem(perfumes)); break;
                              case 'bars': onUpdateBars(publishItem(bars)); break;
                              case 'events': onUpdateEvents(publishItem(events)); break;
                              case 'municipal': onUpdateMunicipal(publishItem(municipal)); break;
                              case 'activities': 
                              case 'trails':
                              case 'poi': onUpdateActivities(publishItem(activities)); break;
                              case 'flights': onUpdateFlights(publishItem(flights)); break;
                              case 'hotels': onUpdateHotels(publishItem(hotels)); break;
                              case 'cars': onUpdateCars(publishItem(cars)); break;
                              case 'buses': onUpdateBusSchedules(publishItem(busSchedules)); break;
                            }
                            setModifiedCategories(prev => new Set(prev).add(activeTab));
                            alert("✅ Item publicado com sucesso!");
                          }}
                          className="flex-1 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-[10px] font-black uppercase shadow-lg shadow-emerald-500/20 transition-all text-center flex items-center justify-center gap-1"
                        >
                          Publicar
                        </button>
                        <button
                          onClick={() => startEdit(item)}
                          className="px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-xl text-[10px] font-black uppercase transition-all text-center"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="flex-1 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl text-[10px] font-black uppercase shadow-lg shadow-red-500/20 transition-all text-center flex items-center justify-center gap-1"
                        >
                          Rejeitar
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
             ))}
             </div>
             
             {getListItems().length > visibleCount && (
               <div className="flex justify-center mt-12 mb-20">
                 <button 
                   onClick={() => setVisibleCount(prev => prev + 12)}
                   className="px-12 py-5 bg-white border-2 border-slate-100 text-slate-800 rounded-[2rem] text-sm font-black uppercase tracking-widest hover:bg-slate-50 transition-all shadow-xl shadow-slate-100"
                 >
                   Ver Mais Itens (+12)
                 </button>
               </div>
             )}
           </div>
         )}
          {/* SYNC PROGRESS MODAL */}
          <AnimatePresence>
            {isCompressing && (
              <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/90 backdrop-blur-sm">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="bg-white rounded-[2rem] shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[80vh]"
                >
                  <div className="p-8 border-b bg-slate-50">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-200">
                        <RefreshCw className="animate-spin" size={24} />
                      </div>
                      <div>
                        <h2 className="text-xl font-black text-slate-800 uppercase tracking-tighter">Otimização em Curso</h2>
                        <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">{compressionLabel}</p>
                      </div>
                    </div>

                    <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                       <motion.div 
                         initial={{ width: 0 }}
                         animate={{ width: `${(compressionProgress.current / compressionProgress.total) * 100}%` }}
                         className="h-full bg-blue-600"
                       />
                    </div>
                    <div className="flex justify-between mt-2">
                       <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Progresso Total</span>
                       <span className="text-sm font-black text-blue-600">{Math.round((compressionProgress.current / compressionProgress.total) * 100)}%</span>
                    </div>
                  </div>

                  <div className="flex-1 p-6 overflow-y-auto bg-slate-900 font-mono text-[10px] space-y-1">
                    {syncLogs.map((log, i) => (
                      <div key={i} className={`flex gap-3 ${log.includes('✅') ? 'text-emerald-400' : log.includes('❌') ? 'text-red-400' : 'text-blue-300'}`}>
                        <span className="opacity-30">[{new Date().toLocaleTimeString()}]</span>
                        <span className="flex-1">{log}</span>
                      </div>
                    ))}
                    {syncLogs.length === 0 && (
                      <div className="text-slate-600 italic">A aguardar início do processo...</div>
                    )}
                  </div>

                  <div className="p-4 bg-slate-50 border-t flex flex-col items-center gap-2">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      Não feche esta janela enquanto o processo não terminar
                    </p>
                    <button 
                      onClick={() => {
                        if (window.confirm("Tem a certeza que deseja cancelar? O processo pode ficar incompleto.")) {
                          setIsCompressing(false);
                          window.location.reload(); // Hard reset to stop the process
                        }
                      }}
                      className="text-[10px] font-black text-red-500 uppercase hover:underline"
                    >
                      Cancelar e Recarregar
                    </button>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

         {/* EDIT FORM */}
         {editingItem && (
           <div className="bg-white rounded-2xl shadow-xl p-8 max-w-4xl mx-auto border border-slate-200 animate-in fade-in slide-in-from-bottom-4 mb-20">
             <div className="flex justify-between items-center mb-6 pb-4 border-b">
               <h2 className="text-2xl font-bold text-slate-800">{isAddingNew ? t('add_new') : t('edit')}</h2>
               <button 
                  onClick={() => setEditingItem(null)} 
                  className="p-3 bg-white text-slate-800 hover:bg-blue-600 hover:text-white rounded-full transition-all shadow-lg border border-slate-100 group"
                >
                  <X size={20} className="group-active:scale-90 transition-transform" />
                </button>

             </div>

             <form onSubmit={handleSave} className="space-y-6">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {renderFormFields()}
               </div>

                <div className="flex gap-4 pt-6 border-t mt-6">
                  <button 
                    type="submit" 
                    disabled={isSaving}
                    className={`flex-1 py-3 rounded-xl font-bold flex justify-center items-center gap-2 transition-all ${isSaving ? 'bg-slate-400 cursor-not-allowed text-white' : 'bg-blue-600 text-white hover:bg-blue-700 active:scale-95'}`}
                  >
                    {isSaving ? (
                      <>
                        <RefreshCw className="w-5 h-5 animate-spin" />
                        <span>A guardar...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5" />
                        <span>{t('save')}</span>
                      </>
                    )}
                  </button>
                  <button 
                    type="button" 
                    disabled={isSaving}
                    onClick={() => { setEditingItem(null); setIsAddingNew(false); }} 
                    className="flex-1 bg-slate-200 text-slate-700 py-3 rounded-xl font-bold hover:bg-slate-300 disabled:opacity-50"
                  >
                    {t('cancel')}
                  </button>
                </div>
             </form>
           </div>
         )}
      </main>
      {/* SYNC SELECTOR MODAL */}
      <AnimatePresence>
        {showSyncSelector && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden border border-white/20"
            >
              <div className="p-8 bg-gradient-to-br from-slate-900 to-blue-900 text-white relative">
                 <button onClick={() => setShowSyncSelector(false)} className="absolute top-6 right-6 p-2 hover:bg-white/10 rounded-full transition-colors">
                    <X size={24} />
                 </button>
                 <div className="flex items-center gap-4 mb-2">
                    <div className="w-12 h-12 bg-blue-500 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/40">
                       <Zap className="text-white" />
                    </div>
                    <div>
                       <h3 className="text-2xl font-black uppercase tracking-tighter">Publicar Alterações</h3>
                       <p className="text-blue-200 text-xs font-bold opacity-80 uppercase tracking-widest">Selecione o que deseja sincronizar</p>
                    </div>
                 </div>
                 <button 
                   onClick={() => {
                     if (modifiedCategories.size === 0) {
                        alert('Não existem categorias com alterações pendentes.');
                        return;
                     }
                     setSyncSelection(Array.from(modifiedCategories));
                     setTimeout(handleSyncAndCompress, 100);
                   }}
                   className="mt-4 w-full py-3 bg-white/10 hover:bg-white/20 rounded-xl border border-white/20 text-white font-black uppercase text-[10px] tracking-widest transition-all flex items-center justify-center gap-2"
                 >
                   <CloudSync size={16} /> Publicar Apenas Alterações ({modifiedCategories.size})
                 </button>
                 
                 <button 
                   onClick={() => {
                     setSyncSelection([
                       'restaurants', 'shops', 'beauty', 'hotels', 'cars', 'activities', 'trails', 'services', 
                       'auto_repairs', 'auto_electronics', 'used_market', 'animals', 'real_estate', 
                       'gyms', 'stands', 'offices', 'it_services', 'perfumes', 'flights', 'bus-schedules', 'marketplace'
                     ]);
                     setTimeout(handleSyncAndCompress, 100);
                   }}
                   className="mt-2 w-full py-2 bg-slate-800 text-slate-400 hover:text-white rounded-xl text-[9px] font-black uppercase tracking-widest transition-all"
                 >
                   Forçar Publicação de Tudo (Reset Sync)
                 </button>
              </div>

              <div className="p-8">
                 <div className="flex justify-between items-center mb-6">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Categorias Disponíveis</p>
                    <div className="flex gap-4">
                       <button 
                         onClick={() => setSyncSelection([
                           'restaurants', 'shops', 'beauty', 'hotels', 'cars', 'activities', 'trails', 'services', 
                           'auto_repairs', 'auto_electronics', 'used_market', 'animals', 'real_estate', 
                           'gyms', 'stands', 'offices', 'it_services', 'perfumes', 'flights', 'bus-schedules', 'marketplace'
                         ])}
                         className="text-[10px] font-black text-blue-600 uppercase hover:underline"
                       >
                         Selecionar Todas
                       </button>
                       <button 
                         onClick={() => setSyncSelection([])}
                         className="text-[10px] font-black text-slate-400 uppercase hover:underline"
                       >
                         Limpar
                       </button>
                    </div>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[40vh] overflow-y-auto p-2 scrollbar-hide">
                    {[
                      { id: 'restaurants', label: 'Restaurantes', icon: Utensils },
                      { id: 'hotels', label: 'Alojamentos', icon: BedDouble },
                      { id: 'cars', label: 'Rentcar', icon: CarIcon },
                      { id: 'activities', label: 'Atividades', icon: Mountain },
                       { id: 'trails', label: 'Trilhos', icon: MapPin },
                      { id: 'shops', label: 'Lojas', icon: ShoppingBag },
                      { id: 'beauty', label: 'Beleza', icon: Sparkles },
                      { id: 'services', label: 'Serviços', icon: Briefcase },
                      { id: 'auto_repairs', label: 'Reparação Auto', icon: Wrench },
                      { id: 'auto_electronics', label: 'Eletrónica Auto', icon: Zap },
                      { id: 'used_market', label: 'Mercado Usados', icon: ShoppingCart },
                      { id: 'animals', label: 'Animais', icon: Dog },
                      { id: 'real_estate', label: 'Imobiliária', icon: Building2 },
                      { id: 'gyms', label: 'Ginásios', icon: Dumbbell },
                      { id: 'stands', label: 'Stands', icon: CarFront },
                      { id: 'offices', label: 'Escritórios', icon: Building2 },
                      { id: 'it_services', label: 'Informática', icon: Laptop },
                      { id: 'perfumes', label: 'Perfumaria', icon: Pipette },
                      { id: 'bars', label: 'Bares/Noite', icon: Wine },
                      { id: 'events', label: 'Eventos', icon: Calendar },
                      { id: 'municipal', label: 'Serviços Municipais', icon: Landmark },
                      { id: 'flights', label: 'Voos', icon: Plane },
                      { id: 'bus-schedules', label: 'Autocarros', icon: Bus }
                    ].map(cat => (
                      <label 
                        key={cat.id} 
                        className={`flex items-center gap-3 p-4 rounded-2xl border-2 transition-all cursor-pointer group ${syncSelection.includes(cat.id) ? 'bg-blue-50 border-blue-500 shadow-md shadow-blue-500/10' : 'bg-slate-50 border-transparent hover:border-slate-200'}`}
                      >
                         <input 
                           type="checkbox" 
                           className="hidden" 
                           checked={syncSelection.includes(cat.id)}
                           onChange={() => {
                             if (syncSelection.includes(cat.id)) {
                               setSyncSelection(syncSelection.filter(s => s !== cat.id));
                             } else {
                               setSyncSelection([...syncSelection, cat.id]);
                             }
                           }}
                         />
                         <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${syncSelection.includes(cat.id) ? 'bg-blue-600 text-white' : 'bg-white text-slate-400 group-hover:text-blue-500'}`}>
                            <cat.icon size={16} />
                         </div>
                         <span className={`text-[11px] font-black uppercase tracking-tight ${syncSelection.includes(cat.id) ? 'text-blue-900' : 'text-slate-500'}`}>
                            {cat.label}
                         </span>
                         {modifiedCategories.has(cat.id) && (
                            <span className="ml-auto bg-amber-100 text-amber-600 text-[8px] font-black px-2 py-0.5 rounded-full border border-amber-200">
                              ALTERADO
                            </span>
                          )}
                      </label>
                    ))}
                 </div>

                 <div className="mt-10 flex gap-4">
                    <button 
                      onClick={() => setShowSyncSelector(false)}
                      className="flex-1 py-4 rounded-2xl border-2 border-slate-100 text-slate-400 font-black uppercase text-xs tracking-widest hover:bg-slate-50 transition-all"
                    >
                       Cancelar
                    </button>
                    <button 
                      onClick={handleSyncAndCompress}
                      disabled={syncSelection.length === 0}
                      className="flex-[2] py-4 rounded-2xl bg-blue-600 text-white font-black uppercase text-xs tracking-widest shadow-xl shadow-blue-500/30 hover:bg-blue-700 disabled:opacity-50 disabled:shadow-none transition-all flex items-center justify-center gap-2"
                    >
                       <Zap size={18} /> Publicar Selecionados ({syncSelection.length})
                    </button>
                 </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SYNC PROGRESS OVERLAY */}
      <AnimatePresence>
        {isCompressing && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] bg-slate-900/95 backdrop-blur-xl flex flex-col items-center justify-center p-8 text-center"
          >
             <div className="w-full max-w-lg space-y-12">
                <div className="relative">
                   <div className="absolute inset-0 bg-blue-500/20 blur-[100px] animate-pulse rounded-full" />
                   <motion.div 
                     animate={{ rotate: 360 }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                     className="w-24 h-24 border-4 border-blue-500/30 border-t-blue-500 rounded-full mx-auto relative z-10"
                   />
                   <Zap size={40} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-blue-500 animate-bounce" />
                </div>

                <div className="space-y-4 relative z-10">
                    <h2 className="text-4xl font-black text-white uppercase tracking-tighter">Sincronização em Curso</h2>
                    <div className="flex items-center justify-center gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-ping" />
                      <p className="text-blue-400 font-bold uppercase tracking-[0.3em] text-xs">{compressionLabel}</p>
                    </div>
                 </div>

                 <div className="space-y-6 relative z-10">
                    <div className="flex justify-between text-[10px] font-black text-white/50 uppercase tracking-widest">
                       <span>Estado: {compressionProgress.current === compressionProgress.total ? 'Concluído' : 'Em andamento...'}</span>
                       <span className="text-blue-400">{Math.round((compressionProgress.current / (compressionProgress.total || 1)) * 100)}%</span>
                    </div>
                    <div className="h-3 bg-white/5 rounded-full overflow-hidden border border-white/10 p-[2px]">
                       <motion.div 
                         initial={{ width: 0 }}
                         animate={{ width: `${compressionProgress.total > 0 ? (compressionProgress.current / compressionProgress.total) * 100 : 0}%` }}
                         className="h-full bg-gradient-to-r from-blue-600 via-indigo-500 to-cyan-400 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.6)]"
                       />
                    </div>
                    <div className="flex justify-between items-center px-1">
                      <p className="text-[9px] text-white/40 font-bold uppercase tracking-widest">
                         {compressionProgress.current} de {compressionProgress.total} itens processados
                      </p>
                      {compressionProgress.current === compressionProgress.total && (
                        <div className="flex items-center gap-1 text-emerald-400 text-[9px] font-black uppercase">
                          <CheckCircle size={10} /> Sincronizado
                        </div>
                      )}
                    </div>
                 </div>

                <div className="bg-black/40 border border-white/10 rounded-[2rem] p-6 h-48 overflow-y-auto text-left font-mono text-[10px] space-y-2 scrollbar-hide shadow-inner">
                   {syncLogs.map((log, i) => (
                     <div key={i} className={`flex gap-3 ${log.includes('✅') ? 'text-emerald-400' : log.includes('❌') ? 'text-red-400' : 'text-slate-400'}`}>
                        <span className="opacity-30">[{new Date().toLocaleTimeString()}]</span>
                        <span className="font-bold">{log}</span>
                     </div>
                   ))}
                </div>

                <div className="pt-4">
                   <p className="text-[10px] text-white/20 font-black uppercase tracking-[0.5em] animate-pulse">Não feche esta janela até terminar</p>
                </div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* SUCCESS MODAL */}
      <AnimatePresence>
        {showSyncSuccess && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-10 right-10 z-[200] bg-emerald-600 text-white p-8 rounded-[2.5rem] shadow-2xl flex items-center gap-6 border-4 border-emerald-400/30 backdrop-blur-xl"
          >
             <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg">
                <CheckCircle size={32} className="text-emerald-600" />
             </div>
             <div className="pr-4">
                <h4 className="text-2xl font-black uppercase tracking-tighter">Publicado com Sucesso!</h4>
                <p className="text-emerald-100 text-sm font-bold opacity-90">Todos os dados foram enviados e já estão visíveis no Frontend.</p>
             </div>
             <button onClick={() => setShowSyncSuccess(false)} className="p-2 hover:bg-white/10 rounded-full">
                <X size={20} />
             </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* IMPORTAR COM IA MODAL */}
      <AnimatePresence>
        {showAiImportModal && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[120] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 30 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 30 }}
              className="bg-white/80 backdrop-blur-2xl w-full max-w-5xl rounded-[3rem] shadow-2xl border border-white/20 overflow-hidden flex flex-col my-8"
              style={{ maxHeight: '90vh' }}
            >
              {/* Header */}
              <div className="p-6 bg-gradient-to-r from-purple-800 to-indigo-900 text-white flex justify-between items-center relative">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                    <Sparkles className="text-purple-300" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black uppercase tracking-tighter">Importar com Inteligência Artificial (Real)</h3>
                    <p className="text-[10px] text-purple-200 uppercase tracking-widest font-bold opacity-80 font-mono">OpenStreetMap & Wikidata Integration</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowAiImportModal(false)}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Quality & Cache Warning Header */}
              <div className="px-6 pt-4 bg-slate-50">
                <div className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-2xl text-xs font-bold flex items-center gap-2">
                  <span>⚠️</span>
                  <span><strong>Aviso de qualidade:</strong> Os dados gratuitos podem estar incompletos. Reveja telefone, email, website e morada antes de publicar.</span>
                </div>
              </div>

              {/* Loading State */}
              {aiIsLoading && (
                <div className="flex-1 flex flex-col items-center justify-center p-12 space-y-4 bg-slate-50/50 min-h-[300px]">
                  <RefreshCw className="w-12 h-12 text-indigo-600 animate-spin" />
                  <p className="text-sm font-black text-indigo-950 uppercase tracking-widest animate-pulse">A obter dados em tempo real...</p>
                  <p className="text-xs text-slate-400">A consultar servidores públicos (OpenStreetMap / Wikidata). Isto pode demorar alguns segundos.</p>
                </div>
              )}

              {/* Chat View (Steps 1, 2) */}
              {!aiIsLoading && aiStep !== 'preview' && (
                <div className="flex-1 flex flex-col p-6 space-y-4 overflow-y-auto min-h-[350px] max-h-[60vh] bg-slate-50/50">
                  <div className="flex-1 space-y-4">
                    {aiMessages.map((msg, i) => (
                      <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-md p-4 rounded-2xl ${msg.sender === 'user' ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-white border border-slate-100 text-slate-800 rounded-bl-none shadow-sm'} space-y-3`}>
                          <p className="text-sm font-medium">{msg.text}</p>
                          {msg.options && (
                            <div className="flex flex-wrap gap-2 pt-2">
                              {msg.options.map((opt, idx) => (
                                <button
                                  key={idx}
                                  onClick={() => handleSendAiMessage(opt)}
                                  className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-xs font-bold transition-all"
                                >
                                  {opt}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Input form */}
                  <div className="border-t border-slate-100 pt-4 flex gap-2">
                    <input
                      type="text"
                      value={aiInputValue}
                      onChange={(e) => setAiInputValue(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSendAiMessage(aiInputValue)}
                      placeholder="Escreva a quantidade ou resposta livremente (ex: 'quero 5', 'todos')"
                      className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-indigo-500 outline-none font-medium"
                    />
                    <button
                      onClick={() => handleSendAiMessage(aiInputValue)}
                      className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-sm transition-all"
                    >
                      Enviar
                    </button>
                  </div>
                </div>
              )}

              {/* Preview Grid */}
              {!aiIsLoading && aiStep === 'preview' && (
                <div className="flex-1 flex flex-col overflow-hidden">
                  <div className="p-6 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                    <div>
                      <h4 className="font-black text-slate-800 uppercase tracking-tight text-sm">Registos Encontrados</h4>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {aiSelectedCategory === 'Pontos Turísticos' ? 'Dados obtidos da Wikidata.' : 'Dados obtidos de OpenStreetMap.'} Reveja antes de publicar.
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          const ctx = detectDashboardContext();
                          setAiSelectedCategory(ctx.category);
                          setAiSelectedSubcategory(ctx.subcategory);
                          setAiSelectedIsland(ctx.island);
                          setAiStep(1);
                          setAiMessages([
                            {
                              sender: 'ia',
                              text: `Olá! Detetei que está na secção de "${ctx.category}" ${ctx.subcategory ? `(${ctx.subcategory})` : ''} na ilha "${ctx.island}".\n\nQuantos resultados pretende importar?`,
                              options: ['5 resultados', '10 resultados', '20 resultados', 'Todos os disponíveis', 'Quantidade personalizada']
                            }
                          ]);
                        }}
                        className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-bold transition-all"
                      >
                        Recomeçar Assistente
                      </button>
                    </div>
                  </div>

                  {/* Inline Editor Form */}
                  {aiEditingItemIndex !== null && aiGeneratedItems[aiEditingItemIndex] && (
                    <div className="p-6 bg-amber-50/50 border-b border-amber-100 grid grid-cols-1 md:grid-cols-3 gap-4 animate-in fade-in">
                      <div className="col-span-1 md:col-span-3 flex justify-between items-center mb-1">
                        <span className="text-xs font-black text-amber-700 uppercase tracking-wider">Edição Rápida de Item</span>
                        <button 
                          onClick={() => setAiEditingItemIndex(null)}
                          className="text-xs text-amber-700 hover:underline font-bold"
                        >
                          Concluir Edição
                        </button>
                      </div>
                      <div>
                        <label className="block text-[9px] font-black uppercase text-slate-500 mb-1">Nome / Título</label>
                        <input
                          type="text"
                          value={aiGeneratedItems[aiEditingItemIndex].name || aiGeneratedItems[aiEditingItemIndex].title || aiGeneratedItems[aiEditingItemIndex].company || ''}
                          onChange={(e) => {
                            const newItems = [...aiGeneratedItems];
                            const item = newItems[aiEditingItemIndex];
                            if (item.name !== undefined) item.name = e.target.value;
                            else if (item.title !== undefined) item.title = e.target.value;
                            else if (item.company !== undefined) item.company = e.target.value;
                            setAiGeneratedItems(newItems);
                          }}
                          className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs font-bold"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-black uppercase text-slate-500 mb-1">Contacto / Telefone</label>
                        <input
                          type="text"
                          value={aiGeneratedItems[aiEditingItemIndex].phone || ''}
                          onChange={(e) => {
                            const newItems = [...aiGeneratedItems];
                            newItems[aiEditingItemIndex].phone = e.target.value;
                            setAiGeneratedItems(newItems);
                          }}
                          className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs font-bold"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-black uppercase text-slate-500 mb-1">Morada / Endereço</label>
                        <input
                          type="text"
                          value={aiGeneratedItems[aiEditingItemIndex].address || ''}
                          onChange={(e) => {
                            const newItems = [...aiGeneratedItems];
                            newItems[aiEditingItemIndex].address = e.target.value;
                            setAiGeneratedItems(newItems);
                          }}
                          className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs font-bold"
                        />
                      </div>
                    </div>
                  )}

                  {/* Table Grid */}
                  <div className="flex-1 overflow-auto max-h-[50vh]">
                    {aiGeneratedItems.length === 0 ? (
                      <div className="p-12 text-center text-slate-400 italic text-sm">
                        Não foram encontrados resultados gratuitos para esta pesquisa.
                      </div>
                    ) : (
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-slate-100 border-b border-slate-200">
                            <th className="px-6 py-4 w-12">
                              <input
                                type="checkbox"
                                checked={aiGeneratedItems.length > 0 && aiGeneratedItems.every(i => aiSelectedDraftIds.includes(i.id))}
                                onChange={() => {
                                  if (aiGeneratedItems.every(i => aiSelectedDraftIds.includes(i.id))) {
                                    setAiSelectedDraftIds([]);
                                  } else {
                                    setAiSelectedDraftIds(aiGeneratedItems.map(i => i.id));
                                  }
                                }}
                                className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
                              />
                            </th>
                            <th className="px-6 py-4 text-xs font-black uppercase text-slate-500 tracking-wider">Nome / Título</th>
                            <th className="px-6 py-4 text-xs font-black uppercase text-slate-500 tracking-wider">Categoria / Ilha</th>
                            <th className="px-6 py-4 text-xs font-black uppercase text-slate-500 tracking-wider">Contacto</th>
                            <th className="px-6 py-4 text-xs font-black uppercase text-slate-500 tracking-wider">Fonte</th>
                            <th className="px-6 py-4 text-xs font-black uppercase text-slate-500 tracking-wider">Estado / Alerta</th>
                            <th className="px-6 py-4 text-xs font-black uppercase text-slate-500 tracking-wider">Ações</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {aiGeneratedItems.map((item, idx) => (
                            <tr key={item.id} className={`hover:bg-slate-50/50 ${item.isDuplicate ? 'bg-amber-50/30' : ''}`}>
                              <td className="px-6 py-4">
                                <input
                                  type="checkbox"
                                  checked={item.isDuplicate ? false : aiSelectedDraftIds.includes(item.id)}
                                  onChange={() => {
                                    if (aiSelectedDraftIds.includes(item.id)) {
                                      setAiSelectedDraftIds(prev => prev.filter(id => id !== item.id));
                                    } else {
                                      setAiSelectedDraftIds(prev => [...prev, item.id]);
                                    }
                                  }}
                                  className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
                                />
                              </td>
                              <td className="px-6 py-4">
                                <span className="font-bold text-slate-800 text-sm">
                                  {item.name || item.title || item.company}
                                </span>
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex gap-2">
                                  <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider">
                                    {aiSelectedCategory}
                                  </span>
                                  <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider">
                                    {item.island}
                                  </span>
                                </div>
                              </td>
                              <td className="px-6 py-4 text-xs font-mono text-slate-600">
                                <div className="space-y-0.5">
                                  <div>📞 {item.phone || 'por confirmar'}</div>
                                  <div className="text-[10px] text-slate-400">🌐 {item.website || 'por confirmar'}</div>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <span className="text-[10px] font-mono font-bold text-slate-500">
                                  {item.source} ({item.sourceId})
                                </span>
                              </td>
                              <td className="px-6 py-4">
                                {item.isDuplicate ? (
                                  <span className="bg-amber-100 text-amber-800 px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider">
                                    Possível duplicado
                                  </span>
                                ) : (
                                  <span className="bg-emerald-100 text-emerald-800 px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider">
                                    Novo
                                  </span>
                                )}
                              </td>
                              <td className="px-6 py-4 flex gap-2">
                                <button
                                  onClick={() => setAiEditingItemIndex(idx)}
                                  className="px-3 py-1 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-lg text-xs font-bold transition-all"
                                >
                                  Editar
                                </button>
                                {item.website && item.website !== 'por confirmar' && (
                                  <a
                                    href={item.website}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-3 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-xs font-bold transition-all text-center flex items-center"
                                  >
                                    Ver Fonte
                                  </a>
                                )}
                                <button
                                  onClick={() => {
                                    setAiGeneratedItems(prev => prev.filter(i => i.id !== item.id));
                                    setAiSelectedDraftIds(prev => prev.filter(id => id !== item.id));
                                  }}
                                  className="px-3 py-1 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-xs font-bold transition-all"
                                >
                                  Remover
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>

                  {/* Actions Footer */}
                  <div className="p-6 border-t border-slate-200 flex justify-between items-center bg-slate-50">
                    <p className="text-xs font-bold text-slate-400">
                      Selecionados {aiSelectedDraftIds.length} de {aiGeneratedItems.length} rascunhos para importação.
                    </p>
                    <div className="flex gap-3">
                      <button
                        onClick={() => setShowAiImportModal(false)}
                        className="px-6 py-3 bg-white hover:bg-slate-100 border border-slate-200 rounded-2xl text-xs font-black uppercase tracking-wider text-slate-700 transition-all"
                      >
                        Cancelar
                      </button>
                      <button
                        disabled={aiSelectedDraftIds.length === 0}
                        onClick={async () => {
                          const toImport = aiGeneratedItems.filter(item => aiSelectedDraftIds.includes(item.id)).map(item => {
                            return {
                              ...item,
                              phone: item.phone || 'por confirmar',
                              email: item.email || 'por confirmar',
                              website: item.website || 'por confirmar',
                              address: item.address || 'por confirmar',
                              needsReview: true
                            };
                          });
                          
                          const catMap: Record<string, string> = {
                            'Restaurantes': 'restaurants',
                            'Alojamentos': 'hotels',
                            'Lojas de Animais': 'animals',
                            'Cabeleireiros': 'beauty',
                            'Barbeiros': 'beauty',
                            'Lojas Locais': 'shops',
                            'Trilhos': 'activities',
                            'Eventos': 'events',
                            'Táxis': 'services',
                            'Autocarros': 'buses',
                            'Farmácias': 'services',
                            'Municípios': 'municipal',
                            'Juntas de Freguesia': 'municipal'
                          };

                          const targetTab = catMap[aiSelectedCategory] || 'restaurants';
                          
                          const importToLocal = (list: any[], setter: (l: any[]) => void) => {
                            const existingIds = list.map(x => x.id);
                            const uniqueNew = toImport.filter(x => !existingIds.includes(x.id)).map(x => {
                              if (targetTab === 'restaurants') {
                                return {
                                  ...x,
                                  latitude: x.coordinates.lat.toString(),
                                  longitude: x.coordinates.lng.toString(),
                                  rating: 4.0,
                                  reviews: 0
                                };
                              } else if (targetTab === 'hotels') {
                                return {
                                  ...x,
                                  stars: 3,
                                  pricePerNight: 80
                                };
                              } else if (targetTab === 'activities') {
                                return {
                                  ...x,
                                  title: x.name || x.title,
                                  type: aiSelectedCategory === 'Trilhos' ? 'trail' : 'poi'
                                };
                              }
                              return x;
                            });
                            setter([...list, ...uniqueNew]);
                          };

                          switch (targetTab) {
                            case 'restaurants': importToLocal(restaurants, onUpdateRestaurants); break;
                            case 'shops': importToLocal(shops, onUpdateShops); break;
                            case 'beauty': importToLocal(beauty, onUpdateBeauty); break;
                            case 'services': importToLocal(services, onUpdateServices); break;
                            case 'auto_repairs': importToLocal(autoRepairs, onUpdateAutoRepairs); break;
                            case 'auto_electronics': importToLocal(autoElectronics, onUpdateAutoElectronics); break;
                            case 'used_market': importToLocal(usedMarket, onUpdateUsedMarket); break;
                            case 'animals': importToLocal(animals, onUpdateAnimals); break;
                            case 'real_estate': importToLocal(realEstate, onUpdateRealEstate); break;
                            case 'gyms': importToLocal(gyms, onUpdateGyms); break;
                            case 'stands': importToLocal(stands, onUpdateStands); break;
                            case 'offices': importToLocal(offices, onUpdateOffices); break;
                            case 'it_services': importToLocal(itServices, onUpdateITServices); break;
                            case 'perfumes': importToLocal(perfumes, onUpdatePerfumes); break;
                            case 'bars': importToLocal(bars, onUpdateBars); break;
                            case 'events': importToLocal(events, onUpdateEvents); break;
                            case 'municipal': importToLocal(municipal, onUpdateMunicipal); break;
                            case 'activities': importToLocal(activities, onUpdateActivities); break;
                            case 'flights': importToLocal(flights, onUpdateFlights); break;
                            case 'hotels': importToLocal(hotels, onUpdateHotels); break;
                            case 'cars': importToLocal(cars, onUpdateCars); break;
                            case 'buses': importToLocal(busSchedules, onUpdateBusSchedules); break;
                          }

                          if (targetTab === 'activities' && aiSelectedCategory === 'Trilhos') {
                            setActiveTab('trails');
                          } else {
                            setActiveTab(targetTab as Tab);
                          }

                          setModifiedCategories(prev => new Set(prev).add(targetTab));
                          setShowAiImportModal(false);
                          alert(`Importação concluída! ${toImport.length} rascunhos adicionados localmente. Clique no botão de Publicar/Sincronizar para enviar para o servidor.`);
                        }}
                        className="px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-2xl text-xs font-black uppercase tracking-wider shadow-lg shadow-indigo-500/20 disabled:opacity-50 transition-all"
                      >
                        Importar selecionados como rascunho
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default AdminDashboard;
