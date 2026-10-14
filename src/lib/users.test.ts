import { describe, it, expect } from 'vitest';
import { obtenerUsuarioPorId } from './users';

describe('obtenerUsuarioPorId', () => {
  it('should return the correct user for a valid ID', () => {
    const userId = 'usr_admin_01';
    const user = obtenerUsuarioPorId(userId);

    expect(user).toBeDefined();
    expect(user?.id).toBe(userId);
    expect(user?.username).toBe('admin');
    expect(user?.role).toBe('admin');
  });

  it('should return undefined for an invalid ID', () => {
    const userId = 'non_existent_user_id';
    const user = obtenerUsuarioPorId(userId);

    expect(user).toBeUndefined();
  });
});
