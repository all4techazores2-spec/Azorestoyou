import test from 'node:test';
import assert from 'node:assert/strict';
import { transferToCloudinary,validateCommunityFile } from '../services/cloudinaryTransfer.js';
import { cloudinaryDeliveryUrl,cloudinaryVideoPoster } from '../services/cloudinaryDelivery.js';
import { mainRearCamera,openNormalCamera } from '../services/reelCameraDevices.js';
process.env.COMMUNITY_SESSION_SECRET='test-only-media-session';
const {createCommunitySession}=await import('./community-session.js');
const {registerCommunitySocial}=await import('./community-social.js');
const signed={cloudName:'demo',apiKey:'public-key',signature:'test-signature',params:{timestamp:12345,folder:'community/reels',public_id:'test-id',allowed_formats:'mp4,webm,mov',overwrite:'false'}};
test('the upload authorization validates session, file and size and never returns the Cloudinary secret',async()=>{
 const routes=new Map();const app=Object.fromEntries(['get','post','put'].map(method=>[method,(path,handler)=>routes.set(method+' '+path,handler)]));
 const db={social_profiles:[{id:'a',email:'ana@example.invalid'}]};const multer=()=>({single:()=>()=>{}});multer.memoryStorage=()=>({});let signatures=0;
 const cloudinary={config:()=>({cloud_name:'demo',api_key:'public-key',api_secret:'private-test-secret'}),utils:{api_sign_request(params,secret){signatures++;assert.equal(secret,'private-test-secret');assert.ok(params.public_id);assert.equal(params.allowed_formats,'mp4,webm,mov');return 'signed';}}};
 registerCommunitySocial(app,{readDB:async()=>db,writeDB:async()=>{},multer,cloudinary});
 const call=async(body,token=createCommunitySession('ana@example.invalid'))=>{let status=200,value;await routes.get('post /api/community/upload-signature')({body,headers:{authorization:'Bearer '+token}},{setHeader(){},status(n){status=n;return this;},json(v){value=v;}});return{status,value};};
 assert.equal((await call({fileType:'video/mp4',fileSize:10},'invalid')).status,401);
 assert.equal((await call({fileType:'video/mp4',fileSize:101*1024*1024})).status,400);
 assert.equal((await call({fileType:'text/html',fileSize:10})).status,400);
 const result=await call({fileType:'video/mp4',fileSize:10});assert.equal(result.status,200);assert.equal(result.value.signature,'signed');assert.equal(signatures,1);assert.ok(!JSON.stringify(result.value).includes('private-test-secret'));
});
function requestHarness(responseUrl='https://res.cloudinary.com/demo/video/upload/v1/test.mp4'){
 let form,endpoint,request;return{createRequest:()=>request={upload:{},open(method,url){assert.equal(method,'POST');endpoint=url;},send(value){form=value;queueMicrotask(()=>{this.upload.onprogress({lengthComputable:true,loaded:10,total:10});this.status=200;this.responseText=JSON.stringify({secure_url:responseUrl});this.onload();});},abort(){this.onabort();}},get form(){return form;},get endpoint(){return endpoint;},get request(){return request;}};
}
test('file bytes are sent straight to Cloudinary while the app receives only file metadata',async()=>{
 const file=new File(['video data'],'video.mp4',{type:'video/mp4'});const h=requestHarness();const progress=[];let authorizations=0;
 const url=await transferToCloudinary(file,{authorize:async(body)=>{authorizations++;assert.deepEqual(body,{fileType:'video/mp4',fileSize:file.size});assert.ok(!('file' in body));return signed;},onProgress:value=>progress.push(value),createRequest:h.createRequest});
 assert.equal(h.endpoint,'https://api.cloudinary.com/v1_1/demo/video/upload');assert.equal(h.form.get('file'),file);assert.equal(h.form.get('signature'),'test-signature');assert.equal(h.form.get('overwrite'),'false');assert.equal(url,'https://res.cloudinary.com/demo/video/upload/v1/test.mp4');assert.deepEqual(progress,[100]);assert.equal(authorizations,1);
});
test('invalid files, interrupted uploads and links outside the configured cloud are rejected',async()=>{
 for(const size of [-1,0,NaN,Infinity,21*1024*1024])assert.throws(()=>validateCommunityFile({type:'image/jpeg',size}));
 const file=new File(['video'],'video.mp4',{type:'video/mp4'});const h=requestHarness('https://elsewhere.invalid/video.mp4');await assert.rejects(transferToCloudinary(file,{authorize:async()=>signed,createRequest:h.createRequest}),/link válido/);
 const controller=new AbortController();controller.abort();await assert.rejects(transferToCloudinary(file,{signal:controller.signal,authorize:async()=>{throw new Error('must not run');}}),{name:'AbortError'});
 let authorizationDone;const ready=new Promise(resolve=>authorizationDone=resolve);const cancellation=new AbortController();let request;
 const pending=transferToCloudinary(file,{signal:cancellation.signal,authorize:async()=>signed,createRequest:()=>request={upload:{},open(){},send(){authorizationDone();},abort(){this.onabort();}}});
 await ready;cancellation.abort();await assert.rejects(pending,{name:'AbortError'});
});
test('delivery URLs optimize Cloudinary photos and videos and keep other URLs intact',()=>{
 const photo='https://res.cloudinary.com/demo/image/upload/v1/photo.jpg';const video='https://res.cloudinary.com/demo/video/upload/v1/movie.webm';
 assert.ok(cloudinaryDeliveryUrl(photo).includes('/f_auto,q_auto,w_1080,c_limit/'));assert.equal(cloudinaryDeliveryUrl(cloudinaryDeliveryUrl(photo)),cloudinaryDeliveryUrl(photo));
 assert.ok(cloudinaryDeliveryUrl(video).includes('/f_mp4,vc_h264,q_auto,w_720,c_limit/'));assert.ok(cloudinaryVideoPoster(video).endsWith('/v1/movie.jpg'));
 for(const url of ['blob:preview','data:image/jpeg;base64,abc','https://example.invalid/image.jpg','/imagens/old.jpg','https://res.cloudinary.com/demo/video/upload/s--signed--/private.mp4'])assert.equal(cloudinaryDeliveryUrl(url),url);
});
const device=(id,label)=>({kind:'videoinput',deviceId:id,label});
function cameraStream(id,zoom={min:1,max:10}){let stopped=false,constraints;const track={stop(){stopped=true;},getSettings:()=>({deviceId:id}),getCapabilities:()=>zoom?{zoom}:{},applyConstraints:async value=>{constraints=value;}};return{getTracks:()=>[track],getVideoTracks:()=>[track],get stopped(){return stopped;},get constraints(){return constraints;}};}
test('rear lens selection prefers the primary lens over telephoto and ultrawide',()=>{
 const devices=[device('tele','Back Telephoto Camera'),device('ultra','Back Ultra Wide Camera'),device('main','Back Camera'),device('front','Front Camera')];assert.equal(mainRearCamera(devices).deviceId,'main');assert.equal(mainRearCamera([device('front','Front Camera')]),undefined);
});
test('camera acquisition releases the zoom lens, selects the primary lens and resets supported zoom',async()=>{
 const first=cameraStream('tele'),normal=cameraStream('main');const requests=[];
 const result=await openNormalCamera({getUserMedia:async options=>{requests.push(options);return requests.length===1?first:normal;},enumerateDevices:async()=>[device('tele','Back Telephoto Camera'),device('main','Back Camera')]},'environment',true);
 assert.equal(result,normal);assert.equal(first.stopped,true);assert.deepEqual(requests[1].video.deviceId,{exact:'main'});assert.equal(requests[0].video.height.ideal,720);assert.equal(requests[0].video.resizeMode.ideal,'none');assert.deepEqual(normal.constraints,{advanced:[{zoom:1}]});
});
test('front cameras and cameras without zoom work; cancelled opening stops the stream',async()=>{
 const front=cameraStream('front',null);assert.equal(await openNormalCamera({getUserMedia:async()=>front,enumerateDevices:async()=>{throw new Error('must not inspect rear lenses');}},'user',false),front);
 const cancelled=cameraStream('main');await assert.rejects(openNormalCamera({getUserMedia:async()=>cancelled},'environment',false,()=>true),{name:'AbortError'});assert.equal(cancelled.stopped,true);
 const fallback=cameraStream('fallback');const first=cameraStream('tele');let calls=0;
 assert.equal(await openNormalCamera({getUserMedia:async()=>{calls++;if(calls===2)throw new Error('lens not available');return calls===1?first:fallback;},enumerateDevices:async()=>[device('main','Back Camera')]},'environment',true),fallback);assert.equal(first.stopped,true);
});
