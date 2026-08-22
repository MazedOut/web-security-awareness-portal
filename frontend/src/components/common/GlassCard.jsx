import React from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

export const GlassCard = ({
  children,
  className = '',
  variant = 'default', // 'default', 'subtle', 'glow', 'interactive'
  glowColor = 'gold', // 'gold', 'green', 'blue', 'purple', 'red'
  onClick,
  ...props
}) => {
  const variantClasses = {
    default: 'heritage-card indian-border p-6 text-graphite bg-white',
    subtle: 'glass-panel-subtle rounded-xl p-5 text-slate-600 bg-slate-50',
    glow: `heritage-card indian-border p-6 text-graphite shadow-md border border-cyber-${glowColor}/20 bg-white/90`,
    interactive: 'heritage-card indian-border p-6 text-graphite cursor-pointer bg-white hover:shadow-md transition-shadow',
  };

  const Component = onClick || variant === 'interactive' ? motion.div : 'div';
  const motionProps = onClick || variant === 'interactive' ? {
    whileHover: { y: -2, transition: { duration: 0.3, ease: 'easeOut' } },
    whileTap: { scale: 0.99 },
  } : {};

  return (
    <Component
      className={clsx(variantClasses[variant] || variantClasses.default, className)}
      onClick={onClick}
      {...motionProps}
      {...props}
    >
      {/* Add heritage corner decor except for subtle variant */}
      {variant !== 'subtle' && (
        <div className="absolute inset-0 heritage-corner-decor pointer-events-none rounded-inherit overflow-hidden" />
      )}
      
      {/* Content wrapper to stay above background elements */}
      <div className="relative z-10">
        {children}
      </div>
    </Component>
  );
};
