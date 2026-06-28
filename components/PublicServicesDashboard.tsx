import React, { useState } from 'react';
import { 
  Building2, Users, FileText, AlertTriangle, Droplet, Calendar, Megaphone, 
  Music, Folders, MessageSquare, CreditCard, BarChart3, Settings, 
  Plus, Check, Search, MapPin, Eye, FileDown, Bell, LogOut, ChevronRight, User, Mail, Phone, Clock
} from 'lucide-react';
import { Business } from '../types';

interface PublicServicesDashboardProps {
  business: Business;
  onLogout?: () => void;
}

export const PublicServicesDashboard: React.FC<PublicServicesDashboardProps> = ({ 
  business,
  onLogout 
}) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Simulated State for municipality/council interactivity
  const [atendimentos, setAtendimentos] = useState([
    { id: 1, citizen: 'Maria Santos', contact: '912345678', email: 'maria@gmail.com', subject: 'Dúvida Licenciamento', dept: 'Urbanismo', status: 'Em análise', obs: 'Cidadã aguarda contacto telefónico.', date: '2026-06-28' },
    { id: 2, citizen: 'João Silva', contact: '923456789', email: 'joao@outlook.pt', subject: 'Pedido de Apoio Social', dept: 'Ação Social', status: 'Em atendimento', obs: 'Reunião agendada.', date: '2026-06-28' },
    { id: 3, citizen: 'Ana Rodrigues', contact: '967890123', email: 'ana.r@sapo.pt', subject: 'Limpeza de Terreno', dept: 'Ambiente', status: 'Concluído', obs: 'Equipa enviada ao local.', date: '2026-06-27' },
  ]);

  const [pedidos, setPedidos] = useState([
    { id: 1, citizen: 'António Costa', type: 'Atestado de residência', date: '2026-06-28', status: 'Pendente', file: 'atestado_residencia.pdf', resp: 'Dra. Cláudia Melo' },
    { id: 2, citizen: 'Filipa Pereira', type: 'Licença de Ocupação de Via Pública', date: '2026-06-27', status: 'Em análise', file: 'licenca_via_publica.pdf', resp: 'Dr. Nuno Silva' },
    { id: 3, citizen: 'Carlos Sousa', type: 'Declaração de agregado familiar', date: '2026-06-26', status: 'Concluído', file: 'declaracao_agregado.pdf', resp: 'Dra. Cláudia Melo' }
  ]);

  const [aguas, setAguas] = useState([
    { id: 'FAT-2026-001', period: 'Maio 2026', consumption: '12 m³', amount: 18.50, status: 'Pendente', dueDate: '2026-07-15' },
    { id: 'FAT-2026-002', period: 'Abril 2026', consumption: '14 m³', amount: 21.20, status: 'Pago', dueDate: '2026-06-15' },
    { id: 'FAT-2026-003', period: 'Março 2026', consumption: '10 m³', amount: 15.80, status: 'Pago', dueDate: '2026-05-15' }
  ]);

  const [ocorrencias, setOcorrencias] = useState([
    { id: 1, type: 'Buraco na estrada', address: 'Rua Direita, Ponta Delgada', priority: 'Alta', status: 'Em execução', citizen: 'Rui Pontes', date: '2026-06-28', lat: 37.7412, lng: -25.6698, image: 'https://images.unsplash.com/photo-1515162305285-0293e4767cc2?q=80&w=400' },
    { id: 2, type: 'Iluminação avariada', address: 'Avenida Marginal, Lagoa', priority: 'Média', status: 'Recebida', citizen: 'Sara Borges', date: '2026-06-28', lat: 37.7450, lng: -25.6620, image: 'https://images.unsplash.com/photo-1509395062183-67c5ad6faff9?q=80&w=400' },
    { id: 3, type: 'Lixo fora do contentor', address: 'Rua do Carmo, Vila Franca', priority: 'Baixa', status: 'Resolvida', citizen: 'José Neves', date: '2026-06-27', lat: 37.7390, lng: -25.6710, image: 'https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?q=80&w=400' }
  ]);

  const [agendamentos, setAgendamentos] = useState([
    { id: 1, citizen: 'Manuel Rebelo', service: 'Balcão Único - Licenciamentos', date: '2026-06-29', time: '10:00', status: 'Confirmado' },
    { id: 2, citizen: 'Teresa Canto', service: 'Ação Social - Atendimento Geral', date: '2026-06-29', time: '11:30', status: 'Confirmado' }
  ]);

  const [avisos, setAvisos] = useState([
    { id: 1, title: 'Corte no Abastecimento de Água', category: 'Água', msg: 'Interrupção temporária devido a trabalhos na rede na freguesia de São Pedro.', dateStart: '2026-06-29 09:00', dateEnd: '2026-06-29 13:00', priority: 'Alta' },
    { id: 2, title: 'Condicionamento de Trânsito - Procissão', category: 'Trânsito', msg: 'Trânsito condicionado na Avenida Marginal para realização de evento religioso.', dateStart: '2026-06-30 18:00', dateEnd: '2026-06-30 21:00', priority: 'Média' }
  ]);

  const [eventos, setEventos] = useState([
    { id: 1, name: 'Feira Quinzenal e de Artesanato', desc: 'Artesanato regional, gastronomia típica e animação musical local.', place: 'Praça do Município', date: '2026-07-04', time: '10:00', isRegistrationActive: false, image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=400' },
    { id: 2, name: 'Concerto de Verão sob as Estrelas', desc: 'Orquestra de Sopros com solistas convidados ao ar livre.', place: 'Anfiteatro Municipal', date: '2026-07-11', time: '21:30', isRegistrationActive: true, image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=400' }
  ]);

  const [documentos, setDocumentos] = useState([
    { id: 1, title: 'Edital nº 45/2026 - Ocupação de Via Pública', category: 'Edital', date: '2026-06-28', file: 'edital_45_2026.pdf' },
    { id: 2, title: 'Regulamento Geral de Taxas Municipais', category: 'Regulamento', date: '2026-05-10', file: 'regulamento_taxas.pdf' },
    { id: 3, title: 'Formulário de Candidatura - Apoio ao Desporto', category: 'Formulário', date: '2026-06-15', file: 'form_apoio_desporto.pdf' }
  ]);

  const [mensagens, setMensagens] = useState([
    { id: 1, citizen: 'Rita Andrade', lastMsg: 'Gostaria de saber quando fica pronto o meu atestado.', time: '14:23', unread: true },
    { id: 2, citizen: 'Marco Aurélio', lastMsg: 'Envio em anexo o documento de identificação em falta.', time: 'Ontem', unread: false }
  ]);

  // Form states
  const [newAtendimento, setNewAtendimento] = useState({ citizen: '', contact: '', email: '', subject: '', dept: 'Geral', obs: '' });
  const [newOcorrencia, setNewOcorrencia] = useState({ type: 'Buraco na estrada', address: '', priority: 'Média', citizen: '', obs: '' });
  const [newAviso, setNewAviso] = useState({ title: '', category: 'Informação Geral', msg: '', priority: 'Média', dateStart: '', dateEnd: '' });
  const [newEvento, setNewEvento] = useState({ name: '', desc: '', place: '', date: '', time: '', isRegistrationActive: false });
  const [citizenAreaView, setCitizenAreaView] = useState('menu'); // menu | requests | water | occurrences | schedule
  const [simulatePaymentId, setSimulatePaymentId] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState('MBWAY');
  const [kommunikateRead, setKommunikateRead] = useState('');

  // Counters
  const countAtendimentosHoje = atendimentos.length;
  const countPedidosHoje = pedidos.filter(p => p.status === 'Pendente').length;
  const countOcorrenciasHoje = ocorrencias.filter(o => o.status !== 'Resolvida').length;
  const countAgendamentosHoje = agendamentos.length;

  const handleAddAtendimento = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAtendimento.citizen || !newAtendimento.subject) return;
    const item = {
      id: atendimentos.length + 1,
      ...newAtendimento,
      status: 'Recebido',
      date: new Date().toISOString().split('T')[0]
    };
    setAtendimentos([item, ...atendimentos]);
    setNewAtendimento({ citizen: '', contact: '', email: '', subject: '', dept: 'Geral', obs: '' });
    setActiveTab('atendimentos');
  };

  const handleAddOcorrencia = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOcorrencia.address || !newOcorrencia.citizen) return;
    const item = {
      id: ocorrencias.length + 1,
      type: newOcorrencia.type,
      address: newOcorrencia.address,
      priority: newOcorrencia.priority,
      status: 'Recebida',
      citizen: newOcorrencia.citizen,
      date: new Date().toISOString().split('T')[0],
      lat: 37.74,
      lng: -25.66,
      image: 'https://images.unsplash.com/photo-1599740831146-809ba835f8d9?q=80&w=400'
    };
    setOcorrencias([item, ...ocorrencias]);
    setNewOcorrencia({ type: 'Buraco na estrada', address: '', priority: 'Média', citizen: '', obs: '' });
    setActiveTab('ocorrencias');
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans text-slate-800">
      {/* SIDEBAR */}
      <aside className="w-64 bg-slate-900 flex flex-col justify-between shrink-0 shadow-xl z-20">
        <div>
          {/* Logo & Entity Name */}
          <div className="p-6 border-b border-slate-800 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-blue-900/50">
              A4Y
            </div>
            <div>
              <h2 className="text-white font-black text-sm uppercase tracking-tight leading-tight">{business.name}</h2>
              <span className="text-blue-400 text-[10px] font-black uppercase tracking-widest">Balcão Digital</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1 overflow-y-auto max-h-[calc(100vh-180px)] scrollbar-thin">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: Building2 },
              { id: 'atendimentos', label: 'Atendimentos', icon: Users },
              { id: 'pedidos', label: 'Pedidos e Declarações', icon: FileText },
              { id: 'ocorrencias', label: 'Ocorrências', icon: AlertTriangle },
              { id: 'aguas', label: 'Águas', icon: Droplet },
              { id: 'agendamentos', label: 'Agendamentos', icon: Calendar },
              { id: 'avisos', label: 'Avisos Públicos', icon: Megaphone },
              { id: 'eventos', label: 'Eventos', icon: Music },
              { id: 'documentos', label: 'Documentos', icon: Folders },
              { id: 'mensagens', label: 'Mensagens', icon: MessageSquare },
              { id: 'pagamentos', label: 'Pagamentos', icon: CreditCard },
              { id: 'relatorios', label: 'Relatórios', icon: BarChart3 },
              { id: 'cidadao', label: 'Área do Cidadão', icon: User },
              { id: 'definicoes', label: 'Definições', icon: Settings },
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all ${
                    isActive 
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' 
                      : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Icon size={16} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Logout Section */}
        <div className="p-4 border-t border-slate-800">
          <button 
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 py-3 bg-red-950/40 hover:bg-red-900/40 text-red-400 rounded-xl font-black text-xs uppercase tracking-wider transition-all"
          >
            <LogOut size={16} />
            <span>Sair do Balcão</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTAINER */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* HEADER */}
        <header className="h-20 bg-white border-b border-slate-200 px-8 flex items-center justify-between shrink-0">
          <div>
            <h1 className="text-xl font-black uppercase text-slate-800 tracking-tight">
              {activeTab === 'dashboard' ? 'Painel de Gestão Integrada' : 
               activeTab === 'atendimentos' ? 'Gestão de Atendimentos' :
               activeTab === 'pedidos' ? 'Pedidos de Cidadãos & Emissão de Declarações' :
               activeTab === 'ocorrencias' ? 'Ocorrências e Avarias Reportadas' :
               activeTab === 'aguas' ? 'Serviços de Água e Saneamento' :
               activeTab === 'agendamentos' ? 'Agendamentos e Marcações Prévias' :
               activeTab === 'avisos' ? 'Avisos e Comunicados Públicos' :
               activeTab === 'eventos' ? 'Cartaz de Eventos e Atividades' :
               activeTab === 'documentos' ? 'Repositório de Documentos Públicos' :
               activeTab === 'mensagens' ? 'Mensagens e Canais de Contacto' :
               activeTab === 'pagamentos' ? 'Simulador e Histórico de Pagamentos' :
               activeTab === 'relatorios' ? 'Relatórios de Desempenho Municipal' :
               activeTab === 'cidadao' ? 'Balcão Virtual do Cidadão (App)' : 'Definições do Município'}
            </h1>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">
              {business.name} • Açores • Portugal
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="p-2.5 bg-slate-100 rounded-xl relative cursor-pointer text-slate-600 hover:bg-slate-200 transition-all">
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-600 rounded-full" />
            </div>
            <div className="flex items-center gap-3 bg-slate-100 p-2 rounded-2xl">
              <img 
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100" 
                className="w-8 h-8 rounded-xl object-cover" 
                alt="Profile" 
              />
              <div className="hidden md:block text-left">
                <p className="text-xs font-black text-slate-800 uppercase leading-none">Administração</p>
                <span className="text-[9px] font-bold text-slate-400">Freguesia/Município</span>
              </div>
            </div>
          </div>
        </header>

        {/* CONTENT AREA */}
        <div className="flex-1 overflow-y-auto p-8 bg-slate-50/50">
          
          {/* TAB: DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div className="space-y-8">
              {/* Stats Bar */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { label: 'Atendimentos Hoje', val: countAtendimentosHoje, trend: '+12% vs ontem', color: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' },
                  { label: 'Pedidos Pendentes', val: countPedidosHoje, trend: '+8% vs ontem', color: 'bg-blue-500/10 text-blue-600 border-blue-500/20' },
                  { label: 'Ocorrências Ativas', val: countOcorrenciasHoje, trend: '-5% vs ontem', color: 'bg-amber-500/10 text-amber-600 border-amber-500/20' },
                  { label: 'Agendamentos Hoje', val: countAgendamentosHoje, trend: '+3% vs ontem', color: 'bg-purple-500/10 text-purple-600 border-purple-500/20' },
                ].map((stat, i) => (
                  <div key={i} className={`p-6 bg-white border rounded-3xl shadow-sm hover:shadow-md transition-all flex flex-col justify-between`}>
                    <p className="text-slate-400 font-bold uppercase text-[10px] tracking-wider mb-2">{stat.label}</p>
                    <div className="flex items-baseline justify-between">
                      <span className="text-4xl font-black text-slate-800 leading-none">{stat.val}</span>
                      <span className={`text-[10px] font-black px-2.5 py-1 rounded-full ${stat.color}`}>{stat.trend}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* What would you like to do? */}
              <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                <h3 className="text-lg font-black uppercase text-slate-800 tracking-tight mb-6">O que deseja fazer?</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: 'Novo Atendimento', icon: Users, color: 'bg-emerald-50 text-emerald-600 border-emerald-100', tab: 'atendimentos' },
                    { label: 'Novo Pedido', icon: FileText, color: 'bg-blue-50 text-blue-600 border-blue-100', tab: 'pedidos' },
                    { label: 'Nova Ocorrência', icon: AlertTriangle, color: 'bg-amber-50 text-amber-600 border-amber-100', tab: 'ocorrencias' },
                    { label: 'Nova Marcação', icon: Calendar, color: 'bg-purple-50 text-purple-600 border-purple-100', tab: 'agendamentos' },
                    { label: 'Fatura da Água', icon: Droplet, color: 'bg-cyan-50 text-cyan-600 border-cyan-100', tab: 'aguas' },
                    { label: 'Declaração de Residência', icon: FileText, color: 'bg-teal-50 text-teal-600 border-teal-100', tab: 'pedidos' },
                    { label: 'Fazer Pagamento', icon: CreditCard, color: 'bg-orange-50 text-orange-600 border-orange-100', tab: 'pagamentos' },
                    { label: 'Enviar Mensagem', icon: MessageSquare, color: 'bg-pink-50 text-pink-600 border-pink-100', tab: 'mensagens' },
                  ].map((act, i) => {
                    const Icon = act.icon;
                    return (
                      <button
                        key={i}
                        onClick={() => setActiveTab(act.tab)}
                        className={`p-6 border rounded-2xl flex flex-col items-center justify-center text-center gap-3 hover:scale-105 transition-all shadow-sm ${act.color}`}
                      >
                        <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm">
                          <Icon size={22} />
                        </div>
                        <span className="font-black text-xs uppercase tracking-wide leading-tight">{act.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Two Column Layout for Quick Overview */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Active Alerts */}
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-black uppercase text-slate-800 tracking-wider">Avisos Públicos</h3>
                    <button onClick={() => setActiveTab('avisos')} className="text-xs font-black text-blue-600 uppercase">Ver todos</button>
                  </div>
                  <div className="space-y-3">
                    {avisos.map(av => (
                      <div key={av.id} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex gap-4">
                        <div className={`w-10 h-10 rounded-full shrink-0 flex items-center justify-center text-white ${av.priority === 'Alta' ? 'bg-red-500' : 'bg-amber-500'}`}>
                          <Megaphone size={18} />
                        </div>
                        <div>
                          <h4 className="font-black text-xs uppercase text-slate-800 leading-tight mb-1">{av.title}</h4>
                          <p className="text-[11px] text-slate-500 font-medium mb-1.5">{av.msg}</p>
                          <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full ${av.priority === 'Alta' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
                            {av.priority === 'Alta' ? 'Urgente' : 'Atenção'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Map Summary placeholder */}
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-black uppercase text-slate-800 tracking-wider">Ocorrências no Mapa</h3>
                    <button onClick={() => setActiveTab('ocorrencias')} className="text-xs font-black text-blue-600 uppercase">Ver mapa</button>
                  </div>
                  <div className="h-60 rounded-2xl bg-slate-100 border border-slate-200 relative overflow-hidden flex flex-col justify-end p-4">
                    {/* Simulated Map Background */}
                    <div className="absolute inset-0 bg-cover bg-center opacity-70" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=600')` }} />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent" />
                    
                    {/* Map Pins Simulation */}
                    <div className="absolute top-1/3 left-1/4 bg-red-600 text-white p-2 rounded-full shadow-lg cursor-pointer hover:scale-110 transition-transform">
                      <AlertTriangle size={14} />
                    </div>
                    <div className="absolute top-1/2 left-2/3 bg-amber-500 text-white p-2 rounded-full shadow-lg cursor-pointer hover:scale-110 transition-transform">
                      <AlertTriangle size={14} />
                    </div>
                    <div className="absolute top-1/4 left-1/2 bg-blue-600 text-white p-2 rounded-full shadow-lg cursor-pointer hover:scale-110 transition-transform">
                      <Droplet size={14} />
                    </div>

                    <div className="relative z-10 text-white">
                      <p className="font-black text-xs uppercase tracking-wider mb-0.5">Centro de Gestão de Vias</p>
                      <span className="text-[10px] text-white/70 font-bold uppercase">{ocorrencias.length} Ocorrências geo-referenciadas na freguesia</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: ATENDIMENTOS */}
          {activeTab === 'atendimentos' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Form Column */}
              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm h-fit">
                <h3 className="text-sm font-black uppercase text-slate-800 tracking-wider mb-4">Novo Atendimento</h3>
                <form onSubmit={handleAddAtendimento} className="space-y-4">
                  <div>
                    <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider block mb-1">Nome do Cidadão *</label>
                    <input 
                      type="text" 
                      required
                      placeholder="Ex: Manuel Silva"
                      value={newAtendimento.citizen}
                      onChange={e => setNewAtendimento({...newAtendimento, citizen: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-blue-500 font-bold"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider block mb-1">Contacto Telefónico</label>
                      <input 
                        type="text" 
                        placeholder="Ex: 912345678"
                        value={newAtendimento.contact}
                        onChange={e => setNewAtendimento({...newAtendimento, contact: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-blue-500 font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider block mb-1">Email</label>
                      <input 
                        type="email" 
                        placeholder="Ex: citizen@mail.com"
                        value={newAtendimento.email}
                        onChange={e => setNewAtendimento({...newAtendimento, email: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-blue-500 font-bold"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider block mb-1">Assunto / Pedido *</label>
                    <input 
                      type="text" 
                      required
                      placeholder="Ex: Reclamação de ruído / Pedido de Apoio"
                      value={newAtendimento.subject}
                      onChange={e => setNewAtendimento({...newAtendimento, subject: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-blue-500 font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider block mb-1">Departamento Destinatário</label>
                    <select
                      value={newAtendimento.dept}
                      onChange={e => setNewAtendimento({...newAtendimento, dept: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-blue-500 font-bold"
                    >
                      <option value="Geral">Secretaria Geral</option>
                      <option value="Urbanismo">Urbanismo & Licenciamentos</option>
                      <option value="Ação Social">Ação Social</option>
                      <option value="Ambiente">Ambiente & Higiene Urbana</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider block mb-1">Observações Internas</label>
                    <textarea 
                      placeholder="Notas adicionais..."
                      value={newAtendimento.obs}
                      onChange={e => setNewAtendimento({...newAtendimento, obs: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-blue-500 font-bold"
                      rows={3}
                    />
                  </div>
                  <button 
                    type="submit"
                    className="w-full py-4 bg-emerald-600 text-white hover:bg-emerald-700 rounded-xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20"
                  >
                    <Plus size={16} /> Registar Atendimento
                  </button>
                </form>
              </div>

              {/* List Column */}
              <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                <h3 className="text-sm font-black uppercase text-slate-800 tracking-wider mb-4">Fila de Atendimento e Histórico</h3>
                <div className="space-y-4">
                  {atendimentos.map(at => (
                    <div key={at.id} className="p-5 border border-slate-100 rounded-2xl bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-3 mb-1.5">
                          <span className="font-black text-xs uppercase text-slate-800">{at.citizen}</span>
                          <span className="text-[8px] font-black uppercase px-2.5 py-0.5 rounded-full bg-slate-200 text-slate-600">{at.dept}</span>
                        </div>
                        <p className="text-xs font-bold text-slate-700 mb-1">{at.subject}</p>
                        <div className="flex items-center gap-3 text-[10px] text-slate-400 font-medium">
                          <span>📞 {at.contact || 'N/A'}</span>
                          <span>✉️ {at.email || 'N/A'}</span>
                          <span>📅 {at.date}</span>
                        </div>
                        {at.obs && <p className="text-[10px] italic text-slate-400 mt-2 bg-white p-2 rounded-lg border border-slate-100">Obs: {at.obs}</p>}
                      </div>
                      <div className="flex items-center gap-2">
                        <select 
                          value={at.status}
                          onChange={(e) => {
                            const updated = atendimentos.map(item => item.id === at.id ? {...item, status: e.target.value} : item);
                            setAtendimentos(updated);
                          }}
                          className={`px-3 py-2 border rounded-xl font-black text-[10px] uppercase tracking-wider ${
                            at.status === 'Concluído' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' :
                            at.status === 'Em atendimento' ? 'bg-purple-100 text-purple-700 border-purple-200' :
                            at.status === 'Em análise' ? 'bg-blue-100 text-blue-700 border-blue-200' :
                            'bg-amber-100 text-amber-700 border-amber-200'
                          }`}
                        >
                          <option value="Recebido">Recebido</option>
                          <option value="Em análise">Em análise</option>
                          <option value="Em atendimento">Em atendimento</option>
                          <option value="Concluído">Concluído</option>
                          <option value="Cancelado">Cancelado</option>
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB: PEDIDOS */}
          {activeTab === 'pedidos' && (
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-sm font-black uppercase text-slate-800 tracking-wider">Pedidos de Documentos & Declarações</h3>
                <button className="px-4 py-2.5 bg-blue-600 text-white rounded-xl font-black text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-md shadow-blue-500/20">
                  <Plus size={14} /> Novo Pedido Manual
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 text-[10px] font-black uppercase text-slate-400 tracking-widest">
                      <th className="py-4">Cidadão</th>
                      <th className="py-4">Documento / Tipo</th>
                      <th className="py-4">Responsável</th>
                      <th className="py-4">Data Submissão</th>
                      <th className="py-4">Estado</th>
                      <th className="py-4">PDF Final</th>
                      <th className="py-4 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 font-bold text-xs text-slate-700">
                    {pedidos.map(p => (
                      <tr key={p.id} className="hover:bg-slate-50/50">
                        <td className="py-4 font-black">{p.citizen}</td>
                        <td className="py-4">{p.type}</td>
                        <td className="py-4 text-slate-400">{p.resp}</td>
                        <td className="py-4 text-slate-400">{p.date}</td>
                        <td className="py-4">
                          <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${
                            p.status === 'Concluído' ? 'bg-emerald-100 text-emerald-700' :
                            p.status === 'Em análise' ? 'bg-blue-100 text-blue-700' :
                            'bg-amber-100 text-amber-700'
                          }`}>
                            {p.status}
                          </span>
                        </td>
                        <td className="py-4">
                          <button className="flex items-center gap-1 text-slate-400 hover:text-blue-600 transition-colors">
                            <FileDown size={14} />
                            <span>{p.file}</span>
                          </button>
                        </td>
                        <td className="py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button 
                              onClick={() => {
                                const updated = pedidos.map(item => item.id === p.id ? {...item, status: 'Concluído'} : item);
                                setPedidos(updated);
                              }}
                              className="p-2 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-100 transition-colors"
                              title="Aprovar e Emitir"
                            >
                              <Check size={14} />
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

          {/* TAB: OCORRENCIAS */}
          {activeTab === 'ocorrencias' && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Form Column */}
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm h-fit">
                  <h3 className="text-sm font-black uppercase text-slate-800 tracking-wider mb-4">Reportar Nova Ocorrência</h3>
                  <form onSubmit={handleAddOcorrencia} className="space-y-4">
                    <div>
                      <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider block mb-1">Tipo de Problema *</label>
                      <select
                        value={newOcorrencia.type}
                        onChange={e => setNewOcorrencia({...newOcorrencia, type: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-blue-500 font-bold"
                      >
                        <option value="Buraco na estrada">Buraco na estrada</option>
                        <option value="Iluminação avariada">Iluminação avariada</option>
                        <option value="Lixo fora do contentor">Lixo / Entulho</option>
                        <option value="Contentor cheio">Contentor Cheio</option>
                        <option value="Árvore caída">Árvore Caída</option>
                        <option value="Fuga de água pública">Fuga de água pública</option>
                        <option value="Animais abandonados">Animais abandonados</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider block mb-1">Localização / Morada *</label>
                      <input 
                        type="text" 
                        required
                        placeholder="Ex: Rua do Cabouco nº 12"
                        value={newOcorrencia.address}
                        onChange={e => setNewOcorrencia({...newOcorrencia, address: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-blue-500 font-bold"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider block mb-1">Prioridade</label>
                        <select
                          value={newOcorrencia.priority}
                          onChange={e => setNewOcorrencia({...newOcorrencia, priority: e.target.value})}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-blue-500 font-bold"
                        >
                          <option value="Baixa">Baixa</option>
                          <option value="Média">Média</option>
                          <option value="Alta">Alta</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider block mb-1">Nome do Cidadão</label>
                        <input 
                          type="text" 
                          required
                          placeholder="Ex: Manuel Silva"
                          value={newOcorrencia.citizen}
                          onChange={e => setNewOcorrencia({...newOcorrencia, citizen: e.target.value})}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-blue-500 font-bold"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider block mb-1">Observações / Detalhes</label>
                      <textarea 
                        placeholder="Descreva o problema observado..."
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-blue-500 font-bold"
                        rows={3}
                      />
                    </div>
                    <button 
                      type="submit"
                      className="w-full py-4 bg-blue-600 text-white hover:bg-blue-700 rounded-xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20"
                    >
                      <Plus size={16} /> Submeter Ocorrência
                    </button>
                  </form>
                </div>

                {/* List Column */}
                <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                  <h3 className="text-sm font-black uppercase text-slate-800 tracking-wider mb-4">Lista de Ocorrências Reportadas</h3>
                  <div className="space-y-4">
                    {ocorrencias.map(oc => (
                      <div key={oc.id} className="p-4 border border-slate-100 rounded-2xl bg-slate-50/50 flex gap-4">
                        <img src={oc.image} className="w-20 h-20 rounded-xl object-cover shrink-0 border border-slate-200" alt="Evidência" />
                        <div className="flex-1 flex flex-col justify-between">
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <h4 className="font-black text-xs uppercase text-slate-800">{oc.type}</h4>
                              <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full ${
                                oc.priority === 'Alta' ? 'bg-red-100 text-red-700' :
                                oc.priority === 'Média' ? 'bg-amber-100 text-amber-700' :
                                'bg-blue-100 text-blue-700'
                              }`}>
                                Prioridade {oc.priority}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500 font-medium mb-1 flex items-center gap-1">
                              <MapPin size={10} className="text-slate-400" /> {oc.address}
                            </p>
                            <p className="text-[10px] text-slate-400 font-medium">Reportado por {oc.citizen} em {oc.date}</p>
                          </div>
                          <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100/60">
                            <span className="text-[10px] text-slate-400 font-bold">Estado da Reparação:</span>
                            <select 
                              value={oc.status}
                              onChange={(e) => {
                                const updated = ocorrencias.map(item => item.id === oc.id ? {...item, status: e.target.value} : item);
                                setOcorrencias(updated);
                              }}
                              className="bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-slate-600 focus:outline-none"
                            >
                              <option value="Recebida">Recebida</option>
                              <option value="Em análise">Em análise</option>
                              <option value="Em execução">Em execução</option>
                              <option value="Resolvida">Resolvida</option>
                              <option value="Cancelada">Cancelada</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: AGUAS */}
          {activeTab === 'aguas' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Leitura e Serviços */}
              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-6 h-fit">
                <div>
                  <h3 className="text-sm font-black uppercase text-slate-800 tracking-wider mb-4">Comunicação de Leitura</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider block mb-1">Nº do Contador</label>
                      <input 
                        type="text" 
                        placeholder="Ex: CT-99023-A"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-blue-500 font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider block mb-1">Valor da Leitura (m³)</label>
                      <input 
                        type="number" 
                        placeholder="Ex: 145"
                        value={kommunikateRead}
                        onChange={e => setKommunikateRead(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-blue-500 font-bold"
                      />
                    </div>
                    <button 
                      onClick={() => {
                        alert('Leitura submetida com sucesso!');
                        setKommunikateRead('');
                      }}
                      className="w-full py-4 bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md shadow-cyan-600/20"
                    >
                      <Check size={16} /> Submeter Leitura
                    </button>
                  </div>
                </div>
                
                <div className="pt-6 border-t border-slate-100">
                  <h3 className="text-xs font-black uppercase text-slate-800 tracking-wider mb-3">Reportar Incidentes de Água</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <button 
                      onClick={() => alert('Incidente de Fuga de Água registado. Equipa técnica alertada.')}
                      className="p-3 bg-red-50 border border-red-100 hover:bg-red-100 text-red-600 rounded-xl text-center text-[10px] font-black uppercase tracking-wider"
                    >
                      Reportar Fuga
                    </button>
                    <button 
                      onClick={() => alert('Incidente de Falta de Água registado. Equipa técnica a verificar reservatórios.')}
                      className="p-3 bg-amber-50 border border-amber-100 hover:bg-amber-100 text-amber-600 rounded-xl text-center text-[10px] font-black uppercase tracking-wider"
                    >
                      Falta de Água
                    </button>
                  </div>
                </div>
              </div>

              {/* Faturas Column */}
              <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                <h3 className="text-sm font-black uppercase text-slate-800 tracking-wider mb-4">Consumo de Água & Faturação</h3>
                <div className="space-y-4">
                  {aguas.map(f => (
                    <div key={f.id} className="p-4 border border-slate-100 rounded-2xl bg-slate-50/50 flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-black text-xs uppercase text-slate-800">{f.period}</span>
                          <span className="text-[8px] font-black uppercase px-2 py-0.5 rounded-full bg-slate-200 text-slate-500">{f.id}</span>
                        </div>
                        <p className="text-[10px] text-slate-400 font-bold">Consumo registado: {f.consumption} • Limite: {f.dueDate}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="font-black text-sm text-slate-800">{f.amount.toFixed(2)}€</span>
                        {f.status === 'Pago' ? (
                          <span className="px-3 py-1.5 bg-emerald-100 text-emerald-700 rounded-xl text-[9px] font-black uppercase tracking-wider">Pago</span>
                        ) : (
                          <button 
                            onClick={() => {
                              setSimulatePaymentId(f.id);
                              setActiveTab('pagamentos');
                            }}
                            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-[9px] font-black uppercase tracking-wider shadow-sm shadow-blue-500/20"
                          >
                            Pagar
                          </button>
                        )}
                        <button className="p-2 text-slate-400 hover:text-blue-600 transition-colors">
                          <FileDown size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB: AGENDAMENTOS */}
          {activeTab === 'agendamentos' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Form Column */}
              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm h-fit">
                <h3 className="text-sm font-black uppercase text-slate-800 tracking-wider mb-4">Nova Marcação Presencial</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider block mb-1">Nome do Cidadão</label>
                    <input 
                      type="text" 
                      placeholder="Ex: Carlos Medeiros"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-blue-500 font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider block mb-1">Serviço Pretendido</label>
                    <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-blue-500 font-bold">
                      <option>Balcão Único - Licenciamentos</option>
                      <option>Ação Social - Atendimento Geral</option>
                      <option>Serviços de Águas - Contrato</option>
                      <option>Reunião com Sr. Presidente</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider block mb-1">Data</label>
                      <input 
                        type="date" 
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-blue-500 font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider block mb-1">Hora</label>
                      <input 
                        type="time" 
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-blue-500 font-bold"
                      />
                    </div>
                  </div>
                  <button 
                    onClick={() => alert('Agendamento registado com envio de lembrete SMS de confirmação para o cidadão.')}
                    className="w-full py-4 bg-purple-600 text-white hover:bg-purple-700 rounded-xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-lg shadow-purple-600/20"
                  >
                    <Check size={16} /> Confirmar Agendamento
                  </button>
                </div>
              </div>

              {/* List Column */}
              <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                <h3 className="text-sm font-black uppercase text-slate-800 tracking-wider mb-4">Agenda do Dia</h3>
                <div className="space-y-4">
                  {agendamentos.map(ag => (
                    <div key={ag.id} className="p-4 border border-slate-100 rounded-2xl bg-slate-50/50 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="px-3.5 py-2.5 bg-purple-100 text-purple-700 rounded-xl text-center">
                          <p className="text-[10px] font-bold tracking-widest leading-none">HORA</p>
                          <span className="font-black text-sm">{ag.time}</span>
                        </div>
                        <div>
                          <h4 className="font-black text-xs uppercase text-slate-800">{ag.citizen}</h4>
                          <p className="text-[10px] text-slate-400 font-bold">{ag.service}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-[9px] font-black uppercase tracking-wider">{ag.status}</span>
                        <button 
                          onClick={() => {
                            const updated = agendamentos.filter(item => item.id !== ag.id);
                            setAgendamentos(updated);
                          }}
                          className="px-2.5 py-1.5 border border-red-200 text-red-500 hover:bg-red-50 rounded-xl text-[9px] font-bold uppercase"
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB: AVISOS */}
          {activeTab === 'avisos' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Form Column */}
              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm h-fit">
                <h3 className="text-sm font-black uppercase text-slate-800 tracking-wider mb-4">Criar Aviso à População</h3>
                <form onSubmit={(e) => {
                  e.preventDefault();
                  if (!newAviso.title || !newAviso.msg) return;
                  const item = {
                    id: avisos.length + 1,
                    title: newAviso.title,
                    category: newAviso.category,
                    msg: newAviso.msg,
                    priority: newAviso.priority,
                    dateStart: newAviso.dateStart || new Date().toISOString().replace('T', ' ').slice(0, 16),
                    dateEnd: newAviso.dateEnd || new Date().toISOString().replace('T', ' ').slice(0, 16)
                  };
                  setAvisos([item, ...avisos]);
                  setNewAviso({ title: '', category: 'Informação Geral', msg: '', priority: 'Média', dateStart: '', dateEnd: '' });
                }} className="space-y-4">
                  <div>
                    <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider block mb-1">Título do Aviso *</label>
                    <input 
                      type="text" 
                      required
                      placeholder="Ex: Interrupção de Trânsito"
                      value={newAviso.title}
                      onChange={e => setNewAviso({...newAviso, title: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-blue-500 font-bold"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider block mb-1">Categoria</label>
                      <select 
                        value={newAviso.category}
                        onChange={e => setNewAviso({...newAviso, category: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-blue-500 font-bold font-sans"
                      >
                        <option value="Trânsito">Trânsito</option>
                        <option value="Água">Abastecimento Água</option>
                        <option value="Obras">Obras Municipais</option>
                        <option value="Proteção Civil">Proteção Civil</option>
                        <option value="Informação Geral">Geral</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider block mb-1">Prioridade</label>
                      <select 
                        value={newAviso.priority}
                        onChange={e => setNewAviso({...newAviso, priority: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-blue-500 font-bold"
                      >
                        <option value="Baixa">Informativo</option>
                        <option value="Média">Aviso Importante</option>
                        <option value="Alta">Urgente / Alerta</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider block mb-1">Mensagem *</label>
                    <textarea 
                      required
                      placeholder="Escreva a mensagem pública..."
                      value={newAviso.msg}
                      onChange={e => setNewAviso({...newAviso, msg: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-blue-500 font-bold"
                      rows={3}
                    />
                  </div>
                  <button 
                    type="submit"
                    className="w-full py-4 bg-blue-600 text-white hover:bg-blue-700 rounded-xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md shadow-blue-500/20"
                  >
                    <Megaphone size={16} /> Publicar Alerta
                  </button>
                </form>
              </div>

              {/* List Column */}
              <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                <h3 className="text-sm font-black uppercase text-slate-800 tracking-wider mb-4">Avisos Publicados na App</h3>
                <div className="space-y-4">
                  {avisos.map(av => (
                    <div key={av.id} className="p-4 border border-slate-100 rounded-2xl bg-slate-50/50">
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-[8px] font-black uppercase px-2.5 py-0.5 rounded-full ${
                          av.priority === 'Alta' ? 'bg-red-100 text-red-700' :
                          av.priority === 'Média' ? 'bg-amber-100 text-amber-700' :
                          'bg-blue-100 text-blue-700'
                        }`}>
                          {av.priority}
                        </span>
                        <span className="text-[10px] text-slate-400 font-bold">{av.dateStart}</span>
                      </div>
                      <h4 className="font-black text-xs uppercase text-slate-800 mb-1">{av.title}</h4>
                      <p className="text-xs text-slate-500 leading-relaxed">{av.msg}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB: EVENTOS */}
          {activeTab === 'eventos' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Form Column */}
              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm h-fit">
                <h3 className="text-sm font-black uppercase text-slate-800 tracking-wider mb-4">Adicionar Evento</h3>
                <form onSubmit={(e) => {
                  e.preventDefault();
                  if (!newEvento.name || !newEvento.place) return;
                  const item = {
                    id: eventos.length + 1,
                    name: newEvento.name,
                    desc: newEvento.desc,
                    place: newEvento.place,
                    date: newEvento.date || '2026-07-15',
                    time: newEvento.time || '15:00',
                    isRegistrationActive: newEvento.isRegistrationActive,
                    image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=400'
                  };
                  setEventos([item, ...eventos]);
                  setNewEvento({ name: '', desc: '', place: '', date: '', time: '', isRegistrationActive: false });
                }} className="space-y-4">
                  <div>
                    <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider block mb-1">Nome do Evento *</label>
                    <input 
                      type="text" 
                      required
                      placeholder="Ex: Concerto de Verão"
                      value={newEvento.name}
                      onChange={e => setNewEvento({...newEvento, name: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-blue-500 font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider block mb-1">Local / Recinto *</label>
                    <input 
                      type="text" 
                      required
                      placeholder="Ex: Polidesportivo"
                      value={newEvento.place}
                      onChange={e => setNewEvento({...newEvento, place: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-blue-500 font-bold"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider block mb-1">Data</label>
                      <input 
                        type="date" 
                        value={newEvento.date}
                        onChange={e => setNewEvento({...newEvento, date: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-blue-500 font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider block mb-1">Hora</label>
                      <input 
                        type="time" 
                        value={newEvento.time}
                        onChange={e => setNewEvento({...newEvento, time: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-blue-500 font-bold"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider block mb-1">Descrição</label>
                    <textarea 
                      placeholder="Resumo do cartaz ou atividade..."
                      value={newEvento.desc}
                      onChange={e => setNewEvento({...newEvento, desc: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-blue-500 font-bold"
                      rows={2}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <input 
                      type="checkbox" 
                      id="reg"
                      checked={newEvento.isRegistrationActive}
                      onChange={e => setNewEvento({...newEvento, isRegistrationActive: e.target.checked})}
                      className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500" 
                    />
                    <label htmlFor="reg" className="text-xs font-bold text-slate-600">Requer Inscrição Prévia</label>
                  </div>
                  <button 
                    type="submit"
                    className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/20"
                  >
                    <Plus size={16} /> Publicar Evento
                  </button>
                </form>
              </div>

              {/* List Column */}
              <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                <h3 className="text-sm font-black uppercase text-slate-800 tracking-wider mb-4">Lista de Eventos Publicados</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {eventos.map(ev => (
                    <div key={ev.id} className="border border-slate-100 rounded-3xl overflow-hidden bg-slate-50/50 hover:shadow-md transition-shadow">
                      <img src={ev.image} className="w-full h-40 object-cover" alt="Cartaz" />
                      <div className="p-4 space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-[9px] font-black text-blue-600 uppercase tracking-wider">📅 {ev.date} às {ev.time}</span>
                          {ev.isRegistrationActive && (
                            <span className="bg-emerald-100 text-emerald-700 text-[8px] font-black uppercase px-2 py-0.5 rounded-full">Inscrições Abertas</span>
                          )}
                        </div>
                        <h4 className="font-black text-xs uppercase text-slate-800 leading-tight">{ev.name}</h4>
                        <p className="text-[11px] text-slate-500 line-clamp-2">{ev.desc}</p>
                        <p className="text-[10px] text-slate-400 font-bold">📍 {ev.place}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB: DOCUMENTOS */}
          {activeTab === 'documentos' && (
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-sm font-black uppercase text-slate-800 tracking-wider">Editais, Atas & Formulários</h3>
                <button className="px-4 py-2.5 bg-blue-600 text-white rounded-xl font-black text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-md shadow-blue-500/20">
                  <Plus size={14} /> Carregar Novo Documento
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {documentos.map(doc => (
                  <div key={doc.id} className="p-5 border border-slate-100 bg-slate-50/50 rounded-2xl flex items-start gap-4">
                    <div className="p-3 bg-blue-100 text-blue-600 rounded-xl shrink-0">
                      <FileText size={24} />
                    </div>
                    <div className="space-y-1">
                      <span className="text-[8px] font-black uppercase px-2 py-0.5 rounded bg-blue-50 text-blue-700">{doc.category}</span>
                      <h4 className="font-black text-xs text-slate-850 leading-snug">{doc.title}</h4>
                      <p className="text-[9px] text-slate-400 font-bold">Publicado em: {doc.date}</p>
                      <button className="text-[10px] text-blue-600 font-black uppercase tracking-wider flex items-center gap-1 mt-2">
                        <FileDown size={12} /> Download PDF
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: MENSAGENS */}
          {activeTab === 'mensagens' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Inbox List */}
              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
                <h3 className="text-sm font-black uppercase text-slate-800 tracking-wider">Caixa de Mensagens</h3>
                <div className="space-y-2">
                  {mensagens.map(msg => (
                    <div key={msg.id} className={`p-4 border rounded-2xl cursor-pointer hover:bg-slate-50 transition-all ${msg.unread ? 'border-blue-200 bg-blue-50/20' : 'border-slate-100'}`}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-black text-xs uppercase text-slate-850">{msg.citizen}</span>
                        <span className="text-[9px] font-bold text-slate-400">{msg.time}</span>
                      </div>
                      <p className="text-xs text-slate-500 font-medium truncate">{msg.lastMsg}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Conversation Area */}
              <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 shadow-sm flex flex-col h-[500px]">
                <div className="p-4 border-b border-slate-150 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-black text-sm uppercase">RA</div>
                  <div>
                    <h4 className="font-black text-xs uppercase text-slate-800">Rita Andrade</h4>
                    <span className="text-[9px] text-slate-400 font-medium">Balcão Geral • Freguesia</span>
                  </div>
                </div>
                
                {/* Scrollable messages */}
                <div className="flex-1 p-6 space-y-4 overflow-y-auto">
                  <div className="flex gap-3 max-w-[80%]">
                    <div className="p-3.5 bg-slate-100 rounded-2xl text-xs font-bold leading-relaxed">
                      Olá, gostaria de saber se é possível levantar o meu atestado no balcão de atendimento esta semana ou se enviam em formato digital assinado digitalmente?
                    </div>
                  </div>
                  <div className="flex gap-3 max-w-[80%] ml-auto justify-end">
                    <div className="p-3.5 bg-blue-600 text-white rounded-2xl text-xs font-bold leading-relaxed">
                      Estimada cidadã Rita Andrade, pode levantar presencialmente ou efetuar o download diretamente do seu atestado digital acedendo à sua Área do Cidadão neste portal assim que o mesmo se encontre em estado 'Concluído'. Esperamos ter ajudado!
                    </div>
                  </div>
                </div>

                <div className="p-4 border-t border-slate-150 flex gap-2">
                  <input 
                    type="text" 
                    placeholder="Escreva a sua resposta..."
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-blue-500 font-bold"
                  />
                  <button className="px-5 bg-blue-600 text-white rounded-xl font-black text-xs uppercase tracking-wider hover:bg-blue-700 transition-colors">
                    Enviar
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB: PAGAMENTOS */}
          {activeTab === 'pagamentos' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Simulator Section */}
              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm h-fit">
                <h3 className="text-sm font-black uppercase text-slate-800 tracking-wider mb-4">Simulador de Cobrança / Taxas</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider block mb-1">Entidade / Fatura a liquidar</label>
                    <input 
                      type="text" 
                      placeholder="Ex: FAT-2026-001"
                      value={simulatePaymentId || ''}
                      onChange={e => setSimulatePaymentId(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-blue-500 font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider block mb-1">Método de Liquidação</label>
                    <div className="grid grid-cols-2 gap-2">
                      {['MBWAY', 'Multibanco', 'Cartão Crédito', 'Transferência'].map(met => (
                        <button
                          key={met}
                          type="button"
                          onClick={() => setPaymentMethod(met)}
                          className={`py-3.5 border rounded-xl text-[10px] font-black uppercase tracking-wider transition-all ${
                            paymentMethod === met 
                              ? 'bg-blue-600 text-white border-blue-600 shadow-md' 
                              : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border-slate-100'
                          }`}
                        >
                          {met}
                        </button>
                      ))}
                    </div>
                  </div>
                  <button 
                    onClick={() => {
                      alert('Simulação efetuada! Código de liquidação gerado e notificação enviada para o smartphone do cidadão.');
                      setSimulatePaymentId(null);
                    }}
                    className="w-full py-4 bg-emerald-600 text-white hover:bg-emerald-700 rounded-xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/20"
                  >
                    <Check size={16} /> Emitir Referência / Link
                  </button>
                </div>
              </div>

              {/* Payments log */}
              <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                <h3 className="text-sm font-black uppercase text-slate-800 tracking-wider mb-4">Transações de Taxas e Licenças</h3>
                <div className="space-y-4">
                  {[
                    { citizen: 'Helena Medeiros', ref: 'Ref. MB: 990-239-012', desc: 'Licenciamento de Obras', amount: 154.00, status: 'Pago' },
                    { citizen: 'Vasco Rego', ref: 'MBWay: 911223344', desc: 'Água e Saneamento - Contrato', amount: 18.50, status: 'Pendente' },
                    { citizen: 'Maria do Carmo', ref: 'Ref. MB: 455-122-901', desc: 'Declaração e Atestado', amount: 5.00, status: 'Pago' }
                  ].map((pay, idx) => (
                    <div key={idx} className="p-4 border border-slate-100 rounded-2xl bg-slate-50/50 flex items-center justify-between">
                      <div>
                        <h4 className="font-black text-xs uppercase text-slate-800">{pay.citizen}</h4>
                        <p className="text-[10px] text-slate-400 font-bold">{pay.desc} • {pay.ref}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="font-black text-sm text-slate-800">{pay.amount.toFixed(2)}€</span>
                        <span className={`px-2.5 py-1 rounded-xl text-[8px] font-black uppercase tracking-wider ${
                          pay.status === 'Pago' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                        }`}>{pay.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB: RELATORIOS */}
          {activeTab === 'relatorios' && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { title: 'Taxa de Resolução Ocorrências', value: '88%' },
                  { title: 'Tempo Médio de Atendimento', value: '14 min' },
                  { title: 'Tempo Médio Resposta Declarações', value: '1.2 Dias' }
                ].map((ind, i) => (
                  <div key={i} className="p-6 bg-white border border-slate-100 rounded-3xl shadow-sm text-center">
                    <p className="text-slate-400 font-bold uppercase text-[9px] tracking-wider mb-2">{ind.title}</p>
                    <span className="text-3xl font-black text-blue-600">{ind.value}</span>
                  </div>
                ))}
              </div>
              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                <h3 className="text-sm font-black uppercase text-slate-800 tracking-wider mb-4">Relatório Anual de Consumo de Água & Resíduos</h3>
                <div className="h-64 flex items-end justify-between gap-2 pt-6 border-b border-slate-100">
                  {[45, 60, 55, 75, 90, 85, 110, 95, 80, 100, 115, 120].map((val, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-2">
                      <div className="w-full bg-blue-600 rounded-t-lg transition-all hover:bg-emerald-500 cursor-pointer" style={{ height: `${val * 1.5}px` }} />
                      <span className="text-[9px] font-bold text-slate-400 uppercase">{['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'][i]}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB: AREA DO CIDADAO */}
          {activeTab === 'cidadao' && (
            <div className="max-w-2xl mx-auto bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
              {/* Smartphone Frame Header */}
              <div className="bg-slate-900 px-6 py-4 flex items-center justify-between text-white">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                </div>
                <span className="text-[10px] font-black tracking-widest text-slate-400">ÁREA DO CIDADÃO - APP</span>
                <span className="text-[10px] font-bold text-slate-400">9:41 AM</span>
              </div>

              {/* Simulation Header */}
              <div className="bg-gradient-to-r from-blue-700 to-indigo-800 p-6 text-white">
                <h3 className="text-lg font-black uppercase tracking-tight">Portal Virtual do Cidadão</h3>
                <p className="text-[11px] text-white/70 font-medium">Benvindo ao balcão virtual de {business.name}.</p>
              </div>

              {/* Simulation Screen Content */}
              <div className="p-6 space-y-6">
                {citizenAreaView === 'menu' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <button 
                        onClick={() => setCitizenAreaView('requests')}
                        className="p-5 border border-slate-100 rounded-2xl bg-slate-50 hover:bg-slate-100 flex flex-col items-center gap-3 transition-all"
                      >
                        <FileText className="text-blue-600" size={24} />
                        <span className="text-[10px] font-black uppercase tracking-wide">Pedir Declarações</span>
                      </button>
                      
                      <button 
                        onClick={() => setCitizenAreaView('water')}
                        className="p-5 border border-slate-100 rounded-2xl bg-slate-50 hover:bg-slate-100 flex flex-col items-center gap-3 transition-all"
                      >
                        <Droplet className="text-cyan-600" size={24} />
                        <span className="text-[10px] font-black uppercase tracking-wide">Minhas Águas</span>
                      </button>

                      <button 
                        onClick={() => setCitizenAreaView('occurrences')}
                        className="p-5 border border-slate-100 rounded-2xl bg-slate-50 hover:bg-slate-100 flex flex-col items-center gap-3 transition-all"
                      >
                        <AlertTriangle className="text-amber-500" size={24} />
                        <span className="text-[10px] font-black uppercase tracking-wide">Minhas Ocorrências</span>
                      </button>

                      <button 
                        onClick={() => setCitizenAreaView('schedule')}
                        className="p-5 border border-slate-100 rounded-2xl bg-slate-50 hover:bg-slate-100 flex flex-col items-center gap-3 transition-all"
                      >
                        <Calendar className="text-purple-600" size={24} />
                        <span className="text-[10px] font-black uppercase tracking-wide">Agendar Serviço</span>
                      </button>
                    </div>

                    {/* App Avisos Section */}
                    <div className="p-4 bg-red-50 border border-red-100 rounded-2xl">
                      <div className="flex items-center gap-2 mb-1.5 text-red-700">
                        <Megaphone size={14} />
                        <span className="text-[10px] font-black uppercase tracking-wider">Aviso de Última Hora</span>
                      </div>
                      <p className="text-[11px] font-bold text-red-650">Corte de Água previsto para amanhã na Freguesia das 09h00 às 13h00.</p>
                    </div>
                  </div>
                )}

                {citizenAreaView === 'requests' && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h4 className="font-black text-xs uppercase text-slate-800">Pedir Declaração/Atestado</h4>
                      <button onClick={() => setCitizenAreaView('menu')} className="text-[10px] font-black text-blue-600 uppercase">Voltar</button>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <label className="text-[8px] font-black text-slate-400 uppercase tracking-wider block mb-1">Tipo de Atestado/Declaração</label>
                        <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold focus:outline-none">
                          <option>Atestado de residência</option>
                          <option>Declaração de agregado familiar</option>
                          <option>Declaração de agregado e vida</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[8px] font-black text-slate-400 uppercase tracking-wider block mb-1">Nome Completo</label>
                        <input type="text" placeholder="Seu nome completo" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold focus:outline-none" />
                      </div>
                      <div>
                        <label className="text-[8px] font-black text-slate-400 uppercase tracking-wider block mb-1">Finalidade</label>
                        <input type="text" placeholder="Fins fiscais, bancários, etc." className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold focus:outline-none" />
                      </div>
                      <button 
                        onClick={() => {
                          alert('Pedido de atestado submetido com sucesso! Será notificado assim que for emitido pelo funcionário responsável.');
                          setCitizenAreaView('menu');
                        }}
                        className="w-full py-3 bg-blue-600 text-white rounded-xl font-black text-[11px] uppercase tracking-wider"
                      >
                        Submeter Pedido
                      </button>
                    </div>
                  </div>
                )}

                {citizenAreaView === 'water' && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h4 className="font-black text-xs uppercase text-slate-800">Minhas Faturas & Leituras</h4>
                      <button onClick={() => setCitizenAreaView('menu')} className="text-[10px] font-black text-blue-600 uppercase">Voltar</button>
                    </div>
                    <div className="space-y-2">
                      <div className="p-3 border border-slate-100 rounded-xl bg-slate-50 flex justify-between items-center">
                        <div>
                          <p className="text-[10px] font-black text-slate-800">Fatura Maio 2026</p>
                          <span className="text-[9px] text-slate-400 font-bold">CT-99023-A • Vence em 15-07-2026</span>
                        </div>
                        <span className="text-[11px] font-black text-slate-800">18.50€</span>
                      </div>
                    </div>
                  </div>
                )}

                {citizenAreaView === 'occurrences' && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h4 className="font-black text-xs uppercase text-slate-800">Reportar Ocorrência à Junta/Município</h4>
                      <button onClick={() => setCitizenAreaView('menu')} className="text-[10px] font-black text-blue-600 uppercase">Voltar</button>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <label className="text-[8px] font-black text-slate-400 uppercase tracking-wider block mb-1">Tipo de Avaria</label>
                        <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold focus:outline-none">
                          <option>Iluminação pública fundida</option>
                          <option>Buraco na via pública</option>
                          <option>Sinal de trânsito danificado</option>
                          <option>Acumulação inadequada de resíduos</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[8px] font-black text-slate-400 uppercase tracking-wider block mb-1">Foto da Ocorrência</label>
                        <div className="w-full border-2 border-dashed border-slate-200 rounded-xl py-6 text-center text-[10px] text-slate-400 font-black cursor-pointer hover:border-blue-500">
                          + TIRAR OU CARREGAR FOTO
                        </div>
                      </div>
                      <button 
                        onClick={() => {
                          alert('Ocorrência reportada com sucesso! Equipa técnica municipal recebeu o alerta geo-referenciado.');
                          setCitizenAreaView('menu');
                        }}
                        className="w-full py-3 bg-blue-600 text-white rounded-xl font-black text-[11px] uppercase tracking-wider"
                      >
                        Submeter Ocorrência
                      </button>
                    </div>
                  </div>
                )}

                {citizenAreaView === 'schedule' && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h4 className="font-black text-xs uppercase text-slate-800">Agendar Atendimento Presencial</h4>
                      <button onClick={() => setCitizenAreaView('menu')} className="text-[10px] font-black text-blue-600 uppercase">Voltar</button>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <label className="text-[8px] font-black text-slate-400 uppercase tracking-wider block mb-1">Serviço Pretendido</label>
                        <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold focus:outline-none">
                          <option>Licenciamentos / Urbanismo</option>
                          <option>Ação Social</option>
                          <option>Gabinete de Apoio Jurídico</option>
                        </select>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <input type="date" className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none" />
                        <input type="time" className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none" />
                      </div>
                      <button 
                        onClick={() => {
                          alert('Marcação realizada! Receberá um lembrete SMS 24h antes do seu agendamento.');
                          setCitizenAreaView('menu');
                        }}
                        className="w-full py-3 bg-blue-600 text-white rounded-xl font-black text-[11px] uppercase tracking-wider"
                      >
                        Agendar Atendimento
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB: DEFINICOES */}
          {activeTab === 'definicoes' && (
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm max-w-2xl mx-auto space-y-6">
              <h3 className="text-sm font-black uppercase text-slate-800 tracking-wider">Configurações do Balcão Virtual</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider block mb-1">Nome do Município/Freguesia</label>
                    <input type="text" defaultValue={business.name} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-blue-500 font-bold" />
                  </div>
                  <div>
                    <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider block mb-1">Telefone Principal</label>
                    <input type="text" defaultValue={business.phone || '296000000'} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-blue-500 font-bold" />
                  </div>
                </div>
                <div>
                  <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider block mb-1">Email Geral de Contacto</label>
                  <input type="email" defaultValue={business.publicEmail || 'geral@municipio.pt'} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-blue-500 font-bold" />
                </div>
                <div>
                  <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider block mb-1">Google Maps Link</label>
                  <input type="text" defaultValue={(business as any).mapUrl || (business as any).mapsUrl || ''} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-blue-500 font-bold" />
                </div>
                <button 
                  onClick={() => alert('Definições atualizadas e publicadas com sucesso no sistema principal.')}
                  className="w-full py-4 bg-blue-600 text-white rounded-xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md shadow-blue-500/20"
                >
                  Guardar Configurações
                </button>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
};
