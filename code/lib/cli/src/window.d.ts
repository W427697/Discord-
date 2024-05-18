import type { Renderer } from '@storybook/core/dist/types';
import type { StoryStore } from '@storybook/core/dist/preview-api';

declare global {
  interface Window {
    __STORYBOOK_STORY_STORE__: StoryStore<Renderer>;
  }
}
