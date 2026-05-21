// Dashboard de Gestão Restaurantes - AzoresToyou
import React, { useState, useEffect } from 'react';
import { Restaurant, Language, Dish, Product, RestaurantTable, Reservation, RestaurantUpdate, KitchenOrder, StaffMember, Service } from '../types';
import { getTranslation } from '../translations';
import { 
  Utensils, Edit, Trash2, Plus, Save, X, LogOut, 
  LayoutDashboard, Image as ImageIcon, CheckCircle, 
  Clock, Coffee, Wine, Beer, ShoppingBag, Users, 
  ChevronRight, Calendar, Table as TableIcon, 
  Check, AlertCircle, MapPin, Search, Star, Megaphone, CalendarPlus, Settings, Phone, Mail, Map as MapIcon, Lock, Receipt, Info,
  QrCode, Printer, ArrowRight, Send, Sparkles, Scissors, Flower, Store, Wrench, Hotel, Car, Package, Menu, BarChart3, DollarSign, Bell, RefreshCw, Eye, ChefHat,
  ScanLine, PackagePlus, Camera, ShoppingCart
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { API_BASE_URL } from '../config';
import AzoresLogo from './AzoresLogo';


interface BusinessDashboardProps {
  business: Restaurant;
  onUpdateBusiness: (updated: Restaurant) => void;
  onSync: (updated: Restaurant) => void;
  onLogout: () => void;
  language?: Language;
  isStaff?: boolean;
  staffRole?: string;
  onForceRefresh?: () => void;
}

type DashboardTab = 'tables' | 'kitchen' | 'pos' | 'reservations' | 'reservas_hotel' | 'dishes' | 'products' | 'dashboard' | 'reviews' | 'updates' | 'settings' | 'gallery' | 'qrcode' | 'staff' | 'business' | 'staff_list' | 'ponto' | 'ferias' | 'suppliers';

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

// ── LIVE CLOCK CARD ──
const LiveClockCard: React.FC<{ businessName: string; island: string }> = ({ businessName, island }) => {
  const [now, setNow] = React.useState(new Date());
  React.useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  const timeStr = now.toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const dateStr = now.toLocaleDateString('pt-PT', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const dateCapital = dateStr.charAt(0).toUpperCase() + dateStr.slice(1);
  const hours = now.getHours();
  const greeting = hours < 12 ? 'Bom Dia' : hours < 19 ? 'Boa Tarde' : 'Boa Noite';
  const greetEmoji = hours < 12 ? '☀️' : hours < 19 ? '🌤️' : '🌙';
  const weatherOptions = ['☁️ 18°C', '⛅ 21°C', '☀️ 24°C', '🌦️ 16°C'];
  const weatherStr = weatherOptions[now.getDate() % 4];
  return (
    <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-[3rem] p-8 overflow-hidden shadow-2xl shadow-slate-900/30">
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-600/10 rounded-full blur-3xl -ml-16 -mb-16 pointer-events-none" />
      <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl">{greetEmoji}</span>
            <p className="text-white/60 text-sm font-black uppercase tracking-[0.2em]">{greeting}, {businessName}</p>
          </div>
          <p className="text-white/40 text-xs font-bold mb-1">{dateCapital}</p>
          <div className="flex items-center gap-3 mt-2">
            <span className="bg-white/10 border border-white/10 text-white/60 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">📍 {island || 'Açores'}</span>
            <span className="bg-white/10 border border-white/10 text-white/60 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">{weatherStr}</span>
          </div>
        </div>
        <div className="text-center">
          <p className="font-mono font-black text-white" style={{ fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', letterSpacing: '0.05em', textShadow: '0 0 40px rgba(59,130,246,0.4)' }}>{timeStr}</p>
          <div className="flex items-center justify-center gap-2 mt-1">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <p className="text-emerald-400 text-[10px] font-black uppercase tracking-widest">Ao Vivo</p>
          </div>
        </div>
        <div className="flex-1 flex justify-end">
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Dia', value: now.toLocaleDateString('pt-PT', { weekday: 'short' }).toUpperCase(), color: 'text-blue-400' },
              { label: 'Semana', value: `Nº ${Math.ceil(now.getDate()/7)}`, color: 'text-emerald-400' },
              { label: 'Mês', value: now.toLocaleDateString('pt-PT', { month: 'short' }).toUpperCase(), color: 'text-amber-400' },
              { label: 'Ano', value: String(now.getFullYear()), color: 'text-purple-400' },
            ].map((s, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-3 text-center">
                <p className={`font-black text-sm ${s.color}`}>{s.value}</p>
                <p className="text-white/30 text-[9px] font-bold uppercase tracking-widest mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ── REPORT EXPORT MENU ──
const ReportExportMenu: React.FC<{ onExport: (period: 'hoje' | 'semana' | 'mes') => void }> = ({ onExport }) => {
  const [open, setOpen] = React.useState(false);
  return (
    <div className="relative">
      <button onClick={() => setOpen(o => !o)} className="flex items-center gap-2 px-5 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-xl shadow-emerald-600/30 active:scale-95">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
        Exportar Relatório
        <svg className={`w-3 h-3 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" /></svg>
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-2 bg-white border border-slate-100 rounded-2xl shadow-2xl shadow-slate-900/10 overflow-hidden z-50 min-w-[180px]">
          {([['hoje', '📅 Hoje'], ['semana', '📆 Esta Semana'], ['mes', '📊 Este Mês']] as ['hoje'|'semana'|'mes', string][]).map(([period, label]) => (
            <button key={period} onClick={() => { onExport(period); setOpen(false); }} className="w-full px-5 py-3 text-left text-xs font-black text-slate-700 uppercase tracking-widest hover:bg-slate-50 transition-all border-b border-slate-50 last:border-0">
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const BusinessDashboard: React.FC<BusinessDashboardProps> = ({

  business,
  onUpdateBusiness,
  onSync,
  onLogout,
  language = 'pt',
  isStaff = false,
  staffRole,
  onForceRefresh
}) => {
  // Se for staff, a aba inicial é cozinha ou pos
  // Detetar automaticamente o endereço do backend
  // API_BASE_URL centralized in config.ts

  const bType = (business.businessType || (business as any).type || '').toLowerCase();
  const isBeauty = bType === 'beauty' || bType === 'beauties' || (!!(business as any).services && !(business as any).dishes && bType !== 'service');
  const isService = bType === 'service' || bType === 'services' || (!!(business as any).services && !(business as any).dishes && !isBeauty);
  const isShop = bType === 'shop' || bType === 'shops' || (!!(business as any).products && !(business as any).dishes && !isBeauty && !isService);
  const isHotel = bType === 'hotel' || bType === 'al' || bType === 'accommodation';
  const isRentCar = bType === 'rentcar' || bType === 'car' || bType === 'rent-a-car';
  const isRestaurant = !isBeauty && !isShop && !isService && !isHotel && !isRentCar;

  const [activeTab, setActiveTab] = useState<DashboardTab>(
    isStaff ? 'kitchen' : 
    isShop ? 'pos' : 
    isBeauty ? 'pos' : 'tables'
  );
  const [reservationsTab, setReservationsTab] = useState<'list' | 'orders'>('list');
  const [editingItem, setEditingItem] = useState<Restaurant | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 1024);
  const [isUploading, setIsUploading] = useState(false);
  const [walkInTableId, setWalkInTableId] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  // Custom Area and Table States
  const [hoveredTableId, setHoveredTableId] = useState<string | number | null>(null);
  const [activeArea, setActiveArea] = useState<string>('Geral');
  const [tableAreas, setTableAreas] = useState<string[]>(() => {
    const existingAreas = (business.tables || [])
      .map((t: any) => t.area)
      .filter((area: any) => typeof area === 'string' && area.trim().length > 0);
    const uniqueAreas = Array.from(new Set(['Geral', ...existingAreas]));
    return uniqueAreas;
  });

  const handleAddArea = () => {
    const areaName = prompt('Introduza o nome da nova área (ex: Esplanada):');
    if (areaName && areaName.trim()) {
      const trimmed = areaName.trim();
      if (!tableAreas.includes(trimmed)) {
        setTableAreas(prev => [...prev, trimmed]);
        setActiveArea(trimmed);
      }
    }
  };

  const handleDeleteTable = (tableId: string | number) => {
    if (!confirm('Eliminar esta mesa permanentemente?')) return;
    const updatedTables = tables.filter(t => t.id !== tableId && String(t.id) !== String(tableId));
    setTables(updatedTables);
    onUpdateBusiness({ ...business, tables: updatedTables });
  };

  const handleDeleteArea = (area: string) => {
    if (area === 'Geral') { alert('Não é possível eliminar a área Geral.'); return; }
    if (!confirm(`Eliminar a área "${area}" e todas as suas mesas?`)) return;
    const updatedTables = tables.filter(t => (t.area || 'Geral') !== area);
    const updatedAreas = tableAreas.filter(a => a !== area);
    setTables(updatedTables);
    setTableAreas(updatedAreas);
    setActiveArea('Geral');
    onUpdateBusiness({ ...business, tables: updatedTables });
  };

  // QR Code state
  const [qrTableTarget, setQrTableTarget] = useState<string | null>(null);
  const [generatedQRUrl, setGeneratedQRUrl] = useState<string | null>(null);
  const [qrDropdownOpen, setQrDropdownOpen] = useState(false);

  const handleGenerateQR = (tableId: string) => {
    const baseUrl = window.location.origin;
    const url = `${baseUrl}/?qr=${business.id}&table=${tableId}`;
    setQrTableTarget(tableId);
    setGeneratedQRUrl(url);
  };

  const handlePrintQR = () => {
    if (!generatedQRUrl || !qrTableTarget) return;
    const table = tables.find(t => String(t.id) === String(qrTableTarget));
    const tableName = table ? `Mesa ${table.number}` : `Mesa ${qrTableTarget}`;
    const win = window.open('', '_blank');
    if (!win) return;
    win.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>QR Code - ${tableName} - ${business.name}</title>
        <style>
          body { font-family: 'Arial', sans-serif; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; background: #fff; }
          .card { text-align: center; padding: 40px; border: 3px solid #1e293b; border-radius: 24px; max-width: 400px; }
          h1 { font-size: 28px; font-weight: 900; color: #1e293b; margin: 0 0 4px; text-transform: uppercase; letter-spacing: -1px; }
          p { color: #64748b; font-size: 14px; margin: 4px 0 24px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; }
          img { width: 240px; height: 240px; }
          .footer { margin-top: 20px; font-size: 12px; color: #94a3b8; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; }
          .url { font-size: 10px; color: #cbd5e1; word-break: break-all; margin-top: 8px; }
        </style>
        <script src="https://cdn.jsdelivr.net/npm/qrcodejs/qrcode.min.js"></script>
      </head>
      <body>
        <div class="card">
          <h1>${business.name}</h1>
          <p>${tableName}</p>
          <div id="qr"></div>
          <p class="footer">📱 Aponte a câmara para pedir</p>
          <p class="url">${generatedQRUrl}</p>
        </div>
        <script>
          new QRCode(document.getElementById('qr'), { text: '${generatedQRUrl}', width: 240, height: 240, colorDark: '#1e293b', colorLight: '#ffffff', correctLevel: QRCode.CorrectLevel.H });
          setTimeout(() => window.print(), 800);
        </script>
      </body>
      </html>
    `);
    win.document.close();
  };

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
  const [selectedTableId, setSelectedTableId] = useState<string | number | null>(null);

  const handleSelectTable = (tableId: string | number | null) => {
    setSelectedTableId(tableId);
    if (!tableId) {
      setPosCart([]);
      return;
    }
    const table = tables.find(t => t.id === tableId || String(t.id) === String(tableId));
    if (table) {
      const cartItems = (table.currentTab || []).map((item: any) => ({
        product: {
          id: item.dish?.id || item.dish?.name || String(Math.random()),
          name: item.dish?.name || item.name,
          price: item.dish?.price || item.price || 0,
          category: item.dish?.category || item.category || 'Ementa',
          image: item.dish?.image || item.image
        } as Product,
        quantity: item.quantity
      }));
      setPosCart(cartItems);
    } else {
      setPosCart([]);
    }
  };

  useEffect(() => {
    if (selectedTableId !== null) {
      const table = tables.find(t => t.id === selectedTableId || String(t.id) === String(selectedTableId));
      if (table) {
        const tableTabItems = posCart.map(item => ({
          dish: {
            id: item.product.id,
            name: item.product.name,
            price: item.product.price,
            category: item.product.category,
            image: item.product.image
          } as Dish,
          quantity: item.quantity
        }));

        const currentTabJson = JSON.stringify(table.currentTab || []);
        const convertedJson = JSON.stringify(tableTabItems);

        if (currentTabJson !== convertedJson) {
          const updatedTables = tables.map(t => {
            if (t.id === selectedTableId || String(t.id) === String(selectedTableId)) {
              return { ...t, currentTab: tableTabItems };
            }
            return t;
          });
          setTables(updatedTables);
          onUpdateBusiness({
            ...business,
            tables: updatedTables
          });
        }
      }
    }
  }, [posCart, selectedTableId]);

  const handleSendToKitchen = (tableId: string | number) => {
    const table = tables.find(t => t.id === tableId || String(t.id) === String(tableId));
    if (!table) return;
    
    const pendingItems = table.pendingOrderItems || [];
    // Filtrar apenas pratos (comida, sopas, entradas, sobremesas) para enviar para a cozinha
    // Itens sem categoria são considerados pratos por defeito
    const drinkCategories = ['bebidas', 'cafetaria', 'vinhos', 'cervejas', 'bebida', 'vinho', 'cerveja', 'bar'];
    const foodItems = pendingItems.filter((item: any) => {
      const cat = (item.dish?.category || item.category || '').toLowerCase().trim();
      return cat === '' || !drinkCategories.includes(cat);
    });
    
    let updatedKitchenOrders = [...(kitchenOrders || [])];
    if (foodItems.length > 0) {
      const newOrder = {
        id: `ORD_${Date.now()}`,
        tableId: String(tableId),
        items: foodItems,
        status: 'pending' as const,
        timestamp: new Date().toISOString()
      };
      updatedKitchenOrders.push(newOrder);
    }
    
    const updatedTables = tables.map(t => {
      if (t.id === tableId || String(t.id) === String(tableId)) {
        return {
          ...t,
          alertStatus: 'none' as const,
          pendingOrderItems: []
        };
      }
      return t;
    });
    
    setTables(updatedTables);
    setKitchenOrders(updatedKitchenOrders as any);
    onUpdateBusiness({
      ...business,
      tables: updatedTables,
      kitchenOrders: updatedKitchenOrders
    });
    
    alert(`👨‍🍳 Pedido enviado com sucesso para a Cozinha! (${foodItems.length} pratos encaminhados)`);
  };

  const handleVerMesa = (tableId: string | number) => {
    const table = tables.find(t => t.id === tableId || String(t.id) === String(tableId));
    if (!table) return;
    
    // 1. Limpar o alerta
    const updatedTables = tables.map(t => {
      if (t.id === tableId || String(t.id) === String(tableId)) {
        return {
          ...t,
          alertStatus: 'none' as const,
          pendingOrderItems: []
        };
      }
      return t;
    });
    setTables(updatedTables);
    onUpdateBusiness({
      ...business,
      tables: updatedTables
    });
    
    // 2. Mudar para a tab POS
    setActiveTab('pos');
    
    // 3. Pré-selecionar a mesa e carregar o carrinho
    handleSelectTable(tableId);
  };

  const handleFinalizeSale = (saveOnly: boolean = false) => {
    if (posCart.length === 0) return;
    
    if (saveOnly) {
      alert("🛎️ Pedido salvo com sucesso! Os itens foram vinculados à mesa.");
      return;
    }
    
    // ── Registar a venda no histórico (salesHistory) ──
    const saleRecord = {
      id: `sale_${Date.now()}`,
      date: new Date().toISOString(),
      tableName: selectedTableId !== null
        ? `Mesa #${tables.find(t => String(t.id) === String(selectedTableId))?.number ?? selectedTableId}`
        : 'Balcão',
      customerName: 'Consumidor Final',
      total: posTotal * 1.10,
      items: posCart.map(i => ({
        name: i.product.name,
        price: i.product.price,
        quantity: i.quantity,
        category: i.product.category || ''
      }))
    };
    const existingSalesHistory: any[] = (business as any).salesHistory || [];
    const updatedSalesHistory = [...existingSalesHistory, saleRecord];

    alert(`✅ Venda registada! €${(posTotal * 1.10).toFixed(2).replace('.', ',')} — Receita atualizada no dashboard.`);
    
    if (selectedTableId !== null) {
      const updatedTables = tables.map(t => {
        if (t.id === selectedTableId || String(t.id) === String(selectedTableId)) {
          return {
            ...t,
            status: 'available' as const,
            customerName: undefined,
            reservationTime: undefined,
            currentTab: [],
            pendingOrderItems: [],
            alertStatus: 'none' as const
          };
        }
        return t;
      });
      setTables(updatedTables);
      
      const updatedReservations = (business.reservations || []).map((r: any) => {
        if (String(r.tableId) === String(selectedTableId) && (r.status === 'accepted' || r.status === 'occupied')) {
          return { ...r, status: 'finished' as const };
        }
        return r;
      });
      
      onUpdateBusiness({
        ...business,
        tables: updatedTables,
        reservations: updatedReservations,
        salesHistory: updatedSalesHistory
      } as any);
      
      setSelectedTableId(null);
    } else {
      // Venda rápida / balcão — só atualiza o salesHistory
      onUpdateBusiness({
        ...business,
        salesHistory: updatedSalesHistory
      } as any);
    }
    
    setPosCart([]);
  };

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

  const [roomFloorFilter, setRoomFloorFilter] = useState<number | 'all'>('all');

  // Local state for management
  const [tables, setTables] = useState<RestaurantTable[]>(() => {
    if (business.tables && business.tables.length > 0) return business.tables;
    if (isHotel) {
      // Gerar 20 quartos padrão (10 por piso)
      const initialRooms: RestaurantTable[] = [];
      for (let f = 1; f <= 2; f++) {
        for (let i = 1; i <= 10; i++) {
          const roomNum = f * 100 + i;
          initialRooms.push({
            id: `R${roomNum}`,
            number: roomNum,
            seats: 2,
            status: 'available',
            floor: f as any // Adicionando propriedade de piso
          } as any);
        }
      }
      return initialRooms;
    }
    return [
      { id: 'T1', number: 1, seats: 2, status: 'available' },
      { id: 'T2', number: 2, seats: 4, status: 'occupied', customerName: 'João Santos', reservationTime: '13:00', currentOrderId: 'K1' },
      { id: 'T3', number: 3, seats: 4, status: 'available' },
      { id: 'T4', number: 4, seats: 6, status: 'reserved', customerName: 'Maria Silva', reservationTime: '20:30' },
      { id: 'T5', number: 5, seats: 2, status: 'available' },
      { id: 'T6', number: 6, seats: 4, status: 'available' },
    ];
  });

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

  const [isSyncingVisual, setIsSyncingVisual] = useState(false);

  const onForceRefreshRef = React.useRef(onForceRefresh);
  useEffect(() => {
    onForceRefreshRef.current = onForceRefresh;
  }, [onForceRefresh]);

  // Auto-Refresh (2 segundos) para manter o dashboard atualizado com novas reservas
  useEffect(() => {
    const refreshInterval = setInterval(() => {
      console.log("⏱️ Auto-refreshing dashboard data from server...");
      setIsSyncingVisual(true);
      if (onForceRefreshRef.current) onForceRefreshRef.current();
      setTimeout(() => setIsSyncingVisual(false), 800);
    }, 2000);
    return () => clearInterval(refreshInterval);
  }, []);

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
    name: business.name || '',
    description: business.description || '',
    stars: (business as any).stars || 4,
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
  const [editingRoom, setEditingRoom] = useState<any | null>(null);
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

  const addRoom = () => {
    const nextNum = tables.length > 0 ? Math.max(...tables.map(t => t.number)) + 1 : 101;
    const nextFloor = nextNum > 200 ? 2 : 1;
    const newRoom: any = {
      id: `R${nextNum}`,
      number: nextNum,
      seats: 2,
      status: 'available',
      floor: nextFloor,
      type: 'Standard',
      amenities: ['Wi-Fi'],
      price_low: 65,
      price_mid: 85,
      price_high: 120,
      images: []
    };
    const newTables = [...tables, newRoom];
    setTables(newTables);
    
    if (isHotel) {
      const newRooms = newTables.map(t => ({
        id: t.id,
        name: t.name || `Quarto ${t.number}`,
        description: t.description || '',
        pricePerNight: t.price_mid || t.price_low || 0,
        image: t.image || (t.images && t.images[0]) || '',
        capacity: t.seats || 2,
        amenities: t.amenities || [],
        gallery: t.images || []
      }));
      handleUpdate({ tables: newTables, rooms: newRooms });
    } else {
      handleUpdate({ tables: newTables });
    }
    
    setEditingRoom({ idx: newTables.length - 1, room: { ...newRoom } });
  };

  const startRoomEdit = (idx: number) => {
    setEditingRoom({ idx, room: { ...tables[idx] } });
  };

  const saveRoomEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingRoom) {
      // Usar o ID para encontrar e atualizar, para ser mais seguro que o index
      const newTables = tables.map(t => t.id === editingRoom.room.id ? editingRoom.room : t);
      setTables(newTables);
      
      if (isHotel) {
        const newRooms = newTables.map(t => ({
          id: t.id,
          name: (t as any).name || `Quarto ${(t as any).number}`,
          description: (t as any).description || '',
          pricePerNight: (t as any).price_mid || (t as any).price_low || 0,
          image: (t as any).image || ((t as any).images && (t as any).images[0]) || '',
          capacity: (t as any).seats || 2,
          amenities: (t as any).amenities || [],
          gallery: (t as any).images || []
        }));
        handleUpdate({ tables: newTables, rooms: newRooms });
      } else {
        handleUpdate({ tables: newTables });
      }
      
      setEditingRoom(null);
      alert("✅ Dados do quarto guardados!");
    }
  };

  const removeRoom = (idx: number) => {
    if (window.confirm("Deseja remover este quarto permanentemente?")) {
      const newTables = tables.filter((_, i) => i !== idx);
      setTables(newTables);
      
      if (isHotel) {
        const newRooms = newTables.map(t => ({
          id: t.id,
          name: t.name || `Quarto ${t.number}`,
          description: t.description || '',
          pricePerNight: t.price_mid || t.price_low || 0,
          image: t.image || (t.images && t.images[0]) || '',
          capacity: t.seats || 2,
          amenities: t.amenities || [],
          gallery: t.images || []
        }));
        handleUpdate({ tables: newTables, rooms: newRooms });
      } else {
        handleUpdate({ tables: newTables });
      }
    }
  };

  const assignReservationToTable = (tableId: string) => {
    if (!acceptingReservation) return;

    // 1. Atualizar o estado da mesa localmente
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

    // 2. Atualizar o estado da reserva localmente
    const updatedReservations = reservations.map(r => {
      if (r.id === acceptingReservation.id) {
        return { ...r, status: 'accepted' as const, tableId };
      }
      return r;
    });

    // 3. Sincronizar localmente para feedback instantâneo
    setTables(updatedTables);
    setReservations(updatedReservations);

    // 4. Sincronizar apenas com a coleção global de reservas
    fetch(`${API_BASE_URL}/api/reservations/${acceptingReservation.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'accepted', tableId, customerName: acceptingReservation.customerName, time: acceptingReservation.time })
    })
    .then(() => {
      if (onForceRefresh) onForceRefresh();
    })
    .catch(err => console.error("Erro ao sincronizar reserva global:", err));

    // 4.5. Enviar pré-pedidos de comida automaticamente para a cozinha
    if (acceptingReservation.preOrder && acceptingReservation.preOrder.length > 0) {
      const newOrder: KitchenOrder = {
        id: `ORD_${Date.now()}`,
        tableId: tableId,
        reservationId: acceptingReservation.id,
        items: acceptingReservation.preOrder,
        status: 'pending_admin',
        timestamp: new Date().toISOString()
      };
      const updatedOrders = [...kitchenOrders, newOrder];
      setKitchenOrders(updatedOrders);
      handleUpdate({ kitchenOrders: updatedOrders });
    }

    // 5. Limpar estado de aceitação
    setAcceptingReservation(null);
    setActiveTab('tables');
    alert('✅ Reserva vinculada à mesa e pré-pedido enviado para a cozinha com sucesso!');
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
    // Abrir imediatamente o modal de edição para o novo prato
    setEditingDish({ idx: newDishes.length - 1, dish: { ...newDish } });
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
    if ((isBeauty || isShop || isHotel) && action === 'accepted') {
      const resObj = reservations.find(r => r.id === id);
      const updatedRes = { ...resObj, status: action, confirmedByRestaurant: true };
      const newReservations = reservations.map(r => r.id === id ? updatedRes : r);
      setReservations(newReservations);
      
      // Sincronizar com a coleção global de reservas para o cliente ver
      fetch(`${API_BASE_URL}/api/reservations/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedRes)
      })
      .then(() => {
        if (onForceRefresh) onForceRefresh();
      })
      .catch(err => console.error("Erro ao sincronizar reserva global:", err));

      // Se for hotel, marcar o quarto como ocupado localmente para feedback imediato
      if (isHotel && resObj?.selectedRoom?.id) {
        const newTables = tables.map(t => 
          t.id === resObj.selectedRoom.id ? { ...t, status: 'occupied' } : t
        );
        setTables(newTables);
      }
      
      alert(`✅ ${isHotel ? 'Reserva' : 'Marcação'} aprovada com sucesso!`);
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
    
    // Sincronizar com a coleção global de reservas para o cliente ver (para todos os tipos de negócios)
    fetch(`${API_BASE_URL}/api/reservations/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: action, tableId: tableId || resObj?.tableId, confirmedByRestaurant: action === 'accepted' })
    })
    .then(() => {
      if (onForceRefresh) onForceRefresh();
    })
    .catch(err => console.error("Erro ao sincronizar reserva global:", err));

    if (action === 'accepted' && tableId) {
      const newTables = tables.map(t => t.id === tableId ? { ...t, status: 'reserved', customerName: resObj?.customerName, reservationTime: resObj?.time } as const : t);
      setTables(newTables);
      
      const foodItems = resObj?.preOrder || resObj?.preorder;
      let updatedKitchenOrders = [...kitchenOrders];

      // Criar Pedido na Cozinha se houver comida localmente para feedback visual imediato
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
      setSelectedResForTable(null);
    }
  };

  const deleteReservation = async (id: string) => {
    if (!window.confirm("⚠️ ELIMINAR PERMANENTEMENTE?\nEsta ação não pode ser desfeita e a reserva desaparecerá de todos os registos (Dashboard e Cliente).")) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/reservations/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        const updatedReservations = reservations.filter(r => r.id !== id);
        setReservations(updatedReservations);
        if (onForceRefresh) onForceRefresh();
        alert("🗑️ Reserva eliminada permanentemente!");
      } else {
        alert("Erro ao eliminar a reserva no servidor.");
      }
    } catch (error) {
      console.error("Erro ao eliminar:", error);
      alert("Erro de ligação ao servidor.");
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
    <div className="min-h-screen bg-slate-50 flex font-sans overflow-hidden relative">
      {/* ── BARRA DE NAVEGAÇÃO MOBILE (Business) ── */}
      <BusinessBottomNav
        activeTab={activeTab}
        onTab={(tab) => setActiveTab(tab as DashboardTab)}
        business={business}
        onUpdateBusiness={onUpdateBusiness}
      />
      {/* Sidebar Toggle Button (Mobile) */}
      <button 
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-6 right-6 z-[60] p-3 bg-slate-900 text-white rounded-2xl shadow-xl active:scale-95 transition-all"
      >
        {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <div className={`fixed left-0 top-0 h-full bg-[#1e293b] text-slate-400 w-80 flex flex-col z-50 border-r border-slate-700/30 shadow-2xl overflow-hidden transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {/* ... existing sidebar content ... */}
          <div className="p-8 flex items-center gap-4 border-b border-white/5 bg-white/5 backdrop-blur-sm">
             <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20">
                <AzoresLogo size={28} color="white" />
             </div>
             <div>
                <h1 className="text-white font-black text-sm uppercase tracking-widest leading-none mb-1">{business.name}</h1>
                <p className="text-[10px] font-bold text-blue-400 uppercase tracking-[0.2em] leading-none">{isHotel ? 'Boutique Hotel' : isRentCar ? 'Rent-a-Car' : 'Gestão de Negócio'}</p>
             </div>
          </div>

          <div className="flex-1 overflow-y-auto py-8 px-4 space-y-1 scrollbar-hide">
            {([
              { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} />, hideForStaff: true },
              { id: 'tables', label: isHotel ? 'Mapa de Quartos' : isRentCar ? 'Frota' : 'Mesas', icon: isHotel ? <Hotel size={18} /> : isRentCar ? <Car size={18} /> : <TableIcon size={18} />, hideForStaff: true },
              (isHotel && { id: 'room_management', label: 'Gestão de Quartos', icon: <Hotel size={18} />, hideForStaff: true }),
              { id: 'products', label: 'Stock de Produtos', icon: <Package size={18} />, hideForStaff: true },
              { id: 'kitchen', label: 'Pedidos Restaurante', icon: <Utensils size={18} />, badge: kitchenOrders.filter(o => o.status !== 'delivered').length },
              { id: 'pos', label: 'Faturação / Bar', icon: <ShoppingBag size={18} /> },
              { id: 'dishes', label: 'Ementa Restaurante', icon: <Utensils size={18} />, hideForStaff: true },
              (isRestaurant && { id: 'reservations', label: 'Reservas Restaurante', icon: <Calendar size={18} />, badge: pendingCount }),
              { id: 'staff_list', label: 'Equipa / Staff', icon: <Users size={18} />, hideForStaff: true },
              { id: 'settings', label: 'Configurações', icon: <Settings size={18} />, hideForStaff: true },
            ] as any[]).filter(item => item && (!isStaff || !item.hideForStaff)).map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between p-4 rounded-xl transition-all duration-300 group ${
                  activeTab === item.id 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 font-black' 
                    : 'hover:bg-white/5 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-lg transition-all ${activeTab === item.id ? 'bg-white/20' : 'group-hover:bg-slate-700'}`}>
                    {item.icon}
                  </div>
                  <span className="text-xs uppercase tracking-widest">{item.label}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="bg-red-500 text-white text-[10px] font-black px-2 py-1 rounded-md animate-pulse shadow-lg shadow-red-500/20">{item.badge}</span>
                )}
              </button>
            ))}
          </div>

          {/* User Profile Card (Estilo Foto 2) */}
          <div className="p-6 border-t border-white/5 bg-slate-900/50 mt-auto">
             <div className="bg-slate-800/40 p-4 rounded-2xl flex items-center gap-4 mb-4 border border-white/5 shadow-inner">
                <div className="w-10 h-10 rounded-xl overflow-hidden border-2 border-blue-500/30">
                   <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Gustavo" alt="Avatar" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 overflow-hidden">
                   <p className="text-white font-black text-xs truncate">Gustavo Pereira</p>
                   <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest truncate">Gerente Geral</p>
                </div>
                <button onClick={onLogout} className="p-2 text-red-400 hover:bg-red-400/10 rounded-xl transition-all">
                   <LogOut size={16} />
                </button>
             </div>
             
             <button 
               onClick={() => { 
                 onSync({ 
                   ...business, 
                   tables, 
                   products, 
                   kitchenOrders, 
                   reservations 
                 }); 
               }}
               className="w-full py-3 bg-emerald-500 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-emerald-500/20"
             >
               Publicar no Servidor
             </button>
          </div>
      </div>

      {/* Main Container */}
      <main className="flex-1 lg:ml-80 min-h-screen flex flex-col relative overflow-hidden">
        {/* Top Header - Estilo Foto 2 */}
        <header className="sticky top-0 bg-white border-b border-slate-100 h-16 md:h-24 flex items-center justify-between px-4 lg:px-10 z-40 shadow-sm">
            <div className="flex items-center gap-2 md:gap-6">
               <button 
                 onClick={() => setSidebarOpen(!sidebarOpen)}
                 className="p-2 md:p-3 bg-slate-50 text-slate-400 rounded-xl md:rounded-2xl hover:bg-blue-50 hover:text-blue-600 transition-all lg:hidden"
               >
                  <Menu size={20} />
               </button>
               <div>
                  <h2 className="text-sm md:text-xl font-black text-slate-800 flex items-center gap-2 md:gap-3">
                     Olá, Gustavo! 👋
                  </h2>
                  <p className="hidden md:block text-[11px] text-slate-400 font-bold uppercase tracking-widest">Aqui está o resumo do seu negócio hoje.</p>
               </div>
            </div>

            <div className="flex items-center gap-2 md:gap-6">
               <div className="hidden sm:flex items-center gap-3 bg-slate-50 px-5 py-3 rounded-2xl border border-slate-100">
                  <Calendar size={18} className="text-blue-500" />
                  <span className="text-xs font-black text-slate-600 uppercase tracking-widest">
                     {new Date().toLocaleDateString('pt-PT', { day: 'numeric', month: 'long' })}
                  </span>
               </div>

               <div className="flex items-center gap-2 md:gap-3">
                  <button onClick={() => window.location.reload()} className="p-2 md:p-3 bg-slate-50 text-slate-400 rounded-xl md:rounded-2xl hover:bg-emerald-50 hover:text-emerald-600 transition-all group">
                     <Clock size={18} className="group-hover:rotate-180 transition-transform duration-500" />
                  </button>
                  <button className="p-2 md:p-3 bg-slate-50 text-slate-400 rounded-xl md:rounded-2xl hover:bg-blue-50 hover:text-blue-600 transition-all relative">
                     <Bell size={18} />
                     <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white shadow-sm"></span>
                  </button>
               </div>
            </div>
        </header>

        <div className="p-4 md:p-8 pb-32">
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
                      <div>
                        <h3 className="text-xl font-black text-slate-800 tracking-tighter uppercase">
                          {isHotel ? 'Mapa de Quartos' : isRentCar ? 'Estado da Frota' : isBeauty ? 'Agenda de Serviços' : isShop ? 'Mapa da Loja' : 'Mapa de Mesas'}
                        </h3>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">
                          {isHotel ? 'Gestão de Ocupação e Limpeza' : isRentCar ? 'Monitorização de Veículos' : isBeauty ? 'Controlo de Marcações' : isShop ? 'Gestão de Secções' : 'Gestão de Lotação em Tempo Real'}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                         {/* Legend */}
                         <div className="hidden md:flex items-center gap-6 mr-8">
                            <div className="flex items-center gap-2">
                               <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/20"></div>
                               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{isHotel ? 'LIVRE' : isRentCar ? 'DISPONÍVEL' : 'LIVRE'}</span>
                            </div>
                            <div className="flex items-center gap-2">
                               <div className="w-3 h-3 rounded-full bg-slate-900 shadow-lg shadow-slate-900/20"></div>
                               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{isHotel ? 'OCUPADO' : isRentCar ? 'ALUGADO' : 'OCUPADA'}</span>
                            </div>
                            <div className="flex items-center gap-2">
                               <div className="w-3 h-3 rounded-full bg-blue-500 shadow-lg shadow-blue-500/20"></div>
                               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{isHotel ? 'RESERVADO' : isRentCar ? 'MANUTENÇÃO' : 'RESERVADA'}</span>
                            </div>
                         </div>

                          <button 
                            onClick={handleAddArea}
                            className="px-6 py-3 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center gap-2 shadow-sm mr-2"
                          >
                            <Plus size={16} />
                            Nova Área
                          </button>

                          <button 
                            onClick={() => {
                              const newTableNum = business.tables ? business.tables.length + 1 : 1;
                              const newTable: any = { 
                                id: Date.now(), 
                                number: newTableNum, 
                                status: 'available', 
                                seats: 4, 
                                x: 100, 
                                y: 100,
                                area: activeArea 
                              };
                              onUpdateBusiness({ ...business, tables: [...(business.tables || []), newTable] });
                            }}
                            className="px-6 py-3 bg-white border border-slate-200 text-slate-800 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm"
                          >
                            <Plus size={16} />
                            {isHotel ? 'Novo Quarto' : isRentCar ? 'Novo Veículo' : isBeauty ? 'Nova Cadeira' : isShop ? 'Nova Secção' : 'Nova Mesa'}
                          </button>
                      </div>
                   </div>

                   {/* ── QR CODE PANEL ── */}
                   {!isHotel && !isRentCar && (
                     <div className="mb-8 bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-6 border border-white/10 shadow-2xl">
                       <div className="flex flex-col md:flex-row gap-6 items-start">
                         {/* Left: controls */}
                         <div className="flex-1">
                           <div className="flex items-center gap-3 mb-4">
                             <div className="w-10 h-10 bg-blue-500/20 rounded-2xl flex items-center justify-center">
                               <QrCode size={20} className="text-blue-400" />
                             </div>
                             <div>
                               <p className="text-white font-black text-sm uppercase tracking-widest">QR Code por Mesa</p>
                               <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Cliente escaneia → entra direto no menu, sem login</p>
                             </div>
                           </div>
                           
                            {/* Custom dark dropdown + action buttons */}
                            <div className="flex flex-wrap gap-3 items-center">
                              {/* Custom dropdown */}
                              <div className="relative">
                                <button
                                  onClick={() => setQrDropdownOpen(prev => !prev)}
                                  className="flex items-center gap-3 bg-white/10 hover:bg-white/15 text-white border border-white/20 rounded-xl px-4 py-2.5 text-xs font-bold uppercase tracking-widest transition-all min-w-[190px] justify-between"
                                >
                                  <span className="truncate">
                                    {qrTableTarget
                                      ? (() => { const t = tables.find(x => String(x.id) === String(qrTableTarget)); return t ? `Mesa ${t.number}${t.area && t.area !== 'Geral' ? ` · ${t.area}` : ''}` : 'Mesa'; })()
                                      : 'Escolher mesa...'}
                                  </span>
                                  <ChevronRight size={12} className={`flex-shrink-0 transition-transform duration-200 ${qrDropdownOpen ? 'rotate-90' : ''}`} />
                                </button>
                                <AnimatePresence>
                                  {qrDropdownOpen && (
                                    <motion.div
                                      initial={{ opacity: 0, y: -6, scale: 0.97 }}
                                      animate={{ opacity: 1, y: 0, scale: 1 }}
                                      exit={{ opacity: 0, y: -6, scale: 0.97 }}
                                      transition={{ duration: 0.15 }}
                                      className="absolute top-full left-0 mt-2 z-[300] bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden min-w-[220px] max-h-60 overflow-y-auto"
                                    >
                                      {tables.length === 0 && (
                                        <p className="text-slate-400 text-xs px-4 py-4 font-bold uppercase tracking-widest text-center">Sem mesas criadas</p>
                                      )}
                                      {tables.map(t => (
                                        <button
                                          key={t.id}
                                          onClick={() => { setQrTableTarget(String(t.id)); setGeneratedQRUrl(null); setQrDropdownOpen(false); }}
                                          className={`w-full text-left px-4 py-3 text-xs font-bold uppercase tracking-widest transition-all flex items-center justify-between gap-3 border-b border-white/5 last:border-0 ${
                                            String(qrTableTarget) === String(t.id)
                                              ? 'bg-blue-600 text-white'
                                              : 'text-slate-200 hover:bg-white/10'
                                          }`}
                                        >
                                          <span>Mesa {t.number}{t.area && t.area !== 'Geral' ? ` · ${t.area}` : ''}</span>
                                          <span className={`text-[8px] px-2 py-0.5 rounded-full font-black uppercase flex-shrink-0 ${
                                            t.status === 'occupied' ? 'bg-red-500/30 text-red-300' :
                                            t.status === 'reserved' ? 'bg-orange-500/30 text-orange-300' :
                                            'bg-emerald-500/30 text-emerald-300'
                                          }`}>{t.status === 'occupied' ? 'Em uso' : t.status === 'reserved' ? 'Reserv.' : 'Livre'}</span>
                                        </button>
                                      ))}
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>
                              {/* Generate */}
                              <button
                                onClick={() => qrTableTarget && handleGenerateQR(qrTableTarget)}
                                disabled={!qrTableTarget}
                                className="px-5 py-2.5 bg-blue-500 hover:bg-blue-400 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl font-black text-xs uppercase tracking-widest transition-all flex items-center gap-2 shadow-lg shadow-blue-500/20"
                              >
                                <QrCode size={14} />
                                Gerar QR Code
                              </button>
                              {/* Print */}
                              <button
                                onClick={handlePrintQR}
                                disabled={!generatedQRUrl}
                                className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl font-black text-xs uppercase tracking-widest transition-all flex items-center gap-2 shadow-lg shadow-emerald-500/20"
                              >
                                <Printer size={14} />
                                Imprimir QR Code
                              </button>
                            </div>
                            {generatedQRUrl && (
                              <p className="mt-3 text-slate-400 text-[10px] font-mono break-all border-t border-white/10 pt-3">{generatedQRUrl}</p>
                            )}
                         </div>
                         {/* Right: QR preview */}
                         {generatedQRUrl && (
                           <div className="flex flex-col items-center gap-3 bg-white rounded-2xl p-4 min-w-[160px]">
                             <div id={`qr-preview-${qrTableTarget}`} className="w-32 h-32">
                               {/* QR renderizado via canvas inline */}
                               <img
                                 src={`https://api.qrserver.com/v1/create-qr-code/?size=128x128&data=${encodeURIComponent(generatedQRUrl)}&color=1e293b&bgcolor=ffffff`}
                                 alt="QR Code"
                                 className="w-32 h-32 rounded-xl"
                               />
                             </div>
                             <p className="text-slate-700 font-black text-xs uppercase tracking-widest text-center">
                               {tables.find(t => String(t.id) === String(qrTableTarget)) 
                                 ? `Mesa ${tables.find(t => String(t.id) === String(qrTableTarget))!.number}` 
                                 : ''}
                             </p>
                           </div>
                         )}
                       </div>
                     </div>
                   )}

                    <div className="flex flex-wrap items-center gap-2 mb-8 bg-slate-100/50 p-2 rounded-3xl border border-slate-200/50 max-w-max">
                      {tableAreas.map(area => (
                        <div key={area} className="flex items-center gap-1">
                          <button
                            onClick={() => setActiveArea(area)}
                            className={`px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${
                              activeArea === area
                                ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/20'
                                : 'bg-white/80 text-slate-500 hover:bg-white border border-slate-100 hover:text-slate-700'
                            }`}
                          >
                            {area}
                          </button>
                          {area !== 'Geral' && (
                            <button
                              onClick={() => handleDeleteArea(area)}
                              title={`Eliminar área ${area}`}
                              className="w-6 h-6 rounded-full bg-red-100 hover:bg-red-500 text-red-400 hover:text-white flex items-center justify-center transition-all"
                            >
                              <X size={10} />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>

                   <div className="bg-slate-50 border border-slate-100 rounded-3xl md:rounded-[3rem] p-4 md:p-12 min-h-[600px] shadow-inner flex items-center justify-center relative overflow-hidden">
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8 lg:gap-12 w-full max-w-4xl">
                         {tables.filter(t => (t.area || 'Geral') === activeArea).map(table => (
                           <motion.div 
                             key={table.id}
                             whileHover={{ scale: 1.05 }}
                             onMouseEnter={() => setHoveredTableId(table.id)}
                             onMouseLeave={() => setHoveredTableId(null)}
                             className="relative"
                           >
                              <motion.button 
                                whileTap={{ scale: 0.9 }}
                                onClick={(e) => {
                                  if (table.alertStatus === 'new_order' || (table.pendingOrderItems && table.pendingOrderItems.length > 0)) {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setHoveredTableId(hoveredTableId === table.id || String(hoveredTableId) === String(table.id) ? null : table.id);
                                  } else {
                                    toggleTableStatus(table.id);
                                  }
                                }}
                                className={`aspect-square w-full rounded-[2.5rem] p-6 flex flex-col items-center justify-center transition-all duration-500 shadow-xl relative group ${
                                  acceptingReservation ? (table.status === 'available' ? 'bg-emerald-50 border-4 border-emerald-500 scale-110 shadow-emerald-500/20' : 'bg-slate-50 opacity-40 grayscale pointer-events-none') :
                                  selectedResForTable ? (table.status === 'available' ? 'bg-emerald-50 border-emerald-200 ring-2 ring-emerald-500' : 'bg-slate-50 opacity-40 grayscale pointer-events-none') :
                                  table.status === 'available' ? 'bg-white text-slate-800 border-2 border-slate-100' :
                                  table.status === 'occupied' ? 'bg-slate-900 text-white' : 'bg-blue-600 text-white'
                                }`}
                              >
                                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 transition-colors ${
                                    table.status === 'occupied' ? 'bg-white/10 text-white' : 
                                    table.status === 'reserved' ? 'bg-blue-500/20 text-blue-600' : 
                                    'bg-blue-50 text-blue-600'
                                  }`}>
                                    {isHotel ? <Hotel size={24} /> : isRentCar ? <Car size={24} /> : isBeauty ? <Scissors size={24} /> : isShop ? <Store size={24} /> : <TableIcon size={24} />}
                                  </div>
                                  <div className="text-center">
                                    <span className={`text-xl font-black block leading-none ${table.status === 'occupied' ? 'text-white' : 'text-slate-800'}`}>
                                      #{table.number}
                                    </span>
                                    <div className="flex items-center justify-center gap-1 mt-1.5 opacity-30">
                                       {[...Array(isHotel ? 2 : isRentCar ? 5 : 4)].map((_, i) => (
                                         <div key={i} className={`w-1.5 h-1.5 rounded-full ${table.status === 'occupied' ? 'bg-white' : 'bg-slate-800'}`}></div>
                                       ))}
                                    </div>
                                  </div>
                                  
                                  {/* Status Badge */}
                                  <div className={`absolute -top-2 -right-2 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest shadow-lg ${
                                    table.status === 'occupied' ? 'bg-red-500 text-white' : 
                                    table.status === 'reserved' ? 'bg-orange-500 text-white' : 
                                    'bg-emerald-500 text-white'
                                  }`}>
                                    {table.status === 'occupied' ? (isHotel ? 'EM USO' : isRentCar ? 'ALUGADO' : 'EM USO') : 
                                     table.status === 'reserved' ? (isHotel ? 'RESERVADO' : isRentCar ? 'INDISP.' : 'RESERVADA') : 
                                     'LIVRE'}
                                  </div>

                                  {/* Pulsing alert badge for new remote orders */}
                                  {(table.alertStatus === 'new_order' || (table.pendingOrderItems && table.pendingOrderItems.length > 0)) && (
                                    <div className="absolute -top-2 -left-2 flex h-6 w-6 z-40">
                                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                      <span className="relative inline-flex rounded-full h-6 w-6 bg-gradient-to-tr from-red-500 to-rose-600 border-2 border-white shadow-lg flex items-center justify-center text-[9px] font-black text-white">
                                        !
                                      </span>
                                    </div>
                                  )}
                              </motion.button>

                              {/* Delete table button — top left, visible on hover */}
                              <button
                                onClick={(e) => { e.stopPropagation(); handleDeleteTable(table.id); }}
                                title="Eliminar mesa"
                                className="absolute -bottom-2 -left-2 z-50 w-7 h-7 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110"
                              >
                                <Trash2 size={11} />
                              </button>

                               <AnimatePresence>
                                {(hoveredTableId === table.id || String(hoveredTableId) === String(table.id)) && (table.alertStatus === 'new_order' || (table.pendingOrderItems && table.pendingOrderItems.length > 0)) && (
                                  <motion.div 
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.2, ease: "easeOut" }}
                                    className="absolute inset-0 bg-slate-950/95 backdrop-blur-md border border-slate-800 text-white rounded-[2.5rem] p-3.5 flex flex-col items-center justify-center gap-1.5 z-[100] text-center shadow-2xl overflow-hidden"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <div className="flex items-center justify-center gap-1 shrink-0">
                                      <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
                                      <p className="text-[8px] font-black text-red-500 uppercase tracking-widest leading-none">Novo Pedido</p>
                                    </div>
                                    
                                    {/* Compact scrollable items list */}
                                    <div className="w-full flex-1 max-h-12 overflow-y-auto custom-scrollbar space-y-0.5 py-1 px-1.5 bg-white/5 rounded-xl text-center select-none text-[8px] font-bold text-slate-300">
                                      {(table.pendingOrderItems || []).map((item: any, idx: number) => (
                                        <p key={idx} className="truncate">
                                          <span className="text-orange-400 font-black mr-0.5">{item.quantity}x</span> {item.dish?.name || item.name}
                                        </p>
                                      ))}
                                    </div>
                                    
                                    <div className="w-full flex flex-col gap-1 shrink-0">
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleSendToKitchen(table.id);
                                          setHoveredTableId(null);
                                        }}
                                        className="py-1.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl text-[8px] font-black uppercase tracking-widest hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-1 shadow-md shadow-emerald-500/20 cursor-pointer"
                                      >
                                        <ChefHat size={10} />
                                        Enviar Pedido
                                      </button>
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleVerMesa(table.id);
                                          setHoveredTableId(null);
                                        }}
                                        className="py-1.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl text-[8px] font-black uppercase tracking-widest hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-1 shadow-md shadow-blue-500/20 cursor-pointer"
                                      >
                                        <Eye size={10} />
                                        Ver Pedido
                                      </button>
                                    </div>
                                  </motion.div>
                                )}
                               </AnimatePresence>
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
                             (statusGroup.id === 'pending' && (o.status === 'waiting_confirmation' || o.status === 'sent_to_kitchen' || o.status === 'pending_admin'))
                           ).length}
                        </span>
                     </div>

                     <div className="space-y-4 flex-1">
                        <AnimatePresence mode="popLayout">
                          {kitchenOrders
                            .filter(o => 
                              o.status === statusGroup.id || 
                              (statusGroup.id === 'preparing' && o.status === 'preparando') ||
                              (statusGroup.id === 'pending' && (o.status === 'waiting_confirmation' || o.status === 'sent_to_kitchen' || o.status === 'pending_admin'))
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
                          
                          {kitchenOrders.filter(o => 
                             o.status === statusGroup.id || 
                             (statusGroup.id === 'preparing' && o.status === 'preparando') ||
                             (statusGroup.id === 'pending' && (o.status === 'waiting_confirmation' || o.status === 'sent_to_kitchen' || o.status === 'pending_admin'))
                          ).length === 0 && (
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
            
            const availableCategories = isBeauty ? BEAUTY_POS_CATEGORIES : isShop ? SHOP_POS_CATEGORIES : POS_CATEGORIES;
            const currentCategories = Array.from(new Set(posProducts.map(p => p.category)));
            const allCats = ['Todos', ...Array.from(new Set([...availableCategories, ...currentCategories]))].filter(cat => isBeauty ? (cat === 'Todos' || BEAUTY_POS_CATEGORIES.includes(cat)) : isShop ? (cat === 'Todos' || SHOP_POS_CATEGORIES.includes(cat)) : true);

            const filtered = posCategory === 'Todos' ? posProducts : posProducts.filter(p => p.category === posCategory);

            return (
              <>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col h-[calc(100vh-140px)] bg-[#f8f9fa] -m-8 overflow-hidden">
                {/* POS TOP BAR (Search & Table) */}
                <div className="bg-white border-b border-slate-100 px-8 py-4 flex items-center justify-between shadow-sm z-10">
                  <div className="flex items-center gap-8 flex-1 max-w-3xl">
                    <h2 className="text-xl font-black text-slate-800 tracking-tighter whitespace-nowrap">POS - Vendas</h2>
                    <div className="relative flex-1">
                       <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                       <input 
                         type="text" 
                         placeholder="Buscar produtos... (Ctrl + K)" 
                         className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3 pl-12 pr-4 font-bold text-sm focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                       />
                       <div className="absolute right-4 top-1/2 -translate-y-1/2 bg-slate-200 text-slate-500 text-[10px] px-1.5 py-0.5 rounded font-black">Ctrl + K</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-100">
                       <TableIcon size={16} className="text-slate-400" />
                       <select 
                         value={selectedTableId === null ? 'fast' : String(selectedTableId)}
                         onChange={(e) => {
                           const val = e.target.value;
                           handleSelectTable(val === 'fast' ? null : isNaN(Number(val)) ? val : Number(val));
                         }}
                         className="bg-transparent font-black text-xs uppercase outline-none"
                       >
                          <option value="fast">Venda Rápida / Balcão</option>
                          {tables.map(t => (
                            <option key={t.id} value={String(t.id)}>Mesa #{t.number} ({t.status === 'occupied' ? 'Ocupada' : 'Livre'})</option>
                          ))}
                       </select>
                    </div>
                    <button className="flex items-center gap-2 bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-100 hover:bg-slate-100 transition-all">
                       <Users size={16} className="text-slate-400" />
                       <span className="font-black text-xs uppercase tracking-widest">Cliente +</span>
                    </button>
                  </div>
                </div>

                {/* MODERN HORIZONTAL TABLE FILTERS */}
                {!isBeauty && !isShop && tables.length > 0 && (
                  <div className="bg-white border-b border-slate-100 px-8 py-3.5 flex items-center gap-3 overflow-x-auto custom-scrollbar flex-shrink-0 z-10">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mr-2 whitespace-nowrap">Filtrar por Mesa:</span>
                    <button
                      onClick={() => handleSelectTable(null)}
                      className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap border flex items-center gap-2 ${
                        selectedTableId === null
                          ? 'bg-slate-900 text-white border-slate-900 shadow-lg shadow-slate-950/20'
                          : 'bg-slate-50 text-slate-400 border-slate-200 hover:border-slate-300 hover:text-slate-600'
                      }`}
                    >
                      <Users size={12} />
                      Venda Rápida
                    </button>
                    {tables.map(t => {
                      const isSelected = selectedTableId === t.id || String(selectedTableId) === String(t.id);
                      const isOccupied = t.status === 'occupied';
                      const isReserved = t.status === 'reserved';
                      const hasItems = t.currentTab && t.currentTab.length > 0;
                      return (
                        <button
                          key={t.id}
                          onClick={() => handleSelectTable(t.id)}
                          className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap border flex items-center gap-2.5 relative ${
                            isSelected
                              ? 'bg-orange-500 text-white border-orange-500 shadow-lg shadow-orange-500/20'
                              : isOccupied
                                ? 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100 shadow-sm'
                                : isReserved
                                  ? 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 shadow-sm'
                                  : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:text-slate-800'
                          }`}
                        >
                          <TableIcon size={12} className={isSelected ? 'text-white' : isOccupied ? 'text-red-500 animate-pulse' : 'text-slate-400'} />
                          <span>Mesa #{t.number}</span>
                          {hasItems && (
                            <span className={`w-2 h-2 rounded-full absolute -top-1 -right-1 border border-white ${isSelected ? 'bg-white' : 'bg-red-500'} animate-pulse shadow-md`} />
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}

                <div className="flex flex-1 min-h-0">
                  {/* MAIN CONTENT AREA */}
                  <div className="flex-1 flex flex-col min-w-0">
                    {/* Horizontal Categories */}
                    <div className="px-8 py-4 bg-white/50 border-b border-slate-100 overflow-x-auto custom-scrollbar flex gap-3 flex-shrink-0">
                       {allCats.map(cat => (
                         <button
                           key={cat}
                           onClick={() => setPosCategory(cat)}
                           className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap border ${
                             posCategory === cat 
                               ? 'bg-orange-500 text-white border-orange-500 shadow-lg shadow-orange-500/20' 
                               : 'bg-white text-slate-400 border-slate-200 hover:border-slate-400 hover:text-slate-600'
                           }`}
                         >
                           {cat}
                         </button>
                       ))}
                    </div>

                    {/* Products Grid */}
                    <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
                       <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                         {filtered.map((product) => (
                           <motion.button
                             key={product.id}
                             whileTap={{ scale: 0.98 }}
                             onClick={() => addToPosCart(product as Product)}
                             className="bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all text-left flex flex-col group border border-slate-100"
                           >
                             <div className="aspect-square bg-slate-100 relative overflow-hidden">
                               {product.image ? (
                                 <img src={product.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                               ) : (
                                 <div className="w-full h-full flex flex-col items-center justify-center text-slate-300">
                                   <Utensils size={40} className="mb-2 opacity-20" />
                                   <p className="text-[10px] font-black uppercase opacity-40">Sem Foto</p>
                                 </div>
                               )}
                               <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                             </div>
                             <div className="p-5 flex-1 flex flex-col">
                               <p className="font-black text-slate-800 text-sm leading-tight mb-2 flex-1">{product.name}</p>
                               <p className="font-black text-slate-800 text-lg">€{(Number(product.price) || 0).toFixed(2).replace('.', ',')}</p>
                             </div>
                           </motion.button>
                         ))}
                       </div>
                    </div>

                    {/* SHORTCUTS BAR (Rodapé da área central) */}
                    <div className="px-8 py-4 bg-white border-t border-slate-100 grid grid-cols-5 gap-4 flex-shrink-0">
                       {[
                         { icon: <DollarSign size={18} />, label: 'Desconto', key: 'F4', color: 'text-emerald-600 bg-emerald-50' },
                         { icon: <Info size={18} />, label: 'Observação', key: 'F5', color: 'text-blue-600 bg-blue-50' },
                         { icon: <Users size={18} />, label: 'Cliente', key: 'F6', color: 'text-purple-600 bg-purple-50' },
                         { icon: <X size={18} />, label: 'Cancelar item', key: 'Del', color: 'text-red-600 bg-red-50' },
                         { icon: <RefreshCw size={18} />, label: 'Limpar venda', key: 'F7', color: 'text-orange-600 bg-orange-50' },
                       ].map((btn, i) => (
                         <button key={i} className="flex flex-col items-center justify-center p-3 rounded-2xl hover:bg-slate-50 transition-all border border-slate-100 group">
                            <div className={`w-10 h-10 ${btn.color} rounded-xl flex items-center justify-center mb-2 group-hover:scale-110 transition-transform`}>
                               {btn.icon}
                            </div>
                            <p className="text-[10px] font-black text-slate-800 uppercase tracking-widest">{btn.label}</p>
                            <span className="text-[9px] font-bold text-slate-400 mt-0.5">{btn.key}</span>
                         </button>
                       ))}
                    </div>
                  </div>

                  {/* RIGHT SIDEBAR: TICKET */}
                  <div className="w-[400px] bg-white border-l border-slate-100 flex flex-col shadow-2xl z-20">
                    <div className="p-8 border-b border-slate-100">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-black text-slate-800 tracking-tighter">Pedido atual</h3>
                        <span className="px-3 py-1 bg-slate-100 text-slate-500 text-[10px] font-black rounded-full uppercase">{posCart.reduce((a,i) => a + i.quantity, 0)} itens</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-400">
                         <Receipt size={16} />
                         <span className="text-[10px] font-black uppercase tracking-widest italic">#{Math.floor(Date.now() / 1000).toString().slice(-6)}</span>
                      </div>
                    </div>

                    <div className="flex-1 overflow-y-auto custom-scrollbar px-6 py-4 space-y-4">
                      {posCart.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full opacity-10 py-12">
                          <ShoppingBag size={80} className="mb-4" />
                          <p className="text-lg font-black uppercase tracking-widest text-center">Inicie uma venda adicionando produtos</p>
                        </div>
                      ) : posCart.map((item) => (
                        <motion.div
                          key={item.product.id}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="flex gap-4 group"
                        >
                          <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 font-black border border-slate-100 overflow-hidden">
                             {item.product.image ? <img src={item.product.image} className="w-full h-full object-cover" /> : <ShoppingBag size={20} />}
                          </div>
                          <div className="flex-1">
                             <div className="flex justify-between items-start mb-1">
                               <p className="font-black text-slate-800 text-sm leading-tight">{item.product.name}</p>
                               <button onClick={() => removeFromPosCart(item.product.id)} className="text-red-400 hover:text-red-600 transition-colors"><X size={14} /></button>
                             </div>
                             <div className="flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                   <div className="flex items-center bg-slate-50 border border-slate-200 rounded-lg overflow-hidden">
                                      <button onClick={() => updatePosQuantity(item.product.id, -1)} className="px-2 py-1 text-slate-400 hover:bg-slate-200 transition-colors">-</button>
                                      <span className="px-2 text-xs font-black text-slate-600 min-w-[20px] text-center">{item.quantity}</span>
                                      <button onClick={() => updatePosQuantity(item.product.id, 1)} className="px-2 py-1 text-slate-400 hover:bg-slate-200 transition-colors">+</button>
                                   </div>
                                   <span className="text-[10px] font-bold text-slate-400">€{item.product.price.toFixed(2)} / un</span>
                                </div>
                                <p className="font-black text-slate-800 text-sm">€{(item.product.price * item.quantity).toFixed(2).replace('.', ',')}</p>
                             </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    <div className="p-8 bg-slate-50/50 border-t border-slate-100 space-y-6">
                      <div className="space-y-3">
                        <div className="flex justify-between text-xs font-bold text-slate-400">
                          <span>Subtotal</span>
                          <span className="text-slate-600 uppercase tracking-tighter font-black text-sm">€{posTotal.toFixed(2).replace('.', ',')}</span>
                        </div>
                        <div className="flex justify-between text-xs font-bold text-slate-400">
                          <span>Desconto</span>
                          <span className="text-orange-500 font-black">- €0,00</span>
                        </div>
                        <div className="flex justify-between text-xs font-bold text-slate-400">
                          <span>Taxa de serviço (10%)</span>
                          <span className="text-slate-600 font-black">€{(posTotal * 0.10).toFixed(2).replace('.', ',')}</span>
                        </div>
                      </div>

                      <div className="flex justify-between items-end">
                        <span className="text-xl font-black text-slate-900 tracking-tighter uppercase">Total</span>
                        <span className="text-4xl font-black text-emerald-600 tracking-tighter">€{(posTotal * 1.10).toFixed(2).replace('.', ',')}</span>
                      </div>

                      <div className="grid grid-cols-1 gap-3 pt-4">
                        <button 
                          onClick={() => handleFinalizeSale(true)}
                          className="w-full py-5 bg-orange-100 text-orange-600 rounded-[1.5rem] font-black uppercase text-xs tracking-[0.2em] hover:bg-orange-200 transition-all flex items-center justify-center gap-3"
                        >
                           <Save size={18} /> Salvar Pedido (F8)
                        </button>
                        <button 
                          onClick={() => handleFinalizeSale(false)}
                          className="w-full py-6 bg-orange-500 text-white rounded-[2rem] font-black uppercase text-sm tracking-[0.2em] shadow-2xl shadow-orange-500/40 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
                        >
                           <DollarSign size={20} /> Finalizar Venda (F9)
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* POS FOOTER BAR */}
                <div className="bg-white border-t border-slate-100 px-8 py-3 flex items-center justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest z-10 shadow-[0_-4px_10px_rgba(0,0,0,0.02)]">
                   <div className="flex items-center gap-8">
                      <div className="flex items-center gap-2">
                         <span className="text-slate-300">Caixa:</span>
                         <span className="text-slate-600">CAIXA 01</span>
                      </div>
                      <div className="flex items-center gap-2">
                         <span className="text-slate-300">Atendente:</span>
                         <span className="text-slate-600">GUSTAVO PEREIRA</span>
                      </div>
                      <div className="flex items-center gap-2">
                         <span className="text-slate-300">Turno:</span>
                         <span className="text-slate-600">MANHÃ</span>
                      </div>
                   </div>
                   <div className="flex items-center gap-6">
                      <div className="flex items-center gap-2">
                         <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                         <span className="text-emerald-600">Online</span>
                      </div>
                      <RefreshCw size={14} className="hover:rotate-180 transition-transform duration-500 cursor-pointer" />
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
                              // Gravar a venda antes de limpar
                              handleFinalizeSale(false);
                              setPosPaymentModal(null);
                              setPosNif('');
                              setPosCashReceived('');
                              setPosSplitBy(1);
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
            // ── SALES DATA ──
            const today = new Date().toISOString().split('T')[0];
            const salesHistory: any[] = (business as any).salesHistory || [];
            const todaySales = salesHistory.filter((s: any) => (s.date || '').startsWith(today));

            // All items sold today (from history + active tables)
            const allItemsToday: { name: string; price: number; quantity: number; category: string }[] = [];
            todaySales.forEach((s: any) => (s.items || []).forEach((it: any) => allItemsToday.push(it)));
            // Also include active pending orders on tables
            (business.tables || []).forEach((t: any) => {
              (t.pendingOrderItems || []).forEach((it: any) => allItemsToday.push({ name: it.name || it.dish?.name || 'Item', price: it.price || it.dish?.price || 0, quantity: it.quantity || 1, category: it.category || it.dish?.category || '' }));
            });

            const totalItemsToday = allItemsToday.reduce((acc, it) => acc + (it.quantity || 1), 0);
            const revenueToday = allItemsToday.reduce((acc, it) => acc + ((it.price || 0) * (it.quantity || 1)), 0);
            const partnerRevenue = totalItemsToday * 0.05;

            // Sales map for charts
            const salesMap: Record<string, { name: string; count: number; revenue: number; category: string }> = {};
            kitchenOrders.forEach(order => {
              (order.items || []).forEach((item: any) => {
                const key = item.dish?.name || item.name || 'Desconhecido';
                if (!salesMap[key]) salesMap[key] = { name: key, count: 0, revenue: 0, category: item.dish?.category || item.category || '' };
                salesMap[key].count += item.quantity || 1;
                salesMap[key].revenue += (item.dish?.price || item.price || 0) * (item.quantity || 1);
              });
            });
            allItemsToday.forEach(item => {
              const key = item.name || 'Desconhecido';
              if (!salesMap[key]) salesMap[key] = { name: key, count: 0, revenue: 0, category: item.category || '' };
              salesMap[key].count += item.quantity || 1;
              salesMap[key].revenue += (item.price || 0) * (item.quantity || 1);
            });
            if (Object.keys(salesMap).length === 0) {
              (business.dishes || []).slice(0, 6).forEach((d, i) => {
                salesMap[d.name] = { name: d.name, count: Math.max(1, 18 - i * 3), revenue: (d.price || 0) * Math.max(1, 18 - i * 3), category: d.category || '' };
              });
            }
            const topSales = Object.values(salesMap).sort((a, b) => b.count - a.count).slice(0, 6);
            const maxSales = Math.max(...topSales.map(s => s.count), 1);

            // Category donut
            const catMap: Record<string, number> = {};
            Object.values(salesMap).forEach(s => { catMap[s.category || 'Outros'] = (catMap[s.category || 'Outros'] || 0) + s.count; });
            const catData = Object.entries(catMap).sort((a, b) => b[1] - a[1]).slice(0, 5);
            const catTotal = catData.reduce((a, c) => a + c[1], 0) || 1;

            // Product donut top 5
            const prodData = topSales.slice(0, 5);
            const prodTotal = prodData.reduce((a, s) => a + s.count, 0) || 1;
            const DONUT_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

            const onDutyStaff = staff.filter(m => m.onDuty && !m.vacationStart).length;
            const onVacation = staff.filter(m => m.vacationStart).length;
            const debtClients = fiadoClients.filter(c => c.balance < 0);
            const creditClients = fiadoClients.filter(c => c.balance > 0);

            // ── SAFT EXPORT ──
            const exportSAFT = () => {
              const now = new Date();
              const dateStr = now.toISOString().split('T')[0];
              const nif = (business as any).nif || '999999999';
              const items = allItemsToday.length > 0 ? allItemsToday : (business.dishes || []).slice(0, 5).map((d, i) => ({ name: d.name, price: d.price || 10, quantity: i + 1, category: d.category || 'Pratos' }));
              const invoiceTotal = items.reduce((a, it) => a + (it.price * it.quantity), 0);
              const iva = invoiceTotal * 0.23;
              let xml = `<?xml version="1.0" encoding="UTF-8"?>
<AuditFile xmlns="urn:OECD:Standard:SAF-T:1.00:PT" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <Header>
    <AuditFileVersion>1.04_01</AuditFileVersion>
    <CompanyID>${nif}</CompanyID>
    <TaxRegistrationNumber>${nif}</TaxRegistrationNumber>
    <TaxAccountingBasis>I</TaxAccountingBasis>
    <CompanyName>${business.name}</CompanyName>
    <BusinessName>${business.name}</BusinessName>
    <FiscalYear>${now.getFullYear()}</FiscalYear>
    <StartDate>${dateStr}</StartDate>
    <EndDate>${dateStr}</EndDate>
    <CurrencyCode>EUR</CurrencyCode>
    <DateCreated>${dateStr}</DateCreated>
    <TaxEntity>Global</TaxEntity>
    <ProductCompanyTaxID>${nif}</ProductCompanyTaxID>
    <SoftwareCertificateNumber>0000</SoftwareCertificateNumber>
    <ProductID>AzoresToYou POS</ProductID>
    <ProductVersion>1.0</ProductVersion>
  </Header>
  <MasterFiles>
    <GeneralLedgerAccounts />
    <Customer>
      <CustomerID>CONSUMIDOR_FINAL</CustomerID>
      <AccountID>21</AccountID>
      <CustomerTaxID>999999990</CustomerTaxID>
      <CompanyName>Consumidor Final</CompanyName>
      <BillingAddress>
        <AddressDetail>Desconhecido</AddressDetail>
        <City>Açores</City>
        <PostalCode>0000-000</PostalCode>
        <Country>PT</Country>
      </BillingAddress>
      <SelfBillingIndicator>0</SelfBillingIndicator>
    </Customer>
    <Product>
${items.map((it, i) => `      <Product>
        <ProductType>P</ProductType>
        <ProductCode>PROD${String(i+1).padStart(3,'0')}</ProductCode>
        <ProductGroup>${it.category || 'Geral'}</ProductGroup>
        <ProductDescription>${it.name}</ProductDescription>
        <ProductNumberCode>PROD${String(i+1).padStart(3,'0')}</ProductNumberCode>
      </Product>`).join('\n')}
    </Product>
    <TaxTable>
      <TaxTableEntry>
        <TaxType>IVA</TaxType>
        <TaxCountryRegion>PT</TaxCountryRegion>
        <TaxCode>NOR</TaxCode>
        <Description>IVA - Taxa Normal</Description>
        <TaxPercentage>23</TaxPercentage>
      </TaxTableEntry>
    </TaxTable>
  </MasterFiles>
  <SourceDocuments>
    <SalesInvoices>
      <NumberOfEntries>1</NumberOfEntries>
      <TotalDebit>0</TotalDebit>
      <TotalCredit>${invoiceTotal.toFixed(2)}</TotalCredit>
      <Invoice>
        <InvoiceNo>FT 1/${dateStr.replace(/-/g,'')}</InvoiceNo>
        <ATCUD>0</ATCUD>
        <DocumentStatus>
          <InvoiceStatus>N</InvoiceStatus>
          <InvoiceStatusDate>${now.toISOString()}</InvoiceStatusDate>
          <SourceID>${business.name}</SourceID>
          <SourceBilling>P</SourceBilling>
        </DocumentStatus>
        <Hash>0</Hash>
        <HashControl>0</HashControl>
        <Period>${now.getMonth() + 1}</Period>
        <InvoiceDate>${dateStr}</InvoiceDate>
        <InvoiceType>FT</InvoiceType>
        <SpecialRegimes>
          <SelfBillingIndicator>0</SelfBillingIndicator>
          <CashVATSchemeIndicator>0</CashVATSchemeIndicator>
          <ThirdPartiesBillingIndicator>0</ThirdPartiesBillingIndicator>
        </SpecialRegimes>
        <SourceID>${business.name}</SourceID>
        <SystemEntryDate>${now.toISOString()}</SystemEntryDate>
        <CustomerID>CONSUMIDOR_FINAL</CustomerID>
${items.map((it, i) => `        <Line>
          <LineNumber>${i+1}</LineNumber>
          <ProductCode>PROD${String(i+1).padStart(3,'0')}</ProductCode>
          <ProductDescription>${it.name}</ProductDescription>
          <Quantity>${it.quantity}</Quantity>
          <UnitOfMeasure>UN</UnitOfMeasure>
          <UnitPrice>${it.price.toFixed(2)}</UnitPrice>
          <TaxPointDate>${dateStr}</TaxPointDate>
          <Description>${it.name}</Description>
          <CreditAmount>${(it.price * it.quantity).toFixed(2)}</CreditAmount>
          <Tax>
            <TaxType>IVA</TaxType>
            <TaxCountryRegion>PT</TaxCountryRegion>
            <TaxCode>NOR</TaxCode>
            <TaxPercentage>23</TaxPercentage>
          </Tax>
          <TaxExemptionReason />
        </Line>`).join('\n')}
        <DocumentTotals>
          <TaxPayable>${iva.toFixed(2)}</TaxPayable>
          <NetTotal>${(invoiceTotal - iva).toFixed(2)}</NetTotal>
          <GrossTotal>${invoiceTotal.toFixed(2)}</GrossTotal>
        </DocumentTotals>
      </Invoice>
    </SalesInvoices>
  </SourceDocuments>
</AuditFile>`;
              const blob = new Blob([xml], { type: 'application/xml' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `SAFT_${business.name.replace(/\s+/g,'_')}_${dateStr}.xml`;
              a.click();
              URL.revokeObjectURL(url);
            };

            // ── CSV REPORT EXPORT ──
            const exportReport = (period: 'hoje' | 'semana' | 'mes') => {
              const now = new Date();
              const cutoff = new Date();
              if (period === 'semana') cutoff.setDate(cutoff.getDate() - 7);
              else if (period === 'mes') cutoff.setDate(cutoff.getDate() - 30);
              const rows: string[][] = [['Data','Mesa','Cliente','Item','Qtd','Preço Unit.','Total','Taxa Parceiro']];
              const salesFiltered = period === 'hoje' ? todaySales : salesHistory.filter((s: any) => new Date(s.date || '') >= cutoff);
              if (salesFiltered.length > 0) {
                salesFiltered.forEach((s: any) => {
                  (s.items || []).forEach((it: any) => {
                    const qty = it.quantity || 1;
                    const price = it.price || 0;
                    rows.push([s.date?.split('T')[0] || today, s.tableName || '-', s.customerName || 'Consumidor Final', it.name || '-', String(qty), `€${price.toFixed(2)}`, `€${(price*qty).toFixed(2)}`, `€${(qty*0.05).toFixed(2)}`]);
                  });
                });
              } else {
                allItemsToday.forEach(it => { const qty = it.quantity || 1; const price = it.price || 0; rows.push([today, 'Mesa Ativa', 'Consumidor Final', it.name || '-', String(qty), `€${price.toFixed(2)}`, `€${(price*qty).toFixed(2)}`, `€${(qty*0.05).toFixed(2)}`]); });
              }
              const csv = rows.map(r => r.map(c => `"${c}"`).join(',')).join('\n');
              const blob = new Blob(['\uFEFF'+csv], { type: 'text/csv;charset=utf-8;' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `relatorio_${period}_${today}.csv`;
              a.click();
              URL.revokeObjectURL(url);
            };

            // ── DONUT SVG HELPER ──
            const DonutChart = ({ data, colors, total, size = 160, stroke = 28 }: { data: number[]; colors: string[]; total: number; size?: number; stroke?: number }) => {
              const r = (size - stroke) / 2;
              const circ = 2 * Math.PI * r;
              let offset = 0;
              return (
                <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: 'rotate(-90deg)' }}>
                  <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#f1f5f9" strokeWidth={stroke} />
                  {data.map((val, i) => {
                    const dash = (val / total) * circ;
                    const gap = circ - dash;
                    const seg = <circle key={i} cx={size/2} cy={size/2} r={r} fill="none" stroke={colors[i % colors.length]} strokeWidth={stroke} strokeDasharray={`${dash} ${gap}`} strokeDashoffset={-offset} strokeLinecap="round" />;
                    offset += dash;
                    return seg;
                  })}
                </svg>
              );
            };

            return (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">

                {/* ── LIVE CLOCK ── */}
                <LiveClockCard businessName={business.name} island={business.island || ''} />

                {/* ── ACTION BUTTONS ── */}
                <div className="flex flex-wrap items-center justify-end gap-3">
                  <ReportExportMenu onExport={exportReport} />
                  <button
                    onClick={exportSAFT}
                    className="flex items-center gap-2 px-5 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-xl shadow-slate-900/20 active:scale-95"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                    Exportar SAFT
                  </button>
                </div>

                {/* ── KPI CARDS ── */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  {[
                    { label: 'Reservas Hoje', value: reservations.length, icon: <Calendar size={22} />, color: 'blue', change: '↑ 12% vs ontem' },
                    { label: 'Check-ins', value: pendingCount, icon: <Hotel size={22} />, color: 'orange', change: '↑ 14% vs ontem' },
                    { label: 'Check-outs', value: '7', icon: <LogOut size={22} />, color: 'emerald', change: '↓ 5% vs ontem' },
                    { label: 'Hóspedes', value: '42', icon: <Users size={22} />, color: 'indigo', change: '↑ 8% vs ontem' },
                    { label: 'Receita Hoje', value: revenueToday > 0 ? `€ ${revenueToday.toFixed(2)}` : '€ 0,00', icon: <DollarSign size={22} />, color: 'purple', change: '↑ 15% vs ontem' },
                    { label: 'Receita Parceiro', value: `€ ${partnerRevenue.toFixed(2)}`, icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>, color: 'amber', change: `${totalItemsToday} itens × €0,05` },
                  ].map((stat, i) => (
                    <div key={i} className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 bg-${stat.color}-50 text-${stat.color}-600 group-hover:scale-110 transition-transform`}>{stat.icon}</div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 leading-tight">{stat.label}</p>
                      <h4 className={`text-xl font-black tracking-tighter mb-1 ${stat.color === 'amber' ? 'text-amber-600' : 'text-slate-900'}`}>{stat.value}</h4>
                      <span className={`text-[9px] font-black px-2 py-0.5 rounded-lg ${stat.change.includes('↑') ? 'bg-emerald-50 text-emerald-600' : stat.change.includes('itens') ? 'bg-amber-50 text-amber-600' : 'bg-red-50 text-red-600'}`}>{stat.change}</span>
                    </div>
                  ))}
                </div>

                {/* ── ANALYTICS ROW: Bar + Donut Charts ── */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Bar Chart - Top Selling */}
                  <div className="lg:col-span-1 bg-white border border-slate-100 rounded-[3rem] p-8 shadow-sm">
                    <div className="flex items-center justify-between mb-8">
                      <div>
                        <h3 className="font-black text-slate-900 uppercase tracking-tighter text-base">Top Vendas</h3>
                        <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-0.5">Pratos com maior volume</p>
                      </div>
                      <div className="w-10 h-10 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600"><BarChart3 size={20} /></div>
                    </div>
                    <div className="space-y-5">
                      {topSales.map((item, i) => (
                        <div key={i} className="flex items-center gap-4 group">
                          <div className="w-6 text-[10px] font-black text-slate-300 text-right flex-shrink-0">0{i+1}</div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1.5">
                              <p className="text-xs font-black text-slate-700 truncate">{item.name}</p>
                              <p className="text-xs font-black text-blue-600 ml-1 flex-shrink-0">{item.count}</p>
                            </div>
                            <div className="h-2.5 bg-slate-50 rounded-full overflow-hidden border border-slate-100">
                              <motion.div initial={{ width: 0 }} animate={{ width: `${(item.count / maxSales) * 100}%` }} transition={{ delay: i * 0.1, duration: 0.8, ease: 'circOut' }}
                                className={`h-full rounded-full ${i === 0 ? 'bg-blue-600' : i === 1 ? 'bg-blue-500' : i === 2 ? 'bg-emerald-500' : i === 3 ? 'bg-amber-500' : 'bg-slate-300'}`} />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Donut - Produtos */}
                  <div className="bg-white border border-slate-100 rounded-[3rem] p-8 shadow-sm flex flex-col items-center">
                    <div className="w-full mb-5">
                      <h3 className="font-black text-slate-900 uppercase tracking-tighter text-base">Produtos</h3>
                      <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Top 5 mais vendidos</p>
                    </div>
                    <div className="relative">
                      <DonutChart data={prodData.map(p => p.count)} colors={DONUT_COLORS} total={prodTotal} size={160} stroke={30} />
                      <div className="absolute inset-0 flex flex-col items-center justify-center" style={{ transform: 'rotate(0deg)' }}>
                        <p className="text-2xl font-black text-slate-900">{prodTotal}</p>
                        <p className="text-[9px] font-black text-slate-400 uppercase">Itens</p>
                      </div>
                    </div>
                    <div className="w-full mt-5 space-y-2">
                      {prodData.map((p, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: DONUT_COLORS[i % DONUT_COLORS.length] }} />
                          <p className="text-[10px] font-bold text-slate-600 truncate flex-1">{p.name}</p>
                          <p className="text-[10px] font-black text-slate-800">{p.count}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Donut - Categorias */}
                  <div className="bg-white border border-slate-100 rounded-[3rem] p-8 shadow-sm flex flex-col items-center">
                    <div className="w-full mb-5">
                      <h3 className="font-black text-slate-900 uppercase tracking-tighter text-base">Categorias</h3>
                      <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Distribuição por categoria</p>
                    </div>
                    <div className="relative">
                      <DonutChart data={catData.map(c => c[1])} colors={['#10b981','#3b82f6','#f59e0b','#ef4444','#8b5cf6']} total={catTotal} size={160} stroke={30} />
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <p className="text-2xl font-black text-slate-900">{catData.length}</p>
                        <p className="text-[9px] font-black text-slate-400 uppercase">Categorias</p>
                      </div>
                    </div>
                    <div className="w-full mt-5 space-y-2">
                      {catData.map((c, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: ['#10b981','#3b82f6','#f59e0b','#ef4444','#8b5cf6'][i % 5] }} />
                          <p className="text-[10px] font-bold text-slate-600 truncate flex-1">{c[0] || 'Outros'}</p>
                          <p className="text-[10px] font-black text-slate-800">{Math.round((c[1]/catTotal)*100)}%</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* ── STAFF + REVIEWS + ISLAND ROW ── */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Staff Quick */}
                  <div className="bg-[#1e293b] text-white rounded-[3rem] p-8 shadow-2xl shadow-slate-900/20">
                    <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] mb-6">Equipa em Serviço</p>
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="bg-white/5 border border-white/10 rounded-[2rem] p-5 text-center">
                        <p className="text-3xl font-black text-white mb-1">{onDutyStaff}</p>
                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Ativos</p>
                      </div>
                      <div className="bg-white/5 border border-white/10 rounded-[2rem] p-5 text-center">
                        <p className="text-3xl font-black text-slate-400 mb-1">{onVacation}</p>
                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Férias</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      {staff.slice(0,3).map(m => (
                        <div key={m.id} className="flex items-center gap-3 bg-white/5 p-3 rounded-2xl border border-white/5">
                          <div className="w-9 h-9 rounded-xl overflow-hidden border border-white/10 flex-shrink-0">
                            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${m.name}`} alt="Staff" className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-black text-white truncate">{m.name}</p>
                            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Colaborador</p>
                          </div>
                          <div className={`w-2.5 h-2.5 rounded-full shadow-lg ${m.vacationStart ? 'bg-amber-400' : m.onDuty ? 'bg-emerald-400 animate-pulse' : 'bg-slate-600'}`}/>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Reviews Card */}
                  <div className="bg-white border border-slate-100 rounded-[3rem] p-8 shadow-sm flex flex-col items-center justify-between">
                    <div className="w-full">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-black text-slate-900 uppercase tracking-tighter text-base">Avaliações</h3>
                        <div className="w-10 h-10 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-500"><Star size={20} /></div>
                      </div>
                      <div className="flex items-end gap-3 mb-4">
                        <p className="text-6xl font-black text-slate-900 tracking-tighter">{averageRating}</p>
                        <div className="pb-2">
                          <div className="flex gap-0.5 mb-1">
                            {[1,2,3,4,5].map(s => <span key={s} className={`text-lg ${s <= Math.round(Number(averageRating)) ? 'text-amber-400' : 'text-slate-200'}`}>★</span>)}
                          </div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{uniqueReviews.length} avaliações</p>
                        </div>
                      </div>
                      {/* Mini list */}
                      <div className="space-y-2 mb-6">
                        {uniqueReviews.slice(0,2).map((r, i) => (
                          <div key={i} className="bg-slate-50 rounded-2xl p-3 border border-slate-100">
                            <div className="flex items-center gap-2 mb-1">
                              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-black text-[10px]">{(r.customerName || 'A').charAt(0)}</div>
                              <p className="text-[10px] font-black text-slate-700">{r.customerName}</p>
                              <div className="ml-auto flex gap-0.5">{[1,2,3,4,5].map(s => <span key={s} className={`text-[10px] ${s <= r.rating ? 'text-amber-400' : 'text-slate-200'}`}>★</span>)}</div>
                            </div>
                            {r.reviewNote && <p className="text-[10px] text-slate-500 truncate">{r.reviewNote}</p>}
                          </div>
                        ))}
                        {uniqueReviews.length === 0 && <p className="text-[11px] text-slate-400 text-center py-2">Ainda sem avaliações</p>}
                      </div>
                    </div>
                    <button onClick={() => setActiveTab('reviews')} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/20 active:scale-95">
                      Ver Todas as Avaliações
                    </button>
                  </div>

                  {/* Island Card */}
                  <div className="bg-white border border-slate-100 rounded-[3rem] p-8 flex flex-col items-center text-center shadow-sm">
                    <div className="w-16 h-16 bg-blue-50 rounded-[2rem] flex items-center justify-center mb-5 text-blue-600"><MapPin size={32} /></div>
                    <h4 className="text-xl font-black text-slate-900 tracking-tighter uppercase mb-1">{business.island}</h4>
                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-6">Localização do Negócio</p>
                    <div className="flex flex-col w-full gap-3 mt-auto">
                      <button onClick={() => setActiveTab('reservations')} className="w-full py-3.5 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-slate-900/20">Gerir Reservas</button>
                      <button onClick={() => setActiveTab('dishes')} className="w-full py-3.5 bg-white border border-slate-100 text-slate-900 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all">Ver Ementa</button>
                    </div>
                  </div>
                </div>

                {/* ── FIADO CLIENTS ── */}
                <div className="bg-white border border-slate-100 rounded-[3rem] p-10 shadow-sm overflow-hidden">
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h3 className="font-black text-slate-900 uppercase tracking-tighter text-xl">Contas de Clientes (Fiado)</h3>
                      <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-1">Saldos pendentes e créditos de consumo</p>
                    </div>
                    <div className="flex gap-4">
                      <div className="px-4 py-2 bg-red-50 text-red-600 rounded-xl text-[10px] font-black uppercase tracking-widest border border-red-100">{debtClients.length} Em Dívida</div>
                      <div className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl text-[10px] font-black uppercase tracking-widest border border-emerald-100">{creditClients.length} Com Crédito</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {fiadoClients.map(client => (
                      <div key={client.id} className={`flex items-center gap-6 p-6 rounded-[2rem] border transition-all hover:shadow-md ${
                        client.balance < 0 ? 'bg-red-50/30 border-red-100' : 'bg-emerald-50/30 border-emerald-100'
                      }`}>
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl flex-shrink-0 shadow-sm ${
                          client.balance < 0 ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'
                        }`}>{client.name.charAt(0)}</div>
                        <div className="flex-1 min-w-0">
                          <p className="font-black text-slate-900 text-lg truncate leading-tight">{client.name}</p>
                          <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">{client.phone}</p>
                        </div>
                        <div className="text-right flex-shrink-0 px-4">
                          <p className={`font-black text-2xl tracking-tighter ${client.balance < 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                            {client.balance < 0 ? '-' : '+'}€{Math.abs(client.balance).toFixed(2)}
                          </p>
                        </div>
                        <div className="flex flex-col gap-2">
                          <button onClick={() => { const updated = fiadoClients.map(c => c.id === client.id ? {...c, balance: parseFloat((c.balance + 5).toFixed(2))} : c); setFiadoClients(updated); handleUpdate({ fiadoClients: updated }); }} className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-emerald-600 font-black hover:bg-emerald-100 shadow-sm border border-emerald-100 transition-all active:scale-90">+</button>
                          <button onClick={() => { const updated = fiadoClients.map(c => c.id === client.id ? {...c, balance: parseFloat((c.balance - 5).toFixed(2))} : c); setFiadoClients(updated); handleUpdate({ fiadoClients: updated }); }} className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-red-500 font-black hover:bg-red-50 shadow-sm border border-red-100 transition-all active:scale-90">−</button>
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
                  <h3 className="text-xl font-black text-slate-800 uppercase tracking-tighter">{isHotel ? 'Ementa do Restaurante Hotel' : 'Lista de Pratos'}</h3>
                  <button onClick={() => setActiveTab('dashboard')} className="flex items-center gap-2 text-blue-600 font-bold hover:underline">
                    <LayoutDashboard className="w-4 h-4" /> Voltar à Dashboard
                  </button>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {(business.dishes || []).map((dish, idx) => (
                   <div key={idx} className="bg-white border border-slate-100 rounded-[2rem] overflow-hidden group hover:shadow-2xl transition-all duration-500 flex flex-col h-full">
                      <div className="h-48 relative overflow-hidden bg-slate-100">
                        {dish.image ? (
                          <img src={dish.image.startsWith('/') ? `${API_BASE_URL}${dish.image}` : dish.image} alt={dish.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
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

          {activeTab === 'room_management' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
               <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                  <div>
                    <h3 className="text-3xl font-black text-slate-800 tracking-tighter uppercase">Gestão de Unidades Hoteleiras</h3>
                    <p className="text-slate-400 font-bold text-sm mt-1 uppercase tracking-widest">Edição de Tipologias, Comodidades e Preços</p>
                  </div>
                  <div className="flex flex-wrap gap-4">
                     {/* Floor Filters */}
                     <div className="bg-white border border-slate-100 p-1.5 rounded-2xl flex gap-1 shadow-sm">
                        {['all', 1, 2].map((f) => (
                          <button
                            key={f}
                            onClick={() => setRoomFloorFilter(f as any)}
                            className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                              roomFloorFilter === f ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-400 hover:bg-slate-50'
                            }`}
                          >
                            {f === 'all' ? 'Todos' : `Piso ${f}`}
                          </button>
                        ))}
                     </div>
                     <button onClick={addRoom} className="px-8 py-4 bg-blue-600 text-white rounded-[1.5rem] font-black uppercase text-[10px] tracking-widest shadow-xl shadow-blue-600/30 hover:scale-105 active:scale-95 transition-all flex items-center gap-3">
                        <Plus size={18} /> Adicionar Quarto / Unidade
                     </button>
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                  {tables
                    .filter(t => roomFloorFilter === 'all' || (t as any).floor === roomFloorFilter)
                    .map((room, idx) => {
                      const actualIdx = tables.indexOf(room);
                      return (
                        <motion.div 
                          layout
                          key={room.id} 
                          className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden hover:shadow-2xl transition-all duration-500 group"
                        >
                            <div className="aspect-[4/3] relative overflow-hidden bg-slate-100">
                               {((room as any).images && (room as any).images.length > 0) ? (
                                 <img 
                                   src={(room as any).images[0].startsWith('/') ? `${API_BASE_URL}${(room as any).images[0]}` : (room as any).images[0]} 
                                   alt="Room" 
                                   className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                                 />
                               ) : (
                                 <div className="w-full h-full flex flex-col items-center justify-center text-slate-300">
                                   <Hotel size={48} className="mb-2 opacity-20" />
                                   <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Sem Foto</p>
                                </div>
                              )}
                              <div className="absolute top-6 left-6 flex flex-col gap-2">
                                 <span className="px-4 py-1.5 bg-white/90 backdrop-blur-md text-blue-600 text-[10px] font-black rounded-full uppercase tracking-widest shadow-lg">
                                    {(room as any).type || 'Standard'}
                                 </span>
                                 <span className="px-4 py-1.5 bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-black rounded-full uppercase tracking-widest shadow-lg">
                                    Piso {(room as any).floor || 1}
                                 </span>
                              </div>
                           </div>
                           
                           <div className="p-8">
                              <div className="flex justify-between items-start mb-6">
                                 <div>
                                    <h4 className="text-2xl font-black text-slate-800 tracking-tighter uppercase mb-1">Quarto #{(room as any).number}</h4>
                                    <div className="flex items-center gap-2">
                                       <div className={`w-2 h-2 rounded-full ${room.status === 'available' ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
                                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Status: {room.status === 'available' ? 'Livre / Limpo' : 'Ocupado'}</p>
                                    </div>
                                 </div>
                                 <div className="text-right">
                                    <p className="text-2xl font-black text-blue-600 tracking-tighter">€{(room as any).price_low || 65}</p>
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Base Época Baixa</p>
                                 </div>
                              </div>

                              <div className="flex flex-wrap gap-2 mb-8">
                                 {((room as any).amenities || ['Wi-Fi', 'Smart TV']).slice(0, 3).map((am: string, i: number) => (
                                   <span key={i} className="px-3 py-1 bg-slate-50 text-slate-500 text-[9px] font-black rounded-lg uppercase tracking-widest border border-slate-100">
                                      {am}
                                   </span>
                                 ))}
                                 {((room as any).amenities || []).length > 3 && (
                                   <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[9px] font-black rounded-lg uppercase tracking-widest">
                                      + {((room as any).amenities || []).length - 3}
                                   </span>
                                 )}
                              </div>

                              <div className="flex gap-3">
                                 <button 
                                   onClick={() => startRoomEdit(actualIdx)}
                                   className="flex-1 py-4 bg-slate-900 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl shadow-slate-900/10"
                                 >
                                   Configurar
                                 </button>
                                 <button 
                                   onClick={() => removeRoom(actualIdx)}
                                   className="w-14 h-14 bg-white border border-slate-100 text-red-500 rounded-2xl flex items-center justify-center hover:bg-red-50 transition-all"
                                 >
                                   <Trash2 size={18} />
                                 </button>
                              </div>
                           </div>
                        </motion.div>
                      );
                    })}
               </div>
            </motion.div>
          )}

          {activeTab === 'reservas_hotel' && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
               <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                  <div>
                    <h3 className="text-3xl font-black text-slate-800 tracking-tighter uppercase">Reservas de Pacotes</h3>
                    <p className="text-slate-400 text-sm font-bold mt-1 uppercase tracking-widest">Gestão de Pedidos Integrados (Hotel + Carro)</p>
                  </div>
                  <button 
                    onClick={() => onForceRefresh && onForceRefresh()}
                    className="flex items-center gap-2 px-8 py-4 bg-white border border-slate-100 text-slate-600 rounded-[1.5rem] font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm group"
                  >
                    <RefreshCw size={16} className={`text-blue-500 transition-transform duration-700 ${isUploading || isSyncingVisual ? 'animate-spin' : 'group-hover:rotate-180'}`} />
                    Sincronizar Dashboard
                  </button>
               </div>

               <div className="bg-white border border-slate-100 rounded-[3rem] shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                     <table className="w-full">
                        <thead>
                           <tr className="bg-slate-50 border-b border-slate-100">
                              <th className="px-8 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Hóspede</th>
                              <th className="px-8 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Pacote / Ticket</th>
                              <th className="px-8 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Datas</th>
                              <th className="px-8 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Estado</th>
                              <th className="px-8 py-6 text-right text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Ações</th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                           {(business.reservations || []).map((res: any, i: number) => (
                             <tr key={i} className="hover:bg-slate-50/50 transition-colors group">
                                <td className="px-8 py-6">
                                   <div className="flex items-center gap-3">
                                      <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center font-black">{res.customerName?.charAt(0) || 'U'}</div>
                                      <div>
                                         <p className="font-black text-slate-800 text-sm">{res.customerName}</p>
                                         <p className="text-[10px] text-slate-400 font-medium">{res.customerPhone}</p>
                                      </div>
                                   </div>
                                </td>
                                <td className="px-8 py-6">
                                   <div className="flex items-center gap-2">
                                      <span className="px-2 py-1 bg-slate-900 text-white text-[9px] font-black rounded-lg uppercase tracking-widest">
                                         #{res.packageId?.slice(-6) || 'N/A'}
                                      </span>
                                      {res.type === 'car' && <Car size={14} className="text-blue-500" />}
                                      {res.type === 'hotel' && <Hotel size={14} className="text-emerald-500" />}
                                   </div>
                                </td>
                                <td className="px-8 py-6">
                                   <p className="text-sm font-bold text-slate-700">{res.date}</p>
                                   <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{res.days || 1} Noites</p>
                                </td>
                                <td className="px-8 py-6">
                                   <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                                     res.status === 'accepted' ? 'bg-emerald-500 text-white' : 
                                     res.status === 'pending' ? 'bg-amber-500 text-white animate-pulse' : 
                                     'bg-red-500 text-white'
                                   }`}>
                                      {res.status === 'pending' ? 'Pendente' : res.status === 'accepted' ? 'Confirmada' : 'Cancelada'}
                                   </span>
                                </td>
                                <td className="px-8 py-6 text-right">
                                   {res.status === 'pending' && (
                                     <button 
                                       onClick={() => {
                                         const updated = (business.reservations || []).map((r: any, idx: number) => idx === i ? {...r, status: 'accepted'} : r);
                                         onUpdateBusiness({ ...business, reservations: updated });
                                         alert("✅ Reserva de quarto confirmada!");
                                       }}
                                       className="px-4 py-2 bg-emerald-500 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-emerald-500/20"
                                     >
                                       Confirmar
                                     </button>
                                   )}
                                </td>
                             </tr>
                           ))}
                           {(business.reservations || []).length === 0 && (
                             <tr>
                                <td colSpan={5} className="py-20 text-center">
                                   <Calendar className="w-12 h-12 mx-auto mb-4 text-slate-200" />
                                   <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Nenhuma reserva recebida ainda.</p>
                                </td>
                             </tr>
                           )}
                        </tbody>
                     </table>
                  </div>
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
               <div className="flex flex-col md:flex-row justify-between items-center gap-6">
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

                 <button 
                   onClick={() => onForceRefresh && onForceRefresh()}
                   className="flex items-center gap-2 px-8 py-4 bg-white border border-slate-100 text-slate-600 rounded-[1.5rem] font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm group"
                 >
                   <RefreshCw size={16} className={`text-blue-500 group-hover:rotate-180 transition-transform duration-700 ${isUploading ? 'animate-spin' : ''}`} />
                   Sincronizar Dashboard
                 </button>
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
                                         {res.time && <span className="bg-blue-600 px-3 py-1 rounded-lg text-[10px] font-black uppercase text-white tracking-widest">{res.time}</span>}
                                         {!isBeauty && !isShop && !isHotel && <span className="flex items-center gap-1 text-[10px] font-black uppercase text-slate-400"><Users size={12}/> {res.guests} Pax</span>}
                                         {isHotel && (
                                           <>
                                             <span className="flex items-center gap-1 text-[10px] font-black uppercase text-emerald-600">
                                               <Hotel size={12}/> {
                                                 res.selectedRoom ? `Quarto ${res.selectedRoom.number} (${res.selectedRoom.type})` : 
                                                 res.roomName ? `${res.roomName} (${res.roomType || 'Alojamento'})` : 
                                                 'Quarto não definido'
                                               }
                                             </span>
                                             <span className="flex items-center gap-1 text-[10px] font-black uppercase text-blue-600">
                                               <Calendar size={12}/> {res.nights || 1} Noites
                                             </span>
                                             <span className="flex items-center gap-1 text-[10px] font-black uppercase text-slate-400">
                                               <Receipt size={12}/> ID: #{res.id.slice(-6).toUpperCase()}
                                             </span>
                                           </>
                                         )}
                                      </div>
                                   </div>
                                 </div>
                                 <div className="flex gap-3 w-full md:w-auto">
                                    <button 
                                      onClick={() => {
                                        if (isBeauty || isShop || isHotel) {
                                          handleReservationAction(res.id, 'accepted');
                                        } else {
                                          setAcceptingReservation(res);
                                          setActiveTab('tables');
                                        }
                                      }}
                                      className="flex-1 md:flex-none px-10 py-5 bg-emerald-500 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-emerald-500/20 hover:scale-105 active:scale-95 transition-all"
                                    >
                                      {(isBeauty || isShop || isHotel) ? 'Aprovar Reserva' : 'Vincular Mesa'}
                                    </button>
                                    <button 
                                      onClick={() => deleteReservation(res.id)}
                                      className="p-5 text-red-400 bg-red-50 hover:bg-red-500 hover:text-white rounded-2xl transition-all group shadow-sm"
                                       title="Eliminar Permanentemente"
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

                        {/* Seção de Reservas Ativas / Confirmadas */}
                        <div className="pt-8 border-t border-slate-100 mt-8">
                           <h3 className="text-xl font-black text-slate-800 uppercase tracking-tighter mb-6 flex items-center gap-2">
                             <CheckCircle className="text-emerald-500 w-6 h-6" /> Reservas Confirmadas e Ativas
                           </h3>
                           <div className="space-y-4">
                             {reservations.filter(r => ['accepted', 'occupied'].includes(r.status)).length === 0 ? (
                               <div className="py-12 text-center bg-slate-50 rounded-[2rem] border border-dashed border-slate-200">
                                 <Calendar className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                                 <p className="font-bold text-sm text-slate-400 uppercase tracking-widest">Nenhuma reserva ativa no momento.</p>
                               </div>
                             ) : (
                               reservations.filter(r => ['accepted', 'occupied'].includes(r.status)).map(res => (
                                 <div 
                                   key={res.id} 
                                   className={`bg-white border border-slate-100 p-6 rounded-[2.5rem] shadow-sm hover:shadow-md transition-all duration-300 border-l-8 ${
                                     res.status === 'occupied' ? 'border-l-blue-500' : 'border-l-emerald-500'
                                   }`}
                                 >
                                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                       <div className="flex items-center gap-4">
                                         <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-lg font-black ${
                                           res.status === 'occupied' ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600'
                                         }`}>
                                           {res.customerName.charAt(0)}
                                         </div>
                                         <div>
                                            <div className="flex items-center gap-2">
                                              <p className="text-lg font-black text-slate-800 tracking-tight leading-none">{res.customerName}</p>
                                              <span className={`px-2.5 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest border ${
                                                res.status === 'occupied' 
                                                  ? 'bg-blue-50 text-blue-700 border-blue-100' 
                                                  : 'bg-emerald-50 text-emerald-700 border-emerald-100'
                                              }`}>
                                                {res.status === 'occupied' ? 'Em Mesa' : 'Confirmada'}
                                              </span>
                                            </div>
                                            <p className="text-xs text-slate-400 font-bold mt-1">{res.customerPhone} • {res.customerEmail}</p>
                                            <div className="flex items-center gap-3 mt-2">
                                               <span className="bg-slate-100 px-2 py-0.5 rounded-md text-[9px] font-black uppercase text-slate-500 tracking-widest">{res.date}</span>
                                               {res.time && <span className="bg-blue-600 px-2 py-0.5 rounded-md text-[9px] font-black uppercase text-white tracking-widest">{res.time}</span>}
                                               <span className="flex items-center gap-1 text-[9px] font-black uppercase text-slate-400"><Users size={10}/> {res.guests} Pax</span>
                                               {res.tableId && (
                                                 <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest">
                                                   Mesa #{res.tableId.replace('T', '')}
                                                 </span>
                                               )}
                                            </div>
                                         </div>
                                       </div>
                                       <div className="flex gap-2 w-full md:w-auto self-stretch md:self-auto justify-end">
                                          {res.status === 'accepted' && (
                                            <button 
                                              onClick={async () => {
                                                try {
                                                  const response = await fetch(`${API_BASE_URL}/api/reservations/${res.id}`, {
                                                    method: 'PUT',
                                                    headers: { 'Content-Type': 'application/json' },
                                                    body: JSON.stringify({ status: 'occupied' })
                                                  });
                                                  if (response.ok) {
                                                    if (onForceRefresh) onForceRefresh();
                                                  }
                                                } catch (err) {
                                                  console.error(err);
                                                }
                                              }}
                                              className="px-4 py-2 bg-blue-600 text-white rounded-xl font-black uppercase text-[9px] tracking-widest hover:bg-blue-700 transition-all"
                                            >
                                              Check-In
                                            </button>
                                          )}
                                          {res.status === 'occupied' && (
                                            <button 
                                              onClick={async () => {
                                                try {
                                                  const response = await fetch(`${API_BASE_URL}/api/reservations/${res.id}`, {
                                                    method: 'PUT',
                                                    headers: { 'Content-Type': 'application/json' },
                                                    body: JSON.stringify({ status: 'finished' })
                                                  });
                                                  if (response.ok) {
                                                    if (res.tableId) {
                                                      const updatedRest = { ...business };
                                                      if (updatedRest.tables) {
                                                        const tIdx = updatedRest.tables.findIndex(t => t.id === res.tableId);
                                                        if (tIdx > -1) {
                                                          updatedRest.tables[tIdx].status = 'free';
                                                          updatedRest.tables[tIdx].reservationId = undefined;
                                                          updatedRest.tables[tIdx].currentOrder = undefined;
                                                          onUpdateBusiness(updatedRest);
                                                          onSync(updatedRest);
                                                        }
                                                      }
                                                    }
                                                    if (onForceRefresh) onForceRefresh();
                                                  }
                                                } catch (err) {
                                                  console.error(err);
                                                }
                                              }}
                                              className="px-4 py-2 bg-slate-800 text-white rounded-xl font-black uppercase text-[9px] tracking-widest hover:bg-slate-900 transition-all"
                                            >
                                              Liberar Mesa
                                            </button>
                                          )}
                                          <button 
                                            onClick={() => deleteReservation(res.id)}
                                            className="px-4 py-2 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-xl font-black uppercase text-[9px] tracking-widest transition-all"
                                          >
                                            Cancelar
                                          </button>
                                       </div>
                                    </div>
                                 </div>
                               ))
                             )}
                           </div>
                        </div>
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
                 {/* IDENTIDADE */}
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                       <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-2">
                         Nome do Negócio
                       </label>
                       <input
                         type="text"
                         className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 font-bold focus:ring-2 focus:ring-blue-500 outline-none"
                         value={settingsForm.name}
                         onChange={e => setSettingsForm({...settingsForm, name: e.target.value})}
                       />
                    </div>
                    <div>
                       <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-2">
                         Classificação (Estrelas)
                       </label>
                       <select
                         className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 font-bold focus:ring-2 focus:ring-blue-500 outline-none"
                         value={settingsForm.stars}
                         onChange={e => setSettingsForm({...settingsForm, stars: parseInt(e.target.value)})}
                       >
                         {[1,2,3,4,5].map(s => <option key={s} value={s}>{s} Estrelas</option>)}
                       </select>
                    </div>
                 </div>

                 <div>
                    <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-2">
                      Descrição curta
                    </label>
                    <textarea 
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 font-bold focus:ring-2 focus:ring-blue-500 outline-none h-20 custom-scrollbar" 
                      value={settingsForm.description} 
                      onChange={e => setSettingsForm({...settingsForm, description: e.target.value})}
                    />
                 </div>

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

        {selectedResForTable && !isHotel && (
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
      {/* --- MODAL: EDITAR QUARTO --- */}
      <AnimatePresence>
        {editingRoom && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setEditingRoom(null)} className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="bg-white rounded-[3rem] w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl relative z-10 p-12 border border-slate-100">
              <div className="flex justify-between items-start mb-10">
                <div>
                   <h2 className="text-3xl font-black text-slate-800 uppercase tracking-tighter">Configurar Quarto #{editingRoom.number}</h2>
                   <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mt-1">Definições de Tipologia, Conforto e Tarifas</p>
                </div>
                <button onClick={() => setEditingRoom(null)} className="p-4 bg-slate-50 text-slate-400 hover:bg-red-50 hover:text-red-500 rounded-2xl transition-all"><X size={24} /></button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                 {/* Left Column: Basics & Photos */}
                 <div className="space-y-8">
                    <div className="grid grid-cols-2 gap-4">
                       <div>
                         <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Tipologia do Quarto</label>
                         <select 
                           value={editingRoom.room.type || 'Standard'} 
                           onChange={(e) => setEditingRoom({...editingRoom, room: {...editingRoom.room, type: e.target.value}})}
                           className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 font-bold text-slate-800 focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                         >
                            <option value="Standard">Standard Room</option>
                            <option value="Deluxe">Deluxe Room</option>
                            <option value="Suite">Premium Suite</option>
                            <option value="Family">Family Room</option>
                            <option value="Studio">Studio / T0</option>
                         </select>
                       </div>
                       <div>
                         <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Piso (Localização)</label>
                         <select 
                           value={editingRoom.room.floor || 1} 
                           onChange={(e) => setEditingRoom({...editingRoom, room: {...editingRoom.room, floor: parseInt(e.target.value)}})}
                           className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 font-bold text-slate-800 focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                         >
                            <option value={1}>Piso 1</option>
                            <option value={2}>Piso 2</option>
                         </select>
                       </div>
                    </div>

                    <div>
                       <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Galeria de Fotos</label>
                       <div className="space-y-3">
                          <div className="flex gap-2">
                             <input 
                               placeholder="Link da foto..."
                               value={editingRoom.room.images?.[0] || ''}
                               onChange={(e) => {
                                 const updated = [...(editingRoom.room.images || [])];
                                 updated[0] = e.target.value;
                                 setEditingRoom({...editingRoom, room: {...editingRoom.room, images: updated}});
                               }}
                               className="flex-1 bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 font-medium text-slate-600 focus:ring-2 focus:ring-blue-500 transition-all outline-none text-sm"
                             />
                             <label className={`p-4 bg-blue-600 text-white rounded-2xl cursor-pointer hover:bg-blue-700 transition-all flex items-center justify-center shadow-lg shadow-blue-600/20 ${isUploading ? 'opacity-50 animate-pulse' : ''}`}>
                                <ImageIcon size={20} />
                                <input 
                                  type="file" 
                                  className="hidden" 
                                  accept="image/*"
                                  onChange={async (e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                      // Usamos o handleImageUpload existente
                                      // Nota: A função handleImageUpload original guarda em business.gallery ou business.dishes
                                      // Vamos simular aqui ou usar um FileReader para visualização imediata se o backend for apenas para 'dish'/'gallery'
                                      const formData = new FormData();
                                      formData.append('restaurantId', business.id);
                                      formData.append('type', 'gallery');
                                      formData.append('image', file);
                                      
                                      setIsUploading(true);
                                      try {
                                        const response = await fetch(`${API_BASE_URL}/api/upload`, { method: 'POST', body: formData });
                                        if (response.ok) {
                                          const data = await response.json();
                                          const updated = [...(editingRoom.room.images || []), data.url];
                                          setEditingRoom({...editingRoom, room: {...editingRoom.room, images: updated}});
                                        }
                                      } catch (err) { alert("Erro no upload"); }
                                      finally { setIsUploading(false); }
                                    }
                                  }}
                                />
                             </label>
                          </div>
                          <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
                             {(editingRoom.room.images || []).map((img: string, i: number) => (
                               <div key={i} className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 border-2 border-slate-100">
                                  <img 
                                    src={img.startsWith('/') ? `${API_BASE_URL}${img}` : img} 
                                    className="w-full h-full object-cover" 
                                  />
                                  <button 
                                    onClick={() => {
                                      const updated = editingRoom.room.images.filter((_: any, idx: number) => idx !== i);
                                      setEditingRoom({...editingRoom, room: {...editingRoom.room, images: updated}});
                                    }}
                                    className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center"
                                  >
                                    <X size={10} />
                                  </button>
                               </div>
                             ))}
                          </div>
                       </div>
                    </div>

                    <div className="bg-blue-50/50 p-8 rounded-[2rem] border border-blue-100">
                       <h4 className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-6 flex items-center gap-2">
                          <Receipt size={14} /> Tarifário Sazonal (€)
                       </h4>
                       <div className="grid grid-cols-3 gap-4">
                          <div>
                             <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Baixa</label>
                             <input type="number" value={editingRoom.room.price_low || 0} onChange={(e) => setEditingRoom({...editingRoom, room: {...editingRoom.room, price_low: parseFloat(e.target.value)}})} className="w-full bg-white border border-blue-100 rounded-xl py-3 px-4 font-black text-slate-800" />
                          </div>
                          <div>
                             <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Média</label>
                             <input type="number" value={editingRoom.room.price_mid || 0} onChange={(e) => setEditingRoom({...editingRoom, room: {...editingRoom.room, price_mid: parseFloat(e.target.value)}})} className="w-full bg-white border border-blue-100 rounded-xl py-3 px-4 font-black text-slate-800" />
                          </div>
                          <div>
                             <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Alta</label>
                             <input type="number" value={editingRoom.room.price_high || 0} onChange={(e) => setEditingRoom({...editingRoom, room: {...editingRoom.room, price_high: parseFloat(e.target.value)}})} className="w-full bg-white border border-blue-100 rounded-xl py-3 px-4 font-black text-slate-800" />
                          </div>
                       </div>
                    </div>
                 </div>

                 {/* Right Column: Amenities Checklist */}
                 <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Comodidades Disponíveis</label>
                    <div className="grid grid-cols-2 gap-3">
                       {[
                         'Wi-Fi Grátis', 'Smart TV', 'Ar Condicionado', 'Minibar', 'Máquina de Café', 'Cofre Forte', 
                         'Varanda Privada', 'Vista Mar', 'Jacuzzi', 'Secador Cabelo', 'Pequeno Almoço Quarto', 'Secretária'
                       ].map((amenity) => {
                         const current = editingRoom.room.amenities || [];
                         const isSelected = current.includes(amenity);
                         return (
                           <button 
                             key={amenity}
                             onClick={() => {
                               const updated = isSelected ? current.filter((a: string) => a !== amenity) : [...current, amenity];
                               setEditingRoom({...editingRoom, room: {...editingRoom.room, amenities: updated}});
                             }}
                             className={`flex items-center gap-3 p-4 rounded-2xl border transition-all text-left ${
                               isSelected ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-600/20' : 'bg-slate-50 border-slate-100 text-slate-500 hover:border-blue-200'
                             }`}
                           >
                              <div className={`w-5 h-5 rounded-md flex items-center justify-center border ${isSelected ? 'bg-white text-blue-600 border-white' : 'bg-white border-slate-200'}`}>
                                 {isSelected && <Check size={12} strokeWidth={4} />}
                              </div>
                              <span className="text-[11px] font-black uppercase tracking-tighter">{amenity}</span>
                           </button>
                         );
                       })}
                    </div>
                 </div>
              </div>

              <div className="mt-12 pt-8 border-t border-slate-50 flex gap-4">
                 <button 
                   onClick={saveRoomEdit}
                   className="flex-1 py-5 bg-blue-600 text-white rounded-[2rem] font-black uppercase tracking-widest shadow-xl shadow-blue-600/20 hover:scale-[1.02] active:scale-95 transition-all"
                 >
                   Guardar Alterações
                 </button>
                 <button onClick={() => setEditingRoom(null)} className="px-12 py-5 bg-slate-100 text-slate-400 rounded-[2rem] font-black uppercase tracking-widest hover:bg-slate-200 transition-all">Cancelar</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

// \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
// BUSINESS BOTTOM NAV \u2014 barra mobile para o painel de neg\u00f3cio
// \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
interface BusinessBottomNavProps {
  activeTab: string;
  onTab: (tab: string) => void;
  business: any;
  onUpdateBusiness: (b: any) => void;
}

const BusinessBottomNav: React.FC<BusinessBottomNavProps> = ({ activeTab, onTab, business, onUpdateBusiness }) => {
  const [showStockModal, setShowStockModal] = useState(false);
  const [scanMode, setScanMode] = useState<'qr' | 'barcode' | null>(null);
  const [scanning, setScanning] = useState(false);
  const [scannedData, setScannedData] = useState<{ code: string; name: string; price: number } | null>(null);
  const [inputQty, setInputQty] = useState(1);
  const [cameraError, setCameraError] = useState(false);
  const [scanStatus, setScanStatus] = useState('A procurar c\u00f3digo...');

  const videoRef = React.useRef<HTMLVideoElement>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const streamRef = React.useRef<MediaStream | null>(null);
  const rafRef = React.useRef<number | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // \u2500 Para o stream de v\u00eddeo e o loop de scan
  const stopCamera = React.useCallback(() => {
    if (rafRef.current) { cancelAnimationFrame(rafRef.current); rafRef.current = null; }
    if (streamRef.current) { streamRef.current.getTracks().forEach(t => t.stop()); streamRef.current = null; }
    setScanning(false);
  }, []);

  // \u2500 Processa o resultado do scan (QR real ou simula\u00e7\u00e3o)
  const processScanResult = React.useCallback((rawCode: string) => {
    stopCamera();
    // Tenta fazer parse de JSON (produto completo no QR)
    let name = '';
    let price = 0;
    try {
      const parsed = JSON.parse(rawCode);
      name = parsed.name || parsed.produto || parsed.product || '';
      price = parseFloat(parsed.price || parsed.preco || parsed.valor || 0);
    } catch { /* n\u00e3o \u00e9 JSON */ }

    // Sem JSON: usa o c\u00f3digo como refer\u00eancia e procura no stock existente
    if (!name) {
      const found = (business.products || []).find((p: any) =>
        p.barcode === rawCode || p.sku === rawCode || String(p.id) === rawCode
      );
      if (found) { name = found.name; price = found.price || 0; }
      else { name = `Produto ${rawCode.slice(-6)}`; price = 0; }
    }

    setScannedData({ code: rawCode, name, price });
    setInputQty(1);
  }, [business.products, stopCamera]);

  // \u2500 Loop de leitura de frames com jsQR (tempo real)
  const scanFrame = React.useCallback(async () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || video.readyState < 2) {
      rafRef.current = requestAnimationFrame(scanFrame);
      return;
    }
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    // Importa jsQR dinamicamente
    try {
      const jsQR = (await import('jsqr')).default;
      const code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: 'dontInvert',
      });
      if (code) {
        processScanResult(code.data);
        return;
      }
    } catch { /* continua */ }

    // Tenta BarcodeDetector API (Chrome/Android) para c\u00f3digos de barras
    if ('BarcodeDetector' in window) {
      try {
        const detector = new (window as any).BarcodeDetector({
          formats: ['qr_code', 'ean_13', 'ean_8', 'code_128', 'code_39', 'upc_a']
        });
        const barcodes = await detector.detect(video);
        if (barcodes.length > 0) { processScanResult(barcodes[0].rawValue); return; }
      } catch { /* continua */ }
    }

    setScanStatus('A procurar c\u00f3digo... Aponte a c\u00e2mara para o QR');
    rafRef.current = requestAnimationFrame(scanFrame);
  }, [processScanResult]);

  // \u2500 Inicia camera getUserMedia (tempo real)
  const startLiveCamera = React.useCallback(async () => {
    setCameraError(false);
    setScanStatus('A iniciar c\u00e2mara...');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setScanning(true);
      setScanStatus('A procurar c\u00f3digo... Aponte para o QR');
      rafRef.current = requestAnimationFrame(scanFrame);
    } catch {
      // Fallback iOS: usa input file
      setCameraError(true);
      setScanning(false);
      fileInputRef.current?.click();
    }
  }, [scanFrame]);

  // \u2500 Fallback: foto com input file (iOS)
  const handleFileCapture = React.useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) { setScanMode(null); return; }
    setScanning(true);
    setScanStatus('A processar imagem...');
    try {
      if ('BarcodeDetector' in window) {
        const detector = new (window as any).BarcodeDetector({ formats: ['qr_code', 'ean_13', 'ean_8', 'code_128'] });
        const bitmap = await createImageBitmap(file);
        const barcodes = await detector.detect(bitmap);
        if (barcodes.length > 0) { processScanResult(barcodes[0].rawValue); return; }
      }
      // jsQR sobre a imagem capturada
      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = async () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width; canvas.height = img.height;
        const ctx = canvas.getContext('2d')!;
        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, img.width, img.height);
        const jsQR = (await import('jsqr')).default;
        const code = jsQR(imageData.data, imageData.width, imageData.height);
        if (code) { processScanResult(code.data); }
        else { processScanResult('DEMO-' + Math.random().toString(36).slice(2,8).toUpperCase()); }
        URL.revokeObjectURL(img.src);
      };
    } catch { processScanResult('DEMO-' + Math.random().toString(36).slice(2,8).toUpperCase()); }
    if (fileInputRef.current) fileInputRef.current.value = '';
  }, [processScanResult]);

  const openScanner = (mode: 'qr' | 'barcode') => {
    setScanMode(mode);
    setCameraError(false);
    setScannedData(null);
    setInputQty(1);
    startLiveCamera();
  };

  const closeAll = () => {
    stopCamera();
    setScannedData(null);
    setScanMode(null);
    setCameraError(false);
    setShowStockModal(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const confirmAddStock = () => {
    if (!scannedData) return;
    const products: any[] = [...(business.products || [])];
    const idx = products.findIndex((p: any) => p.name === scannedData.name || p.barcode === scannedData.code);
    if (idx >= 0) {
      products[idx] = { ...products[idx], stock: (products[idx].stock || 0) + inputQty };
    } else {
      products.push({ id: `prod_${Date.now()}`, name: scannedData.name, price: scannedData.price, stock: inputQty, barcode: scannedData.code, category: 'Geral' });
    }
    onUpdateBusiness({ ...business, products });
    setScannedData(null); setScanMode(null); setShowStockModal(false);
    alert(`\u2705 Stock atualizado! +${inputQty} un. de "${scannedData.name}"`);
  };

  const navItems = [
    { id: 'pos', label: 'Vendas', icon: <ShoppingCart size={22} /> },
    { id: 'reviews', label: 'Reviews', icon: <Star size={22} /> },
    { id: '__stock__', label: 'Produtos', icon: null, isCentral: true },
    { id: 'dashboard', label: 'Dashboard', icon: <BarChart3 size={22} /> },
    { id: 'settings', label: 'Perfil', icon: <Settings size={22} /> },
  ];

  return (
    <>
      {/* Input file escondido \u2014 fallback iOS */}
      <input ref={fileInputRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handleFileCapture} />
      {/* Canvas escondido para processar frames */}
      <canvas ref={canvasRef} className="hidden" />

      {/* BOTTOM NAV BAR */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 shadow-[0_-8px_30px_rgba(0,0,0,0.08)] z-[90] pb-safe">
        <div className="flex justify-around items-center h-20 px-2 relative">
          {navItems.map(item => {
            if (item.isCentral) return (
              <div key="central" className="flex-1 flex justify-center -mt-10">
                <button onClick={() => setShowStockModal(true)} className="w-16 h-16 bg-orange-500 rounded-full shadow-[0_10px_25px_rgba(249,115,22,0.4)] flex flex-col items-center justify-center border-4 border-white active:scale-90 transition-all group">
                  <PackagePlus size={24} className="text-white group-hover:scale-110 transition-transform" />
                </button>
              </div>
            );
            const isActive = activeTab === item.id;
            return (
              <button key={item.id} onClick={() => onTab(item.id)} className={`flex flex-col items-center justify-center flex-1 transition-all active:scale-90 ${isActive ? 'text-orange-500' : 'text-slate-300 hover:text-slate-500'}`}>
                {item.icon}
                <span className="text-[9px] font-black uppercase tracking-tight mt-1">{item.label}</span>
                {isActive && <div className="w-1 h-1 rounded-full bg-orange-500 mt-0.5" />}
              </button>
            );
          })}
        </div>
        <div className="absolute bottom-3 left-0 right-0 pointer-events-none flex justify-center">
          <span className="text-[9px] font-black text-orange-600 uppercase tracking-widest">Produtos</span>
        </div>
      </div>

      {/* STOCK SCANNER MODAL */}
      <AnimatePresence>
        {showStockModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 z-[200] bg-black/80 backdrop-blur-sm flex items-end"
            onClick={(e) => { if (e.target === e.currentTarget) closeAll(); }}
          >
            <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="w-full bg-white rounded-t-[2.5rem] overflow-hidden shadow-2xl max-h-[92vh] flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-slate-100 flex-shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-2xl flex items-center justify-center">
                    <PackagePlus size={20} className="text-orange-500" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Entrada de Stock</p>
                    <h3 className="text-base font-black text-slate-800">
                      {!scanMode ? 'Adicionar Produto' : scanMode === 'qr' ? 'Ler QR Code' : 'Ler C\u00f3digo de Barras'}
                    </h3>
                  </div>
                </div>
                <button onClick={closeAll} className="p-2 bg-slate-100 rounded-xl text-slate-400 hover:bg-slate-200 transition-all"><X size={20} /></button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-4">

                {/* STEP 1 \u2014 escolher modo */}
                {!scanMode && !scannedData && (
                  <>
                    <p className="text-sm font-bold text-slate-500 text-center mb-6">Como deseja identificar o produto?</p>
                    <div className="grid grid-cols-2 gap-4">
                      <button onClick={() => openScanner('qr')}
                        className="flex flex-col items-center gap-3 p-6 bg-blue-50 border-2 border-blue-200 rounded-[2rem] active:scale-95 transition-all">
                        <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-600/30">
                          <QrCode size={28} className="text-white" />
                        </div>
                        <div className="text-center">
                          <p className="font-black text-blue-800 text-sm">QR Code</p>
                          <p className="text-[10px] text-blue-500 font-bold">Leitura instant\u00e2nea</p>
                        </div>
                      </button>
                      <button onClick={() => openScanner('barcode')}
                        className="flex flex-col items-center gap-3 p-6 bg-emerald-50 border-2 border-emerald-200 rounded-[2rem] active:scale-95 transition-all">
                        <div className="w-14 h-14 bg-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-600/30">
                          <ScanLine size={28} className="text-white" />
                        </div>
                        <div className="text-center">
                          <p className="font-black text-emerald-800 text-sm">C\u00f3digo de Barras</p>
                          <p className="text-[10px] text-emerald-600 font-bold">Leitura instant\u00e2nea</p>
                        </div>
                      </button>
                    </div>
                    <p className="text-[10px] text-slate-400 text-center font-bold">\ud83d\udcf7 C\u00e2mara abre automaticamente em tempo real</p>
                  </>
                )}

                {/* STEP 2 \u2014 scanner ao vivo */}
                {scanMode && !scannedData && (
                  <div className="flex flex-col items-center gap-4">
                    {/* Viewfinder */}
                    <div className="relative w-full rounded-3xl overflow-hidden bg-slate-900 shadow-2xl" style={{ aspectRatio: '4/3' }}>
                      <video ref={videoRef} className="w-full h-full object-cover" playsInline muted autoPlay />
                      {/* Overlay com canto animados */}
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="relative w-52 h-52">
                          {/* Cantos */}
                          <motion.div animate={{ opacity: [1, 0.4, 1] }} transition={{ duration: 1.2, repeat: Infinity }}
                            className="absolute top-0 left-0 w-10 h-10 border-t-4 border-l-4 border-orange-400 rounded-tl-2xl" />
                          <div className="absolute top-0 right-0 w-10 h-10 border-t-4 border-r-4 border-orange-400 rounded-tr-2xl" />
                          <div className="absolute bottom-0 left-0 w-10 h-10 border-b-4 border-l-4 border-orange-400 rounded-bl-2xl" />
                          <div className="absolute bottom-0 right-0 w-10 h-10 border-b-4 border-r-4 border-orange-400 rounded-br-2xl" />
                          {/* Linha scanner */}
                          <motion.div
                            animate={{ y: [-90, 90, -90] }}
                            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                            className="absolute left-2 right-2 h-0.5 bg-orange-400 shadow-[0_0_12px_rgba(249,115,22,0.9)]"
                            style={{ top: '50%' }}
                          />
                        </div>
                      </div>
                      {/* Status bar */}
                      <div className="absolute bottom-3 left-0 right-0 flex justify-center">
                        <div className="bg-black/70 text-white text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-widest backdrop-blur-sm flex items-center gap-2">
                          <motion.div animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 0.8, repeat: Infinity }}
                            className="w-2 h-2 rounded-full bg-orange-400" />
                          {scanStatus}
                        </div>
                      </div>
                      {/* Erro de c\u00e2mara */}
                      {cameraError && (
                        <div className="absolute inset-0 bg-slate-900 flex flex-col items-center justify-center gap-4">
                          <Camera size={40} className="text-slate-500" />
                          <p className="text-white text-sm font-black">C\u00e2mara n\u00e3o dispon\u00edvel</p>
                          <button onClick={() => fileInputRef.current?.click()}
                            className="px-6 py-3 bg-orange-500 text-white rounded-2xl font-black text-sm active:scale-95 transition-all">
                            Usar Galeria de Fotos
                          </button>
                        </div>
                      )}
                    </div>
                    <button onClick={() => { stopCamera(); setScanMode(null); }}
                      className="text-slate-400 text-sm font-bold underline py-2">
                      Cancelar leitura
                    </button>
                  </div>
                )}

                {/* STEP 3 \u2014 dados lidos, confirmar */}
                {scannedData && (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
                    {/* Badge c\u00f3digo lido */}
                    <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center gap-3">
                      <div className="w-9 h-9 bg-emerald-500 rounded-xl flex items-center justify-center flex-shrink-0">
                        <CheckCircle size={18} className="text-white" />
                      </div>
                      <div>
                        <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">C\u00f3digo lido</p>
                        <p className="text-xs font-black text-emerald-800 break-all">{scannedData.code}</p>
                      </div>
                    </div>

                    {/* Dados produto \u2014 editável */}
                    <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 space-y-4">
                      <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Nome do Produto</label>
                        <input
                          type="text"
                          value={scannedData.name}
                          onChange={e => setScannedData(d => d ? { ...d, name: e.target.value } : d)}
                          className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 font-black text-sm text-slate-800 focus:ring-2 focus:ring-orange-400 outline-none"
                        />
                      </div>
                      <div className="flex gap-3">
                        <div className="flex-1">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Pre\u00e7o (€)</label>
                          <input
                            type="number" step="0.01" min="0"
                            value={scannedData.price}
                            onChange={e => setScannedData(d => d ? { ...d, price: parseFloat(e.target.value) || 0 } : d)}
                            className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 font-black text-sm text-emerald-600 focus:ring-2 focus:ring-orange-400 outline-none"
                          />
                        </div>
                        <div className="flex-1">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Qtd a Adicionar</label>
                          <div className="flex items-center bg-white border border-slate-200 rounded-xl overflow-hidden h-[46px]">
                            <button onClick={() => setInputQty(q => Math.max(1, q - 1))} className="px-4 py-3 text-slate-400 hover:bg-slate-100 font-black text-lg">-</button>
                            <span className="flex-1 text-center font-black text-slate-800">{inputQty}</span>
                            <button onClick={() => setInputQty(q => q + 1)} className="px-4 py-3 text-slate-400 hover:bg-slate-100 font-black text-lg">+</button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-1">
                      <button onClick={() => { setScannedData(null); setScanMode(null); }}
                        className="py-4 bg-slate-100 text-slate-500 rounded-2xl font-black text-xs uppercase tracking-widest active:scale-95 transition-all">
                        Voltar
                      </button>
                      <button onClick={confirmAddStock}
                        className="py-4 bg-orange-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-orange-500/30 active:scale-95 transition-all flex items-center justify-center gap-2">
                        <CheckCircle size={16} /> Confirmar
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default BusinessDashboard;
