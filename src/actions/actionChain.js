/* eslint-disable no-await-in-loop */
import { logger } from '../logger.js';

/**
 * Run the pre action chain and the action.
 * @private
 */
export const executeChain = async (links, args) => {
  logger.debug('action runner: executing function chain (length: %s)', links.length);
  let currentArgs = args;
  let iterations = 0;

  // run each function in the chain sequentially
  for (const link of links) {
    iterations += 1;

    try {
      logger.silly('action runner: executing function: %s', link.name);
      const result = await link(currentArgs);

      // if false is explicitly returned, that means the link wants the chain to halt.
      if (result === false) {
        logger.silly('action runner: function: %s has halted execution', link.name);
        break;
      }

      // if a value is returned, that means the link wants the args updated.
      if (result) {
        logger.silly('action runner: function: %s updated the args to', link.name, currentArgs);
        currentArgs = result;
      }
    } catch (error) {
      logger.debug('action runner: executing halted because error was raised by function: %s', link.name);
      throw error;
    }
  }

  logger.debug('action runner: successfully executed (%s/%s)', iterations, links.length);
};

/**
 * Returns a function which can be executed via command line, this function will:
 * 1. Run each function in the pre action chain before executing the action function.
 *      - Each pre action function:
 *        - Is passed the current args
 *        - Can modify the args by returning a new object.
 *        - Can halt execution by throwing an exception.
 *
 * If any pre action function throws, then execution is halted and the actionFn will not be called.
 *
 * 2. Once all pre action functions are finished:
 *      - The actionFn will be invoked with the args.
 * @param {Function[]} actions - The functions to execute.
 */
export const createChain = (actions = []) => {
  // bail if chain is not array.
  if (!Array.isArray(actions) || actions.some((x) => !(x instanceof Function))) {
    throw new Error('Expected an array of functions');
  }

  return async (args) => executeChain(actions, args);
};
