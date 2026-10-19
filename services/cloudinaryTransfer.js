const imageTypes = new Set(['image/jpeg', 'image/png', 'image/webp']);
const videoTypes = new Set(['video/mp4', 'video/webm', 'video/quicktime']);
export function validateCommunityFile(file) {
    const resourceType = imageTypes.has(file.type) ? 'image' : videoTypes.has(file.type) ? 'video' : null;
    if (!resourceType) throw new Error('Escolhe uma fotografia JPG, PNG ou WebP, ou um vídeo MP4, WebM ou MOV.');
    if (!Number.isFinite(file.size) || file.size <= 0 || file.size > (resourceType === 'image' ? 20 : 100) * 1024 * 1024) throw new Error(resourceType === 'image' ? 'A fotografia deve ter no máximo 20 MB.' : 'O vídeo deve ter no máximo 100 MB.');
    return resourceType;
}
// Only the small authorization request goes through the app server. The file goes to Cloudinary.
export async function transferToCloudinary(file, { authorize, onProgress = (percent) => {}, signal = undefined, createRequest = () => new XMLHttpRequest() }) {
    const resourceType = validateCommunityFile(file);
    signal?.throwIfAborted();
    const signed = await authorize({ fileType: file.type, fileSize: file.size }, signal);
    signal?.throwIfAborted();
    const endpoint = `https://api.cloudinary.com/v1_1/${encodeURIComponent(signed.cloudName)}/${resourceType}/upload`;
    if (!signed.cloudName || !signed.apiKey || !signed.signature || !signed.params?.timestamp) throw new Error('Não foi possível autorizar o envio. Tenta novamente.');
    return new Promise((resolve, reject) => {
        const request = createRequest();
        const abort = () => request.abort();
        const finish = () => signal?.removeEventListener('abort', abort);
        request.open('POST', endpoint); request.timeout = 10 * 60 * 1000;
        request.upload.onprogress = event => { if (event.lengthComputable) onProgress(Math.round(event.loaded / event.total * 100)); };
        request.onload = () => {
            finish();
            try {
                const result = JSON.parse(request.responseText);
                if (request.status < 200 || request.status >= 300) throw new Error(result.error?.message || 'O Cloudinary não conseguiu guardar o ficheiro.');
                const url = new URL(result.secure_url);
                if (url.protocol !== 'https:' || url.hostname !== 'res.cloudinary.com' || !url.pathname.startsWith(`/${signed.cloudName}/${resourceType}/upload/`)) throw new Error('O armazenamento não devolveu um link válido.');
                resolve(url.href);
            } catch (error) { reject(error); }
        };
        request.onerror = () => { finish(); reject(new Error('O envio foi interrompido. Verifica a ligação e tenta novamente.')); };
        request.ontimeout = () => { finish(); reject(new Error('O envio demorou demasiado. Tenta novamente.')); };
        request.onabort = () => { finish(); reject(new DOMException('Envio cancelado.', 'AbortError')); };
        const form = new FormData();
        for (const [name, value] of Object.entries(signed.params)) form.append(name, String(value));
        form.append('api_key', signed.apiKey); form.append('signature', signed.signature); form.append('file', file);
        signal?.addEventListener('abort', abort, { once: true });
        if (signal?.aborted) { finish(); reject(new DOMException('Envio cancelado.', 'AbortError')); return; }
        request.send(form);
    });
}
