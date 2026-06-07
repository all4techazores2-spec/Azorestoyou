import React, { useState, useEffect } from 'react';
import { 
  Compass, Coffee, ShieldAlert, Sparkles, Flame, User, Clock, 
  MapPin, CheckCircle, Wifi, HelpCircle, PhoneCall, AlertCircle, 
  ChevronRight, ArrowLeft, RefreshCw, ShoppingCart, Plus, Minus, Send, Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { API_BASE_URL } from '../config';

interface HotelRoomServiceProps {
  hotelId: string;
  roomId: string;
  qrToken: string;
  onBackToApp?: () => void;
}

interface RequestItem {
  id: string;
  name: string;
  price: number;
  description?: string;
  estimatedTime?: string; // in minutes
  isActive: boolean;
}

export default function HotelRoomService({ hotelId, roomId, qrToken, onBackToApp }: HotelRoomServiceProps) {
  const [hotel, setHotel] = useState<any>(null);
  const [room, setRoom] = useState<any>(null);
  const [activeReservation, setActiveReservation] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // UI state
  const [activeCategory, setActiveCategory] = useState<'quick' | 'maintenance' | 'housekeeping' | 'extras' | 'info'>('quick');
  const [selectedItem, setSelectedItem] = useState<RequestItem | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // POS menu items (overridable by hotel config if present)
  const [menuItems, setMenuItems] = useState<{
    quick: RequestItem[];
    maintenance: RequestItem[];
    housekeeping: RequestItem[];
    extras: RequestItem[];
  }>({
    quick: [
      { id: 'q_water', name: 'Água', price: 0, estimatedTime: '5', isActive: true },
      { id: 'q_coffee', name: 'Café', price: 0, estimatedTime: '5', isActive: true },
      { id: 'q_towels', name: 'Toalhas extra', price: 0, estimatedTime: '10', isActive: true },
      { id: 'q_pillows', name: 'Almofadas extra', price: 0, estimatedTime: '10', isActive: true },
      { id: 'q_blanket', name: 'Cobertor extra', price: 0, estimatedTime: '10', isActive: true },
      { id: 'q_ice', name: 'Gelo', price: 0, estimatedTime: '5', isActive: true },
      { id: 'q_bf', name: 'Pequeno-almoço no quarto', price: 15, estimatedTime: '20', isActive: true },
      { id: 'q_champagne', name: 'Champanhe', price: 30, estimatedTime: '15', isActive: true },
      { id: 'q_wine', name: 'Garrafa de vinho', price: 20, estimatedTime: '15', isActive: true },
    ],
    maintenance: [
      { id: 'm_ac', name: 'Ar condicionado', price: 0, estimatedTime: '30', isActive: true },
      { id: 'm_light', name: 'Luz fundida', price: 0, estimatedTime: '20', isActive: true },
      { id: 'm_tv', name: 'TV avariada', price: 0, estimatedTime: '30', isActive: true },
      { id: 'm_wifi', name: 'Wi-Fi lento/offline', price: 0, estimatedTime: '15', isActive: true },
      { id: 'm_water', name: 'Sem água quente', price: 0, estimatedTime: '30', isActive: true },
      { id: 'm_toilet', name: 'Casa de banho entupida', price: 0, estimatedTime: '20', isActive: true },
      { id: 'm_door', name: 'Fechadura/porta', price: 0, estimatedTime: '15', isActive: true },
      { id: 'm_noise', name: 'Problema de ruído', price: 0, estimatedTime: '15', isActive: true },
      { id: 'm_other', name: 'Outro problema', price: 0, estimatedTime: '30', isActive: true },
    ],
    housekeeping: [
      { id: 'h_clean', name: 'Pedir limpeza de quarto', price: 0, estimatedTime: '60', isActive: true },
      { id: 'h_towels', name: 'Trocar toalhas', price: 0, estimatedTime: '15', isActive: true },
      { id: 'h_sheets', name: 'Trocar lençóis de cama', price: 0, estimatedTime: '20', isActive: true },
      { id: 'h_paper', name: 'Repor papel higiénico', price: 0, estimatedTime: '10', isActive: true },
      { id: 'h_shampoo', name: 'Repor gel de banho / shampoo', price: 0, estimatedTime: '10', isActive: true },
      { id: 'h_dnd', name: 'Não incomodar', price: 0, estimatedTime: '2', isActive: true },
    ],
    extras: [
      { id: 'e_romantic', name: 'Decoração romântica', price: 50, estimatedTime: '120', isActive: true },
      { id: 'e_flowers', name: 'Flores frescas', price: 25, estimatedTime: '60', isActive: true },
      { id: 'e_spa', name: 'Spa / Massagem no quarto', price: 60, estimatedTime: '90', isActive: true },
      { id: 'e_checkout', name: 'Late check-out', price: 30, estimatedTime: '10', isActive: true },
      { id: 'e_transfer', name: 'Transfer Aeroporto', price: 35, estimatedTime: '24h', isActive: true },
      { id: 'e_tour', name: 'Tour / Atividade Açores', price: 40, estimatedTime: '24h', isActive: true },
      { id: 'e_dinner', name: 'Jantar no quarto', price: 45, estimatedTime: '45', isActive: true },
    ]
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        // 1. Fetch Hotel
        const res = await fetch(`${API_BASE_URL}/api/hotels/${hotelId}`);
        if (!res.ok) throw new Error('Alojamento não encontrado.');
        const hotelData = await res.json();
        setHotel(hotelData);

        // 2. Extract Room
        const roomData = (hotelData.rooms || []).find((r: any) => r.id === roomId);
        if (!roomData) throw new Error('Quarto não encontrado neste alojamento.');
        setRoom(roomData);

        // 3. Find active reservation today
        const today = new Date().toISOString().split('T')[0];
        const activeRes = (hotelData.reservations || []).find((r: any) => {
          if (['cancelled', 'Cancelada', 'Cancelado'].includes(r.status)) return false;
          
          const resRoomId = r.roomId || r.selectedRoom?.id;
          if (resRoomId !== roomId) return false;

          const start = r.checkinDate || r.date;
          let end = r.checkoutDate;
          if (!end && r.nights) {
            const d = new Date(start);
            d.setDate(d.getDate() + Number(r.nights));
            end = d.toISOString().split('T')[0];
          }
          return (today >= start && today <= end);
        });
        if (activeRes) {
          setActiveReservation(activeRes);
        }

        // 4. Overwrite menu configurations if custom items are stored in hotel
        if (hotelData.roomServiceConfig) {
          setMenuItems(prev => ({
            ...prev,
            ...hotelData.roomServiceConfig
          }));
        }
      } catch (err: any) {
        setError(err.message || 'Erro ao carregar o Concierge Digital.');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [hotelId, roomId]);

  const handleSubmitRequest = async () => {
    if (!selectedItem) return;
    setSubmitting(true);
    try {
      const categoryNames = {
        quick: 'Pedidos Rápidos',
        maintenance: 'Manutenção',
        housekeeping: 'Housekeeping',
        extras: 'Extras Pagos'
      };

      const payload = {
        hotelId,
        roomId,
        roomName: room?.name || '?',
        reservationId: activeReservation ? activeReservation.id : null,
        category: categoryNames[activeCategory as keyof typeof categoryNames] || 'Outro',
        itemName: selectedItem.name,
        quantity: activeCategory === 'quick' ? quantity : 1,
        price: selectedItem.price,
        notes: notes.trim(),
        status: 'Pendente',
        assignedTo: 'Não Atribuído',
        estimatedTime: selectedItem.estimatedTime || '15'
      };

      const res = await fetch(`${API_BASE_URL}/api/hotel_room_requests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error('Falha ao enviar o pedido.');
      
      setSuccessMsg('Pedido enviado com sucesso. A equipa foi notificada.');
      setNotes('');
      setQuantity(1);
      setSelectedItem(null);
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err: any) {
      alert(err.message || 'Ocorreu um erro.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#070b15] text-white flex flex-col items-center justify-center p-6">
        <RefreshCw className="w-12 h-12 text-amber-500 animate-spin mb-4" />
        <p className="text-xs font-black uppercase tracking-widest text-slate-400">A carregar Mini POS Concierge...</p>
      </div>
    );
  }

  if (error || !hotel || !room) {
    return (
      <div className="min-h-screen bg-[#070b15] text-white flex flex-col items-center justify-center p-6 text-center">
        <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
        <h3 className="text-xl font-black uppercase mb-2">Erro de Acesso</h3>
        <p className="text-sm text-slate-400 max-w-sm mb-6">{error || 'Alojamento ou quarto inválido.'}</p>
        {onBackToApp && (
          <button 
            onClick={onBackToApp} 
            className="px-6 py-3 bg-amber-500 text-slate-950 font-black rounded-xl text-xs uppercase tracking-wider"
          >
            Voltar ao Portal
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070b15] text-white font-sans flex flex-col pb-10">
      
      {/* ── HEADER BANNER ── */}
      <header className="relative bg-gradient-to-b from-slate-900 to-[#070b15] p-6 border-b border-slate-800 shrink-0">
        <div className="flex justify-between items-start gap-4">
          <div>
            <h1 className="text-lg font-black text-amber-500 uppercase tracking-wider">{hotel.name}</h1>
            <h2 className="text-2xl font-black tracking-tight text-white mt-1">{room.name}</h2>
            <div className="flex items-center gap-1.5 mt-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] uppercase font-bold text-slate-400">
                {activeReservation ? `Hóspede: ${activeReservation.customerName}` : 'Quarto Sem Reserva Ativa'}
              </span>
            </div>
          </div>
          {onBackToApp && (
            <button 
              onClick={onBackToApp}
              className="p-2 bg-slate-850 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition-all cursor-pointer"
            >
              <ArrowLeft size={16} />
            </button>
          )}
        </div>
        <div className="mt-5 p-4 bg-slate-900/60 border border-slate-800 rounded-2xl flex items-center justify-between">
          <p className="text-xs font-black uppercase text-slate-300 tracking-wider">Como podemos ajudar hoje?</p>
          <Compass className="w-5 h-5 text-amber-500 animate-spin-slow" />
        </div>
      </header>

      {/* ── CATEGORY BAR ── */}
      <div className="flex gap-2 overflow-x-auto p-4 scrollbar-none shrink-0 bg-slate-950/40">
        {([
          { id: 'quick', label: 'Pedidos Rápidos', icon: <Coffee size={14} /> },
          { id: 'housekeeping', label: 'Housekeeping', icon: <Sparkles size={14} /> },
          { id: 'maintenance', label: 'Manutenção', icon: <ShieldAlert size={14} /> },
          { id: 'extras', label: 'Extras Pagos', icon: <Flame size={14} /> },
          { id: 'info', label: 'Informações', icon: <HelpCircle size={14} /> }
        ] as const).map(cat => (
          <button
            key={cat.id}
            onClick={() => { setActiveCategory(cat.id); setSelectedItem(null); }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all border ${
              activeCategory === cat.id 
                ? 'bg-amber-500 border-amber-500 text-slate-950 shadow-md shadow-amber-500/10' 
                : 'bg-slate-900 border-slate-800 text-slate-400'
            }`}
          >
            {cat.icon}
            <span>{cat.label}</span>
          </button>
        ))}
      </div>

      {/* ── MAIN CONTENT LIST ── */}
      <main className="flex-1 p-6 overflow-y-auto">
        <AnimatePresence mode="wait">
          
          {/* Success message popup */}
          {successMsg && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-4 rounded-2xl flex items-center gap-3 text-xs font-bold mb-6"
            >
              <CheckCircle className="w-5 h-5 text-emerald-500" />
              <span>{successMsg}</span>
            </motion.div>
          )}

          {/* Render category requests */}
          {activeCategory !== 'info' ? (
            <motion.div 
              key={activeCategory}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 gap-3"
            >
              {(menuItems[activeCategory as keyof typeof menuItems] || [])
                .filter(item => item.isActive !== false)
                .map(item => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setSelectedItem(item);
                      setQuantity(1);
                    }}
                    className={`p-4 rounded-2xl border text-left flex justify-between items-center transition-all ${
                      selectedItem?.id === item.id 
                        ? 'bg-amber-500/10 border-amber-500/40 text-amber-500' 
                        : 'bg-slate-900/70 border-slate-800 hover:border-slate-750 text-white'
                    }`}
                  >
                    <div>
                      <h4 className="font-extrabold text-sm uppercase tracking-tight">{item.name}</h4>
                      {item.estimatedTime && (
                        <p className="text-[10px] text-slate-450 mt-1 flex items-center gap-1">
                          <Clock size={10} />
                          <span>Entrega aprox: ~{item.estimatedTime} min</span>
                        </p>
                      )}
                    </div>
                    <span className="font-black text-sm text-amber-500">
                      {item.price > 0 ? `${item.price}€` : 'Gratuito'}
                    </span>
                  </button>
                ))
              }
            </motion.div>
          ) : (
            /* INFO TAB RENDERING */
            <motion.div
              key="info"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
                <h3 className="font-extrabold text-sm uppercase text-amber-500 flex items-center gap-2">
                  <Wifi size={16} /> Ligação Wi-Fi do Alojamento
                </h3>
                <div className="text-xs space-y-1 font-bold text-slate-350">
                  <p>Rede: <span className="text-white font-black">{hotel.name}_Guest</span></p>
                  <p>Password: <span className="text-white font-black">azoresvacation2026</span></p>
                </div>
              </div>

              <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
                <h3 className="font-extrabold text-sm uppercase text-amber-500 flex items-center gap-2">
                  <Clock size={16} /> Horários Importantes
                </h3>
                <div className="text-xs space-y-2 font-bold text-slate-350">
                  <p>🍳 Pequeno-Almoço: <span className="text-white">08:00h às 10:30h (Sala Principal)</span></p>
                  <p>🛎️ Check-Out: <span className="text-white">Até às 11:00h</span></p>
                  <p>🔑 Horário da Receção: <span className="text-white">24h / Dia</span></p>
                </div>
              </div>

              <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
                <h3 className="font-extrabold text-sm uppercase text-amber-500 flex items-center gap-2">
                  <ShieldAlert size={16} /> Emergência e Receção
                </h3>
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <a 
                    href={`tel:${hotel.phone || '296000000'}`}
                    className="p-3 bg-blue-500/10 border border-blue-500/25 rounded-xl text-center text-blue-400 font-extrabold text-xs flex flex-col items-center gap-1.5"
                  >
                    <PhoneCall size={16} />
                    <span>Ligar Receção</span>
                  </a>
                  <a 
                    href="tel:112"
                    className="p-3 bg-red-500/10 border border-red-500/25 rounded-xl text-center text-red-400 font-extrabold text-xs flex flex-col items-center gap-1.5"
                  >
                    <ShieldAlert size={16} />
                    <span>Emergência (112)</span>
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* ── MODAL / DRAWER FOR REQUEST SUBMISSION ── */}
      <AnimatePresence>
        {selectedItem && (
          <div className="fixed inset-0 z-50 flex items-end justify-center p-0 bg-slate-950/80 backdrop-blur-sm">
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25 }}
              className="bg-slate-900 border-t border-slate-800 w-full max-w-md p-6 rounded-t-[2.5rem] shadow-2xl relative"
            >
              {/* Top notch */}
              <div className="w-12 h-1 bg-slate-700 rounded-full mx-auto mb-6" />
              
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="text-[9px] font-black uppercase text-amber-500 tracking-widest">Confirmar Pedido</span>
                  <h3 className="text-xl font-black text-white uppercase mt-0.5">{selectedItem.name}</h3>
                </div>
                <button 
                  onClick={() => setSelectedItem(null)}
                  className="text-xs font-black uppercase text-slate-500 hover:text-white"
                >
                  Fechar
                </button>
              </div>

              {/* Quantity selector (Only for Quick items) */}
              {activeCategory === 'quick' && (
                <div className="flex items-center justify-between py-4 border-y border-slate-800 mb-4">
                  <span className="text-xs font-black uppercase text-slate-400">Quantidade</span>
                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      onClick={() => setQuantity(q => Math.max(1, q - 1))}
                      className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center font-bold text-lg hover:bg-slate-700"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="text-sm font-black text-white w-4 text-center">{quantity}</span>
                    <button
                      type="button"
                      onClick={() => setQuantity(q => q + 1)}
                      className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center font-bold text-lg hover:bg-slate-700"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
              )}

              {/* Observation notes */}
              <div className="space-y-2 mb-6">
                <label className="block text-[9px] font-black uppercase text-slate-450">Observações / Notas</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Ex: Sem açúcar, toalhas de banho grandes, etc..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs font-semibold text-white focus:outline-none focus:border-amber-500 resize-none h-20"
                />
              </div>

              {/* Action buttons */}
              <div className="flex justify-between items-center gap-4">
                <div>
                  <span className="text-[8px] font-bold text-slate-400 block uppercase tracking-wider">Total</span>
                  <span className="text-2xl font-black text-amber-500">
                    {selectedItem.price > 0 ? `${selectedItem.price * quantity}€` : 'Gratuito'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleSubmitRequest}
                  disabled={submitting}
                  className="flex-1 py-4 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black uppercase tracking-wider text-xs rounded-2xl flex items-center justify-center gap-2 shadow"
                >
                  {submitting ? (
                    <RefreshCw size={14} className="animate-spin" />
                  ) : (
                    <>
                      <Send size={14} />
                      <span>Enviar Pedido</span>
                    </>
                  )}
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
