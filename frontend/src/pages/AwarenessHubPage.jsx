import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  BookOpen, 
  Search, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  ArrowRight, 
  Flame,
  Shield,
  Gamepad2
} from 'lucide-react';
import { GlassCard } from '../components/common/GlassCard';
import { Badge } from '../components/common/Badge';
import { ProgressBar } from '../components/common/ProgressBar';
import { AnimatedButton } from '../components/common/AnimatedButton';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { articleService } from '../services/articleService';
import { SecurityInsightsFeed } from '../components/awareness/SecurityInsightsFeed';

export const AwarenessHubPage = () => {
  const { lang, t } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [articles, setArticles] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('insights'); // Default to insights feed as it's the new feature

  useEffect(() => {
    articleService.getAllArticles().then(setArticles);
  }, []);

  const categories = [
    'All',
    'Web Security Basics',
    'Phishing Awareness',
    'Password Safety',
    'Social Engineering',
    'Safe Browsing',
    'Emerging Threats',
  ];

  const filteredArticles = articles.filter((art) => {
    const matchesCategory = selectedCategory === 'All' || art.category === selectedCategory;
    const matchesSearch =
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (art.titleHi && art.titleHi.includes(searchQuery));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      
      {/* Header Banner */}
      <GlassCard variant="default" className="p-6 sm:p-8 space-y-4 bg-white border border-slate-200">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Badge variant="gold">Articles First Track</Badge>
              <Badge variant="green">Zero Technical Jargon</Badge>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold font-display text-graphite mt-2">
              {lang === 'hi' ? 'जागरूकता हब: 5-चरणीय साइबर सुरक्षा ज्ञान' : 'Awareness Hub: Step-by-Step Cyber Defense'}
            </h1>
            <p className="text-sm text-slate-600 mt-1 max-w-2xl">
              {lang === 'hi'
                ? 'प्रत्येक विषय को 5 चरणों में समझें: सरल व्याख्या ➔ वास्तविक उदाहरण ➔ चेतावनी के संकेत ➔ सुरक्षा कदम ➔ त्वरित चुनौती।'
                : 'Every topic is built on our 5-stage blueprint: Simple Explanation ➔ Real Story ➔ Red Flags ➔ Protection Steps ➔ Interactive Challenge.'}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 shrink-0 text-center shadow-sm">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Reading Progress</span>
            <span className="text-2xl font-bold font-sans tabular-nums text-cyber-gold-dark">
              {user.readArticles?.length || 0} / {articles.length}
            </span>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="pt-4 border-t border-slate-200 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          
          {/* Category Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all shadow-sm ${
                  selectedCategory === cat
                    ? 'bg-cyber-gold text-white'
                    : 'bg-white text-slate-600 hover:text-cyber-gold-dark border border-slate-200 hover:border-cyber-gold/30 hover:bg-slate-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative min-w-[240px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search topics..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-graphite placeholder-slate-400 text-sm focus:outline-none focus:border-cyber-gold/50 focus:ring-1 focus:ring-cyber-gold/20 shadow-inner"
            />
          </div>

        </div>
      </GlassCard>

      {/* Content Tabs */}
      <div className="flex items-center gap-4 border-b border-slate-200 pb-4">
        <button
          onClick={() => setActiveTab('articles')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-sm ${
            activeTab === 'articles'
              ? 'bg-cyber-gold text-white border-cyber-gold/20'
              : 'text-slate-500 hover:text-cyber-gold-dark hover:bg-slate-50 border border-transparent'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          {lang === 'hi' ? 'बुनियादी लेख' : 'Core Articles'}
        </button>
        <button
          onClick={() => setActiveTab('insights')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-sm ${
            activeTab === 'insights'
              ? 'bg-cyber-green text-white border-cyber-green/20'
              : 'text-slate-500 hover:text-cyber-green-dark hover:bg-slate-50 border border-transparent'
          }`}
        >
          <Flame className="w-4 h-4" />
          {lang === 'hi' ? 'लाइव साइबर न्यूज़' : 'Live Cyber Feed'}
        </button>
      </div>

      {activeTab === 'articles' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.map((art) => {
            const isRead = user.readArticles?.includes(art.id);
            return (
              <GlassCard
                key={art.id}
                variant="interactive"
                onClick={() => navigate(`/articles/${art.id}`)}
                className="p-6 space-y-4 flex flex-col justify-between group relative overflow-hidden bg-white hover:border-cyber-gold/30"
              >
                {isRead && (
                  <div className="absolute top-4 right-4 flex items-center gap-1 text-[11px] font-bold text-cyber-green-dark bg-cyber-green/10 px-2 py-0.5 rounded-full border border-cyber-green/30">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Read
                  </div>
                )}

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Badge variant={art.difficulty === 'Beginner' ? 'green' : art.difficulty === 'Intermediate' ? 'gold' : 'purple'} size="sm">
                      {art.difficulty}
                    </Badge>
                    <span className="text-[11px] text-slate-500 flex items-center gap-1 font-medium">
                      <Clock className="w-3 h-3" /> {art.readTime}
                    </span>
                  </div>

                  <h3 className="font-bold text-base text-graphite group-hover:text-cyber-gold-dark transition-colors leading-snug">
                    {lang === 'hi' && art.titleHi ? art.titleHi : art.title}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                    {lang === 'hi' && art.summaryHi ? art.summaryHi : art.summary}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">{art.category}</span>
                  <span className="text-cyber-gold-dark font-semibold group-hover:translate-x-1 transition-transform flex items-center gap-1">
                    Start Reading <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </GlassCard>
            );
          })}
        </div>
      ) : (
        <SecurityInsightsFeed />
      )}

    </div>
  );
};
