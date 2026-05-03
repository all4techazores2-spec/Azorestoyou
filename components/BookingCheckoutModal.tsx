
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Check, CreditCard, User, Mail, Phone, ArrowRight, ShieldCheck, Wallet, Star, CheckCircle } from 'lucide-react';
import { Itinerary } from '../types';

interface BookingCheckoutModalProps {
  itinerary: Itinerary;
  onClose: () => void;
  onComplete: () => void;
}

const BookingCheckoutModal: React.FC<BookingCheckoutModalProps> = ({ itinerary, onClose, onComplete }) => {
  if (!itinerary) return null;
  const [step, setStep] = useState<'data' | 'payment' | 'success'>('data');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentType, setPaymentType] = useState<'mbway' | 'transfer' | 'points' | 'reserve'>('transfer');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    mbwayPhone: '',
    cardNumber: '',
    expiry: '',
    cvv: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 'data') {
      setStep('payment');
    } else {
      setIsProcessing(true);
      setTimeout(() => {
        setIsProcessing(false);
        setStep('success');
      }, 2500);
    }
  };

  const baseStayPrice = (itinerary.hotel?.pricePerNight || 0) * (itinerary.nights || 1);
  const roomUpgradePrice = itinerary.selectedRoom 
    ? (itinerary.selectedRoom.pricePerNight - (itinerary.hotel?.pricePerNight || 0)) * (itinerary.nights || 1)
    : 0;
  const extrasTotal = (itinerary.selectedExtras || []).reduce((sum, extra) => sum + extra.price, 0);
  const total = baseStayPrice + roomUpgradePrice + extrasTotal;

  const paymentMethods = [
    { id: 'mbway', icon: Wallet, title: 'MBWay / Revolut', desc: 'Pagamento rápido via telemóvel' },
    { id: 'transfer', icon: CreditCard, title: 'Cartão de Crédito', desc: 'Visa, Mastercard, Amex' },
    { id: 'points', icon: Star, title: 'Saldo de Pontos', desc: 'Utilizar créditos Azores4you' },
    { id: 'reserve', icon: CheckCircle, title: 'Pagar no Local', desc: 'Liquide a conta no check-in' }
  ];

  return (
    <div className="fixed inset-0 z-[130] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md overflow-hidden">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="bg-white w-full max-w-2xl max-h-[90vh] rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col relative"
      >
        {step !== 'success' && (
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 z-30 p-2.5 bg-white text-slate-800 hover:bg-blue-600 hover:text-white rounded-full transition-all shadow-lg border border-slate-100 group"
          >
            <X size={20} className="group-active:scale-90 transition-transform" />
          </button>
        )}

        <div className="flex flex-col md:flex-row h-full overflow-y-auto scrollbar-hide">
          {/* Left: Summary */}
          {step !== 'success' && (
            <div className="md:w-5/12 bg-slate-50 p-6 md:p-8 flex flex-col border-b md:border-b-0 md:border-r border-slate-100 shrink-0">
               <div className="mb-6">
                  <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest bg-blue-50 px-2 py-0.5 rounded-full">Resumo</span>
                  <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight mt-3 leading-tight">{itinerary.hotel?.name}</h3>
                  <p className="text-[10px] text-slate-500 mt-0.5 font-bold">{itinerary.selectedRoom?.name}</p>
               </div>

               <div className="space-y-3 flex-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400 font-medium">Estadia ({itinerary.nights} noites)</span>
                    <span className="text-slate-900 font-bold">€{baseStayPrice}</span>
                  </div>
                  {roomUpgradePrice > 0 && (
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400 font-medium">Upgrade Quarto</span>
                      <span className="text-slate-900 font-bold">€{roomUpgradePrice}</span>
                    </div>
                  )}
                  {(itinerary.selectedExtras || []).map((extra, idx) => (
                    <div key={idx} className="flex justify-between text-xs">
                      <span className="text-slate-400 font-medium">{extra.name}</span>
                      <span className="text-slate-900 font-bold">€{extra.price}</span>
                    </div>
                  ))}
                  <div className="w-full h-px bg-slate-200 my-3" />
                  <div className="flex justify-between items-end">
                    <span className="text-[9px] font-black text-slate-400 uppercase">Total</span>
                    <span className="text-2xl font-black text-slate-900">€{total}</span>
                  </div>
               </div>

               <div className="mt-6 pt-6 border-t border-slate-200 hidden md:block">
                  <div className="flex items-center gap-3 text-green-600">
                     <ShieldCheck size={18} />
                     <span className="text-[9px] font-black uppercase tracking-widest leading-none">Pagamento Seguro <br/><span className="text-slate-400">SSL Encrypted</span></span>
                  </div>
               </div>
            </div>
          )}

          {/* Right: Forms / Success */}
          <div className={`flex-1 p-6 md:p-10 flex flex-col ${step === 'success' ? 'items-center justify-center text-center' : ''}`}>
             <AnimatePresence mode="wait">
               {step === 'data' && (
                 <motion.form 
                   key="data-form"
                   initial={{ opacity: 0, x: 20 }}
                   animate={{ opacity: 1, x: 0 }}
                   exit={{ opacity: 0, x: -20 }}
                   onSubmit={handleNext}
                   className="space-y-4 md:space-y-6"
                 >
                   <div className="mb-6 flex items-center justify-between">
                      <div className="flex gap-1.5">
                         <div className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                         <div className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                      </div>
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Passo 1 de 2</span>
                   </div>
                   <h2 className="text-xl md:text-2xl font-black text-slate-900 uppercase tracking-tight">Dados do Hóspede</h2>
                   
                   <div className="space-y-3">
                      <div className="relative">
                        <User className="absolute left-4 top-4 text-slate-400" size={16} />
                        <input 
                          type="text" name="name" required placeholder="Nome Completo"
                          className="w-full bg-slate-50 border border-slate-100 rounded-xl md:rounded-2xl py-3.5 pl-11 pr-4 text-sm font-bold focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                          value={formData.name} onChange={handleInputChange}
                        />
                      </div>
                      <div className="relative">
                        <Mail className="absolute left-4 top-4 text-slate-400" size={16} />
                        <input 
                          type="email" name="email" required placeholder="Email de Contacto"
                          className="w-full bg-slate-50 border border-slate-100 rounded-xl md:rounded-2xl py-3.5 pl-11 pr-4 text-sm font-bold focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                          value={formData.email} onChange={handleInputChange}
                        />
                      </div>
                      <div className="relative">
                        <Phone className="absolute left-4 top-4 text-slate-400" size={16} />
                        <input 
                          type="tel" name="phone" required placeholder="Telemóvel"
                          className="w-full bg-slate-50 border border-slate-100 rounded-xl md:rounded-2xl py-3.5 pl-11 pr-4 text-sm font-bold focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                          value={formData.phone} onChange={handleInputChange}
                        />
                      </div>
                   </div>

                   <button 
                     type="submit"
                     className="w-full py-4 md:py-5 bg-slate-900 text-white rounded-xl md:rounded-2xl font-black uppercase tracking-widest text-[10px] md:text-xs flex items-center justify-center gap-2 hover:bg-black transition-all shadow-lg shadow-slate-900/10"
                   >
                     Prosseguir <ArrowRight size={16} />
                   </button>
                 </motion.form>
               )}

               {step === 'payment' && (
                 <motion.form 
                   key="payment-form"
                   initial={{ opacity: 0, x: 20 }}
                   animate={{ opacity: 1, x: 0 }}
                   exit={{ opacity: 0, x: -20 }}
                   onSubmit={handleNext}
                   className="space-y-4 md:space-y-6"
                 >
                   <div className="mb-6 flex items-center justify-between">
                      <div className="flex gap-1.5">
                         <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                         <div className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                      </div>
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Passo 2 de 2</span>
                   </div>
                   <h2 className="text-xl md:text-2xl font-black text-slate-900 uppercase tracking-tight">Pagamento</h2>
                   
                   <div className="space-y-2">
                      {paymentMethods.map((method) => {
                        const isSelected = paymentType === method.id;
                        return (
                          <button
                            key={method.id}
                            type="button"
                            onClick={() => setPaymentType(method.id as any)}
                            className={`w-full p-3 rounded-2xl border-2 transition-all flex items-center gap-3 text-left
                              ${isSelected ? 'border-blue-600 bg-blue-50/20' : 'border-slate-50 bg-slate-50/50 hover:border-slate-100'}`}
                          >
                            <div className={`p-2.5 rounded-xl transition-all ${isSelected ? 'bg-blue-600 text-white' : 'bg-white text-slate-400'}`}>
                              <method.icon size={16} />
                            </div>
                            <div className="flex-1">
                               <p className="font-black text-slate-900 text-[10px] uppercase tracking-tight">{method.title}</p>
                               <p className="text-[9px] text-slate-400 font-medium">{method.desc}</p>
                            </div>
                            {isSelected && <CheckCircle size={14} className="text-blue-600" />}
                          </button>
                        );
                      })}
                   </div>

                   <AnimatePresence mode="wait">
                      {paymentType === 'mbway' && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-2 overflow-hidden" key="mbway-input">
                          <input 
                            type="tel" name="mbwayPhone" required placeholder="Número MBWay"
                            className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3 px-4 text-sm font-bold focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            value={formData.mbwayPhone} onChange={handleInputChange}
                          />
                        </motion.div>
                      )}
                      {paymentType === 'transfer' && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-2 overflow-hidden" key="transfer-input">
                          <input 
                            type="text" name="cardNumber" required placeholder="Número do Cartão"
                            className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3 px-4 text-sm font-bold focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            value={formData.cardNumber} onChange={handleInputChange}
                          />
                          <div className="grid grid-cols-2 gap-2">
                            <input 
                              type="text" name="expiry" required placeholder="MM/AA"
                              className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3 px-4 text-sm font-bold focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                              value={formData.expiry} onChange={handleInputChange}
                            />
                            <input 
                              type="password" name="cvv" required placeholder="CVV" maxLength={3}
                              className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3 px-4 text-sm font-bold focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                              value={formData.cvv} onChange={handleInputChange}
                            />
                          </div>
                        </motion.div>
                      )}
                   </AnimatePresence>

                   <button 
                     type="submit"
                     disabled={isProcessing}
                     className={`w-full py-4 md:py-5 rounded-xl md:rounded-2xl font-black uppercase tracking-widest text-[10px] md:text-xs flex items-center justify-center gap-2 transition-all
                       ${isProcessing ? 'bg-slate-100 text-slate-400' : 'bg-blue-600 text-white shadow-xl shadow-blue-500/20 hover:bg-blue-700'}`}
                   >
                     {isProcessing ? (
                       <>
                         <div className="w-3.5 h-3.5 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin" />
                         Processando...
                       </>
                     ) : (
                       <>Finalizar Reserva <Check size={16} /></>
                     )}
                   </button>
                 </motion.form>
               )}

               {step === 'success' && (
                 <motion.div 
                   key="success-view"
                   initial={{ opacity: 0, scale: 0.9 }}
                   animate={{ opacity: 1, scale: 1 }}
                   className="flex flex-col items-center py-8"
                 >
                    <div className="w-24 h-24 bg-green-50 text-green-600 rounded-[2.5rem] flex items-center justify-center mb-6 shadow-xl shadow-green-100 animate-bounce">
                       <CheckCircle size={48} />
                    </div>
                    <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter mb-2">Reserva Confirmada!</h2>
                    
                    <div className="bg-slate-50 px-4 py-2 rounded-full border border-slate-100 mb-4">
                       <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mr-2">ID Reserva:</span>
                       <span className="text-xs font-black text-blue-600">#AZ-{(Math.random() * 100000).toFixed(0)}</span>
                    </div>

                    <p className="text-sm text-slate-500 font-medium leading-relaxed max-w-xs mb-8">
                       O seu quarto no <span className="text-slate-900 font-bold">{itinerary.hotel?.name}</span> foi reservado com sucesso. Receberá a confirmação por email e na aplicação em breve.
                    </p>
                    <button 
                      onClick={onComplete}
                      className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:scale-105 active:scale-95 transition-all shadow-xl shadow-slate-900/20"
                    >
                      Concluir Processo
                    </button>
                 </motion.div>
               )}
             </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default BookingCheckoutModal;
