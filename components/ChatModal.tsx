import React, { useState, useEffect, useRef } from 'react';
import { X, Send, ArrowLeft, MessageCircle, MessageSquare, ChevronRight, User, Users } from 'lucide-react';
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
  ads: any[]; // List of ads from App.tsx to lookup seller and details
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
  ads,
  directAdStart,
  onClearDirectAdStart,
  onShowAuth
}) => {
  const [selectedAdId, setSelectedAdId] = useState<string | null>(null);
  const [selectedBuyerEmail, setSelectedBuyerEmail] = useState<string | null>(null);
  const [typedMessage, setTypedMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const currentUserEmail = currentUserProfile?.email || '';

  // 1. Group chats into advertisements (publications)
  const adsConversations: Record<string, {
    adId: string;
    adTitle: string;
    adImage: string;
    adPrice: number;
    sellerEmail: string;
    sellerName: string;
    lastActiveTimestamp: string;
    unreadCount: number;
    buyers: Record<string, {
      buyerEmail: string;
      buyerName: string;
      messages: ChatMessage[];
      unreadCount: number;
      lastMessage: ChatMessage;
    }>;
  }> = {};

  // Process all messages in chats
  chats.forEach(msg => {
    if (msg.senderEmail !== currentUserEmail && msg.receiverEmail !== currentUserEmail) return;

    const adId = msg.adId;
    const adTitle = msg.adTitle;

    // Find the ad in master list to get precise seller and image
    const adObj = ads.find(a => a.id === adId);
    const sellerEmail = adObj ? adObj.userEmail : msg.receiverEmail;
    const sellerName = adObj ? adObj.userName : msg.receiverName;
    const adPrice = adObj ? adObj.price : 0;

    let adImage = '';
    if (adObj) {
      adImage = (adObj.images && adObj.images[0]) || adObj.image || '';
    }
    if (!adImage || adImage === 'undefined' || adImage === 'null') {
      adImage = msg.adImage || '';
    }
    if (!adImage || adImage === 'undefined' || adImage === 'null') {
      adImage = 'https://images.unsplash.com/photo-1540340334550-624b32a8a1de?q=80&w=2070&auto=format&fit=crop';
    }

    const isSeller = currentUserEmail === sellerEmail;
    const buyerEmail = isSeller 
      ? (msg.senderEmail === sellerEmail ? msg.receiverEmail : msg.senderEmail)
      : currentUserEmail;
    const buyerName = isSeller
      ? (msg.senderEmail === sellerEmail ? msg.receiverName : msg.senderName)
      : currentUserProfile.name;

    if (!adsConversations[adId]) {
      adsConversations[adId] = {
        adId,
        adTitle,
        adImage,
        adPrice,
        sellerEmail,
        sellerName,
        lastActiveTimestamp: msg.timestamp,
        unreadCount: 0,
        buyers: {}
      };
    }

    if (!adsConversations[adId].buyers[buyerEmail]) {
      adsConversations[adId].buyers[buyerEmail] = {
        buyerEmail,
        buyerName,
        messages: [],
        unreadCount: 0,
        lastMessage: msg
      };
    }

    adsConversations[adId].buyers[buyerEmail].messages.push(msg);

    // Track latest message
    if (new Date(msg.timestamp) > new Date(adsConversations[adId].buyers[buyerEmail].lastMessage.timestamp)) {
      adsConversations[adId].buyers[buyerEmail].lastMessage = msg;
    }

    // Update overall active timestamp
    if (new Date(msg.timestamp) > new Date(adsConversations[adId].lastActiveTimestamp)) {
      adsConversations[adId].lastActiveTimestamp = msg.timestamp;
    }
  });

  // 2. Pre-populate direct start conversation from active ad details
  if (isOpen && directAdStart && currentUserProfile) {
    const adId = directAdStart.id;
    const sellerEmail = directAdStart.userEmail;
    const buyerEmail = currentUserEmail;

    if (sellerEmail !== currentUserEmail) {
      if (!adsConversations[adId]) {
        adsConversations[adId] = {
          adId,
          adTitle: directAdStart.title,
          adImage: directAdStart.image || (directAdStart.images && directAdStart.images[0]) || 'https://images.unsplash.com/photo-1540340334550-624b32a8a1de?q=80&w=2070&auto=format&fit=crop',
          adPrice: directAdStart.price || 0,
          sellerEmail,
          sellerName: directAdStart.userName,
          lastActiveTimestamp: new Date().toISOString(),
          unreadCount: 0,
          buyers: {}
        };
      }

      if (!adsConversations[adId].buyers[buyerEmail]) {
        adsConversations[adId].buyers[buyerEmail] = {
          buyerEmail,
          buyerName: currentUserProfile.name,
          messages: [],
          unreadCount: 0,
          lastMessage: {
            id: 'placeholder',
            adId,
            adTitle: directAdStart.title,
            adImage: directAdStart.image || (directAdStart.images && directAdStart.images[0]) || '',
            senderEmail: currentUserEmail,
            senderName: currentUserProfile.name,
            receiverEmail: sellerEmail,
            receiverName: directAdStart.userName,
            text: 'Diga "Olá" para começar a negociar...',
            timestamp: new Date().toISOString(),
            read: true
          }
        };
      }
    }
  }

  // Calculate unreads and sort messages in each subgroup
  Object.values(adsConversations).forEach(adConv => {
    let adUnreads = 0;
    Object.values(adConv.buyers).forEach(buyerConv => {
      buyerConv.messages.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
      buyerConv.unreadCount = buyerConv.messages.filter(m => m.receiverEmail === currentUserEmail && !m.read).length;
      adUnreads += buyerConv.unreadCount;
    });
    adConv.unreadCount = adUnreads;
  });

  // Sort advertisements list by latest message/action timestamp
  const adsList = Object.values(adsConversations).sort((a, b) => 
    new Date(b.lastActiveTimestamp).getTime() - new Date(a.lastActiveTimestamp).getTime()
  );

  // 3. Direct start trigger
  useEffect(() => {
    if (isOpen && directAdStart && currentUserProfile) {
      if (directAdStart.userEmail === currentUserEmail) {
        alert("Este anúncio é seu. Não pode enviar mensagens para si próprio.");
        onClearDirectAdStart?.();
        return;
      }
      setSelectedAdId(directAdStart.id);
      setSelectedBuyerEmail(currentUserEmail);
      onClearDirectAdStart?.();
    }
  }, [isOpen, directAdStart, currentUserProfile]);

  // 4. If selectedAdId changes and current user is seller, automatically select first buyer
  useEffect(() => {
    if (selectedAdId && currentUserEmail) {
      const adConv = adsConversations[selectedAdId];
      if (adConv) {
        const isSeller = currentUserEmail === adConv.sellerEmail;
        if (isSeller) {
          const buyersList = Object.keys(adConv.buyers);
          if (buyersList.length > 0 && !buyersList.includes(selectedBuyerEmail || '')) {
            setSelectedBuyerEmail(buyersList[0]);
          }
        } else {
          setSelectedBuyerEmail(currentUserEmail);
        }
      }
    }
  }, [selectedAdId, currentUserEmail]);

  // 5. Mark messages as read when opening conversation
  useEffect(() => {
    if (selectedAdId && selectedBuyerEmail && isOpen && currentUserEmail) {
      const adConv = adsConversations[selectedAdId];
      if (adConv) {
        const unreadInConv = chats.filter(m => 
          m.adId === selectedAdId &&
          m.receiverEmail === currentUserEmail &&
          !m.read &&
          (currentUserEmail === adConv.sellerEmail ? m.senderEmail === selectedBuyerEmail : true)
        );

        if (unreadInConv.length > 0) {
          const updated = chats.map(m => {
            const isTarget = m.adId === selectedAdId &&
                             m.receiverEmail === currentUserEmail &&
                             (currentUserEmail === adConv.sellerEmail ? m.senderEmail === selectedBuyerEmail : true);
            if (isTarget) {
              return { ...m, read: true };
            }
            return m;
          });
          onUpdateChats(updated);
        }
      }
    }
  }, [selectedAdId, selectedBuyerEmail, chats, isOpen, currentUserEmail]);

  // 6. Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedAdId, selectedBuyerEmail, chats]);

  if (!isOpen) return null;

  // Non-logged in screen
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

  // Handle Send message
  const handleSendMessage = () => {
    if (!typedMessage.trim() || !selectedAdId || !selectedBuyerEmail) return;

    const adConv = adsConversations[selectedAdId];
    if (!adConv) return;

    const isSeller = currentUserEmail === adConv.sellerEmail;
    const receiverEmail = isSeller ? selectedBuyerEmail : adConv.sellerEmail;
    
    // Find receiver name from messages
    let receiverName = isSeller ? 'Interessado' : adConv.sellerName;
    const buyerObj = adConv.buyers[selectedBuyerEmail];
    if (isSeller && buyerObj) {
      receiverName = buyerObj.buyerName;
    }

    const newMessage: ChatMessage = {
      id: `msg_${Date.now()}`,
      adId: selectedAdId,
      adTitle: adConv.adTitle,
      adImage: adConv.adImage,
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

  const activeAdConv = selectedAdId ? adsConversations[selectedAdId] : null;
  const activeBuyerConv = (activeAdConv && selectedBuyerEmail) ? activeAdConv.buyers[selectedBuyerEmail] : null;
  const activeMessages = activeBuyerConv ? activeBuyerConv.messages : [];
  const isSellerOfActiveAd = activeAdConv ? currentUserEmail === activeAdConv.sellerEmail : false;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white rounded-[32px] w-full max-w-5xl h-[85vh] overflow-hidden shadow-2xl border border-white/20 flex flex-col md:flex-row relative"
      >
        
        {/* Left Side: Publications List (Organized by Ad ID) */}
        <div className={`w-full md:w-5/12 border-r border-slate-100 flex flex-col h-full bg-slate-50 ${selectedAdId && 'hidden md:flex'}`}>
          <div className="p-6 border-b border-slate-100 bg-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-6 h-6 text-blue-600" />
              <h2 className="text-lg font-black text-slate-800 tracking-tight">Negociações por Anúncio</h2>
            </div>
            <button onClick={onClose} className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-full transition-all md:hidden">
              <X size={18} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {adsList.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center text-slate-400 space-y-4">
                <MessageSquare size={40} className="stroke-[1.5]" />
                <p className="text-xs font-bold uppercase tracking-widest">Nenhum anúncio com propostas</p>
              </div>
            ) : (
              adsList.map(adConv => {
                const buyersArray = Object.values(adConv.buyers);
                const isSeller = currentUserEmail === adConv.sellerEmail;
                
                return (
                  <button
                    key={adConv.adId}
                    onClick={() => {
                      setSelectedAdId(adConv.adId);
                      // Default select first buyer
                      const buyersList = Object.keys(adConv.buyers);
                      if (buyersList.length > 0) {
                        setSelectedBuyerEmail(buyersList[0]);
                      }
                    }}
                    className={`w-full p-4 rounded-2xl border transition-all flex items-center gap-3 text-left group ${
                      selectedAdId === adConv.adId 
                        ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-600/20' 
                        : 'bg-white border-slate-100 hover:border-slate-200 text-slate-800 shadow-sm'
                    }`}
                  >
                    {/* Publication Thumbnail */}
                    <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0 border border-slate-200/50">
                      <img src={adConv.adImage} alt="" className="w-full h-full object-cover" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-0.5">
                        <span className={`text-[9px] font-black uppercase tracking-wider ${
                          selectedAdId === adConv.adId ? 'text-blue-100' : 'text-orange-600'
                        }`}>
                          {adConv.adPrice > 0 ? `${adConv.adPrice.toLocaleString('pt-PT')} €` : 'Grátis'}
                        </span>
                        <span className={`text-[8px] font-bold ${
                          selectedAdId === adConv.adId ? 'text-blue-200' : 'text-slate-400'
                        }`}>
                          {isSeller ? 'O Meu Anúncio' : 'Interessado'}
                        </span>
                      </div>
                      <p className={`font-black text-xs truncate uppercase tracking-tight ${
                        selectedAdId === adConv.adId ? 'text-white' : 'text-slate-800'
                      }`}>
                        {adConv.adTitle}
                      </p>
                      
                      {/* Interested Count / Last Message Summary */}
                      <p className={`text-[10px] font-bold ${
                        selectedAdId === adConv.adId ? 'text-blue-200' : 'text-slate-400'
                      }`}>
                        {isSeller 
                          ? `👥 ${buyersArray.length} ${buyersArray.length === 1 ? 'interessado' : 'interessados'}`
                          : `👤 Vendedor: ${adConv.sellerName}`}
                      </p>
                    </div>

                    {adConv.unreadCount > 0 && selectedAdId !== adConv.adId && (
                      <span className="w-3 h-3 bg-red-500 rounded-full flex-shrink-0 text-[8px] font-black text-white flex items-center justify-center animate-pulse">
                        {adConv.unreadCount}
                      </span>
                    )}
                    <ChevronRight size={16} className={`flex-shrink-0 opacity-40 ${
                      selectedAdId === adConv.adId ? 'text-white' : 'text-slate-400'
                    }`} />
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right Side: Message Dialogue Window and Interested List Hub */}
        <div className={`flex-1 flex flex-col h-full bg-white ${!selectedAdId && 'hidden md:flex'}`}>
          {selectedAdId && activeAdConv ? (
            <>
              {/* Dialogue Header */}
              <div className="p-6 border-b border-slate-100 flex items-center gap-3 bg-white">
                <button 
                  onClick={() => { setSelectedAdId(null); setSelectedBuyerEmail(null); }} 
                  className="p-2.5 bg-slate-50 hover:bg-slate-100 text-slate-800 rounded-full transition-all md:hidden animate-bounce-short"
                >
                  <ArrowLeft size={18} />
                </button>

                {/* Ad Image / Details */}
                <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-50 border border-slate-200/50 flex-shrink-0">
                  <img src={activeAdConv.adImage} alt="" className="w-full h-full object-cover" />
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-black text-slate-800 text-sm truncate uppercase tracking-tight">
                    {activeAdConv.adTitle}
                  </h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                    {isSellerOfActiveAd ? (
                      <span className="bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full font-black text-[8px]">O MEU ANÚNCIO</span>
                    ) : (
                      <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-black text-[8px]">CHAT COM VENDEDOR: {activeAdConv.sellerName}</span>
                    )}
                    <span>Preço: {activeAdConv.adPrice > 0 ? `${activeAdConv.adPrice} €` : 'Grátis'}</span>
                  </p>
                </div>

                <button onClick={onClose} className="p-2.5 bg-slate-50 hover:bg-slate-100 text-slate-800 rounded-full transition-all">
                  <X size={18} />
                </button>
              </div>

              {/* Hub: List of interested buyers (Only shown to the Seller) */}
              {isSellerOfActiveAd && (
                <div className="px-6 py-4 bg-slate-50/50 border-b border-slate-100 flex flex-col gap-2">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1">
                    <Users size={12} /> Interessados nesta publicação:
                  </span>
                  <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                    {Object.values(activeAdConv.buyers).map(buyerConv => {
                      const isActiveBuyer = selectedBuyerEmail === buyerConv.buyerEmail;
                      return (
                        <button
                          key={buyerConv.buyerEmail}
                          onClick={() => setSelectedBuyerEmail(buyerConv.buyerEmail)}
                          className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-tight flex items-center gap-2 border transition-all whitespace-nowrap active:scale-95 ${
                            isActiveBuyer 
                              ? 'bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-600/10' 
                              : 'bg-white border-slate-100 text-slate-700 hover:border-slate-200'
                          }`}
                        >
                          <div className="w-5 h-5 bg-slate-100 text-slate-500 rounded-full flex items-center justify-center border border-slate-200/50 text-[10px]">
                            <User size={10} />
                          </div>
                          <span>{buyerConv.buyerName}</span>
                          {buyerConv.unreadCount > 0 && !isActiveBuyer && (
                            <span className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0 animate-pulse" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Message List Panel */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/30">
                {activeMessages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 text-slate-400 text-center space-y-3">
                    <MessageCircle size={32} />
                    <p className="text-xs font-bold uppercase tracking-widest">
                      {isSellerOfActiveAd 
                        ? 'Selecione um comprador e envie uma resposta!'
                        : 'Diga "Olá" ao anunciante e inicie a negociação!'}
                    </p>
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
                          {/* Sender name for seller looking at dialogue */}
                          {isSellerOfActiveAd && !isMe && (
                            <span className="text-[8px] font-black uppercase text-slate-400 block mb-1 tracking-wider">{msg.senderName}</span>
                          )}
                          <p className="text-xs font-medium leading-relaxed break-words">{msg.text}</p>
                          <span className="text-[8px] font-bold block text-right mt-1.5 opacity-60">
                            {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Chat Input Controls */}
              <div className="p-4 bg-white border-t border-slate-100 flex gap-3 items-center">
                <input
                  type="text"
                  placeholder={
                    isSellerOfActiveAd 
                      ? `Responder a ${activeBuyerConv?.buyerName || 'Interessado'}...`
                      : "Escreva a sua mensagem para o anunciante..."
                  }
                  value={typedMessage}
                  onChange={e => setTypedMessage(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1 h-12 bg-slate-50 border border-slate-100 rounded-2xl px-6 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!typedMessage.trim() || !selectedBuyerEmail}
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
                <h3 className="text-base font-black text-slate-800 uppercase tracking-tight">Nenhuma publicação selecionada</h3>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Selecione uma publicação do lado esquerdo para ver as negociações</p>
              </div>
            </div>
          )}
        </div>

      </motion.div>
    </div>
  );
};

export default ChatModal;
