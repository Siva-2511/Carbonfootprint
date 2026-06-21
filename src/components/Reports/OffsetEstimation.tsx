import React from 'react';
import { Card } from '../ui/Card';
import { useStore } from '../../core/store';
import { getCurrencyInfo } from '../../config';

export function OffsetEstimation() {
  const result = useStore((s) => s.result);
  const storeInputs = useStore((s) => s.inputs);

  if (!result || result.totalAnnualKg === 0) {
    return (
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xl" aria-hidden="true">🌳</span>
          <h2 className="text-xl font-bold font-display text-primary">Carbon Offsetting</h2>
        </div>
        <p className="text-sm text-secondary mb-4">
          Calculate your footprint to see how many trees are needed to offset your emissions.
        </p>
      </Card>
    );
  }

  const country = storeInputs.country || 'Global Average';
  const settings = useStore((s) => s.settings);
  const currencyInfo = getCurrencyInfo(country, settings.currencyOverride);

  // 1 mature tree absorbs ~22kg of CO2 per year
  const treesNeeded = Math.ceil(result.totalAnnualKg / 22);
  
  // Average cost of certified carbon offsets (Gold Standard, Verra) is ~$15 per metric ton
  const baseCostPerTonUSD = 15;
  const usdToLocal = currencyInfo.multiplier / 0.012;
  const costPerTon = baseCostPerTonUSD * usdToLocal;
  const annualCost = (result.totalAnnualTons * costPerTon).toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  });

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xl" aria-hidden="true">🌳</span>
        <h2 className="text-xl font-bold font-display text-primary">Carbon Offsetting</h2>
      </div>
      
      <p className="text-sm text-secondary mb-6">
        Offsetting means compensating for your unavoidable emissions by funding projects that remove CO₂ from the atmosphere.
      </p>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="var-bg-card border border-card rounded-xl p-4 text-center">
          <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-2">Trees Needed</p>
          <p className="text-3xl font-bold text-emerald-400 font-display">{treesNeeded}</p>
          <p className="text-xs text-secondary mt-1">mature trees/year</p>
        </div>
        
        <div className="var-bg-card border border-card rounded-xl p-4 text-center">
          <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-2">Estimated Cost</p>
          <p className="text-3xl font-bold text-primary font-display">{currencyInfo.symbol}{annualCost}</p>
          <p className="text-xs text-secondary mt-1">annually via certified programs</p>
        </div>
      </div>

      <div className="bg-rose-500/10 border border-rose-500/20 rounded-lg p-3 flex gap-3 items-start">
        <span className="text-rose-400 text-lg">⚠️</span>
        <p className="text-xs text-rose-200">
          <strong>Important:</strong> Offsets are a last resort. Your primary focus should always be on <em>reducing</em> your direct emissions first before paying to offset the remainder.
        </p>
      </div>
    </Card>
  );
}
