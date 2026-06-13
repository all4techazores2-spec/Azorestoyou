import React, { useState } from 'react';
import { Restaurant, Service } from '../types';
import { 
  LogOut, Calendar, Users, Scissors, Clock, CheckCircle, 
  ShoppingBag, Image as ImageIcon, Star, Settings, Info, 
  Menu, X, Bell, Plus, Upload, Trash2, Check, DollarSign, Edit, Eye, ChevronDown,
  Home, HelpCircle, User, CreditCard
} from 'lucide-react';

interface BarberNormalDashboardProps {
  business: Restaurant;
  onUpdateBusiness: (updated: Restaurant) => void;
  onLogout: () => void;
}

const BarberNormalDashboard: React.FC<BarberNormalDashboardProps> = ({ business, onUpdateBusiness, onLogout }) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'appointments' | 'services' | 'pos' | 'gallery' | 'reviews' | 'profile' | 'settings' | 'help'>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  // Local editable states
  const [description, setDescription] = useState(business.description || 'Barbearia premium com serviços de corte, barba e estética.');
  const [phone, setPhone] = useState(business.phone || '+351 912 345 678');
  const [address, setAddress] = useState(business.address || 'Rua Principal, Ponta Delgada');
  const [openingHours, setOpeningHours] = useState(business.openingHours || '09:00 - 19:00');

  // POS sales states
  // POS sales states
  const [cart, setCart] = useState<any[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<'Dinheiro' | 'Cartão' | 'MBWay' | 'Multibanco'>('Dinheiro');
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [clientName, setClientName] = useState<string>('Cliente Geral');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('TODOS');
  const [observations, setObservations] = useState<string>('');
  const [completedSale, setCompletedSale] = useState<any | null>(null);

  const [salesHistory, setSalesHistory] = useState<any[]>(() => {
    return (business as any).salesHistory || [
      { id: 'S1', serviceName: 'Corte Degradê & Fade', price: 15.00, paymentMethod: 'Dinheiro', timestamp: new Date(Date.now() - 3600000).toISOString() },
      { id: 'S2', serviceName: 'Barba Tradicional', price: 10.00, paymentMethod: 'MBWay', timestamp: new Date(Date.now() - 7200000).toISOString() }
    ];
  });

  // Catalogs
  const servicesCatalog = [
    { id: 's1', name: 'Corte Masculino', description: 'Corte completo', price: 12.00, duration: 30, image: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=300', category: 'CORTE' },
    { id: 's2', name: 'Barba Tradicional', description: 'Barba + Toalha Quente', price: 8.00, duration: 20, image: 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=300', category: 'BARBA' },
    { id: 's3', name: 'Corte + Barba', description: 'Pacote completo', price: 18.00, duration: 45, image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=300', category: 'CORTE + BARBA' },
    { id: 's4', name: 'Degradê', description: 'Degradê completo', price: 15.00, duration: 30, image: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=300', category: 'DEGRADÊ' },
    { id: 's5', name: 'Coloração', description: 'Coloração completa', price: 25.00, duration: 60, image: 'https://images.unsplash.com/photo-1605497746444-ac9dbd324ce4?w=300', category: 'COLORAÇÃO' },
  ];

  const services = business.services && business.services.length > 0 ? business.services : servicesCatalog;

  const productsCatalog = [
    { id: 'p1', name: 'Pomada Modeladora', price: 10.00, image: 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=300' },
    { id: 'p2', name: 'Gel Fixação Forte', price: 8.00, image: 'https://images.unsplash.com/photo-1527799863830-5731454955a8?w=300' },
    { id: 'p3', name: 'Óleo para Barba', price: 9.00, image: 'https://images.unsplash.com/photo-1626015276284-bf057e050800?w=300' },
    { id: 'p4', name: 'Shampoo Cabelo', price: 12.00, image: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=300' },
    { id: 'p5', name: 'Cera Efeito Mate', price: 9.00, image: 'https://images.unsplash.com/photo-1617897903246-719242758050?w=300' },
  ];

  // Default reviews fallback
  const reviews = business.reviews_list || [
    { id: 'r1', customerName: 'Carlos Martins', rating: 5, comment: 'Excelente atendimento! Ambiente top e profissional muito dedicado.', date: 'Há 2 dias', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=256' },
    { id: 'r2', customerName: 'André Santos', rating: 5, comment: 'Muito bom serviço, sempre saio satisfeito!', date: 'Há 1 semana', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=256' }
  ];

  const reservations = business.reservations || [
    { id: 'res1', customerName: 'João Silva', time: '10:00', date: 'Hoje', status: 'accepted', customerPhone: '+351 911 222 333', serviceName: 'Corte + Barba', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=256' },
    { id: 'res2', customerName: 'Pedro Costa', time: '11:30', date: 'Hoje', status: 'accepted', customerPhone: '+351 911 444 555', serviceName: 'Degradê', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=256' },
    { id: 'res3', customerName: 'Miguel Sousa', time: '14:00', date: 'Hoje', status: 'accepted', customerPhone: '+351 922 777 888', serviceName: 'Corte', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=256' },
    { id: 'res4', customerName: 'Rafael Lima', time: '15:30', date: 'Hoje', status: 'pending', customerPhone: '+351 922 111 222', serviceName: 'Barba', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=256' },
    { id: 'res5', customerName: 'Lucas Oliveira', time: '17:00', date: 'Hoje', status: 'pending', customerPhone: '+351 933 555 444', serviceName: 'Corte + Barba', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=256' }
  ];

  const gallery = business.gallery || [
    'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=2070',
    'https://images.unsplash.com/photo-1621605815971-fbc98d665033?q=80&w=2070'
  ];

  // Hotkeys Listener
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeTab !== 'pos') return;
      if (e.key === 'F2') {
        e.preventDefault();
        const disc = prompt('Introduza o valor do desconto (%):', String(discountPercent));
        if (disc !== null) setDiscountPercent(Math.max(0, Math.min(100, parseFloat(disc) || 0)));
      } else if (e.key === 'F3') {
        e.preventDefault();
        const client = prompt('Introduza o nome do cliente:', clientName);
        if (client !== null) setClientName(client.trim() || 'Cliente Geral');
      } else if (e.key === 'F4') {
        e.preventDefault();
        const searchInput = document.getElementById('pos-search-input');
        if (searchInput) searchInput.focus();
      } else if (e.key === 'F5') {
        e.preventDefault();
        setCart([]);
      } else if (e.key === 'F9') {
        e.preventDefault();
        handleFinalizeSale();
      } else if (e.key === 'Delete') {
        e.preventDefault();
        setCart([]);
        setClientName('Cliente Geral');
        setDiscountPercent(0);
        setObservations('');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeTab, cart, discountPercent, clientName, observations]);

  // POS calculations
  const rawSubtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discountVal = (rawSubtotal * discountPercent) / 100;
  const subtotal = rawSubtotal - discountVal;
  const iva = Math.round((subtotal * 0.23) * 100) / 100;
  const total = Math.round((subtotal + iva) * 100) / 100;

  const addToCart = (item: any, type: 'service' | 'product') => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id && i.type === type);
      if (existing) {
        return prev.map(i => i.id === item.id && i.type === type ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, type, quantity: 1 }];
    });
  };

  const updateCartQuantity = (id: string, type: 'service' | 'product', delta: number) => {
    setCart(prev => prev.map(i => {
      if (i.id === id && i.type === type) {
        const nextQty = i.quantity + delta;
        return nextQty > 0 ? { ...i, quantity: nextQty } : null;
      }
      return i;
    }).filter(Boolean));
  };

  const removeFromCart = (id: string, type: 'service' | 'product') => {
    setCart(prev => prev.filter(i => !(i.id === id && i.type === type)));
  };

  const handleFinalizeSale = async () => {
    if (cart.length === 0) {
      alert('O carrinho está vazio. Adicione pelo menos um serviço ou produto.');
      return;
    }

    const API_BASE_URL = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
      ? 'http://localhost:3001'
      : 'https://azorestoyou-1.onrender.com';

    const salePayload = {
      id: `SALE_${Date.now()}`,
      barberId: business.id,
      clientId: clientName !== 'Cliente Geral' ? clientName : null,
      services: cart.filter(i => i.type === 'service').map(i => ({ serviceId: i.id, name: i.name, price: i.price, quantity: i.quantity })),
      products: cart.filter(i => i.type === 'product').map(i => ({ productId: i.id, name: i.name, price: i.price, quantity: i.quantity })),
      subtotal: subtotal,
      vat: iva,
      discount: discountVal,
      total: total,
      paymentMethod: paymentMethod,
      createdAt: new Date().toISOString()
    };

    try {
      const res = await fetch(`${API_BASE_URL}/api/sales`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(salePayload)
      });
      if (!res.ok) throw new Error('Falha ao gravar venda no servidor.');
      const savedSale = await res.json();
      
      // Update local history list
      setSalesHistory(prev => [savedSale, ...prev]);
      
      // Open success receipt modal
      setCompletedSale(savedSale);

      // Clean up states
      setCart([]);
      setObservations('');
      setDiscountPercent(0);
      setClientName('Cliente Geral');
    } catch (err) {
      console.error(err);
      alert('Erro ao finalizar a venda. Por favor, tente novamente.');
    }
  };

  const handlePhotoUpload = () => {
    const url = prompt('Introduza o URL da imagem da Barbearia:');
    if (url && url.trim()) {
      const updated = {
        ...business,
        gallery: [...gallery, url.trim()]
      };
      onUpdateBusiness(updated);
      alert('Foto adicionada com sucesso!');
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans flex overflow-hidden selection:bg-[#D4AF37] selection:text-black">
      
      {/* SIDEBAR */}
      <aside className={`bg-[#0d0d0d] border-r border-[rgba(255,215,0,0.15)] flex flex-col transition-all duration-300 z-50 shrink-0 ${
        sidebarOpen ? 'w-64' : 'w-20'
      }`}>
        {/* Brand/Logo Section */}
        <div className="p-6 border-b border-[rgba(255,215,0,0.15)] flex flex-col items-center text-center">
          <div className="flex flex-col items-center justify-center">
            {/* Crown Icon */}
            <svg className="w-5 h-5 text-[#D4AF37] mb-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2l3 5.5 5.5-1.5-2.5 7h-12l-2.5-7 5.5 1.5zM21 16h-18v2h18zM19 19h-14v2h14z" />
            </svg>
            <div className="w-12 h-12 bg-black border border-[#D4AF37] rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(212,175,55,0.25)]">
              <span className="text-xl font-black text-[#D4AF37]">B</span>
            </div>
            {sidebarOpen && (
              <div className="mt-2.5">
                <h1 className="text-xs font-black tracking-[0.2em] text-[#D4AF37] uppercase">BARBEARIA SILVA</h1>
                <p className="text-[7px] text-[#AFAFAF] font-black uppercase tracking-[0.3em] mt-0.5">PREMIUM</p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Nav */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: <Home className="w-4 h-4" /> },
            { id: 'appointments', label: 'Agenda', icon: <Calendar className="w-4 h-4" /> },
            { id: 'services', label: 'Serviços', icon: <Scissors className="w-4 h-4" /> },
            { id: 'pos', label: 'POS / Vendas', icon: <CreditCard className="w-4 h-4" />, badge: 'NOVO' },
            { id: 'gallery', label: 'Galeria', icon: <ImageIcon className="w-4 h-4" /> },
            { id: 'reviews', label: 'Avaliações', icon: <Star className="w-4 h-4" /> },
            { id: 'profile', label: 'Perfil', icon: <User className="w-4 h-4" /> },
            { id: 'settings', label: 'Definições', icon: <Settings className="w-4 h-4" /> },
            { id: 'help', label: 'Ajuda', icon: <HelpCircle className="w-4 h-4" /> },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-[18px] text-xs font-bold uppercase tracking-wider transition-all duration-300 border ${
                activeTab === item.id 
                  ? 'bg-gradient-to-r from-amber-500/10 to-yellow-600/5 border-[#D4AF37] text-[#D4AF37] shadow-[0_0_15px_rgba(212,175,55,0.1)]' 
                  : 'border-transparent text-[#AFAFAF] hover:bg-neutral-900/50 hover:text-white'
              }`}
            >
              <span className="shrink-0">{item.icon}</span>
              {sidebarOpen && <span className="flex-1 text-left">{item.label}</span>}
              {sidebarOpen && item.badge && (
                <span className="bg-[#D4AF37] text-black text-[7px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider">
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Sidebar Barber User Profile */}
        <div className="p-4 border-t border-[rgba(255,215,0,0.15)] bg-black/20">
          <div className="flex items-center gap-3">
            <img 
              src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=256" 
              alt="Avatar" 
              className="w-10 h-10 rounded-full object-cover border border-[#D4AF37]/30"
            />
            {sidebarOpen && (
              <div className="flex-1 min-w-0 text-left">
                <p className="text-xs font-black text-white truncate">Carlos Almeida</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                  <span className="text-[9px] text-[#AFAFAF] font-black uppercase tracking-widest">Online</span>
                </div>
              </div>
            )}
            {sidebarOpen && (
              <button onClick={onLogout} className="text-[#AFAFAF] hover:text-red-400">
                <LogOut size={16} />
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* MAIN CONTAINER */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        
        {/* Right side decoration layer (haircut models fading into background) */}
        <div className="absolute top-0 right-0 h-full w-24 bg-gradient-to-l from-black/85 to-transparent pointer-events-none z-10 hidden xl:block overflow-hidden opacity-25">
          <div className="flex flex-col gap-6 py-12 items-center">
            <img className="w-16 h-16 rounded-xl object-cover grayscale" src="https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=100" alt="" />
            <img className="w-16 h-16 rounded-xl object-cover grayscale" src="https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=100" alt="" />
            <img className="w-16 h-16 rounded-xl object-cover grayscale" src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100" alt="" />
          </div>
        </div>

        {/* HEADER */}
        <header className="bg-[#0d0d0d] border-b border-[rgba(255,215,0,0.15)] px-6 py-4 flex justify-between items-center sticky top-0 z-40 shrink-0">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-neutral-400 hover:text-white">
              <Menu size={20} />
            </button>
            <div className="text-left">
              <p className="text-[9px] text-[#AFAFAF] font-bold uppercase tracking-widest leading-none mb-1">Bem-vindo de volta,</p>
              <h2 className="text-xl font-black text-white leading-none">Carlos!</h2>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#D4AF37]" />
              <div className="text-left leading-none">
                <p className="text-[10px] text-white font-black">20 de Maio, 2024</p>
                <p className="text-[8px] text-[#AFAFAF] font-medium mt-0.5">Segunda-feira</p>
              </div>
            </div>
            
            <div className="relative text-neutral-400 hover:text-[#D4AF37] cursor-pointer">
              <Bell size={18} />
              <span className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 bg-[#D4AF37] text-black text-[7px] font-black flex items-center justify-center rounded-full">
                3
              </span>
            </div>

            {/* User Profile dropdown badge */}
            <div className="flex items-center gap-2 border-l border-amber-500/10 pl-6 cursor-pointer group">
              <img 
                src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=256" 
                alt="Carlos Almeida" 
                className="w-8 h-8 rounded-full object-cover border border-[#D4AF37]/30"
              />
              <div className="text-left leading-none hidden sm:block">
                <p className="text-[11px] font-black text-white group-hover:text-[#D4AF37] transition-all">Carlos Almeida</p>
                <p className="text-[9px] text-[#AFAFAF] font-medium mt-0.5">Barbeiro</p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-neutral-400 group-hover:text-[#D4AF37]" />
            </div>
          </div>
        </header>

        {/* WORKSPACE AREA */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 max-w-[1300px] w-full mx-auto">

          {/* TAB: DASHBOARD */}
          {activeTab === 'dashboard' && (
            <>
              {/* HERO COVER BANNER */}
              <div className="relative rounded-[18px] overflow-hidden border border-[rgba(255,215,0,0.15)] min-h-[160px] flex items-center justify-between p-6">
                
                {/* Left side clipper outline */}
                <div className="absolute top-4 left-6 opacity-10 pointer-events-none hidden md:block">
                  <svg className="w-16 h-16 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="9" y="2" width="6" height="16" rx="2" />
                    <path d="M12 18v4" />
                    <path d="M7 6h10" />
                  </svg>
                </div>

                <img 
                  src="https://images.unsplash.com/photo-1621605815971-fbc98d665033?q=80&w=2070" 
                  alt="Barbershop" 
                  className="absolute inset-0 w-full h-full object-cover opacity-15"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/75 to-transparent" />
                
                <div className="relative z-10 text-left space-y-2.5 max-w-lg">
                  <div className="flex items-center gap-3">
                    <h3 className="text-2xl font-black text-white tracking-tight">Barbearia Silva</h3>
                    <span className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full flex items-center gap-1">
                      <span className="w-1 h-1 bg-emerald-400 rounded-full" />
                      ATIVO
                    </span>
                  </div>
                  <p className="text-xs text-[#AFAFAF]">
                    O seu perfil está visível para todos os clientes.
                  </p>
                  <button 
                    onClick={() => setActiveTab('profile')}
                    className="flex items-center gap-2 px-4 py-1.5 bg-black/50 hover:bg-black border border-[#D4AF37]/30 hover:border-[#D4AF37] text-white text-[9px] font-bold uppercase tracking-wider rounded-lg transition-all"
                  >
                    <Edit size={12} className="text-[#D4AF37]" /> Editar Perfil
                  </button>
                </div>

                {/* Right side haircut graphic */}
                <div className="relative z-10 w-28 h-28 rounded-xl overflow-hidden border border-[#D4AF37]/20 shadow-lg hidden sm:block">
                  <img src="https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=200" className="w-full h-full object-cover" alt="" />
                </div>
              </div>

              {/* 5 ALIGNED CARDS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                
                {/* CARD 1 */}
                <div className="bg-[#0d0d0d] border border-[rgba(255,215,0,0.15)] rounded-[18px] p-5 flex flex-col justify-between hover:scale-[1.03] transition-all duration-300 hover:shadow-[0_0_15px_rgba(212,175,55,0.08)] text-left">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-black border border-[#D4AF37]/20 flex items-center justify-center shrink-0">
                      <Calendar className="w-5 h-5 text-[#D4AF37]" />
                    </div>
                    <div>
                      <p className="text-[8px] text-[#AFAFAF] font-black uppercase tracking-widest">Agendamentos Hoje</p>
                      <h4 className="text-2xl font-black text-white mt-1">5</h4>
                    </div>
                  </div>
                  <button 
                    onClick={() => setActiveTab('appointments')}
                    className="w-full mt-4 py-2 bg-black hover:bg-neutral-900 border border-[#D4AF37]/40 hover:border-[#D4AF37] text-[#D4AF37] text-[9px] font-black uppercase tracking-widest rounded-xl transition-all active:scale-95 text-center"
                  >
                    Ver Agenda
                  </button>
                </div>

                {/* CARD 2 */}
                <div className="bg-[#0d0d0d] border border-[rgba(255,215,0,0.15)] rounded-[18px] p-5 flex flex-col justify-between hover:scale-[1.03] transition-all duration-300 hover:shadow-[0_0_15px_rgba(212,175,55,0.08)] text-left">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-black border border-[#D4AF37]/20 flex items-center justify-center shrink-0">
                      <div className="w-5 h-5 rounded-full border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] text-xs font-black">★</div>
                    </div>
                    <div>
                      <p className="text-[8px] text-[#AFAFAF] font-black uppercase tracking-widest">Avaliação Média</p>
                      <h4 className="text-2xl font-black text-[#D4AF37] mt-1">4.8</h4>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex text-amber-500 text-[8px] tracking-tighter">★★★★★</div>
                    <span className="text-[8px] text-[#AFAFAF] font-bold uppercase">128 avaliações</span>
                  </div>
                </div>

                {/* CARD 3 */}
                <div className="bg-[#0d0d0d] border border-[rgba(255,215,0,0.15)] rounded-[18px] p-5 flex flex-col justify-between hover:scale-[1.03] transition-all duration-300 hover:shadow-[0_0_15px_rgba(212,175,55,0.08)] text-left">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-black border border-[#D4AF37]/20 flex items-center justify-center shrink-0">
                      <Users className="w-5 h-5 text-[#D4AF37]" />
                    </div>
                    <div>
                      <p className="text-[8px] text-[#AFAFAF] font-black uppercase tracking-widest">Novos Clientes</p>
                      <h4 className="text-2xl font-black text-white mt-1">3</h4>
                    </div>
                  </div>
                  <button 
                    onClick={() => setActiveTab('appointments')}
                    className="w-full mt-4 py-2 bg-black hover:bg-neutral-900 border border-[#D4AF37]/40 hover:border-[#D4AF37] text-[#D4AF37] text-[9px] font-black uppercase tracking-widest rounded-xl transition-all active:scale-95 text-center"
                  >
                    Ver Clientes
                  </button>
                </div>

                {/* CARD 4 */}
                <div className="bg-[#0d0d0d] border border-[rgba(255,215,0,0.15)] rounded-[18px] p-5 flex flex-col justify-between hover:scale-[1.03] transition-all duration-300 hover:shadow-[0_0_15px_rgba(212,175,55,0.08)] text-left">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-black border border-[#D4AF37]/20 flex items-center justify-center shrink-0">
                      <Eye className="w-5 h-5 text-[#D4AF37]" />
                    </div>
                    <div>
                      <p className="text-[8px] text-[#AFAFAF] font-black uppercase tracking-widest">Visualizações Perfil</p>
                      <h4 className="text-2xl font-black text-white mt-1">156</h4>
                    </div>
                  </div>
                  <p className="text-[8px] text-[#AFAFAF] mt-4 font-bold uppercase">Este mês</p>
                </div>

                {/* CARD 5 (POS SALES) */}
                <div className="bg-[#0d0d0d] border border-[#D4AF37]/30 rounded-[18px] p-5 flex flex-col justify-between hover:scale-[1.03] transition-all duration-300 hover:shadow-[0_0_20px_rgba(212,175,55,0.15)] text-left">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-black border border-[#D4AF37]/20 flex items-center justify-center shrink-0">
                      {/* POS terminal machine SVG drawing */}
                      <svg className="w-5 h-5 text-[#D4AF37]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <rect x="5" y="3" width="14" height="18" rx="2" />
                        <rect x="8" y="6" width="8" height="4" rx="1" />
                        <circle cx="9" cy="13" r="1" />
                        <circle cx="12" cy="13" r="1" />
                        <circle cx="15" cy="13" r="1" />
                        <circle cx="9" cy="16" r="1" />
                        <circle cx="12" cy="16" r="1" />
                        <circle cx="15" cy="16" r="1" />
                      </svg>
                    </div>
                    <div className="min-w-0">
                      <p className="text-[8px] text-[#AFAFAF] font-black uppercase tracking-widest truncate">POS / Vendas</p>
                      <p className="text-[7px] text-[#AFAFAF] mt-0.5 font-medium leading-tight">Faça vendas e receba pagamentos</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setActiveTab('pos')}
                    className="w-full mt-4 py-2.5 bg-gradient-to-r from-[#D4AF37] to-amber-500 hover:from-amber-500 hover:to-[#D4AF37] text-black text-[10px] font-black uppercase tracking-widest rounded-xl transition-all active:scale-95 shadow-[0_4px_10px_rgba(212,175,55,0.2)] text-center"
                  >
                    ABRIR POS
                  </button>
                </div>
              </div>

              {/* THREE COLUMN GRID SECTION (MATCHING MOCKUP 4-3-3 RATIO) */}
              <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
                
                {/* PRÓXIMOS AGENDAMENTOS (lg:col-span-4) */}
                <div className="bg-[#0d0d0d] border border-[rgba(255,215,0,0.15)] rounded-[18px] p-5 space-y-4 lg:col-span-4 text-left">
                  <div className="flex justify-between items-center">
                    <h4 className="text-xs font-black uppercase tracking-widest text-[#D4AF37]">Próximos Agendamentos</h4>
                    <button onClick={() => setActiveTab('appointments')} className="text-[9px] font-black text-[#AFAFAF] hover:text-white uppercase tracking-widest">Ver todos</button>
                  </div>
                  <div className="space-y-2.5">
                    {reservations.map((r, i) => (
                      <div key={i} className="bg-black/30 border border-neutral-900 rounded-[14px] p-3 flex justify-between items-center hover:border-[#D4AF37]/20 transition-all">
                        <div className="flex items-center gap-3 min-w-0">
                          <span className="text-[11px] font-black text-white bg-black px-2.5 py-1 rounded border border-neutral-800 shrink-0">{r.time}</span>
                          <img 
                            src={r.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${r.customerName}`} 
                            alt="" 
                            className="w-7 h-7 rounded-full object-cover bg-neutral-900 shrink-0 border border-neutral-800"
                          />
                          <div className="min-w-0">
                            <p className="text-[11px] font-black text-white truncate">{r.customerName}</p>
                            <p className="text-[8px] text-[#AFAFAF] truncate mt-0.5">{r.serviceName}</p>
                          </div>
                        </div>
                        <span className={`text-[7px] font-black uppercase px-2 py-0.5 rounded-full shrink-0 ${
                          r.status === 'accepted' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        }`}>
                          {r.status === 'accepted' ? 'Confirmado' : 'Pendente'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* SERVIÇOS (lg:col-span-3) */}
                <div className="bg-[#0d0d0d] border border-[rgba(255,215,0,0.15)] rounded-[18px] p-5 space-y-4 lg:col-span-3 text-left">
                  <div className="flex justify-between items-center">
                    <h4 className="text-xs font-black uppercase tracking-widest text-[#D4AF37]">Serviços</h4>
                    <button onClick={() => setActiveTab('services')} className="text-[9px] font-black text-[#AFAFAF] hover:text-white uppercase tracking-widest">Editar</button>
                  </div>
                  <div className="space-y-3">
                    {services.map(s => (
                      <div key={s.id} className="flex justify-between items-center pb-1.5 border-b border-neutral-900 text-xs">
                        <div className="flex items-center gap-2 min-w-0">
                          <Scissors className="w-3 h-3 text-[#D4AF37] shrink-0" />
                          <span className="text-[#AFAFAF] font-bold truncate">{s.name}</span>
                        </div>
                        <span className="text-white font-black shrink-0">€{s.price}</span>
                      </div>
                    ))}
                  </div>
                  <button 
                    onClick={() => setActiveTab('services')}
                    className="w-full mt-2 py-2.5 bg-black hover:bg-neutral-900 border border-[#D4AF37]/30 hover:border-[#D4AF37] text-white text-[9px] font-black uppercase tracking-widest rounded-xl transition-all text-center"
                  >
                    Ver todos os serviços
                  </button>
                </div>

                {/* HORÁRIO DE FUNCIONAMENTO (lg:col-span-3) */}
                <div className="bg-[#0d0d0d] border border-[rgba(255,215,0,0.15)] rounded-[18px] p-5 space-y-4 lg:col-span-3 text-left">
                  <div className="flex justify-between items-center">
                    <h4 className="text-xs font-black uppercase tracking-widest text-[#D4AF37]">Horário de Funcionamento</h4>
                    <button onClick={() => setActiveTab('profile')} className="text-[9px] font-black text-[#AFAFAF] hover:text-white uppercase tracking-widest">Editar</button>
                  </div>
                  <div className="space-y-2 text-[11px]">
                    {[
                      { day: 'Segunda', hours: '09:00 - 19:00' },
                      { day: 'Terça', hours: '09:00 - 19:00' },
                      { day: 'Quarta', hours: '09:00 - 19:00' },
                      { day: 'Quinta', hours: '09:00 - 19:00' },
                      { day: 'Sexta', hours: '09:00 - 20:00' },
                      { day: 'Sábado', hours: '09:00 - 17:00' },
                      { day: 'Domingo', hours: 'Fechado' }
                    ].map(entry => (
                      <div key={entry.day} className="flex justify-between items-center border-b border-neutral-900 pb-1 text-[11px]">
                        <span className="text-[#AFAFAF] font-bold">{entry.day}</span>
                        <span className="text-white font-black">{entry.hours}</span>
                      </div>
                    ))}
                  </div>
                  <button 
                    onClick={() => setActiveTab('profile')}
                    className="w-full mt-2 py-2.5 bg-black hover:bg-neutral-900 border border-[#D4AF37]/30 hover:border-[#D4AF37] text-white text-[9px] font-black uppercase tracking-widest rounded-xl transition-all text-center"
                  >
                    Ver horário completo
                  </button>
                </div>

              </div>

              {/* BOTTOM ROW (RATIO 4-3-3) */}
              <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
                
                {/* ÚLTIMAS AVALIAÇÕES (lg:col-span-4) */}
                <div className="bg-[#0d0d0d] border border-[rgba(255,215,0,0.15)] rounded-[18px] p-5 space-y-4 lg:col-span-4 text-left">
                  <div className="flex justify-between items-center">
                    <h4 className="text-xs font-black uppercase tracking-widest text-[#D4AF37]">Últimas Avaliações</h4>
                    <button onClick={() => setActiveTab('reviews')} className="text-[9px] font-black text-[#AFAFAF] hover:text-white uppercase tracking-widest">Ver todas</button>
                  </div>
                  <div className="space-y-4">
                    {reviews.map(rev => (
                      <div key={rev.id} className="space-y-2 text-xs border-b border-neutral-900 pb-3 last:border-0 last:pb-0">
                        <div className="flex items-center gap-2.5">
                          <img src={rev.avatar} className="w-6.5 h-6.5 rounded-full object-cover bg-neutral-900 shrink-0 border border-neutral-800" alt="" />
                          <div>
                            <p className="font-black text-white text-[11px] leading-tight">{rev.customerName}</p>
                            <div className="flex text-[#D4AF37] text-[8px] tracking-tighter mt-0.5">★★★★★</div>
                          </div>
                          <span className="text-[8px] text-[#AFAFAF] font-bold ml-auto">{rev.date}</span>
                        </div>
                        <p className="text-neutral-400 italic text-[11px] leading-relaxed">"{rev.comment}"</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* MANTENHA O PERFIL ATUALIZADO (lg:col-span-3) */}
                <div className="bg-[#0d0d0d] border border-[rgba(255,215,0,0.15)] rounded-[18px] p-5 flex flex-col justify-between text-left lg:col-span-3">
                  <div className="space-y-3">
                    <h4 className="text-xs font-black uppercase tracking-widest text-[#D4AF37]">Mantenha o seu perfil atualizado</h4>
                    
                    <div className="flex items-center gap-4 py-3">
                      <div className="relative w-14 h-14 shrink-0">
                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                          <path
                            className="text-neutral-900"
                            strokeWidth="2.5"
                            stroke="currentColor"
                            fill="none"
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          />
                          <path
                            className="text-[#D4AF37]"
                            strokeDasharray="85, 100"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            stroke="currentColor"
                            fill="none"
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-xs font-black text-white">85%</span>
                        </div>
                      </div>
                      <p className="text-[10px] text-[#AFAFAF] leading-normal font-bold">
                        Adicione mais fotos e informações para atrair mais clientes.
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setActiveTab('profile')}
                    className="w-full mt-4 py-2 bg-black hover:bg-neutral-900 border border-[#D4AF37]/30 hover:border-[#D4AF37] text-white text-[9px] font-black uppercase tracking-widest rounded-xl transition-all text-center"
                  >
                    Editar Perfil
                  </button>
                </div>

                {/* AÇÕES RÁPIDAS (lg:col-span-3) */}
                <div className="bg-[#0d0d0d] border border-[rgba(255,215,0,0.15)] rounded-[18px] p-5 space-y-3 text-left lg:col-span-3">
                  <h4 className="text-xs font-black uppercase tracking-widest text-[#D4AF37]">Ações Rápidas</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: '💳 POS / Vendas', desc: 'Vendas e pagamentos', action: () => setActiveTab('pos') },
                      { label: '📸 Adicionar Fotos', desc: 'À galeria', action: handlePhotoUpload },
                      { label: '✂️ Editar Serviços', desc: 'Gerir preços', action: () => setActiveTab('services') },
                      { label: '🕐 Atualizar Horário', desc: 'Funcionamento', action: () => setActiveTab('profile') }
                    ].map((btn, idx) => (
                      <button 
                        key={idx}
                        onClick={btn.action}
                        className="bg-black border border-neutral-900 hover:border-[#D4AF37]/45 rounded-xl p-3 text-left transition-all duration-300 hover:scale-[1.03] flex flex-col justify-between min-h-[75px]"
                      >
                        <span className="text-[9px] font-black uppercase tracking-wider text-white">{btn.label}</span>
                        <span className="text-[7px] text-[#AFAFAF] uppercase tracking-widest mt-1.5 block">{btn.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>

              </div>
            </>
          )}

          {/* TAB: AGENDA */}
          {activeTab === 'appointments' && (
            <div className="bg-[#0d0d0d] border border-[rgba(255,215,0,0.15)] rounded-[18px] p-6 space-y-6 text-left">
              <h2 className="text-base font-black uppercase tracking-wider text-[#D4AF37]">Agenda Completa</h2>
              <div className="space-y-3">
                {reservations.map((r, idx) => (
                  <div key={idx} className="bg-black/50 border border-neutral-900 p-4 rounded-[18px] flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold text-[#D4AF37] bg-[#D4AF37]/5 px-2.5 py-1.5 rounded-lg border border-[#D4AF37]/20">{r.time}</span>
                      <div>
                        <p className="text-xs font-black text-white">{r.customerName}</p>
                        <p className="text-[9px] text-[#AFAFAF] mt-0.5">{r.customerPhone || 'Sem contacto'}</p>
                      </div>
                    </div>
                    <span className="text-xs text-white/80 font-medium">{r.serviceName}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: SERVIÇOS */}
          {activeTab === 'services' && (
            <div className="bg-[#0d0d0d] border border-[rgba(255,215,0,0.15)] rounded-[18px] p-6 space-y-6 text-left">
              <div className="flex justify-between items-center">
                <h2 className="text-base font-black uppercase tracking-wider text-[#D4AF37]">Gestão de Serviços</h2>
                <button 
                  onClick={() => {
                    const name = prompt('Nome do serviço:');
                    const price = parseFloat(prompt('Preço (€):') || '0');
                    if (name && price > 0) {
                      const updated = {
                        ...business,
                        services: [...services, { id: `s_${Date.now()}`, name, price, duration: 30, description: '', image: '' }]
                      };
                      onUpdateBusiness(updated);
                    }
                  }}
                  className="bg-black border border-[#D4AF37]/50 text-[#D4AF37] px-4 py-2 rounded-[18px] text-xs font-black uppercase tracking-wider transition-all"
                >
                  + Adicionar Serviço
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {services.map((s) => (
                  <div key={s.id} className="bg-black p-5 rounded-[18px] border border-neutral-900 flex justify-between items-center">
                    <div>
                      <h3 className="font-bold text-white text-sm">{s.name}</h3>
                      <p className="text-[10px] text-[#AFAFAF] uppercase tracking-wider mt-0.5">{s.duration} mins</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-[#D4AF37] font-black text-sm">€{s.price.toFixed(2)}</span>
                      <button 
                        onClick={() => {
                          if (confirm('Eliminar este serviço?')) {
                            const updated = {
                              ...business,
                              services: services.filter(item => item.id !== s.id)
                            };
                            onUpdateBusiness(updated);
                          }
                        }}
                        className="text-red-400 hover:text-red-500 p-2 bg-red-500/10 rounded-xl"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: POS / VENDAS */}
          {activeTab === 'pos' && (
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 text-left animate-in fade-in duration-300">
              
              {/* LEFT & CENTER PANEL: Catalog & Search */}
              <div className="xl:col-span-2 space-y-6 flex flex-col justify-between">
                
                {/* Search Bar & Client Button */}
                <div className="flex gap-4">
                  <div className="relative flex-1 group">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 group-focus-within:text-[#D4AF37] transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                    </span>
                    <input 
                      id="pos-search-input"
                      type="text"
                      placeholder="Pesquisar serviços ou produtos..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-[#0D0D0D] border border-[#D4AF37]/15 rounded-[18px] pl-12 pr-24 py-4 text-xs font-bold text-white placeholder-neutral-600 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/25 transition-all"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 bg-black border border-neutral-800 text-[8px] font-black uppercase text-neutral-500 px-2 py-1 rounded-md tracking-widest select-none">
                      Ctrl + K
                    </span>
                  </div>
                  <button 
                    onClick={() => {
                      const name = prompt('Introduza o nome do cliente:', clientName);
                      if (name !== null) setClientName(name.trim() || 'Cliente Geral');
                    }}
                    className="px-6 bg-[#0D0D0D] border border-[#D4AF37]/15 rounded-[18px] text-xs font-black uppercase tracking-wider text-[#D4AF37] hover:bg-neutral-900 transition-all flex items-center gap-2"
                  >
                    <Users size={14} /> {clientName}
                  </button>
                </div>

                {/* Categories Bar */}
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-[#D4AF37]/10 scrollbar-track-transparent">
                  {['TODOS', 'CORTE', 'BARBA', 'CORTE + BARBA', 'INFANTIL', 'DEGRADÊ', 'COLORAÇÃO', 'SOBRANCELHA', 'OUTROS'].map(cat => (
                    <button
                      key={cat}
                      onClick={() => setCategoryFilter(cat)}
                      className={`px-5 py-3 rounded-xl text-[9px] font-black uppercase tracking-wider transition-all duration-300 border ${
                        categoryFilter === cat 
                          ? 'bg-[#D4AF37] border-[#D4AF37] text-black shadow-[0_4px_12px_rgba(212,175,55,0.25)]'
                          : 'bg-[#0D0D0D] border-neutral-900 text-[#AFAFAF] hover:border-[#D4AF37]/35 hover:text-white'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* SERVIÇOS Section */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xs font-black uppercase tracking-widest text-[#AFAFAF] flex items-center gap-2">
                      <Scissors size={14} className="text-[#D4AF37]" /> SERVIÇOS
                    </h3>
                    <button onClick={() => setCategoryFilter('TODOS')} className="text-[9px] font-black uppercase tracking-widest text-[#D4AF37] hover:underline">
                      Ver todos
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {servicesCatalog
                      .filter(s => categoryFilter === 'TODOS' || s.category === categoryFilter)
                      .filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.description.toLowerCase().includes(searchQuery.toLowerCase()))
                      .map(s => (
                        <div key={s.id} className="bg-[#0D0D0D] border border-neutral-900/80 hover:border-[#D4AF37]/30 rounded-[18px] p-3 flex flex-col justify-between group transition-all duration-300 hover:scale-[1.02] relative overflow-hidden">
                          <div className="absolute top-2 right-2 bg-black/70 backdrop-blur text-[8px] font-black uppercase text-[#D4AF37] px-2 py-1 rounded-md border border-[#D4AF37]/15">
                            {s.duration} min
                          </div>
                          <img src={s.image} alt={s.name} className="w-full h-24 object-cover rounded-xl border border-neutral-900" />
                          <div className="mt-3">
                            <h4 className="text-xs font-black text-white">{s.name}</h4>
                            <p className="text-[9px] text-[#AFAFAF] mt-0.5 line-clamp-1">{s.description}</p>
                          </div>
                          <div className="flex justify-between items-center mt-3 pt-2 border-t border-neutral-900/60">
                            <span className="text-xs font-black text-[#D4AF37]">€{s.price.toFixed(2)}</span>
                            <button 
                              onClick={() => addToCart(s, 'service')}
                              className="w-7 h-7 bg-[#D4AF37]/10 hover:bg-[#D4AF37] border border-[#D4AF37]/30 hover:border-[#D4AF37] text-[#D4AF37] hover:text-black rounded-lg flex items-center justify-center transition-all duration-300 active:scale-90"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>

                {/* PRODUTOS Section */}
                <div className="space-y-3 pt-2">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xs font-black uppercase tracking-widest text-[#AFAFAF] flex items-center gap-2">
                      <ShoppingBag size={14} className="text-[#D4AF37]" /> PRODUTOS
                    </h3>
                    <button onClick={() => setSearchQuery('')} className="text-[9px] font-black uppercase tracking-widest text-[#D4AF37] hover:underline">
                      Ver todos
                    </button>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                    {productsCatalog
                      .filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
                      .map(p => (
                        <div key={p.id} className="bg-[#0D0D0D] border border-neutral-900/80 hover:border-[#D4AF37]/30 rounded-[18px] p-3 flex flex-col justify-between group transition-all duration-300 hover:scale-[1.02] relative overflow-hidden">
                          <img src={p.image} alt={p.name} className="w-full h-20 object-cover rounded-xl border border-neutral-900" />
                          <div className="mt-3">
                            <h4 className="text-[10px] font-black text-white truncate">{p.name}</h4>
                          </div>
                          <div className="flex justify-between items-center mt-2 pt-2 border-t border-neutral-900/60">
                            <span className="text-xs font-black text-[#D4AF37]">€{p.price.toFixed(2)}</span>
                            <button 
                              onClick={() => addToCart(p, 'product')}
                              className="w-6 h-6 bg-[#D4AF37]/10 hover:bg-[#D4AF37] border border-[#D4AF37]/30 hover:border-[#D4AF37] text-[#D4AF37] hover:text-black rounded-lg flex items-center justify-center transition-all duration-300 active:scale-90"
                            >
                              <Plus size={12} />
                            </button>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>

                {/* OBSERVATIONS */}
                <div className="pt-2">
                  <label className="block text-[9px] font-black uppercase tracking-widest text-[#AFAFAF] mb-1.5">Observações da venda (opcional)</label>
                  <textarea 
                    placeholder="Escreva notas sobre o serviço prestado ou produtos vendidos..."
                    value={observations}
                    onChange={(e) => setObservations(e.target.value)}
                    className="w-full bg-[#0D0D0D] border border-neutral-900 rounded-[18px] p-4 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-[#D4AF37]/50 focus:ring-1 focus:ring-[#D4AF37]/15 h-16 resize-none"
                  />
                </div>

                {/* Footer Shortcuts Buttons */}
                <div className="grid grid-cols-5 gap-2 pt-2">
                  {[
                    { label: '% Desconto', key: 'F2', action: () => {
                      const val = prompt('Introduza o desconto (%):', String(discountPercent));
                      if (val !== null) setDiscountPercent(Math.max(0, Math.min(100, parseFloat(val) || 0)));
                    }},
                    { label: '👥 Cliente', key: 'F3', action: () => {
                      const name = prompt('Nome do cliente:', clientName);
                      if (name !== null) setClientName(name.trim() || 'Cliente Geral');
                    }},
                    { label: '📦 Produto', key: 'F4', action: () => {
                      const searchInput = document.getElementById('pos-search-input');
                      if (searchInput) searchInput.focus();
                    }},
                    { label: '🗑️ Limpar', key: 'F5', action: () => setCart([]) },
                    { label: '❌ Cancelar', key: 'Del', action: () => {
                      setCart([]);
                      setClientName('Cliente Geral');
                      setDiscountPercent(0);
                      setObservations('');
                    }}
                  ].map(btn => (
                    <button
                      key={btn.key}
                      onClick={btn.action}
                      className="bg-black border border-neutral-900 hover:border-[#D4AF37]/35 rounded-[18px] p-3 flex flex-col justify-between text-left transition-all duration-300 hover:scale-[1.02] min-h-[60px]"
                    >
                      <span className="text-[9px] font-black uppercase tracking-widest text-[#D4AF37]">{btn.label}</span>
                      <span className="text-[8px] text-neutral-500 font-bold uppercase tracking-wider block mt-1">{btn.key}</span>
                    </button>
                  ))}
                </div>

              </div>

              {/* RIGHT PANEL: Current Receipt / Cart & Payment */}
              <div className="bg-[#0D0D0D] border border-[#D4AF37]/15 rounded-[18px] p-6 flex flex-col justify-between gap-6 h-full relative overflow-hidden">
                
                {/* Cart Header */}
                <div className="flex justify-between items-center border-b border-neutral-900 pb-3">
                  <h3 className="text-xs font-black uppercase tracking-widest text-[#AFAFAF] flex items-center gap-2">
                    <ShoppingBag size={14} className="text-[#D4AF37]" /> PEDIDO ATUAL
                  </h3>
                  <span className="bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20 text-[9px] font-black px-2.5 py-1 rounded-md">
                    {cart.reduce((sum, i) => sum + i.quantity, 0)} ITENS
                  </span>
                </div>

                {/* Cart Items List */}
                <div className="flex-1 overflow-y-auto space-y-3 pr-1 max-h-[300px] min-h-[200px] scrollbar-thin scrollbar-thumb-[#D4AF37]/10 scrollbar-track-transparent">
                  {cart.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center py-12 text-neutral-500">
                      <ShoppingBag size={36} className="text-neutral-700 mb-2 animate-bounce" />
                      <p className="text-[10px] font-black uppercase tracking-wider">O carrinho está vazio</p>
                    </div>
                  ) : (
                    cart.map(item => (
                      <div key={`${item.id}-${item.type}`} className="flex gap-3 bg-black/40 p-2.5 rounded-xl border border-neutral-900/60 items-center justify-between group">
                        <img src={item.image} alt={item.name} className="w-10 h-10 rounded-lg object-cover border border-neutral-800" />
                        <div className="flex-1 min-w-0 text-left px-1">
                          <h4 className="text-[11px] font-black text-white truncate leading-none mb-1">{item.name}</h4>
                          <span className="text-[8px] text-[#AFAFAF] uppercase tracking-wider">
                            {item.type === 'service' ? `${item.duration} min` : '1 un.'}
                          </span>
                        </div>
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-1 bg-black rounded-lg border border-neutral-800 px-1 py-0.5">
                          <button onClick={() => updateCartQuantity(item.id, item.type, -1)} className="w-4 h-4 text-[#AFAFAF] hover:text-white text-xs font-black">-</button>
                          <span className="text-[10px] font-black px-1.5 text-white">{item.quantity}</span>
                          <button onClick={() => updateCartQuantity(item.id, item.type, 1)} className="w-4 h-4 text-[#AFAFAF] hover:text-white text-xs font-black">+</button>
                        </div>
                        <div className="text-right pl-2">
                          <span className="text-[11px] font-black text-white">€{(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                        <button 
                          onClick={() => removeFromCart(item.id, item.type)}
                          className="text-neutral-600 hover:text-red-400 p-1 transition-colors pl-2"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))
                  )}
                </div>

                {/* Receipt Totals Breakdown */}
                <div className="bg-black/60 p-4 rounded-xl border border-neutral-900/80 text-[11px] space-y-2">
                  <div className="flex justify-between text-[#AFAFAF] font-medium">
                    <span>Subtotal</span>
                    <span>€{rawSubtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-[#AFAFAF] font-medium">
                    <span>Desconto</span>
                    <span className="text-red-400">- €{discountVal.toFixed(2)} ({discountPercent}%)</span>
                  </div>
                  <div className="flex justify-between text-[#AFAFAF] font-medium">
                    <span>IVA (23% Geral)</span>
                    <span>€{iva.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-end border-t border-dashed border-neutral-800 pt-2">
                    <span className="text-[10px] font-black uppercase text-[#AFAFAF] tracking-widest">TOTAL</span>
                    <span className="text-2xl font-black text-[#D4AF37] leading-none">€{total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Sub-action buttons */}
                <div className="grid grid-cols-2 gap-2">
                  <button 
                    onClick={() => {
                      const val = prompt('Introduza o desconto (%):', String(discountPercent));
                      if (val !== null) setDiscountPercent(Math.max(0, Math.min(100, parseFloat(val) || 0)));
                    }}
                    className="py-2.5 bg-black/40 hover:bg-black border border-neutral-900 text-[9px] font-black uppercase text-white rounded-lg transition-all"
                  >
                    % Adicionar Desconto
                  </button>
                  <button 
                    onClick={() => {
                      const name = prompt('Nome do cliente:', clientName);
                      if (name !== null) setClientName(name.trim() || 'Cliente Geral');
                    }}
                    className="py-2.5 bg-black/40 hover:bg-black border border-neutral-900 text-[9px] font-black uppercase text-white rounded-lg transition-all"
                  >
                    👥 Selecionar Cliente
                  </button>
                </div>

                {/* Pagamento Block */}
                <div className="space-y-2">
                  <label className="block text-[9px] font-black uppercase tracking-widest text-[#AFAFAF] text-left">PAGAMENTO</label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'Dinheiro', label: 'Dinheiro', icon: '💵' },
                      { id: 'Cartão', label: 'Cartão', icon: '💳' },
                      { id: 'MBWay', label: 'MBWay', icon: '📱' },
                      { id: 'Multibanco', label: 'Multibanco', icon: '🏦' }
                    ].map(method => (
                      <button
                        key={method.id}
                        onClick={() => setPaymentMethod(method.id as any)}
                        className={`p-3 rounded-xl flex items-center gap-2 border transition-all duration-300 ${
                          paymentMethod === method.id 
                            ? 'bg-black border-[#D4AF37] text-[#D4AF37] shadow-[0_0_12px_rgba(212,175,55,0.15)]'
                            : 'bg-black/40 border-neutral-900 text-neutral-400 hover:border-neutral-800'
                        }`}
                      >
                        <span className="text-sm">{method.icon}</span>
                        <span className="text-[10px] font-black uppercase tracking-wider">{method.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Finalize Button */}
                <button
                  onClick={handleFinalizeSale}
                  className="w-full py-4.5 bg-gradient-to-r from-[#D4AF37] to-[#AA8426] hover:from-[#E5BF48] hover:to-[#BB9537] text-black text-xs font-black uppercase tracking-widest rounded-xl transition-all duration-300 shadow-xl shadow-[#D4AF37]/10 active:scale-[0.98]"
                >
                  ✓ FINALIZAR VENDA
                </button>

              </div>

            </div>
          )}

          {/* TAB: GALERIA */}
          {activeTab === 'gallery' && (
            <div className="bg-[#0d0d0d] border border-[rgba(255,215,0,0.15)] rounded-[18px] p-6 space-y-6 text-left">
              <div className="flex justify-between items-center">
                <h2 className="text-base font-black uppercase tracking-wider text-[#D4AF37]">Galeria</h2>
                <button 
                  onClick={handlePhotoUpload}
                  className="bg-black border border-[#D4AF37]/50 text-[#D4AF37] px-4 py-2 rounded-[18px] text-xs font-black uppercase tracking-wider transition-all"
                >
                  Adicionar Foto
                </button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {gallery.map((img, idx) => (
                  <div key={idx} className="relative aspect-square rounded-[18px] overflow-hidden border border-neutral-900 group">
                    <img src={img} className="w-full h-full object-cover" alt="" />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                      <button 
                        onClick={() => {
                          if (confirm('Remover esta foto?')) {
                            const updated = {
                              ...business,
                              gallery: gallery.filter((_, i) => i !== idx)
                            };
                            onUpdateBusiness(updated);
                          }
                        }}
                        className="bg-red-500 text-white p-2 rounded-xl"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: AVALIAÇÕES */}
          {activeTab === 'reviews' && (
            <div className="bg-[#0d0d0d] border border-[rgba(255,215,0,0.15)] rounded-[18px] p-6 space-y-6 text-left">
              <h2 className="text-base font-black uppercase tracking-wider text-[#D4AF37]">Avaliações</h2>
              <div className="space-y-4">
                {reviews.map((rev, idx) => (
                  <div key={idx} className="bg-black p-5 rounded-[18px] border border-neutral-900 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-black text-white">{rev.customerName}</span>
                      <span className="text-xs text-[#AFAFAF]">{rev.date}</span>
                    </div>
                    <div className="text-amber-500 text-xs">★★★★★</div>
                    <p className="text-xs text-neutral-400 italic">"{rev.comment}"</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: PERFIL */}
          {activeTab === 'profile' && (
            <div className="bg-[#0d0d0d] border border-[rgba(255,215,0,0.15)] rounded-[18px] p-6 space-y-6 text-left">
              <h2 className="text-base font-black uppercase tracking-wider text-[#D4AF37]">Perfil do Barbeiro</h2>
              <div className="space-y-4 max-w-xl">
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-[#AFAFAF] mb-2">Descrição da Barbearia</label>
                  <textarea
                    className="w-full bg-black border border-neutral-800 rounded-[18px] p-3 text-white text-xs h-24 focus:outline-none focus:border-[#D4AF37]/50"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-[#AFAFAF] mb-2">Telemóvel</label>
                  <input
                    type="text"
                    className="w-full bg-black border border-neutral-800 rounded-[18px] p-3 text-white text-xs font-bold focus:outline-none focus:border-[#D4AF37]/50"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-[#AFAFAF] mb-2">Morada</label>
                  <input
                    type="text"
                    className="w-full bg-black border border-neutral-800 rounded-[18px] p-3 text-white text-xs font-bold focus:outline-none focus:border-[#D4AF37]/50"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-[#AFAFAF] mb-2">Horário Funcionamento (Dias Úteis)</label>
                  <input
                    type="text"
                    className="w-full bg-black border border-neutral-800 rounded-[18px] p-3 text-white text-xs font-bold focus:outline-none focus:border-[#D4AF37]/50"
                    value={openingHours}
                    onChange={(e) => setOpeningHours(e.target.value)}
                  />
                </div>
                <button
                  onClick={handleSaveProfile}
                  className="px-6 py-3 bg-[#D4AF37] text-black text-xs font-black uppercase tracking-widest rounded-[18px] hover:bg-amber-500 transition-all"
                >
                  Guardar Alterações
                </button>
              </div>
            </div>
          )}
        </div>

        {/* FOOTER / STATUS BAR */}
        <footer className="bg-[#0D0D0D] border-t border-[#D4AF37]/15 py-4 px-6 flex flex-wrap justify-between items-center text-[9px] text-[#AFAFAF] font-black uppercase tracking-widest shrink-0 gap-4">
          <div className="flex items-center gap-6">
            <span>Caixa: <span className="text-white">CAIXA 01</span></span>
            <span className="hidden sm:inline-block text-neutral-800">|</span>
            <span>Atendente: <span className="text-white">Carlos Almeida</span></span>
            <span className="hidden sm:inline-block text-neutral-800">|</span>
            <span>Turno: <span className="text-white">Manhã</span></span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span>Estado: <span className="text-white">Online</span></span>
          </div>
        </footer>

      </div>

      {/* SUCCESS SALE MODAL (VENDA CONCLUÍDA) */}
      {completedSale && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-300">
          <div className="bg-[#0D0D0D] border border-[#D4AF37]/25 rounded-[2.5rem] p-8 max-w-md w-full text-center space-y-6 shadow-2xl relative animate-in zoom-in-95 duration-300">
            {/* Gold Checkmark Banner */}
            <div className="w-20 h-20 bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-full flex items-center justify-center mx-auto text-[#D4AF37] shadow-[0_0_20px_rgba(212,175,55,0.2)]">
              <Check className="w-10 h-10" />
            </div>
            
            <div className="space-y-1">
              <p className="text-[10px] font-black uppercase tracking-[0.25em] text-[#D4AF37]">Venda Processada</p>
              <h3 className="text-2xl font-black text-white uppercase tracking-tight">Venda Concluída!</h3>
              <p className="text-[9px] text-neutral-500 uppercase tracking-wider">{completedSale.id}</p>
            </div>

            {/* Receipt Content */}
            <div className="bg-black/55 rounded-2xl border border-neutral-900/80 p-5 text-left text-xs space-y-4 font-mono divide-y divide-neutral-900">
              <div className="space-y-1.5 pb-3">
                <div className="flex justify-between">
                  <span className="text-neutral-500">Data:</span>
                  <span className="text-white font-bold">{new Date(completedSale.createdAt).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Cliente:</span>
                  <span className="text-white font-bold">{completedSale.clientId || 'Cliente Geral'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Pagamento:</span>
                  <span className="text-[#D4AF37] font-bold uppercase">{completedSale.paymentMethod}</span>
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-2 py-3 max-h-[120px] overflow-y-auto pr-1 text-[11px]">
                {completedSale.services?.map((s: any, idx: number) => (
                  <div key={`s-${idx}`} className="flex justify-between">
                    <span className="text-white">{s.name} x{s.quantity}</span>
                    <span className="text-white font-bold">€{(s.price * s.quantity).toFixed(2)}</span>
                  </div>
                ))}
                {completedSale.products?.map((p: any, idx: number) => (
                  <div key={`p-${idx}`} className="flex justify-between">
                    <span className="text-white">{p.name} x{p.quantity}</span>
                    <span className="text-white font-bold">€{(p.price * p.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              {/* Finance Details */}
              <div className="space-y-1.5 pt-3">
                <div className="flex justify-between text-neutral-500 text-[10px]">
                  <span>Subtotal:</span>
                  <span>€{(completedSale.subtotal || 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-neutral-500 text-[10px]">
                  <span>Desconto:</span>
                  <span className="text-red-400">- €{(completedSale.discount || 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-neutral-500 text-[10px]">
                  <span>IVA (23%):</span>
                  <span>€{(completedSale.vat || 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm font-bold border-t border-neutral-950 pt-2 text-[#D4AF37]">
                  <span>TOTAL:</span>
                  <span>€{(completedSale.total || 0).toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-3 gap-2">
              <button 
                onClick={() => alert('A enviar comando para a impressora térmica... (Simulado)')} 
                className="py-3 bg-black hover:bg-neutral-950 border border-neutral-800 hover:border-[#D4AF37]/30 text-[9px] font-black uppercase text-white rounded-xl transition-all"
              >
                🖨️ Recibo
              </button>
              <button 
                onClick={() => {
                  const email = prompt('Introduza o email do cliente:', 'cliente@email.com');
                  if (email) alert(`Recibo digital enviado com sucesso para: ${email}`);
                }} 
                className="py-3 bg-black hover:bg-neutral-950 border border-neutral-800 hover:border-[#D4AF37]/30 text-[9px] font-black uppercase text-white rounded-xl transition-all"
              >
                📧 Email
              </button>
              <button 
                onClick={() => {
                  const phone = prompt('Introduza o número de telemóvel do cliente:', '+351 900 000 000');
                  if (phone) alert(`Recibo digital enviado por WhatsApp para: ${phone}`);
                }} 
                className="py-3 bg-black hover:bg-neutral-950 border border-neutral-800 hover:border-[#D4AF37]/30 text-[9px] font-black uppercase text-white rounded-xl transition-all"
              >
                💬 WhatsApp
              </button>
            </div>

            <button
              onClick={() => setCompletedSale(null)}
              className="w-full py-4.5 bg-[#D4AF37] hover:bg-amber-500 text-black text-xs font-black uppercase tracking-widest rounded-xl transition-all"
            >
              Fechar
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default BarberNormalDashboard;
