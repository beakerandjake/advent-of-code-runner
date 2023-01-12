import { describe, jest, test } from '@jest/globals';
import { workerMessageTypes } from '../../src/solutions/workerMessageTypes';
import {
  SolutionWorkerMissingDataError,
  UserSolutionAnswerInvalidError,
  UserSolutionFileNotFoundError,
  UserSolutionMissingFunctionError,
  UserSolutionThrewError,
} from '../../src/errors/solutionWorkerErrors.js';

jest.unstable_mockModule('node:worker_threads', () => ({
  isMainThread: true,
  workerData: {},
  parentPort: {
    postMessage: jest.fn(),
  },
}));

jest.unstable_mockModule('node:process', () => ({
  hrtime: {
    bigint: jest.fn(),
  },
}));

jest.unstable_mockModule('../../src/util.js', () => ({
  get: jest.fn(),
  getType: jest.fn(),
}));

jest.unstable_mockModule('../../src/solutions/importUserSolutionModule.js', () => ({
  importUserSolutionModule: jest.fn(),
}));

jest.unstable_mockModule('../../src/validation/validateAnswer.js', () => ({
  answerTypeIsValid: jest.fn(),
}));

const { hrtime } = await import('node:process');
const { parentPort } = await import('node:worker_threads');
const { get } = await import('../../src/util.js');
const { answerTypeIsValid } = await import('../../src/validation/validateAnswer.js');
const { importUserSolutionModule } = await import('../../src/solutions/importUserSolutionModule.js');
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
        message,
        meta: [...args],
      };
      logFromWorker(expected.level, message, ...args);

      expect(parentPort.postMessage).toHaveBeenCalledTimes(1);
      expect(parentPort.postMessage).toHaveBeenCalledWith(expected);
    });

    test('posts expected data (without args)', async () => {
      // const args = [];
      const message = 'dogs';
      const expected = {
        type: workerMessageTypes.log,
        level: 'cats',
        message,
        meta: [],
      };
      logFromWorker(expected.level, message);

      expect(parentPort.postMessage).toHaveBeenCalledTimes(1);
      expect(parentPort.postMessage).toHaveBeenCalledWith(expected);
    });
  });

  describe('executeUserSolution()', () => {
    test('calls user function', async () => {
      const userSolutionFn = jest.fn();
      answerTypeIsValid.mockReturnValueOnce(true);
      await executeUserSolution(userSolutionFn, 'ASDF');
      expect(userSolutionFn).toBeCalledTimes(1);
    });

    test('passes inputs to user function', async () => {
      const args = { input: 'ASDF\nASDF', lines: ['ASDF', 'ASDF'] };
      const userSolutionFn = jest.fn();
      answerTypeIsValid.mockReturnValueOnce(true);
      await executeUserSolution(userSolutionFn, args.input, args.lines);
      expect(userSolutionFn).toBeCalledTimes(1);
      expect(userSolutionFn).toBeCalledWith(args);
    });

    test('throws if user function throws error', async () => {
      const userSolutionFn = jest.fn(() => { throw new RangeError('Invalid Index'); });
      answerTypeIsValid.mockReturnValue(true);
      await expect(async () => executeUserSolution(userSolutionFn, 'asdf')).rejects.toThrow(UserSolutionThrewError);
    });

    test('throws if user function throws literal', async () => {
      // eslint-disable-next-line no-throw-literal
      const userSolutionFn = jest.fn(() => { throw 'Thrown non error object'; });
      answerTypeIsValid.mockReturnValue(true);
      await expect(async () => executeUserSolution(userSolutionFn, 'asdf')).rejects.toThrow(UserSolutionThrewError);
    });

    test('throws if answer type is invalid', async () => {
      answerTypeIsValid.mockReturnValue(false);
      await expect(async () => executeUserSolution(() => {}, 'asdf')).rejects.toThrow(TypeError);
    });

    test('posts answer to parent thread on success', async () => {
      const answer = 'ASDF';
      const userSolutionFn = () => answer;
      answerTypeIsValid.mockReturnValueOnce(true);

      await executeUserSolution(userSolutionFn, 'ASDF');

      expect(parentPort.postMessage).toHaveBeenCalledTimes(1);
      expect(parentPort.postMessage).toHaveBeenCalledWith(
        expect.objectContaining({ type: workerMessageTypes.answer, answer }),
      );
    });

    test('correctly calculates runtime time on success', async () => {
      const startTime = 4567;
      const endTime = 6789;
      answerTypeIsValid.mockReturnValueOnce(true);
      hrtime.bigint.mockReturnValueOnce(startTime);
      hrtime.bigint.mockReturnValueOnce(endTime);

      await executeUserSolution(jest.fn(), 'ASDF');

      expect(parentPort.postMessage).toHaveBeenCalledTimes(1);
      expect(parentPort.postMessage).toHaveBeenCalledWith(
        expect.objectContaining({ runtimeNs: endTime - startTime }),
      );
    });
  });

  describe('runWorker()', () => {
    test('throws if user data missing "solutionName"', async () => {
      await expect(
        async () => runWorker({ functionToExecute: 'asdf', input: 'asdf', lines: ['asdf'] }),
      ).rejects.toThrow(SolutionWorkerMissingDataError);
    });

    test('throws if user data missing "functionToExecute"', async () => {
      await expect(
        async () => runWorker({ solutionFileName: 'asdf', input: 'asdf', lines: ['asdf'] }),
      ).rejects.toThrow(SolutionWorkerMissingDataError);
    });

    test('throws if user data missing "input"', async () => {
      await expect(
        async () => runWorker({ functionToExecute: 'asdf', solutionFileName: 'asdf', lines: ['asdf'] }),
      ).rejects.toThrow(SolutionWorkerMissingDataError);
    });

    test('throws if user data missing "lines"', async () => {
      await expect(
        async () => runWorker({ functionToExecute: 'asdf', solutionFileName: 'asdf', input: 'asdf' }),
      ).rejects.toThrow(SolutionWorkerMissingDataError);
    });

    test('throws if user solution file not found', async () => {
      importUserSolutionModule.mockRejectedValue(new UserSolutionFileNotFoundError('NOT FOUND'));
      await expect(
        async () => runWorker({
          solutionFileName: 'asdf', functionToExecute: 'asdf', input: 'asdf', lines: ['asdf'],
        }),
      ).rejects.toThrow(UserSolutionFileNotFoundError);
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
      importUserSolutionModule.mockResolvedValue({});
      get.mockReturnValue(fn);
      await expect(
        async () => runWorker({
          solutionFileName: 'asdf', functionToExecute: 'asdf', input: 'asdf', lines: ['asdf'],
        }),
      ).rejects.toThrow(UserSolutionMissingFunctionError);
    });
  });
});
