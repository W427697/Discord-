/* eslint-disable no-underscore-dangle */
/* global window */

const setCompodocJson = (compodocJson) => {
  // @ts-ignore
  window.__STORYBOOK_COMPODOC_JSON__ = compodocJson;
};

module.exports.setCompodocJson = setCompodocJson;
