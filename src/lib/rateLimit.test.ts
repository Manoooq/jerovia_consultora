import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { checkRateLimit } from './rateLimit';

describe('checkRateLimit', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should allow the first request', () => {
    const result = checkRateLimit('test-user-1', 10, 60000);
    expect(result).toEqual({ allowed: true, remaining: 9, retryAfterSec: 0 });
  });

  it('should decrease remaining count on subsequent requests', () => {
    checkRateLimit('test-user-2', 5, 60000);
    const result = checkRateLimit('test-user-2', 5, 60000);
    expect(result).toEqual({ allowed: true, remaining: 3, retryAfterSec: 0 });
  });

  it('should block requests when limit is reached', () => {
    const identifier = 'test-user-3';

    // Consume all requests
    for (let i = 0; i < 3; i++) {
      checkRateLimit(identifier, 3, 60000);
    }

    // Next request should be blocked
    const result = checkRateLimit(identifier, 3, 60000);

    expect(result.allowed).toBe(false);
    expect(result.remaining).toBe(0);
    expect(result.retryAfterSec).toBeGreaterThan(0);
    expect(result.retryAfterSec).toBeLessThanOrEqual(60);
  });

  it('should reset limit after the time window expires', () => {
    const identifier = 'test-user-4';
    const windowMs = 10000;

    // First request
    checkRateLimit(identifier, 2, windowMs);

    // Second request
    checkRateLimit(identifier, 2, windowMs);

    // Third request (should be blocked)
    const blockedResult = checkRateLimit(identifier, 2, windowMs);
    expect(blockedResult.allowed).toBe(false);

    // Advance time by windowMs
    vi.advanceTimersByTime(windowMs + 100);

    // Should be allowed again
    const resultAfterWait = checkRateLimit(identifier, 2, windowMs);
    expect(resultAfterWait).toEqual({ allowed: true, remaining: 1, retryAfterSec: 0 });
  });

  it('should maintain independent limits for different identifiers', () => {
    const userA = 'test-user-A';
    const userB = 'test-user-B';

    // User A consumes all requests
    checkRateLimit(userA, 1, 60000);
    const blockedA = checkRateLimit(userA, 1, 60000);
    expect(blockedA.allowed).toBe(false);

    // User B should still be allowed
    const resultB = checkRateLimit(userB, 1, 60000);
    expect(resultB.allowed).toBe(true);
  });
});
