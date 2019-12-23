module.exports = {
  presets: [['babel-preset-rax', { development: process.env.BABEL_ENV === 'development' }]],
  plugins: [
    [
      '@babel/plugin-transform-runtime',
      {
        absoluteRuntime: false,
        corejs: false,
        helpers: true,
        regenerator: true,
        useESModules: false,
      },
    ],
  ],
};
