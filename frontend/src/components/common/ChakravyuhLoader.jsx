import React from 'react';
import { motion } from 'framer-motion';

export const ChakravyuhLoader = ({ text = "Initializing Defense Systems...", fullScreen = true }) => {
  const containerClasses = fullScreen 
    ? "fixed inset-0 z-50 flex flex-col items-center justify-center bg-obsidian-deep/90 backdrop-blur-md" 
    : "flex flex-col items-center justify-center p-8";

  return (
    <div className={containerClasses}>
      <div className="relative w-24 h-24 sm:w-32 sm:h-32 flex items-center justify-center">
        {/* Animated Chakravyuh Rings (Gold Line Animation) */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 8, ease: "linear", repeat: Infinity }}
          className="absolute inset-0 rounded-full border-[1.5px] border-dashed border-amber-500/40"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 12, ease: "linear", repeat: Infinity }}
          className="absolute inset-2 rounded-full border border-amber-500/20"
        />
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 6, ease: "linear", repeat: Infinity }}
          className="absolute inset-5 rounded-full border border-amber-500/60 border-t-transparent"
        />
        
        {/* Center glowing element */}
        <motion.div
          animate={{ scale: [0.8, 1.1, 0.8], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, ease: "easeInOut", repeat: Infinity }}
          className="w-4 h-4 sm:w-6 sm:h-6 rounded-full bg-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.8)]"
        />
      </div>
      
      {text && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-6 flex flex-col items-center"
        >
          <div className="text-amber-400 font-display font-semibold tracking-widest text-sm uppercase">
            {text}
          </div>
          <div className="w-32 h-0.5 bg-slate-800 mt-3 rounded-full overflow-hidden">
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: "100%" }}
              transition={{ duration: 1.5, ease: "easeInOut", repeat: Infinity }}
              className="w-1/2 h-full bg-gradient-to-r from-transparent via-amber-500 to-transparent"
            />
          </div>
        </motion.div>
      )}
    </div>
  );
};
