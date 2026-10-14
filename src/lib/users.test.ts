import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { cambiarContrasena, crearUsuario, verificarCredenciales, eliminarUsuario } from "./users";

describe("cambiarContrasena", () => {
  let userId: string;
  const originalPassword = "OriginalPassword123";
  const newPassword = "NewPassword456";
  const username = "testuser_cambiar_pass";

  beforeAll(async () => {
    // 1. Seed a user
    const user = await crearUsuario({
      username: username,
      email: "testuser_cambiar_pass@example.com",
      name: "Test User",
      role: "evaluador",
      password: originalPassword
    });
    userId = user.id;
  });

  afterAll(() => {
    // Clean up the created user
    if (userId) {
      eliminarUsuario(userId);
    }
  });

  it("debería retornar false para un usuario inexistente", async () => {
    const success = await cambiarContrasena("user_no_existe", newPassword);
    expect(success).toBe(false);
  });

  it("debería permitir cambiar la contraseña y autenticar con la nueva", async () => {
    // 1. Verify original password works
    const authBefore = await verificarCredenciales(username, originalPassword);
    expect(authBefore).not.toBeNull();
    expect(authBefore?.id).toBe(userId);

    // 2. Change password
    const success = await cambiarContrasena(userId, newPassword);
    expect(success).toBe(true);

    // 3. Verify old password no longer works
    const authOld = await verificarCredenciales(username, originalPassword);
    expect(authOld).toBeNull();

    // 4. Verify new password works
    const authNew = await verificarCredenciales(username, newPassword);
    expect(authNew).not.toBeNull();
    expect(authNew?.id).toBe(userId);
  });
});
