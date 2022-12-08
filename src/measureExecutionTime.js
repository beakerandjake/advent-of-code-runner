import { hrtime } from 'process';

/**
 * Decorates the provided function with performance profiling.
 * @param {Function} fn - The function whose execution time will be measured
 */
export const measureExecutionTime = (fn) => (...args) => {
  const start = hrtime.bigint();
  const result = fn(...args);
  const end = hrtime.bigint();
  const executionTimeNs = Number(end - start);
  return { executionTimeNs, result };
};
