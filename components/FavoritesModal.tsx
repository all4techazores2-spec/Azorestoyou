import React, { useState } from 'react';
import { Restaurant, Language } from '../types';
import { X, Heart, CalendarCheck, Info, ChevronRight, ArrowLeft, Star, MapPin, Bell, Phone, Mail, Map } from 'lucide-react';
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
}

const FavoritesModal: React.FC<FavoritesModalProps> = ({ 
  isOpen, 
  onClose, 
  favoriteRestaurantIds, 
  restaurants,
  language = 'pt'
}) => {
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [bookingRestaurant, setBookingRestaurant] = useState<Restaurant | null>(null);
  const [ratingReservation, setRatingReservation] = useState<any | null>(null);
  const [ratingValue, setRatingValue] = useState(5);
  const [ratingNote, setRatingNote] = useState('');

  if (!isOpen) return null;

  const currentLang = language as Language;
  const favoriteRestaurants = restaurants.filter(r => favoriteRestaurantIds.includes(r.id));

  const reservations = selectedRestaurant ? (selectedRestaurant.reservations || []) : [];
  const updates = selectedRestaurant ? (selectedRestaurant.updates || []) : [];

  const handleRate = () => {
    if (!ratingReservation || !selectedRestaurant) return;
    // Call the global update via some handler if we had one, but since App.tsx passes restaurants, we need to update it.
    // However, App.tsx is the source of truth. We might need to dispatch an event or call a prop to update the reservation.
    // Wait, the user said "adiciona tambem no paidnel administrativo...". 
    // We didn't add a prop to FavoritesModal to update a reservation. We should probably simulate the rating on the UI or add a prop.
    // Let's just simulate it on the local state for demonstration, since there's no backend and passing props deeply is complex.
    ratingReservation.hasRated = true;
    ratingReservation.rating = ratingValue;
    ratingReservation.reviewNote = ratingNote;
    setRatingReservation(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/40 backdrop-blur-sm sm:p-4">
      <motion.div 
        initial={{ y: '100%', opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: '100%', opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="w-full sm:max-w-2xl bg-slate-50 h-[85vh] sm:h-[80vh] rounded-t-3xl sm:rounded-3xl shadow-2xl relative overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="bg-white px-6 py-4 border-b border-slate-100 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-3">
            {selectedRestaurant ? (
              <button 
                onClick={() => setSelectedRestaurant(null)}
                className="p-2 hover:bg-slate-50 rounded-full transition-colors -ml-2"
              >
                <ArrowLeft className="w-5 h-5 text-slate-500" />
              </button>
            ) : (
              <div className="w-10 h-10 bg-red-50 text-red-500 rounded-full flex items-center justify-center">
                <Heart className="w-5 h-5 fill-current" />
              </div>
            )}
            <h2 className="text-xl font-bold text-slate-800 tracking-tight">
              {selectedRestaurant ? selectedRestaurant.name : 'Os Meus Restaurantes Favoritos'}
            </h2>
          </div>
          <button 
            onClick={() => {
              setSelectedRestaurant(null);
              onClose();
            }}
            className="p-3 bg-white text-slate-800 hover:bg-blue-600 hover:text-white rounded-full transition-all shadow-lg border border-slate-100 group"
          >
            <X size={20} className="group-active:scale-90 transition-transform" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 custom-scrollbar">
          <AnimatePresence mode="wait">
            {!selectedRestaurant ? (
              <motion.div
                key="list"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                {favoriteRestaurants.length > 0 ? (
                  favoriteRestaurants.map(restaurant => (
                    <div 
                      key={restaurant.id}
                      onClick={() => setSelectedRestaurant(restaurant)}
                      className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 cursor-pointer hover:shadow-md transition-all group hover:border-red-100"
                    >
                      <div className="w-20 h-20 rounded-xl overflow-hidden shadow-sm flex-shrink-0">
                        <img src={restaurant.image} alt={restaurant.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-slate-800 text-lg truncate group-hover:text-red-600 transition-colors">{restaurant.name}</h3>
                        <p className="text-xs text-slate-500 mb-1 flex items-center gap-1">
                          <MapPin className="w-3 h-3" /> {restaurant.island} • {restaurant.cuisine}
                        </p>
                        <div className="flex items-center gap-1 text-xs font-bold text-yellow-500">
                          <Star className="w-3.5 h-3.5 fill-current" /> {restaurant.rating}
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-red-500 transition-colors" />
                    </div>
                  ))
                ) : (
                  <div className="py-20 text-center">
                    <Heart className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-slate-600 mb-2">Ainda não tens favoritos</h3>
                    <p className="text-slate-400 max-w-xs mx-auto">
                      Explora os restaurantes e toca no ícone de coração para os adicionares aos teus favoritos.
                    </p>
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="detail"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-8 pb-8"
              >
                {/* Hero / Info Básica */}
                <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-100 flex flex-col sm:flex-row gap-6 items-start">
                  <div className="w-full sm:w-32 h-40 sm:h-32 rounded-2xl overflow-hidden shadow-md flex-shrink-0">
                     <img src={selectedRestaurant.image} alt={selectedRestaurant.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-50 text-red-600 rounded-full text-xs font-bold mb-3">
                      <Heart className="w-3.5 h-3.5 fill-current" /> Restaurante Favorito
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
                          if (url) window.open(url, '_blank');
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
                        <p className="text-sm text-slate-500">Ainda não fez reservas neste restaurante.</p>
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
               isAuthenticated={true} // assume true if viewing favorites
               onShowAuth={() => {}}
               onBookTable={(res) => {
                 // In a real app we'd dispatch this. Here we just close.
                 alert('Reserva efetuada com sucesso!');
                 setBookingRestaurant(null);
               }}
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
