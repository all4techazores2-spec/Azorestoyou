
import React from 'react';
import { Itinerary, Language } from '../types';
import { X, Plane, BedDouble, Car, Briefcase, ChevronRight } from 'lucide-react';
import { COLORS } from '../constants';
import { getTranslation } from '../translations';

interface PackagePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  itinerary: Itinerary;
  onContinue: () => void;
  language?: Language;
}

const PackagePreviewModal: React.FC<PackagePreviewModalProps> = ({ isOpen, onClose, itinerary, onContinue, language = 'pt' }) => {
  if (!isOpen) return null;

  const flightCost = itinerary.flight?.price || 0;
  if (!itinerary) return null;
  const hotelCost = (itinerary.hotel && itinerary.nights) ? (itinerary.hotel.pricePerNight * itinerary.nights) : 0;
  const carCost = itinerary.car ? (itinerary.car.pricePerDay * itinerary.carDays) : 0;
  const totalCost = flightCost + hotelCost + carCost;
  const currentLang = language as Language;

  const t = (key: any) => getTranslation(currentLang, key);

  return (
    <div className="fixed inset-0 z-[60] flex items-end md:items-center justify-center pointer-events-none">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm pointer-events-auto animate-in fade-in duration-300" 
        onClick={onClose}
      ></div>

      {/* Content */}
      <div className="bg-white w-full max-w-md md:rounded-3xl rounded-t-3xl shadow-2xl overflow-hidden pointer-events-auto animate-in slide-in-from-bottom-10 duration-300 flex flex-col max-h-[85vh]">
        
        <div className="bg-slate-900 p-6 flex justify-between items-center relative overflow-hidden">
           <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-green-500"></div>
           <div className="flex items-center gap-3">
             <div className="p-2 bg-white/10 rounded-lg">
                <Briefcase className="w-6 h-6 text-white" />
             </div>
             <div>
               <h2 className="text-lg font-bold text-white">{t('my_package')}</h2>
               <p className="text-xs text-slate-400">{t('current_selection')}</p>
             </div>
           </div>
           <button 
             onClick={onClose} 
             className="p-3 bg-white text-slate-800 hover:bg-blue-600 hover:text-white rounded-full transition-all shadow-lg border border-slate-100 group"
           >
             <X size={20} className="group-active:scale-90 transition-transform" />
           </button>
        </div>

        <div className="p-6 space-y-4 overflow-y-auto">
          {/* Flight */}
          <div className={`p-4 rounded-xl border-l-4 ${itinerary.flight ? 'bg-blue-50 border-blue-500' : 'bg-slate-50 border-slate-300 border-dashed'}`}>
             <div className="flex justify-between items-start">
                <div className="flex gap-3">
                   <Plane className={`w-5 h-5 ${itinerary.flight ? 'text-blue-600' : 'text-slate-400'}`} />
                   <div>
                     <h3 className={`font-bold text-sm ${itinerary.flight ? 'text-slate-800' : 'text-slate-400'}`}>
                       {itinerary.flight ? `${t('flight_to')} ${itinerary.flight.destination}` : t('flight_none')}
                     </h3>
                     {itinerary.flight && (
                       <p className="text-xs text-slate-500 mt-1">{itinerary.flight.airline} • {itinerary.flight.departureTime}</p>
                     )}
                   </div>
                </div>
                {itinerary.flight && <span className="font-bold text-slate-700">€{flightCost}</span>}
             </div>
          </div>

          {/* Hotel */}
          <div className={`p-4 rounded-xl border-l-4 ${itinerary.hotel ? 'bg-indigo-50 border-indigo-500' : 'bg-slate-50 border-slate-300 border-dashed'}`}>
             <div className="flex justify-between items-start">
                <div className="flex gap-3">
                   <BedDouble className={`w-5 h-5 ${itinerary.hotel ? 'text-indigo-600' : 'text-slate-400'}`} />
                   <div>
                     <h3 className={`font-bold text-sm ${itinerary.hotel ? 'text-slate-800' : 'text-slate-400'}`}>
                       {itinerary.hotel ? itinerary.hotel.name : t('hotel_opt')}
                     </h3>
                     {itinerary.hotel && (
                       <p className="text-xs text-slate-500 mt-1">{itinerary.nights} {t('nights')} x €{itinerary.hotel.pricePerNight}</p>
                     )}
                   </div>
                </div>
                {itinerary.hotel && <span className="font-bold text-slate-700">€{hotelCost}</span>}
             </div>
          </div>

          {/* Car */}
          <div className={`p-4 rounded-xl border-l-4 ${itinerary.car ? 'bg-green-50 border-green-500' : 'bg-slate-50 border-slate-300 border-dashed'}`}>
             <div className="flex justify-between items-start">
                <div className="flex gap-3">
                   <Car className={`w-5 h-5 ${itinerary.car ? 'text-green-600' : 'text-slate-400'}`} />
                   <div>
                     <h3 className={`font-bold text-sm ${itinerary.car ? 'text-slate-800' : 'text-slate-400'}`}>
                       {itinerary.car ? itinerary.car.model : t('car_opt')}
                     </h3>
                     {itinerary.car && (
                       <p className="text-xs text-slate-500 mt-1">{itinerary.carDays} {t('days')} x €{itinerary.car.pricePerDay}</p>
                     )}
                   </div>
                </div>
                {itinerary.car && <span className="font-bold text-slate-700">€{carCost}</span>}
             </div>
          </div>
        </div>

        <div className="p-6 border-t bg-slate-50">
          <div className="flex justify-between items-end mb-4">
             <span className="text-slate-500 font-semibold">{t('est_total')}</span>
             <span className="text-3xl font-extrabold text-slate-900">€{totalCost}</span>
          </div>

          <button 
             onClick={onContinue}
             className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors"
          >
            {t('continue_booking')} <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PackagePreviewModal;
