const config = require('../../jest.config');

const moduleNameMapper = Object.entries(config.moduleNameMapper).reduce(
  (acc, [k, v]) => (k.match(/(angular|storyshots)/) ? acc : Object.assign(acc, { [k]: v })),
  {
    '@storybook/angular$': '<rootDir>/app/angular/dist/client/index',
    '@storybook/addon-storyshots$': '<rootDir>/addons/storyshots/storyshots-core/dist',
    '@storybook/addon-storyshots-puppeteer$':
      '<rootDir>/addons/storyshots/storyshots-puppeteer/dist',
    'core-js/modules/es6.promise': 'core-js/modules/es.promise',
  }
);

module.exports = {
  preset: 'jest-preset-angular',
  ...config,
  globals: {
    __TRANSFORM_HTML__: true,
  },
  roots: [__dirname],
  moduleNameMapper,
  transform: {
    '^.+\\.jsx?$': '<rootDir>/scripts/babel-jest.js',
    '^.+\\.mjs$': '<rootDir>/scripts/babel-jest.js',
    '^.+[/\\\\].storybook[/\\\\]config\\.ts$': '<rootDir>/scripts/babel-jest.js',
    '^.+/examples/.+\\.(ts|html)$': '<rootDir>/node_modules/jest-preset-angular/preprocessor.js',
    '^.+/lib/.+\\.tsx?$': '<rootDir>/scripts/babel-jest.js',
    '^.+/addons/.+\\.tsx?$': '<rootDir>/scripts/babel-jest.js',
    // '^.+/app/.+\\.tsx?$': '<rootDir>/scripts/jest-ts-babel.js',
    // ...config.transform,

    // '^.+[/\\\\].storybook[/\\\\]config\\.ts$': '<rootDir>/scripts/jest-ts-babel.js',
    // '^.+\\.html$': '<rootDir>/node_modules/jest-preset-angular/preprocessor.js',
    // '^.+\\.ts$': '<rootDir>/node_modules/jest-preset-angular/preprocessor.js',
  },
  moduleFileExtensions: [...config.moduleFileExtensions, 'html'],
};
