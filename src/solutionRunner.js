import { isMainThread, workerData, parentPort } from 'worker_threads';
import { SolutionFileMissingRequiredFunctionError } from './errors/SolutionFileMissingRequiredFunctionError.js';
import { SolutionRaisedError } from './errors/SolutionRaisedError.js';
import { measureExecutionTime } from './measureExecutionTime.js';

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

if (isMainThread) {
  // if executing from the main thread, then export a function
  // to spawn the worker and handle the results.

  const { fileURLToPath } = await import('url');
  const { Worker } = await import('worker_threads');
  const { logger } = await import('./logger.js');

  executeFn = async (solutionFileName, functionToExecute, input) => {
    logger.debug('spawning worker to execute solution');

    return new Promise((resolve, reject) => {
      const worker = new Worker(fileURLToPath(import.meta.url), {
        workerData: {
          solutionFileName,
          functionToExecute,
          input,
        },
        stdout: true,
        stderr: true,
      });

      // listen to messages from the worker, this is how we will get the solution.
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

      // handle uncaught exceptions from user code we are executing.
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
      type: WORKER_MESSAGE_TYPES.solution,
      solution: result,
      executionTimeNs,
    });
  } catch (error) {
    throw new SolutionRaisedError('Error raised when running solution', error);
  }
}

export const execute = executeFn;
