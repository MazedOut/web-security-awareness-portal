import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Flame, 
  Bug, 
  Lock, 
  KeyRound, 
  Globe, 
  Users, 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight,
  Gamepad2,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { GlassCard } from '../components/common/GlassCard';
import { AnimatedButton } from '../components/common/AnimatedButton';
import { Badge } from '../components/common/Badge';
import { HeritageSeparator } from '../components/common/HeritageSeparator';
import { useLanguage } from '../context/LanguageContext';
import { threatService } from '../services/threatService';

export const ThreatIntelPage = () => {
  const { lang, t } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [threats, setThreats] = useState([]);
  const [selectedThreat, setSelectedThreat] = useState(null);

  useEffect(() => {
    threatService.getAllThreats().then((data) => {
      setThreats(data);
      const paramId = searchParams.get('id');
      if (paramId) {
        const found = data.find((t) => t.id === paramId);
        if (found) {
          setSelectedThreat(found);
          return;
        }
      }
      if (data.length > 0 && !selectedThreat) {
        setSelectedThreat(data[0]);
      }
    });
  }, [searchParams]);

  const iconMap = {
    Bug: Bug,
    Flame: Flame,
    Lock: Lock,
    KeyRound: KeyRound,
    Globe: Globe,
    Users: Users,
    ShieldAlert: ShieldAlert,
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 relative z-10">
      
      {/* Header */}
      <HeritageSeparator className="my-2" />
      <GlassCard variant="default" className="p-6 sm:p-8 space-y-3 bg-white border border-slate-200">
        <div className="flex items-center gap-2">
          <Badge variant="red">Threat Intelligence Encyclopedia</Badge>
          <Badge variant="gold">Real-World Case Studies</Badge>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold font-display text-graphite mt-2">
          {lang === 'hi' ? 'साइबर खतरे (Threat Intelligence) एवं विश्लेषण' : 'Threat Intelligence & Attack Breakdown'}
        </h1>
        <p className="text-sm text-slate-600 max-w-3xl leading-relaxed font-medium">
          {lang === 'hi'
            ? 'मालवेयर, फिशिंग, रैनसमवेयर, और सोशल इंजीनियरिंग जैसे प्रमुख साइबर खतरों का तकनीकी और व्यावहारिक विश्लेषण।'
            : 'Deconstruct the mechanics, Indicators of Compromise (IoCs), and frontline defenses of modern cyber threats.'}
        </p>
      </GlassCard>

      {/* Main Threat Navigator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Threat Directory List */}
        <div className="lg:col-span-4 space-y-2.5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Threat Catalog ({threats.length})
          </h3>

          <div className="space-y-2">
            {threats.map((th) => {
              const Icon = iconMap[th.icon] || Flame;
              const isSelected = selectedThreat?.id === th.id;

              return (
                <div
                  key={th.id}
                  onClick={() => {
                    setSelectedThreat(th);
                    setSearchParams({ id: th.id });
                  }}
                  className={`p-3.5 rounded-2xl cursor-pointer border transition-all flex items-center justify-between shadow-sm ${
                    isSelected
                      ? 'bg-cyber-red/5 border-cyber-red/30'
                      : 'bg-white border-slate-200 hover:border-cyber-red/20'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl border ${
                      isSelected ? 'bg-cyber-red/10 text-cyber-red-dark border-cyber-red/20' : 'bg-slate-50 text-slate-500 border-slate-200'
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className={`text-xs font-bold ${isSelected ? 'text-cyber-red-dark' : 'text-graphite'}`}>
                        {lang === 'hi' && th.nameHi ? th.nameHi : th.name}
                      </p>
                      <p className="text-[11px] text-slate-500 font-medium">Severity: {th.severity}</p>
                    </div>
                  </div>
                  <Badge variant={th.badgeColor || 'red'} size="sm">
                    {th.severity}
                  </Badge>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Threat Deep-Dive Dossier */}
        <div className="lg:col-span-8 space-y-6">
          {selectedThreat && (
            <GlassCard variant="default" className="p-6 sm:p-8 space-y-6 bg-white border border-slate-200 shadow-sm">
              
              {/* Threat Header */}
              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-2xl bg-cyber-red/10 border border-cyber-red/20 text-cyber-red-dark">
                    <Flame className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold font-display text-graphite">
                      {lang === 'hi' && selectedThreat.nameHi ? selectedThreat.nameHi : selectedThreat.name}
                    </h2>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">Threat Classification: {selectedThreat.id}</p>
                  </div>
                </div>

                <Badge variant={selectedThreat.badgeColor || 'red'}>
                  {selectedThreat.severity} Severity Threat
                </Badge>
              </div>

              {/* 1. What Is It? */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-cyber-gold-dark">
                  {lang === 'hi' ? '1. यह क्या है? (What is it?)' : '1. Core Definition & Overview'}
                </h3>
                <p className="text-sm text-slate-600 font-medium leading-relaxed">
                  {lang === 'hi' && selectedThreat.whatIsItHi ? selectedThreat.whatIsItHi : selectedThreat.whatIsIt}
                </p>
              </div>

              {/* 2. How Attackers Execute It */}
              <div className="space-y-3 pt-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-cyber-blue-dark">
                  {lang === 'hi' ? '2. हमला कैसे काम करता है? (Attack Mechanics)' : '2. Attack Execution Chain'}
                </h3>
                <div className="space-y-2">
                  {(lang === 'hi' && selectedThreat.howItWorksHi ? selectedThreat.howItWorksHi : selectedThreat.howItWorks)?.map((step, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-2.5 text-xs text-slate-600 font-medium shadow-sm">
                      <span className="w-5 h-5 rounded-md bg-cyber-blue/10 text-cyber-blue-dark flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 3. Real-World Case Study */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-cyber-red/5 to-white border border-cyber-red/20 space-y-2 shadow-sm">
                <span className="text-xs font-bold text-cyber-red-dark uppercase tracking-wider block">
                  3. Real-World Incident Case Study:
                </span>
                <p className="text-sm text-slate-600 font-medium leading-relaxed italic">
                  "{lang === 'hi' && selectedThreat.realWorldExampleHi ? selectedThreat.realWorldExampleHi : selectedThreat.realWorldExample}"
                </p>
              </div>

              {/* 4. Warning Signs */}
              <div className="space-y-2 pt-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-cyber-red-dark">
                  4. Red Flags & Indicators of Compromise (IoCs)
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {selectedThreat.warningSigns?.map((sign, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-2 text-xs text-slate-600 font-medium shadow-sm">
                      <AlertTriangle className="w-3.5 h-3.5 text-cyber-red shrink-0 mt-0.5" />
                      <span>{sign}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 5. Protection Checklist */}
              <div className="space-y-2 pt-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-cyber-green-dark">
                  5. Actionable Defense & Hardening Steps
                </h3>
                <div className="space-y-2">
                  {selectedThreat.protectionMethods?.map((step, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-cyber-green/5 border border-cyber-green/20 flex items-start gap-2.5 text-xs text-cyber-green-dark font-medium shadow-sm">
                      <CheckCircle2 className="w-4 h-4 text-cyber-green shrink-0 mt-0.5" />
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Try in Simulator Button */}
              {selectedThreat.simLink && (
                <div className="pt-4 border-t border-slate-100 flex justify-end">
                  <AnimatedButton
                    variant="primary"
                    size="md"
                    icon={Gamepad2}
                    onClick={() => navigate(selectedThreat.simLink)}
                  >
                    Test in Security Simulator ➔
                  </AnimatedButton>
                </div>
              )}

            </GlassCard>
          )}
        </div>

      </div>

    </div>
  );
};
