import { configure } from '@storybook/react';

import 'bootstrap/dist/css/bootstrap.css';
import '../src/css/main.css';

import { init } from '../.cache/navigation';

init();

function loadStories() {
  require('../src/stories');
}

configure(loadStories, module);
