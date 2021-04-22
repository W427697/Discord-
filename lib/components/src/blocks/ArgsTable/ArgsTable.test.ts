import _ from 'lodash';
import { shouldDisable } from './ArgsTable';

describe('disabling logic', () => {
  it('boolean values', () => {
    expect(shouldDisable(true, {})).toBe(true);
    expect(shouldDisable(false, {})).toBe(false);
  });

  it('dynamic values', () => {
    expect(shouldDisable('foo', { foo: true })).toBe(true);
    expect(shouldDisable('!foo', { foo: true })).toBe(false);
    expect(shouldDisable('bar', {})).toBe(false);
    expect(shouldDisable('!bar', {})).toBe(true);
  });

  it('other values', () => {
    expect(shouldDisable(undefined, {})).toBe(false);
    expect(shouldDisable(null, {})).toBe(false);
  });
});
