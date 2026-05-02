// Dashboard de Gestão Restaurantes - AzoresToyou
import React, { useState, useEffect } from 'react';
import { Restaurant, Language, Dish, Product, RestaurantTable, Reservation, RestaurantUpdate, KitchenOrder, StaffMember } from '../types';
import { getTranslation } from '../translations';
import { 
  Utensils, Edit, Trash2, Plus, Save, X, LogOut, 
  LayoutDashboard, Image as ImageIcon, CheckCircle, 
  Clock, Coffee, Wine, Beer, ShoppingBag, Users, 
  ChevronRight, Calendar, Table as TableIcon, 
  Check, AlertCircle, MapPin, Search, Star, Megaphone, CalendarPlus, Settings, Phone, Mail, Map as MapIcon, Lock, Receipt, Info,
  QrCode, Printer, ArrowRight, Send, Sparkles, Scissors, Flower, Store, Wrench, RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';


interface BusinessDashboardProps {
  business: Restaurant;
  onUpdateBusiness: (updated: Restaurant) => void;
  onSync: (updated: Restaurant) => void;
  onLogout: () => void;
  language?: Language;
  isStaff?: boolean;
  staffRole?: string;
}

type DashboardTab = 'tables' | 'kitchen' | 'pos' | 'reservations' | 'dishes' | 'products' | 'dashboard' | 'reviews' | 'updates' | 'settings' | 'gallery' | 'qrcode' | 'staff' | 'business' | 'staff_list' | 'ponto' | 'ferias' | 'suppliers';

const POS_CATEGORIES = ['Entradas', 'Sopas', 'Pratos', 'Vinhos', 'Bebidas', 'Aperitivos', 'Sobremesas', 'Bolos', 'Gelados'];
const BEAUTY_POS_CATEGORIES = ['Cabelo', 'Unhas', 'Estética', 'Massagem', 'Maquilhagem', 'Sobrancelhas', 'Depilação', 'Barba', 'Produtos'];
const SHOP_POS_CATEGORIES = ['Vestuário', 'Calçado', 'Acessórios', 'Eletrónica', 'Casa', 'Promoções', 'Outros'];

const MOCK_POS_PRODUCTS: Product[] = [
  // Entradas
  { id: 'pos_e1', name: 'Pão e Manteiga', price: 2.50, category: 'Entradas', description: '', image: '' },
  { id: 'pos_e2', name: 'Queijo da Ilha', price: 5.50, category: 'Entradas', description: '', image: '' },
  { id: 'pos_e3', name: 'Azeitonas Temperadas', price: 1.50, category: 'Entradas', description: '', image: '' },
  { id: 'pos_e4', name: 'Chouriço Assado', price: 6.00, category: 'Entradas', description: '', image: '' },
  { id: 'pos_e5', name: 'Lapas Grelhadas', price: 8.50, category: 'Entradas', description: '', image: '' },
  { id: 'pos_e6', name: 'Pastéis de Bacalhau', price: 4.50, category: 'Entradas', description: '', image: '' },
  { id: 'pos_e7', name: 'Pica-Pau Regional', price: 12.00, category: 'Entradas', description: '', image: '' },
  // Sopas
  { id: 'pos_s1', name: 'Sopa de Peixe', price: 4.50, category: 'Sopas', description: '', image: '' },
  { id: 'pos_s2', name: 'Caldo Verde', price: 3.50, category: 'Sopas', description: '', image: '' },
  { id: 'pos_s3', name: 'Sopa de Legumes', price: 3.00, category: 'Sopas', description: '', image: '' },
  { id: 'pos_s4', name: 'Creme de Marisco', price: 5.50, category: 'Sopas', description: '', image: '' },
  { id: 'pos_s5', name: 'Canja de Galinha', price: 3.50, category: 'Sopas', description: '', image: '' },
  { id: 'pos_s6', name: 'Sopa da Pedra', price: 6.50, category: 'Sopas', description: '', image: '' },
  { id: 'pos_s7', name: 'Sopa de Tomate', price: 3.50, category: 'Sopas', description: '', image: '' },
  // Pratos
  { id: 'pos_p1', name: 'Bife à Regional', price: 18.00, category: 'Pratos', description: '', image: '' },
  { id: 'pos_p2', name: 'Polvo Assado', price: 16.50, category: 'Pratos', description: '', image: '' },
  { id: 'pos_p3', name: 'Bacalhau à Brás', price: 14.00, category: 'Pratos', description: '', image: '' },
  { id: 'pos_p4', name: 'Arroz de Marisco', price: 22.00, category: 'Pratos', description: '', image: '' },
  { id: 'pos_p5', name: 'Cozido das Furnas', price: 25.00, category: 'Pratos', description: '', image: '' },
  { id: 'pos_p6', name: 'Churrasco Misto', price: 15.50, category: 'Pratos', description: '', image: '' },
  { id: 'pos_p7', name: 'Francesinha Açoriana', price: 13.50, category: 'Pratos', description: '', image: '' },
  // Vinhos
  { id: 'pos_v1', name: 'Vinho Tinto Pico', price: 18.00, category: 'Vinhos', description: '', image: '' },
  { id: 'pos_v2', name: 'Vinho Branco Graciosa', price: 14.50, category: 'Vinhos', description: '', image: '' },
  { id: 'pos_v3', name: 'Vinho Rosé Regional', price: 12.00, category: 'Vinhos', description: '', image: '' },
  { id: 'pos_v4', name: 'Reserva Especial', price: 35.00, category: 'Vinhos', description: '', image: '' },
  { id: 'pos_v5', name: 'Vinho Verde', price: 10.00, category: 'Vinhos', description: '', image: '' },
  { id: 'pos_v6', name: 'Espumante de Honra', price: 28.00, category: 'Vinhos', description: '', image: '' },
  { id: 'pos_v7', name: 'Vinho do Porto', price: 5.00, category: 'Vinhos', description: '', image: '' },
  // Bebidas
  { id: 'pos_b1', name: 'Água das Pedras', price: 1.80, category: 'Bebidas', description: '', image: '' },
  { id: 'pos_b2', name: 'Cerveja Especial', price: 2.50, category: 'Bebidas', description: '', image: '' },
  { id: 'pos_b3', name: 'Laranjada da Ilha', price: 2.00, category: 'Bebidas', description: '', image: '' },
  { id: 'pos_b4', name: 'Kima Maracujá', price: 2.20, category: 'Bebidas', description: '', image: '' },
  { id: 'pos_b5', name: 'Sumo de Laranja', price: 3.50, category: 'Bebidas', description: '', image: '' },
  { id: 'pos_b6', name: 'Ice Tea Limão', price: 2.00, category: 'Bebidas', description: '', image: '' },
  { id: 'pos_b7', name: 'Coca-Cola', price: 2.00, category: 'Bebidas', description: '', image: '' },
  // Aperitivos
  { id: 'pos_a1', name: 'Grogue', price: 3.50, category: 'Aperitivos', description: '', image: '' },
  { id: 'pos_a2', name: 'Licor de Tangerina', price: 4.00, category: 'Aperitivos', description: '', image: '' },
  { id: 'pos_a3', name: 'Martini Bianco', price: 4.50, category: 'Aperitivos', description: '', image: '' },
  { id: 'pos_a4', name: 'Gin Tónico Pico', price: 9.00, category: 'Aperitivos', description: '', image: '' },
  { id: 'pos_a5', name: 'Aguardente Velha', price: 6.00, category: 'Aperitivos', description: '', image: '' },
  { id: 'pos_a6', name: 'Caipirinha', price: 7.50, category: 'Aperitivos', description: '', image: '' },
  { id: 'pos_a7', name: 'Margarita abacaxi', price: 8.50, category: 'Aperitivos', description: '', image: '' },
  // Sobremesas
  { id: 'pos_so1', name: 'Mousse de Maracujá', price: 4.50, category: 'Sobremesas', description: '', image: '' },
  { id: 'pos_so2', name: 'Pudim de Feijão', price: 4.00, category: 'Sobremesas', description: '', image: '' },
  { id: 'pos_so3', name: 'Salada de Fruta', price: 3.50, category: 'Sobremesas', description: '', image: '' },
  { id: 'pos_so4', name: 'Baba de Camelo', price: 4.50, category: 'Sobremesas', description: '', image: '' },
  { id: 'pos_so5', name: 'Arroz Doce', price: 3.50, category: 'Sobremesas', description: '', image: '' },
  { id: 'pos_so6', name: 'Tarte de Amêndoa', price: 5.00, category: 'Sobremesas', description: '', image: '' },
  { id: 'pos_so7', name: 'Doce da Avó', price: 4.50, category: 'Sobremesas', description: '', image: '' },
  // Bolos
  { id: 'pos_bo1', name: 'Bolo de Chocolate', price: 3.50, category: 'Bolos', description: '', image: '' },
  { id: 'pos_bo2', name: 'Bolo de Bolacha', price: 3.50, category: 'Bolos', description: '', image: '' },
  { id: 'pos_bo3', name: 'Cheesecake Frutos', price: 4.50, category: 'Bolos', description: '', image: '' },
  { id: 'pos_bo4', name: 'Torta de Viana', price: 3.00, category: 'Bolos', description: '', image: '' },
  { id: 'pos_bo5', name: 'Red Velvet', price: 4.80, category: 'Bolos', description: '', image: '' },
  { id: 'pos_bo6', name: 'Bolo de Iogurte', price: 2.50, category: 'Bolos', description: '', image: '' },
  { id: 'pos_bo7', name: 'Pastel de Nata', price: 1.20, category: 'Bolos', description: '', image: '' },
  // Gelados
  { id: 'pos_g1', name: 'Gelado de Baunilha', price: 2.50, category: 'Gelados', description: '', image: '' },
  { id: 'pos_g2', name: 'Gelado de Chocolate', price: 2.50, category: 'Gelados', description: '', image: '' },
  { id: 'pos_g3', name: 'Sorvete de Limão', price: 3.00, category: 'Gelados', description: '', image: '' },
  { id: 'pos_g4', name: 'Gelado Artisanal', price: 4.50, category: 'Gelados', description: '', image: '' },
  { id: 'pos_g5', name: 'Copa da Casa', price: 7.50, category: 'Gelados', description: '', image: '' },
  { id: 'pos_g6', name: 'Banana Split', price: 8.50, category: 'Gelados', description: '', image: '' },
  { id: 'pos_g7', name: 'Affogato', price: 4.00, category: 'Gelados', description: '', image: '' },
];

const MOCK_BEAUTY_SERVICES: any[] = [
  { id: 'b_s1', name: 'Corte de Cabelo Masculino', price: 15.00, category: 'Barba', description: 'Corte clássico ou moderno', image: '' },
  { id: 'b_s2', name: 'Barba Tradicional', price: 10.00, category: 'Barba', description: 'Com toalha quente', image: '' },
  { id: 'b_s3', name: 'Corte e Barba', price: 22.00, category: 'Barba', description: 'Pack completo', image: '' },
  { id: 'b_s4', name: 'Corte Feminino', price: 25.00, category: 'Cabelo', description: 'Lavagem e corte', image: '' },
  { id: 'b_s5', name: 'Coloração', price: 35.00, category: 'Cabelo', description: 'Tinta premium', image: '' },
  { id: 'b_s6', name: 'Manicure Gel', price: 20.00, category: 'Unhas', description: 'Verniz gel duradouro', image: '' },
  { id: 'b_s7', name: 'Pedicure', price: 18.00, category: 'Unhas', description: 'Tratamento completo', image: '' },
  { id: 'b_s8', name: 'Limpeza de Pele', price: 30.00, category: 'Estética', description: 'Hidratação profunda', image: '' },
  { id: 'b_s9', name: 'Massagem Relaxante', price: 40.00, category: 'Massagem', description: '60 minutos', image: '' },
  { id: 'b_s10', name: 'Depilação Sobrancelha', price: 8.00, category: 'Sobrancelhas', description: 'Design com pinça', image: '' },
];

const BusinessDashboard: React.FC<BusinessDashboardProps> = ({
  business,
  onUpdateBusiness,
  onSync,
  onLogout,
  language = 'pt',
  isStaff = false,
  staffRole
}) => {
  // Se for staff, a aba inicial é cozinha ou pos
  // Detetar automaticamente o endereço do backend
  const API_BASE_URL = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
    ? 'http://localhost:3001'
    : 'https://azorestoyou-1.onrender.com';

  const bType = (business.businessType || (business as any).type || '').toLowerCase();
  const isBeauty = bType === 'beauty' || bType === 'beauties' || (!!(business as any).services && !(business as any).dishes && bType !== 'service');
  const isService = bType === 'service' || bType === 'services' || (!!(business as any).services && !(business as any).dishes && !isBeauty);
  const isShop = bType === 'shop' || bType === 'shops' || (!!(business as any).products && !(business as any).dishes && !isBeauty && !isService);
  const isRestaurant = !isBeauty && !isShop && !isService;

  const [activeTab, setActiveTab] = useState<DashboardTab>(isStaff ? 'kitchen' : (isShop ? 'pos' : (isBeauty ? 'reservations' : 'tables')));
  const [reservationsTab, setReservationsTab] = useState<'list' | 'orders'>('list');
  const [editingItem, setEditingItem] = useState<Restaurant | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [walkInTableId, setWalkInTableId] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  // Staff State already declared below


  // Função para carregar imagens para o backend
  const handleImageUpload = async (file: File, type: 'main' | 'gallery' | 'dish', dishIndex?: number) => {
    setIsUploading(true);
    const formData = new FormData();
    formData.append('restaurantId', business.id);
    formData.append('type', type);
    formData.append('image', file as File);


    try {
      const response = await fetch(`${API_BASE_URL}/api/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Falha no upload');

      const data = await response.json();
      
      if (type === 'main') {
        onUpdateBusiness({ ...business, image: data.url });
      } else if (type === 'gallery') {
        const currentGallery = business.gallery || [];
        onUpdateBusiness({ ...business, gallery: [...currentGallery, data.url] });
      } else if (type === 'dish' && dishIndex !== undefined) {
        const updatedDishes = [...(business.dishes || [])];
        updatedDishes[dishIndex] = { ...updatedDishes[dishIndex], image: data.url };
        onUpdateBusiness({ ...business, dishes: updatedDishes });
      }
      
      return data.url;
    } catch (error) {
      console.error('Erro no upload:', error);
      alert('Erro ao carregar imagem. Certifique-se que o servidor backend está a correr.');
    } finally {
      setIsUploading(false);
    }
  };
  const [sidebarHovered, setSidebarHovered] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // POS State
  const [posCategory, setPosCategory] = useState<string>('Pratos');
  const [posCart, setPosCart] = useState<{ product: Product, quantity: number }[]>([]);

  const addToPosCart = (product: Product) => {
    setPosCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item => item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const removeFromPosCart = (productId: string) => {
    setPosCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const updatePosQuantity = (productId: string, delta: number) => {
    setPosCart(prev => prev.map(item => {
      if (item.product.id === productId) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const posTotal = posCart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);

  // POS payment & split state
  const [posSplitBy, setPosSplitBy] = useState(1);
  const [posPaymentModal, setPosPaymentModal] = useState<'cash' | 'card' | null>(null);
  const [posNif, setPosNif] = useState('');
  const [posCashReceived, setPosCashReceived] = useState('');

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Auto-refresh: Atualiza os dados a cada 20 segundos automaticamente
  useEffect(() => {
    const refreshInterval = setInterval(() => {
      console.log('Sincronizando dados do negócio automaticamente...');
      onSync(business);
    }, 20000);
    return () => clearInterval(refreshInterval);
  }, [onSync, business.id]);

  // Local state for management
  const [tables, setTables] = useState<RestaurantTable[]>(business.tables || [
    { id: 'T1', number: 1, seats: 2, status: 'available' },
    { id: 'T2', number: 2, seats: 4, status: 'occupied', customerName: 'João Santos', reservationTime: '13:00', currentOrderId: 'K1' },
    { id: 'T3', number: 3, seats: 4, status: 'available' },
    { id: 'T4', number: 4, seats: 6, status: 'reserved', customerName: 'Maria Silva', reservationTime: '20:30' },
    { id: 'T5', number: 5, seats: 2, status: 'available' },
    { id: 'T6', number: 6, seats: 4, status: 'available' },
  ]);

  const [kitchenOrders, setKitchenOrders] = useState<KitchenOrder[]>(business.kitchenOrders || [
    { id: 'K1', tableId: 'T2', status: 'preparing', timestamp: new Date().toISOString(), items: business.dishes && business.dishes.length > 0 ? [{ dish: business.dishes[0], quantity: 2 }] : [] },
  ]);

  // Sincronização em Tempo Real: Quando o servidor envia dados novos via App.tsx, 
  // nós atualizamos os estados locais do dashboard.
  useEffect(() => {
    if (business.reservations) setReservations(business.reservations);
    if (business.kitchenOrders) setKitchenOrders(business.kitchenOrders);
    // Também atualizar produtos e mesas se mudarem no Super Admin
    if (business.products) setProducts(business.products);
    if (business.tables) setTables(business.tables);
  }, [business]);

  const [reservations, setReservations] = useState<Reservation[]>(business.reservations || []);
  const [products, setProducts] = useState<Product[]>(business.products || []);
  const [updates, setUpdates] = useState<RestaurantUpdate[]>(business.updates || []);
  const [editingUpdate, setEditingUpdate] = useState<{idx: number, update: RestaurantUpdate} | null>(null);
  const [acceptingReservation, setAcceptingReservation] = useState<Reservation | null>(null);

  const ratedReservations = reservations.filter(r => r.reviewed || r.hasRated);
  const allReviews = [
    ...(business.reviews_list || []).map(r => ({ id: r.id, customerName: r.customerName, rating: r.rating, reviewNote: r.comment, date: r.date })),
    ...ratedReservations.map(r => ({ id: r.id, customerName: r.customerName, rating: r.rating, reviewNote: r.reviewNote || r.comment, date: r.date }))
  ];
  
  // Remover duplicados por ID se necessário
  const uniqueReviews = Array.from(new Map(allReviews.map(item => [item.id, item])).values());

  const averageRating = uniqueReviews.length > 0 
    ? (uniqueReviews.reduce((acc, r) => acc + (Number(r.rating) || 0), 0) / uniqueReviews.length).toFixed(1)
    : (Number(business.rating) || 0).toFixed(1);

  // Settings State
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [settingsForm, setSettingsForm] = useState({
    phone: business.phone || '',
    publicEmail: business.publicEmail || '',
    address: business.address || '',
    mapsUrl: business.mapsUrl || '',
    latitude: business.latitude || '',
    longitude: business.longitude || '',
    nif: (business as any).nif || '',
    creditValue: (business as any).creditValue ?? 0.30,
    creditsPerReservation: (business as any).creditsPerReservation ?? 0,
    openingHours: business.openingHours || '09:00-13:00, 14:00-19:00'
  });

  // Staff Management State
  const [staffOpen, setStaffOpen] = useState(false);
  const [staffSubTab, setStaffSubTab] = useState<'staff_list' | 'ponto' | 'ferias'>('staff_list');
  const MOCK_STAFF_BASE = [
    { 
      id: 'STF_1', name: 'Ana Medeiros', role: 'waiter', email: 'ana@restaurante.pt', phone: '+351 916 111 222', password: 'pass123', 
      onDuty: true, attendanceLogs: [
        { date: '25/04/2026', clockIn: '10:00', clockOut: '15:00', totalHours: 5 },
        { date: '26/04/2026', clockIn: '10:05', clockOut: '15:15', totalHours: 5.17 },
        { date: '27/04/2026', clockIn: '09:50' }
      ]
    },
    { 
      id: 'STF_2', name: 'Carlos Bettencourt', role: 'chef', email: 'carlos@restaurante.pt', phone: '+351 917 333 444', password: 'chef456', 
      onDuty: true, attendanceLogs: [
        { date: '27/04/2026', clockIn: '08:00' }
      ]
    },
    { 
      id: 'STF_3', name: 'Margarida Lima', role: 'waiter', email: 'margarida@restaurante.pt', phone: '+351 918 555 666', password: 'pass789', 
      onDuty: false, vacationStart: '2026-04-20', vacationEnd: '2026-05-04' 
    },
    { 
      id: 'STF_4', name: 'Rui Silveira', role: 'manager', email: 'rui@restaurante.pt', phone: '+351 919 777 888', password: 'mgr001', 
      onDuty: true, attendanceLogs: [
        { date: '27/04/2026', clockIn: '09:00' }
      ]
    },
  ];
  const [staff, setStaff] = useState<any[]>(Array.isArray(business.staff) && business.staff.length > 0 ? business.staff : MOCK_STAFF_BASE);
  const [editingStaff, setEditingStaff] = useState<any | null>(null);
  const [showAddStaff, setShowAddStaff] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<any | null>(null);
  const [showAddSupplier, setShowAddSupplier] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<any | null>(null);

  // Fiado (restaurant credit/tab per client)
  // Cash Drawer State
  const [isDrawerOpen, setIsDrawerOpen] = useState(business.isDrawerOpen || false);
  const [drawerAmount, setDrawerAmount] = useState(business.currentDrawerAmount || 0);
  const [openingAmount, setOpeningAmount] = useState('30');

  // Suppliers State
  const [suppliers, setSuppliers] = useState<any[]>(business.suppliers || []);
  const [supplierOrders, setSupplierOrders] = useState<any[]>(business.supplierOrders || []);

  const openDrawer = () => {
    const amount = parseFloat(openingAmount);
    if (amount < 30) {
      alert('O valor mínimo de abertura é 30€.');
      return;
    }
    const newLog = {
      id: 'CDL_' + Date.now(),
      type: 'open',
      amount,
      timestamp: new Date().toISOString(),
    };
    const updatedLogs = [...(business.cashDrawerLogs || []), newLog];
    setIsDrawerOpen(true);
    setDrawerAmount(amount);
    handleUpdate({ 
      isDrawerOpen: true, 
      currentDrawerAmount: amount,
      cashDrawerLogs: updatedLogs
    });
  };

  const closeDrawer = () => {
    if (!window.confirm(`Deseja fechar o caixa com o valor de €${drawerAmount.toFixed(2)}?`)) return;
    
    const newLog = {
      id: 'CDL_' + Date.now(),
      type: 'close',
      amount: drawerAmount,
      timestamp: new Date().toISOString(),
    };
    const updatedLogs = [...(business.cashDrawerLogs || []), newLog];
    setIsDrawerOpen(false);
    handleUpdate({ 
      isDrawerOpen: false, 
      cashDrawerLogs: updatedLogs
    });
    alert(`Caixa fechado com sucesso!`);
  };

  const [fiadoClients, setFiadoClients] = useState<any[]>(Array.isArray(business.fiadoClients) && business.fiadoClients.length > 0 ? business.fiadoClients : [
    { id: 'F1', name: 'João Amaral',    phone: '+351 912 001 001', balance: -45.50, lastVisit: '2026-04-20' },
    { id: 'F2', name: 'Sofia Matos',   phone: '+351 913 002 002', balance: 20.00,  lastVisit: '2026-04-24' },
    { id: 'F3', name: 'Pedro Ávila',   phone: '+351 914 003 003', balance: -12.00, lastVisit: '2026-04-18' },
    { id: 'F4', name: 'Luisa Correia', phone: '+351 915 004 004', balance: 5.00,   lastVisit: '2026-04-25' },
  ]);

  const saveStaff = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    const formData = new FormData(form);
    const newMember = {
      id: editingStaff?.id || 'STF_' + Date.now(),
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      phone: formData.get('phone') as string,
      role: formData.get('role') as any,
    };

    let updatedStaff;
    if (editingStaff) {
      updatedStaff = staff.map(s => s.id === editingStaff.id ? newMember : s);
    } else {
      updatedStaff = [...staff, newMember];
    }

    setStaff(updatedStaff);
    handleUpdate({ staff: updatedStaff });
    setEditingStaff(null);
    setShowAddStaff(false);
  };

  const removeStaff = (id: string) => {
    if (window.confirm("Tem certeza que deseja remover este funcionário?")) {
      const updatedStaff = staff.filter(s => s.id !== id);
      setStaff(updatedStaff);
      handleUpdate({ staff: updatedStaff });
    }
  };

  const toggleStaffDuty = (staffId: string) => {
    const updatedStaff = staff.map(m => {
      if (m.id === staffId) {
        const isNowOnDuty = !m.onDuty;
        const newLogs = [...(m.attendanceLogs || [])];
        if (isNowOnDuty) {
          // Clock In
          newLogs.push({
            date: new Date().toLocaleDateString('pt-PT'),
            clockIn: new Date().toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' })
          });
        } else {
          // Clock Out
          if (newLogs.length > 0) {
            const lastLog = { ...newLogs[newLogs.length - 1] };
            if (!lastLog.clockOut) {
              lastLog.clockOut = new Date().toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' });
              
              // Simple hour calculation
              try {
                const [hIn, mIn] = lastLog.clockIn.split(':').map(Number);
                const [hOut, mOut] = lastLog.clockOut.split(':').map(Number);
                const totalMinutes = (hOut * 60 + mOut) - (hIn * 60 + mIn);
                lastLog.totalHours = parseFloat((totalMinutes / 60).toFixed(2));
              } catch (e) {
                lastLog.totalHours = 0;
              }
              
              newLogs[newLogs.length - 1] = lastLog;
            }
          }
        }
        return { ...m, onDuty: isNowOnDuty, attendanceLogs: newLogs };
      }
      return m;
    });
    setStaff(updatedStaff);
    handleUpdate({ staff: updatedStaff });
  };

  const setStaffVacation = (staffId: string, start: string | null, end: string | null) => {
    const updatedStaff = staff.map(m => 
      m.id === staffId ? { ...m, vacationStart: start || undefined, vacationEnd: end || undefined } : m
    );
    setStaff(updatedStaff);
    handleUpdate({ staff: updatedStaff });
  };

  const saveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    handleUpdate({ ...settingsForm });
    alert('Configurações salvas com sucesso!');
  };

  const lang = language as Language;
  const t = (key: any) => getTranslation(lang, key);

  const pendingCount = reservations.filter(r => r.status === 'pending' || r.status === 'pendente').length;

  const handleUpdate = (updated: Partial<Restaurant>) => {
    onUpdateBusiness({ ...business, ...updated });
  };

  const addTable = () => {
    const newTable: RestaurantTable = {
      id: `T${tables.length + 1}`,
      number: tables.length + 1,
      seats: 4,
      status: 'available'
    };
    setTables([...tables, newTable]);
    handleUpdate({ tables: [...tables, newTable] });
  };

  const assignReservationToTable = (tableId: string) => {
    if (!acceptingReservation) return;

    // 1. Atualizar o estado da mesa
    const updatedTables = tables.map(t => {
      if (t.id === tableId) {
        return {
          ...t,
          status: 'reserved' as const,
          customerName: acceptingReservation.customerName,
          reservationTime: acceptingReservation.time
        };
      }
      return t;
    });

    // 2. Atualizar o estado da reserva
    const updatedReservations = reservations.map(r => {
      if (r.id === acceptingReservation.id) {
        return { ...r, status: 'accepted' as const, tableId };
      }
      return r;
    });

    // 3. Sincronizar tudo
    setTables(updatedTables);
    setReservations(updatedReservations);
    onUpdateBusiness({
      ...business,
      tables: updatedTables,
      reservations: updatedReservations
    });

    // 4. Limpar estado de aceitação
    setAcceptingReservation(null);
    setActiveTab('tables');
    alert('✅ Reserva vinculada à mesa com sucesso!');
  };

  const toggleTableStatus = (id: string) => {
    if (acceptingReservation) {
      assignReservationToTable(id);
      return;
    }

    if (selectedResForTable) {
      const table = tables.find(t => t.id === id);
      if (table && table.status === 'available') {
        handleReservationAction(selectedResForTable.id, 'accepted', id);
        return;
      }
    }

    const table = tables.find(t => t.id === id);
    if (!table) return;

    if (table.status === 'available') {
      setWalkInTableId(id);
      return;
    }

    // Logic to mark reservation as finished when clearing table
    let updatedReservations = [...reservations];
    if (table.status === 'occupied' || table.status === 'reserved') {
      // Find the active reservation for this table
      updatedReservations = reservations.map(r => {
        if (r.tableId === id && (r.status === 'accepted' || r.status === 'occupied')) {
          return { ...r, status: 'finished' as const };
        }
        return r;
      });
      setReservations(updatedReservations);
    }

    const newTables = tables.map(t => {
      if (t.id === id) {
        return { ...t, status: 'available' as const, alertStatus: 'none' as const, currentTab: [], walkInDetails: undefined, customerName: undefined, reservationTime: undefined };
      }
      return t;
    });

    setTables(newTables);
    onUpdateBusiness({
      ...business,
      tables: newTables,
      reservations: updatedReservations
    });
  };

  const handleWalkInSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!walkInTableId) return;
    const formData = new FormData(e.currentTarget);
    const newTables = tables.map(t => {
       if (t.id === walkInTableId) {
          return {
             ...t,
             status: 'occupied' as const,
             customerName: formData.get('name') as string,
             walkInDetails: {
                name: formData.get('name') as string,
                phone: formData.get('phone') as string,
                email: formData.get('email') as string,
                pax: parseInt(formData.get('pax') as string) || 2
             },
             currentTab: [],
             alertStatus: 'none' as const
          };
       }
       return t;
    });
    setTables(newTables);
    handleUpdate({ tables: newTables });
    setWalkInTableId(null);
  };

  const [selectedResForTable, setSelectedResForTable] = useState<Reservation | null>(null);
  const [editingDish, setEditingDish] = useState<{idx: number, dish: Dish} | null>(null);
  const [editingProduct, setEditingProduct] = useState<{idx: number, product: Product} | null>(null);

  const startDishEdit = (idx: number) => {
    setEditingDish({ idx, dish: { ...business.dishes[idx] } });
  };

  const saveDishEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingDish) {
      const newDishes = [...business.dishes];
      newDishes[editingDish.idx] = editingDish.dish;
      handleUpdate({ dishes: newDishes });
      setEditingDish(null);
    }
  };

  const startProductEdit = (idx: number) => {
    setEditingProduct({ idx, product: { ...products[idx] } });
  };

  const saveProductEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      const newProducts = [...products];
      newProducts[editingProduct.idx] = editingProduct.product;
      setProducts(newProducts);
      handleUpdate({ products: newProducts });
      setEditingProduct(null);
    }
  };

  const addDish = () => {
    if (isBeauty || isShop) {
      const newService: Service = { id: `S${Date.now()}`, name: 'Novo Serviço', description: '', price: 0, duration: 30, image: '' };
      const newServices = [...(business.services || []), newService];
      handleUpdate({ services: newServices });
      return;
    }
    const newDish: Dish = { name: 'Novo Prato', description: '', price: 0, image: '' };
    const newDishes = [...business.dishes, newDish];
    handleUpdate({ dishes: newDishes });
  };

  const removeDish = (idx: number) => {
    if (isBeauty || isShop) {
      const newServices = (business.services || []).filter((_, i) => i !== idx);
      handleUpdate({ services: newServices });
      return;
    }
    const newDishes = business.dishes.filter((_, i) => i !== idx);
    handleUpdate({ dishes: newDishes });
  };

  const handleReservationAction = (id: string, action: 'accepted' | 'cancelled', tableId?: string) => {
    if (isBeauty && action === 'accepted') {
      const newReservations = reservations.map(r => 
        r.id === id ? { ...r, status: action, confirmedByRestaurant: true } : r
      );
      setReservations(newReservations);
      handleUpdate({ reservations: newReservations });
      alert("✅ Marcação aprovada com sucesso!");
      return;
    }

    if (action === 'accepted' && !tableId) {
      // Abrir selecionador de mesa
      const res = reservations.find(r => r.id === id);
      if (res) setSelectedResForTable(res);
      return;
    }

    const resObj = reservations.find(r => r.id === id);
    const newReservations = reservations.map(r => 
      r.id === id ? { ...r, status: action, tableId: tableId || r.tableId, confirmedByRestaurant: action === 'accepted' } : r
    );
    setReservations(newReservations);
    
    if (action === 'accepted' && tableId) {
      const newTables = tables.map(t => t.id === tableId ? { ...t, status: 'reserved', customerName: resObj?.customerName, reservationTime: resObj?.time } as const : t);
      setTables(newTables);
      
      const foodItems = resObj?.preOrder || resObj?.preorder;
      let updatedKitchenOrders = [...kitchenOrders];

      // Criar Pedido na Cozinha se houver comida
      if (foodItems && foodItems.length > 0) {
        const newOrder: KitchenOrder = {
          id: `ORD_${Date.now()}`,
          tableId: tableId,
          reservationId: id,
          items: foodItems,
          status: 'pending_admin',
          timestamp: new Date().toISOString()
        };
        updatedKitchenOrders = [...updatedKitchenOrders, newOrder];
        setKitchenOrders(updatedKitchenOrders);
      }
      
      // Notificação Push Removida

      handleUpdate({ 
        tables: newTables, 
        reservations: newReservations, 
        kitchenOrders: updatedKitchenOrders 
      });
      setSelectedResForTable(null);
    } else {
      handleUpdate({ reservations: newReservations });
    }
  };

  const createOrderForReservation = (res: Reservation) => {
    const foodItems = res.preOrder;
    if (!foodItems || foodItems.length === 0) return;

    const newOrder: KitchenOrder = {
      id: `ORD_${Date.now()}`,
      tableId: res.tableId || '?',
      reservationId: res.id,
      items: foodItems,
      status: 'pending_admin',
      timestamp: new Date().toISOString()
    };

    const updatedOrders = [...kitchenOrders, newOrder];
    setKitchenOrders(updatedOrders);
    handleUpdate({ kitchenOrders: updatedOrders });
    alert("✅ Pedido processado com sucesso!");
  };

  // Products Handlers
  const addProduct = () => {
    const newProduct: Product = { 
      id: `P${Date.now()}`, 
      name: 'Novo Produto', 
      description: '', 
      price: 0, 
      category: 'Bebidas', 
      image: '',
      stock: 0,
      minStock: 5,
      purchasePrice: 0,
      supplierId: ''
    };
    const newProducts = [...products, newProduct];
    setProducts(newProducts);
    handleUpdate({ products: newProducts });
    startProductEdit(newProducts.length - 1);
  };

  const updateProduct = (idx: number, field: keyof Product, value: any) => {
    const newProducts = [...products];
    newProducts[idx] = { ...newProducts[idx], [field]: value };
    setProducts(newProducts);
    handleUpdate({ products: newProducts });
  };

  const removeProduct = (idx: number) => {
    const newProducts = products.filter((_, i) => i !== idx);
    setProducts(newProducts);
    handleUpdate({ products: newProducts });
  };

  // Updates Handlers
  const addUpdate = (type: 'news' | 'event') => {
    const newUpdate: RestaurantUpdate = { 
      id: `UPD_${Date.now()}`, 
      type, 
      title: type === 'news' ? 'Nova Publicação' : 'Novo Evento', 
      description: '',
      date: type === 'event' ? new Date().toISOString().split('T')[0] : undefined,
      pricePerPerson: type === 'event' ? 0 : undefined,
      pricePerCouple: type === 'event' ? 0 : undefined
    };
    const newUpdates = [...updates, newUpdate];
    setUpdates(newUpdates);
    handleUpdate({ updates: newUpdates });
    setEditingUpdate({ idx: newUpdates.length - 1, update: newUpdate });
  };

  const saveUpdateEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingUpdate) {
      const newUpdates = [...updates];
      newUpdates[editingUpdate.idx] = editingUpdate.update;
      setUpdates(newUpdates);
      handleUpdate({ updates: newUpdates });
      setEditingUpdate(null);
    }
  };

  const removeUpdate = (idx: number) => {
    const newUpdates = updates.filter((_, i) => i !== idx);
    setUpdates(newUpdates);
    handleUpdate({ updates: newUpdates });
  };

  // Sidebar Variants
  const isExpanded = sidebarOpen || sidebarHovered;

  const sidebarVariants = {
    expanded: { 
      width: 280, 
      transition: { type: 'spring', stiffness: 300, damping: 35 } 
    },
    collapsed: { 
      width: 80, 
      transition: { type: 'spring', stiffness: 300, damping: 35 } 
    },
    mobileOpen: {
      x: 0,
      width: 280,
      transition: { type: 'spring', stiffness: 300, damping: 35 }
    },
    mobileClosed: {
      x: -280,
      width: 0,
      transition: { type: 'spring', stiffness: 300, damping: 35 }
    }
  };

  if (!isDrawerOpen) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white w-full max-w-md rounded-[3rem] p-12 shadow-2xl space-y-8"
        >
          <div className="text-center space-y-2">
            <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-[2rem] flex items-center justify-center mx-auto mb-6">
              <Lock size={40} />
            </div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tighter">Abertura de Caixa</h2>
            <p className="text-slate-500 font-medium italic">Inicie o turno de trabalho</p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Valor Inicial (€)</label>
              <div className="relative">
                <span className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 font-black">€</span>
                <input 
                  type="number" 
                  value={openingAmount}
                  onChange={(e) => setOpeningAmount(e.target.value)}
                  className="w-full h-16 bg-slate-50 border-2 border-slate-100 rounded-2xl px-12 text-2xl font-black focus:border-emerald-500 outline-none transition-all"
                  placeholder="30.00"
                />
              </div>
              <p className="text-[10px] text-slate-400 font-bold text-center mt-2 italic">* Valor mínimo obrigatório de 30.00€</p>
            </div>

            <button 
              onClick={openDrawer}
              className="w-full h-16 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 group"
            >
              <CheckCircle size={18} className="group-hover:scale-110 transition-transform" />
              Confirmar Abertura
            </button>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-center">
            <button onClick={onLogout} className="text-[10px] font-black text-slate-400 hover:text-red-500 uppercase tracking-widest flex items-center gap-2 transition-colors">
              <LogOut size={14} /> Sair do Sistema
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex font-sans overflow-hidden">
      {/* Sidebar Overlay (Mobile) */}
      <AnimatePresence>
        {!sidebarOpen && (
          <button 
            onClick={() => setSidebarOpen(true)}
            className="fixed top-4 left-4 z-40 p-3 bg-slate-900 text-white rounded-full shadow-xl lg:hidden"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside 
        initial="collapsed"
        animate={
          typeof window !== 'undefined' && window.innerWidth < 1024 
            ? (sidebarOpen ? "mobileOpen" : "mobileClosed")
            : (isExpanded ? "expanded" : "collapsed")
        }
        variants={sidebarVariants}
        onHoverStart={() => setSidebarHovered(true)}
        onHoverEnd={() => setSidebarHovered(false)}
        className="h-screen bg-slate-900 text-white flex flex-col fixed lg:sticky top-0 left-0 z-30 shadow-2xl flex-shrink-0 overflow-hidden"
      >
        <div className="p-4 h-24 border-b border-white/10 flex items-center gap-4 overflow-hidden">
           <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-lg shadow-blue-500/20 text-white">
              {isBeauty ? <Scissors size={26} /> : isShop ? <Store size={26} /> : isService ? <Wrench size={26} /> : <Utensils size={32} />}
           </div>
           <AnimatePresence>
             {isExpanded && (
               <motion.div 
                 initial={{ opacity: 0, x: -10 }}
                 animate={{ opacity: 1, x: 0 }}
                 exit={{ opacity: 0, x: -10 }}
                 className="flex-1 overflow-hidden"
               >
                 <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400 opacity-60">Management</h2>
                 <p className="font-black truncate text-sm tracking-tight">{business.name}</p>
               </motion.div>
             )}
           </AnimatePresence>
        </div>

        <div className="px-4 py-2">
          <button 
            onClick={() => onSync(business)}
            className="w-full h-12 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white flex items-center transition-all shadow-lg shadow-emerald-900/20 active:scale-95 group overflow-hidden border border-emerald-400/20"
          >
            <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center">
              <Save size={18} className="group-hover:scale-110 transition-transform" />
            </div>
            <AnimatePresence>
              {isExpanded && (
                <motion.span 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="font-black text-[10px] uppercase tracking-widest"
                >
                  Publicar no Servidor
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto mt-2 custom-scrollbar whitespace-nowrap">
          {([
            { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} />, hideForStaff: true },
            { id: 'tables', label: isBeauty ? 'Agenda / Mapa' : isShop ? 'Mapa da Loja' : 'Mapa de Mesas', icon: isBeauty ? <Calendar size={20} /> : <TableIcon size={20} />, hideForStaff: true, hidden: isShop },
            { id: 'kitchen', label: isBeauty ? 'Monitor de Serviços' : isShop ? 'Monitor de Vendas' : 'Monitor de Cozinha', icon: isShop ? <ShoppingBag size={20} /> : isBeauty ? <Sparkles size={20} /> : <Utensils size={20} />, badge: kitchenOrders.filter(o => o.status === 'preparing' || o.status === 'preparando').length || undefined, hidden: (isBeauty || isShop) && !isStaff },
            { id: 'pos', label: isBeauty ? 'Terminal de Venda' : isShop ? 'Caixa / POS' : 'Terminal POS', icon: <ShoppingBag size={20} /> },
            { id: 'dishes', label: isBeauty ? 'Gestão de Serviços' : isShop ? 'Gestão de Artigos' : 'Gestão de Ementa', icon: isBeauty ? <Sparkles size={18} /> : isShop ? <ShoppingBag size={18} /> : <Utensils size={18} />, hideForStaff: true },
            { id: 'products', label: isShop ? 'Stock / Inventário' : 'Stock de Produtos', icon: <ShoppingBag size={20} />, hideForStaff: true },
            { id: 'updates', label: isShop ? 'Campanhas / Promo' : 'Novidades / Eventos', icon: <Megaphone size={20} />, hideForStaff: true },
            { id: 'reservations', label: isBeauty ? 'Marcações' : 'Reservas', icon: <Calendar size={20} />, badge: pendingCount + kitchenOrders.filter(o => o.status === 'pending_admin').length },
            { id: 'qrcode', label: 'Presenças QR', icon: <QrCode size={20} />, hideForStaff: true },
            { id: 'suppliers', label: 'Fornecedores', icon: <ShoppingBag size={20} />, hideForStaff: true },
          ] as any[]).filter(item => (!isStaff || !item.hideForStaff) && !item.hidden).map(item => (
            <button 
              key={item.id}
              onClick={() => setActiveTab(item.id as DashboardTab)}
              className={`w-full h-12 rounded-2xl flex items-center transition-all duration-300 group relative ${
                activeTab === item.id 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' 
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center">
                 <span className={`${activeTab === item.id ? 'text-white' : 'text-slate-500 group-hover:text-blue-400'}`}>
                   {item.icon}
                 </span>
                 {item.badge && item.badge > 0 && (
                   <span className="absolute top-2 right-2 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-black flex items-center justify-center ring-2 ring-slate-900 animate-pulse">
                     {item.badge}
                   </span>
                 )}
              </div>
              <AnimatePresence>
                {isExpanded && (
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="flex-1 flex items-center justify-between pr-4 overflow-hidden"
                  >
                    <span className="text-sm font-bold tracking-tight whitespace-nowrap">{item.label}</span>
                    {item.badge && (
                      <span className={`text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center animate-bounce shadow-lg ${item.id === 'kitchen' ? 'bg-orange-500 shadow-orange-500/50' : 'bg-red-500 shadow-red-500/50'}`}>
                        {item.badge}
                      </span>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          ))}

          {/* STAFF RESTAURANTE — Flyout Panel */}
          {!isStaff && (
            <div className="relative">
              <button
                onClick={() => setStaffOpen(prev => !prev)}
                className={`w-full h-12 rounded-2xl flex items-center transition-all duration-300 group relative ${
                  ['staff_list','ponto','ferias'].includes(activeTab)
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center">
                  <Users size={20} className={['staff_list','ponto','ferias'].includes(activeTab) ? 'text-white' : 'text-slate-500 group-hover:text-blue-400'} />
                </div>
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}
                      className="flex-1 flex items-center justify-between pr-4 overflow-hidden">
                      <span className="text-sm font-bold tracking-tight">Equipa</span>
                      <ChevronRight size={14} className={`transition-transform duration-300 ${staffOpen ? 'rotate-90' : ''}`} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>

              <AnimatePresence>
                {staffOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setStaffOpen(false)} />
                    <motion.div
                      initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                      className="fixed top-auto left-[84px] z-50 bg-slate-800 border border-white/10 rounded-2xl shadow-2xl shadow-black/40 p-2 min-w-[190px]"
                      style={{ marginTop: '-3rem' }}
                    >
                      <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-0 h-0 border-t-8 border-b-8 border-r-8 border-t-transparent border-b-transparent border-r-slate-800" />
                      <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest px-3 pt-2 pb-1">Equipa Azores4you</p>
                      {([
                        { id: 'staff_list', label: 'Funcionários',      icon: <Users size={15}/> },
                        { id: 'ponto',      label: 'Relógio de Ponto',  icon: <Clock size={15}/> },
                        { id: 'ferias',     label: 'Mapa de Férias',    icon: <Calendar size={15}/> },
                      ] as any[]).map((sub, i) => (
                        <motion.button key={sub.id}
                          initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                          onClick={() => { setActiveTab(sub.id as DashboardTab); setStaffOpen(false); }}
                          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all ${
                            activeTab === sub.id ? 'bg-blue-600 text-white' : 'text-slate-300 hover:text-white hover:bg-white/10'
                          }`}
                        >
                          <span className={activeTab === sub.id ? 'text-white' : 'text-slate-400'}>{sub.icon}</span>
                          <span className="whitespace-nowrap">{sub.label}</span>
                        </motion.button>
                      ))}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* DEFINIÇÕES — Flyout Panel (slides left → right) */}
          {!isStaff && (
            <div className="relative">
              {/* Parent Button */}
              <button
                onClick={() => setSettingsOpen(prev => !prev)}
                className={`w-full h-12 rounded-2xl flex items-center transition-all duration-300 group relative ${
                  ['settings', 'business', 'staff', 'gallery', 'reviews', 'openingHours'].includes(activeTab)
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center">
                  <Settings size={20} className={['settings','business','staff','gallery','reviews','openingHours'].includes(activeTab) ? 'text-white' : 'text-slate-500 group-hover:text-blue-400'} />
                </div>
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="flex-1 flex items-center justify-between pr-4 overflow-hidden"
                    >
                      <span className="text-sm font-bold tracking-tight">Definições</span>
                      <ChevronRight size={14} className={`transition-transform duration-300 ${settingsOpen ? 'rotate-90' : ''}`} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>

              {/* FLYOUT — slides left → right, fixed on screen */}
              <AnimatePresence>
                {settingsOpen && (
                  <>
                    {/* Backdrop to close on outside click */}
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setSettingsOpen(false)}
                    />
                    <motion.div
                      initial={{ opacity: 0, x: -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -16 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                      className="fixed top-auto left-[84px] z-50 bg-slate-800 border border-white/10 rounded-2xl shadow-2xl shadow-black/40 p-2 min-w-[180px] overflow-hidden"
                      style={{ marginTop: '-3rem' }}
                    >
                      {/* Arrow pointer */}
                      <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-0 h-0 border-t-8 border-b-8 border-r-8 border-t-transparent border-b-transparent border-r-slate-800" />

                      <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest px-3 pt-2 pb-1">Definições</p>

                      {([
                        { id: 'business', label: 'Negócio',      icon: <Settings size={15} /> },
                        { id: 'staff',    label: 'Funcionários', icon: <Users size={15} /> },
                        { id: 'gallery',  label: 'Galeria',      icon: <ImageIcon size={15} /> },
                        { id: 'reviews',  label: 'Avaliações',   icon: <Star size={15} />, badge: ratedReservations.length > 0 ? ratedReservations.length : undefined },
                      ] as any[]).map((sub, i) => (
                        <motion.button
                          key={sub.id}
                          initial={{ opacity: 0, x: -12 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.05 }}
                          onClick={() => { setActiveTab(sub.id as DashboardTab); setSettingsOpen(false); }}
                          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all ${
                            activeTab === sub.id
                              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                              : 'text-slate-300 hover:text-white hover:bg-white/10'
                          }`}
                        >
                          <span className={activeTab === sub.id ? 'text-white' : 'text-slate-400'}>{sub.icon}</span>
                          <span className="tracking-tight whitespace-nowrap">{sub.label}</span>
                          {sub.badge && sub.badge > 0 && (
                            <span className="ml-auto w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-black flex items-center justify-center">{sub.badge}</span>
                          )}
                        </motion.button>
                      ))}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          )}
        </nav>

        {/* FECHAR CAIXA */}
        {!isStaff && isDrawerOpen && (
          <div className="px-4 pb-4">
            <button 
              onClick={closeDrawer}
              className="w-full h-12 rounded-2xl flex items-center transition-all duration-300 group relative text-red-400 hover:text-white hover:bg-red-500 shadow-lg shadow-red-900/10 border border-red-500/20"
            >
              <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center">
                <Lock size={18} className="text-red-500 group-hover:text-white" />
              </div>
              <AnimatePresence>
                {isExpanded && (
                  <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="flex-1 pr-4 overflow-hidden text-left">
                    <span className="text-[10px] font-black uppercase tracking-widest">Fechar Caixa</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </div>
        )}

        <div className="p-4 border-t border-white/10 overflow-hidden">
          <button 
            onClick={onLogout} 
            className={`w-full flex items-center h-12 rounded-2xl transition-all ${
              isExpanded ? 'justify-start gap-4 px-4' : 'justify-center'
            } text-red-400 hover:text-white hover:bg-red-500/20`}
          >
             <LogOut className="w-5 h-5 flex-shrink-0" /> 
             {isExpanded && <span className="font-black text-sm tracking-widest uppercase truncate">{t('nav_logout')}</span>}
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 min-h-screen overflow-y-auto bg-white flex flex-col relative">
        <header className="sticky top-0 bg-white/90 backdrop-blur-md z-20 px-8 py-6 border-b border-slate-100 flex justify-between items-center h-24">
           <div className="flex items-center gap-4">
              <button 
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-3 bg-slate-900 text-white rounded-2xl shadow-xl hover:scale-105 active:scale-95 transition-all mr-2"
              >
                <LayoutDashboard className="w-5 h-5" />
              </button>
              <div className="hidden lg:block overflow-hidden max-w-xs">
                <h1 className="text-xl font-black text-slate-800 tracking-tighter uppercase truncate w-48">
                   {business.name}
                </h1>
                <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em] font-mono opacity-60">
                   {business.island}
                </p>
              </div>
           </div>

           {/* Central Clock */}
           <div className="flex flex-col items-center">
              <p className="text-4xl font-black text-slate-900 tracking-tighter tabular-nums">
                 {currentTime.toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </p>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                 {currentTime.toLocaleDateString('pt-PT', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
           </div>
           <div className="flex items-center gap-4">
              <button 
                onClick={() => onSync(business)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-2xl border border-blue-100 hover:bg-blue-100 transition-all active:scale-95 group"
                title="Atualizar dados agora"
              >
                <RefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
                <span className="text-[10px] font-black uppercase tracking-widest">Sincronizar</span>
              </button>
              <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-2xl border border-slate-100">
                 <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Live System</span>
              </div>
           </div>
        </header>

        <div className="p-8 pb-32">
          {activeTab === 'tables' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
               {isBeauty ? (
                 <div className="space-y-6">
                   <div className="flex justify-between items-center bg-slate-50 p-6 rounded-[2.5rem] border border-slate-100">
                     <div className="flex items-center gap-4">
                       <button 
                         onClick={() => {
                           const d = new Date(selectedDate);
                           d.setDate(d.getDate() - 7);
                           setSelectedDate(d);
                         }}
                         className="p-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-100 transition-all"
                       >
                         <ChevronRight className="rotate-180 w-4 h-4" />
                       </button>
                       <div>
                         <h3 className="text-xl font-black text-slate-800 uppercase tracking-tighter">Agenda Semanal</h3>
                         <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-1">
                           Semana de {(() => {
                             const d = new Date(selectedDate);
                             const day = d.getDay() || 7;
                             d.setDate(d.getDate() - day + 1);
                             return d.toLocaleDateString('pt-PT', { day: '2-digit', month: 'long' });
                           })()}
                         </p>
                       </div>
                       <button 
                         onClick={() => {
                           const d = new Date(selectedDate);
                           d.setDate(d.getDate() + 7);
                           setSelectedDate(d);
                         }}
                         className="p-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-100 transition-all"
                       >
                         <ChevronRight className="w-4 h-4" />
                       </button>
                     </div>
                     <div className="flex gap-4">
                       <div className="flex items-center gap-2">
                         <div className="w-3 h-3 rounded-full bg-blue-600"></div>
                         <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Ocupado</span>
                       </div>
                       <div className="flex items-center gap-2">
                         <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                         <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Livre</span>
                       </div>
                     </div>
                   </div>

                   <div className="bg-white border border-slate-100 rounded-[3rem] p-8 shadow-sm overflow-x-auto">
                     <div className="min-w-[800px]">
                        <div className="grid grid-cols-8 gap-4 mb-6 border-b border-slate-50 pb-4">
                          <div className="col-span-1"></div>
                          {['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'].map((dia, i) => {
                            const d = new Date(selectedDate);
                            const currentDay = d.getDay() || 7;
                            d.setDate(d.getDate() - currentDay + 1 + i);
                            return (
                              <div key={i} className="text-center">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{dia}</p>
                                <p className={`text-lg font-black ${d.toDateString() === new Date().toDateString() ? 'text-blue-600' : 'text-slate-800'}`}>
                                  {d.getDate()}
                                </p>
                              </div>
                            );
                          })}
                        </div>

                        <div className="space-y-1">
                          {(() => {
                            const slots = [];
                            const hours = (business.openingHours || '09:00-19:00').split('-').map(h => parseInt(h.split(':')[0]));
                            const start = hours[0] || 9;
                            const end = hours[1] || 19;
                            
                            for (let h = start; h < end; h++) {
                              for (let m of ['00', '30']) {
                                const time = `${String(h).padStart(2, '0')}:${m}`;
                                slots.push(
                                  <div key={time} className="grid grid-cols-8 gap-4 items-center group">
                                    <div className="text-[10px] font-black text-slate-300 group-hover:text-slate-500 text-right pr-4 py-2 transition-colors">{time}</div>
                                    {[0, 1, 2, 3, 4, 5, 6].map(i => {
                                      const d = new Date(selectedDate);
                                      const currentDay = d.getDay() || 7;
                                      d.setDate(d.getDate() - currentDay + 1 + i);
                                      const dateStr = d.toISOString().split('T')[0];
                                      
                                      // Check if there's an accepted reservation for this day and time
                                      const res = reservations.find(r => 
                                        r.status === 'accepted' && 
                                        r.time === time && 
                                        (r.date === dateStr || (r.date.includes('/') && r.date.split('/').reverse().join('-') === dateStr))
                                      );

                                      return (
                                        <div 
                                          key={i} 
                                          className={`h-10 rounded-lg border transition-all flex items-center justify-center cursor-pointer relative overflow-hidden group/slot ${
                                            res ? 'bg-blue-600 border-blue-500 shadow-lg shadow-blue-600/20' : 'bg-emerald-50/30 border-emerald-100/50 hover:bg-emerald-50 hover:border-emerald-200'
                                          }`}
                                          title={res ? `Reservado para: ${res.customerName}` : 'Disponível'}
                                        >
                                          {res && (
                                            <div className="absolute inset-0 flex items-center justify-center">
                                              <span className="text-[8px] font-black text-white/20 uppercase truncate px-1">{res.customerName.split(' ')[0]}</span>
                                            </div>
                                          )}
                                        </div>
                                      );
                                    })}
                                  </div>
                                );
                              }
                            }
                            return slots;
                          })()}
                        </div>
                     </div>
                   </div>
                 </div>
               ) : (
                 <>
                   {acceptingReservation && (
                     <motion.div 
                       initial={{ opacity: 0, scale: 0.9 }}
                       animate={{ opacity: 1, scale: 1 }}
                       className="bg-emerald-600 text-white p-6 rounded-[2.5rem] shadow-2xl shadow-emerald-600/30 flex items-center justify-between border-2 border-emerald-400"
                     >
                       <div className="flex items-center gap-4">
                         <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center animate-pulse">
                           <CheckCircle className="text-white" />
                         </div>
                         <div>
                           <p className="font-black text-xl tracking-tighter uppercase">Modo de Atribuição</p>
                           <p className="text-sm opacity-80 font-bold italic">Selecione uma mesa livre para {acceptingReservation.customerName}</p>
                         </div>
                       </div>
                       <button 
                         onClick={() => setAcceptingReservation(null)}
                         className="px-6 py-3 bg-white/20 hover:bg-white/30 rounded-xl text-xs font-black uppercase tracking-widest transition-all"
                       >
                         Cancelar
                       </button>
                     </motion.div>
                   )}

                   <div className="flex justify-between items-center bg-slate-50 p-6 rounded-[2.5rem] border border-slate-100 mb-8">
                      <div className="flex gap-8">
                        <div className="flex items-center gap-2">
                           <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                           <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Disponível</span>
                        </div>
                        <div className="flex items-center gap-2">
                           <div className="w-3 h-3 rounded-full bg-slate-900"></div>
                           <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Ocupada</span>
                        </div>
                        <div className="flex items-center gap-2">
                           <div className="w-3 h-3 rounded-full bg-blue-600"></div>
                           <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Reservada</span>
                        </div>
                      </div>
                      <button onClick={addTable} className="px-6 py-2 bg-white text-slate-900 border border-slate-200 rounded-xl font-bold flex items-center gap-2 hover:bg-slate-50 transition-all shadow-sm">
                        <Plus className="w-4 h-4" /> Nova Mesa
                      </button>
                   </div>

                   <div className="bg-slate-50 border border-slate-100 rounded-[3rem] p-12 min-h-[600px] shadow-inner flex items-center justify-center relative overflow-hidden">
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-12 w-full max-w-4xl">
                         {tables.map(table => (
                           <motion.div 
                             key={table.id}
                             whileHover={{ scale: 1.05 }}
                             className="relative"
                           >
                              <motion.button 
                                whileTap={{ scale: 0.9 }}
                                onClick={() => toggleTableStatus(table.id)}
                                className={`aspect-square w-full rounded-[2.5rem] p-6 flex flex-col items-center justify-center transition-all duration-500 shadow-xl relative group ${
                                  acceptingReservation ? (table.status === 'available' ? 'bg-emerald-50 border-4 border-emerald-500 scale-110 shadow-emerald-500/20' : 'bg-slate-50 opacity-40 grayscale pointer-events-none') :
                                  selectedResForTable ? (table.status === 'available' ? 'bg-emerald-50 border-emerald-200 ring-2 ring-emerald-500' : 'bg-slate-50 opacity-40 grayscale pointer-events-none') :
                                  table.status === 'available' ? 'bg-white text-slate-800 border-2 border-slate-100' :
                                  table.status === 'occupied' ? 'bg-slate-900 text-white' : 'bg-blue-600 text-white'
                                }`}
                              >
                                 <TableIcon className={`w-10 h-10 mb-2 ${table.status === 'available' ? 'text-blue-500' : 'text-white/40'}`} />
                                 <span className="font-black text-2xl tracking-tighter">#{table.number}</span>
                                 <div className="flex gap-1 mt-2">
                                    {Array.from({ length: table.seats }).map((_, i) => (
                                      <div key={i} className="w-2 h-2 rounded-full bg-current opacity-20"></div>
                                    ))}
                                 </div>
                                 
                                 {/* Hover Info Tooltip */}
                                 {table.status !== 'available' && (
                                   <div className="absolute inset-0 z-20 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900/95 rounded-[2.5rem] flex flex-col items-center justify-center p-4 text-center pointer-events-none">
                                      <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">
                                         {table.status === 'occupied' ? 'Ocupada por' : 'Reservada para'}
                                      </p>
                                      <p className="text-sm font-bold text-white mb-1 truncate w-full px-2">{table.customerName || 'Cliente'}</p>
                                      <p className="text-xs font-black text-white/50">{table.reservationTime || '--:--'}</p>
                                      
                                      {table.status === 'occupied' && table.currentTab && table.currentTab.length > 0 && (
                                         <div className="mt-2 w-full text-left bg-white/5 rounded-xl p-2 max-h-16 overflow-y-hidden">
                                            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1 border-b border-white/10 pb-1">Consumo Atual</p>
                                            {table.currentTab.slice(0, 2).map((item, i) => (
                                               <div key={i} className="flex justify-between text-[9px] text-white/80">
                                                  <span className="truncate pr-1">{item.quantity}x {item.dish.name}</span>
                                                  <span>€{(Number(item.dish.price || 0) * item.quantity).toFixed(2)}</span>
                                               </div>
                                            ))}
                                            {table.currentTab.length > 2 && <p className="text-[8px] text-blue-400 font-bold mt-1">+{table.currentTab.length - 2} itens...</p>}
                                         </div>
                                      )}
                                      
                                      {table.status === 'occupied' && (!table.currentTab || table.currentTab.length === 0) && (
                                         <div className="mt-2 text-[10px] font-black px-2 py-1 bg-white/10 rounded-lg text-white">
                                            Pedido: {table.currentOrderId ? 'Enviado 👨‍🍳' : 'Não enviado ⏳'}
                                         </div>
                                      )}
                                   </div>
                                 )}

                                 <div className={`absolute -top-3 -right-3 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl ring-4 ring-white z-10 ${
                                   table.status === 'available' ? 'bg-emerald-500 text-white' :
                                   table.status === 'occupied' ? 'bg-red-500 text-white' : 'bg-amber-400 text-slate-900'
                                 }`}>
                                   {selectedResForTable && table.status === 'available' ? 'Selec.' : table.status === 'available' ? 'Livre' : table.status === 'occupied' ? (isBeauty ? 'Em Serviço' : 'Em uso') : (isBeauty ? 'Marcada' : 'Reservada')}
                                 </div>
                              </motion.button>
                           </motion.div>
                         ))}
                      </div>
                   </div>
                 </>
               )}
            </motion.div>
          )}

          {activeTab === 'kitchen' && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-10">
               {/* Kitchen Header Info */}
               <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                  <div>
                    <h3 className="text-3xl font-black text-slate-800 tracking-tighter uppercase">Monitor de Cozinha</h3>
                    <p className="text-slate-400 font-bold text-sm flex items-center gap-2 mt-1">
                      <Clock size={16} className="text-blue-500" /> Tempo Real • {kitchenOrders.length} Pedidos Ativos
                    </p>
                  </div>
                  <div className="flex gap-4">
                     <div className="bg-orange-50 px-6 py-3 rounded-2xl border border-orange-100 flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-orange-500 animate-pulse"></div>
                        <span className="text-xs font-black text-orange-700 uppercase tracking-widest">A Preparar: {kitchenOrders.filter(o => o.status === 'preparing' || o.status === 'preparando').length}</span>
                     </div>
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    { id: 'pending', label: 'Pendentes', emoji: '📥', color: 'blue' },
                    { id: 'preparing', label: 'Fogo / Preparação', emoji: '🔥', color: 'orange' },
                    { id: 'ready', label: 'Pronto para Servir', emoji: '🔔', color: 'emerald' },
                    { id: 'delivered', label: 'Concluídos', emoji: '✅', color: 'slate' }
                  ].map(statusGroup => (
                    <div key={statusGroup.id} className="bg-slate-50/50 rounded-[2.5rem] p-6 border border-slate-100 flex flex-col min-h-[500px]">
                       <div className="flex justify-between items-center mb-6 px-2">
                          <h4 className="font-black text-slate-400 uppercase text-[10px] tracking-[0.2em] flex items-center gap-2">
                             {statusGroup.emoji} {statusGroup.label}
                          </h4>
                          <span className={`bg-${statusGroup.color}-500 text-white px-3 py-1 rounded-full text-[10px] font-black shadow-lg shadow-${statusGroup.color}-500/20`}>
                             {kitchenOrders.filter(o => 
                               o.status === statusGroup.id || 
                               (statusGroup.id === 'preparing' && o.status === 'preparando') ||
                               (statusGroup.id === 'pending' && o.status === 'waiting_confirmation')
                             ).length}
                          </span>
                       </div>

                       <div className="space-y-4 flex-1">
                          <AnimatePresence mode="popLayout">
                            {kitchenOrders
                              .filter(o => 
                                o.status === statusGroup.id || 
                                (statusGroup.id === 'preparing' && o.status === 'preparando') ||
                                (statusGroup.id === 'pending' && o.status === 'waiting_confirmation')
                              )
                              .map((order, idx) => (
                              <motion.div 
                                layout
                                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.8, x: 20 }}
                                key={order.id} 
                                className={`bg-white p-5 rounded-3xl shadow-sm border-2 ${statusGroup.id === 'preparing' ? 'border-orange-200 ring-4 ring-orange-50' : 'border-transparent'} group hover:shadow-xl transition-all duration-300`}
                              >
                                 <div className="flex justify-between items-start mb-4">
                                    <div>
                                       <p className="font-black text-xl text-slate-800 tracking-tighter">Mesa #{tables.find(t => t.id === order.tableId)?.number || '??'}</p>
                                       <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-0.5">#{order.id.slice(-4)}</p>
                                    </div>
                                    <div className="text-right">
                                       <p className="text-xs font-black text-blue-600 bg-blue-50 px-2 py-1 rounded-lg">
                                          {new Date(order.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                       </p>
                                    </div>
                                 </div>

                                 <div className="space-y-3 mb-6 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                    {order.requestedPrepTime && (
                                       <div className={`mb-3 p-2 rounded-xl text-center text-[10px] font-black uppercase tracking-widest ${order.requestedPrepTime === 'now' ? 'bg-emerald-500 text-white animate-pulse' : 'bg-blue-600 text-white'}`}>
                                          {order.requestedPrepTime === 'now' ? '🚀 Preparar Imediatamente' : `⏰ Iniciar em ${order.requestedPrepTime} min`}
                                       </div>
                                    )}
                                    {order.items.map((item, i) => (
                                      <div key={i} className="flex justify-between items-center">
                                         <div className="flex items-center gap-3">
                                            <span className="w-6 h-6 bg-slate-900 text-white rounded-lg flex items-center justify-center text-[10px] font-black">{item.quantity}x</span>
                                            <div className="flex flex-col">
                                               <span className="text-sm font-bold text-slate-700 tracking-tight">{item.dish.name}</span>
                                               {item.meatPoint && <span className="text-[9px] font-black text-blue-500 uppercase tracking-widest">Ponto: {item.meatPoint}</span>}
                                            </div>
                                         </div>
                                      </div>
                                    ))}
                                 </div>

                                 {statusGroup.id !== 'delivered' && (
                                   <button 
                                     onClick={() => {
                                        const nextStatus = statusGroup.id === 'pending' ? 'preparing' : statusGroup.id === 'preparing' ? 'ready' : 'delivered';
                                        const updatedOrders = kitchenOrders.map(o => o.id === order.id ? {...o, status: nextStatus} : o);
                                        setKitchenOrders(updatedOrders);
                                        handleUpdate({ kitchenOrders: updatedOrders });
                                     }}
                                     className={`w-full py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2 ${
                                       statusGroup.id === 'pending' ? 'bg-orange-500 text-white shadow-orange-500/20 hover:bg-orange-600' :
                                       statusGroup.id === 'preparing' ? 'bg-emerald-500 text-white shadow-emerald-500/20 hover:bg-emerald-600' :
                                       'bg-slate-900 text-white hover:bg-black'
                                     }`}
                                   >
                                      {statusGroup.id === 'pending' ? 'Começar a Preparar' : statusGroup.id === 'preparing' ? 'Marcar como Pronto' : 'Entregar Pedido'}
                                      <ArrowRight size={14} />
                                   </button>
                                 )}
                              </motion.div>
                            ))}
                          </AnimatePresence>
                          
                          {kitchenOrders.filter(o => o.status === statusGroup.id || (statusGroup.id === 'preparing' && o.status === 'preparando')).length === 0 && (
                            <div className="flex-1 flex flex-col items-center justify-center py-10 opacity-20 grayscale">
                               <div className="text-4xl mb-2">{statusGroup.emoji}</div>
                               <p className="text-[10px] font-black uppercase tracking-widest">Sem pedidos</p>
                            </div>
                          )}
                       </div>
                    </div>
                  ))}
               </div>
            </motion.div>
          )}

          {activeTab === 'pos' && (() => {
            // POS-local state via closures — we use component-level state declared below
            const posProducts = [
              ...(isBeauty ? (business.services || []).map(s => ({ ...s, category: (s as any).category || 'Estética' })) : (business.dishes || []).map(d => ({ ...d, id: d.id || d.name, category: d.category || 'Ementa' }))),
              ...(products || []).map(p => ({ ...p })),
              ...(isBeauty ? MOCK_BEAUTY_SERVICES.filter(ms => 
                !(business.services || []).some(s => s.name === ms.name) &&
                !(products || []).some(p => p.name === ms.name)
              ) : isShop ? [] : MOCK_POS_PRODUCTS.filter(mp => 
                !(business.dishes || []).some(d => d.name === mp.name) &&
                !(products || []).some(p => p.name === mp.name)
              ))
            ];
            
            // Set initial category if not set or invalid for current business
            const availableCategories = isBeauty ? BEAUTY_POS_CATEGORIES : isShop ? SHOP_POS_CATEGORIES : POS_CATEGORIES;
            const currentCategories = Array.from(new Set(posProducts.map(p => p.category)));
            const allCats = [...new Set([...availableCategories, ...currentCategories])].filter(cat => isBeauty ? BEAUTY_POS_CATEGORIES.includes(cat) : isShop ? SHOP_POS_CATEGORIES.includes(cat) : true);

            const filtered = posProducts.filter(p => p.category === posCategory);

            return (
              <>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col h-[calc(100vh-160px)] gap-0 -m-8">
                {/* POS Header Bar */}
                <div className="bg-slate-900 text-white px-6 py-3 flex items-center justify-between flex-shrink-0">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center">
                      {isBeauty ? <Scissors size={16} /> : <ShoppingBag size={16} />}
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{isBeauty ? 'Salon POS Terminal' : 'Retail POS Terminal'}</p>
                      <p className="font-black text-sm">{business.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{currentTime.toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' })}</p>
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                  </div>
                </div>
                <div className="flex flex-1 min-h-0">
                  {/* LEFT: Categories */}
                  <div className="w-28 bg-slate-800 flex flex-col py-3 gap-1 px-2 flex-shrink-0 overflow-y-auto custom-scrollbar">
                        {allCats.map(cat => (
                          <button
                            key={cat}
                            onClick={() => setPosCategory(cat)}
                            className={`w-full py-3 px-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all text-center ${
                              posCategory === cat ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' : 'text-slate-400 hover:text-white hover:bg-white/10'
                            }`}
                          >
                        {isBeauty ? (
                          cat === 'Cabelo' ? '💇‍♀️' : cat === 'Unhas' ? '💅' : cat === 'Estética' ? '✨' : cat === 'Massagem' ? '💆‍♀️' : cat === 'Maquilhagem' ? '💄' : cat === 'Sobrancelhas' ? '👁️' : cat === 'Depilação' ? '🧴' : cat === 'Barba' ? '🧔' : cat === 'Produtos' ? '🛍️' : '✨'
                        ) : isShop ? (
                          cat === 'Vestuário' ? '👕' : cat === 'Calçado' ? '👟' : cat === 'Acessórios' ? '⌚' : cat === 'Eletrónica' ? '💻' : cat === 'Casa' ? '🏠' : cat === 'Promoções' ? '🏷️' : '📦'
                        ) : (
                          cat === 'Bebidas' ? '🍺' : cat === 'Vinhos' ? '🍷' : cat === 'Sobremesas' ? '🍰' : cat === 'Pratos' ? '🍽️' : cat === 'Ementa' ? '📋' : cat === 'Entradas' ? '🥗' : cat === 'Sopas' ? '🍲' : cat === 'Gelados' ? '🍦' : cat === 'Bolos' ? '🎂' : cat === 'Aperitivos' ? '🥂' : cat === 'Cafetaria' ? '☕' : '📦'
                        )}
                        <br/>
                        <span className="truncate block">{cat}</span>
                      </button>
                    ))}
                  </div>
                  {/* MIDDLE: Products Grid */}
                  <div className="flex-1 bg-slate-50 overflow-y-auto custom-scrollbar p-4">
                    <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3">
                      {filtered.map((product) => (
                        <motion.button
                          key={product.id}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => addToPosCart(product as Product)}
                          className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-0.5 transition-all text-left flex flex-col group relative"
                        >
                          <div className="h-24 bg-gradient-to-br from-slate-100 to-slate-50 relative overflow-hidden">
                            {product.image ? (
                              <img src={product.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-4xl">
                                {isBeauty ? (
                                  product.category === 'Cabelo' ? '💇‍♀️' : product.category === 'Unhas' ? '💅' : product.category === 'Estética' ? '✨' : product.category === 'Massagem' ? '💆‍♀️' : '✨'
                                ) : (
                                  product.category === 'Vinhos' ? '🍷' : product.category === 'Bebidas' ? '🍺' : product.category === 'Sobremesas' ? '🍰' : product.category === 'Gelados' ? '🍦' : product.category === 'Sopas' ? '🍲' : product.category === 'Bolos' ? '🎂' : product.category === 'Aperitivos' ? '🥂' : product.category === 'Cafetaria' ? '☕' : '🍽️'
                                )}
                              </div>
                            )}
                            <div className="absolute top-1 right-1 w-6 h-6 bg-blue-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <Plus size={12} />
                            </div>
                          </div>
                          <div className="p-3 flex-1">
                            <p className="font-black text-slate-800 text-xs leading-tight truncate mb-1">{product.name}</p>
                            <p className="font-black text-blue-600 text-sm">€{(Number(product.price) || 0).toFixed(2)}</p>
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* RIGHT: Ticket / Cart */}
                  <div className="w-80 bg-slate-900 text-white flex flex-col flex-shrink-0 shadow-2xl">
                    {/* Ticket Header */}
                    <div className="px-6 pt-5 pb-3 border-b border-white/10">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <Receipt size={16} className="text-blue-400" />
                          <span className="font-black text-sm tracking-tight">Ticket</span>
                        </div>
                        {posCart.length > 0 && (
                          <button onClick={() => setPosCart([])} className="text-[10px] font-black text-red-400 hover:text-red-300 uppercase tracking-widest">Limpar</button>
                        )}
                      </div>
                      <p className="text-[9px] text-slate-500 font-bold">#{Math.floor(Date.now() / 1000).toString().slice(-6)}</p>
                    </div>

                    {/* Items */}
                    <div className="flex-1 overflow-y-auto custom-scrollbar px-4 py-3 space-y-2">
                      {posCart.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full opacity-20 py-12">
                          <ShoppingBag size={40} className="mb-3" />
                          <p className="text-[10px] font-black uppercase tracking-widest">Sem itens</p>
                        </div>
                      ) : posCart.map((item) => (
                        <motion.div
                          key={item.product.id}
                          initial={{ opacity: 0, x: 20 }}
                           animate={{ opacity: 1, x: 0 }}
                          className="flex items-center gap-2 py-2 border-b border-white/5 group"
                        >
                          <div className="flex items-center gap-1 bg-white/10 rounded-lg">
                            <button onClick={() => updatePosQuantity(item.product.id, -1)} className="w-6 h-6 flex items-center justify-center text-slate-300 hover:text-white font-black">−</button>
                            <span className="text-xs font-black w-4 text-center">{item.quantity}</span>
                            <button onClick={() => updatePosQuantity(item.product.id, 1)} className="w-6 h-6 flex items-center justify-center text-slate-300 hover:text-white font-black">+</button>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold truncate">{item.product.name}</p>
                            <p className="text-[10px] text-slate-400">€{item.product.price.toFixed(2)}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <p className="text-xs font-black text-blue-400">€{(item.product.price * item.quantity).toFixed(2)}</p>
                            <button onClick={() => removeFromPosCart(item.product.id)} className="opacity-0 group-hover:opacity-100 transition-opacity text-red-400 hover:text-red-300"><X size={12}/></button>
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    {/* Total + Actions */}
                    <div className="px-6 pb-6 pt-4 border-t border-white/10 space-y-3 flex-shrink-0">
                      {/* Subtotal lines */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-[10px] text-slate-500 font-bold">
                          <span>Subtotal ({posCart.reduce((a,i) => a + i.quantity, 0)} items)</span>
                          <span>€{posTotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-[10px] text-slate-500 font-bold">
                          <span>IVA Açores (16%)</span>
                          <span>€{(posTotal * 0.16).toFixed(2)}</span>
                        </div>
                      </div>

                      {/* Total */}
                      <div className="flex justify-between items-end py-2 border-t border-white/10">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total</span>
                        <span className="text-3xl font-black text-blue-400 tracking-tighter">€{posTotal.toFixed(2)}</span>
                      </div>

                      {/* Split Bill */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 bg-white/5 rounded-xl px-3 py-2">
                          <Users size={14} className="text-slate-400 flex-shrink-0" />
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex-1">Dividir conta</span>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setPosSplitBy(prev => Math.max(1, prev - 1))}
                              className="w-7 h-7 bg-white/10 rounded-lg text-sm font-black hover:bg-white/20 flex items-center justify-center transition-colors"
                            >−</button>
                            <span className="text-base font-black w-6 text-center text-white">{posSplitBy}</span>
                            <button
                              onClick={() => setPosSplitBy(prev => Math.min(20, prev + 1))}
                              className="w-7 h-7 bg-white/10 rounded-lg text-sm font-black hover:bg-white/20 flex items-center justify-center transition-colors"
                            >+</button>
                          </div>
                          <span className="text-[10px] font-black text-slate-500 ml-1">{posSplitBy === 1 ? 'pessoa' : 'pessoas'}</span>
                        </div>
                        {posSplitBy > 1 && (
                          <div className="bg-emerald-900/40 border border-emerald-500/30 rounded-xl px-3 py-2.5 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-lg">👤</span>
                              <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Cada pessoa paga</span>
                            </div>
                            <span className="text-2xl font-black text-emerald-400 tracking-tighter">€{(posTotal / posSplitBy).toFixed(2)}</span>
                          </div>
                        )}
                      </div>

                      {/* Payment Buttons */}
                      <div className="grid grid-cols-2 gap-2">
                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          disabled={posCart.length === 0}
                          onClick={() => setPosPaymentModal('cash')}
                          className="py-3.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-emerald-600/20 transition-all flex flex-col items-center gap-1"
                        >
                          <span className="text-lg">💵</span>
                          Dinheiro
                        </motion.button>
                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          disabled={posCart.length === 0}
                          onClick={() => setPosPaymentModal('card')}
                          className="py-3.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-blue-600/20 transition-all flex flex-col items-center gap-1"
                        >
                          <span className="text-lg">💳</span>
                          Cartão
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

                {/* NIF + Payment Modal */}
                <AnimatePresence>
                  {posPaymentModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                      <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                        className="bg-slate-900 text-white rounded-[2.5rem] shadow-2xl w-full max-w-sm overflow-hidden border border-white/10"
                      >
                        {/* Modal Header */}
                        <div className="p-6 border-b border-white/10 flex items-center justify-between">
                          <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{posPaymentModal === 'cash' ? '💵 Pagamento em Dinheiro' : '💳 Pagamento por Cartão'}</p>
                            <p className="text-2xl font-black text-blue-400 mt-1">€{posTotal.toFixed(2)}</p>
                            {posSplitBy > 1 && <p className="text-xs text-slate-400 font-bold">({posSplitBy} pessoas × €{(posTotal/posSplitBy).toFixed(2)})</p>}
                          </div>
                          <button 
                            onClick={() => { setPosPaymentModal(null); setPosNif(''); }} 
                            className="p-3 bg-white text-slate-800 hover:bg-blue-600 hover:text-white rounded-full transition-all shadow-lg border border-slate-100 group"
                          >
                            <X size={20} className="group-active:scale-90 transition-transform" />
                          </button>
                        </div>

                        {/* NIF Optional */}
                        <div className="p-6 space-y-4">
                          <div>
                            <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                              <Receipt size={12} /> NIF para Fatura (opcional)
                            </label>
                            <input
                              type="text"
                              maxLength={9}
                              value={posNif}
                              onChange={e => setPosNif(e.target.value.replace(/\D/g,''))}
                              placeholder="Ex: 123456789"
                              className="w-full bg-white/10 border border-white/20 rounded-2xl p-4 font-black text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 outline-none text-lg tracking-widest"
                            />
                            {posNif.length === 9 && <p className="text-[10px] text-emerald-400 font-bold mt-1 ml-2">✓ NIF válido — fatura será emitida</p>}
                            {posNif.length > 0 && posNif.length < 9 && <p className="text-[10px] text-amber-400 font-bold mt-1 ml-2">{9 - posNif.length} dígitos em falta</p>}
                          </div>

                          {posPaymentModal === 'cash' && (
                            <div className="bg-white/5 rounded-2xl p-4">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Valor Recebido (€)</label>
                              <input
                                type="number"
                                step="0.01"
                                value={posCashReceived}
                                onChange={e => setPosCashReceived(e.target.value)}
                                placeholder="0.00"
                                className="w-full bg-transparent text-3xl font-black text-white focus:outline-none tracking-tight"
                              />
                              {parseFloat(posCashReceived) >= posTotal && (
                                <div className="mt-3 pt-3 border-t border-white/10">
                                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Troco</p>
                                  <p className="text-2xl font-black text-emerald-400">€{(parseFloat(posCashReceived) - posTotal).toFixed(2)}</p>
                                </div>
                              )}
                            </div>
                          )}

                          <motion.button
                            whileTap={{ scale: 0.97 }}
                            onClick={() => {
                              setPosPaymentModal(null);
                              setPosNif('');
                              setPosCashReceived('');
                              setPosCart([]);
                              setPosSplitBy(1);
                              alert(`✅ Venda concluída! ${posPaymentModal === 'cash' ? 'Dinheiro' : 'Cartão'}${posNif.length === 9 ? ` • Fatura NIF ${posNif}` : ''}`);
                            }}
                            className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl shadow-emerald-600/30 transition-all flex items-center justify-center gap-2"
                          >
                            <CheckCircle size={18} /> Confirmar Venda
                          </motion.button>
                        </div>
                      </motion.div>
                    </div>
                  )}
                </AnimatePresence>
              </>
            );
          })()}

          {activeTab === 'dashboard' && (() => {
            // Top selling: count from kitchenOrders
            const salesMap: Record<string, { name: string; count: number; category: string }> = {};
            kitchenOrders.forEach(order => {
              (order.items || []).forEach((item: any) => {
                const key = item.dish?.name || item.name || 'Desconhecido';
                if (!salesMap[key]) salesMap[key] = { name: key, count: 0, category: item.dish?.category || '' };
                salesMap[key].count += item.quantity || 1;
              });
            });
            // Fallback: use dishes list if no orders
            if (Object.keys(salesMap).length === 0) {
              (business.dishes || []).slice(0, 6).forEach((d, i) => {
                salesMap[d.name] = { name: d.name, count: Math.max(1, 18 - i * 3), category: d.category || '' };
              });
            }
            const topSales = Object.values(salesMap).sort((a, b) => b.count - a.count).slice(0, 6);
            const maxSales = Math.max(...topSales.map(s => s.count), 1);

            const totalStaff = staff.length;
            const onDutyStaff = staff.filter(s => s.onDuty).length;
            const onVacation = staff.filter(s => s.vacationStart).length;
            const debtClients = fiadoClients.filter(c => c.balance < 0);
            const creditClients = fiadoClients.filter(c => c.balance > 0);

            return (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                {/* KPI Cards */}
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
                  {[
                    { label: 'Rating Médio', val: `★ ${averageRating}`, color: 'bg-blue-50 text-blue-700', icon: <Star className="fill-current" size={18}/> },
                    { label: 'Avaliações', val: (Number(business.reviews) || 0) + ratedReservations.length, color: 'bg-indigo-50 text-indigo-700', icon: <Users size={18}/> },
                    { label: isBeauty ? 'Serviços Ativos' : isShop ? 'Produtos Ativos' : 'Pratos Ativos', val: (business.dishes || []).length, color: 'bg-emerald-50 text-emerald-700', icon: isBeauty ? <Sparkles size={18}/> : isShop ? <ShoppingBag size={18}/> : <Utensils size={18}/> },
                    { label: isBeauty ? 'Marcações Pend.' : 'Reservas Pend.', val: pendingCount, color: 'bg-amber-50 text-amber-700', icon: <Clock size={18}/> },
                    { label: 'Total Equipa', val: totalStaff, color: 'bg-rose-50 text-rose-700', icon: <Users size={18}/> },
                    { label: 'Em Serviço', val: `${onDutyStaff}/${totalStaff}`, color: 'bg-emerald-50 text-emerald-700', icon: <CheckCircle size={18}/> },
                  ].map((stat, i) => (
                    <div key={i} className="bg-white border border-slate-100 p-5 rounded-[2rem] shadow-sm hover:shadow-xl transition-all duration-500 group">
                       <div className={`w-10 h-10 ${stat.color} rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>{stat.icon}</div>
                       <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                       <p className="text-2xl font-black text-slate-800 tracking-tight">{stat.val}</p>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* TOP SELLING CHART */}
                  <div className="lg:col-span-2 bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h3 className="font-black text-slate-800 uppercase tracking-tighter">{isBeauty ? 'Serviços Mais Procurados' : 'Mais Vendidos'}</h3>
                        <p className="text-slate-400 text-xs font-bold mt-0.5">{isBeauty ? 'Tratamentos e serviços com mais agendamentos' : 'Pratos e produtos com mais pedidos'}</p>
                      </div>
                      <div className="w-8 h-8 bg-blue-50 rounded-xl flex items-center justify-center">
                        {isBeauty ? <Sparkles size={16} className="text-blue-600" /> : <Utensils size={16} className="text-blue-600" />}
                      </div>
                    </div>
                    <div className="space-y-4">
                      {topSales.map((item, i) => (
                        <div key={i} className="flex items-center gap-4 group">
                          <div className="w-6 text-[10px] font-black text-slate-300 text-right flex-shrink-0">#{i+1}</div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <p className="text-xs font-black text-slate-700 truncate">{item.name}</p>
                              <p className="text-xs font-black text-blue-600 ml-2 flex-shrink-0">{item.count}×</p>
                            </div>
                            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${(item.count / maxSales) * 100}%` }}
                                transition={{ delay: i * 0.1, duration: 0.6, ease: 'easeOut' }}
                                className={`h-full rounded-full ${
                                  i === 0 ? 'bg-blue-500' : i === 1 ? 'bg-indigo-400' : i === 2 ? 'bg-violet-400' : 'bg-slate-300'
                                }`}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                      {topSales.length === 0 && (
                        <div className="py-12 text-center text-slate-300">
                          {isBeauty ? <Sparkles size={32} className="mx-auto mb-2 opacity-30"/> : <Utensils size={32} className="mx-auto mb-2 opacity-30"/>}
                          <p className="text-xs font-bold uppercase tracking-widest">{isBeauty ? 'Sem dados de agendamentos' : 'Sem dados de vendas ainda'}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* RIGHT COLUMN */}
                  <div className="space-y-6">
                    {/* Staff Quick */}
                    <div className="bg-slate-900 text-white rounded-[2.5rem] p-6">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Equipa Hoje</p>
                      <div className="grid grid-cols-2 gap-3 mb-4">
                        <div className="bg-emerald-500/20 rounded-2xl p-3 text-center">
                          <p className="text-2xl font-black text-emerald-400">{onDutyStaff}</p>
                          <p className="text-[9px] font-black text-emerald-300 uppercase tracking-widest">Em serviço</p>
                        </div>
                        <div className="bg-amber-500/20 rounded-2xl p-3 text-center">
                          <p className="text-2xl font-black text-amber-400">{onVacation}</p>
                          <p className="text-[9px] font-black text-amber-300 uppercase tracking-widest">De férias</p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        {staff.slice(0,3).map(m => (
                          <div key={m.id} className="flex items-center gap-3">
                            <div className="w-7 h-7 bg-slate-700 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0">{(m.name||'?').charAt(0)}</div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-bold truncate">{m.name}</p>
                            </div>
                            <div className={`w-2 h-2 rounded-full flex-shrink-0 ${ m.vacationStart ? 'bg-amber-400' : m.onDuty ? 'bg-emerald-400 animate-pulse' : 'bg-slate-600'}`}/>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Island location */}
                    <div className="bg-white border border-slate-100 rounded-[2.5rem] p-6 flex flex-col justify-center items-center text-center">
                      <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center mb-3">
                        <MapPin className="text-slate-300 w-7 h-7" />
                      </div>
                      <h4 className="font-black text-slate-800 uppercase tracking-tighter">{business.island}</h4>
                      <p className="text-slate-400 text-xs font-medium">Localização Principal</p>
                      <div className="flex gap-2 mt-4">
                        <button onClick={() => setActiveTab('reservations')} className="px-4 py-2 bg-slate-900 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all">{isBeauty ? 'Marcações' : 'Reservas'}</button>
                        <button onClick={() => setActiveTab('dishes')} className="px-4 py-2 bg-blue-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all">{isBeauty ? 'Serviços' : isShop ? 'Catálogo' : 'Ementa'}</button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* FIADO — Client Tabs */}
                <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="font-black text-slate-800 uppercase tracking-tighter">{isBeauty ? 'Fiado / Contas de Clientes' : 'Fiado / Créditos de Restaurante'}</h3>
                      <p className="text-slate-400 text-xs font-bold mt-0.5">{isBeauty ? 'Clientes com saldo em conta no salão' : 'Clientes com saldo em conta no restaurante'}</p>
                    </div>
                    <div className="flex gap-3 text-[10px] font-black">
                      <span className="px-3 py-1 bg-red-50 text-red-600 rounded-full">{debtClients.length} em dívida</span>
                      <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full">{creditClients.length} com crédito</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {fiadoClients.map(client => (
                      <div key={client.id} className={`flex items-center gap-4 p-4 rounded-2xl border ${
                        client.balance < 0 ? 'bg-red-50 border-red-100' : 'bg-emerald-50 border-emerald-100'
                      }`}>
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm flex-shrink-0 ${
                          client.balance < 0 ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'
                        }`}>{client.name.charAt(0)}</div>
                        <div className="flex-1 min-w-0">
                          <p className="font-black text-slate-800 text-sm truncate">{client.name}</p>
                          <p className="text-[10px] text-slate-400 font-medium">{client.phone} • Última visita: {client.lastVisit}</p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className={`font-black text-lg ${ client.balance < 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                            {client.balance < 0 ? '-' : '+'}€{Math.abs(client.balance).toFixed(2)}
                          </p>
                          <p className={`text-[9px] font-black uppercase tracking-widest ${ client.balance < 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                            {client.balance < 0 ? 'deve' : 'crédito'}
                          </p>
                        </div>
                        <div className="flex flex-col gap-1">
                          <button onClick={() => {
                            const updated = fiadoClients.map(c => c.id === client.id ? {...c, balance: parseFloat((c.balance + 5).toFixed(2))} : c);
                            setFiadoClients(updated);
                            handleUpdate({ fiadoClients: updated });
                          }} className="w-7 h-7 bg-white rounded-lg flex items-center justify-center text-emerald-600 font-black hover:bg-emerald-100 text-sm border border-emerald-100">+</button>
                          <button onClick={() => {
                            const updated = fiadoClients.map(c => c.id === client.id ? {...c, balance: parseFloat((c.balance - 5).toFixed(2))} : c);
                            setFiadoClients(updated);
                            handleUpdate({ fiadoClients: updated });
                          }} className="w-7 h-7 bg-white rounded-lg flex items-center justify-center text-red-500 font-black hover:bg-red-50 text-sm border border-red-100">−</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })()}

          {activeTab === 'dishes' && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
               <div className="flex justify-between items-center">
                  <h3 className="text-xl font-black text-slate-800 uppercase tracking-tighter">Lista de Pratos</h3>
                  <button onClick={() => setActiveTab('dashboard')} className="flex items-center gap-2 text-blue-600 font-bold hover:underline">
                    <LayoutDashboard className="w-4 h-4" /> Voltar à Dashboard
                  </button>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {(business.dishes || []).map((dish, idx) => (
                   <div key={idx} className="bg-white border border-slate-100 rounded-[2rem] overflow-hidden group hover:shadow-2xl transition-all duration-500 flex flex-col h-full">
                      <div className="h-48 relative overflow-hidden bg-slate-100">
                        {dish.image ? (
                          <img src={dish.image} alt={dish.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-300"><ImageIcon className="w-12 h-12" /></div>
                        )}
                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur shadow-xl px-3 py-1 rounded-full font-black text-blue-600 text-xs">€{(Number(dish.price) || 0).toFixed(2)}</div>
                      </div>
                      <div className="p-6 flex-1 flex flex-col">
                        <h4 className="font-black text-slate-800 text-lg mb-2">{dish.name}</h4>
                        <p className="text-slate-500 text-sm font-medium line-clamp-3 mb-6 flex-1">{dish.description}</p>
                        <div className="flex gap-2">
                           <button onClick={() => startDishEdit(idx)} className="flex-1 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all">Editar</button>
                           <button onClick={() => removeDish(idx)} className="p-3 text-red-400 hover:bg-red-50 rounded-xl transition-colors"><Trash2 className="w-4 h-4"/></button>
                        </div>
                      </div>
                   </div>
                 ))}
                 <button onClick={addDish} className="border-4 border-dashed border-slate-100 rounded-[2rem] flex flex-col items-center justify-center p-12 text-slate-300 hover:border-blue-200 hover:text-blue-400 hover:bg-blue-50/10 transition-all group">
                    <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                       <Plus className="w-8 h-8" />
                    </div>
                    <span className="font-black uppercase tracking-widest text-xs">Adicionar Prato</span>
                 </button>
               </div>
            </motion.div>
          )}

          {activeTab === 'products' && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
               <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <h3 className="text-xl font-black text-slate-800 uppercase tracking-tighter">Catálogo de Produtos</h3>
                    <p className="text-slate-400 text-sm font-medium">Bebidas, Cafetaria e Suplementos</p>
                  </div>
                  <button onClick={addProduct} className="px-6 py-3 bg-blue-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-blue-600/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2">
                    <Plus className="w-4 h-4" /> Novo Produto
                  </button>
               </div>

               <div className="bg-white border border-slate-100 rounded-[2.5rem] overflow-hidden shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-slate-50">
                          <th className="px-8 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Info</th>
                          <th className="px-8 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Stock / Min</th>
                          <th className="px-8 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">P. Compra / Venda</th>
                          <th className="px-8 py-6 text-right text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Ações</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50 font-sans">
                        {products.map((product, idx) => {
                          const isLowStock = (product.stock || 0) <= (product.minStock || 0);
                          return (
                           <tr key={idx} className={`hover:bg-slate-50/50 transition-colors group ${isLowStock ? 'bg-red-50/30' : ''}`}>
                              <td className="px-8 py-6">
                                 <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 flex-shrink-0 group-hover:scale-110 transition-transform relative">
                                       {product.category === 'Cafetaria' && <Coffee className="w-5 h-5"/>}
                                       {product.category === 'Vinhos' && <Wine className="w-5 h-5"/>}
                                       {product.category === 'Bebidas' && <Beer className="w-5 h-5"/>}
                                       {!['Cafetaria', 'Vinhos', 'Bebidas'].includes(product.category) && <ShoppingBag className="w-5 h-5"/>}
                                       {isLowStock && (
                                         <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-[8px] text-white font-black animate-bounce shadow-lg shadow-red-500/30">!</div>
                                       )}
                                    </div>
                                    <div>
                                       <p className="font-black text-slate-800">{product.name}</p>
                                       <span className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded-md text-[9px] font-black uppercase tracking-widest">{product.category}</span>
                                    </div>
                                 </div>
                              </td>
                              <td className="px-8 py-6">
                                 <div className="flex items-center gap-2">
                                    <span className={`text-lg font-black ${isLowStock ? 'text-red-500' : 'text-slate-800'}`}>{product.stock || 0}</span>
                                    <span className="text-slate-300">/</span>
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{product.minStock || 0}</span>
                                 </div>
                                 {isLowStock && (
                                   <p className="text-[9px] font-black text-red-500 uppercase tracking-widest mt-1">Stock Mínimo Atingido</p>
                                 )}
                              </td>
                              <td className="px-8 py-6">
                                 <div className="space-y-1">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Compra: <span className="text-slate-600 font-black">€{(product.purchasePrice || 0).toFixed(2)}</span></p>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Venda: <span className="text-blue-600 font-black">€{(product.price || 0).toFixed(2)}</span></p>
                                 </div>
                              </td>
                              <td className="px-8 py-6 text-right">
                                 <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                    {isLowStock && (
                                      <button 
                                        onClick={() => {
                                          const qty = prompt(`Quantas unidades de ${product.name} deseja encomendar?`, String((product.minStock || 10) * 2));
                                          if (!qty) return;
                                          const quantity = parseInt(qty);
                                          if (isNaN(quantity) || quantity <= 0) return;

                                          const order = {
                                            id: 'ORD_' + Date.now(),
                                            supplierId: product.supplierId || 'DEFAULT',
                                            restaurantId: business.id,
                                            restaurantName: business.name,
                                            items: [{ productId: product.id, quantity, price: product.purchasePrice || 0 }],
                                            status: 'pending' as const,
                                            total: (product.purchasePrice || 0) * quantity,
                                            createdAt: new Date().toISOString()
                                          };
                                          const updatedOrders = [...supplierOrders, order];
                                          setSupplierOrders(updatedOrders);
                                          handleUpdate({ supplierOrders: updatedOrders });
                                          alert(`📦 Pedido de ${quantity} unidades gerado para fornecedor!`);
                                        }}
                                        className="p-2 bg-blue-600 text-white rounded-xl hover:scale-110 transition-all shadow-lg shadow-blue-900/20"
                                        title="Pedir ao Fornecedor"
                                      >
                                        <Send size={14} />
                                      </button>
                                    )}
                                    <button onClick={() => startProductEdit(idx)} className="p-2 text-slate-400 hover:text-blue-500 transition-colors"><Edit className="w-4 h-4"/></button>
                                    <button onClick={() => removeProduct(idx)} className="p-2 text-slate-400 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4"/></button>
                                 </div>
                              </td>
                           </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
               </div>
            </motion.div>
          )}

          {activeTab === 'suppliers' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h3 className="text-xl font-black text-slate-800 uppercase tracking-tighter">Gestão de Fornecedores</h3>
                  <p className="text-slate-400 text-sm font-medium">Administração inteligente de fornecedores e encomendas</p>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setShowAddSupplier(true)} className="px-6 py-3 bg-white border border-slate-200 text-slate-700 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-slate-50 transition-all flex items-center gap-2">
                    <Plus className="w-4 h-4" /> Novo Fornecedor
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Supplier List */}
                <div className="xl:col-span-2 space-y-4">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Lista de Fornecedores</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {suppliers.map(sup => (
                      <div key={sup.id} className="bg-white border border-slate-100 p-6 rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all duration-500 group">
                        <div className="flex items-center gap-4 mb-4">
                          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center font-black text-lg group-hover:scale-110 transition-transform">
                            {sup.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-black text-slate-800">{sup.name}</p>
                            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">NIF: {sup.nif}</p>
                          </div>
                        </div>
                        <div className="space-y-2 mb-6">
                          <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                            <Mail size={14} className="text-slate-300" /> {sup.email}
                          </div>
                          <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                            <Phone size={14} className="text-slate-300" /> {sup.phone}
                          </div>
                          <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                            <MapPin size={14} className="text-slate-300" /> {sup.address}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button 
                            onClick={() => { setEditingSupplier(sup); setShowAddSupplier(true); }}
                            className="flex-1 py-2.5 bg-slate-100 text-slate-600 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-blue-600 hover:text-white transition-all"
                          >
                            Editar
                          </button>
                          <button 
                            onClick={() => {
                              const updated = suppliers.filter(s => s.id !== sup.id);
                              setSuppliers(updated);
                              handleUpdate({ suppliers: updated });
                            }}
                            className="p-2.5 text-red-400 hover:bg-red-50 rounded-xl transition-colors"
                          >
                            <Trash2 size={16}/>
                          </button>
                        </div>
                      </div>
                    ))}
                    {suppliers.length === 0 && (
                      <div className="col-span-full py-12 text-center bg-slate-50 rounded-[2.5rem] border border-dashed border-slate-200">
                         <Users className="w-12 h-12 mx-auto mb-4 text-slate-200" />
                         <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Nenhum fornecedor registado</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Pending Orders */}
                <div className="space-y-4">
                   <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Encomendas Pendentes</h4>
                   <div className="space-y-4">
                     {supplierOrders.filter(o => o.status === 'pending').map(order => {
                       const supplier = suppliers.find(s => s.id === order.supplierId) || { name: 'Fornecedor Desconhecido' };
                       return (
                         <div key={order.id} className="bg-slate-900 text-white p-6 rounded-[2.5rem] shadow-xl border border-white/10 relative overflow-hidden group">
                           <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-700" />
                           <div className="relative z-10">
                             <div className="flex justify-between items-start mb-4">
                               <div>
                                 <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">Encomenda #{order.id.slice(-4)}</p>
                                 <p className="font-black text-sm">{supplier.name}</p>
                               </div>
                               <div className="px-3 py-1 bg-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest">Pendente</div>
                             </div>
                             <div className="bg-white/5 rounded-2xl p-4 mb-4">
                                {order.items.map((item, i) => {
                                  const prod = products.find(p => p.id === item.productId);
                                  return (
                                    <div key={i} className="flex justify-between items-center text-xs">
                                      <span className="text-slate-400 font-bold">{item.quantity}x {prod?.name || 'Item'}</span>
                                      <span className="font-black">€{(item.price * item.quantity).toFixed(2)}</span>
                                    </div>
                                  );
                                })}
                             </div>
                             <div className="flex items-center justify-between mb-4 px-2">
                               <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Total Encomenda</span>
                               <span className="text-xl font-black text-blue-400">€{order.total.toFixed(2)}</span>
                             </div>
                             <button 
                               onClick={() => {
                                 const updated = supplierOrders.map(o => o.id === order.id ? {...o, status: 'approved' as const} : o);
                                 setSupplierOrders(updated);
                                 handleUpdate({ supplierOrders: updated });
                                 alert("✅ Encomenda aprovada e enviada para o fornecedor!");
                               }}
                               className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-black uppercase text-[10px] tracking-widest transition-all shadow-lg shadow-blue-900/40"
                             >
                               Aprovar e Enviar
                             </button>
                           </div>
                         </div>
                       );
                     })}
                     {supplierOrders.filter(o => o.status === 'pending').length === 0 && (
                       <div className="py-12 text-center bg-slate-50 rounded-[2.5rem] border border-dashed border-slate-200">
                          <ShoppingBag className="w-12 h-12 mx-auto mb-4 text-slate-200" />
                          <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Sem encomendas pendentes</p>
                       </div>
                     )}
                   </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'reservations' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">
               {/* Sub-Tabs Selector */}
               <div className="flex gap-4 p-2 bg-slate-50 rounded-[2rem] w-fit border border-slate-100 shadow-inner">
                  <button 
                    onClick={() => setReservationsTab('list')}
                    className={`px-8 py-3 rounded-[1.5rem] font-black text-xs uppercase tracking-widest transition-all ${
                      reservationsTab === 'list' ? 'bg-white text-blue-600 shadow-md' : 'text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                       <Calendar size={16} /> Reservas App
                       {pendingCount > 0 && <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />}
                    </div>
                  </button>
                  <button 
                    onClick={() => setReservationsTab('orders')}
                    className={`px-8 py-3 rounded-[1.5rem] font-black text-xs uppercase tracking-widest transition-all ${
                      reservationsTab === 'orders' ? 'bg-white text-blue-600 shadow-md' : 'text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                       <ShoppingBag size={16} /> Pedidos App
                       {kitchenOrders.filter(o => o.status === 'pending_admin').length > 0 && (
                         <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping" />
                       )}
                    </div>
                  </button>
               </div>

               {/* Reservation Numbers Top */}
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-blue-600 p-8 rounded-[2.5rem] text-white shadow-xl shadow-blue-600/20 flex items-center justify-between group">
                     <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60 mb-1">Total Hoje</p>
                        <p className="text-4xl font-black tracking-tighter">{reservations.length}</p>
                     </div>
                     <Calendar className="w-12 h-12 opacity-20 group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="bg-white border border-slate-100 p-8 rounded-[2.5rem] shadow-sm flex items-center justify-between group">
                     <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Por Validar</p>
                        <p className="text-4xl font-black text-amber-500 tracking-tighter">{pendingCount}</p>
                     </div>
                     <AlertCircle className="w-12 h-12 text-amber-100 group-hover:rotate-12 transition-transform" />
                  </div>
                  <div className="bg-emerald-500 p-8 rounded-[2.5rem] text-white shadow-xl shadow-emerald-500/20 flex items-center justify-between group">
                     <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60 mb-1">Confirmadas</p>
                        <p className="text-4xl font-black tracking-tighter">{reservations.filter(r => r.status === 'accepted').length}</p>
                     </div>
                     <Check className="w-12 h-12 opacity-20 group-hover:scale-110 transition-transform" />
                  </div>
               </div>

               <div className="grid grid-cols-1">
                  {reservationsTab === 'list' ? (
                    /* Reservation List - Full Width */
                    <div className="space-y-6">
                       <h3 className="text-xl font-black text-slate-800 uppercase tracking-tighter">Pedidos de Reserva Pendentes</h3>
                       <AnimatePresence mode="popLayout">
                         {reservations.filter(r => r.status === 'pending' || r.status === 'pendente').map(res => (
                           <motion.div 
                             layout
                             initial={{ opacity: 0, x: -20 }}
                             animate={{ opacity: 1, x: 0 }}
                             exit={{ opacity: 0, x: 50, scale: 0.9 }}
                             key={res.id} 
                             className="bg-white border border-slate-100 p-8 rounded-[3rem] shadow-sm hover:shadow-2xl transition-all duration-500 border-l-8 border-l-amber-500"
                           >
                              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                                 <div className="flex items-center gap-6">
                                   <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-[1.5rem] flex items-center justify-center text-xl font-black shadow-inner">
                                     {res.customerName.charAt(0)}
                                   </div>
                                   <div className="flex-1">
                                      <p className="text-2xl font-black text-slate-800 tracking-tight">{res.customerName}</p>
                                      <p className="text-sm text-slate-400 font-medium">{res.customerPhone} • {res.customerEmail}</p>
                                      <div className="flex items-center gap-4 mt-2">
                                         <span className="bg-slate-100 px-3 py-1 rounded-lg text-[10px] font-black uppercase text-slate-500 tracking-widest">{res.date}</span>
                                         <span className="bg-blue-600 px-3 py-1 rounded-lg text-[10px] font-black uppercase text-white tracking-widest">{res.time}</span>
                                         {!isBeauty && !isShop && <span className="flex items-center gap-1 text-[10px] font-black uppercase text-slate-400"><Users size={12}/> {res.guests} Pax</span>}
                                      </div>
                                   </div>
                                 </div>
                                 <div className="flex gap-3 w-full md:w-auto">
                                    <button 
                                      onClick={() => {
                                        if (isBeauty || isShop) {
                                          handleReservationAction(res.id, 'accepted');
                                        } else {
                                          setAcceptingReservation(res);
                                          setActiveTab('tables');
                                        }
                                      }}
                                      className="flex-1 md:flex-none px-10 py-5 bg-emerald-500 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-emerald-500/20 hover:scale-105 active:scale-95 transition-all"
                                    >
                                      {(isBeauty || isShop) ? 'Aprovar Marcação' : 'Vincular Mesa'}
                                    </button>
                                    <button 
                                      onClick={() => handleReservationAction(res.id, 'cancelled')}
                                      className="p-5 text-red-400 bg-red-50 hover:bg-red-100 rounded-2xl transition-all group"
                                    >
                                      <Trash2 className="w-6 h-6 group-hover:scale-110 transition-transform" />
                                    </button>
                                 </div>
                              </div>
                           </motion.div>
                         ))}
                         {pendingCount === 0 && (
                           <div className="py-20 text-center bg-slate-50 rounded-[3rem] border border-dashed border-slate-200">
                             <CheckCircle className="w-16 h-16 mx-auto mb-6 text-emerald-500 opacity-20" />
                             <p className="font-black text-xl text-slate-400 uppercase tracking-tighter">Limpo! Sem reservas pendentes.</p>
                           </div>
                         )}
                       </AnimatePresence>
                    </div>
                  ) : (
                    /* App Orders List */
                    <div className="space-y-6">
                       <h3 className="text-xl font-black text-slate-800 uppercase tracking-tighter">Pedidos Recebidos da App</h3>
                       <AnimatePresence mode="popLayout">
                         {(() => {
                           // Encontrar todas as reservas que têm pré-pedido
                           const reservationsWithFood = reservations.filter(r => r.preOrder && r.preOrder.length > 0);
                           
                           if (reservationsWithFood.length === 0) {
                             return (
                               <motion.div 
                                 initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                 className="py-20 text-center bg-slate-50 rounded-[3rem] border border-dashed border-slate-200"
                               >
                                 <ShoppingBag className="w-16 h-16 mx-auto mb-6 text-blue-500 opacity-20" />
                                 <p className="font-black text-xl text-slate-400 uppercase tracking-tighter">Nenhum pedido da app recebido.</p>
                               </motion.div>
                             );
                           }

                           return reservationsWithFood.map(res => {
                             const order = kitchenOrders.find(o => o.reservationId === res.id);
                             
                             return (
                               <motion.div 
                                 layout
                                 initial={{ opacity: 0, x: -20 }}
                                 animate={{ opacity: 1, x: 0 }}
                                 exit={{ opacity: 0, x: 50, scale: 0.9 }}
                                 key={res.id} 
                                 className={`bg-white border border-slate-100 p-8 rounded-[3rem] shadow-sm hover:shadow-2xl transition-all duration-500 border-l-8 ${
                                   !order ? 'border-l-slate-300' :
                                   order.status === 'pending_admin' ? 'border-l-blue-500' : 
                                   order.status === 'sent_to_kitchen' ? 'border-l-amber-500' :
                                   order.status === 'preparing' ? 'border-l-orange-500' : 'border-l-emerald-500'
                                 }`}
                               >
                                  <div className="flex flex-col gap-6">
                                     <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-4">
                                           <div className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center font-black">
                                              #{res.tableId?.replace('T','') || '?'}
                                           </div>
                                           <div>
                                              <p className="text-lg font-black text-slate-800">{res.customerName}</p>
                                              <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">
                                                Reserva para {res.date} às {res.time}
                                                {res.requestedTime && ` • Prep: ${res.requestedTime === 'now' ? 'Imediata' : res.requestedTime === 'at_reservation' ? 'Na Reserva' : res.requestedTime}`}
                                              </p>
                                           </div>
                                        </div>
                                        <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                          !order ? 'bg-slate-100 text-slate-500' :
                                          order.status === 'pending_admin' ? 'bg-blue-100 text-blue-700' :
                                          order.status === 'sent_to_kitchen' ? 'bg-amber-100 text-amber-700' :
                                          order.status === 'preparing' ? 'bg-orange-100 text-orange-700' : 'bg-emerald-100 text-emerald-700'
                                        }`}>
                                           {!order ? 'Aguardando Aprovação Reserva' :
                                            order.status === 'pending_admin' ? 'Pendente Admin' :
                                            order.status === 'sent_to_kitchen' ? 'Enviado Cozinha' :
                                            order.status === 'preparing' ? 'Em Preparação' : 'Pronto'}
                                        </div>
                                     </div>

                                     <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                                        {((res.preOrder || res.preorder) || []).map((item, i) => (
                                          <div key={i} className="flex justify-between items-center py-2 border-b border-slate-200 last:border-0">
                                             <div className="flex items-center gap-3">
                                                <span className="w-6 h-6 bg-white rounded-lg flex items-center justify-center font-black text-xs shadow-sm">{item.quantity}x</span>
                                                <span className="font-bold text-slate-700">{item.dish.name}</span>
                                                {item.meatPoint && <span className="text-[10px] bg-amber-50 text-amber-600 px-2 py-0.5 rounded-md font-black">{item.meatPoint}</span>}
                                             </div>
                                          </div>
                                        ))}
                                     </div>

                                     <div className="flex gap-3">
                                        {!order ? (
                                          <div className="flex-1 flex flex-col items-center justify-center p-6 bg-slate-50 rounded-2xl border border-dashed border-slate-200 gap-3">
                                             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">
                                                {res.status === 'accepted' ? 'Reserva confirmada, mas pedido ainda não processado.' : 'Deve aceitar a reserva primeiro para gerir o pedido.'}
                                             </p>
                                             {res.status === 'accepted' && (
                                               <button 
                                                 onClick={() => createOrderForReservation(res)}
                                                 className="px-6 py-3 bg-blue-600 text-white rounded-xl font-black uppercase text-[9px] tracking-widest hover:scale-105 active:scale-95 transition-all shadow-lg shadow-blue-900/20"
                                               >
                                                 Processar Pedido Agora
                                               </button>
                                             )}
                                          </div>
                                        ) : (
                                          <>
                                            {order.status === 'pending_admin' && (
                                              <button 
                                                onClick={() => {
                                                  const updatedOrders = kitchenOrders.map(o => o.id === order.id ? { ...o, status: 'sent_to_kitchen' as const } : o);
                                                  setKitchenOrders(updatedOrders);
                                                  handleUpdate({ kitchenOrders: updatedOrders });
                                                }}
                                                className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-blue-900/20"
                                              >
                                                Enviar para Cozinha
                                              </button>
                                            )}
                                            {order.status === 'sent_to_kitchen' && (
                                              <button 
                                                onClick={() => {
                                                  const updatedOrders = kitchenOrders.map(o => o.id === order.id ? { ...o, status: 'preparing' as const } : o);
                                                  setKitchenOrders(updatedOrders);
                                                  handleUpdate({ kitchenOrders: updatedOrders });
                                                }}
                                                className="flex-1 py-4 bg-orange-500 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-orange-900/20"
                                              >
                                                Em Preparação
                                              </button>
                                            )}
                                            {order.status === 'preparing' && (
                                              <button 
                                                onClick={() => {
                                                  const updatedOrders = kitchenOrders.map(o => o.id === order.id ? { ...o, status: 'ready' as const } : o);
                                                  setKitchenOrders(updatedOrders);
                                                  handleUpdate({ kitchenOrders: updatedOrders });
                                                }}
                                                className="flex-1 py-4 bg-emerald-500 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-emerald-900/20"
                                              >
                                                Pedido Pronto
                                              </button>
                                            )}
                                          </>
                                        )}
                                        <button 
                                          className="p-4 text-slate-400 bg-slate-50 hover:bg-slate-100 rounded-2xl transition-all"
                                          onClick={() => {
                                            if (window.confirm("Remover este pedido?")) {
                                              const updatedOrders = kitchenOrders.filter(o => o.id !== order?.id);
                                              setKitchenOrders(updatedOrders);
                                              handleUpdate({ kitchenOrders: updatedOrders });
                                            }
                                          }}
                                        >
                                          <Trash2 className="w-5 h-5" />
                                        </button>
                                     </div>
                                  </div>
                               </motion.div>
                             );
                           });
                         })()}
                       </AnimatePresence>
                    </div>
                  )}
               </div>
            </motion.div>
          )}

          {activeTab === 'reviews' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
               <div className="flex justify-between items-center">
                  <h3 className="text-xl font-black text-slate-800 uppercase tracking-tighter">Avaliações dos Clientes</h3>
               </div>
               {uniqueReviews.length === 0 ? (
                 <div className="py-20 text-center bg-slate-50 rounded-[3rem] border border-dashed border-slate-200">
                   <Star className="w-16 h-16 mx-auto mb-6 text-slate-300" />
                   <p className="font-black text-xl text-slate-400 uppercase tracking-tighter">Ainda sem avaliações.</p>
                 </div>
               ) : (
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                   {uniqueReviews.map(res => (
                     <div key={res.id} className="bg-white border border-slate-100 rounded-[2rem] p-6 shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col">
                        <div className="flex justify-between items-start mb-4">
                           <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center font-black">
                                 {(res.customerName || 'C').charAt(0)}
                              </div>
                              <div>
                                 <p className="font-bold text-slate-800">{res.customerName}</p>
                                 <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                                    {res.date && !isNaN(new Date(res.date).getTime()) ? new Date(res.date).toLocaleDateString() : res.date || 'Data N/D'}
                                 </p>
                              </div>
                           </div>
                           <div className="flex items-center gap-1 bg-yellow-50 text-yellow-600 px-2 py-1 rounded-lg">
                              <Star className="w-4 h-4 fill-current" />
                              <span className="font-black text-sm">{res.rating?.toFixed(1)}</span>
                           </div>
                        </div>
                        <p className="text-slate-600 text-sm flex-1">{res.reviewNote || 'Sem comentário adicionado.'}</p>
                     </div>
                   ))}
                 </div>
               )}
            </motion.div>
          )}

          {activeTab === 'qrcode' && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center min-h-[600px] text-center">
              <div className="bg-white p-12 rounded-[4rem] shadow-2xl border border-slate-100 max-w-lg w-full">
                <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-inner">
                  <QrCode size={40} />
                </div>
                <h2 className="text-3xl font-black text-slate-800 tracking-tight mb-2">Check-in / Check-out</h2>
                <p className="text-slate-400 font-medium mb-12 uppercase text-[10px] tracking-[0.2em]">QR Code Oficial para Clientes</p>
                
                <div className="bg-slate-50 p-8 rounded-[3rem] border-4 border-dashed border-slate-200 mb-12 relative group cursor-pointer hover:border-blue-400 transition-all">
                  <img 
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=AZORES4YOU_CHECKOUT_${business.id}`} 
                    alt="QR Code" 
                    className="w-64 h-64 mx-auto mix-blend-multiply group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute inset-0 bg-white/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Printer className="text-blue-600 w-12 h-12" />
                  </div>
                </div>

                <div className="space-y-4">
                  <button 
                    onClick={() => window.print()}
                    className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-blue-600 transition-all flex items-center justify-center gap-3 shadow-xl shadow-slate-900/20"
                  >
                    <Printer size={18} /> Imprimir QR Code para Mesa
                  </button>
                  <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest leading-loose">
                    Este código permite que o cliente dê entrada e saída sozinho,<br/>
                    libertando a mesa e acumulando créditos Azores4You.
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'updates' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
               <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <h3 className="text-xl font-black text-slate-800 uppercase tracking-tighter">Comunicados</h3>
                    <p className="text-slate-400 text-sm font-medium">Novidades e Eventos Especiais</p>
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => addUpdate('news')} className="px-6 py-3 bg-white border border-slate-200 text-slate-700 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-slate-50 transition-all flex items-center gap-2">
                      <Plus className="w-4 h-4" /> Nova Publicação
                    </button>
                    <button onClick={() => addUpdate('event')} className="px-6 py-3 bg-blue-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-blue-600/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2">
                      <CalendarPlus className="w-4 h-4" /> Novo Evento
                    </button>
                  </div>
               </div>

               <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                 {updates.map((update, idx) => (
                   <div key={update.id} className="bg-white border border-slate-100 rounded-[2.5rem] overflow-hidden group hover:shadow-2xl transition-all duration-500 flex flex-col md:flex-row">
                      {update.type === 'event' && update.image && (
                         <div className="w-full md:w-48 h-48 md:h-auto flex-shrink-0">
                            <img src={update.image} alt={update.title} className="w-full h-full object-cover" />
                         </div>
                      )}
                      <div className="p-6 flex-1 flex flex-col justify-center">
                         <div className="flex items-center gap-2 mb-2">
                            <span className={`px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-widest ${update.type === 'event' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}`}>
                               {update.type === 'event' ? 'Evento Especial' : 'Novidade'}
                            </span>
                            {update.date && <span className="text-[10px] font-bold text-slate-400">{update.date}</span>}
                         </div>
                         <h4 className="font-black text-slate-800 text-lg mb-2">{update.title}</h4>
                         <p className="text-slate-500 text-sm font-medium line-clamp-2 mb-4 flex-1">{update.description}</p>
                         
                         {update.type === 'event' && (update.pricePerPerson || update.pricePerCouple) && (
                            <div className="flex gap-4 mb-4">
                               {update.pricePerPerson > 0 && (
                                 <div className="text-xs font-bold text-slate-600 bg-slate-50 px-2 py-1 rounded-lg">€{update.pricePerPerson} / pax</div>
                               )}
                               {update.pricePerCouple > 0 && (
                                 <div className="text-xs font-bold text-slate-600 bg-slate-50 px-2 py-1 rounded-lg">€{update.pricePerCouple} / casal</div>
                               )}
                            </div>
                         )}

                         <div className="flex gap-2 mt-auto">
                            <button onClick={() => setEditingUpdate({idx, update})} className="flex-1 py-2 bg-slate-100 text-slate-600 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all">Editar</button>
                            <button onClick={() => removeUpdate(idx)} className="p-2 text-red-400 hover:bg-red-50 rounded-xl transition-colors"><Trash2 className="w-4 h-4"/></button>
                         </div>
                      </div>
                   </div>
                 ))}
                 {updates.length === 0 && (
                    <div className="col-span-full py-20 text-center bg-slate-50 rounded-[3rem] border border-dashed border-slate-200">
                      <Megaphone className="w-16 h-16 mx-auto mb-6 text-slate-300" />
                      <p className="font-black text-xl text-slate-400 uppercase tracking-tighter">Nenhum comunicado criado.</p>
                    </div>
                  )}
               </div>
            </motion.div>
          )}

          {(activeTab === 'settings' || activeTab === 'business') && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-3xl">
               <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <h3 className="text-xl font-black text-slate-800 uppercase tracking-tighter">Dados do Negócio</h3>
                    <p className="text-slate-400 text-sm font-medium">Informações fiscais, contacto e localização</p>
                  </div>
               </div>
               
               <form onSubmit={saveSettings} className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm space-y-6">
                 {/* NIF */}
                 <div>
                    <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-2">
                      <Receipt className="w-3 h-3" /> NIF do Negócio
                    </label>
                    <input
                      type="text"
                      maxLength={9}
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 font-bold focus:ring-2 focus:ring-blue-500 outline-none"
                      value={settingsForm.nif}
                      onChange={e => setSettingsForm({...settingsForm, nif: e.target.value.replace(/\D/g,'')})}
                      placeholder="Ex: 500123456"
                    />
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                       <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-2">
                         <Phone className="w-3 h-3" /> Número de Telefone
                       </label>
                       <input 
                         type="tel"
                         className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 font-bold focus:ring-2 focus:ring-blue-500 outline-none" 
                         value={settingsForm.phone} 
                         onChange={e => setSettingsForm({...settingsForm, phone: e.target.value})}
                         placeholder="+351 912 345 678"
                       />
                    </div>
                    <div>
                       <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-2">
                         <Mail className="w-3 h-3" /> Email Público
                       </label>
                       <input 
                         type="email"
                         className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 font-bold focus:ring-2 focus:ring-blue-500 outline-none" 
                         value={settingsForm.publicEmail} 
                         onChange={e => setSettingsForm({...settingsForm, publicEmail: e.target.value})}
                         placeholder="contato@restaurante.pt"
                       />
                    </div>
                 </div>
                 
                 <div>
                    <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-2">
                      <MapPin className="w-3 h-3" /> Morada Completa
                    </label>
                    <textarea 
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 font-bold focus:ring-2 focus:ring-blue-500 outline-none h-24 custom-scrollbar" 
                      value={settingsForm.address} 
                      onChange={e => setSettingsForm({...settingsForm, address: e.target.value})}
                      placeholder="Rua Exemplo, Nº 1, Ponta Delgada"
                    />
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-2">
                          <MapIcon className="w-3 h-3" /> Latitude
                        </label>
                       <input 
                         type="text"
                         className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 font-bold focus:ring-2 focus:ring-blue-500 outline-none" 
                         value={settingsForm.latitude} 
                         onChange={e => setSettingsForm({...settingsForm, latitude: e.target.value})}
                         placeholder="Ex: 37.7408"
                       />
                    </div>
                    <div>
                        <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-2">
                          <MapIcon className="w-3 h-3" /> Longitude
                        </label>
                       <input 
                         type="text"
                         className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 font-bold focus:ring-2 focus:ring-blue-500 outline-none" 
                         value={settingsForm.longitude} 
                         onChange={e => setSettingsForm({...settingsForm, longitude: e.target.value})}
                         placeholder="Ex: -25.6686"
                       />
                    </div>
                 </div>

                 <div>
                     <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-2">
                       <MapIcon className="w-3 h-3" /> Link do Google Maps (Opcional)
                     </label>
                    <input 
                      type="url"
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 font-bold focus:ring-2 focus:ring-blue-500 outline-none" 
                      value={settingsForm.mapsUrl} 
                      onChange={e => setSettingsForm({...settingsForm, mapsUrl: e.target.value})}
                      placeholder="https://maps.google.com/..."
                    />
                 </div>

                  {/* CREDIT SETTINGS */}
                  <div className="border-t border-slate-100 pt-6 mt-2">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 bg-amber-50 rounded-xl flex items-center justify-center">
                        <Star className="w-4 h-4 text-amber-500" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sistema de Créditos</p>
                        <p className="text-xs text-slate-500 font-medium">Defina o valor dos créditos e a atribuição por reserva</p>
                      </div>
                    </div>
                    <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 mb-4">
                      <p className="text-xs text-amber-700 font-bold leading-relaxed">
                        💡 <strong>1 Crédito = {settingsForm.creditValue > 0 ? `€${settingsForm.creditValue.toFixed(2)}` : '€0.30 (padrão)'}</strong> — O valor de cada crédito pode ser definido por si. Cada prato e produto pode ter os seus créditos próprios.
                      </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-2">
                          <Star className="w-3 h-3 text-amber-500" /> Valor de 1 Crédito (€)
                        </label>
                        <input
                          type="number" step="0.01" min="0.01"
                          className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 font-bold focus:ring-2 focus:ring-amber-400 outline-none"
                          value={settingsForm.creditValue}
                          onChange={e => setSettingsForm({...settingsForm, creditValue: parseFloat(e.target.value) || 0.30})}
                          placeholder="0.30"
                        />
                      </div>
                      <div>
                        <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-2">
                          <Star className="w-3 h-3 text-amber-500" /> Créditos por Reserva Concluída
                        </label>
                        <input
                          type="number" step="1" min="0"
                          className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 font-bold focus:ring-2 focus:ring-amber-400 outline-none"
                          value={settingsForm.creditsPerReservation}
                          onChange={e => setSettingsForm({...settingsForm, creditsPerReservation: parseInt(e.target.value) || 0})}
                          placeholder="Ex: 50"
                        />
                        <p className="text-[10px] text-slate-400 font-medium mt-1 ml-2">
                          = €{((settingsForm.creditsPerReservation || 0) * (settingsForm.creditValue || 0.30)).toFixed(2)} por reserva
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 flex justify-end">
                     <button type="submit" className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-blue-500/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2">
                        <Save className="w-4 h-4" /> Guardar Alterações
                     </button>
                  </div>
               </form>
            </motion.div>
          )}

          {activeTab === 'gallery' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-12 max-w-5xl">
               <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tighter">Gestão de Imagens</h3>
                    <p className="text-slate-400 text-sm font-medium">Foto principal e galeria do slider</p>
                  </div>
               </div>

               {/* Main Presentation Photo */}
               <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm space-y-6">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Foto de Apresentação Principal</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                     <div className="aspect-video rounded-[2rem] overflow-hidden bg-slate-100 border border-slate-200 relative group">
                        <img src={business.image} alt="Principal" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                           <ImageIcon className="text-white w-10 h-10" />
                        </div>
                     </div>
                     <div className="space-y-4">
                        <p className="text-sm text-slate-500 leading-relaxed">
                           Esta é a imagem principal que aparece nas listagens e no topo do perfil do restaurante.
                        </p>
                        <label className={`inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-black uppercase text-[10px] tracking-widest cursor-pointer transition-all ${isUploading ? 'bg-slate-100 text-slate-400' : 'bg-blue-600 text-white hover:bg-blue-700 shadow-xl shadow-blue-600/20'}`}>
                           {isUploading ? 'A carregar...' : <><Plus className="w-4 h-4"/> Alterar Foto Principal</>}
                           <input 
                              type="file" 
                              className="hidden" 
                              accept="image/*"
                              onChange={(e) => {
                                 const file = e.target.files?.[0];
                                 if (file) handleImageUpload(file, 'main');
                              }}
                           />
                        </label>
                     </div>
                  </div>
               </div>

               {/* Gallery Slider Photos */}
               <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm space-y-8">
                  <div className="flex justify-between items-center">
                     <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Galeria do Slider (Fotos de Ambiente)</h4>
                     <label className={`px-6 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest cursor-pointer transition-all ${isUploading ? 'bg-slate-100 text-slate-400' : 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-xl shadow-emerald-500/20'}`}>
                        {isUploading ? 'A carregar...' : <><Plus className="w-4 h-4 inline mr-1"/> Adicionar à Galeria</>}
                        <input 
                           type="file" 
                           className="hidden" 
                           accept="image/*"
                           multiple
                           onChange={(e) => {
                              const files = Array.from(e.target.files || []);
                              files.forEach((file: any) => handleImageUpload(file, 'gallery'));
                           }}
                        />
                     </label>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                     {(business.gallery || []).map((img, idx) => (
                        <div key={idx} className="aspect-square rounded-[1.5rem] overflow-hidden bg-slate-100 relative group">
                           <img src={img} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
                           <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                              <button 
                                 onClick={() => {
                                    const newGallery = (business.gallery || []).filter((_, i) => i !== idx);
                                    onUpdateBusiness({ ...business, gallery: newGallery });
                                 }}
                                 className="p-3 bg-red-500 text-white rounded-xl hover:scale-110 transition-transform"
                              >
                                 <Trash2 className="w-4 h-4" />
                              </button>
                           </div>
                        </div>
                     ))}
                     {(!business.gallery || business.gallery.length === 0) && (
                        <div className="col-span-full py-12 text-center border-2 border-dashed border-slate-100 rounded-[2rem] text-slate-300">
                           <ImageIcon className="w-12 h-12 mx-auto mb-2 opacity-20" />
                           <p className="font-black uppercase text-[10px] tracking-widest">Nenhuma foto na galeria</p>
                        </div>
                     )}
                  </div>
               </div>
            </motion.div>
          )}
          {activeTab === 'staff_list' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-12 max-w-5xl">
               <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tighter">Gestão de Equipa</h3>
                    <p className="text-slate-400 text-sm font-medium">Administre os funcionários e acessos ao sistema</p>
                  </div>
                  <button 
                    onClick={() => { setEditingStaff(null); setShowAddStaff(true); }}
                    className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-blue-500/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" /> Adicionar Funcionário
                  </button>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Array.isArray(staff) && staff.map((member) => (
                    <div 
                      key={member?.id || Math.random()} 
                      onClick={() => setSelectedStaff(member)}
                      className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden cursor-pointer"
                    >
                       <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 blur-2xl rounded-full"></div>
                       
                       <div className="flex items-center gap-4 mb-6">
                          <div className="w-16 h-16 bg-slate-900 text-white rounded-2xl flex items-center justify-center text-xl font-black shadow-lg">
                             {(member.name || '?').charAt(0)}
                          </div>
                          <div>
                             <p className="text-lg font-black text-slate-800 tracking-tight">{member.name || 'Sem Nome'}</p>
                             <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-lg text-[10px] font-black uppercase tracking-widest">
                                {member.role === 'waiter' ? 'Empregado Mesa' : member.role === 'chef' ? 'Cozinheiro' : 'Gerente'}
                             </span>
                             <div className="flex gap-2 mt-2">
                                {member.onDuty && <span className="px-2 py-0.5 bg-emerald-100 text-emerald-600 rounded-md text-[8px] font-black uppercase tracking-widest animate-pulse">Em Serviço</span>}
                                {member.vacationStart && <span className="px-2 py-0.5 bg-amber-100 text-amber-600 rounded-md text-[8px] font-black uppercase tracking-widest">De Férias</span>}
                              </div>
                          </div>
                       </div>

                       <div className="space-y-3 mb-8">
                          <div className="flex items-center gap-3 text-slate-500 text-sm font-medium">
                             <Mail size={14} className="text-blue-500" /> {member.email || 'Sem email'}
                          </div>
                          <div className="flex items-center gap-3 text-slate-500 text-sm font-medium">
                             <Phone size={14} className="text-blue-500" /> {member.phone || 'Sem telefone'}
                          </div>
                          <div className="flex items-center gap-3 text-slate-500 text-sm font-medium">
                             <Lock size={14} className="text-blue-500" /> {(member.password || '****').replace(/./g, '*')}
                          </div>
                       </div>

                       <div className="flex gap-2 relative z-10">
                          <button 
                            onClick={(e) => { e.stopPropagation(); setEditingStaff(member); setShowAddStaff(true); }}
                            className="flex-1 py-3 bg-slate-50 text-slate-600 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-blue-600 hover:text-white transition-all border border-slate-100"
                          >
                            Editar
                          </button>
                          <button 
                            onClick={(e) => { e.stopPropagation(); removeStaff(member.id); }}
                            className="p-3 text-red-400 bg-red-50 hover:bg-red-500 hover:text-white rounded-xl transition-all border border-red-100"
                          >
                            <Trash2 size={16} />
                          </button>
                       </div>
                    </div>
                  ))}

                  {staff.length === 0 && (
                    <div className="col-span-full py-20 text-center bg-slate-50 rounded-[3rem] border border-dashed border-slate-200">
                       <Users className="w-16 h-16 mx-auto mb-6 text-slate-300 opacity-20" />
                       <p className="font-black text-xl text-slate-400 uppercase tracking-tighter">Nenhum funcionário registado.</p>
                       <p className="text-slate-400 text-sm font-medium mt-2">Clique em "Adicionar Funcionário" para começar.</p>
                    </div>
                  )}
               </div>
            </motion.div>
          )}

          {activeTab === 'ponto' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 max-w-5xl">
               <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tighter">Relógio de Ponto</h3>
                    <p className="text-slate-400 text-sm font-medium">Controlo de entradas e saídas da equipa</p>
                  </div>
                  <div className="bg-white px-6 py-3 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Hoje</p>
                      <p className="text-lg font-black text-slate-800">{staff.filter(s => s.onDuty).length} Funcionários</p>
                    </div>
                    <div className="w-10 h-10 bg-emerald-50 text-emerald-500 rounded-xl flex items-center justify-center">
                      <Clock size={20} />
                    </div>
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {staff.map((member) => (
                    <div key={member.id} className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm flex items-center justify-between group">
                       <div className="flex items-center gap-4">
                          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-black shadow-lg ${member.onDuty ? 'bg-emerald-500 text-white animate-pulse' : 'bg-slate-100 text-slate-400'}`}>
                             {member.name.charAt(0)}
                          </div>
                          <div>
                             <p className="font-black text-slate-800 tracking-tight">{member.name}</p>
                             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{member.role}</p>
                             <div className="flex items-center gap-2 mt-1">
                               <div className={`w-2 h-2 rounded-full ${member.onDuty ? 'bg-emerald-500' : 'bg-slate-300'}`}></div>
                               <span className={`text-[10px] font-bold uppercase tracking-widest ${member.onDuty ? 'text-emerald-600' : 'text-slate-400'}`}>
                                 {member.onDuty ? 'Em serviço' : 'Fora de serviço'}
                               </span>
                             </div>
                          </div>
                       </div>
                       <button 
                         onClick={() => toggleStaffDuty(member.id)}
                         className={`px-6 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all ${
                           member.onDuty 
                             ? 'bg-red-50 text-red-600 hover:bg-red-600 hover:text-white' 
                             : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-xl shadow-emerald-600/20'
                         }`}
                       >
                         {member.onDuty ? 'Dar Saída' : 'Dar Entrada'}
                       </button>
                    </div>
                  ))}
               </div>

               <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 ml-2">Registos Recentes</h4>
                  <div className="space-y-4">
                    {staff.some(s => s.attendanceLogs?.length > 0) ? (
                      staff.flatMap(s => (s.attendanceLogs || []).map(log => ({ ...log, staffName: s.name, staffRole: s.role })))
                        .sort((a,b) => b.date.localeCompare(a.date))
                        .slice(0, 10)
                        .map((log, i) => (
                          <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                             <div className="flex items-center gap-4">
                                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center font-black text-[10px] text-slate-400 shadow-sm">{log.staffName.charAt(0)}</div>
                                <div>
                                   <p className="text-sm font-bold text-slate-800">{log.staffName}</p>
                                   <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{log.date}</p>
                                </div>
                             </div>
                             <div className="flex gap-8 text-right">
                                <div>
                                   <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Entrada</p>
                                   <p className="text-xs font-black text-slate-800">{log.clockIn}</p>
                                </div>
                                <div>
                                   <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Saída</p>
                                   <p className="text-xs font-black text-slate-800">{log.clockOut || '--:--'}</p>
                                </div>
                                <div className="w-20">
                                   <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Total</p>
                                   <p className="text-xs font-black text-blue-600">{log.totalHours ? `${log.totalHours}h` : '...'}</p>
                                </div>
                             </div>
                          </div>
                        ))
                    ) : (
                      <div className="py-12 text-center text-slate-300">
                        <p className="text-xs font-black uppercase tracking-widest">Nenhum registo encontrado</p>
                      </div>
                    )}
                  </div>
               </div>
            </motion.div>
          )}

          {activeTab === 'ferias' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 max-w-5xl">
               <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tighter">Mapa de Férias</h3>
                    <p className="text-slate-400 text-sm font-medium">Gestão de períodos de descanso da equipa</p>
                  </div>
               </div>

               <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-slate-50">
                          <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Funcionário</th>
                          <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Início</th>
                          <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Fim</th>
                          <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Estado</th>
                          <th className="px-6 py-4 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Ações</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {staff.map((member) => (
                          <tr key={member.id} className="group">
                            <td className="px-6 py-6">
                               <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center font-black text-sm">{member.name.charAt(0)}</div>
                                  <div>
                                     <p className="font-bold text-slate-800">{member.name}</p>
                                     <p className="text-[10px] font-bold text-slate-400 uppercase">{member.role}</p>
                                  </div>
                               </div>
                            </td>
                            <td className="px-6 py-6">
                               <input 
                                 type="date" 
                                 className="bg-slate-50 border border-slate-100 rounded-lg p-2 text-xs font-bold outline-none focus:ring-2 focus:ring-blue-500"
                                 defaultValue={member.vacationStart || ''}
                                 onChange={(e) => setStaffVacation(member.id, e.target.value, member.vacationEnd || null)}
                               />
                            </td>
                            <td className="px-6 py-6">
                               <input 
                                 type="date" 
                                 className="bg-slate-50 border border-slate-100 rounded-lg p-2 text-xs font-bold outline-none focus:ring-2 focus:ring-blue-500"
                                 defaultValue={member.vacationEnd || ''}
                                 onChange={(e) => setStaffVacation(member.id, member.vacationStart || null, e.target.value)}
                               />
                            </td>
                            <td className="px-6 py-6">
                               {member.vacationStart ? (
                                 <span className="px-3 py-1 bg-amber-50 text-amber-600 rounded-full text-[10px] font-black uppercase tracking-widest">Programadas</span>
                               ) : (
                                 <span className="px-3 py-1 bg-slate-50 text-slate-400 rounded-full text-[10px] font-black uppercase tracking-widest">Sem Marcação</span>
                               )}
                            </td>
                            <td className="px-6 py-6 text-right">
                               <button 
                                 onClick={() => setStaffVacation(member.id, null, null)}
                                 className="p-2 text-slate-300 hover:text-red-500 transition-colors"
                                 title="Limpar Férias"
                               >
                                 <Trash2 size={16} />
                               </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
               </div>

               {/* Legend/Info */}
               <div className="mt-8 p-6 bg-blue-50 rounded-3xl border border-blue-100 flex gap-4 items-start">
                  <div className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-900/20">
                     <Info size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-black text-blue-900 uppercase tracking-tighter">Nota Informativa</p>
                    <p className="text-xs text-blue-800/70 font-medium leading-relaxed mt-1">
                      As datas marcadas aqui serão refletidas no estado do funcionário em todo o dashboard. 
                      Funcionários de férias não podem dar entrada no relógio de ponto e aparecem com o badge "De Férias" na lista de equipa.
                    </p>
                  </div>
               </div>
            </motion.div>
          )}

        </div>
      </main>

      {/* Edit Dish Modal */}
      <AnimatePresence>
        {editingDish && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white rounded-[3rem] shadow-2xl w-full max-w-lg overflow-hidden">
               <div className="p-8 border-b border-slate-100 flex justify-between items-center">
                  <h3 className="text-xl font-black text-slate-800 uppercase tracking-tighter">Editar Prato</h3>
                  <button 
                    onClick={() => setEditingDish(null)} 
                    className="p-3 bg-white text-slate-800 hover:bg-blue-600 hover:text-white rounded-full transition-all shadow-lg border border-slate-100 group"
                  >
                    <X size={20} className="group-active:scale-90 transition-transform" />
                  </button>
               </div>
               <form onSubmit={saveDishEdit} className="p-8 space-y-6">
                  <div className="space-y-4">
                    <div className="relative">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block ml-2">Foto (URL ou Upload)</label>
                       <div className="flex gap-2">
                          <input 
                            className="flex-1 bg-slate-50 border border-slate-100 rounded-2xl p-4 font-bold focus:ring-2 focus:ring-blue-500 outline-none" 
                            value={editingDish.dish.image} 
                            onChange={e => setEditingDish({...editingDish, dish: {...editingDish.dish, image: e.target.value}})}
                          />
                          <label className={`p-4 bg-slate-100 text-slate-600 rounded-2xl cursor-pointer hover:bg-blue-600 hover:text-white transition-all flex items-center justify-center ${isUploading ? 'opacity-50' : ''}`}>
                             {isUploading ? '...' : <ImageIcon className="w-5 h-5" />}
                             <input 
                                type="file" 
                                className="hidden" 
                                accept="image/*"
                                onChange={async (e) => {
                                   const file = e.target.files?.[0];
                                   if (file) {
                                      const url = await handleImageUpload(file, 'dish', editingDish.idx);
                                      if (url) {
                                         setEditingDish({ ...editingDish, dish: { ...editingDish.dish, image: url } });
                                      }
                                   }
                                }}
                             />
                          </label>
                       </div>
                    </div>
                    <div>
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block ml-2">Nome</label>
                       <input 
                         className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 font-bold focus:ring-2 focus:ring-blue-500 outline-none" 
                         value={editingDish.dish.name} 
                         onChange={e => setEditingDish({...editingDish, dish: {...editingDish.dish, name: e.target.value}})}
                         required
                       />
                    </div>
                    <div>
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block ml-2">Preço (€)</label>
                       <input 
                         type="number"
                         step="0.01"
                         className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 font-bold focus:ring-2 focus:ring-blue-500 outline-none" 
                         value={editingDish.dish.price} 
                         onChange={e => setEditingDish({...editingDish, dish: {...editingDish.dish, price: parseFloat(e.target.value)}})}
                         required
                       />
                    </div>
                    <div>
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block ml-2">Descrição</label>
                       <textarea 
                         className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 font-bold focus:ring-2 focus:ring-blue-500 outline-none h-32" 
                         value={editingDish.dish.description} 
                         onChange={e => setEditingDish({...editingDish, dish: {...editingDish.dish, description: e.target.value}})}
                       />
                    </div>
                     <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4">
                        <label className="flex items-center gap-2 text-[10px] font-black text-amber-600 uppercase tracking-widest mb-2">
                          <Star className="w-3 h-3" /> Créditos por Item (pré-encomenda ou mesa)
                        </label>
                        <input
                          type="number" step="1" min="0"
                          className="w-full bg-white border border-amber-200 rounded-xl p-3 font-bold focus:ring-2 focus:ring-amber-400 outline-none"
                          value={(editingDish.dish as any).credits || 0}
                          onChange={e => setEditingDish({...editingDish, dish: {...editingDish.dish, credits: parseInt(e.target.value) || 0} as any})}
                          placeholder="0"
                        />
                        <p className="text-[10px] text-amber-600 font-medium mt-1">
                          = €{(((editingDish.dish as any).credits || 0) * ((business as any).creditValue || 0.30)).toFixed(2)} em desconto
                        </p>
                     </div>
                  </div>
                  <div className="flex gap-4 pt-4">
                                       <div className="bg-slate-50 border border-slate-100 rounded-2xl p-3 flex items-center justify-between">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">IVA Acores (taxa regional)</p>
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-black">16% fixo</span>
                  </div>

<button type="submit" className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-blue-500/20 hover:scale-105 active:scale-95 transition-all">Salvar Alterações</button>
                  </div>
               </form>
            </motion.div>
          </div>
        )}

        {editingProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white rounded-[3rem] shadow-2xl w-full max-w-lg overflow-hidden">
               <div className="p-8 border-b border-slate-100 flex justify-between items-center">
                  <h3 className="text-xl font-black text-slate-800 uppercase tracking-tighter">Editar Produto</h3>
                  <button 
                    onClick={() => setEditingProduct(null)} 
                    className="p-3 bg-white text-slate-800 hover:bg-blue-600 hover:text-white rounded-full transition-all shadow-lg border border-slate-100 group"
                  >
                    <X size={20} className="group-active:scale-90 transition-transform" />
                  </button>
               </div>
               <form onSubmit={saveProductEdit} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block ml-2">Categoria</label>
                        <select 
                          className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 font-bold focus:ring-2 focus:ring-blue-500 outline-none appearance-none"
                          value={editingProduct.product.category}
                          onChange={e => setEditingProduct({...editingProduct, product: {...editingProduct.product, category: e.target.value}})}
                        >
                            {['Pratos', 'Bebidas', 'Cafetaria', 'Sobremesas', 'Vinhos', 'Aperitivos', 'Bolos', 'Gelados', 'Entradas', 'Sopas'].map(cat => <option key={cat} value={cat}>{cat}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block ml-2">Fornecedor</label>
                        <select 
                          className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 font-bold focus:ring-2 focus:ring-blue-500 outline-none appearance-none"
                          value={editingProduct.product.supplierId || ''}
                          onChange={e => setEditingProduct({...editingProduct, product: {...editingProduct.product, supplierId: e.target.value}})}
                        >
                            <option value="">Sem Fornecedor</option>
                            {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                        </select>
                      </div>
                    </div>
                    <div>
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block ml-2">Nome do Produto</label>
                       <input 
                         className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 font-bold focus:ring-2 focus:ring-blue-500 outline-none" 
                         value={editingProduct.product.name} 
                         onChange={e => setEditingProduct({...editingProduct, product: {...editingProduct.product, name: e.target.value}})}
                         required
                       />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                       <div>
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block ml-2">Stock Atual</label>
                          <input 
                            type="number"
                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 font-bold focus:ring-2 focus:ring-blue-500 outline-none" 
                            value={editingProduct.product.stock || 0} 
                            onChange={e => setEditingProduct({...editingProduct, product: {...editingProduct.product, stock: parseInt(e.target.value) || 0}})}
                          />
                       </div>
                       <div>
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block ml-2">Stock Mínimo</label>
                          <input 
                            type="number"
                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 font-bold focus:ring-2 focus:ring-blue-500 outline-none" 
                            value={editingProduct.product.minStock || 0} 
                            onChange={e => setEditingProduct({...editingProduct, product: {...editingProduct.product, minStock: parseInt(e.target.value) || 0}})}
                          />
                       </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                       <div>
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block ml-2">Preço Compra (€)</label>
                          <input 
                            type="number" step="0.01"
                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 font-bold focus:ring-2 focus:ring-blue-500 outline-none" 
                            value={editingProduct.product.purchasePrice || 0} 
                            onChange={e => setEditingProduct({...editingProduct, product: {...editingProduct.product, purchasePrice: parseFloat(e.target.value) || 0}})}
                          />
                       </div>
                       <div>
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block ml-2">Preço Venda (€)</label>
                          <input 
                            type="number" step="0.01"
                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 font-bold focus:ring-2 focus:ring-blue-500 outline-none" 
                            value={editingProduct.product.price} 
                            onChange={e => setEditingProduct({...editingProduct, product: {...editingProduct.product, price: parseFloat(e.target.value) || 0}})}
                            required
                          />
                       </div>
                    </div>

                    <div>
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block ml-2">Descrição</label>
                       <textarea 
                         className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 font-bold focus:ring-2 focus:ring-blue-500 outline-none h-20" 
                         value={editingProduct.product.description} 
                         onChange={e => setEditingProduct({...editingProduct, product: {...editingProduct.product, description: e.target.value}})}
                       />
                    </div>
                  </div>
                  <div className="flex gap-4 pt-4">
                                       <div className="bg-slate-50 border border-slate-100 rounded-2xl p-3 flex items-center justify-between">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">IVA Acores (taxa regional)</p>
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-black">16% fixo</span>
                  </div>

<button type="submit" className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-blue-500/20 hover:scale-105 active:scale-95 transition-all">Salvar Produto</button>
                  </div>
               </form>
            </motion.div>
          </div>
        )}

        {selectedResForTable && (
          <div className="fixed bottom-12 left-1/2 -translate-x-1/2 z-50 px-8 py-6 bg-slate-900 text-white rounded-[2rem] shadow-2xl flex items-center gap-8 border border-white/10 animate-in fade-in slide-in-from-bottom-8 duration-500">
             <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center animate-pulse"><TableIcon size={20}/></div>
                <div>
                   <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Ação Necessária</p>
                   <p className="font-bold text-sm tracking-tight text-white/90">Selecione uma mesa livre para a reserva de <span className="text-blue-400">{selectedResForTable.customerName}</span></p>
                </div>
             </div>
             <button onClick={() => setSelectedResForTable(null)} className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-black uppercase tracking-widest transition-all">Cancelar</button>
          </div>
        )}

        {/* Edit Update Modal */}
        {editingUpdate && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white rounded-[3rem] shadow-2xl w-full max-w-lg overflow-hidden max-h-[90vh] flex flex-col">
               <div className="p-8 border-b border-slate-100 flex justify-between items-center flex-shrink-0">
                  <h3 className="text-xl font-black text-slate-800 uppercase tracking-tighter">
                    Editar {editingUpdate.update.type === 'event' ? 'Evento' : 'Novidade'}
                  </h3>
                  <button 
                    type="button" 
                    onClick={() => setEditingUpdate(null)} 
                    className="p-3 bg-white text-slate-800 hover:bg-blue-600 hover:text-white rounded-full transition-all shadow-lg border border-slate-100 group"
                  >
                    <X size={20} className="group-active:scale-90 transition-transform" />
                  </button>
               </div>
               <form onSubmit={saveUpdateEdit} className="p-8 space-y-6 overflow-y-auto custom-scrollbar">
                  <div className="space-y-4">
                    <div>
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block ml-2">Título</label>
                       <input 
                         className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 font-bold focus:ring-2 focus:ring-blue-500 outline-none" 
                         value={editingUpdate.update.title} 
                         onChange={e => setEditingUpdate({...editingUpdate, update: {...editingUpdate.update, title: e.target.value}})}
                         required
                       />
                    </div>
                    <div>
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block ml-2">Descrição</label>
                       <textarea 
                         className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 font-bold focus:ring-2 focus:ring-blue-500 outline-none h-24" 
                         value={editingUpdate.update.description} 
                         onChange={e => setEditingUpdate({...editingUpdate, update: {...editingUpdate.update, description: e.target.value}})}
                         required
                       />
                    </div>

                    {editingUpdate.update.type === 'event' && (
                      <>
                        <div>
                           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block ml-2">Data do Evento</label>
                           <input 
                             type="date"
                             className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 font-bold focus:ring-2 focus:ring-blue-500 outline-none" 
                             value={editingUpdate.update.date || ''} 
                             onChange={e => setEditingUpdate({...editingUpdate, update: {...editingUpdate.update, date: e.target.value}})}
                           />
                        </div>
                        <div>
                           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block ml-2">Imagem (URL)</label>
                           <input 
                             className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 font-bold focus:ring-2 focus:ring-blue-500 outline-none" 
                             value={editingUpdate.update.image || ''} 
                             onChange={e => setEditingUpdate({...editingUpdate, update: {...editingUpdate.update, image: e.target.value}})}
                             placeholder="https://..."
                           />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                           <div>
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block ml-2">Preço por Pax (€)</label>
                              <input 
                                type="number" step="0.01"
                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 font-bold focus:ring-2 focus:ring-blue-500 outline-none" 
                                value={editingUpdate.update.pricePerPerson || ''} 
                                onChange={e => setEditingUpdate({...editingUpdate, update: {...editingUpdate.update, pricePerPerson: parseFloat(e.target.value) || 0}})}
                              />
                           </div>
                           <div>
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block ml-2">Preço por Casal (€)</label>
                              <input 
                                type="number" step="0.01"
                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 font-bold focus:ring-2 focus:ring-blue-500 outline-none" 
                                value={editingUpdate.update.pricePerCouple || ''} 
                                onChange={e => setEditingUpdate({...editingUpdate, update: {...editingUpdate.update, pricePerCouple: parseFloat(e.target.value) || 0}})}
                              />
                           </div>
                        </div>
                      </>
                    )}
                  </div>
                   <div className="flex gap-4 pt-4">
                     <button type="submit" className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-blue-500/20 hover:scale-105 active:scale-95 transition-all">
                        Salvar Alterações
                     </button>
                  </div>
               </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      
      {/* Walk-in Modal */}
      <AnimatePresence>
        {walkInTableId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white rounded-[3rem] shadow-2xl w-full max-w-lg overflow-hidden">
               <div className="p-8 border-b border-slate-100 flex justify-between items-center">
                  <h3 className="text-xl font-black text-slate-800 uppercase tracking-tighter">
                    Registo de Mesa #{tables.find(t => t.id === walkInTableId)?.number}
                  </h3>
                  <button 
                    onClick={() => setWalkInTableId(null)} 
                    className="p-3 bg-white text-slate-800 hover:bg-blue-600 hover:text-white rounded-full transition-all shadow-lg border border-slate-100 group"
                  >
                    <X size={20} className="group-active:scale-90 transition-transform" />
                  </button>
               </div>
               <form onSubmit={handleWalkInSubmit} className="p-8 space-y-6">
                  <div className="space-y-4">
                    <div>
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block ml-2">Pessoas (Pax)</label>
                       <input 
                         name="pax"
                         type="number"
                         min="1"
                         defaultValue="2"
                         required
                         className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 font-bold focus:ring-2 focus:ring-blue-500 outline-none" 
                       />
                    </div>
                    <div>
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block ml-2">Nome do Cliente</label>
                       <input 
                         name="name"
                         required
                         className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 font-bold focus:ring-2 focus:ring-blue-500 outline-none" 
                       />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       <div>
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block ml-2">Telemóvel (Opcional)</label>
                          <input 
                            name="phone"
                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 font-bold focus:ring-2 focus:ring-blue-500 outline-none" 
                          />
                       </div>
                       <div>
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block ml-2">Email (Opcional)</label>
                          <input 
                            name="email"
                            type="email"
                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 font-bold focus:ring-2 focus:ring-blue-500 outline-none" 
                          />
                       </div>
                    </div>
                  </div>
                  <div className="pt-4">
                     <button type="submit" className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-xl shadow-blue-500/20 hover:scale-105 active:scale-95 transition-all">
                        Ocupar Mesa
                     </button>
                  </div>
               </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {/* Add/Edit Staff Modal */}
      <AnimatePresence>
        {showAddStaff && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white rounded-[3rem] shadow-2xl w-full max-w-lg overflow-hidden">
               <div className="p-8 border-b border-slate-100 flex justify-between items-center">
                  <h3 className="text-xl font-black text-slate-800 uppercase tracking-tighter">
                    {editingStaff ? 'Editar Funcionário' : 'Novo Funcionário'}
                  </h3>
                  <button 
                    onClick={() => setShowAddStaff(false)} 
                    className="p-3 bg-white text-slate-800 hover:bg-blue-600 hover:text-white rounded-full transition-all shadow-lg border border-slate-100 group"
                  >
                    <X size={20} className="group-active:scale-90 transition-transform" />
                  </button>
               </div>
               <form onSubmit={saveStaff} className="p-8 space-y-6">
                  <div className="space-y-4">
                    <div>
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block ml-2">Nome Completo</label>
                       <input 
                         name="name"
                         defaultValue={editingStaff?.name || ''}
                         required
                         className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 font-bold focus:ring-2 focus:ring-blue-500 outline-none" 
                       />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       <div>
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block ml-2">Email (Login)</label>
                          <input 
                            name="email"
                            type="email"
                            defaultValue={editingStaff?.email || ''}
                            required
                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 font-bold focus:ring-2 focus:ring-blue-500 outline-none" 
                          />
                       </div>
                       <div>
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block ml-2">Password</label>
                          <input 
                            name="password"
                            type="text"
                            defaultValue={editingStaff?.password || ''}
                            required
                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 font-bold focus:ring-2 focus:ring-blue-500 outline-none" 
                          />
                       </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       <div>
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block ml-2">Telemóvel</label>
                          <input 
                            name="phone"
                            defaultValue={editingStaff?.phone || ''}
                            required
                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 font-bold focus:ring-2 focus:ring-blue-500 outline-none" 
                          />
                       </div>
                       <div>
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block ml-2">Cargo</label>
                          <select 
                            name="role"
                            defaultValue={editingStaff?.role || 'waiter'}
                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 font-bold focus:ring-2 focus:ring-blue-500 outline-none appearance-none"
                          >
                             <option value="waiter">Empregado de Mesa</option>
                             <option value="chef">Cozinheiro</option>
                             <option value="manager">Gerente de Turno</option>
                          </select>
                       </div>
                    </div>
                  </div>

                  <div className="pt-4">
                     <button type="submit" className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-xl shadow-blue-500/20 hover:scale-105 active:scale-95 transition-all">
                        {editingStaff ? 'Guardar Alterações' : 'Criar Funcionário'}
                     </button>
                  </div>
               </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showAddSupplier && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white rounded-[3rem] shadow-2xl w-full max-w-lg overflow-hidden">
               <div className="p-8 border-b border-slate-100 flex justify-between items-center">
                  <h3 className="text-xl font-black text-slate-800 uppercase tracking-tighter">
                    {editingSupplier ? 'Editar Fornecedor' : 'Novo Fornecedor'}
                  </h3>
                  <button 
                    onClick={() => { setShowAddSupplier(false); setEditingSupplier(null); }} 
                    className="p-3 bg-white text-slate-800 hover:bg-blue-600 hover:text-white rounded-full transition-all shadow-lg border border-slate-100 group"
                  >
                    <X size={20} className="group-active:scale-90 transition-transform" />
                  </button>
               </div>
               <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  const newSup = {
                    id: editingSupplier?.id || 'SUP_' + Date.now(),
                    name: formData.get('name') as string,
                    email: formData.get('email') as string,
                    phone: formData.get('phone') as string,
                    nif: formData.get('nif') as string,
                    address: formData.get('address') as string,
                  };
                  const updated = editingSupplier 
                    ? suppliers.map(s => s.id === editingSupplier.id ? newSup : s)
                    : [...suppliers, newSup];
                  setSuppliers(updated);
                  handleUpdate({ suppliers: updated });
                  setShowAddSupplier(false);
                  setEditingSupplier(null);
                }} 
                className="p-8 space-y-4"
              >
                  <div>
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block ml-2">Nome da Empresa</label>
                     <input name="name" defaultValue={editingSupplier?.name} className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 font-bold outline-none focus:ring-2 focus:ring-blue-500" required />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block ml-2">Email</label>
                      <input name="email" type="email" defaultValue={editingSupplier?.email} className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 font-bold outline-none focus:ring-2 focus:ring-blue-500" required />
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block ml-2">Telemóvel</label>
                      <input name="phone" defaultValue={editingSupplier?.phone} className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 font-bold outline-none focus:ring-2 focus:ring-blue-500" required />
                    </div>
                  </div>
                  <div>
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block ml-2">NIF</label>
                     <input name="nif" maxLength={9} defaultValue={editingSupplier?.nif} className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 font-bold outline-none focus:ring-2 focus:ring-blue-500" required />
                  </div>
                  <div>
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block ml-2">Morada</label>
                     <textarea name="address" defaultValue={editingSupplier?.address} className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 font-bold outline-none focus:ring-2 focus:ring-blue-500 h-20" required />
                  </div>
                  <button type="submit" className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-blue-500/20 hover:scale-105 transition-all mt-4">
                    {editingSupplier ? 'Guardar Alterações' : 'Adicionar Fornecedor'}
                  </button>
               </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedStaff && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white rounded-[3rem] shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-slate-900 text-white rounded-2xl flex items-center justify-center text-xl font-black">
                    {selectedStaff.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-800 uppercase tracking-tighter">{selectedStaff.name}</h3>
                    <p className="text-xs font-black text-blue-600 uppercase tracking-widest">{selectedStaff.role}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedStaff(null)} 
                  className="p-3 bg-white text-slate-800 hover:bg-blue-600 hover:text-white rounded-full transition-all shadow-lg border border-slate-100 group"
                >
                  <X size={20} className="group-active:scale-90 transition-transform" />
                </button>
              </div>

              <div className="p-8 overflow-y-auto custom-scrollbar space-y-8">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-4 rounded-2xl">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Email</p>
                    <p className="text-sm font-bold text-slate-700">{selectedStaff.email}</p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-2xl">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Telefone</p>
                    <p className="text-sm font-bold text-slate-700">{selectedStaff.phone}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Relatório Mensal (Abril 2026)</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-blue-600 text-white p-5 rounded-[2rem] shadow-xl shadow-blue-600/20">
                      <p className="text-2xl font-black tabular-nums">
                        {(selectedStaff.attendanceLogs || []).reduce((acc: number, log: any) => acc + (log.totalHours || 0), 0).toFixed(1)}h
                      </p>
                      <p className="text-[9px] font-black uppercase tracking-widest opacity-60">Horas Trabalhadas</p>
                    </div>
                    <div className="bg-emerald-500 text-white p-5 rounded-[2rem] shadow-xl shadow-emerald-500/20">
                      <p className="text-2xl font-black tabular-nums">
                        {(selectedStaff.attendanceLogs || []).length}
                      </p>
                      <p className="text-[9px] font-black uppercase tracking-widest opacity-60">Dias Presente</p>
                    </div>
                    <div className="bg-red-500 text-white p-5 rounded-[2rem] shadow-xl shadow-red-500/20">
                      <p className="text-2xl font-black tabular-nums">
                        {(selectedStaff.attendanceLogs || []).filter((l: any) => l.status === 'unjustified_absence').length}
                      </p>
                      <p className="text-[9px] font-black uppercase tracking-widest opacity-60">Faltas Injust.</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Ações Administrativas</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <button 
                      onClick={() => {
                        const date = prompt("Data da falta (YYYY-MM-DD):", new Date().toISOString().split('T')[0]);
                        if (!date) return;
                        const newLog = { date, clockIn: '--:--', clockOut: '--:--', totalHours: 0, status: 'justified_absence' };
                        const updatedStaff = { ...selectedStaff, attendanceLogs: [...(selectedStaff.attendanceLogs || []), newLog] };
                        const updatedAllStaff = staff.map(s => s.id === selectedStaff.id ? updatedStaff : s);
                        setStaff(updatedAllStaff);
                        handleUpdate({ staff: updatedAllStaff });
                        setSelectedStaff(updatedStaff);
                      }}
                      className="py-3 bg-amber-50 text-amber-600 rounded-xl font-black uppercase text-[10px] tracking-widest border border-amber-100 hover:bg-amber-100 transition-all"
                    >
                      Justificar Falta
                    </button>
                    <button 
                      onClick={() => {
                        const date = prompt("Data da falta (YYYY-MM-DD):", new Date().toISOString().split('T')[0]);
                        if (!date) return;
                        const newLog = { date, clockIn: '--:--', clockOut: '--:--', totalHours: 0, status: 'unjustified_absence' };
                        const updatedStaff = { ...selectedStaff, attendanceLogs: [...(selectedStaff.attendanceLogs || []), newLog] };
                        const updatedAllStaff = staff.map(s => s.id === selectedStaff.id ? updatedStaff : s);
                        setStaff(updatedAllStaff);
                        handleUpdate({ staff: updatedAllStaff });
                        setSelectedStaff(updatedStaff);
                      }}
                      className="py-3 bg-red-50 text-red-600 rounded-xl font-black uppercase text-[10px] tracking-widest border border-red-100 hover:bg-red-100 transition-all"
                    >
                      Marcar Falta Injust.
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Registos de Assiduidade</h4>
                  <div className="bg-slate-50 rounded-[2.5rem] overflow-hidden border border-slate-100">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="bg-slate-100/50">
                          <th className="px-6 py-4 text-left font-black text-slate-400 uppercase tracking-widest">Data</th>
                          <th className="px-6 py-4 text-left font-black text-slate-400 uppercase tracking-widest">Entrada/Saída</th>
                          <th className="px-6 py-4 text-left font-black text-slate-400 uppercase tracking-widest">Total</th>
                          <th className="px-6 py-4 text-left font-black text-slate-400 uppercase tracking-widest">Estado</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {(selectedStaff.attendanceLogs || []).length > 0 ? (selectedStaff.attendanceLogs || []).map((log: any, i: number) => (
                          <tr key={i} className="hover:bg-white transition-colors">
                            <td className="px-6 py-4 font-bold text-slate-700">{log.date}</td>
                            <td className="px-6 py-4 font-medium text-slate-500">{log.clockIn} - {log.clockOut || '--:--'}</td>
                            <td className="px-6 py-4 font-black text-blue-600">{log.totalHours ? `${log.totalHours}h` : '...'}</td>
                            <td className="px-6 py-4">
                              <span className={`px-2 py-1 rounded-md text-[9px] font-black uppercase tracking-widest ${
                                log.status === 'present' ? 'bg-emerald-100 text-emerald-600' :
                                log.status === 'justified_absence' ? 'bg-amber-100 text-amber-600' :
                                'bg-red-100 text-red-600'
                              }`}>
                                {log.status === 'present' ? 'Presente' : 
                                 log.status === 'justified_absence' ? 'Falta Just.' : 'Falta Injust.'}
                              </span>
                            </td>
                          </tr>
                        )) : (
                          <tr>
                            <td colSpan={4} className="px-6 py-12 text-center text-slate-400 font-bold uppercase tracking-widest">Sem registos este mês</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <div className="p-8 border-t border-slate-100 bg-slate-50 flex gap-4">
                <button 
                  onClick={() => setSelectedStaff(null)}
                  className="flex-1 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-black transition-all shadow-xl"
                >
                  Fechar Detalhes
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BusinessDashboard;



