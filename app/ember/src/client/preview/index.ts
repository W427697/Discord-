import client from '@storybook/core/client';

import './globals';
import render from './render';

const { configure: coreConfigure, clientApi, forceReRender } = client.start(render);

export const {
  setAddon,
  addDecorator,
  addParameters,
  clearDecorators,
  getStorybook,
  raw,
} = clientApi;

const framework = 'ember';
export const storiesOf = (kind: string, m: NodeModule) =>
  clientApi.storiesOf(kind, m).addParameters({ framework });
export const configure = (loadable: any, m: NodeModule, showDeprecationWarning?: boolean) =>
  coreConfigure(framework, loadable, m, showDeprecationWarning);

export { forceReRender };
