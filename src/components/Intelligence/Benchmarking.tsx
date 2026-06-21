import React from 'react';
import { useStore } from '../../core/store';
import { compareToBenchmarks } from '../../services/core/benchmarks';
import { Badge } from '../ui/Badge';
import { BENCHMARK_DATA } from '../../config';
import { motion } from 'framer-motion';

export function Benchmarking() {
  const result = useStore((s) => s.result);
  const inputs = useStore((s) => s.inputs);

  if (!result) {
    return (
      <div className="glass-card p-8 text-center text-muted">
        <div className="text-3xl mb-2">🌍</div>
        <p>No data yet — calculate your footprint first</p>
      </div>
    );
  }

  const userCountry = inputs.country || 'India';
  const bm = compareToBenchmarks(result.totalAnnualTons, userCountry);
  const userTons = result.totalAnnualTons;
  const maxVal = Math.max(userTons, 6, bm.countryAvg);

  const countryBars = userCountry === 'India' 
    ? [
        { label: 'India Nat. Avg', tons: BENCHMARK_DATA.indiaAvg, color: 'bg-amber-500' },
        { label: 'Urban India', tons: BENCHMARK_DATA.urbanIndiaAvg, color: 'bg-orange-500' }
      ]
    : [
        { label: `${userCountry} Avg`, tons: bm.countryAvg, color: 'bg-amber-500' }
      ];

  const globalBars = [
    { label: 'Global Avg', tons: BENCHMARK_DATA.globalAvg, color: 'bg-blue-500' },
    { label: 'Top 10%', tons: BENCHMARK_DATA.top10Pct, color: 'bg-emerald-600' },
    { label: 'Paris 2030', tons: BENCHMARK_DATA.parisTarget, color: 'bg-teal-500' },
  ];

  const renderBar = ({ label, tons, color }: { label: string, tons: number, color: string }, idx: number) => (
    <div key={label} className="flex items-center gap-3 mb-2.5">
      <span className="text-xs text-secondary w-[85px] leading-tight shrink-0">{label}</span>
      <div className="flex-1 h-3 bg-white/10 rounded-full overflow-hidden">
        <motion.div
          className={`h-3 ${color} rounded-full`}
          initial={{ width: 0 }}
          animate={{ width: `${(tons / maxVal) * 100}%` }}
          transition={{ delay: idx * 0.1, duration: 0.8, ease: "easeOut" }}
        />
      </div>
      <span className="metric text-xs text-secondary w-10 shrink-0">{tons.toFixed(1)}t</span>
    </div>
  );

  return (
    <div className="glass-card p-6 space-y-5">
      <h2 className="font-display font-bold text-xl text-primary">How Do You Compare?</h2>

      {/* Narrative */}
      <p className="text-secondary text-sm">{bm.narrative}</p>

      {/* Comparison cards */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: userCountry === 'India' ? 'India Avg' : `${userCountry} Avg`, base: bm.countryAvg, diff: bm.vsCountry },
          { label: 'Global Avg', base: bm.globalAvg, diff: bm.vsGlobal },
          { label: 'Top 10%', base: bm.top10Pct, diff: bm.vsTop10 },
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
      <div className="space-y-4 pt-2">
        <div>
          <h3 className="text-[10px] font-semibold text-muted uppercase tracking-widest mb-3">Your Profile</h3>
          {renderBar({ label: 'You', tons: userTons, color: userTons <= bm.countryAvg ? 'bg-emerald-500' : 'bg-rose-500' }, 0)}
        </div>

        <div>
          <h3 className="text-[10px] font-semibold text-muted uppercase tracking-widest mb-3">Your Country</h3>
          {countryBars.map((bar, i) => renderBar(bar, i + 1))}
        </div>

        <div>
          <h3 className="text-[10px] font-semibold text-muted uppercase tracking-widest mb-3">Global Benchmarks</h3>
          {globalBars.map((bar, i) => renderBar(bar, i + 3))}
        </div>
      </div>

      <p className="text-xs text-muted border-t border-card pt-3">
        🎯 Paris Agreement target: 2.0t per capita by 2030 · IPCC data
      </p>
    </div>
  );
}

