import get from 'lodash.get';
import has from 'lodash.has';

const CONFIG = {
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    includeStackTrace: process.env.NODE_ENV !== 'production',
  },
  aoc: {
    year: process.env.AOC_YEAR || new Date().getFullYear(),
    authenticationToken: process.env.AOC_AUTHENTICATION_TOKEN || null,
    baseUrl: process.env.AOC_BASE_URL || 'https://adventofcode.com',
    userAgent: 'https://github.com/beakerandjake/advent-of-code-runner by beakerandjake',
    responseParsing: {
      rateLimitRegex: /Please wait (.*) before trying again./mi,
    },
  },
};

// TODO, set from command line too.

/**
 * Returns the configuration value of the specified key.
 * @param {String} key - The key of the config value to access
 * @returns {any}
 */
export const getConfigValue = (key) => {
  if (!has(CONFIG, key)) {
    throw new Error(`Unknown config key: ${key}`);
  }

  return get(CONFIG, key, null);
};
