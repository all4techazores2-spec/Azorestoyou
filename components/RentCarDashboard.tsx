import React, { useState, useEffect, useRef } from 'react';
import { 
  LayoutDashboard, Car, Calendar, CheckSquare, DollarSign, 
  Wrench, BarChart3, Star, Settings, LogOut, Users, Search, 
  Bell, Sun, Moon, AlertTriangle, Plus, Edit, Trash2, CheckCircle2, 
  X, Check, ChevronRight, FileText, Download, Shield, Eye, Info, HelpCircle,
  TrendingUp, CalendarDays, Key, FileCheck, Landmark, ChevronDown, CheckCircle, Clock,
  MessageSquare
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { API_BASE_URL } from '../config';

interface RentCarDashboardProps {
  business: any;
  onUpdateBusiness: (updated: any) => void;
  onLogout: () => void;
  language?: string;
}

type Tab = 'dashboard' | 'reservas' | 'frota' | 'clientes' | 'checkin' | 'pagamentos' | 'manutencao' | 'relatorios' | 'avaliacoes' | 'configuracoes' | 'database' | 'chat';

export default function RentCarDashboard({ business, onUpdateBusiness, onLogout, language = 'pt' }: RentCarDashboardProps) {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [darkMode, setDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [reservations, setReservations] = useState<any[]>(() => {
    return business.reservations || [];
  });

  const getNormalizedVehicles = (carsList: any[], resList: any[]) => {
    const today = new Date();
    return (carsList || []).map((c: any) => {
      const timeline = Array.from({ length: 7 }).map((_, i) => {
        const d = new Date(today);
        d.setDate(today.getDate() + i);
        
        const isReserved = (resList || []).some(res => {
          if (res.type !== 'car' || (res.status !== 'accepted' && res.status !== 'Confirmada')) return false;
          const resCarId = res.car?.id || res.carId;
          if (resCarId !== c.id) return false;
          if (!res.date) return false;
          
          const resStart = new Date(res.date);
          const startTime = new Date(resStart.getFullYear(), resStart.getMonth(), resStart.getDate()).getTime();
          const days = Number(res.days) || 3;
          const endTime = startTime + (days * 24 * 60 * 60 * 1000) - 1000;
          
          const targetTime = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
          return targetTime >= startTime && targetTime <= endTime;
        });

        if (isReserved) return 'reserved';
        return c.statusTimeline?.[i] || 'available';
      });

      let generalStatus = c.status || (c.isAvailable !== false ? 'Disponível' : 'Indisponível');
      if (timeline[0] === 'reserved') {
        generalStatus = 'Reservado';
      }

      return {
        ...c,
        statusTimeline: timeline,
        status: generalStatus
      };
    });
  };

  const [vehicles, setVehicles] = useState<any[]>(() => {
    return getNormalizedVehicles(business.cars || [], business.reservations || []);
  });

  const [clients, setClients] = useState<any[]>(() => {
    return business.clients || [];
  });

  const [maintenance, setMaintenance] = useState<any[]>(() => {
    return business.maintenance || [];
  });

  const [reviews, setReviews] = useState<any[]>(() => {
    return business.reviews || [];
  });

  // Notifications State
  const [notifications, setNotifications] = useState<any[]>(() => {
    return business.notifications || [];
  });

  useEffect(() => {
    if (business.reservations) {
      setReservations(business.reservations);
    }
    if (business.cars) {
      const normalized = getNormalizedVehicles(business.cars, business.reservations || []);
      setVehicles(normalized);
    }
    if (business.clients) setClients(business.clients);
    if (business.maintenance) setMaintenance(business.maintenance);
    if (business.reviews) setReviews(business.reviews);
    if (business.notifications) setNotifications(business.notifications);
  }, [business]);

  // Dynamic calculations for KPIs and statistics
  const totalVehicles = vehicles.length;
  const disponiveisCount = vehicles.filter(v => v.status === 'Disponível' || v.status === 'active' || !v.status).length;
  const alugadosCount = vehicles.filter(v => v.status === 'Alugado' || v.status === 'Reservado' || v.status === 'stopped').length;
  const manutencaoCount = vehicles.filter(v => v.status === 'Em Manutenção' || v.status === 'Manutenção' || v.status === 'maintenance').length;
  
  // Format today's date to match dd/mm/yyyy
  const formatToday = (d: Date) => {
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };
  const todayFormatted = formatToday(new Date());

  const reservationsHoje = reservations.filter(r => {
    if (!r.start) return false;
    return r.start.includes(todayFormatted) && r.status !== 'Cancelada';
  }).length;

  const receitaHoje = reservations.reduce((acc, r) => {
    if (r.start && r.start.includes(todayFormatted) && r.status !== 'Cancelada') {
      return acc + (Number(r.value) || 0);
    }
    return acc;
  }, 0);

  const taxaOcupacao = totalVehicles > 0 ? Math.round((alugadosCount / totalVehicles) * 100) : 0;
  const disponivelPct = totalVehicles > 0 ? Math.round((disponiveisCount / totalVehicles) * 100) : 0;

  // Count island reservations dynamically
  const islandResCounts = {
    'São Miguel': reservations.filter(r => (r.island || business.island || 'PDL') === 'PDL' || (r.island || '').includes('Miguel')).length,
    'Terceira': reservations.filter(r => (r.island || '') === 'TER' || (r.island || '').includes('Terceira')).length,
    'Pico': reservations.filter(r => (r.island || '') === 'PIX' || (r.island || '').includes('Pico')).length,
    'Faial': reservations.filter(r => (r.island || '') === 'HOR' || (r.island || '').includes('Faial')).length,
    'Outras': reservations.filter(r => !['PDL', 'TER', 'PIX', 'HOR', 'São Miguel', 'Terceira', 'Pico', 'Faial'].some(isl => (r.island || '').includes(isl) || r.island === isl)).length,
  };
  const totalRes = reservations.length;
  
  const smPct = totalRes > 0 ? Math.round((islandResCounts['São Miguel'] / totalRes) * 100) : 0;
  const terPct = totalRes > 0 ? Math.round((islandResCounts['Terceira'] / totalRes) * 100) : 0;
  const picPct = totalRes > 0 ? Math.round((islandResCounts['Pico'] / totalRes) * 100) : 0;
  const faiPct = totalRes > 0 ? Math.round((islandResCounts['Faial'] / totalRes) * 100) : 0;
  const outPct = totalRes > 0 ? Math.round((islandResCounts['Outras'] / totalRes) * 100) : 0;

  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [showNewResModal, setShowNewResModal] = useState(false);

  // Active Modals States
  const [editingRes, setEditingRes] = useState<any | null>(null);
  const [editingVeh, setEditingVeh] = useState<any | null>(null);
  const [showAddVeh, setShowAddVeh] = useState(false);
  const [selectedResDetails, setSelectedResDetails] = useState<any | null>(null);

  const [isUploading, setIsUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    if (editingVeh) {
      setImageUrl(editingVeh.image || '');
    } else {
      setImageUrl('');
    }
  }, [editingVeh, showAddVeh]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    const formData = new FormData();
    formData.append('restaurantId', business.id);
    formData.append('type', 'main');
    formData.append('image', file);
    try {
      const response = await fetch(`${API_BASE_URL}/api/upload`, {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) throw new Error('Falha no upload');
      const data = await response.json();
      setImageUrl(data.url);
    } catch (err) {
      console.error(err);
      alert('Erro ao fazer upload da imagem.');
    } finally {
      setIsUploading(false);
    }
  };
  
  // Category Filters
  const [fleetFilter, setFleetFilter] = useState('Todos');

  // Check-In / Check-Out Active Action
  const [activeCheckFlow, setActiveCheckFlow] = useState<'in' | 'out' | null>(null);
  const [selectedCheckRes, setSelectedCheckRes] = useState<any | null>(null);
  const [damageLog, setDamageLog] = useState<string[]>([]);
  const [photoMockList, setPhotoMockList] = useState<string[]>([]);
  const [deliveryConfirmed, setDeliveryConfirmed] = useState(false);

  // Signature Pad Canvas Ref
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  // Syncing layout structures whenever list changes
  const saveToSystem = (updatedCars: any[]) => {
    const processedCars = updatedCars.map(c => ({
      ...c,
      // Derive isAvailable from status; if no status, fall back to existing isAvailable (default true)
      isAvailable: c.status ? c.status === 'Disponível' : (c.isAvailable !== false)
    }));
    const updatedBiz = { ...business, cars: processedCars };
    onUpdateBusiness(updatedBiz);
  };

  const updateReservationStatus = async (resId: string, newStatus: string, checkinTime?: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/reservations/${resId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, checkinTime })
      });
      if (!response.ok) throw new Error('Falha ao atualizar estado da reserva');
      
      const updatedResList = reservations.map(r => r.id === resId ? { ...r, status: newStatus, checkinTime: checkinTime || r.checkinTime } : r);
      setReservations(updatedResList);
      
      const normalizedVehicles = getNormalizedVehicles(vehicles, updatedResList);
      setVehicles(normalizedVehicles);

      const updatedBiz = { ...business, reservations: updatedResList, cars: normalizedVehicles };
      onUpdateBusiness(updatedBiz);
    } catch (err: any) {
      console.error(err);
      alert('Erro ao atualizar estado da reserva: ' + err.message);
    }
  };

  // Toggle the status of a vehicle for a specific day
  const toggleVehicleDayStatus = (vehicleId: string, dayIndex: number) => {
    const updatedVehicles = vehicles.map(v => {
      if (v.id === vehicleId) {
        const timeline = [...(v.statusTimeline || ['available', 'available', 'available', 'available', 'available', 'available', 'available'])];
        const current = timeline[dayIndex];
        let next = 'available';
        if (current === 'available') next = 'reserved';
        else if (current === 'reserved') next = 'occupied';
        else if (current === 'occupied') next = 'maintenance';
        else next = 'available';
        timeline[dayIndex] = next;

        // Sync main vehicle status with today's status (index 0)
        let generalStatus = 'Disponível';
        if (timeline[0] === 'occupied') generalStatus = 'Alugado';
        else if (timeline[0] === 'reserved') generalStatus = 'Reservado';
        else if (timeline[0] === 'maintenance') generalStatus = 'Em Manutenção';

        return { ...v, statusTimeline: timeline, status: generalStatus };
      }
      return v;
    });

    setVehicles(updatedVehicles);
    saveToSystem(updatedVehicles);
  };

  const getTimelineDays = () => {
    const days = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      if (i === 0) days.push('Hoje');
      else if (i === 1) days.push('Amanhã');
      else {
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        days.push(`${day}/${month}`);
      }
    }
    return days;
  };
  const timelineDays = getTimelineDays();

  const parseResDate = (dateStr: string) => {
    if (!dateStr) return new Date();
    if (dateStr.includes('-')) {
      return new Date(dateStr);
    }
    if (dateStr.includes('/')) {
      const parts = dateStr.split(' ')[0].split('/');
      if (parts.length === 3) {
        return new Date(Number(parts[2]), Number(parts[1]) - 1, Number(parts[0]));
      }
    }
    return new Date(dateStr);
  };

  // Canvas Handlers
  useEffect(() => {
    if (activeCheckFlow && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2.5;
        ctx.lineCap = 'round';
      }
    }
  }, [activeCheckFlow]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    const pos = getEventCoords(e, canvas);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const pos = getEventCoords(e, canvas);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearSignature = () => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  const getEventCoords = (e: any, canvas: HTMLCanvasElement) => {
    const rect = canvas.getBoundingClientRect();
    if (e.touches && e.touches.length > 0) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top
      };
    }
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  // Car damage hotspots
  const damagePoints = [
    { id: 'f-bumper', label: 'Parachoques Frontal', x: '50%', y: '12%' },
    { id: 'windshield', label: 'Pára-brisas', x: '50%', y: '33%' },
    { id: 'f-left-door', label: 'Porta Condutor', x: '25%', y: '48%' },
    { id: 'f-right-door', label: 'Porta Acompanhante', x: '75%', y: '48%' },
    { id: 'r-left-door', label: 'Porta Trás Esq.', x: '25%', y: '68%' },
    { id: 'r-right-door', label: 'Porta Trás Dir.', x: '75%', y: '68%' },
    { id: 'r-bumper', label: 'Parachoques Traseiro', x: '50%', y: '88%' }
  ];

  const toggleDamage = (zone: string) => {
    setDamageLog(prev => 
      prev.includes(zone) ? prev.filter(z => z !== zone) : [...prev, zone]
    );
  };

  const triggerPhotoUpload = () => {
    const mockPhotos = [
      'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=400&q=80',
      'https://images.unsplash.com/photo-1506015391300-4802dc74de2e?auto=format&fit=crop&w=400&q=80',
      'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=400&q=80'
    ];
    const randomImg = mockPhotos[Math.floor(Math.random() * mockPhotos.length)];
    setPhotoMockList(prev => [...prev, randomImg]);
  };

  return (
    <div className={`min-h-screen font-sans flex transition-colors duration-300 ${darkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-800'}`}>
      
      {/* ── SIDEBAR MENU (Navy Background from print2) ── */}
      <aside className="w-72 flex flex-col bg-[#0D1527] text-white shrink-0 shadow-2xl relative z-40 border-r border-slate-800">
        {/* Logo Section */}
        <div className="p-6 flex items-center gap-3 border-b border-slate-800/80">
          <div className="w-10 h-10 bg-[#3B82F6] rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20 shrink-0">
            <Car size={22} className="stroke-[2.5]" />
          </div>
          <div>
            <h1 className="font-extrabold text-sm tracking-widest text-white uppercase leading-none">Açores</h1>
            <p className="text-[10px] uppercase tracking-wider text-blue-400 font-bold mt-1">Rent a Car</p>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {([
            { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
            { id: 'reservas', label: 'Reservas', icon: <Calendar size={18} /> },
            { id: 'frota', label: 'Frota', icon: <Car size={18} /> },
            { id: 'clientes', label: 'Clientes', icon: <Users size={18} /> },
            { id: 'chat', label: 'Chat de Emergência', icon: <MessageSquare size={18} /> },
            { id: 'checkin', label: 'Check-In / Check-Cut', icon: <CheckSquare size={18} /> },
            { id: 'pagamentos', label: 'Pagamentos', icon: <DollarSign size={18} /> },
            { id: 'manutencao', label: 'Manutenção', icon: <Wrench size={18} /> },
            { id: 'relatorios', label: 'Relatórios', icon: <FileText size={18} /> },
            { id: 'avaliacoes', label: 'Avaliações', icon: <Star size={18} /> },
            { id: 'notifications', label: 'Notificações', icon: <Bell size={18} />, count: notifications.filter((n: any) => !n.read).length },
            { id: 'configuracoes', label: 'Configurações', icon: <Settings size={18} /> }
          ] as const).map((item) => (
            <button
              key={item.id}
              onClick={() => {
                if (item.id === 'notifications') {
                  setShowNotifDropdown(!showNotifDropdown);
                  return;
                }
                setActiveTab(item.id);
                setActiveCheckFlow(null);
                setSelectedCheckRes(null);
                setDamageLog([]);
                setPhotoMockList([]);
                setDeliveryConfirmed(false);
              }}
              className={`w-full flex items-center justify-between p-3 rounded-xl text-xs font-semibold tracking-wider transition-all duration-200 group ${
                activeTab === item.id 
                  ? 'bg-[#1070e6] text-white shadow-lg shadow-blue-500/20' 
                  : 'hover:bg-slate-800/50 text-slate-400 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <span className={activeTab === item.id ? 'text-white' : 'text-slate-500 group-hover:text-white'}>{item.icon}</span>
                <span>{item.label}</span>
              </div>
              {('count' in item) && item.count && item.count > 0 ? (
                <span className="bg-red-500 text-white text-[9px] font-black px-2 py-0.5 rounded-full">{item.count}</span>
              ) : null}
            </button>
          ))}
        </nav>

        {/* Bottom Card - Azores landscape matching print2 */}
        <div className="p-4 m-4 rounded-2xl overflow-hidden relative h-32 bg-slate-800 flex items-end shadow-inner border border-slate-700/50">
          <img 
            src="https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=400&q=80" 
            alt="Açores" 
            className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-luminosity hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0D1527] via-slate-900/40 to-transparent" />
          <div className="relative z-10">
            <p className="text-[11px] font-bold text-white leading-tight">Conectando pessoas aos Açores</p>
          </div>
        </div>

        {/* Admin Info */}
        <div className="p-4 border-t border-slate-850 flex items-center justify-between">
          <button 
            onClick={onLogout}
            className="w-full py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all active:scale-95 border border-red-500/25"
          >
            <LogOut size={12} /> Terminar Sessão
          </button>
        </div>
      </aside>

      {/* ── MAIN WORKSPACE ── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        
        {/* TOP HEADER (White theme with search, notification, dark mode, avatar and blue reservation button) */}
        <header className={`sticky top-0 h-20 border-b flex items-center justify-between px-8 z-30 transition-colors duration-300 ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} backdrop-blur-md`}>
          <div>
            <h1 className="font-extrabold text-lg tracking-tight capitalize">{activeTab}</h1>
            <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Bem-vindo(a) ao painel administrativo</p>
          </div>

          {/* Search bar centered */}
          <div className="flex-1 max-w-md mx-8">
            <div className={`flex items-center gap-2.5 px-4 py-2 rounded-xl border text-xs transition-all ${darkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
              <input 
                type="text" 
                placeholder="Pesquisar reservas, clientes, veículos..." 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="bg-transparent border-none outline-none w-full text-slate-700 dark:text-slate-300 placeholder-slate-400"
              />
              <Search size={14} className="text-slate-400 shrink-0 cursor-pointer" />
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Notification bell with count */}
            <div className="relative">
              <button 
                onClick={() => setShowNotifDropdown(!showNotifDropdown)}
                className={`p-2.5 rounded-xl border relative transition-all active:scale-90 ${darkMode ? 'bg-slate-950 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-600'}`}
              >
                <Bell size={18} />
                {notifications.filter((n: any) => !n.read).length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[8px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                    {notifications.filter((n: any) => !n.read).length}
                  </span>
                )}
              </button>

              <AnimatePresence>
                {showNotifDropdown && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className={`absolute right-0 top-full mt-2 w-72 rounded-2xl border p-4 shadow-xl z-50 ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}
                  >
                    <div className="flex justify-between items-center pb-2 border-b border-slate-200/50 mb-2">
                      <span className="text-xs font-black uppercase tracking-wider">Notificações</span>
                      <button onClick={() => setNotifications(prev => prev.map(n => ({...n, read: true})))} className="text-[10px] text-blue-500 hover:underline">Marcar lidas</button>
                    </div>
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="text-[10px] text-slate-400 font-bold text-center py-4 uppercase tracking-wider">Sem notificações</div>
                      ) : (
                        notifications.map(n => (
                          <div key={n.id} className={`p-2 rounded-lg text-xs leading-normal ${!n.read ? 'bg-blue-500/10 font-bold border-l-2 border-blue-500' : 'opacity-60'}`}>
                            {n.text}
                          </div>
                        ))
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Theme Toggle */}
            <button 
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2.5 rounded-xl border transition-all active:scale-90 ${darkMode ? 'bg-slate-950 border-slate-800 text-amber-400' : 'bg-slate-50 border-slate-200 text-slate-600'}`}
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* Profile detail */}
            <div className="flex items-center gap-2 border-l border-slate-200 dark:border-slate-800 pl-4">
              <img 
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin" 
                alt="Avatar" 
                className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200"
              />
              <div className="hidden lg:block text-left text-xs leading-tight">
                <p className="font-extrabold text-slate-800 dark:text-white flex items-center gap-1">
                  Administrador <ChevronDown size={12} className="text-slate-400" />
                </p>
                <p className="text-[9px] text-slate-400 font-bold uppercase">Super Admin</p>
              </div>
            </div>

            {/* + Nova Reserva Button */}
            <button 
              onClick={() => setShowNewResModal(true)}
              className="px-4 py-2.5 bg-[#0066CC] hover:bg-blue-700 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all active:scale-95 shadow-md shadow-blue-500/10 flex items-center gap-1.5"
            >
              <Plus size={16} /> Nova Reserva
            </button>
          </div>
        </header>

        {/* ── TAB CONTENTS ── */}
        <main className="p-8 space-y-8 w-full mx-auto flex-1">
          
          {/* TAB 1: DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div className="space-y-8 animate-in fade-in duration-300">
              
              {/* KPIs PRINCIPAIS (Row of 7 stats with colored circles) */}
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                {[
                  { title: 'Total de Veículos', value: String(totalVehicles), icon: <Car size={18} />, color: 'bg-blue-500/10 text-blue-600', sub: 'Frota total configurada', type: 'simple' },
                  { title: 'Disponíveis', value: String(disponiveisCount), icon: <Check size={18} />, color: 'bg-emerald-500/10 text-emerald-600', sub: 'Disponíveis hoje', type: 'simple' },
                  { title: 'Alugados', value: String(alugadosCount), icon: <Key size={18} />, color: 'bg-amber-500/10 text-amber-600', sub: 'Em utilização', type: 'simple' },
                  { title: 'Manutenção', value: String(manutencaoCount), icon: <Wrench size={18} />, color: 'bg-rose-500/10 text-rose-600', sub: 'Em manutenção', type: 'simple' },
                  { title: 'Reservas Hoje', value: String(reservationsHoje), icon: <CalendarDays size={18} />, color: 'bg-purple-500/10 text-purple-600', sub: 'Hoje', type: 'simple' },
                  { title: 'Receita Hoje', value: `€${receitaHoje.toLocaleString('pt-PT')}`, icon: <DollarSign size={18} />, color: 'bg-green-500/10 text-green-600', sub: 'Hoje', type: 'simple' },
                  { title: 'Taxa Ocupação', value: `${taxaOcupacao}%`, icon: <TrendingUp size={18} />, color: 'bg-sky-500/10 text-sky-600', sub: 'Ocupação', type: 'simple' }
                ].map((kpi, idx) => (
                  <div key={idx} className={`p-4 rounded-2xl border flex flex-col justify-between space-y-3 transition-transform hover:scale-[1.02] ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm`}>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase tracking-wider text-slate-400 font-extrabold leading-none">{kpi.title}</span>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${kpi.color}`}>
                        {kpi.icon}
                      </div>
                    </div>
                    <div>
                      <span className="text-2xl font-black leading-none tracking-tight">{kpi.value}</span>
                      <p className={`text-[9px] font-bold mt-1 uppercase ${kpi.type === 'positive' ? 'text-green-500' : 'text-slate-400'}`}>
                        {kpi.sub}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* SECOND ROW: RESERVAS RECENTES & CALENDÁRIO VISUAL */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* 1. Reservas Recentes Table with Thumbnails */}
                <div className={`p-6 rounded-2xl border lg:col-span-2 space-y-6 ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm`}>
                  <div className="flex justify-between items-center">
                    <h3 className="font-extrabold uppercase text-xs tracking-widest text-slate-400">Reservas Recentes</h3>
                    <button onClick={() => setActiveTab('reservas')} className="text-xs text-blue-500 font-bold hover:underline">Ver todas</button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="border-b border-slate-200/50 text-slate-400 uppercase font-black tracking-wider">
                          <th className="pb-3">ID Reserva</th>
                          <th className="pb-3">Cliente</th>
                          <th className="pb-3">Veículo</th>
                          <th className="pb-3">Levantamento</th>
                          <th className="pb-3">Devolução</th>
                          <th className="pb-3">Valor</th>
                          <th className="pb-3">Estado</th>
                          <th className="pb-3 text-right">Ações</th>
                        </tr>
                      </thead>
                      <tbody>
                        {reservations.slice(0, 5).map((res, i) => {
                          const clientName = res.customerName || res.client || 'Cliente';
                          const vehicleName = res.car?.model || res.vehicle || 'Viatura';
                          const vehiclePlate = res.car?.plate || res.plate || '---';
                          const vehicleImage = res.car?.image || res.image || 'https://picsum.photos/100/70?random=1';
                          const startVal = res.date ? new Date(res.date).toLocaleDateString('pt-PT') : (res.start || '---');
                          const endVal = res.end || (res.date ? new Date(new Date(res.date).getTime() + (res.days || 3)*24*60*60*1000).toLocaleDateString('pt-PT') : '---');
                          const valueVal = Number(res.value) || (res.car ? res.car.pricePerDay * (res.days || 3) : 120);
                          const statusLabel = res.status === 'accepted' ? 'Confirmada' : res.status === 'pending' ? 'Pendente' : res.status === 'finished' ? 'Concluída' : res.status;
                          return (
                            <tr key={i} className="border-b border-slate-250/20 last:border-0 hover:bg-slate-500/5 transition-colors">
                              <td className="py-3 font-extrabold text-blue-500">{res.id}</td>
                              <td className="py-3 font-bold">{clientName}</td>
                              <td className="py-3">
                                <div className="flex items-center gap-2">
                                  <img src={vehicleImage} alt={vehicleName} className="w-10 h-7 rounded object-cover bg-slate-100 border" />
                                  <div>
                                    <span className="font-bold text-slate-800 dark:text-white block">{vehicleName}</span>
                                    <span className="text-[9px] font-black uppercase text-slate-400">{vehiclePlate}</span>
                                  </div>
                                </div>
                              </td>
                              <td className="py-3 text-slate-400">{startVal}</td>
                              <td className="py-3 text-slate-400">{endVal}</td>
                              <td className="py-3 font-black">€{valueVal.toFixed(2)}</td>
                              <td className="py-3">
                                <div className="flex items-center gap-1.5">
                                  <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${
                                    res.status === 'accepted' || res.status === 'Confirmada' ? 'bg-emerald-500/10 text-emerald-500' :
                                    res.status === 'pending' || res.status === 'Pendente' ? 'bg-amber-500/10 text-amber-500' :
                                    res.status === 'active' || res.status === 'Em Curso' ? 'bg-blue-500/10 text-blue-500' :
                                    res.status === 'finished' || res.status === 'Concluída' ? 'bg-slate-500/10 text-slate-450' : 'bg-red-500/10 text-red-500'
                                  }`}>
                                    {res.status === 'accepted' ? 'Confirmada' : res.status === 'pending' ? 'Pendente' : res.status === 'finished' ? 'Concluída' : res.status === 'cancelled' ? 'Cancelada' : res.status}
                                  </span>
                                  <select
                                    value={res.status === 'accepted' ? 'accepted' : res.status === 'pending' ? 'pending' : res.status === 'cancelled' ? 'cancelled' : res.status}
                                    onChange={(e) => updateReservationStatus(res.id, e.target.value as any)}
                                    className={`text-[9px] font-black uppercase border-0 bg-transparent cursor-pointer focus:outline-none focus:ring-0 ${
                                      darkMode ? 'text-slate-400 hover:text-slate-200' : 'text-slate-500 hover:text-slate-800'
                                    }`}
                                  >
                                    <option value="pending" className={darkMode ? 'bg-slate-900 text-amber-500' : 'bg-white text-amber-600'}>Pendente</option>
                                    <option value="accepted" className={darkMode ? 'bg-slate-900 text-emerald-500' : 'bg-white text-emerald-600'}>Confirmar</option>
                                    <option value="cancelled" className={darkMode ? 'bg-slate-900 text-red-500' : 'bg-white text-red-650'}>Cancelar</option>
                                  </select>
                                </div>
                              </td>
                              <td className="py-3 text-right space-x-1.5">
                                <button onClick={() => setSelectedResDetails(res)} className="p-1.5 hover:bg-blue-50 rounded text-blue-600 hover:text-blue-800" title="Ver Detalhes">
                                  <Eye size={14} />
                                </button>
                                <button onClick={() => setEditingRes(res)} className="p-1.5 hover:bg-amber-50 rounded text-amber-600 hover:text-amber-800" title="Editar">
                                  <Edit size={14} />
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* 2. Disponibilidade da Frota Timeline Bar matching print2 */}
                <div className={`p-6 rounded-2xl border space-y-6 ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm`}>
                  <div className="flex justify-between items-center">
                    <h3 className="font-extrabold uppercase text-xs tracking-widest text-slate-400">Disponibilidade da Frota</h3>
                    <div className="flex flex-wrap gap-1 text-[8px] font-black uppercase">
                      <span className="px-1.5 py-0.5 bg-emerald-500/10 text-emerald-500 rounded">Disponível</span>
                      <span className="px-1.5 py-0.5 bg-amber-500/10 text-amber-500 rounded">Reservado</span>
                      <span className="px-1.5 py-0.5 bg-red-500/10 text-red-500 rounded">Alugado</span>
                      <span className="px-1.5 py-0.5 bg-slate-500/10 text-slate-500 rounded">Manutenção</span>
                    </div>
                  </div>

                  <div className="space-y-3.5">
                    <div className="grid grid-cols-8 gap-1.5 border-b border-slate-200/50 pb-2 text-center text-[9px] font-black text-slate-400 uppercase">
                      <div className="text-left">Veículo</div>
                      {timelineDays.map((d, i) => (
                        <div key={i}>{d}</div>
                      ))}
                    </div>

                    {vehicles.length === 0 ? (
                      <div className="text-center text-[10px] text-slate-400 font-bold uppercase tracking-wider py-6">
                        Nenhum veículo adicionado à frota. Adicione carros na aba "Frota" para ver a disponibilidade.
                      </div>
                    ) : (
                      vehicles.map((v, idx) => {
                        const timeline = v.statusTimeline || ['available', 'available', 'available', 'available', 'available', 'available', 'available'];
                        return (
                          <div key={v.id || idx} className="grid grid-cols-8 gap-1.5 items-center text-center text-[10px]">
                            <div className="font-bold text-left truncate pr-1 text-slate-600 dark:text-slate-300">
                              {v.brand} {v.model}
                            </div>
                            {timeline.map((st: string, i: number) => (
                              <button 
                                key={i} 
                                type="button"
                                onClick={() => toggleVehicleDayStatus(v.id, i)}
                                className={`h-5 rounded-full transition-all cursor-pointer border-0 w-full hover:scale-105 active:scale-95 ${
                                  st === 'available' ? 'bg-emerald-500 hover:bg-emerald-600' : 
                                  st === 'reserved' ? 'bg-amber-500 hover:bg-amber-600' : 
                                  st === 'occupied' ? 'bg-rose-500 hover:bg-rose-600' : 'bg-slate-400 hover:bg-slate-500'
                                }`}
                                title={`Tocar para alterar: ${st.toUpperCase()}`}
                              />
                            ))}
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

              </div>

              {/* FEATURED FLEET (Frota em Destaque with real Unsplash thumbnails) */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-extrabold uppercase text-xs tracking-widest text-slate-400">Frota em Destaque</h3>
                  <button onClick={() => setActiveTab('frota')} className="text-xs text-blue-500 font-bold hover:underline">Ver toda frota</button>
                </div>

                <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                  {['Todos', 'Económicos', 'SUV', 'Elétricos', 'Luxo', 'Comerciais'].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setFleetFilter(cat)}
                      className={`px-3.5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider transition-all ${
                        fleetFilter === cat 
                          ? 'bg-[#0066CC] text-white' 
                          : darkMode ? 'bg-slate-900 text-slate-400 border border-slate-800' : 'bg-slate-100 text-slate-600 border border-slate-200'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {vehicles.filter(v =>
                    (fleetFilter === 'Todos' || v.category === fleetFilter || (fleetFilter === 'Económicos' && v.category === 'Económico'))
                  ).slice(0, 4).map((veh) => {
                    const cycleStatus = () => {
                      const order = ['Disponível', 'Reservado', 'Alugado', 'Em Manutenção'];
                      const next = order[(order.indexOf(veh.status) + 1) % order.length];
                      const updated = vehicles.map(v => v.id === veh.id ? { ...v, status: next } : v);
                      setVehicles(updated);
                      saveToSystem(updated);
                    };
                    return (
                      <div key={veh.id} className={`rounded-2xl border overflow-hidden transition-all duration-200 hover:shadow-lg ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm flex flex-col justify-between`}>
                        <div className="h-44 relative bg-slate-100 dark:bg-slate-950 overflow-hidden flex items-center justify-center">
                          <img src={veh.image} alt={veh.model} className="w-full h-full object-cover" />
                          <button
                            onClick={cycleStatus}
                            title="Tocar para alterar disponibilidade"
                            className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider cursor-pointer transition-all active:scale-95 hover:opacity-80 ${
                              veh.status === 'Disponível' ? 'bg-emerald-500 text-white' :
                              veh.status === 'Reservado' ? 'bg-amber-500 text-white' :
                              veh.status === 'Alugado' ? 'bg-rose-500 text-white' : 'bg-slate-500 text-white'
                            }`}
                          >
                            {veh.status || 'Disponível'}
                          </button>
                        </div>
                        <div className="p-4 space-y-3">
                          <div>
                            <p className="text-[10px] font-extrabold uppercase text-blue-500 tracking-wider leading-none">{veh.category}</p>
                            <h4 className="font-extrabold text-sm text-slate-800 dark:text-white mt-1 leading-none">{veh.brand} {veh.model}</h4>
                          </div>
                          <div className="flex justify-between items-center text-[10px] text-slate-400 font-bold border-t border-slate-200/50 pt-2 uppercase">
                            <span>Plate: {veh.plate}</span>
                            <span>Gear: {veh.gearbox}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* THIRD ROW: ENTREGAS, DEVOLUÇÕES & ALERTAS */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Entregas Hoje */}
                <div className={`p-6 rounded-2xl border space-y-4 ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm`}>
                  <div className="flex justify-between items-center border-b pb-2 border-slate-200/50">
                    <h3 className="font-extrabold uppercase text-xs tracking-widest text-slate-400">Próximas Entregas</h3>
                    <button onClick={() => setActiveTab('checkin')} className="text-[10px] text-blue-500 font-bold">Ver todas</button>
                  </div>
                  <div className="space-y-3">
                    {(() => {
                      const todayStart = new Date();
                      todayStart.setHours(0,0,0,0);
                      const proximasEntregas = reservations.filter(r => {
                        if (r.status === 'cancelled' || r.status === 'Cancelada' || r.status === 'finished' || r.status === 'Concluída' || r.status === 'active' || r.status === 'Em Curso') return false;
                        const dateVal = r.date || r.start;
                        if (!dateVal) return false;
                        const parsedDate = parseResDate(dateVal);
                        parsedDate.setHours(0,0,0,0);
                        return parsedDate.getTime() >= todayStart.getTime();
                      }).sort((a, b) => parseResDate(a.date || a.start).getTime() - parseResDate(b.date || b.start).getTime());

                      if (proximasEntregas.length === 0) {
                        return (
                          <div className="text-center py-6 text-slate-400">
                            <CalendarDays size={28} className="mx-auto mb-2 opacity-30" />
                            <p className="text-xs font-bold">Sem entregas agendadas</p>
                          </div>
                        );
                      }
                      return proximasEntregas.slice(0, 5).map((res: any, idx: number) => {
                        const dateText = res.date ? new Date(res.date).toLocaleDateString('pt-PT') : (res.start?.split(' ')[0] || '—');
                        return (
                          <div key={idx} className="flex items-center justify-between p-3 bg-slate-500/5 rounded-xl border border-slate-200/10">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-600">
                                <Clock size={16} />
                              </div>
                              <div>
                                <p className="font-extrabold text-xs leading-none">{res.customerName || res.client || 'Cliente'}</p>
                                <span className="text-[10px] text-slate-400 font-bold uppercase">{res.car?.model || res.vehicle || '—'} · {dateText}</span>
                              </div>
                            </div>
                            <button
                              onClick={() => {
                                setSelectedCheckRes(res);
                                setActiveCheckFlow('in');
                                setActiveTab('checkin');
                              }}
                              className="px-3 py-1.5 bg-[#0066CC] hover:bg-blue-600 text-white rounded-lg text-[9px] font-black uppercase tracking-widest transition-all active:scale-95"
                            >
                              Check-In
                            </button>
                          </div>
                        );
                      });
                    })()}
                  </div>
                </div>

                {/* Devoluções Hoje */}
                <div className={`p-6 rounded-2xl border space-y-4 ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm`}>
                  <div className="flex justify-between items-center border-b pb-2 border-slate-200/50">
                    <h3 className="font-extrabold uppercase text-xs tracking-widest text-slate-400">Próximas Devoluções</h3>
                    <button onClick={() => setActiveTab('checkin')} className="text-[10px] text-blue-500 font-bold">Ver todas</button>
                  </div>
                  <div className="space-y-3">
                    {(() => {
                      const todayStart = new Date();
                      todayStart.setHours(0,0,0,0);
                      const proximasDevolucoes = reservations.filter(r => {
                        if (r.status === 'cancelled' || r.status === 'Cancelada' || r.status === 'finished' || r.status === 'Concluída' || r.status === 'pending' || r.status === 'Pendente') return false;
                        const dateVal = r.end || r.date;
                        if (!dateVal) return false;
                        const parsedDate = parseResDate(dateVal);
                        parsedDate.setHours(0,0,0,0);
                        return parsedDate.getTime() >= todayStart.getTime();
                      }).sort((a, b) => parseResDate(a.end || a.date).getTime() - parseResDate(b.end || b.date).getTime());

                      if (proximasDevolucoes.length === 0) {
                        return (
                          <div className="text-center py-6 text-slate-400">
                            <CalendarDays size={28} className="mx-auto mb-2 opacity-30" />
                            <p className="text-xs font-bold">Sem devoluções agendadas</p>
                          </div>
                        );
                      }
                      return proximasDevolucoes.slice(0, 5).map((res: any, idx: number) => {
                        const dateText = res.end ? (res.end.includes('/') ? res.end.split(' ')[0] : new Date(res.end).toLocaleDateString('pt-PT')) : '—';
                        return (
                          <div key={idx} className="flex items-center justify-between p-3 bg-slate-500/5 rounded-xl border border-slate-200/10">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-600">
                                <Clock size={16} />
                              </div>
                              <div>
                                <p className="font-extrabold text-xs leading-none">{res.customerName || res.client || 'Cliente'}</p>
                                <span className="text-[10px] text-slate-400 font-bold uppercase">{res.car?.model || res.vehicle || '—'} · {dateText}</span>
                              </div>
                            </div>
                            <button
                              onClick={() => {
                                setSelectedCheckRes(res);
                                setActiveCheckFlow('out');
                                setActiveTab('checkin');
                              }}
                              className="px-3 py-1.5 bg-[#0066CC] hover:bg-blue-600 text-white rounded-lg text-[9px] font-black uppercase tracking-widest transition-all active:scale-95"
                            >
                              Check-Out
                            </button>
                          </div>
                        );
                      });
                    })()}
                  </div>
                </div>

                {/* Alertas Panel */}
                <div className={`p-6 rounded-2xl border space-y-4 ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm`}>
                  <div className="flex justify-between items-center border-b pb-2 border-slate-200/50">
                    <h3 className="font-extrabold uppercase text-xs tracking-widest text-slate-400">Alertas</h3>
                    <span className="text-[10px] text-slate-400 font-bold hover:underline cursor-pointer">Ver todas</span>
                  </div>
                  <div className="space-y-2">
                    {[
                      { type: 'Seguro a expirar', count: '3 veículos', color: 'bg-rose-50 border-rose-100 text-rose-800 dark:bg-rose-950/20 dark:border-rose-900/40 dark:text-rose-400' },
                      { type: 'Inspeção pendente', count: '5 veículos', color: 'bg-amber-50 border-amber-100 text-amber-800 dark:bg-amber-950/20 dark:border-amber-900/40 dark:text-amber-450' },
                      { type: 'Manutenção necessária', count: '2 veículos', color: 'bg-orange-50 border-orange-100 text-orange-800 dark:bg-orange-950/20 dark:border-orange-900/40 dark:text-orange-400' },
                      { type: 'Pagamentos pendentes', count: '4 reservas', color: 'bg-blue-50 border-blue-100 text-blue-800 dark:bg-blue-950/20 dark:border-blue-900/40 dark:text-blue-400' }
                    ].map((alert, idx) => (
                      <div key={idx} className={`flex items-center justify-between p-3 rounded-xl border ${alert.color} text-xs font-bold leading-none`}>
                        <div className="flex items-center gap-2">
                          <AlertTriangle size={14} className="shrink-0" />
                          <span>{alert.type}</span>
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-wider">{alert.count}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* ANALYTICS SECTION */}
              <div className={`p-6 rounded-2xl border space-y-8 ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm`}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  
                  {/* Receita Mensal Area Chart */}
                  <div className="space-y-4">
                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Receita Mensal</p>
                    <div className="h-44 w-full bg-slate-500/5 rounded-2xl border border-slate-200/10 p-4 relative flex flex-col justify-between">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-xl font-black text-slate-800 dark:text-white">€24.580</p>
                          <span className="text-[9px] text-green-500 font-bold">Junho 2024</span>
                        </div>
                      </div>
                      <div className="flex-1 w-full relative">
                        <svg viewBox="0 0 100 35" className="w-full h-full text-blue-500 fill-current opacity-20 absolute bottom-0 left-0">
                          <path d="M 0 35 L 0 25 Q 15 15 30 20 T 60 10 L 80 5 L 100 8 L 100 35 Z" />
                        </svg>
                        <svg viewBox="0 0 100 35" className="w-full h-full text-blue-500 fill-none stroke-current stroke-2 absolute bottom-0 left-0">
                          <path d="M 0 25 Q 15 15 30 20 T 60 10 L 80 5 L 100 8" />
                          <circle cx="80" cy="5" r="2" className="fill-blue-600 stroke-white stroke-2 animate-pulse" />
                        </svg>
                      </div>
                      <div className="flex justify-between text-[8px] font-extrabold text-slate-400 uppercase mt-1">
                        <span>Jan</span><span>Fev</span><span>Mar</span><span>Abr</span><span>Mai</span><span>Jun</span><span>Jul</span><span>Ago</span><span>Set</span><span>Out</span><span>Nov</span><span>Dez</span>
                      </div>
                    </div>
                  </div>

                  {/* Reservas por Mês Bar Chart */}
                  <div className="space-y-4">
                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Reservas por Mês</p>
                    <div className="h-44 w-full bg-slate-500/5 rounded-2xl border border-slate-200/10 p-4 flex flex-col justify-between">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="text-xl font-black text-slate-800 dark:text-white">76</p>
                          <span className="text-[9px] text-slate-450 font-bold">Média de Reservas</span>
                        </div>
                      </div>
                      <div className="flex-1 flex items-end justify-between gap-1.5 h-full">
                        {[18, 30, 42, 50, 48, 76, 95, 82, 60, 48, 30, 20].map((val, i) => (
                          <div key={i} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                            <div 
                              className="bg-blue-600 rounded-t-full w-full transition-all duration-500" 
                              style={{ height: `${(val / 110) * 80}%` }}
                              title={`${val} reservas`}
                            />
                          </div>
                        ))}
                      </div>
                      <div className="flex justify-between text-[8px] font-extrabold text-slate-400 uppercase mt-2">
                        <span>Jan</span><span>Fev</span><span>Mar</span><span>Abr</span><span>Mai</span><span>Jun</span><span>Jul</span><span>Ago</span><span>Set</span><span>Out</span><span>Nov</span><span>Dez</span>
                      </div>
                    </div>
                  </div>

                  {/* Taxa de Ocupação Radial Gauge */}
                  <div className="space-y-4">
                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Taxa de Ocupação</p>
                    <div className="h-44 w-full bg-slate-500/5 rounded-2xl border border-slate-200/10 p-4 flex flex-col items-center justify-center relative">
                      <svg className="w-24 h-24 transform -rotate-90">
                        <circle cx="48" cy="48" r="40" className="stroke-slate-200 dark:stroke-slate-800" strokeWidth="8" fill="transparent" />
                        <circle 
                          cx="48" 
                          cy="48" 
                          r="40" 
                          className="stroke-blue-600" 
                          strokeWidth="8" 
                          fill="transparent" 
                          strokeDasharray="251.2" 
                          strokeDashoffset={251.2 - (251.2 * taxaOcupacao) / 100}
                        />
                      </svg>
                      <div className="absolute flex flex-col items-center">
                        <span className="text-xl font-black">{taxaOcupacao}%</span>
                        <span className="text-[8px] font-black text-slate-400 uppercase">Ocupação</span>
                      </div>
                      <div className="w-full flex justify-around text-[9px] font-extrabold text-slate-500 uppercase mt-2 border-t border-slate-200/50 pt-2">
                        <div className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-emerald-500" /> Disponível ({disponivelPct}%)</div>
                        <div className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-blue-600" /> Ocupado ({taxaOcupacao}%)</div>
                      </div>
                    </div>
                  </div>

                  {/* Reservas por Ilha Pie/Doughnut Chart matching print2 */}
                  <div className="space-y-4">
                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Reservas por Ilha</p>
                    <div className="h-44 w-full bg-slate-500/5 rounded-2xl border border-slate-200/10 p-4 flex items-center justify-around">
                      <div className="relative w-24 h-24 rounded-full border-[10px] border-slate-200 dark:border-slate-800 flex items-center justify-center">
                        <div className="absolute inset-0 rounded-full border-[10px] border-transparent border-t-blue-600 border-r-indigo-500 border-b-sky-400 transform rotate-45" />
                        <div className="text-center">
                          <span className="text-[10px] font-black text-slate-400 uppercase">Ilhas</span>
                        </div>
                      </div>
                      <div className="text-[9px] space-y-1 font-extrabold uppercase text-slate-500 leading-tight">
                        <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded bg-blue-600" /> São Miguel ({smPct}%)</div>
                        <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded bg-indigo-500" /> Terceira ({terPct}%)</div>
                        <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded bg-sky-400" /> Pico ({picPct}%)</div>
                        <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded bg-amber-500" /> Faial ({faiPct}%)</div>
                        <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded bg-slate-400" /> Outras ({outPct}%)</div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>

            </div>
          )}

          {/* TAB 2: RESERVAS */}
          {activeTab === 'reservas' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-black uppercase tracking-tight">Gestão de Reservas</h2>
                  <p className="text-slate-400 text-xs mt-1">Valide e controle o estado dos alugueres dos clientes.</p>
                </div>
              </div>

              {/* Tabela de Reservas */}
              <div className={`p-6 rounded-2xl border space-y-4 ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm`}>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-slate-200/50 text-slate-400 uppercase font-black tracking-wider">
                        <th className="pb-3">ID Reserva</th>
                        <th className="pb-3">Cliente</th>
                        <th className="pb-3">Veículo</th>
                        <th className="pb-3">Levantamento</th>
                        <th className="pb-3">Devolução</th>
                        <th className="pb-3">Valor</th>
                        <th className="pb-3">Estado</th>
                        <th className="pb-3 text-right">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reservations.filter(r => {
                        const clientName = r.customerName || r.client || '';
                        const vehicleName = r.car?.model || r.vehicle || '';
                        const resId = r.id || '';
                        return clientName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                               vehicleName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                               resId.toLowerCase().includes(searchQuery.toLowerCase());
                      }).map((res, i) => {
                        const clientName = res.customerName || res.client || 'Cliente';
                        const vehicleName = res.car?.model || res.vehicle || 'Viatura';
                        const startDate = res.date ? new Date(res.date).toLocaleDateString('pt-PT') : (res.start || 'N/A');
                        const endDate = res.end || (res.date ? new Date(new Date(res.date).getTime() + (res.days || 3)*24*60*60*1000).toLocaleDateString('pt-PT') : 'N/A');
                        const priceValue = res.value || (res.car ? res.car.pricePerDay * (res.days || 3) : 120);
                        return (
                          <tr key={i} className="border-b border-slate-250/20 last:border-0 hover:bg-slate-500/5 transition-colors">
                            <td className="py-4 font-bold text-blue-500">{res.id}</td>
                            <td className="py-4 font-bold">{clientName}</td>
                            <td className="py-4 text-slate-500">{vehicleName}</td>
                            <td className="py-4">{startDate}</td>
                            <td className="py-4">{endDate}</td>
                            <td className="py-4 font-extrabold">€{priceValue.toFixed(2)}</td>
                            <td className="py-4">
                              <div className="flex items-center gap-1.5">
                                <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${
                                  res.status === 'accepted' || res.status === 'Confirmada' ? 'bg-emerald-500/10 text-emerald-500' :
                                  res.status === 'pending' || res.status === 'Pendente' ? 'bg-amber-500/10 text-amber-500' :
                                  res.status === 'active' || res.status === 'Em Curso' ? 'bg-blue-500/10 text-blue-500' :
                                  res.status === 'finished' || res.status === 'Concluída' ? 'bg-slate-500/10 text-slate-450' : 'bg-red-500/10 text-red-500'
                                }`}>
                                  {res.status === 'accepted' ? 'Confirmada' : res.status === 'pending' ? 'Pendente' : res.status === 'finished' ? 'Concluída' : res.status === 'cancelled' ? 'Cancelada' : res.status}
                                </span>
                                <select
                                  value={res.status === 'accepted' ? 'accepted' : res.status === 'pending' ? 'pending' : res.status === 'cancelled' ? 'cancelled' : res.status}
                                  onChange={(e) => updateReservationStatus(res.id, e.target.value as any)}
                                  className={`text-[9px] font-black uppercase border-0 bg-transparent cursor-pointer focus:outline-none focus:ring-0 ${
                                    darkMode ? 'text-slate-400 hover:text-slate-200' : 'text-slate-500 hover:text-slate-800'
                                  }`}
                                >
                                  <option value="pending" className={darkMode ? 'bg-slate-900 text-amber-500' : 'bg-white text-amber-600'}>Pendente</option>
                                  <option value="accepted" className={darkMode ? 'bg-slate-900 text-emerald-500' : 'bg-white text-emerald-600'}>Confirmar</option>
                                  <option value="cancelled" className={darkMode ? 'bg-slate-900 text-red-500' : 'bg-white text-red-650'}>Cancelar</option>
                                </select>
                              </div>
                            </td>
                            <td className="py-4 text-right space-x-1.5">
                              <button 
                                onClick={() => setSelectedResDetails(res)} 
                                className="px-2 py-1 bg-slate-500/10 hover:bg-slate-500/20 rounded-md text-[10px] font-bold"
                              >
                                Detalhes
                              </button>
                              {(res.status === 'pending' || res.status === 'Pendente') && (
                                <button 
                                  onClick={() => updateReservationStatus(res.id, 'accepted')}
                                  className="px-2 py-1 bg-emerald-500 text-white rounded-md text-[10px] font-bold hover:bg-emerald-600"
                                >
                                  Confirmar
                                </button>
                              )}
                              {res.status !== 'finished' && res.status !== 'Concluída' && res.status !== 'cancelled' && res.status !== 'Cancelada' && (
                                <button 
                                  onClick={() => updateReservationStatus(res.id, 'cancelled')}
                                  className="px-2 py-1 bg-red-500/10 text-red-500 rounded-md text-[10px] font-bold hover:bg-red-500/20"
                                >
                                  Cancelar
                                </button>
                              )}
                            </td>
                        </tr>
                      )})}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: FROTA */}
          {activeTab === 'frota' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-black uppercase tracking-tight">Frota de Veículos</h2>
                  <p className="text-slate-400 text-xs mt-1">Gerencie a disponibilidade, categoria e tarifas diárias.</p>
                </div>
                <button 
                  onClick={() => setShowAddVeh(true)}
                  className="px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-xs font-black uppercase tracking-widest transition-all active:scale-95 shadow-md shadow-blue-500/20 flex items-center gap-2"
                >
                  <Plus size={16} /> Adicionar Veículo
                </button>
              </div>

              {/* Categorias & Filtros */}
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {['Todos', 'Económicos', 'SUV', 'Elétricos', 'Luxo', 'Comerciais'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setFleetFilter(cat)}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                      fleetFilter === cat 
                        ? 'bg-[#0066CC] text-white' 
                        : darkMode ? 'bg-slate-900 text-slate-400 border border-slate-800' : 'bg-white text-slate-600 border border-slate-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Grid of Vehicles */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {vehicles.filter(v => 
                  (fleetFilter === 'Todos' || v.category === fleetFilter || (fleetFilter === 'Económicos' && v.category === 'Económico')) &&
                  ((v.brand?.toLowerCase() || '').includes(searchQuery.toLowerCase()) || (v.model?.toLowerCase() || '').includes(searchQuery.toLowerCase()) || (v.plate?.toLowerCase() || '').includes(searchQuery.toLowerCase()))
                ).map((veh) => (
                  <div key={veh.id} className={`rounded-2xl border overflow-hidden transition-all duration-200 hover:shadow-lg ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm`}>
                    <div className="h-48 relative overflow-hidden bg-slate-200">
                      <img src={veh.image} alt={veh.model} className="w-full h-full object-cover transition-transform duration-300 hover:scale-105" />
                      <button
                        onClick={() => {
                          const order = ['Disponível', 'Reservado', 'Alugado', 'Em Manutenção'];
                          const next = order[(order.indexOf(veh.status) + 1) % order.length];
                          const updated = vehicles.map(v => v.id === veh.id ? { ...v, status: next } : v);
                          setVehicles(updated);
                          saveToSystem(updated);
                        }}
                        title="Tocar para alterar disponibilidade"
                        className={`absolute top-4 right-4 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider cursor-pointer transition-all active:scale-95 hover:opacity-80 ${
                          veh.status === 'Disponível' ? 'bg-emerald-500 text-white' :
                          veh.status === 'Reservado' ? 'bg-amber-500 text-white' :
                          veh.status === 'Alugado' ? 'bg-blue-500 text-white' : 'bg-red-500 text-white'
                        }`}
                      >
                        {veh.status || 'Disponível'}
                      </button>
                    </div>
                    <div className="p-6 space-y-4">
                      <div>
                        <div className="flex justify-between items-start">
                          <h3 className="font-extrabold text-base leading-none">{veh.brand} {veh.model}</h3>
                          <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${darkMode ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>{veh.category}</span>
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 mt-1">Matrícula: {veh.plate} • Ano: {veh.year}</p>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-[10px] border-t border-slate-200/50 pt-3 opacity-80">
                        <div>🔒 Seguro: <span className="font-bold">{veh.insuranceExp}</span></div>
                        <div>🔧 Inspeção: <span className="font-bold">{veh.inspectionExp}</span></div>
                      </div>

                      <div className="flex justify-between items-center border-t border-slate-200/50 pt-3">
                        <button 
                          onClick={() => setEditingVeh(veh)}
                          className="text-xs text-blue-500 font-bold hover:underline flex items-center gap-1"
                        >
                          <Edit size={12} /> Editar
                        </button>
                        <button 
                          onClick={() => {
                            if (confirm('Tem a certeza que deseja remover este veículo?')) {
                              const updated = vehicles.filter(v => v.id !== veh.id);
                              setVehicles(updated);
                              saveToSystem(updated);
                              alert('Veículo removido com sucesso!');
                            }
                          }}
                          className="text-xs text-red-500 font-bold hover:underline flex items-center gap-1"
                        >
                          <Trash2 size={12} /> Remover
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: CLIENTES */}
          {activeTab === 'clientes' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-black uppercase tracking-tight">Fichas de Clientes</h2>
                <p className="text-slate-400 text-xs mt-1">Consulte os dados de contacto e cartas de condução associadas.</p>
              </div>

              <div className={`p-6 rounded-2xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm`}>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-slate-200/50 text-slate-400 uppercase font-black tracking-wider">
                        <th className="pb-3">Nome do Cliente</th>
                        <th className="pb-3">Email</th>
                        <th className="pb-3">Telefone</th>
                        <th className="pb-3">NIF / Contribuinte</th>
                        <th className="pb-3 text-right">Carta Condução</th>
                      </tr>
                    </thead>
                    <tbody>
                      {clients.filter(c => 
                        (c.name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) || 
                        (c.email?.toLowerCase() || '').includes(searchQuery.toLowerCase())
                      ).map((cli) => (
                        <tr key={cli.id} className="border-b border-slate-250/20 last:border-0 hover:bg-slate-500/5 transition-colors">
                          <td className="py-4 font-bold">{cli.name}</td>
                          <td className="py-4 text-slate-500">{cli.email}</td>
                          <td className="py-4">{cli.phone}</td>
                          <td className="py-4 font-mono">{cli.nif}</td>
                          <td className="py-4 text-right font-mono text-blue-500">{cli.license}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: CHECK-IN / CHECK-OUT */}
          {activeTab === 'checkin' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-black uppercase tracking-tight">Painel de Check-In / Check-Out</h2>
                <p className="text-slate-400 text-xs mt-1">Efetue vistorias a veículos, selecione danos interativos e assine no ecrã.</p>
              </div>

              {!activeCheckFlow ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Select a reservation for flow */}
                  <div className={`p-6 rounded-2xl border space-y-4 ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm`}>
                    <h3 className="font-extrabold text-sm uppercase">Iniciar Novo Processo</h3>
                    <p className="text-xs text-slate-400">Escolha uma das reservas confirmadas para iniciar o Check-In ou Check-Out da viatura.</p>
                    
                    <div className="space-y-3">
                      {reservations.filter(r => r.status !== 'Cancelada' && r.status !== 'Concluída').map((res) => {
                        const clientName = res.customerName || res.client || 'Cliente';
                        const vehicleName = res.car?.model || res.vehicle || 'Viatura';
                        return (
                          <div key={res.id} className="p-4 rounded-xl border border-slate-200/50 dark:border-slate-800 flex justify-between items-center text-xs">
                            <div>
                              <p className="font-bold">{clientName} ({res.id})</p>
                              <p className="text-slate-450 text-[10px] uppercase font-bold">{vehicleName}</p>
                            </div>
                          <div className="flex gap-2">
                            {res.status !== 'Em Curso' && (
                              <button 
                                onClick={() => {
                                  setSelectedCheckRes(res);
                                  setActiveCheckFlow('in');
                                  setDamageLog([]);
                                  setPhotoMockList([]);
                                  setDeliveryConfirmed(false);
                                }}
                                className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg font-black uppercase text-[9px] tracking-wider"
                              >
                                Check-In (Entregar)
                              </button>
                            )}
                            {res.status === 'Em Curso' && (
                              <button 
                                onClick={() => {
                                  setSelectedCheckRes(res);
                                  setActiveCheckFlow('out');
                                  setDamageLog([]);
                                  setPhotoMockList([]);
                                  setDeliveryConfirmed(false);
                                }}
                                className="px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-black uppercase text-[9px] tracking-wider"
                              >
                                Check-Out (Devolução)
                              </button>
                            )}
                            </div>
                          </div>
                        )})}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  
                  {/* Step details */}
                  <div className={`p-6 rounded-2xl border space-y-6 lg:col-span-2 ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm`}>
                    <div className="flex justify-between items-center border-b pb-3 border-slate-200/50">
                      <div>
                        <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${activeCheckFlow === 'in' ? 'bg-green-600 text-white' : 'bg-orange-500 text-white'}`}>
                          {activeCheckFlow === 'in' ? 'Check-In em Progresso' : 'Check-Out em Progresso'}
                        </span>
                        <h3 className="text-base font-black mt-2">Vistoria: {selectedCheckRes.client}</h3>
                      </div>
                      <button 
                        onClick={() => { setActiveCheckFlow(null); setSelectedCheckRes(null); }}
                        className="p-2 bg-slate-500/10 hover:bg-slate-500/20 text-slate-500 rounded-full"
                      >
                        <X size={16} />
                      </button>
                    </div>

                    {/* Interactive Hotspot Vehicle Damage Map */}
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-extrabold text-xs uppercase tracking-wider text-slate-400">1. Registar Danos no Veículo (Interativo)</h4>
                        <p className="text-[10px] text-slate-450 mt-1">Toque ou clique nos círculos correspondentes para assinalar mossas, riscos ou quebras na viatura.</p>
                      </div>

                      <div className="relative max-w-sm mx-auto h-96 border border-slate-200/10 rounded-2xl bg-slate-950 p-4 flex items-center justify-center overflow-hidden">
                        {/* Car diagram SVG (Top down perspective) */}
                        <svg className="w-48 h-80 text-slate-800 fill-slate-900 stroke-slate-700 stroke-2" viewBox="0 0 100 200">
                          {/* Body outline */}
                          <rect x="25" y="20" width="50" height="160" rx="15" />
                          {/* Windshield */}
                          <path d="M 30 65 L 70 65 L 65 80 L 35 80 Z" className="fill-slate-800" />
                          {/* Rear window */}
                          <path d="M 32 150 L 68 150 L 65 140 L 35 140 Z" className="fill-slate-800" />
                          {/* Headlights */}
                          <rect x="28" y="18" width="8" height="5" rx="1" className="fill-yellow-400 opacity-60" />
                          <rect x="64" y="18" width="8" height="5" rx="1" className="fill-yellow-400 opacity-60" />
                          {/* Wheels */}
                          <rect x="20" y="40" width="6" height="18" rx="2" className="fill-slate-900" />
                          <rect x="74" y="40" width="6" height="18" rx="2" className="fill-slate-900" />
                          <rect x="20" y="140" width="6" height="18" rx="2" className="fill-slate-900" />
                          <rect x="74" y="140" width="6" height="18" rx="2" className="fill-slate-900" />
                        </svg>

                        {/* Interactive dots overlay */}
                        {damagePoints.map((pt) => {
                          const isLogged = damageLog.includes(pt.id);
                          return (
                            <button
                              key={pt.id}
                              type="button"
                              onClick={() => toggleDamage(pt.id)}
                              className={`absolute w-7 h-7 rounded-full flex items-center justify-center font-bold text-[9px] transition-all border shadow-lg ${
                                isLogged 
                                  ? 'bg-red-600 border-red-500 text-white scale-110 animate-pulse' 
                                  : 'bg-white border-slate-300 text-slate-800 hover:scale-105'
                              }`}
                              style={{ left: pt.x, top: pt.y, transform: 'translate(-50%, -50%)' }}
                              title={pt.label}
                            >
                              {isLogged ? '✕' : '+'}
                            </button>
                          );
                        })}
                      </div>

                      {/* Damages Log */}
                      {damageLog.length > 0 && (
                        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl space-y-1">
                          <p className="text-[10px] font-black uppercase tracking-wider">Danos Selecionados ({damageLog.length}):</p>
                          <ul className="text-xs list-disc pl-4 font-bold">
                            {damageLog.map(id => (
                              <li key={id}>{damagePoints.find(p => p.id === id)?.label || id}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    {/* Photo capture mock */}
                    <div className="space-y-4 border-t border-slate-200/50 pt-5">
                      <div>
                        <h4 className="font-extrabold text-xs uppercase tracking-wider text-slate-400">2. Anexar Fotos de Diagnóstico</h4>
                        <p className="text-[10px] text-slate-450 mt-1">Carregue ou capture fotos detalhadas das zonas do veículo.</p>
                      </div>

                      <div className="flex flex-wrap gap-3">
                        {photoMockList.map((url, i) => (
                          <div key={i} className="w-20 h-20 rounded-xl border overflow-hidden relative group">
                            <img src={url} alt="diagnostico" className="w-full h-full object-cover" />
                            <button 
                              onClick={() => setPhotoMockList(p => p.filter((_, idx) => idx !== i))}
                              className="absolute inset-0 bg-red-600/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        ))}
                        <button 
                          onClick={triggerPhotoUpload}
                          className="w-20 h-20 rounded-xl border-2 border-dashed border-slate-200/30 flex flex-col items-center justify-center text-slate-450 hover:bg-slate-500/5 transition-all"
                        >
                          <Plus size={20} />
                          <span className="text-[8px] font-black uppercase mt-1">Nova Foto</span>
                        </button>
                      </div>
                    </div>

                  </div>

                  {/* Flow summary confirmation */}
                  <div className={`p-6 rounded-2xl border space-y-6 ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm`}>
                    <div>
                      <h4 className="font-extrabold text-xs uppercase tracking-wider text-slate-400">3. Assinatura do Cliente</h4>
                      <p className="text-[10px] text-slate-450 mt-1">Recolha a assinatura digital do titular abaixo.</p>
                    </div>

                    {/* Canvas HTML5 signature box */}
                    <div className="border border-slate-200/10 rounded-2xl overflow-hidden bg-white">
                      <canvas
                        ref={canvasRef}
                        width={300}
                        height={180}
                        onMouseDown={startDrawing}
                        onMouseMove={draw}
                        onMouseUp={stopDrawing}
                        onMouseLeave={stopDrawing}
                        onTouchStart={startDrawing}
                        onTouchMove={draw}
                        onTouchEnd={stopDrawing}
                        className="w-full cursor-crosshair bg-white"
                      />
                    </div>
                    <p className="text-[9px] text-center text-slate-400 italic">Assine dentro da caixa branca acima utilizando o rato ou dedo.</p>

                     <div className="space-y-3 border-t border-slate-200/50 pt-4">
                       {activeCheckFlow === 'in' && !deliveryConfirmed && (
                         <div className="space-y-2 text-left mb-4">
                           <label className="text-[10px] font-black uppercase text-slate-400">Hora de Check-In (Levantamento)</label>
                           <input 
                             type="time" 
                             id="checkinTimeInput"
                             defaultValue={new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                             className={`w-full p-3 border rounded-xl bg-transparent outline-none text-xs font-bold ${
                               darkMode ? 'border-slate-800 text-white' : 'border-slate-200 text-slate-800'
                             }`}
                           />
                         </div>
                       )}

                       {deliveryConfirmed ? (
                         <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-2xl flex items-center gap-3">
                           <CheckCircle2 size={24} />
                           <div>
                             <p className="text-xs font-black uppercase">Processo Concluído!</p>
                             <p className="text-[10px] opacity-80 mt-0.5">As informações foram guardadas nas coleções Firebase.</p>
                           </div>
                         </div>
                       ) : (
                         <button 
                           onClick={() => {
                             const checkinTimeInput = document.getElementById('checkinTimeInput') as HTMLInputElement;
                             const checkinTime = checkinTimeInput ? checkinTimeInput.value : '';
                             setDeliveryConfirmed(true);
                             
                             const dbStatus = activeCheckFlow === 'in' ? 'active' : 'finished';
                             updateReservationStatus(selectedCheckRes.id, dbStatus, checkinTime);
                             alert('Sucesso: Assinatura e dados salvos no servidor Azores4you (Firebase Ready)!');
                           }}
                           className="w-full py-4 bg-emerald-650 hover:bg-emerald-700 text-white rounded-2xl text-xs font-black uppercase tracking-widest transition-all active:scale-95 shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2"
                         >
                           <CheckCircle2 size={16} /> Confirmar Entrega
                         </button>
                       )}
                      
                      <button 
                        onClick={() => {
                          setActiveCheckFlow(null);
                          setSelectedCheckRes(null);
                        }}
                        className="w-full py-3 bg-slate-500/10 hover:bg-slate-500/20 rounded-2xl text-xs font-black uppercase tracking-widest transition-all text-center"
                      >
                        Voltar Atrás
                      </button>
                    </div>
                  </div>

                </div>
              )}
            </div>
          )}

          {/* TAB 6: PAGAMENTOS */}
          {activeTab === 'pagamentos' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-black uppercase tracking-tight">Registo de Pagamentos</h2>
                <p className="text-slate-400 text-xs mt-1">Acompanhe as transações financeiras e cauções dos clientes.</p>
              </div>

              <div className={`p-6 rounded-2xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm`}>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-slate-200/50 text-slate-400 uppercase font-black tracking-wider">
                        <th className="pb-3">Reserva</th>
                        <th className="pb-3">Cliente</th>
                        <th className="pb-3">Valor Total</th>
                        <th className="pb-3">Sinal Pago</th>
                        <th className="pb-3">Caução</th>
                        <th className="pb-3">Método</th>
                        <th className="pb-3 text-right">Estado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reservations.map((res, i) => {
                        const clientName = res.customerName || res.client || 'Cliente';
                        const priceValue = res.value || (res.car ? res.car.pricePerDay * (res.days || 3) : 120);
                        const payMethodLabel = res.paymentMethod === 'mbway' ? 'MBWay / Revolut' : (res.paymentMethod === 'points' ? 'Saldo Pontos' : 'Transferência IBAN');
                        return (
                          <tr key={i} className="border-b border-slate-250/20 last:border-0 hover:bg-slate-500/5 transition-colors">
                            <td className="py-4 font-bold text-blue-500">{res.id}</td>
                            <td className="py-4 font-bold">{clientName}</td>
                            <td className="py-4 font-extrabold">€{priceValue.toFixed(2)}</td>
                            <td className="py-4 text-emerald-500">€{(priceValue * 0.2).toFixed(2)}</td>
                            <td className="py-4">150.00€ (Caução)</td>
                            <td className="py-4">{payMethodLabel}</td>
                            <td className="py-4 text-right">
                              <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                                res.status === 'Cancelada' ? 'bg-red-500/10 text-red-500' : 'bg-emerald-500/10 text-emerald-500'
                              }`}>
                                {res.status === 'Cancelada' ? 'Reembolsado' : 'Aprovado'}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: MANUTENÇÃO */}
          {activeTab === 'manutencao' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-black uppercase tracking-tight">Manutenção de Viaturas</h2>
                <p className="text-slate-400 text-xs mt-1">Registo de revisões mecânicas, avarias e controlo de custos.</p>
              </div>

              <div className={`p-6 rounded-2xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm`}>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-slate-200/50 text-slate-400 uppercase font-black tracking-wider">
                        <th className="pb-3">Veículo</th>
                        <th className="pb-3">Descrição da Intervenção</th>
                        <th className="pb-3">Data</th>
                        <th className="pb-3">Custo</th>
                        <th className="pb-3 text-right">Estado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {maintenance.map((m) => (
                        <tr key={m.id} className="border-b border-slate-250/20 last:border-0 hover:bg-slate-500/5 transition-colors">
                          <td className="py-4 font-bold">{m.vehicle}</td>
                          <td className="py-4 text-slate-400">{m.desc}</td>
                          <td className="py-4">{m.date}</td>
                          <td className="py-4 font-extrabold">{m.cost}€</td>
                          <td className="py-4 text-right">
                            <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                              m.status === 'Concluído' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'
                            }`}>
                              {m.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 8: RELATÓRIOS */}
          {activeTab === 'relatorios' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-black uppercase tracking-tight">Relatórios Financeiros</h2>
                  <p className="text-slate-400 text-xs mt-1">Resumos de receitas e exportação para contabilidade.</p>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => alert('Sucesso: Ficheiro PDF exportado para a sua pasta de Transferências!')}
                    className="px-4 py-2 bg-red-650 text-white rounded-xl text-[10px] font-black uppercase flex items-center gap-1.5 hover:bg-red-700"
                  >
                    <Download size={14} /> Exportar PDF
                  </button>
                  <button 
                    onClick={() => alert('Sucesso: Ficheiro Excel exportado com sucesso!')}
                    className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-[10px] font-black uppercase flex items-center gap-1.5 hover:bg-emerald-700"
                  >
                    <Download size={14} /> Exportar Excel
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { title: 'Receitas Hoje', value: '710.00€', label: 'Diário' },
                  { title: 'Receitas Este Mês', value: '14,850.00€', label: 'Mensal' },
                  { title: 'Receitas Anuais', value: '124,500.00€', label: 'Anual' }
                ].map((rep, i) => (
                  <div key={i} className={`p-6 rounded-2xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm`}>
                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">{rep.title}</p>
                    <p className="text-3xl font-black mt-2">{rep.value}</p>
                    <span className="text-[9px] font-black uppercase text-blue-500 bg-blue-500/10 px-2 py-0.5 rounded mt-3 inline-block">{rep.label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 9: AVALIAÇÕES */}
          {activeTab === 'avaliacoes' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-black uppercase tracking-tight">Avaliações de Clientes</h2>
                <p className="text-slate-400 text-xs mt-1">Acompanhe a satisfação e feedback dos condutores.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {reviews.map((rev) => (
                  <div key={rev.id} className={`p-6 rounded-2xl border space-y-3 ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm`}>
                    <div className="flex justify-between items-center">
                      <span className="font-extrabold text-sm">{rev.client}</span>
                      <span className="text-[10px] text-slate-400">{rev.date}</span>
                    </div>
                    <div className="flex gap-0.5 text-amber-400">
                      {Array.from({length: rev.rating}).map((_, i) => (
                        <Star key={i} size={14} className="fill-current" />
                      ))}
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed italic">"{rev.comment}"</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 10: CONFIGURAÇÕES */}
          {activeTab === 'configuracoes' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-black uppercase tracking-tight">Configurações Gerais</h2>
                <p className="text-slate-400 text-xs mt-1">Gerencie os dados públicos, email, IBAN e termos de aluguer da companhia.</p>
              </div>

              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  const form = e.target as any;
                  const updatedBiz = {
                    ...business,
                    name: form.name.value,
                    address: form.address.value,
                    adminEmail: form.adminEmail.value,
                    contact: form.contact.value,
                    iban: form.iban.value
                  };
                  onUpdateBusiness(updatedBiz);
                  alert('Configurações gerais atualizadas com sucesso!');
                }}
                className={`p-8 rounded-2xl border max-w-2xl space-y-6 ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm`}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-400">Nome Público da Rent-a-car</label>
                    <input name="name" className="w-full border p-3 rounded-xl bg-transparent outline-none" defaultValue={business.name} />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-slate-400">Cidade / Localização</label>
                    <input name="address" className="w-full border p-3 rounded-xl bg-transparent outline-none" defaultValue={business.address} />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-slate-400">Email Administrativo</label>
                    <input name="adminEmail" className="w-full border p-3 rounded-xl bg-transparent outline-none" defaultValue={business.adminEmail} />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-slate-400">Telefone Público</label>
                    <input name="contact" className="w-full border p-3 rounded-xl bg-transparent outline-none" defaultValue={business.contact} />
                  </div>
                  <div className="space-y-1 md:col-span-2">
                    <label className="font-bold text-slate-400">IBAN para Transferências Bancárias (Cartão de Crédito)</label>
                    <input name="iban" placeholder="PT50 0000 0000 0000 0000 0000 0" className="w-full border p-3 rounded-xl bg-transparent outline-none font-mono text-sm tracking-wider" defaultValue={business.iban || ''} />
                  </div>
                </div>

                <button 
                  type="submit"
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all active:scale-95 shadow-md shadow-blue-500/20"
                >
                  Guardar Configurações
                </button>
              </form>
            </div>
          )}

          {/* TAB 11: CHAT DE EMERGÊNCIA (ADMIN VIEW) */}
          {activeTab === 'chat' && (
            <RentCarEmergencyChat 
              reservations={reservations} 
              darkMode={darkMode}
              onUpdateReservation={async (updatedRes) => {
                try {
                  const response = await fetch(`${API_BASE_URL}/api/reservations/${updatedRes.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(updatedRes)
                  });
                  if (response.ok) {
                    const updatedResList = reservations.map(r => r.id === updatedRes.id ? updatedRes : r);
                    setReservations(updatedResList);
                    const updatedBiz = { ...business, reservations: updatedResList };
                    onUpdateBusiness(updatedBiz);
                  }
                } catch (e) {
                  console.error(e);
                }
              }}
            />
          )}

        </main>
      </div>

      {/* ── DETAIL MODAL (RESERVAS) ── */}
      <AnimatePresence>
        {selectedResDetails && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className={`w-full max-w-md rounded-3xl p-8 relative shadow-2xl ${darkMode ? 'bg-slate-900 text-white' : 'bg-white text-slate-800'}`}
            >
              <button 
                onClick={() => setSelectedResDetails(null)} 
                className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-500/10"
              >
                <X size={18} />
              </button>
              
              <div className="space-y-6">
                <div>
                  <span className="text-[10px] font-black uppercase text-blue-500 bg-blue-500/10 px-2 py-0.5 rounded">Reserva Completa</span>
                  <h3 className="text-xl font-black mt-2">ID: {selectedResDetails.id}</h3>
                </div>

                <div className="space-y-3 text-xs leading-normal">
                  <div className="flex justify-between border-b pb-2 border-slate-200/50">
                    <span className="text-slate-400">Cliente</span>
                    <span className="font-bold">{selectedResDetails.customerName || selectedResDetails.client || 'Cliente'}</span>
                  </div>
                  <div className="flex justify-between border-b pb-2 border-slate-200/50">
                    <span className="text-slate-400">Email</span>
                    <span className="font-bold">{selectedResDetails.customerEmail || selectedResDetails.email || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between border-b pb-2 border-slate-200/50">
                    <span className="text-slate-400">Viatura</span>
                    <span className="font-bold">{selectedResDetails.car?.model || selectedResDetails.vehicle || 'Viatura'}</span>
                  </div>
                  <div className="flex justify-between border-b pb-2 border-slate-200/50">
                    <span className="text-slate-400">Carta de Condução</span>
                    <span className="font-bold text-blue-500">{selectedResDetails.license || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between border-b pb-2 border-slate-200/50">
                    <span className="text-slate-400">NIF / Tax ID</span>
                    <span className="font-bold font-mono">{selectedResDetails.nif || 'N/A'} ({selectedResDetails.nifType || 'Nacional'})</span>
                  </div>
                  <div className="flex justify-between border-b pb-2 border-slate-200/50">
                    <span className="text-slate-400">Método Pagamento</span>
                    <span className="font-bold uppercase tracking-wider">
                      {selectedResDetails.paymentMethod === 'mbway' ? 'MBWay / Revolut' : (selectedResDetails.paymentMethod === 'points' ? 'Pontos' : 'IBAN Transfer')}
                    </span>
                  </div>
                  <div className="flex justify-between border-b pb-2 border-slate-200/50">
                    <span className="text-slate-400">Início</span>
                    <span className="font-bold">{selectedResDetails.date ? new Date(selectedResDetails.date).toLocaleDateString('pt-PT') : (selectedResDetails.start || 'N/A')}</span>
                  </div>
                  <div className="flex justify-between border-b pb-2 border-slate-200/50">
                    <span className="text-slate-400">Fim</span>
                    <span className="font-bold">{selectedResDetails.end || (selectedResDetails.date ? new Date(new Date(selectedResDetails.date).getTime() + (selectedResDetails.days || 3)*24*60*60*1000).toLocaleDateString('pt-PT') : 'N/A')}</span>
                  </div>
                  <div className="flex justify-between border-b pb-2 border-slate-200/50">
                    <span className="text-slate-400">Valor Pago</span>
                    <span className="font-black text-blue-500">
                      €{(selectedResDetails.value || (selectedResDetails.car ? selectedResDetails.car.pricePerDay * (selectedResDetails.days || 3) : 120)).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between pb-2">
                    <span className="text-slate-400">Estado</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                      selectedResDetails.status === 'Confirmada' || selectedResDetails.status === 'accepted' ? 'bg-emerald-500/10 text-emerald-500' :
                      selectedResDetails.status === 'Pendente' || selectedResDetails.status === 'pending' ? 'bg-amber-500/10 text-amber-500' : 'bg-blue-500/10 text-blue-500'
                    }`}>{selectedResDetails.status}</span>
                  </div>
                </div>

                <button 
                  onClick={() => setSelectedResDetails(null)} 
                  className="w-full py-4 bg-blue-650 hover:bg-blue-750 text-white rounded-2xl text-xs font-black uppercase tracking-widest transition-all"
                >
                  Fechar Janela
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── ADD/EDIT VEHICLE MODAL ── */}
      <AnimatePresence>
        {(showAddVeh || editingVeh) && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className={`w-full max-w-lg rounded-3xl p-8 relative shadow-2xl ${darkMode ? 'bg-slate-900 text-white' : 'bg-white text-slate-800'}`}
            >
              <button 
                onClick={() => { setShowAddVeh(false); setEditingVeh(null); }} 
                className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-500/10"
              >
                <X size={18} />
              </button>
              
              <form onSubmit={(e) => {
                e.preventDefault();
                const form = e.target as any;
                const newVeh = {
                  id: editingVeh ? editingVeh.id : `v${Date.now()}`,
                  brand: form.brand.value,
                  model: form.model.value,
                  plate: form.plate.value,
                  category: form.category.value,
                  status: editingVeh ? editingVeh.status : 'Disponível',
                  image: imageUrl || 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=400&q=80',
                  year: parseInt(form.year.value) || 2022,
                  gearbox: form.gearbox.value,
                  insuranceExp: form.insuranceExp.value,
                  inspectionExp: form.inspectionExp.value,
                  pricePerDay: parseFloat(form.pricePerDay.value) || 45.0
                };

                if (editingVeh) {
                  const updated = vehicles.map(v => v.id === editingVeh.id ? newVeh : v);
                  setVehicles(updated);
                  saveToSystem(updated);
                  setEditingVeh(null);
                  alert('Viatura atualizada com sucesso!');
                } else {
                  const updated = [...vehicles, newVeh];
                  setVehicles(updated);
                  saveToSystem(updated);
                  setShowAddVeh(false);
                  alert('Nova viatura adicionada à frota!');
                }
              }} className="space-y-6">
                <div>
                  <h3 className="text-xl font-black uppercase tracking-tight">{editingVeh ? 'Editar Viatura' : 'Nova Viatura'}</h3>
                  <p className="text-slate-400 text-xs mt-1">Preencha as informações do veículo para a frota.</p>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-450">Marca</label>
                    <input name="brand" required defaultValue={editingVeh?.brand || ''} className="w-full border p-3 rounded-xl bg-transparent outline-none" placeholder="Ex: Renault" />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-slate-455">Modelo</label>
                    <input name="model" required defaultValue={editingVeh?.model || ''} className="w-full border p-3 rounded-xl bg-transparent outline-none" placeholder="Ex: Clio" />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-slate-450">Matrícula</label>
                    <input name="plate" required defaultValue={editingVeh?.plate || ''} className="w-full border p-3 rounded-xl bg-transparent outline-none" placeholder="Ex: 00-AA-00" />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-slate-450">Categoria</label>
                    <select name="category" defaultValue={editingVeh?.category || 'Económico'} className="w-full border p-3 rounded-xl bg-slate-900 outline-none">
                      <option value="Económico">Económico</option>
                      <option value="SUV">SUV</option>
                      <option value="Elétrico">Elétrico</option>
                      <option value="Luxo">Luxo</option>
                      <option value="Comerciais">Comerciais</option>
                    </select>
                  </div>
                  
                  <div className="space-y-1 col-span-2">
                    <label className="font-bold text-slate-450">Foto do Carro</label>
                    <div className="flex gap-2">
                      <input 
                        name="image" 
                        value={imageUrl} 
                        onChange={(e) => setImageUrl(e.target.value)} 
                        className="flex-1 border p-3 rounded-xl bg-transparent outline-none text-xs" 
                        placeholder="URL da foto ou faça upload..." 
                      />
                      <label className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-xl cursor-pointer font-bold text-center text-xs flex items-center justify-center shrink-0">
                        {isUploading ? 'A carregar...' : 'Upload'}
                        <input 
                          type="file" 
                          accept="image/*" 
                          onChange={handleImageUpload} 
                          className="hidden" 
                          disabled={isUploading}
                        />
                      </label>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-450">Valor ao Dia (€)</label>
                    <input 
                      name="pricePerDay" 
                      type="number" 
                      step="0.01" 
                      required 
                      defaultValue={editingVeh?.pricePerDay || 45.0} 
                      className="w-full border p-3 rounded-xl bg-transparent outline-none" 
                      placeholder="Ex: 45.00" 
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <label className="font-bold text-slate-450">Ano</label>
                    <input name="year" type="number" defaultValue={editingVeh?.year || 2022} className="w-full border p-3 rounded-xl bg-transparent outline-none" />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-slate-450">Caixa de Velocidades</label>
                    <select name="gearbox" defaultValue={editingVeh?.gearbox || 'Manual'} className="w-full border p-3 rounded-xl bg-slate-900 outline-none">
                      <option value="Manual">Manual</option>
                      <option value="Automático">Automático</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-slate-450">Expiração Seguro</label>
                    <input name="insuranceExp" type="date" defaultValue={editingVeh?.insuranceExp || '2026-12-31'} className="w-full border p-3 rounded-xl bg-transparent outline-none" />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-slate-450">Expiração Inspeção</label>
                    <input name="inspectionExp" type="date" defaultValue={editingVeh?.inspectionExp || '2026-12-31'} className="w-full border p-3 rounded-xl bg-transparent outline-none" />
                  </div>
                </div>

                <div className="flex gap-3 pt-3">
                  <button 
                    type="submit" 
                    className="flex-1 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-xs font-black uppercase tracking-widest transition-all"
                  >
                    Gravar
                  </button>
                  <button 
                    type="button"
                    onClick={() => { setShowAddVeh(false); setEditingVeh(null); }}
                    className="flex-1 py-4 bg-slate-500/10 hover:bg-slate-500/20 rounded-2xl text-xs font-black uppercase tracking-widest transition-all"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── CREATE NEW RESERVATION MODAL ── */}
      <AnimatePresence>
        {showNewResModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className={`w-full max-w-lg rounded-3xl p-8 relative shadow-2xl ${darkMode ? 'bg-slate-900 text-white' : 'bg-white text-slate-800'}`}
            >
              <button 
                onClick={() => setShowNewResModal(false)} 
                className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-500/10"
              >
                <X size={18} />
              </button>
              
              <form onSubmit={(e) => {
                e.preventDefault();
                const form = e.target as any;
                const selectedVeh = vehicles.find(v => v.id === form.vehicleId.value);
                const val = parseFloat(form.value.value) || 85.0;

                const newRes = {
                  id: `#RC${Math.floor(1000 + Math.random() * 9000)}`,
                  client: form.client.value,
                  email: form.email.value,
                  vehicle: selectedVeh ? `${selectedVeh.brand} ${selectedVeh.model}` : 'Renault Clio',
                  plate: selectedVeh ? selectedVeh.plate : 'AA-00-AA',
                  image: selectedVeh ? selectedVeh.image : 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=400&q=80',
                  start: `${form.start.value.replace('T', ' ')}`,
                  end: `${form.end.value.replace('T', ' ')}`,
                  value: val,
                  status: 'Confirmada'
                };

                // Update reservations list
                const updatedResList = [newRes, ...reservations];
                setReservations(updatedResList);
                
                // Update vehicle status to Reservado
                if (selectedVeh) {
                  const updatedCars = vehicles.map(v => v.id === selectedVeh.id ? { ...v, status: 'Reservado' } : v);
                  setVehicles(updatedCars);
                  saveToSystem(updatedCars);
                }

                setShowNewResModal(false);
                alert(`Reserva ${newRes.id} criada com sucesso para ${newRes.client}!`);
              }} className="space-y-6">
                <div>
                  <h3 className="text-xl font-black uppercase tracking-tight">Criar Nova Reserva</h3>
                  <p className="text-slate-400 text-xs mt-1">Preencha os dados do cliente e aluguer da viatura.</p>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div className="space-y-1 col-span-2">
                    <label className="font-bold text-slate-450">Nome do Cliente</label>
                    <input name="client" required className="w-full border p-3 rounded-xl bg-transparent outline-none" placeholder="Ex: João Silva" />
                  </div>
                  <div className="space-y-1 col-span-2">
                    <label className="font-bold text-slate-450">Email do Cliente</label>
                    <input name="email" type="email" required className="w-full border p-3 rounded-xl bg-transparent outline-none" placeholder="Ex: cliente@email.com" />
                  </div>
                  <div className="space-y-1 col-span-2">
                    <label className="font-bold text-slate-450">Selecionar Viatura da Frota</label>
                    <select name="vehicleId" className="w-full border p-3 rounded-xl bg-transparent bg-slate-900 outline-none">
                      {vehicles.map(v => (
                        <option key={v.id} value={v.id}>{v.brand} {v.model} ({v.plate}) - {v.status}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-slate-450">Início do Aluguer</label>
                    <input name="start" type="datetime-local" required className="w-full border p-3 rounded-xl bg-transparent outline-none" />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-slate-450">Fim do Aluguer</label>
                    <input name="end" type="datetime-local" required className="w-full border p-3 rounded-xl bg-transparent outline-none" />
                  </div>
                  <div className="space-y-1 col-span-2">
                    <label className="font-bold text-slate-450">Valor Total (€)</label>
                    <input name="value" type="number" step="0.01" defaultValue="85.00" className="w-full border p-3 rounded-xl bg-transparent outline-none" />
                  </div>
                </div>

                <div className="flex gap-3 pt-3">
                  <button 
                    type="submit" 
                    className="flex-1 py-4 bg-[#0066CC] hover:bg-blue-700 text-white rounded-2xl text-xs font-black uppercase tracking-widest transition-all"
                  >
                    Confirmar Aluguer
                  </button>
                  <button 
                    type="button"
                    onClick={() => setShowNewResModal(false)}
                    className="flex-1 py-4 bg-slate-500/10 hover:bg-slate-500/20 rounded-2xl text-xs font-black uppercase tracking-widest transition-all"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── EDIT RESERVATION MODAL ── */}
      <AnimatePresence>
        {editingRes && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className={`w-full max-w-lg rounded-3xl p-8 relative shadow-2xl ${darkMode ? 'bg-slate-900 text-white' : 'bg-white text-slate-800'}`}
            >
              <button 
                onClick={() => setEditingRes(null)} 
                className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-500/10"
              >
                <X size={18} />
              </button>
              
              <form onSubmit={(e) => {
                e.preventDefault();
                const form = e.target as any;
                const val = parseFloat(form.value.value) || editingRes.value;

                const updatedRes = {
                  ...editingRes,
                  client: form.client.value,
                  email: form.email.value,
                  start: form.start.value,
                  end: form.end.value,
                  value: val,
                  status: form.status.value
                };

                const updatedResList = reservations.map(r => r.id === editingRes.id ? updatedRes : r);
                setReservations(updatedResList);

                setEditingRes(null);
                alert(`Reserva ${editingRes.id} editada com sucesso!`);
              }} className="space-y-6">
                <div>
                  <h3 className="text-xl font-black uppercase tracking-tight">Editar Reserva: {editingRes.id}</h3>
                  <p className="text-slate-400 text-xs mt-1">Modifique as informações gerais de aluguer da reserva.</p>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div className="space-y-1 col-span-2">
                    <label className="font-bold text-slate-450">Nome do Cliente</label>
                    <input name="client" required defaultValue={editingRes.client} className="w-full border p-3 rounded-xl bg-transparent outline-none" />
                  </div>
                  <div className="space-y-1 col-span-2">
                    <label className="font-bold text-slate-450">Email do Cliente</label>
                    <input name="email" type="email" required defaultValue={editingRes.email} className="w-full border p-3 rounded-xl bg-transparent outline-none" />
                  </div>
                  <div className="space-y-1 col-span-2">
                    <label className="font-bold text-slate-450">Viatura Alugada</label>
                    <input disabled value={editingRes.vehicle} className="w-full border p-3 rounded-xl bg-slate-100 dark:bg-slate-950 opacity-60 outline-none" />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-slate-450">Início do Aluguer</label>
                    <input name="start" required defaultValue={editingRes.start} className="w-full border p-3 rounded-xl bg-transparent outline-none" />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-slate-450">Fim do Aluguer</label>
                    <input name="end" required defaultValue={editingRes.end} className="w-full border p-3 rounded-xl bg-transparent outline-none" />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-slate-450">Valor Total (€)</label>
                    <input name="value" type="number" step="0.01" defaultValue={editingRes.value} className="w-full border p-3 rounded-xl bg-transparent outline-none" />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-slate-450">Estado da Reserva</label>
                    <select name="status" defaultValue={editingRes.status} className="w-full border p-3 rounded-xl bg-transparent bg-slate-900 outline-none">
                      <option value="Pendente">Pendente</option>
                      <option value="Confirmada">Confirmada</option>
                      <option value="Em Curso">Em Curso</option>
                      <option value="Concluída">Concluída</option>
                      <option value="Cancelada">Cancelada</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-3 pt-3">
                  <button 
                    type="submit" 
                    className="flex-1 py-4 bg-[#0066CC] hover:bg-blue-700 text-white rounded-2xl text-xs font-black uppercase tracking-widest transition-all"
                  >
                    Salvar Alterações
                  </button>
                  <button 
                    type="button"
                    onClick={() => setEditingRes(null)}
                    className="flex-1 py-4 bg-slate-500/10 hover:bg-slate-500/20 rounded-2xl text-xs font-black uppercase tracking-widest transition-all"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

interface RentCarEmergencyChatProps {
  reservations: any[];
  darkMode: boolean;
  onUpdateReservation: (updatedRes: any) => Promise<void>;
}

function RentCarEmergencyChat({ reservations, darkMode, onUpdateReservation }: RentCarEmergencyChatProps) {
  const activeRentals = reservations.filter(r => 
    r.type === 'car' && 
    (r.status === 'active' || r.status === 'Em Curso' || (r.status === 'accepted' && r.checkinTime)) &&
    r.status !== 'finished' && r.status !== 'Concluída' &&
    r.status !== 'cancelled' && r.status !== 'Cancelada'
  );

  const [selectedResId, setSelectedResId] = useState<string | null>(null);
  const selectedRes = activeRentals.find(r => r.id === selectedResId);
  const [newMessageText, setNewMessageText] = useState('');
  const [chatMessages, setChatMessages] = useState<any[]>([]);

  useEffect(() => {
    if (selectedRes) {
      setChatMessages(selectedRes.chatMessages || []);
    } else {
      setChatMessages([]);
    }
  }, [selectedResId, selectedRes]);

  useEffect(() => {
    if (!selectedResId) return;

    const interval = setInterval(async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/reservations/${selectedResId}`);
        if (response.ok) {
          const data = await response.json();
          setChatMessages(data.chatMessages || []);
        }
      } catch (e) {}
    }, 3000);

    return () => clearInterval(interval);
  }, [selectedResId]);

  const handleSendMessage = async () => {
    if (!newMessageText.trim() || !selectedRes) return;

    const newMsg = {
      sender: 'admin',
      text: newMessageText.trim(),
      timestamp: new Date().toISOString()
    };

    const updatedMessages = [...chatMessages, newMsg];
    setChatMessages(updatedMessages);
    setNewMessageText('');

    const updatedRes = {
      ...selectedRes,
      chatMessages: updatedMessages
    };

    await onUpdateReservation(updatedRes);
  };

  return (
    <div className="space-y-6 h-[calc(100vh-140px)] flex flex-col">
      <div>
        <h2 className="text-2xl font-black uppercase tracking-tight">Chat de Emergência</h2>
        <p className="text-slate-400 text-xs mt-1">Comunicação direta em tempo real com os clientes durante o aluguer.</p>
      </div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6 min-h-0">
        <div className={`p-4 rounded-2xl border flex flex-col ${
          darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        } shadow-sm overflow-y-auto`}>
          <h3 className="font-extrabold uppercase text-xs tracking-widest text-slate-400 mb-3">Alugueres Ativos</h3>
          <div className="space-y-2">
            {activeRentals.length === 0 ? (
              <p className="text-xs text-slate-400 italic text-center py-6">Sem alugueres ativos com check-in.</p>
            ) : (
              activeRentals.map(res => (
                <button
                  key={res.id}
                  onClick={() => setSelectedResId(res.id)}
                  className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between ${
                    selectedResId === res.id
                      ? 'bg-blue-600/10 border-blue-500/30 text-blue-600'
                      : darkMode
                        ? 'border-slate-800 hover:bg-slate-800/50'
                        : 'border-slate-100 hover:bg-slate-55'
                  }`}
                >
                  <div>
                    <p className="font-bold text-xs leading-none text-slate-800 dark:text-white mb-1">
                      {res.customerName || res.client || 'Cliente'}
                    </p>
                    <span className="text-[10px] text-slate-400 uppercase font-black">
                      {res.car?.model || res.vehicle} · {res.id}
                    </span>
                  </div>
                  {res.chatMessages && res.chatMessages.length > 0 && res.chatMessages[res.chatMessages.length - 1].sender === 'client' && (
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
                  )}
                </button>
              ))
            )}
          </div>
        </div>

        <div className={`md:col-span-2 rounded-2xl border flex flex-col ${
          darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        } shadow-sm min-h-0`}>
          {selectedRes ? (
            <div className="flex-1 flex flex-col min-h-0 p-4">
              <div className="border-b pb-3 mb-4 flex justify-between items-center">
                <div>
                  <h4 className="font-black text-sm uppercase tracking-tight">
                    {selectedRes.customerName || selectedRes.client}
                  </h4>
                  <p className="text-[9px] text-slate-400 font-bold uppercase mt-0.5">
                    {selectedRes.car?.model || selectedRes.vehicle} · Check-in: {selectedRes.checkinTime || 'Confirmado'}
                  </p>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto space-y-3 pr-2 mb-4">
                {chatMessages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-slate-400">
                    <MessageSquare size={32} className="opacity-20 mb-2" />
                    <p className="text-xs font-bold uppercase tracking-wider">Sem mensagens</p>
                    <p className="text-[9px] text-center max-w-xs mt-1">
                      Envie uma mensagem de boas-vindas ou de suporte ao cliente.
                    </p>
                  </div>
                ) : (
                  chatMessages.map((msg, idx) => (
                    <div 
                      key={idx} 
                      className={`flex flex-col ${msg.sender === 'admin' ? 'items-end' : 'items-start'}`}
                    >
                      <div 
                        className={`max-w-[85%] rounded-2xl p-3 text-xs font-semibold ${
                          msg.sender === 'admin' 
                            ? 'bg-blue-600 text-white rounded-tr-none' 
                            : darkMode
                              ? 'bg-slate-800 text-slate-100 rounded-tl-none border border-slate-700'
                              : 'bg-slate-100 text-slate-800 rounded-tl-none border border-slate-200/50'
                        }`}
                      >
                        {msg.text}
                      </div>
                      <span className="text-[8px] text-slate-400 mt-1 uppercase font-black">
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  ))
                )}
              </div>

              <div className="flex gap-2 border-t pt-3">
                <input 
                  type="text" 
                  placeholder="Escreva a sua resposta de emergência..."
                  value={newMessageText}
                  onChange={(e) => setNewMessageText(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleSendMessage(); }}
                  className={`flex-1 px-4 py-3 border rounded-xl text-xs font-bold focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                    darkMode 
                      ? 'border-slate-800 bg-slate-950 text-white placeholder-slate-500' 
                      : 'border-slate-200 bg-transparent text-slate-800'
                  }`}
                />
                <button 
                  onClick={handleSendMessage}
                  className="px-5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center"
                >
                  Enviar
                </button>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-8">
              <MessageSquare size={48} className="opacity-10 mb-3 animate-bounce" />
              <p className="text-sm font-black uppercase tracking-widest">Painel do Chat de Emergência</p>
              <p className="text-[10px] text-center max-w-xs mt-1 italic">
                Selecione um cliente com aluguer ativo na barra lateral para iniciar a conversação.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
