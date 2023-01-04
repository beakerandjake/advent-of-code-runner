import {
  describe, jest, test, beforeEach,
} from '@jest/globals';
import { mockConfig, mockLogger } from '../mocks.js';

// setup mocks
mockLogger();
const { getConfigValue } = mockConfig();
jest.unstable_mockModule('node:child_process', () => ({ spawn: jest.fn() }));

// import after mocks set up
const { spawn } = await import('node:child_process');
const { installPackages } = await import('../../src/initialize/installPackages.js');

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
