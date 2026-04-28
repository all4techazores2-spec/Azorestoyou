
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface DatePickerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (startDate: Date, endDate: Date) => void;
  initialStartDate?: Date;
  initialEndDate?: Date;
  title: string;
  minDate?: Date;
  unavailableDates?: Date[];
}

const DatePicker: React.FC<DatePickerProps> = ({
  isOpen,
  onClose,
  onSelect,
  initialStartDate,
  initialEndDate,
  title,
  minDate = new Date(),
  unavailableDates = []
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date(initialStartDate || new Date()));
  const [startDate, setStartDate] = useState<Date | null>(initialStartDate || null);
  const [endDate, setEndDate] = useState<Date | null>(initialEndDate || null);

  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const isUnavailable = (date: Date) => {
    return unavailableDates.some(d => 
      d.getFullYear() === date.getFullYear() &&
      d.getMonth() === date.getMonth() &&
      d.getDate() === date.getDate()
    );
  };

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const handleDateClick = (day: number) => {
    const clickedDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    
    if (isUnavailable(clickedDate)) return;

    if (!startDate || (startDate && endDate)) {
      setStartDate(clickedDate);
      setEndDate(null);
    } else if (startDate && !endDate) {
      if (clickedDate < startDate) {
        setStartDate(clickedDate);
      } else {
        // Check if any date in the range is unavailable
        let hasUnavailable = false;
        const tempDate = new Date(startDate);
        while (tempDate <= clickedDate) {
          if (isUnavailable(tempDate)) {
            hasUnavailable = true;
            break;
          }
          tempDate.setDate(tempDate.getDate() + 1);
        }

        if (!hasUnavailable) {
          setEndDate(clickedDate);
        } else {
          // If range contains unavailable date, reset start to clicked date
          setStartDate(clickedDate);
        }
      }
    }
  };

  const handleConfirm = () => {
    if (startDate && endDate) {
      onSelect(startDate, endDate);
      onClose();
    }
  };

  const isSelected = (day: number) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    return (startDate && date.getTime() === startDate.getTime()) || (endDate && date.getTime() === endDate.getTime());
  };

  const isInRange = (day: number) => {
    if (!startDate || !endDate) return false;
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    return date > startDate && date < endDate;
  };

  const isPast = (day: number) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const monthNames = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ];

  const weekDays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div 
          initial={{ opacity: 0, scale: 0.98, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.98, y: 10 }}
          className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-sm overflow-hidden border border-white/20"
        >
          <div className="px-8 pt-8 pb-4 flex justify-between items-center">
            <h3 className="text-lg font-black text-slate-900 tracking-tight">{title}</h3>
            <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-full transition-all active:scale-90">
              <X className="w-4 h-4 text-slate-400" />
            </button>
          </div>

          <div className="px-8 pb-8">
            <div className="flex justify-between items-center mb-6">
              <button onClick={handlePrevMonth} className="p-2 hover:bg-slate-50 rounded-xl transition-colors">
                <ChevronLeft className="w-4 h-4 text-slate-400" />
              </button>
              <span className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em]">
                {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
              </span>
              <button onClick={handleNextMonth} className="p-2 hover:bg-slate-50 rounded-xl transition-colors">
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            <div className="grid grid-cols-7 gap-0 mb-2">
              {weekDays.map(day => (
                <div key={day} className="text-center text-[9px] font-black text-slate-300 uppercase tracking-widest py-2">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-y-1">
              {Array.from({ length: firstDayOfMonth(currentMonth.getFullYear(), currentMonth.getMonth()) }).map((_, i) => (
                <div key={`empty-${i}`} className="h-9 w-9" />
              ))}
              {Array.from({ length: daysInMonth(currentMonth.getFullYear(), currentMonth.getMonth()) }).map((_, i) => {
                const day = i + 1;
                const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
                const past = isPast(day);
                const unavailable = isUnavailable(date);
                const selected = isSelected(day);
                const inRange = isInRange(day);

                return (
                  <div key={day} className="flex justify-center">
                    <button
                      disabled={past || unavailable}
                      onClick={() => handleDateClick(day)}
                      className={`
                        relative h-9 w-9 flex items-center justify-center rounded-full text-[11px] font-bold transition-all
                        ${(past || unavailable) ? 'text-slate-200 cursor-not-allowed' : 'text-slate-600 hover:bg-slate-900 hover:text-white'}
                        ${unavailable ? 'text-red-200 line-through' : ''}
                        ${selected ? 'bg-slate-900 text-white shadow-xl shadow-slate-200 z-10' : ''}
                        ${inRange ? 'bg-slate-100 text-slate-900 rounded-none w-full' : ''}
                      `}
                    >
                      {day}
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="mt-8 space-y-4">
              <div className="flex justify-between items-center bg-slate-50/50 border border-slate-100 p-4 rounded-2xl">
                <div className="text-center flex-1">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Início</p>
                  <p className="text-xs font-bold text-slate-900">
                    {startDate ? startDate.toLocaleDateString('pt-PT') : '---'}
                  </p>
                </div>
                <div className="w-px h-6 bg-slate-200" />
                <div className="text-center flex-1">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Fim</p>
                  <p className="text-xs font-bold text-slate-900">
                    {endDate ? endDate.toLocaleDateString('pt-PT') : '---'}
                  </p>
                </div>
              </div>

              <button
                disabled={!startDate || !endDate}
                onClick={handleConfirm}
                className={`
                  w-full py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all active:scale-95
                  ${(!startDate || !endDate) 
                    ? 'bg-slate-100 text-slate-300 cursor-not-allowed' 
                    : 'bg-slate-900 text-white shadow-2xl shadow-slate-200 hover:bg-black'}
                `}
              >
                Confirmar Período
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default DatePicker;
