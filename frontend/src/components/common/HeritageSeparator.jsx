import React from 'react';

export const HeritageSeparator = ({ className = "my-6" }) => {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="w-16 sm:w-32 h-px bg-gradient-to-r from-transparent to-amber-500/60"></div>
      <div className="px-3 flex items-center justify-center opacity-80">
        <svg width="60" height="16" viewBox="0 0 100 30" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Center Diamond */}
          <path d="M50 0 L60 15 L50 30 L40 15 Z" fill="#F59E0B" />
          <circle cx="50" cy="15" r="3" fill="#080A0F" />
          
          {/* Side Diamonds */}
          <path d="M25 7 L33 15 L25 23 L17 15 Z" fill="#F59E0B" fillOpacity="0.6" />
          <path d="M75 7 L83 15 L75 23 L67 15 Z" fill="#F59E0B" fillOpacity="0.6" />
          
          {/* Connecting Stitched Line */}
          <path d="M0 15 H12 M38 15 H45 M55 15 H62 M88 15 H100" stroke="#F59E0B" strokeWidth="1.5" strokeDasharray="3 3" />
        </svg>
      </div>
      <div className="w-16 sm:w-32 h-px bg-gradient-to-l from-transparent to-amber-500/60"></div>
    </div>
  );
};
