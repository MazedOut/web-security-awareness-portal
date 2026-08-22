import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Sparkles, 
  Bot, 
  User, 
  Trash2, 
  Globe, 
  ShieldCheck, 
  AlertTriangle, 
  ExternalLink,
  PhoneCall,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';
import { aiService } from '../../services/aiService';
import { AnimatedButton } from '../common/AnimatedButton';
import { Badge } from '../common/Badge';

export const AIAssistantDrawer = ({ isFullscreen = false }) => {
  const { lang, t } = useLanguage();
  const [messages, setMessages] = useState([
    {
      id: 'init-1',
      sender: 'ai',
      text: lang === 'hi'
        ? `नमस्ते! मैं **चक्रव्यूह साथी** हूँ।\n\nआप मुझसे किसी भी संदिग्ध SMS, फ्रॉड कॉल, पासवर्ड सुरक्षा या डिजिटल फ्रॉड के बारे में पूछ सकते हैं। आप हिंदी, इंग्लिश या हिंग्लिश में बात कर सकते हैं!`
        : `Hello! I am **Chakravyuh Saathi**, your Security Companion.\n\nI can help you analyze suspicious SMS/emails, understand scams, build uncrackable passphrases, and stay protected. How can I assist you today?`,
      timestamp: 'Just now',
    },
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = async (queryToSend) => {
    const text = queryToSend || inputQuery;
    if (!text.trim() || isLoading) return;

    const userMsg = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setIsLoading(true);

    try {
      const aiResponseText = await aiService.askAssistant(text, lang);
      const aiMsg = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: aiResponseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      const errorMsg = {
        id: `err-${Date.now()}`,
        sender: 'ai',
        text: 'I am experiencing connectivity limits. Remember: Never share your OTP, PIN, or banking passwords with anyone, and call 1930 for urgent cyber fraud assistance.',
        timestamp: 'Just now',
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: `reset-${Date.now()}`,
        sender: 'ai',
        text: lang === 'hi' 
          ? 'चैट साफ़ हो गई है। आप कोई नया सुरक्षा सवाल पूछ सकते हैं!' 
          : 'Chat history cleared. Feel free to ask another security question!',
        timestamp: 'Just now',
      }
    ]);
  };

  const samplePrompts = t.ai.samplePrompts || [
    "Is it safe to share an OTP if the caller claims to be from my bank?",
    "Explain Phishing in simple Hinglish.",
    "How do I create a strong passphrase that is easy to remember?",
    "What should I do if I clicked a fake delivery SMS link?"
  ];

  return (
    <div className={`flex flex-col h-full bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden ${isFullscreen ? 'min-h-[70vh]' : 'h-[500px]'}`}>
      
      {/* Header */}
      <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyber-purple-light to-cyber-purple flex items-center justify-center text-white font-bold shadow-sm">
            <Bot className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h4 className="text-sm font-bold text-graphite font-display">Chakravyuh Saathi</h4>
              <Badge variant="purple" size="sm">Gemini 1.5</Badge>
            </div>
            <p className="text-[10px] text-slate-500 font-medium">English • हिन्दी • Hinglish</p>
          </div>
        </div>

        <button
          onClick={handleClearChat}
          className="p-1.5 rounded-lg text-slate-400 hover:text-cyber-red hover:bg-slate-200 transition-colors"
          title="Clear Chat History"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
        {messages.map((msg) => {
          const isAi = msg.sender === 'ai';
          return (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex items-start gap-2.5 ${isAi ? 'justify-start' : 'justify-end'}`}
            >
              {isAi && (
                <div className="w-7 h-7 rounded-lg bg-cyber-purple/10 border border-cyber-purple/20 flex items-center justify-center shrink-0 mt-0.5">
                  <Sparkles className="w-3.5 h-3.5 text-cyber-purple-dark" />
                </div>
              )}

              <div
                className={`max-w-[85%] sm:max-w-[78%] rounded-2xl p-3.5 text-sm leading-relaxed shadow-sm ${
                  isAi
                    ? 'bg-white text-slate-700 border border-slate-200 rounded-tl-sm'
                    : 'bg-gradient-to-r from-cyber-blue-light to-cyber-blue text-white font-medium rounded-tr-sm border border-cyber-blue/20'
                }`}
              >
                <div className="whitespace-pre-line font-sans">
                  {msg.text}
                </div>
                <div className={`text-[10px] mt-1.5 font-medium ${isAi ? 'text-slate-400 text-right' : 'text-blue-100 text-right'}`}>
                  {msg.timestamp}
                </div>
              </div>

              {!isAi && (
                <div className="w-7 h-7 rounded-lg bg-cyber-blue-dark border border-cyber-blue/30 flex items-center justify-center shrink-0 mt-0.5">
                  <User className="w-3.5 h-3.5 text-white" />
                </div>
              )}
            </motion.div>
          );
        })}

        {isLoading && (
          <div className="flex items-center gap-2 text-slate-500 text-xs py-2">
            <Loader2 className="w-4 h-4 animate-spin text-cyber-purple" />
            <span className="font-medium">Analyzing security context...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Question Chips */}
      <div className="px-4 py-2.5 bg-white border-t border-slate-100 overflow-x-auto">
        <div className="flex gap-2 pb-1 no-scrollbar">
          {samplePrompts.slice(0, 3).map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(prompt)}
              className="px-3 py-1.5 rounded-full bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs text-slate-600 hover:text-cyber-purple-dark whitespace-nowrap transition-all shadow-sm font-medium"
            >
              💡 {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Input Form */}
      <div className="p-3 bg-white border-t border-slate-200">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder={t.ai.placeholder}
            className="flex-1 px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-graphite placeholder-slate-400 text-sm focus:outline-none focus:border-cyber-purple/50 focus:ring-2 focus:ring-cyber-purple/20 transition-all shadow-inner"
          />
          <AnimatedButton
            type="submit"
            size="sm"
            variant="purple"
            disabled={!inputQuery.trim() || isLoading}
            icon={Send}
          >
            {t.ai.send}
          </AnimatedButton>
        </form>
      </div>

    </div>
  );
};
