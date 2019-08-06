import Centered from './components/Centered.svelte';
import styles from './styles';
import json2CSS from './helpers/json2CSS';

const centeredStyles = {
  /** @type {string} */
  style: json2CSS(styles.style),
  /** @type {string} */
  innerStyle: json2CSS(styles.innerStyle),
};

/**
 * This functionality works by passing the svelte story component into another
 * svelte component that has the single purpose of centering the story component
 * using a wrapper and container.
 *
 * We use the special element <svelte:component /> to achieve this.
 *
 * @see https://svelte.technology/guide#svelte-component
 */
export default function(storyFn: () => any) {
  const story = storyFn();
  const isSvelteComponent = typeof story === 'function';
  if (isSvelteComponent) {
    const StoryPreview = storyFn();
    return class CenteredStory extends Centered {
      constructor(config: any) {
        super({
          ...config,
          props: {
            ...(config && config.props),
            ...centeredStyles,
            Child: StoryPreview,
          },
        });
      }
    };
  }
  const { Component: OriginalComponent, props, on } = story;
  return {
    Component: OriginalComponent,
    props,
    on,
    Wrapper: Centered,
    WrapperData: centeredStyles,
  };
}

if (module && module.hot && module.hot.decline) {
  module.hot.decline();
}
