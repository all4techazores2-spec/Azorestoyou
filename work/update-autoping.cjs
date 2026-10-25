const fs=require('fs');
const file='server.js';let s=fs.readFileSync(file,'utf8');const start=s.indexOf('        // Force fresh deploy trigger to Render:');const end=s.indexOf('    });',s.indexOf('        setTimeout(selfPing, 5000);',start));
if(start<0||end<0)throw Error('Autoping block not found');
s=s.slice(0,start)+`        // Best effort only: a suspended process cannot wake itself.
        // An external monitor can call /api/health independently of this timer.
        const pingBaseUrl = process.env.RENDER_EXTERNAL_URL;
        if (pingBaseUrl) {
            let pingInFlight = false;
            const selfPing = async () => {
                if (pingInFlight) return;
                pingInFlight = true;
                try {
                    await axios.get(pingBaseUrl.replace(/\\/$/, '') + '/api/health', {
                        timeout: 10000,
                        headers: { 'Cache-Control': 'no-cache' }
                    });
                } catch (err) {
                    console.warn('Keep-alive temporariamente indisponível:', err.code || 'request_failed');
                } finally {
                    pingInFlight = false;
                }
            };
            const pingInterval = setInterval(selfPing, 5 * 60 * 1000);
            const initialPing = setTimeout(selfPing, 5000);
            pingInterval.unref();
            initialPing.unref();
            server.once('close', () => {
                clearInterval(pingInterval);
                clearTimeout(initialPing);
            });
        }
`+s.slice(end);fs.writeFileSync(file,s);
