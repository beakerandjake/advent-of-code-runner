import { UserError } from './userError.js';

/**
 * Error that is raised when the users answer is an invalid type.
 */
export class AnswerEmptyError extends UserError {
  constructor() {
    super('Answer value cannot be an empty string');
    this.name = 'AnswerEmptyError';
  }
}
