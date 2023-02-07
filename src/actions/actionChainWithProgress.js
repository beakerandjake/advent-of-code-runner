import ora from 'ora';
import { festiveStyle } from '../festive.js';
import { createChain } from './actionChain.js';

/**
 * @typedef {Object} ReportingLink
 * @property {Function} fn - The link function to execute
 * @property {String} message - The message to display when that link starts.
 */

/**
 * Returns a decorated action chain that will output progress to the cli.
 * @param {ReportingLink[]} links - Array of links to execute
 * @param {String} successMessage - Message displayed if all links in the chain are completed.
 */
export const createChainWithProgress = (links = [], successMessage = '') => {
  const spinner = ora({ spinner: 'christmas' });

  // ensure all links have required fields.
  links.forEach(({ fn, message }) => {
    if (fn == null || !(fn instanceof Function)) {
      throw new Error('link has null or undefined "fn" field');
    }

    if (!message) {
      throw new Error('link has null or undefined "message" field');
    }
  });

  // create a wrapper function for each link which updates the spinner
  // with a message when that link starts.
  const decoratedActions = links.map(({ fn, message }) => async (...args) => {
    const festiveMessage = festiveStyle(message);
    spinner.isSpinning ? (spinner.text = festiveMessage) : spinner.start(festiveMessage);
    return fn(...args);
  });

  const chain = createChain(decoratedActions);

  // return a wrapper around the action chain that will
  // stop the spinner when the chain finishes
  return async (args) => {
    try {
      const completed = await chain(args);
      completed ? spinner.succeed(festiveStyle(successMessage)) : spinner.stop();
      return completed;
    } catch (error) {
      spinner.fail();
      throw error;
    }
  };
};
