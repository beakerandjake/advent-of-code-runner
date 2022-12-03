import { config } from 'dotenv';

// bootstrap dotenv
config();

const config = {
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

export const getConfigValue = (key) => {
    return config[key] || null;
};