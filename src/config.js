/* eslint-disable no-underscore-dangle */
import dotenv from 'dotenv';
import { has, get, range } from 'lodash-es';
import { join } from 'path';
import { cwd } from 'process';
import { fileURLToPath, URL } from 'url';
import { readPackageUp } from 'read-pkg-up';
import yn from 'yn';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

// ensure dotenv runs before we attempt to read any environment variables.
dotenv.config();

export const envOptions = {
  cwdOverride: 'AOC_CWD_OVERRIDE',
  suppressTitle: 'AOC_SUPPRESS_TITLE',
  suppressFestive: 'AOC_SUPPRESS_FESTIVE',
  authenticationToken: 'AOC_AUTHENTICATION_TOKEN',
  logLevel: 'AOC_LOG_LEVEL',
  mockApiEnabled: 'AOC_MOCK_API_ENABLED',
  mockApiAnswerCorrect: 'AOC_MOCK_API_ANSWER_CORRECT',
  rateLimitDefaultTimeoutMs: 'AOC_RATE_DEFAULT_RATE_LIMIT_MS',
  year: 'AOC_YEAR',
};

/**
 * Absolute path to the current working directory.
 * This will be the root folder where this program operates.
 * User solution files, inputs, data store etc will all exist in this folder.
 */
const rootDirectory = process.env[envOptions.cwdOverride] || cwd();

/**
 * Load meta details about this package form the package json
 */
const readMetaFromPackageJson = async () => {
  const { packageJson } = await readPackageUp(
    { cwd: __dirname, normalize: false },
  ) || {};

  // should never ever happen, but just in case.
  if (!packageJson) {
    throw new Error('Could not load package.json!');
  }

  return {
    name: packageJson.name,
    version: packageJson.version,
    description: packageJson.description,
  };
};

/**
 * Attempts to parse and return an integer from the given value.
 * If the integer does not parse or is not positive then default value is returned.
 * @param {String} value
 * @param {Any} defaultValue
 */
const parsePositiveInt = (value, defaultValue = null) => {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : defaultValue;
};

const CONFIG = {
  rootDirectory,
  meta: await readMetaFromPackageJson(),
  cli: {
    suppressTitleBox: yn(process.env[envOptions.suppressTitle]),
    suppressFestive: yn(process.env[envOptions.suppressFestive]),
  },
  logging: {
    level: process.env[envOptions.logLevel] || 'warn',
  },
  aoc: {
    year: parsePositiveInt(process.env[envOptions.year], new Date().getFullYear()),
    authenticationToken: process.env[envOptions.authenticationToken] || null,
    baseUrl: 'https://adventofcode.com',
    userAgent:
      'https://github.com/beakerandjake/advent-of-code-runner by beakerandjake',
    responseParsing: {
      correctSolution: /that's the right answer/gim,
      incorrectSolution: /that's not the right answer/gim,
      badLevel: /you don't seem to be solving the right level/gim,
      tooManyRequests: /you gave an answer too recently/gim,
      sanitizers: [
        // remove return to day link
        { pattern: /\[Return to Day \d+\]/, replace: '' },
        // remove help message
        {
          pattern:
            "If you're stuck, make sure you're using the full input data; there are also some general tips on the about page, or you can ask for hints on the subreddit.",
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
    rateLimiting: {
      defaultTimeoutMs: parsePositiveInt(process.env[envOptions.rateLimitDefaultTimeoutMs], 300000),
    },
    puzzleValidation: {
      // could dynamically set valid dates here, but keeping this explicit
      // prevents edge cases where system time has been set maliciously
      // also allows possibility that aoc doesn't run during a specific year.
      // also ensures that this package gets updates at least once a year to support
      // that years aoc and any changes that might be needed.
      years: range(2015, 2023),
      days: range(1, 26),
      parts: [1, 2],
    },
    mockApi: {
      enabled: yn(process.env[envOptions.mockApiEnabled]),
      answerCorrect: yn(process.env[envOptions.mockApiAnswerCorrect]),
    },
  },
  solutions: {
    partFunctions: [
      { key: 1, name: 'partOne' },
      { key: 2, name: 'partTwo' },
    ],
    path: join(rootDirectory, 'solutions'),
  },
  inputs: {
    path: join(rootDirectory, 'inputs'),
  },
  dataStore: {
    filePath: join(rootDirectory, 'aocr-data.json'),
    folderPath: rootDirectory,
    fileName: 'aocr-data.json',
  },
};

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
