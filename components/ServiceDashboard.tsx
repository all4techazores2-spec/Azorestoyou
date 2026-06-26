import React, { useState } from 'react';
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
  // Navigation state (Responsive synchronization)
  const [mobileTab, setMobileTab] = useState<string>('inicio');
  const [activeTab, setActiveTab] = useState<string>('dashboard'); // 'dashboard', 'agenda', 'clientes', 'trabalhos', etc.

  const [isMobile, setIsMobile] = useState(false);

  React.useEffect(() => {
    const checkIfMobile = () => {
      const ua = navigator.userAgent || navigator.vendor || (window as any).opera;
      const isMobileUA = /android|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(ua.toLowerCase());
      const isMobileWidth = window.innerWidth < 768;
      setIsMobile(isMobileUA || isMobileWidth);
    };
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  // AI Assistant states
  const [showAiAssistant, setShowAiAssistant] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiChat, setAiChat] = useState<Array<{ sender: 'user' | 'ai'; text: string }>>([
    { sender: 'ai', text: 'Olá! Sou o Azores AI. Como posso ajudar com o seu serviço hoje? Digite "Orçamento" ou "Agenda".' }
  ]);

  // Mock Database State
  const [materials, setMaterials] = useState([
    { id: 'MAT001', code: 'CAB-RJ45', name: 'Cabo de Rede Cat6', price: 1.5, stock: 120, minStock: 20, supplier: 'Telectra Açores' },
    { id: 'MAT002', code: 'DISJ-16A', name: 'Disjuntor Monofásico 16A', price: 8.9, stock: 15, minStock: 10, supplier: 'EletroMercado' },
    { id: 'MAT003', code: 'TOM-DUP', name: 'Tomada Elétrica Dupla', price: 4.2, stock: 5, minStock: 15, supplier: 'EletroMercado' },
    { id: 'MAT004', code: 'FITA-ISOL', name: 'Fita Isoladora 3M', price: 2.1, stock: 3, minStock: 5, supplier: 'Açores Materiais' }
  ]);

  const [clients, setClients] = useState([
    { id: 'CLI001', name: 'João Fernandes', phone: '+351 961 234 567', email: 'joao.fernandes@mail.pt', address: 'Rua do Paim, 25, Ponta Delgada', nif: '241852963', history: 'Instalação elétrica efetuada em Maio de 2026.' },
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
    { id: 'WAR002', clientName: 'Carlos Medeiros', service: 'Tomadas Exteriores', duration: '30 dias', status: 'A expirar', expiry: '2026-07-10' }
  ]);

  const [quotes, setQuotes] = useState([
    { id: 'ORC001', clientName: 'Ana Rodrigues', service: 'Substituição de Fiação', value: 450, status: 'Pendente', date: '2026-06-25' }
  ]);

  const [invoices, setInvoices] = useState([
    { id: 'FT001', clientName: 'Maria Sousa', value: 85, status: 'Paga', date: '2026-06-26', method: 'MBWay' }
  ]);

  const [suppliers, setSuppliers] = useState([
    { id: 'SUP001', name: 'EletroMercado', phone: '+351 296 123 456', email: 'geral@eletromercado.pt', nif: '512345678', address: 'Parque Industrial de Ponta Delgada' },
    { id: 'SUP002', name: 'Telectra Açores', phone: '+351 296 987 654', email: 'vendas@telectra.pt', nif: '509876543', address: 'Rua do Cabral, Ponta Delgada' }
  ]);

  // Selected job for next-job actions / workflow modals
  const [selectedJobIndex, setSelectedJobIndex] = useState<number>(0);
  const [isWorkflowModalOpen, setIsWorkflowModalOpen] = useState(false);
  const [workflowStep, setWorkflowStep] = useState<'photos' | 'materials' | 'signature' | 'invoice' | 'payment' | 'done'>('photos');

  // Add modals/drawers
  const [showNewJobDrawer, setShowNewJobDrawer] = useState(false);
  const [newJobForm, setNewJobForm] = useState({ clientName: '', address: '', service: '', date: '', time: '09:00', description: '', gps: '37.7412, -25.6756' });

  const [showAddClientModal, setShowAddClientModal] = useState(false);
  const [newClient, setNewClient] = useState({ name: '', phone: '', email: '', address: '', nif: '', history: '' });
  const [showAddMaterialModal, setShowAddMaterialModal] = useState(false);
  const [newMaterial, setNewMaterial] = useState({ code: '', name: '', price: 0, stock: 0, minStock: 0, supplier: 'EletroMercado', iva: 18 });
  const [showCreateQuoteModal, setShowCreateQuoteModal] = useState(false);
  const [newQuote, setNewQuote] = useState({ clientName: '', service: '', value: 0 });

  // Workflow details
  const [jobPhotos, setJobPhotos] = useState<{ antes: string[]; durante: string[]; depois: string[] }>({
    antes: ['https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=200'],
    durante: ['https://images.unsplash.com/photo-1621905252507-b354bc25edac?auto=format&fit=crop&q=80&w=200'],
    depois: ['https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?auto=format&fit=crop&q=80&w=200']
  });
  const [usedMaterials, setUsedMaterials] = useState<Array<{ id: string; name: string; price: number; quantity: number }>>([]);
  const [selectedMaterialId, setSelectedMaterialId] = useState('');
  const [selectedMaterialQty, setSelectedMaterialQty] = useState(1);
  const [sigSigned, setSigSigned] = useState(false);
  const [billingMethod, setBillingMethod] = useState<'MBWay' | 'Multibanco' | 'Dinheiro' | 'Transferência'>('MBWay');
  const [paymentPhone, setPaymentPhone] = useState('');

  const isElectrician = business.subcategory?.toLowerCase().includes('electric') || business.subcategory?.toLowerCase().includes('eletri');
  const isPlumber = business.subcategory?.toLowerCase().includes('plumb') || business.subcategory?.toLowerCase().includes('canali');
  const isCarpenter = business.subcategory?.toLowerCase().includes('carpen') || business.subcategory?.toLowerCase().includes('carpin');

  const getBannerImage = () => {
    if (isElectrician) return 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=800';
    if (isPlumber) return 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=800';
    if (isCarpenter) return 'https://images.unsplash.com/photo-1534224039826-c7a0dea0e66a?auto=format&fit=crop&q=80&w=800';
    return 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=800';
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
    setSigSigned(false);
    setWorkflowStep('photos');
    setIsWorkflowModalOpen(true);
  };

  const addUsedMaterial = () => {
    const mat = materials.find(m => m.id === selectedMaterialId);
    if (!mat) return;
    const existing = usedMaterials.find(um => um.id === mat.id);
    if (existing) {
      setUsedMaterials(prev => prev.map(um => um.id === mat.id ? { ...um, quantity: um.quantity + selectedMaterialQty } : um));
    } else {
      setUsedMaterials(prev => [...prev, { id: mat.id, name: mat.name, price: mat.price, quantity: selectedMaterialQty }]);
    }
    
    setMaterials(prev => prev.map(m => m.id === mat.id ? { ...m, stock: m.stock - selectedMaterialQty } : m));
    setSelectedMaterialQty(1);
  };

  const removeUsedMaterial = (id: string, qty: number) => {
    setUsedMaterials(prev => prev.filter(um => um.id !== id));
    setMaterials(prev => prev.map(m => m.id === id ? { ...m, stock: m.stock + qty } : m));
  };

  const getWorkflowTotal = () => {
    const servicePrice = 65;
    const materialsPrice = usedMaterials.reduce((acc, curr) => acc + (curr.price * curr.quantity), 0);
    return servicePrice + materialsPrice;
  };

  const confirmWorkflowPayment = () => {
    const newFT = {
      id: `FT${String(invoices.length + 1).padStart(3, '0')}`,
      clientName: activeJob?.clientName || 'Cliente Particular',
      value: getWorkflowTotal(),
      status: 'Paga',
      date: new Date().toISOString().split('T')[0],
      method: billingMethod
    };
    setInvoices(prev => [newFT, ...prev]);
    if (activeJob) {
      setJobs(prev => prev.map(j => j.id === activeJob.id ? { ...j, status: 'Concluído' } : j));
    }
    setWorkflowStep('done');
  };

  const handleAiSend = () => {
    if (!aiPrompt.trim()) return;
    const userMsg = aiPrompt.trim();
    setAiChat(prev => [...prev, { sender: 'user', text: userMsg }]);
    setAiPrompt('');
    setTimeout(() => {
      let reply = 'Como assistente Azores AI, posso ajudá-lo a criar orçamentos ou a agendar novos trabalhos. Digite "criar trabalho".';
      if (userMsg.toLowerCase().includes('trabalho') || userMsg.toLowerCase().includes('criar')) {
        reply = 'Abrindo o assistente de novo trabalho!';
        setShowNewJobDrawer(true);
      }
      setAiChat(prev => [...prev, { sender: 'ai', text: reply }]);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans antialiased text-slate-800">

      {/* ───────────────── DESKTOP VIEW ───────────────── */}
      {!isMobile && (
        <div className="flex min-h-screen">
        
        {/* Desktop Sidebar */}
        <aside className="w-80 bg-slate-900 text-white flex flex-col fixed h-full z-30 border-r border-white/5 shadow-2xl">
          <div className="p-6 border-b border-white/5 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-emerald-500 flex items-center justify-center shadow-lg">
              <span className="font-black text-white text-base">AZ</span>
            </div>
            <div>
              <h2 className="text-sm font-black uppercase tracking-widest text-white leading-none">Azores toYou</h2>
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Parceiro Oficial</span>
            </div>
          </div>

          <div className="m-4 p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-800 flex items-center justify-center">
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
              { id: 'comissao', label: 'Comissão Azores toYou', icon: <Percent size={18} /> },
              { id: 'relatorios', label: 'Relatórios', icon: <BarChart3 size={18} /> },
              { id: 'garantias', label: 'Garantias', icon: <ShieldCheck size={18} /> },
              { id: 'mensagens', label: 'Mensagens', icon: <MessageSquare size={18} /> },
            ].map(menu => (
              <button
                key={menu.id}
                onClick={() => {
                  setActiveTab(menu.id);
                  if (menu.id === 'agenda') setMobileTab('agenda');
                  else if (menu.id === 'mensagens') setMobileTab('mensagens');
                  else setMobileTab('inicio');
                }}
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

          <div className="p-4 mx-4 mb-2 bg-gradient-to-br from-blue-950 to-emerald-950 rounded-2xl border border-blue-500/20 text-center">
            <p className="text-[10px] font-black uppercase tracking-wider text-emerald-400">Card Motivacional</p>
            <p className="text-[11px] font-bold text-white/95 mt-1 leading-relaxed">
              "Juntos fazemos a economia dos Açores crescer."
            </p>
          </div>

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
            <button onClick={onLogout} className="p-2 bg-white/5 hover:bg-red-500/10 hover:text-red-400 rounded-xl transition-all">
              <X size={16} />
            </button>
          </div>
        </aside>

        {/* Desktop Workspace */}
        <div className="flex-1 pl-80 min-h-screen bg-slate-50">
          
          <header className="px-8 py-5 bg-white border-b border-slate-100 flex items-center justify-between sticky top-0 z-20">
            <h1 className="text-lg font-black text-slate-800 uppercase tracking-tighter">Painel do Parceiro - {business.name}</h1>
            <div className="flex items-center gap-3 bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[9px] font-black uppercase text-slate-600 tracking-wider">ONLINE</span>
            </div>
          </header>

          <div className="p-8 space-y-8 max-w-7xl mx-auto">
            {activeTab === 'dashboard' ? (
              <div className="space-y-8 animate-in fade-in duration-500">
                
                {/* Upper Cards row */}
                <div className="grid grid-cols-3 gap-6">
                  
                  {/* Greeting & KPIs */}
                  <div className="col-span-2 bg-white rounded-3xl p-8 border border-slate-100 shadow-sm flex flex-col justify-between relative overflow-hidden">
                    <div className="space-y-2">
                      <h2 className="text-3xl font-black text-slate-800 tracking-tight">Bom dia, João! 👋</h2>
                      <p className="text-slate-400 text-sm font-semibold">Aqui está o resumo do seu negócio hoje. Desejamos-lhe um excelente dia de trabalho.</p>
                    </div>
                    
                    <div className="grid grid-cols-4 gap-4 mt-8">
                      {[
                        { label: 'Trabalhos hoje', value: '6', icon: <Briefcase className="text-blue-600" />, bg: 'bg-blue-50' },
                        { label: 'Orçamentos pendentes', value: '2', icon: <FileText className="text-amber-500" />, bg: 'bg-amber-50' },
                        { label: 'Faturados hoje', value: '€850', icon: <Receipt className="text-emerald-500" />, bg: 'bg-emerald-50' },
                        { label: 'Avaliação média', value: '4.9', icon: <Sparkles className="text-indigo-500" />, bg: 'bg-indigo-50' },
                      ].map((kpi, idx) => (
                        <div key={idx} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex flex-col justify-between">
                          <div className={`w-8 h-8 rounded-lg ${kpi.bg} flex items-center justify-center`}>{kpi.icon}</div>
                          <div className="mt-4">
                            <h4 className="text-xl font-black text-slate-800 leading-none">{kpi.value}</h4>
                            <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider mt-1">{kpi.label}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Weather banner */}
                  <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 rounded-3xl p-6 text-white border border-white/5 relative overflow-hidden flex flex-col justify-between shadow-xl">
                    <div className="absolute inset-0 opacity-40 mix-blend-overlay">
                      <img src={getBannerImage()} alt="Work" className="w-full h-full object-cover" />
                    </div>
                    <div className="relative z-10 flex justify-between items-start">
                      <div>
                        <h4 className="text-2xl font-black">18°C</h4>
                        <p className="text-xs font-bold text-white/70">Céu pouco nublado</p>
                      </div>
                      <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/10">{getBannerIcon()}</div>
                    </div>
                    <div className="relative z-10 mt-12">
                      <p className="text-[10px] font-black uppercase tracking-widest text-emerald-400 flex items-center gap-1.5"><MapPin size={10} /> Ponta Delgada, São Miguel</p>
                    </div>
                  </div>

                </div>

                {/* POS circle and Grid menu */}
                <div className="grid grid-cols-3 gap-8 items-center">
                  
                  <div className="col-span-2 grid grid-cols-2 gap-4">
                    {[
                      { id: 'agenda', title: 'Agenda', desc: 'Ver e gerir compromissos', stat: '6 trabalhos hoje', icon: <Calendar className="text-blue-600" />, color: 'bg-blue-50' },
                      { id: 'materiais', title: 'Materiais', desc: 'Gerir stock e inventário', stat: '18 itens em stock baixo', icon: <Package className="text-indigo-600" />, color: 'bg-indigo-50' },
                      { id: 'clientes', title: 'Clientes', desc: 'Ver todos os clientes', stat: '324 clientes registados', icon: <Users className="text-emerald-600" />, color: 'bg-emerald-50' },
                      { id: 'fornecedores', title: 'Fornecedores', desc: 'Gerir fornecedores locais', stat: '12 fornecedores ativos', icon: <Truck className="text-slate-600" />, color: 'bg-slate-50' },
                    ].map((widget, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setActiveTab(widget.id);
                          if (widget.id === 'agenda') setMobileTab('agenda');
                        }}
                        className="bg-white p-5 rounded-2xl border border-slate-100 hover:border-slate-200 hover:shadow-md transition-all flex items-center justify-between text-left group"
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-xl ${widget.color} flex items-center justify-center flex-shrink-0`}>{widget.icon}</div>
                          <div>
                            <h4 className="font-black text-slate-800 text-sm uppercase tracking-tight">{widget.title}</h4>
                            <p className="text-[11px] text-slate-400 font-medium">{widget.desc}</p>
                            <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest mt-1 block">{widget.stat}</span>
                          </div>
                        </div>
                        <ArrowRight size={14} className="text-slate-350" />
                      </button>
                    ))}
                  </div>

                  <div className="flex flex-col items-center justify-center p-6 bg-white rounded-3xl border border-slate-100 shadow-sm h-full">
                    <h3 className="text-xs font-black uppercase text-slate-400 tracking-widest mb-6">Ponto de Venda Rápida</h3>
                    <button
                      onClick={() => {
                        setMobileTab('mais');
                        alert('Por favor utilize o ecrã mobile para a emissão de vendas POS ou selecione faturar nos trabalhos.');
                      }}
                      className="relative w-40 h-40 rounded-full bg-gradient-to-tr from-blue-600 via-blue-500 to-emerald-500 flex flex-col items-center justify-center text-white shadow-xl hover:scale-105 transition-all group overflow-hidden border-8 border-slate-50"
                    >
                      <ShoppingCart size={32} className="mb-2" />
                      <span className="font-black uppercase tracking-widest text-xs">POS VENDAS</span>
                    </button>
                  </div>

                </div>

                {/* Bottom detail row */}
                <div className="grid grid-cols-3 gap-8">
                  
                  {/* Today's Jobs list */}
                  <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
                    <h3 className="font-black text-slate-850 text-xs uppercase tracking-wider">Trabalhos de Hoje</h3>
                    <div className="space-y-3">
                      {jobs.map((job, idx) => (
                        <div 
                          key={job.id}
                          onClick={() => setSelectedJobIndex(idx)}
                          className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                            selectedJobIndex === idx ? 'bg-blue-50/60 border-blue-200' : 'bg-slate-50 border-slate-150 hover:border-slate-200'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="font-mono text-xs font-black text-slate-400">{job.time}</span>
                            <div>
                              <h4 className="font-black text-slate-800 text-xs truncate max-w-[120px]">{job.clientName}</h4>
                              <p className="text-[9px] text-slate-500 font-semibold">{job.service}</p>
                            </div>
                          </div>
                          <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider ${
                            job.status === 'Em curso' ? 'bg-amber-100 text-amber-700' :
                            job.status === 'Concluído' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'
                          }`}>
                            {job.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Next Job details map */}
                  <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between">
                    <h3 className="font-black text-slate-850 text-xs uppercase tracking-wider border-b border-slate-50 pb-2">Próximo Trabalho</h3>
                    {activeJob && (
                      <div className="space-y-4 py-2">
                        <div className="h-28 bg-slate-100 rounded-2xl relative overflow-hidden border border-slate-200 flex items-center justify-center">
                          <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:16px_16px] opacity-60" />
                          <svg className="absolute w-full h-full stroke-blue-600 stroke-[3] fill-none">
                            <path d="M 20 80 Q 80 10 Q 150 90 T 260 20" strokeDasharray="5 5" />
                          </svg>
                          <div className="absolute top-1/2 left-1/4 w-3.5 h-3.5 bg-blue-600 rounded-full border-2 border-white animate-pulse" />
                          <div className="absolute top-1/4 right-1/4 w-3.5 h-3.5 bg-red-500 rounded-full border-2 border-white" />
                        </div>
                        <div>
                          <h4 className="font-black text-slate-800 text-sm">{activeJob.clientName}</h4>
                          <p className="text-xs text-slate-500 font-semibold">{activeJob.address}</p>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          <a href={`tel:${activeJob.phone}`} className="py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-black text-[9px] uppercase text-center">Ligar</a>
                          <a href={`https://wa.me/${activeJob.phone.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-100 rounded-xl font-black text-[9px] uppercase text-center">WhatsApp</a>
                          <button onClick={handleStartWorkflow} className="py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-black text-[9px] uppercase">Iniciar</button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Financial mini summary */}
                  <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
                    <h3 className="font-black text-slate-850 text-xs uppercase tracking-wider">Resumo Financeiro</h3>
                    <div className="space-y-3">
                      {[
                        { label: 'Receitas', value: '€5.320,00', color: 'text-emerald-600' },
                        { label: 'Despesas', value: '€1.820,00', color: 'text-red-500' },
                        { label: 'Lucro Líquido', value: '€3.500,00', color: 'text-blue-600' }
                      ].map((item, idx) => (
                        <div key={idx} className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex justify-between items-center">
                          <div>
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">{item.label}</p>
                            <h4 className={`text-base font-black ${item.color} mt-0.5`}>{item.value}</h4>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

              </div>
            ) : (
              <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm text-center">
                <p className="text-slate-400 text-sm italic">Painel administrativo de {activeTab} aberto. Por favor, utilize a versão mobile no smartphone para obter o fluxo de um toque completo.</p>
              </div>
            )}
          </div>
        </div>

        </div>
      )}

      {/* ───────────────── MOBILE VIEW ───────────────── */}
      {isMobile && (
        <div className="flex flex-col min-h-screen">
        
        {/* Mobile Header */}
        <header className="px-6 py-4 bg-white border-b border-slate-100 flex items-center justify-between sticky top-0 z-30 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-emerald-500 flex items-center justify-center shadow-md">
              <span className="font-black text-white text-xs">AZ</span>
            </div>
            <div>
              <h2 className="text-xs font-black uppercase tracking-widest text-slate-800 leading-none">{business.name}</h2>
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{business.subcategory || 'Eletricista'}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 bg-emerald-50 px-2 py-1 rounded-full border border-emerald-100">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[8px] font-black uppercase text-emerald-600 tracking-wider">ONLINE</span>
            </div>
          </div>
        </header>

        {/* Mobile Content body */}
        <div className="p-4 space-y-6 flex-1 max-w-lg mx-auto w-full">

          {/* Home Tab View */}
          {mobileTab === 'inicio' && (
            <div className="space-y-6 animate-in fade-in duration-350">
              
              {/* Header greeting & details */}
              <div className="space-y-1">
                <h2 className="text-2xl font-black text-slate-850 tracking-tight">Bom dia, João! 👋</h2>
                <div className="flex justify-between items-center text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                  <span>Hoje: {new Date().toLocaleDateString('pt-PT', { weekday: 'short', day: 'numeric', month: 'short' })}</span>
                  <span className="flex items-center gap-1"><MapPin size={10} className="text-blue-500" /> Ponta Delgada, 18°C</span>
                </div>
              </div>

              {/* Main Cartão: Próximo Trabalho */}
              {activeJob ? (
                <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
                  <div className="flex justify-between items-center border-b border-slate-50 pb-3">
                    <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">PRÓXIMO TRABALHO</span>
                    <span className="text-xs font-mono font-black text-slate-400 bg-slate-50 px-2.5 py-0.5 rounded-lg">{activeJob.time}</span>
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-lg font-black text-slate-850">{activeJob.clientName}</h3>
                    <p className="text-xs text-slate-500 font-semibold flex items-center gap-1"><MapPin size={12} className="text-slate-400" /> {activeJob.address}</p>
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1">Serviço: {activeJob.service}</p>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <a href={`tel:${activeJob.phone}`} className="py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-black text-[10px] uppercase text-center flex items-center justify-center gap-1">
                      <Phone size={10} /> Ligar
                    </a>
                    <a href={`https://wa.me/${activeJob.phone.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="py-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-100 rounded-xl font-black text-[10px] uppercase text-center flex items-center justify-center gap-1">
                      <MessageSquare size={10} /> WhatsApp
                    </a>
                    <a href={`https://maps.google.com/?q=${activeJob.address}`} target="_blank" rel="noopener noreferrer" className="py-3 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-100 rounded-xl font-black text-[10px] uppercase text-center flex items-center justify-center gap-1">
                      <MapPin size={10} /> Navegar
                    </a>
                  </div>

                  {activeJob.status !== 'Concluído' ? (
                    <button
                      onClick={handleStartWorkflow}
                      className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all active:scale-95 shadow-md flex items-center justify-center gap-2"
                    >
                      <Play size={12} /> Iniciar / Concluir Trabalho
                    </button>
                  ) : (
                    <div className="py-3.5 bg-emerald-50 border border-emerald-250 text-emerald-700 rounded-2xl text-center text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2">
                      <CheckCircle size={14} /> Trabalho Concluído!
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm text-center py-10 text-slate-400 text-xs italic">
                  Nenhum trabalho agendado para hoje.
                </div>
              )}

              {/* Quick Indicators Stats */}
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Trabalhos hoje', value: '6', icon: <Briefcase className="text-blue-600" />, bg: 'bg-blue-50' },
                  { label: 'Orçamentos pendentes', value: '2', icon: <FileText className="text-amber-500" />, bg: 'bg-amber-50' },
                  { label: 'Faturados hoje', value: '€850', icon: <Receipt className="text-emerald-500" />, bg: 'bg-emerald-50' },
                  { label: 'Avaliação média', value: '4.9', icon: <Sparkles className="text-indigo-500" />, bg: 'bg-indigo-50' },
                ].map((kpi, idx) => (
                  <div key={idx} className="p-4 bg-white border border-slate-100 rounded-3xl flex flex-col justify-between hover:scale-[1.02] transition-transform shadow-sm">
                    <div className={`w-8 h-8 rounded-lg ${kpi.bg} flex items-center justify-center`}>{kpi.icon}</div>
                    <div className="mt-4">
                      <h4 className="text-lg font-black text-slate-850 leading-none">{kpi.value}</h4>
                      <p className="text-[9px] font-black uppercase text-slate-400 tracking-wider mt-1">{kpi.label}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Large POS Button Card */}
              <div className="bg-gradient-to-tr from-blue-600 via-blue-500 to-emerald-500 rounded-3xl p-6 text-white border border-white/5 relative overflow-hidden shadow-lg flex justify-between items-center">
                <div>
                  <h4 className="text-sm font-black uppercase tracking-widest text-white/90">Faturação Direta POS</h4>
                  <p className="text-[10px] text-white/70 font-semibold mt-1">Fature materiais e mão-de-obra com um toque</p>
                </div>
                <button 
                  onClick={() => setMobileTab('mais')}
                  className="px-4 py-2.5 bg-white text-slate-900 rounded-xl font-black uppercase tracking-widest text-[9px] hover:scale-105 active:scale-95 transition-all shadow-md flex items-center gap-1.5"
                >
                  Abrir POS <ArrowRight size={10} />
                </button>
              </div>

              {/* Trabalhos de Hoje List */}
              <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm space-y-4">
                <h3 className="font-black text-slate-800 text-xs uppercase tracking-wider">Trabalhos de Hoje</h3>
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
                          <p className="text-[9px] text-slate-500 font-semibold">{job.service}</p>
                        </div>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider ${
                        job.status === 'Em curso' ? 'bg-amber-100 text-amber-700' :
                        job.status === 'Concluído' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'
                      }`}>
                        {job.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Resumo Financeiro */}
              <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm space-y-4">
                <h3 className="font-black text-slate-800 text-xs uppercase tracking-wider">Resumo Financeiro</h3>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: 'Receitas', value: '€5.320', color: 'text-emerald-600 bg-emerald-50' },
                    { label: 'Despesas', value: '€1.820', color: 'text-red-500 bg-red-50' },
                    { label: 'Lucro', value: '€3.500', color: 'text-blue-600 bg-blue-50' }
                  ].map((fin, idx) => (
                    <div key={idx} className={`p-3 rounded-2xl ${fin.color} text-center border border-slate-100`}>
                      <p className="text-[9px] font-bold uppercase tracking-wider opacity-70">{fin.label}</p>
                      <h4 className="text-sm font-black mt-1">{fin.value}</h4>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* Agenda Tab View */}
          {mobileTab === 'agenda' && (
            <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm space-y-4 animate-in fade-in duration-300">
              <h3 className="font-black text-slate-800 text-sm uppercase">Agenda Semanal</h3>
              <div className="space-y-3">
                {['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta'].map((day, idx) => (
                  <div key={idx} className="p-3 bg-slate-50 border border-slate-100 rounded-2xl flex justify-between items-center">
                    <div>
                      <h4 className="text-xs font-black text-slate-800">{day}</h4>
                      <p className="text-[10px] text-slate-400 font-semibold">{idx === 4 ? '2 Trabalhos agendados' : '1 Trabalho agendado'}</p>
                    </div>
                    <ArrowRight size={14} className="text-slate-350" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Mensagens Tab View */}
          {mobileTab === 'mensagens' && (
            <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm space-y-4 animate-in fade-in duration-300">
              <h3 className="font-black text-slate-800 text-sm uppercase">Mensagens Directas</h3>
              <div className="space-y-3">
                {clients.map(cli => (
                  <div key={cli.id} className="p-3 bg-slate-50 border border-slate-100 rounded-2xl flex justify-between items-center">
                    <div>
                      <h4 className="text-xs font-black text-slate-800">{cli.name}</h4>
                      <p className="text-[9px] text-slate-400 truncate max-w-[180px]">Orçamento enviado por WhatsApp...</p>
                    </div>
                    <MessageSquare size={14} className="text-blue-500" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Mais Tab View */}
          {mobileTab === 'mais' && (
            <div className="space-y-4 animate-in fade-in duration-300">
              <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm space-y-3">
                <h3 className="font-black text-slate-800 text-xs uppercase tracking-wider border-b border-slate-50 pb-2">Gestão Geral</h3>
                
                {[
                  { label: 'POS Vendas', count: 'Faturação rápida', icon: <ShoppingCart size={16} className="text-blue-600" /> },
                  { label: 'Materiais', count: '4 itens em stock', icon: <Package size={16} className="text-indigo-600" /> },
                  { label: 'Fornecedores', count: '3 fornecedores', icon: <Truck size={16} className="text-emerald-600" /> },
                  { label: 'Faturas', count: '1 fatura emitida', icon: <Receipt size={16} className="text-rose-600" /> },
                  { label: 'Garantias', count: '2 garantias ativas', icon: <ShieldCheck size={16} className="text-violet-600" /> },
                  { label: 'Relatórios', count: 'Estatísticas de lucros', icon: <BarChart3 size={16} className="text-teal-600" /> }
                ].map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => alert(`Aberto painel de ${item.label}`)}
                    className="w-full py-3 px-2 border-b border-slate-50 last:border-0 flex justify-between items-center text-xs text-left"
                  >
                    <div className="flex items-center gap-3">
                      {item.icon}
                      <div>
                        <p className="font-black text-slate-800">{item.label}</p>
                        <p className="text-[9px] text-slate-400 font-semibold">{item.count}</p>
                      </div>
                    </div>
                    <ArrowRight size={12} className="text-slate-300" />
                  </button>
                ))}
              </div>

              <button 
                onClick={onLogout}
                className="w-full py-4 bg-red-50 hover:bg-red-100 text-red-600 rounded-2xl font-black text-xs uppercase tracking-widest text-center"
              >
                Terminar Sessão (Sair)
              </button>
            </div>
          )}

        </div>

        {/* Mobile Bottom Navigation Bar */}
        <nav className="fixed bottom-0 inset-x-0 h-20 bg-white/90 backdrop-blur-lg border-t border-slate-150 z-40 flex items-center justify-between px-6 shadow-[0_-8px_30px_rgba(0,0,0,0.06)]">
          
          <button 
            onClick={() => setMobileTab('inicio')}
            className={`flex flex-col items-center gap-1 transition-colors ${mobileTab === 'inicio' ? 'text-blue-600' : 'text-slate-400'}`}
          >
            <LayoutDashboard size={20} />
            <span className="text-[9px] font-black uppercase tracking-wider">Início</span>
          </button>

          <button 
            onClick={() => setMobileTab('agenda')}
            className={`flex flex-col items-center gap-1 transition-colors ${mobileTab === 'agenda' ? 'text-blue-600' : 'text-slate-400'}`}
          >
            <Calendar size={20} />
            <span className="text-[9px] font-black uppercase tracking-wider">Agenda</span>
          </button>

          <button 
            onClick={() => setShowNewJobDrawer(true)}
            className="w-14 h-14 bg-gradient-to-tr from-blue-600 to-emerald-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-blue-500/20 active:scale-90 transition-transform -translate-y-4 border-4 border-slate-50 relative z-50 animate-bounce"
          >
            <Plus size={24} />
          </button>

          <button 
            onClick={() => setMobileTab('mensagens')}
            className={`flex flex-col items-center gap-1 transition-colors ${mobileTab === 'mensagens' ? 'text-blue-600' : 'text-slate-400'}`}
          >
            <MessageSquare size={20} />
            <span className="text-[9px] font-black uppercase tracking-wider">Mensagens</span>
          </button>

          <button 
            onClick={() => setMobileTab('mais')}
            className={`flex flex-col items-center gap-1 transition-colors ${mobileTab === 'mais' ? 'text-blue-600' : 'text-slate-400'}`}
          >
            <Settings size={20} />
            <span className="text-[9px] font-black uppercase tracking-wider">Mais</span>
          </button>

        </nav>

        </div>
      )}

      {/* ── SHARED OVERLAY DRAWER FOR NEW JOB ── */}
      <AnimatePresence>
        {showNewJobDrawer && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-end justify-center">
            <div className="absolute inset-0" onClick={() => setShowNewJobDrawer(false)} />
            
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="bg-white w-full max-w-md rounded-t-[2.5rem] border-t border-slate-100 shadow-2xl p-6 space-y-4 relative z-10 max-h-[85vh] overflow-y-auto"
            >
              <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-2" />
              <div className="flex justify-between items-center border-b border-slate-50 pb-2">
                <h3 className="font-black text-slate-800 text-sm uppercase tracking-wider">Novo Trabalho</h3>
                <button onClick={() => setShowNewJobDrawer(false)} className="text-slate-400 hover:text-slate-600">
                  <X size={16} />
                </button>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Cliente</label>
                  <input 
                    type="text" 
                    placeholder="Nome do cliente" 
                    value={newJobForm.clientName} 
                    onChange={e => setNewJobForm({...newJobForm, clientName: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-xs font-bold" 
                  />
                </div>
                
                <div>
                  <label className="block text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Morada</label>
                  <input 
                    type="text" 
                    placeholder="Rua, Concelho, Freguesia" 
                    value={newJobForm.address} 
                    onChange={e => setNewJobForm({...newJobForm, address: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-xs font-bold" 
                  />
                </div>

                <div>
                  <label className="block text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Tipo de Serviço</label>
                  <input 
                    type="text" 
                    placeholder="Ex: Reparação elétrica" 
                    value={newJobForm.service} 
                    onChange={e => setNewJobForm({...newJobForm, service: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-xs font-bold" 
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Data</label>
                    <input 
                      type="date" 
                      value={newJobForm.date} 
                      onChange={e => setNewJobForm({...newJobForm, date: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-xs font-bold" 
                    />
                  </div>
                  <div>
                    <label className="block text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Hora</label>
                    <input 
                      type="text" 
                      placeholder="09:00" 
                      value={newJobForm.time} 
                      onChange={e => setNewJobForm({...newJobForm, time: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-xs font-bold" 
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Coordenadas GPS (Auto)</label>
                  <input 
                    type="text" 
                    readOnly 
                    value={newJobForm.gps} 
                    className="w-full bg-slate-100 border border-slate-200 p-3 rounded-xl text-xs font-mono font-bold text-slate-500 cursor-not-allowed" 
                  />
                </div>

                <div>
                  <label className="block text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Descrição</label>
                  <textarea 
                    rows={2} 
                    placeholder="Notas adicionais sobre o serviço..." 
                    value={newJobForm.description} 
                    onChange={e => setNewJobForm({...newJobForm, description: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-xs font-semibold"
                  />
                </div>
              </div>

              <button
                onClick={() => {
                  setJobs(prev => [...prev, {
                    id: `JOB${String(jobs.length + 1).padStart(3, '0')}`,
                    time: newJobForm.time,
                    clientName: newJobForm.clientName,
                    service: newJobForm.service,
                    status: 'Pendente',
                    address: newJobForm.address,
                    phone: '+351 960 000 000',
                    warranty: '1 ano',
                    date: newJobForm.date || new Date().toISOString().split('T')[0]
                  }]);
                  setShowNewJobDrawer(false);
                  alert('Novo trabalho agendado com sucesso!');
                }}
                className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-black text-xs uppercase tracking-widest mt-4"
              >
                Continuar / Guardar Trabalho
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── SHARED WORKFLOW MODAL FOR CONCLUDING JOB ── */}
      <AnimatePresence>
        {isWorkflowModalOpen && activeJob && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-end justify-center">
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="bg-white w-full max-w-md rounded-t-[2.5rem] border-t border-slate-100 shadow-2xl p-6 space-y-4 relative z-10 max-h-[85vh] overflow-y-auto"
            >
              <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-2" />
              <div className="flex justify-between items-center border-b border-slate-50 pb-2">
                <div>
                  <h3 className="font-black text-xs uppercase tracking-wider text-slate-800">Concluir Obra: {activeJob.service}</h3>
                  <p className="text-[9px] text-slate-400 font-bold uppercase">{activeJob.clientName}</p>
                </div>
                <button onClick={() => setIsWorkflowModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                  <X size={16} />
                </button>
              </div>

              {/* Photos Step */}
              {workflowStep === 'photos' && (
                <div className="space-y-4">
                  <h4 className="font-black text-slate-850 text-xs uppercase">Fotografias da Obra</h4>
                  <div className="grid grid-cols-3 gap-2">
                    {['Antes', 'Durante', 'Depois'].map(categ => (
                      <div key={categ} className="space-y-1 text-center">
                        <span className="text-[8px] font-black text-slate-400 uppercase">{categ}</span>
                        <div className="aspect-square bg-slate-100 border border-slate-200 rounded-2xl overflow-hidden relative">
                          <img src={jobPhotos[categ.toLowerCase() as 'antes' | 'durante' | 'depois'][0]} alt="Job" className="w-full h-full object-cover" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Materials Step */}
              {workflowStep === 'materials' && (
                <div className="space-y-4">
                  <h4 className="font-black text-slate-850 text-xs uppercase">Materiais Utilizados</h4>
                  <div className="flex gap-2">
                    <select 
                      value={selectedMaterialId} 
                      onChange={e => setSelectedMaterialId(e.target.value)}
                      className="flex-1 bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-xs font-bold"
                    >
                      <option value="">Escolher Material...</option>
                      {materials.map(m => (
                        <option key={m.id} value={m.id}>{m.name} (€{m.price}/un)</option>
                      ))}
                    </select>
                    <button 
                      onClick={addUsedMaterial}
                      className="px-4 bg-slate-900 text-white rounded-xl font-black text-xs uppercase"
                    >
                      +
                    </button>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                    {usedMaterials.length === 0 ? (
                      <p className="text-slate-400 text-[10px] italic">Sem materiais registados.</p>
                    ) : (
                      usedMaterials.map(um => (
                        <div key={um.id} className="flex justify-between items-center text-[11px]">
                          <span>{um.name} (x{um.quantity})</span>
                          <span className="font-bold">€{um.price * um.quantity}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* Signature Step */}
              {workflowStep === 'signature' && (
                <div className="space-y-3">
                  <h4 className="font-black text-slate-850 text-xs uppercase">Assinatura Digital</h4>
                  <div 
                    className="h-28 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl flex items-center justify-center cursor-pointer"
                    onClick={() => setSigSigned(true)}
                  >
                    {sigSigned ? (
                      <span className="text-xs font-black text-emerald-600 uppercase">Assinado Digitalmente ✔</span>
                    ) : (
                      <span className="text-xs text-slate-400 italic">Rubricar aqui</span>
                    )}
                  </div>
                </div>
              )}

              {/* Invoice Step */}
              {workflowStep === 'invoice' && (
                <div className="space-y-4">
                  <h4 className="font-black text-slate-850 text-xs uppercase">Pagamento e Faturação</h4>
                  <div className="p-4 bg-slate-50 rounded-2xl text-xs space-y-2">
                    <div className="flex justify-between"><span>Serviço base</span><span>€65.00</span></div>
                    {usedMaterials.map(um => (
                      <div key={um.id} className="flex justify-between text-slate-400">
                        <span>{um.name} (x{um.quantity})</span>
                        <span>€{um.price * um.quantity}</span>
                      </div>
                    ))}
                    <div className="h-px bg-slate-200 my-1" />
                    <div className="flex justify-between font-black text-slate-800">
                      <span>Total</span>
                      <span>€{getWorkflowTotal()}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-1.5">
                    {['MBWay', 'Multibanco', 'Dinheiro', 'Transferência'].map(method => (
                      <button
                        key={method}
                        onClick={() => setBillingMethod(method as any)}
                        className={`py-2 text-[9px] font-black rounded-lg border ${
                          billingMethod === method 
                            ? 'bg-blue-600 border-transparent text-white' 
                            : 'bg-slate-50 border-slate-200 text-slate-600'
                        }`}
                      >
                        {method}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Done Step */}
              {workflowStep === 'done' && (
                <div className="text-center py-6 space-y-4">
                  <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center mx-auto text-emerald-500">
                    <CheckCircle size={32} />
                  </div>
                  <div>
                    <h4 className="font-black text-slate-850 text-sm uppercase">Obra Concluída com Sucesso!</h4>
                    <p className="text-slate-400 text-[10px]">A fatura foi emitida e o stock foi deduzido automaticamente.</p>
                  </div>
                  <button
                    onClick={() => {
                      alert('PDF enviado com sucesso!');
                      setIsWorkflowModalOpen(false);
                    }}
                    className="w-full py-3 bg-slate-900 text-white rounded-xl font-black text-xs uppercase"
                  >
                    Enviar PDF ao Cliente
                  </button>
                </div>
              )}

              {/* Navigation buttons */}
              {workflowStep !== 'done' && (
                <div className="flex justify-between gap-2 pt-4">
                  <button
                    onClick={() => {
                      if (workflowStep === 'materials') setWorkflowStep('photos');
                      if (workflowStep === 'signature') setWorkflowStep('materials');
                      if (workflowStep === 'invoice') setWorkflowStep('signature');
                    }}
                    disabled={workflowStep === 'photos'}
                    className="px-4 py-3 bg-slate-100 disabled:opacity-50 text-slate-600 rounded-xl text-xs font-black uppercase"
                  >
                    Voltar
                  </button>
                  <button
                    onClick={() => {
                      if (workflowStep === 'photos') setWorkflowStep('materials');
                      else if (workflowStep === 'materials') setWorkflowStep('signature');
                      else if (workflowStep === 'signature') {
                        if (!sigSigned) {
                          alert('Por favor solicite a assinatura do cliente.');
                          return;
                        }
                        setWorkflowStep('invoice');
                      }
                      else if (workflowStep === 'invoice') confirmWorkflowPayment();
                    }}
                    className="flex-1 py-3 bg-blue-600 text-white rounded-xl text-xs font-black uppercase tracking-wider"
                  >
                    {workflowStep === 'invoice' ? 'Faturar e Receber' : 'Continuar'}
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── FLOATING AI BUTTON ── */}
      <div className="fixed bottom-24 right-4 z-40">
        <button
          onClick={() => setShowAiAssistant(!showAiAssistant)}
          className="w-12 h-12 bg-gradient-to-tr from-emerald-600 to-blue-600 rounded-full flex items-center justify-center text-white shadow-lg border-2 border-white"
        >
          <Sparkles size={20} />
        </button>

        <AnimatePresence>
          {showAiAssistant && (
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.95 }}
              className="absolute bottom-14 right-0 w-80 bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden flex flex-col h-80 z-50"
            >
              <div className="p-3 bg-slate-900 text-white flex justify-between items-center text-xs">
                <span className="font-black uppercase tracking-wider flex items-center gap-1"><Sparkles size={12} /> Azores AI</span>
                <button onClick={() => setShowAiAssistant(false)}><X size={14} /></button>
              </div>

              <div className="flex-1 p-3 overflow-y-auto space-y-2 bg-slate-50 text-[11px]">
                {aiChat.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`p-2.5 rounded-2xl max-w-[85%] ${
                      msg.sender === 'user' ? 'bg-blue-600 text-white' : 'bg-white text-slate-700 border border-slate-100 shadow-sm'
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-2 bg-white border-t border-slate-100 flex gap-1.5">
                <input 
                  type="text" 
                  placeholder="Digite: 'criar trabalho'" 
                  value={aiPrompt}
                  onChange={e => setAiPrompt(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleAiSend()}
                  className="flex-1 bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-xs" 
                />
                <button onClick={handleAiSend} className="p-2.5 bg-slate-900 text-white rounded-xl">
                  <Send size={12} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
};
