export function cachedCollection(value, fallback=[]) {
    try{const parsed=typeof value==='string'?JSON.parse(value):value;return Array.isArray(parsed)?parsed:fallback;}catch{return fallback;}
}
export async function readCollectionResponse(response) {
    if(!response.ok)throw new Error(`Não foi possível carregar os dados (HTTP ${response.status}).`);
    let data;try{data=await response.json();}catch{throw new Error('O servidor devolveu uma resposta inválida.');}
    if(!Array.isArray(data))throw new Error('O servidor não devolveu uma lista válida.');
    return data;
}
export function createSyncGate(now=()=>Date.now()) {
    let busy=false,failures=0,nextAttempt=0;
    return{
        begin(){if(busy||now()<nextAttempt)return false;busy=true;return true;},
        end(failed){busy=false;if(failed){failures++;nextAttempt=now()+Math.min(60000,15000*2**Math.min(failures-1,2));}else{failures=0;nextAttempt=0;}},
        retry(){nextAttempt=0;}
    };
}
