/* eslint-disable no-await-in-loop */
import { logger } from '../logger.js';

/**
 * Run the pre action chain and the action.
 * @private
 */
export const runAction = async (args, actionFn, preActionFnChain) => {
  logger.debug('action runner: executing pre-action function chain (length: %s)', preActionFnChain.length);
  let chainArgs = args;

  // run each function in the chain one by one, passing arguments along the way.
  for (const preAction of preActionFnChain) {
    try {
      logger.debug('action runner: executing pre-chain function: %s', preAction.name);
      const newArgs = await preAction(chainArgs);

      if (newArgs != null) {
        logger.silly('action runner: pre-chain function: %s updated the args to', preAction.name, chainArgs);
        chainArgs = newArgs;
      }
    } catch (error) {
      logger.debug('action runner: executing halted because error was raised by pre-chain function: %s', preAction.name);
      throw error;
    }
  }

  logger.debug('action runner: invoking action function');
  return actionFn(chainArgs || {});
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
 * @param {Function} actionFn - The action to execute, will be passed the args
 * @param {Function[]} preActionFnChain - Each function to execute before the action.
 */
export const createAction = (actionFn, preActionFnChain = []) => {
  // bail if action is not function.
  if (!actionFn || !(actionFn instanceof Function)) {
    throw new Error('Expected action to be a function');
  }

  // bail if chain is not array.
  if (!Array.isArray(preActionFnChain) || preActionFnChain.some((x) => !(x instanceof Function))) {
    throw new Error('Expected function chain is an array of functions');
  }

  return async (args) => runAction(args || {}, actionFn, preActionFnChain);
};
