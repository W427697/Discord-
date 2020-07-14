import Vue, { VueConstructor, FunctionalComponentOptions } from 'vue';
import client from '@storybook/core/client';
import {
  ClientStoryApi,
  StoryFn,
  DecoratorFunction,
  StoryContext,
  Loadable,
} from '@storybook/addons';

import './globals';
import { VueOptions, IStorybookSection, StoryFnVueReturnType, VALUES, WRAPS } from './types';
import render from './render';
import { extractProps } from './util';

const isVueConstructor = (component: unknown): component is VueConstructor =>
  (component as VueConstructor)._isVue; // eslint-disable-line no-underscore-dangle

function prepare(rawStory: undefined, innerStory?: VueConstructor): undefined;
function prepare(rawStory: StoryFnVueReturnType, innerStory?: VueConstructor): VueConstructor;
function prepare(
  rawStory?: StoryFnVueReturnType,
  innerStory?: VueConstructor
): VueConstructor | undefined {
  if (!rawStory) {
    return undefined;
  }

  let story: VueOptions | VueConstructor =
    typeof rawStory === 'string' ? { template: rawStory } : rawStory;

  if (!isVueConstructor(story)) {
    if (innerStory) {
      story.components = { ...story.components, story: innerStory };
    }
    story = Vue.extend(story);
  } else if ((story.options as FunctionalComponentOptions)[WRAPS]) {
    return story;
  }

  return Vue.extend({
    [WRAPS]: story,
    [VALUES]: {
      ...(innerStory ? (innerStory.options as FunctionalComponentOptions)[VALUES] : undefined),
      ...extractProps(story),
    },
    functional: true,
    render(h, { data, parent, children }) {
      return h(
        story,
        {
          ...data,
          props: { ...(data.props || {}), ...parent.$root[VALUES] },
        },
        children
      );
    },
  });
}

const defaultContext: StoryContext = {
  id: 'unspecified',
  name: 'unspecified',
  kind: 'unspecified',
  parameters: {},
  args: {},
  globals: {},
};

function decorateStory(
  storyFn: StoryFn<StoryFnVueReturnType>,
  decorators: DecoratorFunction<VueConstructor>[]
): StoryFn<VueConstructor> {
  return decorators.reduce(
    (decorated: StoryFn<VueConstructor>, decorator) => (
      context: StoryContext = defaultContext
    ): VueConstructor => {
      let story;

      const decoratedStory = decorator(
        ({ parameters, ...innerContext }: Partial<StoryContext> = {}) => {
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

      return prepare(decoratedStory, story);
    },
    (context) => prepare(storyFn(context))
  );
}
const framework = 'vue';

interface ClientApi extends ClientStoryApi<StoryFnVueReturnType> {
  setAddon(addon: any): void;
  configure(loader: Loadable, module: NodeModule): void;
  getStorybook(): IStorybookSection[];
  clearDecorators(): void;
  forceReRender(): void;
  raw: () => ReturnType<typeof api.clientApi['raw']>;
  load: (...args: any[]) => void;
}

const api = client.start(render, { decorateStory });

export const storiesOf: ClientApi['storiesOf'] = (kind, m) => {
  return (api.clientApi.storiesOf(kind, m) as ReturnType<ClientApi['storiesOf']>).addParameters({
    framework,
  });
};

export const configure: ClientApi['configure'] = (...args) => api.configure(framework, ...args);
export const addDecorator: ClientApi['addDecorator'] = api.clientApi
  .addDecorator as ClientApi['addDecorator'];
export const addParameters: ClientApi['addParameters'] = api.clientApi
  .addParameters as ClientApi['addParameters'];

/* eslint-disable prefer-destructuring */
export const clearDecorators: ClientApi['clearDecorators'] = api.clientApi.clearDecorators;
export const setAddon: ClientApi['setAddon'] = api.clientApi.setAddon;
export const forceReRender: ClientApi['forceReRender'] = api.forceReRender;
export const getStorybook: ClientApi['getStorybook'] = api.clientApi.getStorybook;
export const raw: ClientApi['raw'] = api.clientApi.raw;
