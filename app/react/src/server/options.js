import packageJson from '../../package.json';

export default {
  packageJson,
  frameworkPresets: [
    require.resolve('@storybook/addon-react/dist/server/framework-preset-react.js'),
    require.resolve('./framework-preset-cra.js'),
    require.resolve('@storybook/addon-react/dist/server/framework-preset-react-docgen.js'),
  ],
};
