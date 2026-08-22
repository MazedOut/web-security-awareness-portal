import React, { useEffect, useState } from 'react';

const VerticalBorder = ({ position }) => (
  <div className={`fixed top-0 bottom-0 ${position === 'left' ? 'left-0' : 'right-0'} w-12 sm:w-16 z-0 overflow-hidden opacity-30 pointer-events-none hidden lg:block`}>
    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="embroidery-border" x="0" y="0" width="64" height="120" patternUnits="userSpaceOnUse">
          {/* Floral Vine Pattern (Kashmiri Embroidery Style) */}
          <path d="M 32 0 Q 50 30 32 60 T 32 120" fill="none" stroke="#F59E0B" strokeWidth="1.5" strokeOpacity="0.5" />
          {/* Leaves/Ambi */}
          <path d="M 32 30 C 15 30 15 15 32 15 Z" fill="#F59E0B" fillOpacity="0.15" />
          <path d="M 32 90 C 50 90 50 75 32 75 Z" fill="#F59E0B" fillOpacity="0.15" />
          {/* Center Line */}
          <path d="M 32 0 L 32 120" stroke="#F59E0B" strokeWidth="0.5" strokeOpacity="0.2" strokeDasharray="4 4" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#embroidery-border)" />
      {/* Edge gradient to blend seamlessly */}
      <div className={`absolute inset-0 bg-gradient-to-${position === 'left' ? 'r' : 'l'} from-transparent to-obsidian`}></div>
    </svg>
  </div>
);

export const BackgroundEffects = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-obsidian">
      {/* Traditional Vertical Borders */}
      <VerticalBorder position="left" />
      <VerticalBorder position="right" />
      
      {/* Heritage Mandala Layer - Light Theme */}
      <div className="absolute inset-0 mandala-bg opacity-10 mix-blend-multiply" />

      {/* Soft Light Gradients for Depth */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-cyber-gold-glow rounded-full blur-[120px] opacity-20" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-cyber-blue-glow rounded-full blur-[140px] opacity-10" />
    </div>
  );
};
