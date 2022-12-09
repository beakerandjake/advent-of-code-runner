import { Command } from 'commander';
import { logger } from '../logger.js';

const command = new Command();

command
  .name('test')
  .description('little scratch pad tester.')
  .action(async () => {
  });

export const testCommand = command;
