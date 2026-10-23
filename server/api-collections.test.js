import test from 'node:test';
import assert from 'node:assert/strict';
import {cachedCollection,readCollectionResponse,createSyncGate} from '../services/apiCollections.js';
test('cached lists reject old error objects, invalid JSON and scalar values without breaking filter',()=>{
 const fallback=[{id:'saved'}];
 for(const value of ['{"error":"unavailable"}','invalid','null','12','"text"',{},null]){const list=cachedCollection(value,fallback);assert.equal(list,fallback);assert.equal(list.filter(Boolean).length,1);}
 assert.deepEqual(cachedCollection('[{"id":"real"}]'),[{id:'real'}]);assert.deepEqual(cachedCollection('[]',fallback),[]);
});
test('503 and non-list responses never replace existing users or enter the cache',async()=>{
 let users=[{id:'real'}];let cached=users;
 const responses=[new Response('{"error":"unavailable"}',{status:503}),new Response('<html>Service Suspended</html>',{status:503}),new Response('{"error":"invalid response"}',{status:200}),new Response('not json',{status:200})];
 for(const response of responses){await assert.rejects(async()=>{const result=await readCollectionResponse(response);users=result;cached=result;});assert.deepEqual(users,[{id:'real'}]);assert.deepEqual(cached,users);}
 users=await readCollectionResponse(new Response('[]',{status:200}));assert.deepEqual(users,[]);
 users=await readCollectionResponse(new Response('[{"id":"fresh"}]',{status:200}));assert.deepEqual(users,[{id:'fresh'}]);
});
test('failed synchronizations stop overlapping calls and back off until recovery',()=>{
 let time=0;const gate=createSyncGate(()=>time);
 assert.equal(gate.begin(),true);assert.equal(gate.begin(),false);gate.end(true);
 for(time=2000;time<15000;time+=2000)assert.equal(gate.begin(),false);
 time=15000;assert.equal(gate.begin(),true);gate.end(true);
 time=44999;assert.equal(gate.begin(),false);time=45000;assert.equal(gate.begin(),true);gate.end(true);
 time=104999;assert.equal(gate.begin(),false);time=105000;assert.equal(gate.begin(),true);gate.end(false);
 assert.equal(gate.begin(),true);gate.end(false);assert.equal(gate.begin(),true);
});
test('manual retry does not allow duplicate requests while a synchronization is running',()=>{
 const gate=createSyncGate(()=>0);assert.equal(gate.begin(),true);gate.end(true);assert.equal(gate.begin(),false);gate.retry();assert.equal(gate.begin(),true);gate.retry();assert.equal(gate.begin(),false);
});
