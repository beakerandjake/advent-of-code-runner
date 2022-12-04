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
      rateLimitRegex: /please wait (.*) before trying again/mi,
      sanitizers: [
        // remove return to day link
        { pattern: /\[Return to Day \d+\]/, replace: '' },
        // remove help message
        {
          pattern: 'If you\'re stuck, make sure you\'re using the full input data; there are also some general tips on the about page, or you can ask for hints on the subreddit.',
          replace: '',
        },
        {
          pattern: /\(You guessed .*\)/m,
          replace: '',
        },
        // standardize whitespace
        {
          pattern: /\s\s+/g,
          replace: ' ',
        },
      ],
    },
    submitRateLimitMs: 300000,
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
