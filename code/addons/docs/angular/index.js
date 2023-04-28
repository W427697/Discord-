/* eslint-disable no-underscore-dangle */
import { global } from '@junk-temporary-prototypes/global';

export const setCompodocJson = (compodocJson) => {
  // @ts-expect-error (Converted from ts-ignore)
  global.__STORYBOOK_COMPODOC_JSON__ = compodocJson;
};
