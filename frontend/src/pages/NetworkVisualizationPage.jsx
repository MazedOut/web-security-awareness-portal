import React from 'react';
import { NetworkVisualizer } from '../components/network/NetworkVisualizer';
import { GlassCard } from '../components/common/GlassCard';
import { Badge } from '../components/common/Badge';
import { useLanguage } from '../context/LanguageContext';

export const NetworkVisualizationPage = () => {
  const { lang, t } = useLanguage();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <GlassCard variant="default" className="p-6 sm:p-8 space-y-3 bg-white border border-slate-200">
        <div className="flex items-center gap-2">
          <Badge variant="blue">Network Telemetry Simulator</Badge>
          <Badge variant="green">Packet Inspector</Badge>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold font-display text-graphite mt-2">
          {lang === 'hi' ? 'इंटरनेट नेटवर्क एवं डेटा ट्रांसमिशन लैब' : 'Network Awareness & Data Movement Visualizer'}
        </h1>
        <p className="text-sm text-slate-600 max-w-3xl leading-relaxed">
          {lang === 'hi'
            ? 'समझें कि आपके फोन पर टाइप किया गया पासवर्ड इंटरनेट के विभिन्न नोड्स (राउटर, आईएसपी, सर्वर) से होकर कैसे सुरक्षित या असुरक्षित गुजरता है।'
            : 'Trace end-to-end data packets moving from your device through local routers, telecom ISPs, and cloud backbones to banking servers. Toggle between HTTPS Protected mode and plaintext Vulnerable mode.'}
        </p>
      </GlassCard>

      {/* Network Visualizer Component */}
      <NetworkVisualizer standalone={true} />
    </div>
  );
};
