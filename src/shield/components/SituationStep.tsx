import React from 'react';
import { SITUATIONS } from '../data/situations';
import type { Verdict } from '../types';
import { Button } from './Button';
import { Panel, PanelControls } from './Panel';

interface SituationStepProps {
  judged: Record<string, Verdict>;
  onJudge: (id: string, verdict: Verdict) => void;
  onNext: () => void;
}

/** STEP 1 — 상황 카드마다 허용/금지를 고른다. 정답 채점은 하지 않는다. */
export const SituationStep: React.FC<SituationStepProps> = ({ judged, onJudge, onNext }) => (
  <Panel
    stepTag="STEP 1"
    title="상황 카드로 마음 정하기"
    lead={
      <>
        각 상황이 <b>허용해도 될 일</b>인지 <b>금지해야 할 일</b>인지 모둠이 의논해 골라 보세요. 여기서 정한 마음이
        다음 단계의 규칙으로 이어집니다.
      </>
    }
  >
    <div>
      {SITUATIONS.map((s) => {
        const verdict = judged[s.id];
        return (
          <div
            key={s.id}
            className={`mb-3 flex flex-wrap items-center gap-3.5 rounded-md border border-line border-l-4 bg-[#fffdf6] px-4 py-4 transition hover:shadow-[0_6px_18px_rgba(36,50,104,.1)] ${
              verdict === 'allow'
                ? 'border-l-guard'
                : verdict === 'deny'
                  ? 'border-l-danger'
                  : 'border-l-line'
            }`}
          >
            <span className="grid size-[46px] flex-none place-items-center rounded-[10px] border border-line bg-[#f3ecd6] text-[1.6rem] leading-none">
              {s.emoji}
            </span>
            <div className="min-w-0 flex-1 basis-60">
              <div className="text-[1.02rem] font-extrabold text-navy-3">{s.title}</div>
              <div className="text-[0.86rem] leading-snug text-[#6b5f42]">{s.description}</div>
            </div>
            <div className="no-print flex flex-none gap-2">
              <button
                id={`judge-${s.id}-allow`}
                type="button"
                aria-pressed={verdict === 'allow'}
                onClick={() => onJudge(s.id, 'allow')}
                className={`flex cursor-pointer items-center gap-1.5 rounded-[9px] border-[1.5px] px-4 py-2 text-[0.85rem] font-extrabold transition hover:-translate-y-px ${
                  verdict === 'allow'
                    ? 'border-guard bg-guard text-white shadow-[0_4px_12px_rgba(47,143,91,.34)]'
                    : 'border-line-cool bg-white text-[#7a839f] hover:border-guard hover:text-guard-d'
                }`}
              >
                ✔ 허용
              </button>
              <button
                id={`judge-${s.id}-deny`}
                type="button"
                aria-pressed={verdict === 'deny'}
                onClick={() => onJudge(s.id, 'deny')}
                className={`flex cursor-pointer items-center gap-1.5 rounded-[9px] border-[1.5px] px-4 py-2 text-[0.85rem] font-extrabold transition hover:-translate-y-px ${
                  verdict === 'deny'
                    ? 'border-danger bg-danger text-white shadow-[0_4px_12px_rgba(194,80,106,.34)]'
                    : 'border-line-cool bg-white text-[#7a839f] hover:border-danger hover:text-danger-d'
                }`}
              >
                ✘ 금지
              </button>
            </div>
          </div>
        );
      })}
    </div>

    <PanelControls>
      <span />
      <Button id="to-step-2" onClick={onNext}>
        규칙 정하러 가기 →
      </Button>
    </PanelControls>
  </Panel>
);
