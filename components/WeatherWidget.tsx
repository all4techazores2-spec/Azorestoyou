import React, { useState, useEffect, useRef } from 'react';
import { Cloud, Sun, CloudRain, CloudLightning, CloudDrizzle, Compass, Clock, Calendar, ChevronDown, MapPin, Wind, Droplets } from 'lucide-react';

interface WeatherWidgetProps {
  onLocationChange?: (lat: number, lon: number, name: string) => void;
}

interface WeatherData {
  temp: number;
  conditionCode: number;
  windSpeed: number;
  humidity: number;
  locationName: string;
  timestamp: number;
}

const CITIES = [
  // Açores
  { name: 'Ponta Delgada (S. Miguel)', lat: 37.7412, lon: -25.6756, island: true },
  { name: 'Ribeira Grande (S. Miguel)', lat: 37.8218, lon: -25.5145, island: true },
  { name: 'Lagoa (S. Miguel)', lat: 37.7445, lon: -25.5705, island: true },
  { name: 'Furnas (S. Miguel)', lat: 37.7933, lon: -25.3219, island: true },
  { name: 'Vila Franca do Campo (S. Miguel)', lat: 37.7158, lon: -25.4330, island: true },
  { name: 'Nordeste (S. Miguel)', lat: 37.8333, lon: -25.1500, island: true },
  { name: 'Povoação (S. Miguel)', lat: 37.7467, lon: -25.2467, island: true },
  { name: 'Angra do Heroísmo (Terceira)', lat: 38.6597, lon: -27.2219, island: true },
  { name: 'Praia da Vitória (Terceira)', lat: 38.7287, lon: -27.0668, island: true },
  { name: 'Horta (Faial)', lat: 38.5370, lon: -28.6267, island: true },
  { name: 'Madalena (Pico)', lat: 38.5360, lon: -28.5265, island: true },
  { name: 'São Roque do Pico (Pico)', lat: 38.5167, lon: -28.3167, island: true },
  { name: 'Lajes do Pico (Pico)', lat: 38.4000, lon: -28.2500, island: true },
  { name: 'Velas (S. Jorge)', lat: 38.6828, lon: -28.2133, island: true },
  { name: 'Calheta (S. Jorge)', lat: 38.6000, lon: -28.0167, island: true },
  { name: 'Santa Cruz das Flores (Flores)', lat: 39.4585, lon: -31.1303, island: true },
  { name: 'Lajes das Flores (Flores)', lat: 39.3833, lon: -31.1667, island: true },
  { name: 'Vila do Corvo (Corvo)', lat: 39.6715, lon: -31.1138, island: true },
  { name: 'Santa Cruz da Graciosa (Graciosa)', lat: 39.0865, lon: -28.0062, island: true },
  { name: 'Vila do Porto (Santa Maria)', lat: 36.9490, lon: -25.1490, island: true },
  
  // Mundo
  { name: 'Lisboa', lat: 38.7223, lon: -9.1393, island: false },
  { name: 'Porto', lat: 41.1579, lon: -8.6291, island: false },
  { name: 'Funchal (Madeira)', lat: 32.6500, lon: -16.9080, island: false },
  { name: 'Toronto', lat: 43.6532, lon: -79.3832, island: false },
  { name: 'Boston', lat: 42.3601, lon: -71.0589, island: false },
  { name: 'Montreal', lat: 45.5019, lon: -73.5673, island: false },
  { name: 'Paris', lat: 48.8566, lon: 2.3522, island: false },
  { name: 'Londres', lat: 51.5074, lon: -0.1278, island: false }
];

export const WeatherWidget: React.FC<WeatherWidgetProps> = ({ onLocationChange }) => {
  const [time, setTime] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<string>('Ponta Delgada (S. Miguel)');
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Update clock every second
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      setDate(now.toLocaleDateString('pt-PT', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const fetchWeather = async (lat: number, lon: number, name: string, useCache = true) => {
    setLoading(true);
    setError(null);

    const cacheKey = `weather_cache_${lat}_${lon}`;
    if (useCache) {
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        try {
          const parsed = JSON.parse(cached) as WeatherData;
          // Cache expires after 10 minutes (600,000 ms)
          if (Date.now() - parsed.timestamp < 600000) {
            setWeather(parsed);
            setLoading(false);
            return;
          }
        } catch (e) {
          console.error("Error reading weather cache", e);
        }
      }
    }

    try {
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&timezone=auto`
      );
      if (!response.ok) throw new Error("API failure");
      const data = await response.json();
      
      const newWeather: WeatherData = {
        temp: Math.round(data.current.temperature_2m),
        conditionCode: data.current.weather_code,
        windSpeed: Math.round(data.current.wind_speed_10m),
        humidity: Math.round(data.current.relative_humidity_2m),
        locationName: name,
        timestamp: Date.now()
      };

      setWeather(newWeather);
      localStorage.setItem(cacheKey, JSON.stringify(newWeather));
      localStorage.setItem('weather_last_loc', JSON.stringify({ lat, lon, name }));
    } catch (e) {
      console.error(e);
      setError('Informação meteorológica temporariamente indisponível.');
    } finally {
      setLoading(false);
    }
  };

  // On mount, auto-locate or use last/default
  useEffect(() => {
    const initWeather = async () => {
      const savedLoc = localStorage.getItem('weather_last_loc');
      let defaultLoc = { lat: 37.7412, lon: -25.6756, name: 'Ponta Delgada (S. Miguel)' };

      if (savedLoc) {
        try {
          const parsed = JSON.parse(savedLoc);
          defaultLoc = parsed;
          setSelectedLocation(parsed.name);
        } catch {}
      }

      // Try geolocating
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            setSelectedLocation('Minha Localização');
            fetchWeather(lat, lon, 'Minha Localização', true);
            if (onLocationChange) onLocationChange(lat, lon, 'Minha Localização');
          },
          () => {
            // Geolocation rejected or failed, fetch default/cached
            fetchWeather(defaultLoc.lat, defaultLoc.lon, defaultLoc.name, true);
          }
        );
      } else {
        fetchWeather(defaultLoc.lat, defaultLoc.lon, defaultLoc.name, true);
      }
    };

    initWeather();
  }, []);

  const handleSelectCity = (city: typeof CITIES[0]) => {
    setSelectedLocation(city.name);
    setShowDropdown(false);
    fetchWeather(city.lat, city.lon, city.name, true);
    if (onLocationChange) onLocationChange(city.lat, city.lon, city.name);
  };

  const getWeatherDescriptionAndIcon = (code: number) => {
    // Return description and a color indicator/style class
    if (code === 0) return { desc: 'Céu Limpo', style: 'text-amber-400' };
    if (code >= 1 && code <= 3) return { desc: 'Parcialmente Nublado', style: 'text-slate-300' };
    if (code >= 45 && code <= 48) return { desc: 'Nevoeiro', style: 'text-slate-400' };
    if (code >= 51 && code <= 55) return { desc: 'Chuviscos', style: 'text-sky-400' };
    if (code >= 61 && code <= 65) return { desc: 'Chuva', style: 'text-blue-500' };
    if (code >= 80 && code <= 82) return { desc: 'Aguaceiros', style: 'text-blue-600' };
    if (code >= 95 && code <= 99) return { desc: 'Trovoada', style: 'text-violet-500 animate-pulse' };
    return { desc: 'Meteorologia', style: 'text-slate-300' };
  };

  const getWeatherIcon = (code: number) => {
    if (code === 0) return <Sun className="w-8 h-8 text-amber-400 animate-spin-slow" />;
    if (code >= 1 && code <= 3) return <Cloud className="w-8 h-8 text-slate-300" />;
    if (code >= 51 && code <= 55) return <CloudDrizzle className="w-8 h-8 text-sky-400" />;
    if (code >= 61 && code <= 65) return <CloudRain className="w-8 h-8 text-blue-500" />;
    if (code >= 80 && code <= 82) return <CloudRain className="w-8 h-8 text-blue-600" />;
    if (code >= 95 && code <= 99) return <CloudLightning className="w-8 h-8 text-violet-500" />;
    return <Cloud className="w-8 h-8 text-slate-300" />;
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 mt-6">
      <div className="bg-slate-950/75 backdrop-blur-2xl border border-slate-800/80 rounded-[2.5rem] p-6 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6 transition-all duration-300 hover:border-slate-700/80">
        
        {/* Left Side: Clock, Date, and Location Dropdown */}
        <div className="flex items-center gap-5 w-full md:w-auto">
          <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 shrink-0 shadow-inner">
            <Clock className="text-green-500 w-7 h-7" />
          </div>
          <div className="text-left">
            <div className="text-2xl font-black text-white tracking-tighter tabular-nums leading-none">
              {time || '--:--:--'}
            </div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1.5 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-green-500 shrink-0" />
              <span className="truncate max-w-[200px]">{date || 'A carregar...'}</span>
            </div>
          </div>
        </div>

        {/* Center / Right Side: Weather info & Geolocation Dropdown selector */}
        <div className="flex flex-col sm:flex-row items-center gap-6 w-full md:w-auto justify-end">
          
          {/* Weather Info */}
          {loading ? (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full border-2 border-green-500/20 border-t-green-500 animate-spin"></div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">A carregar meteorologia...</span>
            </div>
          ) : error ? (
            <span className="text-xs font-bold text-rose-450 uppercase tracking-wider bg-rose-950/30 border border-rose-900/50 px-4 py-2 rounded-2xl">{error}</span>
          ) : weather ? (
            <div className="flex items-center gap-5 bg-white/5 border border-white/10 px-5 py-3 rounded-3xl w-full sm:w-auto justify-between sm:justify-start">
              <div className="flex items-center gap-3">
                {getWeatherIcon(weather.conditionCode)}
                <div className="text-left">
                  <div className="text-2xl font-black text-white tracking-tighter leading-none">
                    {weather.temp}°C
                  </div>
                  <span className={`text-[9px] font-black uppercase tracking-wider ${getWeatherDescriptionAndIcon(weather.conditionCode).style}`}>
                    {getWeatherDescriptionAndIcon(weather.conditionCode).desc}
                  </span>
                </div>
              </div>

              <div className="h-8 w-[1px] bg-white/10 hidden sm:block"></div>

              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Vento</span>
                  <span className="text-xs font-black text-white mt-0.5 flex items-center gap-0.5"><Wind className="w-3 h-3 text-slate-400" /> {weather.windSpeed} km/h</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Humidade</span>
                  <span className="text-xs font-black text-white mt-0.5 flex items-center gap-0.5"><Droplets className="w-3 h-3 text-slate-400" /> {weather.humidity}%</span>
                </div>
              </div>
            </div>
          ) : null}

          {/* Location Selector */}
          <div className="relative w-full sm:w-auto" ref={dropdownRef}>
            <button 
              onClick={() => setShowDropdown(!showDropdown)}
              className="w-full sm:w-auto px-5 py-3.5 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-between sm:justify-start gap-3 hover:border-slate-700 transition-all font-bold text-xs uppercase tracking-widest text-slate-350 cursor-pointer shadow-md"
            >
              <MapPin className="w-4 h-4 text-green-500 shrink-0" />
              <span className="truncate max-w-[150px]">{selectedLocation}</span>
              <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform duration-300 ${showDropdown ? 'rotate-180' : ''}`} />
            </button>

            {showDropdown && (
              <div className="absolute right-0 bottom-full sm:bottom-auto sm:top-full mt-2 w-64 bg-slate-900 border border-slate-800/90 rounded-3xl shadow-2xl p-2 z-[200] max-h-64 overflow-y-auto scrollbar-hide">
                <div className="text-[8px] font-black text-slate-500 uppercase tracking-widest px-3 py-2 border-b border-white/5">Localidades Açores</div>
                {CITIES.filter(c => c.island).map((c) => (
                  <button
                    key={c.name}
                    onClick={() => handleSelectCity(c)}
                    className="w-full text-left px-3 py-2.5 text-[10px] font-bold text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors flex items-center gap-2"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 shrink-0"></span>
                    {c.name}
                  </button>
                ))}
                
                <div className="text-[8px] font-black text-slate-500 uppercase tracking-widest px-3 py-2 border-b border-white/5 mt-2">Mundo</div>
                {CITIES.filter(c => !c.island).map((c) => (
                  <button
                    key={c.name}
                    onClick={() => handleSelectCity(c)}
                    className="w-full text-left px-3 py-2.5 text-[10px] font-bold text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors flex items-center gap-2"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0"></span>
                    {c.name}
                  </button>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
