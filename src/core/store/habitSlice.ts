/**
 * @fileoverview Zustand slice for the habit tracking and gamification feature.
 * Manages task completion, eco points, streaks, badges, and level evaluation
 * by delegating session scoring to the habitTracker intelligence service.
 */

import type { StateCreator } from 'zustand';
import type { AppState, HabitSliceActions, HabitSliceState, HabitState } from '../../types';
import { evaluateSession as evaluateHabitSession } from '../../services/intelligence/habitTracker';

/** Initial (empty) state for a user with no habit history. */
const DEFAULT_HABIT_STATE: HabitState = {
  completedTaskIds: [],
  totalSuggested: 0,
  ecoPoints: 0,
  ecoLevel: 'Beginner',
  currentStreak: 0,
  longestStreak: 0,
  badges: [],
};

/**
 * Zustand StateCreator for the habit slice.
 * Provides actions to complete/uncomplete tasks (adjusting eco points),
 * add badges, set the total suggested count, trigger session evaluation, and reset all habits.
 */
export const createHabitSlice: StateCreator<
  AppState,
  [],
  [],
  HabitSliceState & HabitSliceActions
> = (set, get) => ({
  habits: DEFAULT_HABIT_STATE,

  completeTask: (id) =>
    set((state) => {
      if (state.habits.completedTaskIds.includes(id)) return state;
      
      const rec = state.recommendations.find(r => r.id === id);
      const points = rec ? rec.impactKg : 10; // 10 base points if not found
      
      const newHabits = { 
        ...state.habits, 
        completedTaskIds: [...state.habits.completedTaskIds, id],
        ecoPoints: state.habits.ecoPoints + points
      };
      
      return { habits: evaluateHabitSession(newHabits) };
    }),

  uncompleteTask: (id) =>
    set((state) => {
      if (!state.habits.completedTaskIds.includes(id)) return state;

      const rec = state.recommendations.find(r => r.id === id);
      const points = rec ? rec.impactKg : 10;

      const newHabits = {
        ...state.habits,
        completedTaskIds: state.habits.completedTaskIds.filter((t) => t !== id),
        ecoPoints: Math.max(0, state.habits.ecoPoints - points)
      };

      return { habits: evaluateHabitSession(newHabits) };
    }),

  setTotalSuggested: (count) =>
    set((state) => ({ habits: { ...state.habits, totalSuggested: count } })),

  addBadge: (badge) =>
    set((state) => {
      if (state.habits.badges.includes(badge)) return state;
      return { habits: { ...state.habits, badges: [...state.habits.badges, badge] } };
    }),

  evaluateSession: () => {
    const current = get().habits;
    set({ habits: evaluateHabitSession(current) });
  },

  resetHabits: () => set({ habits: DEFAULT_HABIT_STATE }),
});
