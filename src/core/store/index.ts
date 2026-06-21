/**
 * @fileoverview Zustand store root for CarbonSense.
 * Combines all feature slices (calculator, habits, chat, settings) into a single
 * persisted store with schema validation on rehydration and automatic migration support.
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AppState } from '../../types';
import { APP_CONFIG } from '../../config';
import { createCalculatorSlice } from './calculatorSlice';
import { createHabitSlice } from './habitSlice';
import { createChatSlice } from './chatSlice';
import { createSettingsSlice } from './settingsSlice';
import { validateSchema } from '../storage';

/**
 * The global Zustand store hook for the CarbonSense application.
 * Persists essential state to localStorage under the key `carbonsense-v1`.
 * Validates schema integrity on rehydration and migrates across schema versions.
 */
export const useStore = create<AppState>()(
  persist(
    (...args) => ({
      ...createCalculatorSlice(...args),
      ...createHabitSlice(...args),
      ...createChatSlice(...args),
      ...createSettingsSlice(...args),
    }),
    {
      name: 'carbonsense-v1',
      version: APP_CONFIG.schemaVersion,

      // Only persist essential state — not transient UI state
      partialize: (state) => ({
        inputs: state.inputs,
        result: state.result,
        dna: state.dna,
        recommendations: state.recommendations,
        history: state.history.slice(-APP_CONFIG.maxHistoryEntries),
        habits: state.habits,
        messages: state.messages.slice(-APP_CONFIG.maxChatMessages),
        settings: state.settings,
      }),

      // Migrate old schema versions
      migrate: (persisted: unknown, version: number) => {
        if (version === 0) {
          // v0 → v1: no migration needed for initial release
          return persisted as AppState;
        }
        return persisted as AppState;
      },

      // Validate schema on rehydration
      onRehydrateStorage: () => (state, error) => {
        if (error) {
          console.warn('[CarbonSense] Storage rehydration error — resetting to defaults');
          return;
        }
        if (state && !validateSchema(state)) {
          console.warn('[CarbonSense] Invalid storage schema — resetting to defaults');
          localStorage.removeItem('carbonsense-v1');
          window.location.reload();
        }
      },
    }
  )
);
