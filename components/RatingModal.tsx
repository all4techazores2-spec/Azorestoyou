
import React, { useState } from 'react';
import { X, Star, MessageSquare, Send, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Language } from '../types';
import { getTranslation } from '../translations';

interface RatingModalProps {
  isOpen: boolean;
  onClose: () => void;
  restaurantName: string;
  restaurantId: string;
  reservationId: string;
  onSubmit: (data: { rating: number; comment: string; reservationId: string; restaurantId: string }) => void;
  language: Language;
}

const RatingModal: React.FC<RatingModalProps> = ({
  isOpen,
  onClose,
  restaurantName,
  restaurantId,
  reservationId,
  onSubmit,
  language
}) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [hoveredRating, setHoveredRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (rating === 0) return;
    setIsSubmitting(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    onSubmit({
      rating,
      comment,
      reservationId,
      restaurantId
    });
    
    setShowSuccess(true);
    setTimeout(() => {
      onClose();
      setShowSuccess(false);
      setRating(0);
      setComment('');
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl overflow-hidden relative border border-white"
      >
        <AnimatePresence mode="wait">
          {!showSuccess ? (
            <motion.div 
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-8"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="text-left">
                  <h2 className="text-2xl font-black text-slate-800 tracking-tight leading-tight">Como foi a sua<br/>experiência?</h2>
                  <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mt-2">{restaurantName}</p>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-full text-slate-400">
                  <X size={20} />
                </button>
              </div>

              {/* Stars */}
              <div className="flex justify-center gap-3 mb-8">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    onClick={() => setRating(star)}
                    className="transition-all transform hover:scale-125 active:scale-95"
                  >
                    <Star
                      size={40}
                      className={`${
                        (hoveredRating || rating) >= star ? 'fill-yellow-400 text-yellow-400' : 'text-slate-200'
                      } transition-colors`}
                    />
                  </button>
                ))}
              </div>

              {/* Comment */}
              <div className="relative mb-8">
                <div className="absolute top-4 left-4 text-slate-400">
                  <MessageSquare size={20} />
                </div>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Conte-nos o que mais gostou..."
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[120px] transition-all"
                />
              </div>

              <button
                disabled={rating === 0 || isSubmitting}
                onClick={handleSubmit}
                className={`w-full py-5 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 transition-all ${
                  rating > 0 && !isSubmitting ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/30 hover:scale-105 active:scale-95' : 'bg-slate-100 text-slate-300 cursor-not-allowed'
                }`}
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    Enviar Avaliação <Send size={18} />
                  </>
                )}
              </button>
            </motion.div>
          ) : (
            <motion.div 
              key="success"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-12 text-center"
            >
              <div className="w-24 h-24 bg-emerald-50 text-emerald-600 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 shadow-xl shadow-emerald-100 animate-bounce">
                <CheckCircle size={48} />
              </div>
              <h3 className="text-2xl font-black text-slate-800 mb-2">Obrigado!</h3>
              <p className="text-slate-500 font-bold leading-relaxed">A sua avaliação foi enviada com sucesso ao restaurante.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default RatingModal;
