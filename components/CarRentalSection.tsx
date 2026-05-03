
import React, { useState, useEffect } from 'react';
import { Car, CarRentalCompany, Language, Itinerary } from '../types';
import { CAR_RENTAL_COMPANIES } from '../constants';
import { MapPin, Mail, Phone, ArrowLeft, Check, X, Car as CarIcon, Info, Calendar, Ban, ArrowRight, User, Fuel, ChevronDown } from 'lucide-react';
import { getTranslation } from '../translations';
import DatePicker from './DatePicker';

interface CarRentalSectionProps {
  cars: Car[];
  currentItinerary: Itinerary;
  onUpdateItinerary: (update: Partial<Itinerary>) => void;
  language: Language;
  onNext: () => void;
  onSkip: () => void;
  isAuthenticated?: boolean;
  onShowAuth?: () => void;
}

const CarRentalSection: React.FC<CarRentalSectionProps> = ({
  cars,
  currentItinerary,
  onUpdateItinerary,
  language,
  onNext,
  onSkip,
  isAuthenticated,
  onShowAuth
}) => {
  const [selectedCompany, setSelectedCompany] = useState<CarRentalCompany | null>(null);
  const [selectedCarForDetail, setSelectedCarForDetail] = useState<Car | null>(null);
  const [carDays, setCarDays] = useState(currentItinerary?.carDays || 3);
  if (!currentItinerary) return null;
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  // Simulate unavailable dates
  const getUnavailableDates = (seed: number) => {
    const dates: Date[] = [];
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    
    for (let i = 0; i < 5; i++) {
      const day = ((seed + i * 7) % 28) + 1;
      dates.push(new Date(currentYear, currentMonth, day));
      dates.push(new Date(currentYear, currentMonth + 1, day));
    }
    return dates;
  };

  const carUnavailableDates = getUnavailableDates(20);

  const calculateDays = (start: Date, end: Date) => {
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return diffDays + 1; // Days of use
  };

  const handleDateSelect = (start: Date, end: Date) => {
    const days = calculateDays(start, end);
    setCarDays(days);
    onUpdateItinerary({ 
      carDays: days,
      carStartDate: start.toISOString(),
      carEndDate: end.toISOString()
    });
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '---';
    return new Date(dateStr).toLocaleDateString(language === 'pt' ? 'pt-PT' : 'en-US', {
      day: '2-digit',
      month: 'short'
    });
  };

  const handleCompanyClick = (company: CarRentalCompany) => {
    setSelectedCompany(company);
  };

  const handleBackToCompanies = () => {
    setSelectedCompany(null);
  };

  const handleCarClick = (car: Car) => {
    setSelectedCarForDetail(car);
  };

  const handleCarSelect = (car: Car) => {
    if (!car.isAvailable) return;
    
    if (!isAuthenticated && onShowAuth) {
      onShowAuth();
    } else {
      onUpdateItinerary({ car, carDays });
      setSelectedCarForDetail(null);
    }
  };

  const getCarTypeTranslation = (type: string) => {
    const key = `car_type_${type}`;
    // @ts-ignore
    const trans = getTranslation(language, key);
    return trans && trans !== key ? trans : type;
  };

  const getFuelIcon = (fuel: string) => {
    return <Fuel className="w-4 h-4" />;
  };
  
  const destinationCode = currentItinerary?.flight?.destination || 'all';

  return (
    <div className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-md flex items-end md:items-center justify-center p-0 md:p-4">
      <div className="bg-white w-full max-w-6xl md:rounded-2xl max-h-[92vh] overflow-hidden flex flex-col shadow-2xl animate-in slide-in-from-bottom-8 duration-500">
        
        {/* Header */}
        <div className="bg-white px-6 py-4 border-b flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-green-600 p-2 rounded-xl shadow-md">
              <CarIcon className="text-white w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800 tracking-tight">
                {selectedCompany ? selectedCompany.name : getTranslation(language, 'rent_car')}
              </h2>
              <p className="text-slate-500 flex items-center gap-1 text-xs font-medium">
                <MapPin className="w-3 h-3 text-green-500" /> 
                {getTranslation(language, 'car_pickup')} <span className="text-green-600 font-bold">{destinationCode === 'all' ? 'Açores' : destinationCode}</span>
              </p>
            </div>
          </div>

          <div 
            onClick={() => setIsDatePickerOpen(true)}
            className="flex items-center gap-4 bg-slate-50 hover:bg-slate-100 p-3 rounded-2xl cursor-pointer transition-all border border-slate-200 group"
          >
             <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-green-600" />
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-slate-400 uppercase leading-none mb-1">{getTranslation(language, 'pickup_date')}</span>
                  <span className="text-xs font-bold text-slate-700">{formatDate(currentItinerary?.carStartDate)}</span>
                </div>
             </div>
             <div className="w-px h-6 bg-slate-200" />
             <div className="flex items-center gap-2">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-slate-400 uppercase leading-none mb-1">{getTranslation(language, 'return_date')}</span>
                  <span className="text-xs font-bold text-slate-700">{formatDate(currentItinerary?.carEndDate)}</span>
                </div>
             </div>
             <div className="w-px h-6 bg-slate-200" />
             <div className="flex items-center gap-2">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-slate-400 uppercase leading-none mb-1">{getTranslation(language, 'days')}</span>
                  <span className="text-xs font-bold text-green-600">{carDays}</span>
                </div>
                <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-green-600 transition-colors" />
             </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto bg-slate-50 flex-1 scrollbar-hide">
          {selectedCompany ? (
            <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-500">
              <button 
                onClick={handleBackToCompanies}
                className="flex items-center gap-2 text-blue-600 font-bold hover:text-blue-700 transition-colors mb-4"
              >
                <ArrowLeft className="w-5 h-5" /> {getTranslation(language, 'nav_back_home')}
              </button>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {cars.filter(c => c.companyId === selectedCompany.id).map(car => {
                  const isSelected = currentItinerary.car?.id === car.id;
                  const totalCarPrice = car.pricePerDay * carDays;
                  
                  return (
                    <div 
                      key={car.id}
                      onClick={() => handleCarClick(car)}
                      className={`group bg-white rounded-2xl overflow-hidden transition-all duration-300 border-2 flex flex-col h-full
                        ${!car.isAvailable ? 'opacity-75 grayscale-[0.5]' : 'cursor-pointer'}
                        ${isSelected 
                          ? 'border-green-600 shadow-xl scale-[1.01]' 
                          : car.isAvailable ? 'border-transparent shadow-sm hover:shadow-md hover:border-green-200' : 'border-slate-100 shadow-none'}`}
                    >
                      <div className="relative h-40 bg-slate-100 flex items-center justify-center p-4 overflow-hidden">
                        <img 
                          src={car.image} 
                          alt={car.model} 
                          className="w-full h-auto object-contain group-hover:scale-110 transition-transform duration-500" 
                        />
                        <div className="absolute top-2 right-2 flex flex-col gap-2 items-end">
                           <span className="bg-slate-800 text-white text-[8px] font-black tracking-widest px-2 py-1 rounded-md uppercase">
                              {getCarTypeTranslation(car.type)}
                           </span>
                           {!car.isAvailable && (
                             <span className="bg-red-500 text-white text-[8px] font-black tracking-widest px-2 py-1 rounded-md uppercase">
                                {getTranslation(language, 'unavailable')}
                             </span>
                           )}
                        </div>
                        {isSelected && (
                          <div className="absolute inset-0 bg-green-600/20 backdrop-blur-[1px] flex items-center justify-center">
                             <div className="bg-green-600 text-white p-2 rounded-full shadow-lg border-2 border-white/20">
                               <Check className="w-5 h-5" />
                             </div>
                          </div>
                        )}
                      </div>

                      <div className="p-5 flex-1 flex flex-col">
                        <div className="flex justify-between items-start mb-1">
                           <h3 className="text-lg font-bold text-slate-800 leading-tight">{car.model}</h3>
                           {car.isAvailable && (
                             <div className="text-right shrink-0">
                                <p className="text-[10px] font-bold text-slate-400 uppercase leading-none mb-0.5">{getTranslation(language, 'daily_rate')}</p>
                                <p className="text-sm font-bold text-slate-700">€{car.pricePerDay}</p>
                             </div>
                           )}
                        </div>
                        <p className="text-sm text-slate-500 font-medium mb-4">
                           {car.seats} {getTranslation(language, 'seats')}
                        </p>
                        
                        <div className="mt-auto pt-4 border-t border-slate-50 flex justify-between items-center">
                          {car.isAvailable ? (
                            <>
                              <div>
                                 <p className="text-[9px] font-bold text-green-500 uppercase tracking-wider">
                                   {getTranslation(language, 'total')}
                                 </p>
                                 <p className="text-xl font-black text-slate-900">€{totalCarPrice}</p>
                              </div>
                              <div className={`p-2 rounded-lg transition-all ${isSelected ? 'bg-green-600 text-white' : 'bg-slate-50 text-slate-300 group-hover:bg-green-50 group-hover:text-green-500'}`}>
                                <Info className="w-5 h-5" />
                              </div>
                            </>
                          ) : (
                            <div className="flex items-center gap-2 text-slate-400 font-bold italic text-sm">
                              <X className="w-4 h-4" /> {getTranslation(language, 'unavailable')}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {CAR_RENTAL_COMPANIES.map(company => (
                <div 
                  key={company.id}
                  onClick={() => handleCompanyClick(company)}
                  className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all cursor-pointer group border border-slate-100 flex flex-col"
                >
                  <div className="h-48 overflow-hidden relative">
                    <img 
                      src={company.image} 
                      alt={company.name} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute bottom-4 left-6">
                      <h3 className="text-2xl font-bold text-white">{company.name}</h3>
                    </div>
                  </div>
                  <div className="p-6 space-y-4 flex-1">
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                      <p className="text-sm text-slate-600 leading-snug">{company.address}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-blue-500 shrink-0" />
                      <p className="text-sm text-slate-600">{company.email}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-blue-500 shrink-0" />
                      <p className="text-sm text-slate-600">{company.contact}</p>
                    </div>
                    
                    <div className="pt-4 mt-auto">
                      <button className="w-full py-3 bg-slate-50 group-hover:bg-blue-600 group-hover:text-white text-blue-600 rounded-xl font-bold transition-all flex items-center justify-center gap-2">
                        <CarIcon className="w-5 h-5" /> {getTranslation(language, 'rent_car')}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
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
            <span>{getTranslation(language, 'skip')}</span>
          </button>

          <button 
            onClick={onNext}
            disabled={!currentItinerary?.car}
            className={`px-8 py-3 rounded-xl font-bold text-white shadow-lg transition-all flex items-center gap-2 active:scale-95 text-sm
              ${!currentItinerary?.car 
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none' 
                : 'bg-green-600 hover:bg-green-700 shadow-green-100'}`}
          >
            {getTranslation(language, 'next')}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Car Detail Modal */}
      {selectedCarForDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300 border border-white/20">
            <div className="relative h-48 bg-gradient-to-b from-slate-50 to-white p-6 flex items-center justify-center">
              <img 
                src={selectedCarForDetail.image} 
                alt={selectedCarForDetail.model} 
                className="w-full h-full object-contain drop-shadow-2xl transform hover:scale-105 transition-transform duration-500" 
              />
              <button 
                onClick={() => setSelectedCarForDetail(null)}
                className="absolute top-6 right-6 z-50 p-3 bg-white text-slate-800 hover:bg-blue-600 hover:text-white rounded-full transition-all shadow-lg border border-slate-100 group"
              >
                <X size={20} className="group-active:scale-90 transition-transform" />
              </button>
              <div className="absolute top-6 left-6">
                 <span className="bg-blue-600/10 text-blue-600 text-[10px] font-black tracking-widest px-3 py-1.5 rounded-full uppercase backdrop-blur-sm">
                    {getCarTypeTranslation(selectedCarForDetail.type)}
                 </span>
              </div>
            </div>
            
            <div className="px-8 pb-8 pt-2 space-y-6">
              <div className="text-center">
                <h3 className="text-2xl font-black text-slate-900 mb-1">{selectedCarForDetail.model}</h3>
                <div className="flex items-center justify-center gap-2 text-slate-400 font-bold text-xs uppercase tracking-tighter">
                   <span>{selectedCarForDetail.seats} {getTranslation(language, 'seats')}</span>
                   <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                   <span className="flex items-center gap-1">{getFuelIcon(selectedCarForDetail.fuelType)} {getTranslation(language, ('fuel_' + selectedCarForDetail.fuelType) as any)}</span>
                </div>
              </div>

              <div className="bg-slate-50/50 rounded-3xl p-5 border border-slate-100">
                <p className="text-slate-600 text-sm leading-relaxed text-center font-medium">
                  "{getTranslation(language, selectedCarForDetail.description as any)}"
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {selectedCarForDetail.features.slice(0, 4).map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-[11px] font-bold text-slate-700 bg-white p-3 rounded-2xl border border-slate-100 shadow-sm">
                    <div className="w-5 h-5 rounded-full bg-green-50 flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 text-green-500" />
                    </div>
                    <span className="truncate">{getTranslation(language, feature as any)}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between pt-2">
                <div>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{getTranslation(language, 'daily_rate')}</p>
                   <p className="text-2xl font-black text-slate-900">€{selectedCarForDetail.pricePerDay}</p>
                </div>
                <div className="text-right">
                   <p className="text-[10px] font-black text-green-500 uppercase tracking-widest">{getTranslation(language, 'total')} ({carDays} {getTranslation(language, 'days')})</p>
                   <p className="text-2xl font-black text-green-600">€{selectedCarForDetail.pricePerDay * carDays}</p>
                </div>
              </div>

              <div className="pt-2">
                {selectedCarForDetail.isAvailable ? (
                  <button 
                    onClick={() => handleCarSelect(selectedCarForDetail)}
                    className="w-full py-4 bg-slate-900 hover:bg-black text-white rounded-[1.5rem] font-black shadow-xl shadow-slate-200 transition-all active:scale-95 flex items-center justify-center gap-3 group"
                  >
                    {currentItinerary.car?.id === selectedCarForDetail.id ? 'Veículo Selecionado' : 'Reservar Agora'}
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                ) : (
                  <div className="w-full py-4 bg-slate-100 text-slate-400 rounded-[1.5rem] font-black text-center flex items-center justify-center gap-2">
                    <Ban className="w-5 h-5" /> {getTranslation(language, 'unavailable')}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <DatePicker 
        isOpen={isDatePickerOpen}
        onClose={() => setIsDatePickerOpen(false)}
        onSelect={handleDateSelect}
        title={getTranslation(language, 'select_dates')}
        initialStartDate={currentItinerary.carStartDate ? new Date(currentItinerary.carStartDate) : undefined}
        initialEndDate={currentItinerary.carEndDate ? new Date(currentItinerary.carEndDate) : undefined}
        unavailableDates={carUnavailableDates}
      />
    </div>
  );
};


export default CarRentalSection;
