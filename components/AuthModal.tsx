
import React, { useState } from 'react';
import AzoresLogo from './AzoresLogo';
import { Mail, Lock, User, X, ArrowRight, Loader2 } from 'lucide-react';
import { Language, Restaurant } from '../types';
import { getTranslation } from '../translations';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (isAdmin?: boolean, businessId?: string, email?: string, role?: string) => void;
  onGuest?: () => void; // Optional: Only used in Landing Page
  language?: Language;
  restaurants?: Restaurant[];
  shops?: Restaurant[];
  beauty?: Restaurant[];
}

type AuthMode = 'login' | 'register';

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess, onGuest, language = 'pt', restaurants = [], shops = [], beauty = [] }) => {
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [isLoading, setIsLoading] = useState(false);
  const currentLang = language as Language;
  
  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedPassword = password.trim();

    // 1. CHAVE MESTRA
    if (normalizedEmail === 'admin@azores4you.com' && normalizedPassword === 'azoresadmin') {
      setIsLoading(false);
      onSuccess(true, undefined, normalizedEmail);
      return;
    }

    // 2. Verificação de Negócios e Staff (Dados do Servidor)
    const allBusinesses = [...restaurants, ...shops, ...beauty];
    
    if (allBusinesses.length === 0) {
      setIsLoading(false);
      setError("A carregar base de dados... Tente novamente em instantes.");
      return;
    }

    // 2.1 Verificar se é Admin de algum negócio
    const business = allBusinesses.find(b => 
      b.adminEmail?.toLowerCase() === normalizedEmail && 
      b.adminPassword === normalizedPassword
    );

    if (business) {
      setIsLoading(false);
      const isRestaurant = restaurants.some(r => r.id === business.id);
      const role = isRestaurant ? 'manager' : 'business';
      onSuccess(false, business.id, normalizedEmail, role);
      return;
    }

    // 2.2 Verificar se é Staff de algum negócio
    for (const b of allBusinesses) {
      const staffMember = b.staff?.find(s => 
        s.email?.toLowerCase() === normalizedEmail && 
        s.password === normalizedPassword
      );
      if (staffMember) {
        setIsLoading(false);
        onSuccess(false, b.id, normalizedEmail, staffMember.role);
        return;
      }

      // 2.3 Verificar se é Fornecedor
      const supplier = b.suppliers?.find(s => 
        s.email?.toLowerCase() === normalizedEmail && 
        s.password === normalizedPassword
      );
      if (supplier) {
        setIsLoading(false);
        onSuccess(false, b.id, normalizedEmail, 'supplier');
        return;
      }
    }

    // 3. Se chegou aqui e é modo LOGIN, as credenciais estão erradas
    if (authMode === 'login') {
      setIsLoading(false);
      // Permitir login como viajante se não for email de negócio conhecido ou se for apenas password genérica
      // Mas se for um email de negócio e a pass estiver errada, mostramos erro
      const isBusinessEmail = allBusinesses.some(b => b.adminEmail?.toLowerCase() === normalizedEmail);
      if (isBusinessEmail) {
        setError("Password incorreta para este negócio.");
        return;
      }

      // Fallback para utilizador normal (viajante) - permitimos entrar se não for negócio
      onSuccess(false, undefined, normalizedEmail);
    } else {
      // Registo de novo utilizador
      setIsLoading(false);
      onSuccess(false, undefined, normalizedEmail);
    }
  };

  const t = (key: any) => getTranslation(currentLang, key);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in zoom-in-95 duration-300">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm" onClick={onClose}></div>

      <div className="bg-slate-900 border border-white/10 rounded-3xl w-full max-w-md p-8 shadow-2xl relative overflow-hidden z-10">
          
          {/* Decorative blob */}
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-500 rounded-full blur-[80px] opacity-40 pointer-events-none"></div>
          <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-green-500 rounded-full blur-[80px] opacity-40 pointer-events-none"></div>

          <button 
            onClick={onClose}
            className="absolute top-6 right-6 z-50 p-3 bg-white text-slate-800 hover:bg-blue-600 hover:text-white rounded-full transition-all shadow-lg border border-slate-100 group"
          >
            <X size={20} className="group-active:scale-90 transition-transform" />
          </button>

          <div className="relative z-10">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-green-600 rounded-2xl mx-auto flex items-center justify-center mb-4 shadow-lg overflow-hidden">
                {authMode === 'login' ? <User className="text-white w-8 h-8" /> : <AzoresLogo size={48} className="text-white" />}
              </div>
              <h2 className="text-2xl font-bold text-white mb-1">
                {authMode === 'login' ? t('welcome_back') : t('create_account')}
              </h2>
              <p className="text-slate-400 text-sm">
                Azores<span className="text-green-400">Toyou</span>
              </p>
            </div>

            <form onSubmit={handleAuthSubmit} className="space-y-4">
              {authMode === 'register' && (
                <div className="space-y-1">
                  <div className="relative">
                    <User className="absolute left-3 top-3.5 text-slate-400 w-5 h-5" />
                    <input 
                      type="text" 
                      placeholder={t('name')}
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-slate-800/50 border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1">
                <div className="relative">
                  <Mail className="absolute left-3 top-3.5 text-slate-400 w-5 h-5" />
                  <input 
                    type="email" 
                    placeholder={t('email')}
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="relative">
                  <Lock className="absolute left-3 top-3.5 text-slate-400 w-5 h-5" />
                  <input 
                    type="password" 
                    placeholder={t('password')}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  />
                </div>
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs p-3 rounded-xl animate-in fade-in slide-in-from-top-1">
                  {error}
                </div>
              )}

              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full py-4 rounded-xl font-bold text-lg shadow-lg flex items-center justify-center gap-2 mt-2 hover:scale-[1.02] transition-all disabled:opacity-70 disabled:hover:scale-100"
                style={{ background: 'linear-gradient(to right, #1A75BB, #2C7A2E)', color: 'white' }}
              >
                {isLoading ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <>
                    {authMode === 'login' ? t('btn_login') : t('btn_register')}
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 text-center space-y-4">
              <button 
                type="button"
                onClick={() => {
                  setAuthMode(authMode === 'login' ? 'register' : 'login');
                  setEmail('');
                  setPassword('');
                  setName('');
                }}
                className="text-slate-300 text-sm hover:text-white transition-colors hover:underline underline-offset-4"
              >
                {authMode === 'login' ? t('no_account') : t('has_account')}
              </button>

              {onGuest && (
                <>
                  <div className="relative flex items-center py-2">
                    <div className="flex-grow border-t border-slate-700"></div>
                    <span className="flex-shrink-0 mx-4 text-slate-500 text-xs">{t('or')}</span>
                    <div className="flex-grow border-t border-slate-700"></div>
                  </div>

                  <button 
                    onClick={onGuest}
                    className="text-slate-500 text-xs hover:text-slate-300 transition-colors uppercase tracking-widest font-semibold"
                  >
                    {t('guest')}
                  </button>
                </>
              )}
            </div>
          </div>
      </div>
    </div>
  );
};

export default AuthModal;
