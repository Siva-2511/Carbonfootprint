import React from 'react';
import { useStore } from '../../core/store';
import { Badge } from '../ui/Badge';
import { ProgressBar } from '../ui/ProgressBar';
import { simplify } from '../../services/core/textSimplifier';

const PERSONA_ICONS: Record<string, string> = {
  'Eco-Leader': '🌟',
  'Urban Commuter': '🚇',
  'Energy-Intensive Resident': '⚡',
  'Industrial Consumer': '🏭',
  'Balanced Emitter': '⚖️',
};

const TREND_CONFIG = {
  increasing: { label: 'Increasing', color: 'danger' as const, icon: '📈' },
  stable: { label: 'Stable', color: 'warning' as const, icon: '➡️' },
  decreasing: { label: 'Decreasing', color: 'success' as const, icon: '📉' },
};

const CATEGORY_COLORS: Record<string, string> = {
  energy: 'bg-amber-500',
  transport: 'bg-blue-500',
  diet: 'bg-green-500',
  consumption: 'bg-purple-400',
};

export function DnaResult() {
  const result = useStore((s) => s.result);
  const dna = useStore((s) => s.dna);
  const recommendations = useStore((s) => s.recommendations);
  const eli10 = useStore((s) => s.settings.eli10Mode);

  if (!result || !dna) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)' }}>
        <div style={{ fontSize: '3rem', marginBottom: '12px' }}>🌿</div>
        <p>Complete your profile above to see your Carbon DNA</p>
      </div>
    );
  }

  const topRec = recommendations.find((r) => r.priority === 'P0');
  const trend = TREND_CONFIG[dna.riskTrend];
  const categories = ['energy', 'transport', 'diet', 'consumption'] as const;

  return (
    <div
      aria-live="polite"
      className="space-y-5 animate-slide-up"
    >
      {/* Persona card */}
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-card)', borderRadius: '1.25rem', padding: '1.5rem' }}>
        <p style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Your Carbon DNA</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1rem' }}>
          <span style={{ fontSize: '2.5rem' }}>{PERSONA_ICONS[dna.persona] ?? '🌍'}</span>
          <h2 className="font-display" style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>{dna.persona}</h2>
        </div>

        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '1.25rem' }}>
          <span className="metric" style={{ fontSize: '3.5rem', color: '#34d399' }}>{result.totalAnnualTons.toFixed(1)}</span>
          <span style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>tons CO₂e / year</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {categories.map((cat) => (
            <div key={cat} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ color: 'var(--text-secondary)', fontSize: '13px', width: '90px', textTransform: 'capitalize' }}>{cat}</span>
              <div style={{ flex: 1, height: '8px', background: 'rgba(255,255,255,0.08)', borderRadius: '99px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${result.breakdown[cat].percentage}%`, background: cat === 'energy' ? '#f59e0b' : cat === 'transport' ? '#3b82f6' : cat === 'diet' ? '#22c55e' : '#a855f7', borderRadius: '99px', transition: 'width 0.7s ease' }} />
              </div>
              <span className="metric" style={{ fontSize: '12px', color: 'var(--text-secondary)', width: '36px', textAlign: 'right' }}>{result.breakdown[cat].percentage}%</span>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '10px', marginTop: '1.25rem', flexWrap: 'wrap' }}>
          <Badge variant={trend.color}>{trend.icon} {trend.label}</Badge>
          <Badge variant="info">⚡ {dna.reductionPotential}% reduction possible</Badge>
        </div>
      </div>

      {/* Top recommendation */}
      {topRec && (
        <div style={{ background: 'rgba(52,211,153,0.08)', border: '1px solid rgba(52,211,153,0.25)', borderRadius: '1.25rem', padding: '1.25rem' }}>
          <p style={{ fontSize: '11px', fontWeight: 700, color: '#34d399', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>
            🎯 Top Priority Action
          </p>
          <h3 className="font-display" style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px', fontSize: '15px' }}>{topRec.action}</h3>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '10px' }}>
            {eli10 ? simplify(topRec.reason) : topRec.reason}
          </p>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <Badge variant="success">-{topRec.impactKg} kg/yr</Badge>
            <Badge variant="neutral">{topRec.difficulty}</Badge>
            <Badge variant="neutral">{topRec.timeframe}</Badge>
          </div>
        </div>
      )}
    </div>
  );
}


