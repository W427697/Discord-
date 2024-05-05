const { dirname } = require('path');
const resolveFrom = require('resolve-from');

const resolve = resolveFrom.bind(null, __dirname);

// These paths need to be aliased in the manager webpack config to ensure that all
// code running inside the manager uses the *same* version of react[-dom] that we use.
module.exports = {
  '@storybook/core/dist/channels': join(
    dirname(resolve('@storybook/core/package.json')),
    'dist/channels'
  ),
  '@storybook/components': dirname(resolve('@storybook/components/package.json')),
  '@storybook/core-events': join(
    dirname(resolve('@storybook/core/package.json')),
    'dist/core-events'
  ),
  '@storybook/manager-api': dirname(resolve('@storybook/manager-api/package.json')),
  '@storybook/manager': dirname(resolve('@storybook/manager/package.json')),
  '@storybook/core/dist/router': dirname(resolve('@storybook/router/package.json')),
  '@storybook/theming': dirname(resolve('@storybook/theming/package.json')),
  react: dirname(resolve('react/package.json')),
  'react-dom': dirname(resolve('react-dom/package.json')),
};
