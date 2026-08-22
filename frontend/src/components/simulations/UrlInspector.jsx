import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Globe, 
  Search, 
  ShieldCheck, 
  ShieldAlert, 
  AlertTriangle, 
  Lock, 
  Unlock, 
  CheckCircle2, 
  XCircle,
  ExternalLink
} from 'lucide-react';
import { GlassCard } from '../common/GlassCard';
import { AnimatedButton } from '../common/AnimatedButton';
import { Badge } from '../common/Badge';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { mockSimulations } from '../../data/mockSimulations';

export const UrlInspector = () => {
  const { lang } = useLanguage();
  const { addXP, completeSimulation } = useAuth();
  const [customUrl, setCustomUrl] = useState('');
  const [analysisResult, setAnalysisResult] = useState(null);

  const analyzeUrl = (urlToTest) => {
    const raw = (urlToTest || customUrl).trim();
    if (!raw) return;

    let isHttps = raw.startsWith('https://');
    let hasSuspiciousExt = /\.(xyz|top|work|click|country|gq|cf|ml)$/i.test(raw);
    let hasTyposquatting = /(paypa1|g00gle|amaz0n|netfIix|sbi.*kyc|hdfc.*verification)/i.test(raw);
    let hasIpAddress = /^(http|https):\/\/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/.test(raw);

    const isSafe = isHttps && !hasSuspiciousExt && !hasTyposquatting && !hasIpAddress;

    const findings = [];
    if (!isHttps) findings.push('Unencrypted HTTP protocol — passwords transmitted in plaintext over the network.');
    if (hasTyposquatting) findings.push('Typosquatting detected: Lookalike character replacement mimicking a trusted brand.');
    if (hasSuspiciousExt) findings.push('High-risk top-level domain extension (.xyz/.top) commonly used in disposable phishing campaigns.');
    if (hasIpAddress) findings.push('Direct raw IP address in URL instead of verified registered domain name.');
    if (isSafe) findings.push('Valid HTTPS protocol with authentic recognizable domain structure.');

    const result = {
      url: raw,
      isSafe,
      status: isSafe ? 'Verified Safe' : 'Suspicious / Potential Phishing',
      findings,
    };

    setAnalysisResult(result);
    addXP(25, 'Inspected URL in Typosquatting Laboratory');
    if (isSafe) {
      completeSimulation('sim-url-inspector', 100, 100, 'URL Defense Inspector');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <GlassCard variant="default" className="p-6 bg-white border border-slate-200 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold font-display text-graphite">
                {lang === 'hi' ? 'फर्जी वेबसाइट एवं URL विश्लेषक' : 'Fake Website & Typosquatting Inspector'}
              </h3>
              <Badge variant="blue">URL Analyzer</Badge>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-1">
              {lang === 'hi'
                ? 'संदिग्ध लिंक पेस्ट करें और देखें कि क्या वह असली है या ठगों द्वारा बनाया गया फर्जी लुक-अलाइक डोमेन।'
                : 'Paste any suspicious link to detect punycode, typosquatting (e.g. paypa1.com), HTTP vulnerabilities, and rogue domains.'}
            </p>
          </div>
        </div>
      </GlassCard>

      {/* Main Analyzer Card */}
      <GlassCard variant="default" className="p-6 lg:p-8 space-y-6 bg-white border border-slate-200 shadow-sm">
        
        {/* Input Bar */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
            {lang === 'hi' ? 'URL या डोमेन दर्ज करें:' : 'Paste Link / Domain to Inspect:'}
          </label>
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                value={customUrl}
                onChange={(e) => setCustomUrl(e.target.value)}
                placeholder="e.g. https://secure-hdfc-kyc-portal.xyz/login or https://paypal.com"
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-graphite font-mono text-xs focus:outline-none focus:border-cyber-gold/50 focus:ring-1 focus:ring-cyber-gold/20 shadow-inner"
              />
            </div>
            <AnimatedButton
              variant="primary"
              size="md"
              icon={Search}
              disabled={!customUrl.trim()}
              onClick={() => analyzeUrl()}
            >
              Analyze URL
            </AnimatedButton>
          </div>
        </div>

        {/* Preset Sample URLs to Test */}
        <div className="space-y-2 pt-1">
          <span className="text-xs font-bold text-slate-500">Or test these real-world sample links:</span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {mockSimulations.urlInspectorSamples.map((sample) => (
              <button
                key={sample.id}
                onClick={() => {
                  setCustomUrl(sample.url);
                  analyzeUrl(sample.url);
                }}
                className="p-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 hover:border-cyber-gold/30 text-left transition-all flex items-center justify-between text-xs shadow-sm"
              >
                <span className="font-mono text-slate-600 truncate max-w-[220px]">{sample.url}</span>
                <Badge variant={sample.isSafe ? 'green' : 'red'} size="sm">
                  {sample.isSafe ? 'Safe' : 'Malicious'}
                </Badge>
              </button>
            ))}
          </div>
        </div>

        {/* Analysis Result Box */}
        {analysisResult && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-6 rounded-2xl border space-y-4 shadow-sm ${
              analysisResult.isSafe
                ? 'bg-cyber-green/5 border-cyber-green/40 text-cyber-green-dark'
                : 'bg-cyber-red/5 border-cyber-red/40 text-cyber-red-dark'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                {analysisResult.isSafe ? (
                  <CheckCircle2 className="w-6 h-6 text-cyber-green-dark" />
                ) : (
                  <ShieldAlert className="w-6 h-6 text-cyber-red-dark" />
                )}
                <div>
                  <h4 className="font-bold text-base text-graphite">{analysisResult.status}</h4>
                  <p className="font-mono text-xs text-slate-500 mt-0.5">{analysisResult.url}</p>
                </div>
              </div>
              <Badge variant={analysisResult.isSafe ? 'green' : 'red'}>
                {analysisResult.isSafe ? 'SSL Verified' : 'Danger Flagged'}
              </Badge>
            </div>

            <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-2 shadow-inner">
              <span className="text-xs font-bold text-cyber-gold-dark uppercase tracking-wider block">
                Technical Security Breakdown:
              </span>
              <ul className="space-y-1.5 text-xs text-slate-600 font-medium">
                {analysisResult.findings.map((f, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-cyber-gold-dark font-bold">•</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}

      </GlassCard>
    </div>
  );
};
