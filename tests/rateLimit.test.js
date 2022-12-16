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
const { setRateLimitExpiration, rateLimitedActions } = await import('../src/api/rateLimit.js');
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
});
