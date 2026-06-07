import React, { useState, useEffect, useRef } from 'react';
import {
  Home, Clock, Bell, User, PhoneCall,
  ShoppingCart, Plus, Minus, Send, RefreshCw,
  AlertCircle, CheckCircle, ChevronRight, X,
  Globe, ArrowLeft, Wifi, UtensilsCrossed, Wrench,
  Sparkles, Gift, Info, MessageSquare, Zap,
  Coffee, Wine, Waves
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { API_BASE_URL } from '../config';

// ── TYPES ──────────────────────────────────────────────
interface MenuItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  estimatedTime?: string;
  isActive: boolean;
  emoji?: string;
  category?: string;
}

interface CartItem extends MenuItem {
  quantity: number;
}

type NavTab = 'home' | 'orders' | 'notifications' | 'emergency';
type CategoryView = null | 'roomservice' | 'housekeeping' | 'maintenance' | 'extras' | 'info' | 'reception';

// ── TRANSLATIONS ─────────────────────────────────────
const i18n: Record<string, Record<string, string>> = {
  pt: {
    how_help: 'Como podemos ajudar?',
    subtitle: 'Faça o seu pedido de forma rápida e segura.',
    delivery_note: 'Pedido será entregue diretamente no seu quarto.',
    quick_orders: 'Pedidos Rápidos',
    see_all: 'Ver todos',
    categories: 'Categorias',
    room_service: 'Room Service',
    room_service_sub: 'Comidas e Bebidas',
    maintenance: 'Manutenção',
    maintenance_sub: 'Reportar problemas',
    housekeeping: 'Housekeeping',
    housekeeping_sub: 'Limpeza e Amenidades',
    extras: 'Extras & Ofertas',
    extras_sub: 'Serviços adicionais',
    info: 'Informações',
    info_sub: 'Wi-Fi, Horários, Regras',
    reception: 'Falar com Receção',
    reception_sub: 'Envie-nos uma mensagem',
    upsell_title: 'Torne a sua estadia ainda melhor!',
    upsell_sub: 'Descubra as nossas ofertas exclusivas.',
    upsell_btn: 'Ver Ofertas',
    nav_home: 'Início',
    nav_orders: 'Os Meus Pedidos',
    nav_notif: 'Notificações',
    nav_account: 'Conta',
    nav_emergency: 'Emergência',
    add_to_cart: 'Adicionar',
    cart_items: 'itens',
    cart_send: 'Enviar Pedido',
    confirm_order: 'Confirmar Pedido',
    order_summary: 'Resumo do Pedido',
    quantity: 'Quantidade',
    notes: 'Observações',
    notes_placeholder: 'Ex: Sem açúcar, toalhas grandes...',
    total: 'Total',
    free: 'Grátis',
    send: 'Enviar',
    cancel: 'Cancelar',
    success_title: 'Pedido enviado!',
    success_body: 'A equipa foi notificada e irá tratar do seu pedido em breve.',
    view_orders: 'Ver Pedidos',
    new_order: 'Novo Pedido',
    my_orders: 'Os Meus Pedidos',
    orders_empty: 'Ainda não fez nenhum pedido.',
    status_pending: 'Pendente',
    status_accepted: 'Aceite',
    status_preparing: 'Em preparação',
    status_delivered: 'Entregue',
    status_cancelled: 'Cancelado',
    emergency_title: 'Emergência',
    call_reception: 'Ligar Receção',
    emergency_num: 'Emergência (112)',
    urgent_request: 'Pedido Urgente',
    urgent_placeholder: 'Descreva a situação de urgência...',
    send_urgent: 'Enviar Urgente',
    invalid_qr: 'QR Code inválido ou desativado.',
    loading: 'A carregar Mini POS...',
    error_title: 'Erro de Acesso',
    back: 'Voltar',
    name_optional: 'Nome (opcional)',
    message: 'Mensagem',
    send_message: 'Enviar Mensagem',
    wifi_net: 'Rede',
    wifi_pass: 'Password',
    checkin_time: 'Horário de Check-In',
    checkout_time: 'Horário de Check-Out',
    breakfast_time: 'Pequeno-almoço',
    silence_policy: 'Silêncio após as 22h',
    address: 'Morada',
    estimated: 'Tempo estimado',
  },
  en: {
    how_help: 'How can we help?',
    subtitle: 'Place your order quickly and safely.',
    delivery_note: 'Order will be delivered directly to your room.',
    quick_orders: 'Quick Orders',
    see_all: 'See all',
    categories: 'Categories',
    room_service: 'Room Service',
    room_service_sub: 'Food & Beverages',
    maintenance: 'Maintenance',
    maintenance_sub: 'Report issues',
    housekeeping: 'Housekeeping',
    housekeeping_sub: 'Cleaning & Amenities',
    extras: 'Extras & Offers',
    extras_sub: 'Additional services',
    info: 'Information',
    info_sub: 'Wi-Fi, Schedules, Rules',
    reception: 'Contact Reception',
    reception_sub: 'Send us a message',
    upsell_title: 'Make your stay even better!',
    upsell_sub: 'Discover our exclusive offers.',
    upsell_btn: 'See Offers',
    nav_home: 'Home',
    nav_orders: 'My Orders',
    nav_notif: 'Notifications',
    nav_account: 'Account',
    nav_emergency: 'Emergency',
    add_to_cart: 'Add',
    cart_items: 'items',
    cart_send: 'Send Order',
    confirm_order: 'Confirm Order',
    order_summary: 'Order Summary',
    quantity: 'Quantity',
    notes: 'Notes',
    notes_placeholder: 'E.g: No sugar, large towels...',
    total: 'Total',
    free: 'Free',
    send: 'Send',
    cancel: 'Cancel',
    success_title: 'Order sent!',
    success_body: 'The team has been notified and will handle your request shortly.',
    view_orders: 'View Orders',
    new_order: 'New Order',
    my_orders: 'My Orders',
    orders_empty: 'You have not placed any orders yet.',
    status_pending: 'Pending',
    status_accepted: 'Accepted',
    status_preparing: 'Preparing',
    status_delivered: 'Delivered',
    status_cancelled: 'Cancelled',
    emergency_title: 'Emergency',
    call_reception: 'Call Reception',
    emergency_num: 'Emergency (112)',
    urgent_request: 'Urgent Request',
    urgent_placeholder: 'Describe the urgent situation...',
    send_urgent: 'Send Urgent',
    invalid_qr: 'Invalid or deactivated QR Code.',
    loading: 'Loading Mini POS...',
    error_title: 'Access Error',
    back: 'Back',
    name_optional: 'Name (optional)',
    message: 'Message',
    send_message: 'Send Message',
    wifi_net: 'Network',
    wifi_pass: 'Password',
    checkin_time: 'Check-In Time',
    checkout_time: 'Check-Out Time',
    breakfast_time: 'Breakfast',
    silence_policy: 'Quiet hours after 10pm',
    address: 'Address',
    estimated: 'Estimated time',
  }
};

const STATUS_COLORS: Record<string, string> = {
  Pendente: 'bg-amber-400/20 text-amber-400 border-amber-400/30',
  Aceite: 'bg-emerald-400/20 text-emerald-400 border-emerald-400/30',
  'Em preparação': 'bg-blue-400/20 text-blue-400 border-blue-400/30',
  Entregue: 'bg-slate-400/20 text-slate-400 border-slate-400/30',
  Cancelado: 'bg-red-400/20 text-red-400 border-red-400/30',
};

// ── DEFAULT MENU ──────────────────────────────────────
const DEFAULT_MENU = {
  quick: [
    { id: 'q_champagne', name: 'Champanhe', description: 'Garrafa de espumante premium', price: 45, estimatedTime: '15', isActive: true, emoji: '🍾' },
    { id: 'q_water', name: 'Água', description: 'Garrafa de água 0.5L', price: 2, estimatedTime: '5', isActive: true, emoji: '💧' },
    { id: 'q_coffee', name: 'Café', description: 'Café expresso ou americano', price: 2.50, estimatedTime: '5', isActive: true, emoji: '☕' },
    { id: 'q_towels', name: 'Toalhas Extra', description: 'Toalhas de banho adicionais', price: 0, estimatedTime: '10', isActive: true, emoji: '🛁' },
    { id: 'q_pillows', name: 'Almofada Extra', description: 'Almofada adicional', price: 0, estimatedTime: '10', isActive: true, emoji: '🛏️' },
    { id: 'q_ice', name: 'Gelo', description: 'Balde de gelo', price: 0, estimatedTime: '5', isActive: true, emoji: '🧊' },
    { id: 'q_bf', name: 'Pequeno-almoço', description: 'Continental no quarto', price: 15, estimatedTime: '20', isActive: true, emoji: '🍳' },
    { id: 'q_wine', name: 'Vinho', description: 'Garrafa de vinho da casa', price: 18, estimatedTime: '10', isActive: true, emoji: '🍷' },
  ],
  roomservice: [
    { id: 'rs_bf', name: 'Pequeno-almoço no quarto', description: 'Continental completo', price: 15, estimatedTime: '20', isActive: true, emoji: '🍳' },
    { id: 'rs_coffee', name: 'Café', description: 'Expresso ou americano', price: 2.50, estimatedTime: '5', isActive: true, emoji: '☕' },
    { id: 'rs_water', name: 'Água', description: 'Garrafa 0.5L ou 1L', price: 2, estimatedTime: '5', isActive: true, emoji: '💧' },
    { id: 'rs_juice', name: 'Sumos Naturais', description: 'Laranja ou ananás', price: 4, estimatedTime: '10', isActive: true, emoji: '🍊' },
    { id: 'rs_wine', name: 'Vinho', description: 'Vinho tinto ou branco', price: 18, estimatedTime: '10', isActive: true, emoji: '🍷' },
    { id: 'rs_champagne', name: 'Champanhe', description: 'Garrafa premium', price: 45, estimatedTime: '15', isActive: true, emoji: '🍾' },
    { id: 'rs_snack', name: 'Snack', description: 'Tábua de queijos e enchidos', price: 12, estimatedTime: '15', isActive: true, emoji: '🧀' },
    { id: 'rs_dinner', name: 'Jantar no Quarto', description: 'Menu do dia entregue no quarto', price: 25, estimatedTime: '45', isActive: true, emoji: '🍽️' },
    { id: 'rs_dessert', name: 'Sobremesa', description: 'Bolo de Dona Amélia ou pudim', price: 6, estimatedTime: '15', isActive: true, emoji: '🍮' },
  ],
  housekeeping: [
    { id: 'h_clean', name: 'Pedir limpeza do quarto', description: 'Limpeza completa do espaço', price: 0, estimatedTime: '60', isActive: true, emoji: '🧹' },
    { id: 'h_towels', name: 'Trocar toalhas', description: 'Troca de toalhas de banho', price: 0, estimatedTime: '15', isActive: true, emoji: '🛁' },
    { id: 'h_sheets', name: 'Trocar lençóis', description: 'Troca de roupa de cama', price: 0, estimatedTime: '20', isActive: true, emoji: '🛏️' },
    { id: 'h_paper', name: 'Repor papel higiénico', description: 'Reposição de amenidades', price: 0, estimatedTime: '10', isActive: true, emoji: '🧻' },
    { id: 'h_shampoo', name: 'Repor gel / shampoo', description: 'Amenidades de banho', price: 0, estimatedTime: '10', isActive: true, emoji: '🧴' },
    { id: 'h_pillow', name: 'Almofada extra', description: 'Almofada adicional', price: 0, estimatedTime: '10', isActive: true, emoji: '🛏️' },
    { id: 'h_blanket', name: 'Cobertor extra', description: 'Cobertor adicional', price: 0, estimatedTime: '10', isActive: true, emoji: '🛏️' },
    { id: 'h_dnd', name: 'Não incomodar', description: 'Sinalizar quarto como privado', price: 0, estimatedTime: '2', isActive: true, emoji: '🔕' },
  ],
  maintenance: [
    { id: 'm_ac', name: 'Ar condicionado', description: 'AC não funciona ou está com problema', price: 0, estimatedTime: '30', isActive: true, emoji: '❄️' },
    { id: 'm_light', name: 'Luz fundida', description: 'Lâmpada ou foco fundido', price: 0, estimatedTime: '20', isActive: true, emoji: '💡' },
    { id: 'm_tv', name: 'Problema na TV', description: 'TV sem sinal ou avariada', price: 0, estimatedTime: '30', isActive: true, emoji: '📺' },
    { id: 'm_wifi', name: 'Problema no Wi-Fi', description: 'Sem ligação ou lento', price: 0, estimatedTime: '15', isActive: true, emoji: '📶' },
    { id: 'm_water', name: 'Água quente', description: 'Sem água quente na casa de banho', price: 0, estimatedTime: '30', isActive: true, emoji: '🚿' },
    { id: 'm_toilet', name: 'Casa de banho', description: 'Problema na sanita ou lavatório', price: 0, estimatedTime: '20', isActive: true, emoji: '🚽' },
    { id: 'm_door', name: 'Porta / Fechadura', description: 'Dificuldade a abrir ou fechar', price: 0, estimatedTime: '15', isActive: true, emoji: '🚪' },
    { id: 'm_noise', name: 'Problema de ruído', description: 'Ruído excessivo no quarto', price: 0, estimatedTime: '15', isActive: true, emoji: '🔊' },
    { id: 'm_other', name: 'Outro problema', description: 'Descreva nas observações', price: 0, estimatedTime: '30', isActive: true, emoji: '⚠️' },
  ],
  extras: [
    { id: 'e_romantic', name: 'Decoração romântica', description: 'Velas, flores e atmosfera especial', price: 50, estimatedTime: '120', isActive: true, emoji: '❤️' },
    { id: 'e_flowers', name: 'Flores frescas', description: 'Bouquet de flores frescas', price: 25, estimatedTime: '60', isActive: true, emoji: '💐' },
    { id: 'e_wine_fruit', name: 'Champanhe & Frutas', description: 'Garrafa e tábua de frutas', price: 55, estimatedTime: '60', isActive: true, emoji: '🍾' },
    { id: 'e_checkout', name: 'Late check-out', description: 'Saída até às 14:00h', price: 30, estimatedTime: '10', isActive: true, emoji: '🕑' },
    { id: 'e_transfer', name: 'Transfer Aeroporto', description: 'Viatura privada para aeroporto', price: 35, estimatedTime: '24h', isActive: true, emoji: '✈️' },
    { id: 'e_tour', name: 'Tour / Atividade', description: 'Atividade nos Açores', price: 40, estimatedTime: '24h', isActive: true, emoji: '🌋' },
    { id: 'e_spa', name: 'Massagem / Spa', description: 'Massagem relaxante no quarto', price: 60, estimatedTime: '90', isActive: true, emoji: '💆' },
    { id: 'e_dinner', name: 'Jantar no Quarto', description: 'Menu gastronómico servido no quarto', price: 45, estimatedTime: '45', isActive: true, emoji: '🍽️' },
  ],
};

// ── CATEGORY CONFIG ───────────────────────────────────
const CATEGORY_CONFIG = [
  { id: 'roomservice', icon: <UtensilsCrossed size={22} />, labelKey: 'room_service', subKey: 'room_service_sub', color: '#1a2744' },
  { id: 'maintenance', icon: <Wrench size={22} />, labelKey: 'maintenance', subKey: 'maintenance_sub', color: '#1a2744' },
  { id: 'housekeeping', icon: <Sparkles size={22} />, labelKey: 'housekeeping', subKey: 'housekeeping_sub', color: '#1a2744' },
  { id: 'extras', icon: <Gift size={22} />, labelKey: 'extras', subKey: 'extras_sub', color: '#1a2744' },
  { id: 'info', icon: <Info size={22} />, labelKey: 'info', subKey: 'info_sub', color: '#1a2744' },
  { id: 'reception', icon: <MessageSquare size={22} />, labelKey: 'reception', subKey: 'reception_sub', color: '#1a2744' },
];

// ── COMPONENT ─────────────────────────────────────────
interface HotelRoomServiceProps {
  hotelId: string;
  roomId: string;
  qrToken: string;
  onBackToApp?: () => void;
}

export default function HotelRoomService({ hotelId, roomId, qrToken, onBackToApp }: HotelRoomServiceProps) {
  const [hotel, setHotel] = useState<any>(null);
  const [room, setRoom] = useState<any>(null);
  const [activeReservation, setActiveReservation] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lang, setLang] = useState<'pt' | 'en'>('pt');
  const [showLangMenu, setShowLangMenu] = useState(false);

  // Navigation
  const [navTab, setNavTab] = useState<NavTab>('home');
  const [categoryView, setCategoryView] = useState<CategoryView>(null);

  // Menu items (overridable by hotel config)
  const [menuItems, setMenuItems] = useState(DEFAULT_MENU);

  // Cart state
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [orderNotes, setOrderNotes] = useState('');
  const [guestName, setGuestName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [successModal, setSuccessModal] = useState(false);

  // My orders
  const [myOrders, setMyOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // Reception message
  const [receptionName, setReceptionName] = useState('');
  const [receptionMsg, setReceptionMsg] = useState('');
  const [sendingMsg, setSendingMsg] = useState(false);
  const [msgSent, setMsgSent] = useState(false);

  // Maintenance details
  const [maintenanceItem, setMaintenanceItem] = useState<MenuItem | null>(null);
  const [maintenanceDesc, setMaintenanceDesc] = useState('');

  // Emergency
  const [urgentDesc, setUrgentDesc] = useState('');
  const [sendingUrgent, setSendingUrgent] = useState(false);
  const [urgentSent, setUrgentSent] = useState(false);

  const t = (key: string) => (i18n[lang] || i18n.pt)[key] || key;

  // ── LOAD DATA ──
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE_URL}/api/hotels/${hotelId}`);
        if (!res.ok) throw new Error('Alojamento não encontrado.');
        const h = await res.json();
        setHotel(h);

        const r = (h.rooms || []).find((rm: any) => rm.id === roomId);
        if (!r) throw new Error('Quarto não encontrado.');
        setRoom(r);

        // Active reservation
        const today = new Date().toISOString().split('T')[0];
        const activeRes = (h.reservations || []).find((res: any) => {
          if (['cancelled', 'Cancelada', 'Cancelado'].includes(res.status)) return false;
          const resRoomId = res.roomId || res.selectedRoom?.id;
          if (resRoomId !== roomId) return false;
          const start = res.checkinDate || res.date;
          let end = res.checkoutDate;
          if (!end && res.nights) {
            const d = new Date(start);
            d.setDate(d.getDate() + Number(res.nights));
            end = d.toISOString().split('T')[0];
          }
          return (today >= start && today <= end);
        });
        if (activeRes) setActiveReservation(activeRes);

        // Custom menu
        if (h.roomServiceConfig) {
          setMenuItems((prev: any) => ({ ...prev, ...h.roomServiceConfig }));
        }
      } catch (e: any) {
        setError(e.message || 'Erro ao carregar o Concierge Digital.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [hotelId, roomId]);

  // ── LOAD MY ORDERS ──
  const loadOrders = async () => {
    try {
      setLoadingOrders(true);
      const res = await fetch(`${API_BASE_URL}/api/hotel_room_requests?hotelId=${hotelId}&roomId=${roomId}`);
      if (res.ok) {
        const data = await res.json();
        setMyOrders(data.filter((o: any) => o.hotelId === hotelId && o.roomId === roomId));
      }
    } finally {
      setLoadingOrders(false);
    }
  };

  useEffect(() => {
    if (navTab === 'orders') loadOrders();
  }, [navTab]);

  // Poll orders every 30s when on orders tab
  useEffect(() => {
    if (navTab !== 'orders') return;
    const interval = setInterval(loadOrders, 30000);
    return () => clearInterval(interval);
  }, [navTab]);

  // ── CART HELPERS ──
  const addToCart = (item: MenuItem) => {
    setCart(prev => {
      const existing = prev.find(c => c.id === item.id);
      if (existing) return prev.map(c => c.id === item.id ? { ...c, quantity: c.quantity + 1 } : c);
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart(prev => {
      const existing = prev.find(c => c.id === id);
      if (!existing) return prev;
      if (existing.quantity === 1) return prev.filter(c => c.id !== id);
      return prev.map(c => c.id === id ? { ...c, quantity: c.quantity - 1 } : c);
    });
  };

  const cartTotal = cart.reduce((sum, c) => sum + c.price * c.quantity, 0);
  const cartCount = cart.reduce((sum, c) => sum + c.quantity, 0);

  // ── SUBMIT ORDER ──
  const handleSubmitOrder = async () => {
    if (cart.length === 0) return;
    setSubmitting(true);
    try {
      const payload = {
        hotelId, roomId, qrToken,
        roomName: room?.name || '?',
        reservationId: activeReservation?.id || null,
        guestName: guestName.trim() || activeReservation?.customerName || 'Hóspede',
        category: 'Carrinho',
        items: cart.map(c => ({ id: c.id, name: c.name, quantity: c.quantity, price: c.price })),
        total: cartTotal,
        notes: orderNotes.trim(),
        status: 'Pendente',
        priority: 'normal',
        estimatedTime: '20',
        assignedTo: 'Não Atribuído',
      };
      const res = await fetch(`${API_BASE_URL}/api/hotel_room_requests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error('Falha ao enviar pedido.');
      setCart([]);
      setOrderNotes('');
      setShowCart(false);
      setSuccessModal(true);
    } catch (e: any) {
      alert(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  // ── SUBMIT MAINTENANCE ──
  const handleSubmitMaintenance = async () => {
    if (!maintenanceItem) return;
    setSubmitting(true);
    try {
      const payload = {
        hotelId, roomId, qrToken,
        roomName: room?.name || '?',
        reservationId: activeReservation?.id || null,
        guestName: activeReservation?.customerName || 'Hóspede',
        category: 'Manutenção',
        items: [{ id: maintenanceItem.id, name: maintenanceItem.name, quantity: 1, price: 0 }],
        total: 0,
        notes: maintenanceDesc.trim(),
        status: 'Pendente',
        priority: 'normal',
        estimatedTime: maintenanceItem.estimatedTime || '30',
        assignedTo: 'Não Atribuído',
      };
      const res = await fetch(`${API_BASE_URL}/api/hotel_room_requests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error('Falha.');
      setMaintenanceItem(null);
      setMaintenanceDesc('');
      setSuccessModal(true);
    } catch (e: any) {
      alert(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  // ── SEND RECEPTION MESSAGE ──
  const handleSendReception = async () => {
    if (!receptionMsg.trim()) return;
    setSendingMsg(true);
    try {
      const payload = {
        hotelId, roomId, qrToken,
        roomName: room?.name || '?',
        reservationId: activeReservation?.id || null,
        guestName: receptionName.trim() || 'Hóspede',
        category: 'Mensagem',
        items: [{ id: 'reception_msg', name: 'Mensagem para Receção', quantity: 1, price: 0 }],
        total: 0,
        notes: receptionMsg.trim(),
        status: 'Pendente',
        priority: 'normal',
        estimatedTime: '5',
        assignedTo: 'Não Atribuído',
      };
      await fetch(`${API_BASE_URL}/api/hotel_room_requests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      setMsgSent(true);
      setReceptionMsg('');
      setReceptionName('');
      setTimeout(() => setMsgSent(false), 4000);
    } finally {
      setSendingMsg(false);
    }
  };

  // ── SEND URGENT ──
  const handleSendUrgent = async () => {
    if (!urgentDesc.trim()) return;
    setSendingUrgent(true);
    try {
      const payload = {
        hotelId, roomId, qrToken,
        roomName: room?.name || '?',
        reservationId: activeReservation?.id || null,
        guestName: activeReservation?.customerName || 'Hóspede',
        category: 'Emergência',
        items: [{ id: 'urgent', name: '🚨 URGENTE', quantity: 1, price: 0 }],
        total: 0,
        notes: urgentDesc.trim(),
        status: 'Pendente',
        priority: 'urgent',
        estimatedTime: '5',
        assignedTo: 'Não Atribuído',
      };
      await fetch(`${API_BASE_URL}/api/hotel_room_requests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      setUrgentSent(true);
      setUrgentDesc('');
    } finally {
      setSendingUrgent(false);
    }
  };

  // ── LOADING / ERROR ──
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center" style={{ background: '#0a1628' }}>
        <div className="w-16 h-16 border-4 border-amber-400 border-t-transparent rounded-full animate-spin mb-6" />
        <p style={{ color: '#b8986a', fontWeight: 900, textTransform: 'uppercase', fontSize: 11, letterSpacing: 3 }}>{t('loading')}</p>
      </div>
    );
  }

  if (error || !hotel || !room) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center" style={{ background: '#0a1628' }}>
        <AlertCircle size={56} color="#ef4444" style={{ marginBottom: 20 }} />
        <h2 style={{ color: '#fff', fontWeight: 900, fontSize: 20, marginBottom: 8 }}>{t('error_title')}</h2>
        <p style={{ color: '#94a3b8', fontSize: 14, marginBottom: 32 }}>{error || t('invalid_qr')}</p>
        {onBackToApp && (
          <button onClick={onBackToApp} style={{ background: '#c9963b', color: '#0a1628', fontWeight: 900, borderRadius: 16, padding: '14px 32px', fontSize: 12, textTransform: 'uppercase', letterSpacing: 1 }}>
            {t('back')}
          </button>
        )}
      </div>
    );
  }

  const heroImage = room.gallery?.[0] || hotel.gallery?.[0] || hotel.image || 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80';

  // ── STATUS BADGE ──
  const StatusBadge = ({ status }: { status: string }) => {
    const cls = STATUS_COLORS[status] || 'bg-slate-400/20 text-slate-400 border-slate-400/30';
    const icons: Record<string, string> = { Pendente: '🟡', Aceite: '✅', 'Em preparação': '🔵', Entregue: '✔️', Cancelado: '❌' };
    return (
      <span style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1, padding: '3px 10px', borderRadius: 999, border: '1px solid' }} className={cls}>
        {icons[status] || ''} {status}
      </span>
    );
  };

  // ── CATEGORY PAGE ──
  const renderCategoryPage = () => {
    if (!categoryView || categoryView === 'info' || categoryView === 'reception') return null;

    const items = (menuItems as any)[categoryView] || [];
    const activeItems = items.filter((i: MenuItem) => i.isActive !== false);

    return (
      <AnimatePresence>
        <motion.div
          key="catpage"
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 28, stiffness: 260 }}
          style={{ position: 'fixed', inset: 0, zIndex: 80, background: '#f5f5f0', overflowY: 'auto', paddingBottom: 100 }}
        >
          {/* Header */}
          <div style={{ background: '#0a1628', padding: '20px 20px 24px', position: 'sticky', top: 0, zIndex: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <button onClick={() => { setCategoryView(null); setMaintenanceItem(null); setMaintenanceDesc(''); }} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: 999, padding: 8, cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                <ArrowLeft size={18} color="#fff" />
              </button>
              <div>
                <p style={{ color: '#c9963b', fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 2 }}>{hotel.name}</p>
                <h2 style={{ color: '#fff', fontSize: 18, fontWeight: 900 }}>
                  {CATEGORY_CONFIG.find(c => c.id === categoryView) ? t(CATEGORY_CONFIG.find(c => c.id === categoryView)!.labelKey) : ''}
                </h2>
              </div>
            </div>
          </div>

          <div style={{ padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
            {activeItems.map((item: MenuItem) => {
              const inCart = cart.find(c => c.id === item.id);
              const isMaint = categoryView === 'maintenance';
              return (
                <div key={item.id} style={{ background: '#fff', borderRadius: 20, padding: '16px 20px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14, flex: 1 }}>
                    <div style={{ width: 48, height: 48, borderRadius: 14, background: '#f0efe8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0 }}>
                      {item.emoji || '📦'}
                    </div>
                    <div>
                      <h4 style={{ color: '#0a1628', fontWeight: 800, fontSize: 14, marginBottom: 2 }}>{item.name}</h4>
                      {item.description && <p style={{ color: '#6b7280', fontSize: 12 }}>{item.description}</p>}
                      {item.estimatedTime && (
                        <p style={{ color: '#9ca3af', fontSize: 11, marginTop: 2 }}>⏱ ~{item.estimatedTime} min</p>
                      )}
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8, flexShrink: 0 }}>
                    <span style={{ color: '#c9963b', fontWeight: 900, fontSize: 15 }}>
                      {item.price > 0 ? `${item.price}€` : t('free')}
                    </span>
                    {isMaint ? (
                      <button
                        onClick={() => setMaintenanceItem(item)}
                        style={{ background: '#0a1628', color: '#fff', border: 'none', borderRadius: 12, padding: '8px 16px', fontSize: 11, fontWeight: 800, cursor: 'pointer' }}
                      >
                        Selecionar
                      </button>
                    ) : inCart ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <button onClick={() => removeFromCart(item.id)} style={{ width: 28, height: 28, borderRadius: 999, background: '#f3f4f6', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                          <Minus size={12} color="#374151" />
                        </button>
                        <span style={{ fontWeight: 900, fontSize: 14, color: '#0a1628', minWidth: 16, textAlign: 'center' }}>{inCart.quantity}</span>
                        <button onClick={() => addToCart(item)} style={{ width: 28, height: 28, borderRadius: 999, background: '#0a1628', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                          <Plus size={12} color="#fff" />
                        </button>
                      </div>
                    ) : (
                      <button onClick={() => addToCart(item)} style={{ width: 32, height: 32, borderRadius: 999, background: '#0a1628', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                        <Plus size={14} color="#fff" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Maintenance description modal */}
          <AnimatePresence>
            {maintenanceItem && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{ position: 'fixed', inset: 0, zIndex: 90, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}
              >
                <motion.div
                  initial={{ y: '100%' }}
                  animate={{ y: 0 }}
                  exit={{ y: '100%' }}
                  transition={{ type: 'spring', damping: 28 }}
                  style={{ background: '#fff', borderRadius: '28px 28px 0 0', padding: '28px 24px 40px', width: '100%', maxWidth: 480 }}
                >
                  <div style={{ width: 40, height: 4, background: '#e5e7eb', borderRadius: 999, margin: '0 auto 24px' }} />
                  <h3 style={{ color: '#0a1628', fontSize: 18, fontWeight: 900, marginBottom: 4 }}>{maintenanceItem.name}</h3>
                  <p style={{ color: '#6b7280', fontSize: 13, marginBottom: 20 }}>Descreva o problema para que a equipa possa ajudar mais rapidamente.</p>
                  <textarea
                    value={maintenanceDesc}
                    onChange={e => setMaintenanceDesc(e.target.value)}
                    placeholder="Ex: O AC não liga, a luz está piscando..."
                    style={{ width: '100%', background: '#f9fafb', border: '1.5px solid #e5e7eb', borderRadius: 14, padding: '14px 16px', fontSize: 13, fontFamily: 'inherit', resize: 'none', height: 100, boxSizing: 'border-box', marginBottom: 16 }}
                  />
                  <button
                    onClick={handleSubmitMaintenance}
                    disabled={submitting}
                    style={{ width: '100%', background: '#0a1628', color: '#fff', border: 'none', borderRadius: 16, padding: '16px', fontSize: 13, fontWeight: 900, cursor: 'pointer', marginBottom: 12 }}
                  >
                    {submitting ? 'A enviar...' : 'Enviar Pedido de Manutenção'}
                  </button>
                  <button onClick={() => setMaintenanceItem(null)} style={{ width: '100%', background: 'transparent', color: '#6b7280', border: 'none', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
                    {t('cancel')}
                  </button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>
    );
  };

  // ── INFO PAGE ──
  const renderInfoPage = () => (
    <AnimatePresence>
      <motion.div
        key="infopage"
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 28 }}
        style={{ position: 'fixed', inset: 0, zIndex: 80, background: '#f5f5f0', overflowY: 'auto', paddingBottom: 100 }}
      >
        <div style={{ background: '#0a1628', padding: '20px 20px 24px', position: 'sticky', top: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button onClick={() => setCategoryView(null)} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: 999, padding: 8, cursor: 'pointer' }}>
              <ArrowLeft size={18} color="#fff" />
            </button>
            <div>
              <p style={{ color: '#c9963b', fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 2 }}>{hotel.name}</p>
              <h2 style={{ color: '#fff', fontSize: 18, fontWeight: 900 }}>{t('info')}</h2>
            </div>
          </div>
        </div>
        <div style={{ padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Wi-Fi */}
          <div style={{ background: '#fff', borderRadius: 20, padding: '20px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: '#0a1628', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Wifi size={18} color="#c9963b" />
              </div>
              <h3 style={{ color: '#0a1628', fontWeight: 900, fontSize: 15 }}>Wi-Fi</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#6b7280', fontSize: 13 }}>{t('wifi_net')}</span>
                <span style={{ color: '#0a1628', fontWeight: 800, fontSize: 13 }}>{hotel.name?.replace(/\s+/g, '')}_Guest</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#6b7280', fontSize: 13 }}>{t('wifi_pass')}</span>
                <span style={{ color: '#0a1628', fontWeight: 800, fontSize: 13 }}>azores2026</span>
              </div>
            </div>
          </div>
          {/* Horários */}
          <div style={{ background: '#fff', borderRadius: 20, padding: '20px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: '#0a1628', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Clock size={18} color="#c9963b" />
              </div>
              <h3 style={{ color: '#0a1628', fontWeight: 900, fontSize: 15 }}>Horários</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#6b7280', fontSize: 13 }}>🍳 {t('breakfast_time')}</span><span style={{ color: '#0a1628', fontWeight: 800, fontSize: 13 }}>08:00 – 10:30</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#6b7280', fontSize: 13 }}>🔑 {t('checkin_time')}</span><span style={{ color: '#0a1628', fontWeight: 800, fontSize: 13 }}>14:00</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#6b7280', fontSize: 13 }}>🛎️ {t('checkout_time')}</span><span style={{ color: '#0a1628', fontWeight: 800, fontSize: 13 }}>12:00</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#6b7280', fontSize: 13 }}>🔕 {t('silence_policy')}</span><span style={{ color: '#0a1628', fontWeight: 800, fontSize: 13 }}>22:00 – 08:00</span></div>
            </div>
          </div>
          {/* Contacto */}
          <div style={{ background: '#fff', borderRadius: 20, padding: '20px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: '#0a1628', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <PhoneCall size={18} color="#c9963b" />
              </div>
              <h3 style={{ color: '#0a1628', fontWeight: 900, fontSize: 15 }}>Contacto</h3>
            </div>
            {hotel.phone && <p style={{ color: '#0a1628', fontWeight: 700, fontSize: 14 }}>📞 {hotel.phone}</p>}
            {hotel.email && <p style={{ color: '#0a1628', fontWeight: 700, fontSize: 14, marginTop: 6 }}>✉️ {hotel.email}</p>}
            {hotel.address && <p style={{ color: '#6b7280', fontSize: 13, marginTop: 8 }}>📍 {hotel.address}</p>}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );

  // ── RECEPTION PAGE ──
  const renderReceptionPage = () => (
    <AnimatePresence>
      <motion.div
        key="recepage"
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 28 }}
        style={{ position: 'fixed', inset: 0, zIndex: 80, background: '#f5f5f0', overflowY: 'auto', paddingBottom: 100 }}
      >
        <div style={{ background: '#0a1628', padding: '20px 20px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button onClick={() => setCategoryView(null)} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: 999, padding: 8, cursor: 'pointer' }}>
              <ArrowLeft size={18} color="#fff" />
            </button>
            <div>
              <p style={{ color: '#c9963b', fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 2 }}>{hotel.name}</p>
              <h2 style={{ color: '#fff', fontSize: 18, fontWeight: 900 }}>{t('reception')}</h2>
            </div>
          </div>
        </div>
        <div style={{ padding: '24px 16px' }}>
          <div style={{ background: '#fff', borderRadius: 24, padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
            <AnimatePresence>
              {msgSent ? (
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={{ textAlign: 'center', padding: '32px 0' }}>
                  <div style={{ fontSize: 48, marginBottom: 12 }}>✅</div>
                  <h3 style={{ color: '#0a1628', fontWeight: 900, fontSize: 18, marginBottom: 8 }}>Mensagem enviada!</h3>
                  <p style={{ color: '#6b7280', fontSize: 14 }}>A receção irá responder brevemente.</p>
                </motion.div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1, color: '#9ca3af', marginBottom: 6 }}>{t('name_optional')}</label>
                    <input
                      value={receptionName}
                      onChange={e => setReceptionName(e.target.value)}
                      placeholder="O seu nome"
                      style={{ width: '100%', background: '#f9fafb', border: '1.5px solid #e5e7eb', borderRadius: 14, padding: '14px 16px', fontSize: 14, fontFamily: 'inherit', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1, color: '#9ca3af', marginBottom: 6 }}>{t('message')} *</label>
                    <textarea
                      value={receptionMsg}
                      onChange={e => setReceptionMsg(e.target.value)}
                      placeholder="Como podemos ajudar?"
                      style={{ width: '100%', background: '#f9fafb', border: '1.5px solid #e5e7eb', borderRadius: 14, padding: '14px 16px', fontSize: 14, fontFamily: 'inherit', resize: 'none', height: 120, boxSizing: 'border-box' }}
                    />
                  </div>
                  <button
                    onClick={handleSendReception}
                    disabled={sendingMsg || !receptionMsg.trim()}
                    style={{ background: !receptionMsg.trim() ? '#e5e7eb' : '#0a1628', color: !receptionMsg.trim() ? '#9ca3af' : '#fff', border: 'none', borderRadius: 16, padding: '16px', fontSize: 14, fontWeight: 900, cursor: receptionMsg.trim() ? 'pointer' : 'default', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
                  >
                    <Send size={16} />
                    {sendingMsg ? 'A enviar...' : t('send_message')}
                  </button>
                  <a href={`tel:${hotel.phone || '296000000'}`} style={{ background: '#f0efe8', border: 'none', borderRadius: 16, padding: '16px', fontSize: 14, fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, color: '#0a1628', textDecoration: 'none' }}>
                    <PhoneCall size={16} />
                    {t('call_reception')}
                  </a>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );

  // ── ORDERS TAB ──
  const renderOrdersTab = () => (
    <div style={{ padding: '24px 16px', paddingBottom: 100 }}>
      <h2 style={{ color: '#0a1628', fontWeight: 900, fontSize: 22, marginBottom: 20 }}>{t('my_orders')}</h2>
      {loadingOrders ? (
        <div style={{ textAlign: 'center', padding: 40 }}>
          <RefreshCw size={28} color="#c9963b" style={{ animation: 'spin 1s linear infinite' }} />
        </div>
      ) : myOrders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 60 }}>
          <ShoppingCart size={48} color="#d1d5db" style={{ marginBottom: 16, display: 'block', margin: '0 auto 16px' }} />
          <p style={{ color: '#9ca3af', fontSize: 14 }}>{t('orders_empty')}</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {[...myOrders].reverse().map(order => (
            <div key={order.id} style={{ background: '#fff', borderRadius: 20, padding: '18px 20px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                <div>
                  <p style={{ color: '#0a1628', fontWeight: 800, fontSize: 14 }}>{order.category}</p>
                  <p style={{ color: '#9ca3af', fontSize: 12, marginTop: 2 }}>
                    {order.createdAt ? new Date(order.createdAt).toLocaleString('pt-PT') : '—'}
                  </p>
                </div>
                <StatusBadge status={order.status || 'Pendente'} />
              </div>
              {(order.items || []).map((item: any, idx: number) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderTop: '1px solid #f3f4f6' }}>
                  <span style={{ color: '#374151', fontSize: 13 }}>{item.quantity}x {item.name}</span>
                  <span style={{ color: '#c9963b', fontWeight: 800, fontSize: 13 }}>{item.price > 0 ? `${item.price * item.quantity}€` : t('free')}</span>
                </div>
              ))}
              {order.notes && (
                <p style={{ color: '#6b7280', fontSize: 12, marginTop: 8, fontStyle: 'italic' }}>"{order.notes}"</p>
              )}
              {order.total > 0 && (
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 10 }}>
                  <span style={{ color: '#0a1628', fontWeight: 900, fontSize: 16 }}>Total: {order.total}€</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // ── EMERGENCY TAB ──
  const renderEmergencyTab = () => (
    <div style={{ padding: '24px 16px', paddingBottom: 100 }}>
      <h2 style={{ color: '#0a1628', fontWeight: 900, fontSize: 22, marginBottom: 6 }}>{t('emergency_title')}</h2>
      <p style={{ color: '#6b7280', fontSize: 13, marginBottom: 24 }}>Em caso de urgência, contacte-nos imediatamente.</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {/* Call reception */}
        <a href={`tel:${hotel.phone || '296000000'}`} style={{ background: '#0a1628', color: '#fff', borderRadius: 20, padding: '20px', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 48, height: 48, borderRadius: 14, background: '#c9963b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <PhoneCall size={22} color="#0a1628" />
          </div>
          <div>
            <p style={{ fontWeight: 900, fontSize: 16 }}>{t('call_reception')}</p>
            <p style={{ color: '#c9963b', fontSize: 13 }}>{hotel.phone || '296 000 000'}</p>
          </div>
        </a>
        {/* Emergency 112 */}
        <a href="tel:112" style={{ background: '#ef4444', color: '#fff', borderRadius: 20, padding: '20px', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 48, height: 48, borderRadius: 14, background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Zap size={22} color="#fff" />
          </div>
          <div>
            <p style={{ fontWeight: 900, fontSize: 16 }}>{t('emergency_num')}</p>
            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13 }}>Bombeiros, Polícia, Ambulância</p>
          </div>
        </a>
        {/* Urgent request */}
        <div style={{ background: '#fff', borderRadius: 20, padding: '20px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
          <h3 style={{ color: '#0a1628', fontWeight: 900, fontSize: 16, marginBottom: 6 }}>🚨 {t('urgent_request')}</h3>
          <p style={{ color: '#6b7280', fontSize: 13, marginBottom: 14 }}>Enviar pedido urgente à equipa do alojamento.</p>
          <AnimatePresence>
            {urgentSent ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: 'center', padding: '16px 0' }}>
                <p style={{ color: '#10b981', fontWeight: 800, fontSize: 15 }}>✅ Pedido urgente enviado! A equipa foi alertada.</p>
              </motion.div>
            ) : (
              <>
                <textarea
                  value={urgentDesc}
                  onChange={e => setUrgentDesc(e.target.value)}
                  placeholder={t('urgent_placeholder')}
                  style={{ width: '100%', background: '#f9fafb', border: '1.5px solid #fca5a5', borderRadius: 14, padding: '14px 16px', fontSize: 13, fontFamily: 'inherit', resize: 'none', height: 100, boxSizing: 'border-box', marginBottom: 12 }}
                />
                <button
                  onClick={handleSendUrgent}
                  disabled={sendingUrgent || !urgentDesc.trim()}
                  style={{ width: '100%', background: urgentDesc.trim() ? '#ef4444' : '#e5e7eb', color: urgentDesc.trim() ? '#fff' : '#9ca3af', border: 'none', borderRadius: 14, padding: '16px', fontSize: 14, fontWeight: 900, cursor: urgentDesc.trim() ? 'pointer' : 'default' }}
                >
                  {sendingUrgent ? 'A enviar...' : `🚨 ${t('send_urgent')}`}
                </button>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );

  // ── MAIN HOME RENDER ──
  const renderHome = () => (
    <>
      {/* Hero Section */}
      <div style={{ position: 'relative', height: 300, overflow: 'hidden' }}>
        <img src={heroImage} alt={room.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(10,22,40,0.5) 0%, rgba(10,22,40,0.85) 100%)' }} />
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', padding: '0 24px 32px', textAlign: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#c9963b', animation: 'pulse 2s infinite' }} />
            <span style={{ color: '#c9963b', fontSize: 13, fontWeight: 800 }}>{room.name}</span>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#c9963b', animation: 'pulse 2s infinite' }} />
          </div>
          <h1 style={{ color: '#fff', fontSize: 32, fontWeight: 900, lineHeight: 1.1, marginBottom: 10 }}>{t('how_help')}</h1>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 14, lineHeight: 1.5 }}>{t('subtitle')}</p>
        </div>
      </div>

      {/* Delivery note */}
      <div style={{ margin: '16px 16px 0', background: '#fffbef', border: '1.5px solid #fde68a', borderRadius: 16, padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <Bell size={18} color="#d97706" />
        <p style={{ color: '#92400e', fontSize: 13, fontWeight: 600 }}>{t('delivery_note')}</p>
      </div>

      {/* Quick Orders */}
      <div style={{ padding: '24px 0 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 16px', marginBottom: 14 }}>
          <h2 style={{ color: '#0a1628', fontWeight: 900, fontSize: 18 }}>{t('quick_orders')}</h2>
          <span style={{ color: '#c9963b', fontSize: 13, fontWeight: 700, cursor: 'pointer' }} onClick={() => setCategoryView('roomservice')}>
            {t('see_all')}
          </span>
        </div>
        <div style={{ display: 'flex', gap: 12, overflowX: 'auto', padding: '4px 16px 16px', scrollbarWidth: 'none' }}>
          {menuItems.quick.filter(i => i.isActive !== false).map(item => {
            const inCart = cart.find(c => c.id === item.id);
            return (
              <div key={item.id} style={{ flexShrink: 0, background: '#fff', borderRadius: 20, padding: '16px 14px', width: 110, boxShadow: '0 2px 16px rgba(0,0,0,0.07)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                <div style={{ fontSize: 36, lineHeight: 1 }}>{item.emoji || '📦'}</div>
                <p style={{ color: '#0a1628', fontWeight: 800, fontSize: 12, textAlign: 'center', lineHeight: 1.2 }}>{item.name}</p>
                <p style={{ color: '#c9963b', fontWeight: 900, fontSize: 13 }}>{item.price > 0 ? `${item.price}€` : t('free')}</p>
                {inCart ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <button onClick={() => removeFromCart(item.id)} style={{ width: 24, height: 24, borderRadius: '50%', background: '#f3f4f6', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                      <Minus size={10} color="#374151" />
                    </button>
                    <span style={{ fontWeight: 900, fontSize: 13, color: '#0a1628' }}>{inCart.quantity}</span>
                    <button onClick={() => addToCart(item)} style={{ width: 24, height: 24, borderRadius: '50%', background: '#0a1628', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                      <Plus size={10} color="#fff" />
                    </button>
                  </div>
                ) : (
                  <button onClick={() => addToCart(item)} style={{ width: 32, height: 32, borderRadius: '50%', background: '#0a1628', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                    <Plus size={14} color="#fff" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Categories */}
      <div style={{ padding: '8px 16px 16px' }}>
        <h2 style={{ color: '#0a1628', fontWeight: 900, fontSize: 18, marginBottom: 14 }}>{t('categories')}</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {CATEGORY_CONFIG.map(cat => (
            <button
              key={cat.id}
              onClick={() => setCategoryView(cat.id as CategoryView)}
              style={{ background: '#fff', borderRadius: 20, padding: '18px 16px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 14, boxShadow: '0 2px 12px rgba(0,0,0,0.06)', textAlign: 'left' }}
            >
              <div style={{ width: 44, height: 44, borderRadius: 14, background: '#0a1628', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {React.cloneElement(cat.icon as React.ReactElement, { color: '#c9963b' })}
              </div>
              <div>
                <p style={{ color: '#0a1628', fontWeight: 800, fontSize: 13, lineHeight: 1.2 }}>{t(cat.labelKey)}</p>
                <p style={{ color: '#9ca3af', fontSize: 11, marginTop: 2 }}>{t(cat.subKey)}</p>
              </div>
              <ChevronRight size={14} color="#9ca3af" style={{ marginLeft: 'auto', flexShrink: 0 }} />
            </button>
          ))}
        </div>
      </div>

      {/* Upsell banner */}
      <div style={{ margin: '8px 16px 24px', background: '#0a1628', borderRadius: 24, padding: '22px 20px', display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{ fontSize: 36, flexShrink: 0 }}>🎁</div>
        <div style={{ flex: 1 }}>
          <p style={{ color: '#fff', fontWeight: 900, fontSize: 15, marginBottom: 4 }}>{t('upsell_title')}</p>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12 }}>{t('upsell_sub')}</p>
        </div>
        <button
          onClick={() => setCategoryView('extras')}
          style={{ background: '#c9963b', color: '#0a1628', border: 'none', borderRadius: 14, padding: '12px 16px', fontSize: 13, fontWeight: 900, cursor: 'pointer', whiteSpace: 'nowrap' }}
        >
          {t('upsell_btn')}
        </button>
      </div>
    </>
  );

  // ── MAIN RETURN ──
  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f0', fontFamily: "'Inter', system-ui, sans-serif", position: 'relative', maxWidth: 480, margin: '0 auto' }}>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800;900&display=swap" rel="stylesheet" />

      {/* ── TOP HEADER ── */}
      <header style={{ background: '#0a1628', padding: '16px 20px', position: 'sticky', top: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {onBackToApp && (
            <button onClick={onBackToApp} style={{ background: 'rgba(255,255,255,0.08)', border: 'none', borderRadius: 999, padding: 8, cursor: 'pointer', display: 'flex' }}>
              <ArrowLeft size={16} color="#fff" />
            </button>
          )}
          <div>
            <p style={{ color: '#c9963b', fontSize: 14, fontWeight: 900, letterSpacing: 0.5 }}>{hotel.name}</p>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11, fontWeight: 600 }}>AZORES</p>
          </div>
        </div>
        {/* Language switcher */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowLangMenu(v => !v)}
            style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 12, padding: '8px 12px', cursor: 'pointer', color: '#fff', fontSize: 13, fontWeight: 700 }}
          >
            <Globe size={14} />
            {lang.toUpperCase()}
          </button>
          <AnimatePresence>
            {showLangMenu && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: -4 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -4 }}
                style={{ position: 'absolute', right: 0, top: '110%', background: '#fff', borderRadius: 14, overflow: 'hidden', boxShadow: '0 8px 32px rgba(0,0,0,0.15)', zIndex: 100, minWidth: 100 }}
              >
                {(['pt', 'en'] as const).map(l => (
                  <button key={l} onClick={() => { setLang(l); setShowLangMenu(false); }} style={{ display: 'block', width: '100%', padding: '12px 16px', background: lang === l ? '#f0efe8' : 'transparent', border: 'none', color: '#0a1628', fontWeight: lang === l ? 900 : 600, fontSize: 13, cursor: 'pointer', textAlign: 'left' }}>
                    {l === 'pt' ? '🇵🇹 Português' : '🇬🇧 English'}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      {/* ── SCROLLABLE CONTENT ── */}
      <main style={{ overflowY: 'auto', paddingBottom: 100 }}>
        {navTab === 'home' && renderHome()}
        {navTab === 'orders' && (
          <div style={{ background: '#f5f5f0' }}>
            <div style={{ background: '#0a1628', padding: '20px 20px 24px' }}>
              <h2 style={{ color: '#fff', fontWeight: 900, fontSize: 20 }}>{t('my_orders')}</h2>
              <p style={{ color: '#c9963b', fontSize: 12, marginTop: 4 }}>{room.name}</p>
            </div>
            {renderOrdersTab()}
          </div>
        )}
        {navTab === 'emergency' && (
          <div style={{ background: '#f5f5f0' }}>
            <div style={{ background: '#ef4444', padding: '20px 20px 24px' }}>
              <h2 style={{ color: '#fff', fontWeight: 900, fontSize: 20 }}>🚨 {t('emergency_title')}</h2>
              <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12, marginTop: 4 }}>{room.name}</p>
            </div>
            {renderEmergencyTab()}
          </div>
        )}
      </main>

      {/* ── CATEGORY SUB-PAGES ── */}
      {categoryView && categoryView !== 'info' && categoryView !== 'reception' && renderCategoryPage()}
      {categoryView === 'info' && renderInfoPage()}
      {categoryView === 'reception' && renderReceptionPage()}

      {/* ── FLOATING CART BAR ── */}
      <AnimatePresence>
        {cartCount > 0 && !showCart && (
          <motion.button
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            onClick={() => setShowCart(true)}
            style={{ position: 'fixed', bottom: 88, left: '50%', transform: 'translateX(-50%)', background: '#0a1628', color: '#fff', border: 'none', borderRadius: 999, padding: '16px 28px', display: 'flex', alignItems: 'center', gap: 12, boxShadow: '0 8px 32px rgba(10,22,40,0.4)', zIndex: 60, cursor: 'pointer', whiteSpace: 'nowrap', maxWidth: 420 }}
          >
            <div style={{ background: '#c9963b', borderRadius: '50%', width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShoppingCart size={14} color="#0a1628" />
            </div>
            <span style={{ fontWeight: 800, fontSize: 14 }}>
              {cartCount} {t('cart_items')} · {cartTotal > 0 ? `${cartTotal.toFixed(2)}€` : t('free')}
            </span>
            <span style={{ fontWeight: 900, fontSize: 14, color: '#c9963b' }}>{t('cart_send')} →</span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* ── CART SHEET ── */}
      <AnimatePresence>
        {showCart && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, zIndex: 70, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}
            onClick={() => setShowCart(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28 }}
              style={{ background: '#fff', borderRadius: '28px 28px 0 0', padding: '24px 20px 48px', width: '100%', maxWidth: 480, maxHeight: '85vh', overflowY: 'auto' }}
              onClick={e => e.stopPropagation()}
            >
              <div style={{ width: 40, height: 4, background: '#e5e7eb', borderRadius: 999, margin: '0 auto 24px' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <h3 style={{ color: '#0a1628', fontWeight: 900, fontSize: 20 }}>{t('order_summary')}</h3>
                <button onClick={() => setShowCart(false)} style={{ background: '#f3f4f6', border: 'none', borderRadius: '50%', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                  <X size={16} color="#374151" />
                </button>
              </div>
              {/* Room info */}
              <div style={{ background: '#f0efe8', borderRadius: 14, padding: '12px 16px', marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#0a1628', fontWeight: 700, fontSize: 13 }}>🛏 {room.name}</span>
                <span style={{ color: '#9ca3af', fontSize: 12 }}>Entrega no quarto</span>
              </div>
              {/* Cart items */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
                {cart.map(c => (
                  <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ fontSize: 20 }}>{c.emoji || '📦'}</span>
                      <div>
                        <p style={{ color: '#0a1628', fontWeight: 700, fontSize: 14 }}>{c.name}</p>
                        <p style={{ color: '#9ca3af', fontSize: 12 }}>{c.price > 0 ? `${c.price}€ un.` : t('free')}</p>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <button onClick={() => removeFromCart(c.id)} style={{ width: 28, height: 28, borderRadius: '50%', background: '#f3f4f6', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                        <Minus size={12} color="#374151" />
                      </button>
                      <span style={{ fontWeight: 900, fontSize: 14, color: '#0a1628', minWidth: 16, textAlign: 'center' }}>{c.quantity}</span>
                      <button onClick={() => addToCart(c)} style={{ width: 28, height: 28, borderRadius: '50%', background: '#0a1628', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                        <Plus size={12} color="#fff" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              {/* Notes */}
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1, color: '#9ca3af', marginBottom: 6 }}>{t('notes')}</label>
                <textarea
                  value={orderNotes}
                  onChange={e => setOrderNotes(e.target.value)}
                  placeholder={t('notes_placeholder')}
                  style={{ width: '100%', background: '#f9fafb', border: '1.5px solid #e5e7eb', borderRadius: 14, padding: '12px 14px', fontSize: 13, fontFamily: 'inherit', resize: 'none', height: 80, boxSizing: 'border-box' }}
                />
              </div>
              {/* Total + confirm */}
              <div style={{ borderTop: '1.5px solid #f3f4f6', paddingTop: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <span style={{ color: '#0a1628', fontWeight: 800, fontSize: 15 }}>{t('total')}</span>
                <span style={{ color: '#0a1628', fontWeight: 900, fontSize: 24 }}>{cartTotal > 0 ? `${cartTotal.toFixed(2)}€` : t('free')}</span>
              </div>
              <button
                onClick={handleSubmitOrder}
                disabled={submitting}
                style={{ width: '100%', background: '#0a1628', color: '#fff', border: 'none', borderRadius: 18, padding: '18px', fontSize: 15, fontWeight: 900, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
              >
                {submitting ? <RefreshCw size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <><Send size={16} /> {t('confirm_order')}</>}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── SUCCESS MODAL ── */}
      <AnimatePresence>
        {successModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              style={{ background: '#fff', borderRadius: 28, padding: '40px 32px', textAlign: 'center', maxWidth: 360, width: '100%', boxShadow: '0 32px 64px rgba(0,0,0,0.3)' }}
            >
              <div style={{ width: 72, height: 72, borderRadius: '50%', background: '#d1fae5', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                <CheckCircle size={36} color="#10b981" />
              </div>
              <h2 style={{ color: '#0a1628', fontWeight: 900, fontSize: 24, marginBottom: 12 }}>{t('success_title')}</h2>
              <p style={{ color: '#6b7280', fontSize: 14, lineHeight: 1.6, marginBottom: 28 }}>{t('success_body')}</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <button
                  onClick={() => { setSuccessModal(false); setNavTab('orders'); }}
                  style={{ background: '#0a1628', color: '#fff', border: 'none', borderRadius: 16, padding: '16px', fontSize: 14, fontWeight: 900, cursor: 'pointer' }}
                >
                  {t('view_orders')}
                </button>
                <button
                  onClick={() => setSuccessModal(false)}
                  style={{ background: '#f3f4f6', color: '#374151', border: 'none', borderRadius: 16, padding: '16px', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}
                >
                  {t('new_order')}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── BOTTOM NAVIGATION ── */}
      <nav style={{ position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: 480, background: '#fff', borderTop: '1px solid #f3f4f6', padding: '10px 0 20px', zIndex: 50, display: 'flex', justifyContent: 'space-around', boxShadow: '0 -8px 32px rgba(0,0,0,0.08)' }}>
        {[
          { tab: 'home' as NavTab, icon: <Home size={22} />, label: t('nav_home') },
          { tab: 'orders' as NavTab, icon: <Clock size={22} />, label: t('nav_orders'), badge: myOrders.filter(o => o.status === 'Pendente').length },
          { tab: 'emergency' as NavTab, icon: <PhoneCall size={22} />, label: t('nav_emergency') },
        ].map(nav => (
          <button
            key={nav.tab}
            onClick={() => { setNavTab(nav.tab); setCategoryView(null); }}
            style={{ background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, padding: '4px 16px', position: 'relative' }}
          >
            <div style={{ color: navTab === nav.tab ? '#c9963b' : '#9ca3af', position: 'relative' }}>
              {nav.icon}
              {nav.badge ? (
                <span style={{ position: 'absolute', top: -4, right: -4, background: '#ef4444', color: '#fff', borderRadius: '50%', width: 16, height: 16, fontSize: 9, fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {nav.badge}
                </span>
              ) : null}
            </div>
            <span style={{ fontSize: 10, fontWeight: navTab === nav.tab ? 800 : 600, color: navTab === nav.tab ? '#c9963b' : '#9ca3af' }}>{nav.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
