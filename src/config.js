import get from 'lodash.get';
import has from 'lodash.has';

const CONFIG = {
    logging: {
        level: process.env.LOG_LEVEL || 'info',
        includeStackTrace: process.env.NODE_ENV !== 'production'
    },
    aoc: {
        year: process.env.AOC_YEAR || new Date().getFullYear(),
        authenticationToken: process.env.AOC_AUTHENTICATION_TOKEN || null,
        baseUrl: process.env.AOC_BASE_URL || 'https://adventofcode.com',
    }
};

// TODO, set from command line too.

/**
 * Returns the configuration value of the specified key.
 * @param {String} key - The key of the config value to access
 * @param {Boolean} silentFail - If set to false requesting a key which does not exist will raise an exception
 * @returns {any}
 */
export const getConfigValue = (key, silentFail = false) => {
    if (!silentFail && !has(CONFIG, key)) {
        throw new Error(`Unknown config key: ${key}`);
    }

    return get(CONFIG, key, null);
};