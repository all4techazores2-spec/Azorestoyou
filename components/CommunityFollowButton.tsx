import React, { useEffect, useState } from 'react';
import { Check, Loader2, Plus } from 'lucide-react';
import { FollowState, socialRequest } from '../services/communitySocial';

interface Props { key?: string; email: string; targetId: string; ownId?: string; initial?: FollowState; light?: boolean; onChange?: (state: FollowState) => void; }
export default function CommunityFollowButton({ email, targetId, ownId, initial, light, onChange }: Props) {
  const [state, setState] = useState<FollowState | null>(initial || null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  useEffect(() => {
    setState(initial || null); setError('');
    if (!email || !targetId || targetId === ownId) return;
    const controller = new AbortController();
    socialRequest<FollowState>(`relationships/${encodeURIComponent(targetId)}`, email, undefined, undefined, controller.signal)
      .then(setState).catch(e => { if (e.name !== 'AbortError') setError(e.message); });
    return () => controller.abort();
  }, [email, targetId, ownId]);
  if (targetId === ownId) return null;
  return <span className="community-follow-wrap"><button type="button" className={`community-follow ${light ? 'light' : ''}`} disabled={!email || busy || !state} aria-pressed={!!state?.following}
    onClick={async e => { e.stopPropagation(); if (!state || busy) return; setBusy(true); setError('');
      try { const result = await socialRequest<FollowState>(`relationships/${encodeURIComponent(targetId)}`, email, { following: !state.following }, 'PUT'); setState(result); onChange?.(result); window.dispatchEvent(new Event('community-follow-changed')); }
      catch (e) { setError(e.message); } finally { setBusy(false); }
    }}>{busy ? <Loader2 size={13} className="animate-spin"/> : state?.following ? <Check size={13}/> : <Plus size={13}/>}<span>{state?.mutual ? 'Amigos' : state?.following ? 'A seguir' : 'Seguir'}</span></button>{error && <small className="community-inline-error" role="alert">{error}</small>}</span>;
}
