import React, { useEffect, useRef, useState } from 'react';
import { ArrowLeft, AtSign, Bell, Camera, Check, ChevronRight, Film, Globe2, Image, Loader2, MapPin, Music2, Play, Plus, Save, Volume2, VolumeX, X } from 'lucide-react';
import { API_BASE_URL } from '../config';
import { SocialProfile } from '../types';
import { avatarError, communityAvatar, CommunityIdentity, CommunityReel, ReelMusic, musicPlaybackUrl, socialMediaUrl, socialRequest } from '../services/communitySocial';
import { readReelDraft, ReelDraft, writeReelDraft } from '../services/reelDrafts';
import { useReelSoundtrack } from '../services/useReelSoundtrack';
import ReelCamera from './ReelCamera';
import ReelMusicPicker, { musicTime } from './ReelMusicPicker';

export default function ReelComposer({profile,onClose,onPublished}:{profile:SocialProfile|null;onClose:()=>void;onPublished:(r:CommunityReel)=>void}) {
  const [step,setStep]=useState<'capture'|'review'>('capture');const [file,setFile]=useState<File|null>(null);const [preview,setPreview]=useState('');
  const [cover,setCover]=useState<File|null>(null);const [coverPreview,setCoverPreview]=useState('');
  const [caption,setCaption]=useState('');const [location,setLocation]=useState('');const [mentions,setMentions]=useState<CommunityIdentity[]>([]);
  const [music,setMusic]=useState<ReelMusic|null>(null);const [showMusic,setShowMusic]=useState(false);const [muteOriginal,setMuteOriginal]=useState(false);
  const [showMentions,setShowMentions]=useState(false);const [showLocation,setShowLocation]=useState(false);const [query,setQuery]=useState('');const [results,setResults]=useState<CommunityIdentity[]>([]);const [searching,setSearching]=useState(false);
  const [busy,setBusy]=useState(false);const [stage,setStage]=useState('');const [error,setError]=useState('');const [uploadedUrl,setUploadedUrl]=useState('');const [uploadedCover,setUploadedCover]=useState('');
  const [playing,setPlaying]=useState(false);const [duration,setDuration]=useState(0);const [draft,setDraft]=useState<ReelDraft|null>(null);const [saving,setSaving]=useState(false);const [notice,setNotice]=useState('');
  const video=useRef<HTMLVideoElement>(null);const coverInput=useRef<HTMLInputElement>(null);
  const isPhoto=!!file?.type.startsWith('image/');const soundtrack=useReelSoundtrack(video,music,step==='review'&&!showMusic,playing,false);
  useEffect(()=>{if(!file){setPreview('');return;}const url=URL.createObjectURL(file);setPreview(url);return()=>URL.revokeObjectURL(url);},[file]);
  useEffect(()=>{if(!cover){setCoverPreview('');return;}const url=URL.createObjectURL(cover);setCoverPreview(url);return()=>URL.revokeObjectURL(url);},[cover]);
  useEffect(()=>{if(!profile?.id)return;let cancelled=false;readReelDraft(profile.id).then(data=>{if(!cancelled)setDraft(data);}).catch(()=>{});return()=>{cancelled=true;};},[profile?.id]);
  useEffect(()=>{
    if(!showMentions||!profile?.email)return;const controller=new AbortController();setSearching(true);
    const timer=setTimeout(()=>socialRequest<CommunityIdentity[]>(`mentions?q=${encodeURIComponent(query)}`,profile.email,undefined,undefined,controller.signal).then(setResults).catch(e=>{if(e.name!=='AbortError')setError(e.message);}).finally(()=>{if(!controller.signal.aborted)setSearching(false);}),300);
    return()=>{clearTimeout(timer);controller.abort();};
  },[query,showMentions,profile?.email]);
  const select=(next:File)=>{setFile(next);setCover(null);setUploadedUrl('');setUploadedCover('');setError('');setPlaying(false);setDuration(0);setStep('review');setDraft(null);};
  const resume=()=>{if(!draft)return;setFile(new File([draft.file],draft.fileName,{type:draft.fileType}));setCaption(draft.caption);setLocation(draft.location);setMentions(draft.mentions);setMusic(draft.music);setMuteOriginal(draft.muteOriginal);if(draft.coverFile)setCover(new File([draft.coverFile],draft.coverName||'capa.jpg',{type:draft.coverFile.type}));setStep('review');setDraft(null);};
  const save=async()=>{if(!file||!profile?.id||busy||saving)return;setSaving(true);setNotice('');try{await writeReelDraft(profile.id,{file,fileName:file.name,fileType:file.type,caption,location,mentions,music,muteOriginal,coverFile:cover||undefined,coverName:cover?.name,savedAt:new Date().toISOString()});setNotice('Rascunho guardado neste dispositivo.');}catch{setError('Não foi possível guardar o rascunho neste dispositivo.');}finally{setSaving(false);}};
  const upload=async(media:File)=>{const form=new FormData();form.append('userEmail',profile!.email);form.append('video',media);const response=await fetch(`${API_BASE_URL}/api/community/reel-upload`,{method:'POST',body:form});const data=await response.json();if(!response.ok)throw new Error(data.error||'Não foi possível carregar o ficheiro.');return data.url as string;};
  const togglePreview=()=>{
    if(isPhoto){if(playing){setPlaying(false);soundtrack.audio.current?.pause();}else{setPlaying(true);soundtrack.start(true);}}
    else if(video.current?.paused)video.current.play().catch(()=>{});else video.current?.pause();
  };
  const publish=async()=>{
    if(!file||!profile?.email||busy||saving)return;setBusy(true);setError('');setPlaying(false);video.current?.pause();
    try{let url=uploadedUrl;if(!url){setStage(isPhoto?'A carregar a fotografia…':'A carregar o vídeo…');url=await upload(file);setUploadedUrl(url);}let coverUrl=uploadedCover;if(cover&&!coverUrl){setStage('A carregar a capa…');coverUrl=await upload(cover);setUploadedCover(coverUrl);}setStage('A publicar…');
      const reel=await socialRequest<CommunityReel>('reels',profile.email,{mediaType:isPhoto?'photo':'video',imageUrl:isPhoto?url:undefined,videoUrl:isPhoto?undefined:url,coverUrl:coverUrl||undefined,caption,location,mentions:mentions.map(p=>p.id),music:music?{id:music.id,start:music.start,duration:music.duration,volume:music.volume}:null,muteOriginal,duration:isPhoto?(music?.duration||15):duration});
      await writeReelDraft(profile.id,null).catch(()=>{});onPublished(reel);
    }catch(e){setError(e.message);}finally{setBusy(false);setStage('');}
  };
  return <section className="community-overlay reel-create-flow" role="dialog" aria-modal="true" aria-label="Criar publicação">
    {step==='capture'?<><ReelCamera onClose={onClose} onSelect={select} musicLabel={music?.title} onMusic={()=>setShowMusic(true)}/>{draft&&<div className="reel-draft-banner"><Save size={17}/><span>Tens um rascunho guardado</span><button onClick={resume}>Retomar</button><button aria-label="Ocultar rascunho" onClick={()=>setDraft(null)}><X size={16}/></button></div>}</>:<section className="reel-review"><header><button aria-label="Voltar à câmara" disabled={busy||saving} onClick={()=>{video.current?.pause();setPlaying(false);setStep('capture');}}><ArrowLeft size={22}/></button><h2>Nova publicação</h2><button className="review-publish-top" disabled={busy||saving||!profile?.email} onClick={publish}>{busy?<Loader2 size={17} className="animate-spin"/>:'Publicar'}</button></header><div className="reel-review-body">
      {error&&<p className="reel-form-error" role="alert">{error}</p>}{notice&&<p className="reel-draft-saved" role="status">{notice}</p>}
      <div className="review-media">{isPhoto?<img src={preview} alt="Fotografia para publicar"/>:<video ref={video} src={preview} poster={coverPreview||undefined} controls playsInline muted={muteOriginal} onLoadedMetadata={e=>setDuration(e.currentTarget.duration)} onPlay={()=>{setPlaying(true);soundtrack.start();}} onPause={()=>setPlaying(false)} onTimeUpdate={soundtrack.sync}/>}<span className="review-media-kind">{isPhoto?<Image size={14}/>:<Film size={14}/>} {isPhoto?'Fotografia':`Vídeo${duration?' · '+musicTime(duration):''}`}</span>{!isPhoto&&<button className="review-cover" disabled={busy} onClick={()=>coverInput.current?.click()}><Image size={15}/>Alterar capa</button>}</div>
      <div className="review-caption"><textarea value={caption} disabled={busy} maxLength={2200} aria-label="Legenda" placeholder="Conta este momento…" onChange={e=>setCaption(e.target.value)}/><span>{caption.length}/2200</span></div>
      <button className="review-option" disabled={busy} onClick={()=>{video.current?.pause();setPlaying(false);setShowMusic(true);}}><Music2/><span>{music?'Música adicionada':'Adicionar música'}<small>{music?`${music.title} · ${music.artist}`:'Escolhe a banda sonora deste momento'}</small></span><ChevronRight size={18}/></button>
      {music&&<div className="review-music-selected"><button aria-label={playing?'Pausar música':'Ouvir música'} onClick={togglePreview}><Play size={15}/></button><span>{musicTime(music.start)} — {musicTime(music.start+music.duration)}<small>{music.license} · Créditos incluídos</small></span><button aria-label="Remover música" disabled={busy} onClick={()=>{setMusic(null);setPlaying(false);}}><X size={17}/></button></div>}
      {soundtrack.unavailable&&<p className="review-audio-error">Não foi possível ouvir a música. Experimenta outra faixa.</p>}
      {!isPhoto&&<button className="review-option compact" disabled={busy} aria-pressed={muteOriginal} onClick={()=>setMuteOriginal(!muteOriginal)}>{muteOriginal?<VolumeX/>:<Volume2/>}<span>Som original<small>{muteOriginal?'Silenciado':'Incluído no vídeo'}</small></span><span className={`review-switch ${muteOriginal?'':'on'}`}/></button>}
      <button className="review-option" disabled={busy} onClick={()=>setShowMentions(!showMentions)}><AtSign/><span>Identificar pessoas ou negócios</span><ChevronRight size={18}/></button>
      {showMentions&&<div className="reel-mention-picker"><label className="community-search"><AtSign size={16}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Nome ou @utilizador" aria-label="Pesquisar pessoas ou negócios"/></label>{searching&&<Loader2 size={18} className="animate-spin"/>}{!searching&&!results.length&&<p>Nenhum perfil encontrado.</p>}{results.map(p=><button className="reel-mention-result" key={p.id} disabled={busy||(mentions.length>=20&&!mentions.some(m=>m.id===p.id))} aria-pressed={mentions.some(m=>m.id===p.id)} onClick={()=>setMentions(prev=>prev.some(m=>m.id===p.id)?prev.filter(m=>m.id!==p.id):[...prev,p])}><img src={socialMediaUrl(p.avatar)||communityAvatar} alt="" onError={avatarError}/><span><strong>{p.name}</strong><small>{p.handle} · {p.isBusiness?'Negócio':'Pessoa'}</small></span>{mentions.some(m=>m.id===p.id)?<Check size={18}/>:<Plus size={18}/>}</button>)}</div>}
      {mentions.length>0&&<div className="reel-tag-chips">{mentions.map(p=><button key={p.id} disabled={busy} onClick={()=>setMentions(prev=>prev.filter(m=>m.id!==p.id))}>{p.handle}<X size={12}/></button>)}</div>}
      <button className="review-option" disabled={busy} onClick={()=>setShowLocation(!showLocation)}><MapPin/><span>Adicionar localização{location&&<small>{location}</small>}</span><ChevronRight size={18}/></button>{showLocation&&<input className="review-location" value={location} disabled={busy} maxLength={160} onChange={e=>setLocation(e.target.value)} aria-label="Localização" placeholder="Onde aconteceu este momento?"/>}
      <div className="review-option"><Globe2/><span>Quem pode ver</span><small>Comunidade</small></div>
      <p className="review-notice"><Bell size={17}/>Os teus seguidores mútuos recebem uma notificação.</p>{busy&&<p className="reel-upload-stage" role="status"><Loader2 size={17} className="animate-spin"/>{stage}</p>}
    </div><footer><button disabled={busy||saving} onClick={save}>{saving?<Loader2 size={16} className="animate-spin"/>:<Save size={16}/>}Guardar rascunho</button><button disabled={busy||saving||!profile?.email} onClick={publish}>{busy?<Loader2 size={16} className="animate-spin"/>:'Publicar'}</button></footer></section>}
    <input ref={coverInput} type="file" accept="image/jpeg,image/png,image/webp" hidden onChange={e=>{const next=e.target.files?.[0];if(next){if(!['image/jpeg','image/png','image/webp'].includes(next.type)||next.size>20*1024*1024){setError('Escolhe uma capa JPG, PNG ou WebP até 20 MB.');return;}setCover(next);setUploadedCover('');}}}/>
    {music&&<audio ref={soundtrack.audio} src={musicPlaybackUrl(music)} preload="metadata" onLoadedMetadata={soundtrack.sync} onTimeUpdate={soundtrack.onTimeUpdate} onError={soundtrack.onError}/>}
    {showMusic&&<ReelMusicPicker email={profile?.email||''} selected={music} onSelect={setMusic} onClose={()=>setShowMusic(false)}/>}
  </section>;
}
