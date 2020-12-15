/* eslint-disable prefer-destructuring */
import { start } from '@storybook/core/client';
import {
  ClientStoryApi,
  StoryFn,
  DecoratorFunction,
  StoryContext,
  Loadable,
} from '@storybook/addons';

import './globals';
import { Component, ComponentOptions, defineComponent, h } from 'vue';
import { IStorybookSection, StoryFnVueReturnType } from './types';
import { render } from './render';

const defaultContext: StoryContext = {
  id: 'unspecified',
  name: 'unspecified',
  kind: 'unspecified',
  parameters: {},
  args: {},
  argTypes: {},
  globals: {},
};

const PROPS = 'STORYBOOK_PROPS';

function prepare(story: StoryFnVueReturnType, innerStory?: ComponentOptions): Component | null {
  if (story == null) {
    return null;
  }

  if (innerStory) {
    return {
      ...story,
      components: { story: innerStory },
      props: innerStory.props,
      inject: {
        props: {
          from: PROPS,
          default: null,
        },
      },
      provide() {
        return {
          [PROPS]: this.props || this.$props,
        };
      },
    };
  }

  return defineComponent({
    props: story.props,
    inject: {
      props: {
        from: PROPS,
        default: null,
      },
    },
    render() {
      return h(story, this.props || this.$props);
    },
  });
}

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

      return prepare(decoratedStory, story);
    },
    (context) => prepare(storyFn(context))
  );
}

const framework = 'vue3';

interface ClientApi extends ClientStoryApi<StoryFnVueReturnType> {
  setAddon(addon: any): void;
  configure(loader: Loadable, module: NodeModule): void;
  getStorybook(): IStorybookSection[];
  clearDecorators(): void;
  forceReRender(): void;
  raw: () => any; // todo add type
  load: (...args: any[]) => void;
}

const api = start(render, { decorateStory });

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
export { app } from './render';
