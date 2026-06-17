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
      new (window as any).google.translate.TranslateElement(
        { pageLanguage: 'en', layout: 0 },
        'google_translate_element'
      );
    }
  };
  
  (window as any).googleTranslateElementInit = fn;
  
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

  const headerBg  = isDark ? 'rgba(10,15,28,0.85)'  : 'rgba(255,255,255,0.90)';
  const headerBdr = isDark ? 'rgba(255,255,255,0.07)': 'rgba(0,0,0,0.10)';
  const tabActive = isDark ? 'rgba(52,211,153,0.18)' : 'rgba(52,211,153,0.20)';

  return (
    <>
      {/* Skip link */}
      <a
        href="#main-content"
        style={{
          position: 'absolute', top: '-40px', left: '16px', zIndex: 9999,
          background: '#065f46', color: '#fff', padding: '8px 16px', borderRadius: '8px',
          fontWeight: 600, textDecoration: 'none', transition: 'top 0.2s',
        }}
        onFocus={(e) => { (e.target as HTMLAnchorElement).style.top = '12px'; }}
        onBlur={(e)  => { (e.target as HTMLAnchorElement).style.top = '-40px'; }}
      >
        Skip to main content
      </a>

      {/* ── Header ─────────────────────────────────────── */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 40,
        background: headerBg,
        borderBottom: `1px solid ${headerBdr}`,
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
      }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 16px' }}>
          {/* Top bar */}
        <div className="flex justify-between items-center px-6 py-4 max-w-5xl mx-auto">
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              {/* ELI10 toggle */}
              <button
                onClick={toggleEli10}
                aria-pressed={settings.eli10Mode}
                title="Toggle simple language mode"
                style={{
                  padding: '5px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 600,
                  background: settings.eli10Mode ? 'rgba(251,191,36,0.2)' : 'var(--bg-card)',
                  border: `1px solid ${settings.eli10Mode ? 'rgba(251,191,36,0.4)' : 'var(--border-card)'}`,
                  color: settings.eli10Mode ? '#fbbf24' : 'var(--text-secondary)',
                  cursor: 'pointer', transition: 'all 0.2s',
                }}
              >
                🧒 ELI10
              </button>

              {/* Google Translate */}
              <div
                id="google_translate_element"
                title="Translate this page"
                style={{ fontSize: '12px' }}
              />

              {/* Theme toggle */}
              <button
                onClick={() => setTheme(isDark ? 'light' : 'dark')}
                aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
                style={{
                  width: '36px', height: '36px', borderRadius: '50%', display: 'flex',
                  alignItems: 'center', justifyContent: 'center', fontSize: '16px',
                  background: 'var(--bg-card)', border: '1px solid var(--border-card)',
                  cursor: 'pointer', transition: 'all 0.2s', color: 'var(--text-primary)',
                }}
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
              style={{ display: 'flex', gap: '4px', overflowX: 'auto', paddingBottom: '1px' }}
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
                    style={{
                      display: 'flex', alignItems: 'center', gap: '6px',
                      padding: '8px 16px', borderRadius: '8px 8px 0 0',
                      fontSize: '13px', fontWeight: active ? 600 : 400,
                      fontFamily: "'Space Grotesk', sans-serif",
                      background: active ? tabActive : 'transparent',
                      border: 'none',
                      borderBottom: active ? '2px solid #34d399' : '2px solid transparent',
                      color: active ? '#34d399' : 'var(--text-secondary)',
                      cursor: 'pointer', transition: 'all 0.2s', whiteSpace: 'nowrap',
                    }}
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
          style={{ minHeight: 'calc(100vh - 120px)' }}
        >
          {children}
        </motion.main>
      </AnimatePresence>

      {/* ── Footer ────────────────────────────────────── */}
      <footer style={{
        textAlign: 'center', padding: '24px 16px', fontSize: '13px',
        color: 'var(--text-muted)', borderTop: `1px solid ${headerBdr}`,
        background: headerBg, backdropFilter: 'blur(12px)',
      }}>
        <p style={{ fontWeight: 600, marginBottom: '4px', background: 'linear-gradient(90deg, #34d399, #3b82f6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Built with ❤️ for the Hack2Skill & Google for Developers AI Challenge 2026.
        </p>
        <p>Developed by <strong>Sivasubramaniyan G</strong></p>
        <div style={{ margin: '8px 0', opacity: 0.3, height: '1px', background: 'var(--text-muted)', width: '40px', display: 'inline-block' }}></div>
        <p style={{ fontSize: '11px', opacity: 0.8 }}>Secure Backend Mode Active · WCAG 2.1 AA Compliant</p>
      </footer>
    </>
  );
}

