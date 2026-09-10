import React from 'react';
import type { RichText } from '../types';

/**
 * 문장 조각 배열을 그린다. 원본이 `innerHTML`로 넣던 `<b>`·인용문을 대신하며,
 * 학생이 입력한 글은 이 경로를 타지 않으므로 마크업이 주입될 여지가 없다.
 */
export const Rich: React.FC<{ value: RichText }> = ({ value }) => (
  <>
    {value.map((seg, i) => {
      if (typeof seg === 'string') return <React.Fragment key={i}>{seg}</React.Fragment>;
      if ('em' in seg) {
        return (
          <b key={i} className="font-extrabold text-white">
            {seg.em}
          </b>
        );
      }
      return (
        <span key={i} className="my-2 block border-l-[3px] border-cyan pl-2.5 text-white italic">
          {seg.quote}
        </span>
      );
    })}
  </>
);
