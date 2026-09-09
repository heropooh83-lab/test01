import React, { useCallback, useEffect, useRef } from 'react';
import type { ShieldShape } from '../types';

interface ShieldPreviewProps {
  name: string;
  rules: string[];
  shape: ShieldShape;
}

/**
 * 화면용 방패. clip-path를 겹친 div 세 겹(금테 · 남색 면 · 안쪽 각인선)으로 그린다.
 * PNG 저장과 갤러리에 쓰이는 SVG 버전(utils/shieldSvg.ts)과 같은 좌표계를 공유한다.
 */
export const ShieldPreview: React.FC<ShieldPreviewProps> = ({ name, rules, shape }) => {
  const faceRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  /**
   * 규칙이 길거나 많으면 방패가 좁아지는 아래쪽에서 글자가 잘린다.
   * 목록이 도형의 안전 영역 안에 들어올 때까지 글자 크기를 줄여 맞춘다.
   * (원본은 크기가 고정이라 작은 화면에서 규칙 5개를 적으면 잘려 나갔다.)
   */
  const fit = useCallback(() => {
    const face = faceRef.current;
    const list = listRef.current;
    if (!face || !list) return;

    const limit = face.clientHeight * shape.safeRatio;
    let size = Math.max(9, Math.min(13, face.clientWidth * 0.034));
    list.style.fontSize = `${size}px`;

    while (size > 8 && list.offsetTop + list.offsetHeight > limit) {
      size -= 0.5;
      list.style.fontSize = `${size}px`;
    }
  }, [shape.safeRatio]);

  useEffect(() => {
    fit();
    const face = faceRef.current;
    if (!face || typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(fit);
    ro.observe(face);
    return () => ro.disconnect();
  }, [fit, name, rules, shape]);

  if (!rules.length) {
    return (
      <div className="w-[min(94%,430px)] rounded-[10px] border-[1.5px] border-dashed border-line bg-[#fffdf6] px-4 py-11 text-center text-[0.94rem] leading-relaxed text-[#8a7a52]">
        <span className="mb-2 block text-[2.4rem] opacity-50">🛡</span>
        아직 새길 규칙이 없어요.
        <br />
        2단계에서 규칙을 먼저 적어 주세요.
      </div>
    );
  }

  return (
    <>
      <div
        className="shield-plate animate-forge relative aspect-[1/1.45] w-[min(94%,430px)] p-1.5 shadow-[0_26px_50px_rgba(8,12,30,.5)] sm:aspect-[1/1.2]"
        style={{ clipPath: shape.css }}
      >
        <div
          ref={faceRef}
          className="shield-face relative flex size-full flex-col items-center px-[min(8%,34px)] pt-[min(11%,40px)] pb-[min(9%,30px)] text-white"
          style={{ clipPath: shape.css }}
        >
          <div
            className="pointer-events-none absolute inset-[min(6%,20px)] border-[1.5px] border-gold-1/50"
            style={{ clipPath: shape.css }}
          />
          <div className="mb-3 w-full border-b border-gold-1/35 pb-2.5 text-center">
            <div className="text-[2rem] leading-none drop-shadow-[0_2px_4px_rgba(0,0,0,.35)]">{shape.crest}</div>
            <div className="mt-1.5 text-[1.08rem] font-black text-gold-1 [text-shadow:0_1px_3px_rgba(0,0,0,.4)]">
              {name}
            </div>
          </div>
          <ul ref={listRef} className="flex w-full list-none flex-col gap-[7px] text-[0.82rem] leading-snug">
            {rules.slice(0, 5).map((rule, i) => (
              <li key={i} className="flex items-start gap-2 text-[#eaf0ff]">
                <span className="mt-[0.15em] flex-none text-[0.7rem] text-gold-1">◆</span>
                <span>{rule}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="text-[0.86rem] font-bold text-navy-2 print-plain">
        ✦ 우리 모둠 방패: <b className="text-gold-3">{shape.name}</b> ✦
      </div>
    </>
  );
};
