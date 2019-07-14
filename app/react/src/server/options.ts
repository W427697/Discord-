const packageJson = require('../../package.json');

export default {
  packageJson,
  frameworkPresets: [
    require.resolve('@storybook/renderer-react/dist/server/framework-preset-react.js'),
    require.resolve('./framework-preset-cra.js'),
    require.resolve('@storybook/renderer-react/dist/server/framework-preset-react-docgen.js'),
  ],
};
