import path from 'path';
import findUp from 'find-up';
import { normalizeStoryPath, getProjectRoot } from '../paths';

jest.mock('find-up');

// Windows uses backslashes, which causes failures that won't happen on Unix based systems, so we just normalize the paths
const normalizeSeparator = (str: string) => str.replace(/\//g, path.sep);

describe('paths - normalizeStoryPath()', () => {
  it('returns a path starting with "./" unchanged', () => {
    const filename = normalizeSeparator(`./${path.join('src', 'Comp.story.js')}`);
    expect(normalizeStoryPath(filename)).toEqual(filename);
  });

  it('returns a path starting with "../" unchanged', () => {
    const filename = path.join('..', 'src', 'Comp.story.js');
    expect(normalizeStoryPath(filename)).toEqual(filename);
  });

  it('returns a path equal to "." unchanged', () => {
    const filename = '.';
    expect(normalizeStoryPath(filename)).toEqual(filename);
  });

  it('returns a path equal to ".." unchanged', () => {
    const filename = '..';
    expect(normalizeStoryPath(filename)).toEqual(filename);
  });

  it('adds "./" to a normalized relative path', () => {
    const filename = path.join('src', 'Comp.story.js');
    expect(normalizeStoryPath(filename)).toEqual(normalizeSeparator(`./${filename}`));
  });

  it('adds "./" to a hidden folder', () => {
    const filename = path.join('.storybook', 'Comp.story.js');
    expect(normalizeStoryPath(filename)).toEqual(normalizeSeparator(`./${filename}`));
  });

  it('adds "./" to a hidden file', () => {
    const filename = `.Comp.story.js`;
    expect(normalizeStoryPath(filename)).toEqual(normalizeSeparator(`./${filename}`));
  });
});

describe('getProjectRoot', () => {
  const mockedFindUp = findUp as jest.Mocked<typeof findUp>;

  it('should return the root directory containing a .git directory', () => {
    mockedFindUp.sync.mockImplementation((name) =>
      name === ('.git' as any) ? normalizeSeparator('/path/to/root') : undefined
    );

    expect(getProjectRoot()).toBe(normalizeSeparator('/path/to'));
  });

  it('should return the root directory containing a .svn directory if there is no .git directory', () => {
    mockedFindUp.sync.mockImplementation((name) =>
      name === ('.svn' as any) ? normalizeSeparator('/path/to/root') : undefined
    );

    expect(getProjectRoot()).toBe(normalizeSeparator('/path/to'));
  });

  it('should return the root directory containing a .yarn directory if there is no .git or .svn directory', () => {
    mockedFindUp.sync.mockImplementation((name) =>
      name === ('.yarn' as any) ? normalizeSeparator('/path/to/root') : undefined
    );

    expect(getProjectRoot()).toBe(normalizeSeparator('/path/to'));
  });
});
