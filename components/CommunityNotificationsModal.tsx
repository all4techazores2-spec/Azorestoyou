import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, Heart, MessageCircle, UserPlus, Calendar, Trophy, 
  Sparkles, CheckCircle2, ChevronRight, X, Bell
} from 'lucide-react';

interface NotificationItem {
  id: string;
  type: 'like' | 'comment' | 'follow' | 'booking' | 'credits';
  user?: {
    name: string;
    handle: string;
    avatar: string;
  };
  text: string;
  targetThumbnail?: string;
  timestamp: string;
  read: boolean;
  actionText?: string;
}

interface CommunityNotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProfile?: (handle: string) => void;
  onSelectPost?: (postId: number) => void;
  onOpenReservations?: () => void;
}

const SAMPLE_NOTIFICATIONS: NotificationItem[] = [
  {
    id: '1',
    type: 'booking',
    text: 'A sua reserva na Picos de Aventura (Whale Watching) foi confirmada!',
    timestamp: 'Há 10 min',
    read: false,
    actionText: 'Ver Reserva'
  },
  {
    id: '2',
    type: 'like',
    user: {
      name: 'Mariana Silva',
      handle: '@azorestoyou_marianasilva',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150'
    },
    text: 'gostou da tua foto em Ponta da Ferraria.',
    targetThumbnail: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=150',
    timestamp: 'Há 45 min',
    read: false
  },
  {
    id: '3',
    type: 'follow',
    user: {
      name: 'Diogo Cabral',
      handle: '@azorestoyou_diogocabral',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'
    },
    text: 'começou a seguir-te.',
    timestamp: 'Há 2 h',
    read: true,
    actionText: 'Seguir'
  },
  {
    id: '4',
    type: 'credits',
    text: 'Ganhaste +100 CRÉDITOS por publicar na Comunidade!',
    timestamp: 'Ontem',
    read: true
  },
  {
    id: '5',
    type: 'comment',
    user: {
      name: 'Pedro Sousa',
      handle: '@azorestoyou_pedrosousa',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150'
    },
    text: 'comentou: "Que ângulo incrível da Lagoa do Fogo! 👏"',
    targetThumbnail: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=150',
    timestamp: 'Há 2 dias',
    read: true
  }
];

const CommunityNotificationsModal: React.FC<CommunityNotificationsModalProps> = ({
  isOpen,
  onClose,
  onSelectProfile,
  onSelectPost,
  onOpenReservations
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[500] bg-white flex flex-col justify-between max-w-[480px] mx-auto shadow-2xl select-none animate-in fade-in duration-200">
      
      {/* 1. Header */}
      <header className="h-14 px-4 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-md z-10">
        <div className="flex items-center gap-3">
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-slate-50 text-[#071A3D] rounded-full active:scale-95 transition-all"
          >
            <ArrowLeft size={18} />
          </button>
          <h3 className="text-sm font-black uppercase tracking-wider text-[#071A3D]">Atividade</h3>
        </div>
        <span className="text-[10px] text-emerald-600 font-bold uppercase">Marcar como lidas</span>
      </header>

      {/* 2. Notifications List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        
        {/* Section: Novas */}
        <div className="space-y-3">
          <h5 className="text-[10px] font-black uppercase tracking-wider text-slate-400">Recentes</h5>
          
          <div className="space-y-2.5">
            {SAMPLE_NOTIFICATIONS.map(item => (
              <div 
                key={item.id} 
                className={`p-3 rounded-2xl flex items-center justify-between gap-3 transition-colors ${
                  item.read ? 'bg-slate-50/60' : 'bg-emerald-50/50 border border-emerald-100/60'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  {/* Icon badge or avatar */}
                  <div className="relative flex-shrink-0">
                    {item.user ? (
                      <img 
                        src={item.user.avatar} 
                        alt={item.user.name} 
                        className="w-10 h-10 rounded-full object-cover border border-slate-150 cursor-pointer"
                        onClick={() => item.user && onSelectProfile && onSelectProfile(item.user.handle)}
                      />
                    ) : item.type === 'booking' ? (
                      <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-md shadow-emerald-500/20">
                        <Calendar size={18} />
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-amber-500 text-white flex items-center justify-center shadow-md shadow-amber-500/20">
                        <Trophy size={18} />
                      </div>
                    )}

                    {/* Mini icon badge */}
                    {item.type === 'like' && (
                      <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white flex items-center justify-center border border-white">
                        <Heart size={8} className="fill-current" />
                      </span>
                    )}
                    {item.type === 'comment' && (
                      <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-blue-500 text-white flex items-center justify-center border border-white">
                        <MessageCircle size={8} className="fill-current" />
                      </span>
                    )}
                  </div>

                  {/* Text details */}
                  <div className="min-w-0">
                    <p className="text-xs text-slate-700 leading-snug">
                      {item.user && (
                        <strong 
                          className="font-black text-[#071A3D] cursor-pointer hover:underline mr-1"
                          onClick={() => item.user && onSelectProfile && onSelectProfile(item.user.handle)}
                        >
                          {item.user.name}
                        </strong>
                      )}
                      <span>{item.text}</span>
                    </p>
                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-tight block mt-0.5">
                      {item.timestamp}
                    </span>
                  </div>
                </div>

                {/* Right Action: thumbnail or button */}
                {item.targetThumbnail && (
                  <img 
                    src={item.targetThumbnail} 
                    alt="Thumbnail" 
                    className="w-10 h-10 rounded-xl object-cover flex-shrink-0 border border-slate-100" 
                  />
                )}

                {item.actionText && item.type === 'follow' && (
                  <button 
                    onClick={() => alert(`A seguir ${item.user?.name}`)}
                    className="px-3 py-1.5 bg-[#00B857] hover:bg-emerald-600 active:scale-95 text-white text-[10px] font-black uppercase tracking-wider rounded-xl shadow-sm transition-all flex-shrink-0"
                  >
                    {item.actionText}
                  </button>
                )}

                {item.actionText && item.type === 'booking' && (
                  <button 
                    onClick={() => { onClose(); onOpenReservations && onOpenReservations(); }}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-[10px] font-black uppercase tracking-wider rounded-xl shadow-sm transition-all flex-shrink-0"
                  >
                    {item.actionText}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};

export default CommunityNotificationsModal;
