function createProdPresets() {
  return [
    [
      require.resolve('babel-preset-minify'),
      {
        builtIns: false,
        mangle: false,
      },
    ],
  ];
}

export default ({ configType }) => {
  const isProd = configType === 'PRODUCTION';
  const prodPresets = isProd ? createProdPresets() : [];

  return {
    presets: [
      [
        require.resolve('@babel/preset-env'),
        {
          shippedProposals: true,
          useBuiltIns: 'usage',
          corejs: '3',
          modules: false,
          targets: {
            browsers: ['Chrome >= 52', 'Explorer 11'],
          },
        },
      ],
      ...prodPresets,
    ],
    plugins: [
      require.resolve('@babel/plugin-proposal-object-rest-spread'),
      require.resolve('@babel/plugin-proposal-class-properties'),
      require.resolve('@babel/plugin-syntax-dynamic-import'),

      /* commented this because it was adding labels multiple times, causing an error in IE11 since it doesn't allow the same property on the same object twice
         maybe we can re-enable after this: https://github.com/emotion-js/emotion/pull/1220 is completed
         this isn't all that important for users anyway */
      // [require.resolve('babel-plugin-emotion'), { sourceMap: true, autoLabel: true }],
      require.resolve('babel-plugin-macros'),
    ],
  };
};
