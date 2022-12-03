import { getSolutionFileName } from './io.js';
import { logger } from './logger.js';

/**
 * Attempts to dynamically import the solution module at the specified location.
 * @param {String} path
 */
export const importSolution = async (path) => {
  logger.debug('importing solution file at: %s', path);

  try {
    return await import(path);
  } catch (error) {
    throw new Error(`Failed to load Solution file, ensure file exists: ${path}`);
  }
};

/**
 * Runs the solution for the given day.
 * @param {Number} year
 * @param {Number} day
 */
export const runDay = async (year, day, input) => {
  logger.verbose('running solution for year: %s, day: %s', year, day);

  const solutionFilePath = getSolutionFileName(year, day);

  const { solve } = await importSolution(solutionFilePath);

  if (!solve || !(solve instanceof Function)) {
    throw new Error('Solution file must export function: "solve" as a named export.');
  }

  return null;
};
