import React from 'react';
import { HINTS } from '../data/hints';
import { SITUATIONS } from '../data/situations';
import type { Verdict } from '../types';
import { Button } from './Button';
import { Panel, PanelControls } from './Panel';

interface RulesStepProps {
  teamName: string;
  rules: string[];
  judged: Record<string, Verdict>;
  onTeamName: (value: string) => void;
  onRule: (index: number, value: string) => void;
  onPrev: () => void;
  onNext: () => void;
}

/**
 * STEP 1에서 고른 판단을 문장으로 돌려준다.
 * 원본은 판단을 `judged` 객체에 담기만 하고 어디에도 쓰지 않아,
 * "여기서 정한 마음이 다음 단계의 규칙으로 이어집니다"라는 안내가 빈말로 남아 있었다.
 */
const JudgedRecap: React.FC<{ judged: Record<string, Verdict> }> = ({ judged }) => {
  const denied = SITUATIONS.filter((s) => judged[s.id] === 'deny');
  const allowed = SITUATIONS.filter((s) => judged[s.id] === 'allow');
  if (!denied.length && !allowed.length) return null;

  return (
    <div className="mb-4 rounded-lg border border-line bg-white/60 px-4 py-3.5 text-[0.86rem] leading-relaxed text-[#5b6480]">
      <b className="text-navy-2">1단계에서 우리 모둠이 정한 마음</b>
      <div className="mt-2.5 flex flex-col gap-2">
        {denied.length > 0 && (
          <p>
            <span className="font-extrabold text-danger-d">✘ 금지</span>로 고른 {denied.length}가지 —{' '}
            {denied.map((s) => s.title).join(' · ')}
            <br />
            <span className="text-[#7a839f]">이 상황들을 막으려면 어떤 문장이 필요할까요?</span>
          </p>
        )}
        {allowed.length > 0 && (
          <p>
            <span className="font-extrabold text-guard-d">✔ 허용</span>으로 고른 {allowed.length}가지 —{' '}
            {allowed.map((s) => s.title).join(' · ')}
            <br />
            <span className="text-[#7a839f]">이 좋은 쓰임까지 막지 않으려면 규칙을 어떻게 써야 할까요?</span>
          </p>
        )}
      </div>
    </div>
  );
};

/** STEP 2 — 모둠 이름과 규칙 5칸. 여기 적힌 문장이 그대로 방패에 새겨진다. */
export const RulesStep: React.FC<RulesStepProps> = ({
  teamName,
  rules,
  judged,
  onTeamName,
  onRule,
  onPrev,
  onNext,
}) => (
  <Panel
    stepTag="STEP 2"
    title="우리 모둠 규칙 새기기"
    lead={
      <>
        딥페이크를 안전하게 쓰기 위한 규칙을 <b>3~5개</b> 적어 보세요. 짧고 분명한 문장이 좋아요.
      </>
    }
  >
    <JudgedRecap judged={judged} />

    <input
      id="team-name"
      className="no-print mb-3.5 w-full rounded-lg border-[1.5px] border-line bg-[#fffdf6] px-4 py-3 text-base font-semibold text-ink transition placeholder:font-medium placeholder:text-[#b3a884] focus:border-gold-2 focus:bg-white focus:ring-[3px] focus:ring-gold-2/20 focus:outline-none"
      placeholder="모둠 이름 (예: 4학년 3반 1모둠)"
      maxLength={24}
      value={teamName}
      onChange={(e) => onTeamName(e.target.value)}
    />

    <div>
      {rules.map((rule, i) => (
        <div key={i} className="mb-2.5 flex items-center gap-3">
          <span className="rule-badge grid size-[34px] flex-none place-items-center rounded-full text-[0.92rem] font-black text-navy-3">
            {i + 1}
          </span>
          <input
            id={`rule-input-${i}`}
            className="flex-1 rounded-lg border-[1.5px] border-line bg-[#fffdf6] px-4 py-3 text-base font-semibold text-ink transition placeholder:font-medium placeholder:text-[#b3a884] focus:border-gold-2 focus:bg-white focus:ring-[3px] focus:ring-gold-2/20 focus:outline-none"
            maxLength={60}
            placeholder={`규칙 ${i + 1}을(를) 적어 보세요`}
            value={rule}
            onChange={(e) => onRule(i, e.target.value)}
          />
        </div>
      ))}
    </div>

    <div className="no-print mt-3.5 rounded-lg border border-dashed border-line-cool bg-navy-1/5 px-4 pt-3.5 pb-4 text-[0.86rem] leading-relaxed text-[#5b6480]">
      <b className="text-navy-2">💡 이렇게 생각을 넓혀 보세요 — 정답은 없어요!</b>
      <ul className="mt-3 flex list-none flex-col gap-2.5">
        {HINTS.map((h) => (
          <li
            key={h.lead}
            className="rounded-r-lg border-l-[3px] border-gold-2 bg-white/50 py-2.5 pr-3 pl-3.5 text-[0.88rem] leading-relaxed text-[#4a5372]"
          >
            {h.emoji} <b className="font-extrabold text-navy-2">{h.lead}</b>
            {h.rest}
          </li>
        ))}
      </ul>
    </div>

    <PanelControls>
      <Button variant="ghost" onClick={onPrev}>
        ← 이전
      </Button>
      <Button id="to-step-3" onClick={onNext}>
        방패 만들기 →
      </Button>
    </PanelControls>
  </Panel>
);
