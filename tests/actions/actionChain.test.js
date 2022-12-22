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

  describe('runAction()', () => {
    test('does not throw if chain is empty', async () => {
      await expect(async () => executeChain([], {})).resolves;
    });

    test('invokes each link in pre-action chain', async () => {
      const chain = [jest.fn(), jest.fn(), jest.fn()];
      await executeChain(chain, {});
      chain.forEach((x) => expect(x).toHaveBeenCalledTimes(1));
    });

    test('invokes each link', async () => {
      const chain = [jest.fn(), jest.fn(), jest.fn(), jest.fn()];
      await executeChain(chain);
      chain.forEach((x) => expect(x).toHaveBeenCalledTimes(1));
    });

    test('link can halt chain', async () => {
      const before = [jest.fn(), jest.fn(), jest.fn()];
      const halter = jest.fn(() => false);
      const after = [jest.fn(), jest.fn(), jest.fn(), jest.fn()];
      await executeChain([...before, halter, ...after]);
      before.forEach((x) => expect(x).toHaveBeenCalledTimes(1));
      expect(halter).toHaveBeenCalledTimes(1);
      after.forEach((x) => expect(x).not.toHaveBeenCalled());
    });

    test('throws if any link throws', async () => {
      const chain = [jest.fn(), jest.fn(() => Promise.reject(new RangeError())), jest.fn()];
      await expect(async () => executeChain(chain)).rejects.toThrow(RangeError);
    });

    test('halts chain if any link throws', async () => {
      const before = [jest.fn(), jest.fn()];
      const bomb = jest.fn(() => Promise.reject(new Error()));
      const after = [jest.fn(), jest.fn()];
      await expect(async () => executeChain([...before, bomb, ...after])).rejects.toThrow();
      before.forEach((x) => expect(x).toHaveBeenCalledTimes(1));
      expect(bomb).toHaveBeenCalled();
      after.forEach((x) => expect(x).not.toHaveBeenCalled());
    });

    test('passes args through chain', async () => {
      const args = { cats: true, dogs: false };
      const chain = [jest.fn(), jest.fn(), jest.fn()];
      await executeChain(chain, args);
      chain.forEach((x) => expect(x).toHaveBeenCalledWith(args));
    });

    test('link in chain can mutate args for future links', async () => {
      const origArgs = { cats: true, dogs: false };
      const mutatedArgs = { ...origArgs, apples: true };
      const before = [jest.fn(), jest.fn(), jest.fn(() => mutatedArgs)];
      const after = [jest.fn(), jest.fn()];
      await executeChain([...before, ...after], origArgs);
      before.forEach((x) => expect(x).toHaveBeenCalledWith(origArgs));
      after.forEach((x) => expect(x).toHaveBeenCalledWith(mutatedArgs));
    });
  });
});
