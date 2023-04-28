import type { Addon_ClientStoryApi, Addon_Loadable } from '@junk-temporary-prototypes/types';
import { start } from '@junk-temporary-prototypes/preview-api';

import { renderToCanvas, render } from './render';
import type { ServerRenderer } from './types';

const RENDERER = 'server';

interface ClientApi extends Addon_ClientStoryApi<ServerRenderer['storyResult']> {
  configure(loader: Addon_Loadable, module: NodeModule): void;
  forceReRender(): void;
  raw: () => any; // todo add type
}

const api = start<ServerRenderer>(renderToCanvas, { render });

export const storiesOf: ClientApi['storiesOf'] = (kind, m) => {
  return (api.clientApi.storiesOf(kind, m) as ReturnType<ClientApi['storiesOf']>).addParameters({
    renderer: RENDERER,
  });
};

export const configure: ClientApi['configure'] = (...args) => api.configure(RENDERER, ...args);
export const { raw } = api.clientApi;

export const { forceReRender } = api;
