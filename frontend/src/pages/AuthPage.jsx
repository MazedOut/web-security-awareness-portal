import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Lock, 
  Mail, 
  User, 
  ArrowRight, 
  Eye, 
  EyeOff, 
  Sparkles 
} from 'lucide-react';
import { motion } from 'framer-motion';
import { GlassCard } from '../components/common/GlassCard';
import { AnimatedButton } from '../components/common/AnimatedButton';
import { ChakravyuhLogo } from '../components/common/ChakravyuhLogo';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

const DEMO_CREDENTIALS = {
  email: 'guardian@chakravyuh.safe',
  password: 'chakravyuh2026'
};

export const AuthPage = () => {
  const [email, setEmail] = useState(DEMO_CREDENTIALS.email);
  const [password, setPassword] = useState(DEMO_CREDENTIALS.password);
  const [showPassword, setShowPassword] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login, register, loginAsGuest } = useAuth();
  const { lang } = useLanguage();
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      if (isRegister) {
        register(name || 'Cyber Sentinel', email || DEMO_CREDENTIALS.email, password);
      } else {
        login(email || DEMO_CREDENTIALS.email, password);
      }
      navigate('/landing');
    }, 300);
  };

  const handleDemoLogin = () => {
    setEmail(DEMO_CREDENTIALS.email);
    setPassword(DEMO_CREDENTIALS.password);
    setIsLoading(true);
    setTimeout(() => {
      loginAsGuest();
      navigate('/landing');
    }, 250);
  };

  return (
    <div className="relative min-h-[85vh] flex items-center justify-center px-4 py-10 overflow-hidden">
      
      {/* ========================================================================= */}
      {/* FRAMER MOTION MOVING GRADIENT BACKGROUND                                  */}
      {/* ========================================================================= */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        
        {/* Animated Moving Orb 1: Amber / Cyber Gold */}
        <motion.div
          animate={{
            x: [-50, 70, -30, 60, -50],
            y: [-30, 60, -50, 30, -30],
            scale: [1, 1.2, 0.95, 1.1, 1],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute -top-28 -left-28 w-[480px] h-[480px] rounded-full bg-gradient-to-br from-amber-500/20 via-yellow-500/15 to-orange-500/10 blur-[90px]"
        />

        {/* Animated Moving Orb 2: Purple / Cyber Indigo */}
        <motion.div
          animate={{
            x: [50, -60, 40, -50, 50],
            y: [40, -50, 50, -30, 40],
            scale: [1.1, 0.95, 1.2, 1, 1.1],
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute -bottom-32 -right-32 w-[520px] h-[520px] rounded-full bg-gradient-to-tl from-purple-700/20 via-indigo-600/15 to-blue-600/10 blur-[100px]"
        />

        {/* Animated Moving Orb 3: Cyan / Teal Accent */}
        <motion.div
          animate={{
            x: [-20, 30, -40, 20, -20],
            y: [30, -30, 20, -40, 30],
            scale: [0.95, 1.15, 0.95],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[350px] rounded-full bg-gradient-to-r from-teal-500/10 via-cyan-500/10 to-indigo-500/10 blur-[110px]"
        />

        {/* Subtle Radial Shift */}
        <motion.div
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="absolute inset-0 opacity-30 bg-[radial-gradient(ellipse_at_center,_rgba(245,158,11,0.06)_0%,_rgba(139,92,246,0.06)_50%,_transparent_75%)] bg-[length:200%_200%]"
        />
      </div>

      {/* ========================================================================= */}
      {/* MINIMAL LOGIN CARD                                                        */}
      {/* ========================================================================= */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-md"
      >
        <GlassCard 
          variant="glow" 
          glowColor="gold" 
          className="w-full p-7 sm:p-8 space-y-6 border border-cyber-gold/25 bg-white/95 backdrop-blur-xl shadow-2xl rounded-3xl"
        >

          {/* Header */}
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyber-gold-light via-cyber-gold/25 to-cyber-gold/10 border border-cyber-gold/30 flex items-center justify-center mx-auto shadow-sm">
              <ChakravyuhLogo className="w-9 h-9 text-cyber-gold-dark" glow={false} />
            </div>

            <div>
              <h1 className="text-2xl font-extrabold font-display text-graphite">
                {isRegister
                  ? (lang === 'hi' ? 'नया रक्षक खाता बनाएं' : 'Create Defender Account')
                  : (lang === 'hi' ? 'चक्रव्यूह में लॉगिन करें' : 'Sign in to Chakravyuh')}
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                {lang === 'hi'
                  ? 'अपनी साइबर सुरक्षा जागरूकता प्रगति को ट्रैक करें।'
                  : 'Access the cybersecurity awareness and defense portal.'}
              </p>
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            
            {isRegister && (
              <div className="space-y-1 text-left">
                <label className="text-xs font-bold text-slate-700">Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Cyber Sentinel"
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-graphite placeholder-slate-400 text-xs focus:outline-none focus:border-cyber-gold focus:ring-1 focus:ring-cyber-gold/20 shadow-inner"
                  />
                </div>
              </div>
            )}

            {/* Email Field */}
            <div className="space-y-1 text-left">
              <label className="text-xs font-bold text-slate-700">Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="guardian@chakravyuh.safe"
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-graphite placeholder-slate-400 text-xs focus:outline-none focus:border-cyber-gold focus:ring-1 focus:ring-cyber-gold/20 shadow-inner font-medium"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1 text-left">
              <label className="text-xs font-bold text-slate-700">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-9 pr-10 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-graphite placeholder-slate-400 text-xs focus:outline-none focus:border-cyber-gold focus:ring-1 focus:ring-cyber-gold/20 shadow-inner font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Primary Sign In Button */}
            <div className="pt-2">
              <AnimatedButton 
                type="submit" 
                variant="primary" 
                size="md" 
                className="w-full justify-center shadow-md font-bold"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
                    Signing in...
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5">
                    {isRegister ? 'Create Account' : 'Sign In'}
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </span>
                )}
              </AnimatedButton>
            </div>
          </form>

          {/* ========================================================================= */}
          {/* SINGLE MINIMAL DEMO OPTION                                                */}
          {/* ========================================================================= */}
          <div className="pt-2 border-t border-slate-100 space-y-3 text-center">
            <button
              type="button"
              onClick={handleDemoLogin}
              disabled={isLoading}
              className="w-full py-2 px-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-900 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 border border-slate-200"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Continue with Demo Account</span>
            </button>

            <p className="text-xs text-slate-500">
              {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
              <button
                type="button"
                onClick={() => setIsRegister(!isRegister)}
                className="text-cyber-gold-dark font-bold hover:underline ml-1"
              >
                {isRegister ? 'Sign in' : 'Register'}
              </button>
            </p>
          </div>

        </GlassCard>
      </motion.div>

    </div>
  );
};
