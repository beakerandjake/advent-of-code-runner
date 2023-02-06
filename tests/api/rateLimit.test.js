import { describe, jest, test, afterEach } from '@jest/globals';
import { mockLogger, mockConfig } from '../mocks.js';

// setup mocks.
mockLogger();
const { getConfigValue } = mockConfig();
jest.unstable_mockModule(
  '../../src/persistence/rateLimitRepository.js',
  () => ({
    getRateLimit: jest.fn(),
    setRateLimit: jest.fn(),
  })
);

// import after setting up the mock so the modules import the mocked version
const { getRateLimit, setRateLimit } = await import(
  '../../src/persistence/rateLimitRepository.js'
);
const { updateRateLimit, isRateLimited, rateLimitedActions } = await import(
  '../../src/api/rateLimit.js'
);

afterEach(() => {
  jest.clearAllMocks();
});

describe('rateLimit', () => {
  describe('updateRateLimit()', () => {
    test('throws on invalid action type', async () => {
      expect(async () =>
        updateRateLimit('THIS ACTION TYPE DOES NOT EXIST', new Date())
      ).rejects.toThrow();
    });

    test('sets expected expiration date', async () => {
      const now = new Date(2022, 11, 3);
      const msToAdd = 1000 * 50;

      const DateOrig = global.Date;

      // for this test we pretty strict control of Date constructor
      // use spy to force and exact value for now.
      const spy = jest
        .spyOn(global, 'Date')
        .mockImplementationOnce(() => now)
        .mockImplementation((...args) => new DateOrig(...args));

      getConfigValue.mockImplementation((key) => {
        if (key === 'aoc.rateLimiting.defaultTimeoutMs') {
          return msToAdd;
        }
        throw new Error('unknown config key');
      });

      await updateRateLimit(rateLimitedActions.downloadInput);

      // reset date for everyone else.
      spy.mockRestore();

      expect(setRateLimit).toHaveBeenCalledWith(
        rateLimitedActions.downloadInput,
        new Date(now.getTime() + msToAdd)
      );
    });
  });

  describe('isRateLimited()', () => {
    test('throws on invalid action type', async () => {
      expect(async () =>
        isRateLimited('THIS ACTION TYPE DOES NOT EXIST')
      ).rejects.toThrow();
    });

    test('returns false if no expiration', async () => {
      getRateLimit.mockReturnValueOnce(null);
      expect(
        await isRateLimited(rateLimitedActions.submitAnswer)
      ).toStrictEqual({ expiration: null, limited: false });
    });

    test('returns false if expiration is invalid date', async () => {
      getRateLimit.mockReturnValueOnce(new Date(Infinity));
      expect(
        await isRateLimited(rateLimitedActions.submitAnswer)
      ).toStrictEqual({ expiration: null, limited: false });
    });

    test('returns false if expiration is in future', async () => {
      const future = new Date(new Date().getTime() + 1000 * 60 * 5);
      getRateLimit.mockReturnValueOnce(future);
      expect(
        await isRateLimited(rateLimitedActions.submitAnswer)
      ).toStrictEqual({ expiration: future, limited: true });
    });

    test('returns true if expiration is in past', async () => {
      const past = new Date(new Date().getTime() - 1000 * 60 * 5);
      getRateLimit.mockReturnValueOnce(past);
      expect(
        await isRateLimited(rateLimitedActions.submitAnswer)
      ).toStrictEqual({ expiration: past, limited: false });
    });
  });
});
