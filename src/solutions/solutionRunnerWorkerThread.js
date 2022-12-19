import { isMainThread, workerData, parentPort } from 'node:worker_threads';
import { hrtime } from 'node:process';
import { getType } from '../util.js';
import { importUserSolutionFile } from './importUserSolutionFile.js';
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
if (!isMainThread) {
  console.log('hello from worker', workerData);
  console.log('the thing is', await importUserSolutionFile('asdf'));

  logFromWorker('debug', 'attempting to execute function: %s on module: %s', workerData.functionToExecute, workerData.solutionFileName);

  const importedSolutionModule = await importUserSolutionFile(workerData.solutionFileName);
  console.log('module is ', importedSolutionModule);

  const functionToExecute = importedSolutionModule[workerData.functionToExecute];

  // ensure function is present and is actually a function.
  if (!functionToExecute || !(functionToExecute instanceof Function)) {
    parentPort.postMessage({
      type: workerMessageTypes.functionNotFound,
      name: workerData.functionToExecute,
    });
  } else {
    executeUserSolution(functionToExecute);
  }
}
