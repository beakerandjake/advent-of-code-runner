import { get } from 'lodash-es';
import { join } from 'path';
import { hrtime } from 'process';
import { SolutionFileMissingRequiredFunctionError } from './errors/SolutionFileMissingRequiredFunctionError.js';
import { SolutionFileNotFoundError } from './errors/SolutionFIleNotFoundError.js';
import { getConfigValue } from './config.js';
import { logger } from './logger.js';

/**
 * Returns the file name for a solution file for the given year and day.
 * @param {Number} year
 * @param {Number} day
 */
const getSolutionFileName = (year, day) => join(getConfigValue('solutions.path'), `${year}`, `day_${day}.js`);

/**
 * Attempts to dynamically import the solution module at the specified location.
 * @param {String} path
 */
const importSolution = async (path) => {
  logger.debug('importing solution file at: %s', path);

  try {
    return await import(path);
  } catch (error) {
    throw new SolutionFileNotFoundError(`Failed to load Solution file, ensure file exists: ${path}`);
  }
};

/**
 * Attempts to return the function for the puzzle part
 * @param {Object} solution
 * @param {Number} part
 */
const getFunctionToExecute = (solution, part) => {
  const functionName = getConfigValue('solutions.partFunctions').find((x) => x.key === part)?.name;

  if (!functionName) {
    throw new Error(`Unknown solution part: ${part}`);
  }

  logger.debug('loading function: "%s" from solution file', functionName);

  const toReturn = get(solution, functionName);

  if (!toReturn || !(toReturn instanceof Function)) {
    throw new SolutionFileMissingRequiredFunctionError(`Solution file must export function: "${functionName}" as a named export.`);
  }

  return toReturn;
};

/**
 * Runs the solution for the given day.
 * @param {Number} year
 * @param {Number} day
 * @param {Number} part
 */
export const solve = async (year, day, part, input) => {
  logger.verbose('running solution for year: %s, day: %s, part: %s', year, day, part);

  const importedModule = await importSolution(getSolutionFileName(year, day));
  const functionToExecute = getFunctionToExecute(importedModule, part);

  logger.debug('starting execution of solution');

  // profile and execute solution code.
  const start = hrtime.bigint();
  const solution = functionToExecute(input);
  const end = hrtime.bigint();
  const executionTimeNs = Number(end - start);

  logger.debug('solution executed in: %dns', executionTimeNs);

  return { solution, executionTimeNs };
};
