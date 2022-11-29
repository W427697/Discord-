/* eslint-disable @typescript-eslint/naming-convention */
import type { Renderer } from '@storybook/types';
import type { StoryStore } from '@storybook/preview-api';

declare global {
  interface Window {
    __STORYBOOK_STORY_STORE__: StoryStore<Renderer>;
  }
  var __STORYBOOK_STORY_STORE__: StoryStore<AnyFramework>;
}
