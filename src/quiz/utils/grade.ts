import type { Backend } from '../../shared/storage';
import type { QuestionStat } from '../types';

export interface Grade {
  title: string;
  cheer: string;
}

/** 점수 비율(0~100) -> 등급과 응원 문구. 원본의 네 구간을 그대로 옮겼다. */
export function gradeFor(percent: number): Grade {
  if (percent === 100) {
    return {
      title: '🏆 딥페이크 마스터!',
      cheer: '완벽해요! 어떤 가짜도 꿰뚫어 보는 진짜 AI 명탐정이에요.',
    };
  }
  if (percent >= 75) {
    return { title: '🥇 명탐정 등급', cheer: '아주 잘했어요! 단서를 읽는 눈이 날카로워요.' };
  }
  if (percent >= 50) {
    return {
      title: '🥈 수습 탐정',
      cheer: '좋아요! 조금만 더 연습하면 진짜·가짜를 척척 구별할 수 있어요.',
    };
  }
  return {
    title: '🥉 탐정 훈련생',
    cheer: '괜찮아요! 딥페이크는 원래 속기 쉬워요. 그래서 단서를 아는 게 중요해요.',
  };
}

export function percentOf(stat: QuestionStat): number {
  return stat.total ? Math.round((stat.correct / stat.total) * 100) : 0;
}

/**
 * 반 정답률에 붙는 한 줄. 낮은 정답률을 실패가 아니라
 * '그만큼 딥페이크가 감쪽같다'는 뜻으로 읽어 주는 것이 이 수업의 요지다.
 */
export function classNote(percent: number): string {
  if (percent >= 70) return '많은 친구가 정확히 판별했어요!';
  if (percent >= 40) return '의견이 갈렸어요. 단서를 다시 살펴봐요.';
  return '많은 친구가 속았어요. 그만큼 딥페이크가 감쪽같다는 뜻!';
}

/** 정답률이 어디에 저장되는지 그대로 알려 준다. 원본에는 이 안내가 없었다. */
export function describeBackend(backend: Backend): string {
  switch (backend) {
    case 'shared':
      return '같은 링크를 연 다른 기기의 답까지 함께 셉니다.';
    case 'local':
      return '이 기기(브라우저)에만 저장됩니다. 한 화면을 함께 보며 차례로 풀어 보세요.';
    default:
      return '저장소를 쓸 수 없어 탭을 닫으면 사라집니다.';
  }
}
