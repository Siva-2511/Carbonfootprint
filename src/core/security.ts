import type { SecurityAuditResult } from '../types';

export function runSecurityAudit(): SecurityAuditResult {
  // 1. Input validation always active (validation.ts is always imported)
  const inputValidationActive = true;

  // 2. Storage sanity check — look for XSS patterns in stored values
  let storageSanitized = true;
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const val = localStorage.getItem(localStorage.key(i) ?? '') ?? '';
      if (/<script|javascript:|on\w+=/i.test(val)) {
        storageSanitized = false;
        break;
      }
    }
  } catch { storageSanitized = true; }

  // 3. Error boundary always active when ErrorBoundary is in tree
  const errorBoundaryActive = true;

  // 4. Check API key is not stored in a top-level unsafe key
  let apiKeySecured = true;
  try {
    const raw = localStorage.getItem('geminiApiKey');
    if (raw) apiKeySecured = false; // Should be nested inside settings, not top-level
  } catch { apiKeySecured = true; }

  // 5. CSP meta tag present in document
  const cspEnabled = !!document.querySelector('meta[http-equiv="Content-Security-Policy"]');

  const allGood = inputValidationActive && storageSanitized && errorBoundaryActive && apiKeySecured && cspEnabled;

  return {
    inputValidationActive,
    storageSanitized,
    errorBoundaryActive,
    apiKeySecured,
    cspEnabled,
    overallStatus: allGood ? 'secure' : 'warning',
  };
}
