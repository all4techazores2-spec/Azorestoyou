
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, Map, Heart, User, ChevronDown, ChevronLeft, ChevronRight, Play, 
  Utensils, Bus, Car, Tent, LayoutGrid, Mountain, 
  Facebook, Instagram, Youtube, Send, ArrowRight,
  ShieldCheck, Globe, Clock, Tag, CreditCard, Apple, Scissors,
  MapPin, ShoppingBag, Sparkles, Wrench, Settings, Dog, Building2, Dumbbell, CarFront, Briefcase, Laptop, Wine, Calendar, Landmark
} from 'lucide-react';
import AzoresLogo from './AzoresLogo';
import { Language } from '../types';
import { API_BASE_URL } from '../config';

interface DesktopViewProps {
  language: Language;
  onNavigate: (category: any) => void;
  onShowAuth: () => void;
  onShowFavorites: () => void;
  onShowProfile: () => void;
  onOpenIslandSelection: () => void;
  isAuthenticated: boolean;
  userProfile?: any;
  onShowBarberLogin?: () => void;
}

export const DesktopHeader: React.FC<DesktopViewProps & { scrolled: boolean }> = ({
  onNavigate,
  onShowAuth,
  onShowFavorites,
  onShowProfile,
  isAuthenticated,
  userProfile,
  scrolled,
  onShowBarberLogin
}) => {
  return (
    <header className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${scrolled ? 'bg-white/90 backdrop-blur-xl shadow-lg pt-4 pb-2' : 'bg-transparent pt-8 pb-4'}`}>
      <div className="max-w-7xl mx-auto px-8 flex items-center justify-between relative h-20">
        {/* Left spacer to push layout and match right items */}
        <div className="w-1/4"></div>

        {/* Logo centered and lowered */}
        <div className="absolute left-1/2 top-[70%] -translate-x-1/2 -translate-y-1/2 flex items-center cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <img src="/pngletras.png" alt="Logo" className="h-[280%] max-h-none w-auto object-contain drop-shadow-lg" />
        </div>

        {/* Right side elements lowered to align with logo */}
        <div className="flex items-center gap-6 justify-end w-1/4 pt-6">
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

      {/* Navigation menu below the logo */}
      <div className="flex justify-center mt-6 pb-1">
        <nav className="flex items-center gap-10">
          {['Início', 'Alojamento', 'Restauração', 'Trilhos', 'Rentacar', 'Todas as Categorias'].map((item) => (
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
                if (item === 'Alojamento') onNavigate('accommodation');
                if (item === 'Todas as Categorias') {
                  const element = document.getElementById('categories-section');
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                  }
                }
              }}
            >
              {item}
            </a>
          ))}
        </nav>
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
  const [categoryPage, setCategoryPage] = useState(0);
  const [slides, setSlides] = useState<any[]>([]);

  const defaultSlides = [
    { id: 'slide_d1', image: 'https://images.unsplash.com/photo-1534067783941-51c9c23ecefd?q=80&w=2070&auto=format&fit=crop', subtitle: 'Experiência Açores', title: 'Descubra\nTodas as Ilhas', description: 'A natureza em estado puro para as suas férias perfeitas nos Açores.', buttonText: 'Explorar agora' },
    { id: 'slide_d2', image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=2070&auto=format&fit=crop', subtitle: 'Experiência Açores', title: 'Momentos\nInesquecíveis', description: 'Explore lagoas místicas, vulcões adormecidos e trilhos deslumbrantes.', buttonText: 'Explorar agora' },
    { id: 'slide_d3', image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop', subtitle: 'Experiência Açores', title: 'Alojamento\nPremium', description: 'Encontre o refúgio perfeito com todo o conforto e vistas incríveis.', buttonText: 'Explorar agora' },
    { id: 'slide_d4', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070&auto=format&fit=crop', subtitle: 'Experiência Açores', title: 'Gastronomia\nLocal', description: 'Delicie-se com os sabores tradicionais e pratos típicos dos Açores.', buttonText: 'Explorar agora' }
  ];

  const activeSlides = slides.length > 0 ? slides : defaultSlides;

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/slider?device=desktop`)
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setSlides(data);
        }
      })
      .catch(err => console.error("Error fetching desktop slider:", err));
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    
    const timer = setInterval(() => {
      setHeroIndex(prev => (prev + 1) % activeSlides.length);
    }, 6000);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearInterval(timer);
    };
  }, [activeSlides.length]);

  const categories = [
    { id: 'restaurants', label: 'RESTAURANTES', sub: 'Sabores locais', icon: <Utensils className="w-8 h-8 text-orange-600" />, color: '#ea580c' },
    { id: 'buses', label: 'AUTOCARROS', sub: 'Transportes', icon: <Bus className="w-8 h-8 text-orange-500" />, color: '#f97316' },
    { id: 'rentcar', label: 'RENT-A-CAR', sub: 'Aluguer de viaturas', icon: <Car className="w-8 h-8 text-emerald-600" />, color: '#059669' },
    { id: 'accommodation', label: 'ALOJAMENTOS', sub: 'Onde ficar', icon: <Tent className="w-8 h-8 text-purple-600" />, color: '#9333ea' },
    { id: 'activities', label: 'ATIVIDADES', sub: 'Aventuras únicas', icon: <LayoutGrid className="w-8 h-8 text-blue-600" />, color: '#2563eb' },
    { id: 'trails', label: 'TRILHOS', sub: 'Rotas incríveis', icon: <Mountain className="w-8 h-8 text-green-700" />, color: '#15803d' },
    { id: 'poi', label: 'ATRAÇÕES', sub: 'Pontos turísticos', icon: <MapPin className="w-8 h-8 text-green-600" />, color: '#22c55e' },
    { id: 'shops', label: 'COMÉRCIO', sub: 'Lojas e compras', icon: <ShoppingBag className="w-8 h-8 text-pink-600" />, color: '#db2777' },
    { id: 'beauty', label: 'BELEZA', sub: 'Estética e bem-estar', icon: <Sparkles className="w-8 h-8 text-rose-500" />, color: '#f43f5e' },
    { id: 'services', label: 'SERVIÇOS', sub: 'Profissionais', icon: <Wrench className="w-8 h-8 text-slate-600" />, color: '#475569' },
    { id: 'auto_repair', label: 'OFICINAS', sub: 'Manutenção auto', icon: <Settings className="w-8 h-8 text-red-600" />, color: '#dc2626' },
    { id: 'animals', label: 'ANIMAIS', sub: 'Pet shops e veterinários', icon: <Dog className="w-8 h-8 text-orange-600" />, color: '#ea580c' },
    { id: 'real_estate', label: 'IMOBILIÁRIA', sub: 'Comprar e alugar', icon: <Building2 className="w-8 h-8 text-blue-800" />, color: '#1e40af' },
    { id: 'gyms', label: 'GINÁSIOS', sub: 'Saúde e fitness', icon: <Dumbbell className="w-8 h-8 text-slate-800" />, color: '#1e293b' },
    { id: 'stands', label: 'STANDS', sub: 'Venda de veículos', icon: <CarFront className="w-8 h-8 text-indigo-600" />, color: '#4f46e5' },
    { id: 'offices', label: 'ESCRITÓRIOS', sub: 'Coworking e salas', icon: <Briefcase className="w-8 h-8 text-cyan-600" />, color: '#0891b2' },
    { id: 'it_services', label: 'INFORMÁTICA', sub: 'Suporte e tecnologia', icon: <Laptop className="w-8 h-8 text-slate-700" />, color: '#334155' },
    { id: 'bars', label: 'BARES/NOITE', sub: 'Diversão noturna', icon: <Wine className="w-8 h-8 text-purple-800" />, color: '#6b21a8' },
    { id: 'events', label: 'EVENTOS', sub: 'Espetáculos e festas', icon: <Calendar className="w-8 h-8 text-amber-600" />, color: '#d97706' },
    { id: 'municipal', label: 'SERVIÇOS PÚBLICOS', sub: 'Apoio municipal', icon: <Landmark className="w-8 h-8 text-sky-600" />, color: '#0284c7' },
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
            <img src={activeSlides[heroIndex]?.image} alt="Azores" className="w-full h-full object-cover" style={{ opacity: (activeSlides[heroIndex]?.opacity ?? 100) / 100 }} />
          </motion.div>
        </AnimatePresence>
 
        {/* Left column: descriptions aligned far left */}
        <div className="absolute left-10 top-1/2 -translate-y-1/2 z-20 max-w-xl text-left hidden xl:block">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 1 }}
          >
            <div className="bg-white/20 backdrop-blur-xl border border-white/30 px-6 py-2 rounded-full w-fit mb-8">
              <span className="text-[11px] font-black text-white uppercase tracking-[0.4em]">{activeSlides[heroIndex]?.subtitle || 'Experiência Açores'}</span>
            </div>
            <h1 className="text-7xl font-black text-white mb-6 leading-[0.9] tracking-tighter" style={{ whiteSpace: 'pre-line' }}>
              {activeSlides[heroIndex]?.title || 'Descubra\nTodas as Ilhas'}
            </h1>
            <p className="text-lg text-white/90 font-medium mb-10 leading-relaxed drop-shadow-md">
              {activeSlides[heroIndex]?.description || 'A natureza em estado puro para as suas férias perfeitas nos Açores.'}
            </p>
            <div className="flex items-center gap-4">
              <button className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] transition-all shadow-2xl shadow-green-600/30 active:scale-95 flex items-center gap-3 group">
                {activeSlides[heroIndex]?.buttonText || 'Explorar agora'}
                <ArrowRight className="transition-transform group-hover:translate-x-2" />
              </button>
              <button className="flex items-center gap-4 text-white group">
                <div className="w-12 h-12 rounded-full border-2 border-white/50 flex items-center justify-center transition-all group-hover:bg-white group-hover:border-white group-hover:text-slate-900 group-active:scale-90">
                  <Play fill="currentColor" size={18} />
                </div>
                <span className="font-black text-[10px] uppercase tracking-widest">Ver vídeo</span>
              </button>
            </div>
          </motion.div>
        </div>

        {/* Center column: Centered, extended search bar with categories underneath */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-full max-w-4xl px-8 flex flex-col items-center gap-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7, duration: 1 }}
            className="w-full flex flex-col gap-6"
          >
            {/* Extended Search Bar */}
            <div className="w-full shadow-2xl rounded-[2.5rem] bg-slate-950/90 backdrop-blur-2xl border border-slate-800 p-4 flex items-center gap-4">
              <div className="flex-1 relative flex items-center">
                <Search className="absolute left-5 text-green-500" size={24} />
                <input 
                  type="text" 
                  placeholder="O que deseja explorar hoje? (Atrações, hotéis, restaurantes...)" 
                  className="w-full h-16 bg-transparent border-none text-white placeholder-slate-500 pl-14 pr-4 focus:outline-none focus:ring-0 font-semibold text-lg"
                />
              </div>
              <button 
                onClick={onOpenIslandSelection}
                className="h-16 bg-green-600 hover:bg-green-700 text-white px-8 rounded-2xl flex items-center gap-2 font-black text-xs uppercase tracking-widest transition-all active:scale-95 shadow-lg shadow-green-600/20"
              >
                <Map size={18} />
                Ver Mapa
              </button>
            </div>

            {/* Categories horizontal row immediately below the search bar */}
            <div className="w-full bg-slate-950/70 backdrop-blur-xl border border-slate-800 p-6 rounded-[2.5rem] shadow-xl flex flex-col items-center relative">
              <div className="flex items-center gap-8 overflow-x-auto py-2 px-10 scrollbar-hide max-w-full justify-center">
                {categories.slice(categoryPage * 6, (categoryPage + 1) * 6).map((cat) => (
                  <button 
                    key={cat.id} 
                    onClick={() => onNavigate(cat.id)}
                    className="flex flex-col items-center gap-2 group transition-all shrink-0 hover:scale-105"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-lg transition-transform group-hover:scale-110" style={{ color: cat.color }}>
                      {React.cloneElement(cat.icon as React.ReactElement, { className: "w-6 h-6" })}
                    </div>
                    <span className="text-[10px] font-black text-white uppercase tracking-wider">{cat.label}</span>
                  </button>
                ))}
              </div>
              
              {/* Navigation Arrows for categories inside the hero section */}
              <button 
                onClick={() => {
                  const maxPage = Math.ceil(categories.length / 6) - 1;
                  setCategoryPage(prev => (prev > 0 ? prev - 1 : maxPage));
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all z-10"
              >
                <ChevronLeft size={18} />
              </button>
              <button 
                onClick={() => {
                  const maxPage = Math.ceil(categories.length / 6) - 1;
                  setCategoryPage(prev => (prev < maxPage ? prev + 1 : 0));
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all z-10"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </motion.div>
        </div>
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



      {/* CATEGORIES */}
      <section className="py-24 max-w-7xl mx-auto px-8 relative" id="categories-section">
        <div className="flex flex-col items-center gap-4 mb-16">
          <div className="flex items-center gap-4 w-full">
            <div className="flex-1 h-[1px] bg-slate-200"></div>
            <span className="text-[11px] font-black text-slate-400 uppercase tracking-[0.5em]">Navegue pelas categorias</span>
            <div className="flex-1 h-[1px] bg-slate-200"></div>
          </div>
        </div>

        <div className="relative px-12">
          {/* Left Arrow Button */}
          <button 
            onClick={() => {
              const maxPage = Math.ceil(categories.length / 6) - 1;
              setCategoryPage(prev => (prev > 0 ? prev - 1 : maxPage));
            }}
            className="absolute left-0 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white shadow-lg border border-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-all active:scale-90 z-10"
          >
            <ChevronLeft size={24} />
          </button>

          {/* Categories Slider Window */}
          <div className="overflow-hidden">
            <motion.div 
              key={categoryPage}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-6 gap-8"
            >
              {categories.slice(categoryPage * 6, (categoryPage + 1) * 6).map((cat) => (
                <button 
                  key={cat.id}
                  onClick={() => onNavigate(cat.id)}
                  className="group flex flex-col items-center gap-6 p-8 rounded-[3rem] hover:bg-slate-50 transition-all active:scale-95"
                >
                  <div className="w-24 h-24 rounded-[2rem] bg-white shadow-xl flex items-center justify-center transition-all group-hover:scale-110 group-hover:-rotate-6 group-hover:shadow-2xl border border-slate-50" style={{ color: cat.color }}>
                    {cat.icon}
                  </div>
                  <div className="text-center">
                    <span className="block text-sm font-black text-slate-900 uppercase tracking-tighter mb-1 truncate w-28">{cat.label}</span>
                    <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest truncate w-28">{cat.sub}</span>
                  </div>
                </button>
              ))}
            </motion.div>
          </div>

          {/* Right Arrow Button */}
          <button 
            onClick={() => {
              const maxPage = Math.ceil(categories.length / 6) - 1;
              setCategoryPage(prev => (prev < maxPage ? prev + 1 : 0));
            }}
            className="absolute right-0 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white shadow-lg border border-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-all active:scale-90 z-10"
          >
            <ChevronRight size={24} />
          </button>
        </div>

        {/* Pagination dots */}
        <div className="flex justify-center gap-2 mt-8">
          {Array.from({ length: Math.ceil(categories.length / 6) }).map((_, i) => (
            <button
              key={i}
              onClick={() => setCategoryPage(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${categoryPage === i ? 'w-8 bg-green-600' : 'w-2 bg-slate-200'}`}
            />
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
