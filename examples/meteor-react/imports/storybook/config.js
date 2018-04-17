/* eslint-disable */
import { configure } from '@storybook/react';

function loadStories() {
  require('../ui/Task.stories.js');
}

configure(loadStories, module);
