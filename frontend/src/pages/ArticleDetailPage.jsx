import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  Clock, 
  ArrowLeft, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  ShieldCheck, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  RotateCcw,
  Gamepad2,
  Share2,
  Check
} from 'lucide-react';
import { GlassCard } from '../components/common/GlassCard';
import { AnimatedButton } from '../components/common/AnimatedButton';
import { Badge } from '../components/common/Badge';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { articleService } from '../services/articleService';

export const ArticleDetailPage = () => {
  const { id } = useParams();
  const { lang } = useLanguage();
  const { user, markArticleRead, addXP } = useAuth();
  const navigate = useNavigate();

  const [article, setArticle] = useState(null);
  const [selectedQuizAnswer, setSelectedQuizAnswer] = useState(null);
  const [isQuizSubmitted, setIsQuizSubmitted] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    articleService.getArticleById(id).then((data) => {
      setArticle(data);
      if (data) {
        markArticleRead(data.id, data.title);
      }
    });
  }, [id]);

  const toggleAudioNarration = () => {
    if (!('speechSynthesis' in window)) return;
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      const textToRead = `${article.title}. ${
        lang === 'hi'
          ? article.stage1SimpleExplanation.hi + ' ' + article.stage2RealExample.hi
          : article.stage1SimpleExplanation.en + ' ' + article.stage2RealExample.en
      }`;
      const utterance = new SpeechSynthesisUtterance(textToRead);
      utterance.rate = 0.95;
      utterance.onend = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleQuizSubmit = () => {
    if (selectedQuizAnswer === null) return;
    setIsQuizSubmitted(true);
    if (selectedQuizAnswer === article.stage5InteractiveChallenge.correctIndex) {
      addXP(50, `Passed challenge in article: ${article.title}`);
    }
  };

  if (!article) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center text-slate-400">
        Loading awareness module...
      </div>
    );
  }

  const isChallengeCorrect = selectedQuizAnswer === article.stage5InteractiveChallenge.correctIndex;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      
      {/* Top Breadcrumb & Action Bar */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
        <Link
          to="/articles"
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-cyber-gold-dark transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Awareness Hub
        </Link>

        <div className="flex items-center gap-2">
          {/* Audio Narration Assistant */}
          <button
            onClick={toggleAudioNarration}
            className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm ${
              isSpeaking
                ? 'bg-cyber-gold text-white border-cyber-gold-dark font-bold animate-pulse'
                : 'bg-white text-slate-600 border-slate-200 hover:border-cyber-gold/30 hover:bg-slate-50'
            }`}
          >
            {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-cyber-gold-dark" />}
            <span>{isSpeaking ? 'Stop Audio' : 'Listen Narration'}</span>
          </button>

          {/* Share Button */}
          <button
            onClick={handleShare}
            className="p-2 rounded-xl bg-white text-slate-500 hover:text-cyber-gold-dark border border-slate-200 shadow-sm transition-colors"
            title="Share Article Link"
          >
            {copiedLink ? <Check className="w-4 h-4 text-cyber-green" /> : <Share2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Article Header Card */}
      <GlassCard variant="default" className="p-6 sm:p-8 space-y-4 bg-white border border-slate-200 shadow-sm">
        <div className="flex flex-wrap items-center gap-2.5">
          <Badge variant="gold">{article.category}</Badge>
          <Badge variant={article.difficulty === 'Beginner' ? 'green' : 'purple'}>
            {article.difficulty}
          </Badge>
          <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> {article.readTime}
          </span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold font-display text-graphite leading-tight">
          {lang === 'hi' && article.titleHi ? article.titleHi : article.title}
        </h1>

        <p className="text-sm text-slate-600 font-medium leading-relaxed border-l-2 border-cyber-gold-dark pl-3 italic">
          {lang === 'hi' && article.summaryHi ? article.summaryHi : article.summary}
        </p>
      </GlassCard>

      {/* 5-STAGE PROGRESSIVE ARTICLE BODY */}
      <div className="space-y-6">
        
        {/* STAGE 1: Simple Explanation (Zero Jargon) */}
        <GlassCard variant="default" className="p-6 sm:p-8 space-y-3 bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 text-cyber-gold-dark">
            <span className="w-6 h-6 rounded-full bg-cyber-gold/10 flex items-center justify-center font-bold text-xs">1</span>
            <h3 className="font-bold text-base text-graphite">
              {lang === 'hi' ? 'सरल भाषा में समझें (What is it?)' : 'Stage 1: Simple Explanation (Plain Concept)'}
            </h3>
          </div>
          <p className="text-sm text-slate-600 font-medium leading-relaxed pt-1">
            {lang === 'hi' ? article.stage1SimpleExplanation.hi : article.stage1SimpleExplanation.en}
          </p>
        </GlassCard>

        {/* STAGE 2: Real-Life Incident / Story */}
        <GlassCard variant="default" className="p-6 sm:p-8 space-y-3 bg-gradient-to-br from-cyber-blue-light/10 to-white border border-cyber-blue/20 shadow-sm">
          <div className="flex items-center gap-2 text-cyber-blue-dark">
            <span className="w-6 h-6 rounded-full bg-cyber-blue/10 flex items-center justify-center font-bold text-xs">2</span>
            <h3 className="font-bold text-base text-graphite">
              {lang === 'hi' ? 'वास्तविक जीवन का उदाहरण (Real Case Study)' : 'Stage 2: Real-Life Incident & Story'}
            </h3>
          </div>
          <p className="text-sm text-slate-600 font-medium leading-relaxed pt-1 italic">
            "{lang === 'hi' ? article.stage2RealExample.hi : article.stage2RealExample.en}"
          </p>
        </GlassCard>

        {/* STAGE 3: Warning Signs & Red Flags */}
        <GlassCard variant="default" className="p-6 sm:p-8 space-y-4 border border-cyber-red/20 bg-cyber-red/5 shadow-sm">
          <div className="flex items-center gap-2 text-cyber-red-dark">
            <span className="w-6 h-6 rounded-full bg-cyber-red/10 flex items-center justify-center font-bold text-xs">3</span>
            <h3 className="font-bold text-base text-graphite">
              {lang === 'hi' ? 'खतरे के संकेत (Warning Signs & Red Flags)' : 'Stage 3: Warning Signs & Red Flags'}
            </h3>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {article.stage3WarningSigns.map((item, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-white border border-slate-200 flex items-start gap-2.5 shadow-sm">
                <AlertTriangle className="w-4 h-4 text-cyber-red shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-xs text-slate-600 font-medium">{item.sign}</p>
                  <Badge variant="red" size="sm">Risk: {item.risk}</Badge>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* STAGE 4: Protection Steps */}
        <GlassCard variant="default" className="p-6 sm:p-8 space-y-4 border border-cyber-green/20 bg-cyber-green/5 shadow-sm">
          <div className="flex items-center gap-2 text-cyber-green-dark">
            <span className="w-6 h-6 rounded-full bg-cyber-green/10 flex items-center justify-center font-bold text-xs">4</span>
            <h3 className="font-bold text-base text-graphite">
              {lang === 'hi' ? 'सुरक्षा के जरूरी कदम (Actionable Protection Steps)' : 'Stage 4: Actionable Defense Steps'}
            </h3>
          </div>

          <div className="space-y-2 pt-1">
            {article.stage4ProtectionSteps.map((step, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-white border border-slate-200 flex items-start gap-2.5 text-xs text-slate-600 font-medium shadow-sm">
                <CheckCircle2 className="w-4 h-4 text-cyber-green shrink-0 mt-0.5" />
                <span>{step}</span>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* STAGE 5: Interactive Knowledge Challenge */}
        <GlassCard variant="glow" glowColor="gold" className="p-6 sm:p-8 space-y-5 border border-cyber-gold/20 bg-white shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-cyber-gold-dark">
              <span className="w-6 h-6 rounded-full bg-cyber-gold/10 flex items-center justify-center font-bold text-xs">5</span>
              <h3 className="font-bold text-base text-graphite">
                {lang === 'hi' ? 'त्वरित ज्ञान चुनौती (Quick Check Challenge)' : 'Stage 5: Quick Check Challenge'}
              </h3>
            </div>
            <Badge variant="gold">+50 XP Reward</Badge>
          </div>

          <p className="text-sm font-semibold text-graphite leading-relaxed">
            {lang === 'hi' && article.stage5InteractiveChallenge.questionHi
              ? article.stage5InteractiveChallenge.questionHi
              : article.stage5InteractiveChallenge.question}
          </p>

          <div className="space-y-2.5 pt-1">
            {article.stage5InteractiveChallenge.options.map((opt, idx) => {
              const isSelected = selectedQuizAnswer === idx;
              const isCorrectOption = idx === article.stage5InteractiveChallenge.correctIndex;

              let style = 'bg-white border-slate-200 hover:border-cyber-gold/40 text-slate-600 shadow-sm';
              if (isQuizSubmitted) {
                if (isCorrectOption) {
                  style = 'bg-cyber-green/10 border-cyber-green text-cyber-green-dark';
                } else if (isSelected && !isCorrectOption) {
                  style = 'bg-cyber-red/10 border-cyber-red text-cyber-red-dark';
                } else {
                  style = 'opacity-50 bg-slate-50 border-slate-200 text-slate-400';
                }
              } else if (isSelected) {
                style = 'bg-cyber-gold/10 border-cyber-gold text-cyber-gold-dark shadow-inner';
              }

              return (
                <div
                  key={idx}
                  onClick={() => !isQuizSubmitted && setSelectedQuizAnswer(idx)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center gap-3 text-xs font-medium ${style}`}
                >
                  <span className="w-5 h-5 rounded-md bg-slate-100 flex items-center justify-center font-bold text-[11px]">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span>{opt}</span>
                </div>
              );
            })}
          </div>

          {isQuizSubmitted ? (
            <div className={`p-4 rounded-xl border space-y-2 ${
              isChallengeCorrect ? 'bg-cyber-green/10 border-cyber-green/40' : 'bg-cyber-red/10 border-cyber-red/40'
            }`}>
              <div className="flex items-center gap-2">
                {isChallengeCorrect ? (
                  <CheckCircle2 className="w-5 h-5 text-cyber-green-dark" />
                ) : (
                  <XCircle className="w-5 h-5 text-cyber-red-dark" />
                )}
                <span className="font-bold text-sm text-graphite">
                  {isChallengeCorrect ? 'Awesome! Correct Answer (+50 XP)' : 'Incorrect Solution'}
                </span>
              </div>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                {lang === 'hi' && article.stage5InteractiveChallenge.explanationHi
                  ? article.stage5InteractiveChallenge.explanationHi
                  : article.stage5InteractiveChallenge.explanation}
              </p>
            </div>
          ) : (
            <div className="pt-2 flex justify-end">
              <AnimatedButton
                size="md"
                variant="primary"
                disabled={selectedQuizAnswer === null}
                onClick={handleQuizSubmit}
              >
                Submit & Verify
              </AnimatedButton>
            </div>
          )}
        </GlassCard>

      </div>

      {/* Bottom Cross-links to Related Simulations */}
      {article.relatedSimId && (
        <div className="p-6 rounded-2xl bg-white border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
          <div>
            <span className="text-xs font-bold text-cyber-gold-dark uppercase tracking-wider block">Hands-on Practice</span>
            <h4 className="font-bold text-sm text-graphite mt-0.5">Test what you learned in the Simulator Lab</h4>
          </div>
          <AnimatedButton
            variant="purple"
            size="md"
            icon={Gamepad2}
            onClick={() => navigate(`/simulations?tab=phishing`)}
          >
            Launch Phishing Simulator ➔
          </AnimatedButton>
        </div>
      )}

    </div>
  );
};
