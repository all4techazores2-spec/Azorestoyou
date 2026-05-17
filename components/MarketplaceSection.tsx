
// Force new deploy trigger to Render
import React, { useState, useEffect } from 'react';
import { 
  Search, Plus, MapPin, Tag, Clock, ChevronRight, ChevronLeft, 
  Filter, LayoutGrid, List, MessageSquare, Phone,
  Camera, X, Check, ArrowLeft, ShoppingBag, Car, 
  Home, Laptop, Smartphone, Briefcase, Heart, Share2, 
  Trash2, Edit, User
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { API_BASE_URL } from '../config';

interface Ad {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  location: string;
  images: string[];
  userEmail: string;
  userName: string;
  userPhone: string;
  createdAt: string;
  status?: 'active' | 'sold' | 'hidden' | 'pending' | 'rejected' | 'pendingApproval';
}

interface MarketplaceSectionProps {
  isAuthenticated: boolean;
  userProfile?: any;
  ads: Ad[];
  onUpdateAds: (ads: Ad[]) => Promise<void>;
  onShowAuth: () => void;
  onClose: () => void;
  onStartChat?: (ad: Ad) => void;
  favoriteAdIds: string[];
  onToggleFavoriteAd: (id: string) => void;
  showMarketplaceFavorites: boolean;
  onCloseMarketplaceFavorites: () => void;
}

const MARKET_CATEGORIES = [
  { id: 'all', label: 'Tudo', icon: <ShoppingBag size={20} /> },
  { id: 'vehicles', label: 'Carros e Motos', icon: <Car size={20} /> },
  { id: 'real_estate', label: 'Imobiliária', icon: <Home size={20} /> },
  { id: 'electronics', label: 'Tecnologia', icon: <Laptop size={20} /> },
  { id: 'home', label: 'Casa e Móveis', icon: <ShoppingBag size={20} /> },
  { id: 'fashion', label: 'Moda e Acessórios', icon: <Tag size={20} /> },
  { id: 'services', label: 'Serviços', icon: <Briefcase size={20} /> },
  { id: 'fashion_beauty', label: 'Beleza e Barbearia', icon: <Smartphone size={20} /> },
  { id: 'jobs', label: 'Empregos', icon: <Briefcase size={20} /> },
];

const AZORES_ISLANDS = [
  'Todas',
  'São Miguel',
  'Santa Maria',
  'Terceira',
  'Faial',
  'Pico',
  'São Jorge',
  'Graciosa',
  'Flores',
  'Corvo'
];

const MarketplaceSection: React.FC<MarketplaceSectionProps> = ({
  isAuthenticated,
  userProfile,
  ads,
  onUpdateAds,
  onShowAuth,
  onClose,
  onStartChat,
  favoriteAdIds = [],
  onToggleFavoriteAd,
  showMarketplaceFavorites,
  onCloseMarketplaceFavorites
}) => {
  const [loading, setLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showPostModal, setShowPostModal] = useState(false);
  const [selectedAd, setSelectedAd] = useState<Ad | null>(null);
  const [selectedIsland, setSelectedIsland] = useState('Todas');
  const [showIslandDropdown, setShowIslandDropdown] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

  // Approval Modal States
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [approvalAdId, setApprovalAdId] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(10);
  const [hasSeenInProps, setHasSeenInProps] = useState(false);
  const [currentImgIdx, setCurrentImgIdx] = useState(0);

  useEffect(() => {
    setCurrentImgIdx(0);
  }, [selectedAd]);

  // Form State
  const [newAd, setNewAd] = useState({
    title: '',
    description: '',
    price: '',
    category: 'electronics',
    location: 'São Miguel',
    images: [] as string[]
  });
  const [phoneVisible, setPhoneVisible] = useState(true);

  const handlePostAd = async () => {
    if (!isAuthenticated) {
      onShowAuth();
      return;
    }

    if (!newAd.title || !newAd.price || !newAd.description) {
      alert("Por favor preencha todos os campos obrigatórios");
      return;
    }

    setLoading(true);
    try {
      const userEmail = userProfile?.email || 'adminadmin@gmail.com';
      const userName = userProfile?.name || 'Administrador';
      const userPhone = userProfile?.phone || '';

      const ad: Ad = {
        id: `ad_${Date.now()}`,
        title: newAd.title,
        description: newAd.description,
        price: parseFloat(newAd.price),
        category: newAd.category,
        location: newAd.location, island: ({ 'São Miguel': 'PDL', 'Santa Maria': 'SMA', 'Terceira': 'TER', 'Faial': 'HOR', 'Pico': 'PIX', 'São Jorge': 'SJZ', 'Graciosa': 'GRW', 'Flores': 'FLW', 'Corvo': 'CVU' } as Record<string, string>)[newAd.location] || 'PDL',
        images: newAd.images.length > 0 ? newAd.images : ['https://images.unsplash.com/photo-1540340334550-624b32a8a1de?q=80&w=2070&auto=format&fit=crop'],
        userEmail,
        userName,
        userPhone,
        createdAt: new Date().toISOString(),
        status: 'localPending',
        phoneVisible
      };

      const updatedAds = [ad, ...ads];
      onUpdateAds(updatedAds).catch(err => {
        console.error("Async sync failed:", err);
      });
      
      setApprovalAdId(ad.id);
      setTimeLeft(10);
      setShowApprovalModal(true);
      
      setShowPostModal(false);
      setNewAd({ title: '', description: '', price: '', category: 'electronics', location: 'São Miguel', images: [] });
    } catch (err) {
      console.error("Post ad error:", err);
      alert("Erro ao publicar anúncio: " + (err instanceof Error ? err.message : String(err)));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!showApprovalModal || !approvalAdId) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [showApprovalModal, approvalAdId]);

  useEffect(() => {
    if (!approvalAdId) {
      setHasSeenInProps(false);
      return;
    }
    const found = ads.some(ad => ad.id === approvalAdId);
    if (found) {
      setHasSeenInProps(true);
    }
  }, [ads, approvalAdId]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new window.Image();
        img.src = reader.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const max_size = 800; // Max size to keep visually pristine while extremely lightweight
          let width = img.width;
          let height = img.height;
          
          if (width > height) {
            if (width > max_size) {
              height *= max_size / width;
              width = max_size;
            }
          } else {
            if (height > max_size) {
              width *= max_size / height;
              height = max_size;
            }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          
          // Compress to JPEG at 60% quality
          const compressed = canvas.toDataURL('image/jpeg', 0.6);
          setNewAd(prev => ({
            ...prev,
            images: [...prev.images, compressed]
          }));
        };
      };
      reader.readAsDataURL(file);
    }
  };

  const filteredAds = ads.filter(ad => {
    const matchesCategory = activeCategory === 'all' || ad.category === activeCategory;
    const matchesSearch = ad.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          ad.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesIsland = selectedIsland === 'Todas' || ad.location === selectedIsland;
    const isActive = ad.status === 'active' || ad.status === undefined;
    return matchesCategory && matchesSearch && matchesIsland && isActive;
  });

  if (showMarketplaceFavorites) {
    const favoriteAds = ads.filter(ad => favoriteAdIds.includes(ad.id));
    
    return (
      <div className="flex flex-col min-h-screen bg-[#f8fafc] animate-in fade-in duration-500 pb-32">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-2xl border-b border-slate-200/60 sticky top-[64px] lg:top-[80px] z-[80] px-4 pt-6 pb-6 md:px-8 shadow-sm">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button 
                onClick={onCloseMarketplaceFavorites} 
                className="p-2.5 hover:bg-slate-100/80 text-slate-600 rounded-2xl transition-all active:scale-90"
              >
                <ArrowLeft size={22} />
              </button>
              <div>
                <h1 className="text-2xl font-[900] text-slate-900 tracking-tighter uppercase leading-none">Meus Favoritos</h1>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></span>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Classificados Salvos</p>
                </div>
              </div>
            </div>
            
            <button 
              onClick={onCloseMarketplaceFavorites}
              className="p-3 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-full transition-all active:scale-90"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto w-full px-4 md:px-8 py-8 flex-1">
          {favoriteAds.length === 0 ? (
            <div className="py-24 text-center bg-white rounded-[3rem] border border-slate-100 shadow-sm max-w-xl mx-auto px-6 mt-10">
              <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="w-10 h-10 fill-current" />
              </div>
              <h3 className="text-xl font-black text-slate-800 uppercase tracking-tighter mb-2">Nenhum Favorito Salvo</h3>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-wider max-w-xs mx-auto leading-relaxed">
                Toca no ícone de coração nos anúncios que gostares para os guardares na tua lista pessoal.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favoriteAds.map(ad => (
                <div 
                  key={ad.id}
                  onClick={() => setSelectedAd(ad)}
                  className="bg-white rounded-[2.5rem] overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 transition-all duration-500 cursor-pointer group flex flex-col hover:shadow-[0_20px_50px_rgba(239,68,68,0.08)]"
                >
                  <div className="relative aspect-[16/10] overflow-hidden m-2 rounded-[2rem]">
                    <img src={ad.images[0]} alt={ad.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                    
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavoriteAd(ad.id);
                      }}
                      className="absolute top-4 right-4 p-2.5 bg-red-500 text-white rounded-2xl transition-all active:scale-90 border border-red-400"
                    >
                      <Heart size={16} className="fill-current" />
                    </button>
                    
                    <div className="absolute bottom-4 left-4">
                      <span className="bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl text-[9px] font-[900] text-slate-900 uppercase tracking-wider shadow-sm">
                        {ad.category}
                      </span>
                    </div>
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-sm font-[900] text-slate-800 line-clamp-2 mb-3 leading-[1.3] uppercase tracking-tight group-hover:text-red-500 transition-colors">{ad.title}</h3>
                      <div className="flex items-center gap-1.5 text-[9px] font-[900] text-slate-500 uppercase tracking-widest mb-4">
                        <MapPin size={12} className="text-slate-400" />
                        {ad.location}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-slate-100/60 mt-auto">
                      <div className="flex flex-col">
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Preço</span>
                        <p className="text-xl font-[1000] text-slate-900 tracking-tighter">
                          {ad.price.toLocaleString('pt-PT')} <span className="text-xs text-orange-500 font-black">€</span>
                        </p>
                      </div>
                      
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          if (!isAuthenticated) {
                            onShowAuth();
                            return;
                          }
                          onStartChat?.(ad);
                        }}
                        className="px-5 py-3 bg-red-50 text-red-600 hover:bg-red-500 hover:text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 flex items-center gap-2 border border-red-100"
                      >
                        <MessageSquare size={14} /> Mensagem
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Selected Ad Detail Modal within Favorites */}
        <AnimatePresence>
          {selectedAd && (
            <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center">
              <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setSelectedAd(null)}></div>
              <motion.div 
                initial={{ opacity: 0, y: 100 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 100 }}
                className="relative w-full max-w-4xl bg-white rounded-t-[3rem] md:rounded-[3rem] shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]"
              >
                <div className="w-full md:w-1/2 aspect-square md:aspect-auto bg-slate-900 relative group overflow-hidden flex items-center justify-center">
                  <AnimatePresence mode="wait">
                    <motion.img 
                      key={currentImgIdx}
                      src={selectedAd.images[currentImgIdx] || selectedAd.images[0]} 
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}
                      className="w-full h-full object-cover" 
                    />
                  </AnimatePresence>
                  {selectedAd.images && selectedAd.images.length > 1 && (
                    <>
                      <button onClick={(e) => { e.stopPropagation(); setCurrentImgIdx(p => p === 0 ? selectedAd.images.length - 1 : p - 1); }} className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-black/40 text-white rounded-full transition-all opacity-0 group-hover:opacity-100 z-10"><ChevronLeft size={20} /></button>
                      <button onClick={(e) => { e.stopPropagation(); setCurrentImgIdx(p => p === selectedAd.images.length - 1 ? 0 : p + 1); }} className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-black/40 text-white rounded-full transition-all opacity-0 group-hover:opacity-100 z-10"><ChevronRight size={20} /></button>
                    </>
                  )}
                </div>
                <div className="flex-1 p-8 overflow-y-auto flex flex-col">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <span className="bg-orange-50 text-orange-600 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">{selectedAd.category}</span>
                      <h2 className="text-2xl font-black text-slate-900 tracking-tighter uppercase mt-2">{selectedAd.title}</h2>
                    </div>
                    <button onClick={() => setSelectedAd(null)} className="p-3 bg-slate-100 rounded-full"><X size={20} /></button>
                  </div>
                  <p className="text-3xl font-black text-orange-600 mb-8">{selectedAd.price.toLocaleString('pt-PT')} €</p>
                  
                  <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl mb-8">
                    <User size={24} className="text-slate-400" />
                    <div className="flex-1">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Vendedor</p>
                      <p className="text-sm font-bold text-slate-900">{selectedAd.userName}</p>
                    </div>
                    <button 
                      onClick={() => {
                        if (!isAuthenticated) { onShowAuth(); return; }
                        onStartChat?.(selectedAd);
                        setSelectedAd(null);
                      }} 
                      className="p-3 bg-white text-blue-600 rounded-xl shadow-sm border border-slate-100 active:scale-90 transition-all flex items-center gap-2 font-bold text-xs"
                    >
                      <MessageSquare size={20} /> Enviar Mensagem
                    </button>
                  </div>
                  <div className="space-y-4 mb-8">
                    <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-widest">Descrição</h4>
                    <p className="text-sm text-slate-600 leading-relaxed">{selectedAd.description}</p>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#f8fafc] animate-in fade-in duration-700 pb-32">
      {/* Premium Sub-Header */}
      <div className="bg-white/80 backdrop-blur-2xl border-b border-slate-200/60 sticky top-[64px] lg:top-[80px] z-[80] px-4 pt-4 pb-2 md:px-8 transition-all duration-300 shadow-sm">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <button onClick={onClose} className="p-2.5 hover:bg-slate-100/80 text-slate-600 rounded-2xl transition-all active:scale-90 lg:hidden">
                <ArrowLeft size={22} />
              </button>
              <div>
                <h1 className="text-2xl font-[900] text-slate-900 tracking-tighter uppercase leading-none">Marketplace</h1>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse"></span>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Classificados Açores</p>
                </div>
              </div>
            </div>
            
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                if (!isAuthenticated) {
                  onShowAuth();
                } else {
                  setShowPostModal(true);
                }
              }}
              className="group flex items-center gap-3 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white px-6 py-3 rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-xl shadow-orange-600/20 transition-all border border-orange-400/20"
            >
              <div className="p-1 bg-white/20 rounded-lg group-hover:rotate-90 transition-transform duration-300">
                <Plus size={16} />
              </div>
              Publicar
            </motion.button>
          </div>
 
          {/* Luxury Search & Filters */}
          <div className="flex gap-3 relative">
            {/* Left Filter (Categories) */}
            <div className="relative">
              <button 
                onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                className={`p-4 border rounded-[1.25rem] shadow-sm transition-all active:scale-95 group flex items-center gap-1.5 h-14 ${
                  activeCategory !== 'all'
                    ? 'bg-orange-50 border-orange-200 text-orange-600'
                    : 'bg-white border-slate-200/60 text-slate-600 hover:text-orange-600 hover:border-orange-500/30'
                }`}
              >
                <LayoutGrid size={22} className="group-hover:rotate-90 transition-transform duration-500" />
                {activeCategory !== 'all' && (
                  <span className="text-[10px] font-black uppercase tracking-wider bg-orange-500 text-white px-2 py-0.5 rounded-full max-w-[85px] truncate">
                    {MARKET_CATEGORIES.find(c => c.id === activeCategory)?.label}
                  </span>
                )}
              </button>

              <AnimatePresence>
                {showCategoryDropdown && (
                  <>
                    <div 
                      className="fixed inset-0 z-[90]" 
                      onClick={() => setShowCategoryDropdown(false)}
                    />
                    
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute left-0 mt-2 w-64 bg-white border border-slate-100 rounded-3xl shadow-xl z-[100] py-3 overflow-hidden"
                    >
                      <div className="px-4 py-2 border-b border-slate-50 mb-1">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Filtrar por Categoria</p>
                      </div>
                      <div className="max-h-80 overflow-y-auto no-scrollbar">
                        {MARKET_CATEGORIES.map((cat) => (
                          <button
                            key={cat.id}
                            onClick={() => {
                              setActiveCategory(cat.id);
                              setShowCategoryDropdown(false);
                            }}
                            className={`w-full px-5 py-2.5 text-left text-xs font-bold transition-all flex items-center justify-between ${
                              activeCategory === cat.id
                                ? 'bg-orange-50 text-orange-600'
                                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <span className="text-slate-400">
                                {React.cloneElement(cat.icon as React.ReactElement, { size: 16 })}
                              </span>
                              <span>{cat.label}</span>
                            </div>
                            {activeCategory === cat.id && <Check size={14} className="text-orange-600" />}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            <div className="flex-1 relative group">
              <div className="absolute inset-0 bg-orange-500/5 rounded-[1.25rem] blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500 transition-colors" size={20} />
              <input 
                type="text" 
                placeholder="O que procura hoje?" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-14 bg-slate-50 border border-slate-200/60 rounded-[1.25rem] pl-14 pr-4 text-sm font-bold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-orange-500/5 focus:bg-white focus:border-orange-500/30 transition-all shadow-inner"
              />
            </div>
            
            <div className="relative">
              <button 
                onClick={() => setShowIslandDropdown(!showIslandDropdown)}
                className={`p-4 border rounded-[1.25rem] shadow-sm transition-all active:scale-95 group flex items-center gap-1.5 h-14 ${
                  selectedIsland !== 'Todas'
                    ? 'bg-orange-50 border-orange-200 text-orange-600'
                    : 'bg-white border-slate-200/60 text-slate-600 hover:text-orange-600 hover:border-orange-500/30'
                }`}
              >
                <Filter size={22} className="group-hover:rotate-180 transition-transform duration-500" />
                {selectedIsland !== 'Todas' && (
                  <span className="text-[10px] font-black uppercase tracking-wider bg-orange-500 text-white px-2 py-0.5 rounded-full">
                    {selectedIsland}
                  </span>
                )}
              </button>

              <AnimatePresence>
                {showIslandDropdown && (
                  <>
                    <div 
                      className="fixed inset-0 z-[90]" 
                      onClick={() => setShowIslandDropdown(false)}
                    />
                    
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-56 bg-white border border-slate-100 rounded-3xl shadow-xl z-[100] py-3 overflow-hidden"
                    >
                      <div className="px-4 py-2 border-b border-slate-50 mb-1">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Filtrar por Ilha</p>
                      </div>
                      <div className="max-h-60 overflow-y-auto no-scrollbar">
                        {AZORES_ISLANDS.map((island) => (
                          <button
                            key={island}
                            onClick={() => {
                              setSelectedIsland(island);
                              setShowIslandDropdown(false);
                            }}
                            className={`w-full px-5 py-2.5 text-left text-xs font-bold transition-all flex items-center justify-between ${
                              selectedIsland === island
                                ? 'bg-orange-50 text-orange-600'
                                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                            }`}
                          >
                            <span>{island}</span>
                            {selectedIsland === island && <Check size={14} className="text-orange-600" />}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>

        </div>
      </div>

      {/* Premium Ad Grid */}
      <div className="max-w-7xl mx-auto w-full px-4 md:px-8">
        <div className="flex items-center justify-between mb-8 px-2">
          <div className="flex items-center gap-3">
             <div className="w-1 h-6 bg-orange-600 rounded-full"></div>
             <p className="text-xs font-black text-slate-900 uppercase tracking-[0.15em]">{filteredAds.length} Anúncios em destaque</p>
          </div>
          <div className="hidden lg:flex gap-2 p-1.5 bg-slate-100/80 rounded-2xl border border-slate-200/50">
            <button onClick={() => setViewMode('grid')} className={`p-2.5 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-white text-orange-600 shadow-md' : 'text-slate-400 hover:text-slate-600'}`}><LayoutGrid size={18} /></button>
            <button onClick={() => setViewMode('list')} className={`p-2.5 rounded-xl transition-all ${viewMode === 'list' ? 'bg-white text-orange-600 shadow-md' : 'text-slate-400 hover:text-slate-600'}`}><List size={18} /></button>
          </div>
        </div>

        <div className={`grid ${viewMode === 'grid' ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5' : 'grid-cols-1'} gap-6`}>
          <AnimatePresence mode="popLayout">
            {filteredAds.map((ad, idx) => (
              <motion.div
                layout
                key={ad.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                onClick={() => setSelectedAd(ad)}
                className="bg-white rounded-[2.5rem] overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgba(249,115,22,0.1)] border border-slate-100 transition-all duration-500 cursor-pointer group"
              >
                <div className="relative aspect-[4/5] overflow-hidden m-2 rounded-[2rem]">
                  <img src={ad.images[0]} alt={ad.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className="bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl text-[9px] font-[900] text-slate-900 uppercase tracking-wider shadow-sm">
                      {ad.category}
                    </span>
                  </div>
                  
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFavoriteAd(ad.id);
                    }}
                    className={`absolute top-4 right-4 p-2.5 backdrop-blur-md rounded-2xl transition-all active:scale-90 border border-white/10 ${
                      favoriteAdIds.includes(ad.id)
                        ? 'bg-red-500 text-white border-red-500'
                        : 'bg-white/20 text-white hover:bg-white hover:text-red-500'
                    }`}
                  >
                    <Heart size={16} className={favoriteAdIds.includes(ad.id) ? "fill-current text-white" : ""} />
                  </button>
                </div>

                <div className="p-6">
                  <h3 className="text-[13px] font-[900] text-slate-800 line-clamp-2 mb-3 group-hover:text-orange-600 transition-colors leading-[1.3] uppercase tracking-tight">{ad.title}</h3>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex flex-col">
                       <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Preço</span>
                       <p className="text-2xl font-[1000] text-slate-900 tracking-tighter">
                         {ad.price.toLocaleString('pt-PT')} <span className="text-xs text-orange-500 font-black ml-0.5">€</span>
                       </p>
                    </div>
                    <div className="bg-slate-50 p-2 rounded-xl group-hover:bg-orange-50 transition-colors">
                       <ChevronRight size={16} className="text-slate-300 group-hover:text-orange-500 transition-all group-hover:translate-x-1" />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-100/60">
                    <div className="flex items-center gap-1.5 text-[9px] font-[900] text-slate-500 uppercase tracking-widest">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                      {ad.location}
                    </div>
                    <span className="text-[9px] font-bold text-slate-300 uppercase tracking-tight">
                      {new Date(ad.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Post Ad Modal */}
      <AnimatePresence>
        {showPostModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowPostModal(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            ></motion.div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-xl bg-white rounded-[3rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-8 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tighter uppercase">Publicar Anúncio</h2>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Preencha os detalhes do que deseja vender</p>
                </div>
                <button onClick={() => setShowPostModal(false)} className="p-3 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-full transition-all active:scale-90">
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-6">
                {/* Image Upload Area */}
                <div className="grid grid-cols-4 gap-3">
                  {newAd.images.map((img, i) => (
                    <div key={i} className="relative aspect-square rounded-2xl overflow-hidden group">
                      <img src={img} className="w-full h-full object-cover" />
                      <button 
                        onClick={() => setNewAd(p => ({ ...p, images: p.images.filter((_, idx) => idx !== i) }))}
                        className="absolute inset-0 bg-red-500/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  ))}
                  {newAd.images.length < 4 && (
                    <label className="aspect-square rounded-2xl border-2 border-dashed border-slate-200 hover:border-orange-500 flex flex-col items-center justify-center text-slate-400 hover:text-orange-600 transition-all cursor-pointer bg-slate-50">
                      <Camera size={24} className="mb-2" />
                      <span className="text-[9px] font-black uppercase tracking-widest">Adicionar</span>
                      <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                    </label>
                  )}
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block px-2">Título do Anúncio</label>
                    <input 
                      type="text" placeholder="Ex: Bicicleta de montanha Specialized"
                      value={newAd.title} onChange={e => setNewAd(p => ({ ...p, title: e.target.value }))}
                      className="w-full h-14 bg-slate-50 border border-slate-100 rounded-2xl px-6 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block px-2">Preço (€)</label>
                      <input 
                        type="number" placeholder="0.00"
                        value={newAd.price} onChange={e => setNewAd(p => ({ ...p, price: e.target.value }))}
                        className="w-full h-14 bg-slate-50 border border-slate-100 rounded-2xl px-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block px-2">Categoria</label>
                      <select 
                        value={newAd.category} onChange={e => setNewAd(p => ({ ...p, category: e.target.value }))}
                        className="w-full h-14 bg-slate-50 border border-slate-100 rounded-2xl px-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                      >
                        {MARKET_CATEGORIES.filter(c => c.id !== 'all').map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block px-2">Ilha</label>
                      <select 
                        value={newAd.location} onChange={e => setNewAd(p => ({ ...p, location: e.target.value }))}
                        className="w-full h-14 bg-slate-50 border border-slate-100 rounded-2xl px-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                      >
                        {AZORES_ISLANDS.filter(island => island !== 'Todas').map(island => <option key={island} value={island}>{island}</option>)}
                      </select>
                    </div>
                  </div>
                  {newAd.category === 'jobs' && (
                    <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 flex items-start gap-3 animate-in fade-in duration-300">
                      <Check className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-xs font-black text-emerald-800 uppercase tracking-tight">Publicação Gratuita</p>
                        <p className="text-[10px] font-bold text-emerald-600 leading-normal mt-0.5">
                          Nesta categoria não são cobrados créditos nem taxas de publicação (disponível para procura de emprego e prestação de serviços).
                        </p>
                      </div>
                    </div>
                  )}
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block px-2">Descrição</label>
                    <textarea 
                      placeholder="Descreva o seu artigo em detalhe..." rows={4}
                      value={newAd.description} onChange={e => setNewAd(p => ({ ...p, description: e.target.value }))}
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-6 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                    ></textarea>
                  </div>

                  {/* Contact Info Panel */}
                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100/50 space-y-4">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Informações de Contacto</p>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase mb-1 px-1">Nome do Anunciante</p>
                        <div className="h-12 bg-white border border-slate-100 rounded-xl px-4 flex items-center text-xs font-bold text-slate-800">
                          {userProfile?.name || 'Administrador'}
                        </div>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase mb-1 px-1">Telemóvel do Anunciante</p>
                        <div className="h-12 bg-white border border-slate-100 rounded-xl px-4 flex items-center text-xs font-bold text-slate-800">
                          {userProfile?.phone || 'Sem telemóvel registado'}
                        </div>
                      </div>
                    </div>
                    <label className="flex items-center gap-3 px-1 pt-1 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={phoneVisible} 
                        onChange={(e) => setPhoneVisible(e.target.checked)}
                        className="w-4 h-4 text-orange-600 border-slate-200 rounded focus:ring-orange-500/20"
                      />
                      <span className="text-xs font-bold text-slate-600 select-none">Mostrar o meu número de telemóvel publicamente no anúncio</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="p-8 bg-slate-50 border-t border-slate-100 flex gap-4">
                <button onClick={() => setShowPostModal(false)} className="flex-1 h-14 rounded-2xl font-black text-xs uppercase tracking-widest text-slate-500 hover:bg-slate-100 transition-all">Cancelar</button>
                <button 
                  onClick={handlePostAd}
                  disabled={loading}
                  className="flex-[2] h-14 bg-orange-600 hover:bg-orange-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-orange-600/20 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      A publicar...
                    </>
                  ) : (
                    "Confirmar e Publicar"
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedAd && (
          <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelectedAd(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
            ></motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 100 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 100 }}
              className="relative w-full max-w-4xl bg-white rounded-t-[3rem] md:rounded-[3rem] shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]"
            >
              <div className="w-full md:w-1/2 aspect-square md:aspect-auto bg-slate-900 relative group overflow-hidden flex items-center justify-center">
                <AnimatePresence mode="wait">
                  <motion.img 
                    key={currentImgIdx}
                    src={selectedAd.images[currentImgIdx] || selectedAd.images[0]} 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className="w-full h-full object-cover" 
                  />
                </AnimatePresence>
                
                {/* Navigation Arrows if more than 1 image */}
                {selectedAd.images && selectedAd.images.length > 1 && (
                  <>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentImgIdx(prev => prev === 0 ? selectedAd.images.length - 1 : prev - 1);
                      }} 
                      className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-black/40 hover:bg-black/60 text-white rounded-full transition-all backdrop-blur-sm opacity-0 group-hover:opacity-100 flex items-center justify-center z-10"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentImgIdx(prev => prev === selectedAd.images.length - 1 ? 0 : prev + 1);
                      }} 
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-black/40 hover:bg-black/60 text-white rounded-full transition-all backdrop-blur-sm opacity-0 group-hover:opacity-100 flex items-center justify-center z-10"
                    >
                      <ChevronRight size={20} />
                    </button>
                    
                    {/* Dots indicator */}
                    <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5 z-10 pointer-events-auto">
                      {selectedAd.images.map((_, i) => (
                        <button
                          key={i}
                          onClick={(e) => { e.stopPropagation(); setCurrentImgIdx(i); }}
                          className={`w-2.5 h-2.5 rounded-full transition-all ${i === currentImgIdx ? 'bg-orange-600 w-5' : 'bg-white/60'}`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
              <div className="flex-1 p-8 overflow-y-auto flex flex-col">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                       <span className="bg-orange-50 text-orange-600 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">{selectedAd.category}</span>
                       <span className="text-[10px] font-bold text-slate-400">{new Date(selectedAd.createdAt).toLocaleDateString()}</span>
                    </div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tighter uppercase">{selectedAd.title}</h2>
                  </div>
                  <button onClick={() => setSelectedAd(null)} className="p-3 bg-slate-100 rounded-full"><X size={20} /></button>
                </div>

                <p className="text-3xl font-black text-orange-600 mb-8">{selectedAd.price.toLocaleString('pt-PT')} €</p>
                
                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl mb-8">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-100">
                    <User size={24} className="text-slate-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Vendedor</p>
                    <p className="text-sm font-bold text-slate-900">{selectedAd.userName}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => {
                        if (!isAuthenticated) {
                          onShowAuth();
                          return;
                        }
                        onStartChat?.(selectedAd);
                        setSelectedAd(null);
                      }} 
                      className="p-3 bg-white text-blue-600 rounded-xl shadow-sm border border-slate-100 active:scale-90 transition-all flex items-center gap-2 font-bold text-xs"
                    >
                      <MessageSquare size={20} /> Enviar Mensagem
                    </button>
                    {selectedAd.phoneVisible && selectedAd.userPhone && (
                      <a href={`tel:${selectedAd.userPhone}`} className="p-3 bg-green-600 text-white rounded-xl shadow-lg shadow-green-600/20 active:scale-90 transition-all flex items-center justify-center">
                        <Phone size={20} />
                      </a>
                    )}
                  </div>
                </div>

                <div className="space-y-4 mb-8">
                  <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-widest">Descrição</h4>
                  <p className="text-sm text-slate-600 leading-relaxed">{selectedAd.description}</p>
                </div>

                <div className="mt-auto pt-8 border-t border-slate-100 flex items-center justify-between">
                   <div className="flex items-center gap-2 text-slate-400 font-bold text-xs">
                     <MapPin size={16} /> {selectedAd.location}
                   </div>
                   <div className="flex gap-4">
                     <button 
                       onClick={() => onToggleFavoriteAd(selectedAd.id)} 
                       className={`transition-colors active:scale-95 ${favoriteAdIds.includes(selectedAd.id) ? 'text-red-500' : 'text-slate-400 hover:text-red-500'}`}
                     >
                       <Heart size={22} className={favoriteAdIds.includes(selectedAd.id) ? "fill-current" : ""} />
                     </button>
                     <button className="text-slate-400 hover:text-blue-500"><Share2 size={22} /></button>
                   </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Approval Status Wait Modal */}
      <AnimatePresence>
        {showApprovalModal && approvalAdId && (() => {
          const currentAd = ads.find(ad => ad.id === approvalAdId);
          const currentStatus = currentAd ? (currentAd.status || 'pending') : (hasSeenInProps && timeLeft === 0 ? 'rejected' : 'pending');
          
          return (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[999] flex items-center justify-center bg-slate-900/80 backdrop-blur-md p-6"
            >
              <motion.div 
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="bg-white rounded-[3rem] p-10 w-full max-w-lg shadow-2xl border border-slate-100 text-center space-y-6 relative overflow-hidden"
              >
                {/* Visual Status Indicator */}
                {currentStatus !== 'active' && currentStatus !== 'rejected' && (
                  <div className="space-y-6">
                    <div className="relative w-24 h-24 mx-auto flex items-center justify-center bg-amber-50 rounded-full border border-amber-200">
                      <Clock className="w-10 h-10 text-amber-500 animate-spin" style={{ animationDuration: '3s' }} />
                      <div className="absolute inset-0 border-4 border-dashed border-amber-400 rounded-full animate-spin" style={{ animationDuration: '10s' }} />
                    </div>
                    
                    <div>
                      <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tighter">Aguardando Aprovação...</h3>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">O seu anúncio está a ser verificado pelo administrador</p>
                    </div>

                    {/* Progress Bar (10 Seconds Countdown) */}
                    <div className="space-y-2 max-w-md mx-auto">
                      <div className="flex justify-between text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">
                        <span>Tempo para análise rápida</span>
                        <span>{timeLeft}s</span>
                      </div>
                      <div className="h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                        <motion.div 
                          className="h-full bg-gradient-to-r from-amber-500 to-orange-500 shadow-lg shadow-amber-500/20"
                          initial={{ width: '100%' }}
                          animate={{ width: `${(timeLeft / 10) * 100}%` }}
                          transition={{ ease: 'linear', duration: 1 }}
                        />
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-400 font-bold uppercase leading-relaxed max-w-sm mx-auto">
                      Por favor, aguarde enquanto o administrador analisa e valida os dados de segurança do seu anúncio no painel administrativo.
                    </p>

                    {/* Fallback button when time runs out */}
                    {timeLeft === 0 && (
                      <div className="pt-4 space-y-2">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-tight">O administrador ainda está a analisar...</p>
                        <div className="flex gap-2">
                          <button
                            onClick={async () => {
                              // Auto Approve Test Fallback
                              const updated = ads.map(a => a.id === approvalAdId ? { ...a, status: 'active' } : a);
                              await onUpdateAds(updated);
                            }}
                            className="flex-1 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl text-xs font-black uppercase shadow-lg shadow-emerald-500/20 transition-all"
                          >
                            Auto-Aprovar (Modo Teste)
                          </button>
                          <button
                            onClick={() => {
                              setShowApprovalModal(false);
                              setApprovalAdId(null);
                            }}
                            className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-2xl text-xs font-black uppercase transition-all"
                          >
                            Fechar
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {currentStatus === 'active' && (
                  <div className="space-y-6 py-4">
                    <div className="w-20 h-20 bg-emerald-50 border-2 border-emerald-200 rounded-full flex items-center justify-center mx-auto text-emerald-500 shadow-lg shadow-emerald-100 animate-bounce">
                      <Check className="w-10 h-10 stroke-[3]" />
                    </div>
                    
                    <div>
                      <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tighter">Anúncio Aprovado!</h3>
                      <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest mt-1">O seu anúncio já está online e visível para todos!</p>
                    </div>

                    <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                      O classificado cumpre todas as nossas diretivas de segurança e foi publicado no Marketplace Azores4you com sucesso.
                    </p>

                    <button
                      onClick={() => {
                        setShowApprovalModal(false);
                        setApprovalAdId(null);
                      }}
                      className="w-full max-w-xs py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-xl active:scale-95 mx-auto"
                    >
                      Entrar no Marketplace
                    </button>
                  </div>
                )}

                {currentStatus === 'rejected' && (
                  <div className="space-y-6 py-4">
                    <div className="w-20 h-20 bg-red-50 border-2 border-red-200 rounded-full flex items-center justify-center mx-auto text-red-500 shadow-lg shadow-red-100">
                      <X className="w-10 h-10 stroke-[3]" />
                    </div>
                    
                    <div>
                      <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tighter">Anúncio Rejeitado</h3>
                      <p className="text-xs font-bold text-red-600 uppercase tracking-widest mt-1">Erro de Segurança ou Violação de Política</p>
                    </div>

                    <div className="bg-red-50/50 p-4 rounded-2xl border border-red-100 text-left space-y-2 max-w-md mx-auto">
                      <span className="text-[10px] font-black uppercase text-red-700 tracking-wider">Motivo da rejeição:</span>
                      <p className="text-xs text-slate-600 leading-relaxed font-medium">
                        O anúncio contém erros de segurança, fotografias não condizentes ou viola alguma das políticas e termos de utilização estipulados pela plataforma Azores4you.
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        setShowApprovalModal(false);
                        setApprovalAdId(null);
                      }}
                      className="w-full max-w-xs py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-xl active:scale-95 mx-auto"
                    >
                      Fechar e Corrigir
                    </button>
                  </div>
                )}
              </motion.div>
            </motion.div>
          );
        })()}
      </AnimatePresence>
    </div>
  );
};

export default MarketplaceSection;
