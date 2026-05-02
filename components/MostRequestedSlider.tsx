
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Star, MapPin, Phone } from 'lucide-react';

interface SliderItem {
  id: string;
  title: string;
  image: string;
  rating: number;
  location: string;
  category: string;
  phone?: string;
  buttonLabel?: string;
}

interface MostRequestedSliderProps {
  items: SliderItem[];
}

const MostRequestedSlider: React.FC<MostRequestedSliderProps> = ({ items }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [items.length]);

  const next = () => setCurrentIndex((prev) => (prev + 1) % items.length);
  const prev = () => setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);

  if (items.length === 0) return null;

  return (
    <div className="w-full mb-12 relative">
      <div className="relative h-[300px] md:h-[450px] w-full overflow-hidden shadow-2xl group">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent z-10" />
            <img 
              src={items[currentIndex].image} 
              alt={items[currentIndex].title}
              className="w-full h-full object-cover"
            />
            
            <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 z-20 flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-3 py-1 bg-white/20 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-full border border-white/30">
                    {items[currentIndex].category}
                  </span>
                  <div className="flex items-center gap-1 bg-amber-400 text-slate-900 px-2 py-0.5 rounded-full text-[10px] font-black">
                    <Star size={10} fill="currentColor" /> {items[currentIndex].rating}
                  </div>
                </div>
                <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter leading-none">
                  {items[currentIndex].title}
                </h2>
                <div className="flex items-center gap-2 text-white/70 font-bold">
                  <MapPin size={16} className="text-red-400" />
                  <span>{items[currentIndex].location}</span>
                </div>
              </div>
              
              {items[currentIndex].phone ? (
                <a 
                  href={`tel:${items[currentIndex].phone}`}
                  className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:scale-105 active:scale-95 transition-all shadow-xl flex items-center gap-2"
                >
                  <Phone size={16} /> {items[currentIndex].buttonLabel || 'Ligue Já'}
                </a>
              ) : (
                <button className="px-8 py-4 bg-white text-slate-900 rounded-2xl font-black uppercase tracking-widest text-xs hover:scale-105 active:scale-95 transition-all shadow-xl">
                  {items[currentIndex].buttonLabel || 'Reservar Agora'}
                </button>
              )}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows */}
        <button 
          onClick={prev}
          className="absolute left-6 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md text-white border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-white hover:text-slate-900"
        >
          <ChevronLeft size={24} />
        </button>
        <button 
          onClick={next}
          className="absolute right-6 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md text-white border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-white hover:text-slate-900"
        >
          <ChevronRight size={24} />
        </button>

        {/* Indicators */}
        <div className="absolute bottom-6 right-12 z-30 flex gap-2">
          {items.map((_, idx) => (
            <div 
              key={idx}
              className={`h-1.5 transition-all duration-500 rounded-full ${idx === currentIndex ? 'w-8 bg-white' : 'w-2 bg-white/30'}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MostRequestedSlider;
