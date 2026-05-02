
import React, { useState } from 'react';
import { Business, Language, Car } from '../types';
import { X, Map, PhoneCall, ChevronLeft, ChevronRight, Car as CarIcon, Gauge, Fuel, Users, Info, Sparkles, Star } from 'lucide-react';
import { COLORS } from '../constants';
import { motion, AnimatePresence } from 'motion/react';

import TestDriveModal from './TestDriveModal';

interface CarStandModalProps {
  stand: Business | null;
  onClose: () => void;
  language?: Language;
  onSuccess?: (resData: any, standName: string, standId: string) => void;
  userProfile?: { email: string; name: string; phone: string };
}

const CarStandModal: React.FC<CarStandModalProps> = ({
  stand,
  onClose,
  language = 'pt',
  onSuccess,
  userProfile
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedCarForTestDrive, setSelectedCarForTestDrive] = useState<Car | null>(null);

  if (!stand) return null;

  const featured = stand.featuredVehicles || [];
  const allCars = stand.vehicles || [];

  const nextSlide = () => setCurrentSlide(prev => (prev + 1) % featured.length);
  const prevSlide = () => setCurrentSlide(prev => (prev - 1 + featured.length) % featured.length);

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
      <motion.div 
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="bg-white rounded-none sm:rounded-[2.5rem] w-full max-w-5xl h-full sm:h-[85vh] overflow-hidden shadow-2xl flex flex-col relative"
      >
        <button 
          onClick={onClose} 
          className="absolute top-6 right-6 z-50 p-2.5 bg-white/90 backdrop-blur-md text-slate-400 rounded-2xl hover:bg-white hover:text-slate-900 transition-all shadow-xl border border-slate-100"
        >
          <X size={20} />
        </button>

        <div className="flex-1 overflow-y-auto">
          {/* Top Featured Slider */}
          {featured.length > 0 && (
            <div className="relative h-[45vh] bg-slate-900">
               <AnimatePresence mode="wait">
                 <motion.div
                   key={currentSlide}
                   initial={{ opacity: 0, scale: 1.1 }}
                   animate={{ opacity: 1, scale: 1 }}
                   exit={{ opacity: 0, scale: 0.9 }}
                   transition={{ duration: 0.8 }}
                   className="absolute inset-0"
                 >
                   <img src={featured[currentSlide].image} className="w-full h-full object-cover opacity-70" alt="Featured Car" />
                   <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
                 </motion.div>
               </AnimatePresence>

               <div className="absolute bottom-8 left-8 right-8 text-white z-10">
                  <div className="flex items-center gap-2 mb-4">
                    <motion.span 
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      key={`badge-${currentSlide}`}
                      className="px-4 py-1.5 bg-blue-600 text-white rounded-full text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 shadow-xl shadow-blue-900/40 border border-blue-400/30"
                    >
                      <Sparkles size={12} className="animate-pulse" /> Novidade 2026
                    </motion.span>
                    <span className="px-4 py-1.5 bg-white/10 backdrop-blur-md text-white rounded-full text-[10px] font-black uppercase tracking-[0.2em] border border-white/20">
                      Destaque da Semana
                    </span>
                  </div>
                  <h3 className="text-4xl font-black tracking-tight mb-3 uppercase drop-shadow-2xl">{featured[currentSlide].model}</h3>
                  <div className="flex gap-6 items-center">
                     <div className="flex items-center gap-2.5 text-xs font-black uppercase tracking-widest opacity-90 bg-black/20 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/5"><Users size={16} className="text-blue-400" /> {featured[currentSlide].seats} Lugares</div>
                     <div className="flex items-center gap-2.5 text-xs font-black uppercase tracking-widest opacity-90 bg-black/20 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/5"><Fuel size={16} className="text-blue-400" /> {featured[currentSlide].fuelType}</div>
                     <div className="h-8 w-[1px] bg-white/20" />
                     <button 
                       onClick={() => setSelectedCarForTestDrive(featured[currentSlide])}
                       className="px-6 py-3 bg-white text-slate-900 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-blue-600 hover:text-white transition-all shadow-xl active:scale-95"
                     >
                       Agendar Agora
                     </button>
                  </div>
               </div>

               {featured.length > 1 && (
                 <div className="absolute top-1/2 -translate-y-1/2 inset-x-4 flex justify-between">
                   <button onClick={prevSlide} className="p-3 bg-white/10 backdrop-blur-md text-white rounded-2xl hover:bg-white/20 transition-all"><ChevronLeft /></button>
                   <button onClick={nextSlide} className="p-3 bg-white/10 backdrop-blur-md text-white rounded-2xl hover:bg-white/20 transition-all"><ChevronRight /></button>
                 </div>
               )}
            </div>
          )}

          <div className="p-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-black text-slate-800 tracking-tight uppercase">Viaturas em Exposição</h2>
                <p className="text-sm font-bold text-slate-400">Descubra a nossa gama no {stand.name}</p>
              </div>
              <div className="flex gap-2">
                 <button onClick={() => window.location.href=`tel:${stand.phone}`} className="p-4 bg-slate-900 text-white rounded-2xl shadow-xl hover:bg-blue-600 transition-all"><PhoneCall size={20} /></button>
                 <button 
                   onClick={() => window.open(`https://maps.google.com/?q=${stand.latitude},${stand.longitude}`, '_blank')}
                   className="p-4 bg-slate-100 text-slate-600 rounded-2xl hover:bg-slate-200 transition-all"
                 >
                   <Map size={20} />
                 </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {allCars.map(car => (
                <motion.div 
                  key={car.id} 
                  whileHover={{ y: -5 }}
                  className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-xl transition-all group"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img src={car.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={car.model} />
                    <div className="absolute top-4 right-4 px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-[10px] font-black text-slate-900 shadow-sm">
                      {car.fuelType}
                    </div>
                  </div>
                  <div className="p-5">
                    <h4 className="text-lg font-black text-slate-800 mb-1 uppercase tracking-tight">{car.model}</h4>
                    <p className="text-xs font-bold text-slate-400 mb-4 line-clamp-2">{car.description}</p>
                    
                    {car.features && (
                      <div className="flex flex-wrap gap-1.5 mb-5">
                        {car.features.map((f, i) => (
                          <span key={i} className="px-2 py-1 bg-slate-50 text-slate-400 rounded-lg text-[9px] font-black uppercase tracking-widest border border-slate-100">
                            {f}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="flex flex-col gap-3 pt-4 border-t border-slate-50">
                       <div className="flex justify-between items-center">
                          <div className="flex gap-3 text-slate-400">
                             <div className="flex items-center gap-1.5 text-[10px] font-black uppercase"><Users size={12} /> {car.seats}</div>
                             <div className="flex items-center gap-1.5 text-[10px] font-black uppercase"><Gauge size={12} /> Auto</div>
                          </div>
                          <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Disponível</span>
                       </div>
                       <button 
                         onClick={() => setSelectedCarForTestDrive(car)}
                         className="w-full py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all shadow-lg shadow-slate-200"
                       >
                         Agendar Test Drive
                       </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {allCars.length === 0 && (
              <div className="text-center py-20 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
                <CarIcon size={48} className="mx-auto text-slate-300 mb-4" />
                <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">Sem viaturas listadas no momento</p>
              </div>
            )}
          </div>
        </div>

        {selectedCarForTestDrive && (
          <TestDriveModal
            stand={stand}
            car={selectedCarForTestDrive}
            onClose={() => setSelectedCarForTestDrive(null)}
            language={language}
            onSuccess={onSuccess}
            userProfile={userProfile}
          />
        )}
      </motion.div>
    </div>
  );
};

export default CarStandModal;
