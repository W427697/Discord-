const path = require('path');

module.exports = baseConfig => ({
  ...baseConfig,
  module: {
    ...baseConfig.module,
    rules: [
      ...baseConfig.module.rules,
      {
        test: [/\.stories\.tsx?$/, /index\.ts$/],
        loaders: [
          {
            loader: require.resolve('@storybook/addon-storysource/loader'),
            options: {
              parser: 'typescript',
            },
          },
        ],
        include: [path.resolve(__dirname, '../src'), path.resolve(__dirname, '../projects')],
        enforce: 'pre',
      },
    ],
  },
});
