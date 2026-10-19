import type { SyntheticEvent } from 'react';
import { API_BASE_URL } from '../config';

export interface CommunityIdentity {
  id: string; name: string; handle: string; avatar: string; isBusiness?: boolean;
  businessCategory?: string; location?: string; followersCount?: number; followingCount?: number;
}
export interface FollowState { following: boolean; followedBy: boolean; mutual: boolean; target?: CommunityIdentity; }
export interface CommunityReel {
  id: string; videoUrl: string; caption: string; location: string; createdAt: string;
  author: CommunityIdentity; mentions: CommunityIdentity[]; likes: number; isLiked: boolean; isSaved: boolean;
  relationship: FollowState;
  comments: {id: string; text: string; createdAt: string; author: CommunityIdentity}[];
}
export interface CommunityNotification {
  id: string; type: 'follow' | 'reel'; actor: CommunityIdentity; reelId?: string;
  videoUrl?: string; mutual: boolean; read: boolean; createdAt: string;
}
export const communityAvatar = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80"><rect width="80" height="80" rx="40" fill="#e9f2ff"/><circle cx="40" cy="30" r="14" fill="#6d8db5"/><path d="M14 76c0-30 52-30 52 0" fill="#6d8db5"/></svg>');
export const socialMediaUrl = (url = '') => url.startsWith('/') ? API_BASE_URL + url : url;
export const avatarError = (e: SyntheticEvent<HTMLImageElement>) => { e.currentTarget.onerror = null; e.currentTarget.src = communityAvatar; };
export async function socialRequest<T>(path: string, email: string, body?: Record<string, unknown>, method = 'POST', signal?: AbortSignal): Promise<T> {
  const response = await fetch(`${API_BASE_URL}/api/community/${path}${path.includes('?') ? '&' : '?'}email=${encodeURIComponent(email)}`, {
    method: body ? method : 'GET', signal,
    ...(body ? { headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...body, userEmail: email }) } : {}),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Não foi possível concluir. Tenta novamente.');
  return data;
}
export function socialTime(date: string) {
  const minutes = Math.max(0, Math.floor((Date.now() - new Date(date).getTime()) / 60000));
  return minutes < 1 ? 'Agora' : minutes < 60 ? `há ${minutes} min` : minutes < 1440 ? `há ${Math.floor(minutes / 60)} h` : `há ${Math.floor(minutes / 1440)} d`;
}
