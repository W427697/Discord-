import { storyCoverage, stripExtension, compute } from './storyCoverage';

const statementMap = { '0': {}, '1': {} };
const FULL = { s: { '0': 1, '1': 1 }, statementMap };
const EMPTY = { s: { '0': 0, '1': 0 }, statementMap };
const HALF = { s: { '0': 1, '1': 0 }, statementMap };

const coverageMap = {
  'a.js': FULL,
  'b.ts': EMPTY,
  'c.tsx': HALF,
};

describe('strip extension', () => {
  it('should process stories', () => {
    ['a.stories.js', 'a.stories.jsx', 'a.stories.ts', 'a.stories.tsx'].forEach(fname => {
      expect(stripExtension(fname)).toBe('a');
    });
  });
  ``;
  it('should process components', () => {
    ['a.js', 'a.jsx', 'a.ts', 'a.tsx'].forEach(fname => {
      expect(stripExtension(fname)).toBe('a');
    });
  });
  it('should process relative paths', () => {
    ['./a.stories.js', './a.js'].forEach(fname => {
      expect(stripExtension(fname)).toBe('./a');
    });
  });
  it('should process absolute paths', () => {
    ['/a.stories.js', '/a.js'].forEach(fname => {
      expect(stripExtension(fname)).toBe('/a');
    });
  });
});

describe('coverage calculation', () => {
  it('should compute', () => {
    expect(compute(FULL)).toBe(100);
    expect(compute(EMPTY)).toBe(0);
    expect(compute(HALF)).toBe(50);
  });
});

describe('story coverage', () => {
  it('should compute coverage for each story', () => {
    const cov = storyCoverage(coverageMap, { a: ['a--id'], b: ['b--id'], c: ['c--id1', 'c--id2'] });
    expect(cov).toEqual({
      'a--id': 100,
      'b--id': 0,
      'c--id1': 50,
      'c--id2': 50,
    });
  });
  it('should leave stories without coverage as undefined', () => {
    const cov = storyCoverage(coverageMap, { c: ['c--id'], x: ['x--id'], y: ['y--id'] });
    expect(cov).toEqual({
      'c--id': 50,
      // 'x--id': 0,
      // 'y--id': 0,
    });
  });
});
