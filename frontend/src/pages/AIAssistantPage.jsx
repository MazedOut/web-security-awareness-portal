import React from 'react';
import { Bot, Sparkles, ShieldCheck, Globe2, PhoneCall, AlertTriangle } from 'lucide-react';
import { GlassCard } from '../components/common/GlassCard';
import { Badge } from '../components/common/Badge';
import { AIAssistantDrawer } from '../components/ai/AIAssistantDrawer';
import { useLanguage } from '../context/LanguageContext';

export const AIAssistantPage = () => {
  const { lang, t } = useLanguage();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      
      {/* Header */}
      <GlassCard variant="default" className="p-6 sm:p-8 space-y-3">
        <div className="flex items-center gap-2">
          <Badge variant="purple">Chakravyuh AI Security Companion</Badge>
          <Badge variant="blue">Multilingual Support (EN / HI / Hinglish)</Badge>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold font-display text-graphite mt-2">
          {lang === 'hi' ? 'चक्रव्यूह AI सुरक्षा सलाहकार स्टूडियो' : 'Chakravyuh AI Security Mentor Studio'}
        </h1>
        <p className="text-sm text-slate-600 max-w-3xl leading-relaxed">
          {lang === 'hi'
            ? 'किसी भी संदिग्ध मैसेज, कॉल, फ्रॉड या सुरक्षा समस्या के बारे में खुलकर पूछें। चक्रव्यूह AI आपको सरल भाषा में बिना कठिन शब्दों के सही सलाह देगा।'
            : 'Ask any cybersecurity question, paste suspicious SMS messages, or seek instant advice during a potential scam attempt. Powered by empathetic zero-jargon intelligence.'}
        </p>
      </GlassCard>

      {/* Main Fullscreen AI Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Fullscreen Chat Studio */}
        <div className="lg:col-span-8">
          <AIAssistantDrawer isFullscreen={true} />
        </div>

        {/* Right Defensive Guidelines & Emergency Quick Helpline */}
        <div className="lg:col-span-4 space-y-5">
          
          {/* Emergency Helpline Callout */}
          <GlassCard variant="subtle" className="p-5 space-y-3 bg-red-50/80 border border-red-200">
            <div className="flex items-center gap-2 text-red-600">
              <PhoneCall className="w-5 h-5 animate-bounce" />
              <h4 className="font-bold text-sm text-red-700">Emergency Hotline: 1930</h4>
            </div>
            <p className="text-xs text-red-600/80 leading-relaxed font-medium">
              {lang === 'hi'
                ? 'यदि आपके खाते से अनाधिकृत पैसे कट गए हैं, तो AI से पूछने के साथ-साथ तुरंत **1930** पर कॉल करें ताकि बैंक लेनदेन रोका जा सके।'
                : 'If you have experienced unauthorized financial debits within the last 2 hours, call **1930 immediately** to trigger bank fund freezes.'}
            </p>
            <a
              href="tel:1930"
              className="block text-center py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs tracking-wider transition-colors shadow-sm"
            >
              DIAL 1930 NOW
            </a>
          </GlassCard>

          {/* AI Security Capabilities & Guardrails */}
          <GlassCard variant="default" className="p-5 space-y-4">
            <h4 className="font-bold text-sm text-graphite flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-cyber-green-dark" />
              {lang === 'hi' ? 'चक्रव्यूह AI कैसे मदद कर सकता है:' : 'How Chakravyuh AI Helps:'}
            </h4>

            <ul className="space-y-3 text-xs text-slate-600">
              <li className="flex items-start gap-2.5">
                <span className="text-cyber-purple-dark font-bold mt-0.5">•</span>
                <span className="font-medium">Analyze suspicious SMS text for red flags</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-cyber-purple-dark font-bold mt-0.5">•</span>
                <span className="font-medium">Explain complex cybersecurity terms in Hinglish</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-cyber-purple-dark font-bold mt-0.5">•</span>
                <span className="font-medium">Generate easy memorable 4-word passphrases</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-cyber-purple-dark font-bold mt-0.5">•</span>
                <span className="font-medium">Step-by-step guidance if you clicked a bad link</span>
              </li>
            </ul>
          </GlassCard>

        </div>

      </div>

    </div>
  );
};
