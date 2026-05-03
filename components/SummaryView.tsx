
import React from 'react';
import { Itinerary, Language } from '../types';
import { Plane, BedDouble, Car, CheckCircle } from 'lucide-react';
import { COLORS } from '../constants';
import { getTranslation } from '../translations';

interface SummaryViewProps {
  itinerary: Itinerary;
  onReset: () => void;
  language?: Language;
}

const SummaryView: React.FC<SummaryViewProps> = ({ itinerary, onReset, language = 'pt' }) => {
  if (!itinerary) return null;
  const flightCost = itinerary.flight?.price || 0;
  const hotelCost = (itinerary.hotel?.pricePerNight || 0) * (itinerary.nights || 0);
  const carCost = (itinerary.car?.pricePerDay || 0) * (itinerary.carDays || 0);
  const totalCost = flightCost + hotelCost + carCost;
  const currentLang = language as Language;

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '---';
    return new Date(dateStr).toLocaleDateString(language === 'pt' ? 'pt-PT' : 'en-US', {
      day: '2-digit',
      month: 'short'
    });
  };

  return (
    <div className="max-w-3xl mx-auto p-4 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
        <div className="bg-slate-900 p-8 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-green-500"></div>
          <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-white mb-2">{getTranslation(currentLang, 'trip_ready')}</h2>
          <p className="text-slate-400">{getTranslation(currentLang, 'trip_planned')}</p>
        </div>

        <div className="p-8 space-y-6">
          {/* Flight */}
          <div className="flex items-center p-4 bg-slate-50 rounded-xl border border-slate-100">
            <div className="p-3 bg-blue-100 rounded-lg mr-4">
              <Plane className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-slate-800">{getTranslation(currentLang, 'flight_to')} {itinerary.flight?.destination}</h3>
              <p className="text-sm text-slate-500">{itinerary.flight?.airline} • {itinerary.flight?.flightNumber}</p>
            </div>
            <span className="font-bold text-lg">€{flightCost}</span>
          </div>

          {/* Hotel */}
          {itinerary.hotel && (
            <div className="flex items-center p-4 bg-slate-50 rounded-xl border border-slate-100">
              <div className="p-3 bg-indigo-100 rounded-lg mr-4">
                <BedDouble className="w-6 h-6 text-indigo-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-slate-800">{itinerary.hotel.name}</h3>
                <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                   <span className="font-bold text-slate-700">{formatDate(itinerary.hotelStartDate)} - {formatDate(itinerary.hotelEndDate)}</span>
                   <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                   <span>{itinerary.nights} {getTranslation(currentLang, 'nights')} a €{itinerary.hotel.pricePerNight}/{getTranslation(currentLang, 'per_night')}</span>
                </div>
              </div>
              <span className="font-bold text-lg">€{hotelCost}</span>
            </div>
          )}

          {/* Car */}
          {itinerary.car && (
            <div className="flex items-center p-4 bg-slate-50 rounded-xl border border-slate-100">
              <div className="p-3 bg-green-100 rounded-lg mr-4">
                <Car className="w-6 h-6 text-green-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-slate-800">{itinerary.car.model}</h3>
                <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                   <span className="font-bold text-slate-700">{formatDate(itinerary.carStartDate)} - {formatDate(itinerary.carEndDate)}</span>
                   <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                   <span>{itinerary.carDays} {getTranslation(currentLang, 'days')} a €{itinerary.car.pricePerDay}/{getTranslation(currentLang, 'per_day')}</span>
                </div>
              </div>
              <span className="font-bold text-lg">€{carCost}</span>
            </div>
          )}

          <div className="border-t border-dashed border-slate-300 my-6"></div>

          <div className="flex justify-between items-end">
            <span className="text-slate-500 font-semibold">{getTranslation(currentLang, 'est_total')}</span>
            <span className="text-4xl font-bold text-slate-900">€{totalCost}</span>
          </div>

          <button 
            className="w-full py-4 mt-6 rounded-xl text-white font-bold text-lg shadow-lg hover:opacity-90 transition-opacity"
            style={{ background: `linear-gradient(to right, ${COLORS.primary}, ${COLORS.secondary})` }}
            onClick={() => alert('A processar pagamento... (Fim da Demo)')}
          >
            {getTranslation(currentLang, 'book_now')}
          </button>
          
          <button 
             onClick={onReset}
             className="w-full text-center text-slate-400 hover:text-slate-600 text-sm mt-4"
          >
            {getTranslation(currentLang, 'start_over')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SummaryView;
