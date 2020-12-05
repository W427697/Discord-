// @ts-ignore
import { defineComponent, h } from 'vue';
import type { ComponentOptions, Component } from 'vue3';
import { StoryFnVueReturnType } from '../types';
import { propsContainer } from './render';
import { extractProps } from '../util';

export function prepare(
  rawStory: StoryFnVueReturnType,
  innerStory?: ComponentOptions
): Component | null {
  let story: ComponentOptions;

  if (typeof rawStory === 'string') {
    story = { template: rawStory } as ComponentOptions;
  } else if (rawStory != null) {
    story = rawStory as ComponentOptions;
  } else {
    return null;
  }

  if (innerStory) {
    story.components = { story: innerStory };
    return story;
  }

  propsContainer.props = extractProps(story.props);

  return defineComponent({
    render() {
      return h(story, propsContainer.props);
    },
  });
}
