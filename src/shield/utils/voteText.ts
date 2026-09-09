import type { Backend } from './storage';
import type { Tally } from '../types';

export interface TallyView {
  total: number;
  devPercent: number;
  regPercent: number;
  comment: string;
}

/**
 * 집계를 막대 길이와 한 줄 논평으로 바꾼다.
 * 논평은 이긴 쪽을 편들지 않고 항상 반대편을 한 번 더 묻는다 — 토론을 닫지 않기 위해서다.
 */
export function viewTally(tally: Tally): TallyView {
  const total = tally.dev + tally.reg;
  const devPercent = total ? Math.round((tally.dev / total) * 100) : 0;
  const regPercent = total ? 100 - devPercent : 0;

  const comment =
    total === 0
      ? '아직 표가 없어요'
      : devPercent === regPercent
        ? '팽팽하게 나뉘었어요! 왜 그런지 이야기 나눠 보세요'
        : devPercent > regPercent
          ? '‘발전’ 쪽이 많네요. 그래도 어떤 안전장치가 필요할까요?'
          : '‘규제’ 쪽이 많네요. 그래도 지켜야 할 좋은 쓰임은 무엇일까요?';

  return { total, devPercent, regPercent, comment };
}

/** 표가 실제로 어디에 저장되는지 학생·교사에게 그대로 알려 준다. */
export function describeBackend(backend: Backend): string {
  switch (backend) {
    case 'shared':
      return '같은 링크를 연 다른 기기의 표까지 함께 셉니다.';
    case 'local':
      return '이 기기(브라우저)에만 저장됩니다. 한 화면을 함께 보며 모둠별로 눌러 주세요.';
    default:
      return '저장소를 쓸 수 없어 탭을 닫으면 사라집니다.';
  }
}
