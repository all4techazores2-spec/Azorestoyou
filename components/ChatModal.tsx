import React, { useState, useEffect, useRef } from 'react';
import { X, Send, ArrowLeft, MessageCircle, MessageSquare, ChevronRight, User } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export interface ChatMessage {
  id: string;
  adId: string;
  adTitle: string;
  adImage: string;
  senderEmail: string;
  senderName: string;
  receiverEmail: string;
  receiverName: string;
  text: string;
  timestamp: string;
  read: boolean;
}

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUserProfile: {
    name: string;
    email: string;
    phone: string;
    avatar: string;
  } | null;
  chats: ChatMessage[];
  onUpdateChats: (chats: ChatMessage[]) => Promise<void>;
  directAdStart?: any | null; // Passed when opening directly from an ad detail
  onClearDirectAdStart?: () => void;
  onShowAuth: () => void;
}

const ChatModal: React.FC<ChatModalProps> = ({
  isOpen,
  onClose,
  currentUserProfile,
  chats,
  onUpdateChats,
  directAdStart,
  onClearDirectAdStart,
  onShowAuth
}) => {
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [typedMessage, setTypedMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const currentUserEmail = currentUserProfile?.email || '';

  // 1. Group chats into conversations
  const conversationsMap: Record<string, {
    convId: string;
    adId: string;
    adTitle: string;
    adImage: string;
    otherUserEmail: string;
    otherUserName: string;
    lastMessage: ChatMessage;
    unreadCount: number;
    messages: ChatMessage[];
  }> = {};

  chats.forEach(msg => {
    if (msg.senderEmail !== currentUserEmail && msg.receiverEmail !== currentUserEmail) return;

    const convId = `${msg.adId}__${[msg.senderEmail, msg.receiverEmail].sort().join("::")}`;
    const otherUserEmail = msg.senderEmail === currentUserEmail ? msg.receiverEmail : msg.senderEmail;
    const otherUserName = msg.senderEmail === currentUserEmail ? msg.receiverName : msg.senderName;

    if (!conversationsMap[convId]) {
      conversationsMap[convId] = {
        convId,
        adId: msg.adId,
        adTitle: msg.adTitle,
        adImage: msg.adImage,
        otherUserEmail,
        otherUserName,
        lastMessage: msg,
        unreadCount: 0,
        messages: []
      };
    }

    conversationsMap[convId].messages.push(msg);

    if (new Date(msg.timestamp) > new Date(conversationsMap[convId].lastMessage.timestamp)) {
      conversationsMap[convId].lastMessage = msg;
    }
  });

  Object.values(conversationsMap).forEach(conv => {
    conv.messages.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    conv.unreadCount = conv.messages.filter(m => m.receiverEmail === currentUserEmail && !m.read).length;
  });

  const conversationsList = Object.values(conversationsMap).sort((a, b) => 
    new Date(b.lastMessage.timestamp).getTime() - new Date(a.lastMessage.timestamp).getTime()
  );

  // 2. Direct Start Conversation from Ad
  useEffect(() => {
    if (isOpen && directAdStart && currentUserProfile) {
      // Don't chat with yourself
      if (directAdStart.userEmail === currentUserEmail) {
        alert("Este anúncio é seu. Não pode enviar mensagens para si próprio.");
        onClearDirectAdStart?.();
        return;
      }

      const convId = `${directAdStart.id}__${[currentUserEmail, directAdStart.userEmail].sort().join("::")}`;
      setActiveConvId(convId);
      onClearDirectAdStart?.();
    }
  }, [isOpen, directAdStart, currentUserProfile]);

  // 3. Mark messages as read when opening a conversation
  useEffect(() => {
    if (activeConvId && isOpen && currentUserEmail) {
      const unreadInConv = chats.filter(m => 
        m.receiverEmail === currentUserEmail && 
        !m.read && 
        `${m.adId}__${[m.senderEmail, m.receiverEmail].sort().join("::")}` === activeConvId
      );

      if (unreadInConv.length > 0) {
        const updated = chats.map(m => {
          const mConvId = `${m.adId}__${[m.senderEmail, m.receiverEmail].sort().join("::")}`;
          if (mConvId === activeConvId && m.receiverEmail === currentUserEmail) {
            return { ...m, read: true };
          }
          return m;
        });
        onUpdateChats(updated);
      }
    }
  }, [activeConvId, chats, isOpen, currentUserEmail]);

  // 4. Scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConvId, chats]);

  if (!isOpen) return null;

  // Render auth notice if not logged in
  if (!currentUserProfile) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
        <div className="bg-white rounded-[32px] w-full max-w-md p-8 shadow-2xl text-center space-y-6">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto">
            <MessageSquare size={32} />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">Negociações no Azores4you</h3>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-2">Inicie sessão para dialogar com os anunciantes do Marketplace</p>
          </div>
          <div className="flex gap-4">
            <button onClick={onClose} className="flex-1 py-4 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all">Fechar</button>
            <button 
              onClick={() => { onClose(); onShowAuth(); }} 
              className="flex-1 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-lg shadow-blue-600/20 transition-all"
            >
              Iniciar Sessão
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Send message
  const handleSendMessage = () => {
    if (!typedMessage.trim() || !activeConvId) return;

    let adId = '';
    let adTitle = '';
    let adImage = '';
    let receiverEmail = '';
    let receiverName = '';

    const existingConv = conversationsMap[activeConvId];
    if (existingConv) {
      adId = existingConv.adId;
      adTitle = existingConv.adTitle;
      adImage = existingConv.adImage;
      receiverEmail = existingConv.otherUserEmail;
      receiverName = existingConv.otherUserName;
    } else if (directAdStart) {
      adId = directAdStart.id;
      adTitle = directAdStart.title;
      adImage = directAdStart.image || (directAdStart.images && directAdStart.images[0]);
      receiverEmail = directAdStart.userEmail;
      receiverName = directAdStart.userName;
    } else {
      const parts = activeConvId.split('__');
      adId = parts[0];
      const emails = parts[1].split('::');
      receiverEmail = emails.find(e => e !== currentUserEmail) || '';
      receiverName = 'Anunciante';
    }

    const newMessage: ChatMessage = {
      id: `msg_${Date.now()}`,
      adId,
      adTitle,
      adImage: adImage || 'https://images.unsplash.com/photo-1540340334550-624b32a8a1de?q=80&w=2070&auto=format&fit=crop',
      senderEmail: currentUserEmail,
      senderName: currentUserProfile.name,
      receiverEmail,
      receiverName,
      text: typedMessage.trim(),
      timestamp: new Date().toISOString(),
      read: false
    };

    onUpdateChats([newMessage, ...chats]).then(() => {
      setTypedMessage('');
    });
  };

  const activeConv = activeConvId ? conversationsMap[activeConvId] : null;
  const activeMessages = activeConv ? activeConv.messages : [];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white rounded-[32px] w-full max-w-4xl h-[85vh] overflow-hidden shadow-2xl border border-white/20 flex flex-col md:flex-row relative"
      >
        
        {/* Left Side: Conversation List */}
        <div className={`w-full md:w-5/12 border-r border-slate-100 flex flex-col h-full bg-slate-50 ${activeConvId && 'hidden md:flex'}`}>
          <div className="p-6 border-b border-slate-100 bg-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-6 h-6 text-blue-600" />
              <h2 className="text-lg font-black text-slate-800 tracking-tight">As Minhas Mensagens</h2>
            </div>
            <button onClick={onClose} className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-full transition-all md:hidden">
              <X size={18} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {conversationsList.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center text-slate-400 space-y-4">
                <MessageCircle size={40} className="stroke-[1.5]" />
                <p className="text-xs font-bold uppercase tracking-widest">Nenhuma conversa iniciada</p>
              </div>
            ) : (
              conversationsList.map(conv => (
                <button
                  key={conv.convId}
                  onClick={() => setActiveConvId(conv.convId)}
                  className={`w-full p-4 rounded-2xl border transition-all flex items-center gap-3 text-left group ${
                    activeConvId === conv.convId 
                      ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-600/20' 
                      : 'bg-white border-slate-100 hover:border-slate-200 text-slate-800 shadow-sm'
                  }`}
                >
                  <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0 border border-slate-200/50">
                    <img src={conv.adImage} alt="" className="w-full h-full object-cover" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-0.5">
                      <span className={`text-[10px] font-black uppercase truncate tracking-wider ${
                        activeConvId === conv.convId ? 'text-blue-100' : 'text-slate-400'
                      }`}>
                        {conv.otherUserName}
                      </span>
                      <span className={`text-[8px] font-bold ${
                        activeConvId === conv.convId ? 'text-blue-200' : 'text-slate-400'
                      }`}>
                        {new Date(conv.lastMessage.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className={`font-black text-xs truncate uppercase tracking-tight ${
                      activeConvId === conv.convId ? 'text-white' : 'text-slate-800'
                    }`}>
                      {conv.adTitle}
                    </p>
                    <p className={`text-[11px] truncate ${
                      activeConvId === conv.convId ? 'text-blue-100 font-medium' : 'text-slate-500 font-medium'
                    }`}>
                      {conv.lastMessage.text}
                    </p>
                  </div>

                  {conv.unreadCount > 0 && activeConvId !== conv.convId && (
                    <span className="w-2.5 h-2.5 bg-red-500 rounded-full flex-shrink-0 animate-pulse" />
                  )}
                  <ChevronRight size={16} className={`flex-shrink-0 opacity-40 ${
                    activeConvId === conv.convId ? 'text-white' : 'text-slate-400'
                  }`} />
                </button>
              ))
            )}
          </div>
        </div>

        {/* Right Side: Dialogue Window */}
        <div className={`flex-1 flex flex-col h-full bg-white ${!activeConvId && 'hidden md:flex'}`}>
          {activeConvId ? (
            <>
              <div className="p-6 border-b border-slate-100 flex items-center gap-3 bg-white">
                <button 
                  onClick={() => setActiveConvId(null)} 
                  className="p-2.5 bg-slate-50 hover:bg-slate-100 text-slate-800 rounded-full transition-all md:hidden"
                >
                  <ArrowLeft size={18} />
                </button>

                <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-50 border border-slate-200/50">
                  <img src={activeConv?.adImage || (directAdStart?.image || (directAdStart?.images && directAdStart.images[0]))} alt="" className="w-full h-full object-cover" />
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-black text-slate-800 text-sm truncate uppercase tracking-tight">
                    {activeConv?.adTitle || directAdStart?.title}
                  </h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Chat com: {activeConv?.otherUserName || directAdStart?.userName}
                  </p>
                </div>

                <button onClick={onClose} className="p-2.5 bg-slate-50 hover:bg-slate-100 text-slate-800 rounded-full transition-all">
                  <X size={18} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/50">
                {activeMessages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 text-slate-400 text-center space-y-3">
                    <MessageCircle size={32} />
                    <p className="text-xs font-bold uppercase tracking-widest">Diga "Olá" e inicie a negociação!</p>
                  </div>
                ) : (
                  activeMessages.map(msg => {
                    const isMe = msg.senderEmail === currentUserEmail;
                    return (
                      <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[75%] rounded-2xl p-4 shadow-sm border ${
                          isMe 
                            ? 'bg-blue-600 border-blue-600 text-white rounded-tr-none' 
                            : 'bg-white border-slate-100 text-slate-800 rounded-tl-none'
                        }`}>
                          <p className="text-xs font-medium leading-relaxed break-words">{msg.text}</p>
                          <span className={`text-[8px] font-bold block text-right mt-1.5 opacity-60`}>
                            {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              <div className="p-4 bg-white border-t border-slate-100 flex gap-3 items-center">
                <input
                  type="text"
                  placeholder="Escreva a sua mensagem..."
                  value={typedMessage}
                  onChange={e => setTypedMessage(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1 h-12 bg-slate-50 border border-slate-100 rounded-2xl px-6 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!typedMessage.trim()}
                  className="w-12 h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-blue-600/20 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100"
                >
                  <Send size={18} />
                </button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-400 space-y-4">
              <div className="p-4 bg-slate-50 text-blue-600 rounded-full border border-slate-100 shadow-sm">
                <MessageSquare size={36} />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-800 uppercase tracking-tight">Nenhuma conversa selecionada</h3>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Selecione uma conversa do lado esquerdo para começar</p>
              </div>
            </div>
          )}
        </div>

      </motion.div>
    </div>
  );
};

export default ChatModal;
