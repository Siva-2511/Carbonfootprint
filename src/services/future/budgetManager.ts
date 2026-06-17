import { APP_CONFIG } from '../../config';
import type { BudgetInfo } from '../../types';

/** Calculates monthly carbon budget and determines alert status. */
export function calculateBudget(annualKg: number): BudgetInfo {
  const safe = Number.isFinite(annualKg) && annualKg >= 0 ? annualKg : 0;
  const monthlyBudgetKg = Math.round(safe / 12);
  const weeklyBudgetKg = Math.round(safe / 52);
  const sustainableMonthlyKg = APP_CONFIG.sustainableMonthlyKgTarget as number;
  const percentOfTarget = sustainableMonthlyKg === 0
    ? 100
    : Math.round((monthlyBudgetKg / sustainableMonthlyKg) * 100);

  const isOverBudget = monthlyBudgetKg > sustainableMonthlyKg;

  let status: BudgetInfo['status'] = 'good';
  let alertMessage = '';

  if (percentOfTarget >= 100) {
    status = 'critical';
    alertMessage = `Your monthly emissions (${monthlyBudgetKg} kg) exceed the sustainable target of ${Math.round(sustainableMonthlyKg)} kg. Immediate action recommended.`;
  } else if (percentOfTarget >= 80) {
    status = 'warning';
    alertMessage = `You're at ${percentOfTarget}% of the sustainable monthly limit. Consider taking P0 actions soon.`;
  } else {
    alertMessage = `You're within sustainable limits. Keep it up!`;
  }

  return { monthlyBudgetKg, weeklyBudgetKg, sustainableMonthlyKg, percentOfTarget, isOverBudget, alertMessage, status };
}
