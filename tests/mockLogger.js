import { jest } from '@jest/globals';

/**
 * Mocks the logging module and all of the common log functions.
 */
export const mockLogger = () => {
  jest.unstable_mockModule('../../src/logger.js', () => ({
    logger: {
      error: jest.fn(),
      warn: jest.fn(),
      info: jest.fn(),
      verbose: jest.fn(),
      debug: jest.fn(),
      silly: jest.fn(),
      festive: jest.fn(),
    },
  }));
};
