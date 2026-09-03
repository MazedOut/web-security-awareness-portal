import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Shield, 
  Award, 
  Zap, 
  Flame, 
  CheckCircle2, 
  BookOpen, 
  Film, 
  Gamepad2, 
  Search, 
  Bot, 
  ArrowRight, 
  Lightbulb, 
  Activity,
  KeyRound,
  ShieldCheck,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  ResponsiveContainer 
} from 'recharts';
import { GlassCard } from '../components/common/GlassCard';
import { StatCard } from '../components/common/StatCard';
import { AnimatedButton } from '../components/common/AnimatedButton';
import { ProgressBar } from '../components/common/ProgressBar';
import { Badge } from '../components/common/Badge';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

export const DashboardPage = () => {
  const { user, getRankTitle } = useAuth();
  const { lang, t } = useLanguage();
  const navigate = useNavigate();

  const rankInfo = getRankTitle(user.awarenessScore);

  const competencyData = [
    { subject: 'Phishing Defense', score: user.competencies?.phishing || 85, fullMark: 100 },
    { subject: 'Password Hygiene', score: user.competencies?.passwords || 90, fullMark: 100 },
    { subject: 'Social Engineering', score: user.competencies?.socialEng || 70, fullMark: 100 },
    { subject: 'Safe Browsing', score: user.competencies?.safeBrowsing || 80, fullMark: 100 },
    { subject: 'Device Safety', score: user.competencies?.deviceSafety || 65, fullMark: 100 },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      
      {/* Top Banner with User Greeting & Awareness Score */}
      <GlassCard variant="glow" glowColor="gold" className="p-6 sm:p-8 border border-cyber-gold/20 shadow-md">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="gold">Level {user.level} Defender</Badge>
              <Badge variant="green">{rankInfo.badge}</Badge>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold font-display text-graphite">
              {t.dashboard.welcomeBack}, <span className="text-cyber-gold-dark">{user.name}</span>
            </h1>
            <p className="text-sm text-slate-500">
              {t.dashboard.subtitle}
            </p>
          </div>

          {/* Large Awareness Score Display - Elegant Redesign */}
          <div className="flex flex-col items-end bg-white/60 p-5 rounded-2xl border border-slate-200 shrink-0 shadow-sm text-right min-w-[200px]">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block mb-1">
              Your Security Score
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-bold font-display text-cyber-gold-dark leading-none">
                {user.awarenessScore}
              </span>
              <span className="text-sm font-semibold text-slate-400">/ 1000</span>
            </div>
            <span className="text-sm font-bold text-graphite font-display mt-2 border-t border-slate-200 pt-2 w-full">
              {rankInfo.title}
            </span>
            <div className="text-[11px] text-slate-500 font-semibold mt-1">
              {user.xp} / {user.xpNextLevel} XP to Level {user.level + 1}
            </div>
          </div>
        </div>
      </GlassCard>

      {/* 4 Core Quick Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard
          icon={Award}
          label={t.common.awarenessScore}
          value={user.awarenessScore}
          suffix=" / 1000"
          color="gold"
          trend="up"
          trendLabel="+45 points this week"
        />
        <StatCard
          icon={Gamepad2}
          label={t.common.completedSims}
          value={user.completedSims?.length || 2}
          suffix=" labs"
          color="green"
          trend="safe"
          trendLabel="100% pass rate"
        />
        <StatCard
          icon={BookOpen}
          label={t.common.readArticles}
          value={user.readArticles?.length || 2}
          suffix=" / 6 topics"
          color="blue"
          trendLabel="4 topics remaining"
        />
        <StatCard
          icon={Zap}
          label={t.common.streak}
          value={user.streakDays || 4}
          suffix=" Days"
          color="purple"
          trend="up"
          trendLabel="Daily defense bonus active"
        />
      </div>

      {/* Main Grid: Competency Radar & Recommended Mission */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Security Competency Radar Chart */}
        <div className="lg:col-span-6">
          <GlassCard variant="default" className="p-6 space-y-4 h-full flex flex-col justify-between border-slate-200">
            <div>
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-lg text-graphite font-display">
                  {t.dashboard.radarTitle}
                </h3>
                <Badge variant="blue">Real-time Telemetry</Badge>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                {t.dashboard.radarSubtitle}
              </p>
            </div>

            <div className="w-full h-64 sm:h-72">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={competencyData}>
                  <PolarGrid stroke="rgba(15,23,42,0.1)" />
                  <PolarAngleAxis dataKey="subject" stroke="#64748B" tick={{ fontSize: 11, fill: '#475569' }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="rgba(15,23,42,0.1)" />
                  <Radar
                    name="Proficiency"
                    dataKey="score"
                    stroke="#B45309"
                    fill="#B45309"
                    fillOpacity={0.4}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 font-semibold">
              <span>Strongest: <strong className="text-cyber-green-dark">Password Hygiene (90%)</strong></span>
              <span>Needs Practice: <strong className="text-cyber-red-dark">Device Safety (65%)</strong></span>
            </div>
          </GlassCard>
        </div>

        {/* Recommended Defense Mission & Daily Safety Tip */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* Recommended Next Learning Mission */}
          <GlassCard variant="default" className="p-6 space-y-4 border border-cyber-gold/20 bg-white/80">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold text-cyber-gold-dark tracking-wider">
                {t.dashboard.recommendedNext}
              </span>
              <Badge variant="purple">+60 XP Reward</Badge>
            </div>

            <div>
              <h4 className="text-lg sm:text-xl font-bold text-graphite font-display">
                {lang === 'hi' ? 'सोशल इंजीनियरिंग: "डिजिटल अरेस्ट" फर्जी कॉल का बचाव' : 'Social Engineering: "Digital Arrest" Call Defense'}
              </h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                {lang === 'hi'
                  ? 'स्कैमर्स सीबीआई अफसर बनकर डराने की कोशिश करते हैं। इस सिम्युलेशन में सही कदम उठाएं।'
                  : 'Practice handling aggressive imposter callers posing as telecom and police authorities.'}
              </p>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <AnimatedButton
                variant="primary"
                size="sm"
                icon={Gamepad2}
                onClick={() => navigate('/simulations?tab=social-eng')}
              >
                Launch Simulation Lab ➔
              </AnimatedButton>
              <Link to="/articles/art-social-engineering" className="text-xs font-semibold text-slate-500 hover:text-cyber-gold-dark transition-colors">
                Read Article First
              </Link>
            </div>
          </GlassCard>

          {/* Today's Golden Rule / Safety Tip */}
          <GlassCard variant="subtle" className="p-5 space-y-3 bg-cyber-gold/5 border border-cyber-gold/20">
            <div className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-cyber-gold-dark" />
              <h4 className="font-bold text-sm text-cyber-gold-dark">
                {t.dashboard.dailyTipTitle}
              </h4>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed font-medium">
              {lang === 'hi' ? (
                <>🛑 <strong>याद रखें:</strong> कोई भी बैंक या सरकारी अधिकारी कभी भी आपसे फोन पर <strong>OTP</strong>, <strong>ATM PIN</strong> या <strong>CVV</strong> नहीं मांगता। यदि कोई तत्काल पैसे न भेजने पर गिरफ्तारी की धमकी दे, तो तुरंत कॉल काटें और 1930 पर रिपोर्ट करें।</>
              ) : (
                <>🛑 <strong>Golden Rule:</strong> Legitimate banks and government officials NEVER demand your OTP, PIN, or CVV over the phone. If a caller threatens immediate arrest or cancellation of electricity unless money is transferred, disconnect and dial 1930.</>
              )}
            </p>
          </GlassCard>

        </div>
      </div>

      {/* Quick Action Defense Tools & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Quick Action Tools Bar */}
        <div className="lg:col-span-5 space-y-3">
          <h3 className="font-bold text-lg text-graphite font-display">
            {t.dashboard.quickActions}
          </h3>

          <div className="space-y-2.5">
            <div
              onClick={() => navigate('/simulations?tab=url-inspector')}
              className="p-3.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 hover:border-cyber-gold/30 cursor-pointer transition-all flex items-center justify-between shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-cyber-blue/10 text-cyber-blue-dark">
                  <Search className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-bold text-graphite">{t.dashboard.inspectUrl}</p>
                  <p className="text-[11px] text-slate-500">Check typosquatting and fake domain lookalikes</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </div>

            <div
              onClick={() => navigate('/simulations?tab=password')}
              className="p-3.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 hover:border-cyber-gold/30 cursor-pointer transition-all flex items-center justify-between shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-cyber-gold/10 text-cyber-gold-dark">
                  <KeyRound className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-bold text-graphite">{t.dashboard.checkPassword}</p>
                  <p className="text-[11px] text-slate-500">Calculate bits of entropy & test against breaches</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </div>

            <div
              onClick={() => navigate('/ai-assistant')}
              className="p-3.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 hover:border-cyber-gold/30 cursor-pointer transition-all flex items-center justify-between shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-cyber-purple/10 text-cyber-purple-dark">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-bold text-graphite">{t.dashboard.askAi}</p>
                  <p className="text-[11px] text-slate-500">Ask safety questions in English or Hinglish</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </div>
          </div>
        </div>

        {/* Recent Defense Log / Activity */}
        <div className="lg:col-span-7 space-y-3">
          <h3 className="font-bold text-lg text-graphite font-display">
            {t.dashboard.recentActivity}
          </h3>

          <GlassCard variant="default" className="p-4 space-y-3 border-slate-200">
            {user.activityLog?.slice(0, 4).map((act) => (
              <div key={act.id} className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-2 h-2 rounded-full bg-cyber-gold" />
                  <span className="text-slate-600 font-medium">{act.text}</span>
                </div>
                <div className="flex items-center gap-2 font-mono">
                  <span className="text-cyber-gold-dark font-bold">{act.xp}</span>
                  <span className="text-slate-400 text-[10px]">{act.timestamp}</span>
                </div>
              </div>
            ))}
          </GlassCard>
        </div>

      </div>

    </div>
  );
};
