
import React from 'react';
import { ExploreCategory, Language } from '../types';
import { translations } from '../translations';
import { 
  Plane, 
  Utensils, 
  Car, 
  Image as ImageIcon, 
  BedDouble, 
  MountainSnow, 
  Bus, 
  Map,
  MapPin,
  ShoppingBag,
  Sparkles,
  Wrench,
  Zap,
  ShoppingCart,
  ChevronLeft,
  ChevronRight,
  Dog,
  Building2,
  Dumbbell,
  CarFront,
  Briefcase,
  Laptop,
  Pipette,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CategoryBarProps {
  activeCategory: ExploreCategory;
  onSelect: (category: ExploreCategory) => void;
  language?: Language;
}

export interface CategoryItem {
  id: ExploreCategory;
  label: string;
  icon: React.ReactNode;
  color: string;
}

// Function to generate categories based on language
export const getNavigationCategories = (lang: Language = 'pt'): CategoryItem[] => {
  const t = translations[lang];
  return [
    { id: 'flights', label: t.nav_flights, icon: <Plane className="w-6 h-6" />, color: '#1A75BB' },
    { id: 'restaurants', label: t.nav_restaurants, icon: <Utensils className="w-6 h-6" />, color: '#E44D26' },
    { id: 'trails', label: t.nav_trails, icon: <Map className="w-6 h-6" />, color: '#2C7A2E' },
    { id: 'rentcar', label: t.nav_cars, icon: <Car className="w-6 h-6" />, color: '#4CAF50' },
    { id: 'landscapes', label: t.nav_landscapes, icon: <ImageIcon className="w-6 h-6" />, color: '#00BCD4' },
    { id: 'accommodation', label: t.nav_accommodation, icon: <BedDouble className="w-6 h-6" />, color: '#673AB7' },
    { id: 'activities', label: t.nav_activities, icon: <MountainSnow className="w-6 h-6" />, color: '#FF9800' },
    { id: 'buses', label: t.nav_buses, icon: <Bus className="w-6 h-6" />, color: '#E91E63' },
    { id: 'poi', label: t.nav_poi, icon: <MapPin className="w-6 h-6" />, color: '#F44336' },
    { id: 'shops', label: t.nav_shops, icon: <ShoppingBag className="w-6 h-6" />, color: '#9C27B0' },
    { id: 'beauty', label: t.nav_beauty, icon: <Sparkles className="w-6 h-6" />, color: '#FF4081' },
    { id: 'services', label: t.nav_services, icon: <Wrench className="w-6 h-6" />, color: '#607D8B' },
    { id: 'auto_repair', label: t.nav_auto_repair, icon: <Car className="w-6 h-6" />, color: '#C62828' },
    { id: 'animals', label: t.nav_animals, icon: <Dog className="w-6 h-6" />, color: '#795548' },
    { id: 'real_estate', label: t.nav_real_estate, icon: <Building2 className="w-6 h-6" />, color: '#3F51B5' },
    { id: 'gyms', label: t.nav_gyms, icon: <Dumbbell className="w-6 h-6" />, color: '#000000' },
    { id: 'stands', label: t.nav_stands, icon: <CarFront className="w-6 h-6" />, color: '#212121' },
    { id: 'offices', label: t.nav_offices, icon: <Briefcase className="w-6 h-6" />, color: '#455A64' },
    { id: 'it_services', label: t.nav_it_services, icon: <Laptop className="w-6 h-6" />, color: '#2196F3' },
    { id: 'perfumes', label: t.nav_perfumes, icon: <Pipette className="w-6 h-6" />, color: '#E91E63' },
  ];
};

// Exporting default for initial state if needed, defaulting to PT
export const NAVIGATION_CATEGORIES = getNavigationCategories('pt');

const CategoryBar: React.FC<CategoryBarProps> = ({ activeCategory, onSelect, language = 'pt' }) => {
  const currentLang = language as Language;
  const categories = getNavigationCategories(currentLang);
  const [page, setPage] = React.useState(0);
  const itemsPerPage = 9;
  const totalPages = Math.ceil(categories.length / itemsPerPage);
  
  if (activeCategory) return null;

  const currentItems = categories.slice(page * itemsPerPage, (page + 1) * itemsPerPage);

  const nextPage = () => {
    if (page < totalPages - 1) setPage(p => p + 1);
  };

  const prevPage = () => {
    if (page > 0) setPage(p => p - 1);
  };

  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-2 mb-8 relative">
      <div className="flex items-center gap-2">
        {/* Back Button */}
        {totalPages > 1 && (
          <button 
            onClick={prevPage}
            disabled={page === 0}
            className={`hidden md:flex w-10 h-10 items-center justify-center rounded-full bg-white shadow-md border border-slate-100 transition-all ${page === 0 ? 'opacity-20 cursor-not-allowed' : 'hover:bg-blue-600 hover:text-white active:scale-90'}`}
          >
            <ChevronLeft size={20} />
          </button>
        )}

        <div className="flex-1 overflow-hidden relative min-h-[120px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={page}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={(e, { offset, velocity }) => {
                const swipe = swipePower(offset.x, velocity.x);
                if (swipe < -10000) {
                  nextPage();
                } else if (swipe > 10000) {
                  prevPage();
                }
              }}
              className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-y-6 gap-x-2 py-4 px-2"
            >
              {currentItems.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => onSelect(cat.id)}
                  className="flex flex-col items-center gap-2 group transition-all"
                >
                  <div 
                    className="w-14 h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center transition-all duration-300 bg-white shadow-sm hover:shadow-md group-hover:-translate-y-1"
                    style={{ color: cat.color }}
                  >
                    {cat.icon}
                  </div>
                  <span className="text-[10px] md:text-xs font-bold text-slate-500 group-hover:text-slate-800 text-center leading-tight transition-colors line-clamp-1">
                    {cat.label}
                  </span>
                </button>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Next Button */}
        {totalPages > 1 && (
          <button 
            onClick={nextPage}
            disabled={page === totalPages - 1}
            className={`hidden md:flex w-10 h-10 items-center justify-center rounded-full bg-white shadow-md border border-slate-100 transition-all ${page === totalPages - 1 ? 'opacity-20 cursor-not-allowed' : 'hover:bg-blue-600 hover:text-white active:scale-90'}`}
          >
            <ChevronRight size={20} />
          </button>
        )}
      </div>

      {/* Pagination Dots & Mobile controls */}
      {totalPages > 1 && (
        <div className="flex flex-col items-center gap-4 mt-2">
           <div className="flex gap-2">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${page === i ? 'w-8 bg-blue-600' : 'w-2 bg-slate-200'}`}
                />
              ))}
           </div>
           
           {/* Mobile arrows */}
           <div className="flex md:hidden gap-8">
              <button 
                onClick={prevPage}
                disabled={page === 0}
                className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all ${page === 0 ? 'opacity-20' : 'text-blue-600 active:scale-90'}`}
              >
                <ChevronLeft size={14} /> Back
              </button>
              <button 
                onClick={nextPage}
                disabled={page === totalPages - 1}
                className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all ${page === totalPages - 1 ? 'opacity-20' : 'text-blue-600 active:scale-90'}`}
              >
                Seguinte <ChevronRight size={14} />
              </button>
           </div>
        </div>
      )}
    </div>
  );
};


export default CategoryBar;
