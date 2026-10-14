import { describe, it, expect } from "vitest";
import { signAuthToken, verifyAuthToken } from "./auth";

describe("signAuthToken and verifyAuthToken", () => {
  it("should create a token in the format payload.signature", async () => {
    const payload = { userId: "user_123", role: "admin" };
    const token = await signAuthToken(payload);

    expect(typeof token).toBe("string");

    const parts = token.split(".");
    expect(parts.length).toBe(2);

    expect(parts[0].length).toBeGreaterThan(0);
    expect(parts[1].length).toBeGreaterThan(0);
  });

  it("should be able to verify a token that it just signed", async () => {
    const payload = { userId: "user_456", role: "evaluator" };
    const token = await signAuthToken(payload);

    const verified = await verifyAuthToken(token);
    expect(verified).not.toBeNull();
    expect(verified?.userId).toBe("user_456");
    expect(verified?.role).toBe("evaluator");
  });

  it("should return null when verifying an invalid token structure", async () => {
    const verified = await verifyAuthToken("invalidtokenwithoutdot");
    expect(verified).toBeNull();
  });

  it("should return null when verifying a token with an invalid signature", async () => {
    const payload = { userId: "user_123", role: "admin" };
    const token = await signAuthToken(payload);

    // Tamper with the signature
    const parts = token.split(".");
    const tamperedToken = `${parts[0]}.${parts[1].substring(0, parts[1].length - 1)}x`;

    const verified = await verifyAuthToken(tamperedToken);
    expect(verified).toBeNull();
  });

  it("should return null when verifying a token with a tampered payload", async () => {
    const payload = { userId: "user_123", role: "admin" };
    const token = await signAuthToken(payload);

    // Tamper with the payload part
    const parts = token.split(".");
    const tamperedPayload = Buffer.from(JSON.stringify({ userId: "user_123", role: "superadmin" })).toString("base64url");
    const tamperedToken = `${tamperedPayload}.${parts[1]}`;

    const verified = await verifyAuthToken(tamperedToken);
    expect(verified).toBeNull();
  });
});
