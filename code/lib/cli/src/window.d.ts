import type { Renderer } from '@storybook/core/dist/modules/types/index';
import type { StoryStore } from '@storybook/core/dist/modules/preview-api/index';

declare global {
  interface Window {
    __STORYBOOK_STORY_STORE__: StoryStore<Renderer>;
  }
}
