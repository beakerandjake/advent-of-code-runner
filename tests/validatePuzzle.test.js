import { yearIsValid, dayIsValid, partIsValid } from '../src/validatePuzzle';

const nonNumericCases = [
  null, undefined, '', Infinity, 'Cats!', false, [],
];

test.each(nonNumericCases)('yearIsValid - false on non-numeric: %p', (value) => {
  expect(yearIsValid(value)).toBe(false);
});

test('yearIsValid - false on negative number', () => {
  expect(yearIsValid(-1999)).toBe(false);
});

test('yearIsValid - false on zero', () => {
  expect(yearIsValid(0)).toBe(false);
});

test('yearIsValid - false on before start year', () => {
  expect(yearIsValid(2003)).toBe(false);
});

test.todo('yearIsValid - RangeError on end year before start year');
test.todo('yearIsValid - false in future');
test.todo('yearIsValid - false in this year not december');
test.todo('yearIsValid - true between min year and last year');
test.todo('yearIsValid - true in this year and its december');

test.each(nonNumericCases)('dayIsValid - false on non-numeric: %p', (value) => {
  expect(dayIsValid(value)).toBe(false);
});

test.todo('dayIsValid - false on negative');
test.todo('dayIsValid - false on zero');
test.todo('dayIsValid - false on above max day');
test.todo('dayIsValid - false on below min day');
test.todo('dayIsValid - true when between min and max');

test.each(nonNumericCases)('partIsValid - false on non-numeric: %p', (value) => {
  expect(partIsValid(value)).toBe(false);
});

test.todo('partIsValid - false on negative');
test.todo('partIsValid - false on zero');
test.todo('partIsValid - false when below min part');
test.todo('partIsValid - false when above max part');
