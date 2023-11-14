import { describe, jest, test, afterEach } from '@jest/globals';
import { mockLogger } from '../mocks.js';
import { DirectoryNotInitializedError } from '../../src/errors/cliErrors.js';

// setup mocks
mockLogger();
jest.unstable_mockModule('src/persistence/metaRepository.js', () => ({
  getYear: jest.fn(),
}));
jest.unstable_mockModule('src/statistics.js', () => ({
  getPuzzleCompletionData: jest.fn(),
}));
jest.unstable_mockModule('src/stats/markdownTable.js', () => ({
  markdownTable: jest.fn(),
}));
jest.unstable_mockModule('src/stats/stdoutTable.js', () => ({
  stdoutTable: jest.fn(),
}));
jest.unstable_mockModule('src/stats/updateReadmeProgress.js', () => ({
  updateReadmeProgress: jest.fn(),
}));
jest.unstable_mockModule('src/validation/userFilesExist.js', () => ({
  dataFileExists: jest.fn(),
}));
const consoleLogMock = jest.spyOn(console, 'log').mockImplementation();

// import after mocks set up.
const { getPuzzleCompletionData } = await import('../../src/statistics.js');
const { markdownTable } = await import('../../src/stats/markdownTable.js');
const { stdoutTable } = await import('../../src/stats/stdoutTable.js');
const { updateReadmeProgress } = await import(
  '../../src/stats/updateReadmeProgress.js'
);
const { dataFileExists } = await import(
  '../../src/validation/userFilesExist.js'
);
const { statsAction } = await import('../../src/cli/stats.js');

describe('statsAction()', () => {
  beforeAll(() => {});

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('throws if not initialized', async () => {
    dataFileExists.mockResolvedValue(false);
    await expect(async () => statsAction({})).rejects.toThrowError(
      DirectoryNotInitializedError
    );
  });

  test('does nothing if no puzzles completed', async () => {
    dataFileExists.mockResolvedValue(true);
    getPuzzleCompletionData.mockResolvedValue([]);
    await statsAction({});
    expect(markdownTable).not.toHaveBeenCalled();
    expect(stdoutTable).not.toHaveBeenCalled();
    expect(consoleLogMock).not.toHaveBeenCalled();
    expect(updateReadmeProgress).not.toHaveBeenCalled();
  });

  test('prints if not passed --save option', async () => {
    dataFileExists.mockResolvedValue(true);
    getPuzzleCompletionData.mockResolvedValue([1, 2, 3, 4]);
    await statsAction({ save: false });
    expect(stdoutTable).toHaveBeenCalled();
    expect(consoleLogMock).toHaveBeenCalled();
  });

  test('does not update readme if not passed --save option', async () => {
    dataFileExists.mockResolvedValue(true);
    getPuzzleCompletionData.mockResolvedValue([1, 2, 3, 4]);
    await statsAction({ save: false });
    expect(updateReadmeProgress).not.toHaveBeenCalled();
  });

  test('updates readme if passed --save option', async () => {
    dataFileExists.mockResolvedValue(true);
    getPuzzleCompletionData.mockResolvedValue([1, 2, 3, 4]);
    await statsAction({ save: true });
    expect(markdownTable).toHaveBeenCalled();
    expect(updateReadmeProgress).toHaveBeenCalled();
  });

  test('does not print if passed --save option', async () => {
    dataFileExists.mockResolvedValue(true);
    getPuzzleCompletionData.mockResolvedValue([1, 2, 3, 4]);
    await statsAction({ save: true });
    expect(consoleLogMock).not.toHaveBeenCalled();
  });
});
