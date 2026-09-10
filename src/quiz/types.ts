/**
 * 원본은 상황·해설 문장을 `<b>`가 섞인 HTML 문자열로 두고 `innerHTML`로 넣었다.
 * 여기서는 문장을 조각으로 나눠 데이터로 두고, React가 그리게 한다.
 * `{ em }`은 원본의 `<b>`, `{ quote }`는 원본의 `<span class="quote">`다.
 */
export type Segment = string | { em: string } | { quote: string };

export type RichText = Segment[];

/** 사건 파일에 함께 나오는 관찰 단서 한 줄. */
export interface Clue {
  text: string;
  /** 판별의 결정적 단서. 답을 고른 뒤 노란색으로 드러난다. */
  flag: boolean;
}

/** 두 선택지 중 하나의 겉모습. 문항마다 묻는 축이 달라 라벨을 갈아 끼울 수 있다. */
export interface ChoiceLabel {
  icon: string;
  label: string;
}

export interface Question {
  /**
   * 집계용 키. 문항을 더하거나 순서를 바꿔도 반 정답률이 어긋나지 않도록
   * 원본의 배열 인덱스 대신 뜻이 있는 문자열을 쓴다.
   */
  id: string;
  /** 사건 파일 머리줄: 종류 이모지 · 출처 · 시각 · 생중계 배지 */
  kind: string;
  source: string;
  time: string;
  live?: boolean;
  headline: string;
  situation: RichText;
  clues: Clue[];
  /** 학생에게 던지는 질문 한 줄. */
  ask: string;
  /** 정답이 왼쪽(진짜·허용) 선택지인지. 원본의 `real` 필드. */
  answerIsReal: boolean;
  /**
   * 선택지 라벨 재정의.
   * 대부분은 진짜/딥페이크지만 '써도 될까?'처럼 축이 다른 문항은 바꿔 단다.
   */
  choices?: { real: ChoiceLabel; fake: ChoiceLabel };
  /** 정답 공개 문장. 없으면 '진짜' / '딥페이크(가짜)'로 자동 생성한다. */
  verdict?: string;
  why: RichText;
}

/** 한 문항의 반 전체 집계. */
export interface QuestionStat {
  correct: number;
  total: number;
}

/** 문항 id -> 집계. */
export type Tally = Record<string, QuestionStat>;

/** 채점이 끝난 한 문항의 기록. 결과 화면의 되돌아보기에 쓴다. */
export interface AnswerRecord {
  pickedReal: boolean;
  correct: boolean;
  reason: string;
}
