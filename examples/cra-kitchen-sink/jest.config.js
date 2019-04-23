const config = require('../../jest.config');

module.exports = {
  ...config,
  roots: [__dirname],
  // transform: {
  //   ...config.transform,
  //   '^.+\\.svg$': '<rootDir>/node_modules/react-scripts/config/jest/fileTransform.js',
  // },
  moduleDirectories: ['node_modules', '<rootDir>/node_modules', './src'],
};
