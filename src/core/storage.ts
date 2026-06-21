/**
 * @fileoverview LocalStorage persistence helpers for CarbonSense.
 * Provides type-safe read/write wrappers and a schema validator that guards
 * against corrupted or outdated persisted state.
 */

/** The current schema version stored in persisted data; increment on breaking state shape changes. */
export const SCHEMA_VERSION = 1;

/**
 * Validates that rehydrated localStorage data has the correct shape.
 * Checks for required top-level keys and validates inputs, settings, and habits sub-objects.
 * @param data - The raw parsed object from localStorage to validate.
 * @returns `true` if the data conforms to the expected schema, `false` otherwise.
 */
export function validateSchema(data: unknown): boolean {
  if (!data || typeof data !== 'object') return false;
  const d = data as Record<string, unknown>;

  // Required top-level keys
  const requiredKeys = ['inputs', 'habits', 'settings'];
  for (const key of requiredKeys) {
    if (!(key in d)) return false;
  }

  // Validate inputs shape
  const inputs = d.inputs as Record<string, unknown>;
  if (typeof inputs !== 'object' || inputs === null) return false;
  if (typeof inputs.electricityKwh !== 'number') return false;
  if (typeof inputs.weeklyKm !== 'number') return false;

  // Validate settings shape
  const settings = d.settings as Record<string, unknown>;
  if (typeof settings !== 'object' || settings === null) return false;
  if (!['dark', 'light'].includes(settings.theme as string)) return false;

  // Validate habits shape
  const habits = d.habits as Record<string, unknown>;
  if (typeof habits !== 'object' || habits === null) return false;
  if (!Array.isArray(habits.completedTaskIds)) return false;
  if (typeof habits.currentStreak !== 'number') return false;

  return true;
}

/**
 * Safely reads and parses a localStorage key. Returns null on failure.
 * @param key - The localStorage key to read.
 * @returns The parsed value cast to T, or null if the key is missing or parsing fails.
 */
export function readStorage<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

/**
 * Safely writes to localStorage, handling QuotaExceededError.
 * Removes the key and warns to console when storage quota is exceeded.
 * @param key - The localStorage key to write to.
 * @param value - The value to serialize as JSON and store.
 * @returns `true` if the write succeeded, `false` on any error.
 */
export function writeStorage(key: string, value: unknown): boolean {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (e) {
    if (e instanceof DOMException && e.name === 'QuotaExceededError') {
      console.warn('[CarbonSense] LocalStorage quota exceeded — clearing old data');
      localStorage.removeItem(key);
    }
    return false;
  }
}
