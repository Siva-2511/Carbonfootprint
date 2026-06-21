import type { StateCreator } from 'zustand';
import type { AppState, AppSettings, CoachPersona, Language, SettingsSliceActions, SettingsSliceState, Theme } from '../../types';

const DEFAULT_SETTINGS: AppSettings = {
  theme: 'dark',
  eli10Mode: false,
  language: 'en',
  coachPersona: 'friendly',
};

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
