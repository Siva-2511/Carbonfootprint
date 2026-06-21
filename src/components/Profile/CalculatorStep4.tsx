import React, { useId } from 'react';
import { Slider } from '../ui/Slider';
import { Card } from '../ui/Card';
import type { CalculatorInputs } from '../../types';
import { CURRENCY_MAP } from '../../config';

// ─────────────────────────────────────────────────────────────
//  FILE 6: src/components/Profile/CalculatorStep4.tsx
// ─────────────────────────────────────────────────────────────

interface CalculatorStep4Props {
  inputs: CalculatorInputs;
  onUpdate: (partial: Partial<CalculatorInputs>) => void;
}

export function CalculatorStep4({ inputs, onUpdate }: CalculatorStep4Props) {
  const recyclingId = useId();
  
  const currencyInfo = inputs.country && CURRENCY_MAP[inputs.country] ? CURRENCY_MAP[inputs.country] : CURRENCY_MAP['Global Average'];

  const formatCurrency = (v: number) => {
    const locale = currencyInfo.currency === 'INR' ? 'en-IN' : 'en-US';
    return `${currencyInfo.symbol}${v.toLocaleString(locale)}`;
  };

  const formatK = (v: number) => {
    if (v >= 1000) return `${currencyInfo.symbol}${v / 1000}K`;
    return `${currencyInfo.symbol}${v}`;
  };

  return (
    <Card className="p-6 space-y-8">
      {/* Section heading */}
      <div>
        <h2
          className="text-xl font-bold text-primary font-display flex items-center gap-2"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          <span aria-hidden="true">🛍️</span> Consumption &amp; Lifestyle
        </h2>
        <p className="text-sm text-secondary mt-1">
          Shopping habits and waste management complete your carbon profile.
        </p>
      </div>

      {/* Monthly shopping spend */}
      <Slider
        label="Monthly Shopping Spend"
        value={inputs.monthlySpend}
        onChange={(v) => onUpdate({ monthlySpend: v })}
        min={0}
        max={currencyInfo.max}
        step={Math.max(1, currencyInfo.max / 100)}
        formatValue={formatCurrency}
        helperText="Include clothing, electronics, household goods — not groceries"
        color="emerald"
      />

      {/* Shopping impact guide */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { range: `${formatK(0)} – ${formatK(currencyInfo.tier1)}`, label: 'Minimal', color: 'text-emerald-400', bg: 'bg-emerald-500/8 border-emerald-500/20' },
          { range: `${formatK(currencyInfo.tier1)} – ${formatK(currencyInfo.tier2)}`, label: 'Moderate', color: 'text-amber-400', bg: 'bg-amber-500/8 border-amber-500/20' },
          { range: `${formatK(currencyInfo.tier2)}+`, label: 'High impact', color: 'text-rose-400', bg: 'bg-rose-500/8 border-rose-500/20' },
        ].map((tier) => (
          <div key={tier.range} className={`flex flex-col gap-1 p-3 rounded-xl border ${tier.bg}`}>
            <span className={`text-xs font-bold font-mono tabular-nums ${tier.color}`}>{tier.range}</span>
            <span className="text-xs text-muted">{tier.label}</span>
          </div>
        ))}
      </div>

      {/* Recycling toggle */}
      <div className="space-y-3">
        <p className="text-sm font-medium text-secondary">Waste Management</p>

        <div
          className={`
            flex items-center justify-between p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer
            ${
              inputs.recycling
                ? 'border-emerald-500/60 bg-emerald-500/10'
                : 'border-card var-bg-card hover:border-strong '
            }
          `}
          onClick={() => onUpdate({ recycling: !inputs.recycling })}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onUpdate({ recycling: !inputs.recycling });
            }
          }}
          role="switch"
          aria-checked={inputs.recycling}
          aria-labelledby={recyclingId}
          tabIndex={0}
        >
          <label
            id={recyclingId}
            className={`flex items-center gap-3 cursor-pointer select-none`}
            onClick={(e) => e.stopPropagation()}
          >
            <span className="text-xl" aria-hidden="true">♻️</span>
            <div>
              <p className={`text-sm font-semibold font-display ${inputs.recycling ? 'text-emerald-300' : 'text-primary'}`}
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                I actively recycle and compost
              </p>
              <p className="text-xs text-muted mt-0.5">
                Separating waste, composting food scraps, buying second-hand
              </p>
            </div>
          </label>

          {/* Pill switch */}
          <div
            className={`
              relative flex-shrink-0 w-12 h-6 rounded-full border transition-all duration-300
              ${inputs.recycling
                ? 'bg-emerald-500 border-emerald-400'
                : 'bg-white/10 border-strong'
              }
            `}
            aria-hidden="true"
          >
            <span
              className={`
                absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md
                transition-all duration-300
                ${inputs.recycling ? 'left-6' : 'left-0.5'}
              `}
            />
          </div>
        </div>

        {/* Recycling impact info */}
        {inputs.recycling && (
          <div className="flex items-start gap-2 px-4 py-3 rounded-xl bg-emerald-500/5 border border-emerald-500/15 animate-in fade-in slide-in-from-top-1 duration-300">
            <span className="text-sm" aria-hidden="true">✅</span>
            <p className="text-xs text-emerald-400 leading-relaxed">
              Great! Active recycling & composting can reduce your consumption
              emissions by approximately{' '}
              <span className="font-semibold">10–15%</span>.
            </p>
          </div>
        )}
      </div>

      {/* Final summary note */}
      <div className="flex items-start gap-3 p-4 rounded-xl var-bg-card border border-white/8">
        <span className="text-lg" aria-hidden="true">🎯</span>
        <p className="text-xs text-secondary leading-relaxed">
          You're almost there! Click <span className="text-emerald-400 font-medium">Calculate My Footprint</span> to get
          your personalised carbon DNA analysis and actionable recommendations.
        </p>
      </div>
    </Card>
  );
}


