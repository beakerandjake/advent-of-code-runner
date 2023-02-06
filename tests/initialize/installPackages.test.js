import { describe, jest, test, beforeEach } from '@jest/globals';
import { mockConfig, mockLogger } from '../mocks.js';

// setup mocks
mockLogger();
mockConfig();
jest.unstable_mockModule('node:child_process', () => ({ spawn: jest.fn() }));

// import after mocks set up
const { spawn } = await import('node:child_process');
const { installPackages } = await import(
  '../../src/initialize/installPackages.js'
);

describe('initialize', () => {
  describe('installPackages()', () => {
    beforeEach(() => {
      jest.resetAllMocks();
    });

    test('throws if install fails', async () => {
      let exitCallback;
      spawn.mockReturnValue({
        stderr: {
          on: jest.fn(),
        },
        once: (key, callback) => {
          if (key === 'exit') {
            exitCallback = callback;
          }
        },
      });

      const promise = installPackages();
      await Promise.resolve();
      exitCallback(1);
      await expect(promise).rejects.toThrow();
    });

    test('throws if install raises error event', async () => {
      let errorCallback;
      spawn.mockReturnValue({
        stderr: {
          on: jest.fn(),
        },
        once: (key, callback) => {
          if (key === 'error') {
            errorCallback = callback;
          }
        },
      });

      const promise = installPackages();
      await Promise.resolve();
      errorCallback(new Error('DARN'));
      await expect(promise).rejects.toThrow();
    });

    test('logs stderr on exit', async () => {
      let exitCallback;
      let stdErrOnCallback;
      spawn.mockReturnValue({
        stderr: {
          on: (key, callback) => {
            if (key === 'data') {
              stdErrOnCallback = callback;
            }
          },
        },
        once: (key, callback) => {
          if (key === 'exit') {
            exitCallback = callback;
          }
        },
      });
      const errorMessage = 'That failed so hard!';

      const promise = installPackages();
      await Promise.resolve();
      stdErrOnCallback(errorMessage);
      await Promise.resolve();
      exitCallback(1);
      await expect(promise).rejects.toThrow(errorMessage);
    });

    test('resolves if install succeeds', async () => {
      let exitCallback;
      spawn.mockReturnValue({
        stderr: {
          on: jest.fn(),
        },
        once: (key, callback) => {
          if (key === 'exit') {
            exitCallback = callback;
          }
        },
      });

      const promise = installPackages();
      await Promise.resolve();
      exitCallback(0);
      await expect(promise).resolves.not.toThrow();
    });
  });
});
