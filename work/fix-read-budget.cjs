const fs=require('fs');
function replace(file,from,to){const s=fs.readFileSync(file,'utf8');if(!s.includes(from))throw Error('Missing '+file);fs.writeFileSync(file,s.replace(from,to));}
replace('db.js',"// Leave time for the API response before the client's 35-second deadline.","// Allow slow Atlas reads while remaining below the client's 75-second deadline.");
replace('db.js','.lean().maxTimeMS(15000).setOptions({ timeoutMS: 20000 })','.lean().maxTimeMS(45000).setOptions({ timeoutMS: 60000 })');
replace('App.tsx','signal:AbortSignal.timeout(35000)','signal:AbortSignal.timeout(75000)');
replace('components/AuthModal.tsx','signal: AbortSignal.timeout(30000)','signal: AbortSignal.timeout(75000)');
replace('work/test-timeouts.cjs','assert.equal(ms,15000)','assert.equal(ms,45000)');
replace('work/test-timeouts.cjs','assert.equal(options.timeoutMS,20000)','assert.equal(options.timeoutMS,60000)');
