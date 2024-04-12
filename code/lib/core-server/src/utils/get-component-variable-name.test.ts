import { describe, expect, it } from 'vitest';
import { getComponentVariableName } from './get-component-variable-name';

describe('get-variable-name', () => {
  it('should return a valid variable name for a given string', () => {
    expect(getComponentVariableName('foo-bar')).toBe('FooBar');
    expect(getComponentVariableName('foo bar')).toBe('FooBar');
    expect(getComponentVariableName('0-foo-bar')).toBe('FooBar');
    expect(getComponentVariableName('*Foo-bar-$')).toBe('FooBar$');
  });
});
