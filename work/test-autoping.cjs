const fs=require('fs'),vm=require('vm'),assert=require('assert/strict');
(async()=>{const source=fs.readFileSync('server.js','utf8');const start=source.indexOf('        const pingBaseUrl');const end=source.indexOf('\n    });',start);const code=source.slice(start,end);
let calls=0,interval,initial,close,release,cleared=0;
const context={process:{env:{RENDER_EXTERNAL_URL:'https://example.invalid/'}},console,axios:{get:(url,opts)=>{calls++;assert.equal(url,'https://example.invalid/api/health');assert.equal(opts.timeout,10000);return new Promise(r=>release=r);}},setInterval:(fn,ms)=>{assert.equal(ms,300000);interval=fn;return {unref(){}};},setTimeout:(fn,ms)=>{assert.equal(ms,5000);initial=fn;return {unref(){}};},clearInterval:()=>cleared++,clearTimeout:()=>cleared++,server:{once:(event,fn)=>close=fn}};
vm.runInNewContext(code,{...context});const pending=initial();await interval();assert.equal(calls,1);release();await pending;const retry=interval();assert.equal(calls,2);release();await retry;close();assert.equal(cleared,2);console.log('PASS autoping interval, timeout, overlap protection and cleanup');
context.process.env={};context.setInterval=()=>{throw Error('Unexpected local autoping')};vm.runInNewContext(code,{...context});console.log('PASS no autoping outside Render');
})().catch(e=>{console.error(e);process.exitCode=1;});

