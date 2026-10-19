import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Send, Heart, Flame, ThumbsUp, Smile, Sparkles } from 'lucide-react';

interface StoryItem {
  id: number;
  userName: string;
  userHandle?: string;
  avatar: string;
  mediaUrl: string;
  mediaType?: 'image' | 'video';
  timestamp?: number;
  caption?: string;
  location?: string;
}

interface CommunityStoriesViewerProps {
  isOpen: boolean;
  onClose: () => void;
  stories: StoryItem[];
  initialIndex?: number;
  onSendReply?: (story: StoryItem, text: string) => void;
  onSendReaction?: (story: StoryItem, reaction: string) => void;
}

const QUICK_REACTIONS = ['❤️', '🔥', '👏', '😍', '😮', '🙌'];

const CommunityStoriesViewer: React.FC<CommunityStoriesViewerProps> = ({
  isOpen,
  onClose,
  stories,
  initialIndex = 0,
  onSendReply,
  onSendReaction
}) => {
  if (!isOpen || stories.length === 0) return null;

  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isPaused, setIsPaused] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [showReactionAnimation, setShowReactionAnimation] = useState<string | null>(null);

  const activeStory = stories[currentIndex] || stories[0];
  const progressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const STORY_DURATION = 5000; // 5 seconds per story

  // Advance to next story or close if at end
  const handleNext = () => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      onClose();
    }
  };

  // Back to previous story
  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  // Auto-advance timer
  useEffect(() => {
    if (isPaused) return;

    progressTimerRef.current = setTimeout(() => {
      handleNext();
    }, STORY_DURATION);

    return () => {
      if (progressTimerRef.current) clearTimeout(progressTimerRef.current);
    };
  }, [currentIndex, isPaused, stories.length]);

  const handleTriggerReaction = (emoji: string) => {
    setShowReactionAnimation(emoji);
    if (onSendReaction) onSendReaction(activeStory, emoji);
    setTimeout(() => setShowReactionAnimation(null), 1200);
  };

  const handleSendTextReply = () => {
    if (!replyText.trim()) return;
    if (onSendReply) onSendReply(activeStory, replyText.trim());
    setReplyText('');
    handleTriggerReaction('💬');
  };

  return (
    <div 
      className="community-overlay fixed inset-0 z-[500] bg-black flex flex-col justify-between select-none w-full overflow-hidden"
      onMouseDown={() => setIsPaused(true)}
      onMouseUp={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
    >
      
      {/* 1. TOP PROGRESS SEGMENTS */}
      <div className="absolute top-0 inset-x-0 z-30 p-3 pt-4 bg-gradient-to-b from-black/80 via-black/40 to-transparent space-y-3 pointer-events-none">
        
        {/* Progress bars row */}
        <div className="flex items-center gap-1.5 w-full">
          {stories.map((s, idx) => (
            <div key={s.id || idx} className="h-1 flex-1 bg-white/30 rounded-full overflow-hidden">
              <div 
                className={`h-full bg-white transition-all ${
                  idx < currentIndex 
                    ? 'w-full' 
                    : idx === currentIndex 
                      ? isPaused ? 'w-1/2' : 'w-full duration-[5000ms] ease-linear' 
                      : 'w-0'
                }`}
              />
            </div>
          ))}
        </div>

        {/* User Info & Close header */}
        <div className="flex items-center justify-between text-white pointer-events-auto">
          <div className="flex items-center gap-2.5">
            <img 
              src={activeStory.avatar} 
              alt={activeStory.userName} 
              className="w-9 h-9 rounded-full object-cover border-2 border-white/40" 
            />
            <div>
              <h5 className="text-xs font-black leading-none drop-shadow-sm flex items-center gap-1">
                <span>{activeStory.userName}</span>
                <span className="text-[10px] text-white/70 font-semibold">• 2h</span>
              </h5>
              {activeStory.location && (
                <p className="text-[9px] text-emerald-400 font-bold uppercase tracking-wider mt-0.5 drop-shadow-sm">
                  {activeStory.location}
                </p>
              )}
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-2 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-sm transition-all"
          >
            <X size={18} />
          </button>
        </div>

      </div>

      {/* 2. MEDIA DISPLAY & TAP NAVIGATION AREAS */}
      <div className="relative flex-1 flex items-center justify-center bg-zinc-950">
        
        {/* Left Click Area (Prev) */}
        <div 
          onClick={handlePrev} 
          className="absolute left-0 top-16 bottom-24 w-1/3 z-20 cursor-pointer" 
        />
        
        {/* Right Click Area (Next) */}
        <div 
          onClick={handleNext} 
          className="absolute right-0 top-16 bottom-24 w-1/3 z-20 cursor-pointer" 
        />

        {/* Media */}
        {activeStory.mediaType === 'video' ? (
          <video 
            src={activeStory.mediaUrl} 
            autoPlay 
            playsInline 
            loop 
            muted 
            className="w-full h-full object-contain" 
          />
        ) : (
          <img 
            src={activeStory.mediaUrl} 
            alt="Story" 
            className="w-full h-full object-contain pointer-events-none" 
          />
        )}

        {/* Story Caption overlay if exists */}
        {activeStory.caption && (
          <div className="absolute bottom-24 inset-x-4 z-20 pointer-events-none text-center">
            <span className="inline-block bg-black/60 backdrop-blur-md px-4 py-2 rounded-2xl text-xs font-black text-white shadow-xl">
              {activeStory.caption}
            </span>
          </div>
        )}

        {/* Reaction animated popup */}
        <AnimatePresence>
          {showReactionAnimation && (
            <motion.div 
              initial={{ scale: 0.5, opacity: 0, y: 50 }}
              animate={{ scale: 1.5, opacity: 1, y: 0 }}
              exit={{ scale: 2, opacity: 0, y: -60 }}
              className="absolute z-40 text-7xl pointer-events-none select-none drop-"
            >
              {showReactionAnimation}
            </motion.div>
          )}
        </AnimatePresence>

      </div>

      {/* 3. BOTTOM REACTION BAR & REPLY INPUT */}
      <div className="p-3 bg-gradient-to-t from-black/90 via-black/60 to-transparent space-y-3 z-30">
        
        {/* Quick Emojis strip */}
        <div className="flex items-center justify-between px-2">
          {QUICK_REACTIONS.map((emoji, i) => (
            <button
              key={i}
              onClick={() => handleTriggerReaction(emoji)}
              className="text-2xl hover:scale-130 active:scale-95 transition-transform"
            >
              {emoji}
            </button>
          ))}
        </div>

        {/* Message Input form */}
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder={`Enviar mensagem a ${activeStory.userName}...`}
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendTextReply()}
            onFocus={() => setIsPaused(true)}
            onBlur={() => setIsPaused(false)}
            className="flex-1 bg-white/20 hover:bg-white/25 focus:bg-white/30 border border-white/20 rounded-2xl px-4 py-2.5 text-xs text-white placeholder-white/60 focus:ring-1 focus:ring-white transition-all"
          />
          <button 
            onClick={handleSendTextReply}
            disabled={!replyText.trim()}
            className="p-2.5 bg-[#00B857] hover:bg-emerald-600 active:scale-95 disabled:opacity-40 text-white rounded-2xl shadow-lg transition-all"
          >
            <Send size={15} />
          </button>
        </div>

      </div>

    </div>
  );
};

export default CommunityStoriesViewer;
