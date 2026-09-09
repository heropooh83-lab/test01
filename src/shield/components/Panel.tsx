import React from 'react';

interface PanelProps {
  stepTag: string;
  title: string;
  lead: React.ReactNode;
  children: React.ReactNode;
}

/** 네 단계가 공유하는 양피지 패널 껍데기. 내용만 갈아 끼운다. */
export const Panel: React.FC<PanelProps> = ({ stepTag, title, lead, children }) => (
  <section className="animate-rise relative rounded-md border border-line p-[clamp(18px,3.2vw,30px)] parchment">
    <h2 className="mb-1.5 flex flex-wrap items-center gap-2.5 text-[clamp(1.2rem,2.6vw,1.45rem)] font-extrabold tracking-tight text-navy-3">
      <span className="rounded-md border border-gold-3/30 bg-gold-2/15 px-2.5 py-0.5 text-[0.72rem] font-extrabold text-gold-3">
        {stepTag}
      </span>
      {title}
    </h2>
    <p className="mb-5 max-w-[64ch] text-[0.95rem] leading-relaxed text-[#6b5f42]">{lead}</p>
    {children}
  </section>
);

/** 패널 아래쪽 좌우 배치 컨트롤 줄. */
export const PanelControls: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="no-print mt-6 flex flex-wrap items-center justify-between gap-2.5">{children}</div>
);
