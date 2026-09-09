import React from 'react';

const STEP_LABELS = ['상황 판단', '규칙 새기기', '방패 완성', '함께 정하기'];

interface StepsNavProps {
  step: number;
  onGo: (step: number) => void;
}

/**
 * 단계 표시줄. 원본과 같이 아무 단계로나 건너뛸 수 있다.
 * 수업 중 교사가 앞 단계로 돌아가 설명하는 일이 잦아 잠그지 않았다.
 */
export const StepsNav: React.FC<StepsNavProps> = ({ step, onGo }) => (
  <nav className="no-print mx-auto mb-5 flex max-w-[720px] gap-0 rounded-full border border-gold-1/20 bg-[#0c122a]/50 p-1.5 backdrop-blur-[4px]">
    {STEP_LABELS.map((label, i) => {
      const active = i === step;
      const done = i < step;
      return (
        <button
          key={label}
          id={`step-nav-${i}`}
          type="button"
          onClick={() => onGo(i)}
          className={`flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-full px-1.5 py-2.5 text-[0.82rem] font-bold transition ${
            active
              ? 'bg-gradient-to-b from-gold-1 to-gold-2 text-navy-3 shadow-[0_4px_14px_rgba(231,181,63,.4)]'
              : done
                ? 'text-gold-1'
                : 'text-[#98a2c8]'
          }`}
        >
          <span
            className={`grid size-6 flex-none place-items-center rounded-full border text-[0.78rem] font-extrabold ${
              active
                ? 'border-transparent bg-navy-3 text-gold-1'
                : done
                  ? 'border-transparent bg-guard text-white'
                  : 'border-white/15 bg-white/8 text-[#98a2c8]'
            }`}
          >
            {i + 1}
          </span>
          <span className="hidden whitespace-nowrap sm:inline">{label}</span>
        </button>
      );
    })}
  </nav>
);
