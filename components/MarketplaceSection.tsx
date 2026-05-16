
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
];

const MarketplaceSection: React.FC<MarketplaceSectionProps> = ({
  isAuthenticated,
  userProfile,
  onShowAuth,
  onClose
}) => {
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showPostModal, setShowPostModal] = useState(false);
  const [selectedAd, setSelectedAd] = useState<Ad | null>(null);

  // Form State
  const [newAd, setNewAd] = useState({
    title: '',
    description: '',
    price: '',
    category: 'electronics',
    location: 'São Miguel',
    images: [] as string[]
  });

  useEffect(() => {
    fetchAds();
  }, []);

  const fetchAds = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/api/marketplace_ads?t=${Date.now()}`);
      const data = await res.json();
      
      // If empty, add some mock data for the user to see examples
      if (!data || data.length === 0) {
        const mockData: Ad[] = [
          {
            id: 'm1',
            title: 'iPhone 15 Pro Max 256GB - Como Novo',
            description: 'Vendo iPhone 15 Pro Max em estado impecável. Sempre usado com capa e película. Bateria a 100%. Factura e garantia.',
            price: 1150,
            category: 'electronics',
            location: 'Ponta Delgada',
            images: ['https://images.unsplash.com/photo-1696446701796-da61225697cc?q=80&w=2070&auto=format&fit=crop'],
            userEmail: 'vendedor@exemplo.pt',
            userName: 'João Silva',
            userPhone: '912345678',
            createdAt: new Date().toISOString(),
            status: 'active'
          },
          {
            id: 'm2',
            title: 'BMW Série 1 116d - 2021',
            description: 'Viatura Nacional, 1 dono, revisões na marca. GPS, Sensores de estacionamento, Ar Condicionado Automático.',
            price: 24500,
            category: 'vehicles',
            location: 'Ribeira Grande',
            images: ['https://images.unsplash.com/photo-1555215695-3004980ad54e?q=80&w=2070&auto=format&fit=crop'],
            userEmail: 'auto@exemplo.pt',
            userName: 'Carlos Ferreira',
            userPhone: '919887766',
            createdAt: new Date().toISOString(),
            status: 'active'
          },
          {
            id: 'm3',
            title: 'T2 no Centro de Ponta Delgada',
            description: 'Apartamento renovado no centro histórico. Cozinha equipada, varanda com vista cidade. Pronto a habitar.',
            price: 185000,
            category: 'real_estate',
            location: 'Ponta Delgada',
            images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2070&auto=format&fit=crop'],
            userEmail: 'imoveis@exemplo.pt',
            userName: 'Imobiliária Açores',
            userPhone: '296123456',
            createdAt: new Date().toISOString(),
            status: 'active'
          }
        ];
        setAds(mockData);
        // Persist mocks if allowed
        saveAds(mockData);
      } else {
        setAds(data);
      }
    } catch (err) {
      console.error("Error fetching ads:", err);
    } finally {
      setLoading(false);
    }
  };

  const saveAds = async (updatedAds: Ad[]) => {
    try {
      await fetch(`${API_BASE_URL}/api/marketplace_ads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedAds)
      });
    } catch (err) {
      console.error("Error saving ads:", err);
    }
  };

  const handlePostAd = async () => {
    if (!isAuthenticated) {
      onShowAuth();
      return;
    }

    if (!newAd.title || !newAd.price || !newAd.description) {
      alert("Por favor preencha todos os campos obrigatórios");
      return;
    }

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
    setAds(updatedAds);
    await saveAds(updatedAds);
    setShowPostModal(false);
    setNewAd({ title: '', description: '', price: '', category: 'electronics', location: 'São Miguel', images: [] });
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
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 animate-in fade-in duration-500 pb-32">
      {/* Header Estilo OLX */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-40 px-4 py-4 md:px-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors lg:hidden">
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-xl font-black text-slate-900 tracking-tighter uppercase">Marketplace</h1>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Classificados dos Açores</p>
            </div>
          </div>
          <button 
            onClick={() => setShowPostModal(true)}
            className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-5 py-2.5 rounded-full font-black text-xs uppercase tracking-widest shadow-lg shadow-orange-600/20 transition-all active:scale-95"
          >
            <Plus size={18} />
            Publicar
          </button>
        </div>

        {/* Search & Filters */}
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="O que procura?" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-12 bg-slate-50 border border-slate-100 rounded-2xl pl-12 pr-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-all shadow-sm"
            />
          </div>
          <button className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-600 hover:bg-slate-50 shadow-sm transition-all active:scale-90">
            <Filter size={20} />
          </button>
        </div>
      </div>

      {/* Categories Bar */}
      <div className="flex overflow-x-auto gap-3 px-4 py-6 no-scrollbar scroll-smooth">
        {MARKET_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`flex flex-col items-center gap-2 min-w-[80px] p-4 rounded-3xl transition-all duration-300 ${
              activeCategory === cat.id 
                ? 'bg-orange-600 text-white shadow-xl shadow-orange-600/20 scale-105' 
                : 'bg-white text-slate-600 hover:bg-white/80 shadow-sm'
            }`}
          >
            <div className={`p-2 rounded-2xl ${activeCategory === cat.id ? 'bg-white/20' : 'bg-slate-50'}`}>
              {cat.icon}
            </div>
            <span className="text-[10px] font-black uppercase tracking-tighter text-center whitespace-nowrap">{cat.label}</span>
          </button>
        ))}
      </div>

      {/* View Toggle (Desktop Only) */}
      <div className="hidden lg:flex px-8 mb-4 items-center justify-between">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{filteredAds.length} anúncios encontrados</p>
        <div className="flex gap-2 p-1 bg-white border border-slate-200 rounded-xl">
          <button onClick={() => setViewMode('grid')} className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-orange-50 text-orange-600' : 'text-slate-400'}`}><LayoutGrid size={18} /></button>
          <button onClick={() => setViewMode('list')} className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-orange-50 text-orange-600' : 'text-slate-400'}`}><List size={18} /></button>
        </div>
      </div>

      {/* Ads List */}
      <div className={`px-4 md:px-8 grid ${viewMode === 'grid' ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5' : 'grid-cols-1'} gap-4`}>
        <AnimatePresence mode="popLayout">
          {filteredAds.map((ad) => (
            <motion.div
              layout
              key={ad.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onClick={() => setSelectedAd(ad)}
              className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all cursor-pointer group"
            >
              <div className="relative aspect-square overflow-hidden">
                <img src={ad.images[0]} alt={ad.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black text-slate-900 uppercase tracking-tighter">
                  {ad.category}
                </div>
                <button className="absolute top-3 right-3 p-2 bg-white/20 backdrop-blur-md hover:bg-white text-white hover:text-red-500 rounded-full transition-all active:scale-90">
                  <Heart size={16} />
                </button>
              </div>
              <div className="p-4">
                <h3 className="text-sm font-black text-slate-900 line-clamp-2 mb-2 group-hover:text-orange-600 transition-colors">{ad.title}</h3>
                <p className="text-lg font-black text-orange-600 mb-3">{ad.price.toLocaleString('pt-PT')} €</p>
                <div className="flex items-center justify-between pt-3 border-t border-slate-50">
                  <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    <MapPin size={12} />
                    {ad.location}
                  </div>
                  <div className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">
                    {new Date(ad.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
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
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block px-2">Preço (€)</label>
                      <input 
                        type="number" placeholder="0.00"
                        value={newAd.price} onChange={e => setNewAd(p => ({ ...p, price: e.target.value }))}
                        className="w-full h-14 bg-slate-50 border border-slate-100 rounded-2xl px-6 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block px-2">Categoria</label>
                      <select 
                        value={newAd.category} onChange={e => setNewAd(p => ({ ...p, category: e.target.value }))}
                        className="w-full h-14 bg-slate-50 border border-slate-100 rounded-2xl px-6 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                      >
                        {MARKET_CATEGORIES.filter(c => c.id !== 'all').map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
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
