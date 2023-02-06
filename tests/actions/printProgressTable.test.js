import { describe, test } from '@jest/globals';
import { printProgressTable } from '../../src/actions/printProgressTable.js';

describe('outputCompletionTable()', () => {
  test.each([null, undefined, ''])(
    'throws if progressTable is: "%s"',
    async (progressTable) => {
      await expect(async () =>
        printProgressTable({ progressTable })
      ).rejects.toThrow();
    }
  );
});
