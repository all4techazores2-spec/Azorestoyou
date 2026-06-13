
import React, { useState, useEffect } from 'react';
import { Restaurant, Language, OrderItem, Dish, Business, Service } from '../types';
import { X, Star, ChevronLeft, ChevronRight, CalendarCheck, Ear, StopCircle, Clock, Users, CreditCard, CheckCircle, ArrowRight, ArrowLeft, Calendar, Plus, Minus, UtensilsCrossed, Wallet, Ban, Phone, Mail, MapPin, Map, Info, ShoppingBag, Sparkles, Smartphone, Scissors, ThumbsUp } from 'lucide-react';
import { COLORS } from '../constants';
import { getTranslation } from '../translations';
import { motion, AnimatePresence } from 'motion/react';
import { API_BASE_URL } from '../config';

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
  onShowMap?: (url: string) => void;
}

type BookingStep = 'info' | 'datetime' | 'menu' | 'success';
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
  userProfile,
  onShowMap
}) => {
  // API_BASE_URL centralized in config.ts

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [bookingStep, setBookingStep] = useState<BookingStep>('info');
  const [guests, setGuests] = useState(2);
  const [licensePlate, setLicensePlate] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [showBookingPopup, setShowBookingPopup] = useState(false);
  const [popupStep, setPopupStep] = useState<PopupStep>('notes');
  const [bookingNote, setBookingNote] = useState('');
  const [prepTimeChoice, setPrepTimeChoice] = useState<'now' | 'at_reservation' | 'custom'>('at_reservation');
  const [customPrepTime, setCustomPrepTime] = useState('');
  const [paymentType, setPaymentType] = useState<'mbway' | 'transfer' | 'points' | 'reserve' | null>('reserve');
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [customerEmail, setCustomerEmail] = useState(userProfile?.email || 'traveler@azorestoyou.com');
  const [customerPhone, setCustomerPhone] = useState(userProfile?.phone || '+351 912 345 678');
  const [customerName, setCustomerName] = useState(userProfile?.name || 'Cliente Viajante');
  const [preorderSelected, setPreorderSelected] = useState<boolean | null>(null);
  const [selectedDishIdx, setSelectedDishIdx] = useState<number | null>(null);
  const [showFullMenuPopup, setShowFullMenuPopup] = useState(false);
  
  // Follow and Like state for individual business
  const [isFollowed, setIsFollowed] = useState(() => {
    if (!restaurant) return false;
    return localStorage.getItem(`follow_biz_${restaurant.id}`) === 'true';
  });

  const [isLiked, setIsLiked] = useState(() => {
    if (!restaurant) return false;
    return localStorage.getItem(`like_biz_${restaurant.id}`) === 'true';
  });

  const toggleFollow = () => {
    if (!restaurant) return;
    const next = !isFollowed;
    setIsFollowed(next);
    localStorage.setItem(`follow_biz_${restaurant.id}`, String(next));
  };

  const toggleLike = () => {
    if (!restaurant) return;
    const next = !isLiked;
    setIsLiked(next);
    localStorage.setItem(`like_biz_${restaurant.id}`, String(next));
  };

  const getFollowersCount = () => {
    if (!restaurant) return 0;
    let hash = 0;
    const bizKey = restaurant.id || 'default';
    for (let i = 0; i < bizKey.length; i++) {
      hash = bizKey.charCodeAt(i) + ((hash << 5) - hash);
    }
    const base = Math.abs(hash % 980) + 240; // 240 - 1220 followers base
    return isFollowed ? base + 1 : base;
  };
  
  // Payment states for booking fee
  const [mbwayPhone, setMbwayPhone] = useState(userProfile?.phone || '');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  
  const bookingFee = 5.00; // Default booking fee for Beauty services
  const [firstName, setFirstName] = useState(userProfile?.name ? userProfile.name.split(' ')[0] : '');
  const [lastName, setLastName] = useState(userProfile?.name ? userProfile.name.split(' ').slice(1).join(' ') : '');
  const [selectedServices, setSelectedServices] = useState<any[]>([]);
  const [chairs, setChairs] = useState<any[]>([]);
  const [chairBlocks, setChairBlocks] = useState<any[]>([]);

  useEffect(() => {
    if (restaurant && isBeauty) {
      const loadChairsData = async () => {
        try {
          const API_BASE_URL = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
            ? 'http://localhost:3001'
            : 'https://azorestoyou-1.onrender.com';
          const resChairs = await fetch(`${API_BASE_URL}/api/chairs?businessId=${restaurant.id}`);
          if (resChairs.ok) {
            const dataChairs = await resChairs.json();
            setChairs(dataChairs);
          }
          const resBlocks = await fetch(`${API_BASE_URL}/api/chair-blocks?businessId=${restaurant.id}`);
          if (resBlocks.ok) {
            const dataBlocks = await resBlocks.json();
            setChairBlocks(dataBlocks);
          }
        } catch (e) {
          console.error("Erro ao carregar cadeiras:", e);
        }
      };
      loadChairsData();
    }
  }, [restaurant, isBeauty]);

  const toggleServiceSelection = (service: any) => {
    setSelectedServices(prev => {
      const exists = prev.find(s => s.id === service.id);
      if (exists) {
        return prev.filter(s => s.id !== service.id);
      }
      return [...prev, service];
    });
  };

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

  const isBeauty = restaurant.businessType === 'beauty' || (restaurant.id && restaurant.id.startsWith('BEA')) || (restaurant as any).id?.startsWith('BEA');
  const isShop = restaurant.businessType === 'shop';
  const isAutoRepair = restaurant.businessType === 'auto_repair';
  const isOffice = restaurant.businessType === 'office';

  const getSafeImage = (img: string | undefined | null): string => {
    if (!img) return 'https://picsum.photos/400/300?random=1';
    return img.startsWith('/') ? `${API_BASE_URL}${img}` : img;
  };

  const slides = [
    { image: getSafeImage(restaurant.image), title: restaurant.name, desc: getTranslation(currentLang, 'environment') },
    ...(restaurant.gallery || []).filter(Boolean).map(img => ({ image: getSafeImage(img), title: restaurant.name, desc: getTranslation(currentLang, 'environment') })),
    ...(restaurant.dishes || []).filter(Boolean).map(d => ({ image: getSafeImage(d.image), title: d.name, desc: d.description })),
    ...(restaurant.services || []).filter(Boolean).map(s => ({ image: getSafeImage(s.image || restaurant.image), title: s.name, desc: s.description || '' }))
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

  const [isProcessing, setIsProcessing] = useState(false);

  const handleFinalize = async () => {
    if (isProcessing) return;
    
    // Validar campos obrigatórios para pagamentos online
    if (paymentType === 'mbway' && !mbwayPhone) {
      alert(currentLang === 'pt' ? 'Por favor, insira o número MBWay.' : 'Please enter your MBWay number.');
      return;
    }
    if (paymentType === 'transfer' && (!cardNumber || !cardExpiry || !cardCvv)) {
      alert(currentLang === 'pt' ? 'Por favor, preencha todos os dados do cartão.' : 'Please fill in all card details.');
      return;
    }
    if (paymentType === 'points' && isBeauty && userCredits < bookingFee) {
      alert(currentLang === 'pt' ? 'Saldo de créditos insuficiente.' : 'Insufficient credits.');
      return;
    }

    setIsProcessing(true);

    try {
      // Detetar automaticamente o endereço do backend
      const API_BASE_URL = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
        ? 'http://localhost:3001'
        : 'https://azorestoyou-1.onrender.com';
      
      // Determine if paying online
      const isPaidOnline = paymentType === 'mbway' || paymentType === 'transfer';

      // Preparar dados da reserva
      const reservationData = {
        businessId: restaurant.id,
        businessType: restaurant.businessType,
        customerName: isBeauty ? `${firstName} ${lastName}`.trim() : customerName,
        customerEmail: customerEmail,
        customerPhone: customerPhone,
        date: selectedDate ? selectedDate.toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        time: selectedTime,
        guests: (isBeauty || isAutoRepair || isOffice) ? 1 : guests,
        notes: isAutoRepair ? `[MATRÍCULA: ${licensePlate}] ${bookingNote}` : bookingNote,
        paymentType: paymentType,
        preOrder: isBeauty 
          ? selectedServices.map(s => ({ dish: { name: s.name, price: s.price, duration: s.duration || 30 }, quantity: 1 }))
          : (preorderSelected ? orderItems : []),
        prepRequested: isBeauty ? true : preorderSelected,
        requestedTime: prepTimeChoice === 'custom' ? customPrepTime : prepTimeChoice,
        status: 'pending',
        // Payment details
        paymentDetails: paymentType === 'mbway' ? { mbwayPhone } : paymentType === 'transfer' ? { cardNumber, cardExpiry, cardCvv } : null,
        bookingFee: isBeauty ? bookingFee : 0,
        preOrderCreditsPaid: isPaidOnline && preorderSelected && orderItems.length > 0
      };

      console.log('Iniciando handleFinalize...', reservationData);

      // 1. Enviar Reserva (Endpoint global para todas as categorias)
      const endpoint = `${API_BASE_URL}/api/reservations`;

      console.log('Enviando para endpoint:', endpoint);
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reservationData),
      });

      console.log('Resposta do servidor status:', res.status);
      if (!res.ok) {
        throw new Error('Server error: ' + res.status);
      }

      const data = await res.json();
      console.log('Dados recebidos:', data);

      // 2. Notificar App Principal
      onReserveSuccess?.(data, restaurant.name, restaurant.id);
      
      // 3. Se houver pré-pedido em restaurante, enviar para a cozinha
      if (restaurant.businessType === 'restaurant' && preorderSelected && orderItems.length > 0) {
        console.log('Enviando pedido para a cozinha...');
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

      // 4. Se pagou com pontos e é beleza, descontar créditos
      if (paymentType === 'points' && isBeauty && setUserCredits) {
        console.log('Descontando créditos...');
        setUserCredits(userCredits - bookingFee);
      }

      console.log('Sucesso! Mudando para step success.');
      setBookingStep('success');

      // 5. Créditos por pré-pedido pago online
      if (isPaidOnline && preorderSelected && orderItems.length > 0 && setUserCredits) {
        const earnedFromItems = orderItems.reduce((acc, item) => {
          const dishCredits = (item.dish as any).credits ?? 0;
          return acc + dishCredits * item.quantity;
        }, 0);

        if (earnedFromItems > 0) {
          console.log('Atribuindo créditos:', earnedFromItems);
          setUserCredits(userCredits + earnedFromItems);
        }
      }

      setTimeout(() => {
        console.log('Fechando modal após sucesso.');
        onClose();
      }, 3500);
    } catch (error) {
      console.error('Erro ao processar reserva:', error);
      alert(currentLang === 'pt' ? 'Erro ao processar a marcação. Verifique a sua ligação ao servidor.' : 'Error processing appointment. Check your server connection.');
    } finally {
      setIsProcessing(false);
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

  const timeToMinutes = (t: string) => {
    const [h, m] = t.split(':').map(Number);
    return h * 60 + m;
  };

  const minutesToTime = (min: number) => {
    const h = Math.floor(min / 60);
    const m = min % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  };

  const getFilteredTimeSlots = () => {
    if (!selectedDate) return [];
    const dayOfWeek = selectedDate.getDay(); // 0 = Sunday, 1 = Monday, etc.
    
    // Check if closed on Sunday (0)
    if (isBeauty && dayOfWeek === 0) {
      return []; // Encerrado ao Domingo
    }
    
    let rawHours = restaurant.openingHours || (isBeauty ? '09:00-13:00, 14:00-19:00' : '12:00-15:00, 19:00-23:00');
    
    if (isBeauty) {
      if (dayOfWeek === 6) { // Sábado: 09:00-17:00
        rawHours = '09:00-17:00';
      } else if (dayOfWeek === 5) { // Sexta: 09:00-20:00
        rawHours = '09:00-20:00';
      } else { // Segunda-Quinta: 09:00-19:00
        rawHours = '09:00-19:00';
      }
    }
    
    const ranges = rawHours.split(',').map(r => r.trim());
    const slots: string[] = [];
    
    ranges.forEach(range => {
      const parts = range.split('-');
      if (parts.length === 2) {
        try {
          const startMin = timeToMinutes(parts[0]);
          const endMin = timeToMinutes(parts[1]);
          for (let min = startMin; min < endMin; min += 30) {
            slots.push(minutesToTime(min));
          }
        } catch (e) {}
      }
    });
    
    // If not beauty or no reservations, return standard slots
    if (!isBeauty || !restaurant.reservations) {
      return slots.length > 0 ? slots : (isBeauty ? [
        '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30',
        '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30'
      ] : [
        '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
        '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00'
      ]);
    }
    
    // Filter slots by existing reservation times and duration chosen
    const selectedDateStr = selectedDate.toISOString().split('T')[0];
    const activeReservations = restaurant.reservations.filter((r: any) => 
      (r.status === 'accepted' || r.status === 'pending') &&
      (r.date === selectedDateStr || (r.date.includes('/') && r.date.split('/').reverse().join('-') === selectedDateStr))
    );
    
    const totalDuration = selectedServices.length > 0 
      ? selectedServices.reduce((sum, s) => sum + (s.duration || 30), 0)
      : 30;

    if (isBeauty) {
      const activeChairs = chairs.filter(c => c.isActive !== false);
      if (activeChairs.length > 0) {
        return slots.filter(slot => {
          const slotStart = timeToMinutes(slot);
          const slotEnd = slotStart + totalDuration;
          
          // Check opening hours
          const fallsWithinHours = ranges.some(range => {
            const parts = range.split('-');
            if (parts.length === 2) {
              const startMin = timeToMinutes(parts[0]);
              const endMin = timeToMinutes(parts[1]);
              return slotStart >= startMin && slotEnd <= endMin;
            }
            return false;
          });
          if (!fallsWithinHours) return false;
          
          // Check if at least one chair is available
          const hasAvailableChair = activeChairs.some(chair => {
            const blocks = chairBlocks.filter(b => 
              (b.chairId === chair.id || b.chairId === chair.chairId) &&
              b.date === selectedDateStr &&
              b.status !== 'cancelled' &&
              b.status !== 'completed'
            );
            const hasOverlap = blocks.some(b => {
              const bStart = timeToMinutes(b.startTime);
              const bEnd = timeToMinutes(b.endTime);
              return slotStart < bEnd && slotEnd > bStart;
            });
            return !hasOverlap;
          });
          
          return hasAvailableChair;
        });
      }
    }

    return slots.filter(slot => {
      const slotStart = timeToMinutes(slot);
      const slotEnd = slotStart + totalDuration;
      
      // Check if slot falls outside opening hours
      const fallsWithinHours = ranges.some(range => {
        const parts = range.split('-');
        if (parts.length === 2) {
          const startMin = timeToMinutes(parts[0]);
          const endMin = timeToMinutes(parts[1]);
          return slotStart >= startMin && slotEnd <= endMin;
        }
        return false;
      });
      if (!fallsWithinHours) return false;
      
      // Check overlap with existing active reservations
      const overlaps = activeReservations.some((r: any) => {
        const rStart = timeToMinutes(r.time);
        
        let rDuration = 30;
        if (r.preOrder && r.preOrder.length > 0) {
          rDuration = r.preOrder.reduce((sum: number, item: any) => sum + ((item.dish?.duration || item.duration || 30) * (item.quantity || 1)), 0);
        } else if (r.preorder && r.preorder.length > 0) {
          rDuration = r.preorder.reduce((sum: number, item: any) => sum + ((item.dish?.duration || item.duration || 30) * (item.quantity || 1)), 0);
        }
        const rEnd = rStart + rDuration;
        
        return slotStart < rEnd && slotEnd > rStart;
      });
      
      return !overlaps;
    });
  };

  const timeSlots = getFilteredTimeSlots();

  const getChairsAvailability = () => {
    if (!selectedDate || !selectedTime) return { total: 12, available: 12, isFull: false };
    
    if (isBeauty) {
      return { total: 12, available: 12, isFull: false }; // Always free
    }

    const selectedDateStr = selectedDate.toISOString().split('T')[0];
    const total = restaurant.tables ? restaurant.tables.length : 12;
    
    // Count confirmed bookings at this exact date and time
    const occupiedCount = (restaurant.reservations || []).filter((r: any) => 
      (r.status === 'accepted' || r.status === 'occupied') && 
      r.time === selectedTime && 
      (r.date === selectedDateStr || (r.date.includes('/') && r.date.split('/').reverse().join('-') === selectedDateStr))
    ).length;
    
    const available = Math.max(0, total - occupiedCount);
    return {
      total,
      available,
      isFull: available === 0
    };
  };

  const { total: totalChairs, available: availableChairs, isFull: isTimeFull } = getChairsAvailability();

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
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
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
          className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden max-h-[95vh] flex flex-col border border-white/20"
        >
          {/* Header Image / Slider */}
          {bookingStep === 'info' && (
            <div className="relative h-64 md:h-80 shrink-0">
              <div className="absolute inset-0">
                <AnimatePresence mode="popLayout">
                  <motion.img
                    key={currentSlide}
                    src={slides[currentSlide].image}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.7 }}
                    className="w-full h-full object-cover"
                  />
                </AnimatePresence>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              </div>
              
              <button 
                onClick={onClose} 
                className="absolute top-6 right-6 z-50 p-3 bg-white/90 backdrop-blur text-slate-800 hover:bg-red-500 hover:text-white rounded-full transition-all shadow-lg border border-white/20 group"
              >
                <X size={20} className="group-active:scale-90 transition-transform" />
              </button>

              {slides.length > 1 && (
                <div className="absolute bottom-6 right-6 flex gap-2">
                  <button onClick={(e) => { e.stopPropagation(); prevSlide(); }} className="p-2 bg-white/20 backdrop-blur text-white rounded-full hover:bg-white/40 transition-all border border-white/30">
                    <ChevronLeft size={16} />
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); nextSlide(); }} className="p-2 bg-white/20 backdrop-blur text-white rounded-full hover:bg-white/40 transition-all border border-white/30">
                    <ChevronRight size={16} />
                  </button>
                </div>
              )}

              <div className="absolute bottom-6 left-6 right-20">
                <div className="flex items-center gap-2 text-white/90 text-xs font-black uppercase tracking-widest mb-2">
                  <MapPin className="w-3.5 h-3.5 text-red-400" /> {restaurant.island}
                  <span className="w-1 h-1 bg-white/30 rounded-full"></span>
                  <div className="flex items-center gap-1">
                    <Star size={12} className="text-yellow-400 fill-current" />
                    {restaurant.rating}
                  </div>
                </div>
                <h2 className="text-3xl font-black text-white uppercase tracking-tighter leading-none">{restaurant.name}</h2>
              </div>
            </div>
          )}

          
          {bookingStep !== 'info' && bookingStep !== 'success' && (
            <div className="p-6 border-b border-slate-100 shrink-0 bg-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => {
                    if (bookingStep === 'datetime') setBookingStep('info');
                    if (bookingStep === 'menu') setBookingStep('info');
                  }}
                  className="p-3 bg-white rounded-2xl text-slate-400 hover:text-red-500 transition-all shadow-sm border border-slate-100 active:scale-95"
                >
                  <ArrowLeft size={20} />
                </button>
                <div>
                  <h3 className="font-black text-slate-800 uppercase tracking-tight">
                    {bookingStep === 'menu' ? (isBeauty ? 'Serviços do Salão' : 'Ementa do Restaurante') : 'Confirmar Reserva'}
                  </h3>
                  <div className="flex gap-1.5 mt-1.5">
                    {[1,2,3].map(i => (
                      <div key={i} className={`h-1.5 w-10 rounded-full transition-all duration-500 ${((bookingStep === 'datetime' && i >= 1) || (bookingStep === 'success' && i >= 3)) ? 'bg-red-500 shadow-sm shadow-red-100' : 'bg-slate-200'}`} />
                    ))}
                  </div>
                </div>
              </div>
              <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 transition-colors"><X size={24} /></button>
            </div>
          )}



        {/* Right/Bottom: Info */}
        <div className="flex-1 overflow-y-auto scrollbar-hide">
          <AnimatePresence mode="wait">
            {bookingStep === 'info' && (
              <motion.div 
                key="info"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="p-8 space-y-8"
              >


                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-slate-50 p-4 rounded-[1.5rem] border border-slate-100 flex flex-col items-center text-center">
                      {isBeauty ? <Scissors className="w-5 h-5 text-red-500 mb-2" /> : <UtensilsCrossed className="w-5 h-5 text-red-500 mb-2" />}
                      <span className="text-[10px] text-slate-400 uppercase font-black tracking-widest">{isBeauty ? 'Categoria' : getTranslation(currentLang, 'cuisine')}</span>
                      <span className="font-bold text-slate-700 text-xs mt-1">{restaurant.cuisine}</span>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-[1.5rem] border border-slate-100 flex flex-col items-center text-center">
                      <Star className="w-5 h-5 text-yellow-500 mb-2" />
                      <span className="text-[10px] text-slate-400 uppercase font-black tracking-widest">Avaliação</span>
                      <span className="font-bold text-slate-700 text-xs mt-1">{restaurant.rating} / 5.0</span>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-[1.5rem] border border-slate-100 flex flex-col items-center text-center">
                      <ShoppingBag className="w-5 h-5 text-blue-500 mb-2" />
                      <span className="text-[10px] text-slate-400 uppercase font-black tracking-widest">Reviews</span>
                      <span className="font-bold text-slate-700 text-xs mt-1">{restaurant.reviews}</span>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-[1.5rem] border border-slate-100 flex flex-col items-center text-center">
                      <Clock className="w-5 h-5 text-emerald-500 mb-2" />
                      <span className="text-[10px] text-slate-400 uppercase font-black tracking-widest">Estado</span>
                      <span className="font-bold text-emerald-600 text-[10px] mt-1 uppercase tracking-tighter">Aberto Agora</span>
                    </div>
                  </div>
                  
                  {/* Follow & Like Section */}
                  <div className="flex items-center justify-between bg-slate-50 p-5 rounded-[1.5rem] border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-inner">
                        <Users className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest block leading-none mb-1">Comunidade</span>
                        <span className="text-xs font-black text-slate-700 uppercase tracking-tight">
                          {getFollowersCount()} Seguidores
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={toggleFollow}
                        className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all active:scale-95 flex items-center gap-1.5 shadow-sm
                          ${isFollowed ? 'bg-blue-600 text-white shadow-blue-500/20' : 'bg-white text-slate-600 border border-slate-200/60 hover:bg-slate-50'}`}
                      >
                        <Users size={14} />
                        {isFollowed ? 'A Seguir' : 'Seguir'}
                      </button>
                      <button
                        onClick={toggleLike}
                        className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all active:scale-95 flex items-center gap-1.5 shadow-sm
                          ${isLiked ? 'bg-red-50 text-red-500 border border-red-100 shadow-red-500/5' : 'bg-white text-slate-600 border border-slate-200/60 hover:bg-slate-50'}`}
                      >
                        <ThumbsUp size={14} className={isLiked ? 'fill-current' : ''} />
                        {isLiked ? 'Gostei' : 'Gostar'}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight flex items-center gap-2">
                        <Info className="w-5 h-5 text-red-500" /> {isBeauty ? 'Sobre o Salão' : 'Sobre o Restaurante'}
                      </h3>
                      <button 
                        onClick={handleSpeak}
                        className={`p-2 rounded-xl transition-all ${isSpeaking ? 'bg-red-100 text-red-600 scale-110' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'}`}
                      >
                        <Ear size={20} />
                      </button>
                    </div>
                    <p className="text-slate-600 leading-relaxed font-medium text-sm">{restaurant.description}</p>
                  </div>

                  {/* Contacts Section */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                     {restaurant.phone && (
                        <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:bg-white transition-colors group">
                          <div className="p-2.5 bg-white rounded-xl shadow-sm border border-slate-100 group-hover:bg-red-50 group-hover:border-red-100 transition-all">
                            <Phone className="w-4 h-4 text-slate-400 group-hover:text-red-500" />
                          </div>
                          <span className="text-xs font-black text-slate-700 tracking-tight">{restaurant.phone}</span>
                        </div>
                     )}
                     {restaurant.publicEmail && (
                        <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:bg-white transition-colors group">
                          <div className="p-2.5 bg-white rounded-xl shadow-sm border border-slate-100 group-hover:bg-blue-50 group-hover:border-blue-100 transition-all">
                            <Mail className="w-4 h-4 text-slate-400 group-hover:text-blue-500" />
                          </div>
                          <span className="text-xs font-black text-slate-700 truncate tracking-tight">{restaurant.publicEmail}</span>
                        </div>
                     )}
                     <div className="md:col-span-2 flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:bg-white transition-colors group">
                        <div className="p-2.5 bg-white rounded-xl shadow-sm border border-slate-100 group-hover:bg-emerald-50 group-hover:border-emerald-100 transition-all shrink-0">
                          <MapPin className="w-4 h-4 text-slate-400 group-hover:text-emerald-500" />
                        </div>
                        <span className="text-xs font-black text-slate-700 tracking-tight truncate">{restaurant.island}, Azores</span>
                     </div>
                  </div>

                  {/* Main Action Button */}
                  <div className="flex flex-col gap-3 pb-8">
                    <button 
                      onClick={() => setBookingStep('menu')}
                      className="w-full py-5 bg-white text-red-600 border-2 border-red-100 rounded-[1.75rem] font-black uppercase text-[11px] tracking-[0.2em] shadow-xl shadow-red-500/5 hover:bg-red-50 hover:border-red-500 transition-all flex items-center justify-center gap-3 active:scale-95 group"
                    >
                      {isBeauty ? <Scissors className="w-5 h-5 group-hover:rotate-12 transition-transform" /> : <UtensilsCrossed className="w-5 h-5 group-hover:rotate-12 transition-transform" />} 
                      {isBeauty ? 'Ver Serviços' : 'Ver Ementa'}
                      <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transform translate-x-[-10px] group-hover:translate-x-0 transition-all" />
                    </button>
                    <button 
                      onClick={startBooking}
                      className="w-full py-5 bg-red-600 text-white rounded-[1.75rem] font-black uppercase text-[11px] tracking-[0.2em] shadow-2xl shadow-red-500/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
                    >
                      <CalendarCheck className="w-5 h-5" /> 
                      {isBeauty ? 'Agendar Serviço' : 'Fazer Reserva Agora'}
                      <ArrowRight className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => {
                        const query = `${restaurant.name}, ${restaurant.island}, Azores`;
                        const url = restaurant.mapUrl || `https://maps.google.com/maps?q=${encodeURIComponent(query)}&output=embed`;
                        if (onShowMap) {
                          onShowMap(url);
                          onClose();
                        } else {
                          window.open(url, '_blank');
                        }
                      }}
                      className="w-full py-5 bg-slate-900 text-white rounded-[1.75rem] font-black uppercase text-[11px] tracking-[0.2em] shadow-2xl shadow-slate-900/10 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
                    >
                      <Map className="w-5 h-5" />
                      Obter Direções
                    </button>
                  </div>
                </motion.div>
              )}


            {bookingStep === 'datetime' && (
              <motion.div 
                key="datetime"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="p-8 space-y-8"
              >
                {/* Number of People */}
                {!isBeauty && !isAutoRepair && !isOffice && (
                  <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-black text-slate-800 uppercase tracking-tight flex items-center gap-2">
                          <Users className="w-5 h-5 text-red-500" /> Número de Pessoas
                        </h4>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Selecione para quantas pessoas</p>
                      </div>
                      <div className="flex items-center gap-4 bg-white p-2 rounded-2xl shadow-sm border border-slate-100">
                        <button onClick={() => setGuests(Math.max(1, guests - 1))} className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all">
                          <Minus size={18} />
                        </button>
                        <span className="text-xl font-black text-slate-900 w-8 text-center">{guests}</span>
                        <button onClick={() => setGuests(guests + 1)} className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all">
                          <Plus size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Calendar Integrated */}
                <div className="space-y-4">
                  <h4 className="font-black text-slate-800 uppercase tracking-tight flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-red-500" /> Selecione o Dia
                  </h4>
                  {renderCalendar()}
                </div>

                {/* Time Slots Integrated */}
                {selectedDate && (
                  <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                    <h4 className="font-black text-slate-800 uppercase tracking-tight flex items-center gap-2">
                      <Clock className="w-5 h-5 text-red-500" /> Horários Disponíveis
                    </h4>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                      {timeSlots.map(time => (
                        <button 
                          key={time} 
                          onClick={() => setSelectedTime(time)}
                          className={`py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-widest border-2 transition-all active:scale-95
                            ${selectedTime === time 
                              ? 'border-red-500 bg-red-50 text-red-700 shadow-md' 
                              : 'border-slate-100 text-slate-400 hover:border-slate-200 hover:bg-slate-50'}`}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Final Details Popup Modal */}
                <AnimatePresence>
                  {selectedDate && selectedTime && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                      {/* Dark blurred glass backdrop */}
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedTime(null)}
                        className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl"
                      />
                      
                      {/* Premium Center Modal Container */}
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.9, y: 30 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 30 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 220 }}
                        className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-[3rem] p-8 shadow-2xl text-white space-y-6 overflow-y-auto max-h-[90vh] z-10 scrollbar-thin"
                      >
                        {/* Close button */}
                        <button 
                          onClick={() => setSelectedTime(null)}
                          className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/5 text-white flex items-center justify-center hover:bg-white/10 active:scale-95 transition-all"
                        >
                          <X size={18} />
                        </button>

                        <div className="flex items-center justify-between pr-8">
                          <div>
                            <h4 className="text-2xl font-black uppercase tracking-tighter">Detalhes Finais</h4>
                            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-1">Personalize a sua reserva</p>
                          </div>
                          <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
                            <CheckCircle className="text-red-500" />
                          </div>
                        </div>

                        <div className="bg-white/5 border border-white/5 rounded-2xl p-4 flex items-center justify-between text-xs font-bold">
                          <div className="flex items-center gap-2 text-slate-300">
                            <Calendar size={14} className="text-red-500" />
                            <span>{selectedDate.toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-2 text-slate-300">
                            <Clock size={14} className="text-red-500" />
                            <span>{selectedTime}</span>
                          </div>
                        </div>

                        {isBeauty ? (
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 block">Primeiro Nome</label>
                                <input 
                                  type="text"
                                  value={firstName}
                                  onChange={(e) => setFirstName(e.target.value)}
                                  placeholder="Ex: João"
                                  className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-sm font-bold text-white focus:ring-2 focus:ring-red-500 outline-none transition-all"
                                  required
                                />
                              </div>
                              <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 block">Último Nome</label>
                                <input 
                                  type="text"
                                  value={lastName}
                                  onChange={(e) => setLastName(e.target.value)}
                                  placeholder="Ex: Silva"
                                  className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-sm font-bold text-white focus:ring-2 focus:ring-red-500 outline-none transition-all"
                                  required
                                />
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 block">Telemóvel</label>
                                <input 
                                  type="tel"
                                  value={customerPhone}
                                  onChange={(e) => setCustomerPhone(e.target.value)}
                                  placeholder="9xxxxxxxx"
                                  className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-sm font-bold text-white focus:ring-2 focus:ring-red-500 outline-none transition-all"
                                  required
                                />
                              </div>
                              <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 block">Email</label>
                                <input 
                                  type="email"
                                  value={customerEmail}
                                  onChange={(e) => setCustomerEmail(e.target.value)}
                                  placeholder="email@exemplo.com"
                                  className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-sm font-bold text-white focus:ring-2 focus:ring-red-500 outline-none transition-all"
                                  required
                                />
                              </div>
                            </div>

                            {/* Mini-POS Services selector */}
                            <div>
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 block">Selecione os Serviços (Mini-POS)</label>
                              <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                                {(restaurant.services && restaurant.services.length > 0 ? restaurant.services : [
                                  { id: 's1', name: 'Corte Masculino', price: 12.00, duration: 30 },
                                  { id: 's2', name: 'Barba Tradicional', price: 8.00, duration: 20 },
                                  { id: 's3', name: 'Corte + Barba', price: 18.00, duration: 45 },
                                  { id: 's4', name: 'Degradê', price: 15.00, duration: 30 },
                                  { id: 's5', name: 'Coloração', price: 25.00, duration: 60 }
                                ]).map((s: any) => {
                                  const isSelected = selectedServices.some(item => item.id === s.id);
                                  return (
                                    <div 
                                      key={s.id} 
                                      onClick={() => toggleServiceSelection(s)}
                                      className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                                        isSelected 
                                          ? 'border-red-500 bg-red-500/10 text-white shadow-md' 
                                          : 'border-white/10 bg-white/5 text-slate-300 hover:bg-white/10'
                                      }`}
                                    >
                                      <div>
                                        <p className="text-xs font-black uppercase tracking-tight">{s.name}</p>
                                        <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{s.duration || 30} minutos</p>
                                      </div>
                                      <span className="text-xs font-black text-red-500">{s.price}€</span>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        ) : (
                          isBeauty && (
                            <div className={`p-4 rounded-2xl border text-xs font-bold flex items-center justify-between transition-all ${
                              isTimeFull 
                                ? 'bg-red-500/10 border-red-500/25 text-red-400' 
                                : 'bg-emerald-500/10 border-emerald-500/25 text-emerald-400'
                            }`}>
                              <div className="flex items-center gap-2">
                                <Scissors size={14} className={isTimeFull ? 'text-red-400' : 'text-emerald-400'} />
                                <span>{isTimeFull ? 'Sem vagas de serviço disponíveis' : 'Vagas de serviço disponíveis'}</span>
                              </div>
                              <span className="font-black text-sm">{isTimeFull ? 'Esgotado' : `${availableChairs} / ${totalChairs}`}</span>
                            </div>
                          )
                        )}

                        <div className="space-y-4">
                          {isBeauty && isTimeFull && (
                            <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl text-xs text-red-400 font-bold leading-relaxed text-center">
                              ⚠️ Lamento, mas já não temos vagas (cadeiras livres) disponíveis para este horário ({selectedTime}). Por favor, escolha outra hora.
                            </div>
                          )}

                          <div>
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2 block">Alguma nota ou restrição?</label>
                            <textarea 
                              value={bookingNote}
                              onChange={(e) => setBookingNote(e.target.value)}
                              placeholder="Ex: Alergias, mesa perto da janela, aniversário..."
                              className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-red-500 outline-none transition-all resize-none h-24"
                            />
                          </div>



                          {/* Dynamic Payment Fields */}
                          {paymentType === 'mbway' && (
                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-2 pt-2">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1 block">Número de Telemóvel MBWay</label>
                              <input 
                                type="tel"
                                value={mbwayPhone}
                                onChange={(e) => setMbwayPhone(e.target.value)}
                                placeholder="9xxxxxxxx"
                                className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-sm font-bold text-white focus:ring-2 focus:ring-red-500 outline-none transition-all"
                              />
                            </motion.div>
                          )}

                          {paymentType === 'transfer' && (
                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-4 pt-2">
                              <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1 block">Número do Cartão</label>
                                <input 
                                  type="text"
                                  value={cardNumber}
                                  onChange={(e) => setCardNumber(e.target.value)}
                                  placeholder="0000 0000 0000 0000"
                                  className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-sm font-bold text-white focus:ring-2 focus:ring-red-500 outline-none transition-all"
                                />
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1 block">Validade</label>
                                  <input 
                                    type="text"
                                    value={cardExpiry}
                                    onChange={(e) => setCardExpiry(e.target.value)}
                                    placeholder="MM/AA"
                                    className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-sm font-bold text-white focus:ring-2 focus:ring-red-500 outline-none transition-all"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1 block">CVV</label>
                                  <input 
                                    type="text"
                                    value={cardCvv}
                                    onChange={(e) => setCardCvv(e.target.value)}
                                    placeholder="000"
                                    className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-sm font-bold text-white focus:ring-2 focus:ring-red-500 outline-none transition-all"
                                  />
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </div>

                        <button 
                          disabled={isProcessing || !paymentType || (isBeauty && isTimeFull) || (isBeauty && selectedServices.length === 0)}
                          onClick={handleFinalize}
                          className={`w-full py-5 rounded-[1.5rem] font-black uppercase text-[11px] tracking-[0.2em] shadow-2xl transition-all active:scale-95 flex items-center justify-center gap-3 mt-4
                            ${(!paymentType || isProcessing || (isBeauty && isTimeFull) || (isBeauty && selectedServices.length === 0)) 
                              ? 'bg-slate-800 text-slate-600 cursor-not-allowed' 
                              : 'bg-red-600 text-white shadow-red-900/40 hover:bg-red-700'}`}
                        >
                          {isProcessing ? 'A processar...' : (isBeauty && isTimeFull) ? 'Sem vagas disponíveis' : (isBeauty && selectedServices.length === 0) ? 'Selecione pelo menos 1 serviço' : 'Confirmar Reserva'}
                          <ArrowRight className="w-5 h-5" />
                        </button>
                      </motion.div>
                    </div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}

            {bookingStep === 'menu' && (
              <motion.div 
                key="menu"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="p-8 space-y-8"
              >
                <div className="flex items-center justify-between mb-2">
                   <div>
                      <h4 className="text-2xl font-black text-slate-800 uppercase tracking-tighter">Sugestões do Chef</h4>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Conheça as nossas especialidades</p>
                   </div>
                   <div className="w-12 h-12 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center shadow-sm">
                      <Sparkles size={24} />
                   </div>
                </div>

                {restaurant.dishes && restaurant.dishes.length > 0 ? (
                  <div className="grid grid-cols-2 gap-6">
                    {restaurant.dishes.map((dish, idx) => (
                      <motion.div 
                        key={idx}
                        whileHover={{ y: -8 }}
                        onClick={() => setSelectedDishIdx(idx)}
                        className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-sm hover:shadow-2xl transition-all cursor-pointer group"
                      >
                        <div className="relative aspect-square overflow-hidden bg-slate-50">
                          <img 
                            src={getSafeImage(dish.image)} 
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                            alt={dish.name} 
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center">
                             <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all shadow-lg">
                               <ArrowRight size={20} className="text-red-600" />
                             </div>
                          </div>
                          <div className="absolute top-4 right-4 px-3 py-1.5 bg-white/95 backdrop-blur-md rounded-xl text-[10px] font-black text-red-600 shadow-sm flex flex-col items-center justify-center gap-0.5 min-w-[50px]">
                            {(dish as any).promoPrice ? (
                              <>
                                <span className="line-through text-slate-400 text-[8px] font-bold leading-none">Antes: {dish.price}€</span>
                                <span className="text-emerald-600 leading-none mt-0.5">Agora: {(dish as any).promoPrice}€</span>
                              </>
                            ) : (
                              <span>{dish.price}€</span>
                            )}
                          </div>
                          <div className="absolute top-4 left-4 flex flex-col gap-1.5">
                            <span className="px-2 py-0.5 bg-red-600 rounded-full text-[8px] font-black text-white uppercase tracking-widest flex items-center gap-1 shadow-lg">
                              <Sparkles size={8} /> Sugestão
                            </span>
                            {(dish as any).promoPrice && (
                              <span className={`px-2 py-0.5 rounded-full text-[8px] font-black text-white uppercase tracking-widest flex items-center gap-1 shadow-lg ${(dish as any).promoType === 'week' ? 'bg-gradient-to-r from-amber-500 to-orange-600' : 'bg-gradient-to-r from-emerald-500 to-teal-600'}`}>
                                {(dish as any).promoType === 'week' ? 'Promo da Semana' : 'Promo do Dia'}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="p-6">
                           <h5 className="text-xs font-black text-slate-800 uppercase truncate leading-none mb-1">{dish.name}</h5>
                           <div className="flex items-center justify-between">
                              <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Especialidade Local</span>
                              <div className="flex items-center gap-1">
                                 <Star size={10} className="text-yellow-400 fill-current" />
                                 <span className="text-[9px] font-black text-slate-400">4.9</span>
                              </div>
                           </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="py-20 text-center bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
                    <UtensilsCrossed size={48} className="mx-auto text-slate-300 mb-4" />
                    <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">Ementa em atualização...</p>
                  </div>
                )}

                {restaurant.businessType === 'restaurant' && (
                  <div className="flex flex-col gap-3">
                    <button 
                      onClick={() => setShowFullMenuPopup(true)}
                      className="w-full py-5 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-[1.5rem] font-black uppercase text-[11px] tracking-[0.2em] shadow-xl shadow-blue-500/20 active:scale-95 transition-all flex items-center justify-center gap-3 cursor-pointer"
                    >
                      <UtensilsCrossed size={18} /> Ver Ementa Completa
                    </button>
                    <button 
                      onClick={() => setBookingStep('datetime')}
                      className="w-full py-5 bg-red-600 text-white rounded-[1.5rem] font-black uppercase text-[11px] tracking-[0.2em] shadow-2xl shadow-red-500/20 active:scale-95 transition-all flex items-center justify-center gap-3 cursor-pointer"
                    >
                      <CalendarCheck size={18} /> Reservar Mesa Agora
                    </button>
                  </div>
                )}

                <AnimatePresence>
                  {selectedDishIdx !== null && restaurant.dishes && restaurant.dishes[selectedDishIdx] && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 z-[110] bg-slate-900/95 backdrop-blur-2xl flex items-center justify-center p-6 sm:p-12"
                    >
                      <button 
                        onClick={() => setSelectedDishIdx(null)}
                        className="absolute top-8 right-8 p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl transition-all border-none shadow-lg shadow-blue-500/40 z-[120] cursor-pointer"
                      >
                        <X size={24} />
                      </button>
                      
                      <div className="flex flex-col md:flex-row items-center gap-12 w-full max-w-5xl">
                         {/* Navigation Arrows (Desktop) */}
                         <button 
                           onClick={() => setSelectedDishIdx((selectedDishIdx - 1 + restaurant.dishes!.length) % restaurant.dishes!.length)}
                           className="hidden md:flex p-5 bg-white/10 text-white rounded-3xl hover:bg-white/20 transition-all border border-white/10 shadow-2xl"
                         >
                           <ChevronLeft size={32} />
                         </button>

                         <div className="flex-1 flex flex-col md:flex-row items-center gap-12">
                            <motion.div 
                              key={`dish-img-${selectedDishIdx}`}
                              initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
                              animate={{ opacity: 1, scale: 1, rotate: 0 }}
                              className="w-full md:w-[450px] aspect-square rounded-[3.5rem] overflow-hidden shadow-[0_35px_60px_-15px_rgba(0,0,0,0.5)] border-8 border-white/5"
                            >
                              <img 
                                src={getSafeImage(restaurant.dishes[selectedDishIdx].image)} 
                                className="w-full h-full object-cover" 
                                alt="Dish Immersive" 
                              />
                            </motion.div>

                            <motion.div 
                              key={`dish-text-${selectedDishIdx}`}
                              initial={{ opacity: 0, x: 30 }}
                              animate={{ opacity: 1, x: 0 }}
                              className="flex-1 text-center md:text-left text-white space-y-6"
                            >
                               <div>
                                 <span className="px-4 py-1 bg-red-600 rounded-full text-[10px] font-black uppercase tracking-widest mb-4 inline-block shadow-lg shadow-red-900/40">
                                   Especialidade Sugerida
                                 </span>
                                 <h3 className="text-3xl md:text-6xl font-black uppercase tracking-tighter leading-none mb-4">{restaurant.dishes[selectedDishIdx].name}</h3>
                                 <p className="text-lg md:text-xl text-white/60 font-bold leading-relaxed max-w-md mx-auto md:mx-0">{restaurant.dishes[selectedDishIdx].description}</p>
                               </div>
                               
                               <div className="flex flex-col md:flex-row items-center gap-6 pt-4">
                                  {(restaurant.dishes[selectedDishIdx] as any).promoPrice ? (
                                    <div className="flex flex-col items-center md:items-start">
                                      <div className="flex items-center gap-2 mb-1">
                                        <span className="line-through text-white/40 text-sm font-bold">Antes: {restaurant.dishes[selectedDishIdx].price}€</span>
                                        <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black text-white uppercase tracking-wider ${(restaurant.dishes[selectedDishIdx] as any).promoType === 'week' ? 'bg-amber-500' : 'bg-emerald-500'}`}>
                                          {(restaurant.dishes[selectedDishIdx] as any).promoType === 'week' ? 'Promoção da Semana' : 'Promoção do Dia'}
                                        </span>
                                      </div>
                                      <span className="text-5xl font-black text-emerald-400 drop-shadow-2xl mt-1">Agora: {(restaurant.dishes[selectedDishIdx] as any).promoPrice}€</span>
                                    </div>
                                  ) : (
                                    <div className="text-6xl font-black text-white drop-shadow-2xl">{restaurant.dishes[selectedDishIdx].price}€</div>
                                  )}
                                  <div className="h-10 w-[1px] bg-white/10 hidden md:block" />
                                  <div className="flex flex-col items-center md:items-start opacity-50">
                                     <span className="text-[10px] font-black uppercase tracking-widest">Disponível em</span>
                                     <span className="text-xs font-bold">{restaurant.name}</span>
                                  </div>
                               </div>

                               <button 
                                 onClick={() => {
                                   setSelectedDishIdx(null);
                                   setBookingStep('datetime');
                                 }}
                                 className="w-full md:w-auto px-10 py-5 bg-red-600 text-white rounded-[2rem] font-black uppercase text-[11px] tracking-[0.2em] shadow-2xl shadow-red-600/40 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 group"
                               >
                                 <CalendarCheck size={18} className="group-hover:rotate-12 transition-transform" />
                                 Reservar Mesa Agora
                               </button>

                               {/* Mobile Navigation */}
                               <div className="flex md:hidden justify-center gap-4 pt-4">
                                  <button 
                                    onClick={() => setSelectedDishIdx((selectedDishIdx - 1 + restaurant.dishes!.length) % restaurant.dishes!.length)} 
                                    className="p-4 bg-white/10 rounded-2xl"
                                  >
                                    <ChevronLeft size={24} />
                                  </button>
                                  <button 
                                    onClick={() => setSelectedDishIdx((selectedDishIdx + 1) % restaurant.dishes!.length)} 
                                    className="p-4 bg-white/10 rounded-2xl"
                                  >
                                    <ChevronRight size={24} />
                                  </button>
                               </div>
                            </motion.div>
                         </div>

                         <button 
                           onClick={() => setSelectedDishIdx((selectedDishIdx + 1) % restaurant.dishes!.length)}
                           className="hidden md:flex p-5 bg-white/10 text-white rounded-3xl hover:bg-white/20 transition-all border border-white/10 shadow-2xl"
                         >
                           <ChevronRight size={32} />
                         </button>
                      </div>

                      {/* Counter Indicator */}
                      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/40 text-[10px] font-black uppercase tracking-[0.3em]">
                        {selectedDishIdx + 1} de {restaurant.dishes.length} especialidades
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}

            {bookingStep === 'success' && (
              <motion.div 
                key="success"
                initial={{ opacity: 0, scale: 0.95 }} 
                animate={{ opacity: 1, scale: 1 }} 
                className="h-full flex flex-col items-center justify-center p-12 text-center min-h-[500px]"
              >
                <div className="w-24 h-24 bg-emerald-50 text-emerald-600 rounded-[2.5rem] flex items-center justify-center mb-8 shadow-xl shadow-emerald-100 animate-bounce">
                  <CheckCircle size={48} strokeWidth={3} />
                </div>
                <h3 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">{getTranslation(currentLang, 'booking_success')}</h3>
                <p className="text-slate-500 mb-10 max-w-sm leading-relaxed font-medium">
                  A sua reserva em <strong className="text-slate-800">{restaurant.name}</strong> para o dia <strong className="text-red-600">{selectedDate?.toLocaleDateString()}</strong> às <strong className="text-red-600">{selectedTime}</strong> foi confirmada.
                  <br/><br/>
                  Receberá uma confirmação no seu e-mail.
                </p>
                <button 
                  onClick={onClose} 
                  className="w-full py-5 bg-slate-900 text-white font-black uppercase text-xs tracking-[0.2em] rounded-2xl shadow-xl hover:bg-black transition-all active:scale-[0.98]"
                >
                  Concluir e Voltar
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        {/* Full Menu Popup */}
        <AnimatePresence>
          {showFullMenuPopup && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[150] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 md:p-6"
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white rounded-[3rem] w-full max-w-2xl overflow-hidden shadow-2xl relative border border-slate-100 flex flex-col max-h-[90vh] p-8"
              >
                {/* Header */}
                <div className="flex justify-between items-center pb-6 border-b border-slate-100 mb-6">
                  <div className="text-left">
                    <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Ementa Completa</h3>
                    <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mt-1">Todos os pratos disponíveis</p>
                  </div>
                  <button 
                    onClick={() => setShowFullMenuPopup(false)}
                    className="p-3 bg-slate-100 text-slate-800 hover:bg-red-500 hover:text-white rounded-full transition-all shadow-md cursor-pointer"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Dishes list/grid */}
                <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                  <div className="grid grid-cols-2 gap-4 pb-4">
                    {restaurant.dishes?.map((dish, idx) => (
                      <div 
                        key={idx}
                        onClick={() => {
                          setSelectedDishIdx(idx);
                        }}
                        className="bg-slate-50 border border-slate-100 rounded-[2rem] p-4 flex flex-col justify-between hover:shadow-lg transition-all cursor-pointer group"
                      >
                        <div className="h-32 rounded-[1.5rem] overflow-hidden bg-slate-200 mb-3 relative">
                          <img src={getSafeImage(dish.image)} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                          <div className="absolute top-2 right-2 px-2.5 py-1 bg-white/90 backdrop-blur-md rounded-lg text-[9px] font-black text-slate-800 shadow-sm">
                            {dish.price}€
                          </div>
                        </div>
                        <h4 className="text-xs font-black text-slate-800 uppercase truncate mb-1">{dish.name}</h4>
                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest truncate">{dish.description || 'Especialidade da Casa'}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
    </AnimatePresence>
  );
};

export default RestaurantModal;
