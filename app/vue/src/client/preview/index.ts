/* eslint-disable prefer-destructuring */
import { start } from '@storybook/core/client';
import * as Vue from 'vue';
import {
  ClientStoryApi,
  StoryFn,
  DecoratorFunction,
  StoryContext,
  Loadable,
} from '@storybook/addons';

import './globals';
import { IStorybookSection, StoryFnVueReturnType } from './types';
import * as vue3 from './v3/index';
import * as vue2 from './v2/index';

const currentVue = Vue.version[0] === '3' ? vue3 : vue2;

const defaultContext: StoryContext = {
  id: 'unspecified',
  name: 'unspecified',
  kind: 'unspecified',
  parameters: {},
  args: {},
  argTypes: {},
  globals: {},
};

function decorateStory(
  storyFn: StoryFn<StoryFnVueReturnType>,
  decorators: DecoratorFunction[]
): StoryFn {
  return decorators.reduce(
    (decorated: StoryFn, decorator) => (context: StoryContext = defaultContext) => {
      let story;

      const decoratedStory = decorator(
        ({ parameters, ...innerContext }: StoryContext = {} as StoryContext) => {
          story = decorated({ ...context, ...innerContext });
          return story;
        },
        context
      );

      if (!story) {
        story = decorated(context);
      }

      if (decoratedStory === story) {
        return story;
      }

      return currentVue.prepare(decoratedStory, story as any);
    },
    (context) => currentVue.prepare(storyFn(context))
  );
}

const framework = 'vue';

interface ClientApi extends ClientStoryApi<StoryFnVueReturnType> {
  setAddon(addon: any): void;
  configure(loader: Loadable, module: NodeModule): void;
  getStorybook(): IStorybookSection[];
  clearDecorators(): void;
  forceReRender(): void;
  raw: () => any; // todo add type
  load: (...args: any[]) => void;
}

const api = start(currentVue.render, { decorateStory });

export const storiesOf: ClientApi['storiesOf'] = (kind, m) => {
  return (api.clientApi.storiesOf(kind, m) as ReturnType<ClientApi['storiesOf']>).addParameters({
    framework,
  });
};

export const configure: ClientApi['configure'] = (...args) => api.configure(framework, ...args);
export const addDecorator: ClientApi['addDecorator'] = api.clientApi.addDecorator;
export const addParameters: ClientApi['addParameters'] = api.clientApi.addParameters;
export const clearDecorators: ClientApi['clearDecorators'] = api.clientApi.clearDecorators;
export const setAddon: ClientApi['setAddon'] = api.clientApi.setAddon;
export const forceReRender: ClientApi['forceReRender'] = api.forceReRender;
export const getStorybook: ClientApi['getStorybook'] = api.clientApi.getStorybook;
export const raw: ClientApi['raw'] = api.clientApi.raw;
