
import React, { useState } from 'react';
import { Activity, Language, TourGuide } from '../types';
import { getTranslation } from '../translations';
import { TOUR_GUIDES } from '../constants';
import { X, MapPin, Clock, Ruler, BarChart3, Info, Navigation, Star, Languages, Check, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface TrailModalProps {
  trail: Activity;
  onClose: () => void;
  language: Language;
}

const TrailModal: React.FC<TrailModalProps> = ({ trail, onClose, language }) => {
  const [showGuidePrompt, setShowGuidePrompt] = useState(false);
  const [showGuideList, setShowGuideList] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [isCheckingGuide, setIsCheckingGuide] = useState(false);
  const [guideError, setGuideError] = useState(false);

  const t = (key: string) => getTranslation(language, key as any);

  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty) {
      case 'Fácil': return 'text-emerald-600 bg-emerald-50 border-emerald-100';
      case 'Moderado': return 'text-amber-600 bg-amber-50 border-amber-100';
      case 'Difícil': return 'text-rose-600 bg-rose-50 border-rose-100';
      default: return 'text-slate-600 bg-slate-50 border-slate-100';
    }
  };

  const getDifficultyLabel = (difficulty?: string) => {
    switch (difficulty) {
      case 'Fácil': return t('trail_easy');
      case 'Moderado': return t('trail_moderate');
      case 'Difícil': return t('trail_hard');
      default: return difficulty;
    }
  };

  const handleDirectionsClick = () => {
    setShowGuidePrompt(true);
  };

  const handleGuideResponse = (wantsGuide: boolean) => {
    setShowGuidePrompt(false);
    if (wantsGuide) {
      setShowGuideList(true);
    } else {
      setShowMap(true);
    }
  };

  const handleGuideSelect = (guideId: string) => {
    setIsCheckingGuide(true);
    setGuideError(false);

    // Simulate availability check
    setTimeout(() => {
      setIsCheckingGuide(false);
      
      // Simulation: certain IDs or random check
      if (guideId === 'G1' || Math.random() > 0.7) {
        setGuideError(true);
      } else {
        // Success logic could go here (e.g. open success screen or external link)
        window.open('https://wa.me/351123456789?text=Gostaria%20de%20reservar%20um%20guia%20para%20o%20trilho%20' + trail.title, '_blank');
      }
    }, 1500);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
        >
          {/* Header Image */}
          <div className="relative h-64 md:h-80 shrink-0">
            <img 
              src={trail.image} 
              alt={trail.title} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full text-white transition-colors z-10"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="absolute bottom-6 left-6 right-6">
              <div className="flex items-center gap-2 text-white/90 text-sm font-medium mb-2">
                <MapPin className="w-4 h-4" />
                {trail.island}
              </div>
              <h2 className="text-3xl font-bold text-white">{trail.title}</h2>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 md:p-8 overflow-y-auto">
            {!showGuidePrompt && !showGuideList && !showMap && (
              <>
                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex flex-col items-center text-center">
                    <Ruler className="w-5 h-5 text-blue-500 mb-2" />
                    <span className="text-xs text-slate-400 uppercase font-bold tracking-wider">{t('trail_distance')}</span>
                    <span className="font-bold text-slate-700">{trail.distance || '--'}</span>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex flex-col items-center text-center">
                    <Clock className="w-5 h-5 text-amber-500 mb-2" />
                    <span className="text-xs text-slate-400 uppercase font-bold tracking-wider">{t('trail_duration')}</span>
                    <span className="font-bold text-slate-700">{trail.duration || '--'}</span>
                  </div>
                  <div className={`p-4 rounded-2xl border flex flex-col items-center text-center ${getDifficultyColor(trail.difficulty)}`}>
                    <BarChart3 className="w-5 h-5 mb-2" />
                    <span className="text-xs opacity-70 uppercase font-bold tracking-wider">{t('trail_difficulty')}</span>
                    <span className="font-bold">{getDifficultyLabel(trail.difficulty) || '--'}</span>
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                    <Info className="w-5 h-5 text-blue-500" />
                    {t('trail_info')}
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    {trail.description}
                  </p>
                </div>

                {/* Main Action: Directions */}
                <div className="mt-8">
                  <button 
                    onClick={handleDirectionsClick}
                    className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-bold rounded-2xl shadow-lg shadow-blue-200 transition-all active:scale-[0.98] flex items-center justify-center gap-3"
                  >
                    <Navigation className="w-6 h-6" />
                    {t('trail_directions')}
                  </button>
                </div>
              </>
            )}

            {/* Guide Prompt */}
            {showGuidePrompt && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-8"
              >
                <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Users className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-bold text-slate-800 mb-2">{t('guide_ask_title')}</h3>
                <p className="text-slate-500 mb-10 max-w-sm mx-auto">{t('guide_ask_desc')}</p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button 
                    onClick={() => handleGuideResponse(true)}
                    className="py-4 bg-blue-600 text-white font-bold rounded-2xl shadow-lg shadow-blue-100 hover:bg-blue-700 transition-colors"
                  >
                    {t('guide_yes')}
                  </button>
                  <button 
                    onClick={() => handleGuideResponse(false)}
                    className="py-4 bg-slate-100 text-slate-600 font-bold rounded-2xl hover:bg-slate-200 transition-colors"
                  >
                    {t('guide_no')}
                  </button>
                </div>
              </motion.div>
            )}

            {/* Guide List */}
            {showGuideList && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-slate-800">{t('guide_list_title')}</h3>
                  <button 
                    onClick={() => { setShowGuideList(false); setShowMap(true); }}
                    className="text-sm font-bold text-blue-600 hover:underline"
                  >
                    {t('guide_no')}
                  </button>
                </div>
                
                <div className="space-y-4 relative">
                  <AnimatePresence>
                    {isCheckingGuide && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 z-[10] bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center gap-3 rounded-2xl"
                      >
                        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-[10px] font-black text-slate-800 uppercase tracking-widest">{t('checking_availability')}</p>
                      </motion.div>
                    )}

                    {guideError && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 z-[10] bg-white/95 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center rounded-2xl"
                      >
                        <div className="w-16 h-16 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mb-4">
                          <Check className="w-8 h-8 rotate-45 opacity-40" />
                        </div>
                        <h4 className="font-black text-slate-900 tracking-tight">{t('no_availability')}</h4>
                        <p className="text-xs text-slate-500 mt-1 mb-6">{t('try_another')}</p>
                        <button 
                          onClick={() => setGuideError(false)}
                          className="px-8 py-3 bg-slate-900 text-white rounded-xl font-bold text-[10px] uppercase tracking-widest"
                        >
                          Ok
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {TOUR_GUIDES.map((guide) => (
                    <div 
                      key={guide.id} 
                      onClick={() => handleGuideSelect(guide.id)}
                      className="bg-slate-50 border border-slate-100 p-4 rounded-2xl flex items-center gap-4 hover:border-blue-200 transition-colors group cursor-pointer"
                    >
                      <img src={guide.image} alt={guide.name} className="w-16 h-16 rounded-xl object-cover shadow-sm" />
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <h4 className="font-bold text-slate-800">{guide.name}</h4>
                          <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                            <Star className="w-3 h-3 fill-current" />
                            {guide.rating}
                          </div>
                        </div>
                        <p className="text-xs text-slate-500 mb-2">{guide.specialty}</p>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1 text-[10px] text-slate-400 font-medium">
                            <Languages className="w-3 h-3" />
                            {guide.languages.join(', ')}
                          </div>
                          <div className="text-xs font-bold text-blue-600">
                            €{guide.price} <span className="text-[10px] text-slate-400 font-normal">{t('guide_per_person')}</span>
                          </div>
                        </div>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-300 group-hover:border-blue-500 group-hover:text-blue-500 transition-all">
                        <Check className="w-4 h-4" />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Map Placeholder */}
            {showMap && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-slate-800">{t('trail_directions')}</h3>
                  <button 
                    onClick={() => setShowMap(false)}
                    className="text-sm font-bold text-blue-600 hover:underline"
                  >
                    {t('nav_back_home')}
                  </button>
                </div>
                
                <div className="aspect-video bg-slate-200 rounded-3xl overflow-hidden relative group">
                  <img 
                    src={`https://picsum.photos/seed/${trail.id}/800/450?grayscale&blur=2`} 
                    className="w-full h-full object-cover opacity-50"
                    alt="Map Placeholder"
                  />
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                    <div className="w-16 h-16 bg-white rounded-full shadow-xl flex items-center justify-center text-blue-600 mb-4 group-hover:scale-110 transition-transform">
                      <Navigation className="w-8 h-8" />
                    </div>
                    <p className="text-slate-600 font-bold mb-2">Google Maps / OpenStreetMap</p>
                    <p className="text-xs text-slate-400 max-w-xs">A carregar o percurso detalhado para {trail.title}...</p>
                  </div>
                  
                  {/* Mock Trail Line */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 800 450">
                    <path 
                      d="M 100 350 Q 200 100 400 225 T 700 100" 
                      fill="none" 
                      stroke="#2563eb" 
                      strokeWidth="4" 
                      strokeDasharray="8 8"
                      className="animate-[dash_20s_linear_infinite]"
                    />
                  </svg>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100 flex items-start gap-3">
                  <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                  <p className="text-xs text-blue-700 leading-relaxed">
                    Siga as marcações oficiais no terreno. Em caso de emergência, contacte o 112. Descarregue o mapa offline antes de iniciar.
                  </p>
                </div>
              </motion.div>
            )}

            {/* Footer Action */}
            <div className="mt-8 pt-8 border-t border-slate-100">
              <button 
                className="w-full py-4 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-2xl transition-all active:scale-[0.98]"
                onClick={onClose}
              >
                {t('nav_back_home')}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default TrailModal;
