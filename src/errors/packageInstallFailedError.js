import { UserError } from './userError.js';

/**
 * Error that is raised if running npm install on the users behalf fails.
 */
export class PackageInstallFailedError extends Error {
  constructor(npmError) {
    super(`Failed to install packages, error from npm:\n${npmError}`);
  }
}
