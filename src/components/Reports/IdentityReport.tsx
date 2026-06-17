import React, { useState } from 'react';
import { useStore } from '../../core/store';
import { simplify } from '../../services/core/textSimplifier';

const BADGE_DEFS = [
  { id: 'first_step',   icon: '🌱', label: 'First Step',        desc: 'Calculated your first footprint',   points: 0 },
  { id: 'getting-started',  icon: '🔥', label: 'Getting Started',    desc: 'Reached 100 Eco Points',           points: 100 },
  { id: 'action-taker', icon: '⚡', label: 'Action Taker',      desc: 'Reached 1,000 Eco Points',         points: 1000 },
  { id: 'impact-maker',   icon: '🏆', label: 'Impact Maker',       desc: 'Reached 2,500 Eco Points',       points: 2500 },
  { id: 'carbon-neutral', icon: '✅', label: 'Carbon Neutral',       desc: 'Reached 5,000 Eco Points',              points: 5000 },
  { id: 'co2_saver',    icon: '🌍', label: 'CO₂ Saver',         desc: 'On track to save 1 ton CO₂/year',  points: 0 },
  { id: 'net_zero',     icon: '🌿', label: 'Net Zero Path',      desc: 'Below 2 tons CO₂e/year target',   points: 0 },
];

export function GamificationBadges() {
  const habits   = useStore((s) => s.habits);
  const result   = useStore((s) => s.result);

  const unlockedIds = new Set(habits.badges);
  if (result) unlockedIds.add('first_step');
  if (result && result.totalAnnualTons < 2) unlockedIds.add('net_zero');
  if (result && result.totalAnnualTons < 4) unlockedIds.add('co2_saver');
  if (habits.ecoPoints >= 100)  unlockedIds.add('getting-started');
  if (habits.ecoPoints >= 1000) unlockedIds.add('action-taker');
  if (habits.ecoPoints >= 2500) unlockedIds.add('impact-maker');
  if (habits.ecoPoints >= 5000) unlockedIds.add('carbon-neutral');

  const unlocked = BADGE_DEFS.filter((b) => unlockedIds.has(b.id));
  const locked   = BADGE_DEFS.filter((b) => !unlockedIds.has(b.id));
  const progress = Math.round((unlocked.length / BADGE_DEFS.length) * 100);

  return (
    <div className="glass-card" style={{ padding: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <h3 className="font-display font-bold" style={{ color: 'var(--text-primary)', fontSize: '16px' }}>
          🏅 Achievement Badges
        </h3>
        <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
          {unlocked.length}/{BADGE_DEFS.length} unlocked
        </span>
      </div>

      {/* Progress bar */}
      <div style={{ marginBottom: '1.25rem' }}>
        <div style={{ height: '6px', background: 'rgba(255,255,255,0.08)', borderRadius: '99px', overflow: 'hidden' }}>
          <div style={{
            height: '100%', width: `${progress}%`,
            background: 'linear-gradient(90deg, #34d399, #60a5fa)',
            borderRadius: '99px', transition: 'width 0.8s ease',
          }} />
        </div>
        <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px', textAlign: 'right' }}>
          {progress}% collection complete
        </p>
      </div>

      {/* Unlocked badges */}
      {unlocked.length > 0 && (
        <div style={{ marginBottom: '1rem' }}>
          <p style={{ fontSize: '11px', color: '#34d399', fontWeight: 600, marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            ✨ Unlocked
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {unlocked.map((b, i) => (
              <div
                key={b.id}
                className="badge-unlocked"
                style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
                  padding: '12px 14px', borderRadius: '14px', minWidth: '90px',
                  background: 'linear-gradient(135deg, rgba(52,211,153,0.15), rgba(96,165,250,0.10))',
                  border: '1px solid rgba(52,211,153,0.35)',
                  animationDelay: `${i * 80}ms`,
                  cursor: 'default',
                }}
                title={b.desc}
              >
                <span style={{ fontSize: '2rem', lineHeight: 1 }}>{b.icon}</span>
                <span style={{ fontSize: '11px', fontWeight: 600, color: '#34d399', textAlign: 'center' }}>{b.label}</span>
                <span style={{ fontSize: '10px', color: 'var(--text-muted)', textAlign: 'center', lineHeight: 1.3 }}>{b.desc}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Locked badges */}
      {locked.length > 0 && (
        <div>
          <p style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            🔒 Locked
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {locked.map((b) => (
              <div
                key={b.id}
                style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
                  padding: '12px 14px', borderRadius: '14px', minWidth: '90px',
                  background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-card)',
                  opacity: 0.6, cursor: 'default', filter: 'grayscale(0.8)',
                }}
                title={`Locked: ${b.desc}`}
              >
                <span style={{ fontSize: '2rem', lineHeight: 1 }}>{b.icon}</span>
                <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', textAlign: 'center' }}>{b.label}</span>
                <span style={{ fontSize: '10px', color: 'var(--text-muted)', textAlign: 'center', lineHeight: 1.3 }}>{b.desc}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Streak display */}
      {habits.currentStreak > 0 && (
        <div style={{
          marginTop: '1rem', padding: '10px 14px', borderRadius: '10px',
          background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.3)',
          display: 'flex', alignItems: 'center', gap: '10px',
        }}>
          <span style={{ fontSize: '24px' }}>🔥</span>
          <div>
            <p style={{ color: '#fbbf24', fontSize: '14px', fontWeight: 700 }}>{habits.currentStreak}-day streak!</p>
            <p style={{ color: 'var(--text-muted)', fontSize: '12px' }}>Longest: {habits.longestStreak} days</p>
          </div>
        </div>
      )}
    </div>
  );
}

function getGrade(tons: number): { grade: string; color: string; label: string } {
  if (tons < 1.5) return { grade: 'A+', color: '#34d399', label: 'Exceptional' };
  if (tons < 2.0) return { grade: 'A',  color: '#34d399', label: 'Excellent' };
  if (tons < 3.0) return { grade: 'B',  color: '#60a5fa', label: 'Good' };
  if (tons < 4.5) return { grade: 'C',  color: '#fbbf24', label: 'Average' };
  if (tons < 6.0) return { grade: 'D',  color: '#f97316', label: 'Needs Work' };
  return { grade: 'F', color: '#f87171', label: 'Critical' };
}

export function IdentityReport() {
  const result  = useStore((s) => s.result);
  const dna     = useStore((s) => s.dna);
  const recs    = useStore((s) => s.recommendations);
  const habits  = useStore((s) => s.habits);
  const eli10   = useStore((s) => s.settings.eli10Mode);
  const [printing, setPrinting] = useState(false);

  const handleExportPDF = () => {
    setPrinting(true);
    setTimeout(() => {
      window.print();
      setPrinting(false);
    }, 200);
  };

  if (!result || !dna) {
    return (
      <div className="glass-card" style={{ padding: '2rem', textAlign: 'center' }}>
        <div style={{ fontSize: '3rem', marginBottom: '12px' }}>📋</div>
        <p style={{ color: 'var(--text-muted)' }}>Calculate your carbon footprint to generate your identity report</p>
      </div>
    );
  }

  const grade     = getGrade(result.totalAnnualTons);
  const topRecs   = recs.filter((r) => r.priority === 'P0').slice(0, 5);
  const dateStr   = new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });
  const savings   = Math.round(result.totalAnnualKg * (dna.reductionPotential / 100));

  return (
    <div>
      {/* Print-only styles */}
      <style>{`
        @media print {
          body * { visibility: hidden; }
          #print-report, #print-report * { visibility: visible; }
          #print-report { position: absolute; left: 0; top: 0; width: 100%; }
        }
      `}</style>

      {/* Export button */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '12px' }} className="no-print">
        <button
          onClick={handleExportPDF}
          disabled={printing}
          className="btn-primary"
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          aria-label="Download PDF report"
        >
          {printing ? '⏳ Preparing...' : '📥 Download PDF Report'}
        </button>
      </div>

      {/* Report content */}
      <div id="print-report" className="glass-card" style={{ padding: '1.5rem' }}>
        {/* Header */}
        <div style={{ borderBottom: '1px solid var(--border-card)', paddingBottom: '1rem', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h2 className="font-display font-bold" style={{ fontSize: '22px', color: 'var(--text-primary)' }}>
                🌿 Carbon Identity Report
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '12px', marginTop: '2px' }}>
                Generated: {dateStr} · CarbonSense Intelligence System
              </p>
            </div>
            {/* Grade badge */}
            <div style={{
              width: '70px', height: '70px', borderRadius: '50%',
              background: `${grade.color}20`, border: `3px solid ${grade.color}`,
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              boxShadow: `0 0 20px ${grade.color}40`,
            }}>
              <span className="metric" style={{ fontSize: '24px', color: grade.color }}>{grade.grade}</span>
              <span style={{ fontSize: '9px', color: grade.color, fontWeight: 600 }}>{grade.label}</span>
            </div>
          </div>
        </div>

        {/* Carbon DNA persona */}
        <div style={{ marginBottom: '1.25rem', padding: '1rem', borderRadius: '12px', background: 'rgba(52,211,153,0.06)', border: '1px solid rgba(52,211,153,0.2)' }}>
          <p style={{ color: '#34d399', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Your Carbon DNA</p>
          <p className="font-display" style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>{eli10 ? simplify(dna.persona) : dna.persona}</p>
          <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginTop: '4px' }}>
            Primary source: {eli10 ? simplify(dna.primarySource) : dna.primarySource} · {dna.primaryPercentage}% of your footprint
          </p>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '10px' }}>
            <span style={{ padding: '3px 10px', borderRadius: '20px', fontSize: '12px', background: 'rgba(248,113,113,0.15)', color: '#f87171', border: '1px solid rgba(248,113,113,0.3)' }}>
              🎯 Primary: {eli10 ? simplify(result.primaryDriver) : result.primaryDriver}
            </span>
            <span style={{ padding: '3px 10px', borderRadius: '20px', fontSize: '12px', background: 'rgba(52,211,153,0.15)', color: '#34d399', border: '1px solid rgba(52,211,153,0.3)' }}>
              ↓ {dna.reductionPotential}% reduction potential
            </span>
          </div>
        </div>

        {/* Key metrics grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px', marginBottom: '1.25rem' }}>
          {[
            { label: 'Annual Footprint', value: `${result.totalAnnualTons.toFixed(2)}`, unit: 'tons CO₂e', color: '#f87171' },
            { label: 'India Average',    value: '1.90', unit: 'tons CO₂e', color: '#fbbf24' },
            { label: 'Potential Saving', value: `${savings.toLocaleString()}`, unit: 'kg CO₂e/year', color: '#34d399' },
            { label: 'Actions Done',     value: `${habits.completedTaskIds.length}`, unit: `of ${recs.length}`, color: '#60a5fa' },
          ].map((m) => (
            <div key={m.label} style={{ padding: '12px', borderRadius: '10px', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border-card)' }}>
              <p style={{ color: 'var(--text-muted)', fontSize: '11px', marginBottom: '2px' }}>{m.label}</p>
              <p className="metric" style={{ fontSize: '1.5rem', color: m.color }}>{m.value}</p>
              <p style={{ color: 'var(--text-muted)', fontSize: '11px' }}>{m.unit}</p>
            </div>
          ))}
        </div>

        {/* Category breakdown */}
        <div style={{ marginBottom: '1.25rem' }}>
          <p className="font-display" style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '10px', fontSize: '14px' }}>
            📊 Emission Breakdown
          </p>
          {(['energy', 'transport', 'diet', 'consumption'] as const).map((cat) => (
            <div key={cat} style={{ marginBottom: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                <span style={{ color: 'var(--text-secondary)', fontSize: '13px', textTransform: 'capitalize' }}>{cat}</span>
                <span className="metric" style={{ fontSize: '12px', color: 'var(--text-primary)' }}>
                  {result.breakdown[cat].kg.toLocaleString()} kg ({result.breakdown[cat].percentage}%)
                </span>
              </div>
              <div style={{ height: '7px', background: 'rgba(255,255,255,0.07)', borderRadius: '99px', overflow: 'hidden' }}>
                <div style={{
                  height: '100%',
                  width: `${result.breakdown[cat].percentage}%`,
                  background: cat === 'energy' ? '#f59e0b' : cat === 'transport' ? '#3b82f6' : cat === 'diet' ? '#22c55e' : '#a855f7',
                  borderRadius: '99px', transition: 'width 0.8s ease',
                }} />
              </div>
            </div>
          ))}
        </div>

        {/* Top recommendations */}
        {topRecs.length > 0 && (
          <div>
            <p className="font-display" style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '10px', fontSize: '14px' }}>
              🎯 Priority Actions (P0 — Highest Impact)
            </p>
            <ol style={{ paddingLeft: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {topRecs.map((rec, i) => (
                <li key={rec.id} style={{
                  display: 'flex', gap: '12px', alignItems: 'flex-start',
                  padding: '10px', borderRadius: '10px',
                  background: 'rgba(52,211,153,0.05)', border: '1px solid rgba(52,211,153,0.15)',
                }}>
                  <span style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#34d399', color: '#065f46', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 800, flexShrink: 0 }}>
                    {i + 1}
                  </span>
                  <div>
                    <p style={{ color: 'var(--text-primary)', fontSize: '13px', fontWeight: 500 }}>{rec.action}</p>
                    <p style={{ color: '#34d399', fontSize: '11px', marginTop: '2px' }}>Saves ~{rec.impactKg} kg CO₂e/year</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        )}

        {/* Gamification section */}
        <div style={{ marginTop: '1.25rem', borderTop: '1px solid var(--border-card)', paddingTop: '1rem' }}>
          <GamificationBadges />
        </div>
      </div>
    </div>
  );
}

