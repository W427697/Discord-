import type { Renderer } from '@junk-temporary-prototypes/types';
import type { StoryStore } from '@junk-temporary-prototypes/preview-api';

declare global {
  interface Window {
    __STORYBOOK_STORY_STORE__: StoryStore<Renderer>;
  }
}
