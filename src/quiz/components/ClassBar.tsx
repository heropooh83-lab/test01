import React from 'react';
import { classNote, percentOf } from '../utils/grade';
import type { QuestionStat } from '../types';

/** 해설 안에 들어가는 '우리 반 정답률' 막대. */
export const ClassBar: React.FC<{ stat: QuestionStat }> = ({ stat }) => {
  const percent = percentOf(stat);
  return (
    <div className="mt-3 rounded-[10px] border border-line bg-inset px-3.5 py-3">
      <div className="mb-1.5 flex justify-between text-[0.8rem] font-bold text-[#c9d2ef]">
        <span>📊 우리 반 정답률</span>
        <span>
          {percent}%{' '}
          <span className="font-semibold text-muted">
            ({stat.correct}/{stat.total}명)
          </span>
        </span>
      </div>
      <div className="h-3.5 overflow-hidden rounded-full bg-deep">
        <div
          className="grad-fill-soft h-full transition-[width] duration-500 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>
      <div className="mt-1.5 text-[0.76rem] text-muted">{classNote(percent)}</div>
    </div>
  );
};
