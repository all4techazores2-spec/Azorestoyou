import https from 'node:https';

const error = (message, status = 400) => Object.assign(new Error(message), { status });
// ccHost repeats its JSON in an X-JSON response header. Allow that legacy header
// only on this bounded, fixed-origin catalogue request; normal API limits stay unchanged.
function catalogueFetch(url, options = {}) {
    return new Promise((resolve,reject)=>{
        const request=https.get(url,{maxHeaderSize:256*1024,signal:options.signal,headers:options.headers},response=>{
            let body='',size=0;response.setEncoding('utf8');
            response.on('data',chunk=>{size+=Buffer.byteLength(chunk);if(size>2*1024*1024){request.destroy(error('A resposta da biblioteca é demasiado grande.',503));return;}body+=chunk;});
            response.on('error',reject);
            response.on('end',()=>resolve({ok:response.statusCode===200,json:async()=>JSON.parse(body)}));
        });
        request.on('error',reject);
    });
}
const cache = new Map();
const genres = new Set(['all', 'electronic', 'pop', 'hip_hop', 'ambient', 'acoustic', 'rock', 'jazz']);
const plain = value => String(value || '').replace(/<[^>]+>/g, '').slice(0, 500);
const secure = value => { try { const url = new URL(value); if (!['http:', 'https:'].includes(url.protocol)) return ''; url.protocol = 'https:'; return url.href; } catch { return ''; } };
const seconds = value => String(value || '').split(':').reduce((sum, part) => sum * 60 + (Number(part) || 0), 0);
export function normalizeMusic(row) {
    const licenseUrl = secure(row.license_url);
    if (!/^https:\/\/creativecommons\.org\/licenses\/by\/(2\.0|2\.5|3\.0|4\.0)\/$/.test(licenseUrl) || row.upload_extra?.nsfw) return null;
    const file = (row.files || []).find(f => f.file_format_info?.mime_type === 'audio/mpeg' && /^https:\/\/(www\.)?ccmixter\.org\/content\//.test(secure(f.download_url)));
    const duration = file ? seconds(file.file_format_info.ps) : 0;
    if (!file || duration < 5 || !/^\d+$/.test(String(row.upload_id))) return null;
    return { id: String(row.upload_id), title: plain(row.upload_name), artist: plain(row.user_real_name || row.user_name),
        featuring: plain(row.upload_extra?.featuring), url: secure(file.download_url), duration,
        sourceUrl: secure(row.file_page_url), licenseUrl, license: `CC BY ${licenseUrl.split('/').filter(Boolean).at(-1)}`,
        provider: 'ccMixter' };
}
async function query(params, fetcher = catalogueFetch, cached = true) {
    const key = new URLSearchParams({ f:'json', lic:'by', ...params }).toString();
    const hit = cache.get(key);
    if (cached && hit && Date.now() - hit.time < 20 * 60 * 1000) return hit.rows;
    const response = await fetcher(`https://ccmixter.org/api/query?${key}`, { signal: AbortSignal.timeout(15000), headers: { Accept:'application/json', 'User-Agent':'Azorestoyou/1.0 (community music library)' } });
    if (!response.ok) throw error('A biblioteca de música está temporariamente indisponível. Tenta novamente.', 503);
    const data = await response.json();
    if (!Array.isArray(data)) throw error('A biblioteca de música não respondeu como esperado.', 503);
    const rows = data.map(normalizeMusic).filter(Boolean);
    if (cache.size > 80) cache.delete(cache.keys().next().value);
    cache.set(key,{ time:Date.now(),rows });
    return rows;
}
export async function searchMusic({ q='', genre='all', page=1 } = {}, fetcher) {
    const params={ limit:'20', offset:String((Math.min(30,Math.max(1,Number(page)||1))-1)*20), reqtags:'remix', sort:'rank' };
    if (String(q).trim()) params.search=String(q).trim().slice(0,100);
    if (genres.has(genre) && genre !== 'all') params.tags=genre;
    const items=await query(params,fetcher);
    return {items,hasMore:items.length>=15,provider:'ccMixter'};
}
export async function resolveMusic(selection, fetcher) {
    if (!selection) return null;
    if (!/^\d{1,12}$/.test(String(selection.id || ''))) throw error('Escolhe uma música da biblioteca.');
    const items=await query({ids:String(selection.id),limit:'1'},fetcher,false);
    const track=items.find(t=>t.id===String(selection.id));
    if(!track)throw error('Esta música já não está disponível na biblioteca. Escolhe outra.');
    const start=Number(selection.start ?? 0), duration=Number(selection.duration ?? 15), volume=Number(selection.volume ?? .7);
    if(!Number.isFinite(start)||start<0||start>=track.duration||!Number.isFinite(duration)||duration<1||duration>60||!Number.isFinite(volume)||volume<0||volume>1)throw error('O trecho de música selecionado é inválido.');
    return {...track,trackDuration:track.duration,start,duration:Math.min(duration,track.duration-start),volume,
        attribution:`“${track.title}” — ${track.artist}${track.featuring ? `, com ${track.featuring}` : ''}. ${track.license}. Fonte: ${track.sourceUrl}. Excerto adaptado para esta publicação.`};
}
export function registerCommunityMusic(app,{readDB,getActor}) {
    app.get('/api/community/music',async(req,res)=>{
        try{getActor(await readDB(),req.query.email);res.json(await searchMusic(req.query));}
        catch(e){res.status(e.status||503).json({error:e.status?e.message:'Não foi possível abrir a biblioteca de música. Tenta novamente.'});}
    });
    // Serve the licensed track through the app: ccMixter disallows external hotlinks.
    // Only a catalogue-verified numeric id can select a fixed-origin audio URL.
    app.get('/api/community/music/:id/audio',async(req,res)=>{
        try{
            if(!/^\d{1,12}$/.test(req.params.id))throw error('Música inválida.');
            const rows=await query({ids:req.params.id,limit:'1'});
            const track=rows.find(t=>t.id===req.params.id);
            if(!track)throw error('Música não encontrada.',404);
            const range=req.headers?.range;
            if(range&&!/^bytes=\d*-\d*$/.test(range))throw error('Intervalo de áudio inválido.',416);
            const headers={ 'User-Agent':'Azorestoyou/1.0',Referer:track.sourceUrl,Accept:'audio/mpeg',...(range?{Range:range}:{}) };
            const upstream=https.get(track.url,{headers,timeout:15000},response=>{
                if(![200,206].includes(response.statusCode)||!String(response.headers['content-type']||'').startsWith('audio/')){
                    response.resume();res.status(response.statusCode===416?416:503).json({error:'Esta música não está disponível neste momento.'});return;
                }
                res.status(response.statusCode);
                for(const name of ['content-type','content-length','content-range','accept-ranges','last-modified','etag'])if(response.headers[name])res.setHeader(name,response.headers[name]);
                res.setHeader('Cache-Control','public, max-age=86400');
                res.setHeader('X-Content-Type-Options','nosniff');
                response.on('error',()=>res.destroy());response.pipe(res);
            });
            const failStream=()=>{if(!res.headersSent)res.status(503).json({error:'Não foi possível reproduzir esta música.'});else res.destroy();};
            upstream.on('timeout',()=>upstream.destroy(new Error('Audio timeout')));
            upstream.on('error',failStream);res.on('close',()=>upstream.destroy());
        }catch(e){res.status(e.status||503).json({error:e.status?e.message:'Não foi possível abrir esta música.'});}
    });
}
