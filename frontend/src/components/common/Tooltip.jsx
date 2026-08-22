import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { HelpCircle } from 'lucide-react';

export const Tooltip = ({ text, simpleExplainer, children }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <span
      className="relative inline-flex items-center"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children || <HelpCircle className="w-3.5 h-3.5 ml-1 text-slate-400 hover:text-amber-400 cursor-pointer inline transition-colors" />}

      <AnimatePresence>
        {isVisible && (
          <motion.span
            initial={{ opacity: 0, y: 6, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 rounded-xl bg-slate-900/95 backdrop-blur-md border border-amber-500/30 text-xs text-slate-200 shadow-2xl z-50 pointer-events-none text-left"
          >
            <span className="block font-semibold text-amber-400 mb-1">Easy Explanation:</span>
            <span>{simpleExplainer || text}</span>
            <span className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-900" />
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
};
