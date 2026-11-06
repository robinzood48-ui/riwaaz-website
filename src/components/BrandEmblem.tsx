import React from 'react';

interface BrandEmblemProps {
  className?: string;
  size?: number;
  variant?: 'gold' | 'monochrome' | 'dark';
  as?: 'svg' | 'img';
}

export const BrandEmblem: React.FC<BrandEmblemProps> = ({
  className = '',
  size = 40,
  variant = 'gold',
  as = 'svg',
}) => {
  const strokeColor =
    variant === 'gold'
      ? '#BFA069'
      : variant === 'dark'
      ? '#25201C'
      : '#FAF7F2';

  const fillColor =
    variant === 'gold'
      ? 'url(#goldGradient)'
      : variant === 'dark'
      ? '#3D2D24'
      : '#FAF7F2';

  if (as === 'img') {
    return (
      <img
        src="/images/Luxury Gold R Monogram Emblem.png"
        alt="RIWAAZ Luxury Gold R Monogram Emblem"
        width={size}
        height={size}
        style={{ width: `${size}px`, height: `${size}px` }}
        className={`inline-block shrink-0 rounded-lg object-contain border border-[#BFA069]/50 shadow-xs bg-[#25201C] p-0.5 ${className}`}
      />
    );
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      className={`inline-block shrink-0 rounded-lg overflow-hidden border border-[#BFA069]/40 shadow-xs bg-[#25201C] ${className}`}
      aria-label="RIWAAZ Luxury Gold R Monogram Emblem"
      style={{ width: `${size}px`, height: `${size}px` }}
    >
      <defs>
        <clipPath id="emblemRoundedArchClip">
          <rect x="0" y="0" width="100" height="100" rx="14" />
        </clipPath>
        <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#DFCE9F" />
          <stop offset="45%" stopColor="#C4A671" />
          <stop offset="75%" stopColor="#A6834A" />
          <stop offset="100%" stopColor="#8A6732" />
        </linearGradient>
        <linearGradient id="goldStroke" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#E6D7AD" />
          <stop offset="50%" stopColor="#BF9E66" />
          <stop offset="100%" stopColor="#876531" />
        </linearGradient>
      </defs>

      {/* Vector Fallback Graphics (rendered underneath) */}
      <rect width="100" height="100" rx="14" fill="#25201C" />
      <path
        d="M28 85V38C28 22 38 12 50 12C62 12 72 22 72 38V42"
        stroke={variant === 'gold' ? 'url(#goldStroke)' : strokeColor}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M26 85H44"
        stroke={variant === 'gold' ? 'url(#goldStroke)' : strokeColor}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M40 28H48V78H40"
        fill={fillColor}
        stroke={variant === 'gold' ? 'url(#goldStroke)' : strokeColor}
        strokeWidth="0.5"
      />
      <path
        d="M36 28H58C68 28 74 34 74 44C74 53 67 58 56 58H48"
        stroke={variant === 'gold' ? 'url(#goldStroke)' : strokeColor}
        strokeWidth="2.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M52 56C58 56 64 66 76 76C82 81 88 81 90 80"
        stroke={variant === 'gold' ? 'url(#goldStroke)' : strokeColor}
        strokeWidth="3"
        strokeLinecap="round"
      />

      {/* Primary Luxury Gold R Monogram Emblem Image */}
      <g clipPath="url(#emblemRoundedArchClip)">
        <image
          href="/images/Luxury Gold R Monogram Emblem.png"
          xlinkHref="/images/Luxury Gold R Monogram Emblem.png"
          x="0"
          y="0"
          width="100"
          height="100"
          preserveAspectRatio="xMidYMid meet"
        />
      </g>

      {/* Subtle Luxury Gold Rim Border */}
      <rect
        x="0.75"
        y="0.75"
        width="98.5"
        height="98.5"
        rx="13.25"
        stroke="#BFA069"
        strokeWidth="1.5"
        strokeOpacity="0.7"
        fill="none"
      />
    </svg>
  );
};
