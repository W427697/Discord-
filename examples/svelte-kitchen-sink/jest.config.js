const config = require('../../jest.config');

module.exports = {
  ...config,
  roots: [__dirname],
  transform: {
    '.*\\.stories.svelte$': '@storybook/svelte/jest-transform',
    ...config.transform,
  },
  moduleNameMapper: {
    '!!raw-loader!.*': '<rootDir>/__mocks__/fileMock.js',
  },
  moduleFileExtensions: [...config.moduleFileExtensions, 'svelte'],
};
