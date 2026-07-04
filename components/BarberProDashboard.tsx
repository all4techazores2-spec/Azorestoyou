import React, { useState } from 'react';
import { Restaurant } from '../types';
import { LogOut, Calendar, Users, Scissors, Clock, CheckCircle, BarChart3, Settings, Star, AlertCircle, Eye, X, Plus, Trash2 } from 'lucide-react';

interface BarberProDashboardProps {
  business: Restaurant;
  onLogout: () => void;
  onUpdateBusiness: (updated: Restaurant) => void;
}

const BarberProDashboard: React.FC<BarberProDashboardProps> = ({ business, onLogout, onUpdateBusiness }) => {
  const [activeTab, setActiveTab] = useState<'analytics' | 'appointments' | 'services' | 'reviews' | 'room'>('analytics');

  // Chairs room module states
  const [chairs, setChairs] = useState<any[]>([]);
  const [chairBlocks, setChairBlocks] = useState<any[]>([]);
  const [showAssignModal, setShowAssignModal] = useState<any | null>(null);
  const [showAddChair, setShowAddChair] = useState(false);
  const [newChairName, setNewChairName] = useState('');

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
      : 'https://azorestoyou-o5yx.onrender.com';
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

  const loadChairsData = async () => {
    try {
      const API_BASE_URL = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
        ? 'http://localhost:3001'
        : 'https://azorestoyou-o5yx.onrender.com';
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

  const reservations = business.reservations || [];
  const services = business.services || [];
  const reviews = business.reviews_list || [];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col">
      {/* Header */}
      <header className="bg-slate-900/80 backdrop-blur border-b border-white/10 px-6 py-4 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/20">
            <Scissors className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-black tracking-tight">{business.name}</h1>
            <p className="text-[10px] text-purple-400 font-bold uppercase tracking-widest flex items-center gap-1.5">
              <span>Painel Barber PRO (Avançado)</span>
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-ping" />
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="bg-white/5 border border-white/10 text-white/60 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl">
            Modo Premium Ativo
          </span>
          <button
            onClick={onLogout}
            className="flex items-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all border border-red-500/20 active:scale-95"
          >
            <LogOut className="w-4 h-4" /> Sair
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 space-y-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-slate-900 border border-white/10 rounded-3xl p-6 relative overflow-hidden shadow-xl">
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl" />
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs text-slate-400 font-black uppercase tracking-wider">Total Clientes</p>
                <h3 className="text-3xl font-black mt-2 text-white">{reservations.length}</h3>
              </div>
              <div className="p-3 bg-blue-500/10 rounded-2xl text-blue-400 border border-blue-500/20">
                <Users className="w-6 h-6" />
              </div>
            </div>
          </div>

          <div className="bg-slate-900 border border-white/10 rounded-3xl p-6 relative overflow-hidden shadow-xl">
            <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-2xl" />
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs text-slate-400 font-black uppercase tracking-wider">Faturação Estimada</p>
                <h3 className="text-3xl font-black mt-2 text-indigo-400">
                  €{reservations.filter(r => r.status === 'accepted' || r.status === 'finished').length * 15}
                </h3>
              </div>
              <div className="p-3 bg-indigo-500/10 rounded-2xl text-indigo-400 border border-indigo-500/20">
                <BarChart3 className="w-6 h-6" />
              </div>
            </div>
          </div>

          <div className="bg-slate-900 border border-white/10 rounded-3xl p-6 relative overflow-hidden shadow-xl">
            <div className="absolute top-0 right-0 w-24 h-24 bg-green-500/5 rounded-full blur-2xl" />
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs text-slate-400 font-black uppercase tracking-wider">Taxa Ocupação</p>
                <h3 className="text-3xl font-black mt-2 text-green-400">85%</h3>
              </div>
              <div className="p-3 bg-green-500/10 rounded-2xl text-green-400 border border-green-500/20">
                <CheckCircle className="w-6 h-6" />
              </div>
            </div>
          </div>

          <div className="bg-slate-900 border border-white/10 rounded-3xl p-6 relative overflow-hidden shadow-xl">
            <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-500/5 rounded-full blur-2xl" />
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs text-slate-400 font-black uppercase tracking-wider">Avaliação Média</p>
                <h3 className="text-3xl font-black mt-2 text-yellow-400">4.9 ★</h3>
              </div>
              <div className="p-3 bg-yellow-500/10 rounded-2xl text-yellow-400 border border-yellow-500/20">
                <Star className="w-6 h-6" />
              </div>
            </div>
          </div>
        </div>

        {/* Tab Switching */}
        <div className="flex gap-2 border-b border-white/5 pb-px">
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-6 py-3 text-xs font-black uppercase tracking-wider transition-all border-b-2 ${activeTab === 'analytics'
                ? 'border-indigo-500 text-white'
                : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
          >
            📊 Estatísticas & Faturação
          </button>
          <button
            onClick={() => setActiveTab('appointments')}
            className={`px-6 py-3 text-xs font-black uppercase tracking-wider transition-all border-b-2 ${activeTab === 'appointments'
                ? 'border-indigo-500 text-white'
                : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
          >
            📅 Agenda Avançada
          </button>
          <button
            onClick={() => setActiveTab('services')}
            className={`px-6 py-3 text-xs font-black uppercase tracking-wider transition-all border-b-2 ${activeTab === 'services'
                ? 'border-indigo-500 text-white'
                : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
          >
            ✂️ Gestão de Serviços
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`px-6 py-3 text-xs font-black uppercase tracking-wider transition-all border-b-2 ${activeTab === 'reviews'
                ? 'border-indigo-500 text-white'
                : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
          >
            ⭐ Feedback de Clientes
          </button>
          <button
            onClick={() => setActiveTab('room')}
            className={`px-6 py-3 text-xs font-black uppercase tracking-wider transition-all border-b-2 ${activeTab === 'room'
                ? 'border-indigo-500 text-white'
                : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
          >
            👁️ Ver Sala
          </button>
        </div>

        {/* Tab Contents */}
        {activeTab === 'analytics' && (
          <div className="bg-slate-900 border border-white/10 rounded-[2.5rem] p-8 shadow-xl space-y-6">
            <h2 className="text-base font-black uppercase tracking-wider text-slate-300">Desempenho Comercial</h2>
            <div className="h-48 bg-slate-950 rounded-2xl flex items-end justify-between p-6 gap-2 border border-white/5">
              {[60, 45, 80, 55, 70, 95, 90, 85, 100, 110, 95, 120].map((v, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                  <div className="w-full bg-gradient-to-t from-indigo-600 to-purple-500 rounded-t-lg transition-all hover:opacity-80 cursor-pointer" style={{ height: `${(v / 120) * 100}%` }} />
                  <span className="text-[9px] font-black text-slate-500 uppercase">{['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'][i]}</span>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-950 border border-white/5 p-5 rounded-2xl">
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Serviço Mais Procurado</h4>
                <p className="text-lg font-black">Cabelo + Barba Premium <span className="text-indigo-400">(48%)</span></p>
              </div>
              <div className="bg-slate-950 border border-white/5 p-5 rounded-2xl">
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Dia de Pico</h4>
                <p className="text-lg font-black">Sábado <span className="text-emerald-400">(14:00 - 19:00)</span></p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'appointments' && (
          <div className="bg-slate-900 border border-white/10 rounded-[2.5rem] p-6 shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-base font-black uppercase tracking-wider text-slate-300">Agenda Geral & Otimização</h2>
              <span className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
                Sincronização Cloud Ativa
              </span>
            </div>
            {reservations.length === 0 ? (
              <div className="text-center py-12 text-slate-500 text-sm font-bold uppercase tracking-wider">
                Nenhuma marcação registada no sistema.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-white/5 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                      <th className="py-3 px-4">Cliente</th>
                      <th className="py-3 px-4">Contacto</th>
                      <th className="py-3 px-4">Data/Hora</th>
                      <th className="py-3 px-4">Preço</th>
                      <th className="py-3 px-4">Estado</th>
                      <th className="py-3 px-4 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reservations.map((r) => {
                      const updateStatus = async (newStatus: string) => {
                        const API_BASE_URL = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
                          ? 'http://localhost:3001'
                          : 'https://azorestoyou-o5yx.onrender.com';
                        try {
                          const res = await fetch(`${API_BASE_URL}/api/reservations/${r.id || r._id}`, {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ status: newStatus })
                          });
                          if (!res.ok) throw new Error('Falha ao atualizar estado.');

                          const updatedReservations = (business.reservations || []).map((rv: any) =>
                            (rv.id === r.id || rv._id === r._id) ? { ...rv, status: newStatus } : rv
                          );
                          onUpdateBusiness({
                            ...business,
                            reservations: updatedReservations
                          });
                          alert(`Estado atualizado para: ${newStatus}`);
                        } catch (err) {
                          console.error(err);
                          alert('Erro ao atualizar estado.');
                        }
                      };

                      return (
                        <tr key={r.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                          <td className="py-4 px-4 font-black">{r.customerName}</td>
                          <td className="py-4 px-4 text-xs text-slate-400">{r.customerPhone || r.customerEmail}</td>
                          <td className="py-4 px-4 text-xs">
                            <span className="font-bold">{r.date}</span> às <span className="text-indigo-400 font-bold">{r.time}</span>
                          </td>
                          <td className="py-4 px-4 text-xs font-black text-emerald-400">€15.00</td>
                          <td className="py-4 px-4">
                            <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-full border ${r.status === 'accepted' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                                r.status === 'pending' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                                  r.status === 'rejected' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                                    'bg-slate-800 text-slate-400 border-slate-700'
                              }`}>
                              {r.status === 'accepted' ? 'Confirmado' :
                                r.status === 'pending' ? 'Pendente' : r.status === 'rejected' ? 'Recusado' : r.status}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-right">
                            <div className="flex justify-end gap-2">
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
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'services' && (
          <div className="bg-slate-900 border border-white/10 rounded-[2.5rem] p-6 shadow-xl space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-base font-black uppercase tracking-wider text-slate-300">Portefólio de Serviços Barber PRO</h2>
              <button className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all">
                + Adicionar Serviço Avançado
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {services.map((s) => (
                <div key={s.id} className="bg-slate-950 p-5 rounded-2xl border border-white/5 flex justify-between items-center shadow-md">
                  <div>
                    <h3 className="font-bold text-white text-sm">{s.name}</h3>
                    <p className="text-xs text-slate-400 mt-1">{s.description || 'Serviço avançado'}</p>
                    <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider mt-2">⏱️ Duração: {s.duration || 30} mins</p>
                  </div>
                  <div className="text-right">
                    <span className="text-emerald-400 font-black text-lg">€{s.price}</span>
                    <button className="block text-[8px] text-slate-500 hover:text-slate-300 uppercase tracking-widest font-black mt-3 hover:underline">
                      Editar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="bg-slate-900 border border-white/10 rounded-[2.5rem] p-6 shadow-xl space-y-6">
            <h2 className="text-base font-black uppercase tracking-wider text-slate-300">Últimos Comentários & Pontuação</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {reviews.map((r) => (
                <div key={r.id || r.customerName} className="bg-slate-950 p-5 rounded-2xl border border-white/5 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-200">{r.customerName}</span>
                    <span className="text-xs text-slate-500 font-semibold">{r.date || 'Recente'}</span>
                  </div>
                  <div className="flex text-yellow-400 text-sm">
                    {Array.from({ length: r.rating || 5 }).map((_, idx) => (
                      <span key={idx}>★</span>
                    ))}
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed font-medium">"{r.comment || r.comment}"</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB: VER SALA */}
        {activeTab === 'room' && (
          <div className="space-y-6 text-left animate-in fade-in duration-300">
            <div className="flex justify-between items-center bg-slate-900 border border-white/10 rounded-3xl p-6">
              <div>
                <h2 className="text-base font-black uppercase tracking-wider text-purple-400">Ver Sala (Cadeiras)</h2>
                <p className="text-xs text-slate-400 mt-1">Gerencie a ocupação em tempo real e associe cadeiras ao POS e Agenda.</p>
              </div>
              <button
                onClick={() => setShowAddChair(true)}
                className="bg-purple-600/10 hover:bg-purple-600/20 border border-purple-500/30 text-purple-400 px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-wider transition-all"
              >
                + Adicionar Cadeira
              </button>
            </div>

            {showAddChair && (
              <div className="bg-slate-900 border border-white/10 rounded-3xl p-6 space-y-4">
                <h3 className="text-xs font-black uppercase tracking-widest text-purple-400">Nova Cadeira de Barbearia</h3>
                <div className="flex flex-col sm:flex-row gap-4">
                  <input
                    type="text"
                    placeholder="Nome da Cadeira (Ex: Cadeira Pro 1)"
                    value={newChairName}
                    onChange={(e) => setNewChairName(e.target.value)}
                    className="flex-1 bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-purple-500"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={async () => {
                        if (!newChairName.trim()) return;
                        const API_BASE_URL = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
                          ? 'http://localhost:3001'
                          : 'https://azorestoyou-o5yx.onrender.com';
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
                      className="bg-purple-600 hover:bg-purple-500 text-white px-6 py-3 rounded-xl text-xs font-black uppercase tracking-wider"
                    >
                      Gravar
                    </button>
                    <button
                      onClick={() => setShowAddChair(false)}
                      className="bg-slate-850 hover:bg-slate-800 text-slate-300 px-6 py-3 rounded-xl text-xs font-black uppercase tracking-wider"
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
                  'Em Atendimento': '#8B5CF6',
                  'Bloqueada': '#EF4444',
                  'Limpeza': '#6B7280',
                  'inactive': '#374151'
                };
                const statusColor = colorMap[chair.status] || '#10B981';

                const handleStatusUpdate = async (status: string) => {
                  const API_BASE_URL = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
                    ? 'http://localhost:3001'
                    : 'https://azorestoyou-o5yx.onrender.com';
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
                    : 'https://azorestoyou-o5yx.onrender.com';
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
                    : 'https://azorestoyou-o5yx.onrender.com';
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
                    : 'https://azorestoyou-o5yx.onrender.com';
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
                    className="bg-slate-900 border border-white/5 rounded-3xl p-6 flex flex-col justify-between hover:scale-[1.02] transition-all hover:shadow-[0_0_15px_rgba(139,92,246,0.05)]"
                  >
                    <div className="space-y-4">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-slate-950 border border-white/10 flex items-center justify-center shrink-0">
                            <Scissors className="w-5 h-5 text-purple-400" />
                          </div>
                          <div>
                            <h3 className="text-xs font-black text-white uppercase tracking-wider">{chair.chairName}</h3>
                            <p className="text-[8px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">Nº {chair.chairNumber}</p>
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
                        <div className="p-3 bg-slate-950 border border-white/5 rounded-xl text-xs space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-slate-500 text-[8px] font-black uppercase">Cliente:</span>
                            <span className="font-bold text-white truncate max-w-[120px]">{chair.currentClientId || 'Cliente Geral'}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-slate-500 text-[8px] font-black uppercase">Serviço:</span>
                            <span className="font-bold text-purple-400 truncate max-w-[120px]">{chair.currentServiceId || 'Corte'}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-slate-500 text-[8px] font-black uppercase">Horário:</span>
                            <span className="font-bold text-white">{chair.blockedFrom} - {chair.blockedUntil}</span>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="mt-6 flex flex-col gap-2">
                      {chair.status === 'Reservada' && (
                        <button
                          onClick={handleStartService}
                          className="w-full py-2.5 bg-purple-650 hover:bg-purple-600 text-white text-[9px] font-black uppercase tracking-wider rounded-xl transition-all"
                        >
                          Iniciar Serviço
                        </button>
                      )}

                      {chair.status === 'Em Atendimento' && (
                        <button
                          onClick={handleReleaseChair}
                          className="w-full py-2.5 bg-neutral-800 hover:bg-neutral-750 text-white text-[9px] font-black uppercase tracking-wider rounded-xl transition-all"
                        >
                          Libertar Cadeira
                        </button>
                      )}

                      {chair.status === 'available' && (
                        <div className="grid grid-cols-3 gap-1.5">
                          <button
                            onClick={() => handleStatusUpdate('cleaning')}
                            className="py-2 bg-slate-950 border border-white/5 hover:bg-slate-850 text-slate-400 hover:text-white text-[8px] font-black uppercase tracking-wider rounded-xl transition-all"
                          >
                            Limpeza
                          </button>
                          <button
                            onClick={() => handleStatusUpdate('blocked')}
                            className="py-2 bg-slate-950 border border-white/5 hover:bg-slate-850 text-slate-400 hover:text-white text-[8px] font-black uppercase tracking-wider rounded-xl transition-all"
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
                              : 'https://azorestoyou-o5yx.onrender.com';
                            try {
                              const activeB = chairBlocks.find(b => (b.chairId === chair.id || b.chairId === chair.chairId) && b.status !== 'completed' && b.status !== 'cancelled');
                              if (activeB) {
                                await fetch(`${API_BASE_URL}/api/chair-blocks/${activeB.id}`, {
                                  method: 'DELETE'
                                });
                              }
                              loadChairsData();
                            } catch (err) {
                              loadChairsData();
                            }
                          }}
                          className="py-2.5 bg-neutral-800 hover:bg-neutral-750 text-white text-[9px] font-black uppercase tracking-wider rounded-xl transition-all"
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
      </main>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-white/10 py-6 px-6 text-center text-xs text-slate-500 font-bold uppercase tracking-widest">
        &copy; {new Date().getFullYear()} Azores4you Pro. Todos os direitos reservados.
      </footer>

      {/* MODAL ATRIBUIR CADEIRA */}
      {showAssignModal && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="bg-slate-900 border border-white/15 rounded-3xl max-w-md w-full p-6 space-y-6 text-left">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-sm font-black uppercase tracking-wider text-purple-400">Atribuir Cadeira</h3>
                <p className="text-[9px] text-slate-400 mt-0.5">Selecione uma cadeira disponível para a reserva de {showAssignModal.customerName}.</p>
              </div>
              <button
                onClick={() => setShowAssignModal(null)}
                className="w-8 h-8 rounded-full bg-slate-950 border border-white/10 text-white flex items-center justify-center hover:bg-slate-800 transition-all"
              >
                <X size={14} />
              </button>
            </div>

            <div className="bg-slate-950 border border-white/5 p-4 rounded-xl space-y-2 text-xs text-slate-400">
              <p>📅 <strong className="text-white">Data:</strong> {showAssignModal.date}</p>
              <p>🕒 <strong className="text-white">Hora:</strong> {showAssignModal.time}</p>
              <p>✂️ <strong className="text-white">Serviço:</strong> {showAssignModal.serviceName || (showAssignModal.preOrder && showAssignModal.preOrder.map((po: any) => po.dish?.name).join(', '))}</p>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {getAvailableChairsForResv(showAssignModal).map((chair) => (
                <div
                  key={chair.id}
                  onClick={() => confirmReservationWithChair(showAssignModal, chair.id)}
                  className="p-3 bg-slate-950 border border-white/5 hover:border-purple-500 rounded-xl flex justify-between items-center cursor-pointer transition-all hover:bg-slate-900"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-slate-900 border border-white/10 rounded-lg flex items-center justify-center text-purple-400">
                      <Scissors size={14} />
                    </div>
                    <div>
                      <p className="text-xs font-black text-white">{chair.chairName}</p>
                      <p className="text-[8px] text-slate-500 font-bold">Número {chair.chairNumber}</p>
                    </div>
                  </div>
                  <span className="text-[8px] bg-green-500/10 text-green-400 border border-green-500/20 px-2 py-0.5 rounded-full font-black uppercase">Disponível</span>
                </div>
              ))}
              {getAvailableChairsForResv(showAssignModal).length === 0 && (
                <div className="py-8 text-center text-xs text-slate-500 font-bold uppercase tracking-wider bg-slate-950 border border-white/5 rounded-xl">
                  Nenhuma cadeira disponível.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BarberProDashboard;
