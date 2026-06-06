import React, { useState, useEffect, useRef } from 'react';
import { 
  LayoutDashboard, Car, Calendar, CheckSquare, DollarSign, 
  Wrench, BarChart3, Star, Settings, LogOut, Users, Search, 
  Bell, Sun, Moon, AlertTriangle, Plus, Edit, Trash2, CheckCircle2, 
  X, Check, ChevronRight, FileText, Download, Shield, Eye, Info, HelpCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface RentCarDashboardProps {
  business: any;
  onUpdateBusiness: (updated: any) => void;
  onLogout: () => void;
  language?: string;
}

type Tab = 'dashboard' | 'reservas' | 'frota' | 'clientes' | 'checkin' | 'pagamentos' | 'manutencao' | 'relatorios' | 'avaliacoes' | 'configuracoes' | 'database';

export default function RentCarDashboard({ business, onUpdateBusiness, onLogout, language = 'pt' }: RentCarDashboardProps) {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [darkMode, setDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Real-time states or mock fallbacks
  const [vehicles, setVehicles] = useState<any[]>(() => {
    return business.cars && business.cars.length > 0 ? business.cars : [
      { id: 'v1', brand: 'Renault', model: 'Clio', plate: 'AA-00-AA', category: 'Económico', status: 'Disponível', image: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=400&q=80', year: 2022, gearbox: 'Manual', insuranceExp: '2026-12-15', inspectionExp: '2026-10-10' },
      { id: 'v2', brand: 'Fiat', model: '500', plate: 'BB-11-BB', category: 'Económico', status: 'Reservado', image: 'https://images.unsplash.com/photo-1517524206127-48bbd363f3d7?auto=format&fit=crop&w=400&q=80', year: 2021, gearbox: 'Manual', insuranceExp: '2026-06-25', inspectionExp: '2026-07-15' },
      { id: 'v3', brand: 'Tesla', model: 'Model 3', plate: 'CC-22-CC', category: 'Elétrico', status: 'Alugado', image: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=400&q=80', year: 2023, gearbox: 'Automático', insuranceExp: '2026-09-01', inspectionExp: '2026-08-30' },
      { id: 'v4', brand: 'Dacia', model: 'Duster', plate: 'DD-33-DD', category: 'SUV', status: 'Manutenção', image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=400&q=80', year: 2022, gearbox: 'Manual', insuranceExp: '2026-05-10', inspectionExp: '2026-05-12' },
      { id: 'v5', brand: 'BMW', model: 'Série 4', plate: 'EE-44-EE', category: 'Luxo', status: 'Disponível', image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=400&q=80', year: 2023, gearbox: 'Automático', insuranceExp: '2026-11-20', inspectionExp: '2026-12-05' }
    ];
  });

  const [reservations, setReservations] = useState<any[]>(() => {
    return business.reservations && business.reservations.length > 0 ? business.reservations : [
      { id: '#RC4587', client: 'João Silva', email: 'joaosilva@gmail.com', vehicle: 'Renault Clio (AA-00-AA)', start: '2026-06-06', end: '2026-06-12', value: 240, status: 'Confirmada' },
      { id: '#RC4588', client: 'Maria Santos', email: 'maria.santos@outlook.com', vehicle: 'Fiat 500 (BB-11-BB)', start: '2026-06-07', end: '2026-06-10', value: 120, status: 'Pendente' },
      { id: '#RC4589', client: 'Pedro Costa', email: 'pedrocosta@yahoo.com', vehicle: 'Tesla Model 3 (CC-22-CC)', start: '2026-06-05', end: '2026-06-08', value: 350, status: 'Em Curso' },
      { id: '#RC4590', client: 'Ana Oliveira', email: 'ana.oliveira@gmail.com', vehicle: 'BMW Série 4 (EE-44-EE)', start: '2026-05-28', end: '2026-06-02', value: 480, status: 'Concluída' },
      { id: '#RC4591', client: 'Carlos Almeida', email: 'carlos.almeida@live.com.pt', vehicle: 'Dacia Duster (DD-33-DD)', start: '2026-06-02', end: '2026-06-05', value: 180, status: 'Cancelada' }
    ];
  });

  const [clients, setClients] = useState<any[]>([
    { id: 'c1', name: 'João Silva', email: 'joaosilva@gmail.com', phone: '912 345 678', nif: '234567890', license: 'L-987654 3' },
    { id: 'c2', name: 'Maria Santos', email: 'maria.santos@outlook.com', phone: '963 852 741', nif: '245678901', license: 'L-123456 8' },
    { id: 'c3', name: 'Pedro Costa', email: 'pedrocosta@yahoo.com', phone: '921 741 852', nif: '256789012', license: 'L-654321 0' },
    { id: 'c4', name: 'Ana Oliveira', email: 'ana.oliveira@gmail.com', phone: '934 567 890', nif: '267890123', license: 'L-789012 4' }
  ]);

  const [maintenance, setMaintenance] = useState<any[]>([
    { id: 'm1', vehicle: 'Dacia Duster (DD-33-DD)', desc: 'Revisão dos 50.000km e calços de travões', cost: 185.00, date: '2026-06-04', status: 'Em Curso' },
    { id: 'm2', vehicle: 'Renault Clio (AA-00-AA)', desc: 'Substituição de pneu esquerdo', cost: 95.00, date: '2026-05-20', status: 'Concluído' }
  ]);

  const [reviews, setReviews] = useState<any[]>([
    { id: 'r1', client: 'João Silva', rating: 5, comment: 'Excelente serviço. Carro limpo e entrega pontual no Aeroporto de Ponta Delgada.', date: '2026-06-01' },
    { id: 'r2', client: 'Ana Oliveira', rating: 4, comment: 'Bom carro e simpática assistência, recomendo.', date: '2026-05-25' }
  ]);

  // Notifications State
  const [notifications, setNotifications] = useState<any[]>([
    { id: 1, text: 'Nova reserva pendente de aprovação: #RC4588', read: false },
    { id: 2, text: 'Seguro do veículo DD-33-DD expira em 4 dias', read: false },
    { id: 3, text: 'Manutenção agendada para Fiat 500 amanhã', read: true }
  ]);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);

  // Active Modals States
  const [editingRes, setEditingRes] = useState<any | null>(null);
  const [editingVeh, setEditingVeh] = useState<any | null>(null);
  const [showAddVeh, setShowAddVeh] = useState(false);
  const [selectedResDetails, setSelectedResDetails] = useState<any | null>(null);
  
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
    const updatedBiz = { ...business, cars: updatedCars };
    onUpdateBusiness(updatedBiz);
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

  // Car wireframe damage zones
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

  // Photo Uploader Mocking
  const triggerPhotoUpload = () => {
    const mockPhotos = [
      'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=400&q=80',
      'https://images.unsplash.com/photo-1506015391300-4802dc74de2e?auto=format&fit=crop&w=400&q=80',
      'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=400&q=80'
    ];
    // Random select one image
    const randomImg = mockPhotos[Math.floor(Math.random() * mockPhotos.length)];
    setPhotoMockList(prev => [...prev, randomImg]);
  };

  return (
    <div className={`min-h-screen font-sans flex transition-colors duration-300 ${darkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-800'}`}>
      
      {/* ── SIDEBAR MENU ── */}
      <aside className={`w-72 flex flex-col border-r transition-colors duration-300 shrink-0 ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
        <div className="p-6 flex items-center gap-3 border-b border-slate-200/50">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-md shadow-blue-500/20 shrink-0">
            <Car size={22} />
          </div>
          <div>
            <h1 className="font-extrabold text-sm tracking-tight">{business.name || 'Rent-a-Car'}</h1>
            <p className="text-[10px] uppercase tracking-widest text-blue-500 font-bold">Admin Portal</p>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {([
            { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
            { id: 'reservas', label: 'Reservas', icon: <Calendar size={18} />, count: reservations.filter(r => r.status === 'Pendente').length },
            { id: 'frota', label: 'Frota', icon: <Car size={18} /> },
            { id: 'clientes', label: 'Clientes', icon: <Users size={18} /> },
            { id: 'checkin', label: 'Check-In / Out', icon: <CheckSquare size={18} /> },
            { id: 'pagamentos', label: 'Pagamentos', icon: <DollarSign size={18} /> },
            { id: 'manutencao', label: 'Manutenção', icon: <Wrench size={18} />, count: maintenance.filter(m => m.status === 'Em Curso').length },
            { id: 'relatorios', label: 'Relatórios', icon: <FileText size={18} /> },
            { id: 'avaliacoes', label: 'Avaliações', icon: <Star size={18} /> },
            { id: 'configuracoes', label: 'Configurações', icon: <Settings size={18} /> },
            { id: 'database', label: 'Base de Dados', icon: <Shield size={18} /> }
          ] as const).map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                // Reset check-in state
                setActiveCheckFlow(null);
                setSelectedCheckRes(null);
                setDamageLog([]);
                setPhotoMockList([]);
                setDeliveryConfirmed(false);
              }}
              className={`w-full flex items-center justify-between p-3.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all duration-200 group ${
                activeTab === item.id 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' 
                  : darkMode ? 'hover:bg-slate-800 text-slate-400 hover:text-slate-100' : 'hover:bg-slate-100 text-slate-600 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <span className={activeTab === item.id ? 'text-white' : 'text-slate-400 group-hover:text-slate-300'}>{item.icon}</span>
                <span>{item.label}</span>
              </div>
              {('count' in item) && item.count && item.count > 0 ? (
                <span className="bg-red-500 text-white text-[9px] font-black px-2 py-0.5 rounded-full">{item.count}</span>
              ) : null}
            </button>
          ))}
        </nav>

        {/* Admin User Info Card */}
        <div className="p-6 border-t border-slate-200/50 space-y-4">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-black text-sm uppercase">
              AD
            </div>
            <div>
              <p className="text-xs font-bold">Administrador</p>
              <p className="text-[10px] text-slate-400 truncate w-36">geral@ilhaverde.pt</p>
            </div>
          </div>
          <button 
            onClick={onLogout}
            className="w-full py-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all active:scale-95"
          >
            <LogOut size={14} /> Terminar Sessão
          </button>
        </div>
      </aside>

      {/* ── MAIN WORKSPACE ── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        
        {/* TOPO HEADER */}
        <header className={`sticky top-0 h-20 border-b flex items-center justify-between px-8 z-30 transition-colors duration-300 ${darkMode ? 'bg-slate-950/80 border-slate-800' : 'bg-white/80 border-slate-200'} backdrop-blur-md`}>
          <div className="flex items-center gap-4 w-96">
            <div className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border w-full text-xs transition-all ${darkMode ? 'bg-slate-900 border-slate-850' : 'bg-slate-50 border-slate-200'}`}>
              <Search size={14} className="text-slate-400" />
              <input 
                type="text" 
                placeholder="Pesquisa global de reservas, matrículas, clientes..." 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="bg-transparent border-none outline-none w-full text-slate-300 placeholder-slate-400"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Theme Toggle */}
            <button 
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2.5 rounded-xl border transition-all active:scale-90 ${darkMode ? 'bg-slate-900 border-slate-805 text-amber-400' : 'bg-slate-100 border-slate-200 text-slate-600'}`}
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* Notification Bell */}
            <div className="relative">
              <button 
                onClick={() => setShowNotifDropdown(!showNotifDropdown)}
                className={`p-2.5 rounded-xl border relative transition-all ${darkMode ? 'bg-slate-900 border-slate-805 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-600'}`}
              >
                <Bell size={18} />
                {notifications.some(n => !n.read) && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
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
                      {notifications.map(n => (
                        <div key={n.id} className={`p-2 rounded-lg text-xs leading-normal ${!n.read ? 'bg-blue-500/10 font-bold border-l-2 border-blue-500' : 'opacity-60'}`}>
                          {n.text}
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Admin Avatar */}
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold hidden sm:inline">{business.name || 'Rent-a-Car'}</span>
              <img 
                src={business.image || 'https://api.dicebear.com/7.x/initials/svg?seed=IV'} 
                alt="Logo" 
                className="w-10 h-10 rounded-xl object-contain bg-white p-1 border border-slate-200"
              />
            </div>
          </div>
        </header>

        {/* ── TAB CONTENTS ── */}
        <main className="p-8 space-y-8 max-w-7xl w-full mx-auto flex-1">
          
          {/* TAB 1: DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div className="space-y-8">
              {/* Live Info Greeting */}
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-black tracking-tight uppercase">Dashboard Geral</h2>
                  <p className="text-slate-400 text-xs mt-1">Gestão de frota, reservas diárias e desempenho financeiro.</p>
                </div>
                <div className={`px-4 py-2 rounded-xl text-xs font-bold border flex items-center gap-2 ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                  <span>Sincronizado com Firebase (Pre-Integrado)</span>
                </div>
              </div>

              {/* KPIs PRINCIPAIS */}
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                {[
                  { title: 'Total Veículos', value: vehicles.length, color: 'text-blue-500 bg-blue-500/10 border-blue-500/20', desc: 'Frota Registada' },
                  { title: 'Disponíveis', value: vehicles.filter(v => v.status === 'Disponível').length, color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20', desc: 'Prontos a alugar' },
                  { title: 'Alugados', value: vehicles.filter(v => v.status === 'Alugado').length, color: 'text-amber-500 bg-amber-500/10 border-amber-500/20', desc: 'Em circulação' },
                  { title: 'Em Manutenção', value: vehicles.filter(v => v.status === 'Manutenção').length, color: 'text-red-500 bg-red-500/10 border-red-500/20', desc: 'Oficina / Reparação' },
                  { title: 'Reservas Hoje', value: 3, color: 'text-purple-500 bg-purple-500/10 border-purple-500/20', desc: 'Levantamentos' },
                  { title: 'Receita Hoje', value: '710€', color: 'text-indigo-500 bg-indigo-500/10 border-indigo-500/20', desc: 'Pagamentos validados' },
                  { title: 'Ocupação', value: '72%', color: 'text-teal-500 bg-teal-500/10 border-teal-500/20', desc: 'Eficiência da Frota' }
                ].map((kpi, idx) => (
                  <div key={idx} className={`p-4 rounded-2xl border flex flex-col justify-between space-y-2 transition-transform hover:scale-[1.02] ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                    <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold leading-none">{kpi.title}</span>
                    <span className="text-2xl font-black leading-none">{kpi.value}</span>
                    <div className={`text-[8px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded text-center truncate ${kpi.color}`}>
                      {kpi.desc}
                    </div>
                  </div>
                ))}
              </div>

              {/* MIDDLE ROW: RESERVAS RECENTES & CALENDÁRIO VISUAL */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* 1. Reservas Recentes Table */}
                <div className={`p-6 rounded-3xl border lg:col-span-2 space-y-6 ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                  <div className="flex justify-between items-center">
                    <h3 className="font-extrabold uppercase text-xs tracking-widest text-slate-400">Reservas Recentes</h3>
                    <button onClick={() => setActiveTab('reservas')} className="text-xs text-blue-500 font-bold hover:underline">Ver todas</button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="border-b border-slate-200/50 text-slate-400 uppercase font-black tracking-wider">
                          <th className="pb-3">ID</th>
                          <th className="pb-3">Cliente</th>
                          <th className="pb-3">Veículo</th>
                          <th className="pb-3">Levantamento</th>
                          <th className="pb-3">Valor</th>
                          <th className="pb-3 text-right">Estado</th>
                        </tr>
                      </thead>
                      <tbody>
                        {reservations.slice(0, 4).map((res, i) => (
                          <tr key={i} className="border-b border-slate-250/30 last:border-0 hover:bg-slate-500/5">
                            <td className="py-3 font-bold text-blue-500">{res.id}</td>
                            <td className="py-3 font-bold">{res.client}</td>
                            <td className="py-3 text-slate-400">{res.vehicle}</td>
                            <td className="py-3">{res.start}</td>
                            <td className="py-3 font-extrabold">{res.value}€</td>
                            <td className="py-3 text-right">
                              <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${
                                res.status === 'Confirmada' ? 'bg-emerald-500/10 text-emerald-500' :
                                res.status === 'Pendente' ? 'bg-amber-500/10 text-amber-500' :
                                res.status === 'Em Curso' ? 'bg-blue-500/10 text-blue-500' :
                                res.status === 'Concluída' ? 'bg-slate-500/10 text-slate-400' : 'bg-red-500/10 text-red-500'
                              }`}>
                                {res.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* 2. Calendário de Disponibilidade (Estilo Airbnb / Stripe) */}
                <div className={`p-6 rounded-3xl border space-y-6 ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                  <div className="flex justify-between items-center">
                    <h3 className="font-extrabold uppercase text-xs tracking-widest text-slate-400">Disponibilidade da Frota</h3>
                    <div className="flex gap-1.5 text-[8px] font-black uppercase">
                      <span className="px-1.5 py-0.5 bg-emerald-500/10 text-emerald-500 rounded">Disponível</span>
                      <span className="px-1.5 py-0.5 bg-red-500/10 text-red-500 rounded">Ocupado</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {/* Airbnb occupancy grid timeline */}
                    <div className="grid grid-cols-8 gap-1 border-b border-slate-200/50 pb-2 text-center text-[9px] font-bold text-slate-400 uppercase">
                      <div>Veículo</div>
                      {['Hoje', 'Amanhã', '08/06', '09/06', '10/06', '11/06', '12/06'].map((day, i) => (
                        <div key={i}>{day}</div>
                      ))}
                    </div>

                    {vehicles.slice(0, 5).map((veh) => {
                      // Simulating occupancy statuses
                      const occupancy = [
                        veh.status !== 'Alugado' && veh.status !== 'Manutenção',
                        veh.status === 'Disponível',
                        veh.status !== 'Manutenção',
                        veh.status === 'Disponível' || veh.status === 'Reservado',
                        veh.status !== 'Alugado',
                        true,
                        veh.status !== 'Manutenção'
                      ];

                      return (
                        <div key={veh.id} className="grid grid-cols-8 gap-1 items-center text-center text-[10px]">
                          <div className="font-extrabold text-left truncate pr-1" title={`${veh.brand} ${veh.model}`}>{veh.model}</div>
                          {occupancy.map((available, idx) => (
                            <div 
                              key={idx} 
                              className={`h-6 rounded-md transition-all ${
                                available ? 'bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20' : 'bg-red-500/10 hover:bg-red-500/20 border border-red-500/20'
                              }`}
                              title={available ? 'Livre' : 'Ocupado / Reservado'}
                            />
                          ))}
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>

              {/* THIRD ROW: ENTEGAS DO DIA & ALERTA DOS SEGUROS */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* 1. Deliveries of the day check-in list */}
                <div className={`p-6 rounded-3xl border md:col-span-2 space-y-6 ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                  <div className="flex justify-between items-center">
                    <h3 className="font-extrabold uppercase text-xs tracking-widest text-slate-400">Entregas / Devoluções Hoje</h3>
                    <span className="text-[10px] font-black uppercase bg-blue-500/10 text-blue-500 px-2 py-0.5 rounded">6 de Junho</span>
                  </div>
                  
                  <div className="space-y-3">
                    {[
                      { res: reservations[0], time: '10:00', type: 'Entrega (Check-In)', action: 'in' },
                      { res: reservations[2], time: '17:00', type: 'Devolução (Check-Out)', action: 'out' }
                    ].map((flow, i) => (
                      <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-slate-500/5 rounded-2xl border border-slate-200/10">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-black uppercase text-slate-400">{flow.time}</span>
                            <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${
                              flow.action === 'in' ? 'bg-green-500/10 text-green-500' : 'bg-orange-500/10 text-orange-500'
                            }`}>{flow.type}</span>
                          </div>
                          <p className="text-xs font-black">{flow.res.client} ({flow.res.id})</p>
                          <p className="text-[10px] text-slate-400">{flow.res.vehicle}</p>
                        </div>
                        <button 
                          onClick={() => {
                            setSelectedCheckRes(flow.res);
                            setActiveCheckFlow(flow.action);
                            setActiveTab('checkin');
                          }}
                          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 shadow-md shadow-blue-500/10 self-start sm:self-auto"
                        >
                          Iniciar Processo
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 2. System Alerts Panel */}
                <div className={`p-6 rounded-3xl border space-y-6 ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                  <h3 className="font-extrabold uppercase text-xs tracking-widest text-slate-400">Notificações e Alertas</h3>
                  
                  <div className="space-y-3">
                    {[
                      { icon: <AlertTriangle className="text-amber-500" />, title: 'Seguro Expira Brevemente', desc: 'Renault Clio AA-00-AA expira em 15/12/2026', color: 'border-amber-500/20 bg-amber-500/5' },
                      { icon: <Wrench className="text-red-500" />, title: 'Manutenção Pendente', desc: 'Dacia Duster DD-33-DD precisa de calços novos', color: 'border-red-500/20 bg-red-500/5' },
                      { icon: <DollarSign className="text-blue-500" />, title: 'Pagamento em Atraso', desc: 'Reserva #RC4588 aguarda validação de sinal', color: 'border-blue-500/20 bg-blue-500/5' }
                    ].map((alert, idx) => (
                      <div key={idx} className={`p-3 rounded-2xl border flex gap-3 items-start ${alert.color}`}>
                        <div className="mt-0.5 shrink-0">{alert.icon}</div>
                        <div>
                          <p className="text-xs font-bold leading-tight">{alert.title}</p>
                          <p className="text-[10px] text-slate-400 mt-0.5 leading-normal">{alert.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* ANALYTICS SECTION: DYNAMIC SVG CHARTS */}
              <div className={`p-6 rounded-3xl border space-y-8 ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                <div>
                  <h3 className="font-extrabold uppercase text-xs tracking-widest text-slate-400">Análise de Rendimento</h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Gráficos de Faturação, Ocupação e Distribuição Geográfica</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  
                  {/* Chart 1: Revenue Area Chart */}
                  <div className="space-y-4">
                    <p className="text-[10px] font-black uppercase text-slate-400">Receita Mensal (€)</p>
                    <div className="h-40 w-full bg-slate-500/5 rounded-2xl border border-slate-200/10 p-4 relative flex items-end">
                      {/* Simple modern SVG Area line chart representing monthly growth */}
                      <svg viewBox="0 0 100 40" className="w-full h-full text-blue-500 fill-current opacity-20 absolute bottom-0 left-0">
                        <path d="M 0 40 L 0 32 Q 20 20 40 25 T 80 10 L 100 5 L 100 40 Z" />
                      </svg>
                      <svg viewBox="0 0 100 40" className="w-full h-full text-blue-500 fill-none stroke-current stroke-2 absolute bottom-0 left-0">
                        <path d="M 0 32 Q 20 20 40 25 T 80 10 L 100 5" />
                      </svg>
                      <div className="w-full flex justify-between text-[8px] font-bold text-slate-400 absolute bottom-2 left-0 px-4">
                        <span>Jan</span><span>Mar</span><span>Mai</span><span>Jul</span><span>Set</span><span>Dez</span>
                      </div>
                    </div>
                  </div>

                  {/* Chart 2: Reservations Bar Chart */}
                  <div className="space-y-4">
                    <p className="text-[10px] font-black uppercase text-slate-400">Reservas por Mês</p>
                    <div className="h-40 w-full bg-slate-500/5 rounded-2xl border border-slate-200/10 p-4 flex items-end justify-between gap-1.5">
                      {[32, 45, 68, 85, 76, 95, 110, 89, 74, 55, 42, 38].map((val, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                          <div 
                            className="bg-blue-600 rounded-t-sm w-full transition-all duration-500" 
                            style={{ height: `${(val / 110) * 80}%` }}
                            title={`${val} reservas`}
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Chart 3: Occupancy Rate Circular Gauge */}
                  <div className="space-y-4">
                    <p className="text-[10px] font-black uppercase text-slate-400">Taxa de Ocupação da Frota</p>
                    <div className="h-40 w-full bg-slate-500/5 rounded-2xl border border-slate-200/10 p-4 flex flex-col items-center justify-center relative">
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
                          strokeDashoffset={251.2 - (251.2 * 72) / 100}
                        />
                      </svg>
                      <div className="absolute flex flex-col items-center">
                        <span className="text-xl font-black">72%</span>
                        <span className="text-[8px] font-black text-slate-400 uppercase">Média Anual</span>
                      </div>
                    </div>
                  </div>

                  {/* Chart 4: Reservations per Island (Pie Chart Mock) */}
                  <div className="space-y-4">
                    <p className="text-[10px] font-black uppercase text-slate-400">Reservas por Ilha dos Açores</p>
                    <div className="h-40 w-full bg-slate-500/5 rounded-2xl border border-slate-200/10 p-4 flex items-center justify-around">
                      <div className="relative w-24 h-24 rounded-full border-8 border-slate-200 dark:border-slate-800 flex items-center justify-center">
                        <div className="absolute inset-0 rounded-full border-8 border-transparent border-t-blue-600 border-r-indigo-500 transform rotate-45" />
                        <div className="text-center">
                          <span className="text-sm font-black">4 Ilhas</span>
                        </div>
                      </div>
                      <div className="text-[9px] space-y-1 font-bold">
                        <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded bg-blue-650" /> São Miguel (45%)</div>
                        <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded bg-indigo-500" /> Terceira (25%)</div>
                        <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded bg-purple-500" /> Faial (15%)</div>
                        <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded bg-slate-500" /> Pico (15%)</div>
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
              <div className={`p-6 rounded-3xl border space-y-4 ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
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
                      {reservations.filter(r => 
                        r.client.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        r.vehicle.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        r.id.toLowerCase().includes(searchQuery.toLowerCase())
                      ).map((res, i) => (
                        <tr key={i} className="border-b border-slate-250/30 last:border-0 hover:bg-slate-500/5">
                          <td className="py-4 font-bold text-blue-500">{res.id}</td>
                          <td className="py-4 font-bold">{res.client}</td>
                          <td className="py-4 text-slate-400">{res.vehicle}</td>
                          <td className="py-4">{res.start}</td>
                          <td className="py-4">{res.end}</td>
                          <td className="py-4 font-extrabold">{res.value}€</td>
                          <td className="py-4">
                            <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${
                              res.status === 'Confirmada' ? 'bg-emerald-500/10 text-emerald-500' :
                              res.status === 'Pendente' ? 'bg-amber-500/10 text-amber-500' :
                              res.status === 'Em Curso' ? 'bg-blue-500/10 text-blue-500' :
                              res.status === 'Concluída' ? 'bg-slate-500/10 text-slate-400' : 'bg-red-500/10 text-red-500'
                            }`}>
                              {res.status}
                            </span>
                          </td>
                          <td className="py-4 text-right space-x-1">
                            <button 
                              onClick={() => setSelectedResDetails(res)} 
                              className="px-2 py-1 bg-slate-500/10 hover:bg-slate-500/20 rounded-md text-[10px] font-bold"
                            >
                              Detalhes
                            </button>
                            {res.status === 'Pendente' && (
                              <button 
                                onClick={() => {
                                  setReservations(prev => prev.map(r => r.id === res.id ? {...r, status: 'Confirmada'} : r));
                                  alert('Reserva aprovada e confirmada!');
                                }}
                                className="px-2 py-1 bg-emerald-500 text-white rounded-md text-[10px] font-bold hover:bg-emerald-600"
                              >
                                Confirmar
                              </button>
                            )}
                            {res.status !== 'Concluída' && res.status !== 'Cancelada' && (
                              <button 
                                onClick={() => {
                                  setReservations(prev => prev.map(r => r.id === res.id ? {...r, status: 'Cancelada'} : r));
                                  alert('Reserva cancelada com sucesso.');
                                }}
                                className="px-2 py-1 bg-red-500/10 text-red-500 rounded-md text-[10px] font-bold hover:bg-red-500/20"
                              >
                                Cancelar
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
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
                        ? 'bg-blue-600 text-white' 
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
                  (v.brand.toLowerCase().includes(searchQuery.toLowerCase()) || v.model.toLowerCase().includes(searchQuery.toLowerCase()) || v.plate.toLowerCase().includes(searchQuery.toLowerCase()))
                ).map((veh) => (
                  <div key={veh.id} className={`rounded-3xl border overflow-hidden transition-all duration-200 hover:shadow-xl ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                    <div className="h-48 relative overflow-hidden bg-slate-200">
                      <img src={veh.image} alt={veh.model} className="w-full h-full object-cover transition-transform duration-300 hover:scale-105" />
                      <span className={`absolute top-4 right-4 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${
                        veh.status === 'Disponível' ? 'bg-emerald-500 text-white' :
                        veh.status === 'Reservado' ? 'bg-amber-500 text-white' :
                        veh.status === 'Alugado' ? 'bg-blue-500 text-white' : 'bg-red-500 text-white'
                      }`}>
                        {veh.status}
                      </span>
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
                <h2 className="text-2xl font-black uppercase tracking-tight">Lista de Clientes</h2>
                <p className="text-slate-400 text-xs mt-1">Ficheiro com os condutores registados na plataforma.</p>
              </div>

              <div className={`p-6 rounded-3xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-slate-200/50 text-slate-400 uppercase font-black tracking-wider">
                        <th className="pb-3">Nome</th>
                        <th className="pb-3">Email</th>
                        <th className="pb-3">Contacto</th>
                        <th className="pb-3">NIF</th>
                        <th className="pb-3 text-right">Carta de Condução</th>
                      </tr>
                    </thead>
                    <tbody>
                      {clients.filter(c => 
                        c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        c.email.toLowerCase().includes(searchQuery.toLowerCase())
                      ).map((client) => (
                        <tr key={client.id} className="border-b border-slate-250/30 last:border-0 hover:bg-slate-500/5">
                          <td className="py-4 font-bold">{client.name}</td>
                          <td className="py-4 text-slate-400">{client.email}</td>
                          <td className="py-4">{client.phone}</td>
                          <td className="py-4">{client.nif}</td>
                          <td className="py-4 text-right font-mono font-bold text-slate-500">{client.license}</td>
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
                <h2 className="text-2xl font-black uppercase tracking-tight">Check-In & Check-Out do Dia</h2>
                <p className="text-slate-400 text-xs mt-1">Realize a verificação, registe danos e recolha a assinatura digital.</p>
              </div>

              {!activeCheckFlow ? (
                <div className={`p-8 border-4 border-dashed rounded-[3rem] text-center max-w-xl mx-auto space-y-4 ${darkMode ? 'border-slate-800 text-slate-400' : 'border-slate-200 text-slate-500'}`}>
                  <HelpCircle className="w-16 h-16 mx-auto opacity-20" />
                  <p className="font-extrabold uppercase tracking-wider text-xs">Nenhum processo ativo no momento</p>
                  <p className="text-[11px] leading-relaxed max-w-xs mx-auto">Selecione uma reserva a decorrer hoje na página principal ou abaixo para realizar a entrega (check-in) ou a devolução (check-out) da viatura.</p>
                  
                  <div className="pt-4 border-t border-slate-200/50 mt-4 space-y-2 text-left">
                    <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Reservas de hoje:</p>
                    {reservations.slice(0, 3).map((res, idx) => (
                      <div key={idx} className="flex justify-between items-center p-3.5 bg-slate-500/5 rounded-2xl border border-slate-200/10">
                        <div>
                          <span className="text-[10px] font-bold text-blue-500">{res.id}</span>
                          <p className="text-xs font-bold">{res.client}</p>
                        </div>
                        <div className="flex gap-2">
                          <button 
                            onClick={() => { setSelectedCheckRes(res); setActiveCheckFlow('in'); }}
                            className="px-3 py-1.5 bg-emerald-500 text-white rounded-lg text-[9px] font-black uppercase"
                          >
                            Check-In
                          </button>
                          <button 
                            onClick={() => { setSelectedCheckRes(res); setActiveCheckFlow('out'); }}
                            className="px-3 py-1.5 bg-orange-500 text-white rounded-lg text-[9px] font-black uppercase"
                          >
                            Check-Out
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                  
                  {/* Left Column: Visual Damage Map (Wireframe) */}
                  <div className={`p-6 rounded-3xl border space-y-6 ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                    <div className="flex justify-between items-center">
                      <h3 className="font-extrabold text-xs uppercase tracking-widest text-slate-400">Mapa Visual de Danos</h3>
                      <button onClick={() => setDamageLog([])} className="text-[10px] text-red-500 hover:underline">Limpar</button>
                    </div>
                    
                    {/* Car outline mockup box */}
                    <div className="relative w-full h-96 border border-slate-200/10 rounded-2xl bg-slate-500/5 flex items-center justify-center">
                      {/* Car wireframe drawing representation via SVG */}
                      <svg viewBox="0 0 100 200" className="w-44 h-80 text-slate-400 fill-none stroke-current stroke-1 opacity-40">
                        {/* Car Silhouette (Top Down view) */}
                        <path d="M 30,20 Q 30,5 50,5 Q 70,5 70,20 L 72,50 L 75,70 L 75,120 L 72,160 L 70,190 Q 50,195 30,190 L 28,160 L 25,120 L 25,70 L 28,50 Z" />
                        {/* Windshield */}
                        <path d="M 32,55 L 68,55 L 63,75 L 37,75 Z" />
                        {/* Back glass */}
                        <path d="M 34,145 L 66,145 L 62,160 L 38,160 Z" />
                        {/* Tires */}
                        <rect x="21" y="30" width="4" height="15" rx="1" className="fill-current" />
                        <rect x="75" y="30" width="4" height="15" rx="1" className="fill-current" />
                        <rect x="21" y="150" width="4" height="15" rx="1" className="fill-current" />
                        <rect x="75" y="150" width="4" height="15" rx="1" className="fill-current" />
                      </svg>

                      {/* Clickable hotspots for damage points */}
                      {damagePoints.map((pt) => {
                        const active = damageLog.includes(pt.id);
                        return (
                          <button
                            key={pt.id}
                            onClick={() => toggleDamage(pt.id)}
                            style={{ left: pt.x, top: pt.y }}
                            title={pt.label}
                            className={`absolute -translate-x-1/2 -translate-y-1/2 w-7 h-7 rounded-full flex items-center justify-center text-[8px] font-black border transition-all ${
                              active 
                                ? 'bg-red-500 text-white border-red-400 scale-110 shadow-lg shadow-red-500/30' 
                                : 'bg-white text-slate-700 border-slate-350 hover:scale-105'
                            }`}
                          >
                            {active ? 'X' : '!'}
                          </button>
                        );
                      })}
                    </div>

                    <div className="space-y-1">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Danos Selecionados:</p>
                      {damageLog.length === 0 ? (
                        <p className="text-xs italic text-slate-400">Nenhum dano registado.</p>
                      ) : (
                        <div className="flex flex-wrap gap-1.5">
                          {damageLog.map(d => (
                            <span key={d} className="bg-red-500/10 text-red-500 px-2 py-0.5 rounded text-[10px] font-bold">
                              {damagePoints.find(p => p.id === d)?.label || d}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Middle Column: Photos & Summary */}
                  <div className={`p-6 rounded-3xl border space-y-6 ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                    <div>
                      <h3 className="font-extrabold text-xs uppercase tracking-widest text-slate-400">Detalhes & Fotos</h3>
                      <p className="text-[10px] text-slate-450 mt-1">Carregue imagens do estado atual no momento da entrega/receção.</p>
                    </div>

                    {/* Photos list mockup */}
                    <div className="grid grid-cols-2 gap-3">
                      {photoMockList.map((url, i) => (
                        <div key={i} className="aspect-video bg-slate-100 rounded-xl overflow-hidden relative group">
                          <img src={url} className="w-full h-full object-cover" alt="Check-in State" />
                          <button 
                            onClick={() => setPhotoMockList(prev => prev.filter((_, idx) => idx !== i))}
                            className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      ))}
                      <button 
                        onClick={triggerPhotoUpload}
                        className="aspect-video rounded-xl border-2 border-dashed border-slate-200/60 dark:border-slate-800 flex flex-col items-center justify-center text-slate-400 hover:bg-slate-500/5"
                      >
                        <Plus size={20} />
                        <span className="text-[9px] font-black uppercase mt-1">Simular Foto</span>
                      </button>
                    </div>

                    <div className="space-y-3 border-t border-slate-200/50 pt-4 text-xs">
                      <p className="font-black uppercase tracking-wider text-[10px] text-slate-450">Ficha Técnica do Processo</p>
                      <div>Cliente: <span className="font-bold">{selectedCheckRes.client}</span></div>
                      <div>Reserva: <span className="font-bold text-blue-500">{selectedCheckRes.id}</span></div>
                      <div>Viatura: <span className="font-bold">{selectedCheckRes.vehicle}</span></div>
                      <div>Fase: <span className="font-black text-blue-500 uppercase">{activeCheckFlow === 'in' ? 'Entrega / Levantamento' : 'Devolução'}</span></div>
                    </div>
                  </div>

                  {/* Right Column: Signature & Validation */}
                  <div className={`p-6 rounded-3xl border space-y-6 ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                    <div className="flex justify-between items-center">
                      <h3 className="font-extrabold text-xs uppercase tracking-widest text-slate-400">Assinatura Digital</h3>
                      <button onClick={clearSignature} className="text-[10px] text-red-500 hover:underline">Limpar</button>
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
                            setDeliveryConfirmed(true);
                            // Update reservation status in local database simulation
                            setReservations(prev => prev.map(r => 
                              r.id === selectedCheckRes.id 
                                ? {...r, status: activeCheckFlow === 'in' ? 'Em Curso' : 'Concluída'} 
                                : r
                            ));
                            alert('Sucesso: Assinatura e dados salvos no servidor Azores4you (Firebase Ready)!');
                          }}
                          className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-xs font-black uppercase tracking-widest transition-all active:scale-95 shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2"
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

              <div className={`p-6 rounded-3xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
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
                      {reservations.map((res, i) => (
                        <tr key={i} className="border-b border-slate-250/30 last:border-0 hover:bg-slate-500/5">
                          <td className="py-4 font-bold text-blue-500">{res.id}</td>
                          <td className="py-4 font-bold">{res.client}</td>
                          <td className="py-4 font-extrabold">{res.value}€</td>
                          <td className="py-4 text-emerald-500">{(res.value * 0.2).toFixed(2)}€</td>
                          <td className="py-4">150.00€ (Caução)</td>
                          <td className="py-4">Cartão de Crédito</td>
                          <td className="py-4 text-right">
                            <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                              res.status === 'Cancelada' ? 'bg-red-500/10 text-red-500' : 'bg-emerald-500/10 text-emerald-500'
                            }`}>
                              {res.status === 'Cancelada' ? 'Reembolsado' : 'Aprovado'}
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

          {/* TAB 7: MANUTENÇÃO */}
          {activeTab === 'manutencao' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-black uppercase tracking-tight">Manutenção de Viaturas</h2>
                <p className="text-slate-400 text-xs mt-1">Registo de revisões mecânicas, avarias e controlo de custos.</p>
              </div>

              <div className={`p-6 rounded-3xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
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
                        <tr key={m.id} className="border-b border-slate-250/30 last:border-0 hover:bg-slate-500/5">
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
                    className="px-4 py-2 bg-red-600 text-white rounded-xl text-[10px] font-black uppercase flex items-center gap-1.5 hover:bg-red-700"
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
                  <div key={i} className={`p-6 rounded-3xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
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
                  <div key={rev.id} className={`p-6 rounded-3xl border space-y-3 ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
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
                <p className="text-slate-400 text-xs mt-1">Gerencie os dados públicos, email e termos de aluguer da companhia.</p>
              </div>

              <div className={`p-8 rounded-3xl border max-w-2xl space-y-6 ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-400">Nome Público da Rent-a-car</label>
                    <input className="w-full border p-3 rounded-xl bg-transparent outline-none" defaultValue={business.name} />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-slate-400">Cidade / Localização</label>
                    <input className="w-full border p-3 rounded-xl bg-transparent outline-none" defaultValue={business.address} />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-slate-400">Email Administrativo</label>
                    <input className="w-full border p-3 rounded-xl bg-transparent outline-none" defaultValue={business.adminEmail} />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-slate-400">Telefone Público</label>
                    <input className="w-full border p-3 rounded-xl bg-transparent outline-none" defaultValue={business.contact} />
                  </div>
                </div>

                <button 
                  onClick={() => alert('Configurações atualizadas localmente!')}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black uppercase tracking-widest"
                >
                  Gravar Configurações
                </button>
              </div>
            </div>
          )}

          {/* TAB 11: DATABASE (FIREBASE READY SCHEMA) */}
          {activeTab === 'database' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-black uppercase tracking-tight">Preparação Base de Dados (Firebase Ready)</h2>
                <p className="text-slate-400 text-xs mt-1">Visualização do modelo de coleções pronto a carregar na Firebase Console.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { 
                    col: 'rentcar_reservations',
                    schema: {
                      id: "string (PK)",
                      clientId: "string (FK -> rentcar_clients.id)",
                      vehicleId: "string (FK -> rentcar_vehicles.id)",
                      pickupDate: "timestamp",
                      returnDate: "timestamp",
                      totalPrice: "number",
                      paymentStatus: "string (paid | pending | refunded)",
                      signatureUrl: "string (Cloudinary WebP link)",
                      damages: "array [string]"
                    }
                  },
                  { 
                    col: 'rentcar_vehicles',
                    schema: {
                      id: "string (PK)",
                      brand: "string",
                      model: "string",
                      licensePlate: "string",
                      category: "string (economico | suv | eletrico | luxo)",
                      status: "string (available | reserved | rented | maintenance)",
                      dailyRate: "number",
                      imageUrl: "string",
                      specs: { seats: 5, fuel: "Gasolina", gearbox: "Manual" }
                    }
                  },
                  { 
                    col: 'rentcar_clients',
                    schema: {
                      id: "string (PK)",
                      fullName: "string",
                      email: "string (unique)",
                      phone: "string",
                      nif: "string",
                      drivingLicense: "string"
                    }
                  },
                  { 
                    col: 'rentcar_payments',
                    schema: {
                      id: "string (PK)",
                      reservationId: "string (FK)",
                      amount: "number",
                      date: "timestamp",
                      paymentMethod: "string",
                      status: "string (approved | failed)"
                    }
                  }
                ].map((colObj, idx) => (
                  <div key={idx} className={`p-6 rounded-3xl border space-y-4 ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                    <div className="flex justify-between items-center">
                      <span className="font-extrabold text-sm text-blue-500 font-mono">Collection: {colObj.col}</span>
                      <span className="text-[8px] font-black uppercase bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded">Pronto para Produção</span>
                    </div>
                    <pre className="text-[10px] font-mono p-4 rounded-xl bg-slate-950 text-emerald-400 overflow-x-auto leading-relaxed border border-slate-850">
                      {JSON.stringify(colObj.schema, null, 2)}
                    </pre>
                  </div>
                ))}
              </div>
            </div>
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
              className={`w-full max-w-md rounded-[2.5rem] p-8 relative shadow-2xl ${darkMode ? 'bg-slate-900 text-white' : 'bg-white text-slate-800'}`}
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
                    <span className="font-bold">{selectedResDetails.client}</span>
                  </div>
                  <div className="flex justify-between border-b pb-2 border-slate-200/50">
                    <span className="text-slate-400">Email</span>
                    <span className="font-bold">{selectedResDetails.email}</span>
                  </div>
                  <div className="flex justify-between border-b pb-2 border-slate-200/50">
                    <span className="text-slate-400">Viatura</span>
                    <span className="font-bold">{selectedResDetails.vehicle}</span>
                  </div>
                  <div className="flex justify-between border-b pb-2 border-slate-200/50">
                    <span className="text-slate-400">Início</span>
                    <span className="font-bold">{selectedResDetails.start}</span>
                  </div>
                  <div className="flex justify-between border-b pb-2 border-slate-200/50">
                    <span className="text-slate-400">Fim</span>
                    <span className="font-bold">{selectedResDetails.end}</span>
                  </div>
                  <div className="flex justify-between border-b pb-2 border-slate-200/50">
                    <span className="text-slate-400">Valor Pago</span>
                    <span className="font-black text-blue-500">{selectedResDetails.value}€</span>
                  </div>
                  <div className="flex justify-between pb-2">
                    <span className="text-slate-400">Estado</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                      selectedResDetails.status === 'Confirmada' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'
                    }`}>{selectedResDetails.status}</span>
                  </div>
                </div>

                <button 
                  onClick={() => setSelectedResDetails(null)} 
                  className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-xs font-black uppercase tracking-widest transition-all"
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
              className={`w-full max-w-lg rounded-[2.5rem] p-8 relative shadow-2xl ${darkMode ? 'bg-slate-900 text-white' : 'bg-white text-slate-800'}`}
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
                  image: form.image.value || 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=400&q=80',
                  year: parseInt(form.year.value) || 2022,
                  insuranceExp: form.insuranceExp.value,
                  inspectionExp: form.inspectionExp.value
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
                    <select name="category" defaultValue={editingVeh?.category || 'Económico'} className="w-full border p-3 rounded-xl bg-transparent bg-slate-900 outline-none">
                      <option value="Económico">Económico</option>
                      <option value="SUV">SUV</option>
                      <option value="Elétrico">Elétrico</option>
                      <option value="Luxo">Luxo</option>
                      <option value="Comerciais">Comerciais</option>
                    </select>
                  </div>
                  <div className="space-y-1 col-span-2">
                    <label className="font-bold text-slate-450">URL da Imagem</label>
                    <input name="image" defaultValue={editingVeh?.image || ''} className="w-full border p-3 rounded-xl bg-transparent outline-none" placeholder="https://..." />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-slate-450">Ano</label>
                    <input name="year" type="number" defaultValue={editingVeh?.year || 2022} className="w-full border p-3 rounded-xl bg-transparent outline-none" />
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

    </div>
  );
}
