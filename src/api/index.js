/* istanbul ignore file */
import { getConfigValue } from '../config.js';
import { rateLimitDecorator } from './rateLimitDecorator.js';
import { rateLimitedActions } from './rateLimit.js';
import { logger } from '../logger.js';

/**
 * Decorates the api methods with rate limiting.
 * @param {Object} module - The imported api to decorate.
 */
const decorateApiWithRateLimiting = ({ getInput, postAnswer }) => {
  logger.debug('decorating api with rate limiting');
  return {
    getInput: rateLimitDecorator(
      getInput,
      rateLimitedActions.getInput,
      'Timeout period for downloading an input file has not expired.'
    ),
    postAnswer: rateLimitDecorator(
      postAnswer,
      rateLimitedActions.postAnswer,
      'Timeout period for submitting an answer has not expired.'
    ),
  };
};

const useMockApi = getConfigValue('aoc.mockApi.enabled');

const { getInput, postAnswer } = useMockApi
  ? await import('./mockApi.js')
  : decorateApiWithRateLimiting(await import('./api.js'));

export { getInput, postAnswer };
