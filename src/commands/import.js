import { logger } from '../logger.js';
import { dataFileExists } from '../validation/userFilesExist.js';
import { DirectoryNotInitializedError } from '../errors/cliErrors.js';
import {
  PuzzleInFutureError,
  PuzzleLevelInvalidError,
} from '../errors/puzzleErrors.js';
import {
  puzzleHasLevel,
  puzzleIsInFuture,
} from '../validation/validatePuzzle.js';
import { createPuzzle } from '../persistence/puzzleRepository.js';
import { getYear } from '../persistence/metaRepository.js';

/**
 * Returns new puzzle data for the puzzle being imported which can be saved to the puzzle repository.
 */
const createPuzzleData = async (year, day, level, answer) => ({
  ...createPuzzle(year, day, level),
  fastestRuntimeNs: 9e10,
  correctAnswer: answer,
});

/**
 * Stores the correct answer to the puzzle. Used to inform advent-of-code-runner about problems
 * which were solved outside of their advent-of-code-runner repository.
 */
export const importAction = async (day, level, answer) => {
  logger.debug('starting import action:', { day, level, answer });

  if (!(await dataFileExists())) {
    throw new DirectoryNotInitializedError();
  }

  const year = await getYear();

  if (!puzzleHasLevel(year, day, level)) {
    throw new PuzzleLevelInvalidError(day, level);
  }
  if (puzzleIsInFuture(year, day)) {
    throw new PuzzleInFutureError(day);
  }

  const test = createPuzzleData(await getYear(), day, level, answer);
  console.log(test);
  // ask for confirmation if puzzle has already been solved
};
