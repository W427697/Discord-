module.exports = {
  stories: [
    // '../src/**/*.stories.mdx',
    '../src/**/*.stories.@(js|jsx|ts|tsx)',
  ],
  addons: ['@storybook/addon-essentials'],
  framework: '@storybook/react-vite',
  features: {
    storyStoreV7: true,
  },
  docs: {
    docsPage: false, // set to false to disable docs page entirely
  },
};
