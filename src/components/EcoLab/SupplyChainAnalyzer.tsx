/**
 * @fileoverview SupplyChainAnalyzer component for the EcoLab section.
 * Uses AI to calculate the transport distance (food miles) and estimated
 * CO₂e emissions for an imported product given its origin country and the
 * user's current country. Also suggests a greener local alternative and
 * explains why the supply chain impact matters.
 */

import React, { useState } from 'react';
import { useStore } from '../../core/store';
import { rawAIFetch } from '../../services/aiLayer';

/**
 * AI-generated supply chain analysis result for an imported product.
 */
interface SupplyChainResult {
  productName: string;
  foodMiles: number;
  transportMode: string; // Air, Sea, Truck, etc.
  estimatedCarbonKg: number;
  localAlternative: string;
  explanation: string;
}

/**
 * SupplyChainAnalyzer renders a two-field input form (product name and origin
 * country). On submit, it queries the AI service to estimate food miles,
 * transport mode, CO₂e emissions, a local alternative, and an explanation.
 * Results are shown in a structured result card with metric tiles and text
 * sections for the local alternative and supply chain explanation.
 *
 * @returns The rendered supply chain analyzer card.
 */
export function SupplyChainAnalyzer() {
  const storeInputs = useStore((s) => s.inputs);
  const country = storeInputs.country || 'India';

  const [product, setProduct] = useState('');
  const [origin, setOrigin] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SupplyChainResult | null>(null);

  const analyze = async () => {
    if (!product.trim() || !origin.trim()) return;
    setLoading(true);

    try {
      const contentStr = await rawAIFetch([{
        role: 'user',
        content: `The user lives in "${country}". They are buying "${product}" imported from "${origin}".
Calculate the approximate "Food Miles" (or transport distance) in km. Estimate the likely transport mode (e.g. Air freight, Sea freight, Truck) and the transport carbon footprint in kg CO2e. Suggest a local/seasonal alternative. Explain why it matters.
Return ONLY valid JSON with exactly this structure:
{
  "productName": "Standardized Name",
  "foodMiles": 8500,
  "transportMode": "Air Freight",
  "estimatedCarbonKg": 12.5,
  "localAlternative": "Local alternative",
  "explanation": "Brief explanation of the supply chain impact"
}`
      }], 0.7);

      if (contentStr) {
        let content = contentStr;
        content = content.replace(/```json/g, '').replace(/```/g, '').trim();
        setResult(JSON.parse(content));
      } else {
        alert("The AI is currently experiencing high traffic. Please wait a few seconds and try again.");
      }
    } catch (e) {
      console.error('Supply chain analysis failed', e);
      alert("The AI is currently experiencing high traffic. Please wait a few seconds and try again.");
    }
    setLoading(false);
  };

  return (
    <div className="glass-card p-6 animate-slide-up">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center text-2xl shadow-[0_0_15px_rgba(16,185,129,0.3)]">
          🌍
        </div>
        <div>
          <h2 className="font-display font-bold text-xl text-primary">Supply Chain Analyzer</h2>
          <p className="text-sm text-secondary">Calculate the transport emissions (Food Miles) of imported goods to your country ({country}).</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex gap-3 flex-col sm:flex-row">
          <input
            type="text"
            value={product}
            onChange={(e) => setProduct(e.target.value)}
            placeholder="Product (e.g., Avocados, iPhone)"
            className="flex-1 bg-[var(--bg-card)] border border-[var(--border-card)] rounded-xl px-4 py-3 text-primary focus:outline-none focus:border-emerald-500/50"
            disabled={loading}
          />
          <input
            type="text"
            value={origin}
            onChange={(e) => setOrigin(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && analyze()}
            placeholder="Origin (e.g., Mexico, China)"
            className="flex-1 bg-[var(--bg-card)] border border-[var(--border-card)] rounded-xl px-4 py-3 text-primary focus:outline-none focus:border-emerald-500/50"
            disabled={loading}
          />
          <button
            onClick={analyze}
            disabled={loading || !product.trim() || !origin.trim()}
            className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 sm:py-0 rounded-xl font-medium transition-colors disabled:opacity-50 whitespace-nowrap"
          >
            {loading ? 'Analyzing...' : 'Analyze Miles'}
          </button>
        </div>

        {result && (
          <div className="mt-6 p-5 rounded-xl bg-dark-eval border border-emerald-500/20 space-y-5 animate-fade-in">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-bold text-emerald-400">{result.productName}</h3>
                <p className="text-sm text-secondary mt-1">Imported from <span className="text-primary font-medium">{origin}</span> to <span className="text-primary font-medium">{country}</span></p>
              </div>
              <div className="px-3 py-1 rounded-full text-xs font-bold bg-blue-500/20 text-blue-400">
                {result.transportMode}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-black/20 rounded-lg border border-white/5">
                <div className="text-sm text-secondary mb-1">Distance (Food Miles)</div>
                <div className="text-2xl font-bold text-primary">{result.foodMiles.toLocaleString()} <span className="text-sm text-secondary">km</span></div>
              </div>
              <div className="p-4 bg-black/20 rounded-lg border border-white/5">
                <div className="text-sm text-secondary mb-1">Transport Emissions</div>
                <div className="text-2xl font-bold text-red-400">{result.estimatedCarbonKg} <span className="text-sm text-secondary">kg CO₂e</span></div>
              </div>
            </div>

            <div className="border-t border-white/10 pt-4">
              <h4 className="text-sm font-semibold text-emerald-400 mb-1 flex items-center gap-2">
                <span>🔄</span> Greener Local Alternative
              </h4>
              <p className="text-sm text-primary mb-3">{result.localAlternative}</p>
              
              <h4 className="text-sm font-semibold text-emerald-400 mb-1 flex items-center gap-2">
                <span>📖</span> Why it matters
              </h4>
              <p className="text-sm text-secondary leading-relaxed">{result.explanation}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
