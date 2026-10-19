const seedHandles=new Set(['@azorestoyou_andrebraga','@azorestoyou_restaurantex','@azorestoyou_maria','@azorestoyou_trilhos','@azorestoyou_casaacorespe','@azorestoyou_whalewatching']);
const seedIds=new Set(['sp_seed_andrebraga','sp_seed_restaurantex','sp_seed_maria','sp_seed_trilhos','sp_seed_casaacorespe','sp_seed_whalewatching']);
const defaultHighlightIds=new Set(['h1','h2','h3','h4','h_sm','h_ter','h_pico']);
export function cleanCommunityDemo(db){
    if(db.community_migrations?.remove_demo_v1)return false;
    const profiles=db.social_profiles||[];
    const registered=new Set((db.users||[]).map(u=>String(u.email||'').toLowerCase()));
    for(const value of Object.values(db))if(Array.isArray(value))for(const row of value)if(row?.adminEmail)registered.add(String(row.adminEmail).toLowerCase());
    const removed=profiles.filter(p=>seedIds.has(p.id)&&!registered.has(String(p.email||'').toLowerCase()));const removedIds=new Set(removed.map(p=>p.id));
    const removedPosts=(db.posts||[]).filter(p=>[1700000001,1700000002,1700000003,1700000004].includes(p.id)&&seedHandles.has(p.authorHandle));
    const postIds=new Set(removedPosts.map(p=>p.id));
    db.community_demo_archive={removedAt:new Date().toISOString(),profiles:removed,posts:removedPosts};
    db.social_profiles=profiles.filter(p=>!removedIds.has(p.id));db.posts=(db.posts||[]).filter(p=>!postIds.has(p.id));
    const ids=new Set(db.social_profiles.map(p=>p.id));
    db.community_follows=(db.community_follows||[]).filter(f=>ids.has(f.from)&&ids.has(f.to));
    db.community_notifications=(db.community_notifications||[]).filter(n=>!removedIds.has(n.actorId)&&!removedIds.has(n.recipientId));
    for(const p of db.social_profiles){
        p.followersCount=db.community_follows.filter(f=>f.to===p.id).length;p.followingCount=db.community_follows.filter(f=>f.from===p.id).length;
        p.postsCount=db.posts.filter(post=>post.authorHandle===p.handle).length;
        p.highlights=(p.highlights||[]).filter(h=>!(defaultHighlightIds.has(h.id)&&!h.media?.length));
        if(String(p.avatar||'').includes('dicebear.com'))p.avatar='';
        if(['Viajante apaixonado pelos Açores 🌿','Explorador da Comunidade Azorestoyou 🌿'].includes(p.bio))p.bio='';
    }
    for(const p of db.posts){p.comments=(p.comments||[]).filter(c=>!(seedHandles.has(c.authorHandle)&&[101,102,103,104].includes(c.id)));}
    db.community_migrations={...db.community_migrations,remove_demo_v1:true};return true;
}
