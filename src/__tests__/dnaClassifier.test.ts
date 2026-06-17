import { describe, it, expect } from 'vitest';
import { classify } from '../services/intelligence/dnaClassifier';
import type { CarbonResult } from '../types';

function makeResult(overrides: Partial<CarbonResult['breakdown']> & { totalTons?: number }): CarbonResult {
  const energy = overrides.energy ?? { kg: 500, percentage: 25 };
  const transport = overrides.transport ?? { kg: 500, percentage: 25 };
  const diet = overrides.diet ?? { kg: 500, percentage: 25 };
  const consumption = overrides.consumption ?? { kg: 500, percentage: 25 };
  const totalKg = energy.kg + transport.kg + diet.kg + consumption.kg;
  return {
    totalAnnualKg: totalKg,
    totalAnnualTons: overrides.totalTons ?? totalKg / 1000,
    breakdown: { energy, transport, diet, consumption },
    primaryDriver: 'energy',
    timestamp: Date.now(),
  };
}

describe('dnaClassifier', () => {
  it('classifies Eco-Leader for totalAnnualTons < 1.5', () => {
    const result = makeResult({ totalTons: 1.2 });
    const dna = classify(result, []);
    expect(dna.persona).toBe('Eco-Leader');
  });

  it('classifies Urban Commuter when transport > 50%', () => {
    const result = makeResult({ transport: { kg: 3000, percentage: 60 }, energy: { kg: 500, percentage: 10 }, diet: { kg: 1000, percentage: 20 }, consumption: { kg: 500, percentage: 10 } });
    result.totalAnnualTons = 5; // above Eco-Leader threshold
    const dna = classify(result, []);
    expect(dna.persona).toBe('Urban Commuter');
  });

  it('classifies Energy-Intensive Resident when energy > 50%', () => {
    const result = makeResult({ energy: { kg: 4000, percentage: 60 }, transport: { kg: 800, percentage: 12 }, diet: { kg: 800, percentage: 12 }, consumption: { kg: 1067, percentage: 16 } });
    result.totalAnnualTons = 6.7;
    const dna = classify(result, []);
    expect(dna.persona).toBe('Energy-Intensive Resident');
  });

  it('classifies Industrial Consumer when consumption > 40%', () => {
    const result = makeResult({ consumption: { kg: 3000, percentage: 45 }, energy: { kg: 1500, percentage: 22 }, transport: { kg: 1000, percentage: 15 }, diet: { kg: 1167, percentage: 18 } });
    result.totalAnnualTons = 6.7;
    const dna = classify(result, []);
    expect(dna.persona).toBe('Industrial Consumer');
  });

  it('classifies Balanced Emitter as fallback', () => {
    const result = makeResult({});
    result.totalAnnualTons = 5;
    const dna = classify(result, []);
    expect(dna.persona).toBe('Balanced Emitter');
  });

  it('computes riskTrend stable with < 2 history entries', () => {
    const result = makeResult({});
    result.totalAnnualTons = 5;
    const dna = classify(result, []);
    expect(dna.riskTrend).toBe('stable');
  });

  it('computes riskTrend increasing when latest > previous by > 5%', () => {
    const old = makeResult({}); old.totalAnnualKg = 3000; old.totalAnnualTons = 3;
    const latest = makeResult({}); latest.totalAnnualKg = 3300; latest.totalAnnualTons = 3.3;
    const dna = classify(latest, [old, latest]);
    expect(dna.riskTrend).toBe('increasing');
  });
});
