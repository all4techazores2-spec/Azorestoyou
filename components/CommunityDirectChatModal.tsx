import React, { useEffect, useRef, useState } from 'react';
import { ArrowLeft, Check, CheckCheck, Clock3, Loader2, RotateCw, Send } from 'lucide-react';
import { SocialProfile } from '../types';
import { avatarError, CommunityIdentity, profileAvatar, socialRequest } from '../services/communitySocial';
import { useCommunityLive } from '../services/useCommunityLive';
import type { DirectMessage } from './CommunityMessages';
interface Props {isOpen:boolean;onClose:()=>void;targetUser:{name:string;handle?:string;avatar?:string}|null;myProfile:SocialProfile|null;onBookBusiness?:(category:string,id:string)=>void;onViewProfile?:(handle:string)=>void;}
export default function CommunityDirectChatModal(props:Props){if(!props.isOpen||!props.targetUser||!props.myProfile)return null;return <LiveChat key={props.targetUser.handle||props.targetUser.name} {...props}/>;}
function LiveChat({onClose,targetUser,myProfile,onViewProfile}:Props&{key?:string}){
  const [thread,setThread]=useState<string|null>(null);const [peer,setPeer]=useState<CommunityIdentity|null>(null);const [messages,setMessages]=useState<DirectMessage[]>([]);const [text,setText]=useState('');const [error,setError]=useState('');const [busy,setBusy]=useState(true);const [sending,setSending]=useState(false);const [hasMore,setHasMore]=useState(false);const [olderBusy,setOlderBusy]=useState(false);
  const [pending,setPending]=useState<{id:string;text:string;failed:boolean}[]>([]);const scroll=useRef<HTMLDivElement>(null);const stick=useRef(true);const currentThread=useRef<string|null>(null);const email=myProfile?.email||'';
  const read=async(id:string)=>{if(document.hidden||!document.hasFocus())return;await socialRequest(`conversations/${id}/read`,email,{},'PUT');};
  const knownIds=useRef(new Set<string>());const historyInitialized=useRef(false);
  const refresh=async(id=currentThread.current)=>{if(!id)return;try{
    let page=await socialRequest<{items:DirectMessage[];hasMore:boolean;readThrough?:{createdAt:string;readAt:string}}>(`conversations/${id}/messages`,email);
    const receipt=page.readThrough;
    const collected=[...page.items];const initialMore=page.hasMore;
    // Bridge every missed page after reconnecting, including gaps larger than 50 messages.
    while(knownIds.current.size&&page.hasMore&&page.items.length&&!page.items.some(m=>knownIds.current.has(m.id))){
      page=await socialRequest<{items:DirectMessage[];hasMore:boolean}>(`conversations/${id}/messages?before=${encodeURIComponent(page.items[0].id)}`,email);collected.unshift(...page.items);
    }
    if(currentThread.current!==id)return;
    collected.forEach(m=>knownIds.current.add(m.id));
    setMessages(prev=>{const map=new Map<string,DirectMessage>(prev.map(m=>[m.id,m]));collected.forEach(m=>map.set(m.id,m));return [...map.values()].map(m=>receipt&&m.senderId===myProfile?.id&&m.createdAt<=receipt.createdAt?{...m,readAt:receipt.readAt}:m).sort((a,b)=>a.createdAt.localeCompare(b.createdAt));});
    const confirmed=new Set(collected.map(m=>m.clientId));setPending(prev=>prev.filter(m=>!confirmed.has(m.id)));
    if(!historyInitialized.current){setHasMore(initialMore);historyInitialized.current=true;}
    setError('');if(collected.some(m=>m.senderId!==myProfile?.id&&!m.readAt))await read(id);
  }catch(e){setError(e.message);}};
  const status=useCommunityLive(email,event=>{if(!event.conversationId||event.conversationId===currentThread.current)refresh();});
  useEffect(()=>{let cancelled=false;setBusy(true);const handle=targetUser?.handle||targetUser?.name||'';
    socialRequest<{id:string;peer:CommunityIdentity}>('conversations',email,{handle}).then(async data=>{if(cancelled)return;currentThread.current=data.id;setThread(data.id);setPeer(data.peer);setBusy(false);await refresh(data.id);}).catch(e=>{if(!cancelled)setError(e.message);}).finally(()=>{if(!cancelled)setBusy(false);});
    const focus=()=>refresh();window.addEventListener('focus',focus);return()=>{cancelled=true;currentThread.current=null;window.removeEventListener('focus',focus);};
  },[email,targetUser?.handle,targetUser?.name]);
  useEffect(()=>{if(stick.current&&scroll.current)scroll.current.scrollTop=scroll.current.scrollHeight;},[messages.length,pending.length]);
  const send=async(value:string,id=crypto.randomUUID())=>{if(!thread||sending||!value.trim())return;setSending(true);setError('');setText('');stick.current=true;setPending(prev=>prev.some(m=>m.id===id)?prev.map(m=>m.id===id?{...m,failed:false}:m):[...prev,{id,text:value,failed:false}]);
    try{const message=await socialRequest<DirectMessage>(`conversations/${thread}/messages`,email,{text:value,clientId:id});setMessages(prev=>prev.some(m=>m.id===message.id)?prev:[...prev,message]);setPending(prev=>prev.filter(m=>m.id!==id));}
    catch(e){setPending(prev=>prev.map(m=>m.id===id?{...m,failed:true}:m));setError(e.message);}finally{setSending(false);}
  };
  const stamp=(date:string)=>new Date(date).toLocaleTimeString('pt-PT',{hour:'2-digit',minute:'2-digit'});
  return <section className="community-live-chat" role="dialog" aria-modal="true" aria-label="Conversa"><header><button aria-label="Voltar às mensagens" onClick={onClose}><ArrowLeft size={22}/></button><button className="live-chat-peer" disabled={!peer} onClick={()=>{if(peer){onClose();onViewProfile?.(peer.handle);}}}><img src={profileAvatar(peer?.avatar)} onError={avatarError} alt=""/><span><strong>{peer?.name||'A abrir conversa…'}</strong><small>{peer?.handle||''}</small></span></button></header><div className={`chat-connection ${status==='live'?'connected':''}`}>{status==='live'?'Ligação em tempo real':status==='signin'?'Termina sessão e volta a entrar para continuar.':'A restabelecer ligação… As mensagens guardadas serão recuperadas.'}</div>
    {error&&<p className="chat-error" role="alert">{error}</p>}
    <div className="live-chat-history" ref={scroll} onScroll={()=>{if(scroll.current)stick.current=scroll.current.scrollHeight-scroll.current.scrollTop-scroll.current.clientHeight<100;}}>{busy&&<div className="community-empty"><Loader2 size={24} className="animate-spin"/></div>}{hasMore&&<button className="chat-load-older" disabled={olderBusy} onClick={async()=>{if(!thread||!messages[0])return;setOlderBusy(true);const height=scroll.current?.scrollHeight||0;try{const data=await socialRequest<{items:DirectMessage[];hasMore:boolean}>(`conversations/${thread}/messages?before=${encodeURIComponent(messages[0].id)}`,email);setMessages(prev=>[...data.items.filter(m=>!prev.some(p=>p.id===m.id)),...prev]);setHasMore(data.hasMore);stick.current=false;requestAnimationFrame(()=>{if(scroll.current)scroll.current.scrollTop=scroll.current.scrollHeight-height;});}catch(e){setError(e.message);}finally{setOlderBusy(false);}}}>{olderBusy?'A carregar…':'Ver mensagens anteriores'}</button>}
      {messages.map(m=><article className={`chat-bubble ${m.senderId===myProfile?.id?'mine':''}`} key={m.id}><p>{m.text}</p><small>{stamp(m.createdAt)}{m.senderId===myProfile?.id&&(m.readAt?<CheckCheck size={14} aria-label="Lida"/>:<Check size={13} aria-label="Enviada"/>)}</small></article>)}{pending.map(m=><article className="chat-bubble mine pending" key={m.id}><p>{m.text}</p><small>{m.failed?<button onClick={()=>send(m.text,m.id)} disabled={sending}><RotateCw size={12}/>Tentar novamente</button>:<><Clock3 size={12}/>A enviar…</>}</small></article>)}
      {!busy&&!messages.length&&!pending.length&&!error&&<p className="chat-first-message">Começa a conversa com {peer?.name}.</p>}
    </div><form className="live-chat-compose" onSubmit={e=>{e.preventDefault();send(text);}}><textarea rows={1} maxLength={4000} aria-label="Mensagem" placeholder="Escreve uma mensagem…" value={text} onChange={e=>setText(e.target.value)} onKeyDown={e=>{if(e.key==='Enter'&&!e.shiftKey&&!e.nativeEvent.isComposing){e.preventDefault();send(text);}}}/><button aria-label="Enviar mensagem" disabled={!thread||sending||!text.trim()}>{sending?<Loader2 size={19} className="animate-spin"/>:<Send size={20}/>}</button></form>
  </section>;
}
