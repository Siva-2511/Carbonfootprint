import { useCallback } from 'react';
import { useStore } from '../core/store';
import { calculate } from '../services/core/carbonCalculator';
import { classify } from '../services/intelligence/dnaClassifier';
import { rank } from '../services/intelligence/actionPriority';
import type { CalculatorInputs } from '../types';
import { APP_CONFIG } from '../config';

/**
 * Orchestrates the full calculation pipeline.
 * UI components must use this hook instead of importing engines directly.
 */
export function useCarbonPipeline() {
  const setPipelineResult = useStore((s) => s.setPipelineResult);
  const currentHistory = useStore((s) => s.history);

  const runPipeline = useCallback(
    (inputs: CalculatorInputs) => {
      const result = calculate(inputs);
      const updatedHistory = [...currentHistory, result].slice(-APP_CONFIG.maxHistoryEntries);
      const dna = classify(result, updatedHistory);
      const recommendations = rank(result, dna);
      setPipelineResult({ result, dna, recommendations, history: updatedHistory });
    },
    [setPipelineResult, currentHistory]
  );

  return { runPipeline };
}

/** Returns true if the user has already calculated their footprint. */
export function useIsCalculated(): boolean {
  return useStore((s) => s.result !== null);
}
