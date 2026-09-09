import React from 'react';
import { X, BookOpen, Eye, Users, Lightbulb } from 'lucide-react';

interface ClassroomGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ClassroomGuideModal: React.FC<ClassroomGuideModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-indigo-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-amber-300" />
            <h3 className="text-base sm:text-lg font-bold">
              AI 윤리 학습 가이드 · 투명성과 공정성
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/20 text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
          {/* Card 1 */}
          <div className="p-4 rounded-xl bg-indigo-50/70 border border-indigo-100">
            <div className="flex items-center gap-2 text-indigo-900 font-bold mb-1.5">
              <Lightbulb className="w-4 h-4 text-indigo-600" />
              <span>왜 ‘정답이 없는 문제’일까요?</span>
            </div>
            <p className="text-slate-600">
              인간 사회의 채용, 의료, 법률, 복지 정책에는 단 하나의 수학적 정답이 존재하지 않습니다. 어떤 가치(효율성, 평등, 형평성, 사회적 약자 배려)를 우선하느냐에 따라 AI의 판단 기준과 결과가 완전히 달라지기 때문입니다.
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-100">
            <div className="flex items-center gap-2 text-emerald-900 font-bold mb-1.5">
              <Users className="w-4 h-4 text-emerald-600" />
              <span>1. 알고리즘 공정성 (Fairness)</span>
            </div>
            <p className="text-slate-600">
              지원자의 성별, 인종, 출신 지역, 가문 배경 등 본인의 노력이나 실질적 역량과 무관한 환경적 요인이 차별을 유발하지 않아야 합니다. 과거의 편향된 데이터를 그대로 학습한 AI는 인간 사회의 불평등을 더욱 증폭시킬 위험이 있습니다.
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-100">
            <div className="flex items-center gap-2 text-amber-900 font-bold mb-1.5">
              <Eye className="w-4 h-4 text-amber-600" />
              <span>2. 투명성 및 설명 가능성 (Transparency & Explainability)</span>
            </div>
            <p className="text-slate-600">
              AI가 ‘블랙박스’처럼 어떤 기준으로 판단했는지 숨겨져 있다면, 억울하게 탈락하거나 피해를 입은 사람은 이유조차 알 수 없습니다. 공정한 기준이라면 누구나 떳떳하게 대중에 공개할 수 있어야 하며, 공개하기 부끄러운 기준은 숨기는 것이 아니라 애초에 알고리즘에서 배제해야 합니다.
            </p>
          </div>

          {/* Lesson Activity Tips */}
          <div className="p-4 rounded-xl bg-slate-100 border border-slate-200">
            <h4 className="font-bold text-slate-800 mb-2">💡 수업 진행 추천 순서</h4>
            <ol className="list-decimal list-inside space-y-1.5 text-slate-600">
              <li><strong>[상황 선택]</strong> 모둠별로 채용, 의료, 또는 장학금 상황을 하나 고릅니다.</li>
              <li><strong>[가중치 설정]</strong> 각 기준의 중요도를 자유롭게 토의하며 설정합니다.</li>
              <li><strong>[투명성 결정]</strong> 지원자나 환자들에게 당당히 공개할 수 있는 기준만 '공개'로 둡니다.</li>
              <li><strong>[결과 및 가상 사례 확인]</strong> 편견·차별 지표와 가상 인물 합격 여부를 관찰합니다.</li>
              <li><strong>[성찰 및 토의]</strong> 숨겨진 기준의 부당함과 공정한 기준의 조건을 토의합니다.</li>
            </ol>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-indigo-600 text-white font-semibold text-xs sm:text-sm hover:bg-indigo-700 transition cursor-pointer"
          >
            확인하고 실습 시작하기
          </button>
        </div>
      </div>
    </div>
  );
};
