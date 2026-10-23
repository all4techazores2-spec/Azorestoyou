import crypto from 'node:crypto';
import { sessionEmail } from './community-session.js';
import { communityWrite } from './community-store.js';

const fail=(message,status=400)=>Object.assign(new Error(message),{status});
const safeProfile=p=>({id:p.id,name:p.name,handle:p.handle,avatar:String(p.avatar||'').includes('dicebear.com')?'':p.avatar||'',isBusiness:!!p.isBusiness});
export function ensureCommunication(db){db.community_conversations||=[];db.community_messages||=[];db.community_stories||=[];db.social_profiles||=[];return db;}
export function conversationFor(db,actor,target){
    ensureCommunication(db);if(!target||target.id===actor.id)throw fail('Escolhe outra pessoa ou negócio.');
    let thread=db.community_conversations.find(c=>c.members.length===2&&c.members.includes(actor.id)&&c.members.includes(target.id));
    if(!thread){thread={id:crypto.randomUUID(),members:[actor.id,target.id],createdAt:new Date().toISOString()};db.community_conversations.push(thread);}return thread;
}
export function requireConversation(db,actor,id){const thread=(db.community_conversations||[]).find(c=>c.id===id);if(!thread||!thread.members.includes(actor.id))throw fail('Conversa não encontrada.',404);return thread;}
export function sendMessage(db,actor,id,body){
    ensureCommunication(db);const thread=requireConversation(db,actor,id);const text=String(body.text||'').trim();
    if(!text||text.length>4000)throw fail('Escreve uma mensagem até 4000 caracteres.');
    const clientId=String(body.clientId||'');if(!/^[a-zA-Z0-9_-]{8,100}$/.test(clientId))throw fail('Identificador da mensagem inválido.');
    const existing=db.community_messages.find(m=>m.senderId===actor.id&&m.clientId===clientId);if(existing){if(existing.conversationId!==id)throw fail('Identificador já utilizado noutra conversa.');return existing;}
    const message={id:crypto.randomUUID(),conversationId:id,senderId:actor.id,text,clientId,createdAt:new Date().toISOString(),readAt:null};
    db.community_messages.push(message);thread.updatedAt=message.createdAt;return message;
}
export function readMessages(db,actor,id){requireConversation(db,actor,id);const now=new Date().toISOString();let count=0;for(const m of db.community_messages||[])if(m.conversationId===id&&m.senderId!==actor.id&&!m.readAt){m.readAt=now;count++;}return count;}
export function inbox(db,actor){
    return (db.community_conversations||[]).filter(c=>c.members.includes(actor.id)).map(c=>{
        const peer=db.social_profiles.find(p=>c.members.includes(p.id)&&p.id!==actor.id);if(!peer)return null;
        const messages=(db.community_messages||[]).filter(m=>m.conversationId===c.id);const last=messages.at(-1)||null;
        return{id:c.id,peer:safeProfile(peer),lastMessage:last,unread:messages.filter(m=>m.senderId!==actor.id&&!m.readAt).length,updatedAt:last?.createdAt||c.createdAt};
    }).filter(Boolean).sort((a,b)=>b.updatedAt.localeCompare(a.updatedAt));
}
export function updateHighlight(db,actor,id,body){
    const highlights=actor.highlights||=[];let highlight=id?highlights.find(h=>h.id===id):null;
    if(id&&!highlight)throw fail('Destaque não encontrado.',404);
    const title=String(body.title||'').trim().slice(0,40);if(!title)throw fail('Dá um nome ao destaque.');
    const media=Array.isArray(body.media)?body.media.slice(0,50).map(item=>({id:String(item.id||crypto.randomUUID()).slice(0,100),url:String(item.url||''),type:'image'})):[];
    if(!media.length||media.some(m=>!/^https:\/\//i.test(m.url)))throw fail('Adiciona pelo menos uma fotografia ao destaque.');
    const cover=media.some(m=>m.url===body.cover)?body.cover:media[0].url;
    if(!highlight){if(highlights.length>=30)throw fail('Podes ter até 30 destaques.');highlight={id:crypto.randomUUID()};highlights.push(highlight);}
    Object.assign(highlight,{title,cover,media,updatedAt:new Date().toISOString()});return highlight;
}
export function registerCommunityCommunication(app,{readDB,writeDB}){
    const streams=new Map();
    let watcher=null,checking=false;const snapshots=new Map();
    const broadcast=(ids,event)=>{for(const id of new Set(ids))for(const response of streams.get(id)||[])if(!response.destroyed)response.write(`data: ${JSON.stringify(event)}\n\n`);};
    const watch=()=>{
        if(watcher)return;
        watcher=setInterval(async()=>{if(checking||!streams.size)return;checking=true;try{const db=await readDB();for(const id of streams.keys()){const actor=db.social_profiles.find(p=>p.id===id);if(!actor)continue;const value=JSON.stringify(inbox(db,actor).map(c=>[c.id,c.lastMessage?.id,c.lastMessage?.readAt,c.unread]));if(snapshots.has(id)&&snapshots.get(id)!==value)broadcast([id],{type:'resync'});snapshots.set(id,value);}}catch{}finally{checking=false;}},5000);watcher.unref?.();
    };
    const actorFor=(req,db)=>{const email=sessionEmail(req);const p=(db.social_profiles||[]).find(p=>String(p.email||'').toLowerCase()===email);if(!p)throw fail('Abre o teu perfil na comunidade antes de continuar.',401);return p;};
    const route=fn=>async(req,res)=>{try{await fn(req,res);}catch(e){res.status(e.status||500).json({error:e.status?e.message:'Não foi possível concluir. Tenta novamente.'});}};
    const write=fn=>communityWrite(readDB,writeDB,db=>fn(ensureCommunication(db)));
    app.get('/api/community/contacts',route(async(req,res)=>{
        const db=await readDB();const actor=actorFor(req,db);const q=String(req.query.q||'').toLowerCase().slice(0,100);
        res.json(db.social_profiles.filter(p=>p.id!==actor.id&&`${p.name} ${p.handle}`.toLowerCase().includes(q)).slice(0,50).map(safeProfile));
    }));
    app.get('/api/community/businesses',route(async(req,res)=>{
        const db=await readDB();const collections=['restaurants','hotels','cars','shops','beauty','services','activities','offices','animals','real_estate','gyms','stands','bars','events','municipal'];
        res.json(collections.flatMap(collection=>(db[collection]||[]).filter(b=>!b.isDraft&&b.status!=='draft').map(b=>({id:b.id,name:b.name||b.title,category:b.businessType||collection,collection,image:b.image||''}))).slice(0,200));
    }));
    app.get('/api/community/conversations',route(async(req,res)=>{const db=await readDB();res.json(inbox(db,actorFor(req,db)));}));
    app.post('/api/community/conversations',route(async(req,res)=>{
        res.json(await write(db=>{
            const actor=actorFor(req,db);
            const rawLookup=String(req.body.handle||'').trim().toLowerCase();
            const cleanLookup=rawLookup.replace(/^@/,'');
            let target=db.social_profiles.find(p=>(req.body.targetId&&p.id===req.body.targetId)||(cleanLookup&&String(p.handle||'').toLowerCase().replace(/^@/,'')===cleanLookup));
            if(!target&&cleanLookup){
                target=db.social_profiles.find(p=>String(p.name||'').toLowerCase()===cleanLookup||String(p.name||'').toLowerCase()===rawLookup);
            }
            if(!target)throw fail('Abre o perfil da pessoa ou negócio para iniciar a conversa.',404);
            return{...conversationFor(db,actor,target),peer:safeProfile(target)};
        }));
    }));
    app.get('/api/community/conversations/:id/messages',route(async(req,res)=>{
        const db=ensureCommunication(await readDB());const actor=actorFor(req,db);requireConversation(db,actor,req.params.id);
        let rows=db.community_messages.filter(m=>m.conversationId===req.params.id);if(req.query.before){const index=rows.findIndex(m=>m.id===req.query.before);if(index<0)throw fail('Página de mensagens inválida.');rows=rows.slice(0,index);}
        const readThrough=db.community_messages.filter(m=>m.conversationId===req.params.id&&m.senderId===actor.id&&m.readAt).at(-1);
        res.json({items:rows.slice(-50),hasMore:rows.length>50,readThrough:readThrough?{createdAt:readThrough.createdAt,readAt:readThrough.readAt}:null});
    }));
    app.post('/api/community/conversations/:id/messages',route(async(req,res)=>{
        const result=await write(db=>{const actor=actorFor(req,db);const message=sendMessage(db,actor,req.params.id,req.body);return{message,members:requireConversation(db,actor,req.params.id).members};});
        broadcast(result.members,{type:'message',conversationId:req.params.id});res.status(201).json(result.message);
    }));
    app.put('/api/community/conversations/:id/read',route(async(req,res)=>{
        const result=await write(db=>{const actor=actorFor(req,db);return{count:readMessages(db,actor,req.params.id),members:requireConversation(db,actor,req.params.id).members};});
        if(result.count)broadcast(result.members,{type:'read',conversationId:req.params.id});res.json({success:true});
    }));
    app.get('/api/community/realtime',route(async(req,res)=>{
        const db=await readDB();const actor=actorFor(req,db);
        res.setHeader('Content-Type','text/event-stream');res.setHeader('Cache-Control','no-cache, no-transform');res.setHeader('Connection','keep-alive');res.setHeader('X-Accel-Buffering','no');res.flushHeaders?.();
        if(!streams.has(actor.id))streams.set(actor.id,new Set());streams.get(actor.id).add(res);
        watch();
        res.write(`data: ${JSON.stringify({type:'ready'})}\n\n`);
        const keepAlive=setInterval(()=>{if(!res.destroyed)res.write(': heartbeat\n\n');},15000);
        keepAlive.unref?.();
        // Reconnect periodically to renew authorization and recover interrupted streams.
        const reconnect=setTimeout(()=>res.end(),25*60000);
        reconnect.unref?.();
        req.on('close',()=>{clearInterval(keepAlive);clearTimeout(reconnect);streams.get(actor.id)?.delete(res);if(!streams.get(actor.id)?.size){streams.delete(actor.id);snapshots.delete(actor.id);}if(!streams.size&&watcher){clearInterval(watcher);watcher=null;}});
    }));
    app.get('/api/community/connections/:id',route(async(req,res)=>{
        const db=await readDB();if(!db.social_profiles.some(p=>p.id===req.params.id))throw fail('Perfil não encontrado.',404);
        const following=req.query.kind==='following';const rows=(db.community_follows||[]).filter(f=>following?f.from===req.params.id:f.to===req.params.id);const ids=new Set(rows.map(f=>following?f.to:f.from));
        const q=String(req.query.q||'').toLowerCase().slice(0,100);const profiles=db.social_profiles.filter(p=>ids.has(p.id)&&`${p.name} ${p.handle}`.toLowerCase().includes(q));
        const offset=Math.max(0,parseInt(req.query.offset,10)||0);res.json({items:profiles.slice(offset,offset+50).map(safeProfile),total:profiles.length,nextOffset:offset+50<profiles.length?offset+50:null});
    }));
    app.get('/api/community/highlights/:id',route(async(req,res)=>{const db=await readDB();const p=db.social_profiles.find(p=>p.id===req.params.id);if(!p)throw fail('Perfil não encontrado.',404);res.json(p.highlights||[]);}));
    app.post('/api/community/highlights',route(async(req,res)=>{res.status(201).json(await write(db=>updateHighlight(db,actorFor(req,db),null,req.body)));}));
    app.put('/api/community/highlights/:id',route(async(req,res)=>{res.json(await write(db=>updateHighlight(db,actorFor(req,db),req.params.id,req.body)));}));
    app.delete('/api/community/highlights/:id',route(async(req,res)=>{await write(db=>{const actor=actorFor(req,db);if(!(actor.highlights||[]).some(h=>h.id===req.params.id))throw fail('Destaque não encontrado.',404);actor.highlights=actor.highlights.filter(h=>h.id!==req.params.id);});res.json({success:true});}));
    app.get('/api/community/stories',route(async(req,res)=>{
        const db=await readDB();const now=Date.now();res.json((db.community_stories||[]).filter(s=>new Date(s.expiresAt).getTime()>now).map(s=>{const p=db.social_profiles.find(p=>p.id===s.authorId);return p?{...s,userName:p.name,avatar:p.avatar||'',handle:p.handle,timestamp:new Date(s.createdAt).getTime()}:null;}).filter(Boolean));
    }));
    app.post('/api/community/stories',route(async(req,res)=>{
        const story=await write(db=>{const actor=actorFor(req,db);const mediaUrl=String(req.body.mediaUrl||'');if(!/^https:\/\//.test(mediaUrl))throw fail('Adiciona uma fotografia ou vídeo.');const now=Date.now();const story={id:crypto.randomUUID(),authorId:actor.id,mediaUrl,mediaType:req.body.mediaType==='video'?'video':'image',createdAt:new Date(now).toISOString(),expiresAt:new Date(now+86400000).toISOString()};db.community_stories=db.community_stories.filter(s=>new Date(s.expiresAt).getTime()>now);db.community_stories.push(story);return story;});res.status(201).json(story);
    }));
    return {broadcast};
}
