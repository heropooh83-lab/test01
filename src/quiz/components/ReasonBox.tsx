import React from 'react';

interface ReasonBoxProps {
  value: string;
  locked: boolean;
  onChange: (value: string) => void;
}

/**
 * 답을 고르기 전에 근거를 먼저 적어 보는 칸(선택).
 * 고르고 나면 잠겨서, 정답 해설을 보고 근거를 고쳐 쓰는 일이 생기지 않는다.
 */
export const ReasonBox: React.FC<ReasonBoxProps> = ({ value, locked, onChange }) => (
  <div className={`mt-3.5 mb-1 ${locked ? 'opacity-75' : ''}`}>
    <label htmlFor="reason" className="mb-1.5 block text-[0.86rem] font-bold text-body">
      왜 그렇게 생각했나요?{' '}
      <span className="text-[0.8rem] font-semibold text-muted">
        (답을 고르기 전에 적어 보세요 · 선택)
      </span>
    </label>
    <textarea
      id="reason"
      value={value}
      readOnly={locked}
      onChange={(e) => onChange(e.target.value)}
      placeholder="예) 공식 채널에 없고 SNS로만 퍼져서 의심스러워요"
      className="min-h-[52px] w-full resize-y rounded-xl border-[1.5px] border-line bg-inset px-3.5 py-2.5 text-[0.92rem] leading-snug text-ink placeholder:text-[#5f6a8c] focus:border-cyan focus:ring-[3px] focus:ring-cyan/20 focus:outline-none"
    />
  </div>
);
