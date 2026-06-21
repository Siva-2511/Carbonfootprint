import React from 'react';
import { Card } from '../ui/Card';
import type { CalculatorInputs, DietType } from '../../types';

// ─────────────────────────────────────────────────────────────
//  FILE 5: src/components/Profile/CalculatorStep3.tsx
// ─────────────────────────────────────────────────────────────

interface CalculatorStep3Props {
  inputs: CalculatorInputs;
  onUpdate: (partial: Partial<CalculatorInputs>) => void;
}

interface DietOption {
  value: DietType;
  icon: string;
  label: string;
  impactLabel: string;
  badgeClass: string;
  badgeBg: string;
  borderSelected: string;
  bgSelected: string;
  description: string;
}

const DIET_OPTIONS: DietOption[] = [
  {
    value: 'heavy-meat',
    icon: '🥩',
    label: 'Heavy Meat Eater',
    impactLabel: '2,500 kg CO₂e/year',
    badgeClass: 'text-rose-300 border-rose-500/30',
    badgeBg: 'bg-rose-500/15',
    borderSelected: 'border-rose-500/60',
    bgSelected: 'bg-rose-500/8',
    description: 'Red meat at most meals, high dairy consumption',
  },
  {
    value: 'low-meat',
    icon: '🍗',
    label: 'Low Meat Eater',
    impactLabel: '1,700 kg CO₂e/year',
    badgeClass: 'text-amber-300 border-amber-500/30',
    badgeBg: 'bg-amber-500/15',
    borderSelected: 'border-amber-500/60',
    bgSelected: 'bg-amber-500/8',
    description: 'Occasional chicken, fish or processed meat',
  },
  {
    value: 'vegetarian',
    icon: '🥦',
    label: 'Vegetarian',
    impactLabel: '1,100 kg CO₂e/year',
    badgeClass: 'text-green-300 border-green-500/30',
    badgeBg: 'bg-green-500/15',
    borderSelected: 'border-green-500/60',
    bgSelected: 'bg-green-500/8',
    description: 'No meat, includes eggs and dairy',
  },
  {
    value: 'vegan',
    icon: '🌱',
    label: 'Vegan',
    impactLabel: '700 kg CO₂e/year',
    badgeClass: 'text-emerald-300 border-emerald-500/30',
    badgeBg: 'bg-emerald-500/15',
    borderSelected: 'border-emerald-500/60',
    bgSelected: 'bg-emerald-500/8',
    description: 'Plant-based diet, no animal products',
  },
];

export function CalculatorStep3({ inputs, onUpdate }: CalculatorStep3Props) {
  return (
    <Card className="p-6 space-y-8">
      {/* Section heading */}
      <div>
        <h2
          className="text-xl font-bold text-primary font-display flex items-center gap-2"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          <span aria-hidden="true">🥗</span> Diet &amp; Food
        </h2>
        <p className="text-sm text-secondary mt-1">
          What you eat is one of the biggest levers for reducing your footprint.
        </p>
      </div>

      {/* Diet cards 2×2 grid */}
      <div
        role="radiogroup"
        aria-label="Diet type"
        className="grid grid-cols-1 sm:grid-cols-2 gap-4"
      >
        {DIET_OPTIONS.map((opt) => {
          const isSelected = inputs.dietType === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              role="radio"
              aria-checked={isSelected}
              onClick={() => onUpdate({ dietType: opt.value })}
              className={`
                relative flex flex-col gap-3 p-5 rounded-xl border-2 text-left
                transition-all duration-200 cursor-pointer
                focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950
                ${isSelected
                  ? `${opt.borderSelected} ${opt.bgSelected}`
                  : 'border-card var-bg-card hover:border-strong '
                }
              `}
            >
              {/* Selected checkmark */}
              {isSelected && (
                <span
                  className="absolute top-3 right-3 w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center"
                  aria-hidden="true"
                >
                  <svg className="w-3 h-3 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </span>
              )}

              {/* Icon */}
              <span className="text-3xl" aria-hidden="true">{opt.icon}</span>

              {/* Title */}
              <div>
                <h3 className={`font-semibold font-display text-sm ${isSelected ? 'text-primary' : 'text-primary'}`}
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  {opt.label}
                </h3>
                <p className="text-xs text-muted mt-0.5 leading-relaxed">{opt.description}</p>
              </div>

              {/* Impact badge */}
              <span
                className={`inline-flex items-center self-start px-2.5 py-1 rounded-lg border text-xs font-medium font-mono tabular-nums
                  ${opt.badgeClass} ${opt.badgeBg}`}
                aria-label={`Annual impact: ${opt.impactLabel}`}
              >
                {opt.impactLabel}
              </span>

              {isSelected && <span className="sr-only"> (selected)</span>}
            </button>
          );
        })}
      </div>

      {/* Informational note */}
      <div className="flex items-start gap-3 p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/15">
        <span className="text-lg mt-0.5" aria-hidden="true">🌍</span>
        <p className="text-xs text-secondary leading-relaxed">
          Shifting from a heavy meat diet to vegan could cut food emissions by{' '}
          <span className="text-emerald-400 font-medium">72%</span>. Even one
          meat-free day per week makes a measurable difference.
        </p>
      </div>
    </Card>
  );
}


