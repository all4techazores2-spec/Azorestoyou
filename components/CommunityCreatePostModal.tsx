import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  ArrowLeft, Image, Video, Users, Building2, MapPin, Hash, 
  Plus, X, Check, Loader2, Sparkles, AlertCircle
} from 'lucide-react';
import { API_BASE_URL } from '../config';
import { SocialProfile } from '../types';

interface CommunityCreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  myProfile: SocialProfile | null;
  onPostCreated: () => void;
  availableBusinesses?: { id: string; name: string; category: string; collection: string; image?: string }[];
}

const SAMPLE_AZORES_LOCATIONS = [
  'Sete Cidades, São Miguel',
  'Lagoa do Fogo, São Miguel',
  'Furnas, São Miguel',
  'Ponta da Ferraria, São Miguel',
  'Nordeste, São Miguel',
  'Angra do Heroísmo, Terceira',
  'Serra do Cume, Terceira',
  'Montanha do Pico, Pico',
  'Caldeira do Faial, Faial',
  'Poço da Ribeira do Ferreiro, Flores'
];

const POPULAR_HASHTAGS = [
  '#Açores', '#SãoMiguel', '#Terceira', '#Pico', '#Faial', 
  '#Trilhos', '#Natureza', '#Gastronomia', '#VidaMarinha', '#Viagem'
];

const CommunityCreatePostModal: React.FC<CommunityCreatePostModalProps> = ({
  isOpen,
  onClose,
  myProfile,
  onPostCreated,
  availableBusinesses = []
}) => {

  const [content, setContent] = useState('');
  const [images, setImages] = useState<string[]>([
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200&auto=format&fit=crop&q=80'
  ]);
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [location, setLocation] = useState('Ponta da Ferraria, São Miguel');
  const [selectedBusiness, setSelectedBusiness] = useState<{ id: string; name: string; category: string; collection: string; image?: string } | null>(null);
  const [hashtags, setHashtags] = useState<string[]>(['#Açores', '#SãoMiguel', '#Natureza']);
  const [shareToStories, setShareToStories] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Sub-drawers / Popovers for configuration items
  const [activeDrawer, setActiveDrawer] = useState<'none' | 'location' | 'business' | 'hashtags'>('none');

  if (!isOpen) return null;

  // Handle uploading photos/videos
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const formData = new FormData();
      formData.append('image', file);

      try {
        const res = await fetch(`${API_BASE_URL}/api/upload?folder=community/posts`, {
          method: 'POST',
          body: formData
        });
        if (res.ok) {
          const data = await res.json();
          if (data.url) {
            setImages(prev => [...prev, data.url]);
          }
        }
      } catch (err) {
        // Fallback local data URL
        const reader = new FileReader();
        reader.onloadend = () => {
          if (typeof reader.result === 'string') {
            setImages(prev => [...prev, reader.result as string]);
          }
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, idx) => idx !== index));
    if (activeImageIdx >= index && activeImageIdx > 0) {
      setActiveImageIdx(activeImageIdx - 1);
    }
  };

  const toggleHashtag = (tag: string) => {
    if (hashtags.includes(tag)) {
      setHashtags(hashtags.filter(t => t !== tag));
    } else {
      setHashtags([...hashtags, tag]);
    }
  };

  const handleSubmit = async () => {
    if (images.length === 0 && !content.trim()) {
      setErrorMsg('Por favor adicione pelo menos uma imagem ou texto à publicação.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const payload = {
        author: myProfile?.name || 'Membro Azorestoyou',
        authorHandle: myProfile?.handle || '@azorestoyou_viajante',
        authorAvatar: myProfile?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=user',
        location: location.trim(),
        content: content.trim(),
        images,
        tags: hashtags.map(t => t.replace('#', '')),
        businessTag: selectedBusiness ? {
          id: selectedBusiness.id,
          name: selectedBusiness.name,
          subtitle: `${selectedBusiness.name} • ${selectedBusiness.category}`,
          category: selectedBusiness.category,
          collection: selectedBusiness.collection,
          image: selectedBusiness.image || images[0],
          actionText: selectedBusiness.collection === 'restaurants' ? 'Reservar mesa' : 'Ver negócio'
        } : undefined
      };

      const res = await fetch(`${API_BASE_URL}/api/community/posts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        onPostCreated();
        onClose();
      } else {
        setErrorMsg('Erro ao publicar. Verifique a sua ligação.');
      }
    } catch (err) {
      console.error('Erro na criação de publicação:', err);
      setErrorMsg('Erro ao ligar ao servidor.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="community-overlay community-composer fixed inset-0 z-[220] flex items-center justify-center bg-white">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 30 }}
        className="w-full max-w-none bg-white h-full   flex flex-col overflow-hidden relative"
      >
        {/* Top App Bar */}
        <header className="px-4 h-14 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
          <button 
            onClick={onClose}
            className="p-2 -ml-1 text-slate-700 hover:bg-slate-100 rounded-full transition-colors active:scale-95"
          >
            <ArrowLeft size={20} />
          </button>
          
          <h2 className="text-base font-semibold text-slate-800 tracking-tight">Nova publicação</h2>

          <button 
            disabled={isSubmitting || (images.length === 0 && !content.trim())}
            onClick={handleSubmit}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold  transition-all flex items-center gap-1.5 ${
              isSubmitting || (images.length === 0 && !content.trim())
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/20 active:scale-95'
            }`}
          >
            {isSubmitting ? <Loader2 size={14} className="animate-spin" /> : null}
            <span>Publicar</span>
          </button>
        </header>

        {/* Content Scroll Container */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl text-xs font-bold flex items-center gap-2">
              <AlertCircle size={16} />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Primary Preview Frame */}
          {images.length > 0 && (
            <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden bg-slate-900 relative shadow-md">
              <img 
                src={images[activeImageIdx] || images[0]} 
                alt="Preview" 
                className="w-full h-full object-cover"
              />
              <button 
                onClick={() => removeImage(activeImageIdx)}
                className="absolute top-3 right-3 p-1.5 bg-black/60 hover:bg-black/80 text-white rounded-full transition-colors backdrop-blur-sm"
                title="Remover fotografia"
              >
                <X size={16} />
              </button>
              <div className="absolute bottom-3 right-3 bg-black/60 text-white text-[10px] font-semibold px-2.5 py-1 rounded-full backdrop-blur-sm">
                {activeImageIdx + 1}/{images.length}
              </div>
            </div>
          )}

          {/* Thumbnail Carousel Strip */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {images.map((imgUrl, i) => (
              <div 
                key={i} 
                onClick={() => setActiveImageIdx(i)}
                className={`w-16 h-16 rounded-xl overflow-hidden shrink-0 border-2 cursor-pointer transition-all ${
                  activeImageIdx === i ? 'border-blue-600 scale-105 shadow-md' : 'border-slate-200 opacity-70'
                }`}
              >
                <img src={imgUrl} alt={`thumb_${i}`} className="w-full h-full object-cover" />
              </div>
            ))}

            {/* Add More Media Button */}
            <label 
              htmlFor="add-extra-media" 
              className="w-16 h-16 rounded-xl border-2 border-dashed border-slate-300 hover:border-blue-500 hover:text-blue-600 flex items-center justify-center shrink-0 cursor-pointer text-slate-400 transition-colors"
              title="Adicionar mais fotos"
            >
              <Plus size={22} />
            </label>
            <input 
              type="file" 
              id="add-extra-media" 
              multiple 
              accept="image/*,video/*" 
              className="hidden" 
              onChange={handleFileUpload} 
            />
          </div>

          {/* Text Description Box */}
          <div className="space-y-1">
            <textarea 
              rows={3}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Escreva uma legenda inspiradora sobre este momento nos Açores..."
              className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none transition-all"
            />
          </div>

          {/* Action List Items (matching mockup tela 2) */}
          <div className="space-y-1 pt-1 border-t border-slate-100">
            
            {/* 1. Adicionar fotos/vídeos */}
            <label 
              htmlFor="add-extra-media" 
              className="flex items-center justify-between p-3.5 hover:bg-slate-50 rounded-2xl cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
                  <Image size={18} />
                </div>
                <span className="text-xs font-bold text-slate-800">Adicionar fotos/vídeos</span>
              </div>
              <span className="text-[10px] font-semibold text-slate-400">{images.length} selecionadas</span>
            </label>

            {/* 2. Identificar negócio */}
            <div 
              onClick={() => setActiveDrawer(activeDrawer === 'business' ? 'none' : 'business')}
              className="flex items-center justify-between p-3.5 hover:bg-slate-50 rounded-2xl cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                  <Building2 size={18} />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-800 block">Identificar negócio</span>
                  {selectedBusiness && (
                    <span className="text-[10px] text-emerald-600 font-bold block">
                      {selectedBusiness.name} ({selectedBusiness.category})
                    </span>
                  )}
                </div>
              </div>
              <span className="text-xs text-slate-400">›</span>
            </div>

            {/* Business selection panel */}
            {activeDrawer === 'business' && (
              <div className="p-3 bg-slate-50 rounded-2xl space-y-2 border border-slate-100">
                <p className="text-[10px] font-semibold uppercase text-slate-400 tracking-wider">
                  Selecione um estabelecimento registado:
                </p>
                <div className="grid grid-cols-1 gap-1.5 max-h-40 overflow-y-auto">
                  {[
                    { id: 'rest_xitaca', name: 'Restaurante Xitaca', category: 'Restaurante', collection: 'restaurants', image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200' },
                    { id: 'act_whale', name: 'Azores Whale Watching', category: 'Atividade', collection: 'activities', image: 'https://images.unsplash.com/photo-1518877593221-1f28583780b4?w=200' },
                    { id: 'hotel_terra_nostra', name: 'Terra Nostra Garden Hotel', category: 'Alojamento', collection: 'hotels', image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200' }
                  ].map(biz => (
                    <button
                      key={biz.id}
                      type="button"
                      onClick={() => { setSelectedBusiness(biz); setActiveDrawer('none'); }}
                      className={`flex items-center justify-between p-2 rounded-xl text-left text-xs font-bold transition-all ${
                        selectedBusiness?.id === biz.id ? 'bg-emerald-600 text-white' : 'bg-white hover:bg-slate-100 text-slate-800 border border-slate-200'
                      }`}
                    >
                      <span>{biz.name}</span>
                      <span className="text-[10px] opacity-80">{biz.category}</span>
                    </button>
                  ))}
                  {selectedBusiness && (
                    <button
                      type="button"
                      onClick={() => setSelectedBusiness(null)}
                      className="text-[10px] font-bold text-rose-500 hover:underline pt-1 text-center"
                    >
                      Remover identificação de negócio
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* 3. Adicionar localização */}
            <div 
              onClick={() => setActiveDrawer(activeDrawer === 'location' ? 'none' : 'location')}
              className="flex items-center justify-between p-3.5 hover:bg-slate-50 rounded-2xl cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
                  <MapPin size={18} />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-800 block">Adicionar localização</span>
                  <span className="text-[10px] text-slate-500 font-medium block">{location}</span>
                </div>
              </div>
              <span className="text-xs text-slate-400">›</span>
            </div>

            {/* Location selector panel */}
            {activeDrawer === 'location' && (
              <div className="p-3 bg-slate-50 rounded-2xl space-y-2 border border-slate-100">
                <input 
                  type="text" 
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Escrever local personalizado..."
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none"
                />
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {SAMPLE_AZORES_LOCATIONS.map(loc => (
                    <button
                      key={loc}
                      type="button"
                      onClick={() => { setLocation(loc); setActiveDrawer('none'); }}
                      className="text-[10px] font-bold bg-white hover:bg-slate-100 border border-slate-200 px-2 py-1 rounded-lg text-slate-700"
                    >
                      {loc}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 4. Adicionar hashtags */}
            <div 
              onClick={() => setActiveDrawer(activeDrawer === 'hashtags' ? 'none' : 'hashtags')}
              className="flex items-center justify-between p-3.5 hover:bg-slate-50 rounded-2xl cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
                  <Hash size={18} />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-800 block">Adicionar hashtags</span>
                  <span className="text-[10px] text-blue-600 font-bold block">{hashtags.join(' ')}</span>
                </div>
              </div>
              <span className="text-xs text-slate-400">›</span>
            </div>

            {/* Hashtag picker */}
            {activeDrawer === 'hashtags' && (
              <div className="p-3 bg-slate-50 rounded-2xl space-y-2 border border-slate-100">
                <div className="flex flex-wrap gap-1.5">
                  {POPULAR_HASHTAGS.map(tag => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleHashtag(tag)}
                      className={`text-[10px] font-semibold px-2.5 py-1 rounded-lg border transition-all ${
                        hashtags.includes(tag)
                          ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 5. Partilhar também nos Stories Toggle */}
            <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl mt-2">
              <span className="text-xs font-bold text-slate-800">Partilhar também nos Stories</span>
              <button 
                type="button"
                onClick={() => setShareToStories(!shareToStories)}
                className={`w-11 h-6 rounded-full transition-colors relative flex items-center px-1 ${
                  shareToStories ? 'bg-blue-600' : 'bg-slate-300'
                }`}
              >
                <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  shareToStories ? 'translate-x-5' : 'translate-x-0'
                }`} />
              </button>
            </div>

          </div>

        </div>

      </motion.div>
    </div>
  );
};

export default CommunityCreatePostModal;
