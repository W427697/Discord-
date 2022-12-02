/* eslint-disable prefer-destructuring */
import { start } from '@storybook/preview-api';
import type { Addon_ClientStoryApi, Addon_Loadable } from '@storybook/types';

import { render, renderToCanvas } from './render';
import type { ReactRenderer } from './types';

interface ClientApi extends Addon_ClientStoryApi<ReactRenderer['storyResult']> {
  configure(loader: Addon_Loadable, module: NodeModule): void;
  forceReRender(): void;
  raw: () => any; // todo add type
}
const FRAMEWORK = 'react';

const api = start<ReactRenderer>(renderToCanvas, { render });

export const storiesOf: ClientApi['storiesOf'] = (kind, m) => {
  return (api.clientApi.storiesOf(kind, m) as ReturnType<ClientApi['storiesOf']>).addParameters({
    framework: FRAMEWORK,
  });
};

export const configure: ClientApi['configure'] = (...args) => api.configure(FRAMEWORK, ...args);
export const forceReRender: ClientApi['forceReRender'] = api.forceReRender;
export const raw: ClientApi['raw'] = api.clientApi.raw;

// I added this temporarily, it should be removed, I only added it to debug the vite singleton module problem when running storybook in dev-mode
// eslint-disable-next-line no-underscore-dangle, @typescript-eslint/naming-convention
export const __DO_NOT_USE_OR_YOU_WILL_BE_FIRED_STORYSTOREV6_API__ = api;
