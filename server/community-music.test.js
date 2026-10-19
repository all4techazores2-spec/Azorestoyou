import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeMusic, resolveMusic, searchMusic } from './community-music.js';

const track=(overrides={})=>({upload_id:12345,upload_name:'Ocean',user_real_name:'Artista',user_name:'artist',
    license_url:'http://creativecommons.org/licenses/by/3.0/',file_page_url:'https://ccmixter.org/files/artist/12345',
    upload_extra:{featuring:'Outro artista'},files:[{download_url:'https://ccmixter.org/content/artist/ocean.mp3',file_format_info:{mime_type:'audio/mpeg',ps:'3:26'}}],...overrides});
test('catalogue accepts only reusable licensed music from the expected audio source',()=>{
    const row=normalizeMusic(track());assert.equal(row.duration,206);assert.equal(row.license,'CC BY 3.0');assert.equal(row.featuring,'Outro artista');
    for(const license of ['https://creativecommons.org/licenses/by-nc/3.0/','https://creativecommons.org/licenses/by-nd/4.0/','https://creativecommons.org/licenses/by-sa/4.0/','https://evil.invalid/licenses/by/3.0/'])assert.equal(normalizeMusic(track({license_url:license})),null);
    assert.equal(normalizeMusic(track({upload_extra:{nsfw:true}})),null);
    assert.equal(normalizeMusic(track({files:[{download_url:'https://evil.invalid/audio.mp3',file_format_info:{mime_type:'audio/mpeg',ps:'3:26'}}]})),null);
});
test('selected music is revalidated and the client cannot substitute its URL, artist or licence',async()=>{
    const fetcher=async url=>{assert.ok(url.startsWith('https://ccmixter.org/api/query?'));const params=new URL(url).searchParams;assert.equal(params.get('lic'),'by');assert.equal(params.get('ids'),'12345');return{ok:true,json:async()=>[track()]};};
    const music=await resolveMusic({id:'12345',start:190,duration:30,volume:.5,url:'https://evil.invalid/audio.mp3',artist:'Forged'},fetcher);
    assert.equal(music.url,'https://ccmixter.org/content/artist/ocean.mp3');assert.equal(music.artist,'Artista');assert.equal(music.duration,16);assert.equal(music.trackDuration,206);assert.equal(music.volume,.5);
    assert.match(music.attribution,/Outro artista/);assert.match(music.attribution,/Excerto adaptado/);assert.match(music.attribution,/https:\/\/ccmixter.org/);
});
test('invalid musical excerpts and removed or changed licences cannot be published',async()=>{
    const fetcher=async()=>({ok:true,json:async()=>[track()]});
    for(const selection of [{id:'12345',start:-1},{id:'12345',start:206},{id:'12345',duration:61},{id:'12345',duration:0},{id:'12345',volume:2},{id:'12345',volume:'x'},{id:'https://evil.invalid'}])await assert.rejects(resolveMusic(selection,fetcher),{status:400});
    await assert.rejects(resolveMusic({id:'12345'},async()=>({ok:true,json:async()=>[track({license_url:'https://creativecommons.org/licenses/by-nc/3.0/'})]})),{status:400});
    assert.equal(await resolveMusic(null),null);
});
test('search sends bounded genre and pagination parameters and handles catalogue failures',async()=>{
    const result=await searchMusic({q:'unique_music_test',genre:'electronic',page:2},async url=>{
        const params=new URL(url).searchParams;assert.equal(params.get('offset'),'20');assert.equal(params.get('tags'),'electronic');assert.equal(params.get('search'),'unique_music_test');assert.equal(params.get('reqtags'),'remix');return{ok:true,json:async()=>[track()]};
    });assert.equal(result.items[0].title,'Ocean');assert.equal(result.provider,'ccMixter');
    await assert.rejects(searchMusic({q:'unique_error_test'},async()=>({ok:false,status:503})),{status:503});
});
