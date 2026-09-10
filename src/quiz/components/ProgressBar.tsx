import React from 'react';

interface ProgressBarProps {
  current: number;
  total: number;
  /** 0~1. 원본은 '푼 문항 수 / 전체'였고, 여기서는 답을 고르면 그 문항도 채워진다. */
  ratio: number;
  score: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ current, total, ratio, score }) => (
  <div className="my-4 mb-3 flex items-center gap-3">
    <span className="text-[0.82rem] font-extrabold whitespace-nowrap text-muted">
      {current} / {total}
    </span>
    <div
      className="h-2.5 flex-1 overflow-hidden rounded-full border border-line bg-deep"
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={total}
      aria-valuenow={Math.round(ratio * total)}
      aria-label="퀴즈 진행"
    >
      <div
        className="grad-fill h-full transition-[width] duration-400 ease-out"
        style={{ width: `${ratio * 100}%` }}
      />
    </div>
    <span className="text-[0.82rem] font-extrabold whitespace-nowrap text-amber">⭐ {score}점</span>
  </div>
);
