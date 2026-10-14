import { describe, it, expect } from 'vitest';
import { formatDate } from '../utils';

describe('formatDate', () => {
  it('formats standard YYYY-MM-DD date to DD/MM/YYYY', () => {
    expect(formatDate('2023-12-25')).toBe('25/12/2023');
  });

  it('returns empty string when given empty input', () => {
    expect(formatDate('')).toBe('');
  });

  it('returns empty string when given undefined', () => {
    // @ts-expect-error - testing invalid input
    expect(formatDate(undefined)).toBe('');
  });

  it('returns empty string when given null', () => {
    // @ts-expect-error - testing invalid input
    expect(formatDate(null)).toBe('');
  });

  it('handles single-digit month and day correctly without adding zeros', () => {
    expect(formatDate('2024-5-9')).toBe('9/5/2024');
  });

  it('preserves leading zeros for month and day', () => {
    expect(formatDate('2024-05-09')).toBe('09/05/2024');
  });

  it('handles invalid date strings gracefully', () => {
    expect(formatDate('invalid')).toBe('undefined/undefined/invalid');
  });
});
