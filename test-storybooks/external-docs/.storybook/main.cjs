const config = {
  stories: [
    '../Introduction.mdx',
    {
      directory: '../components',
      titlePrefix: 'Demo',
      files: '**/!(Template).(stories.tsx|mdx)',
    },
  ],
  logLevel: 'debug',
  addons: ['@junk-temporary-prototypes/addon-essentials'],
  typescript: {
    check: true,
    checkOptions: {},
    reactDocgenTypescriptOptions: {
      propFilter: (prop) => ['label', 'disabled'].includes(prop.name),
    },
  },
  core: {
    channelOptions: { allowFunction: false, maxDepth: 10 },
  },
  features: {
    storyStoreV7: !global.navigator?.userAgent?.match?.('jsdom'),
    buildStoriesJson: true,
    warnOnLegacyHierarchySeparator: false,
    previewMdx2: true,
  },
  framework: '@junk-temporary-prototypes/react-webpack5',
};
module.exports = config;
