import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, Search, Heart, MessageCircle, Share2, MoreHorizontal, Send, 
  Image as ImageIcon, Video, Smile, Link, Mail, MessageSquare, Copy, 
  CheckCircle2, X, Camera, Type, Palette, Filter, Music, Radio, Bookmark,
  ThumbsUp, User as UserIcon, MapPin, Compass, Trophy, Users, Star, Sparkles,
  Play, Pause, Mic, Paperclip, SendHorizonal, Calendar, Check, HelpCircle,
  Hash, ChevronLeft, ChevronRight, MessageCircleCode, CheckSquare, Bell, Menu as MenuIcon, Plus, Settings
} from 'lucide-react';
import { API_BASE_URL } from '../config';
import AzoresLogo from './AzoresLogo';

interface CommunitySectionProps {
  isAuthenticated: boolean;
  userName: string;
  posts: Post[];
  onSyncPosts: () => void;
  onShowAuth: () => void;
  onClose: () => void;
}

interface Post {
  id: number;
  author: string;
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
  posts, 
  onSyncPosts, 
  onShowAuth, 
  onClose 
}) => {
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
    const updated = posts.map(p => {
      if (p.id === post.id) {
        const isLiked = !p.isLiked;
        const likedBy = p.likedBy || [];
        const likes = isLiked ? p.likes + 1 : p.likes - 1;
        const finalLikedBy = isLiked ? [...likedBy, userName] : likedBy.filter(u => u !== userName);
        const newP = { ...p, isLiked, likes, likedBy: finalLikedBy };
        
        // Update local state if opened in details
        if (activePostDetail?.id === post.id) {
          setActivePostDetail(newP);
        }
        return newP;
      }
      return p;
    });

    try {
      await fetch(`${API_BASE_URL}/api/posts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      });
      onSyncPosts();
      addCredits(5);
    } catch (e) {
      console.error(e);
    }
  };

  const handlePostSave = async (post: Post) => {
    const updated = posts.map(p => {
      if (p.id === post.id) {
        const newP = { ...p, isSaved: !p.isSaved };
        if (activePostDetail?.id === post.id) {
          setActivePostDetail(newP);
        }
        return newP;
      }
      return p;
    });
    try {
      await fetch(`${API_BASE_URL}/api/posts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      });
      onSyncPosts();
    } catch (e) {
      console.error(e);
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
            <button onClick={() => setActiveMobileTab('profile')} className="w-8 h-8 rounded-full border border-slate-200 overflow-hidden ml-1">
              <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${userName}`} alt="Avatar" className="w-full h-full object-cover" />
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
                        <div className="flex items-center gap-3">
                          <img src={post.avatar} alt="Avatar" className="w-10 h-10 rounded-full border border-slate-100" />
                          <div>
                            <h4 className="text-xs font-black text-[#071A3D] leading-none flex items-center gap-1.5">
                              <span>{post.author}</span>
                              {post.checkInPlace && (
                                <span className="text-[10px] text-slate-450 font-semibold lowercase">
                                  está em <strong className="text-[#00B857]">{post.checkInPlace}</strong>
                                </span>
                              )}
                            </h4>
                            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tight mt-1">
                              {post.location} • {post.time}
                            </p>
                          </div>
                        </div>
                        <button className="p-2 text-slate-400 hover:bg-slate-50 rounded-full">
                          <MoreHorizontal size={16} />
                        </button>
                      </div>

                      {/* Text content */}
                      {post.content && (
                        <div 
                          className="px-4 pb-3 cursor-pointer"
                          onClick={() => setActivePostDetail(post)}
                        >
                          <p className="text-xs font-semibold text-slate-700 leading-relaxed">{post.content}</p>
                        </div>
                      )}

                      {/* Media */}
                      {postImages.length > 0 && (
                        <div className="relative aspect-square bg-slate-50 overflow-hidden cursor-pointer" onClick={() => setActivePostDetail(post)}>
                          <img src={postImages[currentIdx]} alt="Media" className="w-full h-full object-cover" />
                          
                          {/* Indicator label */}
                          {hasCarousel && (
                            <div className="absolute top-3 right-3 bg-black/60 text-white text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded">
                              {currentIdx + 1}/{postImages.length}
                            </div>
                          )}
                        </div>
                      )}

                      {post.video && (
                        <div className="relative aspect-square bg-black flex items-center justify-center">
                          <video src={post.video} controls muted autoPlay loop playsInline className="w-full h-full object-cover" />
                        </div>
                      )}

                      {/* Action Bar */}
                      <div className="p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <button onClick={() => handlePostLike(post)} className={`flex items-center gap-1 ${post.isLiked ? 'text-rose-500' : 'text-[#071A3D]'}`}>
                              <Heart size={18} className={post.isLiked ? 'fill-current' : ''} />
                              <span className="text-[10px] font-black">{post.likes}</span>
                            </button>

                            <button onClick={() => setActivePostDetail(post)} className="flex items-center gap-1 text-[#071A3D]">
                              <MessageCircle size={18} />
                              <span className="text-[10px] font-black">{post.comments.length}</span>
                            </button>

                            <button onClick={() => alert('Link copiado!')} className="text-[#071A3D]">
                              <Share2 size={18} />
                            </button>
                          </div>

                          <button onClick={() => handlePostSave(post)} className={post.isSaved ? 'text-[#00B857]' : 'text-[#071A3D]'}>
                            <Bookmark size={18} className={post.isSaved ? 'fill-current' : ''} />
                          </button>
                        </div>

                        {/* Liked list summary */}
                        {post.likedBy && post.likedBy.length > 0 && (
                          <p className="text-[9px] text-slate-500 font-bold">
                            Gostos de <strong className="text-[#071A3D]">{post.likedBy[0]}</strong> e {post.likes - 1} outras pessoas
                          </p>
                        )}

                        {post.comments.length > 0 && (
                          <button 
                            onClick={() => setActivePostDetail(post)}
                            className="text-[10px] text-slate-400 font-bold hover:underline"
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
            <div className="space-y-4 py-4 px-3">
              
              {/* Search input field */}
              <div className="relative">
                <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Pesquisar pessoas, trilhos, locais..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-100 border-none rounded-xl py-2.5 pl-10 pr-4 text-xs font-semibold focus:ring-1 focus:ring-[#00B857] text-[#071A3D]"
                />
              </div>

              {/* Tag filters */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                {['Para ti', 'Trilhos', 'Natureza', 'Praias', 'Restaurantes'].map(tag => (
                  <button
                    key={tag}
                    onClick={() => setSelectedExploreCategory(tag)}
                    className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider transition-all flex-shrink-0 ${
                      selectedExploreCategory === tag 
                        ? 'bg-[#00B857] text-white' 
                        : 'bg-slate-100 hover:bg-slate-200 text-[#071A3D]'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>

              {/* Tendências */}
              <div className="bg-white rounded-2xl border border-slate-100 p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="text-xs font-black uppercase tracking-wider text-[#071A3D]">Tendências</h4>
                  <button className="text-[10px] text-[#00B857] font-black uppercase">Ver todas</button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { hashtag: '#Azores', count: '1.2K posts' },
                    { hashtag: '#SãoMiguel', count: '980 posts' },
                    { hashtag: '#Trilhos', count: '756 posts' },
                    { hashtag: '#Natureza', count: '643 posts' }
                  ].map((trend, i) => (
                    <div key={i} className="p-3 bg-slate-50 rounded-xl flex flex-col justify-between cursor-pointer" onClick={() => { setSearchQuery(trend.hashtag); setActiveMobileTab('feed'); }}>
                      <span className="text-xs font-black text-[#071A3D]">{trend.hashtag}</span>
                      <span className="text-[9px] text-slate-400 font-bold mt-1">{trend.count}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Suggested Users */}
              <div className="bg-white rounded-2xl border border-slate-100 p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="text-xs font-black uppercase tracking-wider text-[#071A3D]">Pessoas sugeridas</h4>
                  <button className="text-[10px] text-[#00B857] font-black uppercase">Ver todas</button>
                </div>
                <div className="space-y-3">
                  {[
                    { name: 'Ana Ferreira', island: 'São Miguel' },
                    { name: 'Diogo C.', island: 'Terceira' },
                    { name: 'Explora Açores', island: 'Faial' }
                  ].map((user, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5" onClick={() => setActiveChatUser(user.name)}>
                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} alt="Avatar" className="w-8 h-8 rounded-full border border-slate-150" />
                        <div>
                          <p className="text-xs font-black text-[#071A3D] leading-none">{user.name}</p>
                          <p className="text-[9px] text-slate-450 font-bold mt-1 uppercase tracking-tight">{user.island}</p>
                        </div>
                      </div>
                      <button onClick={() => { alert(`Seguiu: ${user.name}`); addCredits(10); }} className="px-3.5 py-1 bg-slate-50 hover:bg-slate-100 text-[#00B857] border border-slate-100 text-[9px] font-black uppercase tracking-wider rounded-lg transition-all">
                        Seguir
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Eventos em Destaque */}
              <div className="bg-white rounded-2xl border border-slate-100 p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="text-xs font-black uppercase tracking-wider text-[#071A3D]">Eventos em destaque</h4>
                  <button className="text-[10px] text-[#00B857] font-black uppercase">Ver todos</button>
                </div>
                <div className="space-y-3">
                  {[
                    { title: 'Festas do Senhor Santo Cristo', date: '02 - 05 Jun • Ponta Delgada', img: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800' },
                    { title: 'Festival Maré de Agosto', date: '15 - 18 Ago • Horta', img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800' }
                  ].map((evt, i) => (
                    <div key={i} className="flex gap-3 items-center border-b border-slate-50 pb-3 last:border-0 last:pb-0">
                      <img src={evt.img} alt={evt.title} className="w-14 h-14 rounded-xl object-cover" />
                      <div className="flex-1 min-w-0">
                        <h5 className="text-xs font-black text-[#071A3D] truncate">{evt.title}</h5>
                        <p className="text-[9px] text-slate-400 font-bold mt-1">{evt.date}</p>
                      </div>
                      <button onClick={() => { alert(`Ir ao evento: ${evt.title}`); addCredits(15); }} className="px-3 py-1.5 bg-[#00B857] text-white text-[9px] font-black uppercase tracking-wider rounded-lg">
                        Participar
                      </button>
                    </div>
                  ))}
                </div>
              </div>

            </div>
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
            <div className="space-y-6 py-4 px-3">
              {/* Profile Card Header */}
              <div className="flex items-center gap-4">
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${userName}`} alt="Profile" className="w-16 h-16 rounded-full border-2 border-slate-200" />
                <div className="space-y-1">
                  <h3 className="text-base font-black text-[#071A3D]">{userName}</h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">@braga.azt</p>
                  <span className="bg-[#00B857]/15 text-[#00B857] text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded inline-block">
                    {userCredits} CRÉDITOS
                  </span>
                </div>
              </div>

              {/* Bio details */}
              <div className="bg-slate-50 p-4 rounded-2xl space-y-1 text-xs">
                <p className="font-bold text-[#071A3D]">📍 São Miguel, Açores</p>
                <p className="text-slate-500 font-semibold leading-relaxed mt-1">Explorador profissional de lagoas, caminhadas e da autêntica gastronomia açoriana. 🥾🌊</p>
              </div>

              {/* Statistics rows */}
              <div className="grid grid-cols-3 gap-2 text-center py-2 border-y border-slate-100">
                <div>
                  <h4 className="text-xs font-black text-[#071A3D]">23</h4>
                  <p className="text-[9px] text-slate-400 font-bold uppercase mt-0.5">Posts</p>
                </div>
                <div>
                  <h4 className="text-xs font-black text-[#071A3D]">128</h4>
                  <p className="text-[9px] text-slate-400 font-bold uppercase mt-0.5">Seguidores</p>
                </div>
                <div>
                  <h4 className="text-xs font-black text-[#071A3D]">94</h4>
                  <p className="text-[9px] text-slate-400 font-bold uppercase mt-0.5">A seguir</p>
                </div>
              </div>

              {/* Profile sub-tabs grid preview */}
              <div className="space-y-3">
                <h4 className="text-xs font-black uppercase tracking-wider text-[#071A3D]">Minhas publicações</h4>
                <div className="grid grid-cols-3 gap-2">
                  {posts.filter(p => p.author === userName).map(post => (
                    <div key={post.id} className="aspect-square rounded-lg overflow-hidden border border-slate-100 cursor-pointer" onClick={() => setActivePostDetail(post)}>
                      <img src={post.image || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800'} alt="My post" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

        </main>

        {/* ================= FIXED BOTTOM NAVIGATION ================= */}
        <footer className="sticky bottom-0 z-[100] bg-white border-t border-slate-100 h-16 flex items-center justify-around px-4">
          <button onClick={() => setActiveMobileTab('feed')} className={`flex flex-col items-center gap-1 ${activeMobileTab === 'feed' ? 'text-[#00B857]' : 'text-slate-400'}`}>
            <span className="text-lg">🏠</span>
            <span className="text-[8px] font-black uppercase">Feed</span>
          </button>
          
          <button onClick={() => setActiveMobileTab('explore')} className={`flex flex-col items-center gap-1 ${activeMobileTab === 'explore' ? 'text-[#00B857]' : 'text-slate-400'}`}>
            <span className="text-lg">🔍</span>
            <span className="text-[8px] font-black uppercase">Explorar</span>
          </button>

          <button onClick={() => setShowCreateModal(true)} className="w-11 h-11 bg-[#00B857] hover:bg-[#00a34b] text-white rounded-full flex items-center justify-center shadow-lg shadow-emerald-100 select-none">
            <Plus size={22} className="font-black" />
          </button>

          <button onClick={() => setActiveMobileTab('favorites')} className={`flex flex-col items-center gap-1 ${activeMobileTab === 'favorites' ? 'text-[#00B857]' : 'text-slate-400'}`}>
            <span className="text-lg">❤️</span>
            <span className="text-[8px] font-black uppercase">Favoritos</span>
          </button>

          <button onClick={() => setActiveMobileTab('profile')} className={`flex flex-col items-center gap-1 ${activeMobileTab === 'profile' ? 'text-[#00B857]' : 'text-slate-400'}`}>
            <span className="text-lg">👤</span>
            <span className="text-[8px] font-black uppercase">Perfil</span>
          </button>
        </footer>

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
        <AnimatePresence>
          {activeStoryView && (
            <div className="absolute inset-0 z-[300] bg-black flex flex-col justify-between">
              
              {/* Top progress timer bars */}
              <div className="p-4 bg-gradient-to-b from-black/60 to-transparent absolute top-0 inset-x-0 z-10 space-y-3">
                <div className="w-full h-[3px] bg-white/20 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 5 }}
                    onAnimationComplete={() => setActiveStoryView(null)}
                    className="h-full bg-white rounded-full"
                  />
                </div>
                
                {/* Header author details */}
                <div className="flex items-center justify-between text-white">
                  <div className="flex items-center gap-2.5">
                    <img src={activeStoryView.avatar} alt="Avatar" className="w-7 h-7 rounded-full border border-white/20" />
                    <span className="text-xs font-black">{activeStoryView.userName}</span>
                    <span className="text-[10px] text-white/50">2h</span>
                  </div>
                  <button onClick={() => setActiveStoryView(null)} className="text-white hover:opacity-75">
                    <X size={18} />
                  </button>
                </div>
              </div>

              {/* Background media image */}
              <div className="flex-1 flex items-center justify-center">
                <img src={activeStoryView.mediaUrl} alt="Story" className="w-full max-h-screen object-contain" />
              </div>

              {/* Bottom message overlay */}
              <div className="p-4 bg-gradient-to-t from-black/80 to-transparent flex items-center gap-3 z-10">
                <input
                  type="text"
                  placeholder="Enviar mensagem..."
                  className="flex-1 bg-white/20 border-none rounded-xl px-4 py-2 text-xs text-white placeholder-white/50 focus:ring-1 focus:ring-white"
                />
                <button onClick={() => { alert('Gosto enviado!'); setActiveStoryView(null); }} className="text-white hover:scale-110">
                  <Heart size={20} />
                </button>
              </div>

            </div>
          )}
        </AnimatePresence>

        {/* ================= NOVA PUBLICAÇÃO OVERLAY MODAL ================= */}
        <AnimatePresence>
          {showCreateModal && (
            <div className="absolute inset-0 z-[200] bg-white flex flex-col justify-between">
              
              {/* Header */}
              <header className="px-4 h-14 border-b border-slate-100 flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-[#071A3D]">Nova Publicação</span>
                <button onClick={() => setShowCreateModal(false)} className="p-2 hover:bg-slate-50 rounded-full">
                  <X size={18} />
                </button>
              </header>

              {/* Form text input composer */}
              <div className="flex-1 p-5 space-y-4 overflow-y-auto">
                <div className="flex gap-3">
                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${userName}`} alt="Avatar" className="w-9 h-9 rounded-full border" />
                  <textarea
                    value={postText}
                    onChange={(e) => setPostText(e.target.value)}
                    placeholder={`No que estás a pensar, ${userName}?`}
                    className="flex-1 border-none focus:ring-0 text-xs p-1 resize-none h-24 text-[#071A3D]"
                  />
                </div>

                {checkInPlace && (
                  <div className="bg-emerald-50 text-[#00B857] text-[10px] px-3 py-1 rounded-full font-black flex items-center gap-1.5 border border-emerald-100 w-max">
                    <MapPin size={10} />
                    <span>em {checkInPlace}</span>
                  </div>
                )}

                {/* Grid selection buttons */}
                <div className="grid grid-cols-2 gap-3 pt-4">
                  <label className="p-4 bg-slate-50 hover:bg-slate-100 rounded-2xl flex flex-col items-center justify-center gap-1 cursor-pointer transition-all border border-slate-100">
                    <ImageIcon size={20} className="text-[#00C853]" />
                    <span className="text-[10px] font-black uppercase text-[#071A3D]">Foto</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={(e) => e.target.files && setSelectedPhotos(Array.from(e.target.files))}
                    />
                  </label>
                  
                  <label className="p-4 bg-slate-50 hover:bg-slate-100 rounded-2xl flex flex-col items-center justify-center gap-1 cursor-pointer transition-all border border-slate-100">
                    <Video size={20} className="text-[#0066FF]" />
                    <span className="text-[10px] font-black uppercase text-[#071A3D]">Vídeo</span>
                    <input
                      type="file"
                      accept="video/*"
                      className="hidden"
                      onChange={(e) => e.target.files?.[0] && setSelectedVideo(e.target.files[0])}
                    />
                  </label>
                </div>

                {/* Previews */}
                {(selectedPhotos.length > 0 || selectedVideo) && (
                  <div className="p-3 bg-slate-50 rounded-xl flex gap-2 border">
                    {selectedPhotos.map((p, i) => (
                      <img key={i} src={URL.createObjectURL(p)} alt="Preview" className="w-12 h-12 object-cover rounded-lg" />
                    ))}
                    {selectedVideo && (
                      <div className="w-12 h-12 bg-black flex items-center justify-center rounded-lg text-white text-xs">V</div>
                    )}
                  </div>
                )}

                {/* Additional option rows */}
                <div className="space-y-1 pt-2">
                  <button onClick={() => setCheckInPlace('Lagoa do Fogo')} className="w-full flex items-center justify-between p-3.5 hover:bg-slate-50 border-b border-slate-50 text-left text-xs font-semibold">
                    <span className="flex items-center gap-2.5">📍 <span>Localização</span></span>
                    <span className="text-[10px] text-slate-400 font-bold">Lagoa do Fogo</span>
                  </button>
                  <button className="w-full flex items-center justify-between p-3.5 hover:bg-slate-50 border-b border-slate-50 text-left text-xs font-semibold">
                    <span className="flex items-center gap-2.5">🥾 <span>Trilho</span></span>
                    <ChevronRight size={14} className="text-slate-450" />
                  </button>
                </div>
              </div>

              {/* Publish button */}
              <div className="p-4 border-t border-slate-100">
                <button
                  onClick={handlePublish}
                  disabled={isUploadingMedia || (!postText.trim() && selectedPhotos.length === 0 && !selectedVideo)}
                  className="w-full py-3.5 bg-[#00B857] hover:bg-[#00a14b] disabled:bg-slate-100 text-white font-black rounded-xl text-xs uppercase tracking-widest transition-all text-center shadow-lg"
                >
                  {isUploadingMedia ? 'A enviar...' : 'Publicar'}
                </button>
              </div>

            </div>
          )}
        </AnimatePresence>

        {/* ================= POST DETAILS OVERLAY ================= */}
        <AnimatePresence>
          {activePostDetail && (
            <div className="absolute inset-0 z-[200] bg-white flex flex-col justify-between">
              
              {/* Header */}
              <header className="px-4 h-14 border-b border-slate-100 flex items-center justify-between">
                <button onClick={() => setActivePostDetail(null)} className="p-2 hover:bg-slate-50 rounded-full">
                  <ArrowLeft size={18} />
                </button>
                <span className="text-xs font-black uppercase tracking-wider text-[#071A3D]">Publicação</span>
                <button className="p-2 hover:bg-slate-50 rounded-full">
                  <MoreHorizontal size={18} />
                </button>
              </header>

              {/* Scrollable details contents */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                <div className="flex items-center gap-3">
                  <img src={activePostDetail.avatar} alt="Avatar" className="w-9 h-9 rounded-full" />
                  <div>
                    <h4 className="text-xs font-black text-[#071A3D] leading-none">{activePostDetail.author}</h4>
                    <p className="text-[9px] text-slate-400 font-bold mt-1 uppercase">{activePostDetail.location}</p>
                  </div>
                </div>

                <p className="text-xs font-semibold text-slate-700 leading-relaxed whitespace-pre-line">{activePostDetail.content}</p>

                {/* Media */}
                {activePostDetail.image && (
                  <img src={activePostDetail.image} alt="Media" className="w-full rounded-2xl object-cover" />
                )}

                {/* Stats indicators */}
                <div className="flex items-center justify-between border-y border-slate-100 py-3 text-[#071A3D]">
                  <div className="flex gap-5 text-xs font-black">
                    <button onClick={() => handlePostLike(activePostDetail)} className="flex items-center gap-1">
                      <Heart size={18} className={activePostDetail.isLiked ? 'text-rose-500 fill-current' : ''} />
                      <span>{activePostDetail.likes}</span>
                    </button>
                    <span className="flex items-center gap-1">
                      <MessageCircle size={18} />
                      <span>{activePostDetail.comments.length}</span>
                    </span>
                  </div>
                  <button onClick={() => handlePostSave(activePostDetail)} className={activePostDetail.isSaved ? 'text-[#00B857]' : ''}>
                    <Bookmark size={18} className={activePostDetail.isSaved ? 'fill-current' : ''} />
                  </button>
                </div>

                {/* Comments List */}
                <div className="space-y-4">
                  <h5 className="text-[10px] font-black uppercase tracking-wider text-slate-400">Comentários</h5>
                  {activePostDetail.comments.map(c => (
                    <div key={c.id} className="flex gap-3 text-xs">
                      <img src={c.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${c.author}`} alt="Avatar" className="w-7 h-7 rounded-full border" />
                      <div className="flex-1 bg-slate-50 p-3 rounded-2xl">
                        <p className="text-[10px] font-black text-[#071A3D]">{c.author}</p>
                        <p className="text-slate-650 font-semibold mt-1 leading-relaxed">{c.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer comment compose input */}
              <div className="p-3 border-t border-slate-100 bg-white flex items-center gap-3">
                <input
                  type="text"
                  placeholder="Escreve um comentário..."
                  value={newCommentText}
                  onChange={(e) => setNewCommentText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleCommentSubmit()}
                  className="flex-1 bg-slate-55 border-none rounded-xl px-4 py-2 text-xs text-[#071A3D] focus:ring-1 focus:ring-[#00B857]"
                />
                <button onClick={handleCommentSubmit} className="p-2.5 bg-[#00B857] text-white rounded-xl shadow-lg">
                  <Send size={16} />
                </button>
              </div>

            </div>
          )}
        </AnimatePresence>

        {/* ================= PRIVATE CHAT WINDOW OVERLAY ================= */}
        <AnimatePresence>
          {activeChatUser && (
            <div className="absolute inset-0 z-[200] bg-white flex flex-col justify-between">
              
              {/* Header */}
              <header className="px-4 h-14 border-b border-slate-100 flex items-center justify-between">
                <button onClick={() => setActiveChatUser(null)} className="p-2 hover:bg-slate-50 rounded-full">
                  <ArrowLeft size={18} />
                </button>
                <span className="text-xs font-black uppercase tracking-wider text-[#071A3D]">{activeChatUser}</span>
                <span className="w-8 h-8 rounded-full border bg-slate-50" />
              </header>

              {/* History */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50">
                {(dmHistory[activeChatUser] || []).map((msg, i) => {
                  const isMe = msg.sender === userName;
                  return (
                    <div key={i} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[75%] p-3.5 rounded-2xl shadow-sm text-xs ${
                        isMe ? 'bg-[#00B857] text-white rounded-tr-none' : 'bg-white text-[#071A3D] rounded-tl-none'
                      }`}>
                        <p className="font-semibold leading-relaxed">{msg.text}</p>
                        <span className="block text-[8px] text-right mt-1 opacity-70">{msg.timestamp}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Chat composer input */}
              <div className="p-3 border-t border-slate-100 bg-white flex items-center gap-3">
                <input
                  type="text"
                  placeholder="Escreve uma mensagem..."
                  value={chatTextInput}
                  onChange={(e) => setChatTextInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && sendChatMessage()}
                  className="flex-1 bg-slate-50 border-none rounded-xl px-4 py-2 text-xs focus:ring-1 focus:ring-[#00B857] text-[#071A3D]"
                />
                <button onClick={sendChatMessage} className="p-2.5 bg-[#00B857] text-white rounded-xl shadow-lg">
                  <Send size={16} />
                </button>
              </div>

            </div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};

export default CommunitySection;
