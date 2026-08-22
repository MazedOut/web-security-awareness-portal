import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import clsx from 'clsx';
import { useAccessibility } from '../../context/AccessibilityContext';

export const AnimatedButton = ({
  children,
  variant = 'primary', // 'primary' (gold), 'success' (green), 'info' (blue), 'danger' (red), 'glass', 'outline'
  size = 'md', // 'sm', 'md', 'lg'
  icon: Icon,
  iconPosition = 'left',
  className = '',
  disabled = false,
  onClick,
  ...props
}) => {
  const { playChime } = useAccessibility();
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { damping: 15, stiffness: 150, mass: 0.1 };
  const smoothX = useSpring(x, springConfig);
  const smoothY = useSpring(y, springConfig);

  const handleMouseMove = (e) => {
    if (disabled || !ref.current) return;
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    x.set(middleX * 0.05); // Reduced magnetic pull to 5% for subtler motion
    y.set(middleY * 0.05);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const sizeClasses = {
    sm: 'px-3.5 py-1.5 text-xs font-semibold gap-1.5 rounded-lg',
    md: 'px-5 py-2.5 text-sm font-semibold gap-2 rounded-xl',
    lg: 'px-7 py-3.5 text-base font-bold gap-2.5 rounded-2xl',
  };

  const variantClasses = {
    // Premium elegant colors
    primary: 'bg-cyber-gold-dark hover:bg-cyber-gold text-white shadow-md border border-cyber-gold/30',
    success: 'bg-cyber-green-dark hover:bg-cyber-green text-white shadow-md border border-cyber-green/30',
    info: 'bg-cyber-blue-dark hover:bg-cyber-blue text-white shadow-md border border-cyber-blue/30',
    purple: 'bg-cyber-purple-dark hover:bg-cyber-purple text-white shadow-md border border-cyber-purple/30',
    danger: 'bg-cyber-red-dark hover:bg-cyber-red text-white shadow-md border border-cyber-red/30',
    glass: 'bg-white/80 hover:bg-white text-graphite border-slate-200 hover:border-cyber-gold/30 shadow-sm',
    outline: 'border border-cyber-gold/50 hover:border-cyber-gold-dark bg-cyber-gold/5 hover:bg-cyber-gold/10 text-cyber-gold-dark font-semibold',
  };

  const handleClick = (e) => {
    if (disabled) return;
    playChime('click');
    if (onClick) onClick(e);
  };

  return (
    <motion.button
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: smoothX, y: smoothY }}
      whileHover={disabled ? {} : { scale: 1.01 }} // Softer hover
      whileTap={disabled ? {} : { scale: 0.99 }} // Softer tap
      transition={{ type: 'spring', stiffness: 300, damping: 25 }} // Smoother spring
      disabled={disabled}
      onClick={handleClick}
      className={clsx(
        'inline-flex items-center justify-center transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-cyber-gold/50',
        sizeClasses[size] || sizeClasses.md,
        variantClasses[variant] || variantClasses.primary,
        disabled && 'opacity-50 cursor-not-allowed filter grayscale',
        className
      )}
      {...props}
    >
      {Icon && iconPosition === 'left' && <Icon className="w-4 h-4 shrink-0" />}
      <span>{children}</span>
      {Icon && iconPosition === 'right' && <Icon className="w-4 h-4 shrink-0" />}
    </motion.button>
  );
};
