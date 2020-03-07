module.exports = {
  testEnvironment: 'node',
  transform: {
    '^.+\\.stories\\.[jt]sx?$': '@storybook/addon-storyshots/injectFileName',
    '^.+\\.[jt]sx?$': '../../scripts/babel-jest.js',
    '^.+\\.mdx$': '@storybook/addon-docs/jest-transform-mdx',
    '^.+\\.vue$': 'vue-jest'
  }
};
