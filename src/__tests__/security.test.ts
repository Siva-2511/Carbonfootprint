import { expect, test, describe, vi, beforeEach } from 'vitest';
import { runSecurityAudit } from '../core/security';

describe('Security Audit', () => {
  beforeEach(() => {
    // Reset mocks
    vi.restoreAllMocks();
    localStorage.clear();
    (window as unknown as { __ERROR_BOUNDARY_MOUNTED__: boolean | undefined }).__ERROR_BOUNDARY_MOUNTED__ = undefined;
    
    // Mock import.meta.env
    vi.stubEnv('VITE_API_URL', 'http://localhost:3001/api/chat');
    
    // Mock fetch
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ csp: true })
    });
  });

  test('returns secure status when everything is healthy', async () => {
    (window as unknown as { __ERROR_BOUNDARY_MOUNTED__: boolean }).__ERROR_BOUNDARY_MOUNTED__ = true;
    document.head.innerHTML = '<meta http-equiv="Content-Security-Policy" content="default-src \'self\'">';

    const result = await runSecurityAudit();
    
    expect(result.inputValidationActive).toBe(true);
    expect(result.storageSanitized).toBe(true);
    expect(result.errorBoundaryActive).toBe(true);
    expect(result.apiKeySecured).toBe(true);
    expect(result.cspEnabled).toBe(true);
    expect(result.overallStatus).toBe('secure');
  });

  test('returns warning when storage has XSS', async () => {
    (window as unknown as { __ERROR_BOUNDARY_MOUNTED__: boolean }).__ERROR_BOUNDARY_MOUNTED__ = true;
    document.head.innerHTML = '<meta http-equiv="Content-Security-Policy" content="default-src \'self\'">';
    localStorage.setItem('badKey', '<script>alert("xss")</script>');

    const result = await runSecurityAudit();
    
    expect(result.storageSanitized).toBe(false);
    expect(result.overallStatus).toBe('warning');
  });

  test('returns warning when error boundary is not mounted', async () => {
    document.head.innerHTML = '<meta http-equiv="Content-Security-Policy" content="default-src \'self\'">';

    const result = await runSecurityAudit();
    
    expect(result.errorBoundaryActive).toBe(false);
    expect(result.overallStatus).toBe('warning');
  });

  test('returns warning when geminiApiKey is exposed in root localstorage', async () => {
    (window as unknown as { __ERROR_BOUNDARY_MOUNTED__: boolean }).__ERROR_BOUNDARY_MOUNTED__ = true;
    document.head.innerHTML = '<meta http-equiv="Content-Security-Policy" content="default-src \'self\'">';
    localStorage.setItem('geminiApiKey', 'sk-or-v1-...');

    const result = await runSecurityAudit();
    
    expect(result.apiKeySecured).toBe(false);
    expect(result.overallStatus).toBe('warning');
  });
});
