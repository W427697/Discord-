/* eslint-disable import/namespace */
/* eslint-disable no-underscore-dangle */
import type * as MODULE from '../core-client';

const { ClientApi, StoryStore, start } = (globalThis as any)
  .__STORYBOOK_MODULE_CORE_CLIENT__ as typeof MODULE;

export { ClientApi, StoryStore, start };
