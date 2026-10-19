import crypto from 'node:crypto';

const fail = (message, status = 400) => Object.assign(new Error(message), { status });
const collections = db => {
    db.community_reels ||= [];
    db.community_follows ||= [];
    db.community_notifications ||= [];
    db.social_profiles ||= [];
    return db;
};
export const publicProfile = p => ({
    id: p.id, handle: p.handle, name: p.name, avatar: p.avatar || '',
    isBusiness: !!p.isBusiness, businessCategory: p.businessCategory,
    location: p.location || '', followersCount: p.followersCount || 0,
    followingCount: p.followingCount || 0,
});
export function getActor(db, email) {
    const normalized = String(email || '').trim().toLowerCase();
    const profile = (db.social_profiles || []).find(p => String(p.email || '').toLowerCase() === normalized);
    if (!normalized || !profile) throw fail('Inicia sessão na comunidade para continuar.', 401);
    return profile;
}
export function relationship(db, actorId, targetId) {
    const follows = db.community_follows || [];
    const following = follows.some(f => f.from === actorId && f.to === targetId);
    const followedBy = follows.some(f => f.from === targetId && f.to === actorId);
    return { following, followedBy, mutual: following && followedBy };
}
export function setFollowing(db, actor, targetId, following) {
    collections(db);
    const target = db.social_profiles.find(p => p.id === targetId);
    if (!target) throw fail('Perfil não encontrado.', 404);
    if (target.id === actor.id) throw fail('Não podes seguir a tua própria conta.');
    if (typeof following !== 'boolean') throw fail('Estado de seguimento inválido.');
    const previous = relationship(db, actor.id, target.id).following;
    if (previous !== following) {
        if (following) {
            db.community_follows.push({ from: actor.id, to: target.id, createdAt: new Date().toISOString() });
            db.community_notifications.unshift({ id: crypto.randomUUID(), recipientId: target.id,
                actorId: actor.id, type: 'follow', createdAt: new Date().toISOString(), read: false });
        } else {
            db.community_follows = db.community_follows.filter(f => !(f.from === actor.id && f.to === target.id));
        }
        const delta = following ? 1 : -1;
        actor.followingCount = Math.max(0, (actor.followingCount || 0) + delta);
        target.followersCount = Math.max(0, (target.followersCount || 0) + delta);
    }
    return { ...relationship(db, actor.id, target.id), target: publicProfile(target) };
}
export function createReel(db, actor, body) {
    collections(db);
    const videoUrl = String(body.videoUrl || '');
    if (!/^https:\/\//i.test(videoUrl) && !/^\/imagens\/community-reels\/[a-f0-9-]+\.(mp4|webm|mov)$/.test(videoUrl)) {
        throw fail('Carrega um vídeo antes de publicar.');
    }
    const ids = new Set(Array.isArray(body.mentions) ? body.mentions.slice(0, 20) : []);
    const mentions = db.social_profiles.filter(p => ids.has(p.id)).map(p => p.id);
    const reel = { id: crypto.randomUUID(), authorId: actor.id, videoUrl,
        caption: String(body.caption || '').trim().slice(0, 2200),
        location: String(body.location || '').trim().slice(0, 160),
        mentions, likedBy: [], savedBy: [], comments: [], createdAt: new Date().toISOString() };
    db.community_reels.unshift(reel);
    const recipients = new Set(db.community_follows.filter(f => f.from === actor.id &&
        relationship(db, actor.id, f.to).mutual).map(f => f.to));
    for (const recipientId of recipients) {
        if (recipientId === actor.id) continue;
        db.community_notifications.unshift({ id: crypto.randomUUID(), recipientId,
            actorId: actor.id, type: 'reel', reelId: reel.id, createdAt: reel.createdAt, read: false });
    }
    return reel;
}
export function decorateReel(db, reel, viewer) {
    const author = (db.social_profiles || []).find(p => p.id === reel.authorId);
    if (!author) return null;
    const mentionIds = new Set(reel.mentions || []);
    return { id: reel.id, videoUrl: reel.videoUrl, caption: reel.caption, location: reel.location,
        createdAt: reel.createdAt, author: publicProfile(author),
        mentions: (db.social_profiles || []).filter(p => mentionIds.has(p.id)).map(publicProfile),
        likes: (reel.likedBy || []).length, isLiked: !!viewer && (reel.likedBy || []).includes(viewer.id),
        isSaved: !!viewer && (reel.savedBy || []).includes(viewer.id),
        comments: (reel.comments || []).map(c => ({ ...c, author: publicProfile((db.social_profiles || []).find(p => p.id === c.authorId) || {id:c.authorId,name:'Membro',handle:''}) })),
        relationship: relationship(db, viewer?.id, author.id) };
}

// New social writes run sequentially so overlapping follow/publish requests don't lose each other.
export function registerCommunitySocial(app, { readDB, writeDB, multer, cloudinary }) {
    let writes = Promise.resolve();
    const route = fn => async (req, res) => {
        try { await fn(req, res); }
        catch (err) { console.error('Community social:', err.message); res.status(err.status || 500).json({ error: err.status ? err.message : 'Não foi possível concluir. Tenta novamente.' }); }
    };
    const mutate = fn => {
        const operation = writes.then(async () => {
            const db = collections(await readDB());
            const result = await fn(db);
            await writeDB(db);
            return result;
        });
        writes = operation.catch(() => {});
        return operation;
    };
    const emailOf = req => req.body?.userEmail || req.query.email;
    app.get('/api/community/relationships/:targetId', route(async (req, res) => {
        const db = await readDB(); const actor = getActor(db, emailOf(req));
        const target = (db.social_profiles || []).find(p => p.id === req.params.targetId);
        if (!target) throw fail('Perfil não encontrado.', 404);
        res.json({ ...relationship(db, actor.id, target.id), target: publicProfile(target) });
    }));
    app.put('/api/community/relationships/:targetId', route(async (req, res) => {
        res.json(await mutate(db => setFollowing(db, getActor(db, emailOf(req)), req.params.targetId, req.body.following)));
    }));
    app.get('/api/community/mentions', route(async (req, res) => {
        const db = await readDB(); getActor(db, emailOf(req));
        const query = String(req.query.q || '').trim().toLowerCase().slice(0, 100);
        res.json((db.social_profiles || []).filter(p => `${p.name} ${p.handle} ${p.businessCategory || ''}`.toLowerCase().includes(query)).slice(0, 25).map(publicProfile));
    }));
    app.get('/api/community/reels', route(async (req, res) => {
        const db = await readDB(); const actor = getActor(db, emailOf(req));
        const offset = Math.max(0, Number.parseInt(req.query.offset, 10) || 0);
        const limit = 20;
        const ordered = [...(db.community_reels || [])]
            .filter(r => (!req.query.authorId || r.authorId === req.query.authorId) &&
                (req.query.saved !== 'true' || (r.savedBy || []).includes(actor.id)))
            .sort((a,b) => b.createdAt.localeCompare(a.createdAt));
        res.json({ items: ordered.slice(offset, offset + limit).map(r => decorateReel(db, r, actor)).filter(Boolean),
            nextOffset: offset + limit < ordered.length ? offset + limit : null });
    }));
    app.get('/api/community/reels/:id', route(async (req, res) => {
        const db = await readDB(); const actor = getActor(db, emailOf(req));
        const reel = (db.community_reels || []).find(r => r.id === req.params.id);
        if (!reel) throw fail('Reel não encontrado.', 404);
        res.json(decorateReel(db, reel, actor));
    }));
    app.post('/api/community/reels', route(async (req, res) => {
        const result = await mutate(db => {
            const actor = getActor(db, emailOf(req));
            return decorateReel(db, createReel(db, actor, req.body), actor);
        });
        res.status(201).json(result);
    }));
    for (const action of ['like', 'save', 'comments']) {
        app.post(`/api/community/reels/:id/${action}`, route(async (req, res) => {
            const result = await mutate(db => {
                const actor = getActor(db, emailOf(req));
                const reel = db.community_reels.find(r => r.id === req.params.id);
                if (!reel) throw fail('Reel não encontrado.', 404);
                if (action === 'comments') {
                    const text = String(req.body.text || '').trim().slice(0, 1000);
                    if (!text) throw fail('Escreve um comentário.');
                    (reel.comments ||= []).push({ id: crypto.randomUUID(), authorId: actor.id, text, createdAt: new Date().toISOString() });
                } else {
                    const key = action === 'like' ? 'likedBy' : 'savedBy';
                    if (typeof req.body.active !== 'boolean') throw fail('Estado inválido.');
                    const ids = new Set(reel[key] || []);
                    if (req.body.active) ids.add(actor.id); else ids.delete(actor.id);
                    reel[key] = [...ids];
                }
                return decorateReel(db, reel, actor);
            });
            res.json(result);
        }));
    }
    app.get('/api/community/notifications', route(async (req, res) => {
        const db = await readDB(); const actor = getActor(db, emailOf(req));
        const all = (db.community_notifications || []).filter(n => n.recipientId === actor.id);
        res.json({ unreadCount: all.filter(n => !n.read).length, items: all.slice(0, 100).map(n => ({
            ...n, actor: publicProfile((db.social_profiles || []).find(p => p.id === n.actorId) || { id:n.actorId,name:'Membro',handle:'' }),
            mutual: relationship(db, actor.id, n.actorId).mutual,
            videoUrl: (db.community_reels || []).find(r => r.id === n.reelId)?.videoUrl,
        })) });
    }));
    app.put('/api/community/notifications/read', route(async (req, res) => {
        await mutate(db => {
            const actor = getActor(db, emailOf(req));
            for (const n of db.community_notifications) if (n.recipientId === actor.id && (!req.body.id || n.id === req.body.id)) n.read = true;
        });
        res.json({ success: true });
    }));
    const videoUpload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 100 * 1024 * 1024 },
        fileFilter: (req, file, cb) => cb(null, ['video/mp4', 'video/webm', 'video/quicktime'].includes(file.mimetype)) }).single('video');
    app.post('/api/community/reel-upload', (req, res) => videoUpload(req, res, err => {
        if (err) return res.status(400).json({ error: err.code === 'LIMIT_FILE_SIZE' ? 'O vídeo deve ter no máximo 100 MB.' : 'Não foi possível carregar o vídeo.' });
        return route(async (request, response) => {
            const db = await readDB(); getActor(db, emailOf(request));
            if (!request.file) throw fail('Escolhe um vídeo MP4, WebM ou MOV.');
            if (!cloudinary.config().cloud_name || !cloudinary.config().api_key || !cloudinary.config().api_secret) {
                throw fail('O armazenamento de vídeos ainda não está configurado no servidor.', 503);
            }
            const uploaded = await new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream({ resource_type: 'video', folder: 'community/reels' }, (error, result) => error ? reject(error) : resolve(result));
                stream.end(request.file.buffer);
            });
            response.json({ url: uploaded.secure_url });
        })(req, res);
    }));
}
