import React, { useState } from 'react';
import { useStore } from '../../core/store';
import { getCurrencyInfo } from '../../config';
import { rawAIFetch } from '../../services/aiLayer';

interface PhantomResult {
  appliances: {
    name: string;
    wattage: number; // estimated standby wattage
    annualKwh: number;
  }[];
  totalAnnualKwh: number;
  totalAnnualCostUSD: number;
  carbonEmissionsKg: number;
  tips: string[];
}

export function PhantomPowerAnalyzer() {
  const storeInputs = useStore((s) => s.inputs);
  const settings = useStore((s) => s.settings);
  const country = storeInputs.country || 'India';
  const currencyInfo = getCurrencyInfo(country, settings.currencyOverride);

  const [inputStr, setInputStr] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PhantomResult | null>(null);

  const analyze = async () => {
    if (!inputStr.trim()) return;
    setLoading(true);

    try {
      const contentStr = await rawAIFetch([{
        role: 'user',
        content: `The user leaves these appliances plugged in 24/7: "${inputStr}".
Estimate the standby 'phantom' power wattage for each appliance, calculate their individual annual kWh usage (assuming 24/7 standby), and calculate total annual kWh, total annual cost in USD (assuming $0.15 per kWh), and estimated carbon emissions in kg (assuming 0.4 kg CO2e per kWh). Provide 2 actionable tips.
Return ONLY valid JSON with exactly this structure:
{
  "appliances": [{"name": "appliance name", "wattage": 5, "annualKwh": 43.8}],
  "totalAnnualKwh": 100,
  "totalAnnualCostUSD": 15.0,
  "carbonEmissionsKg": 40.0,
  "tips": ["Tip 1", "Tip 2"]
}`
      }], 0.7);

      if (contentStr) {
        let content = contentStr;
        content = content.replace(/```json/g, '').replace(/```/g, '').trim();
        setResult(JSON.parse(content));
      }
    } catch (e) {
      console.error('Phantom power analysis failed', e);
    }
    setLoading(false);
  };

  const usdToLocal = currencyInfo.multiplier / 0.012;

  return (
    <div className="glass-card p-6 animate-slide-up">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center text-2xl shadow-[0_0_15px_rgba(16,185,129,0.3)]">
            🔌
          </div>
          <div>
            <h2 className="font-display font-bold text-xl text-primary">Phantom Power Analyzer</h2>
            <p className="text-sm text-secondary">Find out how much "vampire energy" your plugged-in devices drain 24/7.</p>
          </div>
        </div>

        {/* Inline Currency Override */}
        <select
          value={settings.currencyOverride || ''}
          onChange={(e) => useStore.getState().setCurrencyOverride(e.target.value || null)}
          className="bg-[var(--bg-card)] border border-[var(--border-card)] rounded-lg p-2 text-xs text-secondary focus:outline-none focus:border-emerald-500/50"
          aria-label="Select Currency"
        >
          <option value="">(Match Country)</option>
          {Object.entries(getCurrencyInfo('', null)).map(() => null)}{/* Hack, but handled by the global store anyway if we just pass a string array */}
          <option value="USD">USD ($)</option>
          <option value="INR">INR (₹)</option>
          <option value="EUR">EUR (€)</option>
          <option value="GBP">GBP (£)</option>
          <option value="JPY">JPY (¥)</option>
          <option value="AUD">AUD ($)</option>
          <option value="CAD">CAD ($)</option>
        </select>
      </div>

      <div className="space-y-4">
        <div className="flex gap-3 flex-col sm:flex-row">
          <input
            type="text"
            value={inputStr}
            onChange={(e) => setInputStr(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && analyze()}
            placeholder="e.g., PS5, Microwave, Old AC, Laptop charger"
            className="flex-1 bg-[var(--bg-card)] border border-[var(--border-card)] rounded-xl px-4 py-3 text-primary focus:outline-none focus:border-emerald-500/50"
            disabled={loading}
          />
          <button
            onClick={analyze}
            disabled={loading || !inputStr.trim()}
            className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 sm:py-0 rounded-xl font-medium transition-colors disabled:opacity-50 whitespace-nowrap"
          >
            {loading ? 'Analyzing...' : 'Analyze Power'}
          </button>
        </div>

        {result && (
          <div className="mt-6 animate-fade-in space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-[var(--bg-card)] border border-[var(--border-card)] rounded-xl">
                <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-1">Energy Wasted</p>
                <p className="text-2xl font-bold text-emerald-400">{Math.round(result.totalAnnualKwh)} <span className="text-sm">kWh/year</span></p>
              </div>
              <div className="p-4 bg-[var(--bg-card)] border border-[var(--border-card)] rounded-xl">
                <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-1">Money Wasted</p>
                <p className="text-2xl font-bold text-red-400">
                  {currencyInfo.symbol}{(result.totalAnnualCostUSD * usdToLocal).toLocaleString('en-US', { maximumFractionDigits: 0 })}
                  <span className="text-sm text-secondary ml-1">{currencyInfo.currency}/year</span>
                </p>
              </div>
              <div className="p-4 bg-[var(--bg-card)] border border-[var(--border-card)] rounded-xl">
                <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-1">Carbon Emissions</p>
                <p className="text-2xl font-bold text-primary">{Math.round(result.carbonEmissionsKg)} <span className="text-sm">kg CO₂e</span></p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-secondary">
                <thead className="text-xs text-muted uppercase bg-black/20">
                  <tr>
                    <th className="px-4 py-3 rounded-l-lg">Appliance</th>
                    <th className="px-4 py-3">Est. Standby Wattage</th>
                    <th className="px-4 py-3 rounded-r-lg">Annual Drain (kWh)</th>
                  </tr>
                </thead>
                <tbody>
                  {result.appliances.map((app, idx) => (
                    <tr key={idx} className="border-b border-white/5 last:border-0">
                      <td className="px-4 py-3 font-medium text-primary">{app.name}</td>
                      <td className="px-4 py-3 text-red-400">{app.wattage} W</td>
                      <td className="px-4 py-3">{app.annualKwh} kWh</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
              <h4 className="font-bold text-emerald-400 mb-2 flex items-center gap-2">
                <span>💡</span> Actionable Tips
              </h4>
              <ul className="list-disc list-inside text-sm text-secondary space-y-1">
                {result.tips.map((tip, idx) => (
                  <li key={idx}>{tip}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
