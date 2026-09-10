import React from 'react';
import type { Tally, VoteChoice } from '../types';
import type { Backend } from '../../shared/storage';
import { describeBackend, viewTally } from '../utils/voteText';
import { Button, PillButton } from './Button';
import { Panel, PanelControls } from './Panel';

interface VoteStepProps {
  tally: Tally;
  myVote: VoteChoice | null;
  shareOn: boolean;
  backend: Backend;
  status: string;
  onVote: (choice: VoteChoice) => void;
  onToggleShare: () => void;
  onResetVote: () => void;
  onPrev: () => void;
}

const OPTIONS: { key: VoteChoice; title: string; desc: string; accent: string }[] = [
  {
    key: 'dev',
    title: '🚀 발전시키자',
    desc: '좋은 쓰임이 많으니 기술을 더 키우고, 나쁜 사용만 막자.',
    accent: 'text-guard-d',
  },
  {
    key: 'reg',
    title: '🚧 규제하자',
    desc: '피해가 크니 강한 규칙과 법으로 먼저 단단히 막자.',
    accent: 'text-danger-d',
  },
];

/** STEP 4 — 모둠당 한 표. 다시 누르면 취소되고, 반대쪽을 누르면 표가 옮겨 간다. */
export const VoteStep: React.FC<VoteStepProps> = ({
  tally,
  myVote,
  shareOn,
  backend,
  status,
  onVote,
  onToggleShare,
  onResetVote,
  onPrev,
}) => {
  const { total, devPercent, regPercent, comment } = viewTally(tally);

  return (
    <Panel
      stepTag="STEP 4"
      title="딥페이크, 발전 vs 규제?"
      lead="딥페이크 기술을 앞으로 어떻게 해야 할까요? 우리 모둠의 한 표를 던져 보세요."
    >
      <div className="no-print my-4 flex flex-wrap gap-3">
        {OPTIONS.map((o) => (
          <button
            key={o.key}
            id={`vote-${o.key}`}
            type="button"
            aria-pressed={myVote === o.key}
            onClick={() => onVote(o.key)}
            className={`flex-1 basis-52 cursor-pointer rounded-[10px] border-[1.5px] bg-[#fffdf6] p-4.5 text-left transition hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(36,50,104,.12)] ${
              myVote === o.key ? 'border-gold-2 bg-white ring-[3px] ring-gold-2/30' : 'border-line'
            }`}
          >
            <div className={`text-[1.06rem] font-black ${o.accent}`}>{o.title}</div>
            <div className="mt-1.5 text-[0.85rem] leading-snug text-[#6b5f42]">{o.desc}</div>
          </button>
        ))}
      </div>

      <div className="mt-2.5">
        {[
          { label: '🚀 발전', percent: devPercent, count: tally.dev, bar: 'from-[#3fae72] to-guard-d', text: 'text-guard-d' },
          { label: '🚧 규제', percent: regPercent, count: tally.reg, bar: 'from-[#d76a82] to-danger-d', text: 'text-danger-d' },
        ].map((row) => {
          // 막대가 짧으면 안쪽 글씨가 잘리므로 표 수를 막대 밖으로 내보낸다.
          const inside = total > 0 && row.percent >= 18;
          return (
            <div key={row.label} className="mb-2.5 flex items-center gap-3">
              <span className={`w-[clamp(84px,22vw,140px)] text-[0.86rem] font-extrabold ${row.text}`}>
                {row.label}
              </span>
              <div className="h-[26px] flex-1 overflow-hidden rounded-full border border-line bg-navy-2/10">
                <div
                  className={`flex h-full items-center justify-end bg-gradient-to-r text-[0.78rem] font-extrabold whitespace-nowrap text-white transition-[width] duration-500 ${inside ? 'px-2.5' : ''} ${row.bar}`}
                  style={{ width: total ? `${row.percent}%` : '0%' }}
                >
                  {inside ? `${row.count}표` : ''}
                </div>
              </div>
              {!inside && (
                <span className={`w-9 text-right text-[0.78rem] font-extrabold ${row.text}`}>{row.count}표</span>
              )}
            </div>
          );
        })}
        <p className="mt-1.5 text-[0.82rem] text-[#5a637a]">
          모두 {total}표 · {comment}
        </p>
      </div>

      <div className="no-print mt-2 flex items-center justify-center gap-2">
        <PillButton id="share-toggle" onClick={onToggleShare}>
          🔗 반 전체와 합치기: {shareOn ? '켜짐' : '꺼짐'}
        </PillButton>
        <PillButton id="reset-vote" onClick={onResetVote}>
          ↺ 우리 투표 취소
        </PillButton>
      </div>

      <p className="no-print mt-2 text-center text-[0.78rem] text-[#8a7a52]">{describeBackend(backend)}</p>
      <p className="mt-3 min-h-[1.1em] text-center text-[0.84rem] font-semibold text-[#6b5f42]">{status}</p>

      <PanelControls>
        <Button variant="ghost" onClick={onPrev}>
          ← 방패로 돌아가기
        </Button>
        <span />
      </PanelControls>
    </Panel>
  );
};
