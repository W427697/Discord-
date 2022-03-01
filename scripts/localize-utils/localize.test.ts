import resolveFrom from 'resolve-from';
import { localize, getPackageName } from './localize';

jest.mock('resolve-from', () =>
  jest.fn((from: string, to: string) => `/projects/dist/node_modules/${to}`)
);
const reporter = jest.fn();

describe('getPackageName', () => {
  it('namespaced', () => {
    expect(getPackageName('@storybook/test')).toBe('@storybook/test');
    expect(getPackageName('@storybook/test/bar')).toBe('@storybook/test');
  });
  it('global', () => {
    expect(getPackageName('foo')).toBe('foo');
    expect(getPackageName('foo/bar')).toBe('foo');
  });
  it('deep file', () => {
    expect(getPackageName('foo/bar/deep/deeeep/file.json')).toBe('foo');
  });
  it('trailing slash', () => {
    expect(getPackageName('foo/')).toBe('foo');
  });
});

describe('localize', () => {
  it('normal', () => {
    expect(localize(reporter, '/projects/dist/esm/bar.js', 'foo')).toBe('../local_modules/foo');
  });
  it('deep', () => {
    expect(localize(reporter, '/projects/dist/esm/bar.js', 'foo/foo')).toBe(
      '../local_modules/foo/foo'
    );
  });
  it('real deep', () => {
    expect(localize(reporter, '/projects/dist/esm/bar.js', 'a/b/c/d')).toBe(
      '../local_modules/a/b/c/d'
    );
  });
  it('name spaced', () => {
    expect(localize(reporter, '/projects/dist/esm/bar.js', '@a/b')).toBe('../local_modules/@a/b');
  });
  it('name spaced and deep', () => {
    expect(localize(reporter, '/projects/dist/esm/bar.js', '@a/b/c')).toBe(
      '../local_modules/@a/b/c'
    );
  });
});

describe('error reporting', () => {
  it('continues but calls reporter', () => {
    (resolveFrom as jest.MockedFunction<typeof resolveFrom>).mockImplementationOnce(() => {
      throw new Error('A');
    });
    expect(localize(reporter, '/projects/dist/esm/bar.js', '@a/b/c')).toBe('@a/b/c');
    expect(reporter).toHaveBeenCalledWith(new Error('A'));
  });
});
