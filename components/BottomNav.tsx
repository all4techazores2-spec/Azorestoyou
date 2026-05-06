
import React, { useState } from 'react';
import { User, Bell, Heart, Home, Briefcase, UserPen, CalendarDays, Receipt, MessageCircle, Users, X, PlaySquare, PlusSquare, LogOut, Film, Compass } from 'lucide-react';
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
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 shadow-[0_-8px_30px_rgba(0,0,0,0.08)] z-50 pb-safe">
        <div className="flex justify-around items-center h-20 px-2 relative">
          {/* Favoritos */}
          <button 
            onClick={onShowFavorites}
            className="flex flex-col items-center justify-center flex-1 text-slate-300 hover:text-blue-600 transition-all active:scale-90"
          >
            <Heart className="w-6 h-6 mb-1" />
            <span className="text-[10px] font-bold uppercase tracking-tight">Favoritos</span>
          </button>
          
          {/* Pacote */}
          <button 
            onClick={onViewPackage}
            className="flex flex-col items-center justify-center flex-1 text-slate-300 hover:text-blue-600 transition-all active:scale-90 relative"
          >
            <Briefcase className="w-6 h-6 mb-1" />
            {itemCount > 0 && (
              <span className="absolute top-0 right-1/4 bg-blue-600 text-white text-[8px] font-black w-4 h-4 rounded-full flex items-center justify-center border-2 border-white">
                {itemCount}
              </span>
            )}
            <span className="text-[10px] font-bold uppercase tracking-tight">Pacote</span>
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

          {/* Alertas */}
          <button 
            onClick={onShowNotifications}
            className="flex flex-col items-center justify-center flex-1 text-slate-300 hover:text-blue-600 transition-all active:scale-90 relative"
          >
            <Bell className="w-6 h-6 mb-1" />
            {notificationCount > 0 && (
              <span className="absolute top-0 right-1/4 bg-red-500 text-white text-[8px] font-black w-4 h-4 rounded-full flex items-center justify-center border-2 border-white">
                {notificationCount}
              </span>
            )}
            <span className="text-[10px] font-bold uppercase tracking-tight">Alertas</span>
          </button>

          {/* Perfil */}
          <button 
            onClick={handleProfileClick}
            className="flex flex-col items-center justify-center flex-1 text-slate-300 hover:text-blue-600 transition-all active:scale-90"
          >
            <User className="w-6 h-6 mb-1" />
            <span className="text-[10px] font-bold uppercase tracking-tight">Perfil</span>
          </button>
        </div>
        
        {/* Explorar Text Overlay (Centered below button) */}
        <div className="absolute bottom-3 left-0 right-0 pointer-events-none">
           <div className="flex justify-center">
              <span className="text-[10px] font-black text-green-700 uppercase tracking-widest">Explorar</span>
           </div>
        </div>
      </div>
    </>
  );
};

export default BottomNav;
