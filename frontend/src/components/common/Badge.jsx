import React from 'react';
import clsx from 'clsx';

export const Badge = ({
  children,
  variant = 'gold', // 'gold', 'green', 'blue', 'purple', 'red', 'gray'
  size = 'md', // 'sm', 'md'
  icon: Icon,
  className = ''
}) => {
  const variantStyles = {
    gold: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    green: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    blue: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
    purple: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
    red: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
    gray: 'bg-slate-800/60 text-slate-300 border-slate-700/50',
  };

  const sizeStyles = {
    sm: 'px-2 py-0.5 text-xs gap-1 rounded-md font-medium',
    md: 'px-2.5 py-1 text-xs gap-1.5 rounded-full font-semibold',
  };

  return (
    <span
      className={clsx(
        'inline-flex items-center border tracking-wide select-none',
        variantStyles[variant] || variantStyles.gold,
        sizeStyles[size] || sizeStyles.md,
        className
      )}
    >
      {Icon && <Icon className="w-3.5 h-3.5 shrink-0" />}
      <span>{children}</span>
    </span>
  );
};
