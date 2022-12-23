import {
  describe, jest, test, afterEach,
} from '@jest/globals';
import { or, not, and } from '../../src/actions/links/logical.js';

describe('actions', () => {
  describe('links', () => {
    describe('logical', () => {
      describe('or()', () => {
        test('returns function', () => {
          const result = or(() => {}, () => {});
          expect(result).toBeInstanceOf(Function);
        });

        test('returns true if lhs returns true', async () => {
          const lhs = () => true;
          const rhs = () => false;
          const result = await or(lhs, rhs)();
          expect(result).toBe(true);
        });

        test('short circuits if lhs returns true', async () => {
          const lhs = () => true;
          const rhs = jest.fn();
          await or(lhs, rhs)();
          expect(rhs).not.toHaveBeenCalled();
        });

        test('returns true if rhs returns true', async () => {
          const lhs = () => false;
          const rhs = () => true;
          const result = await or(lhs, rhs)();
          expect(result).toBe(true);
        });

        test('returns false if rhs returns false', async () => {
          const lhs = () => false;
          const rhs = () => false;
          const result = await or(lhs, rhs)();
          expect(result).toBe(false);
        });
      });

      describe('and()', () => {
        test('returns function', () => {
          const result = and(() => {}, () => {});
          expect(result).toBeInstanceOf(Function);
        });

        test('returns false if lhs returns false', async () => {
          const lhs = async () => false;
          const rhs = async () => true;
          const result = await and(lhs, rhs)();
          expect(result).toBe(false);
        });

        test('short circuits if lhs returns false', async () => {
          const lhs = async () => false;
          const rhs = jest.fn();
          await and(lhs, rhs)();
          expect(rhs).not.toHaveBeenCalled();
        });

        test('returns false if rhs returns false', async () => {
          const lhs = async () => true;
          const rhs = async () => false;
          const result = await and(lhs, rhs)();
          expect(result).toBe(false);
        });

        test('returns true if lhs and rhs return true', async () => {
          const lhs = async () => true;
          const rhs = async () => true;
          const result = await and(lhs, rhs)();
          expect(result).toBe(true);
        });
      });

      describe('not()', () => {
        test('returns function', () => {
          const result = not(() => {});
          expect(result).toBeInstanceOf(Function);
        });

        test('returns false if fn returns true', async () => {
          const fnReturn = true;
          const result = await not(() => fnReturn)();
          expect(result).toBe(!fnReturn);
        });

        test('returns true if fn returns false', async () => {
          const fnReturn = false;
          const result = await not(() => fnReturn)();
          expect(result).toBe(!fnReturn);
        });
      });
    });
  });
});
