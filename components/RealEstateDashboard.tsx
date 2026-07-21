import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, Home, Percent, BarChart3, 
  MessageSquare, Settings, LogOut, Search, Bell, MapPin, Plus, Trash2, 
  Edit3, X, ChevronDown, ChevronLeft, CheckCircle, AlertTriangle, Calendar, ChevronRight, 
  Image as ImageIcon, ArrowRight, Star, Package, Clock, FileText, Check, 
  FileSpreadsheet, TrendingUp, Sparkles, SlidersHorizontal, Compass, RefreshCw, Mail, PhoneCall,
  User, Eye, Users, CloudSun, Wind, Droplets, Sunrise, Sunset, Thermometer
} from 'lucide-react';
import { Business, Language } from '../types';
import { API_BASE_URL } from '../config';

interface RealEstateDashboardProps {
  business: Business;
  language: Language;
  onLogout: () => void;
  onUpdateBusiness: (updated: Business) => void;
}

interface RealEstateProperty {
  id: string;
  name: string;
  category: string; // e.g. Moradia, Apartamento, Terreno, Comercial, Quinta
  description: string;
  image: string;
  price: number;
  gallery?: string[]; // Multiple photos
  status: 'Ativo' | 'Reservado' | 'Vendido';
}

export const RealEstateDashboard: React.FC<RealEstateDashboardProps> = ({
  business,
  language = 'pt',
  onLogout,
  onUpdateBusiness
}) => {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [globalSearch, setGlobalSearch] = useState<string>('');

  // Clock state
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    // Dynamically inject Google Fonts for Poppins if not already present
    if (!document.getElementById('google-font-poppins')) {
      const link = document.createElement('link');
      link.id = 'google-font-poppins';
      link.rel = 'stylesheet';
      link.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&display=swap';
      document.head.appendChild(link);
    }

    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Format clock details
  const daysOfWeek = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
  const months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
  
  const dayName = daysOfWeek[currentTime.getDay()];
  const hoursStr = String(currentTime.getHours()).padStart(2, '0');
  const minutesStr = String(currentTime.getMinutes()).padStart(2, '0');
  const secondsStr = String(currentTime.getSeconds()).padStart(2, '0');
  const dateFullStr = `${currentTime.getDate()} ${months[currentTime.getMonth()]} ${currentTime.getFullYear()}`;

  // Initialise properties from products list (mapped to RealEstateProperty)
  const [properties, setProperties] = useState<RealEstateProperty[]>(() => {
    if (business.products && business.products.length > 0) {
      return business.products.map((p: any) => ({
        ...p,
        status: p.status || 'Ativo'
      }));
    }
    return [];
  });

  // Modal and Form States
  const [showPropertyModal, setShowPropertyModal] = useState(false);
  const [isEditingProperty, setIsEditingProperty] = useState(false);
  const [propertyForm, setPropertyForm] = useState<Partial<RealEstateProperty>>({
    id: '',
    name: '',
    category: 'Moradia',
    description: '',
    image: '',
    price: 0,
    gallery: [],
    status: 'Ativo'
  });

  // Profile Form State
  const [profileForm, setProfileForm] = useState({
    name: business.name || '',
    phone: business.phone || '',
    publicEmail: business.publicEmail || '',
    address: business.address || '',
    description: business.description || '',
    image: business.image || '',
    adminEmail: business.adminEmail || '',
    adminPassword: business.adminPassword || ''
  });

  const [isLoading, setIsLoading] = useState(false);

  // Dynamic Visits & Calendar States
  const [visitsList, setVisitsList] = useState([
    { id: '1', client: 'João Silva', time: '14:30', date: '2026-07-22', property: 'Apartamento Vista Lagoa', status: 'Confirmada' },
    { id: '2', client: 'Maria Santos', time: '16:00', date: '2026-07-24', property: 'Vivenda Sete Cidades', status: 'Pendente' },
    { id: '3', client: 'António Tavares', time: '10:00', date: '2026-07-28', property: 'Terreno Praia do Pópulo', status: 'Confirmada' }
  ]);

  const [calendarDate, setCalendarDate] = useState(new Date(2026, 6, 1)); // Default: July 2026
  const [selectedCalendarDay, setSelectedCalendarDay] = useState<string>('2026-07-22');
  const [newVisitForm, setNewVisitForm] = useState({
    client: '',
    time: '10:00',
    date: '2026-07-22',
    property: '',
    status: 'Pendente'
  });

  const [crmLeads, setCrmLeads] = useState([
    { id: 'l1', name: 'Carlos Ribeiro', status: 'Novo Interesse', email: 'carlos@mail.com', phone: '912345678', date: '2026-07-20' },
    { id: 'l2', name: 'Ana Oliveira', status: 'Visita Agendada', email: 'ana.o@mail.com', phone: '918765432', date: '2026-07-21' },
    { id: 'l3', name: 'Rui Ferreira', status: 'Em Negociação', email: 'rui.f@mail.com', phone: '965551234', date: '2026-07-19' }
  ]);

  // Mocked stats
  const stats = {
    active: properties.filter(p => p.status === 'Ativo').length,
    leads: crmLeads.length + 21,
    visits: visitsList.length,
    views: 1420
  };

  const mockForecast = [
    { day: 'Amanhã', temp: '23°C', icon: '🌤️' },
    { day: 'Quinta', temp: '21°C', icon: '🌧️' },
    { day: 'Sexta', temp: '24°C', icon: '☀️' }
  ];

  const mockLeads = crmLeads.slice(0, 2);

  // Handle Image Upload Helper
  const handleFileUpload = async (files: FileList | null, field: 'image' | 'gallery') => {
    if (!files || files.length === 0) return;
    setIsLoading(true);
    try {
      const urls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const formData = new FormData();
        formData.append('image', files[i]);
        const res = await fetch(`${API_BASE_URL}/api/upload`, {
          method: 'POST',
          body: formData
        });
        if (res.ok) {
          const data = await res.json();
          urls.push(data.url);
        }
      }
      if (urls.length > 0) {
        if (field === 'image') {
          setPropertyForm(prev => ({ ...prev, image: urls[0] }));
        } else {
          setPropertyForm(prev => ({ ...prev, gallery: [...(prev.gallery || []), ...urls] }));
        }
      }
    } catch (err) {
      console.error("Erro no upload de imagens:", err);
      alert("Erro ao efetuar upload.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfileImageUpload = async (file: File | null) => {
    if (!file) return;
    try {
      const formData = new FormData();
      formData.append('image', file);
      const res = await fetch(`${API_BASE_URL}/api/upload`, {
        method: 'POST',
        body: formData
      });
      if (res.ok) {
        const data = await res.json();
        setProfileForm(prev => ({ ...prev, image: data.url }));
      }
    } catch (err) {
      console.error("Erro no upload da foto de perfil:", err);
    }
  };

  const handleShare = (p: RealEstateProperty) => {
    const shareUrl = `${window.location.origin}${window.location.pathname}?seller=${business.id}`;
    navigator.clipboard.writeText(shareUrl)
      .then(() => alert("Link de partilha do consultor copiado para a área de transferência!"))
      .catch(() => alert("Erro ao copiar o link."));
  };

  const handleSaveProperty = (e: React.FormEvent) => {
    e.preventDefault();
    if (!propertyForm.name || !propertyForm.price) return;

    let updatedProperties: RealEstateProperty[] = [];
    if (isEditingProperty) {
      updatedProperties = properties.map(p => p.id === propertyForm.id ? (propertyForm as RealEstateProperty) : p);
      setProperties(updatedProperties);
      alert('Imóvel atualizado com sucesso!');
    } else {
      const newProp: RealEstateProperty = {
        ...(propertyForm as RealEstateProperty),
        id: `PROP${Date.now()}`,
        image: propertyForm.image || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=800',
        gallery: propertyForm.gallery || [],
        status: propertyForm.status || 'Ativo'
      };
      updatedProperties = [...properties, newProp];
      setProperties(updatedProperties);
      alert('Imóvel adicionado com sucesso!');
    }

    onUpdateBusiness({ ...business, products: updatedProperties });
    setShowPropertyModal(false);
  };

  const handleDeleteProperty = (propertyId: string) => {
    if (!window.confirm("Tem a certeza que deseja eliminar este imóvel?")) return;
    const updated = properties.filter(p => p.id !== propertyId);
    setProperties(updated);
    onUpdateBusiness({ ...business, products: updated });
    alert("Imóvel eliminado com sucesso!");
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateBusiness({
      ...business,
      name: profileForm.name,
      phone: profileForm.phone,
      publicEmail: profileForm.publicEmail,
      address: profileForm.address,
      description: profileForm.description,
      image: profileForm.image,
      adminEmail: profileForm.adminEmail,
      adminPassword: profileForm.adminPassword
    });
    alert("Perfil atualizado com sucesso!");
  };

  const filteredProperties = properties.filter(p => 
    p.name.toLowerCase().includes(globalSearch.toLowerCase()) || 
    p.category.toLowerCase().includes(globalSearch.toLowerCase()) || 
    p.description.toLowerCase().includes(globalSearch.toLowerCase())
  );

  return (
    <div className="min-h-screen relative font-sans antialiased text-slate-800 flex overflow-x-hidden" style={{ fontFamily: "'Poppins', sans-serif" }}>
      
      {/* ───────────────── BACKGROUND SCENE ───────────────── */}
      <div 
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000"
        style={{ backgroundImage: `url('https://images.unsplash.com/photo-1589308078059-be1415eab4c3?q=80&w=1600')` }}
      />
      <div className="fixed inset-0 z-0 bg-slate-950/45 backdrop-blur-md" />

      {/* ───────────────── SIDEBAR (LEFT) ───────────────── */}
      <aside className="w-80 bg-white/70 backdrop-blur-xl text-slate-800 flex flex-col fixed h-full z-30 border-r border-white/20 shadow-xl p-6 justify-between rounded-r-[2rem]">
        
        <div className="space-y-6">
          {/* Logo */}
          <div className="flex items-center gap-3 px-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0A4E9B] to-[#37B34A] flex items-center justify-center shadow-md">
              <span className="font-black text-white text-base">AZ</span>
            </div>
            <div>
              <h2 className="text-sm font-black uppercase tracking-wider text-slate-900 leading-none">Azores toYou</h2>
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Imobiliário CRM</span>
            </div>
          </div>

          {/* User Profile Card */}
          <div className="p-4 rounded-2xl bg-white/50 border border-white/40 flex items-center gap-3 shadow-sm">
            <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-100 flex items-center justify-center border border-white/50 flex-shrink-0">
              {profileForm.image ? (
                <img src={profileForm.image} alt={profileForm.name} className="w-full h-full object-cover" />
              ) : (
                <User className="text-[#0A4E9B] w-6 h-6" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-black uppercase tracking-tight text-slate-800 truncate">{profileForm.name}</h4>
              <p className="text-[9px] font-bold text-slate-450 uppercase tracking-wider">Agente Associado</p>
            </div>
          </div>

          {/* Menus List */}
          <nav className="space-y-1">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={15} /> },
              { id: 'imoveis', label: 'Imóveis', icon: <Home size={15} /> },
              { id: 'leads', label: 'Leads', icon: <Users size={15} /> },
              { id: 'visitas', label: 'Visitas', icon: <Calendar size={15} /> },
              { id: 'mensagens', label: 'Mensagens', icon: <MessageSquare size={15} /> },
              { id: 'clientes', label: 'Clientes', icon: <User size={15} /> },
              { id: 'calendario', label: 'Calendário', icon: <Calendar size={15} /> },
              { id: 'relatorios', label: 'Relatórios', icon: <BarChart3 size={15} /> },
              { id: 'favoritos', label: 'Favoritos', icon: <Star size={15} /> },
              { id: 'config', label: 'Definições', icon: <Settings size={15} /> }
            ].map(menu => (
              <button
                key={menu.id}
                onClick={() => setActiveTab(menu.id)}
                className={`w-full text-left px-4 py-3 rounded-xl flex items-center gap-3.5 transition-all text-xs uppercase tracking-wider font-semibold ${
                  activeTab === menu.id 
                    ? 'bg-[#0A4E9B] text-white shadow-md font-bold' 
                    : 'text-slate-600 hover:bg-white/40 hover:text-slate-900'
                }`}
              >
                {menu.icon}
                <span>{menu.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Novo Imóvel & Logout */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <button 
            onClick={() => {
              setPropertyForm({ id: '', name: '', category: 'Moradia', description: '', image: '', price: 0, gallery: [], status: 'Ativo' });
              setIsEditingProperty(false);
              setShowPropertyModal(true);
            }}
            className="w-full py-4 bg-[#37B34A] hover:bg-[#2e993f] text-white rounded-xl font-bold uppercase tracking-wider text-xs shadow-lg transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2"
          >
            <Plus size={16} /> Novo Imóvel
          </button>

          <button 
            onClick={onLogout}
            className="w-full py-2.5 hover:bg-slate-100 text-slate-500 rounded-xl font-bold uppercase tracking-wider text-[10px] transition-all flex items-center justify-center gap-2"
          >
            <LogOut size={14} /> Terminar Sessão
          </button>
        </div>
      </aside>

      {/* ───────────────── MIDDLE CONTENT AREA ───────────────── */}
      <main className="flex-1 pl-80 pr-80 min-h-screen relative z-10 flex flex-col">
        
        {/* Top Header Navbar */}
        <header className="h-20 flex items-center justify-between px-10">
          <div className="flex items-center gap-3 bg-white/45 backdrop-blur-md border border-white/20 px-4 py-2.5 rounded-2xl w-96 shadow-sm">
            <Search size={16} className="text-slate-400" />
            <input 
              type="text" 
              placeholder="Pesquisar portfólio imobiliário..." 
              value={globalSearch}
              onChange={e => setGlobalSearch(e.target.value)}
              className="bg-transparent border-none text-xs font-semibold focus:outline-none w-full placeholder-slate-450 text-slate-800"
            />
          </div>
          
          <div className="flex items-center gap-4">
            <button className="p-3 bg-white/45 backdrop-blur-md border border-white/20 text-slate-700 hover:bg-white rounded-xl transition-all relative shadow-sm">
              <Bell size={16} />
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-[#37B34A] rounded-full border border-white" />
            </button>
          </div>
        </header>

        {/* Content Tabs */}
        <div className="flex-1 p-10 space-y-12">
          
          {activeTab === 'dashboard' && (
            <div className="space-y-12 animate-in fade-in duration-500">
              
              {/* ───────────────── CENTRAL CLOCK WIDGET (Main Focus, ~45% center width) ───────────────── */}
              <div className="flex justify-center">
                <div className="w-[85%] bg-white/70 backdrop-blur-xl rounded-[2.5rem] p-8 border border-white/40 shadow-2xl flex flex-col items-center justify-between text-center space-y-6">
                  
                  {/* Calendar day name */}
                  <div className="text-sm font-black uppercase tracking-[0.2em] text-[#0A4E9B]">
                    {dayName}
                  </div>

                  {/* Gigantic Digital Clock */}
                  <div className="flex items-baseline gap-2 justify-center">
                    <span className="text-7xl md:text-8xl font-black text-slate-900 tracking-tighter leading-none">{hoursStr}:{minutesStr}</span>
                    <span className="text-xl md:text-2xl font-bold text-[#37B34A] font-mono leading-none">{secondsStr}</span>
                  </div>

                  {/* Full Date */}
                  <div className="text-xs font-black uppercase tracking-wider text-slate-500">
                    {dateFullStr}
                  </div>

                  {/* Divider */}
                  <div className="w-1/2 h-[1px] bg-slate-200/50" />

                  {/* Weather Info (Ponta Delgada) */}
                  <div className="flex items-center justify-between w-full px-6">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">🌤️</span>
                      <div className="text-left">
                        <p className="text-2xl font-black text-slate-800 leading-none">22°C</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Nublado</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-black text-slate-800 uppercase tracking-tight flex items-center justify-end gap-1">
                        <MapPin size={12} className="text-red-400" /> Ponta Delgada
                      </p>
                      <p className="text-[9px] font-bold text-slate-450 uppercase tracking-widest mt-1">Ilha de São Miguel</p>
                    </div>
                  </div>

                  {/* Detailed Weather Stats */}
                  <div className="grid grid-cols-4 gap-4 w-full bg-white/50 border border-white/40 p-4 rounded-2xl text-[9px] font-black uppercase tracking-wider text-slate-500">
                    <div className="text-center flex flex-col items-center gap-1 border-r border-slate-100">
                      <Droplets size={12} className="text-blue-500" />
                      <span>Humidade</span>
                      <span className="text-slate-800 font-black">78%</span>
                    </div>
                    <div className="text-center flex flex-col items-center gap-1 border-r border-slate-100">
                      <Wind size={12} className="text-emerald-500" />
                      <span>Vento</span>
                      <span className="text-slate-800 font-black">15 km/h</span>
                    </div>
                    <div className="text-center flex flex-col items-center gap-1 border-r border-slate-100">
                      <Sunrise size={12} className="text-amber-500" />
                      <span>Nascer</span>
                      <span className="text-slate-800 font-black">06:45</span>
                    </div>
                    <div className="text-center flex flex-col items-center gap-1">
                      <Sunset size={12} className="text-orange-500" />
                      <span>Pôr do Sol</span>
                      <span className="text-slate-800 font-black">20:30</span>
                    </div>
                  </div>

                </div>
              </div>

              {/* ───────────────── 4 CARTS BELOW CLOCK ───────────────── */}
              <div className="grid grid-cols-4 gap-4">
                {[
                  { label: 'Imóveis Ativos', value: stats.active, icon: <Home size={18} className="text-blue-600" />, bg: 'bg-blue-50/50' },
                  { label: 'Leads', value: stats.leads, icon: <Users size={18} className="text-purple-600" />, bg: 'bg-purple-50/50' },
                  { label: 'Visitas', value: stats.visits, icon: <Calendar size={18} className="text-amber-600" />, bg: 'bg-amber-50/50' },
                  { label: 'Visualizações', value: stats.views, icon: <Eye size={18} className="text-emerald-600" />, bg: 'bg-emerald-50/50' }
                ].map((card, idx) => (
                  <div key={idx} className={`p-5 rounded-2xl border border-white/40 bg-white/70 backdrop-blur-xl shadow-sm flex items-center justify-between`}>
                    <div className="space-y-1">
                      <p className="text-[9px] font-black uppercase tracking-wider text-slate-450">{card.label}</p>
                      <h4 className="text-2xl font-black text-slate-850 leading-none">{card.value}</h4>
                    </div>
                    <div className={`p-3 rounded-xl ${card.bg} border border-white/20`}>
                      {card.icon}
                    </div>
                  </div>
                ))}
              </div>

              {/* ───────────────── PROPERTIES LIST GRID ───────────────── */}
              <div className="bg-white/70 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/40 shadow-xl space-y-6">
                <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                  <div>
                    <h3 className="font-black text-slate-900 text-lg uppercase tracking-tight">Portfólio Imobiliário</h3>
                    <p className="text-[10px] font-bold text-slate-450 uppercase tracking-widest mt-0.5">Lista geral de propriedades associadas</p>
                  </div>
                  <button onClick={() => setActiveTab('imoveis')} className="text-[10px] font-black text-[#0A4E9B] uppercase tracking-widest">Ver Todos ({properties.length})</button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {properties.slice(0, 4).map(p => (
                    <div key={p.id} className="bg-white/80 border border-slate-100/80 rounded-3xl p-4 flex items-center gap-4 hover:shadow-md hover:border-white transition-all">
                      <div className="w-20 h-20 rounded-2xl overflow-hidden bg-slate-100 flex-shrink-0 border border-slate-200">
                        <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0 space-y-1.5">
                        <span className={`px-2.5 py-0.5 text-[8px] font-black rounded uppercase tracking-wider ${
                          p.status === 'Vendido' ? 'bg-slate-100 text-slate-650' : 
                          p.status === 'Reservado' ? 'bg-amber-50 text-amber-600 border border-amber-100' : 
                          'bg-emerald-50 text-[#37B34A] border border-emerald-100'
                        }`}>
                          {p.status}
                        </span>
                        <h4 className="text-sm font-black text-slate-800 uppercase truncate leading-none">{p.name}</h4>
                        <p className="text-[10px] font-bold text-slate-400 flex items-center gap-1"><MapPin size={10} /> Ponta Delgada, PDL</p>
                      </div>
                      <div className="text-right flex items-center gap-3">
                        <span className="font-mono text-base font-black text-slate-850">€{p.price.toLocaleString('pt-PT')}</span>
                        <button 
                          onClick={() => handleShare(p)}
                          title="Gerar Link de Partilha"
                          className="p-2.5 bg-slate-50 hover:bg-blue-50 border border-slate-100 rounded-xl text-[#0A4E9B] hover:scale-105 transition-all"
                        >
                          <Compass size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                  {properties.length === 0 && (
                    <div className="col-span-2 text-center py-16 text-slate-400">
                      <Home size={36} className="mx-auto opacity-20 mb-3" />
                      <p className="font-bold uppercase text-[9px] tracking-widest">Nenhum imóvel disponível.</p>
                    </div>
                  )}
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: MANAGE PROPERTIES */}
          {activeTab === 'imoveis' && (
            <div className="space-y-8 animate-in fade-in duration-500">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-3xl font-black text-slate-800 uppercase tracking-tighter leading-none mb-1">Os Meus Imóveis</h1>
                  <p className="text-slate-450 text-xs font-bold uppercase tracking-wider">Gestão detalhada e registo de habitações, apartamentos e terrenos</p>
                </div>
                <button 
                  onClick={() => {
                    setPropertyForm({ id: '', name: '', category: 'Moradia', description: '', image: '', price: 0, gallery: [], status: 'Ativo' });
                    setIsEditingProperty(false);
                    setShowPropertyModal(true);
                  }}
                  className="px-6 py-3.5 bg-[#37B34A] hover:bg-[#2e993f] text-white rounded-xl font-bold uppercase text-xs tracking-wider shadow-md transition-all active:scale-95"
                >
                  <Plus size={15} /> Adicionar Imóvel
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProperties.map(p => (
                  <div key={p.id} className="bg-white/80 backdrop-blur-md rounded-3xl border border-white/40 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group">
                    <div className="h-44 relative overflow-hidden bg-slate-100">
                      <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute top-4 right-4 px-3 py-1 bg-white/90 backdrop-blur rounded-xl text-[9px] font-black text-blue-600 shadow-sm border border-slate-100">
                        {p.category}
                      </div>
                    </div>
                    <div className="p-6 space-y-4">
                      <div>
                        <span className={`px-2.5 py-0.5 text-[8px] font-black rounded uppercase tracking-wider inline-block mb-2 ${
                          p.status === 'Vendido' ? 'bg-slate-100 text-slate-650' : 
                          p.status === 'Reservado' ? 'bg-amber-50 text-amber-600 border border-amber-100' : 
                          'bg-emerald-50 text-[#37B34A] border border-emerald-100'
                        }`}>
                          {p.status}
                        </span>
                        <h4 className="text-base font-black text-slate-800 uppercase tracking-tight line-clamp-1">{p.name}</h4>
                        <p className="text-xs text-slate-450 line-clamp-2 mt-1 leading-relaxed font-medium">{p.description}</p>
                      </div>
                      <div className="flex items-center justify-between border-t border-slate-50 pt-4">
                        <span className="font-mono text-lg font-black text-slate-800">€{p.price.toLocaleString('pt-PT')}</span>
                        <div className="flex gap-2">
                          <button 
                            onClick={() => handleShare(p)}
                            title="Gerar Link de Partilha"
                            className="p-2.5 bg-slate-50 hover:bg-blue-50 border border-slate-100 rounded-xl text-[#0A4E9B] hover:scale-105 transition-all"
                          >
                            <Compass size={14} />
                          </button>
                          <button 
                            onClick={() => {
                              setPropertyForm(p);
                              setIsEditingProperty(true);
                              setShowPropertyModal(true);
                            }}
                            className="p-2.5 bg-slate-50 hover:bg-blue-50 border border-slate-100 rounded-xl text-slate-500 hover:text-blue-600 transition-all active:scale-90"
                          >
                            <Edit3 size={14} />
                          </button>
                          <button 
                            onClick={() => handleDeleteProperty(p.id)}
                            className="p-2.5 bg-slate-50 hover:bg-red-50 border border-slate-100 rounded-xl text-slate-500 hover:text-red-500 transition-all active:scale-90"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: SETTINGS / DEF */}
          {activeTab === 'config' && (
            <div className="space-y-8 animate-in fade-in duration-500 max-w-4xl">
              <div>
                <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter leading-none mb-1">Definições da Conta</h1>
                <p className="text-slate-450 text-xs font-bold uppercase tracking-wider">Configure os seus dados públicos de contacto e credenciais de acesso</p>
              </div>

              <form onSubmit={handleSaveProfile} className="bg-white/70 backdrop-blur-xl rounded-3xl border border-white/40 shadow-sm p-8 space-y-6">
                <div className="flex items-center gap-6 pb-6 border-b border-slate-100">
                  <div className="w-20 h-20 rounded-2xl bg-slate-100 border border-slate-200 overflow-hidden relative group">
                    {profileForm.image ? (
                      <img src={profileForm.image} alt="Perfil" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-350"><ImageIcon size={28} /></div>
                    )}
                    <label className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white cursor-pointer font-bold text-[9px] uppercase text-center p-2 leading-tight">
                      Mudar Foto
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={e => e.target.files && handleProfileImageUpload(e.target.files[0])}
                        className="hidden" 
                      />
                    </label>
                  </div>
                  <div>
                    <h3 className="text-base font-black text-slate-800 leading-none">Fotografia do Consultor</h3>
                    <p className="text-xs text-slate-450 mt-1.5 font-medium">Recomendado: Formato quadrado (1:1), em alta resolução.</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-slate-450 mb-2">Nome Comercial</label>
                    <input 
                      type="text" 
                      required
                      value={profileForm.name} 
                      onChange={e => setProfileForm(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full border border-slate-200 focus:border-blue-500 rounded-xl p-3 text-xs font-semibold focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-slate-450 mb-2">Telemóvel / WhatsApp</label>
                    <input 
                      type="text" 
                      value={profileForm.phone} 
                      onChange={e => setProfileForm(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full border border-slate-200 focus:border-blue-500 rounded-xl p-3 text-xs font-semibold focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-slate-450 mb-2">Email de Contacto Público</label>
                    <input 
                      type="email" 
                      value={profileForm.publicEmail} 
                      onChange={e => setProfileForm(prev => ({ ...prev, publicEmail: e.target.value }))}
                      className="w-full border border-slate-200 focus:border-blue-500 rounded-xl p-3 text-xs font-semibold focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-slate-450 mb-2">Morada / Endereço Físico</label>
                    <input 
                      type="text" 
                      value={profileForm.address} 
                      onChange={e => setProfileForm(prev => ({ ...prev, address: e.target.value }))}
                      className="w-full border border-slate-200 focus:border-blue-500 rounded-xl p-3 text-xs font-semibold focus:outline-none"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-xs font-black uppercase tracking-wider text-slate-450 mb-2">Biografia / Apresentação</label>
                    <textarea 
                      rows={4}
                      value={profileForm.description} 
                      onChange={e => setProfileForm(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full border border-slate-200 focus:border-blue-500 rounded-xl p-3 text-xs font-semibold focus:outline-none"
                    />
                  </div>

                  <div className="col-span-2 border-t border-slate-100 pt-6 mt-2">
                    <h3 className="font-black text-slate-800 text-sm uppercase tracking-wider mb-4">Credenciais de Acesso (Dashboard)</h3>
                  </div>

                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-slate-450 mb-2">Email de Login</label>
                    <input 
                      type="email" 
                      required
                      value={profileForm.adminEmail} 
                      onChange={e => setProfileForm(prev => ({ ...prev, adminEmail: e.target.value }))}
                      className="w-full border border-slate-200 focus:border-blue-500 rounded-xl p-3 text-xs font-semibold focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-slate-450 mb-2">Palavra-passe</label>
                    <input 
                      type="password" 
                      required
                      value={profileForm.adminPassword} 
                      onChange={e => setProfileForm(prev => ({ ...prev, adminPassword: e.target.value }))}
                      className="w-full border border-slate-200 focus:border-blue-500 rounded-xl p-3 text-xs font-semibold focus:outline-none"
                    />
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-100 text-right">
                  <button 
                    type="submit"
                    className="px-8 py-3.5 bg-slate-900 text-white rounded-xl text-xs font-black uppercase tracking-wider hover:bg-blue-600 transition-colors shadow-md active:scale-95"
                  >
                    Guardar Perfil
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 4: CALENDÁRIO INTERATIVO CRM */}
          {activeTab === 'calendario' && (
            <div className="space-y-8 animate-in fade-in duration-500">
              <div>
                <h1 className="text-3xl font-black text-slate-800 uppercase tracking-tighter mb-1">Calendário de Visitas</h1>
                <p className="text-slate-450 text-xs font-bold uppercase tracking-wider">Agende e consulte visitas de clientes aos seus imóveis em exposição</p>
              </div>

              <div className="grid grid-cols-3 gap-8">
                {/* Monthly Calendar Grid Widget */}
                <div className="col-span-2 bg-white/70 backdrop-blur-xl rounded-[2.5rem] border border-white/40 p-6 shadow-sm space-y-6">
                  <div className="flex justify-between items-center">
                    <span className="font-black text-slate-800 uppercase text-xs tracking-wider">Julho 2026</span>
                    <div className="flex gap-2">
                      <button type="button" className="p-2 hover:bg-slate-100 rounded-xl text-slate-500"><ChevronLeft size={16} /></button>
                      <button type="button" className="p-2 hover:bg-slate-100 rounded-xl text-slate-500"><ChevronRight size={16} /></button>
                    </div>
                  </div>

                  <div className="grid grid-cols-7 gap-2 text-center text-[10px] font-black uppercase tracking-wider text-slate-400">
                    {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(d => <span key={d}>{d}</span>)}
                  </div>

                  <div className="grid grid-cols-7 gap-2">
                    {/* Empty padding days for July 2026 starting on Wednesday (3 padding days) */}
                    {[null, null, null].map((_, idx) => (
                      <div key={`pad-${idx}`} className="aspect-square bg-slate-50/20 rounded-xl opacity-30" />
                    ))}
                    {Array.from({ length: 31 }, (_, dayIdx) => {
                      const dayNumber = dayIdx + 1;
                      const dateStr = `2026-07-${String(dayNumber).padStart(2, '0')}`;
                      const isSelected = selectedCalendarDay === dateStr;
                      const dayVisits = visitsList.filter(v => v.date === dateStr);
                      const hasVisits = dayVisits.length > 0;

                      return (
                        <button
                          key={dayNumber}
                          type="button"
                          onClick={() => {
                            setSelectedCalendarDay(dateStr);
                            setNewVisitForm(prev => ({ ...prev, date: dateStr }));
                          }}
                          className={`aspect-square rounded-xl flex flex-col items-center justify-between p-2 transition-all relative border font-bold text-xs ${
                            isSelected 
                              ? 'bg-[#0A4E9B] text-white border-transparent shadow-lg shadow-blue-500/20 font-black'
                              : 'bg-white/50 border-slate-100/60 hover:bg-white text-slate-700'
                          }`}
                        >
                          <span>{dayNumber}</span>
                          {hasVisits && (
                            <span className={`w-2 h-2 rounded-full ${isSelected ? 'bg-white' : 'bg-[#37B34A]'} animate-pulse`} />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Scheduling form & Day visits overview */}
                <div className="space-y-6">
                  {/* Day Visitas Details */}
                  <div className="bg-white/70 backdrop-blur-xl rounded-[2.5rem] border border-white/40 p-6 shadow-sm space-y-4">
                    <h3 className="font-black text-slate-800 text-xs uppercase tracking-wider">Visitas para {selectedCalendarDay.split('-').reverse().join('/')}</h3>
                    <div className="space-y-3">
                      {visitsList.filter(v => v.date === selectedCalendarDay).map((v) => (
                        <div key={v.id} className="p-3.5 bg-slate-50 border border-slate-100 rounded-2xl flex justify-between items-center">
                          <div>
                            <p className="font-black text-slate-800 text-xs uppercase tracking-tight leading-none mb-1">{v.client}</p>
                            <p className="text-[10px] text-slate-400 font-bold">{v.property}</p>
                          </div>
                          <div className="text-right">
                            <span className="font-mono text-[10px] font-black text-[#0A4E9B] block">{v.time}</span>
                            <span className="px-2 py-0.5 rounded bg-emerald-50 text-[#37B34A] text-[8px] font-black uppercase tracking-wider mt-1 inline-block">{v.status}</span>
                          </div>
                        </div>
                      ))}
                      {visitsList.filter(v => v.date === selectedCalendarDay).length === 0 && (
                        <p className="text-slate-400 text-xs italic text-center py-6">Nenhuma visita agendada para este dia.</p>
                      )}
                    </div>
                  </div>

                  {/* Add Appointment form */}
                  <form 
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (!newVisitForm.client) return;
                      const newVisit = {
                        id: `V${Date.now()}`,
                        client: newVisitForm.client,
                        time: newVisitForm.time,
                        date: newVisitForm.date,
                        property: newVisitForm.property || properties[0]?.name || 'Visita Geral',
                        status: newVisitForm.status as any
                      };
                      setVisitsList(prev => [...prev, newVisit]);
                      setNewVisitForm(prev => ({ ...prev, client: '' }));
                      alert("Visita agendada com sucesso!");
                    }}
                    className="bg-white/70 backdrop-blur-xl rounded-[2.5rem] border border-white/40 p-6 shadow-sm space-y-4"
                  >
                    <h3 className="font-black text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5"><Calendar size={14} className="text-[#37B34A]" /> Agendar Visita</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-[10px] font-black uppercase tracking-wider text-slate-450 mb-1">Nome do Cliente</label>
                        <input 
                          type="text" 
                          required
                          value={newVisitForm.client}
                          onChange={e => setNewVisitForm(prev => ({ ...prev, client: e.target.value }))}
                          placeholder="Ex: João da Silva"
                          className="w-full border border-slate-200 focus:border-blue-500 rounded-xl p-2.5 text-xs font-semibold focus:outline-none bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black uppercase tracking-wider text-slate-450 mb-1">Hora</label>
                        <input 
                          type="time" 
                          required
                          value={newVisitForm.time}
                          onChange={e => setNewVisitForm(prev => ({ ...prev, time: e.target.value }))}
                          className="w-full border border-slate-200 focus:border-blue-500 rounded-xl p-2.5 text-xs font-semibold focus:outline-none bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black uppercase tracking-wider text-slate-450 mb-1">Imóvel</label>
                        <select 
                          value={newVisitForm.property}
                          onChange={e => setNewVisitForm(prev => ({ ...prev, property: e.target.value }))}
                          className="w-full border border-slate-200 focus:border-blue-500 rounded-xl p-2.5 text-xs font-black focus:outline-none bg-white"
                        >
                          <option value="">Selecione um imóvel...</option>
                          {properties.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
                        </select>
                      </div>
                      <button 
                        type="submit"
                        className="w-full py-3 bg-[#37B34A] hover:bg-[#2e993f] text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-md"
                      >
                        Agendar Visita
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: LEADS CRM */}
          {activeTab === 'leads' && (
            <div className="space-y-8 animate-in fade-in duration-500">
              <div>
                <h1 className="text-3xl font-black text-slate-800 uppercase tracking-tighter mb-1">Leads Recentes</h1>
                <p className="text-slate-450 text-xs font-bold uppercase tracking-wider">Acompanhe novos contactos e potenciais compradores registados</p>
              </div>

              <div className="bg-white/70 backdrop-blur-xl rounded-[2.5rem] border border-white/40 p-8 shadow-sm space-y-6">
                <div className="space-y-4">
                  {crmLeads.map((l) => (
                    <div key={l.id} className="p-4 bg-white/80 border border-slate-100 rounded-3xl flex items-center justify-between hover:shadow-md transition-all">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-50 to-blue-50 border border-slate-100 flex items-center justify-center font-black text-sm text-[#0A4E9B] uppercase">
                          {l.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <h4 className="text-sm font-black text-slate-850 uppercase tracking-tight">{l.name}</h4>
                          <p className="text-xs text-slate-450 font-bold">{l.email} • {l.phone}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="px-3 py-1 rounded bg-purple-50 text-purple-700 text-[9px] font-black uppercase tracking-wider border border-purple-100">{l.status}</span>
                        <span className="text-xs text-slate-400 font-bold">{l.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: VISITAS CRM LIST */}
          {activeTab === 'visitas' && (
            <div className="space-y-8 animate-in fade-in duration-500">
              <div>
                <h1 className="text-3xl font-black text-slate-800 uppercase tracking-tighter mb-1">Lista de Visitas</h1>
                <p className="text-slate-450 text-xs font-bold uppercase tracking-wider">Histórico de todas as visitas agendadas e respetivo estado</p>
              </div>

              <div className="bg-white/70 backdrop-blur-xl rounded-[2.5rem] border border-white/40 p-8 shadow-sm space-y-6">
                <div className="space-y-4">
                  {visitsList.map((v) => (
                    <div key={v.id} className="p-4 bg-white/80 border border-slate-100 rounded-3xl flex items-center justify-between hover:shadow-md transition-all">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl"><Calendar size={20} /></div>
                        <div>
                          <h4 className="text-sm font-black text-slate-850 uppercase tracking-tight">Visita com {v.client}</h4>
                          <p className="text-xs text-slate-450 font-bold">{v.property}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <span className="text-xs font-black text-slate-800 block">{v.date}</span>
                          <span className="text-[10px] font-bold text-slate-400">{v.time}</span>
                        </div>
                        <span className="px-3 py-1 rounded bg-emerald-50 text-[#37B34A] text-[9px] font-black uppercase tracking-wider border border-emerald-100">{v.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: PLACEHOLDERS FOR REMAINING CRM VIEWS */}
          {['mensagens', 'clientes', 'relatorios', 'favoritos'].includes(activeTab) && (
            <div className="space-y-8 animate-in fade-in duration-500 max-w-4xl">
              <div className="bg-white/70 backdrop-blur-xl rounded-[2.5rem] border border-white/40 p-12 text-center shadow-sm">
                <Compass size={48} className="mx-auto text-[#0A4E9B] opacity-40 mb-4" />
                <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight mb-2">Módulo {activeTab.toUpperCase()}</h3>
                <p className="text-slate-450 text-xs font-bold leading-relaxed max-w-md mx-auto">
                  Este módulo faz parte do pacote de CRM Imobiliário Premium SaaS 2026. A carregar bases de dados associadas...
                </p>
              </div>
            </div>
          )}

        </div>

      </main>

      {/* ───────────────── RIGHT SIDEBAR (PANEL) ───────────────── */}
      <aside className="w-80 bg-white/70 backdrop-blur-xl border-l border-white/20 shadow-xl fixed right-0 top-0 bottom-0 h-full z-20 p-6 flex flex-col justify-between rounded-l-[2rem] space-y-6 overflow-y-auto">
        
        {/* Weather Forecast Card */}
        <div className="bg-white/60 border border-white/50 p-5 rounded-2xl shadow-sm space-y-4">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-450 flex items-center gap-1.5"><CloudSun size={14} className="text-blue-500" /> Próximos Dias</h3>
          <div className="space-y-3">
            {mockForecast.map((f, i) => (
              <div key={i} className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-600">{f.day}</span>
                <span className="flex items-center gap-2 font-black text-slate-800">
                  <span>{f.icon}</span>
                  <span>{f.temp}</span>
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Agenda / Visitas */}
        <div className="bg-white/60 border border-white/50 p-5 rounded-2xl shadow-sm space-y-4 flex-1 flex flex-col">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-450 flex items-center gap-1.5"><Calendar size={14} className="text-amber-500" /> Agenda de Visitas</h3>
          <div className="space-y-3 flex-1 overflow-y-auto max-h-[160px] scrollbar-hide">
            {visitsList.map((v, i) => (
              <div key={i} className="p-3 bg-slate-50/80 border border-slate-100 rounded-xl space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="font-black text-xs text-slate-800 uppercase tracking-tight">{v.client}</span>
                  <span className="font-mono text-[9px] font-black text-[#0A4E9B]">{v.time}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[9px] font-bold text-slate-400">{v.property || 'Visita Imóvel'}</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-50 text-[#37B34A] text-[8px] font-black uppercase tracking-wider">{v.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Leads Recentes */}
        <div className="bg-white/60 border border-white/50 p-5 rounded-2xl shadow-sm space-y-4">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-450 flex items-center gap-1.5"><Users size={14} className="text-purple-500" /> Leads Recentes</h3>
          <div className="space-y-3">
            {mockLeads.map((l, i) => (
              <div key={i} className="flex items-center gap-3 text-xs">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-50 to-blue-50 border border-slate-100 flex items-center justify-center font-black text-[10px] text-[#0A4E9B] uppercase">
                  {l.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-black text-slate-800 uppercase tracking-tight truncate leading-none mb-1">{l.name}</h4>
                  <p className="text-[9px] text-slate-400 truncate font-semibold leading-none">{l.email}</p>
                </div>
                <span className="text-[8px] font-black text-slate-350 bg-slate-100 px-2 py-1 rounded uppercase tracking-wider">{l.status.split(' ')[0]}</span>
              </div>
            ))}
          </div>
        </div>

      </aside>

      {/* ───────────────── PROPERTY DIALOG MODAL ───────────────── */}
      <AnimatePresence>
        {showPropertyModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-300">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-[2rem] w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl"
            >
              <div className="p-6 bg-slate-900 text-white flex justify-between items-center">
                <h3 className="font-black text-lg uppercase tracking-tight">
                  {isEditingProperty ? 'Editar Imóvel' : 'Adicionar Novo Imóvel'}
                </h3>
                <button onClick={() => setShowPropertyModal(false)} className="p-2 hover:bg-white/10 rounded-full text-slate-400 hover:text-white transition-all">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSaveProperty} className="flex-1 overflow-y-auto p-8 space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="col-span-2">
                    <label className="block text-xs font-black uppercase tracking-wider text-slate-450 mb-1.5">Título / Designação do Imóvel</label>
                    <input 
                      type="text" 
                      required
                      placeholder="Ex: Apartamento T2 com Vista Lagoa"
                      value={propertyForm.name} 
                      onChange={e => setPropertyForm(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full border border-slate-200 focus:border-blue-500 rounded-xl p-3 text-xs font-semibold focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-slate-450 mb-1.5">Tipo de Imóvel</label>
                    <select 
                      value={propertyForm.category} 
                      onChange={e => setPropertyForm(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full border border-slate-200 focus:border-blue-500 rounded-xl p-3 text-xs font-black bg-white focus:outline-none"
                    >
                      <option value="Moradia">Moradia</option>
                      <option value="Apartamento">Apartamento</option>
                      <option value="Terreno">Terreno</option>
                      <option value="Comercial">Espaço Comercial</option>
                      <option value="Quinta">Quinta / Herdade</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-slate-450 mb-1.5">Valor (EUR)</label>
                    <input 
                      type="number" 
                      required
                      value={propertyForm.price || ''} 
                      onChange={e => setPropertyForm(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                      className="w-full border border-slate-200 focus:border-blue-500 rounded-xl p-3 text-xs font-semibold focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-slate-450 mb-1.5">Estado do Imóvel</label>
                    <select 
                      value={propertyForm.status} 
                      onChange={e => setPropertyForm(prev => ({ ...prev, status: e.target.value as any }))}
                      className="w-full border border-slate-200 focus:border-blue-500 rounded-xl p-3 text-xs font-black bg-white focus:outline-none"
                    >
                      <option value="Ativo">Ativo</option>
                      <option value="Reservado">Reservado</option>
                      <option value="Vendido">Vendido</option>
                    </select>
                  </div>

                  <div className="col-span-2">
                    <label className="block text-xs font-black uppercase tracking-wider text-slate-450 mb-1.5">Descrição / Características</label>
                    <textarea 
                      rows={3}
                      placeholder="Ex: T2 remodelado em 2024, cozinha equipada, suíte..."
                      value={propertyForm.description} 
                      onChange={e => setPropertyForm(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full border border-slate-200 focus:border-blue-500 rounded-xl p-3 text-xs font-semibold focus:outline-none"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-xs font-black uppercase tracking-wider text-slate-450 mb-1.5">Foto Principal</label>
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        placeholder="Insira URL da imagem..."
                        value={propertyForm.image} 
                        onChange={e => setPropertyForm(prev => ({ ...prev, image: e.target.value }))}
                        className="flex-1 border border-slate-200 rounded-xl p-3 text-xs font-semibold focus:outline-none"
                      />
                      <label className="px-4 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl text-xs font-black uppercase tracking-wider cursor-pointer flex items-center justify-center">
                        {isLoading ? '...' : <ImageIcon size={16} />}
                        <input 
                          type="file" 
                          accept="image/*" 
                          disabled={isLoading}
                          onChange={e => handleFileUpload(e.target.files, 'image')}
                          className="hidden" 
                        />
                      </label>
                    </div>
                  </div>

                  <div className="col-span-2 border-t border-slate-100 pt-4 mt-2">
                    <div className="flex justify-between items-center mb-3">
                      <label className="block text-xs font-black uppercase tracking-wider text-slate-450">Galeria de Fotos do Imóvel</label>
                      <label className="px-4 py-1.5 bg-slate-900 text-white rounded-xl text-[9px] font-black uppercase tracking-wider cursor-pointer transition-all hover:bg-blue-600 active:scale-95">
                        {isLoading ? 'Carregando...' : '+ Adicionar Fotos'}
                        <input 
                          type="file" 
                          accept="image/*" 
                          multiple 
                          disabled={isLoading}
                          onChange={e => handleFileUpload(e.target.files, 'gallery')}
                          className="hidden" 
                        />
                      </label>
                    </div>

                    <div className="grid grid-cols-5 gap-3">
                      {(propertyForm.gallery || []).map((url, idx) => (
                        <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-slate-150 group">
                          <img src={url} alt="" className="w-full h-full object-cover" />
                          <button 
                            type="button" 
                            onClick={() => setPropertyForm(prev => ({ ...prev, gallery: (prev.gallery || []).filter((_, i) => i !== idx) }))}
                            className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-100 flex gap-2 justify-end">
                  <button 
                    type="button" 
                    onClick={() => setShowPropertyModal(false)}
                    className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-black uppercase tracking-wider"
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit" 
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-md"
                  >
                    Gravar Imóvel
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
