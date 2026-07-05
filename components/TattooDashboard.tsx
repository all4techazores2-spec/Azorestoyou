import React, { useState, useEffect, useRef } from 'react';
import { Restaurant } from '../types';
import {
  LogOut, Bell, Search, Plus, ChevronRight, Calendar, Users,
  Clock, Star, Settings, Menu, X, Home, MessageSquare,
  BarChart3, CreditCard, Package, Layers, Image as ImageIcon,
  ShoppingCart, FileText, Award, User, ChevronLeft,
  ArrowRight, Clock3, Sparkles, Zap, TrendingUp, DollarSign,
  Cloud, Sun, CloudRain, CloudLightning, MapPin, Paintbrush
} from 'lucide-react';
import { API_BASE_URL } from '../config';

interface TattooDashboardProps {
  business: Restaurant;
  onUpdateBusiness: (updated: Restaurant) => void;
  onLogout: () => void;
}

// ─── DESIGN TOKENS ───────────────────────────────────────────────────────────
const C = {
  bg: '#0E1014',
  card: '#171A20',
  hover: '#1E222B',
  border: '#2A2F39',
  text: '#F8F8F8',
  muted: '#A0A4AE',
  gold: '#C9A66B',
  goldHover: '#E1C28A',
  green: '#32D583',
  orange: '#F59E0B',
  red: '#EF4444',
  blue: '#2D6DF6',
};

// ─── WEATHER TYPES ────────────────────────────────────────────────────────────
interface WeatherData { temp: number; conditionCode: number; windSpeed: number; humidity: number; locationName: string; timestamp?: number; }

function getWeatherDesc(code: number): { desc: string; icon: React.ReactNode } {
  if (code === 0) return { desc: 'Céu Limpo', icon: <Sun size={28} color={C.gold} /> };
  if (code >= 1 && code <= 3) return { desc: 'Poucas Nuvens', icon: <Cloud size={28} color="#A0A4AE" /> };
  if (code >= 61 && code <= 65) return { desc: 'Chuva', icon: <CloudRain size={28} color="#60A5FA" /> };
  if (code >= 95) return { desc: 'Trovoada', icon: <CloudLightning size={28} color="#A78BFA" /> };
  return { desc: 'Nublado', icon: <Cloud size={28} color="#A0A4AE" /> };
}

// ─── HERO SLIDES ──────────────────────────────────────────────────────────────
const HERO_SLIDES = [
  { url: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=1400&q=80', caption: 'Arte em Cada Detalhe' },
  { url: 'https://images.unsplash.com/photo-1565058379802-bbe93b2f703a?w=1400&q=80', caption: 'Realismo & Finesse' },
  { url: 'https://images.unsplash.com/photo-1590246814883-57764c4a3d7f?w=1400&q=80', caption: 'Estúdio Premium AzoresToYou' },
];

// ─── MOCK DATA ────────────────────────────────────────────────────────────────
const MOCK_ORDERS = [
  { id: 'o1', client: 'Lucas Andrade', style: 'Realismo – Leão', time: 'Hoje, 14:45', status: 'new', thumb: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=80&q=60' },
  { id: 'o2', client: 'Mariana Costa', style: 'Tribal – Ombro', time: 'Hoje, 15:10', status: 'analyzing', thumb: 'https://images.unsplash.com/photo-1590246814883-57764c4a3d7f?w=80&q=60' },
  { id: 'o3', client: 'Diogo Oliveira', style: 'Cover Up – Caveira', time: 'Ontem, 18:40', status: 'changes', thumb: 'https://images.unsplash.com/photo-1565058379802-bbe93b2f703a?w=80&q=60' },
  { id: 'o4', client: 'Beatriz Sousa', style: 'Tatuagem Floral', time: 'Ontem, 16:30', status: 'proposal_sent', thumb: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=80&q=60' },
];

const MOCK_SCHEDULE = [
  { time: '10:00', client: 'Lucas Andrade', service: 'Tribal - Leão', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=60', status: 'confirmed' },
  { time: '12:00', client: 'Mariana Costa', service: 'Realismo – Leão', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=60', status: 'confirmed' },
  { time: '15:00', client: 'Ricardo Mendes', service: 'Jackeite – Costas', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60', status: 'arriving' },
  { time: '17:30', client: 'Ana Ferreira', service: 'Floral – Antebraço', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=60', status: 'confirmed' },
  { time: '19:00', client: 'Pedro Carvalho', service: 'Black & Grey – Braço', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=60', status: 'confirmed' },
];

const MOCK_PROJECTS = [
  { id: 'p1', name: 'Realismo – Tigre', artist: 'João Pereira', status: 'done', progress: 100, thumb: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=80&q=60' },
  { id: 'p2', name: 'Geométrico – Antebraço', artist: 'Rita Valente', status: 'done', progress: 100, thumb: 'https://images.unsplash.com/photo-1590246814883-57764c4a3d7f?w=80&q=60' },
  { id: 'p3', name: 'Old School – Âncora', artist: 'Miguel Santos', status: 'done', progress: 100, thumb: 'https://images.unsplash.com/photo-1565058379802-bbe93b2f703a?w=80&q=60' },
  { id: 'p4', name: 'Fineline – Borboleta', artist: 'Clara Mortes', status: 'in_progress', progress: 60, thumb: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=80&q=60' },
];

const MOCK_NOTIFICATIONS = [
  { id: 'n1', text: 'Novo pedido de tatuagem de Lucas Andrade', when: 'Agora', icon: <Paintbrush size={16} color={C.gold} /> },
  { id: 'n2', text: 'Pagamento de sinal recebido – Mariana Costa', when: '15 min', icon: <CreditCard size={16} color={C.green} /> },
  { id: 'n3', text: 'Avaliação recebida de João Pereira ★★★★★', when: '1h', icon: <Star size={16} color={C.orange} /> },
];

const ORDER_STATUS: Record<string, { label: string; color: string; bg: string }> = {
  new: { label: 'Novo', color: C.blue, bg: 'rgba(45,109,246,0.15)' },
  analyzing: { label: 'Em Análise', color: C.orange, bg: 'rgba(245,158,11,0.15)' },
  changes: { label: 'Precisa Alterações', color: C.red, bg: 'rgba(239,68,68,0.15)' },
  proposal_sent: { label: 'Proposta Enviada', color: C.green, bg: 'rgba(50,213,131,0.15)' },
  signal_paid: { label: 'Sinal Pago', color: C.gold, bg: 'rgba(201,166,107,0.15)' },
  confirmed: { label: 'Confirmado', color: C.green, bg: 'rgba(50,213,131,0.15)' },
};

const SCHEDULE_STATUS: Record<string, { label: string; color: string }> = {
  confirmed: { label: 'Confirmado', color: C.green },
  arriving: { label: 'A Chegar', color: C.orange },
  done: { label: 'Concluído', color: C.muted },
};

type TabId = 'dashboard' | 'orders' | 'agenda' | 'clients' | 'projects' | 'artists' | 'gallery' | 'pos' | 'quotes' | 'payments' | 'products' | 'stock' | 'messages' | 'reviews' | 'marketing' | 'reports' | 'settings';

const MENU_ITEMS: { id: TabId; label: string; icon: React.ReactNode; badge?: number }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: <Home size={18} /> },
  { id: 'orders', label: 'Pedidos de Tatuagem', icon: <Paintbrush size={18} />, badge: 4 },
  { id: 'agenda', label: 'Agenda', icon: <Calendar size={18} /> },
  { id: 'clients', label: 'Clientes', icon: <Users size={18} /> },
  { id: 'projects', label: 'Projetos', icon: <Layers size={18} /> },
  { id: 'artists', label: 'Artistas', icon: <Award size={18} /> },
  { id: 'gallery', label: 'Galeria', icon: <ImageIcon size={18} /> },
  { id: 'pos', label: 'POS Vendas', icon: <ShoppingCart size={18} /> },
  { id: 'quotes', label: 'Orçamentos', icon: <FileText size={18} /> },
  { id: 'payments', label: 'Pagamentos', icon: <CreditCard size={18} /> },
  { id: 'products', label: 'Produtos', icon: <Package size={18} /> },
  { id: 'stock', label: 'Stock', icon: <BarChart3 size={18} /> },
  { id: 'messages', label: 'Mensagens', icon: <MessageSquare size={18} />, badge: 2 },
  { id: 'reviews', label: 'Avaliações', icon: <Star size={18} /> },
  { id: 'marketing', label: 'Marketing', icon: <Zap size={18} /> },
  { id: 'reports', label: 'Relatórios', icon: <TrendingUp size={18} /> },
  { id: 'settings', label: 'Definições', icon: <Settings size={18} /> },
];

// ─── WEATHER CARD ─────────────────────────────────────────────────────────────
const WeatherCard: React.FC = () => {
  const [time, setTime] = useState('');
  const [dateFull, setDateFull] = useState('');
  const [weather, setWeather] = useState<WeatherData | null>(null);

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' }));
      setDateFull(now.toLocaleDateString('pt-PT', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }));
    };
    tick();
    const iv = setInterval(tick, 1000);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => {
    const fetchW = async () => {
      try {
        const cacheKey = 'tattoo_weather_pdl';
        const cached = localStorage.getItem(cacheKey);
        if (cached) {
          const p: WeatherData & { timestamp: number } = JSON.parse(cached);
          if (p.timestamp && Date.now() - p.timestamp < 600000) { setWeather(p); return; }
        }
        const r = await fetch('https://api.open-meteo.com/v1/forecast?latitude=37.7412&longitude=-25.6756&current=temperature_2m,weather_code,wind_speed_10m,relative_humidity_2m&timezone=auto');
        if (!r.ok) return;
        const d = await r.json();
        const w: WeatherData & { timestamp: number } = {
          temp: Math.round(d.current.temperature_2m),
          conditionCode: d.current.weather_code,
          windSpeed: Math.round(d.current.wind_speed_10m),
          humidity: Math.round(d.current.relative_humidity_2m),
          locationName: 'Ponta Delgada',
          timestamp: Date.now(),
        };
        setWeather(w);
        localStorage.setItem(cacheKey, JSON.stringify(w));
      } catch { /* silent */ }
    };
    fetchW();
  }, []);

  const wInfo = weather ? getWeatherDesc(weather.conditionCode) : null;
  return (
    <div style={{
      background: 'rgba(14,16,20,0.72)',
      backdropFilter: 'blur(28px)',
      WebkitBackdropFilter: 'blur(28px)',
      border: `1.5px solid rgba(201,166,107,0.3)`,
      borderRadius: 24,
      padding: '22px 28px',
      minWidth: 200,
      boxShadow: '0 8px 48px rgba(201,166,107,0.18), 0 2px 16px rgba(0,0,0,0.5)',
      textAlign: 'center',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 3,
      position: 'absolute',
      top: '50%', left: '50%',
      transform: 'translate(-50%,-50%)',
      zIndex: 20,
    }}>
      <Clock3 size={16} color={C.gold} style={{ marginBottom: 2 }} />
      <div style={{ fontSize: 42, fontWeight: 900, color: C.text, letterSpacing: -2, lineHeight: 1 }}>{time || '--:--'}</div>
      <div style={{ fontSize: 11, color: C.muted, fontWeight: 700, textTransform: 'capitalize', marginTop: 2 }}>{dateFull}</div>
      {wInfo && weather && (
        <>
          <div style={{ margin: '8px 0 2px' }}>{wInfo.icon}</div>
          <div style={{ fontSize: 22, fontWeight: 900, color: C.text }}>{weather.temp}°</div>
          <div style={{ fontSize: 11, color: C.gold, fontWeight: 700 }}>{wInfo.desc}</div>
          <div style={{ fontSize: 10, color: C.muted, marginTop: 2, display: 'flex', alignItems: 'center', gap: 4 }}>
            <MapPin size={10} color={C.gold} /> Ponta Delgada, S. Miguel
          </div>
        </>
      )}
    </div>
  );
};

// ─── HERO SLIDER ──────────────────────────────────────────────────────────────
const HeroSlider: React.FC<{ slides: typeof HERO_SLIDES }> = ({ slides }) => {
  const [current, setCurrent] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const next = () => setCurrent(c => (c + 1) % slides.length);
  const prev = () => setCurrent(c => (c - 1 + slides.length) % slides.length);
  useEffect(() => { timerRef.current = setInterval(next, 5000); return () => { if (timerRef.current) clearInterval(timerRef.current); }; }, []);
  return (
    <div style={{ height: 350, borderRadius: 20, overflow: 'hidden', position: 'relative', background: '#000' }}>
      {slides.map((s, i) => (
        <div key={i} style={{ position: 'absolute', inset: 0, backgroundImage: `url(${s.url})`, backgroundSize: 'cover', backgroundPosition: 'center', opacity: i === current ? 1 : 0, transition: 'opacity 0.8s ease' }} />
      ))}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(14,16,20,0.25), rgba(14,16,20,0.55))' }} />
      <div style={{ position: 'absolute', bottom: 24, left: 28, zIndex: 10 }}>
        <div style={{ fontSize: 13, color: C.gold, fontWeight: 800, letterSpacing: 3, textTransform: 'uppercase' }}>{slides[current].caption}</div>
      </div>
      <button onClick={prev} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', zIndex: 20, background: 'rgba(14,16,20,0.6)', border: `1px solid ${C.border}`, borderRadius: 12, padding: 8, color: C.text, cursor: 'pointer', backdropFilter: 'blur(8px)', display: 'flex' }}>
        <ChevronLeft size={18} />
      </button>
      <button onClick={next} style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', zIndex: 20, background: 'rgba(14,16,20,0.6)', border: `1px solid ${C.border}`, borderRadius: 12, padding: 8, color: C.text, cursor: 'pointer', backdropFilter: 'blur(8px)', display: 'flex' }}>
        <ChevronRight size={18} />
      </button>
      <div style={{ position: 'absolute', bottom: 24, right: 24, display: 'flex', gap: 6, zIndex: 10 }}>
        {slides.map((_, i) => (
          <button key={i} onClick={() => setCurrent(i)} style={{ width: i === current ? 20 : 6, height: 6, borderRadius: 3, background: i === current ? C.gold : `${C.gold}44`, border: 'none', cursor: 'pointer', transition: 'all 0.3s ease' }} />
        ))}
      </div>
      <WeatherCard />
    </div>
  );
};

// ─── STAT CARD ────────────────────────────────────────────────────────────────
const StatCard: React.FC<{ icon: React.ReactNode; label: string; value: string; sub?: string; accent?: string; progress?: number }> = ({ icon, label, value, sub, accent, progress }) => (
  <div
    style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 20, padding: '22px 22px 18px', display: 'flex', flexDirection: 'column', gap: 10, flex: 1, minWidth: 170, cursor: 'default', transition: 'all 0.25s' }}
    onMouseEnter={e => (e.currentTarget.style.background = C.hover)}
    onMouseLeave={e => (e.currentTarget.style.background = C.card)}
  >
    <div style={{ width: 44, height: 44, borderRadius: 14, background: `${accent || C.gold}22`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{icon}</div>
    <div>
      <div style={{ fontSize: 28, fontWeight: 900, color: C.text, letterSpacing: -1, lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 12, color: C.muted, fontWeight: 600, marginTop: 4 }}>{label}</div>
      {sub && <div style={{ fontSize: 11, color: accent || C.gold, fontWeight: 700, marginTop: 2 }}>{sub}</div>}
    </div>
    {progress !== undefined && (
      <div>
        <div style={{ height: 4, borderRadius: 2, background: C.border, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${progress}%`, background: accent || C.gold, borderRadius: 2 }} />
        </div>
        <div style={{ fontSize: 10, color: C.muted, marginTop: 4, fontWeight: 600 }}>{progress}% do objetivo</div>
      </div>
    )}
  </div>
);

// ─── PANEL ────────────────────────────────────────────────────────────────────
const Panel: React.FC<{ title: string; link?: string; onLinkClick?: () => void; children: React.ReactNode }> = ({ title, link, onLinkClick, children }) => (
  <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 20, padding: 22, display: 'flex', flexDirection: 'column', gap: 14 }}>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div style={{ fontSize: 13, fontWeight: 800, color: C.text, letterSpacing: 0.5, textTransform: 'uppercase' }}>{title}</div>
      {link && <button onClick={onLinkClick} style={{ fontSize: 11, color: C.gold, fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>{link} <ArrowRight size={12} /></button>}
    </div>
    {children}
  </div>
);

// ─── PLACEHOLDER ──────────────────────────────────────────────────────────────
const Placeholder: React.FC<{ label: string; icon: React.ReactNode }> = ({ label, icon }) => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 400, gap: 20 }}>
    <div style={{ width: 72, height: 72, borderRadius: 20, background: `${C.gold}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.gold }}>{icon}</div>
    <div style={{ fontSize: 22, fontWeight: 900, color: C.text }}>{label}</div>
    <div style={{ fontSize: 14, color: C.muted, fontWeight: 600, maxWidth: 320, textAlign: 'center' }}>
      Esta secção está em desenvolvimento. Em breve disponível na plataforma AzoresToYou.
    </div>
  </div>
);

// ─── MAIN ─────────────────────────────────────────────────────────────────────
const TattooDashboard: React.FC<TattooDashboardProps> = ({ business, onUpdateBusiness, onLogout }) => {
  const [activeTab, setActiveTab] = useState<TabId>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const studioName = business.name || 'Tattoo Studio';
  const studioAvatar = business.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(studioName)}&background=C9A66B&color=0E1014&bold=true&size=128`;

  // ── SIDEBAR ──────────────────────────────────────────────────────────────────
  const renderSidebar = () => (
    <aside style={{ width: sidebarOpen ? 256 : 72, minHeight: '100vh', background: C.card, borderRight: `1px solid ${C.border}`, display: 'flex', flexDirection: 'column', transition: 'width 0.3s cubic-bezier(.4,0,.2,1)', overflow: 'hidden', flexShrink: 0, position: 'sticky', top: 0, zIndex: 30, maxHeight: '100vh' }}>
      {/* Header */}
      <div style={{ padding: '22px 16px 16px', borderBottom: `1px solid ${C.border}`, flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
          <div style={{ width: 34, height: 34, borderRadius: 10, background: `linear-gradient(135deg, ${C.blue}, #1a4fd6)`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <span style={{ fontSize: 14, fontWeight: 900, color: '#fff' }}>A</span>
          </div>
          {sidebarOpen && (
            <div>
              <div style={{ fontSize: 11, fontWeight: 900, color: C.text, letterSpacing: 1 }}>AZORESTOYOU</div>
              <div style={{ fontSize: 9, color: C.muted, fontWeight: 600 }}>TATTOO PLATFORM</div>
            </div>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <img src={studioAvatar} alt="studio" style={{ width: 40, height: 40, borderRadius: 12, objectFit: 'cover', border: `2px solid ${C.gold}` }} />
            <span style={{ position: 'absolute', bottom: 1, right: 1, width: 9, height: 9, borderRadius: '50%', background: C.green, border: `2px solid ${C.card}` }} />
          </div>
          {sidebarOpen && (
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: C.text, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{studioName}</div>
              <div style={{ fontSize: 10, color: C.green, fontWeight: 700 }}>● Online</div>
            </div>
          )}
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, overflowY: 'auto', padding: '10px 8px', scrollbarWidth: 'none' }}>
        {MENU_ITEMS.map(item => {
          const active = activeTab === item.id;
          return (
            <button key={item.id} onClick={() => setActiveTab(item.id)}
              title={!sidebarOpen ? item.label : ''}
              style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: sidebarOpen ? '10px 14px' : '10px 0', justifyContent: sidebarOpen ? 'flex-start' : 'center', borderRadius: 12, marginBottom: 2, border: 'none', cursor: 'pointer', background: active ? `${C.gold}18` : 'transparent', color: active ? C.gold : C.muted, fontWeight: active ? 800 : 600, fontSize: 13, transition: 'all 0.18s', position: 'relative', textAlign: 'left' }}
              onMouseEnter={e => { if (!active) { (e.currentTarget as HTMLElement).style.background = C.hover; (e.currentTarget as HTMLElement).style.color = C.text; } }}
              onMouseLeave={e => { if (!active) { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.color = C.muted; } }}
            >
              {active && <span style={{ position: 'absolute', left: 0, top: 8, bottom: 8, width: 3, borderRadius: 2, background: C.gold }} />}
              <span style={{ flexShrink: 0 }}>{item.icon}</span>
              {sidebarOpen && <span style={{ flex: 1, whiteSpace: 'nowrap' }}>{item.label}</span>}
              {sidebarOpen && item.badge && <span style={{ fontSize: 10, fontWeight: 900, background: C.gold, color: C.bg, borderRadius: 8, padding: '1px 7px' }}>{item.badge}</span>}
            </button>
          );
        })}
      </nav>

      {/* Bottom */}
      <div style={{ padding: '10px 8px', borderTop: `1px solid ${C.border}`, flexShrink: 0 }}>
        {[{ icon: <User size={18} />, label: 'Perfil' }, { icon: <Settings size={18} />, label: 'Configurações' }].map(b => (
          <div key={b.label} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '9px 14px', justifyContent: sidebarOpen ? 'flex-start' : 'center', borderRadius: 12, cursor: 'pointer', color: C.muted, fontSize: 13, fontWeight: 600 }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = C.hover; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}>
            {b.icon}{sidebarOpen && b.label}
          </div>
        ))}
        <button onClick={onLogout} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '9px 14px', justifyContent: sidebarOpen ? 'flex-start' : 'center', borderRadius: 12, border: 'none', cursor: 'pointer', background: 'transparent', color: C.red, fontWeight: 700, fontSize: 13 }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.1)'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
          <LogOut size={18} />{sidebarOpen && 'Logout'}
        </button>
      </div>
    </aside>
  );

  // ── HEADER ────────────────────────────────────────────────────────────────────
  const renderHeader = () => (
    <header style={{ height: 64, background: C.card, borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', gap: 16, flexShrink: 0, position: 'sticky', top: 0, zIndex: 20 }}>
      <button onClick={() => setSidebarOpen(o => !o)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.muted, display: 'flex', padding: 6, borderRadius: 8 }}>
        <Menu size={20} />
      </button>
      <div style={{ flex: 1, maxWidth: 380, display: 'flex', alignItems: 'center', gap: 10, background: C.bg, border: `1px solid ${C.border}`, borderRadius: 12, padding: '0 14px', height: 38 }}>
        <Search size={15} color={C.muted} />
        <input placeholder="Pesquisar..." style={{ flex: 1, background: 'none', border: 'none', outline: 'none', color: C.text, fontSize: 13, fontWeight: 600 }} />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        {[<Bell size={19} />, <MessageSquare size={19} />].map((ic, i) => (
          <button key={i} style={{ position: 'relative', background: 'none', border: 'none', cursor: 'pointer', color: C.muted, display: 'flex', padding: 7, borderRadius: 10 }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = C.hover; (e.currentTarget as HTMLElement).style.color = C.text; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'none'; (e.currentTarget as HTMLElement).style.color = C.muted; }}>
            {ic}
            <span style={{ position: 'absolute', top: 4, right: 4, width: 7, height: 7, borderRadius: '50%', background: i === 0 ? C.red : C.blue, border: `2px solid ${C.card}` }} />
          </button>
        ))}
        <img src={studioAvatar} alt="profile" style={{ width: 34, height: 34, borderRadius: 11, objectFit: 'cover', border: `2px solid ${C.gold}`, cursor: 'pointer' }} />
        <button onClick={() => setActiveTab('agenda')} style={{ background: C.gold, color: C.bg, border: 'none', borderRadius: 11, padding: '0 16px', height: 38, fontSize: 12, fontWeight: 900, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 7 }}
          onMouseEnter={e => e.currentTarget.style.background = C.goldHover}
          onMouseLeave={e => e.currentTarget.style.background = C.gold}>
          <Plus size={15} /> Nova Marcação
        </button>
      </div>
    </header>
  );

  // ── DASHBOARD ─────────────────────────────────────────────────────────────────
  const renderDashboard = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 26 }}>
      <HeroSlider slides={HERO_SLIDES} />

      {/* Row 1 – Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: 14 }}>
        <StatCard icon={<Paintbrush size={22} color={C.blue} />} label="Pedidos Novos" value="8" sub="Aguardam análise" accent={C.blue} />
        <StatCard icon={<Calendar size={22} color={C.green} />} label="Marcações Hoje" value="12" sub="Total de hoje" accent={C.green} />
        <StatCard icon={<DollarSign size={22} color={C.gold} />} label="Receita Hoje" value="€1.250" sub="Objetivo: €2.000" accent={C.gold} progress={62} />
        <StatCard icon={<Clock3 size={22} color={C.orange} />} label="Próximo Cliente" value="15:00" sub="Ricardo Mendes" accent={C.orange} />
      </div>

      {/* Row 2 – Panels */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))', gap: 14 }}>
        <Panel title="Pedidos Pendentes" link="Ver todos" onLinkClick={() => setActiveTab('orders')}>
          {MOCK_ORDERS.map(o => {
            const st = ORDER_STATUS[o.status] || ORDER_STATUS.new;
            return (
              <div key={o.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: `1px solid ${C.border}` }}>
                <img src={o.thumb} alt="" style={{ width: 46, height: 46, borderRadius: 12, objectFit: 'cover', border: `1px solid ${C.border}`, flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 800, color: C.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{o.client}</div>
                  <div style={{ fontSize: 11, color: C.muted, fontWeight: 600 }}>{o.style}</div>
                  <div style={{ fontSize: 10, color: C.muted, marginTop: 1 }}>{o.time}</div>
                </div>
                <span style={{ fontSize: 10, fontWeight: 800, color: st.color, background: st.bg, borderRadius: 8, padding: '3px 9px', whiteSpace: 'nowrap', flexShrink: 0 }}>{st.label}</span>
              </div>
            );
          })}
        </Panel>

        <Panel title="Agenda de Hoje" link="Ver agenda" onLinkClick={() => setActiveTab('agenda')}>
          {MOCK_SCHEDULE.map((s, i) => {
            const st = SCHEDULE_STATUS[s.status] || SCHEDULE_STATUS.confirmed;
            return (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 0', borderBottom: `1px solid ${C.border}` }}>
                <div style={{ fontSize: 12, fontWeight: 900, color: C.gold, width: 42, flexShrink: 0 }}>{s.time}</div>
                <img src={s.avatar} alt="" style={{ width: 36, height: 36, borderRadius: 10, objectFit: 'cover', flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 800, color: C.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.client}</div>
                  <div style={{ fontSize: 11, color: C.muted, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.service}</div>
                </div>
                <span style={{ fontSize: 10, fontWeight: 800, color: st.color, flexShrink: 0 }}>{st.label}</span>
              </div>
            );
          })}
          <button onClick={() => setActiveTab('agenda')} style={{ width: '100%', padding: 10, borderRadius: 12, background: `${C.gold}15`, border: `1px solid ${C.gold}33`, color: C.gold, fontWeight: 800, fontSize: 12, cursor: 'pointer', marginTop: 4 }}>Ver todos os agendamentos</button>
        </Panel>

        <Panel title="Últimos Projetos" link="Ver todos" onLinkClick={() => setActiveTab('projects')}>
          {MOCK_PROJECTS.map(p => (
            <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 0', borderBottom: `1px solid ${C.border}` }}>
              <img src={p.thumb} alt="" style={{ width: 46, height: 46, borderRadius: 12, objectFit: 'cover', flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 800, color: C.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</div>
                <div style={{ fontSize: 11, color: C.muted, fontWeight: 600, marginBottom: 4 }}>{p.artist}</div>
                <div style={{ height: 4, borderRadius: 2, background: C.border, overflow: 'hidden', maxWidth: 100 }}>
                  <div style={{ height: '100%', width: `${p.progress}%`, background: p.status === 'done' ? C.green : C.gold, borderRadius: 2 }} />
                </div>
              </div>
              <span style={{ fontSize: 10, fontWeight: 800, color: p.status === 'done' ? C.green : C.gold, background: p.status === 'done' ? `${C.green}18` : `${C.gold}18`, borderRadius: 8, padding: '3px 9px', whiteSpace: 'nowrap', flexShrink: 0 }}>{p.status === 'done' ? 'Concluído' : 'Em progresso'}</span>
            </div>
          ))}
        </Panel>
      </div>

      {/* Row 3 – Quick Actions + Notifications */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <Panel title="Ações Rápidas">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {[
              { label: 'Nova Marcação', icon: <Calendar size={20} />, tab: 'agenda' as TabId, color: C.blue },
              { label: 'Novo Pedido', icon: <Paintbrush size={20} />, tab: 'orders' as TabId, color: C.gold },
              { label: 'POS Vendas', icon: <ShoppingCart size={20} />, tab: 'pos' as TabId, color: C.green },
              { label: 'Novo Projeto', icon: <Layers size={20} />, tab: 'projects' as TabId, color: C.orange },
            ].map(a => (
              <button key={a.label} onClick={() => setActiveTab(a.tab)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 10, padding: 16, borderRadius: 16, background: `${a.color}12`, border: `1px solid ${a.color}33`, color: a.color, cursor: 'pointer', fontWeight: 800, fontSize: 13, transition: 'all 0.2s', textAlign: 'left' }}
                onMouseEnter={e => e.currentTarget.style.background = `${a.color}25`}
                onMouseLeave={e => e.currentTarget.style.background = `${a.color}12`}>
                <span style={{ background: `${a.color}20`, borderRadius: 10, padding: 8, display: 'flex' }}>{a.icon}</span>
                {a.label}
              </button>
            ))}
          </div>
        </Panel>

        <Panel title="Notificações" link="Ver todas">
          {MOCK_NOTIFICATIONS.map(n => (
            <div key={n.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: 12, borderRadius: 14, background: C.bg, border: `1px solid ${C.border}`, cursor: 'pointer', transition: 'all 0.2s' }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = C.hover}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = C.bg}>
              <div style={{ width: 34, height: 34, borderRadius: 10, background: `${C.gold}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{n.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: C.text, lineHeight: 1.4 }}>{n.text}</div>
                <div style={{ fontSize: 10, color: C.muted, marginTop: 4, fontWeight: 600 }}>{n.when}</div>
              </div>
            </div>
          ))}
        </Panel>
      </div>
    </div>
  );

  const PLACEHOLDER_MAP: Partial<Record<TabId, { label: string; icon: React.ReactNode }>> = {
    orders: { label: 'Pedidos de Tatuagem', icon: <Paintbrush size={32} /> },
    agenda: { label: 'Agenda', icon: <Calendar size={32} /> },
    clients: { label: 'Clientes', icon: <Users size={32} /> },
    projects: { label: 'Projetos', icon: <Layers size={32} /> },
    artists: { label: 'Artistas', icon: <Award size={32} /> },
    gallery: { label: 'Galeria', icon: <ImageIcon size={32} /> },
    pos: { label: 'POS Vendas', icon: <ShoppingCart size={32} /> },
    quotes: { label: 'Orçamentos', icon: <FileText size={32} /> },
    payments: { label: 'Pagamentos', icon: <CreditCard size={32} /> },
    products: { label: 'Produtos', icon: <Package size={32} /> },
    stock: { label: 'Stock', icon: <BarChart3 size={32} /> },
    messages: { label: 'Mensagens', icon: <MessageSquare size={32} /> },
    reviews: { label: 'Avaliações', icon: <Star size={32} /> },
    marketing: { label: 'Marketing', icon: <Zap size={32} /> },
    reports: { label: 'Relatórios', icon: <TrendingUp size={32} /> },
    settings: { label: 'Definições', icon: <Settings size={32} /> },
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: C.bg, fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif", color: C.text }}>
      {renderSidebar()}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {renderHeader()}
        <main style={{ flex: 1, overflowY: 'auto', padding: 26, scrollbarWidth: 'thin', scrollbarColor: `${C.border} transparent` }}>
          <div style={{ marginBottom: 22 }}>
            <div style={{ fontSize: 22, fontWeight: 900, color: C.text, letterSpacing: -0.5 }}>{MENU_ITEMS.find(m => m.id === activeTab)?.label || 'Dashboard'}</div>
            <div style={{ fontSize: 12, color: C.muted, fontWeight: 600, marginTop: 2 }}>{studioName} · {new Date().toLocaleDateString('pt-PT', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</div>
          </div>
          {activeTab === 'dashboard' && renderDashboard()}
          {activeTab !== 'dashboard' && PLACEHOLDER_MAP[activeTab] && <Placeholder label={PLACEHOLDER_MAP[activeTab]!.label} icon={PLACEHOLDER_MAP[activeTab]!.icon} />}
        </main>
      </div>
    </div>
  );
};

export default TattooDashboard;
