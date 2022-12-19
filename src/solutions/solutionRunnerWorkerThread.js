import { isMainThread, workerData, parentPort } from 'node:worker_threads';
import { hrtime } from 'node:process';
import { getType } from '../util.js';
import { workerMessageTypes } from './workerMessageTypes.js';
import { userAnswerTypeIsValid } from './userAnswerTypeIsValid.js';

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
    const stack = error instanceof Error
      ? error.stack
      : 'Thrown object was not Error';

    // Expect that if error is thrown here it's from userSolutionFn (not hrtime).
    // Catch this error and let the parent know the user's code threw an exception.
    parentPort.postMessage({
      type: workerMessageTypes.runtimeError,
      stack,
    });

    return;
  }

  if (userAnswerTypeIsValid(answer)) {
    parentPort.postMessage({
      type: workerMessageTypes.answer,
      answer,
      executionTimeNs: Number(end - start),
    });
  } else {
    parentPort.postMessage({
      type: workerMessageTypes.answerTypeInvalid,
      answerType: getType(answer),
    });
  }
};

/**
 * The "main" method of this worker, only executed if this isn't the main thread.
 * @private
 */
export const runWorker = async ({ solutionFileName, functionToExecute, input }) => {
  let userSolutionModule;

  try {
    logFromWorker('debug', 'worker loading user module: %s', solutionFileName);
    userSolutionModule = await import(solutionFileName);
  } catch (error) {
    parentPort.postMessage({
      type: workerMessageTypes.userModuleImportFailed,
      fileName: solutionFileName,
    });
    return;
  }

  logFromWorker('debug', 'worker loading executing user function: %s', functionToExecute);

  const userSolutionFunction = userSolutionModule[functionToExecute];

  // bail if user module didn't export the function we need.
  if (!userSolutionFunction || !(userSolutionFunction instanceof Function)) {
    parentPort.postMessage({
      type: workerMessageTypes.functionNotFound,
      name: functionToExecute,
    });
    return;
  }

  executeUserSolution(userSolutionFunction, input);
};

// Only run the worker on a child thread, not on the main thread!
if (!isMainThread) {
  await runWorker(workerData);
}
