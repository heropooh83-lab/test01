import React from 'react';
import { Scenario, SimulationResult } from '../types';
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Compass,
  Search,
  Eye,
  Users,
} from 'lucide-react';

interface EvaluationResultViewProps {
  scenario: Scenario;
  result: SimulationResult;
}

export const EvaluationResultView: React.FC<EvaluationResultViewProps> = ({
  scenario,
  result,
}) => {
  const getVerdictStyle = () => {
    switch (result.verdict.status) {
      case 'good':
        return {
          bg: 'bg-emerald-50 border-emerald-300 text-emerald-950',
          badge: 'bg-emerald-100 text-emerald-800 border-emerald-300',
          icon: <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
        };
      case 'warn':
        return {
          bg: 'bg-amber-50 border-amber-300 text-amber-950',
          badge: 'bg-amber-100 text-amber-800 border-amber-300',
          icon: <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
        };
      case 'bad':
      default:
        return {
          bg: 'bg-rose-50 border-rose-300 text-rose-950',
          badge: 'bg-rose-100 text-rose-800 border-rose-300',
          icon: <XCircle className="w-6 h-6 text-rose-600 shrink-0 mt-0.5" />
        };
    }
  };

  const verdictStyle = getVerdictStyle();

  return (
    <div id="evaluation-result-card" className="bg-white rounded-2xl p-6 sm:p-7 shadow-sm border border-slate-200/80 mb-6">
      {/* Step Header */}
      <div className="flex items-center gap-2 mb-3">
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
          STEP 3 · 공정성 & 투명성 심층 진단
        </span>
        <h2 className="text-lg font-bold text-slate-900">시뮬레이션 결과 분석</h2>
      </div>

      {/* 종합 판정 Verdict Box */}
      <div
        className={`p-5 rounded-2xl border-2 flex items-start gap-3.5 mb-6 transition-all ${verdictStyle.bg}`}
      >
        {verdictStyle.icon}
        <div>
          <h3 className="text-base sm:text-lg font-bold tracking-tight mb-1">
            {result.verdict.title}
          </h3>
          <p className="text-sm leading-relaxed opacity-90">
            {result.verdict.description}
          </p>
        </div>
      </div>

      {/* 두 집단 유불리 판단 비율 막대 그래프 */}
      <div className="mb-6 p-5 rounded-2xl bg-slate-50 border border-slate-200/90">
        <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-indigo-600" />
            <h3 className="text-sm font-bold text-slate-800">
              두 집단이 AI에게 유리하게 판단받은 비율 비교
            </h3>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full bg-slate-200 text-slate-700 font-semibold font-mono">
            유불리 격차: {result.diff}%p
          </span>
        </div>

        {/* Group 1 Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-xs sm:text-sm font-semibold text-slate-700 mb-1.5">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-600" />
              {scenario.groups[0]}
            </span>
            <span className="font-mono text-indigo-600 font-bold">{result.group1Score}%</span>
          </div>
          <div className="h-6 w-full bg-slate-200 rounded-lg overflow-hidden relative">
            <div
              className="h-full bg-indigo-600 transition-all duration-700 flex items-center justify-end pr-2.5 text-xs text-white font-bold font-mono"
              style={{ width: `${Math.max(result.group1Score, 8)}%` }}
            >
              {result.group1Score}%
            </div>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            {scenario.groupDescriptions[0]}
          </p>
        </div>

        {/* Group 2 Bar */}
        <div>
          <div className="flex justify-between text-xs sm:text-sm font-semibold text-slate-700 mb-1.5">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              {scenario.groups[1]}
            </span>
            <span className="font-mono text-amber-600 font-bold">{result.group2Score}%</span>
          </div>
          <div className="h-6 w-full bg-slate-200 rounded-lg overflow-hidden relative">
            <div
              className="h-full bg-amber-500 transition-all duration-700 flex items-center justify-end pr-2.5 text-xs text-white font-bold font-mono"
              style={{ width: `${Math.max(result.group2Score, 8)}%` }}
            >
              {result.group2Score}%
            </div>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            {scenario.groupDescriptions[1]}
          </p>
        </div>
      </div>

      {/* Grid: 원인 풀이 & 편견 점검 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* 🧭 왜 이런 결과가 나왔을까요? (원인 풀이) */}
        <div className="p-5 rounded-2xl bg-amber-50/50 border border-amber-200/80">
          <div className="flex items-center gap-2 mb-3">
            <Compass className="w-4 h-4 text-amber-700" />
            <h3 className="text-sm font-bold text-amber-900">
              🧭 왜 이런 결과가 나왔을까요? (인과 원인 분석)
            </h3>
          </div>
          <div className="space-y-2.5 text-xs sm:text-sm">
            {result.whyItems.map((item, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-xl border leading-relaxed ${
                  item.type === 'positive'
                    ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
                    : item.type === 'summary'
                    ? 'bg-amber-100/60 border-amber-300 text-amber-950 font-medium'
                    : 'bg-white border-amber-200 text-amber-950'
                }`}
              >
                {item.highlightPill && (
                  <span className="inline-block mr-1.5 px-2 py-0.5 rounded bg-amber-200/70 text-amber-900 font-bold text-xs">
                    {item.highlightPill}
                  </span>
                )}
                {item.text}
              </div>
            ))}
          </div>
        </div>

        {/* 🔍 편견·차별 점검 결과 */}
        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/90">
          <div className="flex items-center gap-2 mb-3">
            <Search className="w-4 h-4 text-indigo-700" />
            <h3 className="text-sm font-bold text-slate-800">
              🔍 편견·차별 지표 세부 점검
            </h3>
          </div>
          <ul className="space-y-2.5 text-xs sm:text-sm">
            {result.fairnessPoints.map((pt, idx) => (
              <li
                key={idx}
                className={`flex items-start gap-2 p-3 rounded-xl border ${
                  pt.isRisk
                    ? 'bg-rose-50/70 border-rose-200 text-rose-900 font-medium'
                    : 'bg-white border-slate-200 text-slate-700'
                }`}
              >
                <span className="shrink-0 mt-0.5">
                  {pt.isRisk ? '🚨' : '🔹'}
                </span>
                <span>{pt.text}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* 💡 투명성 평가 — 이 기준을 공개해도 떳떳한가요? */}
      <div
        className={`p-5 rounded-2xl border ${
          result.transparency.status === 'hidden_risk'
            ? 'bg-rose-50/90 border-rose-300'
            : result.transparency.status === 'partial'
            ? 'bg-sky-50 border-sky-300'
            : 'bg-emerald-50/80 border-emerald-300'
        }`}
      >
        <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-indigo-700" />
            <h3 className="text-sm font-bold text-slate-900">
              💡 투명성(Transparency) 평가 — 이 기준을 공개해도 떳떳한가요?
            </h3>
          </div>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-white/80 font-bold border">
            공개 비율: {result.transparency.openCount}/{result.transparency.totalCount} (
            {result.transparency.openRatio}%)
          </span>
        </div>

        <div className="text-sm sm:text-base font-bold text-slate-900 mb-3">
          {result.transparency.headline}
        </div>

        <ul className="space-y-2 text-xs sm:text-sm">
          {result.transparency.points.map((pt, idx) => (
            <li
              key={idx}
              className={`p-3 rounded-xl border leading-relaxed ${
                pt.isWarning
                  ? 'bg-white/95 border-rose-300 text-rose-900 font-semibold'
                  : 'bg-white/80 border-slate-200 text-slate-800'
              }`}
            >
              {pt.text}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
