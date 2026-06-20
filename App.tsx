// Azores4you - Main Application Entry - Build v1.2.7 - Stabilized Production
import React, { useState, useEffect } from 'react';
import { BookingStep, ExploreCategory, Flight, Itinerary, Language, Restaurant, Activity, Hotel, Car, BusSchedule, KitchenOrder, OrderItem, Business } from './types';
import { getAirports, COLORS, BUS_SCHEDULES } from './constants';
import FlightBoard from './components/FlightBoard';
import BookingWizard from './components/BookingWizard';
import SummaryView from './components/SummaryView';
import ExploreSection from './components/ExploreSection';
import CarRentalSection from './components/CarRentalSection';
import LandingPage from './components/LandingPage';
import BottomNav from './components/BottomNav';
import AuthModal from './components/AuthModal';
import PackagePreviewModal from './components/PackagePreviewModal';
import IslandSelectionModal from './components/IslandSelectionModal';
import ProfileModal from './components/ProfileModal';
import MyReservationsModal from './components/MyReservationsModal';
import { InvoicesModal } from './components/InvoicesModal';
import MostRequestedSlider from './components/MostRequestedSlider';
import QRScannerModal from './components/QRScannerModal';
import TableMenuModal from './components/TableMenuModal';
import NotificationsModal, { AppNotification } from './components/NotificationsModal';
import CategoryBar, { getNavigationCategories } from './components/CategoryBar';
import IslandSearch from './components/IslandSearch';
import AdminDashboard from './components/AdminDashboard';
import BusinessDashboard from './components/BusinessDashboard';
import RentCarDashboard from './components/RentCarDashboard';
import SupplierDashboard from './components/SupplierDashboard';
import HotelDashboard from './components/HotelDashboard';
import BarberNormalDashboard from './components/BarberNormalDashboard';
import BarberProDashboard from './components/BarberProDashboard';
import BarberLogin from './components/BarberLogin';
import AzoresLogo from './components/AzoresLogo';
import HotelRoomService from './components/HotelRoomService';
import FavoritesModal from './components/FavoritesModal';
import CommunitySection from './components/CommunitySection';
import { Menu, X, User, LogOut, Compass, MapPin, Bell, AlertCircle, Phone, ShieldAlert, LayoutDashboard, RefreshCw, ArrowRight, LogIn, UtensilsCrossed, Scissors } from 'lucide-react';
import SOSModal from './components/SOSModal';
import HomeSection from './components/HomeSection';
import { getTranslation } from './translations';
import { motion, AnimatePresence } from 'motion/react';
import { API_BASE_URL, BUSINESS_TYPE_TO_ENDPOINT, OFFICIAL_DOMAIN, RENDER_BACKEND, FRONTEND_URL, isLocal, getGoogleMapsEmbedUrl } from './config';
import { EcraMapa } from './components/EcraMapa';
import { trilhosAcoresDados } from './data/dadosTrilhos';
import DesktopView, { DesktopHeader, DesktopFooter } from './components/DesktopView';
import MarketplaceSection from './components/MarketplaceSection';
import ChatModal from './components/ChatModal';

// Simple Error Boundary
class ErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean, error: any}> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }
  componentDidCatch(error: any, errorInfo: any) {
    console.error("ErrorBoundary caught:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-red-50 p-8 text-center">
          <div className="max-w-md bg-white p-12 rounded-[3rem] shadow-2xl border border-red-100">
            <h2 className="text-2xl font-black text-red-600 uppercase tracking-tighter mb-4">Erro Crítico</h2>
            <p className="text-slate-500 font-medium mb-8 leading-relaxed">
              Ocorreu um erro ao carregar esta parte da aplicação: <br/>
              <code className="text-xs bg-slate-100 p-2 rounded block mt-2">{this.state.error?.message || "Erro desconhecido"}</code>
            </p>
            <button onClick={() => window.location.reload()} className="w-full py-4 bg-red-600 text-white rounded-2xl font-black uppercase tracking-widest transition-all">Recarregar Página</button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// --- INDEXED DB HELPER ---
const initDB = () => new Promise<IDBDatabase>((resolve, reject) => {
  const request = indexedDB.open('azores_db', 1);
  request.onupgradeneeded = (e: any) => {
    e.target.result.createObjectStore('cache_store');
  };
  request.onsuccess = () => resolve(request.result);
  request.onerror = () => reject(request.error);
});

const setCache = async (key: string, val: any) => {
  try {
    const db = await initDB();
    const tx = db.transaction('cache_store', 'readwrite');
    tx.objectStore('cache_store').put(val, key);
  } catch(e) {}
};

const getCache = async (key: string): Promise<any> => {
  try {
    const db = await initDB();
    const tx = db.transaction('cache_store', 'readonly');
    const request = tx.objectStore('cache_store').get(key);
    return new Promise((res) => {
      request.onsuccess = () => res(request.result);
      request.onerror = () => res(null);
    });
  } catch(e) { return null; }
};
// -------------------------

// Business type mapping moved to config.ts

// ── GUEST EXIT PROMO POPUP ──
const GuestExitPromoPopup: React.FC<{ onYes: () => void; onNo: () => void }> = ({ onYes, onNo }) => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[500] bg-slate-950/80 backdrop-blur-md flex items-end sm:items-center justify-center p-4">
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 30, scale: 0.95 }}
      transition={{ type: 'spring', damping: 24, stiffness: 300 }}
      className="w-full max-w-sm bg-white rounded-[2.5rem] shadow-[0_40px_80px_-12px_rgba(0,0,0,0.4)] overflow-hidden relative"
    >
      <div className="h-2 bg-gradient-to-r from-emerald-400 via-teal-400 to-blue-500" />
      <div className="absolute top-0 right-0 w-56 h-56 bg-emerald-100/50 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-56 h-56 bg-blue-100/40 rounded-full blur-3xl -ml-20 -mb-20 pointer-events-none" />
      <div className="relative z-10 p-8">
        <div className="flex items-center justify-center mb-6">
          <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-emerald-500/30 ring-4 ring-emerald-50">
            <span className="text-4xl">🌊</span>
          </div>
        </div>
        <h2 className="text-2xl font-black text-slate-800 text-center tracking-tight mb-2">
          Conhece o <span className="text-emerald-600">Azores4You</span>?
        </h2>
        <div className="bg-gradient-to-br from-slate-50 to-emerald-50/30 rounded-2xl p-5 mb-6 border border-slate-100">
          <p className="text-slate-600 text-sm font-medium leading-relaxed text-center">
            Reserva restaurantes, atividades, hotéis e muito mais nos <strong className="text-slate-800">Açores</strong> — tudo numa só app.
          </p>
          <div className="flex flex-wrap justify-center gap-2 mt-4">
            {['🍽️ Restaurantes', '🏄 Atividades', '🏨 Hotéis', '✈️ Voos', '🚗 Carros', '⭐ Créditos'].map(item => (
              <span key={item} className="bg-white border border-slate-200 text-slate-600 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full shadow-sm">{item}</span>
            ))}
          </div>
          <p className="text-emerald-600 text-[11px] font-black uppercase tracking-widest text-center mt-4">
            🎁 Regista-te e ganha créditos na primeira reserva!
          </p>
        </div>
        <button onClick={onYes} className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-xl shadow-emerald-500/25 active:scale-95 mb-3 flex items-center justify-center gap-2">
          🌊 Sim, quero conhecer!
        </button>
        <button onClick={onNo} className="w-full py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all active:scale-95">
          Não, obrigado — Sair
        </button>
      </div>
    </motion.div>
  </motion.div>
);


const App: React.FC = () => {
  // App Settings
  const [language, setLanguage] = useState<Language>('pt');

  // App settings and URLs now centralized in config.ts

  // Helper to load from cache
  const loadFromCache = (key: string, fallback: any) => {
    try {
      const cached = localStorage.getItem(`azores_cache_${key}`);
      return cached ? JSON.parse(cached) : fallback;
    } catch (e) { return fallback; }
  };

  const [restaurants, setRestaurants] = useState<Restaurant[]>(() => loadFromCache('restaurants', []));
  const [activities, setActivities] = useState<Activity[]>(() => loadFromCache('activities', []));
  const [flights, setFlights] = useState<Flight[]>(() => loadFromCache('flights', []));
  const [hotels, setHotels] = useState<Hotel[]>(() => loadFromCache('hotels', []));
  const [cars, setCars] = useState<Car[]>(() => loadFromCache('cars', []));
  const [busSchedules, setBusSchedules] = useState<BusSchedule[]>(() => loadFromCache('bus-schedules', []));
  const [shops, setShops] = useState<Business[]>(() => loadFromCache('shops', []));
  const [beauty, setBeauty] = useState<Business[]>(() => loadFromCache('beauty', []));
  const [services, setServices] = useState<Business[]>(() => loadFromCache('services', []));
  const [autoRepairs, setAutoRepairs] = useState<Business[]>(() => loadFromCache('auto_repairs', []));
  const [autoElectronics, setAutoElectronics] = useState<Business[]>(() => loadFromCache('auto_electronics', []));
  const [usedMarket, setUsedMarket] = useState<Business[]>(() => loadFromCache('used_market', []));
  const [animals, setAnimals] = useState<Business[]>(() => loadFromCache('animals', []));
  const [realEstate, setRealEstate] = useState<Business[]>(() => loadFromCache('real_estate', []));
  const [gyms, setGyms] = useState<Business[]>(() => loadFromCache('gyms', []));
  const [stands, setStands] = useState<Business[]>(() => loadFromCache('stands', []));
  const [offices, setOffices] = useState<Business[]>(() => loadFromCache('offices', []));
  const [itServices, setItServices] = useState<Business[]>(() => loadFromCache('it_services', []));
  const [perfumes, setPerfumes] = useState<Business[]>(() => loadFromCache('perfumes', []));
  const [bars, setBars] = useState<Business[]>(() => loadFromCache('bars', []));
  const [events, setEvents] = useState<Business[]>(() => loadFromCache('events', []));
  const [municipal, setMunicipal] = useState<Business[]>(() => loadFromCache('municipal', []));
  const [posts, setPosts] = useState<any[]>(() => loadFromCache('posts', []));
  const [marketplaceAds, setMarketplaceAds] = useState<any[]>(() => loadFromCache('marketplace_ads', []));
  const [marketplaceChats, setMarketplaceChats] = useState<any[]>(() => loadFromCache('marketplace_chats', []));
  const [marketplaceCategories, setMarketplaceCategories] = useState<any[]>(() => loadFromCache('marketplace_categories', []));
  const [users, setUsers] = useState<any[]>([]);
  const [scrolled, setScrolled] = useState(false);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [dbStatus, setDbStatus] = useState<any>({ 
    storage: 'A ligar...', 
    isMongo: false, 
    isConfigured: false, 
    timestamp: null 
  });

  // --- DEPLOY VERIFICATION LOG ---
  useEffect(() => {
    console.log("%c🚀 Azores4you SYSTEM v1.2.2-STABLE", "background: #0f172a; color: #10b981; font-weight: bold; font-size: 18px; padding: 12px; border: 2px solid #10b981; border-radius: 12px;");
    
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // --- DETEÇÃO DE QR CODE GUEST MODE ---
  // Se o URL tem ?qr=RESTAURANT_ID&table=TABLE_ID, entrar diretamente no POS como convidado
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const qrRestId = params.get('qr');
    const qrTableId = params.get('table');
    if (qrRestId && qrTableId) {
      setIsGuestMode(true);
      setGuestRestaurantId(qrRestId);
      setGuestTableId(qrTableId);
      setGuestCheckIn(false);
      setGuestOrderSent(false);
      setGuestFormData({ name: '', people: 2, phone: '', email: '' });
      setHasEnteredApp(true);
      // Limpar URL params sem recarregar
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  // --- DETEÇÃO DE POS MODO DIRETO ---
  // Se o URL tem ?pos=RESTAURANT_ID, entrar diretamente no Dashboard do POS do restaurante
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const posRestId = params.get('pos');
    if (posRestId) {
      console.log("⚡ Deteção de POS Direto para o restaurante:", posRestId);
      setIsBusiness(true);
      setIsStaff(false);
      setCurrentBusinessId(posRestId);
      setHasEnteredApp(true);
      // Limpar URL params sem recarregar
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  // --- DETEÇÃO DE RESERVA/MARCAÇÃO DIRETA (LINK DE TESTE) ---
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const bookId = params.get('book');
    if (bookId) {
      console.log("⚡ Deteção de Marcação Direta para o ID:", bookId);
      setHasEnteredApp(true);
      if (bookId.startsWith('BEA')) {
        setExploreCategory('beauty');
      } else {
        setExploreCategory('restaurants');
      }
      setSelectedTrailId(bookId);
    }
  }, [beauty, restaurants]);

  // Load from IndexedDB on initial mount for massive storage capacity
  useEffect(() => {
    const loadCaches = async () => {
      const endpoints = [
        { key: 'restaurants', setter: setRestaurants },
        { key: 'hotels', setter: setHotels },
        { key: 'cars', setter: setCars as Function },
        { key: 'shops', setter: setShops },
        { key: 'beauty', setter: setBeauty },
        { key: 'services', setter: setServices },
        { key: 'offices', setter: setOffices },
        { key: 'animals', setter: setAnimals },
        { key: 'real_estate', setter: setRealEstate },
        { key: 'gyms', setter: setGyms },
        { key: 'stands', setter: setStands },
        { key: 'auto_repairs', setter: setAutoRepairs },
        { key: 'auto_electronics', setter: setAutoElectronics },
        { key: 'used_market', setter: setUsedMarket },
        { key: 'it_services', setter: setItServices },
        { key: 'perfumes', setter: setPerfumes },
        { key: 'bars', setter: setBars },
        { key: 'events', setter: setEvents },
        { key: 'municipal', setter: setMunicipal },
        { key: 'activities', setter: setActivities as Function },
        { key: 'marketplace_ads', setter: setMarketplaceAds },
        { key: 'marketplace_categories', setter: setMarketplaceCategories },
        { key: 'bus-schedules', setter: setBusSchedules as Function },
        { key: 'flights', setter: setFlights as Function }
      ];
      for (const ep of endpoints) {
        const cached = await getCache(`azores_cache_${ep.key}`);
        if (cached && Array.isArray(cached) && cached.length > 0) {
          ep.setter(cached);
        }
      }
    };
    loadCaches();
  }, []);

  // Auth & User State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  // Sync users list for Admin Dashboard
  useEffect(() => {
    if (isAdmin) {
      const fetchUsers = () => {
        fetch(`${API_BASE_URL}/api/users?t=${Date.now()}`)
          .then(r => r.json())
          .then(allUsers => setUsers(allUsers || []))
          .catch(err => console.error("Error fetching users:", err));
      };
      fetchUsers();
      const interval = setInterval(fetchUsers, 20000);
      return () => clearInterval(interval);
    }
  }, [isAdmin]);
  const [isBusiness, setIsBusiness] = useState(false);
  const [isStaff, setIsStaff] = useState(false);
  const [isSupplier, setIsSupplier] = useState(false);
  const [staffRole, setStaffRole] = useState<string | null>(null);
  const [currentBusinessId, setCurrentBusinessId] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<{name: string; email: string; phone: string; avatar: string; nif?: string}>({
    email: '',
    name: 'Cliente Viajante',
    phone: '',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
    nif: ''
  });
  

  const handleLogout = () => {
    setIsAuthenticated(false);
    setIsAdmin(false);
    setIsBusiness(false);
    setIsStaff(false);
    setIsSupplier(false);
    setStaffRole(null);
    setCurrentBusinessId(null);
    setUserProfile({
      email: '',
      name: 'Cliente Viajante',
      phone: '',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
      nif: ''
    });
    setExploreCategory(null);
    setMobileMenuOpen(false);
  };

  const [userCredits, setUserCredits] = useState(100);
  const [myReservations, setMyReservations] = useState<any[]>([]);


  // Initialize other static data on language change
  useEffect(() => {
    // Apenas configurar fallbacks para dados que normalmente vêm do server
    // NÃO adicionar dados estáticos - o servidor é a única fonte de verdade
    // Se o servidor estiver vazio, o frontend mostra vazio (correto)
  }, [language]);



  // Modal State
  const [showPackageModal, setShowPackageModal] = useState(false);
  const [showBarberLogin, setShowBarberLogin] = useState(false);
  const [showBusIslandModal, setShowBusIslandModal] = useState(false);
  const [showFavoritesModal, setShowFavoritesModal] = useState(false);
  const [showMarketplaceFavorites, setShowMarketplaceFavorites] = useState(false);
  const [showMyReservationsModal, setShowMyReservationsModal] = useState(false);
  const [reservationsInitialCategory, setReservationsInitialCategory] = useState<string | null>(null);
  const [showChatModal, setShowChatModal] = useState(false);
  const [directAdStart, setDirectAdStart] = useState<any | null>(null);
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [showMapUrl, setShowMapUrl] = useState<string | null>(null);
  const [selectedTrailId, setSelectedTrailId] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  // Function to fetch data from Backend with Retry logic for Cold Starts
  const fetchData = async (retries = 3, specificKeys?: string[]) => {
    setIsSyncing(true);
    try {
      const normalizeBusiness = (b: any) => ({
        ...b,
        image: b.image?.startsWith('/imagens') ? `${API_BASE_URL}${b.image}` : b.image,
        gallery: b.gallery?.map((img: any) => typeof img === 'string' && img.startsWith('/imagens') ? `${API_BASE_URL}${img}` : img),
        menu: b.menu?.map((item: any) => ({
          ...item,
          image: item.image?.startsWith('/imagens') ? `${API_BASE_URL}${item.image}` : item.image
        })),
        tables: b.tables?.map((t: any) => ({
          ...t,
          images: t.images?.map((img: any) => typeof img === 'string' && img.startsWith('/imagens') ? `${API_BASE_URL}${img}` : img)
        }))
      });

      const endpointKeys = [
        'restaurants', 'hotels', 'cars', 'shops', 'beauty', 'services', 
        'offices', 'animals', 'real_estate', 'gyms', 'stands', 
        'auto_repairs', 'auto_electronics', 'used_market', 'it_services', 'perfumes', 'bars', 'events', 'municipal',
        'activities', 'bus-schedules', 'flights', 'posts', 'marketplace_ads', 'marketplace_chats', 'marketplace_categories'
      ];

      const keysToFetch = specificKeys || endpointKeys;

      const setterMap: Record<string, Function> = {
        'restaurants': setRestaurants, 'hotels': setHotels, 'cars': setCars, 'shops': setShops,
        'beauty': setBeauty, 'services': setServices, 'offices': setOffices, 'animals': setAnimals,
        'real_estate': setRealEstate, 'gyms': setGyms, 'stands': setStands, 'auto_repairs': setAutoRepairs,
        'auto_electronics': setAutoElectronics, 'used_market': setUsedMarket, 'it_services': setItServices,
        'perfumes': setPerfumes, 'bars': setBars, 'events': setEvents, 'municipal': setMunicipal, 'activities': setActivities, 'bus-schedules': setBusSchedules, 'flights': setFlights,
        'posts': setPosts, 'marketplace_ads': setMarketplaceAds, 'marketplace_chats': setMarketplaceChats, 'marketplace_categories': setMarketplaceCategories
      };

      // 0. Load from Cache immediately for Offline Support (Apenas no carregamento inicial)
      if (!isDataLoaded) {
        keysToFetch.forEach(async key => {
          try {
            const cached = await getCache(`azores_cache_${key}`);
            if (cached && setterMap[key]) {
              setterMap[key](cached);
            }
          } catch (e) {}
        });
      }

      let emptyCount = 0;
      let errorCount = 0;
      let completedCount = 0;

      keysToFetch.forEach(key => {
        const bypass = (specificKeys && specificKeys.length > 0) ? '&bypassCache=true' : '';
        fetch(`${API_BASE_URL}/api/${key}?t=${Date.now()}${bypass}`)
          .then(r => {
            if (!r.ok) {
              throw new Error(`HTTP ${r.status} ${r.statusText}`);
            }
            return r.json();
          })
          .then(data => {
             completedCount++;
             if (Array.isArray(data) && data.length === 0) emptyCount++;
             const setter = setterMap[key];
              if (setter && Array.isArray(data)) {
                let normalized = data.map(normalizeBusiness);
                if (key === 'marketplace_ads') {
                  setMarketplaceAds(prev => {
                    const localPending = prev.filter(localAd => 
                      localAd.status === 'localPending' && 
                      !normalized.some(serverAd => serverAd.id === localAd.id)
                    );
                    const merged = [...localPending, ...normalized];
                    setCache(`azores_cache_${key}`, merged);
                    try { localStorage.setItem(`azores_cache_${key}`, JSON.stringify(merged)); } catch(e) {}
                    return merged;
                  });
                } else if (key === 'marketplace_categories') {
                  const merged = normalized.length > 0 ? normalized : [
                    { id: 'vehicles', label: 'Carros e Motos', icon: 'Car' },
                    { id: 'real_estate', label: 'Imobiliária', icon: 'Home' },
                    { id: 'electronics', label: 'Tecnologia', icon: 'Laptop' },
                    { id: 'home', label: 'Casa e Móveis', icon: 'ShoppingBag' },
                    { id: 'fashion', label: 'Moda e Acessórios', icon: 'Tag' },
                    { id: 'services', label: 'Serviços', icon: 'Briefcase' },
                    { id: 'fashion_beauty', label: 'Beleza e Barbearia', icon: 'Smartphone' },
                    { id: 'jobs', label: 'Empregos', icon: 'Briefcase' }
                  ];
                  setMarketplaceCategories(merged);
                  setCache(`azores_cache_${key}`, merged);
                  try { localStorage.setItem(`azores_cache_${key}`, JSON.stringify(merged)); } catch(e) {}
                } else {
                  setter(normalized);
                  setCache(`azores_cache_${key}`, normalized);
                  try { localStorage.setItem(`azores_cache_${key}`, JSON.stringify(normalized)); } catch(e) {}
                }
              }
             if (completedCount === keysToFetch.length) {
                const totalFailures = emptyCount + errorCount;
                if (totalFailures === keysToFetch.length && retries > 0) {
                   setTimeout(() => fetchData(retries - 1, specificKeys), 3000);
                }
             }
          })
          .catch(err => {
             console.warn(`⚠️ Fetch failed for [${key}] (preserving local state):`, err.message || err);
             completedCount++;
             errorCount++;
             if (completedCount === keysToFetch.length) {
                const totalFailures = emptyCount + errorCount;
                if (totalFailures === keysToFetch.length && retries > 0) {
                   setTimeout(() => fetchData(retries - 1, specificKeys), 3000);
                }
             }
          });
      });

      // 2. Utilizador (Sincronização de Reservas)
      if (isAuthenticated && !isAdmin && !isBusiness && userProfile.email) {
        const userResp = await fetch(`${API_BASE_URL}/api/users/${userProfile.email}?t=${Date.now()}`);
        if (userResp.ok) {
          const userData = await userResp.json();
          setUserCredits(userData.credits || 0);
          setMyReservations(userData.reservations || []);
        }
      }

      // 3. Status da DB
      try {
        console.log("🌐 A solicitar diagnóstico da base de dados...");
        const sResp = await fetch(`${API_BASE_URL}/api/db-diagnostics?t=${Date.now()}`);
        if (sResp.ok) {
          const statusData = await sResp.json();
          console.log("✅ Diagnóstico recebido:", statusData);
          setDbStatus(statusData);
        }
      } catch (e) {
        console.error("❌ Erro de rede ao contactar servidor:", e);
      }

      setIsDataLoaded(true);
      setIsSyncing(false);
    } catch (error) {
      console.error('Erro ao carregar dados do backend:', error);
      if (retries > 0) {
        setTimeout(() => fetchData(retries - 1), 3000);
      } else {
        setIsDataLoaded(true); // Fallback to show empty app if server is dead
        setIsSyncing(false);
      }
    }
  };

  // Initial Load and Sync Polling
  useEffect(() => {
    // Determine if user is in any management mode
    const isManager = isAdmin || isBusiness || isStaff || isSupplier;
    
    // Initial fetch - Only if not already loaded or if entering management mode
    if (!isDataLoaded) {
      fetchData();
    }
    
    // Poll for all users (clients and managers) for full real-time synchronization
    let syncInterval: any;
    if (isDataLoaded) {
      syncInterval = setInterval(() => {
        // Sincronização ultra-rápida (2s) limitada às categorias de reservas para máxima performance
        fetchData(0, ['restaurants', 'hotels', 'cars', 'beauty', 'shops', 'services']);
        console.log("🔄 Real-time sync (2s interval)...");
      }, 2000); // Reduzido para 2 segundos!
    }
    
    return () => {
      if (syncInterval) clearInterval(syncInterval);
    };
  }, [API_BASE_URL, isAuthenticated, isAdmin, isBusiness, isStaff, isSupplier, isDataLoaded]);

  // Poll only marketplace ads for admin so they see pending ads in real-time
  useEffect(() => {
    if (!isAdmin) return;
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/marketplace_ads?t=${Date.now()}`);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            setMarketplaceAds(prev => {
              const localPending = prev.filter(localAd => 
                localAd.status === 'localPending' && 
                !data.some(serverAd => serverAd.id === localAd.id)
              );
              return [...localPending, ...data];
            });
          }
        }
      } catch (err) {
        console.log("Error polling marketplace ads:", err.message);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [isAdmin, API_BASE_URL]);

  // Poll chats in real-time when logged in
  useEffect(() => {
    if (!isAuthenticated) return;
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/marketplace_chats?t=${Date.now()}`);
        const contentType = res.headers.get("content-type");
        if (res.ok && contentType && contentType.includes("application/json")) {
          const data = await res.json();
          if (Array.isArray(data)) {
            setMarketplaceChats(data);
          }
        }
      } catch (err) {
        console.log("Error polling chats:", err.message);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [isAuthenticated, API_BASE_URL]);

  // 3. NAVIGATION & UI STATE
  const [hasEnteredApp, setHasEnteredApp] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [exploreCategory, setExploreCategory] = useState<ExploreCategory>(null);

  useEffect(() => {
    if (exploreCategory !== 'marketplace') {
      setShowMarketplaceFavorites(false);
    }
  }, [exploreCategory]);

  const [currentStep, setCurrentStep] = useState<BookingStep>('flights');
  const [globalSearchQuery, setGlobalSearchQuery] = useState('');
  const [publicIslandFilter, setPublicIslandFilter] = useState<string>('all');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showInvoicesModal, setShowInvoicesModal] = useState(false);
  const [pendingFlight, setPendingFlight] = useState<Flight | null>(null);
  const [scannerConfig, setScannerConfig] = useState<{ type: 'checkin' | 'checkout', resId: string, restaurantId: string, tableId: string } | null>(null);
  const [tableMenuRes, setTableMenuRes] = useState<any | null>(null);
  const [welcomePopupDetails, setWelcomePopupDetails] = useState<{ restaurantName: string, tableName: string } | null>(null);
  // --- GUEST QR MODE ---
  const [isGuestMode, setIsGuestMode] = useState(false);
  const [guestRestaurantId, setGuestRestaurantId] = useState<string | null>(null);
  const [guestTableId, setGuestTableId] = useState<string | null>(null);
  
  // --- HOTEL ROOM SERVICE QR CODES CONCIERGE ---
  const [roomServiceAccess, setRoomServiceAccess] = useState<{ hotelId: string; roomId: string; qrToken: string } | null>(null);

  useEffect(() => {
    const checkRoute = () => {
      const path = window.location.pathname;
      const hash = window.location.hash;
      
      let routePath = '';
      if (path.startsWith('/hotel-room-service/')) {
        routePath = path;
      } else if (hash.startsWith('#/hotel-room-service/')) {
        routePath = hash.replace('#', '');
      }
      
      if (routePath.startsWith('/hotel-room-service/')) {
        const parts = routePath.split('/');
        if (parts.length >= 5) {
          const hotelId = parts[2];
          const roomId = parts[3];
          const qrToken = parts[4];
          if (hotelId && roomId && qrToken) {
            setRoomServiceAccess({ hotelId, roomId, qrToken });
          }
        }
      }
    };

    checkRoute();
    window.addEventListener('hashchange', checkRoute);
    return () => window.removeEventListener('hashchange', checkRoute);
  }, []);
  const [guestCheckIn, setGuestCheckIn] = useState(false);
  const [guestOrderSent, setGuestOrderSent] = useState(false);
  const [guestFormData, setGuestFormData] = useState({ name: '', people: 2, phone: '', email: '' });
  const [showGuestExitPromo, setShowGuestExitPromo] = useState(false);
  const [showSOSModal, setShowSOSModal] = useState(false);
  const [returnToProfile, setReturnToProfile] = useState(false);
  const [showIslandSelection, setShowIslandSelection] = useState(false);
  const [showInteractiveMap, setShowInteractiveMap] = useState(false);
  const [selectedTrailData, setSelectedTrailData] = useState<any>(null);

  // Helper to filter data by island
  const filterByIsland = <T extends { island?: string }>(items: T[]) => {
    if (!publicIslandFilter || publicIslandFilter === 'all') return items;
    return items.filter(item => 
      item.island?.toLowerCase() === publicIslandFilter.toLowerCase() || 
      item.island === publicIslandFilter ||
      (item as any).location?.toLowerCase().includes(publicIslandFilter.toLowerCase())
    );
  };

  // 4. ITINERARY STATE
  const DEFAULT_ITINERARY: Itinerary = {
    flight: null,
    hotel: null,
    nights: 3,
    car: null,
    carDays: 3,
    selectedExtras: []
  };

  const [itinerary, setItinerary] = useState<Itinerary>(DEFAULT_ITINERARY);

  // Safety net to ensure itinerary is never null
  useEffect(() => {
    if (!itinerary) {
      setItinerary(DEFAULT_ITINERARY);
    }
  }, [itinerary]);
  const [favoriteRestaurantIds, setFavoriteRestaurantIds] = useState<string[]>([]);
  const [favoriteAdIds, setFavoriteAdIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('favorite_ad_ids');
    return saved ? JSON.parse(saved) : [];
  });
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [showNotificationsModal, setShowNotificationsModal] = useState(false);

  // Estado para controlo de notificações locais (evitar repetições)
  const [notifiedResIds, setNotifiedResIds] = useState<Set<string>>(() => {
    const saved = localStorage.getItem('notifiedResIds');
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });

  useEffect(() => {
    localStorage.setItem('notifiedResIds', JSON.stringify(Array.from(notifiedResIds)));
  }, [notifiedResIds]);

  useEffect(() => {
    if (!isAuthenticated || isAdmin || isBusiness) return;
    
    myReservations.forEach(res => {
      const restName = res.businessName || res.restaurantName || res.companyName || res.hotelName || res.hotel?.name || res.car?.companyName || res.flight?.airline || 'Negócio';
      const isBeautyRes = res.type === 'beauty' || res.businessType === 'beauty' || (res.id && res.id.startsWith('BEA')) || (res.bookingFee && res.bookingFee > 0);
      const isCarRes = res.type === 'car' || res.type === 'cars' || (res.id && res.id.startsWith('RES_C'));
      const isHotelRes = res.type === 'hotel' || res.type === 'al' || (res.id && res.id.startsWith('RES_H'));
      const isFlightRes = res.type === 'flight' || (res.id && res.id.startsWith('RES_F'));

      // 1. Notificação de Reserva Confirmada
      if (res.status === 'accepted' && !notifiedResIds.has(res.id)) {
        let title = "Reserva Confirmada!";
        let message = `O restaurante ${restName} aceitou a sua reserva para ${res.date} às ${res.time}.`;

        if (isBeautyRes) {
          title = "Marcação Confirmada!";
          message = `O salão ${restName} aceitou a sua marcação para ${res.date} às ${res.time}.`;
        } else if (isCarRes) {
          title = "Aluguer de Carro Confirmado!";
          message = `A rent-a-car ${restName} confirmou a sua reserva do carro ${res.car?.model || ''} para o dia ${res.date}.`;
        } else if (isHotelRes) {
          title = "Alojamento Confirmado!";
          message = `O alojamento ${restName} confirmou a sua estadia a partir de ${res.date}.`;
        } else if (isFlightRes) {
          title = "Voo Confirmado!";
          message = `A companhia aérea ${restName} confirmou o seu voo ${res.flight?.flightNumber || ''} para o dia ${res.date}.`;
        }
        
        const newNotification: AppNotification = {
          id: `NOTIF_ACC_${Date.now()}_${res.id}`,
          title,
          message,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          type: 'reservation_accepted',
          read: false,
          relatedId: res.id
        };
        
        setNotifications(prev => [newNotification, ...prev]);
        setNotifiedResIds(prev => new Set(prev).add(res.id));
      }

      // 2. Notificação de Mesa/Cadeira Atribuída
      const tableNotifKey = `table_${res.id}`;
      if (res.status === 'accepted' && res.tableId && !notifiedResIds.has(tableNotifKey)) {
        const title = isBeautyRes ? "Cadeira Atribuída!" : "Mesa Atribuída!";
        const message = isBeautyRes 
          ? `Já temos uma cadeira pronta para si no salão ${restName}: Cadeira #${res.tableId.replace('T', '')}.`
          : `Já temos uma mesa pronta para si no ${restName}: Mesa #${res.tableId.replace('T', '')}.`;
        
        const newNotification: AppNotification = {
          id: `NOTIF_TAB_${Date.now()}_${res.id}`,
          title,
          message,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          type: 'table_assigned',
          read: false,
          relatedId: res.id
        };
        
        setNotifications(prev => [newNotification, ...prev]);
        setNotifiedResIds(prev => new Set(prev).add(tableNotifKey));
      }
    });
  }, [myReservations, isAuthenticated, notifiedResIds, isAdmin, isBusiness]);

  // Sincronização Automática do Perfil do Utilizador (Tempo Real)
  useEffect(() => {
    if (isAuthenticated && !isAdmin && !isBusiness && userProfile.email && isDataLoaded) {
      const syncUser = async () => {
        try {
          await fetch(`${API_BASE_URL}/api/users/${userProfile.email}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              credits: userCredits,
              profile: {
                phone: userProfile.phone,
                avatar: userProfile.avatar
              }
              // REMOVIDO: reservations para evitar que o cliente sobrescreva o estado atualizado pelo gerente (A Tasca)
              // REMOVIDO: notifications: notifications (Não sobrescrever notificações do servidor)
            }),
          });
          console.log("👤 Perfil do utilizador sincronizado (sem sobrescrever notificações/reservas)");
        } catch (err) {
          console.error("Erro na sincronização do utilizador:", err);
        }
      };

      // Só sincroniza quando os dados de perfil (telefone/avatar/créditos) mudam.
      // REMOVIDO myReservations das dependências para evitar PUT request a cada 2 segundos!
      const timer = setTimeout(syncUser, 2000);
      return () => clearTimeout(timer);
    }
  }, [userCredits, userProfile.phone, userProfile.avatar, isAuthenticated, isAdmin, isBusiness]);

  const toggleFavoriteRestaurant = (id: string) => {
    setFavoriteRestaurantIds(prev => 
      prev.includes(id) ? prev.filter(fId => fId !== id) : [...prev, id]
    );
  };

  // Entry Handlers
  const enterBooking = (isAdminUser: boolean = false, businessId?: string) => {
    setHasEnteredApp(true);
    setIsAuthenticated(true);
    setMobileMenuOpen(false);
    
    if (isAdminUser) {
      setIsAdmin(true);
      return;
    }

    if (businessId) {
      setIsBusiness(true);
      setCurrentBusinessId(businessId);
      return;
    }

    setExploreCategory(null); 
    setCurrentStep('flights');
  };

  const enterExplore = () => {
    setExploreCategory(null);
    setHasEnteredApp(true);
    setIsAuthenticated(false);
    setMobileMenuOpen(false);
  };

  const goBackToLanding = () => {
    setHasEnteredApp(false);
    setExploreCategory(null);
    setItinerary({ flight: null, hotel: null, nights: 3, car: null, carDays: 3 });
    setIsAuthenticated(false);
    setMobileMenuOpen(false);
    setIsAdmin(false); 
    setIsBusiness(false);
    setCurrentBusinessId(null);
    setPublicIslandFilter('all');
    setIsDataLoaded(false);
    setMyReservations([]);
    setNotifications([]);
    localStorage.removeItem('notifiedResIds');
  };

  // Logic Handlers
  const handleFlightSelect = (flight: Flight) => {
    if (isAuthenticated) {
      setItinerary(prev => ({ ...prev, flight }));
      setCurrentStep('accommodation');
      setExploreCategory('accommodation');
    } else {
      setPendingFlight(flight);
      setShowAuthModal(true);
    }
  };

  const handleAuthSuccess = async (isAdminUser: boolean = false, businessId?: string, email?: string, role?: string, name?: string, phone?: string, password?: string) => {
    setIsAuthenticated(true);
    setShowAuthModal(false);
    setMobileMenuOpen(false);

    // Sync with DB to save password and phone for Admin access
    if (email && (password || phone)) {
      try {
        fetch(`${API_BASE_URL}/api/users/${email}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            email, 
            password, 
            phone,
            role: role || 'cliente',
            profile: { 
              name: name || email.split('@')[0],
              avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`
            }
          })
        }).then(() => {
           if (isAdminUser || email === 'adminadmin@gmail.com') {
             fetch(`${API_BASE_URL}/api/users?t=${Date.now()}`).then(r => r.json()).then(allUsers => setUsers(allUsers || []));
           }
        });
      } catch (e) {}
    }
    
    // 1. Super Admin
    if (isAdminUser || email === 'adminadmin@gmail.com') {
      setIsAdmin(true);
      setHasEnteredApp(true);
      return;
    }

    // 2. Login de Staff, Dono ou Fornecedor
    let finalBusinessId = businessId;
    let finalRole = role;

    // FORÇAR LOGIN DE PARCEIROS (Teste)
    if (email === 'hotel@azores4you.com') {
      finalBusinessId = 'hotel-1';
      finalRole = 'business';
    } else if (email === 'rentcar@azores4you.com') {
      finalBusinessId = 'rentcar-1';
      finalRole = 'business';
    }

    if (finalBusinessId) {
      const biz = [...restaurants, ...shops, ...beauty, ...hotels, ...services, ...offices, ...cars].find(b => b.id === finalBusinessId);
      const isBarber = biz?.subcategory === 'barber' || biz?.subcategory === 'barbearia' || finalBusinessId.startsWith('BEA');
      if (isBarber) {
        setIsAuthenticated(false);
        setIsBusiness(false);
        setIsStaff(false);
        setCurrentBusinessId(null);
        setShowBarberLogin(true);
        setShowAuthModal(false);
        return;
      }

      if (finalRole === 'supplier') {
        setIsSupplier(true);
        setIsStaff(false);
        setIsBusiness(false);
      } else if (finalRole === 'business' || finalRole === 'manager') {
        // Donos de negócio (Restaurante ou Outros)
        setIsBusiness(true);
        setIsStaff(false);
        setStaffRole(null);
      } else if (finalRole) {
        // Staff operacional
        setIsStaff(true);
        setStaffRole(finalRole);
        setIsBusiness(false);
      } else {
        setIsBusiness(true);
        setIsStaff(false);
      }
      setCurrentBusinessId(finalBusinessId);
      
      if (email) {
        setUserProfile(prev => ({ 
          ...prev, 
          email, 
          name: finalRole === 'supplier' ? 'Fornecedor' : (finalRole ? 'Staff' : 'Gestor') 
        }));
      }
      
      setHasEnteredApp(true);
      return;
    }

    if (pendingFlight) {
      setItinerary(prev => ({ ...prev, flight: pendingFlight }));
      setCurrentStep('accommodation');
      setExploreCategory('accommodation');
      setPendingFlight(null);
    } else {
      setExploreCategory(null);
    }
    
    setHasEnteredApp(true);
    
    // Se for viajante, carregar dados do servidor
    if (!isAdminUser && !businessId && email) {
      // ATUALIZAR EMAIL IMEDIATAMENTE PARA EVITAR FETCHDATA COM EMAIL ANTIGO
      setUserProfile(prev => ({ ...prev, email: email }));

      fetch(`${API_BASE_URL}/api/users/${email}`)
        .then(res => res.json())
        .then(async userData => {
          if (userData) {
            const finalName = name || userData.profile?.name || userData.name || 'Cliente Viajante';
            setUserProfile({
              email: userData.email,
              name: finalName,
              phone: userData.profile?.phone || '',
              avatar: userData.profile?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix'
            });
            setUserCredits(userData.credits || 0);
            setMyReservations(userData.reservations || []);

            // Se for novo registo (passámos o nome) ou o nome no servidor estiver vazio, atualizar
            const hasDefaultName = !userData.profile?.name || userData.profile.name === 'Cliente Viajante' || userData.profile.name === email.split('@')[0];
            if (name && hasDefaultName) {
               try {
                 await fetch(`${API_BASE_URL}/api/users/${email}`, {
                   method: 'PUT',
                   headers: { 'Content-Type': 'application/json' },
                   body: JSON.stringify({ 
                     ...userData,
                     name: name,
                     profile: {
                       ...(userData.profile || {}),
                       name: name,
                       avatar: userData.profile?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`
                     }
                   })
                 });
                 console.log("✅ Nome do utilizador atualizado no servidor");
               } catch (e) {
                 console.error("Erro ao atualizar nome no servidor:", e);
               }
            }
          }
        })
        .catch(err => console.error("Erro ao carregar dados do utilizador:", err));
    }
  };

  const handleCheckIn = async (resId: string, restaurantId: string, tableId: string) => {
    // 1. Local Update
    setMyReservations(prev => prev.map(r => r.id === resId ? { ...r, status: 'occupied' } : r));
    
    console.log(`🛎️ Iniciando Check-in: Reserva=${resId}, Mesa=${tableId || 'sem mesa'}, Rest=${restaurantId}`);
    
    let restName = "Restaurante";
    let tableName = tableId ? `Mesa #${tableId}` : "Mesa Principal";

    try {
      const rest = restaurants.find(r => r.id === restaurantId) || beauty.find(b => b.id === restaurantId);

      if (rest) {
        restName = rest.name;
        const resObj = rest.reservations?.find(r => r.id === resId);
        const updatedReservations = (rest.reservations || []).map(r =>
          r.id === resId ? { ...r, status: 'occupied' as const } : r
        );
        let updatedTables = rest.tables || [];
        const foodItems = resObj?.preOrder || resObj?.preorder || [];
        if (tableId) {
          const matchingTable = updatedTables.find(t => t.id === tableId || String(t.id) === String(tableId));
          if (matchingTable) tableName = matchingTable.number !== undefined ? `Mesa #${matchingTable.number}` : matchingTable.id;
          updatedTables = updatedTables.map(t => (t.id === tableId || String(t.id) === String(tableId)) ? {
            ...t,
            status: 'occupied' as const,
            customerName: resObj?.customerName,
            reservationTime: resObj?.time,
            currentTab: foodItems.length > 0 ? [...(t.currentTab || []), ...foodItems] : (t.currentTab || [])
          } : t);
        }
        let updatedKitchenOrders = rest.kitchenOrders || [];
        if (foodItems.length > 0) {
          const hasOrder = updatedKitchenOrders.some(o => o.reservationId === resId);
          if (!hasOrder) {
            updatedKitchenOrders = [
              ...updatedKitchenOrders,
              {
                id: `ORD_${Date.now()}`,
                tableId: tableId,
                reservationId: resId,
                items: foodItems,
                status: 'pending_admin' as const,
                timestamp: new Date().toISOString()
              }
            ];
          } else {
            updatedKitchenOrders = updatedKitchenOrders.map(order =>
              order.reservationId === resId ? { ...order, tableId: tableId || order.tableId } : order
            );
          }
        } else {
          updatedKitchenOrders = updatedKitchenOrders.map(order =>
            order.reservationId === resId ? { ...order, tableId: tableId || order.tableId } : order
          );
        }
        const updatedRest = { ...rest, tables: updatedTables, reservations: updatedReservations, kitchenOrders: updatedKitchenOrders };
        const isBeautyBiz = beauty.some(b => b.id === restaurantId);
        if (isBeautyBiz) {
          setBeauty(prev => prev.map(r => r.id === restaurantId ? updatedRest : r));
        } else {
          setRestaurants(prev => prev.map(r => r.id === restaurantId ? updatedRest : r));
        }

        await fetch(`${API_BASE_URL}/api/reservations/${resId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'occupied', tableId }),
        });
        console.log('✅ Reserva global e mesa atualizadas no servidor');
      } else {
        await fetch(`${API_BASE_URL}/api/reservations/${resId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'occupied', tableId }),
        });
      }

      setWelcomePopupDetails({ restaurantName: restName, tableName });
    } catch (err) {
      console.error('Erro no check-in:', err);
      setWelcomePopupDetails({ restaurantName: restName, tableName });
    }
  };

  const handleCheckOut = async (resId: string, restaurantId: string, tableId: string) => {
    const confirmOut = window.confirm("Confirmar saída do restaurante?");
    if (!confirmOut) return;

    const rest = restaurants.find(r => r.id === restaurantId) || beauty.find(b => b.id === restaurantId);
    if (!rest) return;

    // Just mark as finished and free the table — credits come after payment confirmation by the restaurant
    const updatedUserRes = myReservations.map(r => r.id === resId ? { ...r, status: 'finished' } : r);
    setMyReservations(updatedUserRes);

    const updatedTables = rest.tables?.map(t => t.id === tableId ? { ...t, status: 'available' as const, customerName: undefined, reservationTime: undefined, currentTab: [] } : t);
    const updatedReservations = rest.reservations?.map(r => r.id === resId ? { ...r, status: 'finished' as const } : r);
    const updatedRest = { ...rest, tables: updatedTables, reservations: updatedReservations };
    const isBeautyBiz = beauty.some(b => b.id === restaurantId);
    if (isBeautyBiz) {
      setBeauty(prev => prev.map(r => r.id === restaurantId ? updatedRest : r));
    } else {
      setRestaurants(prev => prev.map(r => r.id === restaurantId ? updatedRest : r));
    }

    try {
      // 1. Atualizar a reserva global no servidor (o servidor libertará a mesa automaticamente)
      await fetch(`${API_BASE_URL}/api/reservations/${resId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'finished', tableId }),
      });

      alert('✅ Saída registada! Os créditos serão atribuídos após confirmação do pagamento pelo restaurante.');
    } catch (err) { 
      console.error(err); 
      alert('✅ Saída registada localmente. Será sincronizada em breve.');
    }
  };

  const updateItinerary = (update: Partial<Itinerary>) => {
    setItinerary(prev => ({ ...prev, ...update }));
  };

  const handleNavClick = (category: ExploreCategory) => {
    // Auto scroll to top when changing category
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (exploreCategory === category) {
      setExploreCategory(null);
      setMobileMenuOpen(false);
      return;
    }

    // Intercept Bus Category to show Island Selection Modal first
    if (category === 'buses') {
      setShowBusIslandModal(true);
      setMobileMenuOpen(false);
      return;
    }

    setExploreCategory(category);
    if (category === 'flights') setCurrentStep('flights');
    if (category === 'accommodation') setCurrentStep('accommodation');
    if (category === 'rentcar') setCurrentStep('car');
    setMobileMenuOpen(false);
  };
  
  const handleBusIslandSelect = (islandCode: string) => {
    setPublicIslandFilter(islandCode);
    setExploreCategory('buses');
    setShowBusIslandModal(false);
  };

  const handleSearch = (query: string) => {
    if (!query) return;
    const q = query.toLowerCase().trim();

    let category: ExploreCategory = null;
    let islandCode: string | null = null;
    let filterQuery = '';

    // Check category keywords
    if (q.includes('restaurant') || q.includes('restaurante') || q.includes('comer') || q.includes('almoço') || q.includes('jantar') || q.includes('snack') || q.includes('snack-bar') || q.includes('snackbar')) {
      category = 'restaurants';
    } else if (q.includes('alojamento') || q.includes('alojamentos') || q.includes('hotel') || q.includes('hoteis') || q.includes('hotéis') || q.includes('hospedar') || q.includes('quarto') || q.includes('casa') || q.includes('quartos') || q.includes('al ')) {
      category = 'accommodation';
    } else if (q.includes('rentcar') || q.includes('rent-a-car') || q.includes('rent a car') || q.includes('aluguer de carro') || q.includes('carro') || q.includes('carros') || q.includes('veículo') || q.includes('veiculo')) {
      category = 'rentcar';
    } else if (q.includes('trilho') || q.includes('trilhos') || q.includes('caminhada') || q.includes('hiking') || q.includes('sete cidades')) {
      category = 'trails';
    } else if (q.includes('autocarro') || q.includes('autocarros') || q.includes('bus') || q.includes('paragem') || q.includes('transporte') || q.includes('transportes')) {
      category = 'buses';
    } else if (q.includes('atividade') || q.includes('atividades') || q.includes('tour') || q.includes('tours') || q.includes('experiencia') || q.includes('experiência') || q.includes('experiencias')) {
      category = 'activities';
    } else if (q.includes('ponto') || q.includes('pontos') || q.includes('atração') || q.includes('atracao') || q.includes('miradouro') || q.includes('poi')) {
      category = 'poi';
    } else if (q.includes('loja') || q.includes('lojas') || q.includes('comércio') || q.includes('comercio') || q.includes('comprar')) {
      category = 'shops';
    } else if (q.includes('beleza') || q.includes('cabeleireiro') || q.includes('barbeiro') || q.includes('estética') || q.includes('unhas') || q.includes('estetica') || q.includes('manicure')) {
      category = 'beauty';
    } else if (q.includes('voo') || q.includes('voos') || q.includes('flight') || q.includes('flights') || q.includes('avião') || q.includes('aeroporto')) {
      category = 'flights';
    } else if (q.includes('bar') || q.includes('bares') || q.includes('noite') || q.includes('discoteca')) {
      category = 'bars';
    } else if (q.includes('evento') || q.includes('eventos') || q.includes('show') || q.includes('espetáculo')) {
      category = 'events';
    } else if (q.includes('serviço') || q.includes('servicos') || q.includes('serviços') || q.includes('oficina') || q.includes('reparação')) {
      category = 'services';
    }

    // Check island keywords
    const islandKeywords: Record<string, string> = {
      'sao miguel': 'PDL', 'são miguel': 'PDL', 'ponta delgada': 'PDL', 'rabo de peixe': 'PDL', 'lagoa': 'PDL', 'ribeira grande': 'PDL', 'furnas': 'PDL', 'povoação': 'PDL', 'povoacao': 'PDL', 'nordeste': 'PDL', 'vila franca': 'PDL',
      'terceira': 'TER', 'angra': 'TER', 'praia da vitoria': 'TER', 'praia da vitória': 'TER',
      'faial': 'HOR', 'horta': 'HOR',
      'pico': 'PIX', 'madalena': 'PIX', 'lajes': 'PIX', 'sao roque': 'PIX', 'são roque': 'PIX',
      'sao jorge': 'SJZ', 'são jorge': 'SJZ', 'velas': 'SJZ', 'calheta': 'SJZ',
      'graciosa': 'GRW', 'santa cruz': 'GRW',
      'flores': 'FLW', 'santa cruz das flores': 'FLW',
      'corvo': 'CVU', 'vila do corvo': 'CVU',
      'santa maria': 'SMA', 'vila do porto': 'SMA'
    };

    for (const [kw, code] of Object.entries(islandKeywords)) {
      if (q.includes(kw)) {
        islandCode = code;
        break;
      }
    }

    // Default category to restaurants if not set
    if (!category) {
      category = 'restaurants';
    }

    if (islandCode) {
      setPublicIslandFilter(islandCode);
    }

    // Filter query is the query with keywords cleaned out
    const keywordsToRemove = [
      'restaurante', 'restaurants', 'restaurantes', 'comer', 'almoço', 'jantar', 'snack', 'snack-bar', 'snackbar',
      'alojamento', 'alojamentos', 'hotel', 'hoteis', 'hotéis', 'quarto', 'casa',
      'rentcar', 'rent-a-car', 'carro', 'carros',
      'trilho', 'trilhos', 'caminhada', 'hiking',
      'autocarro', 'autocarros', 'bus', 'paragem', 'transporte', 'transportes',
      'atividade', 'atividades', 'tour', 'tours', 'experiencia', 'experiência', 'experiencias',
      'ponto', 'pontos', 'atração', 'atrações', 'atracao', 'miradouro', 'poi',
      'loja', 'lojas', 'comércio', 'comercio', 'comprar',
      'beleza', 'cabeleireiro', 'barbeiro', 'estética', 'estetica', 'unhas',
      'voo', 'voos', 'flight', 'flights', 'avião', 'aeroporto',
      'bar', 'bares', 'noite', 'discoteca', 'evento', 'eventos', 'serviço', 'serviços',
      'sao miguel', 'são miguel', 'terceira', 'faial', 'pico', 'sao jorge', 'são jorge', 'graciosa', 'flores', 'corvo', 'santa maria',
      'ponta delgada', 'ribeira grande', 'lagoa', 'furnas', 'povoação', 'povoacao', 'nordeste', 'vila franca', 'angra', 'praia da vitoria', 'praia da vitória', 'horta', 'madalena', 'lajes', 'sao roque', 'são roque', 'velas', 'calheta', 'santa cruz'
    ];

    let cleanQuery = q;
    keywordsToRemove.forEach(kw => {
      cleanQuery = cleanQuery.replace(new RegExp(`\\b${kw}\\b`, 'g'), '');
    });
    filterQuery = cleanQuery.replace(/\s+/g, ' ').trim();

    handleNavClick(category);
    setGlobalSearchQuery(filterQuery || query);
  };

  const goHome = () => {
    setExploreCategory(null);
    setMobileMenuOpen(false);
  };

  const persistItinerary = async (ticketId?: string, guestDetails?: any) => {
    if (!itinerary) return;

    // Use provided ticketId or generate a new one if missing
    const packageId = ticketId || `AZ-${Math.floor(Math.random() * 90000) + 10000}-${new Date().getFullYear()}`;
    const newReservations: any[] = [];
    
    console.log("💾 Persistindo pacote:", packageId, itinerary, guestDetails); // Deploy trigger

    if (itinerary.hotel) {
      const roomPrice = itinerary.selectedRoom ? (Number(itinerary.selectedRoom.pricePerNight) || Number(itinerary.selectedRoom.price)) : (Number(itinerary.hotel.pricePerNight) || Number(itinerary.hotel.price));
      const totalHotelPrice = roomPrice * (itinerary.nights || 1);
      const startStr = itinerary.hotelStartDate || new Date().toISOString().split('T')[0];
      const endStr = (() => {
        const d = new Date(startStr);
        d.setDate(d.getDate() + (itinerary.nights || 1));
        return d.toISOString().split('T')[0];
      })();

      newReservations.push({
        id: `RES_H_${Date.now()}`,
        packageId: packageId,
        type: itinerary.hotel.type, // 'hotel' or 'al'
        hotel: itinerary.hotel,
        roomId: itinerary.selectedRoom ? itinerary.selectedRoom.id : null,
        selectedRoom: itinerary.selectedRoom ? {
          id: itinerary.selectedRoom.id,
          number: itinerary.selectedRoom.name || itinerary.selectedRoom.number || itinerary.selectedRoom.roomNumber || '?',
          type: itinerary.selectedRoom.type || 'Standard'
        } : null,
        date: startStr,
        checkinDate: startStr,
        checkoutDate: endStr,
        nights: itinerary.nights || 1,
        status: 'pending',
        price: totalHotelPrice,
        client: guestDetails?.name || userProfile?.name || 'Cliente',
        customerName: guestDetails?.name || userProfile?.name || 'Cliente',
        selectedExtras: itinerary.selectedExtras || [],
        license: guestDetails?.license || '',
        nif: guestDetails?.nif || '',
        nifType: guestDetails?.nifType || 'Nacional',
        paymentMethod: guestDetails?.paymentMethod || 'transfer',
        rentType: itinerary.rentType || null
      });
    }

    if (itinerary.car) {
      newReservations.push({
        id: `RES_C_${Date.now() + 1}`,
        packageId: packageId,
        type: 'car',
        car: itinerary.car,
        companyName: itinerary.car.companyName || 'Auto Açores Rent', 
        date: itinerary.carStartDate || new Date().toISOString().split('T')[0],
        days: itinerary.carDays || 3,
        status: 'pending',
        license: guestDetails?.license || '',
        nif: guestDetails?.nif || '',
        nifType: guestDetails?.nifType || 'Nacional',
        paymentMethod: guestDetails?.paymentMethod || 'transfer'
      });
    }

    if (itinerary.flight) {
      newReservations.push({
        id: `RES_F_${Date.now() + 2}`,
        packageId: packageId,
        type: 'flight',
        flight: itinerary.flight,
        date: new Date().toISOString().split('T')[0],
        status: 'pending'
      });
    }

    if (newReservations.length > 0) {
      const updatedList = [...myReservations, ...newReservations];
      setMyReservations(updatedList);

      if (isAuthenticated && userProfile?.email) {
        // 1. Sync User Profile
        try {
          await fetch(`${API_BASE_URL}/api/users/${userProfile.email}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ reservations: updatedList })
          });
          console.log("✅ Pacote sincronizado com o perfil do utilizador");
        } catch (err) {
          console.warn("Aviso: Falha ao sincronizar com perfil, mas continuaremos com o negócio.");
        }

        // 2. Sync Businesses
        const syncPromises = newReservations.map(async res => {
          let targetBizId = '';
          let endpoint = '';

          if (res.type === 'car') {
            // Use companyId (e.g. RC17...) not the vehicle id (C17...)
            targetBizId = res.car?.companyId || res.car?.id || 'rentcar-1';
            endpoint = 'cars';
          } else if (res.type === 'hotel' || res.type === 'al') {
            targetBizId = res.hotel?.id || 'hotel-1';
            endpoint = 'hotels';
          } else if (res.type === 'restaurant') {
            targetBizId = res.restaurantId;
            endpoint = 'restaurants';
          }

          if (targetBizId && endpoint) {
            try {
              const bResp = await fetch(`${API_BASE_URL}/api/${endpoint}/${targetBizId}`);
              if (bResp.ok) {
                const bizData = await bResp.json();
                const bizRes = bizData.reservations || [];
                const updatedBizRes = [...bizRes, {
                  ...res,
                  customerEmail: userProfile.email,
                  customerName: userProfile.name,
                  customerPhone: userProfile.phone
                }];

                await fetch(`${API_BASE_URL}/api/${endpoint}/${targetBizId}`, {
                  method: 'PUT',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ ...bizData, reservations: updatedBizRes })
                });
                console.log(`✅ Reserva enviada para ${endpoint}: ${targetBizId}`);
              }
            } catch (e) {
              console.error(`Erro ao enviar para ${endpoint}:`, e);
            }
          }
        });
        
        await Promise.all(syncPromises);
        // After syncing, we should refresh the data to see it in the dashboard
        await fetchData();
      }
    }
  };

  const handleFinalComplete = () => {
    // If not already persisted by onConfirm (unlikely but possible), 
    // it would have happened in the modal. Here we just clear UI.
    setItinerary(DEFAULT_ITINERARY);
    setCurrentStep('flights');
    setExploreCategory(null);
  };

  const handleViewPackage = () => {
    if (!isAuthenticated && !itinerary.flight && !itinerary.hotel) {
        setShowAuthModal(true);
        return;
    }
    setShowPackageModal(true);
  };

  const handleContinueFromPackage = () => {
    setShowPackageModal(false);
    if (!itinerary.flight) {
      setExploreCategory('flights');
      setCurrentStep('flights');
    } else if (!itinerary.hotel) {
      setExploreCategory('accommodation');
      setCurrentStep('accommodation');
    } else if (!itinerary.car) {
      setExploreCategory('rentcar');
      setCurrentStep('car');
    } else {
      setExploreCategory('flights');
      setCurrentStep('summary');
    }
  };

  // --- LOGIC CALCULATIONS (Must be before any returns) ---
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

  const isNearbyFilter = publicIslandFilter.startsWith('nearby:');
  const userCoords = isNearbyFilter ? publicIslandFilter.replace('nearby:', '').split(',').map(Number) : null;

  const destinationIsland = itinerary?.flight?.destination || publicIslandFilter;
  const itineraryItemCount = ((itinerary?.flight ? 1 : 0) + (itinerary?.hotel ? 1 : 0) + (itinerary?.car ? 1 : 0)) || 0;
  const navCategories = getNavigationCategories(language);
  const airports = getAirports(language);
  
  const selectedIslandName = isNearbyFilter 
    ? (language === 'pt' ? 'Perto de Mim' : 'Nearby Me')
    : (airports.find(a => a.code === publicIslandFilter)?.location || getTranslation(language, 'all_islands'));
  const handleTableAction = async (restaurantId: string, tableId: string, action: 'calling_waiter' | 'waiting_bill' | 'bill_confirmed') => {
    const rest = restaurants.find(r => r.id === restaurantId);
    if (!rest || !rest.tables) return;

    const newTables = rest.tables.map(t => t.id === tableId ? { ...t, alertStatus: action } : t);
    const updatedRest = { ...rest, tables: newTables };

    setRestaurants(prev => prev.map(r => r.id === restaurantId ? updatedRest : r));

    try {
      await fetch(`${API_BASE_URL}/api/restaurants/${restaurantId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedRest),
      });
      if (action !== 'bill_confirmed') {
        alert(action === 'waiting_bill' ? '🧾 Pedido de conta enviado à equipa!' : '👨‍🍳 O Staff foi chamado à sua mesa.');
      }
    } catch (err) { console.error(err); }
  };

   const handlePlaceTableOrder = async (items: OrderItem[]) => {
     if (!tableMenuRes) return;
     const restId = tableMenuRes.restaurantId || tableMenuRes.businessId;
     if (!restId) return;
     const rest = restaurants.find(r => r.id === restId);
     if (!rest) return;

     // VALIDAR ESTADO DA MESA: Não permitir pedidos se a mesa estiver LIVRE
     const targetTable = rest.tables?.find(t => t.id === tableMenuRes.tableId);
     if (!targetTable || targetTable.status === 'available') {
        alert('❌ Erro: Não é possível fazer pedidos extras para uma mesa livre. A mesa deve estar ocupada ou reservada para si.');
        setTableMenuRes(null);
        return;
     }

     // 1. Atualizar a mesa com o pedido acumulado no currentTab e em pendingOrderItems para o balão do gerente
     const updatedTables = (rest.tables || []).map(t => {
        if (t.id === tableMenuRes.tableId) {
           return { 
             ...t, 
             currentTab: [...(t.currentTab || []), ...items],
             pendingOrderItems: [...(t.pendingOrderItems || []), ...items],
             alertStatus: 'new_order' as const
           };
        }
        return t;
     });

     const updatedRest = {
       ...rest,
       tables: updatedTables
     };

     setRestaurants(prev => prev.map(r => r.id === restId ? updatedRest : r));

     try {
        const orderResp = await fetch(`${API_BASE_URL}/api/reservations/${tableMenuRes.id}/append-order`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ items }),
       });
        if (orderResp.ok) {
          alert('🛎️ Pedido enviado com sucesso! Aguarde a confirmação do restaurante.');
          // Resync restaurants so table alertStatus & pendingOrderItems are up-to-date for kitchen monitor
          await fetchData(0, ['restaurants']);
          // Resync current user reservations so order tracker reflects the new preOrder
          if (userProfile?.email) {
            try {
              const userResp = await fetch(`${API_BASE_URL}/api/users/${userProfile.email}?t=${Date.now()}`);
              if (userResp.ok) { const userData = await userResp.json(); setMyReservations(userData.reservations || []); }
            } catch (e) { console.error('Sync user reservations error:', e); }
          }
        } else {
          alert('❌ Não foi possível enviar o pedido. Tente novamente.');
        }
     } catch (err) { console.error(err); alert('❌ Erro de ligação ao servidor.'); }
     setTableMenuRes(null);
  };


  // --- HOTEL ROOM SERVICE QR CODES CONCIERGE ---
  if (roomServiceAccess) {
    return (
      <HotelRoomService 
        hotelId={roomServiceAccess.hotelId}
        roomId={roomServiceAccess.roomId}
        qrToken={roomServiceAccess.qrToken}
        onBackToApp={() => {
          setRoomServiceAccess(null);
          window.history.pushState({}, '', '/');
        }}
      />
    );
  }

  // --- GUEST QR MODE RENDER ---
  if (isGuestMode && guestRestaurantId && guestTableId) {
    const guestRestaurant = restaurants.find(r => String(r.id) === String(guestRestaurantId));
    
    if (!guestRestaurant) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950 p-8">
          <div className="text-center text-white">
            <div className="text-6xl mb-6 animate-spin">🔄</div>
            <p className="text-xl font-black uppercase tracking-widest">A carregar restaurante...</p>
            <p className="text-slate-400 text-sm mt-2">Por favor aguarde</p>
          </div>
        </div>
      );
    }

    const guestTable = (guestRestaurant.tables || []).find((t: any) => String(t.id) === String(guestTableId));
    const tableName = guestTable ? `Mesa ${guestTable.number}` : `Mesa ${guestTableId}`;

    // Auto-reconhecer: se mesa já tem cliente registado, skip ao formulário
    const tableAlreadyHasGuest = guestTable && guestTable.status === 'occupied' && guestTable.customerName && guestTable.guestPhone;
    if (tableAlreadyHasGuest && !guestCheckIn) {
      if (!guestFormData.name && guestTable.customerName) {
        setGuestFormData({ name: guestTable.customerName || '', people: guestTable.seats || 2, phone: guestTable.guestPhone || '', email: guestTable.guestEmail || '' });
      }
      setGuestCheckIn(true);
    }
    const handleGuestExit = () => setShowGuestExitPromo(true);
    const doExit = () => { setIsGuestMode(false); setGuestCheckIn(false); setHasEnteredApp(false); setGuestOrderSent(false); setShowGuestExitPromo(false); setGuestFormData({ name: '', people: 2, phone: '', email: '' }); };

    // ── STEP 1: Check-in form ──
    if (!guestCheckIn) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4">
          {/* Decorative blobs */}
          <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute top-[-20%] right-[-10%] w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl" />
            <div className="absolute bottom-[-20%] left-[-10%] w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
          </div>
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="relative w-full max-w-sm bg-white rounded-[2.5rem] shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-8 text-center">
              <div className="w-16 h-16 bg-white/10 rounded-3xl flex items-center justify-center mx-auto mb-4 text-3xl">🍽️</div>
              <h1 className="text-white font-black text-xl tracking-tight">{guestRestaurant.name}</h1>
              <p className="text-emerald-400 text-xs font-bold uppercase tracking-widest mt-1">{tableName} · Bem-vindo!</p>
            </div>
            {/* Form */}
            <div className="p-7 space-y-4">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Nome do Responsável *</label>
                <input
                  type="text"
                  value={guestFormData.name}
                  onChange={e => setGuestFormData(p => ({ ...p, name: e.target.value }))}
                  placeholder="Ex: João Silva"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Nº de Pessoas *</label>
                <div className="flex items-center gap-3">
                  <button onClick={() => setGuestFormData(p => ({ ...p, people: Math.max(1, p.people - 1) }))}
                    className="w-11 h-11 bg-slate-100 hover:bg-slate-200 rounded-2xl flex items-center justify-center font-black text-slate-700 transition-all active:scale-90 text-lg">−</button>
                  <span className="flex-1 text-center font-black text-2xl text-slate-800">{guestFormData.people}</span>
                  <button onClick={() => setGuestFormData(p => ({ ...p, people: Math.min(20, p.people + 1) }))}
                    className="w-11 h-11 bg-slate-100 hover:bg-slate-200 rounded-2xl flex items-center justify-center font-black text-slate-700 transition-all active:scale-90 text-lg">+</button>
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Telemóvel *</label>
                <input
                  type="tel"
                  value={guestFormData.phone}
                  onChange={e => setGuestFormData(p => ({ ...p, phone: e.target.value }))}
                  placeholder="Ex: 912 345 678"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Email <span className="text-slate-300">(opcional)</span></label>
                <input
                  type="email"
                  value={guestFormData.email}
                  onChange={e => setGuestFormData(p => ({ ...p, email: e.target.value }))}
                  placeholder="Ex: joao@email.com"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                />
              </div>
              <button
                onClick={async () => {
                  if (!guestFormData.name.trim() || !guestFormData.phone.trim()) {
                    alert('Por favor preencha o nome e o telemóvel.');
                    return;
                  }
                  // Save guest info to the table on the server
                  const updatedTables = (guestRestaurant.tables || []).map((t: any) => {
                    if (String(t.id) === String(guestTableId)) {
                      return {
                        ...t,
                        status: 'occupied',
                        customerName: guestFormData.name,
                        seats: guestFormData.people,
                        guestPhone: guestFormData.phone,
                        guestEmail: guestFormData.email,
                      };
                    }
                    return t;
                  });
                  try {
                    await fetch(`${API_BASE_URL}/api/restaurants/${guestRestaurantId}`, {
                      method: 'PUT',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ ...guestRestaurant, tables: updatedTables }),
                    });
                    await fetchData(0, ['restaurants']);
                  } catch (e) {}
                  setGuestCheckIn(true);
                }}
                className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-xl shadow-emerald-500/30 active:scale-95 mt-2"
              >
                Entrar e Ver Menu 🍽️
              </button>
              <button
                onClick={() => { setIsGuestMode(false); setHasEnteredApp(false); }}
                className="w-full py-3 text-slate-400 text-xs font-bold uppercase tracking-widest hover:text-slate-600 transition-all"
              >
                Cancelar
              </button>
            </div>
          </motion.div>
          <AnimatePresence>
            {showGuestExitPromo && <GuestExitPromoPopup onYes={() => { window.location.href = 'https://azorestoyou.pt'; }} onNo={doExit} />}
          </AnimatePresence>
        </div>
      );
    }

    // ── STEP 2: POS Menu ──
    // Guest places order — sends to server as pendingOrderItems on the table
    const handleGuestOrder = async (items: OrderItem[]) => {
      const guestSessionId = `GUEST_${Date.now()}_${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      const freshRestaurant = restaurants.find(r => String(r.id) === String(guestRestaurantId)) || guestRestaurant;
      try {
        const updatedTables = (freshRestaurant.tables || []).map((t: any) => {
          if (String(t.id) === String(guestTableId)) {
            return {
              ...t,
              status: 'occupied',
              alertStatus: 'new_order',
              customerName: guestFormData.name,
              pendingOrderItems: [...(t.pendingOrderItems || []), ...items.map(it => ({
                ...it,
                guestSession: guestSessionId,
                guestName: guestFormData.name,
                guestPhone: guestFormData.phone,
              }))],
            };
          }
          return t;
        });
        await fetch(`${API_BASE_URL}/api/restaurants/${guestRestaurantId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...freshRestaurant, tables: updatedTables }),
        });
        await fetchData(0, ['restaurants']);
        setGuestOrderSent(true);
      } catch (e) {
        alert('❌ Erro ao enviar pedido. Por favor tente novamente.');
      }
    };

    return (
      <div className="min-h-screen bg-slate-950">
        {/* Top bar */}
        <div className="fixed top-0 left-0 right-0 z-50 bg-slate-950/95 backdrop-blur-xl border-b border-white/10 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-emerald-500 rounded-xl flex items-center justify-center text-white text-sm">🍽️</div>
            <div>
              <p className="text-white font-black text-sm tracking-tight">{guestRestaurant.name}</p>
              <p className="text-emerald-400 text-[10px] font-bold uppercase tracking-widest">{tableName} · {guestFormData.name || 'Convidado'}</p>
            </div>
          </div>
          <button
            onClick={handleGuestExit}
            className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-xl text-white text-xs font-bold transition-all"
          >
            Sair
          </button>
        </div>

        <div className="pt-16">
          <TableMenuModal
            isOpen={true}
            onClose={handleGuestExit}
            restaurant={guestRestaurant}
            tableId={String(guestTableId)}
            reservationId={`GUEST_${guestTableId}`}
            tableStatus="occupied"
            onPlaceOrder={handleGuestOrder}
          />
        </div>

        {/* ── ORDER SENT POPUP (fade-in / fade-out) ── */}
        <AnimatePresence>
          {guestOrderSent && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[300] bg-slate-900/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-4"
            >
              <motion.div
                initial={{ opacity: 0, y: 60, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 40, scale: 0.95 }}
                transition={{ type: 'spring', damping: 22, stiffness: 300 }}
                className="w-full max-w-sm bg-white/95 backdrop-blur-xl rounded-[2.5rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.25)] overflow-hidden border border-white relative"
              >
                {/* Decorative glows */}
                <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-100/60 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-100/40 rounded-full blur-3xl -ml-16 -mb-16 pointer-events-none" />

                <div className="relative z-10 p-7">
                  {/* Status chips */}
                  <div className="flex items-center gap-2 mb-5">
                    <span className="bg-emerald-100 text-emerald-700 text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-emerald-200">Em Experiência</span>
                    <span className="bg-slate-100 text-slate-600 text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-slate-200">Presencial</span>
                    <span className="ml-auto text-slate-400 text-[10px] font-bold">{new Date().toLocaleDateString('pt-PT')}</span>
                  </div>

                  {/* Restaurant + table */}
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h2 className="font-black text-2xl text-slate-800 tracking-tight">{guestRestaurant.name}</h2>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="bg-blue-100 text-blue-700 text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full">{tableName}</span>
                        {guestRestaurant.island && <span className="text-[10px] text-slate-400 font-bold uppercase">📍 {guestRestaurant.island}</span>}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-slate-400 text-[9px] uppercase tracking-widest font-bold">Hora</p>
                      <p className="font-black text-xl text-slate-800">{new Date().toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                  </div>

                  {/* Person info */}
                  <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <div>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Titular</p>
                      <p className="font-black text-slate-800 text-sm">{guestFormData.name}</p>
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Pessoas</p>
                      <p className="font-black text-slate-800 text-sm">{guestFormData.people} {guestFormData.people === 1 ? 'Pessoa' : 'Pessoas'}</p>
                    </div>
                  </div>

                  {/* Status bar */}
                  <div className="mb-6 p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <p className="text-emerald-700 font-black text-xs uppercase tracking-widest">Pedido Enviado!</p>
                    </div>
                    <p className="text-emerald-600 text-[11px] font-medium">🛎️ O restaurante foi notificado. Aguarde enquanto processam o seu pedido.</p>
                  </div>

                  {/* Actions */}
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <button
                      onClick={() => setGuestOrderSent(false)}
                      className="py-4 bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all flex items-center justify-center gap-2 active:scale-95"
                    >
                      🍽️ Mais Itens
                    </button>
                    <button
                      onClick={() => {
                        setGuestOrderSent(false);
                        if (guestRestaurantId && guestTableId) {
                          handleTableAction(guestRestaurantId, String(guestTableId), 'calling_waiter');
                        }
                      }}
                      className="py-4 bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all flex items-center justify-center gap-2 active:scale-95"
                    >
                      🔔 Chamar Staff
                    </button>
                  </div>

                  {/* Exit button */}
                  <button
                    onClick={() => { setGuestOrderSent(false); handleGuestExit(); }}
                    className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-black text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-2 active:scale-95 shadow-xl shadow-slate-900/20"
                  >
                    ← Sair e Voltar ao Telemóvel
                  </button>
                </div>

                {/* Footer */}
                <div className="relative z-10 px-7 py-4 border-t border-slate-100/60 flex items-center justify-between bg-white/50">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">⭐ Acumule Créditos</span>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">🕐 Suporte 24H</span>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        {/* ── EXIT PROMO POPUP ── */}
        <AnimatePresence>
          {showGuestExitPromo && <GuestExitPromoPopup onYes={() => { window.location.href = 'https://azorestoyou.pt'; }} onNo={doExit} />}
        </AnimatePresence>
      </div>
    );
  }

  // --- BARBER LOGIN VIEW ---
  if (showBarberLogin) {
    return (
      <ErrorBoundary>
        <BarberLogin 
          beautyList={beauty}
          onBack={() => setShowBarberLogin(false)}
          onLoginSuccess={(businessId, softwareVersion) => {
            setIsBusiness(true);
            setIsStaff(false);
            setCurrentBusinessId(businessId);
            setHasEnteredApp(true);
            setShowBarberLogin(false);
          }}
        />
      </ErrorBoundary>
    );
  }

  if (!hasEnteredApp) {
    return (
      <LandingPage 
        onEnterBooking={enterBooking} 
        onEnterExplore={enterExplore} 
        onAuthSuccess={handleAuthSuccess}
        currentLanguage={language}
        onLanguageChange={setLanguage}
        restaurants={restaurants}
        shops={shops}
        beauty={beauty}
      />
    );
  }

  // --- ADMIN VIEW ---
  if (isAdmin) {
    return (
      <AdminDashboard 
        // Data
        restaurants={restaurants}
        shops={shops}
        beauty={beauty}
        services={services}
        autoRepairs={autoRepairs}
        autoElectronics={autoElectronics}
        usedMarket={usedMarket}
        animals={animals}
        realEstate={realEstate}
        gyms={gyms}
        stands={stands}
        offices={offices}
        itServices={itServices}
        perfumes={perfumes}
        bars={bars}
        events={events}
        municipal={municipal}
        activities={activities}
        flights={flights}
        hotels={hotels}
        cars={cars}
        busSchedules={busSchedules}
        marketplaceAds={marketplaceAds}
        // Updaters - AUTO-SYNC: save to MongoDB immediately
        onUpdateRestaurants={async (list) => { setRestaurants(list); await fetch(`${API_BASE_URL}/api/restaurants/bulk`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(list) }); }}
        onUpdateShops={async (list) => { setShops(list); await fetch(`${API_BASE_URL}/api/shops/bulk`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(list) }); }}
        onUpdateBeauty={async (list) => { setBeauty(list); await fetch(`${API_BASE_URL}/api/beauty/bulk`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(list) }); }}
        onUpdateServices={async (list) => { setServices(list); await fetch(`${API_BASE_URL}/api/services/bulk`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(list) }); }}
        onUpdateAutoRepairs={async (list) => { setAutoRepairs(list); await fetch(`${API_BASE_URL}/api/auto_repairs/bulk`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(list) }); }}
        onUpdateAutoElectronics={async (list) => { setAutoElectronics(list); await fetch(`${API_BASE_URL}/api/auto_electronics/bulk`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(list) }); }}
        onUpdateUsedMarket={async (list) => { setUsedMarket(list); await fetch(`${API_BASE_URL}/api/used_market/bulk`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(list) }); }}
        onUpdateAnimals={async (list) => { setAnimals(list); await fetch(`${API_BASE_URL}/api/animals/bulk`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(list) }); }}
        onUpdateRealEstate={async (list) => { setRealEstate(list); await fetch(`${API_BASE_URL}/api/real_estate/bulk`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(list) }); }}
        onUpdateGyms={async (list) => { setGyms(list); await fetch(`${API_BASE_URL}/api/gyms/bulk`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(list) }); }}
        onUpdateStands={async (list) => { setStands(list); await fetch(`${API_BASE_URL}/api/stands/bulk`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(list) }); }}
        onUpdateOffices={async (list) => { setOffices(list); await fetch(`${API_BASE_URL}/api/offices/bulk`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(list) }); }}
        onUpdateITServices={async (list) => { setItServices(list); await fetch(`${API_BASE_URL}/api/it_services/bulk`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(list) }); }}
        onUpdatePerfumes={async (list) => { setPerfumes(list); await fetch(`${API_BASE_URL}/api/perfumes/bulk`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(list) }); }}
        onUpdateBars={async (list) => { setBars(list); await fetch(`${API_BASE_URL}/api/bars/bulk`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(list) }); }}
        onUpdateEvents={async (list) => { setEvents(list); await fetch(`${API_BASE_URL}/api/events/bulk`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(list) }); }}
        onUpdateMunicipal={async (list) => { setMunicipal(list); await fetch(`${API_BASE_URL}/api/municipal/bulk`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(list) }); }}
        onUpdateActivities={async (list) => { setActivities(list); await fetch(`${API_BASE_URL}/api/activities/bulk`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(list) }); }}
        onUpdateFlights={async (list) => { setFlights(list); await fetch(`${API_BASE_URL}/api/flights/bulk`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(list) }); }}
        onUpdateHotels={async (list) => { setHotels(list); await fetch(`${API_BASE_URL}/api/hotels/bulk`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(list) }); }}
        onUpdateCars={async (list) => { setCars(list); await fetch(`${API_BASE_URL}/api/cars/bulk`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(list) }); }}
        onUpdateBusSchedules={async (list) => { setBusSchedules(list); await fetch(`${API_BASE_URL}/api/bus-schedules/bulk`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(list) }); }}
        onUpdateMarketplaceAds={async (list) => { setMarketplaceAds(list); await fetch(`${API_BASE_URL}/api/marketplace_ads/bulk`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(list) }); }}
        marketplaceCategories={marketplaceCategories}
        onUpdateMarketplaceCategories={async (list) => { setMarketplaceCategories(list); await fetch(`${API_BASE_URL}/api/marketplace_categories/bulk`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(list) }); }}
        
        // Status & Logic
        dbStatus={dbStatus}
        onLogout={() => { setIsAdmin(false); setIsAuthenticated(false); setHasEnteredApp(false); }}
        onFullSync={async () => {
          try {
            const res = await fetch(`${API_BASE_URL}/api/full-sync?t=${Date.now()}`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                restaurants, shops, beauty, services, autoRepairs, autoElectronics, usedMarket, animals,
                realEstate, gyms, stands, offices, itServices, perfumes, bars, events, municipal,
                activities, flights, hotels, cars, busSchedules, posts, users, marketplaceAds
              }),
            });
            if (res.ok) alert('✅ Sincronização TOTAL concluída com sucesso!');
            else alert('❌ Erro na sincronização: ' + res.statusText);
          } catch (error) {
            alert('❌ Falha na ligação ao servidor para sincronização.');
          }
        }}
        language={language}
        users={users}
        onUpdateUsers={async (updatedUsers) => {
           setUsers(updatedUsers);
           try {
             await fetch(`${API_BASE_URL}/api/users/bulk`, {
               method: 'POST',
               headers: { 'Content-Type': 'application/json' },
               body: JSON.stringify(updatedUsers)
             });
           } catch(e) {}
        }}
      />
    );
  }



  // --- SUPPLIER VIEW ---
  if (isSupplier && currentBusinessId) {
    const currentBusiness = (restaurants || []).find(r => r.id === currentBusinessId);
    if (currentBusiness) {
      return (
        <ErrorBoundary>
          <SupplierDashboard 
            allRestaurants={restaurants}
            supplierEmail={userProfile.email}
            language={language}
            onLogout={handleLogout}
            onUpdateRestaurants={async (updatedList) => {
               setRestaurants(updatedList);
               // Sincronizar no servidor
               try {
                 await fetch(`${API_BASE_URL}/api/restaurants/bulk`, {
                   method: 'POST',
                   headers: { 'Content-Type': 'application/json' },
                   body: JSON.stringify(updatedList),
                 });
               } catch (e) { console.error(e); }
            }}
            onUpdateRestaurant={async (updated) => {
              setRestaurants(prev => prev.map(r => r.id === updated.id ? updated : r));
              try {
                await fetch(`${API_BASE_URL}/api/restaurants/${updated.id}`, {
                  method: 'PUT',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(updated),
                });
              } catch (error) {
                console.error("Erro na sincronização do fornecedor:", error);
              }
            }}
          />
        </ErrorBoundary>
      );
    }
  }

  // --- BUSINESS / STAFF VIEW ---
  if ((isBusiness || isStaff) && currentBusinessId) {
    // Procurar o negócio nos estados sincronizados com o servidor
    const targetId = currentBusinessId.trim();
    let biz = [...restaurants, ...shops, ...beauty, ...hotels, ...services, ...offices, ...cars].find(b => b.id === targetId);
    
    // Fallback: Se não encontrou no estado (sincronização pendente), apenas retornar erro amigável
    if (!biz) {
      // O estado é sincronizado periodicamente, se não está aqui, o ID pode ser inválido
      biz = null;
    }

    if (biz) {
      const isBeautyBiz = beauty.some(b => b.id === targetId) || targetId.startsWith('BEA') || (biz.businessType && biz.businessType.toLowerCase() === 'beauty') || (biz.email && biz.email.toLowerCase().includes('marcom'));
      if (isBeautyBiz) {
        biz.businessType = 'beauty';
      }
      const bType = (biz.businessType || (biz as any).type || (biz.id.startsWith('BEA') ? 'beauty' : 'restaurant')).toLowerCase();
      const isBeauty = isBeautyBiz || bType === 'beauty' || bType === 'beauties';
      const isShop = bType === 'shop' || bType === 'shops';
      const isHotel = bType === 'hotel' || bType === 'al' || bType === 'accommodation';
      const isRentCar = bType === 'rentcar' || bType === 'car' || bType === 'rent-a-car' || targetId.startsWith('RC') || targetId.startsWith('CAR');
      
      const bEndpoint = isBeauty ? 'beauty' : (isShop ? 'shops' : (isHotel ? 'hotels' : (isRentCar ? 'cars' : 'restaurants')));

      if (isBeauty && biz.subcategory === 'barber') {
        if (biz.softwareVersion === 'pro') {
          return (
            <ErrorBoundary>
              <BarberProDashboard 
                business={biz}
                onLogout={() => {
                  handleLogout();
                  setShowBarberLogin(true);
                }}
                onUpdateBusiness={async (updated) => {
                  setBeauty(prev => prev.map(item => item.id === updated.id ? updated : item));
                  try {
                    await fetch(`${API_BASE_URL}/api/beauty/${updated.id}`, {
                      method: 'PUT',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify(updated),
                    });
                  } catch (err) {
                    console.error("Erro ao atualizar barbearia no servidor:", err);
                  }
                }}
              />
            </ErrorBoundary>
          );
        } else {
          return (
            <ErrorBoundary>
              <BarberNormalDashboard 
                business={biz}
                onLogout={() => {
                  handleLogout();
                  setShowBarberLogin(true);
                }}
                onUpdateBusiness={async (updated) => {
                  setBeauty(prev => prev.map(item => item.id === updated.id ? updated : item));
                  try {
                    await fetch(`${API_BASE_URL}/api/beauty/${updated.id}`, {
                      method: 'PUT',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify(updated),
                    });
                  } catch (err) {
                    console.error("Erro ao atualizar barbearia no servidor:", err);
                  }
                }}
              />
            </ErrorBoundary>
          );
        }
      }

      if (isHotel) {
        return (
          <ErrorBoundary>
            <HotelDashboard 
              business={biz}
              language={language}
              onLogout={handleLogout}
              onUpdateBusiness={async (updated) => {
                 setHotels(prev => prev.map(item => item.id === updated.id ? updated : item));
                 try {
                   await fetch(`${API_BASE_URL}/api/hotels/${updated.id}`, {
                     method: 'PUT',
                     headers: { 'Content-Type': 'application/json' },
                     body: JSON.stringify(updated),
                   });
                 } catch (err) {
                   console.error("Erro ao atualizar hotel no servidor:", err);
                 }
              }}
            />
          </ErrorBoundary>
        );
      }

      if (isRentCar) {
        return (
          <ErrorBoundary>
            <RentCarDashboard 
              business={biz}
              language={language}
              onLogout={handleLogout}
              onUpdateBusiness={async (updated) => {
                 setCars(prev => prev.map(item => item.id === updated.id ? updated : item));
                 try {
                   await fetch(`${API_BASE_URL}/api/cars/${updated.id}`, {
                     method: 'PUT',
                     headers: { 'Content-Type': 'application/json' },
                     body: JSON.stringify(updated),
                   });
                 } catch (err) {
                   console.error("Erro ao atualizar Rent-a-car no servidor:", err);
                 }
              }}
            />
          </ErrorBoundary>
        );
      }

      return (
        <ErrorBoundary>
          <BusinessDashboard 
            isBeauty={isBeauty} // Forced prop pass!
            business={biz}
            language={language}
            isStaff={isStaff}
            staffRole={staffRole || undefined}
            staffEmail={userProfile?.email}
            onLogout={() => { 
              const isBarber = biz?.subcategory === 'barber' || biz?.subcategory === 'barbearia';
              setIsAuthenticated(false); 
              setIsBusiness(false); 
              setIsStaff(false);
              setStaffRole(null);
              setCurrentBusinessId(null); 
              if (isBarber) {
                setShowBarberLogin(true);
              }
            }}
            onSync={(updated) => {
               // Update local state dynamically
               const typeMap: Record<string, any> = {
                 'shop': setShops,
                 'beauty': setBeauty,
                 'service': setServices,
                 'hotel': setHotels,
                 'car': setCars,
                 'restaurant': setRestaurants
               };
               const setter = typeMap[bType] || setRestaurants;
               setter(prev => prev.map(item => item.id === updated.id ? updated : item));

               fetch(`${API_BASE_URL}/api/${bEndpoint}/${updated.id}`, {
                 method: 'PUT',
                 headers: { 'Content-Type': 'application/json' },
                 body: JSON.stringify(updated),
               }).then(r => {
                 if (r.ok) console.log(`✅ ${updated.id} sincronizado com sucesso.`);
               });
            }}
            onForceRefresh={() => {
              console.log(`🔄 Force refreshing dashboard data for category [${bEndpoint}] from server...`);
              fetchData(1, [bEndpoint]);
            }}
            onUpdateBusiness={async (updated) => {
              // Encontrar o endpoint correto usando o mapa central
              const isBeautyBiz = updated.id.startsWith('BEA') || (updated.email && updated.email.toLowerCase().includes('marcom')) || beauty.some(b => b.id === updated.id);
              if (isBeautyBiz) {
                updated.businessType = 'beauty';
              }
              const bType = (updated.businessType || (updated as any).type || (updated.id.startsWith('BEA') ? 'beauty' : 'restaurant')).toLowerCase();
              const endpoint = BUSINESS_TYPE_TO_ENDPOINT[bType] || 'restaurants';
              
              // Map de setters locais
              const setters: Record<string, any> = {
                'restaurants': setRestaurants,
                'hotels': setHotels,
                'cars': setCars,
                'beauty': setBeauty,
                'shops': setShops,
                'services': setServices,
                'offices': setOffices,
                'it_services': setItServices,
                'perfumes': setPerfumes,
                 'bars': setBars,
                 'events': setEvents,
                 'municipal': setMunicipal,
                'animals': setAnimals,
                'real_estate': setRealEstate,
                'gyms': setGyms,
                'stands': setStands,
                'auto_repairs': setAutoRepairs,
                'auto_electronics': setAutoElectronics,
                'used_market': setUsedMarket
              };
              
              const setter = setters[endpoint];
              if (setter) {
                setter((prev: any[]) => prev.map(item => item.id === updated.id ? updated : item));
              }

              // Desnormalizar caminhos (manter relativo no db.json)
              const cleanUrl = (url: string) => typeof url === 'string' ? url.replace(API_BASE_URL, '') : url;
              
              const denormalized = {
                ...updated,
                image: cleanUrl(updated.image),
                gallery: updated.gallery?.map((img: any) => cleanUrl(img)),
                menu: updated.menu?.map((item: any) => ({ ...item, image: cleanUrl(item.image) })),
                // LIMPAR FOTOS DOS QUARTOS / MESAS
                tables: updated.tables?.map((t: any) => ({
                  ...t,
                  images: t.images?.map((img: any) => cleanUrl(img))
                }))
              };

              try {
                await fetch(`${API_BASE_URL}/api/${endpoint}/${updated.id}`, {
                  method: 'PUT',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(denormalized),
                });
                console.log(`✅ Sincronização automática concluída para ${endpoint}`);
              } catch (error) {
                console.error("Erro na sincronização automática:", error);
              }
            }}
          />
        </ErrorBoundary>
      );
    } else {
      if (!isDataLoaded) {
        return (
          <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 p-8 text-center text-white">
            <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-6"></div>
            <p className="text-emerald-400 font-medium animate-pulse tracking-wider">A carregar POS local...</p>
          </div>
        );
      }
      // Fallback if business ID exists but data is missing in state
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-8 text-center">
          <div className="max-w-md bg-white p-12 rounded-[3rem] shadow-2xl border border-slate-100">
            <div className="w-20 h-20 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <AlertCircle size={40} />
            </div>
            <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tighter mb-4">Negócio não encontrado</h2>
            <p className="text-slate-500 font-medium mb-8 leading-relaxed">
              Não conseguimos carregar os dados do seu restaurante (ID: {currentBusinessId}). 
              Por favor, tente fazer login novamente ou contacte o suporte.
            </p>
            <button 
              onClick={() => { setIsAuthenticated(false); setIsBusiness(false); setCurrentBusinessId(null); }}
              className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all"
            >
              Voltar ao Início
            </button>
          </div>
        </div>
      );
    }
  }



  const handleReview = async (reviewData: any) => {
    // Immediately lock the button in the UI — prevents any double submissions
    setMyReservations(prev => prev.map(res =>
      res.id === reviewData.reservationId
        ? { ...res, reviewed: true, rating: reviewData.rating, reviewNote: reviewData.comment }
        : res
    ));

    try {
      await fetch(`${API_BASE_URL}/api/restaurants/${reviewData.restaurantId}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...reviewData,
          customerEmail: userProfile.email,
          customerName: userProfile.name || 'Cliente'
        })
      });
      // Do NOT call fetchData() here — it would create a race condition
      // where stale server data overrides our local reviewed:true update
    } catch (err) {
      console.error("Erro ao enviar avaliação:", err);
    }
  };


  return (
    <div className={`min-h-screen bg-slate-100 font-sans text-slate-800 pb-16 md:pb-0 ${showAuthModal || showPackageModal ? 'overflow-hidden h-screen' : ''}`}>
      
      {/* Desktop Global Header */}
      <div className="hidden lg:block relative z-[10000]">
        {!isAdmin && !isBusiness && !isStaff && !isSupplier && (
          <DesktopHeader 
            language={language}
            onNavigate={handleNavClick}
            onShowAuth={() => setShowAuthModal(true)}
            onShowFavorites={() => setShowFavoritesModal(true)}
            onShowProfile={() => setShowProfileModal(true)}
            onOpenIslandSelection={() => setShowIslandSelection(true)}
            isAuthenticated={isAuthenticated}
            userProfile={userProfile}
            scrolled={scrolled}
            onShowBarberLogin={() => setShowBarberLogin(true)}
          />
        )}
      </div>
      {/* Navigation - CABEÇALHO FIXO PREMIUM */}
      {exploreCategory !== 'community' && (
        <nav className={`lg:hidden bg-white/80 backdrop-blur-lg fixed top-0 left-0 right-0 z-[100] shadow-sm border-b border-slate-100 ${showAuthModal || showPackageModal ? 'blur-sm' : ''}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 relative">
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center cursor-pointer" onClick={goHome}>
              <img src="/pngletras.png" alt="Logo" className="h-[250%] max-h-none w-auto object-contain" />
            </div>
            
            <div className="hidden md:flex items-center space-x-6">
               <button onClick={goHome} className={`text-sm font-bold ${exploreCategory === null ? 'text-blue-600' : 'text-slate-500'}`}>{getTranslation(language, 'nav_home')}</button>
               {navCategories.slice(0, 4).map(cat => (
                 <button 
                  key={cat.id}
                  onClick={() => handleNavClick(cat.id)} 
                  className={`font-bold text-sm transition-colors ${
                    exploreCategory === cat.id ? 'text-blue-600' : 'text-slate-500 hover:text-slate-800'
                  }`}
                 >
                   {cat.label}
                 </button>
               ))}
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-3 relative">
                {isAuthenticated ? (
                  <>
                    <div className="flex items-center gap-2 bg-blue-50 px-3 py-1.5 rounded-full border border-blue-100">
                      <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center text-[10px] font-black text-white">C</div>
                      <span className="text-xs font-black text-blue-700 tracking-tight">{userCredits}</span>
                    </div>

                    <div 
                      className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-full cursor-pointer hover:bg-slate-200 transition-colors"
                      onClick={() => setShowProfileModal(true)}
                    >
                      <div className="w-6 h-6 rounded-full overflow-hidden border border-white shadow-sm">
                        <img src={userProfile.avatar} alt="Avatar" className="w-full h-full object-cover" />
                      </div>
                      <span className="text-sm font-bold text-slate-700">{getTranslation(language, 'traveler')}</span>
                    </div>
                  </>
                ) : (
                  <button onClick={() => setShowAuthModal(true)} className="text-sm font-bold text-blue-600">{getTranslation(language, 'login')}</button>
                )}
              </div>
              {/* Menu hamburger removido */}
            </div>
          </div>
        </div>

        {/* Mobile Menu - PREMIUM SIDE DRAWER */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <>
              {/* Backdrop Overlay */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setMobileMenuOpen(false)}
                className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[150] md:hidden"
              />
              
              {/* Sidebar Drawer */}
              <motion.div 
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 28, stiffness: 220 }}
                className="fixed top-0 right-0 h-full w-[80%] max-w-[320px] bg-white z-[160] flex flex-col md:hidden shadow-[-20px_0_60px_rgba(0,0,0,0.18)] border-l border-slate-100"
              >
                {/* Drawer Header */}
                <div className="px-6 py-5 flex items-center justify-between border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-slate-900 rounded-xl flex items-center justify-center text-white shadow-lg">
                      <LayoutDashboard size={18} />
                    </div>
                    <span className="font-black text-slate-800 uppercase tracking-tighter text-base">Menu</span>
                  </div>
                  <button 
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-full transition-all active:scale-90"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* User Card */}
                <div className="px-5 pt-5 pb-3">
                  {isAuthenticated ? (
                    <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-600 to-blue-500 rounded-2xl text-white shadow-lg shadow-blue-600/20">
                      <div className="w-11 h-11 rounded-xl overflow-hidden border-2 border-white/30 shadow-md flex-shrink-0">
                        <img src={userProfile?.avatar} alt="Avatar" className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] font-black uppercase tracking-widest text-white/70">Bem-vindo</p>
                        <p className="text-sm font-black text-white truncate">{userProfile?.name?.split(' ')[0] || 'Utilizador'}</p>
                        <p className="text-[10px] font-bold text-white/60">{userCredits} créditos</p>
                      </div>
                      <button 
                        onClick={() => { setShowProfileModal(true); setMobileMenuOpen(false); }}
                        className="p-2 bg-white/20 hover:bg-white/30 rounded-xl transition-all active:scale-90"
                      >
                        <ArrowRight size={16} />
                      </button>
                    </div>
                  ) : (
                    <button 
                      onClick={() => { setShowAuthModal(true); setMobileMenuOpen(false); }}
                      className="flex items-center justify-between w-full p-4 bg-gradient-to-r from-blue-600 to-blue-500 rounded-2xl text-white shadow-lg shadow-blue-600/20 active:scale-95 transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                          <LogIn size={20} />
                        </div>
                        <div className="text-left">
                          <p className="text-[11px] font-black uppercase tracking-widest text-white/80">Entrar na Conta</p>
                          <p className="text-sm font-black text-white">Fazer Login</p>
                        </div>
                      </div>
                      <ArrowRight size={18} className="text-white/70" />
                    </button>
                  )}
                </div>

                <div className="flex-1 overflow-y-auto px-5 pb-6 space-y-3">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] px-2 pt-3 pb-1">Opções</p>

                  {/* Contactos */}
                  <button className="flex items-center justify-between w-full px-4 py-4 bg-slate-50 hover:bg-slate-100 border border-slate-100 rounded-2xl transition-all active:scale-95 group">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-green-100 text-green-600 rounded-xl">
                        <Phone size={18} />
                      </div>
                      <div className="text-left">
                        <span className="font-black text-slate-900 text-[12px] block">Contactos</span>
                        <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Fale connosco</span>
                      </div>
                    </div>
                    <ArrowRight size={16} className="text-slate-300 group-hover:text-slate-500 transition-colors" />
                  </button>

                  {/* Suporte */}
                  <button className="flex items-center justify-between w-full px-4 py-4 bg-slate-50 hover:bg-slate-100 border border-slate-100 rounded-2xl transition-all active:scale-95 group">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-slate-200 text-slate-600 rounded-xl">
                        <ShieldAlert size={18} />
                      </div>
                      <div className="text-left">
                        <span className="font-black text-slate-900 text-[12px] block">Suporte Técnico</span>
                        <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Ajuda e Segurança</span>
                      </div>
                    </div>
                    <ArrowRight size={16} className="text-slate-300 group-hover:text-slate-500 transition-colors" />
                  </button>

                  {/* Área do Barbeiro */}
                  <button 
                    onClick={() => { setShowBarberLogin(true); setMobileMenuOpen(false); }}
                    className="flex items-center justify-between w-full px-4 py-4 bg-amber-500/5 hover:bg-amber-500/10 border border-amber-500/25 rounded-2xl transition-all active:scale-95 group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-amber-500/20 text-[#D4AF37] rounded-xl">
                        <Scissors size={18} />
                      </div>
                      <div className="text-left">
                        <span className="font-black text-amber-500 text-[12px] block">Área do Barbeiro</span>
                        <span className="text-[9px] text-amber-500/60 font-bold uppercase tracking-widest">Acesso Profissional</span>
                      </div>
                    </div>
                    <ArrowRight size={16} className="text-[#D4AF37]/50 group-hover:text-[#D4AF37] transition-colors" />
                  </button>

                  {/* Logout */}
                  {isAuthenticated && (
                    <button 
                      onClick={() => { goBackToLanding(); setMobileMenuOpen(false); }} 
                      className="flex items-center gap-3 w-full px-4 py-4 mt-4 text-red-600 bg-red-50 hover:bg-red-100 border border-red-100 rounded-2xl transition-all active:scale-95"
                    >
                      <div className="p-2.5 bg-red-100 text-red-600 rounded-xl">
                        <LogOut size={18} />
                      </div>
                      <div className="text-left">
                        <span className="font-black text-red-700 text-[12px] block">Terminar Sessão</span>
                        <span className="text-[9px] text-red-400 font-bold uppercase tracking-widest">Sair da aplicação</span>
                      </div>
                    </button>
                  )}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </nav>
      )}

      <main className={`pb-32 lg:pb-0 pt-20 md:pt-24 pt-safe ${showAuthModal || showPackageModal || showBusIslandModal ? 'blur-sm pointer-events-none' : ''}`}>
        <AnimatePresence mode="wait">
        {exploreCategory === null ? (
          <motion.div 
            key="home"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="w-full"
          >
            <div className="lg:hidden max-w-4xl mx-auto">
              <HomeSection 
                language={language}
                restaurants={filterByIsland(restaurants)}
                onNavigate={handleNavClick}
                onOpenMenu={() => setMobileMenuOpen(true)}
                onShowNotifications={() => setShowNotificationsModal(true)}
                featuredIsland={selectedIslandName || "Todas as Ilhas"}
                onOpenIslandSelection={() => setShowIslandSelection(true)}
                onSearch={handleSearch}
              />
            </div>
            
            <DesktopView 
              language={language}
              onNavigate={handleNavClick}
              onShowAuth={() => setShowAuthModal(true)}
              onShowFavorites={() => setShowFavoritesModal(true)}
              onShowProfile={() => setShowProfileModal(true)}
              onOpenIslandSelection={() => setShowIslandSelection(true)}
              isAuthenticated={isAuthenticated}
              userProfile={userProfile}
              onSearch={handleSearch}
            />
          </motion.div>
        ) : (
          <motion.div 
            key="explore"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.3 }}
            className="pt-36 lg:pt-40"
          >
            {/* Always keep category bar at the top when content is active for easy switching */}
            <div className="px-4">
              <CategoryBar activeCategory={exploreCategory} onSelect={handleNavClick} language={language} />
            </div>
            
            <div className="min-h-[40vh] mt-4">
              {/* Promotional Slider for Featured Items - Contextual to category */}
              {(() => {
                let featuredItems: any[] = [];
                const topRating = 4.5;

                const allRestaurants = filterByIsland(restaurants);
                const allActivities = filterByIsland(activities);
                const allShops = filterByIsland(shops);
                const allBeauty = filterByIsland(beauty);
                const allServices = filterByIsland(services);
                const allAutoRepairs = filterByIsland(autoRepairs);
                const allAutoElectronics = filterByIsland(autoElectronics);
                const allUsedMarket = filterByIsland(usedMarket);
                const allAnimals = filterByIsland(animals);
                const allRealEstate = filterByIsland(realEstate);
                const allGyms = filterByIsland(gyms);
                const allStands = filterByIsland(stands);
                const allOffices = filterByIsland(offices);
                const allITServices = filterByIsland(itServices);
                const allPerfumes = filterByIsland(perfumes);
                const allBars = filterByIsland(bars);
                const allEvents = filterByIsland(events);
                const allMunicipal = filterByIsland(municipal);

                const sortFeatured = (items: any[]) => {
                  if (!isNearbyFilter || !userCoords) return items;
                  return [...items].map(item => {
                    const business = [...allRestaurants, ...allActivities, ...allShops, ...allBeauty, ...allServices, ...allAutoRepairs, ...allAutoElectronics, ...allUsedMarket, ...allAnimals, ...allRealEstate, ...allGyms, ...allStands, ...allOffices, ...allITServices, ...allPerfumes, ...allBars, ...allEvents, ...allMunicipal].find(b => b.id === item.id);
                    const distance = (business?.latitude && business?.longitude) 
                      ? getDistance(userCoords[0], userCoords[1], parseFloat(business.latitude), parseFloat(business.longitude))
                      : 999999;
                    return { ...item, distance };
                  }).sort((a, b) => (a.distance || 0) - (b.distance || 0));
                };

                switch (exploreCategory) {
                  case 'restaurants':
                    featuredItems = sortFeatured((allRestaurants || []).filter(r => r.rating >= topRating).slice(0, 10).map(r => ({ id: r.id, title: r.name, image: r.image, rating: r.rating, location: r.island, category: 'Restaurante' })));
                    break;
                  case 'beauty':
                    featuredItems = sortFeatured((allBeauty || []).slice(0, 10).map(b => ({ id: b.id, title: b.name, image: b.image, rating: 4.9, location: b.island, category: 'Beleza', phone: b.phone || '+351 296 000 000', buttonLabel: 'Ligue Já' })));
                    break;
                  case 'shops':
                    featuredItems = sortFeatured((allShops || []).slice(0, 10).map(s => ({ id: s.id, title: s.name, image: s.image, rating: 4.8, location: s.island, category: 'Loja', phone: s.phone || '+351 296 000 000', buttonLabel: 'Ligue Já' })));
                    break;
                  case 'services':
                    featuredItems = sortFeatured((allServices || []).slice(0, 10).map(s => ({ id: s.id, title: s.name, image: s.image, rating: 4.7, location: s.island, category: 'Serviço', phone: s.phone || '+351 296 000 000', buttonLabel: 'Ligue Já' })));
                    break;
                  case 'auto_repair':
                    featuredItems = sortFeatured((allAutoRepairs || []).slice(0, 10).map(a => ({ id: a.id, title: a.name, image: a.image, rating: a.rating, location: a.island, category: 'Auto', phone: a.phone || '+351 296 000 000', buttonLabel: 'Ligue Já' })));
                    break;
                  case 'auto_electronics':
                    featuredItems = sortFeatured((allAutoElectronics || []).slice(0, 10).map(a => ({ id: a.id, title: a.name, image: a.image, rating: a.rating, location: a.island, category: 'Eletrónica', phone: a.phone || '+351 296 000 000', buttonLabel: 'Ligue Já' })));
                    break;
                  case 'used_market':
                    featuredItems = sortFeatured((allUsedMarket || []).slice(0, 10).map(u => ({ id: u.id, title: u.name, image: u.image, rating: u.rating, location: u.island, category: 'Usados', phone: u.phone || '+351 296 000 000', buttonLabel: 'Ligue Já' })));
                    break;
                  case 'animals':
                    featuredItems = sortFeatured((allAnimals || []).slice(0, 10).map(a => ({ id: a.id, title: a.name, image: a.image, rating: a.rating, location: a.island, category: 'Animais', phone: a.phone, buttonLabel: 'Ligue Já' })));
                    break;
                  case 'real_estate':
                    featuredItems = sortFeatured((allRealEstate || []).slice(0, 10).map(r => ({ id: r.id, title: r.name, image: r.image, rating: r.rating, location: r.island, category: 'Imobiliária', phone: r.phone, buttonLabel: 'Ligar' })));
                    break;
                  case 'gyms':
                    featuredItems = sortFeatured((allGyms || []).slice(0, 10).map(g => ({ id: g.id, title: g.name, image: g.image, rating: g.rating, location: g.island, category: 'Ginásio', phone: g.phone, buttonLabel: 'Ligar' })));
                    break;
                  case 'stands':
                    featuredItems = sortFeatured((allStands || []).slice(0, 10).map(s => ({ id: s.id, title: s.name, image: s.image, rating: s.rating, location: s.island, category: 'Stand', phone: s.phone, buttonLabel: 'Ligar' })));
                    break;
                  case 'offices':
                    featuredItems = sortFeatured((allOffices || []).slice(0, 10).map(o => ({ id: o.id, title: o.name, image: o.image, rating: o.rating, location: o.island, category: 'Escritório', phone: o.phone, buttonLabel: 'Ligar' })));
                    break;
                  case 'it_services':
                    featuredItems = sortFeatured((allITServices || []).slice(0, 10).map(i => ({ id: i.id, title: i.name, image: i.image, rating: i.rating, location: i.island, category: 'Informática', phone: i.phone, buttonLabel: 'Ligar' })));
                    break;
                  case 'perfumes':
                    featuredItems = sortFeatured((allPerfumes || []).slice(0, 10).map(p => ({ id: p.id, title: p.name, image: p.image, rating: p.rating, location: p.island, category: 'Perfume', phone: p.phone, buttonLabel: 'Ligar' })));
                    break;
                  case 'bars':
                    featuredItems = sortFeatured((allBars || []).slice(0, 10).map(b => ({ id: b.id, title: b.name, image: b.image, rating: b.rating, location: b.island, category: 'Bar/Noite', phone: b.phone, buttonLabel: 'Ligar' })));
                    break;
                  case 'events':
                    featuredItems = sortFeatured((allEvents || []).slice(0, 10).map(e => ({ id: e.id, title: e.name, image: e.image, rating: e.rating, location: e.island, category: 'Evento', phone: e.phone, buttonLabel: 'Ligar' })));
                    break;
                  case 'municipal':
                    featuredItems = sortFeatured((allMunicipal || []).slice(0, 10).map(m => ({ id: m.id, title: m.name, image: m.image, rating: m.rating, location: m.island, category: 'Serviço Municipal', phone: m.phone, buttonLabel: 'Ligar' })));
                    break;
                  case 'trails':
                  case 'landscapes':
                  case 'activities':
                  case 'poi':
                  case 'culture':
                    const types = exploreCategory === 'trails' ? ['trail'] : 
                                 exploreCategory === 'landscapes' ? ['landscape'] : 
                                 exploreCategory === 'culture' ? ['culture'] :
                                 exploreCategory === 'poi' ? ['poi', 'landscape'] : ['activity'];
                    featuredItems = sortFeatured((allActivities || []).filter(a => types.includes(a.type as any)).slice(0, 10).map(a => ({ 
                      id: a.id, 
                      title: a.title, 
                      image: a.image, 
                      rating: 5.0, 
                      location: a.island, 
                      category: a.type === 'trail' ? 'Trilho' : (a.type === 'poi' || a.type === 'landscape' ? 'Ponto/Paisagem' : 'Experiência'),
                      buttonLabel: a.type === 'trail' ? 'Ver Trilho' : 'Ver Mais'
                    })));
                    break;
                  default:
                    featuredItems = [];
                }

                if (featuredItems.length === 0) return null;
                return <MostRequestedSlider 
                  items={featuredItems} 
                  onAction={(item) => {
                    if (exploreCategory === 'trails' || exploreCategory === 'restaurants') {
                      setSelectedTrailId(item.id);
                    }
                  }}
                />;
              })()}

              <div className="animate-in fade-in slide-in-from-bottom-6 duration-500">
                {/* Specialized Views */}
                {exploreCategory === 'flights' && (
                  // Uses FlightBoard with DYNAMIC flights from App State
                  <FlightBoard airports={airports} flights={flights} onSelectFlight={handleFlightSelect} language={language} />
                )}

                {(exploreCategory === 'accommodation' || currentStep === 'checkout') && (
                  <BookingWizard 
                     step={currentStep === 'checkout' ? 'checkout' : 'accommodation'}
                     currentItinerary={itinerary}
                     onUpdateItinerary={updateItinerary}
                     onNext={() => { setCurrentStep('car'); setExploreCategory('rentcar'); }}
                     onSkip={() => { setCurrentStep('car'); setExploreCategory('rentcar'); }}
                     onClose={() => { setExploreCategory(null); setCurrentStep('flights'); }}
                     language={language}
                     isAuthenticated={isAuthenticated}
                     onShowAuth={() => setShowAuthModal(true)}
                     onComplete={handleFinalComplete}
                     onConfirm={persistItinerary}
                     // Dynamic Data
                     hotels={hotels}
                     cars={cars}
                     onShowMap={(url: string) => setShowMapUrl(url)}
                   />
                )}

                {exploreCategory === 'rentcar' && (
                  <CarRentalSection 
                     companies={cars as any}
                     currentItinerary={itinerary}
                     onUpdateItinerary={updateItinerary}
                     language={language}
                     onNext={() => { setCurrentStep('checkout'); setExploreCategory('accommodation'); }} 
                     onSkip={() => { setCurrentStep('checkout'); setExploreCategory('accommodation'); }}
                     onClose={() => { setExploreCategory(null); setCurrentStep('flights'); }}
                     isAuthenticated={isAuthenticated}
                     onShowAuth={() => setShowAuthModal(true)}
                   />
                )}

                {/* Show Summary if on final step of booking */}
                {exploreCategory === 'flights' && currentStep === 'summary' && (
                  <SummaryView 
                    itinerary={itinerary} 
                    onReset={() => {
                      setItinerary({ flight: null, hotel: null, nights: 3, car: null, carDays: 3 });
                      setCurrentStep('flights');
                      setExploreCategory(null);
                    }}
                    language={language}
                  />
                )}

                {/* Discovery Views */}
                {exploreCategory === 'community' && (
                  <CommunitySection 
                    isAuthenticated={isAuthenticated}
                    userName={userProfile.name}
                    posts={posts}
                    onSyncPosts={async () => {
                       const updated = await fetch(`${API_BASE_URL}/api/posts`).then(r => r.json());
                       setPosts(updated);
                    }}
                    onShowAuth={() => setShowAuthModal(true)}
                    onClose={() => setExploreCategory(null)}
                  />
                )}
                {exploreCategory === 'marketplace' && (
                  <MarketplaceSection 
                    isAuthenticated={isAuthenticated}
                    userProfile={userProfile}
                    ads={marketplaceAds}
                    categories={marketplaceCategories}
                    onUpdateAds={async (updated) => {
                       setMarketplaceAds(updated);
                       try {
                         const serverList = updated.map(ad => ad.status === 'localPending' ? { ...ad, status: 'pending' } : ad);
                         await fetch(`${API_BASE_URL}/api/marketplace_ads/bulk`, {
                           method: 'POST',
                           headers: { 'Content-Type': 'application/json' },
                           body: JSON.stringify(serverList)
                         });
                         console.log("✅ Marketplace ads synchronized");
                       } catch (e) {
                         console.error("Failed to sync marketplace ads:", e);
                         throw e;
                       }
                    }}
                    onStartChat={(ad) => {
                      setDirectAdStart(ad);
                      setShowChatModal(true);
                    }}
                    onShowAuth={() => setShowAuthModal(true)}
                    onClose={() => setExploreCategory(null)}
                    favoriteAdIds={favoriteAdIds}
                    onToggleFavoriteAd={(id) => {
                      if (!isAuthenticated) {
                        setShowAuthModal(true);
                        return;
                      }
                      setFavoriteAdIds(prev => {
                        const next = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id];
                        localStorage.setItem('favorite_ad_ids', JSON.stringify(next));
                        return next;
                      });
                    }}
                    showMarketplaceFavorites={showMarketplaceFavorites}
                    onCloseMarketplaceFavorites={() => setShowMarketplaceFavorites(false)}
                  />
                )}
                {!['flights', 'accommodation', 'rentcar', 'community', 'marketplace'].includes(exploreCategory as string) && (
                  <ExploreSection 
                    category={exploreCategory} 
                    destinationIsland={destinationIsland} 
                    currentLanguage={language}
                    isAuthenticated={isAuthenticated}
                    onShowAuth={() => setShowAuthModal(true)}
                    initialSearchQuery={globalSearchQuery}
                    selectedItemId={selectedTrailId}
                    onSelectedItemIdHandled={() => setSelectedTrailId(null)}
                    // PASSING DYNAMIC DATA (Filtered)
                    restaurants={filterByIsland(restaurants)}
                    activities={filterByIsland(activities)}
                    busSchedules={busSchedules}
                    shops={filterByIsland(shops)}
                    beauty={filterByIsland(beauty)}
                    services={filterByIsland(services)}
                    autoRepairs={filterByIsland(autoRepairs)}
                    autoElectronics={filterByIsland(autoElectronics)}
                    usedMarket={filterByIsland(usedMarket)}
                    animals={filterByIsland(animals)}
                    realEstate={filterByIsland(realEstate)}
                    gyms={filterByIsland(gyms)}
                    stands={filterByIsland(stands)}
                    offices={filterByIsland(offices)}
                    itServices={filterByIsland(itServices)}
                    perfumes={filterByIsland(perfumes)}
                    bars={filterByIsland(bars)}
                    events={filterByIsland(events)}
                    municipal={filterByIsland(municipal)}
                    userCredits={userCredits}
                    setUserCredits={setUserCredits}
                    favoriteRestaurantIds={favoriteRestaurantIds}
                    onToggleFavorite={toggleFavoriteRestaurant}
                    userProfile={userProfile}
                    onReserveSuccess={async (resData, itemName, itemId) => {
                      try {
                        console.log("Iniciando onReserveSuccess para:", itemName);
                        // Determine type dynamically
                        const business = (restaurants || []).find(r => r.id === itemId) || 
                                       (shops || []).find(s => s.id === itemId) || 
                                       (beauty || []).find(b => b.id === itemId) ||
                                       (activities || []).find(a => a.id === itemId);
                        
                        const type = resData?.type || (business as any)?.businessType || (business as any)?.type || 'restaurant';

                        const newReservation = { 
                          ...resData,
                          type,
                          restaurantName: itemName, 
                          restaurantId: itemId,
                          status: 'pending' 
                        };

                        // Use a local copy to avoid stale state issues in the async call
                        let updatedReservationsList: any[] = [];
                        
                         setIsAuthenticated(true);
                         if (resData?.customerEmail && userProfile?.email !== resData.customerEmail) {
                           setUserProfile(prev => ({
                             ...prev,
                             email: resData.customerEmail,
                             name: resData.customerName || prev.name,
                             phone: resData.customerPhone || prev.phone
                           }));
                         }

                        // Add to personal reservations locally
                        setMyReservations(prev => {
                          updatedReservationsList = [...prev, newReservation];
                          return updatedReservationsList;
                        });

                        // PERSIST TO SERVER if user is logged in (ONLY for landscape bookings that don't use the dedicated business endpoint)
                        if (isAuthenticated && userProfile?.email && type === 'landscape') {
                          // Wait a tick to ensure updatedReservationsList is populated from the set state call
                          // or just use the current state + new one if we are sure it's up to date
                          // Safer: compute it here
                          const currentReservations = [...myReservations, newReservation];
                          
                          try {
                            await fetch(`${API_BASE_URL}/api/users/${userProfile.email}`, {
                              method: 'PUT',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ reservations: currentReservations })
                            });
                            console.log("✅ Reserva de Paisagem sincronizada com o servidor");
                          } catch (fetchErr) {
                            console.error("Erro ao persistir no servidor:", fetchErr);
                          }
                        }

                        // Update business state locally if applicable
                        const updateList = (prev: any[]) => (prev || []).map(b => {
                          if (b.id === itemId) {
                            return { ...b, reservations: [...(b.reservations || []), resData] };
                          }
                          return b;
                        });

                        if (restaurants.some(r => r.id === itemId)) setRestaurants(updateList);
                        else if (shops.some(s => s.id === itemId)) setShops(updateList);
                        else if (beauty.some(b => b.id === itemId)) setBeauty(updateList);
                        
                        // Sync with server to get latest global state
                        setTimeout(() => {
                           fetchData(1, ['restaurants', 'hotels', 'cars', 'beauty', 'shops', 'services']).catch(err => console.error("Error in fetchData after reservation:", err));
                        }, 500);
                      } catch (err) {
                        console.error("Critical error in onReserveSuccess:", err);
                      }
                    }}
                    onClose={() => setExploreCategory(null)}
                    onShowMap={(url: string) => setShowMapUrl(url)}
                    onShowInteractiveMap={(trailId: string) => {
                      // 1. Procurar chave de fallback estático
                      const idLower = trailId.toLowerCase().replace(/[^a-z0-9]/g, '_');
                      const keys = Object.keys(trilhosAcoresDados);
                      
                      let trailKey = keys.find(k => 
                        idLower.includes(k.toLowerCase()) || 
                        k.toLowerCase().includes(idLower) ||
                        (k.split('_')[0] && trailId.toUpperCase().includes(k.split('_')[0]))
                      );

                      if (!trailKey) {
                        const name = trailId.toLowerCase();
                        if (name.includes('furnas')) trailKey = keys.find(k => k.includes('furnas'));
                        else if (name.includes('fogo')) trailKey = keys.find(k => k.includes('fogo'));
                        else if (name.includes('sete cidades')) trailKey = keys.find(k => k.includes('sete_cidades'));
                        else if (name.includes('gorreana')) trailKey = keys.find(k => k.includes('gorreana'));
                      }

                      // 2. Procurar dados na Base de Dados
                      const realTrail = activities.find(a => a.id === trailId || a.title === trailId);
                      const staticTrail = trailKey ? trilhosAcoresDados[trailKey] : null;

                      // 3. Unir o melhor de dois mundos: Fotos/POI da DB + Rota/Geral do estático
                      if (realTrail || staticTrail) {
                        setSelectedTrailData({
                          climaSimulado: realTrail?.climaSimulado || staticTrail?.climaSimulado || { condicao: 'Céu Limpo', temperatura: 20 },
                          // Se a rota na DB estiver vazia, usamos a estática
                          rota: (realTrail?.rota && realTrail.rota.length > 0) ? realTrail.rota : (staticTrail?.rota || []),
                          // Se os POIs na DB estiverem vazios, usamos os estáticos
                          pontosInteresse: (realTrail?.pontosInteresse && realTrail.pontosInteresse.length > 0) ? realTrail.pontosInteresse : (staticTrail?.pontosInteresse || [])
                        });
                        setShowInteractiveMap(true);
                        return;
                      }

                      const query = `Trail ${trailId}, Azores`;
                      setShowMapUrl(`https://maps.google.com/maps?q=${encodeURIComponent(query)}&output=embed`);
                    }}
                  />
                )}
              </div>
            </div>
          </motion.div>
        )}
        </AnimatePresence>
      </main>

      {/* Global Map Overlay */}
      <AnimatePresence>
        {showMapUrl && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] bg-slate-900/60 backdrop-blur-md flex flex-col pt-20 pb-32"
          >
            <div className="flex-1 bg-white relative overflow-hidden flex flex-col">
              <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-white/80 backdrop-blur-md sticky top-0 z-10">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
                    <MapPin size={18} />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-800 uppercase tracking-tighter">Localização no Mapa</h3>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Google Maps Integrado</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowMapUrl(null)}
                  className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-full transition-all active:scale-90"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="flex-1 w-full h-full bg-slate-50">
                <iframe 
                  src={getGoogleMapsEmbedUrl(showMapUrl)}
                  className="w-full h-full border-none"
                  allowFullScreen
                  loading="lazy"
                  title="Google Maps"
                ></iframe>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Interactive Trail Map Overlay */}
      <AnimatePresence>
        {showInteractiveMap && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 z-[1000] bg-white"
          >
            {selectedTrailData && (
              <EcraMapa 
                dadosTrilho={selectedTrailData} 
                aoVoltar={() => setShowInteractiveMap(false)} 
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Persistent Trip Button (Mobile) */}
      <div className="lg:hidden">
        <BottomNav 
          onHome={goHome} 
          onMarketplace={() => setExploreCategory('marketplace')} 
          onShowAuth={() => setShowAuthModal(true)}
          onShowFavorites={() => {
            if (exploreCategory === 'marketplace') {
              setShowMarketplaceFavorites(true);
            } else {
              setShowFavoritesModal(true);
            }
          }}
          onShowProfile={() => setShowProfileModal(true)}
          onShowReservations={() => setShowMyReservationsModal(true)}
          onShowNotifications={() => {
            if (exploreCategory === 'marketplace') {
              setShowChatModal(true);
            } else {
              setShowNotificationsModal(true);
            }
          }}
          notificationCount={
            exploreCategory === 'marketplace' 
              ? marketplaceChats.filter(msg => msg.receiverEmail === userProfile?.email && !msg.read).length
              : notifications.filter(n => !n.read).length
          }
          itemCount={itineraryItemCount} 
          language={language} 
          isAuthenticated={isAuthenticated}
          isCommunity={exploreCategory === 'community'}
          isMarketplace={exploreCategory === 'marketplace'}
        />
      </div>

      {/* Modals */}
      <AuthModal isOpen={showAuthModal} onClose={() => { setShowAuthModal(false); setPendingFlight(null); }} onSuccess={(isAdmin, bizId, email, role, name, phone, password) => handleAuthSuccess(isAdmin, bizId, email, role, name, phone, password)} language={language} restaurants={restaurants} shops={shops} beauty={beauty} cars={cars} hotels={hotels} />
      <PackagePreviewModal isOpen={showPackageModal} onClose={() => setShowPackageModal(false)} itinerary={itinerary} onContinue={handleContinueFromPackage} language={language} />
      <IslandSelectionModal 
        isOpen={showBusIslandModal || showIslandSelection} 
        onClose={() => { setShowBusIslandModal(false); setShowIslandSelection(false); }} 
        onSelect={(code) => {
          setPublicIslandFilter(code);
          setShowBusIslandModal(false);
          setShowIslandSelection(false);
          if (showBusIslandModal) setExploreCategory('buses');
        }} 
        language={language} 
      />
      <ProfileModal 
        isOpen={showProfileModal} 
        onClose={() => setShowProfileModal(false)} 
        language={language} 
        userCredits={userCredits}
        userProfile={userProfile}
        onUpdateProfile={async (update) => {
           setUserProfile({
             name: update.name,
             email: update.email,
             phone: update.phone,
             avatar: update.avatar,
             nif: update.nif
           });
           try {
             await fetch(`${API_BASE_URL}/api/users/${update.email}`, {
               method: 'PUT',
               headers: { 'Content-Type': 'application/json' },
               body: JSON.stringify({
                 email: update.email,
                 phone: update.phone,
                 name: update.name,
                 profile: {
                   name: update.name,
                   phone: update.phone,
                   avatar: update.avatar,
                   nif: update.nif
                 },
                 password: update.password
               })
             });
           } catch (e) {
             console.error("Failed to update profile:", e);
           }
        }}
        onShowReservations={() => {
          setReturnToProfile(true);
          setShowProfileModal(false);
          setReservationsInitialCategory(null);
          setShowMyReservationsModal(true);
        }}
        onShowMessages={() => {
          setReturnToProfile(true);
          setShowProfileModal(false);
          setReservationsInitialCategory('messages');
          setShowMyReservationsModal(true);
        }}
        onShowInvoices={() => {
          setReturnToProfile(true);
          setShowProfileModal(false);
          setShowInvoicesModal(true);
        }}
        onLogout={() => { setIsAuthenticated(false); setHasEnteredApp(false); }}
        onShowSOS={() => setShowSOSModal(true)}
        onShowCommunity={() => {
           setExploreCategory('community');
           setShowProfileModal(false);
           setHasEnteredApp(true);
        }}
      />

      <InvoicesModal
        isOpen={showInvoicesModal}
        onClose={() => {
          setShowInvoicesModal(false);
          if (returnToProfile) {
            setShowProfileModal(true);
            setReturnToProfile(false);
          }
        }}
        reservations={myReservations}
        restaurants={restaurants}
        beauty={beauty}
        userProfile={userProfile}
        language={language}
      />

      <MyReservationsModal 
        isOpen={showMyReservationsModal}
        onClose={() => {
          setShowMyReservationsModal(false);
          setReservationsInitialCategory(null);
          if (returnToProfile) {
            setShowProfileModal(true);
            setReturnToProfile(false);
          }
        }}
        reservations={myReservations}
        initialCategory={reservationsInitialCategory}
        restaurants={restaurants}
        onCheckIn={handleCheckIn}
        onCheckOut={handleCheckOut}
        onTableAction={handleTableAction}
        itinerary={itinerary}
        onAddItems={(res) => {
          setShowMyReservationsModal(false);
          setTableMenuRes(res);
        }}
        onReview={handleReview}
        language={language}
      />
       {tableMenuRes && (restaurants.find(r => r.id === tableMenuRes.restaurantId) || restaurants.find(r => r.id === tableMenuRes.businessId)) && (
         <TableMenuModal
            isOpen={!!tableMenuRes}
            onClose={() => { setTableMenuRes(null); setShowMyReservationsModal(true); }}
            restaurant={restaurants.find(r => r.id === tableMenuRes.restaurantId) || restaurants.find(r => r.id === tableMenuRes.businessId)!}
            tableId={tableMenuRes.tableId || ''}
            tableStatus={(restaurants.find(r => r.id === tableMenuRes.restaurantId) || restaurants.find(r => r.id === tableMenuRes.businessId))?.tables?.find(t => t.id === tableMenuRes.tableId)?.status || 'available'}
            reservationId={tableMenuRes.id}
            onPlaceOrder={handlePlaceTableOrder}
         />
       )}
      <QRScannerModal 
        isOpen={showQRScanner} 
        onClose={() => setShowQRScanner(false)} 
        onScan={(data) => {
           console.log("QR Scanned:", data);
           setShowQRScanner(false);
        }}
      />

      <FavoritesModal
        isOpen={showFavoritesModal}
        onClose={() => setShowFavoritesModal(false)}
        favoriteRestaurantIds={favoriteRestaurantIds}
        restaurants={restaurants}
        language={language}
        onShowMap={(url: string) => setShowMapUrl(url)}
      />
      <NotificationsModal 
        isOpen={showNotificationsModal} 
        onClose={() => setShowNotificationsModal(false)} 
        notifications={notifications}
        onMarkAsRead={(id) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))}
        onClearAll={() => setNotifications([])}
        language={language}
      />
      <SOSModal 
        isOpen={showSOSModal} 
        onClose={() => setShowSOSModal(false)} 
        language={language} 
        onShowMap={(url: string) => setShowMapUrl(url)}
      />

      <ChatModal 
        isOpen={showChatModal}
        onClose={() => setShowChatModal(false)}
        currentUserProfile={isAuthenticated ? userProfile : null}
        chats={marketplaceChats}
        ads={marketplaceAds}
        onUpdateChats={async (newChats) => {
          setMarketplaceChats(newChats);
          try {
            await fetch(`${API_BASE_URL}/api/marketplace_chats/bulk`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(newChats)
            });
          } catch (err) {
            console.error("Failed to sync chats:", err);
          }
        }}
        directAdStart={directAdStart}
        onClearDirectAdStart={() => setDirectAdStart(null)}
        onShowAuth={() => setShowAuthModal(true)}
      />

      <AnimatePresence>
        {welcomePopupDetails && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 50 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="bg-white/95 backdrop-blur-xl border border-white/50 w-full max-w-md rounded-[3rem] p-8 shadow-2xl text-center relative overflow-hidden"
            >
              {/* Background Glows */}
              <div className="absolute -top-10 -left-10 w-40 h-40 bg-emerald-400/20 rounded-full blur-3xl z-0" />
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-400/20 rounded-full blur-3xl z-0" />

              <div className="relative z-10 space-y-6">
                {/* Visual Icon */}
                <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/30">
                  <UtensilsCrossed size={36} className="text-white" />
                </div>

                {/* Typography details */}
                <div className="space-y-2">
                  <p className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.25em]">Entrada Registada</p>
                  <h3 className="text-3xl font-black text-slate-900 tracking-tighter leading-none">
                    Bem-vindo!
                  </h3>
                  <p className="text-slate-500 text-xs font-black uppercase tracking-widest mt-1">
                    {welcomePopupDetails.restaurantName}
                  </p>
                </div>

                {/* Table card */}
                <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-[2rem] p-6 shadow-lg border border-slate-700/50">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Mesa Atribuída</span>
                  <p className="text-3xl font-black tracking-tight">{welcomePopupDetails.tableName}</p>
                </div>

                <p className="text-xs text-slate-500 font-bold leading-relaxed italic">
                  O staff foi notificado da sua chegada. Pode fazer novos pedidos e chamar a equipa diretamente do telemóvel!
                </p>

                {/* Action button */}
                <button
                  onClick={() => setWelcomePopupDetails(null)}
                  className="w-full py-5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-lg shadow-emerald-500/30 hover:scale-[1.02] active:scale-95 transition-all"
                >
                  Entrar na Mesa
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Desktop Global Footer */}
      <div className="hidden lg:block">
        {!isAdmin && !isBusiness && !isStaff && !isSupplier && <DesktopFooter />}
      </div>
    </div>
  );
};

export default App;
