import React from 'react';
import type { GalleryEntry } from '../types';
import { shapeByKey } from '../utils/shape';
import { PillButton } from './Button';

interface GalleryProps {
  entries: GalleryEntry[];
  onDelete: (id: string) => void;
  onRefresh: () => void;
}

/** 등록된 방패를 작은 카드로 늘어놓는 우리 반 갤러리. 등록 순서(오래된 것부터)로 정렬한다. */
export const Gallery: React.FC<GalleryProps> = ({ entries, onDelete, onRefresh }) => (
  <div className="no-print mt-6 border-t border-line pt-4.5">
    <div className="mb-3.5 flex flex-wrap items-center justify-between gap-2.5">
      <h3 className="text-[1.05rem] font-extrabold text-navy-3">🏛 우리 반 방패 갤러리</h3>
      <PillButton id="refresh-gallery" onClick={onRefresh}>
        🔄 새로고침
      </PillButton>
    </div>

    <div className="grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-3.5">
      {entries.length === 0 ? (
        <div className="col-span-full rounded-[10px] border-[1.5px] border-dashed border-line bg-[#fffdf6] p-5 text-center text-[0.9rem] text-[#8a7a52]">
          아직 등록된 방패가 없어요. 모둠이 방패를 완성하면 ‘갤러리에 등록’을 눌러 보세요.
        </div>
      ) : (
        [...entries]
          .sort((a, b) => a.at - b.at)
          .map((entry) => {
            const shape = shapeByKey(entry.shape, entry.name);
            return (
              <div
                key={entry.id}
                className="relative rounded-[10px] border border-line bg-[#fffdf6] p-3 text-center transition hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(36,50,104,.12)]"
              >
                <button
                  type="button"
                  title="삭제"
                  aria-label={`${entry.name} 방패 삭제`}
                  onClick={() => onDelete(entry.id)}
                  className="absolute top-1.5 right-1.5 z-10 size-[22px] cursor-pointer rounded-md border-none bg-black/8 text-[0.8rem] leading-none font-black text-[#8a8272] hover:bg-danger hover:text-white"
                >
                  ×
                </button>
                <div
                  className="shield-face mb-2 flex aspect-[1/1.2] w-full flex-col items-center px-[12%] pt-[14%] pb-[8%] text-white shadow-[0_6px_16px_rgba(8,12,30,.35)]"
                  style={{ clipPath: shape.css }}
                >
                  <div className="text-[1.3rem] leading-none">{shape.crest}</div>
                  <div className="mt-1 max-w-full truncate text-[0.68rem] font-black text-gold-1">{entry.name}</div>
                  <div className="mt-auto pb-[6%] text-[0.6rem] text-[#c9d3ee]">규칙 {entry.rules.length}개</div>
                </div>
                <div className="truncate text-[0.82rem] font-extrabold text-navy-3" title={entry.name}>
                  {entry.name}
                </div>
              </div>
            );
          })
      )}
    </div>
  </div>
);
