import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Shield, BookOpen, Film, Flame, Network, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';
import { mockArticles } from '../../data/mockArticles';
import { mockThreats } from '../../data/mockThreats';
import { mockVideos } from '../../data/mockVideos';

export const SearchBar = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const { lang, t } = useLanguage();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  // Global Ctrl+K handler
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else if (onClose) onClose(true);
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const filteredArticles = query
    ? mockArticles.filter(
        (a) =>
          a.title.toLowerCase().includes(query.toLowerCase()) ||
          a.category.toLowerCase().includes(query.toLowerCase()) ||
          (a.titleHi && a.titleHi.includes(query))
      )
    : [];

  const filteredThreats = query
    ? mockThreats.filter(
        (th) =>
          th.name.toLowerCase().includes(query.toLowerCase()) ||
          th.whatIsIt.toLowerCase().includes(query.toLowerCase()) ||
          (th.nameHi && th.nameHi.includes(query))
      )
    : [];

  const filteredVideos = query
    ? mockVideos.filter(
        (v) =>
          v.title.toLowerCase().includes(query.toLowerCase()) ||
          v.category.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const handleSelect = (path) => {
    navigate(path);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-md"
      />

      {/* Search Container */}
      <motion.div
        initial={{ opacity: 0, y: -20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.98 }}
        className="relative z-10 w-full max-w-2xl bg-slate-900/95 border border-amber-500/30 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl"
      >
        {/* Input header */}
        <div className="flex items-center px-4 py-3.5 border-b border-white/10">
          <Search className="w-5 h-5 text-amber-400 shrink-0 mr-3" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.common.searchPlaceholder || "Search threats, scams, articles, or tools... (Ctrl + K)"}
            className="w-full bg-transparent text-white placeholder-slate-400 focus:outline-none text-base"
          />
          {query && (
            <button onClick={() => setQuery('')} className="p-1 text-slate-400 hover:text-white mr-2">
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="px-2 py-1 text-xs rounded bg-slate-800 text-slate-400 border border-slate-700"
          >
            ESC
          </button>
        </div>

        {/* Results Area */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-4">
          {!query && (
            <div className="py-8 text-center text-slate-400 text-sm">
              <Shield className="w-8 h-8 mx-auto text-amber-400/50 mb-2" />
              <p>Type to search across Awareness Articles, Threats, Videos & Simulations.</p>
              <div className="flex flex-wrap justify-center gap-2 mt-4">
                {['Phishing', '2FA Passwords', 'Digital Arrest', 'Ransomware', 'Network MITM'].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setQuery(tag)}
                    className="px-2.5 py-1 text-xs rounded-full bg-slate-800/80 text-amber-400/80 border border-amber-500/20 hover:border-amber-500/50"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}

          {query && filteredArticles.length === 0 && filteredThreats.length === 0 && filteredVideos.length === 0 && (
            <div className="py-8 text-center text-slate-400 text-sm">
              No direct matches found for "{query}". Try searching for keywords like "Phishing", "Password", or "Scam".
            </div>
          )}

          {filteredArticles.length > 0 && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-amber-400" /> Articles ({filteredArticles.length})
              </h4>
              <div className="space-y-1">
                {filteredArticles.map((art) => (
                  <div
                    key={art.id}
                    onClick={() => handleSelect(`/articles/${art.id}`)}
                    className="p-3 rounded-xl bg-slate-800/40 hover:bg-slate-800/80 border border-white/5 hover:border-amber-500/30 cursor-pointer transition-all flex items-center justify-between"
                  >
                    <div>
                      <p className="font-semibold text-sm text-white">{lang === 'hi' && art.titleHi ? art.titleHi : art.title}</p>
                      <p className="text-xs text-slate-400">{art.category} • {art.readTime}</p>
                    </div>
                    <span className="text-xs text-amber-400 font-medium">Read ➔</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {filteredThreats.length > 0 && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-rose-400" /> Threat Intel ({filteredThreats.length})
              </h4>
              <div className="space-y-1">
                {filteredThreats.map((th) => (
                  <div
                    key={th.id}
                    onClick={() => handleSelect(`/threats?id=${th.id}`)}
                    className="p-3 rounded-xl bg-slate-800/40 hover:bg-slate-800/80 border border-white/5 hover:border-rose-500/30 cursor-pointer transition-all flex items-center justify-between"
                  >
                    <div>
                      <p className="font-semibold text-sm text-white">{lang === 'hi' && th.nameHi ? th.nameHi : th.name}</p>
                      <p className="text-xs text-slate-400 truncate max-w-md">{th.whatIsIt}</p>
                    </div>
                    <span className="text-xs text-rose-400 font-medium">Inspect ➔</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {filteredVideos.length > 0 && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                <Film className="w-3.5 h-3.5 text-blue-400" /> Video Hub ({filteredVideos.length})
              </h4>
              <div className="space-y-1">
                {filteredVideos.map((vid) => (
                  <div
                    key={vid.id}
                    onClick={() => handleSelect(`/videos?id=${vid.id}`)}
                    className="p-3 rounded-xl bg-slate-800/40 hover:bg-slate-800/80 border border-white/5 hover:border-blue-500/30 cursor-pointer transition-all flex items-center justify-between"
                  >
                    <div>
                      <p className="font-semibold text-sm text-white">{lang === 'hi' && vid.titleHi ? vid.titleHi : vid.title}</p>
                      <p className="text-xs text-slate-400">{vid.category} • {vid.duration}</p>
                    </div>
                    <span className="text-xs text-blue-400 font-medium">Watch ➔</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
