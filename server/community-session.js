import crypto from 'node:crypto';
import fs from 'node:fs';
const localKey=()=>{const file=new URL('./.community-session-key',import.meta.url);try{return fs.readFileSync(file,'utf8').trim();}catch{const key=crypto.randomBytes(48).toString('hex');try{fs.writeFileSync(file,key,{flag:'wx',mode:0o600});return key;}catch{try{return fs.readFileSync(file,'utf8').trim();}catch{return key;}}}};
const secret=process.env.COMMUNITY_SESSION_SECRET || process.env.SESSION_SECRET || (process.env.MONGODB_URI?crypto.createHmac('sha256',process.env.MONGODB_URI).update('azorestoyou-community-session-v1').digest('hex'):localKey());
export function createCommunitySession(email){
    const data=Buffer.from(JSON.stringify({email:String(email).trim().toLowerCase(),exp:Date.now()+7*86400000})).toString('base64url');
    return `${data}.${crypto.createHmac('sha256',secret).update(data).digest('base64url')}`;
}
export function sessionEmail(req){
    try{
        const token=String(req.headers?.authorization||'').replace(/^Bearer /,'');const [data,signature]=token.split('.');
        if(!data||!signature)throw new Error();
        const expected=crypto.createHmac('sha256',secret).update(data).digest();const actual=Buffer.from(signature,'base64url');
        if(actual.length!==expected.length||!crypto.timingSafeEqual(actual,expected))throw new Error();
        const value=JSON.parse(Buffer.from(data,'base64url').toString());if(!value.email||value.exp<=Date.now())throw new Error();return value.email;
    }catch{throw Object.assign(new Error('Para usar as mensagens, termina sessão e volta a entrar na tua conta.'),{status:401});}
}
