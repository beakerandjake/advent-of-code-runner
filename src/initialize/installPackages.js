import { spawn } from 'node:child_process';
import ora from 'ora';
import { getConfigValue } from '../config.js';
import { festiveEmoji, festiveStyle } from '../festive.js';
import { logger } from '../logger.js';

/**
 * Install packages for the user.
 */
export const installPackages = async () => {
  // TODO test multiplatform support
  // TODO can probably support yarn install too.
  // await asyncExec('npm i', { cwd: getConfigValue('cwd') });
  const spinner = ora({
    text: festiveStyle('Installing packages'),
    // prefixText: festiveEmoji(),
    spinner: 'christmas',
  }).start();

  return new Promise((resolve, reject) => {
    const process = spawn(
      'npm',
      ['i'],
      { cwd: getConfigValue('cwd') },
    );

    process.on('close', () => {
      // spinner.succeed(festiveStyle('Packages installed'));
      spinner.stopAndPersist({
        symbol: festiveEmoji(),
        text: festiveStyle('Installed packages'),
      });
      resolve();
    });

    process.on('error', (error) => {
      console.log('ERROR', error);
      spinner.fail();
      reject(error);
    });
  });
};
