import React from 'react';
import { Scenario, SimulationResult } from '../types';
import { Award, AlertCircle } from 'lucide-react';

interface VirtualComparisonProps {
  scenario: Scenario;
  result: SimulationResult;
  values: Record<string, number>;
}

export const VirtualComparison: React.FC<VirtualComparisonProps> = ({
  scenario,
  result,
  values,
}) => {
  const [p1, p2] = scenario.virtualProfiles;
  const { profile1Total, profile2Total, winnerId, analysisText } = result.virtualCaseComparison;

  return (
    <div className="bg-white rounded-2xl p-6 sm:p-7 shadow-sm border border-slate-200/80 mb-6">
      <div className="flex items-center gap-2 mb-2">
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-purple-50 text-purple-700 border border-purple-100">
          실제 사례 시뮬레이션
        </span>
        <h2 className="text-lg font-bold text-slate-900">
          가상 지원자·환자 2명에게 내 AI를 적용해보면?
        </h2>
      </div>

      <p className="text-sm text-slate-500 mb-5 leading-relaxed">
        내가 설정한 기준과 가중치를 바탕으로 서로 다른 배경을 가진 두 인물의 최종 AI 산출 점수를 계산했습니다.
      </p>

      {/* Two Profiles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
        {/* Profile 1 */}
        <div
          className={`p-5 rounded-2xl border-2 transition-all relative overflow-hidden ${
            winnerId === p1.id
              ? 'border-emerald-500 bg-emerald-50/40 shadow-md'
              : 'border-slate-200 bg-slate-50/50'
          }`}
        >
          {winnerId === p1.id && (
            <div className="absolute top-0 right-0 bg-emerald-600 text-white text-[11px] font-bold px-3 py-1 rounded-bl-xl flex items-center gap-1 shadow-sm">
              <Award className="w-3.5 h-3.5" />
              AI 최종 선정
            </div>
          )}

          <div className="flex items-center gap-3 mb-3">
            <div
              className={`w-11 h-11 rounded-xl bg-gradient-to-tr ${p1.avatarColor} text-white font-extrabold flex items-center justify-center text-base shadow-sm`}
            >
              {p1.name.slice(0, 1)}
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-500">{p1.groupName}</div>
              <h4 className="text-base font-bold text-slate-900">{p1.name}</h4>
            </div>
          </div>

          <p className="text-xs text-slate-600 mb-4 bg-white/80 p-2.5 rounded-lg border border-slate-200/70">
            {p1.summary}
          </p>

          {/* Scores Breakdown */}
          <div className="space-y-1.5 mb-4 text-xs">
            {scenario.criteria.map((c) => {
              const rawScore = p1.scores[c.id] ?? 0;
              const weight = values[c.id] ?? 5;
              return (
                <div key={c.id} className="flex justify-between items-center text-slate-600">
                  <span className="truncate pr-2">{c.label.split('(')[0]}</span>
                  <div className="flex items-center gap-1 shrink-0 font-mono">
                    <span className="text-slate-500">{rawScore}점</span>
                    <span className="text-slate-300">×</span>
                    <span className="text-indigo-600 font-semibold">{weight}w</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600">AI 최종 종합 환산 점수</span>
            <span
              className={`text-xl font-extrabold font-mono ${
                winnerId === p1.id ? 'text-emerald-700' : 'text-slate-700'
              }`}
            >
              {profile1Total}점
            </span>
          </div>
        </div>

        {/* Profile 2 */}
        <div
          className={`p-5 rounded-2xl border-2 transition-all relative overflow-hidden ${
            winnerId === p2.id
              ? 'border-indigo-500 bg-indigo-50/40 shadow-md'
              : 'border-slate-200 bg-slate-50/50'
          }`}
        >
          {winnerId === p2.id && (
            <div className="absolute top-0 right-0 bg-indigo-600 text-white text-[11px] font-bold px-3 py-1 rounded-bl-xl flex items-center gap-1 shadow-sm">
              <Award className="w-3.5 h-3.5" />
              AI 최종 선정
            </div>
          )}

          <div className="flex items-center gap-3 mb-3">
            <div
              className={`w-11 h-11 rounded-xl bg-gradient-to-tr ${p2.avatarColor} text-white font-extrabold flex items-center justify-center text-base shadow-sm`}
            >
              {p2.name.slice(0, 1)}
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-500">{p2.groupName}</div>
              <h4 className="text-base font-bold text-slate-900">{p2.name}</h4>
            </div>
          </div>

          <p className="text-xs text-slate-600 mb-4 bg-white/80 p-2.5 rounded-lg border border-slate-200/70">
            {p2.summary}
          </p>

          {/* Scores Breakdown */}
          <div className="space-y-1.5 mb-4 text-xs">
            {scenario.criteria.map((c) => {
              const rawScore = p2.scores[c.id] ?? 0;
              const weight = values[c.id] ?? 5;
              return (
                <div key={c.id} className="flex justify-between items-center text-slate-600">
                  <span className="truncate pr-2">{c.label.split('(')[0]}</span>
                  <div className="flex items-center gap-1 shrink-0 font-mono">
                    <span className="text-slate-500">{rawScore}점</span>
                    <span className="text-slate-300">×</span>
                    <span className="text-indigo-600 font-semibold">{weight}w</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600">AI 최종 종합 환산 점수</span>
            <span
              className={`text-xl font-extrabold font-mono ${
                winnerId === p2.id ? 'text-indigo-700' : 'text-slate-700'
              }`}
            >
              {profile2Total}점
            </span>
          </div>
        </div>
      </div>

      {/* Analysis Callout */}
      <div className="p-4 rounded-xl bg-purple-50/90 border border-purple-200 text-purple-950 text-xs sm:text-sm flex items-start gap-2.5 leading-relaxed">
        <AlertCircle className="w-5 h-5 text-purple-700 shrink-0 mt-0.5" />
        <div>
          <strong className="font-bold text-purple-900 block mb-0.5">
            💡 가상 사례 진단 결과:
          </strong>
          {analysisText}
        </div>
      </div>
    </div>
  );
};
