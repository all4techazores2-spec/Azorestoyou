
import React, { useState } from 'react';
import { Business, Language } from '../types';
import { X, Calendar, Clock, User, Phone, Mail, MessageSquare, CheckCircle, ArrowRight, ChevronLeft, ChevronRight, Briefcase } from 'lucide-react';
import { COLORS } from '../constants';
import { motion, AnimatePresence } from 'motion/react';

interface OfficeBookingModalProps {
  office: Business | null;
  onClose: () => void;
  language?: Language;
  onSuccess?: (resData: any, officeName: string, officeId: string) => void;
  userProfile?: { email: string; name: string; phone: string };
}

const OfficeBookingModal: React.FC<OfficeBookingModalProps> = ({
  office,
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
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!office) return null;

  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00'
  ];

  const handleNext = () => {
    if (step === 'datetime' && selectedTime) {
      setStep('details');
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const API_BASE_URL = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
        ? 'http://localhost:3001'
        : 'https://azorestoyou-1.onrender.com';

      const resData = {
        id: Math.random().toString(36).substr(2, 9),
        officeId: office.id,
        officeName: office.name,
        date: selectedDate.toISOString().split('T')[0],
        time: selectedTime,
        customerName: name,
        customerPhone: phone,
        customerEmail: email,
        notes,
        status: 'pending',
        type: 'office_visit'
      };

      const res = await fetch(`${API_BASE_URL}/api/offices/${office.id}/reservations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(resData),
      });

      if (res.ok) {
        const data = await res.json();
        onSuccess?.(data, office.name, office.id);
        setStep('success');
        setTimeout(onClose, 3000);
      } else {
        alert('Erro ao solicitar agendamento.');
      }
    } catch (err) {
      console.error(err);
      alert('Erro de conexão.');
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
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white rounded-[2.5rem] w-full max-w-lg overflow-hidden shadow-2xl flex flex-col relative"
      >
        <button onClick={onClose} className="absolute top-6 right-6 z-10 p-2 bg-slate-100 text-slate-400 rounded-xl hover:bg-slate-200 transition-colors">
          <X size={20} />
        </button>

        <div className="p-8 pb-0">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shadow-sm">
              <Briefcase size={24} />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-800 tracking-tight uppercase">Agendar Visita</h2>
              <p className="text-xs font-bold text-slate-400">{office.name}</p>
            </div>
          </div>

          <div className="flex gap-2 mb-8 p-1 bg-slate-50 rounded-2xl border border-slate-100">
             {['Data e Hora', 'Seus Dados', 'Concluído'].map((s, i) => (
               <div key={i} className={`flex-1 py-2 text-[10px] font-black uppercase text-center rounded-xl transition-all ${
                 (i === 0 && step === 'datetime') || (i === 1 && step === 'details') || (i === 2 && step === 'success')
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-slate-300'
               }`}>
                 {s}
               </div>
             ))}
          </div>
        </div>

        <div className="p-8 pt-0 overflow-y-auto max-h-[70vh]">
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
                    {['D','S','T','Q','Q','S','S'].map((d, idx) => <div key={`${d}-${idx}`} className="text-center text-[9px] font-black text-slate-300 py-1">{d}</div>)}
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

                <div>
                  <h4 className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Clock size={14} /> Horário Disponível
                  </h4>
                  <div className="grid grid-cols-4 gap-2">
                    {timeSlots.map(t => (
                      <button key={t} onClick={() => setSelectedTime(t)} className={`py-2.5 rounded-xl text-xs font-black transition-all border ${
                        selectedTime === t ? 'bg-blue-600 text-white border-blue-600 shadow-md' : 'bg-white text-slate-600 border-slate-100 hover:border-blue-200'
                      }`}>{t}</button>
                    ))}
                  </div>
                </div>

                <button 
                  disabled={!selectedTime}
                  onClick={handleNext}
                  className={`w-full py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest flex items-center justify-center gap-3 transition-all ${
                    selectedTime ? 'bg-slate-900 text-white shadow-xl hover:bg-blue-600' : 'bg-slate-100 text-slate-300 cursor-not-allowed'
                  }`}
                >
                  Próximo Passo <ArrowRight size={16} />
                </button>
              </motion.div>
            )}

            {step === 'details' && (
              <motion.div key="details" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                <div className="space-y-3">
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                    <input value={name} onChange={e => setName(e.target.value)} placeholder="Nome Completo" className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500/20" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                      <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="Telemóvel" className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500/20" />
                    </div>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                      <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500/20" />
                    </div>
                  </div>
                  <div className="relative">
                    <MessageSquare className="absolute left-4 top-5 text-slate-300" size={16} />
                    <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Assunto ou notas adicionais..." rows={4} className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500/20 resize-none" />
                  </div>
                </div>

                <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 mb-4">
                  <p className="text-[10px] font-bold text-blue-600 leading-relaxed">
                    O seu pedido será enviado para o escritório e ficará a aguardar confirmação. Receberá uma notificação assim que for aprovado.
                  </p>
                </div>

                <div className="flex gap-3">
                  <button onClick={() => setStep('datetime')} className="px-6 py-4 bg-slate-100 text-slate-500 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-slate-200 transition-all">Voltar</button>
                  <button 
                    disabled={isSubmitting || !name || !phone}
                    onClick={handleSubmit}
                    className="flex-1 py-4 bg-slate-900 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl disabled:bg-slate-100 disabled:text-slate-300"
                  >
                    {isSubmitting ? 'Enviando...' : 'Solicitar Agendamento'}
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
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Pedido Enviado!</h3>
                  <p className="text-sm text-slate-500 font-medium mt-2 max-w-[280px] mx-auto leading-relaxed">
                    O seu pedido de agendamento foi submetido com sucesso. Aguarde pela nossa confirmação.
                  </p>
                </div>
                <div className="bg-slate-50 p-4 rounded-3xl border border-slate-100 text-left space-y-2">
                   <div className="flex justify-between text-xs font-bold"><span className="text-slate-400 uppercase text-[9px] tracking-widest">Escritório</span> <span>{office.name}</span></div>
                   <div className="flex justify-between text-xs font-bold"><span className="text-slate-400 uppercase text-[9px] tracking-widest">Data</span> <span>{selectedDate.toLocaleDateString()}</span></div>
                   <div className="flex justify-between text-xs font-bold"><span className="text-slate-400 uppercase text-[9px] tracking-widest">Hora</span> <span>{selectedTime}</span></div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default OfficeBookingModal;
