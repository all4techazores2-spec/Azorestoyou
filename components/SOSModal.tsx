
import React, { useState, useEffect } from 'react';
import { Phone, MapPin, AlertTriangle, ShieldAlert, X, Activity } from 'lucide-react';
import { Language } from '../types';
import { getTranslation } from '../translations';

interface SOSModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

const SOSModal: React.FC<SOSModalProps> = ({ isOpen, onClose, language }) => {
  const [isDetecting, setIsDetecting] = useState(true);
  const [location, setLocation] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(5);
  const [showCallButton, setShowCallButton] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsDetecting(true);
      setCountdown(5);
      setShowCallButton(false);

      // Simulate location detection
      const timer = setTimeout(() => {
        setIsDetecting(false);
        // In a real app, we'd use navigator.geolocation here
        setLocation("Açores, Portugal"); 
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isDetecting && countdown > 0) {
      const timer = setInterval(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (countdown === 0 && !showCallButton) {
      setShowCallButton(true);
    }
  }, [isDetecting, countdown, showCallButton]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-md rounded-[3rem] overflow-hidden shadow-2xl border-4 border-red-500 animate-in zoom-in-95 duration-300">
        <div className="p-8 text-center">
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6 relative">
            <div className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-20"></div>
            <ShieldAlert size={48} className="text-red-600 relative z-10" />
          </div>

          <h2 className="text-4xl font-black text-red-600 uppercase tracking-tighter mb-2">Emergência</h2>
          <p className="text-slate-500 font-bold mb-8 uppercase tracking-widest text-xs">A pedir ajuda imediata...</p>

          <div className="bg-slate-50 p-6 rounded-3xl mb-8 border border-slate-100">
            {isDetecting ? (
              <div className="flex flex-col items-center gap-3">
                <Activity className="text-blue-500 animate-pulse" />
                <span className="text-sm font-black text-slate-700 uppercase tracking-tight">A detetar localização exata...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-3">
                <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center">
                  <MapPin size={20} />
                </div>
                <div className="text-left">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Localização Detetada</span>
                  <span className="text-lg font-black text-slate-800">{location}</span>
                </div>
              </div>
            )}
          </div>

          {!showCallButton ? (
            <div className="mb-4">
              <p className="text-slate-400 text-sm font-bold mb-2">A ligar para o 112 em:</p>
              <span className="text-6xl font-black text-slate-900">{countdown}</span>
            </div>
          ) : (
             <a 
               href="tel:112"
               className="w-full py-6 bg-red-600 text-white rounded-[2rem] font-black text-xl uppercase tracking-widest flex items-center justify-center gap-4 hover:bg-red-700 transition-all shadow-xl shadow-red-200 active:scale-95"
             >
               <Phone fill="currentColor" /> LIGAR 112 AGORA
             </a>
          )}

          <button 
            onClick={onClose}
            className="mt-6 text-slate-400 font-black uppercase text-[10px] tracking-widest hover:text-slate-600 transition-colors"
          >
            CANCELAR CHAMADA
          </button>
        </div>
      </div>
    </div>
  );
};

export default SOSModal;
