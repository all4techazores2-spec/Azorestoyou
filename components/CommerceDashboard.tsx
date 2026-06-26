import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, ShoppingBag, ShoppingCart, Users, Percent, BarChart3, 
  MessageSquare, Settings, LogOut, Search, Bell, MapPin, Plus, Trash2, 
  Edit3, X, ChevronDown, CheckCircle, AlertTriangle, Calendar, ChevronRight, 
  Image as ImageIcon, ArrowRight, Star, Package, Clock, FileText, Check, 
  FileSpreadsheet, TrendingUp, Sparkles, SlidersHorizontal, Compass
} from 'lucide-react';
import { Business, Language } from '../types';

interface CommerceDashboardProps {
  business: Business;
  language: Language;
  onLogout: () => void;
  onUpdateBusiness: (updated: Business) => void;
}

interface Product {
  id: string;
  name: string;
  category: string;
  description: string;
  image: string;
  price: number;
  promoPrice?: number;
  vat: number;
  sku: string;
  barcode: string;
  brand: string;
  supplier: string;
  stock: number;
  status: 'active' | 'draft';
  showInApp: boolean;
  allowReservation: boolean;
  allowPurchase: boolean;
  allowStorePickup: boolean;
  promoStart?: string;
  promoEnd?: string;
  salesCount: number;
}

interface OrderOrReservation {
  id: string;
  type: 'order' | 'reservation';
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  productName: string;
  productImage: string;
  amount: number;
  time: string;
  date: string;
  status: 'Nova Reserva' | 'Confirmada' | 'Em Preparação' | 'Pronta para Levantar' | 'Levantada' | 'Cancelada';
}

export const CommerceDashboard: React.FC<CommerceDashboardProps> = ({
  business,
  language = 'pt',
  onLogout,
  onUpdateBusiness
}) => {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [globalSearch, setGlobalSearch] = useState<string>('');

  // Mock Products Database
  const [products, setProducts] = useState<Product[]>([
    { 
      id: 'PROD001', 
      name: 'Queijo de São Jorge DOP (Cura 12 Meses)', 
      category: 'Gastronomia', 
      description: 'Queijo tradicional curado de pasta dura e quebradiça, com sabor ligeiramente picante e aroma persistente.', 
      image: 'https://images.unsplash.com/photo-1486299267070-8382e21b471a?auto=format&fit=crop&q=80&w=200', 
      price: 24.50, 
      promoPrice: 21.90, 
      vat: 18, 
      sku: 'QJSJ-12M', 
      barcode: '5601234567890', 
      brand: 'Uniqueijo', 
      supplier: 'Lactaçores', 
      stock: 45, 
      status: 'active', 
      showInApp: true, 
      allowReservation: true, 
      allowPurchase: true, 
      allowStorePickup: true,
      promoStart: '2026-06-01',
      promoEnd: '2026-07-31',
      salesCount: 88
    },
    { 
      id: 'PROD002', 
      name: 'Bolo Lêvedo de Sete Cidades (Pack x6)', 
      category: 'Gastronomia', 
      description: 'Bolo lêvedo tradicional dos Açores, doce e fofo, ideal para pequeno-almoço ou lanche.', 
      image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=200', 
      price: 4.80, 
      vat: 18, 
      sku: 'BLSD-P6', 
      barcode: '5609876543210', 
      brand: 'Sete Cidades Tradicional', 
      supplier: 'Padaria Regional Sete Cidades', 
      stock: 12, 
      status: 'active', 
      showInApp: true, 
      allowReservation: true, 
      allowPurchase: true, 
      allowStorePickup: true,
      salesCount: 154
    },
    { 
      id: 'PROD003', 
      name: 'Chá Preto Gorreana Orange Pekoe 100g', 
      category: 'Gastronomia', 
      description: 'Produzido a partir da segunda folha do rebento do chá, é um chá preto suave, aromático e de cor âmbar.', 
      image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&q=80&w=200', 
      price: 3.90, 
      vat: 18, 
      sku: 'CHA-GOR-OP', 
      barcode: '5605555555555', 
      brand: 'Gorreana', 
      supplier: 'Chá Gorreana Lda', 
      stock: 3, 
      status: 'active', 
      showInApp: true, 
      allowReservation: true, 
      allowPurchase: false, 
      allowStorePickup: true,
      salesCount: 110
    },
    { 
      id: 'PROD004', 
      name: 'Presépio de Lapinha Regional (Artesanato)', 
      category: 'Artesanato', 
      description: 'Miniatura de presépio de lapinha artesanal feito em caixa de vidro com conchas, musgo seco e flores de escama.', 
      image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=200', 
      price: 65.00, 
      vat: 18, 
      sku: 'ART-LAP-M', 
      barcode: '5606666666666', 
      brand: 'Artesanato de São Miguel', 
      supplier: 'Cooperativa de Artesanato Regional', 
      stock: 2, 
      status: 'active', 
      showInApp: true, 
      allowReservation: true, 
      allowPurchase: true, 
      allowStorePickup: true,
      salesCount: 15
    },
    { 
      id: 'PROD005', 
      name: 'Licor de Amora do Nordeste 500ml', 
      category: 'Gastronomia', 
      description: 'Licor artesanal açoriano produzido a partir de amoras silvestres selecionadas no concelho do Nordeste.', 
      image: 'https://images.unsplash.com/photo-1510626176961-4b57d4fbad03?auto=format&fit=crop&q=80&w=200', 
      price: 12.50, 
      promoPrice: 9.90,
      vat: 18, 
      sku: 'LIC-AMO-50', 
      barcode: '5607777777777', 
      brand: 'Nordeste Licores', 
      supplier: 'Adega Regional Nordeste', 
      stock: 18, 
      status: 'draft', 
      showInApp: false, 
      allowReservation: false, 
      allowPurchase: false, 
      allowStorePickup: false,
      promoStart: '2026-06-20',
      promoEnd: '2026-06-30',
      salesCount: 2
    }
  ]);

  // Mock Orders and Reservations
  const [orders, setOrders] = useState<OrderOrReservation[]>([
    {
      id: 'LOJ-1024',
      type: 'order',
      customerName: 'Joana Martins',
      customerPhone: '+351 961 852 963',
      customerEmail: 'joana.m@mail.com',
      productName: 'Queijo de São Jorge DOP (Cura 12 Meses)',
      productImage: 'https://images.unsplash.com/photo-1486299267070-8382e21b471a?auto=format&fit=crop&q=80&w=200',
      amount: 43.80,
      time: '10:30',
      date: new Date().toISOString().split('T')[0],
      status: 'Nova Reserva'
    },
    {
      id: 'LOJ-1025',
      type: 'reservation',
      customerName: 'Rui Medeiros',
      customerPhone: '+351 925 369 147',
      customerEmail: 'rui.med@sapo.pt',
      productName: 'Presépio de Lapinha Regional (Artesanato)',
      productImage: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=200',
      amount: 65.00,
      time: '11:15',
      date: new Date().toISOString().split('T')[0],
      status: 'Confirmada'
    },
    {
      id: 'LOJ-1026',
      type: 'order',
      customerName: 'Maria Silva',
      customerPhone: '+351 964 852 741',
      customerEmail: 'maria.silva@gmail.com',
      productName: 'Chá Preto Gorreana Orange Pekoe 100g',
      productImage: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&q=80&w=200',
      amount: 11.70,
      time: '09:45',
      date: new Date().toISOString().split('T')[0],
      status: 'Pronta para Levantar'
    },
    {
      id: 'LOJ-1027',
      type: 'reservation',
      customerName: 'Carlos Sousa',
      customerPhone: '+351 931 753 951',
      customerEmail: 'carlos.s@outlook.pt',
      productName: 'Bolo Lêvedo de Sete Cidades (Pack x6)',
      productImage: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=200',
      amount: 9.60,
      time: 'Yesterday',
      date: '2026-06-25',
      status: 'Levantada'
    }
  ]);

  // Selected Order for status changes
  const [selectedOrder, setSelectedOrder] = useState<OrderOrReservation | null>(null);

  // New Product Modal Form State
  const [showProductModal, setShowProductModal] = useState(false);
  const [isEditingProduct, setIsEditingProduct] = useState(false);
  const [productForm, setProductForm] = useState<Partial<Product>>({
    id: '', name: '', category: 'Gastronomia', description: '', image: '', price: 0, promoPrice: undefined, vat: 18, sku: '', barcode: '', brand: '', supplier: '', stock: 10, status: 'active', showInApp: true, allowReservation: true, allowPurchase: true, allowStorePickup: true, promoStart: '', promoEnd: '', salesCount: 0
  });

  // New Promotion Modal Form State
  const [showPromoModal, setShowPromoModal] = useState(false);
  const [promoForm, setPromoForm] = useState({
    productId: '', promoPrice: 0, promoStart: '', promoEnd: ''
  });

  // Commission Metrics
  const commissionRate = 0.08; // 8% commission
  const todayRevenue = orders
    .filter(o => o.status === 'Levantada' && o.date === new Date().toISOString().split('T')[0])
    .reduce((acc, c) => acc + c.amount, 0) || 450.00;
  
  const monthlyRevenue = 4320.00;
  const totalRevenue = 15850.00;

  // Best Selling Product
  const bestSeller = products.reduce((prev, current) => (prev.salesCount > current.salesCount) ? prev : current);

  // Store App Status stats
  const publishedCount = products.filter(p => p.showInApp && p.status === 'active').length;
  const hiddenCount = products.filter(p => !p.showInApp || p.status === 'draft').length;
  const activePromos = products.filter(p => p.promoPrice && p.promoPrice < p.price).length;

  // Search Filtered items
  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(globalSearch.toLowerCase()) || 
    p.sku.toLowerCase().includes(globalSearch.toLowerCase()) ||
    p.category.toLowerCase().includes(globalSearch.toLowerCase())
  );

  const filteredOrders = orders.filter(o => 
    o.customerName.toLowerCase().includes(globalSearch.toLowerCase()) || 
    o.id.toLowerCase().includes(globalSearch.toLowerCase()) ||
    o.productName.toLowerCase().includes(globalSearch.toLowerCase())
  );

  const handleUpdateOrderStatus = (orderId: string, newStatus: OrderOrReservation['status']) => {
    const updated = orders.map(o => {
      if (o.id === orderId) {
        // If transitioning to "Levantada" (Collected), deduct stock of the product
        if (newStatus === 'Levantada' && o.status !== 'Levantada') {
          setProducts(prevProds => prevProds.map(p => {
            if (p.name === o.productName) {
              return { ...p, stock: Math.max(0, p.stock - 1), salesCount: p.salesCount + 1 };
            }
            return p;
          }));
        }
        return { ...o, status: newStatus };
      }
      return o;
    });
    setOrders(updated);
    if (selectedOrder?.id === orderId) {
      setSelectedOrder(prev => prev ? { ...prev, status: newStatus } : null);
    }
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm.name || !productForm.price) return;

    if (isEditingProduct) {
      setProducts(prev => prev.map(p => p.id === productForm.id ? (productForm as Product) : p));
      alert('Produto atualizado com sucesso!');
    } else {
      const newProd: Product = {
        ...(productForm as Product),
        id: `PROD${String(products.length + 1).padStart(3, '0')}`,
        image: productForm.image || 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=200',
        salesCount: 0
      };
      setProducts(prev => [...prev, newProd]);
      alert('Produto criado com sucesso!');
    }
    setShowProductModal(false);
  };

  const handleCreatePromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoForm.productId || !promoForm.promoPrice) return;

    setProducts(prev => prev.map(p => {
      if (p.id === promoForm.productId) {
        return {
          ...p,
          promoPrice: promoForm.promoPrice,
          promoStart: promoForm.promoStart || new Date().toISOString().split('T')[0],
          promoEnd: promoForm.promoEnd || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        };
      }
      return p;
    }));

    alert('Promoção ativada com sucesso!');
    setShowPromoModal(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans antialiased text-slate-800 flex">

      {/* ───────────────── SIDEBAR (Apple VisionOS / Fluent Glassmorphism) ───────────────── */}
      <aside className="w-80 bg-slate-900 text-white flex flex-col fixed h-full z-30 border-r border-white/5 shadow-2xl">
        
        {/* Partner Header */}
        <div className="p-6 border-b border-white/5 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-emerald-500 flex items-center justify-center shadow-lg">
            <span className="font-black text-white text-base">AZ</span>
          </div>
          <div>
            <h2 className="text-sm font-black uppercase tracking-widest text-white leading-none">Azores toYou</h2>
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Comércio Local</span>
          </div>
        </div>

        {/* Store Image & Name Card */}
        <div className="m-4 p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-800 flex items-center justify-center border border-white/10 flex-shrink-0">
            {business.image ? (
              <img src={business.image} alt={business.name} className="w-full h-full object-cover" />
            ) : (
              <ShoppingBag className="text-emerald-400 w-6 h-6" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-black uppercase tracking-tight text-white truncate">{business.name}</h4>
            <p className="text-[10px] font-bold text-slate-400 capitalize">{business.subcategory || 'Lojas Locais'}</p>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[9px] font-black uppercase tracking-widest text-emerald-400">Loja na App Online</span>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-4 py-2 space-y-1 overflow-y-auto scrollbar-hide">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={16} /> },
            { id: 'produtos', label: 'Produtos', icon: <Package size={16} /> },
            { id: 'encomendas', label: 'Encomendas & Reservas', icon: <ShoppingCart size={16} /> },
            { id: 'promocoes', label: 'Promoções', icon: <Percent size={16} /> },
            { id: 'clientes', label: 'Clientes', icon: <Users size={16} /> },
            { id: 'relatorios', label: 'Relatórios', icon: <BarChart3 size={16} /> },
            { id: 'mensagens', label: 'Mensagens', icon: <MessageSquare size={16} /> },
            { id: 'config', label: 'Definições', icon: <Settings size={16} /> }
          ].map(menu => (
            <button
              key={menu.id}
              onClick={() => setActiveTab(menu.id)}
              className={`w-full text-left px-4 py-3 rounded-xl flex items-center gap-3 transition-all ${
                activeTab === menu.id 
                  ? 'bg-gradient-to-r from-blue-600 to-emerald-600 shadow-lg text-white font-black' 
                  : 'text-slate-400 hover:bg-white/5 hover:text-white font-bold'
              }`}
            >
              {menu.icon}
              <span className="text-xs uppercase tracking-wider">{menu.label}</span>
            </button>
          ))}
        </nav>

        {/* Simplified Commission card */}
        <div className="p-4 mx-4 mb-2 bg-gradient-to-br from-blue-950 to-emerald-950 rounded-2xl border border-blue-500/20 text-center">
          <p className="text-[10px] font-black uppercase tracking-wider text-emerald-400">Comissão Azores toYou</p>
          <div className="grid grid-cols-3 gap-1 mt-2 text-[10px]">
            <div>
              <p className="text-slate-400 font-bold">Hoje</p>
              <p className="text-white font-black">€{(todayRevenue * commissionRate).toFixed(1)}</p>
            </div>
            <div className="border-x border-white/10">
              <p className="text-slate-400 font-bold">Mês</p>
              <p className="text-white font-black">€{(monthlyRevenue * commissionRate).toFixed(0)}</p>
            </div>
            <div>
              <p className="text-slate-400 font-bold">Total</p>
              <p className="text-white font-black">€{(totalRevenue * commissionRate).toFixed(0)}</p>
            </div>
          </div>
        </div>

        {/* Sidebar Footer Logout */}
        <div className="p-4 border-t border-white/5 flex items-center justify-between bg-slate-950">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl overflow-hidden border border-white/10">
              <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150" alt="Joana" className="w-full h-full object-cover" />
            </div>
            <div>
              <h5 className="text-xs font-black text-white">Joana Costa</h5>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Proprietária</p>
            </div>
          </div>
          <button onClick={onLogout} className="p-2 bg-white/5 hover:bg-red-500/10 hover:text-red-400 rounded-xl transition-all">
            <LogOut size={16} />
          </button>
        </div>
      </aside>

      {/* ───────────────── WORKSPACE CONTAINER ───────────────── */}
      <div className="flex-1 pl-80 min-h-screen bg-slate-50 flex flex-col">
        
        {/* Header */}
        <header className="px-8 py-5 bg-white border-b border-slate-100 flex items-center justify-between sticky top-0 z-20">
          <div className="flex-1 max-w-lg">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input 
                type="text" 
                placeholder="Pesquisar produtos, clientes ou encomendas..." 
                value={globalSearch}
                onChange={e => setGlobalSearch(e.target.value)}
                className="w-full bg-slate-50 hover:bg-slate-100 focus:bg-white border border-slate-100 rounded-full pl-10 pr-4 py-2 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3 bg-slate-100 px-3.5 py-1.5 rounded-full border border-slate-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[9px] font-black uppercase text-slate-600 tracking-wider">Online no Canal</span>
            </div>
            
            <div className="flex items-center gap-4 border-l border-slate-100 pl-6">
              <div className="text-right">
                <span className="block text-[10px] font-black text-slate-400 uppercase tracking-wider">Hoje: Sexta-feira</span>
                <span className="block text-xs font-black text-slate-700 tracking-tight">Ponta Delgada, 19°C</span>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="p-8 space-y-8 flex-1 max-w-7xl mx-auto w-full">

          {activeTab === 'dashboard' && (
            <div className="space-y-8 animate-in fade-in duration-300">
              
              {/* Row 1: Greeting & Upper Widgets */}
              <div className="grid grid-cols-3 gap-6">
                
                {/* Greeting & Quick actions */}
                <div className="col-span-2 bg-white rounded-3xl p-8 border border-slate-100 shadow-sm flex flex-col justify-between">
                  <div className="space-y-2">
                    <h2 className="text-3xl font-black text-slate-800 tracking-tight">Bom dia, Joana! 👋</h2>
                    <p className="text-slate-400 text-sm font-semibold">Resumo do comércio e operações da sua loja hoje. Tem encomendas prontas a aguardar levantamento.</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-6">
                    <button 
                      onClick={() => { setProductForm({ id: '', name: '', category: 'Gastronomia', description: '', price: 0, vat: 18, stock: 10, status: 'active', showInApp: true, allowReservation: true, allowPurchase: true, allowStorePickup: true }); setIsEditingProduct(false); setShowProductModal(true); }}
                      className="p-4 bg-slate-50 border border-slate-100 hover:border-blue-200 rounded-2xl flex items-center justify-between text-left transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform"><Plus size={18} /></div>
                        <div>
                          <h4 className="text-xs font-black uppercase text-slate-750">Novo Produto</h4>
                          <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Criar ficha e adicionar ao inventário</p>
                        </div>
                      </div>
                      <ChevronRight size={14} className="text-slate-300" />
                    </button>

                    <button 
                      onClick={() => { setPromoForm({ productId: products[0]?.id || '', promoPrice: 0, promoStart: '', promoEnd: '' }); setShowPromoModal(true); }}
                      className="p-4 bg-slate-50 border border-slate-100 hover:border-emerald-250 rounded-2xl flex items-center justify-between text-left transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform"><Percent size={18} /></div>
                        <div>
                          <h4 className="text-xs font-black uppercase text-slate-750">Criar Promoção</h4>
                          <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Definir preço de campanha ativo</p>
                        </div>
                      </div>
                      <ChevronRight size={14} className="text-slate-300" />
                    </button>
                  </div>
                </div>

                {/* Loja na App status card */}
                <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider">Loja na App</h4>
                      <p className="text-slate-700 text-xs font-bold mt-1">Canal de Venda Açores toYou</p>
                    </div>
                    <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center"><Compass size={16} /></div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 mt-4 text-center">
                    <div className="p-2 bg-blue-50/50 rounded-xl border border-blue-50">
                      <p className="text-[8px] font-black text-blue-600 uppercase">Publicados</p>
                      <p className="text-lg font-black text-slate-800 mt-1">{publishedCount}</p>
                    </div>
                    <div className="p-2 bg-slate-50 rounded-xl border border-slate-100">
                      <p className="text-[8px] font-black text-slate-400 uppercase">Ocultos</p>
                      <p className="text-lg font-black text-slate-800 mt-1">{hiddenCount}</p>
                    </div>
                    <div className="p-2 bg-emerald-50 rounded-xl border border-emerald-100">
                      <p className="text-[8px] font-black text-emerald-600 uppercase">Promoções</p>
                      <p className="text-lg font-black text-slate-850 mt-1">{activePromos}</p>
                    </div>
                  </div>

                  <button onClick={() => setActiveTab('produtos')} className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-[10px] font-black uppercase tracking-wider mt-4">
                    Gerir Vitrine da App
                  </button>
                </div>

              </div>

              {/* Row 2: KPI Metrics Cards */}
              <div className="grid grid-cols-5 gap-4">
                {[
                  { label: 'Vendas Hoje', value: `€${todayRevenue.toFixed(2)}`, desc: 'Volume faturado hoje', icon: <ShoppingCart className="text-blue-600" />, bg: 'bg-blue-50' },
                  { label: 'Reservas Pendentes', value: String(orders.filter(o => o.status === 'Nova Reserva').length), desc: 'Aguardam aceitação', icon: <Clock className="text-amber-500" />, bg: 'bg-amber-50' },
                  { label: 'Produto Mais Vendido', value: bestSeller.sku, desc: `${bestSeller.salesCount} un. vendidas`, icon: <Sparkles className="text-violet-500" />, bg: 'bg-violet-50' },
                  { label: 'Stock Crítico', value: String(products.filter(p => p.stock <= 5).length), desc: 'Menos de 5 unidades', icon: <AlertTriangle className="text-rose-500" />, bg: 'bg-rose-50' },
                  { label: 'Avaliação Média', value: '4.8', desc: 'Baseado em 142 avaliações', icon: <Star className="text-amber-450 fill-amber-400" />, bg: 'bg-amber-50' }
                ].map((kpi, idx) => (
                  <div key={idx} className="p-4 bg-white border border-slate-100 rounded-3xl flex flex-col justify-between shadow-sm hover:scale-[1.02] transition-transform">
                    <div className={`w-8 h-8 rounded-lg ${kpi.bg} flex items-center justify-center`}>{kpi.icon}</div>
                    <div className="mt-4">
                      <h4 className="text-lg font-black text-slate-800 leading-none">{kpi.value}</h4>
                      <p className="text-[9px] font-black uppercase text-slate-400 tracking-wider mt-1.5">{kpi.label}</p>
                      <p className="text-[9px] font-semibold text-slate-400 mt-0.5">{kpi.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Row 3: POS Hero Circle Card & Active Promos */}
              <div className="grid grid-cols-3 gap-6">
                
                {/* POS circle card */}
                <div className="col-span-2 bg-gradient-to-tr from-blue-600 via-blue-500 to-emerald-500 rounded-3xl p-8 text-white border border-white/5 relative overflow-hidden flex items-center justify-between shadow-lg">
                  <div className="space-y-4 max-w-sm">
                    <h3 className="text-2xl font-black uppercase tracking-tight">Ponto de Venda Rápida (POS)</h3>
                    <p className="text-white/80 text-sm font-semibold leading-relaxed">Faturação física na loja. Adicione produtos com scanner de código de barras e receba pagamentos de imediato.</p>
                    <button 
                      onClick={() => alert('A abrir terminal de vendas POS...')}
                      className="px-6 py-3.5 bg-white text-slate-900 rounded-2xl font-black uppercase tracking-wider text-xs shadow-xl active:scale-95 transition-all"
                    >
                      Aceder ao POS de Balcão
                    </button>
                  </div>
                  <div className="w-40 h-40 rounded-full border-8 border-white/10 bg-white/5 backdrop-blur-md flex flex-col items-center justify-center hover:scale-105 transition-transform cursor-pointer">
                    <ShoppingCart size={40} className="text-white" />
                    <span className="text-[10px] font-black uppercase tracking-widest mt-2">VENDER POS</span>
                  </div>
                </div>

                {/* Active Promotions Card */}
                <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between">
                  <div className="flex justify-between items-center border-b border-slate-50 pb-2">
                    <h3 className="font-black text-slate-800 text-xs uppercase tracking-wider">Promoções Ativas</h3>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[8px] font-black uppercase">CAMPANHA</span>
                  </div>

                  <div className="space-y-3 py-3 flex-1 overflow-y-auto max-h-36 scrollbar-hide">
                    {products.filter(p => p.promoPrice).map(p => (
                      <div key={p.id} className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <img src={p.image} alt={p.name} className="w-8 h-8 rounded-lg object-cover" />
                          <div className="min-w-0">
                            <h4 className="font-bold text-slate-700 truncate max-w-[120px]">{p.name}</h4>
                            <p className="text-[9px] text-slate-400 font-semibold">Expira: {p.promoEnd}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-[9px] text-slate-400 line-through">€{p.price.toFixed(2)}</p>
                          <p className="font-black text-emerald-600">€{p.promoPrice?.toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                    {products.filter(p => p.promoPrice).length === 0 && (
                      <p className="text-slate-400 text-xs italic text-center">Nenhuma promoção ativa de momento.</p>
                    )}
                  </div>

                  <button onClick={() => { setPromoForm({ productId: products[0]?.id || '', promoPrice: 0, promoStart: '', promoEnd: '' }); setShowPromoModal(true); }} className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-[10px] font-black uppercase tracking-wider">
                    Nova Promoção
                  </button>
                </div>

              </div>

              {/* Row 4: Recent Orders & Pending Reservations lists */}
              <div className="grid grid-cols-2 gap-6">
                
                {/* Orders list */}
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-black text-slate-800 text-xs uppercase tracking-wider">Últimas Encomendas</h3>
                    <button onClick={() => setActiveTab('encomendas')} className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Ver Todas</button>
                  </div>
                  <div className="space-y-3">
                    {filteredOrders.slice(0, 4).map(o => (
                      <div 
                        key={o.id}
                        onClick={() => setSelectedOrder(o)}
                        className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                          selectedOrder?.id === o.id ? 'bg-blue-50/60 border-blue-200' : 'bg-slate-50 border-slate-100 hover:border-slate-200'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg overflow-hidden bg-slate-250 flex-shrink-0">
                            <img src={o.productImage} alt={o.productName} className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-mono text-[10px] font-black text-slate-400">{o.id}</span>
                              <span className="text-[9px] font-black text-slate-450 uppercase">• {o.customerName}</span>
                            </div>
                            <h4 className="font-bold text-slate-700 text-xs truncate max-w-[150px]">{o.productName}</h4>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider block text-center ${
                            o.status === 'Nova Reserva' ? 'bg-blue-100 text-blue-700' :
                            o.status === 'Confirmada' ? 'bg-purple-100 text-purple-700' :
                            o.status === 'Em Preparação' ? 'bg-amber-100 text-amber-700' :
                            o.status === 'Pronta para Levantar' ? 'bg-emerald-100 text-emerald-700' :
                            o.status === 'Levantada' ? 'bg-slate-200 text-slate-700' : 'bg-red-100 text-red-700'
                          }`}>
                            {o.status}
                          </span>
                          <span className="font-mono text-xs font-black text-slate-800 mt-1 block">€{o.amount.toFixed(2)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Interactive Workflow Details */}
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between">
                  <div className="border-b border-slate-50 pb-2 flex justify-between items-center">
                    <h3 className="font-black text-slate-800 text-xs uppercase tracking-wider">Detalhes e Fluxo de Estado</h3>
                    {selectedOrder && (
                      <span className="text-[10px] font-mono font-black text-slate-400 bg-slate-50 px-2 py-0.5 rounded-lg">{selectedOrder.type.toUpperCase()}</span>
                    )}
                  </div>
                  
                  {selectedOrder ? (
                    <div className="space-y-4 py-2 flex-1 flex flex-col justify-between">
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-100 rounded-2xl">
                          <img src={selectedOrder.productImage} alt={selectedOrder.productName} className="w-12 h-12 rounded-xl object-cover" />
                          <div className="min-w-0">
                            <h4 className="font-black text-slate-800 text-sm truncate">{selectedOrder.productName}</h4>
                            <p className="text-[10px] text-slate-550 font-bold">{selectedOrder.customerName} • {selectedOrder.customerPhone}</p>
                          </div>
                        </div>

                        {/* Order status tracking pipeline wizard */}
                        <div>
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Linha de Processamento</p>
                          <div className="grid grid-cols-6 gap-1 text-[9px] font-black text-center text-slate-400">
                            {[
                              { label: 'Nova', status: 'Nova Reserva' },
                              { label: 'Confirmada', status: 'Confirmada' },
                              { label: 'Preparação', status: 'Em Preparação' },
                              { label: 'Pronta', status: 'Pronta para Levantar' },
                              { label: 'Levantada', status: 'Levantada' },
                              { label: 'Cancelada', status: 'Cancelada' }
                            ].map((step, idx) => {
                              const isActive = selectedOrder.status === step.status;
                              return (
                                <button 
                                  key={idx}
                                  onClick={() => handleUpdateOrderStatus(selectedOrder.id, step.status as any)}
                                  className={`p-1 rounded-lg border transition-all ${
                                    isActive 
                                      ? 'bg-blue-600 border-transparent text-white shadow-md' 
                                      : 'bg-slate-50 border-slate-100 text-slate-500 hover:bg-slate-100'
                                  }`}
                                >
                                  {step.label}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 mt-4">
                        <button 
                          onClick={() => handleUpdateOrderStatus(selectedOrder.id, 'Cancelada')}
                          className="py-3 bg-red-50 hover:bg-red-100 text-red-700 rounded-xl font-black text-[10px] uppercase text-center"
                        >
                          Cancelar Pedido
                        </button>
                        <button 
                          onClick={() => {
                            let nextStatus: OrderOrReservation['status'] = 'Confirmada';
                            if (selectedOrder.status === 'Nova Reserva') nextStatus = 'Confirmada';
                            else if (selectedOrder.status === 'Confirmada') nextStatus = 'Em Preparação';
                            else if (selectedOrder.status === 'Em Preparação') nextStatus = 'Pronta para Levantar';
                            else if (selectedOrder.status === 'Pronta para Levantar') nextStatus = 'Levantada';
                            
                            handleUpdateOrderStatus(selectedOrder.id, nextStatus);
                          }}
                          disabled={selectedOrder.status === 'Levantada' || selectedOrder.status === 'Cancelada'}
                          className="py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl font-black text-[10px] uppercase text-center flex items-center justify-center gap-1"
                        >
                          Avançar Estado <ArrowRight size={10} />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="py-12 text-center text-slate-400 text-xs italic flex-1 flex items-center justify-center">
                      Selecione uma encomenda na lista para alterar o seu estado no fluxo de vendas.
                    </div>
                  )}
                </div>

              </div>

            </div>
          )}

          {/* ───────────────── PRODUCTS TAB ───────────────── */}
          {activeTab === 'produtos' && (
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6 animate-in fade-in duration-300">
              <div className="flex justify-between items-center border-b border-slate-50 pb-4">
                <div>
                  <h3 className="font-black text-slate-800 text-lg uppercase tracking-tight">Catálogo de Produtos</h3>
                  <p className="text-slate-400 text-xs font-semibold">Gerencie estoque, preços de promoção, SKU e status dos itens na aplicação Azores toYou.</p>
                </div>
                <button 
                  onClick={() => { setProductForm({ id: '', name: '', category: 'Gastronomia', description: '', price: 0, vat: 18, stock: 10, status: 'active', showInApp: true, allowReservation: true, allowPurchase: true, allowStorePickup: true }); setIsEditingProduct(false); setShowProductModal(true); }}
                  className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-black uppercase flex items-center gap-1.5"
                >
                  <Plus size={14} /> Novo Produto
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase text-[9px] tracking-widest">
                      <th className="pb-3">Produto</th>
                      <th className="pb-3">SKU</th>
                      <th className="pb-3">Preço</th>
                      <th className="pb-3">Promoção</th>
                      <th className="pb-3">Stock</th>
                      <th className="pb-3">Status</th>
                      <th className="pb-3">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map(p => (
                      <tr key={p.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                        <td className="py-4 flex items-center gap-3">
                          <img src={p.image} alt={p.name} className="w-10 h-10 rounded-xl object-cover border border-slate-100" />
                          <div className="min-w-0">
                            <h4 className="font-black text-slate-800 text-xs truncate max-w-[200px]">{p.name}</h4>
                            <p className="text-[10px] text-slate-400 font-semibold">{p.category}</p>
                          </div>
                        </td>
                        <td className="py-4 font-mono font-bold text-slate-500">{p.sku}</td>
                        <td className="py-4 font-black text-slate-750">€{p.price.toFixed(2)}</td>
                        <td className="py-4">
                          {p.promoPrice ? (
                            <span className="font-black text-emerald-600">€{p.promoPrice.toFixed(2)}</span>
                          ) : (
                            <span className="text-slate-400">-</span>
                          )}
                        </td>
                        <td className="py-4">
                          <span className={`font-black ${p.stock <= 5 ? 'text-rose-600 font-black animate-pulse' : 'text-slate-750'}`}>
                            {p.stock} un.
                          </span>
                        </td>
                        <td className="py-4">
                          <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider ${
                            p.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'
                          }`}>
                            {p.status === 'active' ? 'Ativo' : 'Rascunho'}
                          </span>
                        </td>
                        <td className="py-4">
                          <div className="flex gap-2">
                            <button 
                              onClick={() => { setProductForm(p); setIsEditingProduct(true); setShowProductModal(true); }}
                              className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg"
                            >
                              <Edit3 size={12} />
                            </button>
                            <button 
                              onClick={() => {
                                if (confirm('Tem a certeza que deseja eliminar este produto?')) {
                                  setProducts(prev => prev.filter(prod => prod.id !== p.id));
                                }
                              }}
                              className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ───────────────── ORDERS & RESERVATIONS TAB ───────────────── */}
          {activeTab === 'encomendas' && (
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6 animate-in fade-in duration-300">
              <div className="border-b border-slate-50 pb-4">
                <h3 className="font-black text-slate-800 text-lg uppercase tracking-tight">Encomendas e Reservas</h3>
                <p className="text-slate-400 text-xs font-semibold">Gerencie os pedidos dos clientes desde a receção até à entrega física ao balcão.</p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase text-[9px] tracking-widest">
                      <th className="pb-3">ID</th>
                      <th className="pb-3">Cliente</th>
                      <th className="pb-3">Produto</th>
                      <th className="pb-3">Tipo</th>
                      <th className="pb-3">Valor</th>
                      <th className="pb-3">Estado no Fluxo</th>
                      <th className="pb-3">Ações rápidas</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map(o => (
                      <tr key={o.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                        <td className="py-4 font-mono font-bold text-slate-500">{o.id}</td>
                        <td className="py-4">
                          <h4 className="font-black text-slate-800">{o.customerName}</h4>
                          <p className="text-[10px] text-slate-450 font-semibold">{o.customerPhone}</p>
                        </td>
                        <td className="py-4 flex items-center gap-3">
                          <img src={o.productImage} alt={o.productName} className="w-8 h-8 rounded-lg object-cover" />
                          <span className="font-semibold text-slate-700 truncate max-w-[180px]">{o.productName}</span>
                        </td>
                        <td className="py-4">
                          <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase ${
                            o.type === 'order' ? 'bg-indigo-50 text-indigo-600' : 'bg-amber-50 text-amber-600'
                          }`}>
                            {o.type === 'order' ? 'Compra' : 'Reserva'}
                          </span>
                        </td>
                        <td className="py-4 font-black text-slate-750">€{o.amount.toFixed(2)}</td>
                        <td className="py-4">
                          <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider ${
                            o.status === 'Nova Reserva' ? 'bg-blue-100 text-blue-700' :
                            o.status === 'Confirmada' ? 'bg-purple-100 text-purple-700' :
                            o.status === 'Em Preparação' ? 'bg-amber-100 text-amber-700' :
                            o.status === 'Pronta para Levantar' ? 'bg-emerald-100 text-emerald-700' :
                            o.status === 'Levantada' ? 'bg-slate-200 text-slate-700' : 'bg-red-100 text-red-700'
                          }`}>
                            {o.status}
                          </span>
                        </td>
                        <td className="py-4">
                          <select 
                            value={o.status}
                            onChange={(e) => handleUpdateOrderStatus(o.id, e.target.value as any)}
                            className="bg-slate-50 border border-slate-200 p-1.5 rounded-lg font-bold text-xs"
                          >
                            <option value="Nova Reserva">Nova Reserva</option>
                            <option value="Confirmada">Confirmada</option>
                            <option value="Em Preparação">Em Preparação</option>
                            <option value="Pronta para Levantar">Pronta para Levantar</option>
                            <option value="Levantada">Levantada</option>
                            <option value="Cancelada">Cancelada</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ───────────────── PROMOTIONS TAB ───────────────── */}
          {activeTab === 'promocoes' && (
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6 animate-in fade-in duration-300">
              <div className="flex justify-between items-center border-b border-slate-50 pb-4">
                <div>
                  <h3 className="font-black text-slate-800 text-lg uppercase tracking-tight">Campanhas e Promoções</h3>
                  <p className="text-slate-400 text-xs font-semibold">Defina preços promocionais com agendamento automático na aplicação de compras Azores toYou.</p>
                </div>
                <button 
                  onClick={() => { setPromoForm({ productId: products[0]?.id || '', promoPrice: 0, promoStart: '', promoEnd: '' }); setShowPromoModal(true); }}
                  className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-black uppercase flex items-center gap-1.5"
                >
                  <Percent size={14} /> Nova Promoção
                </button>
              </div>

              <div className="grid grid-cols-3 gap-6">
                {products.filter(p => p.promoPrice).map(p => (
                  <div key={p.id} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex flex-col justify-between space-y-4">
                    <div className="flex items-center gap-3">
                      <img src={p.image} alt={p.name} className="w-12 h-12 rounded-xl object-cover" />
                      <div className="min-w-0">
                        <h4 className="font-black text-slate-800 text-xs truncate">{p.name}</h4>
                        <p className="text-[10px] text-slate-400 font-semibold">{p.category} • SKU: {p.sku}</p>
                      </div>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-white border border-slate-100 rounded-xl text-xs">
                      <div>
                        <p className="text-[9px] font-bold text-slate-400 uppercase">Preço Base</p>
                        <p className="font-bold text-slate-500 line-through">€{p.price.toFixed(2)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[9px] font-bold text-emerald-600 uppercase">Promoção</p>
                        <p className="font-black text-emerald-600 text-sm">€{p.promoPrice?.toFixed(2)}</p>
                      </div>
                    </div>
                    <div className="text-[10px] text-slate-400 font-bold space-y-1">
                      <p>Início: {p.promoStart}</p>
                      <p>Fim: {p.promoEnd}</p>
                    </div>
                    <button 
                      onClick={() => {
                        setProducts(prev => prev.map(prod => {
                          if (prod.id === p.id) {
                            return { ...prod, promoPrice: undefined, promoStart: undefined, promoEnd: undefined };
                          }
                          return prod;
                        }));
                      }}
                      className="w-full py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl text-[10px] font-black uppercase"
                    >
                      Remover Campanha
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ───────────────── OTHER TABS FALLBACK ───────────────── */}
          {!['dashboard', 'produtos', 'encomendas', 'promocoes'].includes(activeTab) && (
            <div className="bg-white p-12 rounded-3xl border border-slate-100 shadow-sm text-center animate-in fade-in duration-300">
              <p className="text-slate-400 text-sm italic">Painel de {activeTab} em modo de visualização rápida. Utilize o menu central para navegar entre o catálogo e encomendas.</p>
            </div>
          )}

        </main>
      </div>

      {/* ───────────────── PRODUCT MODAL (Add / Edit) ───────────────── */}
      <AnimatePresence>
        {showProductModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white w-full max-w-xl rounded-[2.5rem] border border-slate-100 shadow-2xl p-8 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center border-b border-slate-50 pb-3 mb-4">
                <h3 className="font-black text-slate-800 text-base uppercase">{isEditingProduct ? 'Editar Produto' : 'Adicionar Novo Produto'}</h3>
                <button onClick={() => setShowProductModal(false)} className="text-slate-400 hover:text-slate-600"><X size={18} /></button>
              </div>

              <form onSubmit={handleSaveProduct} className="space-y-4 text-xs font-semibold">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase">Nome do Produto</label>
                    <input 
                      type="text" 
                      required 
                      value={productForm.name || ''}
                      onChange={e => setProductForm({...productForm, name: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:outline-none focus:border-blue-500" 
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase">Categoria</label>
                    <select 
                      value={productForm.category || 'Gastronomia'}
                      onChange={e => setProductForm({...productForm, category: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl"
                    >
                      <option value="Gastronomia">Gastronomia</option>
                      <option value="Artesanato">Artesanato</option>
                      <option value="Mercearia">Mercearia</option>
                      <option value="Vestuário">Vestuário</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase">Descrição</label>
                  <textarea 
                    rows={2} 
                    value={productForm.description || ''}
                    onChange={e => setProductForm({...productForm, description: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase">Preço Base (€)</label>
                    <input 
                      type="number" 
                      step="0.01" 
                      required 
                      value={productForm.price || 0}
                      onChange={e => setProductForm({...productForm, price: parseFloat(e.target.value) || 0})}
                      className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl" 
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase">Preço Promo (€)</label>
                    <input 
                      type="number" 
                      step="0.01" 
                      value={productForm.promoPrice || ''}
                      onChange={e => setProductForm({...productForm, promoPrice: e.target.value ? parseFloat(e.target.value) : undefined})}
                      className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl" 
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase">Quantidade Stock</label>
                    <input 
                      type="number" 
                      required 
                      value={productForm.stock || 0}
                      onChange={e => setProductForm({...productForm, stock: parseInt(e.target.value, 10) || 0})}
                      className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase">Código SKU</label>
                    <input 
                      type="text" 
                      required 
                      value={productForm.sku || ''}
                      onChange={e => setProductForm({...productForm, sku: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl" 
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase">Código de Barras</label>
                    <input 
                      type="text" 
                      value={productForm.barcode || ''}
                      onChange={e => setProductForm({...productForm, barcode: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="flex items-center gap-2">
                    <input 
                      type="checkbox" 
                      id="showInApp"
                      checked={productForm.showInApp}
                      onChange={e => setProductForm({...productForm, showInApp: e.target.checked})}
                      className="w-4 h-4 text-blue-600 border-slate-300 rounded" 
                    />
                    <label htmlFor="showInApp" className="text-[11px] text-slate-700">Mostrar na App</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input 
                      type="checkbox" 
                      id="allowReservation"
                      checked={productForm.allowReservation}
                      onChange={e => setProductForm({...productForm, allowReservation: e.target.checked})}
                      className="w-4 h-4 text-blue-600 border-slate-300 rounded" 
                    />
                    <label htmlFor="allowReservation" className="text-[11px] text-slate-700">Permitir Reservas</label>
                  </div>
                </div>

                <button 
                  type="submit" 
                  className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-black uppercase tracking-wider mt-6"
                >
                  Guardar Produto
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ───────────────── PROMOTION FORM MODAL ───────────────── */}
      <AnimatePresence>
        {showPromoModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white w-full max-w-md rounded-[2.5rem] border border-slate-100 shadow-2xl p-8"
            >
              <div className="flex justify-between items-center border-b border-slate-50 pb-3 mb-4">
                <h3 className="font-black text-slate-800 text-base uppercase">Ativar Campanha</h3>
                <button onClick={() => setShowPromoModal(false)} className="text-slate-400 hover:text-slate-600"><X size={18} /></button>
              </div>

              <form onSubmit={handleCreatePromo} className="space-y-4 text-xs font-semibold">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase">Escolher Produto</label>
                  <select 
                    value={promoForm.productId}
                    onChange={e => setPromoForm({...promoForm, productId: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl"
                  >
                    <option value="">Selecione...</option>
                    {products.map(p => (
                      <option key={p.id} value={p.id}>{p.name} (€{p.price.toFixed(2)})</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase">Preço da Promoção (€)</label>
                  <input 
                    type="number" 
                    step="0.01" 
                    required
                    value={promoForm.promoPrice || ''}
                    onChange={e => setPromoForm({...promoForm, promoPrice: parseFloat(e.target.value) || 0})}
                    className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl" 
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase">Data de Início</label>
                    <input 
                      type="date" 
                      value={promoForm.promoStart}
                      onChange={e => setPromoForm({...promoForm, promoStart: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl" 
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase">Data de Fim</label>
                    <input 
                      type="date" 
                      value={promoForm.promoEnd}
                      onChange={e => setPromoForm({...promoForm, promoEnd: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl" 
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black uppercase tracking-wider mt-6"
                >
                  Lançar Campanha
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
