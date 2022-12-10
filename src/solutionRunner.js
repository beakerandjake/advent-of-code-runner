import { fileURLToPath } from 'url';
import { join, dirname } from 'path';
import { Worker } from 'worker_threads';
import { logger } from './logger.js';
import { getConfigValue } from './config.js';
import { workerMessageTypes } from './solutionRunnerWorkerThread.js';
import { fileExists } from './io.js';
import { SolutionFileNotFoundError } from './errors/index.js';

/**
 * Uses node worker threads to execute the user code in a separate context.
 * This adds some complexity and increases the performance cost to spin up the user code.
 * However it yields several benefits. First it's very easy to swallow up the console logs
 * and direct them to our logger where they can be formatted nicely. Second it keeps our event
 * loop free and allows the user to hit ctrl+c if their loops are taking too long.
 */

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
 * Returns an absolute path to the solution worker file.
 */
const getWorkerThreadFilePath = () => {
  // expect file exists in same directory as this.
  const pathToWorker = join(
    dirname(fileURLToPath(import.meta.url)),
    'solutionRunnerWorkerThread.js',
  );

  logger.debug('path to worker thread file: %s', pathToWorker);

  return pathToWorker;
};

/**
 * Spawns a worker thread to import the solution file
 * executes the solution function and returns the result and performance data.
 * @param {Number} year
 * @param {Number} day
 * @param {Number} part
 * @param {String} input
 * @returns {Promise<String|Number>}
 */
export const execute = async (year, day, part, input) => {
  logger.verbose('spawning worker to execute solution');

  const workerThreadFilePath = getWorkerThreadFilePath();
  const solutionFileName = getSolutionFileName(year, day);

  // before we spawn up a worker, ensure the js file actually exists.
  // it should always, but be safe.
  if (!await fileExists(workerThreadFilePath)) {
    throw new Error(`Could not file worker thread file at: ${workerThreadFilePath}`);
  }

  // ensure that the solution file actually exists
  // before spawning worker.
  if (!await fileExists(solutionFileName)) {
    throw new SolutionFileNotFoundError(`Could not find solution file, ensure file exits: ${solutionFileName}`);
  }

  return new Promise((resolve, reject) => {
    // spawn a Worker thread to run the user solution.
    const worker = new Worker(workerThreadFilePath, {
      workerData: {
        functionToExecute: getFunctionNameForPart(part),
        solutionFileName,
        input,
      },
      // prevent automatic piping of stdout and stderr because we're going to capture it.
      stdout: true,
      stderr: true,
    });

    // listen to messages from the worker.
    worker.on('message', (data) => {
      switch (data.type) {
        // worker just wants to log, pipe it through to our logger.
        case workerMessageTypes.log:
          logger.log(data.level, data.message, ...(data.meta || []));
          break;
          // worker finished executing and has a solution, we can resolve our promise.
        case workerMessageTypes.solution:
          resolve({ solution: data.solution, executionTimeNs: data.executionTimeNs });
          break;
        default:
          reject(Error(`solution runner worker send unknown message type: ${data.type}`));
          break;
      }
    });

    // handle uncaught exceptions.
    worker.on('error', (error) => reject(error));

    // handle potential edge case where worker does not send a solution message.
    worker.on('exit', () => reject(new Error('solution runners worker exited without sending a solution message')));

    // forward console.log and console.error messages to the main logger with special category.
    // TODO need special category / formatting for user output.
    worker.stdout.on('data', (chunk) => logger.info('got chunk from user solution: %s', chunk?.toString().trim()));
    worker.stderr.on('data', (data) => logger.info('got error from user solution: %s', data?.toString().trim()));
  });
};
