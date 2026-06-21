/**
 * @fileoverview Step 2 of the Carbon Footprint Calculator — Transportation.
 * Collects the user's primary vehicle type, weekly driving distance, public
 * transit mode, weekly public transport distance, and annual short/long-haul
 * flight counts. Each vehicle and transit option displays its per-km CO₂ factor.
 */

import React from 'react';
import { Slider } from '../ui/Slider';
import { Card } from '../ui/Card';
import type { CalculatorInputs, VehicleType } from '../../types';

// ─────────────────────────────────────────────────────────────
//  FILE 4: src/components/Profile/CalculatorStep2.tsx
// ─────────────────────────────────────────────────────────────

interface CalculatorStep2Props {
  inputs: CalculatorInputs;
  onUpdate: (partial: Partial<CalculatorInputs>) => void;
}

interface VehicleOption {
  value: VehicleType;
  icon: string;
  label: string;
  factorLabel: string;
  factorColor: string;
  description: string;
}

const VEHICLE_OPTIONS: VehicleOption[] = [
  {
    value: 'petrol',
    icon: '🚗',
    label: 'Petrol',
    factorLabel: '192 g CO₂/km',
    factorColor: 'text-rose-400',
    description: 'Standard petrol car',
  },
  {
    value: 'diesel',
    icon: '🛻',
    label: 'Diesel',
    factorLabel: '171 g CO₂/km',
    factorColor: 'text-amber-400',
    description: 'Diesel vehicle',
  },
  {
    value: 'ev',
    icon: '⚡',
    label: 'EV',
    factorLabel: '53 g CO₂/km',
    factorColor: 'text-emerald-400',
    description: 'Electric vehicle (grid avg.)',
  },
  {
    value: 'twoWheeler',
    icon: '🛵',
    label: 'Two-Wheeler',
    factorLabel: '84 g CO₂/km',
    factorColor: 'text-yellow-400',
    description: 'Scooter or motorcycle',
  },
  {
    value: 'none',
    icon: '🚶',
    label: 'None',
    factorLabel: '0 g CO₂/km',
    factorColor: 'text-green-400',
    description: 'Walk / cycle',
  },
];

const PUBLIC_TRANSIT_OPTIONS: { value: 'bus' | 'metro', icon: string, label: string, factorLabel: string, factorColor: string }[] = [
  {
    value: 'bus',
    icon: '🚌',
    label: 'Bus',
    factorLabel: '105 g CO₂/km',
    factorColor: 'text-emerald-300',
  },
  {
    value: 'metro',
    icon: '🚇',
    label: 'Metro',
    factorLabel: '41 g CO₂/km',
    factorColor: 'text-teal-400',
  },
];

/**
 * Renders the Transportation form card — Step 2 of the carbon footprint calculator.
 * Includes vehicle type selection with CO₂ emission factors, a weekly driving
 * distance slider (disabled when vehicle type is "none"), a public transit mode
 * selector, a weekly public transport distance slider, and short/long-haul flight
 * count sliders.
 *
 * @param props.inputs - Current accumulated calculator inputs from the parent wizard.
 * @param props.onUpdate - Callback to merge partial input updates into the parent state.
 */
export function CalculatorStep2({ inputs, onUpdate }: CalculatorStep2Props) {
  return (
    <Card className="p-6 space-y-8">
      {/* Section heading */}
      <div>
        <h2
          className="text-xl font-bold text-primary font-display flex items-center gap-2"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          <span aria-hidden="true">🚗</span> Transportation
        </h2>
        <p className="text-sm text-secondary mt-1">
          How you get around matters — transportation is a major emission source.
        </p>
      </div>

      {/* Vehicle type selector */}
      <fieldset>
        <legend className="text-sm font-medium text-secondary mb-3">
          Primary Vehicle Type
        </legend>
        <div
          role="radiogroup"
          aria-label="Vehicle type"
          className="grid grid-cols-2 md:grid-cols-3 gap-3"
        >
          {VEHICLE_OPTIONS.map((opt) => {
            const isSelected = inputs.vehicleType === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                role="radio"
                aria-checked={isSelected}
                onClick={() => onUpdate({ vehicleType: opt.value })}
                className={`
                  flex flex-col gap-2 p-4 rounded-xl border-2 transition-all duration-200 text-left
                  focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950
                  ${
                    isSelected
                      ? 'border-emerald-500/60 bg-emerald-500/10'
                      : 'border-card var-bg-card hover:border-strong '
                  }
                `}
              >
                <div className="flex items-center justify-between">
                  <span className="text-2xl" aria-hidden="true">{opt.icon}</span>
                  {isSelected && (
                    <span className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0" aria-hidden="true">
                      <svg className="w-3 h-3 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    </span>
                  )}
                </div>
                <div>
                  <p className={`text-sm font-semibold font-display ${isSelected ? 'text-emerald-300' : 'text-primary'}`}>
                    {opt.label}
                  </p>
                  <p className={`text-xs font-mono font-medium tabular-nums ${opt.factorColor}`}>
                    {opt.factorLabel}
                  </p>
                  <p className="text-xs text-muted mt-0.5">{opt.description}</p>
                </div>
                {isSelected && <span className="sr-only"> (selected)</span>}
              </button>
            );
          })}
        </div>
      </fieldset>

      {/* Weekly driving distance */}
      <Slider
        label="Weekly Driving Distance"
        value={inputs.weeklyKm}
        onChange={(v) => onUpdate({ weeklyKm: v })}
        min={0}
        max={1000}
        step={10}
        unit="km"
        helperText="Include commute, errands, and leisure driving"
        color="emerald"
        disabled={inputs.vehicleType === 'none'}
      />

      <div className="py-4">
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 text-center">
          <p className="text-sm text-emerald-300">
            Most people use multiple modes — add both. Your personal vehicle and public transit emissions are calculated separately and summed.
          </p>
        </div>
      </div>

      {/* Public Transport */}
      <fieldset>
        <legend className="text-sm font-medium text-secondary mb-3">
          Primary Public Transit Mode
        </legend>
        <div
          role="radiogroup"
          aria-label="Public transit mode"
          className="grid grid-cols-2 gap-3 mb-6"
        >
          {PUBLIC_TRANSIT_OPTIONS.map((opt) => {
            const isSelected = inputs.publicTransitMode === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                role="radio"
                aria-checked={isSelected}
                onClick={() => onUpdate({ publicTransitMode: opt.value as 'bus' | 'metro' })}
                className={`
                  flex flex-col gap-2 p-4 rounded-xl border-2 transition-all duration-200 text-left
                  focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950
                  ${
                    isSelected
                      ? 'border-emerald-500/60 bg-emerald-500/10'
                      : 'border-card var-bg-card hover:border-strong '
                  }
                `}
              >
                <div className="flex items-center justify-between">
                  <span className="text-2xl" aria-hidden="true">{opt.icon}</span>
                  {isSelected && (
                    <span className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0" aria-hidden="true">
                      <svg className="w-3 h-3 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    </span>
                  )}
                </div>
                <div>
                  <p className={`text-sm font-semibold font-display ${isSelected ? 'text-emerald-300' : 'text-primary'}`}>
                    {opt.label}
                  </p>
                  <p className={`text-xs font-mono font-medium tabular-nums ${opt.factorColor}`}>
                    {opt.factorLabel}
                  </p>
                </div>
                {isSelected && <span className="sr-only"> (selected)</span>}
              </button>
            );
          })}
        </div>
      </fieldset>

      <Slider
        label="Weekly Public Transport Distance"
        value={inputs.publicTransportKm || 0}
        onChange={(v) => onUpdate({ publicTransportKm: v })}
        min={0}
        max={500}
        step={5}
        unit="km"
        helperText="Bus, Metro, or Train commutes"
        color="emerald"
      />

      {/* Short-haul flights */}
      <Slider
        label="Short-Haul Flights per Year"
        value={inputs.shortFlights}
        onChange={(v) => onUpdate({ shortFlights: v })}
        min={0}
        max={20}
        step={1}
        unit="flights"
        helperText="< 3 hours flight duration (domestic / regional)"
        color="amber"
      />

      {/* Long-haul flights */}
      <Slider
        label="Long-Haul Flights per Year"
        value={inputs.longFlights}
        onChange={(v) => onUpdate({ longFlights: v })}
        min={0}
        max={10}
        step={1}
        unit="flights"
        helperText="> 6 hours flight duration (international)"
        color="rose"
      />

      {/* Info banner */}
      <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-500/8 border border-amber-500/20">
        <span className="text-lg" aria-hidden="true">✈️</span>
        <p className="text-xs text-secondary leading-relaxed">
          A single long-haul return flight can emit{' '}
          <span className="text-amber-400 font-medium">1–3 tonnes</span> of CO₂ per
          passenger — comparable to months of driving.
        </p>
      </div>
    </Card>
  );
}


