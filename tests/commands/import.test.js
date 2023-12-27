import { describe, jest, test, afterEach } from '@jest/globals';
import { mockLogger, easyMock, easyResolve } from '../mocks.js';
import { DirectoryNotInitializedError } from '../../src/errors/cliErrors.js';
import {
  PuzzleInFutureError,
  PuzzleLevelInvalidError,
} from '../../src/errors/puzzleErrors.js';

// setup mocks
const easyMocks = [
  ['@inquirer/prompts', ['confirm']],
  ['src/festive.js', ['festiveStyle']],
  ['src/validation/userFilesExist.js', ['dataFileExists']],
  ['src/persistence/metaRepository.js', ['getYear']],
  ['src/validation/validatePuzzle.js', ['puzzleHasLevel', 'puzzleIsInFuture']],
  [
    'src/persistence/puzzleRepository.js',
    ['addOrEditPuzzle', 'createPuzzle', 'findPuzzle'],
  ],
];
easyMock(easyMocks);
mockLogger();

// import after mocks set up.
const {
  confirm,
  dataFileExists,
  puzzleHasLevel,
  puzzleIsInFuture,
  addOrEditPuzzle,
  createPuzzle,
  findPuzzle,
  getYear,
} = await easyResolve(easyMocks);
const { importAction } = await import('../../src/commands/import.js');

describe('import command', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  test('throws if directory is not initialized', async () => {
    dataFileExists.mockResolvedValue(false);
    puzzleHasLevel.mockReturnValue(true);
    puzzleIsInFuture.mockReturnValue(false);
    await expect(async () => importAction(2023, 1, 1, {})).rejects.toThrow(
      DirectoryNotInitializedError
    );
  });

  test('throws if puzzle does not have level', async () => {
    dataFileExists.mockResolvedValue(true);
    puzzleHasLevel.mockReturnValue(false);
    puzzleIsInFuture.mockReturnValue(false);
    await expect(async () => importAction(2023, 1, 1, {})).rejects.toThrow(
      PuzzleLevelInvalidError
    );
  });

  test('throws if puzzle is in future', async () => {
    dataFileExists.mockResolvedValue(true);
    puzzleHasLevel.mockReturnValue(true);
    puzzleIsInFuture.mockReturnValue(true);
    await expect(async () => importAction(2023, 1, 1, {})).rejects.toThrow(
      PuzzleInFutureError
    );
  });

  describe('option {confirm: true}', () => {
    test('confirms with user if puzzle data exists', async () => {
      dataFileExists.mockResolvedValue(true);
      puzzleHasLevel.mockReturnValue(true);
      puzzleIsInFuture.mockReturnValue(false);
      findPuzzle.mockResolvedValue({});
      await importAction(1, 1, 'asdf', { confirm: true });
      expect(confirm).toHaveBeenCalled();
    });

    test('does not confirm with user if puzzle data does not exist', async () => {
      dataFileExists.mockResolvedValue(true);
      puzzleHasLevel.mockReturnValue(true);
      puzzleIsInFuture.mockReturnValue(false);
      findPuzzle.mockResolvedValue(null);
      await importAction(1, 1, 'asdf', { confirm: true });
      expect(confirm).not.toHaveBeenCalled();
    });

    test('bails if user does not confirm', async () => {
      dataFileExists.mockResolvedValue(true);
      puzzleHasLevel.mockReturnValue(true);
      puzzleIsInFuture.mockReturnValue(false);
      findPuzzle.mockResolvedValue({});
      confirm.mockResolvedValue(false);
      await importAction(1, 1, 'asdf', { confirm: true });
      expect(addOrEditPuzzle).not.toHaveBeenCalled();
    });
  });

  describe('option {confirm: false}', () => {
    test('does not confirm with user if puzzle data exists', async () => {
      dataFileExists.mockResolvedValue(true);
      puzzleHasLevel.mockReturnValue(true);
      puzzleIsInFuture.mockReturnValue(false);
      findPuzzle.mockResolvedValue({});
      await importAction(1, 1, 'asdf', { confirm: false });
      expect(confirm).not.toHaveBeenCalled();
    });

    test('does not confirm with user if puzzle data does not exist', async () => {
      dataFileExists.mockResolvedValue(true);
      puzzleHasLevel.mockReturnValue(true);
      puzzleIsInFuture.mockReturnValue(false);
      findPuzzle.mockResolvedValue(null);
      await importAction(1, 1, 'asdf', { confirm: false });
      expect(confirm).not.toHaveBeenCalled();
    });
  });

  test('sets correctAnswer field on new puzzle data', async () => {
    dataFileExists.mockResolvedValue(true);
    puzzleHasLevel.mockReturnValue(true);
    puzzleIsInFuture.mockReturnValue(false);
    findPuzzle.mockResolvedValue({});
    confirm.mockResolvedValue(true);
    createPuzzle.mockReturnValue({
      correctAnswer: 'WRONG',
    });

    const expected = 'CORRECT';
    await importAction(1, 1, expected, { confirm: true });
    expect(addOrEditPuzzle).toHaveBeenCalledWith(
      expect.objectContaining({ correctAnswer: expected })
    );
  });

  test('sets fastestRuntimeNs field on new puzzle data', async () => {
    dataFileExists.mockResolvedValue(true);
    puzzleHasLevel.mockReturnValue(true);
    puzzleIsInFuture.mockReturnValue(false);
    findPuzzle.mockResolvedValue({});
    confirm.mockResolvedValue(true);
    createPuzzle.mockReturnValue({
      fastestRuntimeNs: null,
    });

    await importAction(1, 1, 'ASDF', { confirm: true });
    expect(addOrEditPuzzle).toHaveBeenCalledWith(
      expect.objectContaining({ fastestRuntimeNs: expect.any(Number) })
    );
  });

  test('sets year field on new puzzle data', async () => {
    const expectedYear = 2023;

    dataFileExists.mockResolvedValue(true);
    puzzleHasLevel.mockReturnValue(true);
    puzzleIsInFuture.mockReturnValue(false);
    findPuzzle.mockResolvedValue({});
    confirm.mockResolvedValue(true);
    getYear.mockResolvedValue(expectedYear);
    createPuzzle.mockImplementation((year, day, level) => ({
      year,
      day,
      level,
    }));
    await importAction(1, 1, 'ASDF', { confirm: true });
    expect(addOrEditPuzzle).toHaveBeenCalledWith(
      expect.objectContaining({ year: expectedYear })
    );
  });

  test('sets day field on new puzzle data', async () => {
    const expectedDay = 2023;

    dataFileExists.mockResolvedValue(true);
    puzzleHasLevel.mockReturnValue(true);
    puzzleIsInFuture.mockReturnValue(false);
    findPuzzle.mockResolvedValue({});
    confirm.mockResolvedValue(true);
    createPuzzle.mockImplementation((year, day, level) => ({
      year,
      day,
      level,
    }));
    await importAction(expectedDay, 1, 'ASDF', { confirm: true });
    expect(addOrEditPuzzle).toHaveBeenCalledWith(
      expect.objectContaining({ day: expectedDay })
    );
  });

  test('sets level field on new puzzle data', async () => {
    const expectedLevel = 2023;

    dataFileExists.mockResolvedValue(true);
    puzzleHasLevel.mockReturnValue(true);
    puzzleIsInFuture.mockReturnValue(false);
    findPuzzle.mockResolvedValue({});
    confirm.mockResolvedValue(true);
    createPuzzle.mockImplementation((year, day, level) => ({
      year,
      day,
      level,
    }));
    await importAction(1, expectedLevel, 'ASDF', { confirm: true });
    expect(addOrEditPuzzle).toHaveBeenCalledWith(
      expect.objectContaining({ level: expectedLevel })
    );
  });
});
