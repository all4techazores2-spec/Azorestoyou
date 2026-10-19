import React, { useEffect, useRef, useState } from 'react';
import { Camera, CameraOff, Check, FlipHorizontal2, Images, Loader2, Music2, Timer, X, Zap, ZapOff } from 'lucide-react';

interface Props { onClose:()=>void; onSelect:(file:File)=>void; musicLabel?:string; onMusic:()=>void; }
export default function ReelCamera({onClose,onSelect,musicLabel,onMusic}:Props) {
  const [mode,setMode]=useState<'photo'|'video'>('video');
  const [stream,setStream]=useState<MediaStream|null>(null);
  const [facing,setFacing]=useState<'environment'|'user'>('environment');
  const [opening,setOpening]=useState(false);
  const [recording,setRecording]=useState(false);
  const [elapsed,setElapsed]=useState(0);
  const [limit,setLimit]=useState(60);
  const [timer,setTimer]=useState(0);
  const [countdown,setCountdown]=useState(0);
  const [torch,setTorch]=useState(false);
  const [hasTorch,setHasTorch]=useState(false);
  const [error,setError]=useState('');
  const camera=useRef<HTMLVideoElement>(null);
  const live=useRef<MediaStream|null>(null);
  const recorder=useRef<MediaRecorder|null>(null);
  const clock=useRef<ReturnType<typeof setInterval>|null>(null);
  const delay=useRef<ReturnType<typeof setInterval>|null>(null);
  const disposed=useRef(false);
  const gallery=useRef<HTMLInputElement>(null);
  const nativeCamera=useRef<HTMLInputElement>(null);
  const endStream=()=>{live.current?.getTracks().forEach(track=>track.stop());live.current=null;};
  const useNativeCamera=()=>{endStream();setStream(null);nativeCamera.current?.click();};
  useEffect(()=>{disposed.current=false;return()=>{disposed.current=true;if(clock.current)clearInterval(clock.current);if(delay.current)clearInterval(delay.current);if(recorder.current?.state==='recording')recorder.current.stop();endStream();};},[]);
  useEffect(()=>{if(camera.current&&stream){camera.current.srcObject=stream;camera.current.play().catch(()=>{});}},[stream]);
  const open=async(nextFacing=facing,nextMode=mode)=>{
    if(opening||recording)return;
    if(!navigator.mediaDevices?.getUserMedia){useNativeCamera();return;}
    endStream();setStream(null);setOpening(true);setError('');
    try{
      const media=await navigator.mediaDevices.getUserMedia({video:{facingMode:{ideal:nextFacing},width:{ideal:1080},height:{ideal:1920}},audio:nextMode==='video'});
      if(disposed.current){media.getTracks().forEach(t=>t.stop());return;}
      live.current=media;setStream(media);setFacing(nextFacing);setTorch(false);
      setHasTorch(!!(media.getVideoTracks()[0]?.getCapabilities?.() as {torch?:boolean})?.torch);
    }catch(e){if(!disposed.current)setError(e.name==='NotAllowedError'?'Permite o acesso à câmara e ao microfone, ou usa a câmara do telemóvel abaixo.':'Não foi possível abrir a câmara. Podes usar a câmara do telemóvel ou a galeria.');}
    finally{if(!disposed.current)setOpening(false);}
  };
  const stopRecording=()=>{if(recorder.current?.state==='recording')recorder.current.stop();if(clock.current)clearInterval(clock.current);};
  const capture=async()=>{
    if(!live.current){await open();return;}
    setError('');
    if(mode==='photo'){
      const el=camera.current;if(!el?.videoWidth){setError('Aguarda até a câmara estar pronta.');return;}
      const canvas=document.createElement('canvas');canvas.width=el.videoWidth;canvas.height=el.videoHeight;const context=canvas.getContext('2d');if(!context)return;
      if(facing==='user'){context.translate(canvas.width,0);context.scale(-1,1);}context.drawImage(el,0,0);
      canvas.toBlob(blob=>{if(blob&&!disposed.current)onSelect(new File([blob],`fotografia-${Date.now()}.jpg`,{type:'image/jpeg'}));},'image/jpeg',.9);
      return;
    }
    if(typeof MediaRecorder==='undefined'){useNativeCamera();return;}
    try{
      const mime=['video/mp4;codecs=avc1,mp4a.40.2','video/mp4','video/webm;codecs=vp8,opus','video/webm'].find(t=>MediaRecorder.isTypeSupported(t));
      const next=new MediaRecorder(live.current,{...(mime?{mimeType:mime}:{}),videoBitsPerSecond:3500000,audioBitsPerSecond:128000});const chunks:Blob[]=[];let bytes=0;let failed=false;
      recorder.current=next;
      next.ondataavailable=e=>{if(e.data.size){chunks.push(e.data);bytes+=e.data.size;if(bytes>100*1024*1024)stopRecording();}};
      next.onstop=()=>{if(clock.current)clearInterval(clock.current);if(disposed.current)return;setRecording(false);setElapsed(0);if(failed)return;if(bytes>100*1024*1024){setError('O vídeo ultrapassou 100 MB. Grava um trecho mais curto.');return;}if(!chunks.length){setError('Não foi possível guardar a gravação. Tenta novamente.');return;}const type=next.mimeType.includes('mp4')?'video/mp4':'video/webm';onSelect(new File(chunks,`video-${Date.now()}.${type==='video/mp4'?'mp4':'webm'}`,{type}));};
      next.onerror=()=>{failed=true;if(clock.current)clearInterval(clock.current);if(!disposed.current){setRecording(false);setError('A gravação foi interrompida. Tenta novamente.');}};
      next.start(1000);setRecording(true);setElapsed(0);const start=Date.now();
      clock.current=setInterval(()=>{const seconds=Math.floor((Date.now()-start)/1000);setElapsed(seconds);if(seconds>=limit)stopRecording();},200);
    }catch{setError('Este navegador não permite gravar aqui. Usa a câmara do telemóvel.');}
  };
  const shutter=()=>{
    if(recording){stopRecording();return;}
    if(countdown){if(delay.current)clearInterval(delay.current);setCountdown(0);return;}
    if(!stream||!timer){capture();return;}
    let remaining=timer;setCountdown(remaining);delay.current=setInterval(()=>{remaining--;setCountdown(remaining);if(remaining<=0){if(delay.current)clearInterval(delay.current);capture();}},1000);
  };
  const switchMode=(next:'photo'|'video')=>{if(recording||opening||countdown)return;setMode(next);if(live.current)open(facing,next);};
  const choose=(file?:File)=>{if(!file)return;const video=file.type.startsWith('video/');if(!['image/jpeg','image/png','image/webp','video/mp4','video/webm','video/quicktime'].includes(file.type)){setError('Escolhe uma fotografia JPG, PNG ou WebP, ou um vídeo MP4, WebM ou MOV.');return;}if(file.size>(video?100:20)*1024*1024){setError(video?'O vídeo deve ter no máximo 100 MB.':'A fotografia deve ter no máximo 20 MB.');return;}onSelect(file);};
  return <section className="reel-camera" aria-label="Criar fotografia ou vídeo">
    {stream&&<video className={facing==='user'?'mirrored':''} ref={camera} autoPlay playsInline muted/>}
    <header><button aria-label="Fechar câmara" disabled={recording} onClick={onClose}><X size={25}/></button><h2>Criar</h2><span>AZORES<span>TOYOU</span></span></header>
    {!stream&&<div className="camera-start"><Camera size={42} strokeWidth={1.2}/><h3>O teu próximo momento</h3><p>Fotografa ou grava os Açores à tua maneira.</p><button disabled={opening} onClick={()=>open()}>{opening?<Loader2 className="animate-spin" size={18}/>:<Camera size={18}/>}Ativar câmara</button></div>}
    {recording&&<div className="camera-record-time"><i/>{`0:${String(elapsed).padStart(2,'0')} / ${limit}s`}</div>}
    {countdown>0&&<div className="camera-countdown" role="status">{countdown}</div>}
    <div className="camera-toolbar"><button disabled={!stream||recording||opening||!!countdown} onClick={()=>open(facing==='environment'?'user':'environment')}><FlipHorizontal2/><span>Virar</span></button><button disabled={!hasTorch||recording||!!countdown} title={hasTorch?'Ligar ou desligar flash':'Flash indisponível nesta câmara'} onClick={async()=>{try{await live.current?.getVideoTracks()[0]?.applyConstraints({advanced:[{torch:!torch}] as any});setTorch(!torch);}catch{setError('O flash não está disponível nesta câmara.');}}}>{torch?<Zap/>:<ZapOff/>}<span>Flash</span></button><button disabled={recording||!!countdown} onClick={()=>setTimer(timer===0?3:timer===3?10:0)}><Timer/><span>{timer?`${timer}s`:'Temporizador'}</span></button></div>
    {error&&<p className="camera-error" role="alert">{error}<button onClick={useNativeCamera}><Camera size={16}/>Câmara do telemóvel</button></p>}
    <div className="camera-controls"><button className="camera-music" disabled={recording||!!countdown} onClick={onMusic}><Music2 size={16}/><span>{musicLabel||'Adicionar música'}</span></button><div className="camera-modes"><button disabled={recording||!!countdown} className={mode==='photo'?'selected':''} onClick={()=>switchMode('photo')}>Fotografia</button><button disabled={recording||!!countdown} className={mode==='video'?'selected':''} onClick={()=>switchMode('video')}>Vídeo</button></div>{mode==='video'&&<div className="camera-durations">{[15,60].map(n=><button key={n} disabled={recording||!!countdown} className={limit===n?'selected':''} onClick={()=>setLimit(n)}>{n} s</button>)}</div>}<div className="camera-shutter-row"><button disabled={recording||!!countdown} onClick={()=>gallery.current?.click()}><Images size={29}/><span>Galeria</span></button><button className={`camera-shutter ${recording?'recording':''}`} aria-label={recording?'Terminar gravação':countdown?'Cancelar temporizador':mode==='photo'?'Tirar fotografia':'Gravar vídeo'} disabled={opening} onClick={shutter}><span>{recording&&<Check size={25}/>}</span></button><button disabled={recording||!!countdown} onClick={useNativeCamera}><Camera size={29}/><span>Câmara</span></button></div><p>{recording?'Toca para terminar':mode==='photo'?'Toca para fotografar':'Toca para gravar'}</p></div>
    <input ref={gallery} type="file" accept="image/jpeg,image/png,image/webp,video/mp4,video/webm,video/quicktime" hidden onChange={e=>choose(e.target.files?.[0])}/><input ref={nativeCamera} type="file" accept={mode==='photo'?'image/jpeg':'video/*'} capture={facing} hidden onChange={e=>choose(e.target.files?.[0])}/>
  </section>;
}
