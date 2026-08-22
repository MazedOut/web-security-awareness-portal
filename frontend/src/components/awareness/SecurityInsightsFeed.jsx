import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, ExternalLink, Clock, Calendar, ShieldCheck, X, BookOpen, AlertTriangle } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { fetchSecurityResources } from '../../api/resources';
import { GlassCard } from '../common/GlassCard';
import { Badge } from '../common/Badge';
import { AnimatedButton } from '../common/AnimatedButton';

export const SecurityInsightsFeed = () => {
  const { lang, t } = useLanguage();
  const [resources, setResources] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedResource, setSelectedResource] = useState(null);

  const categories = ['All', 'Threat News', 'Cyber Awareness', 'Data Breaches', 'Security Research', 'Phishing Alerts'];

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      const data = await fetchSecurityResources();
      setResources(data);
      setIsLoading(false);
    };
    loadData();
  }, []);

  const filteredResources = resources.filter(res => {
    const matchesCategory = selectedCategory === 'All' || res.category === selectedCategory;
    const matchesSearch = res.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          res.previewText.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold font-display text-graphite">Security Insights & Awareness Feed</h2>
          <p className="text-sm text-slate-500">Curated threat intelligence from trusted global sources.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search insights..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-64 pl-9 pr-4 py-2 rounded-xl bg-white border border-slate-200 text-sm text-graphite placeholder-slate-400 focus:outline-none focus:border-cyber-green/50 focus:ring-1 focus:ring-cyber-green/20 shadow-inner"
            />
          </div>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap gap-2 pb-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all shadow-sm ${
              selectedCategory === cat
                ? 'bg-cyber-green text-white border-cyber-green/20'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:text-cyber-green-dark'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Feed Grid */}
      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <div className="w-8 h-8 border-2 border-cyber-green/30 border-t-cyber-green rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredResources.map((resource) => (
              <motion.div
                key={resource.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                onClick={() => setSelectedResource(resource)}
                className="group cursor-pointer"
              >
                <GlassCard variant="hover" className="h-full flex flex-col p-5 bg-white border border-slate-200 hover:border-cyber-green/30 transition-all duration-300">
                  <div className="flex justify-between items-start mb-4">
                    <Badge variant={resource.verifiedSafe ? 'green' : 'blue'}>
                      {resource.category}
                    </Badge>
                    <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500 bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
                      <Clock className="w-3 h-3" />
                      {resource.readingTime}
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-graphite mb-2 group-hover:text-cyber-green-dark transition-colors font-display line-clamp-2">
                    {resource.title}
                  </h3>

                  <p className="text-sm text-slate-600 mb-6 flex-1 line-clamp-3">
                    {resource.previewText}
                  </p>

                  <div className="mt-auto pt-4 border-t border-slate-100 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      {resource.sourceLogo && (
                        <img src={resource.sourceLogo} alt={resource.sourceName} className="w-5 h-5 object-contain" />
                      )}
                      <span className="text-xs font-semibold text-slate-500">{resource.sourceName}</span>
                    </div>
                    <div className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(resource.publicationDate).toLocaleDateString()}
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Article Preview Modal */}
      <AnimatePresence>
        {selectedResource && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4 sm:px-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedResource(null)}
              className="absolute inset-0 bg-slate-800/60 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden z-10"
            >
              {/* Modal Header */}
              <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-cyber-green" />
                  <span className="text-sm font-bold text-cyber-green-dark">Verified Trusted Source</span>
                </div>
                <button
                  onClick={() => setSelectedResource(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 sm:p-8 space-y-6 max-h-[70vh] overflow-y-auto">
                <div>
                  <h2 className="text-2xl font-bold font-display text-graphite mb-3">
                    {selectedResource.title}
                  </h2>
                  <div className="flex items-center gap-3 text-sm text-slate-500 font-medium">
                    <div className="flex items-center gap-1.5">
                      {selectedResource.sourceLogo && (
                        <img src={selectedResource.sourceLogo} alt={selectedResource.sourceName} className="w-4 h-4 object-contain" />
                      )}
                      <span className="text-slate-600 font-semibold">{selectedResource.sourceName}</span>
                    </div>
                    <span>•</span>
                    <span>{new Date(selectedResource.publicationDate).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="prose prose-sm max-w-none text-slate-700">
                  <p className="text-base leading-relaxed">{selectedResource.previewText}</p>
                </div>

                {/* Beginner Explanation Layer */}
                <div className="p-5 rounded-xl bg-gradient-to-r from-cyber-blue-light/50 to-cyber-blue-light/30 border border-cyber-blue/20">
                  <h4 className="flex items-center gap-2 text-sm font-bold text-cyber-blue-dark mb-2">
                    <BookOpen className="w-4 h-4" />
                    {lang === 'hi' ? 'सरल भाषा में समझें (Simple Explanation)' : 'Simple Explanation'}
                  </h4>
                  <p className="text-sm text-slate-700 leading-relaxed font-medium">
                    {lang === 'hi' ? selectedResource.beginnerExplanation.hi : selectedResource.beginnerExplanation.en}
                  </p>
                </div>

                {/* Source Transparency Disclaimer */}
                <div className="flex items-start gap-2 p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-500">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-slate-400" />
                  <p>
                    This content is provided from an external trusted source ({selectedResource.sourceName}). Clicking below will take you to the original publication.
                  </p>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-end">
                <a 
                  href={selectedResource.originalUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex"
                >
                  <AnimatedButton variant="outline" icon={ExternalLink} iconPosition="right">
                    Read Original Source
                  </AnimatedButton>
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
