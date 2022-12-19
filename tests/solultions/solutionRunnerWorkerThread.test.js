import {
  beforeEach, describe, jest, test,
} from '@jest/globals';
import { workerMessageTypes } from '../../src/solutions/workerMessageTypes';

// setup mocks
jest.unstable_mockModule('node:worker_threads', () => ({
  isMainThread: jest.fn(),
  workerData: jest.fn(),
  parentPort: {
    postMessage: jest.fn(),
  },
}));

jest.unstable_mockModule('node:process', () => ({
  hrtime: jest.fn(),
}));

const { isMainThread, workerData, parentPort } = await import('node:worker_threads');
const { hrtime } = await import('node:process');
const { logFromWorker } = await import('../../src/solutions/solutionRunnerWorkerThread.js');

beforeEach(() => {
  jest.clearAllMocks();
});

describe('solutionRunnerWorkerThread', () => {
  describe('logFromWorker()', () => {
    test('calls parentPort.postMessage()', async () => {
      logFromWorker('cats', 'dogs', 1234, 45, 6);
      expect(parentPort.postMessage).toHaveBeenCalledTimes(1);
    });

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

      expect(parentPort.postMessage).toHaveBeenCalledTimes(1);
      expect(parentPort.postMessage).toHaveBeenCalledWith(expected);
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

      expect(parentPort.postMessage).toHaveBeenCalledTimes(1);
      expect(parentPort.postMessage).toHaveBeenCalledWith(expected);
    });
  });
});
