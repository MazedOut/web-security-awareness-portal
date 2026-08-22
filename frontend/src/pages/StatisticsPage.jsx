import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  Activity, 
  TrendingUp, 
  ShieldAlert, 
  KeyRound, 
  DollarSign, 
  Flame, 
  ShieldCheck, 
  Globe,
  Radio
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar 
} from 'recharts';
import { GlassCard } from '../components/common/GlassCard';
import { StatCard } from '../components/common/StatCard';
import { Badge } from '../components/common/Badge';
import { HeritageSeparator } from '../components/common/HeritageSeparator';
import { useLanguage } from '../context/LanguageContext';
import { statsService } from '../services/statsService';

export const StatisticsPage = () => {
  const { lang, t } = useLanguage();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    statsService.getCyberStatistics().then(setStats);
  }, []);

  if (!stats) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 relative z-10">
      
      {/* Header Banner */}
      <HeritageSeparator className="my-2" />
      <GlassCard variant="default" className="p-6 sm:p-8 space-y-3 bg-white border border-slate-200">
        <div className="flex items-center gap-2">
          <Badge variant="purple">Real-World Threat Telemetry</Badge>
          <Badge variant="gold">Global & India Cyber Indicators</Badge>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold font-display text-graphite mt-2">
          {lang === 'hi' ? 'वास्तविक साइबर क्राइम आँकड़े एवं वैश्विक रुझान' : 'Global Cybersecurity Statistics & Threat Metrics'}
        </h1>
        <p className="text-sm text-slate-600 max-w-3xl leading-relaxed">
          {lang === 'hi'
            ? 'वैश्विक साइबर हमलों, फिशिंग अनुपातों, पासवर्ड क्रैकिंग समय और वित्तीय धोखाधड़ी के वास्तविक प्रमाण-आधारित आँकड़े।'
            : 'Aggregated real-world cyber threat telemetry based on global data from CERT-In, IBM X-Force, and Verizon DBIR reports.'}
        </p>
      </GlassCard>

      {/* 4 Headline Real-World Indicators */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.headlineMetrics.map((m) => (
          <StatCard
            key={m.id}
            label={lang === 'hi' && m.labelHi ? m.labelHi : m.label}
            value={m.value}
            prefix={m.prefix || ''}
            suffix={m.suffix || ''}
            trend={m.trend}
            trendLabel={m.change}
            color={m.color}
            description={m.description}
          />
        ))}
      </div>

      {/* Attack Incident Trends & Vector Distribution Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Monthly Incident Volume Area Chart */}
        <div className="lg:col-span-7">
          <GlassCard variant="default" className="p-6 space-y-4 h-full flex flex-col justify-between bg-white border-slate-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base text-graphite font-display">
                  Monthly Global Cyber Incident Trends (2026)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Volume of intercepted attacks vs phishing vectors
                </p>
              </div>
              <Badge variant="red">Surging</Badge>
            </div>

            <div className="w-full h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats.monthlyAttackTrends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorAttacks" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#EF4444" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorPhish" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#F59E0B" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(15,23,42,0.08)" />
                  <XAxis dataKey="month" stroke="#64748B" tick={{ fontSize: 11 }} />
                  <YAxis stroke="#64748B" tick={{ fontSize: 11 }} />
                  <RechartsTooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#E2E8F0', borderRadius: '12px', fontSize: '12px', color: '#0F172A' }} />
                  <Area type="monotone" dataKey="attacks" stroke="#EF4444" fillOpacity={1} fill="url(#colorAttacks)" name="Total Attacks" />
                  <Area type="monotone" dataKey="phishing" stroke="#F59E0B" fillOpacity={1} fill="url(#colorPhish)" name="Phishing Influx" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-rose-500" /> Total Attacks</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-amber-500" /> Phishing Campaigns</span>
            </div>
          </GlassCard>
        </div>

        {/* Primary Attack Vectors Donut Chart */}
        <div className="lg:col-span-5">
          <GlassCard variant="default" className="p-6 space-y-4 h-full flex flex-col justify-between bg-white border-slate-200 shadow-sm">
            <div>
              <h3 className="font-bold text-base text-graphite font-display">
                Initial Compromise Vectors (%)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                How attackers successfully enter target organizations
              </p>
            </div>

            <div className="w-full h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.attackVectorsDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {stats.attackVectorsDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#E2E8F0', borderRadius: '12px', fontSize: '12px', color: '#0F172A' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-1.5 pt-2 border-t border-slate-100">
              {stats.attackVectorsDistribution.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs text-slate-600 font-medium">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full shadow-sm" style={{ backgroundColor: item.color }} />
                    <span>{item.name}</span>
                  </div>
                  <span className="font-mono font-bold text-graphite">{item.value}%</span>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>

      </div>

      {/* Password Cracking Times Matrix */}
      <GlassCard variant="default" className="p-6 sm:p-8 space-y-5 bg-white border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-lg text-graphite font-display flex items-center gap-2">
              <KeyRound className="w-5 h-5 text-cyber-gold-dark" />
              Password Length vs. Cracking Time Matrix (GPU Hashcat 2026)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Time required for a commodity 8x RTX 4090 GPU cluster to exhaust all permutations.
            </p>
          </div>
          <Badge variant="gold">NIST Benchmark</Badge>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-sm">
          <table className="w-full text-left text-xs bg-slate-50">
            <thead className="bg-slate-100">
              <tr className="border-b border-slate-200 text-slate-600">
                <th className="py-3 px-4 font-bold">Length</th>
                <th className="py-3 px-4 font-bold">Numbers Only</th>
                <th className="py-3 px-4 font-bold">Lowercase Only</th>
                <th className="py-3 px-4 font-bold">Mixed Case Letters</th>
                <th className="py-3 px-4 font-bold">With Numbers & Symbols</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-mono">
              {stats.passwordCrackingMatrix.map((row, idx) => (
                <tr key={idx} className="hover:bg-white transition-colors">
                  <td className="py-3.5 px-4 font-sans font-bold text-graphite bg-white">{row.length}</td>
                  <td className="py-3.5 px-4 text-cyber-red-dark font-medium">{row.numbersOnly}</td>
                  <td className="py-3.5 px-4 text-cyber-gold-dark font-medium">{row.lowerOnly}</td>
                  <td className="py-3.5 px-4 text-cyber-blue-dark font-medium">{row.mixedCase}</td>
                  <td className="py-3.5 px-4 font-bold text-cyber-green-dark">{row.withSymbols}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>

      {/* Targeted Industry Sectors Horizontal Bars */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        <div className="lg:col-span-6">
          <GlassCard variant="default" className="p-6 space-y-4 bg-white border border-slate-200 shadow-sm">
            <h3 className="font-bold text-base text-graphite font-display">
              Targeted Industry Sectors (%)
            </h3>
            <p className="text-xs text-slate-500">
              Distribution of cyber extortion and breach targets
            </p>

            <div className="w-full h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.targetedSectors} layout="vertical" margin={{ top: 10, right: 20, left: 40, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(15,23,42,0.08)" />
                  <XAxis type="number" stroke="#64748B" tick={{ fontSize: 11 }} />
                  <YAxis type="category" dataKey="sector" stroke="#64748B" tick={{ fontSize: 10 }} width={120} />
                  <RechartsTooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#E2E8F0', borderRadius: '12px', fontSize: '12px', color: '#0F172A' }} />
                  <Bar dataKey="percentage" fill="#B45309" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>
        </div>

        {/* National / Regional Cybercrime Insights */}
        <div className="lg:col-span-6 space-y-3">
          <h3 className="font-bold text-base text-graphite font-display">
            National Cybercrime Insights & Recovery
          </h3>

          <div className="space-y-3">
            {stats.nationalInsights.map((insight, idx) => (
              <GlassCard key={idx} variant="subtle" className="p-4 space-y-1.5 border border-slate-200 bg-slate-50 shadow-sm">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-xs text-graphite">{insight.title}</h4>
                  <span className="text-xs font-mono font-bold text-cyber-gold-dark">{insight.stat}</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">{insight.note}</p>
              </GlassCard>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
