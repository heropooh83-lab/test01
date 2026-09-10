import React from 'react';
import type { Question, QuestionStat } from '../types';
import { ClassBar } from './ClassBar';
import { Rich } from './Rich';

interface FeedbackProps {
  question: Question;
  correct: boolean;
  reason: string;
  stat: QuestionStat;
  isLast: boolean;
  onNext: () => void;
}

/** 문항이 정답 문장을 따로 주지 않으면 진짜/가짜 축으로 만들어 쓴다. */
function verdictOf(question: Question): string {
  if (question.verdict) return question.verdict;
  return `이건 ${question.answerIsReal ? '진짜' : '딥페이크(가짜)'}예요.`;
}

export const Feedback: React.FC<FeedbackProps> = ({
  question,
  correct,
  reason,
  stat,
  isLast,
  onNext,
}) => {
  const hasFlag = question.clues.some((c) => c.flag);

  return (
    <div
      className="mt-3.5 animate-rise rounded-2xl border-[1.5px] border-line bg-inset p-4"
      aria-live="polite"
    >
      <div className={`mb-1.5 text-[1rem] font-black ${correct ? 'text-real' : 'text-fake'}`}>
        {correct ? '⭕ 정답이에요!' : '❌ 아쉬워요!'} {verdictOf(question)}
      </div>
      <div className="text-[0.92rem] leading-relaxed text-body">
        <Rich value={question.why} />
      </div>
      <div className={`mt-2 text-[0.92rem] font-bold ${hasFlag ? 'text-amber' : 'text-cyan'}`}>
        {hasFlag
          ? '👆 위 단서 중 노란색으로 표시된 것이 결정적 단서예요.'
          : '✅ 이 사건은 이상 신호가 없고 출처도 분명해요.'}
      </div>

      {reason && (
        <div className="mt-2.5 rounded-lg border border-line border-l-[3px] border-l-cyan bg-inset px-3 py-2.5 text-[0.86rem] leading-relaxed text-[#c9d2ef]">
          <b className="text-cyan">내가 적은 근거:</b> {reason}
        </div>
      )}

      <ClassBar stat={stat} />

      <button
        type="button"
        onClick={onNext}
        className="grad-fill mt-3.5 w-full cursor-pointer rounded-[14px] p-4 text-[1rem] font-black text-[#06202a] hover:brightness-105"
      >
        {isLast ? '결과 보기 🎉' : '다음 사건 →'}
      </button>
    </div>
  );
};
