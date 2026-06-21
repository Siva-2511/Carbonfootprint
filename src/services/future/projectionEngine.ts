import type { ProjectionResult } from '../../types';

const REDUCTION_RATES: Array<{ threshold: number; rate: number }> = [
  { threshold: 0, rate: 0.05 },
  { threshold: 25, rate: 0.10 },
  { threshold: 50, rate: 0.15 },
  { threshold: 75, rate: 0.25 },
  { threshold: 100, rate: 0.35 },
];

function getReductionRate(completedPhasePercent: number): number {
  const pct = Math.min(Math.max(completedPhasePercent, 0), 100);
  let rate = 0.05;
  for (const { threshold, rate: r } of REDUCTION_RATES) {
    if (pct >= threshold) rate = r;
  }
  return rate;
}

export function project(currentTons: number, completedPhasePercent: number): ProjectionResult {
  const safe = Number.isFinite(currentTons) && currentTons >= 0 ? currentTons : 0;
  const reductionRate = getReductionRate(completedPhasePercent);
  const years = [0, 1, 2, 3, 4, 5];

  const bau = years.map((n) => {
    const val = safe * Math.pow(1.03, n);
    return Number.isFinite(val) ? Math.round(val * 100) / 100 : safe;
  });

  const sustainable = years.map((n) => {
    const val = safe * Math.pow(1 - reductionRate, n);
    return Number.isFinite(val) ? Math.max(0, Math.round(val * 100) / 100) : 0;
  });

  return { bau, sustainable, years };
}
