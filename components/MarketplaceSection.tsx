
import React, { useState, useEffect } from 'react';
import { 
  Search, Plus, MapPin, Tag, Clock, ChevronRight, 
  Filter, LayoutGrid, List, MessageSquare, Phone,
  Camera, X, Check, ArrowLeft, ShoppingBag, Car, 
  Home, Laptop, Smartphone, Briefcase, Heart, Share2, 
  Trash2, Edit
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
  status: 'active' | 'sold' | 'hidden';
}

interface MarketplaceSectionProps {
  isAuthenticated: boolean;
  userProfile?: any;
  ads: Ad[];
  onUpdateAds: (ads: Ad[]) => Promise<void>;
  onShowAuth: () => void;
  onClose: () => void;
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
  onClose
}) => {
  const [loading, setLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showPostModal, setShowPostModal] = useState(false);
  const [selectedAd, setSelectedAd] = useState<Ad | null>(null);
  const [selectedIsland, setSelectedIsland] = useState('Todas');
  const [showIslandDropdown, setShowIslandDropdown] = useState(false);

  // Form State
  const [newAd, setNewAd] = useState({
    title: '',
    description: '',
    price: '',
    category: 'electronics',
    location: 'São Miguel',
    images: [] as string[]
  });

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
      const ad: Ad = {
        id: `ad_${Date.now()}`,
        title: newAd.title,
        description: newAd.description,
        price: parseFloat(newAd.price),
        category: newAd.category,
        location: newAd.location,
        images: newAd.images.length > 0 ? newAd.images : ['https://images.unsplash.com/photo-1540340334550-624b32a8a1de?q=80&w=2070&auto=format&fit=crop'],
        userEmail: userProfile.email,
        userName: userProfile.name,
        userPhone: userProfile.phone || '',
        createdAt: new Date().toISOString(),
        status: 'active'
      };

      const updatedAds = [ad, ...ads];
      await onUpdateAds(updatedAds);
      
      setShowPostModal(false);
      setNewAd({ title: '', description: '', price: '', category: 'electronics', location: 'São Miguel', images: [] });
    } catch (err) {
      alert("Erro ao publicar anúncio. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewAd(prev => ({
          ...prev,
          images: [...prev.images, reader.result as string]
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const filteredAds = ads.filter(ad => {
    const matchesCategory = activeCategory === 'all' || ad.category === activeCategory;
    const matchesSearch = ad.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          ad.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesIsland = selectedIsland === 'Todas' || ad.location === selectedIsland;
    return matchesCategory && matchesSearch && matchesIsland;
  });

  return (
    <div className="flex flex-col min-h-screen bg-[#f8fafc] animate-in fade-in duration-700 pb-32">
      {/* Premium Sub-Header */}
      <div className="bg-white/80 backdrop-blur-2xl border-b border-slate-200/60 sticky top-[80px] lg:top-[96px] z-[80] px-4 py-4 md:px-8 transition-all duration-300 shadow-sm">
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
              onClick={() => setShowPostModal(true)}
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

      {/* Modern Categories Bar */}
      <div className="max-w-7xl mx-auto w-full px-4 md:px-8 mt-4 mb-2">
        <div className="flex overflow-x-auto gap-2.5 py-3 no-scrollbar scroll-smooth">
          {MARKET_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-full transition-all duration-300 border text-xs font-bold uppercase tracking-wider whitespace-nowrap active:scale-95 shadow-sm ${
                activeCategory === cat.id 
                  ? 'bg-orange-600 text-white border-orange-600 shadow-md shadow-orange-600/20' 
                  : 'bg-white text-slate-600 hover:bg-slate-50 border-slate-200/60 hover:text-slate-800'
              }`}
            >
              <span className={`transition-colors duration-300 ${activeCategory === cat.id ? 'text-white' : 'text-slate-400'}`}>
                {React.cloneElement(cat.icon as React.ReactElement, { size: 16 })}
              </span>
              <span className="text-[10px] font-extrabold">{cat.label}</span>
            </button>
          ))}
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
                  
                  <button className="absolute top-4 right-4 p-2.5 bg-white/20 backdrop-blur-md hover:bg-white text-white hover:text-red-500 rounded-2xl transition-all active:scale-90 border border-white/10">
                    <Heart size={16} />
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
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block px-2">Descrição</label>
                    <textarea 
                      placeholder="Descreva o seu artigo em detalhe..." rows={4}
                      value={newAd.description} onChange={e => setNewAd(p => ({ ...p, description: e.target.value }))}
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-6 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                    ></textarea>
                  </div>
                </div>
              </div>

              <div className="p-8 bg-slate-50 border-t border-slate-100 flex gap-4">
                <button onClick={() => setShowPostModal(false)} className="flex-1 h-14 rounded-2xl font-black text-xs uppercase tracking-widest text-slate-500 hover:bg-slate-100 transition-all">Cancelar</button>
                <button 
                  onClick={handlePostAd}
                  className="flex-[2] h-14 bg-orange-600 hover:bg-orange-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-orange-600/20 transition-all active:scale-95"
                >
                  Confirmar e Publicar
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
              <div className="w-full md:w-1/2 aspect-square md:aspect-auto bg-slate-100">
                <img src={selectedAd.images[0]} className="w-full h-full object-cover" />
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
                    <button className="p-3 bg-white text-blue-600 rounded-xl shadow-sm border border-slate-100 active:scale-90 transition-all"><MessageSquare size={20} /></button>
                    <button className="p-3 bg-green-600 text-white rounded-xl shadow-lg shadow-green-600/20 active:scale-90 transition-all"><Phone size={20} /></button>
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
                     <button className="text-slate-400 hover:text-red-500"><Heart size={22} /></button>
                     <button className="text-slate-400 hover:text-blue-500"><Share2 size={22} /></button>
                   </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MarketplaceSection;
