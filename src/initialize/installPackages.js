import { spawn } from 'node:child_process';
import { PackageInstallFailedError } from '../errors/index.js';
import { getConfigValue } from '../config.js';
import { logger } from '../logger.js';

/**
 * Install packages for the user.
 */
export const installPackages = async () => {
  // TODO test multiplatform support
  // TODO can probably support yarn install too.

  logger.debug('installing npm packages');

  return new Promise((resolve, reject) => {
    // run npm install command
    const childProcess = spawn(
      'npm',
      ['i', '--omit=dev'],
      {
        cwd: getConfigValue('cwd'),
        stdio: ['ignore', 'ignore', 'pipe'],
        detached: false,
      },
    );

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
        reject(new PackageInstallFailedError(errBuffer));
      }
    });
  });
};
