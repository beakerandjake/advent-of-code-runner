import { confirm } from '@inquirer/prompts';
import { logger } from '../logger.js';
import { festiveStyle } from '../festive.js';
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
import {
  addOrEditPuzzle,
  createPuzzle,
  findPuzzle,
} from '../persistence/puzzleRepository.js';
import { getYear } from '../persistence/metaRepository.js';

/**
 * Attempts to confirm with the user if an entry for the puzzle exists in their data file.
 */
const userConfirmed = async (year, day, level) => {
  // nothing to confirm if puzzle does not exist.
  if (!(await findPuzzle(year, day, level))) {
    logger.debug('not confirming because no data for puzzle exists');
    return true;
  }

  logger.debug('data for puzzle exists, confirming overwrite with user');

  // confirm with user that they want to overwrite the existing puzzle data.
  return confirm({
    message: festiveStyle(
      'An entry exists for this puzzle in your data file, do you want to overwrite it?'
    ),
    default: false,
  });
};

/**
 * Stores the correct answer to the puzzle. Used to inform advent-of-code-runner about problems
 * which were solved outside of their advent-of-code-runner repository.
 */
export const importAction = async (day, level, answer, options) => {
  logger.debug('starting import action:', { day, level, answer, options });

  // can't import answer if repository has not been initialized.
  if (!(await dataFileExists())) {
    throw new DirectoryNotInitializedError();
  }

  const year = await getYear();

  // can't import answer if puzzle doesn't have level.
  if (!puzzleHasLevel(year, day, level)) {
    throw new PuzzleLevelInvalidError(day, level);
  }

  // can't import answer if puzzle isn't unlocked yet.
  if (puzzleIsInFuture(year, day)) {
    throw new PuzzleInFutureError(day);
  }

  // bail if user does not confirm action.
  if (options.confirm && !(await userConfirmed(year, day, level))) {
    logger.debug('user did not confirm the import action');
    return;
  }

  const puzzleData = {
    ...createPuzzle(year, day, level),
    // set fastest runtime to a high value so it can be overwritten when user runs solve.
    fastestRuntimeNs: 99.9e10,
    correctAnswer: answer,
  };

  logger.debug('create puzzle data to import', puzzleData);

  // save the puzzle data to the users data file.
  await addOrEditPuzzle(puzzleData);

  logger.festive(
    "Successfully imported puzzle answer. Run the 'solve' command to update runtime statistics."
  );
};
