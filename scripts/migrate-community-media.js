// Read-only by default. Applying requires stopping all app writers first.
import 'dotenv/config';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { MongoClient, BSON } from 'mongodb';
import { v2 as cloudinary } from 'cloudinary';
import { findEmbeddedImages, externalizeImages } from '../server/community-media-migration.js';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const apply = process.argv.includes('--apply');
if (apply && !process.argv.includes('--writers-stopped')) throw new Error('Stop all application writers first, then pass --writers-stopped. Restart them after migration to clear cached data.');
if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI is required');
const client = new MongoClient(process.env.MONGODB_URI, { serverSelectionTimeoutMS:15000, timeoutMS:120000, maxPoolSize:1 });
try {
    await client.connect();
    const collection = client.db().collection('datas');
    const doc = await collection.findOne({ key:'master_db' });
    if (!doc?.data) throw new Error('master_db was not found; nothing was changed');
    const images = findEmbeddedImages(doc.data);
    console.log(JSON.stringify({ mode:apply?'apply':'dry-run', references:images.length, uniqueImages:new Set(images.map(i=>i.hash)).size, embeddedBytes:images.reduce((sum,i)=>sum+Buffer.byteLength(i.value),0), documentBytes:BSON.calculateObjectSize(doc) }));
    if (apply && images.length) {
        for (const key of ['CLOUDINARY_CLOUD_NAME','CLOUDINARY_API_KEY','CLOUDINARY_API_SECRET']) if (!process.env[key]?.trim()) throw new Error('Cloudinary configuration is incomplete; nothing was changed');
        cloudinary.config({ cloud_name:process.env.CLOUDINARY_CLOUD_NAME.trim(), api_key:process.env.CLOUDINARY_API_KEY.trim(), api_secret:process.env.CLOUDINARY_API_SECRET.trim() });
        const backupDir = path.join(root, 'backups');
        fs.mkdirSync(backupDir, { recursive:true });
        const backup = path.join(backupDir, `community-media-${Date.now()}.ejson`);
        fs.writeFileSync(backup, BSON.EJSON.stringify(doc, { relaxed:false }), { flag:'wx', mode:0o600 });
        const restored = BSON.EJSON.parse(fs.readFileSync(backup,'utf8'), { relaxed:false });
        if (!BSON.serialize(restored).equals(BSON.serialize(doc))) throw new Error('Backup verification failed');
        const next = await externalizeImages(doc.data, async (image, hash) => {
            const result = await cloudinary.uploader.upload(image, { resource_type:'image', public_id:`azores4you/community-migration/${hash}`, overwrite:false, timeout:120000 });
            return result.secure_url;
        });
        // Do not overwrite any concurrent changes, even outside the community.
        const result = await collection.updateOne({ _id:doc._id, data:doc.data }, { $set:{ data:next, updatedAt:new Date() } });
        if (result.matchedCount !== 1) throw new Error('Data changed during migration. Nothing was overwritten. Uploaded images are retained; retry during maintenance.');
        console.log(JSON.stringify({ applied:true, backup, remainingEmbeddedImages:findEmbeddedImages(next).length, resultingDataBytes:BSON.calculateObjectSize(next) }));
        console.log('Restart every application instance before accepting edits to clear old cached data.');
    }
} finally { await client.close(); }
