import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  Award, 
  Zap, 
  HelpCircle,
  Clock,
  Sparkles,
  Loader2,
  Filter
} from 'lucide-react';
import { GlassCard } from '../common/GlassCard';
import { AnimatedButton } from '../common/AnimatedButton';
import { Badge } from '../common/Badge';
import { ProgressBar } from '../common/ProgressBar';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { simulationService } from '../../services/simulationService';

const QUESTION_TIME = 30; // seconds per question (FR-02.6)

const DIFFICULTY_LEVELS = [
  { key: 'all', label: 'All Levels', labelHi: 'सभी स्तर' },
  { key: 'beginner', label: 'Beginner', labelHi: 'शुरुआती', diff: 1 },
  { key: 'intermediate', label: 'Intermediate', labelHi: 'मध्यम', diff: 2 },
  { key: 'advanced', label: 'Advanced', labelHi: 'उन्नत', diff: 3 },
];

export const QuizArena = () => {
  const { lang } = useLanguage();
  const { addXP, completeSimulation } = useAuth();

  const [allQuestions, setAllQuestions] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [difficulty, setDifficulty] = useState('all');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [isQuizComplete, setIsQuizComplete] = useState(false);

  // Countdown timer state (FR-02.6)
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME);
  const timerRef = useRef(null);

  // AI explanation state (Items 36, 38, 42)
  const [aiExplanation, setAiExplanation] = useState(null);
  const [aiExplanationSource, setAiExplanationSource] = useState('ai');
  const [isLoadingAI, setIsLoadingAI] = useState(false);

  useEffect(() => {
    simulationService.getQuizQuestions().then((data) => {
      setAllQuestions(data);
      setQuestions(data);
    });
  }, []);

  // Filter questions by difficulty tab
  useEffect(() => {
    if (!allQuestions.length) return;
    if (difficulty === 'all') {
      setQuestions(allQuestions);
    } else {
      const diffNum = DIFFICULTY_LEVELS.find(d => d.key === difficulty)?.diff;
      const filtered = allQuestions.filter(q =>
        (q.difficulty === diffNum) ||
        (difficulty === 'beginner' && q.category?.toLowerCase().includes('beginner')) ||
        (difficulty === 'intermediate' && q.category?.toLowerCase().includes('intermediate')) ||
        (difficulty === 'advanced' && q.category?.toLowerCase().includes('advanced')) ||
        !diffNum
      );
      setQuestions(filtered.length ? filtered : allQuestions);
    }
    handleRestartQuiz();
  }, [difficulty, allQuestions]);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const startTimer = useCallback(() => {
    stopTimer();
    setTimeLeft(QUESTION_TIME);
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          timerRef.current = null;
          // Auto-submit as incorrect on timeout
          setIsAnswerSubmitted(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [stopTimer]);

  // Start timer on new question
  useEffect(() => {
    if (!isAnswerSubmitted && questions.length > 0 && !isQuizComplete) {
      startTimer();
    }
    return stopTimer;
  }, [currentIndex, questions.length, isQuizComplete]);

  const currentQ = questions[currentIndex];

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) return;
    stopTimer();
    setIsAnswerSubmitted(true);
    setAiExplanation(null);
    if (selectedAnswer === currentQ.correctIndex) {
      setScore(prev => prev + 1);
      addXP(currentQ.xp || 50, `Correctly solved quiz: ${currentQ.category}`);
    }
  };

  const handleNextQuestion = () => {
    stopTimer();
    setSelectedAnswer(null);
    setIsAnswerSubmitted(false);
    setAiExplanation(null);
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setIsQuizComplete(true);
      completeSimulation('sim-quiz-arena', score + (selectedAnswer === currentQ?.correctIndex ? 1 : 0), questions.length, 'Mastery Challenge Arena');
    }
  };

  const handleRestartQuiz = () => {
    stopTimer();
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setIsAnswerSubmitted(false);
    setScore(0);
    setIsQuizComplete(false);
    setAiExplanation(null);
  };

  // "Explain This with AI" handler (Items 36, 38, 42)
  const handleAIExplain = async () => {
    if (!currentQ || isLoadingAI) return;
    setIsLoadingAI(true);
    setAiExplanation(null);
    try {
      const res = await fetch('/api/ai-explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: currentQ.question || currentQ.prompt,
          user_answer: currentQ.options?.[selectedAnswer] || '',
          is_correct: selectedAnswer === currentQ.correctIndex,
          difficulty: currentQ.difficulty || 'intermediate',
          static_fallback: currentQ.explanation || '',
        }),
        credentials: 'include',
      });
      if (res.ok) {
        const json = await res.json();
        setAiExplanation(json.explanation || json.feedback);
        setAiExplanationSource(json.is_ai ? 'ai' : 'static_fallback');
      } else {
        // Fall back to static explanation
        setAiExplanation(currentQ.explanation || 'Review the explanation above to understand this concept.');
        setAiExplanationSource('static_fallback');
      }
    } catch {
      setAiExplanation(currentQ.explanation || 'AI Mentor is currently offline. Review the explanation above.');
      setAiExplanationSource('static_fallback');
    } finally {
      setIsLoadingAI(false);
    }
  };

  if (!currentQ && !isQuizComplete) return null;

  const timerPct = (timeLeft / QUESTION_TIME) * 100;
  const timerColor = timeLeft > 15 ? 'text-cyber-green-dark' : timeLeft > 8 ? 'text-amber-500' : 'text-cyber-red-dark';

  return (
    <div className="space-y-6">
      {/* Header with difficulty filter */}
      <GlassCard variant="default" className="p-6 bg-white border border-slate-200 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold font-display text-graphite">
                {lang === 'hi' ? 'साइबर रक्षा क्विज़ एवं चैलेंज एरिना' : 'Cyber Defense Mastery Arena'}
              </h3>
              <Badge variant="gold">XP Challenge</Badge>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-1">
              {lang === 'hi'
                ? 'वास्तविक साइबर परिदृश्यों पर आधारित प्रश्नों के उत्तर दें और अपना सुरक्षा स्कोर बढ़ाएं।'
                : 'Test your threat intuition across phishing, password defense, and social engineering scenarios.'}
            </p>
            {/* Difficulty filter tabs (Item 29) */}
            <div className="flex items-center gap-2 mt-3 flex-wrap">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              {DIFFICULTY_LEVELS.map(d => (
                <button
                  key={d.key}
                  onClick={() => setDifficulty(d.key)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold transition-all border ${
                    difficulty === d.key
                      ? 'bg-cyber-gold text-slate-950 border-cyber-gold shadow-sm'
                      : 'bg-slate-100 text-slate-600 border-slate-200 hover:border-cyber-gold/40'
                  }`}
                >
                  {lang === 'hi' ? d.labelHi : d.label}
                </button>
              ))}
            </div>
          </div>

          {!isQuizComplete && (
            <div className="flex flex-col items-end gap-2 shrink-0">
              <span className="text-xs font-bold text-cyber-gold-dark">
                Question {currentIndex + 1} of {questions.length}
              </span>
              <ProgressBar
                value={currentIndex + 1}
                max={questions.length}
                color="gold"
                showPercentage={false}
                className="w-28"
              />
              {/* Countdown timer display (FR-02.6) */}
              <div className={`flex items-center gap-1.5 font-bold text-sm ${timerColor}`}>
                <Clock className="w-4 h-4" />
                <span>{timeLeft}s</span>
                <div className="w-16 h-1.5 rounded-full bg-slate-200 overflow-hidden">
                  <motion.div
                    className={`h-full rounded-full ${timeLeft > 15 ? 'bg-cyber-green' : timeLeft > 8 ? 'bg-amber-400' : 'bg-red-500'}`}
                    style={{ width: `${timerPct}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </GlassCard>

      {/* Main Quiz Body */}
      {!isQuizComplete ? (
        <GlassCard variant="default" className="p-6 lg:p-8 space-y-6 bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <Badge variant="purple">{currentQ.category}</Badge>
            <div className="flex items-center gap-1 text-xs text-cyber-gold-dark font-bold">
              <Zap className="w-3.5 h-3.5" /> +{currentQ.xp || 50} XP
            </div>
          </div>

          <h3 className="text-base sm:text-lg font-bold text-graphite leading-relaxed">
            {lang === 'hi' && currentQ.questionHi ? currentQ.questionHi : currentQ.question}
          </h3>

          {/* Options Grid */}
          {timeLeft === 0 && !isAnswerSubmitted ? (
            <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-semibold text-center">
              ⏱ Time's up! Moving to feedback...
            </div>
          ) : (
            <div className="space-y-3 pt-2">
              {currentQ.options.map((opt, idx) => {
                const isSelected = selectedAnswer === idx;
                const isCorrect = idx === currentQ.correctIndex;

                let optionStyle = 'bg-white border-slate-200 hover:border-cyber-gold/40 text-slate-600 shadow-sm';
                if (isAnswerSubmitted) {
                  if (isCorrect) {
                    optionStyle = 'bg-cyber-green/10 border-cyber-green text-cyber-green-dark';
                  } else if (isSelected && !isCorrect) {
                    optionStyle = 'bg-cyber-red/10 border-cyber-red text-cyber-red-dark';
                  } else {
                    optionStyle = 'opacity-50 bg-slate-50 border-slate-200 text-slate-400';
                  }
                } else if (isSelected) {
                  optionStyle = 'bg-cyber-gold/10 border-cyber-gold text-cyber-gold-dark shadow-inner';
                }

                return (
                  <motion.div
                    key={idx}
                    whileHover={!isAnswerSubmitted ? { scale: 1.01, x: 4 } : {}}
                    onClick={() => !isAnswerSubmitted && timeLeft > 0 && setSelectedAnswer(idx)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start gap-3.5 ${optionStyle}`}
                  >
                    <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                      isSelected ? 'bg-cyber-gold text-white' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {String.fromCharCode(65 + idx)}
                    </div>
                    <span className="text-xs sm:text-sm font-medium leading-relaxed">{opt}</span>
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* Feedback & Next Button */}
          {isAnswerSubmitted ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 shadow-inner"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {selectedAnswer === currentQ.correctIndex ? (
                    <CheckCircle2 className="w-5 h-5 text-cyber-green-dark" />
                  ) : (
                    <XCircle className="w-5 h-5 text-cyber-red-dark" />
                  )}
                  <span className="font-bold text-sm text-graphite">
                    {selectedAnswer === currentQ.correctIndex
                      ? (lang === 'hi' ? 'बिल्कुल सही! (Correct)' : 'Spot On! Correct Answer')
                      : (timeLeft === 0
                          ? (lang === 'hi' ? 'समय समाप्त! (Time Up)' : 'Time Up!')
                          : (lang === 'hi' ? 'गलत उत्तर (Incorrect)' : 'Incorrect Solution'))}
                  </span>
                </div>
                <AnimatedButton size="sm" variant="primary" onClick={handleNextQuestion}>
                  {currentIndex + 1 < questions.length ? 'Next Question ➔' : 'View Results'}
                </AnimatedButton>
              </div>

              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                {lang === 'hi' && currentQ.explanationHi ? currentQ.explanationHi : currentQ.explanation}
              </p>

              {/* "Explain This with AI" button (Items 36, 38, 42) */}
              <div className="pt-2 border-t border-slate-200">
                {!aiExplanation ? (
                  <AnimatedButton
                    size="sm"
                    variant="glass"
                    icon={isLoadingAI ? Loader2 : Sparkles}
                    onClick={handleAIExplain}
                    disabled={isLoadingAI}
                    className="text-purple-700"
                  >
                    {isLoadingAI
                      ? 'Fetching AI Explanation…'
                      : (lang === 'hi' ? '✨ AI से समझाएं' : '✨ Explain This with AI')}
                  </AnimatedButton>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-2"
                  >
                    <div className="flex items-center gap-1.5">
                      {aiExplanationSource === 'ai' ? (
                        <>
                          <Sparkles className="w-3.5 h-3.5 text-purple-500" />
                          <span className="text-[10px] uppercase font-bold text-purple-600 tracking-wider">
                            AI Explanation (Gemini 2.0 Flash)
                          </span>
                        </>
                      ) : (
                        <>
                          <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
                          <span className="text-[10px] uppercase font-bold text-amber-600 tracking-wider">
                            Static Fallback Explanation (Offline)
                          </span>
                        </>
                      )}
                    </div>
                    <p className={`text-xs leading-relaxed rounded-lg p-3 border ${
                      aiExplanationSource === 'ai'
                        ? 'text-slate-700 bg-purple-50 border-purple-200/60'
                        : 'text-slate-700 bg-amber-50 border-amber-200/60'
                    }`}>
                      {aiExplanation}
                    </p>
                  </motion.div>
                )}
              </div>
            </motion.div>
          ) : (
            <div className="pt-2 flex justify-end">
              <AnimatedButton
                size="md"
                variant="primary"
                disabled={selectedAnswer === null || timeLeft === 0}
                onClick={handleSubmitAnswer}
              >
                Submit Answer
              </AnimatedButton>
            </div>
          )}
        </GlassCard>
      ) : (
        /* Quiz Complete Results Card */
        <GlassCard variant="glow" glowColor="gold" className="p-8 text-center space-y-6 max-w-xl mx-auto bg-white border border-cyber-gold/20 shadow-xl">
          <div className="w-16 h-16 rounded-2xl bg-cyber-gold/10 border border-cyber-gold/30 flex items-center justify-center mx-auto text-cyber-gold-dark shadow-sm">
            <Trophy className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h3 className="text-2xl font-bold font-display text-graphite">
              {lang === 'hi' ? 'क्विज़ पूरा हुआ!' : 'Mastery Arena Completed!'}
            </h3>
            <p className="text-sm font-medium text-slate-500">
              You scored <span className="text-cyber-gold-dark font-bold text-sm">{score} / {questions.length}</span> correct answers.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-around shadow-inner">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Total XP Earned</span>
              <span className="text-lg font-bold font-display text-cyber-gold-dark">+{score * 50} XP</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Accuracy</span>
              <span className="text-lg font-bold font-display text-cyber-green-dark">
                {questions.length > 0 ? Math.round((score / questions.length) * 100) : 0}%
              </span>
            </div>
          </div>

          <AnimatedButton variant="primary" size="md" icon={RotateCcw} onClick={handleRestartQuiz}>
            Retake Arena Challenge
          </AnimatedButton>
        </GlassCard>
      )}
    </div>
  );
};
