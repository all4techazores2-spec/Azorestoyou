
import React, { useState } from 'react';
import { Activity, Language, TourGuide } from '../types';
import { getTranslation } from '../translations';
import { TOUR_GUIDES } from '../constants';
import { X, MapPin, Clock, Ruler, BarChart3, Info, Navigation, AlertTriangle, Star, Languages, Check, Users, Calendar, CreditCard, Smartphone, ChevronLeft, ChevronRight, User, Mail, Phone, Wallet, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface TrailModalProps {
  trail: Activity;
  onClose: () => void;
  language: Language;
  isAuthenticated?: boolean;
  onShowAuth?: () => void;
  userProfile?: { email: string; name: string; phone: string };
  userCredits?: number;
  setUserCredits?: (credits: number) => void;
  onReserveSuccess?: (resData: any, itemName: string, itemId: string) => void;
}

const TrailModal: React.FC<TrailModalProps> = ({ trail, onClose, language, isAuthenticated, onShowAuth, userProfile, userCredits = 0, setUserCredits }) => {
  const [bookingStep, setBookingStep] = useState<'main' | 'datetime' | 'details' | 'payment' | 'success'>('main');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [customerName, setCustomerName] = useState(userProfile?.name || '');
  const [customerEmail, setCustomerEmail] = useState(userProfile?.email || '');
  const [customerPhone, setCustomerPhone] = useState(userProfile?.phone || '');
  const [paymentType, setPaymentType] = useState<'presencial' | 'mbway' | 'transfer' | 'points'>('presencial');
  const [mbwayPhone, setMbwayPhone] = useState(userProfile?.phone || '');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  
  const [showGuidePrompt, setShowGuidePrompt] = useState(false);
  const [showGuideList, setShowGuideList] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [isCheckingGuide, setIsCheckingGuide] = useState(false);
  const [guideError, setGuideError] = useState(false);

  const t = (key: string) => getTranslation(language, key as any);

  const [calendarMonth, setCalendarMonth] = useState(new Date());
  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();
  const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
  
  const timeSlots = ["09:00", "09:30", "10:00", "10:30", "11:00", "14:00", "14:30", "15:00", "15:30", "16:00"];

  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty) {
      case 'Fácil': return 'text-emerald-600 bg-emerald-50 border-emerald-100';
      case 'Moderado': return 'text-amber-600 bg-amber-50 border-amber-100';
      case 'Difícil': return 'text-rose-600 bg-rose-50 border-rose-100';
      default: return 'text-slate-600 bg-slate-50 border-slate-100';
    }
  };

  const getDifficultyLabel = (difficulty?: string) => {
    switch (difficulty) {
      case 'Fácil': return t('trail_easy');
      case 'Moderado': return t('trail_moderate');
      case 'Difícil': return t('trail_hard');
      default: return difficulty;
    }
  };

  const handleDirectionsClick = () => {
    setShowGuidePrompt(true);
  };

  const handleGuideResponse = (wantsGuide: boolean) => {
    setShowGuidePrompt(false);
    if (wantsGuide) {
      setShowGuideList(true);
    } else {
      setShowMap(true);
    }
  };

  const handleGuideSelect = (guideId: string) => {
    setIsCheckingGuide(true);
    setGuideError(false);

    setTimeout(() => {
      setIsCheckingGuide(false);
      
      if (guideId === 'G1' || Math.random() > 0.7) {
        setGuideError(true);
      } else {
        window.open('https://wa.me/351123456789?text=Gostaria%20de%20reservar%20um%20guia%20para%20o%20trilho%20' + trail.title, '_blank');
      }
    }, 1500);
  };

  const handleStartBooking = () => {
    if (!isAuthenticated && onShowAuth) {
      onShowAuth();
    } else {
      setBookingStep('datetime');
    }
  };

  const handleFinalize = () => {
    // Validar se temos data e hora
    if (!selectedDate || !selectedTime) {
      alert("Por favor, selecione uma data e horário antes de confirmar.");
      setBookingStep('datetime');
      return;
    }

    setIsCheckingGuide(true);
    
    // Detect API base URL (same logic as App.tsx)
    const API_BASE_URL = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.hostname.startsWith('192.168.'))
      ? `http://${window.location.hostname}:3001`
      : 'https://azorestoyou-1.onrender.com';
    
    setTimeout(async () => {
      // 1. Mostrar sucesso imediatamente
      setIsCheckingGuide(false);
      setBookingStep('success');

      try {
        const resData = {
          id: `RES_L_${Date.now()}`,
          itemName: trail.title,
          landscapeId: trail.id,
          type: 'landscape',
          customerName,
          customerEmail,
          customerPhone,
          date: selectedDate.toISOString().split('T')[0],
          time: selectedTime,
          status: 'pending',
          paymentType,
          total: trail.isPaid ? trail.price : 0,
          createdAt: new Date().toISOString()
        };

        // Descontar créditos se pagar com pontos
        if (paymentType === 'points' && setUserCredits && trail.price) {
          setUserCredits(userCredits - trail.price);
        }

        // 2. Persistir no servidor via endpoint dedicado
        if (customerEmail) {
          try {
            // Usar o endpoint dedicado que grava no user diretamente
            const response = await fetch(`${API_BASE_URL}/api/user-reservations`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email: customerEmail, reservation: { ...resData, restaurantName: trail.title, restaurantId: trail.id } })
            });
            if (response.ok) {
              console.log("✅ Reserva de Paisagem gravada no servidor!");
            } else {
              console.warn("⚠️ Servidor retornou erro:", response.status);
            }
          } catch (fetchErr) {
            console.error("Erro ao persistir no servidor:", fetchErr);
          }
        }
        
        // 3. Sincronizar com o pai (App.tsx) para atualizar estado local
        onReserveSuccess?.(resData, trail.title, trail.id);
      } catch (error) {
        console.error("Erro ao processar dados da reserva:", error);
      }
    }, 1500);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
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
          className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
        >
          {bookingStep === 'main' && (
            <div className="relative h-64 md:h-80 shrink-0">
              <img src={trail.image} alt={trail.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <button onClick={onClose} className="absolute top-6 right-6 z-50 p-3 bg-white text-slate-800 hover:bg-blue-600 hover:text-white rounded-full transition-all shadow-lg border border-slate-100 group">
                <X size={20} className="group-active:scale-90 transition-transform" />
              </button>
              <div className="absolute bottom-6 left-6 right-6">
                <div className="flex items-center gap-2 text-white/90 text-sm font-medium mb-2">
                  <MapPin className="w-4 h-4" /> {trail.island}
                </div>
                <h2 className="text-3xl font-bold text-white">{trail.title}</h2>
                {trail.bookingPolicy === 'required' && (
                  <div className="mt-2 inline-flex items-center gap-1 px-3 py-1 bg-red-600/90 backdrop-blur-sm text-white text-[10px] font-black rounded-full uppercase tracking-widest shadow-lg border border-red-500/50">
                    <AlertTriangle size={12} /> Reserva Obrigatória (Vagas Limitadas)
                  </div>
                )}
                {trail.bookingPolicy === 'recommended' && (
                  <div className="mt-2 inline-flex items-center gap-1 px-3 py-1 bg-yellow-500/90 backdrop-blur-sm text-white text-[10px] font-black rounded-full uppercase tracking-widest shadow-lg border border-yellow-400/50">
                    <Info size={12} /> Reserva Recomendada (Experiência Premium)
                  </div>
                )}
              </div>
            </div>
          )}

          {bookingStep !== 'main' && bookingStep !== 'success' && (
            <div className="p-6 border-b border-slate-100 shrink-0 bg-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => {
                    if (bookingStep === 'datetime') setBookingStep('main');
                    else if (bookingStep === 'details') setBookingStep('datetime');
                    else if (bookingStep === 'payment') setBookingStep('details');
                  }}
                  className="p-2 bg-white rounded-full text-slate-400 hover:text-blue-600 transition-colors shadow-sm"
                >
                  <ChevronLeft size={20} />
                </button>
                <div>
                  <h3 className="font-bold text-slate-800">Reserva: {trail.title}</h3>
                  <div className="flex gap-1 mt-1">
                    {[1,2,3].map(i => (
                      <div key={i} className={`h-1 w-8 rounded-full ${((bookingStep === 'datetime' && i >= 1) || (bookingStep === 'details' && i >= 2) || (bookingStep === 'payment' && i >= 3)) ? 'bg-pink-500' : 'bg-slate-200'}`} />
                    ))}
                  </div>
                </div>
              </div>
              <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X size={24} /></button>
            </div>
          )}

          <div className="flex-1 overflow-y-auto">
            {bookingStep === 'success' ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }} 
                animate={{ opacity: 1, scale: 1 }} 
                className="h-full flex flex-col items-center justify-center p-8 text-center min-h-[400px]"
              >
                <div className="w-24 h-24 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mb-8 shadow-sm">
                  <Check size={48} strokeWidth={3} />
                </div>
                <h3 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">Reserva Enviada!</h3>
                <p className="text-slate-500 mb-10 max-w-sm leading-relaxed font-medium">
                  A sua solicitação para <strong className="text-slate-800">{trail.title}</strong> foi enviada com sucesso.
                  <br/><br/>
                  Pode acompanhar o estado na secção <strong className="text-blue-600">"Os Meus Momentos"</strong>.
                </p>
                <button 
                  onClick={onClose} 
                  className="w-full py-5 bg-slate-900 text-white font-black uppercase text-xs tracking-[0.2em] rounded-2xl shadow-xl hover:bg-black transition-all active:scale-[0.98]"
                >
                  Concluir e Voltar
                </button>
              </motion.div>
            ) : (
              <div className="p-6 md:p-8">
                {bookingStep === 'main' && !showGuidePrompt && !showGuideList && !showMap && (
                  <>
                    {trail.type === 'trail' && (
                      <div className="grid grid-cols-3 gap-4 mb-8">
                        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex flex-col items-center text-center">
                          <Ruler className="w-5 h-5 text-blue-500 mb-2" />
                          <span className="text-xs text-slate-400 uppercase font-bold tracking-wider">{t('trail_distance')}</span>
                          <span className="font-bold text-slate-700">{trail.distance || '--'}</span>
                        </div>
                        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex flex-col items-center text-center">
                          <Clock className="w-5 h-5 text-amber-500 mb-2" />
                          <span className="text-xs text-slate-400 uppercase font-bold tracking-wider">{t('trail_duration')}</span>
                          <span className="font-bold text-slate-700">{trail.duration || '--'}</span>
                        </div>
                        <div className={`p-4 rounded-2xl border flex flex-col items-center text-center ${getDifficultyColor(trail.difficulty)}`}>
                          <BarChart3 className="w-5 h-5 mb-2" />
                          <span className="text-xs opacity-70 uppercase font-bold tracking-wider">{t('trail_difficulty')}</span>
                          <span className="font-bold">{getDifficultyLabel(trail.difficulty) || '--'}</span>
                        </div>
                      </div>
                    )}
                    <div className="space-y-4">
                      <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2"><Info className="w-5 h-5 text-blue-500" /> Informações</h3>
                      <p className="text-slate-600 leading-relaxed">{trail.description}</p>
                      <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-100">
                        <span className="text-sm font-bold text-slate-400 uppercase tracking-wider">Custo de Entrada:</span>
                        <span className={trail.isPaid ? "text-blue-600 font-bold" : "text-green-600 font-bold"}>
                          {trail.isPaid ? `${trail.price}€ por pessoa` : 'Grátis'}
                        </span>
                      </div>
                    </div>
                    <div className="mt-8 flex flex-col gap-3">
                      {trail.isPaid && (
                        <button onClick={handleStartBooking} className="w-full py-4 bg-pink-600 hover:bg-pink-700 text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-pink-100 transition-all">
                          <Check className="w-5 h-5" /> Fazer Reserva
                        </button>
                      )}
                      <button onClick={() => trail.mapUrl ? window.open(trail.mapUrl, '_blank') : handleDirectionsClick()} className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg transition-all ${trail.isPaid ? 'bg-slate-800 text-white hover:bg-slate-900' : 'bg-blue-600 text-white hover:bg-blue-700'}`}>
                        <Navigation className="w-5 h-5" /> Obter Direções
                      </button>
                    </div>
                  </>
                )}

                {bookingStep === 'datetime' && (
                  <div className="space-y-8">
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-bold text-slate-800 flex items-center gap-2"><Calendar className="w-5 h-5 text-pink-500" /> Selecione a Data</h4>
                        <div className="flex items-center gap-2">
                          <button onClick={() => setCalendarMonth(new Date(calendarMonth.setMonth(calendarMonth.getMonth() - 1)))} className="p-1 hover:bg-slate-100 rounded-full"><ChevronLeft size={16}/></button>
                          <span className="text-xs font-bold text-slate-600 uppercase tracking-widest">{monthNames[calendarMonth.getMonth()]} {calendarMonth.getFullYear()}</span>
                          <button onClick={() => setCalendarMonth(new Date(calendarMonth.setMonth(calendarMonth.getMonth() + 1)))} className="p-1 hover:bg-slate-100 rounded-full"><ChevronRight size={16}/></button>
                        </div>
                      </div>
                      <div className="grid grid-cols-7 gap-1">
                        {["D","S","T","Q","Q","S","S"].map(d => <div key={d} className="text-[10px] font-black text-slate-400 text-center py-2">{d}</div>)}
                        {Array.from({ length: firstDayOfMonth(calendarMonth.getFullYear(), calendarMonth.getMonth()) }).map((_, i) => <div key={`empty-${i}`} />)}
                        {Array.from({ length: daysInMonth(calendarMonth.getFullYear(), calendarMonth.getMonth()) }).map((_, i) => {
                          const day = i + 1;
                          const date = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), day);
                          const isSelected = selectedDate?.toDateString() === date.toDateString();
                          const isPast = date < new Date(new Date().setHours(0,0,0,0));
                          return (
                            <button key={day} disabled={isPast} onClick={() => setSelectedDate(date)} className={`h-10 rounded-xl text-sm font-bold transition-all ${isSelected ? 'bg-pink-500 text-white shadow-md' : isPast ? 'text-slate-200 cursor-not-allowed' : 'text-slate-600 hover:bg-pink-50'}`}>
                              {day}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                    {selectedDate && (
                      <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                        <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><Clock className="w-5 h-5 text-pink-500" /> Horário</h4>
                        <div className="grid grid-cols-3 gap-2">
                          {timeSlots.map(time => (
                            <button key={time} onClick={() => setSelectedTime(time)} className={`py-3 rounded-xl font-bold text-sm border-2 transition-all ${selectedTime === time ? 'border-pink-500 bg-pink-50 text-pink-700' : 'border-slate-100 text-slate-400 hover:border-slate-200'}`}>
                              {time}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                    <button disabled={!selectedDate || !selectedTime} onClick={() => setBookingStep('details')} className={`w-full py-4 rounded-2xl font-bold text-white transition-all shadow-lg ${(!selectedDate || !selectedTime) ? 'bg-slate-200 cursor-not-allowed' : 'bg-pink-600 hover:bg-pink-700'}`}>Seguinte</button>
                  </div>
                )}

                {bookingStep === 'details' && (
                  <div className="space-y-6">
                    <h4 className="font-bold text-slate-800 flex items-center gap-2"><User className="w-5 h-5 text-pink-500" /> Os Seus Dados</h4>
                    <div className="space-y-4">
                      <div>
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1 block">Nome Completo</label>
                        <div className="relative">
                          <User className="absolute left-3 top-3.5 text-slate-300 w-5 h-5" />
                          <input type="text" value={customerName} onChange={(e) => setCustomerName(e.target.value)} className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none transition-all font-medium" placeholder="João Silva" />
                        </div>
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1 block">Email</label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3.5 text-slate-300 w-5 h-5" />
                          <input type="email" value={customerEmail} onChange={(e) => setCustomerEmail(e.target.value)} className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none transition-all font-medium" placeholder="joao@email.com" />
                        </div>
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1 block">Telemóvel</label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-3.5 text-slate-300 w-5 h-5" />
                          <input type="tel" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none transition-all font-medium" placeholder="+351 912 345 678" />
                        </div>
                      </div>
                    </div>
                    <button disabled={!customerName || !customerEmail || !customerPhone} onClick={() => setBookingStep('payment')} className="w-full py-4 bg-pink-600 text-white font-bold rounded-2xl shadow-lg hover:bg-pink-700 transition-all disabled:bg-slate-200">Seguinte</button>
                  </div>
                )}

                {bookingStep === 'payment' && (
                  <div className="space-y-6">
                    <h4 className="font-bold text-slate-800 flex items-center gap-2"><Wallet className="w-5 h-5 text-pink-500" /> Pagamento</h4>
                    <div className="grid grid-cols-1 gap-3">
                      <button onClick={() => setPaymentType('presencial')} className={`p-4 rounded-2xl border-2 flex items-center gap-4 transition-all ${paymentType === 'presencial' ? 'border-pink-500 bg-pink-50' : 'border-slate-100 hover:border-slate-200'}`}>
                        <div className={`p-3 rounded-xl ${paymentType === 'presencial' ? 'bg-pink-100 text-pink-600' : 'bg-slate-50 text-slate-400'}`}><Wallet size={24}/></div>
                        <div className="text-left"><p className="font-bold text-slate-800">Pagamento no Local</p><p className="text-xs text-slate-500">Pague quando chegar</p></div>
                      </button>
                      <button onClick={() => setPaymentType('mbway')} className={`p-4 rounded-2xl border-2 flex items-center gap-4 transition-all ${paymentType === 'mbway' ? 'border-pink-500 bg-pink-50' : 'border-slate-100 hover:border-slate-200'}`}>
                        <div className={`p-3 rounded-xl ${paymentType === 'mbway' ? 'bg-pink-100 text-pink-600' : 'bg-slate-50 text-slate-400'}`}><Smartphone size={24}/></div>
                        <div className="text-left"><p className="font-bold text-slate-800">MBWay</p><p className="text-xs text-slate-500">Pagamento instantâneo</p></div>
                      </button>
                      <button onClick={() => setPaymentType('transfer')} className={`p-4 rounded-2xl border-2 flex items-center gap-4 transition-all ${paymentType === 'transfer' ? 'border-pink-500 bg-pink-50' : 'border-slate-100 hover:border-slate-200'}`}>
                        <div className={`p-3 rounded-xl ${paymentType === 'transfer' ? 'bg-pink-100 text-pink-600' : 'bg-slate-50 text-slate-400'}`}><CreditCard size={24}/></div>
                        <div className="text-left"><p className="font-bold text-slate-800">Cartão / Transferência</p><p className="text-xs text-slate-500">Visa, Mastercard</p></div>
                      </button>
                      <button 
                        disabled={trail.isPaid && userCredits < (trail.price || 0)}
                        onClick={() => setPaymentType('points')} 
                        className={`p-4 rounded-2xl border-2 flex items-center gap-4 transition-all ${paymentType === 'points' ? 'border-pink-500 bg-pink-50' : 'border-slate-100 hover:border-slate-200'} ${trail.isPaid && userCredits < (trail.price || 0) ? 'opacity-50 cursor-not-allowed grayscale' : ''}`}
                      >
                        <div className={`p-3 rounded-xl ${paymentType === 'points' ? 'bg-pink-100 text-pink-600' : 'bg-slate-50 text-slate-400'}`}><Star size={24}/></div>
                        <div className="text-left">
                          <p className="font-bold text-slate-800">Créditos Azores4you</p>
                          <p className="text-xs text-slate-500">Saldo: {userCredits} créditos</p>
                          {trail.isPaid && userCredits < (trail.price || 0) && <p className="text-[10px] text-red-500 font-bold mt-1">Saldo insuficiente</p>}
                        </div>
                      </button>
                    </div>

                    {paymentType === 'mbway' && (
                      <div className="animate-in slide-in-from-top-4 duration-300 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <label className="text-xs font-black uppercase text-slate-400 mb-2 block tracking-widest">Telemóvel MBWay</label>
                        <input type="tel" value={mbwayPhone} onChange={(e) => setMbwayPhone(e.target.value)} className="w-full p-4 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-pink-500" placeholder="912 345 678" />
                      </div>
                    )}

                    {paymentType === 'transfer' && (
                      <div className="animate-in slide-in-from-top-4 duration-300 space-y-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <input type="text" value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} className="w-full p-4 bg-white border border-slate-200 rounded-xl outline-none" placeholder="Número do Cartão" />
                        <div className="grid grid-cols-2 gap-3">
                          <input type="text" value={cardExpiry} onChange={(e) => setCardExpiry(e.target.value)} className="w-full p-4 bg-white border border-slate-200 rounded-xl outline-none" placeholder="MM/AA" />
                          <input type="text" value={cardCvv} onChange={(e) => setCardCvv(e.target.value)} className="w-full p-4 bg-white border border-slate-200 rounded-xl outline-none" placeholder="CVV" />
                        </div>
                      </div>
                    )}

                    <button onClick={handleFinalize} className="w-full py-4 bg-pink-600 text-white font-bold rounded-2xl shadow-lg hover:bg-pink-700 transition-all flex items-center justify-center gap-2">
                      Confirmar Reserva <ArrowRight size={20} />
                    </button>
                  </div>
                )}

                {showGuidePrompt && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center py-8">
                    <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6"><Users className="w-10 h-10" /></div>
                    <h3 className="text-2xl font-bold text-slate-800 mb-2">{t('guide_ask_title')}</h3>
                    <p className="text-slate-500 mb-10 max-w-sm mx-auto">{t('guide_ask_desc')}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <button onClick={() => handleGuideResponse(true)} className="py-4 bg-blue-600 text-white font-bold rounded-2xl shadow-lg hover:bg-blue-700 transition-colors">{t('guide_yes')}</button>
                      <button onClick={() => handleGuideResponse(false)} className="py-4 bg-slate-100 text-slate-600 font-bold rounded-2xl hover:bg-slate-200 transition-colors">{t('guide_no')}</button>
                    </div>
                  </motion.div>
                )}

                {showGuideList && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold text-slate-800">{t('guide_list_title')}</h3>
                      <button onClick={() => { setShowGuideList(false); setShowMap(true); }} className="text-sm font-bold text-blue-600 hover:underline">{t('guide_no')}</button>
                    </div>
                    <div className="space-y-4 relative">
                      <AnimatePresence>
                        {isCheckingGuide && (
                          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-[10] bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center gap-3 rounded-2xl">
                            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                            <p className="text-[10px] font-black text-slate-800 uppercase tracking-widest">{t('checking_availability')}</p>
                          </motion.div>
                        )}
                        {guideError && (
                          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-[10] bg-white/95 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center rounded-2xl">
                            <div className="w-16 h-16 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mb-4"><Check className="w-8 h-8 rotate-45 opacity-40" /></div>
                            <h4 className="font-black text-slate-900 tracking-tight">{t('no_availability')}</h4>
                            <p className="text-xs text-slate-500 mt-1 mb-6">{t('try_another')}</p>
                            <button onClick={() => setGuideError(false)} className="px-8 py-3 bg-slate-900 text-white rounded-xl font-bold text-[10px] uppercase tracking-widest">Ok</button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                      {TOUR_GUIDES.map((guide) => (
                        <div key={guide.id} onClick={() => handleGuideSelect(guide.id)} className="bg-slate-50 border border-slate-100 p-4 rounded-2xl flex items-center gap-4 hover:border-blue-200 transition-colors group cursor-pointer">
                          <img src={guide.image} alt={guide.name} className="w-16 h-16 rounded-xl object-cover shadow-sm" />
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <h4 className="font-bold text-slate-800">{guide.name}</h4>
                              <div className="flex items-center gap-1 text-amber-500 text-xs font-bold"><Star className="w-3 h-3 fill-current" />{guide.rating}</div>
                            </div>
                            <p className="text-xs text-slate-500 mb-2">{guide.specialty}</p>
                            <div className="flex items-center gap-3">
                              <div className="flex items-center gap-1 text-[10px] text-slate-400 font-medium"><Languages className="w-3 h-3" />{guide.languages.join(', ')}</div>
                              <div className="text-xs font-bold text-blue-600">€{guide.price} <span className="text-[10px] text-slate-400 font-normal">{t('guide_per_person')}</span></div>
                            </div>
                          </div>
                          <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-300 group-hover:border-blue-500 group-hover:text-blue-500 transition-all"><Check className="w-4 h-4" /></div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {showMap && (
                  <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-bold text-slate-800">{t('trail_directions')}</h3>
                      <button onClick={() => setShowMap(false)} className="text-sm font-bold text-blue-600 hover:underline">{t('nav_back_home')}</button>
                    </div>
                    <div className="aspect-video bg-slate-200 rounded-3xl overflow-hidden relative group">
                      <img src={`https://picsum.photos/seed/${trail.id}/800/450?grayscale&blur=2`} className="w-full h-full object-cover opacity-50" alt="Map Placeholder" />
                      <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                        <div className="w-16 h-16 bg-white rounded-full shadow-xl flex items-center justify-center text-blue-600 mb-4 group-hover:scale-110 transition-transform"><Navigation className="w-8 h-8" /></div>
                        <p className="text-slate-600 font-bold mb-2">Google Maps / OpenStreetMap</p>
                        <p className="text-xs text-slate-400 max-w-xs">A carregar o percurso detalhado para {trail.title}...</p>
                      </div>
                      <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 800 450">
                        <path 
                          d="M 100 350 Q 200 100 400 225 T 700 100" 
                          fill="none" 
                          stroke="#2563eb" 
                          strokeWidth="4" 
                          strokeDasharray="8 8"
                          className="animate-[dash_20s_linear_infinite]"
                        />
                      </svg>
                    </div>
                    
                    <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100 flex items-start gap-3">
                      <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                      <p className="text-xs text-blue-700 leading-relaxed">
                        Siga as marcações oficiais no terreno. Em caso de emergência, contacte o 112. Descarregue o mapa offline antes de iniciar.
                      </p>
                    </div>
                  </motion.div>
                )}

                {/* Footer Action */}
                {bookingStep !== 'success' && (
                  <div className="mt-8 pt-8 border-t border-slate-100">
                    <button 
                      className="w-full py-4 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-2xl transition-all active:scale-[0.98]"
                      onClick={onClose}
                    >
                      {t('nav_back_home')}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
          {/* Loading Overlay (Internal to Panel) */}
          <AnimatePresence>
            {isCheckingGuide && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-[100] bg-white/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center"
              >
                <div className="w-16 h-16 border-4 border-pink-100 border-t-pink-600 rounded-full animate-spin mb-4" />
                <p className="font-black text-slate-900 uppercase tracking-tighter text-xl">A processar...</p>
                <p className="text-sm text-slate-500 mt-2 font-medium">Estamos a enviar o seu pedido.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default TrailModal;
