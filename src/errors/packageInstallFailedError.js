import { UserError } from './userError.js';

/**
 * Error that is raised if running npm install on the users behalf fails.
 */
export class PackageInstallFailedError extends UserError {
  constructor(npmError) {
    super(`Failed to install packages:\n${npmError.split('\n').map((x) => `\t${x}`).join('\n')}`);
  }
}
