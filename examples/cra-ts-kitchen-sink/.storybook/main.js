const path = require('path');

module.exports = {
  stories: ['../src/**/*.stories.(mdx|[tj]sx?)'],
  addons: [
    '@storybook/preset-create-react-app',
    '@storybook/addon-docs',
    '@storybook/addon-actions',
    '@storybook/addon-links',
    '@storybook/addon-a11y',
  ],
};
