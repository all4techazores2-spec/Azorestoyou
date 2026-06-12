import React, { useState } from 'react';
import { Restaurant, Service } from '../types';
import { 
  LogOut, Calendar, Users, Scissors, Clock, CheckCircle, 
  ShoppingBag, Image as ImageIcon, Star, Settings, Info, 
  Menu, X, Bell, Plus, Upload, Trash2, Check, DollarSign, Edit, Eye, ChevronDown 
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
  const [selectedServiceId, setSelectedServiceId] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'Dinheiro' | 'Cartão' | 'MBWay' | 'Multibanco'>('Dinheiro');
  const [extraProduct, setExtraProduct] = useState('');
  const [extraProductPrice, setExtraProductPrice] = useState(0);
  const [addedProducts, setAddedProducts] = useState<{ name: string; price: number }[]>([]);
  const [salesHistory, setSalesHistory] = useState<any[]>(() => {
    return (business as any).salesHistory || [
      { id: 'S1', serviceName: 'Corte Degradê & Fade', price: 15.00, paymentMethod: 'Dinheiro', timestamp: new Date(Date.now() - 3600000).toISOString() },
      { id: 'S2', serviceName: 'Barba Tradicional', price: 10.00, paymentMethod: 'MBWay', timestamp: new Date(Date.now() - 7200000).toISOString() }
    ];
  });

  // Services list
  const services: Service[] = business.services || [
    { id: 's1', name: 'Corte Masculino', description: 'Corte de cabelo moderno ou clássico', price: 12.00, duration: 30, image: '' },
    { id: 's2', name: 'Barba', description: 'Alinhamento com navalha e toalha quente', price: 8.00, duration: 20, image: '' },
    { id: 's3', name: 'Corte + Barba', description: 'Combo premium completo', price: 18.00, duration: 50, image: '' },
    { id: 's4', name: 'Corte Infantil', description: 'Corte para crianças até 12 anos', price: 10.00, duration: 25, image: '' },
    { id: 's5', name: 'Degradê', description: 'Corte fade moderno', price: 12.00, duration: 30, image: '' }
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

  // POS calculations
  const selectedService = services.find(s => s.id === selectedServiceId);
  const servicePrice = selectedService ? selectedService.price : 0;
  const productsTotal = addedProducts.reduce((sum, p) => sum + p.price, 0);
  const subtotal = servicePrice + productsTotal;
  const iva = Math.round((subtotal * 0.18) * 100) / 100;
  const total = Math.round((subtotal + iva) * 100) / 100;

  const handleAddProduct = () => {
    if (extraProduct && extraProductPrice > 0) {
      setAddedProducts([...addedProducts, { name: extraProduct, price: extraProductPrice }]);
      setExtraProduct('');
      setExtraProductPrice(0);
    }
  };

  const handleFinalizeSale = () => {
    if (!selectedService && addedProducts.length === 0) {
      alert('Selecione pelo menos um serviço ou adicione um produto.');
      return;
    }

    const title = selectedService 
      ? selectedService.name + (addedProducts.length > 0 ? ` + ${addedProducts.length} Prod` : '')
      : `${addedProducts.length} Produtos`;

    const newSale = {
      id: `SALE_${Date.now()}`,
      serviceName: title,
      price: total,
      paymentMethod,
      timestamp: new Date().toISOString()
    };

    const updatedSales = [newSale, ...salesHistory];
    setSalesHistory(updatedSales);

    const updated = {
      ...business,
      salesHistory: updatedSales
    } as any;
    onUpdateBusiness(updated);

    alert(`Venda Finalizada com sucesso!\nValor Total: €${total.toFixed(2)} (${paymentMethod})`);
    setSelectedServiceId('');
    setAddedProducts([]);
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
            { id: 'dashboard', label: 'Dashboard', icon: '🏠' },
            { id: 'appointments', label: 'Agenda', icon: '📅' },
            { id: 'services', label: 'Serviços', icon: '✂️' },
            { id: 'pos', label: 'POS / Vendas', icon: '💳', badge: 'NOVO' },
            { id: 'gallery', label: 'Galeria', icon: '🖼' },
            { id: 'reviews', label: 'Avaliações', icon: '⭐' },
            { id: 'profile', label: 'Perfil', icon: '👤' },
            { id: 'settings', label: 'Definições', icon: '⚙' },
            { id: 'help', label: 'Ajuda', icon: '❓' },
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
              <span className="text-base">{item.icon}</span>
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
        <div className="absolute top-0 right-0 h-full w-24 bg-gradient-to-l from-black/80 to-transparent pointer-events-none z-10 hidden xl:block overflow-hidden opacity-30">
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
                  <p className="text-xs text-[#AFAFAF] font-medium leading-relaxed">
                    O seu perfil está visível para todos os clientes.
                  </p>
                  <button 
                    onClick={() => setActiveTab('profile')}
                    className="flex items-center gap-2 px-4 py-1.5 bg-black/60 hover:bg-black border border-[#D4AF37]/30 hover:border-[#D4AF37] text-white text-[9px] font-black uppercase tracking-widest rounded-lg transition-all active:scale-95"
                  >
                    <Edit size={11} className="text-[#D4AF37]" /> Editar Perfil
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
                <div className="bg-[#0d0d0d] border border-[rgba(255,215,0,0.15)] rounded-[18px] p-5 flex items-center gap-4 hover:scale-[1.03] transition-all duration-300 hover:shadow-[0_0_15px_rgba(212,175,55,0.08)] text-left">
                  <div className="w-10 h-10 rounded-xl bg-black border border-[#D4AF37]/20 flex items-center justify-center shrink-0">
                    <span className="text-lg">📅</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[8px] text-[#AFAFAF] font-black uppercase tracking-widest truncate">Agendamentos Hoje</p>
                    <h4 className="text-xl font-black text-white mt-0.5">5</h4>
                    <button onClick={() => setActiveTab('appointments')} className="text-[8px] text-[#D4AF37] font-black uppercase hover:underline mt-1 block">Ver Agenda</button>
                  </div>
                </div>

                {/* CARD 2 */}
                <div className="bg-[#0d0d0d] border border-[rgba(255,215,0,0.15)] rounded-[18px] p-5 flex items-center gap-4 hover:scale-[1.03] transition-all duration-300 hover:shadow-[0_0_15px_rgba(212,175,55,0.08)] text-left">
                  <div className="w-10 h-10 rounded-xl bg-black border border-[#D4AF37]/20 flex items-center justify-center shrink-0">
                    <span className="text-lg">⭐</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[8px] text-[#AFAFAF] font-black uppercase tracking-widest truncate">Avaliação Média</p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <h4 className="text-xl font-black text-[#D4AF37]">4.8</h4>
                      <div className="flex text-amber-500 text-[8px] tracking-tighter">★★★★★</div>
                    </div>
                    <p className="text-[8px] text-[#AFAFAF] mt-1 font-bold uppercase">128 avaliações</p>
                  </div>
                </div>

                {/* CARD 3 */}
                <div className="bg-[#0d0d0d] border border-[rgba(255,215,0,0.15)] rounded-[18px] p-5 flex items-center gap-4 hover:scale-[1.03] transition-all duration-300 hover:shadow-[0_0_15px_rgba(212,175,55,0.08)] text-left">
                  <div className="w-10 h-10 rounded-xl bg-black border border-[#D4AF37]/20 flex items-center justify-center shrink-0">
                    <span className="text-lg">👥</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[8px] text-[#AFAFAF] font-black uppercase tracking-widest truncate">Novos Clientes</p>
                    <h4 className="text-xl font-black text-white mt-0.5">3</h4>
                    <button onClick={() => setActiveTab('appointments')} className="text-[8px] text-[#D4AF37] font-black uppercase hover:underline mt-1 block">Ver Clientes</button>
                  </div>
                </div>

                {/* CARD 4 */}
                <div className="bg-[#0d0d0d] border border-[rgba(255,215,0,0.15)] rounded-[18px] p-5 flex items-center gap-4 hover:scale-[1.03] transition-all duration-300 hover:shadow-[0_0_15px_rgba(212,175,55,0.08)] text-left">
                  <div className="w-10 h-10 rounded-xl bg-black border border-[#D4AF37]/20 flex items-center justify-center shrink-0">
                    <span className="text-lg">👁</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[8px] text-[#AFAFAF] font-black uppercase tracking-widest truncate">Visualizações Perfil</p>
                    <h4 className="text-xl font-black text-white mt-0.5">156</h4>
                    <p className="text-[8px] text-[#AFAFAF] mt-1 font-bold uppercase">Este mês</p>
                  </div>
                </div>

                {/* CARD 5 (ABRIR POS) */}
                <div className="bg-[#0d0d0d] border border-[#D4AF37]/30 rounded-[18px] p-5 flex flex-col justify-between hover:scale-[1.03] transition-all duration-300 hover:shadow-[0_0_20px_rgba(212,175,55,0.15)] text-left">
                  <div className="flex items-center gap-3">
                    <span className="text-lg">💳</span>
                    <div className="min-w-0">
                      <p className="text-[8px] text-[#AFAFAF] font-black uppercase tracking-widest truncate">POS / Vendas</p>
                      <p className="text-[7px] text-[#AFAFAF] mt-0.5 font-medium leading-tight">Faça vendas e receba pagamentos</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setActiveTab('pos')}
                    className="w-full mt-3 py-2 bg-gradient-to-r from-[#D4AF37] to-amber-500 hover:from-amber-500 hover:to-[#D4AF37] text-black text-[9px] font-black uppercase tracking-widest rounded-xl transition-all active:scale-95 text-center"
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
                            className="w-7 h-7 rounded-full object-cover bg-neutral-900 shrink-0"
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
                    className="w-full mt-2 py-2 bg-black hover:bg-neutral-900 border border-[#D4AF37]/30 hover:border-[#D4AF37] text-[#D4AF37] text-[9px] font-black uppercase tracking-widest rounded-xl transition-all text-center"
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
                    className="w-full mt-2 py-2 bg-black hover:bg-neutral-900 border border-[#D4AF37]/30 hover:border-[#D4AF37] text-[#D4AF37] text-[9px] font-black uppercase tracking-widest rounded-xl transition-all text-center"
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
                          <img src={rev.avatar} className="w-6.5 h-6.5 rounded-full object-cover bg-neutral-900 shrink-0" alt="" />
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
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-left">
              <div className="bg-[#0d0d0d] border border-[rgba(255,215,0,0.15)] rounded-[18px] p-6 space-y-6 lg:col-span-2">
                <h2 className="text-base font-black uppercase tracking-wider text-[#D4AF37]">POS - Caixa Registadora</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-[#AFAFAF] mb-2">Selecionar Serviço</label>
                    <select
                      className="w-full bg-black border border-neutral-800 rounded-[18px] p-3 text-white text-xs font-bold focus:border-[#D4AF37]/50 focus:outline-none"
                      value={selectedServiceId}
                      onChange={(e) => setSelectedServiceId(e.target.value)}
                    >
                      <option value="">Selecione um serviço...</option>
                      {services.map(s => (
                        <option key={s.id} value={s.id}>{s.name} (€{s.price.toFixed(2)})</option>
                      ))}
                    </select>
                  </div>

                  <div className="border-t border-neutral-900 pt-4 space-y-3">
                    <label className="block text-[10px] font-black uppercase tracking-widest text-[#AFAFAF]">Adicionar Produto Extra</label>
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        placeholder="Nome do produto"
                        value={extraProduct}
                        onChange={(e) => setExtraProduct(e.target.value)}
                        className="flex-1 bg-black border border-neutral-800 rounded-[18px] p-3 text-white text-xs"
                      />
                      <input 
                        type="number" 
                        placeholder="Preço (€)"
                        value={extraProductPrice || ''}
                        onChange={(e) => setExtraProductPrice(parseFloat(e.target.value) || 0)}
                        className="w-24 bg-black border border-neutral-800 rounded-[18px] p-3 text-white text-xs"
                      />
                      <button 
                        onClick={handleAddProduct}
                        className="px-4 bg-black border border-[#D4AF37]/40 text-[#D4AF37] text-xs font-black rounded-[18px] hover:bg-neutral-900"
                      >
                        +
                      </button>
                    </div>

                    {addedProducts.length > 0 && (
                      <div className="bg-black/35 p-3 rounded-[18px] border border-neutral-900 space-y-2">
                        {addedProducts.map((p, idx) => (
                          <div key={idx} className="flex justify-between items-center text-xs text-[#AFAFAF]">
                            <span>{p.name}</span>
                            <span className="font-bold text-white">€{p.price.toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="bg-black p-4 rounded-[18px] border border-neutral-900 text-xs space-y-2">
                    <div className="flex justify-between text-[#AFAFAF]">
                      <span>Subtotal</span>
                      <span>€{subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-[#AFAFAF]">
                      <span>IVA (18% Regional)</span>
                      <span>€{iva.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm font-black border-t border-neutral-800 pt-2 text-[#D4AF37]">
                      <span>Total Venda</span>
                      <span>€{total.toFixed(2)}</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-[#AFAFAF] mb-2">Método Pagamento</label>
                    <div className="grid grid-cols-4 gap-2">
                      {(['Dinheiro', 'Cartão', 'MBWay', 'Multibanco'] as const).map(method => (
                        <button
                          key={method}
                          onClick={() => setPaymentMethod(method)}
                          className={`py-3 rounded-[18px] text-[10px] font-black uppercase tracking-widest transition-all border ${
                            paymentMethod === method 
                              ? 'bg-black border-[#D4AF37] text-[#D4AF37] shadow-[0_0_10px_rgba(212,175,55,0.1)]' 
                              : 'border-neutral-900 bg-black text-[#AFAFAF]'
                          }`}
                        >
                          {method}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <button
                    onClick={handleFinalizeSale}
                    className="w-full py-4 bg-gradient-to-r from-[#D4AF37] to-amber-500 hover:from-amber-500 hover:to-[#D4AF37] text-black text-xs font-black uppercase tracking-widest rounded-[18px] transition-all duration-300 active:scale-95 text-center"
                  >
                    FINALIZAR VENDA
                  </button>
                </div>
              </div>

              <div className="bg-[#0d0d0d] border border-[rgba(255,215,0,0.15)] rounded-[18px] p-6 space-y-6">
                <h2 className="text-base font-black uppercase tracking-wider text-[#D4AF37]">Histórico Vendas</h2>
                <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
                  {salesHistory.map((s, idx) => (
                    <div key={idx} className="bg-black/50 p-4 rounded-[18px] border border-neutral-900 flex justify-between items-center">
                      <div>
                        <p className="text-xs font-black text-white truncate max-w-[120px]">{s.serviceName}</p>
                        <p className="text-[8px] text-[#AFAFAF] uppercase mt-0.5">{s.paymentMethod} • {new Date(s.timestamp).toLocaleTimeString()}</p>
                      </div>
                      <span className="text-emerald-400 font-black text-xs">€{s.price.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
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

        {/* FOOTER */}
        <footer className="bg-[#0d0d0d] border-t border-[rgba(255,215,0,0.15)] py-4 px-6 text-center text-[9px] text-[#AFAFAF] font-bold uppercase tracking-widest shrink-0 animate-in fade-in">
          &copy; {new Date().getFullYear()} AzoresToYou. Todos os direitos reservados.
        </footer>

      </div>

    </div>
  );
};

export default BarberNormalDashboard;
