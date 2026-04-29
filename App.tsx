// Azores4you - Main Application Entry
import React, { useState, useEffect } from 'react';
import { BookingStep, ExploreCategory, Flight, Itinerary, Language, Restaurant, Activity, Hotel, Car, BusSchedule, KitchenOrder, OrderItem, Business } from './types';
import { getAirports, getFlights, COLORS, getRestaurants, getActivities, getHotels, getCars, BUS_SCHEDULES, getBeauty, getShops } from './constants';
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
import { Menu, X, User, LogOut, Compass, MapPin, Bell, AlertCircle } from 'lucide-react';
import { getTranslation } from './translations';
// import { motion, AnimatePresence } from 'motion/react';

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

const App: React.FC = () => {
  // App Settings
  const [language, setLanguage] = useState<Language>('pt');

  // Detetar automaticamente se estamos em localhost ou no Render
  const API_BASE_URL = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
    ? 'http://localhost:3001'
    : 'https://azorestoyou-1.onrender.com'; 

  const [restaurants, setRestaurants] = useState<Restaurant[]>(getRestaurants('pt'));
  const [activities, setActivities] = useState<Activity[]>(getActivities('pt'));
  const [flights, setFlights] = useState<Flight[]>(getFlights('pt'));
  const [hotels, setHotels] = useState<Hotel[]>(getHotels('pt'));
  const [cars, setCars] = useState<Car[]>(getCars('pt'));
  const [busSchedules, setBusSchedules] = useState<BusSchedule[]>(BUS_SCHEDULES);
  const [shops, setShops] = useState<Business[]>(getShops('pt'));
  const [beauty, setBeauty] = useState<Business[]>(getBeauty('pt'));

  // Auth & User State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isBusiness, setIsBusiness] = useState(false);
  const [isStaff, setIsStaff] = useState(false);
  const [isSupplier, setIsSupplier] = useState(false);
  const [staffRole, setStaffRole] = useState<string | null>(null);
  const [currentBusinessId, setCurrentBusinessId] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState({
    email: '',
    name: 'Cliente Viajante',
    phone: '',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix'
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
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix'
    });
    setExploreCategory(null);
  };

  const [userCredits, setUserCredits] = useState(100);
  const [myReservations, setMyReservations] = useState<any[]>([]);


  // Initialize other static data on language change
  useEffect(() => {
    if (activities.length === 0) setActivities(getActivities(language));
    if (flights.length === 0) setFlights(getFlights(language));
    if (hotels.length === 0) setHotels(getHotels(language));
    if (cars.length === 0) setCars(getCars(language));
    if (busSchedules.length === 0) setBusSchedules(BUS_SCHEDULES);
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
      // 1. Restaurantes
      const response = await fetch(`${API_BASE_URL}/api/restaurants`);
      let latestRestaurants: Restaurant[] = [];
      if (response.ok) {
        latestRestaurants = await response.json();
        
        // Normalizar caminhos de imagens (se forem relativos /imagens, adicionar o backend URL)
        latestRestaurants = latestRestaurants.map(r => ({
          ...r,
          image: r.image?.startsWith('/imagens') ? `${API_BASE_URL}${r.image}` : r.image,
          gallery: r.gallery?.map(img => img.startsWith('/imagens') ? `${API_BASE_URL}${img}` : img),
          menu: r.menu?.map(item => ({
            ...item,
            image: item.image?.startsWith('/imagens') ? `${API_BASE_URL}${item.image}` : item.image
          }))
        }));

        setRestaurants(latestRestaurants);
      } else {
        // Fallback to constants if server is down but we need data to show
        setRestaurants(getRestaurants());
      }

      // 2. Utilizador (se logado)
      if (isAuthenticated && !isAdmin && !isBusiness && userProfile.email) {
        const userResp = await fetch(`${API_BASE_URL}/api/users/${userProfile.email}`);
        if (userResp.ok) {
          const userData = await userResp.json();
          setUserCredits(userData.credits || 0);
          
          // Sincronizar estados de reservas locais e DESCOBRIR novas reservas pelo e-mail
          let allUserReservations: any[] = userData.reservations || [];
          
          // Escanear todos os restaurantes para encontrar reservas com este e-mail que podem não estar no perfil
          latestRestaurants.forEach(rest => {
            if (rest.reservations) {
              rest.reservations.forEach(serverRes => {
                if (serverRes.customerEmail?.toLowerCase() === userProfile.email.toLowerCase()) {
                  // Verificar se já temos esta reserva (pelo ID)
                  const existingIdx = allUserReservations.findIndex(r => r.id === serverRes.id);
                  if (existingIdx === -1) {
                    allUserReservations.push({
                      id: serverRes.id,
                      restaurantId: rest.id,
                      restaurantName: rest.name,
                      date: serverRes.date,
                      time: serverRes.time,
                      guests: serverRes.guests,
                      status: serverRes.status,
                      preOrder: serverRes.preOrder,
                      tableId: serverRes.tableId
                    });
                  } else {
                    // Atualizar a reserva existente com os dados mais recentes do restaurante
                    allUserReservations[existingIdx] = {
                      ...allUserReservations[existingIdx],
                      status: serverRes.status,
                      tableId: serverRes.tableId,
                      restaurantName: rest.name // Garantir nome correto
                    };
                  }
                }
              });
            }
          });

          setMyReservations([...allUserReservations]);
          setIsDataLoaded(true);
          console.log(`✅ Sincronizadas ${allUserReservations.length} reservas para ${userProfile.email}`);
        }
      }

      // 3. Autocarros
      const busResp = await fetch(`${API_BASE_URL}/api/bus-schedules`);
      if (busResp.ok) {
        const busData = await busResp.json();
        setBusSchedules(busData);
      } else {
        setBusSchedules(BUS_SCHEDULES);
      }

      // 4. Atividades
      const actResp = await fetch(`${API_BASE_URL}/api/activities`);
      if (actResp.ok) setActivities(await actResp.json());
      else setActivities(getActivities(language));

      // 5. Voos
      const flightResp = await fetch(`${API_BASE_URL}/api/flights`);
      if (flightResp.ok) setFlights(await flightResp.json());
      else setFlights(getFlights(language));

      // 6. Hotéis
      const hotelResp = await fetch(`${API_BASE_URL}/api/hotels`);
      if (hotelResp.ok) setHotels(await hotelResp.json());
      else setHotels(getHotels(language));

      // 7. Lojas Regionais
      const shopsResp = await fetch(`${API_BASE_URL}/api/shops`);
      if (shopsResp.ok) {
        const shopsData = await shopsResp.json();
        setShops(shopsData.map((s: any) => ({
          ...s,
          businessType: 'shop',
          image: s.image?.startsWith('/imagens') ? `${API_BASE_URL}${s.image}` : s.image
        })));
      } else {
        setShops(getShops(language));
      }

      // 8. Serviços de Beleza
      const beautyResp = await fetch(`${API_BASE_URL}/api/beauty`);
      if (beautyResp.ok) {
        const beautyData = await beautyResp.json();
        setBeauty(beautyData.map((b: any) => ({
          ...b,
          businessType: 'beauty',
          image: b.image?.startsWith('/imagens') ? `${API_BASE_URL}${b.image}` : b.image
        })));
      } else {
        setBeauty(getBeauty(language));
      }

      // 9. Carros
      const carResp = await fetch(`${API_BASE_URL}/api/cars`);
      if (carResp.ok) setCars(await carResp.json());
      else setCars(getCars(language));
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
  const [returnToProfile, setReturnToProfile] = useState(false);

  // 4. ITINERARY STATE
  const [itinerary, setItinerary] = useState<Itinerary>({
    flight: null,
    hotel: null,
    nights: 3,
    car: null,
    carDays: 3
  });
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
  };

  const goBackToLanding = () => {
    setHasEnteredApp(false);
    setExploreCategory(null);
    setItinerary({ flight: null, hotel: null, nights: 3, car: null, carDays: 3 });
    setIsAuthenticated(false);
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
    
    // 1. Super Admin
    if (isAdminUser || email === 'adminadmin@gmail.com') {
      setIsAdmin(true);
      setHasEnteredApp(true);
      return;
    }

    // 2. Login de Staff, Dono ou Fornecedor
    if (businessId) {
      if (role === 'supplier') {
        setIsSupplier(true);
        setIsStaff(false);
        setIsBusiness(false);
      } else if (role) {
        setIsStaff(true);
        setStaffRole(role);
      } else {
        setIsBusiness(true);
      }
      setCurrentBusinessId(businessId);
      
      if (email) {
        setUserProfile(prev => ({ 
          ...prev, 
          email, 
          name: role === 'supplier' ? 'Fornecedor' : (role ? 'Staff' : 'Gestor') 
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
    
    // 2. Server Sync
    console.log(`🛎️ Iniciando Check-in para Mesa: ${tableId}, Restaurante: ${restaurantId}`);
    
    const rest = restaurants.find(r => r.id === restaurantId);
    if (rest) {
      const resObj = rest.reservations?.find(r => r.id === resId);
      const updatedTables = rest.tables?.map(t => t.id === tableId ? { 
        ...t, 
        status: 'occupied' as const,
        customerName: resObj?.customerName,
        reservationTime: resObj?.time
      } : t);
      const updatedReservations = rest.reservations?.map(r => r.id === resId ? { ...r, status: 'occupied' as const } : r);
      
      const updatedKitchenOrders = rest.kitchenOrders?.map(order => {
        if (order.reservationId === resId) return { ...order, tableId: tableId };
        return order;
      });

      const updatedRest = { ...rest, tables: updatedTables, reservations: updatedReservations, kitchenOrders: updatedKitchenOrders };
      setRestaurants(prev => prev.map(r => r.id === restaurantId ? updatedRest : r));
      
      try {
        console.log("📡 Atualizando restaurante no servidor...");
        const restResp = await fetch(`${API_BASE_URL}/api/restaurants/${restaurantId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedRest),
        });
        
        if (restResp.ok) {
          console.log("✅ Restaurante atualizado!");
        }

        // 3. Persistir mudança no Perfil do Utilizador
        const userRes = await fetch(`${API_BASE_URL}/api/users/${userProfile.email}`);
        const userData = await userRes.json();
        if (userData && userData.reservations) {
          const updatedUserRes = userData.reservations.map((r: any) => 
            r.id === resId ? { ...r, status: 'occupied' } : r
          );
          await fetch(`${API_BASE_URL}/api/users/${userProfile.email}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...userData, reservations: updatedUserRes }),
          });
        }
        
        alert('🛎️ Bem-vindo! Entrada registada com sucesso.');
      } catch (err) {
        console.error(err);
        alert("❌ Erro ao sincronizar check-in com o servidor.");
      }
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
  const destinationIsland = itinerary.flight?.destination || publicIslandFilter;
  const itineraryItemCount = (itinerary.flight ? 1 : 0) + (itinerary.hotel ? 1 : 0) + (itinerary.car ? 1 : 0);
  const navCategories = getNavigationCategories(language);
  const airports = getAirports(language);
  const selectedIslandName = airports.find(a => a.code === publicIslandFilter)?.location;
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
        onUpdateActivities={setActivities}
        onUpdateFlights={setFlights}
        onUpdateHotels={setHotels}
        onUpdateCars={setCars}
        onUpdateBusSchedules={setBusSchedules}
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
    const currentBusiness = [...(restaurants || []), ...(shops || []), ...(beauty || [])].find(b => b.id === currentBusinessId);
    
    if (currentBusiness) {
      const bType = currentBusiness.businessType || 'restaurants';
      const bEndpoint = bType === 'restaurant' ? 'restaurants' : bType; // Handle pluralization if needed

      return (
        <ErrorBoundary>
          <BusinessDashboard 
            business={currentBusiness}
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
               // Update local state
               if (bType === 'shop') setShops(prev => prev.map(s => s.id === updated.id ? updated : s));
               else if (bType === 'beauty') setBeauty(prev => prev.map(b => b.id === updated.id ? updated : b));
               else setRestaurants(prev => prev.map(r => r.id === updated.id ? updated : r));

               fetch(`${API_BASE_URL}/api/${bEndpoint}/${updated.id}`, {
                 method: 'PUT',
                 headers: { 'Content-Type': 'application/json' },
                 body: JSON.stringify(updated),
               }).then(() => alert("✅ Sincronizado!"));
            }}
            onUpdateBusiness={async (updated) => {
              if (bType === 'shop') setShops(prev => prev.map(s => s.id === updated.id ? updated : s));
              else if (bType === 'beauty') setBeauty(prev => prev.map(b => b.id === updated.id ? updated : b));
              else setRestaurants(prev => prev.map(r => r.id === updated.id ? updated : r));
              
              // Desnormalizar caminhos antes de enviar para o servidor (manter relativo no db.json)
              const denormalized = {
                ...updated,
                image: updated.image?.replace(API_BASE_URL, ''),
                gallery: updated.gallery?.map(img => typeof img === 'string' ? img.replace(API_BASE_URL, '') : img),
                menu: updated.menu?.map(item => ({
                  ...item,
                  image: item.image?.replace(API_BASE_URL, '')
                }))
              };

              try {
                await fetch(`${API_BASE_URL}/api/${bEndpoint}/${updated.id}`, {
                  method: 'PUT',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(denormalized),
                });
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
      {/* Navigation */}
      <nav className={`bg-white shadow-md sticky top-0 z-30 ${showAuthModal || showPackageModal ? 'blur-sm' : ''}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center cursor-pointer" onClick={goHome}>
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white shadow-md mr-2 border-2 border-blue-600 overflow-hidden">
                <AzoresLogo size={32} />
              </div>
              <span className="font-bold text-2xl tracking-tight" style={{ color: COLORS.primary }}>
                Azores<span style={{ color: COLORS.secondary }}>Toyou</span>
              </span>
            </div>
            
            <div className="hidden md:flex items-center space-x-6">
               <button onClick={goHome} className={`text-sm font-medium ${exploreCategory === null ? 'text-blue-600 font-bold' : 'text-slate-500'}`}>{getTranslation(language, 'nav_home')}</button>
               {navCategories.slice(0, 4).map(cat => (
                 <button 
                  key={cat.id}
                  onClick={() => handleNavClick(cat.id)} 
                  className={`font-medium text-sm transition-colors ${
                    exploreCategory === cat.id ? 'text-blue-600 font-bold' : 'text-slate-500 hover:text-slate-800'
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
                      <span className="text-xs font-black text-blue-700 tracking-tight">{userCredits} {getTranslation(language, 'credits_balance')}</span>
                    </div>

                    {/* Ícone de Notificações (Simples) */}
                    <div className="relative cursor-pointer group">
                      <div className="p-2 bg-slate-100 rounded-full hover:bg-slate-200 transition-all">
                        <Bell className="w-5 h-5 text-slate-600" />
                      </div>
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

                    {/* Profile Dropdown */}
                    {showProfileMenu && (
                      <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                        <div className="px-4 py-3 border-b border-slate-50 mb-1">
                          <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">{getTranslation(language, 'credits_balance')}</p>
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center text-[8px] font-black text-white">C</div>
                            <span className="text-sm font-black text-blue-700">{userCredits}</span>
                          </div>
                        </div>
                        <button 
                          onClick={() => { setShowProfileModal(true); setShowProfileMenu(false); }}
                          className="w-full px-4 py-2 text-left text-sm font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-3 transition-colors"
                        >
                          <User className="w-4 h-4 text-blue-600" /> {getTranslation(language, 'edit_profile')}
                        </button>
                        <button 
                          onClick={() => { setIsAuthenticated(false); setShowProfileMenu(false); setHasEnteredApp(false); }}
                          className="w-full px-4 py-2 text-left text-sm font-bold text-red-500 hover:bg-red-50 flex items-center gap-3 transition-colors"
                        >
                          <LogOut className="w-4 h-4" /> {getTranslation(language, 'nav_logout')}
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <button onClick={() => setShowAuthModal(true)} className="text-sm font-bold text-blue-600">{getTranslation(language, 'login')}</button>
                )}
              </div>
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-slate-600 md:hidden">
                {mobileMenuOpen ? <X /> : <Menu />}
              </button>
            </div>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden bg-slate-50 border-t p-4 pb-8 space-y-2 shadow-2xl absolute w-full z-40 max-h-[80vh] overflow-y-auto animate-in slide-in-from-top-5">
             <div className="grid grid-cols-1 gap-2">
               <button onClick={goHome} className="flex items-center gap-4 w-full p-3 bg-white rounded-xl shadow-sm border border-slate-100">
                  <div className="p-2 rounded-lg bg-slate-200 text-slate-600"><X className="w-6 h-6" /></div>
                  <span className="font-bold text-slate-700">{getTranslation(language, 'nav_back_home')}</span>
               </button>
               {navCategories.map(cat => (
                 <button key={cat.id} onClick={() => handleNavClick(cat.id)} className="flex items-center gap-4 w-full p-3 bg-white rounded-xl shadow-sm border border-slate-100">
                   <div className="p-2 rounded-lg text-white" style={{ backgroundColor: cat.color }}>{cat.icon}</div>
                   <span className="font-bold text-slate-700">{cat.label}</span>
                 </button>
               ))}
             </div>
             <div className="border-t pt-4 mt-4 space-y-3">
               {isAuthenticated && (
                 <>
                   <div className="flex items-center justify-between p-3 bg-blue-50 rounded-xl border border-blue-100">
                     <div className="flex items-center gap-3">
                       <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-sm">
                         <img src={userProfile.avatar} alt="Avatar" className="w-full h-full object-cover" />
                       </div>
                       <div>
                         <p className="font-bold text-slate-800 text-sm">{getTranslation(language, 'traveler')}</p>
                         <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">{userCredits} {getTranslation(language, 'credits_balance')}</p>
                       </div>
                     </div>
                     <button 
                       onClick={() => { setShowProfileModal(true); setMobileMenuOpen(false); }}
                       className="p-2 bg-white rounded-lg shadow-sm text-blue-600"
                     >
                       <User className="w-5 h-5" />
                     </button>
                   </div>
                 </>
               )}
               <button onClick={goBackToLanding} className="flex items-center gap-4 w-full p-3 text-red-500 font-bold hover:bg-red-50 rounded-xl transition-colors">
                 <LogOut className="w-6 h-6" /> {getTranslation(language, 'nav_logout')}
               </button>
             </div>
          </div>
        )}
      </nav>

      <main className={`pb-8 pt-4 md:pt-8 ${showAuthModal || showPackageModal || showBusIslandModal ? 'blur-sm pointer-events-none' : ''}`}>
        
        {exploreCategory === null ? (
          <div className="max-w-4xl mx-auto px-4">
            {/* Welcome Section TOP */}
            <div className="text-center py-10 md:py-16 animate-in fade-in slide-in-from-bottom-4">
               <div className="mb-6 inline-flex p-6 bg-white shadow-xl rounded-full">
                 <Compass className="w-16 h-16 text-blue-500 animate-pulse" />
               </div>
               
               {publicIslandFilter === 'all' ? (
                 <>
                   <h2 className="text-3xl md:text-4xl font-extrabold text-slate-800 mb-4 tracking-tight">{getTranslation(language, 'welcome_title')}</h2>
                   <p className="text-slate-500 leading-relaxed text-lg max-w-xl mx-auto mb-10">
                     {getTranslation(language, 'welcome_subtitle')}
                   </p>
                   {/* Island Search Bar */}
                   <div className="animate-in fade-in slide-in-from-bottom-2 duration-700 delay-100">
                     <IslandSearch 
                       selectedIsland={publicIslandFilter} 
                       onSelectIsland={setPublicIslandFilter} 
                       language={language} 
                     />
                   </div>
                 </>
               ) : (
                 <div className="animate-in fade-in zoom-in duration-500 mb-8 max-w-2xl mx-auto">
                    <div className="bg-white/80 backdrop-blur-md border border-white/50 shadow-xl rounded-3xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
                       <div className="flex items-center gap-4 text-left">
                          <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-4 rounded-2xl text-white shadow-lg">
                             <MapPin className="w-8 h-8" />
                          </div>
                          <div>
                             <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">{getTranslation(language, 'welcome_island')}</p>
                             <h2 className="text-3xl font-extrabold text-slate-800 leading-none">{selectedIslandName}</h2>
                          </div>
                       </div>
                       <button 
                         onClick={() => setPublicIslandFilter('all')} 
                         className="px-6 py-3 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900 font-bold text-sm transition-colors flex items-center gap-2 whitespace-nowrap"
                       >
                         {getTranslation(language, 'change_island')} <X className="w-4 h-4" />
                       </button>
                    </div>
                 </div>
               )}

               {/* Categories Grid DOWN */}
               <div className="animate-in fade-in duration-500 delay-200 mt-4">
                 <CategoryBar activeCategory={exploreCategory} onSelect={handleNavClick} language={language} />
               </div>
            </div>
          </div>
        ) : (
          <div className="animate-in fade-in duration-500 px-4">
            {/* Always keep category bar at the top when content is active for easy switching */}
            <CategoryBar activeCategory={exploreCategory} onSelect={handleNavClick} language={language} />
            
            <div className="min-h-[40vh] mt-8">
              <div className="animate-in fade-in slide-in-from-bottom-6 duration-500">
                {/* Specialized Views */}
                {exploreCategory === 'flights' && (
                  // Uses FlightBoard with DYNAMIC flights from App State
                  <FlightBoard airports={airports} flights={flights} onSelectFlight={handleFlightSelect} language={language} />
                )}

                {exploreCategory === 'accommodation' && (
                  <BookingWizard 
                     step="accommodation"
                     currentItinerary={itinerary}
                     onUpdateItinerary={updateItinerary}
                     onNext={() => { setCurrentStep('car'); setExploreCategory('rentcar'); }}
                     onSkip={() => { setCurrentStep('car'); setExploreCategory('rentcar'); }}
                     language={language}
                     isAuthenticated={isAuthenticated}
                     onShowAuth={() => setShowAuthModal(true)}
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
                     onNext={() => { setCurrentStep('summary'); setExploreCategory('flights'); }} 
                     onSkip={() => { setCurrentStep('summary'); setExploreCategory('flights'); }}
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
                {!['flights', 'accommodation', 'rentcar'].includes(exploreCategory as string) && (
                  <ExploreSection 
                    category={exploreCategory} 
                    destinationIsland={destinationIsland} 
                    currentLanguage={language}
                    isAuthenticated={isAuthenticated}
                    onShowAuth={() => setShowAuthModal(true)}
                    // PASSING DYNAMIC DATA
                    restaurants={restaurants}
                    activities={activities}
                    busSchedules={busSchedules}
                    shops={shops}
                    beauty={beauty}
                    userCredits={userCredits}
                    setUserCredits={setUserCredits}
                    favoriteRestaurantIds={favoriteRestaurantIds}
                    onToggleFavorite={toggleFavoriteRestaurant}
                    userProfile={userProfile}
                    onReserveSuccess={(resData, restName, restId) => {
                      // resData agora contém o objeto completo da reserva
                      setMyReservations(prev => [...prev, { 
                        ...resData,
                        restaurantName: restName, 
                        restaurantId: restId,
                        status: 'pending' 
                      }]);
                    }}
                    onClose={() => setExploreCategory(null)}
                  />
                )}
              </div>
            </div>
          </div>
        )}
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
      />

      {/* Modals */}
      <AuthModal isOpen={showAuthModal} onClose={() => { setShowAuthModal(false); setPendingFlight(null); }} onSuccess={handleAuthSuccess} language={language} restaurants={restaurants} shops={shops} beauty={beauty} />
      <PackagePreviewModal isOpen={showPackageModal} onClose={() => setShowPackageModal(false)} itinerary={itinerary} onContinue={handleContinueFromPackage} language={language} />
      <IslandSelectionModal isOpen={showBusIslandModal} onClose={() => setShowBusIslandModal(false)} onSelect={handleBusIslandSelect} language={language} />
      <ProfileModal 
        isOpen={showProfileModal} 
        onClose={() => setShowProfileModal(false)} 
        language={language} 
        userCredits={userCredits}
        userProfile={userProfile}
        onUpdateProfile={setUserProfile}
        onShowReservations={() => {
          setReturnToProfile(true);
          setShowProfileModal(false);
          setShowMyReservationsModal(true);
        }}
        onLogout={() => { setIsAuthenticated(false); setHasEnteredApp(false); }}
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
