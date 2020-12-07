import { defineComponent, h, ComponentOptions3, Component3 } from 'vue';
import { StoryFnVueReturnType } from '../types';
import { propsContainer } from './render';
import { extractProps } from '../util';

export const WRAPS = 'STORYBOOK_WRAPS';

export function prepare(
  rawStory: StoryFnVueReturnType,
  innerStory?: ComponentOptions3
): Component3 | null {
  let story: ComponentOptions3;

  if (typeof rawStory === 'string') {
    story = { template: rawStory } as ComponentOptions3;
  } else if (rawStory != null) {
    story = rawStory as ComponentOptions3;
  } else {
    return null;
  }

  if (innerStory) {
    story.components = { story: innerStory };
    return story;
  }

  propsContainer.props = extractProps(story.props);

  return defineComponent({
    [WRAPS]: story,
    render() {
      return h(story, propsContainer.props);
    },
  });
}
