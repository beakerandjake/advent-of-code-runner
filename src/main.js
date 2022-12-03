import { downloadInput, submitSolution } from './api.js';
import { inputFileExits, saveInputToFile, loadInputFile } from './io.js';
import { getConfigValue } from './config.js';
import { logger } from './logger.js';
import { solve } from './solve.js';
import { humanizeDuration } from './utils.js';

const year = getConfigValue('aoc.year');
const day = 1;
const part = 1;

// let input;

// if (!await inputFileExits(year, day)) {
//   // download and cache input when it doesn't exist.
//   input = await downloadInput(year, day, getConfigValue('aoc.authenticationToken'));
//   await saveInputToFile(year, day, input);
// } else {
//   // load cached input instead of re-downloading.
//   input = await loadInputFile(year, day);
// }

// const { solution, executionTimeNs } = await solve(year, day, input);

const solution = '55';

// logger.info('solution: %s solved in: %s', solution, humanizeDuration(executionTimeNs));

const submissionResult = await submitSolution(year, day, part, solution, getConfigValue('aoc.authenticationToken'));

logger.info('submission result: %s', submissionResult);

// Submit Problem

// Store data on local machine,
// Hash the session token and store which problems have been solved
// prevent re-submissions
// store last submission time, don't allow submission if too soon
// provide way to clear local data.

// Allow ctrl+c to cancel a running solution

// validate day / year, don't allow days in the future
// validate day (don't select invalid day of month (1-25))
// validate year, set minimum year

// init command to scaffold solution files for an entire year
//  create a day_x.js file for each day of that month.
//  skip creation of files that already exist.

// swallow console logs for solutions and route to winston instead with custom
// log level and color.
