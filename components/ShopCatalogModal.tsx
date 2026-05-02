import React, { useState, useEffect } from 'react';
import { Business, Language, Product } from '../types';
import { X, Map, PhoneCall, Layers, ArrowRight, Sparkles, ChevronLeft, ChevronRight, ShoppingBag, Dumbbell, Home, Maximize2 } from 'lucide-react';
import PanoramaViewer from './PanoramaViewer';
import { motion, AnimatePresence } from 'motion/react';

interface ShopCatalogModalProps {
  shop: Business | null;
  onClose: () => void;
  language?: Language;
}

const ShopCatalogModal: React.FC<ShopCatalogModalProps> = ({
  shop,
  onClose,
  language = 'pt'
}) => {
  const [currentBgSlide, setCurrentBgSlide] = useState(0);
  const [selectedProductIdx, setSelectedProductIdx] = useState<number | null>(null);
  const [showPanorama, setShowPanorama] = useState<string | null>(null);

  if (!shop) return null;

  const products = shop.products || [];
  const gallery = shop.gallery || (products.length > 0 ? products.map(p => p.image).slice(0, 5) : ['https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1200']);

  // Background slider effect
  useEffect(() => {
    if (gallery.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentBgSlide(prev => (prev + 1) % gallery.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [gallery.length]);

  const handleNextProduct = () => {
    if (selectedProductIdx === null || products.length === 0) return;
    setSelectedProductIdx((selectedProductIdx + 1) % products.length);
  };

  const handlePrevProduct = () => {
    if (selectedProductIdx === null || products.length === 0) return;
    setSelectedProductIdx((selectedProductIdx - 1 + products.length) % products.length);
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
      <motion.div 
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="bg-white rounded-none sm:rounded-[2.5rem] w-full max-w-5xl h-full sm:h-[90vh] overflow-hidden shadow-2xl flex flex-col relative"
      >
        {/* Close Button */}
        <button 
          onClick={onClose} 
          className="absolute top-6 right-6 z-50 p-2.5 bg-white/90 backdrop-blur-md text-slate-400 rounded-2xl hover:bg-white hover:text-slate-900 transition-all shadow-xl border border-slate-100"
        >
          <X size={20} />
        </button>

        <div className="flex-1 overflow-y-auto">
          {/* Header Area with Fade Slider */}
          <div className="relative h-[45vh] bg-slate-900 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentBgSlide}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.5 }}
                className="absolute inset-0"
              >
                <img src={gallery[currentBgSlide]} className="w-full h-full object-cover opacity-60 scale-105" alt="Shop Ambient" />
              </motion.div>
            </AnimatePresence>
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent" />
            
            <div className="absolute bottom-10 left-10 right-10 z-10 text-white">
              <div className="flex items-center gap-2 mb-2">
                 <span className="px-3 py-1 bg-blue-600 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-1">
                   <Sparkles size={10} /> Novidades em Destaque
                 </span>
              </div>
              <h2 className="text-4xl font-black uppercase tracking-tighter mb-2 drop-shadow-lg">{shop.name}</h2>
              <p className="text-sm font-bold text-white/70 tracking-widest uppercase flex items-center gap-2">
                <Map size={14} className="text-red-400" /> {shop.island} • {
                  shop.businessType === 'gyms' ? 'GINÁSIO' : 
                  shop.businessType === 'real_estate' ? 'IMOBILIÁRIA' : 
                  'LOJA REGIONAL'
                }
              </p>
            </div>
          </div>

          <div className="p-10 space-y-10">
            {/* Quick Stats & Actions */}
            <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between border-b border-slate-100 pb-10">
              <div className="max-w-md">
                 <h3 className="text-xs font-black text-slate-300 uppercase tracking-widest mb-2">Sobre</h3>
                 <p className="text-slate-500 font-bold leading-relaxed">{shop.description}</p>
              </div>
              <div className="flex gap-3">
                 {shop.phone && (
                   <button 
                     onClick={() => window.location.href=`tel:${shop.phone}`}
                     className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-[11px] tracking-widest hover:bg-blue-600 transition-all shadow-xl shadow-slate-200 flex items-center gap-3"
                   >
                     <PhoneCall size={18} /> Ligue Agora
                   </button>
                 )}
                 <button 
                   onClick={() => window.open(`https://maps.google.com/?q=${shop.latitude},${shop.longitude}`, '_blank')}
                   className="px-6 py-4 bg-slate-100 text-slate-600 rounded-2xl font-black uppercase text-[11px] tracking-widest hover:bg-slate-200 transition-all flex items-center gap-2"
                 >
                   <Map size={18} /> Direções
                 </button>
              </div>
            </div>

            {/* Catalog Grid View */}
            <div>
              <div className="flex items-center justify-between mb-8">
                 <div>
                   <h4 className="text-2xl font-black text-slate-800 uppercase tracking-tighter">
                     {shop.businessType === 'gyms' ? 'Instalações & Equipamento' : 
                      shop.businessType === 'real_estate' ? 'Casas & Apartamentos' :
                      'Artigos em Exposição'}
                   </h4>
                   <p className="text-xs font-bold text-slate-400">Toque para abrir o catálogo imersivo</p>
                 </div>
                 {products.length > 0 && (
                   <button 
                     onClick={() => setSelectedProductIdx(0)}
                     className="flex items-center gap-2 px-6 py-3 bg-blue-50 text-blue-600 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all border border-blue-100"
                   >
                     <Layers size={16} /> Ver Catálogo <ArrowRight size={16} />
                   </button>
                 )}
              </div>

              {products.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {products.map((product, idx) => (
                    <motion.div 
                      key={product.id} 
                      whileHover={{ y: -8 }}
                      onClick={() => setSelectedProductIdx(idx)}
                      className="bg-white rounded-[2rem] border border-slate-100 overflow-hidden shadow-sm hover:shadow-2xl transition-all group cursor-pointer"
                    >
                      <div className="relative aspect-square overflow-hidden bg-slate-50">
                        <img src={product.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={product.name} />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center">
                           <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all">
                             <ArrowRight size={20} className="text-blue-600" />
                           </div>
                        </div>
                        {shop.businessType !== 'gyms' && product.price > 0 && (
                          <div className="absolute top-4 right-4 px-3 py-1 bg-white/90 backdrop-blur-md rounded-xl text-[10px] font-black text-blue-600 shadow-sm">
                            {product.price}€
                          </div>
                        )}
                      </div>
                      <div className="p-6">
                        <h5 className="text-xs font-black text-slate-800 uppercase truncate mb-1">{product.name}</h5>
                        <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">{product.category || 'Regional'}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
                  <ShoppingBag size={48} className="mx-auto text-slate-300 mb-4" />
                  <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">Ainda não existem artigos listados</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* VIRTUAL CATALOG POPUP (SUB-MODAL) */}
        <AnimatePresence>
          {selectedProductIdx !== null && products[selectedProductIdx] && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-[60] bg-slate-900/95 backdrop-blur-xl flex items-center justify-center p-4 sm:p-10"
            >
              <button 
                onClick={() => setSelectedProductIdx(null)}
                className="absolute top-8 right-8 p-3 bg-white/10 text-white rounded-2xl hover:bg-white/20 transition-all border border-white/10"
              >
                <X size={24} />
              </button>

              <div className="flex flex-col md:flex-row items-center gap-10 w-full max-w-5xl">
                {/* Navigation Arrows (Desktop) */}
                <button 
                  onClick={handlePrevProduct}
                  className="hidden md:flex p-5 bg-white/10 text-white rounded-3xl hover:bg-white/20 transition-all border border-white/10 shadow-2xl"
                >
                  <ChevronLeft size={32} />
                </button>

                <div className="flex-1 flex flex-col md:flex-row items-center gap-12">
                   <motion.div 
                     key={`img-${products[selectedProductIdx].id}`}
                     initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
                     animate={{ opacity: 1, scale: 1, rotate: 0 }}
                     drag="x"
                     dragConstraints={{ left: 0, right: 0 }}
                     onDragEnd={(e, info) => {
                       if (info.offset.x > 100) handlePrevProduct();
                       else if (info.offset.x < -100) handleNextProduct();
                     }}
                     className="w-full md:w-[450px] aspect-square rounded-[3rem] overflow-hidden shadow-[0_35px_60px_-15px_rgba(0,0,0,0.5)] border-8 border-white/5 cursor-grab active:cursor-grabbing"
                   >
                     <img src={products[selectedProductIdx].image} className="w-full h-full object-cover pointer-events-none" alt="Product Large" />
                   </motion.div>

                   <motion.div 
                     key={`text-${products[selectedProductIdx].id}`}
                     initial={{ opacity: 0, x: 30 }}
                     animate={{ opacity: 1, x: 0 }}
                     className="flex-1 text-center md:text-left text-white space-y-6"
                   >
                      <div>
                        <span className="px-4 py-1 bg-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest mb-4 inline-block shadow-lg shadow-blue-900/40">
                          {shop.businessType === 'gyms' ? 'Equipamento Profissional' : 
                           shop.businessType === 'real_estate' ? 'Oportunidade Imobiliária' :
                           'Artigo Regional'}
                        </span>
                        <h3 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none mb-4">{products[selectedProductIdx].name}</h3>
                        <p className="text-lg md:text-xl text-white/60 font-bold leading-relaxed max-w-md mx-auto md:mx-0">{products[selectedProductIdx].description}</p>
                      </div>
                      
                      <div className="flex flex-col md:flex-row items-center gap-6 pt-6">
                        {shop.businessType !== 'gyms' && products[selectedProductIdx].price > 0 && (
                          <>
                            <div className="text-5xl font-black text-amber-400 drop-shadow-2xl">{products[selectedProductIdx].price}€</div>
                            <div className="h-10 w-[1px] bg-white/10 hidden md:block" />
                          </>
                        )}
                        <div className="flex flex-col items-center md:items-start opacity-50">
                           <span className="text-[10px] font-black uppercase tracking-widest">
                             {shop.businessType === 'gyms' ? 'Disponível no Ginásio' : 
                              shop.businessType === 'real_estate' ? 'Disponível na Agência' :
                              'Disponível em Loja'}
                           </span>
                           <span className="text-xs font-bold">{shop.name}</span>
                        </div>
                      </div>

                      {/* 360 TOUR BUTTON */}
                      {(products[selectedProductIdx] as any).panoramaUrl && (
                        <button 
                          onClick={() => setShowPanorama((products[selectedProductIdx] as any).panoramaUrl)}
                          className="w-full md:w-auto px-8 py-5 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-[2rem] font-black uppercase text-[11px] tracking-[0.2em] hover:scale-105 transition-all shadow-[0_20px_40px_-15px_rgba(37,99,235,0.5)] flex items-center justify-center gap-3 active:scale-95 group"
                        >
                          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center group-hover:rotate-12 transition-transform">
                             <Maximize2 size={16} />
                          </div>
                          Ver Tour 360° Imersivo
                        </button>
                      )}

                      {/* Mobile Navigation */}
                      <div className="flex md:hidden justify-center gap-4 pt-8">
                         <button onClick={handlePrevProduct} className="p-4 bg-white/10 rounded-2xl"><ChevronLeft size={24} /></button>
                         <button onClick={handleNextProduct} className="p-4 bg-white/10 rounded-2xl"><ChevronRight size={24} /></button>
                      </div>
                   </motion.div>
                </div>

                <button 
                  onClick={handleNextProduct}
                  className="hidden md:flex p-5 bg-white/10 text-white rounded-3xl hover:bg-white/20 transition-all border border-white/10 shadow-2xl"
                >
                  <ChevronRight size={32} />
                </button>
              </div>

              {/* Counter Indicator */}
              <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/40 text-[10px] font-black uppercase tracking-[0.3em]">
                {selectedProductIdx + 1} de {products.length} {shop.businessType === 'gyms' ? 'máquinas' : shop.businessType === 'real_estate' ? 'imóveis' : 'artigos'}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 360 VIEWER OVERLAY */}
        {showPanorama && (
          <PanoramaViewer 
            imagePath={showPanorama} 
            onClose={() => setShowPanorama(null)} 
          />
        )}
      </motion.div>
    </div>
  );
};


export default ShopCatalogModal;
