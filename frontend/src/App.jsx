import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { AccessibilityProvider } from './context/AccessibilityContext';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { BackgroundEffects } from './components/layout/BackgroundEffects';
import { AIAssistantFloating } from './components/ai/AIAssistantFloating';

// Pages
import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { AwarenessHubPage } from './pages/AwarenessHubPage';
import { ArticleDetailPage } from './pages/ArticleDetailPage';
import { VideoHubPage } from './pages/VideoHubPage';
import { ThreatIntelPage } from './pages/ThreatIntelPage';
import { NetworkVisualizationPage } from './pages/NetworkVisualizationPage';
import { StatisticsPage } from './pages/StatisticsPage';
import { SimulationsPage } from './pages/SimulationsPage';
import { AIAssistantPage } from './pages/AIAssistantPage';
import { ProfilePage } from './pages/ProfilePage';
import { AuthPage } from './pages/AuthPage';
import { ThreatTrendsPage } from './pages/ThreatTrendsPage';
import { SafetyTipsPage } from './pages/SafetyTipsPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { ChakravyuhLoader } from './components/common/ChakravyuhLoader';
import { AnimatePresence, motion } from 'framer-motion';

// Scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}


const PageTransition = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 15 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -15 }}
    transition={{ duration: 0.3, ease: "easeInOut" }}
    className="h-full"
  >
    {children}
  </motion.div>
);

function AppContent() {
  const [isInitializing, setIsInitializing] = React.useState(true);
  const location = useLocation();

  React.useEffect(() => {
    // Simulate initial secure system boot
    const timer = setTimeout(() => setIsInitializing(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  if (isInitializing) {
    return <ChakravyuhLoader text="Initializing Chakravyuh Defense System..." />;
  }

  return (
    <div className="relative min-h-screen flex flex-col justify-between text-slate-100 bg-obsidian selection:bg-amber-500/30 selection:text-amber-300">
      <BackgroundEffects />
      <ScrollToTop />
      
      <div className="relative z-10 flex flex-col flex-1">
        <Navbar />
        <main className="flex-1">
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<PageTransition><LandingPage /></PageTransition>} />
              <Route path="/dashboard" element={<PageTransition><DashboardPage /></PageTransition>} />
              <Route path="/articles" element={<PageTransition><AwarenessHubPage /></PageTransition>} />
              <Route path="/articles/:id" element={<PageTransition><ArticleDetailPage /></PageTransition>} />
              <Route path="/videos" element={<PageTransition><VideoHubPage /></PageTransition>} />
              <Route path="/threats" element={<PageTransition><ThreatIntelPage /></PageTransition>} />
              <Route path="/trends" element={<PageTransition><ThreatTrendsPage /></PageTransition>} />
              <Route path="/safety-tips" element={<PageTransition><SafetyTipsPage /></PageTransition>} />
              <Route path="/network-lab" element={<PageTransition><NetworkVisualizationPage /></PageTransition>} />
              <Route path="/statistics" element={<PageTransition><StatisticsPage /></PageTransition>} />
              <Route path="/simulations" element={<PageTransition><SimulationsPage /></PageTransition>} />
              {/* Simulation sub-path aliases → redirect to tab system */}
              <Route path="/simulations/phishing" element={<Navigate to="/simulations?tab=phishing" replace />} />
              <Route path="/simulations/fake-website" element={<Navigate to="/simulations?tab=url-inspector" replace />} />
              <Route path="/simulations/password" element={<Navigate to="/simulations?tab=password" replace />} />
              <Route path="/simulations/password-lab" element={<Navigate to="/simulations?tab=password" replace />} />
              <Route path="/simulations/social-engineering" element={<Navigate to="/simulations?tab=social-eng" replace />} />
              <Route path="/simulations/quiz" element={<Navigate to="/simulations?tab=quiz" replace />} />
              <Route path="/ai-assistant" element={<PageTransition><AIAssistantPage /></PageTransition>} />
              <Route path="/profile" element={<PageTransition><ProfilePage /></PageTransition>} />
              <Route path="/auth" element={<PageTransition><AuthPage /></PageTransition>} />
              <Route path="/login" element={<PageTransition><AuthPage /></PageTransition>} />
              <Route path="*" element={<PageTransition><NotFoundPage /></PageTransition>} />
            </Routes>
          </AnimatePresence>
        </main>
        <Footer />
      </div>

      <AIAssistantFloating />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <AccessibilityProvider>
          <AuthProvider>
            <AppContent />
          </AuthProvider>
        </AccessibilityProvider>
      </LanguageProvider>
    </BrowserRouter>
  );
}
