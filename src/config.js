import { getYear } from 'date-fns';
import { has, get, range } from 'lodash-es';
import { join } from 'path';
import { cwd } from 'process';
import { readPackageUp } from 'read-pkg-up';
import yn from 'yn';
/**
 * Load meta details about this package form the package json
 */
const readMetaFromPackageJson = async () => {
  const { packageJson } = await readPackageUp({ normalize: false }) || {};

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

const CONFIG = {
  meta: await readMetaFromPackageJson(),
  cli: {
    suppressTitleBox: yn(process.env.AOC_SUPPRESS_TITLE),
    suppressFestive: yn(process.env.AOC_SUPPRESS_FESTIVE),
  },
  logging: {
    level: process.env.AOC_LOG_LEVEL || 'error',
    includeStackTrace: process.env.NODE_ENV !== 'production',
  },
  aoc: {
    year: process.env.AOC_YEAR || getYear(new Date()),
    authenticationToken: process.env.AOC_AUTHENTICATION_TOKEN || null,
    baseUrl: process.env.AOC_BASE_URL || 'https://adventofcode.com',
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
      defaultTimeoutMs: 1,
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
    useMockApi: yn(process.env.AOC_USE_MOCK_API),
  },
  solutions: {
    partFunctions: [
      { key: 1, name: 'partOne' },
      { key: 2, name: 'partTwo' },
    ],
    path: process.env.AOC_SOLUTIONS_FOLDER_PATH || join(cwd(), 'solutions'),
  },
  inputs: {
    path: (process.env.AOC_INPUTS_FOLDER || join(cwd(), 'inputs')),
  },
  dataStore: {
    folderPath: process.env.AOC_DATA_FOLDER || cwd(),
    fileName: 'aocr-data.json',
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
