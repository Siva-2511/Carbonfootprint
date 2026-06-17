import type { CarbonDNA, CarbonResult, DNAPersona, RiskTrend } from '../../types';

const REDUCTION_POTENTIAL: Record<DNAPersona, number> = {
  'Eco-Leader': 10,
  'Urban Commuter': 42,
  'Energy-Intensive Resident': 35,
  'Industrial Consumer': 30,
  'Balanced Emitter': 25,
};

function computeRiskTrend(history: CarbonResult[]): RiskTrend {
  if (history.length < 2) return 'stable';
  const latest = history[history.length - 1].totalAnnualKg;
  const previous = history[history.length - 2].totalAnnualKg;
  if (previous === 0) return 'stable';
  const change = (latest - previous) / previous;
  if (change > 0.05) return 'increasing';
  if (change < -0.05) return 'decreasing';
  return 'stable';
}

/** Classifies a user's Carbon DNA persona from their CarbonResult. */
export function classify(result: CarbonResult, history: CarbonResult[]): CarbonDNA {
  const { breakdown, totalAnnualTons } = result;
  let persona: DNAPersona;

  if (totalAnnualTons < 1.5) {
    persona = 'Eco-Leader';
  } else if (breakdown.transport.percentage > 50) {
    persona = 'Urban Commuter';
  } else if (breakdown.energy.percentage > 50) {
    persona = 'Energy-Intensive Resident';
  } else if (breakdown.consumption.percentage > 40) {
    persona = 'Industrial Consumer';
  } else {
    persona = 'Balanced Emitter';
  }

  const primaryDriver = result.primaryDriver;
  const primaryPercentage = breakdown[primaryDriver].percentage;

  return {
    persona,
    primarySource: primaryDriver.charAt(0).toUpperCase() + primaryDriver.slice(1),
    primaryPercentage,
    riskTrend: computeRiskTrend(history),
    reductionPotential: REDUCTION_POTENTIAL[persona],
  };
}
