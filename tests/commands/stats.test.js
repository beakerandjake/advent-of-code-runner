import { describe, jest, test, afterEach } from '@jest/globals';
import { easyMock, easyResolve, mockLogger } from '../mocks.js';
import { DirectoryNotInitializedError } from '../../src/errors/cliErrors.js';

// setup mocks
const easyMocks = [
  ['src/persistence/metaRepository.js', ['getYear']],
  ['src/statistics.js', ['getPuzzleCompletionData']],
  ['src/tables/markdownTable.js', ['markdownTable']],
  ['src/tables/stdoutTable.js', ['stdoutTable']],
  ['src/tables/updateReadmeProgress.js', ['updateReadmeProgress']],
  ['src/validation/userFilesExist.js', ['dataFileExists']],
];
easyMock(easyMocks);
mockLogger();
const consoleLogMock = jest.spyOn(console, 'log').mockImplementation();

// import after mocks set up.
const {
  getPuzzleCompletionData,
  markdownTable,
  stdoutTable,
  updateReadmeProgress,
  dataFileExists,
} = await easyResolve(easyMocks);
const { statsAction } = await import('../../src/commands/stats.js');

describe('statsAction()', () => {

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
