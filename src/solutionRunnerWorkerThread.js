import { isMainThread, workerData, parentPort } from 'worker_threads';
import { hrtime } from 'process';

/**
 * Expects to be ran from a Worker. Loads the solution file and tries
 * to execute the solution within it. Communicates with parent process
 * via messages. When the solution is finished the results will be posted
 */

/**
 * Defines the type of messages that a Worker can send back to the main thread.
 */
export const workerMessageTypes = {
  log: 'LOG',
  answer: 'ANSWER',
  answerTypeInvalid: 'ANSWER_TYPE_INVALID',
  runtimeError: 'RUNTIME_ERROR',
  functionNotFound: 'MISSING_FUNCTION_ERROR',
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
    type: workerMessageTypes.log,
    level,
    message: `worker - ${message}`,
    meta: args,
  });
};

/**
 * Is the user provided answer a valid type?
 * @param {Any} answer
 */
const answerIsValidType = (answer) => Number.isFinite(answer) || (typeof answer === 'string' || answer instanceof String);

/**
 * Tries to return the name of the answers type.
 * @param {Any} answer
 */
const getAnswerType = (answer) => {
  if (typeof answer === 'number') {
    if (Number.isNaN(answer)) {
      return 'NaN';
    }
    if (!Number.isFinite(answer)) {
      return 'Infinity';
    }
  }

  return {}.toString.call(answer).split(' ')[1].slice(0, -1).toLowerCase();
};

/**
 * Execute the user solution function, measure the time it takes to execute
 * then post the result of the execution back to the parent.
 * @param {Function} userSolutionFn
 */
const executeUserSolution = (userSolutionFn, input) => {
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

  if (answerIsValidType(answer)) {
    parentPort.postMessage({
      type: workerMessageTypes.answer,
      answer,
      executionTimeNs: Number(end - start),
    });
  } else {
    parentPort.postMessage({
      type: workerMessageTypes.answerTypeInvalid,
      answerType: getAnswerType(answer),
    });
  }
};

if (!isMainThread) {
  logFromWorker('debug', 'attempting to execute function: %s on module: %s', workerData.functionToExecute, workerData.solutionFileName);

  const importedSolutionModule = await import(workerData.solutionFileName);
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
