import {
  answerIsCorrect,
  getNextUnansweredPuzzle,
  requiredLevelsHaveBeenSolved,
} from '../answers.js';
import { getConfigValue } from '../config.js';
import { DirectoryNotInitializedError } from '../errors/cliErrors.js';
import {
  PuzzleInFutureError,
  PuzzleLevelInvalidError,
  PuzzleLevelNotMetError,
} from '../errors/puzzleErrors.js';
import { clickablePuzzleUrl, humanizeDuration } from '../formatting.js';
import { getPuzzleInput } from '../inputs/getPuzzleInput.js';
import { logger } from '../logger.js';
import { getYear } from '../persistence/metaRepository.js';
import { execute } from '../solutions/solutionRunner.js';
import {
  beatsFastestRuntime,
  setPuzzlesFastestRuntime,
} from '../statistics.js';
import { dataFileExists } from '../validation/userFilesExist.js';
import {
  puzzleHasLevel,
  puzzleIsInFuture,
} from '../validation/validatePuzzle.js';
import { autoUpdateReadme } from '../tables/autoUpdateReadme.js';

/**
 * Execute the users solution file for the puzzle and return the result.
 */
const executeUserSolution = async (day, level, input) => {
  logger.festive('Executing your code');

  // output a pending message to user if their code is taking a while.
  const timeout = setTimeout(() => {
    logger.festive('Your code is still running, press Ctrl+C to cancel...');
  }, getConfigValue('solutionRunner.cancelMessageDelayMs'));

  const result = await execute(day, level, input);

  clearTimeout(timeout);

  logger.festive(
    'You answered: %s (solved in %s)',
    result.answer,
    humanizeDuration(result.runtimeNs)
  );
  return result;
};

/**
 * Attempts to execute the users solution for the puzzle.
 * @param {number} day
 * @param {number} level
 */
export const tryToSolvePuzzle = async (year, day, level) => {
  if (!puzzleHasLevel(year, day, level)) {
    throw new PuzzleLevelInvalidError(day, level);
  }
  if (puzzleIsInFuture(year, day)) {
    throw new PuzzleInFutureError(day);
  }
  if (!(await requiredLevelsHaveBeenSolved(year, day, level))) {
    throw new PuzzleLevelNotMetError(day, level);
  }
  const url = clickablePuzzleUrl(year, day);
  logger.festive(`${url} (Year: ${year} Day: ${day} Level: ${level})`);
  logger.festive('Loading puzzle input.');
  return executeUserSolution(
    day,
    level,
    await getPuzzleInput(year, day, level)
  );
};

/**
 * Solves a specific puzzle
 */
const solve = async (year, day, level) => {
  const { answer, runtimeNs } = await tryToSolvePuzzle(year, day, level);
  if (
    (await answerIsCorrect(year, day, level, answer)) &&
    (await beatsFastestRuntime(year, day, level, runtimeNs))
  ) {
    logger.festive("That's your fastest runtime ever for this puzzle!");
    await setPuzzlesFastestRuntime(year, day, level, runtimeNs);
    await autoUpdateReadme();
  }
};

/**
 * Solves the next unsolved puzzle based on users progress.
 */
const autoSolve = async (year) => {
  const next = await getNextUnansweredPuzzle(year);
  if (!next) {
    logger.festive(
      'Congratulations, you solved all the puzzles this year! If you want to solve a specific puzzle use the "solve [day] [level]" instead.'
    );
    return;
  }
  logger.verbose(`autosolve day:${next.day}, level:${next.level}`);
  await solve(year, next.day, next.level);
};

/**
 * Command to execute the users solution for a specific puzzle.
 * @param {number} day
 * @param {number} level
 */
export const solveAction = async (day, level) => {
  if (!(await dataFileExists())) {
    throw new DirectoryNotInitializedError();
  }
  if (!day && !level) {
    await autoSolve(await getYear());
  } else {
    await solve(await getYear(), day, level || 1);
  }
};
