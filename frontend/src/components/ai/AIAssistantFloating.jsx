import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Sparkles, X, MessageSquare } from 'lucide-react';
import { AIAssistantDrawer } from './AIAssistantDrawer';
import { useLanguage } from '../../context/LanguageContext';

export const AIAssistantFloating = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { lang } = useLanguage();

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 30 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="mb-4 w-[92vw] sm:w-[420px] shadow-2xl"
          >
            <AIAssistantDrawer />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        onClick={() => setIsOpen(!isOpen)}
        className="relative group p-4 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-500 text-slate-950 font-bold shadow-gold-glow border border-amber-300/40 flex items-center gap-2"
        title="Chakravyuh AI Security Assistant"
      >
        {isOpen ? (
          <X className="w-6 h-6 text-slate-950" />
        ) : (
          <>
            <Bot className="w-6 h-6 text-slate-950" />
            <span className="hidden sm:inline text-xs font-extrabold uppercase tracking-wider">
              {lang === 'hi' ? 'AI सुरक्षा सहायक' : 'AI Security Help'}
            </span>
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-slate-950 animate-ping" />
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-slate-950" />
          </>
        )}
      </motion.button>
    </div>
  );
};
