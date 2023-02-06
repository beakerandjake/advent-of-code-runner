import {
  beforeEach, describe, jest, test,
} from '@jest/globals';
import { join as realJoin } from 'node:path';
import {
  SolutionWorkerEmptyInputError,
  SolutionWorkerExitWithoutAnswerError,
  UserSolutionFileNotFoundError,
} from '../../src/errors/solutionWorkerErrors.js';
import { workerMessageTypes } from '../../src/solutions/workerMessageTypes.js';
import { mockConfig, mockLogger } from '../mocks.js';

// setup mocks.
const { getConfigValue } = mockConfig();
const loggerMockInstance = mockLogger();
jest.unstable_mockModule('path', () => ({ join: jest.fn() }));
jest.unstable_mockModule('fs-extra/esm', () => ({ pathExists: jest.fn() }));

const workerOnMock = jest.fn();
jest.unstable_mockModule('node:worker_threads', () => ({
  Worker: jest.fn(() => ({
    on: workerOnMock,
  })),
}));

const { Worker } = await import('node:worker_threads');
const { join } = await import('path');
const { pathExists } = await import('fs-extra/esm');
const {
  execute, getSolutionFileName, getFunctionNameForLevel, spawnWorker,
} = await import('../../src/solutions/solutionRunner.js');

describe('solutionRunner', () => {
  const origEnv = process.env;

  beforeEach(() => {
    jest.clearAllMocks();
    workerOnMock.mockClear();
    process.env = { ...origEnv };
  });

  afterAll(() => {
    process.env = origEnv;
  });

  describe('getSolutionFileName()', () => {
    test('returns expected value', () => {
      const dir = 'asdf';
      getConfigValue.mockReturnValueOnce(dir);
      join.mockImplementation((...args) => realJoin(...args));
      const expected = realJoin(dir, 'day_01.js');

      const result = getSolutionFileName(1);

      expect(result).toBe(expected);
    });
  });

  describe('getFunctionNameForLevel()', () => {
    test('returns value if level is found', () => {
      const level = 10;
      const name = 'CATS';
      getConfigValue.mockReturnValueOnce([
        { key: 1, name: 'Dogs' },
        { key: 2, name: 'Sheet' },
        { key: 4, name: 'Orange' },
        { key: 22, name: 'Box' },
        { key: level, name },
      ]);

      const result = getFunctionNameForLevel(level);

      expect(result).toBe(name);
    });

    test('throws if level is not found', () => {
      getConfigValue.mockReturnValueOnce([
        { key: 1, name: 'Dogs' },
        { key: 2, name: 'Sheet' },
        { key: 4, name: 'Orange' },
        { key: 22, name: 'Box' },
        { key: 55, name: 'ASDF' },
      ]);

      expect(() => getFunctionNameForLevel(10)).toThrow();
    });
  });

  describe('spawnWorker()', () => {
    test('throws if worker throws', async () => {
      let errorCallback;
      workerOnMock.mockImplementation((key, callback) => {
        if (key === 'error') {
          errorCallback = callback;
        }
      });
      const promise = spawnWorker('ASDF', {});
      await Promise.resolve();
      errorCallback(new RangeError('Invalid Index'));
      await expect(async () => promise).rejects.toThrow(RangeError);
    });

    test('throws if worker exits without answer', async () => {
      let exitCallback;
      workerOnMock.mockImplementation((key, callback) => {
        if (key === 'exit') {
          exitCallback = callback;
        }
      });
      const promise = spawnWorker('ASDF', {});
      await Promise.resolve();
      exitCallback();
      await expect(async () => promise).rejects.toThrow(SolutionWorkerExitWithoutAnswerError);
    });

    test('logs if worker posts log message', async () => {
      let messageCallback;
      workerOnMock.mockImplementation((key, callback) => {
        if (key === 'message') {
          messageCallback = callback;
        }
      });
      const logMessage = {
        type: workerMessageTypes.log,
        level: 'info',
        message: 'ASDF ASDF ASDF',
      };
      spawnWorker('ASDF', {});
      await Promise.resolve();
      messageCallback(logMessage);
      await Promise.resolve();
      expect(loggerMockInstance.log).toHaveBeenLastCalledWith(logMessage.level, logMessage.message);
    });

    test('resolves if worker posts answer', async () => {
      let messageCallback;
      workerOnMock.mockImplementation((key, callback) => {
        if (key === 'message') {
          messageCallback = callback;
        }
      });
      const answerMessage = {
        type: workerMessageTypes.answer,
        answer: 'cats',
        runtimeNs: 1234,
      };
      const workerPromise = spawnWorker('ASDF', {});
      await Promise.resolve();
      messageCallback(answerMessage);
      await Promise.resolve();
      const result = await workerPromise;
      expect(result).toEqual(
        { answer: answerMessage.answer, runtimeNs: answerMessage.runtimeNs },
      );
    });
  });

  describe('execute()', () => {
    /**
     * helps set the mock getConfigValue for the solution runner.
     */
    const setConfigMocks = (level, {
      solutionsDir = '.', levelFunctions = [{ key: level, name: 'cats' }], workerFileName = '.', authToken = '',
    } = {}) => {
      getConfigValue.mockImplementation((key) => {
        switch (key) {
          case 'paths.solutionsDir':
            return solutionsDir;
          case 'solutionRunner.levelFunctions':
            return levelFunctions;
          case 'paths.solutionRunnerWorkerFile':
            return workerFileName;
          case 'aoc.authenticationToken':
            return authToken;
          default:
            return undefined;
        }
      });
    };

    test('throws if input is empty', async () => {
      expect(async () => execute(1, 1, null)).rejects.toThrow(SolutionWorkerEmptyInputError);
      expect(async () => execute(1, 1, undefined)).rejects.toThrow(SolutionWorkerEmptyInputError);
      expect(async () => execute(1, 1, '')).rejects.toThrow(SolutionWorkerEmptyInputError);
    });

    test('throws if user solution file not found', async () => {
      const level = 1;
      setConfigMocks(level);
      pathExists.mockResolvedValue(false);
      expect(async () => execute(1, 1, 'asdf')).rejects.toThrow(UserSolutionFileNotFoundError);
    });

    test('passes worker data to worker', async () => {
      const level = 1;
      const expected = {
        functionToExecute: 'levelOne',
        solutionFileName: 'day_01.js',
        input: 'ASDF\nASDF',
        lines: ['ASDF', 'ASDF'],
      };
      pathExists.mockResolvedValue(true);
      setConfigMocks(level, { levelFunctions: [{ key: level, name: expected.functionToExecute }] });

      // hacky way to ensure worker constructor is called.
      // cant await execute cause that promise never resolves.
      // so await a different promise to ensure constructor is called
      execute(1, level, expected.input);
      await Promise.resolve(123);

      expect(Worker).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({ workerData: expected }),
      );
    });

    test('removes auth token from works env', async () => {
      const authToken = 'ASDF';
      process.env = { ...process.env, authToken };
      setConfigMocks(1, { authToken });
      pathExists.mockResolvedValue(true);
      // hacky way to ensure worker constructor is called.
      // cant await execute cause that promise never resolves.
      // so await a different promise to ensure constructor is called
      execute(1, 1, 'ASDF');
      await Promise.resolve();

      expect(Worker).toHaveBeenCalledWith(
        expect.any(String),
        expect.not.objectContaining({ env: { authToken } }),
      );
    });
  });
});
