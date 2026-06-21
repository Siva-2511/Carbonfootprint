/**
 * @fileoverview Step 1 of the Carbon Footprint Calculator — Energy Usage.
 * Collects household location (country), household size, monthly electricity
 * consumption, AC hours per day, electricity source (grid/solar/mixed), and
 * either gas heating therms or LPG cylinder count depending on the country.
 */

import React from 'react';
import { Slider } from '../ui/Slider';
import { Card } from '../ui/Card';
import type { CalculatorInputs, ElectricitySource } from '../../types';
import { COUNTRY_GRID_FACTORS, GAS_HEATING_COUNTRIES } from '../../config';

// ─────────────────────────────────────────────────────────────
//  FILE 3: src/components/Profile/CalculatorStep1.tsx
// ─────────────────────────────────────────────────────────────

interface CalculatorStep1Props {
  inputs: CalculatorInputs;
  onUpdate: (partial: Partial<CalculatorInputs>) => void;
}

interface SourceOption {
  value: ElectricitySource;
  icon: string;
  label: string;
  description: string;
}

const SOURCE_OPTIONS: SourceOption[] = [
  {
    value: 'grid',
    icon: '🔌',
    label: 'Grid',
    description: 'Standard electricity grid',
  },
  {
    value: 'solar',
    icon: '☀️',
    label: 'Solar',
    description: 'Renewable solar panels',
  },
  {
    value: 'mixed',
    icon: '⚡',
    label: 'Mixed',
    description: 'Grid + renewable mix',
  },
];

/**
 * Renders the Energy Usage form card — Step 1 of the carbon footprint calculator.
 * Includes a custom country dropdown, a household size stepper, sliders for
 * electricity and AC usage, an electricity source radio group, and a conditional
 * heating slider (gas therms for applicable countries, LPG cylinders otherwise).
 *
 * @param props.inputs - Current accumulated calculator inputs from the parent wizard.
 * @param props.onUpdate - Callback to merge partial input updates into the parent state.
 */
export function CalculatorStep1({ inputs, onUpdate }: CalculatorStep1Props) {
  const [locationOpen, setLocationOpen] = React.useState(false);
  const locationRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (locationRef.current && !locationRef.current.contains(event.target as Node)) {
        setLocationOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const COUNTRY_LIST = Object.keys(COUNTRY_GRID_FACTORS);

  return (
    <Card className="p-6 space-y-8">
      {/* Section heading */}
      <div>
        <h2
          className="text-xl font-bold text-primary font-display flex items-center gap-2"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          <span aria-hidden="true">⚡</span> Energy Usage
        </h2>
        <p className="text-sm text-secondary mt-1">
          Tell us about your home energy consumption.
        </p>
      </div>

      {/* Household & Country Setup */}
      <div className="grid grid-cols-2 gap-4 pb-4 border-b border-card">
        <div ref={locationRef}>
          <label className="block text-sm font-medium text-secondary mb-2">Location (Grid Info)</label>
          <div className="relative">
            <button
              type="button"
              onClick={() => setLocationOpen(o => !o)}
              className="w-full px-4 py-3 rounded-xl glass-card border border-[var(--border-card)] 
                         text-[var(--text-primary)] text-left flex items-center justify-between
                         hover:border-emerald-500/50 transition-colors"
              aria-haspopup="listbox"
              aria-expanded={locationOpen}
            >
              <span>{inputs.country || 'India'}</span>
              <span className={`transition-transform ${locationOpen ? 'rotate-180' : ''}`}>▾</span>
            </button>

            {locationOpen && (
              <ul
                role="listbox"
                className="absolute z-50 mt-1 w-full max-h-60 overflow-y-auto rounded-xl 
                           border border-[var(--border-card)] shadow-lg shadow-black/30 bg-[var(--bg-dropdown)]"
              >
                {COUNTRY_LIST.map(country => (
                  <li
                    key={country}
                    role="option"
                    aria-selected={inputs.country === country}
                    onClick={() => { onUpdate({ country }); setLocationOpen(false); }}
                    className="px-4 py-2 cursor-pointer text-[var(--text-primary)]
                               hover:bg-emerald-500/10 transition-colors
                               aria-selected:bg-emerald-500/20 aria-selected:font-medium"
                  >
                    {country}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-secondary mb-2">Household Size</label>
          <div className="flex items-center gap-4">
            <button aria-label="Decrease household size" type="button" onClick={() => onUpdate({ householdSize: Math.max(1, (inputs.householdSize || 1) - 1) })} className="w-10 h-10 rounded-full border border-strong text-primary flex items-center justify-center hover:bg-white/5 active:scale-95 transition-all">-</button>
            <span className="text-xl font-bold text-primary font-display w-6 text-center">{inputs.householdSize || 1}</span>
            <button aria-label="Increase household size" type="button" onClick={() => onUpdate({ householdSize: Math.min(20, (inputs.householdSize || 1) + 1) })} className="w-10 h-10 rounded-full border border-strong text-primary flex items-center justify-center hover:bg-white/5 active:scale-95 transition-all">+</button>
          </div>
        </div>
      </div>

      {/* Monthly electricity slider */}
      <div className="space-y-4">
        <Slider
          label="Monthly Electricity Consumption"
          value={inputs.electricityKwh}
          onChange={(v) => onUpdate({ electricityKwh: v })}
          min={0}
          max={2000}
          step={10}
          unit="kWh"
          helperText={(!inputs.country || inputs.country === 'India') ? "Average Indian household uses 200–400 kWh/month" : "Check your utility bill for your typical monthly usage"}
          color="emerald"
        />
      </div>

      {/* AC Usage Slider */}
      <div className="space-y-4 pt-2">
        <Slider
          label="Air Conditioning Usage (per day)"
          value={inputs.acHours || 0}
          onChange={(v) => onUpdate({ acHours: v })}
          min={0}
          max={24}
          step={1}
          unit="hours/day"
          helperText="AC drastically increases emissions. Be honest!"
          color="emerald"
        />
      </div>

      {/* Electricity source selector */}
      <fieldset>
        <legend className="text-sm font-medium text-secondary mb-3">
          Electricity Source
        </legend>
        <div
          role="radiogroup"
          aria-label="Electricity source"
          className="grid grid-cols-3 gap-3"
        >
          {SOURCE_OPTIONS.map((opt) => {
            const isSelected = inputs.electricitySource === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                role="radio"
                aria-checked={isSelected}
                onClick={() => onUpdate({ electricitySource: opt.value })}
                className={`
                  flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200
                  cursor-pointer text-center
                  focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950
                  ${
                    isSelected
                      ? 'border-emerald-500/60 bg-emerald-500/10 text-emerald-300'
                      : 'border-card var-bg-card text-secondary hover:border-strong  hover:text-primary'
                  }
                `}
              >
                <span className="text-2xl" aria-hidden="true">
                  {opt.icon}
                </span>
                <span className="text-sm font-semibold font-display">
                  {opt.label}
                </span>
                <span className="text-xs text-muted leading-tight">
                  {opt.description}
                </span>
                {isSelected && (
                  <span className="sr-only"> (selected)</span>
                )}
              </button>
            );
          })}
        </div>
      </fieldset>

      {/* Heating / LPG slider - conditionally rendered based on country */}
      {inputs.country && GAS_HEATING_COUNTRIES.includes(inputs.country) ? (
        <div className="space-y-4">
          <Slider
            label="Monthly Gas Heating"
            value={inputs.heatingTherms}
            onChange={(v) => onUpdate({ heatingTherms: v })}
            min={0}
            max={100}
            step={1}
            unit="therms"
            helperText="1 therm ≈ 29.3 kWh of natural gas"
            color="amber"
          />
        </div>
      ) : (
        <div className="space-y-4">
          <Slider
            label="LPG Cylinders per Month"
            value={inputs.lpgCylinders || 0}
            onChange={(v) => onUpdate({ lpgCylinders: v })}
            min={0}
            max={4}
            step={1}
            unit="cylinders"
            helperText="1 standard 14.2kg LPG cylinder ≈ 42.4 kg CO₂e"
            color="amber"
          />
        </div>
      )}

      {/* Contextual info card */}
      <div className="flex items-start gap-3 p-4 rounded-xl bg-blue-500/8 border border-blue-500/20">
        <span className="text-lg" aria-hidden="true">💡</span>
        <div>
          <p className="text-xs font-medium text-blue-300 mb-0.5">
            Pro tip
          </p>
          <p className="text-xs text-secondary leading-relaxed">
            Switching to solar can reduce your energy emissions by up to{' '}
            <span className="text-emerald-400 font-medium">70%</span>. Check your
            electricity bill for exact kWh usage.
          </p>
        </div>
      </div>
    </Card>
  );
}


