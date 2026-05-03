import React, { useState } from 'react';
import { X, Calendar, Clock, MapPin, CheckCircle, Navigation, Info, Users, ArrowRight, QrCode, Receipt, Star, UtensilsCrossed, Plane, Hotel, Car, ChevronLeft, Sparkles, ShoppingBag, Home, Camera, Bell, LogOut, Briefcase, Package as PackageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Restaurant, Itinerary } from '../types';
import RatingModal from './RatingModal';

interface MyReservationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  reservations: any[];
  restaurants: Restaurant[];
  itinerary: Itinerary;
  onCheckIn: (resId: string, restaurantId: string, tableId?: string) => void;
  onCheckOut: (resId: string, restaurantId: string, tableId?: string) => void;
  onTableAction?: (restaurantId: string, tableId: string, action: 'calling_waiter' | 'waiting_bill') => void;
  onAddItems?: (res: any) => void;
  onReview?: (data: any) => void;
  language: any;
}

const MyReservationsModal: React.FC<MyReservationsModalProps> = ({ 
  isOpen, 
  onClose, 
  reservations, 
  restaurants,
  itinerary,
  onCheckIn,
  onCheckOut,
  onTableAction,
  onAddItems,
  onReview,
  language
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [ratingTarget, setRatingTarget] = useState<any | null>(null);

  if (!isOpen) return null;

  const activeReservations = reservations.filter(r => ['pending', 'accepted', 'occupied'].includes(r.status));
  const historyReservations = reservations.filter(r => ['finished', 'cancelled'].includes(r.status));

  // Filter packages (reservations that have a packageId and are NOT restaurant/shop/beauty)
  const packageReservations = activeReservations.filter(r => r.packageId && (r.type === 'hotel' || r.type === 'al' || r.type === 'car' || r.type === 'flight'));
  
  // Group by packageId
  const packagesMap = packageReservations.reduce((acc: any, res) => {
    if (!acc[res.packageId]) acc[res.packageId] = [];
    acc[res.packageId].push(res);
    return acc;
  }, {});

  const packagesList = Object.keys(packagesMap).map(id => ({
    id,
    items: packagesMap[id],
    date: packagesMap[id][0].date,
    status: packagesMap[id].every((r: any) => r.status === 'accepted') ? 'accepted' : 'pending'
  }));

  const restaurantReservations = activeReservations.filter(r => r.type === 'restaurant');
  const beautyReservations = activeReservations.filter(r => r.type === 'beauty');
  const shopReservations = activeReservations.filter(r => r.type === 'shop');
  const hotelReservations = activeReservations.filter(r => r.type === 'hotel' && !r.packageId);
  const alReservations = activeReservations.filter(r => r.type === 'al' && !r.packageId);
  const carReservations = activeReservations.filter(r => r.type === 'car' && !r.packageId);
  const flightReservations = activeReservations.filter(r => r.type === 'flight' && !r.packageId);
  const landscapeReservations = activeReservations.filter(r => r.type === 'landscape');

  const categories = [
    { id: 'packages', label: 'Pacotes', icon: <Briefcase size={24} />, count: packagesList.length, color: 'from-blue-600 to-indigo-700', shadow: 'shadow-blue-600/20' },
    { id: 'history', label: 'Histórico', icon: <Clock size={24} />, count: historyReservations.length, color: 'from-slate-600 to-slate-800', shadow: 'shadow-slate-500/20' },
    { id: 'restaurants', label: 'Restaurantes', icon: <UtensilsCrossed size={24} />, count: restaurantReservations.length, color: 'from-emerald-500 to-teal-600', shadow: 'shadow-emerald-500/20' },
    { id: 'landscapes', label: 'Paisagens', icon: <Camera size={24} />, count: landscapeReservations.length, color: 'from-orange-400 to-rose-500', shadow: 'shadow-orange-500/20' },
    { id: 'hotels', label: 'Hotéis', icon: <Hotel size={24} />, count: hotelReservations.length, color: 'from-amber-500 to-orange-600', shadow: 'shadow-amber-500/20' },
    { id: 'al', label: 'Alojamento Local', icon: <Home size={24} />, count: alReservations.length, color: 'from-blue-400 to-blue-600', shadow: 'shadow-blue-500/20' },
    { id: 'beauty', label: 'Beleza & Bem-Estar', icon: <Sparkles size={24} />, count: beautyReservations.length, color: 'from-fuchsia-500 to-pink-600', shadow: 'shadow-fuchsia-500/20' },
    { id: 'shops', label: 'Lojas & Comércio', icon: <ShoppingBag size={24} />, count: shopReservations.length, color: 'from-indigo-500 to-violet-600', shadow: 'shadow-indigo-500/20' },
    { id: 'flights', label: 'Voos', icon: <Plane size={24} />, count: flightReservations.length, color: 'from-blue-500 to-indigo-600', shadow: 'shadow-blue-500/20' },
    { id: 'cars', label: 'Aluguer de Carros', icon: <Car size={24} />, count: carReservations.length, color: 'from-rose-500 to-pink-600', shadow: 'shadow-rose-500/20' },
  ].filter(cat => cat.count > 0 || cat.id === 'history' || cat.id === 'packages');

  const handleBack = () => setSelectedCategory(null);

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 md:p-6 bg-slate-900/40 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 30 }}
        className="w-full max-w-xl bg-white/90 backdrop-blur-xl rounded-[3rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.2)] relative overflow-hidden flex flex-col max-h-[90vh] border border-white"
      >
        {/* Decorative background glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-100/50 rounded-full blur-3xl -mr-32 -mt-32 z-0"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-100/50 rounded-full blur-3xl -ml-32 -mb-32 z-0"></div>

        <div className="relative z-10 p-8 border-b border-slate-100/50 flex items-center justify-between">
          <div className="flex items-center gap-5">
            {selectedCategory ? (
               <button 
                 onClick={handleBack}
                 className="w-12 h-12 bg-slate-100 hover:bg-slate-200 rounded-2xl flex items-center justify-center transition-all active:scale-90"
               >
                 <ChevronLeft size={24} className="text-slate-600" />
               </button>
            ) : (
              <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-[1.5rem] flex items-center justify-center text-white shadow-xl shadow-emerald-500/30 ring-4 ring-emerald-50">
                <Calendar size={28} />
              </div>
            )}
            <div className="text-left">
              <h2 className="text-2xl font-black text-slate-800 tracking-tight">
                {selectedCategory ? categories.find(c => c.id === selectedCategory)?.label : 'Os Meus Momentos'}
              </h2>
              <p className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em] mt-0.5">
                {selectedCategory ? `Reservas em ${categories.find(c => c.id === selectedCategory)?.label}` : 'Gestão de Reservas e Experiências'}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="absolute top-8 right-8 z-50 p-3 bg-white text-slate-800 hover:bg-blue-600 hover:text-white rounded-full transition-all shadow-lg border border-slate-100 group"
          >
            <X size={20} className="group-active:scale-90 transition-transform" />
          </button>
        </div>

        <div className="relative z-10 flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar text-left">
          <AnimatePresence mode="wait">
            {!selectedCategory ? (
              <motion.div 
                key="categories"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="grid grid-cols-1 gap-4 py-4"
              >
                {categories.length > 0 ? (
                  categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className="group flex items-center justify-between p-6 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:border-blue-100 transition-all duration-300"
                    >
                      <div className="flex items-center gap-6">
                        <div className={`w-16 h-16 bg-gradient-to-br ${cat.color} rounded-3xl flex items-center justify-center text-white shadow-lg ${cat.shadow} group-hover:scale-110 transition-transform`}>
                          {cat.icon}
                        </div>
                        <div className="text-left">
                          <h3 className="font-black text-xl text-slate-800 tracking-tight">{cat.label}</h3>
                          <p className="text-xs font-bold text-slate-400 mt-1">
                            {cat.id === 'history' ? (cat.count === 1 ? '1 experiência anterior' : `${cat.count} experiências anteriores`) : 
                             (cat.count === 1 ? '1 reserva ativa' : `${cat.count} reservas ativas`)}
                          </p>
                        </div>
                      </div>
                      <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
                        <ArrowRight size={20} />
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="py-24 text-center">
                    <div className="w-24 h-24 bg-slate-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6 relative">
                      <Calendar size={48} className="text-slate-200" />
                      <div className="absolute top-0 right-0 w-6 h-6 bg-blue-500 rounded-full border-4 border-white"></div>
                    </div>
                    <h3 className="text-xl font-black text-slate-800 mb-2">Sem planos por agora?</h3>
                    <p className="text-slate-400 font-bold max-w-xs mx-auto text-sm leading-relaxed">As suas reservas e experiências aparecerão aqui.</p>
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div 
                key="items"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                {/* RESTAURANTS, BEAUTY, SHOPS, LANDSCAPES ITEMS VIEW */}
                {['restaurants', 'beauty', 'shops', 'landscapes'].includes(selectedCategory!) && (
                  selectedCategory === 'restaurants' ? restaurantReservations : 
                  selectedCategory === 'beauty' ? beautyReservations : 
                  selectedCategory === 'shops' ? shopReservations :
                  landscapeReservations
                ).map((res) => {
                  const rest = restaurants.find(r => r.id === res.restaurantId || r.name === res.restaurantName);
                  const isBeautyRes = res.type === 'beauty';
                  const isShopRes = res.type === 'shop';
                  const isLandscapeRes = res.type === 'landscape';
                  
                  const statusConfig = {
                    pending: { label: 'Pendente', color: 'bg-amber-500', bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-100' },
                    accepted: { label: isBeautyRes ? 'Agendada' : isLandscapeRes ? 'Confirmada' : 'Confirmada', color: 'bg-emerald-500', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-100' },
                    occupied: { label: isBeautyRes ? 'Em Serviço' : isLandscapeRes ? 'Em Atividade' : 'Em Experiência', color: 'bg-blue-500', bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-100' },
                    cancelled: { label: 'Cancelada', color: 'bg-red-500', bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-100' },
                    finished: { label: 'Concluída', color: 'bg-slate-800', bg: 'bg-slate-100', text: 'text-slate-600', border: 'border-slate-200' }
                  };
                  const config = statusConfig[res.status as keyof typeof statusConfig] || statusConfig.pending;

                  return (
                    <div key={res.id} className="group relative bg-white rounded-[2.5rem] border border-slate-100 p-6 shadow-sm hover:shadow-md transition-all text-left">
                      <div className="flex justify-between items-start gap-4 mb-6">
                        <div className="flex-1 text-left">
                          <div className="flex items-center gap-3 mb-2">
                             <div className={`w-2 h-2 rounded-full ${config.color} animate-pulse`}></div>
                             <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${config.bg} ${config.text} ${config.border}`}>
                               {config.label}
                             </span>
                             {res.paymentType && (
                               <span className="bg-slate-100 text-slate-500 text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest border border-slate-200">
                                 {res.paymentType === 'points' ? 'Créditos' : res.paymentType === 'mbway' ? 'MBWay' : 'Presencial'}
                               </span>
                             )}
                          </div>
                          <h3 className="font-black text-xl text-slate-800 tracking-tight group-hover:text-blue-600 transition-colors leading-tight">
                            {res.itemName || rest?.name || res.restaurantName}
                          </h3>
                          <p className="text-xs text-slate-400 font-bold flex items-center gap-1.5 mt-1.5">
                            <MapPin size={12} /> {isLandscapeRes ? 'Açores' : (rest?.island || 'Açores')}
                          </p>
                        </div>
                        <div className="bg-slate-50 px-4 py-2 rounded-2xl border border-slate-100 text-right min-w-[80px]">
                           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{res.date}</p>
                           <p className="text-xl font-black text-slate-900">{res.time}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 py-5 border-y border-slate-50 mb-6 text-left">
                        <div className="flex items-center gap-3">
                           <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
                              <Users size={18} />
                           </div>
                           <div className="text-left">
                              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Titular</p>
                              <p className="text-sm font-black text-slate-700 truncate max-w-[120px]">{res.customerName}</p>
                           </div>
                        </div>
                        <div className="flex items-center gap-3">
                           <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
                              {isLandscapeRes ? <Camera size={18} /> : isBeautyRes ? <Sparkles size={18} /> : <Receipt size={18} />}
                           </div>
                           <div className="text-left">
                              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Tipo</p>
                              <p className="text-sm font-black text-slate-700">{isLandscapeRes ? 'Atividade' : isBeautyRes ? 'Beleza' : 'Reserva'}</p>
                           </div>
                        </div>
                      </div>

                      {res.status === 'accepted' && (
                        <div className="space-y-3">
                           {isLandscapeRes ? (
                             <button 
                               className="w-full py-5 bg-gradient-to-r from-orange-500 to-rose-600 text-white rounded-2xl font-black uppercase text-xs tracking-[0.2em] hover:shadow-lg hover:shadow-orange-500/30 transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
                             >
                               <Navigation size={18} /> Ver Direções do Trilho
                             </button>
                           ) : (
                             <>
                               {!isBeautyRes && !isShopRes && (
                                 <button 
                                   onClick={() => onAddItems?.(res)}
                                   className="w-full py-4 bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 rounded-2xl font-black uppercase text-xs tracking-widest transition-all flex items-center justify-center gap-2 shadow-sm"
                                 >
                                   <UtensilsCrossed size={16} /> Fazer Pedido Antecipado
                                 </button>
                               )}
                               <button 
                                 onClick={() => onCheckIn(res.id, res.restaurantId || '', res.tableId)}
                                 className="w-full py-5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-2xl font-black uppercase text-xs tracking-[0.2em] hover:shadow-lg hover:shadow-emerald-500/30 transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
                               >
                                 <CheckCircle size={18} /> {isBeautyRes ? 'Já cheguei ao Salão' : isShopRes ? 'Já cheguei à Loja' : 'Já cheguei ao Restaurante'}
                               </button>
                             </>
                           )}
                        </div>
                      )}

                      {res.status === 'occupied' && (
                        <div className="space-y-4">
                           {/* Row for Staff and Menu Actions */}
                           <div className="grid grid-cols-2 gap-3">
                             <button 
                               onClick={() => onTableAction?.(res.restaurantId, res.tableId, 'calling_waiter')}
                               className="py-4 bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all flex items-center justify-center gap-2"
                             >
                               <Bell size={16} /> Chamar Staff
                             </button>
                             <button 
                               onClick={() => onAddItems?.(res)}
                               className="py-4 bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all flex items-center justify-center gap-2"
                             >
                               <UtensilsCrossed size={16} /> Novo Pedido
                             </button>
                           </div>

                           {/* Request Bill Button */}
                           <button 
                             onClick={() => onTableAction?.(res.restaurantId, res.tableId, 'waiting_bill')}
                             className="w-full py-4 bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100 rounded-2xl font-black uppercase text-xs tracking-widest transition-all flex items-center justify-center gap-2"
                           >
                             <Receipt size={18} /> Pedir a Conta
                           </button>

                           {/* Checkout Button */}
                           <button 
                             onClick={() => onCheckOut(res.id, res.restaurantId, res.tableId)}
                             className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black uppercase text-xs tracking-[0.2em] hover:bg-red-600 transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
                           >
                             <LogOut size={18} /> Fechar Conta & Sair
                           </button>
                        </div>
                      )}

                      {res.status === 'finished' && !res.reviewed && (
                         <div className="pt-4">
                           <button 
                             onClick={() => setRatingTarget(res)}
                             className="w-full bg-yellow-400 hover:bg-yellow-500 text-slate-900 h-14 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 transition-all shadow-xl shadow-yellow-400/20 active:scale-95"
                           >
                             <Star size={20} className="fill-slate-900" />
                             Avaliar Experiência
                           </button>
                         </div>
                      )}
                    </div>
                  );
                })}

                {/* NO ITEMS PLACEHOLDER */}
                {['restaurants', 'beauty', 'shops', 'landscapes'].includes(selectedCategory!) && (
                  selectedCategory === 'restaurants' ? restaurantReservations : 
                  selectedCategory === 'beauty' ? beautyReservations : 
                  selectedCategory === 'shops' ? shopReservations :
                  landscapeReservations
                ).length === 0 && (
                   <div className="py-12 text-center bg-slate-50 rounded-[2.5rem] border border-dashed border-slate-200">
                     {selectedCategory === 'restaurants' ? <UtensilsCrossed size={48} className="mx-auto mb-4 text-slate-200" /> : 
                      selectedCategory === 'beauty' ? <Sparkles size={48} className="mx-auto mb-4 text-slate-200" /> : 
                      selectedCategory === 'landscapes' ? <Camera size={48} className="mx-auto mb-4 text-slate-200" /> :
                      <ShoppingBag size={48} className="mx-auto mb-4 text-slate-200" />}
                     <p className="text-slate-400 font-black uppercase text-xs tracking-widest">Sem {selectedCategory === 'beauty' ? 'marcações' : 'reservas'} ativas no momento</p>
                   </div>
                )}

                {/* HISTORY VIEW */}
                {selectedCategory === 'history' && historyReservations.map((res) => {
                  const rest = restaurants.find(r => r.id === res.restaurantId || r.name === res.restaurantName);
                  return (
                    <div key={res.id} className="bg-white rounded-[2.5rem] border border-slate-100 p-6 shadow-sm overflow-hidden relative group">
                      {res.status === 'cancelled' && (
                        <div className="absolute inset-0 bg-slate-50/50 backdrop-blur-[1px] z-10 flex items-center justify-center">
                           <span className="bg-red-100 text-red-600 px-6 py-2 rounded-full font-black uppercase text-[10px] tracking-[0.2em] border border-red-200 rotate-12">Cancelada</span>
                        </div>
                      )}
                      
                      <div className="flex justify-between items-start mb-4">
                         <div className="text-left">
                            <h3 className="font-black text-lg text-slate-800">{rest?.name || res.restaurantName}</h3>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">{res.date} {res.time ? `• ${res.time}` : ''}</p>
                         </div>
                         {res.earnedCredits && (
                           <div className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-xl text-[10px] font-black border border-emerald-100">
                             +{res.earnedCredits} Créditos
                           </div>
                         )}
                      </div>

                      <div className="flex items-center gap-4 py-4 border-t border-slate-50">
                         {res.reviewed ? (
                           <div className="flex-1 text-left">
                              <div className="flex items-center gap-1 mb-1">
                                {[1, 2, 3, 4, 5].map(star => (
                                  <Star key={star} size={12} className={star <= (res.rating || 0) ? 'fill-yellow-400 text-yellow-400' : 'text-slate-200'} />
                                ))}
                              </div>
                              <p className="text-xs text-slate-500 font-medium line-clamp-2 italic">"{res.reviewNote || 'Sem comentário'}"</p>
                           </div>
                         ) : res.status === 'finished' ? (
                           <button 
                             onClick={() => setRatingTarget(res)}
                             className="flex-1 py-3 bg-yellow-400 text-slate-900 rounded-xl font-black uppercase text-[10px] tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-yellow-400/20 flex items-center justify-center gap-2"
                           >
                             <Star size={14} className="fill-slate-900" /> Avaliar Experiência
                           </button>
                         ) : (
                           <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Reserva concluída</p>
                         )}
                      </div>
                    </div>
                  );
                })}

                {selectedCategory === 'history' && historyReservations.length === 0 && (
                   <div className="py-12 text-center bg-slate-50 rounded-[2.5rem] border border-dashed border-slate-200">
                     <Clock size={48} className="mx-auto mb-4 text-slate-200" />
                     <p className="text-slate-400 font-black uppercase text-xs tracking-widest">Ainda não tem histórico de visitas</p>
                   </div>
                )}

                {/* FLIGHTS VIEW */}
                {selectedCategory === 'flights' && flightReservations.map((res) => (
                   <div key={res.id} className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm text-left mb-6 last:mb-0">
                      <div className="flex justify-between items-center mb-8">
                         <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                               <Plane size={24} />
                            </div>
                            <div className="text-left">
                               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{res.flight.airline}</p>
                               <h3 className="text-xl font-black text-slate-800 tracking-tight">{res.flight.flightNumber}</h3>
                            </div>
                         </div>
                         <div className="px-4 py-1.5 bg-blue-50 text-blue-700 rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-100">
                            Confirmado
                         </div>
                      </div>

                      <div className="flex justify-between items-center gap-6 mb-8 relative">
                         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[2px] bg-slate-50 z-0"></div>
                         <div className="relative z-10 bg-white pr-4 text-left">
                            <p className="text-3xl font-black text-slate-900">{res.flight.origin}</p>
                            <p className="text-xs font-bold text-slate-400 mt-1">{res.flight.departureTime}</p>
                         </div>
                         <div className="relative z-10 bg-white px-3 text-blue-500">
                            <Plane size={20} className="rotate-90" />
                         </div>
                         <div className="relative z-10 bg-white pl-4 text-right">
                            <p className="text-3xl font-black text-slate-900">{res.flight.destination}</p>
                            <p className="text-xs font-bold text-slate-400 mt-1">{res.flight.arrivalTime}</p>
                         </div>
                      </div>
                      
                      <div className="bg-slate-50 p-4 rounded-2xl flex items-center justify-center gap-2">
                         <QrCode size={16} className="text-slate-400" />
                         <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Ver Cartão de Embarque</span>
                      </div>
                   </div>
                ))}

                {/* HOTELS & AL VIEW */}
                {(selectedCategory === 'hotels' || selectedCategory === 'al') && (selectedCategory === 'hotels' ? hotelReservations : alReservations).map((res) => (
                   <div key={res.id} className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-sm text-left mb-6 last:mb-0">
                      <div className="h-40 relative">
                         <img src={res.hotel.image} alt={res.hotel.name} className="w-full h-full object-cover" />
                         <div className="absolute top-4 right-4 px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest text-emerald-600 shadow-lg">
                            Reserva Ativa
                         </div>
                      </div>
                      <div className="p-8 text-left">
                         <h3 className="text-2xl font-black text-slate-800 tracking-tight mb-2">{res.hotel.name}</h3>
                         <p className="text-xs text-slate-400 font-bold flex items-center gap-1.5 mb-6">
                            <MapPin size={14} /> {res.hotel.island}, Açores
                         </p>
                         <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-left">
                               <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Check-in</p>
                               <p className="text-sm font-black text-slate-800">{res.date}</p>
                            </div>
                            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-left">
                               <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Estadia</p>
                               <p className="text-sm font-black text-slate-800">{(res?.nights || 0)} noites</p>
                            </div>
                         </div>
                         {res.selectedRoom && (
                            <div className="mt-4 p-4 bg-blue-50 rounded-2xl border border-blue-100">
                               <p className="text-[9px] font-black text-blue-600 uppercase tracking-widest mb-1">Quarto Selecionado</p>
                               <p className="text-sm font-black text-blue-800">{res.selectedRoom.name}</p>
                            </div>
                         )}
                      </div>
                   </div>
                ))}

                {/* PACKAGES VIEW */}
                {selectedCategory === 'packages' && packagesList.map((pkg) => (
                   <div key={pkg.id} className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-sm text-left mb-6 last:mb-0">
                      <div className="bg-slate-900 p-6 flex justify-between items-center">
                         <div className="flex items-center gap-3 text-white">
                            <Briefcase size={20} className="text-blue-400" />
                            <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Pacote de Viagem</span>
                         </div>
                         <div className="bg-blue-600 text-white px-3 py-1 rounded-full text-[10px] font-black tracking-widest border border-blue-500">
                            {pkg.id}
                         </div>
                      </div>
                      
                      <div className="p-6 space-y-4">
                         {pkg.items.map((item: any) => (
                            <div key={item.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                               <div className="flex items-center gap-4">
                                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-400 shadow-sm">
                                     {item.type === 'car' ? <Car size={18} /> : item.type === 'flight' ? <Plane size={18} /> : <Hotel size={18} />}
                                  </div>
                                  <div className="text-left">
                                     <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">
                                        {item.type === 'car' ? `Rent-a-car (${item.companyName || 'Auto Açores'})` : item.type === 'flight' ? 'Voo' : 'Alojamento'}
                                     </p>
                                     <p className="text-sm font-black text-slate-800 leading-tight">
                                        {item.type === 'car' ? item.car.model : item.type === 'flight' ? `${item.flight.origin} → ${item.flight.destination}` : item.hotel.name}
                                     </p>
                                  </div>
                               </div>
                               <div className="flex items-center gap-2">
                                  <div className={`w-1.5 h-1.5 rounded-full ${item.status === 'accepted' ? 'bg-emerald-500' : 'bg-amber-500'} animate-pulse`} />
                                  <span className={`text-[10px] font-black uppercase tracking-widest ${item.status === 'accepted' ? 'text-emerald-600' : 'text-amber-600'}`}>
                                     {item.status === 'accepted' ? 'Confirmado' : 'Em Aprovação'}
                                  </span>
                               </div>
                            </div>
                         ))}
                      </div>

                      <div className="px-6 pb-6 pt-2">
                         <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                               <PackageIcon size={16} className="text-blue-500" />
                               <span className="text-[10px] font-black text-blue-700 uppercase tracking-widest">Estado Geral do Pacote</span>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${pkg.status === 'accepted' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                               {pkg.status === 'accepted' ? 'Reserva Finalizada' : 'Aguardar Aprovação'}
                            </span>
                         </div>
                      </div>
                   </div>
                ))}

                {selectedCategory === 'packages' && packagesList.length === 0 && (
                   <div className="py-24 text-center">
                     <div className="w-24 h-24 bg-slate-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6 relative">
                       <Briefcase size={48} className="text-slate-200" />
                       <div className="absolute top-0 right-0 w-6 h-6 bg-blue-500 rounded-full border-4 border-white"></div>
                     </div>
                     <h3 className="text-xl font-black text-slate-800 mb-2">Ainda não tem pacotes?</h3>
                     <p className="text-slate-400 font-bold max-w-xs mx-auto text-sm leading-relaxed">Reserve Hotel + Carro para criar o seu primeiro pacote de viagem.</p>
                   </div>
                )}

                {/* CARS VIEW */}
                {selectedCategory === 'cars' && carReservations.map((res) => (
                   <div key={res.id} className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm text-left mb-6 last:mb-0">
                      <div className="flex justify-between items-start mb-6">
                         <div className="text-left">
                            <h3 className="text-2xl font-black text-slate-800 tracking-tight">{res.car.model}</h3>
                            <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-widest">{res.car.type}</p>
                         </div>
                         <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-rose-500">
                            <Car size={32} />
                         </div>
                      </div>
                      <div className="h-32 mb-6">
                         <img src={res.car.image} alt={res.car.model} className="w-full h-full object-contain mx-auto" />
                      </div>
                      <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 space-y-4">
                         <div className="flex justify-between items-center">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Data</span>
                            <span className="text-sm font-black text-slate-800">{res.date}</span>
                         </div>
                         <div className="flex justify-between items-center">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Duração</span>
                            <span className="text-sm font-black text-slate-800">{res.days} dias</span>
                         </div>
                      </div>
                   </div>
                ))}


              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer info */}
        <div className="relative z-10 p-6 bg-slate-50/50 border-t border-slate-100/50 flex items-center justify-center gap-6">
           <div className="flex items-center gap-2">
              <Star size={14} className="text-yellow-500 fill-current" />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Acumule Créditos</span>
           </div>
           <div className="w-1 h-1 bg-slate-300 rounded-full"></div>
           <div className="flex items-center gap-2">
              <Clock size={14} className="text-blue-500" />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Suporte 24h</span>
           </div>
        </div>
        {ratingTarget && (
          <RatingModal
            isOpen={!!ratingTarget}
            onClose={() => setRatingTarget(null)}
            restaurantName={ratingTarget.restaurantName}
            restaurantId={ratingTarget.restaurantId}
            reservationId={ratingTarget.id}
            onSubmit={(data) => {
              if (onReview) onReview(data);
              setRatingTarget(null);
            }}
            language={language}
          />
        )}
      </motion.div>
    </div>
  );
};

export default MyReservationsModal;
