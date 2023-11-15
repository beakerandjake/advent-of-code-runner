import { describe, jest, test, afterEach } from '@jest/globals';
import { mockLogger, easyMock, easyResolve, mockConfig } from '../mocks.js';
import { DirectoryNotInitializedError } from '../../src/errors/cliErrors.js';
import {
  PuzzleInFutureError,
  PuzzleLevelInvalidError,
  PuzzleLevelNotMetError,
} from '../../src/errors/puzzleErrors.js';

// setup mocks
const easyMocks = [
  [
    'src/answers.js',
    [
      'answerIsCorrect',
      'getNextUnansweredPuzzle',
      'requiredLevelsHaveBeenSolved',
    ],
  ],
  ['src/validation/userFilesExist.js', ['dotEnvExists', 'dataFileExists']],
  ['src/formatting.js', ['humanizeDuration', 'clickablePuzzleUrl']],
  ['src/inputs/getPuzzleInput.js', ['getPuzzleInput']],
  ['src/persistence/metaRepository.js', ['getYear']],
  ['src/solutions/solutionRunner.js', ['execute']],
  ['src/statistics.js', ['beatsFastestRuntime', 'setPuzzlesFastestRuntime']],
  ['src/validation/userFilesExist.js', ['dataFileExists']],
  ['src/validation/validatePuzzle.js', ['puzzleHasLevel', 'puzzleIsInFuture']],
  ['src/tables/autoUpdateReadme.js', ['autoUpdateReadme']],
];
easyMock(easyMocks);
const logger = mockLogger();
const { getConfigValue } = mockConfig();

// import after mocks set up.
const {
  dataFileExists,
  getNextUnansweredPuzzle,
  puzzleHasLevel,
  puzzleIsInFuture,
  requiredLevelsHaveBeenSolved,
  execute,
  getPuzzleInput,
  clickablePuzzleUrl,
  setPuzzlesFastestRuntime,
  autoUpdateReadme,
  answerIsCorrect,
  beatsFastestRuntime,
} = await easyResolve(easyMocks);
const { solveAction } = await import('../../src/commands/solve.js');

const setupSuccessfulSolve = (
  input = 'INPUT',
  answer = 'RESULT',
  runtimeNs = 1234
) => {
  dataFileExists.mockResolvedValue(true);
  puzzleHasLevel.mockResolvedValue(true);
  puzzleIsInFuture.mockReturnValue(false);
  requiredLevelsHaveBeenSolved.mockResolvedValue(true);
  getPuzzleInput.mockResolvedValue(input);
  execute.mockResolvedValue({ answer, runtimeNs });
};

describe('solveAction', () => {
  afterEach(() => {
    jest.resetAllMocks();
    jest.useFakeTimers();
  });

  test('throws if directory not initialized', async () => {
    dataFileExists.mockResolvedValue(false);
    await expect(() => solveAction()).rejects.toThrow(
      DirectoryNotInitializedError
    );
  });

  test('solves level 1 if provided day but no level', async () => {
    const day = 1234;
    setupSuccessfulSolve();
    await solveAction(day);
    expect(execute).toHaveBeenCalledWith(day, 1, expect.any(String));
  });

  test('solves day and level if provided both', async () => {
    const day = 432;
    const level = 921;
    setupSuccessfulSolve();
    await solveAction(day, level);
    expect(execute).toHaveBeenCalledWith(day, level, expect.any(String));
  });

  test('does not auto solve if given day and no level', async () => {
    setupSuccessfulSolve();
    await solveAction(123);
    expect(getNextUnansweredPuzzle).not.toHaveBeenCalled();
  });

  test('does not auto solve if given day and level', async () => {
    setupSuccessfulSolve();
    await solveAction(123, 321);
    expect(getNextUnansweredPuzzle).not.toHaveBeenCalled();
  });

  test('auto solves if provided no args', async () => {
    const day = 100;
    const level = 50;
    setupSuccessfulSolve();
    getNextUnansweredPuzzle.mockResolvedValue({ day, level });
    await solveAction();
    expect(execute).toHaveBeenCalledWith(day, level, expect.any(String));
  });

  test('auto solve does nothing if all puzzles completed', async () => {
    setupSuccessfulSolve();
    getNextUnansweredPuzzle.mockResolvedValue(null);
    await solveAction();
    expect(execute).not.toHaveBeenCalled();
  });

  test('throws if puzzle does not have level', async () => {
    setupSuccessfulSolve();
    puzzleHasLevel.mockReturnValue(false);
    await expect(() => solveAction(1, 2)).rejects.toThrow(
      PuzzleLevelInvalidError
    );
  });

  test('throws if puzzle is in future', async () => {
    setupSuccessfulSolve();
    puzzleIsInFuture.mockReturnValue(true);
    await expect(() => solveAction(1, 2)).rejects.toThrow(PuzzleInFutureError);
  });

  test('throws if required levels not solved', async () => {
    setupSuccessfulSolve();
    requiredLevelsHaveBeenSolved.mockResolvedValue(false);
    await expect(() => solveAction(1, 2)).rejects.toThrow(
      PuzzleLevelNotMetError
    );
  });

  test('outputs clickable puzzle link', async () => {
    const expected = 'COOL URL!';
    setupSuccessfulSolve();
    clickablePuzzleUrl.mockReturnValue(expected);
    await solveAction(1, 2);
    const logsWithUrl = logger.festive.mock.calls.filter((args) =>
      args.some((x) => typeof x === 'string' && x.includes(expected))
    );
    expect(logsWithUrl.length).toBeGreaterThan(0);
  });

  test('outputs message if solution is taking long time', async () => {
    jest.useRealTimers();
    setupSuccessfulSolve();
    getConfigValue.mockImplementation((key) => {
      if (key === 'solutionRunner.cancelMessageDelayMs') {
        return 25;
      }
      throw new Error('unknown key value');
    });
    execute.mockImplementation(
      async () =>
        new Promise((resolve) => {
          setTimeout(() => resolve({ answer: '1234', runtimeNs: 1234 }), 100);
        })
    );
    await solveAction(1, 1);
    expect(
      logger.festive.mock.calls.some((args) =>
        args.some(
          (x) =>
            typeof x === 'string' && x.toLocaleLowerCase().includes('ctrl+c')
        )
      )
    ).toBe(true);
  });

  test('passes loaded input to execute', async () => {
    const expected = 'A FINE INPUT!';
    setupSuccessfulSolve(expected);
    await solveAction(2, 4);
    expect(execute).toHaveBeenCalledWith(
      expect.any(Number),
      expect.any(Number),
      expected
    );
  });

  test('does not set fastest runtime if answer is not correct and not fastest runtime', async () => {
    setupSuccessfulSolve();
    answerIsCorrect.mockResolvedValue(false);
    beatsFastestRuntime.mockResolvedValue(false);
    await solveAction(1, 2);
    expect(setPuzzlesFastestRuntime).not.toHaveBeenCalled();
  });

  test('does not update readme if answer is not correct and not fastest runtime', async () => {
    setupSuccessfulSolve();
    answerIsCorrect.mockResolvedValue(false);
    beatsFastestRuntime.mockResolvedValue(false);
    await solveAction(1, 2);
    expect(autoUpdateReadme).not.toHaveBeenCalled();
  });

  test('does not set fastest runtime if answer is correct and not fastest runtime', async () => {
    setupSuccessfulSolve();
    answerIsCorrect.mockResolvedValue(true);
    beatsFastestRuntime.mockResolvedValue(false);
    await solveAction(1, 2);
    expect(setPuzzlesFastestRuntime).not.toHaveBeenCalled();
  });

  test('does not update readme if answer is correct and not fastest runtime', async () => {
    setupSuccessfulSolve();
    answerIsCorrect.mockResolvedValue(true);
    beatsFastestRuntime.mockResolvedValue(false);
    await solveAction(1, 2);
    expect(autoUpdateReadme).not.toHaveBeenCalled();
  });

  test('does not set fastest runtime if answer is not correct and is fastest runtime', async () => {
    setupSuccessfulSolve();
    answerIsCorrect.mockResolvedValue(false);
    beatsFastestRuntime.mockResolvedValue(true);
    await solveAction(1, 2);
    expect(setPuzzlesFastestRuntime).not.toHaveBeenCalled();
  });

  test('does not update readme if answer is not correct and is fastest runtime', async () => {
    setupSuccessfulSolve();
    answerIsCorrect.mockResolvedValue(false);
    beatsFastestRuntime.mockResolvedValue(true);
    await solveAction(1, 2);
    expect(autoUpdateReadme).not.toHaveBeenCalled();
  });

  test('sets fastest runtime if answer is correct and is fastest runtime', async () => {
    setupSuccessfulSolve();
    answerIsCorrect.mockResolvedValue(true);
    beatsFastestRuntime.mockResolvedValue(true);
    await solveAction(1, 2);
    expect(setPuzzlesFastestRuntime).toHaveBeenCalled();
  });

  test('updates readme if answer is correct and is fastest runtime', async () => {
    setupSuccessfulSolve();
    answerIsCorrect.mockResolvedValue(true);
    beatsFastestRuntime.mockResolvedValue(true);
    await solveAction(1, 2);
    expect(autoUpdateReadme).toHaveBeenCalledWith();
  });
});
