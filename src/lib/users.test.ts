import { hashPassword, verifyPassword } from './users';
import { describe, it, expect } from 'vitest';

describe('verifyPassword', () => {
  it('should return true for valid password', async () => {
    const password = 'mySecretPassword123';
    const { hash, salt } = await hashPassword(password);

    const isValid = await verifyPassword(password, hash, salt);
    expect(isValid).toBe(true);
  });

  it('should return false for invalid password', async () => {
    const password = 'mySecretPassword123';
    const wrongPassword = 'mySecretPassword124';
    const { hash, salt } = await hashPassword(password);

    const isValid = await verifyPassword(wrongPassword, hash, salt);
    expect(isValid).toBe(false);
  });

  it('should return false for incorrect salt', async () => {
    const password = 'mySecretPassword123';
    const { hash } = await hashPassword(password);

    const isValid = await verifyPassword(password, hash, 'wrong-salt');
    expect(isValid).toBe(false);
  });

  it('should return false for incorrect hash', async () => {
    const password = 'mySecretPassword123';
    const { hash, salt } = await hashPassword(password);
    const wrongHash = hash === 'a'.repeat(64) ? 'b'.repeat(64) : 'a'.repeat(64);

    const isValid = await verifyPassword(password, wrongHash, salt);
    expect(isValid).toBe(false);
  });
});
