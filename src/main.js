import { getSessionToken } from './getSessionToken.js';
import { logger } from './logger.js';

logger.info('hello world it is %s', new Date().toISOString());

const token = getSessionToken();
