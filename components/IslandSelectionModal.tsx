import React, { useState } from 'react';
import { X, MapPin, ChevronRight, Map, Navigation, LocateFixed, Loader2 } from 'lucide-react';
import { Language } from '../types';
import { getAirports } from '../constants';
import { getTranslation } from '../translations';

interface IslandSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (islandCode: string) => void;
  language: Language;
}

const IslandSelectionModal: React.FC<IslandSelectionModalProps> = ({ isOpen, onClose, onSelect, language }) => {
  const [isLocating, setIsLocating] = useState(false);

  if (!isOpen) return null;

  // Get only Azores islands
  const islands = getAirports(language).filter(a => a.isAzores);

  const handleGPSLocate = () => {
    setIsLocating(true);
    if (!navigator.geolocation) {
      alert("Geolocalização não é suportada pelo seu navegador.");
      setIsLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      
      // Azores Island Proximity Logic
      const azoresIslands = [
        { code: 'PDL', name: 'São Miguel', lat: 37.78, lon: -25.50 },
        { code: 'SMA', name: 'Santa Maria', lat: 36.97, lon: -25.13 },
        { code: 'TER', name: 'Terceira', lat: 38.72, lon: -27.22 },
        { code: 'GRW', name: 'Graciosa', lat: 39.05, lon: -28.01 },
        { code: 'SJZ', name: 'São Jorge', lat: 38.65, lon: -28.02 },
        { code: 'PIX', name: 'Pico', lat: 38.46, lon: -28.38 },
        { code: 'HOR', name: 'Faial', lat: 38.58, lon: -28.69 },
        { code: 'FLW', name: 'Flores', lat: 39.43, lon: -31.21 },
        { code: 'CVU', name: 'Corvo', lat: 39.70, lon: -31.11 }
      ];

      // Find closest island
      let closest = azoresIslands[0];
      let minDistance = Math.hypot(latitude - closest.lat, longitude - closest.lon);

      azoresIslands.forEach(island => {
        const dist = Math.hypot(latitude - island.lat, longitude - island.lon);
        if (dist < minDistance) {
          minDistance = dist;
          closest = island;
        }
      });

      // If user is too far from Azores (roughly > 5 degrees), it's probably outside the region
      if (minDistance > 5) {
        alert("Encontra-se fora da região dos Açores. Por favor, selecione uma ilha manualmente.");
      } else {
        onSelect(closest.code);
      }
      setIsLocating(false);
    }, (error) => {
      console.error(error);
      alert("Não foi possível obter a sua localização.");
      setIsLocating(false);
    });
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300" 
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="bg-white rounded-[32px] w-full max-w-md shadow-2xl relative z-10 overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col max-h-[85vh] border border-white/20">
        
        {/* Header - Modern Green/Blue Map Style */}
        <div className="bg-green-800 p-7 flex justify-between items-start relative overflow-hidden">
           <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
           <div className="relative z-10">
             <div className="p-3 bg-white/20 rounded-2xl w-fit mb-4 backdrop-blur-md border border-white/20">
                <Map className="w-7 h-7 text-white" />
             </div>
             <h2 className="text-3xl font-black text-white tracking-tighter leading-none drop-shadow-sm">Explorar Ilhas</h2>
             <p className="text-white text-[10px] font-black mt-2 uppercase tracking-[0.2em]">Selecione o seu próximo destino</p>
           </div>
           <button 
             onClick={onClose} 
             className="p-2.5 bg-white/10 hover:bg-white text-white hover:text-slate-900 rounded-full transition-all border border-white/20 group relative z-10"
           >
             <X size={20} className="group-active:scale-90 transition-transform" />
           </button>
        </div>

        {/* List Content */}
        <div className="p-2 overflow-y-auto bg-slate-50 flex-1 scrollbar-hide">
          <div className="space-y-2 p-2">
            
            {/* GPS Locate Button */}
            <button 
              onClick={handleGPSLocate}
              disabled={isLocating}
              className="w-full p-4 bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-600/20 flex items-center justify-between group active:scale-[0.98] transition-all mb-4"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  {isLocating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Navigation className="w-5 h-5 fill-current" />}
                </div>
                <div className="text-left">
                  <span className="font-black text-white block text-sm uppercase tracking-tight">Localizar-me (GPS)</span>
                  <span className="text-[10px] text-blue-100 font-bold opacity-80">Encontrar a ilha mais próxima</span>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-blue-200" />
            </button>

            {/* All Islands Option */}
            <button 
              onClick={() => onSelect('all')}
              className="w-full p-4 bg-white rounded-2xl shadow-sm border border-slate-200 flex items-center justify-between group hover:border-green-500 transition-all active:scale-[0.98]"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-green-100 group-hover:text-green-600 transition-colors">
                  <LocateFixed className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <span className="font-black text-slate-800 block text-sm uppercase tracking-tight">Todas as Ilhas</span>
                  <span className="text-[10px] text-slate-400 font-bold">Ver tudo o que os Açores oferecem</span>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-300" />
            </button>

            <div className="h-4"></div>

            {/* Island List */}
            {islands.map((island) => (
              <button 
                key={island.code}
                onClick={() => onSelect(island.code)}
                className="w-full p-4 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between group hover:border-green-500 hover:shadow-md transition-all active:scale-[0.98]"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-green-50 group-hover:text-green-600 transition-colors">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <span className="font-black text-slate-800 block text-sm uppercase tracking-tight">{island.location}</span>
                    <span className="text-[9px] text-slate-400 font-black bg-slate-100 px-2 py-0.5 rounded uppercase tracking-tighter group-hover:bg-green-100 group-hover:text-green-700">{island.code}</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-green-500 transition-colors" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IslandSelectionModal;
