import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, Layers, Calendar, DollarSign, MessageSquare, AlertTriangle, 
  Trash2, Send, Edit, Copy, Sparkles, Check, CheckCircle2, ChevronRight 
} from 'lucide-react';
import { API_BASE_URL } from '../config';

interface MyTattooProjectsProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile?: { email: string; name: string; phone: string };
  language?: string;
}

const STATE_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  'Rascunho': { bg: 'bg-slate-900', text: 'text-slate-400', border: 'border-white/5' },
  'Enviado': { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/20' },
  'Em análise': { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20' },
  'Alterações solicitadas': { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/20' },
  'Proposta enviada': { bg: 'bg-yellow-500/10', text: 'text-yellow-500', border: 'border-yellow-500/20' },
  'Aceite pelo cliente': { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20' },
  'Sinal pago': { bg: 'bg-emerald-500/20', text: 'text-emerald-300', border: 'border-emerald-500/30' },
  'Reserva criada': { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/20' },
  'Concluído': { bg: 'bg-emerald-650', text: 'text-white', border: 'border-emerald-600' },
  'Cancelado': { bg: 'bg-slate-950', text: 'text-slate-600', border: 'border-white/5' }
};

export const MyTattooProjects: React.FC<MyTattooProjectsProps> = ({
  isOpen,
  onClose,
  userProfile,
  language = 'pt'
}) => {
  const clientEmail = userProfile?.email || 'anonimo@azorestoyou.pt';
  const [projects, setProjects] = useState<any[]>([]);
  const [selectedProject, setSelectedProject] = useState<any | null>(null);
  const [chatMessage, setChatMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/tattoo_projects`);
      if (response.ok) {
        const data = await response.json();
        // Filter projects for this client
        const clientProjects = data.filter((p: any) => p.client_id === clientEmail);
        setProjects(clientProjects);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchProjects();
    }
  }, [isOpen, clientEmail]);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Tem a certeza que quer apagar este projeto?')) return;
    try {
      const response = await fetch(`${API_BASE_URL}/api/tattoo_projects/${id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        setProjects(prev => prev.filter(p => p.id !== id));
        if (selectedProject?.id === id) setSelectedProject(null);
        alert('Projeto eliminado.');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSendProject = async (proj: any) => {
    const updated = { ...proj, status: 'Enviado', updated_at: new Date().toISOString() };
    updated.history.push({ action: 'Projeto submetido ao estúdio', date: new Date().toISOString() });
    try {
      const response = await fetch(`${API_BASE_URL}/api/tattoo_projects/${proj.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      });
      if (response.ok) {
        fetchProjects();
        if (selectedProject?.id === proj.id) setSelectedProject(updated);
        alert('✈️ Projeto enviado para análise!');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSendChatMessage = async () => {
    if (!chatMessage.trim() || !selectedProject) return;
    const newMsg = {
      sender: 'client',
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

  const handleAcceptProposal = async (proj: any) => {
    const updated = { ...proj, status: 'Aceite pelo cliente', updated_at: new Date().toISOString() };
    updated.history.push({ action: 'Proposta aceite pelo cliente', date: new Date().toISOString() });
    try {
      const response = await fetch(`${API_BASE_URL}/api/tattoo_projects/${proj.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      });
      if (response.ok) {
        setSelectedProject(updated);
        setProjects(prev => prev.map(p => p.id === proj.id ? updated : p));
        alert('🎉 Aceitou a proposta! Prossiga com o estúdio para agendar e efetuar o sinal.');
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[1050] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4"
      >
        <motion.div 
          initial={{ scale: 0.95, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.95, y: 20 }}
          className="bg-slate-900 border border-white/10 rounded-[2.5rem] w-full max-w-4xl h-[85vh] flex flex-col overflow-hidden shadow-2xl relative"
        >
          {/* Header */}
          <div className="px-6 py-5 border-b border-white/5 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <span className="p-2.5 bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 rounded-2xl">
                <Layers size={20} />
              </span>
              <div>
                <h2 className="text-lg font-black text-white">Os Meus Projetos de Tatuagem</h2>
                <p className="text-xs text-slate-400 font-semibold">Gira as tuas simulações e propostas em tempo real</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2.5 bg-white/5 hover:bg-white/10 rounded-full transition-all text-slate-400 hover:text-white">
              <X size={20} />
            </button>
          </div>

          {/* Main Body Grid */}
          <div className="flex-1 flex overflow-hidden">
            {/* Left list pane */}
            <div className="w-full md:w-2/5 border-r border-white/5 overflow-y-auto p-4 space-y-3">
              {loading && projects.length === 0 ? (
                <div className="text-center py-12 text-slate-500 font-bold">A carregar projetos...</div>
              ) : projects.length === 0 ? (
                <div className="text-center py-12 space-y-3">
                  <span className="text-4xl block">✨</span>
                  <p className="text-sm font-black text-slate-400">Nenhum projeto de tatuagem criado</p>
                  <p className="text-xs text-slate-500 font-medium">Abra a página de um estúdio para criar o seu primeiro design.</p>
                </div>
              ) : (
                projects.map(proj => {
                  const badge = STATE_COLORS[proj.status] || STATE_COLORS.Rascunho;
                  return (
                    <button 
                      key={proj.id}
                      onClick={() => setSelectedProject(proj)}
                      className={`w-full text-left p-4 rounded-2xl border transition-all flex gap-3 ${
                        selectedProject?.id === proj.id 
                          ? 'bg-white/5 border-white/15' 
                          : 'bg-slate-950/40 border-white/5 hover:border-white/10'
                      }`}
                    >
                      <div className="w-16 h-16 bg-slate-950 rounded-xl overflow-hidden shrink-0 border border-white/5 relative">
                        <img src={proj.client_photo} alt="" className="w-full h-full object-cover" />
                        {proj.tattoo_png && (
                          <img src={proj.tattoo_png} alt="" className="absolute inset-2 object-contain mix-blend-multiply opacity-80" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start gap-1">
                          <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded border ${badge.bg} ${badge.text} ${badge.border}`}>
                            {proj.status}
                          </span>
                          <span className="text-[10px] text-slate-500 font-mono">{proj.project_code}</span>
                        </div>
                        <h4 className="font-black text-sm text-white truncate mt-1.5">{proj.title || 'Sem Título'}</h4>
                        <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">{proj.body_zone}</p>
                      </div>
                    </button>
                  );
                })
              )}
            </div>

            {/* Right details pane */}
            <div className="hidden md:flex flex-1 flex-col overflow-y-auto p-6 bg-slate-950/40 space-y-6">
              {selectedProject ? (
                <>
                  {/* Summary Details */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-start border-b border-white/5 pb-4">
                      <div>
                        <h3 className="text-xl font-black text-white">{selectedProject.title}</h3>
                        <p className="text-xs text-slate-400 mt-1 font-medium">Código: {selectedProject.project_code} · {selectedProject.body_zone}</p>
                      </div>
                      <div className="flex gap-2">
                        {selectedProject.status === 'Rascunho' && (
                          <>
                            <button 
                              onClick={() => handleSendProject(selectedProject)}
                              className="px-4 py-2 bg-yellow-500 hover:bg-yellow-400 text-slate-950 text-xs font-black uppercase tracking-widest rounded-xl transition-all flex items-center gap-1.5"
                            >
                              <Send size={12} />
                              Submeter
                            </button>
                            <button 
                              onClick={() => handleDelete(selectedProject.id)}
                              className="p-2 bg-white/5 hover:bg-red-500/10 hover:text-red-500 border border-white/10 rounded-xl transition-all text-slate-400"
                            >
                              <Trash2 size={16} />
                            </button>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1">Preview</span>
                        <div className="aspect-square bg-slate-950 rounded-2xl overflow-hidden border border-white/5 relative">
                          <img src={selectedProject.client_photo} alt="" className="w-full h-full object-cover" />
                          {selectedProject.tattoo_png && (
                            <img src={selectedProject.tattoo_png} alt="" className="absolute inset-4 object-contain mix-blend-multiply opacity-90" />
                          )}
                        </div>
                      </div>
                      <div>
                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1">Referência</span>
                        <div className="aspect-square bg-slate-950 rounded-2xl overflow-hidden border border-white/5">
                          <img src={selectedProject.tattoo_png} alt="" className="w-full h-full object-cover" />
                        </div>
                      </div>
                      <div>
                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1">Original</span>
                        <div className="aspect-square bg-slate-950 rounded-2xl overflow-hidden border border-white/5">
                          <img src={selectedProject.client_photo} alt="" className="w-full h-full object-cover" />
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-900 border border-white/5 rounded-2xl p-4 space-y-3">
                      <p className="text-xs text-slate-300 font-semibold"><span className="text-slate-500 uppercase text-[9px] font-black tracking-wider block">Descrição</span> {selectedProject.description || 'Nenhuma descrição inserida.'}</p>
                      {selectedProject.budget && <p className="text-xs text-slate-300 font-semibold"><span className="text-slate-500 uppercase text-[9px] font-black tracking-wider block">Orçamento estimado</span> {selectedProject.budget}€</p>}
                      {selectedProject.preferred_date && <p className="text-xs text-slate-300 font-semibold"><span className="text-slate-500 uppercase text-[9px] font-black tracking-wider block">Data preferida</span> {selectedProject.preferred_date}</p>}
                    </div>

                    {/* Proposal Area */}
                    {selectedProject.status === 'Proposta enviada' && (
                      <div className="bg-gradient-to-r from-yellow-500/10 to-amber-500/10 border-2 border-yellow-500/20 rounded-2xl p-5 space-y-4 shadow-xl">
                        <div className="flex items-center gap-2 text-yellow-500">
                          <Sparkles size={18} />
                          <h4 className="text-sm font-black uppercase tracking-wider">Proposta do Estúdio Recebida</h4>
                        </div>
                        <p className="text-xs text-slate-350 leading-relaxed font-semibold">{selectedProject.proposal || 'Apresentamos orçamento de 250€ com sinal de 50€ para execução em 1 sessão.'}</p>
                        <div className="flex gap-2">
                          <button 
                            onClick={() => handleAcceptProposal(selectedProject)}
                            className="px-5 py-3 bg-yellow-500 hover:bg-yellow-400 text-slate-950 text-xs font-black uppercase tracking-widest rounded-xl transition-all"
                          >
                            Aceitar Proposta
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Chat messages overlay */}
                    {selectedProject.status !== 'Rascunho' && (
                      <div className="border-t border-white/5 pt-4 space-y-4">
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Conversa com o Estúdio</h4>
                        
                        <div className="bg-slate-900 border border-white/5 rounded-2xl p-4 h-48 overflow-y-auto space-y-3">
                          {selectedProject.messages && selectedProject.messages.length > 0 ? (
                            selectedProject.messages.map((m: any, idx: number) => (
                              <div key={idx} className={`flex flex-col ${m.sender === 'client' ? 'items-end' : 'items-start'}`}>
                                <div className={`px-4 py-2.5 rounded-2xl text-xs font-semibold max-w-[80%] ${
                                  m.sender === 'client' 
                                    ? 'bg-yellow-500 text-slate-950 rounded-tr-none' 
                                    : 'bg-white/5 text-slate-100 rounded-tl-none border border-white/5'
                                }`}>
                                  {m.text}
                                </div>
                                <span className="text-[9px] text-slate-500 mt-1 font-semibold">{new Date(m.timestamp).toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' })}</span>
                              </div>
                            ))
                          ) : (
                            <p className="text-center text-slate-500 text-xs py-12">Nenhuma mensagem trocada. Envie uma mensagem para alinhar detalhes.</p>
                          )}
                        </div>

                        <div className="flex gap-2">
                          <input 
                            type="text" placeholder="Escreva uma mensagem..." 
                            value={chatMessage} onChange={e => setChatMessage(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleSendChatMessage()}
                            className="flex-1 px-4 py-3 bg-slate-950 border border-white/5 rounded-2xl text-white font-semibold text-xs focus:outline-none focus:border-yellow-500 transition-all"
                          />
                          <button 
                            onClick={handleSendChatMessage}
                            className="px-5 py-3 bg-white/10 hover:bg-white/15 text-white text-xs font-black uppercase tracking-widest rounded-2xl transition-all"
                          >
                            Enviar
                          </button>
                        </div>
                      </div>
                    )}

                  </div>
                </>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center space-y-3">
                  <span className="text-5xl">📐</span>
                  <p className="text-sm font-black text-slate-400">Selecione um projeto da lista</p>
                  <p className="text-xs text-slate-550 font-semibold max-w-xs">Escolha um projeto na lateral esquerda para visualizar previews, conversar com estúdios e aceitar propostas.</p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
