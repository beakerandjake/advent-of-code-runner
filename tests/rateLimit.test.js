import {
  describe, jest, test, afterEach,
} from '@jest/globals';

// setup mocks.
jest.unstable_mockModule('../src/persistence/rateLimitRepository.js', () => ({
  getRateLimit: jest.fn(),
  setRateLimit: jest.fn(),
}));

jest.unstable_mockModule('../src/logger.js', () => ({
  logger: {
    debug: jest.fn(),
  },
}));

// import after setting up the mock so the modules import the mocked version
const { setRateLimitExpiration, isRateLimited, rateLimitedActions } = await import('../src/api/rateLimit.js');
const { getRateLimit, setRateLimit } = await import('../src/persistence/rateLimitRepository.js');

afterEach(() => {
  jest.clearAllMocks();
});

describe('rateLimit', () => {
  describe('setRateLimitExpiration()', () => {
    test('throws on invalid action type', async () => {
      expect(async () => setRateLimitExpiration('THIS ACTION TYPE DOES NOT EXIST', new Date()))
        .rejects
        .toThrow();
    });

    test('succeeds on valid action type', async () => {
      await setRateLimit(rateLimitedActions.submitAnswer, new Date());
      expect(setRateLimit).toHaveBeenCalled();
    });
  });

  describe('isRateLimited()', () => {
    test('throws on invalid action type', async () => {
      expect(async () => isRateLimited('THIS ACTION TYPE DOES NOT EXIST'))
        .rejects
        .toThrow();
    });

    test('returns false if no expiration', async () => {
      getRateLimit.mockReturnValueOnce(null);
      expect(
        await isRateLimited(rateLimitedActions.submitAnswer),
      ).toStrictEqual({ expiration: null, limited: false });
    });

    test('returns false if expiration is invalid date', async () => {
      getRateLimit.mockReturnValueOnce(new Date(Infinity));
      expect(
        await isRateLimited(rateLimitedActions.submitAnswer),
      ).toStrictEqual({ expiration: null, limited: false });
    });

    test('returns false if expiration is in future', async () => {
      const future = new Date(new Date().getTime() + (1000 * 60 * 5));
      getRateLimit.mockReturnValueOnce(future);
      expect(
        await isRateLimited(rateLimitedActions.submitAnswer),
      ).toStrictEqual({ expiration: future, limited: true });
    });

    test('returns true if expiration is in past', async () => {
      const past = new Date(new Date().getTime() - (1000 * 60 * 5));
      getRateLimit.mockReturnValueOnce(past);
      expect(
        await isRateLimited(rateLimitedActions.submitAnswer),
      ).toStrictEqual({ expiration: past, limited: false });
    });
  });
});
