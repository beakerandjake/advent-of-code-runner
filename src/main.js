import { downloadInput, submitSolution } from './api.js';
import { inputFileExits, saveInputToFile, loadInputFile } from './input.js';
import { getConfigValue } from './config.js';
import { logger } from './logger.js';
import { solve } from './solve.js';
import { humanizeDuration } from './formatting.js';

const year = getConfigValue('aoc.year');
const day = 1;
const part = 1;

// eslint-disable-next-line no-unused-vars
const main = async () => {
  let input;

  if (!await inputFileExits(year, day)) {
    // download and cache input when it doesn't exist.
    input = await downloadInput(year, day, getConfigValue('aoc.authenticationToken'));
    await saveInputToFile(year, day, input);
  } else {
    // load cached input instead of re-downloading.
    input = await loadInputFile(year, day);
  }

  const { solution, executionTimeNs } = await solve(year, day, part, input);

  logger.info('solution: %s solved in: %s', solution, humanizeDuration(executionTimeNs));

  const submissionResult = await submitSolution(year, day, part, solution, getConfigValue('aoc.authenticationToken'));

  logger.info('submission result: %s', submissionResult);
};

// await main();

const input = await loadInputFile(year, day);
const solveTwo = await solve(year, day, part, input);
// const solve1 = await solve(year, day, part, input);
logger.info('solve2: %s solved in: %s', solveTwo.solution, humanizeDuration(solveTwo.executionTimeNs));

// const input = await loadInputFile(year, day);
// const { solution, executionTimeMs } = await solve(year, day, part, input);
// logger.info('solution: %s solved in: %s', solution, humanizeDuration(executionTimeMs));

// Submit Problem

// Store data on local machine,
// Hash the session token and store which problems have been solved
// prevent re-submissions
// store last submission time, don't allow submission if too soon
// provide way to clear local data.

// validate day / year, don't allow days in the future
// validate day (don't select invalid day of month (1-25))
// validate year, set minimum year

// init command to scaffold solution files for an entire year
//  create a day_x.js file for each day of that month.
//  skip creation of files that already exist.

// Allow ctrl+c to cancel a running solution (run solution on worker thread or process?)
// swallow console logs for solutions and route to winston instead with custom
// log level and color.

// /**
//  * Generates a key to identify the puzzle for the specific year/day/part combination.
//  * @param {Number} year
//  * @param {Number} day
//  * @param {Number} part
//  */
// const generatePuzzleKey = (year, day, part) => `${year}_${day}_${part}`;

// /**
//  * Store the fact that the puzzle has been solved.
//  * Prevents re-submissions of already solved puzzles.
//  * @param {Number} year
//  * @param {Number} day
//  * @param {Number} part
//  */
// export const setPuzzleSolved = (year, day, part) => {};

// /**
//  * Has this puzzle already been solved?
//  * @param {Number} year
//  * @param {Number} day
//  * @param {Number} part
//  */
// export const hasPuzzleBeenSolved = (year, day, part) => {};
