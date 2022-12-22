import {
  describe, jest, test, afterEach,
} from '@jest/globals';
import { mockLogger } from '../mocks.js';

// setup mocks
mockLogger();

// import after mocks setup
const { createChain, executeChain } = await import('../../src/actions/actionChain.js');

afterEach(() => {
  jest.resetAllMocks();
});

describe('actionChain', () => {
  describe('createChain()', () => {
    test.each([
      null, true, Promise.resolve(false), 'ASDF', { cats: true }, 1234,
    ])('throws if given: "%s"', (fn) => {
      expect(() => createChain(fn)).toThrow();
    });

    test('succeeds if chain is undefined', () => {
      const result = createChain();
      expect(result).toBeInstanceOf(Function);
    });

    test('succeeds if chain is empty array', () => {
      const result = createChain([]);
      expect(result).toBeInstanceOf(Function);
    });

    test('succeeds if chain is all functions', () => {
      const anObject = { sayHi: () => {} };
      const result = createChain([() => {}, async () => {}, anObject.sayHi]);
      expect(result).toBeInstanceOf(Function);
    });

    test('throws if chain link is not a function', () => {
      const chain = [() => {}, () => {}, () => {}, 'seriously not a function'];
      expect(() => createChain(chain)).toThrow();
    });
  });

  // describe('runAction()', () => {
  //   test('invokes each link in pre-action chain', async () => {
  //     const chain = [jest.fn(), jest.fn(), jest.fn()];
  //     await executeChain({}, () => {}, chain);
  //     chain.forEach((x) => expect(x).toHaveBeenCalledTimes(1));
  //   });

  //   test('invokes action if no chain', async () => {
  //     const action = jest.fn();
  //     await executeChain({}, action, []);
  //     expect(action).toHaveBeenCalledTimes(1);
  //   });

  //   test('invokes action if has chain (none throw)', async () => {
  //     const action = jest.fn();
  //     await executeChain({}, action, [jest.fn(), jest.fn(), jest.fn(), jest.fn()]);
  //     expect(action).toHaveBeenCalledTimes(1);
  //   });

  //   test('throws if any link throws', async () => {
  //     const chain = [jest.fn(), jest.fn(() => Promise.reject(new RangeError())), jest.fn()];
  //     await expect(async () => executeChain({}, () => {}, chain)).rejects.toThrow(RangeError);
  //   });

  //   test('halts chain if any link throws', async () => {
  //     const before = [jest.fn(), jest.fn()];
  //     const after = [jest.fn(), jest.fn()];
  //     const bomb = jest.fn(() => Promise.reject(new Error()));
  //     const chain = [...before, bomb, ...after];
  //     await expect(async () => executeChain({}, () => {}, chain)).rejects.toThrow();
  //     before.forEach((x) => expect(x).toHaveBeenCalledTimes(1));
  //     expect(bomb).toHaveBeenCalled();
  //     expect(bomb).rejects.toThrow();
  //     after.forEach((x) => expect(x).not.toHaveBeenCalled());
  //   });

  //   test('does not invoke action if chain throws', async () => {
  //     const chain = [() => {}, jest.fn(() => Promise.reject(new Error()))];
  //     const action = jest.fn();
  //     await expect(async () => executeChain({}, action, chain)).rejects.toThrow();
  //     expect(action).not.toHaveBeenCalled();
  //   });

  //   test('passes args through chain', async () => {
  //     const args = { cats: true, dogs: false };
  //     const chain = [jest.fn(), jest.fn(), jest.fn()];
  //     await executeChain(args, () => {}, chain);
  //     chain.forEach((x) => expect(x).toHaveBeenCalledWith(args));
  //   });

  //   test('link in chain can mutate args for future links', async () => {
  //     const origArgs = { cats: true, dogs: false };
  //     const mutatedArgs = { ...origArgs, apples: true };
  //     const before = [jest.fn(), jest.fn(), jest.fn(() => mutatedArgs)];
  //     const after = [jest.fn(), jest.fn()];
  //     await executeChain(origArgs, () => {}, [...before, ...after]);
  //     before.forEach((x) => expect(x).toHaveBeenCalledWith(origArgs));
  //     after.forEach((x) => expect(x).toHaveBeenCalledWith(mutatedArgs));
  //   });

  //   test('passes args to action', async () => {
  //     const args = { cats: true, dogs: false };
  //     const actionFn = jest.fn();
  //     await executeChain(args, actionFn, [jest.fn(), jest.fn(), jest.fn()]);
  //     expect(actionFn).toHaveBeenCalledWith(args);
  //   });

  //   test('passes mutated args to action', async () => {
  //     const origArgs = { cats: true, dogs: false };
  //     const mutatedArgs = { ...origArgs, apples: true };
  //     const chain = [jest.fn(), jest.fn(), jest.fn(() => mutatedArgs)];
  //     const actionFn = jest.fn();
  //     await executeChain(origArgs, actionFn, chain);
  //     expect(actionFn).toHaveBeenCalledWith(mutatedArgs);
  //   });
  // });
});
