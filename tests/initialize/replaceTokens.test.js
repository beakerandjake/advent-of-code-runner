import { describe, test } from '@jest/globals';
import { replaceTokens } from '../../src/initialize/replaceTokens.js';

describe('initialize', () => {
  describe('replaceTokens()', () => {
    test.each([
      null,
      undefined,
      'ASDF',
      1234,
      Infinity,
      BigInt(22),
      NaN,
      false,
      {},
      () => {},
      new (class Cats {})(),
      Promise.resolve(true),
    ])('throws if tokens is: "%s"', (tokens) => {
      expect(() => replaceTokens(tokens, {}, '')).toThrow(TypeError);
    });

    test.each([
      null,
      undefined,
      1234,
      Infinity,
      BigInt(22),
      NaN,
      false,
      {},
      () => {},
      new (class Cats {})(),
      Promise.resolve(true),
    ])('throws if target is: "%s"', (target) => {
      expect(() => replaceTokens([], {}, target)).toThrow(TypeError);
    });

    test('throws if token not present in args', () => {
      const tokens = [
        { key: 'ASDF', match: 'x' },
        { key: 'FDSA', match: 'y' },
      ];
      const args = { ASDF: 10, DOGS: 20 };
      expect(() => replaceTokens(tokens, args, '1234')).toThrow('args');
    });

    test('does not modify target if no matches found', () => {
      const tokens = [
        { key: 'dogs', match: 'x' },
        { key: 'cats', match: 'y' },
      ];
      const args = { dogs: '1', cats: '2' };
      const target = '!@#$QWERZXCVB';
      const result = replaceTokens(tokens, args, target);
      expect(result).toBe(target);
    });

    test('replaces single token match', () => {
      const tokens = [
        { key: 'dogs', match: 'dogspeak' },
        { key: 'cats', match: 'catspeak' },
      ];
      const args = { dogs: 'woof', cats: 'meow' };
      const result = replaceTokens(tokens, args, 'the dog says: dogspeak');
      expect(result).toBe('the dog says: woof');
    });

    test('replaces each instance of single token match', () => {
      const tokens = [
        { key: 'dogs', match: 'dogspeak' },
        { key: 'cats', match: 'catspeak' },
      ];
      const args = { dogs: 'woof', cats: 'meow' };
      const result = replaceTokens(
        tokens,
        args,
        'the dog says: dogspeak dogspeak'
      );
      expect(result).toBe('the dog says: woof woof');
    });

    test('replaces multiple token match', () => {
      const tokens = [
        { key: 'dogs', match: 'dogspeak' },
        { key: 'cats', match: 'catspeak' },
      ];
      const args = { dogs: 'woof', cats: 'meow' };
      const result = replaceTokens(
        tokens,
        args,
        'the dog says: dogspeak, the cat says: catspeak'
      );
      expect(result).toBe('the dog says: woof, the cat says: meow');
    });

    test('replaces each instance of multiple token match', () => {
      const tokens = [
        { key: 'dogs', match: 'dogspeak' },
        { key: 'cats', match: 'catspeak' },
      ];
      const args = { dogs: 'woof', cats: 'meow' };
      const result = replaceTokens(
        tokens,
        args,
        'the dog says: dogspeak dogspeak, the cat says: catspeak catspeak'
      );
      expect(result).toBe('the dog says: woof woof, the cat says: meow meow');
    });
  });
});
