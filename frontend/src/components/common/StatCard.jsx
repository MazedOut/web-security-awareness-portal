import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from './GlassCard';
import clsx from 'clsx';

export const StatCard = ({
  icon: Icon,
  label,
  value,
  prefix = '',
  suffix = '',
  trend,
  trendLabel,
  color = 'gold', // 'gold', 'green', 'blue', 'purple', 'red'
  description,
  className = '',
}) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (typeof value !== 'number') {
      setDisplayValue(value);
      return;
    }

    let start = 0;
    const duration = 1200;
    const steps = 30;
    const increment = value / steps;
    const intervalTime = duration / steps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= value) {
        setDisplayValue(value);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(start));
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, [value]);

  const colorStyles = {
    gold: 'text-cyber-gold-dark bg-cyber-gold/10 border-cyber-gold/20',
    green: 'text-cyber-green-dark bg-cyber-green/10 border-cyber-green/20',
    blue: 'text-cyber-blue-dark bg-cyber-blue/10 border-cyber-blue/20',
    purple: 'text-cyber-purple-dark bg-cyber-purple/10 border-cyber-purple/20',
    red: 'text-cyber-red-dark bg-cyber-red/10 border-cyber-red/20',
  };

  return (
    <GlassCard variant="interactive" className={clsx('relative overflow-hidden group', className)}>
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{label}</p>
          <div className="flex items-baseline space-x-1">
            <span className="text-3xl font-extrabold tracking-tight font-sans tabular-nums text-graphite">
              {prefix}
              {typeof value === 'number' ? displayValue.toLocaleString() : value}
              {suffix}
            </span>
          </div>
        </div>
        {Icon && (
          <div className={clsx('p-3 rounded-xl border transition-all duration-300 group-hover:scale-110 shadow-sm', colorStyles[color] || colorStyles.gold)}>
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>

      {(trend || trendLabel || description) && (
        <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          {trendLabel && (
            <span className={clsx('font-semibold inline-flex items-center gap-1', trend === 'up' ? 'text-cyber-gold-dark' : trend === 'safe' ? 'text-cyber-green-dark' : 'text-slate-500')}>
              {trendLabel}
            </span>
          )}
          {description && <span className="text-slate-500 text-xs truncate max-w-[200px]" title={description}>{description}</span>}
        </div>
      )}
    </GlassCard>
  );
};
