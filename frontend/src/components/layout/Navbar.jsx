import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Shield, 
  Search, 
  Globe, 
  PhoneCall, 
  User, 
  Sparkles, 
  Type, 
  Volume2, 
  VolumeX, 
  Menu, 
  X,
  Award,
  ChevronDown
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { useAccessibility } from '../../context/AccessibilityContext';
import { SearchBar } from '../common/SearchBar';
import { Badge } from '../common/Badge';
import { ChakravyuhLogo } from '../common/ChakravyuhLogo';

export const Navbar = () => {
  const { lang, toggleLanguage, t } = useLanguage();
  const { user, isAuthenticated, getRankTitle } = useAuth();
  const { fontSize, setFontSize, soundEnabled, setSoundEnabled } = useAccessibility();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const rankInfo = getRankTitle(user.awarenessScore);

  const cycleFontSize = () => {
    if (fontSize === 'normal') setFontSize('large');
    else if (fontSize === 'large') setFontSize('xlarge');
    else setFontSize('normal');
  };

  const navGroups = [
    {
      name: t.nav.dashboard || 'Home',
      path: '/dashboard',
      isLink: true
    },
    {
      name: t.nav.awarenessHub || 'Awareness',
      isLink: false,
      children: [
        { name: 'Articles', path: '/articles' },
        { name: 'Videos', path: '/videos' },
        { name: 'Threat Library', path: '/threats' },
        { name: 'Safety Tips', path: '/safety-tips' },
      ]
    },
    {
      name: t.nav.simulations || 'Simulations',
      isLink: false,
      children: [
        { name: 'Phishing Detection', path: '/simulations?tab=phishing' },
        { name: 'Fake Website Detection', path: '/simulations?tab=url-inspector' },
        { name: 'Password Lab', path: '/simulations?tab=password' },
        { name: 'Social Engineering', path: '/simulations?tab=social-eng' },
        { name: 'Cyber Quiz Arena', path: '/simulations?tab=quiz' },
      ]
    },
    {
      name: t.nav.insights || 'Insights',
      isLink: false,
      children: [
        { name: 'Statistics', path: '/statistics' },
        { name: 'Threat Trends', path: '/trends' },
        { name: 'Network Awareness Map', path: '/network-lab' },
      ]
    },
    {
      name: t.nav.aiAssistant || 'AI Assistant',
      path: '/ai-assistant',
      isLink: true
    },
    {
      name: '🏆 Leaderboard',
      path: '/leaderboard',
      isLink: true
    },
    {
      name: 'Profile',
      path: '/profile',
      isLink: true
    },
  ];


  return (
    <>
      <header className="sticky top-0 z-40 w-full px-4 lg:px-8 py-3 transition-all duration-300">
        <div className="max-w-7xl mx-auto glass-panel rounded-2xl px-4 py-2.5 flex items-center justify-between">
          
          {/* Brand Logo */}
          <Link to={isAuthenticated ? "/landing" : "/"} className="flex items-center space-x-3 group">
            <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-cyber-gold-light to-cyber-gold/20 border border-cyber-gold/30 group-hover:border-cyber-gold transition-all duration-300 shadow-sm">
              <ChakravyuhLogo className="w-7 h-7 text-cyber-gold group-hover:scale-110 transition-transform duration-300" glow={false} />
            </div>
            <div>
              <span className="font-extrabold text-lg tracking-wider font-display text-graphite block">
                {lang === 'hi' ? 'चक्रव्यूह' : 'CHAKRAVYUH'}
              </span>
              <span className="text-[10px] uppercase font-semibold text-slate-500 tracking-widest block -mt-1">
                Digital Safety
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center space-x-1">
            {navGroups.map((group, idx) => {
              if (group.isLink) {
                const isActive = location.pathname === group.path;
                return (
                  <Link
                    key={idx}
                    to={group.path}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                      isActive
                        ? 'bg-cyber-gold/10 text-cyber-gold-dark border border-cyber-gold/20 shadow-sm'
                        : 'text-slate-600 hover:text-cyber-gold hover:bg-slate-100'
                    }`}
                  >
                    {group.name}
                  </Link>
                );
              }

              // Dropdown Group — extract base path (before ?) for active detection
              const isActiveGroup = group.children.some(child => {
                const childBase = child.path.split('?')[0];
                return location.pathname.startsWith(childBase) && childBase !== '/';
              });
              
              return (
                <div key={idx} className="relative group/nav">
                  <button
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                      isActiveGroup
                        ? 'bg-cyber-gold/10 text-cyber-gold-dark border border-cyber-gold/20'
                        : 'text-slate-600 hover:text-cyber-gold hover:bg-slate-100'
                    }`}
                  >
                    {group.name}
                    <ChevronDown className="w-3.5 h-3.5 opacity-50 group-hover/nav:opacity-100 transition-transform group-hover/nav:rotate-180" />
                  </button>
                  
                  {/* Dropdown Menu */}
                  <div className="absolute top-full left-0 mt-2 w-52 opacity-0 invisible group-hover/nav:opacity-100 group-hover/nav:visible transition-all duration-200 transform translate-y-2 group-hover/nav:translate-y-0 z-50">
                    <div className="bg-white rounded-xl p-2 border border-slate-200 shadow-xl flex flex-col gap-1">
                      {group.children.map((child, cIdx) => {
                        const childBase = child.path.split('?')[0];
                        const isActive = location.pathname === childBase;
                        return (
                          <Link
                            key={cIdx}
                            to={child.path}
                            className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                              isActive
                                ? 'bg-cyber-gold/10 text-cyber-gold-dark'
                                : 'text-slate-600 hover:bg-slate-50 hover:text-cyber-gold-dark'
                            }`}
                          >
                            {child.name}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </nav>

          {/* Right Action Cluster */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Quick Search */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-cyber-gold transition-all flex items-center gap-1.5 text-xs border border-transparent hover:border-slate-300"
              title="Quick Search (Ctrl + K)"
            >
              <Search className="w-4 h-4" />
              <span className="hidden md:inline font-mono text-[11px] text-slate-400">⌘K</span>
            </button>

            {/* Language Switcher */}
            <button
              onClick={toggleLanguage}
              className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-cyber-gold transition-all flex items-center gap-1.5 text-xs font-semibold border border-transparent hover:border-slate-300"
              title="Toggle English / Hindi-Hinglish"
            >
              <Globe className="w-3.5 h-3.5 text-cyber-gold" />
              <span>{lang === 'en' ? 'हिन्दी' : 'English'}</span>
            </button>

            {/* Accessibility Font Sizer */}
            <button
              onClick={cycleFontSize}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-cyber-gold transition-all text-xs border border-transparent hover:border-slate-300"
              title={`Text Size: ${fontSize}`}
            >
              <Type className="w-4 h-4" />
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="xl:hidden p-2 rounded-xl bg-slate-100 text-slate-600 hover:text-cyber-gold border border-slate-200"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMobileMenuOpen && (
          <div className="xl:hidden mt-2 max-w-7xl mx-auto bg-white rounded-2xl p-4 space-y-4 border border-slate-200 shadow-xl animate-in fade-in">
            <div className="flex flex-col gap-2 pb-3 border-b border-slate-100">
              {navGroups.map((group, idx) => (
                <div key={idx} className="flex flex-col gap-1">
                  {group.isLink ? (
                    <Link
                      to={group.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                        location.pathname === group.path
                          ? 'bg-cyber-gold/10 text-cyber-gold-dark border border-cyber-gold/20'
                          : 'text-slate-600 hover:bg-slate-50 hover:text-cyber-gold'
                      }`}
                    >
                      {group.name}
                    </Link>
                  ) : (
                    <>
                      <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-2">
                        {group.name}
                      </div>
                      <div className="grid grid-cols-2 gap-2 pl-2">
                        {group.children.map((child, cIdx) => (
                          <Link
                            key={cIdx}
                            to={child.path}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                              location.pathname === child.path
                                ? 'bg-cyber-gold/10 text-cyber-gold-dark border border-cyber-gold/20'
                                : 'text-slate-600 hover:bg-slate-50 hover:text-cyber-gold'
                            }`}
                          >
                            {child.name}
                          </Link>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between pt-1 text-xs text-slate-500">
              <a href="tel:1930" className="flex items-center gap-1.5 text-cyber-red-dark font-semibold">
                <PhoneCall className="w-3.5 h-3.5" /> Helpline: 1930
              </a>
              <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)} className="text-cyber-gold-dark font-bold">
                {user.name}
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Global Search Modal */}
      <SearchBar isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
};
