import React, { useState } from 'react';
import { useStore } from '../../core/store';
import { CURRENCY_MAP } from '../../config';
import { runSecurityAudit } from '../../core/security';
import type { SecurityAuditResult } from '../../types';

const PERSONAS = [
  { key: 'friendly',  icon: '💚', label: 'Friendly Guide',  desc: 'Supportive and encouraging' },
  { key: 'strict',    icon: '💪', label: 'Strict Coach',    desc: 'Direct, results-focused' },
  { key: 'scientist', icon: '🔬', label: 'Eco Scientist',   desc: 'Data-driven with numbers' },
] as const;

function S({ children }: { children: React.ReactNode }) {
  return (
    <div className="pb-5 border-b border-card last:border-0">
      {children}
    </div>
  );
}

export function Settings() {
  const settings         = useStore((s) => s.settings);
  const setTheme         = useStore((s) => s.setTheme);
  const toggleEli10      = useStore((s) => s.toggleEli10);
  const setCoachPersona  = useStore((s) => s.setCoachPersona);
  const setCurrencyOverride = useStore((s) => s.setCurrencyOverride);

  const [showHealth, setShowHealth] = useState(false);
  const [confirmClear, setClear]    = useState(false);
  const [audit, setAudit]           = useState<SecurityAuditResult | null>(null);
  const [isAuditing, setIsAuditing] = useState(false);

  const startAudit = async () => {
    if (showHealth) {
      setShowHealth(false);
      return;
    }
    setShowHealth(true);
    if (!audit && !isAuditing) {
      setIsAuditing(true);
      const res = await runSecurityAudit();
      setAudit(res);
      setIsAuditing(false);
    }
  };

  const isDark = settings.theme !== 'light';

  return (
    <div className="glass-card p-6 flex flex-col gap-5">
      <h2 className="font-display font-bold text-xl text-primary">
        ⚙️ Settings
      </h2>

      {/* Theme */}
      <S>
        <p className="text-secondary text-sm font-medium mb-3">Appearance</p>
        <div className="flex gap-3">
          <button onClick={() => setTheme('dark')} aria-label="Toggle Dark Theme" className={`px-4 py-2 rounded-xl text-sm transition-all ${isDark ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 font-semibold' : 'bg-card border border-card text-secondary hover:border-emerald-500/30'}`}  aria-pressed={isDark}>🌙 Dark Mode</button>
          <button onClick={() => setTheme('light')} aria-label="Toggle Light Theme" className={`px-4 py-2 rounded-xl text-sm transition-all ${!isDark ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 font-semibold' : 'bg-card border border-card text-secondary hover:border-emerald-500/30'}`} aria-pressed={!isDark}>☀️ Light Mode</button>
        </div>
      </S>

      {/* ELI10 */}
      <S>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-primary text-sm font-medium">🧒 ELI10 Mode</p>
            <p className="text-muted text-xs mt-1">Simplifies all technical language</p>
          </div>
          <button
            role="switch"
            aria-checked={settings.eli10Mode}
            onClick={toggleEli10}
            className={`relative w-12 h-6 rounded-full transition-colors flex-shrink-0 ${settings.eli10Mode ? 'bg-emerald-600' : 'bg-white/10'}`}
          >
            <span className={`absolute top-[3px] left-[3px] w-[18px] h-[18px] rounded-full bg-white transition-all shadow-sm ${settings.eli10Mode ? 'translate-x-5' : 'translate-x-0'}`} />
            <span className="sr-only">{settings.eli10Mode ? 'Disable' : 'Enable'} ELI10 mode</span>
          </button>
        </div>
      </S>

      {/* Language note */}
      <S>
        <p className="text-secondary text-sm font-medium mb-2">🌐 Language</p>
        <p className="text-muted text-xs">
          Use the <strong className="text-secondary">Google Translate widget</strong> in the header to switch to any language. Supports English, Hindi, Spanish, French, Arabic, and 100+ more.
        </p>
      </S>

      {/* Currency Override */}
      <S>
        <p className="text-secondary text-sm font-medium mb-2">💵 Display Currency</p>
        <p className="text-muted text-xs mb-3">
          By default, currency matches your selected country. You can override it here.
        </p>
        <select
          value={settings.currencyOverride || ''}
          onChange={(e) => setCurrencyOverride(e.target.value || null)}
          className="w-full max-w-xs bg-[var(--bg-card)] p-3 rounded-xl border border-[var(--border-card)] text-primary text-sm focus:border-emerald-500/50 outline-none"
        >
          <option value="">(Default) Match My Country</option>
          {Object.entries(CURRENCY_MAP).filter(([k]) => k !== 'Global Average').map(([country, info]) => (
            <option key={country} value={info.currency}>
              {info.currency} ({info.symbol}) — {country}
            </option>
          ))}
        </select>
      </S>

      {/* Coach Persona */}
      <S>
        <p className="text-secondary text-sm font-medium mb-3">AI Coach Persona</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {PERSONAS.map((p) => {
            const active = settings.coachPersona === p.key;
            return (
              <button
                key={p.key}
                onClick={() => setCoachPersona(p.key)}
                aria-pressed={active}
                className={`p-3 rounded-xl text-left transition-all ${active ? 'bg-emerald-500/15 border border-emerald-500/40' : 'bg-card border border-card hover:border-emerald-500/30'}`}
              >
                <div className="text-2xl mb-1">{p.icon}</div>
                <p className="text-primary text-xs font-semibold">{p.label}</p>
                <p className="text-muted text-[11px] mt-1">{p.desc}</p>
              </button>
            );
          })}
        </div>
      </S>


      {/* System Health */}
      <S>
        <button
          onClick={startAudit}
          aria-expanded={showHealth}
          className={`px-4 py-2 rounded-xl text-sm transition-all flex items-center gap-2 ${showHealth ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 font-semibold' : 'bg-card border border-card text-secondary hover:border-emerald-500/30'}`}
        >
          🔒 System Health {showHealth ? '▲' : '▼'}
        </button>
        {showHealth && (
          <div className="mt-3 bg-card border border-card rounded-xl p-4 flex flex-col gap-2">
            {isAuditing ? (
              <div className="flex items-center gap-3 p-5 text-secondary">
                <div className="w-4 h-4 border-2 border-emerald-500/30 border-t-emerald-400 rounded-full animate-spin" />
                <span className="text-sm">Running real-time vulnerability scan...</span>
              </div>
            ) : audit ? (
              ([
                { key: 'inputValidationActive', label: 'Input Sanitization', desc: 'React auto-escapes all rendered text to prevent injection' },
                { key: 'storageSanitized',       label: 'State Integrity',   desc: 'Zustand store schema passes structural validation' },
                { key: 'errorBoundaryActive',    label: 'Crash Protection',  desc: 'Top-level ErrorBoundary is active and catching exceptions' },
                { key: 'cspEnabled',             label: 'CSP Header',        desc: 'Content Security Policy (meta tag/helmet) is present and active' },
              ] as const).map(({ key, label, desc }) => {
                const isPassed = audit ? audit[key as keyof typeof audit] : false;
                return (
                  <div key={key} className="flex gap-3 items-start animate-fade-in">
                    <span className="text-base leading-tight">{isPassed ? '✅' : '⚠️'}</span>
                    <div>
                      <p className={`text-[13px] font-medium ${isPassed ? 'text-emerald-400' : 'text-amber-400'}`}>{label}</p>
                      <p className="text-muted text-[11px]">{desc}</p>
                    </div>
                  </div>
                );
              })
            ) : null}
          </div>
        )}
      </S>

      {/* Clear data */}
      <div>
        {!confirmClear ? (
          <button 
            onClick={() => setClear(true)} 
            className="px-4 py-2 rounded-xl text-sm transition-all bg-card border border-rose-500/30 text-rose-400 hover:bg-rose-500/10"
          >
            🗑️ Clear All Data
          </button>
        ) : (
          <div className="flex items-center gap-3 flex-wrap">
            <p className="text-rose-400 text-sm">Are you sure? This cannot be undone.</p>
            <button 
              onClick={() => { localStorage.clear(); window.location.reload(); }} 
              className="px-4 py-2 rounded-xl text-sm transition-all bg-rose-500/15 border border-rose-500/40 text-rose-400 hover:bg-rose-500/25 font-semibold"
            >
              Yes, Clear Everything
            </button>
            <button 
              onClick={() => setClear(false)} 
              className="px-4 py-2 rounded-xl text-sm transition-all bg-card border border-card text-secondary hover:border-emerald-500/30"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

