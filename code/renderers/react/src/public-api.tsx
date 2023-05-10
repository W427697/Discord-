import { start } from '@storybook/preview-api';
import type { Addon_ClientStoryApi, Addon_Loadable } from '@storybook/types';

import { render, renderToCanvas } from './render';
import type { ReactRenderer } from './types';

interface ClientApi extends Addon_ClientStoryApi<ReactRenderer['storyResult']> {
  configure(loader: Addon_Loadable, module: NodeModule): void;
  forceReRender(): void;
  raw: () => any; // todo add type
}
const RENDERER = 'react';

let api: ReturnType<typeof start<ReactRenderer>>;
const lazyStart = () => {
  if (!api) api = start<ReactRenderer>(renderToCanvas, { render });
};

export const storiesOf: ClientApi['storiesOf'] = (kind, m) => {
  lazyStart();
  return (api.clientApi.storiesOf(kind, m) as ReturnType<ClientApi['storiesOf']>).addParameters({
    renderer: RENDERER,
  });
};

export const configure: ClientApi['configure'] = (...args) => {
  lazyStart();
  return api.configure(RENDERER, ...args);
};

export const forceReRender: ClientApi['forceReRender'] = () => {
  lazyStart();
  return api.forceReRender();
};

export const raw: ClientApi['raw'] = (...args) => {
  lazyStart();
  return api.clientApi.raw(...args);
};
