import React, { useState } from 'react';
import { Restaurant } from '../types';
import { LogOut, Calendar, Users, Scissors, Clock, CheckCircle, BarChart3, Settings, Star, AlertCircle } from 'lucide-react';

interface BarberProDashboardProps {
  business: Restaurant;
  onLogout: () => void;
}

const BarberProDashboard: React.FC<BarberProDashboardProps> = ({ business, onLogout }) => {
  const [activeTab, setActiveTab] = useState<'analytics' | 'appointments' | 'services' | 'reviews'>('analytics');

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
            className={`px-6 py-3 text-xs font-black uppercase tracking-wider transition-all border-b-2 ${
              activeTab === 'analytics' 
                ? 'border-indigo-500 text-white' 
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            📊 Estatísticas & Faturação
          </button>
          <button 
            onClick={() => setActiveTab('appointments')}
            className={`px-6 py-3 text-xs font-black uppercase tracking-wider transition-all border-b-2 ${
              activeTab === 'appointments' 
                ? 'border-indigo-500 text-white' 
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            📅 Agenda Avançada
          </button>
          <button 
            onClick={() => setActiveTab('services')}
            className={`px-6 py-3 text-xs font-black uppercase tracking-wider transition-all border-b-2 ${
              activeTab === 'services' 
                ? 'border-indigo-500 text-white' 
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            ✂️ Gestão de Serviços
          </button>
          <button 
            onClick={() => setActiveTab('reviews')}
            className={`px-6 py-3 text-xs font-black uppercase tracking-wider transition-all border-b-2 ${
              activeTab === 'reviews' 
                ? 'border-indigo-500 text-white' 
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            ⭐ Feedback de Clientes
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
                      <th className="py-3 px-4">Preço Acordado</th>
                      <th className="py-3 px-4 text-right">Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reservations.map((r) => (
                      <tr key={r.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                        <td className="py-4 px-4 font-black">{r.customerName}</td>
                        <td className="py-4 px-4 text-xs text-slate-400">{r.customerPhone || r.customerEmail}</td>
                        <td className="py-4 px-4 text-xs">
                          <span className="font-bold">{r.date}</span> às <span className="text-indigo-400 font-bold">{r.time}</span>
                        </td>
                        <td className="py-4 px-4 text-xs font-black text-emerald-400">€15.00</td>
                        <td className="py-4 px-4 text-right">
                          <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-full border ${
                            r.status === 'accepted' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                            r.status === 'pending' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                            'bg-slate-800 text-slate-400 border-slate-700'
                          }`}>
                            {r.status === 'accepted' ? 'Confirmado' :
                             r.status === 'pending' ? 'Pendente' : r.status}
                          </span>
                        </td>
                      </tr>
                    ))}
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
              {[
                { id: '1', name: 'Corte Degradê & Fade', price: 15, duration: 40, desc: 'Corte moderno com detalhe nas laterais' },
                { id: '2', name: 'Alinhamento de Barba + Vaporizador', price: 12, duration: 30, desc: 'Massagem e alinhamento a navalha' },
                { id: '3', name: 'Coloração & Camuflagem de Grisalhos', price: 20, duration: 60, desc: 'Pintura especializada rápida' },
                { id: '4', name: 'Pack PRO (Corte + Barba + Spa Capilar)', price: 30, duration: 75, desc: 'Tratamento premium completo' }
              ].map((s) => (
                <div key={s.id} className="bg-slate-950 p-5 rounded-2xl border border-white/5 flex justify-between items-center shadow-md">
                  <div>
                    <h3 className="font-bold text-white text-sm">{s.name}</h3>
                    <p className="text-xs text-slate-400 mt-1">{s.desc}</p>
                    <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider mt-2">⏱️ Duração: {s.duration} mins</p>
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
              {[
                { id: '1', name: 'Manuel Silva', rating: 5, date: '12-06-2026', text: 'Melhor corte degradê que já fiz na ilha! Super atenciosos e profissionais.' },
                { id: '2', name: 'António Rego', rating: 5, date: '10-06-2026', text: 'Serviço PRO excelente. O vaporizador de toalha na barba é fantástico.' }
              ].map((r) => (
                <div key={r.id} className="bg-slate-950 p-5 rounded-2xl border border-white/5 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-200">{r.name}</span>
                    <span className="text-xs text-slate-500 font-semibold">{r.date}</span>
                  </div>
                  <div className="flex text-yellow-400 text-sm">
                    {Array.from({ length: r.rating }).map((_, idx) => (
                      <span key={idx}>★</span>
                    ))}
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed font-medium">"{r.text}"</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-white/10 py-6 px-6 text-center text-xs text-slate-500 font-bold uppercase tracking-widest">
        &copy; {new Date().getFullYear()} Azores4you Pro. Todos os direitos reservados.
      </footer>
    </div>
  );
};

export default BarberProDashboard;
