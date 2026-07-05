import React, { useState, useEffect, useRef } from 'react';
import { Restaurant } from '../types';
import {
  LogOut, Bell, Search, Plus, ChevronRight, Calendar, Users,
  Clock, Star, Settings, Menu, X, Home, MessageSquare,
  BarChart3, CreditCard, Package, Layers, Image as ImageIcon,
  ShoppingCart, FileText, Award, User, ChevronLeft,
  ArrowRight, Clock3, Sparkles, Zap, TrendingUp, DollarSign,
  Cloud, Sun, CloudRain, CloudLightning, MapPin, Paintbrush,
  CheckCircle, MessageCircle, AlertTriangle, Send
} from 'lucide-react';
import { API_BASE_URL } from '../config';

interface TattooDashboardProps {
  business: Restaurant;
  onUpdateBusiness: (updated: Restaurant) => void;
  onLogout: () => void;
}

// Design Tokens (matches existing studio theme)
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

type TabId = 'dashboard' | 'projects' | 'messages' | 'settings';

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
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Stats counters
  const [stats, setStats] = useState({
    totalProjects: 0,
    newProjects: 0,
    activeBudgets: 0
  });

  const studioName = business.name || 'Estúdio Premium';

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/tattoo_projects`);
      if (response.ok) {
        const data = await response.json();
        // Filter projects for this studio that are NOT Rascunho
        const studioProjects = data.filter((p: any) => 
          p.business_id === business.id && p.status !== 'Rascunho'
        );
        setProjects(studioProjects);

        // Update stats
        const newCount = studioProjects.filter((p: any) => p.status === 'Enviado').length;
        const totalCount = studioProjects.length;
        const totalBudget = studioProjects.reduce((acc: number, p: any) => acc + (Number(p.budget) || 0), 0);

        setStats({
          totalProjects: totalCount,
          newProjects: newCount,
          activeBudgets: totalBudget
        });

        // Sync active selection
        if (selectedProject) {
          const fresh = studioProjects.find((p: any) => p.id === selectedProject.id);
          if (fresh) setSelectedProject(fresh);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
    const interval = setInterval(fetchProjects, 15000);
    return () => clearInterval(interval);
  }, [business.id]);

  const handleUpdateStatus = async (id: string, newStatus: string, actionMsg: string, extraPayload: any = {}) => {
    const target = projects.find(p => p.id === id);
    if (!target) return;

    const updated = {
      ...target,
      status: newStatus,
      updated_at: new Date().toISOString(),
      history: [...(target.history || []), { action: actionMsg, date: new Date().toISOString() }],
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
      sender: 'studio',
      text: chatMessage,
      timestamp: new Date().toISOString()
    };
    const updated = {
      ...selectedProject,
      messages: [...(selectedProject.messages || []), newMsg],
      updated_at: new Date().toISOString()
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
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: C.bg, fontFamily: "'Inter', sans-serif", color: C.text }}>
      
      {/* Sidebar */}
      {sidebarOpen && (
        <aside style={{ width: 260, background: C.card, borderRight: `1px solid ${C.border}`, display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
          <div style={{ padding: 24, borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ background: `${C.gold}20`, padding: 8, borderRadius: 12, display: 'flex', color: C.gold }}><Paintbrush size={20} /></span>
            <div style={{ fontSize: 15, fontWeight: 900, letterSpacing: -0.3 }}>{studioName}</div>
          </div>

          <nav style={{ flex: 1, padding: 16, display: 'flex', flexDirection: 'column', gap: 6 }}>
            <button onClick={() => setActiveTab('dashboard')} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderRadius: 12, background: activeTab === 'dashboard' ? `${C.gold}15` : 'transparent', color: activeTab === 'dashboard' ? C.gold : C.muted, border: 0, cursor: 'pointer', textAlign: 'left', fontWeight: 800, fontSize: 13 }}>
              <Home size={18} /> Dashboard
            </button>
            <button onClick={() => setActiveTab('projects')} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderRadius: 12, background: activeTab === 'projects' ? `${C.gold}15` : 'transparent', color: activeTab === 'projects' ? C.gold : C.muted, border: 0, cursor: 'pointer', textAlign: 'left', fontWeight: 800, fontSize: 13 }}>
              <Layers size={18} /> Projetos de Tatuagem
            </button>
            <button onClick={onLogout} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderRadius: 12, color: C.red, background: 'transparent', border: 0, cursor: 'pointer', textAlign: 'left', fontWeight: 800, fontSize: 13, marginTop: 'auto' }}>
              <LogOut size={18} /> Sair
            </button>
          </nav>
        </aside>
      )}

      {/* Main Container */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        
        {/* Header */}
        <header style={{ height: 70, borderBottom: `1px solid ${C.border}`, padding: '0 26px', display: 'flex', alignItems: 'center', justifyContent: 'between', background: C.card }}>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ background: 'transparent', border: 0, color: C.text, cursor: 'pointer' }}><Menu size={22} /></button>
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 16 }}>
            <Bell size={20} color={C.muted} />
            <div style={{ width: 36, height: 36, borderRadius: 12, background: C.hover, border: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 850 }}>T</div>
          </div>
        </header>

        {/* Dynamic content view */}
        <main style={{ flex: 1, overflowY: 'auto', padding: 26 }}>
          
          {/* TAB 1: Dashboard Home */}
          {activeTab === 'dashboard' && (
            <div style={{ spaceY: 24 }}>
              {/* Stats Panel */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 24 }}>
                <div style={{ background: C.card, border: `1px solid ${C.border}`, padding: 22, borderRadius: 20 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: C.muted }}>Total Projetos</div>
                  <div style={{ fontSize: 26, fontWeight: 900, color: C.text, marginTop: 4 }}>{stats.totalProjects}</div>
                </div>
                <div style={{ background: C.card, border: `1px solid ${C.border}`, padding: 22, borderRadius: 20 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: C.gold }}>Novos Projetos</div>
                  <div style={{ fontSize: 26, fontWeight: 900, color: C.gold, marginTop: 4 }}>{stats.newProjects}</div>
                </div>
                <div style={{ background: C.card, border: `1px solid ${C.border}`, padding: 22, borderRadius: 20 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: C.muted }}>Orçamentado Estimado</div>
                  <div style={{ fontSize: 26, fontWeight: 900, color: C.green, marginTop: 4 }}>{stats.activeBudgets}€</div>
                </div>
              </div>

              {/* Recent Activity Table */}
              <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 20, padding: 22 }}>
                <div style={{ fontSize: 16, fontWeight: 900, marginBottom: 16 }}>Últimos Projetos Recebidos</div>
                
                {projects.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '40px 0', color: C.muted, fontWeight: 650 }}>Nenhum projeto pendente.</div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {projects.slice(0, 5).map(p => {
                      const st = STATE_COLORS[p.status] || { bg: C.hover, text: C.text };
                      return (
                        <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 12, border: `1px solid ${C.border}`, borderRadius: 14, background: C.bg }}>
                          <div style={{ width: 44, height: 44, borderRadius: 10, overflow: 'hidden', background: C.card, border: `1px solid ${C.border}` }}>
                            <img src={p.client_photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          </div>
                          <div>
                            <div style={{ fontSize: 13, fontWeight: 800 }}>{p.title}</div>
                            <div style={{ fontSize: 10, color: C.muted }}>{p.client_name} · {p.body_zone}</div>
                          </div>
                          <span style={{ marginLeft: 'auto', fontSize: 10, fontWeight: 800, background: st.bg, color: st.text, padding: '4px 10px', borderRadius: 8 }}>{p.status}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: Projects List & Workspace */}
          {activeTab === 'projects' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: 20, height: 'calc(100vh - 170px)' }}>
              
              {/* Projects Sidebar List */}
              <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 20, padding: 16, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ fontSize: 14, fontWeight: 900, marginBottom: 6 }}>Projetos Disponíveis ({projects.length})</div>
                
                {projects.map(p => {
                  const st = STATE_COLORS[p.status] || { bg: C.hover, text: C.text };
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
                        <div style={{ display: 'flex', justifyContent: 'between', fontSize: 10, fontWeight: 800, color: C.muted }}>
                          <span>{p.project_code}</span>
                          <span style={{ background: st.bg, color: st.text, padding: '2px 6px', borderRadius: 4 }}>{p.status}</span>
                        </div>
                        <div style={{ fontSize: 12, fontWeight: 800, marginTop: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.title}</div>
                        <div style={{ fontSize: 10, color: C.muted, marginTop: 2 }}>{p.client_name} · {p.body_zone}</div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Project workspace details */}
              <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 20, padding: 22, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 20 }}>
                {selectedProject ? (
                  <>
                    {/* Header */}
                    <div style={{ display: 'flex', justifyContent: 'between', borderBottom: `1px solid ${C.border}`, paddingBottom: 16 }}>
                      <div>
                        <div style={{ fontSize: 18, fontWeight: 900 }}>{selectedProject.title}</div>
                        <p style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>Código: {selectedProject.project_code} · Cliente: {selectedProject.client_name} ({selectedProject.client_id})</p>
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

                    {/* Meta information */}
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

                    {/* Internal variations gallery */}
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

                    {/* Tatuador Action Panels */}
                    <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
                      <div style={{ fontSize: 14, fontWeight: 900 }}>Ações do Tatuador</div>

                      {/* Input fields to respond */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {/* Send Proposal form */}
                        <div style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 14, padding: 14 }}>
                          <span style={{ fontSize: 10, fontWeight: 900, color: C.muted, display: 'block', marginBottom: 6 }}>ENVIAR PROPOSTA DE ORÇAMENTO</span>
                          <textarea 
                            rows={2} placeholder="Indique a proposta de orçamento (Ex: Apresentamos orçamento de 250€ com sinal de 50€ para execução em 1 sessão...)"
                            value={proposalText} onChange={e => setProposalText(e.target.value)}
                            style={{ width: '100%', padding: 10, background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, color: C.text, fontSize: 12, resize: 'none' }}
                          />
                          <button 
                            onClick={() => handleUpdateStatus(selectedProject.id, 'Proposta enviada', 'Proposta de orçamento enviada', { proposal: proposalText })}
                            style={{ marginTop: 10, padding: '10px 16px', background: C.gold, border: 0, borderRadius: 10, color: C.bg, fontWeight: 900, cursor: 'pointer', fontSize: 11 }}
                          >
                            Enviar Proposta
                          </button>
                        </div>

                        {/* Request Modifications form */}
                        <div style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 14, padding: 14 }}>
                          <span style={{ fontSize: 10, fontWeight: 900, color: C.muted, display: 'block', marginBottom: 6 }}>SOLICITAR ALTERAÇÕES</span>
                          <textarea 
                            rows={2} placeholder="Descreva as alterações necessárias (Ex: Aconselho fazermos noutro ângulo ou com menos complexidade neste local...)"
                            value={changesText} onChange={e => setChangesText(e.target.value)}
                            style={{ width: '100%', padding: 10, background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, color: C.text, fontSize: 12, resize: 'none' }}
                          />
                          <button 
                            onClick={() => handleUpdateStatus(selectedProject.id, 'Alterações solicitadas', 'Alterações de projeto solicitadas', { notes: `${selectedProject.notes || ''}\n\n[Tatuador]: ${changesText}` })}
                            style={{ marginTop: 10, padding: '10px 16px', background: C.orange, border: 0, borderRadius: 10, color: C.bg, fontWeight: 900, cursor: 'pointer', fontSize: 11 }}
                          >
                            Pedir Alterações
                          </button>
                        </div>
                      </div>

                      {/* General buttons */}
                      <div style={{ display: 'flex', gap: 10 }}>
                        <button 
                          onClick={() => handleUpdateStatus(selectedProject.id, 'Em análise', 'Projeto colocado em análise técnica')}
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

                    {/* Chat messaging */}
                    <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 20, spaceY: 10 }}>
                      <div style={{ fontSize: 12, fontWeight: 900, marginBottom: 10 }}>Mensagens com o Cliente</div>
                      
                      <div style={{ height: 160, overflowY: 'auto', background: C.bg, border: `1px solid ${C.border}`, borderRadius: 14, padding: 12, display: 'flex', flexDirection: 'column', gap: 10 }}>
                        {selectedProject.messages && selectedProject.messages.length > 0 ? (
                          selectedProject.messages.map((m: any, idx: number) => (
                            <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: m.sender === 'studio' ? 'flex-end' : 'flex-start' }}>
                              <div style={{ 
                                padding: '8px 12px', borderRadius: 12, fontSize: 11, fontWeight: 600, maxWidth: '80%',
                                background: m.sender === 'studio' ? C.gold : `${C.hover}`, color: m.sender === 'studio' ? C.bg : C.text
                              }}>
                                {m.text}
                              </div>
                              <span style={{ fontSize: 8, color: C.muted, marginTop: 2 }}>{new Date(m.timestamp).toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' })}</span>
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

        </main>
      </div>

    </div>
  );
};

export default TattooDashboard;
