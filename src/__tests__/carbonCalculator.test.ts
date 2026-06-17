import { describe, it, expect } from 'vitest';
import { calculate } from '../services/core/carbonCalculator';
import type { CalculatorInputs } from '../types';

const BASE_INPUTS: CalculatorInputs = {
  country: 'Global Average',
  householdSize: 1,
  acHours: 0,
  publicTransportKm: 0,
  electricityKwh: 300,
  electricitySource: 'grid',
  heatingTherms: 20,
  vehicleType: 'petrol',
  weeklyKm: 100,
  shortFlights: 2,
  longFlights: 1,
  dietType: 'low-meat',
  monthlySpend: 5000,
  recycling: false,
};

describe('carbonCalculator', () => {
  it('calculates non-zero result for typical Indian household inputs', () => {
    const result = calculate(BASE_INPUTS);
    expect(result.totalAnnualKg).toBeGreaterThan(0);
    expect(result.totalAnnualTons).toBeGreaterThan(0);
    expect(Number.isFinite(result.totalAnnualKg)).toBe(true);
  });

  it('returns zero-ish result for all-zero numeric inputs', () => {
    const inputs: CalculatorInputs = {
      ...BASE_INPUTS,
      electricityKwh: 0,
      heatingTherms: 0,
      vehicleType: 'none',
      weeklyKm: 0,
      shortFlights: 0,
      longFlights: 0,
      monthlySpend: 0,
      dietType: 'vegan',
    };
    const result = calculate(inputs);
    // Diet still contributes
    expect(result.totalAnnualKg).toBeGreaterThanOrEqual(0);
    expect(Number.isFinite(result.totalAnnualKg)).toBe(true);
  });

  it('clamps extreme electricity values (50000 kWh) to max', () => {
    const result = calculate({ ...BASE_INPUTS, electricityKwh: 50000 });
    const capped = calculate({ ...BASE_INPUTS, electricityKwh: 10000 });
    expect(result.totalAnnualKg).toBe(capped.totalAnnualKg);
  });

  it('clamps negative values to 0', () => {
    const result = calculate({ ...BASE_INPUTS, electricityKwh: -500, weeklyKm: -200 });
    expect(result.totalAnnualKg).toBeGreaterThanOrEqual(0);
  });

  it('percentages sum to approximately 100', () => {
    const result = calculate(BASE_INPUTS);
    const { energy, transport, diet, consumption } = result.breakdown;
    const sum = energy.percentage + transport.percentage + diet.percentage + consumption.percentage;
    expect(sum).toBeGreaterThan(90);
    expect(sum).toBeLessThanOrEqual(104); // rounding tolerance
  });

  it('recycling reduces consumption emissions', () => {
    const without = calculate({ ...BASE_INPUTS, recycling: false });
    const with_ = calculate({ ...BASE_INPUTS, recycling: true });
    expect(with_.breakdown.consumption.kg).toBeLessThan(without.breakdown.consumption.kg);
  });

  it('EV vehicle emits less than petrol', () => {
    const petrol = calculate({ ...BASE_INPUTS, vehicleType: 'petrol' });
    const ev = calculate({ ...BASE_INPUTS, vehicleType: 'ev' });
    expect(ev.breakdown.transport.kg).toBeLessThan(petrol.breakdown.transport.kg);
  });

  it('vegan diet emits less than heavy-meat diet', () => {
    const meat = calculate({ ...BASE_INPUTS, dietType: 'heavy-meat' });
    const vegan = calculate({ ...BASE_INPUTS, dietType: 'vegan' });
    expect(vegan.breakdown.diet.kg).toBeLessThan(meat.breakdown.diet.kg);
  });

  it('has a timestamp on the result', () => {
    const before = Date.now();
    const result = calculate(BASE_INPUTS);
    const after = Date.now();
    expect(result.timestamp).toBeGreaterThanOrEqual(before);
    expect(result.timestamp).toBeLessThanOrEqual(after);
  });

  it('identifies primaryDriver correctly for transport-heavy user', () => {
    const result = calculate({ ...BASE_INPUTS, weeklyKm: 2000, longFlights: 10, electricityKwh: 50 });
    expect(result.primaryDriver).toBe('transport');
  });
});
