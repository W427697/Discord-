/* eslint-disable no-underscore-dangle */
import type * as MODULE from '../channels';

const { Channel } = (globalThis as any).__STORYBOOK_MODULE_CHANNELS__ as typeof MODULE;

export { Channel };
