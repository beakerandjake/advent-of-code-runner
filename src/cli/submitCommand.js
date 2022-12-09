import { Command } from 'commander';
import { submitSolution } from '../api/index.js';
import { getConfigValue } from '../config.js';
import { LockedPuzzleError, PuzzleAlreadySolvedError, RateLimitExceededError } from '../errors/index.js';
import { humanizeDuration } from '../formatting.js';
import { logger } from '../logger.js';
import { puzzleHasBeenSolved } from '../progress.js';
import {
  checkActionRateLimit, rateLimitedActions, updateRateLimit,
} from '../rateLimit.js';
import { solve } from '../solve.js';
import { puzzleIsUnlocked } from '../validatePuzzle.js';
import { dayArgument, partArgument, yearOption } from './arguments.js';

/**
 * Solve the puzzle and submit the solution to advent of code.
 * @param {Number} day
 * @param {Number} part
 * @param {Object} options
 * @param {Number} options.year
 */
const submit = async (day, part, { year }) => {
  logger.verbose('executing submit command with args: <day> %s, <part> %s, -y %s', day, part, year);

  // prevent submission if user can't even submit.
  if (!puzzleIsUnlocked(year, day)) {
    throw new LockedPuzzleError(`Puzzle for year: ${year}, day: ${day}, part: ${part} is locked or already completed!`);
  }

  // prevent submission if we know user already solved this puzzle.
  if (await puzzleHasBeenSolved(year, day, part)) {
    throw new PuzzleAlreadySolvedError(`You have already completed puzzle for year: ${year}, day: ${day}, part: ${part}!`);
  }

  const { limited, expiration } = await checkActionRateLimit(rateLimitedActions.submitAnswer);

  // prevent submission if user is rate limited.
  if (limited) {
    throw new RateLimitExceededError('Timeout period for submitting a solution has not expired.', expiration);
  }

  const { solution, executionTimeNs } = await solve(year, day, part);

  logger.verbose('solution: %s solved in: %s', solution, humanizeDuration(executionTimeNs));

  const { success, message } = await submitSolution(year, day, part, solution, getConfigValue('aoc.authenticationToken'));

  logger.info('solution was correct: %s, message: %s', success, message);

  await updateRateLimit(rateLimitedActions.submitAnswer);
};

/**
 * Command which allows the user to submit a puzzles answer to advent of code.
 */
export const submitCommand = new Command()
  .name('submit')
  .description('Run the solution for the puzzle, then submit the result.')
  .addArgument(dayArgument)
  .addArgument(partArgument)
  .addOption(yearOption)
  .action(submit);
