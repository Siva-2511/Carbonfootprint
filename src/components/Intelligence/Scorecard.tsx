/**
 * @fileoverview Scorecard component that displays a user's sustainability score,
 * per-category emission breakdowns as animated progress bars, a doughnut chart,
 * and badge highlights for top strength and biggest opportunity.
 */

import React, { useEffect, useRef, useState } from 'react';
import { useStore } from '../../core/store';

import { ArcElement, Chart, DoughnutController, Legend, Tooltip } from 'chart.js';
import { useSpring, motion } from 'framer-motion';

Chart.register(DoughnutController, ArcElement, Tooltip, Legend);

/**
 * Renders a numeric value that smoothly animates from its previous value to the new one.
 * @param props - Component props.
 * @param props.value - The target numeric value to animate toward.
 * @param props.decimals - Number of decimal places to display (default: 0).
 * @returns A `<motion.span>` element containing the animated number string.
 */
function AnimatedNumber({ value, decimals = 0 }: { value: number; decimals?: number }) {
  const spring = useSpring(0, { stiffness: 60, damping: 20 });
  const [display, setDisplay] = useState('0');
  
  useEffect(() => { spring.set(value); }, [value, spring]);
  useEffect(() => spring.on('change', v => setDisplay(v.toFixed(decimals))), [spring, decimals]);
  
  return <motion.span>{display}</motion.span>;
}

/** Metadata map from score level key to display label, accent color, and background color. */
const SCORE_META: Record<string, { label: string; color: string; bg: string }> = {
  excellent:   { label: 'Excellent',    color: '#34d399', bg: 'rgba(52,211,153,0.15)' },
  good:        { label: 'Good',         color: '#60a5fa', bg: 'rgba(96,165,250,0.15)' },
  average:     { label: 'Average',      color: '#fbbf24', bg: 'rgba(251,191,36,0.15)' },
  needsWork:   { label: 'Needs Work',   color: '#f87171', bg: 'rgba(248,113,113,0.15)' },
};

/**
 * Returns the score metadata (label, color, background) corresponding to a numeric score.
 * @param s - The numeric score (0–100).
 * @returns The matching entry from `SCORE_META`.
 */
function getScoreLevel(s: number) {
  if (s >= 80) return SCORE_META.excellent;
  if (s >= 60) return SCORE_META.good;
  if (s >= 40) return SCORE_META.average;
  return SCORE_META.needsWork;
}

/** Color mapping for each emission category. */
const CAT_COLORS = { energy: '#f59e0b', transport: '#3b82f6', diet: '#22c55e', consumption: '#a855f7' };
/** Ordered list of emission category keys. */
const CATS = ['energy', 'transport', 'diet', 'consumption'] as const;

/**
 * Displays the user's sustainability scorecard, including an animated score ring,
 * per-category emission progress bars, strength/opportunity badges, and a doughnut chart.
 * Reads result data from the global Zustand store.
 * @returns The scorecard card element, or an empty-state prompt if no result exists.
 */
export function Scorecard() {
  const result    = useStore((s) => s.result);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef  = useRef<Chart | null>(null);

  useEffect(() => {
    if (!result || !canvasRef.current) return;

    // Always destroy before recreating
    if (chartRef.current) { chartRef.current.destroy(); chartRef.current = null; }

    const { energy, transport, diet, consumption } = result.breakdown;
    chartRef.current = new Chart(canvasRef.current, {
      type: 'doughnut',
      data: {
        labels: ['Energy', 'Transport', 'Diet', 'Consumption'],
        datasets: [{
          data: [energy.kg, transport.kg, diet.kg, consumption.kg],
          backgroundColor: ['#f59e0b', '#3b82f6', '#22c55e', '#a855f7'],
          borderWidth: 0,
          hoverOffset: 8,
        }],
      },
      options: {
        cutout: '68%',
        animation: false,
        plugins: {
          legend: { labels: { color: '#9ca3af', font: { family: 'Inter', size: 11 }, padding: 12 } },
          tooltip: { callbacks: { label: (ctx) => ` ${ctx.label}: ${(ctx.raw as number).toLocaleString()} kg` } },
        },
      },
    });

    return () => { chartRef.current?.destroy(); chartRef.current = null; };
  }, [result]);

  if (!result) {
    return (
      <div className="glass-card" style={{ padding: '2rem', textAlign: 'center' }}>
        <div style={{ fontSize: '3rem', marginBottom: '12px' }}>📊</div>
        <p style={{ color: 'var(--text-muted)' }}>Complete your profile to see your scorecard</p>
      </div>
    );
  }

  const score = Math.max(0, Math.min(100, Math.round(100 - (result.totalAnnualTons / 12.0) * 100)));
  const sm    = getScoreLevel(score);
  const lowest = CATS.reduce((a, b) => result.breakdown[a].kg < result.breakdown[b].kg ? a : b);

  return (
    <div className="glass-card" style={{ padding: '1.5rem' }}>
      <h2 className="font-display font-bold text-xl" style={{ color: 'var(--text-primary)', marginBottom: '1.25rem' }}>
        📊 Sustainability Scorecard
      </h2>

      {/* Score ring + bars */}
      <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
        {/* Big score display */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '120px' }}>
          <div style={{
            width: '100px', height: '100px', borderRadius: '50%',
            background: sm.bg, border: `3px solid ${sm.color}`,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            boxShadow: `0 0 20px ${sm.color}40`,
          }}>
            <span className="metric" style={{ fontSize: '2rem', color: sm.color }}>
              <AnimatedNumber value={score} />
            </span>
            <span style={{ fontSize: '10px', color: sm.color, fontWeight: 600 }}>/ 100</span>
          </div>
          <span style={{ fontSize: '12px', color: sm.color, fontWeight: 600, marginTop: '8px' }}>{sm.label}</span>
        </div>

        {/* Category bars */}
        <div style={{ flex: 1, minWidth: '200px' }}>
          {CATS.map((cat, idx) => (
            <div key={cat} style={{ marginBottom: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ color: 'var(--text-secondary)', fontSize: '13px', textTransform: 'capitalize' }}>{cat}</span>
                <span className="metric" style={{ color: 'var(--text-primary)', fontSize: '12px' }}>
                  {result.breakdown[cat].kg.toLocaleString()} kg ({result.breakdown[cat].percentage}%)
                </span>
              </div>
              <div style={{ height: '8px', background: 'rgba(255,255,255,0.08)', borderRadius: '99px', overflow: 'hidden' }}>
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: idx * 0.1, duration: 0.8, ease: "easeOut" }}
                  style={{
                    height: '100%',
                    width: `${result.breakdown[cat].percentage}%`,
                    background: CAT_COLORS[cat],
                    borderRadius: '99px',
                    transformOrigin: 'left',
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Badges */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '1rem' }}>
        <span style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 500, background: 'rgba(52,211,153,0.15)', color: '#34d399', border: '1px solid rgba(52,211,153,0.3)' }}>
          ✅ Top Strength: {lowest.charAt(0).toUpperCase() + lowest.slice(1)}
        </span>
        <span style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 500, background: 'rgba(251,191,36,0.15)', color: '#fbbf24', border: '1px solid rgba(251,191,36,0.3)' }}>
          🎯 Biggest Opportunity: {result.primaryDriver.charAt(0).toUpperCase() + result.primaryDriver.slice(1)}
        </span>
      </div>

      {/* Doughnut chart */}
      <div style={{ maxWidth: '260px', margin: '1.25rem auto 0' }}>
        <canvas ref={canvasRef} aria-label="Emissions breakdown doughnut chart" role="img" />
        <table className="sr-only">
          <caption>Emissions by category</caption>
          <thead><tr><th>Category</th><th>kg</th><th>%</th></tr></thead>
          <tbody>
            {CATS.map((c) => (
              <tr key={c}><td>{c}</td><td>{result.breakdown[c].kg}</td><td>{result.breakdown[c].percentage}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

