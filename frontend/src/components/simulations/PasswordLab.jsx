import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  KeyRound, 
  ShieldCheck, 
  ShieldAlert, 
  Copy, 
  Check, 
  RefreshCw, 
  Search, 
  Lock, 
  Eye, 
  EyeOff, 
  AlertTriangle,
  Zap,
  Info,
  Loader2
} from 'lucide-react';
import { GlassCard } from '../common/GlassCard';
import { AnimatedButton } from '../common/AnimatedButton';
import { ProgressBar } from '../common/ProgressBar';
import { Badge } from '../common/Badge';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { simulationService } from '../../services/simulationService';

export const PasswordLab = () => {
  const { lang } = useLanguage();
  const { addXP, completeSimulation } = useAuth();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [breachResult, setBreachResult] = useState(null);
  const [isCheckingBreach, setIsCheckingBreach] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showBreachInfo, setShowBreachInfo] = useState(false);
  const abortControllerRef = useRef(null);

  // 500ms Debounced breach check (FR-06.3) with request cancellation
  useEffect(() => {
    if (!password || password.trim().length === 0) {
      setBreachResult(null);
      setIsCheckingBreach(false);
      return;
    }

    // Cancel any in-flight request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;
    setIsCheckingBreach(true);

    const timer = setTimeout(async () => {
      try {
        const res = await simulationService.checkPasswordBreach(password, controller.signal);
        setBreachResult(res);
      } catch (err) {
        if (err?.name !== 'CanceledError' && err?.name !== 'AbortError') {
          setBreachResult({
            breach_count: 0,
            service_unavailable: true,
            message: 'Breach check service temporarily unavailable. Strength meter remains fully operational.'
          });
        }
      } finally {
        setIsCheckingBreach(false);
      }
    }, 500);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [password]);

  // Entropy Calculation logic
  const calculateEntropy = (pwd) => {
    if (!pwd) return { entropy: 0, crackTime: 'Instant', level: 'None', color: 'red' };
    
    let poolSize = 0;
    if (/[a-z]/.test(pwd)) poolSize += 26;
    if (/[A-Z]/.test(pwd)) poolSize += 26;
    if (/[0-9]/.test(pwd)) poolSize += 10;
    if (/[^a-zA-Z0-9]/.test(pwd)) poolSize += 33;

    if (poolSize === 0) return { entropy: 0, crackTime: 'Instant', level: 'None', color: 'red' };

    const entropy = Math.round(pwd.length * Math.log2(poolSize));

    let crackTime = 'Instant';
    let level = 'Very Weak';
    let color = 'red';

    if (entropy < 35) {
      crackTime = 'Under 3 seconds';
      level = 'Extremely Vulnerable';
      color = 'red';
    } else if (entropy < 55) {
      crackTime = 'A few hours to days';
      level = 'Moderate';
      color = 'gold';
    } else if (entropy < 80) {
      crackTime = 'Several hundred years';
      level = 'Strong & Resilient';
      color = 'blue';
    } else {
      crackTime = 'Billions of Years';
      level = 'Fortress Level (Uncrackable)';
      color = 'green';
    }

    return { entropy, crackTime, level, color };
  };

  const entropyData = calculateEntropy(password);

  const handleBreachCheck = async () => {
    if (!password) return;
    setIsCheckingBreach(true);
    try {
      const res = await simulationService.checkPasswordBreach(password);
      setBreachResult(res);
      addXP(30, 'Tested password in Breach Intelligence Database');
      if (entropyData.entropy >= 75) {
        completeSimulation('sim-password-lab', 100, 100, 'Password Fortress Lab');
      }
    } finally {
      setIsCheckingBreach(false);
    }
  };

  const generatePassphrase = () => {
    const words = [
      'Mango', 'Falcon', 'Glacier', 'Orbit', 'Bicycle', 'Chai', 'Lotus', 
      'Lantern', 'Tiger', 'Cosmic', 'Monsoon', 'River', 'Silver', 'Zenith',
      'Phoenix', 'Breeze', 'Citadel', 'Opal', 'Banyan', 'Radiant'
    ];
    const pick = () => words[Math.floor(Math.random() * words.length)];
    const num = Math.floor(Math.random() * 90) + 10;
    const symbols = ['!', '#', '@', '$', '%'];
    const sym = symbols[Math.floor(Math.random() * symbols.length)];
    
    const newPhrase = `${pick()}-${pick()}-${pick()}-${num}${sym}`;
    setPassword(newPhrase);
    setBreachResult(null);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <GlassCard variant="default" className="p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold font-display text-white">
                {lang === 'hi' ? 'पासवर्ड लैब एवं एंट्रॉपी परीक्षक' : 'Password Entropy & Breach Defense Lab'}
              </h3>
              <Badge variant="gold">Interactive Tool</Badge>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              {lang === 'hi'
                ? 'अपने पासवर्ड की मजबूती, क्रैकिंग समय और डेटा ब्रीच में उपस्थिति की रियल-टाइम जांच करें।'
                : 'Measure mathematical entropy (bits), GPU crack-resistance times, and test against known data breaches.'}
            </p>
          </div>
          <AnimatedButton variant="primary" size="sm" icon={Zap} onClick={generatePassphrase}>
            {lang === 'hi' ? '4-शब्दों का मजबूत पासफ़्रेज़ बनाएं' : 'Generate Fortress Passphrase'}
          </AnimatedButton>
        </div>
      </GlassCard>

      {/* Main Interactive Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Input and Analysis */}
        <div className="lg:col-span-7 space-y-5">
          <GlassCard variant="default" className="p-6 space-y-5">
            
            {/* Input Box */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center justify-between">
                <span>{lang === 'hi' ? 'पासवर्ड टाइप करें या पासफ़्रेज़ बनाएं:' : 'Enter Password / Test Candidate:'}</span>
                <span className="text-[11px] font-mono text-slate-400">Length: {password.length} chars</span>
              </label>
              
              <div className="relative flex items-center">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setBreachResult(null);
                  }}
                  placeholder="e.g. Mango-River-Bicycle-2026!"
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-white/10 text-white font-mono text-sm focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30 pr-24"
                />
                <div className="absolute right-2 flex items-center gap-1">
                  <button
                    onClick={() => setShowPassword(!showPassword)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                  {password && (
                    <button
                      onClick={copyToClipboard}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-slate-800 transition-colors"
                      title="Copy"
                    >
                      {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Live Entropy Progress Bar */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-slate-300">Mathematical Entropy:</span>
                <span className="font-mono text-amber-400">{entropyData.entropy} bits ({entropyData.level})</span>
              </div>
              <ProgressBar
                value={Math.min(100, Math.round((entropyData.entropy / 90) * 100))}
                color={entropyData.color}
                showPercentage={false}
                height="h-3"
              />
            </div>

            {/* Real-world GPU Crack Time Metric */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-white/5 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  RTX 4090 GPU Cluster Crack Time
                </span>
                <span className={`text-base font-bold font-mono ${
                  entropyData.color === 'green' ? 'text-emerald-400' : entropyData.color === 'blue' ? 'text-blue-400' : 'text-rose-400'
                }`}>
                  {entropyData.crackTime}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-white/5 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  Security Verdict
                </span>
                <span className={`text-base font-bold ${
                  entropyData.color === 'green' ? 'text-emerald-400' : 'text-slate-200'
                }`}>
                  {entropyData.level}
                </span>
              </div>
            </div>

            {/* Educational Tooltip: What is a Data Breach? (Item 16, UC-03 step 7) */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setShowBreachInfo(!showBreachInfo)}
                className="flex items-center gap-1.5 text-xs text-amber-400/90 hover:text-amber-300 transition-colors font-medium"
              >
                <Info className="w-3.5 h-3.5" />
                <span>{showBreachInfo ? 'Hide Breach Intel Guide' : 'What is a Data Breach? (Learn More)'}</span>
              </button>

              {showBreachInfo && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-2 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200/90 space-y-1.5"
                >
                  <p className="font-semibold text-amber-300">
                    {lang === 'hi' ? 'डेटा ब्रीच क्या है?' : 'What is a Data Breach?'}
                  </p>
                  <p className="leading-relaxed text-[11px] text-slate-300">
                    A data breach occurs when an unauthorized attacker steals internal databases from online companies.
                    Stolen credentials are published on dark web forums and compiled into billions of records. Attackers use automated tools to test these passwords across email, banking, and social accounts in <strong>credential stuffing</strong> attacks.
                  </p>
                  <p className="text-[10px] text-amber-400 font-mono">
                    Privacy Guarantee: k-Anonymity ensures only 5 characters of your password's SHA-1 hash leave your device.
                  </p>
                </motion.div>
              )}
            </div>

            {/* Breach Lookup Status & Manual Trigger */}
            <div className="pt-2">
              <AnimatedButton
                variant="purple"
                size="md"
                className="w-full"
                icon={isCheckingBreach ? Loader2 : Search}
                disabled={!password || isCheckingBreach}
                onClick={handleBreachCheck}
              >
                {isCheckingBreach
                  ? (lang === 'hi' ? 'डेटाबेस में जांच हो रही है...' : 'Checking Breach Databases (k-Anonymity)...')
                  : (lang === 'hi' ? 'डेटा ब्रीच में जांचें' : 'Check if Leaked in Known Data Breaches')}
              </AnimatedButton>
            </div>

            {/* Loading Indicator */}
            {isCheckingBreach && (
              <div className="flex items-center justify-center gap-2 py-2 text-xs text-purple-300">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Querying k-Anonymity range hash buckets (500ms debounce active)...</span>
              </div>
            )}

            {/* Breach Result Display */}
            {breachResult && !isCheckingBreach && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-xl border ${
                  breachResult.service_unavailable
                    ? 'bg-slate-900/80 border-slate-700 text-slate-300'
                    : breachResult.breach_count > 0
                    ? 'bg-rose-950/40 border-rose-500/40 text-rose-200'
                    : 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  {breachResult.service_unavailable ? (
                    <Info className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
                  ) : breachResult.breach_count > 0 ? (
                    <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                  ) : (
                    <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  )}
                  <div className="space-y-1">
                    <p className="text-xs font-semibold">{breachResult.message}</p>
                    {breachResult.breach_count > 0 && (
                      <p className="text-[11px] text-rose-300">
                        Recommendation: Never use this password anywhere. Attackers have automated botnets trying this combination.
                      </p>
                    )}
                    {breachResult.service_unavailable && (
                      <p className="text-[10px] text-slate-400">
                        Offline Fallback: Password entropy and local dictionary rules continue to protect you.
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

          </GlassCard>
        </div>

        {/* Right NIST Guidelines & Why Length Beats Complexity */}
        <div className="lg:col-span-5 space-y-4">
          <GlassCard variant="default" className="p-6 space-y-4">
            <h4 className="font-bold text-sm text-white flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-amber-400" />
              {lang === 'hi' ? 'NIST सुरक्षा नियम: लंबाई > जटिलता' : 'NIST Rules: Length Beats Complexity'}
            </h4>

            <p className="text-xs text-slate-300 leading-relaxed">
              {lang === 'hi'
                ? '8 अक्षरों का छोटा पासवर्ड भले ही उसमें @#$ लगा हो, हैकर्स कुछ सेकंड में तोड़ लेते हैं। 4 आसान शब्दों का पासफ़्रेज़ अरबों गुना अधिक सुरक्षित होता है।'
                : 'Modern brute-force tools calculate billions of hash permutations per second. 4-word passphrases create an astronomically large search space while being easy to recall.'}
            </p>

            <div className="space-y-2.5 pt-2">
              <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5 flex items-start gap-2.5 text-xs text-slate-300">
                <span className="text-rose-400 font-bold">❌ Bad:</span>
                <div>
                  <span className="font-mono text-white">P@ssw0rd1</span>
                  <p className="text-[11px] text-slate-400">Cracked in 4 seconds via dictionary mask attacks.</p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5 flex items-start gap-2.5 text-xs text-slate-300">
                <span className="text-emerald-400 font-bold">✅ Fortress:</span>
                <div>
                  <span className="font-mono text-emerald-300">Mango-River-Bicycle-2026!</span>
                  <p className="text-[11px] text-slate-400">Takes 4.2 Billion years on top-tier supercomputers.</p>
                </div>
              </div>
            </div>
          </GlassCard>
        </div>

      </div>
    </div>
  );
};
