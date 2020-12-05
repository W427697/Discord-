import { Component, ComponentOptions, defineComponent, h } from 'vue';
import { StoryFnVueReturnType } from './types';
import { propsContainer } from './render';

function getType(fn: Function) {
  const match = fn && fn.toString().match(/^\s*function (\w+)/);
  return match ? match[1] : '';
}

// https://github.com/vuejs/vue/blob/dev/src/core/util/props.js#L92
function resolveDefault({ type, default: def }: any) {
  if (typeof def === 'function' && getType(type) !== 'Function') {
    // known limitation: we don't have the component instance to pass
    return def.call();
  }

  return def;
}

function extractProps(component?: Component) {
  if (!component) return {};
  // @ts-ignore this options business seems not good according to the types
  return Object.entries(component.props || {})
    .map(([name, prop]) => ({ [name]: resolveDefault(prop) }))
    .reduce((wrap, prop) => ({ ...wrap, ...prop }), {});
}

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
