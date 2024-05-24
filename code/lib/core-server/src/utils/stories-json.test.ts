import { describe, beforeEach, it, expect, vi } from 'vitest';

import type { Router, Request, Response } from 'express';
import Watchpack from 'watchpack';
import path from 'path';
import debounce from 'lodash/debounce.js';
import { STORY_INDEX_INVALIDATED } from '@storybook/core-events';
import { normalizeStoriesEntry } from '@storybook/core-common';

import { useStoriesJson, DEBOUNCE } from './stories-json';
import type { ServerChannel } from './get-server-channel';
import type { StoryIndexGeneratorOptions } from './StoryIndexGenerator';
import { StoryIndexGenerator } from './StoryIndexGenerator';
import { csfIndexer } from '../presets/common-preset';

vi.mock('watchpack');
vi.mock('lodash/debounce');
vi.mock('@storybook/node-logger');

const workingDir = path.join(__dirname, '__mockdata__');
const normalizedStories = [
  normalizeStoriesEntry(
    {
      titlePrefix: '',
      directory: './src',
      files: '**/*.stories.@(ts|js|mjs|jsx)',
    },
    { workingDir, configDir: workingDir }
  ),
  normalizeStoriesEntry(
    {
      titlePrefix: '',
      directory: './src',
      files: '**/*.mdx',
    },
    { workingDir, configDir: workingDir }
  ),
];

const getInitializedStoryIndexGenerator = async (
  overrides: any = {},
  inputNormalizedStories = normalizedStories
) => {
  const options: StoryIndexGeneratorOptions = {
    indexers: [csfIndexer],
    configDir: workingDir,
    workingDir,
    docs: { defaultName: 'docs', autodocs: false },
    ...overrides,
  };
  const generator = new StoryIndexGenerator(inputNormalizedStories, options);
  await generator.initialize();
  return generator;
};

describe('useStoriesJson', () => {
  const use = vi.fn();
  const router: Router = { use } as any;
  const send = vi.fn();
  const write = vi.fn();
  const response: Response = {
    header: vi.fn(),
    send,
    status: vi.fn(),
    setHeader: vi.fn(),
    flushHeaders: vi.fn(),
    write,
    flush: vi.fn(),
    end: vi.fn(),
    on: vi.fn(),
  } as any;

  beforeEach(async () => {
    use.mockClear();
    send.mockClear();
    write.mockClear();
    vi.mocked(debounce).mockImplementation((cb) => cb as any);
    Watchpack.mockClear();
  });

  const request: Request = {
    headers: { accept: 'application/json' },
  } as any;

  describe('JSON endpoint', () => {
    it('scans and extracts index', async () => {
      const mockServerChannel = { emit: vi.fn() } as any as ServerChannel;
      console.time('useStoriesJson');
      useStoriesJson({
        router,
        serverChannel: mockServerChannel,
        workingDir,
        normalizedStories,
        initializedStoryIndexGenerator: getInitializedStoryIndexGenerator(),
      });
      console.timeEnd('useStoriesJson');

      expect(use).toHaveBeenCalledTimes(1);
      const route = use.mock.calls[0][1];

      console.time('route');
      await route(request, response);
      console.timeEnd('route');

      expect(send).toHaveBeenCalledTimes(1);
      expect(JSON.parse(send.mock.calls[0][0])).toMatchInlineSnapshot(`
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
            "docs2-componentreference--docs": {
              "id": "docs2-componentreference--docs",
              "importPath": "./src/docs2/ComponentReference.mdx",
              "name": "docs",
              "storiesImports": [],
              "tags": [
                "dev",
                "test",
                "unattached-mdx",
              ],
              "title": "docs2/ComponentReference",
              "type": "docs",
            },
            "docs2-notitle--docs": {
              "id": "docs2-notitle--docs",
              "importPath": "./src/docs2/NoTitle.mdx",
              "name": "docs",
              "storiesImports": [],
              "tags": [
                "dev",
                "test",
                "unattached-mdx",
              ],
              "title": "docs2/NoTitle",
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
    }, 20_000);

    it('can handle simultaneous access', async () => {
      const mockServerChannel = { emit: vi.fn() } as any as ServerChannel;

      useStoriesJson({
        router,
        serverChannel: mockServerChannel,
        workingDir,
        normalizedStories,
        initializedStoryIndexGenerator: getInitializedStoryIndexGenerator(),
      });

      expect(use).toHaveBeenCalledTimes(1);
      const route = use.mock.calls[0][1];

      const firstPromise = route(request, response);
      const secondResponse = { ...response, send: vi.fn(), status: vi.fn() };
      const secondPromise = route(request, secondResponse);

      await Promise.all([firstPromise, secondPromise]);

      expect(send).toHaveBeenCalledTimes(1);
      expect(response.status).not.toEqual(500);
      expect(secondResponse.send).toHaveBeenCalledTimes(1);
      expect(secondResponse.status).not.toEqual(500);
    });
  });

  describe('SSE endpoint', () => {
    beforeEach(() => {
      use.mockClear();
      send.mockClear();
    });

    it('sends invalidate events', async () => {
      const mockServerChannel = { emit: vi.fn() } as any as ServerChannel;
      useStoriesJson({
        router,
        serverChannel: mockServerChannel,
        workingDir,
        normalizedStories,
        initializedStoryIndexGenerator: getInitializedStoryIndexGenerator(),
      });

      expect(use).toHaveBeenCalledTimes(1);
      const route = use.mock.calls[0][1];

      await route(request, response);

      expect(write).not.toHaveBeenCalled();

      expect(Watchpack).toHaveBeenCalledTimes(1);
      const watcher = Watchpack.mock.instances[0];
      expect(watcher.watch).toHaveBeenCalledWith({ directories: ['./src'] });

      expect(watcher.on).toHaveBeenCalledTimes(2);
      const onChange = watcher.on.mock.calls[0][1];

      await onChange('src/nested/Button.stories.ts');
      expect(mockServerChannel.emit).toHaveBeenCalledTimes(1);
      expect(mockServerChannel.emit).toHaveBeenCalledWith(STORY_INDEX_INVALIDATED);
    });

    it('only sends one invalidation when multiple event listeners are listening', async () => {
      const mockServerChannel = { emit: vi.fn() } as any as ServerChannel;
      useStoriesJson({
        router,
        serverChannel: mockServerChannel,
        workingDir,
        normalizedStories,
        initializedStoryIndexGenerator: getInitializedStoryIndexGenerator(),
      });

      expect(use).toHaveBeenCalledTimes(1);
      const route = use.mock.calls[0][1];

      // Don't wait for the first request here before starting the second
      await Promise.all([
        route(request, response),
        route(request, { ...response, write: vi.fn() }),
      ]);

      expect(write).not.toHaveBeenCalled();

      expect(Watchpack).toHaveBeenCalledTimes(1);
      const watcher = Watchpack.mock.instances[0];
      expect(watcher.watch).toHaveBeenCalledWith({ directories: ['./src'] });

      expect(watcher.on).toHaveBeenCalledTimes(2);
      const onChange = watcher.on.mock.calls[0][1];

      await onChange('src/nested/Button.stories.ts');
      expect(mockServerChannel.emit).toHaveBeenCalledTimes(1);
      expect(mockServerChannel.emit).toHaveBeenCalledWith(STORY_INDEX_INVALIDATED);
    });

    it('debounces invalidation events', async () => {
      vi.mocked(debounce).mockImplementation(
        // @ts-expect-error it doesn't think default exists
        (await vi.importActual<typeof import('lodash/debounce.js')>('lodash/debounce.js')).default
      );

      const mockServerChannel = { emit: vi.fn() } as any as ServerChannel;
      useStoriesJson({
        router,
        serverChannel: mockServerChannel,
        workingDir,
        normalizedStories,
        initializedStoryIndexGenerator: getInitializedStoryIndexGenerator(),
      });

      expect(use).toHaveBeenCalledTimes(1);
      const route = use.mock.calls[0][1];

      await route(request, response);

      expect(write).not.toHaveBeenCalled();

      expect(Watchpack).toHaveBeenCalledTimes(1);
      const watcher = Watchpack.mock.instances[0];
      expect(watcher.watch).toHaveBeenCalledWith({ directories: ['./src'] });

      expect(watcher.on).toHaveBeenCalledTimes(2);
      const onChange = watcher.on.mock.calls[0][1];

      await onChange('src/nested/Button.stories.ts');
      await onChange('src/nested/Button.stories.ts');
      await onChange('src/nested/Button.stories.ts');
      await onChange('src/nested/Button.stories.ts');
      await onChange('src/nested/Button.stories.ts');

      expect(mockServerChannel.emit).toHaveBeenCalledTimes(1);
      expect(mockServerChannel.emit).toHaveBeenCalledWith(STORY_INDEX_INVALIDATED);

      await new Promise((r) => setTimeout(r, 2 * DEBOUNCE));

      expect(mockServerChannel.emit).toHaveBeenCalledTimes(2);
    });
  });
});
