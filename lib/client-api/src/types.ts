import { StoryFn, StoryContext, DecoratorFunction } from '@storybook/addons';
import StoryStore from './story_store';

export interface ErrorLike {
  message: string;
  stack: string;
}

export interface StoreItem extends StoryContext {
  getDecorated: () => StoryFn;
  getOriginal: () => StoryFn;
  story: string;
  storyFn: StoryFn;
}

export interface StoreData {
  [key: string]: StoreItem;
}

export interface LegacyItem {
  fileName: string;
  index: number;
  kind: string;
  stories: { [key: string]: any };
  revision?: number;
  selection?: { storyId: string };
}
export interface LegacyData {
  [K: string]: LegacyItem;
}

export interface ClientApiParams {
  storyStore: StoryStore;
  decorateStory?: (storyFn: StoryFn, decorators: DecoratorFunction[]) => StoryFn;
}
