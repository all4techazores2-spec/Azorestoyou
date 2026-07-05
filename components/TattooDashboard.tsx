import React, { useState, useEffect } from 'react';
import { Restaurant } from '../types';
import {
  LogOut, Bell, Search, Plus, ChevronRight, Calendar, Users,
  Clock, Star, Settings, Menu, X, Home, MessageSquare,
  BarChart3, CreditCard, Package, Layers, Image as ImageIcon,
  ShoppingCart, FileText, Award, User, ChevronLeft,
  ArrowRight, Clock3, Sparkles, Zap, TrendingUp, DollarSign,
  Cloud, Sun, CloudRain, CloudLightning, MapPin, Paintbrush,
  CheckCircle, MessageCircle, AlertTriangle, Send, Sliders, Moon, Wine, Music
} from 'lucide-react';
import { API_BASE_URL } from '../config';

interface TattooDashboardProps {
  business: Restaurant;
  onUpdateBusiness: (updated: Restaurant) => void;
  onLogout: () => void;
}

// Design Tokens (exact dark premium system)
const C = {
  bg: '#0E1014',
  card: '#171A20',
  hover: '#1E222B',
  border: '#2A2F39',
  text: '#F8F8F8',
  muted: '#A0A4AE',
  gold: '#C9A66B',
  goldHover: '#E1C28A',
  green: '#32D583',
  orange: '#F59E0B',
  red: '#EF4444',
  blue: '#2D6DF6',
};

const STATE_COLORS: Record<string, { bg: string; text: string }> = {
  'Enviado': { bg: 'rgba(45,109,246,0.15)', text: C.blue },
  'Em análise': { bg: 'rgba(245,158,11,0.15)', text: C.orange },
  'Alterações solicitadas': { bg: 'rgba(239,68,68,0.15)', text: C.red },
  'Proposta enviada': { bg: 'rgba(201,166,107,0.15)', text: C.gold },
  'Aceite pelo cliente': { bg: 'rgba(50,213,131,0.15)', text: C.green },
  'Sinal pago': { bg: 'rgba(50,213,131,0.25)', text: C.green },
  'Reserva criada': { bg: 'rgba(168,85,247,0.15)', text: '#A855F7' },
  'Concluído': { bg: 'rgba(16,185,129,0.2)', text: '#10B981' },
  'Cancelado': { bg: 'rgba(156,163,175,0.15)', text: '#9CA3AF' }
};

interface WeatherData { temp: number; conditionCode: number; windSpeed: number; humidity: number; locationName: string; }

type TabId = 
  | 'dashboard' | 'projects' | 'agenda' | 'clients' | 'projects_archive' 
  | 'artists' | 'gallery' | 'pos' | 'quotes' | 'payments' | 'products' 
  | 'stock' | 'messages' | 'reviews' | 'marketing' | 'reports' | 'settings';

const TattooDashboard: React.FC<TattooDashboardProps> = ({
  business,
  onUpdateBusiness,
  onLogout
}) => {
  const [activeTab, setActiveTab] = useState<TabId>('dashboard');
  const [projects, setProjects] = useState<any[]>([]);
  const [selectedProject, setSelectedProject] = useState<any | null>(null);
  const [chatMessage, setChatMessage] = useState('');
  const [proposalText, setProposalText] = useState('');
  const [changesText, setChangesText] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [recentActivities, setRecentActivities] = useState<any[]>([]);

  // Time & Weather
  const [time, setTime] = useState('');
  const [dateFull, setDateFull] = useState('');
  const [weather, setWeather] = useState<WeatherData | null>(null);

  // Stats Counters
  const [kpis, setKpis] = useState({
    newProjectsCount: 0,
    todaysReservations: 2,
    todaysRevenue: 150,
    nextClientName: 'Lucas Andrade'
  });

  const studioName = business.name || 'Estúdio Premium';
  const studioCity = business.island || 'Ponta Delgada';

  // Weather descriptions
  const getWeatherDesc = (code: number) => {
    if (code === 0) return 'Céu Limpo';
    if (code >= 1 && code <= 3) return 'Poucas Nuvens';
    if (code >= 61 && code <= 65) return 'Chuva';
    if (code >= 95) return 'Trovoada';
    return 'Nublado';
  };

  // Clock
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' }));
      setDateFull(now.toLocaleDateString('pt-PT', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }));
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  // Weather polling
  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const r = await fetch('https://api.open-meteo.com/v1/forecast?latitude=37.7412&longitude=-25.6756&current=temperature_2m,weather_code,wind_speed_10m,relative_humidity_2m&timezone=auto');
        if (r.ok) {
          const d = await r.json();
          setWeather({
            temp: Math.round(d.current.temperature_2m),
            conditionCode: d.current.weather_code,
            windSpeed: d.current.wind_speed_10m,
            humidity: d.current.relative_humidity_2m,
            locationName: studioCity
          });
        }
      } catch (e) {
        console.error(e);
      }
    };
    fetchWeather();
    const interval = setInterval(fetchWeather, 600000); // 10 min
    return () => clearInterval(interval);
  }, [studioCity]);

  // Fetch Projects and calculate feeds
  const fetchProjects = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/tattoo_projects`);
      if (response.ok) {
        const data = await response.json();
        // Filter projects for this studio that are NOT Rascunho
        const studioProjects = data.filter((p: any) => 
          p.business_id === business.id && p.status !== 'Rascunho'
        );
        setProjects(studioProjects);

        // Calculate KPIs
        const newCount = studioProjects.filter((p: any) => p.status === 'Enviado').length;
        const paidCount = studioProjects.filter((p: any) => p.status === 'Sinal pago').length;
        const activeReservations = studioProjects.filter((p: any) => p.status === 'Reserva criada').length;

        // Next Client name
        const nextClient = studioProjects.find((p: any) => p.status === 'Reserva criada' || p.status === 'Aceite pelo cliente')?.client_name || 'Nenhum';

        setKpis({
          newProjectsCount: newCount,
          todaysReservations: activeReservations,
          todaysRevenue: paidCount * 50 + activeReservations * 100,
          nextClientName: nextClient
        });

        // Sync active selection
        if (selectedProject) {
          const fresh = studioProjects.find((p: any) => p.id === selectedProject.id);
          if (fresh) setSelectedProject(fresh);
        }

        // Build recent activities feed
        const activityList: any[] = [];
        studioProjects.forEach((p: any) => {
          if (p.history) {
            p.history.forEach((h: any) => {
              activityList.push({
                projectCode: p.project_code,
                projectTitle: p.title,
                clientName: p.client_name,
                action: h.action,
                date: h.date,
                status: p.status
              });
            });
          }
        });
        activityList.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setRecentActivities(activityList.slice(0, 10));
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchProjects();
    const interval = setInterval(fetchProjects, 10000); // Poll every 10 seconds (preparing for socket/sse)
    return () => clearInterval(interval);
  }, [business.id]);

  const handleUpdateStatus = async (id: string, newStatus: string, actionMsg: string, extraPayload: any = {}) => {
    const target = projects.find(p => p.id === id);
    if (!target) return;

    const updated = {
      ...target,
      status: newStatus,
      updated_at: new Date().toISOString(),
      history: [...(target.history || []), { id: `hist_${Date.now()}`, action: actionMsg, date: new Date().toISOString() }],
      ...extraPayload
    };

    try {
      const response = await fetch(`${API_BASE_URL}/api/tattoo_projects/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      });
      if (response.ok) {
        setProjects(prev => prev.map(p => p.id === id ? updated : p));
        setSelectedProject(updated);
        fetchProjects();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSendChatMessage = async () => {
    if (!chatMessage.trim() || !selectedProject) return;
    const newMsg = {
      id: `msg_${Date.now()}`,
      sender_id: business.id,
      sender_type: 'studio',
      message: chatMessage,
      attachments: [],
      created_at: new Date().toISOString(),
      read_by: [business.id]
    };
    const updated = {
      ...selectedProject,
      messages: [...(selectedProject.messages || []), newMsg],
      updated_at: new Date().toISOString(),
      history: [...(selectedProject.history || []), { id: `hist_${Date.now()}`, action: 'Mensagem enviada pelo estúdio', date: new Date().toISOString() }]
    };

    try {
      const response = await fetch(`${API_BASE_URL}/api/tattoo_projects/${selectedProject.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      });
      if (response.ok) {
        setSelectedProject(updated);
        setProjects(prev => prev.map(p => p.id === selectedProject.id ? updated : p));
        setChatMessage('');
        fetchProjects();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const menuItems: { id: TabId; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <Home size={18} /> },
    { id: 'projects', label: 'Projetos de Tatuagem', icon: <Paintbrush size={18} />, badge: kpis.newProjectsCount || undefined },
    { id: 'agenda', label: 'Agenda', icon: <Calendar size={18} /> },
    { id: 'clients', label: 'Clientes', icon: <Users size={18} /> },
    { id: 'projects_archive', label: 'Projetos', icon: <Layers size={18} /> },
    { id: 'artists', label: 'Artistas', icon: <Award size={18} /> },
    { id: 'gallery', label: 'Galeria', icon: <ImageIcon size={18} /> },
    { id: 'pos', label: 'POS Vendas', icon: <ShoppingCart size={18} /> },
    { id: 'quotes', label: 'Orçamentos', icon: <FileText size={18} /> },
    { id: 'payments', label: 'Pagamentos', icon: <CreditCard size={18} /> },
    { id: 'products', label: 'Produtos', icon: <Package size={18} /> },
    { id: 'stock', label: 'Stock', icon: <BarChart3 size={18} /> },
    { id: 'messages', label: 'Mensagens', icon: <MessageSquare size={18} />, badge: 2 },
    { id: 'reviews', label: 'Avaliações', icon: <Star size={18} /> },
    { id: 'marketing', label: 'Marketing', icon: <Zap size={18} /> },
    { id: 'reports', label: 'Relatórios', icon: <TrendingUp size={18} /> },
    { id: 'settings', label: 'Definições', icon: <Settings size={18} /> }
  ];

  const placeholderContent: Record<TabId, { label: string; icon: React.ReactNode }> = {
    dashboard: { label: 'Dashboard', icon: <Home size={32} /> },
    projects: { label: 'Projetos de Tatuagem', icon: <Paintbrush size={32} /> },
    agenda: { label: 'Agenda', icon: <Calendar size={32} /> },
    clients: { label: 'Clientes', icon: <Users size={32} /> },
    projects_archive: { label: 'Projetos Arquivados', icon: <Layers size={32} /> },
    artists: { label: 'Artistas', icon: <Award size={32} /> },
    gallery: { label: 'Galeria', icon: <ImageIcon size={32} /> },
    pos: { label: 'POS Vendas', icon: <ShoppingCart size={32} /> },
    quotes: { label: 'Orçamentos', icon: <FileText size={32} /> },
    payments: { label: 'Pagamentos', icon: <CreditCard size={32} /> },
    products: { label: 'Produtos', icon: <Package size={32} /> },
    stock: { label: 'Stock', icon: <BarChart3 size={32} /> },
    messages: { label: 'Mensagens', icon: <MessageSquare size={32} /> },
    reviews: { label: 'Avaliações', icon: <Star size={32} /> },
    marketing: { label: 'Marketing', icon: <Zap size={32} /> },
    reports: { label: 'Relatórios', icon: <TrendingUp size={32} /> },
    settings: { label: 'Definições', icon: <Settings size={32} /> }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: C.bg, fontFamily: "'Inter', -apple-system, sans-serif", color: C.text }}>
      
      {/* Sidebar */}
      {sidebarOpen && (
        <aside style={{ width: 260, background: C.card, borderRight: `1px solid ${C.border}`, display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
          {/* Brand header */}
          <div style={{ padding: 24, borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ background: `${C.gold}20`, padding: 8, borderRadius: 12, display: 'flex', color: C.gold }}><Paintbrush size={20} /></span>
            <div style={{ fontSize: 15, fontWeight: 900, letterSpacing: -0.3 }}>{studioName}</div>
          </div>

          {/* Navigation Links */}
          <nav style={{ flex: 1, padding: 16, display: 'flex', flexDirection: 'column', gap: 4, overflowY: 'auto' }}>
            {menuItems.map(item => (
              <button 
                key={item.id} 
                onClick={() => setActiveTab(item.id)} 
                style={{ 
                  display: 'flex', alignItems: 'center', gap: 12, padding: '11px 16px', borderRadius: 12, 
                  background: activeTab === item.id ? `${C.gold}15` : 'transparent', color: activeTab === item.id ? C.gold : C.muted, 
                  border: 0, cursor: 'pointer', textAlign: 'left', fontWeight: 800, fontSize: 13, transition: 'all 0.15s' 
                }}
              >
                {item.icon} 
                <span style={{ flex: 1 }}>{item.label}</span>
                {item.badge && (
                  <span style={{ fontSize: 9, fontWeight: 900, background: C.gold, color: C.bg, padding: '2px 6px', borderRadius: 6 }}>{item.badge}</span>
                )}
              </button>
            ))}
          </nav>

          {/* Sidebar Footer */}
          <div style={{ padding: 16, borderTop: `1px solid ${C.border}`, display: 'flex', flexDirection: 'column', gap: 4 }}>
            <button style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 16px', background: 'transparent', border: 0, color: C.muted, cursor: 'pointer', fontSize: 12, fontWeight: 700 }}><User size={16} /> Perfil</button>
            <button style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 16px', background: 'transparent', border: 0, color: C.muted, cursor: 'pointer', fontSize: 12, fontWeight: 700 }}><Settings size={16} /> Configurações</button>
            <button onClick={onLogout} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 16px', background: 'transparent', border: 0, color: C.red, cursor: 'pointer', fontSize: 12, fontWeight: 800 }}><LogOut size={16} /> Terminar Sessão</button>
          </div>
        </aside>
      )}

      {/* Main Workspace */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        
        {/* Header */}
        <header style={{ height: 70, borderBottom: `1px solid ${C.border}`, padding: '0 26px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: C.card, flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ background: 'transparent', border: 0, color: C.text, cursor: 'pointer' }}><Menu size={22} /></button>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: C.bg, border: `1px solid ${C.border}`, borderRadius: 12, padding: '6px 12px', width: 220 }}>
              <Search size={16} color={C.muted} />
              <input type="text" placeholder="Procurar projeto..." style={{ background: 'transparent', border: 0, outline: 'none', color: C.text, fontSize: 12, width: '100%' }} />
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <button style={{ padding: '8px 16px', background: `${C.gold}18`, border: `1px solid ${C.gold}30`, borderRadius: 12, color: C.gold, fontSize: 11, fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
              <Plus size={14} /> Nova Marcação
            </button>
            <Bell size={20} color={C.muted} style={{ cursor: 'pointer' }} />
            <MessageSquare size={20} color={C.muted} style={{ cursor: 'pointer' }} />
            <div style={{ width: 36, height: 36, borderRadius: 12, background: C.hover, border: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 850 }}>A</div>
          </div>
        </header>

        {/* Content Viewport */}
        <div style={{ flex: 1, overflowY: 'auto', padding: 26 }}>
          
          {/* TAB 1: Premium Dashboard Home */}
          {activeTab === 'dashboard' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              
              {/* Top Banner Slider & Digital Card */}
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20 }}>
                {/* Visual Banner */}
                <div style={{ height: 200, borderRadius: 24, overflow: 'hidden', relative: true, border: `1px solid ${C.border}` }}>
                  <img src="https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=1400&q=80" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                {/* Floating Clock & Weather Card */}
                <div style={{ background: `linear-gradient(135deg, ${C.card} 0%, #1f232c 100%)`, borderRadius: 24, padding: 22, border: `1px solid ${C.border}`, display: 'flex', flexDirection: 'column', justify: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justify: 'between', borderBottom: `1px solid ${C.border}`, pb: 10, mb: 10 }}>
                    <div style={{ fontSize: 11, fontWeight: 900, color: C.gold, uppercase: true }}>AzoresToYou Time</div>
                    <MapPin size={16} color={C.gold} />
                  </div>
                  <div style={{ fontSize: 32, fontWeight: 900, color: C.text, letterSpacing: -1 }}>{time || '14:35'}</div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: 'capitalize', marginTop: 4 }}>{dateFull || 'Domingo, 5 de Julho'}</div>
                  {weather ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 12, paddingTop: 10, borderTop: `1px solid ${C.border}50` }}>
                      <span style={{ fontSize: 18 }}>☀️</span>
                      <div>
                        <div style={{ fontSize: 12, fontWeight: 800 }}>{weather.temp}°C · {getWeatherDesc(weather.conditionCode)}</div>
                        <div style={{ fontSize: 10, color: C.muted }}>Humidade: {weather.humidity}% · {weather.locationName}</div>
                      </div>
                    </div>
                  ) : (
                    <div style={{ fontSize: 10, color: C.muted, marginTop: 10 }}>A carregar meteorologia...</div>
                  )}
                </div>
              </div>

              {/* KPI Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
                {[
                  { label: 'Pedidos Novos', val: kpis.newProjectsCount, icon: <Paintbrush size={22} color={C.blue} />, color: C.blue },
                  { label: 'Marcações Hoje', val: kpis.todaysReservations, icon: <Calendar size={22} color={C.gold} />, color: C.gold },
                  { label: 'Receita Hoje', val: `${kpis.todaysRevenue}€`, icon: <DollarSign size={22} color={C.green} />, color: C.green },
                  { label: 'Próximo Cliente', val: kpis.nextClientName, icon: <User size={22} color={C.orange} />, color: C.orange }
                ].map((k, i) => (
                  <div key={i} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 20, padding: 20, display: 'flex', alignItems: 'center', gap: 16 }}>
                    <span style={{ background: `${k.color}15`, padding: 12, borderRadius: 14, display: 'flex' }}>{k.icon}</span>
                    <div>
                      <p style={{ fontSize: 11, fontWeight: 700, color: C.muted }}>{k.label}</p>
                      <h3 style={{ fontSize: 20, fontWeight: 900, color: C.text, marginTop: 2 }}>{k.val}</h3>
                    </div>
                  </div>
                ))}
              </div>

              {/* Overview sections */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 20 }}>
                {/* Left columns */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  
                  {/* Pedidos Pendentes (Projects list) */}
                  <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 24, padding: 22 }}>
                    <div style={{ display: 'flex', justify: 'between', mb: 16 }}>
                      <div style={{ fontSize: 15, fontWeight: 900 }}>Projetos de Tatuagem Recebidos</div>
                      <button onClick={() => setActiveTab('projects')} style={{ background: 'transparent', border: 0, color: C.gold, fontSize: 11, fontWeight: 800, cursor: 'pointer' }}>Ver Todos</button>
                    </div>

                    {projects.length === 0 ? (
                      <div style={{ textAlign: 'center', padding: '30px 0', color: C.muted, fontSize: 12 }}>Nenhum projeto recebido nos servidores.</div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        {projects.slice(0, 3).map(p => {
                          const st = STATE_COLORS[p.status] || STATE_COLORS.Enviado;
                          return (
                            <div key={p.id} style={{ display: 'flex', items: 'center', gap: 12, padding: 12, background: C.bg, border: `1px solid ${C.border}`, borderRadius: 16 }}>
                              <img src={p.client_photo} alt="" style={{ width: 44, height: 44, borderRadius: 10, objectFit: 'cover' }} />
                              <div>
                                <h4 style={{ fontSize: 13, fontWeight: 900 }}>{p.title}</h4>
                                <p style={{ fontSize: 10, color: C.muted }}>{p.client_name} · {p.body_zone} · {p.project_code}</p>
                              </div>
                              <span style={{ marginLeft: 'auto', fontSize: 9, fontWeight: 900, background: st.bg, color: st.text, padding: '3px 8px', borderRadius: 6 }}>{p.status}</span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Agenda de Hoje */}
                  <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 24, padding: 22 }}>
                    <div style={{ fontSize: 15, fontWeight: 900, marginBottom: 14 }}>Agenda de Hoje</div>
                    <div style={{ fontSize: 11, color: C.muted, py: 10, textAlign: 'center' }}>Nenhum agendamento marcado para o dia de hoje.</div>
                  </div>
                </div>

                {/* Right Columns */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  {/* Real-time Recent Activity feed */}
                  <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 24, padding: 22 }}>
                    <div style={{ fontSize: 15, fontWeight: 900, marginBottom: 14 }}>Atividade Recente (Tempo Real)</div>
                    {recentActivities.length === 0 ? (
                      <p style={{ fontSize: 11, color: C.muted, textAlign: 'center', py: 20 }}>Nenhum registo de atividade recente.</p>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxHeight: 220, overflowY: 'auto' }}>
                        {recentActivities.map((act, index) => (
                          <div key={index} style={{ borderBottom: `1px solid ${C.border}30`, pb: 8, fontSize: 11 }}>
                            <div style={{ display: 'flex', justify: 'between', fontWeight: 800 }}>
                              <span style={{ color: C.gold }}>{act.clientName}</span>
                              <span style={{ fontSize: 9, color: C.muted }}>{new Date(act.date).toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                            <p style={{ color: C.text, marginTop: 2 }}>{act.action} em <strong style={{ color: C.gold }}>{act.projectTitle}</strong></p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Quick actions panel */}
                  <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 24, padding: 22 }}>
                    <div style={{ fontSize: 15, fontWeight: 900, marginBottom: 14 }}>Ações Rápidas</div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                      <button onClick={() => setActiveTab('projects')} style={{ padding: 12, background: C.bg, border: `1px solid ${C.border}`, color: C.text, borderRadius: 12, fontSize: 11, fontWeight: 800, cursor: 'pointer' }}>Gerir Projetos</button>
                      <button onClick={() => setActiveTab('agenda')} style={{ padding: 12, background: C.bg, border: `1px solid ${C.border}`, color: C.text, borderRadius: 12, fontSize: 11, fontWeight: 800, cursor: 'pointer' }}>Abrir Agenda</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Tattoo Projects list and details workspace */}
          {activeTab === 'projects' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: 20, height: 'calc(100vh - 170px)' }}>
              
              {/* List */}
              <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 24, padding: 16, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ fontSize: 14, fontWeight: 900, marginBottom: 6 }}>Projetos Disponíveis ({projects.length})</div>
                {projects.map(p => {
                  const badge = STATE_COLORS[p.status] || STATE_COLORS.Enviado;
                  return (
                    <button 
                      key={p.id}
                      onClick={() => {
                        setSelectedProject(p);
                        setProposalText(p.proposal || '');
                        setChangesText('');
                      }}
                      style={{ 
                        width: '100%', textAlign: 'left', padding: 12, border: selectedProject?.id === p.id ? `1.5px solid ${C.gold}` : `1px solid ${C.border}`,
                        borderRadius: 14, background: selectedProject?.id === p.id ? `${C.gold}08` : C.bg, color: C.text, cursor: 'pointer', transition: 'all 0.2s',
                        display: 'flex', gap: 10
                      }}
                    >
                      <div style={{ width: 44, height: 44, borderRadius: 10, overflow: 'hidden', background: C.card, flexShrink: 0 }}>
                        <img src={p.client_photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, fontWeight: 850 }}>
                          <span style={{ color: C.gold }}>{p.project_code}</span>
                          <span style={{ background: badge.bg, color: badge.text, padding: '2px 6px', borderRadius: 4 }}>{p.status}</span>
                        </div>
                        <div style={{ fontSize: 12, fontWeight: 800, marginTop: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.title}</div>
                        <div style={{ fontSize: 10, color: C.muted, marginTop: 2 }}>{p.client_name} · {p.body_zone}</div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Workspace */}
              <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 24, padding: 22, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 20 }}>
                {selectedProject ? (
                  <>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: `1px solid ${C.border}`, paddingBottom: 16 }}>
                      <div>
                        <div style={{ fontSize: 18, fontWeight: 900 }}>{selectedProject.title}</div>
                        <p style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>Código: {selectedProject.project_code} · Cliente: {selectedProject.client_name}</p>
                      </div>
                      <span style={{ fontSize: 10, fontWeight: 900, background: (STATE_COLORS[selectedProject.status] || STATE_COLORS.Enviado).bg, color: (STATE_COLORS[selectedProject.status] || STATE_COLORS.Enviado).text, padding: '6px 12px', borderRadius: 8, height: 'fit-content' }}>
                        {selectedProject.status}
                      </span>
                    </div>

                    {/* Previews grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                      <div>
                        <span style={{ fontSize: 9, fontWeight: 900, color: C.muted, uppercase: true }}>Versão Selecionada</span>
                        <div style={{ aspectRatio: '1', borderRadius: 14, overflow: 'hidden', border: `1px solid ${C.border}`, background: C.bg, position: 'relative' }}>
                          <img src={selectedProject.client_photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          {selectedProject.selected_preview?.tattooPng && (
                            <img src={selectedProject.selected_preview.tattooPng} alt="" style={{
                              position: 'absolute',
                              width: '40%',
                              left: '30%',
                              top: '30%',
                              transform: `rotate(${selectedProject.selected_preview.canvasState.rotation}deg) scaleX(${selectedProject.selected_preview.canvasState.mirror ? -1 : 1})`,
                              mixBlendMode: 'multiply',
                              opacity: selectedProject.selected_preview.canvasState.opacity
                            }} />
                          )}
                        </div>
                      </div>

                      <div>
                        <span style={{ fontSize: 9, fontWeight: 900, color: C.muted, uppercase: true }}>Tatuagem Referência</span>
                        <div style={{ aspectRatio: '1', borderRadius: 14, overflow: 'hidden', border: `1px solid ${C.border}`, background: C.bg }}>
                          <img src={selectedProject.tattoo_png} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                      </div>

                      <div>
                        <span style={{ fontSize: 9, fontWeight: 900, color: C.muted, uppercase: true }}>Foto Original</span>
                        <div style={{ aspectRatio: '1', borderRadius: 14, overflow: 'hidden', border: `1px solid ${C.border}`, background: C.bg }}>
                          <img src={selectedProject.client_photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                      </div>
                    </div>

                    {/* Metadata */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, background: C.bg, padding: 14, borderRadius: 14, border: `1px solid ${C.border}`, fontSize: 12 }}>
                      <div><strong>Zona do corpo:</strong> {selectedProject.body_zone}</div>
                      <div><strong>Lado/Vista:</strong> {selectedProject.body_side || 'Frente'}</div>
                      <div><strong>Orçamento pretendido:</strong> {selectedProject.budget || 'N/A'}€</div>
                      <div><strong>Data pretendida:</strong> {selectedProject.preferred_date || 'Qualquer'}</div>
                    </div>

                    <div style={{ fontSize: 12, background: C.bg, padding: 14, borderRadius: 14, border: `1px solid ${C.border}` }}>
                      <strong style={{ fontSize: 10, color: C.muted, display: 'block', marginBottom: 4 }}>DESCRIÇÃO DETALHADA</strong>
                      {selectedProject.description || 'Sem descrição.'}
                    </div>

                    {/* Gallery Variants */}
                    {selectedProject.preview_versions && selectedProject.preview_versions.length > 0 && (
                      <div>
                        <div style={{ fontSize: 11, fontWeight: 900, color: C.muted, marginBottom: 8 }}>Variantes Criadas pelo Cliente ({selectedProject.preview_versions.length})</div>
                        <div style={{ display: 'flex', gap: 10, overflowX: 'auto', pb: 8 }}>
                          {selectedProject.preview_versions.map((ver: any, index: number) => (
                            <div key={index} style={{ width: 80, flexShrink: 0, textAlign: 'center' }}>
                              <div style={{ height: 80, borderRadius: 10, overflow: 'hidden', border: `1.5px solid ${selectedProject.selected_preview?.id === ver.id ? C.gold : C.border}`, background: C.bg, position: 'relative' }}>
                                <img src={ver.clientPhoto} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                {ver.tattooPng && (
                                  <img src={ver.tattooPng} alt="" style={{
                                    position: 'absolute',
                                    width: '40%',
                                    left: '30%',
                                    top: '30%',
                                    transform: `rotate(${ver.canvasState.rotation}deg)`,
                                    mixBlendMode: 'multiply'
                                  }} />
                                )}
                              </div>
                              <span style={{ fontSize: 9, fontWeight: 800, marginTop: 4, display: 'block', color: selectedProject.selected_preview?.id === ver.id ? C.gold : C.muted }}>{ver.name}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Timeline History */}
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 900, color: C.muted, marginBottom: 10 }}>Histórico do Projeto</div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, background: C.bg, padding: 14, borderRadius: 14, border: `1px solid ${C.border}` }}>
                        {selectedProject.history && selectedProject.history.map((h: any, idx: number) => (
                          <div key={idx} style={{ fontSize: 11, display: 'flex', justify: 'between', borderBottom: `1px solid ${C.border}20`, pb: 4 }}>
                            <span>🔹 {h.action}</span>
                            <span style={{ marginLeft: 'auto', color: C.muted }}>{new Date(h.date).toLocaleDateString('pt-PT')}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Tatuador Actions */}
                    <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
                      <div style={{ fontSize: 14, fontWeight: 900 }}>Ações do Tatuador</div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {/* Proposal form */}
                        <div style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 14, padding: 14 }}>
                          <span style={{ fontSize: 10, fontWeight: 900, color: C.muted, display: 'block', marginBottom: 6 }}>ENVIAR PROPOSTA DE ORÇAMENTO</span>
                          <textarea 
                            rows={2} placeholder="Descreva os valores e o número de sessões..."
                            value={proposalText} onChange={e => setProposalText(e.target.value)}
                            style={{ width: '100%', padding: 10, background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, color: C.text, fontSize: 12, resize: 'none' }}
                          />
                          <button 
                            onClick={() => handleUpdateStatus(selectedProject.id, 'Proposta enviada', 'Proposta de orçamento enviada pelo estúdio', { proposal: proposalText })}
                            style={{ marginTop: 10, padding: '10px 16px', background: C.gold, border: 0, borderRadius: 10, color: C.bg, fontWeight: 900, cursor: 'pointer', fontSize: 11 }}
                          >
                            Enviar Proposta
                          </button>
                        </div>

                        {/* Request Modifications */}
                        <div style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 14, padding: 14 }}>
                          <span style={{ fontSize: 10, fontWeight: 900, color: C.muted, display: 'block', marginBottom: 6 }}>PEDIR ALTERAÇÕES AO CLIENTE</span>
                          <textarea 
                            rows={2} placeholder="Descreva os ajustes necessários..."
                            value={changesText} onChange={e => setChangesText(e.target.value)}
                            style={{ width: '100%', padding: 10, background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, color: C.text, fontSize: 12, resize: 'none' }}
                          />
                          <button 
                            onClick={() => handleUpdateStatus(selectedProject.id, 'Alterações solicitadas', 'Alterações solicitadas pelo estúdio', { notes: `${selectedProject.notes || ''}\n\n[Tatuador]: ${changesText}` })}
                            style={{ marginTop: 10, padding: '10px 16px', background: C.orange, border: 0, borderRadius: 10, color: C.bg, fontWeight: 900, cursor: 'pointer', fontSize: 11 }}
                          >
                            Pedir Alterações
                          </button>
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: 10 }}>
                        <button 
                          onClick={() => handleUpdateStatus(selectedProject.id, 'Em análise', 'Projeto em análise')}
                          style={{ padding: '12px 20px', background: `${C.blue}18`, border: `1px solid ${C.blue}40`, borderRadius: 12, color: C.blue, fontWeight: 800, fontSize: 11, cursor: 'pointer' }}
                        >
                          Colocar Em Análise
                        </button>
                        <button 
                          onClick={() => handleUpdateStatus(selectedProject.id, 'Cancelado', 'Projeto recusado')}
                          style={{ padding: '12px 20px', background: `${C.red}18`, border: `1px solid ${C.red}40`, borderRadius: 12, color: C.red, fontWeight: 800, fontSize: 11, cursor: 'pointer' }}
                        >
                          Recusar Projeto
                        </button>
                      </div>
                    </div>

                    {/* Messages Chat */}
                    <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 20, spaceY: 10 }}>
                      <div style={{ fontSize: 12, fontWeight: 900, marginBottom: 10 }}>Conversa com o Cliente</div>
                      
                      <div style={{ height: 160, overflowY: 'auto', background: C.bg, border: `1px solid ${C.border}`, borderRadius: 14, padding: 12, display: 'flex', flexDirection: 'column', gap: 10 }}>
                        {selectedProject.messages && selectedProject.messages.length > 0 ? (
                          selectedProject.messages.map((m: any, idx: number) => (
                            <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: m.sender_type === 'studio' ? 'flex-end' : 'flex-start' }}>
                              <div style={{ 
                                padding: '8px 12px', borderRadius: 12, fontSize: 11, fontWeight: 600, maxWidth: '80%',
                                background: m.sender_type === 'studio' ? C.gold : `${C.hover}`, color: m.sender_type === 'studio' ? C.bg : C.text
                              }}>
                                {m.message}
                              </div>
                              <span style={{ fontSize: 8, color: C.muted, marginTop: 2 }}>{new Date(m.created_at).toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                          ))
                        ) : (
                          <div style={{ color: C.muted, fontSize: 11, textAlign: 'center', padding: '40px 0' }}>Nenhuma mensagem trocada.</div>
                        )}
                      </div>

                      <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
                        <input 
                          type="text" placeholder="Escreva uma mensagem..."
                          value={chatMessage} onChange={e => setChatMessage(e.target.value)}
                          onKeyDown={e => e.key === 'Enter' && handleSendChatMessage()}
                          style={{ flex: 1, padding: 12, background: C.bg, border: `1px solid ${C.border}`, borderRadius: 12, color: C.text, fontSize: 12 }}
                        />
                        <button onClick={handleSendChatMessage} style={{ padding: '0 20px', background: C.gold, border: 0, borderRadius: 12, color: C.bg, fontWeight: 900, cursor: 'pointer', fontSize: 11 }}>
                          Enviar
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', items: 'center', justify: 'center', textAlign: 'center', padding: 40, color: C.muted }}>
                    <span style={{ fontSize: 40, display: 'block', marginBottom: 12 }}>📐</span>
                    <p style={{ fontSize: 14, fontWeight: 800 }}>Selecione um projeto na barra lateral</p>
                    <p style={{ fontSize: 11, marginTop: 4 }}>Aqui poderá analisar as imagens, as variantes criadas pelo cliente, propor preços e conversar diretamente.</p>
                  </div>
                )}
              </div>

            </div>
          )}

          {/* TABs 3+: Placeholder components for remaining tabs */}
          {activeTab !== 'dashboard' && activeTab !== 'projects' && placeholderContent[activeTab] && (
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 24, padding: 40, textAlign: 'center', color: C.muted }}>
              <span style={{ display: 'block', marginBottom: 12 }}>{placeholderContent[activeTab].icon}</span>
              <h2 style={{ fontSize: 16, fontWeight: 900, color: C.text }}>{placeholderContent[activeTab].label}</h2>
              <p style={{ fontSize: 11, marginTop: 4 }}>Esta funcionalidade está a carregar o módulo AzoresToYou.</p>
            </div>
          )}

        </div>
      </div>

    </div>
  );
};

export default TattooDashboard;
