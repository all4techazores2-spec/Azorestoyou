
import React, { useState } from 'react';
import { Restaurant, Activity, ExploreCategory, Language, BusSchedule, Business, AutoRepairSubCategory } from '../types';
import { COLORS, ISLAND_LOCALITIES, getRestaurants, getActivities, getShops, getBeauty, getServices, getAutoRepairs, getAutoElectronics, getUsedMarket, getAnimals, getRealEstate, getGyms, getStands, getOffices, getITServices, getPerfumes } from '../constants';
import RestaurantModal from './RestaurantModal';
import TrailModal from './TrailModal';
import OfficeBookingModal from './OfficeBookingModal';
import CarStandModal from './CarStandModal';
import ShopCatalogModal from './ShopCatalogModal';
import { MapPin, ArrowRight, Utensils, MountainSnow, Camera, LandPlot, Bus, Info, Clock, Ticket, Map, Heart, ShoppingBag, Sparkles, Scissors, User, Flower2, Hand, LayoutDashboard, Brush, X, Wrench, Zap, Hammer, Droplets, Paintbrush, HardHat, Mail, PhoneCall, Leaf, PencilRuler, ThermometerSnowflake, DraftingCompass, Settings, Car, ShoppingCart, MessageSquare, Dog, Phone, Building2, Dumbbell, CarFront, Briefcase, Laptop, Pipette, Calendar, Home, CreditCard } from 'lucide-react';
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
  onReserveSuccess?: (resData: any, restName: string, restId: string) => void;
  userProfile?: { email: string; name: string; phone: string };
  onClose?: () => void;
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
  onClose
}) => {
  const API_BASE_URL = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
    ? 'http://localhost:3001'
    : 'https://azorestoyou-1.onrender.com';

  const lang = currentLanguage as Language;
  const t = (key: any) => getTranslation(lang, key);
  
  // MERGE BACKEND DATA WITH LOCAL EXAMPLES (Ensures simulation data is always present)
  const allRestaurants = [...restaurants, ...getRestaurants(lang).filter(r => !restaurants.find(br => br.id === r.id))];
  const allActivities = [...activities, ...getActivities(lang).filter(a => !activities.find(ba => ba.id === a.id))];
  const allShops = [...shops, ...getShops(lang).filter(s => !shops.find(bs => bs.id === s.id))];
  const allBeauty = [...beauty, ...getBeauty(lang).filter(b => !beauty.find(bb => bb.id === b.id))];
  const allServices = [...services, ...getServices(lang).filter(s => !services.find(bs => bs.id === s.id))];
  const allAutoRepairs = [...autoRepairs, ...getAutoRepairs(lang).filter(a => !autoRepairs.find(ba => ba.id === a.id))];
  const allAutoElectronics = [...autoElectronics, ...getAutoElectronics(lang).filter(a => !autoElectronics.find(ba => ba.id === a.id))];
  const allUsedMarket = [...usedMarket, ...getUsedMarket(lang).filter(u => !usedMarket.find(bu => bu.id === u.id))];
  const allAnimals = [...animals, ...getAnimals(lang).filter(a => !animals.find(ba => ba.id === a.id))];
  const allRealEstate = [...realEstate, ...getRealEstate(lang).filter(r => !realEstate.find(br => br.id === r.id))];
  const allGyms = [...gyms, ...getGyms(lang).filter(g => !gyms.find(bg => bg.id === g.id))];
  const allStands = [...stands, ...getStands(lang).filter(s => !stands.find(bs => bs.id === s.id))];
  const allOffices = [...offices, ...getOffices(lang).filter(o => !offices.find(bo => bo.id === o.id))];
  const allITServices = [...itServices, ...getITServices(lang).filter(i => !itServices.find(bi => bi.id === i.id))];
  const allPerfumes = [...perfumes, ...getPerfumes(lang).filter(p => !perfumes.find(bp => bp.id === p.id))];

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
  const [beautyFilter, setBeautyFilter] = useState<string | null>(null);
  const [shopsFilter, setShopsFilter] = useState<string | null>(null);
  const [servicesFilter, setServicesFilter] = useState<string | null>(null);
  const [autoRepairFilter, setAutoRepairFilter] = useState<string | null>(null);
  const [autoElectronicsFilter, setAutoElectronicsFilter] = useState<string | null>(null);
  const [usedMarketFilter, setUsedMarketFilter] = useState<string | null>(null);
  const [priceFilter, setPriceFilter] = useState<'all' | 'free' | 'paid'>('all');
  
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

  const filteredRestaurants = sortItems(allRestaurants.filter(r => isAllIslands || r.island === targetIsland));
  
  // Mapping for the expanded categories
  const getActivitiesByType = (type: string) => {
    const filtered = allActivities.filter(a => {
      const matchesType = a.type === type;
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
      case 'activities': return <MountainSnow />;
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
    
    // Available companies based on data
    const companies = ['CRP', 'Varela', 'Auto Viação Micaelense'];
    
    // Filter logic for bus results using PROPS and Company
    const filteredSchedules = busSchedules.filter(s => {
       if (s.island !== currentIsland) return false;
       if (busCompany !== 'all' && !s.company.toLowerCase().includes(busCompany.toLowerCase())) return false;
       if (!busOrigin || !busDestination) return false;
       
       // Flexible matching logic (partial match, case-insensitive)
       const sOrigin = s.origin.toLowerCase();
       const sDest = s.destination.toLowerCase();
       const bOrigin = busOrigin.toLowerCase();
       const bDest = busDestination.toLowerCase();

       const matchOrigin = sOrigin.includes(bOrigin) || bOrigin.includes(sOrigin);
       const matchDest = sDest.includes(bDest) || bDest.includes(sDest);
       
       return matchOrigin && matchDest;
    });

    // Dynamic locations based on company
    const baseLocations = ISLAND_LOCALITIES[currentIsland] || [];
    const locations = busCompany === 'all' 
      ? baseLocations 
      : Array.from(new Set(
          busSchedules
            .filter(s => s.island === currentIsland && s.company.toLowerCase().includes(busCompany.toLowerCase()))
            .flatMap(s => [s.origin, s.destination])
        )).sort();

    return (
      <div className="space-y-8 animate-in fade-in duration-500">
        {/* Company Filter & Selection Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
          <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex justify-between items-center">
             <div>
               <h3 className="font-bold text-slate-700 flex items-center gap-2">
                 <Bus className="w-5 h-5 text-pink-500" /> {getTranslation(lang, 'plan_trip')}
               </h3>
               <p className="text-xs text-slate-500 mt-1">{getTranslation(lang, 'plan_trip_subtitle')}</p>
             </div>
          </div>

          <div className="p-6 space-y-6">
             {/* Company Selection */}
             <div className="space-y-3">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400">Escolha a Companhia</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                   <button 
                     onClick={() => { setBusCompany('all'); setBusOrigin(''); setBusDestination(''); }}
                     className={`py-3 px-4 rounded-xl text-[10px] font-black uppercase tracking-tighter transition-all border ${busCompany === 'all' ? 'bg-pink-600 text-white border-transparent shadow-lg shadow-pink-200' : 'bg-white text-slate-500 border-slate-100 hover:border-pink-200'}`}
                   >
                     Todas
                   </button>
                   {companies.map(c => (
                     <button 
                       key={c}
                       onClick={() => { setBusCompany(c); setBusOrigin(''); setBusDestination(''); }}
                       className={`py-3 px-4 rounded-xl text-[10px] font-black uppercase tracking-tighter transition-all border ${busCompany === c ? 'bg-pink-600 text-white border-transparent shadow-lg shadow-pink-200' : 'bg-white text-slate-500 border-slate-100 hover:border-pink-200'}`}
                     >
                       {c}
                     </button>
                   ))}
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-600 block">{getTranslation(lang, 'bus_origin')}</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3.5 text-slate-400 w-5 h-5" />
                    <select 
                      value={busOrigin}
                      onChange={(e) => { setBusOrigin(e.target.value); setShowBusResults(false); }}
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all font-medium text-slate-700 appearance-none"
                    >
                      <option value="">{getTranslation(lang, 'select')}</option>
                      {locations.map(loc => (
                        <option key={loc} value={loc}>{loc}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-600 block">{getTranslation(lang, 'bus_destination')}</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3.5 text-slate-400 w-5 h-5" />
                    <select 
                      value={busDestination}
                      onChange={(e) => { setBusDestination(e.target.value); setShowBusResults(false); }}
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all font-medium text-slate-700 appearance-none"
                    >
                      <option value="">{getTranslation(lang, 'select')}</option>
                      {locations.filter(l => l !== busOrigin).map(loc => (
                        <option key={loc} value={loc}>{loc}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <button 
                  onClick={() => { setBusModalStep('options'); setShowBusOptionsModal(true); }}
                  disabled={!busOrigin || !busDestination}
                  className={`w-full md:col-span-2 py-4 rounded-xl font-bold text-white shadow-lg transition-all flex items-center justify-center gap-2
                    ${(!busOrigin || !busDestination) 
                      ? 'bg-slate-300 cursor-not-allowed' 
                      : 'bg-pink-600 hover:bg-pink-700 hover:scale-[1.02]'}`}
                >
                  Continuar <ArrowRight className="w-5 h-5" />
                </button>
             </div>
          </div>
        </div>
        {/* Results Area (Now in Modal) */}
      </div>
    );
  };

  const renderRestaurants = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredRestaurants.map(r => {
        const isFavorite = favoriteRestaurantIds.includes(r.id);
        return (
        <div 
          key={r.id} 
          className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all cursor-pointer group relative"
          onClick={() => setSelectedRestaurant(r)}
        >
          <button 
            className="absolute top-3 left-3 z-10 p-2 bg-white/90 backdrop-blur rounded-full text-red-500 hover:scale-110 transition-transform shadow-sm"
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite?.(r.id);
            }}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
          <div className="h-48 overflow-hidden relative">
            <img 
              src={r.image.startsWith('/') ? `${API_BASE_URL}${r.image}` : r.image} 
              alt={r.name} 
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
            />
            <div className="absolute top-2 right-2 bg-white/90 backdrop-blur px-2 py-1 rounded text-xs font-bold flex items-center gap-1">
               <MapPin className="w-3 h-3 text-red-500" /> {r.island}
            </div>
          </div>
          <div className="p-5">
            <h3 className="text-xl font-bold text-slate-800 mb-1">{r.name}</h3>
            <p className="text-sm text-slate-500 mb-3">{r.cuisine} • {r.reviews} avaliações</p>
            <div className="flex items-center justify-between mt-4">
              <span className="text-yellow-500 font-bold flex items-center gap-1">
                ★ {r.rating}
              </span>
              <span className="text-blue-600 text-sm font-semibold group-hover:translate-x-1 transition-transform flex items-center gap-1">
                {getTranslation(lang, 'view_menu')} <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </div>
        </div>
      )})}
    </div>
  );

  const renderActivities = (type?: string) => {
    const data = sortItems(type ? getActivitiesByType(type) : allActivities);
    
    return (
      <div className="space-y-6">
        {/* Price Filter Buttons */}
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
          <button 
            onClick={() => setPriceFilter('paid')}
            className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-sm border whitespace-nowrap
              ${priceFilter === 'paid' ? 'bg-blue-600 text-white border-transparent shadow-blue-100' : 'bg-white text-slate-400 border-slate-100 hover:border-slate-200'}`}
          >
            Pago
          </button>
        </div>

        {data.length === 0 ? renderEmptyState() : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.map(a => (
              <div 
                key={a.id} 
                className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all cursor-pointer group"
                onClick={() => {
                  if (a.type === 'trail' || a.type === 'landscape' || a.type === 'culture' || a.type === 'poi' || a.type === 'activity') {
                    setSelectedTrail(a);
                  }
                }}
              >
                <div className="h-56 overflow-hidden relative">
                   <img 
                     src={a.image.startsWith('/') ? `${API_BASE_URL}${a.image}` : a.image} 
                     alt={a.title} 
                     className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                   />
                   <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                     <h3 className="text-white text-xl font-bold">{a.title}</h3>
                     <p className="text-white/80 text-sm flex items-center gap-1"><MapPin className="w-3 h-3" /> {a.island}</p>
                   </div>
                   {/* Price Tag */}
                   <div className="absolute top-4 right-4">
                     {a.isPaid ? (
                       <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                         {a.price}€
                       </span>
                     ) : (
                       <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                         Grátis
                       </span>
                     )}
                   </div>
                </div>
                <div className="p-5">
                  <p className="text-slate-600 line-clamp-2">{a.description}</p>
                  <button className="mt-4 w-full py-2 rounded border-2 border-slate-200 font-semibold text-slate-600 group-hover:border-blue-500 group-hover:text-blue-500 transition-colors">
                    {getTranslation(lang, 'more_info')}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderBusiness = (data: Business[]) => {
    const filtered = sortItems(data.filter(b => isAllIslands || b.island === targetIsland));
    
    if (filtered.length === 0) return renderEmptyState();

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(b => (
          <div 
            key={b.id} 
            className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all cursor-pointer group"
            onClick={() => {
              if (b.businessType === 'shop' || category === 'shops') {
                setSelectedShop(b);
              } else {
                setSelectedRestaurant(b);
              }
            }} 
          >
            <div className="h-48 overflow-hidden relative">
              <img 
                src={b.image.startsWith('/') ? `${API_BASE_URL}${b.image}` : b.image} 
                alt={b.name} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
              />
              <div className="absolute top-2 right-2 bg-white/90 backdrop-blur px-2 py-1 rounded text-xs font-bold flex items-center gap-1">
                 <MapPin className="w-3 h-3 text-red-500" /> {b.island}
              </div>
            </div>
            <div className="p-5">
              <h3 className="text-xl font-bold text-slate-800 mb-1">{b.name}</h3>
              <p className="text-sm text-slate-500 mb-3 line-clamp-2">{b.description}</p>
              <div className="flex items-center justify-between mt-4">
                <span className="text-blue-600 text-sm font-semibold group-hover:translate-x-1 transition-transform flex items-center gap-1">
                  {getTranslation(lang, 'more_info')} <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </div>
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
                onClick={() => setBeautyFilter(cat.id)}
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
                onClick={() => setServicesFilter(cat.id)}
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

                  <button 
                    onClick={() => window.location.href = `mailto:${s.publicEmail}?subject=Pedido de Orçamento - AzoresToyou`}
                    className="mt-2 w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-blue-600 transition-all flex items-center justify-center gap-2"
                  >
                    {getTranslation(lang, 'request_quote')}
                    <ArrowRight size={18} />
                  </button>
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
                onClick={() => setAutoRepairFilter(cat.id)}
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
                
                <button 
                  onClick={() => {
                    // Update businessType to ensure RestaurantModal handles it as auto_repair
                    const biz = { ...s, businessType: 'auto_repair' as const };
                    setSelectedRestaurant(biz);
                  }}
                  className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-red-600 transition-all flex items-center justify-center gap-2 shadow-xl shadow-slate-900/10 active:scale-95"
                >
                  <Ticket size={18} />
                  Agendar / Reservar
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderCategorySlider = (data: any[]) => {
    if (data.length === 0) return null;
    const featured = data.slice(0, 3); // Take top 3 for slider
    return (
      <div className="mb-16 -mx-6 md:-mx-10 mt-4">
        <div className="flex overflow-x-auto pb-8 px-6 md:px-10 gap-5 scrollbar-hide snap-x">
          {featured.map((item, idx) => (
            <div 
              key={`slider-${idx}`}
              className="min-w-[92vw] md:min-w-[500px] h-[320px] rounded-[3rem] overflow-hidden relative shadow-2xl snap-center group"
            >
              <img 
                src={item.image.startsWith('/') ? `${API_BASE_URL}${item.image}` : item.image} 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
                alt={item.name || item.title}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"></div>
              
              {/* Top Badges */}
              <div className="absolute top-6 left-6 flex items-center gap-2">
                 <span className="px-3 py-1 bg-blue-600 text-white text-[9px] font-black uppercase tracking-[0.15em] rounded-full shadow-lg">Destaque</span>
                 {item.isPaid !== undefined && (
                   <span className={`px-3 py-1 ${item.isPaid ? 'bg-orange-500' : 'bg-green-500'} text-white text-[9px] font-black uppercase tracking-[0.15em] rounded-full shadow-lg`}>
                     {item.isPaid ? 'Premium' : 'Grátis'}
                   </span>
                 )}
              </div>

              <div className="absolute bottom-8 left-8 right-8">
                <h4 className="text-3xl font-black text-white uppercase tracking-tighter leading-none mb-3 drop-shadow-md">{item.name || item.title}</h4>
                <div className="flex items-center gap-2.5 text-white/80 text-xs font-black uppercase tracking-widest">
                  <div className="w-6 h-6 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
                    <MapPin size={12} className="text-blue-400" />
                  </div>
                  {item.island}
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
      case 'poi': return renderActivities('poi');
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
                       window.open(url, '_blank');
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
                       window.open(url, '_blank');
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
                <button 
                  onClick={() => setSelectedRestaurant({ ...s, businessType: 'auto_repair' as any })}
                  className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-yellow-500 transition-all flex items-center justify-center gap-2 active:scale-95 shadow-xl shadow-slate-900/10"
                >
                  <Ticket size={18} />
                  Agendar / Reservar
                </button>
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
                onClick={() => setUsedMarketFilter(cat.id)}
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
                       window.open(url, '_blank');
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

      {/* Category Featured Slider */}
      {category !== 'buses' && category !== 'beauty' && category !== 'services' && (
        renderCategorySlider(
          category === 'restaurants' ? filteredRestaurants :
          category === 'shops' ? allShops :
          category === 'trails' ? getActivitiesByType('trail') :
          category === 'landscapes' ? getActivitiesByType('landscape') :
          category === 'poi' ? getActivitiesByType('poi') : allActivities
        )
      )}

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
        />
      )}

      {selectedTrail && (
        <TrailModal
          isOpen={!!selectedTrail}
          onClose={() => setSelectedTrail(null)}
          trail={selectedTrail}
          language={lang}
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
        />
      )}

      {selectedStand && (
        <CarStandModal
          isOpen={!!selectedStand}
          onClose={() => setSelectedStand(null)}
          stand={selectedStand}
          language={lang}
        />
      )}

      {selectedShop && (
        <ShopCatalogModal
          isOpen={!!selectedShop}
          onClose={() => setSelectedShop(null)}
          shop={selectedShop}
          language={lang}
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
                    <div className="space-y-4">
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 text-center">Horários Disponíveis (Próximas 2 horas)</p>
                       {[
                         { time: '14:20', company: 'Varela', platform: 'A2' },
                         { time: '14:45', company: 'CRP', platform: 'B1' },
                         { time: '15:10', company: 'Varela', platform: 'A2' }
                       ].map((s, idx) => (
                         <div key={idx} className="flex items-center justify-between p-5 bg-slate-50 rounded-2xl border border-slate-100">
                            <div className="flex items-center gap-4">
                               <div className="p-3 bg-white rounded-xl shadow-sm"><Clock className="text-blue-600 w-5 h-5" /></div>
                               <div>
                                  <span className="text-xl font-black text-slate-800 leading-none">{s.time}</span>
                                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{s.company} • Cais {s.platform}</p>
                               </div>
                            </div>
                            <button 
                              onClick={() => setBusModalStep('payment')}
                              className="px-6 py-3 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all active:scale-95"
                            >
                               Selecionar
                            </button>
                         </div>
                       ))}
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
