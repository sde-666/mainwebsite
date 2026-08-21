import React from 'react';

interface NielitLogoProps {
  variant?: 'full' | 'emblem' | 'badge';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showWhiteCard?: boolean;
}

export function NielitLogo({
  variant = 'full',
  size = 'md',
  className = '',
  showWhiteCard = false,
}: NielitLogoProps) {
  const heightClass = {
    xs: 'h-4',
    sm: 'h-6',
    md: 'h-8',
    lg: 'h-11',
    xl: 'h-14',
  }[size];

  const logoSrc = variant === 'emblem' ? '/nielit-emblem.svg' : '/nielit-logo.svg';

  if (variant === 'badge') {
    return (
      <div
        className={`inline-flex items-center gap-2 bg-white text-slate-900 border border-slate-200/90 rounded-xl px-2.5 py-1.5 shadow-xs ${className}`}
      >
        <img
          src="/nielit-emblem.svg"
          alt="NIELIT Official Emblem"
          className={`${heightClass} w-auto object-contain shrink-0`}
          loading="lazy"
        />
        <div className="flex flex-col text-left leading-none">
          <span className="text-[10px] uppercase font-black text-[#003366] tracking-wider">
            NIELIT R5.1
          </span>
          <span className="text-[9px] font-semibold text-slate-500 mt-0.5">
            Aligned Syllabus
          </span>
        </div>
      </div>
    );
  }

  if (showWhiteCard) {
    return (
      <div className={`inline-flex items-center justify-center bg-white rounded-lg p-1.5 shadow-2xs border border-slate-200/60 ${className}`}>
        <img
          src={logoSrc}
          alt="National Institute of Electronics & Information Technology (NIELIT) Logo"
          className={`${heightClass} w-auto object-contain`}
          loading="lazy"
        />
      </div>
    );
  }

  return (
    <img
      src={logoSrc}
      alt="National Institute of Electronics & Information Technology (NIELIT) Logo"
      className={`${heightClass} w-auto object-contain ${className}`}
      loading="lazy"
    />
  );
}
