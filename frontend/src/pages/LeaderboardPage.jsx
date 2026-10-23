import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Medal, Crown, Star, Zap, Shield } from 'lucide-react';
import { GlassCard } from '../components/common/GlassCard';
import { Badge } from '../components/common/Badge';
import { useLanguage } from '../context/LanguageContext';

// Mock leaderboard data — replaced when backend is available
const MOCK_LEADERS = [
  { rank: 1, name: 'Anika Sharma', xp: 4200, level: 12, tier: 3, badge: 'SOC Analyst', score: 98 },
  { rank: 2, name: 'Rohan Verma', xp: 3850, level: 11, tier: 3, badge: 'Cyber Defender', score: 94 },
  { rank: 3, name: 'Priya Nair', xp: 3600, level: 10, tier: 2, badge: 'Cyber Defender', score: 91 },
  { rank: 4, name: 'Cyber Sentinel', xp: 3200, level: 9, tier: 2, badge: 'Digital Guardian', score: 88 },
  { rank: 5, name: 'Arjun Mehta', xp: 2900, level: 8, tier: 2, badge: 'Digital Guardian', score: 85 },
  { rank: 6, name: 'Deepa Krishnan', xp: 2600, level: 7, tier: 1, badge: 'Digital Citizen', score: 82 },
  { rank: 7, name: 'Karthik R', xp: 2400, level: 7, tier: 1, badge: 'Digital Citizen', score: 79 },
  { rank: 8, name: 'Sneha Patel', xp: 2100, level: 6, tier: 1, badge: 'Digital Citizen', score: 76 },
  { rank: 9, name: 'Vivek Singh', xp: 1850, level: 5, tier: 1, badge: 'Digital Citizen', score: 73 },
  { rank: 10, name: 'Anjali Das', xp: 1600, level: 5, tier: 1, badge: 'Digital Citizen', score: 70 },
];

const TIER_COLORS = {
  3: 'text-amber-400',
  2: 'text-cyan-400',
  1: 'text-slate-400',
};

const RANK_ICONS = {
  1: <Crown className="w-5 h-5 text-amber-400" />,
  2: <Medal className="w-5 h-5 text-slate-300" />,
  3: <Medal className="w-5 h-5 text-amber-600" />,
};

export const LeaderboardPage = () => {
  const { lang } = useLanguage();
  const [leaders, setLeaders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Try to fetch from backend; fall back to mock data
    const load = async () => {
      try {
        const res = await fetch('/api/leaderboard', { credentials: 'include' });
        if (res.ok) {
          const json = await res.json();
          setLeaders(json.leaderboard || MOCK_LEADERS);
        } else {
          setLeaders(MOCK_LEADERS);
        }
      } catch {
        setLeaders(MOCK_LEADERS);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const top3 = leaders.slice(0, 3);
  const rest = leaders.slice(3);

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-3"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-widest">
          <Trophy className="w-4 h-4" />
          {lang === 'hi' ? 'साइबर सुरक्षा चैम्पियनशिप' : 'Cyber Security Championship'}
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold font-display text-white">
          {lang === 'hi' ? 'चक्रव्यूह लीडरबोर्ड' : 'Chakravyuh Leaderboard'}
        </h1>
        <p className="text-slate-400 text-sm max-w-xl mx-auto">
          {lang === 'hi'
            ? 'शीर्ष 10 साइबर योद्धाओं की रैंकिंग — उनके XP और सुरक्षा जागरूकता स्कोर के आधार पर।'
            : 'Top 10 Cyber Defenders ranked by XP and cumulative awareness score.'}
        </p>
      </motion.div>

      {isLoading ? (
        <div className="text-center py-20 text-slate-400">
          <Shield className="w-10 h-10 mx-auto mb-3 animate-pulse" />
          <p className="text-sm">Loading leaderboard...</p>
        </div>
      ) : (
        <>
          {/* Podium — Top 3 */}
          <div className="flex items-end justify-center gap-4 sm:gap-6 pt-4">
            {/* 2nd place */}
            {top3[1] && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="flex flex-col items-center gap-2"
              >
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-slate-400/10 border-2 border-slate-300/40 flex items-center justify-center text-2xl sm:text-3xl font-black text-slate-300">
                  2
                </div>
                <div className="text-center">
                  <p className="font-bold text-white text-xs sm:text-sm truncate max-w-[90px]">{top3[1].name}</p>
                  <Badge variant="silver" size="sm">{top3[1].xp} XP</Badge>
                </div>
                <div className="w-20 sm:w-24 h-16 bg-slate-400/20 border border-slate-300/20 rounded-t-xl flex items-center justify-center">
                  <Medal className="w-6 h-6 text-slate-300" />
                </div>
              </motion.div>
            )}
            {/* 1st place */}
            {top3[0] && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0 }}
                className="flex flex-col items-center gap-2"
              >
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-amber-500/15 border-2 border-amber-400/60 flex items-center justify-center text-3xl sm:text-4xl font-black text-amber-400 shadow-lg shadow-amber-500/10">
                  1
                </div>
                <div className="text-center">
                  <p className="font-bold text-white text-sm truncate max-w-[100px]">{top3[0].name}</p>
                  <Badge variant="gold" size="sm">{top3[0].xp} XP</Badge>
                </div>
                <div className="w-24 sm:w-28 h-24 bg-amber-500/15 border border-amber-400/30 rounded-t-xl flex items-center justify-center">
                  <Crown className="w-8 h-8 text-amber-400" />
                </div>
              </motion.div>
            )}
            {/* 3rd place */}
            {top3[2] && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex flex-col items-center gap-2"
              >
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-amber-700/10 border-2 border-amber-700/40 flex items-center justify-center text-xl sm:text-2xl font-black text-amber-600">
                  3
                </div>
                <div className="text-center">
                  <p className="font-bold text-white text-xs truncate max-w-[80px]">{top3[2].name}</p>
                  <Badge variant="orange" size="sm">{top3[2].xp} XP</Badge>
                </div>
                <div className="w-16 sm:w-20 h-10 bg-amber-700/15 border border-amber-700/20 rounded-t-xl flex items-center justify-center">
                  <Medal className="w-5 h-5 text-amber-600" />
                </div>
              </motion.div>
            )}
          </div>

          {/* Ranks 4–10 */}
          <GlassCard variant="default" className="overflow-hidden bg-white/5 border border-white/10">
            <div className="divide-y divide-white/5">
              {rest.map((player, idx) => (
                <motion.div
                  key={player.rank}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="flex items-center gap-4 p-4 hover:bg-white/5 transition-colors"
                >
                  <span className="w-8 text-center font-bold text-slate-400 text-sm">
                    #{player.rank}
                  </span>

                  <div className="w-10 h-10 rounded-xl bg-slate-800 border border-white/10 flex items-center justify-center text-lg font-black text-slate-300">
                    {player.name.charAt(0)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-white text-sm truncate">{player.name}</p>
                    <p className={`text-xs font-semibold ${TIER_COLORS[player.tier]}`}>
                      {player.badge}
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="flex items-center gap-1 text-amber-400 font-bold text-sm">
                      <Zap className="w-3.5 h-3.5" />
                      {player.xp.toLocaleString()} XP
                    </div>
                    <p className="text-[10px] text-slate-400">Lv. {player.level}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </GlassCard>

          <p className="text-center text-xs text-slate-500">
            {lang === 'hi'
              ? 'स्कोर हर सिमुलेशन पूरा करने के बाद अपडेट होता है।'
              : 'Rankings update after every simulation completion.'}
          </p>
        </>
      )}
    </div>
  );
};
