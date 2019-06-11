const path = require('path');

module.exports = async ({ config }) => {
  // TODO support source addon
  // config.module.rules.push({
  //   test: [/\.stories\.svelte$/, /\.stories\.js$/, /index\.js$/],
  //   loaders: [require.resolve('@storybook/addon-storysource/loader')],
  //   include: [path.resolve(__dirname, '../src')],
  //   enforce: 'pre',
  // });
  return config;
};
