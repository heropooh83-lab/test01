import React from 'react';
import { Scenario } from '../types';
import { Info, Eye, EyeOff, ShieldCheck, AlertTriangle } from 'lucide-react';

interface CriteriaEditorProps {
  scenario: Scenario;
  values: Record<string, number>;
  opens: Record<string, boolean>;
  onChangeValue: (criterionId: string, val: number) => void;
  onToggleOpen: (criterionId: string) => void;
  onRunSimulation: () => void;
}

export const CriteriaEditor: React.FC<CriteriaEditorProps> = ({
  scenario,
  values,
  opens,
  onChangeValue,
  onToggleOpen,
  onRunSimulation,
}) => {
  // Compute mini real-time stats
  let fairSum = 0;
  let unfairSum = 0;
  let openCount = 0;

  scenario.criteria.forEach((c) => {
    const v = values[c.id] ?? 5;
    if (c.fair) fairSum += v;
    else unfairSum += v;
    if (opens[c.id] !== false) openCount += 1;
  });

  return (
    <div className="bg-white rounded-2xl p-6 sm:p-7 shadow-sm border border-slate-200/80 mb-6">
      {/* Header */}
      <div className="flex items-center gap-2 mb-2">
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
          STEP 2 · 기준 가중치 & 공개 설정
        </span>
        <h2 className="text-lg font-bold text-slate-900">
          판단 기준의 중요도(0~10)와 공개 여부를 정해 보세요
        </h2>
      </div>

      <p className="text-sm text-slate-500 mb-4">
        슬라이더를 움직여 각 기준을 AI가 얼마나 중요하게 평가할지 정합니다. 오른쪽 스위치로 그 기준을 <strong>모두에게 투명하게 공개할지</strong> 정합니다.
      </p>

      {/* Info Tip */}
      <div className="mb-5 flex items-start gap-3 bg-cyan-50/90 border border-cyan-200/80 rounded-xl p-3.5 text-cyan-900 text-xs sm:text-sm">
        <Info className="w-5 h-5 text-cyan-600 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong className="font-bold text-cyan-950">🔎 투명성(Transparency)이란?</strong>
          <span className="ml-1 text-cyan-800">
            AI가 ‘무엇을 기준으로 결정했는지’를 숨기지 않고 심사 대상자와 대중에게 솔직하게 공개하는 것입니다. 만약 떳떳하게 공개하기 꺼려지는 기준이 있다면, 그 이유를 깊이 고민해 보세요.
          </span>
        </div>
      </div>

      {/* Criteria Header */}
      <div className="hidden md:flex items-center gap-4 px-4 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 mb-2">
        <div className="flex-1">판단 기준 및 세부 내용</div>
        <div className="w-48 text-center">중요도 가중치 (0~10)</div>
        <div className="w-16 text-center">가중치</div>
        <div className="w-28 text-center">대중 공개 여부</div>
      </div>

      {/* Criteria List */}
      <div className="space-y-3">
        {scenario.criteria.map((c) => {
          const val = values[c.id] ?? 5;
          const isOpen = opens[c.id] !== false;

          return (
            <div
              key={c.id}
              className={`flex flex-col md:flex-row md:items-center gap-3 md:gap-4 p-4 rounded-xl border transition-all ${
                c.fair
                  ? 'bg-slate-50/60 border-slate-200/90 hover:border-slate-300'
                  : 'bg-amber-50/25 border-amber-200/60 hover:border-amber-300/80'
              }`}
            >
              {/* Criterion Meta & Label */}
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold ${
                      c.fair
                        ? 'bg-emerald-100/70 text-emerald-800 border border-emerald-200/60'
                        : 'bg-rose-100/70 text-rose-800 border border-rose-200/60'
                    }`}
                  >
                    {c.fair ? (
                      <>
                        <ShieldCheck className="w-3 h-3 text-emerald-600" />
                        정당한 기준
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="w-3 h-3 text-rose-600" />
                        차별 위험 기준
                      </>
                    )}
                  </span>
                  <span className="text-[11px] font-medium text-slate-400">
                    {c.categoryTag}
                  </span>
                </div>
                <h4 className="text-sm sm:text-base font-bold text-slate-900">
                  {c.label}
                </h4>
                <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                  {c.description}
                </p>
              </div>

              {/* Slider & Value Controls */}
              <div className="flex items-center gap-3 w-full md:w-auto">
                <div className="flex-1 md:w-48 flex flex-col justify-center">
                  <input
                    type="range"
                    min="0"
                    max="10"
                    step="1"
                    value={val}
                    id={`slider-${c.id}`}
                    onChange={(e) => onChangeValue(c.id, parseInt(e.target.value, 10))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 px-0.5 mt-1 font-mono">
                    <span>0 (무시)</span>
                    <span>5 (보통)</span>
                    <span>10 (최대)</span>
                  </div>
                </div>

                {/* Numeric Value Chip */}
                <div className="w-14 text-center shrink-0">
                  <span className="inline-block w-full py-1.5 px-2 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-700 font-bold font-mono text-sm">
                    {val}점
                  </span>
                </div>

                {/* Transparency Toggle Switch */}
                <div className="w-28 flex flex-col items-center justify-center shrink-0 pl-2 border-l border-slate-200 md:border-l-0 md:pl-0">
                  <button
                    type="button"
                    role="switch"
                    id={`toggle-open-${c.id}`}
                    aria-checked={isOpen}
                    onClick={() => onToggleOpen(c.id)}
                    className={`relative inline-flex h-7 w-14 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 ${
                      isOpen ? 'bg-emerald-600' : 'bg-slate-300'
                    }`}
                  >
                    <span
                      aria-hidden="true"
                      className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                        isOpen ? 'translate-x-7' : 'translate-x-0'
                      }`}
                    />
                  </button>
                  <span
                    className={`text-[11px] font-bold mt-1 flex items-center gap-0.5 ${
                      isOpen ? 'text-emerald-700' : 'text-slate-500'
                    }`}
                  >
                    {isOpen ? (
                      <>
                        <Eye className="w-3 h-3" />
                        공개
                      </>
                    ) : (
                      <>
                        <EyeOff className="w-3 h-3" />
                        비공개
                      </>
                    )}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Live Balance Summary */}
      <div className="mt-5 p-3.5 rounded-xl bg-slate-100/90 border border-slate-200/90 flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm">
        <div className="flex items-center gap-4 flex-wrap">
          <span className="text-slate-600">
            정당 기준 합계: <strong className="text-emerald-700 font-bold">{fairSum}점</strong>
          </span>
          <span className="text-slate-400">|</span>
          <span className="text-slate-600">
            차별 위험 기준 합계: <strong className={unfairSum > 6 ? 'text-rose-700 font-bold' : 'text-slate-800 font-bold'}>{unfairSum}점</strong>
          </span>
          <span className="text-slate-400">|</span>
          <span className="text-slate-600">
            공개 기준: <strong className="text-indigo-700 font-bold">{openCount}/{scenario.criteria.length}개</strong>
          </span>
        </div>
        <span className="text-xs text-slate-500">
          설정을 마쳤다면 아래 버튼을 눌러 AI의 결정을 분석하세요!
        </span>
      </div>

      {/* Primary Action Button */}
      <button
        id="run-simulation-btn"
        onClick={onRunSimulation}
        className="w-full mt-4 py-4 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold text-base sm:text-lg shadow-lg shadow-indigo-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer group"
      >
        <span className="text-xl group-hover:scale-110 transition-transform">⚖️</span>
        <span>우리 AI로 판단하고 공정성·투명성 종합 평가하기</span>
      </button>
    </div>
  );
};
