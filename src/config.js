/* eslint-disable no-underscore-dangle */
import dotenv from 'dotenv';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { cwd as getCwd } from 'node:process';
import { fileURLToPath, URL } from 'node:url';
import yn from 'yn';
import { get, has } from './util.js';

/**
 * The directory this source file resides in
 */
const __dirname = fileURLToPath(new URL('.', import.meta.url));

// ensure dotenv runs before we attempt to read any environment variables.

// read the users config from the cwd.
dotenv.config();

// attempt to read an .env file at the root of this repository.
// this helps in local development by having one place to set development settings.
dotenv.config({ path: join(__dirname, '..', '.env'), override: true });

export const envOptions = {
  suppressTitle: 'AOC_SUPPRESS_TITLE',
  suppressFestive: 'AOC_SUPPRESS_FESTIVE',
  authenticationToken: 'AOC_AUTHENTICATION_TOKEN',
  logLevel: 'AOC_LOG_LEVEL',
  mockApiEnabled: 'AOC_MOCK_API_ENABLED',
  mockApiAnswerCorrect: 'AOC_MOCK_API_ANSWER_CORRECT',
  disableReadmeAutoSaveProgress: 'AOC_DISABLE_README_AUTO_SAVE_PROGRESS',
};

/**
 * Absolute path to the current working directory.
 * This will be the root folder where this program operates.
 * User solution files, inputs, data store etc will all exist in this folder.
 */
const cwd = getCwd();

/**
 * Load meta details about this package form the package json
 */
const readMetaFromPackageJson = async () => {
  const packageJson = JSON.parse(
    await readFile(join(__dirname, '..', 'package.json'), { encoding: 'utf8' })
  );

  return {
    name: packageJson.name,
    version: packageJson.version,
    description: packageJson.description,
    homepage: packageJson.homepage,
  };
};

const CONFIG = {
  cwd,
  meta: await readMetaFromPackageJson(),
  cli: {
    suppressTitleBox: yn(process.env[envOptions.suppressTitle]),
    suppressFestive: yn(process.env[envOptions.suppressFestive]),
  },
  logging: {
    level: process.env[envOptions.logLevel] || 'warn',
  },
  aoc: {
    authenticationToken: process.env[envOptions.authenticationToken] || null,
    baseUrl: 'https://adventofcode.com',
    userAgent: 'https://github.com/beakerandjake/advent-of-code-runner by beakerandjake',
    responseParsing: {
      correctSolution: /that's the right answer/gim,
      incorrectSolution: /that's not the right answer/gim,
      badLevel: /you don't seem to be solving the right level/gim,
      tooManyRequests: /you gave an answer too recently/gim,
      sanitizers: [
        // remove links, shows up on incorrect/correct answer
        { pattern: /\[(Return|Continue) to .*\]\.?/gi, replace: '' },
        // remove help message, shows up on wrong answer
        {
          pattern:
            "If you're stuck, make sure you're using the full input data; there are also some general tips on the about page, or you can ask for hints on the subreddit.",
          replace: '',
        },
        // remove guess text, shows up on wrong answer
        {
          pattern: /\(You guessed .*\)/gi,
          replace: '',
        },
        // remove share text, shows up when answer is correct (but all levels not solved)
        {
          pattern: /You can \[.*\] this victory or/gi,
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
      defaultTimeoutMs: 300000,
    },
    validation: {
      // could dynamically set valid dates here, but keeping this explicit
      // prevents edge cases where system time has been set maliciously
      // also allows possibility that aoc doesn't run during a specific year.
      // also ensures that this package gets updates at least once a year to support
      // that years aoc and any changes that might be needed.
      years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022],
      days: [...Array(25).keys()].map((x) => x + 1), // 1-25 expected to always be advent calendar..
      levels: [1, 2],
    },
    mockApi: {
      enabled: yn(process.env[envOptions.mockApiEnabled]),
      answerCorrect: yn(process.env[envOptions.mockApiAnswerCorrect]),
    },
  },
  solutionRunner: {
    levelFunctions: [
      { key: 1, name: 'levelOne' },
      { key: 2, name: 'levelTwo' },
    ],
    cancelMessageDelayMs: 3000,
  },
  paths: {
    readme: join(cwd, 'README.md'),
    rateLimitFile: join(cwd, '.ratelimits.json'),
    userDataFile: join(cwd, 'aocr-data.json'),
    inputsDir: join(cwd, 'inputs'),
    solutionsDir: join(cwd, 'src'),
    solutionRunnerWorkerFile: join(
      __dirname,
      'solutions',
      'solutionRunnerWorkerThread.js'
    ),
    templates: {
      gitignore: {
        source: join(__dirname, '..', 'templates', 'template-gitignore'),
        dest: join(cwd, '.gitignore'),
      },
      readme: join(__dirname, '..', 'templates', 'template-readme.md'),
      dotenv: {
        source: join(__dirname, '..', 'templates', 'template-dotenv'),
        dest: join(cwd, '.env'),
      },
      packageJson: {
        source: join(__dirname, '..', 'templates', 'template-package.json'),
        dest: join(cwd, 'package.json'),
      },
      userDataFile: {
        source: join(__dirname, '..', 'templates', 'template-dataFile.json'),
        dest: join(cwd, 'aocr-data.json'),
      },
      solution: join(__dirname, '..', 'templates', 'template-solution.js'),
    },
  },
  initialize: {
    emptyCwdWhitelist: ['.git', '.DS_Store', 'LICENSE', 'node_modules'],
  },
  disableReadmeAutoSaveProgress: yn(
    process.env[envOptions.disableReadmeAutoSaveProgress]
  ),
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
