import React, { useEffect, useRef, useState } from 'react';
import { ArrowLeft, AtSign, Bookmark, Camera, Check, ChevronRight, Film, Heart, Loader2, MapPin, MessageCircle, Music2, Play, Plus, Send, Upload, Volume2, VolumeX, X } from 'lucide-react';
import { API_BASE_URL } from '../config';
import { SocialProfile } from '../types';
import { avatarError, communityAvatar, CommunityIdentity, CommunityReel, socialMediaUrl, socialRequest, socialTime } from '../services/communitySocial';
import ReelCard from './CommunityReelCard';
import ReelComposer from './ReelComposer';

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
