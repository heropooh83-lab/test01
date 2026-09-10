import React from 'react';
import type { Question } from '../types';
import { Rich } from './Rich';

/** 사건 파일의 머리줄과 본문. 원본의 .filebar / .headline / .situation. */
export const CaseFile: React.FC<{ question: Question }> = ({ question }) => (
  <>
    <div className="mx-[-4px] mt-[-4px] mb-4 flex items-center gap-2.5 rounded-[14px] border border-line bg-deep px-3.5 py-2.5">
      <span className="text-[1.4rem]">{question.kind}</span>
      <span className="flex min-w-0 flex-col gap-0.5">
        <span className="text-[0.95rem] font-extrabold text-ink">{question.source}</span>
        <span className="text-[0.74rem] text-muted">{question.time}</span>
      </span>
      {question.live && (
        <span className="ml-auto flex items-center gap-1.5 rounded-md bg-fake px-2.5 py-1 text-[0.68rem] font-black tracking-[0.08em] text-white">
          <span className="size-[7px] animate-blink rounded-full bg-white" />
          LIVE
        </span>
      )}
    </div>
    <div className="mb-1.5 text-[1.12rem] leading-snug font-black">{question.headline}</div>
    <div className="mb-3.5 text-[0.95rem] leading-relaxed text-body">
      <Rich value={question.situation} />
    </div>
  </>
);
