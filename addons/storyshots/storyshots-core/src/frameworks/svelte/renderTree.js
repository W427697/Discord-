import { document } from 'global';

/**
 * Provides functionality to convert your raw story to the resulting markup.
 *
 * Storybook snapshots need the rendered markup that svelte outputs,
 * but since we only have the story config data ({ Component, data }) in
 * the Svelte stories, we need to mount the component, and then return the
 * resulting HTML.
 *
 * If we don't render to HTML, we will get a snapshot of the raw story
 * i.e. ({ Component, data }).
 */
function getRenderedTree(story) {
  const result = story.render();

  // We need to create a target to mount onto.
  const target = document.createElement('section');

  if (typeof result === 'function') {
    // svelte format stories (.stories.svelte)
    const Component = result;
    new Component({ target }); // eslint-disable-line
  } else {
    const { Component, props } = result;
    const DefaultCompatComponent = Component.default || Component;
    new DefaultCompatComponent({ target, props }); // eslint-disable-line
  }

  // Classify the target so that it is clear where the markup
  // originates from, and that it is specific for snapshot tests.
  target.className = 'storybook-snapshot-container';

  return target;
}

export default getRenderedTree;
