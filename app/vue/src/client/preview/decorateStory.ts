import Vue, { ComponentOptions, VueConstructor } from 'vue';
import { StoryFn, DecoratorFunction, StoryContext } from '@storybook/addons';

import './globals';
import { StoryFnVueReturnType } from './types';

import { VALUES } from './render';
import { extractProps } from './util';

export const WRAPS = 'STORYBOOK_WRAPS';

function prepare(
  rawStory: StoryFnVueReturnType,
  innerStory?: VueConstructor
): VueConstructor | null {
  let story: ComponentOptions<Vue> | VueConstructor;

  if (typeof rawStory === 'string') {
    story = { template: rawStory };
  } else if (rawStory != null) {
    story = rawStory as ComponentOptions<Vue>;
  } else {
    return null;
  }

  // @ts-ignore
  // eslint-disable-next-line no-underscore-dangle
  if (!story._isVue) {
    if (innerStory) {
      story.components = { ...(story.components || {}), story: innerStory };
    }
    story = Vue.extend(story);
    // @ts-ignore // https://github.com/storybookjs/storybook/pull/7578#discussion_r307984824
  } else if (story.options[WRAPS]) {
    return story as VueConstructor;
  }

  return Vue.extend({
    // @ts-ignore // https://github.com/storybookjs/storybook/pull/7578#discussion_r307985279
    [WRAPS]: story,
    // @ts-ignore // https://github.com/storybookjs/storybook/pull/7578#discussion_r307984824
    [VALUES]: { ...(innerStory ? innerStory.options[VALUES] : {}), ...extractProps(story) },
    functional: true,
    render(h, { data, parent, children }) {
      return h(
        story,
        {
          ...data,
          // @ts-ignore // https://github.com/storybookjs/storybook/pull/7578#discussion_r307986196
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
  argTypes: {},
  globals: {},
};

function decorateStory(
  storyFn: StoryFn<StoryFnVueReturnType>,
  decorators: DecoratorFunction<VueConstructor>[]
): StoryFn<VueConstructor> {
  return decorators.reduce(
    (decorated: StoryFn<VueConstructor>, decorator) => (context: StoryContext = defaultContext) => {
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

export default decorateStory;
