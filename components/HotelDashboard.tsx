import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Calendar, Bed, CheckSquare, Users, Plus, Edit, Trash2, 
  ArrowRight, LogOut, Settings, MessageSquare, Star, BarChart3, 
  X, Check, Search, Bell, Sun, Moon, Info, PlusCircle, Trash, CheckCircle2, 
  AlertTriangle, Coffee, DollarSign, Home, Key, UserCheck, ChevronRight, FileText, Download
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { API_BASE_URL } from '../config';

interface HotelDashboardProps {
  business: any;
  onUpdateBusiness: (updated: any) => void;
  onLogout: () => void;
  language?: string;
}

type Tab = 'dashboard' | 'reservas' | 'calendario' | 'quartos' | 'checkin' | 'hospedes' | 'extras' | 'housekeeping' | 'restaurante' | 'mensagens' | 'avaliacoes' | 'relatorios' | 'configuracoes';

export default function HotelDashboard({ business, onUpdateBusiness, onLogout, language = 'pt' }: HotelDashboardProps) {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [darkMode, setDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedRouteId, setExpandedRouteId] = useState<string | null>(null);

  // Core business-related state lists
  const [reservations, setReservations] = useState<any[]>(() => business.reservations || []);
  const [rooms, setRooms] = useState<any[]>(() => business.rooms || [
    { id: '101', name: 'Quarto 101', type: 'T1 Deluxe', status: 'Disponível', price: 120 },
    { id: '102', name: 'Quarto 102', type: 'T2 Family', status: 'Ocupado', price: 180, guest: 'João Silva' },
    { id: '103', name: 'Quarto 103', type: 'T1 Suite', status: 'Reservado', price: 220 },
    { id: '104', name: 'Quarto 104', type: 'T1 Standard', status: 'Indisponível', price: 90 }
  ]);
  const [housekeeping, setHousekeeping] = useState<any[]>(() => business.housekeeping || [
    { id: 'hk_1', room: '101', task: 'Limpeza Geral', status: 'Limpo', staff: 'Maria Do Carmo' },
    { id: 'hk_2', room: '102', task: 'Troca de Lençóis', status: 'Pendente', staff: 'Ana Sousa' },
    { id: 'hk_3', room: '104', task: 'Manutenção de A/C', status: 'Em Progresso', staff: 'Carlos Vaz' }
  ]);
  const [extras, setExtras] = useState<any[]>(() => business.extras || [
    { id: 'ext_1', name: 'Pequeno-almoço no quarto', price: 15, description: 'Pequeno-almoço continental servido no quarto' },
    { id: 'ext_2', name: 'Transfer do Aeroporto', price: 30, description: 'Serviço de transfer de e para o aeroporto' },
    { id: 'ext_3', name: 'Aluguer de Bicicleta', price: 10, description: 'Aluguer diário de bicicleta de passeio' }
  ]);
  const [selectedResChat, setSelectedResChat] = useState<any | null>(null);
  const [chatInput, setChatInput] = useState('');

  // Sync state if business updates
  useEffect(() => {
    if (business.reservations) setReservations(business.reservations);
    if (business.rooms) setRooms(business.rooms);
    if (business.housekeeping) setHousekeeping(business.housekeeping);
    if (business.extras) setExtras(business.extras);
  }, [business]);

  const saveUpdatedBusiness = async (updatedFields: Partial<typeof business>) => {
    const updatedBiz = { ...business, ...updatedFields };
    await onUpdateBusiness(updatedBiz);
  };

  const handleUpdateReservation = async (updatedRes: any) => {
    const updatedList = reservations.map(r => r.id === updatedRes.id ? updatedRes : r);
    setReservations(updatedList);
    await saveUpdatedBusiness({ reservations: updatedList });

    // Sync notification logic
    try {
      await fetch(`${API_BASE_URL}/api/reservations/${updatedRes.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedRes)
      });
    } catch (e) {
      console.error(e);
    }
  };

  // KPIs
  const todayStr = new Date().toLocaleDateString('pt-PT');
  const reservationsToday = reservations.filter(r => new Date(r.createdAt || Date.now()).toLocaleDateString('pt-PT') === todayStr).length;
  const checkinsToday = reservations.filter(r => r.checkinDate === todayStr || r.date === todayStr).length;
  const checkoutsToday = reservations.filter(r => r.checkoutDate === todayStr).length;
  const hostedGuests = rooms.filter(r => r.status === 'Ocupado').length;
  const totalRevenue = reservations.filter(r => r.status === 'accepted' || r.status === 'Confirmada').reduce((sum, r) => sum + (Number(r.price) || 0), 0);
  const occupancyRate = rooms.length ? Math.round((rooms.filter(r => r.status === 'Ocupado').length / rooms.length) * 100) : 0;

  // Add Room
  const [newRoomName, setNewRoomName] = useState('');
  const [newRoomType, setNewRoomType] = useState('T1 Standard');
  const [newRoomPrice, setNewRoomPrice] = useState(100);
  const [newRoomStatus, setNewRoomStatus] = useState('Disponível');

  const handleAddRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoomName) return;
    const newRoom = { id: `room_${Date.now()}`, name: newRoomName, type: newRoomType, price: Number(newRoomPrice), status: newRoomStatus };
    const updated = [...rooms, newRoom];
    setRooms(updated);
    await saveUpdatedBusiness({ rooms: updated });
    setNewRoomName('');
  };

  // Housekeeping Task Add
  const [hkRoom, setHkRoom] = useState('');
  const [hkTask, setHkTask] = useState('Limpeza Geral');
  const [hkStaff, setHkStaff] = useState('');

  const handleAddHkTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hkRoom || !hkStaff) return;
    const newTask = { id: `hk_${Date.now()}`, room: hkRoom, task: hkTask, status: 'Pendente', staff: hkStaff };
    const updated = [...housekeeping, newTask];
    setHousekeeping(updated);
    await saveUpdatedBusiness({ housekeeping: updated });
    setHkRoom('');
    setHkStaff('');
  };

  // Extras Add
  const [extName, setExtName] = useState('');
  const [extPrice, setExtPrice] = useState(10);
  const [extDesc, setExtDesc] = useState('');

  const handleAddExtra = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!extName) return;
    const newExt = { id: `ext_${Date.now()}`, name: extName, price: Number(extPrice), description: extDesc };
    const updated = [...extras, newExt];
    setExtras(updated);
    await saveUpdatedBusiness({ extras: updated });
    setExtName('');
    setExtDesc('');
  };

  const handleSendMessage = async () => {
    if (!chatInput.trim() || !selectedResChat) return;
    const newMsg = {
      sender: 'admin',
      text: chatInput.trim(),
      timestamp: new Date().toISOString()
    };
    const updatedMessages = [...(selectedResChat.chatMessages || []), newMsg];
    const updatedRes = { ...selectedResChat, chatMessages: updatedMessages };
    setSelectedResChat(updatedRes);
    setChatInput('');
    await handleUpdateReservation(updatedRes);
  };

  return (
    <div className={`min-h-screen flex font-sans transition-colors duration-300 ${darkMode ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-800'}`}>
      
      {/* ── SIDEBAR NAVIGATION ── */}
      <aside className="w-72 bg-[#0d1629] text-white flex flex-col justify-between shrink-0 border-r border-slate-800 shadow-xl relative z-10">
        <div>
          {/* Logo Header */}
          <div className="p-6 flex items-center gap-3.5 border-b border-slate-800">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-600 flex items-center justify-center text-[#0d1629] shadow-lg shadow-amber-500/20">
              <Home size={22} />
            </div>
            <div>
              <h1 className="font-extrabold text-sm tracking-widest uppercase leading-none">AzoresToYou</h1>
              <p className="text-[10px] uppercase tracking-wider text-amber-500 font-bold mt-1">Hóspede Portal</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1 overflow-y-auto max-h-[calc(100vh-180px)]">
            {([
              { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
              { id: 'reservas', label: 'Reservas', icon: <Calendar size={18} /> },
              { id: 'calendario', label: 'Calendário', icon: <Calendar size={18} /> },
              { id: 'quartos', label: 'Quartos / Unidades', icon: <Bed size={18} /> },
              { id: 'checkin', label: 'Check-In / Out', icon: <Key size={18} /> },
              { id: 'hospedes', label: 'Hóspedes', icon: <Users size={18} /> },
              { id: 'extras', label: 'Extras & Serviços', icon: <Coffee size={18} /> },
              { id: 'housekeeping', label: 'Housekeeping', icon: <CheckSquare size={18} /> },
              { id: 'restaurante', label: 'Restaurante (Em breve)', icon: <Coffee size={18} /> },
              { id: 'mensagens', label: 'Mensagens', icon: <MessageSquare size={18} />, count: reservations.filter(r => r.chatMessages && r.chatMessages.some((m: any) => m.sender === 'client')).length },
              { id: 'avaliacoes', label: 'Avaliações', icon: <Star size={18} /> },
              { id: 'relatorios', label: 'Relatórios & Finanças', icon: <BarChart3 size={18} /> },
              { id: 'configuracoes', label: 'Configurações', icon: <Settings size={18} /> }
            ] as const).map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between p-3 rounded-xl text-xs font-semibold tracking-wider transition-all duration-200 group ${
                  activeTab === item.id 
                    ? 'bg-amber-500 text-slate-950 font-black shadow-lg shadow-amber-500/20' 
                    : 'hover:bg-slate-800/50 text-slate-400 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <span className={activeTab === item.id ? 'text-slate-950' : 'text-slate-500 group-hover:text-white'}>{item.icon}</span>
                  <span>{item.label}</span>
                </div>
                {('count' in item) && item.count && item.count > 0 ? (
                  <span className="bg-red-500 text-white text-[9px] font-black px-2 py-0.5 rounded-full">{item.count}</span>
                ) : null}
              </button>
            ))}
          </nav>
        </div>

        {/* Footer actions */}
        <div className="p-4 border-t border-slate-800 space-y-2">
          <button 
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 p-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl text-xs font-black uppercase tracking-widest transition-all cursor-pointer border border-red-500/15"
          >
            <LogOut size={14} />
            <span>Terminar Sessão</span>
          </button>
        </div>
      </aside>

      {/* ── MAIN CONTENT AREA ── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* Top Navbar */}
        <header className={`h-20 flex items-center justify-between px-8 border-b shrink-0 relative z-10 ${
          darkMode ? 'bg-slate-950 border-slate-900' : 'bg-white border-slate-200'
        }`}>
          <div>
            <h2 className="text-lg font-black tracking-tight uppercase flex items-center gap-2">
              Olá, {business.name || 'Parceiro'} 👋
            </h2>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-0.5">Bem-vindo ao seu painel de gestão</p>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                darkMode ? 'bg-slate-900 border-slate-800 text-yellow-400 hover:bg-slate-800' : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'
              }`}
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
        </header>

        {/* Content Container */}
        <main className="flex-1 overflow-y-auto p-8 relative">
          <AnimatePresence mode="wait">
            
            {/* ── TAB 1: DASHBOARD ── */}
            {activeTab === 'dashboard' && (
              <motion.div 
                key="dashboard"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-8"
              >
                {/* KPIs grid */}
                <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
                  {[
                    { label: 'Reservas Hoje', value: reservationsToday, color: 'text-blue-500', bg: 'bg-blue-500/10' },
                    { label: 'Check-ins Hoje', value: checkinsToday, color: 'text-amber-500', bg: 'bg-amber-500/10' },
                    { label: 'Check-outs Hoje', value: checkoutsToday, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
                    { label: 'Hóspedes Alojados', value: hostedGuests, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
                    { label: 'Receita Total', value: `${totalRevenue}€`, color: 'text-pink-500', bg: 'bg-pink-500/10' },
                    { label: 'Taxa Ocupação', value: `${occupancyRate}%`, color: 'text-teal-500', bg: 'bg-teal-500/10' }
                  ].map((kpi, idx) => (
                    <div key={idx} className={`p-4 rounded-2xl border flex flex-col justify-between shadow-sm ${
                      darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                    }`}>
                      <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider">{kpi.label}</span>
                      <div className="flex items-end justify-between mt-3">
                        <span className={`text-2xl font-black ${kpi.color}`}>{kpi.value}</span>
                        <div className={`p-1.5 rounded-lg ${kpi.bg} ${kpi.color}`}>
                          <Home size={14} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Quick actions row */}
                <div className="flex flex-wrap gap-3">
                  <button onClick={() => setActiveTab('reservas')} className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer shadow-md shadow-amber-500/10">
                    + Nova Reserva
                  </button>
                  <button onClick={() => setActiveTab('calendario')} className="px-4 py-2.5 bg-slate-500/10 hover:bg-slate-500/20 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer border border-slate-300/20">
                    Bloquear Datas
                  </button>
                  <button onClick={() => setActiveTab('extras')} className="px-4 py-2.5 bg-slate-500/10 hover:bg-slate-500/20 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer border border-slate-300/20">
                    Serviços & Extras
                  </button>
                  <button onClick={() => setActiveTab('relatorios')} className="px-4 py-2.5 bg-slate-500/10 hover:bg-slate-500/20 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer border border-slate-300/20">
                    Relatórios
                  </button>
                </div>

                {/* Main section grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Occupancy Calendar */}
                  <div className={`lg:col-span-2 p-6 rounded-[2rem] border shadow-sm flex flex-col ${
                    darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                  }`}>
                    <h3 className="font-extrabold uppercase text-xs tracking-widest text-slate-400 mb-4">Estado Geral de Ocupação</h3>
                    <div className="grid grid-cols-7 gap-2 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 border-b pb-2 border-slate-200/20">
                      <span>Seg</span><span>Ter</span><span>Qua</span><span>Qui</span><span>Sex</span><span>Sáb</span><span>Dom</span>
                    </div>
                    <div className="grid grid-cols-7 gap-2">
                      {Array.from({ length: 28 }).map((_, idx) => {
                        const states = ['Disponível', 'Ocupado', 'Reservado', 'Indisponível'];
                        const state = states[(idx * 7) % 4];
                        const colors = {
                          'Disponível': 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
                          'Ocupado': 'bg-red-500/10 text-red-500 border-red-500/20',
                          'Reservado': 'bg-amber-500/10 text-amber-500 border-amber-500/20',
                          'Indisponível': 'bg-slate-500/10 text-slate-500 border-slate-500/20'
                        };
                        return (
                          <div key={idx} className={`p-3 rounded-xl border text-center font-black text-xs ${colors[state]}`}>
                            {idx + 1}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Tasks & house keeping status */}
                  <div className={`p-6 rounded-[2rem] border shadow-sm flex flex-col justify-between ${
                    darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                  }`}>
                    <div>
                      <h3 className="font-extrabold uppercase text-xs tracking-widest text-slate-400 mb-4">Tarefas do Dia</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-slate-500/5 rounded-xl border border-slate-350/5">
                          <span className="text-xs font-bold">Check-ins pendentes</span>
                          <span className="px-2 py-0.5 bg-amber-500/10 text-amber-500 rounded text-[10px] font-black">{checkinsToday}</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-slate-500/5 rounded-xl border border-slate-350/5">
                          <span className="text-xs font-bold">Check-outs pendentes</span>
                          <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-500 rounded text-[10px] font-black">{checkoutsToday}</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-slate-500/5 rounded-xl border border-slate-350/5">
                          <span className="text-xs font-bold">Quartos Sujos (Housekeeping)</span>
                          <span className="px-2 py-0.5 bg-red-500/10 text-red-500 rounded text-[10px] font-black">
                            {housekeeping.filter(h => h.status === 'Pendente').length}
                          </span>
                        </div>
                      </div>
                    </div>

                    <button onClick={() => setActiveTab('housekeeping')} className="w-full mt-6 py-2.5 bg-slate-500/10 hover:bg-slate-500/20 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-black uppercase tracking-wider transition-all border border-slate-300/20 flex items-center justify-center gap-1.5 cursor-pointer">
                      <span>Gerir Limpezas</span>
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </div>

                {/* Recent reservations table */}
                <div className={`p-6 rounded-[2rem] border shadow-sm overflow-hidden ${
                  darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                }`}>
                  <h3 className="font-extrabold uppercase text-xs tracking-widest text-slate-400 mb-4">Reservas Recentes</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-slate-200/20 text-[10px] font-black uppercase text-slate-450 tracking-wider">
                          <th className="py-3 px-4">Hóspede</th>
                          <th className="py-3 px-4">Datas</th>
                          <th className="py-3 px-4">Valor</th>
                          <th className="py-3 px-4">Estado</th>
                        </tr>
                      </thead>
                      <tbody>
                        {reservations.slice(0, 5).map((res) => (
                          <tr key={res.id} className="border-b border-slate-200/10 text-xs">
                            <td className="py-3 px-4 font-bold">{res.customerName || res.client || 'Hóspede'}</td>
                            <td className="py-3 px-4 text-slate-400 font-bold">{res.date} ({res.days || 1} dias)</td>
                            <td className="py-3 px-4 font-black text-amber-600">{res.price || 120}€</td>
                            <td className="py-3 px-4">
                              <span className={`px-2.5 py-0.5 rounded-lg text-[9px] font-black uppercase ${
                                res.status === 'accepted' || res.status === 'Confirmada' ? 'bg-emerald-500/15 text-emerald-600' :
                                res.status === 'pending' || res.status === 'Pendente' ? 'bg-amber-500/15 text-amber-600' : 'bg-red-500/15 text-red-500'
                              }`}>
                                {res.status || 'Pendente'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── TAB 2: RESERVAS ── */}
            {activeTab === 'reservas' && (
              <motion.div 
                key="reservas"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-6"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-black uppercase tracking-tight">Registo de Reservas</h2>
                    <p className="text-slate-400 text-xs mt-1">Gerir todas as reservas do alojamento.</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {reservations.map(res => (
                    <div key={res.id} className={`p-6 rounded-[2rem] border shadow-sm flex flex-col md:flex-row justify-between gap-6 ${
                      darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                    }`}>
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-black text-slate-800 dark:text-white">🛎️ {res.customerName || res.client || 'Hóspede'}</span>
                          <span className={`px-2.5 py-0.5 rounded-lg text-[9px] font-black uppercase ${
                            res.status === 'accepted' || res.status === 'Confirmada' ? 'bg-emerald-500/15 text-emerald-600' :
                            res.status === 'pending' || res.status === 'Pendente' ? 'bg-amber-500/15 text-amber-600' : 'bg-red-500/15 text-red-500'
                          }`}>
                            {res.status || 'Pendente'}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">
                          Data: {res.date} · Duração: {res.days || 1} noites · ID: {res.id}
                        </p>
                        {res.phone && <p className="text-xs text-slate-400">📞 Tel: {res.phone}</p>}
                      </div>

                      <div className="flex items-center gap-3">
                        {res.status === 'pending' && (
                          <>
                            <button
                              onClick={async () => {
                                const updated = { ...res, status: 'Confirmada' };
                                await handleUpdateReservation(updated);
                              }}
                              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black uppercase tracking-wider cursor-pointer"
                            >
                              Confirmar
                            </button>
                            <button
                              onClick={async () => {
                                const updated = { ...res, status: 'Rejeitada' };
                                await handleUpdateReservation(updated);
                              }}
                              className="px-4 py-2 bg-red-650 hover:bg-red-700 text-white rounded-xl text-xs font-black uppercase tracking-wider cursor-pointer"
                            >
                              Rejeitar
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => {
                            setSelectedResChat(res);
                            setActiveTab('mensagens');
                          }}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black uppercase tracking-wider cursor-pointer"
                        >
                          Chat / Mensagem
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* ── TAB 3: CALENDÁRIO ── */}
            {activeTab === 'calendario' && (
              <motion.div 
                key="calendario"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-2xl font-black uppercase tracking-tight">Calendário de Reservas</h2>
                  <p className="text-slate-400 text-xs mt-1">Mapa mensal visual de ocupação de quartos.</p>
                </div>
                <div className={`p-6 rounded-[2rem] border shadow-sm ${
                  darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                }`}>
                  <p className="text-xs text-slate-450 italic text-center py-24">A carregar mapa de ocupação interativo...</p>
                </div>
              </motion.div>
            )}

            {/* ── TAB 4: QUARTOS ── */}
            {activeTab === 'quartos' && (
              <motion.div 
                key="quartos"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="grid grid-cols-1 lg:grid-cols-3 gap-6"
              >
                {/* Form to add room */}
                <div className={`p-6 rounded-[2rem] border shadow-sm flex flex-col ${
                  darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                }`}>
                  <h3 className="font-extrabold uppercase text-xs tracking-widest text-slate-400 mb-4">Adicionar Quarto / Unidade</h3>
                  <form onSubmit={handleAddRoom} className="space-y-4">
                    <div>
                      <label className="block text-[9px] font-black uppercase text-slate-400 mb-1">Nome / Número do Quarto</label>
                      <input
                        type="text"
                        value={newRoomName}
                        onChange={(e) => setNewRoomName(e.target.value)}
                        placeholder="Ex: Quarto 105"
                        required
                        className={`w-full px-4 py-2.5 rounded-xl border text-xs font-semibold ${
                          darkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'
                        }`}
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-black uppercase text-slate-400 mb-1">Tipo de Unidade</label>
                      <select
                        value={newRoomType}
                        onChange={(e) => setNewRoomType(e.target.value)}
                        className={`w-full px-4 py-2.5 rounded-xl border text-xs font-semibold ${
                          darkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'
                        }`}
                      >
                        <option value="T1 Standard">T1 Standard</option>
                        <option value="T1 Deluxe">T1 Deluxe</option>
                        <option value="T2 Family">T2 Family</option>
                        <option value="T1 Suite">T1 Suite</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[9px] font-black uppercase text-slate-400 mb-1">Preço por Noite</label>
                      <input
                        type="number"
                        value={newRoomPrice}
                        onChange={(e) => setNewRoomPrice(Number(e.target.value))}
                        required
                        className={`w-full px-4 py-2.5 rounded-xl border text-xs font-semibold ${
                          darkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'
                        }`}
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-[#0d1629] rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer"
                    >
                      Adicionar Unidade
                    </button>
                  </form>
                </div>

                {/* List of rooms */}
                <div className={`lg:col-span-2 p-6 rounded-[2rem] border shadow-sm ${
                  darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                }`}>
                  <h3 className="font-extrabold uppercase text-xs tracking-widest text-slate-400 mb-4">Quartos Registados</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {rooms.map(room => (
                      <div key={room.id} className={`p-4 rounded-xl border flex flex-col justify-between ${
                        darkMode ? 'bg-slate-950 border-slate-850' : 'bg-slate-50 border-slate-200'
                      }`}>
                        <div>
                          <div className="flex justify-between items-start">
                            <span className="font-black text-sm text-slate-800 dark:text-white">{room.name}</span>
                            <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${
                              room.status === 'Disponível' ? 'bg-emerald-500/10 text-emerald-500' :
                              room.status === 'Ocupado' ? 'bg-red-500/10 text-red-500' : 'bg-amber-500/10 text-amber-500'
                            }`}>
                              {room.status}
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-400 mt-1 uppercase font-bold">{room.type}</p>
                          <p className="text-xs text-amber-600 font-bold mt-2">{room.price}€ / noite</p>
                        </div>
                        <button
                          onClick={async () => {
                            if (confirm(`Remover quarto ${room.name}?`)) {
                              const updated = rooms.filter(r => r.id !== room.id);
                              setRooms(updated);
                              await saveUpdatedBusiness({ rooms: updated });
                            }
                          }}
                          className="mt-4 text-red-500 hover:text-red-700 text-[10px] font-black uppercase tracking-widest self-end cursor-pointer"
                        >
                          Remover
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── TAB 5: CHECK-IN / CHECK-OUT ── */}
            {activeTab === 'checkin' && (
              <motion.div 
                key="checkin"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-2xl font-black uppercase tracking-tight">Gestor de Check-In & Check-Out</h2>
                  <p className="text-slate-400 text-xs mt-1">Efetuar entradas e saídas de hóspedes.</p>
                </div>

                <div className="space-y-4">
                  {reservations.filter(r => r.status === 'Confirmada' || r.status === 'Hospedado').map(res => (
                    <div key={res.id} className={`p-6 rounded-[2rem] border shadow-sm flex flex-col md:flex-row justify-between gap-6 ${
                      darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                    }`}>
                      <div>
                        <p className="font-bold text-sm">🛎️ {res.customerName || res.client}</p>
                        <p className="text-xs text-slate-400 font-semibold mt-1">Datas: {res.date} ({res.days || 1} dias)</p>
                      </div>
                      <div className="flex items-center gap-3">
                        {res.status === 'Confirmada' ? (
                          <button
                            onClick={async () => {
                              const updated = { ...res, status: 'Hospedado' };
                              await handleUpdateReservation(updated);
                            }}
                            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black uppercase tracking-wider cursor-pointer"
                          >
                            Fazer Check-In
                          </button>
                        ) : (
                          <button
                            onClick={async () => {
                              const updated = { ...res, status: 'Concluída' };
                              await handleUpdateReservation(updated);
                            }}
                            className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-black uppercase tracking-wider cursor-pointer"
                          >
                            Fazer Check-Out
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* ── TAB 6: HÓSPEDES ── */}
            {activeTab === 'hospedes' && (
              <motion.div 
                key="hospedes"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-2xl font-black uppercase tracking-tight">Fichas de Hóspedes</h2>
                  <p className="text-slate-400 text-xs mt-1">Listagem de clientes e hóspedes que realizaram check-in.</p>
                </div>

                <div className={`p-6 rounded-[2rem] border shadow-sm overflow-hidden ${
                  darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                }`}>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-slate-200/20 text-[10px] font-black uppercase text-slate-450 tracking-wider">
                          <th className="py-3 px-4">Nome</th>
                          <th className="py-3 px-4">Email</th>
                          <th className="py-3 px-4">Telefone</th>
                          <th className="py-3 px-4">Reservas</th>
                        </tr>
                      </thead>
                      <tbody>
                        {reservations.map((res, idx) => (
                          <tr key={idx} className="border-b border-slate-200/10 text-xs">
                            <td className="py-3 px-4 font-bold">{res.customerName || res.client}</td>
                            <td className="py-3 px-4 text-slate-450">{res.customerEmail || 'n/a'}</td>
                            <td className="py-3 px-4 font-semibold">{res.phone || 'n/a'}</td>
                            <td className="py-3 px-4 text-slate-400">1</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── TAB 7: EXTRAS ── */}
            {activeTab === 'extras' && (
              <motion.div 
                key="extras"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="grid grid-cols-1 lg:grid-cols-3 gap-6"
              >
                {/* Form to add extra */}
                <div className={`p-6 rounded-[2rem] border shadow-sm flex flex-col ${
                  darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                }`}>
                  <h3 className="font-extrabold uppercase text-xs tracking-widest text-slate-400 mb-4">Adicionar Serviço Extra</h3>
                  <form onSubmit={handleAddExtra} className="space-y-4">
                    <div>
                      <label className="block text-[9px] font-black uppercase text-slate-400 mb-1">Nome do Serviço</label>
                      <input
                        type="text"
                        value={extName}
                        onChange={(e) => setExtName(e.target.value)}
                        placeholder="Ex: Aluguer de Carro"
                        required
                        className={`w-full px-4 py-2.5 rounded-xl border text-xs font-semibold ${
                          darkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'
                        }`}
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-black uppercase text-slate-400 mb-1">Preço (€)</label>
                      <input
                        type="number"
                        value={extPrice}
                        onChange={(e) => setExtPrice(Number(e.target.value))}
                        required
                        className={`w-full px-4 py-2.5 rounded-xl border text-xs font-semibold ${
                          darkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'
                        }`}
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-black uppercase text-slate-400 mb-1">Descrição</label>
                      <textarea
                        value={extDesc}
                        onChange={(e) => setExtDesc(e.target.value)}
                        placeholder="Ex: Serviço de aluguer de viaturas..."
                        className={`w-full px-4 py-2.5 rounded-xl border text-xs font-semibold ${
                          darkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'
                        }`}
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-[#0d1629] rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer"
                    >
                      Adicionar Serviço
                    </button>
                  </form>
                </div>

                {/* List of extras */}
                <div className={`lg:col-span-2 p-6 rounded-[2rem] border shadow-sm ${
                  darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                }`}>
                  <h3 className="font-extrabold uppercase text-xs tracking-widest text-slate-400 mb-4">Serviços Extras Ativos</h3>
                  <div className="space-y-4">
                    {extras.map(ex => (
                      <div key={ex.id} className={`p-4 rounded-xl border flex justify-between items-center ${
                        darkMode ? 'bg-slate-950 border-slate-850' : 'bg-slate-50 border-slate-200'
                      }`}>
                        <div>
                          <p className="font-bold text-sm">{ex.name}</p>
                          <p className="text-xs text-slate-450 mt-1">{ex.description || 'Sem descrição.'}</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-sm font-black text-amber-600">{ex.price}€</span>
                          <button
                            onClick={async () => {
                              if (confirm(`Remover extra ${ex.name}?`)) {
                                const updated = extras.filter(e => e.id !== ex.id);
                                setExtras(updated);
                                await saveUpdatedBusiness({ extras: updated });
                              }
                            }}
                            className="p-1 hover:bg-red-500/10 text-red-500 rounded-lg transition-all cursor-pointer"
                          >
                            <Trash size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── TAB 8: HOUSEKEEPING ── */}
            {activeTab === 'housekeeping' && (
              <motion.div 
                key="housekeeping"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="grid grid-cols-1 lg:grid-cols-3 gap-6"
              >
                {/* Form to assign cleaning */}
                <div className={`p-6 rounded-[2rem] border shadow-sm flex flex-col ${
                  darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                }`}>
                  <h3 className="font-extrabold uppercase text-xs tracking-widest text-slate-400 mb-4">Atribuir Serviço / Limpeza</h3>
                  <form onSubmit={handleAddHkTask} className="space-y-4">
                    <div>
                      <label className="block text-[9px] font-black uppercase text-slate-400 mb-1">Quarto / Unidade</label>
                      <input
                        type="text"
                        value={hkRoom}
                        onChange={(e) => setHkRoom(e.target.value)}
                        placeholder="Ex: 101"
                        required
                        className={`w-full px-4 py-2.5 rounded-xl border text-xs font-semibold ${
                          darkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'
                        }`}
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-black uppercase text-slate-400 mb-1">Serviço</label>
                      <select
                        value={hkTask}
                        onChange={(e) => setHkTask(e.target.value)}
                        className={`w-full px-4 py-2.5 rounded-xl border text-xs font-semibold ${
                          darkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'
                        }`}
                      >
                        <option value="Limpeza Geral">Limpeza Geral</option>
                        <option value="Troca de Lençóis">Troca de Lençóis</option>
                        <option value="Manutenção / Reparação">Manutenção / Reparação</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[9px] font-black uppercase text-slate-400 mb-1">Staff / Funcionário</label>
                      <input
                        type="text"
                        value={hkStaff}
                        onChange={(e) => setHkStaff(e.target.value)}
                        placeholder="Ex: Maria Do Carmo"
                        required
                        className={`w-full px-4 py-2.5 rounded-xl border text-xs font-semibold ${
                          darkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'
                        }`}
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-[#0d1629] rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer"
                    >
                      Atribuir Tarefa
                    </button>
                  </form>
                </div>

                {/* List of housekeeping tasks */}
                <div className={`lg:col-span-2 p-6 rounded-[2rem] border shadow-sm ${
                  darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                }`}>
                  <h3 className="font-extrabold uppercase text-xs tracking-widest text-slate-400 mb-4">Estado das Limpezas</h3>
                  <div className="space-y-4">
                    {housekeeping.map(hk => (
                      <div key={hk.id} className={`p-4 rounded-xl border flex justify-between items-center ${
                        darkMode ? 'bg-slate-950 border-slate-850' : 'bg-slate-50 border-slate-200'
                      }`}>
                        <div>
                          <p className="font-bold text-sm">Quarto {hk.room} · {hk.task}</p>
                          <p className="text-xs text-slate-450 mt-1">Staff: {hk.staff}</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <select
                            value={hk.status}
                            onChange={async (e) => {
                              const updated = housekeeping.map(h => h.id === hk.id ? { ...h, status: e.target.value } : h);
                              setHousekeeping(updated);
                              await saveUpdatedBusiness({ housekeeping: updated });
                            }}
                            className={`px-3 py-1.5 border rounded-lg text-[10px] font-black uppercase tracking-wider cursor-pointer ${
                              darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-300 text-slate-700'
                            }`}
                          >
                            <option value="Pendente">Pendente</option>
                            <option value="Em Progresso">Em Progresso</option>
                            <option value="Limpo">Limpo</option>
                          </select>
                          <button
                            onClick={async () => {
                              const updated = housekeeping.filter(h => h.id !== hk.id);
                              setHousekeeping(updated);
                              await saveUpdatedBusiness({ housekeeping: updated });
                            }}
                            className="p-1 hover:bg-red-500/10 text-red-500 rounded-lg transition-all cursor-pointer"
                          >
                            <Trash size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── TAB 9: RESTAURANTE (EM BREVE) ── */}
            {activeTab === 'restaurante' && (
              <motion.div 
                key="restaurante"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-2xl font-black uppercase tracking-tight">Módulo Restaurante / Room Service</h2>
                  <p className="text-slate-400 text-xs mt-1">Ligar o restaurante do hotel e gerir pedidos de comida no quarto.</p>
                </div>
                <div className="bg-slate-900/40 border border-amber-500/20 p-12 rounded-[3rem] text-center max-w-lg mx-auto space-y-4">
                  <div className="w-16 h-16 bg-amber-500/10 border border-amber-500/25 rounded-2xl mx-auto flex items-center justify-center text-amber-500">
                    <Coffee size={32} />
                  </div>
                  <h3 className="text-xl font-black text-white uppercase tracking-tight">Premium Room Service (Em Breve)</h3>
                  <p className="text-slate-450 text-xs leading-relaxed font-bold">
                    O módulo de integração de menus, ementas e room service está atualmente em desenvolvimento para esta categoria e estará disponível na próxima atualização.
                  </p>
                </div>
              </motion.div>
            )}

            {/* ── TAB 10: MENSAGENS ── */}
            {activeTab === 'mensagens' && (
              <motion.div 
                key="mensagens"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-6 h-[calc(100vh-140px)] flex flex-col"
              >
                <div className="shrink-0">
                  <h2 className="text-2xl font-black uppercase tracking-tight">Conversas de Emergência e Suporte</h2>
                  <p className="text-slate-400 text-xs mt-1">Mensagens diretas e em tempo real com os hóspedes.</p>
                </div>

                <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6 min-h-0">
                  {/* Left list */}
                  <div className={`p-4 rounded-[2rem] border flex flex-col ${
                    darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                  } shadow-sm overflow-y-auto`}>
                    <h3 className="font-extrabold uppercase text-xs tracking-widest text-slate-400 mb-3 px-2">Hóspedes Activos</h3>
                    <div className="space-y-2">
                      {reservations.map(res => (
                        <button
                          key={res.id}
                          onClick={() => setSelectedResChat(res)}
                          className={`w-full text-left p-3 rounded-xl border transition-all flex flex-col ${
                            selectedResChat?.id === res.id
                              ? 'bg-amber-500/10 border-amber-500/30 text-amber-600 font-bold'
                              : darkMode ? 'border-slate-800 hover:bg-slate-800/50' : 'border-slate-100 hover:bg-slate-50'
                          }`}
                        >
                          <span className="font-bold text-xs">{res.customerName || res.client}</span>
                          <span className="text-[10px] text-slate-400 uppercase mt-0.5">{res.date}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Right Chat Panel */}
                  <div className={`md:col-span-2 rounded-[2rem] border flex flex-col shadow-sm min-h-0 ${
                    darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                  }`}>
                    {selectedResChat ? (
                      <div className="flex-1 flex flex-col min-h-0 p-6">
                        <div className="border-b pb-3 mb-4 shrink-0 flex justify-between items-center">
                          <div>
                            <h4 className="font-black text-sm uppercase tracking-tight">{selectedResChat.customerName || selectedResChat.client}</h4>
                            <p className="text-[9px] text-slate-400 font-bold uppercase mt-0.5">Reserva: {selectedResChat.id}</p>
                          </div>
                        </div>

                        {/* Messages flow */}
                        <div className="flex-1 overflow-y-auto space-y-3 mb-4 pr-2">
                          {(selectedResChat.chatMessages || []).map((msg: any, idx: number) => (
                            <div key={idx} className={`flex flex-col ${msg.sender === 'admin' ? 'items-end' : 'items-start'}`}>
                              <div className={`max-w-[85%] rounded-2xl p-3 text-xs font-semibold ${
                                msg.sender === 'admin' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-slate-200 text-slate-800 rounded-tl-none'
                              }`}>
                                {msg.text}
                              </div>
                              <span className="text-[8px] text-slate-400 mt-1">
                                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                          ))}
                        </div>

                        {/* Input form */}
                        <div className="flex gap-2 border-t pt-4 shrink-0">
                          <input
                            type="text"
                            placeholder="Escreva a sua resposta..."
                            value={chatInput}
                            onChange={(e) => setChatInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                            className={`flex-1 px-4 py-2.5 rounded-xl border text-xs font-semibold ${
                              darkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'
                            }`}
                          />
                          <button
                            onClick={handleSendMessage}
                            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer"
                          >
                            Enviar
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-8">
                        <MessageSquare size={48} className="opacity-10 mb-3" />
                        <p className="text-sm font-black uppercase tracking-widest">Painel de Suporte & Chat</p>
                        <p className="text-[10px] text-center max-w-xs mt-1 italic">
                          Selecione um hóspede na barra lateral para iniciar a conversa.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── TAB 11: AVALIAÇÕES ── */}
            {activeTab === 'avaliacoes' && (
              <motion.div 
                key="avaliacoes"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-2xl font-black uppercase tracking-tight">Avaliações do Alojamento</h2>
                  <p className="text-slate-400 text-xs mt-1">Consultar as classificações e opiniões deixadas pelos hóspedes.</p>
                </div>

                <div className="space-y-4">
                  {(business.reviews_list || []).length === 0 ? (
                    <div className="bg-white p-12 rounded-[2rem] border border-slate-100 text-center">
                      <p className="text-slate-400 font-bold text-sm">Ainda sem avaliações registadas.</p>
                    </div>
                  ) : (
                    (business.reviews_list || []).map((rev: any) => (
                      <div key={rev.id} className={`p-6 rounded-[2rem] border shadow-sm space-y-3 ${
                        darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                      }`}>
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-sm">{rev.customerName || 'Anónimo'}</span>
                          <div className="flex items-center gap-1 text-yellow-500">
                            {Array.from({ length: rev.rating || 5 }).map((_, i) => (
                              <Star key={i} size={14} className="fill-current" />
                            ))}
                          </div>
                        </div>
                        <p className="text-xs text-slate-500 font-medium leading-relaxed">{rev.comment}</p>
                        <span className="text-[9px] text-slate-400 block">{new Date(rev.date).toLocaleDateString()}</span>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            )}

            {/* ── TAB 12: RELATÓRIOS ── */}
            {activeTab === 'relatorios' && (
              <motion.div 
                key="relatorios"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-2xl font-black uppercase tracking-tight">Relatórios & Ocupação</h2>
                  <p className="text-slate-400 text-xs mt-1">Visualizar análise estatística de desempenho financeiro e ocupação.</p>
                </div>
                <div className={`p-6 rounded-[2rem] border shadow-sm ${
                  darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                }`}>
                  <h3 className="font-extrabold uppercase text-xs tracking-widest text-slate-400 mb-4">Relatório de Receita</h3>
                  <div className="h-64 flex items-end justify-between gap-2 pt-6 border-b border-slate-200/20">
                    {[1200, 1500, 2200, 1800, 3200, 4500, 5200].map((val, idx) => (
                      <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                        <div 
                          style={{ height: `${(val / 6000) * 100}%` }} 
                          className="w-full bg-gradient-to-t from-amber-500 to-amber-600 rounded-t-lg"
                        />
                        <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Mês {idx + 1}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── TAB 13: CONFIGURAÇÕES ── */}
            {activeTab === 'configuracoes' && (
              <motion.div 
                key="configuracoes"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className={`p-8 rounded-[2rem] border shadow-sm ${
                  darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                }`}
              >
                <h3 className="font-extrabold uppercase text-xs tracking-widest text-slate-400 mb-6">Configurar Perfil do Alojamento</h3>
                <form onSubmit={async (e) => {
                  e.preventDefault();
                  const form = e.currentTarget;
                  const name = (form.elements.namedItem('name') as HTMLInputElement).value;
                  const publicEmail = (form.elements.namedItem('publicEmail') as HTMLInputElement).value;
                  const phone = (form.elements.namedItem('phone') as HTMLInputElement).value;
                  const description = (form.elements.namedItem('description') as HTMLTextAreaElement).value;

                  await saveUpdatedBusiness({
                    name,
                    publicEmail,
                    phone,
                    description
                  });
                  alert('Configurações guardadas com sucesso!');
                }} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[9px] font-black uppercase text-slate-400 mb-1 font-bold">Nome Público</label>
                      <input
                        name="name"
                        type="text"
                        defaultValue={business.name}
                        required
                        className={`w-full px-4 py-3 rounded-xl border text-xs font-semibold ${
                          darkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'
                        }`}
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-black uppercase text-slate-400 mb-1 font-bold">Email Público</label>
                      <input
                        name="publicEmail"
                        type="email"
                        defaultValue={business.publicEmail || ''}
                        className={`w-full px-4 py-3 rounded-xl border text-xs font-semibold ${
                          darkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'
                        }`}
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-black uppercase text-slate-400 mb-1 font-bold">Telefone / Contacto</label>
                      <input
                        name="phone"
                        type="text"
                        defaultValue={business.phone || business.contacto || ''}
                        className={`w-full px-4 py-3 rounded-xl border text-xs font-semibold ${
                          darkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'
                        }`}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[9px] font-black uppercase text-slate-400 mb-1 font-bold">Descrição do Alojamento</label>
                    <textarea
                      name="description"
                      rows={4}
                      defaultValue={business.description || ''}
                      className={`w-full px-4 py-3 rounded-xl border text-xs font-semibold ${
                        darkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'
                      }`}
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer shadow-md shadow-amber-500/10"
                  >
                    Guardar Alterações
                  </button>
                </form>
              </motion.div>
            )}

          </AnimatePresence>
        </main>
      </div>

    </div>
  );
}
