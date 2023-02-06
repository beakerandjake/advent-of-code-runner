import { describe, jest, test, afterEach } from '@jest/globals';
import { RateLimitExceededError } from '../../src/errors/apiErrors.js';

// setup mocks.
jest.unstable_mockModule('../../src/api/rateLimit.js', () => ({
  isRateLimited: jest.fn(),
  updateRateLimit: jest.fn(),
}));

jest.unstable_mockModule('../../src/logger.js', () => ({
  logger: {
    debug: jest.fn(),
    warn: jest.fn(),
  },
}));

// const { logger } = await import('../src/logger.js');
const { isRateLimited, updateRateLimit } = await import('../../src/api/rateLimit.js');
const { rateLimitDecorator } = await import('../../src/api/rateLimitDecorator.js');

afterEach(() => {
  jest.clearAllMocks();
});

describe('rateLimitDecorator', () => {
  test('throws if rate limit exceeded', async () => {
    isRateLimited.mockResolvedValueOnce({ limited: true, expiration: new Date() });
    const fn = jest.fn();
    const decorated = rateLimitDecorator(() => {}, 'ASDF');
    expect(async () => decorated()).rejects.toThrow(RateLimitExceededError);
    expect(fn).not.toHaveBeenCalled();
  });

  test('executes fn if rate limit not exceeded', async () => {
    isRateLimited.mockResolvedValueOnce({ limited: false, expiration: null });
    const fn = jest.fn();
    await rateLimitDecorator(fn, 'ASDF')();
    expect(fn).toHaveBeenCalled();
  });

  test('does not update rate limit if rate limit exceeded', () => {
    isRateLimited.mockResolvedValueOnce({ limited: true, expiration: new Date() });
    const fn = jest.fn();
    expect(async () => rateLimitDecorator(fn, 'ASDF')()).rejects.toThrow(
      RateLimitExceededError
    );
    expect(fn).not.toHaveBeenCalled();
    expect(updateRateLimit).not.toHaveBeenCalled();
  });

  test('updates rate limit if fn executes successfully', async () => {
    isRateLimited.mockResolvedValueOnce({ limited: false, expiration: null });
    await rateLimitDecorator(async () => {}, 'ASDF')();
    expect(updateRateLimit).toHaveBeenCalled();
  });

  test('updates rate limit if fn throws', async () => {
    isRateLimited.mockResolvedValueOnce({ limited: false, expiration: null });
    const decorated = rateLimitDecorator(async () => {
      throw new RangeError();
    }, 'ASDF');
    await expect(async () => decorated()).rejects.toThrow(RangeError);
    expect(updateRateLimit).toHaveBeenCalled();
  });
});
