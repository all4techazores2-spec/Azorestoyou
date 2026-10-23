import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, Search, Heart, MessageCircle, Share2, MoreHorizontal, Send, 
  Image as ImageIcon, Video, Smile, Link, Mail, MessageSquare, Copy, 
  CheckCircle2, X, Camera, Type, Palette, Filter, Music, Radio, Bookmark,
  ThumbsUp, User as UserIcon, MapPin, Compass, Trophy, Users, Star, Sparkles,
  Play, Pause, Mic, Paperclip, SendHorizonal, Calendar, Check, HelpCircle,
  Hash, ChevronLeft, ChevronRight, MessageCircleCode, CheckSquare, Bell, Menu as MenuIcon, Plus, Settings,
  Building2, Clapperboard, LogOut, Coins
} from 'lucide-react';
import { API_BASE_URL } from '../config';
import { saveCommunitySession } from '../services/communitySession';
import { uploadCommunityMedia } from '../services/communityUpload';
import AzoresLogo from './AzoresLogo';
import './community.css';
import CommunityReels from './CommunityReels';
import CommunityMessages from './CommunityMessages';
import { useCommunityLive } from '../services/useCommunityLive';
import CommunitySavedReels from './CommunitySavedReels';
import { socialRequest, communityAvatar, profileAvatar, socialMediaUrl } from '../services/communitySocial';
import { SocialProfile } from '../types';
import CommunityProfileView from './CommunityProfileView';
import CommunityEditProfileModal from './CommunityEditProfileModal';
import CommunityCreatePostModal from './CommunityCreatePostModal';
import CommunityPostDetailModal from './CommunityPostDetailModal';
import CommunityExploreSection from './CommunityExploreSection';
import CommunityStoriesViewer from './CommunityStoriesViewer';
import CommunityDirectChatModal from './CommunityDirectChatModal';
import CommunityNotificationsModal from './CommunityNotificationsModal';
import CommunityDirectBookingModal from './CommunityDirectBookingModal';

interface CommunitySectionProps {
  isAuthenticated: boolean;
  userName: string;
  userProfile?: any;
  posts: Post[];
  onSyncPosts: () => void;
  onShowAuth: () => void;
  onClose: () => void;
  onLogout?: () => void;
  onOpenReservations?: () => void;
  onOpenProfile?: () => void;
  onBookBusiness?: (businessType: string, businessId: string) => void;
}

interface Post {
  id: number;
  author: string;
  authorHandle?: string;
  avatar: string;
  authorAvatar?: string;
  time: string;
  location: string;
  content: string;
  image?: string;
  video?: string;
  likes: number;
  comments: Comment[];
  isLiked?: boolean;
  isSaved?: boolean;
  images?: string[];
  checkInPlace?: string;
  likedBy?: string[];
  savedBy?: string[];
  businessTag?: {
    id: string;
    name: string;
    category: string;
    collection: string;
    image?: string;
    actionText?: string;
  };
  tags?: string[];
}

interface Comment {
  id: number;
  author: string;
  avatar?: string;
  text: string;
  time: string;
  likes?: number;
  isLiked?: boolean;
  replies?: Comment[];
  image?: string;
  voiceUrl?: string;
  gif?: string;
}

interface Story {
  id: string | number;
  authorId?: string;
  handle?: string;
  userName: string;
  avatar: string;
  mediaUrl: string;
  mediaType: 'image' | 'video';
  timestamp: number;
}

interface Reel {
  id: number;
  author: string;
  avatar: string;
  videoUrl: string;
  caption: string;
  likes: number;
  comments: number;
  isLiked?: boolean;
  isSaved?: boolean;
}

interface Group {
  id: string;
  name: string;
  banner: string;
  description: string;
  membersCount: number;
  isAdmin?: boolean;
}

interface EventItem {
  id: string;
  title: string;
  image: string;
  date: string;
  time: string;
  island: string;
  location: string;
  participants: string[];
}

interface ChatMessage {
  id: string;
  sender: string;
  text?: string;
  imageUrl?: string;
  videoUrl?: string;
  voiceUrl?: string;
  fileUrl?: string;
  fileName?: string;
  timestamp: string;
  read: boolean;
}

const CommunitySection: React.FC<CommunitySectionProps> = ({ 
  isAuthenticated, 
  userName, 
  userProfile,
  posts, 
  onSyncPosts, 
  onShowAuth, 
  onClose,
  onLogout,
  onOpenReservations,
  onOpenProfile,
  onBookBusiness
}) => {
  // Social Profile & Identity state
  const [myProfile, setMyProfile] = useState<SocialProfile | null>(null);
  const [viewingProfile, setViewingProfile] = useState<SocialProfile | null>(null);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);

  // Mobile Tab bar navigation: 'feed' | 'explore' | 'favorites' | 'profile'
  const [activeMobileTab, setActiveMobileTab] = useState<'feed' | 'explore' | 'favorites' | 'profile' | 'messages' | 'reels'>('feed');
  const [selectedExploreCategory, setSelectedExploreCategory] = useState<string>('Para ti');
  
  // Overlays / Drawers
  const [showHamburgerDrawer, setShowHamburgerDrawer] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [activeStoryView, setActiveStoryView] = useState<Story | null>(null);
  const [activePostDetail, setActivePostDetail] = useState<Post | null>(null);
  const [activeChatUser, setActiveChatUser] = useState<string | null>(null);
  const [showAISidebar, setShowAISidebar] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [activeDirectBooking, setActiveDirectBooking] = useState<any | null>(null);
  const [communityNotice, setCommunityNotice] = useState('');
  const [unreadMessages, setUnreadMessages] = useState(0);

  const [reelComposeRequest, setReelComposeRequest] = useState(0);
  const [selectedReelId, setSelectedReelId] = useState<string | null>(() => new URLSearchParams(window.location.search).get('communityReel'));
  const [unreadActivity, setUnreadActivity] = useState(0);
  useEffect(() => { if (selectedReelId) setActiveMobileTab('reels'); }, [selectedReelId]);
  useEffect(() => {
    if (!myProfile?.email) return;
    let cancelled = false;
    const refresh = async () => {
      if (document.hidden) return;
      try { const data = await socialRequest<{unreadCount:number}>('notifications', myProfile.email); if (!cancelled) setUnreadActivity(data.unreadCount); } catch {}
    };
    refresh(); const timer = setInterval(refresh, 30000);
    window.addEventListener('community-notifications-changed', refresh);
    return () => { cancelled = true; clearInterval(timer); window.removeEventListener('community-notifications-changed', refresh); };
  }, [myProfile?.email]);

  const refreshMessageCount = async () => { if (!myProfile?.email) return; try { const rows = await socialRequest<{unread:number}[]>('conversations',myProfile.email); setUnreadMessages(rows.reduce((n,c)=>n+c.unread,0)); } catch {} };
  useCommunityLive(myProfile?.email || '', event => { if (['message','read','ready','resync'].includes(event.type)) refreshMessageCount(); });

  // Auto-load or create social profile on mount
  useEffect(() => {
    if (!isAuthenticated) return;
    const fetchProfile = async () => {
      try {
        const email = userProfile?.email || `${(userName || 'viajante').toLowerCase().replace(/\s+/g, '')}@azores4you.com`;
        const res = await fetch(`${API_BASE_URL}/api/community/profile/me?email=${encodeURIComponent(email)}`);
        if (res.ok) {
          const data = await res.json();
          // Persist the session token returned by the server so API calls work
          // immediately after page reload without requiring a new login.
          if (data.communityToken) {
            saveCommunitySession(email, data.communityToken);
          }
          setMyProfile(data);
        }
      } catch (err) {
        console.error("Erro ao carregar perfil social:", err);
      }
    };
    fetchProfile();
    window.addEventListener('community-follow-changed', fetchProfile);
    return () => window.removeEventListener('community-follow-changed', fetchProfile);
  }, [isAuthenticated, userProfile?.email, userName]);

  // Handle saving edited social profile
  const handleSaveProfile = async (updated: Partial<SocialProfile>): Promise<boolean> => {
    try {
      const email = userProfile?.email || myProfile?.email || '';
      const res = await fetch(`${API_BASE_URL}/api/community/profile/me`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, desiredHandle: updated.handle, ...updated })
      });
      if (res.ok) {
        const data = await res.json();
        setMyProfile(data.profile);
        return true;
      }
      return false;
    } catch (err) {
      console.error("Erro ao atualizar perfil:", err);
      return false;
    }
  };

  // Open any member or business social profile
  const openUserProfile = async (handleOrName: string) => {
    try {
      let target = handleOrName.trim();
      if (!target.startsWith('@')) {
        target = `@azorestoyou_${target.toLowerCase().replace(/[^a-z0-9_]/g, '')}`;
      }
      const res = await fetch(`${API_BASE_URL}/api/community/profile/${encodeURIComponent(target)}`);
      if (res.ok) {
        const data = await res.json();
        setViewingProfile(data);
        return;
      }
    } catch (err) {}

    setCommunityNotice('Não foi possível abrir este perfil. Tenta novamente.');
  };

  useEffect(() => { const handle=new URLSearchParams(window.location.search).get('communityProfile');if(handle&&myProfile?.id)openUserProfile(handle); }, [myProfile?.id]);

  // Form Composer State
  const [postText, setPostText] = useState('');
  const [selectedPhotos, setSelectedPhotos] = useState<File[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<File | null>(null);
  const [checkInPlace, setCheckInPlace] = useState<string | null>(null);
  const [isUploadingMedia, setIsUploadingMedia] = useState(false);
  const [activeCarouselIndex, setActiveCarouselIndex] = useState<{ [postId: number]: number }>({});

  // Comment Form State
  const [newCommentText, setNewCommentText] = useState('');
  const [commentFile, setCommentFile] = useState<File | null>(null);
  const [isRecordingComment, setIsRecordingComment] = useState(false);
  const [recordedCommentBlob, setRecordedCommentBlob] = useState<Blob | null>(null);
  const [commentGif, setCommentGif] = useState<string | null>(null);

  // Search
  const [searchQuery, setSearchQuery] = useState('');
  const [feedCategoryFilter, setFeedCategoryFilter] = useState<string>('Todos');

  // Sync posts on load
  useEffect(() => {
    onSyncPosts();
  }, []);

  // Cloudinary Uploader Helper
  const uploadFileToCloudinary = async (file: File, folder: string): Promise<string> => {
    setIsUploadingMedia(true);
    try {
      const url=await uploadCommunityMedia(file,myProfile?.email||userProfile?.email||'');
      setIsUploadingMedia(false);
      return url;
    } catch (e) {
      setIsUploadingMedia(false);
      console.error(e);
      throw new Error('Não foi possível carregar o ficheiro. Tenta novamente.');
    }
  };

  const [stories, setStories] = useState<Story[]>([]);
  const refreshStories = async () => { try { setStories(await socialRequest<Story[]>('stories', myProfile?.email || '')); } catch {} };
  useEffect(() => { refreshStories(); const timer=setInterval(refreshStories,60000); return()=>clearInterval(timer); }, [myProfile?.email]);
  const handleStoryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file=e.target.files?.[0];if(!file||!myProfile)return;
    try { const url=await uploadFileToCloudinary(file,'community/stories');await socialRequest('stories',myProfile.email,{mediaUrl:url,mediaType:file.type.startsWith('video/')?'video':'image'});await refreshStories();setCommunityNotice('História publicada.'); }
    catch(error){setCommunityNotice(error.message);}finally{e.target.value='';}
  };

  // Filter categories
  const feedCategories = ['Todos', 'Seguidores', 'Populares', 'Trilhos'];

  const handlePostLike = async (post: Post) => {
    try {
      const email = userProfile?.email || myProfile?.email || '';
      const res = await fetch(`${API_BASE_URL}/api/community/posts/${post.id}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userEmail: email, userName })
      });
      if (res.ok) {
        const data = await res.json();
        if (activePostDetail?.id === post.id) {
          setActivePostDetail({
            ...activePostDetail,
            likes: data.likes,
            isLiked: data.isLiked
          });
        }
        onSyncPosts();
      }
    } catch (e) {
      console.error("Erro ao dar gosto:", e);
    }
  };

  const handlePostSave = async (post: Post) => {
    try {
      const email = userProfile?.email || myProfile?.email || '';
      const res = await fetch(`${API_BASE_URL}/api/community/posts/${post.id}/save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userEmail: email, userName })
      });
      if (res.ok) {
        const data = await res.json();
        if (activePostDetail?.id === post.id) {
          setActivePostDetail({
            ...activePostDetail,
            isSaved: data.isSaved
          });
        }
        onSyncPosts();
      }
    } catch (e) {
      console.error("Erro ao guardar publicação:", e);
    }
  };

  // Submit comment
  const handleCommentSubmit = async () => {
    if (!newCommentText.trim() && !commentFile) return;

    let imageUrl = '';
    if (commentFile) {
      imageUrl = await uploadFileToCloudinary(commentFile, 'community/comments');
    }

    const newComment: Comment = {
      id: Date.now(),
      author: userName,
      avatar: communityAvatar,
      text: newCommentText,
      time: 'Agora',
      likes: 0,
      image: imageUrl || undefined
    };

    if (!activePostDetail) return;
    const finalPost = { ...activePostDetail, comments: [...activePostDetail.comments, newComment] };
    setActivePostDetail(finalPost);

    const updated = posts.map(p => p.id === activePostDetail.id ? finalPost : p);
    try {
      await fetch(`${API_BASE_URL}/api/posts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      });
      onSyncPosts();
      setNewCommentText('');
      setCommentFile(null);
    } catch (e) {
      console.error(e);
    }
  };

  // Ignore empty legacy records and adapt older post shapes without changing stored data.
  const feedPosts: Post[] = posts.filter(p => p && !([1700000001,1700000002,1700000003,1700000004].includes(p.id) && ['@azorestoyou_andrebraga','@azorestoyou_restaurantex','@azorestoyou_maria','@azorestoyou_trilhos','@azorestoyou_casaacorespe','@azorestoyou_whalewatching'].includes(p.authorHandle)) && (p.content || p.image || p.video || p.images?.length)).map(p => ({
    ...p,
    author: p.author || 'Membro da comunidade',
    avatar: profileAvatar(p.avatar || p.authorAvatar),
    content: p.content || '',
    location: p.location || '',
    time: p.time || '',
    comments: Array.isArray(p.comments) ? p.comments : [],
    images: (Array.isArray(p.images) && p.images.length ? p.images : p.image ? [p.image] : []).filter(Boolean)
      .map(url => socialMediaUrl(url)),
  }));
  const avatarFallback = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80"><rect width="80" height="80" rx="40" fill="#e9f2ff"/><circle cx="40" cy="30" r="14" fill="#6d8db5"/><path d="M14 76c0-30 52-30 52 0" fill="#6d8db5"/></svg>');
  const handleAvatarError = (e: React.SyntheticEvent<HTMLImageElement>) => { e.currentTarget.onerror = null; e.currentTarget.src = avatarFallback; };
  const filteredPosts = feedPosts.filter(p => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return p.content.toLowerCase().includes(q) || p.author.toLowerCase().includes(q);
    }
    if (feedCategoryFilter === 'Trilhos') {
      return p.content.toLowerCase().includes('trilho') || p.location.toLowerCase().includes('trilho');
    }
    if (feedCategoryFilter === 'Populares') {
      return p.likes >= 10;
    }
    return true;
  });

  // Authentication Guard: community is private to logged-in members
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center select-none">
        <div className="max-w-md w-full bg-white rounded-[2.5rem] p-8 shadow-xl border border-slate-100 flex flex-col items-center space-y-6">
          <div className="w-20 h-20 rounded-3xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-100">
            <Users size={36} />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold text-slate-800 tracking-tight">Comunidade Azorestoyou</h2>
            <p className="text-xs text-slate-500 font-semibold leading-relaxed">
              A rede social privada e exclusiva dos Açores. Para consultar publicações, histórias, perfis de membros e negócios, inicie sessão na sua conta da Super-App.
            </p>
          </div>
          <button
            onClick={onShowAuth}
            className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-semibold text-xs  shadow-xl shadow-emerald-600/20 active:scale-95 transition-all"
          >
            Iniciar Sessão com Conta Azorestoyou
          </button>
          <button
            onClick={onClose}
            className="text-xs font-bold text-slate-400 hover:text-slate-600 "
          >
            Voltar a Explorar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="community-app fixed inset-0 z-[120] bg-white text-[#071A3D] font-sans antialiased">
      
      {/* Dynamic hidden input for stories */}
      <input 
        type="file" 
        id="story-upload-file-mobile" 
        accept="image/*,video/*" 
        className="hidden" 
        onChange={handleStoryUpload} 
      />

      {/* Desktop Wrapper Frame - centered layout */}
      <div className="community-shell w-full h-full bg-white relative flex flex-col">
        
        {/* ================= FIXED HEADER ================= */}
        {!viewingProfile && activeMobileTab !== 'reels' && <header className="sticky top-0 z-[100] bg-white/90 backdrop-blur-md border-b border-slate-100 px-4 h-14 flex items-center justify-between">
          <button onClick={() => setShowHamburgerDrawer(true)} aria-label="Abrir menu da comunidade" className="p-2 hover:bg-slate-50 rounded-full transition-all text-[#071A3D]">
            <MenuIcon size={20} />
          </button>
          
          <div className="flex items-center gap-1.5 cursor-pointer" onClick={() => setActiveMobileTab('feed')}>
            <AzoresLogo size={26} />
            <span className="text-sm font-semibold tracking-tighter uppercase text-[#071A3D]">
              Azores<span className="text-[#0075ed]">Toyou</span>
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button aria-label="Pesquisar na comunidade" onClick={() => { setSearchQuery(''); setActiveMobileTab('explore'); }} className="p-2 hover:bg-slate-50 rounded-full text-[#071A3D]">
              <Search size={18} />
            </button>
            <button aria-label="Notificações" onClick={() => setShowNotifications(!showNotifications)} className="p-2 hover:bg-slate-50 rounded-full text-[#071A3D] relative">
              <Bell size={18} />
              {unreadActivity > 0 && <span className="community-activity-badge">{unreadActivity > 9 ? '9+' : unreadActivity}</span>}
            </button>
            <button 
              onClick={() => setActiveMobileTab('profile')} 
              className="w-8 h-8 rounded-full border border-slate-200 overflow-hidden ml-1 active:scale-95 transition-transform"
              title="O Meu Perfil"
            >
              <img src={profileAvatar(myProfile?.avatar || userProfile?.avatar)} alt="Avatar" onError={handleAvatarError} className="w-full h-full object-cover" />
            </button>
          </div>
        </header>}

        {communityNotice && <div className="community-notice" role="status"><span>{communityNotice}</span><button aria-label="Fechar aviso" onClick={()=>setCommunityNotice('')}><X size={16}/></button></div>}
        {/* ================= MAIN SCROLL CONTAINER ================= */}
        <main className={`community-main flex-1 min-h-0 overflow-y-auto ${activeMobileTab === 'reels' && !viewingProfile ? 'community-reels-main' : ''}`}>
          {viewingProfile && <CommunityProfileView profile={viewingProfile} currentProfile={myProfile} onOpenReel={(id) => { setViewingProfile(null); setSelectedReelId(id); setActiveMobileTab('reels'); }} isMyProfile={viewingProfile.id === myProfile?.id} onBack={() => setViewingProfile(null)} onEditProfile={() => setShowEditProfileModal(true)} onBookBusiness={onBookBusiness} onViewProfile={openUserProfile} onOpenPost={setActivePostDetail} onSendMessage={setActiveChatUser} userPosts={posts.filter(p => p.authorHandle === viewingProfile.handle || p.author === viewingProfile.name)} />}
          {!viewingProfile && activeMobileTab === 'reels' && <CommunityReels profile={myProfile} onBack={() => setActiveMobileTab('feed')} onViewProfile={openUserProfile} composeRequest={reelComposeRequest} onComposeConsumed={() => setReelComposeRequest(0)} initialReelId={selectedReelId}/>}
          
          {/* ================= TABS: FEED TAB ================= */}
          {!viewingProfile && activeMobileTab === 'feed' && (
            <div className="community-feed">
              
              {/* Categories Navigation scroll */}
              <div className="community-filters flex items-center gap-2 overflow-x-auto scrollbar-none">
                {feedCategories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setFeedCategoryFilter(cat)}
                    className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all flex-shrink-0 ${
                      feedCategoryFilter === cat 
                        ? 'bg-[#0075ed] text-white' 
                        : 'bg-slate-100 hover:bg-slate-200 text-[#071A3D]'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Stories Bar */}
              <div className="community-stories flex items-center gap-4 overflow-x-auto scrollbar-none border-b border-slate-100">
                {/* Create Story */}
                <div 
                  className="flex flex-col items-center gap-1 flex-shrink-0 cursor-pointer"
                  onClick={() => document.getElementById('story-upload-file-mobile')?.click()}
                >
                  <div className="relative w-14 h-14 rounded-full border border-slate-200 p-[2px] bg-slate-50 flex items-center justify-center overflow-hidden">
                    <img src={communityAvatar} alt="Minha" className="w-full h-full object-cover rounded-full" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-full">
                      <Plus size={16} className="text-white font-semibold" />
                    </div>
                  </div>
                  <span className="text-[9px] font-bold text-slate-550 truncate w-14 text-center">A tua história</span>
                </div>

                {/* Friends Stories */}
                {stories.map(story => (
                  <div 
                    key={story.id} 
                    className="flex flex-col items-center gap-1 flex-shrink-0 cursor-pointer"
                    onClick={() => setActiveStoryView(story)}
                  >
                    <div className="w-14 h-14 rounded-full p-[2px] bg-gradient-to-tr from-[#0066FF] to-[#00B857]">
                      <div className="w-full h-full rounded-full border-2 border-white bg-white overflow-hidden">
                        <img src={profileAvatar(story.avatar)} alt={story.userName} className="w-full h-full object-cover" />
                      </div>
                    </div>
                    <span className="text-[9px] font-bold text-slate-650 truncate w-14 text-center">{story.userName}</span>
                  </div>
                ))}
              </div>

              {/* Feed posts list */}
              <div className="community-posts">
                {filteredPosts.length === 0 && <div className="community-empty"><ImageIcon size={32} strokeWidth={1.3} /><h3>A tua comunidade começa aqui</h3><p>Partilha um momento dos Açores ou explora as publicações da comunidade.</p><button onClick={() => setShowCreateModal(true)}>Criar publicação</button></div>}
                {filteredPosts.map(post => {
                  const currentIdx = activeCarouselIndex[post.id] || 0;
                  const postImages = post.images || (post.image ? [post.image] : []);
                  const hasCarousel = postImages.length > 1;

                  return (
                    <div key={post.id} className="community-post bg-white overflow-hidden flex flex-col">
                      
                      {/* Card Header */}
                      <div className="community-post-header flex items-center justify-between">
                        <div 
                          className="flex items-center gap-3 cursor-pointer group"
                          onClick={() => openUserProfile(post.authorHandle || post.author)}
                        >
                          <img src={post.avatar || avatarFallback} onError={handleAvatarError} alt={post.author} className="w-10 h-10 rounded-full border border-slate-100 group-hover:scale-105 transition-transform object-cover" />
                          <div>
                            <h4 className="text-xs font-semibold text-[#071A3D] leading-none flex items-center gap-1.5 group-hover:text-emerald-600 transition-colors">
                              <span>{post.author}</span>
                              {post.checkInPlace && (
                                <span className="text-[10px] text-slate-450 font-semibold lowercase">
                                  está em <strong className="text-[#0075ed]">{post.checkInPlace}</strong>
                                </span>
                              )}
                            </h4>
                            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tight mt-1 flex items-center gap-1">
                              {post.authorHandle && <span className="text-[#0066FF] font-semibold lowercase">{post.authorHandle} •</span>}
                              <span>{post.location} • {post.time}</span>
                            </p>
                          </div>
                        </div>
                        <button className="p-2 text-slate-400 hover:bg-slate-50 rounded-full">
                          <MoreHorizontal size={16} />
                        </button>
                      </div>

                      {/* Media Carousel */}
                      {postImages.length > 0 && (
                        <div className="relative aspect-square bg-slate-50 overflow-hidden select-none">
                          <img 
                            src={postImages[currentIdx]} loading="lazy" decoding="async"
                            alt="Media" 
                            className="w-full h-full object-cover cursor-pointer" 
                            onClick={() => setActivePostDetail(post)} 
                          />
                          
                          {/* Indicator badge */}
                          {hasCarousel && (
                            <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm text-white text-[9px] font-semibold  px-2 py-0.5 rounded-full">
                              {currentIdx + 1}/{postImages.length}
                            </div>
                          )}

                          {/* Controls */}
                          {hasCarousel && (
                            <>
                              {currentIdx > 0 && (
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setActiveCarouselIndex(prev => ({ ...prev, [post.id]: currentIdx - 1 }));
                                  }}
                                  className="absolute left-2.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center transition-all shadow-md"
                                >
                                  <ChevronLeft size={16} />
                                </button>
                              )}
                              {currentIdx < postImages.length - 1 && (
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setActiveCarouselIndex(prev => ({ ...prev, [post.id]: currentIdx + 1 }));
                                  }}
                                  className="absolute right-2.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center transition-all shadow-md"
                                >
                                  <ChevronRight size={16} />
                                </button>
                              )}

                              {/* Carousel dots */}
                              <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 pointer-events-none">
                                {postImages.map((_, dotIdx) => (
                                  <span 
                                    key={dotIdx} 
                                    className={`w-1.5 h-1.5 rounded-full transition-all ${dotIdx === currentIdx ? 'bg-white scale-125' : 'bg-white/50'}`}
                                  />
                                ))}
                              </div>
                            </>
                          )}
                        </div>
                      )}

                      {post.video && (
                        <div className="relative aspect-square bg-black flex items-center justify-center">
                          <video src={post.video} controls muted autoPlay loop playsInline className="w-full h-full object-cover" />
                        </div>
                      )}

                      {/* Tagged Commercial Card (Direct Booking Integration) */}
                      {post.businessTag && (
                        <div className="m-3 p-3 bg-emerald-50/70 border border-emerald-100 rounded-2xl flex items-center justify-between gap-3">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className="w-10 h-10 rounded-xl bg-white border border-emerald-200 overflow-hidden flex-shrink-0 flex items-center justify-center text-emerald-600 font-semibold">
                              {post.businessTag.image ? (
                                <img src={post.businessTag.image} alt={post.businessTag.name} className="w-full h-full object-cover" />
                              ) : (
                                <Building2 size={18} />
                              )}
                            </div>
                            <div className="min-w-0">
                              <p className="text-[9px] font-semibold uppercase text-emerald-600 tracking-wider truncate">
                                {post.businessTag.category || 'Negócio Oficial'}
                              </p>
                              <h5 className="text-xs font-semibold text-slate-800 truncate">
                                {post.businessTag.name}
                              </h5>
                            </div>
                          </div>
                          <button 
                            onClick={() => onBookBusiness ? onBookBusiness(post.businessTag!.collection || post.businessTag!.category, post.businessTag!.id) : alert(`Reservar em ${post.businessTag!.name}`)}
                            className="px-3 py-1.5 bg-[#0075ed] hover:bg-emerald-600 active:scale-95 text-white text-[10px] font-semibold  rounded-xl shadow-sm transition-all flex-shrink-0"
                          >
                            {post.businessTag.actionText || 'Reservar'}
                          </button>
                        </div>
                      )}

                      {/* Action Bar */}
                      <div className="community-post-actions space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <button onClick={() => handlePostLike(post)} className={`flex items-center gap-1.5 transition-transform active:scale-125 ${post.isLiked ? 'text-rose-500' : 'text-[#071A3D]'}`}>
                              <Heart size={20} className={post.isLiked ? 'fill-current' : ''} />
                            </button>

                            <button onClick={() => setActivePostDetail(post)} className="flex items-center gap-1.5 text-[#071A3D]">
                              <MessageCircle size={20} />
                            </button>

                            <button onClick={async () => { const url = window.location.origin + '#community/post/' + post.id; if (navigator.share) { try { await navigator.share({ title: post.author, url }); } catch {} } else { await navigator.clipboard?.writeText(url); } }} className="text-[#071A3D]">
                              <Send size={21} strokeWidth={1.6} />
                            </button>
                          </div>

                          <button onClick={() => handlePostSave(post)} className={`transition-transform active:scale-125 ${post.isSaved ? 'text-[#0075ed]' : 'text-[#071A3D]'}`}>
                            <Bookmark size={20} className={post.isSaved ? 'fill-current' : ''} />
                          </button>
                        </div>

                        {/* Likes counter in Portuguese */}
                        <p className="text-[11px] font-semibold text-[#071A3D]">
                          {(post.likes || 0).toLocaleString('pt-PT')} gostos
                        </p>

                      {/* Text content with hashtag & mention highlights */}
                      {post.content && (
                        <div 
                          className="community-caption cursor-pointer"
                          onClick={() => setActivePostDetail(post)}
                        >
                          <p className="text-xs font-semibold text-slate-700 leading-relaxed whitespace-pre-line">
                            <strong className="mr-1 text-[#071A3D]">{post.authorHandle || post.author}</strong>{post.content.split(' ').map((word, wIdx) => {
                              if (word.startsWith('#')) {
                                return (
                                  <span 
                                    key={wIdx} 
                                    className="text-[#0075ed] font-semibold hover:underline mr-1 cursor-pointer" 
                                    onClick={(e) => { e.stopPropagation(); setSearchQuery(word); setActiveMobileTab('explore'); }}
                                  >
                                    {word}{' '}
                                  </span>
                                );
                              }
                              if (word.startsWith('@')) {
                                return (
                                  <span 
                                    key={wIdx} 
                                    className="text-[#0066FF] font-semibold hover:underline mr-1 cursor-pointer" 
                                    onClick={(e) => { e.stopPropagation(); openUserProfile(word); }}
                                  >
                                    {word}{' '}
                                  </span>
                                );
                              }
                              return word + ' ';
                            })}
                          </p>
                        </div>
                      )}

                        {/* Liked list summary */}
                        {post.likedBy && post.likedBy.length > 0 && (
                          <p className="text-[9px] text-slate-500 font-bold">
                            Gostos de <strong className="text-[#071A3D]">{post.likedBy[0]}</strong> {post.likes > 1 ? `e ${post.likes - 1} outros` : ''}
                          </p>
                        )}

                        <p className="community-post-time">{[post.time, post.location].filter(Boolean).join(" · ")}</p>
                        {post.comments && post.comments.length > 0 && (
                          <button 
                            onClick={() => setActivePostDetail(post)}
                            className="text-[10px] text-slate-400 font-bold hover:underline block pt-1"
                          >
                            Ver todos os {post.comments.length} comentários
                          </button>
                        )}
                      </div>

                    </div>
                  );
                })}
              </div>

            </div>
          )}

          {/* ================= TABS: EXPLORAR TAB ================= */}
          {!viewingProfile && activeMobileTab === 'explore' && (
            <CommunityExploreSection 
              onSelectPost={(post) => setActivePostDetail(post)}
              onSelectProfile={(handle) => openUserProfile(handle)}
              onBookBusiness={onBookBusiness}
              onStartChatWith={(u) => setActiveChatUser(u)}
            />
          )}

          {!viewingProfile && activeMobileTab === 'favorites' && <CommunitySavedReels email={myProfile?.email || ''} onOpenReel={(id) => { setSelectedReelId(id); setActiveMobileTab('reels'); }}/>}
          {/* ================= TABS: FAVORITOS TAB ================= */}
          {!viewingProfile && activeMobileTab === 'favorites' && (
            <div className="space-y-4 py-4 px-3">
              <h2 className="text-sm font-semibold  text-[#071A3D]">Favoritos e Guardados</h2>
              <div className="grid grid-cols-2 gap-3">
                {posts.filter(p => p.isSaved).map(post => (
                  <div key={post.id} className="bg-white rounded-xl border border-slate-100 overflow-hidden cursor-pointer shadow-sm" onClick={() => setActivePostDetail(post)}>
                    {(post.images?.[0] || post.image) && <img src={post.images?.[0] || post.image} alt="Publicação guardada" className="w-full aspect-square object-cover" />}
                    <div className="p-2">
                      <p className="text-[10px] font-semibold text-[#071A3D] truncate">{post.author}</p>
                      <p className="text-[9px] text-slate-400 font-bold mt-0.5 truncate">{post.location}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {!viewingProfile && activeMobileTab === 'profile' && (myProfile ? <CommunityProfileView profile={myProfile} currentProfile={myProfile} isMyProfile onOpenPost={setActivePostDetail} onBack={()=>setActiveMobileTab('feed')} onEditProfile={()=>setShowEditProfileModal(true)} onViewProfile={openUserProfile} onOpenReel={id=>{setSelectedReelId(id);setActiveMobileTab('reels');}} onSendMessage={setActiveChatUser} userPosts={posts.filter(p=>p.authorHandle===myProfile.handle)}/> : <div className="community-empty">A carregar o perfil…</div>)}

          {!viewingProfile && activeMobileTab === 'messages' && <CommunityMessages profile={myProfile} onOpen={setActiveChatUser}/>}

        </main>
        <nav className="community-bottom" aria-label="Navegação da comunidade">
          <button onClick={onClose}><Compass/><span>Explorar</span></button>
          <button className={activeMobileTab === 'feed' ? 'active' : ''} onClick={() => { setViewingProfile(null); setActiveMobileTab('feed'); }}><Users/><span>Comunidade</span></button>
          <button className="community-create" aria-label={activeMobileTab === 'reels' ? 'Novo reel' : 'Nova publicação'} onClick={() => { setViewingProfile(null); if (activeMobileTab === 'reels') setReelComposeRequest(n => n + 1); else setShowCreateModal(true); }}><Plus/></button>
          <button className={activeMobileTab === 'reels' && !viewingProfile ? 'active' : ''} onClick={() => { setViewingProfile(null); setActiveMobileTab('reels'); }}><Clapperboard/><span>Reels</span></button>
          <button className={activeMobileTab === 'messages' && !viewingProfile ? 'active' : ''} onClick={() => { setViewingProfile(null); setActiveMobileTab('messages'); }}><span className="community-nav-icon"><MessageCircle/>{unreadMessages>0&&<b>{unreadMessages>99?'99+':unreadMessages}</b>}</span><span>Mensagens</span></button>
        </nav>

        {/* Removed duplicate internal bottom nav - preserved super-app bottom bar */}

        {/* ================= HAMBURGER MENU SLIDE DRAWER ================= */}
        <AnimatePresence>
          {showHamburgerDrawer && (
            <div className="absolute inset-0 z-[200] overflow-hidden flex">
              {/* Dark overlay backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowHamburgerDrawer(false)}
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
              />
              
              {/* Drawer Container Panel */}
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: 'spring', damping: 25, stiffness: 220 }}
                className="community-drawer relative bg-white h-full z-10 flex flex-col"
              >
                <div className="community-drawer-top"><button aria-label="Fechar menu" onClick={() => setShowHamburgerDrawer(false)}><X size={22}/></button></div>
                <h2 className="community-drawer-title">A tua comunidade</h2>
                <div className="community-drawer-identity"><img src={profileAvatar(myProfile?.avatar || userProfile?.avatar)} onError={handleAvatarError} alt=""/><div><strong>{myProfile?.name || userName}</strong><p>{myProfile?.handle || ''}</p></div></div>
                <p className="community-drawer-label">CONTA</p>
                <nav className="community-drawer-nav" aria-label="Menu da comunidade">
                  {[
                    {label:'Perfil', Icon:UserIcon, action:() => setActiveMobileTab('profile')},
                    {label:'Reels', Icon:Clapperboard, action:() => setActiveMobileTab('reels')},
                    {label:'Mensagens', Icon:Send, action:() => {setSearchQuery('');setActiveMobileTab('messages');}},
                    {label:'Guardados', Icon:Bookmark, action:() => setActiveMobileTab('favorites')},
                    {label:'Atividade', Icon:Bell, action:() => setShowNotifications(true)},
                    {label:'Definições', Icon:Settings, action:() => setShowEditProfileModal(true)}
                  ].map(({label,Icon,action}) => <button key={label} onClick={() => {setShowHamburgerDrawer(false);setViewingProfile(null);action();}}><Icon size={23} strokeWidth={1.5}/><span>{label}</span><ChevronRight size={18} strokeWidth={1.5}/></button>)}
                </nav>
                <button className="community-drawer-logout" onClick={() => {setShowHamburgerDrawer(false);if(onLogout)onLogout();onClose();}}><LogOut size={21} strokeWidth={1.5}/><span>Terminar sessão</span></button>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* ================= STORY FULLSCREEN VIEWER ================= */}
        <CommunityStoriesViewer 
          isOpen={!!activeStoryView}
          ownProfileId={myProfile?.id}
          onClose={() => setActiveStoryView(null)}
          stories={stories}
          initialIndex={stories.findIndex(s => s.id === activeStoryView?.id) >= 0 ? stories.findIndex(s => s.id === activeStoryView?.id) : 0}
          onSendReply={async (story, text) => { if(!myProfile||!story.handle)return;try{const conversation=await socialRequest<{id:string}>('conversations',myProfile.email,{handle:story.handle});await socialRequest('conversations/'+conversation.id+'/messages',myProfile.email,{text,clientId:crypto.randomUUID()});setActiveStoryView(null);setActiveChatUser(story.handle);}catch(e){setCommunityNotice(e.message);throw e;} }}
        />

        {/* ================= NOVA PUBLICAÇÃO MODAL ================= */}
        <CommunityCreatePostModal 
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          myProfile={myProfile}
          onPostCreated={() => {
            onSyncPosts();
            refreshStories();
          }}
        />

        {/* ================= POST DETAILS MODAL ================= */}
        <CommunityPostDetailModal 
          isOpen={!!activePostDetail}
          onClose={() => setActivePostDetail(null)}
          post={activePostDetail}
          myProfile={myProfile}
          onLikeToggle={handlePostLike}
          onSaveToggle={handlePostSave}
          onBookBusiness={onBookBusiness}
          onAuthorClick={(handle) => openUserProfile(handle)}
          onCommentAdded={() => onSyncPosts()}
        />

        {/* ================= PRIVATE CHAT WINDOW MODAL ================= */}
        <CommunityDirectChatModal 
          isOpen={!!activeChatUser}
          onClose={() => setActiveChatUser(null)}
          targetUser={activeChatUser ? { name: activeChatUser, handle: activeChatUser } : null}
          myProfile={myProfile}
          onBookBusiness={onBookBusiness}
          onViewProfile={(handle) => openUserProfile(handle)}
        />

        {/* ================= EDIT PROFILE MODAL ================= */}
        <CommunityEditProfileModal 
          isOpen={showEditProfileModal}
          onClose={() => setShowEditProfileModal(false)}
          profile={myProfile}
          onSaveProfile={handleSaveProfile}
        />

        {/* ================= NOTIFICATIONS MODAL ================= */}
        <CommunityNotificationsModal 
          isOpen={showNotifications}
          profile={myProfile}
          onOpenReel={(id) => { setViewingProfile(null); setSelectedReelId(id); setActiveMobileTab('reels'); }}
          onClose={() => setShowNotifications(false)}
          onSelectProfile={(handle) => openUserProfile(handle)}
          onSelectPost={(postId) => {
            const p = posts.find(post => post.id === postId);
            if (p) setActivePostDetail(p);
          }}
          onOpenReservations={onOpenReservations}
        />

        {/* ================= DIRECT BOOKING SHEET ================= */}
        <CommunityDirectBookingModal 
          isOpen={!!activeDirectBooking}
          onClose={() => setActiveDirectBooking(null)}
          business={activeDirectBooking}
          userName={userName}
          userEmail={userProfile?.email || `${(userName || 'viajante').toLowerCase().replace(/\s+/g, '')}@azores4you.com`}
          onBookingSuccess={() => {
          }}
        />

      </div>
    </div>
  );
};

export default CommunitySection;
