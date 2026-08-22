import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Lock, Mail, User, Sparkles, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard } from '../components/common/GlassCard';
import { AnimatedButton } from '../components/common/AnimatedButton';
import { Badge } from '../components/common/Badge';
import { ChakravyuhLogo } from '../components/common/ChakravyuhLogo';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, ease: 'easeOut', delay },
});

export const AuthPage = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, register, loginAsGuest } = useAuth();
  const { lang, t } = useLanguage();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isRegister) {
      register(name || 'Cyber Sentinel', email, password);
    } else {
      login(email || 'guardian@chakravyuh.safe', password);
    }
    navigate('/dashboard');
  };

  const handleGuestMode = () => {
    loginAsGuest();
    navigate('/dashboard');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      
      {/* Subtle ambient background */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 30%, rgba(188,142,75,0.06) 0%, transparent 70%)'
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        className="w-full max-w-md"
      >
        <GlassCard variant="glow" glowColor="gold" className="w-full p-6 sm:p-8 space-y-6 border border-cyber-gold/20 bg-white shadow-xl">

          {/* Brand Logo & Title */}
          <motion.div {...fadeUp(0.1)} className="text-center space-y-3">
            {/* Chakravyuh logo mark */}
            <motion.div
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, ease: 'easeOut', delay: 0.1 }}
              className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyber-gold-light to-cyber-gold/20 border border-cyber-gold/30 flex items-center justify-center mx-auto shadow-sm"
            >
              <ChakravyuhLogo className="w-8 h-8 text-cyber-gold-dark" glow={false} />
            </motion.div>
            <div>
              <h2 className="text-2xl font-bold font-display text-graphite">
                {isRegister
                  ? (lang === 'hi' ? 'नया रक्षक खाता बनाएं' : 'Create Defender Account')
                  : (lang === 'hi' ? 'चक्रव्यूह में स्वागत है' : 'Welcome to Chakravyuh')}
              </h2>
              <p className="text-sm text-slate-500 font-medium mt-1">
                {lang === 'hi'
                  ? 'अपनी साइबर सुरक्षा यात्रा और प्रगति को सुरक्षित रखें।'
                  : 'Protect your digital awareness progress and badge milestones.'}
              </p>
            </div>
          </motion.div>

          {/* Form */}
          <AnimatePresence mode="wait">
            <form onSubmit={handleSubmit} className="space-y-4">
              {isRegister && (
                <motion.div {...fadeUp(0.2)} className="space-y-1">
                  <label className="text-xs font-bold text-slate-600">Your Full Name</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Vikram Sharma"
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-graphite placeholder-slate-400 text-xs focus:outline-none focus:border-cyber-gold/50 focus:ring-1 focus:ring-cyber-gold/20 shadow-inner"
                    />
                  </div>
                </motion.div>
              )}

              <motion.div {...fadeUp(0.25)} className="space-y-1">
                <label className="text-xs font-bold text-slate-600">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="guardian@chakravyuh.safe"
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-graphite placeholder-slate-400 text-xs focus:outline-none focus:border-cyber-gold/50 focus:ring-1 focus:ring-cyber-gold/20 shadow-inner"
                  />
                </div>
              </motion.div>

              <motion.div {...fadeUp(0.3)} className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-600">Password</label>
                  {!isRegister && (
                    <button type="button" className="text-xs text-cyber-gold-dark font-semibold hover:underline">
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-graphite placeholder-slate-400 text-xs focus:outline-none focus:border-cyber-gold/50 focus:ring-1 focus:ring-cyber-gold/20 shadow-inner"
                  />
                </div>
              </motion.div>

              <motion.div {...fadeUp(0.35)}>
                <AnimatedButton type="submit" variant="primary" size="md" className="w-full">
                  {isRegister ? 'Register Defender Account' : 'Sign In to Chakravyuh ➔'}
                </AnimatedButton>
              </motion.div>
            </form>
          </AnimatePresence>

          {/* Quick Instant Guest Defender Mode */}
          <motion.div {...fadeUp(0.4)} className="pt-4 border-t border-slate-200 space-y-4 text-center">
            <button
              onClick={handleGuestMode}
              className="w-full py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-xs font-bold text-cyber-gold-dark hover:border-cyber-gold/30 transition-all flex items-center justify-center gap-1.5 shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{lang === 'hi' ? 'तुरंत गेस्ट मोड में शुरू करें' : 'Explore Instantly as Guest Defender'}</span>
            </button>

            <p className="text-xs font-medium text-slate-500">
              {isRegister ? 'Already have an account?' : "Don't have an account yet?"}{' '}
              <button
                onClick={() => setIsRegister(!isRegister)}
                className="text-cyber-gold-dark font-bold hover:underline ml-1"
              >
                {isRegister ? 'Login here' : 'Register now'}
              </button>
            </p>
          </motion.div>

        </GlassCard>
      </motion.div>
    </div>
  );
};
