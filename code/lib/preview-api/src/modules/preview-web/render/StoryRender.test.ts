// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest';
import { Channel } from '@storybook/channels';
import type { Renderer, StoryIndexEntry } from '@storybook/types';
import type { StoryStore } from '../../store';
import { PREPARE_ABORTED } from './Render';

import { StoryRender } from './StoryRender';

const entry = {
  type: 'story',
  id: 'component--a',
  name: 'A',
  title: 'component',
  importPath: './component.stories.ts',
} as StoryIndexEntry;

const createGate = (): [Promise<void>, () => void] => {
  let openGate = () => {};
  const gate = new Promise<void>((resolve) => {
    openGate = resolve;
  });
  return [gate, openGate];
};

window.location = { reload: vi.fn() } as any;

describe('StoryRender', () => {
  it('does run play function if passed autoplay=true', async () => {
    const story = {
      id: 'id',
      title: 'title',
      name: 'name',
      tags: [],
      applyLoaders: vi.fn(),
      unboundStoryFn: vi.fn(),
      playFunction: vi.fn(),
      prepareContext: vi.fn(),
    };

    const render = new StoryRender(
      new Channel({}),
      { getStoryContext: () => ({}) } as any,
      vi.fn() as any,
      {} as any,
      entry.id,
      'story',
      { autoplay: true },
      story as any
    );

    await render.renderToElement({} as any);
    expect(story.playFunction).toHaveBeenCalled();
  });

  it('does not run play function if passed autoplay=false', async () => {
    const story = {
      id: 'id',
      title: 'title',
      name: 'name',
      tags: [],
      applyLoaders: vi.fn(),
      unboundStoryFn: vi.fn(),
      playFunction: vi.fn(),
      prepareContext: vi.fn(),
    };

    const render = new StoryRender(
      new Channel({}),
      { getStoryContext: () => ({}) } as any,
      vi.fn() as any,
      {} as any,
      entry.id,
      'story',
      { autoplay: false },
      story as any
    );

    await render.renderToElement({} as any);
    expect(story.playFunction).not.toHaveBeenCalled();
  });

  describe('teardown', () => {
    const teardownAndWaitForReload = (render: StoryRender<any>) => {
      // 1. immediately teardown the story
      render.teardown();

      return new Promise<void>((resolve) => {
        setInterval(() => {
          try {
            // 2. assert that the window is reloaded and move on
            expect(window.location.reload).toHaveBeenCalledOnce();
            resolve();
          } catch {
            // empty catch to ignore the assertion failing
          }
        }, 0);
      });
    };

    it('throws PREPARE_ABORTED if torndown during prepare', async () => {
      const [importGate, openImportGate] = createGate();
      const mockStore = {
        loadStory: vi.fn(async () => {
          await importGate;
          return {};
        }),
        cleanupStory: vi.fn(),
      };

      const render = new StoryRender(
        new Channel({}),
        mockStore as unknown as StoryStore<Renderer>,
        vi.fn(),
        {} as any,
        entry.id,
        'story'
      );

      const preparePromise = render.prepare();

      render.teardown();

      openImportGate();

      await expect(preparePromise).rejects.toThrowError(PREPARE_ABORTED);
    });

    it('reloads the page when tearing down during loading', async () => {
      const story = {
        id: 'id',
        title: 'title',
        name: 'name',
        tags: [],
        applyLoaders: vi.fn(),
        unboundStoryFn: vi.fn(),
        playFunction: vi.fn(),
        prepareContext: vi.fn(),
      };
      const store = { getStoryContext: () => ({}), cleanupStory: vi.fn() };

      const render = new StoryRender(
        new Channel({}),
        store as any,
        vi.fn() as any,
        {} as any,
        entry.id,
        'story',
        { autoplay: true },
        story as any
      );

      story.applyLoaders.mockImplementation(() => teardownAndWaitForReload(render));

      await render.renderToElement({} as any);

      expect(story.applyLoaders).toHaveBeenCalledOnce();
      expect(store.cleanupStory).toHaveBeenCalledOnce();
      expect(window.location.reload).toHaveBeenCalledOnce();
    });

    it('reloads the page when tearing down during rendering', async () => {
      const story = {
        id: 'id',
        title: 'title',
        name: 'name',
        tags: [],
        applyLoaders: vi.fn(),
        unboundStoryFn: vi.fn(),
        playFunction: vi.fn(),
        prepareContext: vi.fn(),
      };
      const store = { getStoryContext: () => ({}), cleanupStory: vi.fn() };
      const renderToScreen = vi.fn();

      const render = new StoryRender(
        new Channel({}),
        store as any,
        renderToScreen as any,
        {} as any,
        entry.id,
        'story',
        { autoplay: true },
        story as any
      );

      renderToScreen.mockImplementation(() => teardownAndWaitForReload(render));

      await render.renderToElement({} as any);

      expect(renderToScreen).toHaveBeenCalledOnce();
      expect(store.cleanupStory).toHaveBeenCalledOnce();
      expect(window.location.reload).toHaveBeenCalledOnce();
    });

    it('reloads the page when tearing down during playing', async () => {
      const story = {
        id: 'id',
        title: 'title',
        name: 'name',
        tags: [],
        applyLoaders: vi.fn(),
        unboundStoryFn: vi.fn(),
        playFunction: vi.fn(),
        prepareContext: vi.fn(),
      };
      const store = { getStoryContext: () => ({}), cleanupStory: vi.fn() };

      const render = new StoryRender(
        new Channel({}),
        store as any,
        vi.fn() as any,
        {} as any,
        entry.id,
        'story',
        { autoplay: true },
        story as any
      );

      story.playFunction.mockImplementation(() => teardownAndWaitForReload(render));

      await render.renderToElement({} as any);

      expect(story.playFunction).toHaveBeenCalledOnce();
      expect(store.cleanupStory).toHaveBeenCalledOnce();
      expect(window.location.reload).toHaveBeenCalledOnce();
    });
  });
});
