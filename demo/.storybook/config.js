import { configure, setKindOrdering, setStoriesOrdering } from '@kadira/storybook';

setKindOrdering((a, b) => {
  console.log('a',a);
  console.log('b',b);
  return (a.index - b.index);
});

function loadStories() {
  require('../src/stories');
}

configure(loadStories, module);
