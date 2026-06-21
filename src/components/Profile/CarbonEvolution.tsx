import React, { useEffect, useRef, useState } from 'react';
import { useStore } from '../../core/store';
import { project } from '../../services/future/projectionEngine';
import {
  Chart, LineController, LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend, Filler,
} from 'chart.js';

Chart.register(LineController, LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend, Filler);

const TIMELINE = ['Now', '1 Month', '6 Months', 'Net Zero'];
const PROJ_IDX  = [0, 0, 1, 5];

export function CarbonEvolution() {
  const result     = useStore((s) => s.result);
  const dna        = useStore((s) => s.dna);
  const completed  = useStore((s) => s.habits.completedTaskIds.length);
  const totalRecs  = useStore((s) => s.recommendations.length);
  const [step, setStep] = useState(0);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef  = useRef<Chart | null>(null);

  const pct  = totalRecs > 0 ? (completed / totalRecs) * 100 : 0;
  const proj = result ? project(result.totalAnnualTons, pct) : null;

  /* Destroy old chart, build new one whenever result changes */
  useEffect(() => {
    if (!canvasRef.current || !proj) return;

    // CRITICAL: always destroy before creating
    if (chartRef.current) {
      chartRef.current.destroy();
      chartRef.current = null;
    }

    chartRef.current = new Chart(canvasRef.current, {
      type: 'line',
      data: {
        labels: proj.years.map((y) => `Year ${y}`),
        datasets: [
          {
            label: 'Business As Usual',
            data: proj.bau,
            borderColor: '#f87171',
            backgroundColor: 'rgba(248,113,113,0.06)',
            tension: 0.4, pointRadius: 4, fill: true,
          },
          {
            label: 'Your Green Path',
            data: proj.sustainable,
            borderColor: '#34d399',
            backgroundColor: 'rgba(52,211,153,0.06)',
            tension: 0.4, pointRadius: 4, fill: true,
          },
        ],
      },
      options: {
        responsive: true,
        animation: false,
        plugins: {
          legend: { labels: { color: '#9ca3af', font: { family: 'Inter', size: 11 } } },
          tooltip: {
            callbacks: {
              label: (ctx) => {
                const raw = ctx.raw as number;
                return ` ${raw.toFixed(2)} tons CO₂e`;
              },
            },
          },
        },
        scales: {
          y: {
            ticks: { color: '#6b7280' },
            grid:  { color: 'rgba(255,255,255,0.06)' },
            title: { display: true, text: 'tons CO₂e/year', color: '#6b7280' },
          },
          x: { ticks: { color: '#6b7280' }, grid: { color: 'rgba(255,255,255,0.04)' } },
        },
      },
    });

    return () => {
      chartRef.current?.destroy();
      chartRef.current = null;
    };
  }, [result]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!result || !dna || !proj) return null;

  const greenTons   = proj.sustainable[Math.min(PROJ_IDX[step], proj.sustainable.length - 1)];
  const currentTons = result.totalAnnualTons;
  const savingPct   = currentTons > 0 ? Math.round(((currentTons - greenTons) / currentTons) * 100) : 0;

  return (
    <div className="space-y-5 mt-6">
      <h2 style={{ color: 'var(--text-primary)' }} className="font-display font-bold text-xl">
        🌱 Your Carbon Evolution
      </h2>

      {/* Twin comparison cards */}
      <div className="grid grid-cols-2 gap-4">
        <div style={{ background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.25)', borderRadius: '1rem', padding: '1rem' }}>
          <p style={{ color: '#f87171', fontSize: '11px', fontWeight: 600, marginBottom: '4px' }}>CURRENT YOU</p>
          <p className="metric" style={{ fontSize: '3.5rem', lineHeight: '1', letterSpacing: '-0.02em', color: '#f87171' }}>{currentTons.toFixed(1)}</p>
          <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginTop: '4px' }}>tons CO₂e/year</p>
          <p style={{ color: 'var(--text-muted)', fontSize: '12px', marginTop: '6px' }}>{dna.persona}</p>
        </div>
        <div style={{ background: 'rgba(52,211,153,0.08)', border: '1px solid rgba(52,211,153,0.25)', borderRadius: '1rem', padding: '1rem' }}>
          <p style={{ color: '#34d399', fontSize: '11px', fontWeight: 600, marginBottom: '4px' }}>GREEN YOU</p>
          <p className="metric" style={{ fontSize: '3.5rem', lineHeight: '1', letterSpacing: '-0.02em', color: '#34d399' }}>{greenTons.toFixed(1)}</p>
          <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginTop: '4px' }}>tons CO₂e/year</p>
          <p style={{ color: '#34d399', fontSize: '12px', fontWeight: 500, marginTop: '6px' }}>
            {savingPct > 0 ? `↓ ${savingPct}% reduction` : 'Eco-Leader 🌟'}
          </p>
        </div>
      </div>

      {/* Timeline tabs */}
      <div className="flex gap-2" role="tablist" aria-label="Evolution timeline">
        {TIMELINE.map((label, i) => (
          <button
            key={label}
            role="tab"
            aria-selected={step === i}
            onClick={() => setStep(i)}
            style={{
              padding: '6px 12px',
              borderRadius: '8px',
              fontSize: '12px',
              fontWeight: 500,
              border: step === i ? '1px solid rgba(52,211,153,0.4)' : '1px solid transparent',
              background: step === i ? 'rgba(52,211,153,0.15)' : 'transparent',
              color: step === i ? '#34d399' : 'var(--text-muted)',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Chart */}
      <div className="glass-card" style={{ padding: '1rem' }}>
        <canvas
          ref={canvasRef}
          aria-label="5-year carbon emission projection chart"
          role="img"
        />
        <table className="sr-only">
          <caption>5-year carbon projection</caption>
          <thead><tr><th>Year</th><th>BAU (tons)</th><th>Sustainable (tons)</th></tr></thead>
          <tbody>
            {proj.years.map((y, i) => (
              <tr key={y}><td>{y}</td><td>{proj.bau[i]}</td><td>{proj.sustainable[i]}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}


