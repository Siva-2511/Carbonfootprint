/**
 * @fileoverview ProgressTracker component that visualises the user's monthly carbon
 * budget against a sustainable target using an SVG ring gauge, and plots their
 * historical footprint trend with an animated Chart.js line chart.
 */

import React, { useEffect, useRef } from 'react';
import { useStore } from '../../core/store';
import { calculateBudget } from '../../services/future/budgetManager';
import { Chart, LineController, LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Filler } from 'chart.js';

Chart.register(LineController, LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Filler);

/**
 * Renders a progress tracker card that displays:
 * - An SVG ring gauge showing the percentage of the monthly carbon budget used.
 * - A budget summary including the monthly budget in kg CO₂e and sustainable target.
 * - A status alert message colour-coded by severity (on-track / warning / critical).
 * - A line chart of the last 10 historical footprint entries (shown when ≥2 entries exist).
 *
 * Reads `result` and `history` from the global Zustand store.
 * @returns The progress tracker glass card, or an empty-state prompt if no result exists.
 */
export function ProgressTracker() {
  const result    = useStore((s) => s.result);
  const history   = useStore((s) => s.history);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef  = useRef<Chart | null>(null);

  useEffect(() => {
    if (!canvasRef.current || history.length < 2) return;

    if (chartRef.current) { chartRef.current.destroy(); chartRef.current = null; }

    const last10 = history.slice(-10);
    chartRef.current = new Chart(canvasRef.current, {
      type: 'line',
      data: {
        labels: last10.map((_, i) => `Entry ${i + 1}`),
        datasets: [{
          label: 'Footprint (tons)',
          data: last10.map((r) => r.totalAnnualTons),
          borderColor: '#34d399',
          backgroundColor: 'rgba(52,211,153,0.08)',
          tension: 0.4, pointRadius: 5, pointBackgroundColor: '#34d399', fill: true,
        }],
      },
      options: {
        responsive: true,
        animation: false,
        plugins: { legend: { display: false } },
        scales: {
          y: { ticks: { color: '#6b7280' }, grid: { color: 'rgba(255,255,255,0.06)' } },
          x: { ticks: { color: '#6b7280' }, grid: { color: 'rgba(255,255,255,0.04)' } },
        },
      },
    });

    return () => { chartRef.current?.destroy(); chartRef.current = null; };
  }, [history]);

  if (!result) {
    return (
      <div className="glass-card" style={{ padding: '2rem', textAlign: 'center' }}>
        <div style={{ fontSize: '3rem', marginBottom: '12px' }}>📈</div>
        <p style={{ color: 'var(--text-muted)' }}>Calculate your footprint to start tracking progress</p>
      </div>
    );
  }

  const budget = calculateBudget(result.totalAnnualKg);
  const ringPct = Math.min(budget.percentOfTarget, 150);
  const fillPct = Math.min(ringPct, 100);
  const ringColor = budget.status === 'critical' ? '#f87171' : budget.status === 'warning' ? '#fbbf24' : '#34d399';
  const C = 2 * Math.PI * 38;
  const offset = C * (1 - fillPct / 100);

  return (
    <div className="glass-card" style={{ padding: '1.5rem' }}>
      <h2 className="font-display font-bold text-xl" style={{ color: 'var(--text-primary)', marginBottom: '1.25rem' }}>
        📈 Progress Tracker
      </h2>

      <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
        {/* SVG gauge */}
        <div style={{ position: 'relative', width: '100px', height: '100px', flexShrink: 0 }}>
          <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
            <circle cx="50" cy="50" r="38" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="8" />
            <circle cx="50" cy="50" r="38" fill="none"
              stroke={ringColor} strokeWidth="8"
              strokeDasharray={C} strokeDashoffset={offset}
              strokeLinecap="round"
              style={{ transition: 'stroke-dashoffset 0.8s ease, stroke 0.3s' }}
            />
          </svg>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <span className="metric" style={{ fontSize: '1.25rem', color: ringColor }}>{budget.percentOfTarget}%</span>
            <span style={{ fontSize: '9px', color: 'var(--text-muted)' }}>of target</span>
          </div>
        </div>

        <div style={{ flex: 1 }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>Monthly carbon budget</p>
          <p className="metric" style={{ fontSize: '1.75rem', color: 'var(--text-primary)' }}>
            {budget.monthlyBudgetKg} <span style={{ fontSize: '14px', color: 'var(--text-muted)', fontWeight: 400 }}>kg CO₂e</span>
          </p>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
            Sustainable target: {Math.round(budget.sustainableMonthlyKg)} kg/month
          </p>
          <div style={{
            marginTop: '10px', padding: '8px 12px', borderRadius: '8px', fontSize: '12px',
            background: budget.status === 'critical' ? 'rgba(248,113,113,0.1)' : budget.status === 'warning' ? 'rgba(251,191,36,0.1)' : 'rgba(52,211,153,0.1)',
            color: budget.status === 'critical' ? '#f87171' : budget.status === 'warning' ? '#fbbf24' : '#34d399',
            border: `1px solid ${budget.status === 'critical' ? 'rgba(248,113,113,0.3)' : budget.status === 'warning' ? 'rgba(251,191,36,0.3)' : 'rgba(52,211,153,0.3)'}`,
          }} aria-live="polite">
            {budget.alertMessage}
          </div>
        </div>
      </div>

      {/* Trend chart */}
      {history.length >= 2 ? (
        <div style={{ marginTop: '1.5rem' }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '10px' }}>
            Your footprint trend (last {Math.min(history.length, 10)} entries)
          </p>
          <canvas ref={canvasRef} aria-label="Carbon footprint history trend" role="img" />
        </div>
      ) : (
        <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border-card)' }}>
          📊 Recalculate your footprint periodically to track your trend here
        </p>
      )}
    </div>
  );
}

