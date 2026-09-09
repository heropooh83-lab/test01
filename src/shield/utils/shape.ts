import { SHIELD_SHAPES } from '../data/shapes';
import type { ShieldShape } from '../types';

/** 문자열을 32비트 정수로 접는 해시 (djb2 계열, 계수 31). */
export function hashName(value: string): number {
  const s = (value || '').trim();
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h * 31 + s.charCodeAt(i)) >>> 0;
  }
  return h;
}

/**
 * 모둠 이름으로 방패 도형을 고른다.
 * 난수가 아니라 해시이므로 같은 이름은 언제 열어도 같은 방패가 된다.
 * 이름이 비어 있으면 기본 도형(기사 방패)을 준다.
 */
export function shapeFor(name: string): ShieldShape {
  const n = (name || '').trim();
  if (!n) return SHIELD_SHAPES[0];
  return SHIELD_SHAPES[hashName(n) % SHIELD_SHAPES.length];
}

/** 갤러리 항목처럼 도형 key가 저장된 경우 그 key로 찾고, 없으면 이름 해시로 되돌아간다. */
export function shapeByKey(key: string, fallbackName: string): ShieldShape {
  return SHIELD_SHAPES.find((s) => s.key === key) ?? shapeFor(fallbackName);
}
