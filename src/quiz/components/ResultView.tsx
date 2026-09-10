import React from 'react';
import type { Backend } from '../../shared/storage';
import type { AnswerRecord, Question, RichText, Tally } from '../types';
import { describeBackend, gradeFor, percentOf } from '../utils/grade';
import { statOf } from '../utils/quizStore';
import { Rich } from './Rich';

interface ResultViewProps {
  questions: Question[];
  score: number;
  max: number;
  tally: Tally;
  records: Record<string, AnswerRecord>;
  backend: Backend;
  onRefresh: () => void;
  onRetry: () => void;
}

/** 마무리 정리 5줄. 문항 해설과 같은 조각 형식이라 강조가 데이터에 남는다. */
const TIPS: RichText[] = [
  ['얼굴 경계선에 이상한 ', { em: '이음매' }, '·번짐이 없는지 본다.'],
  ['눈 ', { em: '깜빡임' }, ', 입과 소리가 자연스럽게 맞는지 살핀다.'],
  [{ em: '그림자와 빛의 방향' }, '이 얼굴과 맞는지 확인한다.'],
  ['손가락·귀·치아 같은 ', { em: '디테일' }, '이 이상하지 않은지 본다.'],
  ['무엇보다, ', { em: '어디서 온 자료인지 출처' }, '를 꼭 확인한다.'],
];

/** 긴 제목은 줄여 쓴다. 코드 포인트 단위로 잘라 이모지가 반 토막 나지 않게 한다. */
function shorten(text: string, limit = 26): string {
  const chars = Array.from(text);
  return chars.length > limit ? `${chars.slice(0, limit).join('')}…` : text;
}

export const ResultView: React.FC<ResultViewProps> = ({
  questions,
  score,
  max,
  tally,
  records,
  backend,
  onRefresh,
  onRetry,
}) => {
  const percent = Math.round((score / max) * 100);
  const grade = gradeFor(percent);
  const rows = questions
    .map((q) => ({ question: q, stat: statOf(tally, q.id) }))
    .filter((row) => row.stat.total > 0);
  const written = questions.filter((q) => records[q.id]?.reason);

  return (
    <div className="px-1 py-1.5 text-center">
      <div className="mb-1 text-[1.3rem] font-black">{grade.title}</div>
      <div className="my-1 mb-2 text-[3rem] leading-none font-black">
        <span className="grad-text">{score}</span> / {max}점
      </div>
      <div className="mb-4 text-[1rem] leading-relaxed text-body">{grade.cheer}</div>

      <section className="mb-4 rounded-2xl border-[1.5px] border-line bg-inset px-4.5 py-4 text-left">
        <h3 className="mb-3 text-[0.95rem] text-cyan">📊 우리 반 문제별 정답률</h3>
        {rows.length === 0 ? (
          <p className="text-[0.84rem] leading-relaxed text-muted">
            아직 모인 답이 없어요. 친구들이 풀고 나면 여기에 문제별 정답률이 쌓입니다.
          </p>
        ) : (
          rows.map(({ question, stat }) => {
            const p = percentOf(stat);
            const low = p < 50;
            return (
              <div key={question.id} className="mb-2.5 flex items-center gap-2.5">
                <span className="min-w-0 flex-1 text-[0.84rem] text-body">
                  {question.kind} {shorten(question.headline)}
                </span>
                <span className="h-3 w-[clamp(90px,34%,180px)] flex-none overflow-hidden rounded-full bg-deep">
                  <span
                    className={`block h-full ${low ? 'grad-fill-low' : 'grad-fill-soft'}`}
                    style={{ width: `${p}%` }}
                  />
                </span>
                <span
                  className={`w-11 flex-none text-right text-[0.8rem] font-extrabold ${low ? 'text-fake' : 'text-lime'}`}
                >
                  {p}%
                </span>
              </div>
            );
          })
        )}
        <p className="mt-1 text-[0.78rem] leading-relaxed text-muted">
          정답률이 낮은 사건일수록 더 감쪽같은 딥페이크예요. 함께 단서를 다시 살펴봐요.
          <br />
          {describeBackend(backend)} 한 사람의 첫 도전만 셉니다.
        </p>
      </section>

      {written.length > 0 && (
        <section className="mb-4 rounded-2xl border-[1.5px] border-line bg-inset px-4.5 py-4 text-left">
          <h3 className="mb-3 text-[0.95rem] text-cyan">✍ 내가 적은 근거 되돌아보기</h3>
          {written.map((q) => {
            const record = records[q.id];
            return (
              <div key={q.id} className="mb-3 border-l-[3px] border-line pl-3 last:mb-0">
                <div className="text-[0.84rem] font-bold text-body">
                  <span className={record.correct ? 'text-real' : 'text-fake'}>
                    {record.correct ? '⭕' : '❌'}
                  </span>{' '}
                  {q.kind} {shorten(q.headline, 30)}
                </div>
                <div className="mt-1 text-[0.84rem] leading-relaxed text-[#c9d2ef]">
                  {record.reason}
                </div>
              </div>
            );
          })}
          <p className="mt-2 text-[0.78rem] leading-relaxed text-muted">
            맞고 틀린 것보다, 어떤 단서를 보고 그렇게 생각했는지가 더 중요해요.
          </p>
        </section>
      )}

      <section className="mb-4 rounded-2xl border-[1.5px] border-line bg-inset px-4.5 py-4 text-left">
        <h3 className="mb-2.5 text-[0.95rem] text-cyan">딥페이크를 알아보는 5가지 단서</h3>
        <ul className="list-none">
          {TIPS.map((tip, i) => (
            <li key={i} className="mb-2 flex gap-2 text-[0.9rem] leading-relaxed text-body">
              <span className="flex-none">🔎</span>
              <span>
                <Rich value={tip} />
              </span>
            </li>
          ))}
        </ul>
      </section>

      <div className="my-2.5 flex flex-wrap justify-center gap-2">
        <button
          type="button"
          onClick={onRefresh}
          className="cursor-pointer rounded-full border border-line bg-inset px-3.5 py-2 text-[0.78rem] font-bold text-muted hover:border-cyan hover:text-ink"
        >
          🔄 반 결과 새로고침
        </button>
        <button
          type="button"
          onClick={onRetry}
          className="cursor-pointer rounded-full border border-line bg-inset px-3.5 py-2 text-[0.78rem] font-bold text-muted hover:border-cyan hover:text-ink"
        >
          ↺ 다시 도전하기
        </button>
      </div>
    </div>
  );
};
