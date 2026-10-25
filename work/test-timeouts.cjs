const fs=require('fs'),vm=require('vm'),assert=require('assert/strict'),ts=require('typescript');
(async()=>{
const auth=fs.readFileSync('components/AuthModal.tsx','utf8');
const handler=auth.slice(auth.indexOf('  const handleAuthSubmit'),auth.indexOf('  const t ='))+'\nglobalThis.submit=handleAuthSubmit;';
const compiled=ts.transpile(handler,{target:ts.ScriptTarget.ES2022});
for(const scenario of ['timeout','invalid','malformed','success']){
 let calls=0,loading,error,success=0;
 const context={email:'test@example.com',password:'test',authMode:'login',API_BASE_URL:'https://example.invalid',AbortSignal,console,
 setIsLoading:v=>loading=v,setError:v=>error=v,onSuccess:()=>success++,saveCommunitySession:()=>{},
 fetch:async(url,options)=>{calls++;assert.ok(options.signal);if(scenario==='timeout')throw new DOMException('Timed out','TimeoutError');return {ok:scenario!=='invalid',json:async()=>scenario==='malformed'?{}:scenario==='invalid'?{error:'Invalid'}:{success:true,email:'test@example.com'}};}};
 vm.createContext(context);vm.runInContext(compiled,context);await context.submit({preventDefault(){}});
 assert.equal(calls,1);assert.equal(loading,false);assert.equal(success,scenario==='success'?1:0);if(scenario!=='success')assert.ok(error);
 console.log('PASS login '+scenario);
}
const server=fs.readFileSync('server.js','utf8');const health=server.slice(server.indexOf("app.get('/api/health'"),server.indexOf("app.get('/api/test'"));let route;
vm.runInNewContext(health,{app:{get:(path,fn)=>route=fn},getDbStatus:()=>({isMongo:false,isConfigured:true}),process,Date,readDB:()=>{throw Error('Must not read DB');}});
let response;route({}, {json:v=>response=v});assert.equal(response.status,'ok');assert.equal(response.database,'disconnected');console.log('PASS health without database read');
const db=fs.readFileSync('db.js','utf8');const read=db.slice(db.indexOf('export const readDB'),db.indexOf('export const writeDB')).replace('export const readDB','globalThis.readDB');
let queries=0,fail=false;const context={isMongoConnected:true,memoryCache:null,lastCacheTime:0,CACHE_TTL_MS:30000,activeFetchPromise:null,DEFAULT_DB:{restaurants:[]},Date,console,
DBModel:{findOne(){queries++;return {lean(){return this},maxTimeMS(ms){assert.equal(ms,45000);return this},setOptions(options){assert.equal(options.timeoutMS,60000);return fail?Promise.reject(Error('timeout')):Promise.resolve({data:{restaurants:[{id:'test'}]}});}}}}};
vm.createContext(context);vm.runInContext(read,context);
const [a,b]=await Promise.all([context.readDB(),context.readDB()]);assert.equal(queries,1);assert.equal(a,b);assert.equal(a.restaurants[0].id,'test');console.log('PASS shared database read');
fail=true;const cached=await context.readDB(true);assert.equal(cached,a);assert.equal(context.activeFetchPromise,null);console.log('PASS cache preserved on database timeout');
context.memoryCache=null;await assert.rejects(context.readDB(true),/timeout/);assert.equal(context.activeFetchPromise,null);console.log('PASS database failure propagates without empty data');
})().catch(e=>{console.error(e);process.exitCode=1;});
