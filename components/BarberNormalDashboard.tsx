import React, { useState } from 'react';
import { Restaurant } from '../types';
import { LogOut, Calendar, Users, Scissors, Clock, CheckCircle } from 'lucide-react';

interface BarberNormalDashboardProps {
  business: Restaurant;
  onLogout: () => void;
}

const BarberNormalDashboard: React.FC<BarberNormalDashboardProps> = ({ business, onLogout }) => {
  const [activeTab, setActiveTab] = useState<'appointments' | 'services'>('appointments');

  const reservations = business.reservations || [];
  const services = business.services || [];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col">
      {/* Header */}
      <header className="bg-slate-900/80 backdrop-blur border-b border-white/10 px-6 py-4 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Scissors className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-black tracking-tight">{business.name}</h1>
            <p className="text-[10px] text-blue-400 font-bold uppercase tracking-widest">Painel Barbeiro Normal</p>
          </div>
        </div>
        <button 
          onClick={onLogout} 
          className="flex items-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all border border-red-500/20 active:scale-95"
        >
          <LogOut className="w-4 h-4" /> Sair
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 space-y-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-900 border border-white/10 rounded-3xl p-6 relative overflow-hidden shadow-xl">
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl" />
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs text-slate-400 font-black uppercase tracking-wider">Total Marcações</p>
                <h3 className="text-3xl font-black mt-2 text-white">{reservations.length}</h3>
              </div>
              <div className="p-3 bg-blue-500/10 rounded-2xl text-blue-400 border border-blue-500/20">
                <Calendar className="w-6 h-6" />
              </div>
            </div>
          </div>

          <div className="bg-slate-900 border border-white/10 rounded-3xl p-6 relative overflow-hidden shadow-xl">
            <div className="absolute top-0 right-0 w-24 h-24 bg-green-500/5 rounded-full blur-2xl" />
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs text-slate-400 font-black uppercase tracking-wider">Confirmadas</p>
                <h3 className="text-3xl font-black mt-2 text-green-400">
                  {reservations.filter(r => r.status === 'accepted' || r.status === 'finished').length}
                </h3>
              </div>
              <div className="p-3 bg-green-500/10 rounded-2xl text-green-400 border border-green-500/20">
                <CheckCircle className="w-6 h-6" />
              </div>
            </div>
          </div>

          <div className="bg-slate-900 border border-white/10 rounded-3xl p-6 relative overflow-hidden shadow-xl">
            <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl" />
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs text-slate-400 font-black uppercase tracking-wider">Serviços Ativos</p>
                <h3 className="text-3xl font-black mt-2 text-amber-400">{services.length || 3}</h3>
              </div>
              <div className="p-3 bg-amber-500/10 rounded-2xl text-amber-400 border border-amber-500/20">
                <Scissors className="w-6 h-6" />
              </div>
            </div>
          </div>
        </div>

        {/* Tab Switching */}
        <div className="flex gap-2 border-b border-white/5 pb-px">
          <button 
            onClick={() => setActiveTab('appointments')}
            className={`px-6 py-3 text-xs font-black uppercase tracking-wider transition-all border-b-2 ${
              activeTab === 'appointments' 
                ? 'border-blue-500 text-white' 
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            📋 Marcações
          </button>
          <button 
            onClick={() => setActiveTab('services')}
            className={`px-6 py-3 text-xs font-black uppercase tracking-wider transition-all border-b-2 ${
              activeTab === 'services' 
                ? 'border-blue-500 text-white' 
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            ✂️ Nossos Serviços
          </button>
        </div>

        {/* Tab Contents */}
        {activeTab === 'appointments' && (
          <div className="bg-slate-900 border border-white/10 rounded-[2.5rem] p-6 shadow-xl">
            <h2 className="text-base font-black uppercase tracking-wider text-slate-300 mb-6">Agenda de Clientes</h2>
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
                      <th className="py-3 px-4 text-right">Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reservations.map((r) => (
                      <tr key={r.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                        <td className="py-4 px-4 font-black">{r.customerName}</td>
                        <td className="py-4 px-4 text-xs text-slate-400">{r.customerPhone || r.customerEmail}</td>
                        <td className="py-4 px-4 text-xs">
                          <span className="font-bold">{r.date}</span> às <span className="text-blue-400 font-bold">{r.time}</span>
                        </td>
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
          <div className="bg-slate-900 border border-white/10 rounded-[2.5rem] p-6 shadow-xl grid grid-cols-1 md:grid-cols-2 gap-4">
            {services.length === 0 ? (
              // Default sample beauty services for display
              [
                { id: '1', name: 'Corte de Cabelo Simples', price: 12 },
                { id: '2', name: 'Barba com Toalha Quente', price: 8 },
                { id: '3', name: 'Pack Corte + Barba', price: 18 }
              ].map((s) => (
                <div key={s.id} className="bg-slate-950 p-5 rounded-2xl border border-white/5 flex justify-between items-center shadow-md">
                  <div>
                    <h3 className="font-bold text-white text-sm">{s.name}</h3>
                    <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mt-1">Serviço de Barbearia</p>
                  </div>
                  <span className="text-emerald-400 font-black text-base">€{s.price}</span>
                </div>
              ))
            ) : (
              services.map((s) => (
                <div key={s.id} className="bg-slate-950 p-5 rounded-2xl border border-white/5 flex justify-between items-center shadow-md">
                  <div>
                    <h3 className="font-bold text-white text-sm">{s.name}</h3>
                    <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mt-1">Duração: {s.duration || 30} mins</p>
                  </div>
                  <span className="text-emerald-400 font-black text-base">€{s.price}</span>
                </div>
              ))
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-white/10 py-6 px-6 text-center text-xs text-slate-500 font-bold uppercase tracking-widest">
        &copy; {new Date().getFullYear()} Azores4you. Todos os direitos reservados.
      </footer>
    </div>
  );
};

export default BarberNormalDashboard;
