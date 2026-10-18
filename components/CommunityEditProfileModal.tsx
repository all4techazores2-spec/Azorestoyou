import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, Camera, Check, AlertCircle, Sparkles, MapPin, Globe, 
  Lock, Eye, Shield, Loader2, ArrowLeft, RefreshCw
} from 'lucide-react';
import { SocialProfile } from '../types';
import { API_BASE_URL } from '../config';

interface CommunityEditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: SocialProfile | null;
  onSaveProfile: (updated: Partial<SocialProfile>) => Promise<boolean>;
}

const AZORES_ISLANDS = [
  'São Miguel', 'Santa Maria', 'Terceira', 'Graciosa', 
  'São Jorge', 'Pico', 'Faial', 'Flores', 'Corvo', 'Diáspora Açoriana'
];

const AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka'
];

const CommunityEditProfileModal: React.FC<CommunityEditProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  onSaveProfile
}) => {
  if (!isOpen || !profile) return null;

  const [name, setName] = useState(profile.name || '');
  const [handleSlug, setHandleSlug] = useState(
    profile.handle.replace('@azorestoyou_', '').replace('@', '')
  );
  const [bio, setBio] = useState(profile.bio || '');
  const [avatar, setAvatar] = useState(profile.avatar || '');
  const [island, setIsland] = useState(profile.island || 'São Miguel');
  const [location, setLocation] = useState(profile.location || 'São Miguel, Açores');
  const [website, setWebsite] = useState(profile.website || '');
  const [isPrivate, setIsPrivate] = useState(!!profile.isPrivate);
  const [allowDiscovery, setAllowDiscovery] = useState(profile.allowDiscovery !== false);

  // Handle availability check state
  const [checkingHandle, setCheckingHandle] = useState(false);
  const [handleAvailable, setHandleAvailable] = useState<boolean | null>(true);
  const [handleSuggestions, setHandleSuggestions] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Sanitize handle slug
  const handleSlugChange = (raw: string) => {
    let cleaned = raw.toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9_]/g, '_')
      .replace(/_+/g, '_');
    if (cleaned.length > 25) cleaned = cleaned.substring(0, 25);
    setHandleSlug(cleaned);
  };

  // Debounced check for handle availability
  useEffect(() => {
    const originalSlug = profile.handle.replace('@azorestoyou_', '').replace('@', '');
    if (handleSlug === originalSlug) {
      setHandleAvailable(true);
      setHandleSuggestions([]);
      return;
    }

    if (handleSlug.length < 3) {
      setHandleAvailable(false);
      setHandleSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      setCheckingHandle(true);
      try {
        const fullHandle = `@azorestoyou_${handleSlug}`;
        const res = await fetch(
          `${API_BASE_URL}/api/community/check-handle?handle=${encodeURIComponent(fullHandle)}&email=${encodeURIComponent(profile.email)}`
        );
        if (res.ok) {
          const data = await res.json();
          setHandleAvailable(data.available);
          setHandleSuggestions(data.suggestions || []);
        }
      } catch (err) {
        console.error("Erro ao validar identificador:", err);
      } finally {
        setCheckingHandle(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [handleSlug, profile.handle, profile.email]);

  const handleSave = async () => {
    if (handleAvailable === false || handleSlug.length < 3) return;
    setIsSaving(true);
    const fullHandle = `@azorestoyou_${handleSlug}`;

    const ok = await onSaveProfile({
      name: name.trim(),
      handle: fullHandle,
      bio: bio.trim(),
      avatar,
      island,
      location: location.trim(),
      website: website.trim(),
      isPrivate,
      allowDiscovery
    });

    setIsSaving(false);
    if (ok) {
      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
        onClose();
      }, 1000);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setAvatar(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 z-[250] flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-md">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="w-full max-w-lg bg-white rounded-[2rem] shadow-2xl overflow-hidden flex flex-col max-h-[92vh] border border-slate-100"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <button 
              onClick={onClose} 
              className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500"
            >
              <ArrowLeft size={18} />
            </button>
            <h3 className="text-base font-black text-slate-800 tracking-tight">Editar Perfil Social</h3>
          </div>
          <button 
            disabled={isSaving || handleAvailable === false}
            onClick={handleSave}
            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1.5 ${
              isSaving || handleAvailable === false
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20 active:scale-95'
            }`}
          >
            {isSaving ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
            <span>Guardar</span>
          </button>
        </div>

        {/* Form Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {saveSuccess && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }} 
              animate={{ opacity: 1, y: 0 }}
              className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-bold flex items-center gap-2"
            >
              <Check size={16} className="text-emerald-600" />
              <span>Perfil atualizado com sucesso na Comunidade Azorestoyou!</span>
            </motion.div>
          )}

          {/* Avatar Section */}
          <div className="flex flex-col items-center gap-3">
            <div className="relative group">
              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-emerald-100 shadow-md bg-slate-50">
                <img src={avatar} alt={name} className="w-full h-full object-cover" />
              </div>
              <label 
                htmlFor="avatar-upload-file" 
                className="absolute bottom-0 right-0 p-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full shadow-lg border-2 border-white cursor-pointer active:scale-95 transition-all"
                title="Alterar Fotografia"
              >
                <Camera size={15} />
              </label>
              <input 
                type="file" 
                id="avatar-upload-file" 
                accept="image/*" 
                className="hidden" 
                onChange={handleFileUpload}
              />
            </div>

            {/* Quick avatar presets */}
            <div className="flex items-center gap-1.5 pt-1">
              {AVATAR_PRESETS.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setAvatar(preset)}
                  className={`w-7 h-7 rounded-full overflow-hidden border-2 transition-all ${
                    avatar === preset ? 'border-emerald-600 scale-110 shadow-sm' : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={preset} alt="preset" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
            <p className="text-[10px] font-bold text-slate-400">Toque na câmara para carregar do seu dispositivo</p>
          </div>

          {/* Nome Público */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-black uppercase tracking-wider text-slate-400">
              Nome Público
            </label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="O seu nome visível"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
            />
          </div>

          {/* Identificador @azorestoyou_ */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-black uppercase tracking-wider text-slate-400">
                Identificador Oficial
              </label>
              {checkingHandle ? (
                <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                  <Loader2 size={10} className="animate-spin" /> A verificar...
                </span>
              ) : handleAvailable === true ? (
                <span className="text-[10px] font-black text-emerald-600 flex items-center gap-1">
                  <Check size={12} /> Disponível
                </span>
              ) : handleAvailable === false ? (
                <span className="text-[10px] font-black text-rose-500 flex items-center gap-1">
                  <AlertCircle size={12} /> Não disponível
                </span>
              ) : null}
            </div>

            <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 focus-within:ring-2 focus-within:ring-emerald-500 transition-all">
              <span className="text-xs font-black text-emerald-700 select-none">@azorestoyou_</span>
              <input 
                type="text" 
                value={handleSlug}
                onChange={(e) => handleSlugChange(e.target.value)}
                placeholder="nome"
                className="w-full bg-transparent text-xs font-bold text-slate-800 focus:outline-none pl-0.5"
              />
            </div>

            {/* Suggestions if handle taken */}
            {handleSuggestions.length > 0 && (
              <div className="space-y-1 pt-1">
                <span className="text-[10px] font-bold text-slate-400">Sugestões disponíveis:</span>
                <div className="flex flex-wrap gap-1.5">
                  {handleSuggestions.map((sug, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setHandleSlug(sug.replace('@azorestoyou_', ''))}
                      className="text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-lg hover:bg-emerald-100 transition-colors"
                    >
                      {sug}
                    </button>
                  ))}
                </div>
              </div>
            )}
            <p className="text-[9px] font-medium text-slate-400 leading-tight">
              O prefixo <strong>@azorestoyou_</strong> é a garantia de identidade oficial da Comunidade. Apenas letras minúsculas, números e sublinhados.
            </p>
          </div>

          {/* Biografia */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-[11px] font-black uppercase tracking-wider text-slate-400">
                Biografia
              </label>
              <span className="text-[9px] font-bold text-slate-400">{bio.length}/150</span>
            </div>
            <textarea 
              rows={3}
              maxLength={150}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Partilhe a sua paixão pelos Açores, interesses ou detalhes da sua viagem..."
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all resize-none"
            />
          </div>

          {/* Ilha e Localização */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-[11px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <MapPin size={12} /> Ilha
              </label>
              <select 
                value={island}
                onChange={(e) => setIsland(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {AZORES_ISLANDS.map(isl => (
                  <option key={isl} value={isl}>{isl}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-black uppercase tracking-wider text-slate-400">
                Localização / Freguesia
              </label>
              <input 
                type="text" 
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Ex: Ponta Delgada, São Miguel"
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Website / Redes */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1">
              <Globe size={12} /> Website ou Link Pessoal
            </label>
            <input 
              type="url" 
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              placeholder="https://..."
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Privacidade e Visibilidade */}
          <div className="pt-2 border-t border-slate-100 space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <Shield size={14} className="text-emerald-600" />
              Privacidade da Conta
            </h4>

            {/* Toggle Perfil Privado */}
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-slate-800 block">Perfil Privado</span>
                <span className="text-[10px] text-slate-400 block">
                  Apenas seguidores aprovados podem ver as tuas publicações completas.
                </span>
              </div>
              <button 
                type="button"
                onClick={() => setIsPrivate(!isPrivate)}
                className={`w-11 h-6 rounded-full transition-colors relative flex items-center px-1 ${
                  isPrivate ? 'bg-emerald-600' : 'bg-slate-300'
                }`}
              >
                <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  isPrivate ? 'translate-x-5' : 'translate-x-0'
                }`} />
              </button>
            </div>

            {/* Toggle Permitir Descoberta */}
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-slate-800 block">Permitir Descoberta</span>
                <span className="text-[10px] text-slate-400 block">
                  Permite que outros membros encontrem o teu perfil através da pesquisa.
                </span>
              </div>
              <button 
                type="button"
                onClick={() => setAllowDiscovery(!allowDiscovery)}
                className={`w-11 h-6 rounded-full transition-colors relative flex items-center px-1 ${
                  allowDiscovery ? 'bg-emerald-600' : 'bg-slate-300'
                }`}
              >
                <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  allowDiscovery ? 'translate-x-5' : 'translate-x-0'
                }`} />
              </button>
            </div>
          </div>

        </div>

      </motion.div>
    </div>
  );
};

export default CommunityEditProfileModal;
