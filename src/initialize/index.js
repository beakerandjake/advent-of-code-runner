import { createDataFile } from './createDataFile.js';
import { createDotEnv } from './createDotEnv.js';
import { createGitIgnore } from './createGitIgnore.js';
import { createPackageJson } from './createPackageJson.js';
import { createReadme } from './createReadme.js';
import { createSolutionFiles } from './createSolutionFiles.js';
import { cwdIsEmpty } from './cwdIsEmpty.js';
import { installPackages } from './installPackages.js';

/**
 * Creates all of the files necessary for this cli to run.
 */
export const createFiles = (...args) => Promise.all([
  createDataFile(...args),
  createDotEnv(...args),
  createGitIgnore(...args),
  createPackageJson(...args),
  createReadme(...args),
  createSolutionFiles(...args),
]);

export {
  cwdIsEmpty,
  installPackages,
};
