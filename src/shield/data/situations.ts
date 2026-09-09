import type { Situation } from '../types';

/** STEP 1 상황 카드 6종. 좋은 쓰임 3개와 나쁜 쓰임 3개가 번갈아 배치된다. */
export const SITUATIONS: Situation[] = [
  {
    id: 's1',
    emoji: '🎮',
    title: '게임 캐릭터에 내 얼굴 넣기',
    description: '내가 만든 게임 캐릭터에 내 얼굴을 합성해 재미있게 꾸미기',
  },
  {
    id: 's2',
    emoji: '👵',
    title: '어르신께 사용법 알려 주는 AI 안내원',
    description: '디지털이 낯선 어르신을 돕는 친절한 AI 안내 영상 만들기',
  },
  {
    id: 's3',
    emoji: '🤬',
    title: '싫어하는 사람 얼굴로 욕하는 영상',
    description: '미운 사람 얼굴을 합성해 나쁜 말을 하는 것처럼 만들어 퍼뜨리기',
  },
  {
    id: 's4',
    emoji: '📖',
    title: '동화 속 주인공을 움직이게 만들기',
    description: '그림책 캐릭터에 목소리·표정을 입혀 살아 움직이는 동화 만들기',
  },
  {
    id: 's5',
    emoji: '💳',
    title: '선생님 얼굴로 가짜 공지 보내기',
    description: '선생님 얼굴·목소리를 흉내 내 ‘돈을 걷는다’는 가짜 공지 보내기',
  },
  {
    id: 's6',
    emoji: '🌐',
    title: '내 SNS 사진을 허락 없이 가져가 합성',
    description: '누군가 내 SNS 사진을 몰래 가져가 다른 영상에 합성해 올리기',
  },
];
