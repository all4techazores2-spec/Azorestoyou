
import React, { useState } from 'react';
import { Restaurant, Activity, ExploreCategory, Language, BusSchedule } from '../types';
import { COLORS, ISLAND_LOCALITIES } from '../constants';
import RestaurantModal from './RestaurantModal';
import TrailModal from './TrailModal';
import { MapPin, ArrowRight, Utensils, MountainSnow, Camera, LandPlot, Bus, Info, Clock, Ticket, Map, Heart } from 'lucide-react';
import { getTranslation } from '../translations';

interface ExploreSectionProps {
  category: ExploreCategory;
  destinationIsland: string | undefined;
  currentLanguage?: Language;
  isAuthenticated?: boolean;
  onShowAuth?: () => void;
  // Dynamic Data Props
  restaurants: Restaurant[];
  activities: Activity[];
  busSchedules: BusSchedule[];
  shops: any[];
  beauty: any[];
  userCredits?: number;
  setUserCredits?: (credits: number) => void;
  favoriteRestaurantIds?: string[];
  onToggleFavorite?: (id: string) => void;
  onReserveSuccess?: (resData: any, restName: string, restId: string) => void;
  userProfile?: { email: string; name: string; phone: string };
}

const ExploreSection: React.FC<ExploreSectionProps> = ({ 
  category, 
  destinationIsland, 
  currentLanguage = 'pt', 
  isAuthenticated, 
  onShowAuth,
  restaurants,
  activities,
  busSchedules,
  userCredits,
  setUserCredits,
  favoriteRestaurantIds = [],
  onToggleFavorite,
  onReserveSuccess,
  userProfile
}) => {
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [selectedTrail, setSelectedTrail] = useState<Activity | null>(null);
  const [busOrigin, setBusOrigin] = useState<string>('');
  const [busDestination, setBusDestination] = useState<string>('');
  const [showBusResults, setShowBusResults] = useState(false);
  const [beautyFilter, setBeautyFilter] = useState<string>('all');
  
  const lang = currentLanguage as Language;

  const isAllIslands = !destinationIsland || destinationIsland === 'all';
  const targetIsland = isAllIslands ? null : destinationIsland; 

  const filteredRestaurants = restaurants.filter(r => isAllIslands || r.island === targetIsland);
  
  // Mapping for the expanded categories
  const getActivitiesByType = (type: string) => {
    return activities.filter(a => a.type === type && (isAllIslands || a.island === targetIsland));
  };

  const getCategoryTitle = (cat: ExploreCategory) => {
    const t = (key: any) => getTranslation(lang, key);
    switch (cat) {
      case 'restaurants': return t('nav_restaurants');
      case 'trails': return t('nav_trails');
      case 'culture': return 'Cultura'; // Needs translation key if added
      case 'landscapes': return t('nav_landscapes');
      case 'activities': return t('nav_activities');
      case 'buses': return t('nav_buses');
      case 'poi': return t('nav_poi');
      case 'shops': return t('nav_shops');
      case 'beauty': return t('nav_beauty');
      default: return 'Explorar';
    }
  };

  const getCategoryIcon = (cat: ExploreCategory) => {
    switch (cat) {
      case 'restaurants': return <Utensils />;
      case 'trails': return <Map />;
      case 'landscapes': return <Camera />;
      case 'activities': return <MountainSnow />;
      case 'buses': return <Bus />;
      case 'poi': return <MapPin />;
      case 'shops': return <Ticket />;
      case 'beauty': return <Info />;
      default: return <LandPlot />;
    }
  };

  const handleBusSearch = () => {
    setShowBusResults(true);
  };

  const renderEmptyState = () => (
    <div className="py-20 text-center bg-white rounded-3xl shadow-sm border border-slate-100">
      <Info className="w-12 h-12 text-slate-300 mx-auto mb-4" />
      <h3 className="text-xl font-bold text-slate-600">{getTranslation(lang, 'coming_soon')}</h3>
      <p className="text-slate-400">{getTranslation(lang, 'coming_soon_desc')}</p>
    </div>
  );

  const renderBusPlanner = () => {
    const currentIsland = targetIsland || 'PDL';
    const locations = ISLAND_LOCALITIES[currentIsland] || [];
    
    // Filter logic for bus results using PROPS
    const filteredSchedules = busSchedules.filter(s => {
       if (s.island !== currentIsland) return false;
       if (!busOrigin || !busDestination) return false;
       
       // Simple matching logic (exact or partial)
       const matchOrigin = s.origin === busOrigin;
       const matchDest = s.destination === busDestination;
       
       return matchOrigin && matchDest;
    });

    return (
      <div className="space-y-8 animate-in fade-in duration-500">
        {/* Selection Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
          <div className="bg-slate-50 px-6 py-4 border-b border-slate-100">
             <h3 className="font-bold text-slate-700 flex items-center gap-2">
               <Bus className="w-5 h-5 text-pink-500" /> {getTranslation(lang, 'plan_trip')}
             </h3>
             <p className="text-xs text-slate-500 mt-1">{getTranslation(lang, 'plan_trip_subtitle')}</p>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
             <div className="space-y-2">
               <label className="text-sm font-bold text-slate-600 block">{getTranslation(lang, 'bus_origin')}</label>
               <div className="relative">
                 <MapPin className="absolute left-3 top-3.5 text-slate-400 w-5 h-5" />
                 <select 
                   value={busOrigin}
                   onChange={(e) => { setBusOrigin(e.target.value); setShowBusResults(false); }}
                   className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all font-medium text-slate-700 appearance-none"
                 >
                   <option value="">{getTranslation(lang, 'select')}</option>
                   {locations.map(loc => (
                     <option key={loc} value={loc}>{loc}</option>
                   ))}
                 </select>
               </div>
             </div>

             <div className="space-y-2">
               <label className="text-sm font-bold text-slate-600 block">{getTranslation(lang, 'bus_destination')}</label>
               <div className="relative">
                 <MapPin className="absolute left-3 top-3.5 text-slate-400 w-5 h-5" />
                 <select 
                   value={busDestination}
                   onChange={(e) => { setBusDestination(e.target.value); setShowBusResults(false); }}
                   className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all font-medium text-slate-700 appearance-none"
                 >
                   <option value="">{getTranslation(lang, 'select')}</option>
                   {locations.filter(l => l !== busOrigin).map(loc => (
                     <option key={loc} value={loc}>{loc}</option>
                   ))}
                 </select>
               </div>
             </div>

             <button 
               onClick={handleBusSearch}
               disabled={!busOrigin || !busDestination}
               className={`w-full md:col-span-2 py-4 rounded-xl font-bold text-white shadow-lg transition-all flex items-center justify-center gap-2
                 ${(!busOrigin || !busDestination) 
                   ? 'bg-slate-300 cursor-not-allowed' 
                   : 'bg-pink-600 hover:bg-pink-700 hover:scale-[1.02]'}`}
             >
               {getTranslation(lang, 'search_schedules')} <ArrowRight className="w-5 h-5" />
             </button>
          </div>
        </div>

        {/* Results Area */}
        {showBusResults && (
           <div className="animate-in slide-in-from-bottom-6 duration-500">
             <h3 className="text-xl font-bold text-slate-800 mb-4">{getTranslation(lang, 'available_schedules')}</h3>
             
             {filteredSchedules.length > 0 ? (
               <div className="grid gap-4">
                 {filteredSchedules.map(schedule => (
                   <div key={schedule.id} className="bg-white p-6 rounded-xl shadow-md border-l-4 border-pink-500 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                           <span className="text-xs font-bold uppercase tracking-wider bg-slate-100 text-slate-500 px-2 py-1 rounded">{getTranslation(lang, 'company')}</span>
                           <span className="font-bold text-slate-800">{schedule.company}</span>
                        </div>
                        <div className="flex items-center gap-3 text-lg font-medium text-slate-700">
                           <span>{schedule.origin}</span>
                           <ArrowRight className="w-4 h-4 text-slate-400" />
                           <span>{schedule.destination}</span>
                        </div>
                        <div className="text-sm text-slate-400 mt-1 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {schedule.duration}
                        </div>
                      </div>

                      <div className="w-full md:w-auto flex flex-col items-end gap-2">
                         <div className="flex flex-wrap gap-2 justify-end">
                            {schedule.times.map(time => (
                              <div key={time} className="px-3 py-1 bg-pink-50 text-pink-700 rounded-lg font-mono font-bold border border-pink-100">
                                {time}
                              </div>
                            ))}
                         </div>
                         <div className="flex items-center gap-1 font-bold text-slate-800 mt-2">
                           <Ticket className="w-4 h-4 text-slate-400" /> €{schedule.price.toFixed(2)}
                         </div>
                      </div>
                   </div>
                 ))}
               </div>
             ) : (
               <div className="bg-white p-8 rounded-xl text-center shadow-sm border border-slate-100">
                 <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3 text-slate-300">
                   <Bus className="w-8 h-8" />
                 </div>
                 <p className="text-slate-500 font-medium">{getTranslation(lang, 'no_schedules')}</p>
                 <p className="text-xs text-slate-400 mt-1">Tente outra combinação ou verifique se a rota é direta.</p>
               </div>
             )}
           </div>
        )}
        
        {!showBusResults && (
           <div className="text-center py-10 opacity-50">
             <p className="text-slate-400">{getTranslation(lang, 'select_locations')}</p>
           </div>
        )}
      </div>
    );
  };

  const renderRestaurants = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredRestaurants.map(r => {
        const isFavorite = favoriteRestaurantIds.includes(r.id);
        return (
        <div 
          key={r.id} 
          className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all cursor-pointer group relative"
          onClick={() => setSelectedRestaurant(r)}
        >
          <button 
            className="absolute top-3 left-3 z-10 p-2 bg-white/90 backdrop-blur rounded-full text-red-500 hover:scale-110 transition-transform shadow-sm"
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite?.(r.id);
            }}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
          <div className="h-48 overflow-hidden relative">
            <img src={r.image} alt={r.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
            <div className="absolute top-2 right-2 bg-white/90 backdrop-blur px-2 py-1 rounded text-xs font-bold flex items-center gap-1">
               <MapPin className="w-3 h-3 text-red-500" /> {r.island}
            </div>
          </div>
          <div className="p-5">
            <h3 className="text-xl font-bold text-slate-800 mb-1">{r.name}</h3>
            <p className="text-sm text-slate-500 mb-3">{r.cuisine} • {r.reviews} avaliações</p>
            <div className="flex items-center justify-between mt-4">
              <span className="text-yellow-500 font-bold flex items-center gap-1">
                ★ {r.rating}
              </span>
              <span className="text-blue-600 text-sm font-semibold group-hover:translate-x-1 transition-transform flex items-center gap-1">
                {getTranslation(lang, 'view_menu')} <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </div>
        </div>
      )})}
    </div>
  );

  const renderActivities = (type?: string) => {
    const data = type ? getActivitiesByType(type) : activities;
    
    if (data.length === 0) return renderEmptyState();

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.map(a => (
          <div 
            key={a.id} 
            className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all cursor-pointer group"
            onClick={() => {
              if (a.type === 'trail') {
                setSelectedTrail(a);
              }
            }}
          >
            <div className="h-56 overflow-hidden relative">
               <img src={a.image} alt={a.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
               <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                 <h3 className="text-white text-xl font-bold">{a.title}</h3>
                 <p className="text-white/80 text-sm flex items-center gap-1"><MapPin className="w-3 h-3" /> {a.island}</p>
               </div>
            </div>
            <div className="p-5">
              <p className="text-slate-600 line-clamp-2">{a.description}</p>
              <button className="mt-4 w-full py-2 rounded border-2 border-slate-200 font-semibold text-slate-600 group-hover:border-blue-500 group-hover:text-blue-500 transition-colors">
                {getTranslation(lang, 'more_info')}
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderBusiness = (data: any[]) => {
    const filtered = data.filter(b => isAllIslands || b.island === targetIsland);
    
    if (filtered.length === 0) return renderEmptyState();

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(b => (
          <div 
            key={b.id} 
            className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all cursor-pointer group"
            onClick={() => setSelectedRestaurant(b)} // Use existing RestaurantModal for now
          >
            <div className="h-48 overflow-hidden relative">
              <img src={b.image} alt={b.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute top-2 right-2 bg-white/90 backdrop-blur px-2 py-1 rounded text-xs font-bold flex items-center gap-1">
                 <MapPin className="w-3 h-3 text-red-500" /> {b.island}
              </div>
            </div>
            <div className="p-5">
              <h3 className="text-xl font-bold text-slate-800 mb-1">{b.name}</h3>
              <p className="text-sm text-slate-500 mb-3 line-clamp-2">{b.description}</p>
              <div className="flex items-center justify-between mt-4">
                <span className="text-blue-600 text-sm font-semibold group-hover:translate-x-1 transition-transform flex items-center gap-1">
                  {getTranslation(lang, 'more_info')} <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderBeauty = () => {
    const subcats = [
      { id: 'all', label: 'Todos' },
      { id: 'beauty_salon', label: getTranslation(lang, 'beauty_salon') },
      { id: 'hairdresser', label: getTranslation(lang, 'hairdresser') },
      { id: 'barber', label: getTranslation(lang, 'barber') },
      { id: 'manicure', label: getTranslation(lang, 'manicure') },
      { id: 'massage', label: getTranslation(lang, 'massage') },
    ];

    const filtered = beauty.filter(b => {
      const matchIsland = isAllIslands || b.island === targetIsland;
      const matchSubcat = beautyFilter === 'all' || b.subcategory === beautyFilter;
      return matchIsland && matchSubcat;
    });

    return (
      <div className="space-y-6">
        <div className="flex flex-wrap gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {subcats.map(cat => (
            <button
              key={cat.id}
              onClick={() => setBeautyFilter(cat.id)}
              className={`px-4 py-2 rounded-full text-sm font-bold transition-all whitespace-nowrap ${
                beautyFilter === cat.id 
                  ? 'bg-pink-600 text-white shadow-lg' 
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {renderBusiness(filtered)}
      </div>
    );
  };

  const getContent = () => {
    switch (category) {
      case 'restaurants': return renderRestaurants();
      case 'trails': return renderActivities('trail');
      case 'landscapes': return renderActivities('landscape');
      case 'culture': return renderActivities('culture');
      case 'poi': return renderActivities('poi');
      case 'buses': return renderBusPlanner(); // Custom Bus Planner View
      case 'activities': return renderActivities('activity');
      case 'shops': return renderBusiness(shops);
      case 'beauty': return renderBeauty();
      default: return renderActivities();
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-3 mb-8">
        <div 
          className="p-3 rounded-xl text-white shadow-lg" 
          style={{ backgroundColor: category === 'restaurants' ? COLORS.secondary : COLORS.primary }}
        >
          {getCategoryIcon(category)}
        </div>
        <div>
          <h2 className="text-3xl font-bold text-slate-800 capitalize">
            {category === 'buses' ? getTranslation(lang, 'plan_trip') : getCategoryTitle(category)}
          </h2>
          <p className="text-slate-500">
            {category === 'buses' 
              ? getTranslation(lang, 'plan_trip_subtitle')
              : `${getTranslation(lang, 'discover_best')} ${destinationIsland !== 'all' ? destinationIsland : 'os Açores'}`
            }
          </p>
        </div>
      </div>

      {getContent()}

      {selectedRestaurant && (
        <RestaurantModal 
          restaurant={selectedRestaurant} 
          onClose={() => setSelectedRestaurant(null)} 
          language={lang}
          isAuthenticated={isAuthenticated}
          onShowAuth={onShowAuth}
          userCredits={userCredits}
          setUserCredits={setUserCredits}
          onReserveSuccess={onReserveSuccess}
          userProfile={userProfile}
        />
      )}

      {selectedTrail && (
        <TrailModal 
          trail={selectedTrail} 
          onClose={() => setSelectedTrail(null)} 
          language={lang}
        />
      )}
    </div>
  );
};

export default ExploreSection;
