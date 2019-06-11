import { configure, addParameters, loadSvelteStories } from '@storybook/svelte3';

addParameters({
  options: {
    hierarchyRootSeparator: /\|/,
  },
});

function loadStories() {
  const req = require.context('../src', true, /\.stories\.svelte$/);
  loadSvelteStories(req);
}

configure(loadStories, module);
