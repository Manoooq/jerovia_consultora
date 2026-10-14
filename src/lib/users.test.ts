import { obtenerUsuarioPorId } from "./users";

describe("Users module", () => {
    describe("obtenerUsuarioPorId", () => {
        it("should return the user if the user exists", () => {
            const user = obtenerUsuarioPorId("usr_admin_01");
            expect(user).toBeDefined();
            expect(user?.username).toBe("admin");
        });

        it("should return undefined if the user does not exist", () => {
            const user = obtenerUsuarioPorId("non_existent_user_id");
            expect(user).toBeUndefined();
        });
    });
});
