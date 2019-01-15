import { configure, addParameters } from '@storybook/angular';
import addCssWarning from '../src/cssWarning';

addCssWarning();

addParameters({
  options: {
    hierarchyRootSeparator: /\|/,
  },
});

/** configuration with using decorators @NgStoryModule and @NgStory */
function loadStoriesDecoratorConfig() {
  // put welcome screen at the top of the list so it's the first one displayed
  require('../src/stories-decorator-api/main');

  // automatically import all story ts files that end with *.stories.ts
  const req = require.context('../src/stories-decorator-api', true, /main\.ts$/);
  req.keys().forEach(filename => req(filename));
}

configure(loadStoriesDecoratorConfig, module);

/** Configuration */
function loadStories() {
  // put welcome screen at the top of the list so it's the first one displayed
  require('../src/stories');

  // automatically import all story ts files that end with *.stories.ts
  const req = require.context('../src/stories', true, /\.stories\.ts$/);
  req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);
