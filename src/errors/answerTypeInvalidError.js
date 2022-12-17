import { UserError } from './userError.js';

/**
 * Error that is raised when the users answer is an invalid type.
 */
export class AnswerTypeInvalidError extends UserError {
  constructor(type) {
    super(`Invalid answer type provided: "${type}", supported types are "string" and "number"`);
    this.name = 'AnswerTypeInvalidError';
  }
}
