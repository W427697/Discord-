import { StoryFnVueReturnType } from '../types';
import { VALUES } from './render';
import { extractProps } from '../util';

const Vue: any = require('vue').default;

export const WRAPS = 'STORYBOOK_WRAPS';

export function prepare(rawStory: StoryFnVueReturnType, innerStory?: any): any {
  let story: any;

  if (typeof rawStory === 'string') {
    story = { template: rawStory };
  } else if (rawStory != null) {
    story = rawStory;
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
    return story;
  }

  return Vue.extend({
    // @ts-ignore // https://github.com/storybookjs/storybook/pull/7578#discussion_r307985279
    [WRAPS]: story,
    // @ts-ignore // https://github.com/storybookjs/storybook/pull/7578#discussion_r307984824
    [VALUES]: { ...(innerStory ? innerStory.options[VALUES] : {}), ...extractProps(story) },
    functional: true,
    // @ts-ignore
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
