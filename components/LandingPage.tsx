
import React, { useState, useEffect } from 'react';
import { COLORS } from '../constants';
import AzoresLogo from './AzoresLogo';
import { LogIn, Download, Smartphone } from 'lucide-react';
import AuthModal from './AuthModal';
import { Language, Restaurant } from '../types';

interface LandingPageProps {
  onEnterBooking: (isAdmin?: boolean, businessId?: string) => void;
  onEnterExplore: () => void;
  onAuthSuccess: (isAdmin?: boolean, businessId?: string, email?: string, role?: string) => void;
  currentLanguage: Language;
  onLanguageChange: (lang: Language) => void;
  restaurants: Restaurant[];
  shops: Restaurant[];
  beauty: Restaurant[];
}

const translations = {
  pt: {
    subtitle: 'A sua viagem de sonho começa aqui.',
    login: 'Login',
    explore: 'Explorar os Açores "Grátis"',
    offline: 'Descarregar App',
    ios_instructions: 'Para instalar no iPhone:\n1. Toque no botão Partilhar (quadrado com seta)\n2. Escolha "Ecrã Principal"'
  },
  en: {
    subtitle: 'Your dream trip starts here.',
    login: 'Login',
    explore: 'Explore Azores "Free"',
    offline: 'Download App',
    ios_instructions: 'To install on iPhone:\n1. Tap the Share button (square with arrow)\n2. Select "Add to Home Screen"'
  },
  es: {
    subtitle: 'Tu viaje soñado comienza aquí.',
    login: 'Iniciar Sesión',
    explore: 'Explorar Azores "Gratis"',
    offline: 'Descargar App',
    ios_instructions: 'Para instalar en iPhone:\n1. Toca el botón Compartir (cuadrado con flecha)\n2. Elige "Añadir a la pantalla de inicio"'
  },
  it: {
    subtitle: 'Il viaggio dei tuoi sogni inizia aqui.',
    login: 'Accedi',
    explore: 'Esplora Azzorre "Gratis"',
    offline: 'Scarica App',
    ios_instructions: 'Per installare su iPhone:\n1. Tocca il pulsante Condividi (quadrato con freccia)\n2. Scegli "Aggiungi alla schermata home"'
  },
  de: {
    subtitle: 'Ihre Traumreise beginnt hier.',
    login: 'Anmelden',
    explore: 'Azoren entdecken "Gratis"',
    offline: 'App Herunterladen',
    ios_instructions: 'Auf iPhone installieren:\n1. Tippen Sie auf die Teilen-Schaltfläche\n2. Wählen Sie "Zum Home-Bildschirm"'
  }
};

const languageOptions: { code: Language; country: string; label: string }[] = [
  { code: 'pt', country: 'pt', label: 'Português' },
  { code: 'en', country: 'gb', label: 'English' },
  { code: 'es', country: 'es', label: 'Español' },
  { code: 'it', country: 'it', label: 'Italiano' },
  { code: 'de', country: 'de', label: 'Deutsch' },
];

const LandingPage: React.FC<LandingPageProps> = ({ onEnterBooking, onEnterExplore, onAuthSuccess, currentLanguage, onLanguageChange, restaurants, shops, beauty }) => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const handleBeforeInstall = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  const handleInstall = async () => {
    const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
    const isIOS = /iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream;
    const isAndroid = /android/i.test(userAgent);

    if (isIOS) {
      alert(translations[currentLanguage].ios_instructions);
      return;
    }

    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
      }
    } else if (isAndroid) {
      alert('Para instalar no Android:\n1. Toque nos 3 pontos do Chrome\n2. Escolha "Instalar App" ou "Adicionar ao Ecrã Principal"');
    } else {
      alert('Esta App pode ser instalada diretamente no seu ecrã através das opções do seu navegador.');
    }
  };

  const t = translations[currentLanguage];

  return (
    <div className="min-h-screen relative flex flex-col bg-white overflow-hidden">
      {/* Background Video (Mobile & Tablet) */}
      <video 
        autoPlay 
        muted 
        loop 
        playsInline 
        className="absolute inset-0 w-full h-full object-cover lg:hidden z-0"
      >
        <source src="/teste.mp4" type="video/mp4" />
      </video>

      {/* Camada preta semitransparente (mobile & tablet) */}
      <div className="absolute inset-0 bg-black/40 lg:hidden z-0"></div>

      {/* Main Content */}
      <div className={`relative z-10 flex-1 flex flex-col items-center justify-center p-6 text-center space-y-8 animate-in fade-in zoom-in duration-700 ${showAuthModal ? 'blur-sm brightness-50' : ''} transition-all`}>
        
        <div className="mb-4">
          <div className="mx-auto flex items-center justify-center w-20 h-20 rounded-full bg-white shadow-2xl mb-4 border-4 border-blue-600 overflow-hidden">
            <AzoresLogo size={60} />
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-white lg:text-slate-900 tracking-tight drop-shadow-lg lg:drop-shadow-none">
            Azores<span className="text-green-400 lg:text-green-600">Toyou</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-100 lg:text-slate-600 mt-2 font-medium tracking-wide drop-shadow-md lg:drop-shadow-none">
            {t.subtitle}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="w-full max-w-sm space-y-4">
          {/* Login Button */}
          <button 
            onClick={() => setShowAuthModal(true)}
            className="w-full py-4 rounded-xl font-bold text-lg shadow-xl hover:scale-105 transition-transform flex items-center justify-center gap-2 group"
            style={{ backgroundColor: COLORS.primary, color: 'white' }}
          >
            <LogIn className="w-5 h-5" />
            {t.login}
          </button>

          {/* Explore Button */}
          <button 
            onClick={onEnterExplore}
            className="w-full py-4 rounded-xl font-bold text-lg shadow-lg bg-white border-2 border-slate-200 text-slate-800 hover:bg-slate-50 hover:scale-105 transition-all"
          >
            {t.explore}
          </button>

          {/* Offline Download Button */}
          <div className="flex justify-center pt-2">
            <button 
              onClick={handleInstall}
              className="px-6 py-2.5 rounded-full font-black text-xs shadow-md bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:scale-105 transition-all flex items-center gap-2 border-b-2 border-blue-800 uppercase tracking-widest"
            >
              <Download className="w-3.5 h-3.5 animate-bounce" />
              {t.offline}
            </button>
          </div>
        </div>

        {/* Language Selector (Modern Flags) */}
        <div className="pt-8">
           <div className="bg-slate-100 p-2 rounded-2xl inline-flex items-center border border-slate-200 gap-3 flex-wrap justify-center hover:bg-slate-200 transition-colors">
            {languageOptions.map((opt) => (
              <button 
                key={opt.code}
                onClick={() => onLanguageChange(opt.code)}
                className={`w-10 h-10 rounded-full overflow-hidden transition-all transform hover:scale-110 border-2 ${currentLanguage === opt.code ? 'border-blue-600 ring-2 ring-blue-100 scale-110 shadow-lg' : 'border-transparent opacity-80 hover:opacity-100'}`}
                title={opt.label}
              >
                <img 
                  src={`https://flagcdn.com/w80/${opt.country}.png`}
                  srcSet={`https://flagcdn.com/w160/${opt.country}.png 2x`}
                  alt={opt.label}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Footer / Disclaimer */}
      <div className={`relative z-10 p-6 text-center ${showAuthModal ? 'blur-sm' : ''}`}>
        <p className="text-xs text-white lg:text-slate-400 font-medium drop-shadow-sm lg:drop-shadow-none">© 2025 BionicID. All rights reserved.</p>
      </div>

      {/* Reusable Auth Modal */}
      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={(isAdmin, businessId, email, role) => {
          setShowAuthModal(false);
          onAuthSuccess(isAdmin, businessId, email, role);
        }}
        onGuest={() => {
          setShowAuthModal(false);
          onEnterBooking(); // Guest is never admin
        }}
        restaurants={restaurants}
        shops={shops}
        beauty={beauty}
        language={currentLanguage}
      />
    </div>
  );
};

export default LandingPage;
