
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowRight, Search, Heart, MessageCircle, Share2, MoreHorizontal, Send, 
  Image as ImageIcon, Video, Smile, Link, Mail, MessageSquare, Copy, 
  CheckCircle2, X, Camera, Type, Palette, Filter, Music, Radio,
  ThumbsUp, User as UserIcon
} from 'lucide-react';
import AzoresLogo from './AzoresLogo';

interface CommunitySectionProps {
  isAuthenticated: boolean;
  userName: string;
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
}

interface Comment {
  id: number;
  author: string;
  text: string;
  time: string;
}

const CommunitySection: React.FC<CommunitySectionProps> = ({ isAuthenticated, userName, onShowAuth, onClose }) => {
  const [communityStep, setCommunityStep] = useState<'landing' | 'feed'>('landing');
  const [posts, setPosts] = useState<Post[]>([
    {
      id: 1,
      author: 'Explorador Açoreano',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
      time: '2h atrás',
      location: 'S. Miguel',
      content: 'Hoje visitei a Lagoa das Sete Cidades e foi mágico! 🌊⛰️ Os Açores nunca deixam de surpreender. #AzoresToYou',
      image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=800',
      likes: 124,
      comments: [
        { id: 101, author: 'Maria Silva', text: 'Que vista incrível! 😍', time: '1h atrás' }
      ]
    }
  ]);

  // UI State
  const [showShareModal, setShowShareModal] = useState(false);
  const [showCommentModal, setShowCommentModal] = useState<number | null>(null);
  const [showMediaEditor, setShowMediaEditor] = useState<'photo' | 'video' | null>(null);
  const [showLiveStream, setShowLiveStream] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<string | null>(null);
  const [postText, setPostText] = useState('');
  const [newComment, setNewComment] = useState('');
  const [activePostId, setActivePostId] = useState<number | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  // Editor State
  const [editorText, setEditorText] = useState('');
  const [editorFilter, setEditorFilter] = useState('none');
  const [editorColor, setEditorColor] = useState('#ffffff');

  // Refs
  const photoInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const emojis = ['❤️', '🔥', '👏', '😮', '😢', '😍', '😂', '💯', '✨', '🌊', '⛰️', '🥘'];

  const handleMediaSelect = (e: React.ChangeEvent<HTMLInputElement>, type: 'photo' | 'video') => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setSelectedMedia(url);
      setShowMediaEditor(type);
    }
  };

  const handlePublish = () => {
    if (!postText && !selectedMedia) return;

    const newPost: Post = {
      id: Date.now(),
      author: userName,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userName}`,
      time: 'Agora',
      location: 'Açores',
      content: postText,
      image: showMediaEditor === 'photo' ? selectedMedia || undefined : undefined,
      video: showMediaEditor === 'video' ? selectedMedia || undefined : undefined,
      likes: 0,
      comments: []
    };

    setPosts([newPost, ...posts]);
    setPostText('');
    setSelectedMedia(null);
    setShowMediaEditor(null);
    setEditorText('');
  };

  const toggleLike = (id: number) => {
    setPosts(prev => prev.map(p => 
      p.id === id ? { ...p, likes: p.isLiked ? p.likes - 1 : p.likes + 1, isLiked: !p.isLiked } : p
    ));
  };

  const handleAddComment = (postId: number) => {
    if (!newComment.trim()) return;
    setPosts(prev => prev.map(p => 
      p.id === postId ? { ...p, comments: [...p.comments, { id: Date.now(), author: userName, text: newComment, time: 'Agora' }] } : p
    ));
    setNewComment('');
  };

  // Live Stream Simulation
  useEffect(() => {
    if (showLiveStream && videoRef.current) {
      navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then(stream => { if (videoRef.current) videoRef.current.srcObject = stream; })
        .catch(err => console.error("Camera error:", err));
    }
  }, [showLiveStream]);

  if (communityStep === 'landing') {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-between p-12 overflow-hidden"
      >
        {/* Background Video */}
        <video 
          autoPlay 
          muted 
          loop 
          playsInline 
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        >
           <source src="/comu.mp4" type="video/mp4" />
        </video>

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-black/80 pointer-events-none" />

        <div className="flex-1 flex flex-col items-center justify-center max-w-sm w-full text-center space-y-12 relative z-10">
           <motion.div 
             initial={{ scale: 0.8, opacity: 0 }}
             animate={{ scale: 1, opacity: 1 }}
             transition={{ delay: 0.2, type: 'spring' }}
             className="w-40 h-40 bg-white rounded-full flex items-center justify-center shadow-2xl border-4 border-white/20 overflow-hidden"
           >
              <AzoresLogo size={120} />
           </motion.div>

           <motion.div
             initial={{ y: 20, opacity: 0 }}
             animate={{ y: 0, opacity: 1 }}
             transition={{ delay: 0.3 }}
             className="space-y-4"
           >
              <h1 className="text-4xl font-black text-white uppercase tracking-tighter leading-tight">
                Comunidade <br/>
                Azores<span className="text-green-400">Toyou</span>
              </h1>
              <p className="text-white/70 font-bold uppercase tracking-[0.2em] text-[11px]">
                Onde as Histórias Ganham Vida
              </p>
           </motion.div>

           <div className="w-full space-y-4">
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setCommunityStep('feed')}
                className="w-full py-5 rounded-2xl font-black text-lg uppercase tracking-widest shadow-xl shadow-blue-200 transition-all flex items-center justify-center gap-3 group"
                style={{ background: 'linear-gradient(to right, #1A75BB, #2C7A2E)', color: 'white' }}
              >
                 Entrar <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </motion.button>

              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onClose}
                className="w-full py-4 bg-rose-50 hover:bg-rose-100 text-rose-500 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all border border-rose-100"
              >
                 Sair da Comunidade
              </motion.button>
           </div>
        </div>

        <motion.div className="text-center space-y-2 relative z-10">
           <p className="text-[10px] text-white font-black uppercase tracking-widest">AzoresToYou Social Network</p>
           <p className="text-[8px] text-white/40 font-bold uppercase tracking-tighter">© 2025 BionicID. All rights reserved.</p>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-[#F0F2F5] pb-24"
    >
      {/* Hidden Inputs */}
      <input type="file" accept="image/*" ref={photoInputRef} className="hidden" onChange={(e) => handleMediaSelect(e, 'photo')} />
      <input type="file" accept="video/*" ref={videoInputRef} className="hidden" onChange={(e) => handleMediaSelect(e, 'video')} />

      {/* UNIPAGE Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm px-4 h-14 flex items-center justify-between">
         <div className="flex items-center gap-2">
            <AzoresLogo size={32} />
            <span className="text-lg font-black tracking-tighter uppercase text-slate-900">
               Azores<span className="text-green-600">Toyou</span>
            </span>
         </div>
         <div className="flex-1 max-w-md mx-4 hidden sm:block">
            <div className="relative group">
               <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
               <input type="text" placeholder="Pesquisar..." className="w-full bg-slate-100 border-none rounded-full py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-blue-500 transition-all" />
            </div>
         </div>
         <div className="flex items-center gap-3">
            <motion.div whileHover={{ scale: 1.1 }} className="w-8 h-8 bg-slate-200 rounded-full overflow-hidden border border-slate-100 cursor-pointer">
               <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${userName}`} alt="Profile" className="w-full h-full object-cover" />
            </motion.div>
         </div>
      </header>

      <div className="max-w-xl mx-auto py-6 px-4 space-y-6">
         {/* Create Post Section */}
         <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 space-y-4">
            <div className="flex gap-3">
               <div className="w-10 h-10 bg-slate-100 rounded-full flex-shrink-0 overflow-hidden">
                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${userName}`} alt="Avatar" className="w-full h-full object-cover" />
               </div>
               <div className="flex-1 relative">
                  <textarea 
                    value={postText}
                    onChange={(e) => setPostText(e.target.value)}
                    placeholder={`No que estás a pensar, ${userName}?`}
                    className="w-full bg-slate-100 hover:bg-slate-200 rounded-2xl px-4 py-3 text-slate-700 text-sm font-medium transition-colors border-none focus:ring-2 focus:ring-blue-500/20 resize-none h-20"
                  />
                  {postText && (
                    <motion.button 
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      onClick={handlePublish}
                      className="absolute bottom-3 right-3 bg-blue-600 text-white px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-200"
                    >
                       Publicar
                    </motion.button>
                  )}
               </div>
            </div>
            <div className="flex border-t border-slate-100 pt-3 relative">
               <motion.button 
                 whileTap={{ scale: 0.9 }} 
                 onClick={() => videoInputRef.current?.click()}
                 className="flex-1 flex items-center justify-center gap-2 py-2 hover:bg-slate-50 rounded-lg transition-colors text-slate-600"
               >
                  <Video className="w-4 h-4 text-rose-500" />
                  <span className="text-[10px] font-bold uppercase">Vídeo</span>
               </motion.button>
               <motion.button 
                 whileTap={{ scale: 0.9 }} 
                 onClick={() => photoInputRef.current?.click()}
                 className="flex-1 flex items-center justify-center gap-2 py-2 hover:bg-slate-50 rounded-lg transition-colors text-slate-600"
               >
                  <ImageIcon className="w-4 h-4 text-green-500" />
                  <span className="text-[10px] font-bold uppercase">Foto</span>
               </motion.button>
               <motion.button 
                 whileTap={{ scale: 0.9 }} 
                 onClick={() => setShowLiveStream(true)}
                 className="flex-1 flex items-center justify-center gap-2 py-2 hover:bg-slate-50 rounded-lg transition-colors text-slate-600 border-x border-slate-50"
               >
                  <Radio className="w-4 h-4 text-purple-500 animate-pulse" />
                  <span className="text-[10px] font-bold uppercase">Direto</span>
               </motion.button>
               <motion.button 
                 whileTap={{ scale: 0.9 }} 
                 onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                 className="flex-1 flex items-center justify-center gap-2 py-2 hover:bg-slate-50 rounded-lg transition-colors text-slate-600 relative"
               >
                  <Smile className="w-4 h-4 text-yellow-500" />
                  <span className="text-[10px] font-bold uppercase">Sentimento</span>
               </motion.button>

               <AnimatePresence>
                 {showEmojiPicker && (
                   <motion.div 
                     initial={{ opacity: 0, y: 10, scale: 0.95 }}
                     animate={{ opacity: 1, y: 0, scale: 1 }}
                     exit={{ opacity: 0, y: 10, scale: 0.95 }}
                     className="absolute bottom-full right-0 mb-4 p-3 bg-white rounded-2xl shadow-2xl border border-slate-100 grid grid-cols-4 gap-2 z-50"
                   >
                      {emojis.map(emoji => (
                        <motion.button 
                          key={emoji}
                          whileHover={{ scale: 1.2 }}
                          whileTap={{ scale: 0.8 }}
                          onClick={() => { setPostText(prev => prev + emoji); setShowEmojiPicker(false); }}
                          className="text-2xl p-1"
                        >
                          {emoji}
                        </motion.button>
                      ))}
                   </motion.div>
                 )}
               </AnimatePresence>
            </div>
         </div>

         {/* Feed Posts */}
         {posts.map((post) => (
           <div key={post.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-4 flex items-center justify-between">
                 <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden border border-slate-100 shadow-sm">
                       <img src={post.avatar} alt="Avatar" className="w-full h-full object-cover" />
                    </div>
                    <div>
                       <h3 className="text-sm font-black text-slate-900 leading-none">{post.author}</h3>
                       <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight mt-1">{post.location} • {post.time}</p>
                    </div>
                 </div>
                 <motion.button whileTap={{ scale: 0.8 }} className="p-2 text-slate-400 hover:bg-slate-50 rounded-full">
                    <MoreHorizontal className="w-5 h-5" />
                 </motion.button>
              </div>
              
              <div className="px-4 pb-3">
                 <p className="text-sm text-slate-800 leading-relaxed font-medium">{post.content}</p>
              </div>

              {post.image && (
                <div className="aspect-square bg-slate-100 relative group overflow-hidden">
                   <img 
                     src={post.image} 
                     alt="Post" 
                     className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                   />
                </div>
              )}

              {post.video && (
                <div className="aspect-square bg-black relative group">
                   <video 
                     src={post.video} 
                     controls 
                     className="w-full h-full object-contain"
                   />
                </div>
              )}

              <div className="p-4 space-y-4">
                 <div className="flex items-center justify-between text-slate-600">
                    <div className="flex items-center gap-6">
                       <motion.button 
                         whileHover={{ scale: 1.2 }}
                         whileTap={{ scale: 0.8 }}
                         onClick={() => toggleLike(post.id)}
                         className={`transition-all ${post.isLiked ? 'text-rose-500' : 'text-slate-800'}`}
                       >
                          <Heart className={`w-7 h-7 ${post.isLiked ? 'fill-current' : ''}`} />
                       </motion.button>
                       <motion.button 
                         whileHover={{ scale: 1.2 }}
                         whileTap={{ scale: 0.8 }}
                         onClick={() => setShowCommentModal(post.id)}
                         className="text-slate-800"
                       >
                          <MessageCircle className="w-7 h-7" />
                       </motion.button>
                       <motion.button whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.8 }} className="text-slate-800">
                          <Send className="w-7 h-7" />
                       </motion.button>
                    </div>
                    <motion.button 
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.8 }}
                      onClick={() => { setActivePostId(post.id); setShowShareModal(true); }}
                      className="text-slate-800"
                    >
                       <Share2 className="w-7 h-7" />
                    </motion.button>
                 </div>
                 
                 <div className="space-y-1">
                    <p className="text-xs font-black text-slate-900 uppercase tracking-tight">{post.likes} Gostos</p>
                    {post.comments.length > 0 && (
                      <button 
                        onClick={() => setShowCommentModal(post.id)}
                        className="text-xs text-slate-500 font-medium hover:underline"
                      >
                        Ver todos os {post.comments.length} comentários
                      </button>
                    )}
                 </div>
              </div>
           </div>
         ))}
      </div>

      {/* Media Editor Modal */}
      <AnimatePresence>
        {showMediaEditor && selectedMedia && (
          <div className="fixed inset-0 z-[300] bg-slate-900 flex flex-col">
             <header className="p-6 flex items-center justify-between text-white border-b border-white/10 bg-slate-900/80 backdrop-blur-md">
                <button onClick={() => setShowMediaEditor(null)} className="p-2 bg-white/10 rounded-full">
                   <X className="w-6 h-6" />
                </button>
                <h2 className="text-sm font-black uppercase tracking-widest">Editar {showMediaEditor === 'photo' ? 'Foto' : 'Vídeo'}</h2>
                <button 
                  onClick={handlePublish}
                  className="px-6 py-2 bg-white text-slate-900 rounded-full text-xs font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all shadow-xl"
                >
                   Seguinte
                </button>
             </header>

             <div className="flex-1 relative flex items-center justify-center overflow-hidden">
                <div className={`relative max-w-full max-h-full ${editorFilter !== 'none' ? `filter ${editorFilter}` : ''}`}>
                   {showMediaEditor === 'photo' ? (
                     <img src={selectedMedia} alt="Preview" className="max-h-[70vh] object-contain rounded-2xl shadow-2xl border-4 border-white/10" />
                   ) : (
                     <video src={selectedMedia} controls className="max-h-[70vh] rounded-2xl shadow-2xl border-4 border-white/10" />
                   )}
                   
                   {/* Draggable Text Overlay */}
                   <motion.div 
                     drag 
                     dragConstraints={{ left: -100, right: 100, top: -200, bottom: 200 }}
                     className="absolute inset-0 flex items-center justify-center pointer-events-none"
                   >
                      <span 
                        className="px-4 py-2 bg-black/40 backdrop-blur-md rounded-xl text-xl font-bold pointer-events-auto cursor-move shadow-2xl"
                        style={{ color: editorColor }}
                      >
                         {editorText || 'Escreve algo...'}
                      </span>
                   </motion.div>
                </div>
             </div>

             <footer className="p-8 bg-slate-900 border-t border-white/10">
                <div className="max-w-md mx-auto space-y-8">
                   {/* Editor Controls */}
                   <div className="flex justify-around items-center">
                      <div className="flex flex-col items-center gap-2 group cursor-pointer">
                         <div className="p-4 bg-white/5 rounded-2xl group-hover:bg-blue-600 transition-colors">
                            <Type className="w-6 h-6 text-white" />
                         </div>
                         <span className="text-[10px] font-bold text-white/50 uppercase tracking-widest">Texto</span>
                         <input 
                           type="text" 
                           value={editorText} 
                           onChange={(e) => setEditorText(e.target.value)}
                           className="bg-white/10 border-none rounded-lg text-white text-xs mt-2 text-center"
                         />
                      </div>
                      <div className="flex flex-col items-center gap-2 group cursor-pointer">
                         <div className="p-4 bg-white/5 rounded-2xl group-hover:bg-green-600 transition-colors">
                            <Palette className="w-6 h-6 text-white" />
                         </div>
                         <span className="text-[10px] font-bold text-white/50 uppercase tracking-widest">Cor</span>
                         <input 
                           type="color" 
                           value={editorColor} 
                           onChange={(e) => setEditorColor(e.target.value)}
                           className="w-10 h-10 rounded-full border-none p-0 bg-transparent mt-2 cursor-pointer"
                         />
                      </div>
                      <div className="flex flex-col items-center gap-2 group cursor-pointer">
                         <div className="p-4 bg-white/5 rounded-2xl group-hover:bg-purple-600 transition-colors">
                            <Filter className="w-6 h-6 text-white" />
                         </div>
                         <span className="text-[10px] font-bold text-white/50 uppercase tracking-widest">Filtros</span>
                         <select 
                           onChange={(e) => setEditorFilter(e.target.value)}
                           className="bg-white/10 border-none rounded-lg text-white text-[10px] mt-2"
                         >
                            <option value="none">Original</option>
                            <option value="grayscale(1)">P&B</option>
                            <option value="sepia(1)">Sépia</option>
                            <option value="brightness(1.5)">Brilho</option>
                            <option value="contrast(1.5)">Contraste</option>
                         </select>
                      </div>
                   </div>
                </div>
             </footer>
          </div>
        )}
      </AnimatePresence>

      {/* Live Stream Simulation Modal */}
      <AnimatePresence>
        {showLiveStream && (
          <div className="fixed inset-0 z-[400] bg-black flex flex-col">
             <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/60 z-10" />
             
             {/* Live Header */}
             <div className="p-6 flex items-center justify-between relative z-20">
                <div className="flex items-center gap-3">
                   <div className="bg-rose-600 px-3 py-1 rounded-md flex items-center gap-2 animate-pulse shadow-lg">
                      <div className="w-2 h-2 bg-white rounded-full" />
                      <span className="text-[10px] font-black text-white uppercase tracking-widest">Em Direto</span>
                   </div>
                   <div className="bg-black/40 backdrop-blur-md px-3 py-1 rounded-md text-white text-[10px] font-bold flex items-center gap-2 border border-white/10">
                      <UserIcon className="w-3 h-3" /> 1.4k
                   </div>
                </div>
                <button onClick={() => setShowLiveStream(false)} className="p-2 bg-white/20 rounded-full text-white backdrop-blur-md">
                   <X className="w-6 h-6" />
                </button>
             </div>

             <video 
               ref={videoRef} 
               autoPlay 
               muted 
               className="flex-1 w-full h-full object-cover"
             />

             {/* Live Comments Simulation */}
             <div className="absolute bottom-24 left-6 right-6 z-20 space-y-3 pointer-events-none">
                <div className="flex items-center gap-2 animate-in slide-in-from-left-4 duration-500">
                   <div className="w-8 h-8 rounded-full bg-blue-500 border-2 border-white/50" />
                   <p className="text-white text-xs font-bold shadow-text">Ricardo: Os Açores são lindos! 🔥</p>
                </div>
                <div className="flex items-center gap-2 animate-in slide-in-from-left-4 duration-700">
                   <div className="w-8 h-8 rounded-full bg-green-500 border-2 border-white/50" />
                   <p className="text-white text-xs font-bold shadow-text">Carla: Que inveja dessa vista! 😍🌊</p>
                </div>
             </div>

             <div className="p-6 flex items-center gap-3 relative z-20 bg-gradient-to-t from-black/80 to-transparent">
                <input 
                  type="text" 
                  placeholder="Diz algo em direto..." 
                  className="flex-1 bg-white/20 backdrop-blur-md border border-white/20 rounded-full py-3 px-6 text-white placeholder-white/60 text-sm focus:ring-2 focus:ring-white/30"
                />
                <button className="p-4 bg-rose-600 rounded-full text-white shadow-xl">
                   <Heart className="w-6 h-6 fill-current" />
                </button>
             </div>
          </div>
        )}
      </AnimatePresence>

      {/* Comment Modal */}
      <AnimatePresence>
        {showCommentModal && (
          <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center">
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowCommentModal(null)} />
             <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} className="relative bg-white w-full max-w-lg rounded-t-[2.5rem] sm:rounded-[2.5rem] p-8 shadow-2xl z-10 flex flex-col max-h-[80vh]">
                <div className="flex justify-between items-center mb-8 border-b border-slate-50 pb-4">
                   <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Comentários</h2>
                   <button onClick={() => setShowCommentModal(null)} className="p-2 bg-slate-50 rounded-full text-slate-400">
                      <X className="w-5 h-5" />
                   </button>
                </div>

                <div className="flex-1 overflow-y-auto space-y-6 mb-8 pr-2">
                   {posts.find(p => p.id === showCommentModal)?.comments.map(c => (
                     <div key={c.id} className="flex gap-4 group">
                        <div className="w-10 h-10 rounded-full bg-slate-100 flex-shrink-0 overflow-hidden">
                           <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${c.author}`} alt="Avatar" />
                        </div>
                        <div className="flex-1">
                           <div className="bg-slate-50 rounded-2xl p-4 group-hover:bg-slate-100 transition-colors">
                              <p className="text-xs font-black text-slate-900 mb-1">{c.author}</p>
                              <p className="text-sm text-slate-600 leading-relaxed">{c.text}</p>
                           </div>
                           <div className="flex items-center gap-4 mt-2 px-2">
                              <span className="text-[10px] text-slate-400 font-bold uppercase">{c.time}</span>
                              <button className="text-[10px] text-slate-600 font-black uppercase hover:text-blue-600 transition-colors">Gostar</button>
                              <button className="text-[10px] text-slate-600 font-black uppercase hover:text-blue-600 transition-colors">Responder</button>
                           </div>
                        </div>
                     </div>
                   ))}
                </div>

                <div className="flex items-center gap-3 bg-slate-100 rounded-2xl p-2 border border-slate-200">
                   <input 
                     type="text" 
                     value={newComment}
                     onChange={(e) => setNewComment(e.target.value)}
                     placeholder="Escreve um comentário..." 
                     className="flex-1 bg-transparent border-none focus:ring-0 text-sm py-2 px-4"
                   />
                   <button 
                     onClick={() => handleAddComment(showCommentModal)}
                     className="bg-slate-900 text-white p-3 rounded-xl hover:bg-blue-600 transition-colors shadow-lg"
                   >
                      <Send className="w-5 h-5" />
                   </button>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Share Modal (Existing) */}
      <AnimatePresence>
        {showShareModal && (
          <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-0 sm:p-4">
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowShareModal(false)} />
             <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} className="relative bg-white w-full max-w-md rounded-t-[2.5rem] sm:rounded-[2.5rem] p-8 shadow-2xl z-10">
                <div className="flex justify-between items-center mb-8">
                   <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Partilhar</h2>
                   <button onClick={() => setShowShareModal(false)} className="p-2 bg-slate-50 rounded-full text-slate-400"><X className="w-5 h-5" /></button>
                </div>
                <div className="grid grid-cols-4 gap-4 mb-8">
                   {['WhatsApp', 'Gmail', 'Messenger', 'Copiar'].map(name => (
                     <button key={name} className="flex flex-col items-center gap-3">
                        <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100">
                           {name === 'WhatsApp' ? <MessageCircle className="text-green-500" /> : name === 'Gmail' ? <Mail className="text-red-500" /> : <Link className="text-blue-500" />}
                        </div>
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{name}</span>
                     </button>
                   ))}
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default CommunitySection;
