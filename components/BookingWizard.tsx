
import React, { useState, useEffect } from 'react';
import { Itinerary, Language, Hotel, Car } from '../types';
import { Check, Car as CarIcon, BedDouble, Calendar, ArrowRight, Ban, Star, MapPin, ChevronDown, Hotel as HotelIcon, Home, SlidersHorizontal } from 'lucide-react';
import { getTranslation } from '../translations';
import DatePicker from './DatePicker';
import { motion, AnimatePresence } from 'motion/react';
import AccommodationDetailModal from './AccommodationDetailModal';
import RoomExtrasModal from './RoomExtrasModal';
import BookingCheckoutModal from './BookingCheckoutModal';

interface BookingWizardProps {
  step: 'accommodation' | 'car';
  currentItinerary: Itinerary;
  onUpdateItinerary: (update: Partial<Itinerary>) => void;
  onNext: () => void;
  onSkip: () => void;
  language?: Language;
  isAuthenticated?: boolean;
  onShowAuth?: () => void;
  onComplete?: () => void;
  onClose?: () => void;
  // Dynamic Data Props
  hotels?: Hotel[];
  cars?: Car[];
}

const BookingWizard: React.FC<BookingWizardProps> = ({ 
  step, 
  currentItinerary, 
  onUpdateItinerary, 
  onNext, 
  onSkip, 
  language = 'pt', 
  isAuthenticated, 
  onShowAuth,
  onComplete,
  onClose,
  hotels = [],
  cars = []
}) => {
  const [nights, setNights] = useState(currentItinerary?.nights || 3);
  const [carDays, setCarDays] = useState(currentItinerary?.carDays || 3);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [hotelUnavailableDates, setHotelUnavailableDates] = useState<Date[]>([]);
  const [carUnavailableDates, setCarUnavailableDates] = useState<Date[]>([]);
  const [isChecking, setIsChecking] = useState(false);
  const [availabilityError, setAvailabilityError] = useState<{title: string, desc: string} | null>(null);
  const [accommodationType, setAccommodationType] = useState<'hotel' | 'al'>('hotel');
  const [maxPrice, setMaxPrice] = useState<number>(300);
  const [selectedAccommodationForDetail, setSelectedAccommodationForDetail] = useState<Hotel | null>(null);
  const [showExtras, setShowExtras] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [isBooked, setIsBooked] = useState(false);

  const currentLang = language as Language;

  // Simulate unavailable dates
  const getUnavailableDates = (seed: number) => {
    const dates: Date[] = [];
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    
    // Add some random dates in the current and next month
    for (let i = 0; i < 5; i++) {
      const day = ((seed + i * 7) % 28) + 1;
      dates.push(new Date(currentYear, currentMonth, day));
      dates.push(new Date(currentYear, currentMonth + 1, day));
    }
    return dates;
  };

  useEffect(() => {
    setHotelUnavailableDates(getUnavailableDates(10));
    setCarUnavailableDates(getUnavailableDates(20));
  }, []);

  useEffect(() => {
    if (step === 'accommodation') {
      onUpdateItinerary({ nights });
    } else if (step === 'car') {
      onUpdateItinerary({ carDays });
    }
  }, [nights, carDays, step]);

  if (!currentItinerary) return null;

  const destinationCode = currentItinerary?.flight?.destination || 'all';
  const availableHotels = hotels.filter(h => 
    (destinationCode === 'all' || h.island === destinationCode) && 
    h.type === accommodationType &&
    h.pricePerNight <= maxPrice
  );
  const availableCars = cars; 

  const calculateDiff = (start: Date, end: Date) => {
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleDateSelect = (start: Date, end: Date) => {
    const diff = calculateDiff(start, end);
    if (step === 'accommodation') {
      const nights = diff || 1; // At least 1 night if same day? No, usually same day is not allowed.
      setNights(nights);
      onUpdateItinerary({ 
        nights: nights,
        hotelStartDate: start.toISOString(),
        hotelEndDate: end.toISOString()
      });
    } else {
      const days = diff + 1; // Days of use
      setCarDays(days);
      onUpdateItinerary({ 
        carDays: days,
        carStartDate: start.toISOString(),
        carEndDate: end.toISOString()
      });
    }
  };

  const getCarTypeTranslation = (type: string) => {
    const key = `car_type_${type}`;
    // @ts-ignore - dynamic key access
    const trans = getTranslation(currentLang, key);
    return trans && trans !== key ? trans : type;
  };

  const handleSelection = (update: Partial<Itinerary>) => {
    if (!isAuthenticated && onShowAuth) {
      onShowAuth();
      return;
    }

    setIsChecking(true);
    setAvailabilityError(null);

    // Simulate Server-side check
    setTimeout(() => {
      setIsChecking(false);
      
      // Simulation: certain IDs are "Full"
      const itemId = update.hotel?.id || update.car?.id || '';
      
      // Randomly fail or fail based on ID for simulation
      const shouldFail = (itemId.toString().includes('2') || itemId.toString().includes('5'));

      if (shouldFail) {
        setAvailabilityError({
          title: getTranslation(currentLang, 'no_availability'),
          desc: getTranslation(currentLang, 'try_another')
        });
      } else {
        onUpdateItinerary(update);
      }
    }, 1200);
  };

  const handleAccommodationConfirm = (hotel: Hotel, selectedRoom?: any, rentType?: 'room' | 'house') => {
    onUpdateItinerary({ 
      ...currentItinerary, 
      hotel,
      selectedRoom,
      rentType
    });
    setSelectedAccommodationForDetail(null);
    setShowExtras(true); // Open Extras instead of Car
  };

  const handleExtrasConfirm = (extras: any[]) => {
    onUpdateItinerary({
      ...currentItinerary,
      selectedExtras: extras
    });
    setShowExtras(false);
    setShowCheckout(true);
  };

  const handleBookingComplete = () => {
    setShowCheckout(false);
    setIsBooked(true);
    if (onComplete) {
      onComplete();
    }
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '---';
    return new Date(dateStr).toLocaleDateString(currentLang === 'pt' ? 'pt-PT' : 'en-US', {
      day: '2-digit',
      month: 'short'
    });
  };

  if (step === 'accommodation') {
    return (
      <div className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-md flex items-end md:items-center justify-center p-0 md:p-4">
        <div className="bg-white w-full max-w-6xl md:rounded-2xl max-h-[92vh] overflow-hidden flex flex-col shadow-2xl animate-in slide-in-from-bottom-8 duration-500">
           
           {/* Compact Header */}
           <div className="bg-white px-6 py-4 border-b flex flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="bg-slate-900 p-2 rounded-xl shadow-md">
                  <BedDouble className="text-white w-5 h-5" />
                </div>
                <div className="hidden sm:block">
                  <h2 className="text-xl font-black text-slate-900 tracking-tight">
                    {getTranslation(currentLang, 'select_hotel')}
                  </h2>
                  <p className="text-slate-500 flex items-center gap-1 text-xs font-medium">
                    <MapPin className="w-3 h-3 text-slate-400" /> 
                    {getTranslation(currentLang, 'hotel_avail')} <span className="text-slate-900 font-black">{destinationCode === 'all' ? 'Açores' : destinationCode}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                 <div 
                  onClick={() => setIsDatePickerOpen(true)}
                  className="hidden md:flex items-center gap-4 bg-slate-50 hover:bg-slate-100 p-3 rounded-2xl cursor-pointer transition-all border border-slate-200 group"
                >
                   <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-slate-400 group-hover:text-slate-900 transition-colors" />
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black text-slate-400 uppercase leading-none mb-1">{getTranslation(currentLang, 'check_in')}</span>
                        <span className="text-xs font-bold text-slate-700">{formatDate(currentItinerary.hotelStartDate)}</span>
                      </div>
                   </div>
                   <div className="w-px h-6 bg-slate-200" />
                   <div className="flex items-center gap-2">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black text-slate-400 uppercase leading-none mb-1">{getTranslation(currentLang, 'check_out')}</span>
                        <span className="text-xs font-bold text-slate-700">{formatDate(currentItinerary.hotelEndDate)}</span>
                      </div>
                   </div>
                   <div className="w-px h-6 bg-slate-200" />
                   <div className="flex items-center gap-2">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black text-slate-400 uppercase leading-none mb-1">{getTranslation(currentLang, 'nights')}</span>
                        <span className="text-xs font-black text-slate-900">{nights}</span>
                      </div>
                      <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-slate-900 transition-colors" />
                   </div>
                </div>

                <button 
                  onClick={onClose || onSkip}
                  className="p-3 bg-slate-100 hover:bg-slate-200 rounded-full transition-all text-slate-400 hover:text-slate-900 shadow-sm"
                >
                   <X className="w-6 h-6" />
                </button>
              </div>
           </div>

           {/* New Filter Bar */}
           <div className="px-6 py-4 bg-white border-b flex flex-wrap items-center justify-between gap-6">
              {/* Type Switcher */}
              <div className="flex bg-slate-100 p-1 rounded-2xl gap-1">
                 <button 
                   onClick={() => setAccommodationType('hotel')}
                   className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all
                     ${accommodationType === 'hotel' 
                       ? 'bg-white text-slate-900 shadow-md ring-1 ring-slate-200' 
                       : 'text-slate-400 hover:text-slate-600'}`}
                 >
                    <HotelIcon className={`w-4 h-4 ${accommodationType === 'hotel' ? 'text-blue-600' : 'text-slate-400'}`} />
                    Hotéis
                 </button>
                 <button 
                   onClick={() => setAccommodationType('al')}
                   className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all
                     ${accommodationType === 'al' 
                       ? 'bg-white text-slate-900 shadow-md ring-1 ring-slate-200' 
                       : 'text-slate-400 hover:text-slate-600'}`}
                 >
                    <Home className={`w-4 h-4 ${accommodationType === 'al' ? 'text-blue-600' : 'text-slate-400'}`} />
                    AL (Local)
                 </button>
              </div>

              {/* Sophisticated Price Filter */}
              <div className="flex-1 max-w-xs min-w-[200px]">
                 <div className="flex justify-between items-end mb-3">
                    <div className="flex items-center gap-2">
                       <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
                       <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Preço Máximo</span>
                    </div>
                    <span className="text-sm font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-full ring-1 ring-blue-100">
                       €{maxPrice}
                    </span>
                 </div>
                 <div className="relative h-6 flex items-center">
                    <div className="absolute w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                       <div 
                         className="h-full bg-gradient-to-r from-blue-400 to-blue-600 transition-all duration-300"
                         style={{ width: `${(maxPrice / 500) * 100}%` }}
                       />
                    </div>
                    <input 
                      type="range" 
                      min="40" 
                      max="500" 
                      step="5"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(parseInt(e.target.value))}
                      className="absolute w-full h-1.5 opacity-0 cursor-pointer z-10"
                    />
                    <div 
                      className="absolute w-4 h-4 bg-white border-2 border-blue-600 rounded-full shadow-lg pointer-events-none transition-all duration-300"
                      style={{ left: `calc(${(maxPrice / 500) * 100}% - 8px)` }}
                    />
                 </div>
              </div>
           </div>

           {/* Optimized Grid */}
           <div className="p-6 overflow-y-auto bg-slate-50 flex-1 scrollbar-hide relative">
              <AnimatePresence>
                {isChecking && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 z-[100] bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center gap-4"
                  >
                    <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="font-black text-slate-800 uppercase tracking-widest text-[10px]">{getTranslation(currentLang, 'checking_availability')}</p>
                  </motion.div>
                )}

                {availabilityError && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 z-[100] bg-white/90 backdrop-blur-sm flex flex-col items-center justify-center p-8 text-center"
                  >
                    <div className="w-20 h-20 bg-red-50 text-red-600 rounded-[32px] flex items-center justify-center mb-6">
                      <Ban className="w-10 h-10" />
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 mb-2">{availabilityError.title}</h3>
                    <p className="text-slate-500 font-medium mb-8">{availabilityError.desc}</p>
                    <button 
                      onClick={() => setAvailabilityError(null)}
                      className="px-12 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-transform"
                    >
                      Ok
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
              {availableHotels.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center opacity-40">
                  <BedDouble className="w-12 h-12 mb-2" />
                  <p className="text-lg font-bold">{getTranslation(currentLang, 'no_hotels')}</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {availableHotels.map(hotel => {
                    const totalHotelPrice = hotel.pricePerNight * nights;
                    const isSelected = currentItinerary.hotel?.id === hotel.id;

                    return (
                      <div 
                        key={hotel.id} 
                        onClick={() => setSelectedAccommodationForDetail(hotel)}
                        className={`group relative bg-white rounded-2xl overflow-hidden transition-all duration-300 cursor-pointer border-2 flex flex-col
                          ${isSelected 
                            ? 'border-blue-600 shadow-xl scale-[1.01]' 
                            : 'border-transparent shadow-sm hover:shadow-md hover:border-blue-200'}`}
                      >
                        {/* Compact Image Section */}
                        <div className="relative h-36 overflow-hidden bg-slate-200">
                          <img 
                            src={hotel.image} 
                            alt={hotel.name} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                          />
                          
                          {/* Selected Overlay */}
                          {isSelected && (
                            <div className="absolute inset-0 bg-blue-600/20 backdrop-blur-[1px] flex items-center justify-center">
                               <div className="bg-blue-600 text-white p-2 rounded-full shadow-lg scale-110 border-2 border-white/20">
                                 <Check className="w-5 h-5" />
                               </div>
                            </div>
                          )}

                          <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-md px-2 py-0.5 rounded-full flex items-center gap-0.5 shadow-sm">
                             {[...Array(5)].map((_, i) => (
                               <Star key={i} className={`w-2.5 h-2.5 ${i < hotel.stars ? 'text-yellow-500 fill-yellow-500' : 'text-slate-300'}`} />
                             ))}
                          </div>
                          
                          <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-md text-white text-[9px] font-bold px-2 py-1 rounded-md uppercase">
                             {hotel.island}
                          </div>
                        </div>

                        {/* Tighter Content Section */}
                        <div className="p-4 flex-1 flex flex-col">
                          <div className="flex justify-between items-start mb-1 gap-2">
                             <h3 className="text-base font-bold text-slate-800 leading-tight group-hover:text-blue-600 transition-colors">
                                {hotel.name}
                             </h3>
                             <div className="text-right shrink-0">
                                <p className="text-[10px] font-bold text-slate-400 uppercase leading-none mb-0.5">{getTranslation(currentLang, 'per_night')}</p>
                                <p className="text-sm font-bold text-slate-700">€{hotel.pricePerNight}</p>
                             </div>
                          </div>
                          
                          <p className="text-xs text-slate-500 leading-snug line-clamp-2 mb-4">
                            {hotel.description}
                          </p>
                          
                          <div className="mt-auto pt-3 border-t border-slate-50 flex justify-between items-center">
                            <div>
                               <p className="text-[9px] font-bold text-blue-500 uppercase tracking-wider">
                                 {getTranslation(currentLang, 'total')}
                               </p>
                               <p className="text-xl font-black text-slate-900">€{totalHotelPrice}</p>
                            </div>
                            
                            <div className={`p-2 rounded-lg transition-all ${isSelected ? 'bg-blue-600 text-white' : 'bg-slate-50 text-slate-300 group-hover:bg-blue-50 group-hover:text-blue-500'}`}>
                              <ArrowRight className="w-4 h-4" />
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
           </div>

           {/* Tighter Footer */}
           <div className="bg-white p-4 border-t border-slate-100 flex justify-between items-center shadow-[0_-4px_12px_-2px_rgba(0,0,0,0.05)] z-20">
              <button 
                onClick={() => {
                  onUpdateItinerary({ hotel: null });
                  onSkip();
                }} 
                className="flex items-center gap-1.5 text-slate-400 font-bold hover:text-red-500 px-4 py-2.5 rounded-xl hover:bg-red-50 transition-all text-sm"
              >
                <Ban className="w-4 h-4" />
                <span>{getTranslation(currentLang, 'skip')}</span>
              </button>

              <button 
                onClick={onNext}
                disabled={!currentItinerary.hotel}
                className={`px-8 py-3 rounded-xl font-black text-white shadow-lg transition-all flex items-center gap-2 active:scale-95 text-xs uppercase tracking-widest
                  ${!currentItinerary.hotel 
                    ? 'bg-slate-100 text-slate-300 cursor-not-allowed shadow-none' 
                    : 'bg-slate-900 hover:bg-black shadow-slate-200'}`}
              >
                {getTranslation(currentLang, 'next')}
                <ArrowRight className="w-4 h-4" />
              </button>
           </div>
        </div>

        <DatePicker 
          isOpen={isDatePickerOpen}
          onClose={() => setIsDatePickerOpen(false)}
          onSelect={handleDateSelect}
          title={getTranslation(currentLang, 'select_dates')}
          initialStartDate={currentItinerary.hotelStartDate ? new Date(currentItinerary.hotelStartDate) : undefined}
          initialEndDate={currentItinerary.hotelEndDate ? new Date(currentItinerary.hotelEndDate) : undefined}
          unavailableDates={hotelUnavailableDates}
        />

        <AnimatePresence>
          {selectedAccommodationForDetail && (
            <AccommodationDetailModal 
              accommodation={selectedAccommodationForDetail}
              language={language}
              onClose={() => setSelectedAccommodationForDetail(null)}
              onConfirm={handleAccommodationConfirm}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showExtras && (
            <RoomExtrasModal 
              onClose={() => setShowExtras(false)}
              onConfirm={handleExtrasConfirm}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showCheckout && (
            <BookingCheckoutModal 
              itinerary={currentItinerary}
              onClose={() => setShowCheckout(false)}
              onComplete={handleBookingComplete}
            />
          )}
        </AnimatePresence>
      </div>
    );
  }

  if (step === 'car') {
    return (
      <div className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-md flex items-end md:items-center justify-center p-0 md:p-4">
        <div className="bg-white w-full max-w-6xl md:rounded-2xl max-h-[92vh] overflow-hidden flex flex-col shadow-2xl animate-in slide-in-from-bottom-8 duration-500">
           {/* Header */}
           <div className="bg-white px-6 py-4 border-b flex flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="bg-green-600 p-2 rounded-xl shadow-md">
                  <CarIcon className="text-white w-5 h-5" />
                </div>
                <div className="hidden sm:block">
                  <h2 className="text-xl font-bold text-slate-800 tracking-tight">
                    {getTranslation(currentLang, 'rent_car')}
                  </h2>
                  <p className="text-slate-500 flex items-center gap-1 text-xs font-medium">
                    <MapPin className="w-3 h-3 text-green-500" /> 
                    {getTranslation(currentLang, 'car_pickup')} <span className="text-green-600 font-bold">{destinationCode}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                 <div 
                  onClick={() => setIsDatePickerOpen(true)}
                  className="hidden md:flex items-center gap-4 bg-slate-50 hover:bg-slate-100 p-3 rounded-2xl cursor-pointer transition-all border border-slate-200 group"
                >
                   <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-green-600" />
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-slate-400 uppercase leading-none mb-1">{getTranslation(currentLang, 'pickup_date')}</span>
                        <span className="text-xs font-bold text-slate-700">{formatDate(currentItinerary.carStartDate)}</span>
                      </div>
                   </div>
                   <div className="w-px h-6 bg-slate-200" />
                   <div className="flex items-center gap-2">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-slate-400 uppercase leading-none mb-1">{getTranslation(currentLang, 'return_date')}</span>
                        <span className="text-xs font-bold text-slate-700">{formatDate(currentItinerary.carEndDate)}</span>
                      </div>
                   </div>
                   <div className="w-px h-6 bg-slate-200" />
                   <div className="flex items-center gap-2">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-slate-400 uppercase leading-none mb-1">{getTranslation(currentLang, 'days')}</span>
                        <span className="text-xs font-bold text-green-600">{carDays}</span>
                      </div>
                      <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-green-600 transition-colors" />
                   </div>
                </div>

                <button 
                  onClick={onClose || onSkip}
                  className="p-3 bg-slate-100 hover:bg-slate-200 rounded-full transition-all text-slate-400 hover:text-slate-900 shadow-sm"
                >
                   <X className="w-6 h-6" />
                </button>
              </div>
           </div>

           {/* Optimized Grid */}
           <div className="p-6 overflow-y-auto bg-slate-50 flex-1 scrollbar-hide relative">
              <AnimatePresence>
                {isChecking && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 z-[100] bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center gap-4"
                  >
                    <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="font-black text-slate-800 uppercase tracking-widest text-[10px]">{getTranslation(currentLang, 'checking_availability')}</p>
                  </motion.div>
                )}

                {availabilityError && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 z-[100] bg-white/90 backdrop-blur-sm flex flex-col items-center justify-center p-8 text-center"
                  >
                    <div className="w-20 h-20 bg-red-50 text-red-600 rounded-[32px] flex items-center justify-center mb-6">
                      <Ban className="w-10 h-10" />
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 mb-2">{availabilityError.title}</h3>
                    <p className="text-slate-500 font-medium mb-8">{availabilityError.desc}</p>
                    <button 
                      onClick={() => setAvailabilityError(null)}
                      className="px-12 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-transform"
                    >
                      Ok
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {availableCars.map(car => {
                  const totalCarPrice = car.pricePerDay * carDays;
                  const isSelected = currentItinerary.car?.id === car.id;
                  const carTypeTranslated = getCarTypeTranslation(car.type);

                  return (
                    <div 
                      key={car.id} 
                      onClick={() => handleSelection({ car, carDays })}
                      className={`group bg-white rounded-2xl overflow-hidden transition-all duration-300 cursor-pointer border-2 flex flex-col h-full
                        ${isSelected 
                          ? 'border-green-600 shadow-xl scale-[1.01]' 
                          : 'border-transparent shadow-sm hover:shadow-md hover:border-green-200'}`}
                    >
                      <div className="relative h-32 bg-slate-100 flex items-center justify-center p-4 overflow-hidden">
                        <img 
                          src={car.image} 
                          alt={car.model} 
                          className="w-full h-auto object-contain group-hover:scale-110 transition-transform duration-500" 
                        />
                        <div className="absolute top-2 right-2">
                           <span className="bg-slate-800 text-white text-[8px] font-black tracking-widest px-2 py-1 rounded-md uppercase">
                              {carTypeTranslated}
                           </span>
                        </div>
                        {isSelected && (
                          <div className="absolute inset-0 bg-green-600/20 backdrop-blur-[1px] flex items-center justify-center">
                             <div className="bg-green-600 text-white p-2 rounded-full shadow-lg border-2 border-white/20">
                               <Check className="w-5 h-5" />
                             </div>
                          </div>
                        )}
                      </div>

                      <div className="p-4 flex-1 flex flex-col">
                        <div className="flex justify-between items-start mb-0.5">
                           <h3 className="text-base font-bold text-slate-800 leading-tight">{car.model}</h3>
                           <div className="text-right shrink-0">
                              <p className="text-[10px] font-bold text-slate-400 uppercase leading-none mb-0.5">{getTranslation(currentLang, 'daily_rate')}</p>
                              <p className="text-sm font-bold text-slate-700">€{car.pricePerDay}</p>
                           </div>
                        </div>
                        <p className="text-xs text-slate-500 font-medium mb-4">
                           {car.companyId} • {car.seats} {getTranslation(currentLang, 'seats')}
                        </p>
                        
                        <div className="mt-auto pt-3 border-t border-slate-50 flex justify-between items-center">
                           <div>
                              <p className="text-[9px] font-bold text-green-500 uppercase tracking-wider">
                                {getTranslation(currentLang, 'total')}
                              </p>
                              <p className="text-xl font-black text-slate-900">€{totalCarPrice}</p>
                           </div>
                           <div className={`p-2 rounded-lg transition-all ${isSelected ? 'bg-green-600 text-white' : 'bg-slate-50 text-slate-300 group-hover:bg-green-50 group-hover:text-green-500'}`}>
                             <ArrowRight className="w-4 h-4" />
                           </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
           </div>

           {/* Footer */}
           <div className="bg-white p-4 border-t border-slate-100 flex justify-between items-center shadow-[0_-4px_12px_-2px_rgba(0,0,0,0.05)] z-20">
              <button 
                onClick={() => {
                  onUpdateItinerary({ car: null });
                  onSkip();
                }}
                className="flex items-center gap-1.5 text-slate-400 font-bold hover:text-red-500 px-4 py-2.5 rounded-xl hover:bg-red-50 transition-all text-sm"
              >
                <Ban className="w-4 h-4" />
                <span>{getTranslation(currentLang, 'skip')}</span>
              </button>

              <button 
                onClick={onNext}
                disabled={!currentItinerary.car}
                className={`px-8 py-3 rounded-xl font-black text-white shadow-lg transition-all flex items-center gap-2 active:scale-95 text-xs uppercase tracking-widest
                  ${!currentItinerary.car 
                    ? 'bg-slate-100 text-slate-300 cursor-not-allowed shadow-none' 
                    : 'bg-green-600 hover:bg-green-700 shadow-green-100'}`}
              >
                {getTranslation(currentLang, 'next')}
                <ArrowRight className="w-4 h-4" />
              </button>
           </div>
        </div>

        <DatePicker 
          isOpen={isDatePickerOpen}
          onClose={() => setIsDatePickerOpen(false)}
          onSelect={handleDateSelect}
          title={getTranslation(currentLang, 'select_dates')}
          initialStartDate={currentItinerary.carStartDate ? new Date(currentItinerary.carStartDate) : undefined}
          initialEndDate={currentItinerary.carEndDate ? new Date(currentItinerary.carEndDate) : undefined}
          unavailableDates={carUnavailableDates}
        />
      </div>
    );
  }

  return null;
};

export default BookingWizard;
