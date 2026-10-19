import React, { useEffect, useRef, useState } from 'react';
import { ArrowLeft, AtSign, Bookmark, Camera, Check, ChevronRight, Film, Heart, Loader2, MapPin, MessageCircle, Music2, Play, Plus, Send, Upload, Volume2, VolumeX, X } from 'lucide-react';
import { API_BASE_URL } from '../config';
import { SocialProfile } from '../types';
import { avatarError, communityAvatar, CommunityIdentity, CommunityReel, socialMediaUrl, socialRequest, socialTime } from '../services/communitySocial';
import CommunityFollowButton from './CommunityFollowButton';

interface Props {
  profile: SocialProfile | null; onBack: () => void; onViewProfile: (handle: string) => void;
  composeRequest: number; onComposeConsumed: () => void; initialReelId?: string | null;
}
export default function CommunityReels({ profile, onBack, onViewProfile, composeRequest, onComposeConsumed, initialReelId }: Props) {
  const [items, setItems] = useState<CommunityReel[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [nextOffset, setNextOffset] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showComposer, setShowComposer] = useState(false);
  const [commentReel, setCommentReel] = useState<string | null>(null);
  const [comment, setComment] = useState('');
  const [sending, setSending] = useState(false);
  const scroller = useRef<HTMLDivElement>(null);
  const fetching = useRef(false);
  const email = profile?.email || '';
  const load = async (offset = 0) => {
    if (!email || fetching.current) return;
    fetching.current = true; setError(''); setLoading(true);
    try {
      const data = await socialRequest<{ items: CommunityReel[]; nextOffset: number | null }>(`reels?offset=${offset}`, email);
      if (!offset && initialReelId) {
        const linked = data.items.find(r => r.id === initialReelId) || await socialRequest<CommunityReel>(`reels/${encodeURIComponent(initialReelId)}`, email);
        data.items = [linked, ...data.items.filter(r => r.id !== linked.id)];
      }
      setItems(prev => offset ? [...prev, ...data.items.filter(r => !prev.some(p => p.id === r.id))] : data.items);
      setNextOffset(data.nextOffset);
      if (!offset) setActiveId(data.items[0]?.id || null);
    } catch (e) { setError(e.message); } finally { fetching.current = false; setLoading(false); }
  };
  useEffect(() => { if (email) load(); }, [email]);
  useEffect(() => { if (composeRequest > 0) { setShowComposer(true); onComposeConsumed(); } }, [composeRequest]);
  useEffect(() => {
    if (!initialReelId || !email) return;
    let cancelled = false;
    socialRequest<CommunityReel>(`reels/${encodeURIComponent(initialReelId)}`, email).then(reel => {
      if (cancelled) return;
      setItems(prev => [reel, ...prev.filter(r => r.id !== reel.id)]); setActiveId(reel.id);
      scroller.current?.scrollTo({ top: 0 });
    }).catch(e => { if (!cancelled) setError(e.message); });
    return () => { cancelled = true; };
  }, [initialReelId, email]);
  useEffect(() => {
    const container = scroller.current;
    if (!container) return;
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) if (entry.isIntersecting && entry.intersectionRatio > .6) setActiveId((entry.target as HTMLElement).dataset.reelId || null);
    }, { root: container, threshold: [.6, .8] });
    container.querySelectorAll('[data-reel-id]').forEach(card => observer.observe(card));
    return () => observer.disconnect();
  }, [items.length]);
  useEffect(() => {
    const index = items.findIndex(r => r.id === activeId);
    if (index >= items.length - 3 && nextOffset !== null && !loading) load(nextOffset);
  }, [activeId, nextOffset]);
  const update = (reel: CommunityReel) => setItems(prev => prev.map(r => r.id === reel.id ? reel : r));
  const perform = async (reel: CommunityReel, action: 'like' | 'save', active: boolean) => {
    try { update(await socialRequest<CommunityReel>(`reels/${reel.id}/${action}`, email, { active })); }
    catch (e) { setError(e.message); }
  };
  const selected = items.find(r => r.id === commentReel);
  return <section className="community-reels" aria-label="Reels da comunidade">
    <header className="reels-header"><button aria-label="Voltar à comunidade" onClick={onBack}><ArrowLeft/></button><h1>Reels</h1><button aria-label="Publicar reel" onClick={() => setShowComposer(true)}><Camera/><Plus className="reels-camera-plus"/></button></header>
    {error && <div className="reels-error" role="alert">{error}<button onClick={() => { setError(''); if (!items.length) load(); }}>{items.length ? 'Fechar' : 'Tentar novamente'}</button></div>}
    <div className="reels-scroll" ref={scroller}>
      {items.map(reel => <ReelCard key={reel.id} reel={reel} email={email} ownId={profile?.id} active={activeId === reel.id && !showComposer && !commentReel} onViewProfile={onViewProfile} onLike={() => perform(reel, 'like', !reel.isLiked)} onSave={() => perform(reel, 'save', !reel.isSaved)} onComment={() => { setCommentReel(reel.id); setComment(''); }}/>) }
      {!items.length && <div className="reels-empty">{loading ? <Loader2 className="animate-spin" size={32}/> : <><Film size={40} strokeWidth={1.3}/><h2>Os Açores, em movimento</h2><p>Aqui aparecem os reels publicados por pessoas e negócios da comunidade.</p><button onClick={() => setShowComposer(true)}><Plus size={17}/>Publicar o primeiro reel</button></>}</div>}
      {loading && items.length > 0 && <div className="reels-loading"><Loader2 className="animate-spin"/>A carregar mais reels…</div>}
    </div>
    {showComposer && <ReelComposer profile={profile} onClose={() => setShowComposer(false)} onPublished={reel => { setItems(prev => [reel,...prev]); setActiveId(reel.id); setShowComposer(false); scroller.current?.scrollTo({top:0}); window.dispatchEvent(new Event('community-reel-published')); }}/>} 
    {selected && <div className="reels-comments-overlay" onClick={() => setCommentReel(null)}><section className="reels-comments" role="dialog" aria-modal="true" aria-label="Comentários do reel" onClick={e => e.stopPropagation()}><header><h2>Comentários · {selected.comments.length}</h2><button aria-label="Fechar comentários" onClick={() => setCommentReel(null)}><X size={20}/></button></header><div className="reels-comment-list">{!selected.comments.length && <p className="reels-comment-empty">Sê a primeira pessoa a comentar.</p>}{selected.comments.map(c => <article key={c.id}><button onClick={() => onViewProfile(c.author.handle)}><img src={socialMediaUrl(c.author.avatar) || communityAvatar} onError={avatarError} alt={c.author.name}/></button><div><strong>{c.author.name}</strong><p>{c.text}</p><small>{socialTime(c.createdAt)}</small></div></article>)}</div><form onSubmit={async e => { e.preventDefault(); if (!comment.trim() || sending) return; setSending(true); try { update(await socialRequest<CommunityReel>(`reels/${selected.id}/comments`,email,{text:comment})); setComment(''); } catch(e){setError(e.message);}finally{setSending(false);} }}><input aria-label="Comentário" placeholder="Adicionar um comentário…" value={comment} onChange={e => setComment(e.target.value)} maxLength={1000}/><button disabled={sending || !comment.trim()} aria-label="Enviar comentário">{sending ? <Loader2 size={18} className="animate-spin"/> : <Send size={18}/>}</button></form></section></div>}
  </section>;
}

function ReelCard({ reel, email, ownId, active, onViewProfile, onLike, onSave, onComment }: {key?:string;reel:CommunityReel;email:string;ownId?:string;active:boolean;onViewProfile:(handle:string)=>void;onLike:()=>void;onSave:()=>void;onComment:()=>void}) {
  const video = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);
  const [playing, setPlaying] = useState(false);
  const [mediaError, setMediaError] = useState(false);
  const [shared, setShared] = useState(false);
  const [shareError, setShareError] = useState('');
  useEffect(() => {
    const el = video.current; if (!el) return;
    if (active && !document.hidden) el.play().catch(() => setPlaying(false)); else el.pause();
    const visibility = () => { if (document.hidden) el.pause(); else if (active) el.play().catch(() => setPlaying(false)); };
    document.addEventListener('visibilitychange', visibility);
    return () => { el.pause(); document.removeEventListener('visibilitychange', visibility); };
  }, [active]);
  return <article className="reel-card" data-reel-id={reel.id}>
    <video ref={video} src={socialMediaUrl(reel.videoUrl)} playsInline loop muted={muted} preload="metadata" onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onError={() => setMediaError(true)} onClick={() => { if (!video.current) return; playing ? video.current.pause() : video.current.play().catch(() => setPlaying(false)); }} aria-label={`Reel de ${reel.author.name}`}/>
    {mediaError ? <p className="reel-media-error">Não foi possível carregar este vídeo.</p> : !playing && <button className="reel-play" aria-label="Reproduzir reel" onClick={() => video.current?.play().catch(() => setPlaying(false))}><Play fill="currentColor" size={30}/></button>}
    <button className="reel-audio" aria-label={muted ? 'Ativar som' : 'Silenciar'} onClick={() => setMuted(!muted)}>{muted ? <VolumeX size={19}/> : <Volume2 size={19}/>}</button>
    <div className="reel-actions"><button aria-label="Gostar do reel" aria-pressed={reel.isLiked} onClick={onLike}><Heart className={reel.isLiked ? 'liked' : ''}/><span>{reel.likes.toLocaleString('pt-PT')}</span></button><button aria-label="Comentários" onClick={onComment}><MessageCircle/><span>{reel.comments.length}</span></button><button aria-label="Partilhar reel" onClick={async () => { const url = `${window.location.origin}/?communityReel=${encodeURIComponent(reel.id)}`; try { if(navigator.share) await navigator.share({title:`Reel de ${reel.author.name}`,url}); else { await navigator.clipboard.writeText(url); setShared(true); setTimeout(()=>setShared(false),2000); } } catch(e) { if(e.name !== 'AbortError') setShareError('Não foi possível partilhar.'); } }}><Send/><span>{shared ? 'Copiado' : 'Partilhar'}</span></button><button aria-label="Guardar reel" aria-pressed={reel.isSaved} onClick={onSave}><Bookmark className={reel.isSaved ? 'saved' : ''}/><span>{reel.isSaved ? 'Guardado' : 'Guardar'}</span></button></div>
    <div className="reel-info"><div className="reel-author"><button onClick={() => onViewProfile(reel.author.handle)}><img src={socialMediaUrl(reel.author.avatar) || communityAvatar} alt="" onError={avatarError}/><strong>{reel.author.handle || reel.author.name}</strong></button><CommunityFollowButton email={email} targetId={reel.author.id} ownId={ownId} initial={reel.relationship} light/></div><p>{reel.caption}</p>{reel.mentions.length > 0 && <div className="reel-mentions">{reel.mentions.map(p => <button key={p.id} onClick={() => onViewProfile(p.handle)}>{p.handle}</button>)}</div>}{reel.location && <small><MapPin size={12}/>{reel.location}</small>}<small><Music2 size={12}/>Áudio original · {reel.author.name}</small>{shareError && <small role="alert">{shareError}</small>}</div>
  </article>;
}

function ReelComposer({ profile, onClose, onPublished }: {profile:SocialProfile|null;onClose:()=>void;onPublished:(r:CommunityReel)=>void}) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState('');
  const [caption, setCaption] = useState('');
  const [location, setLocation] = useState('');
  const [mentions, setMentions] = useState<CommunityIdentity[]>([]);
  const [showMentions, setShowMentions] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<CommunityIdentity[]>([]);
  const [searching, setSearching] = useState(false);
  const [busy, setBusy] = useState(false);
  const [stage, setStage] = useState('');
  const [error, setError] = useState('');
  const [uploadedUrl, setUploadedUrl] = useState('');
  const fileInput = useRef<HTMLInputElement>(null);
  useEffect(() => { if (!file) { setPreview(''); return; } const url=URL.createObjectURL(file);setPreview(url); return ()=>URL.revokeObjectURL(url); },[file]);
  useEffect(() => {
    if (!showMentions || !profile?.email) return;
    const controller = new AbortController();
    setSearching(true);
    const timer = setTimeout(() => socialRequest<CommunityIdentity[]>(`mentions?q=${encodeURIComponent(query)}`,profile.email,undefined,undefined,controller.signal).then(setResults).catch(e => {if(e.name !== 'AbortError') setError(e.message);}).finally(()=>{if(!controller.signal.aborted)setSearching(false);}),250);
    return ()=>{clearTimeout(timer);controller.abort();};
  },[query,showMentions,profile?.email]);
  const publish = async () => {
    if (!file || !profile?.email || busy) return;
    setBusy(true);setError('');
    try {
      let videoUrl=uploadedUrl;
      if (!videoUrl) {
        setStage('A carregar o vídeo…');
        const form = new FormData(); form.append('userEmail',profile.email);form.append('video',file);
        const response=await fetch(`${API_BASE_URL}/api/community/reel-upload`,{method:'POST',body:form});
        const data=await response.json();if(!response.ok)throw new Error(data.error || 'Não foi possível carregar o vídeo.');
        videoUrl=data.url;setUploadedUrl(videoUrl);
      }
      setStage('A publicar…');
      const reel=await socialRequest<CommunityReel>('reels',profile.email,{videoUrl,caption,location,mentions:mentions.map(p=>p.id)});
      onPublished(reel);
    } catch(e){setError(e.message);}finally{setBusy(false);setStage('');}
  };
  return <section className="community-overlay reel-composer" role="dialog" aria-modal="true" aria-label="Novo reel"><header><button aria-label="Cancelar publicação" onClick={onClose} disabled={busy}><ArrowLeft size={21}/></button><h2>Novo reel</h2><button className="reel-publish" disabled={busy || !file || !profile?.email} onClick={publish}>{busy ? <Loader2 className="animate-spin" size={17}/> : 'Publicar'}</button></header><div className="reel-composer-body">
    {error && <p className="reel-form-error" role="alert">{error}</p>}
    <div className="reel-compose-preview">{preview ? <video src={preview} controls playsInline/> : <button onClick={()=>fileInput.current?.click()}><Upload size={30} strokeWidth={1.3}/><strong>Escolhe o teu vídeo</strong><span>MP4, WebM ou MOV · até 100 MB</span></button>}<textarea aria-label="Legenda do reel" placeholder="Escrever legenda…" value={caption} maxLength={2200} disabled={busy} onChange={e=>setCaption(e.target.value)}/></div>
    <input ref={fileInput} type="file" accept="video/mp4,video/webm,video/quicktime" className="hidden" disabled={busy} onChange={e=>{const next=e.target.files?.[0];if(!next)return;if(next.size>100*1024*1024){setError('O vídeo deve ter no máximo 100 MB.');return;}if(!['video/mp4','video/webm','video/quicktime'].includes(next.type)){setError('Escolhe um vídeo MP4, WebM ou MOV.');return;}setFile(next);setUploadedUrl('');setError('');}}/>
    {file && <button className="reel-compose-row" disabled={busy} onClick={()=>fileInput.current?.click()}><Film size={20}/><span>Alterar vídeo<small>{file.name}</small></span><ChevronRight size={17}/></button>}
    <button className="reel-compose-row" disabled={busy} onClick={()=>setShowMentions(!showMentions)}><AtSign size={22}/><span>Identificar pessoas ou negócios<small>{mentions.length ? `${mentions.length} identificações` : 'Procura pelo nome ou identificador'}</small></span><ChevronRight size={17}/></button>
    {showMentions && <div className="reel-mention-picker"><label className="community-search"><AtSign size={16}/><input aria-label="Pesquisar pessoas ou negócios" placeholder="Nome ou @utilizador" value={query} onChange={e=>setQuery(e.target.value)}/></label>{searching && <Loader2 size={18} className="animate-spin"/>}{!searching && !results.length && <p>Nenhum perfil encontrado.</p>}{results.map(p=><button key={p.id} className="reel-mention-result" disabled={busy || (mentions.length>=20 && !mentions.some(m=>m.id===p.id))} aria-pressed={mentions.some(m=>m.id===p.id)} onClick={()=>setMentions(prev=>prev.some(m=>m.id===p.id)?prev.filter(m=>m.id!==p.id):[...prev,p])}><img src={socialMediaUrl(p.avatar)||communityAvatar} onError={avatarError} alt=""/><span><strong>{p.name}</strong><small>{p.handle} · {p.isBusiness?'Negócio':'Pessoa'}</small></span>{mentions.some(m=>m.id===p.id)?<Check size={18}/>:<Plus size={18}/>}</button>)}</div>}
    <label className="reel-compose-row"><MapPin size={21}/><span>Adicionar localização<input aria-label="Localização do reel" placeholder="Onde foi gravado?" value={location} maxLength={160} disabled={busy} onChange={e=>setLocation(e.target.value)}/></span></label>
    <div className="reel-tag-chips">{mentions.map(p=><button key={p.id} disabled={busy} onClick={()=>setMentions(prev=>prev.filter(m=>m.id!==p.id))}>{p.handle}<X size={12}/></button>)}</div>
    <p className="reel-publish-note">O teu reel fica visível na comunidade. Quem te segue e também é seguido por ti recebe uma notificação.</p>
    {busy && <p className="reel-upload-stage" role="status"><Loader2 size={17} className="animate-spin"/>{stage}</p>}
  </div></section>;
}
