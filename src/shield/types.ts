/** 딥페이크 안전 사용 상황 카드 (STEP 1). */
export interface Situation {
  id: string;
  emoji: string;
  title: string;
  description: string;
}

/** 상황 카드에 대한 모둠의 판단. */
export type Verdict = 'allow' | 'deny';

/** STEP 2 생각 넓히기 힌트. 원본의 <b> 강조를 데이터로 분리한 형태. */
export interface Hint {
  emoji: string;
  lead: string;
  rest: string;
}

/**
 * 방패 도형 한 벌.
 * `css`는 화면용 clip-path, `outer`/`inner`/`frame`은 440x528 SVG용 polygon 좌표다.
 * 둘은 같은 모양을 두 가지 방식으로 표현한 것이므로 항상 함께 수정해야 한다.
 */
export interface ShieldShape {
  key: string;
  name: string;
  crest: string;
  css: string;
  outer: string;
  inner: string;
  frame: string;
  /**
   * 글자를 넣어도 안전한 세로 범위 (방패 높이 대비 비율).
   * 이 아래는 도형이 뾰족하게 좁아져 글자가 잘린다.
   */
  safeRatio: number;
}

/** 갤러리에 등록된 방패 한 장. */
export interface GalleryEntry {
  id: string;
  name: string;
  rules: string[];
  shape: string;
  at: number;
}

export type VoteChoice = 'dev' | 'reg';

export type Tally = Record<VoteChoice, number>;
