import { statsAction } from '../commands/stats.js';
import { getConfigValue } from '../config.js';
import { logger } from '../logger.js';

/**
 * If readme auto updates are enabled, will update the progress table of the readme
 */
export const autoUpdateReadme = async () => {
  if (getConfigValue('disableReadmeAutoSaveProgress')) {
    logger.verbose('not updating readme file, auto update disabled');
    return;
  }
  await statsAction({ save: true });
};
