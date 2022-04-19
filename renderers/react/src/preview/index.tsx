/* eslint-disable prefer-destructuring */
import { start } from '@storybook/core-client';
import { ClientStoryApi, Loadable } from '@storybook/addons';

import './globals';
import { renderToDOM, render } from './render';
import { IStorybookSection } from './types';
import { ReactFramework } from './types-6-0';

interface ClientApi extends ClientStoryApi<ReactFramework['storyResult']> {
  setAddon(addon: any): void;
  configure(loader: Loadable, module: NodeModule): void;
  getStorybook(): IStorybookSection[];
  clearDecorators(): void;
  forceReRender(): void;
  raw: () => any; // todo add type
}
const framework = 'react';

const api = start(renderToDOM, { render });

// We need this for v6 compat (in `@storybook/react`? `@storybook/stories-of`?)
export const storiesOf: ClientApi['storiesOf'] = (kind, m) => {
  return (api.clientApi.storiesOf(kind, m) as ReturnType<ClientApi['storiesOf']>).addParameters({
    framework,
  });
};
// deprecate but don't remove (in `@storybook/stories-of`? `useForceReRender`? `context.forceReRender`?)
export const forceReRender: ClientApi['forceReRender'] = api.forceReRender;

// move people to the stories field in main.js
// export a function that throws a well-formatted error?
export const configure: ClientApi['configure'] = (...args) => api.configure(framework, ...args);

// use preview.js instead
// - runtime exports throw errors
// - automigrate converts to exports
//
// export const addDecorator: ClientApi['addDecorator'] = api.clientApi
//   .addDecorator as ClientApi['addDecorator'];
// export type DecoratorFn = Parameters<typeof addDecorator>[0];
// export const addParameters: ClientApi['addParameters'] = api.clientApi
//   .addParameters as ClientApi['addParameters'];
// export const clearDecorators: ClientApi['clearDecorators'] = api.clientApi.clearDecorators;

// delete this
// export const setAddon: ClientApi['setAddon'] = api.clientApi.setAddon;

// unintentionally deleted in 6.4
// export const getStorybook: ClientApi['getStorybook'] = api.clientApi.getStorybook;
// export const raw: ClientApi['raw'] = api.clientApi.raw;

// To opt out of `features.storyStoreV7`
// => `features.legacyStoriesOf`?
// - install `@storybook/stories-of` (autodetect?)
// storyStoreV7: false detection in v6 projects
