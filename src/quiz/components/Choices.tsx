import React from 'react';
import { DEFAULT_CHOICES } from '../data/questions';
import type { Question } from '../types';

interface ChoicesProps {
  question: Question;
  /** 아직 안 골랐으면 null. */
  picked: boolean | null;
  onPick: (isReal: boolean) => void;
}

/**
 * 두 갈래 선택지. 답을 고르면 정답 쪽은 초록, 잘못 고른 쪽은 빨강으로 굳는다.
 * 라벨은 문항이 정해 준다 — '진짜/딥페이크'로 물을 수 없는 문항이 둘 있기 때문이다.
 */
export const Choices: React.FC<ChoicesProps> = ({ question, picked, onPick }) => {
  const labels = question.choices ?? DEFAULT_CHOICES;
  const answered = picked !== null;

  return (
    <div className="flex gap-3">
      {([true, false] as const).map((isReal) => {
        const face = isReal ? labels.real : labels.fake;
        const isAnswer = isReal === question.answerIsReal;
        const wrongPick = answered && picked === isReal && !isAnswer;
        const state = answered
          ? isAnswer
            ? 'border-real bg-real/15'
            : wrongPick
              ? 'border-fake bg-fake/15'
              : 'border-line bg-inset opacity-60'
          : `border-line bg-inset hover:-translate-y-0.5 ${isReal ? 'hover:border-real' : 'hover:border-fake'}`;

        return (
          <button
            key={face.label}
            type="button"
            disabled={answered}
            onClick={() => onPick(isReal)}
            className={`flex flex-1 cursor-pointer flex-col items-center gap-1.5 rounded-2xl border-2 px-2.5 py-4 text-[1.02rem] font-black text-ink transition disabled:cursor-default ${state}`}
          >
            <span className="text-[1.6rem]">{face.icon}</span>
            {face.label}
          </button>
        );
      })}
    </div>
  );
};
