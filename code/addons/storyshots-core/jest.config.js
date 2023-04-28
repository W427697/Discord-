const path = require('path');
const baseConfig = require('../../jest.config.browser');

module.exports = {
  ...baseConfig,
  snapshotSerializers: [...baseConfig.snapshotSerializers, 'enzyme-to-json/serializer'],
  transform: {
    ...baseConfig.transform,
    '^.+\\.stories\\.[jt]sx?$': '@junk-temporary-prototypes/addon-storyshots/injectFileName',
  },
  displayName: __dirname.split(path.sep).slice(-2).join(path.posix.sep),
};
