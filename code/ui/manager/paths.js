const { dirname } = require('path');
const resolveFrom = require('resolve-from');

const resolve = resolveFrom.bind(null, __dirname);

// These paths need to be aliased in the manager webpack config to ensure that all
// code running inside the manager uses the *same* version of react[-dom] that we use.
module.exports = {
  '@junk-temporary-prototypes/addons': dirname(resolve('@junk-temporary-prototypes/addons/package.json')),
  '@junk-temporary-prototypes/channels': dirname(resolve('@junk-temporary-prototypes/channels/package.json')),
  '@junk-temporary-prototypes/components': dirname(resolve('@junk-temporary-prototypes/components/package.json')),
  '@junk-temporary-prototypes/core-events': dirname(resolve('@junk-temporary-prototypes/core-events/package.json')),
  '@junk-temporary-prototypes/manager-api': dirname(resolve('@junk-temporary-prototypes/manager-api/package.json')),
  '@junk-temporary-prototypes/manager': dirname(resolve('@junk-temporary-prototypes/manager/package.json')),
  '@junk-temporary-prototypes/router': dirname(resolve('@junk-temporary-prototypes/router/package.json')),
  '@junk-temporary-prototypes/theming': dirname(resolve('@junk-temporary-prototypes/theming/package.json')),
  react: dirname(resolve('react/package.json')),
  'react-dom': dirname(resolve('react-dom/package.json')),
};
