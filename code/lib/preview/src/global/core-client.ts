/* eslint-disable no-underscore-dangle */
import type * as CORE_CLIENT from '../core-client';

const { ClientApi, StoryStore, start } = (globalThis as any)
  .__STORYBOOK_ADDONS__ as typeof CORE_CLIENT;

export { ClientApi, StoryStore, start };
