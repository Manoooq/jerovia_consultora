import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

describe('rateLimit', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllTimers();
    vi.restoreAllMocks();
  });

  it('should allow requests up to maxRequests', async () => {
    const { checkRateLimit } = await import('../src/lib/rateLimit');

    let result = checkRateLimit('user1', 2, 60000);
    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(1);

    result = checkRateLimit('user1', 2, 60000);
    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(0);
  });

  it('should reject requests after maxRequests is reached', async () => {
    const { checkRateLimit } = await import('../src/lib/rateLimit');

    checkRateLimit('user2', 1, 60000);
    const result = checkRateLimit('user2', 1, 60000);

    expect(result.allowed).toBe(false);
    expect(result.remaining).toBe(0);
    expect(result.retryAfterSec).toBe(60);
  });

  it('should allow requests again after the window expires', async () => {
    const { checkRateLimit } = await import('../src/lib/rateLimit');

    checkRateLimit('user3', 1, 60000);

    let result = checkRateLimit('user3', 1, 60000);
    expect(result.allowed).toBe(false);

    vi.advanceTimersByTime(60001);

    result = checkRateLimit('user3', 1, 60000);
    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(0);
  });

  it('should periodically clean up expired records', async () => {
    const deleteSpy = vi.spyOn(Map.prototype, 'delete');
    const { checkRateLimit } = await import('../src/lib/rateLimit');

    // Record that expires in 1 minute
    checkRateLimit('user-clean', 1, 60 * 1000);

    // Record that expires in 10 minutes
    checkRateLimit('user-keep', 1, 10 * 60 * 1000);

    // Fast forward by 5 minutes (interval)
    vi.advanceTimersByTime(5 * 60 * 1000);

    expect(deleteSpy).toHaveBeenCalledWith('user-clean');
    expect(deleteSpy).not.toHaveBeenCalledWith('user-keep');
  });
});
