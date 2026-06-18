import React, { useEffect, useId } from 'react';
import { useStore } from '../core/store';
import { motion, AnimatePresence } from 'framer-motion';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: number;
  onTabChange: (tab: number) => void;
}

const TABS = [
  { label: 'My Profile',        icon: '👤' },
  { label: 'Intelligence',      icon: '🧠' },
  { label: 'Actions',           icon: '✅' },
  { label: 'Reports & Settings',icon: '📊' },
  { label: 'Eco Lab',           icon: '🧪' },
  { label: 'Lifestyle',         icon: '🌍' },
];

/* Inject Google Translate widget */
function initGoogleTranslate() {
  if (document.getElementById('google-translate-script')) return; // Already injected
  
  const fn = () => {
    const el = document.getElementById('google_translate_element');
    if (el && el.childElementCount === 0) { // Only init if empty
      new (window as unknown as { google: { translate: { TranslateElement: new (options: unknown, id: string) => void } } }).google.translate.TranslateElement(
        { pageLanguage: 'en', layout: 0 },
        'google_translate_element'
      );
    }
  };
  
  (window as unknown as { googleTranslateElementInit: () => void }).googleTranslateElementInit = fn;
  
  const s = document.createElement('script');
  s.id = 'google-translate-script';
  s.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
  s.async = true;
  document.body.appendChild(s);
}

export function Layout({ children, activeTab, onTabChange }: LayoutProps) {
  const settings   = useStore((s) => s.settings);
  const toggleEli10 = useStore((s) => s.toggleEli10);
  const setTheme   = useStore((s) => s.setTheme);
  const tablistId  = useId();
  const isDark     = settings.theme !== 'light';

  useEffect(() => { initGoogleTranslate(); }, []);

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    const n = TABS.length;
    if (e.key === 'ArrowRight') { e.preventDefault(); const next = (index+1)%n; onTabChange(next); document.getElementById(`tab-${next}-${tablistId}`)?.focus(); }
    if (e.key === 'ArrowLeft')  { e.preventDefault(); const prev = (index-1+n)%n; onTabChange(prev); document.getElementById(`tab-${prev}-${tablistId}`)?.focus(); }
    if (e.key === 'Home') { e.preventDefault(); onTabChange(0); document.getElementById(`tab-0-${tablistId}`)?.focus(); }
    if (e.key === 'End')  { e.preventDefault(); onTabChange(n-1); document.getElementById(`tab-${n-1}-${tablistId}`)?.focus(); }
  };

  return (
    <>
      {/* Skip link */}
      <a
        href="#main-content"
        className="absolute -top-10 left-4 z-[9999] bg-emerald-800 text-white px-4 py-2 rounded-lg font-semibold transition-all focus:top-3 outline-none focus:ring-4 focus:ring-emerald-500/50"
      >
        Skip to main content
      </a>

      {/* ── Header ─────────────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-card/80 border-b border-card backdrop-blur-xl">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          {/* Top bar */}
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/30 animate-pulse-glow">
                <span className="text-white text-xl animate-float">🌿</span>
              </div>
              <div>
                <h1 className="text-xl font-bold font-display text-primary tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  CarbonSense
                </h1>
                <p className="text-xs font-medium text-emerald-500 tracking-wider uppercase">Sustainability Intelligence</p>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-3 flex-wrap">
              {/* ELI10 toggle */}
              <button
                onClick={toggleEli10}
                aria-pressed={settings.eli10Mode}
                title="Toggle simple language mode"
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all border ${settings.eli10Mode ? 'bg-amber-400/20 border-amber-400/40 text-amber-500' : 'bg-card border-card text-secondary hover:border-amber-400/30'}`}
              >
                🧒 ELI10
              </button>

              {/* Google Translate */}
              <div
                id="google_translate_element"
                title="Translate this page"
                className="text-xs"
              />

              {/* Theme toggle */}
              <button
                onClick={() => setTheme(isDark ? 'light' : 'dark')}
                aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
                className="w-9 h-9 rounded-full flex items-center justify-center text-base bg-card border border-card text-primary transition-all hover:border-emerald-500/30"
              >
                {isDark ? '☀️' : '🌙'}
              </button>
            </div>
          </div>

          {/* Tab navigation */}
          <nav aria-label="Main navigation">
            <div
              role="tablist"
              id={tablistId}
              aria-label="Application sections"
              className="flex gap-1 overflow-x-auto pb-[1px]"
            >
              {TABS.map((tab, i) => {
                const active = activeTab === i;
                return (
                  <button
                    key={tab.label}
                    id={`tab-${i}-${tablistId}`}
                    role="tab"
                    aria-selected={active}
                    aria-controls={`panel-${i}`}
                    onClick={() => onTabChange(i)}
                    onKeyDown={(e) => handleKeyDown(e, i)}
                    tabIndex={active ? 0 : -1}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-t-lg text-[13px] whitespace-nowrap transition-all border-b-2 font-display ${active ? 'font-semibold bg-emerald-500/10 border-emerald-400 text-emerald-400' : 'font-medium bg-transparent border-transparent text-secondary hover:text-primary hover:bg-card/50'}`}
                  >
                    <span aria-hidden="true">{tab.icon}</span>
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </nav>
        </div>
      </header>

      {/* ── Main content ──────────────────────────────── */}
      <AnimatePresence mode="wait">
        <motion.main 
          key={activeTab}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          id="main-content" 
          role="main" 
          className="min-h-[calc(100vh-120px)] max-w-5xl mx-auto px-4 sm:px-6 py-6"
        >
          {children}
        </motion.main>
      </AnimatePresence>

      {/* ── Footer ────────────────────────────────────── */}
      <footer className="text-center py-6 px-4 text-[13px] text-muted border-t border-card bg-card/80 backdrop-blur-xl">
        <p className="font-semibold mb-1 bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent inline-block">
          Built with ❤️ for the Hack2Skill & Google for Developers AI Challenge 2026.
        </p>
        <p className="mt-1">Developed by <strong className="text-primary font-semibold">Sivasubramaniyan G</strong></p>
        <div className="my-2 h-[1px] bg-muted/30 w-10 inline-block"></div>
        <p className="text-[11px] opacity-80">Secure Backend Mode Active · Built for Accessibility</p>
      </footer>
    </>
  );
}

