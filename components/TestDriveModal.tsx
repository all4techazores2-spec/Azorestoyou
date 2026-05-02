
import React, { useState } from 'react';
import { Business, Language, Car } from '../types';
import { X, Calendar, Clock, User, Phone, Mail, CheckCircle, ArrowRight, ChevronLeft, ChevronRight, Car as CarIcon, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface TestDriveModalProps {
  stand: Business;
  car: Car;
  onClose: () => void;
  language?: Language;
  onSuccess?: (resData: any, standName: string, standId: string) => void;
  userProfile?: { email: string; name: string; phone: string };
}

const TestDriveModal: React.FC<TestDriveModalProps> = ({
  stand,
  car,
  onClose,
  language = 'pt',
  onSuccess,
  userProfile
}) => {
  const [step, setStep] = useState<'datetime' | 'details' | 'success'>('datetime');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [name, setName] = useState(userProfile?.name || '');
  const [phone, setPhone] = useState(userProfile?.phone || '');
  const [email, setEmail] = useState(userProfile?.email || '');
  const [hasLicense, setHasLicense] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const timeSlots = ['10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00'];

  const handleSubmit = async () => {
    if (!hasLicense) {
       alert(language === 'pt' ? 'Deve confirmar que possui carta de condução válida.' : 'You must confirm you have a valid driver license.');
       return;
    }
    setIsSubmitting(true);
    try {
      const API_BASE_URL = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
        ? 'http://localhost:3001'
        : 'https://azorestoyou-1.onrender.com';

      const resData = {
        id: `TD-${Math.random().toString(36).substr(2, 9)}`,
        businessId: stand.id,
        businessName: stand.name,
        carModel: car.model,
        carId: car.id,
        date: selectedDate.toISOString().split('T')[0],
        time: selectedTime,
        customerName: name,
        customerPhone: phone,
        customerEmail: email,
        status: 'pending',
        type: 'test_drive'
      };

      const res = await fetch(`${API_BASE_URL}/api/offices/${stand.id}/reservations`, { // Reusing office endpoint for simplicity or can add a generic one
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(resData),
      });

      if (res.ok) {
        onSuccess?.(resData, stand.name, stand.id);
        setStep('success');
        setTimeout(onClose, 3000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calendar Logic
  const [calendarMonth, setCalendarMonth] = useState(new Date());
  const daysInMonth = (y: number, m: number) => new Date(y, m + 1, 0).getDate();
  const firstDay = (y: number, m: number) => new Date(y, m, 1).getDay();
  const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-[2.5rem] w-full max-w-lg overflow-hidden shadow-2xl relative"
      >
        <button onClick={onClose} className="absolute top-6 right-6 z-10 p-2 bg-slate-100 text-slate-400 rounded-xl hover:bg-slate-200 transition-colors">
          <X size={20} />
        </button>

        <div className="p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shadow-sm">
              <CarIcon size={24} />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-800 tracking-tight uppercase">Agendar Test Drive</h2>
              <p className="text-xs font-bold text-slate-400">{car.model} • {stand.name}</p>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {step === 'datetime' && (
              <motion.div key="datetime" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                <div className="bg-slate-50 p-4 rounded-3xl border border-slate-100">
                  <div className="flex justify-between items-center mb-4">
                    <button onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1))} className="p-2 hover:bg-white rounded-xl transition-colors"><ChevronLeft size={16} /></button>
                    <span className="text-xs font-black uppercase tracking-widest">{monthNames[calendarMonth.getMonth()]} {calendarMonth.getFullYear()}</span>
                    <button onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1))} className="p-2 hover:bg-white rounded-xl transition-colors"><ChevronRight size={16} /></button>
                  </div>
                  <div className="grid grid-cols-7 gap-1">
                    {['D','S','T','Q','Q','S','S'].map((d, i) => <div key={i} className="text-center text-[9px] font-black text-slate-300 py-1">{d}</div>)}
                    {Array.from({ length: firstDay(calendarMonth.getFullYear(), calendarMonth.getMonth()) }).map((_, i) => <div key={i} />)}
                    {Array.from({ length: daysInMonth(calendarMonth.getFullYear(), calendarMonth.getMonth()) }).map((_, i) => {
                      const day = i + 1;
                      const date = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), day);
                      const isSelected = selectedDate.toDateString() === date.toDateString();
                      const isPast = date < new Date(new Date().setHours(0,0,0,0));
                      return (
                        <button key={i} disabled={isPast} onClick={() => setSelectedDate(date)} className={`h-9 w-9 rounded-xl text-xs font-bold transition-all ${
                          isSelected ? 'bg-blue-600 text-white shadow-lg' : isPast ? 'text-slate-200 cursor-not-allowed' : 'text-slate-600 hover:bg-white hover:text-blue-600'
                        }`}>{day}</button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-2">
                  {timeSlots.map(t => (
                    <button key={t} onClick={() => setSelectedTime(t)} className={`py-2.5 rounded-xl text-xs font-black transition-all border ${
                      selectedTime === t ? 'bg-blue-600 text-white border-blue-600 shadow-md' : 'bg-white text-slate-600 border-slate-100 hover:border-blue-200'
                    }`}>{t}</button>
                  ))}
                </div>

                <button 
                  disabled={!selectedTime}
                  onClick={() => setStep('details')}
                  className={`w-full py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest flex items-center justify-center gap-3 transition-all ${
                    selectedTime ? 'bg-slate-900 text-white shadow-xl hover:bg-blue-600' : 'bg-slate-100 text-slate-300 cursor-not-allowed'
                  }`}
                >
                  Continuar <ArrowRight size={16} />
                </button>
              </motion.div>
            )}

            {step === 'details' && (
              <motion.div key="details" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                <div className="space-y-3">
                  <input value={name} onChange={e => setName(e.target.value)} placeholder="Nome Completo" className="w-full px-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500/20" />
                  <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="Telemóvel" className="w-full px-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500/20" />
                  <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" className="w-full px-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500/20" />
                </div>

                <button 
                  onClick={() => setHasLicense(!hasLicense)}
                  className={`w-full p-4 rounded-2xl border-2 transition-all flex items-center gap-4 text-left ${
                    hasLicense ? 'border-blue-600 bg-blue-50/50' : 'border-slate-100 bg-slate-50/50'
                  }`}
                >
                  <div className={`p-2 rounded-lg ${hasLicense ? 'bg-blue-600 text-white' : 'bg-white text-slate-300'}`}>
                    <ShieldCheck size={16} />
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] font-black uppercase text-slate-900">Possuo Carta de Condução</p>
                    <p className="text-[9px] text-slate-500 font-bold">Válida para a categoria do veículo</p>
                  </div>
                  {hasLicense && <CheckCircle size={16} className="text-blue-600" />}
                </button>

                <div className="flex gap-3 pt-2">
                  <button onClick={() => setStep('datetime')} className="px-6 py-4 bg-slate-100 text-slate-500 rounded-2xl font-black text-[11px] uppercase tracking-widest">Voltar</button>
                  <button 
                    disabled={isSubmitting || !name || !phone || !hasLicense}
                    onClick={handleSubmit}
                    className="flex-1 py-4 bg-slate-900 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl disabled:bg-slate-100 disabled:text-slate-300"
                  >
                    {isSubmitting ? 'Agendando...' : 'Confirmar Test Drive'}
                  </button>
                </div>
              </motion.div>
            )}

            {step === 'success' && (
              <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="py-12 text-center space-y-6">
                <div className="w-20 h-20 bg-green-50 text-green-600 rounded-[2rem] flex items-center justify-center mx-auto shadow-xl shadow-green-100 animate-bounce">
                  <CheckCircle size={40} />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Test Drive Agendado!</h3>
                  <p className="text-sm text-slate-500 font-medium mt-2 max-w-[280px] mx-auto leading-relaxed">
                    A sua solicitação para o {car.model} foi enviada. O stand entrará em contacto para confirmar.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default TestDriveModal;
