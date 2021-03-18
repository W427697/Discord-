module.exports = {
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
  moduleNameMapper: {
    '@storybook/node-logger': '<rootDir>/../../lib/node-logger/dist/cjs/index.js',
  },
};
