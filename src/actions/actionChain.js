import { logger } from '../logger.js';

/**
 * Helper function for consistent logging in the chain.
 */
const chainLog = (message, ...rest) => {
  logger.debug(`(action chain) ${message}`, ...rest);
};

/**
 * Run the pre action chain and the action.
 * @private
 */
export const executeChain = async (links, args = {}) => {
  chainLog('executing action chain (length: %s)', links.length);
  let currentArgs = args;
  let iterations = 0;

  // run each function in the chain sequentially
  for (const link of links) {
    iterations += 1;

    try {
      chainLog('executing link (%s/%s): %s', iterations, links.length, link.name);

      // eslint-disable-next-line no-await-in-loop
      const result = await link(currentArgs);

      // if false is explicitly returned, that means the link wants the chain to halt.
      if (result === false) {
        chainLog('link: %s has halted execution', link.name);
        break;
      }

      // if a value is returned, that means the link wants the args updated.
      if (result) {
        // not logging the actual args on purpose, could contain secrets...
        chainLog('link: %s has updated the args', link.name);
        currentArgs = result;
      }
    } catch (error) {
      logger.silly('executing halted because error was raised by link: %s', link.name);
      throw error;
    }
  }

  chainLog('successfully executed (%s/%s)', iterations, links.length);
};

/**
 * Returns a function which can be executed via command line, this function will:
 * 1. Invoke each function in the array sequentially. Each function:
 *      - Is passed the current args object
 *      - Can modify the current args object by returning a new object.
 *      - Can halt the execution of the chain by returning false.
 *      - Can halt the execution of the chain by throwing an exception.
 * If any function in the chain causes a halt, then chains which come after it are not executed.
 *
 * @param {Function[]} actions - The functions to execute.
 */
export const createChain = (actions = []) => {
  if (!Array.isArray(actions) || actions.some((x) => !(x instanceof Function))) {
    throw new Error('Expected an array of functions');
  }

  // could probably do some fun stuff here with a fluent api..

  return async (args) => executeChain(actions, args);
};
