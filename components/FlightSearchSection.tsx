import React, { useState, useEffect } from 'react';
import {
  PlaneTakeoff, PlaneLanding, Search, ArrowRight, ArrowLeftRight,
  Calendar, Users, Filter, X, ChevronDown, Clock, MapPin,
  AlertCircle, CheckCircle2, Ban, Star, Wifi, Coffee,
  Luggage, ChevronRight, RefreshCw, TrendingDown, Info,
  Globe, Building2, Zap, Shield, CreditCard, Phone,
  ArrowLeft
} from 'lucide-react';
import { Language } from '../types';

interface FlightSearchSectionProps {
  language?: Language;
  onClose?: () => void;
}

// ─── DATA ────────────────────────────────────────────────────────────────────

const AZORES_AIRPORTS = [
  { code: 'PDL', name: 'João Paulo II', island: 'São Miguel', emoji: '🌋' },
  { code: 'TER', name: 'Lajes', island: 'Terceira', emoji: '🏰' },
  { code: 'FAI', name: 'Santa Cruz', island: 'Faial', emoji: '🌺' },
  { code: 'PIX', name: 'Pico', island: 'Pico', emoji: '⛰️' },
  { code: 'SJZ', name: 'São Jorge', island: 'São Jorge', emoji: '🌿' },
  { code: 'GRW', name: 'Graciosa', island: 'Graciosa', emoji: '🌾' },
  { code: 'FLW', name: 'Flores', island: 'Flores', emoji: '🌸' },
  { code: 'CVU', name: 'Corvo', island: 'Corvo', emoji: '🦅' },
  { code: 'SMA', name: 'Santa Maria', island: 'Santa Maria', emoji: '🏖️' },
];

const INTERNATIONAL_AIRPORTS = [
  { code: 'LIS', name: 'Humberto Delgado', city: 'Lisboa', country: 'Portugal', emoji: '🇵🇹' },
  { code: 'OPO', name: 'Francisco Sá Carneiro', city: 'Porto', country: 'Portugal', emoji: '🇵🇹' },
  { code: 'LHR', name: 'Heathrow', city: 'Londres', country: 'Reino Unido', emoji: '🇬🇧' },
  { code: 'CDG', name: 'Charles de Gaulle', city: 'Paris', country: 'França', emoji: '🇫🇷' },
  { code: 'FRA', name: 'Frankfurt', city: 'Frankfurt', country: 'Alemanha', emoji: '🇩🇪' },
  { code: 'AMS', name: 'Schiphol', city: 'Amesterdão', country: 'Países Baixos', emoji: '🇳🇱' },
  { code: 'MAD', name: 'Adolfo Suárez', city: 'Madrid', country: 'Espanha', emoji: '🇪🇸' },
  { code: 'BCN', name: 'El Prat', city: 'Barcelona', country: 'Espanha', emoji: '🇪🇸' },
  { code: 'FCO', name: 'Fiumicino', city: 'Roma', country: 'Itália', emoji: '🇮🇹' },
  { code: 'MXP', name: 'Malpensa', city: 'Milão', country: 'Itália', emoji: '🇮🇹' },
  { code: 'ZRH', name: 'Zurique', city: 'Zurique', country: 'Suíça', emoji: '🇨🇭' },
  { code: 'DUB', name: 'Dublin', city: 'Dublin', country: 'Irlanda', emoji: '🇮🇪' },
  { code: 'BOS', name: 'Logan Intl', city: 'Boston', country: 'EUA', emoji: '🇺🇸' },
  { code: 'JFK', name: 'JFK Intl', city: 'Nova Iorque', country: 'EUA', emoji: '🇺🇸' },
  { code: 'YYZ', name: 'Pearson Intl', city: 'Toronto', country: 'Canadá', emoji: '🇨🇦' },
  { code: 'GRU', name: 'Guarulhos Intl', city: 'São Paulo', country: 'Brasil', emoji: '🇧🇷' },
];

const ALL_AIRPORTS = [
  ...AZORES_AIRPORTS.map(a => ({ ...a, city: a.island, country: 'Portugal (Açores)', isAzores: true })),
  ...INTERNATIONAL_AIRPORTS.map(a => ({ ...a, island: undefined as string | undefined, isAzores: false })),
];

const AIRLINES = [
  { code: 'S4', name: 'SATA Air Açores', color: '#005DA8', bg: '#EBF4FF', logo: '✈️' },
  { code: 'TP', name: 'Azores Airlines', color: '#003D91', bg: '#E8EFFF', logo: '🌊' },
  { code: 'FR', name: 'Ryanair', color: '#073590', bg: '#EBF0FF', logo: '🟡' },
  { code: 'U2', name: 'easyJet', color: '#FF6600', bg: '#FFF3EB', logo: '🟠' },
  { code: 'TP2', name: 'TAP Air Portugal', color: '#006600', bg: '#EBFFEB', logo: '🍀' },
  { code: 'LH', name: 'Lufthansa', color: '#05164D', bg: '#EBF2FF', logo: '🦅' },
  { code: 'BA', name: 'British Airways', color: '#2B6CB0', bg: '#EBF4FF', logo: '🇬🇧' },
  { code: 'VY', name: 'Vueling', color: '#FFD700', bg: '#FFFBEB', logo: '🟡' },
];

const LIVE_BOARD = [
  { flight: 'S4201', airline: 'SATA Air Açores', origin: 'LIS', destination: 'PDL', dep: '06:30', arr: '08:40', status: 'A Horas', terminal: 'A', gate: 'G2', type: 'partida' },
  { flight: 'TP1201', airline: 'Azores Airlines', origin: 'PDL', destination: 'LIS', dep: '09:10', arr: '11:20', status: 'Embarque', terminal: 'A', gate: 'G5', type: 'partida' },
  { flight: 'U2432', airline: 'easyJet', origin: 'LGW', destination: 'PDL', dep: '10:30', arr: '12:45', status: 'A Horas', terminal: 'A', gate: 'G1', type: 'chegada' },
  { flight: 'S4101', airline: 'SATA Air Açores', origin: 'PDL', destination: 'TER', dep: '11:00', arr: '11:35', status: 'A Horas', terminal: 'B', gate: 'G7', type: 'partida' },
  { flight: 'FR5621', airline: 'Ryanair', origin: 'STN', destination: 'PDL', dep: '12:15', arr: '14:25', status: 'Atrasado', terminal: 'A', gate: 'G3', type: 'chegada' },
  { flight: 'TP1205', airline: 'Azores Airlines', origin: 'PDL', destination: 'BOS', dep: '13:45', arr: '21:00', status: 'A Horas', terminal: 'A', gate: 'G6', type: 'partida' },
  { flight: 'S4103', airline: 'SATA Air Açores', origin: 'TER', destination: 'PDL', dep: '14:20', arr: '14:55', status: 'A Horas', terminal: 'B', gate: 'G8', type: 'chegada' },
  { flight: 'S4205', airline: 'SATA Air Açores', origin: 'FAI', destination: 'PDL', dep: '15:00', arr: '15:50', status: 'A Horas', terminal: 'B', gate: 'G9', type: 'chegada' },
  { flight: 'TP1203', airline: 'Azores Airlines', origin: 'LIS', destination: 'PDL', dep: '16:30', arr: '18:40', status: 'A Horas', terminal: 'A', gate: 'G4', type: 'chegada' },
  { flight: 'S4107', airline: 'SATA Air Açores', origin: 'PDL', destination: 'PIX', dep: '17:10', arr: '17:50', status: 'Cancelado', terminal: 'B', gate: '-', type: 'partida' },
  { flight: 'LH1234', airline: 'Lufthansa', origin: 'FRA', destination: 'PDL', dep: '18:00', arr: '20:30', status: 'A Horas', terminal: 'A', gate: 'G2', type: 'chegada' },
  { flight: 'S4209', airline: 'SATA Air Açores', origin: 'PDL', destination: 'GRW', dep: '18:45', arr: '19:20', status: 'A Horas', terminal: 'B', gate: 'G10', type: 'partida' },
];

function generateFlights(origin: string, destination: string, date: string, passengers: number, tripType: 'ida' | 'ida-volta' | 'inter-ilhas') {
  const seed = origin.charCodeAt(0) + destination.charCodeAt(0) + (date ? date.charCodeAt(0) : 0);
  const isLongHaul = ['JFK', 'BOS', 'YYZ', 'GRU'].includes(origin) || ['JFK', 'BOS', 'YYZ', 'GRU'].includes(destination);
  const basePrice = tripType === 'inter-ilhas' ? 35 : (isLongHaul ? 380 : (origin === 'LIS' || destination === 'LIS' ? 85 : 180));
  const airlinesToUse = tripType === 'inter-ilhas' ? [AIRLINES[0], AIRLINES[1]] : AIRLINES.slice(0, 6);
  const results = [];

  for (let i = 0; i < Math.min(airlinesToUse.length, 5); i++) {
    const airline = airlinesToUse[i % airlinesToUse.length];
    const hour = (6 + (seed * (i + 1) * 3) % 16);
    const min = ((seed * i * 7) % 4) * 15;
    const durationH = tripType === 'inter-ilhas' ? 0 : (isLongHaul ? 7 : 2);
    const durationM = 20 + (i * 15) % 40;
    const arrH = (hour + durationH + (min + durationM >= 60 ? 1 : 0)) % 24;
    const arrM = (min + durationM) % 60;
    const stops = i === 0 ? 0 : (tripType === 'inter-ilhas' ? 0 : Math.floor(i / 3));
    const price = Math.round((basePrice + i * 22 + (seed % 50)) * passengers);
    const status = i === 3 ? 'Atrasado' : i === 4 ? 'Cancelado' : 'A Horas';
    const amenities = ['bagagem', 'wifi', 'refeição'].slice(0, 1 + i % 3);

    results.push({
      id: `fl-${origin}-${destination}-${i}`,
      airline: airline.name,
      airlineCode: airline.code,
      airlineColor: airline.color,
      airlineBg: airline.bg,
      airlineLogo: airline.logo,
      flightNumber: `${airline.code}${1000 + seed + i * 17}`,
      origin,
      destination,
      departureTime: `${String(hour).padStart(2, '0')}:${String(min).padStart(2, '0')}`,
      arrivalTime: `${String(arrH).padStart(2, '0')}:${String(arrM).padStart(2, '0')}`,
      duration: tripType === 'inter-ilhas' ? `${35 + i * 10}min` : `${durationH}h ${String(durationM).padStart(2, '0')}m`,
      stops,
      layover: stops > 0 ? 'Escala em LIS (1h 20m)' : undefined,
      price,
      pricePerPax: Math.round(price / passengers),
      status: status as 'A Horas' | 'Atrasado' | 'Cancelado',
      amenities,
      seats: 3 + (i * 4) % 12,
    });
  }
  return results;
}

const FlightSearchSection: React.FC<FlightSearchSectionProps> = ({ language = 'pt', onClose }) => {
  const [activeTab, setActiveTab] = useState<'search' | 'board' | 'interilhas' | 'companhias'>('search');
  const [tripMode, setTripMode] = useState<'ida' | 'ida-volta' | 'inter-ilhas'>('ida');
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('PDL');
  const [departDate, setDepartDate] = useState(() => {
    const d = new Date(); d.setDate(d.getDate() + 7);
    return d.toISOString().split('T')[0];
  });
  const [returnDate, setReturnDate] = useState(() => {
    const d = new Date(); d.setDate(d.getDate() + 14);
    return d.toISOString().split('T')[0];
  });
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [cabinClass, setCabinClass] = useState<'economy' | 'business'>('economy');
  const [showOriginDropdown, setShowOriginDropdown] = useState(false);
  const [showDestDropdown, setShowDestDropdown] = useState(false);
  const [originSearch, setOriginSearch] = useState('');
  const [destSearch, setDestSearch] = useState('');
  const [searchResults, setSearchResults] = useState<ReturnType<typeof generateFlights>>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedFlight, setSelectedFlight] = useState<ReturnType<typeof generateFlights>[number] | null>(null);
  const [boardFilter, setBoardFilter] = useState<'todos' | 'partidas' | 'chegadas'>('todos');
  const [boardStatusFilter, setBoardStatusFilter] = useState<string>('todos');
  const [selectedInterIsland, setSelectedInterIsland] = useState<{ from: string; to: string } | null>(null);
  const [interIslandResults, setInterIslandResults] = useState<ReturnType<typeof generateFlights>>([]);
  const [filterAirline, setFilterAirline] = useState('todos');
  const [filterDirect, setFilterDirect] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const passengers = adults + children;

  const filteredOrigins = ALL_AIRPORTS.filter(a =>
    !originSearch ||
    a.code.toLowerCase().includes(originSearch.toLowerCase()) ||
    a.name.toLowerCase().includes(originSearch.toLowerCase()) ||
    (a.city || '').toLowerCase().includes(originSearch.toLowerCase())
  );

  const filteredDests = ALL_AIRPORTS.filter(a =>
    !destSearch ||
    a.code.toLowerCase().includes(destSearch.toLowerCase()) ||
    a.name.toLowerCase().includes(destSearch.toLowerCase()) ||
    (a.city || '').toLowerCase().includes(destSearch.toLowerCase())
  );

  const getAirportLabel = (code: string) => {
    const a = ALL_AIRPORTS.find(x => x.code === code);
    return a ? `${a.emoji || '✈️'} ${a.city || a.island} (${a.code})` : code;
  };

  const swapRoutes = () => {
    const tmpO = origin;
    setOrigin(destination);
    setDestination(tmpO);
  };

  const handleSearch = () => {
    if (!origin || !destination) return;
    setIsSearching(true);
    setHasSearched(false);
    setTimeout(() => {
      const results = generateFlights(origin, destination, departDate, passengers, tripMode === 'inter-ilhas' ? 'inter-ilhas' : tripMode);
      setSearchResults(results);
      setIsSearching(false);
      setHasSearched(true);
    }, 1400);
  };

  const handleInterIsland = (from: string, to: string) => {
    setSelectedInterIsland({ from, to });
    const results = generateFlights(from, to, departDate, passengers, 'inter-ilhas');
    setInterIslandResults(results);
  };

  const filteredResults = searchResults.filter(f => {
    if (filterAirline !== 'todos' && !f.airline.toLowerCase().includes(filterAirline.toLowerCase())) return false;
    if (filterDirect && f.stops > 0) return false;
    return true;
  });

  const filteredBoard = LIVE_BOARD.filter(f => {
    if (boardFilter === 'partidas' && f.type !== 'partida') return false;
    if (boardFilter === 'chegadas' && f.type !== 'chegada') return false;
    if (boardStatusFilter !== 'todos' && f.status !== boardStatusFilter) return false;
    return true;
  });

  const statusColor = (s: string) => {
    if (s === 'A Horas') return 'text-emerald-600 bg-emerald-50';
    if (s === 'Atrasado') return 'text-amber-600 bg-amber-50';
    if (s === 'Embarque') return 'text-blue-600 bg-blue-50';
    if (s === 'Cancelado') return 'text-red-600 bg-red-50';
    return 'text-slate-500 bg-slate-100';
  };

  const statusIcon = (s: string) => {
    if (s === 'A Horas') return <CheckCircle2 className="w-3 h-3" />;
    if (s === 'Atrasado') return <AlertCircle className="w-3 h-3" />;
    if (s === 'Cancelado') return <Ban className="w-3 h-3" />;
    return <Clock className="w-3 h-3" />;
  };

  // ─── FLIGHT DETAIL VIEW ────────────────────────────────────────────────────

  if (selectedFlight) {
    const sf = selectedFlight;
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white">
        <div className="sticky top-0 z-20 bg-black/40 backdrop-blur-md border-b border-white/10 flex items-center gap-3 px-4 py-4">
          <button onClick={() => setSelectedFlight(null)} className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-base font-black">Detalhes do Voo</h2>
            <p className="text-xs text-white/60">{sf.flightNumber} · Dados de Demonstração</p>
          </div>
          <div className="ml-auto bg-amber-500/20 border border-amber-500/30 px-3 py-1 rounded-full">
            <span className="text-[10px] font-black text-amber-400 uppercase tracking-wider">DEMO</span>
          </div>
        </div>

        <div className="p-4 space-y-4 pb-32">
          {/* Route */}
          <div className="bg-white/5 backdrop-blur border border-white/10 rounded-3xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="text-center">
                <p className="text-4xl font-black">{sf.origin}</p>
                <p className="text-xs text-white/50 mt-1">{ALL_AIRPORTS.find(a => a.code === sf.origin)?.city || sf.origin}</p>
                <p className="text-2xl font-bold mt-3">{sf.departureTime}</p>
              </div>
              <div className="flex-1 px-4 flex flex-col items-center gap-2">
                <div className="flex items-center gap-2 text-white/40 text-xs"><Clock className="w-3 h-3" />{sf.duration}</div>
                <div className="w-full flex items-center gap-1">
                  <div className="h-px flex-1 bg-white/20" />
                  <PlaneTakeoff className="w-5 h-5 text-sky-400" />
                  <div className="h-px flex-1 bg-white/20" />
                </div>
                <p className={`text-[10px] font-bold ${sf.stops === 0 ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {sf.stops === 0 ? 'Direto' : `${sf.stops} escala(s)`}
                </p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-black">{sf.destination}</p>
                <p className="text-xs text-white/50 mt-1">{ALL_AIRPORTS.find(a => a.code === sf.destination)?.city || sf.destination}</p>
                <p className="text-2xl font-bold mt-3">{sf.arrivalTime}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-white/5 rounded-2xl p-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg" style={{ background: sf.airlineBg }}>
                {sf.airlineLogo}
              </div>
              <div>
                <p className="font-bold text-sm">{sf.airline}</p>
                <p className="text-xs text-white/40">{sf.flightNumber}</p>
              </div>
              <div className="ml-auto">
                <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${statusColor(sf.status)}`}>
                  {statusIcon(sf.status)} {sf.status}
                </span>
              </div>
            </div>
          </div>

          {/* Price */}
          <div className="bg-white/5 border border-white/10 rounded-3xl p-5 space-y-3">
            <h3 className="font-black text-sm uppercase tracking-wider text-white/60">Preço Total (Demo)</h3>
            <div className="flex justify-between text-sm">
              <span className="text-white/70">Passagem ({passengers} pax)</span>
              <span className="font-bold">€{sf.pricePerPax} × {passengers}</span>
            </div>
            {cabinClass === 'business' && (
              <div className="flex justify-between text-sm">
                <span className="text-white/70">Upgrade Business</span>
                <span className="font-bold">+€{Math.round(sf.pricePerPax * 0.6)} × {passengers}</span>
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span className="text-white/70">Taxas e encargos</span>
              <span className="font-bold">€{Math.round(sf.price * 0.12)}</span>
            </div>
            <div className="border-t border-white/10 pt-3 flex justify-between">
              <span className="font-black">Total</span>
              <span className="text-3xl font-black text-sky-400">€{sf.price + Math.round(sf.price * 0.12)}</span>
            </div>
          </div>

          {/* Amenities */}
          <div className="bg-white/5 border border-white/10 rounded-3xl p-5">
            <h3 className="font-black text-sm uppercase tracking-wider text-white/60 mb-4">Incluído</h3>
            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: <Luggage className="w-5 h-5" />, label: 'Bagagem de Mão', included: true },
                { icon: <Luggage className="w-5 h-5" />, label: 'Bagagem Porão', included: sf.amenities.includes('bagagem') },
                { icon: <Wifi className="w-5 h-5" />, label: 'Wi-Fi a Bordo', included: sf.amenities.includes('wifi') },
                { icon: <Coffee className="w-5 h-5" />, label: 'Refeição', included: sf.amenities.includes('refeição') },
                { icon: <Shield className="w-5 h-5" />, label: 'Seguro', included: false },
                { icon: <Star className="w-5 h-5" />, label: 'Lugar Preferencial', included: false },
              ].map((item, i) => (
                <div key={i} className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl border ${item.included ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400' : 'border-white/5 bg-white/5 text-white/30'}`}>
                  {item.icon}
                  <span className="text-[9px] font-bold text-center leading-tight">{item.label}</span>
                  {item.included ? <CheckCircle2 className="w-3 h-3" /> : <X className="w-3 h-3" />}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 flex gap-3">
            <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-200/80 leading-relaxed">
              Dados de demonstração institucional. Preços, horários e disponibilidades são simulados. Esta plataforma está em fase de apresentação à SATA, Azores Airlines e entidades do Governo Regional dos Açores.
            </p>
          </div>

          <button className="w-full py-5 rounded-3xl bg-gradient-to-r from-sky-500 to-blue-600 text-white font-black text-base shadow-2xl shadow-sky-500/30 flex items-center justify-center gap-3 transition-transform active:scale-95">
            <CreditCard className="w-5 h-5" /> Reservar este Voo (Demo)
          </button>
        </div>
      </div>
    );
  }

  // ─── MAIN RENDER ──────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white">

      {/* HEADER */}
      <div className="relative overflow-hidden">
        <div className="px-4 pt-6 pb-4 flex items-center gap-3">
          {onClose && (
            <button onClick={onClose} className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <div>
            <div className="flex items-center gap-2">
              <PlaneTakeoff className="w-6 h-6 text-sky-400" />
              <h1 className="text-xl font-black tracking-tight">Voos Açores</h1>
            </div>
            <p className="text-xs text-white/50 mt-0.5">Pesquisa mundial de voos · Dados de demonstração</p>
          </div>
          <div className="ml-auto bg-amber-500/20 border border-amber-500/30 px-3 py-1.5 rounded-full">
            <span className="text-[9px] font-black text-amber-400 uppercase tracking-wider">DEMO INSTITUCIONAL</span>
          </div>
        </div>

        {/* TABS */}
        <div className="flex gap-1 px-4 pb-4 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
          {[
            { id: 'search', label: 'Pesquisar', icon: <Search className="w-3.5 h-3.5" /> },
            { id: 'board', label: 'Painel', icon: <Globe className="w-3.5 h-3.5" /> },
            { id: 'interilhas', label: 'Inter-Ilhas', icon: <ArrowLeftRight className="w-3.5 h-3.5" /> },
            { id: 'companhias', label: 'Companhias', icon: <Building2 className="w-3.5 h-3.5" /> },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-2xl text-xs font-black whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/30'
                  : 'bg-white/10 text-white/60 hover:bg-white/15'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── TAB SEARCH ─────────────────────────────────────────────────────── */}
      {activeTab === 'search' && (
        <div className="px-4 pb-32 space-y-4">

          {/* Trip Mode */}
          <div className="flex gap-2">
            {(['ida', 'ida-volta', 'inter-ilhas'] as const).map(m => (
              <button
                key={m}
                onClick={() => {
                  setTripMode(m);
                  if (m === 'inter-ilhas') { setOrigin('PDL'); setDestination('TER'); }
                }}
                className={`flex-1 py-2.5 rounded-2xl text-xs font-black transition-all border ${
                  tripMode === m ? 'bg-white text-slate-900 border-transparent' : 'bg-white/5 text-white/60 border-white/10'
                }`}
              >
                {m === 'ida' ? '→ Só Ida' : m === 'ida-volta' ? '↔ Ida/Volta' : '🏝️ Ilhas'}
              </button>
            ))}
          </div>

          {/* Form */}
          <div className="bg-white/5 backdrop-blur border border-white/10 rounded-3xl p-4 space-y-3">

            {/* Origin */}
            <div className="relative">
              <label className="text-[10px] font-black text-white/40 uppercase tracking-wider block mb-1.5">Origem</label>
              <button
                onClick={() => { setShowOriginDropdown(!showOriginDropdown); setShowDestDropdown(false); }}
                className="w-full flex items-center gap-3 bg-white/10 hover:bg-white/15 transition-colors p-4 rounded-2xl text-left"
              >
                <PlaneTakeoff className="w-4 h-4 text-sky-400 shrink-0" />
                <span className={`flex-1 font-bold text-sm ${origin ? 'text-white' : 'text-white/40'}`}>
                  {origin ? getAirportLabel(origin) : 'Selecionar aeroporto de partida'}
                </span>
                <ChevronDown className="w-4 h-4 text-white/30" />
              </button>
              {showOriginDropdown && (
                <div className="absolute left-0 right-0 top-full mt-2 z-50 bg-slate-800 border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col" style={{ maxHeight: '280px' }}>
                  <div className="p-3 border-b border-white/5">
                    <input
                      autoFocus
                      placeholder="Pesquisar aeroporto..."
                      value={originSearch}
                      onChange={e => setOriginSearch(e.target.value)}
                      className="w-full bg-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder:text-white/30 outline-none"
                    />
                  </div>
                  <div className="overflow-y-auto">
                    {filteredOrigins.some(a => a.isAzores) && (
                      <>
                        <p className="text-[10px] font-black text-sky-400 uppercase tracking-wider px-4 pt-3 pb-1">🏝️ Açores</p>
                        {filteredOrigins.filter(a => a.isAzores).map(a => (
                          <button key={a.code} onClick={() => { setOrigin(a.code); setShowOriginDropdown(false); setOriginSearch(''); }}
                            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/10 transition-colors text-left">
                            <span className="text-lg">{a.emoji}</span>
                            <div>
                              <p className="font-bold text-sm text-white">{a.city || a.island} ({a.code})</p>
                              <p className="text-xs text-white/40">{a.name}</p>
                            </div>
                          </button>
                        ))}
                      </>
                    )}
                    {filteredOrigins.some(a => !a.isAzores) && (
                      <>
                        <p className="text-[10px] font-black text-white/40 uppercase tracking-wider px-4 pt-3 pb-1">🌍 Internacional</p>
                        {filteredOrigins.filter(a => !a.isAzores).map(a => (
                          <button key={a.code} onClick={() => { setOrigin(a.code); setShowOriginDropdown(false); setOriginSearch(''); }}
                            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/10 transition-colors text-left">
                            <span className="text-lg">{a.emoji}</span>
                            <div>
                              <p className="font-bold text-sm text-white">{a.city} ({a.code})</p>
                              <p className="text-xs text-white/40">{a.name} · {a.country}</p>
                            </div>
                          </button>
                        ))}
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Swap */}
            <div className="flex justify-center">
              <button onClick={swapRoutes} className="p-2.5 bg-white/10 hover:bg-white/20 rounded-xl transition-all active:scale-90">
                <ArrowLeftRight className="w-4 h-4 text-sky-400" />
              </button>
            </div>

            {/* Destination */}
            <div className="relative">
              <label className="text-[10px] font-black text-white/40 uppercase tracking-wider block mb-1.5">Destino</label>
              <button
                onClick={() => { setShowDestDropdown(!showDestDropdown); setShowOriginDropdown(false); }}
                className="w-full flex items-center gap-3 bg-white/10 hover:bg-white/15 transition-colors p-4 rounded-2xl text-left"
              >
                <PlaneLanding className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className={`flex-1 font-bold text-sm ${destination ? 'text-white' : 'text-white/40'}`}>
                  {destination ? getAirportLabel(destination) : 'Selecionar destino'}
                </span>
                <ChevronDown className="w-4 h-4 text-white/30" />
              </button>
              {showDestDropdown && (
                <div className="absolute left-0 right-0 top-full mt-2 z-50 bg-slate-800 border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col" style={{ maxHeight: '280px' }}>
                  <div className="p-3 border-b border-white/5">
                    <input
                      autoFocus
                      placeholder="Pesquisar destino..."
                      value={destSearch}
                      onChange={e => setDestSearch(e.target.value)}
                      className="w-full bg-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder:text-white/30 outline-none"
                    />
                  </div>
                  <div className="overflow-y-auto">
                    {filteredDests.some(a => a.isAzores) && (
                      <>
                        <p className="text-[10px] font-black text-sky-400 uppercase tracking-wider px-4 pt-3 pb-1">🏝️ Açores</p>
                        {filteredDests.filter(a => a.isAzores).map(a => (
                          <button key={a.code} onClick={() => { setDestination(a.code); setShowDestDropdown(false); setDestSearch(''); }}
                            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/10 transition-colors text-left">
                            <span className="text-lg">{a.emoji}</span>
                            <div>
                              <p className="font-bold text-sm text-white">{a.city || a.island} ({a.code})</p>
                              <p className="text-xs text-white/40">{a.name}</p>
                            </div>
                          </button>
                        ))}
                      </>
                    )}
                    {filteredDests.some(a => !a.isAzores) && (
                      <>
                        <p className="text-[10px] font-black text-white/40 uppercase tracking-wider px-4 pt-3 pb-1">🌍 Internacional</p>
                        {filteredDests.filter(a => !a.isAzores).map(a => (
                          <button key={a.code} onClick={() => { setDestination(a.code); setShowDestDropdown(false); setDestSearch(''); }}
                            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/10 transition-colors text-left">
                            <span className="text-lg">{a.emoji}</span>
                            <div>
                              <p className="font-bold text-sm text-white">{a.city} ({a.code})</p>
                              <p className="text-xs text-white/40">{a.name} · {a.country}</p>
                            </div>
                          </button>
                        ))}
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Dates */}
            <div className={`grid ${tripMode === 'ida-volta' ? 'grid-cols-2' : 'grid-cols-1'} gap-2`}>
              <div>
                <label className="text-[10px] font-black text-white/40 uppercase tracking-wider block mb-1.5">
                  {tripMode === 'ida-volta' ? 'Partida' : 'Data de Partida'}
                </label>
                <div className="flex items-center gap-2 bg-white/10 p-4 rounded-2xl">
                  <Calendar className="w-4 h-4 text-sky-400 shrink-0" />
                  <input type="date" value={departDate} onChange={e => setDepartDate(e.target.value)}
                    className="flex-1 bg-transparent text-white text-sm font-bold outline-none" />
                </div>
              </div>
              {tripMode === 'ida-volta' && (
                <div>
                  <label className="text-[10px] font-black text-white/40 uppercase tracking-wider block mb-1.5">Regresso</label>
                  <div className="flex items-center gap-2 bg-white/10 p-4 rounded-2xl">
                    <Calendar className="w-4 h-4 text-emerald-400 shrink-0" />
                    <input type="date" value={returnDate} onChange={e => setReturnDate(e.target.value)}
                      className="flex-1 bg-transparent text-white text-sm font-bold outline-none" />
                  </div>
                </div>
              )}
            </div>

            {/* Passengers & Class */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] font-black text-white/40 uppercase tracking-wider block mb-1.5">Passageiros</label>
                <div className="flex items-center gap-2 bg-white/10 p-3 rounded-2xl">
                  <Users className="w-4 h-4 text-sky-400 shrink-0" />
                  <button onClick={() => setAdults(Math.max(1, adults - 1))} className="w-6 h-6 rounded-full bg-white/10 font-bold text-sm flex items-center justify-center">-</button>
                  <span className="font-black text-sm w-4 text-center">{adults}</span>
                  <button onClick={() => setAdults(Math.min(9, adults + 1))} className="w-6 h-6 rounded-full bg-white/10 font-bold text-sm flex items-center justify-center">+</button>
                </div>
              </div>
              <div>
                <label className="text-[10px] font-black text-white/40 uppercase tracking-wider block mb-1.5">Classe</label>
                <div className="flex gap-1">
                  {(['economy', 'business'] as const).map(c => (
                    <button key={c} onClick={() => setCabinClass(c)}
                      className={`flex-1 rounded-2xl text-xs font-black py-3 transition-all ${cabinClass === c ? 'bg-sky-500 text-white' : 'bg-white/10 text-white/50'}`}>
                      {c === 'economy' ? '💺 Eco' : '⭐ Biz'}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Search CTA */}
            <button
              onClick={handleSearch}
              disabled={!origin || !destination || isSearching}
              className="w-full py-5 rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 text-white font-black text-base shadow-xl shadow-sky-500/30 flex items-center justify-center gap-3 disabled:opacity-40 transition-all active:scale-95"
            >
              {isSearching ? <><RefreshCw className="w-5 h-5 animate-spin" /> A pesquisar...</> : <><Search className="w-5 h-5" /> Pesquisar Voos</>}
            </button>
          </div>

          {/* Results */}
          {hasSearched && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-black text-lg">{filteredResults.length} voos encontrados</p>
                  <p className="text-xs text-white/40">{getAirportLabel(origin)} → {getAirportLabel(destination)}</p>
                </div>
                <button onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-1.5 px-3 py-2 bg-white/10 rounded-xl text-xs font-bold">
                  <Filter className="w-3.5 h-3.5" /> Filtros
                </button>
              </div>

              {showFilters && (
                <div className="bg-white/5 border border-white/10 rounded-3xl p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="font-black text-sm">Filtros</p>
                    <button onClick={() => { setFilterAirline('todos'); setFilterDirect(false); }} className="text-xs text-sky-400">Limpar</button>
                  </div>
                  <div>
                    <p className="text-xs text-white/40 mb-2">Companhia</p>
                    <div className="flex gap-2 flex-wrap">
                      {['todos', ...AIRLINES.slice(0, 4).map(a => a.name)].map(name => (
                        <button key={name} onClick={() => setFilterAirline(name)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold ${filterAirline === name ? 'bg-sky-500 text-white' : 'bg-white/10 text-white/50'}`}>
                          {name === 'todos' ? 'Todas' : name.split(' ')[0]}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-white/40">Apenas voos diretos</p>
                    <button onClick={() => setFilterDirect(!filterDirect)}
                      className={`w-12 h-6 rounded-full transition-all relative ${filterDirect ? 'bg-sky-500' : 'bg-white/20'}`}>
                      <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${filterDirect ? 'left-6' : 'left-0.5'}`} />
                    </button>
                  </div>
                </div>
              )}

              <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 flex gap-3">
                <Zap className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <p className="text-xs text-amber-200/80"><strong>Demonstração institucional.</strong> Preços e horários são simulados.</p>
              </div>

              {filteredResults.length === 0 ? (
                <div className="text-center py-16">
                  <PlaneTakeoff className="w-12 h-12 text-white/20 mx-auto mb-3" />
                  <p className="text-white/40 font-bold">Nenhum voo com os filtros selecionados</p>
                </div>
              ) : (
                filteredResults.map((flight, i) => (
                  <div key={flight.id}
                    onClick={() => flight.status !== 'Cancelado' && setSelectedFlight(flight)}
                    className={`bg-white/5 border rounded-3xl overflow-hidden transition-all ${
                      flight.status === 'Cancelado'
                        ? 'border-red-500/20 opacity-60 cursor-not-allowed'
                        : 'border-white/10 hover:border-sky-500/40 cursor-pointer hover:bg-white/10'
                    }`}
                  >
                    {i === 0 && (
                      <div className="bg-gradient-to-r from-emerald-500 to-teal-500 px-4 py-1.5 flex items-center gap-2">
                        <TrendingDown className="w-3 h-3 text-white" />
                        <span className="text-xs font-black text-white">Melhor Preço (Demo)</span>
                      </div>
                    )}
                    <div className="p-5">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-base" style={{ background: flight.airlineBg }}>
                            {flight.airlineLogo}
                          </div>
                          <div>
                            <p className="font-bold text-sm text-white leading-none">{flight.airline}</p>
                            <p className="text-[10px] text-white/40 font-mono mt-0.5">{flight.flightNumber}</p>
                          </div>
                        </div>
                        <span className={`px-2.5 py-1 rounded-xl text-[10px] font-black flex items-center gap-1 ${statusColor(flight.status)}`}>
                          {statusIcon(flight.status)} {flight.status}
                        </span>
                      </div>

                      <div className="flex items-center justify-between mb-4">
                        <div className="text-center">
                          <p className="text-3xl font-black">{flight.departureTime}</p>
                          <p className="text-xs text-white/40 bg-white/10 rounded px-1.5 mt-1">{flight.origin}</p>
                        </div>
                        <div className="flex-1 px-3 flex flex-col items-center gap-1">
                          <p className="text-[10px] text-white/40 flex items-center gap-1"><Clock className="w-3 h-3" />{flight.duration}</p>
                          <div className="w-full flex items-center">
                            <div className="h-px flex-1 bg-white/20" />
                            <PlaneTakeoff className="w-4 h-4 text-sky-400 mx-1" />
                            <div className="h-px flex-1 bg-white/20" />
                          </div>
                          <p className={`text-[9px] font-black ${flight.stops === 0 ? 'text-emerald-400' : 'text-amber-400'}`}>
                            {flight.stops === 0 ? '✓ Direto' : `${flight.stops} escala`}
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-3xl font-black">{flight.arrivalTime}</p>
                          <p className="text-xs text-white/40 bg-white/10 rounded px-1.5 mt-1">{flight.destination}</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-white/5">
                        <div>
                          <p className="text-[10px] text-white/40">por pessoa (demo)</p>
                          <p className="text-2xl font-black text-sky-400">€{flight.pricePerPax}</p>
                          {passengers > 1 && <p className="text-xs text-white/40">{passengers} pax = €{flight.price}</p>}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm">{flight.amenities.includes('bagagem') ? '🧳' : ''}{flight.amenities.includes('wifi') ? '📶' : ''}</span>
                          {flight.status !== 'Cancelado' && (
                            <button className="px-5 py-2.5 bg-gradient-to-r from-sky-500 to-blue-600 rounded-xl text-xs font-black text-white flex items-center gap-1 shadow-lg shadow-sky-500/30">
                              Ver <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      )}

      {/* ── TAB BOARD ──────────────────────────────────────────────────────── */}
      {activeTab === 'board' && (
        <div className="px-4 pb-32 space-y-4">

          <div className="bg-white/5 border border-white/10 rounded-3xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <Globe className="w-4 h-4 text-sky-400" />
              <h2 className="font-black text-sm">Aeroporto João Paulo II (PDL) — São Miguel</h2>
            </div>
            <div className="flex gap-2 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
              {AZORES_AIRPORTS.map(a => (
                <div key={a.code} className="flex-shrink-0 flex flex-col items-center gap-1 px-3 py-2 bg-white/5 border border-white/10 rounded-xl">
                  <span className="text-base">{a.emoji}</span>
                  <span className="text-[10px] font-bold text-white/60">{a.code}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <p className="text-xs font-bold text-white/60">Painel de voos · {new Date().toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' })}</p>
            </div>
            <p className="text-[10px] text-amber-400 font-bold">DEMO</p>
          </div>

          <div className="flex gap-2">
            {(['todos', 'partidas', 'chegadas'] as const).map(f => (
              <button key={f} onClick={() => setBoardFilter(f)}
                className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all ${boardFilter === f ? 'bg-sky-500 text-white' : 'bg-white/10 text-white/50'}`}>
                {f === 'todos' ? '✈️ Todos' : f === 'partidas' ? '↗ Partidas' : '↙ Chegadas'}
              </button>
            ))}
          </div>

          <div className="flex gap-2 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
            {['todos', 'A Horas', 'Atrasado', 'Embarque', 'Cancelado'].map(s => (
              <button key={s} onClick={() => setBoardStatusFilter(s)}
                className={`px-3 py-1.5 rounded-xl text-[10px] font-black whitespace-nowrap ${boardStatusFilter === s ? 'bg-white/20 text-white' : 'bg-white/5 text-white/40'}`}>
                {s === 'todos' ? 'Todos' : s}
              </button>
            ))}
          </div>

          <div className="space-y-2">
            {filteredBoard.map((f, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-3">
                <div className={`w-1 self-stretch rounded-full ${f.type === 'partida' ? 'bg-sky-500' : 'bg-emerald-500'}`} />
                <div className="w-10 h-10 bg-white/10 rounded-xl flex flex-col items-center justify-center">
                  {f.type === 'partida' ? <PlaneTakeoff className="w-4 h-4 text-sky-400" /> : <PlaneLanding className="w-4 h-4 text-emerald-400" />}
                  <span className="text-[8px] font-black text-white/40 mt-0.5">{f.type === 'partida' ? 'PART' : 'CHEG'}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-black text-sm text-white">{f.flight}</p>
                    <p className="text-xs text-white/40 truncate">{f.airline}</p>
                  </div>
                  <p className="text-xs text-white/60 font-medium">{f.origin} → {f.destination}</p>
                  <div className="flex items-center gap-2 mt-1 text-[10px] text-white/40">
                    <span>Terminal {f.terminal}</span><span>·</span><span>Porta {f.gate}</span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-black text-base">{f.dep}</p>
                  <p className="text-[10px] text-white/40">→ {f.arr}</p>
                  <span className={`mt-1 px-2 py-0.5 rounded-lg text-[9px] font-black flex items-center gap-1 ${statusColor(f.status)}`}>
                    {statusIcon(f.status)} {f.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── TAB INTER-ILHAS ─────────────────────────────────────────────────── */}
      {activeTab === 'interilhas' && (
        <div className="px-4 pb-32 space-y-4">

          <div className="bg-white/5 border border-white/10 rounded-3xl p-5">
            <h2 className="font-black text-base mb-1 flex items-center gap-2">
              <ArrowLeftRight className="w-4 h-4 text-sky-400" /> Voos Inter-Ilhas dos Açores
            </h2>
            <p className="text-xs text-white/40 mb-3">Ligações aéreas entre as 9 ilhas do arquipélago</p>
            <p className="text-[10px] text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-xl px-3 py-2 font-bold">
              ✈️ Operados pela SATA Air Açores · Dados de demonstração
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-3xl p-4">
            <p className="text-xs font-black text-white/40 uppercase tracking-wider mb-3">Selecionar Ilha de Origem</p>
            <div className="grid grid-cols-3 gap-2">
              {AZORES_AIRPORTS.map(island => (
                <button
                  key={island.code}
                  onClick={() => {
                    const to = AZORES_AIRPORTS.find(a => a.code !== island.code)?.code || 'TER';
                    handleInterIsland(island.code, to);
                  }}
                  className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl border transition-all ${
                    selectedInterIsland?.from === island.code
                      ? 'border-sky-500 bg-sky-500/20'
                      : 'border-white/10 bg-white/5 hover:border-white/30'
                  }`}
                >
                  <span className="text-2xl">{island.emoji}</span>
                  <p className="font-black text-[11px] text-white text-center leading-tight">{island.island}</p>
                  <p className="text-[9px] text-white/40 font-mono">{island.code}</p>
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-black text-white/40 uppercase tracking-wider mb-2">Rotas Populares</p>
            <div className="space-y-2">
              {[
                { from: 'PDL', to: 'TER', price: 48, freq: 'Diário' },
                { from: 'PDL', to: 'FAI', price: 52, freq: 'Diário' },
                { from: 'TER', to: 'FAI', price: 44, freq: '3×/semana' },
                { from: 'PDL', to: 'PIX', price: 55, freq: 'Diário' },
                { from: 'FAI', to: 'PIX', price: 38, freq: 'Diário' },
                { from: 'PDL', to: 'SMA', price: 58, freq: '2×/semana' },
              ].map((route, i) => {
                const fromA = AZORES_AIRPORTS.find(a => a.code === route.from);
                const toA = AZORES_AIRPORTS.find(a => a.code === route.to);
                return (
                  <button key={i} onClick={() => handleInterIsland(route.from, route.to)}
                    className="w-full flex items-center gap-3 bg-white/5 border border-white/10 hover:border-sky-500/40 rounded-2xl p-4 transition-all text-left">
                    <div className="flex items-center gap-2 flex-1">
                      <span className="text-xl">{fromA?.emoji}</span>
                      <div>
                        <p className="font-bold text-sm text-white">{fromA?.island} → {toA?.island}</p>
                        <p className="text-[10px] text-white/40">{route.from} → {route.to} · {route.freq}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-white/40">a partir de</p>
                      <p className="font-black text-sky-400 text-lg">€{route.price}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-white/30" />
                  </button>
                );
              })}
            </div>
          </div>

          {interIslandResults.length > 0 && selectedInterIsland && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <PlaneTakeoff className="w-4 h-4 text-sky-400" />
                <p className="font-black text-base">
                  {AZORES_AIRPORTS.find(a => a.code === selectedInterIsland.from)?.island} → {AZORES_AIRPORTS.find(a => a.code === selectedInterIsland.to)?.island}
                </p>
              </div>
              {interIslandResults.map(flight => (
                <div key={flight.id} onClick={() => setSelectedFlight(flight)}
                  className="bg-white/5 border border-white/10 hover:border-sky-500/40 rounded-2xl p-4 cursor-pointer transition-all">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-blue-500/20 flex items-center justify-center text-sm">{flight.airlineLogo}</div>
                      <div>
                        <p className="font-bold text-sm">{flight.airline}</p>
                        <p className="text-[10px] text-white/40 font-mono">{flight.flightNumber}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-lg text-[10px] font-black flex items-center gap-1 ${statusColor(flight.status)}`}>
                      {statusIcon(flight.status)} {flight.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-center">
                      <p className="text-2xl font-black">{flight.departureTime}</p>
                      <p className="text-xs text-white/40">{flight.origin}</p>
                    </div>
                    <div className="flex-1 px-3 flex flex-col items-center">
                      <p className="text-[10px] text-white/40"><Clock className="w-3 h-3 inline" /> {flight.duration}</p>
                      <div className="w-full flex items-center gap-1 my-1">
                        <div className="h-px flex-1 bg-white/20" /><PlaneTakeoff className="w-3.5 h-3.5 text-sky-400" /><div className="h-px flex-1 bg-white/20" />
                      </div>
                      <p className="text-[9px] text-emerald-400 font-bold">Direto</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-black">{flight.arrivalTime}</p>
                      <p className="text-xs text-white/40">{flight.destination}</p>
                    </div>
                    <div className="text-right ml-4">
                      <p className="text-[10px] text-white/40">demo</p>
                      <p className="text-xl font-black text-sky-400">€{flight.pricePerPax}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── TAB COMPANHIAS ──────────────────────────────────────────────────── */}
      {activeTab === 'companhias' && (
        <div className="px-4 pb-32 space-y-4">

          <div className="bg-gradient-to-r from-sky-500/10 to-blue-600/10 border border-sky-500/20 rounded-3xl p-5">
            <h2 className="font-black text-base mb-1">Companhias Aéreas</h2>
            <p className="text-xs text-white/40">Operadores com ligações para os Açores</p>
          </div>

          {/* Azores Airlines */}
          <div className="bg-gradient-to-br from-blue-900 to-blue-800 border border-blue-700/50 rounded-3xl p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center text-3xl">🌊</div>
              <div>
                <p className="font-black text-lg">Azores Airlines</p>
                <p className="text-xs text-blue-200">SATA Internacional · Código: TP</p>
              </div>
            </div>
            <p className="text-sm text-blue-100/80 leading-relaxed mb-4">
              Companhia oficial dos Açores. Liga o arquipélago a Lisboa, Porto, Boston, Toronto, Oakland, Providence, Nova Iorque e ao resto do mundo.
            </p>
            <div className="grid grid-cols-3 gap-2">
              {[{ label: 'Destinos', value: '18+' }, { label: 'Rotas Ativas', value: '25' }, { label: 'Frota', value: 'A321' }].map((s, i) => (
                <div key={i} className="bg-white/10 rounded-2xl p-3 text-center">
                  <p className="font-black text-xl text-white">{s.value}</p>
                  <p className="text-[10px] text-blue-200">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* SATA Air Açores */}
          <div className="bg-gradient-to-br from-sky-900 to-sky-800 border border-sky-700/50 rounded-3xl p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center text-3xl">✈️</div>
              <div>
                <p className="font-black text-lg">SATA Air Açores</p>
                <p className="text-xs text-sky-200">Voos Inter-Ilhas · Código: S4</p>
              </div>
            </div>
            <p className="text-sm text-sky-100/80 leading-relaxed mb-4">
              Especialista em voos regionais entre as 9 ilhas. Opera com ATR 72-600 adaptados ao clima e orografia açoriana. Essencial para a mobilidade do arquipélago.
            </p>
            <div className="grid grid-cols-3 gap-2">
              {[{ label: 'Rotas', value: '15' }, { label: 'Ilhas', value: '9/9' }, { label: 'Frota', value: 'ATR72' }].map((s, i) => (
                <div key={i} className="bg-white/10 rounded-2xl p-3 text-center">
                  <p className="font-black text-xl text-white">{s.value}</p>
                  <p className="text-[10px] text-sky-200">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Other airlines */}
          <div>
            <p className="text-xs font-black text-white/40 uppercase tracking-wider mb-3">Outras Companhias com Voos para os Açores</p>
            <div className="space-y-2">
              {AIRLINES.slice(2).map(airline => (
                <div key={airline.code} className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl p-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg" style={{ background: airline.bg }}>
                    {airline.logo}
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-sm text-white">{airline.name}</p>
                    <p className="text-[10px] text-white/40">Código IATA: {airline.code}</p>
                  </div>
                  <div className="text-[10px] text-white/30 text-right">
                    <p className="font-bold text-white/50">Internacional</p>
                    <p>Ligações sazonais</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contacts */}
          <div className="bg-white/5 border border-white/10 rounded-3xl p-5 space-y-3">
            <h3 className="font-black text-sm">Contactos Úteis</h3>
            {[
              { label: 'SATA / Azores Airlines', phone: '+351 296 209 720', emoji: '📞' },
              { label: 'Aeroporto João Paulo II (PDL)', phone: '+351 296 205 400', emoji: '🏢' },
              { label: 'ANA Aeroportos dos Açores', phone: '+351 218 413 500', emoji: '✈️' },
            ].map((c, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-xl">{c.emoji}</span>
                <div className="flex-1">
                  <p className="text-xs font-bold text-white">{c.label}</p>
                  <p className="text-xs text-sky-400">{c.phone}</p>
                </div>
                <Phone className="w-4 h-4 text-white/20" />
              </div>
            ))}
          </div>

          {/* Demo footer */}
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 flex gap-3">
            <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-200/80 leading-relaxed">
              Módulo em demonstração institucional. Contactos e dados das companhias são de referência pública. Fase de apresentação à SATA, Azores Airlines e Governo Regional dos Açores.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default FlightSearchSection;
