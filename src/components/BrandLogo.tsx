import React from 'react';

interface BrandLogoProps {
  variant?: 'full' | 'horizontal' | 'icon' | 'badge';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showTagline?: boolean;
}

export function BrandLogo({
  variant = 'horizontal',
  size = 'md',
  className = '',
  showTagline = true
}: BrandLogoProps) {
  // If variant is icon / square squircle badge
  if (variant === 'icon' || variant === 'badge') {
    const sizeClasses = {
      sm: 'w-8 h-8 rounded-xl',
      md: 'w-10 h-10 rounded-2xl',
      lg: 'w-16 h-16 rounded-3xl',
      xl: 'w-24 h-24 rounded-3xl sm:w-32 sm:h-32',
    }[size];

    return (
      <div
        className={`relative bg-white border border-gray-200/80 shadow-xs flex flex-col items-center justify-center p-1.5 select-none ${sizeClasses} ${className}`}
      >
        <img
          src="/skilldotpy-logo.svg"
          alt="Skilldotpy Official Logo"
          className="w-full h-full object-contain"
          loading="lazy"
        />
      </div>
    );
  }

  if (variant === 'full') {
    return (
      <div className={`flex flex-col items-center text-center select-none ${className}`}>
        <img
          src="/skilldotpy-logo.svg"
          alt="Skilldotpy - Just learn skills"
          className={
            size === 'sm'
              ? 'w-24 h-24'
              : size === 'md'
              ? 'w-36 h-36'
              : size === 'lg'
              ? 'w-48 h-48'
              : 'w-64 h-64'
          }
        />
      </div>
    );
  }

  // Horizontal logo (default)
  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      <div className="w-10 h-10 rounded-xl bg-white border border-gray-200/90 shadow-2xs p-1 flex items-center justify-center shrink-0">
        <img
          src="/skilldotpy-logo.svg"
          alt="Skill.py"
          className="w-full h-full object-contain"
        />
      </div>
      <div className="flex flex-col">
        <div className="flex items-baseline font-black leading-none tracking-tight">
          <span className="text-xl sm:text-2xl text-slate-950 font-extrabold tracking-tight">
            Skill
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mx-0.5 inline-block self-center mb-0.5"></span>
          <span className="text-xl sm:text-2xl text-rose-500 font-black font-serif tracking-normal">
            py
          </span>
        </div>
        {showTagline && (
          <span className="text-[11px] font-semibold text-slate-600 tracking-tight font-sans -mt-0.5">
            Just learn skills...
          </span>
        )}
      </div>
    </div>
  );
}
