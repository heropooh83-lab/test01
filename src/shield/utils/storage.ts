/**
 * 갤러리와 투표 집계를 담아 두는 저장소 어댑터.
 *
 * 원본은 Claude 아티팩트 런타임이 넣어 주는 `window.storage`(반 전체 공유)만 썼고,
 * 그것이 없으면 전역 변수에 담아 새로고침하면 사라졌다.
 * 여기서는 같은 인터페이스를 세 단계로 낮춰 잡는다.
 *
 *   1. `window.storage` — 있으면 그대로 (여러 기기가 같은 값을 본다)
 *   2. `localStorage`   — 없으면 이 기기 안에서만 유지
 *   3. 메모리 Map       — 그것마저 막혀 있으면 (사생활 보호 모드 등) 탭이 살아 있는 동안만
 */

interface SharedStorage {
  get(key: string, shared?: boolean): Promise<{ value?: string } | null>;
  set(key: string, value: string, shared?: boolean): Promise<unknown>;
}

declare global {
  interface Window {
    storage?: SharedStorage;
  }
}

export type Backend = 'shared' | 'local' | 'memory';

const memory = new Map<string, string>();

function hasSharedStorage(): boolean {
  return typeof window !== 'undefined' && typeof window.storage?.get === 'function';
}

function hasLocalStorage(): boolean {
  try {
    const probe = '__shield_probe__';
    window.localStorage.setItem(probe, '1');
    window.localStorage.removeItem(probe);
    return true;
  } catch {
    return false;
  }
}

/** 지금 쓰이고 있는 저장 방식. 화면 문구를 정직하게 쓰기 위해 노출한다. */
export function backendOf(shared: boolean): Backend {
  if (shared && hasSharedStorage()) return 'shared';
  return hasLocalStorage() ? 'local' : 'memory';
}

/** '반 전체와 합치기'가 꺼지면 같은 데이터를 이 기기 전용 키에 따로 담는다. */
function scopedKey(key: string, shared: boolean): string {
  return shared ? key : `${key}:local`;
}

async function readRaw(key: string, shared: boolean): Promise<string | null> {
  const scoped = scopedKey(key, shared);
  if (shared && hasSharedStorage()) {
    try {
      const r = await window.storage!.get(key, true);
      return r?.value ?? null;
    } catch {
      // 공유 저장소가 실패하면 아래 단계로 조용히 내려간다.
    }
  }
  if (hasLocalStorage()) {
    try {
      return window.localStorage.getItem(scoped);
    } catch {
      // 무시하고 메모리로.
    }
  }
  return memory.get(scoped) ?? null;
}

async function writeRaw(key: string, shared: boolean, value: string): Promise<void> {
  const scoped = scopedKey(key, shared);
  if (shared && hasSharedStorage()) {
    try {
      await window.storage!.set(key, value, true);
      return;
    } catch {
      // 아래 단계로.
    }
  }
  if (hasLocalStorage()) {
    try {
      window.localStorage.setItem(scoped, value);
      return;
    } catch {
      // 아래 단계로.
    }
  }
  memory.set(scoped, value);
}

/** 깨진 JSON이 들어 있어도 앱이 멈추지 않도록 항상 fallback으로 되돌아간다. */
export async function readJson<T>(key: string, shared: boolean, fallback: T): Promise<T> {
  const raw = await readRaw(key, shared);
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export async function writeJson<T>(key: string, shared: boolean, value: T): Promise<void> {
  await writeRaw(key, shared, JSON.stringify(value));
}
