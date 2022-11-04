/* eslint-disable import/namespace */
/* eslint-disable no-underscore-dangle */
import type * as MODULE from '../preview-web';

const {
  DocsContext,
  Preview,
  PreviewWeb,
  composeConfigs,
  simulateDOMContentLoaded,
  simulatePageLoad,
} = (globalThis as any).__STORYBOOK_MODULE_PREVIEW_WEB__ as typeof MODULE;

export {
  DocsContext,
  Preview,
  PreviewWeb,
  composeConfigs,
  simulateDOMContentLoaded,
  simulatePageLoad,
};
