import { UserError } from './userError.js';

/**
 * Error that is raised if the user does not have a package.json file in their directory.
 */
export class PackageJsonNotFoundError extends UserError {
  constructor() {
    super('Could not find a package.json file, please run the \'npm init\' command');
  }
}
