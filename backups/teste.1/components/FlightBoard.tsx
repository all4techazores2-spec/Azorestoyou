
import React, { useState } from 'react';
import { Airport, Flight, Language } from '../types';
import { Plane, Clock, ArrowRight, AlertCircle, CheckCircle2, Ban, Lock, MapPin } from 'lucide-react';
import { getTranslation } from '../translations';

interface FlightBoardProps {
  airports: Airport[];
  flights: Flight[];
  onSelectFlight: (flight: Flight) => void;
  language?: Language;
}

const FlightBoard: React.FC<FlightBoardProps> = ({ airports, flights, onSelectFlight, language = 'pt' }) => {
  const [selectedOrigin, setSelectedOrigin] = useState<string>('all');
  const [selectedDestination, setSelectedDestination] = useState<string>('all');
  const currentLang = language as Language;

  // Allow all airports in origin to support inter-island flights
  const origins = airports; 
  // Only Azores airports for destination filter focus
  const destinations = airports.filter(a => a.isAzores);

  // Filter flights based on selection
  const filteredFlights = flights.filter(f => {
    const originMatch = selectedOrigin === 'all' || f.origin === selectedOrigin;
    const destMatch = selectedDestination === 'all' || f.destination === selectedDestination;
    return originMatch && destMatch;
  });

  // GROUP FLIGHTS BY DESTINATION ISLAND (CODE)
  const groupedFlights = filteredFlights.reduce((acc, flight) => {
    if (!acc[flight.destination]) {
      acc[flight.destination] = [];
    }
    acc[flight.destination].push(flight);
    return acc;
  }, {} as Record<string, Flight[]>);

  const getStatusColor = (status: Flight['status']) => {
    switch (status) {
      case 'A Horas': return 'text-green-600 bg-green-50';
      case 'Atrasado': return 'text-red-600 bg-red-50';
      case 'Embarque': return 'text-yellow-600 bg-yellow-50';
      case 'Cancelado': return 'text-slate-500 bg-slate-100';
      default: return 'text-slate-500 bg-slate-100';
    }
  };

  const getTranslatedStatus = (status: Flight['status']) => {
    switch (status) {
      case 'A Horas': return getTranslation(currentLang, 'status_on_time');
      case 'Atrasado': return getTranslation(currentLang, 'status_delayed');
      case 'Embarque': return getTranslation(currentLang, 'status_boarding');
      case 'Cancelado': return getTranslation(currentLang, 'status_cancelled');
      default: return status;
    }
  };

  // Helper to check if flight is selectable
  const isFlightSelectable = (status: Flight['status']) => {
    return status !== 'Cancelado' && status !== 'Embarque';
  };

  const getIslandName = (code: string) => {
    return airports.find(a => a.code === code)?.location || code;
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4 space-y-8">
      
      {/* Filters Section */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-100">
        <div className="flex items-center gap-2 mb-4">
           <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
             <Plane className="w-5 h-5" />
           </div>
           <h2 className="text-xl font-bold text-slate-800">{getTranslation(currentLang, 'filter_flights')}</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <label className="text-xs font-bold text-slate-500 uppercase ml-1 mb-1 block">{getTranslation(currentLang, 'origin')}</label>
            <select 
              className="w-full p-4 rounded-xl bg-slate-50 border-2 border-slate-100 focus:border-blue-500 focus:outline-none transition-colors appearance-none font-semibold text-slate-700"
              value={selectedOrigin}
              onChange={(e) => setSelectedOrigin(e.target.value)}
            >
              <option value="all">🌍 {getTranslation(currentLang, 'all_origins')}</option>
              {origins.map(a => (
                <option key={a.code} value={a.code}>{a.location} ({a.code})</option>
              ))}
            </select>
            <div className="absolute right-4 bottom-4 pointer-events-none text-slate-400">▼</div>
          </div>
          
          <div className="relative">
            <label className="text-xs font-bold text-slate-500 uppercase ml-1 mb-1 block">{getTranslation(currentLang, 'destination')}</label>
            <select 
              className="w-full p-4 rounded-xl bg-slate-50 border-2 border-slate-100 focus:border-green-500 focus:outline-none transition-colors appearance-none font-semibold text-slate-700"
              value={selectedDestination}
              onChange={(e) => setSelectedDestination(e.target.value)}
            >
              <option value="all">🏝️ {getTranslation(currentLang, 'all_islands')}</option>
              {destinations.map(a => (
                <option key={a.code} value={a.code}>{a.name} ({a.code})</option>
              ))}
            </select>
            <div className="absolute right-4 bottom-4 pointer-events-none text-slate-400">▼</div>
          </div>
        </div>
      </div>

      {/* Flight Groups */}
      <div className="space-y-12">
        {Object.keys(groupedFlights).length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-dashed border-slate-300">
            <div className="mx-auto w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
              <Plane className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-bold text-slate-600">{getTranslation(currentLang, 'no_flights')}</h3>
            <p className="text-slate-400">{getTranslation(currentLang, 'check_filters')}</p>
          </div>
        ) : (
          Object.entries(groupedFlights).map(([destCode, groupFlights]: [string, Flight[]]) => (
            <div key={destCode} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* Island Header */}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-2xl font-extrabold text-slate-800">{getIslandName(destCode)}</h3>
                  <p className="text-slate-500 text-sm font-medium">{getTranslation(currentLang, 'flights_to')} {destCode}</p>
                </div>
              </div>

              {/* Grid of Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {groupFlights.map((flight) => {
                  const isSelectable = isFlightSelectable(flight.status);
                  
                  return (
                    <div 
                      key={flight.id} 
                      className={`group relative bg-white rounded-2xl shadow-sm hover:shadow-xl border border-slate-100 overflow-hidden transition-all duration-300 flex flex-col
                        ${!isSelectable && 'opacity-70 cursor-not-allowed bg-slate-50'}`}
                      onClick={() => isSelectable && onSelectFlight(flight)}
                    >
                      {/* Top Bar: Status & Airline */}
                      <div className="px-5 py-4 border-b border-slate-50 flex justify-between items-center">
                         <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-xs font-bold text-slate-500">
                              {flight.airline.substring(0,2).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-bold text-sm text-slate-700 leading-none">{flight.airline}</p>
                              <p className="text-[10px] text-slate-400 font-mono mt-0.5">{flight.flightNumber}</p>
                            </div>
                         </div>
                         <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wide flex items-center gap-1 ${getStatusColor(flight.status)}`}>
                            {flight.status === 'A Horas' ? <CheckCircle2 className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                            {getTranslatedStatus(flight.status)}
                         </span>
                      </div>

                      {/* Main Info: Times & Route */}
                      <div className="p-5 flex justify-between items-center relative">
                         {/* Origin */}
                         <div className="text-center min-w-[60px]">
                            <p className="text-2xl font-extrabold text-slate-800">{flight.departureTime}</p>
                            <p className="text-xs font-bold text-slate-400 bg-slate-100 rounded px-1">{flight.origin}</p>
                         </div>

                         {/* Path Visual */}
                         <div className="flex-1 px-4 flex flex-col items-center">
                            <p className="text-[10px] text-slate-400 mb-1 flex items-center gap-1">
                              <Clock className="w-3 h-3" /> {flight.duration}
                            </p>
                            <div className="w-full h-0.5 bg-slate-200 relative flex items-center justify-between">
                               <div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div>
                               {/* Plane Icon */}
                               <Plane className={`w-4 h-4 text-blue-400 absolute left-1/2 -translate-x-1/2 -translate-y-1/2 ${!isSelectable && 'grayscale'}`} />
                               <div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div>
                            </div>
                            <p className={`text-[9px] font-bold mt-1 uppercase ${flight.stops === 0 ? 'text-green-500' : 'text-orange-500'}`}>
                              {flight.stops === 0 ? getTranslation(currentLang, 'direct') : `${flight.stops} ${getTranslation(currentLang, 'stops')}`}
                            </p>
                         </div>

                         {/* Destination */}
                         <div className="text-center min-w-[60px]">
                            <p className="text-2xl font-extrabold text-slate-800">{flight.arrivalTime}</p>
                            <p className="text-xs font-bold text-slate-400 bg-slate-100 rounded px-1">{flight.destination}</p>
                         </div>
                      </div>

                      {/* Footer: Price & Action */}
                      <div className="mt-auto px-5 py-4 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
                         <div>
                            <p className="text-xs text-slate-400 font-medium">{getTranslation(currentLang, 'per_person')}</p>
                            <p className="text-2xl font-extrabold text-blue-600">€{flight.price}</p>
                         </div>
                         
                         <button 
                           disabled={!isSelectable}
                           className={`px-6 py-2.5 rounded-xl font-bold text-sm shadow-md transition-all flex items-center gap-2
                             ${isSelectable 
                               ? 'bg-white text-blue-600 border border-blue-100 hover:bg-blue-600 hover:text-white hover:border-transparent' 
                               : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}
                         >
                           {isSelectable ? (
                             <>
                               {getTranslation(currentLang, 'select')} <ArrowRight className="w-4 h-4" />
                             </>
                           ) : (
                             <>
                               <Lock className="w-3 h-3" /> {getTranslation(currentLang, 'closed')}
                             </>
                           )}
                         </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default FlightBoard;
