// @vitest-environment jsdom
import { describe, beforeAll, beforeEach, it, expect, vi } from 'vitest';
import { addons } from '@storybook/core/dist/preview-api';
import { SELECT_STORY } from '@storybook/core/dist/core-events';

import { linkTo, hrefTo } from './utils';

vi.mock('@storybook/core/dist/preview-api');
vi.mock('@storybook/global', () => ({
  global: {
    document: global.document,
    window: global,
  },
}));

const mockAddons = vi.mocked(addons);

describe('preview', () => {
  const channel = { emit: vi.fn() };
  beforeAll(() => {
    mockAddons.getChannel.mockReturnValue(channel as any);
  });
  beforeEach(channel.emit.mockReset);
  describe('linkTo()', () => {
    it('should select the title and name provided', () => {
      const handler = linkTo('title', 'name');
      handler();

      expect(channel.emit).toHaveBeenCalledWith(SELECT_STORY, {
        kind: 'title',
        story: 'name',
      });
    });

    it('should select the title (only) provided', () => {
      const handler = linkTo('title');
      handler();

      expect(channel.emit).toHaveBeenCalledWith(SELECT_STORY, {
        kind: 'title',
      });
    });

    it('should select the story (only) provided', () => {
      // simulate a currently selected, but not found as ID
      // @ts-expect-error (not strict)
      const handler = linkTo(undefined, 'name');
      handler();

      expect(channel.emit).toHaveBeenCalledWith(SELECT_STORY, {
        story: 'name',
      });
    });

    it('should select the id provided', () => {
      const handler = linkTo('title--name');
      handler();

      expect(channel.emit).toHaveBeenCalledWith(SELECT_STORY, {
        storyId: 'title--name',
      });
    });

    it('should handle functions returning strings', () => {
      const handler = linkTo(
        (a, b) => a + b,
        (a, b) => b + a
      );
      handler('title', 'name');

      expect(channel.emit.mock.calls).toContainEqual([
        SELECT_STORY,
        {
          kind: 'titlename',
          story: 'nametitle',
        },
      ]);
    });
  });

  describe('hrefTo()', () => {
    it('should return promise resolved with story href', async () => {
      const href = await hrefTo('title', 'name');
      expect(href).toContain('?path=/story/title--name');
    });
  });
});
