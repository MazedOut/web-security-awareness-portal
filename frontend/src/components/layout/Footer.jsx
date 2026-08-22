import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, PhoneCall, Globe2, AlertTriangle, ExternalLink, Heart } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const Footer = () => {
  const { lang, t } = useLanguage();

  return (
    <footer className="mt-20 border-t border-white/10 glass-panel relative z-10">
      {/* Emergency Cyber Helpline Ribbon */}
      <div className="bg-gradient-to-r from-rose-950/60 via-slate-900/90 to-amber-950/60 border-b border-rose-500/20 py-3.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center space-x-2.5">
            <div className="p-1.5 rounded-lg bg-rose-500/20 border border-rose-500/40 text-rose-400">
              <PhoneCall className="w-4 h-4 animate-bounce" />
            </div>
            <div>
              <span className="text-xs font-bold text-white uppercase tracking-wider block">
                {lang === 'hi' ? 'राष्ट्रीय साइबर अपराध आपातकालीन हेल्पलाइन' : 'National Cyber Crime Emergency Helpline'}
              </span>
              <span className="text-xs text-slate-400">
                {lang === 'hi' ? 'वित्तीय धोखाधड़ी होने पर तुरंत 1930 पर कॉल करें (2 घंटे के अंदर)' : 'Report financial fraud within 2 hours for instant account freeze'}
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <a
              href="tel:1930"
              className="px-4 py-1.5 rounded-xl bg-rose-500 text-white font-extrabold text-sm tracking-wider hover:bg-rose-600 transition-colors shadow-red-glow"
            >
              CALL 1930
            </a>
            <a
              href="https://cybercrime.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-white/10 flex items-center gap-1.5 transition-colors"
            >
              cybercrime.gov.in <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Brand Column */}
        <div className="space-y-4 md:col-span-1">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center">
              <Shield className="w-4 h-4 text-amber-400" />
            </div>
            <span className="font-extrabold text-base font-display text-gradient-gold tracking-wide">
              {lang === 'hi' ? 'चक्रव्यूह' : 'CHAKRAVYUH'}
            </span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            {t.heroDescription}
          </p>
          <div className="flex items-center space-x-2 text-xs text-emerald-400 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Community Digital Safety Shield Active</span>
          </div>
        </div>

        {/* Quick Learning Tracks */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
            {lang === 'hi' ? 'जागरूकता विषय' : 'Awareness Hub'}
          </h4>
          <ul className="space-y-2 text-xs text-slate-400">
            <li><Link to="/articles" className="hover:text-amber-400 transition-colors">Web Security Basics</Link></li>
            <li><Link to="/articles" className="hover:text-amber-400 transition-colors">Phishing & Fake Messages</Link></li>
            <li><Link to="/articles" className="hover:text-amber-400 transition-colors">Password Hygiene & 2FA</Link></li>
            <li><Link to="/articles" className="hover:text-amber-400 transition-colors">Social Engineering Traps</Link></li>
            <li><Link to="/articles" className="hover:text-amber-400 transition-colors">Emerging AI Threats</Link></li>
          </ul>
        </div>

        {/* Interactive Tools */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
            {lang === 'hi' ? 'सुरक्षा टूल्स और लैब्स' : 'Interactive Labs'}
          </h4>
          <ul className="space-y-2 text-xs text-slate-400">
            <li><Link to="/simulations?tab=phishing" className="hover:text-amber-400 transition-colors">Phishing Email Inspector</Link></li>
            <li><Link to="/simulations?tab=password" className="hover:text-amber-400 transition-colors">Password Strength Lab</Link></li>
            <li><Link to="/simulations?tab=social-eng" className="hover:text-amber-400 transition-colors">Scam Dialogue Simulator</Link></li>
            <li><Link to="/network-lab" className="hover:text-amber-400 transition-colors">Network Data Visualizer</Link></li>
            <li><Link to="/statistics" className="hover:text-amber-400 transition-colors">Real-World Cyber Stats</Link></li>
          </ul>
        </div>

        {/* Digital Safety Golden Rules */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
            {lang === 'hi' ? 'सुरक्षा स्वर्णिम नियम' : 'Core Safety Rules'}
          </h4>
          <div className="space-y-2 text-xs text-slate-400 bg-slate-900/60 p-3 rounded-xl border border-white/5">
            <p className="flex items-start gap-1.5">
              <span className="text-amber-400 font-bold">1.</span>
              <span>Never share OTPs, PINs, or passwords with anyone.</span>
            </p>
            <p className="flex items-start gap-1.5">
              <span className="text-amber-400 font-bold">2.</span>
              <span>Entering UPI PIN always DEBITS money, never credits.</span>
            </p>
            <p className="flex items-start gap-1.5">
              <span className="text-amber-400 font-bold">3.</span>
              <span>Never install AnyDesk / QuickSupport for callers.</span>
            </p>
          </div>
        </div>

      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto px-6 py-4 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-2">
        <p>© 2026 CHAKRAVYUH — Advanced Web Security Awareness Ecosystem. Open education for all.</p>
        <p className="flex items-center gap-1">
          Designed with <Heart className="w-3 h-3 text-rose-500 inline fill-rose-500" /> for inclusive digital safety
        </p>
      </div>
    </footer>
  );
};
