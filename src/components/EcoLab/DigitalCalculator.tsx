import React, { useState } from 'react';

export function DigitalCalculator() {
  const [streamingHours, setStreamingHours] = useState(2);
  const [aiQueries, setAiQueries] = useState(10);
  const [cloudStorageGB, setCloudStorageGB] = useState(50);

  // Rough estimates:
  // Streaming: ~55g CO2e per hour (HD)
  // AI Query: ~4.3g CO2e per query
  // Cloud Storage: ~0.002g CO2e per GB per day -> ~0.06g per month -> ~0.72g per year (Negligible but good for awareness)
  const streamingCO2 = (streamingHours * 365) * 0.055;
  const aiCO2 = (aiQueries * 365) * 0.0043;
  const cloudCO2 = cloudStorageGB * 0.00072; // per year

  const totalCO2 = streamingCO2 + aiCO2 + cloudCO2;

  return (
    <div className="glass-card p-6 space-y-6">
      <h2 className="font-display font-bold text-xl text-primary flex items-center gap-2">
        💻 Digital Footprint Calculator
      </h2>
      <p className="text-secondary text-sm leading-relaxed">
        Our digital lives have physical impacts. Data centers and networks consume massive amounts of energy. Calculate the footprint of your digital habits.
      </p>

      <div className="space-y-4">
        <div>
          <label className="flex justify-between text-sm text-secondary mb-1">
            <span>Video Streaming (hours/day)</span>
            <span className="text-emerald-400">{streamingHours} h</span>
          </label>
          <input
            type="range" min="0" max="12" step="0.5"
            value={streamingHours} onChange={(e) => setStreamingHours(Number(e.target.value))}
            className="w-full"
          />
        </div>

        <div>
          <label className="flex justify-between text-sm text-secondary mb-1">
            <span>AI Queries (ChatGPT, etc.) / day</span>
            <span className="text-emerald-400">{aiQueries} queries</span>
          </label>
          <input
            type="range" min="0" max="100" step="1"
            value={aiQueries} onChange={(e) => setAiQueries(Number(e.target.value))}
            className="w-full"
          />
        </div>

        <div>
          <label className="flex justify-between text-sm text-secondary mb-1">
            <span>Cloud Storage (GB)</span>
            <span className="text-emerald-400">{cloudStorageGB} GB</span>
          </label>
          <input
            type="range" min="0" max="2000" step="50"
            value={cloudStorageGB} onChange={(e) => setCloudStorageGB(Number(e.target.value))}
            className="w-full"
          />
        </div>
      </div>

      <div className="mt-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-between">
        <div>
          <p className="text-sm text-secondary">Estimated Digital Footprint</p>
          <p className="text-3xl font-bold text-emerald-400">{totalCO2.toFixed(1)} <span className="text-lg font-medium text-emerald-400/70">kg CO₂e / year</span></p>
        </div>
        <div className="text-4xl">🌍</div>
      </div>
      
      <p className="text-xs text-muted text-right">
        *Estimates based on average global grid intensity.
      </p>
    </div>
  );
}
