import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Laptop, 
  Wifi, 
  Server, 
  Globe, 
  ShieldCheck, 
  ShieldAlert, 
  Lock, 
  Unlock, 
  Eye, 
  Radio, 
  AlertOctagon,
  Info,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';
import { GlassCard } from '../common/GlassCard';
import { AnimatedButton } from '../common/AnimatedButton';
import { Badge } from '../common/Badge';
import { useLanguage } from '../../context/LanguageContext';

export const NetworkVisualizer = ({ standalone = false }) => {
  const { lang } = useLanguage();
  const [isProtected, setIsProtected] = useState(true);
  const [selectedNode, setSelectedNode] = useState('router');
  const [packetStep, setPacketStep] = useState(0);

  // Packet animation step cycler
  useEffect(() => {
    const timer = setInterval(() => {
      setPacketStep((prev) => (prev + 1) % 5);
    }, 1400);
    return () => clearInterval(timer);
  }, []);

  const nodes = [
    {
      id: 'device',
      title: '1. User Device',
      titleHi: '1. आपका डिवाइस (फोन/लैपटॉप)',
      icon: Laptop,
      color: 'blue',
      role: 'Source of request (Typing credentials, card details)',
      roleHi: 'डेटा भेजने वाला (पासवर्ड, कार्ड नंबर)',
      securityTip: 'Keep OS patched & avoid downloading untrusted software.',
      securityTipHi: 'सॉफ्टवेयर हमेशा अपडेट रखें और पायरेटेड ऐप्स न चलाएं।',
      attackPoint: 'Malware / Keylogger',
      attackDesc: 'Keyloggers record typed passwords directly before encryption happens.'
    },
    {
      id: 'router',
      title: '2. Wi-Fi Router',
      titleHi: '2. वाई-फाई राउटर / हॉटस्पॉट',
      icon: Wifi,
      color: 'amber',
      role: 'Local wireless bridge connecting your device to cables',
      roleHi: 'हवा में तरंगों द्वारा डेटा ट्रांसफर करने वाला राउटर',
      securityTip: 'Use WPA3/WPA2-AES password. Never use open unsecured Wi-Fi for banking.',
      securityTipHi: 'हमेशा पासवर्ड वाला WPA2/WPA3 वाई-फाई इस्तेमाल करें।',
      attackPoint: 'Wi-Fi Sniffing & Evil Twin',
      attackDesc: 'Attackers capture radio waves on open networks or set up fake free hotspots.'
    },
    {
      id: 'isp',
      title: '3. ISP (Airtel/Jio)',
      titleHi: '3. इंटरनेट सर्विस प्रोवाइडर (ISP)',
      icon: Radio,
      color: 'purple',
      role: 'Telecom provider routing data through optical fibers',
      roleHi: 'टेलीकॉम कंपनी जो केबल्स के जरिए इंटरनेट पहुंचाती है',
      securityTip: 'Use Encrypted DNS (DNS-over-HTTPS) or a trusted VPN to hide browsed domains.',
      securityTipHi: 'ब्राउज़र में Secure DNS चालू करें ताकि वेबसाइट लिस्ट सुरक्षित रहे।',
      attackPoint: 'DNS Spoofing / Logging',
      attackDesc: 'Rogue DNS servers can redirect you to fake banking clone websites.'
    },
    {
      id: 'internet',
      title: '4. Public Internet',
      titleHi: '4. ग्लोबल इंटरनेट बैकबोन',
      icon: Globe,
      color: 'cyan',
      role: 'Global interconnected network of submarine cables & routers',
      roleHi: 'समुद्री केबलों और बड़े राउटर्स का विशाल वैश्विक जाल',
      securityTip: 'HTTPS TLS 1.3 encryption makes packets unreadable to transit intermediaries.',
      securityTipHi: 'HTTPS होने पर बीच के राउटर्स डेटा को पढ़ नहीं सकते।',
      attackPoint: 'Man-In-The-Middle (MITM)',
      attackDesc: 'Attackers tap intermediary transit nodes to read unencrypted HTTP packets.'
    },
    {
      id: 'server',
      title: '5. Bank / Web Server',
      titleHi: '5. बैंक / वेबसाइट सर्वर',
      icon: Server,
      color: 'emerald',
      role: 'Destination server executing transactions and serving data',
      roleHi: 'अंतिम सर्वर जो लेनदेन को प्रोसेस करता है',
      securityTip: 'Protected by Web Application Firewalls (WAF) and SSL Certificates.',
      securityTipHi: 'फायरवॉल और SSL सुरक्षा प्रमाणपत्र द्वारा सुरक्षित।',
      attackPoint: 'DDoS / Server Compromise',
      attackDesc: 'Attempting to overwhelm server capacity or steal database records.'
    }
  ];

  const currentNodeInfo = nodes.find((n) => n.id === selectedNode) || nodes[1];

  return (
    <GlassCard variant="default" className="p-6 lg:p-8 space-y-6">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-bold font-display text-white">
              {lang === 'hi' ? 'इंटरनेट डेटा फ्लो एवं नेटवर्क सुरक्षा मैप' : 'Network Awareness & Data Movement Visualizer'}
            </h3>
            <Badge variant={isProtected ? 'green' : 'red'}>
              {isProtected ? 'HTTPS / TLS Encrypted' : 'Unencrypted HTTP (Vulnerable)'}
            </Badge>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            {lang === 'hi'
              ? 'देखें कि आपका पासवर्ड आपके फोन से बैंक सर्वर तक कैसे जाता है और हैकर्स कहां हमला करते हैं।'
              : 'Trace how data travels from your device to the server and where interception happens.'}
          </p>
        </div>

        {/* Mode Toggle Button */}
        <div className="flex items-center gap-2 bg-slate-900/80 p-1.5 rounded-2xl border border-white/10">
          <button
            onClick={() => setIsProtected(true)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              isProtected
                ? 'bg-emerald-500 text-slate-950 shadow-green-glow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>{lang === 'hi' ? 'सुरक्षित मोड (HTTPS)' : 'Protected (HTTPS)'}</span>
          </button>
          <button
            onClick={() => setIsProtected(false)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              !isProtected
                ? 'bg-rose-600 text-white shadow-red-glow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Unlock className="w-3.5 h-3.5" />
            <span>{lang === 'hi' ? 'असुरक्षित मोड (HTTP)' : 'Vulnerable (HTTP)'}</span>
          </button>
        </div>
      </div>

      {/* Network Pipeline Visualizer Track */}
      <div className="relative py-10 px-2 sm:px-6 bg-slate-950/60 kolam-bg rounded-2xl border border-white/5 overflow-hidden shadow-inner">
        
        {/* Connecting Cable Line */}
        <div className="absolute top-1/2 left-8 right-8 -translate-y-1/2 h-1 bg-slate-800 rounded-full z-0">
          <motion.div
            className={`h-full rounded-full ${
              isProtected
                ? 'bg-gradient-to-r from-emerald-500 via-amber-400 to-emerald-500'
                : 'bg-gradient-to-r from-rose-600 via-amber-500 to-rose-600'
            }`}
            animate={{ opacity: [0.4, 0.9, 0.4] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>

        {/* Nodes Grid */}
        <div className="relative z-10 grid grid-cols-5 gap-2 sm:gap-4 items-center">
          {nodes.map((node, index) => {
            const Icon = node.icon;
            const isSelected = selectedNode === node.id;
            const isCurrentPacketHere = packetStep === index;

            return (
              <div key={node.id} className="flex flex-col items-center text-center">
                
                {/* Node Box */}
                <motion.div
                  whileHover={{ scale: 1.08 }}
                  onClick={() => setSelectedNode(node.id)}
                  className={`relative w-12 h-12 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center cursor-pointer transition-all duration-300 ${
                    isSelected
                      ? 'bg-amber-500/20 border-2 border-amber-400 shadow-gold-glow scale-105'
                      : 'bg-slate-900/90 border border-white/15 hover:border-white/40'
                  }`}
                >
                  <Icon className={`w-5 h-5 sm:w-7 sm:h-7 ${isSelected ? 'text-amber-400' : 'text-slate-300'}`} />

                  {/* Packet Pulse Indicator */}
                  {isCurrentPacketHere && (
                    <motion.div
                      layoutId="packet"
                      className={`absolute -top-3 px-2 py-0.5 rounded-full text-[9px] font-mono font-bold shadow-lg ${
                        isProtected
                          ? 'bg-emerald-500 text-slate-950 shadow-green-glow'
                          : 'bg-rose-500 text-white shadow-red-glow animate-bounce'
                      }`}
                    >
                      {isProtected ? '🔒 Encrypted' : '⚠️ Plaintext'}
                    </motion.div>
                  )}

                  {/* Status indicator on bottom */}
                  <div
                    className={`absolute -bottom-1 w-3 h-3 rounded-full border-2 border-slate-950 ${
                      isProtected ? 'bg-emerald-400' : index === 1 || index === 3 ? 'bg-rose-500 animate-ping' : 'bg-amber-400'
                    }`}
                  />
                </motion.div>

                {/* Node Title */}
                <div className="mt-3">
                  <p className="text-[11px] sm:text-xs font-bold text-white leading-tight">
                    {lang === 'hi' ? node.titleHi.split('.')[1] : node.title.split('.')[1]}
                  </p>
                  <button
                    onClick={() => setSelectedNode(node.id)}
                    className="text-[10px] text-amber-400 hover:underline mt-0.5 block mx-auto"
                  >
                    {lang === 'hi' ? 'विवरण' : 'Inspect'}
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Node Deep Dive Inspector */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
        {/* Node Overview Card */}
        <div className="p-4 rounded-xl bg-slate-900/70 border border-white/10 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
                <Info className="w-4 h-4" />
              </div>
              <h4 className="font-bold text-sm text-white">
                {lang === 'hi' ? currentNodeInfo.titleHi : currentNodeInfo.title}
              </h4>
            </div>
            <span className="text-xs text-slate-400 font-mono">Node ID: {currentNodeInfo.id}</span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            {lang === 'hi' ? currentNodeInfo.roleHi : currentNodeInfo.role}
          </p>

          <div className="p-3 rounded-lg bg-emerald-950/30 border border-emerald-500/20 text-xs text-emerald-300 flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold">{lang === 'hi' ? 'सुरक्षा उपाय:' : 'Defense Measure:'} </span>
              {lang === 'hi' ? currentNodeInfo.securityTipHi : currentNodeInfo.securityTip}
            </div>
          </div>
        </div>

        {/* Threat & Interception Analysis */}
        <div className="p-4 rounded-xl bg-slate-900/70 border border-white/10 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400">
                <AlertOctagon className="w-4 h-4" />
              </div>
              <h4 className="font-bold text-sm text-rose-400">
                {lang === 'hi' ? 'संभावित हमला बिंदु (Attack Vector)' : 'Potential Attack Vector'}
              </h4>
            </div>
            <Badge variant={isProtected ? 'green' : 'red'}>
              {isProtected ? 'Threat Neutralized' : 'High Vulnerability'}
            </Badge>
          </div>

          <div>
            <span className="text-xs font-semibold text-white block mb-1">
              {currentNodeInfo.attackPoint}
            </span>
            <p className="text-xs text-slate-400 leading-relaxed">
              {currentNodeInfo.attackDesc}
            </p>
          </div>

          <div className="p-3 rounded-lg bg-slate-800/80 border border-white/5 text-xs text-slate-300">
            <span className="text-amber-400 font-semibold">{lang === 'hi' ? 'वर्तमान स्थिति:' : 'Status:'} </span>
            {isProtected
              ? 'TLS 1.3 encryption prevents eavesdropping even if packets are intercepted over the air.'
              : 'Critical Risk! Data is flying across open airwaves in unencrypted plaintext readable by anyone.'}
          </div>
        </div>
      </div>
    </GlassCard>
  );
};
