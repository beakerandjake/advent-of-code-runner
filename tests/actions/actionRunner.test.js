import {
  describe, jest, test, afterEach,
} from '@jest/globals';
import { mockLogger } from '../mocks.js';

// setup mocks
const logger = mockLogger();
logger.debug = (...args) => console.log(...args);

// import after mocks setup
const { createAction, runAction } = await import('../../src/actions/actionRunner.js');

afterEach(() => {
  jest.resetAllMocks();
});

describe('actionRunner', () => {
  describe('createAction()', () => {
    test.each([
      null, undefined, true, Promise.resolve(false), 'ASDF', { cats: true }, 1234,
    ])('throws if action is: "%s"', (fn) => {
      expect(() => createAction(fn)).toThrow(/action/i);
    });

    test.each([
      null, true, Promise.resolve(false), 'ASDF', { cats: true }, 1234,
    ])('throws if action chain is not array (value = "%s")', (chain) => {
      expect(() => createAction(() => {}, chain)).toThrow(/chain/i);
    });

    test.each([
      () => {}, async () => {},
    ])('returns function if action is: %s', (action) => {
      const result = createAction(action, []);
      expect(result).toBeInstanceOf(Function);
    });

    test.each([
      undefined, [], [() => {}], [() => {}, async () => {}],
    ])('returns function if pre action chain is: %s', (chain) => {
      const result = createAction(() => {}, chain);
      expect(result).toBeInstanceOf(Function);
    });

    test('throws if any pre action is not a function', () => {
      const preActions = [() => {}, () => {}, () => {}, 'seriously not a function'];
      expect(() => createAction(() => {}, preActions)).toThrow(/chain/i);
    });
  });

  describe('runAction()', () => {
    test('invokes each link in pre-action chain', async () => {
      const chain = [jest.fn(), jest.fn(), jest.fn()];
      await runAction({}, () => {}, chain);
      chain.forEach((x) => expect(x).toHaveBeenCalledTimes(1));
    });

    test('invokes action if no chain', async () => {
      const action = jest.fn();
      await runAction({}, action, []);
      expect(action).toHaveBeenCalledTimes(1);
    });

    test('invokes action if has chain (none throw)', async () => {
      const action = jest.fn();
      await runAction({}, action, [jest.fn(), jest.fn(), jest.fn(), jest.fn()]);
      expect(action).toHaveBeenCalledTimes(1);
    });

    test('throws if any link throws', async () => {
      const chain = [jest.fn(), jest.fn(() => Promise.reject(new RangeError())), jest.fn()];
      await expect(async () => runAction({}, () => {}, chain)).rejects.toThrow(RangeError);
    });

    test('halts chain if any link throws', async () => {
      const before = [jest.fn(), jest.fn()];
      const after = [jest.fn(), jest.fn()];
      const bomb = jest.fn(() => Promise.reject(new Error()));
      const chain = [...before, bomb, ...after];
      await expect(async () => runAction({}, () => {}, chain)).rejects.toThrow();
      before.forEach((x) => expect(x).toHaveBeenCalledTimes(1));
      expect(bomb).toHaveBeenCalled();
      expect(bomb).rejects.toThrow();
      after.forEach((x) => expect(x).not.toHaveBeenCalled());
    });

    test('does not invoke action if chain throws', async () => {
      const chain = [() => {}, jest.fn(() => Promise.reject(new Error()))];
      const action = jest.fn();
      await expect(async () => runAction({}, action, chain)).rejects.toThrow();
      expect(action).not.toHaveBeenCalled();
    });

    test('passes args through chain', async () => {
      const args = { cats: true, dogs: false };
      const chain = [jest.fn(), jest.fn(), jest.fn()];
      await runAction(args, () => {}, chain);
      chain.forEach((x) => expect(x).toHaveBeenCalledWith(args));
    });

    test('link in chain can mutate args for future links', async () => {
      const origArgs = { cats: true, dogs: false };
      const mutatedArgs = { ...origArgs, apples: true };
      const before = [jest.fn(), jest.fn(), jest.fn(() => mutatedArgs)];
      const after = [jest.fn(), jest.fn()];
      await runAction(origArgs, () => {}, [...before, ...after]);
      before.forEach((x) => expect(x).toHaveBeenCalledWith(origArgs));
      after.forEach((x) => expect(x).toHaveBeenCalledWith(mutatedArgs));
    });

    test('passes args to action', async () => {
      const args = { cats: true, dogs: false };
      const actionFn = jest.fn();
      await runAction(args, actionFn, [jest.fn(), jest.fn(), jest.fn()]);
      expect(actionFn).toHaveBeenCalledWith(args);
    });

    test('passes mutated args to action', async () => {
      const origArgs = { cats: true, dogs: false };
      const mutatedArgs = { ...origArgs, apples: true };
      const chain = [jest.fn(), jest.fn(), jest.fn(() => mutatedArgs)];
      const actionFn = jest.fn();
      await runAction(origArgs, actionFn, chain);
      expect(actionFn).toHaveBeenCalledWith(mutatedArgs);
    });
  });
});
