import React, { useState } from 'react';
import { Scenario, SimulationResult } from '../types';
import { MessageSquare, Copy, Check, PenTool } from 'lucide-react';

interface DiscussionReflectionProps {
  scenario: Scenario;
  result: SimulationResult;
  values: Record<string, number>;
  opens: Record<string, boolean>;
}

export const DiscussionReflection: React.FC<DiscussionReflectionProps> = ({
  scenario,
  result,
  values,
  opens,
}) => {
  const [reflectionText, setReflectionText] = useState('');
  const [copied, setCopied] = useState(false);

  const handleCopyReport = () => {
    let report = `[AI 윤리 판단 기준 시뮬레이터 — 학생 탐구 보고서]\n`;
    report += `📅 작성 일시: ${new Date().toLocaleDateString('ko-KR')}\n`;
    report += `📌 선택 상황: ${scenario.title} (${scenario.badge})\n\n`;

    report += `[1. 내가 설정한 판단 기준 & 투명성]\n`;
    scenario.criteria.forEach((c) => {
      const v = values[c.id] ?? 5;
      const isOpen = opens[c.id] !== false ? '공개' : '비공개(은폐)';
      const type = c.fair ? '정당한 기준' : '차별 위험 기준';
      report += `- ${c.label}: 가중치 ${v}점 | ${isOpen} (${type})\n`;
    });

    report += `\n[2. AI 판단 공정성 & 투명성 진단]\n`;
    report += `- 종합 판정: ${result.verdict.title} — ${result.verdict.description}\n`;
    report += `- 정당한 기준 비율: ${result.fairRatio}% | 차별 위험 비율: ${result.unfairRatio}%\n`;
    report += `- 두 집단 간 유불리 격차: ${result.diff}%p (${scenario.groups[0]}: ${result.group1Score}% vs ${scenario.groups[1]}: ${result.group2Score}%)\n`;
    report += `- 투명성 진단: ${result.transparency.headline}\n`;

    if (reflectionText.trim()) {
      report += `\n[3. 나의 AI 윤리 성찰 및 토의 답변]\n${reflectionText.trim()}\n`;
    }

    navigator.clipboard.writeText(report).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  return (
    <div className="bg-white rounded-2xl p-6 sm:p-7 shadow-sm border border-slate-200/80 mb-6">
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
          STEP 4 · 토의 및 윤리적 성찰
        </span>
        <h2 className="text-lg font-bold text-slate-900">함께 토의하고 생각을 정리해 봅시다</h2>
      </div>

      {/* Discussion Questions Box */}
      <div className="p-5 rounded-2xl bg-indigo-50/70 border-l-4 border-indigo-600 mb-5">
        <div className="flex items-center gap-2 mb-3 text-indigo-950 font-bold text-sm sm:text-base">
          <MessageSquare className="w-4 h-4 text-indigo-700" />
          <span>💬 모둠 토의 핵심 질문:</span>
        </div>
        <ol className="space-y-2.5 list-decimal list-inside text-xs sm:text-sm text-indigo-950 leading-relaxed font-medium">
          {scenario.discussionQuestions.map((q, idx) => (
            <li key={idx} className="pl-1">
              <span>{q}</span>
            </li>
          ))}
        </ol>
      </div>

      {/* Student Reflection Input */}
      <div className="mb-5">
        <label
          htmlFor="reflection-input"
          className="block text-xs sm:text-sm font-bold text-slate-800 mb-2 flex items-center gap-1.5"
        >
          <PenTool className="w-3.5 h-3.5 text-indigo-600" />
          <span>나의 AI 윤리 성찰 기록 (수업 과제 및 느낀 점):</span>
        </label>
        <textarea
          id="reflection-input"
          rows={4}
          value={reflectionText}
          onChange={(e) => setReflectionText(e.target.value)}
          placeholder="예: 실무 능력보다 학벌이나 지역을 높게 설정했을 때 실력 있는 지원자가 떨어지는 것을 보고 놀랐다. 특히 비공개로 숨겨둔 기준이 있다면 사람들은 AI를 믿을 수 없을 것이다..."
          className="w-full p-3.5 rounded-xl border border-slate-300 text-slate-800 text-xs sm:text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 resize-y"
        />
      </div>

      {/* Copy Report Action Button */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-100">
        <p className="text-xs text-slate-500">
          💡 작성한 내용과 시뮬레이션 결과를 복사해 패들렛, 구글 클래스룸 또는 학습지에 붙여넣으세요.
        </p>

        <button
          id="copy-report-btn"
          onClick={handleCopyReport}
          className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
            copied
              ? 'bg-emerald-600 text-white shadow-md'
              : 'bg-slate-900 hover:bg-slate-800 text-white shadow'
          }`}
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-emerald-200" />
              <span>성찰 보고서 복사 완료!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              <span>분석 결과 & 성찰 내용 복사하기</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
