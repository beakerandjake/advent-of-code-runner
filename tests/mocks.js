import { jest } from '@jest/globals';

/**
 * Mocks the logging module and all of the common log functions.
 */
export const mockLogger = () => {
  const toReturn = {
    error: jest.fn(),
    warn: jest.fn(),
    info: jest.fn(),
    verbose: jest.fn(),
    debug: jest.fn(),
    silly: jest.fn(),
    festive: jest.fn(),
    log: jest.fn(),
  };
  jest.unstable_mockModule('src/logger.js', () => ({
    logger: toReturn,
  }));

  return toReturn;
};

/**
 * Mocks the config module and all of the commonly used functions.
 */
export const mockConfig = () => {
  const toReturn = {
    getConfigValue: jest.fn(),
    envOptions: {},
  };
  jest.unstable_mockModule('src/config.js', () => toReturn);
  return toReturn;
};

/**
 * Mocks the Commander module and all of the commonly used functions.
 */
export const mockCommander = () => {
  class InvalidArgumentError extends Error {
    constructor(message) {
      super(message);
      this.name = 'InvalidArgumentError';
    }
  }
  const toReturn = {
    name: jest.fn().mockReturnThis(),
    description: jest.fn().mockReturnThis(),
    version: jest.fn().mockReturnThis(),
    addHelpText: jest.fn().mockReturnThis(),
    addCommand: jest.fn().mockReturnThis(),
    exitOverride: jest.fn().mockReturnThis(),
    hook: jest.fn().mockReturnThis(),
    action: jest.fn().mockReturnThis(),
    parseAsync: jest.fn(),
  };
  jest.unstable_mockModule('commander', () => ({
    // eslint-disable-next-line func-names, object-shorthand
    Command: function () {
      return toReturn;
    },
    // eslint-disable-next-line func-names, object-shorthand
    Argument: function () {
      return {
        argParser: jest.fn().mockReturnThis(),
      };
    },
    InvalidArgumentError,
  }));
  return toReturn;
};
