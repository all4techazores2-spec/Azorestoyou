
import React, { useState, useEffect } from 'react';
import { COLORS } from '../constants';
import AzoresLogo from './AzoresLogo';
import { LogIn } from 'lucide-react';
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
  },
  en: {
    subtitle: 'Your dream trip starts here.',
    login: 'Login',
    explore: 'Explore Azores "Free"',
  },
  es: {
    subtitle: 'Tu viaje soñado comienza aquí.',
    login: 'Iniciar Sesión',
    explore: 'Explorar Azores "Gratis"',
  },
  it: {
    subtitle: 'Il viaggio dei tuoi sogni inizia qui.',
    login: 'Accedi',
    explore: 'Esplora Azzorre "Gratis"',
  },
  de: {
    subtitle: 'Ihre Traumreise beginnt hier.',
    login: 'Anmelden',
    explore: 'Azoren entdecken "Gratis"',
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
