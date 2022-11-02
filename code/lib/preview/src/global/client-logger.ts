/* eslint-disable no-underscore-dangle */
import type * as MODULE from '../client-logger';

const { deprecate, logger, once, pretty } = (globalThis as any)
  .__STORYBOOK_MODULE_CLIENT_LOGGER__ as typeof MODULE;

export { deprecate, logger, once, pretty };
