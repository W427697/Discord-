import { configure, setKindOrdering, setStoriesOrdering } from '@kadira/storybook';

setKindOrdering((a, b) => (a.index - b.index));

function loadStories() {
  require('../src/stories');
}

configure(loadStories, module);
