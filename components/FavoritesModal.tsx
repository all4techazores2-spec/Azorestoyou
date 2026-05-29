import React, { useState } from 'react';
import { Restaurant, Language, RestaurantUpdate } from '../types';
import { 
  X, Heart, CalendarCheck, Info, ChevronRight, ArrowLeft, 
  Star, MapPin, Bell, Phone, Mail, Map, Utensils, Sparkles, 
  ShoppingBag, Wrench, Car, BellRing, Tag, Calendar, AlertCircle
} from 'lucide-react';
import { COLORS } from '../constants';
import { getTranslation } from '../translations';
import { motion, AnimatePresence } from 'motion/react';
import RestaurantModal from './RestaurantModal';

interface FavoritesModalProps {
  isOpen: boolean;
  onClose: () => void;
  favoriteRestaurantIds: string[];
  restaurants: Restaurant[];
  language?: Language;
  onShowMap?: (url: string) => void;
}

const FavoritesModal: React.FC<FavoritesModalProps> = ({ 
  isOpen, 
  onClose, 
  favoriteRestaurantIds, 
  restaurants,
  language = 'pt',
  onShowMap
}) => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [bookingRestaurant, setBookingRestaurant] = useState<Restaurant | null>(null);
  const [ratingReservation, setRatingReservation] = useState<any | null>(null);
  const [ratingValue, setRatingValue] = useState(5);
  const [ratingNote, setRatingNote] = useState('');
  
  // Feed view filter for each business card: 'feed' | 'events' | 'prices'
  const [activeFeeds, setActiveFeeds] = useState<Record<string, 'feed' | 'events' | 'prices'>>({});

  if (!isOpen) return null;

  const currentLang = language as Language;
  const favoriteRestaurants = restaurants.filter(r => favoriteRestaurantIds.includes(r.id));

  const categoryGroups = [
    { id: 'restaurant', name: 'Restaurantes', icon: <Utensils className="w-5 h-5" />, color: 'from-orange-500 to-red-500', type: 'restaurant' },
    { id: 'beauty', name: 'Beleza & Estética', icon: <Sparkles className="w-5 h-5" />, color: 'from-pink-500 to-rose-500', type: 'beauty' },
    { id: 'shop', name: 'Lojas & Comércio', icon: <ShoppingBag className="w-5 h-5" />, color: 'from-purple-500 to-indigo-500', type: 'shop' },
    { id: 'services', name: 'Serviços Especializados', icon: <Wrench className="w-5 h-5" />, color: 'from-blue-500 to-cyan-500', type: 'services' },
    { id: 'auto_repair', name: 'Oficinas & Automóvel', icon: <Car className="w-5 h-5" />, color: 'from-red-500 to-orange-500', type: 'auto_repair' }
  ];

  // Helper to get category of restaurant/business
  const getBusinessCategory = (b: Restaurant) => {
    const type = b.businessType || 'restaurant';
    if (type === 'restaurant') return 'restaurant';
    if (type === 'beauty') return 'beauty';
    if (type === 'shop') return 'shop';
    if (type === 'services') return 'services';
    if (type === 'auto_repair') return 'auto_repair';
    return 'restaurant';
  };

  // Group favorites
  const groupedFavorites = favoriteRestaurants.reduce((acc, b) => {
    const cat = getBusinessCategory(b);
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(b);
    return acc;
  }, {} as Record<string, Restaurant[]>);

  const activeGroup = categoryGroups.find(g => g.id === activeCategory);
  const itemsInActiveCategory = activeCategory ? (groupedFavorites[activeCategory] || []) : [];

  const reservations = selectedRestaurant ? (selectedRestaurant.reservations || []) : [];
  const updates = selectedRestaurant ? (selectedRestaurant.updates || []) : [];

  const handleRate = () => {
    if (!ratingReservation || !selectedRestaurant) return;
    ratingReservation.hasRated = true;
    ratingReservation.rating = ratingValue;
    ratingReservation.reviewNote = ratingNote;
    setRatingReservation(null);
  };

  // Generate simulated updates if a favorite business has no custom updates
  const getSimulatedUpdates = (b: Restaurant): RestaurantUpdate[] => {
    if (b.updates && b.updates.length > 0) return b.updates;
    
    const cat = getBusinessCategory(b);
    if (cat === 'restaurant') {
      return [
        { id: `up1_${b.id}`, type: 'news', title: '🍲 Menu Executivo da Semana', description: 'Prato do dia + Bebida + Café por apenas 12,50€. Venha provar as nossas especialidades locais.', date: 'Hoje' },
        { id: `up2_${b.id}`, type: 'event', title: '🍷 Noite de Fados e Sabores', description: 'Nesta sexta-feira teremos uma noite de fado ao vivo com menu degustação especial.', date: 'Sexta-feira', pricePerPerson: 35 }
      ];
    } else if (cat === 'beauty') {
      return [
        { id: `up1_${b.id}`, type: 'news', title: '💆 Ritual de Massagem com Pedras Quentes', description: 'Novo tratamento de relaxamento profundo disponível. Reserve já a sua sessão de spa.', date: 'Ontem' },
        { id: `up2_${b.id}`, type: 'event', title: '💅 Workshop Auto-Maquilhagem de Verão', description: 'Aprenda os segredos da maquilhagem leve e iluminada com as nossas estilistas.', date: 'Próx. Sábado', pricePerPerson: 15 }
      ];
    } else if (cat === 'shop') {
      return [
        { id: `up1_${b.id}`, type: 'news', title: '🏷️ Promoção de Meio de Estação', description: 'Compre 2 artigos e leve o 3º de menor valor totalmente de oferta em toda a loja!', date: 'Esta semana' },
        { id: `up2_${b.id}`, type: 'news', title: '📦 Chegaram os novos Perfumes Artesanais', description: 'Uma seleção exclusiva de fragrâncias inspiradas na flora dos Açores já disponível nas prateleiras.', date: 'Ontem' }
      ];
    } else if (cat === 'services') {
      return [
        { id: `up1_${b.id}`, type: 'news', title: '🔧 Manutenção Preventiva de Climatização', description: 'Evite surpresas no verão! Agende a limpeza e recarga de AC doméstica com 10% de desconto.', date: 'Hoje' }
      ];
    } else {
      return [
        { id: `up1_${b.id}`, type: 'news', title: '🚗 Diagnóstico Geral de Segurança Grátis', description: 'Faça o check-up dos travões e suspensão sem qualquer custo ao realizar a mudança de óleo.', date: 'Esta semana' }
      ];
    }
  };

  // Generate simulated price changes
  const getSimulatedPriceChanges = (b: Restaurant) => {
    const cat = getBusinessCategory(b);
    if (cat === 'restaurant') {
      return [
        { name: 'Bife à Regional', oldPrice: 19.50, newPrice: 17.50, desc: '🔥 Preço Especial de Almoço' },
        { name: 'Prato do Dia (Peixe Fresco)', oldPrice: 15.00, newPrice: 13.00, desc: '🏷️ Promoção de Época' }
      ];
    } else if (cat === 'beauty') {
      return [
        { name: 'Manicure + Pedicure SPA', oldPrice: 45.00, newPrice: 35.00, desc: '✨ Pack Especial Relaxamento' },
        { name: 'Corte de Cabelo e Hidratação', oldPrice: 35.00, newPrice: 28.00, desc: '💇 Desconto de Quarta-feira' }
      ];
    } else if (cat === 'shop') {
      return [
        { name: 'Queijo de São Jorge DOP (Kgr)', oldPrice: 22.00, newPrice: 18.90, desc: '🧀 Oferta da Semana' },
        { name: 'Compota de Ananás Premium', oldPrice: 6.50, newPrice: 5.20, desc: '🍍 Desconto Especial Azores4you' }
      ];
    } else {
      return [
        { name: 'Lavagem Exterior + Aspiração', oldPrice: 25.00, newPrice: 19.90, desc: '🚿 Campanha de Fim de Semana' }
      ];
    }
  };

  const getFeedType = (bId: string) => activeFeeds[bId] || 'feed';
  const setFeedType = (bId: string, type: 'feed' | 'events' | 'prices') => {
    setActiveFeeds(prev => ({ ...prev, [bId]: type }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/40 backdrop-blur-sm sm:p-4 animate-in fade-in duration-300">
      <motion.div 
        initial={{ y: '100%', opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: '100%', opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="w-full sm:max-w-2xl bg-slate-50 h-[85vh] sm:h-[80vh] rounded-t-3xl sm:rounded-3xl shadow-2xl relative overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="bg-white px-6 py-4 border-b border-slate-100 flex items-center justify-between sticky top-0 z-10 shadow-sm">
          <div className="flex items-center gap-3">
            {selectedRestaurant ? (
              <button 
                onClick={() => setSelectedRestaurant(null)}
                className="p-2 hover:bg-slate-50 rounded-full transition-colors -ml-2"
              >
                <ArrowLeft className="w-5 h-5 text-slate-500" />
              </button>
            ) : activeCategory ? (
              <button 
                onClick={() => setActiveCategory(null)}
                className="p-2 hover:bg-slate-50 rounded-full transition-colors -ml-2"
              >
                <ArrowLeft className="w-5 h-5 text-slate-500" />
              </button>
            ) : (
              <div className="w-10 h-10 bg-red-50 text-red-500 rounded-full flex items-center justify-center shadow-inner">
                <Heart className="w-5 h-5 fill-current animate-pulse" />
              </div>
            )}
            <h2 className="text-xl font-black text-slate-800 tracking-tight uppercase">
              {selectedRestaurant 
                ? selectedRestaurant.name 
                : activeCategory 
                  ? `Favoritos - ${activeGroup?.name}` 
                  : 'Os meus Favoritos'}
            </h2>
          </div>
          <button 
            onClick={() => {
              setSelectedRestaurant(null);
              setActiveCategory(null);
              onClose();
            }}
            className="p-3 bg-slate-50 text-slate-800 hover:bg-red-500 hover:text-white rounded-full transition-all shadow-md border border-slate-100 group active:scale-95"
          >
            <X size={18} className="group-active:scale-90 transition-transform" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 custom-scrollbar bg-slate-50/50">
          <AnimatePresence mode="wait">
            {/* STEP 1: CATEGORY GRID */}
            {!activeCategory && !selectedRestaurant && (
              <motion.div
                key="categories"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="text-center sm:text-left">
                  <span className="text-[10px] font-black text-red-500 uppercase tracking-[0.22em] block">O seu Painel</span>
                  <h3 className="text-2xl font-black text-slate-800 tracking-tighter uppercase mt-1">Explorar por Categoria</h3>
                  <p className="text-xs text-slate-400 font-medium">Aceda ao feed de novidades e promoções dos seus locais favoritos.</p>
                </div>

                {favoriteRestaurants.length > 0 ? (
                  <div className="grid grid-cols-2 gap-4">
                    {categoryGroups.map(group => {
                      const count = (groupedFavorites[group.id] || []).length;
                      return (
                        <button
                          key={group.id}
                          onClick={() => setActiveCategory(group.id)}
                          className="bg-white p-5 rounded-[2rem] border border-slate-100 hover:border-slate-300 hover:shadow-xl transition-all duration-300 flex flex-col items-start gap-4 text-left relative group overflow-hidden shadow-sm"
                        >
                          <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${group.color} opacity-5 group-hover:scale-125 transition-transform duration-500 rounded-full blur-xl`}></div>
                          
                          <div className={`w-10 h-10 rounded-2xl bg-gradient-to-br ${group.color} text-white flex items-center justify-center shadow-lg`}>
                            {group.icon}
                          </div>
                          
                          <div className="space-y-1">
                            <h4 className="font-black text-slate-800 text-sm uppercase tracking-tight leading-none">{group.name}</h4>
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                              {count === 0 ? 'Sem favoritos' : count === 1 ? '1 Favorito' : `${count} Favoritos`}
                            </p>
                          </div>
                          
                          <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center self-end mt-2 text-slate-400 group-hover:bg-slate-900 group-hover:text-white transition-all shadow-sm">
                            <ChevronRight size={16} />
                          </div>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="py-20 text-center bg-white rounded-[3rem] border border-slate-100 shadow-sm">
                    <Heart className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-slate-600 mb-2">Ainda não tens favoritos</h3>
                    <p className="text-slate-400 max-w-xs mx-auto text-xs leading-normal">
                      Explora os estabelecimentos e toca no ícone de coração para os adicionares aos teus favoritos.
                    </p>
                  </div>
                )}
              </motion.div>
            )}

            {/* STEP 2: CATEGORY DETAIL WITH FEED */}
            {activeCategory && !selectedRestaurant && (
              <motion.div
                key="items-list"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                {itemsInActiveCategory.length > 0 ? (
                  <div className="space-y-6">
                    {itemsInActiveCategory.map(b => {
                      const feedType = getFeedType(b.id);
                      const simulatedFeeds = getSimulatedUpdates(b);
                      const priceChanges = getSimulatedPriceChanges(b);

                      return (
                        <div 
                          key={b.id}
                          className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden hover:shadow-xl transition-all duration-300"
                        >
                          {/* Business Header Card */}
                          <div 
                            onClick={() => setSelectedRestaurant(b)}
                            className="p-5 flex items-center gap-4 cursor-pointer hover:bg-slate-50/50 transition-colors border-b border-slate-50"
                          >
                            <div className="w-20 h-20 rounded-2xl overflow-hidden shadow-sm shrink-0">
                              <img src={b.image} alt={b.name} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-black text-slate-800 text-lg uppercase tracking-tight truncate leading-none mb-1.5">{b.name}</h3>
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5 mb-1.5">
                                <MapPin className="w-3.5 h-3.5 text-blue-500" /> {b.island} {b.cuisine ? `• ${b.cuisine}` : ''}
                              </p>
                              <div className="flex items-center gap-2">
                                <span className="flex items-center gap-0.5 text-xs font-bold text-yellow-500">
                                  <Star className="w-3.5 h-3.5 fill-current" /> {b.rating}
                                </span>
                                <span className="w-1.5 h-1.5 rounded-full bg-slate-200"></span>
                                <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">{b.reviews} Reviews</span>
                              </div>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-blue-600 hover:text-white transition-all shadow-sm">
                              <ChevronRight size={20} />
                            </div>
                          </div>

                          {/* Social Feed Tabs */}
                          <div className="bg-slate-50/50 px-5 py-3 border-b border-slate-50 flex gap-2">
                            {[
                              { id: 'feed', label: 'Feed', icon: <BellRing size={12} /> },
                              { id: 'events', label: 'Eventos', icon: <Calendar size={12} /> },
                              { id: 'prices', label: 'Preços', icon: <Tag size={12} /> }
                            ].map(tab => (
                              <button
                                key={tab.id}
                                onClick={() => setFeedType(b.id, tab.id as any)}
                                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all active:scale-95
                                  ${feedType === tab.id 
                                    ? 'bg-slate-900 text-white shadow-md' 
                                    : 'bg-white text-slate-400 hover:text-slate-600 border border-slate-100'}`}
                              >
                                {tab.icon}
                                {tab.label}
                              </button>
                            ))}
                          </div>

                          {/* Feed Tab Content */}
                          <div className="p-5 bg-white space-y-4 max-h-56 overflow-y-auto custom-scrollbar">
                            <AnimatePresence mode="wait">
                              {/* 1. NEWS FEED TAB */}
                              {feedType === 'feed' && (
                                <motion.div 
                                  key="feed-tab"
                                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                  className="space-y-3"
                                >
                                  {simulatedFeeds.filter(f => f.type === 'news').map(feed => (
                                    <div key={feed.id} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex gap-3 text-left">
                                      <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                                        <BellRing size={16} />
                                      </div>
                                      <div>
                                        <div className="flex justify-between items-center gap-2">
                                          <h5 className="font-bold text-xs text-slate-800 leading-tight">{feed.title}</h5>
                                          <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest shrink-0">{feed.date}</span>
                                        </div>
                                        <p className="text-xs text-slate-500 mt-1 leading-normal font-medium">{feed.description}</p>
                                      </div>
                                    </div>
                                  ))}
                                </motion.div>
                              )}

                              {/* 2. EVENTS TAB */}
                              {feedType === 'events' && (
                                <motion.div 
                                  key="events-tab"
                                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                  className="space-y-3"
                                >
                                  {simulatedFeeds.filter(f => f.type === 'event').length === 0 ? (
                                    <div className="text-center py-6 text-slate-400 text-[10px] font-black uppercase tracking-widest flex flex-col items-center gap-2">
                                      <Calendar size={24} className="opacity-30" />
                                      Sem eventos agendados de momento.
                                    </div>
                                  ) : (
                                    simulatedFeeds.filter(f => f.type === 'event').map(evt => (
                                      <div key={evt.id} className="p-4 bg-gradient-to-br from-amber-50 to-orange-50/40 border border-amber-100 rounded-2xl flex gap-3 text-left">
                                        <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                                          <Calendar size={16} />
                                        </div>
                                        <div className="flex-1">
                                          <div className="flex justify-between items-center gap-2">
                                            <h5 className="font-bold text-xs text-slate-800 leading-tight">{evt.title}</h5>
                                            <span className="text-[8px] font-black text-amber-500 uppercase tracking-widest shrink-0">{evt.date}</span>
                                          </div>
                                          <p className="text-xs text-slate-500 mt-1 leading-normal font-medium">{evt.description}</p>
                                          {evt.pricePerPerson && (
                                            <span className="inline-block mt-2 px-2.5 py-1 bg-white text-slate-800 rounded-lg text-[9px] font-black uppercase tracking-wider border border-amber-100 shadow-sm">
                                              Tarifa: €{evt.pricePerPerson} / pessoa
                                            </span>
                                          )}
                                        </div>
                                      </div>
                                    ))
                                  )}
                                </motion.div>
                              )}

                              {/* 3. PRICE CHANGES TAB */}
                              {feedType === 'prices' && (
                                <motion.div 
                                  key="prices-tab"
                                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                  className="space-y-3"
                                >
                                  {priceChanges.map((price, idx) => (
                                    <div key={idx} className="p-4 bg-emerald-50/50 border border-emerald-100 rounded-2xl flex items-center justify-between text-left">
                                      <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                                          <Tag size={16} />
                                        </div>
                                        <div>
                                          <h5 className="font-bold text-xs text-slate-800 leading-tight">{price.name}</h5>
                                          <p className="text-[10px] text-emerald-600 font-bold mt-0.5">{price.desc}</p>
                                        </div>
                                      </div>
                                      <div className="text-right">
                                        <span className="text-[9px] text-slate-400 font-bold line-through mr-1.5">€{price.oldPrice.toFixed(2)}</span>
                                        <span className="text-sm font-black text-emerald-600">€{price.newPrice.toFixed(2)}</span>
                                      </div>
                                    </div>
                                  ))}
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="py-20 text-center bg-white rounded-[3rem] border border-slate-100 shadow-sm">
                    <Heart className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-slate-600 mb-2">Sem favoritos nesta categoria</h3>
                    <p className="text-slate-400 max-w-xs mx-auto text-xs leading-normal">
                      Explore os estabelecimentos da categoria "{activeGroup?.name}" e adicione-os aos favoritos.
                    </p>
                  </div>
                )}
              </motion.div>
            )}

            {/* STEP 3: SPECIFIC BUSINESS DETAIL (Keep Existing reservations detail view) */}
            {selectedRestaurant && (
              <motion.div
                key="detail"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-8 pb-8 animate-in duration-300"
              >
                {/* Hero / Info Básica */}
                <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-100 flex flex-col sm:flex-row gap-6 items-start">
                  <div className="w-full sm:w-32 h-40 sm:h-32 rounded-2xl overflow-hidden shadow-md flex-shrink-0">
                     <img src={selectedRestaurant.image} alt={selectedRestaurant.name} className="w-full h-full object-cover animate-fade-in" />
                  </div>
                  <div className="flex-1">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-50 text-red-600 rounded-full text-xs font-bold mb-3">
                      <Heart className="w-3.5 h-3.5 fill-current" /> Favorito Azores4you
                    </div>
                    <p className="text-sm text-slate-600 leading-relaxed font-medium">
                      {selectedRestaurant.description}
                    </p>
                    
                    <div className="mt-5 space-y-2">
                      {selectedRestaurant.phone && (
                         <div className="flex items-center gap-3 text-slate-600">
                            <div className="p-2 bg-slate-50 rounded-lg"><Phone className="w-4 h-4 text-slate-400"/></div>
                            <span className="text-sm font-bold">{selectedRestaurant.phone}</span>
                         </div>
                      )}
                      {selectedRestaurant.publicEmail && (
                         <div className="flex items-center gap-3 text-slate-600">
                            <div className="p-2 bg-slate-50 rounded-lg"><Mail className="w-4 h-4 text-slate-400"/></div>
                            <span className="text-sm font-bold">{selectedRestaurant.publicEmail}</span>
                         </div>
                      )}
                      {selectedRestaurant.address && (
                         <div className="flex items-center gap-3 text-slate-600">
                            <div className="p-2 bg-slate-50 rounded-lg"><MapPin className="w-4 h-4 text-slate-400"/></div>
                            <span className="text-sm font-bold">{selectedRestaurant.address}</span>
                         </div>
                      )}
                    </div>
                    {(selectedRestaurant.mapsUrl || (selectedRestaurant.latitude && selectedRestaurant.longitude)) && (
                      <button 
                        onClick={() => {
                          const url = (selectedRestaurant.latitude && selectedRestaurant.longitude) 
                            ? `https://maps.google.com/?q=${selectedRestaurant.latitude},${selectedRestaurant.longitude}` 
                            : selectedRestaurant.mapsUrl;
                          if (url) {
                            if (onShowMap) {
                              onShowMap(url);
                            } else {
                              window.open(url, '_blank');
                            }
                          }
                        }} 
                        className="mt-5 w-full sm:w-auto px-6 py-3 bg-blue-50 text-blue-600 rounded-xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-blue-100 transition-colors"
                      >
                        <Map className="w-4 h-4" /> Direções no Google Maps
                      </button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Reservas do Utilizador */}
                  <div className="space-y-4">
                    <h4 className="font-black text-slate-800 flex items-center gap-2">
                      <CalendarCheck className="w-5 h-5 text-blue-500" /> Minhas Reservas
                    </h4>
                    <div className="space-y-3">
                      {reservations.length === 0 && (
                        <p className="text-sm text-slate-500">Ainda não fez reservas neste estabelecimento.</p>
                      )}
                      {reservations.map(res => (
                        <div key={res.id} 
                             className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden group cursor-pointer"
                             onClick={() => {
                               if (res.status === 'concluída' && !res.hasRated) {
                                 setRatingReservation(res);
                                 setRatingValue(5);
                                 setRatingNote('');
                               }
                             }}
                        >
                          <div className={`absolute left-0 top-0 bottom-0 w-1 ${res.status === 'concluída' ? 'bg-blue-500' : res.status === 'accepted' ? 'bg-green-500' : 'bg-amber-500'}`} />
                          <div className="flex justify-between items-start mb-2 pl-2">
                             <div>
                               <p className="text-sm font-bold text-slate-800">{res.date} às {res.time}</p>
                               <p className="text-xs text-slate-500">{res.guests} Pessoas</p>
                             </div>
                             <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-lg ${
                               res.status === 'concluída' ? 'bg-blue-50 text-blue-700' : 
                               res.status === 'accepted' ? 'bg-green-50 text-green-700' : 
                               'bg-amber-50 text-amber-700'
                             }`}>
                               {res.status}
                             </span>
                          </div>
                          {res.status === 'concluída' && !res.hasRated && (
                            <div className="pl-2 mt-3 pt-3 border-t border-slate-50">
                              <span className="text-xs font-bold text-blue-600 flex items-center gap-1 group-hover:text-blue-700">
                                <Star className="w-3.5 h-3.5" /> Avaliar Experiência
                              </span>
                            </div>
                          )}
                          {res.hasRated && (
                            <div className="pl-2 mt-3 pt-3 border-t border-slate-50 flex items-center gap-1 text-yellow-500">
                              <Star className="w-3.5 h-3.5 fill-current" />
                              <span className="text-xs font-bold">{res.rating} Estrelas</span>
                            </div>
                          )}
                        </div>
                      ))}
                      <button onClick={() => setBookingRestaurant(selectedRestaurant)} className="w-full py-3 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-xl text-xs font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-2 mt-4">
                        Nova Reserva <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Atualizações e Eventos */}
                  <div className="space-y-4">
                    <h4 className="font-black text-slate-800 flex items-center gap-2">
                      <Bell className="w-5 h-5 text-amber-500" /> Novidades
                    </h4>
                    <div className="space-y-3">
                      {updates.length === 0 && (
                        <p className="text-sm text-slate-500">Nenhuma novidade no momento.</p>
                      )}
                      {updates.map(update => (
                        <div key={update.id} className={`${update.type === 'event' ? 'bg-white' : 'bg-gradient-to-br from-amber-50 to-orange-50'} p-4 rounded-2xl border ${update.type === 'event' ? 'border-slate-100' : 'border-amber-100'} shadow-sm flex flex-col sm:flex-row items-start gap-4`}>
                          {update.image && (
                            <div className="w-full sm:w-24 h-24 rounded-xl overflow-hidden shadow-sm flex-shrink-0">
                               <img src={update.image} alt={update.title} className="w-full h-full object-cover" />
                            </div>
                          )}
                          <div className="flex-1">
                             <div className="flex items-center gap-2 mb-1">
                                <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-md ${update.type === 'event' ? 'bg-slate-100 text-blue-600' : 'bg-white text-amber-600 shadow-sm'}`}>
                                  {update.type === 'event' ? 'Evento' : 'Novidade'}
                                </span>
                                {update.date && <span className="text-xs font-bold text-slate-400">{update.date}</span>}
                             </div>
                             <p className="text-sm font-bold text-slate-800">{update.title}</p>
                             <p className="text-xs text-slate-600 mt-1">{update.description}</p>
                             {update.type === 'event' && (update.pricePerPerson || update.pricePerCouple) && (
                               <div className="flex gap-2 mt-3">
                                 {update.pricePerPerson > 0 && <span className="bg-slate-50 px-2 py-1 rounded-lg text-xs font-bold text-slate-600">€{update.pricePerPerson}/pax</span>}
                                 {update.pricePerCouple > 0 && <span className="bg-slate-50 px-2 py-1 rounded-lg text-xs font-bold text-slate-600">€{update.pricePerCouple}/casal</span>}
                                </div>
                             )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Restaurant Booking Modal Overlay */}
      {bookingRestaurant && (
         <div className="fixed inset-0 z-[60]">
            <RestaurantModal 
               restaurant={bookingRestaurant}
               onClose={() => setBookingRestaurant(null)}
               currentLanguage={currentLang}
               isAuthenticated={true}
               onShowAuth={() => {}}
               onBookTable={(res) => {
                 alert('Reserva efetuada com sucesso!');
                 setBookingRestaurant(null);
               }}
               onShowMap={onShowMap}
            />
         </div>
      )}

      {/* Rating Modal */}
      <AnimatePresence>
        {ratingReservation && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4">
             <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white rounded-[3rem] shadow-2xl p-8 max-w-md w-full">
                <div className="text-center mb-6">
                   <div className="w-16 h-16 bg-yellow-50 rounded-full flex items-center justify-center mx-auto mb-4 text-yellow-500">
                     <Star className="w-8 h-8 fill-current" />
                   </div>
                   <h3 className="text-2xl font-black text-slate-800 tracking-tight">Avaliar Experiência</h3>
                   <p className="text-slate-500 text-sm mt-2">Como foi a sua refeição em {selectedRestaurant?.name}?</p>
                </div>
                
                <div className="flex justify-center gap-2 mb-6">
                   {[1,2,3,4,5].map(star => (
                     <button key={star} onClick={() => setRatingValue(star)} className="p-2 transition-transform hover:scale-110 active:scale-95">
                       <Star className={`w-8 h-8 ${ratingValue >= star ? 'text-yellow-400 fill-current' : 'text-slate-200'}`} />
                     </button>
                   ))}
                </div>

                <div className="mb-6">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block pl-2">Comentário (Opcional)</label>
                   <textarea 
                     className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 font-medium text-sm focus:ring-2 focus:ring-yellow-400 outline-none h-24 custom-scrollbar"
                     placeholder="Diga-nos o que achou..."
                     value={ratingNote}
                     onChange={e => setRatingNote(e.target.value)}
                   />
                </div>

                <div className="flex gap-3">
                   <button onClick={() => setRatingReservation(null)} className="px-6 py-4 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-2xl font-black text-xs uppercase tracking-widest transition-colors">Cancelar</button>
                   <button onClick={handleRate} className="flex-1 py-4 bg-yellow-400 hover:bg-yellow-500 text-yellow-900 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-yellow-400/20 transition-colors">Enviar Avaliação</button>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FavoritesModal;
