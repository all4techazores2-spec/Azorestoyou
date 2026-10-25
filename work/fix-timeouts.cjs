const fs = require('fs');
const root = 'C:/Users/PC/Desktop/Azores4you/';
function edit(name, apply) {const old=fs.readFileSync(root+name,'utf8');const next=apply(old);if(next===old)throw Error('No change: '+name);fs.writeFileSync(root+name,next);}
edit('components/AuthModal.tsx', s => {
s=s.replace("method: 'POST',\n", "method: 'POST',\n");
s=s.replace("method: 'POST',\r\n          headers:", "method: 'POST',\r\n          signal: AbortSignal.timeout(30000),\r\n          headers:");
const start=s.indexOf('      } catch (err) {');const end=s.indexOf('\n    }',start);
if(start<0||end<0)throw Error('auth markers');
s=s.slice(0,start)+`        setError("Não foi possível iniciar sessão. Tenta novamente.");
        return;
      } catch (err) {
        setError("Não foi possível contactar o servidor. Tenta novamente dentro de alguns instantes.");
        return;
      } finally {
        setIsLoading(false);
      }`+s.slice(end);
if(!s.includes('signal: AbortSignal.timeout(30000)'))throw Error('Missing auth timeout');return s;
});
edit('server.js',s=>{
const start=s.indexOf("app.get('/api/health',");const end=s.indexOf("app.get('/api/test'",start);
return s.slice(0,start)+`// Liveness must not wait for a database read or refresh the shared data cache.
app.get('/api/health', (req, res) => {
    const db = getDbStatus();
    res.json({ status: 'ok', database: db.isMongo ? 'connected' : (db.isConfigured ? 'disconnected' : 'local'), uptime: process.uptime(), timestamp: new Date().toISOString() });
});

`+s.slice(end);
});
edit('db.js',s=>{
const start=s.indexOf('                let retries = 3;',s.indexOf('export const readDB'));
const end=s.indexOf('            })();',start);
if(start<0||end<0)throw Error('db markers');
return s.slice(0,start)+`                // Bound the entire driver operation, including server selection and retries.
                // Leave time for the API response before the client's 35-second deadline.
                const doc = await DBModel.findOne({ key: 'master_db' })
                    .lean().maxTimeMS(15000).setOptions({ timeoutMS: 20000 });
                const data = doc ? { ...DEFAULT_DB, ...doc.data } : DEFAULT_DB;
                memoryCache = data;
                lastCacheTime = Date.now();
                return data;
`+s.slice(end);
});
