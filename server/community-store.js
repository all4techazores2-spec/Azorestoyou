const queues=new WeakMap();
export function communityWrite(readDB,writeDB,fn){
    const operation=(queues.get(readDB)||Promise.resolve()).then(async()=>{const db=await readDB();const result=await fn(db);await writeDB(db);return result;});
    queues.set(readDB,operation.catch(()=>{}));return operation;
}
