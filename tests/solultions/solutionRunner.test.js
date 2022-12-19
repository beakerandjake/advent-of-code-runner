import {
  describe, jest, test, beforeEach,
} from '@jest/globals';
import { join as realJoin } from 'node:path';
import {
  SolutionWorkerEmptyInputError,
  UserSolutionAnswerInvalidError,
  SolutionMissingFunctionError,
  UserSolutionFileNotFoundError,
  SolutionRuntimeError,
  SolutionWorkerUnexpectedError,
} from '../../src/errors/index.js';
import { workerMessageTypes } from '../../src/solutions/workerMessageTypes.js';
import { mockConfig, mockLogger } from '../mocks.js';

// setup mocks.
mockConfig();
const loggerMockInstance = mockLogger();

jest.unstable_mockModule('../../src/persistence/io.js', () => ({
  fileExists: jest.fn(),
  loadFileContents: jest.fn(),
}));

const workerOnMock = jest.fn();
jest.unstable_mockModule('node:worker_threads', () => ({
  Worker: jest.fn(() => ({
    on: workerOnMock,
  })),
}));

jest.unstable_mockModule('../../src/solutions/solutionRunnerWorkerThread.js', () => ({
  workerMessageTypes: jest.fn(),
}));

jest.unstable_mockModule('path', () => ({
  join: jest.fn(),
}));

const { Worker } = await import('node:worker_threads');
const { join } = await import('path');
const { getConfigValue } = await import('../../src/config.js');
const { fileExists, loadFileContents } = await import('../../src/persistence/io.js');
const { execute, getSolutionFileName, getFunctionNameForPart } = await import('../../src/solutions/solutionRunner.js');

beforeEach(() => {
  jest.clearAllMocks();
  workerOnMock.mockClear();
});

/**
 * helps set the mock getConfigValue for the solution runner.
 */
const setConfigMocks = (part, { solutionsDir = '.', partFunctions = [{ key: part, name: 'cats' }], workerFileName = '.' } = {}) => {
  getConfigValue.mockImplementation((key) => {
    switch (key) {
      case 'paths.solutionsDir':
        return solutionsDir;
      case 'solutionRunner.partFunctions':
        return partFunctions;
      case 'paths.solutionRunnerWorkerFile':
        return workerFileName;
      default:
        return undefined;
    }
  });
};

describe('solutionRunner', () => {
  describe('getSolutionFileName()', () => {
    test('returns expected value', () => {
      const dir = 'asdf';
      getConfigValue.mockReturnValueOnce(dir);
      join.mockImplementation((...args) => realJoin(...args));
      const expected = realJoin(dir, 'day_1.js');

      const result = getSolutionFileName(1);

      expect(result).toBe(expected);
    });
  });

  describe('getFunctionNameForPart()', () => {
    test('returns value if part is found', () => {
      const part = 10;
      const name = 'CATS';
      getConfigValue.mockReturnValueOnce([
        { key: 1, name: 'Dogs' },
        { key: 2, name: 'Sheet' },
        { key: 4, name: 'Orange' },
        { key: 22, name: 'Box' },
        { key: part, name },
      ]);

      const result = getFunctionNameForPart(part);

      expect(result).toBe(name);
    });

    test('throws if part is not found', () => {
      getConfigValue.mockReturnValueOnce([
        { key: 1, name: 'Dogs' },
        { key: 2, name: 'Sheet' },
        { key: 4, name: 'Orange' },
        { key: 22, name: 'Box' },
        { key: 55, name: 'ASDF' },
      ]);

      expect(() => getFunctionNameForPart(10)).toThrow();
    });
  });

  describe('execute()', () => {
    test('throws if input is empty', async () => {
      expect(async () => execute(1, 1, null)).rejects.toThrow(SolutionWorkerEmptyInputError);
      expect(async () => execute(1, 1, undefined)).rejects.toThrow(SolutionWorkerEmptyInputError);
      expect(async () => execute(1, 1, '')).rejects.toThrow(SolutionWorkerEmptyInputError);
    });

    test('throws if user solution file not found', async () => {
      const part = 1;
      setConfigMocks(part);
      fileExists.mockResolvedValue(false);
      expect(async () => execute(1, 1, 'asdf')).rejects.toThrow(UserSolutionFileNotFoundError);
    });

    test('throws if worker file not found', async () => {
      const part = 1;
      setConfigMocks(part);
      loadFileContents.mockRejectedValue(new Error('Could not load file!'));

      expect(async () => execute(1, 1, 'asdf')).rejects.toThrow();
    });

    test('passes required data to worker', async () => {
      const part = 1;
      const expected = {
        functionToExecute: 'partOne',
        solutionFileName: 'day_1.js',
        input: 'ASDFASDFASDFASDF',
      };
      setConfigMocks(part, { partFunctions: [{ key: part, name: expected.functionToExecute }] });
      fileExists.mockResolvedValue(true);

      // hacky way to ensure worker constructor is called.
      // cant await execute cause that promise never resolves.
      // so await a different promise to ensure constructor is called
      execute(1, part, expected.input);
      await Promise.resolve(123);

      expect(Worker).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({ workerData: expected }),
      );
    });

    describe('worker events', () => {
      test('error event - throws error', async () => {
        const part = 1;
        setConfigMocks(part);
        loadFileContents.mockResolvedValue(true);
        let errorCallback;
        workerOnMock.mockImplementation((key, callback) => {
          if (key === 'error') {
            errorCallback = callback;
          }
        });

        // execute and ensure that mock the worker raising its error event.
        const promise = execute(1, part, 'ASDF');
        await Promise.resolve(123);
        expect(errorCallback).toBeDefined();
        errorCallback(new Error('FAILED!'));

        expect(async () => promise).rejects.toThrow(SolutionWorkerUnexpectedError);
      });

      test('exit event - throws error', async () => {
        const part = 1;
        setConfigMocks(part);
        loadFileContents.mockResolvedValue(true);
        let exitCallback;
        workerOnMock.mockImplementation((key, callback) => {
          if (key === 'exit') {
            exitCallback = callback;
          }
        });

        // execute and ensure that mock the worker raising its error event.
        const promise = execute(1, part, 'ASDF');
        await Promise.resolve(123);
        expect(exitCallback).toBeDefined();
        exitCallback();

        expect(async () => promise).rejects.toThrow();
      });

      describe('message event', () => {
        const part = 1;
        let messageCallback;

        beforeEach(() => {
          setConfigMocks(part);
          loadFileContents.mockResolvedValue(true);
          workerOnMock.mockImplementation((key, callback) => {
            if (key === 'message') {
              messageCallback = callback;
            }
          });
        });

        test('log - logs to logger', async () => {
          execute(1, part, 'ASDF');
          await Promise.resolve(123);
          expect(messageCallback).toBeDefined();
          messageCallback({ type: workerMessageTypes.log, level: 'info', message: 'ASDF' });
          await Promise.resolve(123);
          expect(loggerMockInstance.log).toHaveBeenLastCalledWith('info', 'ASDF');
        });

        test('answer - resolves with results', async () => {
          const expected = { answer: 1234, executionTimeNs: 1234 };
          const executePromise = execute(1, part, 'ASDF');
          await Promise.resolve(123);
          expect(messageCallback).toBeDefined();
          messageCallback({ ...expected, type: workerMessageTypes.answer });
          const result = await executePromise;
          expect(result).toEqual(expected);
        });

        test('answerTypeInvalid - throws', async () => {
          const executePromise = execute(1, part, 'ASDF');
          await Promise.resolve(123);
          expect(messageCallback).toBeDefined();
          messageCallback({ type: workerMessageTypes.answerTypeInvalid });
          expect(async () => executePromise).rejects.toThrow(UserSolutionAnswerInvalidError);
        });

        test('runtimeError - throws', async () => {
          const executePromise = execute(1, part, 'ASDF');
          await Promise.resolve(123);
          expect(messageCallback).toBeDefined();
          messageCallback({ type: workerMessageTypes.runtimeError });
          expect(async () => executePromise).rejects.toThrow(SolutionRuntimeError);
        });

        test('functionNotFound - throws', async () => {
          const executePromise = execute(1, part, 'ASDF');
          await Promise.resolve(123);
          expect(messageCallback).toBeDefined();
          messageCallback({ type: workerMessageTypes.functionNotFound });
          expect(async () => executePromise).rejects.toThrow(SolutionMissingFunctionError);
        });

        test('unknown message type - throws', async () => {
          const executePromise = execute(1, part, 'ASDF');
          await Promise.resolve(123);
          expect(messageCallback).toBeDefined();
          messageCallback({ type: 'DOESNOTEXIST' });
          expect(async () => executePromise).rejects.toThrow(Error);
        });
      });
    });
  });
});