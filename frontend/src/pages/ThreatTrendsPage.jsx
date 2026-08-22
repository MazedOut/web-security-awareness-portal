import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  TrendingDown,
  Minus,
  AlertTriangle,
  ShieldCheck,
  Globe,
  Smartphone,
  CreditCard,
  Mail,
  Users,
  Lock,
  ExternalLink,
  ArrowRight,
  Gamepad2
} from 'lucide-react';
import { GlassCard } from '../components/common/GlassCard';
import { Badge } from '../components/common/Badge';
import { HeritageSeparator } from '../components/common/HeritageSeparator';
import { AnimatedButton } from '../components/common/AnimatedButton';
import { useLanguage } from '../context/LanguageContext';

const trendData = [
  {
    id: 'upi-fraud',
    title: 'UPI & Digital Payment Fraud',
    titleHi: 'UPI एवं डिजिटल भुगतान धोखाधड़ी',
    trend: 'up',
    change: '+42%',
    period: 'vs 2023',
    severity: 'Critical',
    badgeColor: 'red',
    Icon: CreditCard,
    description: 'QR code scams, fake payment apps, and social engineering around UPI fraud have surged dramatically, particularly targeting rural smartphone users.',
    descriptionHi: 'QR कोड स्कैम, नकली पेमेंट ऐप्स और UPI धोखाधड़ी के आसपास सोशल इंजीनियरिंग में भारी वृद्धि हुई है।',
    stat: '₹1,750 Cr lost',
    topRegions: ['Maharashtra', 'Gujarat', 'Delhi NCR'],
  },
  {
    id: 'phishing',
    title: 'Phishing & Smishing Attacks',
    titleHi: 'फिशिंग एवं SMS स्कैम',
    trend: 'up',
    change: '+31%',
    period: 'vs 2023',
    severity: 'High',
    badgeColor: 'red',
    Icon: Mail,
    description: 'Credential phishing targeting bank customers, delivery notifications, and government scheme impersonation remain top attack vectors.',
    descriptionHi: 'बैंक ग्राहकों को निशाना बनाने वाले फिशिंग हमले और सरकारी योजना के नाम पर ठगी शीर्ष खतरे हैं।',
    stat: '2.4M incidents/month',
    topRegions: ['Uttar Pradesh', 'Rajasthan', 'Bihar'],
  },
  {
    id: 'social-eng',
    title: 'Social Engineering & Vishing',
    titleHi: 'सोशल इंजीनियरिंग एवं वॉयस फ्रॉड',
    trend: 'up',
    change: '+28%',
    period: 'vs 2023',
    severity: 'High',
    badgeColor: 'red',
    Icon: Users,
    description: 'Impersonation of CBI officers, bank employees, and customs officials — known as "digital arrest" scams — are the fastest-growing threat vector in India.',
    descriptionHi: 'CBI अफसर, बैंक कर्मचारी और कस्टम अधिकारियों का नाटक करने वाले "डिजिटल अरेस्ट" स्कैम सबसे तेजी से बढ़ रहे हैं।',
    stat: '₹120 Cr monthly loss',
    topRegions: ['Delhi', 'Haryana', 'Jharkhand'],
  },
  {
    id: 'mobile-malware',
    title: 'Mobile Malware & Fake Apps',
    titleHi: 'मोबाइल मालवेयर एवं नकली ऐप्स',
    trend: 'up',
    change: '+19%',
    period: 'vs 2023',
    severity: 'Medium',
    badgeColor: 'gold',
    Icon: Smartphone,
    description: 'Malicious APKs distributed via WhatsApp and Telegram, disguised as loan apps, shopping apps, and government apps, continue to infect devices and steal OTPs.',
    descriptionHi: 'WhatsApp और Telegram पर भेजे जाने वाले नकली APK फाइलें जो बैंकिंग ऐप्स की नकल करती हैं।',
    stat: '4.1M infected devices',
    topRegions: ['West Bengal', 'Odisha', 'Tamil Nadu'],
  },
  {
    id: 'ransomware',
    title: 'Ransomware on SMBs',
    titleHi: 'छोटे व्यवसायों पर रैनसमवेयर',
    trend: 'stable',
    change: '±3%',
    period: 'vs 2023',
    severity: 'Medium',
    badgeColor: 'gold',
    Icon: Lock,
    description: 'Small and medium Indian businesses remain prime ransomware targets due to low cybersecurity maturity. Healthcare and education sectors are most vulnerable.',
    descriptionHi: 'छोटे भारतीय व्यवसाय रैनसमवेयर हमलों का सबसे आसान शिकार बनते हैं।',
    stat: 'Avg ₹8L ransom demand',
    topRegions: ['Karnataka', 'Andhra Pradesh', 'Punjab'],
  },
  {
    id: 'data-breach',
    title: 'Data Breach & Credential Leaks',
    titleHi: 'डेटा उल्लंघन एवं लीक',
    trend: 'down',
    change: '-8%',
    period: 'vs 2023',
    severity: 'Improving',
    badgeColor: 'green',
    Icon: Globe,
    description: 'Large-scale data breaches have slightly declined due to improved corporate security practices, but credential stuffing attacks remain active.',
    descriptionHi: 'कॉर्पोरेट सुरक्षा में सुधार के कारण बड़े डेटा उल्लंघन थोड़े कम हुए हैं।',
    stat: '310M records exposed',
    topRegions: ['National'],
  },
];

const awarenessStats = [
  { label: 'Cyber Complaints 2024', value: '14.5L+', Icon: AlertTriangle, color: 'text-cyber-red-dark' },
  { label: 'Amount Lost', value: '₹7,061 Cr', Icon: CreditCard, color: 'text-cyber-gold-dark' },
  { label: 'Cybercrime Growth', value: '+400%', Icon: TrendingUp, color: 'text-cyber-red-dark' },
  { label: 'Cases Resolved', value: '24%', Icon: ShieldCheck, color: 'text-cyber-green-dark' },
];

const TrendIndicator = ({ trend }) => {
  if (trend === 'up') return <TrendingUp className="w-4 h-4 text-cyber-red" />;
  if (trend === 'down') return <TrendingDown className="w-4 h-4 text-cyber-green" />;
  return <Minus className="w-4 h-4 text-slate-400" />;
};

export const ThreatTrendsPage = () => {
  const { lang } = useLanguage();
  const navigate = useNavigate();
  const [selectedTrend, setSelectedTrend] = useState(trendData[0]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">

      {/* Header */}
      <HeritageSeparator className="my-2" />
      <GlassCard variant="default" className="p-6 sm:p-8 space-y-3 bg-white border border-slate-200 shadow-sm">
        <div className="flex items-center gap-2">
          <Badge variant="red">Live Threat Intelligence</Badge>
          <Badge variant="gold">India Cyber Landscape 2024</Badge>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold font-display text-graphite mt-2">
          {lang === 'hi' ? 'साइबर खतरा रुझान एवं राष्ट्रीय परिदृश्य' : 'Threat Trends & National Cyber Landscape'}
        </h1>
        <p className="text-sm text-slate-600 font-medium max-w-3xl leading-relaxed">
          {lang === 'hi'
            ? 'भारत में साइबर अपराध के उभरते रुझानों, हमले के तरीकों और सुरक्षा आंकड़ों का विस्तृत विश्लेषण। स्रोत: CERT-In, MHA, I4C।'
            : 'Analysing emerging cybercrime patterns, attack vectors, and protection statistics across India. Source: CERT-In, MHA, I4C 2024 Annual Reports.'}
        </p>
      </GlassCard>

      {/* National Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {awarenessStats.map((stat, idx) => {
          const StatIcon = stat.Icon;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08 }}
            >
              <GlassCard variant="default" className="p-4 sm:p-5 bg-white border border-slate-200 shadow-sm text-center space-y-2">
                <StatIcon className={`w-6 h-6 mx-auto ${stat.color}`} />
                <div className={`text-2xl sm:text-3xl font-extrabold font-display ${stat.color}`}>
                  {stat.value}
                </div>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">{stat.label}</p>
              </GlassCard>
            </motion.div>
          );
        })}
      </div>

      {/* Main Trend Navigator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* Left: Trend List */}
        <div className="lg:col-span-4 space-y-2.5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Threat Categories ({trendData.length})
          </h3>
          <div className="space-y-2">
            {trendData.map((trend) => {
              const TrendItemIcon = trend.Icon;
              const isSelected = selectedTrend.id === trend.id;
              return (
                <div
                  key={trend.id}
                  onClick={() => setSelectedTrend(trend)}
                  className={`p-3.5 rounded-2xl cursor-pointer border transition-all flex items-center justify-between shadow-sm ${
                    isSelected
                      ? 'bg-cyber-red/5 border-cyber-red/30'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl border ${
                      isSelected ? 'bg-cyber-red/10 text-cyber-red-dark border-cyber-red/20' : 'bg-slate-50 text-slate-500 border-slate-200'
                    }`}>
                      <TrendItemIcon className="w-4 h-4" />
                    </div>
                    <div>
                      <p className={`text-xs font-bold ${isSelected ? 'text-cyber-red-dark' : 'text-graphite'}`}>
                        {lang === 'hi' ? trend.titleHi : trend.title}
                      </p>
                      <div className="flex items-center gap-1 mt-0.5">
                        <TrendIndicator trend={trend.trend} />
                        <span className={`text-[11px] font-bold ${
                          trend.trend === 'up' ? 'text-cyber-red' : trend.trend === 'down' ? 'text-cyber-green' : 'text-slate-400'
                        }`}>{trend.change}</span>
                        <span className="text-[11px] text-slate-400">{trend.period}</span>
                      </div>
                    </div>
                  </div>
                  <Badge variant={trend.badgeColor} size="sm">{trend.severity}</Badge>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Deep-Dive Detail */}
        <div className="lg:col-span-8 space-y-5">
          {selectedTrend && (
            <motion.div
              key={selectedTrend.id}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.25 }}
            >
              <GlassCard variant="default" className="p-6 sm:p-8 space-y-6 bg-white border border-slate-200 shadow-sm">
                {/* Header */}
                <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-2xl bg-cyber-red/10 border border-cyber-red/20 text-cyber-red-dark">
                      <selectedTrend.Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-xl sm:text-2xl font-bold font-display text-graphite">
                        {lang === 'hi' ? selectedTrend.titleHi : selectedTrend.title}
                      </h2>
                      <div className="flex items-center gap-2 mt-0.5">
                        <TrendIndicator trend={selectedTrend.trend} />
                        <span className={`text-sm font-bold ${
                          selectedTrend.trend === 'up' ? 'text-cyber-red' : selectedTrend.trend === 'down' ? 'text-cyber-green' : 'text-slate-500'
                        }`}>{selectedTrend.change} {selectedTrend.period}</span>
                      </div>
                    </div>
                  </div>
                  <Badge variant={selectedTrend.badgeColor}>{selectedTrend.severity} Severity</Badge>
                </div>

                {/* Key Stat */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-cyber-red/5 to-white border border-cyber-red/20 shadow-sm">
                  <span className="text-xs font-bold text-cyber-red-dark uppercase tracking-wider block">National Impact Metric</span>
                  <p className="text-2xl font-extrabold font-display text-graphite mt-1">{selectedTrend.stat}</p>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Overview</h3>
                  <p className="text-sm text-slate-600 font-medium leading-relaxed">
                    {lang === 'hi' ? selectedTrend.descriptionHi : selectedTrend.description}
                  </p>
                </div>

                {/* Top Regions */}
                <div className="space-y-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Most Affected Regions</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedTrend.topRegions.map((region, idx) => (
                      <span key={idx} className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-600 shadow-sm">
                        📍 {region}
                      </span>
                    ))}
                  </div>
                </div>

                {/* CTAs */}
                <div className="pt-4 border-t border-slate-100 flex flex-wrap gap-3">
                  <AnimatedButton
                    variant="primary"
                    size="sm"
                    icon={Gamepad2}
                    onClick={() => navigate('/simulations?tab=phishing')}
                  >
                    Practice in Simulator
                  </AnimatedButton>
                  <AnimatedButton
                    variant="glass"
                    size="sm"
                    icon={ArrowRight}
                    onClick={() => navigate('/threats')}
                  >
                    Full Threat Library
                  </AnimatedButton>
                </div>
              </GlassCard>
            </motion.div>
          )}

          {/* Source Attribution */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-4 shadow-sm">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Data Sources</p>
              <p className="text-xs text-slate-600 font-medium mt-0.5">
                CERT-In Annual Report 2024 · MHA Cybercrime Statistics · I4C Data · National Crime Records Bureau
              </p>
            </div>
            <a
              href="https://www.cert-in.org.in"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs font-bold text-cyber-blue-dark hover:underline shrink-0"
            >
              <ExternalLink className="w-3.5 h-3.5" /> CERT-In
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};
