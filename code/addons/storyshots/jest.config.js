const baseConfig = require('../../jest.config.browser');

module.exports = {
  ...baseConfig,
  snapshotSerializers: [...baseConfig.snapshotSerializers, 'enzyme-to-json/serializer'],
  transform: {
    ...baseConfig.transform,
    '^.+\\.stories\\.[jt]sx?$': '@storybook/addon-storyshots/injectFileName',
  },
  displayName: 'addons/storyshots',
};
