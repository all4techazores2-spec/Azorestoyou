import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  ArrowLeft, MoreHorizontal, Grid, Film, Tag, Calendar, MessageCircle, 
  Share2, Check, UserPlus, UserCheck, Utensils, MapPin, Globe, Phone, 
  ExternalLink, Sparkles, Plus, Bookmark
} from 'lucide-react';
import { SocialProfile } from '../types';

interface CommunityProfileViewProps {
  profile: SocialProfile;
  isMyProfile: boolean;
  onBack: () => void;
  onEditProfile: () => void;
  onBookBusiness?: (businessType: string, businessId: string) => void;
  onSendMessage?: (targetHandle: string) => void;
  userPosts?: any[];
}

const CommunityProfileView: React.FC<CommunityProfileViewProps> = ({
  profile,
  isMyProfile,
  onBack,
  onEditProfile,
  onBookBusiness,
  onSendMessage,
  userPosts = []
}) => {
  const [activeTab, setActiveTab] = useState<'grid' | 'reels' | 'tagged'>('grid');
  const [isFollowing, setIsFollowing] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  const handleShare = () => {
    navigator.clipboard?.writeText?.(window.location.origin + `#community/${profile.handle}`);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // Sample media grid if no posts
  const defaultMediaGrid = [
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1518877593221-1f28583780b4?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1544717305-2782549b5136?w=800&auto=format&fit=crop&q=80'
  ];

  const highlights = profile.highlights && profile.highlights.length > 0 ? profile.highlights : [
    { id: 'h1', title: 'São Miguel', cover: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=300&auto=format&fit=crop&q=80' },
    { id: 'h2', title: 'Terceira', cover: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=300&auto=format&fit=crop&q=80' },
    { id: 'h3', title: 'Pico', cover: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=300&auto=format&fit=crop&q=80' },
    { id: 'h4', title: 'Faial', cover: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=300&auto=format&fit=crop&q=80' }
  ];

  return (
    <div className="community-profile bg-white min-h-screen text-[#071A3D] flex flex-col pb-24">
      {/* Top Header */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md px-4 h-14 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button 
            onClick={onBack} 
            className="p-2 -ml-1 text-slate-700 hover:bg-slate-100 rounded-full transition-colors active:scale-95"
          >
            <ArrowLeft size={20} />
          </button>
          <span className="text-sm font-semibold text-slate-800 tracking-tight">
            {profile.handle}
          </span>
          {profile.isVerified && (
            <span className="w-4 h-4 rounded-full bg-blue-500 text-white flex items-center justify-center text-[10px] font-semibold">
              ✓
            </span>
          )}
        </div>

        <div className="relative">
          <button 
            onClick={() => setShowOptions(!showOptions)}
            className="p-2 text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
          >
            <MoreHorizontal size={20} />
          </button>

          {showOptions && (
            <div className="absolute right-0 top-12 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 py-1.5 z-40 animate-in fade-in zoom-in-95">
              <button 
                onClick={() => { handleShare(); setShowOptions(false); }}
                className="w-full px-4 py-2.5 text-left text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-2.5"
              >
                <Share2 size={14} className="text-slate-400" />
                <span>Partilhar Perfil</span>
              </button>
              {isMyProfile && (
                <button 
                  onClick={() => { onEditProfile(); setShowOptions(false); }}
                  className="w-full px-4 py-2.5 text-left text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-2.5"
                >
                  <Sparkles size={14} className="text-emerald-500" />
                  <span>Editar Perfil</span>
                </button>
              )}
            </div>
          )}
        </div>
      </header>

      {/* Profile Details Container */}
      <div className="p-4 space-y-4">
        
        {/* Top Summary Row: Avatar & Counters */}
        <div className="flex items-center justify-between gap-4">
          <div className="relative">
            <div className="w-20 h-20 rounded-full p-[2px] bg-gradient-to-tr from-emerald-500 to-blue-500">
              <div className="w-full h-full rounded-full border-2 border-white overflow-hidden bg-white">
                <img src={profile.avatar} alt={profile.name} className="w-full h-full object-cover" />
              </div>
            </div>
            {profile.isBusiness && (
              <span className="absolute -bottom-1 -right-1 bg-emerald-600 text-white text-[8px] font-semibold uppercase px-1.5 py-0.5 rounded-full border border-white shadow-sm">
                Negócio
              </span>
            )}
          </div>

          <div className="flex-1 flex justify-around items-center text-center">
            <div>
              <span className="block text-base font-semibold text-slate-800 leading-none">
                {profile.postsCount ?? 24}
              </span>
              <span className="text-[11px] font-bold text-slate-400">publicações</span>
            </div>
            <div>
              <span className="block text-base font-semibold text-slate-800 leading-none">
                {profile.followersCount ?? 1320}
              </span>
              <span className="text-[11px] font-bold text-slate-400">seguidores</span>
            </div>
            <div>
              <span className="block text-base font-semibold text-slate-800 leading-none">
                {profile.followingCount ?? 684}
              </span>
              <span className="text-[11px] font-bold text-slate-400">a seguir</span>
            </div>
          </div>
        </div>

        {/* Bio, Identity & Location */}
        <div className="space-y-1">
          <div className="flex items-center gap-1.5">
            <h2 className="text-sm font-semibold text-slate-900 leading-none">{profile.name}</h2>
            {profile.isVerified && (
              <span className="w-3.5 h-3.5 rounded-full bg-blue-500 text-white flex items-center justify-center text-[8px] font-semibold">
                ✓
              </span>
            )}
          </div>

          <p className="text-[11px] font-bold text-emerald-700">{profile.handle}</p>

          {profile.isBusiness && profile.businessCategory && (
            <p className="text-[11px] font-bold text-slate-500">
              {profile.businessCategory} • {profile.island || 'Açores'}
            </p>
          )}

          {profile.bio && (
            <p className="text-xs text-slate-700 font-medium whitespace-pre-line leading-relaxed pt-1">
              {profile.bio}
            </p>
          )}

          {profile.location && (
            <p className="text-[11px] font-bold text-slate-500 flex items-center gap-1 pt-1">
              <MapPin size={12} className="text-emerald-600" />
              <span>{profile.location}</span>
            </p>
          )}

          {profile.website && (
            <a 
              href={profile.website} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-[11px] font-bold text-blue-600 hover:underline flex items-center gap-1 pt-0.5"
            >
              <Globe size={12} />
              <span>{profile.website.replace('https://', '')}</span>
            </a>
          )}
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex items-center gap-2">
          {isMyProfile ? (
            <>
              <button 
                onClick={onEditProfile}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold  transition-all active:scale-95"
              >
                Editar perfil
              </button>
              <button 
                onClick={handleShare}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all active:scale-95 flex items-center gap-1.5"
              >
                <Share2 size={14} />
                <span>{copiedLink ? 'Copiado!' : 'Partilhar'}</span>
              </button>
            </>
          ) : (
            <>
              {/* Follow Button */}
              <button 
                onClick={() => setIsFollowing(!isFollowing)}
                className={`flex-1 py-2.5 rounded-xl text-xs font-semibold  transition-all active:scale-95 flex items-center justify-center gap-1.5 shadow-sm ${
                  isFollowing 
                    ? 'bg-slate-100 text-slate-700 hover:bg-slate-200' 
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20'
                }`}
              >
                {isFollowing ? (
                  <>
                    <UserCheck size={14} />
                    <span>A seguir</span>
                  </>
                ) : (
                  <>
                    <UserPlus size={14} />
                    <span>Seguir</span>
                  </>
                )}
              </button>

              {/* If Business: Book button connects to Super-App */}
              {profile.isBusiness && (
                <button 
                  onClick={() => onBookBusiness?.(profile.businessCollection || 'restaurants', profile.businessId || '')}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold  transition-all active:scale-95 flex items-center gap-1.5 shadow-sm shadow-blue-600/20"
                >
                  <Calendar size={14} />
                  <span>Reservar</span>
                </button>
              )}

              {/* Send Direct Message */}
              <button 
                onClick={() => onSendMessage?.(profile.handle)}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all active:scale-95 flex items-center gap-1.5"
              >
                <MessageCircle size={14} />
                <span>Mensagem</span>
              </button>
            </>
          )}
        </div>

        {/* Highlights Row (Destaques) */}
        <div className="pt-2">
          <div className="flex items-center gap-4 overflow-x-auto pb-2 scrollbar-none">
            {isMyProfile && (
              <button 
                onClick={onEditProfile}
                className="flex flex-col items-center gap-1.5 flex-shrink-0 group"
              >
                <div className="w-14 h-14 rounded-full border-2 border-dashed border-slate-300 flex items-center justify-center text-slate-400 group-hover:border-emerald-500 group-hover:text-emerald-500 transition-colors">
                  <Plus size={20} />
                </div>
                <span className="text-[10px] font-bold text-slate-500">Nova</span>
              </button>
            )}

            {highlights.map(hl => (
              <div key={hl.id} className="flex flex-col items-center gap-1.5 flex-shrink-0 cursor-pointer">
                <div className="w-14 h-14 rounded-full p-[2px] border border-slate-200">
                  <img src={hl.cover} alt={hl.title} className="w-full h-full rounded-full object-cover" />
                </div>
                <span className="text-[10px] font-bold text-slate-600 truncate w-14 text-center">
                  {hl.title}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Subtabs Bar (Grid / Reels / Tagged) */}
        <div className="flex border-t border-slate-100 pt-1">
          <button 
            onClick={() => setActiveTab('grid')}
            className={`flex-1 py-3 flex justify-center border-b-2 transition-all ${
              activeTab === 'grid' 
                ? 'border-emerald-600 text-emerald-600' 
                : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            <Grid size={18} />
          </button>
          <button 
            onClick={() => setActiveTab('reels')}
            className={`flex-1 py-3 flex justify-center border-b-2 transition-all ${
              activeTab === 'reels' 
                ? 'border-emerald-600 text-emerald-600' 
                : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            <Film size={18} />
          </button>
          <button 
            onClick={() => setActiveTab('tagged')}
            className={`flex-1 py-3 flex justify-center border-b-2 transition-all ${
              activeTab === 'tagged' 
                ? 'border-emerald-600 text-emerald-600' 
                : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            <Tag size={18} />
          </button>
        </div>

        {/* 3x3 Media Grid */}
        <div className="grid grid-cols-3 gap-1 pt-1">
          {(userPosts.length > 0 ? userPosts.map(p => p.images?.[0] || p.image || defaultMediaGrid[0]) : defaultMediaGrid).map((imgUrl, i) => (
            <div 
              key={i} 
              className="aspect-square bg-slate-100 overflow-hidden relative group cursor-pointer"
            >
              <img src={imgUrl} alt={`post_${i}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default CommunityProfileView;
