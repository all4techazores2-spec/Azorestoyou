import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, Send, Image, Mic, MoreVertical, Phone, Video, 
  Paperclip, Building2, ExternalLink, Check, CheckCheck, Smile
} from 'lucide-react';
import { SocialProfile } from '../types';

interface ChatMessage {
  id: string;
  sender: string;
  senderAvatar?: string;
  text?: string;
  imageUrl?: string;
  businessCard?: {
    id: string;
    name: string;
    category: string;
    collection: string;
    image?: string;
  };
  audioDuration?: string;
  timestamp: string;
  isMe: boolean;
}

interface CommunityDirectChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetUser: {
    name: string;
    handle?: string;
    avatar?: string;
    isBusiness?: boolean;
    businessCollection?: string;
    businessId?: string;
  } | null;
  myProfile: SocialProfile | null;
  onBookBusiness?: (category: string, businessId: string) => void;
  onViewProfile?: (handle: string) => void;
}

const CommunityDirectChatModal: React.FC<CommunityDirectChatModalProps> = ({
  isOpen,
  onClose,
  targetUser,
  myProfile,
  onBookBusiness,
  onViewProfile
}) => {
  if (!isOpen || !targetUser) return null;

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: targetUser.name,
      senderAvatar: targetUser.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${targetUser.name}`,
      text: targetUser.isBusiness 
        ? `Olá! Bem-vindo à página oficial de ${targetUser.name}. Em que podemos ajudar hoje?`
        : `Olá! Vais ao trilho da Lagoa do Fogo no próximo fim de semana?`,
      timestamp: '11:20',
      isMe: false
    }
  ]);

  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    const myMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: myProfile?.name || 'Eu',
      senderAvatar: myProfile?.avatar,
      text: inputText.trim(),
      timestamp: new Date().toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' }),
      isMe: true
    };

    setMessages(prev => [...prev, myMsg]);
    setInputText('');

    // Auto-reply simulation
    setTimeout(() => {
      const replyMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: targetUser.name,
        senderAvatar: targetUser.avatar,
        text: targetUser.isBusiness 
          ? `Obrigado pelo seu contacto! O nosso horário de atendimento nos Açores é das 09:00 às 19:00. Para reservar mesa ou atividade use o botão no perfil!`
          : `Perfeito! Vou levar a câmara fotográfica. Vemo-nos no miradouro! 📸`,
        timestamp: new Date().toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' }),
        isMe: false
      };
      setMessages(prev => [...prev, replyMsg]);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[500] bg-white flex flex-col justify-between max-w-[480px] mx-auto shadow-2xl select-none">
      
      {/* 1. CHAT HEADER */}
      <header className="h-16 px-3 border-b border-slate-100 flex items-center justify-between bg-white/90 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-slate-50 active:scale-95 text-[#071A3D] rounded-full transition-all"
          >
            <ArrowLeft size={18} />
          </button>
          
          <div 
            className="flex items-center gap-2.5 cursor-pointer group"
            onClick={() => targetUser.handle && onViewProfile && onViewProfile(targetUser.handle)}
          >
            <div className="relative">
              <img 
                src={targetUser.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${targetUser.name}`} 
                alt={targetUser.name} 
                className="w-10 h-10 rounded-full object-cover border border-slate-150 group-hover:scale-105 transition-transform" 
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white" />
            </div>
            <div>
              <h4 className="text-xs font-black text-[#071A3D] leading-none group-hover:text-emerald-600 transition-colors">
                {targetUser.name}
              </h4>
              <p className="text-[10px] text-[#0066FF] font-semibold lowercase mt-0.5">
                {targetUser.handle || `@azorestoyou_${targetUser.name.toLowerCase().replace(/[^a-z0-9_]/g, '')}`}
              </p>
            </div>
          </div>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-1">
          {targetUser.isBusiness && (
            <button 
              onClick={() => onBookBusiness && onBookBusiness(targetUser.businessCollection || 'activities', targetUser.businessId || '1')}
              className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-[#00B857] rounded-xl text-[10px] font-black uppercase tracking-wider transition-all flex items-center gap-1"
            >
              <Building2 size={12} />
              <span>Reservar</span>
            </button>
          )}
          <button className="p-2 hover:bg-slate-50 text-slate-400 rounded-full">
            <MoreVertical size={16} />
          </button>
        </div>
      </header>

      {/* 2. CHAT MESSAGES LIST */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#F8FAFC]">
        
        {/* Security / Privacy notice */}
        <div className="text-center py-2">
          <span className="inline-block px-3 py-1 bg-slate-200/60 rounded-full text-[9px] font-bold text-slate-500 uppercase tracking-tight">
            Conversa privada na Comunidade Azorestoyou 🔒
          </span>
        </div>

        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex items-end gap-2 ${msg.isMe ? 'justify-end' : 'justify-start'}`}
          >
            {!msg.isMe && (
              <img 
                src={msg.senderAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${msg.sender}`} 
                alt="Avatar" 
                className="w-7 h-7 rounded-full object-cover flex-shrink-0 mb-1" 
              />
            )}

            <div 
              className={`max-w-[78%] p-3.5 rounded-2xl shadow-sm text-xs leading-relaxed ${
                msg.isMe 
                  ? 'bg-[#00B857] text-white rounded-br-none' 
                  : 'bg-white text-[#071A3D] rounded-bl-none border border-slate-100'
              }`}
            >
              <p className="font-medium whitespace-pre-wrap">{msg.text}</p>
              
              <div className={`flex items-center justify-end gap-1 mt-1 text-[8px] ${msg.isMe ? 'text-white/80' : 'text-slate-400'}`}>
                <span>{msg.timestamp}</span>
                {msg.isMe && <CheckCheck size={10} />}
              </div>
            </div>
          </div>
        ))}
        
        <div ref={messagesEndRef} />
      </div>

      {/* 3. INPUT COMPOSER */}
      <div className="p-3 bg-white border-t border-slate-100 flex items-center gap-2">
        <button 
          onClick={() => alert('Anexar foto ou vídeo')}
          className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-50"
        >
          <Image size={18} />
        </button>

        <input
          type="text"
          placeholder="Escreve uma mensagem..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
          className="flex-1 bg-slate-100 focus:bg-white border-none rounded-2xl px-4 py-2.5 text-xs text-[#071A3D] focus:ring-2 focus:ring-[#00B857] transition-all"
        />

        {inputText.trim() ? (
          <button
            onClick={handleSendMessage}
            className="p-2.5 bg-[#00B857] hover:bg-emerald-600 active:scale-95 text-white rounded-2xl shadow-md shadow-emerald-600/20 transition-all"
          >
            <Send size={15} />
          </button>
        ) : (
          <button 
            onClick={() => alert('Gravação de voz açoriana ativada')}
            className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-2xl transition-all"
          >
            <Mic size={15} />
          </button>
        )}
      </div>

    </div>
  );
};

export default CommunityDirectChatModal;
