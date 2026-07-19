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
  const [activeTab, setActiveTab] = useState<'dashboard' | 'appointments' | 'services' | 'pos' | 'gallery' | 'reviews' | 'profile' | 'settings' | 'help' | 'room'>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Chairs room module states
  const [chairs, setChairs] = useState<any[]>([]);
  const [chairBlocks, setChairBlocks] = useState<any[]>([]);
  const [showAssignModal, setShowAssignModal] = useState<any | null>(null);
  const [showAddChair, setShowAddChair] = useState(false);
  const [newChairName, setNewChairName] = useState('');
  const [selectedPosReservation, setSelectedPosReservation] = useState<any | null>(null);

  const loadChairsData = async () => {
    try {
      const API_BASE_URL = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
        ? 'http://localhost:3001'
        : 'https://azorestoyou-nyvy.onrender.com';
      const resChairs = await fetch(`${API_BASE_URL}/api/chairs?businessId=${business.id}`);
      if (resChairs.ok) {
        const dataChairs = await resChairs.json();
        setChairs(dataChairs);
      }
      const resBlocks = await fetch(`${API_BASE_URL}/api/chair-blocks?businessId=${business.id}`);
      if (resBlocks.ok) {
        const dataBlocks = await resBlocks.json();
        setChairBlocks(dataBlocks);
      }
    } catch (e) {
      console.error("Erro ao carregar dados das cadeiras:", e);
    }
  };

  React.useEffect(() => {
    if (business.id) {
      loadChairsData();
    }
  }, [business.id, activeTab]);

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

  // New features states
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [currentCalendarMonth, setCurrentCalendarMonth] = useState(new Date());

  // Services states
  const [showServiceForm, setShowServiceForm] = useState(false);
  const [editingService, setEditingService] = useState<any | null>(null);
  const [serviceForm, setServiceForm] = useState({
    name: '',
    category: 'Corte',
    description: '',
    price: '',
    duration: '30',
    image: '',
    isActive: true
  });

  // Business info editor states
  const [bizForm, setBizForm] = useState({
    name: business.name || '',
    welcomeName: business.welcomeName || '',
    phone: business.phone || '',
    email: business.email || '',
    iban: business.iban || '',
    address: business.address || '',
    postalCode: business.postalCode || '',
    island: business.island || 'São Miguel',
    concelho: business.concelho || '',
    googleMapsLink: business.googleMapsLink || business.mapUrl || '',
    description: business.description || '',
    logo: business.logo || '',
    coverImage: business.coverImage || business.image || ''
  });

  const [salesHistory, setSalesHistory] = useState<any[]>(() => {
    return (business as any).salesHistory || [
      { id: 'S1', serviceName: 'Corte Degradê & Fade', price: 15.00, paymentMethod: 'Dinheiro', timestamp: new Date(Date.now() - 3600000).toISOString() },
      { id: 'S2', serviceName: 'Barba Tradicional', price: 10.00, paymentMethod: 'MBWay', timestamp: new Date(Date.now() - 7200000).toISOString() }
    ];
  });

  // Catalogs
  const servicesCatalog = [
    { id: 's1', name: 'Corte Masculino', description: 'Corte completo', price: 12.00, duration: 30, image: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=300', category: 'Corte', isActive: true },
    { id: 's2', name: 'Barba Tradicional', description: 'Barba + Toalha Quente', price: 8.00, duration: 20, image: 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=300', category: 'Barba', isActive: true },
    { id: 's3', name: 'Corte + Barba', description: 'Pacote completo', price: 18.00, duration: 45, image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=300', category: 'Corte + Barba', isActive: true },
    { id: 's4', name: 'Degradê', description: 'Degradê completo', price: 15.00, duration: 30, image: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=300', category: 'Degradê', isActive: true },
    { id: 's5', name: 'Coloração', description: 'Coloração completa', price: 25.00, duration: 60, image: 'https://images.unsplash.com/photo-1605497746444-ac9dbd324ce4?w=300', category: 'Coloração', isActive: true },
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

  const timeToMinutes = (t: string) => {
    if (!t) return 0;
    const [h, m] = t.split(':').map(Number);
    return h * 60 + (m || 0);
  };

  const minutesToTime = (min: number) => {
    const h = Math.floor(min / 60);
    const m = min % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  };

  const getAvailableChairsForResv = (resv: any) => {
    if (!resv) return [];
    let duration = 30;
    const items = resv.preOrder || resv.preorder || [];
    if (items.length > 0) {
      duration = items.reduce((sum: number, item: any) => sum + ((item.dish?.duration || item.duration || 30) * (item.quantity || 1)), 0);
    }
    const slotStart = resv.time;
    const slotEnd = minutesToTime(timeToMinutes(slotStart) + duration);

    return chairs.filter(chair => {
      if (!chair.isActive) return false;
      const blocks = chairBlocks.filter(b =>
        (b.chairId === chair.id || b.chairId === chair.chairId) &&
        b.date === resv.date &&
        b.status !== 'cancelled' &&
        b.status !== 'completed'
      );
      const hasOverlap = blocks.some(b => {
        const bStart = timeToMinutes(b.startTime);
        const bEnd = timeToMinutes(b.endTime);
        return timeToMinutes(slotStart) < bEnd && timeToMinutes(slotEnd) > bStart;
      });
      return !hasOverlap;
    });
  };

  const confirmReservationWithChair = async (resv: any, chairId: string) => {
    const API_BASE_URL = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
      ? 'http://localhost:3001'
      : 'https://azorestoyou-nyvy.onrender.com';
    try {
      const res = await fetch(`${API_BASE_URL}/api/reservations/${resv.id || resv._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'accepted', chairId })
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Erro ao confirmar agendamento.');
      }
      const updatedRes = await res.json();

      // Update locally
      const updatedReservations = (business.reservations || []).map((rv: any) =>
        (rv.id === resv.id || rv._id === resv._id) ? { ...rv, status: 'accepted', chairId, chairName: updatedRes.chairName } : rv
      );
      onUpdateBusiness({
        ...business,
        reservations: updatedReservations
      });
      setShowAssignModal(null);
      loadChairsData();
      alert(`Agendamento confirmado com sucesso na cadeira: ${updatedRes.chairName}`);
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Erro ao atualizar estado.');
    }
  };

  const handlePOSForReservation = (resv: any) => {
    setClientName(resv.customerName || 'Cliente Geral');
    setSelectedPosReservation(resv);

    // Load pre-selected services in cart
    const preselected: any[] = [];
    const items = resv.preOrder || resv.preorder || [];
    items.forEach((item: any) => {
      const svc = services.find((s: any) => s.name === item.dish?.name || s.name === item.name);
      if (svc) {
        preselected.push({ ...svc, type: 'service', quantity: 1 });
      } else {
        preselected.push({
          id: item.dish?.id || `s_${Date.now()}_${Math.random()}`,
          name: item.dish?.name || item.name,
          price: item.dish?.price || item.price || 15,
          duration: item.dish?.duration || item.duration || 30,
          type: 'service',
          quantity: 1
        });
      }
    });
    setCart(preselected);
    setActiveTab('pos');
  };

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
      : 'https://azorestoyou-nyvy.onrender.com';

    const salePayload = {
      id: `SALE_${Date.now()}`,
      barberId: business.id,
      clientId: clientName !== 'Cliente Geral' ? clientName : null,
      appointmentId: selectedPosReservation?.id || null,
      chairId: selectedPosReservation?.chairId || null,
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

      // Update local reservation status if matching POS selection
      if (selectedPosReservation) {
        const updatedReservations = (business.reservations || []).map((rv: any) =>
          (rv.id === selectedPosReservation.id) ? { ...rv, status: 'completed' } : rv
        );
        onUpdateBusiness({
          ...business,
          reservations: updatedReservations
        });
      }

      // Clean up states
      setCart([]);
      setObservations('');
      setDiscountPercent(0);
      setClientName('Cliente Geral');
      setSelectedPosReservation(null);
      loadChairsData();
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

  const handleSaveProfile = async () => {
    if (!bizForm.name.trim()) {
      alert('O nome do negócio é obrigatório.');
      return;
    }
    const API_BASE_URL = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
      ? 'http://localhost:3001'
      : 'https://azorestoyou-nyvy.onrender.com';
    try {
      const updatedBusiness = {
        ...business,
        name: bizForm.name.trim(),
        welcomeName: bizForm.welcomeName.trim(),
        description: bizForm.description.trim(),
        phone: bizForm.phone.trim(),
        email: bizForm.email.trim(),
        address: bizForm.address.trim(),
        iban: bizForm.iban.trim(),
        googleMapsLink: bizForm.googleMapsLink.trim(),
        mapUrl: bizForm.googleMapsLink.trim(),
        logo: bizForm.logo.trim(),
        coverImage: bizForm.coverImage.trim(),
        openingHours: openingHours.trim()
      };

      // Try to persist changes on the server (best effort)
      try {
        const res = await fetch(`${API_BASE_URL}/api/businesses/${business.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'X-Business-Id': String(business.id)
          },
          body: JSON.stringify(updatedBusiness)
        });
        if (!res.ok) {
          console.warn('Servidor retornou erro ao guardar perfil:', res.status);
        }
      } catch (fetchErr) {
        console.warn('Erro de rede ao guardar perfil, a atualizar localmente:', fetchErr);
      }

      // Always update local state
      onUpdateBusiness(updatedBusiness);
      alert('✅ Perfil atualizado com sucesso!');
    } catch (err) {
      console.error('Erro ao guardar perfil:', err);
      alert('Erro ao guardar alterações. Tente novamente.');
    }
  };


  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans flex overflow-hidden selection:bg-[#D4AF37] selection:text-black">

      {/* SIDEBAR */}
      <aside className={`bg-[#0d0d0d] border-r border-[rgba(255,215,0,0.15)] flex flex-col transition-all duration-300 z-50 shrink-0 ${sidebarOpen ? 'w-64' : 'w-20'
        }`}>
        {/* Brand/Logo Section */}
        <div className="p-6 border-b border-[rgba(255,215,0,0.15)] flex flex-col items-center text-center">
          <div className="flex flex-col items-center justify-center">
            {business.logo ? (
              <img
                src={business.logo}
                alt={business.name}
                className="w-12 h-12 rounded-full object-cover border border-[#D4AF37] shadow-[0_0_15px_rgba(212,175,55,0.25)]"
              />
            ) : (
              <>
                {/* Crown Icon */}
                <svg className="w-5 h-5 text-[#D4AF37] mb-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3 5.5 5.5-1.5-2.5 7h-12l-2.5-7 5.5 1.5zM21 16h-18v2h18zM19 19h-14v2h14z" />
                </svg>
                <div className="w-12 h-12 bg-black border border-[#D4AF37] rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(212,175,55,0.25)]">
                  <span className="text-xl font-black text-[#D4AF37]">{business.name ? business.name.substring(0, 1).toUpperCase() : 'B'}</span>
                </div>
              </>
            )}
            {sidebarOpen && (
              <div className="mt-2.5">
                <h1 className="text-xs font-black tracking-[0.2em] text-[#D4AF37] uppercase truncate max-w-[180px]">{business.name || 'BARBEARIA'}</h1>
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
            { id: 'room', label: 'Ver Sala', icon: <Eye className="w-4 h-4" />, badge: 'LIVE' },
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
              className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-[18px] text-xs font-bold uppercase tracking-wider transition-all duration-300 border ${activeTab === item.id
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
              src={business.logo || "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=256"}
              alt="Avatar"
              className="w-10 h-10 rounded-full object-cover border border-[#D4AF37]/30"
            />
            {sidebarOpen && (
              <div className="flex-1 min-w-0 text-left">
                <p className="text-xs font-black text-white truncate">{business.welcomeName || business.name || "Carlos Almeida"}</p>
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
              <h2 className="text-xl font-black text-white leading-none">{business.welcomeName || business.name || 'Parceiro'}!</h2>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div
              onClick={() => setShowCalendarModal(true)}
              className="flex items-center gap-2 cursor-pointer hover:text-[#D4AF37] transition-colors group"
            >
              <Calendar className="w-4 h-4 text-[#D4AF37] group-hover:scale-110 transition-transform" />
              <div className="text-left leading-none">
                <p className="text-[10px] text-white font-black">{new Date().toLocaleDateString('pt-PT', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                <p className="text-[8px] text-[#AFAFAF] font-medium mt-0.5 uppercase tracking-widest">{new Date().toLocaleDateString('pt-PT', { weekday: 'long' })}</p>
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
                src={business.logo || "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=256"}
                alt="Avatar"
                className="w-8 h-8 rounded-full object-cover border border-[#D4AF37]/30"
              />
              <div className="text-left leading-none hidden sm:block">
                <p className="text-[11px] font-black text-white group-hover:text-[#D4AF37] transition-all">{business.welcomeName || business.name || "Carlos Almeida"}</p>
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
                  src={business.coverImage || business.image || "https://images.unsplash.com/photo-1621605815971-fbc98d665033?q=80&w=2070"}
                  alt={business.name || 'Barbearia'}
                  className="absolute inset-0 w-full h-full object-cover opacity-15"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/75 to-transparent" />

                <div className="relative z-10 text-left space-y-2.5 max-w-lg">
                  <div className="flex items-center gap-3">
                    <h3 className="text-2xl font-black text-white tracking-tight">{business.name || 'Barbearia'}</h3>
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

                {/* Right side logo or fallback */}
                <div className="relative z-10 w-28 h-28 rounded-xl overflow-hidden border border-[#D4AF37]/20 shadow-lg hidden sm:block">
                  <img src={business.logo || "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=200"} className="w-full h-full object-cover" alt="" />
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
                        <span className={`text-[7px] font-black uppercase px-2 py-0.5 rounded-full shrink-0 ${r.status === 'accepted' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
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
                {reservations.map((r, idx) => {
                  const updateStatus = async (newStatus: string) => {
                    const API_BASE_URL = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
                      ? 'http://localhost:3001'
                      : 'https://azorestoyou-nyvy.onrender.com';
                    try {
                      const res = await fetch(`${API_BASE_URL}/api/reservations/${r.id || r._id}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ status: newStatus })
                      });
                      if (!res.ok) throw new Error('Falha ao atualizar estado.');
                      const updatedReservation = await res.json();

                      // Update business reservations array locally
                      const updatedReservations = (business.reservations || []).map((resv: any) =>
                        (resv.id === r.id || resv._id === r._id) ? { ...resv, status: newStatus } : resv
                      );
                      onUpdateBusiness({
                        ...business,
                        reservations: updatedReservations
                      });
                      alert(`Estado atualizado para: ${newStatus}`);
                    } catch (err) {
                      console.error(err);
                      alert('Erro ao atualizar estado do agendamento.');
                    }
                  };

                  return (
                    <div key={idx} className="bg-black/50 border border-neutral-900 p-4 rounded-[18px] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-bold text-[#D4AF37] bg-[#D4AF37]/5 px-2.5 py-1.5 rounded-lg border border-[#D4AF37]/20">{r.time}</span>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="text-xs font-black text-white">{r.customerName}</p>
                            <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full ${r.status === 'accepted' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                                r.status === 'pending' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                                  r.status === 'rejected' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                                    'bg-neutral-800 text-neutral-400'
                              }`}>
                              {r.status === 'accepted' ? 'Confirmado' : r.status === 'pending' ? 'Pendente' : r.status === 'rejected' ? 'Recusado' : r.status}
                            </span>
                          </div>
                          <p className="text-[9px] text-[#AFAFAF] mt-0.5">{r.customerPhone || 'Sem contacto'}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                        <span className="text-xs text-white/80 font-medium">{r.serviceName || (r.preOrder && r.preOrder.map((po: any) => po.dish?.name).join(', '))}</span>
                        <div className="flex gap-2">
                          {r.status === 'pending' && (
                            <>
                              <button
                                onClick={() => {
                                  const avChairs = getAvailableChairsForResv(r);
                                  if (chairs.length === 1 && avChairs.length === 1) {
                                    confirmReservationWithChair(r, avChairs[0].id);
                                  } else {
                                    setShowAssignModal(r);
                                  }
                                }}
                                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-black uppercase tracking-wider rounded-lg transition-all"
                              >
                                Confirmar
                              </button>
                              <button
                                onClick={() => updateStatus('rejected')}
                                className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-[10px] font-black uppercase tracking-wider rounded-lg transition-all"
                              >
                                Recusar
                              </button>
                            </>
                          )}
                          {r.status === 'accepted' && (
                            <button
                              onClick={() => updateStatus('cancelled')}
                              className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-[10px] font-black uppercase tracking-wider rounded-lg transition-all"
                            >
                              Cancelar
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB: VER SALA */}
          {activeTab === 'room' && (
            <div className="space-y-6 text-left animate-in fade-in duration-300">
              <div className="flex justify-between items-center bg-[#0d0d0d] border border-[rgba(255,215,0,0.15)] rounded-[18px] p-6">
                <div>
                  <h2 className="text-base font-black uppercase tracking-wider text-[#D4AF37]">Ver Sala (Cadeiras)</h2>
                  <p className="text-xs text-[#AFAFAF] mt-1">Gerencie a ocupação em tempo real e associe cadeiras ao POS e Agenda.</p>
                </div>
                <button
                  onClick={() => setShowAddChair(true)}
                  className="bg-black hover:bg-neutral-900 border border-[#D4AF37]/50 text-[#D4AF37] px-6 py-3 rounded-[18px] text-xs font-black uppercase tracking-wider transition-all"
                >
                  + Adicionar Cadeira
                </button>
              </div>

              {showAddChair && (
                <div className="bg-[#0D0D0D] border border-[#D4AF37]/30 rounded-[18px] p-6 space-y-4">
                  <h3 className="text-xs font-black uppercase tracking-widest text-[#D4AF37]">Nova Cadeira de Barbearia</h3>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <input
                      type="text"
                      placeholder="Nome da Cadeira (Ex: Cadeira Principal)"
                      value={newChairName}
                      onChange={(e) => setNewChairName(e.target.value)}
                      className="flex-1 bg-black border border-neutral-800 rounded-xl px-4 py-3 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-[#D4AF37]"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={async () => {
                          if (!newChairName.trim()) return;
                          const API_BASE_URL = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
                            ? 'http://localhost:3001'
                            : 'https://azorestoyou-nyvy.onrender.com';
                          try {
                            const res = await fetch(`${API_BASE_URL}/api/chairs`, {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ businessId: business.id, chairName: newChairName.trim() })
                            });
                            if (!res.ok) throw new Error('Falha ao adicionar cadeira.');
                            setNewChairName('');
                            setShowAddChair(false);
                            loadChairsData();
                          } catch (err) {
                            console.error(err);
                            alert('Erro ao criar cadeira.');
                          }
                        }}
                        className="bg-[#D4AF37] hover:bg-[#b8962d] text-black px-6 py-3 rounded-xl text-xs font-black uppercase tracking-wider"
                      >
                        Gravar
                      </button>
                      <button
                        onClick={() => setShowAddChair(false)}
                        className="bg-neutral-800 hover:bg-neutral-700 text-white px-6 py-3 rounded-xl text-xs font-black uppercase tracking-wider"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {chairs.filter(c => c.isActive !== false).map((chair) => {
                  const colorMap: Record<string, string> = {
                    'available': '#10B981',
                    'Reservada': '#3B82F6',
                    'Em Atendimento': '#D4AF37',
                    'Bloqueada': '#EF4444',
                    'Limpeza': '#6B7280',
                    'inactive': '#374151'
                  };
                  const statusColor = colorMap[chair.status] || '#10B981';

                  const handleStatusUpdate = async (status: string) => {
                    const API_BASE_URL = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
                      ? 'http://localhost:3001'
                      : 'https://azorestoyou-nyvy.onrender.com';
                    try {
                      if (status === 'blocked' || status === 'cleaning') {
                        const date = new Date().toISOString().split('T')[0];
                        await fetch(`${API_BASE_URL}/api/chair-blocks`, {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({
                            chairId: chair.id,
                            businessId: business.id,
                            date,
                            startTime: '08:00',
                            endTime: '22:00',
                            status,
                            reason: status === 'cleaning' ? 'Limpeza de Cadeira' : 'Bloqueio Manual'
                          })
                        });
                      } else {
                        await fetch(`${API_BASE_URL}/api/chairs/${chair.id}`, {
                          method: 'PUT',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ status })
                        });
                      }
                      loadChairsData();
                    } catch (err) {
                      console.error(err);
                    }
                  };

                  const handleDeleteChair = async () => {
                    if (!confirm('Deseja mesmo eliminar esta cadeira?')) return;
                    const API_BASE_URL = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
                      ? 'http://localhost:3001'
                      : 'https://azorestoyou-nyvy.onrender.com';
                    try {
                      const res = await fetch(`${API_BASE_URL}/api/chairs/${chair.id}`, {
                        method: 'DELETE'
                      });
                      if (!res.ok) throw new Error();
                      loadChairsData();
                    } catch (err) {
                      console.error(err);
                      alert('Erro ao eliminar cadeira.');
                    }
                  };

                  const handleStartService = async () => {
                    if (!chair.currentAppointmentId) return;
                    const API_BASE_URL = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
                      ? 'http://localhost:3001'
                      : 'https://azorestoyou-nyvy.onrender.com';
                    try {
                      await fetch(`${API_BASE_URL}/api/reservations/${chair.currentAppointmentId}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ status: 'in_service' })
                      });

                      const updatedReservations = (business.reservations || []).map((rv: any) =>
                        (rv.id === chair.currentAppointmentId) ? { ...rv, status: 'in_service' } : rv
                      );
                      onUpdateBusiness({
                        ...business,
                        reservations: updatedReservations
                      });

                      loadChairsData();
                      alert('Atendimento iniciado com sucesso!');
                    } catch (err) {
                      console.error(err);
                    }
                  };

                  const handleReleaseChair = async () => {
                    if (!chair.currentAppointmentId) return;
                    const API_BASE_URL = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
                      ? 'http://localhost:3001'
                      : 'https://azorestoyou-nyvy.onrender.com';
                    try {
                      await fetch(`${API_BASE_URL}/api/reservations/${chair.currentAppointmentId}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ status: 'completed' })
                      });

                      const updatedReservations = (business.reservations || []).map((rv: any) =>
                        (rv.id === chair.currentAppointmentId) ? { ...rv, status: 'completed' } : rv
                      );
                      onUpdateBusiness({
                        ...business,
                        reservations: updatedReservations
                      });

                      loadChairsData();
                      alert('Cadeira libertada.');
                    } catch (err) {
                      console.error(err);
                    }
                  };

                  return (
                    <div
                      key={chair.id}
                      className="bg-[#0d0d0d] border border-[rgba(255,215,0,0.15)] rounded-[18px] p-6 flex flex-col justify-between hover:scale-[1.02] transition-all hover:shadow-[0_0_15px_rgba(212,175,55,0.05)]"
                    >
                      <div className="space-y-4">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-black border border-[#D4AF37]/20 flex items-center justify-center shrink-0">
                              <Scissors className="w-5 h-5 text-[#D4AF37]" />
                            </div>
                            <div>
                              <h3 className="text-xs font-black text-white uppercase tracking-wider">{chair.chairName}</h3>
                              <p className="text-[8px] text-[#AFAFAF] font-bold uppercase tracking-widest mt-0.5">Nº {chair.chairNumber}</p>
                            </div>
                          </div>
                          <span
                            className="text-[8px] font-black uppercase px-2.5 py-1 rounded-full border"
                            style={{
                              color: statusColor,
                              borderColor: `${statusColor}33`,
                              backgroundColor: `${statusColor}10`
                            }}
                          >
                            {chair.status === 'available' ? 'Disponível' : chair.status}
                          </span>
                        </div>

                        {(chair.status === 'Reservada' || chair.status === 'Em Atendimento') && (
                          <div className="p-3 bg-black/40 border border-neutral-900 rounded-xl text-xs space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-neutral-500 text-[8px] font-black uppercase">Cliente:</span>
                              <span className="font-bold text-white truncate max-w-[120px]">{chair.currentClientId || 'Cliente Geral'}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-neutral-500 text-[8px] font-black uppercase">Serviço:</span>
                              <span className="font-bold text-[#D4AF37] truncate max-w-[120px]">{chair.currentServiceId || 'Corte'}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-neutral-500 text-[8px] font-black uppercase">Horário:</span>
                              <span className="font-bold text-white">{chair.blockedFrom} - {chair.blockedUntil}</span>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="mt-6 flex flex-col gap-2">
                        {chair.status === 'Reservada' && (
                          <div className="grid grid-cols-2 gap-2">
                            <button
                              onClick={handleStartService}
                              className="py-2.5 bg-[#D4AF37] hover:bg-[#b8962d] text-black text-[9px] font-black uppercase tracking-wider rounded-xl transition-all"
                            >
                              Iniciar Serviço
                            </button>
                            <button
                              onClick={async () => {
                                if (chair.currentAppointmentId) {
                                  const r = business.reservations?.find(resv => resv.id === chair.currentAppointmentId);
                                  if (r) handlePOSForReservation(r);
                                }
                              }}
                              className="py-2.5 bg-black border border-[#D4AF37]/40 hover:border-[#D4AF37] text-[#D4AF37] text-[9px] font-black uppercase tracking-wider rounded-xl transition-all"
                            >
                              Venda
                            </button>
                          </div>
                        )}

                        {chair.status === 'Em Atendimento' && (
                          <div className="grid grid-cols-2 gap-2">
                            <button
                              onClick={async () => {
                                if (chair.currentAppointmentId) {
                                  const r = business.reservations?.find(resv => resv.id === chair.currentAppointmentId);
                                  if (r) handlePOSForReservation(r);
                                }
                              }}
                              className="py-2.5 bg-[#D4AF37] hover:bg-[#b8962d] text-black text-[9px] font-black uppercase tracking-wider rounded-xl transition-all"
                            >
                              Venda / Pagar
                            </button>
                            <button
                              onClick={handleReleaseChair}
                              className="py-2.5 bg-neutral-850 hover:bg-neutral-800 text-white text-[9px] font-black uppercase tracking-wider rounded-xl transition-all"
                            >
                              Libertar Cadeira
                            </button>
                          </div>
                        )}

                        {chair.status === 'available' && (
                          <div className="grid grid-cols-3 gap-1.5">
                            <button
                              onClick={() => handleStatusUpdate('cleaning')}
                              className="py-2 bg-neutral-900 border border-neutral-800 hover:bg-neutral-850 text-neutral-400 hover:text-white text-[8px] font-black uppercase tracking-wider rounded-xl transition-all"
                            >
                              Limpeza
                            </button>
                            <button
                              onClick={() => handleStatusUpdate('blocked')}
                              className="py-2 bg-neutral-900 border border-neutral-800 hover:bg-neutral-850 text-neutral-400 hover:text-white text-[8px] font-black uppercase tracking-wider rounded-xl transition-all"
                            >
                              Bloquear
                            </button>
                            <button
                              onClick={handleDeleteChair}
                              className="py-2 bg-red-950/20 border border-red-900/30 hover:bg-red-950/40 text-red-400 text-[8px] font-black uppercase tracking-wider rounded-xl transition-all"
                            >
                              Eliminar
                            </button>
                          </div>
                        )}

                        {chair.status !== 'available' && chair.status !== 'Reservada' && chair.status !== 'Em Atendimento' && (
                          <button
                            onClick={async () => {
                              const API_BASE_URL = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
                                ? 'http://localhost:3001'
                                : 'https://azorestoyou-nyvy.onrender.com';
                              try {
                                // Soft-release: use PUT to mark block as cancelled, preserving history
                                const activeB = chairBlocks.find(b => (b.chairId === chair.id || b.chairId === chair.chairId) && b.status !== 'completed' && b.status !== 'cancelled');
                                if (activeB) {
                                  await fetch(`${API_BASE_URL}/api/chair-blocks/${activeB.id}`, {
                                    method: 'PUT',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ status: 'cancelled' })
                                  });
                                } else {
                                  // If no active block, just update chair status directly
                                  await fetch(`${API_BASE_URL}/api/chairs/${chair.id}`, {
                                    method: 'PUT',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ status: 'available' })
                                  });
                                }
                                loadChairsData();
                              } catch (err) {
                                console.error('Erro ao libertar cadeira:', err);
                                loadChairsData();
                              }
                            }}
                            className="py-2.5 bg-emerald-900/30 hover:bg-emerald-900/50 border border-emerald-700/40 text-emerald-400 text-[9px] font-black uppercase tracking-wider rounded-xl transition-all"
                          >
                            Tornar Disponível
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB: SERVIÇOS */}
          {activeTab === 'services' && (
            <div className="space-y-6 text-left animate-in fade-in duration-300">
              {/* Header */}
              <div className="bg-[#0d0d0d] border border-[rgba(255,215,0,0.15)] rounded-[18px] p-6 flex justify-between items-center">
                <div>
                  <h2 className="text-base font-black uppercase tracking-wider text-[#D4AF37]">Catálogo de Serviços</h2>
                  <p className="text-xs text-[#AFAFAF] mt-1">{services.filter((s: any) => s.isActive !== false).length} serviços ativos</p>
                </div>
                <button
                  onClick={() => {
                    setEditingService(null);
                    setServiceForm({ name: '', category: 'Corte', description: '', price: '', duration: '30', image: '', isActive: true });
                    setShowServiceForm(true);
                  }}
                  className="bg-black border border-[#D4AF37]/50 hover:border-[#D4AF37] text-[#D4AF37] px-5 py-2.5 rounded-[18px] text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2"
                >
                  <Plus size={14} /> Novo Serviço
                </button>
              </div>

              {/* Service Form Modal */}
              {showServiceForm && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                  <div className="bg-[#0d0d0d] border border-[rgba(255,215,0,0.25)] rounded-[24px] max-w-lg w-full p-7 space-y-5 text-left shadow-2xl">
                    <div className="flex justify-between items-center">
                      <h3 className="text-sm font-black uppercase tracking-wider text-[#D4AF37]">{editingService ? 'Editar Serviço' : 'Novo Serviço'}</h3>
                      <button onClick={() => setShowServiceForm(false)} className="w-8 h-8 rounded-full bg-neutral-900 border border-neutral-800 text-white flex items-center justify-center hover:bg-neutral-800 transition-all"><X size={14} /></button>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="col-span-2">
                        <label className="block text-[9px] font-black uppercase tracking-widest text-[#AFAFAF] mb-1.5">Nome do Serviço *</label>
                        <input type="text" value={serviceForm.name} onChange={e => setServiceForm(p => ({ ...p, name: e.target.value }))} placeholder="Ex: Corte Masculino" className="w-full bg-black border border-neutral-800 rounded-xl px-4 py-3 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-[#D4AF37]" />
                      </div>
                      <div>
                        <label className="block text-[9px] font-black uppercase tracking-widest text-[#AFAFAF] mb-1.5">Categoria</label>
                        <select value={serviceForm.category} onChange={e => setServiceForm(p => ({ ...p, category: e.target.value }))} className="w-full bg-black border border-neutral-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#D4AF37]">
                          {['Corte', 'Barba', 'Corte + Barba', 'Infantil', 'Degradê', 'Coloração', 'Sobrancelha', 'Outros'].map(c => <option key={c}>{c}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-[9px] font-black uppercase tracking-widest text-[#AFAFAF] mb-1.5">Preço (€) *</label>
                        <input type="number" min="0" step="0.50" value={serviceForm.price} onChange={e => setServiceForm(p => ({ ...p, price: e.target.value }))} placeholder="12.00" className="w-full bg-black border border-neutral-800 rounded-xl px-4 py-3 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-[#D4AF37]" />
                      </div>
                      <div>
                        <label className="block text-[9px] font-black uppercase tracking-widest text-[#AFAFAF] mb-1.5">Duração (minutos)</label>
                        <input type="number" min="5" step="5" value={serviceForm.duration} onChange={e => setServiceForm(p => ({ ...p, duration: e.target.value }))} className="w-full bg-black border border-neutral-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#D4AF37]" />
                      </div>
                      <div>
                        <label className="block text-[9px] font-black uppercase tracking-widest text-[#AFAFAF] mb-1.5">URL da Imagem</label>
                        <input type="text" value={serviceForm.image} onChange={e => setServiceForm(p => ({ ...p, image: e.target.value }))} placeholder="https://..." className="w-full bg-black border border-neutral-800 rounded-xl px-4 py-3 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-[#D4AF37]" />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-[9px] font-black uppercase tracking-widest text-[#AFAFAF] mb-1.5">Descrição</label>
                        <textarea value={serviceForm.description} onChange={e => setServiceForm(p => ({ ...p, description: e.target.value }))} placeholder="Descreva o serviço brevemente..." rows={2} className="w-full bg-black border border-neutral-800 rounded-xl px-4 py-3 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-[#D4AF37] resize-none" />
                      </div>
                    </div>
                    <div className="flex gap-3 pt-2">
                      <button
                        onClick={() => {
                          if (!serviceForm.name.trim() || !serviceForm.price) { alert('Nome e preço são obrigatórios.'); return; }
                          let updatedServices: any[];
                          if (editingService) {
                            updatedServices = services.map((s: any) => s.id === editingService.id ? { ...s, ...serviceForm, price: parseFloat(serviceForm.price), duration: parseInt(serviceForm.duration) } : s);
                          } else {
                            updatedServices = [...services, { id: `s_${Date.now()}`, ...serviceForm, price: parseFloat(serviceForm.price), duration: parseInt(serviceForm.duration), isActive: true }];
                          }
                          onUpdateBusiness({ ...business, services: updatedServices });
                          setShowServiceForm(false);
                        }}
                        className="flex-1 py-3 bg-[#D4AF37] hover:bg-amber-500 text-black text-xs font-black uppercase tracking-widest rounded-xl transition-all"
                      >
                        {editingService ? 'Guardar Alterações' : 'Criar Serviço'}
                      </button>
                      <button onClick={() => setShowServiceForm(false)} className="px-5 py-3 bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all">Cancelar</button>
                    </div>
                  </div>
                </div>
              )}

              {/* Services by Category */}
              {['Corte', 'Barba', 'Corte + Barba', 'Infantil', 'Degradê', 'Coloração', 'Sobrancelha', 'Outros'].map(cat => {
                const catServices = services.filter((s: any) => s.category === cat);
                if (catServices.length === 0) return null;
                return (
                  <div key={cat} className="space-y-3">
                    <div className="flex items-center gap-3">
                      <h3 className="text-xs font-black uppercase tracking-widest text-[#D4AF37]">✂️ {cat}</h3>
                      <div className="flex-1 h-px bg-[rgba(255,215,0,0.1)]" />
                      <span className="text-[8px] text-[#AFAFAF] font-bold uppercase">{catServices.filter((s: any) => s.isActive !== false).length} ativos</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {catServices.map((s: any) => (
                        <div key={s.id} className={`bg-[#0d0d0d] border rounded-[18px] overflow-hidden transition-all hover:scale-[1.02] ${s.isActive === false ? 'border-neutral-800 opacity-50' : 'border-[rgba(255,215,0,0.15)] hover:border-[#D4AF37]/30'}`}>
                          {s.image && <img src={s.image} alt={s.name} className="w-full h-28 object-cover" />}
                          {!s.image && <div className="w-full h-28 bg-black/50 flex items-center justify-center text-4xl">✂️</div>}
                          <div className="p-4 space-y-2">
                            <div className="flex justify-between items-start">
                              <div className="flex-1 min-w-0">
                                <h4 className="text-xs font-black text-white truncate">{s.name}</h4>
                                <p className="text-[9px] text-[#AFAFAF] mt-0.5 line-clamp-1">{s.description || 'Sem descrição'}</p>
                              </div>
                              {s.isActive === false && <span className="text-[7px] bg-neutral-800 text-neutral-400 px-2 py-0.5 rounded-full uppercase font-black ml-2 shrink-0">Inativo</span>}
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-[#D4AF37] font-black text-sm">€{parseFloat(s.price).toFixed(2)}</span>
                              <span className="text-[9px] text-[#AFAFAF] font-bold">{s.duration} min</span>
                            </div>
                            <div className="flex gap-2 pt-1">
                              <button
                                onClick={() => {
                                  setEditingService(s);
                                  setServiceForm({ name: s.name, category: s.category || 'Outros', description: s.description || '', price: String(s.price), duration: String(s.duration || 30), image: s.image || '', isActive: s.isActive !== false });
                                  setShowServiceForm(true);
                                }}
                                className="flex-1 py-1.5 bg-black border border-neutral-800 hover:border-[#D4AF37]/50 text-white text-[8px] font-black uppercase rounded-lg transition-all flex items-center justify-center gap-1"
                              >
                                <Edit size={10} /> Editar
                              </button>
                              <button
                                onClick={() => {
                                  if (s.isActive === false) {
                                    // Re-activate
                                    const updated = services.map((item: any) => item.id === s.id ? { ...item, isActive: true } : item);
                                    onUpdateBusiness({ ...business, services: updated });
                                  } else {
                                    if (!confirm(`Desativar "${s.name}"? O serviço ficará oculto para os clientes mas o histórico é mantido.`)) return;
                                    const updated = services.map((item: any) => item.id === s.id ? { ...item, isActive: false } : item);
                                    onUpdateBusiness({ ...business, services: updated });
                                  }
                                }}
                                className={`px-3 py-1.5 text-[8px] font-black uppercase rounded-lg transition-all ${s.isActive === false ? 'bg-emerald-900/30 border border-emerald-700/40 text-emerald-400' : 'bg-amber-900/20 border border-amber-700/30 text-amber-400'}`}
                              >
                                {s.isActive === false ? 'Ativar' : 'Desativar'}
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}

              {services.length === 0 && (
                <div className="bg-[#0d0d0d] border border-[rgba(255,215,0,0.15)] rounded-[18px] py-16 text-center">
                  <div className="text-4xl mb-3">✂️</div>
                  <p className="text-sm font-black text-white">Ainda não tem serviços</p>
                  <p className="text-xs text-[#AFAFAF] mt-1">Clique em "Novo Serviço" para começar</p>
                </div>
              )}
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
                      className={`px-5 py-3 rounded-xl text-[9px] font-black uppercase tracking-wider transition-all duration-300 border ${categoryFilter === cat
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
                    {
                      label: '% Desconto', key: 'F2', action: () => {
                        const val = prompt('Introduza o desconto (%):', String(discountPercent));
                        if (val !== null) setDiscountPercent(Math.max(0, Math.min(100, parseFloat(val) || 0)));
                      }
                    },
                    {
                      label: '👥 Cliente', key: 'F3', action: () => {
                        const name = prompt('Nome do cliente:', clientName);
                        if (name !== null) setClientName(name.trim() || 'Cliente Geral');
                      }
                    },
                    {
                      label: '📦 Produto', key: 'F4', action: () => {
                        const searchInput = document.getElementById('pos-search-input');
                        if (searchInput) searchInput.focus();
                      }
                    },
                    { label: '🗑️ Limpar', key: 'F5', action: () => setCart([]) },
                    {
                      label: '❌ Cancelar', key: 'Del', action: () => {
                        setCart([]);
                        setClientName('Cliente Geral');
                        setDiscountPercent(0);
                        setObservations('');
                      }
                    }
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
                        className={`p-3 rounded-xl flex items-center gap-2 border transition-all duration-300 ${paymentMethod === method.id
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
            <div className="space-y-6 text-left animate-in fade-in duration-300">
              <div className="bg-[#0d0d0d] border border-[rgba(255,215,0,0.15)] rounded-[18px] p-6">
                <h2 className="text-base font-black uppercase tracking-wider text-[#D4AF37] mb-1">Editar Negócio</h2>
                <p className="text-xs text-[#AFAFAF]">Estas informações aparecem no seu perfil público.</p>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* LEFT COL */}
                <div className="space-y-5">
                  <div className="bg-[#0d0d0d] border border-[rgba(255,215,0,0.15)] rounded-[18px] p-6 space-y-4">
                    <h3 className="text-xs font-black uppercase tracking-widest text-[#D4AF37]">Identidade</h3>
                    <div>
                      <label className="block text-[9px] font-black uppercase tracking-widest text-[#AFAFAF] mb-1.5">Nome do Negócio *</label>
                      <input type="text" value={bizForm.name} onChange={e => setBizForm(p => ({ ...p, name: e.target.value }))} placeholder="Ex: BragaBarber" className="w-full bg-black border border-neutral-800 rounded-xl px-4 py-3 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-[#D4AF37]" />
                    </div>
                    <div>
                      <label className="block text-[9px] font-black uppercase tracking-widest text-[#AFAFAF] mb-1.5">Nome de Boas-Vindas (saudação)</label>
                      <input type="text" value={bizForm.welcomeName} onChange={e => setBizForm(p => ({ ...p, welcomeName: e.target.value }))} placeholder="Ex: Carlos" className="w-full bg-black border border-neutral-800 rounded-xl px-4 py-3 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-[#D4AF37]" />
                      <p className="text-[8px] text-[#AFAFAF] mt-1">Aparece como: "Bem-vindo de volta, Carlos!"</p>
                    </div>
                    <div>
                      <label className="block text-[9px] font-black uppercase tracking-widest text-[#AFAFAF] mb-1.5">Descrição</label>
                      <textarea value={bizForm.description} onChange={e => setBizForm(p => ({ ...p, description: e.target.value }))} rows={3} placeholder="Descreva a sua barbearia..." className="w-full bg-black border border-neutral-800 rounded-xl px-4 py-3 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-[#D4AF37] resize-none" />
                    </div>
                  </div>
                  <div className="bg-[#0d0d0d] border border-[rgba(255,215,0,0.15)] rounded-[18px] p-6 space-y-4">
                    <h3 className="text-xs font-black uppercase tracking-widest text-[#D4AF37]">Contactos</h3>
                    <div>
                      <label className="block text-[9px] font-black uppercase tracking-widest text-[#AFAFAF] mb-1.5">Telemóvel</label>
                      <input type="text" value={bizForm.phone} onChange={e => setBizForm(p => ({ ...p, phone: e.target.value }))} placeholder="+351 912 345 678" className="w-full bg-black border border-neutral-800 rounded-xl px-4 py-3 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-[#D4AF37]" />
                    </div>
                    <div>
                      <label className="block text-[9px] font-black uppercase tracking-widest text-[#AFAFAF] mb-1.5">Email</label>
                      <input type="email" value={bizForm.email} onChange={e => setBizForm(p => ({ ...p, email: e.target.value }))} placeholder="barbearia@email.com" className="w-full bg-black border border-neutral-800 rounded-xl px-4 py-3 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-[#D4AF37]" />
                    </div>
                    <div>
                      <label className="block text-[9px] font-black uppercase tracking-widest text-[#AFAFAF] mb-1.5">Morada</label>
                      <input type="text" value={bizForm.address} onChange={e => setBizForm(p => ({ ...p, address: e.target.value }))} placeholder="Rua Principal, Ponta Delgada" className="w-full bg-black border border-neutral-800 rounded-xl px-4 py-3 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-[#D4AF37]" />
                    </div>
                    <div>
                      <label className="block text-[9px] font-black uppercase tracking-widest text-[#AFAFAF] mb-1.5">Google Maps (link)</label>
                      <input type="text" value={bizForm.googleMapsLink} onChange={e => setBizForm(p => ({ ...p, googleMapsLink: e.target.value }))} placeholder="https://maps.google.com/..." className="w-full bg-black border border-neutral-800 rounded-xl px-4 py-3 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-[#D4AF37]" />
                    </div>
                  </div>
                </div>
                {/* RIGHT COL */}
                <div className="space-y-5">
                  <div className="bg-[#0d0d0d] border border-[rgba(255,215,0,0.15)] rounded-[18px] p-6 space-y-4">
                    <h3 className="text-xs font-black uppercase tracking-widest text-[#D4AF37]">Imagens</h3>
                    <div>
                      <label className="block text-[9px] font-black uppercase tracking-widest text-[#AFAFAF] mb-1.5">URL do Logótipo</label>
                      <input type="text" value={bizForm.logo} onChange={e => setBizForm(p => ({ ...p, logo: e.target.value }))} placeholder="https://..." className="w-full bg-black border border-neutral-800 rounded-xl px-4 py-3 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-[#D4AF37]" />
                      {bizForm.logo && <img src={bizForm.logo} alt="Logo" className="w-16 h-16 rounded-full object-cover border border-[#D4AF37]/30 mt-2" />}
                    </div>
                    <div>
                      <label className="block text-[9px] font-black uppercase tracking-widest text-[#AFAFAF] mb-1.5">URL da Imagem de Capa</label>
                      <input type="text" value={bizForm.coverImage} onChange={e => setBizForm(p => ({ ...p, coverImage: e.target.value }))} placeholder="https://..." className="w-full bg-black border border-neutral-800 rounded-xl px-4 py-3 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-[#D4AF37]" />
                      {bizForm.coverImage && <img src={bizForm.coverImage} alt="Capa" className="w-full h-24 rounded-xl object-cover border border-neutral-800 mt-2" />}
                    </div>
                  </div>
                  <div className="bg-[#0d0d0d] border border-[rgba(255,215,0,0.15)] rounded-[18px] p-6 space-y-4">
                    <h3 className="text-xs font-black uppercase tracking-widest text-[#D4AF37]">Horário de Funcionamento</h3>
                    <div>
                      <label className="block text-[9px] font-black uppercase tracking-widest text-[#AFAFAF] mb-1.5">Dias Úteis (texto livre)</label>
                      <input type="text" value={openingHours} onChange={e => setOpeningHours(e.target.value)} placeholder="09:00 - 19:00" className="w-full bg-black border border-neutral-800 rounded-xl px-4 py-3 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-[#D4AF37]" />
                    </div>
                  </div>
                  <div className="bg-[#0d0d0d] border border-[rgba(255,215,0,0.15)] rounded-[18px] p-6 space-y-4">
                    <h3 className="text-xs font-black uppercase tracking-widest text-[#D4AF37]">Dados Fiscais</h3>
                    <div>
                      <label className="block text-[9px] font-black uppercase tracking-widest text-[#AFAFAF] mb-1.5">IBAN</label>
                      <input type="text" value={bizForm.iban} onChange={e => setBizForm(p => ({ ...p, iban: e.target.value }))} placeholder="PT50 0000 0000 0000 0000 0000 0" className="w-full bg-black border border-neutral-800 rounded-xl px-4 py-3 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-[#D4AF37]" />
                    </div>
                  </div>
                </div>
              </div>
              <button
                onClick={handleSaveProfile}
                className="w-full py-4 bg-gradient-to-r from-[#D4AF37] to-amber-500 hover:from-amber-500 hover:to-[#D4AF37] text-black text-xs font-black uppercase tracking-widest rounded-[18px] transition-all shadow-[0_4px_20px_rgba(212,175,55,0.2)] active:scale-[0.98]"
              >
                💾 Guardar Todas as Alterações
              </button>
            </div>
          )}
        </div>

        {/* FOOTER / STATUS BAR */}
        <footer className="bg-[#0D0D0D] border-t border-[#D4AF37]/15 py-4 px-6 flex flex-wrap justify-between items-center text-[9px] text-[#AFAFAF] font-black uppercase tracking-widest shrink-0 gap-4">
          <div className="flex items-center gap-6">
            <span>Caixa: <span className="text-white">CAIXA 01</span></span>
            <span className="hidden sm:inline-block text-neutral-800">|</span>
            <span>Atendente: <span className="text-white">{business.welcomeName || business.name || 'Barbeiro'}</span></span>
            <span className="hidden sm:inline-block text-neutral-800">|</span>
            <span>Negócio: <span className="text-white">{business.name || '—'}</span></span>
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

      {/* MODAL ATRIBUIR CADEIRA */}
      {showAssignModal && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#0d0d0d] border border-[rgba(255,215,0,0.25)] rounded-[24px] max-w-md w-full p-6 space-y-6 text-left">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-sm font-black uppercase tracking-wider text-[#D4AF37]">Atribuir Cadeira</h3>
                <p className="text-[9px] text-[#AFAFAF] mt-0.5">Selecione uma cadeira disponível para a reserva de {showAssignModal.customerName}.</p>
              </div>
              <button
                onClick={() => setShowAssignModal(null)}
                className="w-8 h-8 rounded-full bg-neutral-900 border border-neutral-800 text-white flex items-center justify-center hover:bg-neutral-800 transition-all"
              >
                <X size={14} />
              </button>
            </div>

            <div className="bg-black/50 border border-neutral-900 p-4 rounded-xl space-y-2 text-xs text-neutral-400">
              <p>📅 <strong className="text-white">Data:</strong> {showAssignModal.date}</p>
              <p>🕒 <strong className="text-white">Hora:</strong> {showAssignModal.time}</p>
              <p>✂️ <strong className="text-white">Serviço:</strong> {showAssignModal.serviceName || (showAssignModal.preOrder && showAssignModal.preOrder.map((po: any) => po.dish?.name).join(', '))}</p>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {getAvailableChairsForResv(showAssignModal).map((chair) => (
                <div
                  key={chair.id}
                  onClick={() => confirmReservationWithChair(showAssignModal, chair.id)}
                  className="p-3 bg-black/40 border border-neutral-900 hover:border-[#D4AF37] rounded-xl flex justify-between items-center cursor-pointer transition-all hover:bg-black/80"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-neutral-900 border border-neutral-800 rounded-lg flex items-center justify-center text-[#D4AF37]">
                      <Scissors size={14} />
                    </div>
                    <div>
                      <p className="text-xs font-black text-white">{chair.chairName}</p>
                      <p className="text-[8px] text-[#AFAFAF] font-bold">Número {chair.chairNumber}</p>
                    </div>
                  </div>
                  <span className="text-[8px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full font-black uppercase">Disponível</span>
                </div>
              ))}
              {getAvailableChairsForResv(showAssignModal).length === 0 && (
                <div className="py-8 text-center text-xs text-neutral-500 font-bold uppercase tracking-wider bg-black/30 border border-neutral-900 rounded-xl">
                  Nenhuma cadeira disponível.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {/* CALENDAR MODAL - DARK LUXURY */}
      {showCalendarModal && (() => {
        const year = currentCalendarMonth.getFullYear();
        const month = currentCalendarMonth.getMonth();
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
        const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

        // Filter reservations strictly by this business
        const bizReservations = (business.reservations || []).filter((r: any) => {
          if (r.businessId && r.businessId !== business.id) return false;
          return true;
        });

        const getReservationsForDay = (day: number) => {
          const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          return bizReservations.filter((r: any) => {
            const rDate = r.date || r.reservationDate || r.dateTime?.split('T')[0] || '';
            return rDate === dateStr;
          });
        };

        const today = new Date();
        const isToday = (day: number) => today.getFullYear() === year && today.getMonth() === month && today.getDate() === day;

        return (
          <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/85 backdrop-blur-lg" onClick={() => setShowCalendarModal(false)}>
            <div
              className="bg-[#080808] border border-[rgba(212,175,55,0.3)] rounded-[28px] w-full max-w-2xl shadow-[0_0_60px_rgba(212,175,55,0.08)] text-left overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              {/* Calendar Header */}
              <div className="bg-gradient-to-r from-[#D4AF37]/10 to-transparent border-b border-[rgba(212,175,55,0.2)] p-6 flex justify-between items-center">
                <div>
                  <p className="text-[8px] font-black uppercase tracking-[0.3em] text-[#D4AF37]/60">{business.name || 'Barbearia'}</p>
                  <h2 className="text-xl font-black text-white mt-0.5">{monthNames[month]} {year}</h2>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setCurrentCalendarMonth(new Date(year, month - 1, 1))}
                    className="w-9 h-9 bg-black/60 border border-[rgba(212,175,55,0.2)] hover:border-[#D4AF37] text-[#D4AF37] rounded-xl flex items-center justify-center transition-all text-sm font-black"
                  >‹</button>
                  <button
                    onClick={() => setCurrentCalendarMonth(new Date())}
                    className="px-4 py-2 bg-[#D4AF37]/10 border border-[#D4AF37]/30 hover:bg-[#D4AF37]/20 text-[#D4AF37] rounded-xl text-[8px] font-black uppercase tracking-widest transition-all"
                  >Hoje</button>
                  <button
                    onClick={() => setCurrentCalendarMonth(new Date(year, month + 1, 1))}
                    className="w-9 h-9 bg-black/60 border border-[rgba(212,175,55,0.2)] hover:border-[#D4AF37] text-[#D4AF37] rounded-xl flex items-center justify-center transition-all text-sm font-black"
                  >›</button>
                  <button
                    onClick={() => setShowCalendarModal(false)}
                    className="w-9 h-9 bg-black/60 border border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-600 rounded-xl flex items-center justify-center transition-all"
                  ><X size={14} /></button>
                </div>
              </div>

              {/* Day Names Row */}
              <div className="grid grid-cols-7 border-b border-[rgba(212,175,55,0.1)]">
                {dayNames.map(d => (
                  <div key={d} className="py-3 text-center text-[8px] font-black uppercase tracking-widest text-[#D4AF37]/50">{d}</div>
                ))}
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 p-2 gap-1">
                {Array.from({ length: firstDay === 0 ? 6 : firstDay - 1 }).map((_, i) => (
                  <div key={`empty-${i}`} />
                ))}
                {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
                  const dayResvs = getReservationsForDay(day);
                  const confirmed = dayResvs.filter((r: any) => r.status === 'accepted').length;
                  const pending = dayResvs.filter((r: any) => r.status === 'pending').length;
                  const isDayToday = isToday(day);
                  return (
                    <div
                      key={day}
                      className={`rounded-xl p-2 min-h-[60px] text-left cursor-default transition-all hover:bg-white/5 border ${isDayToday ? 'border-[#D4AF37]/40 bg-[#D4AF37]/5' : 'border-transparent'}`}
                    >
                      <span className={`text-[10px] font-black block leading-none ${isDayToday ? 'text-[#D4AF37]' : 'text-white/60'}`}>{day}</span>
                      {dayResvs.length > 0 && (
                        <div className="mt-1 space-y-0.5">
                          {confirmed > 0 && (
                            <div className="w-full bg-emerald-500/15 border border-emerald-500/20 rounded px-1 py-0.5 flex items-center gap-1">
                              <span className="w-1 h-1 bg-emerald-400 rounded-full shrink-0" />
                              <span className="text-[7px] font-black text-emerald-400 truncate">{confirmed} conf.</span>
                            </div>
                          )}
                          {pending > 0 && (
                            <div className="w-full bg-amber-500/15 border border-amber-500/20 rounded px-1 py-0.5 flex items-center gap-1">
                              <span className="w-1 h-1 bg-amber-400 rounded-full shrink-0" />
                              <span className="text-[7px] font-black text-amber-400 truncate">{pending} pend.</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Legend */}
              <div className="border-t border-[rgba(212,175,55,0.1)] p-4 flex items-center gap-6">
                <div className="flex items-center gap-2"><span className="w-2 h-2 bg-emerald-400 rounded-full" /><span className="text-[9px] text-[#AFAFAF] font-bold uppercase">Confirmados</span></div>
                <div className="flex items-center gap-2"><span className="w-2 h-2 bg-amber-400 rounded-full" /><span className="text-[9px] text-[#AFAFAF] font-bold uppercase">Pendentes</span></div>
                <div className="flex items-center gap-2"><span className="w-2 h-2 bg-[#D4AF37] rounded-full" /><span className="text-[9px] text-[#AFAFAF] font-bold uppercase">Hoje</span></div>
                <span className="ml-auto text-[8px] text-neutral-600 font-bold uppercase">Total: {bizReservations.length} reservas</span>
              </div>
            </div>
          </div>
        );
      })()}

    </div>
  );
};

export default BarberNormalDashboard;
