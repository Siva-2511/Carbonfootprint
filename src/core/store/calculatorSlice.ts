/**
 * @fileoverview Zustand slice for the carbon footprint calculator feature.
 * Manages calculator inputs, computed results, Carbon DNA persona, recommendations, and history.
 */

import type { StateCreator } from 'zustand';
import type {
  AppState,
  CalculatorInputs,
  CalculatorSliceActions,
  CalculatorSliceState,
} from '../../types';
import { INPUT_LIMITS } from '../../config';

/** Default calculator input values used on first load and after a reset. */
const DEFAULT_INPUTS: CalculatorInputs = {
  country: 'India',
  householdSize: 1,
  acHours: 0,
  publicTransportKm: 0,
  publicTransitMode: 'bus',
  electricityKwh: INPUT_LIMITS.electricityKwh.default,
  electricitySource: 'grid',
  heatingTherms: INPUT_LIMITS.heatingTherms.default,
  lpgCylinders: 0,
  vehicleType: 'petrol',
  weeklyKm: INPUT_LIMITS.weeklyKm.default,
  shortFlights: INPUT_LIMITS.shortFlights.default,
  longFlights: INPUT_LIMITS.longFlights.default,
  dietType: 'low-meat',
  monthlySpend: INPUT_LIMITS.monthlySpend.default,
  recycling: false,
};

/**
 * Zustand StateCreator for the calculator slice.
 * Provides state for inputs, result, DNA persona, recommendations, and history,
 * plus actions to update inputs, store pipeline results, and reset the calculator.
 */
export const createCalculatorSlice: StateCreator<
  AppState,
  [],
  [],
  CalculatorSliceState & CalculatorSliceActions
> = (set) => ({
  inputs: DEFAULT_INPUTS,
  result: null,
  dna: null,
  recommendations: [],
  history: [],

  setInputs: (partial) =>
    set((state) => ({ inputs: { ...state.inputs, ...partial } })),

  setPipelineResult: ({ result, dna, recommendations, history }) =>
    set({ result, dna, recommendations, history }),

  resetCalculator: () =>
    set({ inputs: DEFAULT_INPUTS, result: null, dna: null, recommendations: [], history: [] }),
});
