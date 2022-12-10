import { cwd } from 'process';
import { logger } from './logger.js';

export const createSolutionFiles = async (rootDirectory, year) => {
  logger.debug('%s', cwd());
};
