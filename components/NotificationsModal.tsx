
import React from 'react';
import { X, Bell, Calendar, Clock, ArrowRight, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Language } from '../types';
import { getTranslation } from '../translations';

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'reservation_accepted' | 'reservation_pending' | 'promo' | 'info';
  read: boolean;
  relatedId?: string;
}

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: AppNotification[];
  onMarkAsRead: (id: string) => void;
  onClearAll: () => void;
  language: Language;
}

const NotificationsModal: React.FC<NotificationsModalProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAsRead,
  onClearAll,
  language
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-6 bg-slate-900/60 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[85vh] border border-white/20"
      >
        {/* Header */}
        <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-600/30">
              <Bell size={24} />
            </div>
            <div className="text-left">
              <h2 className="text-xl font-black text-slate-800 tracking-tight">Alertas & Notificações</h2>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Acompanhe as suas reservas</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-3 bg-white text-slate-800 hover:bg-blue-600 hover:text-white rounded-full transition-all shadow-lg border border-slate-100 group"
          >
            <X size={20} className="group-active:scale-90 transition-transform" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
          {notifications.length > 0 ? (
            <AnimatePresence>
              {notifications.map((notif) => (
                <motion.div
                  key={notif.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`p-6 rounded-[2rem] border transition-all relative ${
                    notif.read ? 'bg-white border-slate-100' : 'bg-blue-50/50 border-blue-100 ring-1 ring-blue-50'
                  }`}
                  onClick={() => onMarkAsRead(notif.id)}
                >
                  {!notif.read && (
                    <div className="absolute top-6 right-6 w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
                  )}
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      notif.type === 'reservation_accepted' ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-100 text-blue-600'
                    }`}>
                      {notif.type === 'reservation_accepted' ? <Calendar size={20} /> : <Clock size={20} />}
                    </div>
                    <div className="text-left flex-1">
                      <h3 className="font-black text-slate-800 text-sm mb-1">{notif.title}</h3>
                      <p className="text-slate-500 text-xs leading-relaxed mb-3">{notif.message}</p>
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{notif.time}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          ) : (
            <div className="py-20 text-center">
              <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-6 text-slate-200">
                <Bell size={40} />
              </div>
              <h3 className="text-lg font-black text-slate-800 mb-2">Tudo em dia!</h3>
              <p className="text-sm text-slate-400 font-bold max-w-[200px] mx-auto">Não tem notificações pendentes neste momento.</p>
            </div>
          )}
        </div>

        {/* Footer */}
        {notifications.length > 0 && (
          <div className="p-6 border-t border-slate-100 bg-slate-50/50">
            <button 
              onClick={onClearAll}
              className="w-full py-4 bg-white border border-slate-200 rounded-2xl text-xs font-black text-red-500 uppercase tracking-widest hover:bg-red-50 hover:border-red-100 transition-all flex items-center justify-center gap-2"
            >
              <Trash2 size={16} /> Limpar Tudo
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default NotificationsModal;
