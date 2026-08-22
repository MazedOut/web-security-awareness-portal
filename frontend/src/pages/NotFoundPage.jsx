import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { GlassCard } from '../components/common/GlassCard';
import { AnimatedButton } from '../components/common/AnimatedButton';

export const NotFoundPage = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <GlassCard variant="glow" glowColor="red" className="max-w-md text-center p-8 space-y-4 border border-cyber-red/20 bg-white shadow-xl">
        <div className="w-16 h-16 rounded-2xl bg-cyber-red/10 border border-cyber-red/20 flex items-center justify-center mx-auto text-cyber-red-dark">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h1 className="text-4xl font-bold font-display text-graphite">404</h1>
        <h2 className="text-lg font-bold text-slate-700">Security Perimeter Boundary Reached</h2>
        <p className="text-sm text-slate-500 font-medium">
          The node or resource you are looking for has been moved or does not exist in the defense registry.
        </p>
        <div className="pt-2">
          <Link to="/">
            <AnimatedButton variant="primary" size="md" icon={ArrowLeft}>
              Return to Safe Harbor
            </AnimatedButton>
          </Link>
        </div>
      </GlassCard>
    </div>
  );
};
