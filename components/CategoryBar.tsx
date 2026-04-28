
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
  X
} from 'lucide-react';

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
  ];
};

// Exporting default for initial state if needed, defaulting to PT
export const NAVIGATION_CATEGORIES = getNavigationCategories('pt');

const CategoryBar: React.FC<CategoryBarProps> = ({ activeCategory, onSelect, language = 'pt' }) => {
  const currentLang = language as Language;
  const categories = getNavigationCategories(currentLang);
  
  const displayedCategories = activeCategory 
    ? categories.filter(cat => cat.id === activeCategory)
    : categories;

  return (
    <div className="w-full max-w-7xl mx-auto px-2 mb-4">
      <div className={activeCategory 
        ? "flex justify-center py-4 animate-in zoom-in duration-300" 
        : "grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-y-6 gap-x-2 py-2"
      }>
        {displayedCategories.map((cat) => {
          const isActive = activeCategory === cat.id;
          
          return (
            <button
              key={cat.id}
              onClick={() => onSelect(cat.id)}
              className="flex flex-col items-center gap-2 group transition-all"
            >
              <div 
                className={`
                  w-14 h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center transition-all duration-300
                  ${isActive 
                    ? 'shadow-xl scale-110 ring-4 ring-white relative' 
                    : 'bg-white shadow-sm hover:shadow-md group-hover:-translate-y-1'
                  }
                `}
                style={{ 
                  backgroundColor: isActive ? cat.color : undefined,
                  color: isActive ? 'white' : cat.color 
                }}
              >
                {cat.icon}
                {isActive && (
                  <div className="absolute -top-1 -right-1 bg-white text-slate-800 rounded-full p-0.5 shadow-sm">
                    <X className="w-3 h-3" />
                  </div>
                )}
              </div>
              <span 
                className={`text-[10px] md:text-xs font-bold text-center leading-tight transition-colors ${
                  isActive ? 'text-slate-900 font-extrabold' : 'text-slate-500 group-hover:text-slate-800'
                }`}
              >
                {cat.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryBar;
