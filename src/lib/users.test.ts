import { describe, it, expect } from 'vitest';
import { generarContrasenaSegura } from './users';

describe('generarContrasenaSegura', () => {
  it('should start with the prefix "Jv-"', () => {
    const password = generarContrasenaSegura();
    expect(password.startsWith('Jv-')).toBe(true);
  });

  it('should have a total length of 12 characters', () => {
    const password = generarContrasenaSegura();
    expect(password.length).toBe(12);
  });

  it('should contain only allowed characters in the random part', () => {
    const password = generarContrasenaSegura();
    const randomPart = password.substring(3);
    const allowedCharsRegex = /^[abcdefghjkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ23456789!@#$%*]+$/;
    expect(randomPart).toMatch(allowedCharsRegex);
  });

  it('should generate different passwords on subsequent calls', () => {
    const passwordOne = generarContrasenaSegura();
    const passwordTwo = generarContrasenaSegura();
    expect(passwordOne).not.toBe(passwordTwo);
  });
});
