import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Calendar, Clock, ChevronLeft, ChevronRight } from 'lucide-react';

interface NewsDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  newsItem: {
    title: string;
    description?: string;
    content?: string;
    date: string;
    time: string;
    image: string;
    sliderImages?: string[];
  } | null;
}

export const NewsDetailModal: React.FC<NewsDetailModalProps> = ({
  isOpen,
  onClose,
  newsItem
}) => {
  if (!isOpen || !newsItem) return null;

  // Combine thumbnail image with sliderImages array
  const images = [newsItem.image, ...(newsItem.sliderImages || [])].filter(Boolean);
  const [currentImgIdx, setCurrentImgIdx] = useState(0);

  const handleNext = () => {
    setCurrentImgIdx(prev => (prev + 1) % images.length);
  };

  const handlePrev = () => {
    setCurrentImgIdx(prev => (prev - 1 + images.length) % images.length);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[1500] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.95, y: 30 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.95, y: 30 }}
          className="bg-slate-900/95 border border-white/10 rounded-[2.5rem] w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[85vh] relative"
        >
          {/* Close button */}
          <button 
            onClick={onClose} 
            className="absolute top-4 right-4 z-50 p-2.5 bg-slate-950/60 hover:bg-slate-950/80 backdrop-blur-sm rounded-full text-slate-350 hover:text-white transition-all shadow-md"
          >
            <X size={18} />
          </button>

          {/* Slider / Image Gallery at the top */}
          <div className="relative h-60 md:h-64 bg-slate-950 overflow-hidden shrink-0">
            {images.length > 0 ? (
              <>
                <img 
                  src={images[currentImgIdx]} 
                  alt="" 
                  className="w-full h-full object-cover transition-all duration-500" 
                />

                {/* Left/Right buttons if multiple images */}
                {images.length > 1 && (
                  <>
                    <button 
                      onClick={handlePrev} 
                      className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-slate-950/40 hover:bg-slate-950/60 rounded-full text-white transition-all"
                    >
                      <ChevronLeft size={16} />
                    </button>
                    <button 
                      onClick={handleNext} 
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-slate-950/40 hover:bg-slate-950/60 rounded-full text-white transition-all"
                    >
                      <ChevronRight size={16} />
                    </button>

                    {/* Progress Dots */}
                    <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5 z-10">
                      {images.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setCurrentImgIdx(idx)}
                          className={`h-1.5 rounded-full transition-all duration-300 ${
                            currentImgIdx === idx ? 'w-4 bg-yellow-500' : 'w-1.5 bg-white/40'
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-slate-950 text-slate-500">
                Sem Imagem
              </div>
            )}
          </div>

          {/* News Info & Description */}
          <div className="p-6 md:p-8 flex-1 overflow-y-auto space-y-4">
            <div className="flex items-center gap-3 text-slate-400 text-[10px] font-black uppercase tracking-widest">
              <span className="flex items-center gap-1"><Calendar size={12} className="text-yellow-500" /> {newsItem.date}</span>
              <span className="flex items-center gap-1"><Clock size={12} className="text-yellow-500" /> {newsItem.time}</span>
            </div>

            <h3 className="text-xl font-black text-white leading-tight">{newsItem.title}</h3>

            <div className="border-t border-white/5 pt-4">
              <p className="text-slate-350 text-xs font-semibold leading-relaxed whitespace-pre-line">
                {newsItem.content || newsItem.description}
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
