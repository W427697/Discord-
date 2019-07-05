import { start } from '@storybook/core/client';
import { ClientStoryApi } from '@storybook/addons';

import './globals';
import render from './render';
import { IStorybookSection, StoryFnAngularReturnType } from './types';

interface ClientApi extends ClientStoryApi<StoryFnAngularReturnType> {
  setAddon(addon: any): void;
  configure(loaders: () => void, module: NodeModule): void;
  getStorybook(): IStorybookSection[];
  clearDecorators(): void;
  forceReRender(): void;
  raw: any; // todo add type
  load: any;
}

const { clientApi, configApi, forceReRender } = start(render);

export const {
  storiesOf,
  addDecorator,
  addParameters,
  setAddon,
  clearDecorators,
  getStorybook,
  raw,
  load,
}: ClientApi = clientApi;

export const { configure } = configApi;
export { forceReRender };
