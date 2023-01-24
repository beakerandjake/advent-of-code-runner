import { pathExists } from 'fs-extra/esm';
import { getConfigValue } from '../config.js';

/**
 * Does the users README file exist?
 */
export const readmeExists = async () => pathExists(getConfigValue('paths.readme'));

/**
 * Does the users .env file exist?
 */
export const dotEnvExists = async () => pathExists(getConfigValue('paths.templates.dotenv.dest'));
