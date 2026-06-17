import { expect, test, describe } from 'vitest';
import { clamp, sanitizeText, validateInputs } from '../core/validation';

describe('Validation', () => {
  describe('clamp', () => {
    test('keeps value within range', () => {
      expect(clamp(5, 1, 10)).toBe(5);
    });

    test('clamps below min', () => {
      expect(clamp(-5, 1, 10)).toBe(1);
    });

    test('clamps above max', () => {
      expect(clamp(15, 1, 10)).toBe(10);
    });

    test('handles non-finite values', () => {
      expect(clamp(NaN, 1, 10)).toBe(1);
      expect(clamp(Infinity, 1, 10)).toBe(1);
      expect(clamp(-Infinity, 1, 10)).toBe(1);
    });
  });

  describe('sanitizeText', () => {
    test('removes script tags', () => {
      expect(sanitizeText('<script>alert("xss")</script>Hello')).toBe('Hello');
    });

    test('removes attributes', () => {
      expect(sanitizeText('<div onclick="bad()">Hello</div>')).toBe('Hello');
    });

    test('handles non-strings safely', () => {
      expect(sanitizeText(null as unknown as string)).toBe('');
      expect(sanitizeText(undefined as unknown as string)).toBe('');
    });
  });

  describe('validateInputs', () => {
    test('applies defaults to empty partial', () => {
      const result = validateInputs({});
      expect(result.country).toBe('Global Average');
      expect(result.householdSize).toBe(1);
      expect(result.vehicleType).toBe('petrol');
    });

    test('clamps out-of-bounds inputs', () => {
      const result = validateInputs({ householdSize: 50, shortFlights: -10 });
      expect(result.householdSize).toBe(20);
      expect(result.shortFlights).toBe(0);
    });

    test('validates newly added vehicle types', () => {
      expect(validateInputs({ vehicleType: 'bus' }).vehicleType).toBe('bus');
      expect(validateInputs({ vehicleType: 'metro' }).vehicleType).toBe('metro');
      expect(validateInputs({ vehicleType: 'twoWheeler' }).vehicleType).toBe('twoWheeler');
    });

    test('resets invalid enums to default', () => {
      expect(validateInputs({ vehicleType: 'spaceship' as never }).vehicleType).toBe('petrol');
      expect(validateInputs({ electricitySource: 'nuclear' as never }).electricitySource).toBe('grid');
    });
  });
});
