import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Award, 
  ShieldCheck, 
  Zap, 
  CheckCircle2, 
  Lock, 
  KeyRound, 
  MailCheck, 
  Printer, 
  Download, 
  Sparkles,
  Check,
  RotateCcw
} from 'lucide-react';
import { GlassCard } from '../components/common/GlassCard';
import { AnimatedButton } from '../components/common/AnimatedButton';
import { ProgressBar } from '../components/common/ProgressBar';
import { Badge } from '../components/common/Badge';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

export const ProfilePage = () => {
  const { user, getRankTitle, toggleChecklistItem } = useAuth();
  const { lang, t } = useLanguage();
  const [isCertificateGenerated, setIsCertificateGenerated] = useState(false);

  const rankInfo = getRankTitle(user.awarenessScore);

  const handlePrintCertificate = () => {
    window.print();
  };

  const badgeIcons = {
    Shield: ShieldCheck,
    MailCheck: MailCheck,
    KeyRound: KeyRound,
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      
      {/* Header Profile Card */}
      <GlassCard variant="glow" glowColor="gold" className="p-6 sm:p-8 border border-cyber-gold/20 shadow-md bg-white/80">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-cyber-gold-light to-cyber-gold p-0.5 shadow-sm flex items-center justify-center">
              <div className="w-full h-full bg-white rounded-2xl flex items-center justify-center text-cyber-gold-dark font-extrabold text-2xl font-display">
                {user.name.charAt(0)}
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-bold font-display text-graphite">{user.name}</h1>
                <Badge variant="gold">Lvl {user.level}</Badge>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-0.5">{user.email}</p>
              <p className="text-xs font-bold text-cyber-green mt-1 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Rank: {rankInfo.title}
              </p>
            </div>
          </div>

          {/* XP Level Progress Bar */}
          <div className="w-full sm:w-72 space-y-2 bg-slate-50 p-4 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-slate-600">Level {user.level} Progress</span>
              <span className="font-bold text-cyber-gold-dark">{user.xp} / {user.xpNextLevel} XP</span>
            </div>
            <ProgressBar
              value={user.xp}
              max={user.xpNextLevel}
              color="gold"
              showPercentage={false}
            />
          </div>
        </div>
      </GlassCard>

      {/* Badges & Checklist Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Badges & Achievements Showcase */}
        <div className="lg:col-span-6 space-y-5">
          <h3 className="font-bold text-lg text-graphite font-display flex items-center gap-2">
            <Award className="w-5 h-5 text-cyber-gold" />
            {lang === 'hi' ? 'अर्जित सुरक्षा बैज एवं उपलब्धियां' : 'Earned Badges & Defensive Accolades'}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {user.badges?.map((badge) => {
              const IconComponent = badgeIcons[badge.icon] || Award;
              return (
                <GlassCard key={badge.id} variant="default" className="p-4 space-y-3 border border-slate-200 bg-white shadow-sm hover:border-cyber-gold/30">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-cyber-gold/10 border border-cyber-gold/20 flex items-center justify-center text-cyber-gold-dark">
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <Badge variant="green" size="sm">Unlocked</Badge>
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-graphite">{badge.name}</h4>
                    <p className="text-xs text-slate-500 mt-1 leading-snug font-medium">{badge.description}</p>
                    <span className="text-[10px] text-slate-400 font-semibold mt-2 block">
                      Awarded on {badge.unlockedAt}
                    </span>
                  </div>
                </GlassCard>
              );
            })}
          </div>

          {/* Certificate Generation Action */}
          <GlassCard variant="subtle" className="p-6 space-y-4 border border-graphite-border text-center flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-cyber-gold/10 border border-cyber-gold/30 flex items-center justify-center mb-2">
              <Sparkles className="w-8 h-8 text-cyber-gold" />
            </div>
            <div>
              <h4 className="font-bold text-lg text-graphite font-display">
                {lang === 'hi' ? 'डिजिटल सुरक्षा तत्परता प्रमाणपत्र' : 'Certificate of Digital Cyber Readiness'}
              </h4>
              <p className="text-sm text-slate-500 mt-2 max-w-md mx-auto">
                Demonstrating high-standard awareness in phishing detection, password entropy, and safe browsing.
              </p>
            </div>
            <div className="pt-2">
              <AnimatedButton
                variant="primary"
                size="lg"
                icon={Printer}
                onClick={() => setIsCertificateGenerated(!isCertificateGenerated)}
                className="w-full sm:w-auto shadow-md"
              >
                {isCertificateGenerated ? 'Hide Certificate' : 'Generate Printable Certificate'}
              </AnimatedButton>
            </div>
          </GlassCard>
        </div>

        {/* Right Column: Personal Security Hardening Checklist */}
        <div className="lg:col-span-6 space-y-5">
          <h3 className="font-bold text-lg text-graphite font-display flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-cyber-green" />
            {lang === 'hi' ? 'व्यक्तिगत साइबर सुरक्षा चेकलिस्ट' : 'Personal Security Hardening Checklist'}
          </h3>

          <GlassCard variant="default" className="p-6 space-y-3 border-slate-200 bg-white">
            <p className="text-xs text-slate-500 pb-2 font-medium">
              Mark off recommended digital hygiene habits to improve your real-world defenses:
            </p>

            <div className="space-y-2.5">
              {user.checklist?.map((item) => (
                <div
                  key={item.id}
                  onClick={() => toggleChecklistItem(item.id)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                    item.done
                      ? 'bg-cyber-green/5 border-cyber-green/20 text-slate-700'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-cyber-gold/30 hover:bg-white shadow-sm'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 border transition-colors ${
                    item.done
                      ? 'bg-cyber-green-dark border-cyber-green text-white'
                      : 'bg-white border-slate-300'
                  }`}>
                    {item.done && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                  <div className="space-y-0.5">
                    <p className={`text-sm font-semibold ${item.done ? 'text-slate-400 line-through' : 'text-graphite'}`}>
                      {item.title}
                    </p>
                    <Badge variant={item.done ? 'green' : 'gray'} size="sm">
                      {item.category}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>

      </div>

      {/* Printable Digital Certificate Component */}
      {isCertificateGenerated && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-800/80 backdrop-blur-sm no-print">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="print-only relative w-full max-w-4xl bg-white p-12 text-center space-y-8 shadow-2xl overflow-hidden border border-slate-200"
          >
            {/* Heritage Border / Kashmiri Shawl Border */}
            <div className="absolute inset-4 border-2 border-cyber-gold/40 pointer-events-none" />
            <div className="absolute inset-[18px] border border-cyber-gold/20 pointer-events-none" />
            
            {/* Decorative Corner Accents */}
            <div className="absolute top-4 left-4 w-16 h-16 bg-cyber-gold/10" style={{ clipPath: 'polygon(0 0, 100% 0, 0 100%)' }} />
            <div className="absolute top-4 right-4 w-16 h-16 bg-cyber-gold/10" style={{ clipPath: 'polygon(100% 0, 100% 100%, 0 0)' }} />
            <div className="absolute bottom-4 left-4 w-16 h-16 bg-cyber-gold/10" style={{ clipPath: 'polygon(0 0, 100% 100%, 0 100%)' }} />
            <div className="absolute bottom-4 right-4 w-16 h-16 bg-cyber-gold/10" style={{ clipPath: 'polygon(100% 100%, 0 100%, 100% 0)' }} />

            <div className="space-y-3 relative z-10 pt-8">
              <span className="text-sm uppercase font-extrabold tracking-widest text-cyber-gold-dark">
                CHAKRAVYUH CYBER DEFENSE ECOSYSTEM
              </span>
              <h2 className="text-4xl sm:text-5xl font-extrabold font-display text-slate-900 leading-tight">
                Certificate of Digital Safety Readiness
              </h2>
              <p className="text-base text-slate-600 font-medium italic">This is proudly awarded to</p>
            </div>

            <div className="py-4 relative z-10">
              <h3 className="text-4xl sm:text-5xl font-extrabold text-cyber-gold-dark font-display border-b-2 border-cyber-gold/30 pb-3 inline-block px-12">
                {user.name}
              </h3>
            </div>

            <p className="max-w-2xl mx-auto text-base text-slate-700 leading-relaxed relative z-10">
              for successfully demonstrating advanced awareness in Phishing link identification, NIST Password Entropy standards, and Social Engineering scam recognition with an Awareness Score of <strong className="text-cyber-green-dark">{user.awarenessScore}/1000</strong>.
            </p>

            <div className="flex items-center justify-between max-w-2xl mx-auto pt-12 text-sm text-slate-600 relative z-10">
              <div className="text-left">
                <span className="block font-bold text-slate-900 text-lg">Chakravyuh Security Council</span>
                <span className="font-mono text-xs">Verification ID: #CHK-2026-9810</span>
              </div>
              <div className="text-right">
                <span className="block font-bold text-cyber-green-dark text-lg">{rankInfo.title}</span>
                <span className="font-mono text-xs">Status: Certified Safe</span>
              </div>
            </div>

            <div className="absolute top-4 right-4 no-print z-50">
               <button onClick={() => setIsCertificateGenerated(false)} className="p-2 bg-slate-100 rounded-full text-slate-500 hover:text-slate-900 transition-colors shadow-sm">
                 <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
               </button>
            </div>

            <div className="pt-8 no-print flex justify-center gap-4 relative z-10 pb-8">
              <AnimatedButton variant="outline" size="md" onClick={() => setIsCertificateGenerated(false)}>
                Cancel
              </AnimatedButton>
              <AnimatedButton variant="primary" size="md" icon={Printer} onClick={handlePrintCertificate}>
                Print & Download Certificate
              </AnimatedButton>
            </div>
          </motion.div>
        </div>
      )}

    </div>
  );
};
