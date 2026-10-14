import fs from "fs";
import { registrarEventoAuditoria, listarEventosAuditoria } from "./audit";

jest.mock("fs");

describe("audit", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("registrarEventoAuditoria", () => {
    it("should successfully register an audit event and persist it", () => {
      const mockEvent = {
        userId: "usr_test_01",
        userName: "Test User",
        userRole: "tester",
        action: "LOGIN" as const,
        detail: "Test login",
        ip: "127.0.0.1",
      };

      const result = registrarEventoAuditoria(mockEvent);

      expect(result).toMatchObject({
        ...mockEvent,
      });
      expect(result.id).toMatch(/^aud_[a-f0-9]{8}$/);
      expect(result.timestamp).toBeDefined();

      expect(fs.writeFileSync).toHaveBeenCalled();

      // Check the latest cached events
      const events = listarEventosAuditoria(1);
      expect(events[0]).toEqual(result);
    });

    it("should correctly update the cache and write to disk", () => {
        const mockEvent = {
            userId: "usr_test_02",
            userName: "Test User 2",
            userRole: "tester",
            action: "LOGOUT" as const,
            detail: "Test logout",
        };

        const result = registrarEventoAuditoria(mockEvent);

        const writeFileSyncMock = fs.writeFileSync as jest.Mock;
        expect(writeFileSyncMock).toHaveBeenCalled();

        // Ensure the written content contains our new event
        const writtenDataStr = writeFileSyncMock.mock.calls[0][1];
        const writtenData = JSON.parse(writtenDataStr);
        expect(writtenData[0]).toEqual(result);
    });
  });
});
