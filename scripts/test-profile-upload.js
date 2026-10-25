import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
const source=fs.readFileSync('components/ProfileModal.tsx','utf8');
const start=source.indexOf('  const handleFileChange =');const end=source.indexOf('\n  return (',start);
const code=ts.transpile(source.slice(start,end)+'\nglobalThis.change=handleFileChange;',{target:ts.ScriptTarget.ES2022});
for(const mode of ['success','fallback','offline','invalid']){
 let avatar='old',error='',busy=false,calls=0;
 const context={API_BASE_URL:'https://example.invalid',uploadingAvatar:false,AbortSignal,FormData:class{append(){}},setAvatar:v=>avatar=v,setUploadError:v=>error=v,setUploadingAvatar:v=>busy=v,
 fetch:async(url,options)=>{calls++;assert.ok(url.includes('requireCloud=true'));assert.equal(options.method,'POST');if(mode==='offline')throw Error('offline');return {ok:true,json:async()=>({url:mode==='fallback'?'data:image/png;base64,xxx':'https://example.com/avatar.webp'})};}};
 vm.runInNewContext(code,context);await context.change({target:{files:[{type:mode==='invalid'?'video/mp4':'image/png',size:100}],value:'file'}});
 assert.equal(busy,false);assert.equal(avatar,mode==='success'?'https://example.com/avatar.webp':'old');assert.equal(calls,mode==='invalid'?0:1);if(mode!=='success')assert.ok(error);console.log('PASS profile upload '+mode);
}
