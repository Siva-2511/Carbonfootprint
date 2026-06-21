import { EMISSION_FACTORS, INPUT_LIMITS, COUNTRY_GRID_FACTORS, GAS_HEATING_COUNTRIES, CURRENCY_MAP } from '../../config';
import type { CalculatorInputs, CarbonResult, Category } from '../../types';
import { clamp } from '../../core/validation';

const DEFAULT_RESULT: CarbonResult = {
  totalAnnualKg: 0,
  totalAnnualTons: 0,
  breakdown: {
    energy: { kg: 0, percentage: 25 },
    transport: { kg: 0, percentage: 25 },
    diet: { kg: 0, percentage: 25 },
    consumption: { kg: 0, percentage: 25 },
  },
  primaryDriver: 'energy',
  timestamp: Date.now(),
};

/** Calculates annual carbon emissions from validated user inputs. */
export function calculate(inputs: CalculatorInputs): CarbonResult {
  // 1. Clamp inputs & household math
  const hsSize = clamp(inputs.householdSize || 1, 1, INPUT_LIMITS.householdSize.max);
  const elecKwh = clamp(inputs.electricityKwh, 0, INPUT_LIMITS.electricityKwh.max);
  const acHours = clamp(inputs.acHours || 0, 0, INPUT_LIMITS.acHours.max);
  const hasGasHeating = inputs.country ? GAS_HEATING_COUNTRIES.includes(inputs.country) : false;
  const heatingTherms = hasGasHeating ? clamp(inputs.heatingTherms || 0, 0, INPUT_LIMITS.heatingTherms.max) : 0;
  const lpgCylinders = !hasGasHeating ? clamp(inputs.lpgCylinders || 0, 0, INPUT_LIMITS.lpgCylinders.max) : 0;
  const weeklyKm = clamp(inputs.weeklyKm, 0, INPUT_LIMITS.weeklyKm.max);
  const publicKm = clamp(inputs.publicTransportKm || 0, 0, INPUT_LIMITS.publicTransportKm.max);
  const shortFlights = clamp(inputs.shortFlights, 0, INPUT_LIMITS.shortFlights.max);
  const longFlights = clamp(inputs.longFlights, 0, INPUT_LIMITS.longFlights.max);
  const monthlySpend = clamp(inputs.monthlySpend, 0, INPUT_LIMITS.monthlySpend.max);

  // 2. Calculate per-category annual kg (Households share energy & consumption)
  const baseGridFactor = inputs.country ? (COUNTRY_GRID_FACTORS[inputs.country] || 0.47) : 0.47;
  const elecFactor = inputs.electricitySource === 'solar' ? 0.04 : inputs.electricitySource === 'mixed' ? baseGridFactor * 0.5 + 0.02 : baseGridFactor;
  
  // Estimate AC electricity (1.5 kWh/hour runtime)
  const acKwhMonthly = acHours * 1.5 * 30;
  const totalElecMonthly = elecKwh + acKwhMonthly;
  
  const householdEnergyKg = totalElecMonthly * 12 * elecFactor 
    + heatingTherms * 12 * EMISSION_FACTORS.heating.naturalGas
    + lpgCylinders * 12 * EMISSION_FACTORS.heating.lpgCylinder;
  const energyKg = householdEnergyKg / hsSize;

  const vehicleFactor = EMISSION_FACTORS.transport[inputs.vehicleType] ?? 0;
  const publicFactor = inputs.publicTransitMode === 'metro' 
    ? EMISSION_FACTORS.transport.metro 
    : EMISSION_FACTORS.transport.bus;

  const transportKg =
    weeklyKm * 52 * vehicleFactor +
    publicKm * 52 * publicFactor +
    shortFlights * EMISSION_FACTORS.flights.shortHaul +
    longFlights * EMISSION_FACTORS.flights.longHaul;

  const dietKg = EMISSION_FACTORS.diet[inputs.dietType] ?? EMISSION_FACTORS.diet['low-meat'];

  const currencyInfo = inputs.country && CURRENCY_MAP[inputs.country] ? CURRENCY_MAP[inputs.country] : CURRENCY_MAP['Global Average'];
  const spendingLevel = monthlySpend > currencyInfo.tier2 ? 'high' : monthlySpend > currencyInfo.tier1 ? 'medium' : 'low';
  
  // Normalize spend to INR equivalent for the emission factor calculation
  const inrEquivalentSpend = monthlySpend / currencyInfo.multiplier;
  const rawConsumptionKg = inrEquivalentSpend * 12 * EMISSION_FACTORS.shopping[spendingLevel];
  const householdConsumptionKg = inputs.recycling
    ? rawConsumptionKg * (1 - EMISSION_FACTORS.recyclingDiscount)
    : rawConsumptionKg;
  const consumptionKg = householdConsumptionKg / hsSize;

  // 3. Total with safety guard
  const totalKg = energyKg + transportKg + dietKg + consumptionKg;
  if (!Number.isFinite(totalKg) || totalKg < 0) return { ...DEFAULT_RESULT, timestamp: Date.now() };

  // 4. Percentages (guard division by zero)
  const pct = (part: number) =>
    totalKg === 0 ? 25 : Math.round((part / totalKg) * 100);

  const breakdown = {
    energy: { kg: Math.round(energyKg), percentage: pct(energyKg) },
    transport: { kg: Math.round(transportKg), percentage: pct(transportKg) },
    diet: { kg: Math.round(dietKg), percentage: pct(dietKg) },
    consumption: { kg: Math.round(consumptionKg), percentage: pct(consumptionKg) },
  };

  // 5. Primary driver
  const categories: Category[] = ['energy', 'transport', 'diet', 'consumption'];
  const primaryDriver = categories.reduce((a, b) =>
    breakdown[a].kg > breakdown[b].kg ? a : b
  );

  return {
    totalAnnualKg: Math.round(totalKg),
    totalAnnualTons: Math.round((totalKg / 1000) * 100) / 100,
    breakdown,
    primaryDriver,
    timestamp: Date.now(),
  };
}
