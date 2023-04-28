/* eslint-disable no-underscore-dangle */
import { global } from '@junk-temporary-prototypes/global';

export const setJSONDoc = (jsondoc) => {
  global.__EMBER_GENERATED_DOC_JSON__ = jsondoc;
};
