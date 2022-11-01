import { start } from '@storybook/preview/dist/core-client';

import './globals';
import { renderToDOM } from './render';
import type { EmberFramework } from './types';

const { configure: coreConfigure, clientApi, forceReRender } = start<EmberFramework>(renderToDOM);

export const { raw } = clientApi;

const FRAMEWORK = 'ember';
export const storiesOf = (kind: string, m: any) =>
  clientApi.storiesOf(kind, m).addParameters({ framework: FRAMEWORK });
export const configure = (loadable: any, m: any) => coreConfigure(FRAMEWORK, loadable, m);

export { forceReRender };
