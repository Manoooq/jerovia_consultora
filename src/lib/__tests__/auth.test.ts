import { describe, it, expect } from "vitest";
import { signAuthToken } from "../auth";

describe("auth", () => {
  describe("signAuthToken", () => {
    it("should generate a token in the format payload.signature", async () => {
      const payload = { userId: "123", role: "admin" };
      const token = await signAuthToken(payload as Record<string, unknown>);

      // Token should be a string
      expect(typeof token).toBe("string");

      // Token should contain exactly one dot separating payload and signature
      const parts = token.split(".");
      expect(parts.length).toBe(2);

      const [b64Payload, b64Sig] = parts;

      // Ensure both parts are non-empty strings
      expect(typeof b64Payload).toBe("string");
      expect(b64Payload.length).toBeGreaterThan(0);
      expect(typeof b64Sig).toBe("string");
      expect(b64Sig.length).toBeGreaterThan(0);
    });

    it("should encode the payload correctly in base64url", async () => {
      const payload = { userId: "456", role: "evaluador", timestamp: 1234567890 };
      const token = await signAuthToken(payload as Record<string, unknown>);

      const parts = token.split(".");
      const b64Payload = parts[0];

      // Decode base64url manually
      const decodedStr = Buffer.from(b64Payload, "base64url").toString("utf-8");
      const decodedPayload = JSON.parse(decodedStr);

      // It should match the original payload
      expect(decodedPayload).toEqual(payload);
    });

    it("should generate a deterministic signature for the same payload and secret", async () => {
      const payload = { userId: "789", role: "user" };
      const token1 = await signAuthToken(payload as Record<string, unknown>);
      const token2 = await signAuthToken(payload as Record<string, unknown>);

      expect(token1).toEqual(token2);
    });

    it("should generate different signatures for different payloads", async () => {
      const payload1 = { userId: "789", role: "user" };
      const payload2 = { userId: "789", role: "admin" };

      const token1 = await signAuthToken(payload1 as Record<string, unknown>);
      const token2 = await signAuthToken(payload2 as Record<string, unknown>);

      expect(token1).not.toEqual(token2);
    });
  });
});
