import React from 'react';
import { Sparkles, Maximize2, Minimize2, BookOpen } from 'lucide-react';

interface HeaderProps {
  onOpenGuide: () => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenGuide,
  isFullscreen,
  onToggleFullscreen,
}) => {
  return (
    <header className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-700 via-indigo-600 to-indigo-800 text-white p-6 md:p-8 shadow-xl shadow-indigo-900/15 mb-8">
      {/* Decorative ambient glow */}
      <div className="absolute -right-12 -top-12 w-64 h-64 rounded-full bg-indigo-400/20 blur-3xl pointer-events-none" />
      <div className="absolute -left-12 -bottom-12 w-64 h-64 rounded-full bg-cyan-400/15 blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-sm border border-white/20 text-xs font-semibold tracking-wide text-indigo-100 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>연구학교 공개수업 · AI 윤리(공정성 & 투명성) 탐구 시뮬레이터</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
            <span>🤖</span> 정답이 없는 문제, AI는 어떻게 결정해야 할까?
          </h1>
          <p className="mt-2 text-sm sm:text-base text-indigo-100 max-w-2xl leading-relaxed">
            내가 설계한 AI의 판단 기준이 <strong>정말 공정한지</strong>, 그리고 누구에게나 <strong>떳떳하게 공개(투명성)</strong>할 수 있는지 직접 가중치를 조절하며 시뮬레이션해 보세요.
          </p>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          <button
            id="guide-modal-btn"
            onClick={onOpenGuide}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 active:bg-white/25 border border-white/20 text-white text-xs sm:text-sm font-medium transition cursor-pointer"
            title="AI 윤리 기본 개념 및 수업 가이드"
          >
            <BookOpen className="w-4 h-4 text-amber-300" />
            <span>AI 윤리 안내서</span>
          </button>
          <button
            id="fullscreen-toggle-btn"
            onClick={onToggleFullscreen}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 active:bg-white/25 border border-white/20 text-white text-xs sm:text-sm font-medium transition cursor-pointer"
            title="화면 크게 보기 / 일반 보기"
          >
            {isFullscreen ? (
              <>
                <Minimize2 className="w-4 h-4" />
                <span className="hidden sm:inline">일반 보기</span>
              </>
            ) : (
              <>
                <Maximize2 className="w-4 h-4" />
                <span className="hidden sm:inline">수업 집중 보기</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
