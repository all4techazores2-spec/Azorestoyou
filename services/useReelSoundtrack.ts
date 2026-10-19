import { useEffect, useRef, useState } from 'react';
import { ReelMusic } from './communitySocial';

export function useReelSoundtrack(video: {current:HTMLVideoElement|null}, music:ReelMusic|null|undefined, active:boolean, playing:boolean, muted:boolean) {
  const audio=useRef<HTMLAudioElement>(null);
  const [unavailable,setUnavailable]=useState(false);
  const expected=()=>music?music.start+((video.current?.currentTime||0)%music.duration):0;
  const sync=()=>{const el=audio.current;if(!el||!music)return;const time=expected();if(Number.isFinite(time)&&(Math.abs(el.currentTime-time)>.5||el.currentTime<music.start||el.currentTime>=music.start+music.duration))try{el.currentTime=time;}catch{}};
  const start=(audible=!muted)=>{
    const el=audio.current;if(!el||!music||!active||!audible)return;
    sync();el.volume=music.volume;el.muted=false;
    el.play().then(()=>setUnavailable(false)).catch(()=>setUnavailable(true));
  };
  useEffect(()=>{
    const el=audio.current;if(!el)return;
    if(active&&playing&&!muted&&music)start();else el.pause();
    const visibility=()=>{if(document.hidden)el.pause();else if(active&&playing&&!muted)start();};
    document.addEventListener('visibilitychange',visibility);
    return()=>{el.pause();document.removeEventListener('visibilitychange',visibility);};
  },[active,playing,muted,music?.id,music?.start,music?.duration,music?.volume]);
  const onTimeUpdate=()=>{const el=audio.current;if(!el||!music)return;if(el.currentTime>=music.start+music.duration||el.currentTime<music.start)el.currentTime=music.start;};
  return {audio,start,sync,onTimeUpdate,unavailable,onError:()=>setUnavailable(true)};
}
