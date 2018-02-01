import { configure } from '@storybook/react';

if (process.env.NODE_ENV !== 'production') {
  require('react-error-overlay');
  require('react-dev-utils/webpackHotDevClient')
}

// automatically import all files ending in *.stories.js
const req = require.context('../stories', true, /.stories.js$/);
function loadStories() {
  req.keys().forEach((filename) => req(filename));
}

configure(loadStories, module);
