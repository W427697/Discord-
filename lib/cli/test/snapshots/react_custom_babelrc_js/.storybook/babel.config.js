module.exports = defaultConfig => ({
  ...defaultConfig,
  plugins: [
    ...defaultConfig.plugins,
    '@babel/plugin-proposal-optional-chaining'
  ],
});
