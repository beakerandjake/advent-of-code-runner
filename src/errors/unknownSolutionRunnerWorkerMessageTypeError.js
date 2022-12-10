/**
 * Error that is raised when a solution file for a puzzle is missing.
 */
export class UnknownSolutionRunnerWorkerMessageTypeError extends Error {
  constructor(messageType) {
    super(`Unknown message type "${messageType}" from solution runner worker.`, messageType);
    this.name = 'UnknownSolutionRunnerWorkerMessageType';
  }
}
