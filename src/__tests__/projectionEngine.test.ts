import { describe, it, expect } from 'vitest';
import { project } from '../services/future/projectionEngine';

describe('projectionEngine', () => {
  it('returns arrays of length 6 for years 0-5', () => {
    const result = project(5.0, 0);
    expect(result.bau.length).toBe(6);
    expect(result.sustainable.length).toBe(6);
    expect(result.years).toEqual([0, 1, 2, 3, 4, 5]);
  });

  it('BAU year[0] equals currentTons', () => {
    const result = project(4.0, 0);
    expect(result.bau[0]).toBe(4.0);
  });

  it('BAU increases approximately 3% per year', () => {
    const result = project(4.0, 0);
    expect(result.bau[1]).toBeCloseTo(4.0 * 1.03, 1);
    expect(result.bau[2]).toBeCloseTo(4.0 * 1.03 * 1.03, 1);
  });

  it('sustainable is always <= BAU', () => {
    const result = project(4.0, 50);
    result.years.forEach((_, i) => {
      expect(result.sustainable[i]).toBeLessThanOrEqual(result.bau[i] + 0.01);
    });
  });

  it('handles zero currentTons without crashing', () => {
    const result = project(0, 0);
    expect(result.bau.every((v) => v === 0)).toBe(true);
    expect(result.sustainable.every((v) => v === 0)).toBe(true);
  });

  it('sustainable values are never negative', () => {
    const result = project(3.0, 100);
    result.sustainable.forEach((v) => expect(v).toBeGreaterThanOrEqual(0));
  });
});
