import React from 'react';
import { Scenario } from '../types';
import { SCENARIOS } from '../data/scenarios';
import { Briefcase, HeartPulse, GraduationCap, Zap } from 'lucide-react';

interface ScenarioSelectorProps {
  currentScenario: Scenario;
  onSelectScenario: (scenarioKey: 'hire' | 'med' | 'scholarship') => void;
  onApplyPreset: (preset: 'fair' | 'bias_hidden' | 'balanced' | 'reset') => void;
}

export const ScenarioSelector: React.FC<ScenarioSelectorProps> = ({
  currentScenario,
  onSelectScenario,
  onApplyPreset,
}) => {
  const scenarioIcons = {
    hire: <Briefcase className="w-4 h-4" />,
    med: <HeartPulse className="w-4 h-4" />,
    scholarship: <GraduationCap className="w-4 h-4" />
  };

  return (
    <div className="bg-white rounded-2xl p-6 sm:p-7 shadow-sm border border-slate-200/80 mb-6">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
            STEP 1 · 상황 선택
          </span>
          <h2 className="text-lg font-bold text-slate-900">어떤 상황에서 AI가 판단할까요?</h2>
        </div>

        {/* Quick Presets for pedagogical demonstration */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs text-slate-500 font-medium mr-1 flex items-center gap-1">
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            빠른 실험:
          </span>
          <button
            onClick={() => onApplyPreset('fair')}
            className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition cursor-pointer"
            title="정당한 기준만 높이고 모두 공개하는 모범 상태"
          >
            🌱 완전 공정·투명
          </button>
          <button
            onClick={() => onApplyPreset('bias_hidden')}
            className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 transition cursor-pointer"
            title="차별 기준을 높게 반영하고 비공개로 감춘 상태"
          >
            🕵️ 차별 기준 은폐
          </button>
          <button
            onClick={() => onApplyPreset('balanced')}
            className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200 transition cursor-pointer"
            title="모든 기준을 5점으로 균등 배치"
          >
            ⚖️ 균등(5점)
          </button>
        </div>
      </div>

      {/* Scenario Selection Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {(Object.keys(SCENARIOS) as Array<keyof typeof SCENARIOS>).map((key) => {
          const s = SCENARIOS[key];
          const isActive = currentScenario.id === s.id;
          return (
            <button
              key={s.id}
              id={`scenario-tab-${s.id}`}
              onClick={() => onSelectScenario(s.id as 'hire' | 'med' | 'scholarship')}
              className={`flex flex-col text-left p-4 rounded-xl border-2 transition-all cursor-pointer relative ${
                isActive
                  ? 'border-indigo-600 bg-indigo-50/70 shadow-sm'
                  : 'border-slate-200 hover:border-indigo-200 hover:bg-slate-50/70 bg-white'
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <span
                  className={`p-2 rounded-lg ${
                    isActive ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {scenarioIcons[s.id as keyof typeof scenarioIcons]}
                </span>
                <span
                  className={`text-sm font-bold ${
                    isActive ? 'text-indigo-900' : 'text-slate-800'
                  }`}
                >
                  {s.badge}
                </span>
              </div>
              <h3 className="font-semibold text-slate-900 text-sm mb-1">{s.title}</h3>
              <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                {s.subtitle}
              </p>
            </button>
          );
        })}
      </div>

      {/* Scenario Context Card */}
      <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-200/90 text-slate-700 text-sm leading-relaxed">
        <p className="mb-2.5">{currentScenario.desc}</p>
        <div className="bg-indigo-50/80 border-l-4 border-indigo-500 p-3 rounded-r-lg text-indigo-950 text-xs sm:text-sm font-medium">
          <span className="font-bold text-indigo-700 mr-1.5">🤔 윤리적 쟁점:</span>
          {currentScenario.ethicalDilemma}
        </div>
      </div>
    </div>
  );
};
