
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
  onShowMap?: (url: string) => void;
}

const OfficeBookingModal: React.FC<OfficeBookingModalProps> = ({
  office,
  onClose,
  language = 'pt',
  onSuccess,
  userProfile,
  onShowMap
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
        : 'https://azorestoyou-o5yx.onrender.com';

      const resData = {
        id: Math.random().toString(36).substr(2, 9),
        businessId: office.id,
        businessType: office.businessType || 'office',
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

      const res = await fetch(`${API_BASE_URL}/api/reservations`, {
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
        <button onClick={onClose} className="absolute top-4 right-4 z-10 p-2 bg-slate-100 text-slate-400 rounded-xl hover:bg-slate-200 transition-colors">
          <X size={18} />
        </button>

        <div className="p-4 md:p-8 pb-0">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shadow-sm">
              <Briefcase size={20} />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-800 tracking-tight uppercase">Agendar Visita</h2>
              <p className="text-[10px] font-bold text-slate-400">{office.name}</p>
            </div>
          </div>

          <div className="flex gap-1.5 mb-4 p-1 bg-slate-50 rounded-xl border border-slate-100">
            {['Data e Hora', 'Seus Dados', 'Concluído'].map((s, i) => (
              <div key={i} className={`flex-1 py-1.5 text-[8px] font-black uppercase text-center rounded-lg transition-all ${(i === 0 && step === 'datetime') || (i === 1 && step === 'details') || (i === 2 && step === 'success')
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-slate-300'
                }`}>
                {s}
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 md:p-8 pt-0 overflow-y-auto max-h-[65vh]">
          {office.isConfirmed === false ? (
            <div className="bg-amber-500/10 border border-amber-500/20 p-5 rounded-[1.75rem] flex items-start gap-3 text-amber-800 text-left my-4">
              <span className="text-xl">ℹ️</span>
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-amber-700">Apenas Informativo</h4>
                <p className="text-[11px] font-medium leading-relaxed mt-1 text-amber-600">
                  Este negócio está configurado em modo de visualização. Pode consultar os contactos, ementa, morada e galeria, mas as reservas e agendamentos estão temporariamente indisponíveis.
                </p>
              </div>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              {step === 'datetime' && (
                <motion.div key="datetime" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                    <div className="flex justify-between items-center mb-3">
                      <button onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1))} className="p-1.5 hover:bg-white rounded-lg transition-colors"><ChevronLeft size={14} /></button>
                      <span className="text-[10px] font-black uppercase tracking-widest">{monthNames[calendarMonth.getMonth()]} {calendarMonth.getFullYear()}</span>
                      <button onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1))} className="p-1.5 hover:bg-white rounded-lg transition-colors"><ChevronRight size={14} /></button>
                    </div>
                    <div className="grid grid-cols-7 gap-0.5">
                      {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((d, idx) => <div key={`${d}-${idx}`} className="text-center text-[8px] font-black text-slate-300 py-0.5">{d}</div>)}
                      {Array.from({ length: firstDay(calendarMonth.getFullYear(), calendarMonth.getMonth()) }).map((_, i) => <div key={i} />)}
                      {Array.from({ length: daysInMonth(calendarMonth.getFullYear(), calendarMonth.getMonth()) }).map((_, i) => {
                        const day = i + 1;
                        const date = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), day);
                        const isSelected = selectedDate.toDateString() === date.toDateString();
                        const isPast = date < new Date(new Date().setHours(0, 0, 0, 0));
                        return (
                          <button key={i} disabled={isPast} onClick={() => setSelectedDate(date)} className={`h-8 w-8 rounded-lg text-[10px] font-bold transition-all ${isSelected ? 'bg-blue-600 text-white shadow-md' : isPast ? 'text-slate-200 cursor-not-allowed' : 'text-slate-600 hover:bg-white hover:text-blue-600'
                            }`}>{day}</button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-2 flex items-center gap-2">
                      <Clock size={12} /> Horário Disponível
                    </h4>
                    <div className="grid grid-cols-4 gap-1.5">
                      {timeSlots.map(t => (
                        <button key={t} onClick={() => setSelectedTime(t)} className={`py-2 rounded-lg text-[10px] font-black transition-all border ${selectedTime === t ? 'bg-blue-600 text-white border-blue-600 shadow-md' : 'bg-white text-slate-600 border-slate-100 hover:border-blue-200'
                          }`}>{t}</button>
                      ))}
                    </div>
                  </div>

                  <button
                    disabled={!selectedTime}
                    onClick={handleNext}
                    className={`w-full py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest flex items-center justify-center gap-3 transition-all ${selectedTime ? 'bg-slate-900 text-white shadow-xl hover:bg-blue-600' : 'bg-slate-100 text-slate-300 cursor-not-allowed'
                      }`}
                  >
                    Próximo Passo <ArrowRight size={16} />
                  </button>
                </motion.div>
              )}

              {step === 'details' && (
                <motion.div key="details" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                  <div className="space-y-3">
                    <div>
                      <label className="block text-[9px] font-black uppercase text-slate-400 mb-1 tracking-widest">Nome Completo</label>
                      <div className="relative flex items-center">
                        <User className="absolute left-4 text-slate-400" size={16} />
                        <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-medium text-slate-700" placeholder="ex: João Silva" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[9px] font-black uppercase text-slate-400 mb-1 tracking-widest">Contacto Telefónico</label>
                      <div className="relative flex items-center">
                        <Phone className="absolute left-4 text-slate-400" size={16} />
                        <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-medium text-slate-700" placeholder="ex: 912 345 678" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[9px] font-black uppercase text-slate-400 mb-1 tracking-widest">Endereço de Email</label>
                      <div className="relative flex items-center">
                        <Mail className="absolute left-4 text-slate-400" size={16} />
                        <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-medium text-slate-700" placeholder="ex: viajor@email.com" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[9px] font-black uppercase text-slate-400 mb-1 tracking-widest">Notas Especiais (Opcional)</label>
                      <div className="relative flex items-start">
                        <MessageSquare className="absolute left-4 top-4 text-slate-400" size={16} />
                        <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3} className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-medium text-slate-700 resize-none" placeholder="Ex: Preciso de acesso a cadeira de rodas..." />
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button onClick={() => setStep('datetime')} className="px-6 py-4 bg-slate-100 text-slate-600 rounded-2xl font-black uppercase text-[11px] tracking-widest hover:bg-slate-200 transition-all flex items-center justify-center gap-2">
                      Voltar
                    </button>
                    <button
                      disabled={!name || !phone || !email || isSubmitting}
                      onClick={handleSubmit}
                      className={`flex-1 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${name && phone && email && !isSubmitting ? 'bg-blue-600 text-white shadow-xl hover:bg-blue-700' : 'bg-slate-100 text-slate-300 cursor-not-allowed'
                        }`}
                    >
                      {isSubmitting ? 'A enviar...' : 'Solicitar Visita'} <CheckCircle size={16} />
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
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default OfficeBookingModal;
