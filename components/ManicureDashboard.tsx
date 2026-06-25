import React, { useState, useEffect } from 'react';
import { Restaurant, Service, Product } from '../types';
import { 
  LogOut, Calendar, Users, Scissors, Clock, CheckCircle, 
  ShoppingBag, Image as ImageIcon, Star, Settings, Info, 
  Menu, X, Bell, Plus, Upload, Trash2, Check, DollarSign, Edit, Eye, ChevronDown,
  Home, HelpCircle, User, CreditCard, MessageSquare, Sparkles, Sun, Moon, ArrowRight,
  TrendingUp, Award, RefreshCw, Smartphone, Search, AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { API_BASE_URL } from '../config';


interface ManicureDashboardProps {
  business: Restaurant;
  onUpdateBusiness: (updated: Restaurant) => void;
  onLogout: () => void;
}

const ManicureDashboard: React.FC<ManicureDashboardProps> = ({ business, onUpdateBusiness, onLogout }) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'clientes' | 'appointments' | 'services' | 'products' | 'staff' | 'commissions' | 'reports' | 'messages' | 'settings' | 'pos'>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  // Custom states for weather/time widget
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Clientes States
  const [clientesList, setClientesList] = useState<any[]>(() => {
    return (business as any).fiadoClients || [
      { id: 'c1', name: 'Ana Rodrigues', phone: '+351 912 345 678', email: 'ana.rodrigues@gmail.com', lastVisit: '2026-06-20', balance: 0 },
      { id: 'c2', name: 'Beatriz Sousa', phone: '+351 919 876 543', email: 'beatriz.sousa@hotmail.com', lastVisit: '2026-06-18', balance: 0 },
      { id: 'c3', name: 'Catarina Melo', phone: '+351 922 456 789', email: 'catarina.melo@sapo.pt', lastVisit: '2026-06-25', balance: 0 }
    ];
  });
  const [showAddClienteModal, setShowAddClienteModal] = useState(false);
  const [newClienteForm, setNewClienteForm] = useState({ name: '', phone: '', email: '' });

  // Appointments States
  const [appointmentsList, setAppointmentsList] = useState<any[]>(() => {
    return business.reservations || [
      { id: 'res1', customerName: 'Ana Rodrigues', time: '10:00', date: 'Hoje', status: 'accepted', customerPhone: '+351 912 345 678', serviceName: 'Verniz Gel + Nail Art', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100' },
      { id: 'res2', customerName: 'Beatriz Sousa', time: '11:30', date: 'Hoje', status: 'pending', customerPhone: '+351 919 876 543', serviceName: 'Pedicure SPA', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100' },
      { id: 'res3', customerName: 'Joana Silva', time: '14:00', date: 'Hoje', status: 'accepted', customerPhone: '+351 933 111 222', serviceName: 'Manicure Simples', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100' },
      { id: 'res4', customerName: 'Mariana Costa', time: '16:00', date: 'Amanhã', status: 'pending', customerPhone: '+351 966 555 444', serviceName: 'Unhas de Gel (Manutenção)', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100' }
    ];
  });

  // Services States
  const defaultServices: Service[] = [
    { id: 's1', name: 'Manicure Simples', description: 'Corte, lima e hidratação básica.', price: 10.00, duration: 25, image: '' },
    { id: 's2', name: 'Verniz Gel', description: 'Aplicação de verniz gel de longa duração.', price: 15.00, duration: 40, image: '' },
    { id: 's3', name: 'Unhas de Gel (Aplicação)', description: 'Alongamento com gel e nail art incluída.', price: 35.00, duration: 90, image: '' },
    { id: 's4', name: 'Unhas de Gel (Manutenção)', description: 'Manutenção de alongamento em gel.', price: 25.00, duration: 60, image: '' },
    { id: 's5', name: 'Pedicure SPA', description: 'Tratamento completo de pés com esfoliação e hidratação.', price: 22.00, duration: 50, image: '' }
  ];
  const servicesList = business.services && business.services.length > 0 ? business.services : defaultServices;
  const [showServiceForm, setShowServiceForm] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [serviceForm, setServiceForm] = useState({ name: '', description: '', price: '', duration: '40', image: '', showInApp: true, promoPrice: '' });

  // Products States
  const defaultProducts: Product[] = [
    { id: 'p1', name: 'Óleo de Cutículas Flor de Cerejeira', description: 'Hidratação profunda para cutículas.', price: 6.50, category: 'Cuidados', image: '', stock: 15 },
    { id: 'p2', name: 'Creme de Mãos Rejuvenescedor', description: 'Creme rico com extratos naturais dos Açores.', price: 12.00, category: 'Hidratação', image: '', stock: 8 },
    { id: 'p3', name: 'Verniz Fortalecedor Cálcio', description: 'Base fortalecedora enriquecida com cálcio.', price: 8.90, category: 'Tratamentos', image: '', stock: 20 },
    { id: 'p4', name: 'Lima Diamante Profissional', description: 'Lima de alta durabilidade and precisão.', price: 3.50, category: 'Acessórios', image: '', stock: 50 }
  ];
  const productsList = business.products && business.products.length > 0 ? business.products : defaultProducts;
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState({ name: '', description: '', price: '', category: 'Cuidados', stock: '10', image: '', showInApp: true, promoPrice: '' });

  const [isUploading, setIsUploading] = useState(false);
  const handleImageUpload = async (file: File, type: 'service' | 'product') => {
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      const res = await fetch(`${API_BASE_URL}/api/upload`, {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) throw new Error('Upload failed');
      const data = await res.json();
      if (type === 'service') {
        setServiceForm(prev => ({ ...prev, image: data.url }));
      } else {
        setProductForm(prev => ({ ...prev, image: data.url }));
      }
    } catch (e) {
      console.error(e);
      alert('Erro ao carregar a imagem. Tente novamente.');
    } finally {
      setIsUploading(false);
    }
  };


  // Staff States
  const [staffList, setStaffList] = useState<any[]>([
    { id: 'st1', name: 'Mariana Silva', role: 'Proprietária & Nail Stylist', phone: '+351 912 345 678', commissions: 0, performance: 'Excelente', shift: '09:00 - 19:00' },
    { id: 'st2', name: 'Joana Martins', role: 'Manicure & Pedicure Specialist', phone: '+351 922 888 777', commissions: 125.50, performance: 'Excelente', shift: '09:00 - 18:00' },
    { id: 'st3', name: 'Rita Pereira', role: 'Esteticista & Nail Artist', phone: '+351 933 444 555', commissions: 94.00, performance: 'Bom', shift: '10:00 - 19:00' }
  ]);
  const [showAddStaffModal, setShowAddStaffModal] = useState(false);
  const [newStaffForm, setNewStaffForm] = useState({ name: '', role: '', phone: '', shift: '09:00 - 19:00' });

  // Partner Commissions Azores toYou
  const [commissionsHistory, setCommissionsHistory] = useState<any[]>([
    { id: 'com1', partnerName: 'Hotel Terra Nostra', serviceSold: 'Pedicure SPA', commission: 2.20, date: '2026-06-25', status: 'pending' },
    { id: 'com2', partnerName: 'Azores Rental Car', serviceSold: 'Unhas de Gel', commission: 3.50, date: '2026-06-24', status: 'paid' },
    { id: 'com3', partnerName: 'Guia Turístico João', serviceSold: 'Verniz Gel', commission: 1.50, date: '2026-06-22', status: 'paid' }
  ]);

  // Sales History
  const [salesHistory, setSalesHistory] = useState<any[]>([
    { id: 'sale1', clientName: 'Ana Rodrigues', items: [{ name: 'Verniz Gel', price: 15.00, qty: 1 }], subtotal: 15.00, discount: 0, total: 15.00, paymentMethod: 'MBWay', timestamp: new Date(Date.now() - 3600000).toISOString() },
    { id: 'sale2', clientName: 'Catarina Melo', items: [{ name: 'Pedicure SPA', price: 22.00, qty: 1 }, { name: 'Óleo de Cutículas', price: 6.50, qty: 1 }], subtotal: 28.50, discount: 2.85, total: 25.65, paymentMethod: 'Cartão', timestamp: new Date(Date.now() - 7200000).toISOString() }
  ]);

  // POS State
  const [cart, setCart] = useState<any[]>([]);
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [selectedClient, setSelectedClient] = useState<string>('Cliente Geral');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'Dinheiro' | 'Cartão' | 'MBWay' | 'Multibanco'>('Cartão');
  const [posSearchQuery, setPosSearchQuery] = useState('');
  const [posCategoryFilter, setPosCategoryFilter] = useState<'TODOS' | 'SERVICOS' | 'PRODUTOS'>('TODOS');

  // Business info editor states
  const [bizForm, setBizForm] = useState({
    name: business.name || 'Bella Nails',
    welcomeName: business.welcomeName || 'Mariana',
    phone: business.phone || '+351 912 345 678',
    email: business.email || 'geral@bellanails.pt',
    address: business.address || 'Ponta Delgada, São Miguel, Açores',
    description: business.description || 'Salão de beleza especializado em manicure, pedicure, gel e estética corporal premium nos Açores.',
    logo: business.logo || '',
    coverImage: business.coverImage || business.image || 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=800'
  });

  // Calculate Cart Totals
  const rawSubtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discountVal = (rawSubtotal * discountPercent) / 100;
  const total = Math.max(0, rawSubtotal - discountVal);

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
    }).filter(Boolean) as any[]);
  };

  const removeFromCart = (id: string, type: 'service' | 'product') => {
    setCart(prev => prev.filter(i => !(i.id === id && i.type === type)));
  };

  const handleFinalizeSale = () => {
    if (cart.length === 0) {
      alert('O carrinho de POS está vazio!');
      return;
    }
    const newSale = {
      id: `sale_${Date.now()}`,
      clientName: selectedClient,
      items: cart.map(i => ({ name: i.name, price: i.price, qty: i.quantity })),
      subtotal: rawSubtotal,
      discount: discountVal,
      total: total,
      paymentMethod: selectedPaymentMethod,
      timestamp: new Date().toISOString()
    };
    setSalesHistory([newSale, ...salesHistory]);
    
    // Update local client last visit if matched
    if (selectedClient !== 'Cliente Geral') {
      setClientesList(prev => prev.map(c => c.name === selectedClient ? { ...c, lastVisit: new Date().toISOString().split('T')[0] } : c));
    }

    setCart([]);
    setDiscountPercent(0);
    setSelectedClient('Cliente Geral');
    alert('✅ Venda finalizada com sucesso!');
    setActiveTab('dashboard');
  };

  // Add Client Handler
  const handleAddCliente = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClienteForm.name.trim()) return;
    const newC = {
      id: `c_${Date.now()}`,
      name: newClienteForm.name,
      phone: newClienteForm.phone || 'N/A',
      email: newClienteForm.email || 'N/A',
      lastVisit: 'Hoje',
      balance: 0
    };
    setClientesList([newC, ...clientesList]);
    setNewClienteForm({ name: '', phone: '', email: '' });
    setShowAddClienteModal(false);
    alert('✅ Cliente registado com sucesso!');
  };

  // Add Staff Handler
  const handleAddStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStaffForm.name.trim()) return;
    const newS = {
      id: `st_${Date.now()}`,
      name: newStaffForm.name,
      role: newStaffForm.role || 'Nail Artist',
      phone: newStaffForm.phone || 'N/A',
      commissions: 0,
      performance: 'Bom',
      shift: newStaffForm.shift
    };
    setStaffList([...staffList, newS]);
    setNewStaffForm({ name: '', role: '', phone: '', shift: '09:00 - 19:00' });
    setShowAddStaffModal(false);
    alert('✅ Colaboradora adicionada com sucesso!');
  };

  // Save Settings/Profile
  const handleSaveProfile = () => {
    const updated = {
      ...business,
      name: bizForm.name,
      welcomeName: bizForm.welcomeName,
      phone: bizForm.phone,
      email: bizForm.email,
      address: bizForm.address,
      description: bizForm.description,
      coverImage: bizForm.coverImage
    };
    onUpdateBusiness(updated);
    alert('✅ Perfil do salão Bella Nails atualizado com sucesso!');
  };

  // Dynamic Azores toYou commissions calculation (0.05 microtax per sold service/product in completed sales)
  const completedSalesItemsCount = salesHistory.reduce((totalItems, sale) => {
    const saleItemsCount = (sale.items || []).reduce((sum: number, item: any) => sum + (item.qty || item.quantity || 1), 0);
    return totalItems + saleItemsCount;
  }, 0);

  const totalCommissionAzoresToYou = completedSalesItemsCount * 0.05;

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-800 font-sans flex overflow-hidden">
      
      {/* SIDEBAR */}
      <aside className={`bg-[#0A192F] text-white flex flex-col transition-all duration-300 z-50 shrink-0 ${
        sidebarOpen ? 'w-72' : 'w-20'
      }`}>
        {/* Brand / Logo */}
        <div className="p-6 border-b border-white/10 flex flex-col items-center">
          <div className="flex items-center gap-3">
            <img src="/finallogo.png" alt="Azores toYou Logo" className="w-10 h-10 rounded-full object-cover shadow-lg" />
            {sidebarOpen && (
              <div>
                <span className="font-extrabold text-sm tracking-widest block uppercase text-emerald-400">Azores toYou</span>
                <span className="text-[9px] text-white/50 block font-bold uppercase tracking-widest -mt-0.5">Parceiro Oficial</span>
              </div>
            )}
          </div>
        </div>

        {/* Business Selector (Mockup style) */}
        <div className="px-4 py-4">
          <div className={`flex items-center gap-3 p-3 bg-white/5 rounded-2xl border border-white/10 ${sidebarOpen ? 'justify-between' : 'justify-center'}`}>
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-8 h-8 rounded-full bg-pink-500 flex items-center justify-center shrink-0 shadow-lg text-white">
                💅
              </div>
              {sidebarOpen && (
                <div className="min-w-0">
                  <p className="text-xs font-black text-white truncate">{bizForm.name}</p>
                  <p className="text-[9px] text-pink-400 font-bold tracking-tight">Manicure &amp; Estética</p>
                </div>
              )}
            </div>
            {sidebarOpen && <ChevronDown size={14} className="text-white/40 shrink-0" />}
          </div>
        </div>

        {/* Navigation Menus */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto no-scrollbar">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: <Home size={18} /> },
            { id: 'clientes', label: 'Clientes', icon: <Users size={18} /> },
            { id: 'appointments', label: 'Agendamentos', icon: <Calendar size={18} /> },
            { id: 'services', label: 'Serviços', icon: <Scissors size={18} /> },
            { id: 'products', label: 'Produtos', icon: <ShoppingBag size={18} /> },
            { id: 'staff', label: 'Funcionárias', icon: <User size={18} /> },
            { id: 'pos', label: 'POS Vendas', icon: <CreditCard size={18} />, badge: 'LIVE' },
            { id: 'commissions', label: 'Comissão Azores toYou', icon: <TrendingUp size={18} /> },
            { id: 'reports', label: 'Relatórios', icon: <Award size={18} /> },
            { id: 'messages', label: 'Mensagens', icon: <MessageSquare size={18} />, count: 3 },
            { id: 'settings', label: 'Definições', icon: <Settings size={18} /> },
          ].map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl text-xs font-black uppercase tracking-wider transition-all duration-300 group ${
                  isActive 
                    ? 'bg-gradient-to-r from-pink-500 to-rose-600 text-white shadow-[0_8px_20px_-6px_rgba(236,72,153,0.5)] border border-pink-500/20' 
                    : 'text-white/70 hover:bg-white/5 hover:text-white border border-transparent'
                }`}
              >
                <span className={`shrink-0 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>
                  {item.icon}
                </span>
                {sidebarOpen && <span className="flex-1 text-left">{item.label}</span>}
                {sidebarOpen && item.count && (
                  <span className="bg-pink-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full">
                    {item.count}
                  </span>
                )}
                {sidebarOpen && item.badge && (
                  <span className="bg-emerald-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded-full animate-pulse">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Motivational Card at Bottom */}
        {sidebarOpen && (
          <div className="p-4 m-4 bg-gradient-to-tr from-emerald-600/20 to-blue-600/20 border border-white/5 rounded-3xl relative overflow-hidden text-center group">
            <div className="absolute inset-0 bg-cover bg-center opacity-10 group-hover:scale-110 transition-transform duration-700" style={{ backgroundImage: "url('/fundo.png')" }} />
            <p className="text-[10px] font-bold text-slate-300 relative z-10 leading-relaxed uppercase tracking-wider">
              Juntos, fazemos a economia dos Açores crescer!
            </p>
            <div className="mt-2.5 flex justify-center relative z-10">
              <span className="text-pink-500 animate-pulse text-base">❤️</span>
            </div>
          </div>
        )}

        {/* Proprietária Profile Footer */}
        <div className="p-4 border-t border-white/10 bg-black/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img 
              src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100" 
              alt="Mariana Silva" 
              className="w-9 h-9 rounded-full object-cover border-2 border-pink-500"
            />
            {sidebarOpen && (
              <div className="text-left">
                <p className="text-[11px] font-black text-white leading-tight">Mariana Silva</p>
                <p className="text-[9px] text-white/50 font-bold uppercase tracking-widest mt-0.5">Proprietária</p>
              </div>
            )}
          </div>
          {sidebarOpen && (
            <button onClick={onLogout} className="p-2 text-white/40 hover:text-red-400 rounded-xl hover:bg-white/5 transition-all">
              <LogOut size={16} />
            </button>
          )}
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        
        {/* HEADER BAR */}
        <header className="bg-white/70 backdrop-blur-xl border-b border-slate-100 px-8 py-5 flex justify-between items-center sticky top-0 z-40 shrink-0">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-slate-400 hover:text-slate-900 transition-colors">
              <Menu size={20} />
            </button>
            <div className="text-left">
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest leading-none mb-1">Painel do Parceiro</p>
              <h2 className="text-lg font-black text-slate-900 leading-none">{bizForm.name}</h2>
            </div>
          </div>
          
          <div className="flex items-center gap-5">
            <div className="hidden sm:flex items-center gap-2.5 bg-slate-100/70 border border-slate-200/50 px-4 py-2 rounded-2xl">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
              <span className="text-[10px] text-slate-600 font-extrabold uppercase tracking-wider">AAS Nails Studio Online</span>
            </div>

            <div className="relative text-slate-400 hover:text-pink-500 cursor-pointer transition-colors p-2 bg-slate-100 rounded-xl">
              <Bell size={18} />
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-pink-500 rounded-full border-2 border-white" />
            </div>

            <div className="relative text-slate-400 hover:text-pink-500 cursor-pointer transition-colors p-2 bg-slate-100 rounded-xl" onClick={() => setActiveTab('messages')}>
              <MessageSquare size={18} />
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-pink-500 rounded-full border-2 border-white" />
            </div>

            <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
              <img 
                src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100" 
                alt="Avatar" 
                className="w-8 h-8 rounded-full object-cover border border-pink-500"
              />
              <div className="text-left leading-none hidden md:block">
                <p className="text-xs font-black text-slate-800">Mariana Silva</p>
                <p className="text-[9px] text-slate-400 font-medium uppercase mt-0.5">Gestor</p>
              </div>
            </div>
          </div>
        </header>

        {/* WORKSPACE SCROLLABLE */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8 max-w-7xl w-full mx-auto">
          
          <AnimatePresence mode="wait">
            
            {/* VIEW: DASHBOARD */}
            {activeTab === 'dashboard' && (
              <motion.div
                key="dashboard-view"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.35 }}
                className="space-y-8 text-left"
              >
                {/* Boas-vindas */}
                <div>
                  <h1 className="text-3xl font-black text-slate-900 tracking-tight">Bem-vinda, {bizForm.welcomeName || 'Mariana'}! 💅</h1>
                  <p className="text-slate-500 font-medium mt-1">Tenha um dia incrível e cheio de beleza.</p>
                </div>

                {/* Widget Superior Estilo Windows 11 */}
                <div className="bg-white/70 backdrop-blur-xl border border-white rounded-[24px] shadow-sm overflow-hidden flex flex-col md:flex-row items-stretch">
                  <div className="p-8 flex-1 flex flex-col justify-between space-y-6">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <span className="text-5xl font-black text-slate-900 select-none tracking-tight">
                          {currentTime.toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                          {currentTime.toLocaleDateString('pt-PT', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-2 justify-end text-slate-800">
                          <Sun size={20} className="text-amber-500 animate-spin" style={{ animationDuration: '30s' }} />
                          <span className="text-2xl font-black">18°C</span>
                        </div>
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-wider">Céu pouco nublado</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5 text-xs text-slate-500 font-bold bg-slate-50 px-4 py-2 rounded-2xl w-fit border border-slate-100">
                      <span className="text-base">📍</span>
                      <span>Ponta Delgada, São Miguel, Açores</span>
                    </div>
                  </div>
                  <div className="md:w-[350px] relative overflow-hidden bg-pink-100 flex items-center justify-center shrink-0 min-h-[160px]">
                    <img 
                      src="https://images.unsplash.com/photo-1604654894610-df63bc536371?w=800" 
                      alt="Unhas e Manicure Premium" 
                      className="absolute inset-0 w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-white via-transparent to-transparent hidden md:block" />
                  </div>
                </div>

                {/* Dashboard layout with Circle POS Vendas central and surrounding large cards */}
                <div className="flex flex-col lg:flex-row items-center justify-center gap-8 py-6">
                  
                  {/* Left Column (Cards) */}
                  <div className="w-full lg:w-1/3 flex flex-col gap-5">
                    {[
                      { id: 'appointments', title: 'Agendamentos', desc: 'Ver e gerir agendamentos', icon: <Calendar size={20} />, color: 'text-purple-600 bg-purple-50/60 border-purple-100/40' },
                      { id: 'clientes', title: 'Clientes', desc: 'Ver todos os clientes', icon: <Users size={20} />, color: 'text-blue-600 bg-blue-50/60 border-blue-100/40' },
                      { id: 'services', title: 'Serviços', desc: 'Gerir serviços do salão', icon: <Scissors size={20} />, color: 'text-emerald-600 bg-emerald-50/60 border-emerald-100/40' }
                    ].map((card) => (
                      <button
                        key={card.id}
                        onClick={() => setActiveTab(card.id as any)}
                        className="bg-white/95 backdrop-blur-xl border border-slate-100/80 p-5 rounded-[22px] shadow-[0_8px_30px_rgb(0,0,0,0.015)] hover:shadow-[0_15px_40px_rgba(236,72,153,0.06)] hover:-translate-y-0.5 hover:border-pink-200/50 transition-all duration-300 flex items-center justify-between text-left group cursor-pointer"
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-11 h-11 rounded-[16px] flex items-center justify-center shrink-0 border ${card.color} shadow-sm`}>
                            {card.icon}
                          </div>
                          <div>
                            <h3 className="font-extrabold text-[13px] text-slate-800 tracking-wide">{card.title}</h3>
                            <p className="text-[11px] text-slate-400 font-medium mt-0.5">{card.desc}</p>
                          </div>
                        </div>
                        <ArrowRight size={15} className="text-slate-300 group-hover:text-pink-500 group-hover:translate-x-1 transition-all" />
                      </button>
                    ))}
                  </div>

                  {/* Center Circle POS Vendas (Hero Card) */}
                  <div className="w-full lg:w-1/3 flex items-center justify-center py-6">
                    <motion.button
                      onClick={() => setActiveTab('pos')}
                      whileHover={{ scale: 1.05 }}
                      className="w-52 h-52 rounded-full bg-gradient-to-tr from-pink-500 to-rose-500 text-white flex flex-col items-center justify-center shadow-[0_20px_50px_rgba(244,63,94,0.35)] relative cursor-pointer group focus:outline-none border-4 border-white"
                    >
                      {/* Ripple waves */}
                      <span className="absolute inset-0 rounded-full bg-pink-500/20 animate-ping pointer-events-none" />
                      <span className="absolute inset-2 rounded-full border border-white/20 animate-pulse pointer-events-none" />

                      <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center mb-2.5 group-hover:rotate-12 transition-transform duration-300 shadow-inner">
                        <CreditCard size={24} className="text-white" />
                      </div>
                      <span className="text-base font-black tracking-wider uppercase">POS Vendas</span>
                      <span className="text-[9px] text-white/90 font-bold uppercase tracking-widest mt-1">Abrir Ponto de Venda</span>
                    </motion.button>
                  </div>

                  {/* Right Column (Cards) */}
                  <div className="w-full lg:w-1/3 flex flex-col gap-5">
                    {[
                      { id: 'products', title: 'Produtos', desc: 'Gerir produtos e stock', icon: <ShoppingBag size={20} />, color: 'text-amber-600 bg-amber-50/60 border-amber-100/40' },
                      { id: 'staff', title: 'Funcionárias', desc: 'Gerir equipa e comissões', icon: <User size={20} />, color: 'text-cyan-600 bg-cyan-50/60 border-cyan-100/40' },
                      { id: 'reports', title: 'Relatórios', desc: 'Ver relatórios e estatísticas', icon: <TrendingUp size={20} />, color: 'text-rose-600 bg-rose-50/60 border-rose-100/40' }
                    ].map((card) => (
                      <button
                        key={card.id}
                        onClick={() => setActiveTab(card.id as any)}
                        className="bg-white/95 backdrop-blur-xl border border-slate-100/80 p-5 rounded-[22px] shadow-[0_8px_30px_rgb(0,0,0,0.015)] hover:shadow-[0_15px_40px_rgba(236,72,153,0.06)] hover:-translate-y-0.5 hover:border-pink-200/50 transition-all duration-300 flex items-center justify-between text-left group cursor-pointer"
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-11 h-11 rounded-[16px] flex items-center justify-center shrink-0 border ${card.color} shadow-sm`}>
                            {card.icon}
                          </div>
                          <div>
                            <h3 className="font-extrabold text-[13px] text-slate-800 tracking-wide">{card.title}</h3>
                            <p className="text-[11px] text-slate-400 font-medium mt-0.5">{card.desc}</p>
                          </div>
                        </div>
                        <ArrowRight size={15} className="text-slate-300 group-hover:text-pink-500 group-hover:translate-x-1 transition-all" />
                      </button>
                    ))}
                  </div>

                </div>

                {/* Bottom Center Row for remaining Azores toYou integration cards */}
                <div className="flex justify-center">
                  <div className="w-full md:w-2/3 lg:w-1/3">
                    <button
                      onClick={() => setActiveTab('commissions')}
                      className="w-full bg-white/95 backdrop-blur-xl border border-slate-100/80 p-5 rounded-[22px] shadow-[0_8px_30px_rgb(0,0,0,0.015)] hover:shadow-[0_15px_40px_rgba(236,72,153,0.06)] hover:-translate-y-0.5 hover:border-pink-200/50 transition-all duration-300 flex items-center justify-between text-left group cursor-pointer"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-11 h-11 rounded-[16px] flex items-center justify-center shrink-0 border text-pink-600 bg-pink-50/60 border-pink-100/40 shadow-sm">
                          <Award size={20} />
                        </div>
                        <div>
                          <h3 className="font-extrabold text-[13px] text-slate-800 tracking-wide">Comissão Azores toYou</h3>
                          <p className="text-[11px] text-slate-400 font-medium mt-0.5">Ver microtaxas Azores toYou geradas</p>
                        </div>
                      </div>
                      <ArrowRight size={15} className="text-slate-300 group-hover:text-pink-500 group-hover:translate-x-1 transition-all" />
                    </button>
                  </div>
                </div>

              </motion.div>
            )}

            {/* VIEW: POS */}
            {activeTab === 'pos' && (
              <motion.div
                key="pos-view"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left"
              >
                {/* Catalog (lg:col-span-7) */}
                <div className="lg:col-span-7 space-y-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-2xl font-black text-slate-900 tracking-tight">Ponto de Venda (POS)</h2>
                      <p className="text-xs text-slate-500 font-medium">Faturação imediata e registo de serviços prestados.</p>
                    </div>
                    <button onClick={() => setActiveTab('dashboard')} className="text-xs font-bold text-slate-500 hover:text-slate-800 bg-slate-100 px-3 py-1.5 rounded-xl transition-colors">
                      ← Voltar
                    </button>
                  </div>

                  {/* Filters and Search */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                      <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input 
                        type="text" 
                        placeholder="Pesquisar serviço ou produto..."
                        value={posSearchQuery}
                        onChange={(e) => setPosSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-xs focus:outline-none focus:border-pink-400 focus:ring-1 focus:ring-pink-400 transition-all"
                      />
                    </div>
                    <div className="flex gap-1.5 bg-slate-100 p-1 rounded-2xl w-fit">
                      {(['TODOS', 'SERVICOS', 'PRODUTOS'] as const).map(cat => (
                        <button
                          key={cat}
                          onClick={() => setPosCategoryFilter(cat)}
                          className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all ${
                            posCategoryFilter === cat ? 'bg-pink-500 text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Catalog Cards Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[500px] overflow-y-auto pr-2 no-scrollbar">
                    {/* Services */}
                    {posCategoryFilter !== 'PRODUTOS' && servicesList
                      .filter(s => s.name.toLowerCase().includes(posSearchQuery.toLowerCase()))
                      .map(s => (
                        <button
                          key={`pos-svc-${s.id}`}
                          onClick={() => addToCart(s, 'service')}
                          className="bg-white border border-slate-200/60 p-4 rounded-3xl hover:border-pink-300 hover:shadow-sm transition-all duration-300 flex items-center justify-between text-left group"
                        >
                          <div>
                            <span className="text-[10px] bg-purple-50 text-purple-600 border border-purple-100 font-black uppercase tracking-widest px-2 py-0.5 rounded-md">Serviço</span>
                            <h3 className="font-extrabold text-sm text-slate-800 mt-2 truncate max-w-[180px]">{s.name}</h3>
                            <p className="text-[10px] text-slate-400 font-bold mt-0.5 uppercase tracking-wide">⏱️ {s.duration} min</p>
                          </div>
                          <div className="text-right shrink-0">
                            <span className="text-base font-black text-slate-900 block">€{s.price.toFixed(2)}</span>
                            <span className="text-[9px] text-pink-500 font-black uppercase tracking-wider group-hover:opacity-100 opacity-60 transition-opacity">Adicionar +</span>
                          </div>
                        </button>
                      ))}

                    {/* Products */}
                    {posCategoryFilter !== 'SERVICOS' && productsList
                      .filter(p => p.name.toLowerCase().includes(posSearchQuery.toLowerCase()))
                      .map(p => (
                        <button
                          key={`pos-prd-${p.id}`}
                          onClick={() => addToCart(p, 'product')}
                          className="bg-white border border-slate-200/60 p-4 rounded-3xl hover:border-pink-300 hover:shadow-sm transition-all duration-300 flex items-center justify-between text-left group"
                        >
                          <div>
                            <span className="text-[10px] bg-amber-50 text-amber-600 border border-amber-100 font-black uppercase tracking-widest px-2 py-0.5 rounded-md">Produto</span>
                            <h3 className="font-extrabold text-sm text-slate-800 mt-2 truncate max-w-[180px]">{p.name}</h3>
                            <p className="text-[10px] text-slate-400 font-bold mt-0.5 uppercase tracking-wide">📦 Stock: {p.stock}</p>
                          </div>
                          <div className="text-right shrink-0">
                            <span className="text-base font-black text-slate-900 block">€{p.price.toFixed(2)}</span>
                            <span className="text-[9px] text-pink-500 font-black uppercase tracking-wider group-hover:opacity-100 opacity-60 transition-opacity">Adicionar +</span>
                          </div>
                        </button>
                      ))}
                  </div>

                  {/* History Header */}
                  <div className="border-t border-slate-100 pt-6">
                    <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4">Últimas Vendas Finalizadas</h3>
                    <div className="space-y-2 max-h-[220px] overflow-y-auto no-scrollbar">
                      {salesHistory.map((sh, idx) => (
                        <div key={idx} className="bg-slate-50 border border-slate-100 p-3 rounded-2xl flex justify-between items-center text-xs">
                          <div>
                            <p className="font-black text-slate-800">{sh.clientName}</p>
                            <p className="text-[10px] text-slate-400 mt-0.5">
                              {sh.items.map((i: any) => `${i.name} (x${i.qty})`).join(', ')} • {sh.paymentMethod}
                            </p>
                          </div>
                          <span className="font-black text-emerald-600">€{sh.total.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Cart (lg:col-span-5) */}
                <div className="lg:col-span-5 bg-white border border-slate-100 rounded-[24px] shadow-sm p-6 flex flex-col min-h-[550px] justify-between">
                  <div className="space-y-6">
                    <div className="flex justify-between items-center border-b border-slate-50 pb-4">
                      <h3 className="text-sm font-black uppercase tracking-widest text-slate-800">Carrinho de Compras</h3>
                      <button onClick={() => setCart([])} className="text-[10px] font-black uppercase tracking-widest text-red-500 hover:text-red-700">Limpar</button>
                    </div>

                    {/* Client Selector */}
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Cliente Registado</label>
                      <select 
                        value={selectedClient} 
                        onChange={(e) => setSelectedClient(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-pink-400"
                      >
                        <option value="Cliente Geral">Cliente Geral (Não Registado)</option>
                        {clientesList.map(c => (
                          <option key={c.id} value={c.name}>{c.name} ({c.phone})</option>
                        ))}
                      </select>
                    </div>

                    {/* Cart Items list */}
                    <div className="space-y-3 max-h-[220px] overflow-y-auto no-scrollbar pr-1">
                      {cart.length === 0 ? (
                        <div className="py-12 text-center text-slate-400 space-y-2">
                          <span className="text-3xl">🛒</span>
                          <p className="text-[11px] font-bold uppercase tracking-wider">Carrinho Vazio</p>
                        </div>
                      ) : (
                        cart.map((item, idx) => (
                          <div key={idx} className="flex justify-between items-center bg-slate-50 p-3 rounded-2xl border border-slate-100">
                            <div className="min-w-0">
                              <h4 className="font-extrabold text-xs text-slate-800 truncate max-w-[140px]">{item.name}</h4>
                              <p className="text-[10px] text-slate-400">€{item.price.toFixed(2)} / un</p>
                            </div>
                            <div className="flex items-center gap-3 shrink-0">
                              <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-xl px-2 py-1">
                                <button onClick={() => updateCartQuantity(item.id, item.type, -1)} className="text-slate-400 hover:text-slate-800 text-xs font-bold px-1">-</button>
                                <span className="text-xs font-black text-slate-800 px-1">{item.quantity}</span>
                                <button onClick={() => updateCartQuantity(item.id, item.type, 1)} className="text-slate-400 hover:text-slate-800 text-xs font-bold px-1">+</button>
                              </div>
                              <button onClick={() => removeFromCart(item.id, item.type)} className="text-red-400 hover:text-red-600 transition-colors p-1.5 hover:bg-red-50 rounded-lg">
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Calculations & Finalize */}
                  <div className="border-t border-slate-50 pt-4 space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs text-slate-500 font-semibold">
                        <span>Subtotal</span>
                        <span>€{rawSubtotal.toFixed(2)}</span>
                      </div>
                      
                      <div className="flex justify-between items-center text-xs text-slate-500 font-semibold">
                        <span>Desconto (%)</span>
                        <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-xl px-2 py-0.5">
                          <input 
                            type="number" 
                            min="0" 
                            max="100" 
                            value={discountPercent || ''} 
                            onChange={(e) => setDiscountPercent(Math.min(100, Math.max(0, parseInt(e.target.value) || 0)))}
                            className="w-10 bg-transparent text-right text-xs font-black text-slate-800 focus:outline-none"
                          />
                          <span className="text-slate-400 text-xs">%</span>
                        </div>
                      </div>

                      <div className="flex justify-between items-center pt-2 border-t border-slate-100 text-sm font-black text-slate-900">
                        <span>Total a Pagar</span>
                        <span className="text-lg text-pink-600">€{total.toFixed(2)}</span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Método de Pagamento</label>
                      <div className="grid grid-cols-2 gap-2">
                        {(['Dinheiro', 'Cartão', 'MBWay', 'Multibanco'] as const).map(method => (
                          <button
                            key={method}
                            type="button"
                            onClick={() => setSelectedPaymentMethod(method)}
                            className={`py-2 rounded-xl text-[10px] font-black uppercase tracking-wider border transition-all ${
                              selectedPaymentMethod === method 
                                ? 'bg-pink-500/10 border-pink-500 text-pink-600' 
                                : 'bg-transparent border-slate-200 text-slate-500 hover:bg-slate-50'
                            }`}
                          >
                            {method}
                          </button>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={handleFinalizeSale}
                      disabled={cart.length === 0}
                      className="w-full py-4 bg-gradient-to-r from-pink-500 to-rose-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-[0_8px_20px_-6px_rgba(236,72,153,0.5)] active:scale-98 disabled:opacity-40 transition-all"
                    >
                      💵 Finalizar Venda &amp; Receber
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* VIEW: CLIENTES */}
            {activeTab === 'clientes' && (
              <motion.div
                key="clientes-view"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-6 text-left"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">Gestão de Clientes</h2>
                    <p className="text-xs text-slate-500 font-medium">Consulte e registe as clientes do salão Bella Nails.</p>
                  </div>
                  <button 
                    onClick={() => setShowAddClienteModal(true)}
                    className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-pink-500 to-rose-600 text-white rounded-2xl text-xs font-black uppercase tracking-wider shadow-sm hover:shadow transition-all active:scale-95"
                  >
                    <Plus size={16} /> Registar Cliente
                  </button>
                </div>

                {/* Add Client Modal Overlay */}
                {showAddClienteModal && (
                  <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                    <motion.div 
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="bg-white rounded-[24px] shadow-xl border border-slate-100 max-w-md w-full p-6 space-y-6 text-left"
                    >
                      <div className="flex justify-between items-center">
                        <h3 className="text-sm font-black uppercase tracking-widest text-slate-800">Novo Registo de Cliente</h3>
                        <button onClick={() => setShowAddClienteModal(false)} className="p-2 bg-slate-100 hover:bg-slate-200 rounded-full">
                          <X size={16} />
                        </button>
                      </div>

                      <form onSubmit={handleAddCliente} className="space-y-4">
                        <div className="space-y-1">
                          <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Nome Completo</label>
                          <input 
                            type="text" 
                            required
                            placeholder="Ex: Clara Sousa"
                            value={newClienteForm.name}
                            onChange={(e) => setNewClienteForm({ ...newClienteForm, name: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-pink-400"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Contacto Telefónico</label>
                          <input 
                            type="text" 
                            placeholder="Ex: +351 912 345 678"
                            value={newClienteForm.phone}
                            onChange={(e) => setNewClienteForm({ ...newClienteForm, phone: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-pink-400"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">E-mail</label>
                          <input 
                            type="email" 
                            placeholder="Ex: clara@gmail.com"
                            value={newClienteForm.email}
                            onChange={(e) => setNewClienteForm({ ...newClienteForm, email: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-pink-400"
                          />
                        </div>
                        <button
                          type="submit"
                          className="w-full py-3 bg-pink-500 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-pink-600 transition-colors"
                        >
                          Salvar Cliente
                        </button>
                      </form>
                    </motion.div>
                  </div>
                )}

                {/* Clientes Table Grid */}
                <div className="bg-white border border-slate-100 rounded-[24px] shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-left">
                      <thead>
                        <tr className="bg-slate-50/70 border-b border-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-400">
                          <th className="p-4 pl-6">Nome</th>
                          <th className="p-4">Telefone</th>
                          <th className="p-4">E-mail</th>
                          <th className="p-4">Última Visita</th>
                          <th className="p-4 text-right pr-6">Ações</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50 text-xs">
                        {clientesList.map(c => (
                          <tr key={c.id} className="hover:bg-slate-50/30">
                            <td className="p-4 pl-6 font-bold text-slate-800">{c.name}</td>
                            <td className="p-4 text-slate-500">{c.phone}</td>
                            <td className="p-4 text-slate-500">{c.email}</td>
                            <td className="p-4 text-slate-500">{c.lastVisit}</td>
                            <td className="p-4 text-right pr-6">
                              <button 
                                onClick={() => { setSelectedClient(c.name); setActiveTab('pos'); }} 
                                className="text-[10px] font-black uppercase tracking-wider text-pink-500 hover:text-pink-700 bg-pink-50 px-2.5 py-1.5 rounded-lg border border-pink-100/50"
                              >
                                Nova Venda (POS)
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}

            {/* VIEW: APPOINTMENTS */}
            {activeTab === 'appointments' && (
              <motion.div
                key="appointments-view"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-6 text-left"
              >
                <div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">Agenda &amp; Marcações</h2>
                  <p className="text-xs text-slate-500 font-medium">Visualize e confirme os agendamentos das suas clientes.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  
                  {/* Calendar Widget left */}
                  <div className="lg:col-span-4 bg-white border border-slate-100 p-6 rounded-[24px] shadow-sm space-y-4">
                    <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Calendário de Trabalho</h3>
                    
                    <div className="border border-slate-100 rounded-2xl p-4 bg-slate-50 text-center text-xs">
                      <p className="font-extrabold text-slate-800 mb-2 uppercase tracking-wider">Junho 2026</p>
                      <div className="grid grid-cols-7 gap-1 font-bold text-slate-400 text-[10px] mb-2">
                        <span>S</span><span>T</span><span>Q</span><span>Q</span><span>S</span><span>S</span><span>D</span>
                      </div>
                      <div className="grid grid-cols-7 gap-1">
                        {Array.from({ length: 30 }).map((_, i) => {
                          const dayNum = i + 1;
                          const isToday = dayNum === 25;
                          return (
                            <span 
                              key={i} 
                              className={`p-1.5 rounded-lg text-center cursor-pointer select-none font-bold text-[11px] ${
                                isToday ? 'bg-pink-500 text-white font-black shadow-sm shadow-pink-500/30' : 'hover:bg-slate-200 text-slate-700'
                              }`}
                            >
                              {dayNum}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* List of bookings right */}
                  <div className="lg:col-span-8 space-y-4">
                    <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Lista de Marcações</h3>
                    <div className="space-y-3">
                      {appointmentsList.map((app) => (
                        <div key={app.id} className="bg-white border border-slate-100 p-5 rounded-[24px] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="flex items-center gap-4">
                            <img src={app.avatar} alt={app.customerName} className="w-10 h-10 rounded-full object-cover border border-pink-500 shrink-0" />
                            <div>
                              <div className="flex items-center gap-2.5">
                                <h4 className="font-extrabold text-sm text-slate-800">{app.customerName}</h4>
                                <span className="bg-slate-100 text-slate-500 text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded">
                                  {app.date}
                                </span>
                              </div>
                              <p className="text-xs text-slate-500 mt-1">💅 {app.serviceName}</p>
                              <p className="text-[10px] text-slate-400 font-bold mt-0.5">⏱️ Hora: {app.time} • Tel: {app.customerPhone}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                            {app.status === 'pending' ? (
                              <>
                                <button 
                                  onClick={() => {
                                    setAppointmentsList(prev => prev.map(a => a.id === app.id ? { ...a, status: 'accepted' } : a));
                                    alert('✅ Marcação aceite com sucesso!');
                                  }}
                                  className="px-3 py-1.5 bg-emerald-500 text-white rounded-xl text-[10px] font-black uppercase tracking-wider hover:bg-emerald-600 transition-colors shadow-sm"
                                >
                                  Aceitar
                                </button>
                                <button 
                                  onClick={() => {
                                    setAppointmentsList(prev => prev.filter(a => a.id !== app.id));
                                    alert('❌ Marcação rejeitada.');
                                  }}
                                  className="px-3 py-1.5 bg-red-100 text-red-600 rounded-xl text-[10px] font-black uppercase tracking-wider hover:bg-red-200 transition-colors"
                                >
                                  Rejeitar
                                </button>
                              </>
                            ) : (
                              <div className="flex items-center gap-1.5 text-emerald-600 bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-xl">
                                <CheckCircle size={13} />
                                <span className="text-[9px] font-black uppercase tracking-wider">Confirmada</span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              </motion.div>
            )}

            {/* VIEW: SERVICES */}
            {activeTab === 'services' && (
              <motion.div
                key="services-view"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-6 text-left"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">Catálogo de Serviços</h2>
                    <p className="text-xs text-slate-500 font-medium">Configure os tratamentos de unhas e estética disponibilizados.</p>
                  </div>
                  <button 
                    onClick={() => { setEditingService(null); setServiceForm({ name: '', description: '', price: '', duration: '40', image: '', showInApp: true, promoPrice: '' }); setShowServiceForm(true); }}
                    className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-pink-500 to-rose-600 text-white rounded-2xl text-xs font-black uppercase tracking-wider shadow-sm"
                  >
                    <Plus size={16} /> Adicionar Serviço
                  </button>
                </div>

                {/* Form Modal Overlay */}
                {showServiceForm && (
                  <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                    <motion.div 
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="bg-white rounded-[24px] shadow-xl border border-slate-100 max-w-md w-full p-6 space-y-6"
                    >
                      <div className="flex justify-between items-center">
                        <h3 className="text-sm font-black uppercase tracking-widest text-slate-800">
                          {editingService ? 'Editar Serviço' : 'Novo Serviço de Manicure'}
                        </h3>
                        <button onClick={() => setShowServiceForm(false)} className="p-2 bg-slate-100 hover:bg-slate-200 rounded-full">
                          <X size={16} />
                        </button>
                      </div>

                      <form 
                        onSubmit={(e) => {
                          e.preventDefault();
                          const priceNum = parseFloat(serviceForm.price) || 0;
                          const durationNum = parseInt(serviceForm.duration) || 30;
                          const promoPriceNum = serviceForm.promoPrice ? parseFloat(serviceForm.promoPrice) : undefined;
                          
                          const newServiceData = {
                            name: serviceForm.name,
                            description: serviceForm.description,
                            price: priceNum,
                            duration: durationNum,
                            image: serviceForm.image,
                            showInApp: serviceForm.showInApp,
                            promoPrice: promoPriceNum
                          };

                          if (editingService) {
                            // Update
                            const updatedList = servicesList.map(s => s.id === editingService.id ? { ...s, ...newServiceData } : s);
                            onUpdateBusiness({ ...business, services: updatedList });
                          } else {
                            // Create
                            const newS: Service = {
                              id: `s_${Date.now()}`,
                              ...newServiceData
                            } as any;
                            onUpdateBusiness({ ...business, services: [...servicesList, newS] });
                          }
                          setShowServiceForm(false);
                          alert('✅ Catálogo atualizado!');
                        }} 
                        className="space-y-4"
                      >
                        <div className="space-y-1">
                          <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Nome do Serviço</label>
                          <input 
                            type="text" 
                            required
                            placeholder="Ex: Aplicação de Gel"
                            value={serviceForm.name}
                            onChange={(e) => setServiceForm({ ...serviceForm, name: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-pink-400"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Foto do Serviço</label>
                          {serviceForm.image ? (
                            <div className="relative w-24 h-24 rounded-2xl overflow-hidden border border-slate-200">
                              <img src={serviceForm.image} className="w-full h-full object-cover" />
                              <button
                                type="button"
                                onClick={() => setServiceForm(prev => ({ ...prev, image: '' }))}
                                className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-650"
                              >
                                <X size={10} />
                              </button>
                            </div>
                          ) : (
                            <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-2xl p-4 cursor-pointer hover:bg-slate-50 transition-colors">
                              <Upload size={16} className="text-slate-400 mb-1" />
                              <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider">
                                {isUploading ? 'A carregar...' : 'Carregar Foto'}
                              </span>
                              <input
                                type="file"
                                accept="image/*"
                                disabled={isUploading}
                                onChange={(e) => {
                                  if (e.target.files && e.target.files[0]) {
                                    handleImageUpload(e.target.files[0], 'service');
                                  }
                                }}
                                className="hidden"
                              />
                            </label>
                          )}
                        </div>

                        <div className="flex items-center gap-2 py-1">
                          <input
                            type="checkbox"
                            id="serviceShowInApp"
                            checked={serviceForm.showInApp}
                            onChange={(e) => setServiceForm(prev => ({ ...prev, showInApp: e.target.checked }))}
                            className="rounded text-pink-500 focus:ring-pink-500"
                          />
                          <label htmlFor="serviceShowInApp" className="text-[10px] font-black text-slate-500 uppercase tracking-widest cursor-pointer select-none">
                            Colocar na app
                          </label>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Descrição curta</label>
                          <textarea 
                            placeholder="Explique brevemente o serviço..."
                            value={serviceForm.description}
                            onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-pink-400 min-h-[60px]"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Preço (€)</label>
                            <input 
                              type="number" 
                              step="0.01"
                              required
                              placeholder="15.00"
                              value={serviceForm.price}
                              onChange={(e) => setServiceForm({ ...serviceForm, price: e.target.value })}
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-pink-400"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Duração (Minutos)</label>
                            <input 
                              type="number" 
                              required
                              placeholder="40"
                              value={serviceForm.duration}
                              onChange={(e) => setServiceForm({ ...serviceForm, duration: e.target.value })}
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-pink-400"
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Preço Promocional (€) - Opcional</label>
                          <input
                            type="number"
                            step="0.01"
                            placeholder="Ex: 12.00"
                            value={serviceForm.promoPrice}
                            onChange={(e) => setServiceForm(prev => ({ ...prev, promoPrice: e.target.value }))}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-pink-400"
                          />
                        </div>

                        <button
                          type="submit"
                          className="w-full py-3 bg-pink-500 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-pink-600 transition-colors"
                        >
                          Salvar Alterações
                        </button>
                      </form>
                    </motion.div>
                  </div>
                )}

                {/* List of Services cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {servicesList.map(s => (
                    <div key={s.id} className="bg-white border border-slate-100 p-6 rounded-[24px] shadow-sm flex flex-col justify-between space-y-4">
                      <div>
                        <div className="flex justify-between items-start">
                          <h3 className="font-extrabold text-sm text-slate-800">{s.name}</h3>
                          <span className="text-sm font-black text-pink-600">€{s.price.toFixed(2)}</span>
                        </div>
                        <p className="text-xs text-slate-400 mt-2 leading-relaxed">{s.description || 'Sem descrição.'}</p>
                      </div>

                      <div className="flex items-center justify-between border-t border-slate-50 pt-4 text-[10px] font-bold text-slate-400">
                        <span>⏱️ {s.duration} minutos</span>
                        
                        <div className="flex gap-2">
                          <button 
                            onClick={() => {
                              setEditingService(s);
                              setServiceForm({ 
                                name: s.name, 
                                description: s.description || '', 
                                price: String(s.price), 
                                duration: String(s.duration),
                                image: s.image || '',
                                showInApp: s.showInApp !== false,
                                promoPrice: s.promoPrice ? String(s.promoPrice) : ''
                              });
                              setShowServiceForm(true);
                            }}
                            className="text-slate-500 hover:text-slate-800 px-2.5 py-1.5 bg-slate-100 rounded-lg"
                          >
                            Editar
                          </button>
                          <button 
                            onClick={() => {
                              if (confirm('Tem a certeza que deseja excluir este serviço?')) {
                                onUpdateBusiness({ ...business, services: servicesList.filter(item => item.id !== s.id) });
                              }
                            }}
                            className="text-red-500 hover:text-red-700 px-2.5 py-1.5 bg-red-50 rounded-lg"
                          >
                            Excluir
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* VIEW: PRODUCTS */}
            {activeTab === 'products' && (
              <motion.div
                key="products-view"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-6 text-left"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">Gestão de Stock &amp; Produtos</h2>
                    <p className="text-xs text-slate-500 font-medium">Controle de vernizes, cremes e acessórios para venda ao público.</p>
                  </div>
                  <button 
                    onClick={() => { setEditingProduct(null); setProductForm({ name: '', description: '', price: '', category: 'Cuidados', stock: '10', image: '', showInApp: true, promoPrice: '' }); setShowProductForm(true); }}
                    className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-pink-500 to-rose-600 text-white rounded-2xl text-xs font-black uppercase tracking-wider shadow-sm"
                  >
                    <Plus size={16} /> Adicionar Produto
                  </button>
                </div>

                {/* Form Modal Overlay */}
                {showProductForm && (
                  <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                    <motion.div 
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="bg-white rounded-[24px] shadow-xl border border-slate-100 max-w-md w-full p-6 space-y-6"
                    >
                      <div className="flex justify-between items-center">
                        <h3 className="text-sm font-black uppercase tracking-widest text-slate-800">
                          {editingProduct ? 'Editar Produto' : 'Novo Produto para Venda'}
                        </h3>
                        <button onClick={() => setShowProductForm(false)} className="p-2 bg-slate-100 hover:bg-slate-200 rounded-full">
                          <X size={16} />
                        </button>
                      </div>

                      <form 
                        onSubmit={(e) => {
                          e.preventDefault();
                          const priceNum = parseFloat(productForm.price) || 0;
                          const stockNum = parseInt(productForm.stock) || 0;
                          const promoPriceNum = productForm.promoPrice ? parseFloat(productForm.promoPrice) : undefined;
                          
                          const newProductData = {
                            name: productForm.name,
                            description: productForm.description,
                            price: priceNum,
                            category: productForm.category,
                            stock: stockNum,
                            image: productForm.image,
                            showInApp: productForm.showInApp,
                            promoPrice: promoPriceNum
                          };

                          if (editingProduct) {
                            // Update
                            const updatedList = productsList.map(p => p.id === editingProduct.id ? { ...p, ...newProductData } : p);
                            onUpdateBusiness({ ...business, products: updatedList });
                          } else {
                            // Create
                            const newP: Product = {
                              id: `p_${Date.now()}`,
                              ...newProductData
                            } as any;
                            onUpdateBusiness({ ...business, products: [...productsList, newP] });
                          }
                          setShowProductForm(false);
                          alert('✅ Produtos atualizados!');
                        }} 
                        className="space-y-4"
                      >
                        <div className="space-y-1">
                          <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Nome do Produto</label>
                          <input 
                            type="text" 
                            required
                            placeholder="Ex: Creme de Cutículas"
                            value={productForm.name}
                            onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-pink-400"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Foto do Produto</label>
                          {productForm.image ? (
                            <div className="relative w-24 h-24 rounded-2xl overflow-hidden border border-slate-200">
                              <img src={productForm.image} className="w-full h-full object-cover" />
                              <button
                                type="button"
                                onClick={() => setProductForm(prev => ({ ...prev, image: '' }))}
                                className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-650"
                              >
                                <X size={10} />
                              </button>
                            </div>
                          ) : (
                            <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-2xl p-4 cursor-pointer hover:bg-slate-50 transition-colors">
                              <Upload size={16} className="text-slate-400 mb-1" />
                              <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider">
                                {isUploading ? 'A carregar...' : 'Carregar Foto'}
                              </span>
                              <input
                                type="file"
                                accept="image/*"
                                disabled={isUploading}
                                onChange={(e) => {
                                  if (e.target.files && e.target.files[0]) {
                                    handleImageUpload(e.target.files[0], 'product');
                                  }
                                }}
                                className="hidden"
                              />
                            </label>
                          )}
                        </div>

                        <div className="flex items-center gap-2 py-1">
                          <input
                            type="checkbox"
                            id="productShowInApp"
                            checked={productForm.showInApp}
                            onChange={(e) => setProductForm(prev => ({ ...prev, showInApp: e.target.checked }))}
                            className="rounded text-pink-500 focus:ring-pink-500"
                          />
                          <label htmlFor="productShowInApp" className="text-[10px] font-black text-slate-500 uppercase tracking-widest cursor-pointer select-none">
                            Colocar na app
                          </label>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Categoria</label>
                          <select
                            value={productForm.category}
                            onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-pink-400"
                          >
                            <option value="Cuidados">Cuidados</option>
                            <option value="Hidratação">Hidratação</option>
                            <option value="Tratamentos">Tratamentos</option>
                            <option value="Acessórios">Acessórios</option>
                          </select>
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Descrição curta</label>
                          <textarea 
                            placeholder="Informação básica do produto..."
                            value={productForm.description}
                            onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-pink-400 min-h-[60px]"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Preço de Venda (€)</label>
                            <input 
                              type="number" 
                              step="0.01"
                              required
                              placeholder="7.50"
                              value={productForm.price}
                              onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-pink-400"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Stock Inicial</label>
                            <input 
                              type="number" 
                              required
                              placeholder="10"
                              value={productForm.stock}
                              onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-pink-400"
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Preço Promocional (€) - Opcional</label>
                          <input
                            type="number"
                            step="0.01"
                            placeholder="Ex: 5.90"
                            value={productForm.promoPrice}
                            onChange={(e) => setProductForm(prev => ({ ...prev, promoPrice: e.target.value }))}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-pink-400"
                          />
                        </div>
                        <button
                          type="submit"
                          className="w-full py-3 bg-pink-500 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-pink-600 transition-colors"
                        >
                          Gravar Produto
                        </button>
                      </form>
                    </motion.div>
                  </div>
                )}

                {/* Products Table Grid */}
                <div className="bg-white border border-slate-100 rounded-[24px] shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-left">
                      <thead>
                        <tr className="bg-slate-50/70 border-b border-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-400">
                          <th className="p-4 pl-6">Nome do Produto</th>
                          <th className="p-4">Categoria</th>
                          <th className="p-4">Stock Mínimo</th>
                          <th className="p-4">Preço</th>
                          <th className="p-4 text-right pr-6">Ações</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50 text-xs">
                        {productsList.map(p => (
                          <tr key={p.id} className="hover:bg-slate-50/30">
                            <td className="p-4 pl-6">
                              <p className="font-bold text-slate-800">{p.name}</p>
                              <p className="text-[10px] text-slate-400 mt-0.5">{p.description || 'Sem descrição.'}</p>
                            </td>
                            <td className="p-4">
                              <span className="bg-slate-100 text-slate-600 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded">
                                {p.category}
                              </span>
                            </td>
                            <td className="p-4">
                              <span className={`font-bold ${p.stock && p.stock < 5 ? 'text-red-500 font-extrabold' : 'text-slate-600'}`}>
                                {p.stock} unidades
                              </span>
                            </td>
                            <td className="p-4 font-extrabold text-slate-800">€{p.price.toFixed(2)}</td>
                            <td className="p-4 text-right pr-6 space-x-2">
                              <button 
                                onClick={() => {
                                  setEditingProduct(p);
                                  setProductForm({ 
                                    name: p.name, 
                                    description: p.description || '', 
                                    price: String(p.price), 
                                    category: p.category || 'Cuidados', 
                                    stock: String(p.stock || 10),
                                    image: p.image || '',
                                    showInApp: p.showInApp !== false,
                                    promoPrice: p.promoPrice ? String(p.promoPrice) : ''
                                  });
                                  setShowProductForm(true);
                                }} 
                                className="text-[10px] font-bold text-slate-500 hover:text-slate-800 bg-slate-100 px-2.5 py-1.5 rounded-lg"
                              >
                                Editar
                              </button>
                              <button 
                                onClick={() => {
                                  if (confirm('Tem a certeza que deseja excluir este produto?')) {
                                    onUpdateBusiness({ ...business, products: productsList.filter(item => item.id !== p.id) });
                                  }
                                }} 
                                className="text-[10px] font-bold text-red-500 hover:text-red-700 bg-red-50 px-2.5 py-1.5 rounded-lg"
                              >
                                Excluir
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}

            {/* VIEW: STAFF */}
            {activeTab === 'staff' && (
              <motion.div
                key="staff-view"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-6 text-left"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">Equipa &amp; Colaboradoras</h2>
                    <p className="text-xs text-slate-500 font-medium">Gerir horários de trabalho, comissões de estilistas e desempenho.</p>
                  </div>
                  <button 
                    onClick={() => setShowAddStaffModal(true)}
                    className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-pink-500 to-rose-600 text-white rounded-2xl text-xs font-black uppercase tracking-wider shadow-sm"
                  >
                    <Plus size={16} /> Adicionar Colaboradora
                  </button>
                </div>

                {/* Add Staff Modal Overlay */}
                {showAddStaffModal && (
                  <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                    <motion.div 
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="bg-white rounded-[24px] shadow-xl border border-slate-100 max-w-md w-full p-6 space-y-6"
                    >
                      <div className="flex justify-between items-center">
                        <h3 className="text-sm font-black uppercase tracking-widest text-slate-800">Nova Colaboradora</h3>
                        <button onClick={() => setShowAddStaffModal(false)} className="p-2 bg-slate-100 hover:bg-slate-200 rounded-full">
                          <X size={16} />
                        </button>
                      </div>

                      <form onSubmit={handleAddStaff} className="space-y-4">
                        <div className="space-y-1">
                          <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Nome Completo</label>
                          <input 
                            type="text" 
                            required
                            placeholder="Ex: Rita Pereira"
                            value={newStaffForm.name}
                            onChange={(e) => setNewStaffForm({ ...newStaffForm, name: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-pink-400"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Função / Cargo</label>
                          <input 
                            type="text" 
                            placeholder="Ex: Nail Artist"
                            value={newStaffForm.role}
                            onChange={(e) => setNewStaffForm({ ...newStaffForm, role: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-pink-400"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Telefone</label>
                          <input 
                            type="text" 
                            placeholder="Ex: +351 933 444 555"
                            value={newStaffForm.phone}
                            onChange={(e) => setNewStaffForm({ ...newStaffForm, phone: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-pink-400"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Horário / Turno</label>
                          <input 
                            type="text" 
                            placeholder="Ex: 09:00 - 18:00"
                            value={newStaffForm.shift}
                            onChange={(e) => setNewStaffForm({ ...newStaffForm, shift: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-pink-400"
                          />
                        </div>
                        <button
                          type="submit"
                          className="w-full py-3 bg-pink-500 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-pink-600 transition-colors"
                        >
                          Salvar Colaboradora
                        </button>
                      </form>
                    </motion.div>
                  </div>
                )}

                {/* Staff Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {staffList.map(st => (
                    <div key={st.id} className="bg-white border border-slate-100 p-6 rounded-[24px] shadow-sm space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-extrabold text-sm shrink-0 border border-slate-200">
                          {st.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <h3 className="font-extrabold text-sm text-slate-800">{st.name}</h3>
                          <p className="text-[10px] text-pink-500 font-bold uppercase tracking-wider">{st.role}</p>
                        </div>
                      </div>

                      <div className="bg-slate-50 rounded-2xl p-4 space-y-2 border border-slate-100 text-xs">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Telemóvel</span>
                          <span className="font-bold text-slate-700">{st.phone}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Horário</span>
                          <span className="font-bold text-slate-700">{st.shift}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Desempenho</span>
                          <span className="font-black text-emerald-600 uppercase text-[9px] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">{st.performance}</span>
                        </div>
                        <div className="flex justify-between border-t border-slate-200/50 pt-2 mt-2">
                          <span className="text-slate-400 font-black uppercase tracking-wider text-[9px]">Comissão Acumulada</span>
                          <span className="font-black text-slate-800">€{st.commissions.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* VIEW: COMMISSIONS */}
            {activeTab === 'commissions' && (
              <motion.div
                key="commissions-view"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-6 text-left"
              >
                <div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">Comissão Azores toYou</h2>
                  <p className="text-xs text-slate-500 font-medium">Visualize e controle a microtaxa de €0,05 cobrada pela Azores toYou por cada produto ou serviço vendido.</p>
                </div>

                {/* Overview boxes */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white border border-slate-100 p-6 rounded-[24px] shadow-sm">
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Total Acumulado Azores toYou</p>
                    <p className="text-3xl font-black text-slate-800 mt-2">€{totalCommissionAzoresToYou.toFixed(2)}</p>
                  </div>
                  <div className="bg-white border border-slate-100 p-6 rounded-[24px] shadow-sm">
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Taxa de Serviço Azores toYou</p>
                    <p className="text-3xl font-black text-pink-600 mt-2">€0.05</p>
                  </div>
                  <div className="bg-white border border-slate-100 p-6 rounded-[24px] shadow-sm">
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Parceiro</p>
                    <p className="text-3xl font-black text-emerald-600 mt-2">Azores toYou</p>
                  </div>
                </div>

                {/* History Table */}
                <div className="bg-white border border-slate-100 rounded-[24px] shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-left">
                      <thead>
                        <tr className="bg-slate-50/70 border-b border-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-400">
                          <th className="p-4 pl-6">Parceiro</th>
                          <th className="p-4">Itens Vendidos</th>
                          <th className="p-4">Comissão Azores toYou</th>
                          <th className="p-4">Data da Venda</th>
                          <th className="p-4 text-right pr-6">Estado</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50 text-xs">
                        {salesHistory.map((sh, idx) => {
                          const qtySold = (sh.items || []).reduce((sum: number, item: any) => sum + (item.qty || item.quantity || 1), 0);
                          const commVal = qtySold * 0.05;
                          return (
                            <tr key={sh.id || idx} className="hover:bg-slate-50/30">
                              <td className="p-4 pl-6 font-bold text-slate-800">Azores toYou</td>
                              <td className="p-4 text-slate-500">
                                {sh.items.map((i: any) => `${i.name} (x${i.qty || i.quantity || 1})`).join(', ')}
                              </td>
                              <td className="p-4 font-black text-slate-800">€{commVal.toFixed(2)}</td>
                              <td className="p-4 text-slate-500">{sh.timestamp ? new Date(sh.timestamp).toLocaleDateString() : 'Hoje'}</td>
                              <td className="p-4 text-right pr-6">
                                <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100">
                                  Pago
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}

            {/* VIEW: REPORTS */}
            {activeTab === 'reports' && (
              <motion.div
                key="reports-view"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-6 text-left"
              >
                <div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">Relatórios &amp; Estatísticas</h2>
                  <p className="text-xs text-slate-500 font-medium">Resumo simples de vendas e faturação.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-white border border-slate-100 p-6 rounded-[24px] shadow-sm space-y-2">
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Faturação Bruta Hoje</p>
                    <h3 className="text-3xl font-black text-slate-800">€40.65</h3>
                  </div>
                  <div className="bg-white border border-slate-100 p-6 rounded-[24px] shadow-sm space-y-2">
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Média por Cliente</p>
                    <h3 className="text-3xl font-black text-slate-800">€20.32</h3>
                  </div>
                  <div className="bg-white border border-slate-100 p-6 rounded-[24px] shadow-sm space-y-2">
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Serviços Prestados (Mês)</p>
                    <h3 className="text-3xl font-black text-slate-800">142</h3>
                  </div>
                  <div className="bg-white border border-slate-100 p-6 rounded-[24px] shadow-sm space-y-2">
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Descontos Atribuídos</p>
                    <h3 className="text-3xl font-black text-pink-600">€2.85</h3>
                  </div>
                </div>

                {/* Simplified performance log */}
                <div className="bg-white border border-slate-100 p-6 rounded-[24px] shadow-sm space-y-4">
                  <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Serviços Mais Vendidos</h3>
                  
                  <div className="space-y-3.5 text-xs">
                    {[
                      { name: 'Verniz Gel', share: '45%', count: 64, color: 'bg-pink-500' },
                      { name: 'Pedicure SPA', share: '25%', count: 35, color: 'bg-purple-500' },
                      { name: 'Unhas de Gel (Manutenção)', share: '20%', shareCount: 28, color: 'bg-blue-500' },
                      { name: 'Outros Tratamentos', share: '10%', shareCount: 15, color: 'bg-emerald-500' }
                    ].map((sitem, idx) => (
                      <div key={idx} className="space-y-1.5">
                        <div className="flex justify-between font-bold text-slate-700">
                          <span>{sitem.name}</span>
                          <span>{sitem.share} ({sitem.count || sitem.shareCount} vendas)</span>
                        </div>
                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div className={`h-full ${sitem.color}`} style={{ width: sitem.share }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* VIEW: MESSAGES */}
            {activeTab === 'messages' && (
              <motion.div
                key="messages-view"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-6 text-left"
              >
                <div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">Caixa de Mensagens</h2>
                  <p className="text-xs text-slate-500 font-medium">Fale diretamente com os clientes ou com o suporte técnico da Azores toYou.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch min-h-[450px]">
                  {/* Left Chat list (lg:col-span-4) */}
                  <div className="lg:col-span-4 bg-white border border-slate-100 p-5 rounded-[24px] shadow-sm space-y-4 overflow-y-auto no-scrollbar">
                    <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Conversas Recentes</h3>
                    
                    <div className="space-y-2">
                      {[
                        { name: 'Suporte Azores toYou', snippet: 'A sua comissão do Hotel Terra Nostra foi processada...', unread: true, active: true },
                        { name: 'Clara Rodrigues', snippet: 'Olá Mariana, posso remarcar a minha sessão de manicure para amanhã?', unread: true },
                        { name: 'Beatriz Sousa', snippet: 'Obrigada pelo excelente trabalho de ontem!', unread: false }
                      ].map((chat, idx) => (
                        <div key={idx} className={`p-3 rounded-2xl cursor-pointer transition-all border ${
                          chat.active ? 'bg-pink-500/5 border-pink-500/25' : 'bg-transparent border-transparent hover:bg-slate-50'
                        }`}>
                          <div className="flex justify-between items-start">
                            <h4 className="font-extrabold text-xs text-slate-800">{chat.name}</h4>
                            {chat.unread && <span className="w-2 h-2 bg-pink-500 rounded-full" />}
                          </div>
                          <p className="text-[10px] text-slate-400 mt-1 truncate">{chat.snippet}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Chat window (lg:col-span-8) */}
                  <div className="lg:col-span-8 bg-white border border-slate-100 rounded-[24px] shadow-sm p-6 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-center border-b border-slate-50 pb-4 mb-4">
                        <h4 className="font-black text-sm text-slate-800">Suporte Azores toYou</h4>
                        <span className="text-[9px] bg-emerald-50 text-emerald-600 font-bold uppercase tracking-widest px-2 py-0.5 rounded border border-emerald-100">Ligado</span>
                      </div>
                      
                      <div className="space-y-4 max-h-[300px] overflow-y-auto no-scrollbar">
                        <div className="bg-slate-100/70 p-3 rounded-2xl text-xs max-w-[80%]">
                          <p className="font-bold text-slate-700">Equipa Azores toYou</p>
                          <p className="text-slate-600 mt-1">Olá Mariana! Informamos que o widget de comissões de parceiro da Bella Nails está ativo e operacional.</p>
                        </div>
                        <div className="bg-pink-500 text-white p-3 rounded-2xl text-xs max-w-[80%] ml-auto text-right">
                          <p className="font-bold">Mariana Silva</p>
                          <p className="mt-1">Excelente! Já consigo ver as comissões geradas no separador. Obrigado!</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2.5 mt-6">
                      <input 
                        type="text" 
                        placeholder="Escreva uma mensagem..."
                        className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs focus:outline-none focus:border-pink-400"
                      />
                      <button className="px-5 py-3 bg-pink-500 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-pink-600 shadow-sm transition-all active:scale-95">
                        Enviar
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* VIEW: SETTINGS */}
            {activeTab === 'settings' && (
              <motion.div
                key="settings-view"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-6 text-left"
              >
                <div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">Definições do Salão</h2>
                  <p className="text-xs text-slate-500 font-medium">Configure os detalhes públicos do seu negócio de manicure no marketplace.</p>
                </div>

                <div className="bg-white border border-slate-100 rounded-[24px] shadow-sm p-6 space-y-6 max-w-2xl">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Nome do Salão</label>
                      <input 
                        type="text" 
                        value={bizForm.name} 
                        onChange={(e) => setBizForm({ ...bizForm, name: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-pink-400"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Proprietária (Nome Boas-Vindas)</label>
                      <input 
                        type="text" 
                        value={bizForm.welcomeName} 
                        onChange={(e) => setBizForm({ ...bizForm, welcomeName: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-pink-400"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Contacto Público</label>
                      <input 
                        type="text" 
                        value={bizForm.phone} 
                        onChange={(e) => setBizForm({ ...bizForm, phone: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-pink-400"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">E-mail</label>
                      <input 
                        type="email" 
                        value={bizForm.email} 
                        onChange={(e) => setBizForm({ ...bizForm, email: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-pink-400"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Morada do Salão</label>
                    <input 
                      type="text" 
                      value={bizForm.address} 
                      onChange={(e) => setBizForm({ ...bizForm, address: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-pink-400"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Descrição do Salão</label>
                    <textarea 
                      value={bizForm.description} 
                      onChange={(e) => setBizForm({ ...bizForm, description: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-pink-400 min-h-[80px]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Imagem de Capa (URL)</label>
                    <input 
                      type="text" 
                      value={bizForm.coverImage} 
                      onChange={(e) => setBizForm({ ...bizForm, coverImage: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-pink-400"
                    />
                  </div>

                  <button 
                    onClick={handleSaveProfile}
                    className="py-3 px-6 bg-pink-500 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-pink-600 transition-colors shadow-sm"
                  >
                    Salvar Alterações
                  </button>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
          
        </div>

      </div>

    </div>
  );
};

export default ManicureDashboard;
