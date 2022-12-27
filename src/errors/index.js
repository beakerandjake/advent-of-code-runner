import {
  SolutionWorkerEmptyInputError,
  SolutionWorkerExitWithoutAnswerError,
  SolutionWorkerMissingDataError,
  UserSolutionAnswerInvalidError,
  UserSolutionFileNotFoundError,
  UserSolutionMissingFunctionError,
  UserSolutionSyntaxError,
  UserSolutionThrewError,
} from './solutionWorkerErrors.js';
import { UserError } from './userError.js';
import { RateLimitExceededError, SolvingWrongLevelError } from './apiErrors.js';

export {
  RateLimitExceededError,
  UserError,

  SolutionWorkerEmptyInputError,
  SolutionWorkerExitWithoutAnswerError,
  SolutionWorkerMissingDataError,
  UserSolutionAnswerInvalidError,
  UserSolutionFileNotFoundError,
  UserSolutionMissingFunctionError,
  UserSolutionSyntaxError,
  UserSolutionThrewError,

  SolvingWrongLevelError,
};
