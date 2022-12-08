import { isMainThread, parentPort, workerData } from 'worker_threads';
import { exit, hrtime } from 'process';
import { SolutionFileMissingRequiredFunctionError } from './errors/SolutionFileMissingRequiredFunctionError.js';
import { SolutionFileNotFoundError } from './errors/SolutionFIleNotFoundError.js';
import { loadFileContents } from './io.js';

const MESSAGE_TYPES = {
  log: 'LOG',
  solution: 'SOLUTION',
};

export const messageTypes = { ...MESSAGE_TYPES };

if (!isMainThread) {
  /**
 * Post a message to the parent asking it to log data.
 * @param {*} message
 * @param  {...any} args
 */
  const log = (level, message, ...args) => {
    parentPort.postMessage(({
      type: MESSAGE_TYPES.log, level, message, params: [...args],
    }));
  };

  /**
 * Attempts to dynamically import the solution module at the specified location.
 * @param {String} path
 */
  const importSolution = async (path) => {
    log('debug', 'importing solution file at: %s', path);

    try {
      return await import(path);
    } catch (error) {
      throw new SolutionFileNotFoundError(`Failed to load Solution file, ensure file exists: ${path}`);
    }
  };

  /**
 * Attempts to return the function for the puzzle part
 * @param {Object} solution
 * @param {Number} part
 */
  const getFunctionToExecute = (module, functionName) => {
    const toReturn = module[functionName];

    if (!toReturn || !(toReturn instanceof Function)) {
      throw new SolutionFileMissingRequiredFunctionError(`Solution file must export function: "${functionName}" as a named export.`);
    }

    return toReturn;
  };

  log('warn', 'got worker data: %s', workerData);

  const importedModule = await importSolution(workerData.solutionFileName);
  const functionToExecute = getFunctionToExecute(importedModule, workerData.functionToExecute);
  const input = loadFileContents(workerData.inputFileName);

  // profile and execute solution code.
  const start = hrtime.bigint();
  const solution = functionToExecute(input);
  const end = hrtime.bigint();
  const executionTimeNs = Number(end - start);

  log('warn', 'executed in: %dns', executionTimeNs);

  parentPort.postMessage(({
    type: MESSAGE_TYPES.solution, solution, executionTimeNs,
  }));

  // console.log('worker data', workerData);

  // console.log('console logging from the the solutionRunner.js');
  // console.error('console error from the the solutionRunner.js');

// parentPort.postMessage('posting a message from the worker!');
}
