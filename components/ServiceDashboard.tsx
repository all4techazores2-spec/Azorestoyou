import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, Calendar, Users, Briefcase, FileText, Receipt, 
  Package, Truck, ShoppingCart, Percent, BarChart3, MessageSquare, 
  Settings, Zap, Droplets, Hammer, HardHat, Paintbrush, Leaf, PencilRuler, 
  DraftingCompass, ThermometerSnowflake, ShieldCheck, Play, CheckCircle, 
  Phone, Mail, MapPin, ExternalLink, ArrowRight, Plus, Trash2, Shield,
  Search, Download, Send, Check, PhoneCall, Copy, CreditCard, Sparkles, X, Edit3, Image
} from 'lucide-react';
import { Business, Language } from '../types';

interface ServiceDashboardProps {
  business: Business;
  language: Language;
  onLogout: () => void;
  onUpdateBusiness: (updated: Business) => void;
}

export const ServiceDashboard: React.FC<ServiceDashboardProps> = ({
  business,
  language = 'pt',
  onLogout,
  onUpdateBusiness
}) => {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [showAiAssistant, setShowAiAssistant] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiChat, setAiChat] = useState<Array<{ sender: 'user' | 'ai'; text: string }>>([
    { sender: 'ai', text: 'Olá! Sou o Azores AI. Como posso ajudar com a gestão da sua atividade hoje? Posso criar orçamentos, agendar trabalhos ou consultar o inventário.' }
  ]);

  // Mock database states initialized with business values or defaults
  const [materials, setMaterials] = useState([
    { id: 'MAT001', code: 'CAB-RJ45', name: 'Cabo de Rede Cat6', price: 1.5, quantity: 120, stock: 120, minStock: 20, supplier: 'Telectra Açores', iva: 18 },
    { id: 'MAT002', code: 'DISJ-16A', name: 'Disjuntor Monofásico 16A', price: 8.9, quantity: 15, stock: 15, minStock: 10, supplier: 'EletroMercado', iva: 18 },
    { id: 'MAT003', code: 'TOM-DUP', name: 'Tomada Elétrica Dupla', price: 4.2, quantity: 5, stock: 5, minStock: 15, supplier: 'EletroMercado', iva: 18 },
    { id: 'MAT004', code: 'FITA-ISOL', name: 'Fita Isoladora 3M', price: 2.1, quantity: 3, stock: 3, minStock: 5, supplier: 'Açores Materiais', iva: 18 }
  ]);

  const [clients, setClients] = useState([
    { id: 'CLI001', name: 'João Fernandes', phone: '+351 961 234 567', email: 'joao.fernandes@mail.pt', address: 'Rua do Paim, 25, Ponta Delgada', nif: '241852963', history: 'Instalação elétrica da moradia efetuada em Maio de 2026.' },
    { id: 'CLI002', name: 'Maria Sousa', phone: '+351 964 852 741', email: 'maria.sousa@sapo.pt', address: 'Rua Direita, 82, Ribeira Grande', nif: '215364897', history: 'Reparação de quadro elétrico.' },
    { id: 'CLI003', name: 'Carlos Medeiros', phone: '+351 925 369 147', email: 'carlos.med@gmail.com', address: 'Largo da Matriz, Vila Franca do Campo', nif: '198256341', history: 'Manutenção de disjuntores e tomadas.' }
  ]);

  const [jobs, setJobs] = useState([
    { id: 'JOB001', time: '09:00', clientName: 'João Fernandes', service: 'Instalação elétrica', status: 'Em curso', address: 'Rua do Paim, 25, Ponta Delgada', phone: '+351 961 234 567', warranty: '2 anos', date: new Date().toISOString().split('T')[0] },
    { id: 'JOB002', time: '11:30', clientName: 'Maria Sousa', service: 'Reparação de quadro', status: 'Confirmado', address: 'Rua Direita, 82, Ribeira Grande', phone: '+351 964 852 741', warranty: '1 ano', date: new Date().toISOString().split('T')[0] },
    { id: 'JOB003', time: '14:30', clientName: 'Hotel Verde Mar', service: 'Instalação de tomadas', status: 'Em curso', address: 'Avenida Marginal, Ribeira Grande', phone: '+351 296 500 600', warranty: '2 anos', date: new Date().toISOString().split('T')[0] },
    { id: 'JOB004', time: '16:00', clientName: 'Carlos Medeiros', service: 'Manutenção geral', status: 'Pendente', address: 'Largo da Matriz, Vila Franca do Campo', phone: '+351 925 369 147', warranty: '6 meses', date: new Date().toISOString().split('T')[0] }
  ]);

  const [warranties, setWarranties] = useState([
    { id: 'WAR001', clientName: 'João Fernandes', service: 'Instalação elétrica completa', duration: '2 anos', status: 'Ativa', expiry: '2028-05-20' },
    { id: 'WAR002', clientName: 'Carlos Medeiros', service: 'Tomadas Exteriores', duration: '30 dias', status: 'A expirar', expiry: '2026-07-10' },
    { id: 'WAR003', clientName: 'Maria Antónia', service: 'Reparação Disjuntor', duration: '6 meses', status: 'Expirada', expiry: '2026-05-15' }
  ]);

  const [quotes, setQuotes] = useState([
    { id: 'ORC001', clientName: 'Ana Rodrigues', service: 'Substituição de Fiação', value: 450, status: 'Pendente', date: '2026-06-25' },
    { id: 'ORC002', clientName: 'José Correia', service: 'Instalação Smart Home', value: 1200, status: 'Aceite', date: '2026-06-24' }
  ]);

  const [invoices, setInvoices] = useState([
    { id: 'FT001', clientName: 'Maria Sousa', value: 85, status: 'Paga', date: '2026-06-26', method: 'MBWay' },
    { id: 'FT002', clientName: 'João Fernandes', value: 765, status: 'Paga', date: '2026-06-26', method: 'Multibanco' }
  ]);

  const [suppliers, setSuppliers] = useState([
    { id: 'SUP001', name: 'EletroMercado', phone: '+351 296 123 456', email: 'geral@eletromercado.pt', nif: '512345678', address: 'Parque Industrial de Ponta Delgada' },
    { id: 'SUP002', name: 'Telectra Açores', phone: '+351 296 987 654', email: 'vendas@telectra.pt', nif: '509876543', address: 'Rua do Cabral, Ponta Delgada' },
    { id: 'SUP003', name: 'Açores Materiais', phone: '+351 295 444 333', email: 'contacto@acoresmateriais.pt', nif: '501112223', address: 'Caminho Novo, Angra do Heroísmo' }
  ]);

  // Selected job for next-job actions / workflow modals
  const [selectedJobIndex, setSelectedJobIndex] = useState<number>(0);
  const [isWorkflowModalOpen, setIsWorkflowModalOpen] = useState(false);
  const [workflowStep, setWorkflowStep] = useState<'photos' | 'materials' | 'signature' | 'invoice' | 'payment' | 'done'>('photos');

  // New item form states
  const [showAddClientModal, setShowAddClientModal] = useState(false);
  const [newClient, setNewClient] = useState({ name: '', phone: '', email: '', address: '', nif: '', history: '' });
  const [showAddMaterialModal, setShowAddMaterialModal] = useState(false);
  const [newMaterial, setNewMaterial] = useState({ code: '', name: '', price: 0, stock: 0, minStock: 0, supplier: 'EletroMercado', iva: 18 });
  const [showAddJobModal, setShowAddJobModal] = useState(false);
  const [newJob, setNewJob] = useState({ clientName: '', service: '', time: '09:00', address: '', phone: '', warranty: '1 ano' });
  const [showCreateQuoteModal, setShowCreateQuoteModal] = useState(false);
  const [newQuote, setNewQuote] = useState({ clientName: '', service: '', value: 0 });

  // Workflow states
  const [jobPhotos, setJobPhotos] = useState<{ antes: string[]; durante: string[]; depois: string[] }>({
    antes: ['https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=400'],
    durante: ['https://images.unsplash.com/photo-1621905252507-b354bc25edac?auto=format&fit=crop&q=80&w=400'],
    depois: ['https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?auto=format&fit=crop&q=80&w=400']
  });
  const [usedMaterials, setUsedMaterials] = useState<Array<{ id: string; name: string; price: number; quantity: number }>>([]);
  const [selectedMaterialId, setSelectedMaterialId] = useState('');
  const [selectedMaterialQty, setSelectedMaterialQty] = useState(1);
  const [sigPoints, setSigPoints] = useState<any[]>([]);
  const [sigSigned, setSigSigned] = useState(false);
  const [billingMethod, setBillingMethod] = useState<'MBWay' | 'Multibanco' | 'Dinheiro' | 'Transferência'>('MBWay');
  const [paymentPhone, setPaymentPhone] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Dynamic values configured according to category (Silva Eletricidade default)
  const isElectrician = business.subcategory?.toLowerCase().includes('electric') || business.subcategory?.toLowerCase().includes('eletri');
  const isPlumber = business.subcategory?.toLowerCase().includes('plumb') || business.subcategory?.toLowerCase().includes('canali');
  const isCarpenter = business.subcategory?.toLowerCase().includes('carpen') || business.subcategory?.toLowerCase().includes('carpin');
  
  const getBannerImage = () => {
    if (isElectrician) return 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=800';
    if (isPlumber) return 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=800';
    if (isCarpenter) return 'https://images.unsplash.com/photo-1534224039826-c7a0dea0e66a?auto=format&fit=crop&q=80&w=800';
    return 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=800'; // Default tools image
  };

  const getBannerIcon = () => {
    if (isElectrician) return <Zap className="text-yellow-500 w-8 h-8" />;
    if (isPlumber) return <Droplets className="text-blue-500 w-8 h-8" />;
    if (isCarpenter) return <Hammer className="text-amber-700 w-8 h-8" />;
    return <Zap className="text-yellow-500 w-8 h-8" />;
  };

  const activeJob = jobs[selectedJobIndex] || null;

  const startJob = (id: string) => {
    setJobs(prev => prev.map(j => j.id === id ? { ...j, status: 'Em curso' } : j));
  };

  const handleStartWorkflow = () => {
    if (!activeJob) return;
    startJob(activeJob.id);
    setUsedMaterials([]);
    setSigPoints([]);
    setSigSigned(false);
    setPaymentSuccess(false);
    setWorkflowStep('photos');
    setIsWorkflowModalOpen(true);
  };

  const addUsedMaterial = () => {
    const mat = materials.find(m => m.id === selectedMaterialId);
    if (!mat) return;
    if (mat.stock !== undefined && mat.stock < selectedMaterialQty) {
      alert('Quantidade superior ao stock disponível!');
      return;
    }
    const existing = usedMaterials.find(um => um.id === mat.id);
    if (existing) {
      setUsedMaterials(prev => prev.map(um => um.id === mat.id ? { ...um, quantity: um.quantity + selectedMaterialQty } : um));
    } else {
      setUsedMaterials(prev => [...prev, { id: mat.id, name: mat.name, price: mat.price, quantity: selectedMaterialQty }]);
    }
    
    // Auto deduct material stock
    setMaterials(prev => prev.map(m => m.id === mat.id ? { ...m, stock: (m.stock || 0) - selectedMaterialQty } : m));
    setSelectedMaterialQty(1);
  };

  const removeUsedMaterial = (id: string, qty: number) => {
    setUsedMaterials(prev => prev.filter(um => um.id !== id));
    setMaterials(prev => prev.map(m => m.id === id ? { ...m, stock: (m.stock || 0) + qty } : m));
  };

  const getWorkflowTotal = () => {
    const servicePrice = 65; // Flat call out / service fee
    const materialsPrice = usedMaterials.reduce((acc, curr) => acc + (curr.price * curr.quantity), 0);
    return servicePrice + materialsPrice;
  };

  const confirmWorkflowPayment = () => {
    setPaymentSuccess(true);
    // Add to simulated invoices
    const newFT = {
      id: `FT${String(invoices.length + 1).padStart(3, '0')}`,
      clientName: activeJob?.clientName || 'Cliente Particular',
      value: getWorkflowTotal(),
      status: 'Paga',
      date: new Date().toISOString().split('T')[0],
      method: billingMethod
    };
    setInvoices(prev => [newFT, ...prev]);
    // Complete the Job
    if (activeJob) {
      setJobs(prev => prev.map(j => j.id === activeJob.id ? { ...j, status: 'Concluído' } : j));
      
      // Register Warranty
      const newWarranty = {
        id: `WAR${String(warranties.length + 1).padStart(3, '0')}`,
        clientName: activeJob.clientName,
        service: activeJob.service,
        duration: activeJob.warranty,
        status: 'Ativa',
        expiry: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // default 1y
      };
      setWarranties(prev => [newWarranty, ...prev]);
    }
    setWorkflowStep('done');
  };

  const handleAiSend = () => {
    if (!aiPrompt.trim()) return;
    const userMsg = aiPrompt.trim();
    setAiChat(prev => [...prev, { sender: 'user', text: userMsg }]);
    setAiPrompt('');

    setTimeout(() => {
      let reply = 'Não entendi bem o pedido. Experimente algo como: "Cria um orçamento", "Agenda um trabalho" ou "Quantos materiais temos em stock?".';
      const promptLower = userMsg.toLowerCase();
      
      if (promptLower.includes('orçamento')) {
        reply = 'Com certeza. Posso abrir o assistente de orçamento rápido. Por favor, introduza o nome do cliente e o valor.';
        setShowCreateQuoteModal(true);
      } else if (promptLower.includes('trabalho') || promptLower.includes('agenda')) {
        reply = 'Muito bem. Abri o assistente de agendamento de novo serviço. Por favor, insira as especificações do trabalho de hoje.';
        setShowAddJobModal(true);
      } else if (promptLower.includes('fature') || promptLower.includes('lucro') || promptLower.includes('financeiro')) {
        reply = `Hoje faturou €850 com base nos seus trabalhos agendados. O seu acumulado de receitas totaliza €5.320 este mês.`;
      } else if (promptLower.includes('material') || promptLower.includes('stock') || promptLower.includes('inventário')) {
        const lowStock = materials.filter(m => (m.stock || 0) <= (m.minStock || 10));
        reply = `Temos ${lowStock.length} materiais com stock em alerta baixo: ${lowStock.map(l => `${l.name} (${l.stock} un)`).join(', ')}.`;
      }

      setAiChat(prev => [...prev, { sender: 'ai', text: reply }]);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans antialiased text-slate-800">
      
      {/* ── SIDEBAR ── */}
      <aside className="w-80 bg-slate-900 text-white flex flex-col fixed h-full z-30 border-r border-white/5 shadow-2xl">
        {/* Logo Section */}
        <div className="p-6 border-b border-white/5 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-emerald-500 flex items-center justify-center shadow-lg">
            <span className="font-black text-white text-base">AZ</span>
          </div>
          <div>
            <h2 className="text-sm font-black uppercase tracking-widest text-white leading-none">Azores toYou</h2>
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Parceiro Oficial</span>
          </div>
        </div>

        {/* Business Badge */}
        <div className="m-4 p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3 relative overflow-hidden group">
          <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-800 flex-shrink-0 flex items-center justify-center">
            {business.image ? (
              <img src={business.image} alt={business.name} className="w-full h-full object-cover" />
            ) : (
              getBannerIcon()
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-black uppercase tracking-tight text-white truncate">{business.name}</h4>
            <p className="text-[10px] font-bold text-slate-400 capitalize">{business.subcategory || 'Prestador de Serviços'}</p>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[9px] font-black uppercase tracking-widest text-emerald-400">Azores toYou Online</span>
            </div>
          </div>
        </div>

        {/* Menus */}
        <nav className="flex-1 px-4 py-2 space-y-1 overflow-y-auto scrollbar-hide">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
            { id: 'agenda', label: 'Agenda', icon: <Calendar size={18} /> },
            { id: 'clientes', label: 'Clientes', icon: <Users size={18} /> },
            { id: 'trabalhos', label: 'Trabalhos', icon: <Briefcase size={18} /> },
            { id: 'orçamentos', label: 'Orçamentos', icon: <FileText size={18} /> },
            { id: 'faturas', label: 'Faturas', icon: <Receipt size={18} /> },
            { id: 'materiais', label: 'Materiais', icon: <Package size={18} /> },
            { id: 'fornecedores', label: 'Fornecedores', icon: <Truck size={18} /> },
            { id: 'pos', label: 'POS Vendas', icon: <ShoppingCart size={18} /> },
            { id: 'comissao', label: 'Comissão Azores toYou', icon: <Percent size={18} /> },
            { id: 'relatorios', label: 'Relatórios', icon: <BarChart3 size={18} /> },
            { id: 'garantias', label: 'Garantias', icon: <ShieldCheck size={18} /> },
            { id: 'mensagens', label: 'Mensagens', icon: <MessageSquare size={18} /> },
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

        {/* Motivational Card */}
        <div className="p-4 mx-4 mb-2 bg-gradient-to-br from-blue-950 to-emerald-950 rounded-2xl border border-blue-500/20 text-center">
          <p className="text-[10px] font-black uppercase tracking-wider text-emerald-400">Card Motivacional</p>
          <p className="text-[11px] font-bold text-white/95 mt-1 leading-relaxed">
            "Juntos fazemos a economia dos Açores crescer."
          </p>
        </div>

        {/* Footer profile */}
        <div className="p-4 border-t border-white/5 flex items-center justify-between bg-slate-950">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl overflow-hidden border border-white/10">
              <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150" alt="Mariana Silva" className="w-full h-full object-cover" />
            </div>
            <div>
              <h5 className="text-xs font-black text-white">Mariana Silva</h5>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Proprietária</p>
            </div>
          </div>
          <button 
            onClick={onLogout}
            className="p-2 bg-white/5 hover:bg-red-500/10 hover:text-red-400 rounded-xl transition-all"
            title="Sair"
          >
            <X size={16} />
          </button>
        </div>
      </aside>

      {/* ── MAIN CONTENT CONTAINER ── */}
      <main className="flex-1 pl-80 min-h-screen bg-slate-50 relative">
        
        {/* Header bar */}
        <header className="px-8 py-5 bg-white border-b border-slate-100 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <button className="md:hidden p-2 bg-slate-100 rounded-xl text-slate-600">
              <LayoutDashboard size={20} />
            </button>
            <h1 className="text-lg font-black text-slate-800 uppercase tracking-tighter capitalize">
              {activeTab === 'dashboard' ? 'Painel do Parceiro' : activeTab}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden lg:flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[9px] font-black uppercase text-slate-600 tracking-wider">Azores toYou Ligado</span>
            </div>
            <button className="p-2.5 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-xl border border-slate-100 relative">
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-blue-600 rounded-full border-2 border-white animate-ping" />
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-blue-600 rounded-full border-2 border-white" />
              <Zap size={16} />
            </button>
          </div>
        </header>

        {/* Content body */}
        <div className="p-8 space-y-8 max-w-7xl mx-auto">

          {/* ───────────────── DASHBOARD TAB ───────────────── */}
          {activeTab === 'dashboard' && (
            <div className="space-y-8 animate-in fade-in duration-500">
              
              {/* Top Greeting & Weather Widget Banner */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Greeting Card */}
                <div className="lg:col-span-2 bg-white rounded-3xl p-8 border border-slate-100 shadow-sm flex flex-col justify-between relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
                  <div className="relative z-10 space-y-2">
                    <h2 className="text-3xl font-black text-slate-800 tracking-tight">Bom dia, João! 👋</h2>
                    <p className="text-slate-400 text-sm font-semibold">Aqui está o resumo do seu negócio hoje. Desejamos-lhe um excelente dia de trabalho.</p>
                  </div>
                  
                  {/* KPI Quick Indicators */}
                  <div className="grid grid-cols-4 gap-4 mt-8 relative z-10">
                    {[
                      { label: 'Trabalhos hoje', value: '6', icon: <Briefcase className="text-blue-600" />, bg: 'bg-blue-50' },
                      { label: 'Orçamentos pendentes', value: '2', icon: <FileText className="text-amber-500" />, bg: 'bg-amber-50' },
                      { label: 'Faturados hoje', value: '€850', icon: <Receipt className="text-emerald-500" />, bg: 'bg-emerald-50' },
                      { label: 'Avaliação média', value: '4.9', icon: <Sparkles className="text-indigo-500" />, bg: 'bg-indigo-50' },
                    ].map((kpi, idx) => (
                      <div key={idx} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex flex-col justify-between hover:scale-[1.02] transition-transform">
                        <div className={`w-8 h-8 rounded-lg ${kpi.bg} flex items-center justify-center`}>
                          {kpi.icon}
                        </div>
                        <div className="mt-4">
                          <h4 className="text-xl font-black text-slate-800 leading-none">{kpi.value}</h4>
                          <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider mt-1">{kpi.label}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Weather & Service Custom Image Widget */}
                <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 rounded-3xl p-6 text-white border border-white/5 relative overflow-hidden flex flex-col justify-between shadow-xl">
                  <div className="absolute inset-0 opacity-40 mix-blend-overlay">
                    <img src={getBannerImage()} alt="Work Area" className="w-full h-full object-cover" />
                  </div>
                  <div className="relative z-10 flex justify-between items-start">
                    <div>
                      <h4 className="text-2xl font-black">18°C</h4>
                      <p className="text-xs font-bold text-white/70">Céu pouco nublado</p>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/10">
                      {getBannerIcon()}
                    </div>
                  </div>
                  
                  <div className="relative z-10 mt-12">
                    <p className="text-[10px] font-black uppercase tracking-widest text-emerald-400 flex items-center gap-1.5">
                      <MapPin size={10} /> Ponta Delgada, São Miguel
                    </p>
                    <p className="text-[11px] font-bold text-white/50 mt-1">Hoje: {new Date().toLocaleDateString('pt-PT', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
                  </div>
                </div>
              </div>

              {/* Central Grid: POS Button & Quick Actions */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
                
                {/* Left Columns: Menu Quick Widgets */}
                <div className="lg:col-span-2 grid grid-cols-2 gap-4">
                  {[
                    { id: 'agenda', title: 'Agenda', desc: 'Ver e gerir compromissos', stat: '6 trabalhos hoje', icon: <Calendar className="text-blue-600" />, color: 'bg-blue-50' },
                    { id: 'materiais', title: 'Materiais', desc: 'Gerir stock e inventário', stat: '18 itens em stock baixo', icon: <Package className="text-indigo-600" />, color: 'bg-indigo-50' },
                    { id: 'clientes', title: 'Clientes', desc: 'Ver todos os clientes', stat: '324 clientes registados', icon: <Users className="text-emerald-600" />, color: 'bg-emerald-50' },
                    { id: 'fornecedores', title: 'Fornecedores', desc: 'Gerir fornecedores locais', stat: '12 fornecedores ativos', icon: <Truck className="text-slate-600" />, color: 'bg-slate-50' },
                    { id: 'trabalhos', title: 'Trabalhos', desc: 'Gerir serviços adjudicados', stat: '8 em execução', icon: <Briefcase className="text-rose-600" />, color: 'bg-rose-50' },
                    { id: 'relatorios', title: 'Relatórios', desc: 'Estatísticas e contabilidade', stat: 'Ver dados consolidados', icon: <BarChart3 className="text-teal-600" />, color: 'bg-teal-50' },
                    { id: 'orçamentos', title: 'Orçamentos', desc: 'Criar e enviar orçamentos', stat: '2 pendentes de aprovação', icon: <FileText className="text-amber-600" />, color: 'bg-amber-50' },
                    { id: 'comissao', title: 'Comissão Azores toYou', desc: 'Microtaxas aplicadas', stat: '€52,40 faturado este mês', icon: <Percent className="text-violet-600" />, color: 'bg-violet-50' },
                  ].map((widget, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveTab(widget.id)}
                      className="bg-white p-5 rounded-2xl border border-slate-100 hover:border-slate-200 hover:shadow-md transition-all flex items-center justify-between text-left group"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl ${widget.color} flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform`}>
                          {widget.icon}
                        </div>
                        <div>
                          <h4 className="font-black text-slate-800 text-sm uppercase tracking-tight">{widget.title}</h4>
                          <p className="text-[11px] text-slate-400 font-medium">{widget.desc}</p>
                          <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest mt-1 block">{widget.stat}</span>
                        </div>
                      </div>
                      <ArrowRight size={14} className="text-slate-300 group-hover:text-slate-500 group-hover:translate-x-1 transition-all" />
                    </button>
                  ))}
                </div>

                {/* Right Column: Central POS Vendas Circle Button */}
                <div className="flex flex-col items-center justify-center p-6 bg-white rounded-3xl border border-slate-100 shadow-sm h-full">
                  <h3 className="text-xs font-black uppercase text-slate-400 tracking-widest mb-6">Ponto de Venda Rápida</h3>
                  <button
                    onClick={() => setActiveTab('pos')}
                    className="relative w-48 h-48 rounded-full bg-gradient-to-tr from-blue-600 via-blue-500 to-emerald-500 flex flex-col items-center justify-center text-white shadow-xl shadow-blue-500/20 hover:scale-105 active:scale-95 transition-all group overflow-hidden border-8 border-slate-50"
                  >
                    <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity animate-pulse" />
                    {/* Ripple/Glow Circle */}
                    <div className="absolute inset-2 rounded-full border border-white/20 animate-ping opacity-25" />
                    
                    <ShoppingCart size={40} className="mb-2" />
                    <span className="font-black uppercase tracking-widest text-sm">POS VENDAS</span>
                    <span className="text-[9px] font-bold text-white/80 mt-1 uppercase">Abrir Ponto de Venda</span>
                  </button>
                  <p className="text-[10px] font-bold text-slate-400 text-center mt-6 uppercase leading-tight">
                    Faturação imediata ao cliente no local da obra
                  </p>
                </div>
              </div>

              {/* Bottom Row: Today's Jobs & Next Job Map & Financial Summary */}
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                
                {/* Column 1: Trabalhos de Hoje */}
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
                  <div className="flex justify-between items-center border-b border-slate-50 pb-3">
                    <h3 className="font-black text-slate-800 uppercase tracking-tighter flex items-center gap-2">
                      <Briefcase size={16} className="text-blue-600" /> Trabalhos de Hoje
                    </h3>
                    <button onClick={() => setActiveTab('trabalhos')} className="text-[10px] font-black uppercase tracking-wider text-blue-600 hover:underline">Ver Todos</button>
                  </div>
                  
                  <div className="space-y-3">
                    {jobs.map((job, idx) => (
                      <div 
                        key={job.id}
                        onClick={() => setSelectedJobIndex(idx)}
                        className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                          selectedJobIndex === idx 
                            ? 'bg-blue-50/60 border-blue-200' 
                            : 'bg-slate-50 border-slate-100 hover:border-slate-200'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-xs font-black text-slate-400">{job.time}</span>
                          <div>
                            <h4 className="font-black text-slate-800 text-xs truncate max-w-[120px]">{job.clientName}</h4>
                            <p className="text-[10px] text-slate-500 font-semibold">{job.service}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                            job.status === 'Em curso' ? 'bg-amber-100 text-amber-700' :
                            job.status === 'Concluído' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'
                          }`}>
                            {job.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Column 2: Próximo Trabalho / Mapa */}
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between">
                  <div className="flex justify-between items-center border-b border-slate-50 pb-3">
                    <h3 className="font-black text-slate-800 uppercase tracking-tighter flex items-center gap-2">
                      <MapPin size={16} className="text-red-500" /> Próximo Trabalho
                    </h3>
                    <a 
                      href={`https://maps.google.com/?q=${activeJob?.address}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-[10px] font-black uppercase tracking-wider text-blue-600 flex items-center gap-1 hover:underline"
                    >
                      Navegar <ExternalLink size={10} />
                    </a>
                  </div>

                  {activeJob ? (
                    <div className="space-y-4 py-2">
                      {/* Fake Map Rendering */}
                      <div className="h-28 bg-slate-100 rounded-2xl relative overflow-hidden border border-slate-200 flex items-center justify-center">
                        <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:16px_16px] opacity-60" />
                        {/* Simulation of a map path */}
                        <svg className="absolute w-full h-full stroke-blue-600 stroke-[3] fill-none">
                          <path d="M 20 80 Q 80 10 Q 150 90 T 260 20" strokeDasharray="5 5" />
                        </svg>
                        <div className="absolute top-1/2 left-1/4 w-3.5 h-3.5 bg-blue-600 rounded-full border-2 border-white shadow-md animate-pulse" />
                        <div className="absolute top-1/4 right-1/4 w-3.5 h-3.5 bg-red-500 rounded-full border-2 border-white shadow-md" />
                        <span className="absolute bottom-2 right-2 bg-slate-900/80 text-white text-[8px] font-black px-2 py-0.5 rounded-md uppercase backdrop-blur-sm">Simulação GPS</span>
                      </div>

                      <div>
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-black text-slate-800 text-sm">{activeJob.clientName}</h4>
                            <p className="text-xs text-slate-500 font-semibold">{activeJob.address}</p>
                          </div>
                          <span className="text-xs font-mono font-black text-slate-400 bg-slate-100 px-2 py-0.5 rounded-lg">{activeJob.time}</span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="grid grid-cols-2 gap-2 pt-2">
                        <a 
                          href={`tel:${activeJob.phone}`}
                          className="py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-black text-[10px] uppercase tracking-wider flex items-center justify-center gap-1.5"
                        >
                          <PhoneCall size={12} /> Ligar
                        </a>
                        <a 
                          href={`https://wa.me/${activeJob.phone.replace(/[^0-9]/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-100 rounded-xl font-black text-[10px] uppercase tracking-wider flex items-center justify-center gap-1.5"
                        >
                          <MessageSquare size={12} /> WhatsApp
                        </a>
                      </div>

                      {activeJob.status !== 'Concluído' ? (
                        <button
                          onClick={handleStartWorkflow}
                          className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 active:scale-95 shadow-md shadow-blue-500/10"
                        >
                          <Play size={12} /> Iniciar / Concluir Trabalho
                        </button>
                      ) : (
                        <div className="py-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-center text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2">
                          <CheckCircle size={14} /> Trabalho Concluído com Sucesso!
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-slate-400 text-xs italic text-center py-10">Nenhum trabalho agendado.</p>
                  )}
                </div>

                {/* Column 3: Resumo Financeiro */}
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
                  <div className="flex justify-between items-center border-b border-slate-50 pb-3">
                    <h3 className="font-black text-slate-800 uppercase tracking-tighter flex items-center gap-2">
                      <BarChart3 size={16} className="text-emerald-600" /> Resumo Financeiro
                    </h3>
                    <button onClick={() => setActiveTab('relatorios')} className="text-[10px] font-black uppercase tracking-wider text-blue-600 hover:underline">Ver Detalhes</button>
                  </div>

                  <div className="space-y-4">
                    {[
                      { label: 'Receitas', value: '€5.320,00', color: 'text-emerald-600', points: '10,60 25,50 40,55 55,45 70,68 85,62 100,75 115,70 130,85 145,80 160,95' },
                      { label: 'Despesas', value: '€1.820,00', color: 'text-red-500', points: '10,30 25,32 40,28 55,35 70,42 85,38 100,45 115,40 130,52 145,48 160,55' },
                      { label: 'Lucro Líquido', value: '€3.500,00', color: 'text-indigo-600', points: '10,40 25,35 40,42 55,38 70,55 85,50 100,60 115,55 130,68 145,62 160,78' },
                    ].map((fin, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-100">
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{fin.label}</p>
                          <h4 className={`text-base font-black ${fin.color} mt-0.5`}>{fin.value}</h4>
                        </div>
                        {/* Micro Line Chart */}
                        <div className="w-24 h-10">
                          <svg className="w-full h-full" viewBox="0 0 170 100">
                            <polyline
                              fill="none"
                              stroke={idx === 0 ? '#10B981' : idx === 1 ? '#EF4444' : '#6366F1'}
                              strokeWidth="3"
                              points={fin.points}
                            />
                          </svg>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* ───────────────── AGENDA TAB ───────────────── */}
          {activeTab === 'agenda' && (
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6 animate-in fade-in duration-300">
              <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                <div>
                  <h3 className="font-black text-slate-800 text-lg uppercase tracking-tight">Agenda de Compromissos</h3>
                  <p className="text-slate-400 text-xs">Arraste compromissos ou selecione o dia para novos agendamentos.</p>
                </div>
                <button 
                  onClick={() => setShowAddJobModal(true)}
                  className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5"
                >
                  <Plus size={14} /> Novo Serviço
                </button>
              </div>

              {/* Fake Calendar Widget */}
              <div className="grid grid-cols-1 lg:grid-cols-7 gap-4">
                {['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'].map((day, idx) => (
                  <div key={idx} className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-3 min-h-[300px]">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-wider text-center pb-2 border-b border-slate-200">{day}</h4>
                    {idx === 4 && (
                      <div className="p-3 bg-blue-600 text-white rounded-xl text-xs space-y-1 shadow-sm">
                        <p className="font-black">09:00 - Silva Eletricidade</p>
                        <p className="text-[10px] opacity-90">João Fernandes</p>
                      </div>
                    )}
                    {idx === 4 && (
                      <div className="p-3 bg-amber-500 text-white rounded-xl text-xs space-y-1 shadow-sm">
                        <p className="font-black">11:30 - Reparação de Quadro</p>
                        <p className="text-[10px] opacity-90">Maria Sousa</p>
                      </div>
                    )}
                    {idx === 0 && (
                      <div className="p-3 bg-slate-200 text-slate-600 rounded-xl text-xs space-y-1">
                        <p className="font-bold">14:30 - Manutenção geral</p>
                        <p className="text-[10px]">Carlos Medeiros</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ───────────────── CLIENTES TAB ───────────────── */}
          {activeTab === 'clientes' && (
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6 animate-in fade-in duration-300">
              <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                <div>
                  <h3 className="font-black text-slate-800 text-lg uppercase tracking-tight">Base de Dados de Clientes</h3>
                  <p className="text-slate-400 text-xs">Gestão de contatos, histórico e documentos dos clientes.</p>
                </div>
                <button 
                  onClick={() => setShowAddClientModal(true)}
                  className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5"
                >
                  <Plus size={14} /> Adicionar Cliente
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {clients.map(cli => (
                  <div key={cli.id} className="p-5 bg-slate-50 border border-slate-100 rounded-2xl space-y-4 hover:shadow-md transition-all">
                    <div>
                      <h4 className="font-black text-slate-800 text-sm uppercase">{cli.name}</h4>
                      <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider">NIF: {cli.nif}</span>
                    </div>

                    <div className="space-y-2 text-xs text-slate-600">
                      <p className="flex items-center gap-2"><Phone size={12} className="text-slate-400" /> {cli.phone}</p>
                      <p className="flex items-center gap-2"><Mail size={12} className="text-slate-400" /> {cli.email}</p>
                      <p className="flex items-center gap-2"><MapPin size={12} className="text-slate-400" /> {cli.address}</p>
                    </div>

                    <div className="p-3 bg-white rounded-xl border border-slate-100">
                      <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Histórico de Obras</p>
                      <p className="text-xs text-slate-500 font-semibold mt-1">{cli.history}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ───────────────── TRABALHOS TAB ───────────────── */}
          {activeTab === 'trabalhos' && (
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6 animate-in fade-in duration-300">
              <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                <div>
                  <h3 className="font-black text-slate-800 text-lg uppercase tracking-tight">Gestão de Trabalhos</h3>
                  <p className="text-slate-400 text-xs">Criação, monitorização e registo de serviços técnicos.</p>
                </div>
                <button 
                  onClick={() => setShowAddJobModal(true)}
                  className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5"
                >
                  <Plus size={14} /> Criar Novo Trabalho
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 text-[10px] font-black uppercase text-slate-400 tracking-wider">
                      <th className="py-3 px-4">Hora</th>
                      <th className="py-3 px-4">Cliente</th>
                      <th className="py-3 px-4">Tipo de Serviço</th>
                      <th className="py-3 px-4">Localização GPS</th>
                      <th className="py-3 px-4">Estado</th>
                      <th className="py-3 px-4">Ação</th>
                    </tr>
                  </thead>
                  <tbody>
                    {jobs.map((job, idx) => (
                      <tr key={job.id} className="border-b border-slate-50 hover:bg-slate-50/50 text-xs">
                        <td className="py-4 px-4 font-mono font-black">{job.time}</td>
                        <td className="py-4 px-4 font-black">{job.clientName}</td>
                        <td className="py-4 px-4 text-slate-500 font-semibold">{job.service}</td>
                        <td className="py-4 px-4 font-semibold text-slate-400">
                          <span className="flex items-center gap-1"><MapPin size={12} className="text-blue-500" /> {job.address.split(',')[1] || 'S. Miguel'}</span>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                            job.status === 'Em curso' ? 'bg-amber-100 text-amber-700' :
                            job.status === 'Concluído' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'
                          }`}>
                            {job.status}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <button 
                            onClick={() => { setSelectedJobIndex(idx); handleStartWorkflow(); }}
                            className="px-3 py-1.5 bg-slate-900 hover:bg-blue-600 text-white rounded-lg text-[10px] font-black uppercase tracking-wider transition-colors"
                          >
                            Abrir
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ───────────────── ORÇAMENTOS TAB ───────────────── */}
          {activeTab === 'orçamentos' && (
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6 animate-in fade-in duration-300">
              <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                <div>
                  <h3 className="font-black text-slate-800 text-lg uppercase tracking-tight">Orçamentos Propostos</h3>
                  <p className="text-slate-400 text-xs">Emita novos orçamentos, envie por WhatsApp ou converta em faturas.</p>
                </div>
                <button 
                  onClick={() => setShowCreateQuoteModal(true)}
                  className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5"
                >
                  <Plus size={14} /> Novo Orçamento
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {quotes.map(quote => (
                  <div key={quote.id} className="p-6 bg-slate-50 border border-slate-100 rounded-2xl flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{quote.id}</span>
                          <h4 className="font-black text-slate-800 text-sm mt-1 uppercase">{quote.clientName}</h4>
                        </div>
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                          quote.status === 'Aceite' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                        }`}>
                          {quote.status}
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-slate-500 mt-2">Serviço: {quote.service}</p>
                      <p className="text-lg font-black text-slate-800 mt-4">Valor total: €{quote.value}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mt-6">
                      <button 
                        onClick={() => {
                          const newFT = {
                            id: `FT${String(invoices.length + 1).padStart(3, '0')}`,
                            clientName: quote.clientName,
                            value: quote.value,
                            status: 'Paga',
                            date: new Date().toISOString().split('T')[0],
                            method: 'MBWay' as const
                          };
                          setInvoices(prev => [newFT, ...prev]);
                          setQuotes(prev => prev.map(q => q.id === quote.id ? { ...q, status: 'Aceite' } : q));
                          alert('Orçamento convertido em fatura com sucesso!');
                        }}
                        className="py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-black text-[9px] uppercase tracking-wider"
                      >
                        Converter em Fatura
                      </button>
                      <button 
                        onClick={() => alert('Orçamento duplicado!')}
                        className="py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-black text-[9px] uppercase tracking-wider"
                      >
                        Duplicar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ───────────────── FATURAS TAB ───────────────── */}
          {activeTab === 'faturas' && (
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6 animate-in fade-in duration-300">
              <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                <div>
                  <h3 className="font-black text-slate-800 text-lg uppercase tracking-tight">Faturação & Recibos</h3>
                  <p className="text-slate-400 text-xs">Consulte faturas emitidas e pagamentos MBWay, Multibanco ou Dinheiro.</p>
                </div>
                <button 
                  onClick={() => alert('Emissão direta de fatura pelo POS!')}
                  className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5"
                >
                  <Plus size={14} /> Emitir Fatura Rápida
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 text-[10px] font-black uppercase text-slate-400 tracking-wider">
                      <th className="py-3 px-4">ID</th>
                      <th className="py-3 px-4">Cliente</th>
                      <th className="py-3 px-4">Data</th>
                      <th className="py-3 px-4">Método</th>
                      <th className="py-3 px-4">Valor</th>
                      <th className="py-3 px-4">Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoices.map(inv => (
                      <tr key={inv.id} className="border-b border-slate-50 hover:bg-slate-50/50 text-xs">
                        <td className="py-4 px-4 font-mono font-black">{inv.id}</td>
                        <td className="py-4 px-4 font-black">{inv.clientName}</td>
                        <td className="py-4 px-4 text-slate-400 font-semibold">{inv.date}</td>
                        <td className="py-4 px-4 font-black text-slate-600">{inv.method}</td>
                        <td className="py-4 px-4 font-black">€{inv.value}</td>
                        <td className="py-4 px-4">
                          <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black bg-emerald-100 text-emerald-700 uppercase tracking-widest">
                            {inv.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ───────────────── MATERIAIS TAB ───────────────── */}
          {activeTab === 'materiais' && (
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6 animate-in fade-in duration-300">
              <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                <div>
                  <h3 className="font-black text-slate-800 text-lg uppercase tracking-tight">Stock e Materiais</h3>
                  <p className="text-slate-400 text-xs">Dedução automática ao concluir um trabalho técnico.</p>
                </div>
                <button 
                  onClick={() => setShowAddMaterialModal(true)}
                  className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5"
                >
                  <Plus size={14} /> Adicionar Material
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {materials.map(mat => (
                  <div key={mat.id} className="p-5 bg-slate-50 border border-slate-100 rounded-2xl space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[9px] font-black text-slate-400 bg-slate-200 px-2 py-0.5 rounded-md">{mat.code}</span>
                        <h4 className="font-black text-slate-800 text-sm mt-1">{mat.name}</h4>
                      </div>
                      <span className="font-black text-sm text-slate-800">€{mat.price}</span>
                    </div>

                    <div className="flex justify-between items-center pt-2">
                      <p className="text-xs text-slate-500">Fornecedor: <b>{mat.supplier}</b></p>
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${
                        (mat.stock || 0) <= (mat.minStock || 10) ? 'bg-red-100 text-red-700 animate-pulse' : 'bg-emerald-100 text-emerald-700'
                      }`}>
                        Stock: {mat.stock || 0} un
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ───────────────── FORNECEDORES TAB ───────────────── */}
          {activeTab === 'fornecedores' && (
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6 animate-in fade-in duration-300">
              <div className="border-b border-slate-100 pb-4">
                <h3 className="font-black text-slate-800 text-lg uppercase tracking-tight">Fornecedores de Equipamentos</h3>
                <p className="text-slate-400 text-xs">Fornecedores certificados locais para encomendas rápidas.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {suppliers.map(sup => (
                  <div key={sup.id} className="p-5 bg-slate-50 border border-slate-100 rounded-2xl space-y-4">
                    <div>
                      <h4 className="font-black text-slate-800 text-sm uppercase">{sup.name}</h4>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">NIF: {sup.nif}</p>
                    </div>

                    <div className="space-y-2 text-xs text-slate-600">
                      <p className="flex items-center gap-2"><Phone size={12} /> {sup.phone}</p>
                      <p className="flex items-center gap-2"><Mail size={12} /> {sup.email}</p>
                      <p className="flex items-center gap-2"><MapPin size={12} /> {sup.address}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ───────────────── POS VENDAS TAB ───────────────── */}
          {activeTab === 'pos' && (
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6 animate-in fade-in duration-300">
              <div className="border-b border-slate-100 pb-4">
                <h3 className="font-black text-slate-800 text-lg uppercase tracking-tight">Ponto de Venda Rápida (POS)</h3>
                <p className="text-slate-400 text-xs">Fature materiais e mão-de-obra diretamente no local do cliente.</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Product/Materials Catalog */}
                <div className="lg:col-span-2 space-y-4">
                  <h4 className="font-black text-slate-800 text-xs uppercase tracking-wider">Catálogo de Artigos</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {materials.map(mat => (
                      <div key={mat.id} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex justify-between items-center">
                        <div>
                          <p className="text-xs font-black text-slate-800">{mat.name}</p>
                          <p className="text-[10px] text-slate-400 font-bold">€{mat.price} / un (Stock: {mat.stock})</p>
                        </div>
                        <button
                          onClick={() => {
                            setSelectedMaterialId(mat.id);
                            addUsedMaterial();
                          }}
                          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[10px] font-black uppercase"
                        >
                          + Adicionar
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* POS Ticket Checkout */}
                <div className="p-6 bg-slate-50 border border-slate-100 rounded-3xl flex flex-col justify-between">
                  <div>
                    <h4 className="font-black text-slate-800 text-xs uppercase tracking-wider border-b border-slate-200 pb-3">Lista de Compra</h4>
                    
                    {usedMaterials.length === 0 ? (
                      <p className="text-slate-400 text-xs italic py-8 text-center">Nenhum artigo adicionado.</p>
                    ) : (
                      <div className="space-y-3 mt-4">
                        {usedMaterials.map(um => (
                          <div key={um.id} className="flex justify-between items-center text-xs">
                            <div>
                              <p className="font-bold text-slate-700">{um.name}</p>
                              <p className="text-[10px] text-slate-400">{um.quantity}x €{um.price}</p>
                            </div>
                            <button 
                              onClick={() => removeUsedMaterial(um.id, um.quantity)}
                              className="text-red-500 hover:text-red-700"
                            >
                              Remover
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="border-t border-slate-200 pt-4 mt-8 space-y-4">
                    <div className="flex justify-between font-black text-slate-800 text-sm">
                      <span>Total Faturado</span>
                      <span>€{usedMaterials.reduce((acc, c) => acc + (c.price * c.quantity), 0)}</span>
                    </div>

                    <button 
                      onClick={() => {
                        alert('Pagamento processado com sucesso! Fatura emitida.');
                        setUsedMaterials([]);
                      }}
                      disabled={usedMaterials.length === 0}
                      className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl font-black text-xs uppercase tracking-wider"
                    >
                      Concluir Venda e Imprimir
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ───────────────── COMISSÃO TAB ───────────────── */}
          {activeTab === 'comissao' && (
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6 animate-in fade-in duration-300">
              <div className="border-b border-slate-100 pb-4">
                <h3 className="font-black text-slate-800 text-lg uppercase tracking-tight">Comissões Azores toYou</h3>
                <p className="text-slate-400 text-xs">Microtaxas incidentes sobre as vendas na plataforma.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { label: 'Valor Diário', val: '€1.20', desc: 'Acumulado hoje' },
                  { label: 'Valor Mensal', val: '€52.40', desc: 'Acumulado este mês' },
                  { label: 'Histórico Total', val: '€324.80', desc: 'Desde o registo' }
                ].map((com, idx) => (
                  <div key={idx} className="p-5 bg-slate-50 border border-slate-100 rounded-2xl text-center">
                    <p className="text-xs text-slate-400 font-bold uppercase">{com.label}</p>
                    <h4 className="text-2xl font-black text-slate-800 mt-2">{com.val}</h4>
                    <p className="text-[10px] text-slate-400 mt-1">{com.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ───────────────── RELATÓRIOS TAB ───────────────── */}
          {activeTab === 'relatorios' && (
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6 animate-in fade-in duration-300">
              <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                <div>
                  <h3 className="font-black text-slate-800 text-lg uppercase tracking-tight">Relatórios de Atividade</h3>
                  <p className="text-slate-400 text-xs">Análise financeira, receitas e consumo de materiais.</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => alert('PDF Exportado!')} className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-black uppercase flex items-center gap-2">
                    <Download size={14} /> PDF
                  </button>
                  <button onClick={() => alert('Excel Exportado!')} className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-black uppercase flex items-center gap-2">
                    <Download size={14} /> Excel
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-5 bg-slate-50 border border-slate-100 rounded-2xl">
                  <h4 className="font-black text-slate-800 text-xs uppercase tracking-wider mb-4">Top Materiais Utilizados</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between text-xs"><span>Disjuntor 16A</span><span>45 unidades</span></div>
                    <div className="flex justify-between text-xs"><span>Fita Isoladora</span><span>28 rolos</span></div>
                    <div className="flex justify-between text-xs"><span>Cabo RJ45</span><span>12 rolos</span></div>
                  </div>
                </div>

                <div className="p-5 bg-slate-50 border border-slate-100 rounded-2xl">
                  <h4 className="font-black text-slate-800 text-xs uppercase tracking-wider mb-4">Trabalhos Concluídos por Ilha</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between text-xs"><span>São Miguel</span><span>120 trabalhos</span></div>
                    <div className="flex justify-between text-xs"><span>Terceira</span><span>45 trabalhos</span></div>
                    <div className="flex justify-between text-xs"><span>Faial</span><span>12 trabalhos</span></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ───────────────── GARANTIAS TAB ───────────────── */}
          {activeTab === 'garantias' && (
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6 animate-in fade-in duration-300">
              <div className="border-b border-slate-100 pb-4">
                <h3 className="font-black text-slate-800 text-lg uppercase tracking-tight">Controlo de Garantias</h3>
                <p className="text-slate-400 text-xs">Módulo de monitorização de garantias de serviços efetuados.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                {[
                  { label: 'Garantias Ativas', count: warranties.filter(w => w.status === 'Ativa').length, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                  { label: 'A Expirar brevemente', count: warranties.filter(w => w.status === 'A expirar').length, color: 'text-amber-500', bg: 'bg-amber-50' },
                  { label: 'Garantias Expiradas', count: warranties.filter(w => w.status === 'Expirada').length, color: 'text-slate-400', bg: 'bg-slate-50' }
                ].map((stat, idx) => (
                  <div key={idx} className={`p-5 rounded-2xl border border-slate-100 ${stat.bg} text-center`}>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{stat.label}</p>
                    <h4 className={`text-3xl font-black mt-2 ${stat.color}`}>{stat.count}</h4>
                  </div>
                ))}
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 text-[10px] font-black uppercase text-slate-400 tracking-wider">
                      <th className="py-3 px-4">Cliente</th>
                      <th className="py-3 px-4">Serviço</th>
                      <th className="py-3 px-4">Período</th>
                      <th className="py-3 px-4">Data Expiração</th>
                      <th className="py-3 px-4">Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {warranties.map(war => (
                      <tr key={war.id} className="border-b border-slate-50 hover:bg-slate-50/50 text-xs">
                        <td className="py-4 px-4 font-black">{war.clientName}</td>
                        <td className="py-4 px-4 text-slate-500 font-semibold">{war.service}</td>
                        <td className="py-4 px-4 font-mono">{war.duration}</td>
                        <td className="py-4 px-4 text-slate-400">{war.expiry}</td>
                        <td className="py-4 px-4">
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                            war.status === 'Ativa' ? 'bg-emerald-100 text-emerald-700' :
                            war.status === 'A expirar' ? 'bg-amber-100 text-amber-700 animate-pulse' : 'bg-slate-100 text-slate-600'
                          }`}>
                            {war.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ───────────────── MENSAGENS TAB ───────────────── */}
          {activeTab === 'mensagens' && (
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6 animate-in fade-in duration-300">
              <div className="border-b border-slate-100 pb-4">
                <h3 className="font-black text-slate-800 text-lg uppercase tracking-tight">Centro de Mensagens</h3>
                <p className="text-slate-400 text-xs">Comunicação direta com clientes e central de suporte.</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Inbox list */}
                <div className="space-y-3">
                  {clients.map(cli => (
                    <button key={cli.id} className="w-full p-4 bg-slate-50 hover:bg-slate-100 rounded-2xl text-left border border-slate-100 transition-colors">
                      <h4 className="font-black text-slate-850 text-xs uppercase">{cli.name}</h4>
                      <p className="text-[10px] text-slate-400 mt-1 truncate">Orçamento para a moradia pendente...</p>
                    </button>
                  ))}
                </div>

                {/* Chat window */}
                <div className="lg:col-span-2 p-6 bg-slate-50 border border-slate-100 rounded-3xl h-96 flex flex-col justify-between">
                  <div className="space-y-4 overflow-y-auto">
                    <div className="p-3 bg-white rounded-2xl border border-slate-100 max-w-md">
                      <p className="text-xs text-slate-700">Olá João, quando consegue passar pela minha habitação para verificar o quadro elétrico?</p>
                      <span className="text-[8px] text-slate-400 mt-1 block">Maria Sousa - 10:30</span>
                    </div>
                  </div>
                  <div className="flex gap-2 border-t border-slate-200 pt-4">
                    <input type="text" placeholder="Escreva a sua mensagem..." className="flex-1 bg-white border border-slate-200 p-3 rounded-xl text-xs" />
                    <button className="p-3 bg-slate-900 text-white rounded-xl hover:bg-blue-600 transition-colors">
                      <Send size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* ── AZORES AI FLOATING BUTTON & ASSISTANT PANEL ── */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setShowAiAssistant(!showAiAssistant)}
          className="w-14 h-14 bg-gradient-to-tr from-emerald-600 to-blue-600 rounded-full flex items-center justify-center text-white shadow-2xl hover:scale-105 active:scale-95 transition-all border-4 border-white"
        >
          <Sparkles size={24} />
        </button>

        <AnimatePresence>
          {showAiAssistant && (
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.9 }}
              className="absolute bottom-16 right-0 w-96 bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col h-[400px] z-50"
            >
              {/* Header */}
              <div className="p-4 bg-slate-900 text-white flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Sparkles size={16} className="text-emerald-400" />
                  <span className="text-xs font-black uppercase tracking-wider">✨ Assistente Azores AI</span>
                </div>
                <button onClick={() => setShowAiAssistant(false)} className="text-slate-400 hover:text-white">
                  <X size={16} />
                </button>
              </div>

              {/* Chat Body */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50">
                {aiChat.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`p-3 rounded-2xl max-w-[80%] text-xs ${
                      msg.sender === 'user' ? 'bg-blue-600 text-white' : 'bg-white text-slate-700 border border-slate-100'
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>

              {/* Form Input */}
              <div className="p-3 bg-white border-t border-slate-100 flex gap-2">
                <input
                  type="text"
                  placeholder="Experimente: 'Cria um orçamento'"
                  value={aiPrompt}
                  onChange={e => setAiPrompt(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleAiSend()}
                  className="flex-1 bg-slate-50 border border-slate-250 p-2.5 rounded-xl text-xs"
                />
                <button 
                  onClick={handleAiSend}
                  className="p-2.5 bg-slate-900 text-white rounded-xl hover:bg-emerald-600 transition-colors"
                >
                  <Send size={14} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── WORKFLOW MODAL: INITIALIZE / COMPLETE JOB ── */}
      <AnimatePresence>
        {isWorkflowModalOpen && activeJob && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white w-full max-w-2xl rounded-3xl border border-slate-100 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              {/* Header */}
              <div className="px-6 py-4 bg-slate-900 text-white flex justify-between items-center">
                <div>
                  <h3 className="font-black text-sm uppercase tracking-wider">Fluxo do Trabalho: {activeJob.service}</h3>
                  <p className="text-[10px] text-slate-400 uppercase tracking-widest">{activeJob.clientName}</p>
                </div>
                <button onClick={() => setIsWorkflowModalOpen(false)} className="text-slate-400 hover:text-white">
                  <X size={18} />
                </button>
              </div>

              {/* Steps Indicator */}
              <div className="bg-slate-50 border-b border-slate-100 px-6 py-3 flex justify-between text-[10px] font-black uppercase text-slate-400 tracking-wider">
                {[
                  { id: 'photos', label: 'Fotografias' },
                  { id: 'materials', label: 'Materiais' },
                  { id: 'signature', label: 'Assinatura' },
                  { id: 'invoice', label: 'Faturação' }
                ].map(step => (
                  <span 
                    key={step.id} 
                    className={
                      workflowStep === step.id || (workflowStep === 'payment' && step.id === 'invoice') || (workflowStep === 'done' && step.id === 'invoice')
                        ? 'text-blue-600 font-black' 
                        : ''
                    }
                  >
                    {step.label}
                  </span>
                ))}
              </div>

              {/* Body */}
              <div className="p-6 flex-1 overflow-y-auto space-y-6">

                {/* Step 1: Photos */}
                {workflowStep === 'photos' && (
                  <div className="space-y-4">
                    <h4 className="font-black text-slate-800 text-sm uppercase">Registo de Fotografias da Obra</h4>
                    
                    <div className="grid grid-cols-3 gap-4">
                      {['Antes', 'Durante', 'Depois'].map(categ => {
                        const list = jobPhotos[categ.toLowerCase() as 'antes' | 'durante' | 'depois'];
                        return (
                          <div key={categ} className="space-y-2">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{categ}</span>
                            <div className="aspect-square bg-slate-100 border-2 border-dashed border-slate-200 rounded-2xl overflow-hidden relative group">
                              <img src={list[0]} alt="Job state" className="w-full h-full object-cover" />
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer">
                                <Image size={24} className="text-white" />
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Step 2: Used Materials */}
                {workflowStep === 'materials' && (
                  <div className="space-y-4">
                    <h4 className="font-black text-slate-800 text-sm uppercase">Registar Materiais Consumidos</h4>
                    
                    <div className="flex gap-2">
                      <select 
                        value={selectedMaterialId} 
                        onChange={e => setSelectedMaterialId(e.target.value)}
                        className="flex-1 bg-slate-50 border border-slate-250 p-2.5 rounded-xl text-xs font-bold"
                      >
                        <option value="">Selecionar Material...</option>
                        {materials.map(m => (
                          <option key={m.id} value={m.id}>{m.name} (€{m.price}/un) - Stock: {m.stock}</option>
                        ))}
                      </select>
                      <input 
                        type="number" 
                        min="1" 
                        value={selectedMaterialQty} 
                        onChange={e => setSelectedMaterialQty(parseInt(e.target.value) || 1)}
                        className="w-16 bg-slate-50 border border-slate-250 p-2.5 rounded-xl text-center text-xs font-bold"
                      />
                      <button 
                        onClick={addUsedMaterial}
                        className="px-4 bg-slate-900 text-white rounded-xl font-black text-xs uppercase"
                      >
                        Adicionar
                      </button>
                    </div>

                    <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 space-y-2">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Materiais Registados</p>
                      {usedMaterials.length === 0 ? (
                        <p className="text-slate-400 text-xs italic">Nenhum material associado a esta obra.</p>
                      ) : (
                        <div className="space-y-2">
                          {usedMaterials.map(um => (
                            <div key={um.id} className="flex justify-between items-center text-xs">
                              <span>{um.name} (x{um.quantity})</span>
                              <div className="flex items-center gap-3">
                                <span className="font-bold">€{um.price * um.quantity}</span>
                                <button 
                                  onClick={() => removeUsedMaterial(um.id, um.quantity)}
                                  className="text-red-500 hover:text-red-700"
                                >
                                  Remover
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Step 3: Signature */}
                {workflowStep === 'signature' && (
                  <div className="space-y-4">
                    <h4 className="font-black text-slate-800 text-sm uppercase">Assinatura Digital do Cliente</h4>
                    <p className="text-slate-400 text-xs">Recolha a rubrica digital do cliente na conclusão da intervenção técnica.</p>
                    
                    <div 
                      className="h-40 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl relative cursor-crosshair flex items-center justify-center"
                      onClick={() => setSigSigned(true)}
                    >
                      {sigSigned ? (
                        <div className="text-center space-y-2">
                          <CheckCircle className="text-emerald-500 mx-auto w-8 h-8 animate-bounce" />
                          <p className="text-xs font-black text-emerald-600 uppercase">Assinado Digitalmente</p>
                        </div>
                      ) : (
                        <p className="text-slate-400 text-xs italic">Toque ou desenhe para assinar</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Step 4: Invoice Invoice Issuance */}
                {workflowStep === 'invoice' && (
                  <div className="space-y-4">
                    <h4 className="font-black text-slate-800 text-sm uppercase">Emissão de Fatura / Recibo</h4>
                    
                    <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl space-y-3 text-xs">
                      <div className="flex justify-between"><span>Taxa de Chamada / Serviço base</span><span className="font-bold">€65.00</span></div>
                      {usedMaterials.map(um => (
                        <div key={um.id} className="flex justify-between text-slate-500">
                          <span>{um.name} (x{um.quantity})</span>
                          <span>€{um.price * um.quantity}</span>
                        </div>
                      ))}
                      <div className="h-px bg-slate-200 my-2" />
                      <div className="flex justify-between font-black text-sm text-slate-800">
                        <span>Total Líquido</span>
                        <span>€{getWorkflowTotal()}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Método de Pagamento</label>
                      <div className="grid grid-cols-4 gap-2">
                        {['MBWay', 'Multibanco', 'Dinheiro', 'Transferência'].map(method => (
                          <button
                            key={method}
                            onClick={() => setBillingMethod(method as any)}
                            className={`py-2 text-xs font-black rounded-xl border ${
                              billingMethod === method 
                                ? 'bg-blue-600 border-transparent text-white' 
                                : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                            }`}
                          >
                            {method}
                          </button>
                        ))}
                      </div>
                    </div>

                    {billingMethod === 'MBWay' && (
                      <div className="space-y-1 animate-in slide-in-from-top-2">
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Número de Telefone</label>
                        <input 
                          type="text" 
                          placeholder="961 234 567" 
                          value={paymentPhone}
                          onChange={e => setPaymentPhone(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-250 p-2.5 rounded-xl text-xs font-bold"
                        />
                      </div>
                    )}
                  </div>
                )}

                {/* Done Step */}
                {workflowStep === 'done' && (
                  <div className="text-center py-10 space-y-4 animate-in zoom-in duration-500">
                    <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto text-emerald-500">
                      <CheckCircle size={40} />
                    </div>
                    <div>
                      <h4 className="font-black text-slate-800 text-lg uppercase">Trabalho Concluído!</h4>
                      <p className="text-slate-500 text-xs max-w-xs mx-auto mt-1">A fatura-recibo foi emitida, o stock de materiais foi atualizado e a garantia foi ativada na base de dados.</p>
                    </div>
                    <div className="pt-4">
                      <button
                        onClick={() => alert('PDF enviado para o cliente!')}
                        className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 mx-auto"
                      >
                        <Send size={14} /> Enviar PDF ao Cliente
                      </button>
                    </div>
                  </div>
                )}

              </div>

              {/* Footer Buttons */}
              {workflowStep !== 'done' && (
                <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-between">
                  <button
                    onClick={() => {
                      if (workflowStep === 'materials') setWorkflowStep('photos');
                      if (workflowStep === 'signature') setWorkflowStep('materials');
                      if (workflowStep === 'invoice') setWorkflowStep('signature');
                    }}
                    disabled={workflowStep === 'photos'}
                    className="px-4 py-2 bg-slate-200 text-slate-600 disabled:opacity-50 rounded-xl text-xs font-black uppercase"
                  >
                    Anterior
                  </button>

                  <button
                    onClick={() => {
                      if (workflowStep === 'photos') setWorkflowStep('materials');
                      else if (workflowStep === 'materials') setWorkflowStep('signature');
                      else if (workflowStep === 'signature') {
                        if (!sigSigned) {
                          alert('Por favor, solicite a assinatura do cliente.');
                          return;
                        }
                        setWorkflowStep('invoice');
                      }
                      else if (workflowStep === 'invoice') confirmWorkflowPayment();
                    }}
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black uppercase tracking-wider"
                  >
                    {workflowStep === 'invoice' ? 'Concluir & Faturar' : 'Próximo'}
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── MODALS FOR ADDING DATA ── */}
      {/* Add Client Modal */}
      {showAddClientModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 space-y-4">
            <h3 className="font-black text-slate-800 text-sm uppercase">Novo Cliente</h3>
            <div className="space-y-3">
              <input type="text" placeholder="Nome do Cliente" value={newClient.name} onChange={e => setNewClient({...newClient, name: e.target.value})} className="w-full bg-slate-50 border p-2.5 rounded-xl text-xs" />
              <input type="text" placeholder="Telefone" value={newClient.phone} onChange={e => setNewClient({...newClient, phone: e.target.value})} className="w-full bg-slate-50 border p-2.5 rounded-xl text-xs" />
              <input type="text" placeholder="Email" value={newClient.email} onChange={e => setNewClient({...newClient, email: e.target.value})} className="w-full bg-slate-50 border p-2.5 rounded-xl text-xs" />
              <input type="text" placeholder="Morada completa" value={newClient.address} onChange={e => setNewClient({...newClient, address: e.target.value})} className="w-full bg-slate-50 border p-2.5 rounded-xl text-xs" />
              <input type="text" placeholder="NIF" value={newClient.nif} onChange={e => setNewClient({...newClient, nif: e.target.value})} className="w-full bg-slate-50 border p-2.5 rounded-xl text-xs" />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setShowAddClientModal(false)} className="px-4 py-2 bg-slate-200 text-slate-600 rounded-xl text-xs font-black uppercase">Cancelar</button>
              <button 
                onClick={() => {
                  setClients(prev => [...prev, { ...newClient, id: `CLI${String(clients.length + 1).padStart(3, '0')}`, history: 'Novo cliente registado.' }]);
                  setShowAddClientModal(false);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-black uppercase"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Material Modal */}
      {showAddMaterialModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 space-y-4">
            <h3 className="font-black text-slate-800 text-sm uppercase">Novo Material no Stock</h3>
            <div className="space-y-3">
              <input type="text" placeholder="Código (Ex: DISJ-16A)" value={newMaterial.code} onChange={e => setNewMaterial({...newMaterial, code: e.target.value})} className="w-full bg-slate-50 border p-2.5 rounded-xl text-xs" />
              <input type="text" placeholder="Nome do Material" value={newMaterial.name} onChange={e => setNewMaterial({...newMaterial, name: e.target.value})} className="w-full bg-slate-50 border p-2.5 rounded-xl text-xs" />
              <input type="number" placeholder="Preço (€)" onChange={e => setNewMaterial({...newMaterial, price: parseFloat(e.target.value) || 0})} className="w-full bg-slate-50 border p-2.5 rounded-xl text-xs" />
              <input type="number" placeholder="Quantidade inicial" onChange={e => setNewMaterial({...newMaterial, stock: parseInt(e.target.value) || 0, quantity: parseInt(e.target.value) || 0})} className="w-full bg-slate-50 border p-2.5 rounded-xl text-xs" />
              <input type="number" placeholder="Stock mínimo de alerta" onChange={e => setNewMaterial({...newMaterial, minStock: parseInt(e.target.value) || 0})} className="w-full bg-slate-50 border p-2.5 rounded-xl text-xs" />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setShowAddMaterialModal(false)} className="px-4 py-2 bg-slate-200 text-slate-600 rounded-xl text-xs font-black uppercase">Cancelar</button>
              <button 
                onClick={() => {
                  setMaterials(prev => [...prev, { ...newMaterial, id: `MAT${String(materials.length + 1).padStart(3, '0')}` }]);
                  setShowAddMaterialModal(false);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-black uppercase"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Job Modal */}
      {showAddJobModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 space-y-4">
            <h3 className="font-black text-slate-800 text-sm uppercase">Agendar Novo Serviço</h3>
            <div className="space-y-3">
              <input type="text" placeholder="Nome do Cliente" value={newJob.clientName} onChange={e => setNewJob({...newJob, clientName: e.target.value})} className="w-full bg-slate-50 border p-2.5 rounded-xl text-xs" />
              <input type="text" placeholder="Tipo de Serviço" value={newJob.service} onChange={e => setNewJob({...newJob, service: e.target.value})} className="w-full bg-slate-50 border p-2.5 rounded-xl text-xs" />
              <input type="text" placeholder="Hora (Ex: 09:00)" value={newJob.time} onChange={e => setNewJob({...newJob, time: e.target.value})} className="w-full bg-slate-50 border p-2.5 rounded-xl text-xs" />
              <input type="text" placeholder="Morada" value={newJob.address} onChange={e => setNewJob({...newJob, address: e.target.value})} className="w-full bg-slate-50 border p-2.5 rounded-xl text-xs" />
              <input type="text" placeholder="Telefone" value={newJob.phone} onChange={e => setNewJob({...newJob, phone: e.target.value})} className="w-full bg-slate-50 border p-2.5 rounded-xl text-xs" />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setShowAddJobModal(false)} className="px-4 py-2 bg-slate-200 text-slate-600 rounded-xl text-xs font-black uppercase">Cancelar</button>
              <button 
                onClick={() => {
                  setJobs(prev => [...prev, { ...newJob, id: `JOB${String(jobs.length + 1).padStart(3, '0')}`, status: 'Pendente', date: new Date().toISOString().split('T')[0] }]);
                  setShowAddJobModal(false);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-black uppercase"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Quote Modal */}
      {showCreateQuoteModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 space-y-4">
            <h3 className="font-black text-slate-800 text-sm uppercase">Novo Orçamento Rápido</h3>
            <div className="space-y-3">
              <input type="text" placeholder="Nome do Cliente" value={newQuote.clientName} onChange={e => setNewQuote({...newQuote, clientName: e.target.value})} className="w-full bg-slate-50 border p-2.5 rounded-xl text-xs" />
              <input type="text" placeholder="Serviço Proposto" value={newQuote.service} onChange={e => setNewQuote({...newQuote, service: e.target.value})} className="w-full bg-slate-50 border p-2.5 rounded-xl text-xs" />
              <input type="number" placeholder="Valor Estimado (€)" onChange={e => setNewQuote({...newQuote, value: parseFloat(e.target.value) || 0})} className="w-full bg-slate-50 border p-2.5 rounded-xl text-xs" />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setShowCreateQuoteModal(false)} className="px-4 py-2 bg-slate-200 text-slate-600 rounded-xl text-xs font-black uppercase">Cancelar</button>
              <button 
                onClick={() => {
                  setQuotes(prev => [...prev, { ...newQuote, id: `ORC${String(quotes.length + 1).padStart(3, '0')}`, status: 'Pendente', date: new Date().toISOString().split('T')[0] }]);
                  setShowCreateQuoteModal(false);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-black uppercase"
              >
                Criar Orçamento
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
