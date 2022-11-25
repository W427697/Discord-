module.exports = {
  projects: [
    '<rootDir>/addons/*',
    '<rootDir>/builders/*',
    '<rootDir>/frameworks/!(angular)*',
    '<rootDir>/lib/*',
    '<rootDir>/renderers/*',
    '<rootDir>/ui/*',
  ],
  collectCoverage: false,
  collectCoverageFrom: [
    'addons/*/src/**/*.{js,jsx,ts,tsx}',
    'builders/*/src/**/*.{js,jsx,ts,tsx}',
    'frameworks/*/src/**/*.{js,jsx,ts,tsx}',
    'lib/*/src/**/*.{js,jsx,ts,tsx}',
    'renderers/*/src/**/*.{js,jsx,ts,tsx}',
    'ui/*/src/**/*.{js,jsx,ts,tsx}',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['lcov'],
  reporters: ['default', 'jest-junit'],
  watchPlugins: ['jest-watch-typeahead/filename', 'jest-watch-typeahead/testname'],
};
