import { describe, it, expect } from 'vitest';
import { rank, promoteRecommendations } from '../services/intelligence/actionPriority';
import type { CarbonResult, CarbonDNA } from '../types';

const MOCK_RESULT: CarbonResult = {
  totalAnnualKg: 5000,
  totalAnnualTons: 5.0,
  breakdown: {
    transport: { kg: 3000, percentage: 60 },
    energy: { kg: 1000, percentage: 20 },
    diet: { kg: 700, percentage: 14 },
    consumption: { kg: 300, percentage: 6 },
  },
  primaryDriver: 'transport',
  timestamp: Date.now(),
};

const MOCK_DNA: CarbonDNA = {
  persona: 'Urban Commuter',
  primarySource: 'Transport',
  primaryPercentage: 60,
  riskTrend: 'stable',
  reductionPotential: 42,
};

describe('actionPriority', () => {
  it('returns an array of recommendations', () => {
    const recs = rank(MOCK_RESULT, MOCK_DNA);
    expect(Array.isArray(recs)).toBe(true);
    expect(recs.length).toBeGreaterThan(0);
  });

  it('sorts P0 before P1 before P2', () => {
    const recs = rank(MOCK_RESULT, MOCK_DNA);
    const priorities = recs.map((r) => r.priority);
    const p0End = priorities.lastIndexOf('P0');
    const p1Start = priorities.indexOf('P1');
    const p1End = priorities.lastIndexOf('P1');
    const p2Start = priorities.indexOf('P2');
    if (p0End !== -1 && p1Start !== -1) expect(p0End).toBeLessThan(p1Start);
    if (p1End !== -1 && p2Start !== -1) expect(p1End).toBeLessThan(p2Start);
  });

  it('all recommendations have required fields', () => {
    const recs = rank(MOCK_RESULT, MOCK_DNA);
    recs.forEach((r) => {
      expect(r.id).toBeTruthy();
      expect(r.action).toBeTruthy();
      expect(r.reason).toBeTruthy();
      expect(r.impactKg).toBeGreaterThan(0);
      expect(['P0','P1','P2']).toContain(r.priority);
      expect(['easy','moderate','hard']).toContain(r.difficulty);
    });
  });

  it('promotes top P1 to P0 when all P0 in category are completed', () => {
    const recs = rank(MOCK_RESULT, MOCK_DNA);
    const p0Transport = recs.filter((r) => r.category === 'transport' && r.priority === 'P0');
    const completedIds = p0Transport.map((r) => r.id);
    const promoted = promoteRecommendations(recs, completedIds);
    const newP0Transport = promoted.filter((r) => r.category === 'transport' && r.priority === 'P0');
    expect(newP0Transport.length).toBeGreaterThan(p0Transport.length);
  });

  it('does not promote P1 when P0 are not all completed', () => {
    const recs = rank(MOCK_RESULT, MOCK_DNA);
    const promoted = promoteRecommendations(recs, []);
    const p0Count = recs.filter((r) => r.priority === 'P0').length;
    const promotedP0Count = promoted.filter((r) => r.priority === 'P0').length;
    expect(promotedP0Count).toBe(p0Count);
  });

  it('has at least one P0 recommendation', () => {
    const recs = rank(MOCK_RESULT, MOCK_DNA);
    expect(recs.some((r) => r.priority === 'P0')).toBe(true);
  });

  it('P0 recommendations have easy difficulty', () => {
    const recs = rank(MOCK_RESULT, MOCK_DNA);
    recs.filter((r) => r.priority === 'P0').forEach((r) => {
      expect(r.difficulty).toBe('easy');
    });
  });
});
