import { isMainThread, workerData, parentPort } from 'node:worker_threads';
import { hrtime } from 'node:process';
import { getType, get } from '../util.js';
import { answerTypeIsValid } from '../validation/validateAnswer.js';
import { workerMessageTypes } from './workerMessageTypes.js';
import { importUserSolutionModule } from './importUserSolutionModule.js';
import {
  SolutionWorkerMissingDataError,
  UserSolutionAnswerInvalidError,
  UserSolutionMissingFunctionError,
  UserSolutionThrewError,
} from '../errors/solutionWorkerErrors.js';

/**
 * Expects to be ran from a Worker. Loads the solution file and tries
 * to execute the solution within it. Communicates with parent process
 * via messages. When the solution is finished the results will be posted
 */

/**
 * Sends a message from the Worker to the main thread asking the main thread
 * to log the specified data.
 * @private
 * @param {String} level
 * @param {String} message
 * @param  {...Any} args
 */
export const logFromWorker = (level, message, ...args) => {
  parentPort.postMessage({
    type: workerMessageTypes.log,
    level,
    message: `worker - ${message}`,
    meta: args,
  });
};

/**
 * Execute the user solution function, measure the time it takes to execute
 * then post the result of the execution back to the parent.
 * @private
 * @param {Function} userSolutionFn
 */
export const executeUserSolution = (userSolutionFn, input) => {
  let start;
  let end;
  let answer;

  try {
    start = hrtime.bigint();
    answer = userSolutionFn(input);
    end = hrtime.bigint();
  } catch (error) {
    throw new UserSolutionThrewError(error);
  }

  if (!answerTypeIsValid(answer)) {
    throw new UserSolutionAnswerInvalidError(getType(answer));
  }

  parentPort.postMessage({
    type: workerMessageTypes.answer,
    answer,
    executionTimeNs: Number(end - start),
  });
};

/**
 * The "main" method of this worker, only executed if this isn't the main thread.
 * @private
 */
export const runWorker = async ({ solutionFileName, functionToExecute, input } = {}) => {
  // expect worker data to have required fields
  if (!solutionFileName || !functionToExecute || !input) {
    throw new SolutionWorkerMissingDataError();
  }

  logFromWorker('debug', 'worker loading user module: %s', solutionFileName);
  const userSolutionModule = await importUserSolutionModule(solutionFileName);
  const userSolutionFunction = get(userSolutionModule, functionToExecute);

  // bail if user module didn't export the function we need.
  if (!userSolutionFunction || !(userSolutionFunction instanceof Function)) {
    throw new UserSolutionMissingFunctionError(functionToExecute);
  }

  logFromWorker('debug', 'worker loading executing user function: %s', functionToExecute);
  executeUserSolution(userSolutionFunction, input);
};

// Only run the worker on a child thread, not on the main thread!
if (!isMainThread) {
  await runWorker(workerData);
}
