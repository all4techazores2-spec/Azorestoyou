import React, { useState, useEffect } from 'react';
import { Business, Language } from '../types';
import { X, MapPin, Info, Navigation, Phone, Mail, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ShopDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  shop: Business | null;
  language: Language;
  onViewCatalog: () => void;
  onShowMap?: (url: string) => void;
}

const ShopDetailModal: React.FC<ShopDetailModalProps> = ({
  isOpen,
  onClose,
  shop,
  language,
  onViewCatalog,
  onShowMap
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (!shop?.gallery || shop.gallery.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % shop.gallery!.length);
    }, 4000);

    return () => clearInterval(timer);
  }, [shop?.gallery]);

  if (!isOpen || !shop) return null;

  const gallery = shop.gallery && shop.gallery.length > 0 ? shop.gallery : [shop.image];

  const handleDirectionsClick = () => {
    const query = `${shop.name}, ${shop.island}, Azores`;
    const url = shop.mapsUrl || `https://maps.google.com/maps?q=${encodeURIComponent(query)}&output=embed`;
    if (onShowMap) {
      onShowMap(url);
      onClose();
    } else {
      window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`, '_blank');
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-55 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col z-10"
        >
          {/* Header Image Slider */}
          <div className="relative h-64 md:h-80 shrink-0 group">
            <div className="w-full h-full relative overflow-hidden bg-slate-100">
              <AnimatePresence mode="wait">
                <motion.img 
                  key={currentSlide}
                  src={gallery[currentSlide] || 'https://picsum.photos/800/600'} 
                  initial={{ opacity: 0, scale: 1.1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.5 }}
                  className="w-full h-full object-cover" 
                />
              </AnimatePresence>
              
              {/* Navigation Arrows for Gallery */}
              {gallery.length > 1 && (
                <>
                  <button 
                    onClick={(e) => { e.stopPropagation(); setCurrentSlide(prev => (prev - 1 + gallery.length) % gallery.length); }}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black/30 backdrop-blur-md text-white rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-black/50"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); setCurrentSlide(prev => (prev + 1) % gallery.length); }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black/30 backdrop-blur-md text-white rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-black/50"
                  >
                    <ChevronRight size={20} />
                  </button>
                  
                  {/* Dots Indicators */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
                    {gallery.map((_, i) => (
                      <div key={i} className={`h-1.5 rounded-full transition-all ${currentSlide === i ? 'w-4 bg-white' : 'w-1.5 bg-white/40'}`} />
                    ))}
                  </div>
                </>
              )}
            </div>

            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
            
            <button onClick={onClose} className="absolute top-6 right-6 z-50 p-3 bg-white text-slate-800 hover:bg-blue-600 hover:text-white rounded-full transition-all shadow-lg border border-slate-100 group">
              <X size={20} className="group-active:scale-90 transition-transform" />
            </button>

            <div className="absolute bottom-6 left-6 right-6 pointer-events-none text-left">
              <div className="flex items-center gap-2 text-white/90 text-sm font-medium mb-2">
                <MapPin className="w-4 h-4" /> {shop.concelho ? `${shop.concelho}, ` : ''}{shop.island}
              </div>
              <h2 className="text-3xl font-bold text-white uppercase tracking-tight">{shop.name}</h2>
            </div>
          </div>

          {/* Details Section */}
          <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
            {shop.isConfirmed !== false && (
              <div className="bg-blue-500/10 border border-blue-500/20 p-5 rounded-[1.75rem] flex items-start gap-3 text-blue-800 text-left">
                <span className="text-xl">✨</span>
                <div>
                  <h4 className="text-xs font-black uppercase tracking-wider text-blue-705">Negócio Recomendado</h4>
                  <p className="text-[11px] font-medium leading-relaxed mt-1 text-blue-600">
                    Esta loja regional está aberta na aplicação. Explore e reserve os seus produtos favoritos.
                  </p>
                </div>
              </div>
            )}

            <div className="space-y-4 text-left">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <Info className="w-5 h-5 text-blue-500" /> Informações
              </h3>
              <p className="text-slate-600 leading-relaxed">{shop.description || 'Nenhuma descrição disponível.'}</p>
              
              <div className="mt-4 flex flex-col gap-2">
                {shop.phone && (
                  <div className="flex items-center gap-2 text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <div className="p-1.5 bg-white rounded-lg shadow-sm"><Phone className="w-3.5 h-3.5 text-slate-400"/></div>
                    <span className="text-xs font-bold">{shop.phone}</span>
                  </div>
                )}
                {shop.publicEmail && (
                  <div className="flex items-center gap-2 text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <div className="p-1.5 bg-white rounded-lg shadow-sm"><Mail className="w-3.5 h-3.5 text-slate-400"/></div>
                    <span className="text-xs font-bold">{shop.publicEmail}</span>
                  </div>
                )}
                {shop.address && (
                  <div className="flex items-center gap-2 text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <div className="p-1.5 bg-white rounded-lg shadow-sm"><MapPin className="w-3.5 h-3.5 text-slate-400"/></div>
                    <span className="text-xs font-bold truncate">{shop.address}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-3">
              <button 
                onClick={onViewCatalog} 
                className="w-full py-4 bg-pink-600 hover:bg-pink-700 text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-pink-100 transition-all active:scale-[0.98]"
              >
                <Check className="w-5 h-5" /> Ver Artigos
              </button>
              <button 
                onClick={handleDirectionsClick} 
                className="w-full py-4 bg-slate-800 text-white hover:bg-slate-900 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg transition-all active:scale-[0.98]"
              >
                <Navigation className="w-5 h-5" /> Obter Direções
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ShopDetailModal;
