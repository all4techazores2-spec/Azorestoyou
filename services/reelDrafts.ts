export interface ReelDraft {
  file: Blob; fileName: string; fileType: string; caption: string; location: string;
  mentions: any[]; music: any; muteOriginal: boolean; savedAt: string;
  coverFile?: Blob; coverName?: string;
}
async function storage() {
  return new Promise<IDBDatabase>((resolve,reject)=>{
    const request=indexedDB.open('azorestoyou-reel-drafts',1);
    request.onupgradeneeded=()=>request.result.createObjectStore('drafts');
    request.onsuccess=()=>resolve(request.result);request.onerror=()=>reject(request.error);
  });
}
export async function readReelDraft(key:string):Promise<ReelDraft|null> {
  const db=await storage();return new Promise((resolve,reject)=>{
    const tx=db.transaction('drafts','readonly');const request=tx.objectStore('drafts').get(key);
    request.onsuccess=()=>resolve(request.result||null);request.onerror=()=>reject(request.error);tx.oncomplete=()=>db.close();
  });
}
export async function writeReelDraft(key:string,draft:ReelDraft|null) {
  const db=await storage();return new Promise<void>((resolve,reject)=>{
    const tx=db.transaction('drafts','readwrite');const store=tx.objectStore('drafts');if(draft)store.put(draft,key);else store.delete(key);
    tx.oncomplete=()=>{db.close();resolve();};tx.onerror=()=>{db.close();reject(tx.error);};tx.onabort=()=>{db.close();reject(tx.error);};
  });
}
