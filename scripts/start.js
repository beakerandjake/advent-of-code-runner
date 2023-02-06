/* eslint-disable no-underscore-dangle */
import { argv } from 'node:process';
import { fileURLToPath, URL } from 'node:url';
import { join } from 'node:path';
import { fork } from 'node:child_process';
import { ensureDir, pathExists } from 'fs-extra/esm';
import { outputFile } from 'fs-extra';

/**
 * This script makes local development easier:
 *
 * Creates a workspace dir called 'development' in the root of this repo.
 * This dir is ignored by git and serves as the CWD when running `npm start`.
 * All commands invoked via `npm start` will operate against this workspace folder.
 * For example:
 *  - `npm start -- solve 10 1` will try to run file `./development/src/day_10.js`
 *  - `npm start -- solve 10 1` will download inputs to `./development/inputs/day_10.txt`
 *
 * Creates a `.env` file at the root of this repo (if doesn't already exist).
 * The `.env` file created will have default options set which are commonly used during development.
 * This file *overrides* `.env` file which might exist in the workspace dir (./development/.env).
 * This allows you to delete /init the workspace dir without losing your settings.
 *
 * Once ensuring the workspace dir and the .env file exist this script will
 * run the "real" script at ./src/main.js, forwarding any arguments passed in.
 */

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const root = join(__dirname, '..');
const workspaceDir = join(root, 'development');
const dotEnvPath = join(root, '.env');
const mainJsPath = join(root, 'src', 'main.js');

/**
 * Checks to see if a .env file exists at the root of the repo.
 * If it does not exist, a default .env file is created with
 * settings for local development.
 */
const ensureDotEnv = async () => {
  // don't overwrite if already exists.
  if (await pathExists(dotEnvPath)) {
    return;
  }

  const defaultContents = [
    '# If hitting real API you will need to use your real token.',
    'AOC_AUTHENTICATION_TOKEN=your-token-here',
    '# Should almost always be set to 1 during local development.',
    'AOC_MOCK_API_ENABLED=1',
    '# Set to 1 or 0 depending on how you want the mock api to respond.',
    'AOC_MOCK_API_ANSWER_CORRECT=1',
    '# Change log level as desired to reduce or increase verbosity.',
    'AOC_LOG_LEVEL=debug',
  ].join('\n');

  await outputFile(dotEnvPath, defaultContents);
};

/**
 * Creates the development workspace folder if it does not exist.
 */
const ensureWorkspaceDir = async () => ensureDir(workspaceDir);

/**
 * Launches the main.js script, forwarding arguments and setting the cwd to the workspace.
 */
const start = async () => {
  await Promise.all([ensureWorkspaceDir(), ensureDotEnv()]);

  fork(mainJsPath, argv.slice(2), { cwd: workspaceDir });
};

await start();
