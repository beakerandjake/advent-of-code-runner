import { get, result } from 'lodash-es';
import { join } from 'path';
import { hrtime } from 'process';
import { Worker } from 'worker_threads';
import { SolutionFileMissingRequiredFunctionError } from './errors/SolutionFileMissingRequiredFunctionError.js';
import { SolutionFileNotFoundError } from './errors/SolutionFIleNotFoundError.js';
import { getConfigValue } from './config.js';
import { logger } from './logger.js';
import { getInputFileName } from './input.js';

import { messageTypes } from './solutionRunner.js';

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

export const solve2 = async (year, day, part) => {
  logger.verbose('running solution for year: %s, day: %s, part: %s', year, day, part);

  return new Promise((resolve, reject) => {
    const worker = new Worker('./src/solutionRunner.js', {
      workerData: {
        solutionFileName: getSolutionFileName(year, day),
        functionToExecute: getFunctionNameForPart(part),
        inputFileName: getInputFileName(year, day),
      },
      stdout: true,
      stderr: true,
    });

    // all messages from worker will be passed to logger.
    worker.on('message', (value) => {
      switch (value.type) {
        case 'LOG':
          logger.log(value.level, value.message, ...(value.params || []));
          break;
        case 'SOLUTION':
          resolve({ solution: value.solution, executionTimeNs: value.executionTimeNs });
          break;
        default:
          break;
      }
    });

    worker.on('error', (error) => logger.error('got error from worker: %s', error));
    worker.on('exit', (code) => logger.info('got code from worker: %s', code));
    worker.stdout.on('data', (chunk) => logger.info('got chunk from worker: %s', chunk?.toString().trim()));
    worker.stderr.on('data', (data) => logger.info('got error from worker: %s', data?.toString().trim()));
  });
};
