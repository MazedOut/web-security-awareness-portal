import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  UserX, 
  Briefcase, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  PhoneCall,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { GlassCard } from '../common/GlassCard';
import { AnimatedButton } from '../common/AnimatedButton';
import { Badge } from '../common/Badge';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { simulationService } from '../../services/simulationService';

export const SocialEngineeringLab = () => {
  const { lang } = useLanguage();
  const { addXP, completeSimulation } = useAuth();
  const [scenarios, setScenarios] = useState([]);
  const [activeScenarioIndex, setActiveScenarioIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);

  useEffect(() => {
    simulationService.getSocialEngineeringScenarios().then((data) => {
      setScenarios(data);
    });
  }, []);

  const currentScenario = scenarios[activeScenarioIndex];

  const handleSelectOption = (opt) => {
    setSelectedOption(opt);
    if (opt.isCorrect) {
      addXP(60, `Passed Social Engineering scenario: ${currentScenario.title}`);
      completeSimulation(`sim-social-${currentScenario.id}`, 100, 100, 'Social Engineering Defense');
    }
  };

  const handleNextOrReset = () => {
    setSelectedOption(null);
    if (activeScenarioIndex + 1 < scenarios.length) {
      setActiveScenarioIndex(prev => prev + 1);
    } else {
      setActiveScenarioIndex(0);
    }
  };

  if (!currentScenario) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <GlassCard variant="default" className="p-6 bg-white border border-slate-200 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold font-display text-graphite">
                {lang === 'hi' ? 'सोशल इंजीनियरिंग एवं फर्जी कॉल सिम्युलेटर' : 'Social Engineering Dialogue Lab'}
              </h3>
              <Badge variant="purple">Branching Scenario</Badge>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-1">
              {lang === 'hi'
                ? 'साइबर ठगों के मनोवैज्ञानिक जाल, डिजिटल अरेस्ट और फर्जी अफसरों के कॉल्स का सामना करें।'
                : 'Experience real-time manipulation scenarios. Learn to recognize false authority, artificial urgency, and protect confidential info.'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {scenarios.map((sc, idx) => (
              <button
                key={sc.id}
                onClick={() => {
                  setActiveScenarioIndex(idx);
                  setSelectedOption(null);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all shadow-sm ${
                  activeScenarioIndex === idx
                    ? 'bg-cyber-gold text-white border-cyber-gold-dark font-bold'
                    : 'bg-white text-slate-500 border-slate-200 hover:border-cyber-gold/30'
                }`}
              >
                Case #{idx + 1}
              </button>
            ))}
          </div>
        </div>
      </GlassCard>

      {/* Main Dialogue Sandbox */}
      <GlassCard variant="default" className="p-6 lg:p-8 space-y-6 bg-white border border-slate-200 shadow-sm">
        
        {/* Scenario Title & Character Banner */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-inner">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-cyber-red/10 border border-cyber-red/20 flex items-center justify-center text-cyber-red-dark">
              <PhoneCall className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-graphite">{currentScenario.title}</h4>
              <p className="text-xs text-cyber-gold-dark font-bold">Interacting with: {currentScenario.character}</p>
            </div>
          </div>
          <Badge variant={currentScenario.difficulty === 'Advanced' ? 'red' : 'gold'}>
            {currentScenario.difficulty} Level
          </Badge>
        </div>

        {/* Incoming Threat Prompt Speech Bubble */}
        <div className="relative p-5 rounded-2xl bg-gradient-to-r from-cyber-red/5 to-white border border-cyber-red/20 text-slate-700 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-cyber-red/10 text-cyber-red-dark shrink-0">
              <UserX className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <span className="text-xs font-bold text-cyber-red-dark uppercase tracking-wider block">
                Caller / Imposter Statement:
              </span>
              <p className="text-sm font-medium leading-relaxed italic text-slate-700">
                "{currentScenario.initialPrompt}"
              </p>
            </div>
          </div>
        </div>

        {/* User Choice Selection */}
        {!selectedOption ? (
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              {lang === 'hi' ? 'आप क्या प्रतिक्रिया देंगे?' : 'How do you respond? Choose your defense strategy:'}
            </h4>

            <div className="space-y-2.5">
              {currentScenario.options.map((option, idx) => (
                <motion.div
                  key={option.id}
                  whileHover={{ scale: 1.01, x: 4 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => handleSelectOption(option)}
                  className="p-4 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 hover:border-cyber-gold/40 cursor-pointer transition-all flex items-start gap-3 group shadow-sm"
                >
                  <div className="w-6 h-6 rounded-lg bg-slate-100 group-hover:bg-cyber-gold group-hover:text-white flex items-center justify-center text-xs font-bold text-slate-500 transition-colors shrink-0 mt-0.5">
                    {String.fromCharCode(65 + idx)}
                  </div>
                  <p className="text-xs font-medium text-slate-600 group-hover:text-graphite leading-relaxed">
                    {option.text}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        ) : (
          /* Consequence & Outcome Feedback */
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`p-6 rounded-2xl border space-y-4 shadow-sm ${
              selectedOption.isCorrect
                ? 'bg-cyber-green/5 border-cyber-green/40 text-cyber-green-dark'
                : 'bg-cyber-red/5 border-cyber-red/40 text-cyber-red-dark'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {selectedOption.isCorrect ? (
                  <CheckCircle2 className="w-6 h-6 text-cyber-green-dark" />
                ) : (
                  <XCircle className="w-6 h-6 text-cyber-red-dark" />
                )}
                <h4 className="font-bold text-base text-graphite">
                  {selectedOption.isCorrect
                    ? (lang === 'hi' ? 'उत्कृष्ट सुरक्षा बचाव! (Attack Neutralized)' : 'Attack Neutralized! Safe Decision')
                    : (lang === 'hi' ? 'धोखे में फंस गए! (Fell for Scam)' : 'Manipulated! Severe Risk Incurred')}
                </h4>
              </div>
              <AnimatedButton size="sm" variant="glass" icon={RotateCcw} onClick={handleNextOrReset}>
                {activeScenarioIndex + 1 < scenarios.length ? 'Next Scenario ➔' : 'Replay Scenario'}
              </AnimatedButton>
            </div>

            <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-2 shadow-inner">
              <span className="text-xs font-bold text-cyber-gold-dark uppercase tracking-wider block">
                Caller Reaction / Branch Consequence:
              </span>
              <p className="text-xs text-slate-600 font-medium italic leading-relaxed">
                "{selectedOption.response}"
              </p>
            </div>

            <div className="text-xs leading-relaxed text-slate-600 font-medium">
              <span className="font-bold text-graphite">Debrief & Why: </span>
              {selectedOption.feedback}
            </div>
          </motion.div>
        )}

      </GlassCard>
    </div>
  );
};
