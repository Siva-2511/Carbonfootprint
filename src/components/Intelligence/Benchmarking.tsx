import React from 'react';
import { useStore } from '../../core/store';
import { compareToBenchmarks } from '../../services/core/benchmarks';
import { Badge } from '../ui/Badge';
import { BENCHMARK_DATA } from '../../config';

export function Benchmarking() {
  const result = useStore((s) => s.result);

  if (!result) {
    return (
      <div className="glass-card p-8 text-center text-muted">
        <div className="text-3xl mb-2">🌍</div>
        <p>No data yet — calculate your footprint first</p>
      </div>
    );
  }

  const bm = compareToBenchmarks(result.totalAnnualTons);
  const userTons = result.totalAnnualTons;
  const maxVal = Math.max(userTons, 6);

  const bars = [
    { label: 'You', tons: userTons, color: userTons <= BENCHMARK_DATA.globalAvg ? 'bg-emerald-500' : 'bg-rose-500' },
    { label: 'India Avg', tons: 2.0, color: 'bg-amber-500' },
    { label: 'Global Avg', tons: 4.7, color: 'bg-blue-500' },
    { label: 'Top 10%', tons: 1.3, color: 'bg-emerald-600' },
    { label: 'Paris 2030', tons: 2.0, color: 'bg-teal-500' },
  ];

  return (
    <div className="glass-card p-6 space-y-5">
      <h2 className="font-display font-bold text-xl text-primary">How Do You Compare?</h2>

      {/* Narrative */}
      <p className="text-secondary text-sm">{bm.narrative}</p>

      {/* Comparison cards */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'India Avg', base: 2.0, diff: bm.vsIndia },
          { label: 'Global Avg', base: 4.7, diff: bm.vsGlobal },
          { label: 'Top 10%', base: 1.3, diff: bm.vsTop10 },
        ].map(({ label, base, diff }) => (
          <div key={label} className="var-bg-card rounded-xl p-3 text-center">
            <p className="text-xs text-muted mb-1">{label}</p>
            <p className="metric text-lg font-display font-semibold text-primary">{base}t</p>
            <Badge variant={diff < 0 ? 'success' : 'danger'} size="sm" className="mt-1">
              {diff < 0 ? `${Math.abs(diff)}% less` : `${diff}% more`}
            </Badge>
          </div>
        ))}
      </div>

      {/* Horizontal bar chart */}
      <div className="space-y-3">
        {bars.map(({ label, tons, color }) => (
          <div key={label} className="flex items-center gap-3">
            <span className="text-xs text-secondary w-20">{label}</span>
            <div className="flex-1 h-3 bg-white/10 rounded-full overflow-hidden">
              <div
                className={`h-3 ${color} rounded-full transition-all duration-700`}
                style={{ width: `${(tons / maxVal) * 100}%` }}
              />
            </div>
            <span className="metric text-xs text-secondary w-10">{tons}t</span>
          </div>
        ))}
      </div>

      <p className="text-xs text-muted border-t border-card pt-3">
        🎯 Paris Agreement target: 2.0t per capita by 2030 · IPCC data
      </p>
    </div>
  );
}

