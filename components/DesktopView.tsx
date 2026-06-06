
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, Map, Heart, User, ChevronDown, ChevronLeft, ChevronRight, Play, 
  Utensils, Bus, Car, Tent, LayoutGrid, Mountain, 
  Facebook, Instagram, Youtube, Send, ArrowRight,
  ShieldCheck, Globe, Clock, Tag, CreditCard, Apple
} from 'lucide-react';
import AzoresLogo from './AzoresLogo';
import { Language } from '../types';

interface DesktopViewProps {
  language: Language;
  onNavigate: (category: any) => void;
  onShowAuth: () => void;
  onShowFavorites: () => void;
  onShowProfile: () => void;
  onOpenIslandSelection: () => void;
  isAuthenticated: boolean;
  userProfile?: any;
}

export const DesktopHeader: React.FC<DesktopViewProps & { scrolled: boolean }> = ({
  onNavigate,
  onShowAuth,
  onShowFavorites,
  onShowProfile,
  isAuthenticated,
  userProfile,
  scrolled
}) => {
  return (
    <header className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${scrolled ? 'bg-white/90 backdrop-blur-xl shadow-lg py-3' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-8 flex items-center justify-between">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <AzoresLogo size={240} className="drop-shadow-lg" />
          
        </div>

        <nav className="flex items-center gap-10">
          {['Início', 'Viagens', 'Restauração', 'Trilhos', 'Rentacar'].map((item) => (
            <a 
              key={item} 
              href="#" 
              className={`text-sm font-bold uppercase tracking-widest transition-all hover:scale-110 active:scale-95 ${scrolled ? 'text-slate-600 hover:text-green-600' : 'text-white/90 hover:text-white drop-shadow-md'}`}
              onClick={(e) => {
                e.preventDefault();
                if (item === 'Início') onNavigate(null);
                if (item === 'Restauração') onNavigate('restaurants');
                if (item === 'Trilhos') onNavigate('trails');
                if (item === 'Rentacar') onNavigate('rentcar');
                if (item === 'Viagens') onNavigate('flights');
              }}
            >
              {item}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-6">
          <button onClick={onShowFavorites} className={`p-2 rounded-full transition-all hover:bg-white/10 ${scrolled ? 'text-slate-400 hover:text-red-500' : 'text-white drop-shadow-md'}`}>
            <Heart size={24} />
          </button>
          
          <button 
            onClick={isAuthenticated ? onShowProfile : onShowAuth}
            className="flex items-center gap-3 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-green-600/20 active:scale-95"
          >
            <User size={18} />
            {isAuthenticated ? (userProfile?.name?.split(' ')[0] || 'Perfil') : 'Entrar'}
          </button>

          <div className="relative group">
            <button className={`flex items-center gap-2 px-3 py-2 rounded-xl border transition-all ${scrolled ? 'border-slate-200 text-slate-700 bg-slate-50' : 'border-white/30 text-white bg-white/10 backdrop-blur-md'}`}>
              <span className="text-[10px] font-black uppercase tracking-widest">PT</span>
              <ChevronDown size={14} />
            </button>
            <div className="absolute right-0 top-full mt-2 w-40 bg-white rounded-3xl shadow-2xl border border-slate-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 p-2 z-[101]">
              {['Português', 'English', 'Español', 'Français', 'Deutsch'].map((l) => (
                <button key={l} className="w-full text-left px-4 py-3 text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 hover:text-green-600 rounded-2xl transition-colors">
                  {l}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export const DesktopFooter: React.FC = () => {
  return (
    <footer className="bg-slate-900 pt-24 pb-12 text-white">
      <div className="max-w-7xl mx-auto px-8 grid grid-cols-12 gap-12 mb-24">
        <div className="col-span-4">
          <div className="flex items-center gap-3 mb-8">
            <AzoresLogo size={280} />
          </div>
          <p className="text-slate-400 text-sm leading-relaxed mb-10 max-w-sm">
            O seu guia completo para descobrir as maravilhas dos Açores. Natureza, aventura e experiências inesquecíveis esperam por si.
          </p>
          <div className="flex gap-4">
            {[Facebook, Instagram, Youtube, Send].map((Icon, i) => (
              <button key={i} className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center hover:bg-green-600 transition-all hover:scale-110 active:scale-95">
                <Icon size={20} />
              </button>
            ))}
          </div>
        </div>

        <div className="col-span-2">
          <h5 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-500 mb-8">Explorar</h5>
          <ul className="space-y-4">
            {['Viagens', 'Restauração', 'Trilhos', 'Rent-a-Car', 'Atividades', 'Alojamentos'].map(item => (
              <li key={item}><a href="#" className="text-sm font-bold text-slate-300 hover:text-white transition-colors">{item}</a></li>
            ))}
          </ul>
        </div>

        <div className="col-span-2">
          <h5 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-500 mb-8">Informações</h5>
          <ul className="space-y-4">
            {['Sobre Nós', 'Perguntas Frequentes', 'Termos e Condições', 'Política de Privacidade', 'Contactos'].map(item => (
              <li key={item}><a href="#" className="text-sm font-bold text-slate-300 hover:text-white transition-colors">{item}</a></li>
            ))}
          </ul>
        </div>

        <div className="col-span-2">
          <h5 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-500 mb-8">Ajuda</h5>
          <ul className="space-y-4">
            {['Centro de Ajuda', 'Suporte', 'Cancelamentos', 'Alterações de Reserva'].map(item => (
              <li key={item}><a href="#" className="text-sm font-bold text-slate-300 hover:text-white transition-colors">{item}</a></li>
            ))}
          </ul>
        </div>

        <div className="col-span-2">
          <h5 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-500 mb-8">Newsletter</h5>
          <p className="text-xs text-slate-400 mb-6 font-bold leading-relaxed">Subscreva e receba as melhores ofertas e novidades dos Açores.</p>
          <div className="relative">
            <input 
              type="email" 
              placeholder="O seu e-mail" 
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-green-500/50"
            />
            <button className="absolute right-2 top-2 w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center hover:bg-green-700 transition-all active:scale-90">
              <Send size={16} />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 pt-12 border-t border-white/5 flex items-center justify-between">
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">© 2024 Azorestoyou. Todos os direitos reservados.</p>
        <div className="flex gap-4 opacity-50 grayscale hover:grayscale-0 transition-all">
          <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-lg border border-white/10"><CreditCard size={14} /> <span className="text-[9px] font-black">VISA</span></div>
          <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-lg border border-white/10"><CreditCard size={14} /> <span className="text-[9px] font-black">MB</span></div>
          <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-lg border border-white/10"><Apple size={14} /> <span className="text-[9px] font-black">Pay</span></div>
        </div>
      </div>
    </footer>
  );
};

const DesktopView: React.FC<DesktopViewProps> = (props) => {
  const {
    language,
    onNavigate,
    onShowAuth,
    onShowFavorites,
    onShowProfile,
    onOpenIslandSelection,
    isAuthenticated,
    userProfile
  } = props;
  const [heroIndex, setHeroIndex] = useState(0);
  const [scrolled, setScrolled] = useState(false);

  const heroImages = [
    'https://images.unsplash.com/photo-1534067783941-51c9c23ecefd?q=80&w=2070&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=2070&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070&auto=format&fit=crop'
  ];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    
    const timer = setInterval(() => {
      setHeroIndex(prev => (prev + 1) % heroImages.length);
    }, 6000);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearInterval(timer);
    };
  }, []);

  const categories = [
    { id: 'restaurants', label: 'RESTAURANTES', sub: 'Sabores locais', icon: <Utensils className="w-8 h-8 text-orange-600" />, color: '#ea580c' },
    { id: 'buses', label: 'AUTOCARROS', sub: 'Transportes', icon: <Bus className="w-8 h-8 text-orange-500" />, color: '#f97316' },
    { id: 'rentcar', label: 'RENT-A-CAR', sub: 'Aluguer de viaturas', icon: <Car className="w-8 h-8 text-emerald-600" />, color: '#059669' },
    { id: 'accommodation', label: 'ALOJAMENTOS', sub: 'Onde ficar', icon: <Tent className="w-8 h-8 text-purple-600" />, color: '#9333ea' },
    { id: 'activities', label: 'ATIVIDADES', sub: 'Aventuras únicas', icon: <LayoutGrid className="w-8 h-8 text-blue-600" />, color: '#2563eb' },
    { id: 'trails', label: 'TRILHOS', sub: 'Rotas incríveis', icon: <Mountain className="w-8 h-8 text-green-700" />, color: '#15803d' },
  ];

  const features = [
    { icon: <Globe className="w-8 h-8 text-green-500" />, title: 'Experiências Autênticas', sub: 'Descubra o melhor dos Açores' },
    { icon: <ShieldCheck className="w-8 h-8 text-green-500" />, title: 'Reserva Segura', sub: 'Pagamentos 100% seguros' },
    { icon: <Clock className="w-8 h-8 text-green-500" />, title: 'Suporte Local', sub: 'Apoio dedicado 24/7' },
    { icon: <Tag className="w-8 h-8 text-green-500" />, title: 'Melhor Preço Garantido', sub: 'As melhores ofertas' }
  ];

  return (
    <div className="hidden lg:block bg-white selection:bg-green-100 selection:text-green-900">
      
      {/* HEADER */}
      <DesktopHeader {...props} scrolled={scrolled} />

      {/* HERO SECTION */}
      <section className="relative h-screen min-h-[800px] w-full overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={heroIndex}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 2, ease: "easeInOut" }}
            className="absolute inset-0 w-full h-full"
          >
            <div className="absolute inset-0 bg-black/30 z-10"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 z-10"></div>
            <img src={heroImages[heroIndex]} alt="Azores" className="w-full h-full object-cover" />
          </motion.div>
        </AnimatePresence>

        <div className="absolute inset-0 z-20 flex flex-col justify-center max-w-7xl mx-auto px-8">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="max-w-2xl"
          >
            <div className="bg-white/20 backdrop-blur-xl border border-white/30 px-6 py-2 rounded-full w-fit mb-8">
              <span className="text-[11px] font-black text-white uppercase tracking-[0.4em]">Experiência Açores</span>
            </div>
            <h1 className="text-8xl font-black text-white mb-6 leading-[0.9] tracking-tighter">
              Descubra<br/>Todas as Ilhas
            </h1>
            <p className="text-xl text-white/90 font-medium mb-12 max-w-md leading-relaxed drop-shadow-md">
              A natureza em estado puro para as suas férias perfeitas nos Açores.
            </p>
            <div className="flex items-center gap-6">
              <button className="bg-green-600 hover:bg-green-700 text-white px-10 py-5 rounded-[2rem] font-black text-sm uppercase tracking-[0.2em] transition-all shadow-2xl shadow-green-600/30 active:scale-95 flex items-center gap-3 group">
                Explorar agora
                <ArrowRight className="transition-transform group-hover:translate-x-2" />
              </button>
              <button className="flex items-center gap-4 text-white group">
                <div className="w-16 h-16 rounded-full border-2 border-white/50 flex items-center justify-center transition-all group-hover:bg-white group-hover:border-white group-hover:text-slate-900 group-active:scale-90">
                  <Play fill="currentColor" size={24} />
                </div>
                <span className="font-black text-xs uppercase tracking-widest">Ver vídeo</span>
              </button>
            </div>
          </motion.div>
        </div>

        {/* Carousel Navigation */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3">
          {heroImages.map((_, i) => (
            <button 
              key={i} 
              onClick={() => setHeroIndex(i)}
              className={`h-1.5 rounded-full transition-all duration-500 ${heroIndex === i ? 'w-12 bg-white' : 'w-4 bg-white/40 hover:bg-white/60'}`}
            />
          ))}
        </div>

        <button 
          onClick={() => setHeroIndex(prev => (prev - 1 + heroImages.length) % heroImages.length)}
          className="absolute left-8 top-1/2 -translate-y-1/2 z-30 w-16 h-16 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 text-white flex items-center justify-center hover:bg-white hover:text-slate-900 transition-all active:scale-90"
        >
          <ChevronLeft size={32} />
        </button>
        <button 
          onClick={() => setHeroIndex(prev => (prev + 1) % heroImages.length)}
          className="absolute right-8 top-1/2 -translate-y-1/2 z-30 w-16 h-16 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 text-white flex items-center justify-center hover:bg-white hover:text-slate-900 transition-all active:scale-90"
        >
          <ChevronRight size={32} />
        </button>
      </section>

      {/* SEARCH BAR OVERLAP */}
      <div className="relative z-40 -mt-16 max-w-5xl mx-auto px-8">
        <div className="bg-white rounded-[3rem] p-4 shadow-2xl border border-slate-100 flex items-center gap-4"><AzoresLogo size={950} />
          <h1 className="text-4xl md:text-6xl font-extrabold text-white lg:text-slate-900 tracking-tight drop-shadow-lg lg:drop-shadow-none"></h1>  <input 
              type="text" 
              placeholder="O que deseja explorar hoje?" 
              className="flex-1 bg-transparent border-none focus:ring-0 text-slate-800 font-medium placeholder-slate-400"
            />
          <button 
            onClick={onOpenIslandSelection}
            className="flex items-center gap-3 bg-green-700 hover:bg-green-800 text-white px-8 py-5 rounded-[2rem] font-black text-xs uppercase tracking-widest transition-all active:scale-95 shadow-xl shadow-green-700/20"
          >
            <Map size={20} />
            Ver mapa
          </button>
        </div>
      </div>

      {/* CATEGORIES */}
      <section className="py-24 max-w-7xl mx-auto px-8">
        <div className="flex flex-col items-center gap-4 mb-16">
          <div className="flex items-center gap-4 w-full">
            <div className="flex-1 h-[1px] bg-slate-200"></div>
            <span className="text-[11px] font-black text-slate-400 uppercase tracking-[0.5em]">Deslize para ver mais categorias</span>
            <div className="flex-1 h-[1px] bg-slate-200"></div>
          </div>
        </div>

        <div className="grid grid-cols-6 gap-8">
          {categories.map((cat) => (
            <button 
              key={cat.id}
              onClick={() => onNavigate(cat.id)}
              className="group flex flex-col items-center gap-6 p-8 rounded-[3rem] hover:bg-slate-50 transition-all active:scale-95"
            >
              <div className="w-24 h-24 rounded-[2rem] bg-white shadow-xl flex items-center justify-center transition-all group-hover:scale-110 group-hover:-rotate-6 group-hover:shadow-2xl border border-slate-50" style={{ color: cat.color }}>
                {cat.icon}
              </div>
              <div className="text-center">
                <span className="block text-sm font-black text-slate-900 uppercase tracking-tighter mb-1">{cat.label}</span>
                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">{cat.sub}</span>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* FEATURES ROW */}
      <section className="pb-24 max-w-7xl mx-auto px-8">
        <div className="bg-slate-50/50 rounded-[4rem] p-12 border border-slate-100 flex items-center justify-between">
          {features.map((f, i) => (
            <React.Fragment key={i}>
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 rounded-3xl bg-white shadow-lg flex items-center justify-center text-green-500 border border-green-50">
                  {f.icon}
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-900 uppercase tracking-tighter mb-1">{f.title}</h4>
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{f.sub}</p>
                </div>
              </div>
              {i < features.length - 1 && <div className="h-12 w-[1px] bg-slate-200"></div>}
            </React.Fragment>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <DesktopFooter />
    </div>
  );
};

export default DesktopView;
