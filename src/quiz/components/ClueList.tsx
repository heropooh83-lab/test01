import React from 'react';
import type { Clue } from '../types';

interface ClueListProps {
  clues: Clue[];
  /** 답을 고른 뒤 true. 결정적 단서에 노란 형광펜이 켜진다. */
  revealed: boolean;
}

export const ClueList: React.FC<ClueListProps> = ({ clues, revealed }) => (
  <div className="mb-4 rounded-[14px] border border-line bg-inset px-3.5 py-3">
    <h4 className="mb-2 text-[0.78rem] font-bold tracking-[0.06em] text-cyan uppercase">
      🔍 관찰된 단서
    </h4>
    <ul className="flex list-none flex-col gap-2">
      {clues.map((clue) => {
        const lit = revealed && clue.flag;
        return (
          <li key={clue.text} className="flex items-start gap-2.5 text-[0.92rem] leading-snug text-body">
            <span
              className={`mt-px grid size-[18px] flex-none place-items-center rounded-full border text-[0.7rem] transition-colors ${
                lit
                  ? 'border-amber bg-amber text-[#3a2c00]'
                  : clue.flag
                    ? 'border-amber bg-amber/20'
                    : 'border-line bg-card-2'
              }`}
            >
              {clue.flag ? '!' : '·'}
            </span>
            <span
              className={`rounded px-0.5 transition-colors ${
                lit ? 'bg-amber font-extrabold text-[#3a2c00]' : ''
              }`}
            >
              {clue.text}
            </span>
          </li>
        );
      })}
    </ul>
  </div>
);
