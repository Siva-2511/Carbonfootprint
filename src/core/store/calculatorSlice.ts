import type { StateCreator } from 'zustand';
import type {
  AppState,
  CalculatorInputs,
  CalculatorSliceActions,
  CalculatorSliceState,
} from '../../types';
import { INPUT_LIMITS } from '../../config';

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
