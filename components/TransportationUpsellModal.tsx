
import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Car, Taxi, ArrowRight, X, Sparkles, ShieldCheck } from 'lucide-react';
import { Language } from '../types';
import { getTranslation } from '../translations';

interface TransportationUpsellModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCar: () => void;
  onSelectTaxi: () => void;
  onSkip: () => void;
  language: Language;
}

const TransportationUpsellModal: React.FC<TransportationUpsellModalProps> = ({
  isOpen,
  onClose,
  onSelectCar,
  onSelectTaxi,
  onSkip,
  language
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/20 relative"
        >
          {/* Header Image/Pattern */}
          <div className="h-32 bg-gradient-to-br from-blue-600 to-indigo-700 relative overflow-hidden">
             <div className="absolute inset-0 opacity-20">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent scale-150"></div>
             </div>
             <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-white/10 p-4 rounded-full backdrop-blur-md">
                   <Sparkles className="text-white w-8 h-8" />
                </div>
             </div>
             <button 
                onClick={onClose}
                className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full transition-all"
             >
                <X size={18} />
             </button>
          </div>

          <div className="p-8 space-y-6 text-center">
            <div>
               <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter leading-tight">
                  {language === 'pt' ? 'Precisa de Transporte?' : 'Need Transportation?'}
               </h2>
               <p className="text-slate-500 font-medium text-sm mt-1">
                  {language === 'pt' ? 'Aproveite descontos exclusivos ao reservar agora.' : 'Enjoy exclusive discounts when booking now.'}
               </p>
            </div>

            <div className="grid grid-cols-1 gap-3">
               {/* Option Car */}
               <button 
                 onClick={onSelectCar}
                 className="group relative bg-slate-50 hover:bg-blue-600 border border-slate-100 hover:border-blue-500 p-4 rounded-2xl transition-all flex items-center gap-4 text-left active:scale-[0.98]"
               >
                  <div className="p-3 bg-white group-hover:bg-blue-500 rounded-xl shadow-sm transition-colors">
                     <Car className="w-6 h-6 text-blue-600 group-hover:text-white" />
                  </div>
                  <div className="flex-1">
                     <p className="font-black text-slate-900 group-hover:text-white text-sm uppercase">{language === 'pt' ? 'Alugar Carro' : 'Rent a Car'}</p>
                     <p className="text-[10px] text-slate-400 group-hover:text-blue-100 font-bold uppercase tracking-widest">{language === 'pt' ? 'Liberdade total na ilha' : 'Total freedom on the island'}</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-white" />
               </button>

               {/* Option Taxi */}
               <button 
                 onClick={onSelectTaxi}
                 className="group relative bg-slate-50 hover:bg-amber-500 border border-slate-100 hover:border-amber-400 p-4 rounded-2xl transition-all flex items-center gap-4 text-left active:scale-[0.98]"
               >
                  <div className="p-3 bg-white group-hover:bg-amber-400 rounded-xl shadow-sm transition-colors">
                     <Taxi className="w-6 h-6 text-amber-600 group-hover:text-white" />
                  </div>
                  <div className="flex-1">
                     <p className="font-black text-slate-900 group-hover:text-white text-sm uppercase">{language === 'pt' ? 'Taxi / Transfer' : 'Taxi / Transfer'}</p>
                     <p className="text-[10px] text-slate-400 group-hover:text-amber-100 font-bold uppercase tracking-widest">{language === 'pt' ? 'Conforto direto ao hotel' : 'Direct comfort to your hotel'}</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-white" />
               </button>
            </div>

            <div className="flex flex-col items-center gap-4 pt-2">
               <button 
                 onClick={onSkip}
                 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] hover:text-slate-900 transition-colors"
               >
                  {language === 'pt' ? 'Não, apenas o alojamento' : 'No, just the accommodation'}
               </button>
               
               <div className="flex items-center gap-2 text-[9px] font-black text-green-500 uppercase tracking-widest bg-green-50 px-4 py-2 rounded-full">
                  <ShieldCheck size={12} />
                  {language === 'pt' ? 'Reserva Segura & Garantida' : 'Safe & Guaranteed Booking'}
               </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default TransportationUpsellModal;
