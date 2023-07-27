/// <reference types="@types/jest" />;

/**
 * @jest-environment node
 */

import path from 'path';
import { normalizeStoriesEntry } from '@storybook/core-common';
import type { NormalizedStoriesSpecifier } from '@storybook/types';
import { logger, once } from '@storybook/node-logger';

import type { StoryIndexGeneratorOptions } from '../StoryIndexGenerator';
import { AUTODOCS_TAG, STORIES_MDX_TAG, StoryIndexGenerator } from '../StoryIndexGenerator';

jest.mock('@storybook/node-logger');

const options: StoryIndexGeneratorOptions = {
  configDir: path.join(__dirname, '..', '__mockdata__'),
  workingDir: path.join(__dirname, '..', '__mockdata__'),
  storyIndexers: [],
  indexers: [],
  storiesV2Compatibility: false,
  storyStoreV7: true,
  docs: { defaultName: 'docs', autodocs: false },
};

describe('story extraction', () => {
  it('extracts stories from full indexer inputs', async () => {
    const relativePath = './src/A.stories.js';
    const absolutePath = path.join(options.workingDir, relativePath);
    const specifier: NormalizedStoriesSpecifier = normalizeStoriesEntry(relativePath, options);

    const generator = new StoryIndexGenerator([specifier], {
      ...options,
      indexers: [
        {
          test: /\.stories\.(m?js|ts)x?$/,
          index: async (fileName) => [
            {
              key: 'StoryOne',
              id: 'a--story-one',
              name: 'Story One',
              title: 'A',
              tags: ['story-tag-from-indexer'],
              importPath: fileName,
              type: 'story',
            },
          ],
        },
      ],
    });
    const result = await generator.extractStories(specifier, absolutePath);

    expect(result).toMatchInlineSnapshot(`
      Object {
        "dependents": Array [],
        "entries": Array [
          Object {
            "id": "a--story-one",
            "importPath": "./src/A.stories.js",
            "name": "Story One",
            "tags": Array [
              "story-tag-from-indexer",
              "story",
            ],
            "title": "A",
            "type": "story",
          },
        ],
        "type": "stories",
      }
    `);
  });

  it('extracts stories from minimal indexer inputs', async () => {
    const relativePath = './src/first-nested/deeply/F.stories.js';
    const absolutePath = path.join(options.workingDir, relativePath);
    const specifier: NormalizedStoriesSpecifier = normalizeStoriesEntry(relativePath, options);

    const generator = new StoryIndexGenerator([specifier], {
      ...options,
      indexers: [
        {
          test: /\.stories\.(m?js|ts)x?$/,
          index: async (fileName) => [
            {
              key: 'StoryOne',
              importPath: fileName,
              type: 'story',
            },
          ],
        },
      ],
    });
    const result = await generator.extractStories(specifier, absolutePath);

    expect(result).toMatchInlineSnapshot(`
      Object {
        "dependents": Array [],
        "entries": Array [
          Object {
            "id": "f--story-one",
            "importPath": "./src/first-nested/deeply/F.stories.js",
            "name": "Story One",
            "tags": Array [
              "story",
            ],
            "title": "F",
            "type": "story",
          },
        ],
        "type": "stories",
      }
    `);
  });

  it('auto-generates title from indexer inputs without title', async () => {
    const relativePath = './src/first-nested/deeply/F.stories.js';
    const absolutePath = path.join(options.workingDir, relativePath);
    const specifier: NormalizedStoriesSpecifier = normalizeStoriesEntry(relativePath, options);

    const generator = new StoryIndexGenerator([specifier], {
      ...options,
      indexers: [
        {
          test: /\.stories\.(m?js|ts)x?$/,
          index: async (fileName) => [
            {
              key: 'StoryOne',
              id: 'a--story-one',
              name: 'Story One',
              tags: ['story-tag-from-indexer'],
              importPath: fileName,
              type: 'story',
            },
          ],
        },
      ],
    });
    const result = await generator.extractStories(specifier, absolutePath);

    expect(result).toMatchInlineSnapshot(`
      Object {
        "dependents": Array [],
        "entries": Array [
          Object {
            "id": "a--story-one",
            "importPath": "./src/first-nested/deeply/F.stories.js",
            "name": "Story One",
            "tags": Array [
              "story-tag-from-indexer",
              "story",
            ],
            "title": "F",
            "type": "story",
          },
        ],
        "type": "stories",
      }
    `);
  });

  it('auto-generates name from indexer inputs without name', async () => {
    const relativePath = './src/A.stories.js';
    const absolutePath = path.join(options.workingDir, relativePath);
    const specifier: NormalizedStoriesSpecifier = normalizeStoriesEntry(relativePath, options);

    const generator = new StoryIndexGenerator([specifier], {
      ...options,
      indexers: [
        {
          test: /\.stories\.(m?js|ts)x?$/,
          index: async (fileName) => [
            {
              key: 'StoryOne',
              id: 'a--story-one',
              title: 'A',
              tags: ['story-tag-from-indexer'],
              importPath: fileName,
              type: 'story',
            },
          ],
        },
      ],
    });
    const result = await generator.extractStories(specifier, absolutePath);

    expect(result).toMatchInlineSnapshot(`
      Object {
        "dependents": Array [],
        "entries": Array [
          Object {
            "id": "a--story-one",
            "importPath": "./src/A.stories.js",
            "name": "Story One",
            "tags": Array [
              "story-tag-from-indexer",
              "story",
            ],
            "title": "A",
            "type": "story",
          },
        ],
        "type": "stories",
      }
    `);
  });

  it('auto-generates id from name and title inputs', async () => {
    const relativePath = './src/A.stories.js';
    const absolutePath = path.join(options.workingDir, relativePath);
    const specifier: NormalizedStoriesSpecifier = normalizeStoriesEntry(relativePath, options);

    const generator = new StoryIndexGenerator([specifier], {
      ...options,
      indexers: [
        {
          test: /\.stories\.(m?js|ts)x?$/,
          index: async (fileName) => [
            {
              key: 'StoryOne',
              name: 'Story One',
              title: 'A',
              tags: ['story-tag-from-indexer'],
              importPath: fileName,
              type: 'story',
            },
          ],
        },
      ],
    });
    const result = await generator.extractStories(specifier, absolutePath);

    expect(result).toMatchInlineSnapshot(`
      Object {
        "dependents": Array [],
        "entries": Array [
          Object {
            "id": "a--story-one",
            "importPath": "./src/A.stories.js",
            "name": "Story One",
            "tags": Array [
              "story-tag-from-indexer",
              "story",
            ],
            "title": "A",
            "type": "story",
          },
        ],
        "type": "stories",
      }
    `);
  });

  it('auto-generates id, title and name from key input', async () => {
    const relativePath = './src/A.stories.js';
    const absolutePath = path.join(options.workingDir, relativePath);
    const specifier: NormalizedStoriesSpecifier = normalizeStoriesEntry(relativePath, options);

    const generator = new StoryIndexGenerator([specifier], {
      ...options,
      indexers: [
        {
          test: /\.stories\.(m?js|ts)x?$/,
          index: async (fileName) => [
            {
              key: 'StoryOne',
              tags: ['story-tag-from-indexer'],
              importPath: fileName,
              type: 'story',
            },
          ],
        },
      ],
    });
    const result = await generator.extractStories(specifier, absolutePath);

    expect(result).toMatchInlineSnapshot(`
      Object {
        "dependents": Array [],
        "entries": Array [
          Object {
            "id": "a--story-one",
            "importPath": "./src/A.stories.js",
            "name": "Story One",
            "tags": Array [
              "story-tag-from-indexer",
              "story",
            ],
            "title": "A",
            "type": "story",
          },
        ],
        "type": "stories",
      }
    `);
  });
});
describe('docs entries from story extraction', () => {
  it('adds docs entry when autodocs is globally enabled', async () => {
    const relativePath = './src/A.stories.js';
    const absolutePath = path.join(options.workingDir, relativePath);
    const specifier: NormalizedStoriesSpecifier = normalizeStoriesEntry(relativePath, options);

    const generator = new StoryIndexGenerator([specifier], {
      ...options,
      docs: { defaultName: 'docs', autodocs: true },
      indexers: [
        {
          test: /\.stories\.(m?js|ts)x?$/,
          index: async (fileName) => [
            {
              key: 'StoryOne',
              id: 'a--story-one',
              name: 'Story One',
              title: 'A',
              tags: ['story-tag-from-indexer'],
              importPath: fileName,
              type: 'story',
            },
          ],
        },
      ],
    });
    const result = await generator.extractStories(specifier, absolutePath);

    expect(result).toMatchInlineSnapshot(`
      Object {
        "dependents": Array [],
        "entries": Array [
          Object {
            "id": "a--docs",
            "importPath": "./src/A.stories.js",
            "name": "docs",
            "storiesImports": Array [],
            "tags": Array [
              "story-tag-from-indexer",
              "docs",
              "autodocs",
            ],
            "title": "A",
            "type": "docs",
          },
          Object {
            "id": "a--story-one",
            "importPath": "./src/A.stories.js",
            "name": "Story One",
            "tags": Array [
              "story-tag-from-indexer",
              "story",
            ],
            "title": "A",
            "type": "story",
          },
        ],
        "type": "stories",
      }
    `);
  });
  it(`adds docs entry when autodocs is "tag" and an entry has the "${AUTODOCS_TAG}" tag`, async () => {
    const relativePath = './src/A.stories.js';
    const absolutePath = path.join(options.workingDir, relativePath);
    const specifier: NormalizedStoriesSpecifier = normalizeStoriesEntry(relativePath, options);

    const generator = new StoryIndexGenerator([specifier], {
      ...options,
      docs: { defaultName: 'docs', autodocs: 'tag' },
      indexers: [
        {
          test: /\.stories\.(m?js|ts)x?$/,
          index: async (fileName) => [
            {
              key: 'StoryOne',
              id: 'a--story-one',
              name: 'Story One',
              title: 'A',
              tags: [AUTODOCS_TAG, 'story-tag-from-indexer'],
              importPath: fileName,
              type: 'story',
            },
          ],
        },
      ],
    });
    const result = await generator.extractStories(specifier, absolutePath);

    expect(result).toMatchInlineSnapshot(`
      Object {
        "dependents": Array [],
        "entries": Array [
          Object {
            "id": "a--docs",
            "importPath": "./src/A.stories.js",
            "name": "docs",
            "storiesImports": Array [],
            "tags": Array [
              "autodocs",
              "story-tag-from-indexer",
              "docs",
            ],
            "title": "A",
            "type": "docs",
          },
          Object {
            "id": "a--story-one",
            "importPath": "./src/A.stories.js",
            "name": "Story One",
            "tags": Array [
              "autodocs",
              "story-tag-from-indexer",
              "story",
            ],
            "title": "A",
            "type": "story",
          },
        ],
        "type": "stories",
      }
    `);
  });
  it(`DOES NOT adds docs entry when autodocs is false and an entry has the "${AUTODOCS_TAG}" tag`, async () => {
    const relativePath = './src/A.stories.js';
    const absolutePath = path.join(options.workingDir, relativePath);
    const specifier: NormalizedStoriesSpecifier = normalizeStoriesEntry(relativePath, options);

    const generator = new StoryIndexGenerator([specifier], {
      ...options,
      docs: { defaultName: 'docs', autodocs: false },
      indexers: [
        {
          test: /\.stories\.(m?js|ts)x?$/,
          index: async (fileName) => [
            {
              key: 'StoryOne',
              id: 'a--story-one',
              name: 'Story One',
              title: 'A',
              tags: [AUTODOCS_TAG, 'story-tag-from-indexer'],
              importPath: fileName,
              type: 'story',
            },
          ],
        },
      ],
    });
    const result = await generator.extractStories(specifier, absolutePath);

    expect(result).toMatchInlineSnapshot(`
      Object {
        "dependents": Array [],
        "entries": Array [
          Object {
            "id": "a--story-one",
            "importPath": "./src/A.stories.js",
            "name": "Story One",
            "tags": Array [
              "autodocs",
              "story-tag-from-indexer",
              "story",
            ],
            "title": "A",
            "type": "story",
          },
        ],
        "type": "stories",
      }
    `);
  });
  it(`adds docs entry when an entry has the "${STORIES_MDX_TAG}" tag`, async () => {
    const relativePath = './src/A.stories.js';
    const absolutePath = path.join(options.workingDir, relativePath);
    const specifier: NormalizedStoriesSpecifier = normalizeStoriesEntry(relativePath, options);

    const generator = new StoryIndexGenerator([specifier], {
      ...options,
      docs: { defaultName: 'docs', autodocs: false },
      indexers: [
        {
          test: /\.stories\.(m?js|ts)x?$/,
          index: async (fileName) => [
            {
              key: 'StoryOne',
              id: 'a--story-one',
              name: 'Story One',
              title: 'A',
              tags: [STORIES_MDX_TAG, 'story-tag-from-indexer'],
              importPath: fileName,
              type: 'story',
            },
          ],
        },
      ],
    });
    const result = await generator.extractStories(specifier, absolutePath);

    expect(result).toMatchInlineSnapshot(`
      Object {
        "dependents": Array [],
        "entries": Array [
          Object {
            "id": "a--docs",
            "importPath": "./src/A.stories.js",
            "name": "docs",
            "storiesImports": Array [],
            "tags": Array [
              "stories-mdx",
              "story-tag-from-indexer",
              "docs",
            ],
            "title": "A",
            "type": "docs",
          },
          Object {
            "id": "a--story-one",
            "importPath": "./src/A.stories.js",
            "name": "Story One",
            "tags": Array [
              "stories-mdx",
              "story-tag-from-indexer",
              "story",
            ],
            "title": "A",
            "type": "story",
          },
        ],
        "type": "stories",
      }
    `);
  });
});
