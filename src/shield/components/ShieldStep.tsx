import React from 'react';
import type { GalleryEntry, ShieldShape } from '../types';
import { Button } from './Button';
import { Gallery } from './Gallery';
import { Panel, PanelControls } from './Panel';
import { ShieldPreview } from './ShieldPreview';

interface ShieldStepProps {
  name: string;
  rules: string[];
  shape: ShieldShape;
  entries: GalleryEntry[];
  galleryRef: React.RefObject<HTMLDivElement | null>;
  onPrev: () => void;
  onNext: () => void;
  onSavePng: () => void;
  onPrint: () => void;
  onRegister: () => void;
  onDeleteEntry: (id: string) => void;
  onRefreshGallery: () => void;
}

/** STEP 3 — 완성된 방패와 반 갤러리. 규칙이 하나도 없으면 빈 방패 안내가 나온다. */
export const ShieldStep: React.FC<ShieldStepProps> = ({
  name,
  rules,
  shape,
  entries,
  galleryRef,
  onPrev,
  onNext,
  onSavePng,
  onPrint,
  onRegister,
  onDeleteEntry,
  onRefreshGallery,
}) => (
  <Panel
    stepTag="STEP 3"
    title="안전 방패 완성"
    lead="우리 모둠의 규칙이 방패에 새겨졌어요. 이미지로 저장하거나 인쇄해 교실에 걸고, ‘우리 반 갤러리’에 등록해 다른 모둠 방패와 함께 볼 수 있어요."
  >
    <div className="flex flex-col items-center justify-center gap-3 pt-2.5 pb-1.5">
      <ShieldPreview name={name} rules={rules} shape={shape} />
    </div>

    <PanelControls>
      <Button variant="ghost" onClick={onPrev}>
        ← 규칙 고치기
      </Button>
      <div className="flex flex-wrap gap-2.5">
        <Button id="png-btn" variant="ghost" onClick={onSavePng} disabled={!rules.length}>
          🖼 이미지 저장
        </Button>
        <Button id="print-btn" variant="ghost" onClick={onPrint}>
          🖨 인쇄
        </Button>
        <Button id="gallery-btn" onClick={onRegister} disabled={!rules.length}>
          🏛 갤러리에 등록
        </Button>
        <Button id="to-step-4" variant="ghost" onClick={onNext}>
          찬반 투표 →
        </Button>
      </div>
    </PanelControls>

    <div ref={galleryRef}>
      <Gallery entries={entries} onDelete={onDeleteEntry} onRefresh={onRefreshGallery} />
    </div>
  </Panel>
);
