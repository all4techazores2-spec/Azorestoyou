import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Mail, Lock, ShieldCheck, ArrowRight, Scissors, Calendar, 
  CreditCard, Star, User, AlertCircle, Eye, EyeOff, ArrowLeft 
} from 'lucide-react';

interface BarberLoginProps {
  onBack: () => void;
  onLoginSuccess: (businessId: string, softwareVersion: 'normal' | 'pro') => void;
  beautyList: any[];
}

const BarberLogin: React.FC<BarberLoginProps> = ({ onBack, onLoginSuccess, beautyList }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Logo BragaBarber SVG Component
  const BragaBarberLogo = ({ size = 120, light = false }: { size?: number, light?: boolean }) => {
    const goldColor = '#D4AF37';
    return (
      <svg width={size} height={size} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="mx-auto select-none">
        {/* Outer Elegant Circle with Gold Border */}
        <circle cx="100" cy="100" r="95" stroke={goldColor} strokeWidth="1.5" strokeDasharray="5 3" opacity="0.6" />
        <circle cx="100" cy="100" r="90" stroke={goldColor} strokeWidth="2" />
        <circle cx="100" cy="100" r="86" stroke={goldColor} strokeWidth="0.5" opacity="0.4" />
        
        {/* Scissors / Razors decorative lines */}
        <path d="M60 40 L65 35 L75 50 L70 55 Z" fill={goldColor} opacity="0.8" />
        <path d="M140 40 L135 35 L125 50 L130 55 Z" fill={goldColor} opacity="0.8" />

        {/* Two vertical razors on the sides */}
        {/* Left Razor */}
        <g transform="translate(45, 55)">
          <path d="M0 0 L5 30 L3 80 L-2 80 L-4 30 Z" fill={goldColor} opacity="0.9" />
          <path d="M2 10 L8 50 L6 90 L1 90 L-1 50 Z" fill="#FFFFFF" opacity="0.15" />
          {/* Razor blade details */}
          <line x1="1.5" y1="20" x2="1.5" y2="70" stroke={goldColor} strokeWidth="0.5" />
        </g>
        {/* Right Razor */}
        <g transform="translate(150, 55) scale(-1, 1)">
          <path d="M0 0 L5 30 L3 80 L-2 80 L-4 30 Z" fill={goldColor} opacity="0.9" />
          <path d="M2 10 L8 50 L6 90 L1 90 L-1 50 Z" fill="#FFFFFF" opacity="0.15" />
          <line x1="1.5" y1="20" x2="1.5" y2="70" stroke={goldColor} strokeWidth="0.5" />
        </g>

        {/* Vintage Male Silhouettes (Front to Front) */}
        {/* Left face silhouette */}
        <path d="M 68 85 
                 C 72 85, 75 80, 75 75 
                 C 75 70, 72 65, 78 60 
                 C 82 56, 88 62, 88 70 
                 C 88 78, 82 85, 84 92 
                 C 86 98, 92 98, 92 105 
                 C 92 112, 80 120, 75 130 
                 C 72 135, 68 135, 68 130 Z" 
              fill={goldColor} opacity="0.25" />
              
        {/* Right face silhouette */}
        <path d="M 132 85 
                 C 128 85, 125 80, 125 75 
                 C 125 70, 128 65, 122 60 
                 C 118 56, 112 62, 112 70 
                 C 112 78, 118 85, 116 92 
                 C 114 98, 108 98, 108 105 
                 C 108 112, 120 120, 125 130 
                 C 128 135, 132 135, 132 130 Z" 
              fill={goldColor} opacity="0.25" />

        {/* Ornaments */}
        <path d="M 80 145 Q 100 155 120 145" stroke={goldColor} strokeWidth="1.5" fill="none" />
        <path d="M 85 149 Q 100 157 115 149" stroke={goldColor} strokeWidth="1" fill="none" opacity="0.6" />
        <circle cx="100" cy="153" r="2.5" fill={goldColor} />

        {/* Top stars */}
        <g transform="translate(100, 48)">
          <path d="M0 -5 L1.5 -1.5 L5 0 L1.5 1.5 L0 5 L-1.5 1.5 L-5 0 L-1.5 -1.5 Z" fill={goldColor} />
        </g>
        <g transform="translate(85, 52) scale(0.7)">
          <path d="M0 -5 L1.5 -1.5 L5 0 L1.5 1.5 L0 5 L-1.5 1.5 L-5 0 L-1.5 -1.5 Z" fill={goldColor} opacity="0.7" />
        </g>
        <g transform="translate(115, 52) scale(0.7)">
          <path d="M0 -5 L1.5 -1.5 L5 0 L1.5 1.5 L0 5 L-1.5 1.5 L-5 0 L-1.5 -1.5 Z" fill={goldColor} opacity="0.7" />
        </g>

        {/* Elegant Serif BRAGA Typography */}
        <text x="100" y="102" fontFamily="'Cinzel', 'Playfair Display', 'Didot', 'Georgia', serif" fontSize="22" fontWeight="900" fill={goldColor} textAnchor="middle" letterSpacing="4">BRAGA</text>
        <text x="100" y="120" fontFamily="'Montserrat', 'Inter', sans-serif" fontSize="8" fontWeight="700" fill="#FFFFFF" textAnchor="middle" letterSpacing="6" opacity="0.9">BARBER</text>
        
        {/* Est. 2025 details */}
        <text x="100" y="133" fontFamily="'Montserrat', 'Inter', sans-serif" fontSize="5" fontWeight="500" fill={goldColor} textAnchor="middle" letterSpacing="2" opacity="0.7">EST. 2025</text>
      </svg>
    );
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (!email.trim() || !password.trim()) {
      setError('Por favor, preencha todos os campos.');
      setLoading(false);
      return;
    }

    try {
      // 1. Fetch live credentials if not fully passed, or match in passed beautyList
      let list = beautyList;
      if (!list || list.length === 0) {
        const response = await fetch('/api/beauty');
        if (response.ok) {
          list = await response.json();
        }
      }

      // 2. Filter list by subcategory 'barber' (or check subcategory/type)
      const barbers = list.filter((b: any) => {
        const sub = (b.subcategory || '').toLowerCase();
        const type = (b.businessType || b.type || '').toLowerCase();
        return sub === 'barber' || sub === 'barbearia' || type === 'barber' || type === 'barbearia';
      });

      // 3. Find matching credentials using adminEmail and adminPassword
      const matchedBarber = barbers.find((b: any) => {
        const bEmail = (b.adminEmail || b.email || '').toLowerCase().trim();
        const bPass = (b.adminPassword || b.password || '').trim();
        return bEmail === email.toLowerCase().trim() && bPass === password;
      });

      if (matchedBarber) {
        // Successful login
        if (rememberMe) {
          localStorage.setItem('azores_barber_remember_email', email);
        } else {
          localStorage.removeItem('azores_barber_remember_email');
        }

        // Redirect based on softwareVersion
        const version = matchedBarber.softwareVersion === 'pro' ? 'pro' : 'normal';
        onLoginSuccess(matchedBarber.id, version);
      } else {
        setError('Email ou palavra-passe inválidos.');
      }
    } catch (err) {
      console.error('Erro na autenticação:', err);
      setError('Ocorreu um erro ao validar as credenciais. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const savedEmail = localStorage.getItem('azores_barber_remember_email');
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  return (
    <div className="fixed inset-0 z-[600] w-full h-full bg-[#050505] text-white flex flex-row overflow-hidden font-sans select-none">
      
      {/* LEFT COLUMN (40% Width on desktop, 100% on Mobile) */}
      <div className="w-full lg:w-[40%] h-full flex flex-col justify-between p-8 md:p-12 relative z-10 bg-[#050505] border-r border-[#D4AF37]/15 overflow-y-auto">
        
        {/* Top Header Row */}
        <div className="flex items-center justify-between">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#AFAFAF] hover:text-[#D4AF37] transition-all group active:scale-95"
          >
            <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
            Voltar
          </button>
          
          <div className="lg:hidden flex items-center gap-2">
            <span className="font-extrabold text-sm tracking-tight text-slate-400">
              Azores<span className="text-[#D4AF37] font-black">toyou</span>
            </span>
          </div>
        </div>

        {/* Center Auth Content */}
        <div className="my-auto py-8 max-w-sm w-full mx-auto flex flex-col gap-6 animate-[fadeIn_0.5s_ease-out]">
          
          {/* Logo Section */}
          <div className="text-center">
            <BragaBarberLogo size={110} />
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#D4AF37] mt-3">Bem-vindo ao BRAGABARBER</p>
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter uppercase text-white mt-1">BEM VINDO</h2>
            <p className="text-xs text-[#AFAFAF] font-medium mt-2">Faça login para aceder ao seu painel de gestão.</p>
            <div className="w-20 h-[1.5px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto mt-4" />
          </div>

          {/* Form */}
          <form onSubmit={handleLoginSubmit} className="flex flex-col gap-4">
            
            {/* Error Message */}
            {error && (
              <div className="flex items-center gap-3 p-4 bg-red-950/40 border border-red-500/30 rounded-2xl text-red-200 text-xs font-bold leading-relaxed animate-shake">
                <AlertCircle size={18} className="text-red-500 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Email Field */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-[#AFAFAF] px-1">Email ou Utilizador</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#AFAFAF] group-focus-within:text-[#D4AF37] transition-colors">
                  <Mail size={18} />
                </div>
                <input 
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="barbeiro@azorestoyou.com"
                  className="w-full bg-[#0D0D0D] border border-[#D4AF37]/15 rounded-2xl pl-12 pr-4 py-4 text-sm font-medium text-white placeholder-slate-600 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/30 transition-all"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center px-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-[#AFAFAF]">Palavra-passe</label>
                <button 
                  type="button"
                  onClick={() => alert('Por favor, contacte o suporte BragaBarber ou o administrador AzoresToYou para repor a sua palavra-passe.')}
                  className="text-[10px] font-bold text-[#D4AF37] hover:underline hover:text-white transition-colors"
                >
                  Esqueceu-se da palavra-passe?
                </button>
              </div>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#AFAFAF] group-focus-within:text-[#D4AF37] transition-colors">
                  <Lock size={18} />
                </div>
                <input 
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-[#0D0D0D] border border-[#D4AF37]/15 rounded-2xl pl-12 pr-12 py-4 text-sm font-medium text-white placeholder-slate-600 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/30 transition-all"
                  required
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Remember Me Option */}
            <div className="flex items-center gap-2 py-1 select-none">
              <input 
                type="checkbox"
                id="remember"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4.5 h-4.5 rounded-lg bg-[#0D0D0D] border border-[#D4AF37]/30 text-[#D4AF37] focus:ring-0 cursor-pointer"
              />
              <label htmlFor="remember" className="text-xs text-[#AFAFAF] font-medium cursor-pointer hover:text-white transition-colors">
                Lembrar-me
              </label>
            </div>

            {/* Submit Button */}
            <button 
              type="submit"
              disabled={loading}
              className="w-full py-4.5 bg-gradient-to-r from-[#D4AF37] to-[#AA8426] hover:from-[#E5BF48] hover:to-[#BB9537] text-black font-black text-xs uppercase tracking-widest rounded-2xl transition-all shadow-xl shadow-[#D4AF37]/15 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  Entrar
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Secure access info */}
          <div className="flex items-center justify-center gap-3 mt-6 p-4 bg-[#0D0D0D]/50 border border-[#D4AF37]/10 rounded-2xl text-center">
            <ShieldCheck size={20} className="text-[#D4AF37]" />
            <div className="text-left">
              <p className="text-[10px] font-black uppercase tracking-wider text-white">Acesso seguro e protegido</p>
              <p className="text-[9px] text-[#AFAFAF] font-medium">Os seus dados estão protegidos por encriptação SSL.</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center pt-4">
          <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">© 2025 BragaBarber</p>
          <p className="text-[9px] text-slate-700 font-bold uppercase tracking-wider mt-1">Todos os direitos reservados.</p>
        </div>
      </div>

      {/* RIGHT COLUMN (60% Width, Vintage Image & Details, hidden on mobile) */}
      <div className="hidden lg:block lg:w-[60%] h-full relative">
        {/* Hero Background Image */}
        <img 
          src="https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=2070&auto=format&fit=crop" 
          alt="Vintage Barbershop" 
          className="w-full h-full object-cover select-none pointer-events-none"
        />
        {/* Dark overlay for vintage premium feel */}
        <div className="absolute inset-0 bg-[#050505]/85 backdrop-blur-[2px] z-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/40 to-transparent z-15" />
        
        {/* Content Wrapper */}
        <div className="absolute inset-0 z-20 flex flex-col justify-between p-16">
          
          {/* Top Brand Name */}
          <div className="flex items-center gap-3">
            <span className="font-black text-xs uppercase tracking-[0.4em] text-white/50">
              Azores<span className="text-[#D4AF37] font-black">toyou</span> Barber
            </span>
          </div>

          {/* Big Center Composite Logo */}
          <div className="my-auto text-center max-w-lg mx-auto flex flex-col gap-6 p-8 bg-[#0D0D0D]/40 border border-[#D4AF37]/10 backdrop-blur-xl rounded-[2.5rem] shadow-2xl">
            <BragaBarberLogo size={190} />
            <div>
              <p className="text-xs font-black uppercase tracking-[0.3em] text-[#D4AF37]">PLATAFORMA EXCLUSIVA</p>
              <h3 className="text-2xl font-black text-white mt-1 uppercase tracking-tight">SISTEMA DE GESTÃO PARA BARBEIROS</h3>
              <p className="text-xs text-[#AFAFAF] font-medium leading-relaxed mt-3 px-4">
                Administre as suas reservas, optimize a agenda, fature vendas de produtos e acompanhe a satisfação dos clientes numa interface projetada para a elite.
              </p>
            </div>
          </div>

          {/* Bottom Features Icons Row */}
          <div className="grid grid-cols-5 gap-4 pt-8 border-t border-[#D4AF37]/10">
            {[
              { icon: <Calendar size={18} />, title: 'Agenda', desc: 'Marcações instantâneas' },
              { icon: <Scissors size={18} />, title: 'Serviços', desc: 'Menu e especialidades' },
              { icon: <CreditCard size={18} />, title: 'POS / Vendas', desc: 'Faturação e stock' },
              { icon: <Star size={18} />, title: 'Avaliações', desc: 'Feedback detalhado' },
              { icon: <User size={18} />, title: 'Perfil', desc: 'Dados profissionais' }
            ].map((feat, index) => (
              <div 
                key={index} 
                className="flex flex-col items-center text-center p-3 rounded-2xl bg-[#0D0D0D]/50 border border-white/5 hover:border-[#D4AF37]/30 hover:bg-[#0D0D0D]/80 transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-xl bg-[#050505] border border-[#D4AF37]/15 flex items-center justify-center text-[#D4AF37] mb-2 shadow-inner">
                  {feat.icon}
                </div>
                <span className="text-[10px] font-black uppercase text-white tracking-wider block">{feat.title}</span>
                <span className="text-[8px] text-[#AFAFAF] font-medium mt-1 leading-snug">{feat.desc}</span>
              </div>
            ))}
          </div>

        </div>
      </div>
      
      {/* Keyframe styles */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-shake {
          animation: shake 0.3s ease-in-out;
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }
      `}</style>
    </div>
  );
};

export default BarberLogin;
