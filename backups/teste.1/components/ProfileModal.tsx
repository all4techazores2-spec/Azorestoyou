
import React, { useState } from 'react';
import { X, User, Mail, Phone, Lock, Camera, CheckCircle, ArrowLeft, Calendar, CreditCard, MessageCircle, Users, LogOut } from 'lucide-react';
import { COLORS } from '../constants';
import { getTranslation } from '../translations';
import { Language } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  userCredits: number;
  userProfile: {
    name: string;
    email: string;
    phone: string;
    avatar: string;
  };
  onUpdateProfile: (update: { email: string; phone: string; avatar: string; password?: string }) => void;
  onShowReservations?: () => void;
  onLogout?: () => void;
}

type ProfileView = 'menu' | 'edit';

const ProfileModal: React.FC<ProfileModalProps> = ({ 
  isOpen, 
  onClose, 
  language, 
  userCredits, 
  userProfile, 
  onUpdateProfile,
  onShowReservations,
  onLogout
}) => {
  const [view, setView] = useState<ProfileView>('menu');
  const [email, setEmail] = useState(userProfile?.email || '');
  const [phone, setPhone] = useState(userProfile?.phone || '');
  const [avatar, setAvatar] = useState(userProfile?.avatar || '');
  const [newPassword, setNewPassword] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const avatars = [
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Toby',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Luna',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Milo',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Zoe'
  ];

  const handleSave = () => {
    onUpdateProfile({ email, phone, avatar, password: newPassword || undefined });
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      setView('menu');
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white rounded-[32px] w-full max-w-md overflow-hidden shadow-2xl relative border border-white/20 flex flex-col max-h-[90vh]"
      >
        <div className="p-6 border-b border-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {view === 'edit' && (
              <button onClick={() => setView('menu')} className="p-2 hover:bg-slate-100 rounded-full transition-colors mr-2">
                <ArrowLeft size={20} className="text-slate-400" />
              </button>
            )}
            <h2 className="text-xl font-black text-slate-800 tracking-tight">Perfil</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-full transition-all">
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <AnimatePresence mode="wait">
            {view === 'menu' ? (
              <motion.div 
                key="menu"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-4"
              >
                {/* User Info Header */}
                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-[2rem] border border-slate-100 mb-6">
                  <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white shadow-md">
                    <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="font-black text-slate-800 tracking-tight">{userProfile.name || 'Cliente Viajante'}</p>
                    <div className="flex items-center gap-2 bg-blue-100 px-2 py-0.5 rounded-lg border border-blue-200">
                      <span className="text-[10px] font-black text-blue-700 tracking-tight">{userCredits} CRÉDITOS</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  <button 
                    onClick={() => setView('edit')}
                    className="flex items-center gap-4 w-full p-4 bg-slate-50 hover:bg-slate-100 rounded-[2rem] transition-all group"
                  >
                    <div className="p-3 rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/20 group-hover:scale-110 transition-transform">
                      <User size={20} />
                    </div>
                    <span className="font-bold text-slate-700">Editar Perfil</span>
                  </button>

                  <button 
                    onClick={() => onShowReservations?.()}
                    className="flex items-center gap-4 w-full p-4 bg-slate-50 hover:bg-slate-100 rounded-[2rem] transition-all group"
                  >
                    <div className="p-3 rounded-2xl bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 group-hover:scale-110 transition-transform">
                      <Calendar size={20} />
                    </div>
                    <span className="font-bold text-slate-700">Minhas Reservas</span>
                  </button>

                  <button className="flex items-center gap-4 w-full p-4 bg-slate-50 hover:bg-slate-100 rounded-[2rem] transition-all group">
                    <div className="p-3 rounded-2xl bg-amber-500 text-white shadow-lg shadow-amber-500/20 group-hover:scale-110 transition-transform">
                      <CreditCard size={20} />
                    </div>
                    <span className="font-bold text-slate-700">Faturas</span>
                  </button>

                  <button className="flex items-center gap-4 w-full p-4 bg-slate-50 hover:bg-slate-100 rounded-[2rem] transition-all group">
                    <div className="p-3 rounded-2xl bg-indigo-500 text-white shadow-lg shadow-indigo-500/20 group-hover:scale-110 transition-transform">
                      <MessageCircle size={20} />
                    </div>
                    <span className="font-bold text-slate-700">Mensagens</span>
                  </button>

                  <button className="flex items-center gap-4 w-full p-4 bg-slate-50 hover:bg-slate-100 rounded-[2rem] transition-all group">
                    <div className="p-3 rounded-2xl bg-rose-500 text-white shadow-lg shadow-rose-500/20 group-hover:scale-110 transition-transform">
                      <Users size={20} />
                    </div>
                    <span className="font-bold text-slate-700">Comunidade Azores4You</span>
                  </button>
                </div>

                <div className="pt-8 text-center">
                  <button 
                    onClick={onLogout}
                    className="text-red-500 font-black uppercase text-sm tracking-widest hover:underline"
                  >
                    Sair da Aplicação
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="edit"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                {showSuccess ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="w-16 h-16 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center mb-4">
                      <CheckCircle className="w-8 h-8" />
                    </div>
                    <p className="font-bold text-slate-800">Alterações Guardadas!</p>
                  </div>
                ) : (
                  <>
                    <div className="flex flex-col items-center gap-4 mb-6">
                      <div className="relative group">
                        <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-blue-50 shadow-md">
                          <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
                        </div>
                        <div className="absolute bottom-0 right-0 p-1.5 bg-blue-600 rounded-full text-white border-2 border-white">
                          <Camera size={12} />
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {avatars.map((av, idx) => (
                          <button 
                            key={idx}
                            onClick={() => setAvatar(av)}
                            className={`w-8 h-8 rounded-full overflow-hidden border-2 transition-all ${avatar === av ? 'border-blue-600 scale-110 shadow-md' : 'border-transparent opacity-60'}`}
                          >
                            <img src={av} alt={`Av ${idx}`} className="w-full h-full object-cover" />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Email</p>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-bold" />
                      </div>
                      <div className="space-y-2">
                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Telemóvel</p>
                        <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-bold" />
                      </div>
                    </div>

                    <button 
                      onClick={handleSave}
                      className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-blue-600/20 mt-6"
                    >
                      Guardar Alterações
                    </button>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default ProfileModal;
