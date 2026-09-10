import type { GalleryEntry, Tally, VoteChoice } from '../types';
import { readJson, writeJson } from '../../shared/storage';

/** 원본 HTML이 쓰던 키를 그대로 유지해, 기존 데이터가 있으면 이어서 읽는다. */
export const GALLERY_KEY = 'shield_gallery_v1';
export const TALLY_KEY = 'shield_vote_tally_v1';
/** 내 표가 무엇이었는지는 늘 이 기기에만 둔다 (공유하면 다른 모둠 표를 지울 수 있다). */
const MY_VOTE_KEY = 'shield_my_vote_v1';

export const EMPTY_TALLY: Tally = { dev: 0, reg: 0 };

export function loadGallery(shared: boolean): Promise<GalleryEntry[]> {
  return readJson<GalleryEntry[]>(GALLERY_KEY, shared, []);
}

export function saveGallery(shared: boolean, entries: GalleryEntry[]): Promise<void> {
  return writeJson(GALLERY_KEY, shared, entries);
}

export async function loadTally(shared: boolean): Promise<Tally> {
  const t = await readJson<Partial<Tally>>(TALLY_KEY, shared, EMPTY_TALLY);
  return { dev: Number(t.dev) || 0, reg: Number(t.reg) || 0 };
}

export function saveTally(shared: boolean, tally: Tally): Promise<void> {
  return writeJson(TALLY_KEY, shared, tally);
}

/**
 * 새로고침해도 '우리 모둠은 이미 던졌다'를 기억한다.
 * 원본은 이 값을 메모리에만 두어, 새로고침 후 다시 누르면 표가 중복으로 쌓였다.
 * 집계와 짝이 맞도록 공유/개인 집계마다 따로 기록한다.
 */
function myVoteKey(shared: boolean): string {
  return `${MY_VOTE_KEY}:${shared ? 'shared' : 'solo'}`;
}

export function loadMyVote(shared: boolean): Promise<VoteChoice | null> {
  return readJson<VoteChoice | null>(myVoteKey(shared), false, null);
}

export function saveMyVote(shared: boolean, choice: VoteChoice | null): Promise<void> {
  return writeJson(myVoteKey(shared), false, choice);
}
