import { statsAction } from '../commands/stats.js';
import { getConfigValue } from '../config.js';
import { logger } from '../logger.js';

/**
 * If readme auto updates are enabled, will update the progress table of the readme
 */
export const autoUpdateReadme = async () => {
  if (getConfigValue('disableReadmeAutoSaveProgress')) {
    logger.debug('not updating readme file, auto update disabled');
    return;
  }
  logger.debug('auto updating readme by invoking statsAction');
  await statsAction({ save: true });
};
