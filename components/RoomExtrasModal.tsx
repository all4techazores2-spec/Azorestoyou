
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Check, Gift, Wine, Flower2, Cake, Sparkles, ArrowRight } from 'lucide-react';

interface ExtraOption {
  id: string;
  name: string;
  price: number;
  icon: React.ReactNode;
  description: string;
}

interface RoomExtrasModalProps {
  onClose: () => void;
  onConfirm: (selectedExtras: ExtraOption[]) => void;
}

const RoomExtrasModal: React.FC<RoomExtrasModalProps> = ({ onClose, onConfirm }) => {
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);

  const extras: ExtraOption[] = [
    { id: 'E1', name: 'Champanhe e Frutas', price: 45, icon: <Wine className="text-amber-500" />, description: 'Uma garrafa de espumante regional e frutas da época.' },
    { id: 'E2', name: 'Pétalas de Rosa', price: 25, icon: <Flower2 className="text-red-500" />, description: 'Decoração romântica sobre a cama à chegada.' },
    { id: 'E3', name: 'Bolo de Aniversário', price: 30, icon: <Cake className="text-pink-500" />, description: 'Bolo caseiro personalizado para celebrações.' },
    { id: 'E4', name: 'Pacote Surpresa', price: 60, icon: <Gift className="text-purple-500" />, description: 'Uma seleção de produtos locais e um presente especial.' },
  ];

  const toggleExtra = (id: string) => {
    setSelectedExtras(prev => 
      prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id]
    );
  };

  const handleConfirm = () => {
    const selected = extras.filter(e => selectedExtras.includes(e.id));
    onConfirm(selected);
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="bg-white w-full max-w-xl rounded-[3rem] shadow-2xl overflow-hidden flex flex-col relative"
      >
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 z-10 p-3 bg-white text-slate-800 hover:bg-blue-600 hover:text-white rounded-full transition-all shadow-lg border border-slate-100 group"
        >
          <X size={20} className="group-active:scale-90 transition-transform" />
        </button>

        <div className="p-8 pb-4 text-center">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-4">
             <Sparkles size={32} />
          </div>
          <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Deseja adicionar um extra?</h2>
          <p className="text-slate-500 font-medium text-sm mt-1 px-4">
            Torne a sua estadia inesquecível com uma surpresa especial preparada pela nossa equipa.
          </p>
        </div>

        <div className="p-8 pt-4 space-y-3">
          {extras.map(extra => (
            <button 
              key={extra.id}
              onClick={() => toggleExtra(extra.id)}
              className={`w-full flex items-center p-5 rounded-[2rem] border-2 transition-all gap-4 text-left group
                ${selectedExtras.includes(extra.id) ? 'border-blue-600 bg-blue-50' : 'border-slate-100 hover:border-slate-200'}`}
            >
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm border transition-all
                ${selectedExtras.includes(extra.id) ? 'bg-white border-blue-200' : 'bg-slate-50 border-slate-100'}`}>
                {extra.icon}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <h4 className="font-black text-slate-800 uppercase tracking-tight text-sm">{extra.name}</h4>
                  <span className="text-blue-600 font-black text-sm">€{extra.price}</span>
                </div>
                <p className="text-[10px] text-slate-400 font-medium leading-tight mt-0.5">{extra.description}</p>
              </div>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all
                ${selectedExtras.includes(extra.id) ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-200'}`}>
                {selectedExtras.includes(extra.id) && <Check size={14} />}
              </div>
            </button>
          ))}
        </div>

        <div className="p-8 pt-0 flex gap-4">
          <button 
            onClick={() => onConfirm([])}
            className="flex-1 py-4 bg-slate-100 text-slate-500 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-slate-200 transition-all"
          >
            Não, obrigado
          </button>
          <button 
            onClick={handleConfirm}
            className="flex-[1.5] py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-slate-900/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
          >
            Confirmar Pedido <ArrowRight size={18} />
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default RoomExtrasModal;
