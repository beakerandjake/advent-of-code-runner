import { hrtime } from 'node:process';
import { getSolutionFileName } from './io.js';
import { logger } from './logger.js';

/**
 * Attempts to dynamically import the solution module at the specified location.
 * @param {String} path
 */
const importSolution = async (path) => {
  logger.debug('importing solution file at: %s', path);

  try {
    return await import(path);
  } catch (error) {
    throw new Error(`Failed to load Solution file, ensure file exists: ${path}`);
  }
};

/**
 * Converts a duration in nanoseconds to a human readable duration, up to seconds.
 * @param {Number} nanoseconds
 */
const humanizeDuration = (nanoseconds) => {
  const seconds = Number(nanoseconds) / (1000 * 1000 * 1000);

  if (seconds >= 1) {
    return `${parseFloat(seconds.toFixed(2))}s`;
  }

  const milliseconds = nanoseconds / (1000 * 1000);

  if (milliseconds >= 1) {
    return `${milliseconds.toFixed(3)}ms`;
  }

  const microseconds = nanoseconds / 1000;

  if (microseconds >= 1) {
    return `${microseconds.toFixed(3)}μs`;
  }

  return `${nanoseconds}ns`;
};

/**
 * Runs the solution for the given day.
 * @param {Number} year
 * @param {Number} day
 */
export const solve = async (year, day, input) => {
  logger.verbose('running solution for year: %s, day: %s', year, day);

  const solutionFilePath = getSolutionFileName(year, day);

  const { solve: importedSolveFn } = await importSolution(solutionFilePath);

  if (!importedSolveFn || !(importedSolveFn instanceof Function)) {
    throw new Error('Solution file must export function: "solve" as a named export.');
  }

  const start = hrtime.bigint();

  importedSolveFn(input);

  const end = hrtime.bigint();

  logger.info('result: %s', humanizeDuration(Number(end - start)));

  return null;
};
