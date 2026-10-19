import { communityAvatar, profileAvatar } from '../services/communitySocial';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, Heart, MessageCircle, Share2, Bookmark, Send, 
  MapPin, Calendar, ExternalLink, Loader2
} from 'lucide-react';
import { API_BASE_URL } from '../config';
import { SocialProfile } from '../types';

interface Comment {
  id: number;
  author: string;
  authorHandle?: string;
  authorAvatar?: string;
  text: string;
  time: string;
  likes?: number;
}

interface PostDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  post: any;
  myProfile: SocialProfile | null;
  onLikeToggle: (post: any) => void;
  onSaveToggle: (post: any) => void;
  onBookBusiness?: (businessType: string, businessId: string) => void;
  onAuthorClick?: (handle: string) => void;
  onCommentAdded?: () => void;
}

const CommunityPostDetailModal: React.FC<PostDetailModalProps> = ({
  isOpen,
  onClose,
  post,
  myProfile,
  onLikeToggle,
  onSaveToggle,
  onBookBusiness,
  onAuthorClick,
  onCommentAdded
}) => {
  if (!isOpen || !post) return null;

  const [commentText, setCommentText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeImgIdx, setActiveImgIdx] = useState(0);

  const images = post.images && post.images.length > 0 
    ? post.images 
    : (post.image ? [post.image] : []);

  const comments: Comment[] = post.comments || [];

  const handleSendComment = async () => {
    if (!commentText.trim()) return;
    setIsSubmitting(true);

    try {
      const res = await fetch(`${API_BASE_URL}/api/community/posts/${post.id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          author: myProfile?.name || 'Viajante',
          authorHandle: myProfile?.handle || '@azorestoyou_viajante',
          authorAvatar: myProfile?.avatar || communityAvatar,
          text: commentText.trim()
        })
      });

      if (res.ok) {
        setCommentText('');
        onCommentAdded?.();
      }
    } catch (err) {
      console.error('Erro ao comentar:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="community-overlay fixed inset-0 z-[230] flex items-center justify-center bg-black/70 backdrop-blur-sm ">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-none bg-white h-full   flex flex-col overflow-hidden relative"
      >
        {/* Header */}
        <div className="px-4 h-14 border-b border-slate-100 flex items-center justify-between shrink-0 bg-white">
          <div 
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => { onAuthorClick?.(post.authorHandle || post.author); onClose(); }}
          >
            <img src={post.authorAvatar || post.avatar} alt={post.author} className="w-8 h-8 rounded-full object-cover border border-slate-100" />
            <div>
              <h4 className="text-xs font-semibold text-slate-800 leading-none group-hover:text-emerald-600 transition-colors">
                {post.author}
              </h4>
              <p className="text-[10px] text-slate-400 font-bold mt-0.5">{post.location}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-500 hover:bg-slate-100 rounded-full">
            <X size={20} />
          </button>
        </div>

        {/* Scroll Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Media Frame */}
          {images.length > 0 && (
            <div className="w-full aspect-square bg-slate-950 relative">
              <img 
                src={images[activeImgIdx] || images[0]} 
                alt="Post" 
                className="w-full h-full object-cover"
              />
              {images.length > 1 && (
                <div className="absolute bottom-3 inset-x-0 flex justify-center gap-1.5">
                  {images.map((_: any, i: number) => (
                    <button 
                      key={i} 
                      onClick={() => setActiveImgIdx(i)}
                      className={`h-1.5 rounded-full transition-all ${activeImgIdx === i ? 'w-4 bg-white' : 'w-1.5 bg-white/50'}`}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Action Row */}
          <div className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => onLikeToggle(post)}
                  className="flex items-center gap-1.5 text-slate-700 active:scale-125 transition-transform"
                >
                  <Heart 
                    size={22} 
                    className={post.isLiked ? 'fill-rose-500 text-rose-500' : 'text-slate-700'} 
                  />
                  <span className="text-xs font-semibold">{post.likes ?? 0}</span>
                </button>
                <div className="flex items-center gap-1.5 text-slate-700">
                  <MessageCircle size={22} />
                  <span className="text-xs font-semibold">{comments.length}</span>
                </div>
                <button 
                  onClick={() => {
                    navigator.clipboard?.writeText?.(window.location.href);
                    alert('Ligação da publicação copiada!');
                  }}
                  className="text-slate-700 active:scale-95 transition-transform"
                >
                  <Share2 size={20} />
                </button>
              </div>

              <button 
                onClick={() => onSaveToggle(post)}
                className="text-slate-700 active:scale-95 transition-transform"
              >
                <Bookmark 
                  size={20} 
                  className={post.isSaved ? 'fill-emerald-600 text-emerald-600' : 'text-slate-700'} 
                />
              </button>
            </div>

            {/* Description & Tags */}
            <div className="text-xs space-y-1">
              <p className="text-slate-800 font-medium leading-relaxed">
                <strong 
                  className="font-semibold mr-1.5 cursor-pointer hover:underline"
                  onClick={() => { onAuthorClick?.(post.authorHandle || post.author); onClose(); }}
                >
                  {post.authorHandle || post.author}
                </strong>
                {post.content}
              </p>
              <p className="text-[10px] text-slate-400 font-bold uppercase">{post.time}</p>
            </div>

            {/* Linked Super-App Business Card (like Whale Watching in mockup) */}
            {post.businessTag && (
              <div className="p-3 bg-emerald-50/70 border border-emerald-100 rounded-2xl flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  {post.businessTag.image && (
                    <img 
                      src={post.businessTag.image} 
                      alt={post.businessTag.name} 
                      className="w-12 h-12 rounded-xl object-cover shrink-0 border border-emerald-200"
                    />
                  )}
                  <div>
                    <h5 className="text-xs font-semibold text-slate-800 leading-tight">
                      {post.businessTag.name}
                    </h5>
                    <p className="text-[10px] font-bold text-emerald-700">
                      {post.businessTag.subtitle || post.businessTag.category}
                    </p>
                  </div>
                </div>

                <button 
                  onClick={() => {
                    onBookBusiness?.(post.businessTag.collection || 'restaurants', post.businessTag.id);
                    onClose();
                  }}
                  className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-[10px] font-semibold  shrink-0 shadow-sm shadow-emerald-600/20 active:scale-95 transition-all"
                >
                  {post.businessTag.actionText || 'Ver negócio'}
                </button>
              </div>
            )}

            {/* Comments List */}
            <div className="pt-2 border-t border-slate-100 space-y-3">
              <h5 className="text-[11px] font-semibold  text-slate-400">Comentários</h5>
              {comments.length === 0 ? (
                <p className="text-xs text-slate-400 italic">Sê o primeiro a comentar esta publicação!</p>
              ) : (
                comments.map((c: Comment) => (
                  <div key={c.id} className="flex items-start gap-2.5">
                    <img 
                      src={profileAvatar(c.authorAvatar)} 
                      alt={c.author} 
                      className="w-7 h-7 rounded-full object-cover shrink-0 mt-0.5"
                    />
                    <div className="flex-1 text-xs">
                      <p className="text-slate-800 leading-snug">
                        <strong className="font-semibold mr-1 text-slate-900">{c.author}</strong>
                        <span>{c.text}</span>
                      </p>
                      <span className="text-[9px] font-bold text-slate-400 mt-0.5 block">{c.time}</span>
                    </div>
                  </div>
                ))
              )}
            </div>

          </div>
        </div>

        {/* Comment Composer Footer */}
        <div className="p-3 border-t border-slate-100 bg-white flex items-center gap-2 shrink-0">
          <input 
            type="text" 
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendComment()}
            placeholder="Adicionar um comentário..."
            className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-full text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <button 
            disabled={isSubmitting || !commentText.trim()}
            onClick={handleSendComment}
            className={`p-2.5 rounded-full text-white transition-all ${
              isSubmitting || !commentText.trim()
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                : 'bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-600/20 active:scale-95'
            }`}
          >
            {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
          </button>
        </div>

      </motion.div>
    </div>
  );
};

export default CommunityPostDetailModal;
