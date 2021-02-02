module.exports = {
  stories: ['../src/stories/**/*.stories.@(ts|js)'],
  logLevel: 'debug',
  addons: [],
  webpackFinal: (webpackConfig) => {
    console.dir(webpackConfig, {
      depth: Infinity,
    });
    return webpackConfig;
  },
};
