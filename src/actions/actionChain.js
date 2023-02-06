import { logger } from '../logger.js';

/**
 * Could get really crazy with this and have the chain return a value.
 * That would let us nest chains within chains :D
 *
 * Could also have decorator links like NOT, OR
 *
 * Would be cool to support a .requires property on functions.
 * It would check the args for each value in the requires array
 * and throw if that value was missing from the args.
 *
 */

/**
 * Run the pre action chain and the action.
 * @private
 */
export const executeChain = async (links, args = {}) => {
  logger.info('executing action chain (length: %s)', links.length);
  let currentArgs = args;
  let iterations = 0;

  // run each function in the chain sequentially
  for (const link of links) {
    iterations += 1;

    try {
      logger.info(
        'executing link (%s/%s): %s',
        iterations,
        links.length,
        link.name
      );

      // eslint-disable-next-line no-await-in-loop
      const result = await link(currentArgs);

      // if false is explicitly returned, that means the link wants the chain to halt.
      if (result === false) {
        logger.info('link: %s has halted execution', link.name);
        break;
      }

      // if any value except true/undefined is returned, that means the link wants the args updated.
      // true is ignored to allow assert actions pass eslint rule "consistent-return"
      // undefined is ignored to support void links.
      if (result !== true && result !== undefined) {
        // not logging the actual args on purpose, could contain secrets...
        logger.silly('link: %s has updated the action chain args', link.name);
        currentArgs = { ...currentArgs, ...result };
      }
    } catch (error) {
      logger.info(
        'executing halted because error was raised by link: %s',
        link.name
      );
      throw error;
    }
  }

  logger.info(
    'successfully executed action chain (%s/%s)',
    iterations,
    links.length
  );
  return iterations === links.length;
};

/**
 * Returns a function which can be executed via command line:
 * This function will invoke each function in the array sequentially, each function:
 *  - Is passed the current args object
 *  - Can return a bool: the chain continues (true) or halts (false).
 *  - Can return an object: the value will be spread onto the args object (the chain continues).
 *  - Can be void (return undefined): the chain continues and args are not changed.
 *  - Can raise an Error: the chain halts.
 * This function will return a boolean indicating whether or not each link ran.
 * If any function in the chain causes a halt, then chains which come after it are not executed.
 * @param {Function[]} links - The functions to execute.
 */
export const createChain = (links = []) => {
  if (!Array.isArray(links) || links.some((x) => !(x instanceof Function))) {
    throw new Error('Expected an array of functions');
  }

  // could probably do some fun stuff here with a fluent api..

  return async (args) => executeChain(links, args);
};
