import { readJson, writeJson } from 'fs-extra/esm';
import { join } from 'node:path';
import { exec } from 'node:child_process';
import { getConfigValue } from '../config.js';
import { logger } from '../logger.js';

/**
 * Runs the npm init command to create a package.json file.
 * @param {String} cwd
 */
const execNpmInit = async (cwd) => new Promise((resolve, reject) => {
  exec('npm init -y', { cwd }, (error) => {
    if (error) {
      reject(new Error(`Failed to run npm init, exit code: ${error.code}`, { cause: error }));
    } else {
      logger.debug('created package.json file');
      resolve();
    }
  });
});

/**
 * Creates a package.json file in the cwd.
 */
export const createPackageJson = async ({ year } = {}) => {
  logger.debug('creating package.json file');

  if (year == null) {
    throw new Error('null or undefined year');
  }

  const cwd = getConfigValue('cwd');

  // create the package json file.
  await execNpmInit(cwd);

  // now that the package json exists, load it, then modify it, then save it.
  logger.debug('updating package.json file');
  const packageJsonPath = join(cwd, 'package.json');
  const originalPackageJson = await readJson(packageJsonPath);

  // update the original package json with values the user will need to run our cli
  const { main, ...updatedPackageJson } = {
    ...originalPackageJson,
    type: 'module',
    description: `Solutions to Advent of Code ${year}`,
    scripts: {
      autosolve: 'advent-of-code-runner autosolve',
      solve: 'advent-of-code-runner solve',
      autosubmit: 'advent-of-code-runner autosubmit',
      submit: 'advent-of-code-runner submit',
      stats: 'advent-of-code-runner stats',
      auth: 'advent-of-code-runner auth',
      help: 'advent-of-code-runner help',
    },
    dependencies: {
      ...originalPackageJson.dependencies,
      [getConfigValue('meta.name')]: `^${getConfigValue('meta.version')}`,
    },
  };

  // save the updated package json file.
  await writeJson(packageJsonPath, updatedPackageJson, { spaces: '\t' });
};
