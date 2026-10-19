import React, { useEffect, useState } from 'react';
import { ArrowLeft, Bell, Loader2, Play } from 'lucide-react';
import { SocialProfile } from '../types';
import { avatarError, communityAvatar, CommunityNotification, socialMediaUrl, socialRequest, socialTime } from '../services/communitySocial';
import CommunityFollowButton from './CommunityFollowButton';

interface Props {
  isOpen: boolean; onClose: () => void; profile?: SocialProfile | null;
  onSelectProfile?: (handle: string) => void; onSelectPost?: (id: number) => void;
  onOpenReel?: (id: string) => void; onOpenReservations?: () => void;
}
export default function CommunityNotificationsModal({isOpen,onClose,profile,onSelectProfile,onOpenReel}: Props) {
  const [filter,setFilter]=useState('Todas');
  const [items,setItems]=useState<CommunityNotification[]>([]);
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState('');
  const [marking,setMarking]=useState(false);
  const email=profile?.email || '';
  useEffect(()=>{
    if(!isOpen || !email)return;
    const controller=new AbortController();
    setLoading(true);setError('');
    const load=()=>socialRequest<{items:CommunityNotification[]}>('notifications',email,undefined,undefined,controller.signal).then(data=>setItems(data.items)).catch(e=>{if(e.name!=='AbortError')setError(e.message);}).finally(()=>{if(!controller.signal.aborted)setLoading(false);});
    load(); const timer=setInterval(()=>{if(!document.hidden)load();},30000);
    return ()=>{controller.abort();clearInterval(timer);};
  },[isOpen,email]);
  if(!isOpen)return null;
  const visible=items.filter(n=>filter==='Todas'||(filter==='Seguidores'?n.type==='follow':n.type==='reel'));
  const read=async(id?:string)=>{
    if(!email)return;
    setMarking(true);
    try{await socialRequest('notifications/read',email,id?{id}:{},'PUT');setItems(prev=>prev.map(n=>(!id||n.id===id)?{...n,read:true}:n));window.dispatchEvent(new Event('community-notifications-changed'));}
    catch(e){setError(e.message);}finally{setMarking(false);}
  };
  return <section className="community-overlay community-activity" role="dialog" aria-modal="true" aria-label="Notificações"><header><button aria-label="Voltar" onClick={onClose}><ArrowLeft size={21}/></button><h2>Notificações</h2><button className="activity-mark-read" disabled={marking||!items.some(n=>!n.read)} onClick={()=>read()}>{marking?<Loader2 size={16} className="animate-spin"/>:'Marcar lidas'}</button></header><div className="community-filters">{['Todas','Seguidores','Reels'].map(tab=><button key={tab} className={filter===tab?'selected':'bg-slate-100'} onClick={()=>setFilter(tab)}>{tab}</button>)}</div><div className="activity-list">
    {error&&<p className="reel-form-error" role="alert">{error}</p>}
    {loading&&<div className="community-empty"><Loader2 className="animate-spin"/></div>}
    {!loading&&!visible.length&&<div className="community-empty"><Bell size={32} strokeWidth={1.3}/><h3>Estás em dia</h3><p>Os novos seguidores e os reels de quem te segue de volta aparecem aqui.</p></div>}
    {visible.map(n=><article className={`activity-row ${n.read?'':'unread'}`} key={n.id}><button aria-label={`Ver perfil de ${n.actor.name}`} onClick={()=>{onClose();onSelectProfile?.(n.actor.handle);}}><img src={socialMediaUrl(n.actor.avatar)||communityAvatar} onError={avatarError} alt=""/></button><button className="activity-text" onClick={()=>{read(n.id);if(n.type==='reel'&&n.reelId){onClose();onOpenReel?.(n.reelId);}else{onClose();onSelectProfile?.(n.actor.handle);}}}><p><strong>{n.actor.name}</strong> {n.type==='reel'?'publicou um reel':'começou a seguir-te'}</p><small>{n.type==='reel'?'Seguiam-se mutuamente · ':''}{socialTime(n.createdAt)}</small></button>{n.type==='follow'?<CommunityFollowButton email={email} ownId={profile?.id} targetId={n.actor.id}/>:<button className="activity-reel-thumb" aria-label={`Ver reel de ${n.actor.name}`} onClick={()=>{read(n.id);onClose();if(n.reelId)onOpenReel?.(n.reelId);}}><video src={socialMediaUrl(n.videoUrl)} muted preload="metadata" playsInline/><Play size={17} fill="white"/></button>}</article>)}
  </div></section>;
}
