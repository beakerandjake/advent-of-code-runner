import {
  beforeEach, describe, jest, test,
} from '@jest/globals';

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
      // const args = [];
      logFromWorker('cats', 'dogs', 1234, 45, 6);
      expect(parentPort.postMessage).toHaveBeenCalledTimes(1);
    });
  });
});
