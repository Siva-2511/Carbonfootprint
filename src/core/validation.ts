import DOMPurify from 'dompurify';
import type { CalculatorInputs } from '../types';
import { INPUT_LIMITS } from '../config';

/** Clamps a number to a [min, max] range. */
export function clamp(value: number, min: number, max: number): number {
  if (!Number.isFinite(value)) return min;
  return Math.min(Math.max(value, min), max);
}

/** Sanitizes potentially unsafe HTML using DOMPurify. */
export function sanitizeText(input: string): string {
  if (typeof input !== 'string') return '';
  return DOMPurify.sanitize(input, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });
}

/** Validates and clamps all calculator inputs to safe ranges. */
export function validateInputs(partial: Partial<CalculatorInputs>): CalculatorInputs {
  return {
    country: partial.country ?? 'Global Average',
    householdSize: clamp(
      partial.householdSize ?? INPUT_LIMITS.householdSize.default,
      INPUT_LIMITS.householdSize.min,
      INPUT_LIMITS.householdSize.max
    ),
    acHours: clamp(
      partial.acHours ?? INPUT_LIMITS.acHours.default,
      INPUT_LIMITS.acHours.min,
      INPUT_LIMITS.acHours.max
    ),
    publicTransportKm: clamp(
      partial.publicTransportKm ?? INPUT_LIMITS.publicTransportKm.default,
      INPUT_LIMITS.publicTransportKm.min,
      INPUT_LIMITS.publicTransportKm.max
    ),
    electricityKwh: clamp(
      partial.electricityKwh ?? INPUT_LIMITS.electricityKwh.default,
      INPUT_LIMITS.electricityKwh.min,
      INPUT_LIMITS.electricityKwh.max
    ),
    electricitySource: ['grid', 'solar', 'mixed'].includes(partial.electricitySource ?? '')
      ? (partial.electricitySource as CalculatorInputs['electricitySource'])
      : 'grid',
    heatingTherms: clamp(
      partial.heatingTherms ?? INPUT_LIMITS.heatingTherms.default,
      INPUT_LIMITS.heatingTherms.min,
      INPUT_LIMITS.heatingTherms.max
    ),
    vehicleType: ['petrol', 'diesel', 'ev', 'none', 'twoWheeler'].includes(partial.vehicleType ?? '')
      ? (partial.vehicleType as CalculatorInputs['vehicleType'])
      : 'petrol',
    publicTransitMode: ['bus', 'metro'].includes(partial.publicTransitMode ?? '')
      ? (partial.publicTransitMode as CalculatorInputs['publicTransitMode'])
      : 'bus',
    weeklyKm: clamp(
      partial.weeklyKm ?? INPUT_LIMITS.weeklyKm.default,
      INPUT_LIMITS.weeklyKm.min,
      INPUT_LIMITS.weeklyKm.max
    ),
    shortFlights: clamp(
      partial.shortFlights ?? INPUT_LIMITS.shortFlights.default,
      INPUT_LIMITS.shortFlights.min,
      INPUT_LIMITS.shortFlights.max
    ),
    longFlights: clamp(
      partial.longFlights ?? INPUT_LIMITS.longFlights.default,
      INPUT_LIMITS.longFlights.min,
      INPUT_LIMITS.longFlights.max
    ),
    dietType: ['heavy-meat', 'low-meat', 'vegetarian', 'vegan'].includes(partial.dietType ?? '')
      ? (partial.dietType as CalculatorInputs['dietType'])
      : 'low-meat',
    monthlySpend: clamp(
      partial.monthlySpend ?? INPUT_LIMITS.monthlySpend.default,
      INPUT_LIMITS.monthlySpend.min,
      INPUT_LIMITS.monthlySpend.max
    ),
    recycling: typeof partial.recycling === 'boolean' ? partial.recycling : false,
  };
}
