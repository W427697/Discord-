import { createSummaryValue, isUnsafeToSplit } from './utils';

describe('createSummaryValue', () => {
  it('creates an object with just summary if detail is not passed', () => {
    const summary = 'boolean';
    expect(createSummaryValue(summary)).toEqual({ summary });
  });

  it('creates an object with summary & detail if passed', () => {
    const summary = 'MyType';
    const detail = 'boolean | string';
    expect(createSummaryValue(summary, detail)).toEqual({ summary, detail });
  });

  it('creates an object with just summary if details are equal', () => {
    const summary = 'boolean';
    const detail = 'boolean';
    expect(createSummaryValue(summary, detail)).toEqual({ summary });
  });
});

describe('isUnsafeToSplit', () => {
  describe('reports false', () => {
    it('basic union', () => {
      const value = '"foo" | "bar" | "baz"';
      expect(isUnsafeToSplit(value)).toEqual(false);
    });
  });

  describe('reports true', () => {
    it('union including an object', () => {
      const value = '"foo" | "bar" | { baz: string }';
      expect(isUnsafeToSplit(value)).toEqual(true);
    });

    it('union including a function', () => {
      const value = '"foo" | "bar" | () => void';
      expect(isUnsafeToSplit(value)).toEqual(true);
    });

    it('union including an array', () => {
      const value = '"foo" | "bar" | string[]';
      expect(isUnsafeToSplit(value)).toEqual(true);
    });

    it('union including a generic', () => {
      const value = '"foo" | "bar" | Class<Baz>';
      expect(isUnsafeToSplit(value)).toEqual(true);
    });
  });

  describe('false positives', () => {
    it('function with an internal union', () => {
      const value = '() => "foo" | "bar"';
      expect(isUnsafeToSplit(value)).toEqual(true);
    });

    it('object with an internal union', () => {
      const value = '{ foo: "bar" | "baz" }';
      expect(isUnsafeToSplit(value)).toEqual(true);
    });

    it('array with an internal union', () => {
      const value = 'Array<"bar" | "baz">';
      expect(isUnsafeToSplit(value)).toEqual(true);
    });
  });
});
