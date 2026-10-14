import { describe, it, expect } from 'vitest';
import { hashPassword } from './users';

describe('hashPassword', () => {
  it('should generate a random salt and return a hash when no salt is provided', async () => {
    const password = 'mySuperSecretPassword123';
    const result = await hashPassword(password);

    expect(result).toHaveProperty('hash');
    expect(result).toHaveProperty('salt');
    expect(result.salt).toBeDefined();
    expect(result.hash).toBeDefined();
    expect(typeof result.salt).toBe('string');
    expect(typeof result.hash).toBe('string');

    // A generated UUID v4 without hyphens has 32 characters
    expect(result.salt.length).toBe(32);
    // SHA-256 hex string has 64 characters
    expect(result.hash.length).toBe(64);
  });

  it('should use the provided salt when one is passed', async () => {
    const password = 'mySuperSecretPassword123';
    const customSalt = 'myCustomSalt123';
    const result = await hashPassword(password, customSalt);

    expect(result.salt).toBe(customSalt);
  });

  it('should produce the same hash given the same password and salt (determinism)', async () => {
    const password = 'mySuperSecretPassword123';
    const salt = 'myCustomSalt123';

    const result1 = await hashPassword(password, salt);
    const result2 = await hashPassword(password, salt);

    expect(result1.hash).toBe(result2.hash);
    expect(result1.salt).toBe(result2.salt);
  });

  it('should produce different hashes for the same password but different salts', async () => {
    const password = 'mySuperSecretPassword123';

    const result1 = await hashPassword(password, 'salt1');
    const result2 = await hashPassword(password, 'salt2');

    expect(result1.hash).not.toBe(result2.hash);
  });

  it('should produce different hashes for different passwords with the same salt', async () => {
    const salt = 'sameSalt';

    const result1 = await hashPassword('password123', salt);
    const result2 = await hashPassword('password456', salt);

    expect(result1.hash).not.toBe(result2.hash);
  });

  it('should handle empty password string correctly', async () => {
    const password = '';
    const salt = 'someSalt';

    const result = await hashPassword(password, salt);

    expect(result.hash).toBeDefined();
    expect(result.hash.length).toBe(64);

    // Deterministic check for empty string
    const result2 = await hashPassword(password, salt);
    expect(result.hash).toBe(result2.hash);
  });
});
