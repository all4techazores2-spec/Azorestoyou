import { API_BASE_URL } from '../config';
import { getCommunityToken } from './communitySession';
import { transferToCloudinary } from './cloudinaryTransfer.js';
export async function uploadCommunityMedia(file:File,email:string,options:{signal?:AbortSignal;onProgress?:(percent:number)=>void}={}):Promise<string>{
  return transferToCloudinary(file,{
    ...options,
    authorize:async(body:Record<string,unknown>,signal?:AbortSignal)=>{
      const response=await fetch(`${API_BASE_URL}/api/community/upload-signature`,{method:'POST',signal,headers:{'Content-Type':'application/json',Authorization:`Bearer ${getCommunityToken(email)}`},body:JSON.stringify(body)});
      const data=await response.json();if(!response.ok)throw new Error(data.error||'Não foi possível autorizar o envio.');return data;
    }
  });
}
