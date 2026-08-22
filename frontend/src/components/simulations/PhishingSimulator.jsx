import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mail, 
  MessageSquare, 
  AlertTriangle, 
  ShieldCheck, 
  ShieldAlert, 
  Eye, 
  CheckCircle2, 
  XCircle, 
  Info, 
  ChevronRight,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { GlassCard } from '../common/GlassCard';
import { AnimatedButton } from '../common/AnimatedButton';
import { Badge } from '../common/Badge';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { simulationService } from '../../services/simulationService';

export const PhishingSimulator = () => {
  const { lang } = useLanguage();
  const { completeSimulation, addXP } = useAuth();
  const [emails, setEmails] = useState([]);
  const [smishMessages, setSmishMessages] = useState([]);
  const [activeTab, setActiveTab] = useState('email'); // 'email' or 'sms'
  const [selectedItem, setSelectedItem] = useState(null);
  const [showHeaders, setShowHeaders] = useState(false);
  const [userDecision, setUserDecision] = useState(null); // 'phish' or 'safe'
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    simulationService.getPhishingEmails().then((data) => {
      setEmails(data);
      if (data.length > 0) setSelectedItem(data[0]);
    });
    simulationService.getSmishingMessages().then((data) => {
      setSmishMessages(data);
    });
  }, []);

  const handleDecision = (decision) => {
    if (!selectedItem) return;
    setUserDecision(decision);
    const isPhishing = activeTab === 'email' ? selectedItem.isPhishing : selectedItem.isScam;
    const isCorrect = (decision === 'phish' && isPhishing) || (decision === 'safe' && !isPhishing);

    if (isCorrect) {
      addXP(50, `Correctly analyzed ${activeTab === 'email' ? 'email' : 'SMS'} security posture`);
      completeSimulation(`sim-${selectedItem.id}`, 100, 100, 'Phishing Inspection');
      setFeedback({
        status: 'correct',
        title: lang === 'hi' ? 'शानदार पहचान! (Correct Decision)' : 'Outstanding Analysis! Decision Correct',
        explanation: activeTab === 'email' ? selectedItem.explanation : selectedItem.advice,
        redFlags: selectedItem.redFlags || [],
      });
    } else {
      setFeedback({
        status: 'incorrect',
        title: lang === 'hi' ? 'गलत निर्णय - खतरा छूट गया! (Vulnerability Missed)' : 'Vulnerability Missed!',
        explanation: activeTab === 'email' ? selectedItem.explanation : selectedItem.advice,
        redFlags: selectedItem.redFlags || [],
      });
    }
  };

  const resetDecision = () => {
    setUserDecision(null);
    setFeedback(null);
    setShowHeaders(false);
  };

  return (
    <div className="space-y-6">
      {/* Simulation Header */}
      <GlassCard variant="default" className="p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold font-display text-white">
                {lang === 'hi' ? 'फिशिंग एवं फर्जी संदेश डिटेक्टर लैब' : 'Phishing & Smishing Inspection Lab'}
              </h3>
              <Badge variant="gold">Interactive Simulator</Badge>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              {lang === 'hi'
                ? 'ईमेल और संदेशों की जांच करें। हेडर, सेंडर डोमेन और छिपे हुए लिंक्स का विश्लेषण करके सही निर्णय लें।'
                : 'Inspect incoming emails and SMS messages. Spot deceptive sender domains, SPF failures, and fake urgent deadlines.'}
            </p>
          </div>

          {/* Inbox Channel Switcher */}
          <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-xl border border-white/10">
            <button
              onClick={() => {
                setActiveTab('email');
                if (emails.length > 0) setSelectedItem(emails[0]);
                resetDecision();
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                activeTab === 'email' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Mail className="w-3.5 h-3.5" /> Email Inbox ({emails.length})
            </button>
            <button
              onClick={() => {
                setActiveTab('sms');
                if (smishMessages.length > 0) setSelectedItem(smishMessages[0]);
                resetDecision();
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                activeTab === 'sms' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" /> SMS Vault ({smishMessages.length})
            </button>
          </div>
        </div>
      </GlassCard>

      {/* Main Two-Column Simulator Sandbox */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left List of Messages */}
        <div className="lg:col-span-4 space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            {activeTab === 'email' ? 'Incoming Emails' : 'Incoming SMS Messages'}
          </h4>

          <div className="space-y-2">
            {activeTab === 'email' &&
              emails.map((em) => (
                <div
                  key={em.id}
                  onClick={() => {
                    setSelectedItem(em);
                    resetDecision();
                  }}
                  className={`p-3.5 rounded-xl cursor-pointer border transition-all ${
                    selectedItem?.id === em.id
                      ? 'bg-amber-500/15 border-amber-500/40 shadow-sm'
                      : 'bg-slate-900/60 border-white/5 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-bold text-white truncate max-w-[170px]">{em.senderName}</span>
                    <span className="text-[10px] text-slate-400">{em.date}</span>
                  </div>
                  <p className="text-xs font-medium text-slate-200 truncate">{em.subject}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <Badge variant={em.difficulty === 'Beginner' ? 'green' : 'purple'} size="sm">
                      {em.difficulty}
                    </Badge>
                  </div>
                </div>
              ))}

            {activeTab === 'sms' &&
              smishMessages.map((sms) => (
                <div
                  key={sms.id}
                  onClick={() => {
                    setSelectedItem(sms);
                    resetDecision();
                  }}
                  className={`p-3.5 rounded-xl cursor-pointer border transition-all ${
                    selectedItem?.id === sms.id
                      ? 'bg-amber-500/15 border-amber-500/40 shadow-sm'
                      : 'bg-slate-900/60 border-white/5 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-bold text-amber-400 font-mono">{sms.sender}</span>
                    <Badge variant="blue" size="sm">SMS</Badge>
                  </div>
                  <p className="text-xs text-slate-300 line-clamp-2">{sms.text}</p>
                </div>
              ))}
          </div>
        </div>

        {/* Right Message Inspection Client */}
        <div className="lg:col-span-8 space-y-4">
          {selectedItem && (
            <GlassCard variant="default" className="p-6 space-y-5">
              
              {/* Message Details Header */}
              {activeTab === 'email' ? (
                <div className="pb-4 border-b border-white/10 space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-base font-bold text-white">{selectedItem.subject}</h3>
                      <p className="text-xs text-slate-300 mt-1">
                        From: <span className="font-semibold text-white">{selectedItem.senderName}</span>{' '}
                        <span className="font-mono text-amber-400 text-[11px]">&lt;{selectedItem.senderEmail}&gt;</span>
                      </p>
                    </div>
                    <button
                      onClick={() => setShowHeaders(!showHeaders)}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 text-[11px] text-slate-300 border border-white/10 hover:border-amber-500/30 transition-colors"
                    >
                      {showHeaders ? 'Hide Technical Headers' : 'Inspect Raw Headers (SPF/DKIM)'}
                    </button>
                  </div>

                  {/* Raw Email Headers Inspector */}
                  <AnimatePresence>
                    {showHeaders && selectedItem.headers && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-3 p-3 rounded-xl bg-slate-950 border border-white/10 font-mono text-[11px] text-slate-300 space-y-1 overflow-x-auto"
                      >
                        {Object.entries(selectedItem.headers).map(([key, val]) => (
                          <div key={key}>
                            <span className="text-amber-400">{key}:</span> {val}
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="pb-4 border-b border-white/10 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-400">SMS Sender ID:</span>
                    <h3 className="text-base font-bold text-amber-400 font-mono">{selectedItem.sender}</h3>
                  </div>
                  <Badge variant="purple">Mobile SMS Gateway</Badge>
                </div>
              )}

              {/* Render Message Body */}
              <div className="p-4 rounded-xl bg-white text-slate-950 shadow-inner min-h-[160px] overflow-x-auto">
                {activeTab === 'email' ? (
                  <div dangerouslySetInnerHTML={{ __html: selectedItem.bodyHtml }} />
                ) : (
                  <div className="font-sans text-sm font-medium text-slate-800 leading-relaxed">
                    {selectedItem.text}
                  </div>
                )}
              </div>

              {/* Decision Action Buttons */}
              {!feedback ? (
                <div className="pt-3 flex flex-wrap items-center justify-between gap-3">
                  <p className="text-xs font-semibold text-slate-300">
                    {lang === 'hi' ? 'इस संदेश का क्या निर्णय है?' : 'What is your security verdict?'}
                  </p>
                  <div className="flex items-center gap-3">
                    <AnimatedButton
                      variant="danger"
                      size="md"
                      icon={ShieldAlert}
                      onClick={() => handleDecision('phish')}
                    >
                      {lang === 'hi' ? '🚨 यह फर्जी / फिशिंग है' : '🚨 Flag as Phishing / Scam'}
                    </AnimatedButton>
                    <AnimatedButton
                      variant="success"
                      size="md"
                      icon={ShieldCheck}
                      onClick={() => handleDecision('safe')}
                    >
                      {lang === 'hi' ? '✅ यह सुरक्षित और असली है' : '✅ Mark as Legitimate & Safe'}
                    </AnimatedButton>
                  </div>
                </div>
              ) : (
                /* Feedback Analysis Result Box */
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={`p-5 rounded-2xl border ${
                    feedback.status === 'correct'
                      ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
                      : 'bg-rose-950/40 border-rose-500/40 text-rose-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {feedback.status === 'correct' ? (
                        <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                      ) : (
                        <XCircle className="w-6 h-6 text-rose-400" />
                      )}
                      <h4 className="font-bold text-base text-white">{feedback.title}</h4>
                    </div>
                    <AnimatedButton size="sm" variant="glass" icon={RotateCcw} onClick={resetDecision}>
                      Try Another
                    </AnimatedButton>
                  </div>

                  <p className="text-xs leading-relaxed mb-3 text-slate-200">{feedback.explanation}</p>

                  {feedback.redFlags.length > 0 && (
                    <div className="space-y-1.5 mt-3 pt-3 border-t border-white/10">
                      <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
                        Detected Red Flags:
                      </span>
                      {feedback.redFlags.map((flag, idx) => (
                        <div key={idx} className="flex items-start gap-1.5 text-xs text-slate-300">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                          <span>{flag}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

            </GlassCard>
          )}
        </div>

      </div>
    </div>
  );
};
