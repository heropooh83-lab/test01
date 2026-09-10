import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { RulesStep } from './components/RulesStep';
import { ShieldStep } from './components/ShieldStep';
import { SituationStep } from './components/SituationStep';
import { StepsNav } from './components/StepsNav';
import { VoteStep } from './components/VoteStep';
import type { GalleryEntry, Tally, Verdict, VoteChoice } from './types';
import {
  EMPTY_TALLY,
  loadGallery,
  loadMyVote,
  loadTally,
  saveGallery,
  saveMyVote,
  saveTally,
} from './utils/classStore';
import { shapeFor } from './utils/shape';
import { downloadShieldPng } from './utils/shieldSvg';
import { backendOf } from '../shared/storage';

const RULE_SLOTS = 5;
const POLL_MS = 4000;
const DEFAULT_TEAM_NAME = '우리 모둠';

/**
 * 상태는 전부 이 파일에 있고, 컴포넌트는 props만 받아 그린다.
 * 저장(갤러리·투표)은 utils/classStore.ts가, 계산(도형·SVG·집계 문구)은 utils의 순수 함수가 맡는다.
 */
export default function App() {
  const [step, setStep] = useState(0);

  // STEP 1
  const [judged, setJudged] = useState<Record<string, Verdict>>({});

  // STEP 2
  const [teamName, setTeamName] = useState('');
  const [rules, setRules] = useState<string[]>(() => Array(RULE_SLOTS).fill(''));

  // STEP 3
  const [gallery, setGallery] = useState<GalleryEntry[]>([]);
  const galleryRef = useRef<HTMLDivElement>(null);

  // STEP 4
  const [shareOn, setShareOn] = useState(true);
  const [tally, setTally] = useState<Tally>(EMPTY_TALLY);
  const [myVote, setMyVote] = useState<VoteChoice | null>(null);
  const [status, setStatus] = useState('');
  const flashTimer = useRef<number | undefined>(undefined);

  const displayName = teamName.trim() || DEFAULT_TEAM_NAME;
  const filledRules = useMemo(() => rules.map((r) => r.trim()).filter(Boolean).slice(0, 5), [rules]);
  const shape = useMemo(() => shapeFor(teamName), [teamName]);
  const backend = backendOf(shareOn);

  const flash = useCallback((message: string) => {
    setStatus(message);
    window.clearTimeout(flashTimer.current);
    flashTimer.current = window.setTimeout(() => setStatus(''), 1600);
  }, []);

  useEffect(() => () => window.clearTimeout(flashTimer.current), []);

  const goStep = (next: number) => {
    setStep(next);
    // 한 단계에서 띄운 안내가 다음 단계까지 따라가지 않도록 지운다.
    window.clearTimeout(flashTimer.current);
    setStatus('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  /* ---------- STEP 1 ---------- */
  const handleJudge = (id: string, verdict: Verdict) => {
    setJudged((prev) => ({ ...prev, [id]: verdict }));
  };

  /* ---------- STEP 2 ---------- */
  const handleRule = (index: number, value: string) => {
    setRules((prev) => prev.map((r, i) => (i === index ? value : r)));
  };

  /* ---------- STEP 3: 갤러리 ---------- */
  const refreshGallery = useCallback(async () => {
    setGallery(await loadGallery(shareOn));
  }, [shareOn]);

  useEffect(() => {
    void refreshGallery();
  }, [refreshGallery]);

  const handleRegister = async () => {
    if (!filledRules.length) {
      window.alert('먼저 2단계에서 규칙을 적어 방패를 완성해 주세요.');
      return;
    }
    const entries = await loadGallery(shareOn);
    const entry: GalleryEntry = {
      id: `g${Date.now()}`,
      name: displayName,
      rules: filledRules,
      shape: shape.key,
      at: Date.now(),
    };

    // 같은 모둠 이름이 이미 있으면 새로 만들지 않고 바꿔 끼운다.
    const i = entries.findIndex((e) => e.name === displayName);
    if (i >= 0) {
      if (!window.confirm(`‘${displayName}’ 방패가 이미 있어요. 새로 바꿔 등록할까요?`)) return;
      entries[i] = entry;
    } else {
      entries.push(entry);
    }

    await saveGallery(shareOn, entries);
    setGallery(entries);
    flash('갤러리에 등록했어요! 아래에서 확인하세요.');
    galleryRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  };

  const handleDeleteEntry = async (id: string) => {
    if (!window.confirm('이 방패를 갤러리에서 지울까요?')) return;
    const entries = (await loadGallery(shareOn)).filter((e) => e.id !== id);
    await saveGallery(shareOn, entries);
    setGallery(entries);
  };

  const handleSavePng = async () => {
    if (!filledRules.length) {
      window.alert('먼저 2단계에서 규칙을 적어 방패를 완성해 주세요.');
      return;
    }
    try {
      await downloadShieldPng(displayName, filledRules, shape);
    } catch {
      window.alert('이미지를 만들지 못했어요. 인쇄 버튼을 이용해 주세요.');
    }
  };

  /* ---------- STEP 4: 투표 ---------- */
  const refreshVote = useCallback(async () => {
    const [t, v] = await Promise.all([loadTally(shareOn), loadMyVote(shareOn)]);
    setTally(t);
    setMyVote(v);
  }, [shareOn]);

  useEffect(() => {
    void refreshVote();
  }, [refreshVote]);

  // 다른 모둠이 던진 표가 화면에 나타나도록 투표 단계에서만 주기적으로 다시 읽는다.
  useEffect(() => {
    if (step !== 3) return;
    const id = window.setInterval(() => {
      void loadTally(shareOn).then(setTally);
    }, POLL_MS);
    return () => window.clearInterval(id);
  }, [step, shareOn]);

  const handleVote = async (choice: VoteChoice) => {
    // 저장된 최신 집계 위에서 고쳐야 다른 모둠의 표를 덮어쓰지 않는다.
    const current = await loadTally(shareOn);
    const next: Tally = { ...current };
    if (myVote && next[myVote] > 0) next[myVote]--;

    const nextVote = myVote === choice ? null : choice;
    if (nextVote) next[nextVote]++;

    await saveTally(shareOn, next);
    await saveMyVote(shareOn, nextVote);
    setTally(next);
    setMyVote(nextVote);
    flash(nextVote ? '우리 모둠의 한 표가 반영됐어요' : '투표를 취소했어요');
  };

  const handleResetVote = async () => {
    if (!myVote) return;
    const current = await loadTally(shareOn);
    const next: Tally = { ...current };
    if (next[myVote] > 0) next[myVote]--;
    await saveTally(shareOn, next);
    await saveMyVote(shareOn, null);
    setTally(next);
    setMyVote(null);
    flash('우리 투표를 취소했어요');
  };

  return (
    <div className="mx-auto max-w-[940px]">
      <header className="relative my-1.5 mb-5 text-center">
        <span className="no-print mb-3.5 inline-flex items-center gap-2.5 text-[0.68rem] font-bold tracking-[0.34em] text-gold-1 before:h-px before:w-[22px] before:bg-gradient-to-r before:from-transparent before:to-gold-2 after:h-px after:w-[22px] after:bg-gradient-to-r after:from-gold-2 after:to-transparent">
          GUARDIAN&nbsp;WORKSHOP · 딥페이크의 두 얼굴
        </span>
        <h1 className="text-[clamp(1.9rem,5.4vw,3rem)] leading-none font-extrabold tracking-tight text-white [text-shadow:0_2px_0_rgba(0,0,0,.18),0_0_34px_rgba(120,150,255,.25)] print-plain">
          AI <span className="gold-text">안전 방패</span> 만들기
        </h1>
        <p className="mx-auto mt-3 max-w-[52ch] text-[clamp(.92rem,2vw,1.05rem)] leading-relaxed text-[#c3ccec] print-plain">
          딥페이크로부터 사람을 지키는 우리 모둠만의 약속을 새겨, 세상에 하나뿐인 방패를 완성하세요.
        </p>
      </header>

      <StepsNav step={step} onGo={goStep} />

      {step === 0 && <SituationStep judged={judged} onJudge={handleJudge} onNext={() => goStep(1)} />}

      {step === 1 && (
        <RulesStep
          teamName={teamName}
          rules={rules}
          judged={judged}
          onTeamName={setTeamName}
          onRule={handleRule}
          onPrev={() => goStep(0)}
          onNext={() => goStep(2)}
        />
      )}

      {step === 2 && (
        <ShieldStep
          name={displayName}
          rules={filledRules}
          shape={shape}
          entries={gallery}
          galleryRef={galleryRef}
          status={status}
          onPrev={() => goStep(1)}
          onNext={() => goStep(3)}
          onSavePng={handleSavePng}
          onPrint={() => window.print()}
          onRegister={handleRegister}
          onDeleteEntry={handleDeleteEntry}
          onRefreshGallery={refreshGallery}
        />
      )}

      {step === 3 && (
        <VoteStep
          tally={tally}
          myVote={myVote}
          shareOn={shareOn}
          backend={backend}
          status={status}
          onVote={handleVote}
          onToggleShare={() => setShareOn((v) => !v)}
          onResetVote={handleResetVote}
          onPrev={() => goStep(2)}
        />
      )}

      <footer className="no-print mx-auto mt-6 mb-2 max-w-[56ch] text-center text-[0.8rem] leading-relaxed text-[#8791b8]">
        딥페이크의 두 얼굴 · AI 안전 방패 메이커
        <br />
        규칙은 <b className="text-[#c3ccec]">사람을 지키기 위한 약속</b>입니다. 좋은 방패는 기술을 막는 것이 아니라,
        사람을 지킵니다.
        <br />
        <span className="mt-2 flex flex-wrap justify-center gap-x-4 gap-y-1">
          <a
            className="text-[#c3ccec] underline underline-offset-4 hover:text-gold-1"
            href={`${import.meta.env.BASE_URL}quiz.html`}
          >
            딥페이크 판별 퀴즈로 이동 →
          </a>
          <a
            className="text-[#c3ccec] underline underline-offset-4 hover:text-gold-1"
            href={import.meta.env.BASE_URL}
          >
            AI 윤리 판단 기준 시뮬레이터로 이동 →
          </a>
        </span>
      </footer>
    </div>
  );
}
