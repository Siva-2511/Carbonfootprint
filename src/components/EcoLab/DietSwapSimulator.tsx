/**
 * @fileoverview DietSwapSimulator component for the EcoLab section.
 * Lets users select a current and target diet tier (e.g., heavy meat → vegan)
 * and instantly see the resulting annual carbon footprint difference in kg CO₂e,
 * along with a trees-planted equivalency for positive savings.
 */

import React, { useState } from 'react';
import { EMISSION_FACTORS } from '../../config';

const DIETS = [
  { id: 'heavy-meat', name: 'Heavy Meat', icon: '🥩' },
  { id: 'low-meat', name: 'Low Meat', icon: '🍗' },
  { id: 'vegetarian', name: 'Vegetarian', icon: '🥚' },
  { id: 'vegan', name: 'Vegan', icon: '🥗' },
] as const;

/**
 * DietSwapSimulator renders a side-by-side diet selector that computes
 * the annual CO₂e difference between a user's current and target diet tier.
 * Positive savings are expressed in kg CO₂e and equivalent trees planted
 * (approx. 21 kg CO₂ absorbed per tree per year).
 *
 * @returns The rendered diet swap simulator card.
 */
export function DietSwapSimulator() {
  const [currentDiet, setCurrentDiet] = useState<keyof typeof EMISSION_FACTORS.diet>('heavy-meat');
  const [targetDiet, setTargetDiet] = useState<keyof typeof EMISSION_FACTORS.diet>('vegan');

  const currentImpact = EMISSION_FACTORS.diet[currentDiet];
  const targetImpact = EMISSION_FACTORS.diet[targetDiet];
  
  const diff = currentImpact - targetImpact;
  const isSaving = diff > 0;
  
  // Equivalent trees planted (approx 21kg CO2 per tree per year)
  const treesEquivalent = isSaving ? Math.round(diff / 21) : 0;

  return (
    <div className="glass-card p-6 space-y-6">
      <h2 className="font-display font-bold text-xl text-primary flex items-center gap-2">
        🥗 Diet Swap Simulator
      </h2>
      <p className="text-secondary text-sm leading-relaxed">
        See how shifting your baseline diet tier impacts your annual carbon footprint. Food accounts for up to 25% of global greenhouse gas emissions.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Current Diet */}
        <div className="space-y-2">
          <label className="block text-sm text-secondary font-medium">Current Diet</label>
          <div className="grid grid-cols-2 gap-2">
            {DIETS.map((diet) => (
              <button
                key={`current-${diet.id}`}
                onClick={() => setCurrentDiet(diet.id as keyof typeof EMISSION_FACTORS.diet)}
                className={`flex flex-col items-center justify-center gap-1 p-3 rounded-xl border-2 transition-all ${
                  currentDiet === diet.id 
                    ? 'border-rose-400 bg-rose-500/10 text-rose-300' 
                    : 'border-[var(--border-strong)] bg-[var(--bg-card)] text-secondary hover:border-muted'
                }`}
              >
                <span className="text-2xl" aria-hidden="true">{diet.icon}</span>
                <span className="text-xs font-semibold">{diet.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Target Diet */}
        <div className="space-y-2">
          <label className="block text-sm text-secondary font-medium">Target Diet</label>
          <div className="grid grid-cols-2 gap-2">
            {DIETS.map((diet) => (
              <button
                key={`target-${diet.id}`}
                onClick={() => setTargetDiet(diet.id as keyof typeof EMISSION_FACTORS.diet)}
                className={`flex flex-col items-center justify-center gap-1 p-3 rounded-xl border-2 transition-all ${
                  targetDiet === diet.id 
                    ? 'border-emerald-400 bg-emerald-500/10 text-emerald-300' 
                    : 'border-[var(--border-strong)] bg-[var(--bg-card)] text-secondary hover:border-muted'
                }`}
              >
                <span className="text-2xl" aria-hidden="true">{diet.icon}</span>
                <span className="text-xs font-semibold">{diet.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results */}
      <div className={`p-5 rounded-xl border transition-all duration-300 ${isSaving ? 'bg-emerald-500/10 border-emerald-500/30' : diff === 0 ? 'bg-gray-500/10 border-gray-500/30' : 'bg-rose-500/10 border-rose-500/30'}`}>
        <div className="flex flex-col items-center text-center space-y-2">
          <p className="text-sm text-muted font-medium">Annual Footprint Shift</p>
          <div className="flex items-baseline gap-2">
            <span className={`text-4xl font-black font-mono tracking-tighter ${isSaving ? 'text-emerald-400' : diff === 0 ? 'text-gray-400' : 'text-rose-400'}`}>
              {isSaving ? '-' : '+'}{Math.abs(diff)}
            </span>
            <span className="text-secondary font-semibold">kg CO₂e / year</span>
          </div>
          
          {isSaving && (
            <div className="flex items-center gap-2 mt-2 pt-3 border-t border-emerald-500/20 w-full justify-center">
              <span className="text-xl" aria-hidden="true">🌳</span>
              <p className="text-sm text-emerald-300 font-medium">
                Equivalent to planting <strong className="text-emerald-200">{treesEquivalent} trees</strong>
              </p>
            </div>
          )}
          {!isSaving && diff < 0 && (
            <div className="flex items-center gap-2 mt-2 pt-3 border-t border-rose-500/20 w-full justify-center">
              <span className="text-xl" aria-hidden="true">⚠️</span>
              <p className="text-sm text-rose-300 font-medium">
                This swap would increase your footprint.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
