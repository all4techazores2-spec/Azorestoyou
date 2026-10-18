
import React, { useState } from 'react';
import { User, Bell, Heart, Home, Briefcase, UserPen, CalendarDays, Receipt, MessageCircle, Users, X, PlaySquare, PlusSquare, LogOut, Film, Compass, ShoppingCart } from 'lucide-react';
import { Language } from '../types';
import { getTranslation } from '../translations';
import { motion, AnimatePresence } from 'motion/react';

interface BottomNavProps {
  onHome: () => void;
  onMarketplace: () => void;
  onShowAuth?: () => void;
  onShowFavorites?: () => void;
  itemCount: number;
  language?: Language;
  isAuthenticated?: boolean;
  onShowProfile?: () => void;
  onShowReservations?: () => void;
  onShowNotifications?: () => void;
  notificationCount?: number;
  isCommunity?: boolean;
  isMarketplace?: boolean;
  onCreateCommunityPost?: () => void;
  onCommunityHome?: () => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ 
  onHome, 
  onMarketplace, 
  onShowAuth,
  onShowFavorites,
  itemCount, 
  language = 'pt',
  isAuthenticated = false,
  onShowProfile,
  onShowReservations,
  onShowNotifications,
  notificationCount = 0,
  isCommunity = false,
  isMarketplace = false,
  onCreateCommunityPost,
  onCommunityHome
}) => {
  const currentLang = language as Language;

  const handleProfileClick = () => {
    if (!isAuthenticated) {
      onShowAuth?.();
      return;
    }
    onShowProfile?.();
  };

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 shadow-[0_-8px_30px_rgba(0,0,0,0.08)] z-[90] pb-safe">
        <div className="flex justify-around items-center h-20 px-2 relative">
          {isCommunity ? (
            <>
              {/* 1. Explorar (Super-App Home) */}
              <button 
                onClick={onHome}
                className="flex flex-col items-center justify-center flex-1 text-slate-400 hover:text-emerald-600 transition-all active:scale-90"
              >
                <Compass className="w-6 h-6 mb-1 text-slate-500" />
                <span className="text-[10px] font-bold uppercase tracking-tight text-slate-500">Explorar</span>
              </button>

              {/* 2. Comunidade (Active) */}
              <button 
                onClick={onCommunityHome}
                className="flex flex-col items-center justify-center flex-1 text-emerald-600 transition-all active:scale-90"
              >
                <Users className="w-6 h-6 mb-1 text-emerald-600" />
                <span className="text-[10px] font-black uppercase tracking-tight text-emerald-600">Comunidade</span>
              </button>

              {/* 3. Central (+) Button for Community Creation */}
              <div className="flex-1 flex justify-center -mt-10">
                <button 
                  onClick={onCreateCommunityPost}
                  className="w-14 h-14 bg-emerald-600 hover:bg-emerald-700 rounded-full shadow-[0_10px_25px_rgba(16,185,129,0.35)] flex items-center justify-center border-4 border-white active:scale-90 transition-all group"
                  title="Nova Publicação"
                >
                  <PlusSquare className="w-7 h-7 text-white group-hover:scale-110 transition-transform" />
                </button>
              </div>

              {/* 4. Minhas Reservas */}
              <button 
                onClick={onShowReservations}
                className="flex flex-col items-center justify-center flex-1 text-slate-400 hover:text-emerald-600 transition-all active:scale-90"
              >
                <CalendarDays className="w-6 h-6 mb-1 text-slate-500" />
                <span className="text-[10px] font-bold uppercase tracking-tight text-slate-500">Reservas</span>
              </button>

              {/* 5. Perfil */}
              <button 
                onClick={handleProfileClick}
                className="flex flex-col items-center justify-center flex-1 text-slate-400 hover:text-emerald-600 transition-all active:scale-90"
              >
                <User className="w-6 h-6 mb-1 text-slate-500" />
                <span className="text-[10px] font-bold uppercase tracking-tight text-slate-500">Perfil</span>
              </button>
            </>
          ) : (
            <>
              {/* Favoritos */}
              <button 
                onClick={onShowFavorites}
                className="flex flex-col items-center justify-center flex-1 text-slate-300 hover:text-blue-600 transition-all active:scale-90"
              >
                <Heart className="w-6 h-6 mb-1" />
                <span className="text-[10px] font-bold uppercase tracking-tight">Favoritos</span>
              </button>
              
              {/* Marketplace */}
              <button 
                onClick={onMarketplace}
                className="flex flex-col items-center justify-center flex-1 text-slate-300 hover:text-blue-600 transition-all active:scale-90 relative"
              >
                <ShoppingCart className="w-6 h-6 mb-1" />
                <span className="text-[10px] font-bold uppercase tracking-tight">Marketplace</span>
              </button>

              {/* Central EXPLORAR Button */}
              <div className="flex-1 flex justify-center -mt-12">
                <button 
                  onClick={onHome}
                  className="w-16 h-16 bg-green-600 rounded-full shadow-[0_10px_25px_rgba(22,163,74,0.3)] flex items-center justify-center border-4 border-white active:scale-90 transition-all group"
                >
                   <Compass className="w-8 h-8 text-white group-hover:rotate-45 transition-transform duration-500" />
                </button>
              </div>

              {/* Alertas / Mensagens */}
              <button 
                onClick={onShowNotifications}
                className="flex flex-col items-center justify-center flex-1 text-slate-300 hover:text-blue-600 transition-all active:scale-90 relative"
              >
                {isMarketplace ? (
                  <>
                    <MessageCircle className="w-6 h-6 mb-1 animate-bounce-short" />
                    {notificationCount > 0 && (
                      <span className="absolute top-0 right-1/4 bg-red-500 text-white text-[8px] font-black w-4 h-4 rounded-full flex items-center justify-center border-2 border-white">
                        {notificationCount}
                      </span>
                    )}
                    <span className="text-[10px] font-bold uppercase tracking-tight text-slate-500">Mensagens</span>
                  </>
                ) : (
                  <>
                    <Bell className="w-6 h-6 mb-1" />
                    {notificationCount > 0 && (
                      <span className="absolute top-0 right-1/4 bg-red-500 text-white text-[8px] font-black w-4 h-4 rounded-full flex items-center justify-center border-2 border-white">
                        {notificationCount}
                      </span>
                    )}
                    <span className="text-[10px] font-bold uppercase tracking-tight">Alertas</span>
                  </>
                )}
              </button>

              {/* Perfil */}
              <button 
                onClick={handleProfileClick}
                className="flex flex-col items-center justify-center flex-1 text-slate-300 hover:text-blue-600 transition-all active:scale-90"
              >
                <User className="w-6 h-6 mb-1" />
                <span className="text-[10px] font-bold uppercase tracking-tight">Perfil</span>
              </button>
            </>
          )}
        </div>
        
        {/* Explorar Text Overlay (Centered below button) */}
        {!isCommunity && (
          <div className="absolute bottom-3 left-0 right-0 pointer-events-none">
             <div className="flex justify-center">
                <span className="text-[10px] font-black text-green-700 uppercase tracking-widest">Explorar</span>
             </div>
          </div>
        )}
      </div>
    </>
  );
};


export default BottomNav;
