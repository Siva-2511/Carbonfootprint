/**
 * @fileoverview Multi-step Carbon Footprint Calculator orchestrator for the CarbonSense Profile tab.
 * Manages step-level navigation across four input steps (Energy, Transport, Diet, Lifestyle),
 * accumulates local form state, triggers the carbon pipeline on final submission, and
 * lazy-loads the DnaResult and CarbonEvolution result panels.
 */

import React, { useState, useRef } from 'react';
import { CalculatorStep1 } from './CalculatorStep1';
import { CalculatorStep2 } from './CalculatorStep2';
import { CalculatorStep3 } from './CalculatorStep3';
import { CalculatorStep4 } from './CalculatorStep4';
import { Button } from '../ui/Button';
import { useStore } from '../../core/store';
import { useCarbonPipeline, useIsCalculated } from '../../hooks/useCarbonPipeline';
import type { CalculatorInputs } from '../../types';

// Lazy-load heavy result components to improve LCP of the main calculator view
const DnaResult = React.lazy(() => import('./DnaResult').then(m => ({ default: m.DnaResult })));
const CarbonEvolution = React.lazy(() => import('./CarbonEvolution').then(m => ({ default: m.CarbonEvolution })));

// ─────────────────────────────────────────────────────────────
//  FILE 7: src/components/Profile/Calculator.tsx
// ─────────────────────────────────────────────────────────────

const STEPS = [
  { label: 'Energy', icon: '⚡' },
  { label: 'Transport', icon: '🚗' },
  { label: 'Diet', icon: '🥗' },
  { label: 'Lifestyle', icon: '🛍️' },
];

/**
 * Top-level calculator component that orchestrates the four-step carbon
 * footprint input wizard.
 *
 * Renders an accessible step-indicator nav, the active step form, Back/Next
 * navigation buttons, and — once the pipeline has run — the lazy-loaded
 * `DnaResult` and `CarbonEvolution` result panels below the form.
 */
export function Calculator() {
  const storeInputs = useStore((s) => s.inputs);
  const [currentStep, setCurrentStep] = useState(0);
  const [localInputs, setLocalInputs] = useState<CalculatorInputs>(() => ({
    ...storeInputs,
    recycling: storeInputs.recycling ?? false,
  }));
  const { runPipeline } = useCarbonPipeline();
  const isCalculated = useIsCalculated();
  const resultsRef = useRef<HTMLDivElement>(null);
  const formTopRef = useRef<HTMLDivElement>(null);

  /**
   * Merges a partial update into the local calculator inputs state.
   *
   * @param partial - Partial `CalculatorInputs` object with updated fields.
   */
  const handleUpdate = (partial: Partial<CalculatorInputs>) => {
    setLocalInputs((prev) => ({ ...prev, ...partial }));
  };

  /**
   * Advances to the next step with smooth scroll, or on the final step
   * submits all inputs to the carbon pipeline and scrolls to results.
   */
  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep((s) => s + 1);
      requestAnimationFrame(() => {
        setTimeout(() => {
          formTopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 0);
      });
    } else {
      // Final step — run pipeline
      runPipeline(localInputs);
      // Let React render the results, wait for paint, then scroll
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setTimeout(() => {
            resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }, 0);
        });
      });
    }
  };

  /**
   * Navigates back to the previous step and scrolls to the form top.
   */
  const handleBack = () => {
    setCurrentStep((s) => Math.max(0, s - 1));
    requestAnimationFrame(() => {
      setTimeout(() => {
        formTopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 0);
    });
  };

  const isLastStep = currentStep === 3;

  return (
    <div className="w-full max-w-2xl mx-auto space-y-8" ref={formTopRef}>
      {/* ── Step indicator ─────────────────────────────────── */}
      <nav aria-label="Calculator progress" className="px-2">
        <ol className="flex items-center justify-between gap-1">
          {STEPS.map((step, index) => {
            const isCompleted = index < currentStep;
            const isCurrent = index === currentStep;
            const isFuture = index > currentStep;

            return (
              <li key={step.label} className="flex items-center flex-1">
                <div className="flex flex-col items-center gap-1.5 w-full">
                  {/* Circle */}
                  <button
                    type="button"
                    onClick={() => index < currentStep && setCurrentStep(index)}
                    disabled={isFuture || isCurrent}
                    aria-label={`Step ${index + 1}: ${step.label}${isCompleted ? ' (completed)' : isCurrent ? ' (current)' : ''}`}
                    aria-current={isCurrent ? 'step' : undefined}
                    className={`
                      relative w-10 h-10 rounded-full flex items-center justify-center
                      text-sm font-bold font-display transition-all duration-300
                      focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950
                      ${isCompleted
                        ? 'bg-emerald-600 text-primary shadow-lg shadow-emerald-900/40 cursor-pointer hover:bg-emerald-500'
                        : isCurrent
                        ? 'bg-emerald-600/20 text-emerald-400 ring-2 ring-emerald-500 ring-offset-2 ring-offset-gray-950 cursor-default'
                        : 'var-bg-card text-muted cursor-not-allowed'
                      }
                    `}
                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                  >
                    {isCompleted ? (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    ) : (
                      <span aria-hidden="true">{step.icon}</span>
                    )}
                  </button>

                  {/* Label */}
                  <span
                    className={`text-xs font-medium transition-colors ${
                      isCurrent
                        ? 'text-emerald-400'
                        : isCompleted
                        ? 'text-secondary'
                        : 'text-muted'
                    }`}
                  >
                    {step.label}
                  </span>
                </div>

                {/* Connector line */}
                {index < STEPS.length - 1 && (
                  <div className="flex-1 mx-2 -mt-5">
                    <div className="h-0.5 w-full rounded-full var-bg-card">
                      <div
                        className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                        style={{ width: isCompleted ? '100%' : '0%' }}
                        aria-hidden="true"
                      />
                    </div>
                  </div>
                )}
              </li>
            );
          })}
        </ol>
      </nav>

      {/* ── Animated step content ──────────────────────────── */}
      <div
        key={currentStep}
        className="transition-all duration-300 animate-in fade-in slide-in-from-right-4"
      >
        {currentStep === 0 && (
          <CalculatorStep1 inputs={localInputs} onUpdate={handleUpdate} />
        )}
        {currentStep === 1 && (
          <CalculatorStep2 inputs={localInputs} onUpdate={handleUpdate} />
        )}
        {currentStep === 2 && (
          <CalculatorStep3 inputs={localInputs} onUpdate={handleUpdate} />
        )}
        {currentStep === 3 && (
          <CalculatorStep4 inputs={localInputs} onUpdate={handleUpdate} />
        )}
      </div>

      {/* ── Navigation buttons ─────────────────────────────── */}
      <div className="flex items-center justify-between gap-4 px-1">
        <Button
          variant="secondary"
          onClick={handleBack}
          disabled={currentStep === 0}
          aria-label="Go to previous step"
        >
          ← Back
        </Button>

        <div className="flex items-center gap-1.5" aria-hidden="true">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={`rounded-full transition-all duration-300 ${
                i === currentStep
                  ? 'w-6 h-2 bg-emerald-500'
                  : i < currentStep
                  ? 'w-2 h-2 bg-emerald-700'
                  : 'w-2 h-2 bg-white/15'
              }`}
            />
          ))}
        </div>

        <Button
          variant="primary"
          onClick={handleNext}
          aria-label={
            isLastStep
              ? 'Calculate your carbon footprint'
              : `Proceed to step ${currentStep + 2}`
          }
          size="md"
        >
          {isLastStep ? 'Calculate My Footprint 🌿' : 'Next →'}
        </Button>
      </div>

      {/* ── Results (shown after calculation) ─────────────── */}
      <div ref={resultsRef} className="scroll-mt-6">
        {isCalculated && (
          <div
            className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500"
            aria-live="polite"
            aria-atomic="false"
          >
            <React.Suspense fallback={<div className="flex justify-center p-12"><div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div></div>}>
              <DnaResult />
              <CarbonEvolution />
            </React.Suspense>
          </div>
        )}
      </div>
    </div>
  );
}


