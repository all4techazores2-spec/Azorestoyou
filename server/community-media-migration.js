import crypto from 'node:crypto';
const keys = ['posts', 'social_profiles', 'users', 'community_reels', 'community_stories', 'community_messages', 'community_demo_archive'];
export function findEmbeddedImages(data) {
    const found = [];
    function walk(value, path) {
        if (typeof value === 'string' && /^data:image\/(png|jpe?g|webp|gif);base64,/i.test(value)) {
            found.push({ path, value, hash: crypto.createHash('sha256').update(value).digest('hex') });
        } else if (value && typeof value === 'object') {
            for (const [key, child] of Object.entries(value)) walk(child, [...path, key]);
        }
    }
    for (const key of keys) walk(data[key], [key]);
    return found;
}
export async function externalizeImages(data, upload) {
    const next = structuredClone(data);
    const urls = new Map();
    for (const item of findEmbeddedImages(data)) {
        if (!urls.has(item.hash)) {
            const url = await upload(item.value, item.hash);
            if (typeof url !== 'string' || !url.startsWith('https://')) throw new Error('Upload did not return an HTTPS URL');
            urls.set(item.hash, url);
        }
        let parent = next;
        for (const key of item.path.slice(0, -1)) parent = parent[key];
        parent[item.path.at(-1)] = urls.get(item.hash);
    }
    return next;
}
