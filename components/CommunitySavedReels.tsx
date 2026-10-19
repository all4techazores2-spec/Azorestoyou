import React, { useEffect, useState } from 'react';
import { Film, Loader2 } from 'lucide-react';
import { CommunityReel, socialMediaUrl, socialRequest } from '../services/communitySocial';

export default function CommunitySavedReels({email,onOpenReel}:{email:string;onOpenReel:(id:string)=>void}) {
  const [items,setItems]=useState<CommunityReel[]>([]);
  const [next,setNext]=useState<number|null>(null);
  const [busy,setBusy]=useState(false);
  const [error,setError]=useState('');
  const load=async(offset=0)=>{if(!email||busy)return;setBusy(true);setError('');try{const data=await socialRequest<{items:CommunityReel[];nextOffset:number|null}>(`reels?saved=true&offset=${offset}`,email);setItems(prev=>offset?[...prev,...data.items]:data.items);setNext(data.nextOffset);}catch(e){setError(e.message);}finally{setBusy(false);}};
  useEffect(()=>{if(email)load();},[email]);
  return <section className="community-saved-reels"><h3>Reels guardados</h3><div className="profile-reels-grid">{items.map(reel=><button key={reel.id} onClick={()=>onOpenReel(reel.id)} aria-label={`Ver reel de ${reel.author.name}`}>{reel.mediaType==='photo'?<img src={socialMediaUrl(reel.imageUrl)} alt={reel.caption||'Fotografia'}/>:<video src={socialMediaUrl(reel.videoUrl)} poster={socialMediaUrl(reel.coverUrl)||undefined} muted playsInline preload="metadata"/>}<Film size={19}/></button>)}</div>{!items.length&&!busy&&<p>Os reels que guardares aparecem aqui.</p>}{error&&<p role="alert">{error}</p>}{busy&&<Loader2 size={20} className="animate-spin"/>}{next!==null&&<button className="community-follow" disabled={busy} onClick={()=>load(next)}>Ver mais</button>}</section>;
}
