
import React, { useState } from 'react';
import { User, Bell, Heart, Home, Briefcase, UserPen, CalendarDays, Receipt, MessageCircle, Users, X, PlaySquare, PlusSquare, LogOut, Film } from 'lucide-react';
import { Language } from '../types';
import { getTranslation } from '../translations';
import { motion, AnimatePresence } from 'motion/react';

interface BottomNavProps {
  onHome: () => void;
  onViewPackage: () => void;
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
}

const BottomNav: React.FC<BottomNavProps> = ({ 
  onHome, 
  onViewPackage, 
  onShowAuth,
  onShowFavorites,
  itemCount, 
  language = 'pt',
  isAuthenticated = false,
  onShowProfile,
  onShowReservations,
  onShowNotifications,
  notificationCount = 0,
  isCommunity = false
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
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-50 pb-safe md:hidden">
        <div className="flex justify-around items-center h-16 px-2">
          {/* Favoritos */}
          <button 
            onClick={onShowFavorites}
            className="flex flex-col items-center justify-center flex-1 text-slate-400 hover:text-red-500 transition-colors"
          >
            <Heart className="w-6 h-6 mb-1" />
            <span className="text-[10px] font-medium">{getTranslation(currentLang, 'nav_favs')}</span>
          </button>
          
          {/* Pacote / Reels */}
          <button 
            onClick={onViewPackage}
            className="flex flex-col items-center justify-center flex-1 text-slate-400 hover:text-blue-600 transition-colors relative"
          >
            <div className="relative">
              {isCommunity ? <Film className="w-6 h-6 mb-1" /> : <Briefcase className="w-6 h-6 mb-1" />}
              {!isCommunity && itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-white animate-in zoom-in">
                  {itemCount}
                </span>
              )}
            </div>
            <span className="text-[10px] font-medium">{isCommunity ? 'Reels' : getTranslation(currentLang, 'nav_package')}</span>
          </button>

          <button 
            onClick={onHome}
            className="flex flex-col items-center justify-center flex-1 -mt-8"
          >
            <div className={`w-14 h-14 rounded-full shadow-[0_8px_20px_rgba(37,99,235,0.2)] flex items-center justify-center border-4 transition-all duration-300 ${isCommunity ? 'bg-white border-rose-500 text-rose-500 hover:scale-110' : 'bg-white border-blue-600 text-blue-600 hover:scale-110'}`}>
              {isCommunity ? <LogOut className="w-7 h-7" /> : <Home className="w-7 h-7" />}
            </div>
            <span className={`text-[10px] font-bold mt-1 uppercase tracking-wider ${isCommunity ? 'text-rose-500' : 'text-blue-600'}`}>
              {isCommunity ? 'Sair' : getTranslation(currentLang, 'nav_home')}
            </span>
          </button>

          {/* Notificações */}
          <button 
            onClick={onShowNotifications}
            className="flex flex-col items-center justify-center flex-1 text-slate-400 hover:text-blue-600 transition-colors relative"
          >
            <div className="relative">
              <Bell className="w-6 h-6 mb-1" />
              {notificationCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-white animate-pulse">
                  {notificationCount}
                </span>
              )}
            </div>
            <span className="text-[10px] font-medium">{getTranslation(currentLang, 'nav_alerts')}</span>
          </button>



          {/* Perfil / Publicar */}
          <button 
            onClick={handleProfileClick}
            className="flex flex-col items-center justify-center flex-1 transition-colors text-slate-400 hover:text-blue-600"
          >
            <div className="w-7 h-7 rounded-full flex items-center justify-center overflow-hidden border transition-all bg-slate-200 border-slate-300">
               {isCommunity ? <PlusSquare className="w-5 h-5 text-slate-500" /> : <User className="w-5 h-5 text-slate-500" />}
            </div>
            <span className="text-[10px] font-medium mt-1">{isCommunity ? 'Publicar' : getTranslation(currentLang, 'nav_profile')}</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default BottomNav;
