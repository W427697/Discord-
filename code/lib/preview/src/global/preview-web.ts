/* eslint-disable no-underscore-dangle */
import type * as PREVIEW_WEB from '../preview-web';

const {
  DocsContext,
  Preview,
  PreviewWeb,
  composeConfigs,
  simulateDOMContentLoaded,
  simulatePageLoad,
} = (globalThis as any).__STORYBOOK_MODULE_PREVIEW_WEB__ as typeof PREVIEW_WEB;

export {
  DocsContext,
  Preview,
  PreviewWeb,
  composeConfigs,
  simulateDOMContentLoaded,
  simulatePageLoad,
};
