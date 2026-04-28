
import React from 'react';
import { X, MapPin, ChevronRight, Bus } from 'lucide-react';
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
  if (!isOpen) return null;

  // Get only Azores islands
  const islands = getAirports(language).filter(a => a.isAzores);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-300" 
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl relative z-10 overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="bg-pink-600 p-6 flex justify-between items-start relative overflow-hidden">
           <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
           <div className="relative z-10">
             <div className="p-3 bg-white/20 rounded-xl w-fit mb-3">
                <Bus className="w-8 h-8 text-white" />
             </div>
             <h2 className="text-2xl font-bold text-white">{getTranslation(language, 'select_island_bus_title')}</h2>
             <p className="text-pink-100 text-sm mt-1">{getTranslation(language, 'select_island_bus_desc')}</p>
           </div>
           <button onClick={onClose} className="p-2 bg-white/20 hover:bg-white/30 rounded-full text-white transition-colors relative z-10">
             <X className="w-5 h-5" />
           </button>
        </div>

        {/* List */}
        <div className="p-2 overflow-y-auto bg-slate-50 flex-1">
          <div className="space-y-2 p-2">
            {islands.map((island) => (
              <button 
                key={island.code}
                onClick={() => onSelect(island.code)}
                className="w-full p-4 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-between group hover:border-pink-300 hover:shadow-md transition-all active:scale-[0.98]"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-pink-100 group-hover:text-pink-600 transition-colors">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div className="text-left">
                    <span className="font-bold text-slate-800 block text-lg">{island.location}</span>
                    <span className="text-xs text-slate-400 font-mono bg-slate-100 px-1.5 py-0.5 rounded">{island.code}</span>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-pink-500 transition-colors" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IslandSelectionModal;
