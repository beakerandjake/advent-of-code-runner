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
  result: 'SOLUTION',
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
 * Execute the user solution function, measure the time it takes to execute
 * then post the result of the execution back to the parent.
 * @param {Function} userSolutionFn
 */
const executeUserSolution = (userSolutionFn, input) => {
  try {
    const start = hrtime.bigint();
    const result = userSolutionFn(input);
    const end = hrtime.bigint();

    parentPort.postMessage({
      type: workerMessageTypes.result,
      solution: result,
      executionTimeNs: Number(end - start),
    });
  } catch (error) {
    // instead of throwing a SolutionRuntimeError here, post a message to the parent
    parentPort.postMessage({
      type: workerMessageTypes.runtimeError,
      cause: error,
    });
  }
};

if (!isMainThread) {
  logFromWorker('debug', 'attempting to execute function: %s on module: %s', workerData.functionName, workerData.solutionFileName);

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
