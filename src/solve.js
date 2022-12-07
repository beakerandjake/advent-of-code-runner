import { get } from 'lodash-es';
import { hrtime } from 'node:process';
import { getConfigValue } from './config.js';
import { SolutionFileMissingRequiredFunctionError } from './errors/SolutionFileMissingRequiredFunctionError.js';
import { SolutionFileNotFoundError } from './errors/SolutionFIleNotFoundError.js';
import { getSolutionFileName } from './io.js';
import { logger } from './logger.js';

const SOLUTION_FUNCTIONS = getConfigValue('solutions.partFunctions');

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
  const functionName = SOLUTION_FUNCTIONS.find((x) => x.key === part)?.name;

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

  // import the solution file and get the function to execute
  const solutionFilePath = getSolutionFileName(year, day);
  const importedModule = await importSolution(solutionFilePath);
  const functionToExecute = getFunctionToExecute(importedModule, part);

  logger.debug('starting execution of solution');

  // profile and execute solution code.
  const start = hrtime.bigint();
  const solution = functionToExecute(input);
  const end = hrtime.bigint();
  const executionTimeMs = Number(end - start);

  logger.debug('solution executed in: %d ms', executionTimeMs);

  return { solution, executionTimeMs };
};
