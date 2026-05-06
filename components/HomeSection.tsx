
import React, { useState } from 'react';
import { Search, Map, Bell, Menu, MapPin, Heart, ArrowRight, Compass, Utensils, MountainSnow, Camera, Bus, Car, Plane, Tent, Palette, ShoppingBag, Sparkles, LayoutGrid, Wrench, Settings, Zap, ShoppingCart, Dog, Building2, Dumbbell, CarFront, Briefcase, Laptop, Pipette } from 'lucide-react';
import { Language, Restaurant } from '../types';
import { getTranslation } from '../translations';
import AzoresLogo from './AzoresLogo';
import { motion, AnimatePresence } from 'motion/react';

interface HomeSectionProps {
  language: Language;
  onNavigate: (category: any) => void;
  onOpenMenu: () => void;
  onShowNotifications: () => void;
  restaurants: Restaurant[];
  featuredIsland?: string;
}

const HomeSection: React.FC<HomeSectionProps> = ({ 
  language, 
  onNavigate, 
  onOpenMenu, 
  onShowNotifications,
  restaurants,
  featuredIsland = "São Miguel"
}) => {
  const [catPage, setCatPage] = useState(0);
  const t = (key: any) => getTranslation(language, key);

  const categories = [
    { id: 'trails', label: 'Trilhos', icon: <MountainSnow className="w-4 h-4 text-green-600" /> },
    { id: 'restaurants', label: 'Restaurantes', icon: <Utensils className="w-4 h-4 text-orange-500" /> },
    { id: 'landscapes', label: 'Praias', icon: <Camera className="w-4 h-4 text-blue-500" /> },
    { id: 'accommodation', label: 'Alojamentos', icon: <Tent className="w-4 h-4 text-purple-600" /> },
  ];

  const quickIcons = [
    { id: 'poi', label: 'Pontos Turísticos', icon: <MapPin className="w-6 h-6" />, color: 'bg-green-500' },
    { id: 'landscapes', label: 'Paisagens', icon: <Camera className="w-6 h-6" />, color: 'bg-blue-500' },
    { id: 'activities', label: 'Atividades', icon: <LayoutGrid className="w-6 h-6" />, color: 'bg-purple-600' },
    { id: 'buses', label: 'Autocarros', icon: <Bus className="w-6 h-6" />, color: 'bg-orange-400' },
    { id: 'rentcar', label: 'Rent-a-car', icon: <Car className="w-6 h-6" />, color: 'bg-emerald-500' },
    { id: 'flights', label: 'Viagens', icon: <Plane className="w-6 h-6" />, color: 'bg-blue-600' },
    { id: 'shops', label: 'Lojas', icon: <ShoppingBag className="w-6 h-6" />, color: 'bg-pink-500' },
    { id: 'beauty', label: 'Beleza', icon: <Sparkles className="w-6 h-6" />, color: 'bg-rose-400' },
    { id: 'services', label: 'Serviços', icon: <Wrench className="w-6 h-6" />, color: 'bg-slate-600' },
    { id: 'auto_repair', label: 'Oficinas', icon: <Settings className="w-6 h-6" />, color: 'bg-red-600' },
    { id: 'auto_electronics', label: 'Auto Elétrica', icon: <Zap className="w-6 h-6" />, color: 'bg-yellow-500' },
    { id: 'used_market', label: 'Usados', icon: <ShoppingCart className="w-6 h-6" />, color: 'bg-emerald-600' },
    { id: 'animals', label: 'Animais', icon: <Dog className="w-6 h-6" />, color: 'bg-orange-600' },
    { id: 'real_estate', label: 'Imobiliária', icon: <Building2 className="w-6 h-6" />, color: 'bg-blue-800' },
    { id: 'gyms', label: 'Ginásios', icon: <Dumbbell className="w-6 h-6" />, color: 'bg-slate-800' },
    { id: 'stands', label: 'Stands', icon: <CarFront className="w-6 h-6" />, color: 'bg-indigo-600' },
    { id: 'offices', label: 'Escritórios', icon: <Briefcase className="w-6 h-6" />, color: 'bg-cyan-600' },
    { id: 'it_services', label: 'Informática', icon: <Laptop className="w-6 h-6" />, color: 'bg-slate-700' },
    { id: 'perfumes', label: 'Perfumes', icon: <Pipette className="w-6 h-6" />, color: 'bg-fuchsia-500' },
  ];

  const nearbyItems = restaurants.slice(0, 4).map((r, i) => ({
    id: r.id,
    title: r.name,
    location: r.island,
    distance: `${(i + 1) * 350} m`,
    rating: r.rating,
    reviews: r.reviews,
    image: r.image
  }));

  const mainCategories = [
    { id: 'landscapes', title: 'Explorar ilha', subtitle: 'Trilhos, miradouros e muito mais', image: 'https://images.unsplash.com/photo-1534067783941-51c9c23ecefd?q=80&w=2070&auto=format&fit=crop' },
    { id: 'restaurants', title: 'Comer & Beber', subtitle: 'Restaurantes, cafés e sabores locais', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070&auto=format&fit=crop' },
    { id: 'accommodation', title: 'Alojamentos', subtitle: 'Hotéis, casas e alojamento local', image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop' },
    { id: 'flights', title: 'Planear viagem', subtitle: 'Voos, pacotes e dicas úteis', image: 'https://images.unsplash.com/photo-1436491865332-7a61a109c055?q=80&w=2070&auto=format&fit=crop' },
    { id: 'mobility', title: 'Mobilidade', subtitle: 'Rent-a-car, autocarros e transfers', image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=2070&auto=format&fit=crop' },
    { id: 'activities', title: 'Atividades', subtitle: 'Tours, experiências e aventura', image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=2070&auto=format&fit=crop' },
  ];

  return (
    <div className="flex flex-col space-y-6 pb-20 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center border border-slate-100 overflow-hidden">
            <AzoresLogo size={24} />
          </div>
          <h1 className="text-xl font-extrabold tracking-tight text-slate-800">
            Azores<span className="text-blue-600 font-black">ToYou</span>
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={onShowNotifications}
            className="p-2.5 bg-white rounded-full shadow-sm border border-slate-100 relative text-slate-600 active:scale-95 transition-all"
          >
            <Bell size={20} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
          <button 
            onClick={onOpenMenu}
            className="p-2.5 bg-white rounded-full shadow-sm border border-slate-100 text-slate-600 active:scale-95 transition-all"
          >
            <Menu size={20} />
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="px-4 flex gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="O que deseja explorar hoje?" 
            className="w-full h-12 bg-white border border-slate-100 rounded-2xl pl-12 pr-4 text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
          />
        </div>
        <button className="w-12 h-12 bg-green-700 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-green-700/20 active:scale-95 transition-all">
          <Map size={20} />
        </button>
      </div>

      {/* Horizontal Category Pills */}
      <div className="flex gap-2 overflow-x-auto px-4 pb-2 scrollbar-hide">
        {categories.map((cat) => (
          <button 
            key={cat.id} 
            onClick={() => onNavigate(cat.id)}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-100 rounded-2xl shadow-sm whitespace-nowrap active:scale-95 transition-all"
          >
            {cat.icon}
            <span className="text-xs font-bold text-slate-700">{cat.label}</span>
          </button>
        ))}
        <button className="flex items-center justify-center w-10 py-2.5 bg-white border border-slate-100 rounded-2xl shadow-sm text-yellow-500">
           ★
        </button>
      </div>

      {/* Hero Slider Card */}
      <div className="px-4">
        <div className="relative aspect-[16/9] rounded-[2rem] overflow-hidden shadow-2xl group cursor-pointer">
          <img 
            src="https://images.unsplash.com/photo-1589723930437-53696001099b?q=80&w=2070&auto=format&fit=crop" 
            alt="Hero" 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
          <div className="absolute top-4 left-4 bg-green-500/80 backdrop-blur px-3 py-1 rounded-full">
            <span className="text-[10px] font-black text-white uppercase tracking-widest">Em Destaque</span>
          </div>
          <div className="absolute bottom-6 left-6 right-6">
            <h2 className="text-2xl font-black text-white mb-1 leading-tight tracking-tight">Descubra<br/>{featuredIsland}</h2>
            <p className="text-sm text-white/80 font-medium mb-4">A natureza em estado puro</p>
            <button className="bg-white text-slate-900 px-5 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest flex items-center gap-2 shadow-xl active:scale-95 transition-all">
               Explorar agora <ArrowRight size={14} />
            </button>
          </div>
          {/* Pagination dots */}
          <div className="absolute bottom-6 right-6 flex gap-1">
             <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
             <div className="w-1.5 h-1.5 rounded-full bg-white/40"></div>
             <div className="w-1.5 h-1.5 rounded-full bg-white/40"></div>
             <div className="w-1.5 h-1.5 rounded-full bg-white/40"></div>
          </div>
        </div>
      </div>

      {/* Grelha de Categorias - DESIGN PREMIUM COM FADE E SWIPE */}
      <div className="mb-6 overflow-hidden px-4">
        <div className="relative h-[180px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={catPage}
              initial={{ opacity: 0, scale: 0.95, filter: "blur(4px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 1.05, filter: "blur(4px)" }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.1}
              onDragEnd={(e, { offset, velocity }) => {
                if (offset.x < -30) {
                  const next = catPage + 1;
                  if (next < Math.ceil(quickIcons.length / 6)) setCatPage(next);
                } else if (offset.x > 30) {
                  const prev = catPage - 1;
                  if (prev >= 0) setCatPage(prev);
                }
              }}
              className="grid grid-cols-3 gap-y-2 gap-x-1 max-w-[250px] w-full cursor-grab active:cursor-grabbing"
            >
              {quickIcons.slice(catPage * 6, (catPage + 1) * 6).map((item) => (
                <button 
                  key={item.id} 
                  onClick={() => onNavigate(item.id as any)}
                  className="flex flex-col items-center gap-1 group active:scale-90 transition-all py-1"
                >
                  <div className={`w-14 h-14 rounded-full ${item.color} text-white flex items-center justify-center shadow-lg transition-transform hover:scale-105`}>
                     {React.cloneElement(item.icon as React.ReactElement, { size: 24, className: "w-6 h-6" })}
                  </div>
                  <span className="text-[9px] font-black text-slate-600 text-center uppercase tracking-tighter leading-tight w-full px-0.5 truncate">
                    {item.label}
                  </span>
                </button>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
        
        {/* Paginação Estilizada */}
        <div className="flex justify-center gap-2 -mt-4">
          {Array.from({ length: Math.ceil(quickIcons.length / 6) }).map((_, i) => (
            <div 
              key={i} 
              className={`h-1 rounded-full transition-all duration-300 ${catPage === i ? 'w-5 bg-slate-900' : 'w-1.5 bg-slate-200'}`} 
            />
          ))}
        </div>
      </div>

      {/* Perto de si Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-6">
          <h3 className="text-lg font-black text-slate-800 uppercase tracking-tighter">Perto de si</h3>
          <button className="text-[10px] font-black text-green-700 uppercase tracking-widest flex items-center gap-1">
             Ver no mapa <MapPin size={12} />
          </button>
        </div>
        <div className="flex gap-4 overflow-x-auto px-6 pb-4 scrollbar-hide">
          {nearbyItems.map((item) => (
            <div key={item.id} className="flex-shrink-0 w-44 group cursor-pointer" onClick={() => onNavigate('restaurants')}>
              <div className="relative aspect-square rounded-3xl overflow-hidden shadow-md mb-3">
                <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute top-2 right-2 p-1.5 bg-white/20 backdrop-blur rounded-full text-white">
                  <Heart size={14} />
                </div>
                <div className="absolute bottom-2 left-2 bg-green-500/80 backdrop-blur px-2 py-0.5 rounded-full">
                  <span className="text-[8px] font-black text-white">{item.distance}</span>
                </div>
              </div>
              <h4 className="text-xs font-black text-slate-800 leading-tight mb-0.5 truncate">{item.title}</h4>
              <p className="text-[10px] font-bold text-slate-400 mb-1">{item.location}</p>
              <div className="flex items-center gap-1 text-yellow-500">
                <span className="text-xs font-black">★ {item.rating}</span>
                <span className="text-[10px] text-slate-300 font-bold">({item.reviews})</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Explore Categories Grid */}
      <div className="space-y-4 px-6 pb-10">
        <h3 className="text-lg font-black text-slate-800 uppercase tracking-tighter">Explore por categoria</h3>
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mainCategories.map((cat) => (
            <div 
              key={cat.id} 
              onClick={() => onNavigate(cat.id as any)}
              className="relative h-28 rounded-3xl overflow-hidden shadow-sm group cursor-pointer"
            >
              <img src={cat.image} alt={cat.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute inset-0 bg-black/30"></div>
              <div className="absolute inset-0 p-5 flex flex-col justify-center">
                 <h4 className="text-base font-black text-white uppercase tracking-tighter mb-0.5">{cat.title}</h4>
                 <p className="text-[9px] font-bold text-white/70 uppercase tracking-widest mb-3">{cat.subtitle}</p>
                 <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center text-slate-900">
                    <ArrowRight size={14} />
                 </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomeSection;
