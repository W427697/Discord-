import { mergeSettings } from '../utils/mergeSettings';

test('should work on empty objects', () => {
  const result = mergeSettings({}, {});
  expect(result).toEqual({});
});

test('should work with only first argument', () => {
  const result = mergeSettings({});
  expect(result).toEqual({});
});

test('merge array values in order', () => {
  const result = mergeSettings({ a: [1, 2, 3] }, { a: [4, 5, 6] });
  expect(result).toEqual({ a: [1, 2, 3, 4, 5, 6] });
});

test('merge objects & all values in order', () => {
  const result = mergeSettings({ a: [1, 2, 3], b: [] }, { a: [4, 5, 6], b: [100, 200, 300] });
  expect(result).toEqual({ a: [1, 2, 3, 4, 5, 6], b: [100, 200, 300] });
});

test('when arg1 missing keys from arg2', () => {
  const result = mergeSettings({ a: [1, 2, 3] }, { a: [4, 5, 6], b: [100, 200, 300] });
  expect(result).toEqual({ a: [1, 2, 3, 4, 5, 6], b: [100, 200, 300] });
});

test('when arg2 missing keys from arg1', () => {
  const result = mergeSettings({ a: [1, 2, 3], b: [100, 200, 300] }, { a: [4, 5, 6] });
  expect(result).toEqual({ a: [1, 2, 3, 4, 5, 6], b: [100, 200, 300] });
});

test('should not mutate either args', () => {
  const a = { a: [1, 2, 3], b: [100, 200, 300] };
  const b = { a: [4, 5, 6] };

  const snapA = JSON.stringify(a);
  const snapB = JSON.stringify(b);

  mergeSettings(a, b);

  expect(JSON.stringify(a)).toEqual(snapA);
  expect(JSON.stringify(b)).toEqual(snapB);
});
