import { describe, jest, test, afterEach } from '@jest/globals';
import { UserError } from '../src/errors/userError.js';
import { mockLogger } from './mocks.js';

// setup mocks
const logger = mockLogger();
jest.unstable_mockModule('node:process', () => ({ exit: jest.fn() }));

// import after mocks are setup
const { exit } = await import('node:process');
const { handleError } = await import('../src/errorHandler.js');

describe('errorHandler', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('handleError()', () => {
    test('logs on error - instance of UserError', () => {
      class CoolUserError extends UserError {}
      const myError = new CoolUserError('ASDF');
      handleError(myError);
      expect(logger.error).toHaveBeenCalledWith(myError, { simpleErrorFormat: true });
    });

    test('logs on error - name containing User', () => {
      class CoolUserError extends Error {
        constructor() {
          super();
          this.name = 'CoolUserError';
        }
      }
      const myError = new CoolUserError('ASDF');
      handleError(myError);
      expect(logger.error).toHaveBeenCalledWith(myError, { simpleErrorFormat: true });
    });

    test('logs on error - non UserError', () => {
      const error = new RangeError();
      handleError(error);
      expect(logger.error).toHaveBeenCalledWith(error);
    });

    test('calls exit on error - instance of UserError', () => {
      class CoolUserError extends UserError {}
      handleError(new CoolUserError('ASDF'));
      expect(exit).toHaveBeenCalled();
    });

    test('calls exit on error - name containing User', () => {
      class CoolUserError extends Error {
        constructor() {
          super();
          this.name = 'CoolUserError';
        }
      }
      handleError(new CoolUserError('ASDF'));
      expect(exit).toHaveBeenCalled();
    });

    test('calls exit on error - non UserError', () => {
      handleError(new RangeError());
      expect(exit).toHaveBeenCalled();
    });
  });
});
