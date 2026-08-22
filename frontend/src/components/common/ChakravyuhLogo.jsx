import React from 'react';

export const ChakravyuhLogo = ({ className = "w-6 h-6", glow = false }) => {
  return (
    <svg 
      className={`${className} ${glow ? 'drop-shadow-[0_0_8px_rgba(245,158,11,0.6)]' : ''}`} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Outer Mandala Dots */}
      <circle cx="50" cy="50" r="48" stroke="currentColor" strokeWidth="1" strokeDasharray="2 4" opacity="0.3" />
      
      {/* Outer Ring */}
      <circle cx="50" cy="50" r="42" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
      
      {/* Intricate Inner Rings representing the layers of Chakravyuh */}
      <circle cx="50" cy="50" r="34" stroke="currentColor" strokeWidth="2" opacity="0.7" />
      <circle cx="50" cy="50" r="26" stroke="currentColor" strokeWidth="1.5" opacity="0.8" />
      <circle cx="50" cy="50" r="18" stroke="currentColor" strokeWidth="2" opacity="0.9" />
      
      {/* Center Node / Bindu */}
      <circle cx="50" cy="50" r="8" fill="currentColor" />
      
      {/* Strategic Entry Paths (Labyrinth structure) */}
      <path d="M50 8 L50 24 M50 76 L50 92 M8 50 L24 50 M76 50 L92 50" stroke="currentColor" strokeWidth="2" opacity="0.6" strokeLinecap="round" />
      <path d="M20 20 L32 32 M80 80 L68 68 M80 20 L68 32 M20 80 L32 68" stroke="currentColor" strokeWidth="1.5" opacity="0.4" strokeLinecap="round" />
      
      {/* Traditional curve accents in corners */}
      <path d="M40 16 Q50 20 60 16" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.8" />
      <path d="M40 84 Q50 80 60 84" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.8" />
      <path d="M16 40 Q20 50 16 60" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.8" />
      <path d="M84 40 Q80 50 84 60" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.8" />
    </svg>
  );
};
