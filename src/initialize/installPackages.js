import { spawn } from 'node:child_process';
import { stderr } from 'node:process';
import ora from 'ora';
import { getConfigValue } from '../config.js';
import { PackageInstallFailedError } from '../errors/packageInstallFailedError.js';
import { festiveEmoji, festiveErrorStyle, festiveStyle } from '../festive.js';
import { logger } from '../logger.js';

/**
 * Install packages for the user.
 */
export const installPackages = async () => {
  // TODO test multiplatform support
  // TODO can probably support yarn install too.

  const spinner = ora({
    text: festiveStyle('Installing npm packages'),
    spinner: 'christmas',
  }).start();

  return new Promise((resolve, reject) => {
    const childProcess = spawn(
      'npm',
      ['i'],
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
      spinner.fail(
        festiveErrorStyle('Failed to start npm install command'),
      );
      reject(error);
    });

    // handle exit (success or failure of command)
    childProcess.once('exit', (code) => {
      if (code === 0) {
        // no exit code? success!
        spinner.stopAndPersist({
          symbol: festiveEmoji(),
          text: festiveStyle(`Installed packages ${festiveEmoji()}`),
        });
        resolve();
      } else {
        spinner.fail();
        // exit code? error!
        reject(new Error(`Failed to install npm packages\n${errBuffer}`));
      }
    });
  });
};
