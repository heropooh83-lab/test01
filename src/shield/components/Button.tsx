import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'gold' | 'ghost';
}

/** 원본의 .btn / .btn.ghost 두 가지 버튼. */
export const Button: React.FC<ButtonProps> = ({ variant = 'gold', className = '', ...rest }) => (
  <button
    type="button"
    className={`inline-flex cursor-pointer items-center gap-2 rounded-[9px] px-5 py-3 text-[0.95rem] font-extrabold transition active:translate-y-px disabled:cursor-not-allowed disabled:opacity-40 ${
      variant === 'gold'
        ? 'gold-btn text-navy-3'
        : 'border-[1.5px] border-line-cool text-navy-2 hover:border-navy-2 hover:bg-navy-1/5'
    } ${className}`}
    {...rest}
  />
);

/** 알약 모양 보조 토글 (공유 켜기·새로고침 등). */
export const PillButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({
  className = '',
  ...rest
}) => (
  <button
    type="button"
    className={`cursor-pointer rounded-full border border-line-cool bg-white px-4 py-2 text-[0.8rem] font-bold text-[#5b6480] transition hover:border-navy-1 hover:text-navy-1 ${className}`}
    {...rest}
  />
);
