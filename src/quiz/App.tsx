import { useCallback, useEffect, useRef, useState } from 'react';
import { backendOf } from '../shared/storage';
import { CaseFile } from './components/CaseFile';
import { Choices } from './components/Choices';
import { ClueList } from './components/ClueList';
import { Feedback } from './components/Feedback';
import { ProgressBar } from './components/ProgressBar';
import { ReasonBox } from './components/ReasonBox';
import { ResultView } from './components/ResultView';
import { POINTS_PER_QUESTION, QUESTIONS } from './data/questions';
import type { AnswerRecord, Tally } from './types';
import { loadTally, recordAnswer, statOf } from './utils/quizStore';

const MAX_SCORE = QUESTIONS.length * POINTS_PER_QUESTION;

/**
 * 상태는 전부 이 파일에 있고, 컴포넌트는 props만 받아 그린다.
 * 저장(반 정답률)은 utils/quizStore.ts가, 문구 계산은 utils/grade.ts의 순수 함수가 맡는다.
 */
export default function App() {
  const [index, setIndex] = useState(0);
  /** 이번 문항에서 고른 쪽. 아직 안 골랐으면 null. */
  const [picked, setPicked] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [reasons, setReasons] = useState<Record<string, string>>({});
  const [records, setRecords] = useState<Record<string, AnswerRecord>>({});
  const [tally, setTally] = useState<Tally>({});
  const [done, setDone] = useState(false);
  const feedbackRef = useRef<HTMLDivElement>(null);

  const question = QUESTIONS[index];
  const answered = picked !== null;
  const backend = backendOf(true);

  const refreshTally = useCallback(async () => {
    setTally(await loadTally());
  }, []);

  useEffect(() => {
    void refreshTally();
  }, [refreshTally]);

  // 답을 고르면 해설이 화면 안으로 들어오게 한다 (원본의 scrollIntoView).
  useEffect(() => {
    if (answered) feedbackRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [answered]);

  const handlePick = async (isReal: boolean) => {
    if (answered) return;
    const correct = isReal === question.answerIsReal;
    setPicked(isReal);
    if (correct) setScore((s) => s + POINTS_PER_QUESTION);
    setRecords((prev) => ({
      ...prev,
      [question.id]: { pickedReal: isReal, correct, reason: (reasons[question.id] ?? '').trim() },
    }));

    // 반 집계는 첫 도전만 센다. 이미 센 문항이면 지금 값이 그대로 돌아온다.
    const stat = await recordAnswer(question.id, correct);
    setTally((prev) => ({ ...prev, [question.id]: stat }));
  };

  const handleNext = () => {
    if (index < QUESTIONS.length - 1) {
      setIndex(index + 1);
      setPicked(null);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    setDone(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRetry = () => {
    setIndex(0);
    setPicked(null);
    setScore(0);
    setReasons({});
    setRecords({});
    setDone(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const answeredCount = done ? QUESTIONS.length : index + (answered ? 1 : 0);

  return (
    <div className="mx-auto max-w-[680px]">
      <header className="mb-4 text-center">
        <span className="mb-3 inline-flex items-center gap-2 rounded-full border-[1.5px] border-line px-3.5 py-1.5 text-[0.72rem] font-extrabold tracking-[0.12em] text-cyan uppercase">
          🕵 AI 명탐정 · 활동 1
        </span>
        <h1 className="text-[clamp(1.6rem,5vw,2.4rem)] leading-none font-black tracking-tight">
          진짜일까, <span className="grad-text">가짜일까?</span>
        </h1>
        <p className="mt-2 text-[clamp(0.88rem,2vw,1rem)] text-muted">
          사건 파일을 읽고 단서를 살펴보세요. 이 상황이 진짜인지 딥페이크인지 판단하면, 결정적
          단서를 짚어 드립니다.
        </p>
      </header>

      <ProgressBar
        current={done ? QUESTIONS.length : index + 1}
        total={QUESTIONS.length}
        ratio={answeredCount / QUESTIONS.length}
        score={score}
      />

      <div className="case-card rounded-[22px] border-[1.5px] border-line p-[clamp(16px,3vw,24px)]">
        {done ? (
          <ResultView
            questions={QUESTIONS}
            score={score}
            max={MAX_SCORE}
            tally={tally}
            records={records}
            backend={backend}
            onRefresh={refreshTally}
            onRetry={handleRetry}
          />
        ) : (
          <>
            <CaseFile question={question} />
            <ClueList clues={question.clues} revealed={answered} />
            <div className="mb-3.5 text-[1.08rem] leading-snug font-extrabold">{question.ask}</div>
            <ReasonBox
              value={reasons[question.id] ?? ''}
              locked={answered}
              onChange={(value) => setReasons((prev) => ({ ...prev, [question.id]: value }))}
            />
            <Choices question={question} picked={picked} onPick={handlePick} />
            <div ref={feedbackRef}>
              {answered && (
                <Feedback
                  question={question}
                  correct={picked === question.answerIsReal}
                  reason={records[question.id]?.reason ?? ''}
                  stat={statOf(tally, question.id)}
                  isLast={index === QUESTIONS.length - 1}
                  onNext={handleNext}
                />
              )}
            </div>
          </>
        )}
      </div>

      <footer className="mx-auto mt-4.5 mb-1.5 text-center text-[0.76rem] leading-relaxed text-muted">
        딥페이크 판별 퀴즈 · ‘딥페이크의 두 얼굴’ 수업용
        <br />
        모든 사건은 판별 <b className="text-body">단서</b>를 배우기 위해 만든 가상의 상황이에요.
        <br />
        <a
          className="mt-2 inline-block text-body underline underline-offset-4 hover:text-cyan"
          href={`${import.meta.env.BASE_URL}shield.html`}
        >
          AI 안전 방패 메이커로 이동 →
        </a>
      </footer>
    </div>
  );
}
