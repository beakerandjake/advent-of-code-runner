import { getConfigValue } from '../config.js';
import { logger } from '../logger.js';

const useMockApi = getConfigValue('aoc.useMockApi');

logger.debug('using mock api: %s', useMockApi);

const { downloadInput, submitSolution } = useMockApi
  ? await import('./mockApi.js')
  : await import('./api.js');

export { downloadInput, submitSolution };
