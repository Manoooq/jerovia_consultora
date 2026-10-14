import { describe, it, expect, vi, beforeEach } from 'vitest';

const { mockGenerateContent } = vi.hoisted(() => {
  return {
    mockGenerateContent: vi.fn(),
  };
});

vi.mock('@google/generative-ai', () => {
  class MockGoogleGenerativeAI {
    getGenerativeModel() {
      return {
        generateContent: mockGenerateContent,
      };
    }
  }
  return {
    GoogleGenerativeAI: MockGoogleGenerativeAI,
  };
});

import { transcribirAudio } from './gemini';

describe('transcribirAudio', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return parsed JSON on success', async () => {
    mockGenerateContent.mockResolvedValueOnce({
      response: {
        text: () => '{"nombre":"Juan","apellido":"Perez"}',
      },
    });

    const result = await transcribirAudio('base64audio');
    expect(result).toEqual({ nombre: 'Juan', apellido: 'Perez' });
  });

  it('should return {} on invalid JSON', async () => {
    mockGenerateContent.mockResolvedValueOnce({
      response: {
        text: () => 'invalid json',
      },
    });

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const result = await transcribirAudio('base64audio');
    expect(result).toEqual({});

    consoleSpy.mockRestore();
  });

  it('should return {} on API rejection', async () => {
    mockGenerateContent.mockRejectedValueOnce(new Error('API Error'));

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const result = await transcribirAudio('base64audio');
    expect(result).toEqual({});

    consoleSpy.mockRestore();
  });

  it('should return {} on timeout', async () => {
    vi.useFakeTimers();

    mockGenerateContent.mockImplementationOnce(() => new Promise((resolve) => {
      setTimeout(() => resolve({
        response: { text: () => '{"delayed":"true"}' }
      }), 4000);
    }));

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const resultPromise = transcribirAudio('base64audio');

    await vi.advanceTimersByTimeAsync(3500);

    const result = await resultPromise;
    expect(result).toEqual({});

    consoleSpy.mockRestore();
    vi.useRealTimers();
  });
});
