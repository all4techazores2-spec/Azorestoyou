
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, Map, Heart, User, ChevronDown, ChevronLeft, ChevronRight, Play, 
  Utensils, Bus, Car, Tent, LayoutGrid, Mountain, 
  Facebook, Instagram, Youtube, Send, ArrowRight,
  ShieldCheck, Globe, Clock, Tag, CreditCard, Apple, Scissors,
  MapPin, ShoppingBag, Sparkles, Wrench, Settings, Dog, Building2, Dumbbell, CarFront, Briefcase, Laptop, Wine, Calendar, Landmark, Check, Info, Headphones, Sun, Cloud, CloudDrizzle, CloudRain, CloudLightning, X
} from 'lucide-react';
import AzoresLogo from './AzoresLogo';
import { Language } from '../types';
import { API_BASE_URL } from '../config';
import { WeatherWidget } from './WeatherWidget';
import { getRestaurants, getHotels, getActivities } from '../constants';

interface DesktopViewProps {
  language: Language;
  onNavigate: (category: any) => void;
  onShowAuth: () => void;
  onShowFavorites: () => void;
  onShowProfile: () => void;
  onOpenIslandSelection: () => void;
  isAuthenticated: boolean;
  userProfile?: any;
  onShowBarberLogin?: () => void;
  onSearch?: (query: string) => void;
}

export const DesktopHeader: React.FC<DesktopViewProps & { scrolled: boolean }> = ({
  onNavigate,
  onShowAuth,
  onShowFavorites,
  onShowProfile,
  isAuthenticated,
  userProfile,
  scrolled,
  onShowBarberLogin
}) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-[9999] bg-white border-b border-slate-100 shadow-sm pointer-events-auto h-20 flex items-center">
      <div className="w-full px-8 flex items-center justify-between">
        
        {/* Left side: Stretched Logo as far left as possible */}
        <div className="flex items-center cursor-pointer shrink-0" onClick={() => { onNavigate(null); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
          <img src="/pngletras.png" alt="Logo" className="h-20 w-auto object-contain" />
        </div>

        {/* Right side: Everything else pushed to the far right */}
        <div className="flex items-center gap-10">
          {/* Navigation Menu */}
          <nav className="flex items-center gap-6">
            {[
              { label: 'Início', value: 'inicio' },
              { label: 'Alojamento', value: 'accommodation' },
              { label: 'Restauração', value: 'restaurants' },
              { label: 'Trilhos', value: 'trails' },
              { label: 'Rentacar', value: 'rentcar' },
              { label: 'Todas as Categorias', value: 'all' }
            ].map((item) => (
              <a 
                key={item.label} 
                href="#" 
                className="text-xs font-black uppercase tracking-widest text-slate-800 hover:text-green-600 transition-colors relative py-2"
                onClick={(e) => {
                  e.preventDefault();
                  if (item.value === 'inicio') {
                    onNavigate(null);
                  } else if (item.value === 'all') {
                    const element = document.getElementById('categories-section');
                    if (element) {
                      element.scrollIntoView({ behavior: 'smooth' });
                    }
                  } else {
                    onNavigate(item.value);
                  }
                }}
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="h-6 w-[1px] bg-slate-200"></div>

          {/* User actions */}
          <div className="flex items-center gap-6">
            <button onClick={onShowFavorites} className="p-2 rounded-full transition-all hover:bg-slate-100 text-slate-400 hover:text-red-500">
              <Heart size={20} />
            </button>
            
            <button 
              onClick={isAuthenticated ? onShowProfile : onShowAuth}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-sm active:scale-95"
            >
              <User size={16} />
              {isAuthenticated ? (userProfile?.name?.split(' ')[0] || 'Perfil') : 'Entrar'}
            </button>

            <div className="relative group">
              <button className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 text-slate-700 bg-slate-50 text-xs font-black uppercase tracking-wider">
                <span>PT</span>
                <ChevronDown size={12} />
              </button>
              <div className="absolute right-0 top-full mt-2 w-40 bg-white rounded-2xl shadow-xl border border-slate-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 p-1.5 z-[101]">
                {['Português', 'English', 'Español', 'Français', 'Deutsch'].map((l) => (
                  <button key={l} className="w-full text-left px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-650 hover:bg-slate-50 hover:text-green-600 rounded-xl transition-colors">
                    {l}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>
    </header>
  );
};

export const DesktopFooter: React.FC = () => {
  return (
    <footer className="bg-slate-900 pt-24 pb-12 text-white">
      <div className="max-w-7xl mx-auto px-8 grid grid-cols-12 gap-12 mb-24">
        <div className="col-span-4">
          <div className="flex items-center gap-3 mb-8">
            <AzoresLogo size={280} />
          </div>
          <p className="text-slate-400 text-sm leading-relaxed mb-10 max-w-sm">
            O seu guia completo para descobrir as maravilhas dos Açores. Natureza, aventura e experiências inesquecíveis esperam por si.
          </p>
          <div className="flex gap-4">
            {[Facebook, Instagram, Youtube, Send].map((Icon, i) => (
              <button key={i} className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center hover:bg-green-600 transition-all hover:scale-110 active:scale-95">
                <Icon size={20} />
              </button>
            ))}
          </div>
        </div>

        <div className="col-span-2">
          <h5 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-500 mb-8">Explorar</h5>
          <ul className="space-y-4">
            {['Viagens', 'Restauração', 'Trilhos', 'Rent-a-Car', 'Atividades', 'Alojamentos'].map(item => (
              <li key={item}><a href="#" className="text-sm font-bold text-slate-300 hover:text-white transition-colors">{item}</a></li>
            ))}
          </ul>
        </div>

        <div className="col-span-2">
          <h5 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-500 mb-8">Informações</h5>
          <ul className="space-y-4">
            {['Sobre Nós', 'Perguntas Frequentes', 'Termos e Condições', 'Política de Privacidade', 'Contactos'].map(item => (
              <li key={item}><a href="#" className="text-sm font-bold text-slate-300 hover:text-white transition-colors">{item}</a></li>
            ))}
          </ul>
        </div>

        <div className="col-span-2">
          <h5 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-500 mb-8">Ajuda</h5>
          <ul className="space-y-4">
            {['Centro de Ajuda', 'Suporte', 'Cancelamentos', 'Alterações de Reserva'].map(item => (
              <li key={item}><a href="#" className="text-sm font-bold text-slate-300 hover:text-white transition-colors">{item}</a></li>
            ))}
          </ul>
        </div>

        <div className="col-span-2">
          <h5 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-500 mb-8">Newsletter</h5>
          <p className="text-xs text-slate-400 mb-6 font-bold leading-relaxed">Subscreva e receba as melhores ofertas e novidades dos Açores.</p>
          <div className="relative">
            <input 
              type="email" 
              placeholder="O seu e-mail" 
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-green-500/50"
            />
            <button className="absolute right-2 top-2 w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center hover:bg-green-700 transition-all active:scale-90">
              <Send size={16} />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 pt-12 border-t border-white/5 flex items-center justify-between">
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">© 2024 Azorestoyou. Todos os direitos reservados.</p>
        <div className="flex gap-4 opacity-50 grayscale hover:grayscale-0 transition-all">
          <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-lg border border-white/10"><CreditCard size={14} /> <span className="text-[9px] font-black">VISA</span></div>
          <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-lg border border-white/10"><CreditCard size={14} /> <span className="text-[9px] font-black">MB</span></div>
          <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-lg border border-white/10"><Apple size={14} /> <span className="text-[9px] font-black">Pay</span></div>
        </div>
      </div>
    </footer>
  );
};

const CITIES = [
  { name: 'Ponta Delgada (S. Miguel)', lat: 37.7412, lon: -25.6756 },
  { name: 'Ribeira Grande (S. Miguel)', lat: 37.8218, lon: -25.5145 },
  { name: 'Lagoa (S. Miguel)', lat: 37.7445, lon: -25.5705 },
  { name: 'Furnas (S. Miguel)', lat: 37.7933, lon: -25.3219 },
  { name: 'Vila Franca (S. Miguel)', lat: 37.7158, lon: -25.4330 },
  { name: 'Nordeste (S. Miguel)', lat: 37.8333, lon: -25.1500 },
  { name: 'Povoação (S. Miguel)', lat: 37.7467, lon: -25.2467 },
  { name: 'Angra do Heroísmo (Terceira)', lat: 38.6597, lon: -27.2219 },
  { name: 'Praia da Vitória (Terceira)', lat: 38.7287, lon: -27.0668 },
  { name: 'Horta (Faial)', lat: 38.5370, lon: -28.6267 },
  { name: 'Madalena (Pico)', lat: 38.5360, lon: -28.5265 },
  { name: 'S. Roque do Pico (Pico)', lat: 38.5167, lon: -28.3167 },
  { name: 'Lajes do Pico (Pico)', lat: 38.4000, lon: -28.2500 },
  { name: 'Velas (S. Jorge)', lat: 38.6828, lon: -28.2133 },
  { name: 'Calheta (S. Jorge)', lat: 38.6000, lon: -28.0167 },
  { name: 'Santa Cruz (Flores)', lat: 39.4585, lon: -31.1303 },
  { name: 'Lajes (Flores)', lat: 39.3833, lon: -31.1667 },
  { name: 'Vila do Corvo (Corvo)', lat: 39.6715, lon: -31.1138 },
  { name: 'Santa Cruz (Graciosa)', lat: 39.0865, lon: -28.0062 },
  { name: 'Vila do Porto (S. Maria)', lat: 36.9490, lon: -25.1490 }
];

const DesktopWeatherCard: React.FC = () => {
  const [time, setTime] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [dayOfWeek, setDayOfWeek] = useState<string>('');
  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedLocation, setSelectedLocation] = useState<string>('Ponta Delgada (S. Miguel)');
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' }));
      setDate(now.toLocaleDateString('pt-PT', { day: 'numeric', month: 'long', year: 'numeric' }));
      const weekday = now.toLocaleDateString('pt-PT', { weekday: 'long' });
      setDayOfWeek(weekday.charAt(0).toUpperCase() + weekday.slice(1));
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  const fetchWeatherForCoords = async (lat: number, lon: number, name: string) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code&timezone=auto`
      );
      if (!response.ok) throw new Error("API failure");
      const data = await response.json();
      setWeather({
        temp: Math.round(data.current.temperature_2m),
        conditionCode: data.current.weather_code,
        locationName: name
      });
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeatherForCoords(37.7412, -25.6756, 'Ponta Delgada');
  }, []);

  const handleSelectCity = (city: any) => {
    setSelectedLocation(city.name);
    setShowDropdown(false);
    const displayName = city.name.split(' (')[0];
    fetchWeatherForCoords(city.lat, city.lon, displayName);
  };

  const getWeatherIcon = (code: number) => {
    if (code === 0) return <Sun className="w-8 h-8 text-amber-500" />;
    if (code >= 1 && code <= 3) return <Cloud className="w-8 h-8 text-slate-400" />;
    if (code >= 51 && code <= 55) return <CloudDrizzle className="w-8 h-8 text-sky-400" />;
    if (code >= 61 && code <= 65) return <CloudRain className="w-8 h-8 text-blue-500" />;
    if (code >= 80 && code <= 82) return <CloudRain className="w-8 h-8 text-blue-600" />;
    if (code >= 95 && code <= 99) return <CloudLightning className="w-8 h-8 text-violet-500" />;
    return <Cloud className="w-8 h-8 text-slate-400" />;
  };

  const getWeatherDescription = (code: number) => {
    if (code === 0) return 'Céu limpo';
    if (code >= 1 && code <= 3) return 'Parcialmente nublado';
    if (code >= 45 && code <= 48) return 'Nevoeiro';
    if (code >= 51 && code <= 55) return 'Chuviscos';
    if (code >= 61 && code <= 65) return 'Chuva';
    if (code >= 80 && code <= 82) return 'Aguaceiros';
    if (code >= 95 && code <= 99) return 'Trovoada';
    return 'Nublado';
  };

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col gap-6 text-slate-800">
      <div className="flex items-start gap-4">
        <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-slate-600 shrink-0">
          <Calendar className="w-6 h-6" />
        </div>
        <div className="flex flex-col text-left">
          <span className="text-sm font-black text-slate-900 leading-none mb-1">{date || '19 de julho de 2026'}</span>
          <span className="text-xs font-bold text-slate-400 capitalize">{dayOfWeek || 'Domingo'}</span>
        </div>
      </div>

      <div className="flex items-start gap-4">
        <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-slate-600 shrink-0">
          <Clock className="w-6 h-6" />
        </div>
        <div className="flex flex-col text-left">
          <span className="text-sm font-black text-slate-900 leading-none mb-1">{time || '16:45'}</span>
          <span className="text-xs font-bold text-slate-400">Hora local</span>
        </div>
      </div>

      <div className="flex items-start gap-4">
        <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-slate-600 shrink-0">
          {loading || !weather ? (
            <div className="w-6 h-6 rounded-full border-2 border-green-500/20 border-t-green-500 animate-spin"></div>
          ) : (
            getWeatherIcon(weather.conditionCode)
          )}
        </div>
        <div className="flex flex-col text-left w-full relative" ref={dropdownRef}>
          {loading || !weather ? (
            <span className="text-xs font-bold text-slate-450">A carregar tempo...</span>
          ) : (
            <>
              <span className="text-sm font-black text-slate-900 leading-none mb-1">{weather.temp}°C</span>
              <span className="text-xs font-bold text-slate-450 mb-1.5">{getWeatherDescription(weather.conditionCode)}</span>
            </>
          )}

          <button 
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-1 text-[11px] font-bold text-slate-550 hover:text-green-600 transition-colors w-fit"
          >
            <MapPin size={12} className="text-slate-400" />
            <span className="underline decoration-dotted">{selectedLocation.split(' (')[0]}</span>
            <ChevronDown size={10} className={`transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
          </button>

          {showDropdown && (
            <div className="absolute left-0 top-full mt-2 w-60 bg-white border border-slate-100 rounded-2xl shadow-xl p-2 z-[200] max-h-56 overflow-y-auto">
              <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest px-2.5 py-1.5 border-b border-slate-50">Localidades dos Açores</div>
              {CITIES.map((c) => (
                <button
                  key={c.name}
                  onClick={() => handleSelectCity(c)}
                  className="w-full text-left px-2.5 py-2 text-[10px] font-bold text-slate-650 hover:text-green-600 hover:bg-slate-50 rounded-xl transition-colors flex items-center gap-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-green-550 shrink-0"></span>
                  {c.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const DesktopView: React.FC<DesktopViewProps> = (props) => {
  const {
    language,
    onNavigate,
    onShowAuth,
    onShowFavorites,
    onShowProfile,
    onOpenIslandSelection,
    isAuthenticated,
    userProfile
  } = props;
  const [heroIndex, setHeroIndex] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [categoryPage, setCategoryPage] = useState(0);
  const [showBusinessModal, setShowBusinessModal] = useState(false);
  const [showSaberMaisModal, setShowSaberMaisModal] = useState(false);
  const [bizForm, setBizForm] = useState({
    name: '',
    category: 'restaurants',
    contact: '',
    email: '',
    phone: '',
    island: 'São Miguel',
    notes: ''
  });
  const [bizSuccess, setBizSuccess] = useState(false);

  const handleBizSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setBizSuccess(true);
    setTimeout(() => {
      setBizSuccess(false);
      setShowBusinessModal(false);
      setBizForm({
        name: '',
        category: 'restaurants',
        contact: '',
        email: '',
        phone: '',
        island: 'São Miguel',
        notes: ''
      });
    }, 2500);
  };
  const [news, setNews] = useState<any[]>([
    {
      id: 'n_santa_clara',
      title: 'Santa Clara vence em casa e consolida subida na Liga',
      description: 'A equipa açoriana somou mais três pontos valiosos frente aos seus adeptos, demonstrando grande atitude e eficácia desportiva.',
      content: 'O Santa Clara garantiu uma vitória categórica por 2-0 frente aos seus adeptos. A equipa demonstrou excelente coesão defensiva e eficácia ofensiva, garantindo o resultado na segunda parte. Esta vitória consolida a posição na parte superior da tabela classificativa e gera enorme otimismo para as próximas jornadas desportivas.',
      date: '19/07/2026',
      time: '15:30',
      image: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=500&auto=format&fit=crop',
      island: 'São Miguel'
    },
    {
      id: 'n_regional_1',
      title: 'Governo dos Açores anuncia novos investimentos ambientais',
      description: 'Nova verba destina-se à preservação dos trilhos naturais e miradouros, protegendo a biodiversidade única das nove ilhas.',
      content: 'Com o objetivo de promover o turismo sustentável, o Governo Regional anunciou um pacote financeiro exclusivo para a requalificação e limpeza de miradouros, trilhos pedestres e áreas protegidas. O plano arranca já este mês em São Miguel, Terceira e Pico, estendendo-se posteriormente a todas as restantes ilhas do arquipélago.',
      date: '19/07/2026',
      time: '12:15',
      image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=500&auto=format&fit=crop',
      island: 'Terceira'
    },
    {
      id: 'n_regional_2',
      title: 'Festival de Chamarritas atrai milhares à ilha do Pico',
      description: 'O evento cultural tradicional celebra a música regional e danças típicas, juntando locais e turistas numa festa única.',
      content: 'A ilha do Pico acolheu este fim de semana a maior edição de sempre do Festival Anual de Chamarritas. O evento contou com atuações improvisadas de tocadores locais e danças de roda tradicionais que se prolongaram pela noite dentro, atraindo milhares de visitantes continentais e internacionais.',
      date: '18/07/2026',
      time: '21:00',
      image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&auto=format&fit=crop',
      island: 'Pico'
    },
    {
      id: 'n_regional_3',
      title: 'Novas ligações marítimas inter-ilhas entram em funcionamento',
      description: 'Aumento da frequência de ferries pretende melhorar a mobilidade local e facilitar deslocações turísticas no arquipélago.',
      content: 'Entrou hoje em vigor o novo horário alargado para a frota de ferries inter-ilhas. A medida visa facilitar a mobilidade diária dos açorianos e oferecer alternativas mais flexíveis para turistas que viajam entre ilhas vizinhas, especialmente nos grupos central e ocidental.',
      date: '18/07/2026',
      time: '09:45',
      image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=500&auto=format&fit=crop',
      island: 'Faial'
    }
  ]);
  const [selectedNewsIsland, setSelectedNewsIsland] = useState('Todas');
  const [selectedNews, setSelectedNews] = useState<any | null>(null);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/news`)
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setNews(data);
        }
      })
      .catch(err => console.error("Error fetching news:", err));
  }, []);

  const ptRestaurants = getRestaurants('pt') || [];
  const ptHotels = getHotels('pt') || [];
  const ptActivities = getActivities('pt') || [];

  const cais20 = ptRestaurants.find(r => r?.name?.toLowerCase().includes('cais 20')) || {
    name: 'Cais 20',
    cuisine: 'Restaurante',
    rating: 4.8,
    reviews: 324,
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=600&auto=format&fit=crop',
    island: 'São Miguel'
  };

  const hotelHighlight = ptHotels.find(h => h?.name?.toLowerCase().includes('pedras do mar') || h?.name?.toLowerCase().includes('meia nau')) || {
    name: 'Pedras do Mar Resort & SPA',
    island: 'São Miguel',
    rating: 4.7,
    reviews: 198,
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=600&auto=format&fit=crop'
  };

  const activityHighlight = ptActivities.find(a => a?.name?.toLowerCase().includes('whale') || a?.name?.toLowerCase().includes('baleias')) || {
    name: 'Whale Watching',
    island: 'São Miguel',
    rating: 4.9,
    reviews: 412,
    image: 'https://images.unsplash.com/photo-1534067783941-51c9c23ecefd?q=80&w=600&auto=format&fit=crop'
  };

  const trailHighlight = ptActivities.find(a => a?.name?.toLowerCase().includes('lagoa') || a?.name?.toLowerCase().includes('trilho') || a?.name?.toLowerCase().includes('furnas')) || {
    name: 'Lagoa do Fogo',
    island: 'São Miguel',
    rating: 4.9,
    reviews: 256,
    image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=600&auto=format&fit=crop'
  };

  const [slides, setSlides] = useState<any[]>([]);
  
  const [searchVal, setSearchVal] = useState('');
  const [isListening, setIsListening] = useState(false);

  const handleVoiceSearch = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Pesquisa por voz não disponível neste dispositivo.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'pt-PT';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error", event);
      setIsListening(false);
      alert("Erro ao escutar. Por favor, tente novamente.");
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onresult = (event: any) => {
      const speechToText = event.results[0][0].transcript;
      setSearchVal(speechToText);
      if (props.onSearch) {
        props.onSearch(speechToText);
      }
    };

    recognition.start();
  };

  const handleTextSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && props.onSearch) {
      props.onSearch(searchVal);
    }
  };

  const defaultSlides = [
    { id: 'slide_d1', image: 'https://images.unsplash.com/photo-1534067783941-51c9c23ecefd?q=80&w=2070&auto=format&fit=crop', subtitle: 'Experiência Açores', title: 'Descubra\nTodas as Ilhas', description: 'A natureza em estado puro para as suas férias perfeitas nos Açores.', buttonText: 'Explorar agora' },
    { id: 'slide_d2', image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=2070&auto=format&fit=crop', subtitle: 'Experiência Açores', title: 'Momentos\nInesquecíveis', description: 'Explore lagoas místicas, vulcões adormecidos e trilhos deslumbrantes.', buttonText: 'Explorar agora' },
    { id: 'slide_d3', image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop', subtitle: 'Experiência Açores', title: 'Alojamento\nPremium', description: 'Encontre o refúgio perfeito com todo o conforto e vistas incríveis.', buttonText: 'Explorar agora' },
    { id: 'slide_d4', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070&auto=format&fit=crop', subtitle: 'Experiência Açores', title: 'Gastronomia\nLocal', description: 'Delicie-se com os sabores tradicionais e pratos típicos dos Açores.', buttonText: 'Explorar agora' }
  ];

  const activeSlides = slides.length > 0 ? slides : defaultSlides;

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/slider?device=desktop`)
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setSlides(data);
        }
      })
      .catch(err => console.error("Error fetching desktop slider:", err));
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    
    const timer = setInterval(() => {
      setHeroIndex(prev => (prev + 1) % activeSlides.length);
    }, 6000);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearInterval(timer);
    };
  }, [activeSlides.length]);

  const categories = [
    { id: 'restaurants', label: 'RESTAURANTES', sub: 'Sabores locais', icon: <Utensils className="w-8 h-8 text-orange-600" />, color: '#ea580c' },
    { id: 'buses', label: 'AUTOCARROS', sub: 'Transportes', icon: <Bus className="w-8 h-8 text-orange-500" />, color: '#f97316' },
    { id: 'rentcar', label: 'RENT-A-CAR', sub: 'Aluguer de viaturas', icon: <Car className="w-8 h-8 text-emerald-600" />, color: '#059669' },
    { id: 'accommodation', label: 'ALOJAMENTOS', sub: 'Onde ficar', icon: <Tent className="w-8 h-8 text-purple-600" />, color: '#9333ea' },
    { id: 'activities', label: 'ATIVIDADES', sub: 'Aventuras únicas', icon: <LayoutGrid className="w-8 h-8 text-blue-600" />, color: '#2563eb' },
    { id: 'trails', label: 'TRILHOS', sub: 'Rotas incríveis', icon: <Mountain className="w-8 h-8 text-green-700" />, color: '#15803d' },
    { id: 'poi', label: 'ATRAÇÕES', sub: 'Pontos turísticos', icon: <MapPin className="w-8 h-8 text-green-600" />, color: '#22c55e' },
    { id: 'shops', label: 'COMÉRCIO', sub: 'Lojas e compras', icon: <ShoppingBag className="w-8 h-8 text-pink-600" />, color: '#db2777' },
    { id: 'beauty', label: 'BELEZA', sub: 'Estética e bem-estar', icon: <Sparkles className="w-8 h-8 text-rose-500" />, color: '#f43f5e' },
    { id: 'services', label: 'SERVIÇOS', sub: 'Profissionais', icon: <Wrench className="w-8 h-8 text-slate-600" />, color: '#475569' },
    { id: 'auto_repair', label: 'OFICINAS', sub: 'Manutenção auto', icon: <Settings className="w-8 h-8 text-red-600" />, color: '#dc2626' },
    { id: 'animals', label: 'ANIMAIS', sub: 'Pet shops e veterinários', icon: <Dog className="w-8 h-8 text-orange-600" />, color: '#ea580c' },
    { id: 'real_estate', label: 'IMOBILIÁRIA', sub: 'Comprar e alugar', icon: <Building2 className="w-8 h-8 text-blue-800" />, color: '#1e40af' },
    { id: 'gyms', label: 'GINÁSIOS', sub: 'Saúde e fitness', icon: <Dumbbell className="w-8 h-8 text-slate-800" />, color: '#1e293b' },
    { id: 'stands', label: 'STANDS', sub: 'Venda de veículos', icon: <CarFront className="w-8 h-8 text-indigo-600" />, color: '#4f46e5' },
    { id: 'offices', label: 'ESCRITÓRIOS', sub: 'Coworking e salas', icon: <Briefcase className="w-8 h-8 text-cyan-600" />, color: '#0891b2' },
    { id: 'it_services', label: 'INFORMÁTICA', sub: 'Suporte e tecnologia', icon: <Laptop className="w-8 h-8 text-slate-700" />, color: '#334155' },
    { id: 'bars', label: 'BARES/NOITE', sub: 'Diversão noturna', icon: <Wine className="w-8 h-8 text-purple-800" />, color: '#6b21a8' },
    { id: 'events', label: 'EVENTOS', sub: 'Espetáculos e festas', icon: <Calendar className="w-8 h-8 text-amber-600" />, color: '#d97706' },
    { id: 'municipal', label: 'SERVIÇOS PÚBLICOS', sub: 'Apoio municipal', icon: <Landmark className="w-8 h-8 text-sky-600" />, color: '#0284c7' },
  ];

  const features = [
    { icon: <Globe className="w-8 h-8 text-green-500" />, title: 'Experiências Autênticas', sub: 'Descubra o melhor dos Açores' },
    { icon: <ShieldCheck className="w-8 h-8 text-green-500" />, title: 'Reserva Segura', sub: 'Pagamentos 100% seguros' },
    { icon: <Clock className="w-8 h-8 text-green-500" />, title: 'Suporte Local', sub: 'Apoio dedicado 24/7' },
    { icon: <Tag className="w-8 h-8 text-green-500" />, title: 'Melhor Preço Garantido', sub: 'As melhores ofertas' }
  ];

  return (
    <div className="hidden lg:block bg-[#f8fafc] selection:bg-green-100 selection:text-green-900 pt-24 pb-16">
      
      {/* MAIN REDESIGNED GRID */}
      <div className="w-full px-8 grid grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: BANNER SLIDER & HIGHLIGHTS */}
        <div className="col-span-8 lg:col-span-9 flex flex-col gap-10">
          
          {/* CONTAINED BANNER SLIDER */}
          <div className="relative rounded-[2.5rem] overflow-hidden h-[500px] w-full shadow-xl bg-slate-900 group">
            
            {/* Background Images */}
            <AnimatePresence mode="wait">
              <motion.div
                key={heroIndex}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
                className="absolute inset-0 w-full h-full"
              >
                <div className="absolute inset-0 bg-black/35 z-10"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/10 z-10"></div>
                <img 
                  src={activeSlides[heroIndex]?.image} 
                  alt="Azores" 
                  className="w-full h-full object-cover" 
                />
              </motion.div>
            </AnimatePresence>

            {/* Slider Controls - Arrow Left / Right */}
            <button 
              onClick={() => setHeroIndex(prev => (prev - 1 + activeSlides.length) % activeSlides.length)}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center transition-all opacity-0 group-hover:opacity-100"
            >
              <ChevronLeft size={20} />
            </button>
            <button 
              onClick={() => setHeroIndex(prev => (prev + 1) % activeSlides.length)}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center transition-all opacity-0 group-hover:opacity-100"
            >
              <ChevronRight size={20} />
            </button>

            {/* Title & Subtitle Overlay */}
            <div className="absolute left-8 top-10 z-20 text-left max-w-2xl">
              <h1 className="text-4xl lg:text-5xl font-black text-white leading-tight mb-3 tracking-tighter" style={{ whiteSpace: 'pre-line' }}>
                O melhor dos Açores,<br/>para si e para os seus clientes
              </h1>
              <p className="text-sm lg:text-base text-white/95 font-medium leading-relaxed">
                Descubra experiências únicas, serviços de confiança e os melhores parceiros locais.
              </p>
            </div>

            {/* Center: Search Card */}
            <div className="absolute left-1/2 bottom-28 -translate-x-1/2 w-[92%] z-20">
              <div className="w-full shadow-2xl rounded-2xl bg-white p-3 flex items-center gap-3">
                <div className="flex-1 relative flex items-center">
                  <Search className="absolute left-4 text-green-600" size={20} />
                  <input 
                    type="text" 
                    placeholder="O que deseja explorar?" 
                    value={searchVal}
                    onChange={(e) => setSearchVal(e.target.value)}
                    onKeyDown={handleTextSubmit}
                    className="w-full h-12 bg-transparent border-none text-slate-800 placeholder-slate-400 pl-12 pr-12 focus:outline-none focus:ring-0 font-semibold text-sm"
                  />
                  <button 
                    type="button"
                    onClick={handleVoiceSearch}
                    className={`absolute right-3 p-2 rounded-full transition-all ${isListening ? 'bg-red-500 text-white animate-pulse' : 'text-slate-450 hover:text-green-605'}`}
                    title="Pesquisa por voz"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z" />
                    </svg>
                  </button>
                </div>
                <div className="h-8 w-[1px] bg-slate-200"></div>
                {/* Data Selector */}
                <div className="flex items-center gap-2 px-3 text-slate-550 cursor-pointer" onClick={onOpenIslandSelection}>
                  <Calendar size={18} className="text-slate-450" />
                  <div className="flex flex-col text-left">
                    <span className="text-[9px] font-black text-slate-400 uppercase leading-none mb-0.5">Data</span>
                    <span className="text-xs font-bold text-slate-800 leading-none">Selecionar</span>
                  </div>
                </div>
                <div className="h-8 w-[1px] bg-slate-200"></div>
                {/* Guests Selector */}
                <div className="flex items-center gap-2 px-3 text-slate-550 cursor-pointer">
                  <User size={18} className="text-slate-450" />
                  <div className="flex flex-col text-left">
                    <span className="text-[9px] font-black text-slate-400 uppercase leading-none mb-0.5">Hóspedes</span>
                    <span className="text-xs font-bold text-slate-800 leading-none">2 hóspedes</span>
                  </div>
                </div>
                <button 
                  onClick={() => props.onSearch && props.onSearch(searchVal)}
                  className="h-12 bg-green-600 hover:bg-green-700 text-white px-6 rounded-xl flex items-center justify-center font-bold text-xs uppercase tracking-wider transition-all active:scale-95 shadow-sm shrink-0"
                >
                  Pesquisar
                </button>
              </div>
            </div>

            {/* Bottom: Categories Translucent Pill */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[92%] bg-black/35 backdrop-blur-md border border-white/10 px-6 py-3.5 rounded-[1.75rem] shadow-xl flex items-center justify-between z-20">
              
              <button 
                onClick={() => {
                  const maxPage = Math.ceil(categories.length / 6) - 1;
                  setCategoryPage(prev => (prev > 0 ? prev - 1 : maxPage));
                }}
                className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all"
              >
                <ChevronLeft size={16} />
              </button>

              <div className="flex items-center gap-6 lg:gap-10 overflow-x-auto py-1 scrollbar-hide max-w-full justify-center flex-1 mx-4">
                {categories.slice(categoryPage * 6, (categoryPage + 1) * 6).map((cat) => (
                  <button 
                    key={cat.id} 
                    onClick={() => onNavigate(cat.id)}
                    className="flex flex-col items-center gap-1 group transition-all shrink-0 hover:scale-105"
                  >
                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow transition-transform group-hover:scale-110" style={{ color: cat.color }}>
                      {React.cloneElement(cat.icon as React.ReactElement, { className: "w-5 h-5" })}
                    </div>
                    <span className="text-[9px] font-bold text-white uppercase tracking-wider">{cat.label.charAt(0) + cat.label.slice(1).toLowerCase()}</span>
                  </button>
                ))}
              </div>

              <button 
                onClick={() => {
                  const maxPage = Math.ceil(categories.length / 6) - 1;
                  setCategoryPage(prev => (prev < maxPage ? prev + 1 : 0));
                }}
                className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all"
              >
                <ChevronRight size={16} />
              </button>

            </div>

          </div>

          <div className="flex flex-col gap-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-black text-slate-900 tracking-tight">Destaques</h3>
              <button 
                onClick={() => {
                  const element = document.getElementById('news-section');
                  if (element) element.scrollIntoView({ behavior: 'smooth' });
                }} 
                className="text-[11px] font-black text-green-600 hover:text-green-700 tracking-widest flex items-center gap-1.5 uppercase transition-colors"
              >
                Ver Notícias <ArrowRight size={12} />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
              {/* Highlight 1: Cais 20 */}
              <div 
                onClick={() => onNavigate('restaurants')} 
                className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer flex flex-col group"
              >
                <div className="relative h-44 overflow-hidden bg-slate-50">
                  <span className="absolute top-3 left-3 bg-emerald-600 text-white text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg z-10">Restaurante</span>
                  <img 
                    src={cais20.image.startsWith('http') ? cais20.image : `${API_BASE_URL}${cais20.image}`} 
                    alt={cais20.name} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                  />
                </div>
                <div className="p-5 flex flex-col text-left flex-1 justify-between">
                  <div>
                    <h4 className="text-sm font-black text-slate-900 mb-1 group-hover:text-green-600 transition-colors">{cais20.name}</h4>
                    <p className="text-xs text-slate-450 font-bold mb-3">{cais20.island === 'PDL' ? 'Ponta Delgada, São Miguel' : cais20.island}</p>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-slate-50">
                    <span className="text-xs font-bold text-amber-500 flex items-center gap-1">★ {cais20.rating} <span className="text-slate-400 font-medium">({cais20.reviews})</span></span>
                    <span className="text-xs font-black text-slate-800">€ €</span>
                  </div>
                </div>
              </div>

              {/* Highlight 2: Pedras do Mar */}
              <div 
                onClick={() => onNavigate('accommodation')} 
                className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer flex flex-col group"
              >
                <div className="relative h-44 overflow-hidden bg-slate-50">
                  <span className="absolute top-3 left-3 bg-purple-600 text-white text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg z-10">Alojamento</span>
                  <img 
                    src={hotelHighlight.image.startsWith('http') ? hotelHighlight.image : `${API_BASE_URL}${hotelHighlight.image}`} 
                    alt={hotelHighlight.name} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                  />
                </div>
                <div className="p-5 flex flex-col text-left flex-1 justify-between">
                  <div>
                    <h4 className="text-sm font-black text-slate-900 mb-1 group-hover:text-green-600 transition-colors">{hotelHighlight.name}</h4>
                    <p className="text-xs text-slate-450 font-bold mb-3">{hotelHighlight.island}</p>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-slate-50">
                    <span className="text-xs font-bold text-amber-500 flex items-center gap-1">★ {hotelHighlight.rating || 4.7} <span className="text-slate-400 font-medium">({hotelHighlight.reviews || 198})</span></span>
                    <span className="text-xs font-black text-slate-800">€€€ €</span>
                  </div>
                </div>
              </div>

              {/* Highlight 3: Lagoa do Fogo */}
              <div 
                onClick={() => onNavigate('trails')} 
                className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer flex flex-col group"
              >
                <div className="relative h-44 overflow-hidden bg-slate-50">
                  <span className="absolute top-3 left-3 bg-green-650 text-white text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg z-10">Trilho</span>
                  <img 
                    src={trailHighlight.image.startsWith('http') ? trailHighlight.image : `${API_BASE_URL}${trailHighlight.image}`} 
                    alt={trailHighlight.name} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                  />
                </div>
                <div className="p-5 flex flex-col text-left flex-1 justify-between">
                  <div>
                    <h4 className="text-sm font-black text-slate-900 mb-1 group-hover:text-green-600 transition-colors">{trailHighlight.name}</h4>
                    <p className="text-xs text-slate-450 font-bold mb-3">{trailHighlight.island}</p>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-slate-50">
                    <span className="text-xs font-bold text-amber-500 flex items-center gap-1">★ {trailHighlight.rating || 4.9} <span className="text-slate-400 font-medium">({trailHighlight.reviews || 256})</span></span>
                    <span className="text-xs font-black text-green-605">Grátis</span>
                  </div>
                </div>
              </div>

              {/* Highlight 4: Whale Watching */}
              <div 
                onClick={() => onNavigate('activities')} 
                className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer flex flex-col group"
              >
                <div className="relative h-44 overflow-hidden bg-slate-50">
                  <span className="absolute top-3 left-3 bg-blue-600 text-white text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg z-10">Atividade</span>
                  <img 
                    src={activityHighlight.image.startsWith('http') ? activityHighlight.image : `${API_BASE_URL}${activityHighlight.image}`} 
                    alt={activityHighlight.name} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                  />
                </div>
                <div className="p-5 flex flex-col text-left flex-1 justify-between">
                  <div>
                    <h4 className="text-sm font-black text-slate-900 mb-1 group-hover:text-green-600 transition-colors">{activityHighlight.name}</h4>
                    <p className="text-xs text-slate-450 font-bold mb-3">{activityHighlight.island}</p>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-slate-50">
                    <span className="text-xs font-bold text-amber-500 flex items-center gap-1">★ {activityHighlight.rating || 4.9} <span className="text-slate-400 font-medium">({activityHighlight.reviews || 412})</span></span>
                    <span className="text-xs font-black text-slate-800">€ €</span>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: SIDEBAR */}
        <div className="col-span-4 lg:col-span-3 flex flex-col gap-6 shrink-0">
          
          {/* Card 1: Custom Weather / clock */}
          <DesktopWeatherCard />

          {/* Card 2: Join Business Card */}
          <div className="bg-[#031B33] text-white rounded-3xl p-7 shadow-lg flex flex-col gap-6 text-left border border-slate-900 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full blur-xl pointer-events-none"></div>
            
            <div className="flex flex-col gap-2">
              <span className="text-[9px] font-black tracking-wider text-green-400 uppercase leading-none">
                ← É empresa ou prestador de serviços?
              </span>
              <h3 className="text-2xl font-black leading-tight tracking-tight">
                Junte o seu negócio<br/>
                à <span className="text-green-500">Azores to You</span>
              </h3>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed font-semibold">
              Aumente a sua visibilidade, alcance mais clientes e faça parte da maior plataforma de experiências dos Açores.
            </p>

            {/* Checklist */}
            <ul className="flex flex-col gap-3">
              {[
                'Mais visibilidade para o seu negócio',
                'Acesso a uma base crescente de clientes',
                'Gestão fácil de reservas e disponibilidade',
                'Apoio dedicado e sem custos iniciais'
              ].map((benefit, i) => (
                <li key={i} className="flex items-start gap-2.5 text-[11px] font-bold text-slate-205 leading-snug">
                  <Check size={14} className="text-green-500 shrink-0 mt-0.5" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3 mt-2">
              <button 
                onClick={() => setShowBusinessModal(true)}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3.5 px-6 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-md shadow-green-600/10 active:scale-95"
              >
                <span>Registar o meu negócio</span>
                <ArrowRight size={14} />
              </button>
              
              <button 
                onClick={() => setShowSaberMaisModal(true)}
                className="w-full bg-transparent border border-white/20 hover:border-white/40 text-white py-3.5 px-6 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 active:scale-95"
              >
                <span>Saber mais</span>
                <Info size={14} />
              </button>
            </div>

          </div>

          {/* Card 3: Help / WhatsApp Card */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex items-center gap-5 text-left">
            <a 
              href="https://wa.me/351910251062" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="p-3 bg-green-50 hover:bg-green-100 text-green-600 rounded-2xl border border-green-100 shrink-0 transition-all hover:scale-105 active:scale-90"
              title="Iniciar conversa no WhatsApp"
            >
              <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
                <path d="M12.012 2c-5.506 0-9.988 4.482-9.988 9.988 0 1.76.459 3.475 1.33 4.988L2 22l5.176-1.353c1.46.797 3.1 1.218 4.836 1.218 5.506 0 9.988-4.482 9.988-9.988S17.518 2 12.012 2zm6.657 14.331c-.274.773-1.358 1.409-1.875 1.488-.475.074-.951.13-2.923-.655-2.522-1.004-4.148-3.578-4.275-3.743-.122-.165-.989-1.314-.989-2.508 0-1.194.624-1.782.846-2.023.22-.241.487-.302.651-.302.164 0 .328.001.47.009.148.007.348-.056.545.419.198.483.676 1.651.737 1.772.06.122.1.264.019.426-.08.163-.122.264-.243.407-.122.143-.255.32-.365.428-.122.122-.249.255-.107.498.142.241.63 1.037 1.354 1.682.93.83 1.714 1.087 1.958 1.209.243.122.385.101.528-.06.143-.165.61-.71.773-.952.163-.243.328-.203.549-.122.22.081 1.396.658 1.637.779.242.122.404.183.465.284.06.102.06.586-.214 1.359z"/>
              </svg>
            </a>
            <div className="flex flex-col">
              <span className="text-sm font-black text-slate-900 leading-none mb-0.5">Precisa de ajuda?</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Estamos disponíveis</span>
              <a 
                href="https://wa.me/351910251062" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-sm font-black text-green-600 hover:text-green-700 transition-colors leading-none mb-1 flex items-center gap-1"
              >
                +351 910 251 062
              </a>
              <span className="text-[10px] font-bold text-slate-400">Todos os dias: 09h00 – 19h00</span>
            </div>
          </div>

        </div>

      </div>

      {/* REGIONAL NEWS CENTER (ESTILO RTP AÇORES) */}
      <section className="py-16 max-w-7xl mx-auto px-8 border-t border-slate-150 mt-16" id="news-section">
        <div className="flex flex-col gap-8">
          
          {/* Header and Island Filters */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-150">
            <div className="text-left">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Notícias da Região</h2>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-1">Acompanhe a atualidade do arquipélago</p>
            </div>
            
            {/* Island Filter Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto py-1 scrollbar-hide max-w-full">
              {['Todas', 'São Miguel', 'Terceira', 'Faial', 'Pico', 'São Jorge', 'Flores', 'Graciosa', 'Santa Maria', 'Corvo'].map((island) => (
                <button
                  key={island}
                  onClick={() => setSelectedNewsIsland(island)}
                  className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap ${
                    selectedNewsIsland === island 
                      ? 'bg-green-600 text-white shadow-sm' 
                      : 'bg-white border border-slate-200 text-slate-650 hover:bg-slate-50'
                  }`}
                >
                  {island}
                </button>
              ))}
            </div>
          </div>

          {/* News Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {news
              .filter((item) => selectedNewsIsland === 'Todas' || item.island === selectedNewsIsland)
              .map((item) => (
                <div 
                  key={item.id}
                  onClick={() => setSelectedNews(item)}
                  className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer flex flex-col group text-left"
                >
                  <div className="relative h-44 overflow-hidden bg-slate-100">
                    <span className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-sm text-white text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg z-10">
                      {item.island}
                    </span>
                    <img 
                      src={item.image.startsWith('http') ? item.image : `${API_BASE_URL}${item.image}`} 
                      alt={item.title} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                    />
                  </div>
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">
                        {item.date} • {item.time}
                      </span>
                      <h4 className="text-sm font-black text-slate-900 leading-snug group-hover:text-green-600 transition-colors line-clamp-2 mb-2">
                        {item.title}
                      </h4>
                      <p className="text-xs text-slate-450 line-clamp-3 leading-relaxed font-bold">
                        {item.description}
                      </p>
                    </div>
                    <div className="text-[10px] font-black text-green-605 uppercase tracking-widest mt-4 flex items-center gap-1 group-hover:text-green-700">
                      Ler notícia <ArrowRight size={10} className="transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </div>
              ))}
            {news.filter((item) => selectedNewsIsland === 'Todas' || item.island === selectedNewsIsland).length === 0 && (
              <div className="col-span-full py-16 text-center">
                <span className="text-sm font-bold text-slate-405 uppercase tracking-wider">Sem notícias disponíveis para esta ilha.</span>
              </div>
            )}
          </div>

        </div>
      </section>

      {/* MODAL: REGISTAR NEGÓCIO */}
      <AnimatePresence>
        {showBusinessModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[99999] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-[2.5rem] shadow-2xl max-w-lg w-full overflow-hidden border border-slate-100"
            >
              <div className="p-8">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight">Registar o meu negócio</h3>
                  <button 
                    onClick={() => setShowBusinessModal(false)}
                    className="w-10 h-10 rounded-full bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-500 transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>

                {bizSuccess ? (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center py-12 text-center"
                  >
                    <div className="w-16 h-16 rounded-full bg-green-100 text-green-600 flex items-center justify-center mb-4">
                      <Check size={32} />
                    </div>
                    <h4 className="text-lg font-black text-slate-900 mb-2">Pedido Enviado!</h4>
                    <p className="text-sm text-slate-500 font-medium max-w-xs leading-relaxed">
                      Obrigado pela sua candidatura. A nossa equipa irá analisar e entrar em contacto muito em breve.
                    </p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleBizSubmit} className="flex flex-col gap-4 text-left">
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5">Nome do Negócio</label>
                      <input 
                        type="text" 
                        required
                        value={bizForm.name}
                        onChange={(e) => setBizForm({...bizForm, name: e.target.value})}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-green-500/30"
                        placeholder="Ex: Restaurante O Pescador"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5">Categoria</label>
                        <select 
                          value={bizForm.category}
                          onChange={(e) => setBizForm({...bizForm, category: e.target.value})}
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-green-500/30"
                        >
                          <option value="restaurants">Restauração</option>
                          <option value="accommodation">Alojamento</option>
                          <option value="rentcar">Rent-a-car</option>
                          <option value="activities">Atividades/Tours</option>
                          <option value="services">Serviços/Outro</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5">Ilha</label>
                        <select 
                          value={bizForm.island}
                          onChange={(e) => setBizForm({...bizForm, island: e.target.value})}
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-green-500/30"
                        >
                          {['São Miguel', 'Terceira', 'Faial', 'Pico', 'São Jorge', 'Flores', 'Graciosa', 'Santa Maria', 'Corvo'].map(i => (
                            <option key={i} value={i}>{i}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5">Nome do Responsável</label>
                        <input 
                          type="text" 
                          required
                          value={bizForm.contact}
                          onChange={(e) => setBizForm({...bizForm, contact: e.target.value})}
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-green-500/30"
                          placeholder="Ex: João Silva"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5">Telefone / Telemóvel</label>
                        <input 
                          type="tel" 
                          required
                          value={bizForm.phone}
                          onChange={(e) => setBizForm({...bizForm, phone: e.target.value})}
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-green-500/30"
                          placeholder="Ex: 912345678"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5">E-mail</label>
                      <input 
                        type="email" 
                        required
                        value={bizForm.email}
                        onChange={(e) => setBizForm({...bizForm, email: e.target.value})}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-green-500/30"
                        placeholder="Ex: contacto@empresa.com"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5">Mensagem / Informações Adicionais</label>
                      <textarea 
                        value={bizForm.notes}
                        onChange={(e) => setBizForm({...bizForm, notes: e.target.value})}
                        rows={3}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-green-500/30 resize-none"
                        placeholder="Fale-nos um pouco sobre o seu negócio..."
                      />
                    </div>

                    <button 
                      type="submit"
                      className="w-full py-4 mt-2 bg-green-600 hover:bg-green-700 text-white rounded-xl font-black text-xs uppercase tracking-widest transition-all active:scale-95 shadow-md"
                    >
                      Enviar Candidatura
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL: SABER MAIS */}
      <AnimatePresence>
        {showSaberMaisModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[99999] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-[2.5rem] shadow-2xl max-w-lg w-full overflow-hidden border border-slate-100"
            >
              <div className="p-8">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight">Vantagens Azores to You</h3>
                  <button 
                    onClick={() => setShowSaberMaisModal(false)}
                    className="w-10 h-10 rounded-full bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-500 transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="flex flex-col gap-6 text-left">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-green-50 text-green-600 flex items-center justify-center shrink-0">
                      <LayoutGrid size={24} />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-slate-900 mb-1">Painel Completo de Gestão</h4>
                      <p className="text-xs text-slate-500 font-bold leading-relaxed">
                        Gerencie as suas reservas, disponibilidades, preços e ementas tudo num único local intuitivo e moderno.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-green-50 text-green-600 flex items-center justify-center shrink-0">
                      <Globe size={24} />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-slate-900 mb-1">Visibilidade Multi-língua</h4>
                      <p className="text-xs text-slate-500 font-bold leading-relaxed">
                        O seu negócio será traduzido e apresentado em 5 idiomas, alcançando turistas de todo o mundo.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-green-50 text-green-600 flex items-center justify-center shrink-0">
                      <Clock size={24} />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-slate-900 mb-1">Apoio Técnico Dedicado</h4>
                      <p className="text-xs text-slate-500 font-bold leading-relaxed">
                        A nossa equipa local oferece suporte imediato para garantir que tira o máximo proveito da plataforma.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-green-50 text-green-600 flex items-center justify-center shrink-0">
                      <CreditCard size={24} />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-slate-900 mb-1">Sem Custos Iniciais</h4>
                      <p className="text-xs text-slate-500 font-bold leading-relaxed">
                        Não existem taxas de adesão ou subscrições obrigatórias. Só ganha se nós lhe trouxermos clientes.
                      </p>
                    </div>
                  </div>

                  <button 
                    onClick={() => {
                      setShowSaberMaisModal(false);
                      setShowBusinessModal(true);
                    }}
                    className="w-full py-4 mt-4 bg-green-600 hover:bg-green-700 text-white rounded-xl font-black text-xs uppercase tracking-widest transition-all active:scale-95"
                  >
                    Aderir Agora
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL: LER NOTÍCIA */}
      <AnimatePresence>
        {selectedNews && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[99999] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-[2.5rem] shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-100 text-left"
            >
              <div className="relative h-64 bg-slate-900">
                <img 
                  src={selectedNews.image.startsWith('http') ? selectedNews.image : `${API_BASE_URL}${selectedNews.image}`} 
                  alt={selectedNews.title} 
                  className="w-full h-full object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                <button 
                  onClick={() => setSelectedNews(null)}
                  className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/40 hover:bg-black/65 text-white flex items-center justify-center transition-colors z-20"
                >
                  <X size={20} />
                </button>
                <div className="absolute bottom-6 left-8 right-8 text-white">
                  <span className="bg-green-600 text-white text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg">
                    {selectedNews.island}
                  </span>
                  <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest ml-3">
                    {selectedNews.date} • {selectedNews.time}
                  </span>
                  <h3 className="text-xl lg:text-2xl font-black tracking-tight mt-3 leading-tight">
                    {selectedNews.title}
                  </h3>
                </div>
              </div>
              <div className="p-8 max-h-[60vh] overflow-y-auto">
                <p className="text-sm font-semibold text-slate-705 leading-relaxed whitespace-pre-line">
                  {selectedNews.content || selectedNews.description}
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default DesktopView;
