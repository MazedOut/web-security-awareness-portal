import React from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

export const ProgressBar = ({
  value = 0,
  max = 100,
  color = 'gold', // 'gold', 'green', 'blue', 'purple', 'red'
  label,
  showPercentage = true,
  height = 'h-2.5',
  className = ''
}) => {
  const percentage = Math.min(100, Math.max(0, Math.round((value / max) * 100)));

  const colorGradients = {
    gold: 'from-amber-500 to-yellow-400 shadow-gold-glow',
    green: 'from-emerald-500 to-green-400 shadow-green-glow',
    blue: 'from-blue-600 to-cyan-400 shadow-blue-glow',
    purple: 'from-purple-600 to-indigo-400 shadow-purple-glow',
    red: 'from-rose-600 to-red-400 shadow-red-glow',
  };

  return (
    <div className={clsx('w-full', className)}>
      {(label || showPercentage) && (
        <div className="flex items-center justify-between text-xs mb-1.5 font-medium text-slate-300">
          <span>{label}</span>
          {showPercentage && <span className="font-mono text-slate-400">{percentage}%</span>}
        </div>
      )}
      <div className={clsx('w-full bg-slate-900/80 rounded-full overflow-hidden p-0.5 border border-white/5', height)}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className={clsx('h-full rounded-full bg-gradient-to-r', colorGradients[color] || colorGradients.gold)}
        />
      </div>
    </div>
  );
};
