import { readJson, writeJson } from '../../shared/storage';
import type { QuestionStat, Tally } from '../types';

/**
 * 반 정답률 저장소.
 *
 * 원본은 `deepfake_quiz_tally_v1`에 `{q0:{correct,total}, ...}`를 담았다.
 * 배열 인덱스가 키였기 때문에 문항을 하나만 끼워 넣어도 이전 집계가 다른 문항으로 옮겨 붙었다.
 * 여기서는 문항 id를 키로 쓰고, 모양이 달라졌으므로 키 이름도 v2로 올린다.
 */
export const TALLY_KEY = 'deepfake_quiz_tally_v2';

/**
 * 이 기기가 이미 집계에 넣은 문항들. 늘 이 기기에만 둔다(공유하면 남의 기록을 지운다).
 * 원본은 이것이 없어 '다시 도전하기'를 누를 때마다 같은 학생의 답이 계속 쌓였고,
 * 화면에는 그 수가 '○명'으로 표시돼 반 인원보다 큰 숫자가 나왔다.
 */
const COUNTED_KEY = 'deepfake_quiz_counted_v1';

const EMPTY_STAT: QuestionStat = { correct: 0, total: 0 };

/** 저장된 값이 깨졌거나 남이 손댔어도 화면이 멈추지 않도록 숫자로 다듬는다. */
function normalize(raw: unknown): Tally {
  const out: Tally = {};
  if (!raw || typeof raw !== 'object') return out;
  for (const [key, value] of Object.entries(raw as Record<string, unknown>)) {
    const stat = value as Partial<QuestionStat> | null;
    const total = Math.max(0, Math.trunc(Number(stat?.total)) || 0);
    const correct = Math.min(total, Math.max(0, Math.trunc(Number(stat?.correct)) || 0));
    out[key] = { correct, total };
  }
  return out;
}

export async function loadTally(): Promise<Tally> {
  return normalize(await readJson<unknown>(TALLY_KEY, true, {}));
}

export function statOf(tally: Tally, id: string): QuestionStat {
  return tally[id] ?? EMPTY_STAT;
}

async function loadCounted(): Promise<string[]> {
  const raw = await readJson<unknown>(COUNTED_KEY, false, []);
  return Array.isArray(raw) ? raw.filter((v): v is string => typeof v === 'string') : [];
}

/**
 * 한 문항의 답을 반 집계에 넣는다. 한 기기는 문항마다 한 번만 세어,
 * 화면의 '○명'이 실제로 '답한 사람 수'가 되게 한다.
 * 이미 센 문항이면 집계를 건드리지 않고 지금 값만 돌려준다.
 */
export async function recordAnswer(id: string, correct: boolean): Promise<QuestionStat> {
  const counted = await loadCounted();
  const tally = await loadTally();

  if (counted.includes(id)) return statOf(tally, id);

  const before = statOf(tally, id);
  const after: QuestionStat = {
    correct: before.correct + (correct ? 1 : 0),
    total: before.total + 1,
  };

  // 다른 기기의 기록을 덮어쓰지 않도록 방금 읽은 집계 위에서만 고친다.
  await writeJson(TALLY_KEY, true, { ...tally, [id]: after });
  await writeJson(COUNTED_KEY, false, [...counted, id]);
  return after;
}
