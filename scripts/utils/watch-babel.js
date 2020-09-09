const path = require('path');
const { babelify } = require('./compile-babel');

const modulePath = path.resolve('./');

babelify({
  modules: modulePath.includes('/lib/') || modulePath.includes('/addons/'),
  silent: false,
  // eslint-disable-next-line no-console
  errorCallback: () => console.error('Failed to compile js'),
});
