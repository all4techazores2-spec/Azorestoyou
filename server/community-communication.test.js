import test from 'node:test';
import assert from 'node:assert/strict';
import { EventEmitter } from 'node:events';
process.env.COMMUNITY_SESSION_SECRET='test-only-secret-not-for-production';
const {createCommunitySession,sessionEmail}=await import('./community-session.js');
const {registerCommunityCommunication}=await import('./community-communication.js');
const {cleanCommunityDemo}=await import('./community-cleanup.js');
const fixture=()=>({social_profiles:[{id:'a',email:'ana@example.invalid',name:'Ana',handle:'@ana'},{id:'b',email:'biz@example.invalid',name:'Negócio',handle:'@biz',isBusiness:true},{id:'c',email:'c@example.invalid',name:'Carlos',handle:'@c'}]});
function harness(initial=fixture()){
 let db=structuredClone(initial);const routes=new Map();let writes=0;
 const app=Object.fromEntries(['get','post','put','delete'].map(method=>[method,(url,handler)=>routes.set(method+' '+url,handler)]));
 registerCommunityCommunication(app,{readDB:async()=>structuredClone(db),writeDB:async value=>{db=structuredClone(value);writes++;}});
 async function call(method,url,who='a',body={},params={},query={}){
  const actor=db.social_profiles.find(p=>p.id===who);const req=Object.assign(new EventEmitter(),{body,params,query,headers:actor?{authorization:'Bearer '+createCommunitySession(actor.email)}:{}});
  let status=200,value;const chunks=[];const res={status(n){status=n;return this;},json(v){value=v;return this;},setHeader(){},flushHeaders(){},write(v){chunks.push(v);},end(){req.emit('close');}};
  await routes.get(method+' '+url)(req,res);return{status,value,chunks,close:()=>req.emit('close')};
 }
 return{call,snapshot:()=>structuredClone(db),writes:()=>writes};
}
test('signed sessions reject missing, tampered and expired identities',()=>{
 const token=createCommunitySession(' ANA@example.invalid ');assert.equal(sessionEmail({headers:{authorization:'Bearer '+token}}),'ana@example.invalid');
 for(const value of ['',token+'x','changed.'+token.split('.')[1]])assert.throws(()=>sessionEmail({headers:{authorization:'Bearer '+value}}),{status:401});
 const now=Date.now;try{Date.now=()=>now()+8*86400000;assert.throws(()=>sessionEmail({headers:{authorization:'Bearer '+token}}),{status:401});}finally{Date.now=now;}
});
test('two real-time recipients receive persisted messages, strangers do not; retries and reads persist',async()=>{
 const h=harness();const a=await h.call('get','/api/community/realtime');const b=await h.call('get','/api/community/realtime','b');const c=await h.call('get','/api/community/realtime','c');
 try{
  const opened=await h.call('post','/api/community/conversations','a',{handle:'@biz'});const id=opened.value.id;
  const again=await h.call('post','/api/community/conversations','b',{handle:'@ana'});assert.equal(again.value.id,id);
  const sent=await h.call('post','/api/community/conversations/:id/messages','a',{text:'Olá!',clientId:'message_001'},{id});assert.equal(sent.status,201);
  assert.ok(a.chunks.some(s=>s.includes('"type":"message"')));assert.ok(b.chunks.some(s=>s.includes('"type":"message"')));assert.ok(!c.chunks.some(s=>s.includes(id)));
  await h.call('post','/api/community/conversations/:id/messages','a',{text:'Olá!',clientId:'message_001'},{id});assert.equal(h.snapshot().community_messages.length,1);
  assert.equal((await h.call('get','/api/community/conversations','b')).value[0].unread,1);
  for(const method of ['get','post','put']){
   const path=method==='put'?'/api/community/conversations/:id/read':'/api/community/conversations/:id/messages';
   assert.equal((await h.call(method,path,'c',{text:'intruso',clientId:'message_002'},{id})).status,404);
  }
  await h.call('put','/api/community/conversations/:id/read','a',{}, {id});assert.equal(h.snapshot().community_messages[0].readAt,null);
  await h.call('put','/api/community/conversations/:id/read','b',{}, {id});assert.ok(h.snapshot().community_messages[0].readAt);assert.ok(a.chunks.some(s=>s.includes('"type":"read"')));
  const restarted=harness(h.snapshot());const history=await restarted.call('get','/api/community/conversations/:id/messages','a',{}, {id});assert.equal(history.value.items[0].text,'Olá!');assert.ok(history.value.readThrough);assert.equal((await restarted.call('get','/api/community/conversations','b')).value[0].unread,0);
  assert.equal((await h.call('get','/api/community/conversations','missing',{userEmail:'ana@example.invalid'})).status,401);
 }finally{a.close();b.close();c.close();}
});
test('history pagination bridges more than 50 missed messages without loss',async()=>{
 const h=harness();const id=(await h.call('post','/api/community/conversations','a',{handle:'@biz'})).value.id;
 for(let i=0;i<115;i++)await h.call('post','/api/community/conversations/:id/messages','a',{text:'Mensagem '+i,clientId:'message_'+i.toString().padStart(4,'0')},{id});
 const rows=[];let before;do{const page=(await h.call('get','/api/community/conversations/:id/messages','b',{}, {id},before?{before}:{})).value;rows.unshift(...page.items);before=page.hasMore?page.items[0].id:null;}while(before);
 assert.equal(rows.length,115);assert.equal(new Set(rows.map(m=>m.id)).size,115);assert.equal(rows[0].text,'Mensagem 0');assert.equal(rows.at(-1).text,'Mensagem 114');
});
test('simultaneous sends are serialized without losing either participant message',async()=>{
 const h=harness();const id=(await h.call('post','/api/community/conversations','a',{handle:'@biz'})).value.id;
 const results=await Promise.all(Array.from({length:20},(_,i)=>h.call('post','/api/community/conversations/:id/messages',i%2?'a':'b',{text:'Mensagem '+i,clientId:'parallel_'+i},{id})));
 assert.ok(results.every(r=>r.status===201));assert.equal(h.snapshot().community_messages.length,20);
 assert.equal((await h.call('get','/api/community/conversations','a')).value[0].unread,10);
 assert.equal((await h.call('get','/api/community/conversations','b')).value[0].unread,10);
});
test('stories persist with authenticated authors and only unexpired media is returned',async()=>{
 const h=harness();assert.equal((await h.call('post','/api/community/stories','missing',{mediaUrl:'https://example.invalid/photo.jpg'})).status,401);
 const created=await h.call('post','/api/community/stories','a',{mediaUrl:'https://example.invalid/photo.jpg',authorId:'b'});assert.equal(created.status,201);assert.equal(created.value.authorId,'a');
 const stored=h.snapshot();stored.community_stories.push({...created.value,id:'expired',expiresAt:new Date(Date.now()-1000).toISOString()});
 const restarted=harness(stored);const stories=(await restarted.call('get','/api/community/stories')).value;assert.equal(stories.length,1);assert.equal(stories[0].handle,'@ana');
});
test('actual follower lists, highlight photo editing and owner-only deletion',async()=>{
 const db=fixture();db.community_follows=[{from:'b',to:'a'},{from:'a',to:'c'}];const h=harness(db);
 assert.deepEqual((await h.call('get','/api/community/connections/:id','a',{}, {id:'a'})).value.items.map(p=>p.id),['b']);
 assert.deepEqual((await h.call('get','/api/community/connections/:id','a',{}, {id:'a'},{kind:'following'})).value.items.map(p=>p.id),['c']);
 const body={title:'São Miguel',media:[{id:'photo',url:'https://example.invalid/photo.jpg'}]};const created=await h.call('post','/api/community/highlights','a',body);assert.equal(created.status,201);const id=created.value.id;
 assert.equal((await h.call('put','/api/community/highlights/:id','b',body,{id})).status,404);assert.equal((await h.call('delete','/api/community/highlights/:id','b',{}, {id})).status,404);
 const edited=await h.call('put','/api/community/highlights/:id','a',{...body,title:'As minhas viagens'},{id});assert.equal(edited.value.title,'As minhas viagens');
 assert.equal((await h.call('post','/api/community/highlights','a',{title:'Vazio',media:[]})).status,400);
 await h.call('delete','/api/community/highlights/:id','a',{}, {id});assert.equal((await h.call('get','/api/community/highlights/:id','a',{}, {id:'a'})).value.length,0);
});
test('cleanup archives only known demo records and preserves registered accounts and real content',()=>{
 const db=fixture();db.users=[{email:'real@example.invalid'}];db.social_profiles.push({id:'sp_seed_maria',email:'fake@example.invalid',handle:'@azorestoyou_maria'},{id:'sp_seed_andrebraga',email:'real@example.invalid',handle:'@real',highlights:[{id:'h1',media:[{url:'https://example.invalid/photo.jpg'}]}]});db.posts=[{id:1700000001,authorHandle:'@azorestoyou_maria'},{id:1700000002,authorHandle:'@ana',content:'Real'}];
 assert.equal(cleanCommunityDemo(db),true);assert.equal(db.community_demo_archive.profiles.length,1);assert.equal(db.community_demo_archive.posts.length,1);assert.ok(db.social_profiles.some(p=>p.id==='sp_seed_andrebraga'));assert.equal(db.posts[0].content,'Real');assert.equal(db.social_profiles.at(-1).highlights.length,1);assert.equal(cleanCommunityDemo(db),false);
});
