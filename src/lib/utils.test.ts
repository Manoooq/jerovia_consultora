import { describe, it, expect } from 'vitest';
import { formatCurrency } from './utils';

describe('formatCurrency', () => {
  it('formats positive numbers correctly', () => {
    expect(formatCurrency(1000)).toBe('Gs.\u00a01.000');
  });

  it('formats zero correctly', () => {
    expect(formatCurrency(0)).toBe('Gs.\u00a00');
  });

  it('formats negative numbers correctly', () => {
    expect(formatCurrency(-1000)).toBe('Gs.\u00a0-1.000');
  });

  it('formats large numbers correctly', () => {
    expect(formatCurrency(1000000)).toBe('Gs.\u00a01.000.000');
  });

  it('rounds decimal numbers correctly', () => {
    expect(formatCurrency(1000.5)).toBe('Gs.\u00a01.001');
    expect(formatCurrency(1000.4)).toBe('Gs.\u00a01.000');
  });
});
