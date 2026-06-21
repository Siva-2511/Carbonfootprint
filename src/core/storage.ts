export const SCHEMA_VERSION = 1;

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

export function readStorage<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

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
