/**
 * @fileoverview TravelRouter component for the Lifestyle section.
 * Accepts an origin and destination city and uses the AI service to generate
 * a low-carbon travel itinerary that prioritises trains, buses, and carpooling
 * over flights. Displays total distance, recommended transport mode, estimated
 * CO₂e emissions, a step-by-step itinerary, and an eco travel tip.
 */

import React, { useState } from 'react';
import { rawAIFetch } from '../../services/aiLayer';

/**
 * AI-generated low-carbon travel plan between two cities.
 */
interface TravelPlan {
  destination: string;
  totalDistance: string;
  recommendedMode: string;
  estimatedEmissions: string;
  itinerary: {
    step: string;
    description: string;
    mode: string;
  }[];
  ecoTip: string;
}

/**
 * TravelRouter renders origin and destination city inputs and a route-finding
 * button. On submit it queries the AI service for the greenest route and
 * displays the result as a route summary (distance, recommended mode,
 * estimated emissions), an eco tip banner, and a visual step-by-step
 * itinerary timeline.
 *
 * @returns The rendered eco-travel router card.
 */
export function TravelRouter() {
  const [startCity, setStartCity] = useState('');
  const [endCity, setEndCity] = useState('');
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<TravelPlan | null>(null);

  const generatePlan = async () => {
    if (!startCity.trim() || !endCity.trim()) return;
    setLoading(true);
    
    try {
      const contentStr = await rawAIFetch([{
        role: 'user',
        content: `Generate a low-carbon travel itinerary from ${startCity} to ${endCity}. Prioritize trains, buses, or carpooling over flights where feasible. 
Return ONLY valid JSON with exactly this structure, no markdown formatting or extra text:
{"destination": "City Name", "totalDistance": "e.g., 500 km", "recommendedMode": "e.g., High-speed Rail", "estimatedEmissions": "e.g., 15 kg CO2e", "itinerary": [{"step": "1", "description": "Take bus to central station", "mode": "Bus"}, {"step": "2", "description": "Take train to destination", "mode": "Train"}], "ecoTip": "Why this route is greener"}`
      }], 0.7);
      
      if (contentStr) {
        let content = contentStr;
        content = content.replace(/```json/g, '').replace(/```/g, '').trim();
        setPlan(JSON.parse(content));
      }
    } catch (e) {
      console.error('Travel plan generation failed', e);
    }
    setLoading(false);
  };

  return (
    <div className="glass-card p-6 animate-slide-up" style={{ animationDelay: '0.1s', animationFillMode: 'both' }}>
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center text-2xl shadow-[0_0_15px_rgba(59,130,246,0.3)]">
          ✈️
        </div>
        <div>
          <h2 className="font-display font-bold text-xl text-primary">Eco-Travel Router</h2>
          <p className="text-sm text-secondary">Plan the greenest route to your destination</p>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <div className="flex-1">
          <label className="block text-xs font-bold text-secondary uppercase tracking-wider mb-2">Starting Location</label>
          <input
            type="text"
            value={startCity}
            onChange={(e) => setStartCity(e.target.value)}
            placeholder="e.g., Paris"
            className="w-full bg-black/5 dark:bg-white/5 border border-card rounded-xl p-3 text-primary focus:border-blue-500 transition-colors"
          />
        </div>
        <div className="flex-1">
          <label className="block text-xs font-bold text-secondary uppercase tracking-wider mb-2">Destination</label>
          <input
            type="text"
            value={endCity}
            onChange={(e) => setEndCity(e.target.value)}
            placeholder="e.g., Berlin"
            className="w-full bg-black/5 dark:bg-white/5 border border-card rounded-xl p-3 text-primary focus:border-blue-500 transition-colors"
          />
        </div>
      </div>
      
      <button 
        onClick={generatePlan}
        disabled={loading || !startCity.trim() || !endCity.trim()}
        className="w-full bg-gradient-to-r from-blue-600 to-indigo-500 hover:from-blue-500 hover:to-indigo-400 text-white py-3 rounded-xl transition-all font-bold shadow-[0_4px_15px_rgba(59,130,246,0.3)] hover:shadow-[0_6px_20px_rgba(59,130,246,0.4)] disabled:opacity-50"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            Mapping route...
          </span>
        ) : 'Find Greenest Route'}
      </button>

      {plan && !loading && (
        <div className="mt-8 space-y-6 animate-fade-in border-t border-card pt-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h3 className="font-display font-bold text-2xl text-blue-400">
                {startCity} ➔ {plan.destination}
              </h3>
              <p className="text-secondary mt-1 flex items-center gap-2">
                <span>📏 {plan.totalDistance}</span>
                <span className="opacity-30">•</span>
                <span>🏆 {plan.recommendedMode}</span>
              </p>
            </div>
            <div className="px-4 py-2 bg-blue-500/20 border border-blue-500/30 rounded-xl text-center">
              <div className="text-xs text-blue-300 font-bold uppercase">Est. Emissions</div>
              <div className="text-xl font-bold text-blue-400 font-display">{plan.estimatedEmissions}</div>
            </div>
          </div>
          
          <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-xl text-sm text-emerald-300">
            <span className="font-bold text-emerald-400">🌍 Eco Tip: </span>
            {plan.ecoTip}
          </div>

          <div className="glass-card p-5 bg-white/5 relative overflow-hidden">
            <div className="absolute left-8 top-10 bottom-10 w-0.5 bg-blue-500/20 hidden md:block"></div>
            <h4 className="font-bold text-primary mb-4 flex items-center gap-2">
              <span>🗺️</span> Suggested Itinerary
            </h4>
            <div className="space-y-6">
              {plan.itinerary.map((leg, i) => (
                <div key={i} className="flex gap-4 relative">
                  <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-bold flex-shrink-0 z-10 shadow-[0_0_10px_rgba(59,130,246,0.5)]">
                    {i + 1}
                  </div>
                  <div className="pt-1">
                    <div className="font-bold text-blue-300 text-sm mb-1 uppercase tracking-wide">
                      {leg.mode}
                    </div>
                    <div className="text-secondary text-sm">
                      {leg.description}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
