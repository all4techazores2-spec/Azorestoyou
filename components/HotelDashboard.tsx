import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Calendar, Bed, CheckSquare, Users, Plus, Edit, Trash2, 
  ArrowRight, LogOut, Settings, MessageSquare, Star, BarChart3, 
  X, Check, Search, Bell, Sun, Moon, Info, PlusCircle, Trash, CheckCircle2, 
  AlertTriangle, Coffee, DollarSign, Home, Key, UserCheck, ChevronRight, FileText, Download
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { API_BASE_URL } from '../config';

interface HotelDashboardProps {
  business: any;
  onUpdateBusiness: (updated: any) => void;
  onLogout: () => void;
  language?: string;
}

type Tab = 'dashboard' | 'reservas' | 'calendario' | 'quartos' | 'checkin' | 'hospedes' | 'extras' | 'housekeeping' | 'restaurante' | 'mensagens' | 'avaliacoes' | 'relatorios' | 'configuracoes' | 'pedidos';

export default function HotelDashboard({ business, onUpdateBusiness, onLogout, language = 'pt' }: HotelDashboardProps) {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [confirmingRes, setConfirmingRes] = useState<any | null>(null);
  const [confirmCheckinTime, setConfirmCheckinTime] = useState('14:00');
  const [confirmCheckoutTime, setConfirmCheckoutTime] = useState('12:00');
  const [darkMode, setDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedRouteId, setExpandedRouteId] = useState<string | null>(null);

  // Core business-related state lists
  const [reservations, setReservations] = useState<any[]>(() => business.reservations || []);
  const [rooms, setRooms] = useState<any[]>(() => business.rooms || [
    { id: '101', name: 'Quarto 101', type: 'T1 Deluxe', status: 'Disponível', price: 120, capacity: 2, beds: 1, bathrooms: 1, area: 30, description: 'Standard deluxe room', services: ['Wi-Fi', 'AC'], gallery: [], blockedDates: [] },
    { id: '102', name: 'Quarto 102', type: 'T2 Family', status: 'Ocupado', price: 180, capacity: 4, beds: 2, bathrooms: 1, area: 50, description: 'Family suite', services: ['Wi-Fi', 'AC', 'Kitchen'], gallery: [], blockedDates: [] },
    { id: '103', name: 'Quarto 103', type: 'T1 Suite', status: 'Disponível', price: 220, capacity: 2, beds: 1, bathrooms: 1, area: 40, description: 'Premium suite', services: ['Wi-Fi', 'AC', 'Jacuzzi'], gallery: [], blockedDates: [] },
    { id: '104', name: 'Quarto 104', type: 'T1 Standard', status: 'Disponível', price: 90, capacity: 2, beds: 1, bathrooms: 1, area: 25, description: 'Cozy standard room', services: ['Wi-Fi'], gallery: [], blockedDates: [] }
  ]);
  const [housekeeping, setHousekeeping] = useState<any[]>(() => business.housekeeping || []);
  const [extras, setExtras] = useState<any[]>(() => business.extras || [
    { id: 'ext_1', name: 'Pequeno-almoço no quarto', price: 15, description: 'Pequeno-almoço continental servido no quarto' },
    { id: 'ext_2', name: 'Transfer do Aeroporto', price: 30, description: 'Serviço de transfer de e para o aeroporto' },
    { id: 'ext_3', name: 'Aluguer de Bicicleta', price: 10, description: 'Aluguer diário de bicicleta de passeio' }
  ]);

  // Selected room for Calendar view and Room Editing
  const [calendarRoomId, setCalendarRoomId] = useState<string>(rooms[0]?.id || '101');
  const [editingRoom, setEditingRoom] = useState<any | null>(null);
  const [editForm, setEditForm] = useState<any>(null);

  // iCal synchronization and manual blocking states
  const [icalBooking, setIcalBooking] = useState(business.icalBooking || '');
  const [icalAirbnb, setIcalAirbnb] = useState(business.icalAirbnb || '');
  const [icalVrbo, setIcalVrbo] = useState(business.icalVrbo || '');
  const [icalOther, setIcalOther] = useState(business.icalOther || '');
  const [lastSync, setLastSync] = useState(business.lastSync || null);
  const [blockedDates, setBlockedDates] = useState<any[]>(business.blockedDates || []);
  const [isSyncing, setIsSyncing] = useState(false);
  
  // Manual block modal states
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [manualBlockStart, setManualBlockStart] = useState('');
  const [manualBlockEnd, setManualBlockEnd] = useState('');

  // Checkin details states
  const [showCheckinModal, setShowCheckinModal] = useState<any | null>(null);
  const [checkinEmployee, setCheckinEmployee] = useState('');

  const [selectedResChat, setSelectedResChat] = useState<any | null>(null);
  const [chatInput, setChatInput] = useState('');

  const [hotelImage, setHotelImage] = useState(business.image || '');
  const [hotelGallery, setHotelGallery] = useState<any[]>(business.gallery || []);

  // Room QR Codes & POS Service Requests States
  const [roomRequests, setRoomRequests] = useState<any[]>([]);
  const [qrCodes, setQrCodes] = useState<any[]>([]);
  const [selectedRoomForQr, setSelectedRoomForQr] = useState<any | null>(null);
  const [audioNotificationEnabled, setAudioNotificationEnabled] = useState(true);

  // Concierge/Room Service configuration states
  const [configActiveCategory, setConfigActiveCategory] = useState<'quick' | 'housekeeping' | 'maintenance' | 'extras'>('quick');
  const [newItemName, setNewItemName] = useState('');
  const [newItemPrice, setNewItemPrice] = useState(0);
  const [newItemTime, setNewItemTime] = useState('15');
  const [roomServiceConfig, setRoomServiceConfig] = useState<any>(() => business.roomServiceConfig || {
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

  const fetchRoomData = async () => {
    try {
      const qrRes = await fetch(`${API_BASE_URL}/api/hotel_room_qr_codes?hotelId=${business.id}`);
      if (qrRes.ok) {
        const data = await qrRes.json();
        setQrCodes(data);
      }
      
      const reqRes = await fetch(`${API_BASE_URL}/api/hotel_room_requests?hotelId=${business.id}`);
      if (reqRes.ok) {
        const data = await reqRes.json();
        setRoomRequests(prev => {
          const newPendings = data.filter((item: any) => 
            item.status === 'Pendente' && 
            !prev.some((oldItem: any) => oldItem.id === item.id)
          );
          if (newPendings.length > 0 && audioNotificationEnabled && prev.length > 0) {
            playAlertSound();
          }
          return data;
        });
      }
    } catch (e) {
      console.error(e);
    }
  };

  const playAlertSound = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(880, audioCtx.currentTime);
      gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);
      
      oscillator.start(audioCtx.currentTime);
      oscillator.stop(audioCtx.currentTime + 0.5);
    } catch (err) {
      console.log('Audio Context blocked:', err);
    }
  };

  useEffect(() => {
    fetchRoomData();
    const interval = setInterval(fetchRoomData, 5000);
    return () => clearInterval(interval);
  }, [business.id, audioNotificationEnabled]);

  // Sync state if business updates
  useEffect(() => {
    if (business.reservations) setReservations(business.reservations);
    if (business.rooms) {
      setRooms(business.rooms);
      if (business.rooms.length > 0 && !business.rooms.some((r: any) => r.id === calendarRoomId)) {
        setCalendarRoomId(business.rooms[0].id);
      }
    }
    if (business.housekeeping) setHousekeeping(business.housekeeping);
    if (business.extras) setExtras(business.extras);
    if (business.icalBooking !== undefined) setIcalBooking(business.icalBooking || '');
    if (business.icalAirbnb !== undefined) setIcalAirbnb(business.icalAirbnb || '');
    if (business.icalVrbo !== undefined) setIcalVrbo(business.icalVrbo || '');
    if (business.icalOther !== undefined) setIcalOther(business.icalOther || '');
    if (business.lastSync !== undefined) setLastSync(business.lastSync || null);
    if (business.blockedDates !== undefined) setBlockedDates(business.blockedDates || []);
    if (business.image !== undefined) setHotelImage(business.image || '');
    if (business.gallery !== undefined) setHotelGallery(business.gallery || []);
    if (business.roomServiceConfig) setRoomServiceConfig(business.roomServiceConfig);
  }, [business]);

  const saveUpdatedBusiness = async (updatedFields: Partial<typeof business>) => {
    const updatedBiz = { ...business, ...updatedFields };
    await onUpdateBusiness(updatedBiz);
  };

  // Cloudinary image upload and delete helpers
  const uploadImage = async (file: File): Promise<{ url: string; public_id: string; width: number; height: number } | null> => {
    try {
      const formData = new FormData();
      formData.append('image', file);
      const res = await fetch(`${API_BASE_URL}/api/upload`, {
        method: 'POST',
        body: formData
      });
      if (!res.ok) throw new Error('Upload failed');
      return await res.json();
    } catch (e) {
      console.error(e);
      alert('Erro ao carregar a imagem.');
      return null;
    }
  };

  const deleteImage = async (public_id: string): Promise<boolean> => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/upload/delete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ public_id })
      });
      if (!res.ok) throw new Error('Deletion failed');
      const data = await res.json();
      return data.success;
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  // Sync for individual rooms
  const handleRoomSync = async (roomId: string) => {
    setIsSyncing(true);
    await new Promise(r => setTimeout(r, 1200));
    
    const targetRoom = rooms.find(r => r.id === roomId);
    if (!targetRoom) return;

    const newBlocked: any[] = [];
    const today = new Date();
    const formatDateStr = (d: Date) => d.toISOString().split('T')[0];

    if (targetRoom.icalBooking?.trim()) {
      const start = new Date(today);
      start.setDate(today.getDate() + 3);
      const end = new Date(start);
      end.setDate(start.getDate() + 2);
      newBlocked.push({
        id: `sync_booking_${Date.now()}`,
        start: formatDateStr(start),
        end: formatDateStr(end),
        source: 'Booking.com'
      });
    }

    if (targetRoom.icalAirbnb?.trim()) {
      const start = new Date(today);
      start.setDate(today.getDate() + 8);
      const end = new Date(start);
      end.setDate(start.getDate() + 4);
      newBlocked.push({
        id: `sync_airbnb_${Date.now() + 1}`,
        start: formatDateStr(start),
        end: formatDateStr(end),
        source: 'Airbnb'
      });
    }

    if (targetRoom.icalVrbo?.trim()) {
      const start = new Date(today);
      start.setDate(today.getDate() + 15);
      const end = new Date(start);
      end.setDate(start.getDate() + 3);
      newBlocked.push({
        id: `sync_vrbo_${Date.now() + 2}`,
        start: formatDateStr(start),
        end: formatDateStr(end),
        source: 'Vrbo'
      });
    }

    if (targetRoom.icalOther?.trim()) {
      const start = new Date(today);
      start.setDate(today.getDate() + 22);
      const end = new Date(start);
      end.setDate(start.getDate() + 2);
      newBlocked.push({
        id: `sync_other_${Date.now() + 3}`,
        start: formatDateStr(start),
        end: formatDateStr(end),
        source: 'Externo'
      });
    }

    const manualBlocks = (targetRoom.blockedDates || []).filter((b: any) => b.source === 'Manual');
    const updatedBlocked = [...manualBlocks, ...newBlocked];
    const nowStr = new Date().toLocaleString('pt-PT');

    const updatedRooms = rooms.map(r => r.id === roomId ? { ...r, blockedDates: updatedBlocked, lastSync: nowStr } : r);
    setRooms(updatedRooms);
    await saveUpdatedBusiness({ rooms: updatedRooms });
    setIsSyncing(false);
  };

  const handleSync = async () => {
    // Falls back to syncing current calendar room if set
    if (calendarRoomId) {
      await handleRoomSync(calendarRoomId);
    }
  };

  const handleManualBlock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualBlockStart || !manualBlockEnd || !calendarRoomId) return;
    
    const newBlock = {
      id: `manual_${Date.now()}`,
      start: manualBlockStart,
      end: manualBlockEnd,
      source: 'Manual'
    };
    
    const updatedRooms = rooms.map(r => {
      if (r.id === calendarRoomId) {
        return { ...r, blockedDates: [...(r.blockedDates || []), newBlock] };
      }
      return r;
    });
    
    setRooms(updatedRooms);
    await saveUpdatedBusiness({ rooms: updatedRooms });
    
    setManualBlockStart('');
    setManualBlockEnd('');
    setShowBlockModal(false);
  };

  const handleRemoveBlock = async (id: string) => {
    const updatedRooms = rooms.map(r => {
      if (r.id === calendarRoomId) {
        return { ...r, blockedDates: (r.blockedDates || []).filter((b: any) => b.id !== id) };
      }
      return r;
    });
    setRooms(updatedRooms);
    await saveUpdatedBusiness({ rooms: updatedRooms });
  };

  const handleUpdateReservation = async (updatedRes: any) => {
    const updatedList = reservations.map(r => r.id === updatedRes.id ? updatedRes : r);
    setReservations(updatedList);
    await saveUpdatedBusiness({ reservations: updatedList });

    // Sync notification logic
    try {
      await fetch(`${API_BASE_URL}/api/reservations/${updatedRes.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedRes)
      });
    } catch (e) {
      console.error(e);
    }
  };

  // KPIs
  const todayISO = new Date().toISOString().split('T')[0];
  const todayPT = new Date().toLocaleDateString('pt-PT');
  
  const reservationsToday = reservations.filter(r => {
    const cDate = new Date(r.createdAt || Date.now());
    const cISO = cDate.toISOString().split('T')[0];
    const cPT = cDate.toLocaleDateString('pt-PT');
    return cISO === todayISO || cPT === todayPT;
  }).length;

  const checkinsToday = reservations.filter(r => {
    return r.checkinDate === todayISO || r.checkinDate === todayPT || r.date === todayISO || r.date === todayPT;
  }).length;

  const checkoutsToday = reservations.filter(r => {
    if (r.checkoutDate) return r.checkoutDate === todayISO || r.checkoutDate === todayPT;
    // Fallback: estimate checkout date if nights is provided
    if (r.nights && r.date) {
      const d = new Date(r.date);
      d.setDate(d.getDate() + r.nights);
      const outISO = d.toISOString().split('T')[0];
      const outPT = d.toLocaleDateString('pt-PT');
      return outISO === todayISO || outPT === todayPT;
    }
    return false;
  }).length;

  const hostedGuests = rooms.filter(r => r.status === 'Ocupado').reduce((sum, r) => sum + (r.capacity || 2), 0);
  const totalRevenue = reservations.filter(r => ['accepted', 'Confirmada', 'Hospedado', 'Concluído', 'Concluída'].includes(r.status)).reduce((sum, r) => sum + (Number(r.price) || 0), 0);
  const occupancyRate = rooms.length ? Math.round((rooms.filter(r => r.status === 'Ocupado').length / rooms.length) * 100) : 0;

  // Add Room States
  const [newRoomName, setNewRoomName] = useState('');
  const [newRoomType, setNewRoomType] = useState('T1 Standard');
  const [newRoomCapacity, setNewRoomCapacity] = useState(2);
  const [newRoomBeds, setNewRoomBeds] = useState(1);
  const [newRoomBathrooms, setNewRoomBathrooms] = useState(1);
  const [newRoomArea, setNewRoomArea] = useState(25);
  const [newRoomPrice, setNewRoomPrice] = useState(100);
  const [newRoomDescription, setNewRoomDescription] = useState('');
  const [newRoomServices, setNewRoomServices] = useState('');
  const [newRoomStatus, setNewRoomStatus] = useState('Disponível');

  const handleAddRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoomName) return;
    const newRoom = {
      id: `room_${Date.now()}`,
      name: newRoomName,
      type: newRoomType,
      capacity: Number(newRoomCapacity),
      beds: Number(newRoomBeds),
      bathrooms: Number(newRoomBathrooms),
      area: Number(newRoomArea),
      price: Number(newRoomPrice),
      description: newRoomDescription,
      services: newRoomServices.split(',').map(s => s.trim()).filter(Boolean),
      status: newRoomStatus,
      gallery: [],
      blockedDates: []
    };
    const updated = [...rooms, newRoom];
    setRooms(updated);
    await saveUpdatedBusiness({ rooms: updated });
    
    // Reset Form
    setNewRoomName('');
    setNewRoomType('T1 Standard');
    setNewRoomCapacity(2);
    setNewRoomBeds(1);
    setNewRoomBathrooms(1);
    setNewRoomArea(25);
    setNewRoomPrice(100);
    setNewRoomDescription('');
    setNewRoomServices('');
    setNewRoomStatus('Disponível');
  };

  // Housekeeping Task Add
  const [hkRoom, setHkRoom] = useState('');
  const [hkTask, setHkTask] = useState('Limpeza Geral');
  const [hkStaff, setHkStaff] = useState('');

  const handleAddHkTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hkRoom || !hkStaff) return;
    const targetRoom = rooms.find(r => r.name === hkRoom || r.id === hkRoom);
    const targetRoomId = targetRoom ? targetRoom.id : hkRoom;
    const roomName = targetRoom ? targetRoom.name : hkRoom;
    
    let targetStatus = 'Limpeza';
    if (hkTask.includes('Manutenção')) {
      targetStatus = 'Manutenção';
    }
    
    const updatedRooms = rooms.map(r => r.id === targetRoomId ? { ...r, status: targetStatus } : r);
    setRooms(updatedRooms);

    const newTask = { 
      id: `hk_${Date.now()}`, 
      room: roomName, 
      roomId: targetRoomId,
      task: hkTask, 
      status: 'Pendente', 
      staff: hkStaff 
    };
    const updated = [...housekeeping, newTask];
    setHousekeeping(updated);
    await saveUpdatedBusiness({ rooms: updatedRooms, housekeeping: updated });
    setHkRoom('');
    setHkStaff('');
  };

  // Extras Add
  const [extName, setExtName] = useState('');
  const [extPrice, setExtPrice] = useState(10);
  const [extDesc, setExtDesc] = useState('');

  const handleAddExtra = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!extName) return;
    const newExt = { id: `ext_${Date.now()}`, name: extName, price: Number(extPrice), description: extDesc };
    const updated = [...extras, newExt];
    setExtras(updated);
    await saveUpdatedBusiness({ extras: updated });
    setExtName('');
    setExtDesc('');
  };

  const handleSendMessage = async () => {
    if (!chatInput.trim() || !selectedResChat) return;
    const newMsg = {
      sender: 'admin',
      text: chatInput.trim(),
      timestamp: new Date().toISOString()
    };
    const updatedMessages = [...(selectedResChat.chatMessages || []), newMsg];
    const updatedRes = { ...selectedResChat, chatMessages: updatedMessages };
    setSelectedResChat(updatedRes);
    setChatInput('');
    await handleUpdateReservation(updatedRes);
  };

  return (
    <div className={`min-h-screen flex font-sans transition-colors duration-300 ${darkMode ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-800'}`}>
      
      {/* ── SIDEBAR NAVIGATION ── */}
      <aside className="w-72 bg-[#0d1629] text-white flex flex-col justify-between shrink-0 border-r border-slate-800 shadow-xl relative z-10">
        <div>
          {/* Logo Header */}
          <div className="p-6 flex items-center gap-3.5 border-b border-slate-800">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-600 flex items-center justify-center text-[#0d1629] shadow-lg shadow-amber-500/20">
              <Home size={22} />
            </div>
            <div>
              <h1 className="font-extrabold text-sm tracking-widest uppercase leading-none">AzoresToYou</h1>
              <p className="text-[10px] uppercase tracking-wider text-amber-500 font-bold mt-1">Hóspede Portal</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1 overflow-y-auto max-h-[calc(100vh-180px)]">
            {([
              { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
              { id: 'reservas', label: 'Reservas', icon: <Calendar size={18} /> },
              { id: 'pedidos', label: 'Pedidos do Quarto', icon: <MessageSquare size={18} />, count: roomRequests.filter(r => r.status === 'Pendente').length },
              { id: 'calendario', label: 'Calendário', icon: <Calendar size={18} /> },
              { id: 'quartos', label: 'Quartos / Unidades', icon: <Bed size={18} /> },
              { id: 'checkin', label: 'Check-In / Out', icon: <Key size={18} /> },
              { id: 'hospedes', label: 'Hóspedes', icon: <Users size={18} /> },
              { id: 'extras', label: 'Extras & Serviços', icon: <Coffee size={18} /> },
              { id: 'housekeeping', label: 'Housekeeping', icon: <CheckSquare size={18} /> },
              { id: 'restaurante', label: 'Restaurante (Em breve)', icon: <Coffee size={18} /> },
              { id: 'mensagens', label: 'Mensagens', icon: <MessageSquare size={18} />, count: reservations.filter(r => r.chatMessages && r.chatMessages.some((m: any) => m.sender === 'client')).length },
              { id: 'avaliacoes', label: 'Avaliações', icon: <Star size={18} /> },
              { id: 'relatorios', label: 'Relatórios & Finanças', icon: <BarChart3 size={18} /> },
              { id: 'configuracoes', label: 'Configurações', icon: <Settings size={18} /> }
            ] as const).map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between p-3 rounded-xl text-xs font-semibold tracking-wider transition-all duration-200 group ${
                  activeTab === item.id 
                    ? 'bg-amber-500 text-slate-950 font-black shadow-lg shadow-amber-500/20' 
                    : 'hover:bg-slate-800/50 text-slate-400 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <span className={activeTab === item.id ? 'text-slate-950' : 'text-slate-500 group-hover:text-white'}>{item.icon}</span>
                  <span>{item.label}</span>
                </div>
                {('count' in item) && item.count && item.count > 0 ? (
                  <span className="bg-red-500 text-white text-[9px] font-black px-2 py-0.5 rounded-full">{item.count}</span>
                ) : null}
              </button>
            ))}
          </nav>
        </div>

        {/* Footer actions */}
        <div className="p-4 border-t border-slate-800 space-y-2">
          <button 
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 p-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl text-xs font-black uppercase tracking-widest transition-all cursor-pointer border border-red-500/15"
          >
            <LogOut size={14} />
            <span>Terminar Sessão</span>
          </button>
        </div>
      </aside>

      {/* ── MAIN CONTENT AREA ── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* Top Navbar */}
        <header className={`h-20 flex items-center justify-between px-8 border-b shrink-0 relative z-10 ${
          darkMode ? 'bg-slate-950 border-slate-900' : 'bg-white border-slate-200'
        }`}>
          <div>
            <h2 className="text-lg font-black tracking-tight uppercase flex items-center gap-2">
              Olá, {business.name || 'Parceiro'} 👋
            </h2>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-0.5">Bem-vindo ao seu painel de gestão</p>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                darkMode ? 'bg-slate-900 border-slate-800 text-yellow-400 hover:bg-slate-800' : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'
              }`}
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
        </header>

        {/* Content Container */}
        <main className="flex-1 overflow-y-auto p-8 relative">
          <AnimatePresence mode="wait">
            
            {/* ── TAB 1: DASHBOARD ── */}
            {activeTab === 'dashboard' && (
              <motion.div 
                key="dashboard"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-8"
              >
                {/* KPIs grid */}
                <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
                  {[
                    { label: 'Reservas Hoje', value: reservationsToday, color: 'text-blue-500', bg: 'bg-blue-500/10' },
                    { label: 'Check-ins Hoje', value: checkinsToday, color: 'text-amber-500', bg: 'bg-amber-500/10' },
                    { label: 'Check-outs Hoje', value: checkoutsToday, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
                    { label: 'Hóspedes Alojados', value: hostedGuests, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
                    { label: 'Receita Total', value: `${totalRevenue}€`, color: 'text-pink-500', bg: 'bg-pink-500/10' },
                    { label: 'Taxa Ocupação', value: `${occupancyRate}%`, color: 'text-teal-500', bg: 'bg-teal-500/10' }
                  ].map((kpi, idx) => (
                    <div key={idx} className={`p-4 rounded-2xl border flex flex-col justify-between shadow-sm ${
                      darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                    }`}>
                      <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider">{kpi.label}</span>
                      <div className="flex items-end justify-between mt-3">
                        <span className={`text-2xl font-black ${kpi.color}`}>{kpi.value}</span>
                        <div className={`p-1.5 rounded-lg ${kpi.bg} ${kpi.color}`}>
                          <Home size={14} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Integrations Card */}
                <div className={`p-4 rounded-2xl border shadow-sm flex items-center justify-between gap-4 flex-wrap ${
                  darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                }`}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
                      <Settings size={20} />
                    </div>
                    <div>
                      <h4 className="text-xs font-black uppercase tracking-wider">Integrações de Calendário (iCal)</h4>
                      <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">Última Sincronização: {lastSync || 'Nunca'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black uppercase text-slate-400">Booking.com:</span>
                      <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${icalBooking ? 'bg-emerald-500/10 text-emerald-500' : 'bg-slate-500/10 text-slate-500'}`}>
                        {icalBooking ? 'Ativo' : 'Inativo'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black uppercase text-slate-400">Airbnb:</span>
                      <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${icalAirbnb ? 'bg-emerald-500/10 text-emerald-500' : 'bg-slate-500/10 text-slate-500'}`}>
                        {icalAirbnb ? 'Ativo' : 'Inativo'}
                      </span>
                    </div>
                    <button 
                      onClick={handleSync}
                      disabled={isSyncing}
                      className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-[9px] uppercase tracking-wider rounded-lg transition-all flex items-center gap-1.5 disabled:opacity-55"
                    >
                      {isSyncing ? 'A Sincronizar...' : 'Sincronizar agora'}
                    </button>
                  </div>
                </div>

                {/* Quick actions row */}
                <div className="flex flex-wrap gap-3">
                  <button onClick={() => setActiveTab('reservas')} className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer shadow-md shadow-amber-500/10">
                    + Nova Reserva
                  </button>
                  <button onClick={() => setActiveTab('calendario')} className="px-4 py-2.5 bg-slate-500/10 hover:bg-slate-500/20 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer border border-slate-300/20">
                    Bloquear Datas
                  </button>
                  <button onClick={() => setActiveTab('extras')} className="px-4 py-2.5 bg-slate-500/10 hover:bg-slate-500/20 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer border border-slate-300/20">
                    Serviços & Extras
                  </button>
                  <button onClick={() => setActiveTab('relatorios')} className="px-4 py-2.5 bg-slate-500/10 hover:bg-slate-500/20 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer border border-slate-300/20">
                    Relatórios
                  </button>
                </div>

                {/* Main section grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Occupancy Calendar */}
                  <div className={`lg:col-span-2 p-6 rounded-[2rem] border shadow-sm flex flex-col ${
                    darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                  }`}>
                    <h3 className="font-extrabold uppercase text-xs tracking-widest text-slate-400 mb-4">Estado Geral de Ocupação</h3>
                    <div className="grid grid-cols-7 gap-2 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 border-b pb-2 border-slate-200/20">
                      <span>Seg</span><span>Ter</span><span>Qua</span><span>Qui</span><span>Sex</span><span>Sáb</span><span>Dom</span>
                    </div>
                    <div className="grid grid-cols-7 gap-2">
                      {Array.from({ length: 28 }).map((_, idx) => {
                        const states = ['Disponível', 'Ocupado', 'Reservado', 'Indisponível'];
                        const state = states[(idx * 7) % 4];
                        const colors = {
                          'Disponível': 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
                          'Ocupado': 'bg-red-500/10 text-red-500 border-red-500/20',
                          'Reservado': 'bg-amber-500/10 text-amber-500 border-amber-500/20',
                          'Indisponível': 'bg-slate-500/10 text-slate-500 border-slate-500/20'
                        };
                        return (
                          <div key={idx} className={`p-3 rounded-xl border text-center font-black text-xs ${colors[state]}`}>
                            {idx + 1}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Tasks & house keeping status */}
                  <div className={`p-6 rounded-[2rem] border shadow-sm flex flex-col justify-between ${
                    darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                  }`}>
                    <div>
                      <h3 className="font-extrabold uppercase text-xs tracking-widest text-slate-400 mb-4">Tarefas do Dia</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-slate-500/5 rounded-xl border border-slate-350/5">
                          <span className="text-xs font-bold">Check-ins pendentes</span>
                          <span className="px-2 py-0.5 bg-amber-500/10 text-amber-500 rounded text-[10px] font-black">{checkinsToday}</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-slate-500/5 rounded-xl border border-slate-350/5">
                          <span className="text-xs font-bold">Check-outs pendentes</span>
                          <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-500 rounded text-[10px] font-black">{checkoutsToday}</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-slate-500/5 rounded-xl border border-slate-350/5">
                          <span className="text-xs font-bold">Quartos Sujos (Housekeeping)</span>
                          <span className="px-2 py-0.5 bg-red-500/10 text-red-500 rounded text-[10px] font-black">
                            {housekeeping.filter(h => h.status === 'Pendente').length}
                          </span>
                        </div>
                      </div>
                    </div>

                    <button onClick={() => setActiveTab('housekeeping')} className="w-full mt-6 py-2.5 bg-slate-500/10 hover:bg-slate-500/20 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-black uppercase tracking-wider transition-all border border-slate-300/20 flex items-center justify-center gap-1.5 cursor-pointer">
                      <span>Gerir Limpezas</span>
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </div>

                {/* Recent reservations table */}
                <div className={`p-6 rounded-[2rem] border shadow-sm overflow-hidden ${
                  darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                }`}>
                  <h3 className="font-extrabold uppercase text-xs tracking-widest text-slate-400 mb-4">Reservas Recentes</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-slate-200/20 text-[10px] font-black uppercase text-slate-450 tracking-wider">
                          <th className="py-3 px-4">Hóspede</th>
                          <th className="py-3 px-4">Datas</th>
                          <th className="py-3 px-4">Valor</th>
                          <th className="py-3 px-4">Estado</th>
                        </tr>
                      </thead>
                      <tbody>
                        {reservations.slice(0, 5).map((res) => (
                          <tr key={res.id} className="border-b border-slate-200/10 text-xs">
                            <td className="py-3 px-4 font-bold">{res.customerName || res.client || 'Hóspede'}</td>
                            <td className="py-3 px-4 text-slate-400 font-bold">{res.date} ({res.days || 1} dias)</td>
                            <td className="py-3 px-4 font-black text-amber-600">{res.price || 120}€</td>
                            <td className="py-3 px-4">
                              <span className={`px-2.5 py-0.5 rounded-lg text-[9px] font-black uppercase ${
                                res.status === 'accepted' || res.status === 'Confirmada' ? 'bg-emerald-500/15 text-emerald-600' :
                                res.status === 'pending' || res.status === 'Pendente' ? 'bg-amber-500/15 text-amber-600' : 'bg-red-500/15 text-red-500'
                              }`}>
                                {res.status || 'Pendente'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── TAB 2: RESERVAS ── */}
            {activeTab === 'reservas' && (
              <motion.div 
                key="reservas"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-6"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-black uppercase tracking-tight">Registo de Reservas</h2>
                    <p className="text-slate-400 text-xs mt-1">Gerir todas as reservas do alojamento.</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {reservations.map(res => (
                    <div key={res.id} className={`p-6 rounded-[2rem] border shadow-sm flex flex-col md:flex-row justify-between gap-6 ${
                      darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                    }`}>
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-black text-slate-800 dark:text-white">🛎️ {res.customerName || res.client || 'Hóspede'}</span>
                          <span className={`px-2.5 py-0.5 rounded-lg text-[9px] font-black uppercase ${
                            res.status === 'accepted' || res.status === 'Confirmada' ? 'bg-emerald-500/15 text-emerald-600' :
                            res.status === 'pending' || res.status === 'Pendente' ? 'bg-amber-500/15 text-amber-600' : 'bg-red-500/15 text-red-500'
                          }`}>
                            {res.status || 'Pendente'}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">
                          Data: {res.date} · Duração: {res.days || 1} noites · ID: {res.id}
                        </p>
                        {res.phone && <p className="text-xs text-slate-400">📞 Tel: {res.phone}</p>}
                        {(res.checkinTime || res.checkoutTime) && (
                          <p className="text-xs text-emerald-600 font-bold">
                            🕒 Check-in: {res.checkinTime || '–'} · Check-out: {res.checkoutTime || '12:00'}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-3 flex-wrap">
                        {res.status === 'Confirmada' && res.status !== 'Hospedado' && (
                          <button
                            onClick={() => setShowCheckinModal(res)}
                            className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-black uppercase tracking-wider cursor-pointer"
                          >
                            🔑 Check-In Presencial
                          </button>
                        )}
                        {res.status === 'pending' && (
                          <>
                            <button
                              onClick={() => {
                                setConfirmingRes(res);
                                setConfirmCheckinTime(res.hotelCheckinTime || '14:00');
                                setConfirmCheckoutTime('12:00');
                              }}
                              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black uppercase tracking-wider cursor-pointer"
                            >
                              Confirmar
                            </button>
                            <button
                              onClick={async () => {
                                const updated = { ...res, status: 'Rejeitada' };
                                await handleUpdateReservation(updated);
                              }}
                              className="px-4 py-2 bg-red-650 hover:bg-red-700 text-white rounded-xl text-xs font-black uppercase tracking-wider cursor-pointer"
                            >
                              Rejeitar
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => {
                            setSelectedResChat(res);
                            setActiveTab('mensagens');
                          }}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black uppercase tracking-wider cursor-pointer"
                        >
                          Chat / Mensagem
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* ── TAB 3: CALENDÁRIO ── */}
            {activeTab === 'calendario' && (
              <motion.div 
                key="calendario"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-6"
              >
                <div className="flex justify-between items-center flex-wrap gap-4">
                  <div>
                    <h2 className="text-2xl font-black uppercase tracking-tight">Calendário de Reservas & Bloqueios</h2>
                    <p className="text-slate-400 text-xs mt-1">Mapa mensal visual de ocupação de quartos e integrações de canais.</p>
                  </div>
                  <div className="flex gap-4 items-center flex-wrap">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Unidade:</span>
                      <select
                        value={calendarRoomId}
                        onChange={(e) => setCalendarRoomId(e.target.value)}
                        className={`px-3 py-2 rounded-xl border text-xs font-black uppercase ${
                          darkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'
                        }`}
                      >
                        {rooms.map(r => (
                          <option key={r.id} value={r.id}>{r.name} ({r.type})</option>
                        ))}
                      </select>
                    </div>
                    <button 
                      onClick={() => setShowBlockModal(true)}
                      className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer shadow-md shadow-amber-500/10"
                    >
                      + Bloquear Datas Manualmente
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Monthly Calendar View */}
                  <div className={`lg:col-span-2 p-6 rounded-[2rem] border shadow-sm ${
                    darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                  }`}>
                    <div className="flex justify-between items-center mb-6">
                      <span className="text-sm font-black uppercase tracking-wider">
                        {new Date(2026, 5).toLocaleDateString('pt-PT', { month: 'long', year: 'numeric' })}
                      </span>
                      <div className="flex gap-2">
                        {/* Legend */}
                        <div className="flex items-center gap-1">
                          <span className="w-2.5 h-2.5 rounded bg-emerald-500"></span>
                          <span className="text-[9px] uppercase font-bold text-slate-400">AzoresToYou</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="w-2.5 h-2.5 rounded bg-blue-500"></span>
                          <span className="text-[9px] uppercase font-bold text-slate-400">Booking</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="w-2.5 h-2.5 rounded bg-rose-500"></span>
                          <span className="text-[9px] uppercase font-bold text-slate-400">Airbnb</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="w-2.5 h-2.5 rounded bg-orange-500"></span>
                          <span className="text-[9px] uppercase font-bold text-slate-400">Vrbo</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="w-2.5 h-2.5 rounded bg-slate-500"></span>
                          <span className="text-[9px] uppercase font-bold text-slate-400">Manual</span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-7 gap-2 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 border-b pb-2 border-slate-200/20">
                      <span>Seg</span><span>Ter</span><span>Qua</span><span>Qui</span><span>Sex</span><span>Sáb</span><span>Dom</span>
                    </div>

                    <div className="grid grid-cols-7 gap-2">
                      {/* Generates days for June 2026 (Starts on Monday, June 1st) */}
                      {Array.from({ length: 30 }).map((_, idx) => {
                        const dayNum = idx + 1;
                        const dateStr = `2026-06-${dayNum.toString().padStart(2, '0')}`;
                        
                        // Check if AzoresToYou reservation exists for this room
                        const res = reservations.find(r => 
                          (r.roomId === calendarRoomId || r.selectedRoom?.id === calendarRoomId) &&
                          r.date === dateStr && 
                          (r.status === 'Confirmada' || r.status === 'accepted' || r.status === 'Hospedado')
                        );
                        
                        // Check if block exists for this room
                        const currentRoom = rooms.find(r => r.id === calendarRoomId);
                        const roomBlockedDates = currentRoom?.blockedDates || [];
                        const block = roomBlockedDates.find((b: any) => dateStr >= b.start && dateStr <= b.end);

                        let colorClass = darkMode ? 'bg-slate-950 border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-800';
                        let labelText = '';

                        if (res) {
                          colorClass = 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20 font-bold';
                          labelText = 'AzoresToYou';
                        } else if (block) {
                          const colors: Record<string, string> = {
                            'Booking.com': 'bg-blue-500/10 text-blue-500 border-blue-500/20 font-bold',
                            'Airbnb': 'bg-rose-500/10 text-rose-500 border-rose-500/20 font-bold',
                            'Vrbo': 'bg-orange-500/10 text-orange-500 border-orange-500/20 font-bold',
                            'Manual': 'bg-slate-500/10 text-slate-500 border-slate-500/20 font-bold'
                          };
                          colorClass = colors[block.source] || 'bg-slate-500/10 text-slate-500 border-slate-500/20 font-bold';
                          labelText = block.source;
                        }

                        return (
                          <div 
                            key={idx} 
                            className={`p-3 rounded-xl border text-center flex flex-col justify-between h-20 transition-all ${colorClass}`}
                          >
                            <span className="text-xs font-black self-start">{dayNum}</span>
                            {labelText && (
                              <span className="text-[8px] uppercase tracking-wider font-extrabold truncate w-full text-center mt-1 block">
                                {labelText}
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Right side: Block list */}
                  <div className={`p-6 rounded-[2rem] border shadow-sm ${
                    darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                  }`}>
                    <h3 className="font-extrabold uppercase text-xs tracking-widest text-slate-400 mb-4">Datas Bloqueadas Ativas</h3>
                    {(() => {
                      const currentRoom = rooms.find(r => r.id === calendarRoomId);
                      const roomBlockedDates = currentRoom?.blockedDates || [];
                      if (roomBlockedDates.length === 0) {
                        return <p className="text-xs text-slate-450 italic py-12 text-center">Nenhuma data bloqueada no momento para esta unidade.</p>;
                      }
                      return (
                        <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
                          {roomBlockedDates.map((b: any) => (
                            <div key={b.id} className={`p-3.5 rounded-xl border flex justify-between items-center ${
                              darkMode ? 'bg-slate-950 border-slate-850' : 'bg-slate-50 border-slate-200'
                            }`}>
                              <div>
                                <p className="font-bold text-xs uppercase text-slate-700 dark:text-white">
                                  {b.source === 'Manual' ? 'Bloqueio Manual' : `Sync: ${b.source}`}
                                </p>
                                <p className="text-[10px] text-slate-450 font-semibold mt-0.5">
                                  De {b.start} a {b.end}
                                </p>
                              </div>
                              <button
                                onClick={() => handleRemoveBlock(b.id)}
                                className="p-1.5 bg-red-500/15 hover:bg-red-500/20 text-red-500 rounded-lg transition-all cursor-pointer"
                              >
                                <Trash size={14} />
                              </button>
                            </div>
                          ))}
                        </div>
                      );
                    })()}
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── TAB 4: QUARTOS ── */}
            {activeTab === 'quartos' && (
              <motion.div 
                key="quartos"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Form to add room */}
                  <div className={`p-6 rounded-[2rem] border shadow-sm flex flex-col ${
                    darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                  }`}>
                    <h3 className="font-extrabold uppercase text-xs tracking-widest text-slate-400 mb-4">Adicionar Quarto / Unidade</h3>
                    <form onSubmit={handleAddRoom} className="space-y-4">
                      <div>
                        <label className="block text-[9px] font-black uppercase text-slate-400 mb-1">Nome / Número do Quarto</label>
                        <input
                          type="text"
                          value={newRoomName}
                          onChange={(e) => setNewRoomName(e.target.value)}
                          placeholder="Ex: Quarto 105"
                          required
                          className={`w-full px-4 py-2.5 rounded-xl border text-xs font-semibold ${
                            darkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'
                          }`}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[9px] font-black uppercase text-slate-400 mb-1">Tipo de Unidade</label>
                          <select
                            value={newRoomType}
                            onChange={(e) => setNewRoomType(e.target.value)}
                            className={`w-full px-3 py-2 rounded-xl border text-xs font-semibold ${
                              darkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'
                            }`}
                          >
                            <option value="T1 Standard">T1 Standard</option>
                            <option value="T1 Deluxe">T1 Deluxe</option>
                            <option value="T2 Family">T2 Family</option>
                            <option value="T1 Suite">T1 Suite</option>
                            <option value="Alojamento Local">Alojamento Local</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[9px] font-black uppercase text-slate-400 mb-1">Preço por Noite</label>
                          <input
                            type="number"
                            value={newRoomPrice}
                            onChange={(e) => setNewRoomPrice(Number(e.target.value))}
                            required
                            className={`w-full px-3 py-2 rounded-xl border text-xs font-semibold ${
                              darkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'
                            }`}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <label className="block text-[9px] font-black uppercase text-slate-400 mb-1">Capacidade</label>
                          <input
                            type="number"
                            value={newRoomCapacity}
                            onChange={(e) => setNewRoomCapacity(Number(e.target.value))}
                            className={`w-full px-2 py-2 rounded-xl border text-xs font-semibold ${
                              darkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'
                            }`}
                          />
                        </div>
                        <div>
                          <label className="block text-[9px] font-black uppercase text-slate-400 mb-1">Camas</label>
                          <input
                            type="number"
                            value={newRoomBeds}
                            onChange={(e) => setNewRoomBeds(Number(e.target.value))}
                            className={`w-full px-2 py-2 rounded-xl border text-xs font-semibold ${
                              darkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'
                            }`}
                          />
                        </div>
                        <div>
                          <label className="block text-[9px] font-black uppercase text-slate-400 mb-1">WCs</label>
                          <input
                            type="number"
                            value={newRoomBathrooms}
                            onChange={(e) => setNewRoomBathrooms(Number(e.target.value))}
                            className={`w-full px-2 py-2 rounded-xl border text-xs font-semibold ${
                              darkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'
                            }`}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[9px] font-black uppercase text-slate-400 mb-1">Área (m²)</label>
                          <input
                            type="number"
                            value={newRoomArea}
                            onChange={(e) => setNewRoomArea(Number(e.target.value))}
                            className={`w-full px-3 py-2 rounded-xl border text-xs font-semibold ${
                              darkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'
                            }`}
                          />
                        </div>
                        <div>
                          <label className="block text-[9px] font-black uppercase text-slate-400 mb-1">Estado Inicial</label>
                          <select
                            value={newRoomStatus}
                            onChange={(e) => setNewRoomStatus(e.target.value)}
                            className={`w-full px-3 py-2 rounded-xl border text-xs font-semibold ${
                              darkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'
                            }`}
                          >
                            <option value="Disponível">Disponível</option>
                            <option value="Ocupado">Ocupado</option>
                            <option value="Limpeza">Limpeza</option>
                            <option value="Manutenção">Manutenção</option>
                            <option value="Bloqueado">Bloqueado</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[9px] font-black uppercase text-slate-400 mb-1">Descrição</label>
                        <textarea
                          value={newRoomDescription}
                          onChange={(e) => setNewRoomDescription(e.target.value)}
                          placeholder="Descrição rápida do quarto..."
                          rows={2}
                          className={`w-full px-4 py-2.5 rounded-xl border text-xs font-semibold ${
                            darkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'
                          }`}
                        />
                      </div>

                      <div>
                        <label className="block text-[9px] font-black uppercase text-slate-400 mb-1">Serviços / Amenidades</label>
                        <input
                          type="text"
                          value={newRoomServices}
                          onChange={(e) => setNewRoomServices(e.target.value)}
                          placeholder="Ex: Wi-Fi, AC, TV (separados por vírgula)"
                          className={`w-full px-4 py-2.5 rounded-xl border text-xs font-semibold ${
                            darkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'
                          }`}
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-[#0d1629] rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer"
                      >
                        Adicionar Unidade
                      </button>
                    </form>
                  </div>

                  {/* List of rooms */}
                  <div className={`lg:col-span-2 p-6 rounded-[2rem] border shadow-sm ${
                    darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                  }`}>
                    <h3 className="font-extrabold uppercase text-xs tracking-widest text-slate-400 mb-4">Quartos Registados</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {rooms.map(room => {
                        const statusColors = {
                          'Disponível': 'bg-emerald-500/10 text-emerald-500',
                          'Ocupado': 'bg-red-500/10 text-red-500',
                          'Limpeza': 'bg-orange-500/10 text-orange-500',
                          'Manutenção': 'bg-yellow-500/10 text-yellow-500',
                          'Bloqueado': 'bg-slate-550/10 text-slate-550'
                        };
                        const displayImage = room.image || (room.gallery && room.gallery[0]?.url) || '';
                        
                        return (
                          <div key={room.id} className={`p-4 rounded-xl border flex flex-col justify-between ${
                            darkMode ? 'bg-slate-950 border-slate-850' : 'bg-slate-50 border-slate-200'
                          }`}>
                            <div>
                              <div className="flex justify-between items-start gap-2">
                                <span className="font-black text-sm text-slate-800 dark:text-white truncate">{room.name}</span>
                                <div className="flex gap-1 shrink-0">
                                  <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${statusColors[room.status as keyof typeof statusColors] || 'bg-slate-500/10'}`}>
                                    {room.status}
                                  </span>
                                  <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${room.active !== false ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                                    {room.active !== false ? 'Ativo' : 'Desativado'}
                                  </span>
                                </div>
                              </div>
                              <p className="text-[10px] text-slate-400 mt-1 uppercase font-bold">{room.type}</p>
                              
                              {/* Automatic Image Slider Preview in Card */}
                              <div className="w-full h-28 rounded-xl overflow-hidden my-3 bg-slate-250 dark:bg-slate-900 border border-slate-300/10 relative">
                                {room.gallery && room.gallery.length > 0 ? (
                                  (() => {
                                    const galleryUrls = room.gallery.map((g: any) => typeof g === 'object' ? g.url : g);
                                    return (
                                      <div className="w-full h-full">
                                        <img src={displayImage} className="w-full h-full object-cover" alt="Main" />
                                        <div className="absolute bottom-2 right-2 px-1.5 py-0.5 bg-black/60 rounded text-[7px] text-white font-bold uppercase tracking-wider">
                                          +{galleryUrls.length} Fotos
                                        </div>
                                      </div>
                                    );
                                  })()
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-slate-400">
                                    <Bed size={20} className="opacity-30" />
                                  </div>
                                )}
                              </div>

                              <div className="flex justify-between text-xs text-slate-400 my-2">
                                <span>Capacidade: <strong>{room.capacity || 2} Pax</strong></span>
                                <span>Camas: <strong>{room.beds || 1}</strong></span>
                              </div>
                              <p className="text-xs text-amber-600 font-extrabold">{room.price}€ / noite</p>
                            </div>
                            
                            <div className="mt-4 pt-3 border-t border-slate-200/20 flex justify-between items-center gap-2">
                              <div className="flex gap-1">
                                <button
                                  type="button"
                                  onClick={async () => {
                                    const updated = rooms.map(r => r.id === room.id ? { ...r, active: r.active === false ? true : false } : r);
                                    setRooms(updated);
                                    await saveUpdatedBusiness({ rooms: updated });
                                  }}
                                  className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded transition-colors ${
                                    room.active !== false 
                                      ? 'bg-red-500/10 text-red-500 hover:bg-red-500/20' 
                                      : 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20'
                                  }`}
                                >
                                  {room.active !== false ? 'Desativar' : 'Ativar'}
                                </button>
                                <button
                                  type="button"
                                  onClick={async () => {
                                    let currentQr = qrCodes.find(q => q.roomId === room.id && q.hotelId === business.id);
                                    if (!currentQr) {
                                      const qrToken = `tok_${Date.now()}_${Math.floor(Math.random()*1000)}`;
                                      const host = window.location.origin;
                                      const qrUrl = `${host}/#/hotel-room-service/${business.id}/${room.id}/${qrToken}`;
                                      const newQrPayload = {
                                        hotelId: business.id,
                                        roomId: room.id,
                                        roomName: room.name,
                                        qrToken,
                                        url: qrUrl
                                      };
                                      
                                      const saveRes = await fetch(`${API_BASE_URL}/api/hotel_room_qr_codes`, {
                                        method: 'POST',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify(newQrPayload)
                                      });
                                      
                                      if (saveRes.ok) {
                                        currentQr = await saveRes.json();
                                        setQrCodes(prev => [...prev.filter(q => q.roomId !== room.id), currentQr]);
                                      }
                                    }
                                    setSelectedRoomForQr({ room, qr: currentQr || { url: `${window.location.origin}/hotel-room-service/${business.id}/${room.id}/error` } });
                                  }}
                                  className="text-blue-500 hover:text-blue-600 text-[9px] font-black uppercase tracking-widest px-2 py-1 bg-blue-500/10 rounded"
                                >
                                  QR Code
                                </button>
                              </div>

                              <div className="flex gap-2">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setEditingRoom(room);
                                    setEditForm(JSON.parse(JSON.stringify(room)));
                                  }}
                                  className="text-amber-500 hover:text-amber-600 text-[9px] font-black uppercase tracking-widest px-2 py-1 bg-amber-500/10 rounded"
                                >
                                  Editar
                                </button>
                                <button
                                  type="button"
                                  onClick={async () => {
                                    if (confirm(`Remover quarto ${room.name}?`)) {
                                      if (room.gallery && room.gallery.length > 0) {
                                        for (const photo of room.gallery) {
                                          if (photo.public_id) await deleteImage(photo.public_id);
                                        }
                                      }
                                      const updated = rooms.filter(r => r.id !== room.id);
                                      setRooms(updated);
                                      await saveUpdatedBusiness({ rooms: updated });
                                    }
                                  }}
                                  className="text-red-500 hover:text-red-650 text-[9px] font-black uppercase tracking-widest px-2 py-1 bg-red-500/10 rounded"
                                >
                                  Remover
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── TAB 5: CHECK-IN / CHECK-OUT ── */}
            {activeTab === 'checkin' && (
              <motion.div 
                key="checkin"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-2xl font-black uppercase tracking-tight">Gestor de Check-In & Check-Out</h2>
                  <p className="text-slate-400 text-xs mt-1">Efetuar entradas e saídas de hóspedes.</p>
                </div>

                <div className="space-y-4">
                  {reservations.filter(r => r.status === 'Confirmada' || r.status === 'Hospedado').map(res => (
                    <div key={res.id} className={`p-6 rounded-[2rem] border shadow-sm flex flex-col md:flex-row justify-between gap-6 ${
                      darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                    }`}>
                      <div>
                        <p className="font-bold text-sm">🛎️ {res.customerName || res.client}</p>
                        <p className="text-xs text-slate-400 font-semibold mt-1">Datas: {res.date} ({res.days || 1} dias)</p>
                        {res.checkinTime && (
                          <p className="text-[10px] text-emerald-600 font-bold uppercase mt-1">
                            Entrada: {res.checkinTime} (Funcionário: {res.checkinEmployee})
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        {res.status === 'Confirmada' ? (
                          <button
                            type="button"
                            onClick={() => setShowCheckinModal(res)}
                            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black uppercase tracking-wider cursor-pointer"
                          >
                            Fazer Check-In
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={async () => {
                              const updatedRes = { ...res, status: 'Concluído' };
                              
                              const targetRoomId = res.roomId || res.selectedRoom?.id;
                              const targetRoom = rooms.find(r => r.id === targetRoomId);
                              const roomName = targetRoom ? targetRoom.name : (res.selectedRoom?.number || '?');
                              
                              const updatedRooms = rooms.map(r => r.id === targetRoomId ? { ...r, status: 'Limpeza' } : r);
                              setRooms(updatedRooms);
                              
                              const newTask = {
                                id: `hk_${Date.now()}`,
                                room: roomName,
                                roomId: targetRoomId,
                                task: 'Limpeza Geral',
                                status: 'Pendente',
                                staff: 'Não Atribuído'
                              };
                              const updatedHousekeeping = [...housekeeping, newTask];
                              setHousekeeping(updatedHousekeeping);
                              
                              await handleUpdateReservation(updatedRes);
                              await saveUpdatedBusiness({ 
                                rooms: updatedRooms,
                                housekeeping: updatedHousekeeping
                              });
                              alert('Check-out efetuado! Quarto enviado para Limpeza.');
                            }}
                            className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-black uppercase tracking-wider cursor-pointer"
                          >
                            Fazer Check-Out
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* ── TAB 6: HÓSPEDES ── */}
            {activeTab === 'hospedes' && (
              <motion.div 
                key="hospedes"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-2xl font-black uppercase tracking-tight">Fichas de Hóspedes</h2>
                  <p className="text-slate-400 text-xs mt-1">Listagem de clientes e hóspedes que realizaram check-in.</p>
                </div>

                <div className={`p-6 rounded-[2rem] border shadow-sm overflow-hidden ${
                  darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                }`}>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-slate-200/20 text-[10px] font-black uppercase text-slate-450 tracking-wider">
                          <th className="py-3 px-4">Nome</th>
                          <th className="py-3 px-4">Email</th>
                          <th className="py-3 px-4">Telefone</th>
                          <th className="py-3 px-4">Reservas</th>
                        </tr>
                      </thead>
                      <tbody>
                        {reservations.map((res, idx) => (
                          <tr key={idx} className="border-b border-slate-200/10 text-xs">
                            <td className="py-3 px-4 font-bold">{res.customerName || res.client}</td>
                            <td className="py-3 px-4 text-slate-450">{res.customerEmail || 'n/a'}</td>
                            <td className="py-3 px-4 font-semibold">{res.phone || 'n/a'}</td>
                            <td className="py-3 px-4 text-slate-400">1</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── TAB 7: EXTRAS ── */}
            {activeTab === 'extras' && (
              <motion.div 
                key="extras"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="grid grid-cols-1 lg:grid-cols-3 gap-6"
              >
                {/* Form to add extra */}
                <div className={`p-6 rounded-[2rem] border shadow-sm flex flex-col ${
                  darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                }`}>
                  <h3 className="font-extrabold uppercase text-xs tracking-widest text-slate-400 mb-4">Adicionar Serviço Extra</h3>
                  <form onSubmit={handleAddExtra} className="space-y-4">
                    <div>
                      <label className="block text-[9px] font-black uppercase text-slate-400 mb-1">Nome do Serviço</label>
                      <input
                        type="text"
                        value={extName}
                        onChange={(e) => setExtName(e.target.value)}
                        placeholder="Ex: Aluguer de Carro"
                        required
                        className={`w-full px-4 py-2.5 rounded-xl border text-xs font-semibold ${
                          darkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'
                        }`}
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-black uppercase text-slate-400 mb-1">Preço (€)</label>
                      <input
                        type="number"
                        value={extPrice}
                        onChange={(e) => setExtPrice(Number(e.target.value))}
                        required
                        className={`w-full px-4 py-2.5 rounded-xl border text-xs font-semibold ${
                          darkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'
                        }`}
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-black uppercase text-slate-400 mb-1">Descrição</label>
                      <textarea
                        value={extDesc}
                        onChange={(e) => setExtDesc(e.target.value)}
                        placeholder="Ex: Serviço de aluguer de viaturas..."
                        className={`w-full px-4 py-2.5 rounded-xl border text-xs font-semibold ${
                          darkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'
                        }`}
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-[#0d1629] rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer"
                    >
                      Adicionar Serviço
                    </button>
                  </form>
                </div>

                {/* List of extras */}
                <div className={`lg:col-span-2 p-6 rounded-[2rem] border shadow-sm ${
                  darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                }`}>
                  <h3 className="font-extrabold uppercase text-xs tracking-widest text-slate-400 mb-4">Serviços Extras Ativos</h3>
                  <div className="space-y-4">
                    {extras.map(ex => (
                      <div key={ex.id} className={`p-4 rounded-xl border flex justify-between items-center ${
                        darkMode ? 'bg-slate-950 border-slate-850' : 'bg-slate-50 border-slate-200'
                      }`}>
                        <div>
                          <p className="font-bold text-sm">{ex.name}</p>
                          <p className="text-xs text-slate-450 mt-1">{ex.description || 'Sem descrição.'}</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-sm font-black text-amber-600">{ex.price}€</span>
                          <button
                            onClick={async () => {
                              if (confirm(`Remover extra ${ex.name}?`)) {
                                const updated = extras.filter(e => e.id !== ex.id);
                                setExtras(updated);
                                await saveUpdatedBusiness({ extras: updated });
                              }
                            }}
                            className="p-1 hover:bg-red-500/10 text-red-500 rounded-lg transition-all cursor-pointer"
                          >
                            <Trash size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── TAB 8: HOUSEKEEPING ── */}
            {activeTab === 'housekeeping' && (
              <motion.div 
                key="housekeeping"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="grid grid-cols-1 lg:grid-cols-3 gap-6"
              >
                {/* Form to assign cleaning */}
                <div className={`p-6 rounded-[2rem] border shadow-sm flex flex-col ${
                  darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                }`}>
                  <h3 className="font-extrabold uppercase text-xs tracking-widest text-slate-400 mb-4">Atribuir Serviço / Limpeza</h3>
                  <form onSubmit={handleAddHkTask} className="space-y-4">
                    <div>
                      <label className="block text-[9px] font-black uppercase text-slate-400 mb-1">Quarto / Unidade</label>
                      <input
                        type="text"
                        value={hkRoom}
                        onChange={(e) => setHkRoom(e.target.value)}
                        placeholder="Ex: 101"
                        required
                        className={`w-full px-4 py-2.5 rounded-xl border text-xs font-semibold ${
                          darkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'
                        }`}
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-black uppercase text-slate-400 mb-1">Serviço</label>
                      <select
                        value={hkTask}
                        onChange={(e) => setHkTask(e.target.value)}
                        className={`w-full px-4 py-2.5 rounded-xl border text-xs font-semibold ${
                          darkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'
                        }`}
                      >
                        <option value="Limpeza Geral">Limpeza Geral</option>
                        <option value="Troca de Lençóis">Troca de Lençóis</option>
                        <option value="Manutenção / Reparação">Manutenção / Reparação</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[9px] font-black uppercase text-slate-400 mb-1">Staff / Funcionário</label>
                      <input
                        type="text"
                        value={hkStaff}
                        onChange={(e) => setHkStaff(e.target.value)}
                        placeholder="Ex: Maria Do Carmo"
                        required
                        className={`w-full px-4 py-2.5 rounded-xl border text-xs font-semibold ${
                          darkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'
                        }`}
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-[#0d1629] rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer"
                    >
                      Atribuir Tarefa
                    </button>
                  </form>
                </div>

                {/* List of housekeeping tasks */}
                <div className={`lg:col-span-2 p-6 rounded-[2rem] border shadow-sm ${
                  darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                }`}>
                  <h3 className="font-extrabold uppercase text-xs tracking-widest text-slate-400 mb-4">Estado das Limpezas</h3>
                  <div className="space-y-4">
                    {housekeeping.map(hk => (
                      <div key={hk.id} className={`p-4 rounded-xl border flex justify-between items-center ${
                        darkMode ? 'bg-slate-950 border-slate-850' : 'bg-slate-50 border-slate-200'
                      }`}>
                        <div>
                          <p className="font-bold text-sm">Quarto {hk.room} · {hk.task}</p>
                          <p className="text-xs text-slate-450 mt-1">Staff: {hk.staff}</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <select
                            value={hk.status}
                            onChange={async (e) => {
                              const newStatus = e.target.value;
                              const updatedHk = housekeeping.map(h => h.id === hk.id ? { ...h, status: newStatus } : h);
                              setHousekeeping(updatedHk);
                              
                              let updatedRooms = rooms;
                              if (newStatus === 'Limpo') {
                                updatedRooms = rooms.map(r => {
                                  if (r.id === hk.roomId || r.name === hk.room) {
                                    return { ...r, status: 'Disponível' };
                                  }
                                  return r;
                                });
                                setRooms(updatedRooms);
                              }
                              
                              await saveUpdatedBusiness({ housekeeping: updatedHk, rooms: updatedRooms });
                            }}
                            className={`px-3 py-1.5 border rounded-lg text-[10px] font-black uppercase tracking-wider cursor-pointer ${
                              darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-300 text-slate-700'
                            }`}
                          >
                            <option value="Pendente">Pendente</option>
                            <option value="Em Progresso">Em Progresso</option>
                            <option value="Limpo">Limpo</option>
                          </select>
                          <button
                            onClick={async () => {
                              const updatedHk = housekeeping.filter(h => h.id !== hk.id);
                              setHousekeeping(updatedHk);
                              
                              let updatedRooms = rooms;
                              const targetRoom = rooms.find(r => r.id === hk.roomId || r.name === hk.room);
                              if (targetRoom && (targetRoom.status === 'Limpeza' || targetRoom.status === 'Manutenção')) {
                                updatedRooms = rooms.map(r => r.id === targetRoom.id ? { ...r, status: 'Disponível' } : r);
                                setRooms(updatedRooms);
                              }
                              
                              await saveUpdatedBusiness({ housekeeping: updatedHk, rooms: updatedRooms });
                            }}
                            className="p-1 hover:bg-red-500/10 text-red-500 rounded-lg transition-all cursor-pointer"
                          >
                            <Trash size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── TAB 9: RESTAURANTE (EM BREVE) ── */}
            {activeTab === 'restaurante' && (
              <motion.div 
                key="restaurante"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-2xl font-black uppercase tracking-tight">Módulo Restaurante / Room Service</h2>
                  <p className="text-slate-400 text-xs mt-1">Ligar o restaurante do hotel e gerir pedidos de comida no quarto.</p>
                </div>
                <div className="bg-slate-900/40 border border-amber-500/20 p-12 rounded-[3rem] text-center max-w-lg mx-auto space-y-4">
                  <div className="w-16 h-16 bg-amber-500/10 border border-amber-500/25 rounded-2xl mx-auto flex items-center justify-center text-amber-500">
                    <Coffee size={32} />
                  </div>
                  <h3 className="text-xl font-black text-white uppercase tracking-tight">Premium Room Service (Em Breve)</h3>
                  <p className="text-slate-450 text-xs leading-relaxed font-bold">
                    O módulo de integração de menus, ementas e room service está atualmente em desenvolvimento para esta categoria e estará disponível na próxima atualização.
                  </p>
                </div>
              </motion.div>
            )}

            {/* ── TAB 10: MENSAGENS ── */}
            {activeTab === 'mensagens' && (
              <motion.div 
                key="mensagens"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-6 h-[calc(100vh-140px)] flex flex-col"
              >
                <div className="shrink-0">
                  <h2 className="text-2xl font-black uppercase tracking-tight">Conversas de Emergência e Suporte</h2>
                  <p className="text-slate-400 text-xs mt-1">Mensagens diretas e em tempo real com os hóspedes.</p>
                </div>

                <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6 min-h-0">
                  {/* Left list */}
                  <div className={`p-4 rounded-[2rem] border flex flex-col ${
                    darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                  } shadow-sm overflow-y-auto`}>
                    <h3 className="font-extrabold uppercase text-xs tracking-widest text-slate-400 mb-3 px-2">Hóspedes Activos</h3>
                    <div className="space-y-2">
                      {reservations.map(res => (
                        <button
                          key={res.id}
                          onClick={() => setSelectedResChat(res)}
                          className={`w-full text-left p-3 rounded-xl border transition-all flex flex-col ${
                            selectedResChat?.id === res.id
                              ? 'bg-amber-500/10 border-amber-500/30 text-amber-600 font-bold'
                              : darkMode ? 'border-slate-800 hover:bg-slate-800/50' : 'border-slate-100 hover:bg-slate-50'
                          }`}
                        >
                          <span className="font-bold text-xs">{res.customerName || res.client}</span>
                          <span className="text-[10px] text-slate-400 uppercase mt-0.5">{res.date}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Right Chat Panel */}
                  <div className={`md:col-span-2 rounded-[2rem] border flex flex-col shadow-sm min-h-0 ${
                    darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                  }`}>
                    {selectedResChat ? (
                      <div className="flex-1 flex flex-col min-h-0 p-6">
                        <div className="border-b pb-3 mb-4 shrink-0 flex justify-between items-center">
                          <div>
                            <h4 className="font-black text-sm uppercase tracking-tight">{selectedResChat.customerName || selectedResChat.client}</h4>
                            <p className="text-[9px] text-slate-400 font-bold uppercase mt-0.5">Reserva: {selectedResChat.id}</p>
                          </div>
                        </div>

                        {/* Messages flow */}
                        <div className="flex-1 overflow-y-auto space-y-3 mb-4 pr-2">
                          {(selectedResChat.chatMessages || []).map((msg: any, idx: number) => (
                            <div key={idx} className={`flex flex-col ${msg.sender === 'admin' ? 'items-end' : 'items-start'}`}>
                              <div className={`max-w-[85%] rounded-2xl p-3 text-xs font-semibold ${
                                msg.sender === 'admin' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-slate-200 text-slate-800 rounded-tl-none'
                              }`}>
                                {msg.text}
                              </div>
                              <span className="text-[8px] text-slate-400 mt-1">
                                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                          ))}
                        </div>

                        {/* Input form */}
                        <div className="flex gap-2 border-t pt-4 shrink-0">
                          <input
                            type="text"
                            placeholder="Escreva a sua resposta..."
                            value={chatInput}
                            onChange={(e) => setChatInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                            className={`flex-1 px-4 py-2.5 rounded-xl border text-xs font-semibold ${
                              darkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'
                            }`}
                          />
                          <button
                            onClick={handleSendMessage}
                            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer"
                          >
                            Enviar
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-8">
                        <MessageSquare size={48} className="opacity-10 mb-3" />
                        <p className="text-sm font-black uppercase tracking-widest">Painel de Suporte & Chat</p>
                        <p className="text-[10px] text-center max-w-xs mt-1 italic">
                          Selecione um hóspede na barra lateral para iniciar a conversa.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── TAB 11: AVALIAÇÕES ── */}
            {activeTab === 'avaliacoes' && (
              <motion.div 
                key="avaliacoes"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-2xl font-black uppercase tracking-tight">Avaliações do Alojamento</h2>
                  <p className="text-slate-400 text-xs mt-1">Consultar as classificações e opiniões deixadas pelos hóspedes.</p>
                </div>

                <div className="space-y-4">
                  {(business.reviews_list || []).length === 0 ? (
                    <div className="bg-white p-12 rounded-[2rem] border border-slate-100 text-center">
                      <p className="text-slate-400 font-bold text-sm">Ainda sem avaliações registadas.</p>
                    </div>
                  ) : (
                    (business.reviews_list || []).map((rev: any) => (
                      <div key={rev.id} className={`p-6 rounded-[2rem] border shadow-sm space-y-3 ${
                        darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                      }`}>
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-sm">{rev.customerName || 'Anónimo'}</span>
                          <div className="flex items-center gap-1 text-yellow-500">
                            {Array.from({ length: rev.rating || 5 }).map((_, i) => (
                              <Star key={i} size={14} className="fill-current" />
                            ))}
                          </div>
                        </div>
                        <p className="text-xs text-slate-500 font-medium leading-relaxed">{rev.comment}</p>
                        <span className="text-[9px] text-slate-400 block">{new Date(rev.date).toLocaleDateString()}</span>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            )}

            {/* ── TAB 12: RELATÓRIOS ── */}
            {activeTab === 'relatorios' && (
              <motion.div 
                key="relatorios"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-2xl font-black uppercase tracking-tight">Relatórios & Ocupação</h2>
                  <p className="text-slate-400 text-xs mt-1">Visualizar análise estatística de desempenho financeiro e ocupação.</p>
                </div>
                <div className={`p-6 rounded-[2rem] border shadow-sm ${
                  darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                }`}>
                  <h3 className="font-extrabold uppercase text-xs tracking-widest text-slate-400 mb-4">Relatório de Receita</h3>
                  <div className="h-64 flex items-end justify-between gap-2 pt-6 border-b border-slate-200/20">
                    {[1200, 1500, 2200, 1800, 3200, 4500, 5200].map((val, idx) => (
                      <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                        <div 
                          style={{ height: `${(val / 6000) * 100}%` }} 
                          className="w-full bg-gradient-to-t from-amber-500 to-amber-600 rounded-t-lg"
                        />
                        <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Mês {idx + 1}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── TAB: PEDIDOS DO QUARTO ── */}
            {activeTab === 'pedidos' && (
              <motion.div 
                key="pedidos"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-6"
              >
                <div className="flex justify-between items-center flex-wrap gap-4">
                  <div>
                    <h2 className="text-2xl font-black uppercase tracking-tight">Pedidos do Quarto / Concierge</h2>
                    <p className="text-slate-400 text-xs mt-1">Acompanhe e gira os pedidos recebidos em tempo real via QR Code.</p>
                  </div>
                  
                  <div className={`p-4 rounded-2xl border flex items-center gap-4 ${
                    darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                  }`}>
                    <span className="text-xs font-black uppercase tracking-wider text-slate-400">Som de Notificação</span>
                    <button
                      type="button"
                      onClick={() => setAudioNotificationEnabled(!audioNotificationEnabled)}
                      className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all cursor-pointer ${
                        audioNotificationEnabled 
                          ? 'bg-emerald-500/10 text-emerald-500' 
                          : 'bg-red-500/10 text-red-500'
                      }`}
                    >
                      {audioNotificationEnabled ? 'Ativado (A5 Tone)' : 'Desativado'}
                    </button>
                  </div>
                </div>

                <div className={`p-6 rounded-[2rem] border shadow-sm ${
                  darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                }`}>
                  <h3 className="font-extrabold uppercase text-xs tracking-widest text-slate-400 mb-6">Lista de Pedidos Ativos</h3>
                  
                  {roomRequests.length === 0 ? (
                    <div className="text-center py-12 text-slate-400 font-bold text-xs uppercase tracking-widest">
                      Nenhum pedido de quarto registado até ao momento.
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {roomRequests.slice().reverse().map(req => {
                        const statusColors = {
                          'Pendente': 'bg-amber-500/10 text-amber-500 border-amber-500/20',
                          'Aceite': 'bg-blue-500/10 text-blue-500 border-blue-500/20',
                          'Em preparação': 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20',
                          'Entregue': 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
                          'Cancelado': 'bg-red-500/10 text-red-500 border-red-500/20'
                        };

                        const handleStatusChange = async (newStatus: string) => {
                          try {
                            const res = await fetch(`${API_BASE_URL}/api/hotel_room_requests/${req.id}`, {
                              method: 'PUT',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ status: newStatus })
                            });
                            if (res.ok) {
                              const updatedReq = await res.json();
                              setRoomRequests(prev => prev.map(r => r.id === req.id ? updatedReq : r));
                            }
                          } catch (e) {
                            console.error(e);
                          }
                        };

                        const handleAssignStaff = async (staffName: string) => {
                          try {
                            const res = await fetch(`${API_BASE_URL}/api/hotel_room_requests/${req.id}`, {
                              method: 'PUT',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ assignedTo: staffName })
                            });
                            if (res.ok) {
                              const updatedReq = await res.json();
                              setRoomRequests(prev => prev.map(r => r.id === req.id ? updatedReq : r));
                            }
                          } catch (e) {
                            console.error(e);
                          }
                        };

                        return (
                          <div key={req.id} className={`p-6 rounded-2xl border flex flex-col md:flex-row justify-between gap-6 transition-all ${
                            darkMode ? 'bg-slate-950 border-slate-850 hover:bg-slate-900' : 'bg-slate-50 border-slate-200 hover:bg-white'
                          }`}>
                            <div className="space-y-2 flex-1">
                              <div className="flex items-center gap-3 flex-wrap">
                                <span className="text-sm font-black uppercase text-slate-850 dark:text-white">
                                  Quarto {req.roomName}
                                </span>
                                <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border ${statusColors[req.status as keyof typeof statusColors] || 'bg-slate-500/10'}`}>
                                  {req.status}
                                </span>
                                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">
                                  {new Date(req.createdAt).toLocaleString('pt-PT')}
                                </span>
                              </div>
                              
                              <p className="text-xs font-bold text-slate-500 dark:text-slate-400">
                                Categoria: <strong className="text-slate-700 dark:text-slate-200">{req.category}</strong> · Item: <strong className="text-slate-700 dark:text-slate-200">{req.itemName}</strong>
                                {req.quantity > 1 && ` (x${req.quantity})`}
                              </p>
                              
                              {req.notes && (
                                <div className={`p-3 rounded-xl border text-[11px] font-medium leading-relaxed ${
                                  darkMode ? 'bg-slate-900 border-slate-800 text-slate-300' : 'bg-white border-slate-200 text-slate-600'
                                }`}>
                                  Nota: "{req.notes}"
                                </div>
                              )}

                              <div className="text-xs font-bold text-slate-500 dark:text-slate-400">
                                Preço: <strong className="text-amber-500">{req.price > 0 ? `${req.price * (req.quantity || 1)}€` : 'Gratuito'}</strong>
                              </div>

                              <div className="flex items-center gap-2 pt-1.5 flex-wrap">
                                <span className="text-[9px] font-black uppercase text-slate-450">Atribuído a:</span>
                                <select
                                  value={req.assignedTo || 'Não Atribuído'}
                                  onChange={(e) => handleAssignStaff(e.target.value)}
                                  className={`px-3 py-1.5 border rounded-lg text-[10px] font-black uppercase tracking-wider cursor-pointer ${
                                    darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-300 text-slate-700'
                                  }`}
                                >
                                  <option value="Não Atribuído">Não Atribuído</option>
                                  <option value="Maria Silva (Housekeeping)">Maria Silva (Housekeeping)</option>
                                  <option value="João Santos (Manutenção)">João Santos (Manutenção)</option>
                                  <option value="Ana Costa (Receção)">Ana Costa (Receção)</option>
                                  <option value="Carlos Oliveira (Restaurante)">Carlos Oliveira (Restaurante)</option>
                                </select>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 flex-wrap md:flex-col md:justify-center md:items-end">
                              {req.status === 'Pendente' && (
                                <>
                                  <button
                                    type="button"
                                    onClick={() => handleStatusChange('Aceite')}
                                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer"
                                  >
                                    Aceitar Pedido
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleStatusChange('Cancelado')}
                                    className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer"
                                  >
                                    Cancelar
                                  </button>
                                </>
                              )}
                              
                              {req.status === 'Aceite' && (
                                <>
                                  <button
                                    type="button"
                                    onClick={() => handleStatusChange('Em preparação')}
                                    className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer"
                                  >
                                    Em Preparação
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleStatusChange('Cancelado')}
                                    className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer"
                                  >
                                    Cancelar
                                  </button>
                                </>
                              )}

                              {req.status === 'Em preparação' && (
                                <button
                                  type="button"
                                  onClick={() => handleStatusChange('Entregue')}
                                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer"
                                >
                                  Marcar Entregue
                                </button>
                              )}

                              {req.status === 'Entregue' && (
                                <span className="text-[10px] font-black uppercase text-emerald-600 flex items-center gap-1">
                                  <Check size={14} /> Entregue com Sucesso
                                </span>
                              )}

                              {req.status === 'Cancelado' && (
                                <span className="text-[10px] font-black uppercase text-red-500">
                                  Pedido Cancelado
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* ── TAB 13: CONFIGURAÇÕES ── */}
            {activeTab === 'configuracoes' && (
              <motion.div 
                key="configuracoes"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className={`p-8 rounded-[2rem] border shadow-sm ${
                  darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                }`}
              >
                <h3 className="font-extrabold uppercase text-xs tracking-widest text-slate-400 mb-6">Configurar Perfil do Alojamento</h3>
                <form onSubmit={async (e) => {
                  e.preventDefault();
                  const form = e.currentTarget;
                  const name = (form.elements.namedItem('name') as HTMLInputElement).value;
                  const publicEmail = (form.elements.namedItem('publicEmail') as HTMLInputElement).value;
                  const phone = (form.elements.namedItem('phone') as HTMLInputElement).value;
                  const description = (form.elements.namedItem('description') as HTMLTextAreaElement).value;

                  await saveUpdatedBusiness({
                    name,
                    publicEmail,
                    phone,
                    description,
                    image: hotelImage,
                    gallery: hotelGallery
                  });
                  alert('Configurações guardadas com sucesso!');
                }} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[9px] font-black uppercase text-slate-400 mb-1 font-bold">Nome Público</label>
                      <input
                        name="name"
                        type="text"
                        defaultValue={business.name}
                        required
                        className={`w-full px-4 py-3 rounded-xl border text-xs font-semibold ${
                          darkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'
                        }`}
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-black uppercase text-slate-400 mb-1 font-bold">Email Público</label>
                      <input
                        name="publicEmail"
                        type="email"
                        defaultValue={business.publicEmail || ''}
                        className={`w-full px-4 py-3 rounded-xl border text-xs font-semibold ${
                          darkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'
                        }`}
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-black uppercase text-slate-400 mb-1 font-bold">Telefone / Contacto</label>
                      <input
                        name="phone"
                        type="text"
                        defaultValue={business.phone || business.contacto || ''}
                        className={`w-full px-4 py-3 rounded-xl border text-xs font-semibold ${
                          darkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'
                        }`}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[9px] font-black uppercase text-slate-400 mb-1 font-bold">Descrição do Alojamento</label>
                    <textarea
                      name="description"
                      rows={4}
                      defaultValue={business.description || ''}
                      className={`w-full px-4 py-3 rounded-xl border text-xs font-semibold ${
                        darkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'
                      }`}
                    />
                  </div>

                  {/* Foto de Perfil do Hotel */}
                  <div className="border border-slate-200/20 dark:border-slate-800 p-5 rounded-2xl space-y-4">
                    <h4 className="font-extrabold uppercase text-[10px] tracking-widest text-slate-450">Foto de Perfil do Hotel</h4>
                    <div className="flex items-center gap-4">
                      {hotelImage ? (
                        <div className="relative w-24 h-24 rounded-2xl overflow-hidden border border-slate-300/20 group">
                          <img src={hotelImage.startsWith('/') ? `${API_BASE_URL}${hotelImage}` : hotelImage} className="w-full h-full object-cover" alt="Profile" />
                          <button
                            type="button"
                            onClick={() => setHotelImage('')}
                            className="absolute top-1 right-1 p-1 bg-red-600 hover:bg-red-750 text-white rounded-full transition-all cursor-pointer"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ) : (
                        <div className="w-24 h-24 rounded-2xl bg-slate-100 dark:bg-slate-950 flex items-center justify-center text-slate-400 border border-dashed border-slate-300">
                          <Home size={24} className="opacity-30" />
                        </div>
                      )}
                      <div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const meta = await uploadImage(file);
                              if (meta) {
                                setHotelImage(meta.url);
                              }
                            }
                          }}
                          className="text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-black file:uppercase file:bg-amber-500/10 file:text-amber-500 hover:file:bg-amber-500/20 file:cursor-pointer"
                        />
                        <p className="text-[10px] text-slate-400 mt-2">Formatos aceites: JPG, PNG, WEBP. Máx: 5MB.</p>
                      </div>
                    </div>
                  </div>

                  {/* Galeria Principal */}
                  <div className="border border-slate-200/20 dark:border-slate-800 p-5 rounded-2xl space-y-4">
                    <h4 className="font-extrabold uppercase text-[10px] tracking-widest text-slate-450">Galeria Principal</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4">
                      {hotelGallery.map((photo: any, index: number) => {
                        const url = typeof photo === 'object' ? photo.url : photo;
                        return (
                          <div key={index} className="relative w-full h-24 rounded-2xl overflow-hidden border border-slate-300/20 group">
                            <img src={url.startsWith('/') ? `${API_BASE_URL}${url}` : url} className="w-full h-full object-cover" alt={`Gallery ${index}`} />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5">
                              <button
                                type="button"
                                title="Definir Principal"
                                onClick={() => setHotelImage(url)}
                                className="p-1 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-full transition-all cursor-pointer"
                              >
                                <Home size={12} />
                              </button>
                              {index > 0 && (
                                <button
                                  type="button"
                                  title="Mover para a esquerda"
                                  onClick={() => {
                                    const nextGallery = [...hotelGallery];
                                    const temp = nextGallery[index];
                                    nextGallery[index] = nextGallery[index - 1];
                                    nextGallery[index - 1] = temp;
                                    setHotelGallery(nextGallery);
                                  }}
                                  className="p-1 bg-blue-500 hover:bg-blue-600 text-white rounded-full transition-all cursor-pointer"
                                >
                                  <ChevronRight size={12} className="rotate-180" />
                                </button>
                              )}
                              {index < hotelGallery.length - 1 && (
                                <button
                                  type="button"
                                  title="Mover para a direita"
                                  onClick={() => {
                                    const nextGallery = [...hotelGallery];
                                    const temp = nextGallery[index];
                                    nextGallery[index] = nextGallery[index + 1];
                                    nextGallery[index + 1] = temp;
                                    setHotelGallery(nextGallery);
                                  }}
                                  className="p-1 bg-blue-500 hover:bg-blue-600 text-white rounded-full transition-all cursor-pointer"
                                >
                                  <ChevronRight size={12} />
                                </button>
                              )}
                              <button
                                type="button"
                                title="Eliminar"
                                onClick={async () => {
                                  const photoObj = hotelGallery[index];
                                  if (typeof photoObj === 'object' && photoObj.public_id) {
                                    await deleteImage(photoObj.public_id);
                                  }
                                  const nextGallery = hotelGallery.filter((_, idx) => idx !== index);
                                  setHotelGallery(nextGallery);
                                }}
                                className="p-1 bg-red-600 hover:bg-red-755 text-white rounded-full transition-all cursor-pointer"
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                      <label className="w-full h-24 rounded-2xl border border-dashed border-slate-305 dark:border-slate-800 bg-slate-100/50 dark:bg-slate-950 flex flex-col items-center justify-center text-slate-400 hover:text-slate-650 cursor-pointer hover:border-slate-400 transition-all">
                        <PlusCircle size={20} className="mb-1" />
                        <span className="text-[9px] font-black uppercase tracking-wider">Adicionar</span>
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={async (e) => {
                            const files = e.target.files;
                            if (files) {
                              const uploaded = [...hotelGallery];
                              for (let i = 0; i < files.length; i++) {
                                const file = files[i];
                                const meta = await uploadImage(file);
                                if (meta) {
                                  uploaded.push(meta);
                                }
                              }
                              setHotelGallery(uploaded);
                            }
                          }}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer shadow-md shadow-amber-500/10"
                  >
                    Guardar Alterações
                  </button>
                </form>

                {/* Sincronização de Calendário */}
                <div className="mt-8 pt-8 border-t border-slate-200/20 space-y-4">
                  <h4 className="font-extrabold uppercase text-xs tracking-widest text-slate-400">Sincronização de Calendário (iCal)</h4>
                  <p className="text-xs text-slate-450">
                    Insira os endereços iCal das suas plataformas para sincronizar a disponibilidade e evitar overbookings.
                  </p>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[9px] font-black uppercase text-slate-400 mb-1 font-bold">Link iCal Booking.com</label>
                      <input
                        type="text"
                        value={icalBooking}
                        onChange={(e) => setIcalBooking(e.target.value)}
                        placeholder="https://booking.com/feeds/co-calendar/..."
                        className={`w-full px-4 py-3 rounded-xl border text-xs font-semibold ${
                          darkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'
                        }`}
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-black uppercase text-slate-400 mb-1 font-bold">Link iCal Airbnb</label>
                      <input
                        type="text"
                        value={icalAirbnb}
                        onChange={(e) => setIcalAirbnb(e.target.value)}
                        placeholder="https://airbnb.com/calendar/ical/..."
                        className={`w-full px-4 py-3 rounded-xl border text-xs font-semibold ${
                          darkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'
                        }`}
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-black uppercase text-slate-400 mb-1 font-bold">Link iCal Vrbo/Expedia</label>
                      <input
                        type="text"
                        value={icalVrbo}
                        onChange={(e) => setIcalVrbo(e.target.value)}
                        placeholder="https://vrbo.com/icalendar/..."
                        className={`w-full px-4 py-3 rounded-xl border text-xs font-semibold ${
                          darkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'
                        }`}
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-black uppercase text-slate-400 mb-1 font-bold">Link iCal Externo Adicional</label>
                      <input
                        type="text"
                        value={icalOther}
                        onChange={(e) => setIcalOther(e.target.value)}
                        placeholder="https://exemplo.com/ical/..."
                        className={`w-full px-4 py-3 rounded-xl border text-xs font-semibold ${
                          darkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'
                        }`}
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-black uppercase text-slate-400 mb-1 font-bold">Link iCal AzoresToYou para Exportação (Leitura)</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          readOnly
                          value={`https://azores4you.com/api/hotels/${business.id}/export.ics`}
                          className={`flex-1 px-4 py-3 rounded-xl border text-xs font-semibold bg-slate-100 dark:bg-slate-950/60 border-slate-200 dark:border-slate-850 text-slate-500`}
                        />
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(`https://azores4you.com/api/hotels/${business.id}/export.ics`);
                            alert('Link copiado para a área de transferência!');
                          }}
                          className="px-4 bg-slate-500/10 hover:bg-slate-500/20 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-black uppercase tracking-wider transition-all border border-slate-300/20"
                        >
                          Copiar
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={handleSync}
                      disabled={isSyncing}
                      className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer shadow-md shadow-amber-500/10 disabled:opacity-50"
                    >
                      {isSyncing ? 'A Sincronizar...' : 'Sincronizar agora'}
                    </button>
                  </div>
                </div>

                {/* Configuração do Menu do Concierge / Room Service */}
                <div className="mt-8 pt-8 border-t border-slate-200/20 space-y-6">
                  <div>
                    <h4 className="font-extrabold uppercase text-xs tracking-widest text-slate-400">Configuração do Menu Concierge (QR Code)</h4>
                    <p className="text-xs text-slate-450 mt-1">
                      Customize os itens, preços e tempos de resposta que aparecem aos seus hóspedes na página digital de Concierge.
                    </p>
                  </div>

                  {/* Category switcher buttons */}
                  <div className="flex gap-2 overflow-x-auto pb-2 border-b border-slate-200/10">
                    {([
                      { id: 'quick', label: 'Pedidos Rápidos' },
                      { id: 'housekeeping', label: 'Housekeeping' },
                      { id: 'maintenance', label: 'Manutenção' },
                      { id: 'extras', label: 'Extras Pagos' }
                    ] as const).map(cat => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setConfigActiveCategory(cat.id)}
                        className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all border ${
                          configActiveCategory === cat.id 
                            ? 'bg-amber-500 border-amber-500 text-slate-950 font-black shadow-md shadow-amber-500/10' 
                            : darkMode ? 'bg-slate-950 border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-500'
                        }`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>

                  {/* Config items list for current active category */}
                  <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
                    {(roomServiceConfig[configActiveCategory] || []).map((item: any) => (
                      <div 
                        key={item.id} 
                        className={`p-4 rounded-2xl border grid grid-cols-1 md:grid-cols-12 gap-3 items-center ${
                          darkMode ? 'bg-slate-950 border-slate-850' : 'bg-slate-50 border-slate-200'
                        }`}
                      >
                        {/* Name input */}
                        <div className="md:col-span-5">
                          <label className="block text-[8px] font-black uppercase text-slate-400 mb-1">Nome do Item</label>
                          <input
                            type="text"
                            value={item.name}
                            onChange={(e) => {
                              const updatedList = roomServiceConfig[configActiveCategory].map((i: any) => 
                                i.id === item.id ? { ...i, name: e.target.value } : i
                              );
                              setRoomServiceConfig({ ...roomServiceConfig, [configActiveCategory]: updatedList });
                            }}
                            className={`w-full px-3 py-2 rounded-lg border text-xs font-semibold ${
                              darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-800'
                            }`}
                          />
                        </div>

                        {/* Price input */}
                        <div className="md:col-span-2">
                          <label className="block text-[8px] font-black uppercase text-slate-400 mb-1">Preço (€)</label>
                          <input
                            type="number"
                            value={item.price}
                            onChange={(e) => {
                              const updatedList = roomServiceConfig[configActiveCategory].map((i: any) => 
                                i.id === item.id ? { ...i, price: Number(e.target.value) } : i
                              );
                              setRoomServiceConfig({ ...roomServiceConfig, [configActiveCategory]: updatedList });
                            }}
                            className={`w-full px-3 py-2 rounded-lg border text-xs font-semibold ${
                              darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-800'
                            }`}
                          />
                        </div>

                        {/* Estimated Time input */}
                        <div className="md:col-span-2">
                          <label className="block text-[8px] font-black uppercase text-slate-400 mb-1">Tempo (min)</label>
                          <input
                            type="text"
                            value={item.estimatedTime || ''}
                            onChange={(e) => {
                              const updatedList = roomServiceConfig[configActiveCategory].map((i: any) => 
                                i.id === item.id ? { ...i, estimatedTime: e.target.value } : i
                              );
                              setRoomServiceConfig({ ...roomServiceConfig, [configActiveCategory]: updatedList });
                            }}
                            className={`w-full px-3 py-2 rounded-lg border text-xs font-semibold ${
                              darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-800'
                            }`}
                          />
                        </div>

                        {/* Active Toggle & Delete */}
                        <div className="md:col-span-3 flex items-center justify-end gap-3 pt-4 md:pt-0">
                          <button
                            type="button"
                            onClick={() => {
                              const updatedList = roomServiceConfig[configActiveCategory].map((i: any) => 
                                i.id === item.id ? { ...i, isActive: !i.isActive } : i
                              );
                              setRoomServiceConfig({ ...roomServiceConfig, [configActiveCategory]: updatedList });
                            }}
                            className={`px-3 py-2 rounded-xl text-[9px] font-black uppercase tracking-wider transition-all border ${
                              item.isActive !== false 
                                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' 
                                : 'bg-red-500/10 border-red-500/20 text-red-500'
                            }`}
                          >
                            {item.isActive !== false ? 'Ativo' : 'Inativo'}
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              if (confirm('Tem a certeza que deseja remover este item?')) {
                                const updatedList = roomServiceConfig[configActiveCategory].filter((i: any) => i.id !== item.id);
                                setRoomServiceConfig({ ...roomServiceConfig, [configActiveCategory]: updatedList });
                              }
                            }}
                            className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 rounded-xl transition-all"
                          >
                            <Trash size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Add item form for current active category */}
                  <div className={`p-5 rounded-2xl border ${
                    darkMode ? 'bg-slate-950/40 border-slate-850' : 'bg-slate-100/30 border-slate-250'
                  }`}>
                    <h5 className="font-extrabold uppercase text-[10px] tracking-widest text-slate-400 mb-3">Adicionar Item a esta Categoria</h5>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
                      <div>
                        <label className="block text-[8px] font-black uppercase text-slate-400 mb-1">Nome do Item</label>
                        <input
                          type="text"
                          placeholder="Ex: Champanhe Seco"
                          value={newItemName}
                          onChange={(e) => setNewItemName(e.target.value)}
                          className={`w-full px-3 py-2.5 rounded-lg border text-xs font-semibold ${
                            darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-800'
                          }`}
                        />
                      </div>
                      <div>
                        <label className="block text-[8px] font-black uppercase text-slate-400 mb-1">Preço (€)</label>
                        <input
                          type="number"
                          value={newItemPrice}
                          onChange={(e) => setNewItemPrice(Number(e.target.value))}
                          className={`w-full px-3 py-2.5 rounded-lg border text-xs font-semibold ${
                            darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-800'
                          }`}
                        />
                      </div>
                      <div>
                        <label className="block text-[8px] font-black uppercase text-slate-400 mb-1">Tempo Est. (min)</label>
                        <input
                          type="text"
                          value={newItemTime}
                          onChange={(e) => setNewItemTime(e.target.value)}
                          className={`w-full px-3 py-2.5 rounded-lg border text-xs font-semibold ${
                            darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-800'
                          }`}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          if (!newItemName.trim()) return;
                          const newItem = {
                            id: `${configActiveCategory}_${Date.now()}`,
                            name: newItemName.trim(),
                            price: Number(newItemPrice),
                            estimatedTime: newItemTime.trim() || '15',
                            isActive: true
                          };
                          setRoomServiceConfig({
                            ...roomServiceConfig,
                            [configActiveCategory]: [...(roomServiceConfig[configActiveCategory] || []), newItem]
                          });
                          setNewItemName('');
                          setNewItemPrice(0);
                          setNewItemTime('15');
                        }}
                        className="py-2.5 bg-slate-900 hover:bg-black dark:bg-amber-500 dark:hover:bg-amber-600 dark:text-slate-950 text-white rounded-lg text-xs font-black uppercase tracking-wider transition-all cursor-pointer text-center"
                      >
                        + Adicionar Item
                      </button>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4 border-t border-slate-250/10">
                    <button
                      type="button"
                      onClick={async () => {
                        await saveUpdatedBusiness({ roomServiceConfig });
                        alert('Menu do Concierge guardado com sucesso!');
                      }}
                      className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer shadow-md shadow-amber-500/10"
                    >
                      Guardar Menu Concierge
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </main>
      </div>

      {/* Manual Date Blocker Modal */}
      <AnimatePresence>
        {showBlockModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`border rounded-3xl w-full max-w-md p-8 shadow-2xl relative overflow-hidden z-10 ${
                darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-800'
              }`}
            >
              <button 
                onClick={() => setShowBlockModal(false)}
                className="absolute top-6 right-6 p-2 bg-slate-500/15 hover:bg-slate-500/25 rounded-full transition-all text-slate-400 hover:text-slate-900 cursor-pointer"
              >
                <X size={16} />
              </button>

              <h3 className="text-lg font-black uppercase tracking-tight mb-4">Bloquear Datas Manualmente</h3>
              <form onSubmit={handleManualBlock} className="space-y-4">
                <div>
                  <label className="block text-[9px] font-black uppercase text-slate-400 mb-1 font-bold">Data de Início</label>
                  <input
                    type="date"
                    required
                    value={manualBlockStart}
                    onChange={(e) => setManualBlockStart(e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl border text-xs font-semibold ${
                      darkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-black uppercase text-slate-400 mb-1 font-bold">Data de Fim</label>
                  <input
                    type="date"
                    required
                    value={manualBlockEnd}
                    onChange={(e) => setManualBlockEnd(e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl border text-xs font-semibold ${
                      darkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'
                    }`}
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer shadow-md shadow-amber-500/10"
                >
                  Confirmar Bloqueio
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Room Modal */}
      <AnimatePresence>
        {editingRoom && editForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm overflow-y-auto">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`border rounded-3xl w-full max-w-4xl p-8 shadow-2xl relative overflow-hidden z-10 max-h-[90vh] overflow-y-auto ${
                darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-800'
              }`}
            >
              <button 
                type="button"
                onClick={() => { setEditingRoom(null); setEditForm(null); }}
                className="absolute top-6 right-6 p-2 bg-slate-500/15 hover:bg-slate-500/25 rounded-full transition-all text-slate-400 hover:text-slate-900 cursor-pointer"
              >
                <X size={16} />
              </button>

              <h3 className="text-lg font-black uppercase tracking-tight mb-6 text-amber-500">Editar Quarto / Unidade: {editingRoom.name}</h3>
              
              <form onSubmit={async (e) => {
                e.preventDefault();
                const updatedRooms = rooms.map(r => r.id === editForm.id ? editForm : r);
                setRooms(updatedRooms);
                await saveUpdatedBusiness({ rooms: updatedRooms });
                setEditingRoom(null);
                setEditForm(null);
                alert('Quarto guardado com sucesso!');
              }} className="space-y-6">
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[9px] font-black uppercase text-slate-400 mb-1">Nome / Número do Quarto</label>
                    <input
                      type="text"
                      required
                      value={editForm.name}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      className={`w-full px-4 py-2.5 rounded-xl border text-xs font-semibold ${
                        darkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-black uppercase text-slate-400 mb-1">Tipo de Unidade</label>
                    <select
                      value={editForm.type}
                      onChange={(e) => setEditForm({ ...editForm, type: e.target.value })}
                      className={`w-full px-4 py-2.5 rounded-xl border text-xs font-semibold ${
                        darkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'
                      }`}
                    >
                      <option value="T1 Standard">T1 Standard</option>
                      <option value="T1 Deluxe">T1 Deluxe</option>
                      <option value="T2 Family">T2 Family</option>
                      <option value="T1 Suite">T1 Suite</option>
                      <option value="Alojamento Local">Alojamento Local</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[9px] font-black uppercase text-slate-400 mb-1">Preço por Noite (€)</label>
                    <input
                      type="number"
                      required
                      value={editForm.price}
                      onChange={(e) => setEditForm({ ...editForm, price: Number(e.target.value) })}
                      className={`w-full px-4 py-2.5 rounded-xl border text-xs font-semibold ${
                        darkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'
                      }`}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-[9px] font-black uppercase text-slate-400 mb-1">Capacidade</label>
                    <input
                      type="number"
                      value={editForm.capacity}
                      onChange={(e) => setEditForm({ ...editForm, capacity: Number(e.target.value) })}
                      className={`w-full px-4 py-2.5 rounded-xl border text-xs font-semibold ${
                        darkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-black uppercase text-slate-400 mb-1">Camas</label>
                    <input
                      type="number"
                      value={editForm.beds}
                      onChange={(e) => setEditForm({ ...editForm, beds: Number(e.target.value) })}
                      className={`w-full px-4 py-2.5 rounded-xl border text-xs font-semibold ${
                        darkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-black uppercase text-slate-400 mb-1">Casas de Banho</label>
                    <input
                      type="number"
                      value={editForm.bathrooms}
                      onChange={(e) => setEditForm({ ...editForm, bathrooms: Number(e.target.value) })}
                      className={`w-full px-4 py-2.5 rounded-xl border text-xs font-semibold ${
                        darkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-black uppercase text-slate-400 mb-1">Área (m²)</label>
                    <input
                      type="number"
                      value={editForm.area}
                      onChange={(e) => setEditForm({ ...editForm, area: Number(e.target.value) })}
                      className={`w-full px-4 py-2.5 rounded-xl border text-xs font-semibold ${
                        darkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'
                      }`}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[9px] font-black uppercase text-slate-400 mb-1">Estado</label>
                    <select
                      value={editForm.status}
                      onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                      className={`w-full px-4 py-2.5 rounded-xl border text-xs font-semibold ${
                        darkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'
                      }`}
                    >
                      <option value="Disponível">Disponível</option>
                      <option value="Ocupado">Ocupado</option>
                      <option value="Limpeza">Limpeza</option>
                      <option value="Manutenção">Manutenção</option>
                      <option value="Bloqueado">Bloqueado</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[9px] font-black uppercase text-slate-400 mb-1">Serviços (separados por vírgula)</label>
                    <input
                      type="text"
                      value={Array.isArray(editForm.services) ? editForm.services.join(', ') : editForm.services || ''}
                      onChange={(e) => setEditForm({ ...editForm, services: e.target.value.split(',').map((s: string) => s.trim()).filter(Boolean) })}
                      className={`w-full px-4 py-2.5 rounded-xl border text-xs font-semibold ${
                        darkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'
                      }`}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[9px] font-black uppercase text-slate-400 mb-1">Descrição</label>
                  <textarea
                    value={editForm.description}
                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                    rows={2}
                    className={`w-full px-4 py-2.5 rounded-xl border text-xs font-semibold ${
                      darkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'
                    }`}
                  />
                </div>

                {/* Gallery Manager */}
                <div className="border-t border-slate-200/20 pt-4 space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">Galeria da Unidade</h4>
                    <label className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-black text-[9px] uppercase tracking-wider rounded-lg transition-all cursor-pointer">
                      + Adicionar Fotos
                      <input 
                        type="file" 
                        multiple 
                        accept="image/*" 
                        className="hidden" 
                        onChange={async (e) => {
                          if (!e.target.files) return;
                          const files = Array.from(e.target.files);
                          const uploaded = [];
                          for (const file of files) {
                            const img = await uploadImage(file);
                            if (img) uploaded.push(img);
                          }
                          const updatedGallery = [...(editForm.gallery || []), ...uploaded];
                          const updatedImage = editForm.image || (uploaded[0] ? uploaded[0].url : '');
                          setEditForm({ ...editForm, gallery: updatedGallery, image: updatedImage });
                        }}
                      />
                    </label>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
                    {(editForm.gallery || []).map((photo: any, index: number) => {
                      const photoUrl = typeof photo === 'object' ? photo.url : photo;
                      const isMain = editForm.image === photoUrl;
                      return (
                        <div key={index} className="relative group rounded-xl overflow-hidden aspect-video bg-slate-800 border border-slate-700/50">
                          <img src={photoUrl} className="w-full h-full object-cover" alt="Gallery item" />
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => setEditForm({ ...editForm, image: photoUrl })}
                              title="Definir como Principal"
                              className={`p-1 rounded bg-white/10 hover:bg-amber-500 text-white transition-colors ${isMain ? 'bg-amber-500 text-slate-900' : ''}`}
                            >
                              <Star size={12} className={isMain ? 'fill-current' : ''} />
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                const list = [...(editForm.gallery || [])];
                                if (index > 0) {
                                  const temp = list[index];
                                  list[index] = list[index - 1];
                                  list[index - 1] = temp;
                                  setEditForm({ ...editForm, gallery: list });
                                }
                              }}
                              className="p-1 rounded bg-white/10 hover:bg-slate-700 text-white font-bold"
                            >
                              &larr;
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                const list = [...(editForm.gallery || [])];
                                if (index < list.length - 1) {
                                  const temp = list[index];
                                  list[index] = list[index + 1];
                                  list[index + 1] = temp;
                                  setEditForm({ ...editForm, gallery: list });
                                }
                              }}
                              className="p-1 rounded bg-white/10 hover:bg-slate-700 text-white font-bold"
                            >
                              &rarr;
                            </button>
                            <button
                              type="button"
                              onClick={async () => {
                                if (photo.public_id) {
                                  await deleteImage(photo.public_id);
                                }
                                const updated = (editForm.gallery || []).filter((p: any) => p.public_id !== photo.public_id || p.url !== photo.url);
                                const updatedImage = editForm.image === photoUrl ? (updated[0] ? updated[0].url : '') : editForm.image;
                                setEditForm({ ...editForm, gallery: updated, image: updatedImage });
                              }}
                              className="p-1 rounded bg-white/10 hover:bg-red-500 text-white"
                            >
                              <Trash size={12} />
                            </button>
                          </div>
                          {isMain && (
                            <span className="absolute top-1.5 left-1.5 bg-amber-500 text-slate-950 font-black text-[7px] uppercase tracking-wider px-1.5 py-0.5 rounded shadow">
                              Principal
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* iCal Integrations per Room */}
                <div className="border-t border-slate-200/20 pt-4 space-y-4">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">Sincronização de Calendário (iCal) - Esta Unidade</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[9px] font-black uppercase text-slate-400 mb-1">iCal Booking.com</label>
                      <input
                        type="text"
                        value={editForm.icalBooking || ''}
                        onChange={(e) => setEditForm({ ...editForm, icalBooking: e.target.value })}
                        placeholder="https://booking.com/feeds/co-calendar/..."
                        className={`w-full px-4 py-2 rounded-xl border text-xs font-semibold ${
                          darkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'
                        }`}
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-black uppercase text-slate-400 mb-1">iCal Airbnb</label>
                      <input
                        type="text"
                        value={editForm.icalAirbnb || ''}
                        onChange={(e) => setEditForm({ ...editForm, icalAirbnb: e.target.value })}
                        placeholder="https://airbnb.com/calendar/ical/..."
                        className={`w-full px-4 py-2 rounded-xl border text-xs font-semibold ${
                          darkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'
                        }`}
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-black uppercase text-slate-400 mb-1">iCal Vrbo/Expedia</label>
                      <input
                        type="text"
                        value={editForm.icalVrbo || ''}
                        onChange={(e) => setEditForm({ ...editForm, icalVrbo: e.target.value })}
                        placeholder="https://vrbo.com/icalendar/..."
                        className={`w-full px-4 py-2 rounded-xl border text-xs font-semibold ${
                          darkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'
                        }`}
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-black uppercase text-slate-400 mb-1">iCal Externo Adicional</label>
                      <input
                        type="text"
                        value={editForm.icalOther || ''}
                        onChange={(e) => setEditForm({ ...editForm, icalOther: e.target.value })}
                        placeholder="https://exemplo.com/ical/..."
                        className={`w-full px-4 py-2 rounded-xl border text-xs font-semibold ${
                          darkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'
                        }`}
                      />
                    </div>
                  </div>

                  <div className="bg-slate-500/5 p-4 rounded-2xl border border-slate-300/10">
                    <label className="block text-[9px] font-black uppercase text-slate-400 mb-1 font-bold">AzoresToYou Exportar Link (Leitura)</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        readOnly
                        value={`https://azores4you.com/api/rooms/${editForm.id}/export.ics`}
                        className={`flex-1 px-4 py-2 rounded-xl border text-xs font-semibold bg-slate-900 border-slate-800 text-slate-400`}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(`https://azores4you.com/api/rooms/${editForm.id}/export.ics`);
                          alert('Link de exportação copiado!');
                        }}
                        className="px-4 bg-slate-500/10 hover:bg-slate-500/20 text-slate-300 border border-slate-350/20 rounded-xl text-xs font-bold"
                      >
                        Copiar
                      </button>
                    </div>
                    <p className="text-[9px] text-slate-500 font-bold uppercase mt-1">Última Sincronização: {editForm.lastSync || 'Nunca'}</p>
                    
                    <button
                      type="button"
                      onClick={() => handleRoomSync(editForm.id)}
                      className="mt-3 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-[9px] uppercase tracking-wider rounded-lg transition-all"
                    >
                      Sincronizar Agora
                    </button>
                  </div>
                </div>

                <div className="flex justify-end gap-3 border-t border-slate-200/20 pt-4">
                  <button
                    type="button"
                    onClick={() => { setEditingRoom(null); setEditForm(null); }}
                    className="px-4 py-2.5 bg-slate-500/10 hover:bg-slate-500/20 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-black uppercase tracking-wider"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl text-xs font-black uppercase tracking-wider shadow"
                  >
                    Guardar Alterações
                  </button>
                </div>

              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Checkin Employee Confirmation Modal */}
      <AnimatePresence>
        {showCheckinModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`border rounded-3xl w-full max-w-md p-8 shadow-2xl relative overflow-hidden z-10 ${
                darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-800'
              }`}
            >
              <button 
                type="button"
                onClick={() => { setShowCheckinModal(null); setCheckinEmployee(''); }}
                className="absolute top-6 right-6 p-2 bg-slate-500/15 hover:bg-slate-500/25 rounded-full transition-all text-slate-400 hover:text-slate-900 cursor-pointer"
              >
                <X size={16} />
              </button>

              <h3 className="text-lg font-black uppercase tracking-tight mb-4">Confirmar Entrada (Check-In)</h3>
              <p className="text-xs text-slate-450 mb-4 font-bold">
                Insira o nome do funcionário responsável pela receção do hóspede {showCheckinModal.customerName || showCheckinModal.client}.
              </p>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-[9px] font-black uppercase text-slate-400 mb-1 font-bold">Funcionário de Serviço</label>
                  <input
                    type="text"
                    required
                    value={checkinEmployee}
                    onChange={(e) => setCheckinEmployee(e.target.value)}
                    placeholder="Ex: Ana Medeiros"
                    className={`w-full px-4 py-3 rounded-xl border text-xs font-semibold ${
                      darkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'
                    }`}
                  />
                </div>
                
                <button
                  type="button"
                  onClick={async () => {
                    if (!checkinEmployee) {
                      alert('Insira o nome do funcionário!');
                      return;
                    }
                    const timeNow = new Date().toLocaleString('pt-PT');
                    const updatedRes = { 
                      ...showCheckinModal, 
                      status: 'Hospedado',
                      checkinTime: timeNow,
                      checkinEmployee: checkinEmployee
                    };
                    
                    // Set Room status to Ocupado
                    const targetRoomId = showCheckinModal.roomId || showCheckinModal.selectedRoom?.id;
                    const updatedRooms = rooms.map(r => r.id === targetRoomId ? { ...r, status: 'Ocupado' } : r);
                    
                    setRooms(updatedRooms);
                    await handleUpdateReservation(updatedRes);
                    await saveUpdatedBusiness({ rooms: updatedRooms });
                    
                    setShowCheckinModal(null);
                    setCheckinEmployee('');
                  }}
                  className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer shadow-md shadow-emerald-500/10"
                >
                  Concluir Check-In
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showBlockModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`border rounded-3xl w-full max-w-md p-8 shadow-2xl relative overflow-hidden z-10 ${
                darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-800'
              }`}
            >
              <button 
                onClick={() => setShowBlockModal(false)}
                className="absolute top-6 right-6 p-2 bg-slate-500/15 hover:bg-slate-500/25 rounded-full transition-all text-slate-400 hover:text-slate-900 cursor-pointer"
              >
                <X size={16} />
              </button>

              <h3 className="text-lg font-black uppercase tracking-tight mb-4">Bloquear Datas Manualmente</h3>
              <form onSubmit={handleManualBlock} className="space-y-4">
                <div>
                  <label className="block text-[9px] font-black uppercase text-slate-400 mb-1 font-bold">Data de Início</label>
                  <input
                    type="date"
                    required
                    value={manualBlockStart}
                    onChange={(e) => setManualBlockStart(e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl border text-xs font-semibold ${
                      darkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-black uppercase text-slate-400 mb-1 font-bold">Data de Fim</label>
                  <input
                    type="date"
                    required
                    value={manualBlockEnd}
                    onChange={(e) => setManualBlockEnd(e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl border text-xs font-semibold ${
                      darkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'
                    }`}
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer shadow-md shadow-amber-500/10"
                >
                  Confirmar Bloqueio
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* QR Code do Quarto Modal */}
      <AnimatePresence>
        {selectedRoomForQr && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`border rounded-3xl w-full max-w-md p-8 shadow-2xl relative overflow-hidden z-10 ${
                darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-800'
              }`}
            >
              <button 
                type="button"
                onClick={() => setSelectedRoomForQr(null)}
                className="absolute top-6 right-6 p-2 bg-slate-500/15 hover:bg-slate-500/25 rounded-full transition-all text-slate-400 hover:text-slate-900 cursor-pointer"
              >
                <X size={16} />
              </button>

              <h3 className="text-lg font-black uppercase tracking-tight mb-2">QR Code Permanente</h3>
              <p className="text-xs text-slate-400 font-bold uppercase mb-6">
                {selectedRoomForQr.room.name}
              </p>

              {/* QR Image preview */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200/20 max-w-xs mx-auto flex items-center justify-center shadow-inner mb-6">
                <img 
                  id="printable-qr-image"
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(selectedRoomForQr.qr.url)}&color=0d1629&bgcolor=ffffff`}
                  className="w-48 h-48 object-contain"
                  alt="QR Code"
                />
              </div>

              {/* URL link */}
              <div className={`p-3 rounded-xl border text-[11px] font-semibold select-all break-all mb-6 ${
                darkMode ? 'bg-slate-950 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-250 text-slate-655'
              }`}>
                {selectedRoomForQr.qr.url}
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3 mb-3">
                <button
                  type="button"
                  onClick={() => {
                    const printWindow = window.open('', '_blank');
                    if (printWindow) {
                      printWindow.document.write(`
                        <html>
                          <head>
                            <title>QR Code - ${selectedRoomForQr.room.name}</title>
                            <style>
                              body { font-family: sans-serif; text-align: center; padding: 40px; color: #0d1629; }
                              .container { border: 2px solid #0d1629; padding: 30px; border-radius: 20px; display: inline-block; }
                              img { width: 250px; height: 250px; margin-top: 20px; }
                              h1 { margin: 0; font-size: 24px; text-transform: uppercase; }
                              h2 { margin: 5px 0 20px; font-size: 16px; color: #78829c; text-transform: uppercase; }
                              p { font-size: 11px; margin-top: 20px; font-weight: bold; }
                            </style>
                          </head>
                          <body onload="window.print(); window.close();">
                            <div class="container">
                              <h1>${business.name}</h1>
                              <h2>${selectedRoomForQr.room.name}</h2>
                              <img src="https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(selectedRoomForQr.qr.url)}&color=0d1629&bgcolor=ffffff" />
                              <p>Faça scan para pedir Serviço de Quarto / Housekeeping / Suporte</p>
                            </div>
                          </body>
                        </html>
                      `);
                      printWindow.document.close();
                    }
                  }}
                  className="py-2.5 bg-slate-900 hover:bg-black text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer text-center"
                >
                  Imprimir
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    try {
                      const response = await fetch(`https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(selectedRoomForQr.qr.url)}&color=0d1629&bgcolor=ffffff`);
                      const blob = await response.blob();
                      const url = window.URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `qr_${selectedRoomForQr.room.name.toLowerCase().replace(/\s+/g, '_')}.png`;
                      document.body.appendChild(a);
                      a.click();
                      document.body.removeChild(a);
                      window.URL.revokeObjectURL(url);
                    } catch (err) {
                      alert('Erro ao transferir imagem. Copie o link e gere online.');
                    }
                  }}
                  className="py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-850 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer text-center"
                >
                  Download PNG
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(selectedRoomForQr.qr.url);
                    alert('Link copiado para a área de transferência!');
                  }}
                  className="py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer text-center"
                >
                  Copiar Link
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    if (confirm('Tem a certeza que deseja regenerar o token deste QR code? O link impresso antigo deixará de funcionar.')) {
                      const qrToken = `tok_${Date.now()}_${Math.floor(Math.random()*1000)}`;
                      const host = window.location.origin;
                      const qrUrl = `${host}/#/hotel-room-service/${business.id}/${selectedRoomForQr.room.id}/${qrToken}`;
                      const payload = {
                        hotelId: business.id,
                        roomId: selectedRoomForQr.room.id,
                        roomName: selectedRoomForQr.room.name,
                        qrToken,
                        url: qrUrl
                      };
                      
                      const saveRes = await fetch(`${API_BASE_URL}/api/hotel_room_qr_codes`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(payload)
                      });
                      
                      if (saveRes.ok) {
                        const updatedQr = await saveRes.json();
                        setQrCodes(prev => [...prev.filter(q => q.roomId !== selectedRoomForQr.room.id), updatedQr]);
                        setSelectedRoomForQr({ ...selectedRoomForQr, qr: updatedQr });
                        alert('QR Code regenerado com sucesso!');
                      }
                    }
                  }}
                  className="py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer text-center"
                >
                  Regenerar QR
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Confirm Reservation Hours Modal */}
      <AnimatePresence>
        {confirmingRes && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`border rounded-3xl w-full max-w-md p-8 shadow-2xl relative overflow-hidden z-10 ${
                darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-800'
              }`}
            >
              <button 
                onClick={() => setConfirmingRes(null)}
                className="absolute top-6 right-6 p-2 bg-slate-500/15 hover:bg-slate-500/25 rounded-full transition-all text-slate-400 hover:text-slate-900 cursor-pointer"
              >
                <X size={16} />
              </button>

              <h3 className="text-lg font-black uppercase tracking-tight mb-4">Confirmar Horários da Reserva</h3>
              <p className="text-xs text-slate-400 font-bold uppercase mb-4">Hóspede: {confirmingRes.customerName || confirmingRes.client || 'Hóspede'}</p>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-[9px] font-black uppercase text-slate-400 mb-1 font-bold">Hora de Check-In (Entrada)</label>
                  <select
                    value={confirmCheckinTime}
                    onChange={(e) => setConfirmCheckinTime(e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl border text-xs font-semibold ${
                      darkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'
                    }`}
                  >
                    {Array.from({ length: 24 }).map((_, i) => {
                      const timeStr = `${i.toString().padStart(2, '0')}:00`;
                      return <option key={timeStr} value={timeStr}>{timeStr}</option>;
                    })}
                  </select>
                </div>
                <div>
                  <label className="block text-[9px] font-black uppercase text-slate-400 mb-1 font-bold">Hora de Check-Out (Saída)</label>
                  <select
                    value={confirmCheckoutTime}
                    onChange={(e) => setConfirmCheckoutTime(e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl border text-xs font-semibold ${
                      darkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'
                    }`}
                  >
                    {Array.from({ length: 24 }).map((_, i) => {
                      const timeStr = `${i.toString().padStart(2, '0')}:00`;
                      return <option key={timeStr} value={timeStr}>{timeStr}</option>;
                    })}
                  </select>
                </div>
                <button
                  onClick={async () => {
                    const updated = { 
                      ...confirmingRes, 
                      status: 'Confirmada',
                      checkinTime: confirmCheckinTime,
                      checkoutTime: confirmCheckoutTime
                    };
                    await handleUpdateReservation(updated);
                    setConfirmingRes(null);
                  }}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer shadow-md shadow-emerald-500/10"
                >
                  Confirmar Reserva
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
