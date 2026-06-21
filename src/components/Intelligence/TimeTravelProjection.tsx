import React, { useState } from 'react';
import { useStore } from '../../core/store';
import { rawAIFetch } from '../../services/aiLayer';

interface ProjectionResult {
  city: string;
  year: number;
  scenarioA: {
    title: string;
    description: string;
    temperatureChange: string;
    seaLevelChange: string;
    localImpact: string;
  };
  scenarioB: {
    title: string;
    description: string;
    temperatureChange: string;
    seaLevelChange: string;
    localImpact: string;
  };
}

export function TimeTravelProjection() {
  const resultData = useStore((s) => s.result);
  const storeInputs = useStore((s) => s.inputs);
  const defaultCountry = storeInputs.country || 'India';

  const [city, setCity] = useState(defaultCountry);
  const [loading, setLoading] = useState(false);
  const [projection, setProjection] = useState<ProjectionResult | null>(null);

  const analyze = async () => {
    if (!city.trim() || !resultData) return;
    setLoading(true);

    const footprint = resultData.totalAnnualKg / 1000; // in tons

    try {
      const contentStr = await rawAIFetch([{
        role: 'user',
        content: `The user's current carbon footprint is ${footprint.toFixed(1)} tons CO2e per year.
They want a time-travel projection for the year 2050 for their specific location: "${city}".
Generate two scenarios for this specific city/region.
Scenario A (Utopian / Net Zero Path): Assume everyone on Earth lived with a footprint < 2.0 tons.
Scenario B (Dystopian / Business as Usual): Assume everyone on Earth lived with the user's footprint of ${footprint.toFixed(1)} tons (or a global average of 14 tons if the user's is too low to cause dystopia on its own).
Return ONLY valid JSON with exactly this structure:
{
  "city": "Name of city/region",
  "year": 2050,
  "scenarioA": {
    "title": "Scenario A Title",
    "description": "2 sentence visceral description of the city",
    "temperatureChange": "+1.5°C",
    "seaLevelChange": "+0.1m",
    "localImpact": "Specific local landmark impact (e.g. Marine Drive is safe)"
  },
  "scenarioB": {
    "title": "Scenario B Title",
    "description": "2 sentence visceral description of the city",
    "temperatureChange": "+2.5°C",
    "seaLevelChange": "+0.5m",
    "localImpact": "Specific local landmark impact (e.g. Marine Drive floods weekly)"
  }
}`
      }], 0.7);

      if (contentStr) {
        let content = contentStr;
        content = content.replace(/```json/g, '').replace(/```/g, '').trim();
        setProjection(JSON.parse(content));
      }
    } catch (e) {
      console.error('Time travel projection failed', e);
    }
    setLoading(false);
  };

  if (!resultData) {
    return null;
  }

  return (
    <div className="glass-card p-6 animate-slide-up">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 rounded-full bg-indigo-500/20 flex items-center justify-center text-2xl shadow-[0_0_15px_rgba(99,102,241,0.3)]">
          🔮
        </div>
        <div>
          <h2 className="font-display font-bold text-xl text-primary">Time-Travel Climate Projection</h2>
          <p className="text-sm text-secondary">See what your city will look like in 2050 based on your Carbon DNA.</p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex gap-3 flex-col sm:flex-row">
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && analyze()}
            placeholder="Enter your City (e.g., Mumbai, New York, London)"
            className="flex-1 bg-dark-eval border border-white/10 rounded-xl px-4 py-3 text-primary focus:outline-none focus:border-indigo-500/50"
            disabled={loading}
          />
          <button
            onClick={analyze}
            disabled={loading || !city.trim()}
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 sm:py-0 rounded-xl font-medium transition-colors disabled:opacity-50 whitespace-nowrap shadow-[0_0_15px_rgba(99,102,241,0.4)]"
          >
            {loading ? 'Traveling to 2050...' : 'Project 2050'}
          </button>
        </div>

        {projection && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
            {/* Scenario A: Utopian */}
            <div className="bg-gradient-to-br from-emerald-900/40 to-dark-eval border border-emerald-500/30 rounded-xl p-5 space-y-4">
              <div className="flex items-center gap-3 border-b border-emerald-500/20 pb-3">
                <span className="text-2xl">🌱</span>
                <div>
                  <h3 className="font-bold text-emerald-400">{projection.scenarioA.title}</h3>
                  <p className="text-xs text-emerald-500/70 uppercase tracking-widest font-semibold">Net Zero Path</p>
                </div>
              </div>
              <p className="text-sm text-secondary leading-relaxed min-h-[60px]">
                {projection.scenarioA.description}
              </p>
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="bg-black/20 rounded-lg p-2 text-center border border-emerald-500/10">
                  <span className="block text-xs text-muted mb-1">Global Temp</span>
                  <span className="font-bold text-emerald-400">{projection.scenarioA.temperatureChange}</span>
                </div>
                <div className="bg-black/20 rounded-lg p-2 text-center border border-emerald-500/10">
                  <span className="block text-xs text-muted mb-1">Sea Level</span>
                  <span className="font-bold text-blue-400">{projection.scenarioA.seaLevelChange}</span>
                </div>
              </div>
              <div className="bg-emerald-500/10 rounded-lg p-3 border border-emerald-500/20">
                <span className="text-xs font-bold text-emerald-400 block mb-1">📍 Local Impact: {projection.city}</span>
                <span className="text-sm text-primary">{projection.scenarioA.localImpact}</span>
              </div>
            </div>

            {/* Scenario B: Dystopian */}
            <div className="bg-gradient-to-br from-red-900/40 to-dark-eval border border-red-500/30 rounded-xl p-5 space-y-4">
              <div className="flex items-center gap-3 border-b border-red-500/20 pb-3">
                <span className="text-2xl">🔥</span>
                <div>
                  <h3 className="font-bold text-red-400">{projection.scenarioB.title}</h3>
                  <p className="text-xs text-red-500/70 uppercase tracking-widest font-semibold">Business As Usual</p>
                </div>
              </div>
              <p className="text-sm text-secondary leading-relaxed min-h-[60px]">
                {projection.scenarioB.description}
              </p>
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="bg-black/20 rounded-lg p-2 text-center border border-red-500/10">
                  <span className="block text-xs text-muted mb-1">Global Temp</span>
                  <span className="font-bold text-red-400">{projection.scenarioB.temperatureChange}</span>
                </div>
                <div className="bg-black/20 rounded-lg p-2 text-center border border-red-500/10">
                  <span className="block text-xs text-muted mb-1">Sea Level</span>
                  <span className="font-bold text-blue-400">{projection.scenarioB.seaLevelChange}</span>
                </div>
              </div>
              <div className="bg-red-500/10 rounded-lg p-3 border border-red-500/20">
                <span className="text-xs font-bold text-red-400 block mb-1">📍 Local Impact: {projection.city}</span>
                <span className="text-sm text-primary">{projection.scenarioB.localImpact}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
