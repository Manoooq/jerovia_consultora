import { describe, it, expect } from 'vitest';
import { generateToken } from './utils';

describe('generateToken', () => {
  it('should generate a token of default length 32', () => {
    const token = generateToken();
    expect(token).toHaveLength(32);
  });

  it('should generate a token of custom length', () => {
    expect(generateToken(16)).toHaveLength(16);
    expect(generateToken(64)).toHaveLength(64);
  });

  it('should only contain alphanumeric characters', () => {
    const token = generateToken(100); // Generate a long token to be more thorough
    const alphanumericRegex = /^[a-zA-Z0-9]+$/;
    expect(token).toMatch(alphanumericRegex);
  });

  it('should generate different tokens on consecutive calls', () => {
    const token1 = generateToken();
    const token2 = generateToken();
    expect(token1).not.toBe(token2);
  });

  it('should handle edge cases like length 0', () => {
    expect(generateToken(0)).toBe('');
  });

  it('should handle negative lengths by returning an empty string', () => {
    expect(generateToken(-5)).toBe('');
  });
});
