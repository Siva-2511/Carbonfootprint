import React, { useState } from 'react';
import { rawAIFetch } from '../../services/aiLayer';

interface FashionResult {
  itemName: string;
  material: string;
  estimatedCarbon: string;
  impactLevel: 'High' | 'Medium' | 'Low';
  sustainableAlternatives: string[];
  tips: string;
}

export function FastFashionAnalyzer() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<FashionResult | null>(null);

  const analyzeItem = async () => {
    if (!query.trim()) return;
    setLoading(true);
    
    try {
      const contentStr = await rawAIFetch([{
        role: 'user',
        content: `I am considering buying or owning this clothing item: "${query}". 
Identify the likely dominant material, estimate its lifecycle carbon footprint (in kg CO2e), determine if the impact is High, Medium, or Low, and provide 2 sustainable alternatives and 1 eco-care tip.
Return ONLY valid JSON with exactly this structure, no markdown formatting or extra text:
{"itemName": "Standardized Name", "material": "Dominant Material", "estimatedCarbon": "e.g., 15 kg CO2e", "impactLevel": "High", "sustainableAlternatives": ["Alternative 1", "Alternative 2"], "tips": "Care tip"}`
      }], 0.7);
      
      if (contentStr) {
        let content = contentStr;
        content = content.replace(/```json/g, '').replace(/```/g, '').trim();
        setResult(JSON.parse(content));
      }
    } catch (e) {
      console.error('Fashion analysis failed', e);
    }
    setLoading(false);
  };

  return (
    <div className="glass-card p-6 animate-slide-up">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center text-2xl shadow-[0_0_15px_rgba(16,185,129,0.3)]">
          👕
        </div>
        <div>
          <h2 className="font-display font-bold text-xl text-primary">Fast Fashion Analyzer</h2>
          <p className="text-sm text-secondary">Check the impact of a clothing item before you buy</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex gap-3">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && analyzeItem()}
            placeholder="e.g., Polyester Winter Jacket, Cotton T-Shirt"
            className="flex-1 bg-dark-eval border border-white/10 rounded-xl px-4 py-3 text-primary focus:outline-none focus:border-emerald-500/50"
            disabled={loading}
          />
          <button
            onClick={analyzeItem}
            disabled={loading || !query.trim()}
            className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 rounded-xl font-medium transition-colors disabled:opacity-50"
          >
            {loading ? 'Analyzing...' : 'Analyze'}
          </button>
        </div>

        {result && (
          <div className="mt-6 p-5 rounded-xl bg-dark-eval border border-emerald-500/20 space-y-4 animate-fade-in">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-bold text-emerald-400">{result.itemName}</h3>
                <p className="text-sm text-secondary mt-1">Material: <span className="text-primary">{result.material}</span></p>
              </div>
              <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                result.impactLevel === 'High' ? 'bg-red-500/20 text-red-400' :
                result.impactLevel === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                'bg-emerald-500/20 text-emerald-400'
              }`}>
                {result.impactLevel} Impact
              </div>
            </div>

            <div className="p-4 bg-black/20 rounded-lg border border-white/5">
              <div className="text-sm text-secondary mb-1">Estimated Footprint</div>
              <div className="text-xl font-bold text-primary">{result.estimatedCarbon}</div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-emerald-400 mb-2">Sustainable Alternatives</h4>
              <ul className="list-disc list-inside text-sm text-secondary space-y-1">
                {result.sustainableAlternatives.map((alt, i) => (
                  <li key={i}>{alt}</li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-emerald-400 mb-1">Eco-Care Tip</h4>
              <p className="text-sm text-secondary">{result.tips}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
