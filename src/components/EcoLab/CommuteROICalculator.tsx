import React, { useState } from 'react';
import { EMISSION_FACTORS, getCurrencyInfo } from '../../config';
import { useStore } from '../../core/store';

const MODES = [
  { id: 'petrol', name: 'Petrol Car', icon: '🚗', costPerKm: 0.15 },
  { id: 'ev', name: 'Electric Vehicle', icon: '⚡', costPerKm: 0.05 },
  { id: 'bus', name: 'Bus / Public Transit', icon: '🚌', costPerKm: 0.08 },
  { id: 'metro', name: 'Metro / Train', icon: '🚇', costPerKm: 0.06 },
  { id: 'twoWheeler', name: 'Two-Wheeler', icon: '🛵', costPerKm: 0.07 },
] as const;

export function CommuteROICalculator() {
  const storeInputs = useStore((s) => s.inputs);
  const country = storeInputs.country || 'Global Average';
  const settings = useStore(s => s.settings);

  // Derive display currency
  const currencyInfo = getCurrencyInfo(country, settings.currencyOverride);

  const [distance, setDistance] = useState(15);
  const [daysPerWeek, setDaysPerWeek] = useState(5);
  const [currentMode, setCurrentMode] = useState<typeof MODES[number]['id']>('petrol');
  const [targetMode, setTargetMode] = useState<typeof MODES[number]['id']>('ev');

  const current = MODES.find((m) => m.id === currentMode)!;
  const target = MODES.find((m) => m.id === targetMode)!;

  const annualKm = distance * 2 * daysPerWeek * 48; // Roundtrip, weeks per year accounting for holidays

  const currentCarbon = EMISSION_FACTORS.transport[current.id] * annualKm;
  const targetCarbon = EMISSION_FACTORS.transport[target.id] * annualKm;
  const carbonSavings = currentCarbon - targetCarbon;

  const usdToLocal = currencyInfo.multiplier / 0.012; // Base config multiplier uses INR as 1, USD as 0.012
  const currentCost = current.costPerKm * annualKm * usdToLocal;
  const targetCost = target.costPerKm * annualKm * usdToLocal;
  const costSavings = currentCost - targetCost;

  return (
    <div className="glass-card p-6 space-y-6">
      <h2 className="font-display font-bold text-xl text-primary flex items-center gap-2">
        🛣️ Commute ROI Calculator
      </h2>
      <p className="text-secondary text-sm leading-relaxed">
        Compare the annual carbon and monetary impact of different commuting modes.
        <span className="block mt-1 text-xs text-muted">* Monetary savings use global average estimates and may vary by region.</span>
      </p>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-secondary mb-1">One-way Distance (km)</label>
          <input
            type="number"
            value={distance}
            onChange={(e) => setDistance(Math.max(1, Number(e.target.value)))}
            className="w-full bg-[var(--bg-card)] border border-[var(--border-strong)] rounded-lg p-2 text-primary"
            min="1"
          />
        </div>
        <div>
          <label className="block text-sm text-secondary mb-1">Days per week</label>
          <input
            type="number"
            value={daysPerWeek}
            onChange={(e) => setDaysPerWeek(Math.max(1, Math.min(7, Number(e.target.value))))}
            className="w-full bg-[var(--bg-card)] border border-[var(--border-strong)] rounded-lg p-2 text-primary"
            min="1"
            max="7"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-secondary mb-1">Current Mode</label>
          <select
            value={currentMode}
            onChange={(e) => setCurrentMode(e.target.value as any)}
            className="w-full bg-[var(--bg-card)] border border-[var(--border-strong)] rounded-lg p-2 text-primary"
          >
            {MODES.map((m) => (
              <option key={`current-${m.id}`} value={m.id}>
                {m.icon} {m.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm text-secondary mb-1">Target Mode</label>
          <select
            value={targetMode}
            onChange={(e) => setTargetMode(e.target.value as any)}
            className="w-full bg-[var(--bg-card)] border border-[var(--border-strong)] rounded-lg p-2 text-primary"
          >
            {MODES.map((m) => (
              <option key={`target-${m.id}`} value={m.id}>
                {m.icon} {m.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 pt-2">
        <div className={`p-4 rounded-xl border ${carbonSavings > 0 ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-[var(--bg-card)] border-[var(--border-strong)]'}`}>
          <p className="text-xs text-muted font-medium mb-1">Annual CO₂ Savings</p>
          <div className="flex items-baseline gap-1">
            <span className={`text-2xl font-bold ${carbonSavings > 0 ? 'text-emerald-400' : 'text-primary'}`}>
              {carbonSavings > 0 ? '+' : ''}{Math.round(carbonSavings)}
            </span>
            <span className="text-xs text-secondary">kg</span>
          </div>
        </div>

        <div className={`p-4 rounded-xl border ${costSavings > 0 ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-[var(--bg-card)] border-[var(--border-strong)]'}`}>
          <p className="text-xs text-muted font-medium mb-1">Annual Cost Savings</p>
          <div className="flex items-baseline gap-1">
            <span className={`text-2xl font-bold ${costSavings > 0 ? 'text-emerald-400' : 'text-primary'}`}>
              {costSavings > 0 ? '+' : ''}{currencyInfo.symbol}{Math.round(costSavings).toLocaleString('en-US')}
            </span>
            <span className="text-xs text-secondary">{currencyInfo.currency}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
