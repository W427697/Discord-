module.exports = {
  compact: false,
  presets: [
    [
      '@babel/preset-env',
      {
        shippedProposals: true,
        useBuiltIns: 'usage',
        corejs: '3',
        targets: { node: '16' },
      },
    ],
  ],
  plugins: [
    '@storybook/babel-plugin-require-context-hook',
    'babel-plugin-dynamic-import-node',
    '@babel/plugin-transform-runtime',
  ],
};
