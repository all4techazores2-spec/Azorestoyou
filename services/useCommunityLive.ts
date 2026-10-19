import { useEffect, useRef, useState } from 'react';
import { API_BASE_URL } from '../config';
import { getCommunityToken } from './communitySession';
export interface LiveEvent {type:string;conversationId?:string;}
export type LiveStatus='connecting'|'live'|'reconnecting'|'signin';
type Listener={event:(event:LiveEvent)=>void;status:(status:LiveStatus)=>void};
const connections=new Map<string,{listeners:Set<Listener>;stop:()=>void;status:LiveStatus}>();
window.addEventListener('community-session-changed',()=>{for(const connection of connections.values())connection.stop();connections.clear();});
function subscribe(email:string,listener:Listener){
  let connection=connections.get(email);
  if(!connection){
    const listeners=new Set<Listener>();let stopped=false;let controller:AbortController|null=null;let timer:ReturnType<typeof setTimeout>|null=null;let failures=0;
    connection={listeners,status:'connecting',stop:()=>{stopped=true;controller?.abort();if(timer)clearTimeout(timer);}};connections.set(email,connection);
    const status=(value:LiveStatus)=>{connection!.status=value;for(const l of listeners)l.status(value);};
    const dispatch=(event:LiveEvent)=>{for(const l of listeners)l.event(event);};
    const connect=async()=>{
      if(stopped)return;const token=getCommunityToken(email);if(!token){status('signin');return;}
      controller=new AbortController();status(failures?'reconnecting':'connecting');
      try{
        const response=await fetch(`${API_BASE_URL}/api/community/realtime`,{headers:{Authorization:`Bearer ${token}`,Accept:'text/event-stream'},signal:controller.signal});
        if(response.status===401){status('signin');return;}if(!response.ok||!response.body)throw new Error('Disconnected');
        status('live');failures=0;dispatch({type:'resync'});const reader=response.body.getReader();const decoder=new TextDecoder();let buffer='';
        while(!stopped){const {value,done}=await reader.read();if(done)break;buffer+=decoder.decode(value,{stream:true});let boundary;
          while((boundary=buffer.indexOf('\n\n'))>=0){const frame=buffer.slice(0,boundary);buffer=buffer.slice(boundary+2);const data=frame.split('\n').filter(line=>line.startsWith('data:')).map(line=>line.slice(5).trim()).join('\n');if(data){try{dispatch(JSON.parse(data));}catch{}}}
        }
      }catch(e){if(stopped)return;}
      if(!stopped){failures++;status('reconnecting');dispatch({type:'resync'});timer=setTimeout(connect,Math.min(15000,1000*2**Math.min(failures,4)));}
    };
    queueMicrotask(connect);
  }
  connection.listeners.add(listener);listener.status(connection.status);
  return()=>{connection!.listeners.delete(listener);if(!connection!.listeners.size){connection!.stop();if(connections.get(email)===connection)connections.delete(email);}};
}
export function useCommunityLive(email:string,onEvent:(event:LiveEvent)=>void){
  const callback=useRef(onEvent);callback.current=onEvent;const [status,setStatus]=useState<LiveStatus>('connecting');const [session,setSession]=useState(0);
  useEffect(()=>{const refresh=()=>setSession(n=>n+1);window.addEventListener('community-session-changed',refresh);return()=>window.removeEventListener('community-session-changed',refresh);},[]);
  useEffect(()=>{if(!email)return;return subscribe(email,{event:e=>callback.current(e),status:setStatus});},[email,session]);
  useEffect(()=>{if(!email)return;const visible=()=>{if(!document.hidden)callback.current({type:'resync'});};document.addEventListener('visibilitychange',visible);const timer=setInterval(()=>{if(!document.hidden&&status==='reconnecting')callback.current({type:'resync'});},10000);return()=>{document.removeEventListener('visibilitychange',visible);clearInterval(timer);};},[email,status]);
  return status;
}
