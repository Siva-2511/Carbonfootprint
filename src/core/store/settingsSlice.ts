/**
 * @fileoverview Zustand slice for user application settings.
 * Manages theme, language, ELI-10 mode, AI coach persona, and currency override preferences.
 */

import type { StateCreator } from 'zustand';
import type { AppState, AppSettings, CoachPersona, Language, SettingsSliceActions, SettingsSliceState, Theme } from '../../types';

/** Default application settings applied on first launch. */
const DEFAULT_SETTINGS: AppSettings = {
  theme: 'dark',
  eli10Mode: false,
  language: 'en',
  coachPersona: 'friendly',
};

/**
 * Zustand StateCreator for the settings slice.
 * Provides actions to update theme, toggle ELI-10 mode, change language,
 * switch AI coach persona, and override the display currency.
 */
export const createSettingsSlice: StateCreator<
  AppState,
  [],
  [],
  SettingsSliceState & SettingsSliceActions
> = (set) => ({
  settings: DEFAULT_SETTINGS,

  setTheme: (theme: Theme) =>
    set((state) => ({ settings: { ...state.settings, theme } })),

  toggleEli10: () =>
    set((state) => ({ settings: { ...state.settings, eli10Mode: !state.settings.eli10Mode } })),

  setLanguage: (language: Language) =>
    set((state) => ({ settings: { ...state.settings, language } })),

  setCoachPersona: (coachPersona: CoachPersona) =>
    set((state) => ({ settings: { ...state.settings, coachPersona } })),

  setCurrencyOverride: (currencyOverride: string | null) =>
    set((state) => ({ settings: { ...state.settings, currencyOverride } })),
});
