import { yearIsValid } from '../src/validatePuzzle';

test('yearIsValid - false on null', () => {
  expect(yearIsValid(null)).toBe(false);
});

test('yearIsValid - false on undefined', () => {
  expect(yearIsValid(undefined)).toBe(false);
});

test('yearIsValid - false on empty string', () => {
  expect(yearIsValid('')).toBe(false);
});

test('yearIsValid - false on negative number', () => {
  expect(yearIsValid(-10)).toBe(false);
});

test('yearIsValid - false on before start year', () => {
  expect(yearIsValid(2003)).toBe(false);
});

test('yearIsValid - exception on end year before start year', () => {
  expect(false).toThrow(RangeError);
});

test('yearIsValid - true between min and max', () => {
  expect(false).toBe(true);
});

test('yearIsValid - false in future', () => {
  expect(false).toBe(true);
});
