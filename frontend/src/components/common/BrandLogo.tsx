import React from 'react';
import { Sprout } from 'lucide-react';

interface BrandLogoProps {
  tone?: 'light' | 'dark';
  compact?: boolean;
  onClick?: () => void;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  tone = 'dark',
  compact = false,
  onClick,
}) => {
  const content = (
    <>
      <span className={`${compact ? 'h-7 w-7' : 'h-9 w-9'} flex shrink-0 items-center justify-center rounded-full bg-[#76c043] text-white shadow-md`}>
        <Sprout className={compact ? 'h-4 w-4' : 'h-5 w-5'} />
      </span>
      <span className={`font-extrabold tracking-tight ${compact ? 'text-base' : 'text-lg sm:text-xl'} ${tone === 'light' ? 'text-white' : 'text-[#1c1c18]'}`}>
        ARO<span className={tone === 'light' ? 'text-[#8eda5a]' : 'text-[#316b00]'}>VOLY</span>
      </span>
    </>
  );

  return onClick ? (
    <button type="button" onClick={onClick} className="flex items-center gap-2 transition-transform hover:scale-[1.02]">
      {content}
    </button>
  ) : (
    <div className="flex items-center gap-2">{content}</div>
  );
};
