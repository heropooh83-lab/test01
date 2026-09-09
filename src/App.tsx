import React, { useState, useMemo, useRef } from 'react';
import { SCENARIOS } from './data/scenarios';
import { evaluateSimulation } from './utils/evaluator';
import { Header } from './components/Header';
import { ScenarioSelector } from './components/ScenarioSelector';
import { CriteriaEditor } from './components/CriteriaEditor';
import { EvaluationResultView } from './components/EvaluationResultView';
import { VirtualComparison } from './components/VirtualComparison';
import { DiscussionReflection } from './components/DiscussionReflection';
import { ClassroomGuideModal } from './components/ClassroomGuideModal';

export default function App() {
  const [scenarioKey, setScenarioKey] = useState<'hire' | 'med' | 'scholarship'>('hire');
  const scenario = SCENARIOS[scenarioKey];

  // Weights (0~10)
  const [values, setValues] = useState<Record<string, number>>(() => {
    const init: Record<string, number> = {};
    scenario.criteria.forEach((c) => {
      init[c.id] = 5;
    });
    return init;
  });

  // Transparency switches (true = 공개, false = 비공개)
  const [opens, setOpens] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {};
    scenario.criteria.forEach((c) => {
      init[c.id] = true;
    });
    return init;
  });

  // Whether user ran evaluation
  const [hasEvaluated, setHasEvaluated] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const resultRef = useRef<HTMLDivElement>(null);

  // Switch Scenario
  const handleSelectScenario = (newKey: 'hire' | 'med' | 'scholarship') => {
    setScenarioKey(newKey);
    const newScenario = SCENARIOS[newKey];
    const newValues: Record<string, number> = {};
    const newOpens: Record<string, boolean> = {};

    newScenario.criteria.forEach((c) => {
      newValues[c.id] = 5;
      newOpens[c.id] = true;
    });

    setValues(newValues);
    setOpens(newOpens);
    setHasEvaluated(false);
  };

  // Change weight
  const handleChangeValue = (id: string, val: number) => {
    setValues((prev) => ({ ...prev, [id]: val }));
  };

  // Toggle open / hidden
  const handleToggleOpen = (id: string) => {
    setOpens((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Apply Presets
  const handleApplyPreset = (preset: 'fair' | 'bias_hidden' | 'balanced' | 'reset') => {
    const newValues: Record<string, number> = {};
    const newOpens: Record<string, boolean> = {};

    scenario.criteria.forEach((c) => {
      if (preset === 'fair') {
        newValues[c.id] = c.fair ? 9 : 1;
        newOpens[c.id] = true;
      } else if (preset === 'bias_hidden') {
        newValues[c.id] = c.fair ? 3 : 9;
        // Hide unfair criteria to demonstrate secret bias!
        newOpens[c.id] = c.fair;
      } else {
        // balanced / reset
        newValues[c.id] = 5;
        newOpens[c.id] = true;
      }
    });

    setValues(newValues);
    setOpens(newOpens);
    setHasEvaluated(true);

    setTimeout(() => {
      resultRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  // Run Simulation
  const handleRunSimulation = () => {
    setHasEvaluated(true);
    setTimeout(() => {
      resultRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 150);
  };

  // Calculate evaluation result
  const evaluationResult = useMemo(() => {
    return evaluateSimulation(scenario, values, opens);
  }, [scenario, values, opens]);

  return (
    <div
      className={`min-h-screen transition-all ${
        isFullscreen ? 'bg-slate-100 p-3 sm:p-4' : 'bg-gradient-to-b from-indigo-50/70 via-slate-50 to-slate-100 p-4 sm:p-8'
      }`}
    >
      <div className={`mx-auto ${isFullscreen ? 'max-w-6xl' : 'max-w-4xl'}`}>
        {/* Header */}
        <Header
          onOpenGuide={() => setIsGuideOpen(true)}
          isFullscreen={isFullscreen}
          onToggleFullscreen={() => setIsFullscreen((prev) => !prev)}
        />

        {/* STEP 1: 상황 고르기 */}
        <ScenarioSelector
          currentScenario={scenario}
          onSelectScenario={handleSelectScenario}
          onApplyPreset={handleApplyPreset}
        />

        {/* STEP 2: 기준 세우기 & 공개 정하기 */}
        <CriteriaEditor
          scenario={scenario}
          values={values}
          opens={opens}
          onChangeValue={handleChangeValue}
          onToggleOpen={handleToggleOpen}
          onRunSimulation={handleRunSimulation}
        />

        {/* Results Container (STEP 3 & 4) */}
        {hasEvaluated && (
          <div ref={resultRef} className="space-y-6 animate-fade-in">
            {/* STEP 3: 공정성 & 투명성 평가 */}
            <EvaluationResultView
              scenario={scenario}
              result={evaluationResult}
            />

            {/* 실제 가상 사례 시뮬레이션 */}
            <VirtualComparison
              scenario={scenario}
              result={evaluationResult}
              values={values}
            />

            {/* STEP 4: 토의 및 윤리적 성찰 */}
            <DiscussionReflection
              scenario={scenario}
              result={evaluationResult}
              values={values}
              opens={opens}
            />
          </div>
        )}

        {/* Footer */}
        <footer className="text-center py-8 text-xs text-slate-500 border-t border-slate-200/80 mt-12">
          <p className="font-medium text-slate-600">
            연구학교 공개수업 · AI 윤리(투명성 & 공정성) 핵심 탐구 활동용 시뮬레이터
          </p>
          <p className="mt-1 text-slate-400">
            AI의 판단 기준을 사람이 어떻게 설정하느냐에 따라 공정성과 인간 사회의 신뢰가 결정됩니다.
          </p>
        </footer>
      </div>

      {/* AI Ethics Guide Modal */}
      <ClassroomGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />
    </div>
  );
}
