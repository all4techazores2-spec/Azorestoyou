
// Azores4you - Main Application Entry - Build v1.1.0
import React, { useState, useEffect, useCallback } from 'react';
import { 
  BookingStep, ExploreCategory, Flight, Itinerary, Language, Restaurant, 
  Activity, Hotel, Car, BusSchedule, KitchenOrder, OrderItem, Business 
} from './types';
import { 
  getAirports, getFlights, COLORS, getRestaurants, getActivities, 
  getHotels, getCars, BUS_SCHEDULES, getBeauty, getShops, getServices, 
  getAutoRepairs, getAutoElectronics, getUsedMarket, getAnimals, 
  getRealEstate, getGyms, getStands, getOffices, getITServices, getPerfumes 
} from './constants';

// Components
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
import SOSModal from './components/SOSModal';

// Icons & Translations
import { Menu, X, User, LogOut, Compass, MapPin, Bell, AlertCircle, Phone, ShieldAlert } from 'lucide-react';
import { getTranslation } from './translations';

// --- MAIN COMPONENT ---
const App: React.FC = () => {
  // 1. SETTINGS & NAVIGATION
  const [language, setLanguage] = useState<Language>('pt');
  const [exploreCategory, setExploreCategory] = useState<ExploreCategory | null>(null);
  const [currentStep, setCurrentStep] = useState<BookingStep>('flights');
  const [destinationIsland, setDestinationIsland] = useState('S. Miguel');
  const [publicIslandFilter, setPublicIslandFilter] = useState('all');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hasEnteredApp, setHasEnteredApp] = useState(false);

  // 2. DYNAMIC DATA STATE
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [shops, setShops] = useState<Business[]>([]);
  const [beauty, setBeauty] = useState<Business[]>([]);
  const [services, setServices] = useState<Business[]>([]);
  const [offices, setOffices] = useState<Business[]>([]);
  const [autoRepairs, setAutoRepairs] = useState<Business[]>([]);
  const [autoElectronics, setAutoElectronics] = useState<Business[]>([]);
  const [usedMarket, setUsedMarket] = useState<Business[]>([]);
  const [animals, setAnimals] = useState<Business[]>([]);
  const [realEstate, setRealEstate] = useState<Business[]>([]);
  const [gyms, setGyms] = useState<Business[]>([]);
  const [stands, setStands] = useState<Business[]>([]);
  const [itServices, setItServices] = useState<Business[]>([]);
  const [perfumes, setPerfumes] = useState<Business[]>([]);
  const [busSchedules, setBusSchedules] = useState<BusSchedule[]>(BUS_SCHEDULES);
  
  // Static-ish Data (Initialized from constants)
  const [flights, setFlights] = useState<Flight[]>(getFlights('pt'));
  const [hotels, setHotels] = useState<Hotel[]>(getHotels('pt'));
  const [cars, setCars] = useState<Car[]>(getCars('pt'));

  // 3. AUTH & USER STATE
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isBusiness, setIsBusiness] = useState(false);
  const [isStaff, setIsStaff] = useState(false);
  const [isSupplier, setIsSupplier] = useState(false);
  const [staffRole, setStaffRole] = useState<string | null>(null);
  const [currentBusinessId, setCurrentBusinessId] = useState<string | null>(null);
  const [userCredits, setUserCredits] = useState(100);
  const [userProfile, setUserProfile] = useState({
    email: '', name: 'Cliente Viajante', phone: '', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix'
  });
  const [myReservations, setMyReservations] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [favoriteRestaurantIds, setFavoriteRestaurantIds] = useState<string[]>([]);

  // 4. MODALS & UI TOGGLES
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showMyReservationsModal, setShowMyReservationsModal] = useState(false);
  const [showFavoritesModal, setShowFavoritesModal] = useState(false);
  const [showNotificationsModal, setShowNotificationsModal] = useState(false);
  const [showPackageModal, setShowPackageModal] = useState(false);
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [showSOSModal, setShowSOSModal] = useState(false);

  // 5. ITINERARY
  const [itinerary, setItinerary] = useState<Itinerary>({
    flight: null, hotel: null, nights: 3, car: null, carDays: 3
  });

  // API Config
  const API_BASE_URL = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.hostname.startsWith('192.168.'))
    ? `http://${window.location.hostname}:3001`
    : 'https://azorestoyou-1.onrender.com';

  // --- CORE LOGIC ---

  const fetchData = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/restaurants`);
      if (response.ok) {
        const data = await response.json();
        // Normalize image paths
        const normalized = data.map((r: any) => ({
          ...r,
          image: r.image?.startsWith('/imagens') ? `${API_BASE_URL}${r.image}` : r.image,
          gallery: r.gallery?.map((img: string) => img.startsWith('/imagens') ? `${API_BASE_URL}${img}` : img),
        }));

        setRestaurants(normalized.filter((b: any) => !b.businessType || b.businessType === 'restaurant'));
        setShops(normalized.filter((b: any) => b.businessType === 'shop'));
        setBeauty(normalized.filter((b: any) => b.businessType === 'beauty'));
        setServices(normalized.filter((b: any) => b.businessType === 'service'));
        setOffices(normalized.filter((b: any) => b.businessType === 'office'));
        setAutoRepairs(normalized.filter((b: any) => b.businessType === 'auto_repair'));
        setAutoElectronics(normalized.filter((b: any) => b.businessType === 'auto_electronics'));
        setUsedMarket(normalized.filter((b: any) => b.businessType === 'used_market'));
        setAnimals(normalized.filter((b: any) => b.businessType === 'animals'));
        setRealEstate(normalized.filter((b: any) => b.businessType === 'real_estate'));
        setGyms(normalized.filter((b: any) => b.businessType === 'gym'));
        setStands(normalized.filter((b: any) => b.businessType === 'stand'));
        setItServices(normalized.filter((b: any) => b.businessType === 'it_services'));
        setPerfumes(normalized.filter((b: any) => b.businessType === 'perfumes'));
      }

      if (isAuthenticated && userProfile.email) {
        const userResp = await fetch(`${API_BASE_URL}/api/users/${userProfile.email}`);
        if (userResp.ok) {
          const userData = await userResp.json();
          setUserCredits(userData.credits || 0);
          setMyReservations(userData.reservations || []);
        }
      }
    } catch (err) {
      console.error("Fetch error:", err);
    }
  }, [API_BASE_URL, isAuthenticated, userProfile.email]);

  useEffect(() => { fetchData(); }, [fetchData]);
  
  const handleLogout = () => {
    setIsAuthenticated(false);
    setIsAdmin(false);
    setIsBusiness(false);
    setIsStaff(false);
    setIsSupplier(false);
    setStaffRole(null);
    setCurrentBusinessId(null);
    setUserProfile({ email: '', name: 'Cliente Viajante', phone: '', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix' });
    setExploreCategory(null);
    setMobileMenuOpen(false);
  };

  const handleReserveSuccess = async (resData: any, itemName: string, itemId: string) => {
    try {
      const business = [...restaurants, ...shops, ...beauty, ...services, ...offices].find(b => b.id === itemId);
      const type = resData?.type || (business as any)?.businessType || 'restaurant';

      const newReservation = { ...resData, type, businessName: itemName, businessId: itemId, status: 'pending' };
      setMyReservations(prev => [...prev, newReservation]);

      if (isAuthenticated && userProfile.email) {
        await fetch(`${API_BASE_URL}/api/users/${userProfile.email}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ reservations: [...myReservations, newReservation] })
        });
      }
      fetchData();
    } catch (err) {
      console.error("Reservation error:", err);
    }
  };

  // Handle Home/Back
  const goHome = () => { setExploreCategory(null); setMobileMenuOpen(false); };

  // --- RENDERING HELPERS ---

  const renderMainContent = () => {
    if (exploreCategory === null) {
      return (
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center py-10 md:py-16 animate-in fade-in slide-in-from-bottom-4">
             <div className="mb-6 inline-flex p-6 bg-white shadow-xl rounded-full">
               <Compass className="w-16 h-16 text-blue-500 animate-pulse" />
             </div>
             <h2 className="text-3xl md:text-4xl font-extrabold text-slate-800 mb-4 tracking-tight">{getTranslation(language, 'welcome_title')}</h2>
             <IslandSearch selectedIsland={publicIslandFilter} onSelectIsland={setPublicIslandFilter} language={language} />
             <div className="mt-8">
               <CategoryBar activeCategory={exploreCategory} onSelect={setExploreCategory} language={language} />
             </div>
          </div>
        </div>
      );
    }

    if (exploreCategory === 'community') {
      return (
        <CommunitySection 
          isAuthenticated={isAuthenticated}
          userName={userProfile.name}
          onShowAuth={() => setShowAuthModal(true)}
          onClose={goHome}
        />
      );
    }

    return (
      <div className="animate-in fade-in duration-500">
        <div className="px-4">
          <CategoryBar activeCategory={exploreCategory} onSelect={setExploreCategory} language={language} />
        </div>
        
        <div className="min-h-[40vh] mt-4">
          {exploreCategory === 'flights' && currentStep === 'flights' && (
            <FlightBoard airports={getAirports(language)} flights={flights} language={language} onSelectFlight={() => {}} />
          )}

          {exploreCategory === 'accommodation' && (
            <BookingWizard step="accommodation" hotels={hotels} language={language} onNext={() => setExploreCategory('rentcar')} />
          )}

          {!['flights', 'accommodation', 'community'].includes(exploreCategory) && (
            <ExploreSection 
              category={exploreCategory}
              restaurants={restaurants}
              shops={shops}
              beauty={beauty}
              services={services}
              offices={offices}
              autoRepairs={autoRepairs}
              autoElectronics={autoElectronics}
              usedMarket={usedMarket}
              animals={animals}
              realEstate={realEstate}
              gyms={gyms}
              stands={stands}
              itServices={itServices}
              perfumes={perfumes}
              activities={activities}
              busSchedules={busSchedules}
              currentLanguage={language}
              isAuthenticated={isAuthenticated}
              onShowAuth={() => setShowAuthModal(true)}
              userCredits={userCredits}
              setUserCredits={setUserCredits}
              userProfile={userProfile}
              onReserveSuccess={handleReserveSuccess}
              favoriteRestaurantIds={favoriteRestaurantIds}
              onToggleFavorite={(id) => setFavoriteRestaurantIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])}
              onClose={goHome}
            />
          )}
        </div>
      </div>
    );
  };

  // --- VIEW BRANCHING ---
  if (!hasEnteredApp) {
    return (
      <LandingPage 
        onEnter={() => setHasEnteredApp(true)} 
        onShowAuth={() => { setShowAuthModal(true); setHasEnteredApp(true); }}
        language={language}
        setLanguage={setLanguage}
      />
    );
  }

  if (isAdmin) {
    return <AdminDashboard onLogout={handleLogout} restaurants={restaurants} activities={activities} shops={shops} beauty={beauty} services={services} language={language} />;
  }

  if (isBusiness) {
    return <BusinessDashboard onLogout={handleLogout} businessId={currentBusinessId!} businesses={[...restaurants, ...shops, ...beauty]} language={language} />;
  }

  if (isSupplier) {
    return <SupplierDashboard onLogout={handleLogout} language={language} />;
  }

  return (
    <div className={`min-h-screen bg-slate-100 font-sans text-slate-800 pb-16 md:pb-0`}>
      
      {/* Navigation Header */}
      {exploreCategory !== 'community' && (
        <nav className="bg-white shadow-md sticky top-0 z-30">
          <div className="max-w-7xl mx-auto px-4 h-16 flex justify-between items-center">
             <div className="flex items-center cursor-pointer" onClick={goHome}>
                <AzoresLogo size={32} />
                <span className="font-bold text-2xl ml-2 text-slate-900">Azores<span className="text-green-600">Toyou</span></span>
             </div>
             
             <div className="hidden md:flex items-center gap-6">
                <button onClick={goHome} className="text-sm font-bold text-blue-600">Início</button>
                {isAuthenticated ? (
                  <div className="flex items-center gap-3" onClick={() => setShowProfileModal(true)}>
                    <img src={userProfile.avatar} className="w-8 h-8 rounded-full border shadow-sm" alt="U" />
                    <span className="text-sm font-bold">{userProfile.name}</span>
                  </div>
                ) : (
                  <button onClick={() => setShowAuthModal(true)} className="text-sm font-bold text-blue-600">Login</button>
                )}
             </div>
          </div>
        </nav>
      )}

      {/* Main Body */}
      <main className="pb-8">
        {renderMainContent()}
      </main>

      {/* Bottom Navigation (Always Visible) */}
      <BottomNav 
        isCommunity={exploreCategory === 'community'}
        onHome={goHome}
        onShowProfile={() => setShowProfileModal(true)}
        onShowAuth={() => setShowAuthModal(true)}
        onShowReservations={() => setShowMyReservationsModal(true)}
        onShowNotifications={() => setShowNotificationsModal(true)}
        isAuthenticated={isAuthenticated}
        language={language}
      />

      {/* Modals Container */}
      {showAuthModal && (
        <AuthModal 
          isOpen={true} 
          onClose={() => setShowAuthModal(false)} 
          restaurants={restaurants}
          shops={shops}
          beauty={beauty}
          language={language}
          onSuccess={(admin, bizId, email, role) => {
            setIsAuthenticated(true);
            setIsAdmin(!!admin);
            if (bizId) {
              setIsBusiness(true);
              setCurrentBusinessId(bizId);
            }
            if (role === 'staff' || role === 'waiter' || role === 'chef') {
              setIsStaff(true);
              setStaffRole(role);
            }
            if (role === 'supplier') setIsSupplier(true);
            
            setUserProfile(prev => ({ ...prev, email: email || '' }));
            setShowAuthModal(false);
          }} 
        />
      )}
      {showProfileModal && <ProfileModal isOpen={true} onClose={() => setShowProfileModal(false)} profile={userProfile} />}

    </div>
  );
};

export default App;
