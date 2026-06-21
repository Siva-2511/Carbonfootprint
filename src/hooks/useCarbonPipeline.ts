import { useCallback } from 'react';
import { useStore } from '../core/store';
import { calculate } from '../services/core/carbonCalculator';
import { classify } from '../services/intelligence/dnaClassifier';
import { rank } from '../services/intelligence/actionPriority';
import type { CalculatorInputs } from '../types';
import { APP_CONFIG } from '../config';

export function useCarbonPipeline() {
  const setPipelineResult = useStore((s) => s.setPipelineResult);
  const setInputs = useStore((s) => s.setInputs);
  const currentHistory = useStore((s) => s.history);

  const runPipeline = useCallback(
    (inputs: CalculatorInputs) => {
      setInputs(inputs);
      const result = calculate(inputs);
      const updatedHistory = [...currentHistory, result].slice(-APP_CONFIG.maxHistoryEntries);
      const dna = classify(result, updatedHistory);
      const recommendations = rank(result, dna);
      setPipelineResult({ result, dna, recommendations, history: updatedHistory });
    },
    [setPipelineResult, setInputs, currentHistory]
  );

  return { runPipeline };
}

export function useIsCalculated(): boolean {
  return useStore((s) => s.result !== null);
}
