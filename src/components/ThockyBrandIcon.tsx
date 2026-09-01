import React from 'react';

interface ThockyBrandIconProps {
  className?: string;
  accentColor?: string;
  glowColor?: string;
  isLightBackground?: boolean;
}

export const ThockyBrandIcon: React.FC<ThockyBrandIconProps> = ({
  className = 'w-8 h-8',
  accentColor,
  glowColor,
  isLightBackground = false,
}) => {
  const uniqueId = React.useId().replace(/:/g, '');
  const stemGradId = `stem-grad-${uniqueId}`;
  const glassGradId = `glass-grad-${uniqueId}`;
  const topGlassGradId = `top-glass-grad-${uniqueId}`;
  const ringGradId = `ring-grad-${uniqueId}`;
  const glowFilterId = `glow-${uniqueId}`;

  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} select-none transition-transform duration-200`}
      aria-label="Thocky Logo"
    >
      <defs>
        {/* Glowing Stem Gradient matching the exact violet -> magenta -> gold fade */}
        <linearGradient id={stemGradId} x1="32" y1="26" x2="68" y2="56" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#A855F7" />
          <stop offset="25%" stopColor="#C084FC" />
          <stop offset="55%" stopColor="#E879F9" />
          <stop offset="80%" stopColor="#F472B6" />
          <stop offset="100%" stopColor="#FBBF24" />
        </linearGradient>

        {/* Translucent Glass Front/Side Facets Gradient */}
        <linearGradient id={glassGradId} x1="50" y1="18" x2="50" y2="65" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="rgba(233, 213, 255, 0.75)" />
          <stop offset="35%" stopColor="rgba(192, 132, 252, 0.5)" />
          <stop offset="70%" stopColor="rgba(147, 51, 234, 0.35)" />
          <stop offset="100%" stopColor="rgba(88, 28, 135, 0.2)" />
        </linearGradient>

        {/* Top Hexagonal Cap Surface */}
        <linearGradient id={topGlassGradId} x1="30" y1="20" x2="70" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="rgba(245, 235, 255, 0.85)" />
          <stop offset="50%" stopColor="rgba(216, 180, 254, 0.6)" />
          <stop offset="100%" stopColor="rgba(192, 132, 252, 0.4)" />
        </linearGradient>

        {/* Neon Acoustic Wave Gradient */}
        <linearGradient id={ringGradId} x1="15" y1="50" x2="85" y2="85" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#A855F7" />
          <stop offset="50%" stopColor="#C084FC" />
          <stop offset="100%" stopColor="#7E22CE" />
        </linearGradient>

        {/* Inner stem soft bloom filter */}
        <filter id={glowFilterId} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="1.8" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Outer Acoustic Soundwave Rings (Concentric Radiating Ellipses) */}
      <g opacity={isLightBackground ? 0.35 : 0.85}>
        <ellipse
          cx="50"
          cy="62"
          rx="44"
          ry="24"
          stroke={isLightBackground ? '#0F172A' : `url(#${ringGradId})`}
          strokeWidth="1.2"
          strokeDasharray="4 2"
          opacity="0.5"
        />
        <ellipse
          cx="50"
          cy="62"
          rx="38"
          ry="20"
          stroke={isLightBackground ? '#0F172A' : `url(#${ringGradId})`}
          strokeWidth="1.5"
          opacity="0.75"
        />
        <ellipse
          cx="50"
          cy="62"
          rx="32"
          ry="16"
          stroke={isLightBackground ? '#0F172A' : '#D8B4FE'}
          strokeWidth="1.8"
          opacity="0.95"
        />
      </g>

      {/* Switch Bottom Neon Underglow */}
      <ellipse
        cx="50"
        cy="75"
        rx="28"
        ry="10"
        fill={isLightBackground ? 'rgba(0,0,0,0.3)' : 'rgba(168, 85, 247, 0.45)'}
        filter={isLightBackground ? undefined : `url(#${glowFilterId})`}
      />

      {/* Isometric Dark Charcoal Switch Base (Bottom Housing) */}
      {/* Base Left Wall */}
      <path
        d="M 23 55 L 50 69 L 50 82 L 23 68 Z"
        fill="#13131A"
        stroke={isLightBackground ? 'rgba(0,0,0,0.5)' : 'rgba(168, 85, 247, 0.4)'}
        strokeWidth="1"
      />
      {/* Base Right Wall */}
      <path
        d="M 50 69 L 77 55 L 77 68 L 50 82 Z"
        fill="#1C1C26"
        stroke={isLightBackground ? 'rgba(0,0,0,0.5)' : 'rgba(168, 85, 247, 0.4)'}
        strokeWidth="1"
      />
      {/* Base Top Collar Rim */}
      <path
        d="M 50 46 L 77 55 L 50 69 L 23 55 Z"
        fill="#262636"
        stroke={isLightBackground ? 'rgba(0,0,0,0.3)' : 'rgba(192, 132, 252, 0.3)'}
        strokeWidth="0.8"
      />

      {/* Translucent 3D Crystal Keycap Shell (Faceted Prism) */}
      {/* Left Glass Facet */}
      <path
        d="M 50 18 L 30 29 L 24 54 L 50 64 Z"
        fill={`url(#${glassGradId})`}
        stroke="rgba(255, 255, 255, 0.45)"
        strokeWidth="0.8"
      />
      {/* Right Glass Facet */}
      <path
        d="M 50 18 L 70 29 L 76 54 L 50 64 Z"
        fill="rgba(168, 85, 247, 0.3)"
        stroke="rgba(255, 255, 255, 0.45)"
        strokeWidth="0.8"
      />
      {/* Top Glass Surface */}
      <polygon
        points="50,18 70,29 50,40 30,29"
        fill={`url(#${topGlassGradId})`}
        stroke="rgba(255, 255, 255, 0.85)"
        strokeWidth="1"
      />

      {/* Glowing 6-Petal Asterisk Switch Stem (Inner Core) */}
      <g filter={`url(#${glowFilterId})`}>
        {/* Top-Bottom Vertical Lobe */}
        <rect
          x="46.5"
          y="25"
          width="7"
          height="28"
          rx="3.5"
          fill={`url(#${stemGradId})`}
        />
        {/* Top-Right to Bottom-Left Lobe */}
        <rect
          x="46.5"
          y="25"
          width="7"
          height="28"
          rx="3.5"
          transform="rotate(60 50 39)"
          fill={`url(#${stemGradId})`}
        />
        {/* Top-Left to Bottom-Right Lobe */}
        <rect
          x="46.5"
          y="25"
          width="7"
          height="28"
          rx="3.5"
          transform="rotate(-60 50 39)"
          fill={`url(#${stemGradId})`}
        />
      </g>

      {/* Specular Edge Highlights & Light Reflection Bevels */}
      <line
        x1="50"
        y1="18"
        x2="50"
        y2="64"
        stroke="rgba(255, 255, 255, 0.85)"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <line
        x1="30"
        y1="29"
        x2="24"
        y2="54"
        stroke="rgba(255, 255, 255, 0.6)"
        strokeWidth="1"
      />
      <line
        x1="70"
        y1="29"
        x2="76"
        y2="54"
        stroke="rgba(255, 255, 255, 0.6)"
        strokeWidth="1"
      />

      {/* Bright Central Specular Star */}
      <circle cx="50" cy="39" r="2" fill="#FFFFFF" opacity="0.95" />
    </svg>
  );
};
