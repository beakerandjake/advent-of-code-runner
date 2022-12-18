import { join } from 'node:path';
import { Worker } from 'node:worker_threads';
import { logger } from '../logger.js';
import { getConfigValue } from '../config.js';
import { workerMessageTypes } from './solutionRunnerWorkerThread.js';
import { fileExists, loadFileContents } from '../persistence/io.js';
import {
  SolutionMissingFunctionError,
  SolutionNotFoundError,
  SolutionAnswerInvalidError,
  SolutionRuntimeError,
  EmptyInputError,
} from '../errors/index.js';

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
export const getSolutionFileName = (day) => join(getConfigValue('paths.solutionsDir'), `day_${day}.js`);

/**
 * Returns the name of the function to execute for the puzzles part.
 * @private
 * @param {Number} part
 */
export const getFunctionNameForPart = (part) => {
  const functionName = getConfigValue('solutionRunner.partFunctions').find((x) => x.key === part)?.name;

  if (!functionName) {
    throw new Error(`Unknown solution part: ${part}`);
  }

  return functionName;
};

/**
 * Spawns a worker thread to import the solution file
 * executes the solution function and returns the result and performance data.
 * @param {Number} day
 * @param {Number} part
 * @param {String} input
 * @throws {SolutionFileMissingRequiredFunctionError}
 * @throws {SolutionFileNotFoundError}
 * @throws {SolutionRunnerExitError}
 * @throws {SolutionRuntimeError}
 * @throws {UnexpectedSolutionRunnerWorkerError}
 * @throws {UnknownSolutionRunnerWorkerMessageTypeError}
 */
export const execute = async (day, part, input) => {
  logger.verbose('spawning worker to execute solution', { day, part });

  if (!input) {
    throw new EmptyInputError();
  }

  // grab values which could fail before spawning the worker thread.
  // makes debugging the worker easier, reduces the amount of things that can fail

  const functionToExecute = getFunctionNameForPart(part);
  const workerThreadScript = await loadFileContents(getConfigValue('paths.solutionRunnerWorkerFile'));
  const solutionFileName = getSolutionFileName(day);

  // ensure the user actually has the file we're trying to execute.
  if (!await fileExists(solutionFileName)) {
    throw new SolutionNotFoundError(solutionFileName);
  }

  return new Promise((resolve, reject) => {
    // spawn a Worker thread to run the user solution.
    const worker = new Worker(workerThreadScript, {
      eval: true,
      workerData: {
        functionToExecute,
        solutionFileName,
        input,
      },
    });

    // listen to messages from the worker.
    worker.on('message', (data) => {
      switch (data.type) {
        // worker just wants to log, pipe it through to our logger.
        case workerMessageTypes.log:
          logger.log(data.level, data.message, ...(data.meta || []));
          break;
        // worker finished executing and has posted an answer
        case workerMessageTypes.answer:
          resolve({ answer: data.answer, executionTimeNs: data.executionTimeNs });
          break;
        // user code provided invalid answer type.
        case workerMessageTypes.answerTypeInvalid:
          reject(new SolutionAnswerInvalidError(data.answerType));
          break;
        // user code threw error
        case workerMessageTypes.runtimeError:
          reject(new SolutionRuntimeError(data.stack));
          break;
        // user code missing required function.
        case workerMessageTypes.functionNotFound:
          reject(new SolutionMissingFunctionError(data.name));
          break;
        default:
          reject(new Error(`Solution Worker provided unknown message type: ${data.type}`));
          break;
      }
    });

    // handle uncaught exceptions.
    worker.on('error', (error) => reject(new Error('Solution Worker raised unexpected Error', { cause: error })));
    // handle potential edge case where worker does not send a solution message.
    worker.on('exit', () => reject(new Error('Solution Worker exited without posting answer')));
  });
};
