import { pathExists } from 'fs-extra/esm';
import { getConfigValue } from '../config.js';

/**
 * Does the users README file exist?
 */
export const readmeExists = async () => pathExists(getConfigValue('paths.readme'));
