/* eslint-disable @typescript-eslint/no-shadow */

/**
 * @vitest-environment node
 */
import { describe, beforeEach, it, expect, vi } from 'vitest';

import path from 'path';
import { normalizeStoriesEntry } from '@storybook/core-common';
import type { NormalizedStoriesSpecifier, StoryIndexEntry } from '@storybook/types';
import { readCsf, getStorySortParameter } from '@storybook/csf-tools';
import { toId } from '@storybook/csf';
import { logger, once } from '@storybook/node-logger';

import type { StoryIndexGeneratorOptions } from './StoryIndexGenerator';
import { StoryIndexGenerator } from './StoryIndexGenerator';
import { csfIndexer } from '../presets/common-preset';

vi.mock('@storybook/csf', async (importOriginal) => {
  const csf = await importOriginal<typeof import('@storybook/csf')>();
  return {
    ...csf,
    toId: vi.fn(csf.toId),
  };
});

vi.mock('@storybook/node-logger');

const toIdMock = vi.mocked(toId);
vi.mock('@storybook/csf-tools', async (importOriginal) => {
  const csfTools = await importOriginal<typeof import('@storybook/csf-tools')>();
  return {
    ...csfTools,
    readCsf: vi.fn(csfTools.readCsf),
    getStorySortParameter: vi.fn(csfTools.getStorySortParameter),
  };
});

const readCsfMock = vi.mocked(readCsf);
const getStorySortParameterMock = vi.mocked(getStorySortParameter);

const options: StoryIndexGeneratorOptions = {
  configDir: path.join(__dirname, '__mockdata__'),
  workingDir: path.join(__dirname, '__mockdata__'),
  indexers: [csfIndexer],
  docs: { defaultName: 'docs', autodocs: false },
};

describe('StoryIndexGenerator', () => {
  beforeEach(() => {
    vi.mocked(logger.warn).mockClear();
    vi.mocked(once.warn).mockClear();
  });
  describe('extraction', () => {
    const storiesSpecifier: NormalizedStoriesSpecifier = normalizeStoriesEntry(
      './src/A.stories.(ts|js|mjs|jsx)',
      options
    );
    const docsSpecifier: NormalizedStoriesSpecifier = normalizeStoriesEntry(
      './src/docs2/*.mdx',
      options
    );

    describe('single file specifier', () => {
      it('extracts stories from the right files', async () => {
        const specifier: NormalizedStoriesSpecifier = normalizeStoriesEntry(
          './src/A.stories.js',
          options
        );

        const generator = new StoryIndexGenerator([specifier], options);
        await generator.initialize();

        expect(await generator.getIndex()).toMatchInlineSnapshot(`
          {
            "entries": {
              "a--story-one": {
                "id": "a--story-one",
                "importPath": "./src/A.stories.js",
                "name": "Story One",
                "tags": [
                  "dev",
                  "test",
                  "component-tag",
                  "story-tag",
                ],
                "title": "A",
                "type": "story",
              },
            },
            "v": 5,
          }
        `);
      });
    });
    describe('single file .story specifier', () => {
      it('extracts stories from the right files', async () => {
        const specifier: NormalizedStoriesSpecifier = normalizeStoriesEntry(
          './src/F.story.ts',
          options
        );

        const generator = new StoryIndexGenerator([specifier], options);
        await generator.initialize();

        expect(await generator.getIndex()).toMatchInlineSnapshot(`
          {
            "entries": {
              "f--story-one": {
                "id": "f--story-one",
                "importPath": "./src/F.story.ts",
                "name": "Story One",
                "tags": [
                  "dev",
                  "test",
                  "autodocs",
                ],
                "title": "F",
                "type": "story",
              },
            },
            "v": 5,
          }
        `);
      });
    });
    describe('no prefix stories specifier', () => {
      it('extracts stories from the right files', async () => {
        const specifier: NormalizedStoriesSpecifier = normalizeStoriesEntry(
          './src/stories.ts',
          options
        );

        const generator = new StoryIndexGenerator([specifier], options);
        await generator.initialize();

        expect(await generator.getIndex()).toMatchInlineSnapshot(`
          {
            "entries": {
              "stories--story-one": {
                "id": "stories--story-one",
                "importPath": "./src/stories.ts",
                "name": "Story One",
                "tags": [
                  "dev",
                  "test",
                  "autodocs",
                ],
                "title": "stories",
                "type": "story",
              },
            },
            "v": 5,
          }
        `);
      });
    });
    describe('non-recursive specifier', () => {
      it('extracts stories from the right files', async () => {
        const specifier: NormalizedStoriesSpecifier = normalizeStoriesEntry(
          './src/*/*.stories.(ts|js|mjs|jsx)',
          options
        );

        const generator = new StoryIndexGenerator([specifier], options);
        await generator.initialize();

        expect(await generator.getIndex()).toMatchInlineSnapshot(`
          {
            "entries": {
              "nested-button--story-one": {
                "id": "nested-button--story-one",
                "importPath": "./src/nested/Button.stories.ts",
                "name": "Story One",
                "tags": [
                  "dev",
                  "test",
                  "component-tag",
                ],
                "title": "nested/Button",
                "type": "story",
              },
              "second-nested-g--story-one": {
                "id": "second-nested-g--story-one",
                "importPath": "./src/second-nested/G.stories.ts",
                "name": "Story One",
                "tags": [
                  "dev",
                  "test",
                ],
                "title": "second-nested/G",
                "type": "story",
              },
            },
            "v": 5,
          }
        `);
      });
    });
    describe('recursive specifier', () => {
      it('extracts stories from the right files', async () => {
        const specifier: NormalizedStoriesSpecifier = normalizeStoriesEntry(
          './src/**/*.stories.(ts|js|mjs|jsx)',
          options
        );

        const generator = new StoryIndexGenerator([specifier], options);
        await generator.initialize();

        expect(await generator.getIndex()).toMatchInlineSnapshot(`
          {
            "entries": {
              "a--story-one": {
                "id": "a--story-one",
                "importPath": "./src/A.stories.js",
                "name": "Story One",
                "tags": [
                  "dev",
                  "test",
                  "component-tag",
                  "story-tag",
                ],
                "title": "A",
                "type": "story",
              },
              "b--story-one": {
                "id": "b--story-one",
                "importPath": "./src/B.stories.ts",
                "name": "Story One",
                "tags": [
                  "dev",
                  "test",
                  "autodocs",
                ],
                "title": "B",
                "type": "story",
              },
              "d--story-one": {
                "id": "d--story-one",
                "importPath": "./src/D.stories.jsx",
                "name": "Story One",
                "tags": [
                  "dev",
                  "test",
                  "autodocs",
                ],
                "title": "D",
                "type": "story",
              },
              "first-nested-deeply-f--story-one": {
                "id": "first-nested-deeply-f--story-one",
                "importPath": "./src/first-nested/deeply/F.stories.js",
                "name": "Story One",
                "tags": [
                  "dev",
                  "test",
                ],
                "title": "first-nested/deeply/F",
                "type": "story",
              },
              "h--story-one": {
                "id": "h--story-one",
                "importPath": "./src/H.stories.mjs",
                "name": "Story One",
                "tags": [
                  "dev",
                  "test",
                  "autodocs",
                ],
                "title": "H",
                "type": "story",
              },
              "nested-button--story-one": {
                "id": "nested-button--story-one",
                "importPath": "./src/nested/Button.stories.ts",
                "name": "Story One",
                "tags": [
                  "dev",
                  "test",
                  "component-tag",
                ],
                "title": "nested/Button",
                "type": "story",
              },
              "second-nested-g--story-one": {
                "id": "second-nested-g--story-one",
                "importPath": "./src/second-nested/G.stories.ts",
                "name": "Story One",
                "tags": [
                  "dev",
                  "test",
                ],
                "title": "second-nested/G",
                "type": "story",
              },
            },
            "v": 5,
          }
        `);
      });
    });

    describe('autodocs', () => {
      const autodocsOptions = {
        ...options,
        docs: { ...options.docs, autodocs: 'tag' as const },
      };
      it('generates an entry per CSF file with the autodocs tag', async () => {
        const specifier: NormalizedStoriesSpecifier = normalizeStoriesEntry(
          './src/**/*.stories.(ts|js|mjs|jsx)',
          options
        );

        const generator = new StoryIndexGenerator([specifier], autodocsOptions);
        await generator.initialize();

        expect(await generator.getIndex()).toMatchInlineSnapshot(`
          {
            "entries": {
              "a--story-one": {
                "id": "a--story-one",
                "importPath": "./src/A.stories.js",
                "name": "Story One",
                "tags": [
                  "dev",
                  "test",
                  "component-tag",
                  "story-tag",
                ],
                "title": "A",
                "type": "story",
              },
              "b--docs": {
                "id": "b--docs",
                "importPath": "./src/B.stories.ts",
                "name": "docs",
                "storiesImports": [],
                "tags": [
                  "dev",
                  "test",
                  "autodocs",
                ],
                "title": "B",
                "type": "docs",
              },
              "b--story-one": {
                "id": "b--story-one",
                "importPath": "./src/B.stories.ts",
                "name": "Story One",
                "tags": [
                  "dev",
                  "test",
                  "autodocs",
                ],
                "title": "B",
                "type": "story",
              },
              "d--docs": {
                "id": "d--docs",
                "importPath": "./src/D.stories.jsx",
                "name": "docs",
                "storiesImports": [],
                "tags": [
                  "dev",
                  "test",
                  "autodocs",
                ],
                "title": "D",
                "type": "docs",
              },
              "d--story-one": {
                "id": "d--story-one",
                "importPath": "./src/D.stories.jsx",
                "name": "Story One",
                "tags": [
                  "dev",
                  "test",
                  "autodocs",
                ],
                "title": "D",
                "type": "story",
              },
              "first-nested-deeply-f--story-one": {
                "id": "first-nested-deeply-f--story-one",
                "importPath": "./src/first-nested/deeply/F.stories.js",
                "name": "Story One",
                "tags": [
                  "dev",
                  "test",
                ],
                "title": "first-nested/deeply/F",
                "type": "story",
              },
              "h--docs": {
                "id": "h--docs",
                "importPath": "./src/H.stories.mjs",
                "name": "docs",
                "storiesImports": [],
                "tags": [
                  "dev",
                  "test",
                  "autodocs",
                ],
                "title": "H",
                "type": "docs",
              },
              "h--story-one": {
                "id": "h--story-one",
                "importPath": "./src/H.stories.mjs",
                "name": "Story One",
                "tags": [
                  "dev",
                  "test",
                  "autodocs",
                ],
                "title": "H",
                "type": "story",
              },
              "nested-button--story-one": {
                "id": "nested-button--story-one",
                "importPath": "./src/nested/Button.stories.ts",
                "name": "Story One",
                "tags": [
                  "dev",
                  "test",
                  "component-tag",
                ],
                "title": "nested/Button",
                "type": "story",
              },
              "second-nested-g--story-one": {
                "id": "second-nested-g--story-one",
                "importPath": "./src/second-nested/G.stories.ts",
                "name": "Story One",
                "tags": [
                  "dev",
                  "test",
                ],
                "title": "second-nested/G",
                "type": "story",
              },
            },
            "v": 5,
          }
        `);
      });

      const autodocsTrueOptions = {
        ...autodocsOptions,
        docs: {
          ...autodocsOptions.docs,
          autodocs: true,
        },
      };
      it('generates an entry for every CSF file when docsOptions.autodocs = true', async () => {
        const specifier: NormalizedStoriesSpecifier = normalizeStoriesEntry(
          './src/**/*.stories.(ts|js|mjs|jsx)',
          options
        );

        const generator = new StoryIndexGenerator([specifier], autodocsTrueOptions);
        await generator.initialize();

        expect(Object.keys((await generator.getIndex()).entries)).toMatchInlineSnapshot(`
          [
            "a--docs",
            "a--story-one",
            "b--docs",
            "b--story-one",
            "d--docs",
            "d--story-one",
            "h--docs",
            "h--story-one",
            "first-nested-deeply-f--docs",
            "first-nested-deeply-f--story-one",
            "nested-button--docs",
            "nested-button--story-one",
            "second-nested-g--docs",
            "second-nested-g--story-one",
          ]
        `);
      });

      it('adds the autodocs tag to the autogenerated docs entries', async () => {
        const specifier: NormalizedStoriesSpecifier = normalizeStoriesEntry(
          './src/**/*.stories.(ts|js|mjs|jsx)',
          options
        );

        const generator = new StoryIndexGenerator([specifier], autodocsTrueOptions);
        await generator.initialize();

        const index = await generator.getIndex();
        expect(index.entries['first-nested-deeply-f--docs'].tags).toEqual(
          expect.arrayContaining(['autodocs'])
        );
      });

      it('throws an error if you attach a named MetaOf entry which clashes with a tagged autodocs entry', async () => {
        const csfSpecifier: NormalizedStoriesSpecifier = normalizeStoriesEntry(
          './src/B.stories.ts',
          options
        );

        const docsSpecifier: NormalizedStoriesSpecifier = normalizeStoriesEntry(
          './errors/MetaOfClashingDefaultName.mdx',
          options
        );

        const generator = new StoryIndexGenerator([csfSpecifier, docsSpecifier], autodocsOptions);
        await generator.initialize();

        await expect(generator.getIndex()).rejects.toThrowErrorMatchingInlineSnapshot(
          `[Error: Unable to index ./errors/MetaOfClashingDefaultName.mdx,./src/B.stories.ts]`
        );
      });

      it('throws an error if you attach a unnamed MetaOf entry with the same name as the CSF file that clashes with a tagged autodocs entry', async () => {
        const csfSpecifier: NormalizedStoriesSpecifier = normalizeStoriesEntry(
          './src/B.stories.ts',
          options
        );

        const docsSpecifier: NormalizedStoriesSpecifier = normalizeStoriesEntry(
          './errors/B.mdx',
          options
        );

        const generator = new StoryIndexGenerator([csfSpecifier, docsSpecifier], autodocsOptions);
        await generator.initialize();

        await expect(generator.getIndex()).rejects.toThrowErrorMatchingInlineSnapshot(
          `[Error: Unable to index ./errors/B.mdx,./src/B.stories.ts]`
        );
      });

      it('allows you to create a second unnamed MetaOf entry that does not clash with autodocs', async () => {
        const csfSpecifier: NormalizedStoriesSpecifier = normalizeStoriesEntry(
          './src/B.stories.ts',
          options
        );

        const docsSpecifier: NormalizedStoriesSpecifier = normalizeStoriesEntry(
          './errors/MetaOfNoName.mdx',
          options
        );

        const generator = new StoryIndexGenerator([csfSpecifier, docsSpecifier], autodocsOptions);
        await generator.initialize();

        expect(await generator.getIndex()).toMatchInlineSnapshot(`
          {
            "entries": {
              "b--docs": {
                "id": "b--docs",
                "importPath": "./src/B.stories.ts",
                "name": "docs",
                "storiesImports": [],
                "tags": [
                  "dev",
                  "test",
                  "autodocs",
                ],
                "title": "B",
                "type": "docs",
              },
              "b--metaofnoname": {
                "id": "b--metaofnoname",
                "importPath": "./errors/MetaOfNoName.mdx",
                "name": "MetaOfNoName",
                "storiesImports": [
                  "./src/B.stories.ts",
                ],
                "tags": [
                  "dev",
                  "test",
                  "autodocs",
                  "attached-mdx",
                ],
                "title": "B",
                "type": "docs",
              },
              "b--story-one": {
                "id": "b--story-one",
                "importPath": "./src/B.stories.ts",
                "name": "Story One",
                "tags": [
                  "dev",
                  "test",
                  "autodocs",
                ],
                "title": "B",
                "type": "story",
              },
            },
            "v": 5,
          }
        `);
      });
      it('allows you to create a second MetaOf entry with a different name to autodocs', async () => {
        const csfSpecifier: NormalizedStoriesSpecifier = normalizeStoriesEntry(
          './src/B.stories.ts',
          options
        );

        const docsSpecifier: NormalizedStoriesSpecifier = normalizeStoriesEntry(
          './errors/MetaOfName.mdx',
          options
        );

        const generator = new StoryIndexGenerator([csfSpecifier, docsSpecifier], autodocsOptions);
        await generator.initialize();

        expect(await generator.getIndex()).toMatchInlineSnapshot(`
          {
            "entries": {
              "b--docs": {
                "id": "b--docs",
                "importPath": "./src/B.stories.ts",
                "name": "docs",
                "storiesImports": [],
                "tags": [
                  "dev",
                  "test",
                  "autodocs",
                ],
                "title": "B",
                "type": "docs",
              },
              "b--name": {
                "id": "b--name",
                "importPath": "./errors/MetaOfName.mdx",
                "name": "name",
                "storiesImports": [
                  "./src/B.stories.ts",
                ],
                "tags": [
                  "dev",
                  "test",
                  "autodocs",
                  "attached-mdx",
                ],
                "title": "B",
                "type": "docs",
              },
              "b--story-one": {
                "id": "b--story-one",
                "importPath": "./src/B.stories.ts",
                "name": "Story One",
                "tags": [
                  "dev",
                  "test",
                  "autodocs",
                ],
                "title": "B",
                "type": "story",
              },
            },
            "v": 5,
          }
        `);
      });

      it('allows you to override autodocs with MetaOf if it is automatic', async () => {
        const csfSpecifier: NormalizedStoriesSpecifier = normalizeStoriesEntry(
          './src/A.stories.js',
          options
        );

        const docsSpecifier: NormalizedStoriesSpecifier = normalizeStoriesEntry(
          './errors/A.mdx',
          options
        );

        const generator = new StoryIndexGenerator(
          [csfSpecifier, docsSpecifier],
          autodocsTrueOptions
        );
        await generator.initialize();

        expect(await generator.getIndex()).toMatchInlineSnapshot(`
          {
            "entries": {
              "a--docs": {
                "id": "a--docs",
                "importPath": "./errors/A.mdx",
                "name": "docs",
                "storiesImports": [
                  "./src/A.stories.js",
                ],
                "tags": [
                  "dev",
                  "test",
                  "autodocs",
                  "component-tag",
                  "story-tag",
                  "attached-mdx",
                ],
                "title": "A",
                "type": "docs",
              },
              "a--story-one": {
                "id": "a--story-one",
                "importPath": "./src/A.stories.js",
                "name": "Story One",
                "tags": [
                  "dev",
                  "test",
                  "autodocs",
                  "component-tag",
                  "story-tag",
                ],
                "title": "A",
                "type": "story",
              },
            },
            "v": 5,
          }
        `);
      });

      it('generates a combined entry if there are two stories files for the same title', async () => {
        const specifier: NormalizedStoriesSpecifier = normalizeStoriesEntry(
          './duplicate/*.stories.(ts|js|mjs|jsx)',
          options
        );

        const generator = new StoryIndexGenerator([specifier], autodocsOptions);
        await generator.initialize();

        expect(await generator.getIndex()).toMatchInlineSnapshot(`
          {
            "entries": {
              "duplicate-a--docs": {
                "id": "duplicate-a--docs",
                "importPath": "./duplicate/A.stories.js",
                "name": "docs",
                "storiesImports": [
                  "./duplicate/SecondA.stories.js",
                ],
                "tags": [
                  "dev",
                  "test",
                  "autodocs",
                ],
                "title": "duplicate/A",
                "type": "docs",
              },
              "duplicate-a--story-one": {
                "id": "duplicate-a--story-one",
                "importPath": "./duplicate/A.stories.js",
                "name": "Story One",
                "tags": [
                  "dev",
                  "test",
                  "autodocs",
                ],
                "title": "duplicate/A",
                "type": "story",
              },
              "duplicate-a--story-two": {
                "id": "duplicate-a--story-two",
                "importPath": "./duplicate/SecondA.stories.js",
                "name": "Story Two",
                "tags": [
                  "dev",
                  "test",
                  "autodocs",
                ],
                "title": "duplicate/A",
                "type": "story",
              },
            },
            "v": 5,
          }
        `);
      });

      // https://github.com/storybookjs/storybook/issues/19142
      it('does not generate a docs page entry if there are no stories in the CSF file', async () => {
        const csfSpecifier: NormalizedStoriesSpecifier = normalizeStoriesEntry(
          './errors/NoStories.stories.ts',
          options
        );

        const generator = new StoryIndexGenerator([csfSpecifier], autodocsOptions);
        await generator.initialize();

        expect(await generator.getIndex()).toMatchInlineSnapshot(`
          {
            "entries": {},
            "v": 5,
          }
        `);
      });

      it('prioritizes using the component id over meta.title for generating its id, if provided. (autodocs)', async () => {
        const csfSpecifier: NormalizedStoriesSpecifier = normalizeStoriesEntry(
          './docs-id-generation/A.stories.jsx',
          options
        );

        const generator = new StoryIndexGenerator([csfSpecifier], autodocsOptions);
        await generator.initialize();

        expect(await generator.getIndex()).toMatchInlineSnapshot(`
          {
            "entries": {
              "my-component-a--docs": {
                "id": "my-component-a--docs",
                "importPath": "./docs-id-generation/A.stories.jsx",
                "name": "docs",
                "storiesImports": [],
                "tags": [
                  "dev",
                  "test",
                  "autodocs",
                ],
                "title": "A",
                "type": "docs",
              },
              "my-component-a--story-one": {
                "id": "my-component-a--story-one",
                "importPath": "./docs-id-generation/A.stories.jsx",
                "name": "Story One",
                "tags": [
                  "dev",
                  "test",
                  "autodocs",
                ],
                "title": "A",
                "type": "story",
              },
            },
            "v": 5,
          }
        `);
      });
    });

    describe('docs specifier', () => {
      it('creates correct docs entries', async () => {
        const generator = new StoryIndexGenerator([storiesSpecifier, docsSpecifier], options);
        await generator.initialize();

        expect(await generator.getIndex()).toMatchInlineSnapshot(`
          {
            "entries": {
              "a--metaof": {
                "id": "a--metaof",
                "importPath": "./src/docs2/MetaOf.mdx",
                "name": "MetaOf",
                "storiesImports": [
                  "./src/A.stories.js",
                ],
                "tags": [
                  "dev",
                  "test",
                  "component-tag",
                  "story-tag",
                  "attached-mdx",
                ],
                "title": "A",
                "type": "docs",
              },
              "a--second-docs": {
                "id": "a--second-docs",
                "importPath": "./src/docs2/SecondMetaOf.mdx",
                "name": "Second Docs",
                "storiesImports": [
                  "./src/A.stories.js",
                ],
                "tags": [
                  "dev",
                  "test",
                  "component-tag",
                  "story-tag",
                  "attached-mdx",
                ],
                "title": "A",
                "type": "docs",
              },
              "a--story-one": {
                "id": "a--story-one",
                "importPath": "./src/A.stories.js",
                "name": "Story One",
                "tags": [
                  "dev",
                  "test",
                  "component-tag",
                  "story-tag",
                ],
                "title": "A",
                "type": "story",
              },
              "componentreference--docs": {
                "id": "componentreference--docs",
                "importPath": "./src/docs2/ComponentReference.mdx",
                "name": "docs",
                "storiesImports": [],
                "tags": [
                  "dev",
                  "test",
                  "unattached-mdx",
                ],
                "title": "ComponentReference",
                "type": "docs",
              },
              "docs2-yabbadabbadooo--docs": {
                "id": "docs2-yabbadabbadooo--docs",
                "importPath": "./src/docs2/Title.mdx",
                "name": "docs",
                "storiesImports": [],
                "tags": [
                  "dev",
                  "test",
                  "unattached-mdx",
                ],
                "title": "docs2/Yabbadabbadooo",
                "type": "docs",
              },
              "notitle--docs": {
                "id": "notitle--docs",
                "importPath": "./src/docs2/NoTitle.mdx",
                "name": "docs",
                "storiesImports": [],
                "tags": [
                  "dev",
                  "test",
                  "unattached-mdx",
                ],
                "title": "NoTitle",
                "type": "docs",
              },
            },
            "v": 5,
          }
        `);
      });

      it('does not append title prefix if meta references a CSF file', async () => {
        const generator = new StoryIndexGenerator(
          [
            storiesSpecifier,
            normalizeStoriesEntry(
              { directory: './src/docs2', files: '**/*.mdx', titlePrefix: 'titlePrefix' },
              options
            ),
          ],
          options
        );
        await generator.initialize();

        // NOTE: `toMatchInlineSnapshot` on objects sorts the keys, but in actuality, they are
        // not sorted by default.
        expect(Object.values((await generator.getIndex()).entries).map((e) => e.title))
          .toMatchInlineSnapshot(`
            [
              "A",
              "titlePrefix/ComponentReference",
              "A",
              "titlePrefix/NoTitle",
              "A",
              "titlePrefix/docs2/Yabbadabbadooo",
            ]
          `);
      });

      it('Allows you to override default name for docs files', async () => {
        const generator = new StoryIndexGenerator([storiesSpecifier, docsSpecifier], {
          ...options,
          docs: {
            ...options.docs,
            defaultName: 'Info',
          },
        });
        await generator.initialize();

        expect(await generator.getIndex()).toMatchInlineSnapshot(`
          {
            "entries": {
              "a--metaof": {
                "id": "a--metaof",
                "importPath": "./src/docs2/MetaOf.mdx",
                "name": "MetaOf",
                "storiesImports": [
                  "./src/A.stories.js",
                ],
                "tags": [
                  "dev",
                  "test",
                  "component-tag",
                  "story-tag",
                  "attached-mdx",
                ],
                "title": "A",
                "type": "docs",
              },
              "a--second-docs": {
                "id": "a--second-docs",
                "importPath": "./src/docs2/SecondMetaOf.mdx",
                "name": "Second Docs",
                "storiesImports": [
                  "./src/A.stories.js",
                ],
                "tags": [
                  "dev",
                  "test",
                  "component-tag",
                  "story-tag",
                  "attached-mdx",
                ],
                "title": "A",
                "type": "docs",
              },
              "a--story-one": {
                "id": "a--story-one",
                "importPath": "./src/A.stories.js",
                "name": "Story One",
                "tags": [
                  "dev",
                  "test",
                  "component-tag",
                  "story-tag",
                ],
                "title": "A",
                "type": "story",
              },
              "componentreference--info": {
                "id": "componentreference--info",
                "importPath": "./src/docs2/ComponentReference.mdx",
                "name": "Info",
                "storiesImports": [],
                "tags": [
                  "dev",
                  "test",
                  "unattached-mdx",
                ],
                "title": "ComponentReference",
                "type": "docs",
              },
              "docs2-yabbadabbadooo--info": {
                "id": "docs2-yabbadabbadooo--info",
                "importPath": "./src/docs2/Title.mdx",
                "name": "Info",
                "storiesImports": [],
                "tags": [
                  "dev",
                  "test",
                  "unattached-mdx",
                ],
                "title": "docs2/Yabbadabbadooo",
                "type": "docs",
              },
              "notitle--info": {
                "id": "notitle--info",
                "importPath": "./src/docs2/NoTitle.mdx",
                "name": "Info",
                "storiesImports": [],
                "tags": [
                  "dev",
                  "test",
                  "unattached-mdx",
                ],
                "title": "NoTitle",
                "type": "docs",
              },
            },
            "v": 5,
          }
        `);
      });

      it('pulls the attached story file to the front of the list', async () => {
        const generator = new StoryIndexGenerator(
          [
            normalizeStoriesEntry('./src/A.stories.js', options),
            normalizeStoriesEntry('./src/B.stories.ts', options),
            normalizeStoriesEntry('./complex/TwoStoryReferences.mdx', options),
          ],
          options
        );
        await generator.initialize();
        expect(await generator.getIndex()).toMatchInlineSnapshot(`
          {
            "entries": {
              "a--story-one": {
                "id": "a--story-one",
                "importPath": "./src/A.stories.js",
                "name": "Story One",
                "tags": [
                  "dev",
                  "test",
                  "component-tag",
                  "story-tag",
                ],
                "title": "A",
                "type": "story",
              },
              "b--story-one": {
                "id": "b--story-one",
                "importPath": "./src/B.stories.ts",
                "name": "Story One",
                "tags": [
                  "dev",
                  "test",
                  "autodocs",
                ],
                "title": "B",
                "type": "story",
              },
              "b--twostoryreferences": {
                "id": "b--twostoryreferences",
                "importPath": "./complex/TwoStoryReferences.mdx",
                "name": "TwoStoryReferences",
                "storiesImports": [
                  "./src/B.stories.ts",
                  "./src/A.stories.js",
                ],
                "tags": [
                  "dev",
                  "test",
                  "autodocs",
                  "attached-mdx",
                ],
                "title": "B",
                "type": "docs",
              },
            },
            "v": 5,
          }
        `);
      });

      it('prioritizes using the component id over meta.title for generating its id, if provided. (mdx docs)', async () => {
        const csfSpecifier: NormalizedStoriesSpecifier = normalizeStoriesEntry(
          './docs-id-generation/B.stories.jsx',
          options
        );

        const docsSpecifier: NormalizedStoriesSpecifier = normalizeStoriesEntry(
          './docs-id-generation/B.docs.mdx',
          options
        );

        const generator = new StoryIndexGenerator([csfSpecifier, docsSpecifier], options);
        await generator.initialize();

        expect(await generator.getIndex()).toMatchInlineSnapshot(`
          {
            "entries": {
              "my-component-b--docs": {
                "id": "my-component-b--docs",
                "importPath": "./docs-id-generation/B.docs.mdx",
                "name": "docs",
                "storiesImports": [
                  "./docs-id-generation/B.stories.jsx",
                ],
                "tags": [
                  "dev",
                  "test",
                  "attached-mdx",
                ],
                "title": "B",
                "type": "docs",
              },
              "my-component-b--story-one": {
                "id": "my-component-b--story-one",
                "importPath": "./docs-id-generation/B.stories.jsx",
                "name": "Story One",
                "tags": [
                  "dev",
                  "test",
                ],
                "title": "B",
                "type": "story",
              },
            },
            "v": 5,
          }
        `);
      });
    });

    describe('errors', () => {
      it('when docs dependencies are missing', async () => {
        const generator = new StoryIndexGenerator(
          [normalizeStoriesEntry('./src/docs2/MetaOf.mdx', options)],
          options
        );
        await generator.initialize();
        await expect(() => generator.getIndex()).rejects.toThrowErrorMatchingInlineSnapshot(
          `[Error: Unable to index ./src/docs2/MetaOf.mdx]`
        );
      });
    });

    describe('warnings', () => {
      it('when entries do not match any files', async () => {
        const generator = new StoryIndexGenerator(
          [normalizeStoriesEntry('./src/docs2/wrong.js', options)],
          options
        );
        await generator.initialize();
        await generator.getIndex();

        expect(once.warn).toHaveBeenCalledTimes(1);
        const logMessage = vi.mocked(once.warn).mock.calls[0][0];
        expect(logMessage).toContain(`No story files found for the specified pattern`);
      });
    });

    describe('duplicates', () => {
      it('errors when two MDX entries reference the same CSF file without a name', async () => {
        const docsErrorSpecifier: NormalizedStoriesSpecifier = normalizeStoriesEntry(
          './errors/**/A.mdx',
          options
        );

        const generator = new StoryIndexGenerator(
          [storiesSpecifier, docsSpecifier, docsErrorSpecifier],
          options
        );
        await generator.initialize();

        await expect(generator.getIndex()).rejects.toThrowErrorMatchingInlineSnapshot(
          `[Error: Unable to index ./errors/A.mdx,./errors/duplicate/A.mdx]`
        );
      });

      it('errors when a MDX entry has the same name as a story', async () => {
        const docsErrorSpecifier: NormalizedStoriesSpecifier = normalizeStoriesEntry(
          './errors/MetaOfClashingName.mdx',
          options
        );

        const generator = new StoryIndexGenerator(
          [storiesSpecifier, docsSpecifier, docsErrorSpecifier],
          options
        );
        await generator.initialize();

        await expect(generator.getIndex()).rejects.toThrowErrorMatchingInlineSnapshot(
          `[Error: Unable to index ./src/A.stories.js,./errors/MetaOfClashingName.mdx]`
        );
      });

      it('errors when a story has the default docs name', async () => {
        const docsErrorSpecifier: NormalizedStoriesSpecifier = normalizeStoriesEntry(
          './errors/A.mdx',
          options
        );

        const generator = new StoryIndexGenerator(
          [storiesSpecifier, docsSpecifier, docsErrorSpecifier],
          {
            ...options,
            docs: { ...options.docs, defaultName: 'Story One' },
          }
        );
        await generator.initialize();

        await expect(generator.getIndex()).rejects.toThrowErrorMatchingInlineSnapshot(
          `[Error: Unable to index ./src/A.stories.js,./errors/A.mdx]`
        );
      });
      it('errors when two duplicate stories exists, with duplicated entries details', async () => {
        const generator = new StoryIndexGenerator([storiesSpecifier, docsSpecifier], {
          ...options,
        });
        await generator.initialize();
        const mockEntry: StoryIndexEntry = {
          id: 'StoryId',
          name: 'StoryName',
          title: 'ComponentTitle',
          importPath: 'Path',
          type: 'story',
        };
        expect(() => {
          generator.chooseDuplicate(mockEntry, { ...mockEntry, importPath: 'DifferentPath' });
        }).toThrowErrorMatchingInlineSnapshot(`[Error: Duplicate stories with id: StoryId]`);
      });

      it('DOES NOT error when the same MDX file matches two specifiers', async () => {
        const generator = new StoryIndexGenerator(
          [storiesSpecifier, docsSpecifier, docsSpecifier],
          options
        );
        await generator.initialize();

        expect(Object.keys((await generator.getIndex()).entries)).toMatchInlineSnapshot(`
          [
            "a--story-one",
            "componentreference--docs",
            "a--metaof",
            "notitle--docs",
            "a--second-docs",
            "docs2-yabbadabbadooo--docs",
          ]
        `);

        expect(logger.warn).not.toHaveBeenCalled();
      });

      it('DOES NOT throw when the same CSF file matches two specifiers', async () => {
        const generator = new StoryIndexGenerator([storiesSpecifier, storiesSpecifier], {
          ...options,
        });
        await generator.initialize();
        expect(Object.keys((await generator.getIndex()).entries)).toMatchInlineSnapshot(`
          [
            "a--story-one",
          ]
        `);

        expect(logger.warn).not.toHaveBeenCalled();
      });
    });
  });

  describe('sorting', () => {
    it('runs a user-defined sort function', async () => {
      const storiesSpecifier: NormalizedStoriesSpecifier = normalizeStoriesEntry(
        './src/**/*.stories.(ts|js|mjs|jsx)',
        options
      );
      const docsSpecifier: NormalizedStoriesSpecifier = normalizeStoriesEntry(
        './src/docs2/*.mdx',
        options
      );

      const generator = new StoryIndexGenerator([docsSpecifier, storiesSpecifier], options);
      await generator.initialize();

      getStorySortParameterMock.mockReturnValueOnce({
        order: ['docs2', 'D', 'B', 'nested', 'A', 'second-nested', 'first-nested/deeply'],
      });

      expect(Object.keys((await generator.getIndex()).entries)).toMatchInlineSnapshot(`
        [
          "docs2-yabbadabbadooo--docs",
          "d--story-one",
          "b--story-one",
          "nested-button--story-one",
          "a--metaof",
          "a--second-docs",
          "a--story-one",
          "second-nested-g--story-one",
          "componentreference--docs",
          "notitle--docs",
          "h--story-one",
          "first-nested-deeply-f--story-one",
        ]
      `);
    });
  });

  describe('caching', () => {
    describe('no invalidation', () => {
      it('does not extract csf files a second time', async () => {
        const specifier: NormalizedStoriesSpecifier = normalizeStoriesEntry(
          './src/**/*.stories.(ts|js|mjs|jsx)',
          options
        );

        readCsfMock.mockClear();
        const generator = new StoryIndexGenerator([specifier], options);
        await generator.initialize();
        await generator.getIndex();
        expect(readCsfMock).toHaveBeenCalledTimes(7);

        readCsfMock.mockClear();
        await generator.getIndex();
        expect(readCsfMock).not.toHaveBeenCalled();
      });

      it('does not extract docs files a second time', async () => {
        const storiesSpecifier: NormalizedStoriesSpecifier = normalizeStoriesEntry(
          './src/A.stories.(ts|js|mjs|jsx)',
          options
        );
        const docsSpecifier: NormalizedStoriesSpecifier = normalizeStoriesEntry(
          './src/docs2/*.mdx',
          options
        );

        const generator = new StoryIndexGenerator([storiesSpecifier, docsSpecifier], options);
        await generator.initialize();
        await generator.getIndex();
        expect(toId).toHaveBeenCalledTimes(5);

        toIdMock.mockClear();
        await generator.getIndex();
        expect(toId).not.toHaveBeenCalled();
      });

      it('does not call the sort function a second time', async () => {
        const specifier: NormalizedStoriesSpecifier = normalizeStoriesEntry(
          './src/**/*.stories.(ts|js|mjs|jsx)',
          options
        );

        const sortFn = vi.fn();
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
          './src/**/*.stories.(ts|js|mjs|jsx)',
          options
        );

        readCsfMock.mockClear();
        const generator = new StoryIndexGenerator([specifier], options);
        await generator.initialize();
        await generator.getIndex();
        expect(readCsfMock).toHaveBeenCalledTimes(7);

        generator.invalidate(specifier, './src/B.stories.ts', false);

        readCsfMock.mockClear();
        await generator.getIndex();
        expect(readCsfMock).toHaveBeenCalledTimes(1);
      });

      it('calls extract docs file for just the one file', async () => {
        const storiesSpecifier: NormalizedStoriesSpecifier = normalizeStoriesEntry(
          './src/A.stories.(ts|js|mjs|jsx)',
          options
        );
        const docsSpecifier: NormalizedStoriesSpecifier = normalizeStoriesEntry(
          './src/docs2/*.mdx',
          options
        );

        const generator = new StoryIndexGenerator([storiesSpecifier, docsSpecifier], options);
        await generator.initialize();
        await generator.getIndex();
        expect(toId).toHaveBeenCalledTimes(5);

        generator.invalidate(docsSpecifier, './src/docs2/Title.mdx', false);

        toIdMock.mockClear();
        await generator.getIndex();
        expect(toId).toHaveBeenCalledTimes(1);
      });

      it('calls extract for a csf file and any of its docs dependents', async () => {
        const storiesSpecifier: NormalizedStoriesSpecifier = normalizeStoriesEntry(
          './src/A.stories.(ts|js|mjs|jsx)',
          options
        );
        const docsSpecifier: NormalizedStoriesSpecifier = normalizeStoriesEntry(
          './src/docs2/*.mdx',
          options
        );

        const generator = new StoryIndexGenerator([storiesSpecifier, docsSpecifier], options);
        await generator.initialize();
        await generator.getIndex();
        expect(toId).toHaveBeenCalledTimes(5);

        generator.invalidate(storiesSpecifier, './src/A.stories.js', false);

        toIdMock.mockClear();
        await generator.getIndex();
        expect(toId).toHaveBeenCalledTimes(2);
      });

      it('does call the sort function a second time', async () => {
        const specifier: NormalizedStoriesSpecifier = normalizeStoriesEntry(
          './src/**/*.stories.(ts|js|mjs|jsx)',
          options
        );

        const sortFn = vi.fn();
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
    });

    describe('file removed', () => {
      it('does not extract csf files a second time', async () => {
        const specifier: NormalizedStoriesSpecifier = normalizeStoriesEntry(
          './src/**/*.stories.(ts|js|mjs|jsx)',
          options
        );

        readCsfMock.mockClear();
        const generator = new StoryIndexGenerator([specifier], options);
        await generator.initialize();
        await generator.getIndex();
        expect(readCsfMock).toHaveBeenCalledTimes(7);

        generator.invalidate(specifier, './src/B.stories.ts', true);

        readCsfMock.mockClear();
        await generator.getIndex();
        expect(readCsfMock).not.toHaveBeenCalled();
      });

      it('does call the sort function a second time', async () => {
        const specifier: NormalizedStoriesSpecifier = normalizeStoriesEntry(
          './src/**/*.stories.(ts|js|mjs|jsx)',
          options
        );

        const sortFn = vi.fn();
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
          './src/**/*.stories.(ts|js|mjs|jsx)',
          options
        );

        readCsfMock.mockClear();
        const generator = new StoryIndexGenerator([specifier], options);
        await generator.initialize();
        await generator.getIndex();
        expect(readCsfMock).toHaveBeenCalledTimes(7);

        generator.invalidate(specifier, './src/B.stories.ts', true);

        expect(Object.keys((await generator.getIndex()).entries)).not.toContain('b--story-one');
      });

      it('does not include the deleted docs in results', async () => {
        const storiesSpecifier: NormalizedStoriesSpecifier = normalizeStoriesEntry(
          './src/A.stories.(ts|js|mjs|jsx)',
          options
        );
        const docsSpecifier: NormalizedStoriesSpecifier = normalizeStoriesEntry(
          './src/docs2/*.mdx',
          options
        );

        const generator = new StoryIndexGenerator([docsSpecifier, storiesSpecifier], options);
        await generator.initialize();
        await generator.getIndex();
        expect(toId).toHaveBeenCalledTimes(5);

        expect(Object.keys((await generator.getIndex()).entries)).toContain('notitle--docs');

        generator.invalidate(docsSpecifier, './src/docs2/NoTitle.mdx', true);

        expect(Object.keys((await generator.getIndex()).entries)).not.toContain('notitle--docs');
      });

      it('cleans up properly on dependent docs deletion', async () => {
        const storiesSpecifier: NormalizedStoriesSpecifier = normalizeStoriesEntry(
          './src/A.stories.(ts|js|mjs|jsx)',
          options
        );
        const docsSpecifier: NormalizedStoriesSpecifier = normalizeStoriesEntry(
          './src/docs2/*.mdx',
          options
        );

        const generator = new StoryIndexGenerator([docsSpecifier, storiesSpecifier], options);
        await generator.initialize();
        await generator.getIndex();
        expect(toId).toHaveBeenCalledTimes(5);

        expect(Object.keys((await generator.getIndex()).entries)).toContain('a--metaof');

        generator.invalidate(docsSpecifier, './src/docs2/MetaOf.mdx', true);

        expect(Object.keys((await generator.getIndex()).entries)).not.toContain('a--metaof');

        // this will throw if MetaOf is not removed from A's dependents
        generator.invalidate(storiesSpecifier, './src/A.stories.js', false);
      });
    });
  });
});
