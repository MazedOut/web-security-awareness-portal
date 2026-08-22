import React, { useState, useEffect } from 'react';
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
  Sparkles
} from 'lucide-react';
import { GlassCard } from '../common/GlassCard';
import { AnimatedButton } from '../common/AnimatedButton';
import { Badge } from '../common/Badge';
import { ProgressBar } from '../common/ProgressBar';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { simulationService } from '../../services/simulationService';

export const QuizArena = () => {
  const { lang } = useLanguage();
  const { addXP, completeSimulation } = useAuth();
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [isQuizComplete, setIsQuizComplete] = useState(false);

  useEffect(() => {
    simulationService.getQuizQuestions().then((data) => {
      setQuestions(data);
    });
  }, []);

  const currentQ = questions[currentIndex];

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) return;
    setIsAnswerSubmitted(true);
    if (selectedAnswer === currentQ.correctIndex) {
      setScore(prev => prev + 1);
      addXP(currentQ.xp || 50, `Correctly solved quiz: ${currentQ.category}`);
    }
  };

  const handleNextQuestion = () => {
    setSelectedAnswer(null);
    setIsAnswerSubmitted(false);
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setIsQuizComplete(true);
      completeSimulation('sim-quiz-arena', score + (selectedAnswer === currentQ?.correctIndex ? 1 : 0), questions.length, 'Mastery Challenge Arena');
    }
  };

  const handleRestartQuiz = () => {
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setIsAnswerSubmitted(false);
    setScore(0);
    setIsQuizComplete(false);
  };

  if (!currentQ && !isQuizComplete) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
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
          </div>

          {!isQuizComplete && (
            <div className="flex items-center gap-3">
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
                  onClick={() => !isAnswerSubmitted && setSelectedAnswer(idx)}
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
                      : (lang === 'hi' ? 'गलत उत्तर (Incorrect)' : 'Incorrect Solution')}
                  </span>
                </div>
                <AnimatedButton size="sm" variant="primary" onClick={handleNextQuestion}>
                  {currentIndex + 1 < questions.length ? 'Next Question ➔' : 'View Results'}
                </AnimatedButton>
              </div>

              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                {lang === 'hi' && currentQ.explanationHi ? currentQ.explanationHi : currentQ.explanation}
              </p>
            </motion.div>
          ) : (
            <div className="pt-2 flex justify-end">
              <AnimatedButton
                size="md"
                variant="primary"
                disabled={selectedAnswer === null}
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
                {Math.round((score / questions.length) * 100)}%
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
