import { join } from 'path';
import { getConfigValue } from './config.js';
import { SolutionFileNotFoundError } from './errors/index.js';
import { fileExists } from './io.js';
import { logger } from './logger.js';
import { execute } from './solutionRunner.js';

/**
 * Returns the file name for a solution file for the given year and day.
 * @param {Number} year
 * @param {Number} day
 */
const getSolutionFileName = (year, day) => join(getConfigValue('solutions.path'), `${year}`, `day_${day}.js`);

/**
 * Returns the name of the function to execute for the puzzles part.
 * @param {Number} part
 */
const getFunctionNameForPart = (part) => {
  const functionName = getConfigValue('solutions.partFunctions').find((x) => x.key === part)?.name;

  if (!functionName) {
    throw new Error(`Unknown solution part: ${part}`);
  }

  return functionName;
};

/**
 * Runs the solution for the given day.
 * @param {Number} year
 * @param {Number} day
 * @param {Number} part
 */
export const solve = async (year, day, part, input) => {
  logger.verbose('running solution for year: %s, day: %s, part: %s', year, day, part);

  const solutionFileName = getSolutionFileName(year, day);

  // be nice to the solution runner and check to see if the file exists first.
  if (!await fileExists(solutionFileName)) {
    throw new SolutionFileNotFoundError(`Failed to load Solution file, ensure file exists: ${solutionFileName}`);
  }

  // TODO could swap out solution runners dynamically to support different languages..

  return execute(solutionFileName, getFunctionNameForPart(part), input);
};
