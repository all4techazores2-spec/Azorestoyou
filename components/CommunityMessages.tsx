import React, { useEffect, useRef, useState } from 'react';
import { ChevronRight, Loader2, MessageCircle, RefreshCw, Search, SquarePen, X } from 'lucide-react';
import { CommunityIdentity, avatarError, profileAvatar, socialRequest, socialTime } from '../services/communitySocial';
import { useCommunityLive } from '../services/useCommunityLive';
import { SocialProfile } from '../types';
export interface DirectMessage {id:string;conversationId:string;senderId:string;text:string;clientId:string;createdAt:string;readAt:string|null;}
export interface Conversation {id:string;peer:CommunityIdentity;lastMessage:DirectMessage|null;unread:number;updatedAt:string;}
export default function CommunityMessages({profile,onOpen}:{profile:SocialProfile|null;onOpen:(handle:string)=>void}){
  const [items,setItems]=useState<Conversation[]>([]);
  const [contacts,setContacts]=useState<CommunityIdentity[]>([]);
  const [query,setQuery]=useState('');
  const [newChat,setNewChat]=useState(false);
  const [unreadOnly,setUnreadOnly]=useState(false);
  const [error,setError]=useState('');
  const [busy,setBusy]=useState(false);
  const email=profile?.email||'';
  const [sessionVer,setSessionVer]=useState(0);
  const refreshing=useRef<boolean>(false);
  const refresh=async()=>{
    if(!email||refreshing.current)return;
    refreshing.current=true;
    try{const data=await socialRequest<Conversation[]>('conversations',email);setItems(data);setError('');}
    catch(e:any){setError(e.message);}
    finally{refreshing.current=false;}
  };
  const status=useCommunityLive(email,e=>{if(['message','read','ready','resync'].includes(e.type))refresh();});
  useEffect(()=>{
    const onSessionChange=()=>{setSessionVer(v=>v+1);};
    window.addEventListener('community-session-changed',onSessionChange);
    return()=>window.removeEventListener('community-session-changed',onSessionChange);
  },[]);
  useEffect(()=>{setBusy(true);refresh().finally(()=>setBusy(false));},[email,sessionVer]);
  useEffect(()=>{
    if(!email||(!newChat&&!query.trim())){setContacts([]);return;}
    const controller=new AbortController();
    const qEnc=encodeURIComponent(query);
    const url=`contacts?q=${qEnc}`;
    const timer=setTimeout(()=>socialRequest<CommunityIdentity[]>(url,email,undefined,undefined,controller.signal).then(setContacts).catch(e=>{if(e.name!=='AbortError')setError(e.message);}),250);
    return()=>{clearTimeout(timer);controller.abort();};
  },[email,query,newChat]);
  const visible=items.filter(c=>(!unreadOnly||c.unread>0)&&`${c.peer.name} ${c.peer.handle}`.toLowerCase().includes(query.toLowerCase()));
  const statusLabel=status==='live'?'Atualizações em tempo real':status==='signin'?'A renovar sessão...':'A restabelecer ligação...';
  const lastMsg=(c:Conversation)=>c.lastMessage?(c.lastMessage.senderId===profile?.id?'Tu: ':'')+c.lastMessage.text:'Iniciar conversa';
  return (
    <section className="community-inbox">
      <header>
        <div><h1>Mensagens</h1><small>{statusLabel}</small></div>
        <button aria-label={newChat?'Fechar nova conversa':'Nova conversa'} onClick={()=>setNewChat(!newChat)}>
          {newChat?<X size={21}/>:<SquarePen size={21}/>}
        </button>
      </header>
      <label className="community-search"><Search size={17}/><input placeholder="Pesquisar pessoas, negócios ou mensagens" aria-label="Pesquisar conversas" value={query} onChange={e=>setQuery(e.target.value)}/></label>
      {!newChat&&(<div className="community-filters"><button className={!unreadOnly?'selected':''} onClick={()=>setUnreadOnly(false)}>Todas</button><button className={unreadOnly?'selected':''} onClick={()=>setUnreadOnly(true)}>Não lidas {items.filter(c=>c.unread>0).length||''}</button></div>)}
      {error&&(<p className="reel-form-error" role="alert">{error}<button style={{marginLeft:8,background:'none',border:'none',cursor:'pointer',color:'inherit',display:'inline-flex',alignItems:'center',gap:4}} onClick={()=>{setError('');setBusy(true);refresh().finally(()=>setBusy(false));}}><RefreshCw size={14}/>Tentar novamente</button></p>)}
      {busy&&<div className="community-empty"><Loader2 className="animate-spin" size={24}/></div>}
      {!newChat&&visible.map(c=>(<button className="inbox-row" key={c.id} onClick={()=>onOpen(c.peer.handle)}><img src={profileAvatar(c.peer.avatar)} onError={avatarError} alt=""/><span><strong>{c.peer.name}</strong><small>{lastMsg(c)}</small></span><aside><small>{socialTime(c.updatedAt)}</small>{c.unread>0&&<b>{c.unread>99?'99+':c.unread}</b>}</aside></button>))}
      {(newChat||!!query)&&(<div className="inbox-contacts"><h2>{newChat?'Nova conversa':'Pessoas e negócios'}</h2>{contacts.map(p=>(<button className="inbox-row" key={p.id} onClick={()=>onOpen(p.handle)}><img src={profileAvatar(p.avatar)} onError={avatarError} alt=""/><span><strong>{p.name}</strong><small>{p.handle}{p.isBusiness?' · Negócio':''}</small></span><ChevronRight size={17}/></button>))}</div>)}
      {!busy&&!error&&!items.length&&!newChat&&!query&&(<div className="community-empty"><MessageCircle size={35} strokeWidth={1.3}/><h3>As tuas conversas começam aqui</h3><p>Fala com pessoas e negócios da comunidade.</p><button onClick={()=>setNewChat(true)}>Nova conversa</button></div>)}
    </section>
  );
}
