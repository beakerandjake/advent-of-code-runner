import { getConfigValue } from '../config.js';

const useMockApi = getConfigValue('aoc.useMockApi');

const { downloadInput, submitSolution } = useMockApi
  ? await import('./mockApi.js')
  : await import('./api.js');

export { downloadInput, submitSolution };
