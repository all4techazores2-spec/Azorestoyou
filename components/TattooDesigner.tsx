import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, Camera, Image as ImageIcon, Check, RotateCw, RefreshCw, 
  Trash2, Undo, Redo, Eye, EyeOff, Save, Send, Plus, Sparkles, 
  ChevronRight, ChevronLeft, Layers, Sliders, Maximize2, Minimize2 
} from 'lucide-react';
import { API_BASE_URL } from '../config';

interface TattooDesignerProps {
  isOpen: boolean;
  onClose: () => void;
  businessId: string;
  businessName: string;
  userProfile?: { email: string; name: string; phone: string };
  language?: string;
  onProjectCreated?: () => void;
}

interface CanvasState {
  scale: number;
  rotation: number;
  opacity: number;
  x: number;
  y: number;
  mirror: boolean;
}

interface PreviewVersion {
  id: string;
  name: string;
  clientPhoto: string; // Base64 or url
  tattooPng: string; // Base64 or url
  canvasState: CanvasState;
  createdAt: string;
}

export const TattooDesigner: React.FC<TattooDesignerProps> = ({
  isOpen,
  onClose,
  businessId,
  businessName,
  userProfile,
  language = 'pt',
  onProjectCreated
}) => {
  const clientEmail = userProfile?.email || 'anonimo@azorestoyou.pt';
  const localStorageKey = `tattoo_designer_draft_${businessId}_${clientEmail}`;

  // Wizard Steps: 1 (Photo), 2 (Body part), 3 (Tattoo design), 4 (Loader), 5 (Editor), 6 (Summary)
  const [step, setStep] = useState<number>(1);
  const [projectTitle, setProjectTitle] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [bodyZone, setBodyZone] = useState('');
  const [bodySide, setBodySide] = useState<'frente' | 'costas'>('frente');
  const [gender, setGender] = useState<'homem' | 'mulher'>('homem');
  const [clientPhoto, setClientPhoto] = useState<string>('');
  const [tattooPng, setTattooPng] = useState<string>('');
  
  // Versions
  const [versions, setVersions] = useState<PreviewVersion[]>([]);
  const [currentVersionId, setCurrentVersionId] = useState<string>('');
  
  // Interactive Canvas editing states (for the current active version)
  const [canvasState, setCanvasState] = useState<CanvasState>({
    scale: 0.5,
    rotation: 0,
    opacity: 0.9,
    x: 0,
    y: 0,
    mirror: false
  });

  const [compareMode, setCompareMode] = useState(false);
  const [showTattoo, setShowTattoo] = useState(true);
  const [loaderProgress, setLoaderProgress] = useState(0);
  const [preferredDate, setPreferredDate] = useState('');
  const [budget, setBudget] = useState('');
  const [notes, setNotes] = useState('');
  const [projectCode, setProjectCode] = useState(() => `AZT-${Math.floor(1000 + Math.random() * 9000)}`);

  // History for Undo/Redo inside Editor
  const [historyStack, setHistoryStack] = useState<CanvasState[]>([]);
  const [redoStack, setRedoStack] = useState<CanvasState[]>([]);

  // Dragging states
  const editorRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // 1. Auto-Load from LocalStorage on mount
  useEffect(() => {
    if (isOpen) {
      const saved = localStorage.getItem(localStorageKey);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setStep(parsed.step || 1);
          setProjectTitle(parsed.projectTitle || '');
          setProjectDescription(parsed.projectDescription || '');
          setBodyZone(parsed.bodyZone || '');
          setBodySide(parsed.bodySide || 'frente');
          setGender(parsed.gender || 'homem');
          setClientPhoto(parsed.clientPhoto || '');
          setTattooPng(parsed.tattooPng || '');
          setVersions(parsed.versions || []);
          setCurrentVersionId(parsed.currentVersionId || '');
          if (parsed.canvasState) setCanvasState(parsed.canvasState);
          setPreferredDate(parsed.preferredDate || '');
          setBudget(parsed.budget || '');
          setNotes(parsed.notes || '');
          setProjectCode(parsed.projectCode || `AZT-${Math.floor(1000 + Math.random() * 9000)}`);
        } catch (e) {
          console.error("Error loading Tattoo Designer local draft", e);
        }
      }
    }
  }, [isOpen]);

  // 2. Auto-Save to LocalStorage on modifications
  useEffect(() => {
    if (isOpen && step > 0) {
      const draftState = {
        step,
        projectTitle,
        projectDescription,
        bodyZone,
        bodySide,
        gender,
        clientPhoto,
        tattooPng,
        versions,
        currentVersionId,
        canvasState,
        preferredDate,
        budget,
        notes,
        projectCode
      };
      localStorage.setItem(localStorageKey, JSON.stringify(draftState));
    }
  }, [
    step, projectTitle, projectDescription, bodyZone, bodySide, gender, 
    clientPhoto, tattooPng, versions, currentVersionId, canvasState, 
    preferredDate, budget, notes, projectCode, isOpen
  ]);

  // Handle step 4 loading simulation (2s max)
  useEffect(() => {
    if (step === 4) {
      setLoaderProgress(0);
      const interval = setInterval(() => {
        setLoaderProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            // Create default version if none exists
            if (versions.length === 0) {
              const newVerId = `v_${Date.now()}`;
              const defaultVer: PreviewVersion = {
                id: newVerId,
                name: 'Versão Principal',
                clientPhoto,
                tattooPng,
                canvasState,
                createdAt: new Date().toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' })
              };
              setVersions([defaultVer]);
              setCurrentVersionId(newVerId);
            }
            setStep(5);
            return 100;
          }
          return prev + 10;
        });
      }, 150);
      return () => clearInterval(interval);
    }
  }, [step]);

  // Apply a state action and add to Undo history
  const updateCanvasState = (newState: Partial<CanvasState>) => {
    setHistoryStack(prev => [...prev, canvasState]);
    setRedoStack([]);
    setCanvasState(prev => ({ ...prev, ...newState }));
  };

  const handleUndo = () => {
    if (historyStack.length === 0) return;
    const prev = historyStack[historyStack.length - 1];
    setRedoStack(r => [...r, canvasState]);
    setHistoryStack(h => h.slice(0, h.length - 1));
    setCanvasState(prev);
  };

  const handleRedo = () => {
    if (redoStack.length === 0) return;
    const next = redoStack[redoStack.length - 1];
    setHistoryStack(h => [...h, canvasState]);
    setRedoStack(r => r.slice(0, r.length - 1));
    setCanvasState(next);
  };

  const handleReset = () => {
    updateCanvasState({
      scale: 0.5,
      rotation: 0,
      opacity: 0.9,
      x: 0,
      y: 0,
      mirror: false
    });
  };

  // Dragging logic
  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - canvasState.x, y: e.clientY - canvasState.y });
    e.preventDefault();
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStart.x;
    const dy = e.clientY - dragStart.y;
    setCanvasState(prev => ({ ...prev, x: dx, y: dy }));
  };

  const handlePointerUp = () => {
    if (isDragging) {
      setIsDragging(false);
      setHistoryStack(prev => [...prev, canvasState]);
    }
  };

  // Save current version
  const saveVersion = () => {
    const updatedVersions = versions.map(v => {
      if (v.id === currentVersionId) {
        return { ...v, canvasState };
      }
      return v;
    });
    setVersions(updatedVersions);
    alert('✅ Versão guardada com sucesso!');
  };

  // Duplicate current version
  const duplicateVersion = () => {
    const activeVer = versions.find(v => v.id === currentVersionId);
    if (!activeVer) return;
    const newVerId = `v_${Date.now()}`;
    const newVer: PreviewVersion = {
      id: newVerId,
      name: `Versão ${versions.length + 1}`,
      clientPhoto: activeVer.clientPhoto,
      tattooPng: activeVer.tattooPng,
      canvasState: { ...canvasState },
      createdAt: new Date().toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' })
    };
    setVersions([...versions, newVer]);
    setCurrentVersionId(newVerId);
    alert('✅ Versão duplicada! Agora está a editar a cópia.');
  };

  const deleteVersion = (id: string) => {
    if (versions.length <= 1) {
      alert('Não é possível apagar a única versão do projeto.');
      return;
    }
    const filtered = versions.filter(v => v.id !== id);
    setVersions(filtered);
    if (currentVersionId === id) {
      setCurrentVersionId(filtered[0].id);
      setCanvasState(filtered[0].canvasState);
    }
  };

  // Upload handlers
  const handleClientPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setClientPhoto(reader.result as string);
        setStep(2);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTattooPngUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setTattooPng(reader.result as string);
        setStep(4);
      };
      reader.readAsDataURL(file);
    }
  };

  // Mock Camera simulation
  const triggerMockCamera = () => {
    // Generate a default high quality skin placement mockup background
    setClientPhoto('https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=800&q=80');
    setStep(2);
  };

  // Mock Tattoo simulation design templates
  const selectTattooTemplate = (url: string) => {
    setTattooPng(url);
    setStep(4);
  };

  // Final Action: Save Project or Send to Studio
  const handleFinalSubmit = async (isSend: boolean) => {
    if (!projectTitle.trim()) {
      alert('Por favor insira um título para o projeto.');
      return;
    }

    const activeVer = versions.find(v => v.id === currentVersionId);
    const finalStatus = isSend ? 'Enviado' : 'Rascunho';

    const projectPayload = {
      id: `PROJ_${Date.now()}`,
      business_id: businessId,
      client_id: clientEmail,
      client_name: userProfile?.name || 'Cliente AzoresToYou',
      client_phone: userProfile?.phone || '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      status: finalStatus,
      project_code: projectCode,
      title: projectTitle,
      description: projectDescription,
      body_zone: bodyZone,
      body_side: bodySide,
      gender,
      client_photo: clientPhoto,
      reference_images: [tattooPng],
      preview_versions: versions,
      selected_preview: activeVer || null,
      tattoo_png: tattooPng,
      notes: notes,
      preferred_date: preferredDate,
      budget: budget,
      messages: [],
      history: [{ action: `Projeto criado como ${finalStatus}`, date: new Date().toISOString() }]
    };

    try {
      const response = await fetch(`${API_BASE_URL}/api/tattoo_projects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(projectPayload)
      });

      if (response.ok) {
        // Clear local draft progress
        localStorage.removeItem(localStorageKey);
        alert(isSend ? '✈️ Projeto enviado com sucesso para o Estúdio!' : '💾 Projeto guardado nos seus rascunhos.');
        if (onProjectCreated) onProjectCreated();
        onClose();
      } else {
        alert('Erro ao guardar projeto no servidor. Tente de novo.');
      }
    } catch (e) {
      console.error(e);
      alert('Falha na ligação com o servidor.');
    }
  };

  if (!isOpen) return null;

  // Clickable body parts
  const bodyParts = [
    'Pescoço', 'Ombro', 'Peito', 'Braço', 'Antebraço', 'Pulso', 'Mão',
    'Costas', 'Perna', 'Coxa', 'Gémeo', 'Tornozelo', 'Outro'
  ];

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 220 }}
        className="fixed inset-0 z-[1100] bg-slate-950 flex flex-col font-sans text-slate-100 overflow-hidden"
      >
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900/50 backdrop-blur-xl border-b border-white/5 shrink-0">
          <div className="flex items-center gap-3">
            <span className="p-2 bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border border-yellow-500/30 rounded-xl text-yellow-500">
              <Sparkles size={18} />
            </span>
            <div>
              <h2 className="text-sm font-black uppercase tracking-widest text-yellow-500">Tattoo Designer</h2>
              <p className="text-xs text-slate-400 font-semibold">{businessName} · {projectCode}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2.5 bg-white/5 hover:bg-white/10 rounded-full transition-all">
            <X size={20} />
          </button>
        </div>

        {/* Dynamic Wizard Step Content */}
        <div className="flex-1 overflow-y-auto flex flex-col">
          
          {/* STEP 1: Select/Take Photo */}
          {step === 1 && (
            <div className="flex-1 max-w-lg mx-auto w-full flex flex-col justify-center p-8 space-y-8">
              <div className="text-center space-y-3">
                <h1 className="text-3xl font-black tracking-tight text-white">Vamos criar o teu projeto</h1>
                <p className="text-slate-400 text-sm font-medium leading-relaxed">
                  Cria uma simulação da tua tatuagem sobre a tua própria pele antes de enviar a proposta ao estúdio.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <button 
                  onClick={triggerMockCamera}
                  className="group relative flex flex-col items-center justify-center p-8 bg-slate-900 border border-white/5 hover:border-yellow-500/30 rounded-3xl transition-all shadow-xl hover:shadow-yellow-500/5"
                >
                  <div className="w-14 h-14 bg-white/5 group-hover:bg-yellow-500/10 rounded-full flex items-center justify-center text-slate-350 group-hover:text-yellow-500 transition-all mb-4">
                    <Camera size={26} />
                  </div>
                  <span className="font-bold text-white text-base">📷 Tirar fotografia</span>
                  <span className="text-xs text-slate-500 font-semibold mt-1">Usa a câmara em tempo real</span>
                </button>

                <label className="group relative flex flex-col items-center justify-center p-8 bg-slate-900 border border-white/5 hover:border-yellow-500/30 rounded-3xl cursor-pointer transition-all shadow-xl hover:shadow-yellow-500/5">
                  <input type="file" accept="image/*" onChange={handleClientPhotoUpload} className="hidden" />
                  <div className="w-14 h-14 bg-white/5 group-hover:bg-yellow-500/10 rounded-full flex items-center justify-center text-slate-350 group-hover:text-yellow-500 transition-all mb-4">
                    <ImageIcon size={26} />
                  </div>
                  <span className="font-bold text-white text-base">🖼 Escolher fotografia</span>
                  <span className="text-xs text-slate-500 font-semibold mt-1">Escolhe da galeria do telemóvel</span>
                </label>
              </div>
            </div>
          )}

          {/* STEP 2: Body Selector */}
          {step === 2 && (
            <div className="flex-1 max-w-lg mx-auto w-full flex flex-col justify-center p-8 space-y-6">
              <div className="text-center space-y-2">
                <h1 className="text-2xl font-black text-white">Onde pretende fazer a tatuagem?</h1>
                <p className="text-xs text-slate-400 font-semibold">Selecione o género, vista e zona do corpo correspondente.</p>
              </div>

              {/* Gender and Side controls */}
              <div className="flex gap-3 justify-center">
                <div className="bg-slate-900 p-1.5 rounded-2xl flex gap-1 border border-white/5">
                  <button onClick={() => setGender('homem')} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${gender === 'homem' ? 'bg-white/10 text-white' : 'text-slate-400'}`}>Homem</button>
                  <button onClick={() => setGender('mulher')} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${gender === 'mulher' ? 'bg-white/10 text-white' : 'text-slate-400'}`}>Mulher</button>
                </div>

                <div className="bg-slate-900 p-1.5 rounded-2xl flex gap-1 border border-white/5">
                  <button onClick={() => setBodySide('frente')} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${bodySide === 'frente' ? 'bg-white/10 text-white' : 'text-slate-400'}`}>Frente</button>
                  <button onClick={() => setBodySide('costas')} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${bodySide === 'costas' ? 'bg-white/10 text-white' : 'text-slate-400'}`}>Costas</button>
                </div>
              </div>

              {/* Body Illustration Zone click simulator */}
              <div className="relative bg-slate-900/60 border border-white/5 rounded-3xl p-6 flex flex-col items-center">
                <div className="w-48 h-80 flex items-center justify-center border border-white/5 rounded-2xl bg-slate-950 relative overflow-hidden">
                  {/* Stylized mockup of a body frame */}
                  <div className="w-12 h-12 rounded-full border-2 border-slate-700/60 mt-[-100px] flex items-center justify-center text-[10px] text-slate-600 font-bold">Cabeça</div>
                  <div className="w-24 h-40 border-2 border-slate-700/60 rounded-3xl absolute top-28 flex items-center justify-center text-xs text-slate-500 font-black">
                    {bodySide === 'frente' ? 'Tronco' : 'Costas'}
                  </div>
                  <div className="absolute top-28 left-4 w-6 h-28 border-2 border-slate-700/60 rounded-full" />
                  <div className="absolute top-28 right-4 w-6 h-28 border-2 border-slate-700/60 rounded-full" />
                  
                  {bodyZone && (
                    <div className="absolute inset-0 bg-yellow-500/5 backdrop-blur-[1px] flex items-center justify-center animate-pulse">
                      <span className="bg-yellow-500 text-slate-950 font-black text-xs px-3.5 py-1.5 rounded-full shadow-lg">
                        📍 {bodyZone} ({bodySide})
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Interactive body part chips */}
              <div className="flex flex-wrap gap-2 justify-center">
                {bodyParts.map(part => (
                  <button 
                    key={part}
                    onClick={() => setBodyZone(part)}
                    className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all border ${
                      bodyZone === part 
                        ? 'bg-yellow-500 text-slate-950 border-yellow-500 shadow-lg shadow-yellow-500/20' 
                        : 'bg-slate-900 text-slate-350 border-white/5 hover:border-white/10'
                    }`}
                  >
                    {part}
                  </button>
                ))}
              </div>

              {/* Navigation */}
              <div className="flex justify-between items-center pt-4">
                <button onClick={() => setStep(1)} className="px-5 py-3.5 bg-white/5 hover:bg-white/10 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all">
                  Voltar
                </button>
                <button 
                  disabled={!bodyZone}
                  onClick={() => setStep(3)}
                  className={`px-6 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${
                    bodyZone 
                      ? 'bg-yellow-500 text-slate-950 hover:bg-yellow-400' 
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  Seguinte
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Upload Tattoo Design / References */}
          {step === 3 && (
            <div className="flex-1 max-w-lg mx-auto w-full flex flex-col justify-center p-8 space-y-6">
              <div className="text-center space-y-2">
                <h1 className="text-2xl font-black text-white">Carregar Desenho da Tatuagem</h1>
                <p className="text-xs text-slate-400 font-semibold">Envie o desenho desejado em PNG (fundo transparente preferencialmente), JPG ou WEBP.</p>
              </div>

              <div className="space-y-4">
                <label className="group relative flex flex-col items-center justify-center p-12 bg-slate-900 border-2 border-dashed border-white/10 hover:border-yellow-500/30 rounded-3xl cursor-pointer transition-all">
                  <input type="file" accept="image/*" onChange={handleTattooPngUpload} className="hidden" />
                  <div className="w-14 h-14 bg-white/5 group-hover:bg-yellow-500/10 rounded-full flex items-center justify-center text-slate-350 group-hover:text-yellow-500 transition-all mb-4">
                    <Plus size={26} />
                  </div>
                  <span className="font-bold text-white text-base">Selecionar Desenho</span>
                  <span className="text-xs text-slate-500 font-semibold mt-1">PNG, JPG ou WEBP</span>
                </label>

                {/* Templates preview */}
                <div>
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Ou escolha um estilo de exemplo</h3>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { name: 'Mandala', url: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=150&q=80' },
                      { name: 'Leão Tribal', url: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=150&q=80' },
                      { name: 'Flor Delicada', url: 'https://images.unsplash.com/photo-1565058379802-bbe93b2f703a?w=150&q=80' }
                    ].map(tpl => (
                      <button 
                        key={tpl.name}
                        onClick={() => selectTattooTemplate(tpl.url)}
                        className="group relative h-24 bg-slate-900 border border-white/5 rounded-2xl overflow-hidden hover:border-yellow-500/30 transition-all"
                      >
                        <img src={tpl.url} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-all opacity-80" />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 to-transparent flex items-end p-2.5">
                          <span className="text-[10px] font-black text-white">{tpl.name}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <div className="flex justify-between items-center pt-4">
                <button onClick={() => setStep(2)} className="px-5 py-3.5 bg-white/5 hover:bg-white/10 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all">
                  Voltar
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Loader Screen */}
          {step === 4 && (
            <div className="flex-1 flex flex-col items-center justify-center p-8 space-y-6">
              <div className="relative">
                <div className="w-20 h-20 border-4 border-yellow-500/20 border-t-yellow-500 rounded-full animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center text-2xl">✨</div>
              </div>
              <div className="text-center space-y-2">
                <h2 className="text-lg font-black text-white">A preparar a pré-visualização...</h2>
                <p className="text-xs text-slate-400 font-semibold">A carregar o editor gráfico e os ativos do projeto.</p>
              </div>
              <div className="w-48 bg-slate-900 h-2.5 rounded-full overflow-hidden border border-white/5">
                <div className="bg-yellow-500 h-full transition-all duration-150" style={{ width: `${loaderProgress}%` }} />
              </div>
            </div>
          )}

          {/* STEP 5: Canvas Editor */}
          {step === 5 && (
            <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
              {/* Canvas viewport container */}
              <div className="flex-1 bg-slate-950 relative overflow-hidden flex items-center justify-center">
                
                {/* Before / After comparisons */}
                <div 
                  ref={editorRef}
                  onPointerDown={handlePointerDown}
                  onPointerMove={handlePointerMove}
                  onPointerUp={handlePointerUp}
                  className="w-full h-full relative flex items-center justify-center cursor-move touch-none"
                >
                  {/* Base Client Photo */}
                  <img 
                    src={clientPhoto} 
                    alt="Pele do Cliente" 
                    className="max-w-full max-h-[80vh] object-contain select-none pointer-events-none rounded-2xl border border-white/5"
                  />

                  {/* Overlay Tattoo Design */}
                  {!compareMode && showTattoo && tattooPng && (
                    <img 
                      src={tattooPng}
                      alt="Tattoo Overlay"
                      className="absolute select-none pointer-events-none"
                      style={{
                        transform: `translate(${canvasState.x}px, ${canvasState.y}px) rotate(${canvasState.rotation}deg) scaleX(${canvasState.mirror ? -1 : 1})`,
                        width: `${150 * canvasState.scale}px`,
                        height: 'auto',
                        opacity: canvasState.opacity,
                        mixBlendMode: 'multiply',
                        filter: 'contrast(1.2) brightness(0.9)',
                        transition: isDragging ? 'none' : 'transform 0.1s ease-out'
                      }}
                    />
                  )}

                  {/* Comparison text overlay */}
                  {compareMode && (
                    <div className="absolute top-4 left-4 bg-slate-900/80 px-3 py-1.5 rounded-xl border border-white/10 text-[10px] font-black uppercase tracking-widest text-slate-400">
                      Fotografia Original (Sem Tatuagem)
                    </div>
                  )}
                </div>

                {/* Editor floating controls */}
                <div className="absolute top-4 right-4 flex flex-col gap-2">
                  <button onClick={handleUndo} className="p-2.5 bg-slate-900/90 hover:bg-slate-800 border border-white/10 rounded-xl text-white shadow-lg transition-all" title="Undo">
                    <Undo size={16} />
                  </button>
                  <button onClick={handleRedo} className="p-2.5 bg-slate-900/90 hover:bg-slate-800 border border-white/10 rounded-xl text-white shadow-lg transition-all" title="Redo">
                    <Redo size={16} />
                  </button>
                  <button onClick={() => setCompareMode(!compareMode)} className={`p-2.5 border rounded-xl shadow-lg transition-all flex items-center justify-center ${compareMode ? 'bg-yellow-500 text-slate-950 border-yellow-500' : 'bg-slate-900/90 hover:bg-slate-800 border-white/10 text-white'}`} title="Compare Mode">
                    <span className="text-[10px] font-black uppercase tracking-wider px-1">Antes/Depois</span>
                  </button>
                  <button onClick={() => setShowTattoo(!showTattoo)} className="p-2.5 bg-slate-900/90 hover:bg-slate-800 border border-white/10 rounded-xl text-white shadow-lg transition-all" title="Toggle Tattoo visibility">
                    {showTattoo ? <Eye size={16} /> : <EyeOff size={16} />}
                  </button>
                </div>

                <div className="absolute bottom-4 left-4 bg-slate-900/85 backdrop-blur-md px-4 py-2 border border-white/5 rounded-2xl text-[10px] font-black text-yellow-500 uppercase tracking-widest">
                  Arrasta o desenho para posicionar
                </div>
              </div>

              {/* Slider Adjustment Side Panel */}
              <div className="w-full md:w-80 bg-slate-900/90 border-t md:border-t-0 md:border-l border-white/10 p-6 flex flex-col shrink-0 space-y-6 overflow-y-auto">
                <div className="flex items-center justify-between pb-3 border-b border-white/5">
                  <div className="flex items-center gap-2 text-white">
                    <Sliders size={16} className="text-yellow-500" />
                    <span className="text-xs font-black uppercase tracking-wider">Ajustar Tatuagem</span>
                  </div>
                  <button onClick={handleReset} className="text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-all">
                    Reset
                  </button>
                </div>

                {/* Scale Slider */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold text-slate-400">
                    <span>Tamanho (Escalar)</span>
                    <span className="text-white font-mono">{Math.round(canvasState.scale * 200)}%</span>
                  </div>
                  <input 
                    type="range" min="0.1" max="2" step="0.05" 
                    value={canvasState.scale} 
                    onChange={e => updateCanvasState({ scale: parseFloat(e.target.value) })}
                    className="w-full accent-yellow-500 bg-slate-950 h-1.5 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                {/* Rotation Slider */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold text-slate-400">
                    <span>Rotação</span>
                    <span className="text-white font-mono">{canvasState.rotation}°</span>
                  </div>
                  <input 
                    type="range" min="-180" max="180" step="5" 
                    value={canvasState.rotation} 
                    onChange={e => updateCanvasState({ rotation: parseInt(e.target.value) })}
                    className="w-full accent-yellow-500 bg-slate-950 h-1.5 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                {/* Opacity Slider */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold text-slate-400">
                    <span>Opacidade</span>
                    <span className="text-white font-mono">{Math.round(canvasState.opacity * 100)}%</span>
                  </div>
                  <input 
                    type="range" min="0.2" max="1" step="0.05" 
                    value={canvasState.opacity} 
                    onChange={e => updateCanvasState({ opacity: parseFloat(e.target.value) })}
                    className="w-full accent-yellow-500 bg-slate-950 h-1.5 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                {/* Quick actions (Mirror / Duplicate / Save) */}
                <div className="grid grid-cols-2 gap-2 pt-2">
                  <button 
                    onClick={() => updateCanvasState({ mirror: !canvasState.mirror })}
                    className="py-3 bg-slate-950 hover:bg-slate-900 border border-white/5 rounded-xl font-black text-[10px] uppercase tracking-wider text-slate-300 flex items-center justify-center gap-1.5"
                  >
                    Espelhar
                  </button>
                  <button 
                    onClick={duplicateVersion}
                    className="py-3 bg-slate-950 hover:bg-slate-900 border border-white/5 rounded-xl font-black text-[10px] uppercase tracking-wider text-slate-300 flex items-center justify-center gap-1.5"
                  >
                    Duplicar Ver.
                  </button>
                </div>

                {/* Versions list gallery */}
                <div className="space-y-3 pt-2">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Variantes Criadas ({versions.length})</h4>
                  <div className="space-y-2">
                    {versions.map((ver, idx) => (
                      <div 
                        key={ver.id}
                        className={`flex items-center gap-2 p-2 rounded-xl border transition-all ${
                          currentVersionId === ver.id 
                            ? 'bg-yellow-500/10 border-yellow-500/30' 
                            : 'bg-slate-955 border-white/5 hover:border-white/10'
                        }`}
                      >
                        <button 
                          onClick={() => {
                            setCurrentVersionId(ver.id);
                            setCanvasState(ver.canvasState);
                          }}
                          className="flex-1 text-left"
                        >
                          <p className="text-xs font-bold text-white">{ver.name}</p>
                          <p className="text-[9px] text-slate-500 font-semibold">{ver.createdAt}</p>
                        </button>
                        <button onClick={() => deleteVersion(ver.id)} className="p-1.5 hover:bg-white/5 rounded text-red-500" title="Apagar Versão">
                          <Trash2 size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action navigation */}
                <div className="flex gap-2 pt-4">
                  <button onClick={saveVersion} className="flex-1 py-4 bg-slate-950 hover:bg-slate-900 border border-white/10 rounded-2xl font-black text-xs uppercase tracking-widest text-white flex items-center justify-center gap-2">
                    <Save size={14} />
                    Guardar
                  </button>
                  <button onClick={() => setStep(6)} className="flex-1 py-4 bg-yellow-500 hover:bg-yellow-400 text-slate-950 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl shadow-yellow-500/10">
                    Concluir
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 6: Project Summary / Finish */}
          {step === 6 && (
            <div className="flex-1 max-w-2xl mx-auto w-full p-6 md:p-8 space-y-6">
              <div className="text-center space-y-2">
                <h1 className="text-2xl font-black text-white">Resumo do Projeto</h1>
                <p className="text-xs text-slate-400 font-semibold">Reveja os detalhes do seu projeto de tatuagem antes de guardar ou submeter.</p>
              </div>

              {/* Project Card */}
              <div className="bg-slate-900/60 border border-white/5 rounded-[2rem] overflow-hidden shadow-2xl">
                {/* Card Header */}
                <div className="bg-gradient-to-r from-amber-500/10 to-yellow-500/10 border-b border-white/5 px-6 py-4 flex justify-between items-center">
                  <div>
                    <span className="text-[9px] font-black uppercase tracking-widest bg-yellow-500/20 text-yellow-500 px-2.5 py-1 rounded-full border border-yellow-500/30">
                      Rascunho
                    </span>
                    <h3 className="font-black text-base text-white mt-1.5">{projectTitle || 'Leão Realista'} - {bodyZone}</h3>
                  </div>
                  <span className="font-mono text-xs font-black text-yellow-500">{projectCode}</span>
                </div>

                {/* Previews Grid */}
                <div className="p-6 grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block">Pré-Visualização</span>
                    <div className="aspect-square bg-slate-950 rounded-2xl overflow-hidden border border-white/5 relative">
                      <img src={clientPhoto} alt="" className="w-full h-full object-cover" />
                      {tattooPng && showTattoo && (
                        <img 
                          src={tattooPng} alt="" 
                          className="absolute"
                          style={{
                            width: '40%',
                            left: '30%',
                            top: '30%',
                            transform: `rotate(${canvasState.rotation}deg) scaleX(${canvasState.mirror ? -1 : 1})`,
                            mixBlendMode: 'multiply',
                            opacity: canvasState.opacity
                          }}
                        />
                      )}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block">Foto Original</span>
                    <div className="aspect-square bg-slate-950 rounded-2xl overflow-hidden border border-white/5">
                      <img src={clientPhoto} alt="" className="w-full h-full object-cover" />
                    </div>
                  </div>

                  <div className="space-y-1 col-span-2 md:col-span-1">
                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block">Desenho / Referência</span>
                    <div className="aspect-square bg-slate-950 rounded-2xl overflow-hidden border border-white/5">
                      <img src={tattooPng} alt="" className="w-full h-full object-cover" />
                    </div>
                  </div>
                </div>

                {/* Input Fields / Details */}
                <div className="px-6 pb-6 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Título do Projeto</label>
                      <input 
                        type="text" placeholder="Ex: Leão Realista" 
                        value={projectTitle} onChange={e => setProjectTitle(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-950 border border-white/5 rounded-2xl text-white font-bold text-xs focus:outline-none focus:border-yellow-500 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Zona do Corpo</label>
                      <input 
                        type="text" readOnly value={bodyZone}
                        className="w-full px-4 py-3 bg-slate-955 border border-white/5 rounded-2xl text-slate-400 font-bold text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Descrição detalhada</label>
                    <textarea 
                      rows={2} placeholder="Ex: Leão realista com rosas em sombreado preto e cinza..."
                      value={projectDescription} onChange={e => setProjectDescription(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-950 border border-white/5 rounded-2xl text-white font-semibold text-xs focus:outline-none focus:border-yellow-500 transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Orçamento pretendido (€)</label>
                      <input 
                        type="number" placeholder="Ex: 350" 
                        value={budget} onChange={e => setBudget(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-950 border border-white/5 rounded-2xl text-white font-bold text-xs focus:outline-none focus:border-yellow-500 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Data pretendida</label>
                      <input 
                        type="date" 
                        value={preferredDate} onChange={e => setPreferredDate(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-950 border border-white/5 rounded-2xl text-white font-bold text-xs focus:outline-none focus:border-yellow-500 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Observações para o Tatuador</label>
                    <textarea 
                      rows={2} placeholder="Indique qualquer cicatriz, alergias ou pormenores específicos..."
                      value={notes} onChange={e => setNotes(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-950 border border-white/5 rounded-2xl text-white font-semibold text-xs focus:outline-none focus:border-yellow-500 transition-all"
                    />
                  </div>

                  {/* AI Estimated details warning */}
                  <div className="p-4 bg-slate-950 rounded-2xl border border-white/5 text-[10px] text-slate-450 leading-relaxed space-y-2">
                    <p className="font-bold text-yellow-500/80">Estoque de Estimativa Técnica:</p>
                    <p>
                      * Estilo sugerido: Preto e Cinza / Realismo<br/>
                      * Dimensões aproximadas: 15-20cm de altura (ajustável)<br/>
                      * Complexidade: Média-Alta<br/>
                      * Estimativa de duração: 1 a 2 sessões (3-5h no total)
                    </p>
                    <p className="text-slate-500 mt-1 italic border-t border-white/5 pt-1.5">
                      "Esta é uma estimativa simulada. O resultado final e planeamento real podem variar conforme a técnica do artista e anatomia da pele."
                    </p>
                  </div>
                </div>
              </div>

              {/* Form buttons */}
              <div className="flex flex-col md:flex-row gap-3 pt-2">
                <button 
                  onClick={() => setStep(5)}
                  className="w-full py-4 bg-slate-900 hover:bg-slate-800 border border-white/5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all"
                >
                  Editar Canvas
                </button>
                <button 
                  onClick={() => handleFinalSubmit(false)}
                  className="w-full py-4 bg-slate-900 hover:bg-slate-800 border border-white/10 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all"
                >
                  Guardar Rascunho
                </button>
                <button 
                  onClick={() => handleFinalSubmit(true)}
                  className="w-full py-4 bg-yellow-500 hover:bg-yellow-400 text-slate-950 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-yellow-500/10 flex items-center justify-center gap-2"
                >
                  <Send size={14} />
                  Enviar ao Estúdio
                </button>
              </div>
            </div>
          )}

        </div>
      </motion.div>
    </AnimatePresence>
  );
};
