import React, { useEffect, useMemo, useRef, useState } from 'react';
import { MapContainer, TileLayer, Polyline, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Bus, Map as MapIcon, MapPin, Route, Search, ArrowLeft, Navigation, Radio } from 'lucide-react';
import { BusSchedule, BusLine, BusStop } from '../types';
import { busLines } from '../data/bus_lines';
import { realBusStops } from '../data/bus_stops';
import { crpBuses } from '../data/crp_buses';
import { varelaBuses } from '../data/varela_buses';
import { avmBuses } from '../data/avm_buses';
import { API_BASE_URL } from '../config';

type BusTab = 'linhas' | 'paragens' | 'mapa';
type Direction = 'outbound' | 'inbound';

interface BusesSectionProps {
  busSchedules?: BusSchedule[];
}

interface LiveTrackingEntry {
  sessionId: string;
  lineId: string;
  direction: Direction;
  lat: number;
  lng: number;
  progress: number | null;
  updatedAt: number;
}

const ISLAND_CENTER: [number, number] = [37.79, -25.55];
const PING_INTERVAL_MS = 8000;
const POLL_INTERVAL_MS = 7000;

const stopDivIcon = (color = '#64748b', big = false) => L.divIcon({
  html: `<div style="background:${color};width:${big ? 16 : 10}px;height:${big ? 16 : 10}px" class="rounded-full border-2 border-white shadow"></div>`,
  className: '',
  iconSize: [big ? 16 : 10, big ? 16 : 10],
  iconAnchor: [big ? 8 : 5, big ? 8 : 5],
});

const liveBusDivIcon = (color: string) => L.divIcon({
  html: `<div class="relative flex items-center justify-center w-7 h-7">
    <div class="absolute inset-0 rounded-full opacity-40 animate-ping" style="background:${color}"></div>
    <div class="relative w-6 h-6 rounded-full border-2 border-white shadow-lg flex items-center justify-center" style="background:${color}">
      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M8 6v6"/><path d="M15 6v6"/><path d="M2 12h19.6"/><path d="M18 18h3s.5-1.7.8-2.8c.1-.4.2-.8.2-1.2 0-.4-.1-.8-.2-1.2l-1.4-5C20.1 6.8 19.1 6 18 6H4a2 2 0 0 0-2 2v10h3"/><circle cx="7" cy="18" r="2"/><path d="M9 18h5"/><circle cx="16" cy="18" r="2"/></svg>
    </div>
  </div>`,
  className: '',
  iconSize: [28, 28],
  iconAnchor: [14, 14],
});

const haversineMeters = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371000;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

// Projects a GPS fix onto the line's path and returns progress (0..1) from origin to destination.
const projectProgressOnPath = (lat: number, lng: number, path: [number, number][]): number => {
  if (!path || path.length < 2) return 0;
  let cumulative = 0;
  const segmentCumulative: number[] = [0];
  for (let i = 1; i < path.length; i++) {
    cumulative += haversineMeters(path[i - 1][0], path[i - 1][1], path[i][0], path[i][1]);
    segmentCumulative.push(cumulative);
  }
  const totalLength = cumulative || 1;

  let bestDist = Infinity;
  let bestLengthAlong = 0;
  for (let i = 0; i < path.length - 1; i++) {
    const [alat, alng] = path[i];
    const [blat, blng] = path[i + 1];
    const segLen = haversineMeters(alat, alng, blat, blng) || 1;
    const t = Math.max(0, Math.min(1,
      ((lat - alat) * (blat - alat) + (lng - alng) * (blng - alng)) / (((blat - alat) ** 2 + (blng - alng) ** 2) || 1)
    ));
    const projLat = alat + t * (blat - alat);
    const projLng = alng + t * (blng - alng);
    const dist = haversineMeters(lat, lng, projLat, projLng);
    if (dist < bestDist) {
      bestDist = dist;
      bestLengthAlong = segmentCumulative[i] + t * segLen;
    }
  }
  return bestLengthAlong / totalLength;
};

const getOrCreateSessionId = () => {
  const key = 'a4y_bus_tracking_session';
  let id = localStorage.getItem(key);
  if (!id) {
    id = (crypto.randomUUID ? crypto.randomUUID() : `s_${Date.now()}_${Math.random().toString(36).slice(2)}`);
    localStorage.setItem(key, id);
  }
  return id;
};

const getNextDeparture = (times: string[]): string | null => {
  if (!times || times.length === 0) return null;
  const now = new Date();
  const currentTimeString = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  const clean = times.map(t => ({ original: t, clean: t.replace(/\([^)]*\)/g, '').trim() }));
  const upcoming = clean.filter(t => t.clean >= currentTimeString);
  return upcoming.length > 0 ? upcoming[0].original : null;
};

const HoursBlock: React.FC<{ label: string; hours?: string[] }> = ({ label, hours }) => {
  const nextOut = hours ? getNextDeparture(hours) : null;
  return (
    <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1.5">{label}</span>
      {!hours || hours.length === 0 ? (
        <span className="text-[10px] font-bold text-slate-400 italic">Sem horários disponíveis</span>
      ) : (
        <div className="flex flex-wrap gap-1.5">
          {hours.map((h, idx) => {
            const isNext = h === nextOut;
            return (
              <span
                key={idx}
                className={`px-2 py-1 rounded-lg text-[10px] font-black tracking-wide border ${isNext ? 'bg-emerald-600 text-white border-emerald-500 shadow-md shadow-emerald-500/10 scale-105' : 'bg-slate-50 text-slate-700 border-slate-200/60'}`}
              >
                {h}
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
};

const BusesSection: React.FC<BusesSectionProps> = ({ busSchedules }) => {
  const [tab, setTab] = useState<BusTab>('linhas');
  const [lineSearch, setLineSearch] = useState('');
  const [stopSearch, setStopSearch] = useState('');
  const [selectedLineId, setSelectedLineId] = useState<string | null>(null);
  const [selectedStopId, setSelectedStopId] = useState<string | null>(null);

  const [isSharing, setIsSharing] = useState(false);
  const [shareDirection, setShareDirection] = useState<Direction>('outbound');
  const [locationError, setLocationError] = useState<string | null>(null);
  const [liveOnLine, setLiveOnLine] = useState<LiveTrackingEntry[]>([]);
  const [liveAll, setLiveAll] = useState<LiveTrackingEntry[]>([]);
  const watchIdRef = useRef<number | null>(null);
  const lastPingAtRef = useRef<number>(0);
  const sessionIdRef = useRef<string>(getOrCreateSessionId());

  const sendPing = (lineId: string, direction: Direction, lat: number, lng: number, progress: number) => {
    fetch(`${API_BASE_URL}/api/bus-tracking/ping`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId: sessionIdRef.current, lineId, direction, lat, lng, progress }),
    }).catch(() => {});
  };

  const stopSharing = (lineId?: string | null) => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    setIsSharing(false);
    if (lineId) {
      fetch(`${API_BASE_URL}/api/bus-tracking/ping/${sessionIdRef.current}`, { method: 'DELETE' }).catch(() => {});
    }
  };

  const startSharing = (line: BusLine, direction: Direction) => {
    if (!navigator.geolocation) {
      setLocationError('A geolocalização não é suportada por este navegador.');
      return;
    }
    setLocationError(null);
    setIsSharing(true);
    const id = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const progress = projectProgressOnPath(latitude, longitude, line.path);
        const now = Date.now();
        if (now - lastPingAtRef.current >= PING_INTERVAL_MS) {
          lastPingAtRef.current = now;
          sendPing(line.id, direction, latitude, longitude, progress);
        }
      },
      () => setLocationError('Não foi possível obter a sua localização. Verifique as permissões.'),
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
    watchIdRef.current = id;
  };

  // Stop sharing automatically when navigating away from the shared line.
  useEffect(() => {
    return () => { if (watchIdRef.current !== null) navigator.geolocation.clearWatch(watchIdRef.current); };
  }, []);
  useEffect(() => {
    if (isSharing) stopSharing(selectedLineId);
  }, [selectedLineId]);

  // Poll other riders' live positions for the line currently being viewed.
  useEffect(() => {
    if (!selectedLineId) { setLiveOnLine([]); return; }
    let cancelled = false;
    const poll = () => {
      fetch(`${API_BASE_URL}/api/bus-tracking/active?lineId=${encodeURIComponent(selectedLineId)}`)
        .then(r => r.json())
        .then(data => { if (!cancelled) setLiveOnLine(data.entries || []); })
        .catch(() => {});
    };
    poll();
    const interval = setInterval(poll, POLL_INTERVAL_MS);
    return () => { cancelled = true; clearInterval(interval); };
  }, [selectedLineId]);

  // Poll all active riders across every line for the full island map.
  useEffect(() => {
    if (tab !== 'mapa') { return; }
    let cancelled = false;
    const poll = () => {
      fetch(`${API_BASE_URL}/api/bus-tracking/active`)
        .then(r => r.json())
        .then(data => { if (!cancelled) setLiveAll(data.entries || []); })
        .catch(() => {});
    };
    poll();
    const interval = setInterval(poll, POLL_INTERVAL_MS);
    return () => { cancelled = true; clearInterval(interval); };
  }, [tab]);

  const activeSchedules = useMemo(
    () => (busSchedules && busSchedules.length > 0) ? busSchedules : [...crpBuses, ...varelaBuses, ...avmBuses],
    [busSchedules]
  );

  const stopsById = useMemo(() => {
    const m = new Map<string, BusStop>();
    realBusStops.forEach(s => m.set(s.id, s));
    return m;
  }, []);

  const linesByStopId = useMemo(() => {
    const m = new Map<string, BusLine[]>();
    busLines.forEach(line => {
      line.stopIds.forEach(sid => {
        if (!m.has(sid)) m.set(sid, []);
        m.get(sid)!.push(line);
      });
    });
    return m;
  }, []);

  const getLineSchedule = (line: BusLine) => {
    const entries = activeSchedules.filter(s => line.scheduleIds.includes(s.id));
    const outbound = entries.find(s => s.origin === line.origin);
    const inbound = entries.find(s => s.origin === line.destination);
    return { outbound, inbound };
  };

  const filteredLines = busLines.filter(l =>
    l.name.toLowerCase().includes(lineSearch.toLowerCase())
  );

  const filteredStops = realBusStops
    .filter(s => s.name.toLowerCase().includes(stopSearch.toLowerCase()))
    .sort((a, b) => a.name.localeCompare(b.name))
    .slice(0, 150);

  const selectedLine = selectedLineId ? busLines.find(l => l.id === selectedLineId) || null : null;
  const selectedStop = selectedStopId ? stopsById.get(selectedStopId) || null : null;

  const openLineFromStop = (lineId: string) => {
    setSelectedLineId(lineId);
    setSelectedStopId(null);
    setTab('linhas');
  };

  const tabs: { id: BusTab; label: string; icon: React.ReactNode }[] = [
    { id: 'linhas', label: 'Linhas', icon: <Route size={15} /> },
    { id: 'paragens', label: 'Paragens', icon: <MapPin size={15} /> },
    { id: 'mapa', label: 'Mapa', icon: <MapIcon size={15} /> },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header + Tabs */}
      <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col gap-5">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center border bg-pink-50 text-pink-600 border-pink-200">
            <Bus size={22} />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-800 tracking-tight leading-none">Autocarros — São Miguel</h3>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
              Nova Operadora São Miguel <span className="normal-case font-semibold text-slate-300">(nome provisório)</span>
            </p>
          </div>
        </div>
        <div className="flex gap-2 bg-slate-50 p-1.5 rounded-2xl border border-slate-100 w-full md:w-fit">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => { setTab(t.id); }}
              className={`flex-1 md:flex-none flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${tab === t.id ? 'bg-pink-600 text-white shadow-md shadow-pink-600/20' : 'text-slate-500 hover:bg-white'}`}
            >
              {t.icon}{t.label}
            </button>
          ))}
        </div>
      </div>

      {/* LINHAS TAB */}
      {tab === 'linhas' && (
        selectedLine ? (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom duration-300">
            <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex items-center gap-4">
              <button onClick={() => setSelectedLineId(null)} className="p-3 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-2xl border border-slate-200/50 transition-all active:scale-95 cursor-pointer">
                <ArrowLeft size={16} />
              </button>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: selectedLine.color + '20', color: selectedLine.color }}>
                <Route size={18} />
              </div>
              <div className="min-w-0">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Linha</p>
                <p className="text-base font-black text-slate-800 tracking-tight">{selectedLine.name}</p>
              </div>
            </div>

            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-6 space-y-4">
              <div className="flex items-center gap-2">
                <Radio size={14} className={liveOnLine.length > 0 ? 'text-emerald-600' : 'text-slate-400'} />
                <span className="text-[11px] font-black uppercase tracking-wider text-slate-600">
                  {liveOnLine.length > 0
                    ? `${liveOnLine.length} pessoa(s) a partilhar localização agora nesta linha`
                    : 'Ninguém a partilhar localização nesta linha neste momento'}
                </span>
              </div>

              {!isSharing ? (
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <div className="flex gap-2 bg-slate-50 p-1 rounded-xl border border-slate-100">
                    <button
                      onClick={() => setShareDirection('outbound')}
                      className={`px-3 py-2 rounded-lg text-[10px] font-black uppercase tracking-wider cursor-pointer transition-all ${shareDirection === 'outbound' ? 'bg-indigo-600 text-white' : 'text-slate-500'}`}
                    >
                      Ida ({selectedLine.origin})
                    </button>
                    <button
                      onClick={() => setShareDirection('inbound')}
                      className={`px-3 py-2 rounded-lg text-[10px] font-black uppercase tracking-wider cursor-pointer transition-all ${shareDirection === 'inbound' ? 'bg-rose-600 text-white' : 'text-slate-500'}`}
                    >
                      Volta ({selectedLine.destination})
                    </button>
                  </div>
                  <button
                    onClick={() => startSharing(selectedLine, shareDirection)}
                    className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider bg-emerald-600 text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-700 transition-all cursor-pointer"
                  >
                    <Navigation size={14} /> Estou neste autocarro
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between gap-3 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3">
                  <span className="text-[11px] font-black text-emerald-700 uppercase tracking-wider flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    A partilhar localização — {shareDirection === 'outbound' ? 'Ida' : 'Volta'}
                  </span>
                  <button
                    onClick={() => stopSharing(selectedLine.id)}
                    className="px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-wider bg-white border border-emerald-300 text-emerald-700 hover:bg-emerald-100 transition-all cursor-pointer"
                  >
                    Parar
                  </button>
                </div>
              )}
              {locationError && (
                <p className="text-[10px] font-bold text-rose-500">{locationError}</p>
              )}
            </div>

            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden h-72">
              <MapContainer bounds={selectedLine.path as L.LatLngBoundsExpression} style={{ width: '100%', height: '100%' }} scrollWheelZoom={false}>
                <TileLayer attribution='&copy; OpenStreetMap contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Polyline positions={selectedLine.path as L.LatLngExpression[]} pathOptions={{ color: selectedLine.color, weight: 5, opacity: 0.8 }} />
                {selectedLine.stopIds.map(sid => {
                  const s = stopsById.get(sid);
                  if (!s || s.lat === undefined || s.lng === undefined) return null;
                  return (
                    <Marker key={sid} position={[s.lat, s.lng]} icon={stopDivIcon(selectedLine.color)}>
                      <Popup>{s.name}</Popup>
                    </Marker>
                  );
                })}
                {liveOnLine.map(entry => (
                  <Marker key={entry.sessionId} position={[entry.lat, entry.lng]} icon={liveBusDivIcon(selectedLine.color)}>
                    <Popup>Autocarro em andamento — {entry.direction === 'outbound' ? 'Ida' : 'Volta'}</Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>

            {(() => {
              const { outbound, inbound } = getLineSchedule(selectedLine);
              return (
                <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-6 space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 border-b border-slate-100 pb-1.5">
                      <span className="px-2 py-0.5 bg-indigo-50 border border-indigo-200 text-indigo-700 rounded text-[9px] font-black uppercase tracking-wider">Ida</span>
                      <span className="text-[11px] font-black text-slate-700 uppercase tracking-wider">{selectedLine.origin} ➔ {selectedLine.destination}</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <HoursBlock label="Dias Úteis" hours={outbound?.schedule?.weekdays || outbound?.times} />
                      <HoursBlock label="Sábados" hours={outbound?.schedule?.saturdays} />
                      <HoursBlock label="Domingos / Feriados" hours={outbound?.schedule?.sundays} />
                    </div>
                  </div>
                  <div className="space-y-4 pt-2">
                    <div className="flex items-center gap-2 border-b border-slate-100 pb-1.5">
                      <span className="px-2 py-0.5 bg-rose-50 border border-rose-200 text-rose-700 rounded text-[9px] font-black uppercase tracking-wider">Volta</span>
                      <span className="text-[11px] font-black text-slate-700 uppercase tracking-wider">{selectedLine.destination} ➔ {selectedLine.origin}</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <HoursBlock label="Dias Úteis" hours={inbound?.schedule?.weekdays || inbound?.times} />
                      <HoursBlock label="Sábados" hours={inbound?.schedule?.saturdays} />
                      <HoursBlock label="Domingos / Feriados" hours={inbound?.schedule?.sundays} />
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="relative w-full md:max-w-sm group">
              <Search className="absolute left-4 top-3.5 text-slate-400 w-4 h-4 group-focus-within:text-pink-500 transition-colors" />
              <input
                type="text"
                placeholder="Pesquisar linha (origem ou destino)..."
                value={lineSearch}
                onChange={(e) => setLineSearch(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-white border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-pink-500/10 focus:border-pink-500 transition-all font-semibold text-xs text-slate-700 shadow-sm"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredLines.map(line => (
                <button
                  key={line.id}
                  onClick={() => setSelectedLineId(line.id)}
                  className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all text-left flex items-center gap-4 cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: line.color + '20', color: line.color }}>
                    <Route size={18} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-black text-slate-800 tracking-tight truncate">{line.name}</p>
                    <p className="text-[10px] font-bold text-slate-400 mt-0.5">{line.stopIds.length} paragens no percurso</p>
                  </div>
                </button>
              ))}
              {filteredLines.length === 0 && (
                <div className="bg-white p-12 rounded-[2rem] border border-slate-100 text-center md:col-span-2">
                  <p className="text-slate-400 font-bold text-sm">Nenhuma linha encontrada.</p>
                </div>
              )}
            </div>
          </div>
        )
      )}

      {/* PARAGENS TAB */}
      {tab === 'paragens' && (
        selectedStop ? (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom duration-300">
            <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex items-center gap-4">
              <button onClick={() => setSelectedStopId(null)} className="p-3 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-2xl border border-slate-200/50 transition-all active:scale-95 cursor-pointer">
                <ArrowLeft size={16} />
              </button>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-pink-50 text-pink-600">
                <MapPin size={18} />
              </div>
              <div className="min-w-0">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Paragem</p>
                <p className="text-base font-black text-slate-800 tracking-tight truncate">{selectedStop.name}</p>
              </div>
            </div>

            {selectedStop.lat !== undefined && selectedStop.lng !== undefined && (
              <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden h-64">
                <MapContainer center={[selectedStop.lat, selectedStop.lng]} zoom={16} style={{ width: '100%', height: '100%' }} scrollWheelZoom={false}>
                  <TileLayer attribution='&copy; OpenStreetMap contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <Marker position={[selectedStop.lat, selectedStop.lng]} icon={stopDivIcon('#db2777', true)}>
                    <Popup>{selectedStop.name}</Popup>
                  </Marker>
                </MapContainer>
              </div>
            )}

            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-6">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-3">Linhas que passam aqui</span>
              <div className="flex flex-wrap gap-2">
                {(linesByStopId.get(selectedStop.id) || []).map(line => (
                  <button
                    key={line.id}
                    onClick={() => openLineFromStop(line.id)}
                    className="px-3 py-2 rounded-xl text-[11px] font-black border flex items-center gap-1.5 hover:scale-105 transition-all cursor-pointer"
                    style={{ backgroundColor: line.color + '10', borderColor: line.color + '40', color: line.color }}
                  >
                    <Route size={12} /> {line.name}
                  </button>
                ))}
                {(!linesByStopId.get(selectedStop.id) || linesByStopId.get(selectedStop.id)!.length === 0) && (
                  <span className="text-[10px] font-bold text-slate-400 italic">Nenhuma linha associada a esta paragem.</span>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="relative w-full md:max-w-sm group">
              <Search className="absolute left-4 top-3.5 text-slate-400 w-4 h-4 group-focus-within:text-pink-500 transition-colors" />
              <input
                type="text"
                placeholder="Pesquisar paragem por nome..."
                value={stopSearch}
                onChange={(e) => setStopSearch(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-white border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-pink-500/10 focus:border-pink-500 transition-all font-semibold text-xs text-slate-700 shadow-sm"
              />
            </div>
            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm divide-y divide-slate-100 max-h-[32rem] overflow-y-auto">
              {filteredStops.map(stop => (
                <button
                  key={stop.id}
                  onClick={() => setSelectedStopId(stop.id)}
                  className="w-full px-6 py-4 flex items-center gap-4 hover:bg-slate-50/60 transition-colors text-left cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-200/50 shrink-0">
                    <MapPin size={14} />
                  </div>
                  <span className="text-xs font-bold text-slate-700 truncate flex-1">{stop.name}</span>
                  <span className="text-[9px] font-black text-slate-300 uppercase">{(linesByStopId.get(stop.id) || []).length} linha(s)</span>
                </button>
              ))}
              {filteredStops.length === 0 && (
                <div className="p-12 text-center">
                  <p className="text-slate-400 font-bold text-sm">Nenhuma paragem encontrada.</p>
                </div>
              )}
            </div>
          </div>
        )
      )}

      {/* MAPA TAB */}
      {tab === 'mapa' && (
        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden h-[36rem] relative">
          <MapContainer center={ISLAND_CENTER} zoom={11} style={{ width: '100%', height: '100%' }}>
            <TileLayer attribution='&copy; OpenStreetMap contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {busLines.map(line => (
              <Polyline
                key={line.id}
                positions={line.path as L.LatLngExpression[]}
                pathOptions={{ color: line.color, weight: 4, opacity: 0.7 }}
                eventHandlers={{ click: () => { setSelectedLineId(line.id); setTab('linhas'); } }}
              >
                <Popup>{line.name}</Popup>
              </Polyline>
            ))}
            {realBusStops.map(stop => (
              stop.lat !== undefined && stop.lng !== undefined && (
                <Marker key={stop.id} position={[stop.lat, stop.lng]} icon={stopDivIcon('#64748b')}>
                  <Popup>
                    <div className="text-xs font-bold">{stop.name}</div>
                    <div className="text-[10px] text-slate-500 mt-1">
                      {(linesByStopId.get(stop.id) || []).map(l => l.name).join(', ') || 'Sem linhas associadas'}
                    </div>
                  </Popup>
                </Marker>
              )
            ))}
            {liveAll.map(entry => {
              const line = busLines.find(l => l.id === entry.lineId);
              return (
                <Marker key={entry.sessionId} position={[entry.lat, entry.lng]} icon={liveBusDivIcon(line?.color || '#16a34a')}>
                  <Popup>
                    {line?.name || 'Autocarro'} — {entry.direction === 'outbound' ? 'Ida' : 'Volta'}
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>
        </div>
      )}
    </div>
  );
};

export default BusesSection;