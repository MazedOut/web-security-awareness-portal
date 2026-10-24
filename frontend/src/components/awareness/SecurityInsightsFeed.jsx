import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  ExternalLink, 
  Clock, 
  ShieldCheck, 
  X, 
  Flame, 
  RefreshCw, 
  Radio, 
  ChevronLeft, 
  ChevronRight, 
  Tag,
  Building2,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { fetchSecurityResources, triggerThreatFeedRefresh } from '../../api/resources';
import { GlassCard } from '../common/GlassCard';
import { Badge } from '../common/Badge';
import { AnimatedButton } from '../common/AnimatedButton';

const CATEGORIES = [
  'All',
  'Actively Exploited CVEs',
  'Web Applications & Web Shells',
  'Critical Vulnerabilities',
  'Ransomware & Malware',
  'Phishing & Social Engineering',
  'Cloud & Supply Chain',
  'Security Advisories'
];

const SEVERITIES = ['All', 'Critical', 'High', 'Medium', 'Low'];

const ITEM_TYPES = [
  { id: 'All', label: 'All Items' },
  { id: 'advisory', label: 'Advisories' },
  { id: 'incident', label: 'Incidents' },
  { id: 'research', label: 'Research' }
];

export const SecurityInsightsFeed = () => {
  const { lang } = useLanguage();

  // Feed items & pagination
  const [feedItems, setFeedItems] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(9);

  // Status & Telemetry
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastSync, setLastSync] = useState(null);
  const [isLive, setIsLive] = useState(true);
  const [sourceStatuses, setSourceStatuses] = useState({});
  const [refreshMessage, setRefreshMessage] = useState(null);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedSeverity, setSelectedSeverity] = useState('All');
  const [selectedItemType, setSelectedItemType] = useState('All');
  const [activelyExploitedOnly, setActivelyExploitedOnly] = useState(false);
  const [sortBy, setSortBy] = useState('newest');

  // Modal inspection
  const [selectedThreat, setSelectedThreat] = useState(null);

  // Prevent duplicate in-flight requests
  const isFetchingRef = useRef(false);

  // Load feed data
  const loadData = useCallback(async (isManualRefresh = false) => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;

    if (isManualRefresh) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }

    try {
      if (isManualRefresh) {
        try {
          await triggerThreatFeedRefresh();
          setRefreshMessage({ type: 'success', text: 'Threat telemetry refreshed from upstream sources.' });
        } catch (e) {
          setRefreshMessage({ type: 'warning', text: 'Serving latest cached feed (rate cooldown active).' });
        }
        setTimeout(() => setRefreshMessage(null), 4000);
      }

      const res = await fetchSecurityResources({
        search: searchQuery,
        category: selectedCategory,
        severity: selectedSeverity,
        item_type: selectedItemType,
        actively_exploited: activelyExploitedOnly,
        sort_by: sortBy,
        page: currentPage,
        per_page: perPage
      });

      setFeedItems(res.items || []);
      setTotalItems(res.totalItems || 0);
      setTotalPages(res.totalPages || 1);
      setLastSync(res.lastSync);
      setIsLive(res.isLive !== false);
      if (res.sourceStatuses) {
        setSourceStatuses(res.sourceStatuses);
      }
    } catch (err) {
      console.error('Error fetching live threat feed:', err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
      isFetchingRef.current = false;
    }
  }, [searchQuery, selectedCategory, selectedSeverity, selectedItemType, activelyExploitedOnly, sortBy, currentPage, perPage]);

  // Initial load & when filters change
  useEffect(() => {
    const handler = setTimeout(() => {
      loadData();
    }, 250); // slight debounce for search input
    return () => clearTimeout(handler);
  }, [loadData]);

  // Periodic background refresh every 5 minutes (300 seconds) without full page reload
  useEffect(() => {
    const interval = setInterval(() => {
      loadData(false);
    }, 300000);
    return () => clearInterval(interval);
  }, [loadData]);

  // Relative time helper
  const getRelativeTime = (dateStr) => {
    if (!dateStr) return 'Recently';
    try {
      const now = new Date();
      const past = new Date(dateStr);
      const diffMs = now - past;
      const diffMins = Math.floor(diffMs / (1000 * 60));
      const diffHours = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHours / 24);

      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      if (diffDays === 1) return 'Yesterday';
      if (diffDays < 30) return `${diffDays}d ago`;
      return past.toLocaleDateString();
    } catch (e) {
      return 'Recently';
    }
  };

  // Severity badge color mapping
  const getSeverityBadgeVariant = (sev) => {
    switch (sev) {
      case 'Critical': return 'red';
      case 'High': return 'gold';
      case 'Medium': return 'blue';
      case 'Low': return 'green';
      default: return 'gray';
    }
  };

  // Item type badge styling
  const getItemTypeLabel = (type) => {
    switch (type) {
      case 'advisory': return { label: 'Vulnerability Advisory', color: 'text-amber-700 bg-amber-50 border-amber-200' };
      case 'incident': return { label: 'Reported Incident', color: 'text-rose-700 bg-rose-50 border-rose-200' };
      case 'research': return { label: 'Threat Research', color: 'text-blue-700 bg-blue-50 border-blue-200' };
      default: return { label: 'Security Bulletin', color: 'text-slate-700 bg-slate-50 border-slate-200' };
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner: Operations Dashboard Header */}
      <GlassCard variant="default" className="p-6 bg-white border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant={isLive ? 'green' : 'gold'} size="sm" icon={Radio}>
                {isLive ? 'Live Threat Intelligence Telemetry' : 'Offline Reference Mode'}
              </Badge>
              {lastSync && (
                <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  Synced {getRelativeTime(lastSync)} ({new Date(lastSync).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})
                </span>
              )}
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-graphite">
              {lang === 'hi' ? 'लाइव साइबर खतरा टेलीमेट्री एवं चेतावनी' : 'Live Threat Intelligence & Incident Telemetry'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-medium max-w-3xl leading-relaxed">
              Real-time multi-source vulnerability aggregation from CISA Known Exploited Vulnerabilities (KEV), NVD CVE API, CISA Advisories, and global threat intelligence.
            </p>
          </div>

          {/* Action Button: Manual Refresh */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setCurrentPage(1);
                loadData(true);
              }}
              disabled={isRefreshing}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm border ${
                isRefreshing
                  ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                  : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-300 hover:border-cyber-green'
              }`}
              title="Trigger manual refresh of upstream intelligence sources"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-cyber-green' : 'text-slate-500'}`} />
              <span>{isRefreshing ? 'Refreshing Feeds...' : 'Refresh Telemetry'}</span>
            </button>
          </div>
        </div>

        {/* Source Health Indicators */}
        <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2 sm:gap-4 text-[11px] text-slate-500 font-medium">
          <span className="font-bold text-slate-600 uppercase tracking-wider text-[10px]">Sources:</span>
          {Object.entries(sourceStatuses).map(([key, info]) => {
            const isOk = info.status === 'ok';
            const isDegraded = info.status === 'degraded';
            return (
              <div key={key} className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-slate-50 border border-slate-200">
                <span className={`w-2 h-2 rounded-full ${isOk ? 'bg-emerald-500' : isDegraded ? 'bg-amber-500' : 'bg-rose-400'}`} />
                <span className="font-semibold text-slate-700">{info.name || key}</span>
                {info.items !== undefined && <span className="text-slate-400">({info.items})</span>}
              </div>
            );
          })}
        </div>

        {/* Toast Refresh Message */}
        <AnimatePresence>
          {refreshMessage && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className={`p-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                refreshMessage.type === 'success'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-amber-50 text-amber-800 border border-amber-200'
              }`}
            >
              {refreshMessage.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-amber-600" />}
              <span>{refreshMessage.text}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </GlassCard>

      {/* Control Bar: Search & Primary Filters */}
      <div className="space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by title, CVE-ID (e.g. CVE-2024), vendor, product, or keyword..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 text-sm text-graphite placeholder-slate-400 focus:outline-none focus:border-cyber-green/50 focus:ring-2 focus:ring-cyber-green/20 shadow-sm font-medium"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Quick Filter: Actively Exploited Toggle */}
          <button
            onClick={() => {
              setActivelyExploitedOnly(!activelyExploitedOnly);
              setCurrentPage(1);
            }}
            className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all border shadow-sm ${
              activelyExploitedOnly
                ? 'bg-rose-500 text-white border-rose-600'
                : 'bg-white text-slate-600 border-slate-200 hover:border-rose-300 hover:text-rose-600'
            }`}
          >
            <Flame className={`w-4 h-4 ${activelyExploitedOnly ? 'text-white' : 'text-rose-500'}`} />
            <span>Actively Exploited Only</span>
          </button>

          {/* Sort Selector */}
          <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-xl p-1 shadow-sm">
            <button
              onClick={() => setSortBy('newest')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                sortBy === 'newest'
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Newest
            </button>
            <button
              onClick={() => setSortBy('severity')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                sortBy === 'severity'
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Highest Severity
            </button>
          </div>

        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-xs font-bold text-slate-400 shrink-0">Category:</span>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                setCurrentPage(1);
              }}
              className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all shadow-sm border ${
                selectedCategory === cat
                  ? 'bg-cyber-green text-white border-cyber-green shadow-cyber-green/20'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-cyber-green-dark'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Secondary Filter: Severity & Item Type */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs pt-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-slate-400">Severity:</span>
            {SEVERITIES.map((sev) => (
              <button
                key={sev}
                onClick={() => {
                  setSelectedSeverity(sev);
                  setCurrentPage(1);
                }}
                className={`px-2.5 py-0.5 rounded-md text-xs font-bold transition-all border ${
                  selectedSeverity === sev
                    ? 'bg-slate-700 text-white border-slate-700'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                }`}
              >
                {sev}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-slate-400">Type:</span>
            {ITEM_TYPES.map((t) => (
              <button
                key={t.id}
                onClick={() => {
                  setSelectedItemType(t.id);
                  setCurrentPage(1);
                }}
                className={`px-2.5 py-0.5 rounded-md text-xs font-bold transition-all border ${
                  selectedItemType === t.id
                    ? 'bg-cyber-gold text-white border-cyber-gold'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div className="flex justify-between items-center text-xs text-slate-500 font-semibold px-1">
        <span>Showing {feedItems.length} of {totalItems} verified intelligence records</span>
        {totalPages > 1 && (
          <span>Page {currentPage} of {totalPages}</span>
        )}
      </div>

      {/* Feed Grid or Skeletons */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4 animate-pulse">
              <div className="flex justify-between items-center">
                <div className="h-5 w-20 bg-slate-200 rounded-full" />
                <div className="h-4 w-16 bg-slate-100 rounded" />
              </div>
              <div className="h-6 w-3/4 bg-slate-200 rounded" />
              <div className="space-y-2">
                <div className="h-3.5 w-full bg-slate-100 rounded" />
                <div className="h-3.5 w-5/6 bg-slate-100 rounded" />
              </div>
              <div className="pt-3 border-t border-slate-100 flex justify-between items-center">
                <div className="h-4 w-24 bg-slate-200 rounded" />
                <div className="h-4 w-16 bg-slate-100 rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : feedItems.length === 0 ? (
        /* Empty State */
        <GlassCard variant="default" className="p-12 text-center bg-white border border-slate-200 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <Search className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-graphite">No Matching Threat Telemetry Found</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              No genuine advisories or incidents matched your current search filters. Try broadening your keywords or selecting "All" categories.
            </p>
          </div>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
              setSelectedSeverity('All');
              setSelectedItemType('All');
              setActivelyExploitedOnly(false);
              setCurrentPage(1);
            }}
            className="px-4 py-2 rounded-xl bg-slate-800 text-white text-xs font-bold hover:bg-slate-900 transition-colors"
          >
            Reset All Filters
          </button>
        </GlassCard>
      ) : (
        /* Threat Feed Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <AnimatePresence mode="popLayout">
            {feedItems.map((threat) => {
              const typeMeta = getItemTypeLabel(threat.item_type);
              return (
                <motion.div
                  key={threat.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => setSelectedThreat(threat)}
                  className="group cursor-pointer"
                >
                  <GlassCard 
                    variant="hover" 
                    className="h-full flex flex-col justify-between p-5 bg-white border border-slate-200 hover:border-cyber-green/40 hover:shadow-md transition-all duration-200 rounded-2xl space-y-4"
                  >
                    {/* Card Top: Badges */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <Badge variant={getSeverityBadgeVariant(threat.severity)} size="sm">
                            {threat.severity}
                          </Badge>
                          {threat.cvss_score !== null && threat.cvss_score !== undefined && (
                            <span className="text-[11px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                              CVSS {threat.cvss_score}
                            </span>
                          )}
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${typeMeta.color}`}>
                            {typeMeta.label}
                          </span>
                        </div>

                        {/* Actively Exploited Flag */}
                        {threat.is_actively_exploited && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-50 text-rose-700 border border-rose-300">
                            <Flame className="w-3 h-3 text-rose-600 animate-pulse" />
                            Actively Exploited
                          </span>
                        )}
                      </div>

                      {/* CVE Identifier Tag */}
                      {threat.cve_id && (
                        <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-cyber-blue-dark">
                          <Tag className="w-3 h-3 text-cyber-blue" />
                          <span>{threat.cve_id}</span>
                        </div>
                      )}

                      {/* Title */}
                      <h3 className="font-bold text-base text-graphite group-hover:text-cyber-green-dark transition-colors line-clamp-2 leading-snug font-display">
                        {threat.title}
                      </h3>

                      {/* Summary */}
                      <p className="text-xs text-slate-600 font-medium line-clamp-3 leading-relaxed">
                        {threat.summary}
                      </p>
                    </div>

                    {/* Card Bottom: Metadata & Attribution */}
                    <div className="pt-3 border-t border-slate-100 space-y-2 text-xs">
                      {/* Vendor & Product info if supplied */}
                      {(threat.vendor || threat.product) && (
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium truncate">
                          <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="truncate">{threat.vendor} {threat.product ? `• ${threat.product}` : ''}</span>
                        </div>
                      )}

                      <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium">
                        <span className="font-semibold text-slate-600 truncate max-w-[140px]">{threat.source_name}</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400" />
                          {getRelativeTime(threat.published_at)}
                        </span>
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className={`p-2 rounded-xl border text-xs font-bold flex items-center gap-1 ${
              currentPage === 1
                ? 'bg-slate-50 text-slate-300 border-slate-200 cursor-not-allowed'
                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
            }`}
          >
            <ChevronLeft className="w-4 h-4" /> Previous
          </button>

          <div className="flex items-center gap-1 text-xs font-bold text-slate-600">
            {[...Array(totalPages)].map((_, i) => {
              const p = i + 1;
              if (
                p === 1 || 
                p === totalPages || 
                (p >= currentPage - 1 && p <= currentPage + 1)
              ) {
                return (
                  <button
                    key={p}
                    onClick={() => setCurrentPage(p)}
                    className={`w-8 h-8 rounded-xl border flex items-center justify-center transition-all ${
                      currentPage === p
                        ? 'bg-slate-800 text-white border-slate-800 shadow-sm'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {p}
                  </button>
                );
              } else if (p === currentPage - 2 || p === currentPage + 2) {
                return <span key={p} className="px-1 text-slate-400">...</span>;
              }
              return null;
            })}
          </div>

          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className={`p-2 rounded-xl border text-xs font-bold flex items-center gap-1 ${
              currentPage === totalPages
                ? 'bg-slate-50 text-slate-300 border-slate-200 cursor-not-allowed'
                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
            }`}
          >
            Next <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Deep-Dive Investigation Modal */}
      <AnimatePresence>
        {selectedThreat && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4 sm:px-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedThreat(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[85vh]"
            >
              {/* Modal Header */}
              <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant={getSeverityBadgeVariant(selectedThreat.severity)}>
                    {selectedThreat.severity} Severity
                  </Badge>
                  {selectedThreat.is_actively_exploited && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
                      <Flame className="w-3.5 h-3.5 text-rose-600" />
                      CISA KEV Verified
                    </span>
                  )}
                </div>
                <button
                  onClick={() => setSelectedThreat(null)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6 sm:p-8 space-y-5 overflow-y-auto">
                <div className="space-y-2">
                  {selectedThreat.cve_id && (
                    <div className="text-xs font-mono font-bold text-cyber-blue-dark">
                      {selectedThreat.cve_id}
                    </div>
                  )}
                  <h2 className="text-xl sm:text-2xl font-bold font-display text-graphite leading-snug">
                    {selectedThreat.title}
                  </h2>
                  <div className="flex items-center gap-3 text-xs text-slate-500 font-medium flex-wrap">
                    <span>Source: <strong className="text-slate-700">{selectedThreat.source_name}</strong></span>
                    <span>•</span>
                    <span>Published: {new Date(selectedThreat.published_at).toLocaleString()}</span>
                    {selectedThreat.category && (
                      <>
                        <span>•</span>
                        <span className="text-cyber-green-dark font-semibold">{selectedThreat.category}</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Threat Details Table */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
                  <div>
                    <span className="text-slate-400 block font-medium">Affected Vendor</span>
                    <span className="font-bold text-slate-700">{selectedThreat.vendor || 'Not Specified'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Affected Product</span>
                    <span className="font-bold text-slate-700">{selectedThreat.product || 'Not Specified'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">CVSS Score</span>
                    <span className="font-bold text-slate-700">{selectedThreat.cvss_score !== null ? selectedThreat.cvss_score : 'Not Scored'}</span>
                  </div>
                </div>

                {/* Summary */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Vulnerability & Threat Overview
                  </h4>
                  <p className="text-sm text-slate-700 leading-relaxed font-medium">
                    {selectedThreat.summary}
                  </p>
                </div>

                {/* Required Action / Remediation */}
                {selectedThreat.required_action && (
                  <div className="p-4 rounded-2xl bg-cyber-blue-light/40 border border-cyber-blue/30 space-y-1.5">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-cyber-blue-dark flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-cyber-blue" />
                      Required Action / Mitigation Guidance
                    </h4>
                    <p className="text-xs text-slate-700 font-medium leading-relaxed">
                      {selectedThreat.required_action}
                    </p>
                  </div>
                )}

                {/* Notes or References */}
                {selectedThreat.notes && (
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 font-medium">
                    <span className="font-bold text-slate-700 block mb-1">Additional Notes:</span>
                    <span>{selectedThreat.notes}</span>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-end">
                {selectedThreat.source_url && (
                  <a
                    href={selectedThreat.source_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex"
                  >
                    <AnimatedButton variant="primary" icon={ExternalLink} iconPosition="right">
                      View Official Source Report
                    </AnimatedButton>
                  </a>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
