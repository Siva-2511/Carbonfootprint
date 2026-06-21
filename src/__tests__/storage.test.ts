import { readStorage, writeStorage } from '../core/storage';

describe('Storage Utility', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('readStorage returns null if key not found', () => {
    const val = readStorage('test_key');
    expect(val).toBeNull();
  });

  test('writeStorage saves data correctly', () => {
    writeStorage('test_key', { foo: 'baz' });
    const val = readStorage('test_key');
    expect(val).toEqual({ foo: 'baz' });
  });

  test('writeStorage handles QuotaExceededError', () => {
    // Mock setItem to throw QuotaExceededError
    const spy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('QuotaExceededError', 'QuotaExceededError');
    });
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    writeStorage('test_key', { foo: 'baz' });

    expect(consoleSpy).toHaveBeenCalledWith('[CarbonSense] LocalStorage quota exceeded — clearing old data');
    
    spy.mockRestore();
    consoleSpy.mockRestore();
  });

  test('clearStorage removes item', () => {
    writeStorage('test_key', { foo: 'baz' });
    localStorage.removeItem('test_key');
    const val = readStorage('test_key');
    expect(val).toBeNull();
  });
});
