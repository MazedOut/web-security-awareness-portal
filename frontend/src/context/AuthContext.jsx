import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';

const AuthContext = createContext();

const INITIAL_USER = {
  id: 'guest-101',
  name: 'Cyber Sentinel',
  email: 'guardian@chakravyuh.safe',
  role: 'defender',
  level: 3,
  xp: 850,
  xpNextLevel: 1200,
  awarenessScore: 780, // Out of 1000
  streakDays: 4,
  completedSims: ['sim-phishing-1', 'sim-password-1'],
  readArticles: ['art-web-basics', 'art-phishing-101'],
  watchedVideos: ['vid-phishing-intro'],
  competencies: {
    phishing: 85,
    passwords: 90,
    socialEng: 70,
    safeBrowsing: 80,
    deviceSafety: 65,
  },
  badges: [
    { id: 'badge-first-step', name: 'Digital Scout', icon: 'Shield', description: 'Began the awareness journey on Chakravyuh', unlockedAt: '2026-08-20' },
    { id: 'badge-phish-hunter', name: 'Phish Detective', icon: 'MailCheck', description: 'Identified 3 deceptive phishing links', unlockedAt: '2026-08-21' },
    { id: 'badge-key-master', name: 'Cipher Sentinel', icon: 'KeyRound', description: 'Created a NIST-compliant fortress passphrase', unlockedAt: '2026-08-22' },
  ],
  checklist: [
    { id: 'chk-1', title: 'Enable 2-Step Verification (2FA) on Primary Email', done: true, category: 'Account' },
    { id: 'chk-2', title: 'Switch to a Password Manager & Unique Passwords', done: true, category: 'Credentials' },
    { id: 'chk-3', title: 'Audit and Revoke Unused Mobile App Permissions', done: false, category: 'Device' },
    { id: 'chk-4', title: 'Disable Auto-Connect to Open Public Wi-Fi', done: false, category: 'Network' },
    { id: 'chk-5', title: 'Verify Caller Identity before Sharing Banking Info', done: true, category: 'Social' },
  ],
  activityLog: [
    { id: 'act-1', text: 'Analyzed Suspicious Banking Email in Phishing Simulator', xp: '+60 XP', timestamp: '10 mins ago', type: 'sim' },
    { id: 'act-2', text: 'Completed Article: "Decoding Scam Callers & Social Traps"', xp: '+40 XP', timestamp: '2 hours ago', type: 'article' },
    { id: 'act-3', text: 'Strengthened Master Password Entropy to 94 bits', xp: '+50 XP', timestamp: 'Yesterday', type: 'password' },
  ]
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('chakravyuh_user');
    return saved ? JSON.parse(saved) : INITIAL_USER;
  });

  const [isAuthenticated, setIsAuthenticated] = useState(true);

  useEffect(() => {
    localStorage.setItem('chakravyuh_user', JSON.stringify(user));
  }, [user]);

  const triggerLevelUpConfetti = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#F59E0B', '#10B981', '#3B82F6', '#8B5CF6']
      });
    } catch (e) {}
  };

  const addXP = (amount, reason = 'Activity completed') => {
    setUser(prev => {
      const newXP = prev.xp + amount;
      let newLevel = prev.level;
      let newXpNext = prev.xpNextLevel;
      let newScore = Math.min(1000, prev.awarenessScore + Math.floor(amount / 5));

      if (newXP >= prev.xpNextLevel) {
        newLevel += 1;
        newXpNext = Math.floor(prev.xpNextLevel * 1.5);
        triggerLevelUpConfetti();
      }

      const newActivity = {
        id: `act-${Date.now()}`,
        text: reason,
        xp: `+${amount} XP`,
        timestamp: 'Just now',
        type: 'general'
      };

      return {
        ...prev,
        xp: newXP,
        level: newLevel,
        xpNextLevel: newXpNext,
        awarenessScore: newScore,
        activityLog: [newActivity, ...prev.activityLog.slice(0, 9)]
      };
    });
  };

  const completeSimulation = (simId, score = 100, maxScore = 100, name = 'Simulation') => {
    setUser(prev => {
      if (prev.completedSims.includes(simId)) {
        return prev;
      }
      const earnedXP = Math.round((score / maxScore) * 100);
      return {
        ...prev,
        completedSims: [...prev.completedSims, simId],
        xp: prev.xp + earnedXP,
        awarenessScore: Math.min(1000, prev.awarenessScore + 25),
        activityLog: [
          {
            id: `act-${Date.now()}`,
            text: `Successfully passed ${name} (${score}/${maxScore})`,
            xp: `+${earnedXP} XP`,
            timestamp: 'Just now',
            type: 'sim'
          },
          ...prev.activityLog.slice(0, 9)
        ]
      };
    });
  };

  const markArticleRead = (articleId, title = 'Article') => {
    setUser(prev => {
      if (prev.readArticles.includes(articleId)) return prev;
      return {
        ...prev,
        readArticles: [...prev.readArticles, articleId],
        xp: prev.xp + 40,
        awarenessScore: Math.min(1000, prev.awarenessScore + 15),
        activityLog: [
          {
            id: `act-${Date.now()}`,
            text: `Read Article: "${title}"`,
            xp: '+40 XP',
            timestamp: 'Just now',
            type: 'article'
          },
          ...prev.activityLog.slice(0, 9)
        ]
      };
    });
  };

  const markVideoWatched = (videoId, title = 'Video') => {
    setUser(prev => {
      if (prev.watchedVideos.includes(videoId)) return prev;
      return {
        ...prev,
        watchedVideos: [...prev.watchedVideos, videoId],
        xp: prev.xp + 50,
        awarenessScore: Math.min(1000, prev.awarenessScore + 20),
        activityLog: [
          {
            id: `act-${Date.now()}`,
            text: `Watched Video Masterclass: "${title}"`,
            xp: '+50 XP',
            timestamp: 'Just now',
            type: 'video'
          },
          ...prev.activityLog.slice(0, 9)
        ]
      };
    });
  };

  const toggleChecklistItem = (itemId) => {
    setUser(prev => {
      const updated = prev.checklist.map(item =>
        item.id === itemId ? { ...item, done: !item.done } : item
      );
      return { ...prev, checklist: updated };
    });
  };

  const login = (email, password) => {
    const name = email.split('@')[0];
    const newUser = {
      ...INITIAL_USER,
      name: name.charAt(0).toUpperCase() + name.slice(1),
      email
    };
    setUser(newUser);
    setIsAuthenticated(true);
  };

  const register = (name, email, password) => {
    const newUser = {
      ...INITIAL_USER,
      name,
      email,
      xp: 100,
      awarenessScore: 400,
      completedSims: [],
      readArticles: [],
      watchedVideos: [],
    };
    setUser(newUser);
    setIsAuthenticated(true);
  };

  const loginAsGuest = () => {
    setUser(INITIAL_USER);
    setIsAuthenticated(true);
  };

  const logout = () => {
    setUser(INITIAL_USER);
    setIsAuthenticated(false);
  };

  const getRankTitle = (score) => {
    if (score >= 900) return { title: 'Chakravyuh Grandmaster', color: 'text-cyber-gold', badge: 'Apex Defender' };
    if (score >= 750) return { title: 'Cyber Sentinel', color: 'text-cyber-green', badge: 'Advanced Guard' };
    if (score >= 500) return { title: 'Digital Guardian', color: 'text-cyber-blue', badge: 'Intermediate' };
    return { title: 'Cyber Scout', color: 'text-slate-300', badge: 'Beginner' };
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        register,
        loginAsGuest,
        logout,
        addXP,
        completeSimulation,
        markArticleRead,
        markVideoWatched,
        toggleChecklistItem,
        getRankTitle
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
