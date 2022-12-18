/**
 * Defines the type of messages that a Worker can send back to the main thread.
 */
export const workerMessageTypes = {
  log: 'LOG',
  answer: 'ANSWER',
  answerTypeInvalid: 'ANSWER_TYPE_INVALID',
  runtimeError: 'RUNTIME_ERROR',
  functionNotFound: 'MISSING_FUNCTION_ERROR',
};
