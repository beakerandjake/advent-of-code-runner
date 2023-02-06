import { pathExists } from 'fs-extra/esm';
import { join } from 'node:path';
import { env } from 'node:process';
import { Worker } from 'node:worker_threads';
import { envOptions, getConfigValue } from '../config.js';
import {
  SolutionWorkerEmptyInputError,
  SolutionWorkerExitWithoutAnswerError,
  UserSolutionFileNotFoundError,
} from '../errors/solutionWorkerErrors.js';
import { splitLines } from '../inputs/parseInput.js';
import { logger } from '../logger.js';
import { workerMessageTypes } from './workerMessageTypes.js';

/**
 * Uses node worker threads to execute the user code in a separate context.
 * This adds some complexity and increases the performance cost to spin up the user code.
 * However it yields several benefits. First it's very easy to swallow up the console logs
 * and direct them to our logger where they can be formatted nicely. Second it keeps our event
 * loop free and allows the user to hit ctrl+c if their loops are taking too long.
 */

/**
 * Returns the file name for a solution file for the given year and day.
 * @private
 * @param {Number} year
 * @param {Number} day
 */
export const getSolutionFileName = (day) =>
  join(
    getConfigValue('paths.solutionsDir'),
    `day_${day.toString().padStart(2, '0')}.js`
  );

/**
 * Returns the name of the function to execute for level.
 * @private
 * @param {Number} level
 */
export const getFunctionNameForLevel = (level) => {
  const functionName = getConfigValue('solutionRunner.levelFunctions').find(
    (x) => x.key === level
  )?.name;

  if (!functionName) {
    throw new Error(`Unknown solution level: ${level}`);
  }

  return functionName;
};

/**
 * Runs the worker in a new thread and returns a promise
 * that is resolved or rejected with the results of the worker
 * @private
 * @param {String} workerThreadFileName
 * @param {Object} workerData
 */
export const spawnWorker = async (workerThreadFileName, workerData) =>
  new Promise((resolve, reject) => {
    // omit the auth token from the workers env.
    const { [envOptions.authenticationToken]: _, ...workerEnv } = env;
    // spawn the worker thread
    const worker = new Worker(workerThreadFileName, {
      workerData,
      env: workerEnv,
    });
    // listen to messages from the worker thread.
    worker.on('message', (data) => {
      switch (data.type) {
        // worker just wants to log, pipe it through to our logger.
        case workerMessageTypes.log:
          logger.log(data.level, data.message, ...(data.meta || []));
          break;
        // worker finished executing and has posted an answer
        case workerMessageTypes.answer:
          resolve({ answer: data.answer, runtimeNs: data.runtimeNs });
          break;
        default:
          reject(
            new Error(
              `Solution Worker provided unknown message type: ${data.type}`
            )
          );
          break;
      }
    });

    // handle any exceptions raised by the worker.
    worker.on('error', (error) => reject(error));
    // handle potential edge case where worker does not send a solution message.
    worker.on('exit', () => reject(new SolutionWorkerExitWithoutAnswerError()));
  });

/**
 * Spawns a worker thread to import the solution file
 * executes the solution function and returns the result and performance data.
 * @param {Number} day
 * @param {Number} level
 * @param {String} input
 * @throws {UserSolutionAnswerInvalidError}
 * @throws {UserSolutionFileNotFoundError}
 * @throws {UserSolutionMissingFunctionError}
 * @throws {UserSolutionThrewError}
 * @throws {SolutionWorkerEmptyInputError}
 * @throws {SolutionWorkerExitWithoutAnswerError}
 */
export const execute = async (day, level, input) => {
  logger.debug('spawning worker thread to execute user solution', {
    day,
    level,
  });

  if (!input) {
    throw new SolutionWorkerEmptyInputError();
  }

  // grab values which could fail before spawning the worker thread.
  // makes debugging the worker easier, reduces the amount of things that can fail
  const solutionFileName = getSolutionFileName(day);
  const functionToExecute = getFunctionNameForLevel(level);
  const workerThreadFileName = getConfigValue('paths.solutionRunnerWorkerFile');

  // ensure the user actually has the file we're trying to execute.
  if (!(await pathExists(solutionFileName))) {
    throw new UserSolutionFileNotFoundError(solutionFileName);
  }

  const workerData = {
    solutionFileName,
    functionToExecute,
    input,
    lines: splitLines(input),
  };

  return spawnWorker(workerThreadFileName, workerData);
};
