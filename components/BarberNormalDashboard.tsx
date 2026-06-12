import React, { useState } from 'react';
import { Restaurant, Service } from '../types';
import { 
  LogOut, Calendar, Users, Scissors, Clock, CheckCircle, 
  ShoppingBag, Image as ImageIcon, Star, Settings, Info, 
  Menu, X, Bell, Plus, Upload, Trash2, Check, DollarSign, Edit, Eye 
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
  const [openingHours, setOpeningHours] = useState(business.openingHours || '09:00-13:00, 14:00-19:00');

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
    { id: 's2', name: 'Barba', description: 'Alinhamento com navalha e toalha quente', price: 10.00, duration: 20, image: '' },
    { id: 's3', name: 'Corte + Barba', description: 'Combo premium completo', price: 20.00, duration: 50, image: '' },
    { id: 's4', name: 'Infantil', description: 'Corte para crianças até 12 anos', price: 10.00, duration: 25, image: '' }
  ];

  // Default reviews fallback
  const reviews = business.reviews_list || [
    { id: 'r1', customerName: 'João Silva', rating: 5, comment: 'Excelente atendimento, corte degradê perfeito!', date: '2026-06-11', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John' },
    { id: 'r2', customerName: 'Pedro Medeiros', rating: 5, comment: 'A melhor barbearia da ilha. Recomendo vivamente.', date: '2026-06-10', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Pete' }
  ];

  const reservations = business.reservations || [
    { id: 'res1', customerName: 'Rui Costa', time: '10:30', date: 'Hoje', status: 'accepted', customerPhone: '+351 911 222 333', serviceName: 'Corte Masculino' },
    { id: 'res2', customerName: 'Hugo Santos', time: '11:45', date: 'Hoje', status: 'pending', customerPhone: '+351 911 444 555', serviceName: 'Corte + Barba' },
    { id: 'res3', customerName: 'Miguel Ramos', time: '15:15', date: 'Hoje', status: 'accepted', customerPhone: '+351 922 777 888', serviceName: 'Barba' }
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
  const iva = Math.round((subtotal * 0.18) * 100) / 100; // 18% standard Azores IVA
  const total = Math.round((subtotal + iva) * 100) / 100;

  // Add Product to Sale
  const handleAddProduct = () => {
    if (extraProduct && extraProductPrice > 0) {
      setAddedProducts([...addedProducts, { name: extraProduct, price: extraProductPrice }]);
      setExtraProduct('');
      setExtraProductPrice(0);
    }
  };

  // Finalize Sale
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

    // Save
    const updated = {
      ...business,
      salesHistory: updatedSales
    } as any;
    onUpdateBusiness(updated);

    alert(`Venda Finalizada com sucesso!\nValor Total: €${total.toFixed(2)} (${paymentMethod})`);
    
    // Reset form
    setSelectedServiceId('');
    setAddedProducts([]);
  };

  // Add to gallery
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
    <div className="min-h-screen bg-[#050505] text-white font-sans flex overflow-hidden">
      
      {/* SIDEBAR */}
      <aside className={`bg-[#0d0d0d] border-r border-[rgba(255,215,0,0.15)] flex flex-col transition-all duration-300 z-50 shrink-0 ${
        sidebarOpen ? 'w-64' : 'w-20'
      }`}>
        {/* Brand/Logo */}
        <div className="p-6 border-b border-[rgba(255,215,0,0.15)] flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-black border border-[#D4AF37] rounded-[18px] flex items-center justify-center shadow-[0_0_15px_rgba(212,175,55,0.25)]">
              <span className="text-lg font-black text-[#D4AF37]">B</span>
            </div>
            {sidebarOpen && (
              <div>
                <h1 className="text-xs font-black tracking-widest text-[#D4AF37] uppercase">BARBEARIA</h1>
                <p className="text-[9px] text-[#AFAFAF] font-bold uppercase tracking-widest">ESTADO NORMAL</p>
              </div>
            )}
          </div>
          {sidebarOpen && (
            <button onClick={() => setSidebarOpen(false)} className="text-neutral-500 hover:text-[#D4AF37] lg:hidden">
              <X size={18} />
            </button>
          )}
        </div>

        {/* Sidebar Nav */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: '🏠' },
            { id: 'appointments', label: 'Agenda', icon: '📅' },
            { id: 'services', label: 'Serviços', icon: '✂️' },
            { id: 'pos', label: 'POS / Vendas', icon: '💳' },
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
                  ? 'bg-black border-[#D4AF37] text-[#D4AF37] shadow-[0_0_15px_rgba(212,175,55,0.1)]' 
                  : 'border-transparent text-[#AFAFAF] hover:bg-neutral-900/50 hover:text-white'
              }`}
            >
              <span className="text-base">{item.icon}</span>
              {sidebarOpen && <span>{item.label}</span>}
            </button>
          ))}
        </nav>

        {/* Sidebar Barber User Profile */}
        <div className="p-4 border-t border-[rgba(255,215,0,0.15)] bg-black/20">
          <div className="flex items-center gap-3">
            <img 
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256" 
              alt="Avatar" 
              className="w-10 h-10 rounded-full object-cover border border-[#D4AF37]/30"
            />
            {sidebarOpen && (
              <div className="flex-1 min-w-0">
                <p className="text-xs font-black text-white truncate">Carlos</p>
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

      {/* MAIN CONTENT CONTAINER */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* HEADER */}
        <header className="bg-[#0d0d0d] border-b border-[rgba(255,215,0,0.15)] px-6 py-4 flex justify-between items-center sticky top-0 z-40 shrink-0">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-neutral-400 hover:text-white">
              <Menu size={20} />
            </button>
            <div>
              <p className="text-[10px] text-[#AFAFAF] font-bold uppercase tracking-wider">Bem-vindo de volta,</p>
              <h2 className="text-sm font-black text-[#D4AF37] uppercase tracking-widest">Carlos!</h2>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <span className="text-[10px] text-[#AFAFAF] font-black uppercase tracking-widest hidden md:block">
              {new Date().toLocaleDateString('pt-PT', { weekday: 'long', day: 'numeric', month: 'long' })}
            </span>
            
            <div className="relative text-neutral-400 hover:text-[#D4AF37] cursor-pointer">
              <Bell size={18} />
              <span className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-[#D4AF37] rounded-full" />
            </div>

            <img 
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256" 
              alt="User Profile" 
              className="w-8 h-8 rounded-full object-cover border border-[#D4AF37]/30"
            />
          </div>
        </header>

        {/* WORKSPACE VIEW */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">

          {/* TAB: DASHBOARD */}
          {activeTab === 'dashboard' && (
            <>
              {/* HERO COVER BANNER */}
              <div className="relative rounded-[18px] overflow-hidden border border-[rgba(255,215,0,0.15)] min-h-[180px] flex items-end">
                <img 
                  src={business.image || 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?q=80&w=2070'} 
                  alt="Barbershop" 
                  className="absolute inset-0 w-full h-full object-cover opacity-25"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] to-transparent" />
                <div className="relative z-10 p-6 space-y-2">
                  <div className="flex items-center gap-2.5">
                    <h3 className="text-xl font-black text-white">{business.name}</h3>
                    <span className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full">
                      ATIVO
                    </span>
                  </div>
                  <p className="text-[11px] text-[#AFAFAF] font-bold uppercase tracking-wider">
                    "O seu perfil está visível para todos os clientes."
                  </p>
                </div>
              </div>

              {/* 5 ALIGNED CARDS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                {/* CARD 1 */}
                <div className="bg-[#0d0d0d] border border-[rgba(255,215,0,0.15)] rounded-[18px] p-5 flex flex-col justify-between hover:scale-[1.03] transition-all duration-300 hover:shadow-[0_0_15px_rgba(212,175,55,0.08)]">
                  <div>
                    <span className="text-lg">📅</span>
                    <p className="text-[9px] text-[#AFAFAF] font-black uppercase tracking-widest mt-1">Agendamentos Hoje</p>
                    <h4 className="text-2xl font-black text-white mt-2">{reservations.length}</h4>
                  </div>
                  <button 
                    onClick={() => setActiveTab('appointments')}
                    className="w-full mt-4 py-2 bg-black hover:bg-neutral-900 border border-[#D4AF37]/40 hover:border-[#D4AF37] text-[#D4AF37] text-[9px] font-black uppercase tracking-widest rounded-[18px] transition-all active:scale-95"
                  >
                    Ver Agenda
                  </button>
                </div>

                {/* CARD 2 */}
                <div className="bg-[#0d0d0d] border border-[rgba(255,215,0,0.15)] rounded-[18px] p-5 flex flex-col justify-between hover:scale-[1.03] transition-all duration-300 hover:shadow-[0_0_15px_rgba(212,175,55,0.08)]">
                  <div>
                    <span className="text-lg">⭐</span>
                    <p className="text-[9px] text-[#AFAFAF] font-black uppercase tracking-widest mt-1">Avaliação Média</p>
                    <h4 className="text-2xl font-black text-[#D4AF37] mt-2">{business.rating || 4.8}</h4>
                    <div className="flex text-amber-500 text-xs mt-1">★★★★★</div>
                  </div>
                  <p className="text-[9px] text-[#AFAFAF] mt-2 font-bold uppercase">{reviews.length} avaliações</p>
                </div>

                {/* CARD 3 */}
                <div className="bg-[#0d0d0d] border border-[rgba(255,215,0,0.15)] rounded-[18px] p-5 flex flex-col justify-between hover:scale-[1.03] transition-all duration-300 hover:shadow-[0_0_15px_rgba(212,175,55,0.08)]">
                  <div>
                    <span className="text-lg">👥</span>
                    <p className="text-[9px] text-[#AFAFAF] font-black uppercase tracking-widest mt-1">Novos Clientes</p>
                    <h4 className="text-2xl font-black text-white mt-2">6</h4>
                  </div>
                  <button 
                    onClick={() => setActiveTab('appointments')}
                    className="w-full mt-4 py-2 bg-black hover:bg-neutral-900 border border-[#D4AF37]/40 hover:border-[#D4AF37] text-[#D4AF37] text-[9px] font-black uppercase tracking-widest rounded-[18px] transition-all active:scale-95"
                  >
                    Ver Clientes
                  </button>
                </div>

                {/* CARD 4 */}
                <div className="bg-[#0d0d0d] border border-[rgba(255,215,0,0.15)] rounded-[18px] p-5 flex flex-col justify-between hover:scale-[1.03] transition-all duration-300 hover:shadow-[0_0_15px_rgba(212,175,55,0.08)]">
                  <div>
                    <span className="text-lg">👁</span>
                    <p className="text-[9px] text-[#AFAFAF] font-black uppercase tracking-widest mt-1">Visualizações Perfil</p>
                    <h4 className="text-2xl font-black text-white mt-2">128</h4>
                  </div>
                  <p className="text-[9px] text-[#AFAFAF] mt-2 font-bold uppercase">Este mês</p>
                </div>

                {/* CARD 5 */}
                <div className="bg-[#0d0d0d] border border-[#D4AF37]/30 rounded-[18px] p-5 flex flex-col justify-between hover:scale-[1.03] transition-all duration-300 hover:shadow-[0_0_20px_rgba(212,175,55,0.15)]">
                  <div>
                    <span className="text-lg">💳</span>
                    <p className="text-[9px] text-[#AFAFAF] font-black uppercase tracking-widest mt-1">POS / Vendas</p>
                    <p className="text-[8px] text-[#AFAFAF] mt-2 font-medium">Faça vendas e receba pagamentos</p>
                  </div>
                  <button 
                    onClick={() => setActiveTab('pos')}
                    className="w-full mt-4 py-2.5 bg-gradient-to-r from-[#D4AF37] to-amber-500 hover:from-amber-500 hover:to-[#D4AF37] text-black text-[10px] font-black uppercase tracking-widest rounded-[18px] transition-all active:scale-95 shadow-[0_4px_10px_rgba(212,175,55,0.2)]"
                  >
                    ABRIR POS
                  </button>
                </div>
              </div>

              {/* TWO COLUMN GRID */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* PRÓXIMOS AGENDAMENTOS */}
                <div className="bg-[#0d0d0d] border border-[rgba(255,215,0,0.15)] rounded-[18px] p-6 space-y-6 lg:col-span-2">
                  <div className="flex justify-between items-center">
                    <h4 className="text-xs font-black uppercase tracking-widest text-[#D4AF37]">Próximos Agendamentos</h4>
                    <button onClick={() => setActiveTab('appointments')} className="text-[9px] font-black text-[#AFAFAF] hover:text-white uppercase tracking-widest">Ver Todos</button>
                  </div>
                  <div className="space-y-3">
                    {reservations.map((r, i) => (
                      <div key={i} className="bg-black/40 border border-neutral-900 rounded-[18px] p-4 flex justify-between items-center hover:border-[#D4AF37]/25 transition-all">
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-bold text-[#D4AF37] bg-[#D4AF37]/5 px-2.5 py-1.5 rounded-lg border border-[#D4AF37]/20">{r.time}</span>
                          <img 
                            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${r.customerName}`} 
                            alt="" 
                            className="w-8 h-8 rounded-full bg-neutral-900"
                          />
                          <div>
                            <p className="text-xs font-black text-white">{r.customerName}</p>
                            <p className="text-[9px] text-[#AFAFAF] mt-0.5">{r.serviceName}</p>
                          </div>
                        </div>
                        <span className={`text-[8px] font-black uppercase px-2.5 py-1 rounded-full ${
                          r.status === 'accepted' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        }`}>
                          {r.status === 'accepted' ? 'Confirmado' : 'Pendente'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* HORÁRIO DE FUNCIONAMENTO */}
                <div className="bg-[#0d0d0d] border border-[rgba(255,215,0,0.15)] rounded-[18px] p-6 space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="text-xs font-black uppercase tracking-widest text-[#D4AF37]">Horário Funcionamento</h4>
                    <button onClick={() => setActiveTab('profile')} className="text-[9px] font-black text-[#AFAFAF] hover:text-white uppercase tracking-widest">Editar</button>
                  </div>
                  <div className="space-y-2 text-xs">
                    {['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'].map(day => (
                      <div key={day} className="flex justify-between items-center border-b border-neutral-900 pb-1.5 text-[11px]">
                        <span className="text-[#AFAFAF] font-bold">{day}</span>
                        <span className="text-white font-black">
                          {day === 'Sábado' ? '09:00 - 13:00' : day === 'Domingo' ? 'Fechado' : openingHours}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* SERVIÇOS LIST */}
                <div className="bg-[#0d0d0d] border border-[rgba(255,215,0,0.15)] rounded-[18px] p-6 space-y-6">
                  <div className="flex justify-between items-center">
                    <h4 className="text-xs font-black uppercase tracking-widest text-[#D4AF37]">Serviços</h4>
                    <div className="flex gap-2">
                      <button onClick={() => setActiveTab('services')} className="text-[9px] font-black text-[#AFAFAF] hover:text-white uppercase tracking-widest">Editar</button>
                      <span className="text-neutral-700">|</span>
                      <button onClick={() => setActiveTab('services')} className="text-[9px] font-black text-[#AFAFAF] hover:text-white uppercase tracking-widest">Ver Todos</button>
                    </div>
                  </div>
                  <div className="space-y-4">
                    {services.map(s => (
                      <div key={s.id} className="flex justify-between items-center pb-2 border-b border-neutral-900">
                        <div>
                          <p className="text-xs font-black text-white">{s.name}</p>
                          <p className="text-[8px] text-[#AFAFAF] font-bold uppercase tracking-widest mt-0.5">{s.duration} mins</p>
                        </div>
                        <span className="text-xs font-black text-[#D4AF37]">€{s.price.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* ÚLTIMAS AVALIAÇÕES */}
                <div className="bg-[#0d0d0d] border border-[rgba(255,215,0,0.15)] rounded-[18px] p-6 space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="text-xs font-black uppercase tracking-widest text-[#D4AF37]">Últimas Avaliações</h4>
                    <button onClick={() => setActiveTab('reviews')} className="text-[9px] font-black text-[#AFAFAF] hover:text-white uppercase tracking-widest">Ver Todas</button>
                  </div>
                  <div className="space-y-3">
                    {reviews.slice(0, 1).map(rev => (
                      <div key={rev.id} className="space-y-2 text-xs">
                        <div className="flex items-center gap-2">
                          <img src={rev.avatar} className="w-6 h-6 rounded-full bg-neutral-900" alt="" />
                          <span className="font-black text-white">{rev.customerName}</span>
                          <span className="text-amber-500 font-bold ml-auto">★★★★★</span>
                        </div>
                        <p className="text-neutral-400 italic text-[11px]">"{rev.comment}"</p>
                        <p className="text-[8px] text-[#AFAFAF] uppercase tracking-wider">{rev.date}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* PERFIL UPDATE CARD */}
                <div className="bg-[#0d0d0d] border border-[rgba(255,215,0,0.15)] rounded-[18px] p-6 flex flex-col justify-between">
                  <div className="space-y-3">
                    <h4 className="text-xs font-black uppercase tracking-widest text-[#D4AF37]">Perfil</h4>
                    <p className="text-xs text-[#AFAFAF] font-medium leading-relaxed">
                      "Mantenha o seu perfil atualizado para obter mais clientes."
                    </p>
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] font-black text-[#D4AF37]">
                        <span>Completude do Perfil</span>
                        <span>85%</span>
                      </div>
                      <div className="w-full bg-neutral-900 rounded-full h-1.5 overflow-hidden border border-amber-500/10">
                        <div className="bg-[#D4AF37] h-full rounded-full" style={{ width: '85%' }} />
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => setActiveTab('profile')}
                    className="w-full mt-4 py-2.5 bg-black hover:bg-neutral-900 border border-[#D4AF37]/40 hover:border-[#D4AF37] text-white text-[10px] font-black uppercase tracking-widest rounded-[18px] transition-all"
                  >
                    Editar Perfil
                  </button>
                </div>

              </div>

              {/* QUICK ACTION CARDS */}
              <div className="space-y-3">
                <h4 className="text-xs font-black uppercase tracking-widest text-[#D4AF37]">Ações Rápidas</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: '💳 POS / Vendas', action: () => setActiveTab('pos') },
                    { label: '📸 Adicionar Fotos', action: handlePhotoUpload },
                    { label: '✂️ Editar Serviços', action: () => setActiveTab('services') },
                    { label: '🕐 Atualizar Horário', action: () => setActiveTab('profile') }
                  ].map((btn, idx) => (
                    <button 
                      key={idx}
                      onClick={btn.action}
                      className="bg-[#0d0d0d] border border-[rgba(255,215,0,0.15)] hover:border-[#D4AF37]/50 rounded-[18px] py-4 px-3 text-center transition-all duration-300 font-black text-[10px] uppercase tracking-wider text-[#AFAFAF] hover:text-white hover:scale-[1.03] hover:shadow-[0_0_15px_rgba(212,175,55,0.08)] bg-black/40"
                    >
                      {btn.label}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* TAB: AGENDA */}
          {activeTab === 'appointments' && (
            <div className="bg-[#0d0d0d] border border-[rgba(255,215,0,0.15)] rounded-[18px] p-6 space-y-6">
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
            <div className="bg-[#0d0d0d] border border-[rgba(255,215,0,0.15)] rounded-[18px] p-6 space-y-6">
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

          {/* TAB: POS / VENDAS (SIMPLIFICADO) */}
          {activeTab === 'pos' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* POS Sales Form */}
              <div className="bg-[#0d0d0d] border border-[rgba(255,215,0,0.15)] rounded-[18px] p-6 space-y-6 lg:col-span-2">
                <h2 className="text-base font-black uppercase tracking-wider text-[#D4AF37]">POS - Caixa Registadora</h2>
                
                <div className="space-y-4">
                  {/* Select Service */}
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

                  {/* Add simulated product */}
                  <div className="border-t border-neutral-900 pt-4 space-y-3">
                    <label className="block text-[10px] font-black uppercase tracking-widest text-[#AFAFAF]">Adicionar Produto Extra</label>
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        placeholder="Nome do produto (ex: Cera Modeladora)"
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

                    {/* Added Products Basket */}
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

                  {/* Invoice Summary */}
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

                  {/* Payment Methods */}
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
                    className="w-full py-4 bg-gradient-to-r from-[#D4AF37] to-amber-500 hover:from-amber-500 hover:to-[#D4AF37] text-black text-xs font-black uppercase tracking-widest rounded-[18px] transition-all duration-300 active:scale-95"
                  >
                    FINALIZAR VENDA
                  </button>
                </div>
              </div>

              {/* Transactions History */}
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
            <div className="bg-[#0d0d0d] border border-[rgba(255,215,0,0.15)] rounded-[18px] p-6 space-y-6">
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
            <div className="bg-[#0d0d0d] border border-[rgba(255,215,0,0.15)] rounded-[18px] p-6 space-y-6">
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
            <div className="bg-[#0d0d0d] border border-[rgba(255,215,0,0.15)] rounded-[18px] p-6 space-y-6">
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

          {/* TAB: DEFINIÇÕES */}
          {activeTab === 'settings' && (
            <div className="bg-[#0d0d0d] border border-[rgba(255,215,0,0.15)] rounded-[18px] p-6 space-y-6">
              <h2 className="text-base font-black uppercase tracking-wider text-[#D4AF37]">Definições</h2>
              <div className="space-y-4 text-xs max-w-md">
                <div className="flex justify-between items-center py-2 border-b border-neutral-900">
                  <span className="font-bold text-[#AFAFAF]">Notificações no Navegador</span>
                  <input type="checkbox" defaultChecked className="accent-[#D4AF37]" />
                </div>
                <div className="flex justify-between items-center py-2 border-b border-neutral-900">
                  <span className="font-bold text-[#AFAFAF]">Tema Visual</span>
                  <span className="font-black text-[#D4AF37]">Premium Gold & Dark</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB: AJUDA */}
          {activeTab === 'help' && (
            <div className="bg-[#0d0d0d] border border-[rgba(255,215,0,0.15)] rounded-[18px] p-6 space-y-6">
              <h2 className="text-base font-black uppercase tracking-wider text-[#D4AF37]">Ajuda</h2>
              <div className="space-y-4 text-xs leading-relaxed max-w-xl text-[#AFAFAF]">
                <div>
                  <h4 className="font-black uppercase tracking-widest text-[#D4AF37] mb-1">Como usar a Caixa Registadora?</h4>
                  <p>Aceda a **POS / Vendas**, selecione o serviço que realizou ao cliente, adicione opcionais se necessário, escolha o método de pagamento e clique em **Finalizar Venda**.</p>
                </div>
                <div>
                  <h4 className="font-black uppercase tracking-widest text-[#D4AF37] mb-1">Dúvidas ou Suporte</h4>
                  <p>Envie um e-mail de suporte para support@azorestoyou.com para qualquer esclarecimento sobre a sua conta Standard.</p>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* FOOTER */}
        <footer className="bg-[#0d0d0d] border-t border-[rgba(255,215,0,0.15)] py-4 px-6 text-center text-[9px] text-[#AFAFAF] font-bold uppercase tracking-widest shrink-0">
          &copy; {new Date().getFullYear()} AzoresToYou. Todos os direitos reservados.
        </footer>

      </div>

    </div>
  );
};

export default BarberNormalDashboard;
