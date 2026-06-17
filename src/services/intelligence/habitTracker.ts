import type { HabitState } from '../../types';

export const ECO_LEVELS = [
  { threshold: 0, title: 'Beginner', badge: '🌱' },
  { threshold: 500, title: 'Eco Aware', badge: '🌍' },
  { threshold: 1500, title: 'Green Contributor', badge: '⚡' },
  { threshold: 3000, title: 'Climate Champion', badge: '🏆' },
  { threshold: 5000, title: 'Net-Zero Hero', badge: '🌟' },
];

export const BADGE_THRESHOLDS = [
  { points: 100, badge: 'getting-started' },
  { points: 1000, badge: 'action-taker' },
  { points: 2500, badge: 'impact-maker' },
  { points: 5000, badge: 'carbon-neutral' },
];

/**
 * Calculates current level based on total points
 */
export function calculateEcoLevel(points: number): string {
  let currentLevel = ECO_LEVELS[0].title;
  for (const level of ECO_LEVELS) {
    if (points >= level.threshold) {
      currentLevel = level.title;
    }
  }
  return currentLevel;
}

/**
 * Pure function: evaluates points and unlocks
 */
export function evaluateSession(state: HabitState): HabitState {
  // Check badge unlocks
  const newBadges = [...state.badges];
  BADGE_THRESHOLDS.forEach(({ points, badge }) => {
    if (state.ecoPoints >= points && !newBadges.includes(badge)) {
      newBadges.push(badge);
    }
  });

  return {
    ...state,
    ecoLevel: calculateEcoLevel(state.ecoPoints),
    badges: newBadges,
  };
}
/** Points-based system has no recovery mode */
export function isInRecoveryMode(): boolean {
  return false;
}
