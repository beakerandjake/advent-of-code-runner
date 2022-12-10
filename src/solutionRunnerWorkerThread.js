import { isMainThread, workerData, parentPort } from 'worker_threads';
import { SolutionRaisedError, SolutionFileMissingRequiredFunctionError } from './errors/index.js';
import { measureExecutionTime } from './measureExecutionTime.js';

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

if (!isMainThread) {
  logFromWorker('debug', 'importing solution module from file: %s', workerData.solutionFileName);

  const importedSolutionModule = await import(workerData.solutionFileName);
  const functionToExecute = importedSolutionModule[workerData.functionToExecute];

  // ensure function is present and is actually a function.
  if (!functionToExecute || !(functionToExecute instanceof Function)) {
    throw new SolutionFileMissingRequiredFunctionError(`Solution file must export function: "${workerData.functionToExecute}" as a named export.`);
  }

  try {
    logFromWorker('debug', 'executing solution function: %s', workerData.functionToExecute);

    const { result, executionTimeNs } = measureExecutionTime(functionToExecute)(workerData.input);

    parentPort.postMessage({
      type: workerMessageTypes.result,
      solution: result,
      executionTimeNs,
    });
  } catch (error) {
    throw new SolutionRaisedError('Error raised when running solution', { cause: error });
  }
}
