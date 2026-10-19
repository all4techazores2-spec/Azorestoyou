import React, { useState, useEffect } from 'react';
import { 
  Search, X, MapPin, Hash, Building2, User, Heart, MessageCircle, 
  Sparkles, TrendingUp, ChevronRight, Star, CheckCircle2, ArrowRight
} from 'lucide-react';
import { API_BASE_URL } from '../config';
import { SocialProfile } from '../types';

interface CommunityExploreSectionProps {
  onSelectPost: (post: any) => void;
  onSelectProfile: (handle: string) => void;
  onBookBusiness?: (category: string, businessId: string) => void;
  onStartChatWith?: (userName: string) => void;
}

const AZORES_ISLANDS = [
  'Todas',
  'São Miguel',
  'Terceira',
  'Pico',
  'Faial',
  'São Jorge',
  'Flores',
  'Graciosa',
  'Santa Maria',
  'Corvo'
];

const SEARCH_TABS = [
  { id: 'all', label: 'Tudo' },
  { id: 'profiles', label: 'Pessoas' },
  { id: 'businesses', label: 'Negócios' },
  { id: 'hashtags', label: 'Hashtags' },
  { id: 'posts', label: 'Publicações' }
];

const CommunityExploreSection: React.FC<CommunityExploreSectionProps> = ({
  onSelectPost,
  onSelectProfile,
  onBookBusiness,
  onStartChatWith
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIsland, setSelectedIsland] = useState('Todas');
  const [activeSearchTab, setActiveSearchTab] = useState('all');

  // Explore feed state (idle)
  const [explorePosts, setExplorePosts] = useState<any[]>([]);
  const [trendingTags, setTrendingTags] = useState<any[]>([]);
  const [featuredBusinesses, setFeaturedBusinesses] = useState<any[]>([]);
  const [isLoadingExplore, setIsLoadingExplore] = useState(false);

  // Search results state (active query)
  const [searchResults, setSearchResults] = useState<{
    profiles: any[];
    posts: any[];
    businesses: any[];
    hashtags: any[];
  }>({ profiles: [], posts: [], businesses: [], hashtags: [] });
  const [isSearching, setIsSearching] = useState(false);

  // Load Explore Feed on mount or island change
  useEffect(() => {
    const fetchExplore = async () => {
      setIsLoadingExplore(true);
      try {
        const islandParam = selectedIsland === 'Todas' ? '' : encodeURIComponent(selectedIsland);
        const res = await fetch(`${API_BASE_URL}/api/community/explore?island=${islandParam}`);
        if (res.ok) {
          const data = await res.json();
          setExplorePosts(data.posts || []);
          setTrendingTags(data.trendingHashtags || []);
          setFeaturedBusinesses(data.featuredBusinesses || []);
        }
      } catch (err) {
        console.error("Erro ao carregar explorar:", err);
      } finally {
        setIsLoadingExplore(false);
      }
    };
    fetchExplore();
  }, [selectedIsland]);

  // Live search debounced
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults({ profiles: [], posts: [], businesses: [], hashtags: [] });
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const islandParam = selectedIsland === 'Todas' ? '' : encodeURIComponent(selectedIsland);
        const res = await fetch(
          `${API_BASE_URL}/api/community/search?q=${encodeURIComponent(searchQuery)}&island=${islandParam}&category=${activeSearchTab}`
        );
        if (res.ok) {
          const data = await res.json();
          setSearchResults({
            profiles: data.profiles || [],
            posts: data.posts || [],
            businesses: data.businesses || [],
            hashtags: data.hashtags || []
          });
        }
      } catch (err) {
        console.error("Erro na pesquisa:", err);
      } finally {
        setIsSearching(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [searchQuery, selectedIsland, activeSearchTab]);

  return (
    <div className="community-explore space-y-4 py-4 px-3 select-none">
      
      {/* 1. Search Bar */}
      <div className="relative">
        <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Pesquisar contas, hashtags, empresas ou trilhos..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-slate-100 hover:bg-slate-150 focus:bg-white border-none rounded-2xl py-3 pl-10 pr-10 text-xs font-semibold focus:ring-2 focus:ring-[#00B857] text-[#071A3D] transition-all"
        />
        {searchQuery && (
          <button 
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600 p-0.5 rounded-full"
          >
            <X size={15} />
          </button>
        )}
      </div>

      {/* 2. Island Selector Filter */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {AZORES_ISLANDS.map(island => {
          const isSelected = selectedIsland === island;
          return (
            <button
              key={island}
              onClick={() => setSelectedIsland(island)}
              className={`px-3.5 py-1.5 rounded-full text-[10px] font-semibold  transition-all flex-shrink-0 flex items-center gap-1 ${
                isSelected
                  ? 'bg-[#0075ed] text-white shadow-md shadow-emerald-600/20'
                  : 'bg-slate-100 hover:bg-slate-200 text-[#071A3D]'
              }`}
            >
              {island !== 'Todas' && <MapPin size={10} />}
              <span>{island}</span>
            </button>
          );
        })}
      </div>

      {/* ================= IF SEARCH QUERY ACTIVE ================= */}
      {searchQuery.trim() ? (
        <div className="space-y-4 pt-1">
          
          {/* Sub-tabs selector for search */}
          <div className="flex items-center gap-2 border-b border-slate-100 pb-2 overflow-x-auto scrollbar-none">
            {SEARCH_TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveSearchTab(tab.id)}
                className={`text-xs font-semibold  pb-1 px-1 transition-colors relative flex-shrink-0 ${
                  activeSearchTab === tab.id ? 'text-[#0075ed]' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                {tab.label}
                {activeSearchTab === tab.id && (
                  <span className="absolute bottom-0 inset-x-0 h-0.5 bg-[#0075ed] rounded-full" />
                )}
              </button>
            ))}
          </div>

          {/* Search Content */}
          {isSearching ? (
            <div className="py-12 flex flex-col items-center justify-center gap-2 text-slate-400">
              <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
              <span className="text-[10px] font-bold ">A pesquisar nos Açores...</span>
            </div>
          ) : (
            <div className="space-y-4">
              
              {/* Profiles Result */}
              {(activeSearchTab === 'all' || activeSearchTab === 'profiles') && searchResults.profiles.length > 0 && (
                <div className="bg-white rounded-2xl border border-slate-100 p-4 space-y-3">
                  <h4 className="text-[10px] font-semibold  text-slate-400 flex items-center gap-1.5">
                    <User size={12} />
                    <span>Contas & Membros</span>
                  </h4>
                  <div className="space-y-2.5">
                    {searchResults.profiles.map(p => (
                      <div 
                        key={p.id || p.handle} 
                        className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors"
                        onClick={() => onSelectProfile(p.handle)}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <img src={p.avatar} alt={p.name} className="w-10 h-10 rounded-full object-cover border border-slate-100" />
                          <div className="min-w-0">
                            <h5 className="text-xs font-semibold text-[#071A3D] truncate flex items-center gap-1">
                              <span>{p.name}</span>
                              {p.verified && <CheckCircle2 size={12} className="text-[#0066FF] fill-current" />}
                            </h5>
                            <p className="text-[10px] text-[#0066FF] font-semibold lowercase truncate">{p.handle}</p>
                            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tight truncate">{p.location || 'Açores'}</p>
                          </div>
                        </div>
                        <button className="px-3 py-1 bg-slate-100 hover:bg-[#0075ed] hover:text-white text-[#071A3D] text-[9px] font-semibold  rounded-lg transition-all flex-shrink-0">
                          Ver perfil
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Businesses Result */}
              {(activeSearchTab === 'all' || activeSearchTab === 'businesses') && searchResults.businesses.length > 0 && (
                <div className="bg-white rounded-2xl border border-slate-100 p-4 space-y-3">
                  <h4 className="text-[10px] font-semibold  text-slate-400 flex items-center gap-1.5">
                    <Building2 size={12} />
                    <span>Empresas & Serviços Locais</span>
                  </h4>
                  <div className="space-y-2.5">
                    {searchResults.businesses.map(b => (
                      <div 
                        key={b.id} 
                        className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 transition-colors"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <img src={b.image} alt={b.name} className="w-11 h-11 rounded-xl object-cover border border-slate-100" />
                          <div className="min-w-0">
                            <h5 className="text-xs font-semibold text-[#071A3D] truncate">{b.name}</h5>
                            <p className="text-[10px] text-emerald-600 font-bold ">{b.category} • {b.island}</p>
                            <span className="text-[9px] text-amber-500 font-semibold flex items-center gap-0.5">
                              <Star size={10} className="fill-current" /> {b.rating}
                            </span>
                          </div>
                        </div>
                        <button 
                          onClick={() => onBookBusiness ? onBookBusiness(b.collection || b.category, b.id) : alert(`Reservar em ${b.name}`)}
                          className="px-3.5 py-1.5 bg-[#0075ed] hover:bg-emerald-600 text-white text-[10px] font-semibold  rounded-xl shadow-sm transition-all flex-shrink-0"
                        >
                          {b.actionText || 'Reservar'}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Hashtags Result */}
              {(activeSearchTab === 'all' || activeSearchTab === 'hashtags') && searchResults.hashtags.length > 0 && (
                <div className="bg-white rounded-2xl border border-slate-100 p-4 space-y-3">
                  <h4 className="text-[10px] font-semibold  text-slate-400 flex items-center gap-1.5">
                    <Hash size={12} />
                    <span>Etiquetas (#hashtags)</span>
                  </h4>
                  <div className="grid grid-cols-2 gap-2.5">
                    {searchResults.hashtags.map((h, i) => (
                      <div 
                        key={i} 
                        className="p-3 bg-slate-50 hover:bg-emerald-50/50 rounded-xl cursor-pointer border border-slate-100 transition-colors"
                        onClick={() => setSearchQuery(h.hashtag)}
                      >
                        <p className="text-xs font-semibold text-[#071A3D]">{h.hashtag}</p>
                        <p className="text-[9px] text-slate-400 font-bold mt-0.5">{h.count}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Posts Result Grid */}
              {(activeSearchTab === 'all' || activeSearchTab === 'posts') && searchResults.posts.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-[10px] font-semibold  text-slate-400 px-1">Publicações</h4>
                  <div className="grid grid-cols-3 gap-1.5 rounded-2xl overflow-hidden">
                    {searchResults.posts.map(post => {
                      const img = post.images?.[0] || post.image || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600';
                      return (
                        <div 
                          key={post.id}
                          className="relative aspect-square bg-slate-100 cursor-pointer overflow-hidden group"
                          onClick={() => onSelectPost(post)}
                        >
                          <img src={img} alt="Post" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 text-white transition-opacity">
                            <span className="flex items-center gap-1 text-[10px] font-semibold">
                              <Heart size={12} className="fill-current" /> {post.likes || 0}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* No results notice */}
              {searchResults.profiles.length === 0 && searchResults.businesses.length === 0 && searchResults.hashtags.length === 0 && searchResults.posts.length === 0 && (
                <div className="py-12 text-center text-slate-400 space-y-2">
                  <p className="text-xs font-bold">Nenhum resultado encontrado para "{searchQuery}".</p>
                  <p className="text-[10px]">Tente pesquisar por #SãoMiguel, Picos de Aventura ou Trilhos.</p>
                </div>
              )}

            </div>
          )}

        </div>
      ) : (
        /* ================= DEFAULT EXPLORE FEED (MOSAIC GRID & TRENDS) ================= */
        <div className="space-y-5 pt-1">
          
          {/* Trending Hashtags Bar */}
          <div className="bg-white rounded-2xl border border-slate-100 p-4 space-y-3">
            <div className="flex justify-between items-center">
              <h4 className="text-xs font-semibold  text-[#071A3D] flex items-center gap-1.5">
                <TrendingUp size={14} className="text-[#0075ed]" />
                <span>Tendências nos Açores</span>
              </h4>
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              {trendingTags.map((t, i) => (
                <div 
                  key={i} 
                  className="p-3 bg-slate-50 hover:bg-slate-100 rounded-xl flex flex-col justify-between cursor-pointer border border-slate-100 transition-all"
                  onClick={() => setSearchQuery(t.hashtag)}
                >
                  <span className="text-xs font-semibold text-[#071A3D]">{t.hashtag}</span>
                  <span className="text-[9px] text-slate-400 font-bold mt-1">{t.count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Featured Commercial Businesses Carousel (Screen 4 of Mockup) */}
          <div className="bg-white rounded-2xl border border-slate-100 p-4 space-y-3">
            <div className="flex justify-between items-center">
              <h4 className="text-xs font-semibold  text-[#071A3D] flex items-center gap-1.5">
                <Sparkles size={14} className="text-amber-500" />
                <span>Negócios em Destaque</span>
              </h4>
            </div>
            <div className="space-y-3">
              {featuredBusinesses.map(biz => (
                <div key={biz.id} className="flex items-center justify-between p-2.5 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-3 min-w-0">
                    <img src={biz.image} alt={biz.name} className="w-12 h-12 rounded-xl object-cover" />
                    <div className="min-w-0">
                      <h5 className="text-xs font-semibold text-[#071A3D] truncate">{biz.name}</h5>
                      <p className="text-[9px] text-[#0075ed] font-semibold  truncate mt-0.5">{biz.category}</p>
                      <p className="text-[9px] text-slate-400 font-bold mt-0.5 flex items-center gap-1">
                        <Star size={10} className="text-amber-500 fill-current" />
                        <span>{biz.rating}</span> • <span>{biz.island}</span>
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={() => onBookBusiness ? onBookBusiness(biz.collection || biz.category, biz.id) : alert(`Reservar ${biz.name}`)}
                    className="px-3.5 py-1.5 bg-[#0075ed] hover:bg-emerald-600 active:scale-95 text-white text-[10px] font-semibold  rounded-xl shadow-md shadow-emerald-600/20 transition-all flex-shrink-0"
                  >
                    {biz.actionText || 'Reservar'}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Instagram-style 3-Column Explore Mosaic Grid */}
          <div className="space-y-2">
            <h4 className="text-[10px] font-semibold  text-slate-400 px-1">Explorar Açores</h4>
            <div className="grid grid-cols-3 gap-1 rounded-2xl overflow-hidden shadow-sm">
              {explorePosts.map((post, idx) => {
                const img = post.images?.[0] || post.image || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600';
                const isFeatured = idx % 7 === 1; // Mosaic pattern: every few items get a bigger visual or badge
                return (
                  <div 
                    key={post.id || idx}
                    className="relative aspect-square bg-slate-100 cursor-pointer overflow-hidden group select-none"
                    onClick={() => onSelectPost(post)}
                  >
                    <img 
                      src={img} 
                      alt="Explore" 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                    />
                    
                    {/* Media indicator badge */}
                    {post.images && post.images.length > 1 && (
                      <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-white shadow-sm" />
                    )}

                    {/* Hover stats */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-3 text-white transition-opacity">
                      <span className="flex items-center gap-1 text-[10px] font-semibold">
                        <Heart size={12} className="fill-current" /> {post.likes || 0}
                      </span>
                      {post.comments && post.comments.length > 0 && (
                        <span className="flex items-center gap-1 text-[10px] font-semibold">
                          <MessageCircle size={12} className="fill-current" /> {post.comments.length}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      )}

    </div>
  );
};

export default CommunityExploreSection;
