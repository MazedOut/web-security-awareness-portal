import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Gamepad2, 
  Mail, 
  KeyRound, 
  Users, 
  Globe, 
  Trophy, 
  Award,
  Sparkles
} from 'lucide-react';
import { GlassCard } from '../components/common/GlassCard';
import { Badge } from '../components/common/Badge';
import { PhishingSimulator } from '../components/simulations/PhishingSimulator';
import { PasswordLab } from '../components/simulations/PasswordLab';
import { SocialEngineeringLab } from '../components/simulations/SocialEngineeringLab';
import { UrlInspector } from '../components/simulations/UrlInspector';
import { QuizArena } from '../components/simulations/QuizArena';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

export const SimulationsPage = () => {
  const { lang, t } = useLanguage();
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const [activeTab, setActiveTab] = useState(() => {
    return searchParams.get('tab') || 'phishing';
  });

  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam) setActiveTab(tabParam);
  }, [searchParams]);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setSearchParams({ tab: tabId });
  };

  const tabs = [
    { id: 'phishing', label: '1. Phishing & Smishing Lab', labelHi: '1. फिशिंग एवं SMS लैब', icon: Mail },
    { id: 'password', label: '2. Password & Entropy Lab', labelHi: '2. पासवर्ड एवं एंट्रॉपी लैब', icon: KeyRound },
    { id: 'social-eng', label: '3. Social Engineering Sim', labelHi: '3. सोशल इंजीनियरिंग सिम', icon: Users },
    { id: 'url-inspector', label: '4. Fake Website & URL', labelHi: '4. फर्जी वेबसाइट व URL', icon: Globe },
    { id: 'quiz', label: '5. Cyber Mastery Arena', labelHi: '5. क्विज़ एवं चैलेंज एरिना', icon: Trophy },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      
      {/* Top Banner */}
      <GlassCard variant="default" className="p-6 sm:p-8 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Badge variant="purple">Dedicated Simulation Center</Badge>
              <Badge variant="green">Zero Risk Sandbox</Badge>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold font-display text-graphite mt-2">
              {lang === 'hi' ? 'इंटरैक्टिव साइबर सुरक्षा सिम्युलेटर लैब' : 'Interactive Cybersecurity Defense Labs'}
            </h1>
            <p className="text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
              {lang === 'hi'
                ? 'सिद्धांत से परे: असली जैसी दिखने वाली फिशिंग ईमेल, पासवर्ड क्रैकिंग और फर्जी कॉल परिदृश्यों का सुरक्षित अभ्यास करें।'
                : 'Hands-on experiential learning: Inspect deceptive emails, calculate password entropy, and defeat psychological manipulation in a safe simulated sandbox.'}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 shrink-0 text-center shadow-sm">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Completed Labs</span>
            <span className="text-2xl font-bold font-sans tabular-nums text-cyber-green-dark">
              {user.completedSims?.length || 0} / 5
            </span>
          </div>
        </div>

        {/* Tab Navigation Navigation Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pt-3 border-t border-slate-200 no-scrollbar">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 shadow-sm ${
                  isActive
                    ? 'bg-cyber-gold text-white border-cyber-gold/20'
                    : 'bg-white text-slate-600 hover:text-cyber-gold-dark border border-slate-200 hover:border-cyber-gold/30 hover:bg-slate-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{lang === 'hi' ? tab.labelHi : tab.label}</span>
              </button>
            );
          })}
        </div>
      </GlassCard>

      {/* Render Active Simulation Sandbox Component */}
      <div>
        {activeTab === 'phishing' && <PhishingSimulator />}
        {activeTab === 'password' && <PasswordLab />}
        {activeTab === 'social-eng' && <SocialEngineeringLab />}
        {activeTab === 'url-inspector' && <UrlInspector />}
        {activeTab === 'quiz' && <QuizArena />}
      </div>

    </div>
  );
};
