module.exports = {
  stories: ['../src/stories/**/*.stories.js', '../src/stories/**/*.stories.tsx'],
  logLevel: 'debug',
  addons: [
    '@storybook/addon-actions',
    '@storybook/addon-links',
    '@storybook/addon-a11y',
    '@storybook/addon-controls',
  ],
  core: {
    builder: 'webpack4',
  },
  features: {
    postcss: false,
  },
};
