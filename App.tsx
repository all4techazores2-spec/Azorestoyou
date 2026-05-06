// Azores4you - Main Application Entry - Build v1.0.1
import React, { useState, useEffect } from 'react';
import { BookingStep, ExploreCategory, Flight, Itinerary, Language, Restaurant, Activity, Hotel, Car, BusSchedule, KitchenOrder, OrderItem, Business } from './types';
import { getAirports, getFlights, COLORS, getRestaurants, getActivities, getHotels, getCars, BUS_SCHEDULES, getBeauty, getShops, getServices, getAutoRepairs, getAutoElectronics, getUsedMarket, getAnimals, getRealEstate, getGyms, getStands, getOffices, getITServices, getPerfumes } from './constants';
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
import MostRequestedSlider from './components/MostRequestedSlider';
import QRScannerModal from './components/QRScannerModal';
import TableMenuModal from './components/TableMenuModal';
import NotificationsModal, { AppNotification } from './components/NotificationsModal';
import CategoryBar, { getNavigationCategories } from './components/CategoryBar';
import IslandSearch from './components/IslandSearch';
import AdminDashboard from './components/AdminDashboard';
import BusinessDashboard from './components/BusinessDashboard';
import SupplierDashboard from './components/SupplierDashboard';
import AzoresLogo from './components/AzoresLogo';
import FavoritesModal from './components/FavoritesModal';
import CommunitySection from './components/CommunitySection';
import { Menu, X, User, LogOut, Compass, MapPin, Bell, AlertCircle, Phone, ShieldAlert } from 'lucide-react';
import SOSModal from './components/SOSModal';
import HomeSection from './components/HomeSection';
import { getTranslation } from './translations';
import { motion, AnimatePresence } from 'motion/react';

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

export const BUSINESS_TYPE_TO_ENDPOINT: Record<string, string> = {
  'restaurant': 'restaurants',
  'hotel': 'hotels',
  'al': 'hotels',
  'accommodation': 'hotels',
  'car': 'cars',
  'rentcar': 'cars',
  'beauty': 'beauty',
  'hair': 'beauty',
  'barber': 'beauty',
  'nails': 'beauty',
  'spa': 'beauty',
  'glow': 'beauty',
  'zen': 'beauty',
  'diva': 'beauty',
  'art': 'beauty',
  'shop': 'shops',
  'clothing': 'shops',
  'electronics': 'shops',
  'grocery': 'shops',
  'crafts': 'shops',
  'perfume': 'perfumes',
  'perfumes': 'perfumes',
  'service': 'services',
  'gardening': 'services',
  'architect': 'services',
  'engineer': 'services',
  'hvac': 'services',
  'office': 'offices',
  'cowork': 'offices',
  'it_services': 'it_services',
  'animal': 'animals',
  'animals': 'animals',
  'real_estate': 'real_estate',
  'gym': 'gyms',
  'gyms': 'gyms',
  'stand': 'stands',
  'stands': 'stands',
  'auto_repair': 'auto_repairs',
  'auto_repairs': 'auto_repairs',
  'auto_electronics': 'auto_electronics',
  'used_market': 'used_market'
};

const App: React.FC = () => {
  // App Settings
  const [language, setLanguage] = useState<Language>('pt');

  // Configuração de Domínios
  const OFFICIAL_DOMAIN = 'azorestoyou.pt';
  const RENDER_BACKEND = 'https://azorestoyou-1.onrender.com';
  
  const FRONTEND_URL = `https://${OFFICIAL_DOMAIN}`;

  // Detetar se estamos em localhost
  const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  
  // Em produção, apontamos sempre para o Render para garantir que o Cloudflare consiga ler os dados
  const API_BASE_URL = isLocal ? 'http://localhost:3001' : RENDER_BACKEND;

  const [restaurants, setRestaurants] = useState<Restaurant[]>(getRestaurants('pt'));
  const [activities, setActivities] = useState<Activity[]>(getActivities('pt'));
  const [flights, setFlights] = useState<Flight[]>(getFlights('pt'));
  const [hotels, setHotels] = useState<Hotel[]>(getHotels('pt'));
  const [cars, setCars] = useState<Car[]>(getCars('pt'));
  const [busSchedules, setBusSchedules] = useState<BusSchedule[]>(BUS_SCHEDULES);
  const [shops, setShops] = useState<Business[]>(getShops('pt'));
  const [beauty, setBeauty] = useState<Business[]>(getBeauty('pt'));
  const [services, setServices] = useState<Business[]>(getServices('pt'));
  const [autoRepairs, setAutoRepairs] = useState<Business[]>(getAutoRepairs('pt'));
  const [autoElectronics, setAutoElectronics] = useState<Business[]>(getAutoElectronics('pt'));
  const [usedMarket, setUsedMarket] = useState<Business[]>(getUsedMarket('pt'));
  const [animals, setAnimals] = useState<Business[]>(getAnimals('pt'));
  const [realEstate, setRealEstate] = useState<Business[]>(getRealEstate('pt'));
  const [gyms, setGyms] = useState<Business[]>(getGyms('pt'));
  const [stands, setStands] = useState<Business[]>(getStands('pt'));
  const [offices, setOffices] = useState<Business[]>(getOffices('pt'));
  const [itServices, setItServices] = useState<Business[]>(getITServices('pt'));
  const [perfumes, setPerfumes] = useState<Business[]>(getPerfumes('pt'));

  // Auth & User State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
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
    // Apenas carregar dados estáticos se os estados estiverem vazios (evita apagar dados do servidor)
    if (hotels.length <= 1) {
      const baseHotels = getHotels(language);
      const testHotel = { id: 'hotel-1', name: 'Azores Royal Garden', businessType: 'hotel', adminEmail: 'hotel@azores4you.com', reservations: [], image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop', rating: 4.8, island: 'São Miguel' } as any;
      if (!baseHotels.find(h => h.id === 'hotel-1')) {
        setHotels([testHotel, ...baseHotels]);
      } else {
        setHotels(baseHotels);
      }
    }

    if (cars.length <= 1) {
      const baseCars = getCars(language);
      const testCar = { id: 'rentcar-1', name: 'Auto Açores Rent', businessType: 'rentcar', adminEmail: 'rentcar@azores4you.com', reservations: [], image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=2070&auto=format&fit=crop', rating: 4.7, island: 'São Miguel' } as any;
      if (!baseCars.find(c => c.id === 'rentcar-1')) {
        setCars([testCar, ...baseCars]);
      } else {
        setCars(baseCars);
      }
    }

    if (activities.length === 0) setActivities(getActivities(language));
    if (flights.length === 0) setFlights(getFlights(language));
    if (busSchedules.length === 0) setBusSchedules(BUS_SCHEDULES);
    
    // Categorias secundárias
    setServices(getServices(language));
    setAutoRepairs(getAutoRepairs(language));
    setAutoElectronics(getAutoElectronics(language));
    setUsedMarket(getUsedMarket(language));
    setAnimals(getAnimals(language));
    setRealEstate(getRealEstate(language));
    setGyms(getGyms(language));
    setStands(getStands(language));
    setOffices(getOffices(language));
    setItServices(getITServices(language));
    setPerfumes(getPerfumes(language));
  }, [language]);


  // Modal State
  const [showPackageModal, setShowPackageModal] = useState(false);
  const [showBusIslandModal, setShowBusIslandModal] = useState(false);
  const [showFavoritesModal, setShowFavoritesModal] = useState(false);
  const [showMyReservationsModal, setShowMyReservationsModal] = useState(false);
  const [showQRScanner, setShowQRScanner] = useState(false);
  // Function to fetch data from Backend
  const fetchData = async () => {
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

      // 1. Restaurantes e categorias base
      const endpoints = [
        { key: 'restaurants', setter: setRestaurants },
        { key: 'hotels', setter: setHotels },
        { key: 'cars', setter: setCars },
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
        { key: 'perfumes', setter: setPerfumes }
      ];

      for (const endpoint of endpoints) {
        try {
          const resp = await fetch(`${API_BASE_URL}/api/${endpoint.key}`);
          if (resp.ok) {
            const raw = await resp.json();
            const latest = raw.map(normalizeBusiness);
            endpoint.setter(latest);
          }
        } catch (e) { console.error(`Erro ao carregar ${endpoint.key}:`, e); }
      }

      // 2. Utilizador (Sincronização de Reservas)
      if (isAuthenticated && !isAdmin && !isBusiness && userProfile.email) {
        const userResp = await fetch(`${API_BASE_URL}/api/users/${userProfile.email}`);
        if (userResp.ok) {
          const userData = await userResp.json();
          setUserCredits(userData.credits || 0);
          setMyReservations(userData.reservations || []);
          setIsDataLoaded(true);
        }
      }

      // 3. Outras Categorias (Hotéis, Carros, Atividades)
      const fetchAndSet = async (endpoint: string, setter: Function, fallback: any) => {
        try {
          const resp = await fetch(`${API_BASE_URL}/api/${endpoint}`);
          if (resp.ok) {
            const data = await resp.json();
            setter(data.map(normalizeBusiness));
          } else setter(fallback);
        } catch (e) { setter(fallback); }
      };

      await fetchAndSet('hotels', setHotels, getHotels(language));
      await fetchAndSet('cars', setCars, getCars(language));
      await fetchAndSet('activities', setActivities, getActivities(language));
      await fetchAndSet('bus-schedules', setBusSchedules, BUS_SCHEDULES);
      await fetchAndSet('flights', setFlights, getFlights(language));
    } catch (error) {
      console.error('Erro ao carregar dados do backend:', error);
    }
  };

  // Initial Load and Sync Polling
  useEffect(() => {
    fetchData();
    
    // Polling mais frequente (3 segundos) para feedback instantâneo durante testes
    const syncInterval = setInterval(() => {
      fetchData();
      console.log("🔄 Sincronização em tempo real executada...");
    }, 3000);
    return () => clearInterval(syncInterval);
  }, [API_BASE_URL, isAuthenticated, isAdmin, isBusiness, userProfile.email]);

  const [isDataLoaded, setIsDataLoaded] = useState(false);

  // 3. NAVIGATION & UI STATE
  const [hasEnteredApp, setHasEnteredApp] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [exploreCategory, setExploreCategory] = useState<ExploreCategory>(null);
  const [currentStep, setCurrentStep] = useState<BookingStep>('flights');
  const [publicIslandFilter, setPublicIslandFilter] = useState<string>('all');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [pendingFlight, setPendingFlight] = useState<Flight | null>(null);
  const [scannerConfig, setScannerConfig] = useState<{ type: 'checkin' | 'checkout', resId: string, restaurantId: string, tableId: string } | null>(null);
  const [tableMenuRes, setTableMenuRes] = useState<any | null>(null);
  const [showSOSModal, setShowSOSModal] = useState(false);
  const [returnToProfile, setReturnToProfile] = useState(false);
  const [showIslandSelection, setShowIslandSelection] = useState(false);

  // Helper to filter data by island
  const filterByIsland = <T extends { island?: string }>(items: T[]) => {
    if (publicIslandFilter === 'all' || !publicIslandFilter) return items;
    return items.filter(item => 
      item.island?.toLowerCase() === publicIslandFilter.toLowerCase() || 
      item.island === publicIslandFilter
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
      // 1. Notificação de Reserva Confirmada
      if (res.status === 'accepted' && !notifiedResIds.has(res.id)) {
        const title = "Reserva Confirmada!";
        const message = `O restaurante ${res.restaurantName} aceitou a sua reserva para ${res.date} às ${res.time}.`;
        
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

      // 2. Notificação de Mesa Atribuída (se já foi notificado da aceitação mas agora tem mesa)
      const tableNotifKey = `table_${res.id}`;
      if (res.status === 'accepted' && res.tableId && !notifiedResIds.has(tableNotifKey)) {
        const title = "Mesa Atribuída!";
        const message = `Já temos uma mesa pronta para si no ${res.restaurantName}: Mesa #${res.tableId.replace('T', '')}.`;
        
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
              },
              reservations: myReservations
              // REMOVIDO: notifications: notifications (Não sobrescrever notificações do servidor)
            }),
          });
          console.log("👤 Perfil do utilizador sincronizado (sem sobrescrever notificações)");
        } catch (err) {
          console.error("Erro na sincronização do utilizador:", err);
        }
      };

      // Debounce para não sobrecarregar o servidor
      const timer = setTimeout(syncUser, 2000);
      return () => clearTimeout(timer);
    }
  }, [userCredits, userProfile, myReservations, isAuthenticated, isAdmin, isBusiness]);

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

  const handleAuthSuccess = (isAdminUser: boolean = false, businessId?: string, email?: string, role?: string) => {
    setIsAuthenticated(true);
    setShowAuthModal(false);
    setMobileMenuOpen(false);
    
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
        .then(userData => {
          if (userData) {
            setUserProfile({
              email: userData.email,
              name: userData.name || 'Cliente Viajante',
              phone: userData.profile?.phone || '',
              avatar: userData.profile?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix'
            });
            setUserCredits(userData.credits || 0);
            setMyReservations(userData.reservations || []);
          }
        })
        .catch(err => console.error("Erro ao carregar dados do utilizador:", err));
    }
  };

  const handleCheckIn = async (resId: string, restaurantId: string, tableId: string) => {
    const confirmIn = window.confirm("Confirmar entrada no restaurante?");
    if (!confirmIn) return;

    // 1. Local Update
    setMyReservations(prev => prev.map(r => r.id === resId ? { ...r, status: 'occupied' } : r));
    
    console.log(`🛎️ Iniciando Check-in: Reserva=${resId}, Mesa=${tableId || 'sem mesa'}, Rest=${restaurantId}`);
    
    try {
      const rest = restaurants.find(r => r.id === restaurantId);

      if (rest) {
        // Has restaurant in state — update tables + reservations
        const resObj = rest.reservations?.find(r => r.id === resId);
        const updatedReservations = (rest.reservations || []).map(r =>
          r.id === resId ? { ...r, status: 'occupied' as const } : r
        );
        let updatedTables = rest.tables || [];
        if (tableId) {
          updatedTables = updatedTables.map(t => t.id === tableId ? {
            ...t,
            status: 'occupied' as const,
            customerName: resObj?.customerName,
            reservationTime: resObj?.time
          } : t);
        }
        const updatedKitchenOrders = (rest.kitchenOrders || []).map(order =>
          order.reservationId === resId ? { ...order, tableId: tableId || order.tableId } : order
        );
        const updatedRest = { ...rest, tables: updatedTables, reservations: updatedReservations, kitchenOrders: updatedKitchenOrders };
        setRestaurants(prev => prev.map(r => r.id === restaurantId ? updatedRest : r));

        await fetch(`${API_BASE_URL}/api/restaurants/${restaurantId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedRest),
        });
        console.log('✅ Restaurante atualizado no servidor');
      } else {
        // Restaurant not in local state — send minimal update directly
        console.warn('Restaurante não encontrado localmente, enviando update direto ao servidor');
      }

      // Always update user profile reservation status
      if (userProfile.email) {
        const userRes = await fetch(`${API_BASE_URL}/api/users/${userProfile.email}`);
        if (userRes.ok) {
          const userData = await userRes.json();
          if (userData?.reservations) {
            const updatedUserRes = userData.reservations.map((r: any) =>
              r.id === resId ? { ...r, status: 'occupied' } : r
            );
            await fetch(`${API_BASE_URL}/api/users/${userProfile.email}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ reservations: updatedUserRes }),
            });
          }
        }
      }

      alert('🛎️ Bem-vindo! Entrada registada com sucesso. O restaurante foi notificado.');
    } catch (err) {
      console.error('Erro no check-in:', err);
      // Still show success locally — server will sync on next poll
      alert('🛎️ Entrada registada localmente. Será sincronizada em breve.');
    }
  };

  const handleCheckOut = async (resId: string, restaurantId: string, tableId: string) => {
    const confirmOut = window.confirm("Confirmar saída do restaurante?");
    if (!confirmOut) return;

    const rest = restaurants.find(r => r.id === restaurantId);
    if (!rest) return;

    // Just mark as finished and free the table — credits come after payment confirmation by the restaurant
    setMyReservations(prev => prev.map(r => r.id === resId ? { ...r, status: 'finished' } : r));

    const updatedTables = rest.tables?.map(t => t.id === tableId ? { ...t, status: 'available' as const, customerName: undefined, reservationTime: undefined, currentTab: [] } : t);
    const updatedReservations = rest.reservations?.map(r => r.id === resId ? { ...r, status: 'finished' as const } : r);
    const updatedRest = { ...rest, tables: updatedTables, reservations: updatedReservations };
    setRestaurants(prev => prev.map(r => r.id === restaurantId ? updatedRest : r));

    try {
      await fetch(`${API_BASE_URL}/api/restaurants/${restaurantId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedRest),
      });
      alert('✅ Saída registada! Os créditos serão atribuídos após confirmação do pagamento pelo restaurante.');
    } catch (err) { console.error(err); }
  };

  const updateItinerary = (update: Partial<Itinerary>) => {
    setItinerary(prev => ({ ...prev, ...update }));
  };

  const handleNavClick = (category: ExploreCategory) => {
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

  const goHome = () => {
    setExploreCategory(null);
    setMobileMenuOpen(false);
  };

  const persistItinerary = async (ticketId?: string) => {
    if (!itinerary) return;

    // Use provided ticketId or generate a new one if missing
    const packageId = ticketId || `AZ-${Math.floor(Math.random() * 90000) + 10000}-${new Date().getFullYear()}`;
    const newReservations: any[] = [];
    
    console.log("💾 Persistindo pacote:", packageId, itinerary);

    if (itinerary.hotel) {
      newReservations.push({
        id: `RES_H_${Date.now()}`,
        packageId: packageId,
        type: itinerary.hotel.type, // 'hotel' or 'al'
        hotel: itinerary.hotel,
        selectedRoom: itinerary.selectedRoom ? {
          id: itinerary.selectedRoom.id,
          number: itinerary.selectedRoom.number || itinerary.selectedRoom.roomNumber || '?',
          type: itinerary.selectedRoom.type || 'Standard'
        } : null,
        date: itinerary.hotelStartDate || new Date().toISOString().split('T')[0],
        nights: itinerary.nights || 1,
        status: 'pending',
        selectedExtras: itinerary.selectedExtras || []
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
        status: 'pending'
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
            targetBizId = res.car?.id || 'rentcar-1';
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
  const handleTableAction = async (restaurantId: string, tableId: string, action: 'calling_waiter' | 'waiting_bill') => {
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
      alert(action === 'waiting_bill' ? '🧾 Pedido de conta enviado à equipa!' : '👨‍🍳 O Staff foi chamado à sua mesa.');
    } catch (err) { console.error(err); }
  };

   const handlePlaceTableOrder = async (items: OrderItem[]) => {
     if (!tableMenuRes || !tableMenuRes.restaurantId) return;
     const restId = tableMenuRes.restaurantId;
     const rest = restaurants.find(r => r.id === restId);
     if (!rest) return;

     // VALIDAR ESTADO DA MESA: Não permitir pedidos se a mesa estiver LIVRE
     const targetTable = rest.tables?.find(t => t.id === tableMenuRes.tableId);
     if (!targetTable || targetTable.status === 'available') {
        alert('❌ Erro: Não é possível fazer pedidos extras para uma mesa livre. A mesa deve estar ocupada ou reservada para si.');
        setTableMenuRes(null);
        return;
     }

     // 1. Criar Kitchen Order com status sent_to_kitchen para ser impresso/visto logo pela cozinha
     const newOrder: KitchenOrder = {
       id: `ORD_${Date.now()}`,
       tableId: tableMenuRes.tableId,
       reservationId: tableMenuRes.id,
       items,
       status: 'sent_to_kitchen',
       timestamp: new Date().toISOString()
     };

     // 2. Atualizar o currentTab da mesa
     const updatedTables = (rest.tables || []).map(t => {
        if (t.id === tableMenuRes.tableId) {
           return { 
             ...t, 
             currentTab: [...(t.currentTab || []), ...items],
             alertStatus: 'new_order' as const
           };
        }
        return t;
     });

     const updatedRest = {
       ...rest,
       kitchenOrders: [...(rest.kitchenOrders || []), newOrder],
       tables: updatedTables
     };

     setRestaurants(prev => prev.map(r => r.id === restId ? updatedRest : r));

     try {
       await fetch(`${API_BASE_URL}/api/restaurants/${restId}`, {
         method: 'PUT',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify(updatedRest),
       });
       alert('👨‍🍳 Pedido enviado para a cozinha e adicionado à sua conta!');
     } catch (err) { console.error(err); }
     setTableMenuRes(null);
  };

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
        activities={activities}
        flights={flights}
        hotels={hotels}
        cars={cars}
        busSchedules={busSchedules}
        // Updaters
        onUpdateRestaurants={async (updatedList) => {
          setRestaurants(updatedList);
          try {
            const res = await fetch(`${API_BASE_URL}/api/restaurants/bulk`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(updatedList),
            });
            if (res.ok) alert('✅ Restaurantes gravados com sucesso!');
          } catch (error) {}
        }}
        onUpdateShops={async (updatedList) => {
          setShops(updatedList);
          try {
            const res = await fetch(`${API_BASE_URL}/api/shops/bulk`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(updatedList),
            });
            if (res.ok) alert('✅ Lojas gravadas com sucesso!');
          } catch (error) {}
        }}
        onUpdateBeauty={async (updatedList) => {
          setBeauty(updatedList);
          try {
            const res = await fetch(`${API_BASE_URL}/api/beauty/bulk`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(updatedList),
            });
            if (res.ok) alert('✅ Serviços de Beleza gravados com sucesso!');
          } catch (error) {}
        }}
        onUpdateActivities={async (list) => {
          setActivities(list);
          await fetch(`${API_BASE_URL}/api/activities/bulk`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(list) });
        }}
        onUpdateFlights={async (list) => {
          setFlights(list);
          await fetch(`${API_BASE_URL}/api/flights/bulk`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(list) });
        }}
        onUpdateHotels={async (list) => {
          setHotels(list);
          await fetch(`${API_BASE_URL}/api/hotels/bulk`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(list) });
        }}
        onUpdateCars={async (list) => {
          setCars(list);
          await fetch(`${API_BASE_URL}/api/cars/bulk`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(list) });
        }}
        onUpdateBusSchedules={async (list) => {
          setBusSchedules(list);
          await fetch(`${API_BASE_URL}/api/busSchedules/bulk`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(list) });
        }}
        // Logic
        onLogout={() => { setIsAdmin(false); setIsAuthenticated(false); setHasEnteredApp(false); }}
        onFullSync={async () => {
          try {
            const res = await fetch(`${API_BASE_URL}/api/full-sync`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                restaurants,
                shops,
                beauty,
                activities,
                flights,
                hotels,
                cars,
                busSchedules
              }),
            });
            if (res.ok) alert('✅ Sincronização TOTAL concluída com sucesso!');
            else alert('❌ Erro na sincronização: ' + res.statusText);
          } catch (error) {
            alert('❌ Falha na ligação ao servidor para sincronização.');
          }
        }}
        language={language}
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
                 await fetch(`${API_BASE_URL}/api/sync-all`, {
                   method: 'POST',
                   headers: { 'Content-Type': 'application/json' },
                   body: JSON.stringify({ restaurants: updatedList }),
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
    let biz = [...restaurants, ...shops, ...beauty, ...hotels, ...services, ...offices].find(b => b.id === targetId);
    
    // Fallback: Se não encontrou no estado (sincronização pendente), procurar nas constantes estáticas
    if (!biz) {
      const allStatic = [...getRestaurants(language), ...getHotels(language), ...getShops(language), ...getBeauty(language), ...getServices(language)];
      biz = allStatic.find(b => b.id === targetId || b.id === 'hotel-1'); // Forçar hotel-1 se for o caso
    }

    if (biz) {
      const bType = (biz.businessType || (biz as any).type || 'restaurant').toLowerCase();
      const isBeauty = bType === 'beauty' || bType === 'beauties';
      const isShop = bType === 'shop' || bType === 'shops';
      const isHotel = bType === 'hotel' || bType === 'al' || bType === 'accommodation';
      const isRentCar = bType === 'rentcar' || bType === 'car' || bType === 'rent-a-car';
      
      const bEndpoint = isBeauty ? 'beauty' : (isShop ? 'shops' : (isHotel ? 'hotels' : (isRentCar ? 'cars' : 'restaurants')));

      return (
        <ErrorBoundary>
          <BusinessDashboard 
            business={biz}
            language={language}
            isStaff={isStaff}
            staffRole={staffRole || undefined}
            onLogout={() => { 
              setIsAuthenticated(false); 
              setIsBusiness(false); 
              setIsStaff(false);
              setStaffRole(null);
              setCurrentBusinessId(null); 
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
            onUpdateBusiness={async (updated) => {
              // Encontrar o endpoint correto usando o mapa central
              const endpoint = BUSINESS_TYPE_TO_ENDPOINT[updated.type] || 'restaurants';
              
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
      {/* Navigation - CABEÇALHO FIXO PREMIUM */}
      {exploreCategory !== 'community' && (
        <nav className={`bg-white/80 backdrop-blur-lg fixed top-0 left-0 right-0 z-[100] shadow-sm border-b border-slate-100 ${showAuthModal || showPackageModal ? 'blur-sm' : ''}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center cursor-pointer" onClick={goHome}>
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white shadow-sm mr-2 border border-slate-100 overflow-hidden">
                <AzoresLogo size={32} />
              </div>
              <span className="font-extrabold text-xl tracking-tight text-slate-800">
                Azores<span className="text-blue-600 font-black">Toyou</span>
              </span>
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
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-slate-600 md:hidden relative z-[110]">
                {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu - SLIDER DA DIREITA PARA A ESQUERDA COM BACKDROP */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <>
              {/* Backdrop Overlay */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setMobileMenuOpen(false)}
                className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] md:hidden"
              />
              
              {/* Sidebar Drawer */}
              <motion.div 
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="fixed top-0 right-0 h-full w-[80%] max-w-[320px] bg-white/95 backdrop-blur-md shadow-2xl z-[105] flex flex-col md:hidden pt-20"
              >
                <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
                  <button onClick={goHome} className="flex items-center gap-4 w-full p-4 bg-slate-50 rounded-2xl border border-slate-100 active:scale-95 transition-all">
                      <div className="p-2 rounded-xl bg-white shadow-sm text-slate-600"><Compass className="w-6 h-6" /></div>
                      <span className="font-black text-slate-800 uppercase tracking-tighter">{getTranslation(language, 'nav_home')}</span>
                  </button>
                  
                  <div className="grid grid-cols-1 gap-3 pt-2">
                    {navCategories.map(cat => (
                      <button 
                        key={cat.id} 
                        onClick={() => handleNavClick(cat.id)} 
                        className="flex items-center gap-4 w-full p-4 bg-white rounded-2xl shadow-sm border border-slate-50 active:scale-95 transition-all"
                      >
                        <div className="p-2 rounded-xl text-white shadow-md" style={{ backgroundColor: cat.color }}>{cat.icon}</div>
                        <span className="font-bold text-slate-700 tracking-tight">{cat.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-6 border-t border-slate-100 bg-slate-50/50">
                  {isAuthenticated ? (
                    <div className="space-y-4">
                      <div className="flex items-center gap-4 p-4 bg-white rounded-2xl shadow-sm border border-slate-100">
                        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-blue-100 shadow-sm">
                          <img src={userProfile.avatar} alt="Avatar" className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <p className="font-black text-slate-800 text-sm tracking-tighter">Olá, {userProfile.name.split(' ')[0]}</p>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <div className="w-3.5 h-3.5 bg-blue-600 rounded-full flex items-center justify-center text-[7px] font-black text-white">C</div>
                            <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">{userCredits} Créditos</span>
                          </div>
                        </div>
                      </div>
                      <button 
                        onClick={() => { setShowProfileModal(true); setMobileMenuOpen(false); }}
                        className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-blue-600/20 active:scale-95 transition-all"
                      >
                        Ver Perfil
                      </button>
                    </div>
                  ) : (
                    <button 
                      onClick={() => setShowAuthModal(true)}
                      className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest active:scale-95 transition-all"
                    >
                      Fazer Login
                    </button>
                  )}
                  
                  <button onClick={goBackToLanding} className="flex items-center justify-center gap-3 w-full mt-6 py-2 text-slate-400 font-bold text-xs hover:text-red-500 transition-colors uppercase tracking-widest">
                    <LogOut size={16} /> Terminar Sessão
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </nav>
      )}

      <main className={`pb-32 pt-20 md:pt-24 pt-safe ${showAuthModal || showPackageModal || showBusIslandModal ? 'blur-sm pointer-events-none' : ''}`}>
        <AnimatePresence mode="wait">
        {exploreCategory === null ? (
          <motion.div 
            key="home"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="max-w-4xl mx-auto"
          >
            <HomeSection 
              language={language}
              restaurants={filterByIsland(restaurants)}
              onNavigate={handleNavClick}
              onOpenMenu={() => setMobileMenuOpen(true)}
              onShowNotifications={() => setShowNotificationsModal(true)}
              featuredIsland={selectedIslandName || "Todas as Ilhas"}
              onOpenIslandSelection={() => setShowIslandSelection(true)}
            />
          </motion.div>
        ) : (
          <motion.div 
            key="explore"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.3 }}
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

                const allRestaurants = filterByIsland([...restaurants, ...getRestaurants(language).filter(r => !restaurants.find(br => br.id === r.id))]);
                const allActivities = filterByIsland([...activities, ...getActivities(language).filter(a => !activities.find(ba => ba.id === a.id))]);
                const allShops = filterByIsland([...shops, ...getShops(language).filter(s => !shops.find(bs => bs.id === s.id))]);
                const allBeauty = filterByIsland([...beauty, ...getBeauty(language).filter(b => !beauty.find(bb => bb.id === b.id))]);
                const allServices = filterByIsland([...services, ...getServices(language).filter(s => !services.find(bs => bs.id === s.id))]);
                const allAutoRepairs = filterByIsland([...autoRepairs, ...getAutoRepairs(language).filter(a => !autoRepairs.find(ba => ba.id === a.id))]);

                const allAutoElectronics = filterByIsland([...autoElectronics, ...getAutoElectronics(language).filter(a => !autoElectronics.find(ba => ba.id === a.id))]);
                const allUsedMarket = filterByIsland([...usedMarket, ...getUsedMarket(language).filter(u => !usedMarket.find(bu => bu.id === u.id))]);
                const allAnimals = filterByIsland([...animals, ...getAnimals(language).filter(a => !animals.find(ba => ba.id === a.id))]);
                const allRealEstate = filterByIsland([...realEstate, ...getRealEstate(language).filter(r => !realEstate.find(br => br.id === r.id))]);
                const allGyms = filterByIsland([...gyms, ...getGyms(language).filter(g => !gyms.find(bg => bg.id === g.id))]);
                const allStands = filterByIsland([...stands, ...getStands(language).filter(s => !stands.find(bs => bs.id === s.id))]);
                const allOffices = filterByIsland([...offices, ...getOffices(language).filter(o => !offices.find(bo => bo.id === o.id))]);
                const allITServices = filterByIsland([...itServices, ...getITServices(language).filter(i => !itServices.find(bi => bi.id === i.id))]);
                const allPerfumes = filterByIsland([...perfumes, ...getPerfumes(language).filter(p => !perfumes.find(bp => bp.id === p.id))]);

                const sortFeatured = (items: any[]) => {
                  if (!isNearbyFilter || !userCoords) return items;
                  return [...items].map(item => {
                    const business = [...allRestaurants, ...allActivities, ...allShops, ...allBeauty, ...allServices, ...allAutoRepairs, ...allAutoElectronics, ...allUsedMarket, ...allAnimals, ...allRealEstate, ...allGyms, ...allStands, ...allOffices, ...allITServices, ...allPerfumes].find(b => b.id === item.id);
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
                  case 'trails':
                  case 'landscapes':
                  case 'activities':
                  case 'poi':
                  case 'culture':
                    const aType = exploreCategory === 'trails' ? 'trail' : 
                                 exploreCategory === 'landscapes' ? 'landscape' : 
                                 exploreCategory === 'culture' ? 'culture' :
                                 exploreCategory === 'poi' ? 'poi' : 'activity';
                    featuredItems = sortFeatured((allActivities || []).filter(a => a.type === aType).slice(0, 10).map(a => ({ id: a.id, title: a.title, image: a.image, rating: 5.0, location: a.island, category: 'Experiência' })));
                    break;
                  default:
                    featuredItems = [];
                }

                if (featuredItems.length === 0) return null;
                return <MostRequestedSlider items={featuredItems} />;
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
                   />
                )}

                {exploreCategory === 'rentcar' && (
                  <CarRentalSection 
                     cars={cars}
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
                    onShowAuth={() => setShowAuthModal(true)}
                    onClose={() => setExploreCategory(null)}
                  />
                )}
                {!['flights', 'accommodation', 'rentcar', 'community'].includes(exploreCategory as string) && (
                  <ExploreSection 
                    category={exploreCategory} 
                    destinationIsland={destinationIsland} 
                    currentLanguage={language}
                    isAuthenticated={isAuthenticated}
                    onShowAuth={() => setShowAuthModal(true)}
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
                        
                        // Add to personal reservations locally
                        setMyReservations(prev => {
                          updatedReservationsList = [...prev, newReservation];
                          return updatedReservationsList;
                        });

                        // PERSIST TO SERVER if user is logged in
                        if (isAuthenticated && userProfile?.email) {
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
                           fetchData().catch(err => console.error("Error in fetchData after reservation:", err));
                        }, 500);
                      } catch (err) {
                        console.error("Critical error in onReserveSuccess:", err);
                      }
                    }}
                    onClose={() => setExploreCategory(null)}
                  />
                )}
              </div>
            </div>
          </motion.div>
        )}
        </AnimatePresence>
      </main>

      {/* Persistent Trip Button (Mobile) */}
      <BottomNav 
        onHome={goHome} 
        onViewPackage={handleViewPackage} 
        onShowAuth={() => setShowAuthModal(true)}
        onShowFavorites={() => setShowFavoritesModal(true)}
        onShowProfile={() => setShowProfileModal(true)}
        onShowReservations={() => setShowMyReservationsModal(true)}
        onShowNotifications={() => setShowNotificationsModal(true)}
        notificationCount={notifications.filter(n => !n.read).length}
        itemCount={itineraryItemCount} 
        language={language} 
        isAuthenticated={isAuthenticated}
        isCommunity={exploreCategory === 'community'}
      />

      {/* Modals */}
      <AuthModal isOpen={showAuthModal} onClose={() => { setShowAuthModal(false); setPendingFlight(null); }} onSuccess={handleAuthSuccess} language={language} restaurants={restaurants} shops={shops} beauty={beauty} />
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
        onUpdateProfile={(update) => {
           setUserProfile({
             name: update.name,
             email: update.email,
             phone: update.phone,
             avatar: update.avatar,
             nif: update.nif
           });
           // Password change would be handled by a dedicated API call here
        }}
        onShowReservations={() => {
          setReturnToProfile(true);
          setShowProfileModal(false);
          setShowMyReservationsModal(true);
        }}
        onLogout={() => { setIsAuthenticated(false); setHasEnteredApp(false); }}
        onShowSOS={() => setShowSOSModal(true)}
        onShowCommunity={() => {
           setExploreCategory('community');
           setShowProfileModal(false);
           setHasEnteredApp(true);
        }}
      />

      <MyReservationsModal 
        isOpen={showMyReservationsModal}
        onClose={() => {
          setShowMyReservationsModal(false);
          if (returnToProfile) {
            setShowProfileModal(true);
            setReturnToProfile(false);
          }
        }}
        reservations={myReservations}
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
       {tableMenuRes && restaurants.find(r => r.id === tableMenuRes.restaurantId) && (
         <TableMenuModal
            isOpen={!!tableMenuRes}
            onClose={() => { setTableMenuRes(null); setShowMyReservationsModal(true); }}
            restaurant={restaurants.find(r => r.id === tableMenuRes.restaurantId)!}
            tableId={tableMenuRes.tableId || ''}
            tableStatus={restaurants.find(r => r.id === tableMenuRes.restaurantId)?.tables?.find(t => t.id === tableMenuRes.tableId)?.status || 'available'}
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
      />
      <NotificationsModal 
        isOpen={showNotificationsModal} 
        onClose={() => setShowNotificationsModal(false)} 
        notifications={notifications}
        onMarkAsRead={(id) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))}
        onClearAll={() => setNotifications([])}
        language={language}
      />
    </div>
  );
};

export default App;
