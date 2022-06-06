import path from 'path';
import fs from 'fs-extra';
import { normalizeStoriesEntry } from '@storybook/core-common';
import type { NormalizedStoriesSpecifier } from '@storybook/core-common';
import { loadCsf, getStorySortParameter } from '@storybook/csf-tools';

import { StoryIndexGenerator } from './StoryIndexGenerator';

jest.mock('@storybook/csf-tools');

const loadCsfMock = loadCsf as jest.Mock<ReturnType<typeof loadCsf>>;
const getStorySortParameterMock = getStorySortParameter as jest.Mock<
  ReturnType<typeof getStorySortParameter>
>;

const csfIndexer = async (fileName: string, opts: any) => {
  const code = (await fs.readFile(fileName, 'utf-8')).toString();
  return loadCsf(code, { ...opts, fileName }).parse();
};

const options = {
  configDir: path.join(__dirname, '__mockdata__'),
  workingDir: path.join(__dirname, '__mockdata__'),
  storyIndexers: [{ test: /\.stories\..*$/, indexer: csfIndexer }],
  storiesV2Compatibility: false,
  storyStoreV7: true,
};

describe('StoryIndexGenerator', () => {
  beforeEach(() => {
    const actual = jest.requireActual('@storybook/csf-tools');
    loadCsfMock.mockImplementation(actual.loadCsf);
  });
  describe('extraction', () => {
    describe('single file specifier', () => {
      it('extracts stories from the right files', async () => {
        const specifier: NormalizedStoriesSpecifier = normalizeStoriesEntry(
          './src/A.stories.js',
          options
        );

        const generator = new StoryIndexGenerator([specifier], options);
        await generator.initialize();

        expect(await generator.getIndex()).toMatchInlineSnapshot(`
          Object {
            "stories": Object {
              "a--story-one": Object {
                "id": "a--story-one",
                "importPath": "./src/A.stories.js",
                "name": "Story One",
                "title": "A",
              },
            },
            "v": 3,
          }
        `);
      });
    });
    describe('non-recursive specifier', () => {
      it('extracts stories from the right files', async () => {
        const specifier: NormalizedStoriesSpecifier = normalizeStoriesEntry(
          './src/*/*.stories.(ts|js|jsx)',
          options
        );

        const generator = new StoryIndexGenerator([specifier], options);
        await generator.initialize();

        expect(await generator.getIndex()).toMatchInlineSnapshot(`
          Object {
            "stories": Object {
              "nested-button--story-one": Object {
                "id": "nested-button--story-one",
                "importPath": "./src/nested/Button.stories.ts",
                "name": "Story One",
                "title": "nested/Button",
              },
              "second-nested-g--story-one": Object {
                "id": "second-nested-g--story-one",
                "importPath": "./src/second-nested/G.stories.ts",
                "name": "Story One",
                "title": "second-nested/G",
              },
            },
            "v": 3,
          }
        `);
      });
    });

    describe('recursive specifier', () => {
      it('extracts stories from the right files', async () => {
        const specifier: NormalizedStoriesSpecifier = normalizeStoriesEntry(
          './src/**/*.stories.(ts|js|jsx)',
          options
        );

        const generator = new StoryIndexGenerator([specifier], options);
        await generator.initialize();

        expect(await generator.getIndex()).toMatchInlineSnapshot(`
          Object {
            "stories": Object {
              "a--story-one": Object {
                "id": "a--story-one",
                "importPath": "./src/A.stories.js",
                "name": "Story One",
                "title": "A",
              },
              "b--story-one": Object {
                "id": "b--story-one",
                "importPath": "./src/B.stories.ts",
                "name": "Story One",
                "title": "B",
              },
              "d--story-one": Object {
                "id": "d--story-one",
                "importPath": "./src/D.stories.jsx",
                "name": "Story One",
                "title": "D",
              },
              "first-nested-deeply-f--story-one": Object {
                "id": "first-nested-deeply-f--story-one",
                "importPath": "./src/first-nested/deeply/F.stories.js",
                "name": "Story One",
                "title": "first-nested/deeply/F",
              },
              "nested-button--story-one": Object {
                "id": "nested-button--story-one",
                "importPath": "./src/nested/Button.stories.ts",
                "name": "Story One",
                "title": "nested/Button",
              },
              "second-nested-g--story-one": Object {
                "id": "second-nested-g--story-one",
                "importPath": "./src/second-nested/G.stories.ts",
                "name": "Story One",
                "title": "second-nested/G",
              },
            },
            "v": 3,
          }
        `);
      });
    });
  });

  describe('sorting', () => {
    it('runs a user-defined sort function', async () => {
      const specifier: NormalizedStoriesSpecifier = normalizeStoriesEntry(
        './src/**/*.stories.(ts|js|jsx)',
        options
      );

      const generator = new StoryIndexGenerator([specifier], options);
      await generator.initialize();

      (getStorySortParameter as jest.Mock).mockReturnValueOnce({
        order: ['D', 'B', 'nested', 'A', 'second-nested', 'first-nested/deeply'],
      });

      expect(Object.keys((await generator.getIndex()).stories)).toEqual([
        'd--story-one',
        'b--story-one',
        'nested-button--story-one',
        'a--story-one',
        'second-nested-g--story-one',
        'first-nested-deeply-f--story-one',
      ]);
    });
  });

  describe('caching', () => {
    describe('no invalidation', () => {
      it('does not extract csf files a second time', async () => {
        const specifier: NormalizedStoriesSpecifier = normalizeStoriesEntry(
          './src/**/*.stories.(ts|js|jsx)',
          options
        );

        loadCsfMock.mockClear();
        const generator = new StoryIndexGenerator([specifier], options);
        await generator.initialize();
        await generator.getIndex();
        expect(loadCsfMock).toHaveBeenCalledTimes(7);

        loadCsfMock.mockClear();
        await generator.getIndex();
        expect(loadCsfMock).not.toHaveBeenCalled();
      });

      it('does not call the sort function a second time', async () => {
        const specifier: NormalizedStoriesSpecifier = normalizeStoriesEntry(
          './src/**/*.stories.(ts|js|jsx)',
          options
        );

        const sortFn = jest.fn();
        getStorySortParameterMock.mockReturnValue(sortFn);
        const generator = new StoryIndexGenerator([specifier], options);
        await generator.initialize();
        await generator.getIndex();
        expect(sortFn).toHaveBeenCalled();

        sortFn.mockClear();
        await generator.getIndex();
        expect(sortFn).not.toHaveBeenCalled();
      });
    });

    describe('file changed', () => {
      it('calls extract csf file for just the one file', async () => {
        const specifier: NormalizedStoriesSpecifier = normalizeStoriesEntry(
          './src/**/*.stories.(ts|js|jsx)',
          options
        );

        loadCsfMock.mockClear();
        const generator = new StoryIndexGenerator([specifier], options);
        await generator.initialize();
        await generator.getIndex();
        expect(loadCsfMock).toHaveBeenCalledTimes(7);

        generator.invalidate(specifier, './src/B.stories.ts', false);

        loadCsfMock.mockClear();
        await generator.getIndex();
        expect(loadCsfMock).toHaveBeenCalledTimes(1);
      });

      it('does call the sort function a second time', async () => {
        const specifier: NormalizedStoriesSpecifier = normalizeStoriesEntry(
          './src/**/*.stories.(ts|js|jsx)',
          options
        );

        const sortFn = jest.fn();
        getStorySortParameterMock.mockReturnValue(sortFn);
        const generator = new StoryIndexGenerator([specifier], options);
        await generator.initialize();
        await generator.getIndex();
        expect(sortFn).toHaveBeenCalled();

        generator.invalidate(specifier, './src/B.stories.ts', false);

        sortFn.mockClear();
        await generator.getIndex();
        expect(sortFn).toHaveBeenCalled();
      });

      describe('file removed', () => {
        it('does not extract csf files a second time', async () => {
          const specifier: NormalizedStoriesSpecifier = normalizeStoriesEntry(
            './src/**/*.stories.(ts|js|jsx)',
            options
          );

          loadCsfMock.mockClear();
          const generator = new StoryIndexGenerator([specifier], options);
          await generator.initialize();
          await generator.getIndex();
          expect(loadCsfMock).toHaveBeenCalledTimes(7);

          generator.invalidate(specifier, './src/B.stories.ts', true);

          loadCsfMock.mockClear();
          await generator.getIndex();
          expect(loadCsfMock).not.toHaveBeenCalled();
        });

        it('does call the sort function a second time', async () => {
          const specifier: NormalizedStoriesSpecifier = normalizeStoriesEntry(
            './src/**/*.stories.(ts|js|jsx)',
            options
          );

          const sortFn = jest.fn();
          getStorySortParameterMock.mockReturnValue(sortFn);
          const generator = new StoryIndexGenerator([specifier], options);
          await generator.initialize();
          await generator.getIndex();
          expect(sortFn).toHaveBeenCalled();

          generator.invalidate(specifier, './src/B.stories.ts', true);

          sortFn.mockClear();
          await generator.getIndex();
          expect(sortFn).toHaveBeenCalled();
        });

        it('does not include the deleted stories in results', async () => {
          const specifier: NormalizedStoriesSpecifier = normalizeStoriesEntry(
            './src/**/*.stories.(ts|js|jsx)',
            options
          );

          loadCsfMock.mockClear();
          const generator = new StoryIndexGenerator([specifier], options);
          await generator.initialize();
          await generator.getIndex();
          expect(loadCsfMock).toHaveBeenCalledTimes(7);

          generator.invalidate(specifier, './src/B.stories.ts', true);

          expect(Object.keys((await generator.getIndex()).stories)).not.toContain('b--story-one');
        });
      });
    });
  });
});
