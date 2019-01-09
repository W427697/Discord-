const path = require('path');

module.exports = async ({ config }) => ({
  ...config,
  module: {
    ...config.module,
    rules: [
      ...config.module.rules,
      {
        test: /\.stories\.jsx?$/,
        use: require.resolve('@storybook/addon-storysource/loader'),
        include: [path.resolve(__dirname, './components')],
        enforce: 'pre',
      },
    ],
  },
});
