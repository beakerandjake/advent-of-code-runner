import { platform } from 'node:process';
import { spawn } from 'node:child_process';
import { getConfigValue } from '../config.js';
import { logger } from '../logger.js';

/**
 * Returns the npm command to execute for the specific platform.
 * Fixes ENOENT errors on windows.
 * @param {String} platform
 * @private
 */
export const getNpmCommand = (platformName) =>
  /^win/.test(platformName) ? 'npm.cmd' : 'npm';

/**
 * Install packages for the user.
 */
export const installPackages = async () => {
  // TODO test multiplatform support
  // TODO can probably support yarn install too.
  logger.debug('installing npm packages');
  await new Promise((resolve, reject) => {
    // run npm install command
    const childProcess = spawn(getNpmCommand(platform), ['i', '--omit=dev'], {
      cwd: getConfigValue('cwd'),
      stdio: ['ignore', 'ignore', 'pipe'],
      detached: false,
    });

    // we have to buffer the child process std err
    // and output it at the exit in order to get the log order correct
    // otherwise it comes out in a confusing order.
    let errBuffer = '';
    childProcess.stderr.on('data', (data) => {
      errBuffer += data;
    });

    // handle error related to spawning / communicating with the process
    childProcess.once('error', (error) => {
      reject(error);
    });

    // handle exit (success or failure of command)
    childProcess.once('exit', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Failed to install npm packages: ${errBuffer}`));
      }
    });
  });
};
