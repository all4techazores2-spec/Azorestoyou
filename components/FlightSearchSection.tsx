import React, { useState } from 'react';
import {
  PlaneTakeoff, PlaneLanding, Search, ArrowLeftRight,
  Calendar, Users, ChevronDown, Clock, X, RefreshCw,
  ArrowLeft, Heart, Info, Filter, MapPin
} from 'lucide-react';
import { Language } from '../types';

interface FlightSearchSectionProps {
  language?: Language;
  onClose?: () => void;
}

// ─── Dados dos aeroportos ─────────────────────────────────────────────────────

const AZORES_AIRPORTS = [
  { code: 'PDL', label: 'Açores - São Miguel (PDL)' },
  { code: 'TER', label: 'Açores - Terceira (TER)' },
  { code: 'FAI', label: 'Açores - Faial (FAI)' },
  { code: 'PIX', label: 'Açores - Pico (PIX)' },
  { code: 'SJZ', label: 'Açores - São Jorge (SJZ)' },
  { code: 'GRW', label: 'Açores - Graciosa (GRW)' },
  { code: 'FLW', label: 'Açores - Flores (FLW)' },
  { code: 'CVU', label: 'Açores - Corvo (CVU)' },
  { code: 'SMA', label: 'Açores - Santa Maria (SMA)' },
];

const INTL_AIRPORTS = [
  { code: 'YYZ', label: 'Toronto (YYZ)' },
  { code: 'LIS', label: 'Lisboa (LIS)' },
  { code: 'OPO', label: 'Porto (OPO)' },
  { code: 'LHR', label: 'Londres (LHR)' },
  { code: 'CDG', label: 'Paris (CDG)' },
  { code: 'FRA', label: 'Frankfurt (FRA)' },
  { code: 'AMS', label: 'Amesterdão (AMS)' },
  { code: 'MAD', label: 'Madrid (MAD)' },
  { code: 'BCN', label: 'Barcelona (BCN)' },
  { code: 'FCO', label: 'Roma (FCO)' },
  { code: 'ZRH', label: 'Zurique (ZRH)' },
  { code: 'DUB', label: 'Dublin (DUB)' },
  { code: 'BOS', label: 'Boston (BOS)' },
  { code: 'JFK', label: 'Nova Iorque (JFK)' },
  { code: 'GRU', label: 'São Paulo (GRU)' },
];

const ALL_AIRPORTS = [...INTL_AIRPORTS, ...AZORES_AIRPORTS];

// ─── Companhias ───────────────────────────────────────────────────────────────

const AIRLINES: Record<string, { name: string; short: string; color: string; bg: string; textColor: string }> = {
  'SATA': { name: 'SATA Azores', short: 'S4', color: '#005DA8', bg: '#dbeafe', textColor: '#1e3a8a' },
  'Air Canada': { name: 'Air Canada', short: 'AC', color: '#cc0000', bg: '#fee2e2', textColor: '#991b1b' },
  'TAP': { name: 'TAP Air Portugal', short: 'TP', color: '#004d1a', bg: '#d1fae5', textColor: '#065f46' },
  'Air Transat': { name: 'Air Transat', short: 'TS', color: '#dc4e00', bg: '#ffedd5', textColor: '#9a3412' },
  'United': { name: 'United Airlines', short: 'UA', color: '#1a1a6e', bg: '#ede9fe', textColor: '#4c1d95' },
  'Ryanair': { name: 'Ryanair', short: 'FR', color: '#073590', bg: '#dbeafe', textColor: '#1e40af' },
  'easyJet': { name: 'easyJet', short: 'U2', color: '#FF6600', bg: '#ffedd5', textColor: '#c2410c' },
  'Lufthansa': { name: 'Lufthansa', short: 'LH', color: '#05164D', bg: '#e0e7ff', textColor: '#3730a3' },
};

// ─── Painel de voos (Estado de Voos) ─────────────────────────────────────────

const BOARD_FLIGHTS = [
  { airline: 'Air Canada',  num: 'AC 864',  time: '10:35', dest: 'PDL', status: 'Chegou',    type: 'chegada'  },
  { airline: 'SATA',        num: 'S4 126',  time: '12:15', dest: 'PDL', status: 'Embarque',  type: 'chegada'  },
  { airline: 'TAP',         num: 'TP 1864', time: '16:20', dest: 'PDL', status: 'Atrasado',  type: 'chegada'  },
  { airline: 'Air Transat', num: 'TS 822',  time: '19:10', dest: 'PDL', status: 'Previsto',  type: 'chegada'  },
  { airline: 'United',      num: 'UA 258',  time: '21:45', dest: 'PDL', status: 'Cancelado', type: 'chegada'  },
  { airline: 'SATA',        num: 'S4 201',  time: '06:30', dest: 'LIS', status: 'Partiu',    type: 'partida'  },
  { airline: 'TAP',         num: 'TP 1201', time: '09:10', dest: 'LIS', status: 'Embarque',  type: 'partida'  },
  { airline: 'SATA',        num: 'S4 101',  time: '11:00', dest: 'TER', status: 'Previsto',  type: 'partida'  },
  { airline: 'Ryanair',     num: 'FR 5621', time: '12:15', dest: 'STN', status: 'Atrasado',  type: 'partida'  },
  { airline: 'SATA',        num: 'S4 107',  time: '17:10', dest: 'PIX', status: 'Cancelado', type: 'partida'  },
  { airline: 'Air Canada',  num: 'AC 863',  time: '13:45', dest: 'YYZ', status: 'Previsto',  type: 'partida'  },
  { airline: 'TAP',         num: 'TP 1205', time: '16:00', dest: 'OPO', status: 'Previsto',  type: 'partida'  },
];

// ─── Gerador de passagens ─────────────────────────────────────────────────────

function generateTickets(from: string, to: string, date: string, pax: number, tripType: string) {
  const seed = (from.charCodeAt(0) + to.charCodeAt(0)) % 100;
  const isLong = ['YYZ','BOS','JFK','GRU'].includes(from) || ['YYZ','BOS','JFK','GRU'].includes(to);
  const base = isLong ? 380 : (['LIS','OPO'].includes(from) || ['LIS','OPO'].includes(to) ? 95 : 55);

  const options = [
    { airline: 'SATA',        flightNum: `S4 ${126 + seed}`,  dep: '21:30', arr: '07:50', duration: isLong ? '6h 20m' : '2h 05m', stops: 0, badgeText: 'Mais económico',   badgeColor: 'bg-emerald-100 text-emerald-700',  price: Math.round((base + seed * 0.3) * pax),  trip: tripType === 'ida' ? 'Só ida' : 'Ida e volta' },
    { airline: 'Air Canada',   flightNum: `AC ${864 + seed}`,  dep: '20:15', arr: '08:40', duration: isLong ? '6h 25m' : '2h 20m', stops: 0, badgeText: 'Mais popular',     badgeColor: 'bg-yellow-100 text-yellow-700',    price: Math.round((base + seed * 0.3 + 83) * pax), trip: tripType === 'ida' ? 'Só ida' : 'Ida e volta' },
    { airline: 'TAP',          flightNum: `TP ${1864 + seed}`, dep: '18:50', arr: '09:15', duration: isLong ? '7h 25m' : '3h 10m', stops: 1, badgeText: 'Melhor flexibil.', badgeColor: 'bg-blue-100 text-blue-700',        price: Math.round((base + seed * 0.3 + 260) * pax), trip: tripType === 'ida' ? 'Só ida' : 'Ida e volta' },
    { airline: 'Air Transat',  flightNum: `TS ${822 + seed}`,  dep: '15:00', arr: '23:30', duration: isLong ? '6h 30m' : '2h 30m', stops: 0, badgeText: '',                 badgeColor: '',                                 price: Math.round((base + seed * 0.3 + 140) * pax), trip: tripType === 'ida' ? 'Só ida' : 'Ida e volta' },
    { airline: 'United',       flightNum: `UA ${258 + seed}`,  dep: '22:00', arr: '10:20', duration: isLong ? '6h 20m' : '2h 15m', stops: 0, badgeText: '',                 badgeColor: '',                                 price: Math.round((base + seed * 0.3 + 210) * pax), trip: tripType === 'ida' ? 'Só ida' : 'Ida e volta' },
  ];
  return options.sort((a, b) => a.price - b.price);
}

// ─── Badge de estado ──────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { dot: string; text: string }> = {
    'Chegou':    { dot: 'bg-green-500',  text: 'text-green-700' },
    'Embarque':  { dot: 'bg-blue-500',   text: 'text-blue-700' },
    'Atrasado':  { dot: 'bg-amber-500',  text: 'text-amber-700' },
    'Previsto':  { dot: 'bg-slate-400',  text: 'text-slate-600' },
    'Cancelado': { dot: 'bg-red-500',    text: 'text-red-700' },
    'Partiu':    { dot: 'bg-green-500',  text: 'text-green-700' },
  };
  const s = map[status] || { dot: 'bg-slate-400', text: 'text-slate-600' };
  return (
    <span className={`flex items-center gap-1.5 text-xs font-bold ${s.text}`}>
      <span className={`w-2 h-2 rounded-full ${s.dot}`} />
      {status}
    </span>
  );
}

// ─── Logo companhia ────────────────────────────────────────────────────────────

function AirlineLogo({ airline, size = 'md' }: { airline: string; size?: 'sm' | 'md' | 'lg' }) {
  const a = AIRLINES[airline] || { name: airline, short: airline.substring(0, 2).toUpperCase(), bg: '#f1f5f9', textColor: '#475569' };
  const cls = size === 'lg' ? 'w-12 h-12 text-sm' : size === 'sm' ? 'w-7 h-7 text-[9px]' : 'w-10 h-10 text-xs';
  return (
    <div className={`${cls} rounded-xl flex items-center justify-center font-black shrink-0`}
      style={{ background: a.bg, color: a.textColor }}>
      {a.short}
    </div>
  );
}

// ─── Componente principal ─────────────────────────────────────────────────────

const FlightSearchSection: React.FC<FlightSearchSectionProps> = ({ language = 'pt', onClose }) => {
  // View: 'board' = Estado de Voos | 'tickets' = Passagens à Venda
  const [view, setView] = useState<'board' | 'tickets'>('board');

  // ── Estado de Voos ─────────────────────────────────────────────────
  const [boardOrigin, setBoardOrigin] = useState('YYZ');
  const [boardDest, setBoardDest] = useState('PDL');
  const [boardDate, setBoardDate] = useState('2025-04-12');
  const [boardTab, setBoardTab] = useState<'chegadas' | 'partidas' | 'cancelamentos'>('chegadas');
  const [showBoardOriginDrop, setShowBoardOriginDrop] = useState(false);
  const [showBoardDestDrop, setShowBoardDestDrop] = useState(false);

  // ── Passagens ──────────────────────────────────────────────────────
  const [ticketFrom, setTicketFrom] = useState('YYZ');
  const [ticketTo, setTicketTo] = useState('PDL');
  const [ticketDate, setTicketDate] = useState('2025-04-12');
  const [pax, setPax] = useState(1);
  const [tripType, setTripType] = useState<'ida' | 'ida-volta'>('ida');
  const [showFromDrop, setShowFromDrop] = useState(false);
  const [showToDrop, setShowToDrop] = useState(false);
  const [showPaxDrop, setShowPaxDrop] = useState(false);
  const [tickets, setTickets] = useState<ReturnType<typeof generateTickets>>([]);
  const [searching, setSearching] = useState(false);
  const [searched, setSearched] = useState(false);
  const [likedFlights, setLikedFlights] = useState<Set<number>>(new Set());

  const getLabel = (code: string) => ALL_AIRPORTS.find(a => a.code === code)?.label || code;

  const handleSwapBoard = () => {
    const tmp = boardOrigin; setBoardOrigin(boardDest); setBoardDest(tmp);
  };
  const handleSwapTicket = () => {
    const tmp = ticketFrom; setTicketFrom(ticketTo); setTicketTo(tmp);
  };

  const handleSearch = () => {
    setSearching(true);
    setSearched(false);
    setTimeout(() => {
      setTickets(generateTickets(ticketFrom, ticketTo, ticketDate, pax, tripType));
      setSearching(false);
      setSearched(true);
    }, 1200);
  };

  const toggleLike = (i: number) => {
    setLikedFlights(prev => {
      const n = new Set(prev);
      n.has(i) ? n.delete(i) : n.add(i);
      return n;
    });
  };

  // Filtrar painel
  const boardFlights = BOARD_FLIGHTS.filter(f => {
    if (boardTab === 'chegadas') return f.type === 'chegada';
    if (boardTab === 'partidas') return f.type === 'partida';
    if (boardTab === 'cancelamentos') return f.status === 'Cancelado';
    return true;
  });

  // ── SELETOR dropdown reutilizável ─────────────────────────────────
  const AirportDropdown = ({ value, onChange, onClose: closeDrop }: {
    value: string; onChange: (c: string) => void; onClose: () => void;
  }) => (
    <div className="absolute left-0 right-0 top-full mt-1 z-50 bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden" style={{ maxHeight: 260 }}>
      <div className="overflow-y-auto" style={{ maxHeight: 260 }}>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider px-4 pt-3 pb-1">Internacional</p>
        {INTL_AIRPORTS.map(a => (
          <button key={a.code} onClick={() => { onChange(a.code); closeDrop(); }}
            className={`w-full text-left px-4 py-2.5 text-sm hover:bg-blue-50 transition-colors flex items-center gap-2 ${value === a.code ? 'bg-blue-50 font-bold text-blue-700' : 'text-slate-700'}`}>
            <PlaneTakeoff className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            {a.label}
          </button>
        ))}
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider px-4 pt-3 pb-1">Açores</p>
        {AZORES_AIRPORTS.map(a => (
          <button key={a.code} onClick={() => { onChange(a.code); closeDrop(); }}
            className={`w-full text-left px-4 py-2.5 text-sm hover:bg-blue-50 transition-colors flex items-center gap-2 ${value === a.code ? 'bg-blue-50 font-bold text-blue-700' : 'text-slate-700'}`}>
            <PlaneLanding className="w-3.5 h-3.5 text-blue-400 shrink-0" />
            {a.label}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans">

      {/* ── CABEÇALHO ─────────────────────────────────────────────────────── */}
      <div className="bg-white border-b border-slate-100 sticky top-0 z-30">
        <div className="flex items-center gap-3 px-4 py-4">
          {onClose && (
            <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-100 transition-colors text-slate-600">
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center">
              <PlaneTakeoff className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-base font-black text-slate-800 leading-none">Estado de Voos</h1>
              <p className="text-[10px] text-slate-400 mt-0.5">Acompanhe em tempo real os voos para os Açores.</p>
            </div>
          </div>
        </div>

        {/* Tabs principais */}
        <div className="flex border-t border-slate-100">
          <button onClick={() => setView('board')}
            className={`flex-1 py-3 text-xs font-black flex items-center justify-center gap-1.5 border-b-2 transition-colors ${view === 'board' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}>
            <PlaneLanding className="w-3.5 h-3.5" /> Estado de Voos
          </button>
          <button onClick={() => setView('tickets')}
            className={`flex-1 py-3 text-xs font-black flex items-center justify-center gap-1.5 border-b-2 transition-colors ${view === 'tickets' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}>
            <PlaneTakeoff className="w-3.5 h-3.5" /> Passagens à Venda
          </button>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* ── VISTA: ESTADO DE VOOS ──────────────────────────────────────── */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {view === 'board' && (
        <div className="pb-28">

          {/* Filtrar Voos */}
          <div className="bg-white mx-4 mt-4 rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-50">
              <div className="flex items-center gap-2 text-sm font-black text-slate-700">
                <Filter className="w-4 h-4 text-blue-600" />
                Filtrar Voos
              </div>
              <button onClick={() => { setBoardOrigin('YYZ'); setBoardDest('PDL'); setBoardDate('2025-04-12'); }}
                className="text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors">
                Limpar
              </button>
            </div>

            <div className="p-4 space-y-3">
              {/* De */}
              <div className="relative">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1">De</label>
                <button onClick={() => { setShowBoardOriginDrop(!showBoardOriginDrop); setShowBoardDestDrop(false); }}
                  className="w-full flex items-center gap-2 px-3 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 font-semibold hover:border-blue-400 transition-colors">
                  <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                  <span className="flex-1 text-left">{getLabel(boardOrigin)}</span>
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                </button>
                {showBoardOriginDrop && (
                  <AirportDropdown value={boardOrigin} onChange={setBoardOrigin} onClose={() => setShowBoardOriginDrop(false)} />
                )}
              </div>

              {/* Para */}
              <div className="relative">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1">Para</label>
                <button onClick={() => { setShowBoardDestDrop(!showBoardDestDrop); setShowBoardOriginDrop(false); }}
                  className="w-full flex items-center gap-2 px-3 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 font-semibold hover:border-blue-400 transition-colors">
                  <PlaneTakeoff className="w-4 h-4 text-blue-500 shrink-0" />
                  <span className="flex-1 text-left">{getLabel(boardDest)}</span>
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                </button>
                {showBoardDestDrop && (
                  <AirportDropdown value={boardDest} onChange={setBoardDest} onClose={() => setShowBoardDestDrop(false)} />
                )}
              </div>

              {/* Data */}
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1">Data</label>
                <div className="flex items-center gap-2 px-3 py-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                  <input type="date" value={boardDate} onChange={e => setBoardDate(e.target.value)}
                    className="flex-1 bg-transparent text-sm font-semibold text-slate-700 outline-none" />
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Tabs: Chegadas | Partidas | Cancelamentos */}
          <div className="flex gap-2 px-4 mt-4">
            {([
              { id: 'chegadas',      label: 'Chegadas',      icon: <PlaneLanding className="w-3.5 h-3.5" /> },
              { id: 'partidas',      label: 'Partidas',      icon: <PlaneTakeoff className="w-3.5 h-3.5" /> },
              { id: 'cancelamentos', label: 'Cancelamentos', icon: <X className="w-3.5 h-3.5" /> },
            ] as const).map(tab => (
              <button key={tab.id} onClick={() => setBoardTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-black transition-all ${
                  boardTab === tab.id
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
                    : 'bg-white text-slate-500 border border-slate-200 hover:border-blue-300'
                }`}>
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>

          {/* Tabela de voos */}
          <div className="bg-white mx-4 mt-4 rounded-2xl border border-slate-100 shadow-sm overflow-hidden">

            {/* Cabeçalho da tabela */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
              <h2 className="text-sm font-black text-slate-700">
                {boardTab === 'chegadas' ? '🛬 Chegadas em PDL' : boardTab === 'partidas' ? '🛫 Partidas de PDL' : '❌ Cancelamentos'}
              </h2>
              <button className="text-xs font-bold text-blue-600">Ver todas</button>
            </div>

            {/* Header colunas */}
            <div className="grid grid-cols-4 px-4 py-2 bg-slate-50 border-b border-slate-100">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wide">Companhia</span>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wide">Voo</span>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wide">Hora</span>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wide">Estado</span>
            </div>

            {/* Linhas */}
            {boardFlights.length === 0 ? (
              <div className="py-10 text-center text-slate-400 text-sm">Sem voos nesta categoria</div>
            ) : (
              boardFlights.map((f, i) => (
                <div key={i} className={`grid grid-cols-4 items-center px-4 py-3.5 ${i < boardFlights.length - 1 ? 'border-b border-slate-50' : ''} hover:bg-slate-50/50 transition-colors`}>
                  {/* Companhia */}
                  <div className="flex items-center gap-2">
                    <AirlineLogo airline={f.airline} size="sm" />
                    <span className="text-[10px] font-bold text-slate-600 leading-tight hidden sm:block">{AIRLINES[f.airline]?.name || f.airline}</span>
                  </div>
                  {/* Voo */}
                  <span className="text-xs font-black text-slate-700">{f.num}</span>
                  {/* Hora */}
                  <div className="flex items-center gap-1 text-sm font-black text-slate-800">
                    <Clock className="w-3 h-3 text-slate-400" />
                    {f.time}
                  </div>
                  {/* Estado */}
                  <StatusBadge status={f.status} />
                </div>
              ))
            )}
          </div>

          {/* Rodapé info */}
          <div className="mx-4 mt-3 flex items-center gap-2 text-[10px] text-slate-400">
            <Info className="w-3 h-3 shrink-0" />
            <span>Horários em hora local (PDL) · Última atualização: {new Date().toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' })} · <strong className="text-amber-600">Dados de demonstração</strong></span>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* ── VISTA: PASSAGENS À VENDA ───────────────────────────────────── */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {view === 'tickets' && (
        <div className="pb-28">

          {/* Formulário de pesquisa */}
          <div className="bg-white mx-4 mt-4 rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-4 pt-4 pb-2">
              <h2 className="text-base font-black text-slate-800">Passagens à Venda</h2>
              <p className="text-xs text-slate-400">Encontre as melhores ofertas para os Açores.</p>
            </div>

            <div className="p-4 space-y-3">
              {/* De / Para em linha */}
              <div className="flex items-stretch gap-2">
                {/* De */}
                <div className="flex-1 relative">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1">De</label>
                  <button onClick={() => { setShowFromDrop(!showFromDrop); setShowToDrop(false); setShowPaxDrop(false); }}
                    className="w-full flex items-center gap-2 px-3 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:border-blue-400 transition-colors">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="flex-1 text-left text-xs truncate">{getLabel(ticketFrom)}</span>
                  </button>
                  {showFromDrop && (
                    <AirportDropdown value={ticketFrom} onChange={setTicketFrom} onClose={() => setShowFromDrop(false)} />
                  )}
                </div>

                {/* Swap */}
                <div className="flex items-end pb-0.5">
                  <button onClick={handleSwapTicket} className="p-2.5 bg-blue-50 border border-blue-200 rounded-xl hover:bg-blue-100 transition-colors">
                    <ArrowLeftRight className="w-4 h-4 text-blue-600" />
                  </button>
                </div>

                {/* Para */}
                <div className="flex-1 relative">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1">Para</label>
                  <button onClick={() => { setShowToDrop(!showToDrop); setShowFromDrop(false); setShowPaxDrop(false); }}
                    className="w-full flex items-center gap-2 px-3 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:border-blue-400 transition-colors">
                    <PlaneTakeoff className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                    <span className="flex-1 text-left text-xs truncate">{getLabel(ticketTo)}</span>
                  </button>
                  {showToDrop && (
                    <AirportDropdown value={ticketTo} onChange={setTicketTo} onClose={() => setShowToDrop(false)} />
                  )}
                </div>
              </div>

              {/* Ida / Ida e volta */}
              <div className="flex gap-2">
                <button onClick={() => setTripType('ida')}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-black border transition-all ${tripType === 'ida' ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-200' : 'bg-white text-slate-500 border-slate-200'}`}>
                  Ida
                </button>
                <button onClick={() => setTripType('ida-volta')}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-black border transition-all ${tripType === 'ida-volta' ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-200' : 'bg-white text-slate-500 border-slate-200'}`}>
                  Ida e volta
                </button>
              </div>

              {/* Data / Passageiros */}
              <div className="flex gap-2">
                {/* Data */}
                <div className="flex-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1">Data de ida</label>
                  <div className="flex items-center gap-2 px-3 py-3 bg-slate-50 border border-slate-200 rounded-xl">
                    <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <input type="date" value={ticketDate} onChange={e => setTicketDate(e.target.value)}
                      className="flex-1 bg-transparent text-xs font-semibold text-slate-700 outline-none" />
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                </div>

                {/* Passageiros */}
                <div className="relative">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1">Passageiros</label>
                  <button onClick={() => { setShowPaxDrop(!showPaxDrop); setShowFromDrop(false); setShowToDrop(false); }}
                    className="flex items-center gap-2 px-3 py-3 bg-slate-50 border border-slate-200 rounded-xl hover:border-blue-400 transition-colors">
                    <Users className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-xs font-semibold text-slate-700">{pax} Passageiro{pax > 1 ? 's' : ''}</span>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                  {showPaxDrop && (
                    <div className="absolute right-0 top-full mt-1 z-50 bg-white border border-slate-200 rounded-2xl shadow-xl p-4 min-w-[180px]">
                      <p className="text-xs font-black text-slate-600 mb-3">Adultos</p>
                      <div className="flex items-center gap-4">
                        <button onClick={() => setPax(Math.max(1, pax - 1))} className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 font-bold text-slate-700 flex items-center justify-center">−</button>
                        <span className="font-black text-slate-800 text-lg w-6 text-center">{pax}</span>
                        <button onClick={() => setPax(Math.min(9, pax + 1))} className="w-8 h-8 rounded-full bg-blue-600 hover:bg-blue-700 font-bold text-white flex items-center justify-center">+</button>
                      </div>
                      <button onClick={() => setShowPaxDrop(false)} className="mt-4 w-full py-2 bg-blue-600 text-white text-xs font-black rounded-xl">Confirmar</button>
                    </div>
                  )}
                </div>
              </div>

              {/* Botão pesquisar */}
              <button onClick={handleSearch} disabled={searching}
                className="w-full py-4 bg-green-600 hover:bg-green-700 text-white font-black text-sm rounded-xl shadow-lg shadow-green-200 flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-60">
                {searching
                  ? <><RefreshCw className="w-4 h-4 animate-spin" /> A pesquisar passagens...</>
                  : <><Search className="w-4 h-4" /> Procurar Passagens</>}
              </button>
            </div>
          </div>

          {/* ── Resultados ─────────────────────────────────────────────────── */}
          {searched && (
            <div className="px-4 mt-4 space-y-3">

              {/* Demo banner */}
              <div className="flex items-start gap-2 px-3 py-2.5 bg-amber-50 border border-amber-200 rounded-xl">
                <Info className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                <p className="text-[10px] text-amber-700 font-semibold leading-relaxed">
                  Preços e horários são simulados — <strong>dados de demonstração institucional</strong>. Fase de apresentação à SATA, Azores Airlines e Governo Regional.
                </p>
              </div>

              {tickets.map((t, i) => (
                <div key={i} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">

                  {/* Badge se existir */}
                  {t.badgeText && (
                    <div className={`px-4 py-1.5 text-xs font-black flex items-center gap-1.5 ${t.badgeText === 'Mais económico' ? 'bg-emerald-50 text-emerald-700 border-b border-emerald-100' : t.badgeText === 'Mais popular' ? 'bg-yellow-50 text-yellow-700 border-b border-yellow-100' : 'bg-blue-50 text-blue-700 border-b border-blue-100'}`}>
                      <span className="w-2 h-2 rounded-full" style={{ background: 'currentColor' }} />
                      {t.badgeText}
                    </div>
                  )}

                  <div className="p-4">
                    {/* Linha: Logo + Rota + Preço + Botões */}
                    <div className="flex items-center gap-3">
                      <AirlineLogo airline={t.airline} size="lg" />

                      {/* Info voo */}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-black text-slate-700 mb-0.5">{AIRLINES[t.airline]?.name || t.airline}</p>
                        <div className="flex items-center gap-2">
                          {/* Origem */}
                          <div className="text-center">
                            <p className="text-xl font-black text-slate-900 leading-none">{t.dep}</p>
                            <p className="text-[10px] font-bold text-slate-400">{ticketFrom}</p>
                          </div>
                          {/* Duração */}
                          <div className="flex-1 flex flex-col items-center gap-0.5">
                            <p className="text-[10px] text-slate-400">{t.duration}</p>
                            <div className="w-full flex items-center gap-0.5">
                              <div className="h-px flex-1 bg-slate-200" />
                              <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                              <div className="h-px flex-1 bg-slate-200" />
                            </div>
                            <p className={`text-[9px] font-black ${t.stops === 0 ? 'text-green-600' : 'text-amber-600'}`}>
                              {t.stops === 0 ? 'Direto' : `${t.stops} escala`}
                            </p>
                          </div>
                          {/* Destino */}
                          <div className="text-center">
                            <p className="text-xl font-black text-slate-900 leading-none">{t.arr}</p>
                            <p className="text-[10px] font-bold text-slate-400">{ticketTo}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Linha inferior: preço + botões */}
                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-50">
                      <div>
                        <p className="text-[10px] text-slate-400">{t.trip} · {pax} pax (demo)</p>
                        <p className="text-2xl font-black text-slate-900">€ {t.price}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => toggleLike(i)}
                          className={`p-2.5 rounded-xl border transition-colors ${likedFlights.has(i) ? 'bg-red-50 border-red-200 text-red-500' : 'bg-slate-50 border-slate-200 text-slate-400 hover:text-red-400'}`}>
                          <Heart className={`w-4 h-4 ${likedFlights.has(i) ? 'fill-current' : ''}`} />
                        </button>
                        <button className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs rounded-xl shadow-md shadow-blue-200 transition-all active:scale-95">
                          Reservar
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Rodapé */}
              <div className="text-center py-4">
                <p className="text-[10px] text-slate-400">Dados simulados · Demonstração institucional Azores4you</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FlightSearchSection;
