
import React, { useState, useEffect } from 'react';
import { Restaurant, Language, OrderItem, Dish, Business, Service } from '../types';
import { X, Star, ChevronLeft, ChevronRight, CalendarCheck, Ear, StopCircle, Clock, Users, CreditCard, CheckCircle, ArrowRight, ArrowLeft, Calendar, Plus, Minus, UtensilsCrossed, Wallet, Ban, Phone, Mail, MapPin, Map, Info, ShoppingBag, Sparkles } from 'lucide-react';
import { COLORS } from '../constants';
import { getTranslation } from '../translations';
import { motion, AnimatePresence } from 'motion/react';

interface RestaurantModalProps {
  restaurant: Business | null;
  onClose: () => void;
  language?: Language;
  isAuthenticated?: boolean;
  onShowAuth?: () => void;
  userCredits?: number;
  setUserCredits?: (credits: number) => void;
  onReserveSuccess?: (resData: any, restName: string, restId: string) => void;
  userProfile?: { email: string; name: string; phone: string };
}

type BookingStep = 'info' | 'datetime' | 'success';
type PopupStep = 'notes' | 'preorder_choice' | 'menu' | 'prep_time' | 'payment_methods';

const RestaurantModal: React.FC<RestaurantModalProps> = ({ 
  restaurant, 
  onClose, 
  language = 'pt', 
  isAuthenticated, 
  onShowAuth,
  userCredits = 0,
  setUserCredits,
  onReserveSuccess,
  userProfile
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [bookingStep, setBookingStep] = useState<BookingStep>('info');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [showBookingPopup, setShowBookingPopup] = useState(false);
  const [popupStep, setPopupStep] = useState<PopupStep>('notes');
  const [bookingNote, setBookingNote] = useState('');
  const [prepTimeChoice, setPrepTimeChoice] = useState<'now' | 'at_reservation' | 'custom'>('at_reservation');
  const [customPrepTime, setCustomPrepTime] = useState('');
  const [paymentType, setPaymentType] = useState<'mbway' | 'transfer' | 'points' | 'reserve' | null>(null);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [guests, setGuests] = useState(2);
  const [customerEmail, setCustomerEmail] = useState(userProfile?.email || 'traveler@azorestoyou.com');
  const [customerPhone, setCustomerPhone] = useState(userProfile?.phone || '+351 912 345 678');
  const [customerName, setCustomerName] = useState(userProfile?.name || 'Cliente Viajante');
  const [preorderSelected, setPreorderSelected] = useState<boolean | null>(null);

  // Sync user profile data when it changes
  useEffect(() => {
    if (userProfile) {
      setCustomerEmail(userProfile.email);
      setCustomerName(userProfile.name);
      setCustomerPhone(userProfile.phone);
    }
  }, [userProfile]);
  
  const currentLang = language as Language;

  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  useEffect(() => {
    if (selectedDate && selectedTime) {
      setShowBookingPopup(true);
      setPopupStep('notes');
    }
  }, [selectedDate, selectedTime]);

  const closePopup = () => {
    setShowBookingPopup(false);
    setSelectedTime(null); // Reset time to allow re-selection and re-opening
  };

  if (!restaurant) return null;

  const isBeauty = restaurant.businessType === 'beauty';
  const isShop = restaurant.businessType === 'shop';

  const slides = [
    { image: restaurant.image, title: restaurant.name, desc: getTranslation(currentLang, 'environment') },
    ...(restaurant.gallery || []).map(img => ({ image: img, title: restaurant.name, desc: getTranslation(currentLang, 'environment') })),
    ...(restaurant.dishes || []).map(d => ({ image: d.image, title: d.name, desc: d.description })),
    ...(restaurant.services || []).map(s => ({ image: s.image || restaurant.image, title: s.name, desc: s.description || '' }))
  ];

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  const handleSpeak = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(restaurant.description);
    const langMap: Record<string, string> = {
      'pt': 'pt-PT', 'en': 'en-US', 'es': 'es-ES', 'it': 'it-IT', 'de': 'de-DE'
    };
    utterance.lang = langMap[language] || 'pt-PT';
    utterance.rate = 0.7; 
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const startBooking = () => {
    if (!isAuthenticated && onShowAuth) {
      onShowAuth();
    } else {
      setBookingStep('datetime');
    }
  };

  const handleFinalize = async () => {
    // Detetar automaticamente o endereço do backend
    const API_BASE_URL = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
      ? 'http://localhost:3001'
      : 'https://azorestoyou-1.onrender.com';
    
    // Determine if paying online (credits for pre-order attributed immediately)
    const isPaidOnline = paymentType === 'mbway' || paymentType === 'transfer';

    // Preparar dados da reserva
    const reservationData = {
      customerName: customerName,
      customerEmail: customerEmail,
      customerPhone: customerPhone,
      date: selectedDate?.toISOString().split('T')[0],
      time: selectedTime,
      guests: guests,
      notes: bookingNote,
      paymentType: paymentType,
      preOrder: preorderSelected ? orderItems : [],
      prepRequested: preorderSelected,
      requestedTime: prepTimeChoice === 'custom' ? customPrepTime : prepTimeChoice,
      // Flag: if paid online, pre-order credits already given — don't double-count at restaurant payment confirmation
      preOrderCreditsPaid: isPaidOnline && preorderSelected && orderItems.length > 0
    };

    try {
      // 1. Enviar Reserva
      const endpoint = isBeauty 
        ? `${API_BASE_URL}/api/beauty/${restaurant.id}/reservations`
        : `${API_BASE_URL}/api/restaurants/${restaurant.id}/reservations`;

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...reservationData, businessType: restaurant.businessType }),
      });

      if (res.ok) {
        const data = await res.json();
        onReserveSuccess?.(data, restaurant.name, restaurant.id);
      } else {
        alert('❌ Erro ao enviar reserva: ' + res.statusText);
      }

      // 2. Se houver pré-pedido, enviar para a cozinha
      if (preorderSelected && orderItems.length > 0) {
        await fetch(`${API_BASE_URL}/api/restaurants/${restaurant.id}/orders`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            items: orderItems,
            type: 'pre-order',
            table: 'Reserva Online'
          }),
        });
      }

      // CREDITS: Only attribute immediately if payment is made online (mbway/transfer)
      // When paying at the restaurant (reserve), credits come from the restaurant's payment confirmation
      const isPaidOnline = paymentType === 'mbway' || paymentType === 'transfer';
      if (isPaidOnline && preorderSelected && orderItems.length > 0 && setUserCredits) {
        // Calculate credits from each pre-ordered dish
        const earnedFromItems = orderItems.reduce((acc, item) => {
          const dishCredits = (item.dish as any).credits ?? 0;
          return acc + dishCredits * item.quantity;
        }, 0);

        if (earnedFromItems > 0) {
          setUserCredits(userCredits + earnedFromItems);
          alert(`✅ Reserva confirmada! Ganhou ${earnedFromItems} Créditos Azores4You pelo pagamento online.`);
        }
      }

      setBookingStep('success');
      setTimeout(() => {
        onClose();
      }, 3500);
    } catch (error) {
      console.error('Erro ao processar reserva no backend:', error);
      alert('Erro ao ligar ao servidor. Verifique a sua conexão.');
    }
  };

  const toggleOrderItem = (dish: Dish) => {
    setOrderItems(prev => {
      const existing = prev.find(item => item.dish.name === dish.name);
      if (existing) {
        return prev.filter(item => item.dish.name !== dish.name);
      }
      return [...prev, { dish, quantity: 1, meatPoint: dish.name.toLowerCase().includes('carne') || dish.name.toLowerCase().includes('bife') ? 'Médio' : undefined }];
    });
  };

  const updateQuantity = (dishName: string, delta: number) => {
    setOrderItems(prev => prev.map(item => {
      if (item.dish.name === dishName) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const updateMeatPoint = (dishName: string, point: string) => {
    setOrderItems(prev => prev.map(item => {
      if (item.dish.name === dishName) {
        return { ...item, meatPoint: point };
      }
      return item;
    }));
  };

  const totalCreditsCost = orderItems.reduce((acc, item) => acc + (item.quantity * 10), 0);
  const canAffordWithPoints = userCredits >= totalCreditsCost;

  const timeSlots = [
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
    '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00'
  ];

  // Simple Calendar Logic
  const [calendarMonth, setCalendarMonth] = useState(new Date());
  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();
  
  const monthNames = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ];

  const renderCalendar = () => {
    const year = calendarMonth.getFullYear();
    const month = calendarMonth.getMonth();
    const days = daysInMonth(year, month);
    const firstDay = firstDayOfMonth(year, month);
    const today = new Date();
    today.setHours(0,0,0,0);

    return (
      <div className="bg-slate-50/50 p-3 rounded-[24px] border border-slate-100">
        <div className="flex justify-between items-center mb-4 px-1">
          <button onClick={() => setCalendarMonth(new Date(year, month - 1))} className="p-1.5 hover:bg-white rounded-lg transition-colors border border-transparent hover:border-slate-100">
            <ChevronLeft className="w-3.5 h-3.5 text-slate-400" />
          </button>
          <span className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em]">
            {monthNames[month]} {year}
          </span>
          <button onClick={() => setCalendarMonth(new Date(year, month + 1))} className="p-1.5 hover:bg-white rounded-lg transition-colors border border-transparent hover:border-slate-100">
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          </button>
        </div>
        <div className="grid grid-cols-7 gap-0.5">
          {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map(d => (
            <div key={d} className="text-center text-[8px] font-black text-slate-300 py-1">{d}</div>
          ))}
          {Array.from({ length: firstDay }).map((_, i) => <div key={`e-${i}`} />)}
          {Array.from({ length: days }).map((_, i) => {
            const day = i + 1;
            const date = new Date(year, month, day);
            const isPast = date < today;
            const isSelected = selectedDate?.getTime() === date.getTime();
            return (
              <button
                key={day}
                disabled={isPast}
                onClick={() => setSelectedDate(date)}
                style={{ 
                  backgroundColor: isSelected ? COLORS.primary : undefined,
                  boxShadow: isSelected ? `0 10px 15px -3px ${COLORS.primary}33` : undefined
                }}
                className={`h-8 w-8 rounded-xl text-[10px] font-bold transition-all flex items-center justify-center
                  ${isSelected ? 'text-white scale-105 z-10' : isPast ? 'text-slate-200 cursor-not-allowed' : 'text-slate-600 hover:bg-white hover:text-blue-600'}
                `}
              >
                {day}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  // Autoplay Effect
  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(timer);
  }, [currentSlide, slides.length]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white rounded-none sm:rounded-[32px] w-full max-w-4xl h-full sm:h-auto sm:max-h-[85vh] overflow-hidden flex flex-col md:flex-row shadow-2xl relative border border-white/20">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 z-20 p-2.5 bg-black/20 hover:bg-black/40 rounded-full text-white backdrop-blur-md transition-all active:scale-90"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left/Top: Slider */}
        <div className="w-full md:w-[45%] h-[35vh] md:h-auto relative bg-slate-900 overflow-hidden">
          <AnimatePresence mode="popLayout">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, scale: 1.2, filter: 'blur(10px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
              transition={{ 
                duration: 1.2, 
                ease: [0.22, 1, 0.36, 1] 
              }}
              className="absolute inset-0"
            >
              <img 
                src={slides[currentSlide].image} 
                alt={slides[currentSlide].title} 
                className="w-full h-full object-cover opacity-60"
              />
            </motion.div>
          </AnimatePresence>
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
          
          <div className="absolute bottom-0 inset-x-0 p-8 text-white z-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                <h3 className="text-2xl font-black tracking-tight mb-1 drop-shadow-lg">{slides[currentSlide].title}</h3>
                <p className="text-[10px] font-bold opacity-70 uppercase tracking-[0.3em] drop-shadow-md">{slides[currentSlide].desc}</p>
              </motion.div>
            </AnimatePresence>
          </div>
          
          {/* Controls */}
          <div className="absolute top-1/2 -translate-y-1/2 inset-x-4 flex justify-between pointer-events-none z-10">
            <button 
              onClick={(e) => { e.stopPropagation(); prevSlide(); }}
              className="p-3 bg-white/5 hover:bg-white/20 rounded-2xl text-white backdrop-blur-xl border border-white/10 transition-all pointer-events-auto active:scale-90 group"
            >
              <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); nextSlide(); }}
              className="p-3 bg-white/5 hover:bg-white/20 rounded-2xl text-white backdrop-blur-xl border border-white/10 transition-all pointer-events-auto active:scale-90 group"
            >
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Modern Progress Indicators */}
          <div className="absolute bottom-0 inset-x-0 flex gap-0.5 px-0.5">
            {slides.map((_, i) => (
              <div key={i} className="flex-1 h-1 bg-white/10 overflow-hidden">
                {i === currentSlide && (
                  <motion.div 
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 5, ease: "linear" }}
                    className="h-full bg-blue-500"
                  />
                )}
                {i < currentSlide && <div className="w-full h-full bg-white/40" />}
              </div>
            ))}
          </div>
        </div>

        {/* Right/Bottom: Info */}
        <div className="w-full md:w-[55%] p-6 md:p-10 overflow-y-auto relative flex flex-col bg-white">
          <AnimatePresence mode="wait">
            {bookingStep === 'info' && (
              <motion.div 
                key="info"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex-1"
              >
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tighter mb-1">{restaurant.name}</h2>
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] text-slate-400 uppercase tracking-[0.3em] font-black">
                        {isBeauty ? getTranslation(currentLang, 'nav_beauty') : isShop ? getTranslation(currentLang, 'nav_shops') : restaurant.cuisine}
                      </span>
                      <div className="h-1 w-1 rounded-full bg-slate-200" />
                      <div className="flex items-center gap-1 text-yellow-500 font-black text-xs">
                        <Star className="w-3 h-3 fill-current" />
                        {restaurant.rating}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Description Section */}
                <div className="mb-8">
                   <div className="flex items-center justify-between mb-4">
                     <h4 className="font-black text-slate-300 text-[10px] uppercase tracking-[0.2em]">{getTranslation(currentLang, 'about_restaurant')}</h4>
                     <button 
                       onClick={handleSpeak}
                       className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-[10px] font-black transition-all border
                         ${isSpeaking 
                           ? 'bg-red-50 text-red-600 border-red-100' 
                           : 'bg-slate-50 text-slate-600 border-slate-100 hover:bg-slate-100'}`}
                     >
                       {isSpeaking ? <StopCircle className="w-3.5 h-3.5" /> : <Ear className="w-3.5 h-3.5" />}
                       {isSpeaking ? getTranslation(currentLang, 'audio_stop') : getTranslation(currentLang, 'listen')}
                     </button>
                   </div>
                   <div className="relative">
                     <p className="text-slate-600 leading-relaxed text-sm font-medium">
                       {restaurant.description}
                     </p>
                   </div>
                   
                   <div className="mt-6 flex flex-col gap-3">
                      {restaurant.phone && (
                         <div className="flex items-center gap-3 text-slate-600 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                            <div className="p-2 bg-white rounded-lg shadow-sm"><Phone className="w-4 h-4 text-slate-400"/></div>
                            <span className="text-sm font-bold">{restaurant.phone}</span>
                         </div>
                      )}
                      {restaurant.publicEmail && (
                         <div className="flex items-center gap-3 text-slate-600 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                            <div className="p-2 bg-white rounded-lg shadow-sm"><Mail className="w-4 h-4 text-slate-400"/></div>
                            <span className="text-sm font-bold">{restaurant.publicEmail}</span>
                         </div>
                      )}
                      {restaurant.address && (
                         <div className="flex items-center gap-3 text-slate-600 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                            <div className="p-2 bg-white rounded-lg shadow-sm"><MapPin className="w-4 h-4 text-slate-400"/></div>
                            <span className="text-sm font-bold">{restaurant.address}</span>
                         </div>
                      )}
                      {(restaurant.mapsUrl || (restaurant.latitude && restaurant.longitude)) && (
                        <button 
                          onClick={() => {
                            const url = (restaurant.latitude && restaurant.longitude) 
                              ? `https://maps.google.com/?q=${restaurant.latitude},${restaurant.longitude}` 
                              : restaurant.mapsUrl;
                            if (url) window.open(url, '_blank');
                          }} 
                          className="mt-2 w-full px-6 py-4 bg-slate-800 text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-slate-700 hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-slate-900/20"
                        >
                          <Map className="w-4 h-4" /> Ver Direções no Mapa
                        </button>
                      )}
                   </div>
                </div>

                <div className="mb-10">
                  <button 
                    className="w-full py-4 text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all active:scale-95 group"
                     style={{ 
                       backgroundColor: COLORS.primary,
                       boxShadow: `0 20px 25px -5px ${COLORS.primary}33`
                     }}
                    onClick={startBooking}
                  >
                    {isBeauty ? <Sparkles className="w-4 h-4" /> : isShop ? <ShoppingBag className="w-4 h-4" /> : <CalendarCheck className="w-4 h-4" />}
                    {isBeauty ? 'Agendar Serviço' : isShop ? 'Ver Catálogo' : getTranslation(currentLang, 'make_reservation')}
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>

                <h4 className="font-black text-slate-300 text-[10px] uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
                  {getTranslation(currentLang, 'signature_dishes')}
                  <div className="h-[1px] flex-1 bg-slate-100" />
                </h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                  {(restaurant.dishes || []).map((dish, idx) => (
                    <div key={idx} className="flex items-center gap-4 p-3 rounded-2xl bg-slate-50/50 border border-slate-100 hover:border-green-100 hover:bg-green-50/30 transition-all group">
                       <div className="w-12 h-12 rounded-xl overflow-hidden shadow-sm flex-shrink-0">
                         <img src={dish.image} alt={dish.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                       </div>
                       <div className="min-w-0">
                         <p className="font-bold text-slate-800 text-xs truncate">{dish.name}</p>
                         <p className="text-[10px] text-slate-400 font-black">€{dish.price}</p>
                       </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {bookingStep === 'datetime' && (
              <motion.div 
                key="datetime"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex-1 flex flex-col"
              >
                <div className="flex items-center gap-4 mb-8">
                  <button onClick={() => setBookingStep('info')} className="p-2.5 hover:bg-slate-50 rounded-2xl transition-colors border border-slate-100">
                    <ArrowLeft className="w-4 h-4 text-slate-400" />
                  </button>
                  <div>
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight">{getTranslation(currentLang, 'booking_date_time')}</h3>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Aberto: 12:00 - 15:00 • 19:00 - 23:00</p>
                  </div>
                </div>

                <div className="space-y-8 flex-1">
                  <div>
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                      <Users className="w-3.5 h-3.5" /> Quantas pessoas?
                    </p>
                    <div className="flex items-center gap-4 bg-slate-50 p-2 rounded-2xl border border-slate-100">
                      {[1,2,3,4,5,6,7,8].map(n => (
                        <button
                          key={n}
                          onClick={() => setGuests(n)}
                          className={`w-10 h-10 rounded-xl font-black text-sm transition-all ${
                            guests === n ? 'bg-blue-600 text-white shadow-lg' : 'bg-white text-slate-400 hover:bg-white/50'
                          }`}
                        >
                          {n}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5" /> {getTranslation(currentLang, 'select_date')}
                    </p>
                    {renderCalendar()}
                  </div>

                  <div>
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5" /> {getTranslation(currentLang, 'available_times')}
                    </p>
                    <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                      {timeSlots.map(time => (
                        <button
                          key={time}
                          onClick={() => setSelectedTime(time)}
                          style={{ 
                            backgroundColor: selectedTime === time ? COLORS.primary : undefined,
                            borderColor: selectedTime === time ? COLORS.primary : undefined,
                            boxShadow: selectedTime === time ? `0 10px 15px -3px ${COLORS.primary}33` : undefined
                          }}
                          className={`py-3 rounded-2xl text-[10px] font-black transition-all border
                            ${selectedTime === time 
                              ? 'text-white scale-105 z-10' 
                              : 'bg-white text-slate-600 border-slate-100 hover:border-slate-300 hover:bg-slate-50'}`}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>

                  <AnimatePresence mode="wait">
                    {showBookingPopup && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 z-[70] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm"
                      >
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9, y: 20 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.9, y: 20 }}
                          className="w-full max-w-sm bg-white rounded-[32px] p-8 shadow-2xl relative overflow-hidden flex flex-col gap-6"
                        >
                          <button 
                            onClick={closePopup}
                            className="absolute top-4 right-4 p-2 hover:bg-slate-50 rounded-full transition-colors"
                          >
                            <X className="w-4 h-4 text-slate-400" />
                          </button>

                          {popupStep !== 'notes' && (
                            <button 
                              onClick={() => {
                                if (popupStep === 'preorder_choice') setPopupStep('notes');
                                else if (popupStep === 'menu') setPopupStep('preorder_choice');
                              else if (popupStep === 'prep_time') setPopupStep('menu');
                              else if (popupStep === 'payment_methods') {
                                if (preorderSelected) setPopupStep('prep_time');
                                else setPopupStep('preorder_choice');
                              }
                              }}
                              className="absolute top-4 left-4 p-2 hover:bg-slate-50 rounded-full transition-colors"
                            >
                              <ArrowLeft className="w-4 h-4 text-slate-400" />
                            </button>
                          )}

                          <AnimatePresence mode="wait">
                            {popupStep === 'notes' && (
                              <motion.div
                                key="step-notes"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="flex flex-col gap-6"
                              >
                                <div className="flex flex-col items-center text-center gap-2">
                                  <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-2">
                                    <CalendarCheck className="w-6 h-6" />
                                  </div>
                                  <h4 className="text-xl font-black text-slate-900 tracking-tight">
                                    Dados da Reserva
                                  </h4>
                                  <div className="flex items-center gap-2 px-3 py-1 bg-slate-50 rounded-full border border-slate-100">
                                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                                      {selectedDate?.toLocaleDateString()} • {selectedTime} • {guests} Pessoas
                                    </span>
                                  </div>
                                </div>

                                <div className="space-y-4">
                                  <div className="space-y-2">
                                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">Nome da Reserva</p>
                                    <input 
                                      type="text" 
                                      value={customerName}
                                      onChange={(e) => setCustomerName(e.target.value)}
                                      className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
                                      placeholder="Seu nome"
                                    />
                                  </div>
                                  <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-2">
                                      <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">Telemóvel</p>
                                      <input 
                                        type="tel" 
                                        value={customerPhone}
                                        onChange={(e) => setCustomerPhone(e.target.value)}
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">Email</p>
                                      <input 
                                        type="email" 
                                        value={customerEmail}
                                        onChange={(e) => setCustomerEmail(e.target.value)}
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
                                      />
                                    </div>
                                  </div>
                                </div>

                                <div className="space-y-3">
                                  <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] flex items-center gap-2">
                                    <Ear className="w-3.5 h-3.5" /> {getTranslation(currentLang, 'booking_notes' as any)}
                                  </p>
                                  <textarea
                                    value={bookingNote}
                                    onChange={(e) => setBookingNote(e.target.value)}
                                    placeholder={getTranslation(currentLang, 'booking_notes_placeholder' as any)}
                                    className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-medium text-slate-600 placeholder:text-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all resize-none h-28"
                                  />
                                </div>

                                <button 
                                  style={{ 
                                    backgroundColor: COLORS.primary,
                                    boxShadow: `0 20px 25px -5px ${COLORS.primary}33`
                                  }}
                                  className="w-full py-4 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 text-white hover:opacity-90 transition-all active:scale-95 shadow-lg"
                                  onClick={() => setPopupStep('preorder_choice')}
                                >
                                  {getTranslation(currentLang, 'finish_reservation')}
                                  <ArrowRight className="w-3.5 h-3.5" />
                                </button>
                              </motion.div>
                            )}

                            {popupStep === 'preorder_choice' && (
                              <motion.div
                                key="step-preorder-choice"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="flex flex-col gap-6"
                              >
                                <div className="flex flex-col items-center text-center gap-2">
                                  <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center mb-2">
                                    <UtensilsCrossed className="w-6 h-6" />
                                  </div>
                                  <h4 className="text-xl font-black text-slate-900 tracking-tight">
                                    {getTranslation(currentLang, 'preorder_choice_title' as any)}
                                  </h4>
                                </div>

                                <div className="grid grid-cols-1 gap-3">
                                  <button
                                    onClick={() => { setPreorderSelected(true); setPopupStep('menu'); }}
                                    className="w-full p-6 rounded-2xl border-2 border-slate-50 bg-slate-50/50 hover:border-orange-200 hover:bg-orange-50/30 transition-all text-left group"
                                  >
                                    <p className="font-black text-slate-900 text-sm">{getTranslation(currentLang, 'preorder_yes' as any)}</p>
                                    <p className="text-[10px] text-slate-500 mt-1">Escolha os pratos e bebidas antecipadamente</p>
                                  </button>
                                  <button
                                    onClick={() => { setPreorderSelected(false); setPopupStep('payment_methods'); }}
                                    className="w-full p-6 rounded-2xl border-2 border-slate-50 bg-slate-50/50 hover:border-blue-200 hover:bg-blue-50/30 transition-all text-left group"
                                  >
                                    <p className="font-black text-slate-900 text-sm">{getTranslation(currentLang, 'preorder_no' as any)}</p>
                                    <p className="text-[10px] text-slate-500 mt-1">Apenas garantir a reserva da mesa</p>
                                  </button>
                                </div>
                              </motion.div>
                            )}

                            {popupStep === 'menu' && (
                              <motion.div
                                key="step-menu"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="flex flex-col gap-6 max-h-[70vh]"
                              >
                                <div className="flex flex-col items-center text-center gap-2">
                                  <h4 className="text-xl font-black text-slate-900 tracking-tight">
                                    {getTranslation(currentLang, 'preorder_menu_title' as any)}
                                  </h4>
                                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                    {restaurant.name}
                                  </p>
                                </div>

                                <div className="flex-1 overflow-y-auto pr-2 space-y-4 custom-scrollbar">
                                  {restaurant.dishes.map((dish, idx) => {
                                    const orderItem = orderItems.find(item => item.dish.name === dish.name);
                                    const isSelected = !!orderItem;
                                    
                                    return (
                                      <div key={idx} className={`p-4 rounded-2xl border-2 transition-all ${isSelected ? 'border-orange-200 bg-orange-50/20' : 'border-slate-50 bg-slate-50/50'}`}>
                                        <div className="flex items-center gap-4">
                                          <div className="w-16 h-16 rounded-xl overflow-hidden shadow-sm flex-shrink-0">
                                            <img src={dish.image} alt={dish.name} className="w-full h-full object-cover" />
                                          </div>
                                          <div className="flex-1 min-w-0">
                                            <p className="font-bold text-slate-800 text-sm truncate">{dish.name}</p>
                                            <p className="text-xs text-slate-400 font-bold">€{dish.price} • 10 {getTranslation(currentLang, 'credits_balance' as any)}</p>
                                          </div>
                                          <button 
                                            onClick={() => toggleOrderItem(dish)}
                                            className={`p-2 rounded-xl transition-all ${isSelected ? 'bg-orange-500 text-white' : 'bg-white text-slate-300 border border-slate-100'}`}
                                          >
                                            {isSelected ? <CheckCircle className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                                          </button>
                                        </div>

                                        {isSelected && (
                                          <motion.div 
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            className="mt-4 pt-4 border-t border-orange-100 space-y-4"
                                          >
                                            <div className="flex items-center justify-between">
                                              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{getTranslation(currentLang, 'quantity' as any)}</span>
                                              <div className="flex items-center gap-3 bg-white rounded-xl p-1 border border-orange-100">
                                                <button onClick={() => updateQuantity(dish.name, -1)} className="p-1.5 hover:bg-orange-50 rounded-lg text-orange-500"><Minus className="w-3.5 h-3.5" /></button>
                                                <span className="font-black text-slate-700 text-sm min-w-[20px] text-center">{orderItem.quantity}</span>
                                                <button onClick={() => updateQuantity(dish.name, 1)} className="p-1.5 hover:bg-orange-50 rounded-lg text-orange-500"><Plus className="w-3.5 h-3.5" /></button>
                                              </div>
                                            </div>

                                            {orderItem.meatPoint && (
                                              <div className="space-y-2">
                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{getTranslation(currentLang, 'meat_point' as any)}</span>
                                                <div className="flex flex-wrap gap-1.5">
                                                  {['Mal passado', 'Médio mal', 'Médio', 'Médio bem', 'Bem passado'].map(p => (
                                                    <button
                                                      key={p}
                                                      onClick={() => updateMeatPoint(dish.name, p)}
                                                      className={`px-3 py-1.5 rounded-lg text-[9px] font-black transition-all border
                                                        ${orderItem.meatPoint === p 
                                                          ? 'bg-orange-500 text-white border-orange-500' 
                                                          : 'bg-white text-slate-500 border-slate-100 hover:border-orange-200'}`}
                                                    >
                                                      {p}
                                                    </button>
                                                  ))}
                                                </div>
                                              </div>
                                            )}
                                          </motion.div>
                                        )}
                                      </div>
                                    );
                                  })}
                                </div>

                                <button 
                                  disabled={orderItems.length === 0}
                                  style={{ 
                                    backgroundColor: orderItems.length === 0 ? undefined : COLORS.primary,
                                    boxShadow: orderItems.length === 0 ? undefined : `0 20px 25px -5px ${COLORS.primary}33`
                                  }}
                                  className={`w-full py-4 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all active:scale-95
                                    ${orderItems.length === 0 
                                      ? 'bg-slate-100 text-slate-300 cursor-not-allowed' 
                                      : 'text-white hover:opacity-90'}`}
                                  onClick={() => setPopupStep('prep_time')}
                                >
                                  {getTranslation(currentLang, 'next' as any)}
                                  <ArrowRight className="w-3.5 h-3.5" />
                                </button>
                              </motion.div>
                            )}

                            {popupStep === 'prep_time' && (
                              <motion.div
                                key="step-prep-time"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="flex flex-col gap-6"
                              >
                                <div className="flex flex-col items-center text-center gap-2">
                                  <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-2">
                                    <Clock className="w-6 h-6" />
                                  </div>
                                  <h4 className="text-xl font-black text-slate-900 tracking-tight">
                                    Horário de Preparação
                                  </h4>
                                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                    Quando quer que a comida esteja pronta?
                                  </p>
                                </div>

                                <div className="space-y-3">
                                  {[
                                    { id: 'at_reservation', title: 'À hora da reserva', desc: `Pronto às ${selectedTime}` },
                                    { id: 'now', title: 'Preparar agora', desc: 'A cozinha começa já a preparar' },
                                    { id: 'custom', title: 'Escolher horário', desc: 'Defina uma hora específica' }
                                  ].map(opt => (
                                    <button
                                      key={opt.id}
                                      onClick={() => setPrepTimeChoice(opt.id as any)}
                                      className={`w-full p-5 rounded-2xl border-2 text-left transition-all ${
                                        prepTimeChoice === opt.id ? 'border-blue-600 bg-blue-50/20' : 'border-slate-50 bg-slate-50/50'
                                      }`}
                                    >
                                      <p className="font-black text-slate-900 text-sm">{opt.title}</p>
                                      <p className="text-[10px] text-slate-500 mt-1">{opt.desc}</p>
                                    </button>
                                  ))}
                                </div>

                                {prepTimeChoice === 'custom' && (
                                  <div className="flex flex-col gap-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Escolha a hora (Deve ser antes das {selectedTime})</label>
                                    <input 
                                      type="time" 
                                      value={customPrepTime}
                                      max={selectedTime || undefined}
                                      onChange={(e) => setCustomPrepTime(e.target.value)}
                                      className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-800"
                                    />
                                    {customPrepTime && selectedTime && customPrepTime >= selectedTime && (
                                      <p className="text-[9px] text-red-500 font-black uppercase px-2">A hora de preparação deve ser antes da reserva!</p>
                                    )}
                                  </div>
                                )}

                                <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 flex items-start gap-3">
                                   <Info size={14} className="text-amber-600 mt-0.5" />
                                   <p className="text-[10px] font-medium text-amber-800 leading-tight">
                                      Lembre-se: Temos uma tolerância de 15 min. Escolher um horário ligeiramente antes garante que a comida esteja pronta à sua chegada!
                                   </p>
                                </div>

                                <button 
                                  disabled={prepTimeChoice === 'custom' && (!customPrepTime || (selectedTime && customPrepTime >= selectedTime))}
                                  style={{ 
                                    backgroundColor: (prepTimeChoice === 'custom' && (!customPrepTime || (selectedTime && customPrepTime >= selectedTime))) ? undefined : COLORS.primary,
                                    boxShadow: (prepTimeChoice === 'custom' && (!customPrepTime || (selectedTime && customPrepTime >= selectedTime))) ? undefined : `0 20px 25px -5px ${COLORS.primary}33`
                                  }}
                                  className={`w-full py-4 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all active:scale-95
                                    ${(prepTimeChoice === 'custom' && (!customPrepTime || (selectedTime && customPrepTime >= selectedTime))) 
                                      ? 'bg-slate-100 text-slate-300 cursor-not-allowed' 
                                      : 'text-white hover:opacity-90'}`}
                                  onClick={() => setPopupStep('payment_methods')}
                                >
                                  {getTranslation(currentLang, 'next' as any)}
                                  <ArrowRight className="w-3.5 h-3.5" />
                                </button>
                              </motion.div>
                            )}
                            {popupStep === 'payment_methods' && (
                              <motion.div
                                key="step-payment"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="flex flex-col gap-6"
                              >
                                <div className="flex flex-col items-center text-center gap-2">
                                  <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-2">
                                    <CreditCard className="w-6 h-6" />
                                  </div>
                                  <h4 className="text-xl font-black text-slate-900 tracking-tight">
                                    {getTranslation(currentLang, 'booking_payment')}
                                  </h4>
                                  {orderItems.length > 0 && (
                                    <div className="flex items-center gap-2 px-3 py-1 bg-orange-50 rounded-full border border-orange-100">
                                      <span className="text-[9px] font-black text-orange-600 uppercase tracking-widest">
                                        {orderItems.length} {getTranslation(currentLang, 'order_summary' as any)} • {totalCreditsCost} {getTranslation(currentLang, 'credits_balance' as any)}
                                      </span>
                                    </div>
                                  )}
                                </div>

                                <div className="space-y-3">
                                  <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] text-center">
                                    {getTranslation(currentLang, 'select_payment_method' as any)}
                                  </p>
                                  {[
                                    { id: 'mbway', icon: Wallet, title: 'payment_mbway', desc: 'MBWay / Revolut' },
                                    { id: 'transfer', icon: CreditCard, title: 'payment_transfer', desc: 'Transferência Bancária' },
                                    { id: 'points', icon: Star, title: 'payment_points', desc: `Saldo: ${userCredits} créditos` },
                                    { id: 'reserve', icon: CheckCircle, title: 'payment_reserve', desc: 'payment_reserve_desc' }
                                  ].map((opt) => {
                                    const isSelected = paymentType === opt.id;
                                    const isPoints = opt.id === 'points';
                                    const disabled = isPoints && !canAffordWithPoints && orderItems.length > 0;

                                    return (
                                      <button
                                        key={opt.id}
                                        disabled={disabled}
                                        onClick={() => setPaymentType(opt.id as any)}
                                        style={{ 
                                          borderColor: isSelected ? COLORS.primary : undefined,
                                          backgroundColor: isSelected ? `${COLORS.primary}08` : undefined,
                                          boxShadow: isSelected ? `0 10px 15px -3px ${COLORS.primary}15` : undefined
                                        }}
                                        className={`w-full p-4 rounded-2xl border-2 transition-all flex items-center gap-4 text-left group relative overflow-hidden
                                          ${isSelected 
                                            ? '' 
                                            : disabled ? 'opacity-40 cursor-not-allowed border-slate-50 bg-slate-50/50' : 'border-slate-50 hover:border-slate-200 bg-slate-50/50'}`}
                                      >
                                        <div 
                                          style={{ backgroundColor: isSelected ? COLORS.primary : undefined }}
                                          className={`p-3 rounded-xl transition-all ${isSelected ? 'text-white' : 'bg-white text-slate-400 shadow-sm group-hover:scale-110'}`}
                                        >
                                          <opt.icon className="w-4 h-4" />
                                        </div>
                                        <div className="flex-1">
                                          <p className="font-black text-slate-900 text-[11px] tracking-tight">{getTranslation(currentLang, opt.title as any)}</p>
                                          <p className="text-[9px] font-medium text-slate-500 leading-tight">
                                            {opt.id === 'reserve' ? getTranslation(currentLang, opt.desc as any) : opt.desc}
                                          </p>
                                        </div>
                                        {isSelected && (
                                          <motion.div 
                                            layoutId="active-check"
                                            className="w-5 h-5 rounded-full flex items-center justify-center text-white"
                                            style={{ backgroundColor: COLORS.primary }}
                                          >
                                            <CheckCircle className="w-3 h-3" />
                                          </motion.div>
                                        )}
                                      </button>
                                    );
                                  })}
                                </div>

                                {paymentType === 'points' && (
                                  <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100">
                                    <p className="text-[10px] font-medium text-blue-700 leading-relaxed">
                                      {getTranslation(currentLang, 'total_credits_cost' as any)}: <span className="font-black">{totalCreditsCost}</span>. 
                                      Seu saldo após reserva: <span className="font-black">{userCredits - totalCreditsCost + 2}</span> créditos.
                                    </p>
                                  </div>
                                )}

                                <button 
                                  disabled={!paymentType}
                                  style={{ 
                                    backgroundColor: !paymentType ? undefined : COLORS.primary,
                                    boxShadow: !paymentType ? undefined : `0 20px 25px -5px ${COLORS.primary}33`
                                  }}
                                  className={`w-full py-4 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all active:scale-95
                                    ${!paymentType 
                                      ? 'bg-slate-100 text-slate-300 cursor-not-allowed' 
                                      : 'text-white hover:opacity-90'}`}
                                  onClick={handleFinalize}
                                >
                                  {getTranslation(currentLang, 'finish_reservation')}
                                  <CheckCircle className="w-3.5 h-3.5" />
                                </button>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {!selectedTime && (
                  <div className="mt-8">
                    <div className="w-full py-4 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 bg-slate-100 text-slate-300 cursor-not-allowed">
                      {getTranslation(currentLang, 'next')}
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {bookingStep === 'success' && (
              <motion.div 
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex-1 flex flex-col items-center justify-center text-center py-12"
              >
                <div className="w-24 h-24 bg-green-50 text-green-600 rounded-[32px] flex items-center justify-center mb-8 animate-bounce shadow-xl shadow-green-100">
                  <CheckCircle className="w-12 h-12" />
                </div>
                <h3 className="text-3xl font-black text-slate-900 mb-3 tracking-tight">{getTranslation(currentLang, 'booking_success')}</h3>
                <p className="text-slate-500 text-sm font-medium max-w-[280px] mx-auto leading-relaxed">
                  {getTranslation(currentLang, 'booking_success_desc')}
                </p>
                
                <div className="mt-10 p-6 bg-slate-50 rounded-3xl border border-slate-100 w-full">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Restaurante</span>
                    <span className="font-bold text-slate-900">{restaurant.name}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Data & Hora</span>
                    <span className="font-bold text-slate-900">{selectedDate?.toLocaleDateString()} às {selectedTime}</span>
                  </div>
                  {bookingNote && (
                    <div className="mt-4 pt-4 border-t border-slate-200">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Nota</span>
                      <p className="text-xs text-slate-600 italic">"{bookingNote}"</p>
                    </div>
                  )}
                  {orderItems.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-slate-200">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Pedido Enviado</span>
                      <div className="space-y-2">
                        {orderItems.map((item, idx) => (
                          <div key={idx} className="flex justify-between items-center text-xs">
                            <span className="text-slate-600 font-medium">{item.quantity}x {item.dish.name} {item.meatPoint ? `(${item.meatPoint})` : ''}</span>
                            <span className="font-bold text-slate-900">€{(item.dish.price * item.quantity).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default RestaurantModal;
