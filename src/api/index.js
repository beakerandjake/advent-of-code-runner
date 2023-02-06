/* istanbul ignore file */
import { getConfigValue } from '../config.js';
import { rateLimitDecorator } from './rateLimitDecorator.js';
import { rateLimitedActions } from './rateLimit.js';
import { logger } from '../logger.js';

/**
 * Decorates the api methods with rate limiting.
 * @param {Object} module - The imported api to decorate.
 */
const decorateApiWithRateLimiting = ({ downloadInput, submitSolution }) => {
  logger.debug('decorating api with rate limiting');
  return {
    downloadInput: rateLimitDecorator(
      downloadInput,
      rateLimitedActions.downloadInput,
      'Timeout period for downloading an input file has not expired.'
    ),
    submitSolution: rateLimitDecorator(
      submitSolution,
      rateLimitedActions.submitAnswer,
      'Timeout period for submitting an answer has not expired.'
    ),
  };
};

const useMockApi = getConfigValue('aoc.mockApi.enabled');

const { downloadInput, submitSolution } = useMockApi
  ? await import('./mockApi.js')
  : decorateApiWithRateLimiting(await import('./api.js'));

export { downloadInput, submitSolution };
