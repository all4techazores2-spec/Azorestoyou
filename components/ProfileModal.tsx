
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
    nif?: string;
    reservations?: any[];
  };
  onUpdateProfile: (update: { name: string; email: string; phone: string; avatar: string; nif?: string; password?: string }) => void;
  onLogout?: () => void;
  onShowSOS?: () => void;
  onShowCommunity?: () => void;
}

type ProfileView = 'menu' | 'edit' | 'reservations';



const ProfileModal: React.FC<ProfileModalProps> = ({ 
  isOpen, 
  onClose, 
  language, 
  userCredits, 
  userProfile, 
  onUpdateProfile,
  onLogout,
  onShowSOS,
  onShowCommunity
}) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [view, setView] = useState<ProfileView>('menu');
  const [name, setName] = useState(userProfile?.name || '');
  const [email, setEmail] = useState(userProfile?.email || '');
  const [phone, setPhone] = useState(userProfile?.phone || '');
  const [nif, setNif] = useState(userProfile?.nif || '');
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
    onUpdateProfile({ 
      name, 
      email, 
      phone, 
      avatar, 
      nif, 
      password: newPassword || undefined 
    });
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      setView('menu');
    }, 2000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
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
            {view !== 'menu' && (
              <button onClick={() => setView('menu')} className="p-2 hover:bg-slate-100 rounded-full transition-colors mr-2">
                <ArrowLeft size={20} className="text-slate-400" />
              </button>
            )}
            <h2 className="text-xl font-black text-slate-800 tracking-tight">
              {view === 'edit' ? 'Editar Perfil' : view === 'reservations' ? 'Minhas Reservas' : 'Perfil'}
            </h2>
          </div>
          <button 
            onClick={onClose} 
            className="p-3 bg-white text-slate-800 hover:bg-blue-600 hover:text-white rounded-full transition-all shadow-lg border border-slate-100 group"
          >
            <X size={20} className="group-active:scale-90 transition-transform" />
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
                    onClick={() => setView('reservations')}
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

                  <button 
                    onClick={() => onShowCommunity?.()}
                    className="flex items-center gap-4 w-full p-4 bg-slate-50 hover:bg-slate-100 rounded-[2rem] transition-all group"
                  >
                    <div className="p-3 rounded-2xl bg-rose-500 text-white shadow-lg shadow-rose-500/20 group-hover:scale-110 transition-transform">
                      <Users size={20} />
                    </div>
                    <span className="font-bold text-slate-700">Comunidade AzoresToYou</span>
                  </button>

                  {/* SOS Button inside Profile */}
                  <button 
                    onClick={() => {
                      // Immediate call
                      window.location.href = 'tel:112';
                      // Also open the modal for location info if the app is still open
                      onShowSOS?.();
                    }}
                    className="flex items-center gap-4 w-full p-3 bg-red-600 hover:bg-red-700 rounded-2xl transition-all group shadow-lg shadow-red-100"
                  >
                    <div className="p-2 rounded-xl bg-white text-red-600 shadow-sm group-hover:scale-110 transition-transform animate-pulse">
                      <Lock size={18} fill="currentColor" />
                    </div>
                    <div className="text-left text-white">
                      <span className="font-black text-sm uppercase tracking-tight block leading-none">SOS EMERGÊNCIA</span>
                      <span className="text-[8px] font-bold uppercase opacity-80 tracking-widest">Ligar 112</span>
                    </div>
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
            ) : view === 'reservations' ? (
              <motion.div 
                key="reservations"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                {(userProfile.reservations && userProfile.reservations.length > 0) ? (
                  userProfile.reservations.map((res, idx) => (
                    <div key={idx} className="p-5 bg-slate-50 border border-slate-100 rounded-[2rem] space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-black text-slate-800 text-sm leading-tight">{res.businessName || 'Negócio'}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Ref: {res.id?.slice(-6)}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                          res.status === 'pending' || res.status === 'pendente' ? 'bg-amber-100 text-amber-600' :
                          res.status === 'accepted' || res.status === 'aceite' ? 'bg-emerald-100 text-emerald-600' :
                          res.status === 'finished' ? 'bg-blue-100 text-blue-600' :
                          'bg-red-100 text-red-600'
                        }`}>
                          {res.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 border-t border-slate-200 pt-3">
                        <div className="flex items-center gap-1.5">
                          <Calendar size={12} className="text-slate-400" />
                          <span className="text-xs font-bold text-slate-600">{res.date}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <CheckCircle size={12} className="text-slate-400" />
                          <span className="text-xs font-bold text-slate-600">{res.time}</span>
                        </div>
                        {res.guests && (
                          <div className="flex items-center gap-1.5 ml-auto">
                            <Users size={12} className="text-slate-400" />
                            <span className="text-xs font-bold text-slate-600">{res.guests} Pax</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-12 text-center space-y-4">
                    <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center mx-auto text-slate-200">
                      <Calendar size={40} />
                    </div>
                    <div>
                      <p className="font-black text-slate-800 uppercase tracking-tighter text-lg">Sem reservas</p>
                      <p className="text-slate-400 text-sm font-medium italic">Ainda não tens nenhuma marcação efetuada.</p>
                    </div>
                  </div>
                )}
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
                      <div 
                        className="relative group cursor-pointer"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-blue-50 shadow-lg group-hover:border-blue-200 transition-all">
                          <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
                        </div>
                        <div className="absolute bottom-0 right-0 p-2 bg-blue-600 rounded-full text-white border-4 border-white shadow-md group-hover:scale-110 transition-transform">
                          <Camera size={16} />
                        </div>
                        <input 
                          type="file" 
                          ref={fileInputRef} 
                          className="hidden" 
                          accept="image/*" 
                          onChange={handleFileChange} 
                        />
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
                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Nome Completo</p>
                        <div className="relative">
                          <User className="absolute left-4 top-4 text-slate-400 w-4 h-4" />
                          <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-bold focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Email</p>
                          <div className="relative">
                             <Mail className="absolute left-4 top-4 text-slate-400 w-4 h-4" />
                             <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-bold focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Telemóvel (Opcional)</p>
                          <div className="relative">
                             <Phone className="absolute left-4 top-4 text-slate-400 w-4 h-4" />
                             <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-bold focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">NIF (Opcional)</p>
                          <div className="relative">
                             <CreditCard className="absolute left-4 top-4 text-slate-400 w-4 h-4" />
                             <input type="text" value={nif} onChange={(e) => setNif(e.target.value)} className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-bold focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Nova Password</p>
                          <div className="relative">
                             <Lock className="absolute left-4 top-4 text-slate-400 w-4 h-4" />
                             <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="••••••••" className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-bold focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                          </div>
                        </div>
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
