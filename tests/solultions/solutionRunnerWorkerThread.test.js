import {
  beforeEach, describe, jest, test,
} from '@jest/globals';
import { workerData } from 'node:worker_threads';
import {
  UserSolutionAnswerInvalidError, UserSolutionFileNotFoundError, UserSolutionMissingFunctionError, UserSolutionThrewError,
} from '../../src/errors/index.js';
import { workerMessageTypes } from '../../src/solutions/workerMessageTypes';

// setup mocks
const workerThreadMock = {
  isMainThread: true,
  workerData: {},
  parentPort: {
    postMessage: jest.fn(),
  },
};

jest.unstable_mockModule('node:worker_threads', () => workerThreadMock);

jest.unstable_mockModule('node:process', () => ({
  hrtime: {
    bigint: jest.fn(),
  },
}));

jest.unstable_mockModule('../../src/util.js', () => ({
  get: jest.fn(),
  getType: jest.fn(),
}));

jest.unstable_mockModule('../../src/solutions/importUserSolutionFile.js', () => ({
  importUserSolutionFile: jest.fn(),
}));

jest.unstable_mockModule('../../src/solutions/userAnswerTypeIsValid.js', () => ({
  userAnswerTypeIsValid: jest.fn(),
}));

const { hrtime } = await import('node:process');
const { get } = await import('../../src/util.js');
const { userAnswerTypeIsValid } = await import('../../src/solutions/userAnswerTypeIsValid.js');
const { importUserSolutionFile } = await import('../../src/solutions/importUserSolutionFile.js');
const { logFromWorker, executeUserSolution, runWorker } = await import('../../src/solutions/solutionRunnerWorkerThread.js');

afterEach(() => {
  jest.clearAllMocks();
});

describe('solutionRunnerWorkerThread', () => {
  describe('logFromWorker()', () => {
    test('posts expected data (with args)', async () => {
      // const args = [];
      const args = [1234, { name: 'bob' }, 'SNAP'];
      const message = 'dogs';
      const expected = {
        type: workerMessageTypes.log,
        level: 'cats',
        message: `worker - ${message}`,
        meta: [...args],
      };
      logFromWorker(expected.level, message, ...args);

      expect(workerThreadMock.parentPort.postMessage).toHaveBeenCalledTimes(1);
      expect(workerThreadMock.parentPort.postMessage).toHaveBeenCalledWith(expected);
    });

    test('posts expected data (without args)', async () => {
      // const args = [];
      const message = 'dogs';
      const expected = {
        type: workerMessageTypes.log,
        level: 'cats',
        message: `worker - ${message}`,
        meta: [],
      };
      logFromWorker(expected.level, message);

      expect(workerThreadMock.parentPort.postMessage).toHaveBeenCalledTimes(1);
      expect(workerThreadMock.parentPort.postMessage).toHaveBeenCalledWith(expected);
    });
  });

  describe('executeUserSolution()', () => {
    test('calls user function', () => {
      const userSolutionFn = jest.fn();
      userAnswerTypeIsValid.mockReturnValueOnce(true);
      executeUserSolution(userSolutionFn, 'ASDF');
      expect(userSolutionFn).toBeCalledTimes(1);
    });

    test('passes input to user function', () => {
      const input = '!@#$!@#$!@#$ASASDF';
      const userSolutionFn = jest.fn();
      userAnswerTypeIsValid.mockReturnValueOnce(true);
      executeUserSolution(userSolutionFn, input);
      expect(userSolutionFn).toBeCalledTimes(1);
      expect(userSolutionFn).toBeCalledWith(input);
    });

    test('throws if user function throws error', () => {
      const userSolutionFn = jest.fn(() => { throw new RangeError('Invalid Index'); });
      userAnswerTypeIsValid.mockReturnValue(true);
      expect(() => executeUserSolution(userSolutionFn, 'asdf')).toThrow(UserSolutionThrewError);
    });

    test('throws if user function throws literal', () => {
      // eslint-disable-next-line no-throw-literal
      const userSolutionFn = jest.fn(() => { throw 'Thrown non error object'; });
      userAnswerTypeIsValid.mockReturnValue(true);
      expect(() => executeUserSolution(userSolutionFn, 'asdf')).toThrow(UserSolutionThrewError);
    });

    test('throws if answer type is invalid', () => {
      userAnswerTypeIsValid.mockReturnValue(false);
      expect(() => executeUserSolution(() => {}, 'asdf')).toThrow(UserSolutionAnswerInvalidError);
    });

    test('posts answer to parent thread on success', () => {
      const answer = 'ASDF';
      const userSolutionFn = () => answer;
      userAnswerTypeIsValid.mockReturnValueOnce(true);

      executeUserSolution(userSolutionFn, 'ASDF');

      expect(workerThreadMock.parentPort.postMessage).toHaveBeenCalledTimes(1);
      expect(workerThreadMock.parentPort.postMessage).toHaveBeenCalledWith(
        expect.objectContaining({ type: workerMessageTypes.answer, answer }),
      );
    });

    test('correctly calculates execution time on success', () => {
      const startTime = 4567;
      const endTime = 6789;
      userAnswerTypeIsValid.mockReturnValueOnce(true);
      hrtime.bigint.mockReturnValueOnce(startTime);
      hrtime.bigint.mockReturnValueOnce(endTime);

      executeUserSolution(jest.fn(), 'ASDF');

      expect(workerThreadMock.parentPort.postMessage).toHaveBeenCalledTimes(1);
      expect(workerThreadMock.parentPort.postMessage).toHaveBeenCalledWith(
        expect.objectContaining({ executionTimeNs: endTime - startTime }),
      );
    });
  });

  describe('runWorker()', () => {
    test('throws if user solution file not found', async () => {
      importUserSolutionFile.mockRejectedValue(new UserSolutionFileNotFoundError('NOT FOUND'));
      await expect(async () => runWorker({ solutionFileName: 'asdf' })).rejects.toThrow(UserSolutionFileNotFoundError);
    });

    test.each([
      null,
      undefined,
      1234,
      2134.04,
      'SADF',
      {},
      Promise.resolve(1),
      new class Cats {}(),
      false,
      true,
    ])('throws if user function returns non function value - %s', async (fn) => {
      importUserSolutionFile.mockResolvedValue({});
      get.mockReturnValue(fn);
      await expect(async () => runWorker({})).rejects.toThrow(UserSolutionMissingFunctionError);
    });

    // test('throws if user solution file missing function', async () => {
    //   const userModule = {
    //     cats: () => {},
    //   };

    //   importUserSolutionFile.mockResolvedValue(userModule);
    //   await expect(
    //     async () => runWorker({ solutionFileName: 'asdf', functionToExecute: 'dogs' }),
    //   ).rejects.toThrow(UserSolutionFileNotFoundError);
    // });

    // test('throws if exported value is not a function', async () => {
    //   const userModule = {
    //     cats: () => {},
    //   };

    //   importUserSolutionFile.mockRejectedValue(new UserSolutionFileNotFoundError('NOT FOUND'));
    //   await expect(async () => runWorker({ solutionFileName: 'asdf' })).rejects.toThrow(UserSolutionFileNotFoundError);
    // });
  });
});
