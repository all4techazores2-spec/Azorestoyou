import test from 'node:test';
import assert from 'node:assert/strict';
import { createReel, decorateReel, getActor, relationship, setFollowing, registerCommunitySocial } from './community-social.js';

const fixture = () => ({ social_profiles: [
    { id:'a', name:'Ana', email:'ana@example.invalid', handle:'@ana', followersCount:0, followingCount:0 },
    { id:'b', name:'Restaurante', email:'biz@example.invalid', handle:'@restaurante', isBusiness:true, followersCount:0, followingCount:0 },
    { id:'c', name:'Carlos', email:'c@example.invalid', handle:'@carlos', followersCount:0, followingCount:0 },
] });
const video = { videoUrl:'https://res.cloudinary.com/example/video/upload/reel.mp4',caption:'Os Açores',mentions:['b','missing','b'] };
test('following persists and repeating the same desired state does not duplicate counts or events', () => {
    const db=fixture();const actor=getActor(db,' ANA@example.invalid ');
    setFollowing(db,actor,'b',true);setFollowing(db,actor,'b',true);
    assert.equal(db.community_follows.length,1);assert.equal(db.community_notifications.length,1);
    assert.equal(actor.followingCount,1);assert.equal(db.social_profiles[1].followersCount,1);
    assert.deepEqual(relationship(db,'a','b'),{following:true,followedBy:false,mutual:false});
    setFollowing(db,db.social_profiles[1],'a',true);
    assert.equal(relationship(db,'a','b').mutual,true);
    setFollowing(db,actor,'b',false);setFollowing(db,actor,'b',false);
    assert.equal(actor.followingCount,0);assert.equal(db.social_profiles[1].followersCount,0);
    assert.equal(relationship(db,'a','b').mutual,false);
});
test('publishing notifies only mutual followers, including business accounts', () => {
    const db=fixture();const [a,b,c]=db.social_profiles;
    setFollowing(db,a,'b',true);setFollowing(db,b,'a',true);setFollowing(db,c,'a',true);
    const reel=createReel(db,a,video);
    const events=db.community_notifications.filter(n=>n.type==='reel');
    assert.equal(events.length,1);assert.equal(events[0].recipientId,'b');assert.equal(events[0].reelId,reel.id);
    assert.deepEqual(reel.mentions,['b']);assert.equal(db.community_reels.length,1);
    const decorated=decorateReel(db,reel,b);
    assert.equal(decorated.author.handle,'@ana');assert.equal(decorated.relationship.mutual,true);
    assert.equal(decorated.mentions[0].isBusiness,true);
    assert.equal('email' in decorated.author,false);assert.equal('email' in decorated.mentions[0],false);
    setFollowing(db,b,'a',false);createReel(db,a,video);
    assert.equal(db.community_notifications.filter(n=>n.type==='reel').length,1);
});
test('self-follow, missing identities, invalid targets and invalid video URLs are rejected',()=>{
    const db=fixture();const a=db.social_profiles[0];
    assert.throws(()=>getActor(db,''),{status:401});assert.throws(()=>getActor(db,'missing@example.invalid'),{status:401});
    assert.throws(()=>setFollowing(db,a,'a',true),{status:400});assert.throws(()=>setFollowing(db,a,'missing',true),{status:404});
    assert.throws(()=>setFollowing(db,a,'b','yes'),{status:400});
    for(const videoUrl of ['','javascript:alert(1)','file:///test','http://example.invalid/test.mp4'])assert.throws(()=>createReel(db,a,{videoUrl}),{status:400});
});
test('notifications retain durable profile ids if the author changes handle',()=>{
    const db=fixture();const [a,b]=db.social_profiles;setFollowing(db,a,'b',true);setFollowing(db,b,'a',true);
    a.handle='@ana_nova';const reel=createReel(db,a,video);
    assert.equal(decorateReel(db,reel,b).author.handle,'@ana_nova');
    assert.equal(db.community_notifications.find(n=>n.type==='reel').actorId,'a');
});
test('API actions persist, isolate notifications, and keep reactions idempotent',async()=>{
    let db=fixture();let saves=0;const routes=new Map();
    const app=Object.fromEntries(['get','post','put'].map(method=>[method,(url,handler)=>routes.set(`${method} ${url}`,handler)]));
    const multer=()=>({single:()=>()=>{}});multer.memoryStorage=()=>({});
    registerCommunitySocial(app,{readDB:async()=>db,writeDB:async data=>{db=structuredClone(data);saves++;},multer,cloudinary:{}});
    async function call(method,url,body={},query={},params={}){let status=200,value;const res={status(n){status=n;return this;},json(data){value=data;return this;}};await routes.get(`${method} ${url}`)({body,query,params},res);return{status,value};}
    await call('put','/api/community/relationships/:targetId',{userEmail:'ana@example.invalid',following:true},{},{targetId:'b'});
    await call('put','/api/community/relationships/:targetId',{userEmail:'biz@example.invalid',following:true},{},{targetId:'a'});
    const published=await call('post','/api/community/reels',{...video,userEmail:'ana@example.invalid'});assert.equal(published.status,201);
    const id=published.value.id;
    for(let i=0;i<2;i++)await call('post','/api/community/reels/:id/like',{userEmail:'biz@example.invalid',active:true},{},{id});
    assert.equal(db.community_reels[0].likedBy.length,1);
    const feed=await call('get','/api/community/reels',{}, {email:'biz@example.invalid'});assert.equal(feed.value.items[0].isLiked,true);
    await call('post','/api/community/reels/:id/comments',{userEmail:'biz@example.invalid',text:'Incrível!'},{},{id});assert.equal(db.community_reels[0].comments[0].text,'Incrível!');
    const own=await call('get','/api/community/notifications',{}, {email:'biz@example.invalid'});assert.equal(own.value.items.some(n=>n.type==='reel'),true);
    const other=await call('get','/api/community/notifications',{}, {email:'c@example.invalid'});assert.equal(other.value.items.length,0);
    await call('put','/api/community/notifications/read',{userEmail:'biz@example.invalid'});
    const read=await call('get','/api/community/notifications',{}, {email:'biz@example.invalid'});assert.equal(read.value.unreadCount,0);
    assert.ok(saves>=7);
});
test('reel upload validates identity and video, then uses Cloudinary video storage',async()=>{
    const db=fixture();const routes=new Map();let cloudConfigured=true,uploads=0;
    const app=Object.fromEntries(['get','post','put'].map(method=>[method,(url,handler)=>routes.set(`${method} ${url}`,handler)]));
    const multer=()=>({single:()=> (req,res,callback)=>callback(null)});multer.memoryStorage=()=>({});
    const cloudinary={config:()=>cloudConfigured?{cloud_name:'test',api_key:'test',api_secret:'test'}:{},uploader:{upload_stream(options,callback){assert.equal(options.resource_type,'video');return{end(buffer){assert.ok(Buffer.isBuffer(buffer));uploads++;callback(null,{secure_url:'https://res.cloudinary.com/test/video/upload/reel.mp4'});}};}}};
    registerCommunitySocial(app,{readDB:async()=>db,writeDB:async()=>{},multer,cloudinary});
    const call=async(body,file)=>{let status=200,result;const res={status(n){status=n;return this;},json(data){result=data;}};await routes.get('post /api/community/reel-upload')({body,query:{},file},res);return{status,result};};
    assert.equal((await call({userEmail:'missing@example.invalid'},{buffer:Buffer.from('video')})).status,401);
    assert.equal((await call({userEmail:'ana@example.invalid'},undefined)).status,400);
    cloudConfigured=false;assert.equal((await call({userEmail:'ana@example.invalid'},{buffer:Buffer.from('video')})).status,503);
    cloudConfigured=true;const result=await call({userEmail:'ana@example.invalid'},{buffer:Buffer.from('video')});
    assert.equal(result.status,200);assert.ok(result.result.url.startsWith('https://'));assert.equal(uploads,1);
});
test('feed pagination and saved filters use the current viewer without leaking another account saved list',async()=>{
    const db=fixture();const a=db.social_profiles[0];
    for(let i=0;i<25;i++)createReel(db,a,video);
    db.community_reels[0].savedBy=['b'];
    const routes=new Map();const app=Object.fromEntries(['get','post','put'].map(method=>[method,(url,handler)=>routes.set(`${method} ${url}`,handler)]));
    const multer=()=>({single:()=>()=>{}});multer.memoryStorage=()=>({});
    registerCommunitySocial(app,{readDB:async()=>db,writeDB:async()=>{},multer,cloudinary:{}});
    const call=async query=>{let result;await routes.get('get /api/community/reels')({body:{},query},{json(data){result=data;},status(){return this;}});return result;};
    const page1=await call({email:'biz@example.invalid'});assert.equal(page1.items.length,20);assert.equal(page1.nextOffset,20);
    const page2=await call({email:'biz@example.invalid',offset:'20'});assert.equal(page2.items.length,5);assert.equal(page2.nextOffset,null);
    assert.equal((await call({email:'biz@example.invalid',saved:'true'})).items.length,1);
    assert.equal((await call({email:'c@example.invalid',saved:'true'})).items.length,0);
});
test('photo reels retain the selected soundtrack, cover and original audio setting without trusting client music metadata',()=>{
    const db=fixture();const actor=db.social_profiles[0];
    const photo=createReel(db,actor,{mediaType:'photo',imageUrl:'https://res.cloudinary.com/test/image/upload/photo.jpg',caption:'Fotografia',music:{url:'https://evil.invalid/audio.mp3'},coverUrl:'javascript:alert(1)'});
    assert.equal(photo.mediaType,'photo');assert.equal(photo.videoUrl,undefined);assert.ok(photo.imageUrl.endsWith('photo.jpg'));assert.equal(photo.coverUrl,undefined);assert.equal(photo.music,null);
    const verified={id:'12345',title:'Ocean',url:'https://ccmixter.org/content/a/a.mp3',start:5,duration:15,volume:.7};
    const video=createReel(db,actor,{...{videoUrl:'https://res.cloudinary.com/test/video/upload/a.mp4'},muteOriginal:true,coverUrl:'https://res.cloudinary.com/test/image/upload/cover.jpg'},verified);
    assert.equal(decorateReel(db,video,actor).music.title,'Ocean');assert.equal(decorateReel(db,video,actor).muteOriginal,true);assert.ok(decorateReel(db,video,actor).coverUrl.endsWith('cover.jpg'));
});
test('photo uploads use image storage and reject images over the photo size limit',async()=>{
    const db=fixture();const routes=new Map();let uploads=0;
    const app=Object.fromEntries(['get','post','put'].map(method=>[method,(url,handler)=>routes.set(`${method} ${url}`,handler)]));
    const multer=()=>({single:()=> (req,res,callback)=>callback(null)});multer.memoryStorage=()=>({});
    const cloudinary={config:()=>({cloud_name:'test',api_key:'test',api_secret:'test'}),uploader:{upload_stream(options,callback){assert.equal(options.resource_type,'image');return{end(){uploads++;callback(null,{secure_url:'https://res.cloudinary.com/test/image/upload/photo.jpg'});}};}}};
    registerCommunitySocial(app,{readDB:async()=>db,writeDB:async()=>{},multer,cloudinary});
    const call=async size=>{let status=200,data;await routes.get('post /api/community/reel-upload')({body:{userEmail:'ana@example.invalid'},query:{},file:{mimetype:'image/jpeg',size,buffer:Buffer.from('photo')}},{status(n){status=n;return this;},json(value){data=value;}});return{status,data};};
    assert.equal((await call(21*1024*1024)).status,400);assert.equal(uploads,0);
    const result=await call(1024);assert.equal(result.status,200);assert.equal(result.data.mediaType,'photo');assert.equal(uploads,1);
});
