import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Shield, 
  ShieldCheck, 
  Sparkles, 
  BookOpen, 
  Film, 
  Flame, 
  Network, 
  BarChart3, 
  Gamepad2, 
  Bot, 
  CheckCircle2, 
  ChevronRight, 
  ArrowRight,
  Lock,
  PhoneCall,
  Activity
} from 'lucide-react';
import { GlassCard } from '../components/common/GlassCard';
import { AnimatedButton } from '../components/common/AnimatedButton';
import { Badge } from '../components/common/Badge';
import { ChakravyuhLogo } from '../components/common/ChakravyuhLogo';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

export const LandingPage = () => {
  const { lang, t } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
  };

  const pillars = [
    {
      icon: BookOpen,
      color: 'amber',
      title: lang === 'hi' ? '1. जागरूकता हब (Articles First)' : '1. Awareness Hub',
      desc: lang === 'hi'
        ? '5-चरणीय आसान लेख: सरल व्याख्या ➔ वास्तविक उदाहरण ➔ चेतावनी के संकेत ➔ सुरक्षा कदम ➔ त्वरित चुनौती।'
        : 'Structured 5-stage reading: Plain explanation ➔ Real story ➔ Red flags ➔ Protection steps ➔ Quick challenge.',
      link: '/articles',
    },
    {
      icon: Gamepad2,
      color: 'green',
      title: lang === 'hi' ? '2. इंटरैक्टिव सिम्युलेटर लैब' : '2. Interactive Simulations',
      desc: lang === 'hi'
        ? 'फिशिंग ईमेल, पासवर्ड लैब, डिजिटल अरेस्ट फर्जी कॉल्स और फर्जी वेबसाइटों का सुरक्षित अभ्यास करें।'
        : 'Hands-on practice: Inspect phishing headers, measure password entropy, and navigate social engineering calls.',
      link: '/simulations',
    },
    {
      icon: Network,
      color: 'blue',
      title: lang === 'hi' ? '3. नेटवर्क विज़ुअलाइज़र' : '3. Network Data Flow',
      desc: lang === 'hi'
        ? 'देखें कि आपका डेटा फोन से बैंक सर्वर तक कैसे जाता है और HTTPS कैसे हैकर्स से बचाता है।'
        : 'Trace data packets across Device ➔ Router ➔ ISP ➔ Internet ➔ Server with Protected vs Attack modes.',
      link: '/network-lab',
    },
    {
      icon: BarChart3,
      color: 'purple',
      title: lang === 'hi' ? '4. वास्तविक साइबर आँकड़े' : '4. Real-World Statistics',
      desc: lang === 'hi'
        ? 'वैश्विक साइबर हमलों, पासवर्ड क्रैकिंग समय और 1930 रिपोर्टिंग रुझानों के वास्तविक आँकड़े।'
        : 'Real-world threat telemetry, GPU cracking matrices, breach trends, and financial fraud data.',
      link: '/statistics',
    },
    {
      icon: Film,
      color: 'cyan',
      title: lang === 'hi' ? '5. वीडियो मास्टरक्लास' : '5. Dedicated Video Hub',
      desc: lang === 'hi'
        ? 'क्यूरेटेड साइबर सुरक्षा वीडियो, मुख्य बिंदु, समय-चिह्न और संबंधित सिम्युलेटर चुनौतियाँ।'
        : 'Curated video masterclasses with key takeaways, bilingual transcripts, and direct simulation links.',
      link: '/videos',
    },
    {
      icon: Bot,
      color: 'red',
      title: lang === 'hi' ? '6. चक्रव्यूह AI सहायक' : '6. AI Security Assistant',
      desc: lang === 'hi'
        ? '24/7 डिजिटल सुरक्षा साथी जो हिंदी और हिंग्लिश में किसी भी फ्रॉड सवाल का तुरंत जवाब देता है।'
        : 'Your empathetic 24/7 digital safety companion supporting English, Hindi, and Hinglish advice.',
      link: '/ai-assistant',
    },
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-24 py-6"
    >
      
      {/* Live Threat Telemetry Ticker */}
      <motion.div variants={itemVariants} className="max-w-7xl mx-auto px-4">
        <div className="glass-panel rounded-2xl px-4 py-2.5 flex items-center justify-between gap-4 border border-cyber-red/20 bg-white/60 shadow-sm text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyber-red animate-ping" />
            <span className="font-bold text-cyber-red-dark uppercase tracking-wider">LIVE TELEMETRY:</span>
            <span className="truncate hidden sm:inline font-medium">
              {lang === 'hi'
                ? 'प्रति 39 सेकंड में एक नया साइबर हमला। आज भारत में 1930 पोर्टल पर 14,000+ फ्रॉड रिपोर्ट दर्ज।'
                : '1 Cyber attack every 39 seconds worldwide. Over 14,000+ fraud alerts processed via 1930 today.'}
            </span>
          </div>
          <Link to="/statistics" className="text-cyber-red hover:underline font-bold shrink-0 text-[11px] flex items-center gap-1">
            View Stats <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </motion.div>

      {/* Hero Section */}
      <section className="relative max-w-6xl mx-auto px-4 text-center space-y-8">
        
        {/* Chakravyuh Concentric Radar Background Shield & Traditional Animation */}
        <div className="relative mx-auto w-48 h-48 sm:w-56 sm:h-56 flex items-center justify-center">
          {/* Animated Concentric Rings (Golden Pattern) */}
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="absolute inset-0 rounded-full border border-amber-500/10 animate-ping opacity-30" 
          />
          <motion.div 
            initial={{ scale: 0.8, opacity: 0, rotate: -90 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            transition={{ duration: 2, ease: "easeOut" }}
            className="absolute inset-2 rounded-full border-[1.5px] border-dashed border-amber-500/20 animate-spin" style={{ animationDuration: '25s' }} 
          />
          <motion.div 
            initial={{ scale: 0.8, opacity: 0, rotate: 90 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            transition={{ duration: 2.2, ease: "easeOut", delay: 0.2 }}
            className="absolute inset-8 rounded-full border border-amber-400/30 animate-pulse" 
          />
          
          {/* Traditional Curve to Digital Circuit Animation */}
          <div className="absolute inset-0 z-0">
            {/* 1. Flowing Elephant Trunk Curve (Draws first) */}
            <motion.svg 
              viewBox="0 0 100 100" 
              className="absolute inset-0 w-full h-full text-amber-500/60"
            >
              <motion.path 
                d="M10,90 C10,40 30,10 60,10 C85,10 95,30 95,50 C95,70 80,85 60,85 C45,85 40,75 45,60" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="1.5" 
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 1 }}
                animate={{ pathLength: 1, opacity: [1, 1, 0] }}
                transition={{ duration: 4, ease: "easeInOut", times: [0, 0.7, 1], repeat: Infinity, repeatDelay: 2 }}
              />
            </motion.svg>
            
            {/* 2. Digital Circuit Pathway (Appears as curve fades) */}
            <motion.svg 
              viewBox="0 0 100 100" 
              className="absolute inset-0 w-full h-full text-amber-400"
            >
              <motion.path 
                d="M10,90 L10,50 L30,10 L60,10 L85,10 L95,30 L95,50 L95,70 L80,85 L60,85 L45,85 L45,60" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="1" 
                initial={{ opacity: 0, pathLength: 0 }}
                animate={{ opacity: [0, 0, 1, 1], pathLength: [0, 0, 1, 1] }}
                transition={{ duration: 4, ease: "easeInOut", times: [0, 0.6, 0.8, 1], repeat: Infinity, repeatDelay: 2 }}
              />
              {/* Circuit Nodes */}
              <motion.circle cx="30" cy="10" r="1.5" fill="currentColor" 
                initial={{ opacity: 0, scale: 0 }} 
                animate={{ opacity: [0,0,1,1], scale: [0,0,1,1] }} 
                transition={{ duration: 4, times: [0, 0.65, 0.7, 1], repeat: Infinity, repeatDelay: 2 }} 
              />
              <motion.circle cx="85" cy="10" r="1.5" fill="currentColor" 
                initial={{ opacity: 0, scale: 0 }} 
                animate={{ opacity: [0,0,1,1], scale: [0,0,1,1] }} 
                transition={{ duration: 4, times: [0, 0.7, 0.75, 1], repeat: Infinity, repeatDelay: 2 }} 
              />
              <motion.circle cx="45" cy="60" r="2" fill="currentColor" 
                initial={{ opacity: 0, scale: 0 }} 
                animate={{ opacity: [0,0,1,1], scale: [0,0,1.5,1] }} 
                transition={{ duration: 4, times: [0, 0.8, 0.85, 1], repeat: Infinity, repeatDelay: 2 }} 
              />
            </motion.svg>
          </div>
          
          {/* Center Logo */}
          <motion.div 
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, ease: "backOut", delay: 1 }}
            className="relative z-10 w-28 h-28 rounded-3xl bg-gradient-to-br from-amber-500/20 to-amber-700/40 border-[1.5px] border-amber-400/50 flex items-center justify-center shadow-gold-glow backdrop-blur-xl"
          >
            <ChakravyuhLogo className="w-16 h-16 text-amber-400" glow={true} />
          </motion.div>
        </div>

        {/* Brand & Titles */}
        <motion.div variants={itemVariants} className="space-y-4">
          <Badge variant="purple" size="md">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t.platformSubtitle}</span>
          </Badge>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight font-display text-graphite">
            <span className="text-gradient-gold block">CHAKRAVYUH</span>
            <span className="text-2xl sm:text-4xl font-semibold text-slate-600 block mt-2">
              {t.tagline}
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-600 font-medium leading-relaxed">
            {t.heroDescription}
          </p>
        </motion.div>

        {/* Primary Call-To-Action Buttons */}
        <motion.div variants={itemVariants} className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <AnimatedButton
            size="lg"
            variant="primary"
            icon={ArrowRight}
            iconPosition="right"
            onClick={() => navigate('/dashboard')}
          >
            {t.nav.startJourney}
          </AnimatedButton>
          <AnimatedButton
            size="lg"
            variant="glass"
            icon={Flame}
            onClick={() => navigate('/threats')}
          >
            {t.nav.exploreThreats}
          </AnimatedButton>
        </motion.div>

        {/* Trust Badges */}
        <motion.div variants={itemVariants} className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 font-medium">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-cyber-green-dark" />
            <span>Beginner & Senior Friendly</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-cyber-gold-dark" />
            <span>English & Hinglish Support</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-cyber-blue-dark" />
            <span>Zero Jargon Explanations</span>
          </div>
        </motion.div>
      </section>

      {/* Core Ecosystem Pillars Grid */}
      <section className="max-w-7xl mx-auto px-4 space-y-10">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold font-display text-graphite">
            {lang === 'hi' ? 'चक्रव्यूह के 6 सुरक्षा स्तंभ' : 'The 6 Pillars of Chakravyuh Defense'}
          </h2>
          <p className="text-sm text-slate-600 max-w-xl mx-auto">
            {lang === 'hi'
              ? 'सिर्फ सिद्धांत नहीं—इंटरैक्टिव प्रयोगों और सरल भाषा के जरिए साइबर सुरक्षा सीखें।'
              : 'Beyond passive reading—learn through tactile simulations, network maps, real data, and AI mentorship.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <GlassCard
                key={idx}
                variant="interactive"
                onClick={() => navigate(pillar.link)}
                className="p-6 space-y-4 flex flex-col justify-between group bg-white border-slate-200 hover:border-cyber-gold/30"
              >
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-cyber-gold-dark group-hover:scale-110 transition-transform shadow-sm">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-base text-graphite group-hover:text-cyber-gold-dark transition-colors">
                    {pillar.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    {pillar.desc}
                  </p>
                </div>
                <div className="pt-2 flex items-center text-xs font-bold text-cyber-gold-dark group-hover:translate-x-1 transition-transform gap-1">
                  <span>{t.common.learnMore}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </GlassCard>
            );
          })}
        </div>
      </section>

      {/* Quick Interactive Awareness Score Teaser */}
      <section className="max-w-5xl mx-auto px-4">
        <GlassCard variant="glow" glowColor="gold" className="p-8 sm:p-10 border border-cyber-gold/20 bg-white shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-8 space-y-4 text-left">
              <Badge variant="purple">Defense Milestone</Badge>
              <h3 className="text-2xl sm:text-3xl font-bold font-display text-graphite">
                {lang === 'hi' ? 'आपका साइबर अवेयरनेस स्कोर: 780 / 1000' : 'Your Digital Awareness Score: 780 / 1000'}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {lang === 'hi'
                  ? 'आपने 3 सिमुलेशन पूरे किए हैं और 2 सुरक्षा बैज जीते हैं। अगला स्तर: "चक्रव्यूह ग्रैंडमास्टर"!'
                  : 'Track your threat recognition proficiency across phishing, credential hygiene, and social engineering in real time.'}
              </p>
              <AnimatedButton
                variant="primary"
                size="md"
                onClick={() => navigate('/dashboard')}
              >
                Go to Awareness Dashboard ➔
              </AnimatedButton>
            </div>

            <div className="md:col-span-4 flex flex-col items-center justify-center p-6 bg-slate-50 rounded-2xl border border-slate-200 text-center shadow-inner">
              <span className="text-4xl font-extrabold text-cyber-gold-dark font-display">780</span>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Cyber Sentinel</span>
              <span className="text-[10px] text-cyber-green-dark mt-1 font-bold">Top 15% Defender</span>
            </div>
          </div>
        </GlassCard>
      </section>

    </motion.div>
  );
};
