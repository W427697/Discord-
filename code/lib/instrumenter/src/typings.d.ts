/* eslint-disable no-underscore-dangle, @typescript-eslint/naming-convention */
import type { State } from './types';
import type { Instrumenter } from './instrumenter';

declare global {
  interface Window {
    __STORYBOOK_ADDON_INTERACTIONS_INSTRUMENTER_STATE__: Record<string, State>;
  }
  var __STORYBOOK_ADDON_INTERACTIONS_INSTRUMENTER__: Instrumenter | undefined;
}
