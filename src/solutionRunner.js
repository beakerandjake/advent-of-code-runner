import { isMainThread, workerData, parentPort } from 'worker_threads';
import { SolutionRaisedError, SolutionFileMissingRequiredFunctionError, SolutionFileNotFoundError } from './errors/index.js';
import { measureExecutionTime } from './measureExecutionTime.js';

/**
 * Uses node worker threads to execute the user code in a separate context.
 * This adds some complexity and increases the performance cost to spin up the user code.
 * However it yields several benefits. First it's very easy to swallow up the console logs
 * and direct them to our logger where they can be formatted nicely. Second it keeps our event
 * loop free and allows the user to hit ctrl+c if their loops are taking too long.
 */

// this is defined here so it can be a named export.
let executeFn = async () => { throw new Error('Function is only implemented on main thread!'); };

/**
 * Defines the type of messages that a Worker can send back to the main thread.
 */
const WORKER_MESSAGE_TYPES = {
  log: 'LOG',
  solution: 'SOLUTION',
};

/**
 * Sends a message from the Worker to the main thread asking the main thread
 * to log the specified data.
 * @param {String} level
 * @param {String} message
 * @param  {...Any} args
 */
const logFromWorker = (level, message, ...args) => {
  parentPort.postMessage({
    type: WORKER_MESSAGE_TYPES.log,
    level,
    message: `worker - ${message}`,
    meta: args,
  });
};

/**
 * Imports the module at the specified file name.
 * @param {String} fileName
 * @throws {SolutionFileNotFoundError}
 */
const importSolutionModule = async (fileName) => {
  try {
    return await import(fileName);
  } catch (error) {
    logFromWorker('warn', 'failed to load solution module: %s', error);
    throw new SolutionFileNotFoundError(`Failed to load Solution file, ensure file exists: ${fileName}`);
  }
};

if (isMainThread) {
  // if executing from the main thread, then export a function
  // to spawn the worker and handle the results.

  // dynamic imports here to keep running a worker as fast as possible.
  const { join } = await import('path');
  const { fileURLToPath } = await import('url');
  const { Worker } = await import('worker_threads');
  const { logger } = await import('./logger.js');
  const { getConfigValue } = await import('./config.js');

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

  executeFn = async (year, day, part, input) => {
    logger.debug('spawning worker to execute solution');

    return new Promise((resolve, reject) => {
      // spawn a Worker thread to run the user solution.
      const worker = new Worker(fileURLToPath(import.meta.url), {
        workerData: {
          solutionFileName: getSolutionFileName(year, day),
          functionToExecute: getFunctionNameForPart(part),
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
          case WORKER_MESSAGE_TYPES.log:
            logger.log(data.level, data.message, ...(data.meta || []));
            break;
          // worker finished executing and has a solution, we can resolve our promise.
          case WORKER_MESSAGE_TYPES.solution:
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
      worker.stdout.on('data', (chunk) => logger.info('got chunk from worker: %s', chunk?.toString().trim()));
      worker.stderr.on('data', (data) => logger.info('got error from worker: %s', data?.toString().trim()));
    });
  };
} else {
  // if executing as a worker, then load the solution and execute it.
  // post the results back to the main thread.

  logFromWorker('debug', 'importing solution module from file: %s', workerData.solutionFileName);

  const importedSolutionModule = await importSolutionModule(workerData.solutionFileName);
  const functionToExecute = importedSolutionModule[workerData.functionToExecute];

  // ensure function is present and is actually a function.
  if (!functionToExecute || !(functionToExecute instanceof Function)) {
    throw new SolutionFileMissingRequiredFunctionError(`Solution file must export function: "${workerData.functionToExecute}" as a named export.`);
  }

  try {
    logFromWorker('debug', 'executing solution function: %s', workerData.functionToExecute);

    const { result, executionTimeNs } = measureExecutionTime(functionToExecute)(workerData.input);

    parentPort.postMessage({
      type: WORKER_MESSAGE_TYPES.solution,
      solution: result,
      executionTimeNs,
    });
  } catch (error) {
    throw new SolutionRaisedError('Error raised when running solution', error);
  }
}

/**
 * Execute the solution using a worker thread and returns the result.
 */
export const execute = executeFn;
