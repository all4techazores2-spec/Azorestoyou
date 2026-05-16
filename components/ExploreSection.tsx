
import React, { useState } from 'react';
import { Restaurant, Activity, ExploreCategory, Language, BusSchedule, Business, AutoRepairSubCategory } from '../types';
import { COLORS, ISLAND_LOCALITIES } from '../constants';
import RestaurantModal from './RestaurantModal';
import TrailModal from './TrailModal';
import OfficeBookingModal from './OfficeBookingModal';
import CarStandModal from './CarStandModal';
import ShopCatalogModal from './ShopCatalogModal';
import { MapPin, ArrowRight, Utensils, Mountain, Camera, LandPlot, Bus, Info, Clock, Ticket, Map, Heart, ShoppingBag, Sparkles, Scissors, User, Flower2, Hand, LayoutDashboard, Brush, X, Wrench, Zap, Hammer, Droplets, Paintbrush, HardHat, Mail, PhoneCall, Leaf, PencilRuler, ThermometerSnowflake, DraftingCompass, Settings, Car, ShoppingCart, MessageSquare, Dog, Phone, Building2, Dumbbell, CarFront, Briefcase, Laptop, Pipette, Calendar, Home, CreditCard, Star } from 'lucide-react';
import { getTranslation } from '../translations';

interface ExploreSectionProps {
  category: ExploreCategory;
  destinationIsland: string | undefined;
  currentLanguage?: Language;
  isAuthenticated?: boolean;
  onShowAuth?: () => void;
  // Dynamic Data Props
  restaurants: Restaurant[];
  activities: Activity[];
  busSchedules: BusSchedule[];
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
  userCredits?: number;
  setUserCredits?: (credits: number) => void;
  favoriteRestaurantIds?: string[];
  onToggleFavorite?: (id: string) => void;
  onReserveSuccess?: (resData: any, itemName: string, itemId: string) => void;
  userProfile?: { email: string; name: string; phone: string };
  onClose?: () => void;
  onShowMap?: (url: string) => void;
  selectedItemId?: string | null;
  onSelectedItemIdHandled?: () => void;
  onShowInteractiveMap?: (trailId: string) => void;
}

const ExploreSection: React.FC<ExploreSectionProps> = ({ 
  category, 
  destinationIsland, 
  currentLanguage = 'pt', 
  isAuthenticated, 
  onShowAuth,
  restaurants = [],
  activities = [],
  busSchedules = [],
  shops = [],
  beauty = [],
  services = [],
  autoRepairs = [],
  autoElectronics = [],
  usedMarket = [],
  animals = [],
  realEstate = [],
  gyms = [],
  stands = [],
  offices = [],
  itServices = [],
  perfumes = [],
  userCredits,
  setUserCredits,
  favoriteRestaurantIds = [],
  onToggleFavorite,
  onReserveSuccess,
  userProfile,
  onClose,
  onShowMap,
  selectedItemId,
  onSelectedItemIdHandled,
  onShowInteractiveMap
}) => {
  const API_BASE_URL = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
    ? 'http://localhost:3001'
    : 'https://azorestoyou-1.onrender.com';

  const lang = currentLanguage as Language;
  const t = (key: any) => getTranslation(lang, key);
  
  // DATA SOURCE: Only use data passed from server props
  const allRestaurants = restaurants || [];
  const allActivities = activities || [];
  const allShops = shops || [];
  const allBeauty = beauty || [];
  const allServices = services || [];
  const allAutoRepairs = autoRepairs || [];
  const allAutoElectronics = autoElectronics || [];
  const allUsedMarket = usedMarket || [];
  const allAnimals = animals || [];
  const allRealEstate = realEstate || [];
  const allGyms = gyms || [];
  const allStands = stands || [];
  const allOffices = offices || [];
  const allITServices = itServices || [];
  const allPerfumes = perfumes || [];

  const [selectedRestaurant, setSelectedRestaurant] = useState<Business | null>(null);
  const [selectedOffice, setSelectedOffice] = useState<Business | null>(null);
  const [selectedStand, setSelectedStand] = useState<Business | null>(null);
  const [selectedShop, setSelectedShop] = useState<Business | null>(null);
  const [selectedTrail, setSelectedTrail] = useState<Activity | null>(null);
  const [busOrigin, setBusOrigin] = useState<string>('');
  const [busDestination, setBusDestination] = useState<string>('');
  const [busCompany, setBusCompany] = useState<string>('all');
  const [showBusResults, setShowBusResults] = useState(false);
  const [showBusOptionsModal, setShowBusOptionsModal] = useState(false);
  const [busModalStep, setBusModalStep] = useState<'options' | 'schedules' | 'payment'>('options');
  const [selectedTicketType, setSelectedTicketType] = useState<string | null>(null);
  const [selectedDayType, setSelectedDayType] = useState<'weekdays' | 'saturdays' | 'sundays'>(() => {
    const day = new Date().getDay();
    if (day === 0) return 'sundays';
    if (day === 6) return 'saturdays';
    return 'weekdays';
  });
  const [beautyFilter, setBeautyFilter] = useState<string | null>(null);
  const [shopsFilter, setShopsFilter] = useState<string | null>(null);
  const [servicesFilter, setServicesFilter] = useState<string | null>(null);
  const [autoRepairFilter, setAutoRepairFilter] = useState<string | null>(null);
  const [autoElectronicsFilter, setAutoElectronicsFilter] = useState<string | null>(null);
  const [usedMarketFilter, setUsedMarketFilter] = useState<string | null>(null);
  const [priceFilter, setPriceFilter] = useState<'all' | 'free' | 'paid'>('all');
  const [restaurantSearch, setRestaurantSearch] = useState('');
  const [restaurantIslandFilter, setRestaurantIslandFilter] = useState<string>('all');
  const [restaurantCuisineFilter, setRestaurantCuisineFilter] = useState<string>('all');
  const [trailZoneFilter, setTrailZoneFilter] = useState<'Todos' | 'Oeste' | 'Centro' | 'Leste'>('Todos');
  
  // Handle external item selection (e.g. from slider)
  React.useEffect(() => {
    if (selectedItemId) {
      if (category === 'trails') {
        const item = activities.find(a => a.id === selectedItemId);
        if (item) {
          setSelectedTrail(item);
          if (onSelectedItemIdHandled) onSelectedItemIdHandled();
        }
      } else if (category === 'restaurants') {
        const item = restaurants.find(r => r.id === selectedItemId);
        if (item) {
          setSelectedRestaurant(item as any);
          if (onSelectedItemIdHandled) onSelectedItemIdHandled();
        }
      }
      // Add other categories as needed
    }
  }, [selectedItemId, category, activities, restaurants, onSelectedItemIdHandled]);

  
  const isNearby = destinationIsland?.startsWith('nearby:');
  const userCoords = isNearby ? destinationIsland?.replace('nearby:', '').split(',').map(Number) : null;

  const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const isAllIslands = !destinationIsland || destinationIsland === 'all' || isNearby;
  const targetIsland = isAllIslands ? null : destinationIsland; 

  const sortItems = (items: any[]) => {
    if (!isNearby || !userCoords) return items;
    return [...items].map(item => {
      const distance = (item.latitude && item.longitude) 
        ? getDistance(userCoords[0], userCoords[1], parseFloat(item.latitude), parseFloat(item.longitude))
        : 999999;
      return { ...item, distance };
    }).sort((a, b) => (a.distance || 0) - (b.distance || 0));
  };

  const filteredRestaurants = sortItems(allRestaurants.filter(r => {
    const matchesIsland = restaurantIslandFilter === 'all' ? (isAllIslands || r.island === targetIsland) : r.island === restaurantIslandFilter;
    const matchesCuisine = restaurantCuisineFilter === 'all' || r.cuisine.toLowerCase().includes(restaurantCuisineFilter.toLowerCase());
    const matchesSearch = !restaurantSearch || 
      r.name.toLowerCase().includes(restaurantSearch.toLowerCase()) || 
      r.cuisine.toLowerCase().includes(restaurantSearch.toLowerCase()) ||
      r.island.toLowerCase().includes(restaurantSearch.toLowerCase());
    return matchesIsland && matchesCuisine && matchesSearch;
  }));

  
  // Mapping for the expanded categories
  const getActivitiesByType = (types: string | string[]) => {
    const filtered = allActivities.filter(a => {
      const matchesType = Array.isArray(types) ? types.includes(a.type as string) : a.type === types;
      const matchesIsland = isAllIslands || a.island === targetIsland;
      const matchesPrice = priceFilter === 'all' || (priceFilter === 'free' ? !a.isPaid : a.isPaid);
      return matchesType && matchesIsland && matchesPrice;
    });
    return sortItems(filtered);
  };

  const getCategoryTitle = (cat: ExploreCategory) => {
    switch (cat) {
      case 'restaurants': return t('nav_restaurants');
      case 'trails': return t('nav_trails');
      case 'culture': return 'Cultura'; // Needs translation key if added
      case 'landscapes': return t('nav_landscapes');
      case 'activities': return t('nav_activities');
      case 'buses': return t('nav_buses');
      case 'poi': return t('nav_poi');
      case 'shops': return t('nav_shops');
      case 'beauty': return t('nav_beauty');
      case 'services': return t('nav_services');
      case 'auto_repair': return t('nav_auto_repair');
      case 'auto_electronics': return t('nav_auto_electronics');
      case 'used_market': return t('nav_used_market');
      case 'animals': return t('nav_animals');
      case 'real_estate': return t('nav_real_estate');
      case 'gyms': return t('nav_gyms');
      case 'stands': return t('nav_stands');
      case 'offices': return t('nav_offices');
      case 'it_services': return t('nav_it_services');
      case 'perfumes': return t('nav_perfumes');
      default: return 'Explorar';
    }
  };

  const getCategoryIcon = (cat: ExploreCategory) => {
    switch (cat) {
      case 'restaurants': return <Utensils />;
      case 'trails': return <Map />;
      case 'landscapes': return <Camera />;
      case 'activities': return <Mountain />;
      case 'buses': return <Bus />;
      case 'poi': return <MapPin />;
      case 'shops': return <ShoppingBag />;
      case 'beauty': return <Sparkles />;
      case 'services': return <Wrench />;
      case 'auto_repair': return <Car />;
      case 'auto_electronics': return <Zap />;
      case 'used_market': return <ShoppingCart />;
      case 'animals': return <Dog />;
      case 'real_estate': return <Building2 />;
      case 'gyms': return <Dumbbell />;
      case 'stands': return <CarFront />;
      case 'offices': return <Briefcase />;
      case 'it_services': return <Laptop />;
      case 'perfumes': return <Pipette />;
      default: return <LandPlot />;
    }
  };

  const handleBusSearch = () => {
    setShowBusResults(true);
  };

  const renderEmptyState = () => (
    <div className="py-12 text-center">
      <p className="text-slate-400 font-medium">Nenhum resultado encontrado nesta ilha ou categoria.</p>
    </div>
  );

  const renderBusPlanner = () => {
    const currentIsland = targetIsland || 'PDL';
    
    // Companies list for cards
    const busCompanies = [
      { id: 'CRP', name: 'CRP', desc: 'Caetano, Raposo & Pereiras', color: 'from-blue-600 to-indigo-600' },
      { id: 'Varela', name: 'Varela', desc: 'Auto Viação Varela', color: 'from-pink-600 to-rose-600' },
      { id: 'Auto Viação Micaelense', name: 'AVM', desc: 'Auto Viação Micaelense', color: 'from-emerald-600 to-teal-600' }
    ];
    
    // Derive locations ONLY from actual schedules for this island
    const availableLocations = Array.from(new Set(
      busSchedules
        .filter(s => s.island === currentIsland)
        .flatMap(s => [s.origin, s.destination])
    )).sort();

    // Find companies that match the selected route
    const matchingSchedules = busSchedules.filter(s => {
      if (s.island !== currentIsland) return false;
      if (!busOrigin || !busDestination) return false;
      const sOrigin = s.origin.toLowerCase();
      const sDest = s.destination.toLowerCase();
      const bOrigin = busOrigin.toLowerCase();
      const bDest = busDestination.toLowerCase();
      return (sOrigin.includes(bOrigin) || bOrigin.includes(sOrigin)) && 
             (sDest.includes(bDest) || bDest.includes(sDest));
    });

    return (
      <div className="space-y-12 animate-in fade-in duration-500">
        {/* Company Cards Section */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
             <div className="w-1.5 h-6 bg-pink-600 rounded-full"></div>
             <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Selecione uma Companhia</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {busCompanies.map(c => (
              <button 
                key={c.id}
                onClick={() => {
                  setBusCompany(c.id);
                  setBusOrigin('');
                  setBusDestination('');
                }}
                className={`relative overflow-hidden rounded-[2.5rem] p-8 text-left transition-all duration-500 group
                  ${busCompany === c.id ? 'ring-4 ring-pink-500 ring-offset-4 scale-[1.02]' : 'hover:scale-[1.02] active:scale-95'}`}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${c.color} opacity-90 group-hover:opacity-100 transition-opacity`}></div>
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                   <Bus size={100} className="text-white" />
                </div>
                
                <div className="relative z-10 space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/30">
                     <Bus size={24} />
                  </div>
                  <div>
                    <h4 className="text-2xl font-black text-white uppercase tracking-tighter">{c.name}</h4>
                    <p className="text-[10px] font-bold text-white/70 uppercase tracking-widest mt-1">{c.desc}</p>
                  </div>
                  <div className="pt-4">
                     <span className="px-4 py-2 bg-white/20 text-white text-[9px] font-black rounded-full uppercase tracking-widest border border-white/20 backdrop-blur-sm">
                        Ver Rotas & Horários
                     </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Route Planner Card */}
        <div className="bg-white rounded-[3rem] shadow-xl border border-slate-100 overflow-hidden">
          <div className="bg-slate-900 px-10 py-8 text-white relative">
             <div className="absolute top-0 right-0 p-10 opacity-5">
                <Map size={140} />
             </div>
             <div className="relative z-10">
                <h3 className="text-2xl font-black uppercase tracking-tighter flex items-center gap-3">
                  <LandPlot className="text-pink-500" /> Planeie a sua Viagem
                </h3>
                <p className="text-slate-400 text-sm font-medium mt-2">Escolha o ponto de partida e chegada para descobrir horários</p>
             </div>
          </div>

          <div className="p-10 space-y-8">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-end">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block px-1">De onde? (Localidade)</label>
                  <div className="relative group">
                    <MapPin className="absolute left-4 top-4 text-slate-400 w-5 h-5 group-focus-within:text-pink-500 transition-colors" />
                    <select 
                      value={busOrigin}
                      onChange={(e) => { 
                        const val = e.target.value;
                        setBusOrigin(val); 
                        setShowBusResults(false);
                      }}
                      className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-pink-500/10 focus:border-pink-500 transition-all font-bold text-slate-700 appearance-none cursor-pointer"
                    >
                      <option value="">Selecione o local de partida...</option>
                      {availableLocations.map(loc => (
                        <option key={loc} value={loc}>{loc}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block px-1">Para onde? (Localidade)</label>
                  <div className="relative group">
                    <MapPin className="absolute left-4 top-4 text-slate-400 w-5 h-5 group-focus-within:text-pink-500 transition-colors" />
                    <select 
                      value={busDestination}
                      onChange={(e) => { 
                        const val = e.target.value;
                        setBusDestination(val); 
                        setShowBusResults(false);
                      }}
                      className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-pink-500/10 focus:border-pink-500 transition-all font-bold text-slate-700 appearance-none cursor-pointer"
                    >
                      <option value="">Selecione o destino...</option>
                      {availableLocations.filter(l => l !== busOrigin).map(loc => (
                        <option key={loc} value={loc}>{loc}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="md:col-span-2">
                   {matchingSchedules.length > 0 && busOrigin && busDestination && (
                     <motion.div 
                       initial={{ opacity: 0, y: 10 }}
                       animate={{ opacity: 1, y: 0 }}
                       className="mb-6 p-6 bg-pink-50 rounded-[2rem] border border-pink-100 flex items-center justify-between"
                     >
                        <div className="flex items-center gap-4">
                           <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-pink-600 shadow-sm">
                              <Bus size={24} />
                           </div>
                           <div>
                              <p className="text-[10px] font-black text-pink-400 uppercase tracking-widest leading-none">Companhia Detetada</p>
                              <p className="text-lg font-black text-pink-700 mt-1">
                                 {matchingSchedules.map(s => s.company).join(' & ')}
                              </p>
                           </div>
                        </div>
                        <div className="hidden md:block">
                           <span className="px-4 py-2 bg-pink-600 text-white text-[10px] font-black rounded-full uppercase tracking-widest">Rota Ativa</span>
                        </div>
                     </motion.div>
                   )}

                   <button 
                     onClick={() => { setBusModalStep('options'); setShowBusOptionsModal(true); }}
                     disabled={!busOrigin || !busDestination || matchingSchedules.length === 0}
                     className={`w-full py-5 rounded-[2rem] font-black text-sm uppercase tracking-widest shadow-2xl transition-all flex items-center justify-center gap-3
                       ${(!busOrigin || !busDestination || matchingSchedules.length === 0) 
                         ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200 shadow-none' 
                         : 'bg-gradient-to-r from-pink-600 to-rose-600 text-white hover:scale-[1.02] hover:shadow-pink-500/30 active:scale-95'}`}
                   >
                     {matchingSchedules.length === 0 && busOrigin && busDestination 
                       ? 'Rota Não Disponível' 
                       : 'Explorar Horários & Bilhetes'} 
                     <ArrowRight className="w-5 h-5" />
                   </button>
                </div>
             </div>
          </div>
        </div>
        
        {/* Info Banner */}
        <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white flex flex-col md:flex-row items-center gap-8 border border-white/5 relative overflow-hidden">
           <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-600/10 to-transparent"></div>
           <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md relative z-10">
              <Info className="text-blue-400" />
           </div>
           <div className="relative z-10 text-center md:text-left flex-1">
              <h4 className="text-xl font-black uppercase tracking-tighter">Sabia que pode carregar o seu passe?</h4>
              <p className="text-slate-400 text-sm mt-1">Utilize os seus créditos para adquirir bilhetes e passes turísticos diretamente na app.</p>
           </div>
           <div className="relative z-10">
              <button className="px-8 py-3 bg-white text-slate-900 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-blue-500 hover:text-white transition-all shadow-xl">Saiba Mais</button>
           </div>
        </div>
      </div>
    );
  };
;

  const renderRestaurants = () => {
    const cuisines = Array.from(new Set(allRestaurants.map(r => r.cuisine))).sort();
    const islands = ["Santa Maria", "São Miguel", "Terceira", "Graciosa", "São Jorge", "Pico", "Faial", "Flores", "Corvo"];

    return (
      <div className="space-y-8">
        {/* Elegant Filter Bar */}
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 space-y-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Camera className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input 
                type="text"
                placeholder="Procurar restaurante, cozinha ou local..."
                value={restaurantSearch}
                onChange={(e) => setRestaurantSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium text-slate-700"
              />
            </div>
            <div className="flex gap-4">
              <select 
                value={restaurantIslandFilter}
                onChange={(e) => setRestaurantIslandFilter(e.target.value)}
                className="px-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-bold text-xs uppercase tracking-widest text-slate-600 appearance-none min-w-[140px] text-center cursor-pointer"
              >
                <option value="all">Todas as Ilhas</option>
                {islands.map(i => <option key={i} value={i}>{i}</option>)}
              </select>
              <select 
                value={restaurantCuisineFilter}
                onChange={(e) => setRestaurantCuisineFilter(e.target.value)}
                className="px-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-bold text-xs uppercase tracking-widest text-slate-600 appearance-none min-w-[140px] text-center cursor-pointer"
              >
                <option value="all">Todas as Cozinhas</option>
                {cuisines.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          
          <div className="flex items-center justify-between pt-2">
            <div className="flex gap-2">
              <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-100">
                {filteredRestaurants.length} Restaurantes
              </span>
              {restaurantSearch && (
                <button 
                  onClick={() => setRestaurantSearch('')}
                  className="px-3 py-1 bg-slate-100 text-slate-500 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all flex items-center gap-1"
                >
                  <X size={10} /> Limpar Pesquisa
                </button>
              )}
            </div>
          </div>
        </div>

        {filteredRestaurants.length === 0 ? renderEmptyState() : (
          <div className="space-y-4">
            {filteredRestaurants.map(r => (
              <div 
                key={r.id} 
                className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all cursor-pointer group flex items-center gap-4 p-4 border border-slate-100"
                onClick={() => setSelectedRestaurant(r)}
              >
                <div className="w-24 h-24 rounded-2xl overflow-hidden shrink-0 relative">
                  <img 
                    src={r.image.startsWith('/') ? `${API_BASE_URL}${r.image}` : r.image} 
                    alt={r.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                  />
                  <div className="absolute top-1 right-1">
                    <div className="bg-white/90 backdrop-blur px-1.5 py-0.5 rounded-lg text-[8px] font-black flex items-center gap-0.5 shadow-sm">
                      <Star size={8} className="text-yellow-500 fill-current" /> {r.rating}
                    </div>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight truncate mb-1">{r.name}</h3>
                  <div className="flex items-center gap-3 mb-2">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-blue-500" /> {r.island}
                    </p>
                    <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{r.cuisine}</p>
                  </div>
                  <p className="text-xs text-slate-500 line-clamp-1 font-medium leading-relaxed">{r.description || 'Restaurante típico com sabores regionais.'}</p>
                </div>
                <div className="flex flex-col items-end gap-2 shrink-0 pr-2">
                  <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">
                    {r.reviews} Avaliações
                  </span>
                  <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
                    <ArrowRight size={20} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };


  const renderActivities = (type?: string | string[]) => {
    const isTrail = type === 'trail' || category === 'trails';
    
    // Lista mapeada com os novos IDs oficiais para sincronização total (Opção 1)
    const listaTrilhosSaoMiguel = [
      { id: "PR03SMI_vista_rei_sete_cidades", nome: "Vista do Rei - Sete Cidades", codigo: "PR03SMI", zona: "Oeste", distancia: "7.7 km", duracao: "2h00m", imagemUrl: "/imagens/sete_cidades.jpg" },
      { id: "PR06SMI_lagoa_furnas", nome: "Lagoa das Furnas", codigo: "PR06SMI", zona: "Leste", distancia: "9.5 km", duracao: "3h00m", imagemUrl: "/imagens/furnas.jpg" },
      { id: "PR42SMI_lagoa_fogo_praia", nome: "Lagoa do Fogo (Praia)", codigo: "PR42SMI", zona: "Centro", distancia: "4.4 km", duracao: "2h00m", imagemUrl: "/imagens/fogo.jpg" },
      { id: "PR28SMI_cha_gorreana", nome: "Trilho do Chá Gorreana", codigo: "PR28SMI", zona: "Leste", distancia: "3.4 km", duracao: "1h30m", imagemUrl: "/imagens/gorreana.jpg" },
      { id: "PRC05SMI_serra_devassa", nome: "Serra Devassa", codigo: "PRC05SMI", zona: "Oeste", distancia: "4.9 km", duracao: "2h15m", imagemUrl: "/imagens/devassa.jpg" },
      { id: "PR36SMI_rocha_relva", nome: "Rocha da Relva", codigo: "PR36SMI", zona: "Oeste", distancia: "5.5 km", duracao: "3h00m", imagemUrl: "/imagens/rocha_relva.jpg" },
      { id: "PR39SMI_salto_cabrito", nome: "Salto do Cabrito", codigo: "PR39SMI", zona: "Centro", distancia: "7.5 km", duracao: "2h30m", imagemUrl: "/imagens/salto_cabrito.jpg" },
      { id: "PRC43SMI_salto_prego_sanguinho", nome: "Salto do Prego / Sanguinho", codigo: "PRC43SMI", zona: "Leste", distancia: "4.5 km", duracao: "2h00m", imagemUrl: "/imagens/sanguinho.jpg" },
    ];

    let data = sortItems(type ? getActivitiesByType(type) : allActivities);

    if (isTrail) {
      // 1. Mapear os dados para garantir que os IDs batem certo com o dadosTrilhos.ts
      data = data.map(a => {
        const mapped = listaTrilhosSaoMiguel.find(t => 
          a.id === t.id || 
          a.title.toLowerCase().includes(t.nome.toLowerCase()) || 
          a.title.toLowerCase().includes(t.codigo.toLowerCase()) ||
          a.id.includes(t.codigo)
        );
        if (mapped) {
          return {
            ...a,
            type: 'trail', // Forçar tipo trail para garantir que o modal use o mapa interativo
            id: mapped.id, // Sincronizar ID com o dadosTrilhos.ts
            title: mapped.nome,
            distance: mapped.distancia,
            duration: mapped.duracao,
            // Guardar código e zona para filtros
            trailCode: mapped.codigo,
            trailZone: mapped.zona
          };
        }
        return a;
      });

      // 2. Filtrar por zona se estivermos em trilhos
      data = data.filter(a => {
        if (trailZoneFilter === 'Todos') return true;
        return (a as any).trailZone === trailZoneFilter;
      });
    }
    
    return (
      <div className="space-y-6">
        {isTrail ? (
          <div className="space-y-4">
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {['Todos', 'Oeste', 'Centro', 'Leste'].map((zona) => (
                <button
                  key={zona}
                  onClick={() => setTrailZoneFilter(zona as any)}
                  className={`px-5 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all shadow-sm border whitespace-nowrap
                    ${trailZoneFilter === zona ? 'bg-emerald-600 text-white border-transparent' : 'bg-white text-slate-500 border-slate-100 hover:border-emerald-200'}`}
                >
                  {zona === 'Todos' ? '🌍 Todos' : zona}
                </button>
              ))}
            </div>
            <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-1">
              Explora a natureza açoriana de forma guiada
            </p>
          </div>
        ) : (
          <div className="flex gap-3 mb-6 overflow-x-auto pb-2 scrollbar-hide">
            <button 
              onClick={() => setPriceFilter('all')}
              className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-sm border whitespace-nowrap
                ${priceFilter === 'all' ? 'bg-blue-600 text-white border-transparent shadow-blue-100' : 'bg-white text-slate-400 border-slate-100 hover:border-slate-200'}`}
            >
              Todos
            </button>
            <button 
              onClick={() => setPriceFilter('free')}
              className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-sm border whitespace-nowrap
                ${priceFilter === 'free' ? 'bg-emerald-500 text-white border-transparent shadow-emerald-100' : 'bg-white text-slate-400 border-slate-100 hover:border-slate-200'}`}
            >
              Grátis
            </button>
            {type !== 'trail' && (
              <button 
                onClick={() => setPriceFilter('paid')}
                className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-sm border whitespace-nowrap
                  ${priceFilter === 'paid' ? 'bg-blue-600 text-white border-transparent shadow-blue-100' : 'bg-white text-slate-400 border-slate-100 hover:border-slate-200'}`}
              >
                Pago
              </button>
            )}
          </div>
        )}

        {data.length === 0 ? renderEmptyState() : (
          <div className="space-y-4">
            {data.map(a => {
              const trail = a as any;
              
              return (
                <div 
                  key={a.id} 
                  className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all cursor-pointer group flex items-center gap-4 p-4 border border-slate-100"
                  onClick={() => {
                    if (a.type === 'trail' || a.type === 'landscape' || a.type === 'culture' || a.type === 'poi' || a.type === 'activity') {
                      setSelectedTrail(a);
                    }
                  }}
                >
                  <div className="w-24 h-24 rounded-2xl overflow-hidden shrink-0 relative">
                     <img 
                       src={a.image.startsWith('/') ? `${API_BASE_URL}${a.image}` : a.image} 
                       alt={a.title} 
                       className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                     />
                     <div className="absolute top-1 right-1">
                        {isTrail ? (
                          <span className="bg-emerald-600 text-white px-2 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-widest shadow-md">
                            {trail.trailCode || 'PR'}
                          </span>
                        ) : (
                          a.isPaid ? (
                            <span className="bg-blue-600 text-white px-2 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-widest shadow-md">
                              {a.price}€
                            </span>
                          ) : (
                            <span className="bg-green-500 text-white px-2 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-widest shadow-md">
                              Grátis
                            </span>
                          )
                        )}
                     </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight truncate mb-1">{a.title}</h3>
                    <div className="flex items-center gap-2 mb-2">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-blue-500" /> {a.island}
                      </p>
                      {trail.trailZone && (
                        <>
                          <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                          <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">{trail.trailZone}</span>
                        </>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 line-clamp-2 font-medium leading-relaxed">
                      {isTrail && trail.duration ? `⏱ ${trail.duration} | 🏁 ${trail.distance}` : a.description}
                    </p>
                  </div>
                  <ArrowRight size={20} className="text-slate-200 group-hover:text-emerald-600 transition-colors mr-2" />
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  const renderBusiness = (data: Business[]) => {
    const filtered = sortItems(data.filter(b => isAllIslands || b.island === targetIsland));
    
    if (filtered.length === 0) return renderEmptyState();

    return (
      <div className="space-y-4">
        {filtered.map(b => (
          <div 
            key={b.id} 
            className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all cursor-pointer group flex items-center gap-4 p-4 border border-slate-100"
            onClick={() => {
              if (b.businessType === 'shop' || category === 'shops') {
                setSelectedShop(b);
              } else {
                setSelectedRestaurant(b);
              }
            }} 
          >
            <div className="w-24 h-24 rounded-2xl overflow-hidden shrink-0 relative">
              <img 
                src={b.image.startsWith('/') ? `${API_BASE_URL}${b.image}` : b.image} 
                alt={b.name} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
              />
              <div className="absolute top-2 right-2">
                 <div className="w-6 h-6 rounded-lg bg-white/90 backdrop-blur flex items-center justify-center shadow-sm">
                   <MapPin className="w-3 h-3 text-red-500" />
                 </div>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight truncate mb-1">{b.name}</h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">{b.cuisine || b.island}</p>
              <p className="text-xs text-slate-500 line-clamp-2 font-medium leading-relaxed">{b.description}</p>
            </div>
            <ArrowRight size={20} className="text-slate-200 group-hover:text-blue-600 transition-colors mr-2" />
          </div>
        ))}
      </div>
    );
  };

  const renderBeauty = () => {
    const subcats = [
      { id: 'all', label: 'Todos', icon: <LayoutDashboard size={24} />, color: '#1A75BB' },
      { id: 'beauty_salon', label: getTranslation(lang, 'beauty_salon'), icon: <Sparkles size={24} />, color: '#FF2D78' },
      { id: 'hairdresser', label: getTranslation(lang, 'hairdresser'), icon: <Scissors size={24} />, color: '#8B5CF6' },
      { id: 'barber', label: getTranslation(lang, 'barber'), icon: <User size={24} />, color: '#10B981' },
      { id: 'manicure', label: getTranslation(lang, 'manicure'), icon: <Brush size={24} />, color: '#F59E0B' },
      { id: 'massage', label: getTranslation(lang, 'massage'), icon: <Flower2 size={24} />, color: '#EC4899' },
    ];

    const filtered = allBeauty.filter(b => {
      const matchIsland = isAllIslands || b.island === targetIsland;
      const matchSubcat = beautyFilter === 'all' || b.subcategory === beautyFilter;
      return matchIsland && matchSubcat;
    });

    if (!beautyFilter) {
      return (
        <div className="py-8 animate-in fade-in zoom-in duration-500">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {subcats.map(cat => (
              <button
                key={cat.id}
                onClick={() => { setBeautyFilter(cat.id); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className="flex flex-col items-center gap-4 group p-6 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
              >
                <div 
                  className="w-20 h-20 rounded-[1.5rem] flex items-center justify-center text-white shadow-lg transition-transform group-hover:scale-110"
                  style={{ backgroundColor: cat.color }}
                >
                  {React.cloneElement(cat.icon as React.ReactElement, { size: 32 })}
                </div>
                <span className="text-[11px] font-black uppercase tracking-widest text-slate-700 group-hover:text-slate-900">
                  {cat.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
        <div className="flex items-center justify-between bg-white p-4 rounded-3xl border border-slate-100 shadow-sm">
           <div className="flex items-center gap-4">
              <div 
                className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-md"
                style={{ backgroundColor: subcats.find(c => c.id === beautyFilter)?.color }}
              >
                {subcats.find(c => c.id === beautyFilter)?.icon}
              </div>
              <div>
                <h3 className="font-black text-slate-800 uppercase tracking-tight">
                  {subcats.find(c => c.id === beautyFilter)?.label}
                </h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  {filtered.length} resultados encontrados
                </p>
              </div>
           </div>
           <button 
             onClick={() => setBeautyFilter(null)}
             className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all flex items-center gap-2"
           >
             <X size={14} /> Voltar às Categorias
           </button>
        </div>

        {renderBusiness(filtered)}
      </div>
    );
  };

  const renderShops = () => {
    const filtered = allShops.filter(s => {
      const matchIsland = isAllIslands || s.island === targetIsland;
      return matchIsland;
    });

    return (
      <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
        {renderBusiness(filtered)}
      </div>
    );
  };

  const renderServices = () => {
    const subcats = [
      { id: 'all', label: 'Todos', icon: <LayoutDashboard size={24} />, color: '#607D8B' },
      { id: 'electrician', label: getTranslation(lang, 'electrician'), icon: <Zap size={24} />, color: '#FBBF24' },
      { id: 'bricklayer', label: getTranslation(lang, 'bricklayer'), icon: <HardHat size={24} />, color: '#B45309' },
      { id: 'carpenter', label: getTranslation(lang, 'carpenter'), icon: <Hammer size={24} />, color: '#92400E' },
      { id: 'plumber', label: getTranslation(lang, 'plumber'), icon: <Droplets size={24} />, color: '#3B82F6' },
      { id: 'painter', label: getTranslation(lang, 'painter'), icon: <Paintbrush size={24} />, color: '#EC4899' },
      { id: 'gardening', label: getTranslation(lang, 'gardening'), icon: <Leaf size={24} />, color: '#10B981' },
      { id: 'architect', label: getTranslation(lang, 'architect'), icon: <PencilRuler size={24} />, color: '#8B5CF6' },
      { id: 'engineer', label: getTranslation(lang, 'engineer'), icon: <DraftingCompass size={24} />, color: '#4B5563' },
      { id: 'hvac', label: getTranslation(lang, 'hvac'), icon: <ThermometerSnowflake size={24} />, color: '#06B6D4' },
    ];

    const filtered = allServices.filter(s => {
      const matchIsland = isAllIslands || s.island === targetIsland;
      const matchSubcat = servicesFilter === 'all' || s.subcategory === servicesFilter;
      return matchIsland && matchSubcat;
    });

    if (!servicesFilter) {
      return (
        <div className="py-8 animate-in fade-in zoom-in duration-500">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
            {subcats.map(cat => (
              <button
                key={cat.id}
                onClick={() => { setServicesFilter(cat.id); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className="flex flex-col items-center gap-4 group p-6 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
              >
                <div 
                  className="w-16 h-16 md:w-20 md:h-20 rounded-[1.5rem] flex items-center justify-center text-white shadow-lg transition-transform group-hover:scale-110"
                  style={{ backgroundColor: cat.color }}
                >
                  {React.cloneElement(cat.icon as React.ReactElement, { size: 32 })}
                </div>
                <span className="text-[10px] md:text-[11px] font-black uppercase tracking-tight text-slate-700 group-hover:text-slate-900 text-center leading-tight">
                  {cat.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
        <div className="flex items-center justify-between bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
           <div className="flex items-center gap-4">
              <div 
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-md"
                style={{ backgroundColor: subcats.find(c => c.id === servicesFilter)?.color }}
              >
                {subcats.find(c => c.id === servicesFilter)?.icon}
              </div>
              <div className="text-left">
                <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight">
                  {subcats.find(c => c.id === servicesFilter)?.label}
                </h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  {filtered.length} serviços especializados
                </p>
              </div>
           </div>
           <button 
             onClick={() => setServicesFilter(null)}
             className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all flex items-center gap-2 active:scale-95"
           >
             <ArrowRight size={14} className="rotate-180" /> Voltar
           </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(s => (
            <div 
              key={s.id} 
              className="bg-white rounded-3xl overflow-hidden shadow-lg border border-slate-100 hover:shadow-2xl transition-all duration-500 group"
            >
              <div className="h-48 overflow-hidden relative">
                <img 
                  src={s.image.startsWith('/') ? `${API_BASE_URL}${s.image}` : s.image} 
                  alt={s.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-black flex items-center gap-1 shadow-sm">
                   <MapPin className="w-3 h-3 text-blue-600" /> {s.island}
                </div>
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent p-6">
                   <h3 className="text-xl font-black text-white uppercase tracking-tighter">{s.name}</h3>
                </div>
              </div>
              <div className="p-6">
                <p className="text-sm text-slate-500 mb-6 leading-relaxed line-clamp-2">{s.description}</p>
                
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                      <PhoneCall size={16} />
                    </div>
                    <span className="text-sm font-bold text-slate-700">{s.phone}</span>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                      <Mail size={16} />
                    </div>
                    <span className="text-sm font-bold text-slate-700">{s.publicEmail}</span>
                  </div>

                    <div className="flex gap-2 mt-2">
                      <button 
                        onClick={() => window.location.href = `mailto:${s.publicEmail}?subject=Pedido de Orçamento - AzoresToyou`}
                        className="flex-1 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-blue-600 transition-all flex items-center justify-center gap-2 active:scale-95"
                      >
                        {getTranslation(lang, 'request_quote')}
                      </button>
                      <button 
                        onClick={() => {
                          const url = (s.latitude && s.longitude) 
                            ? `https://maps.google.com/?q=${s.latitude},${s.longitude}` 
                            : '#';
                          if (url !== '#') {
                            if (onShowMap) {
                              onShowMap(url);
                            } else {
                              window.open(url, '_blank');
                            }
                          }
                        }}
                        className="p-4 bg-slate-100 text-slate-600 rounded-2xl hover:bg-slate-200 transition-all active:scale-95"
                      >
                        <Map size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            </div>
          </div>
        );
      };
    
      const renderAutoRepair = () => {
        const subcats = [
          { id: 'parts', label: getTranslation(lang, 'parts'), icon: <Settings size={24} />, color: '#E53935' },
          { id: 'workshop', label: getTranslation(lang, 'workshop'), icon: <Wrench size={24} />, color: '#1E88E5' },
          { id: 'bodywork', label: getTranslation(lang, 'bodywork'), icon: <Paintbrush size={24} />, color: '#FB8C00' },
          { id: 'auto_electronics', label: getTranslation(lang, 'nav_auto_electronics'), icon: <Zap size={24} />, color: '#FFD600' },
          { id: 'used_market', label: getTranslation(lang, 'nav_used_market'), icon: <ShoppingCart size={24} />, color: '#43A047' },
        ];
    
        if (autoRepairFilter === 'auto_electronics') {
           return (
             <div className="space-y-6">
                <div className="flex items-center justify-between bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-yellow-400 flex items-center justify-center text-white"><Zap size={24}/></div>
                      <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight">{getTranslation(lang, 'nav_auto_electronics')}</h3>
                   </div>
                   <button onClick={() => setAutoRepairFilter(null)} className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all">Voltar</button>
                </div>
                {renderAutoElectronics()}
             </div>
           );
        }
    
        if (autoRepairFilter === 'used_market') {
           return (
             <div className="space-y-6">
                <div className="flex items-center justify-between bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-green-500 flex items-center justify-center text-white"><ShoppingCart size={24}/></div>
                      <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight">{getTranslation(lang, 'nav_used_market')}</h3>
                   </div>
                   <button onClick={() => setAutoRepairFilter(null)} className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all">Voltar</button>
                </div>
                {renderUsedMarket()}
             </div>
           );
        }
    
        const filtered = allAutoRepairs.filter(s => {
          const matchIsland = isAllIslands || s.island === targetIsland;
          const matchSubcat = autoRepairFilter === null || s.subcategory === autoRepairFilter;
          return matchIsland && matchSubcat;
        });
    
        if (!autoRepairFilter) {
          return (
            <div className="py-8 animate-in fade-in zoom-in duration-500">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
                {subcats.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => { setAutoRepairFilter(cat.id); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    className="flex flex-col items-center gap-4 group p-6 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
                  >
                    <div 
                      className="w-16 h-16 md:w-20 md:h-20 rounded-[1.5rem] flex items-center justify-center text-white shadow-lg transition-transform group-hover:scale-110"
                      style={{ backgroundColor: cat.color }}
                    >
                      {React.cloneElement(cat.icon as React.ReactElement, { size: 32 })}
                    </div>
                    <span className="text-[10px] md:text-[11px] font-black uppercase tracking-tight text-slate-700 group-hover:text-slate-900 text-center leading-tight">
                      {cat.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          );
        }
    
        return (
          <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
            <div className="flex items-center justify-between bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
               <div className="flex items-center gap-4">
                  <div 
                    className="w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-md"
                    style={{ backgroundColor: subcats.find(c => c.id === autoRepairFilter)?.color }}
                  >
                    {subcats.find(c => c.id === autoRepairFilter)?.icon}
                  </div>
                  <div className="text-left">
                    <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight">
                      {subcats.find(c => c.id === autoRepairFilter)?.label}
                    </h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      {filtered.length} estabelecimentos encontrados
                    </p>
                  </div>
               </div>
               <button 
                 onClick={() => setAutoRepairFilter(null)}
                 className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all flex items-center gap-2 active:scale-95"
               >
                 <ArrowRight size={14} className="rotate-180" /> Voltar
               </button>
            </div>
    
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map(s => (
                <div 
                  key={s.id} 
                  className="bg-white rounded-3xl overflow-hidden shadow-lg border border-slate-100 hover:shadow-2xl transition-all duration-500 group"
                >
                  <div className="h-48 overflow-hidden relative">
                    <img src={s.image.startsWith('/') ? `${API_BASE_URL}${s.image}` : s.image} alt={s.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-black flex items-center gap-1 shadow-sm">
                       <MapPin className="w-3 h-3 text-blue-600" /> {s.island}
                    </div>
                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent p-6">
                       <h3 className="text-xl font-black text-white uppercase tracking-tighter">{s.name}</h3>
                    </div>
                  </div>
                  <div className="p-6">
                    <p className="text-sm text-slate-500 mb-6 leading-relaxed line-clamp-2">{s.description}</p>
                    
                    <div className="flex gap-2">
                      <button 
                        onClick={() => {
                          const biz = { ...s, businessType: 'auto_repair' as const };
                          setSelectedRestaurant(biz);
                        }}
                        className="flex-1 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-blue-600 transition-all flex items-center justify-center gap-2 shadow-xl active:scale-95"
                      >
                        <Ticket size={18} />
                        Reservar
                      </button>
                      <button 
                        onClick={() => {
                          const url = (s.latitude && s.longitude) 
                            ? `https://maps.google.com/?q=${s.latitude},${s.longitude}` 
                            : '#';
                          if (url !== '#') {
                            if (onShowMap) {
                              onShowMap(url);
                            } else {
                              window.open(url, '_blank');
                            }
                          }
                        }}
                        className="p-4 bg-slate-100 text-slate-600 rounded-2xl hover:bg-slate-200 transition-all active:scale-95"
                      >
                        <Map size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      };



  const getContent = () => {
    switch (category) {
      case 'restaurants': return renderRestaurants();
      case 'trails': return renderActivities('trail');
      case 'landscapes': return renderActivities('landscape');
      case 'culture': return renderActivities('culture');
      case 'poi': return renderActivities(['poi', 'landscape']);
      case 'buses': return renderBusPlanner();
      case 'activities': return renderActivities('activity');
      case 'shops': return renderShops();
      case 'beauty': return renderBeauty();
      case 'services': return renderServices();
      case 'auto_repair': return renderAutoRepair();
      case 'auto_electronics': return renderAutoElectronics();
      case 'used_market': return renderUsedMarket();
      case 'animals': return renderBusiness(allAnimals);
      case 'real_estate': return renderStandardBusiness(allRealEstate, t('nav_real_estate'), <Building2 />, '#3F51B5');
      case 'gyms': return renderStandardBusiness(allGyms, t('nav_gyms'), <Dumbbell />, '#000000');
      case 'stands': return renderStandardBusiness(allStands, t('nav_stands'), <CarFront />, '#212121');
      case 'offices': return renderStandardBusiness(allOffices, t('nav_offices'), <Briefcase />, '#455A64', true);
      case 'it_services': return renderStandardBusiness(allITServices, t('nav_it_services'), <Laptop />, '#2196F3');
      case 'perfumes': return renderStandardBusiness(allPerfumes, t('nav_perfumes'), <Pipette />, '#E91E63');
      default: return renderActivities();
    }
  };

  const renderStandardBusiness = (items: Business[], title: string, icon: React.ReactNode, color: string, allowBooking: boolean = false) => {
    const filtered = items.filter(s => {
      const matchIsland = isAllIslands || s.island === targetIsland;
      return matchIsland;
    });

    return (
      <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(s => (
            <div 
              key={s.id} 
              className="bg-white rounded-3xl overflow-hidden shadow-lg border border-slate-100 hover:shadow-2xl transition-all duration-500 group cursor-pointer"
              onClick={() => {
                if (s.businessType === 'offices' || category === 'offices') setSelectedOffice(s);
                else if (s.businessType === 'stands' || category === 'stands') setSelectedStand(s);
                else if (s.businessType === 'shop' || category === 'shops' || category === 'gyms' || category === 'real_estate' || s.businessType === 'real_estate') setSelectedShop(s);
                else setSelectedRestaurant(s);
              }}
            >
              <div className="h-56 overflow-hidden relative">
                <img 
                  src={s.image && s.image.startsWith('/') ? `${API_BASE_URL}${s.image}` : (s.image || 'https://picsum.photos/400/300?random=' + s.id)} 
                  alt={s.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-black flex items-center gap-1 shadow-sm">
                   <MapPin className="w-3 h-3 text-blue-600" /> {s.island}
                </div>
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-6">
                   <h3 className="text-xl font-black text-white uppercase tracking-tighter mb-1">{s.name}</h3>
                   <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-white/20 text-white text-[8px] font-black rounded uppercase tracking-widest backdrop-blur-md border border-white/20">
                         {title}
                      </span>
                   </div>
                </div>
              </div>
              <div className="p-6">
                <p className="text-sm text-slate-500 mb-6 leading-relaxed line-clamp-3 font-medium">{s.description || 'Nenhuma descrição disponível.'}</p>
                
                <div className="space-y-3 mb-6">
                   <h4 className="text-[10px] font-black text-slate-300 uppercase tracking-widest flex items-center gap-2">
                     <Phone size={12} /> Contactos
                   </h4>
                   <div className="flex flex-col gap-2">
                      {s.phone && (
                        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100 group-hover:bg-white transition-colors">
                          <div className="p-2 bg-white rounded-lg shadow-sm border border-slate-50 group-hover:bg-blue-50 transition-colors">
                            <PhoneCall size={14} className="text-slate-400 group-hover:text-blue-600" />
                          </div>
                          <span className="text-xs font-bold text-slate-700">{s.phone}</span>
                        </div>
                      )}
                      {s.publicEmail && (
                        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100 group-hover:bg-white transition-colors">
                          <div className="p-2 bg-white rounded-lg shadow-sm border border-slate-50 group-hover:bg-purple-50 transition-colors">
                            <Mail size={14} className="text-slate-400 group-hover:text-purple-600" />
                          </div>
                          <span className="text-xs font-bold text-slate-700 truncate">{s.publicEmail}</span>
                        </div>
                      )}
                   </div>
                </div>

                <div className="flex flex-wrap gap-2">
                   {s.phone && (
                     <button 
                       onClick={() => window.location.href = `tel:${s.phone}`}
                       className="flex-1 min-w-[80px] py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-blue-600 transition-all flex items-center justify-center gap-2 active:scale-95 shadow-lg shadow-slate-900/10"
                     >
                       <PhoneCall size={16} /> Ligar
                     </button>
                   )}
                   <button 
                     onClick={() => {
                       const url = (s.latitude && s.longitude) 
                        ? `https://maps.google.com/?q=${s.latitude},${s.longitude}` 
                        : '#';
                       if (url !== '#') {
                         if (onShowMap) {
                           onShowMap(url);
                         } else {
                           window.open(url, '_blank');
                         }
                       }
                     }}
                     className="flex-1 min-w-[80px] py-4 bg-slate-100 text-slate-600 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-slate-200 transition-all flex items-center justify-center gap-2 active:scale-95"
                   >
                     <Map size={16} /> Direções
                   </button>
                   {allowBooking && (
                     <button 
                       onClick={() => setSelectedOffice(s)}
                       className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-blue-700 transition-all flex items-center justify-center gap-2 active:scale-95 shadow-lg shadow-blue-200"
                     >
                       <Calendar size={16} /> Agendar Visita
                     </button>
                   )}
                   {(s.businessType === 'shop' || s.businessType === 'gyms' || s.businessType === 'real_estate' || category === 'gyms' || category === 'real_estate') && (
                      <button 
                        onClick={() => setSelectedShop(s)}
                        className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-blue-700 transition-all flex items-center justify-center gap-2 active:scale-95 shadow-lg shadow-blue-200"
                      >
                        {category === 'gyms' ? <Dumbbell size={16} /> : (category === 'real_estate' || s.businessType === 'real_estate') ? <Home size={16} /> : <ShoppingBag size={16} />}
                        {category === 'gyms' ? 'Ver Máquinas / Instalações' : (category === 'real_estate' || s.businessType === 'real_estate') ? 'Ver Casas / Apartamentos' : 'Ver Artigos'}
                      </button>
                   )}
                   {s.businessType === 'stands' && (
                     <button 
                       onClick={() => setSelectedStand(s)}
                       className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-blue-700 transition-all flex items-center justify-center gap-2 active:scale-95 shadow-lg shadow-blue-200"
                     >
                       <CarFront size={16} /> Ver Viaturas
                     </button>
                   )}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-[3rem] border border-slate-100 shadow-sm">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-6">
               {React.cloneElement(icon as React.ReactElement, { size: 40 })}
            </div>
            <h4 className="text-lg font-black text-slate-800 uppercase tracking-tighter mb-2">Sem Resultados</h4>
            <p className="text-slate-400 text-sm font-medium">Ainda não existem registos nesta categoria para esta ilha.</p>
          </div>
        )}
      </div>
    );
  };

  const renderAnimals = () => {
    const filtered = allAnimals.filter(s => {
      const matchIsland = isAllIslands || s.island === targetIsland;
      return matchIsland;
    });

    return (
      <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(s => (
            <div key={s.id} className="bg-white rounded-3xl overflow-hidden shadow-lg border border-slate-100 hover:shadow-2xl transition-all duration-500 group">
              <div className="h-56 overflow-hidden relative">
                <img src={s.image} alt={s.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-black flex items-center gap-1 shadow-sm">
                   <MapPin className="w-3 h-3 text-blue-600" /> {s.island}
                </div>
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-6">
                   <h3 className="text-xl font-black text-white uppercase tracking-tighter mb-1">{s.name}</h3>
                   <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-orange-600 text-white text-[8px] font-black rounded uppercase tracking-widest">Loja de Animais</span>
                   </div>
                </div>
              </div>
              <div className="p-6">
                <p className="text-sm text-slate-500 mb-6 leading-relaxed line-clamp-3 font-medium">{s.description}</p>
                
                <div className="space-y-3 mb-6">
                   <h4 className="text-[10px] font-black text-slate-300 uppercase tracking-widest flex items-center gap-2">
                     <Phone size={12} /> Contactos
                   </h4>
                   <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100 group-hover:bg-white transition-colors">
                        <div className="p-2 bg-white rounded-lg shadow-sm border border-slate-50 group-hover:bg-blue-50 transition-colors">
                          <PhoneCall size={14} className="text-slate-400 group-hover:text-blue-600" />
                        </div>
                        <span className="text-xs font-bold text-slate-700">{s.phone}</span>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100 group-hover:bg-white transition-colors">
                        <div className="p-2 bg-white rounded-lg shadow-sm border border-slate-50 group-hover:bg-purple-50 transition-colors">
                          <Mail size={14} className="text-slate-400 group-hover:text-purple-600" />
                        </div>
                        <span className="text-xs font-bold text-slate-700 truncate">{s.publicEmail}</span>
                      </div>
                   </div>
                </div>

                <div className="flex gap-2">
                   <button 
                     onClick={() => window.location.href = `tel:${s.phone}`}
                     className="flex-1 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-blue-600 transition-all flex items-center justify-center gap-2 active:scale-95 shadow-lg shadow-slate-900/10"
                   >
                     <PhoneCall size={16} /> Ligar
                   </button>
                   <button 
                     onClick={() => {
                       const url = (s.latitude && s.longitude) 
                        ? `https://maps.google.com/?q=${s.latitude},${s.longitude}` 
                        : '#';
                       if (url !== '#') {
                         if (onShowMap) {
                           onShowMap(url);
                         } else {
                           window.open(url, '_blank');
                         }
                       }
                     }}
                     className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-slate-200 transition-all flex items-center justify-center gap-2 active:scale-95"
                   >
                     <Map size={16} /> Direções
                   </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderAutoElectronics = () => {
    const filtered = allAutoElectronics.filter(s => {
      const matchIsland = isAllIslands || s.island === targetIsland;
      return matchIsland;
    });

    return (
      <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(s => (
            <div key={s.id} className="bg-white rounded-3xl overflow-hidden shadow-lg border border-slate-100 hover:shadow-2xl transition-all duration-500 group">
              <div className="h-48 overflow-hidden relative">
                <img src={s.image} alt={s.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-black flex items-center gap-1 shadow-sm">
                   <MapPin className="w-3 h-3 text-blue-600" /> {s.island}
                </div>
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent p-6">
                   <h3 className="text-xl font-black text-white uppercase tracking-tighter">{s.name}</h3>
                </div>
              </div>
              <div className="p-6">
                <p className="text-sm text-slate-500 mb-6 leading-relaxed line-clamp-2">{s.description}</p>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setSelectedRestaurant({ ...s, businessType: 'auto_repair' as any })}
                    className="flex-1 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-yellow-500 transition-all flex items-center justify-center gap-2 active:scale-95 shadow-xl shadow-slate-900/10"
                  >
                    Agendar / Reservar
                  </button>
                  <button 
                    onClick={() => {
                      const url = (s.latitude && s.longitude) 
                        ? `https://maps.google.com/?q=${s.latitude},${s.longitude}` 
                        : '#';
                      if (url !== '#') {
                        if (onShowMap) {
                          onShowMap(url);
                        } else {
                          window.open(url, '_blank');
                        }
                      }
                    }}
                    className="p-4 bg-slate-100 text-slate-600 rounded-2xl hover:bg-slate-200 transition-all active:scale-95"
                  >
                    <Map size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // fixed
  const renderUsedMarket = () => {
    const subcats = [
      { id: 'cars_motos', label: getTranslation(lang, 'cars_motos'), icon: <Car size={24} />, color: '#1A75BB' },
      { id: 'used_parts', label: getTranslation(lang, 'used_parts'), icon: <Settings size={24} />, color: '#607D8B' },
    ];

    const filtered = allUsedMarket.filter(u => {
      const matchIsland = isAllIslands || u.island === targetIsland;
      const matchSubcat = usedMarketFilter === null || u.subcategory === usedMarketFilter;
      return matchIsland && matchSubcat;
    });

    if (!usedMarketFilter) {
      return (
        <div className="py-8 animate-in fade-in zoom-in duration-500">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {subcats.map(cat => (
              <button
                key={cat.id}
                onClick={() => { setUsedMarketFilter(cat.id); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className="flex flex-col items-center gap-6 group p-10 bg-white rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500"
              >
                <div 
                  className="w-24 h-24 rounded-[2rem] flex items-center justify-center text-white shadow-xl transition-transform group-hover:scale-110"
                  style={{ backgroundColor: cat.color }}
                >
                  {React.cloneElement(cat.icon as React.ReactElement, { size: 48 })}
                </div>
                <div className="text-center">
                  <span className="text-lg font-black uppercase tracking-tight text-slate-800 group-hover:text-blue-600 block">
                    {cat.label}
                  </span>
                  <p className="text-sm text-slate-400 font-bold mt-1">Ver classificados</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
        <div className="flex items-center justify-between bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
           <div className="flex items-center gap-4">
              <div 
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-md"
                style={{ backgroundColor: subcats.find(c => c.id === usedMarketFilter)?.color }}
              >
                {subcats.find(c => c.id === usedMarketFilter)?.icon}
              </div>
              <div className="text-left">
                <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight">
                  {subcats.find(c => c.id === usedMarketFilter)?.label}
                </h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  {filtered.length} anúncios ativos
                </p>
              </div>
           </div>
           <button 
             onClick={() => setUsedMarketFilter(null)}
             className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all flex items-center gap-2 active:scale-95"
           >
             <ArrowRight size={14} className="rotate-180" /> Voltar
           </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(u => (
            <div key={u.id} className="bg-white rounded-3xl overflow-hidden shadow-lg border border-slate-100 hover:shadow-2xl transition-all duration-500 group">
              <div className="h-56 overflow-hidden relative">
                <img src={u.image} alt={u.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-black flex items-center gap-1 shadow-sm">
                   <MapPin className="w-3 h-3 text-blue-600" /> {u.island}
                </div>
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-6">
                   <h3 className="text-xl font-black text-white uppercase tracking-tighter mb-1">{u.name}</h3>
                   <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-blue-600 text-white text-[8px] font-black rounded uppercase tracking-widest">Destaque</span>
                   </div>
                </div>
              </div>
              <div className="p-6">
                <p className="text-sm text-slate-500 mb-6 leading-relaxed line-clamp-3 font-medium">{u.description}</p>
                
                <div className="space-y-3 mb-6">
                   <h4 className="text-[10px] font-black text-slate-300 uppercase tracking-widest flex items-center gap-2">
                     <User size={12} /> {getTranslation(lang, 'seller_info')}
                   </h4>
                   <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100 group-hover:bg-white transition-colors">
                        <div className="p-2 bg-white rounded-lg shadow-sm border border-slate-50 group-hover:bg-blue-50 transition-colors">
                          <PhoneCall size={14} className="text-slate-400 group-hover:text-blue-600" />
                        </div>
                        <span className="text-xs font-bold text-slate-700">{u.phone}</span>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100 group-hover:bg-white transition-colors">
                        <div className="p-2 bg-white rounded-lg shadow-sm border border-slate-50 group-hover:bg-purple-50 transition-colors">
                          <Mail size={14} className="text-slate-400 group-hover:text-purple-600" />
                        </div>
                        <span className="text-xs font-bold text-slate-700 truncate">{u.publicEmail}</span>
                      </div>
                   </div>
                </div>

                <div className="flex gap-2">
                   <button 
                     onClick={() => window.location.href = `tel:${u.phone}`}
                     className="flex-1 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-blue-600 transition-all flex items-center justify-center gap-2 active:scale-95"
                   >
                     <PhoneCall size={16} /> Ligar
                   </button>
                   <button 
                     onClick={() => {
                       const url = (u.latitude && u.longitude) 
                        ? `https://maps.google.com/?q=${u.latitude},${u.longitude}` 
                        : '#';
                       if (url !== '#') {
                         if (onShowMap) {
                           onShowMap(url);
                         } else {
                           window.open(url, '_blank');
                         }
                       }
                     }}
                     className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-slate-200 transition-all flex items-center justify-center gap-2 active:scale-95"
                   >
                     <Map size={16} /> Direções
                   </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="px-6 md:px-10 pb-32 pt-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Category Header */}
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-5">
           <div 
             className="w-16 h-16 rounded-[2rem] flex items-center justify-center text-white shadow-2xl transition-transform hover:scale-105"
             style={{ backgroundColor: COLORS[category] || '#1A75BB' }}
           >
             {React.cloneElement(getCategoryIcon(category) as React.ReactElement, { size: 32 })}
           </div>
           <div>
             <h2 className="text-3xl font-black text-slate-800 uppercase tracking-tighter leading-none mb-1">{getCategoryTitle(category)}</h2>
             <div className="flex items-center gap-2">
               <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></div>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                 {isAllIslands ? 'Explorando todo o arquipélago' : `Melhor de ${destinationIsland}`}
               </p>
             </div>
           </div>
        </div>
        <button 
          onClick={onClose}
          className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg border border-slate-100 text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-all active:scale-90"
        >
          <X size={24} />
        </button>
      </div>



      {/* Main Content Area */}
      <div className="relative mt-12 -mx-6 md:-mx-10 px-6 md:px-10 py-12 bg-slate-50/50 border-t border-slate-100">
        <div className="flex items-center justify-between mb-10">
           <div className="flex items-center gap-3">
              <div className="w-2 h-8 bg-blue-600 rounded-full"></div>
              <div>
                <h3 className="text-sm font-black text-slate-800 uppercase tracking-tight">Catálogo Completo</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Explorar todos os itens disponíveis</p>
              </div>
           </div>
           <div className="px-4 py-2 bg-white rounded-full border border-slate-200 shadow-sm">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Organizado por Relevância</span>
           </div>
        </div>
        {getContent()}
      </div>

      {/* Modals */}
      {selectedRestaurant && (
        <RestaurantModal 
          isOpen={!!selectedRestaurant}
          onClose={() => setSelectedRestaurant(null)}
          restaurant={selectedRestaurant as Restaurant}
          language={lang}
          isAuthenticated={isAuthenticated}
          onShowAuth={onShowAuth}
          userCredits={userCredits}
          setUserCredits={setUserCredits}
          userProfile={userProfile}
          onReserveSuccess={onReserveSuccess}
          onShowMap={onShowMap}
          onShowInteractiveMap={onShowInteractiveMap}
        />
      )}

      {selectedTrail && (
        <TrailModal
          isOpen={!!selectedTrail}
          onClose={() => setSelectedTrail(null)}
          trail={selectedTrail}
          language={lang}
          onShowMap={onShowMap}
          onShowInteractiveMap={onShowInteractiveMap}
        />
      )}

      {selectedOffice && (
        <OfficeBookingModal
          isOpen={!!selectedOffice}
          onClose={() => setSelectedOffice(null)}
          office={selectedOffice}
          language={lang}
          isAuthenticated={isAuthenticated}
          onShowAuth={onShowAuth}
          onShowMap={onShowMap}
        />
      )}

      {selectedStand && (
        <CarStandModal
          isOpen={!!selectedStand}
          onClose={() => setSelectedStand(null)}
          stand={selectedStand}
          language={lang}
          onShowMap={onShowMap}
        />
      )}

      {selectedShop && (
        <ShopCatalogModal
          isOpen={!!selectedShop}
          onClose={() => setSelectedShop(null)}
          shop={selectedShop}
          language={lang}
          onShowMap={onShowMap}
        />
      )}

      {showBusOptionsModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowBusOptionsModal(false)}></div>
           <div className="bg-white rounded-[2.5rem] w-full max-w-lg shadow-2xl relative z-10 overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]">
              <div className="bg-blue-600 p-8 text-white flex justify-between items-start">
                 <div>
                    <h3 className="text-2xl font-black uppercase tracking-tighter leading-tight">Escolha o Bilhete</h3>
                    <p className="text-blue-100 text-sm font-medium mt-1">Viagem de {busOrigin} para {busDestination}</p>
                 </div>
                 <button onClick={() => setShowBusOptionsModal(false)} className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-all">
                    <X size={24} />
                 </button>
              </div>
              
              <div className="p-8 overflow-y-auto space-y-6">
                 {busModalStep === 'options' && (
                    <div className="grid grid-cols-1 gap-4">
                       {[
                         { id: 'single', title: 'Bilhete Simples', desc: 'Apenas uma viagem', price: '2.50€', icon: <Ticket /> },
                         { id: 'return', title: 'Bilhete Ida e Volta', desc: 'Válido por 24h', price: '4.50€', icon: <ArrowRight className="rotate-90" /> },
                         { id: 'tourist', title: 'Passe Turístico', desc: 'Viagens ilimitadas (3 dias)', price: '15.00€', icon: <Camera /> }
                       ].map(opt => (
                         <button 
                           key={opt.id}
                           onClick={() => { setSelectedTicketType(opt.id); setBusModalStep('schedules'); }}
                           className="flex items-center gap-6 p-6 bg-slate-50 border border-slate-100 rounded-3xl hover:bg-white hover:shadow-xl hover:border-blue-500 transition-all group"
                         >
                           <div className="w-14 h-14 rounded-2xl bg-white shadow-md flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all">
                              {opt.icon}
                           </div>
                           <div className="flex-1 text-left">
                              <h4 className="font-black text-slate-800 uppercase tracking-tight">{opt.title}</h4>
                              <p className="text-xs text-slate-500 font-medium">{opt.desc}</p>
                           </div>
                           <span className="text-lg font-black text-blue-600">{opt.price}</span>
                         </button>
                       ))}
                    </div>
                 )}

                 {busModalStep === 'schedules' && (
                    <div className="space-y-6">
                       {/* Day Selection Tabs */}
                       <div className="flex bg-slate-100 p-1 rounded-2xl">
                          {(['weekdays', 'saturdays', 'sundays'] as const).map(day => (
                            <button
                              key={day}
                              onClick={() => setSelectedDayType(day)}
                              className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all
                                ${selectedDayType === day ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                            >
                              {day === 'weekdays' ? 'Dias Úteis' : day === 'saturdays' ? 'Sábados' : 'Domingos'}
                            </button>
                          ))}
                       </div>

                       <div className="space-y-3">
                          {(() => {
                            const currentIsland = targetIsland || 'PDL';
                            const matches = busSchedules.filter(s => {
                               if (s.island !== currentIsland) return false;
                               if (busCompany !== 'all' && !s.company.toLowerCase().includes(busCompany.toLowerCase())) return false;
                               const sOrigin = s.origin.toLowerCase();
                               const sDest = s.destination.toLowerCase();
                               const bOrigin = busOrigin.toLowerCase();
                               const bDest = busDestination.toLowerCase();
                               return (sOrigin.includes(bOrigin) || bOrigin.includes(sOrigin)) && 
                                      (sDest.includes(bDest) || bDest.includes(sDest));
                            });

                            if (matches.length === 0) {
                              return <p className="text-center py-8 text-slate-400 text-xs">Nenhum horário encontrado para esta rota.</p>;
                            }

                            return matches.flatMap(s => {
                               const times = s.schedule?.[selectedDayType] || (selectedDayType === 'weekdays' ? s.times : []);
                               return times.map((time, tIdx) => ({
                                 time,
                                 company: s.company,
                                 id: `${s.id}-${tIdx}`
                               }));
                            }).sort((a, b) => a.time.localeCompare(b.time)).map((s, idx) => (
                              <div key={s.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-blue-200 transition-all">
                                 <div className="flex items-center gap-4">
                                    <div className="p-2 bg-white rounded-lg shadow-sm"><Clock className="text-blue-600 w-4 h-4" /></div>
                                    <div>
                                       <span className="text-lg font-black text-slate-800 leading-none">{s.time}</span>
                                       <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{s.company}</p>
                                    </div>
                                 </div>
                                 <button 
                                   onClick={() => setBusModalStep('payment')}
                                   className="px-5 py-2 bg-slate-900 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all"
                                 >
                                    Selecionar
                                 </button>
                              </div>
                            ));
                          })()}
                       </div>
                    </div>
                  )}

                 {busModalStep === 'payment' && (
                    <div className="text-center space-y-8 py-6">
                       <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                          <CreditCard size={40} />
                       </div>
                       <div>
                          <h4 className="text-2xl font-black text-slate-800 uppercase tracking-tighter leading-tight">Confirmar Pagamento</h4>
                          <p className="text-slate-500 font-medium mt-2">O valor será debitado dos seus créditos AzoresToyou.</p>
                       </div>
                       <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 flex items-center justify-between">
                          <span className="text-slate-400 font-bold uppercase text-xs tracking-widest">Total a pagar</span>
                          <span className="text-2xl font-black text-slate-900">2.50€</span>
                       </div>
                       <button 
                         onClick={() => {
                           alert('Bilhete emitido com sucesso! Podes encontrá-lo na tua área de reservas.');
                           setShowBusOptionsModal(false);
                         }}
                         className="w-full py-5 bg-blue-600 text-white rounded-[1.5rem] font-black uppercase tracking-widest shadow-xl shadow-blue-600/20 active:scale-95 transition-all"
                       >
                          Confirmar Agora
                       </button>
                    </div>
                 )}
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default ExploreSection;
