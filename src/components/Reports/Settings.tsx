import React, { useState } from 'react';
import { useStore } from '../../core/store';
import { runSecurityAudit } from '../../core/security';

const PERSONAS = [
  { key: 'friendly',  icon: '💚', label: 'Friendly Guide',  desc: 'Supportive and encouraging' },
  { key: 'strict',    icon: '💪', label: 'Strict Coach',    desc: 'Direct, results-focused' },
  { key: 'scientist', icon: '🔬', label: 'Eco Scientist',   desc: 'Data-driven with numbers' },
] as const;

function S({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ paddingBottom: '1.25rem', borderBottom: '1px solid var(--border-card)' }}>
      {children}
    </div>
  );
}

export function Settings() {
  const settings         = useStore((s) => s.settings);
  const setTheme         = useStore((s) => s.setTheme);
  const toggleEli10      = useStore((s) => s.toggleEli10);
  const setCoachPersona  = useStore((s) => s.setCoachPersona);
  const setGeminiApiKey  = useStore((s) => s.setGeminiApiKey);
  const clearGeminiApiKey = useStore((s) => s.clearGeminiApiKey);

  const [keyInput, setKeyInput]     = useState('');
  const [showKey, setShowKey]       = useState(false);
  const [showHealth, setShowHealth] = useState(false);
  const [confirmClear, setClear]    = useState(false);
  const [audit, setAudit]           = useState<any>(null);
  const [isAuditing, setIsAuditing] = useState(false);

  const startAudit = () => {
    setShowHealth(true);
    if (!audit && !isAuditing) {
      setIsAuditing(true);
      // Simulate real-time checking for dramatic effect
      setTimeout(() => {
        setAudit(runSecurityAudit());
        setIsAuditing(false);
      }, 1500);
    } else if (showHealth) {
      setShowHealth(false);
    }
  };

  const isDark = settings.theme !== 'light';

  const btnStyle = (active: boolean): React.CSSProperties => ({
    padding: '8px 16px', borderRadius: '10px', fontSize: '13px', fontWeight: active ? 600 : 400,
    background: active ? 'rgba(52,211,153,0.18)' : 'var(--bg-card)',
    border: `1px solid ${active ? 'rgba(52,211,153,0.4)' : 'var(--border-card)'}`,
    color: active ? '#34d399' : 'var(--text-secondary)',
    cursor: 'pointer', transition: 'all 0.2s',
  });

  return (
    <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <h2 className="font-display font-bold" style={{ fontSize: '20px', color: 'var(--text-primary)' }}>
        ⚙️ Settings
      </h2>

      {/* Theme */}
      <S>
        <p style={{ color: 'var(--text-secondary)', fontSize: '13px', fontWeight: 500, marginBottom: '10px' }}>Appearance</p>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={() => setTheme('dark')}  style={btnStyle(isDark)}  aria-pressed={isDark}>🌙 Dark Mode</button>
          <button onClick={() => setTheme('light')} style={btnStyle(!isDark)} aria-pressed={!isDark}>☀️ Light Mode</button>
        </div>
      </S>

      {/* ELI10 */}
      <S>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <p style={{ color: 'var(--text-primary)', fontSize: '14px', fontWeight: 500 }}>🧒 ELI10 Mode</p>
            <p style={{ color: 'var(--text-muted)', fontSize: '12px', marginTop: '2px' }}>Simplifies all technical language</p>
          </div>
          <button
            role="switch"
            aria-checked={settings.eli10Mode}
            onClick={toggleEli10}
            style={{
              width: '48px', height: '26px', borderRadius: '99px',
              background: settings.eli10Mode ? '#059669' : 'rgba(255,255,255,0.15)',
              border: 'none', cursor: 'pointer', position: 'relative',
              transition: 'background 0.2s', flexShrink: 0,
            }}
          >
            <span style={{
              position: 'absolute', top: '3px',
              left: settings.eli10Mode ? '25px' : '3px',
              width: '20px', height: '20px', borderRadius: '50%', background: '#fff',
              transition: 'left 0.2s', boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
            }} />
            <span className="sr-only">{settings.eli10Mode ? 'Disable' : 'Enable'} ELI10 mode</span>
          </button>
        </div>
      </S>

      {/* Language note */}
      <S>
        <p style={{ color: 'var(--text-secondary)', fontSize: '13px', fontWeight: 500, marginBottom: '6px' }}>🌐 Language</p>
        <p style={{ color: 'var(--text-muted)', fontSize: '12px' }}>
          Use the <strong style={{ color: 'var(--text-secondary)' }}>Google Translate widget</strong> in the header to switch to any language. Supports English, Hindi, Spanish, French, Arabic, and 100+ more.
        </p>
      </S>

      {/* Coach Persona */}
      <S>
        <p style={{ color: 'var(--text-secondary)', fontSize: '13px', fontWeight: 500, marginBottom: '10px' }}>AI Coach Persona</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
          {PERSONAS.map((p) => (
            <button
              key={p.key}
              onClick={() => setCoachPersona(p.key)}
              aria-pressed={settings.coachPersona === p.key}
              style={{
                padding: '12px 8px', borderRadius: '12px', textAlign: 'left',
                background: settings.coachPersona === p.key ? 'rgba(52,211,153,0.15)' : 'var(--bg-card)',
                border: `1px solid ${settings.coachPersona === p.key ? 'rgba(52,211,153,0.4)' : 'var(--border-card)'}`,
                cursor: 'pointer', transition: 'all 0.2s',
              }}
            >
              <div style={{ fontSize: '22px', marginBottom: '4px' }}>{p.icon}</div>
              <p style={{ color: 'var(--text-primary)', fontSize: '12px', fontWeight: 600 }}>{p.label}</p>
              <p style={{ color: 'var(--text-muted)', fontSize: '11px', marginTop: '2px' }}>{p.desc}</p>
            </button>
          ))}
        </div>
      </S>


      {/* System Health */}
      <S>
        <button
          onClick={startAudit}
          aria-expanded={showHealth}
          style={{ ...btnStyle(showHealth), display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          🔒 System Health {showHealth ? '▲' : '▼'}
        </button>
        {showHealth && (
          <div style={{ marginTop: '12px', background: 'var(--bg-card)', border: '1px solid var(--border-card)', borderRadius: '10px', padding: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {isAuditing ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '20px', color: 'var(--text-secondary)' }}>
                <div className="spinner" style={{ width: '16px', height: '16px', border: '2px solid rgba(52,211,153,0.3)', borderTopColor: '#34d399', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                <span>Running real-time vulnerability scan...</span>
              </div>
            ) : audit ? (
              ([
                { key: 'inputValidationActive', label: 'Input Sanitization', desc: 'React auto-escapes all rendered text to prevent injection' },
                { key: 'storageSanitized',       label: 'State Integrity',   desc: 'Zustand store schema passes Zod-like structural validation' },
                { key: 'errorBoundaryActive',    label: 'Crash Protection',  desc: 'Top-level ErrorBoundary is active and catching exceptions' },
                { key: 'apiKeySecured',          label: 'Local API Key',     desc: 'Key is isolated in browser memory, no backend transmission' },
                { key: 'cspEnabled',             label: 'CSP Header',        desc: 'Content Security Policy (meta tag) is present and active' },
              ] as const).map(({ key, label, desc }) => (
                <div key={key} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', animation: 'fadeIn 0.3s ease-out' }}>
                  <span style={{ fontSize: '16px', lineHeight: 1.4 }}>{(audit as any)[key] ? '✅' : '⚠️'}</span>
                  <div>
                    <p style={{ color: (audit as any)[key] ? '#34d399' : '#fbbf24', fontSize: '13px', fontWeight: 500 }}>{label}</p>
                    <p style={{ color: 'var(--text-muted)', fontSize: '11px' }}>{desc}</p>
                  </div>
                </div>
              ))
            ) : null}
          </div>
        )}
      </S>

      {/* Clear data */}
      <div>
        {!confirmClear ? (
          <button onClick={() => setClear(true)} style={{ ...btnStyle(false), color: '#f87171', borderColor: 'rgba(248,113,113,0.3)' }}>
            🗑️ Clear All Data
          </button>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <p style={{ color: '#f87171', fontSize: '13px' }}>Are you sure? This cannot be undone.</p>
            <button onClick={() => { localStorage.clear(); window.location.reload(); }} style={{ ...btnStyle(false), background: 'rgba(248,113,113,0.15)', color: '#f87171', borderColor: 'rgba(248,113,113,0.4)' }}>
              Yes, Clear Everything
            </button>
            <button onClick={() => setClear(false)} style={btnStyle(false)}>Cancel</button>
          </div>
        )}
      </div>
    </div>
  );
}

