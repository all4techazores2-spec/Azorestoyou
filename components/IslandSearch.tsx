
import React, { useState } from 'react';
import { Search, Map, X, MapPin, Check, Compass } from 'lucide-react';
import { Language } from '../types';
import { getAirports } from '../constants';
import { getTranslation } from '../translations';

interface IslandSearchProps {
  selectedIsland: string;
  onSelectIsland: (code: string) => void;
  language: Language;
}

const IslandSearch: React.FC<IslandSearchProps> = ({ selectedIsland, onSelectIsland, language }) => {
  const [query, setQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Get only Azores islands
  const islands = getAirports(language).filter(a => a.isAzores);

  // Handle direct text input matching
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);

    // Try to find a match case-insensitive
    if (val.trim() === '') {
      onSelectIsland('all');
      return;
    }

    const match = islands.find(i => i.name.toLowerCase().includes(val.toLowerCase()) || i.location.toLowerCase().includes(val.toLowerCase()));
    if (match) {
      onSelectIsland(match.code);
    }
  };

  const currentSelectionName = selectedIsland === 'all' 
    ? getTranslation(language, 'all_islands') 
    : islands.find(i => i.code === selectedIsland)?.location || selectedIsland;

  return (
    <div className="w-full max-w-xl mx-auto mb-8 px-2 relative z-20">
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
        </div>
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          placeholder={getTranslation(language, 'search_placeholder')}
          className="block w-full pl-11 pr-14 py-4 rounded-2xl border-none ring-1 ring-slate-200 shadow-lg bg-white/90 backdrop-blur-sm focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-slate-700 font-medium placeholder:text-slate-400"
        />
        <button 
          onClick={() => setIsModalOpen(true)}
          className="absolute inset-y-1.5 right-1.5 aspect-square bg-slate-100 hover:bg-blue-50 text-slate-500 hover:text-blue-600 rounded-xl flex items-center justify-center transition-all border border-slate-200"
          title="Selecionar da lista"
        >
          <Map className="h-5 w-5" />
        </button>
      </div>

      {/* Helper text showing current selection if different from query */}
      {selectedIsland !== 'all' && query === '' && (
        <div className="absolute -bottom-6 left-4 text-xs text-blue-600 font-bold flex items-center gap-1 animate-in fade-in slide-in-from-top-1">
          <Check className="w-3 h-3" /> {getTranslation(language, 'search_results')}: {currentSelectionName}
        </div>
      )}

      {/* Modal Popup */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          
          <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl relative z-10 overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 pb-2 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div>
                <h3 className="text-lg font-bold text-slate-800">{getTranslation(language, 'select_island_modal')}</h3>
                <p className="text-xs text-slate-500">{getTranslation(language, 'select_island_desc')}</p>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="p-3 bg-white text-slate-800 hover:bg-blue-600 hover:text-white rounded-full transition-all shadow-lg border border-slate-100 group"
              >
                <X size={20} className="group-active:scale-90 transition-transform" />
              </button>
            </div>
            
            <div className="p-4 max-h-[60vh] overflow-y-auto space-y-3">
              {/* Locate Me Button */}
              <button 
                onClick={() => {
                  if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition((position) => {
                      const { latitude, longitude } = position.coords;
                      onSelectIsland(`nearby:${latitude},${longitude}`);
                      setIsModalOpen(false);
                    }, (error) => {
                      console.error("Error detecting location:", error);
                      alert("Não foi possível detetar a sua localização.");
                    });
                  }
                }}
                className="w-full p-4 rounded-xl flex items-center gap-4 transition-all border-2 border-blue-100 bg-blue-50/50 text-blue-600 hover:bg-blue-100/50 group"
              >
                <div className="p-2 rounded-lg bg-blue-600 text-white shadow-md group-hover:scale-110 transition-transform">
                  <Compass className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <span className="font-bold block">Detetar Localização</span>
                  <span className="text-xs opacity-70">Encontrar negócios perto de mim</span>
                </div>
                <div className="ml-auto w-2 h-2 rounded-full bg-blue-600 animate-pulse"></div>
              </button>

              {/* Simulation for testing: Toronto, Canada */}
              <button 
                onClick={() => {
                  onSelectIsland(`nearby:43.6532,-79.3832`);
                  setIsModalOpen(false);
                }}
                className="w-full p-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-300 hover:text-blue-400 transition-colors"
              >
                Simular Localização: Toronto, Canadá 🇨🇦
              </button>

              <div className="h-px bg-slate-100 my-2"></div>

              <button 
                onClick={() => { onSelectIsland('all'); setQuery(''); setIsModalOpen(false); }}
                className={`w-full p-4 rounded-xl flex items-center gap-4 transition-all border-2 text-left
                  ${selectedIsland === 'all' 
                    ? 'border-blue-500 bg-blue-50 text-blue-700' 
                    : 'border-transparent bg-slate-50 text-slate-600 hover:bg-slate-100'}`}
              >
                <div className={`p-2 rounded-lg ${selectedIsland === 'all' ? 'bg-blue-200 text-blue-700' : 'bg-white text-slate-400'}`}>
                  <MapPin className="w-6 h-6" />
                </div>
                <span className="font-bold">{getTranslation(language, 'all_islands')}</span>
                {selectedIsland === 'all' && <Check className="w-5 h-5 ml-auto" />}
              </button>

              {islands.map((island) => (
                <button 
                  key={island.code}
                  onClick={() => { 
                    onSelectIsland(island.code); 
                    setQuery(''); // Clear query to show selection helper instead
                    setIsModalOpen(false); 
                  }}
                  className={`w-full p-4 rounded-xl flex items-center gap-4 transition-all border-2 text-left group
                    ${selectedIsland === island.code 
                      ? 'border-blue-500 bg-blue-50 text-blue-700' 
                      : 'border-transparent bg-white shadow-sm text-slate-700 hover:bg-blue-50/50 hover:border-blue-200'}`}
                >
                  <div className={`p-2 rounded-lg transition-colors ${selectedIsland === island.code ? 'bg-blue-200 text-blue-700' : 'bg-slate-100 text-slate-400 group-hover:bg-white group-hover:text-blue-500'}`}>
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="font-bold block">{island.location}</span>
                    <span className="text-xs opacity-70 font-mono">{island.code}</span>
                  </div>
                  {selectedIsland === island.code && <Check className="w-5 h-5 ml-auto" />}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IslandSearch;
