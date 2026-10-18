import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, Search, Heart, MessageCircle, Share2, MoreHorizontal, Send, 
  Image as ImageIcon, Video, Smile, Link, Mail, MessageSquare, Copy, 
  CheckCircle2, X, Camera, Type, Palette, Filter, Music, Radio, Bookmark,
  ThumbsUp, User as UserIcon, MapPin, Compass, Trophy, Users, Star, Sparkles,
  Play, Pause, Mic, Paperclip, SendHorizonal, Calendar, Check, HelpCircle,
  Hash, ChevronLeft, ChevronRight, MessageCircleCode, CheckSquare, Bell, Menu as MenuIcon, Plus, Settings,
  Building2
} from 'lucide-react';
import { API_BASE_URL } from '../config';
import AzoresLogo from './AzoresLogo';
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
  onOpenReservations?: () => void;
  onOpenProfile?: () => void;
  onBookBusiness?: (businessType: string, businessId: string) => void;
}

interface Post {
  id: number;
  author: string;
  authorHandle?: string;
  avatar: string;
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
  id: number;
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
  onOpenReservations,
  onOpenProfile,
  onBookBusiness
}) => {
  // Social Profile & Identity state
  const [myProfile, setMyProfile] = useState<SocialProfile | null>(null);
  const [viewingProfile, setViewingProfile] = useState<SocialProfile | null>(null);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);

  // Mobile Tab bar navigation: 'feed' | 'explore' | 'favorites' | 'profile'
  const [activeMobileTab, setActiveMobileTab] = useState<'feed' | 'explore' | 'favorites' | 'profile'>('feed');
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

  // Auto-load or create social profile on mount
  useEffect(() => {
    if (!isAuthenticated) return;
    const fetchProfile = async () => {
      try {
        const email = userProfile?.email || `${(userName || 'viajante').toLowerCase().replace(/\s+/g, '')}@azores4you.com`;
        const res = await fetch(`${API_BASE_URL}/api/community/profile/me?email=${encodeURIComponent(email)}`);
        if (res.ok) {
          const data = await res.json();
          setMyProfile(data);
        }
      } catch (err) {
        console.error("Erro ao carregar perfil social:", err);
      }
    };
    fetchProfile();
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

    // Synthetic fallback profile
    setViewingProfile({
      id: `temp_${Date.now()}`,
      userId: handleOrName,
      email: `${handleOrName}@azores4you.com`,
      handle: `@azorestoyou_${handleOrName.toLowerCase().replace(/[^a-z0-9_]/g, '')}`,
      name: handleOrName,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${handleOrName}`,
      profileType: 'personal',
      followersCount: 140,
      followingCount: 95,
      postsCount: 18,
      location: 'São Miguel, Açores',
      bio: 'Membro entusiasta da Comunidade Azorestoyou 🌿'
    });
  };

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

  // Gamification credits
  const [userCredits, setUserCredits] = useState(() => {
    const saved = localStorage.getItem(`credits_${userName}`);
    return saved ? parseInt(saved, 10) : 100;
  });

  const addCredits = (amount: number) => {
    setUserCredits(prev => {
      const next = prev + amount;
      localStorage.setItem(`credits_${userName}`, next.toString());
      return next;
    });
  };

  // Sync posts on load
  useEffect(() => {
    onSyncPosts();
  }, []);

  // Cloudinary Uploader Helper
  const uploadFileToCloudinary = async (file: File, folder: string): Promise<string> => {
    setIsUploadingMedia(true);
    const formData = new FormData();
    formData.append('image', file);
    try {
      const res = await fetch(`${API_BASE_URL}/api/upload?folder=${encodeURIComponent(folder)}`, {
        method: 'POST',
        body: formData
      });
      if (!res.ok) throw new Error('Upload error');
      const data = await res.json();
      setIsUploadingMedia(false);
      return data.url;
    } catch (e) {
      setIsUploadingMedia(false);
      console.error(e);
      return URL.createObjectURL(file);
    }
  };

  // Mock Stories (expired in 24h)
  const [stories, setStories] = useState<Story[]>(() => {
    const defaults: Story[] = [
      { id: 1, userName: 'Marta Silva', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marta', mediaUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800', mediaType: 'image', timestamp: Date.now() - 3600000 },
      { id: 2, userName: 'João Melo', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Joao', mediaUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800', mediaType: 'image', timestamp: Date.now() - 7200000 },
      { id: 3, userName: 'Explora Açores', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Explora', mediaUrl: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800', mediaType: 'image', timestamp: Date.now() - 14400000 }
    ];
    return defaults;
  });

  const handleStoryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = await uploadFileToCloudinary(file, 'community/stories');
    const newStory: Story = {
      id: Date.now(),
      userName: userName,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userName}`,
      mediaUrl: url,
      mediaType: file.type.startsWith('video/') ? 'video' : 'image',
      timestamp: Date.now()
    };
    setStories([newStory, ...stories]);
    addCredits(50);
    alert('História publicada! Ganhou +50 CRÉDITOS.');
  };

  // Chat message system
  const [dmHistory, setDmHistory] = useState<{ [user: string]: ChatMessage[] }>({
    'Mariana Silva': [
      { id: '1', sender: 'Mariana Silva', text: 'Olá! Vais ao trilho da Lagoa do Fogo no Sábado?', timestamp: '14:20', read: true },
      { id: '2', sender: userName, text: 'Olá Mariana! Sim, estou a pensar ir.', timestamp: '14:22', read: true }
    ],
    'Pedro Sousa': [
      { id: '1', sender: 'Pedro Sousa', text: 'Consegues enviar-me a foto daquela vista de ontem?', timestamp: 'Ontem', read: true }
    ]
  });
  const [chatTextInput, setChatTextInput] = useState('');

  const sendChatMessage = () => {
    if (!chatTextInput.trim() || !activeChatUser) return;
    const msg: ChatMessage = {
      id: Date.now().toString(),
      sender: userName,
      text: chatTextInput,
      timestamp: new Date().toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' }),
      read: false
    };
    setDmHistory(prev => ({
      ...prev,
      [activeChatUser]: [...(prev[activeChatUser] || []), msg]
    }));
    setChatTextInput('');

    // Auto-reply
    setTimeout(() => {
      const reply: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: activeChatUser,
        text: 'Obrigado! Falo contigo em breve.',
        timestamp: new Date().toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' }),
        read: true
      };
      setDmHistory(prev => ({
        ...prev,
        [activeChatUser]: [...(prev[activeChatUser] || []), reply]
      }));
    }, 1500);
  };

  // Filter categories
  const feedCategories = ['Todos', 'Seguidores', 'Populares', 'Trilhos'];

  // Handle Publish Post
  const handlePublish = async () => {
    if (!postText.trim() && selectedPhotos.length === 0 && !selectedVideo) return;

    let imageUrls: string[] = [];
    let videoUrl = '';

    if (selectedPhotos.length > 0) {
      for (const photo of selectedPhotos) {
        const url = await uploadFileToCloudinary(photo, 'community/posts');
        imageUrls.push(url);
      }
    }

    if (selectedVideo) {
      videoUrl = await uploadFileToCloudinary(selectedVideo, 'community/videos');
    }

    const newPost: Post = {
      id: Date.now(),
      author: userName,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userName}`,
      time: 'Agora',
      location: checkInPlace ? `está em ${checkInPlace}` : 'Açores',
      content: postText,
      image: imageUrls[0] || undefined,
      images: imageUrls.length > 1 ? imageUrls : undefined,
      video: videoUrl || undefined,
      likes: 0,
      comments: [],
      checkInPlace: checkInPlace || undefined,
      likedBy: []
    };

    try {
      await fetch(`${API_BASE_URL}/api/posts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPost)
      });
      onSyncPosts();
      setPostText('');
      setSelectedPhotos([]);
      setSelectedVideo(null);
      setCheckInPlace(null);
      setShowCreateModal(false);
      addCredits(100);
      alert('Publicado com sucesso! Ganhou +100 CRÉDITOS.');
    } catch (e) {
      console.error(e);
    }
  };

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
        if (data.isLiked) addCredits(5);
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
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userName}`,
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
      addCredits(20);
    } catch (e) {
      console.error(e);
    }
  };

  // Filter posts
  const filteredPosts = posts.filter(p => {
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
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">Comunidade Azorestoyou</h2>
            <p className="text-xs text-slate-500 font-semibold leading-relaxed">
              A rede social privada e exclusiva dos Açores. Para consultar publicações, histórias, perfis de membros e negócios, inicie sessão na sua conta da Super-App.
            </p>
          </div>
          <button
            onClick={onShowAuth}
            className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-emerald-600/20 active:scale-95 transition-all"
          >
            Iniciar Sessão com Conta Azorestoyou
          </button>
          <button
            onClick={onClose}
            className="text-xs font-bold text-slate-400 hover:text-slate-600 uppercase tracking-wider"
          >
            Voltar a Explorar
          </button>
        </div>
      </div>
    );
  }

  // If viewing another user's profile
  if (viewingProfile) {
    return (
      <div className="min-h-screen bg-[#F5F7FA] text-[#071A3D] font-sans antialiased pb-24 relative select-none">
        <div className="max-w-[480px] mx-auto bg-white min-h-screen shadow-2xl relative flex flex-col border-x border-slate-100">
          <CommunityProfileView 
            profile={viewingProfile}
            isMyProfile={viewingProfile.handle?.toLowerCase() === myProfile?.handle?.toLowerCase()}
            onBack={() => setViewingProfile(null)}
            onEditProfile={() => setShowEditProfileModal(true)}
            onBookBusiness={onBookBusiness}
            onSendMessage={(targetHandle) => setActiveChatUser(targetHandle)}
            userPosts={posts.filter(p => p.author === viewingProfile.name || p.author === viewingProfile.handle)}
          />
          <CommunityEditProfileModal 
            isOpen={showEditProfileModal}
            onClose={() => setShowEditProfileModal(false)}
            profile={myProfile}
            onSaveProfile={handleSaveProfile}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F7FA] text-[#071A3D] font-sans antialiased pb-24 relative select-none">
      
      {/* Dynamic hidden input for stories */}
      <input 
        type="file" 
        id="story-upload-file-mobile" 
        accept="image/*,video/*" 
        className="hidden" 
        onChange={handleStoryUpload} 
      />

      {/* Desktop Wrapper Frame - centered layout */}
      <div className="max-w-[480px] mx-auto bg-white min-h-screen shadow-2xl relative flex flex-col border-x border-slate-100">
        
        {/* ================= FIXED HEADER ================= */}
        <header className="sticky top-0 z-[100] bg-white/90 backdrop-blur-md border-b border-slate-100 px-4 h-14 flex items-center justify-between">
          <button onClick={() => setShowHamburgerDrawer(true)} className="p-2 hover:bg-slate-50 rounded-full transition-all text-[#071A3D]">
            <MenuIcon size={20} />
          </button>
          
          <div className="flex items-center gap-1.5 cursor-pointer" onClick={() => setActiveMobileTab('feed')}>
            <AzoresLogo size={26} />
            <span className="text-sm font-black tracking-tighter uppercase text-[#071A3D]">
              Azores<span className="text-[#00B857]">Toyou</span>
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button onClick={() => { setSearchQuery(''); setActiveMobileTab('explore'); }} className="p-2 hover:bg-slate-50 rounded-full text-[#071A3D]">
              <Search size={18} />
            </button>
            <button onClick={() => setShowNotifications(!showNotifications)} className="p-2 hover:bg-slate-50 rounded-full text-[#071A3D] relative">
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full"></span>
            </button>
            <button 
              onClick={() => setActiveMobileTab('profile')} 
              className="w-8 h-8 rounded-full border border-slate-200 overflow-hidden ml-1 active:scale-95 transition-transform"
              title="O Meu Perfil"
            >
              <img src={myProfile?.avatar || userProfile?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userName}`} alt="Avatar" className="w-full h-full object-cover" />
            </button>
          </div>
        </header>

        {/* ================= MAIN SCROLL CONTAINER ================= */}
        <main className="flex-1 overflow-y-auto">
          
          {/* ================= TABS: FEED TAB ================= */}
          {activeMobileTab === 'feed' && (
            <div className="space-y-4 py-4 px-3">
              
              {/* Stories Bar */}
              <div className="flex items-center gap-4 overflow-x-auto pb-2 scrollbar-none border-b border-slate-50">
                {/* Create Story */}
                <div 
                  className="flex flex-col items-center gap-1 flex-shrink-0 cursor-pointer"
                  onClick={() => document.getElementById('story-upload-file-mobile')?.click()}
                >
                  <div className="relative w-14 h-14 rounded-full border border-slate-200 p-[2px] bg-slate-50 flex items-center justify-center overflow-hidden">
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${userName}`} alt="Minha" className="w-full h-full object-cover rounded-full" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-full">
                      <Plus size={16} className="text-white font-black" />
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
                        <img src={story.avatar} alt={story.userName} className="w-full h-full object-cover" />
                      </div>
                    </div>
                    <span className="text-[9px] font-bold text-slate-650 truncate w-14 text-center">{story.userName}</span>
                  </div>
                ))}
              </div>

              {/* Publication Composer trigger button */}
              <div 
                onClick={() => setShowCreateModal(true)}
                className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex items-center gap-3 cursor-pointer hover:bg-slate-50 transition-all"
              >
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${userName}`} alt="Avatar" className="w-9 h-9 rounded-full border border-slate-150" />
                <span className="text-xs text-slate-450 font-semibold">No que estás a pensar, {userName}?</span>
              </div>

              {/* Categories Navigation scroll */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                {feedCategories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setFeedCategoryFilter(cat)}
                    className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider transition-all flex-shrink-0 ${
                      feedCategoryFilter === cat 
                        ? 'bg-[#00B857] text-white' 
                        : 'bg-slate-100 hover:bg-slate-200 text-[#071A3D]'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Feed posts list */}
              <div className="space-y-4">
                {filteredPosts.map(post => {
                  const currentIdx = activeCarouselIndex[post.id] || 0;
                  const postImages = post.images || (post.image ? [post.image] : []);
                  const hasCarousel = postImages.length > 1;

                  return (
                    <div key={post.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
                      
                      {/* Card Header */}
                      <div className="p-4 flex items-center justify-between">
                        <div 
                          className="flex items-center gap-3 cursor-pointer group"
                          onClick={() => openUserProfile(post.authorHandle || post.author)}
                        >
                          <img src={post.avatar} alt="Avatar" className="w-10 h-10 rounded-full border border-slate-100 group-hover:scale-105 transition-transform object-cover" />
                          <div>
                            <h4 className="text-xs font-black text-[#071A3D] leading-none flex items-center gap-1.5 group-hover:text-emerald-600 transition-colors">
                              <span>{post.author}</span>
                              {post.checkInPlace && (
                                <span className="text-[10px] text-slate-450 font-semibold lowercase">
                                  está em <strong className="text-[#00B857]">{post.checkInPlace}</strong>
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

                      {/* Text content with hashtag & mention highlights */}
                      {post.content && (
                        <div 
                          className="px-4 pb-3 cursor-pointer"
                          onClick={() => setActivePostDetail(post)}
                        >
                          <p className="text-xs font-semibold text-slate-700 leading-relaxed whitespace-pre-line">
                            {post.content.split(' ').map((word, wIdx) => {
                              if (word.startsWith('#')) {
                                return (
                                  <span 
                                    key={wIdx} 
                                    className="text-[#00B857] font-black hover:underline mr-1 cursor-pointer" 
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
                                    className="text-[#0066FF] font-black hover:underline mr-1 cursor-pointer" 
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

                      {/* Media Carousel */}
                      {postImages.length > 0 && (
                        <div className="relative aspect-square bg-slate-50 overflow-hidden select-none">
                          <img 
                            src={postImages[currentIdx]} 
                            alt="Media" 
                            className="w-full h-full object-cover cursor-pointer" 
                            onClick={() => setActivePostDetail(post)} 
                          />
                          
                          {/* Indicator badge */}
                          {hasCarousel && (
                            <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm text-white text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full">
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
                            <div className="w-10 h-10 rounded-xl bg-white border border-emerald-200 overflow-hidden flex-shrink-0 flex items-center justify-center text-emerald-600 font-black">
                              {post.businessTag.image ? (
                                <img src={post.businessTag.image} alt={post.businessTag.name} className="w-full h-full object-cover" />
                              ) : (
                                <Building2 size={18} />
                              )}
                            </div>
                            <div className="min-w-0">
                              <p className="text-[9px] font-black uppercase text-emerald-600 tracking-wider truncate">
                                {post.businessTag.category || 'Negócio Oficial'}
                              </p>
                              <h5 className="text-xs font-black text-slate-800 truncate">
                                {post.businessTag.name}
                              </h5>
                            </div>
                          </div>
                          <button 
                            onClick={() => onBookBusiness ? onBookBusiness(post.businessTag!.collection || post.businessTag!.category, post.businessTag!.id) : alert(`Reservar em ${post.businessTag!.name}`)}
                            className="px-3 py-1.5 bg-[#00B857] hover:bg-emerald-600 active:scale-95 text-white text-[10px] font-black uppercase tracking-wider rounded-xl shadow-sm transition-all flex-shrink-0"
                          >
                            {post.businessTag.actionText || 'Reservar'}
                          </button>
                        </div>
                      )}

                      {/* Action Bar */}
                      <div className="p-4 space-y-2.5">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <button onClick={() => handlePostLike(post)} className={`flex items-center gap-1.5 transition-transform active:scale-125 ${post.isLiked ? 'text-rose-500' : 'text-[#071A3D]'}`}>
                              <Heart size={20} className={post.isLiked ? 'fill-current' : ''} />
                            </button>

                            <button onClick={() => setActivePostDetail(post)} className="flex items-center gap-1.5 text-[#071A3D]">
                              <MessageCircle size={20} />
                            </button>

                            <button onClick={() => alert('Link copiado para a área de transferência!')} className="text-[#071A3D]">
                              <Share2 size={20} />
                            </button>
                          </div>

                          <button onClick={() => handlePostSave(post)} className={`transition-transform active:scale-125 ${post.isSaved ? 'text-[#00B857]' : 'text-[#071A3D]'}`}>
                            <Bookmark size={20} className={post.isSaved ? 'fill-current' : ''} />
                          </button>
                        </div>

                        {/* Likes counter in Portuguese */}
                        <p className="text-[11px] font-black text-[#071A3D]">
                          {(post.likes || 0).toLocaleString('pt-PT')} gostos
                        </p>

                        {/* Liked list summary */}
                        {post.likedBy && post.likedBy.length > 0 && (
                          <p className="text-[9px] text-slate-500 font-bold">
                            Gostos de <strong className="text-[#071A3D]">{post.likedBy[0]}</strong> {post.likes > 1 ? `e ${post.likes - 1} outros` : ''}
                          </p>
                        )}

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
          {activeMobileTab === 'explore' && (
            <CommunityExploreSection 
              onSelectPost={(post) => setActivePostDetail(post)}
              onSelectProfile={(handle) => openUserProfile(handle)}
              onBookBusiness={onBookBusiness}
              onStartChatWith={(u) => setActiveChatUser(u)}
            />
          )}

          {/* ================= TABS: FAVORITOS TAB ================= */}
          {activeMobileTab === 'favorites' && (
            <div className="space-y-4 py-4 px-3">
              <h2 className="text-sm font-black uppercase tracking-wider text-[#071A3D]">Favoritos e Guardados</h2>
              <div className="grid grid-cols-2 gap-3">
                {posts.filter(p => p.isSaved).map(post => (
                  <div key={post.id} className="bg-white rounded-xl border border-slate-100 overflow-hidden cursor-pointer shadow-sm" onClick={() => setActivePostDetail(post)}>
                    <img src={post.image || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800'} alt="Saved" className="w-full aspect-square object-cover" />
                    <div className="p-2">
                      <p className="text-[10px] font-black text-[#071A3D] truncate">{post.author}</p>
                      <p className="text-[9px] text-slate-400 font-bold mt-0.5 truncate">{post.location}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================= TABS: PERFIL TAB ================= */}
          {activeMobileTab === 'profile' && (
            <CommunityProfileView 
              profile={myProfile || {
                id: 'me',
                userId: userProfile?.id || userName,
                email: userProfile?.email || `${userName}@azores4you.com`,
                handle: `@azorestoyou_${(userProfile?.name || userName).toLowerCase().replace(/[^a-z0-9_]/g, '')}`,
                name: userProfile?.name || userName,
                avatar: userProfile?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userName}`,
                profileType: 'personal',
                followersCount: 0,
                followingCount: 0,
                postsCount: posts.filter(p => p.author === userName).length,
                location: 'São Miguel, Açores',
                island: 'São Miguel',
                country: 'Portugal',
                bio: 'Explorador da Comunidade Azorestoyou 🌿'
              }}
              isMyProfile={true}
              onBack={() => setActiveMobileTab('feed')}
              onEditProfile={() => setShowEditProfileModal(true)}
              onSendMessage={(targetHandle) => setActiveChatUser(targetHandle)}
              userPosts={posts.filter(p => p.author === userName || p.author === myProfile?.handle)}
            />
          )}

        </main>

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
                className="relative bg-white w-4/5 h-full shadow-2xl z-10 flex flex-col p-6 space-y-6"
              >
                {/* Header title close */}
                <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                  <span className="text-sm font-black uppercase tracking-wider text-[#071A3D]">Menu</span>
                  <button onClick={() => setShowHamburgerDrawer(false)} className="p-1.5 bg-slate-55 hover:bg-slate-100 rounded-full">
                    <X size={16} />
                  </button>
                </div>

                {/* User Info details */}
                <div className="flex items-center gap-3">
                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${userName}`} alt="Avatar" className="w-11 h-11 rounded-full border border-slate-150" />
                  <div>
                    <h4 className="text-xs font-black text-[#071A3D]">{userName}</h4>
                    <p className="text-[9px] text-slate-400 font-bold">@braga.azt</p>
                  </div>
                  <span className="ml-auto bg-amber-50 text-amber-600 text-[8px] px-2 py-0.5 rounded font-black border border-amber-100">
                    {userCredits} CRÉDITOS
                  </span>
                </div>

                {/* Navigation links grid list */}
                <nav className="flex-1 space-y-1.5 overflow-y-auto">
                  {[
                    { label: 'Perfil', icon: '👤', tab: 'profile' },
                    { label: 'Minhas Reservas', icon: '📅', modal: 'reservations' },
                    { label: 'Mensagens', icon: '💬', chat: true },
                    { label: 'Favoritos', icon: '❤️', tab: 'favorites' },
                    { label: 'Conquistas', icon: '🏆', gamification: true },
                    { label: 'Definições', icon: '⚙', settings: true }
                  ].map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setShowHamburgerDrawer(false);
                        if (item.tab) setActiveMobileTab(item.tab as any);
                        if (item.chat) setActiveChatUser('Mariana Silva');
                        if (item.gamification) alert('Conquistas do utilizador!');
                      }}
                      className="w-full flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100 rounded-xl transition-all text-left text-xs font-bold text-[#071A3D]"
                    >
                      <span className="flex items-center gap-3">
                        <span className="text-sm">{item.icon}</span>
                        <span>{item.label}</span>
                      </span>
                      <ChevronRight size={14} className="text-slate-400" />
                    </button>
                  ))}
                </nav>

                <button onClick={onClose} className="w-full py-3 bg-rose-50 hover:bg-rose-100 text-rose-500 rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center justify-center gap-2 border border-rose-100">
                  <span>Sair da aplicação</span>
                </button>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* ================= STORY FULLSCREEN VIEWER ================= */}
        <CommunityStoriesViewer 
          isOpen={!!activeStoryView}
          onClose={() => setActiveStoryView(null)}
          stories={stories}
          initialIndex={stories.findIndex(s => s.id === activeStoryView?.id) >= 0 ? stories.findIndex(s => s.id === activeStoryView?.id) : 0}
          onSendReply={(story, text) => {
            alert(`Mensagem enviada a ${story.userName}: "${text}"`);
          }}
        />

        {/* ================= NOVA PUBLICAÇÃO MODAL ================= */}
        <CommunityCreatePostModal 
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          myProfile={myProfile}
          onPostCreated={() => {
            onSyncPosts();
            addCredits(100);
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
          targetUser={activeChatUser ? { name: activeChatUser } : null}
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
            addCredits(50);
          }}
        />

      </div>
    </div>
  );
};

export default CommunitySection;
