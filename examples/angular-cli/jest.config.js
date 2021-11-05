const path = require('path');
const config = require('../../jest.config');

const projectDir = path.join(__dirname, '../../');

module.exports = {
  preset: 'jest-preset-angular',
  resolver: 'jest-preset-angular/build/resolvers/ng-jest-resolver.js',
  transformIgnorePatterns: ['node_modules/(?!@angular)'],
  globals: {
    'ts-jest': {
      tsconfig: path.join(__dirname, 'src/tsconfig.spec.json'),
      stringifyContentPathRegex: '\\.html$',
    },
  },
  roots: [__dirname],
  transform: {
    '^.+\\.(ts|js|mjs|html|svg)$': 'jest-preset-angular',
    '^.+\\.stories\\.[jt]sx?$': '@storybook/addon-storyshots/injectFileName',
    '^.+\\.(ts|html)$': 'ts-jest',
    '^.+\\.jsx?$': path.join(projectDir, 'scripts/utils/jest-transform-js.js'),
    '^.+\\.mdx$': '@storybook/addon-docs/jest-transform-mdx',
  },
  moduleFileExtensions: [
    ...config.moduleFileExtensions,
    'html',
    'js',
    'json',
    'jsx',
    'node',
    'ts',
    'tsx',
  ],
  snapshotSerializers: [
    'jest-preset-angular/build/serializers/no-ng-attributes',
    'jest-preset-angular/build/serializers/ng-snapshot',
    'jest-preset-angular/build/serializers/html-comment',
  ],
  setupFilesAfterEnv: ['./jest-config/setup.ts'],
  testPathIgnorePatterns: ['app.component.spec.ts'],
};
