import React from 'react';

interface ChebiiLogoProps {
  variant?: 'full' | 'compact' | 'icon' | 'calligraphy' | 'white';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showSubtitle?: boolean;
}

export const ChebiiLogo: React.FC<ChebiiLogoProps> = ({
  variant = 'full',
  size = 'md',
  className = '',
  showSubtitle = true,
}) => {
  // Size specifications
  const iconSizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-13 h-13',
    xl: 'w-16 h-16',
  };

  const scriptSizes = {
    sm: 'text-2xl',
    md: 'text-3xl',
    lg: 'text-4xl',
    xl: 'text-5xl',
  };

  const subSizes = {
    sm: 'text-[9px] tracking-widest',
    md: 'text-[10px] tracking-[0.2em]',
    lg: 'text-xs tracking-[0.25em]',
    xl: 'text-sm tracking-[0.3em]',
  };

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Emblem SVG Badge: Highland Escarpment Crest with Golden Dorper Ram */}
      <div className={`relative ${iconSizes[size]} shrink-0 rounded-2xl bg-gradient-to-br from-amber-400 via-emerald-500 to-teal-800 p-0.5 shadow-lg shadow-amber-500/15 group-hover:shadow-amber-400/30 transition-all`}>
        <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center overflow-hidden relative">
          <svg
            viewBox="0 0 100 100"
            className="w-full h-full"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              {/* Golden Sun & Horn Gradient */}
              <linearGradient id="logoGold" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FDE047" />
                <stop offset="50%" stopColor="#F59E0B" />
                <stop offset="100%" stopColor="#D97706" />
              </linearGradient>

              {/* Highland Emerald Gradient */}
              <linearGradient id="logoEmerald" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#34D399" />
                <stop offset="100%" stopColor="#059669" />
              </linearGradient>

              {/* Radial glow */}
              <radialGradient id="sunGlow" cx="50%" cy="30%" r="50%">
                <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#0F172A" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Sun Glow */}
            <circle cx="50" cy="35" r="30" fill="url(#sunGlow)" />

            {/* Iten Highland Escarpment (2,400m) */}
            <path
              d="M0 75 L30 50 L55 65 L85 38 L100 52 L100 100 L0 100 Z"
              fill="url(#logoEmerald)"
              opacity="0.35"
            />

            {/* Dorper Head Silhouette Base */}
            <circle cx="50" cy="48" r="28" fill="#0F172A" stroke="url(#logoGold)" strokeWidth="1" />

            {/* Spiraling Dorper Ram Horn with Calligraphic Swash */}
            <path
              d="M32 44 C30 28, 45 16, 60 22 C72 26, 76 38, 70 48 C64 56, 52 54, 48 44 C45 36, 52 32, 58 35"
              stroke="url(#logoGold)"
              strokeWidth="4"
              strokeLinecap="round"
              fill="none"
            />

            {/* Dorper Characteristic Face */}
            <path
              d="M48 38 C54 38, 64 42, 68 50 C72 58, 66 68, 58 70 C50 72, 44 64, 44 56 Z"
              fill="url(#logoEmerald)"
            />

            {/* Dorper Eye Accent */}
            <circle cx="58" cy="46" r="2.5" fill="#FFFFFF" />

            {/* Golden Star / Iten Champion Peak */}
            <circle cx="28" cy="26" r="3.5" fill="url(#logoGold)" />
          </svg>
        </div>
      </div>

      {/* Calligraphed Brand Name "Chebii" */}
      {variant !== 'icon' && (
        <div className="flex flex-col justify-center">
          <div className="flex items-baseline gap-2">
            {/* Elegant Calligraphic "Chebii" with gold shimmer */}
            <span
              style={{ fontFamily: "'Great Vibes', 'Alex Brush', cursive, serif" }}
              className={`font-normal tracking-wide bg-gradient-to-r from-amber-200 via-amber-400 to-orange-400 bg-clip-text text-transparent drop-shadow-sm leading-none ${scriptSizes[size]}`}
            >
              Chebii
            </span>

            {/* Dorper Badge */}
            <span className="px-1.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-xs border border-emerald-300/40">
              Dorper
            </span>
          </div>

          {/* Subtitle */}
          {showSubtitle && variant === 'full' && (
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className={`font-bold uppercase text-emerald-400 font-sans ${subSizes[size]}`}>
                Sheep Farm
              </span>
              <span className="text-amber-400 text-[10px] font-serif">•</span>
              <span className="text-[10px] text-amber-300/90 font-medium font-sans">
                Iten (2,400m)
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
