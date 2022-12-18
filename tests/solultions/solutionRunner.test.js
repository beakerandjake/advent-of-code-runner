import {
  describe, jest, test, beforeEach,
} from '@jest/globals';
import { join } from 'node:path';
import { EmptyInputError, SolutionNotFoundError } from '../../src/errors/index.js';
import { mockConfig, mockLogger } from '../mocks.js';

// setup mocks.
mockLogger();
mockConfig();

jest.unstable_mockModule('../../src/persistence/io.js', () => ({
  fileExists: jest.fn(),
}));

jest.unstable_mockModule('node:worker_threads', () => ({
  Worker: jest.fn(),
}));

jest.unstable_mockModule('../../src/solutions/solutionRunnerWorkerThread.js', () => ({
  workerMessageTypes: jest.fn(),
}));

const { Worker } = await import('node:worker_threads');
const { getConfigValue } = await import('../../src/config.js');
const { fileExists } = await import('../../src/persistence/io.js');
const { execute, getSolutionFileName, getFunctionNameForPart } = await import('../../src/solutions/solutionRunner.js');

beforeEach(() => {
  jest.clearAllMocks();
});

describe('solutionRunner', () => {
  describe('getSolutionFileName()', () => {
    test('returns expected value', () => {
      const dir = 'asdf';
      getConfigValue.mockReturnValueOnce(dir);
      const expected = join(dir, 'day_1.js');

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
      expect(async () => execute(1, 1, null)).rejects.toThrow(EmptyInputError);
      expect(async () => execute(1, 1, undefined)).rejects.toThrow(EmptyInputError);
      expect(async () => execute(1, 1, '')).rejects.toThrow(EmptyInputError);
    });

    test('throws if worker file not found', async () => {
      // setup so file exists returns false
      const fileName = 'coolguy.txt';
      getConfigValue.mockImplementation((x) => (x === 'paths.solutionRunnerWorkerFile' ? fileName : ''));
      fileExists.mockImplementation((x) => Promise.resolve(x !== fileName));

      expect(async () => execute(1, 1, 'ASDF')).rejects.toThrow(fileName);
    });

    test('throws if user solution file not found', async () => {
      const solutionsDir = 'asdf';
      const fileName = join(solutionsDir, 'day_1.js');
      getConfigValue.mockImplementation((x) => (x === 'paths.solutionsDir' ? solutionsDir : ''));
      fileExists.mockImplementation((x) => Promise.resolve(x !== fileName));

      expect(async () => execute(1, 1, 'ASDF')).rejects.toThrow(SolutionNotFoundError);
    });
  });
  test.todo('lots to do');
});
