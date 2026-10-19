import { API_BASE_URL } from '../config';
const key='azorestoyou_community_session';
export function getCommunityToken(email:string){try{const session=JSON.parse(localStorage.getItem(key)||'null');return session?.email===email.toLowerCase()?String(session.token||''):'';}catch{return '';}}
export function saveCommunitySession(email:string,token:string){if(!email||!token)return;localStorage.setItem(key,JSON.stringify({email:email.toLowerCase(),token}));window.dispatchEvent(new Event('community-session-changed'));}
export function clearCommunitySession(){localStorage.removeItem(key);window.dispatchEvent(new Event('community-session-changed'));}
export async function ensureCommunitySession(email:string,password:string){if(getCommunityToken(email))return;const response=await fetch(`${API_BASE_URL}/api/auth/login`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email,password})});const result=await response.json();if(response.ok&&result.communityToken)saveCommunitySession(result.email,result.communityToken);}
