
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Check, CreditCard, User, Mail, Phone, ArrowRight, ShieldCheck, Wallet, Star, CheckCircle, Clock } from 'lucide-react';
import { Itinerary } from '../types';

interface BookingCheckoutModalProps {
  itinerary: Itinerary;
  onClose: () => void;
  onComplete: () => void;
}

const BookingCheckoutModal: React.FC<BookingCheckoutModalProps> = ({ itinerary, onClose, onComplete }) => {
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

  if (!itinerary) return null;

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
  const carTotal = itinerary.car ? (itinerary.car.pricePerDay * itinerary.carDays) : 0;
  const taxiTotal = itinerary.taxi ? itinerary.taxi.price : 0;
  const total = baseStayPrice + roomUpgradePrice + extrasTotal + carTotal + taxiTotal;

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
                  {itinerary.car && (
                     <div className="flex justify-between text-xs">
                       <span className="text-slate-400 font-medium">Aluguer Carro ({itinerary.carDays} dias)</span>
                       <span className="text-slate-900 font-bold">€{carTotal}</span>
                     </div>
                   )}

                   {itinerary.taxi && (
                     <div className="flex justify-between text-xs">
                       <span className="text-slate-400 font-medium">Taxi / Transfer</span>
                       <span className="text-slate-900 font-bold">€{taxiTotal}</span>
                     </div>
                   )}
                </div>

                <div className="mt-6 pt-6 border-t border-slate-200">
                   <div className="flex justify-between items-center">
                      <span className="text-xs font-black text-slate-900 uppercase">Total</span>
                      <span className="text-xl font-black text-blue-600 tracking-tighter">€{total}</span>
                   </div>
                   <div className="mt-2 flex items-center gap-1.5 text-[8px] font-bold text-slate-400 uppercase tracking-widest">
                      <ShieldCheck size={10} className="text-green-500" />
                      Garantia Azores4you
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
                   
                   <div className="space-y-4">
                      <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1.5 block">Nome do Titular</label>
                        <div className="relative group">
                           <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                           <input 
                             required
                             name="name"
                             value={formData.name}
                             onChange={handleInputChange}
                             placeholder="Ex: João Silva"
                             className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-3.5 pl-12 pr-4 focus:bg-white focus:border-blue-600 focus:outline-none transition-all text-sm font-bold placeholder:text-slate-300"
                           />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1.5 block">Email</label>
                           <div className="relative group">
                              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                              <input 
                                required
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                placeholder="joao@email.com"
                                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-3.5 pl-12 pr-4 focus:bg-white focus:border-blue-600 focus:outline-none transition-all text-sm font-bold placeholder:text-slate-300"
                              />
                           </div>
                        </div>
                        <div>
                           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1.5 block">Telemóvel</label>
                           <div className="relative group">
                              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                              <input 
                                required
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                placeholder="912 345 678"
                                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-3.5 pl-12 pr-4 focus:bg-white focus:border-blue-600 focus:outline-none transition-all text-sm font-bold placeholder:text-slate-300"
                              />
                           </div>
                        </div>
                      </div>
                   </div>

                   <button 
                     type="submit"
                     className="w-full bg-slate-900 hover:bg-black text-white font-black py-4 rounded-2xl shadow-xl shadow-slate-200 flex items-center justify-center gap-3 active:scale-[0.98] transition-all uppercase tracking-widest text-xs"
                   >
                     Seguinte
                     <ArrowRight size={16} />
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
                   
                   <div className="grid grid-cols-2 gap-3">
                    {paymentMethods.map((method) => {
                      const Icon = method.icon;
                      return (
                        <button
                          key={method.id}
                          type="button"
                          onClick={() => setPaymentType(method.id as any)}
                          className={`flex flex-col items-center justify-center p-4 rounded-3xl border-2 transition-all gap-2 group active:scale-95
                            ${paymentType === method.id 
                              ? 'bg-blue-600 border-blue-600 shadow-lg shadow-blue-200' 
                              : 'bg-white border-slate-100 hover:border-blue-200 hover:bg-slate-50'}`}
                        >
                          <div className={`p-2.5 rounded-2xl transition-colors
                            ${paymentType === method.id ? 'bg-white/20' : 'bg-slate-100 group-hover:bg-blue-50'}`}>
                            <Icon size={22} className={paymentType === method.id ? 'text-white' : 'text-slate-500 group-hover:text-blue-600'} />
                          </div>
                          <div className="text-center">
                            <p className={`text-[10px] font-black uppercase tracking-tighter
                              ${paymentType === method.id ? 'text-white' : 'text-slate-900'}`}>{method.title}</p>
                          </div>
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
                    <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter mb-2">Pedido Enviado!</h2>
                    
                    <div className="bg-blue-600 text-white px-6 py-3 rounded-2xl border-2 border-blue-700 mb-6 shadow-lg transform -rotate-2">
                       <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80 mb-1">Ticket Único de Reserva</p>
                       <span className="text-xl font-black tracking-widest">#AZ-{(Math.random() * 100000).toFixed(0)}-{new Date().getFullYear()}</span>
                    </div>

                    <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 mb-8 max-w-sm text-center">
                       <p className="text-sm text-slate-600 font-bold leading-relaxed">
                          {itinerary.car 
                            ? "O seu pedido de reserva foi enviado com sucesso. Por favor, aguarde pela aprovação final por parte do Hotel e da Rent-a-car."
                            : "O seu pedido de reserva foi enviado com sucesso. Por favor, aguarde pela aprovação final por parte do Hotel."
                          }
                       </p>
                       <div className="mt-4 flex items-center justify-center gap-2 text-[10px] font-black text-blue-600 uppercase tracking-widest">
                          <Clock size={14} className="animate-pulse" />
                          Tempo médio de resposta: 15 min
                       </div>
                    </div>
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
